# Grade 5 — Official Source Register (2026–2027)

**Programme:** Miss Noor Grade 5 Full-Year Curriculum Completion
**Repository:** `madnessgate44-debug/Amina`
**Academic year:** 2026–2027
**Register opened:** 2026-11-19
**Last updated:** 2026-11-19
**Status:** Term 1 sources located and inspected. Term 2 sources **not published** — see §5.

This register records what was actually retrieved and inspected. A filename, catalogue listing or search snippet is never recorded as an inspected source. Page references appear only where the page was opened.

---

## 1. Issuing authority and access route

The Ministry student books are published as PDFs on the Ministry e-learning content server:

`https://elearnningcontent.blob.core.windows.net/elearnningcontent/2026_2027/Primary/Primary5/Term1/StudentBook/<filename>.pdf`

The route to those URLs is the third-party catalogue `https://miskeg.app/books/general-primary-5/` (retrieved 2026-11-19, HTTP 200, 26,510 bytes). `[VERIFIED]` The catalogue itself is an index, not the issuing authority; the PDFs it links resolve to the Ministry content server above. `[VERIFIED]` Every PDF in this register was downloaded from that server in this session and hashed locally.

`[UNPROVEN]` Byte-for-byte identity between these downloads and any separate Ministry download endpoint has not been compared. The files are treated as the 2026–2027 Term 1 editions because the imprint page of each inspected book states the edition, and because the URL path is year-stamped `2026_2027`.

---

## 2. Term 1 student books — inspected

All files below were downloaded on 2026-11-19 into `/tmp/books` and hashed with `sha256sum`. Page counts are the PDF page counts reported by PyMuPDF. "Structure verified" states exactly what was read.

