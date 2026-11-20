# OpenHands Master Execution Order
## Miss Noor — Grade 5 Full-Year Curriculum Completion Programme

**Status:** Authoritative execution brief  
**Version:** 1.0  
**Repository:** `madnessgate44-debug/Amina`  
**Academic year:** 2026–2027  
**Target:** Complete, source-verified, functional Grade 5 learning experience for the entire applicable academic year.

> This document consolidates the project brief, execution plan, acceptance criteria and OpenHands prompt into one source of truth. It supersedes informal or fragmented instructions about this programme. Read it before making changes. Do not interpret this document as evidence that any subject is already complete.

---

# 1. Mission and authority

You are the primary implementation agent for Miss Noor's Grade 5 full-year curriculum completion.

Your assignment is to inspect the actual repository, establish the complete applicable curriculum, compare it with the application, implement missing curriculum and product functionality, test the result, and leave reviewable evidence in GitHub.

This is an implementation assignment, not an audit-only assignment and not a request to generate lesson records in bulk.

**The objective is the whole academic year, not only Term 1, not only Science, and not only the subjects that already have substantial data.**

Work autonomously through ordinary implementation decisions. Do not repeatedly ask the user to restate requirements or approve routine work. If a genuine external decision, inaccessible source, credential, or infrastructure dependency blocks an item, record the exact blocker and continue with all independent work.

## Authority boundaries

- Work only in this repository: `madnessgate44-debug/Amina`.
- Follow repository instructions, security rules, existing architecture and the scope below.
- Make small, reviewable changes on dedicated branches and submit pull requests.
- Do not merge or deploy. Independent acceptance and release approval remain separate from implementation.
- Do not add paid services, paid infrastructure, or new external dependencies requiring payment without explicit approval.
- Do not commit secrets, credentials, private student information, private transcripts, or identifying information about a child.
- Do not claim that a task was completed unless the required evidence exists.
- Preserve passing behavior and avoid unrelated rewrites.

# 2. Academic scope: discover the actual full-year requirements

Cover the complete 2026–2027 Grade 5 academic year: both terms, all required units, lessons, learning objectives, assessments and applicable language tracks.

The following is the initial discovery checklist, not a closed list. Verify it against the actual applicable school booklist, official curriculum and school language-track requirements:

- Arabic.
- English.
- French 1 (first-language French).
- French 2 (second-language French).
- Mathematics.
- Science.
- Social Studies.
- ICT / Computer Studies.
- Religious Education (the applicable Islamic or Christian programme).
- Any other subject shown to be required by the official school programme or booklist.

**French 1 and French 2 are separate requirements.** Do not merge them, substitute one for the other, or infer that one track covers the other.

For Mathematics, Science, ICT and every other subject, establish the actual teaching language for each applicable track. Never silently route French instruction through English or Arabic.

Record subjects that are not applicable only when supported by the actual school programme, with the reason and evidence.

# 3. Source authority and provenance

Establish and maintain a source register before reconstructing curriculum content.

Use this source hierarchy:

1. Official Egyptian Ministry of Education 2026–2027 student textbooks.
2. Official Ministry teacher guides, curriculum specifications and assessment documents for the same year.
3. Official school-provided booklists and written requirements identifying the applicable programme and language tracks.
4. Other verified school materials that clarify a specific requirement.
5. Secondary sources only as discovery aids or corroboration; never present them as official primary-source evidence.

For every source, record:
- Exact title and subject.
- Issuing authority / publisher.
- Academic year and term.
- Language and applicable track.
- Original URL or repository/file location.
- Relevant page numbers, only after inspecting those pages.
- Access date.
- Inspection status: inspected, partially inspected, inaccessible, or unverified.
- Any limitations or conflicting editions.

A search-result snippet, book index, third-party summary, filename, or link alone does not prove that the underlying textbook was inspected.

Never invent:
- Official content or Ministry requirements.
- Unit, lesson, or textbook page numbers.
- Teacher-guide statements.
- Source quotations or provenance.
- A claim that a document was read when it was not.

If an official source is inaccessible, try reasonable official access routes and record the exact URL, retrieval failure, attempts, and missing evidence. Keep the affected curriculum item `[BLOCKED]` or `[UNPROVEN]`; do not silently substitute an unverified source and mark it complete.

Respect copyright. Do not reproduce entire textbooks or large protected passages. Build original, age-appropriate teaching explanations and exercises grounded in verified source objectives, with accurate attribution and limited quotations where necessary.

# 4. Required curriculum inventory and coverage audit

