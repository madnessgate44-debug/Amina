# Sources — where Miss Noor's content comes from

This file records where every piece of content in the app comes from, and what
has been verified. It exists so a claim can be checked rather than trusted.

Figures below were produced by reading the curriculum data directly, not copied
from an earlier document. The command used is given at the end.

## 1. Official curriculum (the canonical source)

Every lesson carries a `sourceRef` naming its book, grade, term, unit, lesson
and page. All 33 available lessons have a source page.

| Subject | English | id | Lessons | Concepts | Exercises (answerable) | With source page | Book (Arabic) |
|---|---|---|---|---|---|---|---|
| اللغة العربية | Arabic Language | `subj_arabic` | 5 | 5 | 8 (8) | 5/5 | اللغة العربية — تواصل ص. 6-11 |
| اللغة الفرنسية | French Language | `subj_french` | 4 | 5 | 5 (5) | 4/4 | كتاب الوزارة للغة الفرنسية ص. 4-9 |
| الرياضيات | Mathematics | `subj_math` | 4 | 3 | 4 (4) | 4/4 | كتاب الوزارة Mathématiques ص. 3-8 |
| العلوم | Science | `subj_science` | 3 | 2 | 3 (3) | 3/3 | كتاب الوزارة Sciences ص. 8-15 |
| الدراسات الاجتماعية | Social Studies | `subj_social_studies` | 3 | 3 | 6 (6) | 3/3 | الدراسات الاجتماعية — كتاب الوزارة ص. 10-16 |
| اللغة الإنجليزية | English (Connect 5) | `subj_english` | 2 | 2 | 3 (3) | 2/2 | اللغة الإنجليزية كونكت 5 ص. 14-16 |
| تكنولوجيا المعلومات والاتصالات | ICT | `subj_ict` | 12 | 12 | 25 (25) | 12/12 | تكنولوجيا المعلومات والاتصالات ص. 7-9 |
| التربية الدينية الإسلامية | Islamic Studies | `subj_islamic` | 2 | 2 | 2 (2) | 2/2 | التربية الدينية الإسلامية — كتاب الوزارة ص. 8-15 |
| الخط العربي | Arabic Calligraphy | `subj_calligraphy` | 1 | 1 | 2 (2) | 1/1 | كراسة الخط العربي ص. 4-6 |
| **Total** | | | **33** | **34** | **58 (58)** | **33/33** | |

- Reading text present: 33/33 lessons.
- Vocabulary present: 33/33 lessons.
- Every one of the 58 exercises has a resolvable expected answer, so the app
  never shows a question it cannot check.
- Data files: `src/data/curriculum/*.ts`, assembled by
  `src/data/officialCurriculum.ts` and served through
  `src/services/curriculum/curriculumService.ts`.

## 2. Supplementary books (referenced, not bundled)

These are support books the family may own. They are referenced by name and
page so a lesson can point to extra practice. **Their content is not stored in
this repository.**

- **الأضواء (Al-Adwaa)** — supplementary practice.
- **سلاح التلميذ (Selah El-Telmeez)** — supplementary practice.

The learner can import a personal copy as a PDF or page photos through
**My Books**. That copy stays on the device: it is stored as a Blob in
IndexedDB, is never committed to the repository, and is never stored or logged
by the server. Only the single page being studied is sent to the AI, as a
transient pass-through, and only when the learner asks for help with it. See
`src/services/myBooks/` and `docs/audits/`.

## 3. Parent-entered data (never invented)

- **Exam calendar** — `src/types/examCalendar.ts`,
  `src/services/parent/examCalendarService.ts`. An exam entry exists only
  because a parent typed it. The app never guesses Ministry or school dates.
- **Timetable** — parent-set; `src/data/defaultTimetable.ts` holds a default
  that the parent can change.

## 4. AI-generated content (labelled as generated)

Noor's explanations, questions and feedback are generated at request time.
They are never presented as official curriculum text, and generated cards are
kept separate from curriculum-sourced cards.

- Tutor route: `POST /api/chat`; study-page route: `POST /api/study-page`.
- Without a `GEMINI_API_KEY` the app degrades honestly: lessons, curriculum,
  mastery, saving and the whole learner flow still work, and only the live AI
  text is replaced by local fallbacks.

## 5. Verification status

| Claim | Status |
|---|---|
| 33 lessons across 9 subjects, each with a source page | **Verified** by direct read of the curriculum data |
| 58 exercises, all with a resolvable answer | **Verified** by direct read |
| Exam dates come only from parent entries | **Verified** in code and in `HomeScreen` |
| Supplementary book content is not in the repository | **Verified** by the repository-wide file check in the My Books test suite |
| My Books keeps a personal PDF on the device | **Verified** by browser check at 390x844 on the production build |

## 6. How to reproduce the figures

```
npx tsx -e "
import { CurriculumService } from './src/services/curriculum/curriculumService';
const c = new CurriculumService();
for (const s of c.getSubjectsSummary()) {
  const ls = c.getLessonsBySubject(s.subjectId);
  console.log(s.subjectId,
    ls.length,
    ls.reduce((a,l)=>a+l.concepts.length,0),
    ls.reduce((a,l)=>a+l.exercises.filter(e=>(e.expectedAnswer||'').trim()).length,0));
}
"
```

---

Last updated: 2026-10-25. Baseline commit: see the PR that added this file.
