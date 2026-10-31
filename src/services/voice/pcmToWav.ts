/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Wraps the raw PCM a Gemini TTS model returns into a WAV the browser can play.
 *
 * The model returns headerless mono 16-bit little-endian PCM at a fixed sample
 * rate (see `TTS_SAMPLE_RATE`). It was served to the client labelled
 * `audio/wav`, so the browser tried to decode PCM as WAV and produced a short
 * click instead of speech — a real audio element that made no sound. Adding the
 * 44-byte RIFF header makes it genuinely playable, which is what lets the reel
 * show and replay a real `<audio>`.
 */

const HEADER_BYTES = 44;

/** Minimal WAV (RIFF/PCM) header for `dataBytes` of 16-bit PCM. */
export function wavHeader(dataBytes: number, sampleRate: number, channels = 1, bitsPerSample = 16): Buffer {
  const blockAlign = (channels * bitsPerSample) / 8;
  const byteRate = sampleRate * blockAlign;
  const header = Buffer.alloc(HEADER_BYTES);
  header.write('RIFF', 0, 'ascii');
  header.writeUInt32LE(36 + dataBytes, 4);
  header.write('WAVE', 8, 'ascii');
  header.write('fmt ', 12, 'ascii');
  header.writeUInt32LE(16, 16); // PCM fmt chunk size
  header.writeUInt16LE(1, 20); // audio format: PCM
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write('data', 36, 'ascii');
  header.writeUInt32LE(dataBytes, 40);
  return header;
}

/** Wrap base64 PCM into base64 WAV. Returns the input unchanged when empty. */
export function pcmBase64ToWavBase64(
  pcmBase64: string,
  sampleRate: number,
  channels = 1,
  bitsPerSample = 16
): string {
  if (!pcmBase64) return pcmBase64;
  const pcm = Buffer.from(pcmBase64, 'base64');
  const wav = Buffer.concat([wavHeader(pcm.length, sampleRate, channels, bitsPerSample), pcm]);
  return wav.toString('base64');
}
