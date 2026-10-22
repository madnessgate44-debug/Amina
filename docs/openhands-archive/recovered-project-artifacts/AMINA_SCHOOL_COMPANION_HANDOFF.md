# Amina / School Companion — Product & Implementation Handoff

**Purpose:** This document is the source-of-truth handoff for a new ChatGPT chat working on the Amina app. It captures what we agreed the product must become, what already exists conceptually, what must be audited, and the implementation order.

## 1. Product North Star

The app starts with **Amina** and must ultimately become a general **School Companion** for any student.

> **Amina should feel like she has a personal teacher who knows her school, knows what she has learned, knows what she needs next, remembers her mistakes, helps her with homework, prepares her for exams, and gets smarter about teaching her over time.**

This is **not**:
- a generic chatbot
- a static curriculum browser
- a dashboard/accounting app
- a collection of disconnected games, reels, quizzes, and tools
- an app that only optimizes the first 30 seconds while the underlying learning system is incomplete

The requirement is a **fully functioning School Companion**.

---

# 2. Core Product Model

The central architecture is:

**Student + School + Curriculum → School Brain → Nour → Activity → Response → Assessment → Mastery → Next Action**

Everything the student sees should ultimately be coordinated through this loop.

## 2.1 Nour — the virtual teacher

**Nour is the front door of the app and the student's real teacher/guide.**

Nour must have persistent, structured awareness of:

- student identity
- grade/year
- school/class context
- subjects
- weekly timetable
- today's lessons
- curriculum progression
- books and teacher materials where available
- homework
- unfinished work
- exams and exam schedule
- learning history
- topic-level mastery
- weaknesses
- recurring mistakes
- previous explanations/interactions
- student preferences and behavior
- current study plan
- what has already been completed
- what should happen next
- available time and practical constraints
- fatigue/attention signals where the system can infer them safely
- parent constraints/settings where relevant

Nour should **not** be a thin chat UI sitting beside disconnected features. Nour must be connected to the School Brain and orchestration layer.

---

# 3. School Brain

The **School Brain** is the authoritative intelligence/data layer behind Nour.

It should unify:

1. Student profile/state
2. School/class information
3. Curriculum
4. Teacher/material references
5. Timetable/calendar
6. Homework
7. Exams
8. Learning activity history
9. Assessment results
10. Topic mastery
11. Weaknesses and recurring errors
12. Review schedule
13. Current plan
14. Orchestration / next-action logic

The School Brain must answer questions such as:

- What should this student be learning now?
- What did she learn at school today?
- What homework is due?
- What remains unfinished?
- What does she understand?
- What does she repeatedly get wrong?
- What needs review today?
- What is coming in the exam schedule?
- What is the best next activity?
- Should Nour explain, demonstrate, quiz, practice, review, assign a game, inspect homework, or move on?

---

# 4. Curriculum Must Be Authoritative

The app must cover the **full syllabus from the beginning to the end of the school year**, not just sample lessons.

For Amina, the current starting context is **Grade 5 Primary at Girard**.

The curriculum layer should ultimately be able to represent:

- year/grade
- term
- subject
- unit
- lesson
- concepts/topics
- prerequisites
- exercises/questions
- revision points
- exam relevance
- available book/reference material
- teacher guidance/material where available
- progression/order

### Critical current issue

The existing repository has a file named:

`src/data/demoCurriculum.ts`

We must **not blindly delete it**.

First determine its dependency graph and determine:
- what imports it
- what production screens depend on it
- whether it is mock/demo-only
- whether any real curriculum data already exists elsewhere
- what must replace it

The objective is to eliminate the **demo-vs-production curriculum split** and establish one authoritative curriculum source.

---

# 5. School-Day Awareness

The app should know the student's school rhythm.

It should support:

- weekly timetable
- today's classes
- what happened at school today
- homework assigned today
- due dates
- unfinished work
- upcoming exams
- curriculum progression

After school, the app should reconstruct the student's current situation and generate an adaptive study plan.

A previous target was approximately **2–3 hours of personalized study**, but the actual duration should be driven by the student's workload, school day, priorities, and available time rather than forcing a fixed amount.

---

# 6. Adaptive Daily Plan

The app should not simply present a static list of subjects.

The plan should be generated from:

**Today's school activity + homework + unfinished work + weak topics + scheduled review + upcoming exams + curriculum position + student state**

The system should decide the appropriate sequence.

Example decision logic:

1. Urgent homework
2. Same-day recall/retrieval
3. Important weak topic
4. Spaced review
5. Exam preparation
6. Practice/application
7. Optional enrichment when appropriate

The exact order must be determined by the School Brain rather than hard-coded blindly.

---

# 7. Learning Experience

The existing/desired learning modes include:

- short explanations / reels
- lessons
- demonstrations
- questions
- quizzes
- games
- tasks
- practice
- revision
- retrieval exercises
- homework help
- exam preparation

These are **learning instruments**, not separate products.

Nour/School Brain should choose the right instrument based on the student's current need.

For example:

> Student is weak at fractions → Nour explains → gives a worked example → asks a question → assesses response → identifies the exact misconception → gives targeted practice → reassesses → updates mastery → schedules review.

---

# 8. Assessment → Mastery → Next Action

This loop is mandatory.

**Teach → Student Response → Assess → Update Mastery → Decide Next Action**

Assessment must be more useful than simply marking right/wrong.

Track, where meaningful:

- topic mastery
- confidence
- recurring mistakes
- misconception/error type
- difficulty handled
- response quality
- progress over time
- review need

Mastery must actually influence future teaching.

A score stored in one screen but ignored by the teacher is not a functioning mastery system.

---

# 9. Homework Intelligence

Homework is a core part of School Companion.

Support:

### Typed homework
- student types work
- Nour checks it
- explains mistakes
- gives a retry
- records learning result

### Photo homework
- student photographs the page
- app reads/understands the work
- identifies questions and answers
- checks the student's work
- explains errors
- supports retry

### Handwriting
Handwriting should be supported where practical.

The app should be able to:
- read handwriting from an image
- assess the academic answer
- identify writing/handwriting issues where possible
- give guidance for improvement
- retain the learning result

The goal is **not** to force every activity into handwriting. The app should combine phone-based interaction with meaningful written work.

Homework results must feed back into mastery and future planning.

---

# 10. Full-Year Knowledge System

The system should eventually ingest/use the appropriate school knowledge for each subject, including where available:

- official curriculum
- student textbooks
- teacher guides
- lesson sequences
- exercises
- reference material

The system should distinguish between:
- authoritative curriculum facts
- explanatory teaching content
- generated practice
- student-specific state

The product should be able to move through the curriculum from start to finish instead of operating from a small hand-authored demo set.

---

# 11. Parent Mode

Parent mode is secondary to the student's experience, but it is required.

Parent mode should eventually provide:

- study completion
- remaining work
- homework status
- progress
- weak subjects/topics
- exam preparation status
- important learning issues
- meaningful trends

It should expose useful information without turning the student app into a parent dashboard.

The child/student experience remains primary.

---

# 12. Existing App Capabilities to Audit and Reuse

The current Amina app has previously been identified as having concepts/components including:

- React/Vite frontend
- Express/backend elements
- Gemini integration
- IndexedDB/local persistence
- Arabic/English support
- Grade 5 Term 1 curriculum
- teaching-session escalation
- missions
- quizzes
- homework
- reviews
- mastery
- voice
- parent PIN/dashboard
- timetable/day reconstruction

These should **not automatically be rebuilt from scratch**.

The first job is to determine:
- what actually works
- what is demo
- what is production
- what is duplicated
- what is disconnected
- what can be retained
- what must be refactored
- what must be replaced

---

# 13. NON-NEGOTIABLE FIRST STEP: FORENSIC REPOSITORY AUDIT

**Do not start coding during the audit.**

Before changing files, inspect the real repository.

The audit must answer:

1. What exists?
2. What actually works?
3. What is only demo/mock?
4. What is the current authoritative curriculum source?
5. What stores student state?
6. What persists between sessions?
7. How does Nour currently work?
8. What context does Nour receive?
9. How are lessons/reels generated?
10. How are games generated/selected?
11. How are quizzes generated/selected?
12. How is homework handled?
13. How is assessment performed?
14. Is assessment connected to mastery?
15. Is mastery connected to future teaching?
16. How is the timetable represented?
17. How is the daily plan created?
18. How are exams represented?
19. What is duplicated?
20. What is disconnected?
21. What is hard-coded?
22. What is demo-only?
23. What is missing?
24. What can be reused?
25. What must change?
26. What must only be removed after dependency analysis?

### Important

Do not assume that a file called `demoCurriculum.ts` is safe to delete.

Trace dependencies first.

---

# 14. Professional Execution Model

The project should be handled as:

**Inspect → Specify → Implement → Verify**

For every implementation task:

1. Identify exact files.
2. Inspect current code/behavior.
3. State the current behavior.
4. State required behavior.
5. Identify dependencies.
6. Specify the change.
7. Implement.
8. Run/perform verification.
9. Check for regressions.
10. Review the resulting repository state.

No blind rewrites.

No deleting files merely because their names look obsolete.

No assuming a feature works because a button exists.

---

# 15. Responsibility Split

### ChatGPT
Acts as:
- Product Manager
- System Architect
- Auditor
- Specification writer
- QA/review layer
- GitHub/repository coordinator where access is available
- Prompt engineer for implementation agents

### DeepSeek
Acts as:
- Implementation engineer
- Code writer
- Refactoring engineer
- Test/fix executor when given exact repository context and requirements

The implementation agent must receive enough concrete information to work without guessing.

---

# 16. Agreed Implementation Sequence

## Phase 1 — Forensic Repository Audit
No code changes.

Deliver:
`01_REPO_INVENTORY.md`

Include:
- repository structure
- important files
- feature map
- data flow
- persistence
- API/backend flow
- Nour flow
- curriculum flow
- homework flow
- assessment/mastery flow
- demo/mock detection
- duplicated systems
- disconnected systems
- risks
- recommended reuse/replacement

