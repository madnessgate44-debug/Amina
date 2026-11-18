# Miss Noor — Independent Product & Release-Readiness Audit

**Audit date:** 2026-11-18 (UTC)
**Auditor:** OpenHands agent (independent assessment; read-only against production)
**Repository:** `madnessgate44-debug/Amina`
**Baseline commit audited:** `main` = `883127facf34e256e7490a48622b9d14c695f6a3` [V]
**Live target:** `https://amina-nine-sepia.vercel.app` [V]
**Production deployment:** `dpl_9VcVttryi9` (`READY`, `githubCommitSha` = `883127facf…`) [V]

> **Provenance banner.** All repository inspection was performed on a fresh clone at
> `/tmp/amina-audit` checked out at the baseline SHA above. All live probes were executed
> against the public production alias. No repository file was modified by this audit; no
> merge, no deploy, and no production change was performed. Anything not directly observed is
> tagged `[U]` (unknown) or `[A]` (assumption) and named as such.

---

## 0. Evidence tagging key (per `ENGINEERING_EXECUTION_OS.md` §0.2)

- `[V]` Verified — direct tool evidence in this session.
- `[C]` Reported claim — from repository text or external documentation.
- `[I]` Inference — deduction from verified facts.
- `[A]` Assumption — unverified.
- `[U]` Unknown — explicit evidence gap.
- `[B]` Blocker.

---

## 1. Outcome and scope

**Outcome (what this audit answers):** Is Miss Noor safe and ready to release to Egyptian
Grade-5 families, and what is the smallest set of changes that closes the highest-risk gaps
without redesigning the product?

**In scope:** correctness of the live AI teaching paths, honest degradation behaviour,
child-safety/privacy posture, cost and latency exposure, deployment integrity, accessibility
of the primary phone flows, test/CI integrity, and dependency risk.

**Out of scope (deliberately):** curriculum content correctness, curriculum text
reconciliation, and any product redesign. Those are covered by the open Grade-5 curriculum
PRs and are not re-litigated here.

**Authority posture:** read-only. No merge, no deploy, no source edit, no dependency change,
no secret access beyond what was required to read deployment state. [V]

---

## 2. Baseline established before any file change

| Item | Value | Tag |
| --- | --- | --- |
| `main` HEAD SHA | `883127facf34e256e7490a48622b9d14c695f6a3` | [V] |
| Working branch used | `audit/miss-noor-independent-assessment-2026-11-18` (docs only) | [V] |
| Clone location | `/tmp/amina-audit` (throwaway) | [V] |
| Vite build output | `dist/assets/index-BIFJRmVB.js` (1,792.57 kB) | [V] |
| Live bundle SHA-256 | `e2218679e2c2bdb9d1106a0a8086743d1f6153718a1128ec28f352e552bcf194` | [V] |
| Local build SHA-256 | identical to live (byte-for-byte) | [V] |
| Open PRs at audit time | #205, #204, #203, #201, #8 (all draft) | [V] |
| Open issues | #157 (curriculum completeness milestone) | [V] |
| CI on `main` | `CI` + `Engineering Execution OS Compliance` = success | [V] |
| Existing audit branches | many historical `audit/*`; none named for this assessment | [V] |

The live bundle hashing identically to a local build of `main` proves the deployed artifact
matches the audited commit. [V]

---

## 3. Verified gate results (see Verification Ledger in §10 for raw excerpts)

| Gate | Command | Result | Tag |
| --- | --- | --- | --- |
| Type check | `npx tsc --noEmit` | exit 0 | [V] |
| Unit/integration suite | `npm test` | exit 0, 1060 `[PASS]`, 0 `[FAIL]` | [V] |
| Production build | `npm run build` | exit 0 | [V] |
| Live smoke (HTTP) | `/`, assets, `/api/health` | 200 | [V] |
| UI walk (phone ar/fr/en) | `scripts/ui-audit.mjs` | 0 console errors per profile | [V] |
| Dependency audit | `npm audit --production` | 5 high (build tooling only) | [V] |

