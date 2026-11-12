# Grade 5 French-track curriculum completion — master plan

**Owner-approved scope:** French language, Mathematics taught in French, and Science taught in French.  
**Grade:** Egyptian Grade 5 primary only.  
**School context:** École Girard, Alexandria.  
**Academic year target:** 2026–2027 unless the school confirms a different edition.  
**Status:** IN PROGRESS — NOT COMPLETE.

## 1. Completion rule

A subject is complete only when all of the following are true:

1. The assigned Grade 5 student book(s) and both terms are identified from an official Ministry source or direct school confirmation.
2. Every book unit, lesson, activity, required vocabulary item, and examinable learning objective is inventoried against the source pages.
3. Every lesson is available in the learner's instructional language (French for all three subjects in this scope).
4. Each lesson has a teacher-ready sequence: prerequisite check, learning objectives, explicit explanation, worked examples/modelled thinking, vocabulary, visual or practical demonstration where appropriate, guided practice, independent practice, formative checks, answer key, misconceptions, corrective teaching, and mastery verification.
5. Assessments cover the objectives and include varied question types, not only one or two MCQs.
6. Source page references are checked against the actual book. A filename, lesson title, or page number in existing app data is not sufficient proof.
7. The registry, app lesson selection, and language metadata agree. No duplicate topic is counted twice as extra coverage.
8. Automated tests and production build pass. Runtime behaviour is checked in the deployed app before the subject is marked complete.

No completion percentage may be published until the source inventory denominator is established.

## 2. Confirmed repository baseline

Repository: https://github.com/madnessgate44-debug/Amina  
Baseline HEAD inspected: `3bce98389db1070ee9703136d9d2736599ea81d1`

Existing relevant data files:
- `src/data/curriculum/frenchCurriculum.ts`
- `src/data/curriculum/mathCurriculum.ts`
- `src/data/curriculum/mathFrCurriculum.ts`
- `src/data/curriculum/scienceCurriculum.ts`
- `src/data/curriculum/scienceFrCurriculum.ts`
- `src/data/curriculum/frenchAssessment.ts`
- `src/data/officialCurriculum.ts`

Existing data is a partial first-term seed, not a full-year course:
- French language: 4 lesson records.
- Maths Ministry source: 12 records; additional French extract: 4 records.
- Science Ministry source: 3 records; additional French extract: 3 records.
- The 12 + 3 Ministry-source lessons have 26 French assessment questions added in a recent patch. This is an assessment-language patch, not complete teaching material or source-book verification.

## 3. Critical repository integrity findings

### 3.1 Language metadata is not sufficient proof of French content

In `src/data/officialCurriculum.ts`, the 12 Maths and 3 Science records from `mathCurriculum.ts` and `scienceCurriculum.ts` are mapped to `instructionLanguage: 'fr'`, `contentLanguage: 'fr'`, and `assessmentLanguage: 'fr'`.

Inspection shows:
- The Maths source contains French explanations, but some source fields and questions are Arabic or mixed-language.
- The Science source contains Arabic objectives, reading text, vocabulary definitions, exercise text, and concept support fields. Replacing only the MCQ exercise array does not translate the teaching content.
- The existing French assessment layer does not translate reading text, objectives, vocabulary, concept key points, worked examples, or misconceptions.

**Required correction:** create a complete French teaching-content layer for every canonical Maths and Science lesson, or register a fully French canonical lesson. Do not label Arabic content as French.

### 3.2 Overlapping lesson tracks

The registry includes both the 12/3 Ministry-source records and separate 4/3 French extracts under the same French-bilingual subject IDs. The test currently checks duplicate English lesson titles but not equivalent concepts expressed under different titles.

**Required correction:** reconcile each record to a canonical book lesson and concept identity. Keep aliases only when required by existing app contracts; do not count aliases as additional curriculum coverage.

### 3.3 French language book identity is unresolved

The current four-lesson French source file labels its material as a Ministry Grade 5 Term 1 French book. The 2026–2027 Grade 5 Ministry first-term catalogue found in this audit lists English as the first foreign language, but does not list a standalone French student textbook among its 15 listed books. Ministry weekly French first-/second-foreign-language assessment files do exist.

**Required correction:** determine whether Girard assigns French as a first or second foreign language, identify the exact approved book/series and term sequence, and reconcile the current four lessons to that source. Do not silently substitute a Moroccan Grade 5 syllabus, French CM2, or another school's syllabus.

## 4. Ministry source register

### 4.1 Confirmed 2026–2027 first-term student-book endpoints

These are direct links to the Ministry e-learning content server; the PDFs were identified but could not be fully parsed by the available retrieval path because of their large file sizes.

- Maths in French, Grade 5, Term 1: https://elearnningcontent.blob.core.windows.net/elearnningcontent/2026_2027/Primary/Primary5/Term1/StudentBook/Math_FR_prim5_TR1.pdf
- Science in French, Grade 5, Term 1: https://elearnningcontent.blob.core.windows.net/elearnningcontent/2026_2027/Primary/Primary5/Term1/StudentBook/Science_FR_prim5_TR1.pdf
- Ministry e-library / performance assessments: https://ellibrary.moe.gov.eg/Performance_Assessments/

The Ministry 2026–2027 Grade 5 first-term catalogue lists 15 books, including Maths and Science in French. It is an inventory, not a school-specific assignment list.

