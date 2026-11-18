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


## Addendum — 13 November 2026: Grade 5 French Science Term 1 reconstruction

**Baseline inspected:** main at ed9aa246e6156748352a513db76902dc766a252b  
**Scope:** Grade 5 Science only; Egyptian Ministry 2026–2027 French Term 1 student book.

### Source reconciliation

- **[VERIFIED]** The inspected Library PDF is 110 pages: 109 book-content pages plus a third-party promotional insert at PDF page 110. The Ministry / Central Administration of Curriculum Development imprint and 2026–2027 edition statement appear on PDF page 3; the final book imprint on PDF page 109 records ISBN 978-633-8530-17-4. The copy is third-party assembled; byte-level identity with the canonical Ministry endpoint is [UNPROVEN].
- **[VERIFIED]** All nine requested chapter headings and their printed starting pages match the book: pp. 6, 20, 28, 44, 52, 64, 72, 80 and 92.
- **[VERIFIED]** Page-level inspection identifies 28 numbered lessons across those chapters, with exact printed page ranges recorded in docs/curriculum/grade-5-science-fr-term1-verified-lesson-map.md.
- **[VERIFIED]** The six enrichment features and the scientific-method appendix on pp. 104–107 are retained in the teaching data.
- **[BLOCKED]** No matching 2026–2027 Egyptian Ministry French Science teacher guide was verified. The app-authored Miss Noor guide is not labelled or represented as an official Ministry guide.
- **[BLOCKED]** Term 2 Science remains unsourced. No full-year completion claim is made.
- **[UNPROVEN]** The separate assessment-book PDF has not yet been inspected question by question.

### App changes prepared on the reconstruction branch

- Added src/data/curriculum/scienceFrTeachingGuide2026.ts with app-authored French explanations, worked demonstrations, guided practice, independent practice, aligned answer keys, misconception diagnoses, remediation and mastery checks for all 28 lessons.
- Attached each guide to its current-edition lesson in src/data/curriculum/scienceFrCurriculum2026.ts; the lesson reading text now uses the full French explanation and demonstration.
- Added a structured teacher-guide type to src/types/teachingSession.ts.
- Updated src/components/curriculum/LessonStudyModal.tsx so French mode renders French lesson titles, explanations, concepts, vocabulary, exercise labels and feedback rather than falling back to English.
- Quarantined the three older national Science records as unavailable / pending_materials, matching the existing quarantine of the three older French-extract records. Their IDs remain registered for compatibility, but they are not current-edition coverage.
- Added registry checks for all 28 guide records, exact page ranges, French-only content, answer-key alignment, enrichment/appendix inventory and legacy-record quarantine.
- Added the teacher-pack document and updated the source manifest and verified lesson map.

### Verification status

- **[VERIFIED]** The source inventory and the app-authored data are present on the reconstruction branch.
- **[NOT YET VERIFIED]** npm run lint, npm test, npm run build, CI/compliance workflow logs and deployment status have not yet been verified for this branch.
- **[UNPROVEN]** The live phone-sized learner experience has not yet been walked through after these changes.

The next release gate is to run and inspect the complete CI pipeline, correct any failures without weakening existing tests, and then perform a French lesson walkthrough on the deployed app. Science remains Term 1 only until the 2026–2027 Term 2 source is obtained.


## Execution update — 13 November 2026

### Current-mainline delivery

- **[VERIFIED]** The previous PR #171 was based on `ed9aa246e6156748352a513db76902dc766a252b`, while current main had advanced to `fc929b46f9f4c0fd40ad27a8e70fd0ddc41a1e34`. The branches diverged; PR #171 was not mergeable.
- **[VERIFIED]** The curriculum work was ported onto a new branch based directly on current main, with no commits behind the baseline. PR #175 is the replacement review path.
- **[VERIFIED]** Three older national Science records and three older French-extract records remain registered only for ID compatibility and are now explicitly unavailable with `pending_materials` status.
- **[VERIFIED]** The French lesson modal now has a dedicated Practice tab that exposes guided practice, independent practice, answer-key reveal, misconception diagnosis, remediation and mastery checks from the app-authored guide.
- **[NOT YET VERIFIED]** Current-mainline PR CI, the updated regression suite, production build, and live phone walkthrough must complete before merge or deployment is claimed.

