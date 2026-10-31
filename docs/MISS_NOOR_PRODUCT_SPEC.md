# MISS NOOR — Product, Experience & System Specification

**Document type:** Canonical product specification / source of truth  
**Product:** Miss Noor  
**Repository:** `madnessgate44-debug/Amina`  
**Baseline inspected:** `main` tree `990c3144d11442fceb5e5bf7e59eab3754e11938` (2026-10-31)  
**Last consolidated:** 2026-10-31  
**Authority:** Explicit owner decisions and corrections outrank implementation convenience, stale documents, and agent assumptions.

> **Naming rule:** The product and the AI teacher are both named **Miss Noor** (exact spelling: Noor). “Amina” is the historical repository/project name and the name of the initial learner, not the product brand. Do not use “Miss Nour” or “Amina” as the product name. The application must support any student identity and address form; never hard-code Amina or a gender.

---

## 0. Executive product definition

**Miss Noor is a complete AI-powered learning ecosystem for students, families, teachers and schools.** It is not merely a personal AI tutor, chatbot, homework app, static school dashboard, video library, or social-media clone.

The ecosystem combines:

1. A multi-skill AI teaching agent that understands what a learner needs and conducts an adaptive teaching session.
2. A curriculum and educational knowledge layer grounded in official Ministry of Education and school-approved materials.
3. A content and media assembly engine that reuses approved assets and generates missing learning assets when appropriate.
4. A learner model and memory that preserve learning continuity.
5. A continuous learning loop: diagnose → choose teaching strategy → teach → practice → assess → verify → adapt → record outcome → select next step.
6. A vertical, interactive educational feed containing curriculum learning, revision, discovery, games and parent-approved out-of-curriculum interests.
7. A student learning environment with Home, Feed, Library and Miss Noor teaching surfaces.
8. Parent tools for goals, boundaries, oversight and understandable learning reports.
9. A school-branded institutional product connecting school, teachers, students and parents.

**Positioning:** “A complete AI learning ecosystem for every student, family and school.”  
**Product promise:** Make learning understandable, engaging, continuous and personal—across grades, curricula, languages and school systems.

The product must be designed for all school stages: primary/elementary, preparatory/middle, and secondary/high school. It must be configurable for national and international school systems and different curricula. Arabic, English and French are initial language requirements, not an architectural ceiling.

## 1. Owner intent and non-negotiable product principles

1. **Teach, do not merely answer.** Miss Noor should identify the learning need, teach appropriately, invite student participation, assess the response and decide what should happen next.
2. **No textbook-selection prerequisite.** A learner may ask a question, paste text, upload a photograph, share homework or request a topic. Miss Noor must still understand the request and build an appropriate experience. A textbook or curriculum reference may improve grounding, but the student must not have to navigate a book before asking for help.
3. **Explain before showing architecture.** User-facing product explanations must first make clear what Miss Noor does and how a student experiences it. Only then introduce technical/system boxes and the continuous loop.
4. **Explain every system component.** No unexplained architecture labels. Every box must state what it receives, what it does, what it produces and how it interacts with other components.
5. **Reuse before generate.** Retrieve and reuse suitable approved content/media with provenance. Generate only missing or unsuitable assets. Assemble the result dynamically into a coherent experience.
6. **Real teaching media.** Images, diagrams, video/animation, narration/audio and interactive elements must be real rendered educational assets. A canvas placeholder or decorative schematic is not equivalent to teaching media.
7. **Conversation-first experience.** The product should feel like a warm, capable teacher/companion—not a dashboard full of cards. The learner-facing teaching flow should be natural and conversational.
8. **Feed is a core surface.** The Feed is a meaningful learning and discovery environment, not a decorative feature or passive video list.
9. **Cross-surface continuity.** Home, Feed, Library, teaching, homework, timetable, progress and parent views must use the same learner and curriculum context.
10. **Age-appropriate safety and parent governance.** Out-of-curriculum content is curated by Miss Noor and governed by parent-approved interests and boundaries; it is not an unrestricted social feed.
11. **Evidence honesty.** Distinguish implemented, partially implemented, documented, planned, broken and unverified. A requirement in this file is not proof that it exists in the running application.
12. **Preserve existing working functionality.** Inspect before rewriting. No wholesale redesign, placeholder substitution, feature deletion, new paid service, or production change without authorization.

## 2. Learner and market scope

### 2.1 Universal product; initial configuration

The initial configured learner in the project is Amina:
- Grade 5 primary.
- Girard, a French school in Alexandria, Egypt.
- Egyptian curriculum with French-curriculum elements.
- English, mathematics and science studied in French.

This is an initial learner profile only. It must never become a hard-coded product limitation. Older conversations contained an earlier age/grade description; the latest explicit owner correction is Grade 5 primary.

### 2.2 Required configurability

The product data model and UX must support:
- Any school grade and educational stage.
- Different countries and education systems.
- National and international curricula.
- Different academic years, terms, subjects, units and lessons.
- Arabic, English, French and other configured instructional languages.
- Bilingual/multilingual subjects where the textbook language differs from the app language.
- Different student names and grammatical address forms.
- School-specific schedules, pacing, calendars and learning materials.