### 4.2 French language evidence

The Ministry assessment repository publishes separate Grade 5 French first-foreign-language and second-foreign-language weekly assessments. Example first-foreign-language Week 1 endpoint:
https://elearnningcontent.blob.core.windows.net/elearnningcontent/2026_2027/Primary/Primary5/Term1/ClassrHomeAssessmentsTest/French1_prim5_tr1_w1.pdf

This proves assessment material exists; it does not identify Girard's assigned coursebook or establish the full annual French syllabus.

### 4.3 Term 2 and teacher guides

**UNVERIFIED / NOT YET LOCATED:** 2026–2027 Term 2 student-book endpoints, official teacher guides for the French-language versions of the Maths and Science books, and the exact assigned French-language coursebook/teacher guide for Girard.

Do not fabricate a Term 2 URL or cite a guide from Morocco, another country, another grade, or an obsolete curriculum as the Egyptian Ministry Grade 5 guide.

If no official French-version teacher guide is published, Miss Noor's teacher guide must be authored from the verified student book and clearly labelled **Miss Noor teaching guide (derived from Ministry student book)**, not represented as an official Ministry teacher guide.

## 5. Required implementation work

### Phase A — source acquisition and reconciliation
- Locate both terms of the official Maths-French and Science-French student books.
- Locate any Ministry teacher guides and weekly/periodic assessments.
- Identify the Girard-assigned French language book and first-/second-language track.
- Extract every unit, lesson, page range, activity, objective, and vocabulary item into a source manifest.
- Record exact edition, academic year, term, URL, retrieval date, and page evidence.
- Resolve duplicates and stale lesson records.

### Phase B — complete teaching content
For every canonical lesson, author and validate:
- French learning objectives and prerequisites.
- A child-appropriate French explanation, broken into teachable steps.
- Worked examples with explicit reasoning.
- Vocabulary with French definitions and age-appropriate examples.
- Diagrams, models, experiments, or real-life contexts when pedagogically useful.
- Guided practice followed by independent practice.
- Mixed formative assessment and answer explanations.
- Likely misconceptions and targeted remediation.
- Explain-back prompts and mastery criteria.
- Parent/teacher progress evidence tied to lesson objectives.

### Phase C — app integration
- Use one canonical lesson record per source lesson.
- Preserve compatibility aliases only where the app requires them.
- Ensure all visible teaching text, options, feedback, and answer explanations are French for this learner path.
- Ensure the selected lesson list exposes every verified lesson in both terms.
- Do not let the lesson feed silently omit a lesson because its assessment language or media is missing.

### Phase D — verification and closure
- Add source-manifest completeness tests.
- Add French-language integrity tests across all displayed lesson fields, not just MCQ options.
- Add duplicate-concept and missing-page tests.
- Add lesson completeness tests for teaching sequence and assessment.
- Run the full test suite, TypeScript check, and production build.
- Verify the live app on a phone-sized viewport.
- Close each subject separately only when all gates pass.

## 6. Subject-level status

| Subject | Current seed | Main blockers | Status |
|---|---:|---|---|
| Français | 4 lessons | Assigned book/track, both terms, full book TOC, teacher guide, source-page verification | NOT COMPLETE |
| Mathématiques (French instruction) | 12 Ministry-source + 4 extract records | Duplicate reconciliation, French teaching-content integrity, both-term source inventory, teacher guide | NOT COMPLETE |
| Sciences (French instruction) | 3 Ministry-source + 3 extract records | Arabic teaching fields remain under French metadata, duplicate reconciliation, both-term source inventory, teacher guide | NOT COMPLETE |

## 7. Non-negotiable evidence labels

- **[VERIFIED]** Directly inspected in the repository or exact official source.
- **[HYPOTHESIS]** Plausible school assignment or mapping that still needs confirmation.
- **[UNPROVEN]** Not yet checked against the original textbook/teacher guide.
- **[BLOCKED]** Required source could not be retrieved or identified.
- **[FAILED]** A test or verification actually ran and failed.

This plan is a work-control document. It does not certify any of the three subjects as complete.


## 8. Implementation checkpoint — 12 November 2026

**Committed on main after the baseline:**
- `src/types/teachingSession.ts`: optional `keyPointsFr` concept field.
- `src/data/curriculum/frenchTrackContent.ts`: structured French key points for the 12 current Ministry Maths concepts and 3 current Ministry Science concepts.
- `src/services/curriculum/curriculumService.ts`: merge the French key-point overlay.
- `src/services/teaching/teachingSession.ts`: French mode now selects French concept titles, source summaries, and key points; missing French key points fall back to the French source summary rather than Arabic concept points.
- `src/services/__tests__/curriculumRegistry.test.ts`: checks French overlay coverage, structured key points for the current 15 Ministry Maths/Science concepts, and a French Science teaching turn with no Arabic-script text.

**Verification limitation:** code and tests are committed, but no TypeScript/test/build run is available in this execution. These changes repair the current lesson teaching-language path; they do not complete either textbook, do not add Term 2, and do not establish the assigned French language book.

**Next execution gate:** retrieve and inspect the actual Ministry student-book TOCs/pages and assigned French coursebook, then build the canonical full-year lesson manifest before authoring additional lessons.
