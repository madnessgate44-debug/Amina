# Amina / Miss Nour — Product Source of Truth
**Version:** 1.0  
**Updated:** 2026-10-22  
**Status:** Owner-derived requirements consolidated; implementation mapping and acceptance evidence pending OpenHands verification  
**Authority:** Owner decisions and corrections take precedence over agent assumptions, design preferences, and implementation convenience.

> This document consolidates recoverable owner requirements and product decisions. It is not a claim that every feature already exists. Implementation status must be evidenced from the actual repository, running app, tests, screenshots, and deployment records.

## 1. Mission and product definition

Amina is a personal School Companion for the student's real school life, not merely a chatbot, a static school dashboard, or a TikTok clone. It should help the learner know what to do today, understand lessons, finish homework, practice, revise, and prepare for exams through a coherent personalized experience.

The intended cycle is:

**School day → today’s responsibilities → learning → practice → verification → mastery/progress → review → exams.**

The app must become a usable, trustworthy, polished product that could be sold. Preserve already-approved behavior and product decisions. Inspect before changing; do not restart the design or remove settled features to simplify implementation.

## 2. Owner operating principles and non-negotiable constraints

1. **Owner intent is the product authority.** Preserve opinions, corrections, explicit preferences, and decisions. Do not silently replace them with agent interpretations.
2. **Evidence before claims.** Distinguish implemented, partially implemented, broken, documented-only, planned, and unverified. Link material findings to file paths, commits, workflow runs, screenshots, and test artifacts.
3. **Inspect → specify → plan → execute → verify → close.** Establish the current branch/commit and inspect actual files before coding. Define numbered requirements and acceptance criteria, map each requirement to implementation and evidence, then work on the smallest verified gap.
4. **OpenHands is the authorized repository coding/auditing executor.** ChatGPT coordinates requirements, reviews evidence, and controls approval/merge decisions. Do not route this Amina mission to Forge.
5. **GitHub is the shared communication and work-ticket hub.** Work orders, evidence, decisions, and completion reports belong in repository issues/PRs and documented artifacts.
6. **No unapproved scope changes.** Do not merge PR #7 or PR #8 without separate owner review. Do not deploy or make production changes unless separately authorized.
7. **Preserve working state.** Avoid wholesale rewrites, speculative architecture changes, placeholder implementations, silent feature removal, and duplicate parallel agent runs.
8. **Cost/access constraint.** Prefer free and already-authorized tooling. Do not start paid provider, model, desktop, or hosted runs without authorization.
9. **Phone-first owner workflow.** The owner primarily operates from an Android phone and should not be required to use a local IDE or manually run complex developer workflows when the authorized agent can do it.
10. **Honest uncertainty.** Ask for owner judgment where a decision is genuinely unresolved; do not turn an assumption into a requirement.

## 3. Product experience and information architecture

The core product surfaces are:

- **HOME** — a personalized, actionable view of the learner’s day: priorities, due work, timetable context, upcoming exams, review needs, and progress. It must not be an empty or decorative dashboard.
- **FEED** — a purposeful vertical stream of short learning experiences, quick checks, demonstrations, quizzes, and interactive content. This is a required product surface, not an optional future decoration. The owner specifically reported that the Feed/reels experience was still absent after a prior implementation phase; verify the current code and rendered app before claiming it is fixed.
- **LIBRARY** — a usable collection of the learner’s digital books, lessons, saved Feed items, notes, and folders. Full digital books should be visible and accessible, not represented only by a few sample cards or hidden behind incomplete navigation.
- **NOUR / Miss Nour** — the personal AI teacher, integrated with curriculum, learning state, practice, homework, and progress. It must behave as a teacher with a learning loop, not only a generic chat interface.

The experience should feel premium, modern, and coherent, comparable in finish and interaction quality to a contemporary AI/super-app experience. Avoid exposing internal pedagogy or technical workflow labels to the learner. Educational logic should guide the experience behind the scenes.

### 3.1 Cross-surface continuity

HOME, FEED, LIBRARY, and NOUR are parts of one product, not disconnected demos. A lesson, question, error, or saved item should carry its subject/topic identity and relevant learner state across surfaces. A learner should be able to discover an item, use it, save it, reopen it, and continue without losing context.

### 3.2 Responsive and localized experience

Verify mobile layouts first and also inspect desktop. Support the relevant English/French learning content and Arabic RTL presentation where the app claims to support them. Text direction, navigation, forms, mixed-language curriculum terms, and feedback must remain usable in each supported locale. Do not claim localization is complete based solely on translated labels.

