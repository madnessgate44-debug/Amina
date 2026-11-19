# Grade 5 Arabic Term 1 and Miss Noor visual release audit

**Audit date:** 2026-11-19  
**Repository:** `madnessgate44-debug/Amina`  
**Audited base:** `main` at `b9a538eb0824b637931c12a4c2931d7c07b3297e`  
**Scope:** Grade 5 Arabic Term 1 learner curriculum and Miss Noor's learner-facing visual identity. This is an evidence report, not a completion claim.

## Executive finding

The previous product-readiness impression was not justified. The Grade 5 Arabic curriculum on `main` contains only **five lesson records** in `src/data/curriculum/arabicCurriculum.ts`. The lesson content and live lesson interaction have not been independently validated end-to-end. A separate three-lesson addition in PR #179 was closed as an unmerged draft and is not part of `main`.

The earlier French Science reconstruction and CI results do not establish Arabic curriculum completeness, Arabic lesson functionality, or visual redesign acceptance.

## 1. Arabic curriculum inventory on main

Direct inspection of `src/data/curriculum/arabicCurriculum.ts` on the audited main commit found these five lesson IDs/titles:

| # | Lesson ID | Title on main | Recorded source reference |
|---|---|---|---|
| 1 | `off_ar_u1_l1_ana_astatee` | قصة الاستماع: «أنا أستطيع» | pp. 6–11 (legacy source metadata; edition not independently authenticated) |
| 2 | `off_ar_u1_l2` | نص القراءة: «لم أوت ماء النهر» | pp. 12–15 (legacy title/content; differs from 2026–2027 title «لم ألوث ماء النهر») |
| 3 | `off_ar_u1_l3_grammar_nominal` | الجملة الاسمية | Page/edition mapping requires verification |
| 4 | `off_ar_u2_l1_real_beauty` | الجمال الحقيقي | Page/edition mapping requires verification |
| 5 | `off_ar_u3_l1_dr_magdi_yacoub` | حوار د. مجدي يعقوب | Page/edition mapping requires verification |

These are records in a data file, **not five proven working lessons**. This inspection did not establish that each record is reachable through the current learner UI, that its teaching steps render correctly, or that answers/progress persist.

## 2. Unmerged Arabic work

PR #179, [Curriculum: Grade 5 Arabic Term 1 grammar and writing gaps](https://github.com/madnessgate44-debug/Amina/pull/179), is closed and unmerged (draft). Its proposed additions were:

- التعبير الكتابي: الرسالة الرسمية
- القواعد النحوية: المفعول لأجله
- القواعد النحوية: ظرفا الزمان والمكان

The PR itself states that supporting media-catalog entries and test-inventory updates were unresolved. Its added lesson objects use `originTag: 'official'` while their explanations/exercises are app-authored and page references are unspecified; this provenance treatment must be corrected before reuse. These three records are **not present on main** and must not be counted as available.

The PR's three lessons are not a complete Term 1 curriculum. A current 2026–2027 outline also lists reading/listening texts, poetry, speaking, writing, grammar and spelling across all three units.

## 3. Edition/source discrepancy and exact source blocker

A current 2026–2027 official student-book PDF link was located through a book index that links directly to the Ministry's `elearnningcontent.blob.core.windows.net` host:

`https://elearnningcontent.blob.core.windows.net/elearnningcontent/2026_2027/Primary/Primary5/Term1/StudentBook/Arabic_langugae_prim5_t1.pdf`

The PDF retrieval attempt returned HTTP 400 because the response was 37,348,660 bytes; a separate container download attempt failed. Therefore the exact PDF pages have **not** been inspected in this audit. The book index is a third-party directory, not the Ministry itself; its direct PDF destination appears to be the Ministry content host. The 2026–2027 outline reported by Egypt Telegraph lists:

- Unit 1: نيلنا أمانة
- Unit 2: فن التواصل
- Unit 3: جمال الاختلاف

