# Miss Noor — Teaching Agents & Skills: complete implementation report

**Date:** 2026-10-28
**Baseline:** `main` @ `7b19369` ("fix(api): bound AI calls so slow routes return a lesson, not a 504 (#58)")
**Author:** OpenHands (repository's designated executor), for owner `madnessgate44-debug`
**Scope:** research + design report. **No app code changed. No merge. No deploy. No dependency added.**
**Evidence tags:** `[V]` verified this session · `[C]` reported claim · `[I]` inference · `[A]` assumption · `[U]` unknown · `[B]` blocked.

---

## Read this first (one screen)

**Blocker:** None. All work below is done; nothing is waiting on you to proceed.

**What this is:** you asked for a complete report on using *teaching agents* and *skills* — the way
OpenHands Cloud, ChatGPT Study Mode and Gemini Guided Learning work — inside Miss Noor. This is that
report: what those three references actually do, what Miss Noor already has, what is genuinely
missing, and a numbered plan to implement it.

**Three findings that change the plan:**

1. **Two of the five gaps you asked about are already fixed on `main`.** The "stub lessons" gap
   (the two empty lessons) is **closed** — `getAminaFlatConcepts()` now returns 54 concepts across
   51 lessons with **0 empty lessons** `[V]`. The older audit's `36 lessons / 35 concepts` figure is
   stale. The hands-free voice loop is **already built and tested** (31/31 pass) `[V]`, and an open
   PR **#59** makes it the default `[V]`.
2. **A second session has already opened PR #46**, which adds **19 sub-agents and ~35 skills** to
   this repo — that is the "skills that teach agents" roster `[V]`. It is open, clean, and
   **unmerged**. The skills in it are *engineering* skills for the coding agents, **not**
   *teaching* skills for the child's in-app Miss Noor. The distinction matters and is the core of
   this report.
3. **The real product gap is not "more agents" — it is that the in-app teacher does not diagnose
   from data.** Miss Noor's misconception handling is 34 `diagnosisType` occurrences, of which **7** are hardcoded `misconception` blocks, in
   `teacherContextEngine.ts`, and the curriculum data model has **zero** `misconception` /
   `distractor` fields `[V]`. That is the single highest-value fix and it is what makes Study Mode
   and Guided Learning feel smart.

**Costs:** none. Every recommendation uses the existing free Gemini tier and code already in the repo.

**Your one next action:** decide the order — see §8, Decision 1. My recommendation is **merge the
misconception-data work first** (it is the thing a 10-year-old feels), and treat PR #46 as a
coding-agent improvement, not a teaching improvement.

**Details below the line.**

---

---

# Details

## 1. Method and provenance

- Repository state established first: `main` @ `7b19369`, shallow clone, no local modifications `[V]`.
- Baseline gates run **before** any analysis: `npm run lint` exit 0 `[V]`; `npm test` exit 0, all 18
  suites green (see §7 ledger) `[V]`.
- Three external references fetched directly (see §2). Where a source could not be retrieved, it is
  named and the claim is tagged rather than asserted.
- Two prior in-repo audits read: `docs/audits/TEACHING_ENGINE_GAP_AUDIT_2026-10-27.md` and
  `docs/audits/NINE_HOUR_WORK_ORDER_2026-10-27.md`. Where this report disagrees with them, it says
  so and gives the command that shows the current truth.

---

## 2. The three references — what they actually are (verified)

### 2.1 OpenHands Cloud: skills + sub-agents + delegation

Source: `https://docs.openhands.dev/overview/skills` and
`https://docs.openhands.dev/sdk/guides/agent-file-based` (HTTP 200, fetched this session) `[V]`.

What it is `[V]`:

- **Skills** are reusable instructions in `.agents/skills/<name>/SKILL.md` with YAML frontmatter.
  They use **progressive disclosure**: only the name + description are loaded up front; the full body
  is loaded when the task matches. Three trigger types exist: **keyword**, **path** (rules that fire
  when a file is touched), and **always-on**.
- **File-based sub-agents** are `.md` files in `.agents/agents/` with frontmatter
  (`name`, `description`, `tools`, `model`, `skills`). They are invoked through a **task/delegation
  tool**: the parent agent calls a sub-agent, blocks until it finishes, and gets the result back.
- **Key rule from the docs:** "Skills guide the agent's behavior; they do not grant permissions."
  A skill is knowledge, not capability `[V]`.

Why this matters for Miss Noor: OpenHands' skill system is the **engineering** pattern for making
*coding agents* consistent. It is exactly what PR #46 already applies. It is **not** a runtime
teaching engine and it does not run inside the child's app. Copying it into the app would be a
category error.

### 2.2 ChatGPT Study Mode

Source: `https://help.openai.com/en/articles/11780217-study-mode` (fetched via text proxy, HTTP 200) `[V]`.

What it does, quoted `[V]`:

- "Instead of only giving a final answer, ChatGPT can ask questions, guide your thinking, explain
  ideas step by step, and check your understanding as you go."
- **Guide your thinking:** "can guide you with questions instead of giving the answer right away (a
  Socratic-style approach). It may ask what you already know, where you got stuck, or what step you
  would try next."
