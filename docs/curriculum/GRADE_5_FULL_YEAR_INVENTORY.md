# Grade 5 — Full-Year Curriculum Inventory (2026–2027)

**Programme:** Miss Noor Grade 5 Full-Year Curriculum Completion
**Repository:** `madnessgate44-debug/Amina`
**Last updated:** 2026-11-19
**Companion documents:** `GRADE_5_SOURCE_REGISTER.md` (what was inspected), `GRADE_5_GAP_ANALYSIS.md` (app vs source), `../reports/GRADE_5_FULL_YEAR_CURRICULUM_ACCEPTANCE.md` (per-item status)

This is the inventory of what the **books** require. Counts come from the inspected Term 1 student books, not from the app. Where a book structure was recovered by OCR because the PDF has no text layer, that is stated.

---

## 1. Scope decision: which subjects and tracks apply

The assigned school is École Girard, Alexandria, French section. The applicable programme is the Egyptian national Grade 5 curriculum as taught in that section.

| Subject | Track | Teaching language | Applies | Evidence |
|---|---|---|---|---|
| Arabic | national | Arabic | yes | S-AR |
| English (first foreign language) | national | English | yes | S-EN |
| Mathematics | national, French section | French | yes | S-MATH-FR |
| Science | national, French section | French | yes | S-SCI-FR |
| Social Studies | national | Arabic | yes | S-SOC |
| ICT | national | Arabic | yes | S-ICT |
| Islamic Religious Education | national | Arabic | yes | S-ISL |
| Christian Religious Education | national | Arabic | yes | S-CHR |
| Library & research skills | national | Arabic | yes | S-LIB |
| Farming skills & entrepreneurship | national | Arabic | yes | S-FARM |
| Family management & entrepreneurship | national | Arabic | yes | S-FAM |
| French 1 (first-language French) | French section | French | **unresolved** | see §3 |
| French 2 (second-language French) | French section | French | **unresolved** | see §3 |
| Arabic calligraphy | national | Arabic | **unresolved** | see §3 |

Religious Education is the applicable programme for the child, not both. The app carries both Islamic and Christian Term 1 books; that is a product decision, not a claim that a child studies both.

---

## 2. Verified Term 1 book structure

Counts below are the number of numbered lessons printed in each book.

| Subject | Units | Lessons | Unit breakdown | Structure source |
|---|---|---|---|---|
| Arabic | 3 | 12 | U1 4, U2 4, U3 4 | printed فهرس, S-AR |
| English | 6 | 25 | U1 5, U2 4, U3 4, U4 4, U5 4, U6 4 | printed scope & sequence p3, S-EN |
| Mathematics (FR) | 6 | 46 | U1 11, U2 8, U3 5, U4 5, U5 13, U6 4 | Table des matières, S-MATH-FR; identical structure OCR'd from S-MATH-AR |
| Science (FR) | 9 | 28 | U1 4, U2 2, U3 5, U4 2, U5 3, U6 3, U7 3, U8 3, U9 3 | chapter openers, S-SCI-FR |
| Social Studies | 3 | 11 | U1 4, U2 4, U3 3 | S-SOC |
| ICT | 2 | 12 | U1 6, U2 6 | printed فهرس p5, S-ICT |
| Islamic RE | 3 | 20 | U1 7, U2 7, U3 6 | 19 OCR'd objectives-box openers plus p16, which opens أحكام التجويد without that box, S-ISL |
| Christian RE | 3 | 18 | U1 6, U2 6, U3 6 | OCR'd openers, S-CHR |
| Library skills | 1 | 12 | U1 12 | S-LIB |
| Farming skills | 3 | 5 | U1 2, U2 2, U3 1 | contents p4, S-FARM |
| Family management | 2 | 6 | U1 3, U2 3 | S-FAM |
| **Term 1 total** | **39** | **195** | | |

`[VERIFIED]` Mathematics has the same 46-lesson, six-unit shape in the Arabic and French editions of the book, which cross-checks the French table of contents.

`[VERIFIED]` Islamic RE holds 20 lessons. Nineteen pages carry the standard "الأهداف في نهاية هذا الدرس" objectives box; printed p16 opens **أحكام التجويد** under a plain heading with no objectives box, which is why a naive opener count gives 19. Page 15 continues the exercises of the سورة الإنسان lesson, so p16 is the true start of unit 1 lesson 3.

`[VERIFIED]` The app had **أحكام التجويد** and **مخارج الحروف** transposed: unit 1 lesson 3 was labelled مخارج الحروف at "p15", and unit 2 lesson 3 was labelled أحكام التجويد at p48. The book prints أحكام التجويد at p16 and مخارج الحروف at p48. Corrected, with both page references fixed.

---

## 3. Unresolved scope items

### 3.1 French 1 and French 2

`[BLOCKED]` The 2026–2027 Ministry Term 1 catalogue publishes **no** French-language subject book. French appears only as a teaching language for Maths and Science. The only foreign-language subject is English, labelled "first foreign language".

The programme brief requires French 1 and French 2 to be established and kept separate. Neither can be established from an official source in this repository today. They are therefore:

- **not** claimed complete;
- **not** merged into one track;
- **not** filled from the app's existing four `subj_french` records, which cite a book that does not exist in the 2026–2027 catalogue and are `[SOURCE_UNVERIFIED]`.

Unblocking requires the school's written confirmation of the two French coursebooks, which is outside this repository.

### 3.2 Arabic calligraphy

`[BLOCKED]` No Grade 5 calligraphy book appears in the 2026–2027 Ministry catalogue. The single calligraphy lesson in the app is `[SOURCE_UNVERIFIED]`.

### 3.3 Term 2

`[BLOCKED]` Term 2 books are not published. The full-year denominator for Term 2 is unknown, so no Term 2 completion percentage is published. Term 1 counts above are Term 1 only and must never be presented as a full-year figure.

---

## 4. Lesson-level inventory rule

A lesson inventory entry is only usable if it carries:

- the stable app lesson id,
- subject, term, unit and lesson number,
- the book title of the lesson,
- the source book id from the register,
- the printed page where the lesson starts, when the page was read,
- the teaching language,
- content status.

The per-lesson acceptance matrix in `../reports/GRADE_5_FULL_YEAR_CURRICULUM_ACCEPTANCE.md` carries these fields for every registered lesson. Titles and page positions come from the books above. Explanations, worked examples, exercises and answer keys are original Miss Noor material.

---

## 5. What this inventory does not claim

- It does not claim any lesson is complete. Completeness is judged in the acceptance matrix.
- It does not claim Term 2 exists in any usable form.
- It does not claim French 1, French 2 or calligraphy are covered.
- It does not claim teacher-guide alignment; no 2026–2027 Ministry teacher guide was retrieved.
- It does not present a lesson count as coverage. A registered record is not a working lesson.
