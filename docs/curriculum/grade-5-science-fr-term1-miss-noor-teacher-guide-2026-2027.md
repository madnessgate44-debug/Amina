# Grade 5 Sciences en français — Term 1 Miss Noor teaching pack

**Edition:** Egypt Ministry of Education, Primary 5, 2026–2027, Term 1  
**Source:** Third-party-assembled Library PDF containing 109 book-content pages plus an appended promotional page (110 PDF pages)  
**Scope:** The nine chapters in the supplied Term 1 table of contents only  
**Teaching-pack status:** [VERIFIED] All 28 app-authored lesson plans are represented in the app data and structurally checked. PR #200 carries the explicit page-range and source-provenance updates; its CI and compliance checks passed before this documentation continuation. The PR remains unmerged, and phone-sized learner verification remains [UNPROVEN].

## Provenance and evidence boundary

- The inspected copy carries the Ministry of Education / Central Administration of Curriculum Development imprint and 2026–2027 edition information on PDF page 3 (front matter, not a numbered textbook page).
- The final book imprint is PDF page 109 and records ISBN **978-633-8530-17-4**; its production table shows 112 in the page-count field. The Library PDF has 110 pages: pages 1–109 are the book copy and page 110 is a third-party promotional insert.
- The canonical Ministry-hosted student-book endpoint is recorded in the source manifest:  
  https://elearnningcontent.blob.core.windows.net/elearnningcontent/2026_2027/Primary/Primary5/Term1/StudentBook/Science_FR_prim5_TR1.pdf
