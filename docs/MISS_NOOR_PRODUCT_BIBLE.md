# MISS NOOR — PRODUCT BIBLE
**Investor concept and product-definition edition**  
**Product:** Miss Noor  
**Repository:** `madnessgate44-debug/Amina` (legacy repository name; not the product brand)  
**Prepared:** 31 October 2026  
**Purpose:** Canonical product narrative and product architecture for creating an investor presentation in any presentation/design application.  
**Authority rule:** Latest explicit owner decisions supersede older drafts, historical audits, and implementation assumptions. This document describes the product as it stands now, distinguishes verified capabilities from planned capabilities, and avoids presenting completed work as a gap.

---

## 1. The product in one sentence

**Miss Noor is an AI-powered learning ecosystem for students, families, teachers, and schools: a personal, adaptive teaching agent combined with a curriculum-aware learning experience, an engaging educational feed, a learning library, and an institutional platform that schools can configure under their own identity.**

It is designed to serve learners across school grades, curricula, languages, and education systems—not only primary-school children, one school, one country, or one textbook.

Miss Noor is not simply:
- a chatbot that answers homework questions;
- a static school dashboard;
- a digital textbook or PDF reader;
- a library of prerecorded lessons;
- a generic short-video feed;
- a conventional tutoring marketplace.

It combines these kinds of functions into one coherent learning system, with the teaching agent coordinating the experience.

## 2. The central product thesis

Students do not always know which lesson, chapter, or textbook page explains the thing they are struggling with. They often arrive with a question, a paragraph, a photograph, a wrong answer, a school assignment, or a topic they are curious about.

The product should not force the learner to diagnose the learning need before receiving help.

The learner brings the need. **Miss Noor identifies the learning need, chooses how to teach it, assembles the required learning experience, observes the learner's response, and adapts what happens next.**

The system should make high-quality, personalized teaching available beyond the limits of a one-to-one human teacher's time—while keeping the school, teacher, family, curriculum, and learner connected where appropriate.

### The promise

- A learner can start with a question, pasted text, an image, a task, or a topic—not a mandatory textbook selection.
- Miss Noor works out what the learner needs to understand, not merely what words appeared in the prompt.
- The learner receives an appropriate teaching experience, not just an answer.
- Teaching includes explanation first, then practice, feedback, verification, and a meaningful next step.
- The experience uses suitable approved learning material when available and creates only what is missing.
- Progress and learning evidence inform future teaching.
- The student experience remains engaging and student-first; school and parent capabilities support it without turning it into an administrative dashboard.

## 3. Who the product serves

### 3.1 Students — the primary experience

Students are the centre of the product. Miss Noor should support:
- primary, preparatory/middle, secondary/high-school and other school-age stages;
- national and international curricula;
- different school systems and academic calendars;
- Arabic, English, French and additional configured languages;
- different levels of prior knowledge, confidence, pace and learning needs;
- school learning, homework, exam preparation, revision and appropriate curiosity-led learning.

The experience must be configurable. It must not hard-code one child's identity, gender, school, grade, curriculum, language or country.

### 3.2 Parents and families

Parents need an understandable way to:
- configure age-appropriate permissions and learning boundaries;
- approve or restrict out-of-curriculum interest topics;
- understand what the learner is studying and where support is needed;
- see progress based on actual learning evidence rather than activity counts alone;
- connect school learning, home learning and revision;
- manage the learner's profile and relevant settings.

Parent reporting is a supporting layer. It must not displace the student-facing teaching experience.

### 3.3 Teachers

Teachers should be able to work with the platform to:
- connect their classes and learners;
- share assignments, objectives, approved materials and learning resources;
- reinforce classroom instruction;
- understand learner progress and recurring misconceptions;
- review evidence and intervene where appropriate.

The AI should complement teachers, not falsely represent itself as the learner's schoolteacher or claim teacher approval where none exists.

### 3.4 Schools and education providers

Miss Noor is intended to be configurable and brandable for private schools and other education providers, including different national and international programmes.

An institutional deployment may configure:
- school identity and visual branding;
- curriculum, grade and language tracks;
- classes, teachers, learners and parent access;
- approved materials and learning objectives;
- permissions, roles and reporting;
- school-specific schedules, assessment periods and workflows.

