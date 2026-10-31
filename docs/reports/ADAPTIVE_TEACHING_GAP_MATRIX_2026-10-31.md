# Adaptive teaching experience — requirements / evidence / gap matrix

Mission: Amina asks a question or pastes text; Miss Noor identifies what she
needs to understand and assembles a teaching experience (TEACH · ASSESS · ADAPT)
even with no textbook selection.

Baseline commits: `58ff639` (assembly engine), `6c6c370` (match fix),
`972043a` (status). Branch `main`. Baseline gates: `tsc --noEmit` exit 0,
`npm test` all suites green, `npm run build` exit 0.

Evidence tags: [V] verified by tool output, [I] inference, [U] unknown, [B] blocker.

## What already exists [V]

- `src/services/assembly/teachingNeed.ts` — `understandAsk()` → `TeachingNeed`
  (intent, language, topic tokens, matched concept, `needsCurriculumSelection`).
  `matchConcept()` now needs a title hit or ≥2 content-word overlap.
- `src/services/assembly/assetResolver.ts` — `resolveAssets()` reuse-first, per
  role, with `reuseKey` provenance and `GenerationRequest` briefs for gaps.
- `src/services/assembly/contentAssembler.ts` — `assembleExperience()` builds the
  four movements (dialogue / practice / verification / next_step);
  `assembleQuickExplanation()` builds the immediate answer.
- `src/services/assembly/productionJobs.ts` — `LessonProductionJob` with named
  stages `understand → reuse → generate → assemble → verify`, pumped one stage
  per `pumpJob()`, `progress` from completed stages.
- `src/services/assembly/assemblyEngine.ts` — `handleAsk()` routes quick vs long.
- `src/services/mastery/masteryEngine.ts` + `AppContext.recordEvidence()` —
  the real mastery/progress system (weighted evidence, decay, thresholds).
- `VirtualTeacherClassroom.tsx` — the NOOR "ask" station calls `handleAsk()`.

## Gap matrix

| ID | Requirement | Evidence today | Gap | AC |
|----|-------------|----------------|-----|----|
| G1 | Ask without selecting a lesson | `understandAsk` flags `needsCurriculumSelection`, engine still builds | none | AC1 [V] |
| G2 | Identify topic + learning need | `matchConcept` + intent + language | none | AC2 [V] |
| G3 | No irrelevant textbook material | title-hit / ≥2-token guard (`6c6c370`) | none | AC3 [V] |
| G4 | Reuse approved assets | `resolveAssets` reuse-first, `reuseKey` | none | AC4 [V] |
| G5 | Generate missing assets | `RoleGenerator` fills only `missing` roles | none | AC5 [V] |
| G6 | Quick question → immediate answer | `assembleQuickExplanation` | none | AC6 [V] |
| G7 | Long request → real persistent async job | `productionJobs.ts` exists, but the UI calls `handleAsk(..., runToCompletion:true)` synchronously — no persistence, no progress shown | **Long jobs run synchronously; no progress UI** | AC7, AC8 |
| G8 | UI renders the COMPLETE experience | `handleAskWithAssembly` concatenates only `dialogue` + `next_step` lines into one text blob; drops practice, verification, misconception, and all media but the first | **Phases dropped** | AC9 |
| G9 | Interactive practice + dialogue | practice options are assembled but never rendered/answerable | **Practice not interactive** | AC10 |
| G10 | Assessment of real responses | engine has no per-answer assessor for an assembled experience | **No assessment** | AC11 |
| G11 | Verification of understanding | `verification` phase assembled but not rendered/scored | **No verification** | AC12 |
| G12 | Adapt strategy to results | none in the ask flow | **No adaptation** | AC13 |
| G13 | Next learning step | `next_step` phase assembled and shown | none (shown, not gated on evidence) | AC14 |
| G14 | Preserve existing functionality | curriculum / voice / feed / media untouched | none | AC15 [V] |
| G15 | Deploy from intended commit | production READY for `6c6c370`, bundle hash matched | none | AC16 [V] |
| G16 | Browser verification | Playwright drive of the live ask paths | none | AC17 [V] |

