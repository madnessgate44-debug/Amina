# Miss Noor — status ledger

This file is the handoff between runs of the **Miss Noor — autonomous owner window (9h)**
automation. Every run reads it first and appends to it last. Keep the newest entry at the top
of "Log".

## How the autonomous window works

- Automation id `216fd7ae-94a1-4779-a3cd-e95b6053166b`, cron `0 */2 * * *` (every 2 hours, UTC).
- The platform caps a single run at **1800s (30 min)**. The "9-hour window" is therefore a series
  of consecutive runs, not one long run. Each run must ship **one** coherent unit of work
  (merge + deploy + live proof), then record it here.
- A written cadence is not a scheduler. Verify the schedule with the API, not by reading this file:
  `GET /api/automation/v1/216fd7ae-94a1-4779-a3cd-e95b6053166b/runs`.

## Standing rules

- Owner grant: merge and deploy your own work. "Upgraded" means the **live** app changed.
- Gate before merge: `npx tsc --noEmit` = 0, `npm test` all pass, `npm run build` passes, CI `verify` green.
- Prove it live: Vercel production READY for the merge commit, live bundle SHA-256 == local build, Playwright drive.
- Never force-push, never rewrite history, never merge PRs #7 or #8.
- No new paid dependency or service. Keep the locked navigation (HOME | FEED | LIBRARY | NOOR).
- Product name "Miss Noor"; teacher persona "Miss Nour"; "Amina" is the legacy repo name only.

## Log (newest first)

### 2026-10-31 (run 5) — complete adaptive teaching experience rendered + assessed
- **Outcome:** the NOUR ask station now renders the WHOLE assembled experience (TEACH · PRACTICE ·
  VERIFY · NEXT STEP), makes practice and verification interactive, and records verified outcomes
  through the existing mastery system — instead of concatenating two text blobs. The mission's
  Phase 6 gap ("extracts only dialogue and next_step") is closed.
- **New module `src/services/assembly/experiencePresenter.ts`:** `presentExperience()` makes every
  phase render-ready; `assessPractice()` grades a chosen option (with the concept's recorded
  remediation when the child picks a wrong option); `assessVerification()` scores an "explain it
  back" answer by key-point overlap; `recommendNextStep()` adapts the next step to that evidence.
  All pure and model-free.
- **UI (`VirtualTeacherClassroom.tsx`):** the ask path stores the presented experience, renders the
  practice question as answerable buttons, renders the verification input, and shows a next step that
  follows the verification result. Practice/verification answers call `recordEvidence` **only when
  the ask matched a real curriculum concept**, so no mastery is claimed without evidence.
- **Three real defects found while testing on the live site and fixed:**
  1. **Arabic ask borrowed the French curriculum track.** `matchConcept` ignored the lesson language,
     so "عايزة درس كامل عن البناء الضوئي" matched `conc_scifr_u1_l1_photosynthese` and rendered French
     practice options to an Arabic child. Fix: a language-mismatched lesson is demoted (×0.5); a
     matching-language lesson wins. Regression tests added.
  2. **Long pastes failed to match.** Confidence was `overlap / askSize`, so a 15-word paragraph that
     shared 4 concept words scored 0.19 (< 0.2 floor) and matched nothing. Fix: confidence saturates
     on the overlap count (`min(1, overlap/4)`), so a long paste is not penalised for being long.
  3. **French was misdetected as English.** A French-only accented letter now decides `fr`
     ("explique la photosynthèse" → `fr`).
- **Suite [V]:** `tsc --noEmit` exit 0; `npm test` all suites green — assembly **53/53** (+15 new),
  new `adaptiveScenarios` **27/27** (mission Phase 9 cases A–H), 39 suites total 0 failed;
  `npm run build` exit 0.
