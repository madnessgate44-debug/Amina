# Miss Noor — Visual Branding & Complete Function Audit
**Report date:** 2026-10-22  
**Repository:** `madnessgate44-debug/Amina`  
**Evidence baseline:** historical readiness audit dated 2026-10-21; design branch browser evidence run 39738852961; current branch source inspection.  
**Important:** This is a consolidated audit, not a claim that every function was re-tested on the current head. Statuses explicitly distinguish historical evidence, partial verification, and unverified behavior.

## Executive summary
The product has a substantial learning-engine architecture and four established destinations: HOME, FEED, LIBRARY, NOUR. The previous readiness audit reports working adaptive teaching tests and real textbook reading, but it also identifies critical product gaps: no purchase/licensing flow and no server-side cross-device progress persistence. Some learner-facing flows were not exercised end-to-end. The visual browser evidence is from an earlier build; rerun on current head before treating the design findings as closed.

**Current brand decision:** the owner says the product name is **Miss Noor**. Do not use “Bemis Noor.” The prior Figma concept and repo docs use “Amina”; that is now a branding inconsistency to resolve. Do not assume whether the app and the AI teacher should be one shared name or separate identities; document the current owner decision and propose a clear naming architecture before changing technical identifiers.

## 1. Visual brand sheet — target direction and audit criteria
Figma concept (historically named “Amina — Deep Design Direction”): https://www.figma.com/design/OtmW0yS6txIKCmquViINil

| Brand surface | Required state | Current evidence / gap | Acceptance check |
|---|---|---|---|
| Product name | “Miss Noor” spelled consistently | Latest owner decision conflicts with “Amina” in current docs and Figma file name | Search all user-facing strings, metadata, icons/manifest, onboarding and headings; no unintended old name remains |
| Teacher identity | Clear AI teacher identity | Previous browser finding says app header and teacher were conflated; code branch had separated product header from teacher subtitle, but that separation may conflict with the new brand decision | Header, teacher room, and copy make it clear what the app is and who Miss Noor is |
| Logo / app icon | One recognizable, legible mark at small sizes | Not proven by the inspected reports | Inspect installed/PWA icon assets at 48–192 px; check contrast and silhouette |
| Color system | Consistent warm-light learning UI with controlled accent palette; focused dark immersive Feed is allowed | Figma is a concept, not implementation evidence | Extract actual CSS tokens and compare rendered HOME/FEED/LIBRARY/NOUR |
| Typography | Clear hierarchy; Arabic and French accents render correctly | Mixed-language inconsistency was a prior finding; current rerun not confirmed | Test French, English, Arabic RTL at phone width; inspect clipping, line height, hierarchy |
| Navigation | HOME / FEED / LIBRARY / NOUR remain the four primary destinations | Four tabs rendered in historical browser evidence | Tap every destination on current build; verify active state, back behavior and no dead ends |
| Cards and actions | Consistent visual grammar and explicit purpose | Duplicate/competing patterns are included in the audit scope; no complete current inventory yet | Compare repeated cards/actions across all four destinations and consolidate only when evidence supports it |
| Loading/empty/error/success | Truthful, recoverable states | Historical source audit found truthful missing-textbook states; every screen state not yet tested | Exercise each state; no blank/infinite loading or false success |
| Accessibility | Readable contrast, usable tap targets, focus and screen-reader labels, reduced-motion support | Not comprehensively verified | Automated and manual checks at phone viewport, keyboard/focus where supported |
| PWA/install branding | Product name, icons and update behavior agree | Release configuration exists; live deployment not confirmed | Inspect manifest/title/icons, install prompt and deployed metadata |

## 2. Function-by-function inventory
Statuses reflect the October 21 audit unless explicitly labelled “needs current rerun.”