**Important caveat:** a green suite and a green build do **not** prove production behaviour
(OS §3 "Build ≠ behavior"). The live behavioural probes in §5 are the load-bearing evidence.

---

## 4. Release-readiness verdict

> ### VERDICT: **NOT RELEASE-READY** as an always-online AI tutor for children — **conditional GO** only if AI routes are gated and the degradation bug is fixed first.

**Reasoning.**

1. **The AI teaching path degrades silently and intermittently on live.** 10 consecutive live
   `/api/chat` calls returned 9 real Gemini answers and **1 canned `error_fallback`** [V]; a
   direct probe of the production model chain threw on 2 of 3 runs with a `504 DEADLINE_EXCEEDED`
   ApiError after ~19s [V]. A child who hits the fallback hears scripted text instead of
   teaching — the exact failure class the repository's own `geminiModelChain.test.ts` was written
   to prevent (audit finding **F1**). The guard that would have caught it is **not running in
   CI** (finding **F2**).
2. **Nine AI endpoints are unauthenticated and unrated.** Any non-browser client can drive the
   owner's Gemini key with `curl`; there is no auth middleware, no rate limit, and no per-user
   quota (finding **F3**). On a free tier, one abuser can exhaust the per-model daily quota and
   take the tutor offline for real children.
3. **The worst-case request budget exceeds the platform limit.** The route budget is 20s × 1
   attempt, but the text chain tries **four** models and the TTS chain tries **four** TTS models,
   so the theoretical ceiling is 4 × 20s = **80s** against Vercel's 60s `maxDuration`
   (finding **F4**). `DEPLOY.md:23` states the opposite ("cannot outlive the limit").
4. **Unknown-path responses return HTTP 200** with the SPA shell for every unmatched route,
   including `/robots.txt` and `/security.txt` (finding **F5**) — a soft-404 that misleads
   crawlers, uptime monitors, and security scanners.
5. **Missing browser hardening headers** beyond HSTS — no CSP, `X-Content-Type-Options`,
   `X-Frame-Options`, `Referrer-Policy`, or `Permissions-Policy`; `x-powered-by: Express` is
   exposed (finding **F6**).
6. **Accessibility: the Noor classroom screen has 11 controls below the 44px touch floor**
   (16px–40px), measured live (finding **F7**), even though the repo's own accessibility test
   asserts a 44px floor for eight named controls.
7. **Parent PIN is stored and compared in plaintext** in IndexedDB (finding **F8**) — low
   severity for a local-only device app, but worth recording.

**What is genuinely good and must be preserved** (see the handover for the full list): the model
chain abstraction, the honest `degraded`/`source` contract, the local-only storage model, the
injectable-free curriculum grounding, the reduced-motion support, the 1060-assertion suite, and
the byte-identical live/local artifact proof. [V]

---

## 5. Findings

Severity: **P0** blocks release · **P1** fix before broad release · **P2** fix soon ·
**P3** housekeeping.

### F1 — `isModelUnavailable` does not treat timeouts/deadline errors as "try the next model" (P0)

**Evidence.**

- Production chain resolution: `gemini-3.6-flash → gemini-3.5-flash → gemini-2.5-flash →
  gemini-3.8-flash` [V].
- Direct probe against the live key through the real production helper:
  - run 1: `THREW after 19626ms name=ApiError msg={"error":{"code":504,"message":"Deadline expired before operation could complete.","status":"DEADLINE_EXCEEDED"}}` [V]
  - run 2: `THREW after 19049ms` (same 504) [V]
  - run 3: `OK 9385ms text=**الكسر هو قيمة تمثل جزءاً من شيء كامل.*` [V]
- Classification probe: `isModelUnavailable(504 deadline) → false`, `isModelUnavailable(AbortError/timeout) → false`,
  while `503 → true` and `429 → true` [V].
- Code: `src/services/ai/geminiModel.ts:82-96` (`isModelUnavailable`) recognises only
  `429 / 503 / 404` and the strings `resource_exhausted`, `unavailable`, `not_found`, `not found`,
  `overloaded`. It does **not** recognise `504`, `DEADLINE_EXCEEDED`, `AbortError`, or `ETIMEDOUT`.