This makes Miss Noor a potential school platform as well as a direct-to-family/student product. Institutional sales and school onboarding are a commercial expansion path; they are not a prerequisite to the student-first product concept.

## 4. The teaching agent: the heart of Miss Noor

Miss Noor must behave like a capable teacher, not a prompt wrapper or a lesson-text generator.

### 4.1 The core operating loop

**TEACH · ASSESS · ADAPT**

The learner-facing teaching sequence is:

1. **Understand the need** — interpret the question, pasted passage, image, assignment or topic.
2. **Diagnose** — identify the underlying concept, prerequisite, misconception or skill gap.
3. **Prepare** — select a teaching strategy and assemble approved resources and any missing material.
4. **Teach** — explain the idea clearly, using suitable examples, analogies, diagrams, animation, narration or other modalities.
5. **Practice** — give the learner an opportunity to use the idea.
6. **Assess** — evaluate the learner's actual response, not merely whether they clicked through.
7. **Give feedback** — explain what was correct or incorrect and why; remediate a misconception where appropriate.
8. **Verify** — check whether the learner can explain or apply the idea.
9. **Adapt** — change the explanation, difficulty, modality or next activity according to the evidence.
10. **Continue** — recommend the next learning step and retain appropriate learning evidence.

The visible experience is expressed as:

**Dialogue → Practice → Verification → Next learning step**

Explanation comes before questions. Miss Noor should not begin by testing a learner who has not yet been taught the relevant idea, unless the learner explicitly asks for a diagnostic check.

### 4.2 What Miss Noor must understand

The agent should infer, with appropriate uncertainty handling:
- the subject and topic;
- the concept or skill involved;
- the learner's likely intent (quick explanation, full lesson, practice, correction, revision, exploration);
- the language of the request and the appropriate teaching language;
- the relevant curriculum and school context, when identifiable;
- the learner's prior evidence and likely prerequisites;
- whether an approved source or asset can support the answer;
- whether the request needs an immediate response or a longer teaching-production workflow.

If the match to a curriculum concept is weak, Miss Noor must not silently force the request into an unrelated lesson. It should ask a useful clarifying question or handle the topic as a clearly identified general-learning request.

### 4.3 The teacher's skill set

The teaching agent is a coordinated system of capabilities, not one monolithic prompt. Its skills include:

- learner and intent diagnosis;
- curriculum and source-aware lesson preparation;
- misconception detection;
- explanation in layers, from intuitive to formal;
- Socratic questioning and comprehension checks;
- differentiation by learner level and response;
- visual and multimodal teaching;
- example and analogy selection;
- practice and assessment design;
- answer-specific feedback and remediation;
- handwriting, worksheet and image interpretation;
- spaced revision and retrieval practice;
- motivation and age-appropriate encouragement;
- lesson/session orchestration;
- learner-model and mastery updates;
- source and content-quality checks.

The repository currently contains five named teaching skills: `diagnose-misconception`, `explain-in-layers`, `socratic-check`, `grounded-visual`, and `spaced-recheck`. These are an implementation foundation, not the complete limit of the intended teacher skill system.

### 4.4 Teaching quality principles

- Correctness before fluency or entertainment.
- Explain before asking, unless diagnosis is explicitly requested.
- Feedback must respond to the learner's actual answer.
- A wrong answer is diagnostic information, not a reason to shame the learner.
- A guessed or ambiguous response must not be recorded as demonstrated mastery.
- Adaptation must be evidence-based.
- Curriculum alignment and source provenance must be visible where relevant.
- The learner should understand what happens next and why.

## 5. Dynamic lesson and content assembly

This is a defining product capability.

### 5.1 The learner does not have to choose the source

A learner may ask, for example:
- "Explain photosynthesis."
- "I don't understand this paragraph."
- "Why is this answer wrong?"
- "Teach me this topic."
- "What does this picture show?"
- "Can you help me prepare for tomorrow's exam?"

Miss Noor should infer the need and locate the relevant approved learning context where possible. Textbook selection is optional context, not a gate to teaching.

