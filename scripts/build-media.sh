#!/usr/bin/env bash
#
# Build the feed's educational media assets from their sources in media-src/.
#
# Every asset is produced from a source that is committed, so the output is
# reproducible and reviewable:
#   - diagrams / illustrations: SVG  -> PNG (rsvg-convert)
#   - animation:                SVG frames -> MP4 (ffmpeg, H.264)
#   - narration:                WAV via /api/tts (Gemini TTS), transcoded to MP3
#
# The rasterisers (rsvg-convert, ffmpeg) are build-time only; the shipped app
# loads the produced files from public/media/. Run from the repo root.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/media-src"
OUT="$ROOT/public/media"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

command -v rsvg-convert >/dev/null || { echo "MISSING rsvg-convert"; exit 2; }
command -v ffmpeg >/dev/null || { echo "MISSING ffmpeg"; exit 2; }

mkdir -p "$OUT/science" "$OUT/math" "$OUT/language" "$OUT/audio"

render_png() { # <svg> <out.png> <width> <height>
  rsvg-convert -w "$3" -h "$4" --background-color=none "$1" -o "$2"
  echo "  image  $(basename "$2")  $(wc -c <"$2") bytes"
}

echo "== images =="
render_png "$SRC/science/photosynthesis.svg"     "$OUT/science/photosynthesis.png"     960 600
render_png "$SRC/math/decimal_number_line.svg"   "$OUT/math/decimal_number_line.png"   960 420
render_png "$SRC/language/greetings_scene.svg"   "$OUT/language/greetings_scene.png"   960 600

# Keep the vector sources alongside the rasters so the feed can use SVG first
# (crisp at any density) and fall back to the PNG.
cp "$SRC/science/photosynthesis.svg"   "$OUT/science/photosynthesis.svg"
cp "$SRC/math/decimal_number_line.svg" "$OUT/math/decimal_number_line.svg"
cp "$SRC/language/greetings_scene.svg" "$OUT/language/greetings_scene.svg"

echo "== animation (photosynthesis light -> glucose) =="
# Frame sequence: light arrives, water rises, CO2 enters, glucose forms, O2 leaves.
# Each frame is a real stage of the process, so the animation teaches the order.
python3 "$ROOT/scripts/build_animation_frames.py" "$TMP/frames"
ffmpeg -y -hide_banner -loglevel error -framerate 2 -i "$TMP/frames/frame_%03d.png" \
  -c:v libx264 -pix_fmt yuv420p -movflags +faststart -vf "scale=960:600" \
  "$OUT/science/photosynthesis_animation.mp4"
echo "  video  photosynthesis_animation.mp4  $(wc -c <"$OUT/science/photosynthesis_animation.mp4") bytes"

# Poster = first frame (also the reduced-motion fallback).
cp "$TMP/frames/frame_000.png" "$OUT/science/photosynthesis_animation_poster.png"
echo "  poster photosynthesis_animation_poster.png"

echo "== done =="