- `generateContentWithFallback` (`geminiModel.ts:117-138`) does `if (!isModelUnavailable(err)) throw err;`
  at line 135 — so a 504/timeout **aborts the whole chain immediately** and the route catch serves
  the canned fallback.

**Impact.** When the first model is slow (>20s client timeout) or returns a deadline error, the
child gets scripted fallback text instead of teaching, even though models 2–4 would have answered.
This is the same user-visible outage class as the historical "no real teacher" incident the chain
was built to fix. Observed live rate: 1 in 10 chat calls; 2 in 3 on the isolated probe. [V]

**Root cause hypothesis (testable).** The 20s client timeout (`AI_REQUEST_TIMEOUT_MS`) fires, and
both the local abort and the upstream 504 surface as errors that `isModelUnavailable` returns
`false` for, so the chain stops at model 1 instead of falling through. [I]

**Required outcome.** A slow or deadline-limited model must fall through to the next model; only
genuinely non-retryable errors (400/401/403/safety) should abort the chain.

### F2 — The regression guard for the exact outage class is not wired into CI (P0)

**Evidence.** `src/services/__tests__/geminiModelChain.test.ts` exists and its header states it is
the "Regression guard for the 'no real teacher' outage" [V]. `grep -c geminiModelChain package.json`
= **0** [V]; the file appears in neither the `test` chain nor any `test:*` script. Running it
manually passes (8/8) [V]. Every other test file on disk is wired to a script; this is the only
orphan. [V]

**Impact.** The guard that asserts "quota and outage errors fall through" does not run in CI, so
F1 was free to ship. The test also does not assert 504/DEADLINE/timeout fall-through, which is why
it would not have caught F1 even if it ran. [I]

**Required outcome.** Wire the guard into `npm test`, and extend it to cover 504 / `DEADLINE_EXCEEDED`
/ `AbortError` / timeout fall-through (ties to F1).

### F3 — Nine AI endpoints are unauthenticated and unrated (P0/P1)

**Evidence.** `server.ts` mounts only `express.json({ limit: '4mb' })` (line 26); there is no auth
middleware, no rate limiter, and no per-IP/per-user quota anywhere in the file [V]. Nine
`app.post('/api/…')` AI routes exist: `chat`, `stt`, `tts`, `tutor-explain`, `tutor-reply`,
`teach-turn`, `check-homework`, `study-page`, `reconstruct-day` [V]. Live probes from an arbitrary
client returned real work: `/api/tts` → 200 with a 109,468-byte WAV in ~2.6s [V]; `/api/tutor-explain`
→ 200 in ~19s [V]; `/api/stt` → 200 [V]. Browser cross-origin JSON abuse is partially mitigated
because the API returns no `Access-Control-Allow-Origin` and JSON bodies trigger a preflight [V];
server-side (`curl`) abuse is **not** mitigated at all. [V]

**Impact.** Anyone can burn the owner's Gemini quota. On the free tier (per-model per-minute and
per-day limits, per `geminiModel.ts` header comment) a single scripted abuser can exhaust a model
and push every child onto canned fallbacks. This is a cost and availability risk, not a
data-exfiltration risk (there is no server-side user data store). [I]

**Required outcome.** At minimum a cheap per-IP rate limit and a body-size cap per route; ideally a
shared client token or platform-level protection. No paid service required.

### F4 — Worst-case request budget (80s) exceeds the 60s platform limit (P1)

**Evidence.** `src/services/ai/requestBudget.ts` sets `AI_REQUEST_TIMEOUT_MS = 20_000` and
`AI_MAX_ATTEMPTS = 1` [V]. The text chain has 4 models and the TTS chain has 4 models [V]. Worst
case = 4 × 20s = 80,000 ms; `vercel.json` sets `maxDuration: 60` for `api/index.ts` [V].
`DEPLOY.md:23` claims "AI calls are bounded … (20s timeout, 1 attempt) so a slow upstream cannot
outlive the limit" [C] — contradicted by the chain arithmetic [V]. The existing
`aiRequestBudget.test.ts` asserts only the single-call budget, not the whole-chain ceiling. [V]

