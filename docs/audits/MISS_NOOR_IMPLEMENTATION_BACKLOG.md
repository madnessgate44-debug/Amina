# Miss Noor — Implementation Backlog (ordered, actionable)

**Audit date:** 2026-11-18 (UTC)
**Baseline commit:** `main` = `883127facf34e256e7490a48622b9d14c695f6a3`
**Companion audit:** `docs/audits/MISS_NOOR_INDEPENDENT_AUDIT.md`
**Handover:** `docs/audits/BLIND_SNIPER_HANDOVER.md`

Each ticket is self-contained and references evidence from the audit's Verification Ledger
(`L1`–`L28`). Complexity: **S** (≤1h), **M** (half day), **L** (multi-day).
All tickets are feasible at **$0** — no ticket requires a paid service, a card, or a new
dependency.

Priority order is top-to-bottom. Do not start a lower ticket before the ones above it that it
depends on are merged, unless explicitly re-prioritised.

---

## MN-001 — P0 — Treat timeouts and deadline errors as "try the next model"

**Problem.** When the first model in the chain is slow or returns a deadline error, the chain
aborts instead of falling through, so the child hears scripted fallback text even though models
2–4 would answer. This is the core "no real teacher" outage class.

**Evidence.** Audit F1; ledger L7 (1 of 10 live chats degraded), L8 (2 of 3 isolated probe runs
threw `504 DEADLINE_EXCEEDED` after ~19s), L9 (`isModelUnavailable(504) → false`,
`isModelUnavailable(AbortError) → false`).

**Exact affected files.**
- `src/services/ai/geminiModel.ts` — `isModelUnavailable` (lines 82–96) and
  `generateContentWithFallback` (lines 117–138, `throw` at line 135).

**Required outcome.** A model that times out or returns `504` / `DEADLINE_EXCEEDED` /
`AbortError` / `ETIMEDOUT` must cause the chain to advance to the next model. Only genuinely
non-retryable errors (400, 401, 403, content-safety blocks) may abort the chain.

**Acceptance criteria.**
1. `isModelUnavailable({ status: 504 })` is `true`.
2. `isModelUnavailable({ status: 504, message: '…DEADLINE_EXCEEDED…' })` is `true`.
3. `isModelUnavailable({ name: 'AbortError', code: 20 })` is `true`.
4. `isModelUnavailable({ status: 400 })` and `isModelUnavailable({ status: 401 })` remain `false`.
5. `generateContentWithFallback` advances past a model that throws a timeout/deadline error and
   returns the next model's result.

**Verification procedure.**
- `npx tsx src/services/__tests__/geminiModelChain.test.ts` — extended assertions pass.
- `npx tsx .tmp/probe5.mts` equivalent (or a new committed test) prints `true` for 504 and
  `AbortError`.
- 10 consecutive live `/api/chat` calls; observe `source` values; degradation rate should drop
  toward 0 when a later model can answer.

**Dependencies / blockers.** None. Do this first.

**Estimated complexity.** S.

**No-cost feasibility.** Yes — pure logic change, no new service.

---

## MN-002 — P0 — Wire the outage regression guard into CI and cover timeouts

**Problem.** `geminiModelChain.test.ts` — the guard written specifically for this outage class —
is not referenced by any npm script, so CI never runs it. It also lacks 504/timeout assertions,
which is why it could not have caught MN-001.

**Evidence.** Audit F2; ledger L10 (`grep -c geminiModelChain package.json` = 0), L11 (guard
passes 8/8 when run manually).

**Exact affected files.**
- `package.json` — add a `test:modelchain` script and include it in the `test` chain (line 13).
- `src/services/__tests__/geminiModelChain.test.ts` — add the MN-001 assertions.

**Required outcome.** The guard runs on every `npm test` and fails if a timeout/deadline error
stops the chain.

**Acceptance criteria.**
1. `npm test` output includes the geminiModelChain suite.
2. `grep -c geminiModelChain package.json` ≥ 2 (script + chain entry).
3. The suite contains explicit 504 / `DEADLINE_EXCEEDED` / `AbortError` fall-through assertions.
4. Deliberately reverting MN-001 makes `npm test` fail.

