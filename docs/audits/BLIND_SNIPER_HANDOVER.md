# Blind Sniper — Operational Handover

**From:** OpenHands independent audit session
**To:** Blind Sniper
**Audit date:** 2026-11-18 (UTC)
**Repository:** `madnessgate44-debug/Amina` (Miss Noor — AI School Companion)
**Baseline commit audited:** `main` = `883127facf34e256e7490a48622b9d14c695f6a3`
**Assessment branch:** `audit/miss-noor-independent-assessment-2026-11-18`
**Live target:** `https://amina-nine-sepia.vercel.app`
**Production deployment at audit time:** `dpl_9VcVttryi9` (`READY`, sha `883127facf…`)

> **Provenance banner.** Every claim below comes from a tool action in this session, recorded in
> the audit's Verification Ledger (`docs/audits/MISS_NOOR_INDEPENDENT_AUDIT.md` §10, entries
> L1–L28). Nothing is reconstructed. This handover adds no new claims.

---

## 1. What I inspected

- A fresh clone at `/tmp/amina-audit`, checked out at `883127facf34e256e7490a48622b9d14c695f6a3`.
- The full Express backend `server.ts` (all 9 `/api/*` routes), the Vercel entry `api/index.ts`,
  and `vercel.json`.
- The AI layer: `src/services/ai/geminiModel.ts`, `src/services/ai/requestBudget.ts`, and the
  guard `src/services/__tests__/geminiModelChain.test.ts`.
- Voice: `src/services/voice/voiceService.ts` (`/api/stt` client) and `/api/tts` server path.
- Parent/privacy: `src/types/parent.ts`, `src/services/parent/parentService.ts`, `ProfileScreen`.
- Storage: IndexedDB `ai_school_companion_v2` v10, 16 stores; homework consent fields.
- Feed: `src/services/reels/feedQueue.ts` + `FeedScreen`/`ReelCard`, built deterministically for
  ar/fr/en.
- Curriculum registry counts and misconception languages.
- Accessibility: `src/services/__tests__/phoneUiAccessibility.test.ts` and the live phone walk.
- CI: `.github/workflows/ci.yml`, `engineering-execution-os-compliance.yml`, `deploy-pages.yml`;
  recent runs on `main`.
- Dependencies: `package.json` + `npm audit --production`.
- Deployment: Vercel REST API (project `amina`, `prj_xOPOJs2Q8xZ6b6GB2gX8aKEBefqB`).
- The live site via HTTP probes and a Playwright walk (chromium at `/usr/bin/chromium`,
  playwright-core in `/tmp/pwtool`).

## 2. What I found

**Verdict: NOT release-ready as an always-online AI tutor. Conditional GO once the P0/P1 items are
closed.**

Highest-severity, in order:

1. **F1 (P0)** — `isModelUnavailable` does not classify `504` / `DEADLINE_EXCEEDED` / `AbortError`
   as "try the next model", so a slow first model aborts the chain and the child hears scripted
   fallback text. Observed **1 in 10 live `/api/chat` calls degraded**; isolated probe threw a
   `504` on **2 of 3 runs** after ~19s. File: `src/services/ai/geminiModel.ts:82-96, 135`.
2. **F2 (P0)** — the guard for exactly this outage class is **not wired into CI**
   (`grep -c geminiModelChain package.json` = 0) and lacks timeout assertions. File:
   `package.json`, `src/services/__tests__/geminiModelChain.test.ts`.
3. **F3 (P0/P1)** — **9 AI routes are unauthenticated and unrated**; an arbitrary client got a
   109 KB WAV from `/api/tts`. File: `server.ts`.
4. **F4 (P1)** — worst-case chain time is **4 models × 20s = 80s** against Vercel's 60s
   `maxDuration`; `DEPLOY.md:23` claims otherwise. Files: `geminiModel.ts`, `requestBudget.ts`,
   `DEPLOY.md`, `vercel.json`.
5. **F7 (P1)** — **11 controls on the Noor classroom screen are 16px–40px**, below the 44px touch
   floor, on the primary device. File: `src/components/teacher/VirtualTeacherClassroom.tsx`.