**Impact.** Under sustained model slowness the function can be killed at 60s and the child sees a
raw platform timeout instead of the route's graceful fallback — the exact outcome the budget module
was written to prevent. [I]

**Required outcome.** Add a whole-chain deadline (e.g. stop trying further models once elapsed time
approaches the platform budget) and correct `DEPLOY.md`.

### F5 — Soft-404: unmatched paths return HTTP 200 (P2)

**Evidence.** `vercel.json` rewrites `/(.*)` → `/index.html` [V]. Live: `/404`, `/security.txt`,
`/does-not-exist-xyz`, and `/robots.txt` all return **HTTP 200** with `content-type: text/html` [V].

**Impact.** Search engines index the shell for arbitrary URLs; uptime and security scanners treat
missing `robots.txt`/`security.txt` as present; a genuine 404 is indistinguishable from a page.
[I]

**Required outcome.** Serve real 404s (or at least a `404.html` with status 404) for unknown paths
while preserving SPA deep-link routing for real app routes.

### F6 — Missing browser-hardening headers (P2)

**Evidence.** Live response headers for `/` and `/api/*`: only
`strict-transport-security: max-age=63072000; includeSubDomains; preload` [V]. No
`Content-Security-Policy`, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, or
`Permissions-Policy` [V]. `x-powered-by: Express` is exposed [V]. No CSP `<meta>` in `index.html` [V].

**Impact.** Reduced defence-in-depth against XSS/clickjacking and unnecessary framework
disclosure. The app renders model-generated text (no `dangerouslySetInnerHTML`/`innerHTML` sinks
found [V]), which limits but does not eliminate the risk. [I]

**Required outcome.** Add a conservative CSP plus the standard hardening headers via `vercel.json`
`headers` (no dependency required).

### F7 — 11 controls on the Noor classroom screen are below the 44px touch floor (P1, child usability)

**Evidence.** Live measurement at 390×844, `ar-EG`, on the Noor (نور) nav destination returned 11
visible controls with `min(width,height) < 44px` [V]:

| Control | Size | Source line |
| --- | --- | --- |
| "إعادة التشخيص 🩺" (re-diagnose) | 95×16 | `VirtualTeacherClassroom.tsx:1718-1723` |
| "استمعي" (listen) | 83×24 | `:1739-1743` |
| "القصة والمقدمة 🌟" (tab) | 118×24 | `:1766-1768` |
| "الشرح والسبورة 📝" (tab) | 115×24 | `:1769` |
| "مثال وتشبيه من الواقع 💡" (tab) | 151×24 | `:1770` |
| "سؤال للنقاش ❓" (tab) | 105×24 | `:1771` |
| 4 × quick-action buttons (e.g. "مش فاهمة.. بسطيها لي!") | 163×34 | `:1830-1840` |
| "🎯 التحقق من الفهم بمثال جديد" | 334×40 | `VirtualTeacherClassroom.tsx` |

The repo's `phoneUiAccessibility.test.ts` asserts a 44px floor for eight named controls (F2 block)
but does **not** cover this screen's sub-tabs, quick actions, or the re-diagnose link. [V] The
automated `ui-audit.mjs` reports `smallestTapPx = 16` for the Noor screen, matching this. [V]

**Impact.** Small tap targets on the core teaching screen are a real usability problem for an
~11-year-old on a phone — the primary target device. [I]

**Required outcome.** Bring the listed controls to ≥44px (`min-h-[44px]`) and extend the
accessibility test's F2 table to cover them.

### F8 — Parent PIN stored and compared in plaintext (P2)

**Evidence.** `src/types/parent.ts:20` — `pin: string; // 4-digit PIN for MVP` [V].
`src/services/parent/parentService.ts:64-65` — `return account.pin.trim() === enteredPin.trim();` [V].
No hashing primitive is used for the PIN. [V]