| ID | Title (as printed) | Language / track | File | Pages | SHA-256 | Structure verified | Status |
|---|---|---|---|---|---|---|---|
| S-AR | اللغة العربية — الصف الخامس الابتدائي — كتاب الطالب | Arabic / national | `Arabic_langugae_prim5_t1.pdf` | 154 | `9d09641b074b40d93ba2d8f9560bc5d91cfe717d80f90fc15d05b8539c5065d8` | Printed فهرس: 3 units × 4 lessons, with grammar/spelling/speaking/writing sub-lessons and their own pages | inspected |
| S-EN | اللغة الإنجليزية-لغة أجنبية أولى — الصف الخامس الابتدائي — كتاب الطالب (Connect 5) | English / first foreign language | `English_language_prim5_t1.pdf` | 113 | `da7e3dd769bbdfc3506a6d4fea96ed6e62ee3a49d95ad15968e4c2bbcf7513f4` | Printed scope & sequence p3: 6 units; Unit 6 = "The Talking Earth" pp 92–113 | inspected |
| S-MATH-AR | الرياضيات باللغة العربية — الصف الخامس الابتدائي — كتاب الطالب | Arabic / national | `Math_Ar_prim5_t1.pdf` | 142 | `1d1b5ad6c275e338f172a178dbcd5ce34246ec7f8681a59c8be74ad631f6f38f` | Image-only scan; contents pages 4–6 OCR'd (ara): 6 units, 46 lessons | inspected (OCR) |
| S-MATH-FR | الرياضيات باللغة الفرنسية — الصف الخامس الابتدائي — كتاب الطالب | French / French section | `Math_FR_prim5_TR1.pdf` | 141 | `baea709a1080bfe383e8e1f040c57d68b8c1b1f6e17b7810fd5401c7187d5ace` | Text layer readable; Table des matières: 6 units, 46 lessons | inspected |
| S-SCI-AR | العلوم باللغة العربية — الصف الخامس الابتدائي — كتاب الطالب | Arabic / national | `Science_Ar_prim5_t1.pdf` | 113 | `67f645ab1f2ee0fd8a576df32c743a1961a259e2c2253e882357069b80ebefa7` | Image-only scan; front matter OCR'd (ara); chapter openers used for the lesson map | inspected (OCR) |
| S-SCI-FR | العلوم باللغة الفرنسية — الصف الخامس الابتدائي — كتاب الطالب | French / French section | `Science_FR_prim5_TR1.pdf` | 110 | `dc4b2d55b2e34fd21fd3f5e54c5614e727718b27dd8079d087d9cd0fa3cbbae5` | Nine chapters, 28 numbered lessons; page map in `grade-5-science-fr-term1-verified-lesson-map.md` | inspected |
| S-SOC | الدراسات الاجتماعية — الصف الخامس الابتدائي — كتاب الطالب | Arabic / national | `Social_studies_prim5_t1.pdf` | 98 | `6fc1db7102ae5dde9f17aa63590752063ff4d70c28f78ec9159d602cb625f8a4` | Three units of four, four and three lessons; subset-font text recovered via NFKC normalisation | inspected |
| S-ICT | تكنولوجيا المعلومات والاتصالات باللغة العربية — الصف الخامس الابتدائي — كتاب الطالب | Arabic / national | `ICT_ARABIC_Prim5_TR1.pdf` | 46 | `37491a3eb1f19118b471c7c9f1996dd65e59e4d93ea0a282af4d98169f5be4a1` | Printed فهرس p5: 2 units × 6 lessons | inspected |
| S-ISL | التربية الدينية الإسلامية — الصف الخامس الابتدائي — كتاب الطالب | Arabic / Islamic RE | `Islamic_prim5_tr1.pdf` | 96 | `ea001e782cec36bf6559b75fb1495c2bd5310507bb3a4a197a20f25496ef5f45` | Image-only scan; 19 lesson opener pages located by OCR (pp 7, 11, 20, 24, 28, 32, 39, 43, 48, 51, 55, 58, 62, 69, 73, 78, 82, 86, 89) | inspected (OCR) |
| S-CHR | التربية الدينية المسيحية — الصف الخامس الابتدائي — كتاب الطالب | Arabic / Christian RE | `Cristian_reliogion_prim5_t1.pdf` | 98 | `38f0d9252a2246236572151dbbc99adcdd84fdc9f557ac65b512ee9682805f87` | Image-only scan; 3 units × 6 lessons, opener pages OCR-verified | inspected (OCR) |
| S-LIB | المكتبات ومهارات البحث — الصف الخامس الابتدائي — كتاب الطالب | Arabic / national | `Libraries_prim5_t1.pdf` | 21 | `291831c7f11f0b5faa52953ff5bed8e6c1ed275f37f32b0b789b97398ad78341` | One unit, 12 lessons on printed pp 5–41, two pages each | inspected |
| S-FARM | مهارات الزراعة وريادة الأعمال — الصف الخامس الابتدائي — كتاب الطالب | Arabic / national | `Farming_skills_prim5_t1.pdf` | 35 | `230fdcbd5bcbf4b5026402782149984e943fc22aa2acb9a50757e06f965af53f` | Contents p4: 3 units, 5 lessons | inspected |
| S-FAM | مهارات إدارة الأسرة وريادة الأعمال — الصف الخامس الابتدائي — كتاب الطالب | Arabic / national | `Family_management_Prim5_TR1.pdf` | 56 | `4c31bb2e35e5d09b5a6743751d14411b0b002e5ce53410517834354793fc627e` | Unit 1 "تحدي وإرادة" 3 lessons (pp 6, 14, 20); Unit 2 "بيدي أصنع الفرق" 3 lessons (pp 28, 36, 44) | inspected |

**Book count: 13 inspected Term 1 student books.** The catalogue also lists two further language variants that the app does not use: `Math_EN_prim5_t1.pdf` and `Science_EN_Prim5_TR1.pdf` (English-language Maths and Science). They are recorded here for completeness; neither is part of the assigned Girard French-section programme. `[VERIFIED]`

---

## 3. The catalogue does not list a French-language student book

The 2026–2027 Grade 5 Term 1 catalogue was read in full on 2026-11-19. Its 15 entries are, in catalogue order:

1. التربية الدينية الإسلامية
2. التربية الدينية المسيحية
3. الدراسات الاجتماعية
4. الرياضيات باللغة الإنجليزية
5. الرياضيات باللغة العربية
6. الرياضيات باللغة الفرنسية
7. العلوم باللغة الإنجليزية
8. العلوم باللغة العربية
9. العلوم باللغة الفرنسية
10. اللغة الإنجليزية-لغة أجنبية أولى
11. اللغة العربية
12. المكتبات ومهارات البحث
13. تكنولوجيا المعلومات والاتصالات باللغة العربية
14. مهارات إدارة الأسرة وريادة الأعمال
15. مهارات الزراعة وريادة الأعمال