**Verification procedure.** Run `npm test`; confirm the suite appears and passes. Temporarily
revert MN-001 in a scratch branch; confirm the new assertions fail; restore.

**Dependencies / blockers.** Best done together with MN-001 (they share a file and a purpose).

**Estimated complexity.** S.

**No-cost feasibility.** Yes.

---

## MN-003 — P0 — Bound the whole model chain inside the 60s platform budget

**Problem.** The per-call budget is 20s × 1 attempt, but the text chain has 4 models and the TTS
chain has 4 models, so the worst case is 80s against Vercel's 60s `maxDuration`. The child can see
a raw platform timeout instead of a graceful fallback, and `DEPLOY.md` claims this cannot happen.

**Evidence.** Audit F4; ledger L28; `src/services/ai/requestBudget.ts` (`AI_REQUEST_TIMEOUT_MS =
20_000`, `AI_MAX_ATTEMPTS = 1`), `vercel.json` (`maxDuration: 60`), `DEPLOY.md:23`.

**Exact affected files.**
- `src/services/ai/geminiModel.ts` — pass a whole-chain deadline into `generateContentWithFallback`.
- `src/services/ai/requestBudget.ts` — export a chain-level budget constant.
- `src/services/__tests__/aiRequestBudget.test.ts` — assert the chain ceiling.
- `DEPLOY.md` — correct the claim.

**Required outcome.** The total time spent across all models in one route stays under the platform
limit (target: ≤50s to leave headroom), after which the route serves its local fallback.

**Acceptance criteria.**
1. A new constant (e.g. `AI_CHAIN_BUDGET_MS`) is ≤ 50,000 and documented.
2. `generateContentWithFallback` stops trying further models once elapsed time would exceed the
   chain budget.
3. `aiRequestBudget.test.ts` asserts `chain.length × AI_REQUEST_TIMEOUT_MS` cannot exceed the
   platform limit, or that the chain budget is enforced.
4. `DEPLOY.md` no longer states an unqualified "cannot outlive the limit".

**Verification procedure.** Run `npm test`. Reason through the arithmetic and record it in the PR.
Optionally simulate with a stub model that always times out.

**Dependencies / blockers.** Coordinate with MN-001 (same function). Do MN-001 first.

**Estimated complexity.** M.

**No-cost feasibility.** Yes.

---

## MN-004 — P0/P1 — Add a cheap rate limit and body cap to the AI routes

**Problem.** Nine AI routes are unauthenticated and unrated. Any non-browser client can drive the
owner's Gemini key and exhaust a free-tier model, taking the tutor offline for real children.

**Evidence.** Audit F3; ledger L12 (only `express.json` middleware; 9 routes), L13 (`/api/tts`
returned a 109 KB WAV to an arbitrary client).

**Exact affected files.**
- `server.ts` — add per-IP rate limiting and per-route body caps ahead of the AI routes.
- `package.json` — only if a dependency is unavoidable (prefer none; see below).
- `src/services/__tests__/` — a new focused test for the limiter behaviour.

**Required outcome.** A single client cannot issue unbounded AI calls. Prefer an in-process,
dependency-free sliding-window limiter (no external service, no card) so the change stays $0 and
survives the serverless model. Keep the limits generous enough for a real classroom.

**Acceptance criteria.**
1. Exceeding N requests per IP per window returns HTTP 429 with a friendly body and no model call.
2. Limits are configurable via environment variables with safe defaults.
3. `express.json` limit is tightened per route where the payload is small (e.g. `/api/chat`).
4. A test drives the limiter directly and proves the 429 path.

**Verification procedure.** Run the new test; then issue rapid `curl` calls against a local
`npm start` and observe 429 after the threshold. Note: Vercel serverless instances do not share
memory, so document that the in-process limiter is best-effort and pair it with platform-level
protection if available on the free tier.