For every subject, term, unit, lesson and learning objective, create a traceable inventory entry.

Each entry must include, as applicable:

- Stable curriculum item ID.
- Subject and academic year.
- Term, unit, lesson and objective.
- Applicable language and track.
- Official source ID and exact page reference, if verified.
- Existing application lesson ID(s).
- Existing content status.
- Required implementation work.
- Teaching-content completeness.
- Exercise and answer-key status.
- Runtime/functionality status.
- Test evidence.
- Blockers and notes.
- Evidence status.

Use these classifications consistently:

- `COMPLETE`: all defined content and functional acceptance checks pass with evidence.
- `PARTIAL`: some required content or behavior exists, but one or more requirements remain.
- `MISSING`: no adequate implementation exists.
- `WRONG_LANGUAGE`: instruction does not match the required track.
- `INCORRECT`: existing content conflicts with verified source requirements.
- `NONFUNCTIONAL`: learner cannot complete the expected application flow.
- `SOURCE_UNVERIFIED`: source mapping or content provenance is not established.
- `NOT_APPLICABLE`: excluded only with documented school-programme evidence.
- `BLOCKED`: a specific external dependency prevents verification or implementation.

Do not use lesson counts, registry population, media counts, or the existence of TypeScript objects as proxies for curriculum completeness.

Compare the actual textbook inventory against the actual application lesson-by-lesson. Identify missing, partial, duplicated, incorrectly mapped, wrong-language and nonfunctional items.

# 5. Teaching-content acceptance standard

Every required lesson must be a genuine Grade 5 teaching experience, not a title, narration-only record, placeholder, or generic paragraph.

For each lesson, implement the elements appropriate to its subject and learning objective:

1. Clear learning objectives.
2. Prerequisite knowledge or a short readiness check where useful.
3. Accurate, age-appropriate explanation.
4. Worked examples or demonstrations.
5. Diagrams, illustrations, audio or practical activities where they materially help learning.
6. Guided practice.
7. Independent exercises.
8. Correct answers and meaningful explanations.
9. Common misconceptions and correction/remediation.
10. Revision or mastery check.

Subject-specific requirements:
- Mathematics: worked methods, varied problems, answer evaluation and explanations of errors.
- Science: accurate concepts, observations, activities and safety guidance where relevant; preserve the source's intended activity and conditions.
- Languages: reading/listening/speaking/writing and grammar or vocabulary practice as required by the verified curriculum.
- Social Studies: accurate concepts, map/diagram interpretation and source-grounded questions where appropriate.
- ICT: practical, age-appropriate tasks that can actually be completed or safely simulated in the application.
- Religious Education: follow only the applicable programme and source materials; do not assume the student's religion.

Clearly distinguish:
- Verified official learning objective/source requirement.
- Original Miss Noor explanation.
- Original app-authored exercise or assessment.
- Teacher-guide-derived guidance, if actually inspected.

An original exercise may teach a verified objective, but it must not be labelled an official textbook exercise unless it is one and the source confirms it.

# 6. Product and teaching-engine requirements

Miss Noor is the student's teacher, not merely a curriculum catalogue or dashboard.

Inspect the current architecture before changing it. Reuse and improve existing components where appropriate.

The student must be able to:
- Find a subject, term, unit and lesson.
- Open every published lesson reliably.
- See a clear loading state during session initialization.
- Receive a useful error state if a lesson cannot load.
- Retry after recoverable errors.
- Learn the lesson content in the correct language.
- Complete guided and independent exercises.
- Receive correct, meaningful feedback.
- Retry incorrect answers and access remediation.
- Complete a lesson or assessment.
- Retain progress across navigation and reloads, subject to the application's supported storage/authentication model.
- Return to the correct place without a dead end.

Test and repair:
- Curriculum registry and lesson resolution.
- Lesson launch and session initialization.
- Missing lesson and missing student handling.
- Loading, error, retry and recovery states.
- Storage/network failures and persistence.
- Exercise rendering and answer evaluation.
- Scoring, completion and mastery logic.
- Progress restoration.
- Navigation and back behavior.
- Language routing and localized content.
- Arabic RTL layout and text direction.
- French and English rendering.
- Mobile viewport and touch interactions.

A lesson data record is not proof of a working lesson. A button that appears clickable but opens a blank screen, silently returns, or shows the wrong language is a failed learner flow.

Do not treat schema existence, static source inspection, or passing unit tests alone as proof of end-to-end student functionality. Combine appropriate automated tests with actual runtime or browser verification where available. If runtime verification is unavailable, state that limitation.

# 7. Miss Noor visual and student experience