Do not imply that all world curricula are already populated. The platform architecture must be curriculum-configurable; actual content coverage must be represented by a verified inventory.

## 3. Core information architecture and navigation

The locked core student surfaces are:

- **HOME** — daily learning companion and actionable view.
- **FEED** — immersive vertical learning and discovery stream.
- **LIBRARY** — official books, lessons, saved content, notes and collections.
- **MISS NOOR** — conversational AI teacher and teaching experience.

Keep these as the primary product experience. Books, homework, timetable, exams, progress, settings and other utilities can be accessed through contextual navigation, menus or secondary destinations. Do not turn the app into a conventional dashboard or expose internal pedagogical terminology to the child.

### 3.1 HOME — welcome and daily orientation

On opening, Miss Noor should greet the student and initiate a natural interaction, for example:

> “Hello! What do we have today?”

She should:
1. Welcome the learner using the correct student name and address form.
2. Explain the day's relevant learning plan and approximate session duration.
3. Surface today's subjects, school responsibilities, due work, upcoming exams and due reviews using real configured data.
4. Ask whether the student has a remark, new homework, a question or a change to the plan.
5. Allow the student to respond conversationally.
6. Guide the learner into the next activity, normally the Feed/session or a specific teaching experience.

HOME should be useful and visually engaging, but the greeting and guided conversation must remain the emotional centre. Do not fabricate timetable entries, exam dates, assignments or progress. Exam countdowns are derived only from parent-entered or otherwise verified exam records.

### 3.2 FEED — immersive learning stream

A vertical, full-screen, swipe/scroll feed inspired by the usability of short-form media, but with a learning-first purpose. Reels can be teaching, explanation, practice, revision, games, memory, discovery or approved entertainment. See §8.

### 3.3 LIBRARY — the student's learning collection

The Library must make real learning resources discoverable and usable:
- Official Ministry textbooks and school-provided books.
- Curriculum index and lesson navigation.
- Supplementary/authorized books, clearly distinguished from canonical material.
- Saved Feed reels and teaching items.
- Saved lessons, notes and folders/collections.
- Imported books/PDFs where supported.
- Continue-learning entry points.

A government PDF should be preserved faithfully when legally available for the product's use. Provide a clear table of contents/index linking to individual lessons. Selecting a lesson should allow the student to launch Miss Noor's explanation using the teaching loop. Do not claim that every official book exists in the app unless the book inventory confirms it.

### 3.4 MISS NOOR — conversational teaching space

A learner can ask or upload without selecting a textbook. The interface should support dialogue, voice, explanation, visuals, practice, student response, feedback and verification in one continuous session. It should not behave like a generic open-ended chatbot that returns a final answer and ends.

### 3.5 Secondary learning tools

The wider product supports:
- Homework and written-work support.
- Timetable and school-day record.
- Daily and weekly review.
- Exam calendar and preparation.
- Progress and mastery views.
- Notes, saved content, collections and folders.
- Parent dashboard and controls.

These tools should connect to the same learner model and not become isolated mini-apps.

## 4. The student request: input understanding

Miss Noor must accept a wide range of natural learner inputs:
- Spoken question or voice conversation.
- Typed question or prompt.
- Pasted paragraph, lesson or text.
- Photograph of a textbook page, worksheet, handwritten exercise or board.
- Homework task or selected exercise.
- A topic or concept name.
- A request to explain, revise, practice, explore or prepare for an exam.
- A request unrelated to the current textbook/curriculum.

The input-understanding layer identifies:
- User intent (explain, answer, teach, practice, revise, solve, explore, assess, etc.).
- Subject/topic and relevant concept, if identifiable.
- Language of the request and language of source material.
- Whether a curriculum match exists.
- Whether the student needs a quick answer or a longer structured teaching experience.
- Relevant learner context and prior evidence.
- Whether source material is ambiguous or unreadable.

**No false certainty:** If a photo is unclear or handwriting cannot be read reliably, ask for a clearer image or clarification. Do not mark an answer wrong because OCR is uncertain. Do not invent the content of an unseen page.

## 5. School context, official curriculum and knowledge layer

The School Context component determines what educational program applies to the learner.

### 5.1 Curriculum hierarchy

Represent the curriculum as:

**Country / education system → academic year → school → grade → language track → subject → term → unit → lesson → learning objective → concept/skill → exercise/assessment.**

Include prerequisites and progression where known.

### 5.2 Source hierarchy and provenance

Keep these source classes distinct:

1. **Canonical official curriculum:** current Ministry of Education textbooks and official documents for the learner's education system.
2. **School-approved curriculum material:** school textbooks, schemes of work, pacing guides and approved resources.
3. **Teacher-provided material:** lesson objectives, worksheets, assignments, classroom explanations, teacher notes and remediation guidance, subject to authorization.
4. **Supplementary/third-party material:** additional workbooks or educational publishers. These supplement, never silently replace, the official curriculum.
5. **AI-generated material:** generated explanation, examples, exercises, diagrams, narration and activities. Clearly identify as generated, not official.
6. **Learner/parent input:** timetable, exam calendar, homework, remarks and corrections.
7. **External reference sources:** explicitly identified and never silently represented as Ministry or school material.