**Impact.** Low: the record lives only in the device's IndexedDB, so there is no server-side
exposure. It does mean the PIN is readable by anyone with device/devtools access. [I]

**Required outcome.** Store a salted hash rather than the raw PIN; keep the change local (no
server round-trip).

### F9 — STT returns HTTP 200 with a hallucinated apology for non-audio input (P2)

**Evidence.** `/api/stt` with `audioBase64 = "UklGRg=="` (a truncated WAV header, not real audio)
returned **200** with `transcript: "أعتذر، ولكنني لا أستطيع الاستماع إلى التسجيلات الصوتية المرفقة…"`
(a polite refusal) [V]. With `"////"` it returned a different apologetic Arabic sentence [V]. With
a silent-but-valid WAV it returned `transcript: ""` plus a raw upstream 503 passed through in the
`error` field with `tier: gemini_stt_error`, still HTTP 200 [V]. The client
(`voiceService.ts:429-435`) sets `confidence: 0.85` whenever the transcript is non-empty, so a
refusal sentence would be treated as a confident transcript. [V]

**Impact.** A child whose mic capture is corrupt may see Miss Noor "repeat back" an apology as if
it were their words. Low frequency, but it is an honesty defect in a child-facing path. [I]

**Required outcome.** Detect the refusal/empty case and return `isNoisyOrEmpty`/empty transcript
rather than a confident non-empty transcript; do not pass raw upstream error text to the client.

### F10 — `npm audit --production` reports 5 high-severity advisories in build tooling (P3)

**Evidence.** `npm audit --production` → exit 1, "5 high severity vulnerabilities" via
`picomatch` ReDoS (`GHSA-fc5q-39xc-vjpf`) reached through `fdir → tinyglobby → vite →
@vitejs/plugin-react` [V]. All affected packages are build/dev-time; none is shipped in the
client bundle or the serverless function. [I] `npm audit fix --force` would install `vite@6.2.7`
(a downgrade/breaking change) [V].

**Impact.** Negligible at runtime; matters for supply-chain hygiene. [I]

**Required outcome.** Track and upgrade when a non-breaking Vite release resolves it; do not
force-downgrade.

### F11 — Cross-track misconception language mismatch (P2, correctness of child-facing text)

**Evidence.** 72 available lessons / 74 concepts / 68 concepts with misconceptions; only **35**
carry Arabic misconception text [V]. The `off_scifr_2026_*` (Science-in-French) track's 67
misconception records are **all French** [V]. In the Arabic feed build, the "spot the mistake" and
diagnosis reels are drawn from lessons whose misconception text may be French while the reel UI is
Arabic. [I]

**Impact.** A child on the Arabic UI can be shown French misconception/explanation text inside an
Arabic reel. Needs confirmation against the actual render path before being treated as user-visible.
[U]

**Required outcome.** Confirm the render path and, if confirmed, add a language guard so a reel's
text language always matches the selected UI language.

### F12 — Feed interactivity is uneven across languages (P2, engagement)

**Evidence.** Deterministic `buildFeedQueue` for a fresh student at 10 minutes produced 17 reels in
each of ar/fr/en, with interactive (option-bearing) reels: **ar 6/17, fr 8/17, en 3/17** [V].
Reel kinds: ar `hook_question 8, story_analogy 7, spot_the_mistake 1, win_closer 1`; en the same
counts. No wrong-script reels were found (0/17 in each language) [V].

**Impact.** The English path offers roughly half the interactive practice of the French path for
the same session length. Not a defect, but an engagement asymmetry worth a conscious decision. [I]

**Required outcome.** Decide the intended minimum interactive ratio and enforce it, or document
the asymmetry as intentional.

---

## 6. What is verified working (must be preserved)

- The deployed artifact equals a local build of `main` byte-for-byte (SHA-256 match). [V]
- `/api/health` reports `status=ok, hasApiKey=true`. [V]
- The model-name single-source-of-truth design (`geminiModel.ts`) and the fallback helper are
  correct in structure; 8/8 of its guard tests pass when run manually. [V]