The current app's legacy unit names/titles do not fully match that outline. The outline is discovery evidence only, not a substitute for page-by-page inspection of the Ministry student book.

**Blocked source required:** retrieve and inspect the exact 2026–2027 Ministry Grade 5 Arabic Term 1 student-book PDF from the URL above, record its SHA-256, edition/imprint, printed page ranges and TOC, then reconcile every reading, listening, poetry, grammar, spelling, speaking and writing component. Obtain a matching Ministry teacher guide only if its edition and provenance can be authenticated. Do not use 2023/2024 or older books as silent substitutes.

## 4. Arabic lesson functionality — not yet verified

The following gates remain open:

1. Enumerate the actual Arabic Term 1 TOC from the exact 2026–2027 student book and map every required component to a lesson record or explicitly documented non-lesson activity.
2. Trace the live subject-selection -> unit/lesson list -> lesson opening -> teacher explanation -> learner response -> answer feedback/remediation -> mastery check -> progress persistence path.
3. Confirm Arabic RTL rendering, Arabic content and Arabic assessment choices throughout; do not allow English/French fallback text to masquerade as Arabic instruction.
4. Confirm every visible lesson is selectable, every exercise has a valid answer key, wrong answers produce useful Arabic remediation, and lesson completion/progress survives reload and a second session.
5. Add tests for lesson count/TOC coverage, subject routing, lesson rendering, answer evaluation, remediation, RTL and persistence. Tests must assert real coverage and must not be weakened to accept missing lessons.

No browser/device walkthrough or live interaction test is claimed by this audit.

## 5. Miss Noor visual identity — status and acceptance criteria

PR #169, *Full-product visual redesign — Miss Noor Creative Director*, was closed without merge. The earlier styling attempt does not establish that the approved Miss Noor character and full visual identity were implemented.

The next visual implementation must be treated as a separate design-and-code workstream with evidence:

- A distinctive, consistent illustrated teacher character for Miss Noor, not a generic avatar/icon.
- Approved deep-purple, warm-cream and gold visual direction.
- Clear teacher speech-bubble treatment and readable lesson-stage hierarchy.
- Arabic-first RTL with complete Arabic, French and English layouts.
- Phone-first responsive design, including 390 × 844 evidence; desktop should remain coherent.
- Redesigned learner-facing Home, Feed, Homework, Classroom and Library, not only a theme override.
- Character assets must be actual production assets committed to the app; placeholders and decorative mockups do not count.
- Screenshots must be captured from the running application and reviewed against the acceptance brief. A successful build or Vercel HTTP 200 is not visual acceptance.

**Not yet verified:** the final approved character artwork/source asset, its exact implementation branch, and before/after running-app screenshots. Do not invent or substitute a generic generated teacher image.

## 6. Release gate

The current production deployment previously verified as READY was built from commit `b9a538eb0824b637931c12a4c2931d7c07b3297e`. That deployment proves the app can serve, not that Arabic curriculum or visual acceptance is complete.

Do not label the app learner-ready until:
- Arabic Term 1 source-to-app reconciliation is complete or every missing item is explicitly disclosed;
- Arabic lesson flow is manually verified on a phone and automated regression coverage passes;
- Miss Noor visual acceptance is supported by running-app screenshots;
- `npm run lint`, `npm test`, `npm run build`, applicable CI and compliance checks pass on the final candidate;
- the final Vercel deployment for the exact accepted commit is READY and its stable URL is checked.

## 7. Evidence and limitations

- Main source file: `src/data/curriculum/arabicCurriculum.ts` (five lesson records observed).
- Lesson schema: `src/types/teachingSession.ts`; supports exercises, concepts, misconceptions and structured teaching content, but schema existence is not runtime proof.
- Arabic additions: PR #179 (closed, unmerged, draft; three additions; media/test gate unresolved).
- Visual redesign attempt: PR #169 (closed, unmerged; not accepted as the approved character redesign).
- Current 2026–2027 Ministry-hosted Arabic student-book PDF URL recorded above; retrieval failed due response size.
- Current curriculum outline discovery source: Egypt Telegraph, published 17 November 2026: https://www.egypttelegraph.com/article/284056/توزيع-منهج-اللغة-العربية-للصف-الخامس-الابتدائي
- Book index linking the Ministry-hosted PDF: https://miskeg.app/books/general-primary-5/

