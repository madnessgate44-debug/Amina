# Production deploy proof — 2026-10-30

**Question answered:** is the upgraded app live, and does it behave?

## What was deployed

| Item | Value |
|---|---|
| PR | #68 `feat(teaching): ship the live teacher loop to production` |
| Merge commit on `main` | `c6656c9` |
| Vercel production deployment | READY, commit `c6656c9` |
| Public URL | https://amina-nine-sepia.vercel.app |
| Live bundle | `/assets/index-B25V1xyb.js` |

## Proof 1 — the live bundle is byte-identical to a local build of `main`

```
live  sha256(index-B25V1xyb.js) = 64f9e045463810fe6c1d44f33fdec2dc...
local sha256(index-B25V1xyb.js) = 64f9e045463810fe6c1d44f33fdec2dc...
MATCH
```

This proves the deployed code is exactly `main` @ `c6656c9`, not a stale or partial build.

## Proof 2 — the live app teaches (Playwright, 390x844, ar-EG)

Driven against **https://amina-nine-sepia.vercel.app** (not a local build):

1. Completed the real 4-step onboarding (name + girl + age 10 -> كمّل -> 3 warm-up questions -> subjects/style/length -> يلا نبدأ!).
2. Opened the feed (tab `الموجز`). A question reel rendered: Noor's line, the concept, 4 options, source page, `1 / 9`.
3. Tapped an answer. Observed:
   - `برافو! 🎉` (correct) and `تم تسجيل الدليل بنجاح (+5.3%)` — mastery evidence recorded
   - the next reel advanced automatically (`2 / 9`)
   - **0 console errors**

Screenshots: `artifacts/prod-verify/00-after-onboard.png`, `01-feed.png`, `02-answer.png`.

## Honest limits

- The **full-screen / TikTok-style** feed rebuild is **not** deployed. Today the reel uses 84% of the
  viewport (header 65px + nav 71px), contains no media, and has no voice turn-taking in the feed.
  That is the next work item, recorded in `docs/STATUS.md`.
- Headless Chromium has no audio device, so speech *calls* were confirmed, not audible output.
- Real-child usability was not tested.

## Scheduled follow-up

The automation `Miss Noor - autonomous owner window (9h)` (id `216fd7ae-94a1-4779-a3cd-e95b6053166b`,
cron `0 */2 * * *`) is enabled to continue this work. It reads and writes `docs/STATUS.md`.
Verified by API: the run list shows the cron firing every two hours; earlier runs failed on the
30-minute platform cap, which the new prompt is written to respect (one shippable unit per run).

_This report was prepared by an AI agent (OpenHands) on behalf of the repository owner._
