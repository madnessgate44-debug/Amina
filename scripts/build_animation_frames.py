#!/usr/bin/env python3
"""Generate the photosynthesis animation frames.

The animation walks the *order* of photosynthesis by lighting each numbered
callout of the diagram in turn (1 sunlight -> 2 water -> 3 CO2 -> 4 leaf
factory -> 5 glucose -> 6 oxygen). The still diagram already carries the
numbered callouts, so the moving picture teaches sequence, not new content.

Output: <outdir>/frame_000.png, frame_001.png, ... (960x600).
"""
import sys
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
BASE = ROOT / "public" / "media" / "science" / "photosynthesis.png"

# Callout centres in the source SVG (960x600), in teaching order.
STAGES = [
    (120, 110),  # 1 sun
    (330, 560),  # 2 water
    (700, 210),  # 3 CO2
    (480, 230),  # 4 leaf factory (chlorophyll)
    (480, 310),  # 5 glucose
    (180, 215),  # 6 oxygen
]
HOLD_FRAMES = 2  # frames each stage stays lit
FADE = 6         # frames of trailing glow


def main(outdir: str) -> None:
    out = Path(outdir)
    out.mkdir(parents=True, exist_ok=True)
    base = Image.open(BASE).convert("RGBA")
    w, h = base.size
    frame_no = 0
    # timeline of (stage_index, intensity) per frame
    for i in range(len(STAGES)):
        for hold in range(HOLD_FRAMES):
            img = base.copy()
            glow = Image.new("RGBA", (w, h), (0, 0, 0, 0))
            gd = ImageDraw.Draw(glow)
            # trailing glow on earlier stages
            for j in range(max(0, i - 1), i + 1):
                age = i - j
                alpha = 150 if age == 0 else 60
                r = 58 if age == 0 else 42
                cx, cy = STAGES[j]
                gd.ellipse([cx - r, cy - r, cx + r, cy + r],
                           outline=(97, 91, 255, alpha), width=7)
            img = Image.alpha_composite(img, glow)
            img.convert("RGB").save(out / f"frame_{frame_no:03d}.png")
            frame_no += 1
    # final hold on the complete diagram
    for _ in range(FADE):
        base.convert("RGB").save(out / f"frame_{frame_no:03d}.png")
        frame_no += 1
    print(f"  frames {frame_no}")


if __name__ == "__main__":
    main(sys.argv[1])