Maintain the established product direction:
- Deep purple, warm cream and gold.
- Arabic-first interaction and correct RTL.
- Mobile-first layout, with 390 × 844 as a useful reference viewport.
- A recognizable, consistent, warm teacher-like Miss Noor character.
- A distinctive conversational speech-bubble treatment.
- Clear subject identity and purposeful illustrations.
- Accessible touch targets, readable typography and clear navigation.

Review at minimum:
- Home.
- Feed.
- Classroom.
- Library.
- Homework.
- Lesson/session.
- Assessment/results.

The experience should feel like a real teacher guiding a child through learning, not a generic admin dashboard.

Do not invent that a particular face, age, hair, hijab, clothing, or portrait has been approved if no approved reference exists. Preserve the existing character identity unless a clearly approved reference or direction is present. Implement the visual system and interaction improvements that can be supported by the repository and agreed direction; flag identity-specific design decisions that genuinely require user input.

# 8. Execution phases and deliverables

## Phase 0 — Repository and system baseline
- Read `AGENTS.md` and all applicable repository instructions.
- Inspect current `main`, record exact HEAD SHA and working baseline.
- Inspect curriculum data, source files, lesson/session engine, language routing, UI, tests, workflows, deployment configuration and active PRs/issues.
- Distinguish merged code from unmerged proposals.
- Record current defects and reusable components.

**Exit:** Actual repository baseline documented; no assumptions treated as facts.

## Phase 1 — Full-year source inventory
- Discover every required subject and language track.
- Inspect official 2026–2027 sources for both terms.
- Inventory all books, units, lessons and objectives.
- Record page references only when verified.

**Exit:** Every required item has a verified source mapping or an explicit blocker.

## Phase 2 — Application coverage and gap analysis
- Map each inventory item to actual app lesson IDs and implementation.
- Inspect content and runtime paths.
- Classify each item using the statuses in Section 4.
- Identify dependencies and priorities.

**Exit:** Every curriculum item has a traceable status and concrete next action.

## Phase 3 — Curriculum completion
- Implement missing and incomplete teaching content.
- Correct inaccurate, duplicated, or incorrectly mapped content.
- Keep source-derived requirements separate from original teaching material.
- Work through every subject and both terms; do not stop after the first subject or first term.

**Exit:** All required items have complete teaching content or documented external blockers.

## Phase 4 — Teaching engine and application reliability
- Repair lesson launch, session lifecycle, language routing, exercises, feedback, persistence and recovery.
- Add regression and integration tests.
- Verify actual student flows.

**Exit:** Required learner flows pass, or any remaining limitation is explicitly documented and prevents acceptance.

## Phase 5 — Visual and student experience
- Complete the agreed visual system and character-led experience.
- Verify all required screens on mobile.
- Check accessibility, RTL and language variants.

**Exit:** The complete student experience is coherent, usable and verified.

## Phase 6 — Testing and evidence
Run the repository's actual applicable:
- Lint and formatting checks.
- Unit tests.
- Integration tests.
- Curriculum data integrity tests.
- Lesson completeness and source traceability tests.
- Language/track tests.
- RTL tests.
- Lesson-launch tests.
- Exercise and answer-evaluation tests.
- Progress persistence tests.
- Mobile/student-flow tests.
- Production build.
- CI and compliance workflows.

Inspect the actual workflow run results and logs. Report exact commands, run IDs/links where available, pass/fail/skip status, and relevant limitations. Do not say a check passed merely because it was started or because a different check passed.

**Exit:** Required checks pass with evidence; skipped or unavailable checks remain explicitly unverified.

## Phase 7 — Pull requests and release handover
- Submit reviewable PRs with scope, evidence, tests, risks and rollback considerations.
- Keep PRs focused; avoid one enormous unreviewable change.
- Do not merge or deploy.
- Prepare a release report with exact accepted commits, test evidence, outstanding blockers and deployment steps.
- Independent reviewer decides whether to merge and release.

**Exit:** Implementation is ready for independent acceptance. Full project completion is not declared until the independent acceptance and production verification have actually occurred.

# 9. Required evidence labels

Use these labels in every progress report and acceptance document:

- `[VERIFIED]`: directly supported by inspected source, code, test output, workflow, or runtime evidence.
- `[HYPOTHESIS]`: plausible explanation not yet confirmed.
- `[UNPROVEN]`: claim or requirement for which evidence is not yet available.
- `[BLOCKED]`: specific external dependency prevents progress or verification.
- `[FAILED]`: a check or acceptance requirement was attempted and did not pass.