- The honest `degraded` / `source` contract is implemented across routes and surfaced in the UI
  (`ReelCard`, `TeachingSessionModal`, `HomeworkRunner`, `BookReader`, `TrainMeSheet`). [V]
- Local-only storage: IndexedDB `ai_school_companion_v2` v10, 16 stores; no server-side user
  database. Homework photo storage is consent-gated (`homework.ts:91-92`). [V]
- No unsafe DOM sinks: no `dangerouslySetInnerHTML`, `eval`, `new Function`, or `innerHTML`. [V]
- Accessibility wins: `document.documentElement.dir/lang` set on language switch; reduced-motion
  support in `index.css` and `ReelMedia`; 44px floor holds on onboarding/home/feed/library. [V]
- 1060 assertions pass, type check clean, build clean, CI green on `main`. [V]
- `vercel.json` never caches `/api/*` in the service worker; service worker is `amina-v2`. [V]
- HSTS is set with `includeSubDomains; preload`. [V]

---

## 7. Explicitly not inspected / not run (honesty section)

| Area | Status | Why |
| --- | --- | --- |
| Real Gemini audio quality / voice naturalness | NOT RUN | Subjective; not automatable here. |
| Full curriculum content correctness | NOT RUN | Out of scope; owned by open curriculum PRs. |
| Serverless cold-start timing | NOT RUN | Requires repeated cold invocations beyond this budget. |
| Concurrency / load testing of AI routes | NOT RUN | Would incur external cost and abuse the owner's key. |
| Parent dashboard data accuracy end-to-end | PARTIAL | Types and PIN path read; not driven in a browser. |
| Vercel function logs (runtime errors) | BLOCKED | Deployment metadata read; per-request logs not pulled. |
| Multi-child / class-size behaviour | NOT RUN | No test fixture for multi-child sessions. |

---

## 8. Risk register

| ID | Risk | Severity | Likelihood | Consequence |
| --- | --- | --- | --- | --- |
| R-F1 | Child hears scripted text instead of teaching | High | High (observed live) | Trust erosion; core promise broken |
| R-F3 | Free-tier quota exhaustion by an abuser | High | Medium | Tutor offline for everyone |
| R-F4 | 60s platform timeout surfaces raw error | Medium | Low–Medium | Child sees platform error |
| R-F5 | Soft-404 misleads crawlers/monitors | Low | High | Hygiene, discoverability |
| R-F7 | Child mis-taps on the teaching screen | Medium | High | Frustration on primary device |
| R-F11 | Wrong-language text in a reel | Medium | Medium | Confusion |

---

## 9. Requirement-to-evidence mapping

| Req | Acceptance criterion | Implementation | Verification | Result |
| --- | --- | --- | --- | --- |
| R1 baseline | Exact SHA + deployed artifact proven | clone @ `883127fa` | `git rev-parse`, SHA-256 compare | PASS [V] |
| R2 gates | tsc/test/build all exit 0 | repo | `npx tsc`, `npm test`, `npm run build` | PASS [V] |
| R3 honest degradation | No scripted text when a model could answer | `geminiModel.ts` | live probes + `isModelUnavailable` probe | **FAIL** (F1) |
| R4 CI guard | Outage regression guard runs in CI | `package.json` | `grep -c geminiModelChain package.json` = 0 | **FAIL** (F2) |
| R5 abuse resistance | AI routes cannot be driven anonymously at scale | `server.ts` | route enumeration + live probes | **FAIL** (F3) |
| R6 budget | Whole-chain time < 60s | `requestBudget.ts`, `vercel.json` | arithmetic + `DEPLOY.md` contrast | **FAIL** (F4) |
| R7 child usability | ≥44px touch targets on primary screens | `VirtualTeacherClassroom.tsx` | live tap measurement | **FAIL** (F7) |
| R8 privacy | No plaintext credential at rest | `parentService.ts` | source read | **FAIL** (F8) |
| R9 a11y wins | RTL/reduced-motion/tap floor elsewhere | multiple | `ui-audit.mjs` | PASS [V] |
| R10 artifact integrity | Live == audited commit | Vercel + local | SHA-256 match | PASS [V] |

