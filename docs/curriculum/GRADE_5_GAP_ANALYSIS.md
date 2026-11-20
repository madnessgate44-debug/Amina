# Grade 5 — App-vs-Source Gap Analysis (2026–2027)

**Programme:** Miss Noor Grade 5 Full-Year Curriculum Completion
**Repository:** `madnessgate44-debug/Amina`
**Last updated:** 2026-11-19
**Companion documents:** `GRADE_5_FULL_YEAR_INVENTORY.md` (what the books require), `GRADE_5_SOURCE_REGISTER.md` (what was inspected), `../reports/GRADE_5_FULL_YEAR_CURRICULUM_ACCEPTANCE.md` (per-item status)

This document records the differences found between the app's curriculum data and the
inspected Term 1 student books, and what was done about each. Every row states the
evidence label that applies to it. Nothing here claims Term 2, French 1, French 2 or
calligraphy coverage — those are `[BLOCKED]` and are stated as such.

---

## 1. Method

The app was audited lesson by lesson against the inventory, not by subject count alone.
For each registered lesson the audit checked five independent properties:

1. **Browsable** — the lesson appears under its subject and unit.
2. **Registered** — `curriculumService.getAllLessons()` returns it.
3. **Openable** — `isAvailable` is true and the concept carries teaching text.
4. **Exercises** — the lesson offers at least two exercises, at least one answerable
   (multiple choice with the answer key present among the options).
5. **Question in the feed** — `buildReelsForConcept()` produces at least one reel the
   child can actually answer, with choices in the child's own script.

Properties 4 and 5 are the ones a count of lessons cannot see. They are where the real
gaps were.

`[VERIFIED]` The audit was run against the working tree with
`npx tsx` over `curriculumService.getSubjectsSummary()` and `buildReelsForConcept()`,
on 2026-11-19. The per-subject figures in §3 are that run's output.

---

## 2. Term 1 parity — lesson records against the books

`[VERIFIED]` All eleven Term 1 subjects match the book structure recorded in the
inventory: unit count, lesson count and unit breakdown agree for Arabic (12),
English (25), Mathematics FR (46), Science FR (28), Social Studies (11), ICT (12),
Islamic RE (20), Christian RE (18), Library skills (12), Farming skills (5) and
Family management (6). No lesson present in a book is missing from the app, and no app
lesson is invented beyond the printed contents.

`[VERIFIED]` One transposition was found and repaired. The book prints
**أحكام التجويد** at p16 and **مخارج الحروف** at p48. The app had the two titles
swapped. The earlier repair moved only the titles, leaving each lesson's teaching text,
objectives, vocabulary and question describing the other topic — a child opening
"أحكام التجويد" read a lesson about مخارج الحروف. Both the titles and the bodies were
swapped so each lesson now teaches the topic its title names, and page references were
corrected to 16 and 48. A guard (`1.17`) now fails if any lesson's title appears in
another lesson's teaching text but not its own.

---

## 3. Term 1 exercise depth and feed questions — measured

`[VERIFIED]` Measured after the repairs in this branch:

| Subject | Units | Lessons | Available | Lessons with ≥2 exercises | Lessons with an answerable question |
|---|---|---|---|---|---|
| Arabic | 3 | 12 | 12 | 12 | 12 |
| English | 6 | 25 | 25 | 25 | 25 |
| Mathematics (FR) | 6 | 46 | 46 | 46 | 46 |
| Science (FR) | 9 | 28 | 28 | 28 | 28 |
| Social Studies | 3 | 11 | 11 | 11 | 11 |
| ICT | 2 | 12 | 12 | 12 | 12 |
| Islamic RE | 3 | 20 | 20 | 20 | 20 |
| Christian RE | 3 | 18 | 18 | 18 | 18 |
| Library skills | 1 | 12 | 12 | 12 | 12 |
| Farming skills | 3 | 5 | 5 | 5 | 5 |
| Family management | 2 | 6 | 6 | 6 | 6 |
| **Total** | **40** | **195** | **195** | **195** | **195** |

The app also carries four `subj_french` records and one `subj_calligraphy` record.
These are **not** part of the verified Term 1 total above: they cite books that do not
exist in the 2026–2027 catalogue and remain `[SOURCE_UNVERIFIED]` (§4.2, §4.3).
Three of the four French records are available and offer two exercises each; the fourth
(`off_fr_u3_l1_horaire`) is `pending_materials` and correctly hidden.

### 3.1 The depth gap that was closed

`[VERIFIED]` Before this work, 38 lessons offered fewer than two exercises, and 33 of
the 46 French-Maths lessons offered exactly one. A single exercise means a child can
answer once and the lesson is spent — it cannot satisfy "complete guided **and
independent** exercises".

`[VERIFIED]` The repairs were:

- **French-Maths 2026 builder** — a second exercise is now derived from each lesson's
  own worked example, and only when the arithmetic verifies. 26 lessons qualified;
  9 were rejected because the printed example's arithmetic did not hold
  (for example `6 × 14 = 6`), and 11 lessons had no equation to derive from. Rejected
  and absent cases were then authored by hand rather than guessed.
- **Authored items** — 17 explicit items for French-Maths 2026, 3 more in a later
  batch, 2 for the legacy French-Maths lessons, 4 for Arabic and French, and 5 through
  `FRENCH_ASSESSMENTS`.
