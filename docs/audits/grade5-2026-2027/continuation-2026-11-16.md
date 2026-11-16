# Continuation checkpoint — 16 November 2026

## Baseline and branch state

- Main: 527df4fb7da32d6f3badb5f31d1172ffc0de6eec.
- Controlling repository policy: Engineering Execution OS v2.2; AGENTS.md was read before repository inspection.
- Existing audit PR: [#201](https://github.com/madnessgate44-debug/Amina/pull/201), branch audit/grade5-term1-subject-source-audit-2026-11-15, inspected head 5eda4acc887051859842a4abfda0458bdeabd1ec.
- Science PR: [#200](https://github.com/madnessgate44-debug/Amina/pull/200), latest head 0f558c3ba5552bc93891a5438a31e2cf9e5ffe61, 17 commits ahead of main and 0 behind; GitHub reports mergeable.

## Science — French track

- Main already contains 28 current-edition French Science lessons and 28 app-authored teaching plans. This is repository coverage, not Ministry teacher-guide authentication or proof of learner mastery.
- PR #200 reconciles the canonical Ministry-hosted PDF with the existing Library copy: 109/109 normalized extracted-text page fingerprints match. Byte identity, untouched publisher-original provenance and visual/layout identity remain unverified.
- This continuation ported the safe, non-duplicative page-range part of stale PR #170 into PR #200: SourceRef.pageRange is now populated from each lesson's inspected Spec.pages, and a separate expected-page map checks all 28 lessons.
- Verification: latest PR #200 CI [43823607338](https://github.com/madnessgate44-debug/Amina/actions/runs/43823607338) PASS; compliance [43823607336](https://github.com/madnessgate44-debug/Amina/actions/runs/43823607336) PASS. The CI log records 11.3 all 28 current Science lesson records carry exact printed page ranges (0 mismatches) and CURRICULUM REGISTRY SUITE SUMMARY: 54 PASSED, 0 FAILED. The workflow also reports 39 test suites passed, 0 failed; type check, lint and build passed.
- PR #170 is stale/diverged (38 ahead, 27 behind) and non-mergeable. Its separate Chapter 1 teacher-guide file duplicates content already represented by the current main 28-plan registry. Its page-range metadata was ported; the separate teacher-guide file and teaching-session UI changes were not.
- PR #182 is a separate Arabic Science draft and remains held by its own registry/availability blocker. It is not merged into the French Science track.
- [C] A Library copy of a French Science assessment book was found via a third-party listing: 69 PDF pages (68 book pages plus an advertisement), 33,873,471 bytes, SHA-256 1385118877a70afeca75e8ad4f616b6a4db1ea1a4edb80285297d5de0ef29b43. Its cover/back cover carry Ministry markers and an ISBN, but PDFsharp metadata and a third-party watermark indicate repackaging. A 17-page sample OCR index (all 17 non-empty) spans topics from Chapters 1, 2, 3, 5, 6, 7, 8 and 9 plus cumulative assessment; no canonical Ministry endpoint or full page-level assessment map is verified. See the [candidate audit](https://github.com/madnessgate44-debug/Amina/blob/audit/science-canonical-text-reconciliation-2026-11-15/docs/curriculum/grade-5-science-fr-term1-assessment-candidate.md) and [sample page index](https://github.com/madnessgate44-debug/Amina/blob/audit/science-canonical-text-reconciliation-2026-11-15/docs/curriculum/grade-5-science-fr-term1-assessment-candidate-page-index.csv).

## Mathematics — French track

- Ministry StudentBook: 141 PDF pages, SHA-256 baea709a1080bfe383e8e1f040c57d68b8c1b1f6e17b7810fd5401c7187d5ace; performance-assessment book: 74 PDF pages, SHA-256 9521338362528fc1c7e0717c92b2f596c7177860c37c1311a80ed86fa6c67479.
- The StudentBook TOC contains 46 lessons across six units. The current app registry has 12 national-book records plus four additional French-extract records. The matrix records 11 exact matches, one Unit 6 title/page discrepancy and 34 missing lessons. The four extract records are separately reviewed; three are mismatched/unsupported and one duplicates an exact national-book lesson. The lesson matrix now also records assessment-PDF heading candidates for 28 lesson entries; the separate section index records weekly/monthly/Term 1 assessment headings that are not safely mapped one-to-one to a lesson.
- Full instructional-page review, exercise/answer-key checking and complete teaching-plan construction for the 34 missing lessons remain open. No unsupported lesson was added in this continuation.
- PR #180 is an Arabic Maths draft and is not used as the French Math source.

## French language

- No separate 2026–2027 Grade 5 French-language StudentBook or standalone French1/French2 assessment book was verified in the tested catalogue/endpoints.
- Ministry-hosted weekly assessments retrieved: French1 weeks 1–7 (7/7, four PDF pages each); French2 weeks 1–5 and 7 (6/7, three pages each). French2 week 6 returned HTTP 404.
- Headers identify French1 Bien joué 1 and French2 Alex et Zoé 2. The official weekly assessment index also exposes these track URLs: [MOE Performance Assessments](https://ellibrary.moe.gov.eg/Performance_Assessments/). This does not establish which track École Girard assigns.
- The four current app French lessons still cite an unidentified generic Ministry French book. Their official-source identity is unverified; no new French lessons were fabricated.

## English

- Ministry StudentBook: 113 PDF pages, SHA-256 da7e3dd769bbdfc3506a6d4fea96ed6e62ee3a49d95ad15968e4c2bbcf7513f4; performance-assessment book: 74 PDF pages, SHA-256 41b01ce8e0530ba2400696a4fad31a063f775980bf2995e9e2687fa23e2d1472.
- The StudentBook scope-and-sequence contains six units. A provisional 23-segment page index was added from extracted page-heading boundaries. It uses PDF page positions, not verified printed pagination; OCR assessment titles are candidates, not visually verified matches.
- The app has two English records. The Generous Apple Tree does not exactly match the StudentBook heading The Giving Tree; Elephantine Island in Aswan has no matching title in the retained page-heading index. The other indexed lesson/story segments have no app record.
- Complete lesson-body, vocabulary, grammar, exercise, answer-key and teaching-scaffold reconciliation remains open. No new English lessons were fabricated.

## Durable evidence and verification

- Source audit [43714053006](https://github.com/madnessgate44-debug/Amina/actions/runs/43714053006): PASS; 21 Ministry-hosted URLs attempted, 17 PDFs retrieved, 448 pages fingerprinted.
- Audit PR CI [43714492039](https://github.com/madnessgate44-debug/Amina/actions/runs/43714492039) and compliance [43714492105](https://github.com/madnessgate44-debug/Amina/actions/runs/43714492105): PASS on PR #201 head 5eda4acc887051859842a4abfda0458bdeabd1ec.
- Science PR CI [43821315922](https://github.com/madnessgate44-debug/Amina/actions/runs/43821315922) and compliance [43821315933](https://github.com/madnessgate44-debug/Amina/actions/runs/43821315933): PASS on PR #200 head 8c7f5d760d420a22678798f222342fdf52981548.
- Source PDFs and full extracted book text remain excluded from the repository. The audit retains metadata, page hashes, heading candidates and concise reconciliation data only.

## Remaining gates

1. Review every Math and English instructional page, worked example, exercise and answer key; then author missing app lessons with complete scaffolding and source provenance.
2. Identify the school's actual French1/French2 coursebook/track from an authoritative school source before aligning the four existing French-language app records.
3. Reconcile all French weekly assessment content separately by track; resolve the missing French2 week 6 endpoint if the Ministry republishes it.
4. Complete independent content/diagram review and physical-phone learner walkthrough.
5. Owner review and explicit approval are still required before merging either PR or deploying.

No merge or production deployment was performed.