---

## 10. Verification Ledger

All commands run 2026-11-18 (UTC) unless noted. Excerpts are verbatim.

| # | Command / action | Exit | Raw excerpt | Result | Time |
| --- | --- | --- | --- | --- | --- |
| L1 | `git rev-parse HEAD` (clone) | 0 | `883127facf34e256e7490a48622b9d14c695f6a3` | PASS | 10:41Z |
| L2 | `npx tsc --noEmit` | 0 | `TSC_EXIT=0` | PASS | 10:33Z |
| L3 | `npm test` | 0 | `PASS markers: 1060` / `FAIL markers: 0` / `NPMTEST_EXIT=0` | PASS | 10:31Z |
| L4 | `npm run build` | 0 | `dist/assets/index-BIFJRmVB.js 1,792.57 kB │ gzip: 484.70 kB` / `BUILD_EXIT=0` | PASS | 10:33Z |
| L5 | `sha256sum` live vs local bundle | 0 | both `e2218679e2c2…bcf194` | PASS | 10:38Z |
| L6 | `curl /api/health` | 0 | `{"status":"ok","hasApiKey":true,…}` | PASS | 10:39Z |
| L7 | 10× live `POST /api/chat` | 0 | 9 × `"source":"gemini"`, 1 × `"source":"error_fallback"` | FAIL (F1) | 10:33Z |
| L8 | `npx tsx .tmp/probe4.mts` (production chain) | 0 | `chain = gemini-3.6-flash -> gemini-3.5-flash -> gemini-2.5-flash -> gemini-3.8-flash`; `run1: THREW after 19626ms … code":504 … DEADLINE_EXCEEDED`; `run2: THREW after 19049ms`; `run3: OK 9385ms` | FAIL (F1) | 10:27Z |
| L9 | `npx tsx .tmp/probe5.mts` (classification) | 0 | `503 high-demand -> true` / `429 quota -> true` / `504 deadline -> false` / `AbortError -> false` | FAIL (F1) | 10:30Z |
| L10 | `grep -c geminiModelChain package.json` | 0 | `0` | FAIL (F2) | 10:26Z |
| L11 | `npx tsx src/services/__tests__/geminiModelChain.test.ts` | 0 | `tests 8 / pass 8 / fail 0` | PASS (guard works, unwired) | 10:25Z |
| L12 | route enumeration `grep -n "app.post('/api/" server.ts` | 0 | 9 routes; only `express.json` middleware | FAIL (F3) | 10:39Z |
| L13 | `curl /api/tts` (arbitrary client) | 0 | `HTTP=200` `{"success":true,"audioBase64":"UklGRpQkAQ…` 109468 bytes | FAIL (F3) | 10:37Z |
| L14 | `curl /api/stt` garbage base64 | 0 | `HTTP=200 {"transcript":"أعتذر، ولكنني لا أستطيع الاستماع…` | FAIL (F9) | 10:34Z |
| L15 | `curl /api/stt` silent WAV | 0 | `HTTP=200 {"transcript":"","error":"…503…UNAVAILABLE…","tier":"gemini_stt_error"}` | FAIL (F9) | 10:35Z |
| L16 | `curl /api/tts` WAV header parse | 0 | `RIFF size field 109460 actual-8 109460` | PASS | 10:34Z |
| L17 | soft-404 probe (4 paths) | 0 | all `HTTP=200 type=text/html` | FAIL (F5) | 10:39Z |
| L18 | header probe `/` and `/api/health` | 0 | only `strict-transport-security`; `x-powered-by: Express` | FAIL (F6) | 10:41Z |
| L19 | `npm audit --production` | 1 | `5 high severity vulnerabilities` (picomatch ReDoS) | FAIL (F10) | 10:39Z |
| L20 | `scripts/ui-audit.mjs` phone ar/fr/en | 0 | `Console errors: 0`; `08-nour tap=16` | FAIL (F7) | 10:36Z |
| L21 | live sub-44px enumeration (Noor screen) | 0 | 11 controls, 16px–40px | FAIL (F7) | 10:40Z |
| L22 | `grep` parent PIN | 0 | `pin: string; // 4-digit PIN for MVP` / `account.pin.trim() === enteredPin.trim()` | FAIL (F8) | 10:40Z |
| L23 | feed queue determinism probe (ar/fr/en) | 0 | `ar: 6/17 interactive`, `fr: 8/17`, `en: 3/17`, `0/17 wrong-script` | PASS/INFO (F12) | 10:35Z |
| L24 | misconception language probe | 0 | 68 with misconceptions, 35 Arabic; `off_scifr_2026` = 67/67 French | INFO (F11) | 10:34Z |
| L25 | CI runs on `main` | 0 | `CI … success`, `Engineering Execution OS Compliance … success` | PASS | 10:24Z |
| L26 | `git ls-remote --heads origin` | 0 | 176 branches; none for this assessment | PASS | 10:38Z |
| L27 | Vercel deployment list (`projectId` amina) | 0 | `dpl_9VcVttryi9 READY … 883127facf` | PASS | 10:39Z |
| L28 | `DEPLOY.md` budget claim vs code | N/A | `DEPLOY.md:23` "cannot outlive the limit" vs 4×20s=80s | FAIL (F4) | 10:41Z |