Do not upgrade a status without new evidence. A CI-green documentation-only PR does not prove curriculum or learner functionality.

# 10. Required repository records

Create and maintain these records. If a file already exists, inspect and update it rather than creating a conflicting duplicate.

1. `docs/reports/GRADE_5_FULL_YEAR_CURRICULUM_ACCEPTANCE.md` — authoritative subject/term/unit/lesson acceptance matrix.
2. `docs/curriculum/GRADE_5_SOURCE_REGISTER.md` — official source register and access evidence.
3. `docs/curriculum/GRADE_5_FULL_YEAR_INVENTORY.md` — full-year subject, term, unit, lesson and objective inventory.
4. `docs/curriculum/GRADE_5_GAP_ANALYSIS.md` — application-to-source gap analysis.
5. `docs/plans/GRADE_5_COMPLETION_PROJECT_PLAN.md` — phased execution plan, dependencies and progress.
6. `docs/reports/GRADE_5_VERIFICATION_EVIDENCE.md` — test, CI, runtime and source-verification evidence.
7. `docs/reports/GRADE_5_RELEASE_REPORT.md` — release readiness, accepted commits and production verification.

This master execution order is the entry point. Link the above records from it and keep their statuses consistent. Do not fabricate a completed inventory to satisfy a filename requirement.

# 11. Checkpoint reporting and handover

At every meaningful checkpoint, update repository records and report:

1. Current branch and exact HEAD SHA.
2. Latest main SHA observed.
3. Subjects, terms and tracks inventoried.
4. Subjects, terms and tracks completed.
5. Missing, partial, wrong-language, incorrect and nonfunctional items remaining.
6. Source documents inspected and inaccessible sources.
7. Actual files changed.
8. PR links and review/merge status.
9. Exact tests/commands run and results.
10. Workflow run links and failed/skipped checks.
11. Runtime/browser evidence and limitations.
12. Blockers requiring external action.
13. Next concrete implementation actions.

Leave enough detail in GitHub for another agent to continue without the user relaying messages. Keep the work log current and include links to commits, PRs, workflow runs and evidence.

Do not stop after the audit. Do not stop after one subject. Continue through all independent work until the entire scope is implemented or each remaining item has a specific, evidence-backed blocker.

# 12. Definition of done — no exceptions

The programme may be declared complete only when all of the following are true:

- Every subject required by the actual school programme is accounted for.
- Both academic terms are accounted for.
- Every applicable language track is separately accounted for, including French 1 and French 2.
- Every required textbook unit, lesson and learning objective is mapped to evidence.
- All required lessons contain complete, accurate, age-appropriate teaching experiences.
- Official-source requirements and original app-authored content are distinguished.
- No required lesson silently teaches in the wrong language.
- Lesson launch, exercises, evaluation, feedback, retry, remediation and progress persistence work.
- Arabic RTL and all applicable language experiences work.
- Required mobile student journeys pass verification.
- Required automated checks and production build pass, with skips and limitations disclosed.
- Changes have passed independent review and been merged under the release process.
- Production deployment is verified against the accepted commit.
- The acceptance matrix contains evidence for every item.

**A partial subject, Term 1-only coverage, populated registry, lesson count, green documentation check, passing build, or successful deployment does not equal full-year curriculum completion.**

If any required item remains `PARTIAL`, `MISSING`, `WRONG_LANGUAGE`, `INCORRECT`, `NONFUNCTIONAL`, `SOURCE_UNVERIFIED`, `UNPROVEN`, `BLOCKED`, or `FAILED`, the overall programme must not be marked complete.

---

# 13. Immediate instruction — start now

1. Read this document and the repository's engineering instructions.
2. Inspect actual `main` and record its current SHA; do not rely on the baseline SHA written in a prior conversation.
3. Inspect existing project documents and open PRs, including whether previous work is merged, draft, stale or superseded.
4. Establish the full-year inventory and source register before claiming coverage.
5. Update the acceptance matrix with the true current state, including subjects previously believed complete but not proven.
6. Begin implementation with the highest-impact verified gaps while continuing the full-year inventory.
7. Create focused PRs and add tests/evidence.
8. Continue autonomously through all phases. Do not ask the user to repeat this order.

The user has separately arranged a recurring independent progress audit. Keep repository progress evidence current so that the audit can inspect actual work. Do not claim that the auditor or user has approved your changes.

**Final instruction: build the complete, source-faithful, functioning Grade 5 year. Never optimize for the appearance of progress. Optimize for a child being able to learn the entire required curriculum correctly in Miss Noor.**
