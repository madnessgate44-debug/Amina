# Grade 5 curriculum recovery — clean verification baseline

**Date opened:** 2026-11-24  
**Target learner/programme:** Grade 5, École Girard, Alexandria, academic year 2026–2027  
**Purpose:** Restart source recovery from a clean evidence standard. This document does not inherit completion claims from the previous harvest.

## 1. Reset decision

The earlier source harvest is retained as a historical lead register only. A URL, filename, catalogue snippet, search result, or Drive preview shell is not proof that a complete book was retrieved. Every candidate must be classified and verified before it enters the accepted collection.

The deliverable is a subject-by-subject inventory of:
1. Complete student textbook;
2. Activity/exercise book;
3. Official assessment/performance book;
4. Formal teacher guide;
5. Teacher-preparation notebook (separate category);
6. Supplementary commercial practice material (separate category).

No category may substitute for another.

## 2. Evidence grades

- **A — Authenticated and inspected:** issuing authority/publisher and edition are identifiable; the actual PDF/file was opened or downloaded; completeness/page count and cover/imprint/contents checked.
- **B — Authenticated source, binary not inspected:** official source or publisher identifies the exact item, but the complete file has not been inspected.
- **C — Secondary listing/lead:** third-party page or Drive link describes a candidate; actual document is not verified.
- **D — Rejected/mismatch:** wrong grade, term, year, language, subject, or resource type.
- **BLOCKED:** exact required artifact or school assignment is missing.

Every row must include title, subject, term, academic year, language, resource type, publisher/issuer, URL, access result, page count, inspection evidence, SHA-256 where downloaded, and grade.

## 3. Source hierarchy

1. École Girard written booklist, parent portal, teacher circular, or teacher-issued book cover/list for this exact Grade 5 cohort.
2. Egyptian Ministry of Education official content server and official ministry-issued weekly assessments.
3. Official publisher catalogue and publisher-hosted sample/teacher resource.
4. Established school/education archive with a directly inspectable file and clear bibliographic details.
5. Public Google Drive mirrors and third-party resource indexes — leads only until the actual binary is inspected.

School identity and track are separate questions. The school's public website describes both a national section and a French international section; its public description of the French international section refers to Bac/Pre-Bac. That does not by itself prove which stream or exact booklist applies to Grade 5. Do not infer a Grade 5 book assignment from the school's name or general language profile.

## 4. Current evidence re-established on 2026-11-24

### 4.1 Grade 5 French 1 — first foreign language

**B — current-year Ministry assessment evidence:** Ministry-branded 2026/27 Grade 5 French first-language weekly assessments explicitly identify the series **BIEN JOUÉ ! 1**.
- Week 2: https://gate.natega4dk.net/files/moe/French1_prim5_tr1_w2.pdf
- Week 3: https://gate.natega4dk.net/files/moe/French1_prim5_tr1_w3.pdf
- Search-visible content includes Grade 5, French first language, BIEN JOUÉ 1, 2026/27 and Ministry French adviser office.
- This verifies the assessment's course identity, not the complete student textbook or teacher guide.
- Full student book, exercise book and formal teacher guide still require separate binary verification.

### 4.2 Grade 5 French 2 — second foreign language

**B — current-year Ministry assessment evidence:** Ministry-branded 2026/27 Grade 5 French second-language weekly assessments explicitly identify **Alex et Zoé**.
- Week 7: https://gate.natega4dk.net/files/moe/French2_prim5_tr1_w7.pdf
- Week 8: https://gate.natega4dk.net/files/moe/French2_prim5_tr1_w8.pdf
- Search-visible content identifies Grade 5, French second language, Alex et Zoé, 2026/27 and Ministry French adviser office.
- This is distinct from French 1 / BIEN JOUÉ ! 1.
- The exact publisher edition/level and complete student/teacher books must still be inspected; do not automatically promote a historical guide ISBN into an authenticated current-year assignment.

### 4.3 Mathematics — French-medium

