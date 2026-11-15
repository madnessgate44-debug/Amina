# Grade 5 Term 1 curriculum status — 2026–2027

**Repository baseline:** `main` at `527df4fb7da32d6f3badb5f31d1172ffc0de6eec` (inspected 15 Nov 2026 UTC).  
**Audit branch:** `audit/grade5-term1-subject-source-audit-2026-11-15`.  
**Source audit run:** [43711609764](https://github.com/madnessgate44-debug/Amina/actions/runs/43711609764) — [PASS] workflow completed successfully.  
**Scope:** Egyptian Primary Grade 5, 2026–2027, Term 1. Mathematics is the French-track book. School-specific pacing and coursebook assignment remain unverified.

## Executive status

| Subject | Source evidence | App inventory on inspected main | Status |
|---|---|---:|---|
| French Science | Ministry-hosted French PDF retrieved in prior audit; 109/109 page-text fingerprints matched the inspected Library copy; 9 chapters / 28 numbered lessons in the source map | 28 current-edition lessons are documented in the existing Science source map | [IN PROGRESS] PR #200 is open; #170 overlaps on curriculum/map/tests; #182 is a separate Arabic Science draft |
| Mathematics (French track) | Exact Ministry-hosted PDF retrieved: 141 pages, 17,195,754 bytes; SHA-256 below | 23 lesson records in `mathFrCurriculum.ts`, Units 1–3 | [IN PROGRESS] Canonical PDF content/TOC and every lesson not yet reconciled |
| French language | 13 weekly assessments retrieved across French1 and French2; French2 week 6 returned 404; no separate French-language StudentBook in the previously inspected official catalogue | 14 lesson records in `frenchCurriculum.ts` | [BLOCKED / PARTIAL] No verified student textbook or evidence identifying the school's French1/French2 track |
| English | Exact Ministry-hosted PDF retrieved: 113 pages, 18,757,051 bytes; SHA-256 below | 4 lesson records in `englishCurriculum.ts`, Units 1 and 4 | [IN PROGRESS] Book contents and all units/lessons not yet reconciled |

These are repository record counts, not learner mastery or verified curriculum-completion percentages.

## 1. Science — source and PR reconciliation

- [V] The canonical Ministry Science PDF was retrieved in the earlier source audit (109 pages). Normalized extracted text matched all 109 book pages in the inspected Library copy; the Library PDF contains one additional promotional page outside the book.
- [V] This is text equivalence only. It does not prove byte identity, untouched publisher-original PDF, visual/layout identity, or complete diagram correctness.
- [V] PR [#200](https://github.com/madnessgate44-debug/Amina/pull/200) remains open. Its own CI and compliance checks were reported green, but its durable publishing step has not been exercised from main.
- [V] PR [#170](https://github.com/madnessgate44-debug/Amina/pull/170) changes overlapping Science files: the French Science curriculum, verified lesson map, and curriculum registry tests. It also adds a Chapter 1 teacher-guide module and teaching-session integration. These overlaps must be reconciled before either branch can safely be considered final.
- [V] PR [#182](https://github.com/madnessgate44-debug/Amina/pull/182) is an Arabic Science draft that explicitly describes its registry path as blocked/quarantined. It is not a French Science source and is not being merged into the French-track work.
- [B] No merge or production deployment was performed. Owner approval remains required.

## 2. Mathematics — French track

- [V] Source URL: https://elearnningcontent.blob.core.windows.net/elearnningcontent/2026_2027/Primary/Primary5/Term1/StudentBook/Math_FR_prim5_TR1.pdf
- [V] Retrieved at 2026-11-15T12:00:24Z; HTTP 200; 17,195,754 bytes; 141 PDF pages.
- [V] SHA-256: `baea709a1080bfe383e8e1f040c57d68b8c1b1f6e17b7810fd5401c7187d5ace`.
- [V] PDF metadata: Author `PDF Candy Desktop`; Creator `Icecream PDF Candy Desktop 3.13`; Producer `PDF Xpansion, Version 12.0.3.3`; modified 1 Sep 2026. No ISBN marker was detected by the current text-marker check.
- [U] The retrieved file is hosted at the Ministry URL but its processing metadata means it should not be described as an untouched Ministry original without further provenance evidence.
- [V] The app currently has 23 records in `mathFrCurriculum.ts`, with unit numbers 1–3. The source manifest on main lists 46 TOC lessons, but itself labels Maths as TOC-only/partial. The 46-lesson denominator has not yet been revalidated against the retrieved PDF.
- [B] Lesson-by-lesson page mapping, examples/exercise review, app-content correction, and pedagogical completeness remain to be done.

## 3. French language

- [V] Exact 2026–2027 Ministry-hosted weekly assessment endpoints were attempted.
- [V] French1 weeks 1–7: all 7 retrieved, 4 PDF pages each.
- [V] French2 weeks 1–5 and 7: 6 retrieved, 3 PDF pages each. French2 week 6: HTTP 404.
- [V] The assessment PDFs' metadata generally identifies `Start Computer` as author and Microsoft Word as creator/producer. This is not proof that the school uses that track or that these files constitute a complete textbook.
- [U] No standalone French-language StudentBook was listed in the official catalogue inspected in the preceding audit. French1 vs French2 assignment for the school is not established.
- [V] The current app has 14 French-language records across Units 1–3 and cites a generic Ministry book whose identity remains unverified.
- [B] Do not label those 14 records official or invent a textbook. The assessment PDFs can be reviewed for skills and weekly coverage, with their source type clearly distinguished from a student book.

## 4. English

- [V] Source URL: https://elearnningcontent.blob.core.windows.net/elearnningcontent/2026_2027/Primary/Primary5/Term1/StudentBook/English_language_prim5_t1.pdf
- [V] Retrieved at 2026-11-15T12:00:27Z; HTTP 200; 18,757,051 bytes; 113 PDF pages.
- [V] SHA-256: `da7e3dd769bbdfc3506a6d4fea96ed6e62ee3a49d95ad159e4c2bbcf7513f4`.
- [V] PDF metadata: Creator `Icecream PDF Candy Desktop 3.13`; Producer `PDF Xpansion, Version 12.0.3.3`; creation 17 Aug 2026, modified 2 Sep 2026. No ISBN marker was detected by the current text-marker check.
- [U] The endpoint is Ministry-hosted, but the metadata indicates PDF processing; untouched publisher-original status is not established.
- [V] The app currently has 4 English lesson records in Units 1 and 4, citing Connect 5 pages 14–16 and 60–64.
- [B] Full contents/units/lesson reconciliation and assessment coverage remain to be done; four app records are not evidence of complete book coverage.

## Requirements and next execution gates

| Requirement | Acceptance criterion | Current result |
|---|---|---|
| R1 Science reconciliation | Reconcile #170/#200 overlap, keep #182 Arabic path separate, verify tests and durable output | [IN PROGRESS] |
| R2 French Mathematics | Verify TOC, every lesson/page, exercises/answers, and teaching scaffold against the retrieved 2026–27 French PDF | [IN PROGRESS] |
| R3 French language | Inspect available weekly assessment PDFs, distinguish assessment coverage from textbook coverage, do not guess school track | [PARTIAL / BLOCKED] |
| R4 English | Verify Connect 5 book contents, all lessons/pages and assessment coverage against the retrieved 2026–27 PDF | [IN PROGRESS] |
| R5 Durable evidence | Preserve metadata JSON and page-fingerprint CSV on this audit branch; no PDFs/full text | [RUN SUCCEEDED; publish step being validated] |
| R6 App/runtime validation | Lint, tests, build, registry tests, phone-sized learner walkthrough | [NOT RUN in this audit branch] |

## Explicit limits

- No school-specific weekly pacing or assigned book list was obtained.
- No student mastery or actual classroom completion is inferred.
- No Ministry teacher guide was authenticated by this run.
- No physical-phone learner walkthrough was performed.
- No PR was merged and no deployment was performed.
- The source audit did not inspect every page's instructional content; page fingerprints are an inventory, not a pedagogical review.
