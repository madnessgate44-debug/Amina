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
