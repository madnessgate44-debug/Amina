# Educational media system — verification report

Date: 2026-10-31
Branch: `feat/educational-media-system`
Base: `main` @ `eb20374`

## Outcome

The feed now carries real educational media — diagrams, an animation and
narration — presented by one reusable renderer, instead of only a canvas
schematic. Three lessons across science, maths and French are fully covered;
the contract and pipeline are reusable for the rest of the curriculum.

## What was built

| Layer | Artefact |
|---|---|
| Contract | `src/types/media.ts` (`EducationalMediaItem`, legend, hotspots, narration, provenance, review) |
| Catalog | `src/data/media/mediaCatalog.ts` (4 items bound to 3 lessons/concepts) |
| Renderer | `src/components/feed/ReelMedia.tsx` (image / video / audio / interactive) |
| Integration | `src/components/feed/ReelCard.tsx` (real media first, canvas fallback) |
| Pipeline | `scripts/build-media.sh`, `build_animation_frames.py`, `build-narration.py` |
| Sources | `media-src/{science,math,language}/*.svg` |
| Built assets | `public/media/{science,math,language,audio}/*` |
| Docs | `docs/design/EDUCATIONAL_MEDIA_SYSTEM.md` |

## Measured evidence (live app, headless Chromium, 390×844, ar-EG)

The app was served with `PORT=12000 NODE_ENV=production npx tsx server.ts` and a
synthetic Grade-5 profile was written into the same IndexedDB stores the app
uses (due reviews on the three target concepts). The feed was then walked reel
by reel.

| Reel content | Observed DOM |
|---|---|
| Science diagram | `<img src="/media/science/photosynthesis.svg">`, intrinsic 960×600, 7 hotspots 44×44, 6-entry bilingual legend, narration button |
| Science animation | `<video src="/media/science/photosynthesis_animation.mp4">`, 312×195 |
| Maths number line | `<img src="/media/math/decimal_number_line.svg">`, intrinsic 960×420, hotspot 44×44 |
| French illustration | `<img src="/media/language/greetings_scene.svg">`, intrinsic 960×600, narration button |

- Console errors across the whole walk: **0**.
- Hotspot tap: `aria-pressed` count went 0 → 1 on click; the legend row
  highlights (verified in `/tmp/hotspot-open.png`).
- Reduced motion: the video falls back to its poster when
  `prefers-reduced-motion: reduce`.

## Accessibility

`AMINA_PROFILES=phone-ar node scripts/ui-audit.mjs` over all 10 screens:
`smallestTapPx: 44`, `overflowXPx: 0`, `tinyText: []`, console errors 0.

One pre-existing defect was found and fixed: the voice-control `md` size was
40×40 (`src/components/voice/VoiceInputControl.tsx`), below the app's own 44px
floor. It is now 44×44; the audit confirms 44 on every screen.

## Tests

- New: `npm run test:media` — 14 checks (catalog integrity, asset presence,
  legend/hotspot completeness, curriculum binding, reachability, no-baked-words).
- Full suite `npm test`: every suite green, exit 0.

## Notes / limitations

- Image-generation models on the key are free-tier blocked (HTTP 429, limit 0),
  so assets are authored SVG + ffmpeg animation + real Gemini TTS, not
  generated photos. The catalog supports photos (`kind: 'photograph'`) when a
  generator becomes available.
- The catalogue currently covers three lessons; the contract and pipeline are
  the reusable capability, and adding a lesson is one SVG, one narration line
  and one catalog entry.