- **Explain concepts in layers:** "start with a simple explanation, then add more detail when you are
  ready… slow down, use simpler language, give an analogy, or go deeper."
- **Check your understanding:** "ask open-ended questions, give feedback on your answers, and help
  you correct misunderstandings… quiz you one question at a time, wait for your answer, and explain
  what to review next."
- **Work with your study materials:** the child can upload notes, a worksheet, a photo of a problem,
  and the tutor references them.
- **Personalize with Memory:** remembers goals, preferred explanation style, topics studied before.

The four behaviours to copy are: *ask before telling*, *layer the explanation*, *one question at a
time and wait*, and *name the misunderstanding*.

### 2.3 Gemini Guided Learning

Source: `https://support.google.com/gemini/answer/16448384` ("Use learning tools in Gemini Apps",
HTTP 200, fetched this session) `[V]`.

What it does `[V]`:

- Guided Learning is a **mode you switch on** before you ask ("More tools → Guided Learning"), then
  you prompt with a learning topic.
- **Learn with images:** "Gemini Apps may include images in responses to help explain a topic or
  concept. You can also ask Gemini to provide a diagram or image in your prompt."
- **Learn with videos:** may include YouTube videos when Activity is on.
- **Practice questions with feedback and hints**, including multiple-choice or open-ended.
- **Grounded sources:** `@OpenStax` pulls from real textbooks. Note the honest limits Google states:
  OpenStax grounding is **English + US only** and **not for under-18 or work/school accounts** `[V]`.

The behaviour to copy is: *teach with a picture, and ground the explanation in a real book page.*

> **Provenance note.** The Gemini feature was also announced on `blog.google`, but that page now
> returns 404 and the Internet Archive was offline during this session. This report therefore relies
> on Google's own **support** documentation, which is a first-party source. No claim here rests on a
> page that could not be fetched `[V]`.

---

## 3. What Miss Noor already has (measured, not remembered)

All figures below are `[V]` on `main` @ `7b19369`.

### 3.1 The teaching loop is real and is the strongest asset

- `src/services/teaching/teachingSession.ts` (769 lines) is a staged state machine:
  `greet → warmup → teach → ask → explain_back → adjust → celebrate → close` `[V]`.
- `src/services/tutor/tutorEngine.ts` (247 lines) is a graduated escalation ladder
  (`TUTOR_LADDER_ORDER`, `advanceTutorEscalation`, ending in `check_question`) — this is the
  Socratic behaviour Study Mode describes `[V]`.
- `src/services/teacher/teacherContextEngine.ts` (1,791 lines) builds the lesson context and
  diagnosis `[V]`.

**Verdict:** the *shape* of Study Mode's loop is already here. What is missing is data depth, not
architecture.

### 3.2 Supporting services are real