## Phase 2 — School Brain Architecture + Contracts

Deliver:
`02_SCHOOL_BRAIN_ARCHITECTURE.md`

Define:
- authoritative data sources
- School Brain responsibilities
- Nour context contract
- activity contract
- assessment contract
- mastery contract
- next-action contract
- persistence boundaries
- orchestration rules

## Phase 3 — Data Model

Deliver:
`03_DATA_MODEL.md`

Define durable models for:
- Student
- School
- Grade
- Subject
- Curriculum
- Unit
- Lesson
- Topic
- Timetable
- Homework
- Exam
- Activity
- Response
- Assessment
- Mastery
- Mistake/Error pattern
- Review schedule
- Daily plan
- Parent settings

## Phase 4 — Curriculum Migration

Deliver:
`04_CURRICULUM_MIGRATION.md`

Trace and replace the demo/production split.

Do not delete `src/data/demoCurriculum.ts` until dependencies are understood and the replacement is verified.

Establish the authoritative curriculum source.

## Phase 5 — Nour Teacher Context + Orchestrator

Make Nour aware of the School Brain.

Nour should be able to determine:
- what the student is doing
- why she is doing it
- what she already knows
- what she struggles with
- what should happen next

## Phase 6 — Student First-30-Seconds Flow

Once the underlying system is sound, make the opening experience immediately useful.

The student should quickly understand:
- Nour knows who she is
- Nour knows what happened at school
- Nour knows what needs to be done
- Nour has a plan
- the student can start

Do not sacrifice the full product architecture merely to optimize this moment.

## Phase 7 — Home / Daily Command Center

Redesign the home experience around:

**What do you need to do now?**

Not a generic dashboard of disconnected feature cards.

## Phase 8 — Learning Engines

Integrate existing:
- lessons
- reels
- questions
- quizzes
- games
- missions
- practice
- revision

under Nour/School Brain orchestration.

## Phase 9 — Assessment + Mastery

Make the complete loop real:

**Activity → Response → Assessment → Mastery → Review/Next Action**

## Phase 10 — Homework Intelligence

Implement:
- typed homework
- photo homework
- OCR/understanding
- checking
- explanation
- retry
- handwriting support
- mastery update

## Phase 11 — Knowledge / Curriculum Expansion

Expand subject-by-subject and curriculum-wide until the full school-year path is represented.

## Phase 12 — Adaptive School-Day Planner

Connect:
- timetable
- today's lessons
- homework
- exams
- curriculum
- mastery
- review schedule
- available time

to daily planning.

## Phase 13 — Parent Mode

Connect parent view to the same authoritative student state.

## Phase 14 — Production Hardening + Final QA

Audit:
- persistence
- data integrity
- mobile UX
- error states
- offline/poor-network behavior where applicable
- AI failure handling
- duplicate state
- stale state
- curriculum integrity
- security/privacy
- performance
- regression risk

---

# 17. Important Design Principle

Existing tools should become **capabilities of the School Companion**, not competing mini-apps.

For example:

- Quiz is a teaching/assessment instrument.
- Game is a learning instrument.
- Reel is an explanation instrument.
- Homework is a learning/assessment workflow.
- Review is a scheduled learning activity.
- Mission is a structured learning sequence.

**Nour decides when and why to use them.**

---

# 18. What Success Looks Like

A successful version should allow a student to:

1. Register/select school and grade.
2. Have a real curriculum context.
3. Tell Nour what happened at school.
4. See what matters today.
5. Receive a personalized study plan.
6. Learn through the appropriate activity.
7. Answer questions.
8. Receive useful correction.
9. Have mistakes remembered.
10. Have mastery updated.
11. Have future teaching adapt.
12. Complete homework using text/photo/writing.
13. Prepare for upcoming exams.
14. Review older material at the right time.
15. Continue from the correct state tomorrow.
16. Let a parent understand progress without taking over the student experience.

---

# 19. New-Chat Operating Rule

When continuing this project in a new chat:

**Do not restart the product discussion from zero.**

Start from this document.

The first implementation task is:

> **Perform the forensic repository audit of the current Amina app. Do not modify code yet.**

After the audit, produce the repository inventory and identify the highest-risk architectural problems.

Then proceed phase-by-phase.

---

# 20. Current Priority

**Priority #1: Establish what is actually in the repository.**

The product vision is already defined.

The next question is not:

> “What should we code first?”

It is:

> **“What do we already have, what actually works, what is fake/demo, and what architecture is required to turn it into the School Companion we agreed on?”**

Only after that answer is verified should implementation begin.

---

## Final Product Statement

**School Companion is a persistent, adaptive AI school teacher and learning system.**

It knows the student's school context, curriculum, schedule, homework, exams, learning history, strengths, weaknesses, and mistakes. It uses that knowledge through Nour to decide what to teach, how to teach it, how to assess the response, what mastery means, what should be reviewed, and what the student should do next.

The app starts with Amina, but the architecture must be general enough to become a real School Companion for any student.