### 5.2 Reuse first; create only what is missing

The content engine follows a reuse-first policy:

1. Understand the teaching need.
2. Search approved curriculum content and reviewed assets.
3. Reuse suitable material and preserve its provenance.
4. Identify missing teaching roles or assets.
5. Generate only the missing elements when a permitted generator is available.
6. Assemble the lesson into a coherent sequence.
7. Check the result for alignment, completeness and quality.
8. Present the experience in the appropriate student interface.

The system should not regenerate an entire lesson or media package when an approved explanation, diagram, animation, narration or exercise already meets the need.

### 5.3 Fast answer versus full teaching job

Not every interaction should become a long lesson.

- **Quick explanation:** answer immediately when approved material can support a concise, useful explanation.
- **Full lesson / unsupported need:** create a staged teaching-production job when the learner requests a lesson or suitable approved material is missing.
- **Uncertain match:** do not fabricate a curriculum match; clarify or transparently use a general-learning path.

For longer jobs, the learner should see genuine stage progress. The work must persist so an interrupted session can be resumed rather than lost.

### 5.4 Learning experience composition

A teaching experience can contain:
- teacher dialogue and explanation;
- worked examples;
- diagrams and annotated illustrations;
- animation or video;
- audio narration and spoken explanation;
- interactive hotspots and carousels;
- multiple teaching cards within one reel;
- questions, practice and verification;
- remediation and a next-step recommendation.

A single reel or learning unit may contain multiple carousel/cards or stages. A reel is not limited to one static question or one media asset.

## 6. The student product experience

The product's main surfaces remain:

**HOME | FEED | LIBRARY | NOOR**

These are connected destinations, not separate disconnected mini-apps.

### 6.1 HOME — the daily learning companion

Home should orient the learner and start a conversation, not overwhelm them with a management dashboard.

A representative opening:
- Miss Noor greets the learner.
- She asks, "What do we have today?"
- She explains the day's learning plan, relevant tasks and approximate session duration.
- She invites the learner to add something or raise a concern.
- She guides the learner into the next useful activity.

Home can surface:
- today's school learning and planned sessions;
- homework and upcoming assessments;
- due revision and weak areas;
- progress and completed learning;
- a clear route into the next session.

The interface should prioritise the next useful action and conversational guidance over dense statistics.

### 6.2 FEED — the engaging learning destination

The Feed is a core product surface, not a decorative marketing feature.

It should combine:
- short teaching experiences;
- interactive questions and response cards;
- explanation and worked examples;
- diagrams, animation and narrated media;
- curriculum-linked revision;
- exam preparation;
- games, memorisation and knowledge cards;
- appropriate curiosity-led discovery.

The feed should feel immersive and media-rich, with a vertical, mobile-first interaction model. It should not be a static list of lesson links or a conventional dashboard.

**Two complementary streams:**
1. **Learning feed:** driven by curriculum, today's work, due review, learner evidence, upcoming exams and teacher/school context.
2. **Interest and discovery feed:** broader age-appropriate learning and entertainment, curated by Miss Noor and governed by parent/school permissions where applicable.

The second stream is not an unrestricted social-media feed. Its purpose is to offer a more useful, educational and controlled alternative to generic short-video consumption—not to copy engagement mechanics without educational value.

A previous repository policy proposed an initial allocation of 40% due review, 30% today's lessons, 20% exam topics and 10% curiosity. Treat that as a tunable starting hypothesis, not a universal product promise or fixed algorithm.

### 6.3 LIBRARY — trusted learning resources

The Library connects learning experiences to:
- official textbooks and school-approved books;
- curriculum units, chapters and lessons;
- relevant source pages and references;
- teacher-provided materials;
- imported learning resources where permitted;
- saved reels, explanations and media;
- notes, collections and revision material.

Where official PDFs are used, the system should identify the source and version and provide useful navigation from a book's index or table of contents to the relevant lesson. Availability and copyright permissions must be respected; the product must not imply that every textbook can be redistributed freely.

The Library is a source and continuity layer—not the only way to start learning.

### 6.4 NOOR — direct teaching conversation

