# Grade 5 Sciences en français — Term 1 Miss Noor teaching pack

**Edition:** Egypt Ministry of Education, Primary 5, 2026–2027, Term 1  
**Source:** 109-page French Science student-book copy  
**Scope:** The nine chapters in the supplied Term 1 table of contents only  
**Teaching-pack status:** [VERIFIED] 28 lesson plans are now represented in the app data; automated validation and deployment verification remain pending until CI completes.

## Provenance and evidence boundary

- The inspected student-book copy carries the Ministry of Education / Central Administration of Curriculum Development imprint and 2026–2027 edition information on printed page 3.
- The final imprint page records ISBN **978-633-8530-17-4** and 112 as the printed book code; the PDF copy inspected in the Library contains 109 PDF pages, including front/back matter.
- The canonical Ministry-hosted student-book endpoint is recorded in the source manifest:  
  https://elearnningcontent.blob.core.windows.net/elearnningcontent/2026_2027/Primary/Primary5/Term1/StudentBook/Science_FR_prim5_TR1.pdf
- The 109-page copy was inspected page by page for its nine chapter headings, lesson activities, questions, enrichment sections and scientific-skills appendix. The browser fetch of the large Ministry endpoint was not available in this run; the edition identity is grounded in the inspected book imprint and the canonical endpoint already recorded in the source manifest.
- **[BLOCKED]** No matching Egyptian Ministry 2026–2027 French Science teacher guide was verified. Do not substitute a prior-year guide, an Arabic-only guide, a Moroccan guide, or another country's teacher guide.
- The lesson plans below are **app-authored Miss Noor teaching material derived from the student book**. They are not Ministry teacher-guide content and are not textbook quotations.
- The source book's own “Essaye”, “Entraîne-toi”, review and experiment questions remain distinct from the new app-authored practice and answer keys.

## Chapter and lesson coverage

Printed page numbers are the numbers visible on the book pages. The lesson-level ranges below are the exact ranges checked in the student-book copy.

| Chapter | Exact chapter heading | Chapter pages | Numbered lessons and printed page ranges |
|---:|---|---:|---|
| 1 | Les os et les muscles | 6–19 | 1-1 pp. 6–7; 1-2 pp. 8–11; 1-3 pp. 12–13; 1-4 pp. 14–18 |
| 2 | Les changements des saisons | 20–27 | 2-1 pp. 20–21; 2-2 pp. 22–25 |
| 3 | Les conditions de germination | 28–43 | 3-1 pp. 28–29; 3-2 pp. 30–33; 3-3 pp. 34–35; 3-4 pp. 36–39; 3-5 pp. 40–43 |
| 4 | Les conditions de croissance | 44–51 | 4-1 pp. 44–45; 4-2 pp. 46–49 |
| 5 | De la fleur au fruit | 52–63 | 5-1 pp. 52–54; 5-2 pp. 55–59; 5-3 pp. 60–63 |
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
4. **[NOT YET VERIFIED] Runtime:** the new teaching-plan fields and French modal changes require CI, build and a phone-sized lesson walkthrough before deployment can be claimed.
5. **[VERIFIED] Scope:** this work is Grade 5 Science only; no unrelated subject was changed.

## Evidence labels

- **[VERIFIED]** The inspected student-book copy's Ministry imprint and 2026–2027 edition; 109 PDF pages; nine chapter headings; 28 numbered lesson page ranges; six enrichment sections; and four scientific-method appendix skills.
- **[VERIFIED]** The app-authored teaching-plan data structure now contains a complete French explanation, worked example, guided practice, independent practice, answer key, misconception diagnosis, remediation and mastery checks for each of the 28 Term 1 lessons.
- **[BLOCKED]** Matching Ministry teacher guide and Term 2 Science student book.
- **[UNPROVEN]** Production deployment and live learner walkthrough until CI and runtime evidence are available.