Official Ministry material is a primary content source and must be represented accurately. School context selects the correct curriculum; it must not assume every student follows the Egyptian curriculum.

### 5.3 One shared curriculum source of truth

A single authoritative curriculum/knowledge layer should inform:
- Home planning.
- Feed generation.
- Library navigation.
- Teaching sessions.
- Homework evaluation.
- Mastery and progress.
- Daily/weekly review.
- Exam preparation.

Avoid disconnected duplicated curriculum definitions. Before replacing demo curriculum, inspect its imports and production dependencies. Distinguish demo/sample data from canonical/verified content. A curriculum registry should expose available curriculum packs and their coverage/provenance.

## 6. Learner profile and learner memory

These are related but distinct components.

### 6.1 Learner Profile — relatively stable context

Contains:
- Student name and preferred form of address.
- Age/stage and grade.
- School and education system.
- Curriculum, academic year and subjects.
- Learning languages and language preferences.
- Interests and goals.
- Preferred session duration and learning modalities.
- Parent/guardian relationship and permissions.

### 6.2 Learner Memory — evolving learning history

Tracks relevant learning events:
- What was taught and when.
- Questions and responses.
- Correct, partially correct and incorrect answers.
- Diagnosed misconceptions when evidence supports them.
- Concepts mastered or not yet secure.
- Explanation styles that helped.
- Practice and verification results.
- Homework and revision history.
- Due review items.
- Progress and next recommended step.

Memory must be evidence-based and privacy-conscious. It should preserve continuity without treating a single response as permanent ability. The student and parent should be able to correct relevant profile information.

## 7. Miss Noor Teaching Agent and skill architecture

Miss Noor is the orchestrating teacher agent. It is not a generic chat endpoint and should not expose a list of internal skills to the child.

### 7.1 Core orchestration responsibilities

The agent:
1. Understands the student's request.
2. Resolves curriculum and learner context.
3. Identifies the learning objective and likely knowledge gap.
4. Selects a teaching strategy and relevant specialist skill(s).
5. Retrieves suitable approved content and media.
6. Requests generation only for missing assets.
7. Composes a coherent teaching experience.
8. Conducts dialogue and practice.
9. Assesses the student's actual responses.
10. Verifies understanding, adapts and records evidence.
11. Chooses the next step or schedules review.

### 7.2 In-app teaching skills

The repo contains an initial named skill layer at `src/services/teaching/skills/`. The current five skills identified in repository documentation/code are:

- **diagnose-misconception** — identify the underlying mistaken mental model, not just label an answer wrong.
- **explain-in-layers** — start with an accessible explanation and deepen or simplify according to learner evidence.
- **socratic-check** — ask a focused question and let the learner think before revealing the answer.
- **grounded-visual** — use a relevant diagram, image, model or demonstration tied to the learning objective.
- **spaced-recheck** — revisit knowledge at an appropriate later time to test retention.

These are app runtime teaching skills, distinct from OpenHands engineering skills in `.agents/skills/`. Engineering skills help developers build the app; teaching skills are used by the child's Miss Noor.

The teaching-skill registry should have a shared context/result contract, deterministic skill selection where possible, named triggers, test coverage and traceability of which skill shaped a turn. The coordinator selects skills from session phase, intent, answer evidence, misconception evidence, mastery confidence, language and due-review state.

### 7.3 Teaching behaviours

Miss Noor should:
- Ask what the learner already knows or where they got stuck when useful.
- Avoid giving away an answer when guided reasoning is more educational.
- Explain concepts in layers.
- Use simple language, analogies and real-life examples.
- Teach one question at a time and wait for the learner's answer.
- Give hints before revealing answers when appropriate.
- Identify and explain the specific misunderstanding.
- Encourage without false praise or shaming.
- Switch explanation method when the first method fails.
- Use visuals and grounded materials when they improve understanding.
- End with a meaningful check and next step.

## 8. Content Assembly and educational media system

### 8.1 Reuse-first assembly

The Content Assembly Engine converts a learning need into a complete experience.

Pipeline:

**Understand need → resolve curriculum concept → resolve approved assets → identify missing asset roles → generate missing content/media → assemble phases → verify completeness/provenance → present → assess → adapt.**

It must not regenerate assets unnecessarily. Each reusable asset should have a stable identity/reuse key and provenance. Generated material should be reviewable and associated with its source/learning objective.

### 8.2 Quick answer versus full teaching job

Not every request needs the same production workflow:
- A simple factual clarification can receive a prompt, grounded immediate answer.
- A complex concept, lesson, pasted text or multi-step request should create a structured teaching experience.
- Longer media/lesson preparation can run as a staged job with visible progress and resumability where supported.
- The learner should not be left waiting on a long model call without feedback.

The existing assembly service documents a staged job pipeline: understand → reuse → generate → assemble → verify. Preserve this architecture and its persistence/resume capability.

### 8.3 Experience phases

A complete assembled experience must preserve and render all of these phases:
1. Dialogue / teach.
2. Practice.
3. Verification.
4. Next learning step.

