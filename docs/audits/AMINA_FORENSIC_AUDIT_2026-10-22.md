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
| 11 | Save / revisit | Save → Collections flow; learner-flow task 5 **FAIL** (see F-01) | **Broken** |
| 12 | Voice (STT/TTS) | `src/services/voice/voiceService.ts` (Web Speech + MediaRecorder); `server.ts /api/stt`, `/api/tts` | Implemented (Observed-not-verified in-browser) |
| 13 | Persistence | IndexedDB `ai_school_companion_v2` + localStorage fallback | Implemented |
| 14 | Branding | Header renders "Miss Nour" + learner name (`AppShell.tsx`); harness check "brand and teacher identity are distinct" **FAIL** on `main` | Partial (F-02) |
| 15 | Localization (EN/AR/FR) | `src/i18n/translations.ts` has `ar`/`en`/`fr`; French Feed copy check **FAIL**; French search placeholder check **FAIL** (F-03) | **Broken (FR)** |
| 16 | Arabic RTL | Harness check "Arabic page exposes RTL direction" PASS (`document.dir === 'rtl'`) | Implemented |
| 17 | Mobile layout (390px) | 13 captures, "no horizontal overflow" PASS at 390px and 1365px | Implemented |
| 18 | Safety/privacy | Homework honesty rules in `server.ts` prompt; no real student data in tests; `render.yaml` notes key in dashboard | Implemented (Observed-not-verified for full privacy review) |
| 19 | Production/deployment | `render.yaml` (service `amina`, branch `main`); live probe 404 on candidate hosts | **Blocked** (F-06) |
| 20 | Strict typecheck gate | `main` CI "Type check" step = success **while tsc emits 11 errors** (`continue-on-error: true`) | **Broken** (F-04) |

---

## 4. Severity-ranked findings

### F-01 — Saved items can be filed into no collection and then appear lost (P1, functional)
- **Verified.** Learner-flow task 5 FAIL. Sequence: FEED card → "Save to Collection" → modal → "Save Item". The modal's Save button is only disabled while `isSaving`, so it is clickable with zero collections selected (`SaveToCollectionModal.tsx:196`). `handleSave` then calls `saveContent` with `collectionIds: []`; `saveItem` persists the item, and `handleSaveContent` shows the toast "Saved to collection" (`AppContext.tsx:926`).
- **Exact behaviour (Verified in source + capture):** the item *is* written to storage, so it still appears under Review → Saved Items → "All Saves" (`ReviewScreen.tsx:67`, which lists all `savedItems`). But it belongs to no collection, so the **"Saved & Collections" screen shows "Nothing saved here yet."** while the success toast is still on screen. Default collections always exist at this point (ensured in `AppContext.tsx:340`), so this is purely "the learner did not tick a box", not "no collections exist".
- **Evidence:** `artifacts/learner-flow/task5-collections.png` — empty collection list and the "Saved to collection" toast in the same capture. `artifacts/learner-flow/learner-flow-report.json` (task 5 detail).
- **Impact:** the confirmation message and the "Saved & Collections" destination both imply the item was filed somewhere it can be reopened; instead it is unfiled and invisible on that screen. It is a trust and findability defect in the save/revisit loop, not total data loss.
- **Smallest safe fix (for a separate PR, not this audit):** in `SaveToCollectionModal.handleSave`, when `selectedColIds` is empty, either require a selection (disable Save until one is chosen) or default to a real collection before persisting. Either way the toast must reflect reality. Behaviour-preserving elsewhere.

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
- **Status of the fix:** two competing PRs fix it. **PR #11** removes `continue-on-error`, deletes the 87-line unreachable block, adds `'practice'` to `EvidenceModality`, and adds optional chaining. **PR #12** does the same **and** sets `"strict": true` and `"allowUnreachableCode": false` in `tsconfig.json`, adds a dedicated gate suite (`strictTypecheckGate.test.ts`, 8 checks), and wires `test:gate` into `npm test`.
- **Both independently verified here:** each gives `tsc --noEmit` → **0 errors** and passing suites. On PR #12: adaptive **39/39**, integrity **66/66**, gate **8/8**, build pass; a browser walkthrough against PR #12's build gives 6/7 (only the known F-01 save defect, fixed separately by PR #15), so strict mode does not break runtime.
- **Recommendation:** land **PR #12** and close **PR #11** as superseded. Neither is merged.

