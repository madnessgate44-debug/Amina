# Miss Noor — reference skills, mapped skill by skill

**Date:** 2026-10-28
**Baseline:** `main` @ `25baafb` (after PR #61 merged)
**Author:** OpenHands (repository's designated executor), for owner `madnessgate44-debug`
**Scope:** Block 3 of `docs/audits/NINE_HOUR_WORK_ORDER_2026-10-27.md`. Design document plus the
one highest-value implementation it names. No new dependency. No deploy.
**Evidence tags:** `[V]` verified this session · `[O]` observed-not-verified · `[H]` hypothesis ·
`[B]` blocked.

---

## Read this first

Block 3 asks for a document that reads three references **line by line** and maps each skill to a
concrete change in this app, then implements the single highest-value item.

The three references are:

1. `anthropics/k12-teacher-skills` — four K-12 skills. Read from the actual files this session `[V]`.
2. ChatGPT Study Mode — the controlled interaction strategy `[V]`.
3. Gemini Guided Learning — teaching through visuals `[V]`.

The **highest-value item** the work order predicts is "misconception-aware feedback". That work is
**already built and merged**: PR #61 landed as `25baafb` `[V]`. The rows below record that honestly
rather than re-implementing it.

**Companion document.** `docs/design/TEACHING_AGENTS_AND_SKILLS_REPORT_2026-10-28.md` (PR #60)
covers OpenHands Cloud skills/sub-agents, Study Mode and Guided Learning in depth. It predates this
file and does **not** read `anthropics/k12-teacher-skills` — that is the gap this document closes.

---

## 1. Method

- Repository state established first: `main` @ `25baafb`, clean tree `[V]`.
- The four k12 skills were read from source at `/tmp/k12/plugin/skills/` after cloning
  `anthropics/k12-teacher-skills` this session. Each `SKILL.md` and its `references/` were opened,
  not summarised from memory `[V]`.
- Study Mode and Guided Learning were read from the first-party help pages quoted in the companion
  report `[V]`.
- Each row states: what the reference skill does, what already exists here, what is missing, and the
  smallest change that would deliver it.

---

## 2. Reference 1 — `anthropics/k12-teacher-skills` (four skills)

Cloned and read this session. The plugin ships exactly four skills under `plugin/skills/` `[V]`.

### 2.1 `k12-check-for-understanding` (CFU)

**What it does `[V]`.** Builds 1–3 formative items for one math standard, scoped to one learning
component, with **every multiple-choice distractor drawn from a documented student error** and a
teacher guide that says what each response reveals and the next step. It separates a *prerequisite
gap* (prior-grade content) from an *on-grade confusion*, and routes each to a named next move.
"Asset-based language everywhere" — no "weak", "struggling", "behind".

**What exists here already `[V]`.** `generateQuestionsForConcept` / `realQuestionsForConcept`
(`src/services/content/contentGenerator.ts`) build 3 MCQs per concept with rising difficulty
(`tiers = [0.3, 0.55, 0.8]`). `evaluateStudentAnswer` marks answers. PR #61 added
`misconceptions[]` + `distractors[]` to `CurriculumLessonConcept` and `HomeworkQuestion`, and
`diagnoseWrongAnswer` maps a wrong answer to a `misconceptionId`.

**What is missing `[V]`.** There is no distinct *CFU* artefact: nothing produces a short formative
check that is *read for what it reveals* rather than scored, and no item routes a response to a
**named prior-grade standard**. Distractors exist as data only on the one anchor lesson.

**Smallest change.** A `buildCheckForUnderstanding(conceptId)` in `contentGenerator.ts` that emits
1–3 items whose distractors carry `misconceptionId`, reusing the PR #61 data contract. No new module
beyond one function.

### 2.2 `k12-lesson-differentiation`

**What it does `[V]`.** Adapts one existing lesson for **below / at / above** grade level using
Tomlinson tiers: a teacher plan plus three student documents, shared content written once so tiers
cannot drift, eight subject-specific rules (R1–R8) including a below-level scaffold density cap.

**What exists here already `[V]`.** Miss Noor adapts difficulty per learner — `masteryEngine` exposes
a `confidenceBand` (`'high' | 'medium' | 'low'`) and `selectTeachingSkill` maps it to an explanation
layer. `contentGenerator` varies question difficulty by tier weight.

**What is missing `[V]`.** There is no three-tier lesson artefact and no explicit below/at/above
student materials; adaptation is per-learner and implicit, not per-tier and printed.

**Smallest change.** A `TieredLesson` view that reuses `confidenceBand` to label three bands and
reuses existing concept content per band — a render change, not a curriculum rewrite. Low priority
for a single-child app `[H]`.

### 2.3 `k12-lesson-plan-creation`

**What it does `[V]`.** Builds a full lesson package: a teacher lesson plan, an observation template
with **anticipated misconceptions**, and student materials, all sharing one wording so they cannot
drift. Grounds the plan in a standard and quotes it verbatim exactly once.

**What exists here already `[V]`.** `teachingSession.ts` is a staged state machine
(`greet → warmup → teach → ask → explain_back → adjust → celebrate → close`) — the runtime
equivalent of a lesson arc. `teacherContextEngine.ts` holds the diagnosis branches.

**What is missing `[V]`.** No teacher-facing plan document, no observation template, no
"anticipated misconceptions" list surfaced for a human. The app teaches; it does not brief a teacher.

**Smallest change.** Surface the now-data `concept.misconceptions[]` as an "anticipated errors" list
in the existing teacher context. Data already exists after PR #61 `[V]`; this is presentation.

### 2.4 `k12-lesson-prep`

**What it does `[V]`.** A prep partner: it hands the teacher the lesson's key task, has them try it
and predict where an almost-right answer goes wrong, then leaves a 200–300 word prep note walking the
lesson's parts in teaching order. Explicitly *not* for building, grading, or quizzes.

**What exists here already `[V]`.** `tutorEngine.ts` holds a graduated escalation ladder
(`TUTOR_LADDER_ORDER`, ending in `check_question`) — the Socratic "try it, then check" move.

**What is missing `[V]`.** No prep-note artefact for an adult; this skill's audience (a teacher
preparing to teach) does not exist in a single-child app.

**Smallest change.** None justified. Record as **out of scope** for Miss Noor `[H]` — its user is the
child, not a teacher.

---

## 3. Reference 2 — ChatGPT Study Mode

**What it does `[V]`.** Four behaviours: *ask before telling* (Socratic), *layer the explanation*,
*one question at a time and wait*, and *name the misunderstanding*.

| Study Mode behaviour | Exists here? | Smallest change |
|---|---|---|
| Ask before telling | `tutorEngine` ladder → `check_question` `[V]` | already present |
| Layer the explanation | `explainInLayersSkill` picks layer from `confidenceBand` `[V]` | already present (PR #61) |
| One question at a time | `teachingSession` `ask` step `[V]` | already present |
| **Name the misunderstanding** | `diagnoseMisconceptionSkill` + curriculum `misconceptions[]` `[V]` | **built in PR #61** |

The fourth row is the highest-value item the work order predicted, and it is now **merged on `main`**
`[V]`.

---

## 4. Reference 3 — Gemini Guided Learning

**What it does `[V]`.** Teaches with visuals: "Learn with images", may include a diagram in a
response, grounds explanations in a real textbook, and offers practice questions with feedback and
hints. Honest limits Google states: OpenStax grounding is English + US only and not for under-18
accounts `[V]`.

| Guided Learning behaviour | Exists here? | Smallest change |
|---|---|---|
| Learn with images | `CurriculumLessonConcept.visualType` / `visualPrompt` + `StructuredVisualData` `[V]` | already present |
| Textbook grounding | concepts carry `sourceText` + page refs `[V]` | already present |
| Practice with hints | `generateQuestionsForConcept` hints + escalation `[V]` | already present |
| Escalate to a visual when words fail | `groundedVisualSkill` at `VISUAL_ESCALATION_ATTEMPT = 4` `[V]` | built in PR #61 |

---

## 5. The one implementation this document delivers

Per the work order: *"implement the single highest-value item, which is expected to be
misconception-aware feedback (Block 4)."*

**Status: done and merged `[V]`.** PR #61 (`feat/real-teaching-agent`) squash-merged to `main` as
`25baafb`. It delivers:

- `ConceptMisconception` and `misconceptions[]` / `distractors[]` on the curriculum concept and
  homework question types — misconceptions are now **data**, not engine branches `[V]`.
- `evaluateStudentAnswer` returns an optional `misconceptionId` when a wrong answer matches a
  distractor or a trigger `[V]`.
- A teaching-skill registry (`src/services/teaching/skills/`) with five named skills and a
  coordinator (`selectTeachingSkill`), wired into `teachingSession.ts` `[V]`.
- Learning telemetry (`src/services/telemetry/learningSignals.ts`) recording whether the teaching
  landed `[V]`.

Block 4's acceptance test — *"a wrong answer on a lesson that has no hardcoded diagnosis block still
produces a specific, content-sourced explanation"* — is covered by
`src/services/teaching/__tests__/teachingSkills.test.ts` §4 and
`teachingSkillLoop.test.ts`, both green `[V]`.

---

## 6. What this document does not claim

- **Not every lesson carries misconception data.** Only the anchor lesson
  `off_mathfr_u1_l1_decimaux` was seeded in PR #61 `[V]`. Extending the data across the curriculum is
  open work.
- **No browser walk this session.** All UI claims are from source `[O]`.
- **`k12-lesson-prep` and `k12-lesson-differentiation` are recorded as lower value** for a
  single-child app; that is a judgement, not a measurement `[H]`.

---

## 7. Sources

- Repository `main` @ `25baafb` (this session).
- `anthropics/k12-teacher-skills` cloned to `/tmp/k12` — `plugin/skills/k12-check-for-understanding`,
  `k12-lesson-differentiation`, `k12-lesson-plan-creation`, `k12-lesson-prep` and their
  `references/` `[V]`.
- `https://help.openai.com/en/articles/11780217-study-mode` `[V]`.
- `https://support.google.com/gemini/answer/16448384` `[V]`.
- `docs/design/TEACHING_AGENTS_AND_SKILLS_REPORT_2026-10-28.md`,
  `docs/audits/TEACHING_ENGINE_GAP_AUDIT_2026-10-27.md`,
  `docs/audits/NINE_HOUR_WORK_ORDER_2026-10-27.md`.

---

_This report was prepared by an AI agent (OpenHands) on behalf of the repository owner._
