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