## Status

- [VERIFIED] Five Arabic lesson records are present on main.
- [VERIFIED] PR #179's three additions are unmerged and absent from main.
- [VERIFIED] PR #169's redesign attempt is closed without merge.
- [UNPROVEN] Any claim that the five Arabic lessons work end-to-end.
- [BLOCKED] Page-level reconciliation against the exact 2026–2027 Arabic Ministry student book because PDF retrieval failed.
- [UNPROVEN] Completion of Miss Noor's approved visual redesign.
- [BLOCKED] Release-ready declaration pending Arabic functionality, visual acceptance and final deployment verification.


## 8. Additional static code-path findings (not a live reproduction)

Further inspection of the current main source identifies a concrete failure mode in the lesson-launch experience:

- `CurriculumBrowser.tsx` opens a lesson by setting `activeTeachingLessonId`, which mounts `TeachingSessionModal`.
- `TeachingSessionModal.tsx` initializes the session asynchronously. If the lesson cannot be resolved or the student ID is absent, initialization returns without setting a session.
- While either `lesson` or `session` is null, the modal returns `null`. There is no visible loading state, retry action or initialization error message in that branch.
- The initialization effect has no surrounding `try/catch` that converts an initialization/storage failure into a visible recoverable state.

This means a failed or incomplete initialization can look exactly like a dead lesson button: the modal is mounted but renders nothing. This is a **verified static-code defect/failure mode**, not a claim that it was reproduced on the user's device. It should be fixed with explicit loading, empty/error states, safe retry, and tests for missing lesson, missing student, storage rejection and successful launch.

A separate language-routing defect is also present: `TeachingSessionModal.tsx` maps `language` to `'ar'` only when `isAr`, otherwise to `'en'`. Thus a French UI session is sent through the English teaching-session path. This is not the cause of the Arabic five-lesson count, but it is a cross-track lesson-functionality defect.

## 9. Current Miss Noor implementation inspected

- `src/components/stage/NourCharacter.tsx` is a custom inline SVG teacher illustration. The Arabic outfit palette is teal/gold, and the face/hair/coat are fixed vector shapes; subject outfits change colors/badges.
- `src/components/home/HomeScreen.tsx` already places `NourCharacter` in the Home hero, but the surrounding theme is indigo/teal and includes a conventional daily-plan/dashboard structure.
- `src/components/layout/AppShell.tsx` uses a small sparkles icon in the global header rather than a consistent character-led brand lockup.
- This is evidence that a character component exists, **not** evidence that the requested approved appearance redesign has been implemented. The recovered design direction is deep purple, warm cream and gold, a distinctive teacher speech bubble, character-led conversation and phone-first layouts. Exact face/hijab/clothing/reference artwork remains unspecified; no identity-defining changes should be guessed.

## 10. Immediate implementation order

1. Fix lesson-launch lifecycle feedback first: loading, error, retry, and storage-safe session initialization. Add component tests that exercise the visible behavior, not only service unit tests.
2. Verify the existing five Arabic lessons manually through the actual browser and phone, recording the failing interaction and console/network evidence.
3. Obtain the exact student-book PDF and build the full Term 1 inventory before authoring or importing more lessons. Do not treat the three PR #179 entries as source-verified or sufficient.
4. Create a new Arabic content PR that clearly separates official titles/source references from app-authored explanations, with a complete unit/topic matrix and media/test coverage.
5. Implement the visual direction across the named learner screens only after the approved character reference is available; produce running-app screenshots and a separate Vercel preview.
