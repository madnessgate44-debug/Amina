#!/usr/bin/env python3
"""Generate narration audio for feed media via the Gemini TTS API.

Reads the narration table below, calls the same TTS models the server uses,
wraps the headerless PCM in a RIFF/WAVE header, and writes a WAV + MP3 into
public/media/audio/. The MP3 is what the app ships (small, broadly supported).

Requires GEMINI_API_KEY (the app's server key). Build-time only: the shipped
app loads the produced files, it never calls a model.
"""
import base64
import json
import os
import struct
import subprocess
import sys
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "media" / "audio"
MODELS = ["gemini-3.1-flash-tts-preview", "gemini-2.5-flash-preview-tts", "gemini-2.5-pro-preview-tts"]
VOICE_AR = "Kore"
VOICE_FR = "Aoede"
SAMPLE_RATE = 24000

# id -> (language, voice, text). Text matches the media item's narration.text.
NARRATION = {
    "sci_photosynthesis_ar": ("ar", VOICE_AR,
        "شاهدي كيف يصنع النبات غذاءه: ضوء الشمس، وماء من الجذور، وثاني أكسيد الكربون من الهواء، "
        "فتنتج الأوراق سكر الجلوكوز وتُطلق غاز الأكسجين."),
    "math_decimals_ar": ("ar", VOICE_AR,
        "على خط الأعداد، العدد أربعة من عشرة يساوي أربعين من مئة. "
        "الصفر بعد الفاصلة لا يغيّر القيمة."),
    "fr_salutations_fr": ("fr", VOICE_FR,
        "Bonjour ! Salut ! Comment tu t'appelles ? Je m'appelle Lina. Au revoir !"),
}


def pcm_to_wav(pcm: bytes, rate: int) -> bytes:
    n = len(pcm)
    header = b"RIFF" + struct.pack("<I", 36 + n) + b"WAVE"
    header += b"fmt " + struct.pack("<IHHIIHH", 16, 1, 1, rate, rate * 2, 2, 16)
    header += b"data" + struct.pack("<I", n)
    return header + pcm


def synth(model: str, text: str, voice: str, key: str) -> bytes:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={key}"
    body = {
        "contents": [{"role": "user", "parts": [{"text": text}]}],
        "generationConfig": {
            "responseModalities": ["AUDIO"],
            "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": voice}}},
        },
    }
    req = urllib.request.Request(url, data=json.dumps(body).encode(),
                                 headers={"Content-Type": "application/json"}, method="POST")
    with urllib.request.urlopen(req, timeout=120) as r:
        d = json.load(r)
    parts = d["candidates"][0]["content"]["parts"]
    for p in parts:
        inline = p.get("inlineData") or p.get("inline_data")
        if inline and inline.get("data"):
            return base64.b64decode(inline["data"])
    raise RuntimeError("no audio in response")


def main() -> int:
    key = os.environ.get("GEMINI_API_KEY") or os.environ.get("OHGeminiAPI")
    if not key:
        print("MISSING GEMINI_API_KEY", file=sys.stderr)
        return 2
    OUT.mkdir(parents=True, exist_ok=True)
    for mid, (lang, voice, text) in NARRATION.items():
        pcm = None
        for model in MODELS:
            try:
                pcm = synth(model, text, voice, key)
                print(f"  {mid}: {model} -> {len(pcm)} bytes PCM")
                break
            except urllib.error.HTTPError as e:
                print(f"  {mid}: {model} HTTP {e.code}", file=sys.stderr)
            except Exception as e:  # noqa: BLE001
                print(f"  {mid}: {model} {e}", file=sys.stderr)
        if not pcm:
            print(f"  {mid}: FAILED (no model produced audio)", file=sys.stderr)
            return 1
        wav = pcm_to_wav(pcm, SAMPLE_RATE)
        wav_path = OUT / f"{mid}.wav"
        mp3_path = OUT / f"{mid}.mp3"
        wav_path.write_bytes(wav)
        subprocess.run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error",
                        "-i", str(wav_path), "-codec:a", "libmp3lame", "-q:a", "5",
                        str(mp3_path)], check=True)
        wav_path.unlink()
        print(f"  wrote {mp3_path.name} ({mp3_path.stat().st_size} bytes)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