| ID | Function / agent requirement | Expected location / evidence | Reported status | What remains |
|---|---|---|---|---|
| F01 | Four primary destinations | `AppShell.tsx`, `BottomNav.tsx` | Historical runtime PASS | Rerun navigation on current head |
| F02 | HOME: today's plan, next action, study-time choice, subjects, due work | `HomeScreen.tsx`, timetable/context services | Historical runtime PASS for visible home and truthful empty tasks | Verify each CTA and data source; timetable is a static seed until edited/imported |
| F03 | FEED: multiple curriculum-connected learning items | `FeedScreen.tsx`, `curriculumService` | Historical PASS for 5+ cards | Re-test vertical scrolling, viewport fit, item diversity, no duplicate filler |
| F04 | Feed item → contextual NOUR session | `FeedScreen.tsx` → companion context | Historical PASS for launch action | Verify lesson context and language after launch |
| F05 | Save Feed item and find it in Library | App context saved-content APIs | PARTIAL; end-to-end save destination not tested | Save, leave Feed, locate, reopen, remove; confirm one source of truth |
| F06 | LIBRARY: all subjects and curriculum discovery | `CurriculumBrowser.tsx`, curriculum services | Historical runtime showed 9 subjects | Re-test French/English subject search and actual available lesson depth |
| F07 | Lesson → shared adaptive teacher session | `CurriculumBrowser.tsx`, teaching services | Historical 7/7 proving lessons passed | Rerun suite and one browser journey per entry point |
| F08 | Diagnose learner understanding | `teacherContextEngine.ts`, `tutorEngine.ts` | Historical tests PASS | Recheck response-driven diagnosis against real current code |
| F09 | Adapt teaching strategy | `teachingSession.ts`, teacher/tutor services | Historical tests PASS as part of adaptive loop | Confirm alternate strategy on repeated mistake |
| F10 | Teach grounded in selected lesson | curriculum context + teacher services | Historical tests PASS | Verify French-track lesson context and no generic fallback |
| F11 | Practice and analyze reasoning | teaching/teacher services | Historical tests PASS; one-word explain-back rejected | Rerun negative and partial-answer cases |
| F12 | Recheck after misconception | adaptive loop tests | Historical tests PASS as part of loop | Verify non-identical recovery question/explanation |
| F13 | Verify outcomes before recording mastery | `masteryEngine.ts`, integrity tests | Historical PASS | Confirm mastery not granted solely by ending quiz |
| F14 | Resume interrupted sessions | teaching session storage | Historical resumability test PASS | Verify browser reload/navigation on current build |
| F15 | Record progress/mastery evidence | mastery/context/storage services | PARTIAL overall due client-only persistence | Verify event evidence and durability; server sync remains absent |
| F16 | Curriculum textbook reader and page navigation | `BookReader.tsx`, `bookLibrary.ts` | Historical browser PASS for 7 books | Re-test page loading, unavailable states, offline behavior |
| F17 | Real chapter index / jump to lesson page | `tools/curriculum/toc.py`, book manifests, reader drawer | Historical browser PASS; 9 source PDFs parsed | Rerun parser tests and validate all displayed page jumps |
| F18 | Full available book pages, on-demand/offline cache | server curriculum route, service worker, `bookLibrary.ts` | Historical PASS for seven rendered books | Five subjects still lacked rendered books per audit; verify current inventory |
| F19 | Truthful missing-content state | `CurriculumBrowser.tsx`, reader | Historical source/runtime PASS | Check each missing-book subject and network failure |
| F20 | French-track curriculum and subject naming | `mathFrCurriculum.ts`, `scienceFrCurriculum.ts`, curriculum service | Historical PASS for proven French Maths/Science lessons | Audit consistency across all surfaces and language modes |
| F21 | French / English / Arabic localization and RTL | UI components and locale controls | PRIOR P1 mixed-language finding; follow-up edits exist but need rerun | Check every screen and interactive state in each supported language |
| F22 | Homework with photo/handwriting submission and correction | `HomeworkRunner.tsx`, `/api/check-homework` | NOT VERIFIED end-to-end | Upload an actual photo, inspect response/error, verify result is contextual and safe |
| F23 | Planner / timetable editing and due work | home/timetable/context modules | PARTIAL: realistic static seed and saved override reported | Confirm edit/import experience and that user-entered data drives home |
| F24 | Daily review queue | daily/spaced review services | PARTIAL: evidence-driven queue, empty for new learner | Seed first review after completed lesson; verify due date and action |
| F25 | Weekly review | weekly review generator and types | Source exists; current runtime NOT VERIFIED | Run a complete weekly summary journey and check truthful evidence |
| F26 | Saved items, notes and folders | `collectionService.ts`, AppContext saved APIs | PARTIAL; end-to-end surface not proven | Create folder, save, add note, reopen, delete, confirm no duplicates |
| F27 | Parent dashboard / PIN / weekly summary | parent service + dashboard modal | Parent layer exists historically | Exercise linking/PIN and verify parent view uses real child data |
| F28 | Purchases, entitlement, licensing | no verified implementation in readiness audit | FAIL / absent | Critical business decision and purchase/access design required; do not invent provider/pricing |
| F29 | Cross-device/server persistence | IndexedDB storage service | FAIL; progress local to browser | Design and implement secure backend student/progress store only after data/privacy plan |
| F30 | Gamification / challenges / sound | gamification service, stage engine, sound effects | Source modules exist; full journey NOT VERIFIED | Identify user-facing entry points, verify reward truth and mute/accessibility controls |
| F31 | Voice-first teacher interaction | voice services and tutor speech service | Source exists; current runtime NOT VERIFIED | Test permissions, speech recognition/synthesis, unsupported-browser fallback and text alternative |
| F32 | Visual explanation rendering | `visualRenderer.tsx` | Source exists; coverage NOT VERIFIED | Verify diagrams render safely and remain tied to lesson objective |
| F33 | Student scope isolation / no fake student fallback | AppContext and integrity tests | Historical PASS | Rerun integrity tests; verify no cross-student data leakage |
| F34 | Server-side secret handling / tutor API | `server.ts`, health endpoint | Historical health and live tutor response PASS | Rerun secret-safe health check without exposing secret values |
| F35 | PWA / deployment / release channel | workflows, Dockerfile, render config, service worker | Config PASS; live deployment NOT VERIFIED | Confirm deployment target and post-deploy health with owner approval |
| F36 | Token/cost discipline | deterministic curriculum parser, model services | Historical PASS for offline TOC parsing | Verify no unnecessary paid API calls in routine curriculum ingestion |
| F37 | Accessibility, responsive layout, scroll safety | all screens and shared components | Historical screenshots: no horizontal overflow; not full accessibility pass | Run current 390×844 and desktop checks; contrast, labels, focus, tap targets, reduced motion |
| F38 | Safe loading, error, retry, empty, success states | all asynchronous screens/services | Partial coverage in matrix | Exercise each critical flow with network/API failures and confirm recovery |
| F39 | No duplicate or competing UX patterns | HOME/FEED/LIBRARY/NOUR and contextual modals | Audit requirement; full cross-screen inventory incomplete | Record each duplicate with evidence and propose smallest consolidation |
| F40 | Synthetic learner task loop | design-lab runner and learner matrix | First run BLOCKED by stale element indexes/disabled submit; later retry not confirmed | Run again with fresh indexes; report task-level pass/fail and trace; never present as real-child research |
| F41 | Browser evidence / screenshots | workflow `amina-design-lab-browser-evidence` | Historical run 39738852961 generated 12 screenshots | Rerun on current commit and link artifact; prior screenshots are baseline only |
| F42 | Build/test/typecheck/release checks | CI workflow | Historical tests/build passed at earlier states | Run on exact current head; record SHA and logs |
| F43 | Brand identity migration to Miss Noor | header, page title, PWA metadata, onboarding, docs, Figma | NEW owner decision; migration not yet completed/verified | Inventory occurrences; align user-facing identity and Figma before touching risky technical IDs |
| F44 | Figma concept vs real product parity | Figma file and current browser screenshots | Concept exists; no current parity verification | Capture current app to Figma, compare screen-by-screen and mark concept-only elements |