The NOOR experience is where the learner can ask, paste, upload, speak, practise and continue a lesson with the teacher.

It should support:
- natural text and voice interaction;
- image and worksheet input;
- quick explanation;
- full lesson production;
- interactive practice and verification;
- continuation of interrupted lessons;
- access to the learner's relevant learning context.

The character and voice should make Miss Noor feel present, approachable, composed and recognisably teacher-like. The persona supports the teaching; it must not substitute for teaching quality.

## 7. Voice and multimodal interaction

Voice is a primary interaction mode, not a novelty.

The intended experience includes:
- spoken explanation and narration;
- natural hand-off from teacher speech to learner response;
- speech input without requiring the learner to find a small control;
- answer recognition and response;
- spoken feedback and continuation;
- interruption and recovery;
- visible controls and a usable text fallback.

Miss Noor should finish speaking before opening the learner's turn. Feed progression should follow the end of the spoken response rather than a fixed timer that cuts off longer explanations.

The product should combine voice with readable text, visuals and touch interaction. It must remain usable when audio is unavailable, muted or inappropriate.

## 8. Curriculum, knowledge and trust

### 8.1 Broad curriculum architecture

The platform must support multiple education systems. A configurable curriculum hierarchy can include:

Country/system → curriculum → school → academic year → grade → language track → subject → term → unit → lesson → objective → concept/skill → exercise/assessment.

The exact structure varies by education provider. It should be configurable rather than hard-coded around one national curriculum.

### 8.2 Source hierarchy and provenance

Content should be classified by origin, for example:
1. official curriculum or ministry source;
2. school-approved source;
3. teacher-provided material;
4. reviewed supplementary source;
5. AI-generated teaching material;
6. learner/parent-provided input;
7. external reference.

The interface and internal records should distinguish these sources. Generated explanations must not be presented as official textbook text. A citation or curriculum mapping should be shown when the product makes a source-specific claim.

### 8.3 Learner model

Keep stable learner profile data separate from evolving learning evidence.

Profile may include configured grade, school, curriculum, language and accessibility preferences. Learning evidence may include:
- concepts encountered;
- answers and explanations;
- misconceptions observed;
- independent versus assisted performance;
- confidence or uncertainty;
- review history;
- mastery estimates and their evidence;
- next recommended steps.

Mastery is not equivalent to time spent, reels watched, XP earned or a correct tap without understanding.

## 9. Assessment, memory and progress

Assessment should occur naturally inside teaching.

The system should:
- assess practice answers;
- give meaningful feedback;
- identify likely misconceptions;
- ask the learner to explain or apply the concept;
- distinguish correct, partial, unclear and guessed responses;
- record evidence only when the concept and assessment are sufficiently grounded;
- schedule appropriate rechecks and spaced revision;
- adapt subsequent teaching to the evidence.

Progress should be understandable to students, parents and teachers, with different levels of detail and permissions.

Gamification—XP, streaks, badges, saves, likes and collections—can support motivation, but must not become a proxy for learning or use shame, pressure or manipulative engagement.

## 10. Parent, teacher and school ecosystem

### Parent layer
- learner profile and permissions;
- interest-topic controls;
- age-appropriate content governance;
- homework and assessment visibility;
- evidence-based progress reports;
- useful alerts and suggested support.

### Teacher layer
- class and learner connection;
- assignment and resource sharing;
- learning objectives and approved content;
- progress and misconception review;
- support and intervention workflows.

### School layer
- configurable institutional branding;
- curriculum and language configuration;
- roles and permissions;
- school calendar, classes and teacher relationships;
- approved learning resources;
- reporting and integration points.

These are part of the product vision and architecture. Unless supported by a working implementation and evidence, they must be described in an investor deck as planned platform capabilities—not as already deployed school integrations or signed partnerships.

## 11. Personalisation, safety and accessibility

The experience should adapt to the learner without making unsupported assumptions.

Requirements include:
- language-aware teaching and source selection;
- Arabic right-to-left support and appropriate typography;
- English and French support, with additional languages configurable;
- mobile-first layouts and touch targets;
- accessible text, captions/alt text and reduced-motion behavior;
- voice alternatives and readable fallbacks;
- age-appropriate content boundaries;
- parent/school controls for discovery content;
- clear separation of verified curriculum material and generated content;
- privacy-conscious handling of student work and learning records.

