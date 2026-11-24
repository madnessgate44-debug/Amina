# Miss Noor Grade 5 Term 2 — OpenHands Implementation Order

**Version:** 2.0 — ownership and scope correction  
**Scope:** Grade 5, École Girard, Alexandria, 2026–2027, Term 2  
**Coordination:** PR #208  
**Curriculum research record:** PR #212  
**Observed main baseline:** cdd6dd0281241a0b5ddb0f013bc4f037da009d7d (24 November 2026)  
**Release authority:** repository owner only

> This is an implementation specification for OpenHands. It supersedes older instructions in this document that assigned curriculum research, source auditing, curriculum mapping, pedagogy, product requirements, or independent QA to OpenHands. It does not certify any subject or lesson as complete.

## 1. Fixed operating ownership

### ChatGPT — all non-coding ownership

ChatGPT owns and performs:

1. Curriculum and source research for every required subject.
2. Retrieval and inspection of student books, teacher guides, assessments, term distributions, school-issued booklists and publisher sources.
3. Source title, grade, year, term, language, edition, page, URL, hash, authority and applicability verification.
4. Separation of Ministry baseline, Girard-confirmed assignment, publisher material, historical reference and app-authored content.
5. Subject-by-subject source register and unit → lesson → concept → objective → exercise mapping.
6. School-confirmation gaps and track/subject applicability decisions.
7. Pedagogical design and complete Miss Noor teaching specifications.
8. Product requirements, media requirements, QA strategy and test design.
9. Preparation of implementation-ready tickets, acceptance criteria and materials.
10. Independent review of OpenHands code, diffs, tests, mobile UX, lesson reachability, media playback/captions, assessment behavior and progress tracking.
11. All non-coding clarifications OpenHands needs.

ChatGPT posts research, specifications, test cases, clarifications and review findings to GitHub. The user is not a messenger.

### OpenHands — coding and implementation only

OpenHands must:

- Inspect the actual Amina codebase and governing repository instructions.
- Implement the specifications and source-backed content packages supplied by ChatGPT.
- Modify application code, schemas, UI, media runtime, storage, tests and build configuration as required by those specifications.
- Run implementation tests and report exact commands, outputs, failures and skipped checks.
- Submit focused implementation PRs and report code/infrastructure blockers in PR #208.

OpenHands must not perform or be assigned curriculum research, source collection, source inspection, school alignment, curriculum mapping, pedagogical design, product requirements, QA strategy, research audits or independent source verification. If a source or requirement is missing, OpenHands reports the precise dependency in PR #208; ChatGPT resolves it and supplies the missing material. OpenHands must not ask the user to relay messages.

## 2. Fixed curriculum scope and publication rules

The target is Grade 5, École Girard, Alexandria, academic year 2026–2027, Term 2.

The working subject inventory is:

- Arabic.
- English.
- French 1 — first-language course, separate registry and progress.
- French 2 — second-language course, separate registry and progress.
- Mathematics taught and assessed in French.
- Science taught and assessed in French.
- Social Studies.
- The learner's actual Religious Education track only.
- ICT.
- Library / Research Skills.
- Family Management / Entrepreneurship.
- Agriculture / Entrepreneurship.
- Any additional subject confirmed by Girard.

The complete source and assignment status is maintained by ChatGPT in PR #212. The current Term 2 map is not yet verified. Until ChatGPT supplies a verified lesson package:

- Do not invent units, lessons, objectives, page references, exercises or answer keys.
- Do not use Term 1 or an older-year Term 2 source as a substitute for 2026–2027 Term 2.
- Do not treat a Ministry baseline book as proof that Girard assigned it.
- Do not merge French 1 and French 2.
- Do not select Islamic or Christian Religious Education from assumption or public profile data.
- Do not treat every Ministry activity area as a separate school subject without Girard confirmation.
- Keep unverified content unpublished and visibly blocked; continue independent implementation work.

A public Girard listing reproduces a school announcement that the French international Pré-BAC pathway includes CM2 (Grade 5). This is a distinct pathway and does not prove the learner is enrolled in it. The requested target remains the user-specified French-bilingual Egyptian programme unless school-issued evidence changes it. Do not substitute the French international curriculum or its coursebooks.

## 3. Repository baseline and verified implementation findings

The following are code-inspection findings from main at cdd6dd0281241a0b5ddb0f013bc4f037da009d7d. They are implementation facts, not curriculum-completion claims.

### 3.1 Source provenance model is incomplete

The current SourceRef in src/types/teachingSession.ts stores book labels, grade, term, unit, lesson, page, optional pageRange/notes and isAvailable. It does not carry a stable source ID, URL, SHA-256, academic-year field, edition, language, issuing authority, access date, inspection status, licence or school-applicability status.

