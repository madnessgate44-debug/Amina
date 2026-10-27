# Miss Noor — teaching-engine requirements-to-code audit

**Date:** 2026-10-27
**Baseline:** `main` @ `a889e3d`
**Author:** OpenHands (audit only — no product code changed by this document)
**Scope:** map the existing teaching engine against a teacher-agent skill architecture, and
record what exists, what is partial, and what is genuinely missing.

Evidence labels used throughout:

- **[V] Verified** — observed directly by running a command or reading the file in this session.
- **[O] Observed, not verified** — seen in an audit document or a report, not re-run here.
- **[H] Hypothesis** — inference from code shape; not yet tested.
- **[B] Blocked** — could not be checked with the access available.

---

## 1. Why this document exists

The research direction proposed a teacher-agent architecture: one persistent Miss Noor identity,
a coordinator that picks the next teaching action, and a set of operational specialist skills.
It named the correct next engineering task as a **requirements-to-code audit** of the existing
teaching engine against that architecture, to separate what already exists from what is missing
*before* any coding starts.

This document is that audit. It deliberately does not propose a rewrite. The engine is
substantial: `teachingSession.ts` alone is 769 lines and `teacherContextEngine.ts` is 1,791.

---

## 2. External reference verified

The research rests on one external artifact. I checked it rather than taking it on trust.

| Claim | Result | Evidence |
|---|---|---|
| `anthropics/k12-teacher-skills` exists | **[V] true** | HTTP 200; `full_name: anthropics/k12-teacher-skills` |
| Licence is usable | **[V] Apache-2.0** | API `license.spdx_id: "Apache-2.0"` |
| Four documented skills | **[V] true, exact names** | `plugin/skills/` contains `k12-check-for-understanding`, `k12-lesson-differentiation`, `k12-lesson-plan-creation`, `k12-lesson-prep` |
| Maintained, not abandoned | **[V]** | 592 stars, created 2026-07-10, last push 2026-10-14, `archived: false` |
| Co-developed with Learning Commons | **[V]** | repo `description` states it |

This is a genuine, permissively licensed reference. It is a legitimate input for skill design.
Note the caveat the research itself already makes: those skills target **teacher** workflows and
US curriculum standards, so they are a design reference to adapt, not a drop-in tutor.

---

## 3. What the existing engine already has

Measured on `main` @ `a889e3d`. All counts **[V]** by `grep`/`wc` unless marked otherwise.

### 3.1 Teaching loop — exists and is the strongest asset

`src/services/teaching/teachingSession.ts` (769 lines) implements a real staged loop, not a
single prompt. Step names observed: `warmup` → `teach` → `ask` → `explain_back` → `adjust` →
`celebrate` / `close`, with attempt counting on the `adjust` path.

`src/services/tutor/tutorEngine.ts` (247 lines) implements a graduated escalation ladder
(`TUTOR_LADDER_ORDER`, `advanceTutorEscalation`, `isEscalationTrigger`) ending in a
`check_question` stage. This is the Socratic/graduated-hint behaviour the research asks for,
in early form.

### 3.2 Supporting services — real, and more than a stub

| Capability | Location | Status |
|---|---|---|
| Mastery scoring with confidence + weekly decay | `src/services/mastery/masteryEngine.ts` | **[V]** `addEvidenceToMastery`, `applyDecay`, `computeEvidenceWeights`, `getConfidenceBand` |
| Spaced review scheduling | `src/services/review/spacedReviewScheduler.ts` | **[V]** `computeConceptReviewSchedule`, `getDueReviewConcepts`, `getOverdueReviewNudges` |
| Daily/weekly review generation | `src/services/review/dailyReviewGenerator.ts`, `weeklyReviewGenerator.ts` | **[V]** present |
| Curriculum retrieval | `src/services/curriculum/curriculumService.ts` | **[V]** `CurriculumService` + `SUBJECT_METADATA_MAP` |
| Answer evaluation | `src/services/homework/homeworkGenerator.ts` | **[V]** `evaluateStudentAnswer`, `getHintFirstGuidance`, `generateSimilarPracticeQuestion` |
| Cost/latency + degradation telemetry | `src/services/telemetry/*` | **[V]** `ApiCallMetric`, `DegradationModeStatus`, `costLatencyService` |

The research's proposed skills map onto existing code far more than onto empty space:

| Proposed skill | Existing code | Verdict |
|---|---|---|
| Learning planner | `teachingSession.ts` step machine | **Partial** |
| Socratic tutor | `tutorEngine.ts` escalation ladder | **Partial** |
| Assessment and mastery evaluator | `masteryEngine.ts` | **Partial** |
| Revision planner | `spacedReviewScheduler.ts` | **Partial** |
| Curriculum expert | `curriculumService.ts` | **Partial — see §4.1** |
| Homework coach | `homeworkGenerator.ts` | **Partial — see §4.2** |
| Diagnostic teacher | `teacherContextEngine.ts` | **Partial — see §4.3** |
| Adaptive explainer | `teacherContextEngine.ts` | **Partial** |
| Practice generator | `homeworkGenerator.ts` | **Partial** |
| Feed curator | `src/services/reels/` | **Partial — see §4.4** |
| Voice and conversation | `voiceService` + `tutorVoice.ts` | **Good** |
| Learning analyst | `telemetry` | **Weak — see §4.5** |

---

## 4. Gaps, ranked by severity

### 4.1 The French track has lessons but no concept data — **high**

This is the most serious content finding, and it directly affects the actual student
(Grade 5, École Girard, **French track**).

| Curriculum file | Lessons | Concepts | Exercises |
|---|---|---|---|
| `frenchCurriculum.ts` | 4 | **0** | 3 |
| `mathFrCurriculum.ts` | 4 | **0** | 3 |
| `scienceFrCurriculum.ts` | 3 | **0** | 2 |
| *(comparison)* `mathCurriculum.ts` | 12 | 12 | — |
| *(comparison)* `ictCurriculum.ts` | 12 | 12 | — |

**11 French-track lessons carry zero concept records** **[V]**. Concept records are what the
engine uses for mastery, review scheduling and misconception diagnosis. Lessons without concepts
can be opened and read, but they cannot enter the mastery/review loop at all.

Totals for context: 51 lessons, 40 concepts, 80 multiple-choice exercises across 11 subjects
**[V]**. So roughly a fifth of all lessons are structurally outside the adaptive system — and
they are disproportionately the ones this student needs.

### 4.2 Misconceptions are hardcoded, not data-driven — **high**

The research's strongest pedagogical point is that a wrong answer should tell Miss Noor *what*
the student misunderstands, not merely trigger a red cross.

Current state:

- `teacherContextEngine.ts` contains **7 hardcoded `diagnosisType: 'misconception'` blocks**,
  each with an inline English explanation string (e.g. *"applying whole-number rules to fraction
  denominators"*, *"assuming plants consume soil directly as food"*) **[V]**.
- The curriculum data model contains **zero** `misconception`, `distractor` or `commonError`
  fields **[V]**. Concept fields that do exist are `keyPoints`, `sourceText`, `dailyLifeExampleAr/En`,
  `storyAnalogyAr/En`, `prerequisiteAr/En`, `visualType`.
- `evaluateStudentAnswer` returns `{ isCorrect, correctness, feedback? }` — a boolean and a
  coarse `'full' | 'partial' | 'wrong'` band. It does **not** classify a misconception **[V]**.

So the capability is *demonstrated for a handful of curated cases* and *absent as a general
mechanism*. A wrong answer outside those seven hardcoded cases yields no diagnosis. This is
exactly the "red cross" failure the research warns about.

Note the counter-evidence: `reelGenerator.ts` line ~205 already contains the comment
*"Needs a misconception-bearing wrong option from a real exercise"* — a previous session
identified this same gap **[V]**.

### 4.3 "Amina" still appears in shipped source and in curriculum content — **medium**

The legacy product name persists in **91 occurrences across `src/`** **[V]**, including
user-visible curriculum text:

- `frenchCurriculum.ts`: the reading passage is a dialogue where the child character is named
  **Amina** — *"Amina : Je m'appelle Amina. Je suis égyptienne et j'ai 10 ans."*, and an exercise
  asks `Complète : Je __________ Amina.` **[V]**
- `defaultTimetable.ts`, `officialCurriculum.ts`, `aminaCurriculumConfig.ts`,
  `curriculumService.ts`, `spacedReviewScheduler.ts`, `personalizeNoorText.ts`,
  `serverTutorVoice.ts`, `teacherContextEngine.ts` also contain the name **[V]**.

This is a real product defect, not only cosmetic: the French lesson teaches the child to say
"my name is Amina" when the product is Miss Noor. PR #49 fixes **one** such string (a LIBRARY
heading) and adds a JSX-text guard **[V]**; it does not address the curriculum content.

### 4.4 Brand system is defined but not applied — **medium**

