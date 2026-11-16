# Continuation checkpoint — 16 November 2026

## Controlling policy and branch state

- [V] Read repository root `ENGINEERING_EXECUTION_OS.md` and `AGENTS.md` before inspection; controlling OS is v2.2.
- [V] Main remains `527df4fb7da32d6f3badb5f31d1172ffc0de6eec`; no main-branch writes.
- [V] Audit branch: `audit/grade5-term1-subject-source-audit-2026-11-15`.
- [V] PR [#201](https://github.com/madnessgate44-debug/Amina/pull/201) is open and mergeable. It holds the source audit metadata, page fingerprints, matrices and review summaries for all four subjects.
- [V] PR [#200](https://github.com/madnessgate44-debug/Amina/pull/200) is open and mergeable at head `969f0f9fcb2bc119f8fdf3899767b582bccd1a93`, 23 commits ahead of main and 0 behind.
- [B] No merge or production deployment performed; owner retains those approvals.

## Source audit continuation

- [V] Latest source audit [43844113846](https://github.com/madnessgate44-debug/Amina/actions/runs/43844113846) succeeded: 21 source URLs attempted, 17 PDFs retrieved, 448 pages fingerprinted.
- [V] OCR attempted on 165 pages; 163 produced text. This includes all 46 French1/French2 weekly-assessment pages, low-text Math/English StudentBook pages and scanned assessment pages.
- [V] The one-day artifact contains full temporary page text and TOC extracts. No PDFs or full extracted/OCR text are committed.
- [V] Four 404 candidates: Math uppercase assessment filename; French1 and French2 standalone assessment-book endpoints; French2 week 6.

## Science

- [V] Main already has 28 current-edition French Science lessons and 28 app-authored teaching plans.
- [V] Earlier canonical-host/Library comparison: 109/109 normalized extracted-text page fingerprints match; visual/layout, byte identity and untouched publisher-original provenance remain unverified.
- [V] PR #200 reconciles French imprint/provenance notes across all 28 lessons, camel heat-loss enrichment and source-audit publishing.
- [V] PR #170 is stale/non-mergeable and duplicates the Chapter 1 guide already present in the 28-plan registry. Its safe page-range changes are already represented in the current Science work; do not merge it as-is.
- [V] PR #182 is Arabic Science and outside this French-track request.
- [B] PR #200 owner merge and post-merge publish-from-main verification remain open.

## French Mathematics

- [V] Ministry French Math StudentBook: 141 pages; 46 lessons across six units.
- [V] Ministry French Math performance-assessment book: 74 pages; OCR lesson-page mapping now covers all 46 lesson entries, with some combined lesson pages.
- [V] Current app national registry: 12 records; 11 exact matches and one Unit 6 lesson title variant verified against the lesson-opening banner. 34 source lessons remain missing.
- [V] Four additional French-extract records are not additional coverage: one duplicate and three wrong unit/lesson mappings. They still need to be marked unavailable compatibility records in app code.
- [U] Full worked-example/exercise/answer-key review and the 34 missing app-authored teaching plans remain to be implemented.

## French language

- [V] French1: 7 weekly assessments, 28 pages, OCR text recovered on all pages; headers identify `Bien joué 1`.
- [V] French2: 6 weekly assessments, 18 pages, OCR text recovered on all pages; headers identify `Alex et Zoé 2`; week 6 is 404.
- [V] Track-specific OCR summaries are in `french-language-weekly-content-review.csv`.
- [U] The school’s assigned French1/French2 track is not established. No separate StudentBook or standalone assessment book was retrieved.
- [B] Four generic French app records cite an unidentified Ministry book; they must not be treated as verified curriculum.

## English

- [V] Connect 5 StudentBook: 6 units and 26 lessons/creative tasks (5 each in Units 1–5; one extended Unit 6 story).
- [V] Performance-assessment book: 74 pages; 73 OCR attempts, 72 yielded text. Assessment lesson headings map to the 26-lesson sequence; Unit 4 pronunciation p.69 has no direct assessment-book match.
- [V] Existing app record `off_en_u1_apple_tree` materially differs from the source's “The Giving Tree” Lesson 3 (StudentBook pp.13–16), including story events, lesson number and page reference.
- [V] Existing `off_en_u4_elephantine` record has no matching StudentBook lesson; it is an unverified app-only record.
- [V] Source-derived 26-row lesson review and app reconciliation are in `english-lesson-content-review.csv` and `english-lesson-reconciliation.csv`.
- [B] App code still needs correction, 24 missing records, and app-authored teaching plans for the 26 source lessons.

## Verification and gates

- [V] Source audit [43844113846](https://github.com/madnessgate44-debug/Amina/actions/runs/43844113846): PASS.
- [V] Current audit-branch compliance [43845766404](https://github.com/madnessgate44-debug/Amina/actions/runs/43845766404): PASS.
- [V] Last full app CI PASS [43843277243](https://github.com/madnessgate44-debug/Amina/actions/runs/43843277243) on an earlier audit revision; lint, tests and build passed.
- [B] Latest PR workflow check has required owner approval; do not claim that the latest commit has a fresh full npm CI run.
- [U] No physical-phone walkthrough, visual diagram check, teacher-guide authentication, school pacing confirmation or learner-mastery evidence.

## Next execution order

1. Keep PR #200 Science source reconciliation ready for owner merge; do not merge it.
2. In PR #201, mark the four unsupported Math French-extract records unavailable while preserving compatibility IDs.
3. Correct the English “The Giving Tree” record and disable the unsupported Elephantine legacy record.
4. Add the remaining 34 French Math and 24 English source lesson records, each with app-authored teaching scaffold and answer keys.
5. Keep French1 and French2 content separate and unavailable as the school curriculum until the assigned track is evidenced.
6. Add registry tests for source completeness and provenance; obtain owner approval for current PR checks; rerun lint/tests/build/compliance after code changes.
7. Do not merge or deploy without explicit owner approval.