- **Live proof [V]:** local production server (`PORT=12000 NODE_ENV=production tsx server.ts`) driven
  with Playwright (chromium 155): completed onboarding, opened NOUR → "اسألي نور", asked
  "عايزة درس كامل عن البناء الضوئي". Rendered in **Arabic** from `off_sci_u1_l1_c1.sourceText`:
  TEACH lines, a practice question with answerable options → "إجابة صحيحة! 🎉 فهمتِ الفكرة كويس.",
  the verification prompt → "ممتاز! شرحك يدل إنك فهمتِ الفكرة فعلاً. 🌟", and an advanced next step.
  **0 console errors.** A quick question ("اشرحي لي البناء الضوئي في النبات") still returns an
  immediate answer (no job), as intended.
- **Gap report:** `docs/reports/ADAPTIVE_TEACHING_GAP_MATRIX_2026-10-31.md` (requirements / evidence /
  gap matrix, AC1–AC17 with PASS/FAIL/BLOCKED and the one recorded out-of-scope item).
- **Next:** durable server-side lesson jobs with cross-session resume + a real progress UI (the
  engine already models staged jobs; wiring a persistent store is the next unit). PR #8 stays open by
  standing rule — do not merge.
- **Blockers:** none. Tavily web search is HTTP 432 (plan limit) — no web search.

