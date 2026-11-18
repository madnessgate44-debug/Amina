# Miss Noor Anime Companion — Implementation Plan

**Status:** Planned; design-system specification committed separately  
**Owner direction:** Option 3 — Anime Companion  
**Repository:** `madnessgate44-debug/Amina`  
**Baseline main SHA inspected:** `883127facf34e256e7490a48622b9d14c695f6a3` (18 November 2026)  
**Execution branch:** `design/noor-anime-companion-system`

## 1. Outcome

Transform the learner-facing Miss Noor experience from a dashboard-oriented school app into one character-led conversational teaching space. Noor is the primary interface; teaching, questions, exercises, feedback and assessment happen in one continuous conversation. Secondary resources live in a minimal backpack drawer.

The redesign must preserve Grade 5 curriculum records, source provenance, teaching engine behavior, learner evidence, mastery logic, homework semantics and existing persistence unless a separately approved product requirement changes them.

## 2. Authority and scope reconciliation

The owner-selected product brief (18 November 2026) is the current product direction. It narrows the primary information architecture to one conversational screen and a three-item backpack drawer. The pre-existing repository visual-redesign skill and PR #169 describe a broader multi-surface redesign. Reconcile them as follows:

- Retain the skill's quality gates: audit all existing screens and states, Arabic/French/English, phone/desktop, accessibility, real browser screenshots and regression protection.
- Do not preserve dashboard navigation merely to satisfy the older multi-screen scope.
- Existing Home, Feed, Homework, Library, Missions and classroom capabilities must be inventoried and mapped to conversation or backpack access before removal or relocation.
- No learning capability or curriculum record may be deleted as a visual simplification.
- PR #169 is an existing redesign workstream; inspect its current head and changed files before deciding whether this branch should supersede, extend or remain separate. Do not create duplicate competing redesign PRs.

## 3. Requirements and acceptance criteria

| ID | Requirement | Acceptance criterion |
|---|---|---|
| R1 | Anime Companion character | Original adult teacher design; consistent across seven states; no recognizable franchise copying |
| R2 | Three-zone conversational screen | Character stage, continuous conversation and composer work on phone without overlap |
| R3 | Backpack drawer | Only My Books, My Streak and What We Covered; accessible without gesture |
| R4 | Conversational teaching | One question at a time; specific response to learner answer; guided correction; <=3 Noor sentences by default |
| R5 | Multilingual behavior | Arabic default RTL; French/English LTR; curriculum-track language behavior preserved |
| R6 | Character animation | Idle, five emotions, thinking and celebration; reduced-motion behavior |
| R7 | Voice interaction | Mic permission/listening/transcript/error/unavailable states; Android interaction works |
| R8 | Curriculum integrity | No curriculum, evidence, mastery or homework behavior lost; source provenance retained |
| R9 | Accessibility | >=44px targets, >=16px body text, contrast, focus, keyboard/screen-reader labels, no overflow |
| R10 | Privacy and child safety | No fabricated memory/progress; parent-controlled notification behavior; no guilt mechanics |
| R11 | Release quality | Typecheck, lint, tests, build and screenshot-led browser QA pass before PR closure/release |

## 4. Baseline inspection — required before UI edits

1. Re-read root `AGENTS.md` and `ENGINEERING_EXECUTION_OS.md` on the implementation run.
2. Inspect the current PR list and PR #169's branch/head/diff. Preserve the standing rule never to merge PR #8.
3. Run `npm run audit:ui` and retain its output.
4. Inventory routes, app shell, Home, Feed, Homework, HomeworkRunner, classroom/teaching session, Library, Missions, onboarding, menus, dialogs, empty/loading/error/success states.
5. Inspect localization source, Arabic direction switching, font loading, IndexedDB settings/student stores, conversation persistence, teaching engine, voice flow and curriculum routing.
6. Capture actual baseline browser screenshots at 390×844 and 1365×900 in Arabic, French and English where browser harness supports locale seeding.
7. Record the existing test baseline and identify failures before edits. Do not attribute pre-existing failures to the redesign.

**Baseline evidence is not yet captured by this document.** No screenshots or test results are claimed here.

## 5. Implementation phases

### Phase A — Design system and character asset
- Apply `docs/NOOR_DESIGN_SYSTEM.md` tokens to Tailwind v4 `@theme`, retaining compatibility aliases until usages are migrated safely.
- Verify actual Arabic/Latin font loading and line metrics.
- Build the original layered SVG character asset and the seven state variants.
- Implement state transitions with the already-installed Motion package and CSS idle loops.
- Add reduced-motion behavior and accessible state announcements.
- Review the character asset at small size before wiring it into the main app.

**Exit gate:** tokens compile; character has seven distinct states; no new dependency; contrast and reduced-motion tests pass.

### Phase B — Conversational shell
- Replace dashboard-first entry with Noor's three-zone screen.
- Preserve the current conversation/teaching engine boundary; do not fork or duplicate teaching logic in UI components.
- Build the feed as a continuous transcript with learner and Noor turns.
- Build a keyboard-safe composer with RTL input, send and prominent mic control.
- Make thinking a character state, not a spinner or full-screen loading screen.
- Ensure the newest message remains visible above the composer and Android keyboard.

