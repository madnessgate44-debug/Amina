# Amina — Consolidated Project Memory, Decisions, and Forge Work Order

**Purpose:** This is the durable project handoff for Forge and any coding agent working in this repository. Read it before auditing, planning, or changing code. It consolidates the known decisions and requirements from Amina-related conversations; it is **not a verbatim export of every chat message**. If a detail in the live repository contradicts an old status note, inspect the code and report the current evidence rather than assuming the old status is still true.

**Project:** `madnessgate44-debug/Amina`  
**Product:** Amina — Personal AI School Companion  
**Student/curriculum context last explicitly confirmed:** Grade 5, École Girard, Alexandria, 2026–2027, French track. Egyptian curriculum with French-language learning/assessment for Mathematics and Science. Treat this as the current project target unless the owner updates it.

---

## 1. Product vision — locked

Amina is a **personal AI School Companion**, not a conventional LMS, school administration system, or generic chatbot.

The experience should feel like a polished, modern, visual, mobile-first learning product: smooth, engaging, game-like, and age-appropriate without feeling childish. Do not expose internal pedagogical or engineering terminology to the child.

Primary navigation is locked to:

- **HOME** — today's learning, schedule, priorities, progress, and next useful action.
- **FEED** — a real, full-screen, vertically swipeable stream of educational learning items.
- **LIBRARY** — the student's real curriculum, digital books, lessons, saved content, notes, and folders.
- **NOUR** — Miss Nour, the AI teacher and the front door to learning.

Other capabilities belong inside these primary areas or in contextual flows. Do not add parallel top-level products or duplicate systems.

## 2. One connected School Brain

The product must operate as one coherent loop:

**School → Curriculum → Daily Plan → Teaching → Practice → Homework → Review → Mastery/Evidence → Next Action**

All entry points should connect to the same student context and the same learning state. Do not create separate teacher, curriculum, feed, mastery, homework, or review engines that disagree with one another.

- Miss Nour is the common teaching interface regardless of where the student starts.
- Amina must be able to select **any available curriculum lesson** and start the same genuine adaptive Miss Nour session for that lesson.
- Home, Feed, Library/books, homework, review, games, saved content, and progress should hand context into Nour rather than opening disconnected experiences.
- Learning evidence should influence the next action, practice, review timing, and explanations.
- Preserve existing working architecture and features. Extend and connect them; do not restart the design or replace working systems without evidence and a specific reason.

## 3. Miss Nour — required teaching loop

Nour is contextual, adaptive, and preferably voice-first. The target learning loop is:

1. **Context** — identify the selected lesson, curriculum objective, prior evidence, recent mistakes, and relevant homework/review.
2. **Diagnose** — determine what the student understands and where the misconception or gap is. Do not merely assign a fixed diagnosis based on the subject name.
3. **Choose a teaching strategy** — adapt the explanation to the student's actual response and reasoning.
4. **Teach** — give a clear, age-appropriate explanation grounded in the real lesson and curriculum.
5. **Practice** — ask targeted questions and provide useful, varied practice.
6. **Analyze reasoning** — inspect the student's answer and reasoning, not only whether the final answer is correct.
7. **Recheck/adapt** — change the explanation or difficulty when evidence shows that the student has not understood; do not repeat an identical question as the only recovery strategy.
8. **Verify outcome** — establish what the student can now do and record evidence. Do not report mastery merely because a session or quiz ended.
9. **Next action** — recommend the next lesson, retry, homework step, or spaced review based on evidence.

The loop must have real terminal outcomes and handle partial understanding, repeated mistakes, interruptions, and resuming a session. Internal terms such as diagnosis, mastery, and evidence are implementation concepts; present child-facing language naturally.

Voice should be a first-class interaction, not a decorative microphone. Preserve usable text interaction and accessibility when voice is unavailable.

## 4. FEED — a hard acceptance requirement

A real educational Feed is mandatory. Previous discussions explicitly called out that Feed/reels were still absent after a prior Phase 4 effort; do **not** assume the requirement is met because a route, tab, placeholder, or architecture exists.

The Feed must be a purposeful, full-screen, vertically swipeable experience containing curriculum-connected items such as:

- Short lessons, visual explanations, and educational reels/micro-lessons.
- Quick quizzes, practice questions, and misconception-focused challenges.
- Textbook/lesson prompts and useful homework or review actions.
- Follow-up content selected from the student's current school plan, learning gaps, and prior evidence.
- Actions to open the item in Nour, continue learning, save it, or revisit it.