The product should avoid claims such as "risk-free" or "always correct." It should instead describe concrete governance, review, provenance and permission mechanisms.

## 12. Business and market model

Miss Noor has two complementary routes to market:

### 12.1 Student/family product
A direct learning companion for students and families, with access to adaptive teaching, curriculum resources, revision and controlled discovery.

### 12.2 Institutional product
A configurable, school-branded learning ecosystem for private schools and education providers, connecting students, parents and teachers through a common teaching and learning platform.

Potential commercial components include:
- student/family subscriptions or plans;
- school/institution licensing;
- configurable branding and deployment;
- additional institutional capabilities and integrations.

Pricing, unit economics, market size, customer acquisition costs, school contracts, revenue, retention and traction are not established by the repository evidence reviewed for this Bible. An investor deck must use validated business data or clearly labelled assumptions; it must not invent traction, partnerships or financial performance.

## 13. Product differentiation

The intended differentiation is the combination of:

1. **Need-first teaching:** students can begin with a question or artifact, not a textbook-navigation workflow.
2. **Teacher-agent behavior:** diagnosis, strategy selection, explanation, practice, verification and adaptation.
3. **Dynamic composition:** reuse approved content and assets, create only missing elements, assemble a complete experience.
4. **Persistent learning continuity:** retain progress and resume interrupted lesson-production work.
5. **Curriculum-aware learning:** connect teaching, books, objectives, sources and assessment.
6. **Immersive educational Feed:** make learning interactive, narrated and media-rich.
7. **Multistakeholder ecosystem:** support students, families, teachers and configurable school deployments.

The differentiator is not simply that the product uses AI, voice, videos or gamification. It is the orchestration of these elements around an adaptive teaching loop.

## 14. Current implementation: what the repository now evidences

This section is deliberately time-sensitive. It reflects the repository records reviewed on 31 October 2026. It is not a guarantee that every feature is complete across every grade, curriculum or user journey.

### 14.1 Verified implementation foundation

The current `main` status ledger reports the following as implemented and tested:

- An ask-understanding and content-assembly engine that routes between immediate explanations and longer lesson jobs.
- Reuse-first resolution of approved material, with missing roles identified for generation rather than silently fabricated.
- A render-ready teaching experience with Dialogue/Teach, Practice, Verification and Next Step phases.
- Interactive practice and verification in the NOOR ask station.
- Answer feedback and adaptation based on the learner's response.
- Evidence recording through the existing mastery system when the ask is matched to a real curriculum concept; unmatched general questions do not falsely claim curriculum mastery.
- Durable lesson-production jobs saved after each stage.
- Visible stage progress and a resume path after reload/interruption.
- Feed reels with spoken teacher narration, answer reactions and hands-free voice turn-taking support.
- A reusable educational-media contract, catalog and renderer for real diagrams, animation and narration.
- Arabic, English and French labels/content structures in the relevant systems, with language-matching fixes documented.
- Automated tests, build checks and browser verification recorded in the status ledger.

### 14.2 Specific repository evidence

The latest `docs/STATUS.md` entry records:
- **Run 5:** full teaching experience rendered and assessed; practice and verification interactive; verified outcomes recorded only for matched curriculum concepts; production deployment and live browser drive reported.
- **Run 5b:** durable lesson jobs persisted at each stage, with visible progress and resume after reload; production-browser testing reported for an Arabic full lesson.
- **Run 4:** reuse-first assembly and routing between quick answers and longer jobs; false curriculum matches fixed and tested.
- **Run 3:** real media bound to lessons and rendered through the feed; live browser checks for diagram, hotspots, animation and narration.
- **Run 2:** real teacher audio and feed voice hand-off reported as deployed and browser-tested.

