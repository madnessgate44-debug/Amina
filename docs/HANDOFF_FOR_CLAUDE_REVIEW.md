# Miss Noor — complete handoff for review by Claude

**Prepared:** 2026-10-24
**Repository:** https://github.com/madnessgate44-debug/Amina (public — Claude can open every link)
**Issue:** #9 — https://github.com/madnessgate44-debug/Amina/issues/9
**Current `main`:** `7eb3ed4031ae`
**Prepared by:** OpenHands (the repository's designated coding/auditing executor), for owner `madnessgate44-debug`

This single document is the entry point. It states the naming decision, what is merged,
what is still open, what must **not** be merged, and exactly what remains blocked.

---

## 0. The naming decision (owner-confirmed 2026-10-24) — read this first

The owner settled the naming, and it is **not** what the code originally assumed:

| Concept | Correct value | Notes |
|---|---|---|
| **Product name** | **"Miss Noor"** | The app is called Miss Noor. |
| **The teacher in the app** | **"Miss Noor"** | Same name as the product. One name for both. |
| **"Amina"** | **not the product name** | Amina is the owner's **daughter** — the **ideal user** the app is built for. The repo is named `Amina` for that reason. |

**What was wrong before, and is now fixed:**
- `index.html` titled the product `Amina` (wrong) → now `Miss Noor`.
- The header called the teacher `Miss Nour` (misspelled) → now `Miss Noor`.
- Both corrections are on `main` via the merged PR #18.

**Trap for reviewers:** PR #7 (still open) sets the header to the legacy `"Amina"`. It must not be
merged as-is. See §4.

---

## 1. What is merged on `main`

| PR | Title | Merged commit | What it delivered |
|---|---|---|---|
| **#18** | Ready-to-use app: strict typecheck gate, save fix, brand | `b5d2d1e0` | Strict TypeScript gate, 11 type errors fixed, French localization, save fix, `Miss Noor` branding |
| **#19** | Audit: forensic product audit (R1) + strict-gate verification (R2) | `7eb3ed40` | `docs/audits/AMINA_FORENSIC_AUDIT_2026-10-22.md` |

CI on `main` is **green**: run `40055123543` (`success`) at `7eb3ed40`.

### What PR #18 actually fixed (all verified before merge)

**R2 — the TypeScript quality gate was fake.**
- `main` ran `tsc --noEmit` → **exit 1, 11 errors**, yet CI reported the step as **success** because
  `.github/workflows/ci.yml` had `continue-on-error: true`.
- The 11 errors: 8 × `TS18047` in `teacherContextEngine.ts`, 2 × `TS18047` in
  `VirtualTeacherClassroom.tsx`, 1 × `TS2322` in `missionCompletion.ts:118`.
- Fix: `continue-on-error` removed and the step renamed **"Type check (blocking)"**; `tsconfig.json`
  gained `strict: true` + `allowUnreachableCode: false`; the 87-line block was deleted;
  `'practice'` was added to `EvidenceModality`.
- **The dead-code claim is compiler-proven, not asserted:** with `allowUnreachableCode: false`, tsc
  emits `TS7027: Unreachable code detected` at `teacherContextEngine.ts:763`. Deleting it cannot
  change behaviour.
- Verified on the merged head: `tsc --noEmit` **0 errors**; adaptive **39/39**; integrity **86/86**;
  strict-gate suite **8/8**; `npm run build` exit 0.

**R3 — learner flow, measured in a real browser (Chromium, synthetic profile, no real child data).**
- Journey harness: **13 passed / 0 failed**, 0 page errors, 0 console errors, 0 failed requests.
- Localization probe at 390×844: **3/3** — Arabic `rtl`, English `ltr`, French `ltr`.
- Method note: the app does **not** follow the browser locale; language is chosen by on-screen
  buttons on onboarding step 1. Setting only the browser locale shows Arabic every time — that is the
  saved setting winning, not a bug.

**Save/revisit (F-01 + F-08).**
- Save was clickable with zero collections ticked, then toasted "Saved to collection" while the
  collections screen showed "Nothing saved here yet." Now guarded: `canSave = selectedColIds.length > 0`.
- The sheet footer sat under the sticky bottom nav (measured 15 px of a 28 px button on mobile).
  Now portalled to `document.body`, so the confirm button is tappable at both viewports.

**French localization.** `HomeScreen.tsx`, `FeedScreen.tsx`, and `CurriculumBrowser.tsx` had 39 / 20 /
54 `isArabic ? …` ternaries with **no French branch**. Now have `isFrench` branches; the residual
`'les'`-in-English-UI bug at `HomeScreen.tsx:397` is fixed to `isFrench ? 'leçons' : 'lessons'`.

---

## 2. Requirement status (issue #9)

| Req | Status | Evidence |
|---|---|---|
| **R1** audit report | **DONE, merged** | PR #19 → `docs/audits/AMINA_FORENSIC_AUDIT_2026-10-22.md` |
| **R2** strict TypeScript gate | **DONE, merged** | PR #18; gate now blocking; 0 errors |
| **R3** learner-flow evidence | **DONE** | 13/13 journey, 3/3 locales, real browser |
| **R4** deployment verification | **BLOCKED — no live SHA** | See §3 |
| **R5** boundaries preserved | **HONORED** | No curriculum change, no app deps added, HOME/FEED/LIBRARY/NOUR intact |

---

## 3. R4 — deployment: genuinely not verified

- GitHub records **22 deployments, all environment `github-pages`**. The newest is `a0eda354`, which
  is **17 commits behind** `main`.
- **GitHub Pages is disabled**: `GET /repos/.../pages` returns **404** and repo metadata shows
  **`has_pages: false`**. That is why the URL 404s — not deployment lag.
- `GET https://madnessgate44-debug.github.io/Amina/` → **HTTP 404**.
- `deploy-pages.yml` is manual-only (`workflow_dispatch`) and its own header says Pages cannot serve
  the AI routes, which need `server.ts`.
- `render.yaml` declares a Render web service `amina` with health check `/api/health`, but there is
  **no Render token or hostname** available, and no `onrender.com` URL appears anywhere in the repo.

**Conclusion:** the deployed URL and deployed SHA are **not verified**. Nothing was deployed.
**This needs the owner:** what is the intended production surface — Render or Pages — and is there a
Render URL/token?

---

## 4. Open PRs — what to do with each

| PR | Recommendation | Reason |
|---|---|---|
| **#17** Brand/localization system | **Conflicts; likely redundant** | Its branding work already landed via #18. Its 12 files are almost all `SAME` as `main` now. Close as superseded, or rebase. |
| **#16** i18n "lessons" label | **DO NOT MERGE** | It **reverts** the French branches that #18 added to `HomeScreen.tsx` (`isFrench ? …` lines are removed). Its stated fix is already on `main`. |
| **#15** save-without-collection | **Redundant** | Its `SaveToCollectionModal.tsx` change is `SAME` as `main` (landed via #18). Only extra files are its own evidence artifacts. |
| **#11** strict typecheck gate | **Redundant** | `ci.yml`, `tsconfig.json`, `teacherContextEngine.ts`, `masteryEngine.ts` are all `SAME` as `main`. Superseded by #18. |
| **#13** forensic audit | **Superseded** | The audit landed via #19. #13's report has the six claims corrected in §5. |
| **#10** product source of truth | **Docs only, safe** | One file: `docs/AMINA_PRODUCT_SOURCE_OF_TRUTH.md`. **But it uses the old naming** ("Amina / Miss Nour"). Update the naming before merging. |
| **#7** design lab toolkit | **DO NOT MERGE AS-IS** | Two blockers: (1) its `ci.yml` **re-adds `continue-on-error: true`** and renames the step back to "Type check", re-breaking the gate #18 fixed; (2) its `AppShell.tsx` sets the header to legacy `"Amina"`. Valuable content (design-lab agents, skills, browser-audit harness) — extract it onto a fresh branch with those two reverted. |
| **#8** chat archive | Docs only, stacked on #7 | 71 files, documentation. Stacked on #7's branch, so it cannot land before #7 is resolved. |

---

## 5. Corrections to the earlier handed-in audit (PR #13)

The earlier draft was largely sound but had six wrong or overstated points, all re-checked and
corrected in the merged report:

1. It said **one** deployment; there are **22**.
2. It said `BookReader.tsx` exists on the design/archive branches. **It exists on no branch** — the
   string appears only in two Markdown docs.
3. It called the branding "conflated" a defect. It was a **naming error in the code**, now settled by
   the owner and fixed (§0).
4. It counted 27 / 15 i18n ternaries; actual counts are **39 / 20** (`CurriculumBrowser` 54).
5. It recommended landing PR **#12**, which is **closed unmerged**.
6. Its "8 × TS18047 unreachable" claim was correct and is now **compiler-proven** via `TS7027`.

---

## 6. Remaining owner decisions

1. **Production surface (R4)** — Render or Pages? This is the only thing blocking R4.
2. **PR #7 handling** — extract the design-lab content onto a clean branch (recommended), or leave it?
3. **Book reader (F-05)** — no reader component exists on any branch. Adopt as scoped work, or drop?
4. **PR #10 naming** — update "Amina / Miss Nour" to "Miss Noor" before merging?

---

## 7. Verified links

- Repository: https://github.com/madnessgate44-debug/Amina (public)
- Issue #9: https://github.com/madnessgate44-debug/Amina/issues/9
- Merged audit report: `docs/audits/AMINA_FORENSIC_AUDIT_2026-10-22.md` on `main`
- PR #18 (merged): https://github.com/madnessgate44-debug/Amina/pull/18
- PR #19 (merged): https://github.com/madnessgate44-debug/Amina/pull/19
- CI on `main`: run `40055123543`, conclusion `success`, at `7eb3ed40`

## 8. Live demo environment (not production)

| Surface | URL | Status at handoff |
|---|---|---|
| App | https://work-1-xbpxhgdqcnioefuv.prod-runtime.all-hands.dev/ | 200 |
| Dashboard | https://work-2-xbpxhgdqcnioefuv.prod-runtime.all-hands.dev/ | 200 |

**Caveat, stated honestly:** this is an ephemeral sandbox, **not** production. It was recycled once
during this work, taking the app down for about 15.5 hours. It is not a deployment target and should
not be treated as one. R4 remains open until a real always-on host is chosen.

---

_This handoff was prepared by an AI agent (OpenHands) on behalf of the repository owner._