Feed content must be educationally relevant and connected to the real curriculum and student state. Avoid a generic social-media feed, filler cards, fake content, or a scrollable list falsely presented as reels. Saving an item should connect to the Library/saved-content system, not a duplicate store.

**Acceptance test:** From the actual running app, a student can open FEED, swipe vertically through multiple meaningful learning items, interact with them, and launch a contextual Nour session or save/revisit the item. Verify implementation and runtime behavior, not just component existence.

## 5. Curriculum, books, and lesson selection

- Support the actual target curriculum: Egyptian curriculum for the specified French-track context, with Mathematics and Science taught/assessed in French as agreed.
- Use real curriculum structure and actual available digital books/lesson content. The student should be able to see and access all available subjects and full books, not an arbitrary truncated subset.
- Do not fabricate curriculum lessons, book contents, timetable entries, or curriculum coverage to make the UI appear complete.
- Do not introduce a second, parallel curriculum or teacher system.
- Selecting a lesson from the curriculum/library must start the shared Nour flow with the selected lesson's context.
- Keep curriculum language and subject labels consistent with the student's actual track and the source material.
- If a real source/book is missing, unavailable, or not yet integrated, state the limitation and expose a truthful state; do not silently substitute demo material.

## 6. HOME, planning, homework, review, and progress

HOME should provide a clear, useful daily entry point, including the relevant schedule, planned learning, due work, progress, and next action, all sourced from the same student/curriculum state.

Requirements discussed:

- A real timetable/schedule, not hardcoded demo entries.
- Complete subject coverage; do not arbitrarily cap the displayed subjects at four.
- Integrated homework and planner context, including photo/handwriting submission and correction where supported by the current architecture.
- Spaced review based on actual learning evidence and due review items, not hardcoded subject names.
- Progress and mastery claims supported by recorded evidence.
- Persistent continuation/resume so the student can return to an interrupted lesson or practice.
- Games/challenges should serve learning objectives and feed their evidence back into the same learning loop.
- Like/save/folders/notes and saved content should be connected to the Library rather than isolated implementations.

## 7. Historical audit findings — leads to re-verify, not assumptions

These are historical findings from earlier audits and may already have changed. Forge must check the current default branch and report the exact current status with file/line/test evidence.

### Audit around commit `695b713` (reported 2026-10-06)

Reported strengths:
- Curriculum service integrated.
- Adaptive quiz/retry and mastery evidence substantially working.

Reported gaps:
- Demo timetable.
- Subject list truncated to four.
- Hardcoded subject names in spaced review.
- `demo_student` fallback.

### Audit around commit `fc7fdf0` (reported 2026-10-07)

Reported strengths:
- Teacher context and Home → Nour handoff working.

Reported gaps:
- Diagnosis hardcoded by subject.
- Student reasoning captured but not actually analyzed.
- Terminal outcomes and the full adaptive loop incomplete.
- Fake student fallback.
- Arabic lesson fallback despite the target French-track context.
- Demo timetable and hardcoded review-subject fallbacks.

### Phase 4 / later product review (reported 2026-10-08)

- Architecture/navigation/intelligence had been upgraded.
- The actual FEED/reels experience was still missing.
- Acceptance was therefore **not passed**.
- A locked requirement was confirmed: choose any curriculum lesson and begin the same genuine adaptive Miss Nour session.

Do not repeat these findings as current facts until verified. Search the current code, tests, assets, and runtime behavior.

## 8. Token/cost and implementation constraints

The owner uses limited/free AI tooling and has previously exhausted the Google AI Studio free quota. Keep agent/model token use and unnecessary iteration low.

- Inspect before editing; use targeted searches and relevant file reads instead of dumping the whole repository into context.
- Reuse the current architecture and existing components/services.
- Prefer one coherent, minimal integration pass over multiple overlapping rewrites.
- Do not rebuild settled features, duplicate implementations, or perform unrelated refactors.
- Avoid unnecessary new dependencies and paid services.
- Consolidate changes per file; do not repeatedly rewrite the same file in separate passes.
- Do not claim success based on a prompt, design, route, placeholder, mock, or static code alone. Run relevant tests and verify the actual behavior where possible.
- Keep all changes reviewable and report costs/limitations if an external model, API, or data source is required.

## 9. Forge work order

Forge: execute the following in order. The purpose is to make Amina usable and sellable while preserving existing work.

### Phase A — establish facts (read-only)