CurriculumSource in src/types/curriculum.ts currently distinguishes Egyptian national, Girard French track and school-specific sources. This is not enough to prove the exact document edition or whether Girard assigned it.

### 3.2 French 1 / French 2 are not independently represented

The current French language curriculum file uses one subject ID, subj_french. The current term-one book coverage test does not establish separate French 1 and French 2 coverage and omits ICT. The current subject model must not represent two different French courses as one course.

### 3.3 French assembly path has verified gaps

The current French reel generator and languageGuard contain useful French-aware behavior; preserve and reuse them.

The separate assembly path is not consistently French-aware:

- assetResolver.ts reads the generic sourceText and uses Arabic/English example, analogy, key-point and prerequisite fields rather than the French-specific fields.
- Its exercise fallback can read the default lesson exercises rather than requiring the French exercise set or proving that every prompt and option is readable in French.
- GenerationRequest briefs are represented as localized text, but the current RoleGenerator callback accepts only Arabic and English.
- TeachingNeed.matched carries titleAr and titleEn but no titleFr.
- contentAssembler.ts selects titleEn for French mode and its phase-purpose strings contain only Arabic and English.

For French instruction, missing French content must remain missing and trigger a declared gap. It must not silently fall back to English or Arabic.

### 3.4 Existing teaching and media infrastructure should be extended, not replaced

Amina already has:

- EducationalMediaItem in src/types/media.ts with image, video, audio and interactive media types.
- Localized media title, purpose and alt text, plus provenance, licence and review status.
- A media catalog in src/data/media/mediaCatalog.ts.
- A reuse-first assembly engine in src/services/assembly/assemblyEngine.ts and assetResolver.ts.
- A staged LessonProductionJob in src/services/assembly/productionJobs.ts.
- Persistent-job tests in src/services/assembly/__tests__/jobPersistence.test.ts.
- French-aware reel generation and language checking in src/services/reels/.

Preserve these working foundations. Add missing timeline, caption, source and language contracts without creating a competing lesson engine.

The current persistence test exercises IndexedDB when available and an in-memory fallback otherwise. It does not prove cross-device or server-backed persistence. Do not describe it as such.

### 3.5 Public-repository privacy defect

The public repository's noorCurriculumConfig.ts currently contains a populated student-name field together with school, location and grade context. Treat that tuple as sensitive child-linked information. Do not copy the value into PR comments, logs or new artifacts.

Remove student-specific identity and school/location linkage from public source code. Use a generic public curriculum configuration. Any learner-specific profile must be supplied through an appropriately private runtime/profile store, not committed to this public repository. Add a regression check so it cannot silently return.

## 4. Papermorph technical decision

Repository inspected: https://github.com/DozenTwelve/Papermorph

### Verified capabilities and constraints

- The repository is MIT-licensed at its root. Individual example books and media can have separate rights; do not assume every asset in the repository is reusable.
- The repository is large: GitHub metadata reports 839,964 KB.
- The Papermorph skill is written for Claude Code / OpenCode workflows. Do not assume that installing the skill directly makes it an OpenHands capability.
- Its output is a static HTML / JavaScript / CSS lesson book with audio and media; it does not provide Amina's authenticated backend or server-side progress service.
- The player supports timed narration, visual beats, captions, pause/seek/speed controls and per-book localStorage progress.
- Its documented export path can render MP4 and subtitles. SCORM 1.2 / 2004 packaging is available but is not required for Amina's learner flow.
- The documented free narration route uses Edge TTS online. The skill also describes local Kokoro, whose documented word-timing support is English-oriented.
- The book-generation script includes a French Edge voice mapping, but a successful French narration run has not been verified in this audit.
- The built-in player language list includes English, Russian, Chinese, Japanese and Arabic; French player-interface translations are not supplied. A French UI would need to be added if the original player were reused.
- The engine helper can download the whole repository archive when it cannot find a local engine. Do not trigger that path or clone/vendor the entire large repository for this project.

### Decision

Use Papermorph as a verified reference architecture and selective MIT-code reuse candidate. Build a small Papermorph-compatible lesson-media format and renderer inside Amina's existing React application. Reuse existing Amina media, lesson-job and progress services. Do not deploy a separate standalone Papermorph site and do not install its Claude Code/OpenCode skill as an assumed OpenHands integration.

Only copy isolated engine code after checking its exact file licence and dependencies, retaining required MIT/third-party notices. Do not copy Papermorph sample books, example images, audio, copyrighted pages or unrelated site assets.

