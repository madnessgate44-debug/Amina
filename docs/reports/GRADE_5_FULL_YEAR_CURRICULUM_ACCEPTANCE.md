# Grade 5 — Full-Year Curriculum Acceptance Matrix (2026–2027)

**Programme:** Miss Noor Grade 5 Full-Year Curriculum Completion
**Repository:** `madnessgate44-debug/Amina`
**Branch:** `curriculum/grade5-full-year-2026-2027`
**Last updated:** 2026-11-19
**Companion documents:** `../../docs/curriculum/GRADE_5_FULL_YEAR_INVENTORY.md`, `GRADE_5_SOURCE_REGISTER.md`, `GRADE_5_GAP_ANALYSIS.md`

This is the authoritative per-item status. A row is marked **Met** only where the
evidence was observed in this run. Anything not observed is marked **Open**,
**Blocked** or **Unproven** and is named as such. The overall programme is **not**
complete; §4 states exactly what is missing.

Evidence labels: `[VERIFIED]` observed in this session · `[HYPOTHESIS]` reasoned, not
confirmed · `[UNPROVEN]` not checked · `[BLOCKED]` cannot proceed without an outside
input · `[FAILED]` checked and did not hold.

---

## 1. Acceptance criteria

Derived from the master execution order (acceptance bar, order L145/L161): a lesson is
complete when the child can read it, work through **guided and independent** exercises,
and be assessed by an **original app-authored** exercise or assessment. In practice that
means **at least two exercises per lesson**, at least one of them answerable in the feed.

| # | Criterion | Source |
|---|---|---|
| A1 | Every Term 1 book lesson exists in the app | order L145 |
| A2 | Every available lesson opens and carries teaching text | order L145 |
| A3 | Every available lesson offers ≥2 exercises | order L145/L161 |
| A4 | Every answer key is present among its own options | order L161 |
| A5 | Every available lesson poses an answerable feed question | brief |
| A6 | Feed choices are in the child's own script | brief, RTL requirement |
| A7 | Progress persists across reload | brief |
| A8 | A correct answer is never diagnosed as a misconception | teaching correctness |
| A9 | Lesson title matches the lesson's own teaching text | source fidelity |
| A10 | Both terms covered | order L94/L145 |
| A11 | All language tracks covered, French 1 and French 2 separate | brief |
| A12 | Verified production deployment | brief |

---

## 2. Status matrix — Term 1

`[VERIFIED]` All figures below are the measured output of the audit described in
`GRADE_5_GAP_ANALYSIS.md` §1 and §3, run 2026-11-19.

| Subject | A1 lessons | A2 openable | A3 ≥2 ex. | A4 keys valid | A5 question | A6 script | Status |
|---|---|---|---|---|---|---|---|
| Arabic | 12/12 | 12/12 | 12/12 | yes | 12/12 | yes | Met |
| English | 25/25 | 25/25 | 25/25 | yes | 25/25 | yes | Met |
| Mathematics (FR) | 46/46 | 46/46 | 46/46 | yes | 46/46 | yes | Met |
| Science (FR) | 28/28 | 28/28 | 28/28 | yes | 28/28 | yes | Met |
| Social Studies | 11/11 | 11/11 | 11/11 | yes | 11/11 | yes | Met |
| ICT | 12/12 | 12/12 | 12/12 | yes | 12/12 | yes | Met |
| Islamic RE | 20/20 | 20/20 | 20/20 | yes | 20/20 | yes | Met |
| Christian RE | 18/18 | 18/18 | 18/18 | yes | 18/18 | yes | Met |
| Library skills | 12/12 | 12/12 | 12/12 | yes | 12/12 | yes | Met |
| Farming skills | 5/5 | 5/5 | 5/5 | yes | 5/5 | yes | Met |
| Family management | 6/6 | 6/6 | 6/6 | yes | 6/6 | yes | Met |
| **Term 1 total** | **195/195** | **195/195** | **195/195** | **yes** | **195/195** | **yes** | **Met** |