## 4. Initial learner context (configuration, not a universal product assumption)

The latest owner-provided setup for Amina is:

- Grade 5 primary.
- Girard, a French school in Alexandria.
- Egyptian curriculum with French-curriculum elements.
- English, mathematics, and science are studied in French.

Use this as the initial learner configuration when applicable. Do not hard-code it as the only supported student profile. Earlier conversation context may contain conflicting age/grade descriptions; the latest explicit setup above is the current working context unless the owner corrects it. The product architecture should support other learners, grades, schools, and supported curricula.

## 5. Miss Nour teaching and learning loop

The required internal learning cycle is:

**Diagnosis → Teaching Strategy → Practice → Verification → Outcome.**

Operationally, Miss Nour should:
1. Identify the relevant curriculum objective and the learner’s current need using available evidence.
2. Select an appropriate explanation or teaching approach, with language and difficulty suited to the learner.
3. Present a worked example, explanation, demonstration, short lesson, or other suitable instrument.
4. Ask the learner to respond or perform a task.
5. Evaluate the response for correctness and, where possible, the underlying misconception—not merely a binary right/wrong mark.
6. Give targeted feedback and another attempt when needed.
7. Verify whether understanding improved.
8. Record the learning outcome and update mastery/progress only from an actual observed response.
9. Choose the next action, including targeted practice, a different explanation, or scheduled review.

A stored score that does not influence future teaching is not a functioning mastery system. Do not display mastery as verified if no meaningful assessment evidence supports it. Handle uncertainty explicitly.

## 6. Curriculum and school knowledge

The product needs a structured, year-long curriculum model. The conceptual hierarchy is:

**Academic year → term → subject → unit → lesson → concepts/skills → practice/homework/assessment.**

It must represent progression, prerequisites where known, lesson objectives, exercises, review points, and exam relevance. Do not assume every student follows the same curriculum.

Keep source types distinct:
- **Canonical curriculum:** official/current student textbooks and curriculum documents, plus school-provided materials defining the learner’s actual program.
- **Supplementary books:** authorized support books (for example, Al-Adwaa, Selah El-Telmeez, or other relevant publishers). They supplement, not replace, the canonical curriculum.
- **Teacher materials:** authorized teacher guides, lesson plans, learning objectives, pacing, classroom activities, and assessment/remediation guidance where available and legally usable.
- **AI-generated teaching/practice:** generated explanations, examples, and questions, labelled and traceable as generated rather than official curriculum.
- **Learner/parent/teacher input:** user-entered timetable, assignments, notes, and corrections.
- **External sources:** clearly identified and not silently treated as official.

A single authoritative curriculum/knowledge layer should inform HOME planning, FEED content, LIBRARY references, NOUR teaching, homework feedback, mastery, and exam preparation. Audit the actual dependency graph before replacing or deleting demo data. In particular, do not blindly delete `src/data/demoCurriculum.ts`; establish what imports it, what production surfaces depend on it, and whether real curriculum data exists elsewhere before changing the source of truth.

Do not claim that the complete curriculum or all digital books are available unless the actual content inventory proves it. Identify missing books/materials and access/licensing blockers precisely.

## 7. School-day awareness and adaptive planning

The system should support, where configured:
- Weekly timetable and today’s classes.
- What was covered at school today.
- Homework, due dates, and completion state.
- Unfinished work and missed work.
- Curriculum position and upcoming lessons.
- Upcoming exams and preparation needs.
- Topics requiring review and repeated mistakes.
- The learner’s available time and current workload.

The daily plan should be adaptive, not a hard-coded static list. It should consider today’s school activity, urgent homework, weak topics, spaced review, upcoming exams, curriculum progression, and available time. A previous planning target of roughly 2–3 hours was a reference, not a forced quota: actual workload and session duration must fit the learner’s situation and available time.

A possible priority order is urgent homework, same-day recall, important weak topics, spaced review, exam preparation, practice/application, and optional enrichment. The School Brain should choose the actual sequence based on current evidence rather than applying this list blindly.

## 8. Homework and written-work intelligence

Support a coherent workflow for:
- Typed answers.
- Photographing a worksheet/book page and interpreting the visible questions and learner’s answers.
- Handwritten work where image quality and recognition make it practical.
- Feedback that explains the mistake and gives the learner a chance to retry.
- Recording verified learning outcomes so homework can influence future teaching and planning.

The app must distinguish an unreadable/ambiguous image from an incorrect answer. Do not fabricate OCR certainty. Where handwriting cannot be reliably interpreted, ask for a clearer image or clarification. Avoid making every activity require handwriting; combine phone-based interactions with meaningful written work.