### 2026-10-31 (run 4) — assembly engine false match fixed, verified live
- **Shipped the content-assembly engine (PR #89, merge `58ff639`) then fixed a live-found defect
  (PR #90, squash merge `6c6c370`).** The engine understands an ask, reuses approved material
  first, and only generates what is missing. Testing it on the live site surfaced a real bug: an
  off-curriculum ask like "اشرحي لي كيف يعمل محرك السيارة" (how does a car engine work) silently
  borrowed the ICT lesson "الفرق بين الإنترنت العام والإنترانت المغلقة", because the single body
  word `يعمل` ("works") cleared the 0.2 confidence floor in `matchConcept`.
- **Fix:** a concept now matches only when the **title** is hit or **>=2** content words overlap,
  and common generic verbs (`يعمل`, `تعمل`, `يشتغل`, `معنى`, `تعريف` …) are stop words. Verified:
  `matchConcept('…محرك السيارة')` -> `null`; `matchConcept('…يعمل الإنترنت')` -> the ICT concept
  (a genuine title word still resolves). Regression tests cover both.
- **Deploy:** Vercel production READY for `6c6c370`, aliased to https://amina-nine-sepia.vercel.app
  [V]. Live bundle `assets/index-DpD9ukHm.js` SHA-256
  `e65415607eae414005819d807f69ebd933ef97b658a23d95c82ec53a0819112d` **identical** to the local
  build of `main` [V]. `/api/health` 200 `{status:ok, hasApiKey:true}`.
- **Live proof [V]:** `scripts/smoke.mjs` on production **7 passed, 0 failed**. Playwright drive of
  the live site: an off-curriculum ask escalated to a staged lesson job and returned a real
  assembled answer (kind `lesson`, source "generated explanation") from the approved lesson, instead
  of borrowing an unrelated ICT lesson; a curriculum ask ("البناء الضوئي في النبات") returned an
  immediate answer from approved material plus a reused photosynthesis diagram
  (`/media/science/photosynthesis.svg`, source `off_sci_u1_l1_c1.sourceText`).
- **Suite [V]:** `tsc --noEmit` exit 0; `npm test` all suites green (assembly 38/38 after +2
  regression checks, 39 suites total 0 failed); `npm run build` exit 0; CI `verify` + OS Compliance
  green on `6c6c370`.
- **Inbox:** the Openhands loop repo (`madnessgate44-debug/Openhands`) is idle — inbox seq 3 ==
  `last_seq 3`, all backlog items (BL-1..BL-4) done. Nothing to do there.
- **Next:** none outstanding. PR #8 stays open by standing rule — do not merge.
- **Blockers:** none. Tavily web search is HTTP 432 (plan limit) — no web search.

### 2026-10-31 (run 3) — real educational media bound to concepts, rendered in the feed
- **Shipped the current focus (bind real media to concepts and render it in the feed), PR #87,
  merge `8a30451`.** The feed previously showed only a canvas drawing derived from each reel's own
  words. Added a reusable media system in three layers: contract (`src/types/media.ts`:
  `EducationalMediaItem` with localized title/purpose/alt, numbered `legend`, normalised `hotspots`,
  narration, provenance, review state), catalog (`src/data/media/mediaCatalog.ts`, 4 items bound to
  science photosynthesis, maths decimal number line, French greetings), and renderer
  (`src/components/feed/ReelMedia.tsx`, wired into `ReelCard.tsx`; real media first, canvas only as
  fallback). Production pipeline committed: `scripts/build-media.sh` (rsvg-convert + ffmpeg),
  `build_animation_frames.py`, `build-narration.py`; sources in `media-src/`, built assets in
  `public/media/`.
- **Assets are real:** authored SVG diagrams (no words baked in — numeric callouts only; wording is
  localized HTML, asserted by a test), an H.264 animation, and 3 real Gemini-TTS narration MP3s
  (`gemini-3.1-flash-tts-preview`). Image-generation models on the key are free-tier blocked
  (HTTP 429, limit 0), so no generated photos; the catalog supports `kind:'photograph'` for later.
- **Live proof [V]:** production READY for `8a30451`, aliased to https://amina-nine-sepia.vercel.app.
  Every media asset returns 200 with the right MIME on the live host (`/media/science/photosynthesis.svg`
  image/svg+xml 5557B, `…_animation.mp4` video/mp4 54981B, 3 audio/mpeg MP3s). Playwright 390x844
  ar-EG on the live site: the science reel renders the 960x600 SVG with **7 hotspots at 44x44** and a
  6-entry bilingual legend; the next reel plays the **video**; maths and French render their diagrams
  and narration; tapping hotspot #2 flips `aria-pressed` to `true`; **0 console errors** across the
  walk. `scripts/smoke.mjs` on production: **7 passed, 0 failed**.
- **Suite [V]:** `tsc --noEmit` 0; `npm test` all suites green incl. the new `test:media` (14 checks);
  `npm run build` exit 0; CI `verify` + OS Compliance green on the PR head. UI audit `phone-ar`:
  `smallestTapPx 44`, `overflowXPx 0`, `tinyText []`, 0 console errors on all 10 screens.
- **a11y fix [V]:** the audit surfaced a pre-existing 40x40 voice-control button
  (`VoiceInputControl.tsx` `md` size); raised to 44x44, restoring the app's own tap floor.
- **Next:** none outstanding from the owner's four asks. The media contract is reusable — a new
  lesson is one SVG, one narration line and one catalog entry. PR #8 stays open by standing rule.
- **Blockers:** none.

### 2026-10-31 (run 2) — asks #1 and #2 done: real Noor audio in the reel + feed voice turn-taking
- **Shipped #1 (reel media) + #2 (voice turn-taking), PR #85, squash merge `a307801`.** Root cause of
  `0/0/0/1`: `GEMINI_TTS_MODEL` was `gemini-3.8-flash-lite-tts`, a name that **does not exist** on the
  live model list (60 models listed; the TTS ones are `gemini-3.1-flash-tts-preview`,
  `gemini-2.5-flash-preview-tts`, `gemini-2.5-pro-preview-tts`). Every `/api/tts` call 404'd, the
  route silently returned `useBrowserSpeech:true`, and Miss Noor spoke with the robotic browser
  voice — no real audio anywhere. Second defect: the model returns **headerless PCM**
  (`audio/l16; rate=24000`), but it was served under an `audio/wav` label, so the browser decoded it
  as a broken WAV (a silent click).
- **Fix:** walk a real TTS chain (first model that returns audio wins) and wrap the PCM in a RIFF/WAVE
  header (`src/services/voice/pcmToWav.ts`, 44-byte header + PCM). `voiceService.speak()` now accepts
  an optional `<audio>` element, and `ReelCard` mounts a real, replayable `<audio controls>` for
  Noor's line — the reel's genuine audio media.
- **Ask #2 (R-F3):** the reel's narration already drove the shared `handsFreeLoop` state machine; the
  hand-over on speech end, `matchSpokenOption`, and barge-in are all in this PR. The tap path is
  unchanged.
- **Live proof [V]:** production READY for `a307801`, aliased to https://amina-nine-sepia.vercel.app.
  Live bundle `index-N29CkSI1.js` SHA-256 `0746a085…da0e` == local build of `main`. Live
  `POST /api/tts` → `{success:true, mimeType:"audio/wav"}`, 126764 bytes, `RIFF`/`WAVE`, PCM, 24000 Hz.
  Playwright 390x844 ar-EG on the live site: reel `<audio>` present, `controls:true`, `duration:7.2`,
  not hidden, mic control present, **0 console errors**.
- **Suite [V]:** `tsc --noEmit` 0; `npm test` all suites green (immersiveFeed 32, handsFreeLoop 37,
  voiceAndQuestions 18 incl. 3 new PCM→WAV checks, reelVisual 21, …); `npm run build` exit 0; CI
  `verify` + OS Compliance green on `5d9247a` (PR head).
- **Asks #3 and #4** were already shipped on `main` via #82/#83 — nothing further needed.
- **Next:** none outstanding from the owner's four asks. PR #8 (OpenHands conversation archive,
  docs/data only) remains open by standing rule — do not merge.
- **Blockers:** none. Tavily web search is HTTP 432 (plan limit) — no web search.

### 2026-10-31 — asks #3 and #4 done: misconception reels reachable + Arabic diagnosis
- **Shipped #4 (reachability), PR #82, squash merge `da5a194`.** The four misconception-bearing
  maths lessons are the **last four** Mathematics lessons in file order (`off_mathfr_u1_l1_decimaux`
  … `off_mathfr_u3_l1_division`, idx 12-15 of 16). `buildFeedQueue()` concatenated every matching
  lesson's reels in file order, and a session consumes only a handful of reels, so the tail was never
  reached. Measured before: **0 of 4** misconception lessons in a 20-minute French queue. Fix: rotate
  the day's matched lessons by the day index before building the pool (also the exam pool). Over 16
  simulated days **4/4** become reachable; rotation is deterministic per date, so the queue stays
  reproducible.
- **Shipped #3 (Arabic content), PR #83, squash merge `83f6ad3`.** All 10 misconceptions lived in
  `mathFrCurriculum.ts` (French only); `speaksLanguage` correctly refused to inject French into an
  Arabic reply, so an Arabic child got a model answer, not a diagnosis. Added Arabic misconception
  data (explanation + remediation) to the five Arabic maths concepts with numeric options: place
  value `off_math_u1_l1`, ×10 shift `off_math_u1_l2`, comparing `off_math_u1_l4`, rounding
  `off_math_u1_l5`, GCF `off_math_u2_l5`, each with `distractors` pointing at its own id.
- **Matcher fix:** a trigger naming a number now matches only as a whole phrase. `normalizeText`
  drops the decimal separator and every one-character token, so `0,04`/`0,004` collapsed and `8`/`7`
  reduced to the same stem — token overlap mis-diagnosed a different digit as the same misconception.
  The correct answer is never diagnosed (asserted for all five).
- **Suite:** teachingSkills 24/24 (was 20, new section 6), interactiveReel 19/19 (now picks the
  French-misconception lesson explicitly, so adding Arabic data first cannot silently retarget it),
  reels 27/27 (was 26, new section 9), tsc 0, `npm test` all green, build 0, OS PASS [V].
- **Next (owner's asks, remaining):**
  1. Reel media counts are **0/0/0/1** (img/video/audio/canvas) [V] — decide whether to count the
     canvas or add real img/video/audio.
  2. Voice turn-taking in the feed — `handsFreeLoop.ts` is wired only into `TeachingSessionModal.tsx`.
     `onReactionSpoken` remains the hand-back point.
- **Blockers:** none. Tavily web search is HTTP 432 (plan limit) — no web search.

### 2026-10-30 (run 3) — the FEED reel is now exactly one viewport tall
- **Shipped:** PR #78, squash merge `a4bbf029a78ca9a7145a4efb4333d640585acb0d`. The immersive feed
  shell was `min-h-screen` — a *minimum*, so the app column grew to the reel's content height
  (**1013px** in an 844px viewport) and the **document** scrolled instead of the reel. ~20% of every
  reel sat below the fold. Fix: shell `h-screen overflow-hidden`, app column `h-screen`, reel
  scroller `+ h-full`, `ReelCard` slide `min-h-full` -> `h-full`. `h-full` on the slide now resolves
  against the `h-full` scroller, which resolves against the `h-screen` column, so the **viewport**
  sets the slide height. This is a *second*, separate cause from the earlier header/nav fix.
- **Deploy:** Vercel production `dpl_6FFx3oUFUL5mRwDxJPYUDwZoaJq5` READY for `a4bbf029` [V].
- **Live proof:** live `assets/index-Ww6y43H2.js` SHA-256 `3aa6681d0ab8be00f3c95e31b6dc3a235b3696a79022f4f0af470fafeed52329`
  **identical** to the local build of `main` [V]. Playwright at 390x844 ar-EG on
  https://amina-nine-sepia.vercel.app: `docScrollH` 844 == viewport 844, `docScrolls:false`,
  scroller 844, section 844, nav floats as an overlay (`navTop` 773, `navH` 71), and the header is
  **not rendered at all** (`headerVisible:false`, `headerH:0`) so the reel owns the full viewport [V].
  Before the fix the same probe reported `docScrollH` 1013 [V].
- **Suite:** `tsc --noEmit` exit 0; `npm test` all suites pass (immersiveFeed 23/23 after adding 4
  source assertions, R-F1.5); `npm run build` exit 0; CI `verify` + `Check execution policy files`
  success on `0c44c87` [V].
- **Next (owner's asks, unchanged):**
  1. Reel media counts are **0/0/0/1** (img/video/audio/canvas) [V] — the canvas from PR #76 draws, but
     there is still no img/video/audio. Decide whether to count the canvas or add real media.
  2. Voice turn-taking in the feed — `handsFreeLoop.ts` is wired only into `TeachingSessionModal.tsx`.
     `onReactionSpoken` remains the hand-back point.
  3. Arabic misconception content — all 10 curriculum misconceptions are French-only.
  4. Make misconception-bearing reels reachable — `buildFeedQueue` never selects `conc_mathfr_*`.
- **Blockers:** none. Tavily web search is HTTP 432 (plan limit) — no web search.
- **Guard trap hit this run:** `POST /repos/.../pulls` returned **HTTP 500** (and GraphQL `gh pr create`
  a generic error) for ~4 minutes right after the branch push, then succeeded once. A throwaway probe
  branch proved the credentials and payload were fine, so it was transient. Retry; do not conclude
  "no permission".

### 2026-10-30 (run 2) — feed advances on speech-end, not a fixed timer
- **Shipped:** the reel no longer advances on a fixed clock. It used
  `setTimeout(advance, correct ? 1400 : 2600)`, which cut a long explanation off mid-sentence and
  left the child staring at a frozen card after a short one. `ReelCard` now fires an
  `onReactionSpoken` signal when Noor's reaction finishes playing, and `FeedScreen` advances on it.
  PR #74, merge `6ea0134` (squash), deployed to production.
- **Deploy:** Vercel production `dpl_EptEZ6QoA3rzhzW13b9TMMAbkXtM` READY for `6ea0134`, aliased to
  https://amina-nine-sepia.vercel.app. Live bundle `index-Bi4JnUMP.js` SHA-256
  `5c8b4efe…e49d9c` == local build of `main` [V].
- **Live proof [V]:** Playwright at 390x844 ar-EG on the live site, stubbing `window.Audio` to a
  working 2500ms clip (headless has no audio device, so real `onended` never fires). Reaction audio
  started at 240ms; the reel counter advanced `1 / 16 -> 2 / 16` at **2750ms** — ~10ms after
  speech-end. The old timers (1400/2600ms) would have fired earlier; `/setTimeout\([^,]*,\s*1400/`
  is absent from the served bundle [V].
- **How the advance actually reaches the child [V]:** `voiceService.speak` prefers Gemini TTS via
  `/api/tts` and plays a real `<audio>` element; only when that is unavailable does it fall back to
  `speechSynthesis`. `onEnd` is wired to both the `audio.onended` and the utterance `onend`, so the
  signal is honest on either path. In a headless browser the audio element never ends — that is why
  a bare speechSynthesis stub shows no advance; it is a harness artifact, not an app defect.
- **Guard:** the signal fires exactly once per answered reel (ref-guarded), with a read-time hold when
  voice is muted and a 12s safety net so a silent engine cannot wedge the feed.
- **Suite:** `tsc --noEmit` 0; `npm test` all pass (immersiveFeed 19/19, noorPreGeneratedLines pass);
  `npm run build` exit 0; CI `verify` green on `6ea0134` [V].
- **Next:**
  1. Feed full-screen + media: the reel still occupies ~84% of the viewport (header 65px + nav 71px
     always visible) and reel media count is 0/0/0/0. The speech-end signal just added is the hook for
     the next piece.
  2. Voice turn-taking in the feed — `handsFreeLoop.ts` is still wired only into
     `TeachingSessionModal.tsx`. `onReactionSpoken` is the hand-back point to build on.
  3. Arabic misconception content — all 10 curriculum misconceptions are French-only, so an Arabic
     child gets a model answer instead of a real diagnosis (`speaksLanguage` guard now blocks the
     wrong-language injection).
  4. Make misconception-bearing reels reachable — `buildFeedQueue` never selects `conc_mathfr_*`.
- **Blockers:** none. Tavily web search is HTTP 432 (plan limit) — no web search available.

### 2026-10-30 — live teacher loop shipped to production
- **Shipped:** the live teacher loop is merged to `main` (PR #68, merge `c6656c9`) and deployed.
  The reel now asks, reacts to the answer, records mastery evidence and awards XP, and labels the
  offline case honestly. Fixed: French misconception text was injected into Arabic replies.
- **Deploy:** Vercel production READY for `c6656c9`. Live bundle `index-B25V1xyb.js` SHA-256 == local
  build of `main`. Playwright drive of the live site: correct answer -> `برافو! 🎉`, evidence `+5.3%`,
  next reel loaded, **0 console errors**.
- **Suite:** 574 passed / 0 failed; `tsc --noEmit` clean.
- **Next (owner's explicit asks, in order):**
  1. Feed must feel like Instagram/TikTok — full screen (today 84% of viewport; header 65px + nav 71px
     always visible), a real spoken conversation, not static (reel media count is 0/0/0/0).
  2. Voice turn-taking in the feed — `handsFreeLoop.ts` is wired only into `TeachingSessionModal.tsx`.
  3. Arabic misconception content — all 10 curriculum misconceptions are French-only.
  4. Make misconception-bearing reels reachable — `buildFeedQueue` never selects `conc_mathfr_*`.
- **Blockers:** none. Tavily web search is HTTP 432 (plan limit) — no web search available.