Secondary (P2): soft-404 returning 200 (F5); missing CSP and hardening headers (F6); plaintext
parent PIN (F8); STT returning a confident hallucinated apology for garbage input (F9); possible
cross-track misconception language mismatch (F11); uneven interactive-reel ratio across languages
(F12). P3: build-tooling advisories (F10).

**Verified working:** live artifact is byte-identical to a local build of `main` (SHA-256 match);
1060 test assertions pass; type check and build clean; CI green; honest `degraded`/`source`
contract surfaced in the UI; local-only storage with consent-gated photos; no unsafe DOM sinks;
RTL + reduced-motion support; HSTS present.

## 3. What needs to be fixed

In this order (full detail in `docs/audits/MISS_NOOR_IMPLEMENTATION_BACKLOG.md`):

| Order | Ticket | Priority | One-line fix |
| --- | --- | --- | --- |
| 1 | MN-001 | P0 | Classify 504/DEADLINE/AbortError/timeout as "try next model" in `isModelUnavailable`. |
| 2 | MN-002 | P0 | Wire `geminiModelChain.test.ts` into `npm test`; add timeout assertions. |
| 3 | MN-003 | P0/P1 | Enforce a whole-chain deadline under 60s; correct `DEPLOY.md`. |
| 4 | MN-004 | P0/P1 | Add an in-process, dependency-free per-IP rate limit + per-route body caps. |
| 5 | MN-005 | P1 | Raise the 11 Noor-screen controls to ≥44px; extend the a11y test. |
| 6 | MN-006 | P2 | Serve real 404s for unknown paths. |
| 7 | MN-007 | P2 | Add CSP + hardening headers; drop `x-powered-by`. |
| 8 | MN-008 | P2 | Salt+hash the parent PIN at rest with migration. |
| 9 | MN-009 | P2 | Return empty transcript for garbage/refusal; stop leaking upstream error text. |
| 10 | MN-010 | P2 | Confirm and, if needed, guard reel text language. |
| 11 | MN-011 | P2 | Decide/enforce the minimum interactive-reel ratio (needs owner decision). |
| 12 | MN-012 | P3 | Resolve build-tooling advisories on a non-breaking upgrade. |

## 4. What should be preserved

Do not regress these — they are verified strengths:

- The model-chain abstraction in `geminiModel.ts` and the single-source-of-truth model list. Fix
  MN-001 by **extending** the classifier, not by removing the chain.
- The honest `degraded` / `source` response contract across all routes and its UI surfacing
  (`ReelCard`, `TeachingSessionModal`, `HomeworkRunner`, `BookReader`, `TrainMeSheet`).
- Local-only storage (`ai_school_companion_v2` v10); no server-side user database.
- Consent-gated homework photos (`homework.ts:91-92`).
- No unsafe DOM sinks; keep it that way.
- RTL handling (`document.documentElement.dir/lang`) and reduced-motion support.
- The 1060-assertion suite and the byte-identical live/local artifact proof.

## 5. What must not be changed

- **No curriculum content or learner data edits.** The Science-in-French track and the open
  curriculum PRs (#205, #204, #203, #201) are owned by other workstreams.
- **No merge of PRs #7 or #8** (standing rule in `docs/STATUS.md`).
- **No product redesign.** Every ticket is a bounded fix.
- **No new paid service, no card.** All tickets are $0.
- **No force-push, no history rewrite.**
- **No secrets, credentials, private transcripts, or identifiable child information** in any
  commit or PR body.

## 6. Recommended execution order

1. MN-001 + MN-002 together on one branch (they share a file and a purpose), then run the full
   gate set and the 10-call live degradation probe.
2. MN-003 on the same or a follow-up branch.
3. MN-004.
4. MN-005 (verify with `scripts/ui-audit.mjs` for ar/fr/en).
5. MN-006 then MN-007 (same `vercel.json` region).
6. MN-008 and MN-009.
7. MN-010 and MN-011 after their confirmation/decision steps.
8. MN-012 opportunistically.

For every merge: `npx tsc --noEmit` = 0, `npm test` all pass, `npm run build` passes, CI `verify`
green, then prove the live bundle matches the merged build (SHA-256) per the repository's own
standing rules.

## 7. Outstanding uncertainties

- **Vercel per-request function logs were not retrieved** — the deployment metadata was read, but
  runtime error rates under real traffic are unmeasured. Do not claim a runtime error rate.
- **F11 (misconception language)** is confirmed in the data but **not confirmed as user-visible**
  in the Arabic render path. Confirm before fixing.
- **F12 (interactive ratio)** needs a product decision; the counts (ar 6/17, fr 8/17, en 3/17) are
  measurements, not a stated requirement.
- **Serverless rate limiting** is inherently best-effort because instances do not share memory;
  pair MN-004 with platform-level protection if the free tier offers it.
- **The 1-in-10 degradation rate** is a small sample from one moment; the mechanism (F1) is the
  durable finding, the rate is indicative.
- **Cold-start timing and concurrency behaviour** were not measured (would cost quota).

## 8. Exact GitHub branch, PR URL and commit SHA

Fill these from the audit session's final step (they are appended to the audit PR description and
to `docs/STATUS.md` when the branch is pushed):