## 9. Feed, saving, and personal organization

FEED must deliver purposeful, curriculum-relevant short-form learning, not empty reels scaffolding. Items may include explanations, demonstrations, quick questions, quizzes, games, and short practice.

Required personal organization capabilities:
- Like/favourite where implemented as a product decision.
- Save an item for later.
- Reopen a saved item from LIBRARY.
- Organize saved material into folders/collections.
- Add and revisit personal notes where supported.
- Preserve item identity and useful progress across navigation/reload.

Each control must have a real observable outcome and persistent state appropriate to the app’s storage model. An inert icon or temporary visual toggle is not a completed feature.

## 10. Learner profile, mastery, review, and progress

Track relevant academic state, including subjects, lessons, skills, mastery evidence, misconceptions/repeated errors, homework, completed/missed work, revision history, and assessment results. Track learning preferences and session behavior only where useful and privacy-appropriate.

Daily checks and weekly review are part of the intended product. Review should be driven by actual learner history and upcoming responsibilities, not by fabricated progress. Progress views should answer what has improved, what remains weak, and what the next useful action is.

Parent visibility is secondary to the learner experience but should eventually expose useful information such as completion, remaining work, homework status, progress, weak topics, exam preparation, and meaningful trends. Do not turn the primary student interface into a parent dashboard.

## 11. Onboarding and personalization

The first experience should be guided setup, not an empty dashboard. Collect only enough information to start personalization, such as student profile, grade, school/country, curriculum, academic year, languages, subjects, timetable, exams, and optional guardian details.

Personalization should continue through normal conversation and observed interactions rather than forcing a long questionnaire. The app should learn preferences progressively and allow correction of inaccurate assumptions.

## 12. Safety, privacy, and reliability

- Treat the learner as a child/minor in the initial Amina setup.
- Avoid real student data in synthetic browser tests.
- Do not expose secrets, credentials, private transcript data, or unrelated personal information in logs, screenshots, or generated reports.
- Explain uncertainty when reading homework images or interpreting learner responses.
- Preserve learner data and saved items across expected reloads and error recovery.
- Provide clear loading, empty, error, retry, and offline/persistence states where applicable.
- Do not imply that AI-generated content is official curriculum.
- Do not claim production readiness from source inspection alone.

## 13. Engineering and release constraints

- Preserve the existing React/Vite frontend, backend, persistence, AI integrations, and localization until a code-level audit establishes what exists and what must change.
- Establish the current `main` SHA and inspect open PRs, CI workflows, and actual artifacts before acting.
- TypeScript checking must be a real blocking quality gate; do not hide failures with `continue-on-error`, unsafe casts, or ignored diagnostics.
- Run relevant typecheck, lint, tests, production build, and browser learner tasks against the actual proposed code.
- Verify deployment target and deployed commit/version where access permits. If not accessible, report “not verified” with the exact blocker.
- No deployment, production mutation, dependency addition, or paid run without separate authorization.
- Keep the audit report separate from implementation PRs. Prefer small, reviewable, evidence-backed PRs.
- Do not merge PR #7 or PR #8 as part of this work without owner review.

## 14. Requirements-to-evidence register

This register is intentionally marked pending until OpenHands inspects the current code and running app. Documentation of a requirement is not implementation evidence.

| ID | Requirement | Acceptance evidence required | Current status |
|---|---|---|---|
| R-01 | Preserve owner intent and approved scope | Traceable requirement sources and explicit decision log | Documented here; full source coverage incomplete |
| R-02 | HOME is actionable and personalized | File mapping, runnable learner task, screenshot, relevant tests | PENDING |
| R-03 | FEED/reels exists and works | Rendered mobile view, working item interaction, quick-check trace, test evidence | PENDING; owner previously reported Feed absent |
| R-04 | LIBRARY exposes real digital books and saved content | Content inventory, book open/reopen trace, persistence evidence | PENDING |
| R-05 | NOUR completes the teaching loop | Trace from diagnosis through practice, verification, outcome, and state update | PENDING |
| R-06 | Curriculum source hierarchy is respected | Data model/source inventory, provenance labels, dependency graph | PENDING |
| R-07 | Daily plan reflects timetable, homework, reviews, and exams | Scenario tests with explicit inputs and resulting plan | PENDING |
| R-08 | Typed/photo/handwritten homework feedback is honest and actionable | Test cases for correct, incorrect, ambiguous, unreadable, and retry flows | PENDING |
| R-09 | Mastery and review use observed evidence | Tests proving assessment updates state and state changes next action | PENDING |
| R-10 | Save, reopen, folders, notes, and favourites work | Cross-surface navigation and reload/persistence tests | PENDING |
| R-11 | Localization and RTL are usable | Screenshots and learner tasks in supported English/French/Arabic RTL modes | PENDING |
| R-12 | Responsive UI is polished | Actual 390px mobile and 1365px desktop screenshots and task results | PENDING |
| R-13 | Loading/error/empty/recovery states work | Explicit failure and recovery tests | PENDING |
| R-14 | TypeScript is a blocking gate | Reproduced command output and failing CI when a type error is introduced | PENDING |
| R-15 | Production/deployment state is known | Deployed URL/service and SHA/version, or evidence-backed blocker | PENDING |
| R-16 | Parent visibility is useful but secondary | Scope and learner/parent navigation evidence | PENDING |
| R-17 | Product is usable and sale-ready | End-to-end acceptance matrix; no critical blocker; release evidence | PENDING |