- The 109 book-content pages in the 110-page Library PDF copy were inspected for the nine chapter headings, lesson activities, questions, enrichment sections and scientific-skills appendix. PDF metadata identifies a third-party PDF-processing toolchain. Actions run [43705922358](https://github.com/madnessgate44-debug/Amina/actions/runs/43705922358) separately downloaded the canonical Ministry-hosted endpoint (109 pages; 62,976,199 bytes; SHA-256 `dc4b2d55b2e34fd21fd3f5e54c5614e727718b27dd8079d087d9cd0fa3cbbae5`). The canonical run confirmed the ISBN, Science text and French text markers but did not test the French Ministry-imprint string. [UNPROVEN] Byte-level and visual/layout identity with the Library copy; PR #200 records 109/109 normalized-text matches, but the retained canonical per-page CSV is still pending.
- **[BLOCKED]** No matching Egyptian Ministry 2026–2027 French Science teacher guide was verified. Do not substitute a prior-year guide, an Arabic-only guide, a Moroccan guide, or another country's teacher guide.
- The lesson plans below are **app-authored Miss Noor teaching material derived from the student book**. They are not Ministry teacher-guide content and are not textbook quotations.
- The source book's own “Essaye”, “Entraîne-toi”, review and experiment questions remain distinct from the new app-authored practice and answer keys.

## Chapter and lesson coverage

Printed page numbers are the numbers visible on the book pages. The lesson-level ranges below are the exact ranges checked in the student-book copy.

| Chapter | Exact chapter heading | Chapter pages | Numbered lessons and printed page ranges |
|---:|---|---:|---|
| 1 | Les os et les muscles | 6–19 | 1-1 pp. 6–7; 1-2 pp. 8–11; 1-3 pp. 12–13; 1-4 pp. 14–17 |
| 2 | Les changements des saisons | 20–27 | 2-1 pp. 20–21; 2-2 pp. 22–25 |
| 3 | Les conditions de germination | 28–43 | 3-1 pp. 28–29; 3-2 pp. 30–33; 3-3 pp. 34–35; 3-4 pp. 36–39; 3-5 pp. 40–42 |
| 4 | Les conditions de croissance | 44–51 | 4-1 pp. 44–45; 4-2 pp. 46–49 |
| 5 | De la fleur au fruit | 52–63 | 5-1 pp. 52–54; 5-2 pp. 55–59; 5-3 pp. 60–62 |
| 6 | La croissance et la reproduction humaines | 64–71 | 6-1 pp. 64–65; 6-2 pp. 66–67; 6-3 pp. 68–71 |
| 7 | La croissance et la reproduction des animaux | 72–79 | 7-1 pp. 72–73; 7-2 pp. 74–75; 7-3 pp. 76–79 |
| 8 | Les changements météorologiques | 80–91 | 8-1 pp. 80–81; 8-2 pp. 82–85; 8-3 pp. 86–89 |
| 9 | Le cycle de l’eau | 92–103 | 9-1 pp. 92–93; 9-2 pp. 94–97; 9-3 pp. 98–101 |

**Term 1 denominator: 9 chapters and 28 numbered lessons.** This is not a full-year or full-book completion claim.

## Lesson-plan record

The canonical structured teaching plans are in:

- **src/data/curriculum/scienceFrTeachingGuide2026.ts**
- Attached to the 28 current-edition lesson records by **src/data/curriculum/scienceFrCurriculum2026.ts**
- Rendered in the French lesson path by **src/components/curriculum/LessonStudyModal.tsx**

Every numbered lesson has all of the following fields:

1. Exact printed source-page range and source-edition label.
2. A complete original French explanation written for a Grade 5 learner.
3. A worked example or safe demonstration.
4. Two guided-practice prompts with expected responses.
5. Two independent-practice prompts.
6. An ordered answer key matching the independent-practice items.
7. Misconception diagnosis with an observable learner response, diagnosis and corrective prompt.
8. Remediation steps.
9. Mastery-check prompts with expected answers and success criteria.

The plan content is intentionally concise enough for a teacher to use during a lesson but specific enough to teach, practise, diagnose and verify each concept. The answer key is app-authored; it is not represented as an official Ministry answer key.

### Chapter objectives and vocabulary map

| Chapter | Core learning objectives | Core French vocabulary |
|---:|---|---|
| 1 | Explain how paired muscles pull bones; identify joints and cartilage; locate the skull, ribs and vertebral column; compare animal movement structures. | os, muscle, contraction, relâchement, articulation, cartilage, squelette, crâne, côtes, colonne vertébrale, locomotion |
| 2 | Describe seasonal change in a plant; sequence germination, growth, flowering and fruiting; distinguish hibernation from migration. | saison, température, germer, fleurir, fruit, graine, se faner, hibernation, migration |
| 3 | Identify embryo and cotyledons; explain the iodine test for starch; test water, air and suitable temperature using fair comparisons; distinguish germination from later growth. | graine, embryon, cotylédon, amidon, germination, solution d’iode, variable, condition constante, dormance |
| 4 | Explain the role of sunlight and fertilizer in plant growth; plan fair comparisons; record plant growth. | croissance, lumière du Soleil, engrais, nutriments, plantule, tige, feuilles, mesurer, comparer |
| 5 | Distinguish male and female luffa flowers; identify microscope parts and safe use; explain pollination and fruit development. | fleur mâle, fleur femelle, étamine, pollen, carpelle, sépale, pétale, pollinisation, microscope, oculaire, objectif, platine, grossissement |
| 6 | Sequence human life stages; explain inherited similarities and differences; describe healthy food, sufficient sleep and suitable physical activity. | croissance, naissance, petite enfance, enfance, adolescence, jeunesse, vieillesse, hériter, caractère, alimentation saine, sommeil, activité physique |
| 7 | Compare animals that give birth with animals that lay eggs; define hatching; explain how reproduction and protected habitats support species continuity. | reproduction, espèce, donner naissance, pondre, œuf, éclosion, petit, réserve naturelle, conservation |
| 8 | Estimate cloud cover using the book's eight-part model; observe cloud movement from a fixed reference; interpret satellite images and justify a forecast. | météo, couverture nuageuse, nuageux, ensoleillé, vent, direction, boussole, satellite, radar, prévision, khamsin |
| 9 | Explain evaporation and condensation; sequence the water cycle; connect the cycle to rivers, seas and the Nile. | évaporation, vapeur d’eau, condensation, gouttelette, refroidissement, nuage, précipitation, rivière, mer, cycle de l’eau |

Chapter 5 also has a separate printed-page-63 “Révision et exercices” review. Lesson 5-3 ends on p. 62; the review is indexed separately in SCIENCE_FR_TERM1_CHAPTER_REVIEWS_2026.

## Enrichment pages retained

These are part of the student book and must not be dropped from the teaching sequence:

| Related chapter | Printed pages | Enrichment topic |
|---|---:|---|
| 1 | 18–19 | Camel movement and heat adaptations |
| 2 | 26–27 | Fennec adaptations and traditional clothing |
| 3 | 43 | Comparing familiar seed shapes and colours |
| 3 and 4 | 50–51 | Seed dormancy and nutrient-rich Nile soil |
| 8 | 90–91 | Satellite, radar and the khamsin |
| 9 | 102–103 | The Nile and the wider African water cycle |

Original summaries for these sections are stored in SCIENCE_FR_TERM1_ENRICHMENT_2026 in the teaching-plan module. They are labelled as app-authored summaries.

## Scientific-method appendix

The book's final pages provide reusable skills that should be practised across the nine chapters:

| Printed page | Skill | Teaching expectation |
|---:|---|---|
| 104 | Fair tests | Change one factor and keep the other conditions constant. |
| 105 | Microscope use | Identify parts and follow the safe focusing sequence. |
| 106 | Recording observations | Record repeated observations with notes, drawings, tables and graphs. |
| 107 | Scientific inquiry | Ask, predict, plan, conduct and record, organize data, then conclude. |

These four skills are indexed in SCIENCE_FR_TERM1_METHOD_SKILLS_2026.

## Source and content safeguards

- Current-edition coverage is the 28 lessons in SCIENCE_FR_CURRICULUM_2026_LESSONS, across the nine chapters above.
- The older three national Science records and three older French-extract Science records remain registered only to preserve legacy identifiers; they are quarantined as unavailable / pending_materials. They must not appear as current-edition coverage.
- Older topics such as plant needs/photosynthesis, food webs, coral bleaching and states of matter are not counted toward this 2026–2027 book without page-level evidence.
- The source-book practice questions and app-authored practice are separate. Do not label the app-authored questions as exact Ministry questions.
- The French lesson modal must use French titles, explanations, concepts, vocabulary, exercise labels and feedback when the active lesson language is French.
- Use safe demonstrations: no tasting iodine, no pointing a microscope at the Sun, no unsafe lifting, and adult supervision for glass slides or solutions.
- For human-growth material, use neutral fictional examples and do not ask the learner to disclose private family or puberty information.

## Remaining blockers and release gates

1. **[BLOCKED] Ministry teacher guide:** no matching 2026–2027 French Grade 5 Science guide has been verified. Continue using the clearly labelled app-authored guide until an exact matching source is found.
2. **[BLOCKED] Term 2 Science:** the Term 2 student book and any matching teacher guide remain unsourced. Do not claim full-year completion.
3. **[UNPROVEN] Assessment-book alignment:** the separate assessment-book PDF has not yet been inspected question by question in this work item.
4. **[VERIFIED] CI/build:** current main passed typecheck, the full test suite, production build and Engineering Execution OS compliance. **[UNPROVEN] Runtime:** a phone-sized French lesson walkthrough is still required before learner usability is claimed.
5. **[VERIFIED] Scope:** this work is Grade 5 Science only; no unrelated subject was changed.

## Evidence labels

- **[VERIFIED]** The inspected copy's Ministry imprint and 2026–2027 edition; 109 book-content pages in a 110-page PDF; nine chapter headings; 28 numbered lesson page ranges; six enrichment sections; and four scientific-method appendix skills. The direct Ministry-file provenance remains [UNPROVEN].
- **[VERIFIED]** The app-authored teaching-plan data structure now contains a complete French explanation, worked example, guided practice, independent practice, answer key, misconception diagnosis, remediation and mastery checks for each of the 28 Term 1 lessons.
- **[BLOCKED]** Matching Ministry teacher guide and Term 2 Science student book.
- **[UNPROVEN]** Production deployment and live learner walkthrough until CI and runtime evidence are available.


## Learner-facing teaching sequence

The current-mainline integration adds a dedicated **Practice / Pratique** tab to the Miss Noor lesson view. For lessons with an app-authored teacher plan, it exposes:

- Guided-practice prompts, with expected responses revealed on request.
- Independent-practice prompts, with the ordered answer key hidden until requested.
- Misconception examples, diagnoses and corrective prompts.
- Remediation steps.
- Mastery-check prompts, success criteria and revealable expected answers.

The teaching plan remains original Miss Noor material. This interface does not turn it into an official Ministry teacher guide. Automated CI and a live French learner walkthrough on a phone are still required before the integration is declared verified in production.


## Verification and source-copy addendum — 14 November 2026

### Source provenance

The Library PDF is 110 pages, 59,040,102 bytes. Pages 1–109 contain the book copy; page 110 is a third-party promotional insert. PDF page 3 contains the Ministry/Central Administration 2026–2027 copyright statement; PDF page 109 contains ISBN 978-633-8530-17-4. The PDF metadata identifies PDFsharp 1.50.4000-netstandard and third-party site keywords. Local SHA-256: `6fe1d9fdcf2108c76e73c6a148277629b2d71a9a95acec427f533190b163779c`.

**[UNPROVEN]** The Library copy has not been byte-for-byte compared with the canonical Ministry-hosted endpoint. It is a third-party-assembled copy bearing the Ministry imprint, not a verified untouched Ministry download.

### Mainline verification

- **[VERIFIED]** PR [#175](https://github.com/madnessgate44-debug/Amina/pull/175) merged at `6a345c3f8543f6f4a42b8a5096d4dced587cd6b9`; current main is `d094933379dddf7db6b37cfd419dae06caf3174d`.
- **[PASS]** CI [43535411225](https://github.com/madnessgate44-debug/Amina/actions/runs/43535411225): `npm run lint`, `npm test` (39 suite summaries passed, 0 failed; curriculum registry 23 passed, 0 failed), and `npm run build` (Vite 8.3.5, 1,792 modules, 575 ms).
- **[PASS]** Engineering Execution OS compliance [43535411162](https://github.com/madnessgate44-debug/Amina/actions/runs/43535411162).
- **[VERIFIED]** Vercel's status check on current main reports `success` / `Deployment has completed`; the status does not replace a live learner walkthrough.
- **[BLOCKED]** No matching 2026–2027 Egyptian Ministry French Science teacher guide or Term 2 student book is verified. The 28-lesson pack remains app-authored and Term 1 only.
- **[UNPROVEN]** Phone-sized French learner walkthrough and custom-domain behavior.

## Canonical source and chapter-heading update — 16 November 2026

### Student-book source

- **[VERIFIED]** The canonical URL is Ministry-hosted and was successfully downloaded in Actions run [43705922358](https://github.com/madnessgate44-debug/Amina/actions/runs/43705922358): HTTP 200, `application/pdf`, 109 pages, 62,976,199 bytes, SHA-256 `dc4b2d55b2e34fd21fd3f5e54c5614e727718b27dd8079d087d9cd0fa3cbbae5`.
- **[VERIFIED]** The run's marker scan found ISBN 978-633-8530-17-4, Science text and French text. It did not test the French Ministry-imprint string, and its audit kind was structural inspection only.
- **[VERIFIED]** The Library source used to author these plans is a different 110-page file (59,040,102 bytes; SHA-256 `6fe1d9fdcf2108c76e73c6a148277629b2d71a9a95acec427f533190b163779c`). Its PDF page 3 visibly contains the Ministry/Central Administration 2026–2027 rights statement, PDF page 109 contains the ISBN, and PDF page 110 is an appended third-party promotional page.
- **[UNPROVEN]** The two PDFs are not byte-identical. PR #200 records a 109/109 normalized-text fingerprint match, but the retained source-audit artifact from run #43705922358 predates the per-page fingerprint workflow and does not contain the canonical page CSV. Do not treat the text-match claim as independently reproducible until the updated workflow publishes that CSV and it is compared with the Library fingerprint file.
- **[UNPROVEN]** Matching extracted text does not establish matching diagrams, images, page layout or visual rendering. The current review includes the TOC, all nine chapter-opening pages, Chapter 1 enrichment pp. 18–19, the Ministry imprint page and the ISBN page; it is not a high-resolution review of every illustration.

### Chapter heading rule

The contents page (PDF page 6 / printed page 5) is the source of truth for chapter-level French headings and start pages. Some chapter-opening banners use variants (for example, “Les conditions de la germination”, “La croissance et la reproduction chez l'être humain”, and “Changements météorologiques”). Keep `unitNameFr` aligned to the exact TOC headings already stored in the 28 lesson records; retain individual lesson titles separately.

### Teacher-guide source status

- **[BLOCKED]** No matching Egyptian Ministry 2026–2027 Grade 5 French Science teacher guide has been authenticated.
- **[UNPROVEN]** A third-party site lists a 29-page 2026–2027 Grade 5 Science `دفتر تحضير`, but the listing does not establish Ministry authorship or French-track alignment. It is not used as official teacher-guide content: https://www.modrsbook.com/primary-5/term-1/science/dftr-thdyr-science-llsf-alkhams-alabtdayy-altrm-alaol-pdf-2027
- **[VERIFIED]** Every lesson explanation, worked example, guided and independent practice item, answer key, misconception diagnosis, remediation step and mastery check in this pack remains app-authored Miss Noor content, not Ministry teacher-guide content.

### Integration verification and remaining limits

- **[PASS]** PR #200 CI run [43821315922](https://github.com/madnessgate44-debug/Amina/actions/runs/43821315922) passed the blocking type check, `npm run lint`, `npm test` and `npm run build`; the curriculum registry suite reported 54 passed, 0 failed, and Vite built successfully in 749 ms.
- **[PASS]** Engineering Execution OS compliance run [43821315933](https://github.com/madnessgate44-debug/Amina/actions/runs/43821315933) reported `ENGINEERING EXECUTION OS COMPLIANCE: PASS`.
- **[UNPROVEN]** PR #200 remains unmerged. These CI results are not a production deployment or a phone-sized learner walkthrough.
- **[BLOCKED]** Term 2 Science and the separate assessment-book question-by-question audit remain outside this Term 1 teaching pack.


## Canonical page-text reconciliation update — 17 November 2026

- **[VERIFIED]** The canonical Ministry-hosted student-book PDF was downloaded in GitHub Actions run [43706201870](https://github.com/madnessgate44-debug/Amina/actions/runs/43706201870), artifact `14158542215`. Its 109 per-page normalized-text fingerprints were independently compared with the 110-page Library copy's fingerprint CSV: 109/109 book pages match exactly on normalized-text SHA-256 and character count; 0 missing; 0 mismatches. The Library-only PDF page 110 has zero extracted characters.
- **[VERIFIED]** The two fingerprint CSVs and comparison JSON are durably committed on branch `audit/ministry-science-source-results`, at head `de9280472d7ab3b62cf90464da0cd6407d023a73`: [canonical fingerprints](https://github.com/madnessgate44-debug/Amina/blob/audit/ministry-science-source-results/docs/audits/science-2026-2027/ministry-page-fingerprints.csv), [Library fingerprints](https://github.com/madnessgate44-debug/Amina/blob/audit/ministry-science-source-results/docs/audits/science-2026-2027/library-page-fingerprints.csv), [comparison JSON](https://github.com/madnessgate44-debug/Amina/blob/audit/ministry-science-source-results/docs/audits/science-2026-2027/library-comparison.json).
- **[LIMIT]** This is normalized extracted-text equivalence, not byte identity, visual/layout identity, diagram equivalence, untouched publisher-original provenance or pedagogical equivalence. The PDFs have different SHA-256 hashes.
- **[UNPROVEN]** The updated workflow in PR #200 has not yet completed its own end-to-end publication run from `main`. Its workflow checks the canonical French imprint and ISBN before publishing the current JSON/CSV reports to the results branch.
- **[BLOCKED]** No exact Egyptian Ministry 2026–2027 Grade 5 French Science teacher guide has been authenticated. The third-party 29-page preparation-notebook listing remains insufficient evidence of Ministry authorship and French-track alignment; it is not used as official content.
- **[UNPROVEN]** High-resolution review of every instructional diagram, independent pedagogical peer review and a physical-phone French learner walkthrough remain outstanding. CI success does not close these runtime and pedagogy gates.
- **[BLOCKED]** The exact 2026–2027 Term 2 French Science student book remains unavailable to this reconstruction. Scope remains Term 1 only.

### Latest PR verification — 17 November 2026

- **[VERIFIED]** PR [#200](https://github.com/madnessgate44-debug/Amina/pull/200) head `dd5f1ae37b120b84065570648f6c72c7424cc6c0`, based on `main` `527df4fb7da32d6f3badb5f31d1172ffc0de6eec`, remains open and mergeable.
- **[PASS]** CI run [44043136740](https://github.com/madnessgate44-debug/Amina/actions/runs/44043136740): blocking type check, `npm run lint`, `npm test` and `npm run build` all succeeded. Test output includes assembly 53 passed, adaptive scenarios 27 passed, job persistence 19 passed; build transformed 1,792 modules and completed in 588 ms. Existing Vite `__dirname` and large-chunk warnings remain non-blocking.
- **[PASS]** Engineering Execution OS compliance run [44043136707](https://github.com/madnessgate44-debug/Amina/actions/runs/44043136707): `ENGINEERING EXECUTION OS COMPLIANCE: PASS`.
- **[UNPROVEN]** No production deployment or phone-sized learner walkthrough is claimed from these PR checks.


## Post-merge execution and production closeout — 17 November 2026, 10:35 UTC

- **[VERIFIED]** PR [#200](https://github.com/madnessgate44-debug/Amina/pull/200) was merged after its latest-commit CI and Engineering Execution OS checks passed. Squash merge commit on `main`: `f2119cc5d2875fb9dc0b2f7d2b7958e283d85d3d`. The earlier PR-open status above is a timestamped pre-merge checkpoint and is superseded by this section.
- **[PASS]** Main-branch CI run [44066062429](https://github.com/madnessgate44-debug/Amina/actions/runs/44066062429): dependency install, blocking type check, lint, tests and production build all passed.
- **[PASS]** Main-branch Engineering Execution OS compliance run [44066062217](https://github.com/madnessgate44-debug/Amina/actions/runs/44066062217): policy verification passed.
- **[PASS]** Main-branch canonical Ministry PDF source-audit run [44066062268](https://github.com/madnessgate44-debug/Amina/actions/runs/44066062268): downloaded the Ministry-hosted PDF (HTTP/download and PDF signature checks passed); inspected 109 pages; confirmed ISBN 9786338530174, French Ministry imprint and French rights notice; generated page fingerprints; removed downloaded PDF and extracted text; published JSON and CSV evidence to `audit/ministry-science-source-results`; uploaded only the small report artifact. The report records SHA-256 `dc4b2d55b2e34fd21fd3f5e54c5614e727718b27dd8079d087d9cd0fa3cbbae5`, 62,976,199 bytes, 109 pages. Metadata names PDF Candy Desktop / Icecream PDF Candy Desktop / Ghostscript, so file metadata does not establish untouched publisher-original provenance. Manual content and visual review remain required.
- **[VERIFIED]** Results branch now points to `ec694bc970159001304fabed0b18facf7908b1ea`; the automated run refreshed `source-audit.json` and `ministry-page-fingerprints.csv`. [Durable source audit](https://github.com/madnessgate44-debug/Amina/tree/audit/ministry-science-source-results/docs/audits/science-2026-2027).
- **[VERIFIED]** Vercel production deployment `dpl_5twNYqEuUdq1y1yCodW73eqV3Mdx` is `READY`, targets production, and is linked to the exact main commit above. Production aliases: [amina-nine-sepia.vercel.app](https://amina-nine-sepia.vercel.app) and [amina-forge-fe22.vercel.app](https://amina-forge-fe22.vercel.app).
- **[UNPROVEN]** Production deployment readiness does not establish a physical-phone learner walkthrough or lesson-by-lesson pedagogical acceptance.
- **[BLOCKED]** The exact Egyptian Ministry 2026–2027 Grade 5 French Science teacher guide remains unauthenticated. No third-party notebook is substituted for it.