**Dependencies / blockers.** None. Decide limiter strategy first; if a dependency is needed,
verify its licence and that it needs no card (Zero-Cost Gate).

**Estimated complexity.** M.

**No-cost feasibility.** Yes — in-process limiter, no service.

---

## MN-005 — P1 — Raise the sub-44px controls on the Noor classroom screen

**Problem.** 11 controls on the core teaching screen are 16px–40px, well under the 44px touch
floor, on the primary target device (a child's phone).

**Evidence.** Audit F7; ledger L20 (`08-nour tap=16`), L21 (enumerated list with sizes and lines).

**Exact affected files.**
- `src/components/teacher/VirtualTeacherClassroom.tsx`:
  - re-diagnose link (~lines 1718–1723)
  - "استمعي"/Listen button (~lines 1739–1743)
  - four sub-tabs (~lines 1766–1771)
  - four quick-action buttons (~lines 1830–1840)
  - the "التحقق من الفهم" button (~line 1850s)
- `src/services/__tests__/phoneUiAccessibility.test.ts` — extend the F2 table to cover these.

**Required outcome.** Every interactive control on the Noor screen measures ≥44px on its smallest
axis, without breaking the layout or the RTL flow.

**Acceptance criteria.**
1. Live re-measure at 390×844 (`ar-EG`) shows `smallestTapPx ≥ 44` on the Noor screen.
2. The extended `phoneUiAccessibility.test.ts` F2 entries pass.
3. No horizontal overflow is introduced (`overflowXPx` stays 0).
4. The screen still reads correctly in `ar`, `fr`, and `en`.

**Verification procedure.** Run `scripts/ui-audit.mjs` for `phone-ar`, `phone-fr`, `phone-en` and
re-read the per-screen `smallestTapPx`; run `npm test`.

**Dependencies / blockers.** None.

**Estimated complexity.** M.

**No-cost feasibility.** Yes — CSS class changes only.

---

## MN-006 — P2 — Return real 404s instead of the SPA shell

**Problem.** Every unmatched path returns HTTP 200 with the SPA shell, including `/robots.txt`
and `/security.txt`, misleading crawlers, uptime monitors, and security scanners.

**Evidence.** Audit F5; ledger L17; `vercel.json` rewrite `/(.*) → /index.html`.

**Exact affected files.**
- `vercel.json` — adjust rewrites/`headers` or add a static 404 page.

**Required outcome.** Unknown paths return HTTP 404 while real SPA deep links still resolve to the
app.

**Acceptance criteria.**
1. `curl -o /dev/null -w "%{http_code}" https://<alias>/does-not-exist-xyz` returns 404.
2. A known app route still returns 200 and renders.
3. `robots.txt` and `security.txt` are served as real files (200, correct content type) or return
   404 — not the HTML shell.

**Verification procedure.** Probe the paths on a preview deployment before merge, then on
production after deploy.

**Dependencies / blockers.** Requires care not to break deep-link routing — test several app
routes.

**Estimated complexity.** S–M.

**No-cost feasibility.** Yes.

---

## MN-007 — P2 — Add browser-hardening headers

**Problem.** Only HSTS is present. No CSP, `X-Content-Type-Options`, `X-Frame-Options`,
`Referrer-Policy`, or `Permissions-Policy`; `x-powered-by: Express` is disclosed.

**Evidence.** Audit F6; ledger L18.

**Exact affected files.**
- `vercel.json` — add a `headers` block.
- `server.ts` — optionally disable `x-powered-by`.

**Required outcome.** A conservative CSP that permits the app's real origins (self, the Gemini
API host if called from the client, any media hosts) plus the standard hardening headers.