### Additional source findings

- **[UNVERIFIED] Assessment workbook:** a separate 2026–2027 Term 1 French Science assessment-book listing and two sample page previews were located. The previews show assessment activities for chapter 1. The full file could not be retrieved; two listings disagree on 68 versus 69 pages. No questions have been imported and no answer key is treated as official.
- **[BLOCKED] Term 2:** the checked Grade 5 2026–2027 catalogue still lists only Term 1. It states that Term 2 books are added when the Ministry publishes them. The exact 2026–2027 French Science Term 2 student book is therefore the missing source; prior-year books are not substitutes.
- **[BLOCKED] Ministry teacher guide:** no exact Egyptian Ministry 2026–2027 Grade 5 French Science teacher guide was found. Other curricula's teacher guides are not substitutes. The current guide remains Miss Noor-authored.
- **[VERIFIED] Deployment quota:** Vercel rejected preview builds with `api-deployments-free-per-day` after more than 100 deployments in one day. This is a platform quota, not a failed application build. The existing production deployment on main remains READY on `fc929b46f9f4c0fd40ad27a8e70fd0ddc41a1e34`. The no-cost release path is to avoid repeated preview churn, rely on GitHub CI, and allow one production deployment after merge when the daily quota resets.

### Updated completion boundary

**[VERIFIED]** The Term 1 source map and 28 app-authored lesson plans are represented in code, and the student lesson view now exposes the structured teaching sequence.  
**[UNPROVEN]** Actual learner usability and speech behavior on a phone until a real French-path walkthrough is completed.  
**[BLOCKED]** Term 2 source reconstruction, full assessment-book validation, and any matching Ministry French teacher guide.  
This remains a Term 1 reconstruction, not a full-year completion declaration.


## Science source and release verification update — 14 November 2026

### Source-copy provenance correction

- **[VERIFIED]** The Library PDF used for the Science reconstruction has 110 PDF pages. PDF pages 1–109 contain the book copy; page 110 is a third-party promotional insert and is excluded. The file is 59,040,102 bytes; SHA-256: `6fe1d9fdcf2108c76e73c6a148277629b2d71a9a95acec427f533190b163779c`.
- **[VERIFIED]** PDF page 3 (front matter, not printed textbook page 3) contains the Ministry/Central Administration 2026–2027 imprint. PDF page 109 contains ISBN 978-633-8530-17-4. PDF metadata identifies PDFsharp and third-party site keywords.
- **[UNPROVEN]** The copy is not a verified direct Ministry download and has not been byte-for-byte compared with the canonical Ministry-hosted URL. The visible Ministry imprint supports edition identification within the copy, not proof of untouched official distribution.

### Current mainline state