| Capability | Location | State |
|---|---|---|
| Mastery scoring + confidence + weekly decay | `src/services/mastery/masteryEngine.ts` | `[V]` |
| Spaced review scheduling | `src/services/review/spacedReviewScheduler.ts` | `[V]` |
| Answer evaluation | `src/services/homework/homeworkGenerator.ts` (`evaluateStudentAnswer`) | `[V]` |
| Hands-free turn-taking | `src/services/voice/handsFreeLoop.ts` + `handsFreeLoop.test.ts` | `[V]` 31/31 pass |
| Voice in / voice out | `voiceService.ts` (705), `tutorSpeechService.ts` (250) | `[V]` |
| Cost/latency/degradation telemetry | `src/services/telemetry/*` | `[V]` |

### 3.3 Curriculum is no longer the problem the old audit described

The 2026-10-27 audit reported "36 lessons / 35 concepts" and **two empty-stub lessons** `[C]`.
That is **no longer true** `[V]`. Measured this session by running the loader the app actually uses:

```
$ npx tsx -e "import { getAminaFlatConcepts } from './src/services/curriculum/curriculumService'; ..."
TOTAL_CONCEPTS 54
TOTAL_LESSONS 51
ZERO_CONCEPT_LESSONS 0
```

`Multiplying Decimals by Powers of 10` now carries concept `conc_mathfr_u3_l1_puissance10` with
`sourceText`, `keyPoints`, a daily-life example and a prerequisite `[V]`. **Block 1 of the nine-hour
work order is already done.** Do not redo it.

### 3.4 Hands-free conversation is already built

- `handsFreeLoop.ts` is a tested state machine: `idle → tutor_speaking → listening → thinking`,
  with a bounded failure count and an interrupt path `[V]`.
- It is wired into `TeachingSessionModal.tsx` (line 60 `initialHandsFreeState`, line 122 auto-speak
  on each tutor turn, line 430 `handsFree` / `listenSignal` passed down) `[V]`.
- **Open PR #59** (`block-2-hands-free-default`, +30/-8, 3 files, mergeable `clean`) flips the
  default to hands-free `[V]`.

**Block 2 of the nine-hour work order is essentially done, pending merge of #59.**

### 3.5 Two open PRs already carry the agent/skill work

| PR | Title | Size | State | What it is |
|---|---|---|---|---|
| **#59** | make hands-free the default turn-taking mode | +30/-8, 3 files | open, clean, not draft `[V]` | the voice-loop default |
| **#46** | Always-on OpenHands skills, sub-agents, and hooks | +972, 48 files | open, clean, not draft `[V]` | 19 sub-agents + ~35 skills + hooks |

PR #46 adds `.agents/agents/*.md` (architect, backend-engineer, code-reviewer, qa-engineer,
security-engineer, ux-designer, …) and `.agents/skills/*/SKILL.md` (api-design, ci-cd-pipelines,
observability, testing-strategy, …) `[V]`.

**Critical distinction:** every skill in PR #46 is an **engineering** skill. They make the *coding
agents that build Miss Noor* better. **None of them teach the child.** If you merge #46 and stop,
the app the child opens is unchanged.

---

## 4. What is genuinely missing (gap matrix)

This is the corrected gap list. It replaces the stale parts of the 2026-10-27 audit.

| ID | Gap | Evidence | Severity |
|---|---|---|---|
| **G1** | ~~Two empty stub lessons~~ | **CLOSED** — 0 zero-concept lessons `[V]` | — |
| **G2** | ~~Conversation is press-driven~~ | **BUILT** — `handsFreeLoop` + PR #59 `[V]` | — |
| **G3** | **Misconceptions are hardcoded, not data** | 34 `diagnosisType` occurrences (7 `misconception`); **0** `misconception`/`distractor` fields in `src/types` + `src/data` `[V]` | **High** |
| **G4** | **No in-app teaching skill layer** | The app has services, but no named, reusable, testable *teaching skills* the way OpenHands has skills `[V]` | **High** |
| **G5** | **Weak learning telemetry** | `telemetry/` measures cost/latency only; no per-session learning signal `[V]` | Medium |
| **G6** | **Brand tokens defined, not applied** | `--color-midnight` etc. in `index.css`; **2** usages (both are the definitions themselves) `[V]` | Medium |
| **G7** | **Two `text-slate-400` contrast failures** | `CurriculumBrowser.tsx:387` and `:573` — 2.56:1 on white, below the 4.5:1 AA floor `[V]` | Medium |
| **G8** | **Homework and Missions are one screen** | `AppShell.tsx:97-98` render `MissionsScreen` for both tabs `[V]` | Medium |
| **G9** | **Legacy name "Amina" in shipped curriculum** | `frenchCurriculum.ts` teaches *"Je m'appelle Amina"*; 15 occurrences in `src/data/` `[V]` | Medium |
| **G10** | **French-track subjects thin; French FEED headline is English** | `reelGenerator.ts:139` maps `fr` → `dailyLifeExampleEn`; no `dailyLifeExampleFr` exists `[V]` | Low/Med |
| **G11** | **Model name duplicated 11×** | `gemini-3.8-flash` appears in `server.ts`, `costLatencyService.ts`, `DeveloperPanel.tsx`; a 4th literal `gemini-3.8-flash-lite-tts` at `server.ts:318` `[V]` | Low |
| **G12** | **Onboarding warm-up is Arabic curriculum text in every locale** | `buildWarmupQuestions(lang)` selects real exercises; content language follows the lesson, not the UI `[V]` | Low |