For every row, OpenHands must add actual repository paths and commit/PR links, mark the status as implemented/partial/broken/planned/unverified, and cite the verification method. Do not change a PENDING status without evidence.

## 15. Communication Hub and source-of-truth maintenance

The conversation archive is a provenance layer, not a substitute for the product specification.

- OpenHands Cloud archive PR: https://github.com/madnessgate44-debug/Amina/pull/8
- Archive branch: `archive/openhands-chat-recovery-2026-10-22`
- Archive index: `docs/openhands-archive/INDEX.md`
- Export completion report: `docs/openhands-archive/OPENHANDS_EXPORT_COMPLETION_2026-10-22.md`
- Gaps report: `docs/openhands-archive/GAPS_AND_INACCESSIBLE_SOURCES.md`
- Recovered product brief: `docs/openhands-archive/recovered-project-artifacts/AI_School_Companion_Product_UX_Master_Brief_V1_1.md`
- Recovered handoff: `docs/openhands-archive/recovered-project-artifacts/AMINA_SCHOOL_COMPANION_HANDOFF.md`

The current archive reports 24 OpenHands Cloud conversations exported for one account, including seven Amina-repository sessions. Four sessions were still running at export and are marked partial; attachment binaries are not included. Full historical ChatGPT transcript coverage and a full sweep of GitHub issue/PR history and other connected sources remain incomplete. Therefore the archive is not globally complete.

Maintain the archive index, source coverage, gaps, and verification report when new source material is recovered. Never reconstruct missing messages from memory and label them verbatim. Keep transcripts separate from synthesized specifications. Owner decisions from newly recovered sources must be reconciled into this file with source links and a change log.

## 16. Execution sequence for OpenHands

1. Finish the active forensic audit ticket (#9) without duplicating its active session. Establish the real baseline, reproduce the strict TypeScript issue, inspect existing CI/artifacts, verify learner tasks, and check deployment status. Respect the ticket’s no-deploy/no-production-change boundaries.
2. Publish the audit report with requirement-to-evidence mapping and severity-ranked findings.
3. Keep verified TypeScript gate/type fixes in a separate focused PR if reproducible.
4. Compare this source of truth with the actual app, the recovered master brief/handoff, and the Amina OpenHands transcripts. Report conflicts and owner decisions needed; do not silently resolve conflicting evidence.
5. After the audit, propose a sequenced implementation plan that preserves working behavior and prioritizes blockers to a usable, sellable app. Include file-level changes, acceptance tests, dependencies, and rollback/safety considerations.
6. Implement approved, evidence-backed gaps in small PRs. Do not redesign all surfaces in one pass. Feed absence, missing digital-book access, broken learning continuity, and unverified mastery are high-priority areas to investigate, not presumed findings.
7. Verify every changed requirement on the actual build. Attach command outputs, browser traces/screenshots, test results, and CI links.
8. Update this file’s requirement-to-evidence register and change log. A PR being open or a build passing does not mean the entire product is complete.

## 17. Decision and change log

- **2026-10-22:** Consolidated recoverable owner context and recovered project artifacts into this source-of-truth draft. No app-code behavior is asserted as verified by this document. OpenHands audit issue #9 remains the current forensic execution path.
- Future entries must state the decision/change, its source conversation or owner instruction, the affected requirement IDs, and the implementation/evidence link.

---
**Definition of product completion:** The intended experience is implemented in the actual app, all required learner flows work end-to-end, content and curriculum provenance are honest, persistence and recovery are verified, critical quality gates pass, and the requirement register is supported by concrete evidence. No amount of documentation or agent acknowledgement alone satisfies this definition.
