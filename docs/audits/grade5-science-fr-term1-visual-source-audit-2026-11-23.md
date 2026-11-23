# Grade 5 French Science Term 1 — image-backed source audit

**Audit date:** 23 November 2026  
**Repository baseline inspected:** `main` at `cdd6dd0281241a0b5ddb0f013bc4f037da009d7d`  
**Target:** Egyptian Ministry of Education, Primary 5, Sciences en français, 2026–2027, Term 1  
**Audit type:** visual cross-check of the inspected Library student-book copy; not a full diagram-equivalence or pedagogical certification.

## Executive result

- **[VERIFIED]** The Library copy's contents page (PDF p. 6; printed p. 5) lists the nine chapter headings and starting pages in the repository manifest. The chapter-level labels must follow the contents page, not small wording variations in individual chapter banners.
- **[VERIFIED]** All **28/28 lesson-opening page images** were visually inspected in the Library copy. Each opening image is relevant to its lesson topic; no obviously unrelated lesson image was observed in this sample.
- **[VERIFIED]** The source-copy Ministry imprint/rights page (PDF p. 3) identifies the Ministry of Education and Technical Education of the Arab Republic of Egypt and the 2026/2027 edition. The final imprint page shows ISBN `978-633-8530-17-4`.
- **[VERIFIED]** Selected exercise pages, all six enrichment sections, the separate Chapter 5 review, and the four scientific-method appendix pages were also inspected as listed below.
- **[UNPROVEN]** This does not prove that every internal diagram, photograph, caption or layout in the Library copy is visually identical to the canonical Ministry-hosted PDF. The two PDF byte hashes differ; normalized extracted-text matching is not image matching.
- **[UNPROVEN]** This is not an independent scientific/pedagogical peer review, nor a phone-sized learner walkthrough.

## Source and provenance boundary

The repository's source record identifies:

| Copy | Recorded evidence |
|---|---|
| Canonical Ministry-hosted StudentBook | 109 PDF pages; 62,976,199 bytes; SHA-256 `dc4b2d55b2e34fd21fd3f5e54c5614e727718b27dd8079d087d9cd0fa3cbbae5`; endpoint: [Ministry-hosted PDF](https://elearnningcontent.blob.core.windows.net/elearnningcontent/2026_2027/Primary/Primary5/Term1/StudentBook/Science_FR_prim5_TR1.pdf) |
| Inspected Library copy | 110 PDF pages as recorded in the source manifest; 59,040,102 bytes; SHA-256 `6fe1d9fdcf2108c76e73c6a148277629b2d71a9a95acec427f533190b163779c`; PDF p. 110 is recorded as a third-party promotional insert |

**[VERIFIED]** GitHub Actions source-audit evidence records a successful HTTP 200 download of the canonical endpoint in [run 43705922358](https://github.com/madnessgate44-debug/Amina/actions/runs/43705922358), followed by the 109-page fingerprint artifact from [run 43706201870](https://github.com/madnessgate44-debug/Amina/actions/runs/43706201870). The repository's page-fingerprint comparison records 109/109 normalized extracted-text matches between the canonical PDF and the Library copy.

**[LIMIT]** The inspected image pages below come from the Library copy. Text fingerprints do not establish byte identity, diagram equivalence, layout equivalence or untouched publisher-original provenance. Do not upgrade the visual-source status on the basis of this audit alone.

## Lesson-opening visual cross-check

PDF page numbers below refer to the inspected PDF copy; printed page numbers are the textbook pagination used by lesson records.

| Chapter | Lesson-opening printed pages (PDF pages) | Visual subject checked |
|---|---|---|
| 1. Les os et les muscles | 6, 8, 12, 14 (7, 9, 13, 15) | Arm flexion with muscle overlay; knee joint/cartilage model; human muscles and skeleton; dog and X-ray skeleton |
| 2. Les changements des saisons | 20, 22 (21, 23) | Annual luffa plant cycle; lizard activity in warm and cold conditions |
| 3. Les conditions de germination | 28, 30, 34, 36, 40 (29, 31, 35, 37, 41) | Bean seed/cotyledons; water comparison; moist-cotton versus submerged-seed comparison; warm/cold germination comparison; germination summary |
| 4. Les conditions de croissance | 44, 46 (45, 47) | Seedlings with and without sunlight; plants with and without fertilizer |
| 5. De la fleur au fruit | 52, 55, 60 (53, 56, 61) | Male/female luffa flowers; microscope; bee visiting flowers |
| 6. La croissance et la reproduction humaines | 64, 66, 68 (65, 67, 69) | Human growth across ages; family resemblance; healthy-growth activity |
| 7. La croissance et la reproduction des animaux | 72, 74, 76 (73, 75, 77) | Cat and kittens; fish; comparison of animal forms and habitats |
| 8. Les changements météorologiques | 80, 82, 86 (81, 83, 87) | Cloud cover; cloud movement over the pyramids; satellite image used for forecasting |
| 9. Le cycle de l’eau | 92, 94, 98 (93, 95, 99) | Drying laundry; condensation on a cold glass; sea/cloud/rain/river cycle |

**[VERIFIED]** The 28 lesson records and 28 teaching-plan keys also reconcile one-to-one in current main. A programmatic comparison of the two TypeScript registries found no missing plan keys, orphan plan keys or lesson/plan page-range mismatches.

## Additional pages inspected

| Material | Printed pages | PDF pages | Visual/content check |
|---|---:|---:|---|
| Chapter 1 exercise | 10 | 11 | Muscle contraction, joint movement and cartilage questions |
| Chapter 3 exercise | 32 | 33 | Seed embryo/cotyledon, iodine test and water-variable questions |
| Chapter 5 review | 63 | 64 | Flower-part order, male/female flower, pollen, microscope focusing and pollination |
| Chapter 8 exercise | 84 | 85 | Cloud-cover scale and observation reference for cloud direction |
| Chapter 9 exercises | 96, 100–101 | 97, 101–102 | Evaporation, condensation, water-cycle order and solar heating |
| Chapter 1 enrichment | 18–19 | 19–20 | Camel knee callosities, toe spread and fat stored in the hump |
| Chapter 2 enrichment | 26–27 | 27–28 | Fennec ears/paw fur; galabeya, air circulation and colour claims |
| Chapter 3 enrichment | 43 | 44 | Comparison of pea, date-palm, wheat, sunflower, cotton and maize seeds |
| Shared Chapters 3–4 enrichment | 50–51 | 51–52 | Seed dormancy, ancient-grain account and Nile soil/silt |
| Chapter 8 enrichment | 90–91 | 91–92 | Egyptian cloud cover, satellite observations and khamsin |
| Chapter 9 enrichment | 102–103 | 103–104 | Nile evaporation/condensation, transboundary water journey and Aswan High Dam |
| Scientific-method appendix | 104–107 | 105–108 | Fair-test variables; microscope parts and safe focusing; recording observations; six-step scientific method |

The separate Chapter 5 review on printed p. 63 is not counted as an extra numbered lesson. The six enrichment sections and four appendix skills remain supplementary teaching material, not additional numbered lessons.

## Source-heading reconciliation

- **[VERIFIED]** The contents page uses `La croissance et la reproduction humaines` for Chapter 6. Individual lesson-opening banners on pp. 64, 66 and 68 use variant chapter-line wording. Keep the exact contents-page heading at chapter level; retain each page's lesson title separately.
- **[VERIFIED]** Chapter 8's contents-page heading is `Les changements météorologiques`. Lesson 8-3 is titled `Prévisions météorologiques`; its banner also uses a shortened chapter-line label. Do not replace the contents-page chapter heading with the lesson title.
- **[VERIFIED]** Chapter 3 and Chapter 4 banners likewise add `de la` where the contents page omits it. The registry's chapter label should remain TOC-faithful.

## Teaching-pack provenance and limitations

- **[VERIFIED]** The 28 lesson plans are explicitly app-authored Miss Noor material derived from the student book. They are not Ministry teacher-guide content.
- **[BLOCKED]** No authenticated Egyptian Ministry 2026–2027 Grade 5 French Science teacher guide has been located. A third-party preparation notebook is not substituted.
- **[UNPROVEN]** The independent scientific accuracy of all textbook enrichment claims (including simplified seasonal/weather explanations) has not been reviewed by a qualified Science teacher or subject reviewer. When teaching those sections, attribute the explanation to the textbook rather than presenting this audit as independent validation.
- **[UNPROVEN]** The high-resolution review of every internal diagram/caption and the visual comparison against the canonical Ministry PDF remain outstanding.
- **[UNPROVEN]** A physical-phone walkthrough of a French Science lesson, including exercise feedback, remediation and progress persistence, remains outstanding.
- **[BLOCKED]** The exact 2026–2027 Term 2 French Science StudentBook and authenticated assessment-book source remain unavailable/unverified.

## Next concrete actions

1. Complete a high-resolution, page-by-page diagram/caption audit of printed pp. 6–107, ideally against rendered pages from the canonical Ministry PDF rather than relying on the Library copy.
2. Obtain an independent Grade 5 Science teacher review of the 28 French teaching plans, source-derived activities, answer keys and enrichment summaries.
3. Run a physical-phone French Science learner walkthrough and retain screenshots/video plus the exact deployed commit evidence.
4. Recheck the Ministry catalogue when the exact 2026–2027 Term 2 book is published; do not infer or substitute Term 2.

**Scope statement:** This audit strengthens the evidence for the nine-chapter Grade 5 French Science **Term 1** reconstruction only. It does not certify the full textbook, Term 2 or the full academic year.