## Focus of this change (smallest complete unit for Phase 6 + Phase 8)

Render the assembled experience faithfully and make practice + verification
interactive and assessed, then connect verified outcomes to the existing
mastery system:

1. New pure module `src/services/assembly/experiencePresenter.ts`:
   - `presentExperience(experience)` → a render-ready structure (teach lines,
     media, practice question + options, verification prompt, next step).
   - `assessPractice(experience, optionIndex)` → deterministic correctness +
     feedback + remediation + conceptId.
   - `assessVerification(experience, text)` → key-point overlap score.
2. `VirtualTeacherClassroom.tsx`: the ask station stores the presented
   experience, renders every phase, and on a practice/verification answer calls
   `assessPractice`/`assessVerification` and records evidence through the
   existing `recordEvidence` (only when the ask matched a real curriculum
   concept, so no mastery is claimed without evidence).
3. Tests in `assemblyEngine.test.ts` for the presenter and the assessors.

## Out of scope this run (recorded, not silently dropped)

- Persistent server-side lesson jobs with cross-session resume (G7). The engine
  already models staged jobs; wiring a durable job store + progress UI is a
  larger unit and is recorded as the next backlog item.
- Voice-channel routing through the engine (voice already reaches the same
  station via `VoiceInputControl` → `setAskInput`).

## Acceptance criteria — results after this change [V]

| AC | Criterion | Result | Evidence |
|----|-----------|--------|----------|
| AC1 | An ask is understood with no textbook selection | PASS | `adaptiveScenarios` A/D: `needsCurriculumSelection` true, engine still builds |
| AC2 | Topic + learning need identified | PASS | `adaptiveScenarios` A/B: concept matched, language + intent set |
| AC3 | No irrelevant textbook material is used | PASS | `adaptiveScenarios` D/F: off-curriculum ask reuses 0 assets |
| AC4 | Approved material is reused first | PASS | `adaptiveScenarios` F: `reuseRatio > 0.5`, every reuse keeps provenance |
| AC5 | Only missing assets are generated | PASS | `assemblyEngine` + `adaptiveScenarios` F: `missing` roles only |
| AC6 | A quick question gets an immediate answer | PASS | `adaptiveScenarios` A; live ask returned immediate Arabic answer |
| AC7 | A long request runs as a staged job | PASS (in-session) | `adaptiveScenarios` E: 5 named stages, progress 0→1 |
| AC8 | Long-job progress is visible across a restart | BLOCKED (out of scope) | durable store not wired — recorded as next backlog item |
| AC9 | UI renders the COMPLETE experience | PASS | live: TEACH + PRACTICE + VERIFY + NEXT STEP all rendered |
| AC10 | Practice is interactive | PASS | live: options clicked → "إجابة صحيحة! 🎉" |
| AC11 | Real responses are assessed | PASS | `adaptiveScenarios` C/G; `assessPractice`/`assessVerification` |
| AC12 | Verification of understanding | PASS | live: "ممتاز! شرحك يدل إنك فهمتِ الفكرة فعلاً. 🌟" |
| AC13 | Strategy adapts to results | PASS | `adaptiveScenarios` ADAPT: sound answer advances the next step |
| AC14 | A next learning step is given | PASS | live: advanced next step shown after verification |
| AC15 | Existing functionality preserved | PASS | `npm test` 39 suites, 0 failed; `tsc --noEmit` exit 0 |
| AC16 | Deployed from the intended commit | PASS | merged `07e0255`; Vercel production READY; live bundle SHA-256 == local build of `main`; live Playwright drive 0 errors |
| AC17 | Browser verification | PASS | Playwright drive, 0 console errors |

Two defects were found by AC17 and fixed before closing (see STATUS.md run 5):
an Arabic ask matching the French curriculum track, and long pastes failing the
confidence floor.