**A — prior inspected evidence, pending clean revalidation:** the existing main-branch source register reports an inspected 141-page Ministry 2026/27 Term 1 French Maths student book, file 'Math_FR_prim5_TR1.pdf', SHA-256 'baea709a1080bfe383e8e1f040c57d68b8c1b1f6e17b7810fd5401c7187d5ace', with a six-unit, 46-lesson table of contents.
- Source register: 'docs/curriculum/GRADE_5_SOURCE_REGISTER.md' on main.
- This is a legacy verified claim that must be re-opened/re-hashed in the clean pass before being marked A in the new collection.
- No complete current-year formal French-medium Maths teacher guide has been verified.

### 4.4 Science — French-medium

**A — prior inspected evidence, pending clean revalidation:** the existing main-branch source register reports an inspected 110-page Ministry 2026/27 Term 1 French Science student book, file 'Science_FR_prim5_TR1.pdf', SHA-256 'dc4b2d55b2e34fd21fd3f5e54c5614e727718b27dd8079d087d9cd0fa3cbbae5', with nine chapters and 28 lessons.
- A separately inspected user-library copy was 110 pages and carried the 2026/27 Ministry imprint; its local hash in the earlier research record differs because it was a separate file copy. Do not assume byte identity without a fresh hash comparison.
- The 68-page French Science assessment/performance book is a different resource type and is not a teacher guide.
- No complete current-year formal French-medium Science teacher guide has been verified.

### 4.5 Remaining Ministry subjects

The existing main-branch source register reports 13 Term 1 Ministry student books downloaded and inspected: Arabic, English Connect 5, Arabic and French Maths variants, Arabic and French Science variants, Social Studies, ICT Arabic, Islamic RE, Christian RE, Library & Research Skills, Farming Skills, and Family Management. Those records are useful starting evidence but will be revalidated individually before acceptance into this reset register.

The 2026/27 Grade 5 catalogue snapshot currently lists 15 Term 1 books and says Term 2 books are added after Ministry publication:
https://miskeg.app/books/general-primary-5/
The catalogue is a third-party index; each linked PDF must resolve to and be inspected from the Ministry server. As of this research pass, no official 2026/27 Grade 5 Term 2 StudentBook catalogue entry has been established. This is a dated observation, not a claim that no Term 2 book can be published later.

## 5. School-specific assignment remains a gate

École Girard's public website:
https://ecole-girard.com/

The site describes a national section and an international French section, but the public material retrieved does not establish the exact Grade 5 stream, its complete subject list, or its assigned textbook editions. The user's description of French-medium Maths and Science is retained as a programme constraint; the precise booklist still needs school-issued evidence.

Religious Education must be represented as the learner's actual assigned track only. Do not count both Islamic and Christian RE as a single learner's curriculum. Arabic calligraphy and any enrichment subjects remain unconfirmed until the school list proves they apply.

## 6. What the previous research got wrong

- It promoted third-party descriptions and Drive URLs before inspecting the actual file.
- It mixed historic teacher guides, teacher-preparation notebooks, assessment books and formal teacher guides.
- It used historical materials alongside current-year material without always making the year mismatch sufficiently visible.
- It did not close the Girard-specific booklist/stream question.
- It called the result a source harvest, not a complete verified library; that limitation must remain explicit.

## 7. Restart execution order

1. Re-open and hash the 13 claimed Ministry Term 1 student books from the main source register.
2. Rebuild the exact Grade 5 subject/track matrix from school-issued evidence plus Ministry catalogues.
3. For each subject, search student book, exercise book, assessment book and formal teacher guide independently.
4. Inspect every actual PDF: cover, imprint, contents, final page, page count, language and term.
5. Re-check Ministry Term 2 publication at the start of each research session; never fill gaps with prior-year books.
6. Search publisher catalogues and public Drive mirrors only after the exact current-year course identity is established.
7. Produce a gap list naming the exact missing artifact and the source/access path attempted.
8. Only after the register is complete, map verified book contents into Miss Noor lesson requirements.

## 8. Acceptance rule

A subject is not "complete" because one textbook link exists. A subject's collection is complete only when all resource types actually required by the school are identified and their status is explicit. Missing teacher guides must remain missing; do not fabricate guide content from a preparation notebook or student book.

**Copyright:** Do not commit textbook PDFs, scans, publisher illustrations, audio, or substantial copyrighted extracts to the public repository. Record bibliographic metadata, URLs, page references, hashes, and original Miss Noor-authored learning material only.