### F-05 — No full digital book reader (P2, product scope)
- **Observed-not-verified.** `main` has no `BookReader`; "Open Book" opens `LessonStudyModal`. The product source of truth (PR #10) asks for full digital books, not only sample cards. Recovery notes indicate `BookReader.tsx` exists on the archive/design branches — so this is a **PR-only** capability, not on `main`.

### F-06 — Production/deployment identity not verifiable from here (P1, blocked)
- **Blocked.** `render.yaml` configures a Render web service named `amina`, branch `main`, health check `/api/health`, free plan. I probed `amina.onrender.com`, `amina-1.onrender.com`, and `miss-noor.onrender.com`; all returned **404** on `/api/health`. There is no recorded deployed URL or Render API token in this environment.
- **What was checked:** `render.yaml` (blob `59bf2463`), the three host probes above, and the repo's GitHub Pages workflow (manual-only, and its own comment says Pages cannot serve the AI routes).
- **Conclusion:** the deployed URL and deployed SHA are **not verified**. I did not guess and did not deploy.

### F-07 — AI routes unexercised in this environment (informational)
- No `GEMINI_API_KEY` was present, so `/api/chat`, `/api/tutor-*`, `/api/stt`, `/api/tts`, `/api/check-homework`, `/api/reconstruct-day` returned their documented degraded fallbacks. The app renders and the degraded paths are honest ("I can't check this right now…"), which is correct behaviour — but real model output was **not** exercised here and is **Unverified**.

---

## 5. Learner-flow results (seven tasks, `main`)

| Task | Result | Evidence |
|---|---|---|
| 1. From HOME, decide what to do next | PASS | `task1-home.png` — next-action prompt + study-time selector |
| 2. Find a lesson in LIBRARY and start it with NOUR | PASS | `task2-library-search.png`, `task2-after-open.png` |
| 3. In FEED, complete a micro-lesson/check and identify next action | PASS | `task3-feed-top.png`, `task3-feed-after-scroll.png` |
| 4. Make a mistake and recover using feedback | PASS | `task4-nour-diagnostic.png`, `task4-nour-feedback.png` — wrong option → pedagogical diagnosis + hint |
| 5. Save an item and find it again | **FAIL** | `task5-save-modal.png`, `task5-collections.png` — see F-01 |
| 6. Navigate away from and resume a teaching session | PASS | `task6-nour-open.png`, `task6-nour-resumed.png` |
| 7. Handle an empty/loading/error state without guessing | PASS | `task7-home-state.png` — empty state explicitly labelled |

Coverage: mobile 390×844 and desktop 1365×900; English onboarding and French learner profile; Arabic RTL verified by the companion audit (`artifacts/design-audit/08-home-arabic-rtl-mobile.png`).

**Explicit limitation:** the walkthrough is a scripted browser run with a synthetic profile. Task 5's failure is a genuine product defect, not a harness artifact (the toast and the empty collection list are both visible in one capture). Tasks 4/6 were initially BLOCKED on a harness limitation (modals intercepting nav clicks) and PASS after the harness was corrected — the corrected run is the one reported. A real learner has not been involved; no real child or student data was used.

---

## 6. Unresolved blockers

1. **Deployment identity (F-06)** — needs the actual deployed URL or Render account access. Without it, deployed-SHA verification is impossible.
2. **AI model output (F-07)** — needs an authorized `GEMINI_API_KEY` for a hosted run, which is a spend/access decision for the owner.
3. **Arabic RTL depth** — direction is verified RTL, but full RTL layout quality (mixed Arabic/French curriculum terms, forms) was not exhaustively checked.
4. **Full digital books (F-05)** — a product decision: should `main` adopt the `BookReader` that exists on the design/archive branches?

---

## 7. Recommended next work (smallest verified gaps first)

0. **Merge order (verified):** land **PR #12** (strict gate) and close **PR #11** as superseded; land **PR #15** (save fix); land **PR #7** (design lab + French + branding); land **PR #13** (this audit) and **PR #10** (product source of truth) as documentation. PR #8 (chat archive) is stacked on PR #7.
1. **Fix F-01 (save with no collection)** — delivered in **PR #15**; needs review.
2. **Land F-04 (PR #12)** — verified; removes a false-green CI gate.
3. **F-03 remaining** — the Feed/Library French work is already done on PR #7; only `HomeScreen.tsx:397` (`'les'` in the English UI) still needs a one-line fix.
4. **F-02 branding** — already done on PR #7; no separate work needed.
5. **F-05** — decide whether to bring `BookReader` from the design branch to `main`.

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