---

## 11. Audit conclusion

Miss Noor is a well-architected, honestly-degrading application with an unusually strong test
suite and a verifiable live artifact. It is **not** release-ready for an always-online child-facing
AI tutor because its central promise — a real teacher, not canned text — fails intermittently on
production (F1), the guard that would catch that failure is dormant (F2), and its AI surface is
open and unbounded (F3, F4).

The five P0/P1 items (F1–F4, F7) are all small, no-cost, and non-redesigning. Closing them, plus
the P2 hygiene items (F5, F6, F8, F9), is sufficient to move the verdict to **GO**. The ordered
tickets are in `docs/audits/MISS_NOOR_IMPLEMENTATION_BACKLOG.md`; the operational handover is in
`docs/audits/BLIND_SNIPER_HANDOVER.md`.

---

```text
COMPLIANCE HEADER
- Outcome claimed: COMPLETED — evidence-based independent audit with NOT-RELEASE-READY verdict.
- Tools confirmed this session: shell, git, curl, node/npx/tsx, Playwright-core + chromium, GitHub REST API, Vercel REST API.
- Tools absent / not claimed: Vercel runtime function logs (per-request), production write access, merge/deploy authority.
- Evidence refs: Verification Ledger L1–L28; probe scripts under /tmp (throwaway).
- Requirements: R1 PASS | R2 PASS | R3 FAIL | R4 FAIL | R5 FAIL | R6 FAIL | R7 FAIL | R8 FAIL | R9 PASS | R10 PASS
- Checks run (Verification Ledger): see §10, entries L1–L28 (each with exit code, raw excerpt, timestamp, result).
- Changed files: docs/audits/MISS_NOOR_INDEPENDENT_AUDIT.md, docs/audits/MISS_NOOR_IMPLEMENTATION_BACKLOG.md, docs/audits/BLIND_SNIPER_HANDOVER.md (diff inspected: Y).
- Regressions checked: N/A — documentation-only change; no source, config, curriculum, or data file touched.
- Not attempted / out of scope: curriculum content correctness, product redesign, deployment, merge, load testing.
- Blockers / unknowns: Vercel per-request logs not retrieved; F11 user-visibility not confirmed end-to-end.
- Repo/PR/deploy state: branch audit/miss-noor-independent-assessment-2026-11-18 @ baseline 883127facf34e256e7490a48622b9d14c695f6a3; PR opened by this audit; no merge, no deploy.
- Unsupported claims removed: Y
- Claim tags applied inline in body: Y
```