Do not concatenate the whole experience into a single text blob and discard practice, verification, interaction or media. Practice and verification must be answerable, assessed and connected to the learner's evidence when a real curriculum concept is matched.

### 8.4 Educational media types

Support:
- Image/illustration.
- Diagram with localized legend and interactive hotspots.
- Video.
- Animation.
- Audio/narration.
- Interactive activity.
- Carousel/card sequence.
- Exercise and quiz.

Media catalog entries should bind to lesson and concept IDs, include localized title/purpose/alt text, curriculum reference, source/provenance and review state. Arabic/French words should not be baked into image pixels; keep localized labels in the UI/catalog so the same visual can be reused across languages. Provide meaningful alt text, keyboard/touch-accessible controls, reduced-motion behaviour and clear narration controls.

The current repository has a media pipeline/catalog/renderer and a small verified set of media across science, maths and French. This is a reusable system foundation, not evidence that every lesson already has complete media.

## 9. The Feed: learning, discovery and controlled entertainment

The Feed is a signature product surface and a key differentiator. It should use immersive vertical full-screen cards/reels with real educational media and complete voice interaction.

### 9.1 Curriculum learning feed

Possible reel formats:
- Hook question.
- Story analogy.
- Vocabulary flash.
- Spot the mistake.
- Quick choice.
- Teaching card.
- Short explanation.
- Worked example.
- Diagram or demonstration.
- Interactive carousel.
- Memory/revision challenge.
- Exam-topic micro-lesson.
- Practice and independent check.

Reels must be grounded in real lesson/concept fields and exercises. If source data does not support a reel type, skip that type rather than fabricate a question or answer. Every reel should retain lesson/concept identity and source provenance.

### 9.2 Daily feed composition

The current deterministic feed engine uses a configurable session target and a documented starting composition:
- 40% due review.
- 30% today's lessons.
- 20% exam topics.
- 10% curiosity/enrichment.

It also has product rules such as a winnable first reel, variety/no repeated kind consecutively, a retry teaching reel after repeated mistakes, a positive closing reel and queue refill from mastery gaps. Treat this as the current implemented starting policy, not a universal immutable quota. Composition must adapt to available data and the student's context.

### 9.3 Out-of-curriculum discovery and entertainment

A separate or clearly differentiated interest stream should include parent-approved, age-appropriate discovery such as:
- Science and space.
- Animals and nature.
- History and geography.
- Art and creativity.
- Technology and inventions.
- Sports.
- Interesting facts and storytelling.

Parents approve interests and boundaries; Miss Noor curates the content and can explain, contextualize or turn it into a learning activity. It must not become unrestricted user-generated social media or an unmoderated recommendation feed.

### 9.4 Why this is better than a generic social feed

The intended product philosophy is learning-first engagement:
- Content is selected for educational/developmental value and age suitability.
- Learning reels connect to curriculum, interests and learner goals.
- The student can interact, answer, ask follow-up questions and receive voice feedback.
- The system remembers learning and can recommend a useful next step.
- Parents have meaningful controls and visibility.
- Entertainment and curiosity are connected to knowledge rather than endless passive consumption.

Do not claim that the app can guarantee zero exposure to harmful material. Describe the controls, moderation, approved content sources and parent governance accurately.

### 9.5 Voice turn-taking in Feed

The student must be able to complete a complete in-feed voice interaction:
- Miss Noor speaks.
- The app waits for the student.
- The student responds by voice.
- Speech is interpreted and assessed.
- Miss Noor responds and continues the reel/session.
- The student can interrupt Miss Noor.
- Listening/speaking/thinking state is visible and recoverable.

A tap-to-hear control alone does not satisfy hands-free conversational teaching.

## 10. Voice, character and conversational presence

Miss Noor should feel like an elegant, reassuring, intelligent teacher who is present in the product—not a disembodied answer box.

Requirements:
- Consistent character/brand representation across Home, teaching, Feed and lesson media.
- Natural voice output and voice input.
- Hands-free turn-taking as the preferred/default teaching interaction when appropriate.
- Visible and reliable interrupt control.
- Clear listening, thinking and speaking states.
- Correct pronunciation and language selection.
- Address form and grammar follow the student's profile, not a hard-coded female child or Amina.
- Fallbacks must be honest when voice/model services are unavailable.

The app should maintain a warm, encouraging teacher personality without being patronizing or overly childish.

## 11. Homework, written work and image understanding

Support:
- Homework assignment capture and due dates.
- Typed response.
- Photo upload of worksheet or textbook.
- Reading visible question and student response.
- Handwriting recognition only when sufficiently legible.
- Step-by-step correction and retry.
- Explanation of the mistake and the relevant concept.
- Evidence recording when a real learning objective is matched.

Distinguish unreadable input from incorrect work. Do not fabricate OCR certainty. Homework must feed the learner model and daily plan where appropriate.

## 12. Daily plan, timetable, exams and review

The daily plan should use real configured inputs:
- Timetable and today's school lessons.
- What was covered at school.
- Homework and deadlines.
- Incomplete or missed tasks.
- Upcoming lessons.
- Upcoming exams.
- Weak concepts and repeated mistakes.
- Due spaced reviews.
- Available time and session-length preference.