1. Read this file completely.
2. Inspect the current default branch, project instructions, app entry points, navigation, data models/services, curriculum/book data, Nour/teaching flow, Feed, tests, and existing documentation.
3. Establish the current commit and working state. Do not assume the historical commits above are current.
4. Run the available existing checks/tests before making changes, recording exact commands and results.
5. Produce a **requirements-to-evidence matrix** with one row per requirement in this document:
   - Requirement ID
   - Acceptance criteria
   - Current status: PASS / PARTIAL / FAIL / BLOCKED / NOT VERIFIED
   - Evidence: exact file path, symbol/component, and line range when available
   - Test/runtime evidence
   - Gap and minimal fix
6. Specifically verify FEED on the real app, all available subjects/books, lesson-to-Nour handoff, adaptive reasoning analysis, real timetable, student identity/fallback behavior, and evidence-backed review/mastery.
7. Identify blockers requiring owner input separately. Do not ask the owner to repeat information already recorded here.

### Phase B — plan and implement gaps

8. Preserve working behavior. Do not replace the app or redesign the architecture from scratch.
9. Prioritize gaps in this order:
   1. Data integrity and truthful student/curriculum/book/schedule context (remove misleading demo/fake fallbacks where they affect real use).
   2. Genuine FEED experience and its integration with Nour and Library.
   3. Any-lesson → shared adaptive Nour session, including reasoning analysis and verified outcomes.
   4. Complete curriculum/subject/book visibility and consistent French-track content.
   5. HOME, homework/planner, spaced review, persistence, saved content, and progress integration.
   6. Product polish and remaining usability issues.
10. For each proposed code change, map it to a requirement and acceptance test. Prefer the smallest set of edits that closes multiple related gaps without coupling unrelated features.
11. Work on a dedicated branch and open a reviewable pull request. **Do not merge** and do not deploy without explicit owner approval. Do not modify unrelated projects.
12. Do not fabricate data or claim unsupported features are complete. Where external curriculum content or credentials are missing, report the blocker and implement only truthful, safe behavior.

### Phase C — verify and report

13. Run lint, type checks, build, existing tests, and new targeted tests supported by the repository.
14. Add scenario-specific tests for the real student journey, especially:
    - Open FEED → swipe through multiple curriculum-connected items → interact → open contextual Nour or save to Library.
    - Open any available curriculum lesson → enter Nour with correct lesson/student context → diagnose → teach → practice → analyze reasoning → recheck → record a supported outcome → schedule a next action.
    - Open Library → access all available subjects/books → select a lesson → continue through the same Nour flow.
    - HOME displays actual schedule/subjects and due work; review selection is based on evidence rather than hardcoded subject names.
    - Interrupted sessions can resume without losing context.
15. Report each requirement as PASS / PARTIAL / FAIL / BLOCKED / NOT VERIFIED, with evidence and test results. Distinguish static tests from browser/runtime verification.
16. List changed files and why each changed; list unresolved risks and owner decisions; provide the PR link and exact verification status.
17. Do not mark the product “sellable” merely because the build passes. Identify product-critical blockers and distinguish release readiness from code-test success.

## 10. Non-negotiable rules

- **No rebuild from scratch.**
- **No merging or deployment without approval.**
- **No fake curriculum, fake student identity, demo timetable, or unsupported mastery claims presented as real.**
- **No duplicate/parallel teacher, curriculum, Feed, saved-content, review, or mastery systems.**
- **FEED is a real product requirement, not optional polish.**
- **Do not treat historical audit notes as current facts without verification.**
- **Evidence before claims.** Every “done” claim must point to code and/or a test/runtime result.
- If a requirement is blocked, explain exactly why and what minimum input/access is missing; continue with independent work where safe.

## 11. Decision history and continuity

The following decisions were explicitly established in Amina conversations in early October 2026 and must remain in force unless the owner changes them:

- Amina is a Personal AI School Companion, not an LMS.
- Primary navigation: HOME | FEED | LIBRARY | NOUR.
- Miss Nour is the common teaching interface and front door to learning.
- One School Brain and one connected curriculum-to-learning-to-evidence loop.
- The student can choose any available curriculum lesson and start the same adaptive Nour session.
- The real FEED is a full-screen vertical educational/reels experience; its absence means acceptance has not passed.
- Real curriculum/books and all available subjects must be accessible; no fabricated curriculum or parallel systems.
- Learning should be visual, engaging, mobile-first, and not childish.
- Voice is first-class; reasoning should be analyzed; learning outcomes must be verified.
- Homework, planning, review, games, saved items, notes, folders, progress, and next actions must integrate with the same student state.
- Keep implementation token-efficient, inspect the repo first, preserve settled work, and prove changes with tests/evidence.

**Forge's immediate next action:** begin Phase A now, using the current repository state. Do not stop after reading this document or return only a generic plan; complete the evidence-based audit, then implement the minimal safe fixes on a branch and open a PR without merging.
