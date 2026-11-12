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
- **Implementation update (12 November 2026):** a French assessment layer now supplies 25 French multiple-choice items across all 15 Ministry Maths/Science lesson records (19 Maths, 6 Science). The registry applies these items to the French-bilingual track. The separate 4-lesson French Maths extract and 3-lesson French Science extract already had French-language exercise text and were left unchanged.
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