The plan is adaptive. A prior 2–3 hour planning range is contextual guidance, not a compulsory quota. Do not invent school events or exam dates.

Daily review and weekly review should be based on actual learner history. Exam preparation should use the real exam calendar and relevant curriculum content.

## 13. Mastery, assessment and learning evidence

Mastery must be evidence-based, not decorative.

Record:
- The concept/objective assessed.
- The learner's response.
- Correctness/partial correctness.
- Misconception when identifiable.
- Feedback/remediation given.
- Independent recheck result.
- Timestamp and evidence modality.
- Confidence/strength of evidence.

A stored score must influence future teaching or review. Do not claim mastery from video completion, reel views or unverified attendance. Use repeated/varied evidence where possible. A learner should advance when understanding is demonstrated; otherwise Miss Noor should change approach and recheck.

Learning telemetry should measure educational outcomes (for example next-question correctness, misconception resolution and independent recheck success), not only model cost and latency.

## 14. Parent experience and controls

Parents need a separate, understandable view. They should be able to:
- Configure learner profile and school context.
- Enter timetable, homework and exam information where not integrated.
- Set learning goals and session boundaries.
- Approve interests and content categories.
- Manage appropriate screen-time/content boundaries.
- Review completed learning and progress.
- See strengths, weak topics and unresolved learning gaps.
- Receive actionable recommendations for supporting the child.
- Review meaningful activity and learning reports.

Parent reporting must distinguish actual learning evidence from content views or estimated activity. Parent features should not overwhelm or replace the student-facing experience.

## 15. School-branded and institutional product

Miss Noor is also a configurable product for private schools, national or international.

A school can receive its own branded Miss Noor environment with:
- School logo, colors and identity.
- School-specific grade/class structure.
- Curriculum and language configuration.
- Approved textbooks and learning materials.
- Academic calendar and timetable context.
- Teacher accounts and class connections.
- Student experiences.
- Parent reporting.
- Appropriate role-based permissions.

### 15.1 Roles and value

**School:** configures institutional identity, curriculum, policies, resources and access.  
**Teacher:** shares objectives/assignments, guides learning, reviews class and individual evidence, identifies common misconceptions and decides where human intervention is needed.  
**Student:** receives personal adaptive teaching and practice aligned with the school context.  
**Parent:** receives meaningful progress, strengths, gaps and support recommendations.  
**Miss Noor:** connects these roles through personalized teaching and learning evidence.

### 15.2 Institutional governance

Define role-based access and consent. Teachers should only see students/classes they are authorized to access. Parents should only see their linked child. School administrators should see only authorized institutional data. Do not imply a live school integration exists until actual integration evidence is available.

## 16. Personal organization and gamification

Support meaningful:
- Like/favourite.
- Save for later.
- Reopen saved content.
- Collections/folders.
- Notes.
- XP and progress rewards.
- Streaks with forgiving rest-day behaviour.
- Badges tied to real learning activity.
- Encouragement and celebration.

A visual control is not complete unless it has a real action and persistence appropriate to the storage design. Rewards should reinforce learning, not pressure or shame children. A streak must not punish a child for illness, rest or circumstances outside their control.

## 17. Localization, accessibility and responsive design

Initial language/locale coverage:
- Arabic (Egyptian Arabic for conversational teacher voice; RTL UI).
- English.
- French.

Requirements:
- Full layout direction handling, not just translated labels.
- Correct mixed-language content rendering.
- Correct grammar and student address form.
- Curriculum content language may differ from interface language.
- Minimum touch target 44×44 px.
- Readable text and sufficient contrast.
- No horizontal overflow on phone.
- Reduced-motion support.
- Accessible labels, keyboard navigation and focus states where applicable.
- Test mobile first and verify desktop as well.

## 18. Visual identity and UI direction

The application should feel like a premium modern learning companion / super-app, not an administration dashboard.

Design principles:
- Conversation-first, immersive and clear.
- Distinctive Miss Noor character presence.
- Strong visual hierarchy and spacious composition.
- Consistent branding across all teaching media.
- Modern vertical feed interactions.
- Rich real media, not empty gradient/canvas placeholders.
- Elegant, reassuring, age-appropriate character design.
- Consistent Arabic/English/French typography and RTL/LTR behaviour.
- Student interface remains simple; complexity stays behind the scenes.

Brand name is always **Miss Noor**. Any older component identifiers such as `NourCharacter` may remain internal until safely refactored, but visible product copy must use the approved spelling.

## 19. Technical system map — repository-grounded inventory

The following paths were present in the inspected repository tree on 2026-10-31. This is a navigation map, not a claim that every feature is complete or production-verified.

### Main experience
- `src/components/home/HomeScreen.tsx`
- `src/components/feed/FeedScreen.tsx`
- `src/components/feed/ReelCard.tsx`
- `src/components/feed/ReelMedia.tsx`
- `src/components/companion/CompanionChatScreen.tsx`
- `src/components/teacher/VirtualTeacherClassroom.tsx`
- `src/components/layout/AppShell.tsx`
- `src/components/layout/BottomNav.tsx`
- `src/components/layout/ChildTopMenu.tsx`
- `src/components/stage/NourCharacter.tsx`