Relevant implementation files include:
- `src/services/assembly/assemblyEngine.ts`
- `src/services/assembly/experiencePresenter.ts`
- `src/services/assembly/jobService.ts`
- `src/services/assembly/assetResolver.ts`
- `src/services/assembly/contentAssembler.ts`
- `src/components/teacher/VirtualTeacherClassroom.tsx`
- `src/components/feed/FeedScreen.tsx`
- `src/components/feed/ReelCard.tsx`
- `src/components/feed/ReelMedia.tsx`
- `src/data/media/mediaCatalog.ts`
- `src/services/voice/handsFreeLoop.ts`

### 14.3 Important scope limits — do not overclaim

The repository evidence does **not** establish that:
- the complete dynamic lesson-production workflow is already seamlessly delivered inside every Feed path; the full assembled experience is specifically evidenced in the NOOR/teacher classroom path, while Feed has its own interactive reel system;
- the entire curriculum has complete media coverage; the 31 October media verification report describes a small initial set of lessons (science, mathematics and French), with a reusable pipeline for expansion;
- every grade, school system, curriculum and language is fully populated and validated;
- all school, teacher and parent workflows are fully deployed and integrated with real institutions;
- the full product has been validated with a broad population of students or schools;
- commercial traction, revenue, partnerships or learning-outcome improvements have been established.

These are expansion, validation or commercial proof requirements—not reasons to describe already shipped components as nonexistent.

### 14.4 Current product gap to keep visible

The next major product integration question is to make the full on-demand teaching experience feel like one coherent student journey across NOOR and FEED: a learner's question or pasted content should be able to become a complete, multi-stage, media-rich teaching experience, potentially composed of multiple cards/carousels, with the same continuity, voice, assessment and adaptation—not a disconnected answer followed by unrelated reels.

The feed's visual richness and curriculum/media coverage must continue to expand. Current media infrastructure is reusable, but the verified catalogue is not yet the whole curriculum.

## 15. Initial learner context — example, not product limitation

The project began with a learner context in Alexandria, Egypt:
- Grade 5 primary;
- Girard French school;
- Egyptian curriculum with French-curriculum elements;
- English, mathematics and science studied in French.

This is a concrete configuration/use case, not the product's target-market boundary. The product must support other grades, schools, curricula, languages and education systems.

Do not use the initial learner's identity or profile as a hard-coded product assumption.

## 16. Experience principles and visual direction

- Student-first, conversation-led, welcoming and composed.
- Modern, premium, elegant and mobile-native.
- Miss Noor should feel like a credible, reassuring teacher persona with a recognisable visual presence.
- The app should not look like a generic admin dashboard.
- Feed content should be immersive, full-screen or near-full-screen where appropriate, with real educational media and meaningful interaction.
- Library, books, settings and administrative functions should remain accessible without overwhelming the main learning journey.
- Learning, revision and curiosity should feel connected rather than fragmented into separate products.

Visual polish must support clear pedagogy. The character, motion, media and gamification should never obscure the lesson or distract from the learner's response.

## 17. Product journey examples

### Scenario A — question to complete lesson
A student pastes a paragraph and says they do not understand it. Miss Noor identifies the likely concept and language, checks relevant approved material, explains the idea, offers an example and visual, gives a practice question, responds to the answer, asks the learner to explain the idea back, and recommends a next step.

### Scenario B — quick question
A student asks a focused question that approved material can answer. Miss Noor gives an immediate explanation with the relevant source or visual. She does not force a long lesson job unnecessarily.

### Scenario C — misconception remediation
A student chooses a wrong answer. Miss Noor identifies the likely misconception where evidence supports it, explains the error without shaming, teaches the distinction and gives a targeted recheck. The learner's evidence updates the next learning step.

### Scenario D — interrupted lesson
A student starts a full lesson, leaves the app, then returns. The system offers to resume the persisted lesson from its saved stage rather than losing progress or restarting from the beginning.

### Scenario E — daily learning feed
The learner opens Feed and receives a relevant sequence drawn from today's learning, due revision, exam preparation and suitable curiosity topics. Reels contain teacher narration, media, questions and answer-specific feedback. The feed should not be a passive video stream.

### Scenario F — school ecosystem
A school configures its identity, curriculum, classes, teachers and approved resources. Students use the same student-first Miss Noor experience, teachers provide context and assignments, and parents receive appropriate evidence-based visibility under configured permissions.