| Check | Result |
|---|---|
| Brand tokens defined in `src/index.css` `@theme` | **[V]** `--color-midnight`, `--color-indigo-brand`, `--color-teal-clear`, `--color-apricot-spark`, `--color-cloud`, `--color-paper`, `--color-mist`, `--color-slate-text`, `--radius-brand`, `--font-display` |
| Utility classes used in components (`bg-midnight`, `text-indigo-brand`, `font-display`, …) | **[V] 0 occurrences** |
| `bg-linear-to-*` gradient uses in `src/` | **[V] 49** |

The audit document's "49 gradients" figure is **accurate** — worth noting because Tailwind v4
renamed `bg-gradient-to-*` to `bg-linear-to-*`, so a naive `grep bg-gradient` returns 0 and the
claim looks wrong. I initially made that mistake; the correct pattern confirms the number.

`--font-display` names Cairo, and `index.html` loads Cairo, but no component applies
`font-display` **[V]**.

### 4.5 Homework and Missions are the same screen — **medium**

`src/components/layout/AppShell.tsx` lines 97–98 **[V]**:

```
{activeTab === 'missions' && <MissionsScreen />}
{activeTab === 'homework' && <MissionsScreen />}
```

Two distinct nav destinations render one component. This confirms the research's point that the
product is "split across features instead of orchestrated around the student" — the separation
is a label, not an experience.

### 4.6 Mastery evidence is wired in only two places — **medium**

`addEvidenceToMastery` is called from production code in exactly **two** places:
`missions/missionCompletion.ts` and `myBooks/bookMastery.ts` **[V]**. The teaching session and
the feed do not appear to write mastery evidence. **[H]** — I did not trace every call path, so
this is an inference from call-site count, not a proven negative.

### 4.7 Learning analyst is telemetry, not pedagogy — **medium**

`src/services/telemetry/` measures API cost, latency and degradation mode **[V]**. That is
*operational* telemetry. There is no equivalent for *learning* telemetry: no next-question
correctness, no misconception-resolution rate, no independent-recheck success. The research's
P1 "measure learning and experience quality" has no existing home in the codebase.

### 4.8 Live AI reliability — **medium, already documented**

The functional audit on PR #49 records upstream 503 "high demand" and free-tier 429
(limit 5 req/min), with child-safe fallback text and a `degraded:true` flag **[O]**. The fallback
is correct engineering. The gap is product honesty: a `degraded:true` response is not the same
as personalized tutoring, and the UI should say so plainly rather than let the child believe a
deterministic fallback was Miss Noor's teaching. **[H]** — I did not verify how, or whether, the
UI surfaces the degraded flag.

---

## 5. Corrections to the surrounding reports

I checked the claims that were checkable. Most hold up; two need care.

| Claim | Verdict |
|---|---|
| `main` is `a889e3d`; production serves it | **[V] confirmed** — earlier this session I compared the live bundle byte-for-byte against a local build of `a889e3d`: identical |
| PR #49 head is `f43600e`, open, draft | **[V] confirmed** |
| Audit docs exist on the PR #49 branch | **[V] confirmed** — both `docs/design/*_2026-10-27.md` return 200 |
| "49 gradients" | **[V] confirmed** (via `bg-linear-to`, not `bg-gradient`) |
| Brand tokens defined but unused | **[V] confirmed** |
| Homework == Missions | **[V] confirmed** |
| 1 confirmed contrast failure (G4) | **[V] confirmed and located** — see §5.1 |
| PR #49's branding suite passes | **[V] confirmed** — `BRANDING SUITE SUMMARY: 11 PASSED, 0 FAILED` |

**The one claim I could not reproduce** is the research's framing that Anthropic's skills are
the "starting reference" for implementation. The repository is real and licensed for that use
**[V]**, but its curriculum standards are US-oriented **[O]**, so its *structure* transfers and
its *content* does not. It should be adopted as a design pattern, with Egyptian and French-track
sources supplied separately.

### 5.1 The G4 contrast failure, independently reproduced

The visual audit reported a 12px line measuring ≈2.5:1 on a near-white card **[O]**. I found the
element and computed the ratio from the Tailwind hex values using the WCAG relative-luminance
formula.

The element is the book reference under each lesson title, rendered as `text-xs text-slate-400`
on a white card in two places:

- `src/components/curriculum/CurriculumBrowser.tsx:388`
- `src/components/curriculum/CurriculumBrowser.tsx:574`

```jsx
<p className="text-xs text-slate-400">
  {isAr ? lesson.sourceRef.bookAr : lesson.sourceRef.bookEn}
</p>
```

Computed results **[V]**:

| Foreground | Background | Ratio | AA (<18pt) |
|---|---|---|---|
| `slate-400` `#94a3b8` | white `#ffffff` | **2.56:1** | **fails 4.5:1** |
| `slate-400` | `slate-50` `#f8fafc` | 2.45:1 | fails |
| `slate-400` | `cloud` `#f6f7fb` | 2.40:1 | fails |
| `slate-500` `#64748b` | `slate-100` `#f1f5f9` | 4.34:1 | fails, narrowly |

This is the exact string the audit quoted — `اللغة العربية — تواصل ص. 6-11` is the `bookAr`
value in `src/data/curriculum/arabicCurriculum.ts:28` **[V]**. My computed 2.56:1 agrees with the
audit's reported ≈2.5:1, so G4 is real and correctly measured.

I also checked the candidates I first suspected and **they pass**, so they should not be "fixed":

| Foreground | Background | Ratio | Verdict |
|---|---|---|---|
| `amber-300` on `emerald-950` (chalkboard header) | — | 10.51:1 | passes |
| `indigo-200` on `indigo-700` (lesson strip) | — | 5.30:1 | passes |
| `indigo-200` on `purple-800` | — | 5.85:1 | passes |
| `emerald-400` on `emerald-950` | — | 7.88:1 | passes |

The minimal fix for G4 is to raise those two `text-slate-400` occurrences to `text-slate-500`
(4.34:1, still short) or better `text-slate-600` (7.58:1 on white) so the book reference meets AA.


---

## 6. Recommended next work, in dependency order

This is the ordering I would defend; each step is scoped to be verifiable.

1. **Make the French track teachable (unblocks everything).** Add concept records for the 11
   French-track lessons so they can enter the mastery and review loops. Without this, no amount
   of skill architecture helps the actual student. *Evidence required:* concept count per French
   lesson goes from 0 to ≥1, and a French lesson completes a mastery + review cycle.

2. **Make misconception data first-class.** Add `misconception` and distractor fields to the
   curriculum model; extend `evaluateStudentAnswer` to return a misconception identifier instead
   of only `correctness`. Then a wrong answer can drive `adjust` with a targeted explanation.
   *Evidence required:* a wrong answer on a lesson *without* a hardcoded diagnosis block produces
   a specific, content-sourced explanation. That is the acceptance test that currently fails.

3. **Fix the legacy name in curriculum content.** The French reading passage names the child
   "Amina". This is child-visible and wrong. *Evidence required:* no user-facing curriculum text
   contains the legacy name; extend the PR #49 guard to scan `src/data/`.

4. **Separate Homework from Missions**, or delete one. *Evidence required:* the two nav entries
   render different components with different, documented purposes.

5. **Apply the brand tokens** to real components and reduce gradient reliance. *Evidence
   required:* utility-class usage count rises from 0; the visual audit is re-run and the
   gradient count falls.

6. **Wire mastery evidence into the teaching session and feed** (after confirming §4.6). *Evidence
   required:* call sites of `addEvidenceToMastery` include the session and feed paths, with a test.

7. **Add learning telemetry** alongside the existing cost/latency telemetry. *Evidence required:*
   next-question correctness and independent-recheck success are recorded per session.

Only after steps 1–3 should the specialist-skill architecture be built, because those three
determine whether the skills have trustworthy curriculum and diagnosis to work from.

---

## 7. Boundaries and limitations of this audit

- **No product code was changed.** This is a documentation-only commit on an audit branch.
- **No merge, no deploy.** PR #7, #8, #10, #46, #47, #49, #50 were not merged or modified.
- **[B] Not verified:** the contrast ratio (G4), the live Gemini audio, and the full learner
  journey end-to-end. The browser harness was run earlier this session for the voice fix
  (10 screens, 0 console errors **[V]**), but not for this audit.
- **[B] Not verified:** whether the UI surfaces the `degraded:true` flag to the child.
- **[H] Inferences** are labelled as such and should be confirmed before being treated as fact.
- Counts were taken on `main` @ `a889e3d`. `grep`-based counts can drift as code changes; the
  exact commands are reproducible from the patterns quoted above.

## 8. Sources

- Repository, `main` @ `a889e3d` (this session).
- PR #49 branch `openhands/brand-jsx-text-guard` @ `f43600e`: `docs/design/FUNCTIONAL_AUDIT_2026-10-27.md`,
  `docs/design/LOOK_VS_SHOULD_BE_2026-10-27.md`.
- `https://github.com/anthropics/k12-teacher-skills` — Apache-2.0, four K-12 skills verified via API.