### Onboarding, learner and parent
- `src/components/onboarding/OnboardingFlow.tsx`
- `src/components/parent/ParentDashboardModal.tsx`
- `src/components/parent/ParentAuthModal.tsx`
- `src/components/profile/ProfileScreen.tsx`
- `src/context/AppContext.tsx`
- `src/services/storage/studentMigrations.ts`
- `src/services/parent/parentService.ts`
- `src/services/parent/examCalendarService.ts`

### Curriculum and Library
- `src/components/curriculum/CurriculumBrowser.tsx`
- `src/components/curriculum/LessonStudyModal.tsx`
- `src/components/myBooks/MyBooksScreen.tsx`
- `src/components/myBooks/BookReader.tsx`
- `src/components/myBooks/ImportBookSheet.tsx`
- `src/services/curriculum/curriculumService.ts`
- `src/services/myBooks/bookImportService.ts`
- `src/services/myBooks/pdfService.ts`
- `src/data/officialCurriculum.ts`
- `src/data/aminaCurriculumConfig.ts`
- `src/data/curriculum/*`

### Teaching, assembly, memory and assessment
- `src/services/teaching/teachingSession.ts`
- `src/services/teaching/skills/teachingSkills.ts`
- `src/services/teaching/skills/selectTeachingSkill.ts`
- `src/services/teaching/skills/types.ts`
- `src/services/teacher/teacherContextEngine.ts`
- `src/services/tutor/tutorEngine.ts`
- `src/services/assembly/teachingNeed.ts`
- `src/services/assembly/assetResolver.ts`
- `src/services/assembly/contentAssembler.ts`
- `src/services/assembly/assemblyEngine.ts`
- `src/services/assembly/experiencePresenter.ts`
- `src/services/assembly/jobService.ts`
- `src/services/assembly/productionJobs.ts`
- `src/services/mastery/masteryEngine.ts`
- `src/services/review/spacedReviewScheduler.ts`
- `src/services/homework/homeworkGenerator.ts`

### Feed, media, voice and persistence
- `src/services/reels/feedQueue.ts`
- `src/services/reels/reelGenerator.ts`
- `src/services/reels/reelResponse.ts`
- `src/services/voice/handsFreeLoop.ts`
- `src/services/voice/voiceService.ts`
- `src/services/voice/tutorSpeechService.ts`
- `src/data/media/mediaCatalog.ts`
- `src/types/media.ts`
- `src/services/storage/IndexedDBStorageService.ts`

## 20. Current implementation evidence and known gaps (2026-10-31 snapshot)

The repository contains substantial working foundations. Do not describe the product as a blank concept. Equally, do not claim every intended capability is complete.

### 20.1 Verified foundations recorded in repository reports

- A staged teaching session exists with greet, warmup, teach, ask, explain-back, adjust, celebrate and close phases.
- Teaching/tutor services, mastery scoring, spaced review, answer evaluation and voice input/output exist.
- A hands-free voice state machine exists; repository documentation reports tests for it and a PR that changed its default. Verify the current merged state before claiming it is default in production.
- A named five-skill teaching layer exists in the code tree.
- An assembly engine understands requests, matches concepts, resolves assets reuse-first, generates missing roles and builds dialogue/practice/verification/next-step phases.
- A persistent staged job service and resume flow are documented in the 2026-10-31 adaptive teaching report.
- The adaptive teaching gap matrix dated 2026-10-31 reports that the full assembled experience was rendered and interactive practice/verification/adaptation connected, with tests and live browser evidence at that report's baseline.
- A real media catalog/renderer/pipeline exists. The 2026-10-31 media verification report records real science diagrams, animation, maths number line, French illustration and narration, tested in a 390×844 Arabic phone session.
- The deterministic feed engine builds reels from real curriculum fields/exercises, includes due reviews, today's lessons, exam topics and curiosity, and has retry/closer logic.
- Onboarding was redesigned as a Noor-led four-screen flow: profile/language, real curriculum books and lessons, warm-up questions drawn from curriculum exercises, and learning preferences/session length.
- Home has a “Today with Noor” entry point, parent-entered exam countdown, XP and forgiving streak indicators according to the relevant commit record.
- Save/like and collections components exist.
- The project has Arabic, English and French localization paths and a student address-form helper; verify all surfaces rather than assuming localization is complete.

### 20.2 Known limitations and gaps that must remain visible