`[VERIFIED]` A9 (title matches teaching text) holds for all Arabic lessons after the
أحكام التجويد / مخارج الحروف repair, and integrity check `1.17` enforces it.

`[VERIFIED]` A8 (a correct answer is never diagnosed) holds across the Arabic and
French-Maths misconception sets. It failed during this work when a new exercise's answer
`12` collided with an existing misconception trigger for LCM(6,9); the exercise was
re-based on 4 and 9 with answer 36 so no trigger is hit.

---

## 3. Criteria status

| # | Criterion | Status | Evidence |
|---|---|---|---|
| A1 | Term 1 lessons present | **Met** | inventory §2 vs app: 195/195 |
| A2 | Lessons openable | **Met** | 195/195 available, all carry concepts |
| A3 | ≥2 exercises | **Met** | integrity `1.16` passes; 195/195 |
| A4 | Answer keys valid | **Met** | `bad exercises: 0`; integrity suite |
| A5 | Answerable feed question | **Met** | 198/199 browsable; the 1 exception is hidden `pending_materials` |
| A6 | Correct script in choices | **Met** | reels suite checks 14.1–14.3, 16.1 pass for ar/en/fr |
| A7 | Progress persists | **Met** | `jobPersistence` 19/19 in `npm test` |
| A8 | Correct answer not misdiagnosed | **Met** | teaching-skills checks 9.4 and 10.4 pass |
| A9 | Title matches content | **Met** | integrity `1.17` passes; proven to catch the bug |
| A10 | Both terms | **Blocked** | Term 2 not published — see §4.1 |
| A11 | All tracks incl. French 1/2 | **Blocked** | no French coursebook published — see §4.2 |
| A12 | Verified production deployment | **Unproven** | not deployed or compared in this run — see §4.4 |

---

## 4. What is missing

### 4.1 Term 2 — `[BLOCKED]`

`[VERIFIED]` The catalogue was re-checked live on 2026-11-19: HTTP 200, 32,475 bytes,
zero "Term2" mentions, all links under `Term1/StudentBook/`. No Term 2 book exists to
map. Term 2 is not reconstructed and not claimed; doing so would fabricate curriculum.

### 4.2 French 1 and French 2 — `[BLOCKED]`

`[VERIFIED]` No French-language Grade 5 subject book is published for 2026–2027.
French is only a teaching language for Mathematics and Science. The two tracks remain
separate and unfilled; they are not merged and not populated from unverified records.

### 4.3 Arabic calligraphy — `[BLOCKED]`

`[VERIFIED]` No Grade 5 calligraphy book is published. The single existing lesson stays
`[SOURCE_UNVERIFIED]` and is not counted as coverage.

### 4.4 Production deployment — `[UNPROVEN]`

`[UNPROVEN]` This branch was built locally (`npm run build`, exit 0) but was not
deployed, and the live site's asset hash was not compared against the local build. No
claim is made that this work is live. Deployment and the hash comparison remain to be
done before A12 can be marked Met.

---

## 5. Verification evidence

`[VERIFIED]` 2026-11-19, working tree of `curriculum/grade5-full-year-2026-2027`:

| Check | Command | Result |
|---|---|---|
| Curriculum integrity | `npx tsx src/services/__tests__/curriculumIntegrity.test.ts` | 17 passed, 0 failed |
| Full suite | `npm test` | exit 0, 1224 checks, 0 failed |
| Build | `npm run build` | exit 0 |
| Lint | `npm run lint` | exit 0 |
| Whitespace | `git diff --check` | clean |

---

## 6. Bottom line

`[VERIFIED]` Term 1 is complete against the inspected books: 195 of 195 lessons, each
openable, each with at least two exercises, each with a valid answer key, each posing an
answerable question in the child's own script.

`[BLOCKED]` The programme as a whole is **not** complete. Term 2, French 1, French 2 and
calligraphy cannot be built from any published 2026–2027 source, and the deployment is
not yet verified. No full-year completion claim is made.