**Acceptance criteria.**
1. Response headers include CSP, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`
   (or `SAMEORIGIN`), `Referrer-Policy`, and a sensible `Permissions-Policy`.
2. `x-powered-by` is no longer present.
3. The app loads with **0 console errors** and no CSP violations on the phone-ar walk.
4. Voice, TTS audio playback, and IndexedDB all still function.

**Verification procedure.** Re-run `scripts/ui-audit.mjs` for all three profiles; confirm 0
console errors; check headers with `curl -D -`.

**Dependencies / blockers.** Do MN-006 first if they touch the same `vercel.json` region, to
avoid conflicting edits.

**Estimated complexity.** M.

**No-cost feasibility.** Yes.

---

## MN-008 — P2 — Harden the parent PIN at rest

**Problem.** The parent PIN is stored and compared in plaintext.

**Evidence.** Audit F8; ledger L22; `src/types/parent.ts:20`, `src/services/parent/parentService.ts:64-65`.

**Exact affected files.**
- `src/services/parent/parentService.ts` — hash on set, hash on verify.
- `src/types/parent.ts` — rename/clarify the field.
- `src/services/parent/__tests__/parentWeeklySummary.test.ts` or a new test — cover set/verify.

**Required outcome.** A salted hash (e.g. Web Crypto `PBKDF2`/`SHA-256` with a per-record salt) is
stored instead of the raw PIN, with a transparent migration for existing local records.

**Acceptance criteria.**
1. The stored record contains no recoverable raw PIN.
2. Correct PIN verifies; incorrect PIN does not.
3. An existing plaintext record still verifies after one successful entry (migration), or is
   handled with a clear re-set prompt.
4. Tests cover both set and verify.

**Verification procedure.** Run the parent test suite; inspect the IndexedDB record shape in a
browser walk.

**Dependencies / blockers.** None.

**Estimated complexity.** M.

**No-cost feasibility.** Yes — Web Crypto is built in.

---

## MN-009 — P2 — Stop returning a confident transcript for non-audio input

**Problem.** `/api/stt` returns HTTP 200 with a hallucinated apologetic sentence for garbage input,
and the client treats any non-empty transcript as `confidence: 0.85`. Silent-but-valid audio also
returns raw upstream 503 text in the `error` field.

**Evidence.** Audit F9; ledger L14, L15; `src/services/voice/voiceService.ts:429-435`.

**Exact affected files.**
- `server.ts` — `/api/stt` route (~lines 238–295).
- `src/services/voice/voiceService.ts` — confidence assignment (~lines 429–435).

**Required outcome.** A refusal/empty/garbage result yields an empty transcript with
`isNoisyOrEmpty: true`; raw upstream error text is not forwarded to the client.

**Acceptance criteria.**
1. Garbage base64 returns `transcript: ""` (not an apology sentence).
2. Silent audio returns `transcript: ""` and no raw upstream JSON in the response body.
3. The client sets `confidence: 0` for empty transcripts (already does) and never 0.85 for a
   refusal.
4. A test covers the refusal-detection branch.

**Verification procedure.** Re-run the two `curl` probes from ledger L14/L15; confirm empty
transcripts. Run `npm test`.

**Dependencies / blockers.** None.

**Estimated complexity.** S–M.

**No-cost feasibility.** Yes.

---

## MN-010 — P2 — Verify and, if needed, guard reel text language

**Problem.** The Science-in-French track's misconception records are all French; Arabic feed reels
drawn from those lessons may display French text inside an Arabic UI. Not yet confirmed as
user-visible.

**Evidence.** Audit F11; ledger L24 (68 concepts with misconceptions, 35 Arabic; `off_scifr_2026`
= 67/67 French).

**Exact affected files.**
- Feed build/render path (`src/services/reels/feedQueue.ts` and the reel renderer) — TBD after
  confirmation.
- Possibly a language-guard module alongside the existing language guard.

**Required outcome.** Either (a) confirm the render path already guards language and record the
evidence, or (b) add a guard so a reel's displayed text always matches the selected UI language.

**Acceptance criteria.**
1. A reproduction (or a documented disproof) exists for the Arabic UI showing French text.
2. If reproduced, no reel displays text in a language other than the selected UI language.
3. A regression test covers the guard.

**Verification procedure.** Drive the Arabic feed in a browser and inspect the reel text; run the
new test.

**Dependencies / blockers.** Requires a confirmation step before implementation; do not change
curriculum content (out of scope for this backlog).

**Estimated complexity.** M (after confirmation).

**No-cost feasibility.** Yes.

---

## MN-011 — P2 — Decide and enforce the minimum interactive-reel ratio

**Problem.** For the same fresh-student 10-minute session, interactive (option-bearing) reels are
ar 6/17, fr 8/17, en 3/17. The English path offers roughly half the French path's practice.

**Evidence.** Audit F12; ledger L23.

**Exact affected files.**
- `src/services/reels/feedQueue.ts` — composition logic.

**Required outcome.** Either a documented intentional asymmetry or an enforced minimum interactive
ratio applied consistently across languages.

**Acceptance criteria.**
1. A product decision is recorded (intentional asymmetry or a target ratio).
2. If a target ratio is chosen, the feed builder enforces it in all three languages.
3. A test asserts the chosen invariant.

**Verification procedure.** Run the feed builder for ar/fr/en and compare interactive counts; run
the test.

**Dependencies / blockers.** Needs a product decision from the owner. Do not implement a ratio
without one.

**Estimated complexity.** S (decision) / M (enforcement).

**No-cost feasibility.** Yes.

---

## MN-012 — P3 — Track the build-tooling advisories

**Problem.** `npm audit --production` reports 5 high-severity advisories (picomatch ReDoS) reached
through the Vite build tooling. Runtime impact is negligible; `npm audit fix --force` would
downgrade Vite (breaking).

**Evidence.** Audit F10; ledger L19.

**Exact affected files.**
- `package.json` / lockfile — when a non-breaking Vite release resolves it.

**Required outcome.** The advisories are resolved by a normal, non-breaking upgrade when available,
or explicitly accepted with a note.

**Acceptance criteria.**
1. `npm audit --production` shows 0 high advisories, or a documented acceptance exists.
2. `npx tsc --noEmit`, `npm test`, and `npm run build` still pass.
3. No forced downgrade of Vite.

**Verification procedure.** Run the three gates plus `npm audit --production`.

**Dependencies / blockers.** Depends on an upstream non-breaking release; may be deferred.

**Estimated complexity.** S.

**No-cost feasibility.** Yes.

---

## Sequencing summary

1. **MN-001 → MN-002** (the teaching-quality bug and its guard) — do together.
2. **MN-003** (budget correctness) — same function as MN-001.
3. **MN-004** (abuse/cost protection).
4. **MN-005** (child-facing touch targets).
5. **MN-006 → MN-007** (deployment hygiene, same file).
6. **MN-008, MN-009** (privacy and honesty defects).
7. **MN-010, MN-011** (confirm-then-fix items needing a decision or a reproduction).
8. **MN-012** (housekeeping).

```text
COMPLIANCE HEADER
- Outcome claimed: COMPLETED — ordered, actionable backlog with 12 tickets mapped to audit findings.
- Tools confirmed this session: shell, git, curl, node/npx/tsx, Playwright-core + chromium, GitHub REST API.
- Tools absent / not claimed: merge/deploy authority, Vercel per-request logs.
- Evidence refs: audit ledger L1–L28 (referenced per ticket).
- Requirements: each ticket carries Problem, Evidence, Files, Outcome, Acceptance, Verification, Dependencies, Complexity, Cost.
- Checks run (Verification Ledger): N/A — this is a planning artifact; every claim traces to the audit ledger.
- Changed files: docs/audits/MISS_NOOR_IMPLEMENTATION_BACKLOG.md (diff inspected: Y).
- Regressions checked: N/A — documentation only.
- Not attempted / out of scope: implementation of any ticket (this deliverable is the plan).
- Blockers / unknowns: MN-011 needs a product decision; MN-010 needs a reproduction; MN-012 needs an upstream release.
- Repo/PR/deploy state: branch audit/miss-noor-independent-assessment-2026-11-18; no merge, no deploy.
- Unsupported claims removed: Y
- Claim tags applied inline in body: Y (tickets cite ledger entries)
```