## 18. Investor presentation narrative

A strong investor deck should tell this story in order:

1. **The problem:** learning support is fragmented across textbooks, homework tools, generic AI chat, videos and school portals; students often cannot identify what they do not understand.
2. **The insight:** the learner should not have to diagnose the learning gap or navigate the curriculum before a teacher can help.
3. **The solution:** Miss Noor is a teacher-agent and learning ecosystem that turns a learner's question or task into an adaptive teaching experience.
4. **The product experience:** show the conversational opening, the Feed, a complete teaching sequence, media/carousels, Library and learning continuity.
5. **The engine:** show TEACH · ASSESS · ADAPT and reuse-first dynamic assembly.
6. **The ecosystem:** show student, parent, teacher and school roles, with configurable school branding.
7. **The differentiation:** explain why the integrated teacher loop and curriculum-aware assembly are more than a chatbot or content feed.
8. **The business model:** present direct family/student and institutional school routes, with pricing and economics clearly marked as validated or proposed.
9. **The roadmap:** show expansion from the working foundation to broader curricula, media coverage, unified Feed/NOOR orchestration, school workflows and validation.
10. **The ask:** state the funding or strategic support sought, use of funds and milestones only when the owner supplies those details.

### Visual assets the deck should show

- A premium cover with the Miss Noor identity and teacher persona.
- A simple product ecosystem diagram.
- A student journey from question → diagnosis → teaching → practice → verification → adaptation.
- Actual or clearly labelled concept screens for HOME, FEED, LIBRARY and NOOR.
- A multi-card lesson/reel showing explanation, visual, narration, question and feedback.
- A curriculum/source and reuse-first assembly diagram.
- Parent/teacher/school ecosystem views.
- A product roadmap with current, next and future clearly separated.

Do not present concept mockups as screenshots of a live product. Label them as product concepts where they are not actual deployed screens.

## 19. Roadmap framing

### Current foundation — repository evidence
- Ask understanding and curriculum-aware routing.
- Reuse-first assembly.
- Interactive teaching phases in the NOOR classroom.
- Durable lesson jobs, progress and resume.
- Feed voice interaction and an initial educational-media system.
- Initial curriculum and language support.

### Next product integration
- Unify question-to-lesson production with the immersive Feed journey.
- Support multiple carousel/card stages in one coherent lesson experience.
- Expand reviewed media and narration across curriculum coverage.
- Strengthen learner-model-driven strategy selection and cross-session adaptation.
- Complete end-to-end quality validation across languages, grades, devices and real learner workflows.

### Platform expansion
- Broader curriculum and school-system coverage.
- Configurable school deployments and branding.
- Teacher workflows, parent reporting and institutional permissions.
- Wider language and accessibility coverage.
- Integrations and commercial packaging supported by customer discovery.

Roadmap timing and delivery commitments should be added only after engineering estimation and owner approval.

## 20. Investor claims and evidence discipline

Use these categories in the deck and supporting materials:

- **Implemented and evidenced:** supported by current repository implementation, tests and recorded live verification.
- **Implemented foundation; coverage limited:** capability exists, but not across the whole curriculum, every language or every user path.
- **Designed product capability:** part of the product architecture and requirements, but not yet demonstrated end-to-end.
- **Roadmap:** planned future work.
- **Commercial hypothesis:** pricing, market, distribution or revenue assumptions requiring validation.
- **Measured result:** use only when supported by a documented measurement and methodology.

Never turn a test passing into a claim of educational effectiveness. Never turn a configured capability into a claim of school adoption. Never turn a concept screen into a live-product screenshot. Never state a partnership, customer, revenue, retention figure or learning outcome without evidence.

## 21. Decisions and supersession register

This section prevents old material from reappearing as if it were still the current plan.