- The media verification report covered four catalog items across three lessons, not every lesson in the curriculum.
- The adaptive teaching report is a dated report tied to its stated commit/baseline. Re-check current main and live deployment before treating all acceptance results as current.
- Earlier teaching-agent analysis identified misconception data depth as a major weakness: wrong-answer evaluation and diagnosis were not consistently backed by curriculum misconception/distractor data. Re-check whether later commits have closed this.
- Do not assume a complete universal curriculum inventory exists. Verify each grade/curriculum/source and identify missing books, lessons, concepts, exercises and media.
- Parent/teacher/school institutional integration is a product requirement and commercial direction; do not represent it as already integrated unless repository and live evidence demonstrate it.
- Out-of-curriculum feed governance and parent-approved interests need a complete policy, content source, moderation and parent control implementation. Do not conflate the current curriculum curiosity pool with a complete safe entertainment platform.
- A visually immersive feed is not enough: verify complete in-feed voice turn-taking, real media, interaction, learner evidence and continuity.
- Do not confuse OpenHands coding-agent skills under `.agents/` with the in-app teaching skills used by the child.
- Historical audit/status documents may be stale. The current branch and current source take precedence; compare report baseline SHAs before relying on old conclusions.

## 21. Acceptance criteria — product-level

Use these as testable acceptance requirements. Each must be mapped to current code, tests, browser evidence and production evidence. Mark status honestly.

| ID | Requirement | Acceptance criteria |
|---|---|---|
| MN-01 | Product identity | “Miss Noor” spelling consistent in all visible surfaces; no hard-coded Amina identity. |
| MN-02 | Multi-grade/multi-curriculum model | Student can be configured for different stages, curricula, schools and language tracks without code-level assumptions. |
| MN-03 | Noor-led welcome | Home greets student, explains real daily plan/duration, asks for remarks and starts a relevant activity. |
| MN-04 | Ask without book selection | Student can ask, paste or upload and receive a relevant experience without first choosing a textbook. |
| MN-05 | Input understanding | Intent, topic, language, curriculum match and ambiguity are handled explicitly. |
| MN-06 | Official source grounding | Teaching identifies canonical official/school sources and never labels generated material as official. |
| MN-07 | Learner profile | Profile captures relevant school/grade/language/preferences and can be corrected. |
| MN-08 | Learner memory | Learning history persists and changes future teaching/review decisions. |
| MN-09 | Teaching agent orchestration | Agent selects appropriate skills and manages the entire teaching session. |
| MN-10 | Skill layer | Each skill has contract, trigger/selection logic, tests and observable effect. |
| MN-11 | Reuse-first assembly | Suitable approved assets are reused with provenance; only missing roles are generated. |
| MN-12 | Complete experience presentation | Dialogue, practice, verification and next step are all rendered and usable. |
| MN-13 | Interactive assessment | Learner responses are evaluated; misconception and uncertainty are handled honestly. |
| MN-14 | Adaptation | Result changes explanation, difficulty, remediation or next step. |
| MN-15 | Evidence-based mastery | Only observed responses update mastery; evidence affects later learning. |
| MN-16 | Real educational media | Real image/video/audio/interactive assets render; no canvas-only placeholder counted as complete media. |
| MN-17 | Feed curriculum relevance | Feed draws from real curriculum, due review, school day and exam context. |
| MN-18 | Feed interaction | Reels support meaningful interaction, answers, feedback, save/reopen and learning continuity. |
| MN-19 | Hands-free voice | Learner can complete voice turns, interrupt Noor and recover from listening/speech failures. |
| MN-20 | Interest feed governance | Parent-approved interests, age-appropriate curation, moderation and controls govern out-of-curriculum content. |
| MN-21 | Library | Official books/PDFs, index, lesson launch, saved reels, notes and collections work. |
| MN-22 | Homework/photo | Correct, incorrect, partial, unreadable and ambiguous responses are handled distinctly. |
| MN-23 | Daily plan | Timetable, homework, due reviews, exams and available time inform the plan without fabricated entries. |
| MN-24 | Parent reporting | Parent sees meaningful, evidence-based progress and can set controls. |
| MN-25 | School product | School branding, curriculum configuration, teacher connections and parent reporting are supported with role-based access. |
| MN-26 | Localization | Arabic RTL, English and French flows are usable across the whole journey. |
| MN-27 | Accessibility/responsive | Mobile-first, no overflow, readable type, adequate contrast, 44px touch targets and reduced-motion support. |
| MN-28 | Reliability | Loading, error, retry, offline and persistence states are explicit and recoverable. |

For every criterion, add:
- Status: implemented / partial / broken / planned / unverified.
- Exact repository paths and relevant line ranges.
- Test names and results.
- Browser task and screenshot evidence.
- Current deployment URL and deployed SHA where verifiable.
- Known limitation and next action.

## 22. Product experience walkthroughs required for verification

### Scenario A — Student asks a question
1. Student opens Miss Noor.
2. Student asks a question or pastes a paragraph.
3. Miss Noor interprets the need without requiring textbook selection.
4. Correct curriculum/source and learner context are selected when available.
5. Miss Noor teaches using dialogue and suitable media.
6. Student practices and answers.
7. Miss Noor assesses, explains errors and verifies understanding.
8. Learner memory/mastery updates from observed evidence.
9. Next step is selected.

### Scenario B — Student struggles twice
1. Student answers incorrectly.
2. Miss Noor identifies the likely misconception where evidence supports it.
3. She explains the misunderstanding in a different way.
4. A grounded visual/example is used when useful.
5. Student retries with a fresh question.
6. Independent verification checks whether the misconception is resolved.
7. Outcome is recorded and a review may be scheduled.