- **Legacy Maths** — `withFrenchAssessments()` in `frenchAssessment.ts` *replaces*
  `lesson.exercises` with `FRENCH_ASSESSMENTS[id]`, so edits to `mathCurriculum.ts`
  were invisible for those lessons. The missing items were added to
  `FRENCH_ASSESSMENTS` instead. This was the root cause of the "no-op" edits.
- **Final three** — `off_en_u4_elephantine`, `off_isl_u1_l1_names_of_allah` and
  `off_isl_u1_l2_prayer_virtues`, each given a second item drawn from that lesson's own
  verified reading text.

`[VERIFIED]` Every answer key is present among its own options (`bad exercises: 0`),
and the exercise distribution for French-Maths 2026 moved from `{1:20, 2:26}` to
`{1:3, 2:43}` and finally to no lesson below two.

### 3.2 The feed question gap that was closed

`[VERIFIED]` A lesson could hold two exercises and still show the child no question.
Two causes were found:

- **Answer/option mismatch.** `exerciseToOptions()` returns nothing unless the answer
  key matches exactly one option. Lessons whose second item was free-text (`qa`) could
  not produce a question reel from that item. These lessons still posed their
  multiple-choice item, so no lesson was left question-less by this cause alone.
- **Bracketed English gloss.** `off_ict_u1_l3` offered
  `البلوتوث (Bluetooth)` and `قارئات الشاشة (Screen Readers)`. The language guard
  counted characters and judged the Latin gloss to dominate, so it dropped both
  options, and the lesson showed **no question at all**. The lesson itself introduces
  the term as `تقنية البلوتوث (Bluetooth)`, so the Arabic phrase is what the child
  reads. The gloss was removed from the four option/answer strings, which restores the
  question and keeps every option in one script. A central guard change was tried
  first and reverted: it loosened the script guarantee enough that three other checks
  caught genuinely Latin-dominant data, so the data was fixed rather than the guard.

`[VERIFIED]` After the repair, **every** available lesson produces an answerable
question: 227 of 227. The register holds 234 lesson records; 7 are hidden as
`pending_materials` (6 legacy Science duplicates plus `off_fr_u3_l1_horaire`), and a
hidden lesson is never shown, so it cannot leave the child without a question. The
Term 1 book-mapped subset of 195 is included in the 227.

---

## 4. Items that remain open

### 4.1 Term 2 — `[BLOCKED]`

`[VERIFIED]` Re-checked live on 2026-11-19: the Grade 5 catalogue page
(`https://miskeg.app/books/general-primary-5/`) returned HTTP 200 and 32,475 bytes,
contains **zero** occurrences of "Term2" / "term-2" / "الفصل الثاني", and every book
link it publishes is under a `Term1/StudentBook/` path. No Term 2 book is published on
the Ministry content server.

Term 2 is therefore not reconstructed and not claimed. Reusing a 2024/2025 or
2025/2026 Term 2 book, or inferring Term 2 from Term 1, would fabricate curriculum.
Full-year completion cannot be claimed until the Ministry publishes Term 2 and the new
books are inspected and mapped.

### 4.2 French 1 and French 2 — `[BLOCKED]`

`[VERIFIED]` The 2026–2027 Term 1 catalogue publishes no French-language subject book.
French appears only as a teaching language for Mathematics and Science. French 1 and
French 2 cannot be established from an official source, are not claimed complete, and
are not merged into one track. They are not filled from the app's four existing
`subj_french` records, which cite a book absent from the catalogue.

Unblocking requires the school's written confirmation of the two coursebooks.

### 4.3 Arabic calligraphy — `[BLOCKED]`

`[VERIFIED]` No Grade 5 calligraphy book appears in the 2026–2027 catalogue. The app's
single calligraphy lesson remains `[SOURCE_UNVERIFIED]` and is not counted as coverage.

### 4.4 Legacy Science records — `[HYPOTHESIS]` resolved as hidden

Six `subj_science` records are `pending_materials`: `off_sci_u1_l1_plant_needs`,
`off_sci_u1_l2_ecosystem`, `off_sci_u1_l3_coral_bleaching`, `off_scifr_u1_l1_plantes`,
`off_scifr_u1_l2_chaines` and `off_scifr_u2_l1_matiere`. They are legacy records whose
contents do not match the 2026–2027 book and are correctly hidden from the child. They
are excluded from every available-lesson total in §3 and are not counted as coverage.

---

## 5. Verification performed

`[VERIFIED]` On 2026-11-19, after the final repair:

| Check | Command | Result |
|---|---|---|
| Curriculum integrity | `npx tsx src/services/__tests__/curriculumIntegrity.test.ts` | 17 passed, 0 failed |
| Full test suite | `npm test` | exit 0, 1224 checks, 0 failed (`jobPersistence` 19/19) |
| Production build | `npm run build` | exit 0 |
| Lint | `npm run lint` | exit 0 |
| Whitespace | `git diff --check` | clean |

`[VERIFIED]` The new integrity check `1.17` was proven to work, not merely to pass: the
original title-only swap was reintroduced into `islamicCurriculum2026.ts`, the suite
failed naming `off_isl_2026_u1_l3`, and the file was restored to green.

`[UNPROVEN]` The production deployment of this branch was not verified in this run.
The live site was not rebuilt and its asset hash was not compared against a local
build, so no claim is made that this work is live.