`[VERIFIED]` There is no French-language **subject** book. French appears only as a *teaching language* for Maths and Science ("باللغة الفرنسية"). The only foreign-language subject is English, labelled "لغة أجنبية أولى" (first foreign language).

`[VERIFIED]` The catalogue page contains no `Term2` link and no Arabic calligraphy (الخط) book.

**Consequences, recorded honestly:**

- **French 1 (first-language French) and French 2 (second-language French)** cannot be sourced from the Ministry Term 1 catalogue. The Ministry does not publish a Grade 5 French language student book for this year on this server. Any claim that either track is source-verified would be false. Both remain `[BLOCKED]` on a school-issued book, per §6.
- **Arabic calligraphy** (الخط) is not in the Ministry catalogue either. The app carries one calligraphy lesson; it is `[SOURCE_UNVERIFIED]`.
- The app's four `subj_french` lesson records cite "كتاب اللغة الفرنسية — الصف الخامس الابتدائي". No such book exists in the 2026–2027 catalogue. Those records are therefore `[SOURCE_UNVERIFIED]`, not verified curriculum.

---

## 4. Teacher guides and assessment documents

`[BLOCKED]` No 2026–2027 Ministry teacher guide was retrieved for any subject. `[BLOCKED]` No 2026–2027 Ministry assessment booklet was retrieved and checked question by question. Neither absence is filled by a third-party "دفتر تحضير" listing; a third-party listing is not evidence of Ministry authorship and is not used.

The teaching sequences in the app are Miss Noor originals built on the verified lesson titles, order and page positions from the books above. They are **not** teacher-guide content and are never labelled as such.

---

## 5. Term 2 — not published

`[BLOCKED]` The 2026–2027 Grade 5 catalogue lists only the first-term collection. Its own note states that Term 2 books are added when the Ministry publishes them. No `Term2` path exists on the content server, and no Term 2 PDF was found.

Term 2 is therefore **not** reconstructed. Reusing a 2024/2025 or 2025/2026 Term 2 book, or inferring Term 2 from Term 1, would fabricate curriculum. The correct action is to re-check the catalogue after Ministry publication and open a new edition-specific manifest.

**Re-check instruction:** `curl -s https://miskeg.app/books/general-primary-5/ | grep -c Term2`. A non-zero count means Term 2 is published.

---

## 6. What would unblock the blocked items

| Blocked item | Exact unblocking artefact |
|---|---|
| French 1 (first-language French) | The school-issued Grade 5 French first-language coursebook title, publisher and term sequence, confirmed in writing by École Girard, plus the book itself |
| French 2 (second-language French) | The same, for the second-language track — a different book, not a substitute for French 1 |
| Arabic calligraphy | The school's or Ministry's Grade 5 calligraphy workbook (كراسة الخط) for 2026–2027 |
| Term 2, all subjects | Publication of the 2026–2027 Term 2 books on the Ministry content server |
| Teacher guides | A Ministry-authored 2026–2027 guide, authenticated |

---

## 7. Copyright position

The books are Ministry-copyrighted. This programme reproduces **no** textbook passage beyond short attributed quotations needed to identify a lesson. Explanations, worked examples, exercises and answer keys are original Miss Noor material written for this app, grounded in the verified lesson titles, order and page positions above. `[VERIFIED]` Each curriculum data file states this in its header.

---

## 8. Evidence summary

- `[VERIFIED]` 13 Term 1 student books downloaded from the Ministry content server, hashed, and inspected to the level stated in §2.
- `[VERIFIED]` The 2026–2027 Term 1 catalogue lists no French-language subject book and no calligraphy book.
- `[VERIFIED]` No Term 2 books are published.
- `[BLOCKED]` French 1, French 2, calligraphy, Term 2 and all teacher guides.
- `[UNPROVEN]` Byte-for-byte identity of these downloads with a second Ministry endpoint.
- `[UNPROVEN]` Term 2 will not be claimed until published and inspected.
