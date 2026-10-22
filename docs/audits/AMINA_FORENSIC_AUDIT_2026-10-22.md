# Amina / Miss Nour — forensic product audit (R1) and gate verification (R2)

**Date:** 2026-10-22
**Auditor:** OpenHands (authorized repository coding/auditing executor per issue #9)
**Baseline:** `main` @ `86c1e73cf760069b1dd58fba994f3f3f0f49a00c` (last commit 2026-10-16T10:40:20Z)
**Audit branch:** `audit/amina-forensic-2026-10-22`
**Scope:** repository inspection + real browser execution + CI inspection. No production change, no merge, no deployment.

> Every claim below is labelled **Verified** (I ran it and have the output/artifact), **Observed-not-verified** (seen in source or a single signal, not runtime-proven), **Hypothesis**, or **Blocked**. Nothing here is presented as a fact that I did not actually check.

---

## 1. Method and environment (what was actually run)

| Activity | Command / route | Result |
|---|---|---|
| Dependency install | `npm ci --legacy-peer-deps` | exit 0, 145 packages |
| Strict typecheck (main) | `npm run lint` (`tsc --noEmit`) | exit 1, **11 errors** (Verified) |
| Unit/adaptive/teaching/integrity tests (main) | `npm test` | exit 0, integrity 66/66 (Verified) |
| Production build (main) | `npm run build` (`vite build`) | exit 0 (Verified) |
| Typecheck (PR #11) | `npx tsc --noEmit` on `3abfa2e` | exit 0, **0 errors** (Verified) |
| Tests (PR #11) | adaptive 39/39, teaching pass, integrity 72/72 | exit 0 (Verified) |
| Build (PR #11) | `npx vite build` | exit 0 (Verified) |
| Rendered browser audit (main) | `scripts/design-lab-browser-audit.mjs` against a real production build | 13 screenshots, 21 checks, 3 FAIL (Verified) |
| Seven-task learner walkthrough (main) | `scripts/learner-flow-audit.mjs` (new, this branch) | 6 PASS / 1 FAIL (Verified) |
| CI inspection | GitHub Actions API, runs for `main` and PR #11 | Verified |
| Deployment record inspection | GitHub Deployments API (`/deployments`), environment `github-pages` | One recorded deployment, SHA `a0eda354`, 17 commits behind `main` (Verified) |
| Deployment liveness | `GET https://madnessgate44-debug.github.io/Amina/` | **HTTP 404** "Site not found" (Verified) |
| Deployment probe | `GET /api/health` on candidate Render hosts | 404 on all (Blocked) |

Browser runs used a disposable headless Chromium, a synthetic profile (`Learner QA`), and no real child or student data. No `GEMINI_API_KEY` was present in this environment, so AI routes returned their truthful degraded fallbacks; that is stated where it affects a result.

---

## 2. Baseline repository and PR state (Verified)

| Ref | SHA | State | Note |
|---|---|---|---|
| `main` | `86c1e73` | — | The baseline for this audit. |
| PR #7 `design/ai-design-lab-toolkit` | `1043e8d0` | open, not draft | 24 files changed. Not merged (per boundary). |
| PR #8 `archive/openhands-chat-recovery-2026-10-22` | `33e89024` | open | Chat-hub archive. Base is PR #7's branch. Not merged. |
| PR #10 `docs/amina-product-source-of-truth-2026-10-22` | `f10d2d6a` | open | 1 file: `docs/AMINA_PRODUCT_SOURCE_OF_TRUTH.md`. Not merged. |
| PR #11 `openhands/strict-typecheck-gate` | `3abfa2e1` | open, **draft** | 6 files; the R2 fix. Not merged. |

Note: PR #8's base is the PR #7 design branch, so it is stacked, not based on `main`.

---

## 3. Requirement-to-evidence matrix

Status legend: **Implemented** (present and runtime-verified), **PR-only** (exists on a branch, not `main`), **Partial**, **Broken**, **Planned/Docs-only**, **Unverified**, **Blocked**.

| # | Area | Evidence (path / command / artifact) | Status |
|---|---|---|---|
| 1 | HOME — actionable "what to do today" | `src/components/home/HomeScreen.tsx`; learner-flow task 1 PASS; `artifacts/learner-flow/task1-home.png` | Implemented |
| 2 | FEED — vertical short-form stream | `src/components/feed/FeedScreen.tsx`; snap-scroll advances (harness check "Feed advances when scrolled"); learner-flow task 3 PASS | Implemented |
| 3 | FEED — real media/video reels | No `<video>`/reel media in `FeedScreen.tsx`; cards are text + "Learn with Nour" | Partial (no real reels media) |
| 4 | LIBRARY — curriculum books & lessons | `src/components/curriculum/CurriculumBrowser.tsx`; French search returns results; `artifacts/learner-flow/task2-library-search.png` | Implemented |
| 5 | LIBRARY — full digital book reader | No `BookReader` component on `main`; "Open Book" opens `LessonStudyModal` only (`CurriculumBrowser.tsx:616`) | Partial (lesson modal, not a full book) |
| 6 | NOUR — teacher loop with diagnostic | `src/components/teacher/VirtualTeacherClassroom.tsx`; wrong option yields pedagogical diagnosis + hint (learner-flow task 4 PASS) | Implemented |
| 7 | NOUR — session persistence/resume | `saveTeachingSession` (`IndexedDBStorageService.ts:1319`); learner-flow task 6 PASS (state intact after navigating away and back) | Implemented |
| 8 | Curriculum/textbooks | `src/data/curriculum/*.ts` (10 subject files incl. French variants); 9 Ministry books listed | Implemented |
| 9 | Homework / photo correction | `server.ts:535 /api/check-homework`; `src/components/missions/HomeworkRunner.tsx` (photo capture) | Implemented (degrades honestly without key) |
| 10 | Mastery / review | `src/services/mastery/masteryEngine.ts`; `src/services/review/*`; integrity suite 66/66 | Implemented |
| 11 | Save / revisit | Save → Collections flow; learner-flow task 5 **FAIL** (see F-01 **and F-08**) | **Broken** |
| 12 | Voice (STT/TTS) | `src/services/voice/voiceService.ts` (Web Speech + MediaRecorder); `server.ts /api/stt`, `/api/tts` | Implemented (Observed-not-verified in-browser) |
| 13 | Persistence | IndexedDB `ai_school_companion_v2` + localStorage fallback | Implemented |
| 14 | Branding | Header renders "Miss Nour" + learner name (`AppShell.tsx`); harness check "brand and teacher identity are distinct" **FAIL** on `main` | Partial (F-02) |
| 15 | Localization (EN/AR/FR) | `src/i18n/translations.ts` has `ar`/`en`/`fr`; French Feed copy check **FAIL**; French search placeholder check **FAIL** (F-03) | **Broken (FR)** |
| 16 | Arabic RTL | Harness check "Arabic page exposes RTL direction" PASS (`document.dir === 'rtl'`) | Implemented |
| 17 | Mobile layout (390px) | 13 captures, "no horizontal overflow" PASS at 390px and 1365px | Implemented |
| 18 | Safety/privacy | Homework honesty rules in `server.ts` prompt; no real student data in tests; `render.yaml` notes key in dashboard | Implemented (Observed-not-verified for full privacy review) |
| 19 | Production/deployment | Only recorded deployment `7116513688` = Pages, SHA `a0eda354` (17 behind `main`); Pages URL 404; `render.yaml` service `amina` unreachable | **Blocked / stale** (F-06) |
| 20 | Strict typecheck gate | `main` CI "Type check" step = success **while tsc emits 11 errors** (`continue-on-error: true`) | **Broken** (F-04) |

---

## 4. Severity-ranked findings

### F-01 — Saved items can be filed into no collection and then appear lost (P1, functional)
- **Verified.** Learner-flow task 5 FAIL. Sequence: FEED card → "Save to Collection" → modal → "Save Item". The modal's Save button is only disabled while `isSaving`, so it is clickable with zero collections selected (`SaveToCollectionModal.tsx:196`). `handleSave` then calls `saveContent` with `collectionIds: []`; `saveItem` persists the item, and `handleSaveContent` shows the toast "Saved to collection" (`AppContext.tsx:926`).
- **Exact behaviour (Verified in source + capture):** the item *is* written to storage, so it still appears under Review → Saved Items → "All Saves" (`ReviewScreen.tsx:67`, which lists all `savedItems`). But it belongs to no collection, so the **"Saved & Collections" screen shows "Nothing saved here yet."** while the success toast is still on screen. Default collections always exist at this point (ensured in `AppContext.tsx:340`), so this is purely "the learner did not tick a box", not "no collections exist".
- **Evidence:** `artifacts/learner-flow/task5-collections.png` — empty collection list and the "Saved to collection" toast in the same capture. `artifacts/learner-flow/learner-flow-report.json` (task 5 detail).
- **Impact:** the confirmation message and the "Saved & Collections" destination both imply the item was filed somewhere it can be reopened; instead it is unfiled and invisible on that screen. It is a trust and findability defect in the save/revisit loop, not total data loss.
- **Smallest safe fix (for a separate PR, not this audit):** in `SaveToCollectionModal.handleSave`, when `selectedColIds` is empty, either require a selection (disable Save until one is chosen) or default to a real collection before persisting. Either way the toast must reflect reality. Behaviour-preserving elsewhere.
- **Update 2026-10-22T11:36Z:** a guard for this is now proposed on PR #15 (`ec4f48ef74`) and independently re-checked here (guard present, integrity 69/69). **But the guard alone does not make the flow work** — see **F-08** in `AMINA_AUDIT_ADDENDUM_MODAL_OCCLUSION_2026-10-22.md`: the same button is physically covered by the bottom nav, so even an enabled button does nothing on a real tap. F-01 and F-08 must both be fixed for the save/revisit loop to work.

### F-02 — Product identity and teacher identity are conflated (P2, branding) — **already fixed on PR #7**
- **Verified** on `main`. The persistent header renders "Miss Nour" as the app title with the learner name beneath (`AppShell.tsx:60`). Harness check "product brand and teacher identity are distinct" expects both "Amina" and "Miss Nour" and FAILs on `main`.
- **Evidence:** `docs/audits/evidence/design-audit/04-home-mobile.png`.
- **PR #7 already fixes this** (Verified): its `AppShell.tsx` renders `Amina` as the title with `Miss Nour · <name>` beneath. Running the audit against a build of PR #7's branch gives **25/25 checks passing**, including this one. See `docs/audits/evidence/pr7-verified/design-audit-report.json`.
- **Consequence:** do not open a separate branding fix. Merging PR #7 resolves F-02 on `main`.

### F-03 — French selection yields mixed-language UI (P1, localization) — **already fixed on PR #7**
- **Verified** on `main`. With French selected: HOME shows "Welcome, Learner QA!", "Your personal AI School Companion", "What Should I Do Now, Miss Nour?"; FEED's intro is English ("Nour is teaching you now"); LIBRARY's search placeholder is English.
- **Root cause (Verified):** `HomeScreen.tsx` has 27 and `FeedScreen.tsx` has 15 `isArabic ? … : 'English'` ternaries with no French branch, and `CurriculumBrowser.tsx:213` has no French placeholder. The `fr` dictionary exists in `translations.ts` but these strings are hard-coded.
- **PR #7 already fixes the audited cases** (Verified): its `FeedScreen.tsx` adds `isFr` branches ("Nour t'accompagne maintenant", "Un moment d'apprentissage choisi par Nour"), and its `CurriculumBrowser.tsx` adds a `Rechercher…` placeholder. Running the audit against a build of PR #7's branch gives **25/25 checks passing**, including "French Feed intro uses French UI copy" and "curriculum search placeholder is French in French mode".
- **Separate real i18n defect found while inspecting (still open on `main` and on PR #7):** `HomeScreen.tsx:397` renders `{isArabic ? 'دروس' : 'les'}` — the French word "les" is shown in the **English** UI. This is a genuine bug independent of F-03 and is not addressed by PR #7.
- **Evidence:** `docs/audits/evidence/design-audit/04-feed-mobile.png` (baseline) vs `docs/audits/evidence/pr7-verified/` (PR #7).
- **Consequence:** do not re-do the Feed/Library French work; merging PR #7 resolves those. The `HomeScreen.tsx:397` string remains a small, separate fix.

### F-04 — The TypeScript quality gate does not block (P1, CI integrity)
- **Verified, both by reproduction and by CI records.** `npm run lint` on `main` exits 1 with 11 errors, yet CI run [38888767348](https://github.com/madnessgate44-debug/Amina/actions/runs/38888767348) shows the "Type check" step conclusion = **success**. `.github/workflows/ci.yml` sets `continue-on-error: true` on that step.
- **The 11 errors (Verified):** 8 × TS18047 in `teacherContextEngine.ts` (unreachable code after an unconditional `return` disables narrowing), 2 × TS18047 in `VirtualTeacherClassroom.tsx` (`targetLesson` nullable), 1 × TS2322 in `missionCompletion.ts` (`'practice'` missing from `EvidenceModality`).
- **Status of the fix:** two overlapping drafts fix it, and both have been independently verified by two separate OpenHands runs.
  - **PR #11** (`openhands/strict-typecheck-gate`) removes `continue-on-error`, deletes the 87-line unreachable block, adds `'practice'` to `EvidenceModality` with an explicit `1.0` weight, and adds optional chaining; a follow-up hardening on the same branch declares `strict: true` + `allowUnreachableCode: false` and adds a `strictTypecheckGate` regression suite. Verified: 0 type errors, adaptive 39/39, integrity 72/72, build pass. The gate was also proven to fail correctly — a deliberately seeded error made CI run 39770574935 exit 1.
  - **PR #12** (`openhands/strict-typecheck-gate-2026-10-22`) does the same and additionally sets `"strict": true` and `"allowUnreachableCode": false` in `tsconfig.json`, adds a dedicated gate suite (`strictTypecheckGate.test.ts`, 8 checks), and wires `test:gate` into `npm test`. Verified: `tsc --noEmit` → 0 errors, adaptive 39/39, integrity 66/66, gate 8/8, build pass; a browser walkthrough against PR #12's build gives 6/7 (only the known F-01 save defect, fixed separately by PR #15), so strict mode does not break runtime.
- **Recommendation:** land **one** of the two and close the other as superseded. PR #12 is the stronger variant on paper (config-level `strict`, dedicated gate suite); PR #11 has the extra seeded-error CI proof. Either resolves F-04; do not merge both.

### F-05 — No full digital book reader (P2, product scope)
- **Observed-not-verified.** `main` has no `BookReader`; "Open Book" opens `LessonStudyModal`. The product source of truth (PR #10) asks for full digital books, not only sample cards. Recovery notes indicate `BookReader.tsx` exists on the archive/design branches — so this is a **PR-only** capability, not on `main`.

### F-06 — Production/deployment identity: Pages deployment is stale, Render identity unverified (P1, blocked/partial)
- **Verified (stronger than a bare probe).** GitHub records exactly one deployment for this repo: deployment `7116513688`, environment `github-pages`, `ref: main`, deployed SHA `a0eda3542170fd3356559b446eb0bcac75790568`, status `success` at 2026-10-16T10:18:06Z, produced by run [38886228008](https://github.com/madnessgate44-debug/Amina/actions/runs/38886228008).
- **Verified: that SHA is stale.** GitHub's compare API reports `a0eda354` is **17 commits behind** `main` (`86c1e73`), `ahead_by: 0`. So even the only recorded deployment does not correspond to current `main`.
- **Verified: the Pages URL is not live.** `GET https://madnessgate44-debug.github.io/Amina/` returns **HTTP 404** with the GitHub Pages "Site not found" page, despite the recorded success status. The `deploy-pages.yml` workflow is manual-only (`workflow_dispatch`) and its own header says Pages cannot serve the AI routes (they need `server.ts`).
- **Blocked: the Render target.** `render.yaml` configures a Render web service named `amina` on branch `main` with health check `/api/health`, but no Render API token or deployed hostname exists in this environment. Probes of `amina.onrender.com`, `amina-1.onrender.com`, and `miss-noor.onrender.com` all returned **404** on `/api/health`, and no `onrender.com` URL is referenced anywhere in the repository.
- **Conclusion:** the deployed URL/service and deployed SHA are **not verified** for the live app. The one recorded deployment (`a0eda354`) is 17 commits behind `main` and its URL is 404. I did not guess and did not deploy. Closing this needs either the real Render URL + Render account access, or the owner confirming GitHub Pages is not the intended production surface.

### F-07 — AI routes unexercised in this environment (informational)
- No `GEMINI_API_KEY` was present, so `/api/chat`, `/api/tutor-*`, `/api/stt`, `/api/tts`, `/api/check-homework`, `/api/reconstruct-day` returned their documented degraded fallbacks. The app renders and the degraded paths are honest ("I can't check this right now…"), which is correct behaviour — but real model output was **not** exercised here and is **Unverified**.

### F-08 — The Save-to-Collection confirm button is physically unclickable (P1, functional)

**Verified.** See the companion addendum `AMINA_AUDIT_ADDENDUM_MODAL_OCCLUSION_2026-10-22.md` for the full analysis. In short: the sheet is a `fixed inset-0` overlay mounted inside a FEED card that carries `backdrop-blur-xl`, so the card becomes the containing block for the fixed sheet and its footer lands under the sticky bottom nav. At 390×844 the button's centre hit-tests to `NAV`; at 1365×900 it hits a sibling `SPAN`. A real tap therefore does nothing even though the button is enabled.

- **Independent of F-01, and not fixed by PR #15.** With a collection selected the guard enables the button, but it is still occluded.
- **Evidence:** `docs/audits/evidence/modal-occlusion/` (baseline) and `docs/audits/evidence/modal-occlusion-pr15-fix/` (PR #15), plus `scripts/modal-occlusion-probe.mjs`.
- **Impact:** any browser evidence that force-clicks or dispatches a synthetic DOM click in this flow can report a false PASS.

---

## 5. Learner-flow results (seven tasks, `main`)

| Task | Result | Evidence |
|---|---|---|
| 1. From HOME, decide what to do next | PASS | `task1-home.png` — next-action prompt + study-time selector |
| 2. Find a lesson in LIBRARY and start it with NOUR | PASS | `task2-library-search.png`, `task2-after-open.png` |
| 3. In FEED, complete a micro-lesson/check and identify next action | PASS | `task3-feed-top.png`, `task3-feed-after-scroll.png` |
| 4. Make a mistake and recover using feedback | PASS | `task4-nour-diagnostic.png`, `task4-nour-feedback.png` — wrong option → pedagogical diagnosis + hint |
| 5. Save an item and find it again | **FAIL** | `task5-save-modal.png`, `task5-collections.png` — two independent causes: F-01 (save allowed with no collection) and F-08 (the confirm button is occluded, so a real tap never fires) |
| 6. Navigate away from and resume a teaching session | PASS | `task6-nour-open.png`, `task6-nour-resumed.png` |
| 7. Handle an empty/loading/error state without guessing | PASS | `task7-home-state.png` — empty state explicitly labelled |

Coverage: mobile 390×844 and desktop 1365×900; English onboarding and French learner profile; Arabic RTL verified by the companion audit (`artifacts/design-audit/08-home-arabic-rtl-mobile.png`).

**Explicit limitation:** the walkthrough is a scripted browser run with a synthetic profile. Task 5's failure is a genuine product defect, not a harness artifact (the toast and the empty collection list are both visible in one capture). Tasks 4/6 were initially BLOCKED on a harness limitation (modals intercepting nav clicks) and PASS after the harness was corrected — the corrected run is the one reported. A real learner has not been involved; no real child or student data was used.

---

## 6. Unresolved blockers

1. **Deployment identity (F-06)** — the only recorded deployment (Pages, `a0eda354`) is 17 commits behind `main` and its URL 404s. The Render service in `render.yaml` is unreachable from here. Needs the real Render URL + account access, or owner confirmation of the intended production surface.
2. **AI model output (F-07)** — needs an authorized `GEMINI_API_KEY` for a hosted run, which is a spend/access decision for the owner.
3. **Arabic RTL depth** — direction is verified RTL, but full RTL layout quality (mixed Arabic/French curriculum terms, forms) was not exhaustively checked.
4. **Full digital books (F-05)** — a product decision: should `main` adopt the `BookReader` that exists on the design/archive branches?

---

## 7. Recommended next work (smallest verified gaps first)

0. **Merge order (verified):** land one strict-gate PR (**#12**, or #11 with its config hardening) and close the other; land **PR #15** (F-01 save guard); land **PR #7** (design lab + French + branding); land **PR #13** (this audit) and **PR #10** (product source of truth) as documentation. PR #8 (chat archive) is stacked on PR #7.
1. **Fix F-01 (save with no collection)** — delivered in **PR #15**; needs review. It is necessary but **not sufficient on its own**: see F-08.
2. **Fix F-08 (occluded confirm button)** — the same button is physically covered at both tested viewports, so the save loop still appears frozen to a learner after F-01 lands. Fix by portalling the sheet to `document.body` (or hoisting it out of the blurred FEED card). Land F-01 and F-08 together; add a hit-testing regression test, not a synthetic-click one.
3. **Land the strict gate (F-04)** — verified; removes a false-green CI gate. Two overlapping drafts (PR #11, PR #12); pick one and close the other.
4. **F-03 remaining** — the Feed/Library French work is already done on PR #7; only `HomeScreen.tsx:397` (`'les'` in the English UI) still needs a one-line fix.
5. **F-02 branding** — already done on PR #7; no separate work needed.
6. **F-05** — decide whether to bring `BookReader` from the design branch to `main`.

Each of these should be its own small PR, kept separate from this audit report.

---

## 8. Boundary compliance

- Did not merge PR #7, #8, #10, or #11.
- Did not deploy or change production.
- Added no dependencies to the app (`playwright` was installed locally with `--no-save` for auditing only, and is not in `package.json`).
- Did not modify curriculum content, branding, or the HOME/FEED/LIBRARY/NOUR structure.
- Kept this audit report separate from the typecheck fix (PR #11).

---

## 9. Artifacts referenced

- `docs/audits/evidence/learner-flow/` — report JSON + 17 screenshots.
- `docs/audits/evidence/design-audit/` — baseline report JSON + 13 screenshots (3 FAIL).
- `docs/audits/evidence/pr7-verified/` — PR #7 build: report JSON + 13 screenshots (25/25 checks PASS).
- `scripts/learner-flow-audit.mjs` (new, this branch) — reproducible seven-task harness.
- CI: main run [38888767348](https://github.com/madnessgate44-debug/Amina/actions/runs/38888767348); PR #11 run [39765429795](https://github.com/madnessgate44-debug/Amina/actions/runs/39765429795).