### 4.1 Why G3 is the headline gap

The single thing that separates a "smart tutor" from a "quiz with a red cross" is that a wrong
answer tells the teacher **what** the child misunderstood. Today:

- `evaluateStudentAnswer` returns only `{ isCorrect, correctness: 'full'|'partial'|'wrong', feedback? }` `[V]`.
- The 34 `diagnosisType` branches in `teacherContextEngine.ts` fire only for the exact curated cases they
  were written for. A wrong answer outside them yields no diagnosis `[V]`.
- `reelGenerator.ts:205` already carries the comment *"Needs a misconception-bearing wrong option
  from a real exercise"* — a previous session found this same gap `[V]`.

This is **Block 4** of the nine-hour work order, and it is the highest-value item left.

### 4.2 Why G4 (a teaching skill layer) is the answer to your actual question

You asked how to implement *teaching agents and skills*. The honest answer, grounded in what the
three references show:

- OpenHands shows the **container** (skills + sub-agents + delegation) — for engineering.
- Study Mode and Guided Learning show the **behaviours** — for the child.
- Miss Noor already has the behaviours *scattered across services*.

The improvement is to give Miss Noor a **first-class teaching-skill layer**: the same
`.agents/skills` idea, but as an in-app registry of named teaching skills, each with a trigger, a
data contract, and a test — sitting on top of the services that already exist. That is the smallest
change that makes the architecture match what the references describe, and it is what lets G3
(misconception data) be consumed by something.

---

## 5. How to implement it in *this* project (the design)

### 5.1 The two-layer model — do not confuse them

```
LAYER A — Engineering agents (build Miss Noor)          LAYER B — Teaching skills (the child's Miss Noor)
  .agents/skills/*.md        (PR #46 already adds)        src/services/teaching/skills/*.ts
  .agents/agents/*.md        (PR #46 already adds)        driven by curriculum + student state
  runs in OpenHands Cloud, on the repo                    runs in the app, at request time
  makes the CODING consistent                             makes the TEACHING consistent
```