**Exit gate:** a learner can open the app, receive Noor's opening, answer one question, receive a response, and continue without navigating a subject tile or lesson screen.

### Phase C — Backpack and capability mapping
- Implement accessible open/close behavior (swipe plus explicit control).
- Map My Books to the existing PDF/book library.
- Map My Streak to verified activity only; never invent or guilt the learner about a broken streak.
- Map What We Covered to real persisted session/topic records.
- Map existing homework, missions and revision workflows into conversation entry points; preserve the underlying capabilities and data.
- Remove redundant dashboard destinations only after every capability has a tested replacement path.

**Exit gate:** all retained learning resources remain reachable and their existing semantics/tests remain intact.

### Phase D — Conversation and language behavior
- Implement session opening based on real previous-session data; use a safe first-session opening if no memory exists.
- Enforce one-question-per-turn and react-before-advance behavior in the orchestration/presentation contract.
- Keep wrong-answer remediation scaffolded; do not reveal the answer immediately.
- Apply Arabic default, curriculum-specific French for Science/Math where applicable, French-only for French subject, and learner override commands.
- Keep Noor turns to three sentences by default.
- Implement intentional session close based on actual topics covered.

**Exit gate:** automated conversation tests cover correct, incorrect, partial, off-topic, language-switch, first-session and resumed-session paths.

### Phase E — Voice, sound and micro-interactions
- Audit current voice implementation before changing it; preserve working Android voice capture.
- Expose permission denied, unsupported browser, listening, empty transcript and network/model error states.
- Add optional original sound cues only if locally available and properly licensed; never block learning on sound.
- Respect browser autoplay restrictions and mute preference.
- No new paid API or external account.

**Exit gate:** voice flow works on supported Android browser; unsupported/denied cases remain usable through text.

### Phase F — Visual and regression QA
- Run typecheck, lint, full test suite and production build.
- Run phone UI/accessibility checks.
- Browser-test 390×844 and 1365×900 for Arabic, French and English.
- Verify onboarding, opening, answer/reply, language override, voice, backpack, books, streak, topic timeline, homework/mission handoff, keyboard and reload/resume.
- Inspect screenshots visually; verify no horizontal overflow, clipping, hidden composer, unreadable type or accidental dashboard remnants.
- Run the repository's secret/privacy redaction checks before pushing any generated/private content. Do not commit child transcripts, private memories, textbook binaries or secrets.

**Exit gate:** all R1–R11 have evidence; changed files/diff reviewed; screenshots included in PR; no unsupported production-ready claim.

## 6. Suggested implementation sequence

1. Baseline audit and PR #169 reconciliation.
2. Token migration and original character asset.
3. Character stage + conversation feed + composer.
4. Backpack and capability mapping.
5. Conversation behavior and language switching.
6. Voice/sound state integration.
7. Accessibility, regression and screenshot-led QA.
8. Open/update one coherent PR with evidence. Do not merge or deploy without the required release authorization and verified checks.

## 7. Risks and controls

| Risk | Control |
|---|---|
| Replacing dashboard accidentally hides existing capabilities | Build a capability-to-entry-point map and test each destination before removing old navigation |
| Anime art feels too young or generic | Keep Noor visibly an adult teacher; review silhouette, facial expression and costume as one consistent original design |
| Motion causes distraction or poor battery use | CSS-only low-cost idle loops; no continuous high-cost canvas; reduced-motion support |
| Arabic layout breaks mixed equations/numerals | Logical CSS, bidi isolation and locale-specific screenshot tests |
| Session memory invents continuity | Only reference persisted, learner-scoped facts; safe fallback when absent |
| Streak mechanics pressure a child | Neutral language; no loss-shaming, urgency or fabricated activity |
| Existing PR #169 duplicates this work | Inspect and reconcile its head/diff before opening a second redesign PR |
| CI green but product behavior broken | Real browser pointer interactions and side-effect assertions, not build-only acceptance |

## 8. Verification ledger template

Populate only with real command/action output during execution.

| Action | Exit/result | Raw output excerpt | Timestamp | Status |
|---|---|---|---|---|
| `npm run audit:ui` | NOT RUN | — | — | NOT RUN |
| `npm run lint` | NOT RUN | — | — | NOT RUN |
| `npm test` | NOT RUN | — | — | NOT RUN |
| `npm run build` | NOT RUN | — | — | NOT RUN |
| Browser screenshots + interaction checks | NOT RUN | — | — | NOT RUN |

## 9. Explicitly not authorized by this plan

- Merge to main or deploy to production.
- Merge PR #8 (explicitly prohibited by standing owner instruction).
- Delete curriculum, homework, mission, student-evidence or conversation data.
- Add paid services, paid assets, new external accounts or new dependencies without a separately evidenced need and authorization.
- Send notifications or messages outside the app.
- Claim complete curriculum coverage, child retention or production readiness without corresponding evidence.

## 10. Current state

- Design direction: **APPROVED** — Anime Companion, Option 3.
- Design-system specification: **AUTHORED**.
- Implementation plan: **AUTHORED**.
- UI implementation: **NOT STARTED by these documents**.
- Baseline screenshots and test runs: **NOT RUN**.
- PR creation, merge and deployment: **NOT RUN**.
