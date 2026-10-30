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