- **Branch:** `audit/miss-noor-independent-assessment-2026-11-18`
- **Base:** `main` @ `883127facf34e256e7490a48622b9d14c695f6a3`
- **PR URL:** _set by the pushing session_ — see the repository's open PR list for
  "Miss Noor independent assessment".
- **Head SHA:** _set by the pushing session_ — the commit that contains the three deliverables.
- **Deliverables on the branch:**
  - `docs/audits/MISS_NOOR_INDEPENDENT_AUDIT.md`
  - `docs/audits/MISS_NOOR_IMPLEMENTATION_BACKLOG.md`
  - `docs/audits/BLIND_SNIPER_HANDOVER.md`

Retrieve them directly from GitHub:

```bash
gh api repos/madnessgate44-debug/Amina/contents/docs/audits/MISS_NOOR_INDEPENDENT_AUDIT.md \
  -f ref=audit/miss-noor-independent-assessment-2026-11-18 --jq .content | base64 -d
```

## 9. How to verify the audit yourself (reproduce the key findings)

```bash
# 1. The chain aborts on a deadline error (F1)
npx tsx -e "import('./src/services/ai/geminiModel.js').then(m=>console.log(m.isModelUnavailable({status:504})))"
# expect: false  (bug)

# 2. The guard is not in CI (F2)
grep -c geminiModelChain package.json        # expect: 0

# 3. The AI routes are open (F3)
curl -s -o /dev/null -w "%{http_code}\n" -X POST https://amina-nine-sepia.vercel.app/api/tts \
  -H 'Content-Type: application/json' -d '{"text":"مرحبا","language":"ar"}'
# expect: 200 with audio for an unauthenticated client

# 4. Soft 404 (F5)
curl -s -o /dev/null -w "%{http_code}\n" https://amina-nine-sepia.vercel.app/does-not-exist-xyz
# expect: 200  (bug)

# 5. Noor-screen tap floor (F7)
node scripts/ui-audit.mjs   # read per-screen smallestTapPx; 08-nour is 16
```

```text
COMPLIANCE HEADER
- Outcome claimed: COMPLETED — operational handover to Blind Sniper.
- Tools confirmed this session: shell, git, curl, node/npx/tsx, Playwright-core + chromium, GitHub REST API, Vercel REST API.
- Tools absent / not claimed: merge/deploy authority, Vercel per-request logs.
- Evidence refs: audit ledger L1–L28.
- Requirements: inspected / found / fix / preserve / do-not-change / order / uncertainties / exact refs — all present.
- Checks run (Verification Ledger): N/A — synthesis artifact; every claim traces to the audit ledger.
- Changed files: docs/audits/BLIND_SNIPER_HANDOVER.md (diff inspected: Y).
- Regressions checked: N/A — documentation only.
- Not attempted / out of scope: implementing any fix; merging; deploying.
- Blockers / unknowns: PR URL and head SHA are set by the pushing step and echoed into the PR body and STATUS.md.
- Repo/PR/deploy state: branch audit/miss-noor-independent-assessment-2026-11-18 @ baseline 883127facf…; no merge, no deploy.
- Unsupported claims removed: Y
- Claim tags applied inline in body: Y
```
