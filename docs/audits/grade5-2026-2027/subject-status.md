# Grade 5 Term 1 curriculum status — 2026–2027

**Main baseline:** `527df4fb7da32d6f3badb5f31d1172ffc0de6eec` (read-only; no main-branch writes).  
**Controlling policy:** `ENGINEERING_EXECUTION_OS.md` v2.2 and `AGENTS.md`; both read at the start of this continuation.  
**Audit branch:** `audit/grade5-term1-subject-source-audit-2026-11-15`.  
**Latest source audit:** [43844113846](https://github.com/madnessgate44-debug/Amina/actions/runs/43844113846) — PASS; 21 Ministry-hosted URLs attempted, 17 PDFs retrieved, 448 pages fingerprinted.  
**Current PR:** [#201](https://github.com/madnessgate44-debug/Amina/pull/201), open and mergeable; no merge.  
**Science PR:** [#200](https://github.com/madnessgate44-debug/Amina/pull/200), open and mergeable; no merge.  
**Scope:** Egyptian Primary Grade 5, academic year 2026–2027, Term 1. Mathematics and Science are assessed against the French-track materials. The school's French1/French2 assignment and school pacing remain unverified.

## Tool declaration

- [V] GitHub repository file, branch, pull-request and Actions inspection/update tools were used.
- [V] The source-audit GitHub Actions workflow retrieved Ministry-hosted PDFs and generated source metadata, page fingerprints, headings and a one-day review artifact.
- [V] Python/container inspection was used to inspect the temporary Actions artifact.
- [B] No school portal login, private school records, physical-phone session or Ministry teacher-guide access was used.

## Compliance header

- [V] Workflow followed: OUTCOME → INSPECT → SPECIFY → PLAN → EXECUTE → VERIFY → REVIEW → CLOSE.
- [V] No direct push to `main`; all changes are on the audit branch.
- [V] No merge or production deployment.
- [V] No textbook PDFs or full extracted/OCR textbook text committed.
- [V] No private learner information or secrets added.
- [U] No visual/page-layout verification, teacher-guide authentication, school-specific pacing confirmation or learner-mastery evidence.

## Executive subject status

| Subject | Verified source coverage | Current app registry | Result |
|---|---|---:|---|
| French Science | 9 chapters / 28 numbered lessons; prior canonical-host/Library comparison matched 109/109 normalized text fingerprints | 28 lessons + 28 app-authored teacher-guide plans on main | [IN PROGRESS] PR #200 contains the current source/provenance reconciliation; owner merge and post-merge publish gate remain |
| Mathematics — French track | 46 StudentBook lessons across 6 units; 74-page performance-assessment book | 12 national-book lesson records | [GAP] 11 exact matches + 1 verified lesson-banner title variant; 34 lessons missing. Four extra French-extract records are duplicate or mis-mapped |
| French language | 7 French1 and 6 French2 weekly assessments retrieved and OCR-reviewed; no separate StudentBook or standalone assessment book found | 4 generic legacy records | [BLOCKED ON TRACK] Assessments identify Bien joué 1 and Alex et Zoé 2, but school assignment is unknown |
| English | 6 units and 26 numbered lessons/creative tasks in Connect 5; 74-page performance-assessment book | 2 legacy records | [GAP] One app story materially differs from the StudentBook; the other app record is unrelated/unverified. 24 additional source lessons/tasks have no app record |

Counts above measure source/registry coverage, not learner mastery or school pacing.

## Source audit — latest run

- [V] Workflow [43844113846](https://github.com/madnessgate44-debug/Amina/actions/runs/43844113846) completed successfully: 21 URLs attempted, 17 PDFs retrieved, 448 pages fingerprinted.
- [V] OCR was attempted on 165 pages; 163 produced OCR text:
  - Math French StudentBook: 8/8 low-text pages.
  - Math French performance-assessment book: 30 pages attempted, 29 produced text.
  - English StudentBook: 8/8 low-text pages.
  - English performance-assessment book: 73 pages attempted, 72 produced text.
  - French1 weekly assessments: 28/28 pages OCR text.
  - French2 weekly assessments: 18/18 pages OCR text.
- [V] French weekly assessment OCR used `fra+ara`; French Mathematics used `fra+eng`; English used `eng+ara`.
- [V] The 448-page fingerprint CSV is based on normalized extracted/OCR text. It does not establish visual/layout or diagram equivalence.
- [V] A temporary artifact contains the page text used for this review and expires after one day. It is not stored in the repository. The repository contains only metadata, hashes, concise headings, matrices and summaries.
- [V] Four candidate URLs returned HTTP 404: uppercase Math assessment filename; French1 standalone assessment-book candidate; French2 standalone assessment-book candidate; French2 week 6.
- [U] Ministry-hosted retrieval is verified, but PDF metadata indicates third-party PDF processing; untouched publisher-original provenance is not established.

### Principal source files

| Source | Pages | Bytes | SHA-256 |
|---|---:|---:|---|
| French Mathematics StudentBook | 141 | 17,195,754 | `baea709a1080bfe383e8e1f040c57d68b8c1b1f6e17b7810fd5401c7187d5ace` |
| French Mathematics Performance Tasks and Assessments | 74 | 9,487,796 | `9521338362528fc1c7e0717c92b2f596c7177860c37c1311a80ed86fa6c67479` |
| English StudentBook | 113 | 18,757,051 | `da7e3dd769bbdfc3506a6d4fea96ed6e62ee3a49d95ad15968e4c2bbcf7513f4` |
| English Performance Tasks and Assessments | 74 | 11,788,956 | `41b01ce8e0530ba2400696a4fad31a063f775980bf2995e9e2687fa23e2d1472` |

The complete per-source retrieval timestamps, PDF metadata and hashes are in `subject-source-audit.json`.

## 1. Science — French track

- [V] Main contains 28 current-edition French Science lessons and 28 keyed app-authored teaching plans. These are not an authenticated Ministry teacher guide.
- [V] Prior canonical-host/Library comparison: 109/109 normalized extracted-text page fingerprints match. This proves normalized text equivalence only, not byte identity, visual identity or publisher-original authenticity.
- [V] PR [#200](https://github.com/madnessgate44-debug/Amina/pull/200), head `969f0f9fcb2bc119f8fdf3899767b582bccd1a93`, is 23 commits ahead of main, 0 behind and mergeable. It corrects French imprint detection, source provenance across the 28 lesson notes, camel heat-loss enrichment and source-audit publishing.
- [V] PR [#170](https://github.com/madnessgate44-debug/Amina/pull/170) is stale and non-mergeable (38 commits ahead on an old base). Its Chapter 1 guide duplicates the 28-plan registry already on main; do not merge it as-is.
- [V] PR [#182](https://github.com/madnessgate44-debug/Amina/pull/182) is an Arabic Science draft and is not the French Science work.
- [B] PR #200 still requires owner merge approval. Its publish-from-main gate cannot be completed without that merge; no merge or deployment was performed.

## 2. Mathematics — French track

### Source and lesson reconciliation

- [V] StudentBook: Ministry-hosted `Math_FR_prim5_TR1.pdf`, 141 pages, 17,195,754 bytes; SHA-256 above.
- [V] Performance-assessment book: working lowercase endpoint `Math_fr_prim5_t1_Assmt.pdf`, 74 pages, 9,487,796 bytes; SHA-256 above. The uppercase filename candidate returned 404.
- [V] StudentBook TOC pages 2–4 identify 46 lessons across six units.
- [V] The assessment book OCR maps lesson-specific activities/homework to all 46 lessons. Some assessment pages combine two adjacent lessons (for example Unit 2 lessons 6–7, Unit 3 lessons 1–2 and Unit 3 lessons 4–5).
- [V] Current `mathCurriculum.ts` has 12 top-level records: 11 exact title/page matches and Unit 6 lesson 1. For Unit 6 lesson 1, the TOC says `Expressions numériques`, while the lesson-opening banner says `L’ordre des opérations mathématiques`; the app's “Order of Operations” title matches the lesson banner and the page/lesson number.
- [V] The other 34 StudentBook lessons have no current app lesson record.
- [V] `mathFrCurriculum.ts` adds four extra legacy records: one duplicate of Unit 1 lesson 1 and three unsupported mappings (Unit 1 lesson 2, Unit 2 lesson 1 and Unit 3 lesson 1). They are not additional official coverage.
- [U] Source titles, objectives and assessment-page links are mapped for all 46 lessons. Full worked-example, exercise, answer-key and teaching-scaffold review is not yet complete. Do not generate missing lessons from titles alone.

## 3. French language

- [V] No separate French-language Grade 5 Term 1 StudentBook appeared in the inspected 2026–2027 Ministry StudentBook catalogue. Candidate French1 and French2 standalone performance-assessment-book URLs returned 404.
- [V] French1 weekly assessments: weeks 1–7, 4 pages each (28 pages), headers identify `Bien joué 1`.
- [V] French2 weekly assessments: weeks 1–5 and 7, 3 pages each (18 pages), headers identify `Alex et Zoé 2`. Week 6 returned 404.
- [V] All 46 retrieved weekly-assessment pages were OCR-processed and produced text. The track-specific content review is in `french-language-weekly-content-review.csv`.
- [V] French1 assessment progression includes personal identity, family, adjective agreement, present-tense verbs, music/preferences, directions and places, sports, stressed pronouns, imperative commands and school description.
- [V] French2 assessment progression includes greetings, sentence ordering, age, negation, basic nouns, school objects, breakfast, food/drinks, articles, clothes, colors and simple question/answer matching.
- [U] These weekly assessments establish that two Ministry assessment tracks exist; they do not establish which one École Girard assigns or supply a complete StudentBook sequence.
- [B] The four existing generic French app records cite an unidentified “Ministry French Book” and cannot be treated as verified curriculum until their source and assigned track are established.

## 4. English

- [V] Ministry-hosted Connect 5 StudentBook: 113 pages; six units. The source and assessment-book lesson headings identify 26 lessons/creative tasks: five in each of Units 1–5 and one extended Unit 6 story.
- [V] The 74-page performance-assessment book OCR identified lesson assessment pages for the 26-unit sequence; Unit 4 pronunciation (StudentBook p.69) has no matching direct pronunciation task in the assessment book. Assessment p.39 is a separate cross-curricular multiplication activity.
- [V] The app's existing Unit 1 record `off_en_u1_apple_tree` is materially wrong: the StudentBook's Lesson 3 “The Giving Tree” (pp.13–16) describes Tom neglecting and later caring for a tree. The app text describes a different branch-cutting/stump story, labels it “The Generous Apple Tree”, numbers it Lesson 1 and cites p.14.
- [V] The app's Unit 4 “Elephantine Island in Aswan” record has no matching title/page in the inspected Connect 5 Term 1 StudentBook. It is an unverified app-only record, not a match for “The New Administrative Capital”.
- [V] The 26-row source-derived content review is in `english-lesson-content-review.csv`; the source/app reconciliation is in `english-lesson-reconciliation.csv`.
- [B] The English app curriculum still needs a source-grounded 26-lesson registry and app-authored teaching plans. No verbatim textbook story should be copied into the app.

## Verification ledger

- [V] Source audit [43844113846](https://github.com/madnessgate44-debug/Amina/actions/runs/43844113846): PASS; all retrieval, fingerprinting, publishing and artifact-upload steps succeeded.
- [V] Engineering OS compliance [43845766404](https://github.com/madnessgate44-debug/Amina/actions/runs/43845766404): PASS on the current audit branch head at the time of the run.
- [V] Last full app CI PASS [43843277243](https://github.com/madnessgate44-debug/Amina/actions/runs/43843277243) on an earlier audit-branch revision: `npm run lint`, `npm test` and `npm run build` passed. This was before the latest documentation-only matrix updates.
- [B] Current PR CI on the newer audit branch revision has returned `action_required`; owner approval is required before the latest PR workflow checks can run. Do not represent the earlier PASS as a check on the newest commit.
- [U] Physical-phone walkthrough, visual diagram review and actual learner-teaching verification remain outstanding.

## Open gates

1. [B] Owner merges PR #200 before the Science audit publishing workflow can be exercised from main.
2. [B] Implement and test the missing 34 French Mathematics lesson records and their French teaching plans; mark the four extra French-extract records as unavailable compatibility records.
3. [B] Build the English 26-lesson app curriculum and app-authored teacher guides; correct the Giving Tree record and disable the unsupported Elephantine record.
4. [B] Keep French1 and French2 content separate and unavailable as the school curriculum until the assigned track is verified; do not invent a French StudentBook.
5. [B] Run current-revision lint, tests, build and compliance after app code changes; complete a phone-sized learner walkthrough.
6. [B] No PR merge or production deployment until the owner explicitly approves.

## Repository PR state

- PR #200: French Science source reconciliation; open, mergeable, owner merge gate.
- PR #201: source metadata and lesson/assessment reconciliation for all four subjects; open, mergeable, no merge.
- PR #170: stale French Science Chapter 1 draft; non-mergeable and duplicative.
- PR #179: Arabic language; separate scope.
- PR #180: Arabic Maths; not the French Math request.
- PR #182: Arabic Science; separate scope.
- PR #181: Social Studies; separate scope.
