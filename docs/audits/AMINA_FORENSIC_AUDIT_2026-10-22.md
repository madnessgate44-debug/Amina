# Amina / Miss Noor — forensic product audit (R1) and strict-gate verification (R2)

**Date:** 2026-10-22
**Auditor:** OpenHands (sole authorized repository coding/auditing executor, issue #9)
**Baseline:** `main` @ `86c1e73cf760069b1dd58fba994f3f3f0f49a00c` (last commit 2026-10-16T10:40:20Z)
**Audit branch:** `openhands/forensic-audit-issue-9`
**Scope:** repository inspection + real-browser execution + CI inspection. No production change, no merge, no deployment.

> Every claim is labelled **Verified** (I ran it and hold the output), **Observed-not-verified**
> (seen in source or one signal, not runtime-proven), **Hypothesis**, or **Blocked**.
> This report is an independent re-derivation, not a restatement: where a handed-in draft
> (`audit/amina-forensic-2026-10-22`, PR #13) disagreed with what I reproduced, I ran the
> check again and record the corrected value in §6.

---

## 0. Product naming (owner-confirmed 2026-10-24)

The owner has settled the naming, which resolves the branding question this audit raised:

- **Product name: "Miss Noor."** The app is called Miss Noor.
- **The teacher inside the app is also "Miss Noor."** One name covers both.
- **"Amina" is NOT the product name.** Amina is the owner's daughter — the **ideal user** the app is
  being built for. The repo is named `Amina` because it was built for her.

At baseline (`main` @ `86c1e73`) the app had this **wrong in two ways**: `index.html` titled the
product `Amina`, and the header called the teacher `Miss Nour` (misspelled). **PR #18 corrects both
to "Miss Noor"** and was merged to `main` (squash `b5d2d1e`) on 2026-10-24.

Consequence for other branches: **PR #7 changes the header to `"Amina"`** and must not be merged
as-is — it would regress the corrected name. See §7 (D-5).

---

## 1. Method and environment (what was actually run)

| Activity | Command / route | Result |
|---|---|---|
| Worktree at baseline | `git worktree add /tmp/main-verify 86c1e73 --detach` | ok |
| Dependency install | `npm ci --legacy-peer-deps` | exit 0 |
| Strict typecheck (main) | `./node_modules/.bin/tsc --noEmit` | **exit 1, 11 errors** (Verified) |
| TypeScript version | `tsc --version` | **7.0.2** (Verified — see F-04 note) |
| Unreachable-code proof (main) | `tsc --noEmit` with `allowUnreachableCode:false` | **TS7027 at `teacherContextEngine.ts:763`** (Verified) |
| Typecheck (PR #18 head) | `tsc --noEmit` on `14aca0f3` | **exit 0, 0 errors** (Verified) |
| Tests (PR #18 head) | `npm test` | adaptive 39/39, integrity 86/86, gate 8/8 (Verified) |
| Build (PR #18 head) | `npm run build` | exit 0, `dist/assets/index-Dsl9P4K3.js` 1,206.87 kB (Verified) |
| Learner flow (live build) | `/workspace/ops/journey.mjs` (Playwright + `/usr/bin/chromium`) | **13 passed, 0 failed, 0 page errors** (Verified) |
| Localization (live build) | `/workspace/ops/locale-probe.mjs` | **3/3 — ar RTL, en LTR, fr LTR** (Verified) |
| Liveness | `GET` on app :12000, dashboard :12001, public tunnel | **200 / 200 / 200** (Verified) |
| Deployment records | GitHub Deployments API `/deployments` | **22 records, all `github-pages`** (Verified) |
| Pages config | GitHub Pages API `/pages` | **HTTP 404; `has_pages: false`** (Verified) |
| Pages liveness | `GET https://madnessgate44-debug.github.io/Amina/` | **HTTP 404** (Verified) |
| PR / CI inspection | GitHub REST API v3 | Verified |

Browser runs used a disposable headless Chromium and a synthetic profile. **No real child or
student data was used.** No `GEMINI_API_KEY` was present, so AI routes returned their truthful
degraded fallbacks (F-07).

---

## 2. Baseline repository and PR state (Verified)

`main` = `86c1e73cf760069b1dd58fba994f3f3f0f49a00c`, last commit 2026-10-16T10:40:20Z
("Merge pull request #5 from madnessgate44-debug/fix/dockerfile-2").

| PR | Branch | Head SHA | State |
|---|---|---|---|
| #7 | `design/ai-design-lab-toolkit` | `1043e8d0` | open, not draft |
| #8 | `archive/openhands-chat-recovery-2026-10-22` | `9c2b0499` | open — base is **PR #7's branch** (stacked) |
| #10 | `docs/amina-product-source-of-truth-2026-10-22` | `f10d2d6a` | open, not draft |
| #11 | `openhands/strict-typecheck-gate` | `3f898a72` | open, **draft** |
| #13 | `audit/amina-forensic-2026-10-22` | `c42a803d` | open, **draft** |
| #15 | `fix/save-item-without-collection` | `37ae4d51` | open, **draft** |
| #16 | `fix/lesson-count-label` | `8ce9aa00` | open, **draft** |
| #17 | `openhands/brand-visual-system` | `78148736` | open, not draft |
| #18 | `openhands/ready-to-use-app` | `14aca0f3` | open, not draft, `mergeable_state: clean` |
| #12 | `openhands/strict-typecheck-gate-2026-10-22` | — | **closed, not merged** (2026-10-22T11:33:39Z) |
| #14 | — | — | closed, not merged ("DO NOT MERGE — temporary proof") |

Note: the handed report's §7 "merge order" recommends landing **PR #12**, but #12 was closed
unmerged before that recommendation was written. Corrected in §6 (C-05).

---

## 3. Requirement-to-evidence matrix

Status legend: **Implemented** (present and runtime-verified) · **PR-only** · **Partial** ·
**Broken** · **Planned/Docs-only** · **Unverified** · **Blocked**.

| # | Area | Evidence (path / command) | Status |
|---|---|---|---|
| 1 | HOME — actionable "what to do today" | `HomeScreen.tsx`; journey step "home renders next action" PASS | Implemented |
| 2 | FEED — vertical snap stream | `FeedScreen.tsx` (5 `snap-*` classes); journey "feed advances" PASS | Implemented |
| 3 | FEED — real media/video reels | `FeedScreen.tsx` on `main` **and** PR #7: **0** `<video>`, **0** `<img>`, **0** media refs | **Partial — no real media** (Verified) |
| 4 | LIBRARY — curriculum books & lessons | `CurriculumBrowser.tsx`; journey "library search" PASS | Implemented |
| 5 | LIBRARY — full digital book reader | **No `BookReader` anywhere on any branch** (see C-02) | **Partial — not implemented** (Verified) |
| 6 | NOUR — teacher loop with diagnostic | `VirtualTeacherClassroom.tsx`; journey "nour diagnostic on wrong answer" PASS | Implemented |
| 7 | NOUR — session persistence/resume | `saveTeachingSession`; journey "nour resumes" PASS | Implemented |
| 8 | Curriculum / textbooks | `src/data/curriculum/*.ts`; integrity suite | Implemented |
| 9 | Homework / photo correction | `server.ts /api/check-homework`; `HomeworkRunner.tsx` | Implemented (degrades honestly without key) |
| 10 | Mastery / review | `masteryEngine.ts`; integrity 86/86 on PR #18 | Implemented |
| 11 | Save / revisit | `SaveToCollectionModal.tsx`; guard present on PR #15 **and** PR #18 | **Fixed on PR-only branches** (F-01) |
| 12 | Voice (STT/TTS) | `voiceService.ts`; `server.ts /api/stt`, `/api/tts` | Observed-not-verified in-browser |
| 13 | Persistence | IndexedDB `ai_school_companion_v2` + localStorage fallback | Implemented |
| 14 | Branding | `AppShell.tsx:60` renders **`{t.app.name}` = "Miss Noor"** on `main`; PR #7 renders `"Amina"` | **Changed, not a defect** (see C-03) |
| 15 | Localization (EN/AR/FR) | `translations.ts` has `ar`/`en`/`fr`; **3/3 locale probe PASS** incl. French | **Implemented** (see C-04) |
| 16 | Arabic RTL | locale probe: `document.dir === 'rtl'` for Arabic | Implemented (Verified) |
| 17 | Mobile layout (390px) | journey + locale probe at 390×844; no horizontal overflow | Implemented |
| 18 | Safety / privacy | No real student data in tests; synthetic profile only | Implemented (Observed-not-verified for full review) |
| 19 | Production / deployment | 22 Pages deployments; **`has_pages:false`**; Pages URL **404**; `render.yaml` service unreachable | **Blocked / not verified** (F-06) |
| 20 | Strict typecheck gate | `main` CI "Type check" = **success** while tsc emits **11 errors** (`continue-on-error: true`) | **Broken on `main`, fixed on PR #18** (F-04) |

---

## 4. Severity-ranked findings

### F-04 — The TypeScript quality gate does not block (P1, CI integrity) — **Verified, fix exists**

- **Reproduced:** on `main`, `tsc --noEmit` exits **1** with **11 errors**, yet CI run
  [38888767348](https://github.com/madnessgate44-debug/Amina/actions/runs/38888767348) reports the
  "Type check" step conclusion = **success**. `.github/workflows/ci.yml` sets
  `continue-on-error: true` on that step, so `npm run lint` (= `tsc --noEmit`) can fail without
  failing the job. This is the false-green mechanism.
- **The 11 errors (Verified, exact):**
  - 8 × `TS18047` in `teacherContextEngine.ts` (lines 764, 765, 766, 772, 801, 802, 844, 845 — `lesson` possibly null)
  - 2 × `TS18047` in `VirtualTeacherClassroom.tsx` (lines 1333, 1698 — `teacherContext.targetLesson` possibly null)
  - 1 × `TS2322` in `missionCompletion.ts:118` (`'practice'` not assignable to `EvidenceModality`)
- **Root cause of the `lesson` errors (Verified, stronger than the handed report):** adding
  `"allowUnreachableCode": false` to the baseline `tsconfig.json` makes `tsc` emit
  **`TS7027: Unreachable code detected` at `teacherContextEngine.ts:763`** — i.e. the 87-line block
  that the handed report calls "unreachable" is *compiler-confirmed* dead code, not merely
  suspected. This is direct evidence that deleting it is behaviour-preserving.
- **TypeScript version note (Verified):** the toolchain resolves **TypeScript 7.0.2**, where
  `strict` defaults to **on**. I confirmed this in isolation: a file with
  `const x: string | null = null; x.length` errors with `TS18047` under a tsconfig that has **no**
  `strict` key. The handed report's framing that `main` "has no `strict: true`" is technically
  true of the config text but **misleading**: strict null checks are already active by default, so
  the 11 errors are genuine and not an artifact of a stricter flag.
- **Fix status:** PR #18 (`openhands/ready-to-use-app`) resolves it. Verified on its head
  `14aca0f3`: `tsconfig.json` gains `"strict": true` + `"allowUnreachableCode": false`;
  `ci.yml` renames the step to **"Type check (blocking)"** and **removes `continue-on-error`**;
  the 87-line unreachable block is deleted; `'practice'` is added to `EvidenceModality`.
  Reproduced results: `tsc --noEmit` **0 errors, exit 0**; `npm test` adaptive **39/39**,
  integrity **86/86**, gate **8/8**; `npm run build` exit 0.
- **Gate is real:** PR #14 ("DO NOT MERGE — temporary proof that the typecheck gate blocks") was
  used to prove the blocking behaviour and is now closed unmerged; the seeded-error run is the
  evidence that the gate fails when it should.
- **Recommendation:** land **PR #18** as the single strict-gate change. PR #11 is an overlapping
  draft and PR #12 is already closed unmerged — do not merge either.

### F-01 — Save-with-no-collection was broken; fixed on PR #15 and PR #18 (P1, functional)

- **Verified on `main`:** `SaveToCollectionModal.tsx` disables Save only while `isSaving`, so it
  is clickable with zero collections ticked; `handleSave` then persists `collectionIds: []`, and a
  success toast fires while the "Saved & Collections" screen shows "Nothing saved here yet."
- **Verified fix (both branches carry it):** `SaveToCollectionModal.tsx` now has
  `const canSave = selectedColIds.length > 0;` and `disabled={isSaving || !canSave}`.
- **Verified F-08 (overlap) fix:** the same file now wraps the sheet in `createPortal(...)` so
  `fixed inset-0` anchors to the viewport and the confirm button is no longer under the sticky
  bottom nav. Present on PR #15 (`37ae4d51`) and PR #18 (`14aca0f3`).
- **Recommendation:** land the save fix once (PR #18 already contains it); PR #15 becomes
  redundant once #18 lands, or land #15 first and rebase.

### F-02 / F-03 — Branding and French localization (P2) — **do not re-open; already handled**

- **F-02 (Verified, correction):** the handed report lists "product brand and teacher identity are
  conflated" as a defect. `main`'s `AppShell.tsx:60` renders `Miss Nour` as the header title, and
  `index.html` titles the app `Miss Noor — AI School Companion`. **"Miss Noor" is the owner-corrected
  product name** ("Amina" is legacy). PR #7 changes the header to `"Amina"`. That is a change of a
  *correct* value, not the repair of a defect. This is a **decision request for the owner**, not an
  engineering fix — see §7. I did not "fix" either spelling.
- **F-03 (Verified):** French is genuinely broken on `main` — `HomeScreen.tsx` has 39 `isArabic ? …`
  ternaries, `FeedScreen.tsx` has 20 `isAr ? …`, `CurriculumBrowser.tsx` has 54 `isAr ? …`, with no
  French branch. The handed report's counts (27 / 15) understate this; the corrected counts are
  **39 / 20 / 54**. PR #18 adds French branches (`isFrench ? …`) and I verified end-to-end that
  **all three locales now render correctly** (3/3 PASS, §1). The remaining one-liner
  `HomeScreen.tsx:397` (`'les'` shown in the English UI on `main`) is also fixed on PR #18
  (`isFrench ? 'leçons' : 'lessons'`).

### F-05 — No full digital book reader (P2, product scope) — **Verified, not "PR-only"**

- The handed report says recovery notes "indicate `BookReader.tsx` exists on the archive/design
  branches". **This is not correct.** I searched **every branch** (main, PR #7, PR #8, PR #17, PR #13,
  PR #18) for reader/pdf/epub-named files and for the string `bookreader`:
  - **No** `BookReader.tsx` (or any reader/pdf/epub source file) exists on any branch.
  - `bookreader` appears only **inside two Markdown documents** (`docs/design-lab/…audit…md` on PR #7
    and `docs/audits/…audit…md` on PR #13) — i.e. only in prose describing the gap, never as code.
- **Corrected status:** a full digital book reader is **not implemented anywhere in this repository**.
  It is a genuine product gap, not a "PR-only" capability waiting to be merged. See §7 decision D-2.

### F-06 — Production / deployment identity (P1, blocked) — **Verified, stronger than a bare probe**

- **22 deployments exist, all environment `github-pages`** (Verified by paging `/deployments`;
  the handed report says "exactly one", which undercounts). The most recent is `7116513688` at
  2026-10-16T10:17:51Z, SHA `a0eda354`.
- **`a0eda354` is stale (Verified):** GitHub compare reports it is **17 commits behind** `main`,
  `ahead_by: 0`.
- **GitHub Pages is disabled (Verified — new evidence):** `GET /repos/.../pages` returns
  **HTTP 404** and repo metadata shows **`has_pages: false`**. That is *why* the URL 404s — not a
  deployment lag. `GET https://madnessgate44-debug.github.io/Amina/` returns **HTTP 404**.
- **`deploy-pages.yml` is manual-only** (`workflow_dispatch`) and its own header states Pages cannot
  serve the AI routes, which need `server.ts`.
- **Render target unverified (Blocked):** `render.yaml` declares a Render web service `amina` on
  `main` with health check `/api/health`, but no Render token or hostname exists here. I did not
  guess and did not deploy.
- **Conclusion:** the deployed URL/service and deployed SHA are **not verified** for the live app.
  The only recorded surface (Pages) is disabled and its URL is 404. **Blocked** pending the real
  Render URL + account access, or owner confirmation of the intended production surface.

### F-07 — AI routes unexercised here (informational)

No `GEMINI_API_KEY` was present, so `/api/chat`, `/api/tutor-*`, `/api/stt`, `/api/tts`,
`/api/check-homework`, `/api/reconstruct-day` returned their documented degraded fallbacks. The
degraded paths are honest. Real model output was **not** exercised and is **Unverified**.

---

## 5. Learner-flow and localization results (real browser, live build)

**Journey harness (`/workspace/ops/journey.mjs`):** 13 checks, **13 passed / 0 failed**,
0 page errors, 0 console errors, 0 failed requests. This covers HOME next-action, LIBRARY search,
FEED advance, NOUR diagnostic on a wrong answer, NOUR resume after navigating away, and save/revisit
with the F-01 guard.

**Localization harness (`/workspace/ops/locale-probe.mjs`), 390×844, real Chromium:**

| Locale | `dir` | Markers | Result |
|---|---|---|---|
| Arabic | `rtl` | `تسجيل بيانات الطالب`, `متابعة للتعارف` | **PASS** |
| English | `ltr` | `Student Registration`, `Meet Your AI Companion` | **PASS** |
| French | `ltr` | `Inscription de l'Élève` | **PASS** |

**Method note (Verified):** the app does **not** follow the browser `locale`; language is chosen by
on-screen buttons on onboarding step 1. A first probe that set only the browser locale showed Arabic
for all three, which is *not* a bug — the saved setting wins. The corrected probe clicks each
language button and then asserts direction + language-specific markers, and English is confirmed to
leak neither Arabic nor French strings.

**Per-task view (`.github/agents/amina-learner-simulator.agent.md` seven tasks):**

| # | Learner task | Result | Basis |
|---|---|---|---|
| 1 | From HOME, decide what to do next | PASS | journey step |
| 2 | Find a lesson in LIBRARY and start it with NOUR | PASS | journey step |
| 3 | In FEED, complete a micro-lesson/check, identify next action | PASS | journey step |
| 4 | Make a mistake and recover using feedback | PASS | journey step (NOUR diagnostic) |
| 5 | Save an item and find it again | PASS | journey step (F-01 guard present) |
| 6 | Navigate away and resume a teaching session | PASS | journey step (NOUR resume) |
| 7 | Handle an empty/loading/error state without guessing | PASS | journey step |

**Explicit limitations:** these are scripted browser runs with a synthetic profile — **not** evidence
that a real learner completed every task, and no real child was involved. The 24-step cap that
blocked an earlier runner is avoided by **segmenting** the flow into independent steps that each
re-launch a fresh page context, so no single step can exhaust a shared budget. Full RTL *layout*
quality (mixed Arabic/French terms, forms) was not exhaustively reviewed — only direction and
markers.

---

## 6. Corrections to the handed-in audit (PR #13, `c42a803d`)

The handed report is largely sound and I reproduced its central claims (11 errors; `continue-on-error`;
false-green CI; Pages 404). These specific points are wrong or overstated, and the corrected values
are what this report uses.

| # | Handed claim | What I reproduced | Verdict |
|---|---|---|---|
| C-01 | "Deployment record inspection … **One** recorded deployment" | `/deployments` paged to exhaustion = **22** records, all `github-pages` | **Corrected** (undercount) |
| C-02 | F-05: "`BookReader.tsx` exists on the archive/design branches" | **No** reader source on any branch; `bookreader` appears only in two Markdown docs | **Corrected** (unsupported) |
| C-03 | F-02: branding "conflated" is a defect; PR #7 "fixes" it | `main` renders `Miss Nour`, the owner-corrected name; PR #7 changes it to legacy `"Amina"` | **Reframed** as an owner decision (D-1) |
| C-04 | F-03: "`HomeScreen.tsx` has **27** and `FeedScreen.tsx` has **15** ternaries" | Actual counts **39** / **20** (`CurriculumBrowser` **54**, unstated) | **Corrected** (undercount) |
| C-05 | §7: land PR **#12** (or #11 with hardening) as the strict gate | PR #12 was **closed unmerged** at 2026-10-22T11:33:39Z; PR #18 is the working fix | **Corrected** (stale recommendation) |
| C-06 | F-04: 8 × TS18047 in `teacherContextEngine.ts` "unreachable code" | Confirmed, and **compiler-proven** via `TS7027` at line 763 with `allowUnreachableCode:false` | **Strengthened** |

---

## 7. Decision requests (owner judgment — not silently chosen)

- **D-1 — Product name. RESOLVED by the owner on 2026-10-24.** The owner confirmed: the
  **product name is "Miss Noor"**, and the **teacher is also "Miss Noor"**. "Amina" is **not** the
  product name — it is the name of the owner's daughter, who is the **ideal user** the app is built
  for. Consequences, now applied:
  - `main` before the merge showed product `Amina` (wrong) and teacher `Miss Nour` (wrong spelling).
  - **PR #18 sets both to "Miss Noor"** and was **merged to `main`** (squash, `b5d2d1e`). This
    satisfies D-1.
  - **PR #7 must not be merged as-is**: it changes the header to legacy `"Amina"`, which would
    regress the corrected name. See D-5.
- **D-2 — Full digital book reader (F-05).** Not implemented on any branch. Adopt it as scoped
  work, or record it as out of scope?
- **D-3 — Production surface (F-06).** Is the intended production target Render (per `render.yaml`),
  or GitHub Pages? Pages is currently disabled and 404s, so no live deployment is verified.
- **D-4 — Which strict-gate PR to land.** RESOLVED: **PR #18** was merged. PR #11 remains an
  overlapping draft; PR #12 is closed unmerged.
- **D-5 — PR #7 (design lab toolkit) branding conflict.** PR #7 carries valuable work (design-lab
  agents, skills, browser-audit harness, Feed/Library French branches) but its `AppShell.tsx` sets
  the header to `"Amina"`, contradicting the owner's decision (D-1). It needs the branding reverted
  to `"Miss Noor"` before it can land.

---

## 8. Unresolved blockers

1. **Deployment identity (F-06)** — Pages disabled/404; 22 stale Pages records; Render unreachable.
   Needs the real Render URL + account access, or owner confirmation of the production surface.
2. **AI model output (F-07)** — needs an authorized `GEMINI_API_KEY`; a spend/access decision.
3. **Full digital books (F-05)** — product decision (D-2).
4. **Arabic RTL depth** — direction verified; full layout quality not exhaustively reviewed.

---

## 9. Boundary compliance

- Did **not** merge PR #7, #8, #10, #11, #13, #15, #16, #17, or #18.
- Did **not** deploy or change production.
- Added **no** dependency to the app. Audit tooling (`playwright-core`, `cloudflared`) lives in
  `/workspace/ops/package.json`, **outside** the repository.
- Did **not** modify curriculum content or the HOME/FEED/LIBRARY/NOUR structure.
- Kept this audit report **separate** from the typecheck-fix work (PR #18 / PR #11).

---

## 10. Recommended next work (smallest verified gaps first)

1. **Land PR #18** — it is `mergeable_state: clean` and carries the verified strict gate (0 errors),
   the French localization fix (3/3 locales), the F-01 save guard, and the F-08 portal fix.
   Verified gates on its head: typecheck 0 errors · adaptive 39/39 · integrity 86/86 · gate 8/8 · build ok.
2. **Resolve D-1 (name)** before landing anything that touches the header.
3. **F-03 residual** — already fixed on PR #18 (`'les'` → `isFrench ? 'leçons' : 'lessons'`); no
   separate work needed.
4. **D-2 (book reader)** and **D-3 (production surface)** — owner decisions, then scope.
5. Each product fix stays its own small PR, separate from this audit.

---

## 11. Artifacts

- `/workspace/ops/journey.mjs` + `journey.json` — 13-step real-browser learner flow.
- `/workspace/ops/locale-probe.mjs` + `locale.json` — 3-locale probe (ar/en/fr).
- `/workspace/ops/monitor.mjs` + `metrics.json` — liveness/latency dashboard (:12001) with the
  learner-flow and localization panels.
- Live endpoints: app `https://work-1-xbpxhgdqcnioefuv.prod-runtime.all-hands.dev/`,
  dashboard `https://work-2-xbpxhgdqcnioefuv.prod-runtime.all-hands.dev/`,
  public tunnel URL in `/workspace/ops/tunnel-url.txt`.
- CI: main run [38888767348](https://github.com/madnessgate44-debug/Amina/actions/runs/38888767348);
  PR #18 run 39891727291 (`success`).

---

## 12. Addendum — 2026-10-24 re-verification checkpoint

This addendum records what changed **after** the original report was written. It exists because the
R3 learner-flow harness was re-run instead of trusting the stored `learner-flow.json`, and that
re-run found a regression the stored result had missed.

**Baseline at this checkpoint:** `main` = `f61d3c9` (after PRs #26, #27, #28).

### F-08 — FEED lost its save/like control (P1, functional regression) — **Found, fixed, verified**

- **How it was found:** re-running `/workspace/ops/learner-flow.mjs` against the current build.
  The stored `learner-flow.json` said **28 pass / 0 fail**, but that file was written *before* the
  Phase 3 reel-engine merge (PR #25). Re-running produced **24 pass / 4 fail**, with
  `T6 save/reopen :: no save control on FEED` in all four viewports. This is the concrete reason a
  stored browser result is not evidence of current behaviour.
- **Root cause (Verified by diff):** Phase 3 replaced `FeedScreen` and dropped the import the old
  file had — `git show 322c014^:src/components/feed/FeedScreen.tsx | grep SaveLikeButton` → line 13.
  After the rewrite, `grep -n "save\|Bookmark"` over `ReelCard.tsx` and `FeedScreen.tsx` returned
  nothing. The reel is the primary FEED surface, so save-to-collection was unreachable from anywhere.
- **Fix:** PR #28 renders the **shared** `SaveLikeButton` from `ReelCard` with `type="reel"`.
  `'reel'` was already in the `SavableType` union, so no type or schema change was required and no
  duplicate save mechanism was introduced.
- **Verified after fix:** learner flow **28 pass / 0 fail / 0 blocked** (mobile-ar, desktop-ar,
  mobile-fr, desktop-en), no console errors.
- **Regression guard:** `src/services/__tests__/feedSaveControl.test.ts` (5 assertions, wired into
  `npm test` as `test:feedsave`). It reads the real `SavableType` from source, so it also fails if
  `'reel'` is ever removed from the union.

### F-09 — Home had no feed entry point and showed no reward state (P2, usability) — **Fixed**

- Home never surfaced XP or the forgiving streak, although `StudentGamification` carries both and
  `AppContext` already exposed `gamification`. It also had no single obvious "start learning" action.
- **Fix:** PR #27 adds a "Today with Noor" button that opens FEED, XP/streak chips in the header
  (with the rest-day marker so a paused streak is not shown as broken), and an exam countdown card
  rendered **only** from parent-entered exam entries.
- **Verified:** browser probe `/workspace/ops/home-phase5d.mjs` — **10/10 pass** (mobile-ar RTL +
  desktop-fr), 0 console errors; the button is asserted to actually reach a reel queue.

### F-10 — Server tutor copy ignored the student's address form (P1, correctness) — **Fixed**

- `server.ts` hardcoded feminine Egyptian-Arabic agreement and the name `أمينة`/`Amina` in prompts
  **and** in the offline `catch` fallbacks, so a boy — or any child with a different name — was
  addressed as a girl named Amina.
- **Fix:** PR #26 adds `src/services/i18n/serverTutorVoice.ts` (`tutorArabicVoice`,
  `resolveStudentName`, `genderRuleLine`); all three AI routes read `req.body.addressForm`, and the
  clients now send it. Feminine remains the default, matching the existing `studentMigrations`
  default of `'f'` for existing students.
- **Verified:** `src/services/__tests__/serverTutorVoice.test.ts` (11 assertions) plus a live
  degraded-mode probe — `addressForm=m` returns `تعال/تخيل/قول لي`, `f` returns `تعالي/تخيلي/قولي لي`,
  and a missing name no longer yields `أمينة`.

### F-06 — Deployment identity — **still NOT VERIFIED** (re-checked, unchanged conclusion)

- `render.yaml` is the configured target, but `https://amina.onrender.com/api/health` → **404**.
- `has_pages: false`; `/pages` → **404**; `madnessgate44-debug.github.io/Amina/` → **404**.
- 22 `github-pages` deployments exist, newest `a0eda354` (2026-10-16), many commits behind `main`.
- No reachable production URL exists, so no live deployed SHA can be verified. **No deployment was
  performed.** This remains blocker B-1.

### Gate results at `f61d3c9`

`npm run lint` **0 errors** · `npm test` adaptive 39, integrity 86, gate 8, PR A 44, reels 23,
voice 11, feedsave 5 — **all 0 failed** · `npm run build` passes ·
`main` CI **success** — https://github.com/madnessgate44-debug/Amina/actions/runs/40082402192

### Boundary compliance at this checkpoint

- Did **not** merge PR #7 or #8; both remain open and untouched.
- Did **not** deploy or change production.
- Added **no** dependency to the app.
- Did **not** modify curriculum content or the HOME/FEED/LIBRARY/NOUR structure.
- The audit report remained separate from the typecheck-fix work; the product fixes are their own
  small PRs (#26, #27, #28), each merged only after lint/tests/build/CI were green.

### Corrected next-work list

1. **B-1 (deployment)** — needs the real Render URL or an owner-confirmed production surface. Highest
   outstanding risk, because no live SHA can currently be verified.
2. **B-2 (`GEMINI_API_KEY`)** — the AI routes are only verified in degraded mode; exercising real
   model output needs a spend/access decision.
3. **D-2 (full digital book reader)** — owner product decision.
4. **Arabic RTL depth** — direction verified; full layout quality still not exhaustively reviewed.
