# Grade 5 curriculum reconciliation — Miss Noor

**Audit date:** 12 November 2026  
**Repository:** [madnessgate44-debug/Amina](https://github.com/madnessgate44-debug/Amina)  
**Product:** Miss Noor  
**Scope:** Grade 5 only; first-term content currently represented in the repository.  
**Status:** Initial evidence-based audit. This is not a school-certified completeness declaration.

## Executive finding

**[VERIFIED] The repository does not currently demonstrate complete Grade 5 curriculum coverage.** The registry contains 51 lesson records across 11 curriculum source files and 54 concepts are referenced by the feed/teaching work. The code itself says it is not a claim that every physical textbook page has been digitized.

**[VERIFIED] The largest confirmed learning-content defect is French-track assessment coverage.** The latest status ledger records 30 of 53 concepts as narration-only for a French-reading child because French answer choices are absent. The French exercise filter prevents unreadable Arabic choices from being shown, but that also means the child gets fewer interactive practice opportunities. The ledger states that only 26 concepts are currently question-eligible in the French path.

**[VERIFIED] The repository’s source registry labels the Maths and Science national curriculum content as French-instructed, but the underlying Ministry maths/science exercise records include Arabic questions and options.** This creates a mismatch between the declared assessment language and the stored exercise language. The feed’s language guard correctly hides choices a French child cannot read; it does not translate or replace them.

**[UNVERIFIED] Exact match to École Girard’s Grade 5 class sequence.** Public information confirms Girard has a national section and a French international section, but does not publish a Grade 5 book list or weekly lesson sequence. The repository’s own comment calls this a Grade 5 registry for Girard, but the lesson records mostly cite Egyptian Ministry textbooks. Treat that as a working mapping, not school confirmation.

## Evidence and scope rules

1. Grade 5 / primary fifth year only. Do not silently substitute French CM2.
2. The Egyptian Ministry 2026–2027 Grade 5 textbook catalogue is used as the initial national reference set: [catalogue](https://miskeg.app/books/general-primary-5/).
3. The catalogue is a Ministry-book inventory, not evidence that Girard assigns every listed book to this student.
4. Girard’s public site describes a trilingual school and a French international section; it does not expose the primary Grade 5 book list: [École Girard](https://ecole-girard.com/).
5. Each app lesson below is confirmed as a repository record. Its textbook match is **not** considered verified solely because the source file gives a title/page reference. The original book page/TOC still needs line-by-line checking against the actual PDF.

## App inventory by book/subject

| Subject / source file | App lesson records | Findings |
|---|---:|---|
| Mathematics — Ministry French-bilingual track | 12 | 12 records; exercise strings include Arabic; assessment-language metadata says French. Several topics also have a separate French-section extract. |
| Mathematics — French extract | 4 | Four records; includes equivalent fractions and powers of ten. Not proven to be the complete Grade 5 book. |
| Science — Ministry French-bilingual track | 3 | Three records; all sampled exercise prompts/options are Arabic despite French assessment metadata. |
| Science — French extract | 3 | Three records; French question material exists. Not proven to be the complete Grade 5 book. |
| French language | 4 | One record explicitly says “Pending Upload” and has zero exercises. |
| English | 2 | Only two records (English Connect 5); insufficient evidence for whole-book coverage. |
| Arabic language | 5 | Five records; no evidence these cover all units/lessons in the Arabic Ministry book. |
| Social Studies | 3 | Three records; no evidence these cover all units/lessons in the book. |
| ICT | 12 | Twelve records across two units; no full-book reconciliation yet. |
| Islamic Education | 2 | Two records. The public book inventory allows Islamic or Christian education; only Islamic content is registered here. Confirm the student’s assigned track before treating this as a gap. |
| Arabic Calligraphy | 1 | One record; confirm whether this is an assigned Girard Grade 5 book/subject. |
| Library & Research Skills | 0 | Listed in the Ministry catalogue; no corresponding curriculum source in the registry. |
| Family Management & Entrepreneurship | 0 | Listed in the Ministry catalogue; no corresponding curriculum source in the registry. |
| Agriculture & Entrepreneurship | 0 | Listed in the Ministry catalogue; no corresponding curriculum source in the registry. |

**Interpretation:** 51 records is a count of lesson entries in the app, not a 51/51 coverage score. The three catalogue subjects with zero records are apparent omissions against the generic Ministry inventory, but Girard assignment remains unverified. Religious education is track-dependent. Art, music, PE and any school-specific subjects also need the actual Girard timetable/book list before classification.

## Lesson-by-lesson repository inventory

The page references below are taken from the app’s own source metadata. They are navigation clues for checking the source books, not independent proof that the lesson title or page range is exact.

| Subject / track | Unit | Lesson in app | Start page | MCQ records | Current finding |
|---|---|---|---:|---:|---|
| Mathematics — Ministry Grade 5 book / French-bilingual track | Unit 1: Decimals Place Value & Operations | Decimals up to Thousandths (Les nombres décimaux jusqu’aux millièmes) | p. 3 | 3 | Arabic exercise text present; French usability incomplete |
| Mathematics — Ministry Grade 5 book / French-bilingual track | Unit 1: Decimals Place Value & Operations | Changing Place Value (Changement de la valeur de position) | p. 7 | 2 | Arabic exercise text present; French usability incomplete |
| Mathematics — Ministry Grade 5 book / French-bilingual track | Unit 1: Decimals Place Value & Operations | Composing & Decomposing Decimals (Composer et décomposer) | p. 11 | 1 | Arabic exercise text present; French usability incomplete |
| Mathematics — Ministry Grade 5 book / French-bilingual track | Unit 1: Decimals Place Value & Operations | Comparing Decimals (Comparer des nombres décimaux) | p. 15 | 2 | Arabic exercise text present; French usability incomplete |
| Mathematics — Ministry Grade 5 book / French-bilingual track | Unit 1: Decimals Place Value & Operations | Rounding Decimals (Arrondir les décimaux) | p. 17 | 2 | Arabic exercise text present; French usability incomplete |
| Mathematics — Ministry Grade 5 book / French-bilingual track | Unit 2: Relations Between Numbers | Expressions, Equations & Variables | p. 44 | 2 | Arabic exercise text present; French usability incomplete |
| Mathematics — Ministry Grade 5 book / French-bilingual track | Unit 2: Relations Between Numbers | Prime Factorization & Factor Trees (Facteurs premiers) | p. 51 | 2 | Arabic exercise text present; French usability incomplete |
| Mathematics — Ministry Grade 5 book / French-bilingual track | Unit 2: Relations Between Numbers | Greatest Common Factor (P.G.C.D / GCF) | p. 54 | 1 | Arabic exercise text present; French usability incomplete |
| Mathematics — Ministry Grade 5 book / French-bilingual track | Unit 2: Relations Between Numbers | Least Common Multiple (P.P.C.M / LCM) | p. 59 | 1 | Arabic exercise text present; French usability incomplete |
| Mathematics — Ministry Grade 5 book / French-bilingual track | Unit 3: Multiplication with Whole Numbers | Area Model for Multiplication (Modèle de l’aire du rectangle) | p. 65 | 1 | Arabic exercise text present; French usability incomplete |
| Mathematics — Ministry Grade 5 book / French-bilingual track | Unit 3: Multiplication with Whole Numbers | Standard Multiplication Algorithm (L’algorithme standard) | p. 72 | 1 | Arabic exercise text present; French usability incomplete |
| Mathematics — Ministry Grade 5 book / French-bilingual track | Unit 6: Numerical Expressions & Patterns | Order of Operations (L’ordre des opérations mathématiques) | p. 121 | 2 | Arabic exercise text present; French usability incomplete |
| Science — Ministry Grade 5 book / French-bilingual track | Unit 1: Energy & Relationships in Living Systems | Plant Needs & Photosynthesis Process | p. 10 | 2 | Arabic exercise text present; French usability incomplete |
| Science — Ministry Grade 5 book / French-bilingual track | Unit 1: Energy & Relationships in Living Systems | Energy Flow in Ecosystems & Food Webs | p. 20 | 2 | Arabic exercise text present; French usability incomplete |
| Science — Ministry Grade 5 book / French-bilingual track | Unit 1: Energy & Relationships in Living Systems | Environmental Changes & Coral Bleaching | p. 34 | 2 | Arabic exercise text present; French usability incomplete |
| Mathematics — French-track extract | Unit 1: Decimals Place Value & Calculation | Decimals up to Thousandths (French Section) | p. 3 | 1 | App record present; textbook alignment not yet verified |
| Mathematics — French-track extract | Unit 1: Decimals Place Value & Calculation | Comparing & Ordering Decimals | p. 9 | 1 | App record present; textbook alignment not yet verified |
| Mathematics — French-track extract | Unit 2: Fractions & Arithmetic Operations | Equivalent Fractions & Simplification | p. 25 | 1 | App record present; textbook alignment not yet verified |
| Mathematics — French-track extract | Unit 3: Multiplication & Division of Decimals | Multiplying Decimals by Powers of 10 | p. 45 | 2 | App record present; textbook alignment not yet verified |
| Science — French-track extract | Unit 1: Energy Relationships in Ecosystems | Plant Needs & Photosynthesis (French Section) | p. 8 | 1 | App record present; textbook alignment not yet verified |
| Science — French-track extract | Unit 1: Energy Relationships in Ecosystems | Food Chains & Food Webs | p. 16 | 1 | App record present; textbook alignment not yet verified |
| Science — French-track extract | Unit 2: Matter & Particles in Our World | States of Matter & Particle Movement | p. 35 | 2 | App record present; textbook alignment not yet verified |
| French language | Unit 1: Welcome & Introductions | Greetings & Introducing Oneself | p. 4 | 1 | App record present; textbook alignment not yet verified |
| French language | Unit 1: Welcome & Introductions | My Family Members | p. 10 | 1 | App record present; textbook alignment not yet verified |
| French language | Unit 2: In My Classroom & School | Classroom Objects & School Supplies | p. 16 | 1 | App record present; textbook alignment not yet verified |
| French language | Unit 3: My Activities & Schedule | School Timetable & Favorite Subjects | p. 26 | 0 | Missing source upload |
| English | Unit 1: We Plant Our Food | The Generous Apple Tree | p. 14 | 2 | App record present; textbook alignment not yet verified |
| English | Unit 4: Looking After Our World | Elephantine Island in Aswan | p. 60 | 1 | App record present; textbook alignment not yet verified |
| ICT | Unit 1: The Role of ICT in Our Lives | Computer Accessories & Measurement Units | p. 7 | 3 | App record present; textbook alignment not yet verified |
| ICT | Unit 1: The Role of ICT in Our Lives | Networks and Their Types | p. 10 | 2 | App record present; textbook alignment not yet verified |
| ICT | Unit 1: The Role of ICT in Our Lives | Smart Communication Systems & IoT | p. 13 | 2 | App record present; textbook alignment not yet verified |
| ICT | Unit 1: The Role of ICT in Our Lives | Internet Troubleshooting Steps | p. 16 | 2 | App record present; textbook alignment not yet verified |
| ICT | Unit 1: The Role of ICT in Our Lives | Digital Files & Management | p. 19 | 2 | App record present; textbook alignment not yet verified |
| ICT | Unit 1: The Role of ICT in Our Lives | Information Sharing & MS Excel Formulas | p. 23 | 2 | App record present; textbook alignment not yet verified |
| ICT | Unit 2: Digital Security & Safety Precautions | Data Protection & Backup Methods | p. 27 | 2 | App record present; textbook alignment not yet verified |
| ICT | Unit 2: Digital Security & Safety Precautions | Password Management & MFA | p. 30 | 2 | App record present; textbook alignment not yet verified |
| ICT | Unit 2: Digital Security & Safety Precautions | Dealing with Fraudulent Websites & Scareware | p. 33 | 2 | App record present; textbook alignment not yet verified |
| ICT | Unit 2: Digital Security & Safety Precautions | Copyright & Intellectual Property | p. 36 | 2 | App record present; textbook alignment not yet verified |
| ICT | Unit 2: Digital Security & Safety Precautions | Preventive Security & Digital Source Evaluation | p. 39 | 2 | App record present; textbook alignment not yet verified |
| ICT | Unit 2: Digital Security & Safety Precautions | Documenting Information & Citations | p. 42 | 2 | App record present; textbook alignment not yet verified |
| Arabic language | Unit 1: Discovering Identity & Heritage | Listening Story: "I Can" | p. 6 | 2 | App record present; textbook alignment not yet verified |
| Arabic language | Unit 1: Discovering Identity & Heritage | Reading Text: "I Have Not Polluted the River Water" | p. 12 | 2 | App record present; textbook alignment not yet verified |
| Arabic language | Unit 1: Discovering Identity & Heritage | Arabic Grammar: The Nominal Sentence (Subject & Predicate) | p. 24 | 2 | App record present; textbook alignment not yet verified |
| Arabic language | Unit 2: Relationships with Others | Informational Text: "True Beauty" | p. 34 | 1 | App record present; textbook alignment not yet verified |
| Arabic language | Unit 3: Habits & Inspirations | Listening Text: "Interview with Dr. Magdi Yacoub" | p. 52 | 1 | App record present; textbook alignment not yet verified |
| Social Studies | Unit 1: Natural Features of Egypt | Geographic and Astronomical Location of Egypt | p. 10 | 2 | App record present; textbook alignment not yet verified |
| Social Studies | Unit 1: Natural Features of Egypt | Landforms & Relief Regions of Egypt | p. 18 | 2 | App record present; textbook alignment not yet verified |
| Social Studies | Unit 2: Resources & Development in Egypt | Water Resources & Modern Conservation in Egypt | p. 48 | 2 | App record present; textbook alignment not yet verified |
| Islamic Education | Theme 1: Discovering Identity — Aqeedah | Surah Al-Hashr & The Beautiful Names of Allah | p. 8 | 1 | App record present; textbook alignment not yet verified |
| Islamic Education | Theme 1: Worship — Prayer & Purification | Virtues, Sunnahs & Etiquette of Prayer | p. 22 | 1 | App record present; textbook alignment not yet verified |
| Arabic Calligraphy | Unit 1: Naskh & Ruqaa Calligraphy Aesthetics | Letter Alif in Naskh & Ruqaa Scripts | p. 4 | 2 | App record present; textbook alignment not yet verified |

## Confirmed defects and omissions

### P0 — French-track maths/science practice is incomplete
- The pre-change status ledger reported 30/53 concepts as narration-only for a French-reading child. That figure has **not** yet been recomputed after the 12 November assessment-language patch.
- Before the patch, the 12 Ministry Maths and 3 Ministry Science lesson records had Arabic assessment prompts/options despite French instruction/assessment metadata.
- **Implementation update (12 November 2026):** a French assessment layer now supplies 26 French multiple-choice items across all 15 Ministry Maths/Science lesson records (20 Maths, 6 Science). The registry applies these items to the French-bilingual track. The separate 4-lesson French Maths extract and 3-lesson French Science extract already had French-language exercise text and were left unchanged.
- A repository test now checks that all 15 Ministry lesson records have a French assessment set, that registered questions/options/answers contain no Arabic-script text, and that the registry uses the complete mapped set.
- **Not yet proven complete:** these are lesson-level assessment items, not evidence that every individual concept has sufficient practice. The previous 30/53 metric must be recalculated from the runtime feed after the patch; concept-level question coverage, distractor quality, explanations and misconception feedback still need a dedicated audit. Full textbook PDF verification also remains outstanding.
- Remediation: expand and independently verify French prompts, distractors, answer keys, explanations and misconception feedback for every assigned French-taught maths/science concept. Do not machine-translate without checking mathematical meaning and curriculum vocabulary.

### P1 — Book coverage is demonstrably partial
- French language: the timetable lesson record says “Pending Upload”; it has no MCQ exercise.
- English: two lesson records only.
- Arabic: five lesson records only.
- Social Studies: three lesson records only.
- Islamic Education: two lesson records only.
- Calligraphy: one lesson record only.
- The generic Ministry inventory includes Library & Research Skills, Family Management & Entrepreneurship, and Agriculture & Entrepreneurship, none of which has a corresponding registered lesson source in the current registry.

### P1 — The source-of-truth claim is too strong
- `officialCurriculum.ts` describes the registry as “authoritative lesson material currently present” but explicitly warns it does not mean every physical textbook page has been digitized.
- The same registry labels 11 subjects while the public Ministry inventory contains additional subject books. The report must not call this “complete Grade 5 curriculum”.
- The maths/science records have French instruction/assessment metadata, but Arabic questions remain in their source records. Metadata alone does not make an assessment French-accessible.

### P2 — Duplicate/overlapping tracks need explicit reconciliation
- Ministry Maths and Science records coexist with separate French-track extracts. Some topics overlap (e.g. decimal place value, plant needs/photosynthesis).
- Keep both only where they represent distinct textbook treatments, lesson sequences, or language-specific pedagogy. Otherwise use a canonical topic mapping with separate language renderings, not duplicate coverage counts.
- A concept count must not inflate completeness when the same underlying objective appears twice.

## What is needed to close the audit

1. Obtain Girard’s actual Grade 5 2026–2027 book list or timetable, preferably from the school.
2. Obtain the complete first- and second-term PDFs for every assigned book. The Ministry catalogue is only a baseline.
3. Extract each book’s table of contents and all lesson headings/page ranges.
4. Map each source lesson to one app lesson ID and one or more learning objectives/concepts.
5. Mark every source lesson: **complete**, **partial**, **missing**, **wrong language**, **extra/not assigned**, or **unverified**.
6. Verify practice separately: readable prompt, readable choices, correct answer, explanation, misconception handling, and sufficient independent practice.
7. Publish coverage percentages only after the denominator is the complete confirmed school book inventory.

## Immediate implementation backlog

| Priority | Work item | Acceptance criterion |
|---|---|---|
| P0 | French Maths concept-level practice completion | The 12 November lesson-level French assessment layer is in place; every assigned French Maths concept still needs verified French practice, answer keys and feedback. |
| P0 | French Science concept-level practice completion | The 12 November lesson-level French assessment layer is in place; every assigned French Science concept still needs verified French practice, answer keys and feedback. |
| P1 | Complete French language source | Pending book upload replaced with a source-verified lesson sequence and exercises. |
| P1 | Complete English, Arabic, Social Studies and ICT inventories | Every TOC lesson mapped to an app record or explicitly marked not assigned. |
| P1 | Add missing catalogue subjects only if Girard confirms they are assigned | Library/Research, Family Management/Entrepreneurship, Agriculture/Entrepreneurship mapped lesson by lesson. |
| P1 | Confirm religious education track | Islamic or Christian book and lesson sequence matched to the student’s actual class. |
| P2 | Reconcile duplicated French/National Maths and Science extracts | One canonical objective map; no double-counting; language-specific material preserved. |

## Repository evidence inspected

- `src/data/officialCurriculum.ts` — registry, declared subjects and track/language metadata.
- `src/data/curriculum/mathCurriculum.ts`
- `src/data/curriculum/scienceCurriculum.ts`
- `src/data/curriculum/mathFrCurriculum.ts`
- `src/data/curriculum/scienceFrCurriculum.ts`
- `src/data/curriculum/frenchCurriculum.ts`
- `src/data/curriculum/englishCurriculum.ts`
- `src/data/curriculum/arabicCurriculum.ts`
- `src/data/curriculum/socialStudiesCurriculum.ts`
- `src/data/curriculum/ictCurriculum.ts`
- `src/data/curriculum/islamicCurriculum.ts`
- `src/data/curriculum/calligraphyCurriculum.ts`
- `docs/STATUS.md` — latest French feed and exercise-language findings.
- Commit `766843bdd946362460b406f3b5500cb9b859c3a2` — registration of previously orphaned Ministry Maths/Science sources; records lesson count growth from 36 to 51 and concept count from 35 to 54.


### Data-integrity note — concept denominator mismatch
The current `docs/STATUS.md` reports 30/53 concepts as narration-only and 26/53 as question-eligible for the French path. The curriculum registration/media commits describe 54 concepts in the repository. These denominators are not reconciled in the available ledger. Therefore, 30/53 is reported as the status-ledger measurement, not recomputed as a percentage of all 54 registry concepts. A follow-up diagnostic must export the exact concept IDs included in each denominator and identify the excluded or added concept before publishing a final percentage.


## Implementation update — 12 November 2026

The first language defect has been addressed in the repository:
- Added `src/data/curriculum/frenchAssessment.ts` with French replacements for all 25 existing multiple-choice assessment items in the 12 Ministry Maths and 3 Ministry Science Grade 5 lesson records.
- Updated `src/data/officialCurriculum.ts` so the French-bilingual registry uses those French items instead of the Arabic source-language prompts/options.
- Extended `src/services/__tests__/curriculumRegistry.test.ts` with checks for complete lesson-level mapping, absence of Arabic-script assessment text, and exact item-count parity.
- Static repository check: all 15 source lesson IDs have a matching assessment map; no source IDs are missing or extra; no Arabic-script text was found in the new assessment map.
- **Verification limitation:** GitHub Actions returned no PR-triggered workflow runs for these direct-main commits, and no local test/build execution was available in this session. Typecheck, test suite, live feed behaviour and the post-change narration-only denominator remain unverified. The patch must not be described as fully closing the concept-level P0 gap.

## Audit conclusion

**[VERIFIED] Miss Noor has a substantial Grade 5 first-term content base, but it is not a complete or fully reconciled Grade 5 curriculum.** The largest confirmed gap is French-language interactive assessment, followed by incomplete subject-book inventories and missing catalogue subjects. The exact Girard assignment list and the actual source-book TOCs remain **UNVERIFIED**. Do not advertise or label curriculum coverage as complete until the school book list and all assigned books have been reconciled lesson by lesson.


## Follow-up audit — full French-track scope confirmed (12 November 2026)

The owner confirmed that the completion target is exactly three Grade 5 subjects: **French language, Mathematics taught in French, and Science taught in French**. The target is the full 2026–2027 school year, including both terms, not only the current Term 1 seed.

### Newly verified content-integrity defect

Inspection of the actual source files shows that the previous assessment patch did **not** make all French-track teaching content French:

- `src/data/officialCurriculum.ts` maps the Ministry Maths and Science source records to French instruction/content/assessment metadata.
- `mathCurriculum.ts` contains French explanations but mixed Arabic/French exercise and support fields.
- `scienceCurriculum.ts` contains Arabic objectives, reading text, vocabulary definitions, exercises, and concept support fields.
- `frenchAssessment.ts` replaces only the exercise arrays for mapped lesson IDs. It does not translate reading text, objectives, vocabulary, concept key points, examples, prerequisites, or misconceptions.
- The French Maths/Science extracts are also registered under the same subject IDs, creating overlap that must be resolved by canonical source lesson and objective identity.

**Finding: [FAILED] The registry's French content metadata is not currently a reliable guarantee that the learner receives a fully French teaching experience.** The assessment patch is a limited remediation, not a completed French-language content layer.

### French subject source ambiguity

The 2026–2027 Ministry first-term Grade 5 book catalogue lists 15 books, including Maths and Science in French, but does not list a standalone French student textbook. Separate official Ministry Grade 5 French first- and second-foreign-language weekly assessment files are discoverable. The exact French coursebook, language track (first or second foreign language), and annual lesson sequence assigned by Girard remain **UNVERIFIED**.

Do not substitute a Moroccan Grade 5 French syllabus, French CM2, or another school's coursebook.

### Source acquisition status

- [VERIFIED] Direct Ministry server endpoints identified for Grade 5 2026–2027 Term 1 Maths in French and Science in French.
- [BLOCKED] The available web retrieval path rejected the Maths PDF because it is approximately 17.2 MB and could not retrieve the Science PDF. The original pages and full TOCs have therefore not been inspected.
- [UNVERIFIED] 2026–2027 Term 2 student books and official teacher guides for the French versions of Maths and Science.
- [UNVERIFIED] Girard's exact French subject book and whether it is French first foreign language or second foreign language.

### Controlling implementation plan

A new owner-scope and acceptance document is now tracked at:
`docs/curriculum/grade-5-french-track-completion-plan.md`

It defines source acquisition, canonical lesson reconciliation, complete French teacher-ready lesson requirements, app integration, and verification gates. It explicitly prevents the project from claiming completion or publishing percentages without a confirmed source-book denominator.

### Corrected assessment count

The 12 November French assessment layer contains **26 items** (20 Maths and 6 Science) across 15 Ministry-source lesson records. This corrects the earlier sentence in this report that said 25. The 26 items remain unverified against the complete original PDFs and do not constitute complete lesson or book coverage.

**Current status remains: all three subjects NOT COMPLETE.**


## Teaching-engine remediation — 12 November 2026

A further French-language teaching defect was corrected in the application code:

- Added `keyPointsFr` to the curriculum concept type.
- Added structured French key points for all 12 current Ministry Maths concepts and all 3 current Ministry Science concepts.
- Updated `CurriculumService` to merge French key-point overlays into canonical concepts.
- Updated the teaching session engine to select French concept titles, French source summaries, and French key points when the learner language is French. When a French key-point array is absent, it uses the French source summary rather than Arabic key points.
- Extended the curriculum registry test to require a French title/source overlay for every concept in the three French-track subjects, require French key points for all 15 current Ministry Maths/Science concepts, and exercise a French Science teaching turn with an Arabic-script guard.

**Verification status:** [VERIFIED] The changed files and test assertions are committed on `main`. [UNPROVEN] The TypeScript check and test suite have not been executed in this session; the GitHub workflow-run lookup for the latest direct-main commit returned no runs. This patch improves the current 15 lesson concepts but does not add missing book units, Term 2, or complete the French-language coursebook reconciliation.

The earlier 26-question assessment layer remains a limited practice layer, not a full assessment programme. All three subjects remain **NOT COMPLETE**.

## Critical source-book TOC reconciliation — 12 November 2026

The actual 2026–2027 Ministry-hosted Term 1 PDFs were successfully text-extracted through a document extraction route after the normal browser path could not read the large PDFs. The new source manifest is docs/curriculum/grade-5-2026-2027-french-maths-science-term1-source-manifest.md.

### [VERIFIED] Maths source denominator

The Ministry Maths-in-French TOC lists **46 lessons across six units**. The current repository has 12 Ministry-source Maths lesson records plus four separate French-extract records. The 12 records are a partial subset; the four extract records still require edition/page reconciliation. The app is missing most of Unit 1, Units 4–5, and additional lessons from Units 2, 3 and 6. The current Unit 6 label “Order of Operations” also needs reconciliation against the TOC title “Expressions numériques” at page 121.

### [FAILED] Science source alignment

The Ministry Science-in-French TOC lists nine chapters:
1. Les os et les muscles (p. 6)
2. Les changements des saisons (p. 20)
3. Les conditions de germination (p. 28)
4. Les conditions de croissance (p. 44)
5. De la fleur au fruit (p. 52)
6. La croissance et la reproduction humaines (p. 64)
7. La croissance et la reproduction des animaux (p. 72)
8. Les changements météorologiques (p. 80)
9. Le cycle de l’eau (p. 92)

None of the six current app Science lesson titles (three Ministry-source plus three French extracts) matches these nine chapter headings. The current app topics include photosynthesis, food webs, coral bleaching, and states of matter. Those topics are **not present as chapter titles in the extracted 2026–2027 French Science TOC** and must be treated as **[UNVERIFIED / POSSIBLY WRONG-EDITION CONTENT]** until the actual chapter pages prove otherwise. The current six Science records must not be counted as coverage of this edition.

### French-language subject and teacher guides

The current 2026–2027 first-term Ministry Grade 5 catalogue lists English as the first foreign language but no standalone French student book among the 15 listed titles. Separate weekly Ministry assessments exist for Grade 5 French first and second foreign language. Girard's assigned French book and track remain unverified. No matching 2026–2027 French-version Maths/Science teacher guide has yet been located; absence is not proven.

### Required safety decision

Before the next student-facing curriculum release, quarantine or replace the six unverified Science records so the app does not present them as if they cover the current Ministry book. Do not add chapter-level stubs as if they were complete lessons. First extract the sub-lesson structure and page content from all nine chapters, then author full teaching material.

**Current status:** Maths NOT COMPLETE (46 lesson TOC; app has 12 Ministry records plus 4 unverified extract records). Science NOT COMPLETE (9 verified chapter headings; all 6 current app records unaligned at chapter-title level). French language NOT COMPLETE (book/track unresolved).

## Science reconstruction update — 13 November 2026

This update supersedes the 12 November Science inventory finding above; it does not rewrite the historical baseline.

### [VERIFIED] Full Term 1 Science source inventory

The complete available Egyptian Ministry 2026–2027 Grade 5 French Science Term 1 PDF is now available in the Library source copy and has been inspected page by page. Text extraction exposes 109 PDF pages; the book's production metadata page lists 112 printed pages. The lesson map uses the printed lesson page numbers. The nine chapter headings and all 28 numbered lesson page spans are reconciled in [the verified lesson map](../curriculum/grade-5-science-fr-term1-verified-lesson-map.md). The application records the exact printed span in `sourceRef.pageRange` and retains the start page in `sourceRef.page`.

Chapter 1's final numbered lesson (1-4) is p. 14–17. The dromedary enrichment is a separate section on p. 18–19; it is not included in the lesson's page span.

### [VERIFIED] Current-edition lesson records

`src/data/curriculum/scienceFrCurriculum2026.ts` contains 28 current-edition French Science lesson records across the nine chapters. The three legacy Ministry Science records and three legacy French-extract records remain distinct from this dataset and are not counted toward 2026–2027 coverage. Legacy topics such as plant needs/photosynthesis, food webs, coral bleaching and states of matter are not counted as coverage of this edition without page-level evidence.

### [COMPLETED] Chapter 1 teaching reconstruction

A complete **app-authored** teacher guide has been added for Chapter 1's four lessons and the separate dromedary enrichment:

- `docs/curriculum/grade-5-science-fr-term1-teacher-guide-chapter-1.md`
- `src/data/curriculum/scienceFrTeacherGuide2026.ts`

The four lesson records now carry French explanations, demonstrations, guided and independent practice, answer explanations, source exercise answer keys, misconception triggers and remediation, and mastery checks. The teaching engine labels this prose as “Explication de Miss Noor, fondée sur le manuel”; it no longer presents this app-authored explanation as a verbatim textbook passage. The French teaching turn includes the demonstration and guided-practice scaffold.

[VERIFIED] The printed exercise items and answer choices on pp. 10–11 and 16–17 were inspected before the Chapter 1 source answer key was authored. The answers are recorded by page and item reference rather than copying the questions.

### [BLOCKED] Official teacher guide and remaining scope

No matching Egyptian Ministry 2026–2027 French Science teacher guide has been verified. The Chapter 1 guide is therefore an original Miss Noor adaptation, not official Ministry teacher-guide content.

Chapters 2–9 have verified source-page inventories but still require full teacher-ready expansions. The scientific-skills pages 104–107 also need integration across the chapters. Term 2 remains blocked until its 2026–2027 student book is sourced and inspected. No full-book or full-year completion claim is made.

### Verification boundary

- [VERIFIED] Source-page inspection, lesson-page mapping and Chapter 1 answer-key extraction.
- [VERIFIED] PR #170 CI run [#467](https://github.com/madnessgate44-debug/Amina/actions/runs/43387120714) on head `15190c96d4f271afe1fd1e170988abe9a82a08b2` completed successfully on 13 November 2026. The blocking `npm run lint` / Type check step passed; `npm test` passed, including the Curriculum Registry suite at 25 passed / 0 failed; `npm run build` completed successfully (Vite reported non-blocking `__dirname` configuration and >500 kB chunk warnings).
- [VERIFIED] Engineering Execution OS compliance run [#589](https://github.com/madnessgate44-debug/Amina/actions/runs/43387120696) completed successfully; output: `ENGINEERING EXECUTION OS COMPLIANCE: PASS`.
- [NOT RUN] Live browser lesson walkthrough. No production deployment was triggered or verified; this PR is not merged.
- [NOT MERGED] PR #170 remains a draft for owner review. The documentation-only status correction after the tested code head will trigger a fresh CI/compliance run.
