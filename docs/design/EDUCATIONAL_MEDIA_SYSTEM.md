# Educational media system

The feed used to show a single `<canvas>` drawing derived from each reel's own
words. That is a schematic, not teaching material. This system adds a reusable
way to **produce** real educational media and **present** it in the feed, so a
lesson shows a real diagram, illustration, animation or narration.

## The three layers

```
media-src/            committed sources (SVG, narration text)
      │  scripts/build-media.sh
      ▼
public/media/         built assets (PNG, SVG, MP4, MP3) — served as-is
      │  src/data/media/mediaCatalog.ts
      ▼
src/components/feed/ReelMedia.tsx   one renderer, any media type
```

1. **Produce** — `scripts/build-media.sh` turns each committed source into a
   shipped asset. Nothing is hand-edited in `public/media/`; the source is the
   SVG in `media-src/`, so every asset is reproducible and reviewable.
2. **Catalogue** — `mediaCatalog.ts` binds each asset to a lesson + concept and
   carries the metadata that makes it teachable: a localized title, purpose and
   alt text, a curriculum reference, provenance and a review state.
3. **Present** — `ReelMedia` renders any item by its `type` (`image`, `video`,
   `audio`, `interactive`). A lesson never needs a bespoke component.

## Producing assets

```bash
bash scripts/build-media.sh                 # images + animation (rsvg-convert, ffmpeg)
GEMINI_API_KEY=… python3 scripts/build-narration.py   # narration (real TTS, WAV -> MP3)
```

Build-time tools (rsvg-convert, ffmpeg, Pillow, a TTS key) are **not** runtime
dependencies. The shipped app only loads the produced files.

## The media contract

`src/types/media.ts` defines `EducationalMediaItem`. The fields that matter:

- `lessonId` + `conceptId` — where the media appears; the feed looks it up by
  these, never by index.
- `reelKind` — which reel kind it attaches to (`teach_card`, `story_analogy`, …).
  If the kind is not present for that concept, the feed falls back to the item
  and, if there is no media at all, to the old canvas visual. Nothing regresses.
- `src` / `fallbackSrc` — SVG first (crisp at any density), PNG fallback.
- `title` / `purpose` / `alt` — localized; the alt text is a real description,
  not a filename.
- `legend` + `hotspots` — a numbered diagram becomes interactive for free:
  tapping a hotspot reveals its legend entry. The coordinates are normalised
  (0..1) so they survive any render size.
- `narration` — the exact words plus a pre-generated audio file.
- `source` + `review` — provenance and review state, so a diagram can be traced
  to the curriculum it came from.

## Right-to-left rule: no words baked into images

Arabic (and French) labels are never rasterised into a diagram. The SVG carries
only **numeric callouts** (`1`, `2`, `0.4`); the wording lives in the catalog's
localized `legend` and `alt`, and is rendered as HTML. A diagram therefore reads
correctly in Arabic, English and French without a separate asset per language.
The test suite asserts that no diagram contains letters.

## Accessibility

- Every image has meaningful localized `alt` text.
- Hotspots are real `<button>`s, at least 44×44 px, with a focus ring and an
  `aria-pressed` state; the active legend row is mirrored visually.
- Nothing signals meaning by colour alone: the numbers and the legend carry it.
- Video honours `prefers-reduced-motion` by falling back to its poster image.
- The narration player is a labelled button, not an autoplay-only element.

## Verification

- `npm run test:media` — catalog integrity, asset presence, legend/hotspot
  completeness, curriculum binding, reachability, and the no-baked-words rule.
- The live rendering (image load, hotspot tap, legend, video, narration) is
  exercised in a browser against the running app; see `docs/reports/`.

## Adding a lesson's media

1. Draw the diagram as a text-free SVG in `media-src/<subject>/`.
2. Add a narration line and generate its audio.
3. Run `scripts/build-media.sh` (and `build-narration.py`).
4. Add one `MEDIA_CATALOG` entry with a legend and (optionally) hotspots.
5. `npm run test:media` proves the binding and the assets.