No paid model, voice, image API, hosting or dependency may be introduced. Edge TTS is an online free route described by Papermorph, not a guaranteed service-level commitment; the implementation must report provider failure and keep voice generation configurable. No ElevenLabs or other paid voice path.

All source PDFs, extracted textbook pages and private school materials stay outside the public repository. Publish only original Miss Noor explanations, original diagrams/media, assessment data authored for the app, and non-sensitive source references.

## 5. Implementation tickets — execute in this order

### P0-1 — Remove child-linked data from public code

**Files inspected:** src/data/noorCurriculumConfig.ts; src/types/curriculum.ts.

Acceptance:

1. No student name or child-specific school/location/grade tuple remains in public source code.
2. Public curriculum defaults are generic and do not identify a learner.
3. Learner-specific context is loaded only from a private runtime/profile boundary.
4. No secret, transcript, private school file or child data is added to Git.
5. Add a test or repository scan that fails if the removed identity fields are reintroduced into public config.

### P0-2 — Implement a traceable curriculum source contract

Implement a source registry separate from lesson content.

Each source record must support:

- Stable source ID and exact title.
- Subject, grade and academic year.
- Term and language.
- Edition / version and publisher or issuing authority.
- Authority class: Ministry, Girard-issued, primary publisher, secondary lead or app-authored.
- Exact source URL or private-file reference.
- SHA-256 when the source bytes are retrievable.
- Retrieval/access date.
- Inspection status: inspected, partially inspected, inaccessible or unverified.
- Applicability: Girard-confirmed, Ministry baseline only, publisher bibliographic evidence, historical, app-authored or unconfirmed.
- Printed page reference and PDF page reference as separate fields where they differ.
- Licence/copyright note and non-sensitive provenance notes.

A lesson must reference a source ID and exact page range. Do not use a bare book-title string as proof of source identity.

A source may not be labelled verified unless its underlying document has been inspected and its required metadata is present. A Ministry baseline must never be displayed as Girard-confirmed assignment unless the source register contains school evidence.

### P0-3 — Separate subject and learner-track identity

Acceptance:

1. French 1 and French 2 have distinct subject IDs, book/source references, lesson IDs, language-specific exercises, assessment records and progress keys.
2. Mathematics-French and Science-French remain separate from Arabic/English versions.
3. Religious Education is selected only through private, confirmed learner configuration. If unknown, do not silently default to either track.
4. ICT and activity-domain subjects can be represented with an applicability status without falsely declaring them separate courses.
5. Curriculum navigation, search, feed, lesson launch and progress use the same stable subject/track IDs.

ChatGPT will supply the verified coursebook and lesson map. OpenHands implements the model and routing; it does not choose coursebooks.

### P0-4 — Enforce strict French end-to-end

Acceptance:

1. French explanation uses sourceTextFr.
2. French examples, analogies, prerequisites and key points use their French fields.
3. French misconception diagnosis uses explanationFr/remediationFr.
4. French practice uses exercisesByLanguage.fr. A default exercise may be used only if every prompt, option, hint and answer is proven readable in French.
5. Missing French content is a declared gap; no silent English/Arabic fallback.
6. TeachingNeed and generation contracts carry titleFr and a French brief.
7. contentAssembler produces French lesson titles and French phase-purpose strings.
8. Feedback, narration, captions, hints, remediation and mastery checks preserve the requested language.
9. Add tests that fail when a French lesson renders Arabic or English instructional prose as its fallback.

Reuse the existing languageGuard and French-aware reel generator rather than introducing a second language classifier.

### P0-5 — Generalize the lesson teaching-pack contract

The current CurriculumTeacherGuide is French-specific. Implement a reusable, localized LessonTeachingPack that supports:

- Learning objectives.
- Prerequisite/readiness check.
- Vocabulary and definitions.
- Core explanation.
- Worked examples or demonstrations.
- Guided practice.
- Independent practice.
- Ordered answer key with explanations.
- Common misconceptions and diagnosis.
- Targeted remediation.
- Mastery checks and success criteria.
- Source IDs and page references.
- Content provenance: official source fact, teacher-guide-derived note, or original app-authored teaching content.
- Review/publish status.

All learner-visible fields must support the lesson's required language. A missing section must be represented as missing, not filled with generic prose.

ChatGPT supplies the actual pedagogical content and lesson packages. OpenHands implements the schema, renderer and validation only.

### P0-6 — Build the Papermorph-compatible media renderer in Amina

Extend the existing EducationalMediaItem contract with a versioned timed-lesson manifest. At minimum the manifest must carry:

- Schema version and stable lesson ID.
- Source IDs and curriculum page references.
- Required language and transcript.
- Total duration and poster image.
- Caption source and format (VTT or SRT), with language.
- Ordered beats with stable ID, start/end time, narration text/audio, visual asset, accessibility description and optional interaction.
- Optional question/check with answer and explanatory feedback.
- Asset licence, attribution and review status.

The Amina player must provide:

1. Play / pause, seek and playback speed.
2. Captions on/off and a readable transcript.
3. Synchronized narration and visual beats.
4. Touch-friendly controls and responsive phone layout.
5. Reduced-motion behavior and no unexpected audible autoplay.
6. Accessible labels and keyboard operation.
7. Recovery when media or captions fail to load.
8. Progress events written through Amina's existing progress/storage service, not Papermorph localStorage alone.
9. A stable link back to the correct subject, unit and lesson.
10. No published player state for unreviewed or source-unverified lessons.

MP4/SRT export may be a batch output after the in-app lesson works. SCORM is out of scope for this 48-hour Amina rebuild unless a concrete school integration requirement is supplied.

### P0-7 — Enforce lesson publication and completion gates

A lesson cannot be marked published/complete merely because a job reached its final stage.

Required publication evidence:

- Verified applicable source mapping supplied by ChatGPT.
- Correct grade, year, term, subject, track and language.
- Complete teaching pack.
- Valid practice questions and answer keys.
- Misconception and remediation path.
- Mastery check with an explicit success criterion.
- Every media asset and caption file resolves and plays.
- Mobile learner route is reachable.
- Progress and assessment events persist through Amina's supported storage model.
- No unresolved wrong-language or source-integrity failure.
- Review status explicitly approved by the independent QA owner before release.

Keep draft, blocked, needs-review and approved states distinct. OpenHands reports implementation test results; ChatGPT owns independent acceptance.

### P0-8 — Tests and implementation evidence

Add or update tests for:

- Source registry required fields and status transitions.
- Printed page versus PDF page references.
- Ministry baseline versus Girard-confirmed applicability.
- French 1 / French 2 isolation.
- Religious-track gating.
- Strict French text and exercise routing.
- Teaching-pack completeness and answer-key alignment.
- Media timeline ordering and duration validity.
- Caption file reachability and language.
- Audio/video playback errors and retry.
- Player controls and phone viewport behavior.
- Progress persistence and resume.
- Public-repository privacy regression.

Run the actual repository scripts, including lint, build, curriculum registry/integrity, Term 1 baseline, French teaching, media, assembly, job persistence and phone UI tests where applicable. Report exact command, exit status and raw result. A skipped or unavailable check is NOT RUN, not PASS.

## 6. ChatGPT handoff and review protocol

- PR #208 is the coordination thread.
- PR #212 is the curriculum source-harvest artifact.
- ChatGPT posts each complete research result, requirement, teaching package, test case and clarification in GitHub.
- OpenHands posts implementation commits and focused PRs, then reports code blockers in PR #208.
- ChatGPT reviews actual changed files and test evidence and posts actionable corrections.
- Do not ask the user to forward comments or materials.
- Do not treat a PR comment as proof that OpenHands has started a worker. Actual commits, PR updates and run evidence are required.

## 7. Deadline and release boundary

The 48-hour target is for the actual Term 2 rebuild, not automation setup. Continue all implementation that does not depend on missing curriculum sources. ChatGPT continues source retrieval and supplies lesson packages as they are verified.

If a required school booklist, Term 2 book, teacher guide or assessment remains inaccessible at the deadline, report the exact source gap and leave that curriculum item blocked. Do not invent coverage or declare the curriculum complete.

No merge, production deployment, paid service, paid API or new paid dependency without explicit release authorization.

## 8. Required OpenHands first implementation response

In PR #208, post:

1. Acknowledgement of this ownership boundary.
2. Exact branch and HEAD SHA.
3. The first coding ticket being implemented.
4. Files expected to change.
5. Tests to run.
6. Any code-only blocker requiring ChatGPT clarification.

Do not return a curriculum research plan or ask the user to supply materials. ChatGPT owns that work and will post verified materials when available.

## 9. Status vocabulary

Use only evidence-backed statuses:

- [VERIFIED] — directly supported by inspected repository, source document, test output or runtime evidence.
- [IN PROGRESS] — actual work has started and evidence of the work exists.
- [FAILED] — a named check was run and failed.
- [BLOCKED] — a specific dependency prevents the next action.
- [UNPROVEN] — a claim or requirement lacks sufficient evidence.

A green build does not prove source coverage, school assignment, teaching quality, learner reachability or production deployment.