Layer A is largely done (PR #46). Layer B is the gap.

### 5.2 Layer B — a teaching-skill registry

One new module, `src/services/teaching/skills/`, holding named skills with a shared contract:

```ts
export interface TeachingSkill {
  id: string;                 // 'diagnose-misconception'
  description: string;        // shown to the coordinator, like an OpenHands skill description
  triggers: string[];         // keywords / lesson signals that select it
  run(ctx: TeachingSkillContext): TeachingSkillResult;
}
```

Start with **five** skills, each mapping to something a reference already proves is valuable and to
code that already exists:

| Skill | Reference it copies | Existing code it reuses | New work |
|---|---|---|---|
| `diagnose-misconception` | Study Mode "name the misunderstanding" | `evaluateStudentAnswer` | consume new misconception fields |
| `explain-in-layers` | Study Mode "explain in layers" | `teacherContextEngine` modalities | pick layer from `mastery.confidenceBand` |
| `socratic-check` | Study Mode "ask before telling" | `tutorEngine` ladder | expose it as a skill |
| `grounded-visual` | Guided Learning "learn with images" | `StructuredVisualData` + `visualType` | trigger a visual for every teach step |
| `spaced-recheck` | Study Mode "what to review next" | `spacedReviewScheduler` | feed the outcome back |

### 5.3 Layer B needs G3 first — the misconception data contract

Add two optional fields to `CurriculumLessonConcept` (in `src/types/teachingSession.ts`) `[V]`:

```ts
misconceptions?: { trigger: string; explanation: string; remediation: string }[];
distractors?: string[];
```

Then extend `evaluateStudentAnswer` to return an optional `misconceptionId` when the wrong answer
matches a distractor. The existing diagnosis branches stay as a fallback and can be migrated to data
incrementally — no big-bang rewrite.

### 5.4 The coordinator

One thin selector (`selectTeachingSkill(ctx)`) chooses the next skill from: current session step,
last answer correctness, mastery confidence band, and due-review state. This is the app's equivalent
of the OpenHands **task tool**: it picks the specialist, runs it, and returns to the loop.

---

## 6. Implementation plan — numbered requirements (PRD)

Each requirement has a testable acceptance criterion. Order is dependency-driven.

**Must-have**

- **R1 — Misconception data contract.** Add optional `misconceptions[]` + `distractors[]` to the
  concept type. *Accept:* `tsc --noEmit` exits 0; existing suites still pass; no curriculum file
  required to change yet.
- **R2 — Misconception-aware evaluation.** Extend `evaluateStudentAnswer` to return
  `misconceptionId?`. *Accept:* a wrong answer on a lesson with **no** hardcoded block returns a
  specific, content-sourced explanation; a new test proves it (this test fails today).
- **R3 — Teaching-skill registry.** Add `src/services/teaching/skills/` with the 5 skills and
  `selectTeachingSkill`. *Accept:* each skill has a unit test; the coordinator returns a skill for a
  given context in a test.
- **R4 — Wire skills into the loop.** Call the coordinator from `teachingSession.ts`. *Accept:*
  a session step records which skill produced its turn; existing adaptive suite (39/39) still passes.
- **R5 — Learning telemetry.** Record per session: next-question correctness, misconception
  resolution, independent-recheck success. *Accept:* a test asserts the three signals are written.

**Nice-to-have**

- **R6 — Apply brand tokens.** Use `--color-*` / `font-display` in real components. *Accept:*
  usage count rises from 0; `npm run build` exits 0.
- **R7 — Fix the two contrast failures.** `CurriculumBrowser.tsx:387,573` → `text-slate-600`.
  *Accept:* computed ratio ≥ 4.5:1; re-run the visual audit.
- **R8 — Separate Homework from Missions.** *Accept:* the two tabs render different components.
- **R9 — Remove the legacy name from curriculum.** Extend the branding guard to scan `src/data/`.
  *Accept:* the guard fails if "Amina" appears in curriculum content.
- **R10 — Model-string hygiene.** One constant for the model name; remove the 11 duplicates.
  *Accept:* the string appears in exactly one module; a test asserts it.
- **R11 — French curriculum fields.** Add `dailyLifeExampleFr` (curriculum content — owner decision).

**Explicit non-goals**

- No rebuild of the teaching engine. No new dependency. No paid service. No change to the locked
  HOME | FEED | LIBRARY | NOUR navigation. No merge of PR #7 or #8.

---

## 7. Verification ledger (this session)

| # | Command / action | Exit | Raw excerpt | Result | Time (UTC) |
|---|---|---|---|---|---|
| L1 | `git rev-parse --short HEAD` | 0 | `7b19369` | PASS | 09:25 |
| L2 | `npm ci --legacy-peer-deps` | 0 | `EXIT=0` | PASS | 09:24 |
| L3 | `npm run lint` (`tsc --noEmit`) | 0 | no output | PASS | 09:25 |
| L4 | `npm test` | 0 | 18× `SUITE SUMMARY … 0 FAILED` | PASS | 09:24 |
| L5 | loader check `getAminaFlatConcepts()` | 0 | `TOTAL_CONCEPTS 54` / `ZERO_CONCEPT_LESSONS 0` | PASS | 09:24 |
| L6 | `grep -rn "misconception" src/types src/data` | 1 | no matches in types/data | PASS (gap confirmed) | 09:24 |
| L7 | `grep -c diagnosisType teacherContextEngine.ts` | 0 | `34` (7 are `misconception`) | PASS (gap confirmed) | 09:25 |
| L8 | GitHub API open PRs | 0 | 6 open incl. #46, #59 | PASS | 09:25 |
| L9 | `GET /api/health` on live Vercel | 0 | `{"status":"ok","hasApiKey":true}` | PASS | 09:25 |
| L10 | fetch OpenHands skills docs | 0 | HTTP 200 | PASS | 09:18 |
| L11 | fetch Study Mode help article | 0 | HTTP 200 | PASS | 09:19 |
| L12 | fetch Gemini Guided Learning article | 0 | HTTP 200 | PASS | 09:21 |
| L13 | fetch `blog.google` Guided Learning | 404 | 404 | NOT RUN (unavailable) | 09:19 |

Baseline suites, all `[V]`: adaptive 39, integrity 86, strict-gate 8, teaching 44, reels 23,
onboarding 11, feed-save 6, my-books 84, exam 69, branding 10, voice 15, payload 15, vercel 4,
phone-ui 28, noor-voice 18, curriculum-registry 7, **hands-free 31**, ai-budget 7 — **0 failures**.

---

## 8. Decisions for you (at most one question)

**Decision 1 (the one I need):** which do you want first?

- **(a) The child-facing teaching skills** (R1–R5): misconception data + the teaching-skill layer.
  *My recommendation.* It is the only item on the list that changes what your daughter experiences,
  and it needs no new service or money.
- **(b) Consolidate the engineering agents** (merge PR #46, keep PR #59): tidies the coding side.

Everything else on the list can proceed in either order.

**Decisions I made without asking, and why:**

- **I did not merge anything.** Owner policy: "Never push to `main`. Never merge unless `docs/LOOP.md`
  grants it." `docs/LOOP.md` does not exist on this branch `[V]`, so no merge authority exists.
- **I did not open a PR.** You asked for a report. I put it on a branch so it is reviewable, but a PR
  is an outbound action I have not been told to take. Say the word and I will open one.
- **I did not touch PR #46 or #59.** They belong to other sessions and are clean.
- **I treated the 2026-10-27 audit as stale where I could measure it** — the stub-lesson and
  hands-free findings were both wrong *as current facts*.

---

## 9. What I could not verify

- **The `blog.google` announcement page** for Guided Learning (404; archive offline). Replaced with
  Google's first-party support article `[V]`.
- **The live app's real behaviour in a browser this session.** `/api/health` is 200 `[V]`, but I did
  not run the Playwright harness. All UI claims here are from source, not from a running walk.
- **Whether PR #46's 19 sub-agents actually work when invoked.** Per the Execution OS §7, capability
  must be proven end-to-end, not inferred from the files existing. Not attempted this session.
- **PR #47's F-12 finding** (French FEED headline renders English) was confirmed in source
  (`reelGenerator.ts:139`) but not re-run in a browser.

---

## 10. Sources

- Repository `main` @ `7b19369` (this session).
- `https://docs.openhands.dev/overview/skills`, `…/sdk/guides/agent-file-based`,
  `…/sdk/guides/task-tool-set` — HTTP 200.
- `https://help.openai.com/en/articles/11780217-study-mode` — HTTP 200.
- `https://support.google.com/gemini/answer/16448384` — HTTP 200.
- `docs/audits/TEACHING_ENGINE_GAP_AUDIT_2026-10-27.md`, `docs/audits/NINE_HOUR_WORK_ORDER_2026-10-27.md`,
  `docs/audits/ISSUE9_CHECKPOINT_2026-10-28.md`, `docs/SOURCES.md`.
- GitHub API: `madnessgate44-debug/Amina` open PRs (#46, #47, #49, #59, #10, #8); issue #9 closed.

---

_This report was prepared by an AI agent (OpenHands) on behalf of the repository owner._