### Current decisions
- Product name: **Miss Noor**. The repository's Amina name is historical. The teacher persona is Miss Noor.
- The product serves students across school grades, curricula, languages and school systems—not only the initial Grade 5 use case.
- Student-first experience remains central; the wider product also serves families, teachers and schools.
- The learner can start with a question or pasted content without selecting a textbook.
- Teaching is a full loop: TEACH · ASSESS · ADAPT; Dialogue → Practice → Verification → Next learning step.
- Explain first, then question; respond to the actual learner answer with feedback and continuation.
- Reuse approved assets and content first; generate missing material only; assemble dynamically.
- Distinguish immediate answers from longer staged teaching jobs.
- Longer jobs show real progress and can resume after interruption.
- Feed is a core immersive learning destination with voice, interaction and real educational media.
- One reel/learning experience may contain multiple cards or carousels.
- Interest/discovery content is curated and governed, not an unrestricted social feed.
- An investor concept document is the current deliverable before school outreach or additional app-building.

### Historical ideas that must not be presented as current gaps
- Earlier reports that the NOOR ask station rendered only dialogue and next step are superseded by the 31 October run-5 implementation record.
- Earlier reports that long lesson jobs were synchronous or had no durable progress are superseded by the 31 October run-5b record.
- Earlier reports that the Feed had no real media or no voice turn-taking are superseded by the later 31 October implementation records.
- Earlier reports that Arabic misconception content and misconception-reel reachability were missing are superseded by the 31 October runs recorded in the status ledger.
- Older descriptions of Miss Noor as only a personal tutor or only an elementary-school companion are superseded by the broader student/family/teacher/school ecosystem decision.
- The old product/dashboard framing must not override the current student-first, conversation-led and immersive Feed direction.

### Still-valid constraints
- Do not claim the whole curriculum has complete media coverage.
- Do not claim that every curriculum, grade or language is fully implemented.
- Do not claim that all school/parent/teacher workflows are live.
- Do not claim that the full dynamic lesson-production experience is already unified across every Feed and NOOR journey.
- Do not invent customers, school contracts, traction, revenue, pricing, retention or educational outcomes.

## 22. Source register and research boundary

This Bible was consolidated from the following current repository materials and recoverable conversation context:

### Current repository documents reviewed
- `docs/MISS_NOOR_PRODUCT_SPEC.md` — existing consolidated product specification and recovered historical decisions.
- `docs/STATUS.md` — latest implementation/status ledger, including 31 October runs 2–5b.
- `docs/reports/ADAPTIVE_TEACHING_GAP_MATRIX_2026-10-31.md` — requirements and evidence for the adaptive teaching experience.
- `docs/reports/EDUCATIONAL_MEDIA_VERIFICATION_2026-10-31.md` — verified educational media coverage and limitations.
- `docs/design/EDUCATIONAL_MEDIA_SYSTEM.md` — media pipeline and rendering architecture.
- `docs/design/TEACHING_AGENTS_AND_SKILLS_REPORT_2026-10-28.md` — teacher-agent and skills research/design.
- `docs/AMINA_PRODUCT_SOURCE_OF_TRUTH.md` — historical requirements baseline; older than the current product Bible.

### Implementation files reviewed
- `src/services/assembly/assemblyEngine.ts`
- `src/services/assembly/experiencePresenter.ts`
- `src/services/assembly/jobService.ts`
- `src/components/teacher/VirtualTeacherClassroom.tsx`
- `src/components/feed/FeedScreen.tsx`
- `src/components/feed/ReelCard.tsx`
- `src/data/media/mediaCatalog.ts`

### Conversation context recovered
Recoverable prior-conversation summaries/excerpts include decisions from 21, 22, 29 and 31 October 2026, including the latest teaching-agent and investor-document direction. This retrieval is not a guaranteed verbatim export of every historical ChatGPT conversation. The newest explicit owner decisions have been prioritised over older statements and stale implementation reports.

### Audit boundary
This is a product and investor narrative consolidation, not a claim that every file in the 333-file repository was inspected line-by-line. The listed current implementation files and source-of-truth reports were reviewed to reconcile the latest product story with recorded implementation evidence. A full repository forensic audit is a separate engineering task.

---

**Canonical rule for future updates:** When a new owner decision conflicts with this Bible, update the relevant current section and supersession register. Do not append an obsolete requirement as though it were still active. Record implementation status separately from product intent, and attach evidence before changing a roadmap item to implemented.