## 3. Severity-ranked release blockers
1. **Critical — purchase/access model absent.** The owner must decide pricing and entitlement model before implementation.
2. **Critical — no server-side cross-device persistence.** Requires a secure data ownership/privacy design before implementation.
3. **High — missing full digital books for several subjects.** Audit the real source inventory; do not fabricate coverage.
4. **Medium — day-one review queue empty for new learners.**
5. **High — brand migration unfinished.** “Miss Noor” is the owner-approved name; the current repository/Figma still carries Amina naming in historical surfaces.
6. **High — current visual and synthetic-user verification incomplete.** Existing browser artifacts are baseline evidence, not proof of the latest code.
7. **Unverified — homework photo correction, voice, folders/notes, parent flow, weekly review, accessibility, deployment live status.**

## 4. Visual report storyboard
Use these report panels as the visual audit layout:
1. **Brand cover:** Miss Noor; brand status = decision confirmed, implementation audit pending.
2. **Four-screen map:** HOME / FEED / LIBRARY / NOUR; each panel labels purpose, expected action, key states, and current evidence.
3. **Teaching loop:** Context → Diagnose → Teach → Practice → Analyze → Adapt → Verify → Next action; only claim tested steps backed by current tests.
4. **Curriculum/book map:** nine reported subjects; seven rendered books in historical audit; identify missing full books without implying unavailable content exists.
5. **Function heatmap:** PASS / PARTIAL / FAIL / NOT VERIFIED for F01–F44.
6. **Critical blockers:** billing/access, cross-device persistence, curriculum depth, new-learner review, brand parity.
7. **Evidence and next actions:** exact commit, workflow run, screenshots/artifacts, learner traces, outstanding tests.

## 5. Required next verification pass
- Confirm current branch and commit SHA.
- Run lint, tests, production build, model smoke where configured, and `git diff --check`.
- Run browser audit on phone (390×844) and desktop; capture screenshots of HOME, FEED, LIBRARY, NOUR, onboarding, French mode and Arabic RTL.
- Exercise each critical interactive function listed above, not just route presence.
- Retry synthetic learner walkthrough and save action trace.
- Compare current screenshots against the Figma concept and record every discrepancy.
- Update this report with current-run evidence and links; retain the previous statuses as historical where not rerun.
- Do not merge or deploy without owner approval.