### Scenario C — Daily guided session
1. Noor greets the student.
2. Shows today's actual plan and duration.
3. Student can add remarks or new tasks.
4. The feed/session mixes due review, today's curriculum, exam topics and suitable curiosity.
5. Student can pause, ask Noor, practice and resume.
6. Session closes with a meaningful summary and next action.

### Scenario D — Lesson-to-reels
1. Student selects a lesson or asks for one.
2. System reads lesson objectives and concepts.
3. Lesson intelligence identifies teachable segments.
4. Pedagogy selects sequence and activity types.
5. Existing approved media is reused; missing assets are created.
6. Storyboard and reel sequence are assembled with consistent Miss Noor branding.
7. Voice interaction and checks are attached.
8. QA checks curriculum grounding, language, media and answer correctness.
9. Reels are delivered to Feed and reusable assets are catalogued.

### Scenario E — Parent-approved discovery
1. Parent selects interests and boundaries.
2. Miss Noor curates age-appropriate content.
3. Student explores short reels and can ask follow-up questions.
4. The experience is interactive and educationally purposeful.
5. Parent can review controls and activity.

### Scenario F — School deployment
1. School configures identity, curriculum, grades and languages.
2. Teachers connect classes and provide objectives/material.
3. Students receive personalized teaching.
4. Learning evidence is available to authorized teachers.
5. Parents receive linked-child reports.
6. Permissions isolate each school, class, student and parent.

## 23. Engineering execution and evidence discipline

This is a product specification, not authorization to make production changes.

When implementing:
1. Inspect current branch, commit SHA, deployment, open PRs and CI.
2. Read relevant source files and existing documentation before changing them.
3. Define requirement → acceptance criterion → source path → evidence.
4. Preserve passing behaviour and approved decisions.
5. Make the smallest complete change.
6. Run typecheck, lint, focused tests, full tests, build and browser verification as appropriate.
7. Inspect actual mobile and desktop rendering.
8. Report exact commit, changed files, test output, screenshots and deployment SHA.
9. Do not claim success before verification.
10. No deployment, merge, paid service, new provider or destructive change without explicit authorization.

Keep student data private. Use synthetic profiles in browser tests and redact secrets from logs/artifacts.

## 24. Canonical repository references

The following documents informed this specification and should be reconciled rather than silently overwritten:
- `docs/AMINA_PRODUCT_SOURCE_OF_TRUTH.md`
- `docs/AMINA_PROJECT_MEMORY_AND_FORGE_ORDERS.md`
- `docs/STATUS.md`
- `docs/audits/TEACHING_ENGINE_GAP_AUDIT_2026-10-27.md`
- `docs/design/EDUCATIONAL_MEDIA_SYSTEM.md`
- `docs/design/TEACHING_AGENTS_AND_SKILLS_REPORT_2026-10-28.md`
- `docs/reports/ADAPTIVE_TEACHING_GAP_MATRIX_2026-10-31.md`
- `docs/reports/EDUCATIONAL_MEDIA_VERIFICATION_2026-10-31.md`
- `docs/reports/live-teacher-loop-evidence.md`
- `docs/reports/teaching-agents-live-audit-2026-10-30.md`
- `docs/reports/teacher-agents-gpt-gemini-implementation-2026-10-30.md`
- `docs/design/UI_AUDIT_MULTI_PROFILE_2026-10-28.md`
- `docs/design/UI_AUDIT_PHONE_2026-10-26.md`

Historical OpenHands/ChatGPT conversation archives are useful provenance but may be incomplete. The existing archive documentation reports partial exports and gaps; never claim that every historical chat has been recovered. When additional conversations are found, reconcile owner decisions into this file and append a dated change log. Do not fabricate verbatim transcript content.

## 25. Decisions that must not be silently changed

- Product and teacher name: **Miss Noor**.
- It is a complete learning ecosystem, not only a personal AI teacher.
- It serves all school grades and is configurable for any school/curriculum/language.
- Official Ministry of Education materials are a key canonical source.
- A student can ask/paste/upload and receive teaching without selecting a textbook.
- The teaching cycle must include dialogue, practice, verification, feedback and next learning step.
- Reuse suitable approved assets before generating missing content/media.
- Feed is a core immersive surface, combining curriculum learning and controlled interest/discovery content.
- Out-of-curriculum interests are parent-approved and curated by Miss Noor.
- The product should provide a meaningful alternative to generic social media for children through learning-first engagement, not claim unrestricted or risk-free guarantees.
- The school-branded institutional model, teacher connection and parent reporting are part of the product vision.
- The primary learner experience is conversation-first and not dashboard-first.
- Amina's Grade 5 Girard configuration is an initial profile, not the product's market boundary.

## 26. Change log

- **2026-10-31:** Consolidated owner requirements from current conversations, recovered prior product decisions, repository source-of-truth documentation, current repository tree and dated teaching/media verification reports. Added the full ecosystem positioning, multi-grade/multi-curriculum scope, official curriculum context, request-to-teaching architecture, reuse-first content assembly, learner profile/memory, Feed and parent-approved discovery, school-branded product, parent/teacher connection, implementation evidence distinctions and acceptance criteria.
