# Grade 5 Term 1 curriculum status — 2026–2027

**Repository baseline:** `main` at `527df4fb7da32d6f3badb5f31d1172ffc0de6eec` (inspected 15 Nov 2026 UTC).  
**Audit branch:** `audit/grade5-term1-subject-source-audit-2026-11-15`.  
**Latest source audit:** [43714053006](https://github.com/madnessgate44-debug/Amina/actions/runs/43714053006) — [PASS] 17/21 PDFs retrieved; 448 pages fingerprinted, including OCR fallback for English assessments.  
**PR CI validation:** [43714399890](https://github.com/madnessgate44-debug/Amina/actions/runs/43714399890) — [PASS] on the latest code/docs revision before this status-ledger update.  
**Compliance validation:** [43714399881](https://github.com/madnessgate44-debug/Amina/actions/runs/43714399881) — [PASS] on the same revision.  
**Scope:** Egyptian Primary Grade 5, academic year 2026–2027, Term 1. Mathematics is the French-track book. School-specific pacing and the school's exact French1/French2 assignment remain unverified.

## Executive status

| Subject | Verified source denominator | Current app registry inventory | Result |
|---|---|---:|---|
| French Science | 9 chapters / 28 numbered lessons; prior canonical-host/Library comparison matched 109/109 normalized page-text fingerprints | 28 current-edition lessons and 28 app-authored teacher-guide plans | [IN PROGRESS] Source/teacher-guide data exist; PR #200 source reconciliation is open and #170 is stale/non-mergeable |
| Mathematics (French track) | 46 StudentBook TOC lessons across 6 units; 74-page performance-assessment book retrieved | 12 national-book lesson records + 4 separate French-extract records = 16 registered records | [GAP] 11 exact TOC matches, 1 title/page discrepancy, 34 missing; 3 of 4 extract records are mismatched or unsupported |
| French language | 13 weekly assessments retrieved across two named tracks; no separate StudentBook or separate performance-assessment book found at tested endpoints | 4 lesson records | [PARTIAL / TRACK UNVERIFIED] Assessment materials identify French1 “Bien joué 1” and French2 “Alex et Zoé 2”; school track is unknown |
| English | 6 units in StudentBook scope-and-sequence; 74-page performance-assessment book OCR-indexed | 2 lesson records (Units 1 and 4) | [GAP] Four units have no app lesson record; exact matching of the two existing records is unverified |

These counts describe source and repository coverage only. They do not measure learner mastery, class pacing, or school-certified completion.

## 1. Science — French track

- [V] The current main registry imports `SCIENCE_FR_CURRICULUM_2026_LESSONS`; the source file defines the 28 current-edition lessons across nine chapters.
- [V] The current main teacher-guide registry `SCIENCE_FR_TEACHER_GUIDE_2026` contains 28 keyed lesson plans. The registry test asserts 28 plans and checks their required teaching components. These are app-authored plans, not an authenticated Ministry teacher guide.
- [V] The earlier canonical-hosted Science PDF audit found 109/109 normalized extracted-text pages matching the inspected Library copy. The Library PDF has one additional promotional page outside the 109-page book.
- [U] Text-fingerprint equivalence does not prove byte identity, untouched publisher-original provenance, visual/layout identity, or diagram fidelity.
- [V] PR [#200](https://github.com/madnessgate44-debug/Amina/pull/200) is open, 10 commits ahead of main and 0 behind at inspection; GitHub reports it mergeable. Its CI run [43708932387](https://github.com/madnessgate44-debug/Amina/actions/runs/43708932387) and compliance run [43708932399](https://github.com/madnessgate44-debug/Amina/actions/runs/43708932399) passed. It corrects the French imprint/source notes, camel enrichment summary and source-audit publishing.
- [V] PR [#170](https://github.com/madnessgate44-debug/Amina/pull/170) is stale: it is 38 commits ahead and 27 behind current main, GitHub reports it non-mergeable, and its merge base is `ed9aa246e6156748352a513db76902dc766a252b`. Its added Chapter 1 guide duplicates content already present in main's 28-plan teacher-guide registry. Its explicit `sourceRef.pageRange` and teaching-turn changes are separate unmerged changes; do not merge this PR as-is.
- [V] PR [#182](https://github.com/madnessgate44-debug/Amina/pull/182) is an Arabic Science draft held by a separate registry/availability blocker. It is not part of the French Science work.
- [V] PR [#180](https://github.com/madnessgate44-debug/Amina/pull/180) is Arabic Maths, not the requested French Mathematics source.
- [B] No merge or production deployment was performed. Owner approval remains required.

## 2. Mathematics — French track

### StudentBook and performance-assessment evidence

- [V] StudentBook URL: https://elearnningcontent.blob.core.windows.net/elearnningcontent/2026_2027/Primary/Primary5/Term1/StudentBook/Math_FR_prim5_TR1.pdf
- [V] StudentBook retrieval: 2026-11-15T12:17:09Z; HTTP 200; 17,195,754 bytes; 141 PDF pages; all 141 pages fingerprinted.
- [V] StudentBook SHA-256: `baea709a1080bfe383e8e1f040c57d68b8c1b1f6e17b7810fd5401c7187d5ace`.
- [V] Performance-assessment URL: https://elearnningcontent.blob.core.windows.net/elearnningcontent/2026_2027/Primary/Primary5/Term1/Book_of_Performance_and_Evaluations/Math_fr_prim5_t1_Assmt.pdf
- [V] Performance-assessment retrieval: 2026-11-15T12:30:34Z; HTTP 200; 9,487,796 bytes; 74 PDF pages; all 74 pages fingerprinted. SHA-256: `9521338362528fc1c7e0717c92b2f596c7177860c37c1311a80ed86fa6c67479`.
- [V] The uppercase `Math_FR_prim5_t1_Assmt.pdf` candidate returned HTTP 404; the lowercase `Math_fr_prim5_t1_Assmt.pdf` endpoint is the working file.
- [V] StudentBook PDF metadata: Author `PDF Candy Desktop`; Creator `Icecream PDF Candy Desktop 3.13`; Producer `PDF Xpansion, Version 12.0.3.3`; modified 1 Sep 2026. No ISBN marker was detected.
- [V] Performance-assessment PDF metadata: Author `PDF Candy Desktop`; Creator `Icecream PDF Candy Desktop 3.13`; Producer `GPL Ghostscript 10.07.0`; created 5 Oct 2026. No ISBN marker was detected.
- [U] Ministry hosting is verified; untouched publisher-original provenance is not. Both files show third-party PDF processing.
- [V] StudentBook TOC pages 2–4 identify **46 lessons across six units**. The 46-row reconciliation matrix is `math-fr-lesson-reconciliation.csv`. The performance-assessment page-heading index identifies lesson material across Units 1–6 and weekly/term assessments.

### App reconciliation

- [V] `mathCurriculum.ts` contains 12 top-level lesson records; all 12 are registered as French-instruction/French-assessment Mathematics through `officialCurriculum.ts` and the French assessment overlay.
- [V] `mathFrCurriculum.ts` contains 4 additional top-level records, also registered to the same `subj_math` / French-bilingual track. Total registered Math records: 16, not 46.
- [V] Of the 46 TOC lessons: 11 have an exact matching app record; Unit 6 Lesson 1 has a page-121 record but the app title “Order of Operations” differs from the TOC title “Expressions numériques”; 34 have no matching app record.
- [V] The four extra French-extract records are reviewed in `math-fr-extra-record-review.csv`: one duplicates Unit 1 Lesson 1; one compares decimals at p.9 while the TOC's comparison lesson is Unit 1 Lesson 4 at p.15; one claims equivalent fractions at p.25, absent from the 46-entry TOC; one places powers-of-ten decimal multiplication at Unit 3 p.45, while the TOC places it at Unit 5 Lesson 1 p.92.
- [B] Do not count those four extra records as additional official coverage. The 34 missing lessons and the Unit 6 title discrepancy require content reconstruction and app correction.
- [U] The source audit has not reviewed every instructional page, worked example, exercise or answer key. TOC matching and assessment-page headings are not full lesson-content verification.

## 3. French language

- [V] The earlier official catalogue inspection found no separate French-language Grade 5 StudentBook among its listed 2026–2027 Term 1 books.
- [V] Ministry-hosted weekly assessment PDFs were retrieved for:
  - French1: weeks 1–7 (7/7), 4 PDF pages each. Their headers identify the series **Bien joué 1**.
  - French2: weeks 1–5 and 7 (6/7), 3 PDF pages each. Their headers identify **Alex et Zoé 2**. Week 6 returned HTTP 404.
- [V] Candidate standalone French1 and French2 performance-assessment-book endpoints returned HTTP 404.
- [V] The weekly assessment PDFs' metadata generally identifies `Start Computer` and Microsoft Word as author/creator. The source URL is Ministry-hosted; file metadata alone does not independently authenticate authorship.
- [U] Weekly assessment materials establish two available tracks, not which one the school assigns, and do not constitute a full student textbook.
- [V] The app's `frenchCurriculum.ts` has 4 top-level lesson records (greetings, family, classroom objects, timetable) and cites a generic Ministry French book whose title/identity is not verified.
- [B] Do not label the four app records as official or invent a coursebook. The school's French1/French2 assignment remains unknown; continue by analysing the retrieved assessments separately by track.

## 4. English

- [V] StudentBook URL: https://elearnningcontent.blob.core.windows.net/elearnningcontent/2026_2027/Primary/Primary5/Term1/StudentBook/English_language_prim5_t1.pdf
- [V] StudentBook retrieval: 2026-11-15T12:17:13Z; HTTP 200; 18,757,051 bytes; 113 PDF pages; all 113 pages fingerprinted.
- [V] StudentBook SHA-256: `da7e3dd769bbdfc3506a6d4fea96ed6e62ee3a49d95ad15968e4c2bbcf7513f4`.
- [V] Performance-assessment URL: https://elearnningcontent.blob.core.windows.net/elearnningcontent/2026_2027/Primary/Primary5/Term1/Book_of_Performance_and_Evaluations/English_prim5_t1_Assmt.pdf
- [V] Performance-assessment retrieval: HTTP 200; 11,788,956 bytes; 74 PDF pages. SHA-256: `41b01ce8e0530ba2400696a4fad31a063f775980bf2995e9e2687fa23e2d1472`.
- [V] The English assessment PDF was image-based: 73 pages were sent through Tesseract OCR (eng+ara), and 71 produced text. The audit stores only normalized page hashes and concise heading candidates, not OCR full text.
- [V] StudentBook PDF metadata: Creator `Icecream PDF Candy Desktop 3.13`; Producer `PDF Xpansion, Version 12.0.3.3`; created 17 Aug 2026, modified 2 Sep 2026. Assessment PDF metadata identifies Author `PDF Candy Desktop`, Creator `Icecream PDF Candy Desktop 3.13`, Producer `GPL Ghostscript 10.07.0`; no ISBN marker detected.
- [U] Ministry-hosted retrieval is verified; untouched publisher-original provenance is not.
- [V] StudentBook scope-and-sequence pages 3–5 identify six units: Food, Nature, and Culture; My Healthy Body; When Nature Changes; My Community; Our World, Our Resources; The Talking Earth.
- [V] OCR heading candidates from the assessment book identify lesson material across all six units, including Life Along the Nile, Sports for Better Health, Weather Wonders and Warnings, The New Administrative Capital, The Gifts of Nature, Metals and Minerals in Our World, The Talking Earth and Egyptian Villages. These headings are OCR candidates, not visually verified titles.
- [V] The app's `englishCurriculum.ts` contains only 2 top-level records: Unit 1 “The Generous Apple Tree” (p.14) and Unit 4 “Elephantine Island in Aswan” (p.60). Their exact equivalence to book lesson pages has not been verified. Units 2, 3, 5 and 6 have no app record.
- [B] The current English registry is incomplete. All six units and their lessons require page-by-page reconciliation; two app records are not evidence of full-book coverage.

## 5. Durable evidence and method

- [V] Latest source audit run [43714053006](https://github.com/madnessgate44-debug/Amina/actions/runs/43714053006) completed successfully. It attempted 21 Ministry-hosted URLs and retrieved 17 PDFs: 2 student books, 2 performance-assessment books, 7 French1 weekly assessments, and 6 French2 weekly assessments.
- [V] The successful PDFs produced 448 page fingerprints: Math StudentBook 141, English StudentBook 113, Math assessment 74, English assessment 74, French1 weekly assessments 28, French2 weekly assessments 18.
- [V] The four 404 endpoints are Math uppercase assessment filename, French1 assessment-book candidate, French2 assessment-book candidate and French2 week 6.
- [V] The repository stores source metadata JSON, page-fingerprint CSV and a 448-page heading index. The short TOC review extract was kept only in a one-day Actions artifact; no PDFs or full extracted book text/OCR were committed.
- [V] Page fingerprints and heading candidates are extraction aids only; they do not prove visual equivalence or instructional accuracy.
- [V] Intermediate audit attempts were repaired before final success: concurrent runs caused non-fast-forward pushes; early heading-index attempts exposed a CSV schema mismatch. The final publisher succeeded on run 43714053006. No main-branch write occurred.

## Verification ledger

- [V] Source audit [43714053006](https://github.com/madnessgate44-debug/Amina/actions/runs/43714053006): PASS; 21 source URLs attempted, 17 PDFs retrieved, 448 pages fingerprinted, English assessment OCR fallback completed.
- [V] Engineering Execution OS compliance [43714399881](https://github.com/madnessgate44-debug/Amina/actions/runs/43714399881): PASS on the OCR/source-audit PR revision.
- [V] PR CI [43714399890](https://github.com/madnessgate44-debug/Amina/actions/runs/43714399890): PASS. `npm ci --legacy-peer-deps` added 185 packages, audited 186 and found 0 vulnerabilities; blocking type check passed; `npm test` passed (representative summaries: integrity 86/0, curriculum registry 52/0, media 17/0, assembly 53/0, adaptive scenarios 27/0, job persistence 19/0); `npm run build` passed with Vite built in 607 ms.
- [V] The build/test run emitted non-blocking warnings: PDF.js `standardFontDataUrl`, Vite configuration/chunk-size, Node `punycode` deprecation, and GitHub Actions Node 20 deprecation notices.
- [U] Physical-phone walkthrough, visual diagram review and teacher-guide verification remain unperformed.

## Requirements and next gates

| Requirement | Acceptance criterion | Current result |
|---|---|---|
| R1 Science reconciliation | Reconcile #170/#200 overlap; keep Arabic drafts separate; verify source and all 28 plans | [IN PROGRESS] Main has 28 plans; #200 remains open; #170 is stale/non-mergeable |
| R2 French Mathematics | Reconcile all 46 TOC lessons, assessment coverage, examples/exercises/answers and teaching scaffold | [PARTIAL] 46-row TOC matrix; 11 exact records, 1 title discrepancy, 34 missing; assessment book retrieved; content-page review remains |
| R3 French language | Review weekly assessments by track; do not invent textbook or school track | [PARTIAL] 13 assessments retrieved; French2 week 6 missing; track assignment unknown |
| R4 English | Reconcile six units and all lessons/pages, examples/exercises and assessment coverage | [PARTIAL] StudentBook and performance-assessment book retrieved; OCR 71/73 pages; only two app records |
| R5 Durable evidence | Preserve source JSON, page fingerprints, heading index and matrices on feature branch | [PASS] Source audit and publishing step passed |
| R6 App/runtime validation | Lint, tests, build, registry tests and phone-sized learner walkthrough | [PASS] npm lint/test/build in PR CI; [NOT RUN] physical-phone walkthrough |

## Explicit limits

- No school-specific weekly pacing or assigned coursebook list was obtained.
- No student mastery or actual classroom completion is inferred.
- No Ministry teacher guide was authenticated by this audit.
- No physical-phone learner walkthrough was performed.
- No PR was merged and no deployment was performed.
- Page hashes and TOC/scope-sequence/OCR extraction are not a substitute for reviewing every instructional page, exercise, answer, diagram and teaching interaction.
