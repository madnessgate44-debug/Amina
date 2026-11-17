# Additional Grade 5 Term 1 subject inventory — 2026–2027

**Audit baseline:** current `main` as inspected on 17 November 2026.  
**Related work:** [PR #201](https://github.com/madnessgate44-debug/Amina/pull/201), source-audit branch `audit/grade5-term1-subject-source-audit-2026-11-15`.  
**Purpose:** extend the subject inventory beyond the four detailed workstreams already covered in `subject-status.md`. This is a registry/catalog inventory, not a claim that these subjects have passed lesson-level source or pedagogical review.

## Ministry catalog discovery

The Grade 5 2026–2027 Term 1 catalog index lists 15 student books and links each entry to a Ministry-hosted PDF. The index is a third-party discovery page; each PDF must still be independently retrieved, fingerprinted and inspected before it is accepted as a source: https://miskeg.app/books/general-primary-5/ (catalog last reviewed 26 October 2026).

The 15 catalog entries are:
1. Islamic Religious Education
2. Christian Religious Education
3. Social Studies
4. Mathematics — English
5. Mathematics — Arabic
6. Mathematics — French
7. Science — English
8. Science — Arabic
9. Science — French
10. English (first foreign language / Connect 5)
11. Arabic Language
12. Libraries and Research Skills
13. ICT — Arabic
14. Family Management and Entrepreneurship Skills
15. Agriculture and Entrepreneurship Skills

This list establishes catalog availability, not assignment to a particular school or learner. The French-track curriculum already under audit uses French Mathematics and French Science; the Arabic/English subject-specific variants must not be substituted without school evidence.

## Current app registry inventory

The current `src/data/officialCurriculum.ts` imports these curriculum modules into the central registry:

| Subject module | Current module evidence | Current registry interpretation |
|---|---|---|
| Arabic Language | `arabicCurriculum.ts` — 5 top-level lesson objects | Registered; full TOC/page and pedagogical audit not completed |
| French Language | `frenchCurriculum.ts` — 4 top-level lesson objects | Registered; source identity and French1/French2 assignment blocked |
| Mathematics — French instruction | `mathCurriculum.ts` and `mathFrCurriculum.ts` | Registered; 46-lesson Ministry TOC reconciliation is documented in `subject-status.md`; 34 lessons lack app records |
| Science — French instruction | `scienceFrCurriculum2026.ts` | 28 current-edition lessons and 28 app-authored teaching plans; science source/guide and pedagogy gates remain |
| Social Studies | `socialStudiesCurriculum.ts` — 3 top-level lesson objects | Registered; complete source/page reconciliation not yet performed |
| English (Connect 5) | `englishCurriculum.ts` — 2 top-level lesson objects on main | Registered; 26 source lessons/tasks, only two legacy records; detailed gap in `subject-status.md` |
| ICT | `ictCurriculum.ts` — 12 top-level lesson objects | Registered; full source and page-level reconciliation not yet performed |
| Islamic Religious Education | `islamicCurriculum.ts` — 2 top-level lesson objects | Registered; religious track assignment not confirmed |
| Arabic Calligraphy | `calligraphyCurriculum.ts` — 1 top-level lesson object | Registered, but not among the 15 books in the inspected 2026–2027 catalog index; current-year source/assignment unverified |

The object counts above are literal top-level lesson-object counts in the named files at the inspected main revision, not counts of all nested concepts, assessments or resources. They are not evidence of complete textbook coverage.

## Catalog subjects not currently registered as independent lesson modules

- **Christian Religious Education:** no Christian curriculum module is imported by `officialCurriculum.ts`. The school’s religious track must be confirmed; do not infer Islamic or Christian assignment.
- **Libraries and Research Skills:** no independent curriculum module is imported. A previously found Ministry library curriculum PDF is from 2022–2023 and is not a valid 2026–2027 substitute.
- **Family Management and Entrepreneurship Skills:** no independent curriculum module is imported.
- **Agriculture and Entrepreneurship Skills:** no independent curriculum module is imported.
- **Mathematics — English, Mathematics — Arabic, Science — English and Science — Arabic:** listed in the Ministry catalog, but these are separate language tracks, not substitutes for the French-section Math/Science sequence. The current central registry maps the learner’s Math/Science instruction to French; no independent school-assignment evidence authorizes adding the other variants as learner-facing tracks.

## Other assignment gates

- French Language: the 2026–2027 catalog index has no standalone French-language StudentBook entry. French1 and French2 weekly assessments exist, but the school track is unverified. Do not select one without school evidence.
- Arabic Calligraphy: app registry presence does not prove it is a current Ministry-book subject or assigned at the school.
- Library, Family Management and Agriculture: catalog presence does not prove they are part of the learner's timetable. Their school assignment and actual book availability must be checked before learner-facing activation.
- Religious Education: Islamic and Christian books both appear in the catalog. The assigned track is not established by repository data.

## Next source-audit actions

1. Retrieve the exact 2026–2027 Ministry PDFs for Social Studies, Arabic, ICT, Islamic and Christian Religious Education, Libraries, Family Management and Agriculture from the official host; record URL, HTTP status, bytes, SHA-256, PDF metadata, page count and per-page normalized-text fingerprints.
2. Inspect the full table of contents and lesson-opening pages for each retrieved book; generate a lesson-by-lesson reconciliation matrix against the current app module.
3. For every registered lesson, review its actual explanation, examples, exercises, answer key and teaching scaffolding; do not treat registry presence as teaching completeness.
4. Create original app-authored teaching packs and regression tests only when source evidence supports the lesson mapping.
5. Keep unassigned tracks hidden or explicitly pending until school assignment is confirmed.
6. Do not commit textbook PDFs or full extracted text; keep metadata, hashes, concise paraphrases and page references only.

## Evidence limits

- [VERIFIED] The 15-book catalog index and current repository import inventory were inspected.
- [UNPROVEN] The complete source/page mapping and teaching quality of Arabic, Social Studies, ICT, Islamic Religious Education and Arabic Calligraphy.
- [BLOCKED] Christian track assignment, French1/French2 assignment, and whether Library, Family Management and Agriculture are assigned at the school.
- [BLOCKED] Source-level and pedagogical completion for the four catalog subjects without current independent app modules.
- [UNPROVEN] Visual diagram fidelity, independent teacher review, physical-phone walkthrough and learner mastery for these subjects.

A green workflow, a source catalog entry or a module import is not sufficient to mark a subject complete.