- **[VERIFIED]** The Science Term 1 reconstruction PR [#175](https://github.com/madnessgate44-debug/Amina/pull/175) is merged at `6a345c3f8543f6f4a42b8a5096d4dced587cd6b9`. Current `main` is `d094933379dddf7db6b37cfd419dae06caf3174d`.
- **[PASS]** CI run [43535411225](https://github.com/madnessgate44-debug/Amina/actions/runs/43535411225): `npm run lint`, `npm test` (39 suite summaries passed, 0 failed; curriculum registry 23 passed, 0 failed), and `npm run build` (Vite 8.3.5, 1,792 modules, 575 ms).
- **[PASS]** Engineering Execution OS compliance run [43535411162](https://github.com/madnessgate44-debug/Amina/actions/runs/43535411162).
- **[VERIFIED]** The Vercel status check on current main reports `success` / `Deployment has completed`. No phone-sized learner walkthrough was performed in this audit.

### Remaining Science boundary

- **[VERIFIED]** The nine Term 1 chapters and 28 lesson plans are present on main. The plans are app-authored Miss Noor material derived from the inspected student-book copy, not official Ministry teacher-guide content.
- **[BLOCKED]** No matching 2026–2027 Egyptian Ministry French Science teacher guide or Term 2 student book is verified. The separate assessment-book PDF remains unverified question by question.
- **[UNPROVEN]** Phone-sized French learner walkthrough and custom-domain lesson behavior. No full-year or full-book completion claim is made.


## Science Term 1 execution update — 15 November 2026

### Changes merged

- **[VERIFIED]** PR [#184](https://github.com/madnessgate44-debug/Amina/pull/184) merged into `main`; merge commit `b635bfa10657d59db65ef0dcd70eae670c5be9fb`.
- **[VERIFIED]** The exact nine French TOC chapter headings are now stored on every current-edition lesson record as `unitNameFr = Chapitre N : [exact heading]`.
- **[VERIFIED]** The 28 lesson records are structurally checked for objectives and French vocabulary; the 28 app-authored plans are checked for explanation, demonstration, guided practice, independent practice, answer key, misconception diagnosis, remediation and mastery criteria.
- **[VERIFIED]** The source-copy caveat is now stored in every lesson's `sourceRef.notes`, not only in documentation.
- **[VERIFIED]** Regression checks protect all six enrichment page ranges, the separate Chapter 5 review on p. 63, and the scientific-method appendix on pp. 104–107.

### Verification evidence

- **[PASS]** CI [43688746038](https://github.com/madnessgate44-debug/Amina/actions/runs/43688746038): `npm run lint` passed; `npm test` passed (39 suite summaries, 0 failures; curriculum registry 35 passed, 0 failed); `npm run build` passed (Vite 8.3.5, 1,792 modules, 491 ms).
- **[PASS]** Engineering Execution OS compliance [43688746047](https://github.com/madnessgate44-debug/Amina/actions/runs/43688746047).
- **[VERIFIED]** Vercel's status on merge commit `b635bfa10657d59db65ef0dcd70eae670c5be9fb` was initially pending and subsequently returned `success` (https://vercel.com/forge-fe22/amina/BkLHWqoU2cUxndGfs4eyosKef6Q1). This is a verified deployment status, not a phone-sized learner walkthrough or custom-domain verification.
- **[UNPROVEN]** Phone-sized learner walkthrough and custom-domain French lesson behavior.

### Scope and unresolved blockers

The 28 lesson plans remain **Miss Noor app-authored** material derived from the inspected student-book copy. The exact Ministry teacher guide remains [BLOCKED]; direct byte-level identity of the third-party-assembled PDF with the canonical Ministry endpoint remains [UNPROVEN]. Term 2 Science remains [BLOCKED] until the exact 2026–2027 source is published and accessible. The assessment-book PDF remains [UNPROVEN] pending retrieval and question-by-question review.

This is Term 1 only. No full-year or full-book completion claim is made.


## Canonical Science student-book endpoint retrieval — 15 November 2026

- **[VERIFIED]** Located the exact Ministry-hosted Grade 5 French Science Term 1 student-book URL through the French Science entry in the 2026–2027 Grade 5 book catalogue: https://elearnningcontent.blob.core.windows.net/elearnningcontent/2026_2027/Primary/Primary5/Term1/StudentBook/Science_FR_prim5_TR1.pdf . The discovery catalogue is third-party; the resolved PDF endpoint itself is on the Ministry e-learning content blob host.
- **[BLOCKED]** Retrieval failed with a content-size error (400: Content length is too large: 62976199); the independent direct-download attempt also failed. No Ministry PDF bytes were available for inspection or hashing.
- **[UNPROVEN]** The existing 59,040,102-byte third-party-assembled Library copy cannot yet be byte-compared with the 62,976,199-byte Ministry endpoint. Keep all lesson source-copy caveats in place.
- **[BLOCKED]** No exact 2026–2027 Grade 5 French Science Ministry teacher guide was established by this search. The app-authored teaching plans remain clearly distinct from an official guide.
- **Next action:** obtain the 62,976,199-byte canonical PDF through a capable browser/download path, compute SHA-256, inspect its page count and imprint, and compare it against the existing Library copy. Then resume page-by-page pedagogical validation.

This is still Grade 5 French Science Term 1 only; no full-book or full-year completion is claimed.


## Science Term 1 source audit and learner-resource release — 15 November 2026

### Merged changes since the previous release record

- **[VERIFIED]** PR [#186](https://github.com/madnessgate44-debug/Amina/pull/186) makes the app-authored French explanation and worked demonstration visible in the learner lesson modal, with source-page and provenance labels.
- **[VERIFIED]** PR [#187](https://github.com/madnessgate44-debug/Amina/pull/187) records the canonical Ministry student-book endpoint and the failed 62,976,199-byte retrieval attempt. The byte-identity comparison remains [UNPROVEN].
- **[VERIFIED]** PR [#188](https://github.com/madnessgate44-debug/Amina/pull/188) adds the weather-radar concept from printed page 89 to lesson 8-3.
- **[VERIFIED]** PR [#189](https://github.com/madnessgate44-debug/Amina/pull/189) completes source coverage in lessons 6-1 and 6-2 for the approximately nine-month development period, reproduction and continuity of life, inherited traits, and parental care/protection.
- **[VERIFIED]** PR [#190](https://github.com/madnessgate44-debug/Amina/pull/190) expands the six enrichment-page summaries and the scientific-method appendix summaries, including the textbook-attributed ancient-seed account, Nile sediment, Egyptian cloud patterns, khamsin, desert condensation, the African water route and plant observation records.
- **[VERIFIED]** PR [#191](https://github.com/madnessgate44-debug/Amina/pull/191) connects enrichment, review and method content to the learner lesson modal through a conditional **Ressources** tab. Resources show printed page labels and state that their summaries are Miss Noor-authored, not official Ministry teacher-guide text.
- **[VERIFIED]** PR [#192](https://github.com/madnessgate44-debug/Amina/pull/192) adds the page-69 instruction to wash fruit and vegetables before eating them to lesson 6-3.
- **[VERIFIED]** PR [#193](https://github.com/madnessgate44-debug/Amina/pull/193) adds five answer-reveal questions for the separate Chapter 5 review on page 63.
- **[VERIFIED]** PR [#194](https://github.com/madnessgate44-debug/Amina/pull/194) adds fourteen app-authored advice/review questions for pages 69–71 to lesson 6-3.
- **[VERIFIED]** PR [#195](https://github.com/madnessgate44-debug/Amina/pull/195) adds eleven app-authored review questions for pages 78–79 to lesson 7-3.
- **[VERIFIED]** PR [#196](https://github.com/madnessgate44-debug/Amina/pull/196) adds 34 answer-reveal exercises for printed pages 16–17, 24–25, 42, 48–49 and 62, attached to the matching lessons.
- **[VERIFIED]** PR [#197](https://github.com/madnessgate44-debug/Amina/pull/197) adds eight answer-reveal exercises for pages 88 and 100–101, attached to lessons 8-3 and 9-3.

### Current learner-facing coverage

- **[VERIFIED]** Nine chapters and 28 numbered lessons remain the Term 1 scope.
- **[VERIFIED]** All 28 lesson plans are structurally checked for French explanation, worked demonstration, guided practice, independent practice, answer key, misconception diagnosis, remediation and mastery criteria.
- **[VERIFIED]** The learner lesson modal exposes the explanation and worked example, plus a conditional **Ressources** tab for the relevant lesson.
- **[VERIFIED]** The Resources tab now exposes six distinct enrichment page ranges: pp. 18–19, 26–27, 43, 50–51, 90–91 and 102–103; the separate Chapter 5 review on p. 63; the scientific-method appendix pp. 104–107; and the added textbook exercise sets.
- **[VERIFIED]** The exercise resources contain 72 app-authored French questions with expected answers: 34 from the five Chapter 1–5 exercise sets, 5 from the Chapter 5 review, 14 from Chapter 6, 11 from Chapter 7, and 8 from Chapters 8–9. These are paraphrases, not copied textbook text.
- **[VERIFIED]** The curriculum registry regression suite reports 52 passed, 0 failed on the PR #197 head.

### Verification and production release

- **[PASS]** CI [43693747906](https://github.com/madnessgate44-debug/Amina/actions/runs/43693747906): blocking TypeScript check, full `npm test`, and `npm run build) passed.
- **[PASS]** Engineering Execution OS compliance [43693747874](https://github.com/madnessgate44-debug/Amina/actions/runs/43693747874).
- **[VERIFIED]** PR #197 merged at `f7c06d2fd518e6b6e88036f7ddff2547b9bb4fea`. Vercel production deployment `dpl_GeVvbwtnbPxMExjVY8Aw61qPC8Qr` reached READY and updated the stable alias `amina-nine-sepia.vercel.app).
- **[UNRESOLVED WARNING]** Vercel build events continue to report `TS2688: Cannot find type definition file for 'vite/client'` during its TypeScript 7.0.2 transpilation step. This has not failed the deployment; GitHub's blocking TypeScript check and Vite production build pass. The Vite config also reports the existing `__dirname` native-loader warning and a large JavaScript chunk warning. These are recorded, not marked fixed.
- **[UNPROVEN]** A human phone-sized walkthrough has not yet been performed. The production deployment being READY is not evidence that every resource tab and answer-reveal interaction has been manually exercised on a physical phone.

### Remaining blockers and completion boundary

- **[BLOCKED]** The canonical Ministry-hosted PDF endpoint is located, but the 62,976,199-byte file has not been retrieved. The third-party-assembled Library copy remains unverified against the canonical file by SHA-256 comparison.
- **[BLOCKED]** No exact 2026–2027 Grade 5 French Science Ministry teacher guide has been authenticated. The plans and resource summaries remain Miss Noor-authored.
- **[BLOCKED]** Term 2 source reconstruction remains outside this release until the exact 2026–2027 student book is available.
- **[UNPROVEN]** The separate assessment-book PDF has not been retrieved and audited question by question.
- **[UNPROVEN]** Full independent pedagogical review and the physical-phone learner walkthrough remain open.

This release improves Grade 5 French Science **Term 1 only**. It is not a full-year completion declaration and does not claim byte-authenticated official source files or an official Ministry teacher guide.

## Grade 5 French Science Term 1 continuation — 16 November 2026

### Source evidence and chapter-title reconciliation

- **[VERIFIED]** Current `main` was inspected at `527df4fb7da32d6f3badb5f31d1172ffc0de6eec`. The canonical Ministry-hosted Science French Term 1 endpoint was successfully downloaded by Actions run [43705922358](https://github.com/madnessgate44-debug/Amina/actions/runs/43705922358): HTTP 200, `application/pdf`, 62,976,199 bytes, 109 PDF pages, SHA-256 `dc4b2d55b2e34fd21fd3f5e54c5614e727718b27dd8079d087d9cd0fa3cbbae5`.
- **[VERIFIED]** The run's retained log records ISBN 978-633-8530-17-4, Science text and French text as present. Its audit kind was download/structural inspection only; it explicitly set `manual_content_review_required=true`. The run did not yet generate a canonical per-page fingerprint CSV and did not test the French Ministry-imprint string.
- **[VERIFIED]** The Library copy used for lesson reconstruction is a different 110-page, 59,040,102-byte file with SHA-256 `6fe1d9fdcf2108c76e73c6a148277629b2d71a9a95acec427f533190b163779c`. Its PDF page 3 visibly carries the Ministry/Central Administration 2026–2027 rights statement; PDF page 109 carries the same ISBN; PDF page 110 is an appended third-party promotional page.
- **[UNPROVEN]** The canonical and Library files are not byte-identical. PR #200 records a 109/109 normalized-text fingerprint match, but the successful source-audit run above predates the per-page-fingerprint implementation and its retained artifact does not contain the canonical CSV. Do not treat the 109/109 result as independently reproducible until the updated workflow publishes its canonical fingerprint CSV and that file is compared with the Library CSV.
- **[VERIFIED]** The TOC is PDF page 6 (printed page 5). Its nine exact chapter headings and start pages match the Grade 5 Science Term 1 denominator already recorded in the source manifest. Targeted visual checks in this run covered the TOC, all nine chapter-opening pages, Chapter 1 enrichment pp. 18–19, the Ministry imprint page and the final ISBN page.
- **[VERIFIED]** Chapter-opening banners do not always reproduce the TOC wording. The app's `unitNameFr` correctly follows the TOC; retain the page-specific banner/title as a separate lesson-level label rather than normalizing the TOC to the banner.

### Current implementation and verification

- **[VERIFIED]** PR [#200](https://github.com/madnessgate44-debug/Amina/pull/200) remains open against `main`. Its inspected head before the documentation continuation was `8c7f5d760d420a22678798f222342fdf52981548`. It adds explicit source-page ranges to all 28 Science lesson records, a regression map for those ranges, the Chapter 1 camel heat-loss explanation, and the updated canonical source-audit workflow.
- **[PASS]** PR CI run [43821315922](https://github.com/madnessgate44-debug/Amina/actions/runs/43821315922) completed successfully. The blocking type-check, `npm run lint`, `npm test` and `npm run build` steps all succeeded. The curriculum registry suite reported 54 passed, 0 failed; Vite reported `built in 749ms`.
- **[PASS]** Engineering Execution OS compliance run [43821315933](https://github.com/madnessgate44-debug/Amina/actions/runs/43821315933) completed successfully and reported `ENGINEERING EXECUTION OS COMPLIANCE: PASS`.
- **[UNPROVEN]** The updated workflow's durable publication of the canonical per-page CSV has not yet been exercised end-to-end. PR #200 is not merged; no mainline merge or deployment is claimed.

### Remaining Science blockers and next action

- **[BLOCKED]** No matching Egyptian Ministry 2026–2027 Grade 5 French Science teacher guide has been authenticated. A third-party listing for a 29-page 2026–2027 Grade 5 Science `دفتر تحضير` does not establish Ministry authorship or French-track alignment and is not substituted: https://www.modrsbook.com/primary-5/term-1/science/dftr-thdyr-science-llsf-alkhams-alabtdayy-altrm-alaol-pdf-2027
- **[BLOCKED]** The exact 2026–2027 Term 2 French Science student book remains unavailable/unverified; no full-year claim is made.
- **[UNPROVEN]** The separate assessment-book PDF remains unaudited question by question; the 28 app-authored teaching plans still need an independent pedagogical peer review and a phone-sized learner walkthrough.
- **Next action:** keep PR #200 open for owner review. After an owner-approved merge, trigger/inspect the updated source-audit workflow on `main`, retain the canonical per-page fingerprint CSV, compare it against the Library CSV, and resolve any mismatches before upgrading the text-equivalence claim. Continue to keep all lesson explanations, practice, answer keys and remediation explicitly app-authored.

## Science continuation — 17 November 2026

- **[VERIFIED]** The Library PDF and its existing page-fingerprint CSV were independently reconciled across all 110 PDF pages using Poppler per-page text extraction, whitespace normalization and SHA-256. Result: 110 rows, 110 pages compared, 0 missing pages, 0 mismatches. PDF SHA-256: `6fe1d9fdcf2108c76e73c6a148277629b2d71a9a95acec427f533190b163779c`; CSV SHA-256: `b5f8cd0eba7b4a36875242bd5bc1a194e87633158470302caa93bf62b732117e`.
- **[LIMIT]** The Library self-check proves that its CSV matches its PDF on all 110 pages. The separate canonical comparison now verifies normalized extracted-text equivalence on the 109 common pages; the PDFs' different hashes and extracted-text method do not prove byte, visual/layout or untouched publisher-original identity.
- **[VERIFIED]** The later canonical source-audit run [43706201870](https://github.com/madnessgate44-debug/Amina/actions/runs/43706201870), artifact `14158542215`, contains 109 page fingerprints in its `source-audit.json`. These were independently compared with the Library CSV: 109/109 exact normalized-text SHA-256 and character-count matches, 0 missing and 0 mismatches.
- **[VERIFIED]** Both per-page CSVs and the comparison JSON are now preserved in [audit/ministry-science-source-results](https://github.com/madnessgate44-debug/Amina/tree/audit/ministry-science-source-results). The earlier run `43705922358` artifact did not include per-page fingerprints; the later run `43706201870` does.
- **[LIMIT]** This proves normalized extracted-text equivalence only. The PDFs have different SHA-256 values, and text fingerprints do not prove byte, image, layout, diagram or typography identity.
- **[UNPROVEN]** Automatic publication by the updated PR #200 workflow has not yet been exercised; it will refresh the JSON/CSV after an owner-approved merge and successful run on `main`.
- **[VERIFIED]** The student-book TOC and all nine chapter spans were re-read from the Library PDF. The nine chapter spans are pp. 6–19, 20–27, 28–43, 44–51, 52–63, 64–71, 72–79, 80–91 and 92–103; the scientific-method appendix is pp. 104–107. The 28 numbered lesson plans remain Miss Noor-authored.
- **[BLOCKED]** No matching Egyptian Ministry 2026–2027 Grade 5 French Science teacher guide was authenticated. No third-party preparation notebook was substituted.
- **[PASS]** PR #200 CI run [43824642684](https://github.com/madnessgate44-debug/Amina/actions/runs/43824642684): `npm run lint` (`tsc --noEmit`), `npm test` (top-level 39 passed, 0 failed; curriculum registry 54 passed, 0 failed) and `npm run build` (1,792 modules; 587 ms) succeeded on merge ref `b6143c1d6e4bb4d018e424db875aca2ec21c81b2`. Engineering Execution OS compliance run [43824642653](https://github.com/madnessgate44-debug/Amina/actions/runs/43824642653) passed.
- **[PASS]** Subsequent 17 November PR CI run [44041594104](https://github.com/madnessgate44-debug/Amina/actions/runs/44041594104), on merge ref `77b1c0b125bb797ff9398f5c699c3d936fd40aa8` for PR head `ad5929ca51fe04f40d5164a9d50eb5f4d36bd22a`: lint/type-check passed; `npm test` reported 39 passed, 0 failed and the curriculum registry reported 54 passed, 0 failed with all 28 Science page ranges exact; build completed with 1,792 modules in 715 ms. Compliance run [44041594042](https://github.com/madnessgate44-debug/Amina/actions/runs/44041594042) passed.
- **[UNPROVEN]** Automatic publication by the updated workflow, high-resolution diagram review, independent full pedagogical peer review and phone-sized learner walkthrough remain open. PR #200 is not merged; no deployment is claimed.
- Full command ledger and source details: [Library fingerprint verification report](../audits/science-2026-2027/library-copy-fingerprint-verification-2026-11-17.md).

## Science continuation — 18 November 2026

This update supersedes earlier status statements in this report that PR #200 remained open, that the source-audit publication workflow had not been exercised, or that the canonical per-page CSV was not yet available.

### Mainline source evidence

- **[VERIFIED]** Current `main` was inspected at `883127facf34e256e7490a48622b9d14c695f6a3`, the merge commit for PR #202.
- **[VERIFIED]** PR [#200](https://github.com/madnessgate44-debug/Amina/pull/200) is merged. Mainline source-audit run [44066062268](https://github.com/madnessgate44-debug/Amina/actions/runs/44066062268), on commit `f2119cc5d2875fb9dc0b2f7d2b7958e283d85d3d`, completed successfully: HTTP 200 download of the canonical Ministry-hosted PDF, 62,976,199 bytes, SHA-256 `dc4b2d55b2e34fd21fd3f5e54c5614e727718b27dd8079d087d9cd0fa3cbbae5`, 109 page fingerprints, durable JSON/CSV publication and artifact `14319524642`.
- **[VERIFIED]** On 18 November, the latest canonical CSV and source-audit JSON were compared with the original Library CSV. Result: 109 common pages; 109 exact normalized-text SHA-256 and character-count matches; 0 missing; 0 differing. Library-only page 110 has zero extracted characters.
- **[VERIFIED]** The GitHub results-branch copy of the Library CSV had a truncated page-72 hash even though the original Library CSV was intact. Page 72 was independently re-extracted from the Library PDF with Poppler: 1,633 normalized characters and SHA-256 `e15559bc7eac89c5f1d3dcdc29c9a5fd450f88e50b4daa6891fe6654e2e59aa0`. The results-branch CSV was restored from the original; its corrected LF-normalized SHA-256 is `a6d085afd398ce21def9ba15c5834736ff6736c3cb22fa3d4292f0df8a4da8ed`. The comparison JSON now records the latest audit run and this correction.
- **[LIMIT]** The canonical and Library PDFs have different SHA-256 values. The comparison establishes normalized extracted-text equivalence only; it does not prove byte identity, image/diagram/layout equivalence or untouched publisher-original provenance.

### Current Science implementation

- **[VERIFIED]** PR [#202](https://github.com/madnessgate44-debug/Amina/pull/202) is merged to `main` at `883127facf34e256e7490a48622b9d14c695f6a3`. Its head `f938c50c42e7e6c769bd011ea8165e19ea03bdbd` passed CI run [44067619856](https://github.com/madnessgate44-debug/Amina/actions/runs/44067619856) and compliance run [44067619858](https://github.com/madnessgate44-debug/Amina/actions/runs/44067619858); the curriculum registry suite reported 55 passed, 0 failed, and the production build succeeded. The main commit's Vercel status check reports success.
- **[IN PROGRESS]** PR [#203](https://github.com/madnessgate44-debug/Amina/pull/203) is open at head `2ef57f90eddfd62101ae97b2f7f7c47dafafa084`. It preserves the student-book 9-1 activity on printed pp. 92–93: equal water quantities in two glasses, one covered with plastic film and an elastic band, both left in the same place for 2–3 days, then compared. The lesson explicitly distinguishes this covered/uncovered comparison from a temperature-only test and labels Miss Noor's vapour-exchange explanation as app-authored. It adds guided/independent questions and a regression assertion.
- **[PASS]** PR #203 CI run [44265406667](https://github.com/madnessgate44-debug/Amina/actions/runs/44265406667): blocking type check and `npm run lint` passed; `npm test` passed (39 top-level suite summaries, 0 failed; curriculum registry 55 passed, 0 failed); `npm run build` passed (1,792 modules; 713 ms). The new 9-1 source-activity regression passed.
- **[PASS]** PR #203 Engineering Execution OS compliance run [44265406716](https://github.com/madnessgate44-debug/Amina/actions/runs/44265406716): PASS.
- **[UNPROVEN]** PR #203 is not merged. No deployment or physical-phone walkthrough is claimed.

### Remaining Science blockers

- **[BLOCKED]** No matching Egyptian Ministry 2026–2027 Grade 5 French Science teacher guide has been authenticated. The third-party 29-page `دفتر تحضير` listing is not proof of Ministry authorship or French-track alignment and is not substituted.
- **[BLOCKED]** Term 2 French Science source remains outside this Term 1 reconstruction.
- **[UNPROVEN]** The separate assessment-book PDF remains unaudited question by question; high-resolution diagram review, independent pedagogical peer review and physical-phone learner walkthrough remain open.
- **[VERIFIED]** This work covers the nine chapters and 28 numbered lessons in the 2026–2027 Grade 5 French Science Term 1 student book only. It is not a full-book or full-year completion declaration.
