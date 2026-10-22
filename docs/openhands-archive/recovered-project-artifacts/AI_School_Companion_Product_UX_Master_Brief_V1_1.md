# AI School Companion — Product & UX Master Brief
**Version:** 1.0  
**Status:** Concept / MVP definition  
**Primary build targets:** Google AI Studio, AI app builders, or equivalent development environments

---

## 1. Product Definition

**AI School Companion** is a personal, AI-powered school companion designed to help a student manage, understand, practice, review, and complete schoolwork throughout the entire academic year.

It is **not simply an educational content app** and not simply a TikTok-style learning app.

Its core job is to answer:

> **“What do I need to do today, what do I need to learn, what do I still not understand, and how do I get everything done without feeling like I am spending the whole day studying?”**

The companion follows the student's real school life:

**School → Today's lessons → Homework → Learning → Practice → Review → Progress → Exams**

The first prototype may be tested with a fifth-grade student such as Amina, but the product must be designed from the beginning to support **any student, any grade, and any supported curriculum**.

---

# 2. Core Product Philosophy

The application should feel more like a **personal social/interactive digital environment** than a traditional school platform.

It should combine:

- Personal AI assistant
- TikTok/Reels-style short learning content
- Instagram-style saves, likes, collections, and personal content organization
- Interactive games
- Quizzes
- Voice interaction
- AI tutoring
- Digital and handwritten homework
- Camera/OCR homework checking
- Personalized revision
- Curriculum tracking
- Exam preparation
- Student progress intelligence
- Parent visibility and controls

The student should not feel that the application is constantly saying:

> “Go study.”

Instead, it should create a sequence of small, achievable activities that naturally move the student toward completing the day's academic responsibilities.

---

# 3. Student Onboarding / Setup

The first experience must be a **guided setup**, not an empty dashboard.

The School Companion should introduce itself and collect enough information to personalize the entire system.

## 3.1 Student Registration

The student/parent enters:

- Student name
- Age
- Grade/year
- School/country
- Curriculum
- Academic year
- Preferred language
- Subjects
- Optional school timetable
- Optional exam calendar
- Optional teacher information
- Parent/guardian account where applicable

The system should support different students using the same product.

Example:

### Student A
Grade 5 — Egyptian curriculum

### Student B
Grade 9 — Egyptian curriculum

Each student gets a separate academic profile and separate learning state.

---

# 4. School Companion Initial Interview

After registration, the AI Companion conducts a short onboarding conversation.

It should ask things such as:

- What subjects do you study?
- Which subjects do you enjoy?
- Which subjects are difficult?
- How do you usually like to learn?
- Do you prefer videos, games, questions, explanations, or talking?
- Do you prefer short sessions or longer sessions?
- When do you usually come home?
- When do you usually have activities/sports?
- What time do you normally sleep?
- Do you have regular homework days?
- Are there upcoming exams?

The purpose is not to create a long questionnaire.

The AI should learn progressively through normal interaction.

---

# 5. Student Academic Profile

The system maintains a continuously updated student profile.

It should track:

### Academic
- Subjects
- Lessons
- Skills
- Knowledge/mastery
- Errors
- Repeated mistakes
- Homework
- Completed work
- Missed work
- Revision history
- Exam performance

### Learning behavior
- Preferred media
- Average session duration
- Common drop-off points
- Preferred difficulty
- Response speed
- Repeated requests for explanation
- Strong/weak activity types

### Personal learning state
- Current workload
- Today's available time
- Upcoming deadlines
- Exam proximity
- Unfinished tasks
- Topics needing review

This profile should evolve automatically.

---

# 6. Curriculum Brain

The application needs a complete academic structure.

The curriculum should be represented approximately as:

```text
Academic Year
 ├── Term
 │    ├── Subject
 │    │    ├── Unit
 │    │    │    ├── Lesson
 │    │    │    │    ├── Concepts
 │    │    │    │    ├── Skills
 │    │    │    │    ├── Practice
 │    │    │    │    └── Homework
```

The system must not assume that all students follow the same curriculum.

Curriculum sources should be configurable and verified.

For an Egyptian student, the system can eventually use official/current Ministry of Education curriculum materials and other authorized educational sources.

The application must clearly distinguish:

- Official curriculum content
- AI-generated explanations
- AI-generated practice
- Teacher/student-entered information
- External educational content

---


# 6A. School Knowledge & Teaching System

The application must contain a **School Knowledge System** that separates the canonical curriculum from the materials used to teach, practice, and extend it.

The Virtual Teacher is not merely an AI chatbot that knows the textbook. It must have access to the relevant **teacher-side instructional material** as well as the student-facing material.

## 6A.1 Three Core Educational Sources

### A. Official Student Curriculum

This is the canonical source for what the student is expected to learn.

Examples:

- Ministry of Education student textbooks
- Official curriculum documents
- Official subject/grade materials
- School-provided curriculum materials where they define the student's actual program

### B. Supplementary / Support Books

These are privately published educational books sold as support materials.

Examples may include:

- الأضواء
- سلاح التلميذ
- Other authorized supplementary books

These materials should **support the curriculum**, not replace the canonical curriculum.

They can provide:

- Additional explanations
- Alternative examples
- Extra exercises
- Revision
- Exam-style practice
- Different teaching approaches

The system must identify them as **supplementary sources**, not Ministry curriculum.

### C. Teacher Materials

The Virtual Teacher must also have access to authorized teacher-facing material, such as:

- Teacher guides
- Teaching guides/manuals
- Official lesson plans
- Learning objectives
- Teaching sequence
- Weekly pacing
- Suggested classroom activities
- Assessment guidance
- Remediation guidance
- Expected skills and outcomes
- Teacher instructions for individual lessons

Where available and legally usable, this material should tell the system not only **what** is taught, but also **how and when it is intended to be taught**.

## 6A.2 Source Hierarchy

The system must never treat all educational sources as equivalent.

```text
                    SCHOOL BRAIN
                         │
              ┌──────────┴──────────┐
              │                     │
       CANONICAL CURRICULUM   TEACHING KNOWLEDGE
              │                     │
       Official sources        Teacher materials
              │                     │
              └──────────┬──────────┘
                         │
                  LEARNING GRAPH
                         │
          ┌──────────────┼──────────────┐
          │              │              │
     Student Books   Support Books   School Input
          │              │              │
          └──────────────┼──────────────┘
                         ▼
                  VIRTUAL TEACHER
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
     Explain          Practice         Assess
        │                │                │
        └────────────────┼────────────────┘
                         ▼
                  STUDENT MASTERY
```

The system should be able to answer:

1. **What does Amina need to learn?** — curriculum.
2. **When should she encounter it?** — timetable + pacing + school progress.
3. **How can it be taught?** — teacher guidance + approved teaching strategies.
4. **What material can explain or practice it?** — official and supplementary books.
5. **Does Amina understand it?** — assessment and interaction.
6. **What should happen next?** — adaptive learning engine.

## 6A.3 Curriculum Knowledge Graph

The curriculum should become a structured knowledge graph rather than a collection of PDFs.

```text
Academic Year
  ↓
Term
  ↓
Subject
  ↓
Unit
  ↓
Lesson
  ↓
Concept
  ↓
Skill / Learning Objective
  ↓
Activities / Questions / Examples
```

Each concept can then be linked to:

```text
Concept
 ├── Official student book
 │    ├── chapter
 │    ├── lesson
 │    └── page/reference
 │
 ├── Teacher material
 │    ├── objective
 │    ├── teaching guidance
 │    ├── weekly placement
 │    └── assessment guidance
 │
 ├── Supplementary books
 │    ├── explanation
 │    ├── examples
 │    └── exercises
 │
 └── AI-generated learning activities
      ├── reel
      ├── story
      ├── game
      ├── quiz
      └── practice
```

This mapping is essential. It allows the Virtual Teacher to use different materials without losing track of the official learning objective.

## 6A.4 School-Specific Reality

The system must distinguish between:

- **What the official curriculum says should be taught**
- **What the school says is being taught**
- **What the timetable says was scheduled**
- **What the student says actually happened**
- **What Amina has demonstrated that she understands**

These can differ.

For example:

```text
Official pacing:
Fractions → Week 5

School timetable:
Fractions → Monday

Student report:
Teacher postponed fractions → Monday class missed

Amina mastery:
Prerequisite concept still weak
```

The Virtual Teacher should not blindly force the official sequence.

It should reconcile the sources and decide what Amina actually needs next.

## 6A.5 Teacher Material Is Not the Teacher

Teacher manuals and Ministry guidance are **knowledge sources**, not instructions to imitate a human teacher word-for-word.

The AI should use them as constraints and evidence while adapting the experience to the individual student.

The Virtual Teacher can therefore say, in effect:

> "This is the concept the curriculum expects you to learn. Your school is currently on this lesson. You had difficulty with the prerequisite, so let's fix that first."

This creates a genuine teaching system rather than a chatbot with textbook retrieval.

## 6A.6 Content Provenance

Every important educational claim should retain provenance.

At minimum:

```text
source_type:
  official_curriculum
  teacher_material
  school_material
  supplementary_book
  ai_generated
  student_input

source_id
grade
subject
unit
lesson
concept
page_or_section
academic_year
validation_status
```

AI-generated explanations and exercises must remain distinguishable from source material.

## 6A.7 Copyright / Authorization

Commercial supplementary books and teacher materials must not simply be copied into the application without the necessary rights.

The architecture should support:

- Licensed/authorized content
- User-provided content where permitted
- Structured metadata and references
- Links/references to external material where full reproduction is not authorized
- AI-generated explanations based on legitimately available source information

The system must never assume that because a book is publicly sold, its full contents can be reproduced inside the app.


# 7. School Timetable

The student can enter or import a weekly timetable.

Example:

```text
Sunday
08:00 Arabic
09:00 Math
10:00 Science
11:00 English

Monday
08:00 Social Studies
09:00 Arabic
...
```

The companion uses this timetable as a planning reference.

It should know what subjects were **expected** to occur that day.

---

# 8. The “Welcome Home” Experience

This is one of the most important product moments.

After school, the companion should initiate a short conversation:

> “Welcome back. What did you do at school today?”

The student can answer naturally by voice or text.

Example:

> “We had Arabic and math. In Arabic we started a new lesson, and our teacher gave us homework.”

The AI compares this with:

- Today's timetable
- Expected lessons
- Previously recorded lessons
- Known homework

Then asks only the necessary follow-up questions.

Example:

> “Was the Arabic homework due tomorrow?”

The objective is to reconstruct the student's actual school day with minimal effort.

---

# 9. Daily Mission Planner

After understanding the day, the AI builds the student's personalized plan.

It considers:

- Today's lessons
- Homework
- Unfinished previous work
- Weak areas
- Upcoming deadlines
- Upcoming exams
- Available time
- Student preferences
- Fatigue / session history
- Required revision

The output should be a sequence of short missions.

Example:

```text
TODAY'S MISSIONS

1. Arabic — Understand today's lesson
   15 min

2. Arabic — Homework
   20 min

3. Math — Practice
   15 min

4. English — Vocabulary game
   10 min

5. Weekly review
   10 min
```

The student should always understand:

> **Why am I doing this now?**

---

# 10. Learning Formats

The same lesson can be presented through different formats.

## Short Learning Reels

- 15–90 seconds
- One concept per video
- Strong visual opening
- Simple explanation
- Examples
- Quick question at the end

## Stories / Visual Lessons

Lessons can become:

- Illustrated stories
- Animated sequences
- Character-based explanations
- Visual timelines
- Concept cards

## Interactive Games

Examples:

- Matching
- Drag and drop
- Ordering
- Memory games
- Word games
- Classification
- Timed challenges
- Problem-solving
- “Beat the level”

## Quizzes

- Quick checks
- Adaptive difficulty
- Multiple choice
- True/false
- Fill in the blank
- Ordering
- Short answer

## Voice Learning

The student can speak to the AI:

> “I don't understand this.”

> “Explain it differently.”

> “Ask me questions.”

> “Test me.”

The AI should respond conversationally.

## AI Tutor

The tutor should adapt the explanation instead of simply repeating the textbook.

For example:

**First attempt:** normal explanation

If unsuccessful:

**Second attempt:** simpler example

If still unsuccessful:

**Third attempt:** story / analogy / visual explanation

Then:

**Check:** short question to verify understanding

---

# 11. Homework System

Homework should support both:

## Digital Homework

The application can create activities directly on the phone:

- Questions
- Games
- Writing tasks
- Matching
- Short answers
- Voice responses
- Interactive exercises

## Handwritten Homework

Some work should intentionally remain handwritten.

Reasons:

- Writing practice
- Handwriting development
- Traditional school requirements
- Better retention for certain tasks

The student can photograph the completed page.

The system should:

1. Detect the page
2. Read the student's handwriting where possible
3. Identify questions and answers
4. Compare answers with expected outcomes/rubric
5. Detect likely mistakes
6. Explain the mistake
7. Ask the student to correct it
8. Record the result

The AI should avoid immediately giving the answer when the educational goal is correction and learning.

---

# 12. Handwriting Development

For handwriting-related subjects, the application may maintain a handwriting profile.

Possible metrics:

- Letter formation
- Spacing
- Alignment
- Consistency
- Legibility
- Writing speed where measurable
- Repeated handwriting issues

The system can provide practice recommendations.

It must avoid presenting handwriting analysis as a medical or diagnostic assessment.

---

# 13. Social-Media-Inspired Interface

The application can borrow familiar interaction patterns without becoming a general social network.

## Like

The student can like useful content.

## Save

The student can save:

- Reel
- Explanation
- Game
- Quiz
- Question
- Note

## Collections

Students can create collections such as:

- Arabic
- Math
- Before Exam
- I Don't Understand
- Important
- Review Later

## Personal Notes

The student can attach notes to learning content.

Example:

> “Remember this rule.”

## Share

Sharing should initially be controlled and education-focused.

Potential future sharing:

- With parent
- With teacher
- With classmates
- Within a private study group

The initial MVP should avoid unnecessary public social-network complexity.

---

# 14. Personalized Learning Feed

The home/discovery experience can feel similar to a short-form content feed.

However, the feed is controlled by the student's academic needs.

Examples:

> “You struggled with fractions yesterday.”

→ show a 30-second fractions explanation.

> “You have an Arabic quiz tomorrow.”

→ show a quick Arabic challenge.

> “You saved three grammar videos.”

→ suggest a mini practice session.

The feed should not optimize purely for watch time.

Its primary optimization target is:

**learning + completion + retention.**

---

# 15. Student Knowledge Map

The system maintains a mastery map.

Example:

```text
Arabic
├── Reading             92%
├── Grammar
│   ├── Nouns           88%
│   ├── Verbs           61%   ← Needs attention
│   └── Sentences       79%
└── Writing             84%
```

The percentages are internal estimates, not claims of precise measurement.

The system should maintain confidence levels and evidence behind mastery estimates.

---

# 16. Adaptive Learning Engine

The AI decides what happens next based on evidence.

If the student understands:

> Increase difficulty / move forward.

If the student struggles:

> Explain differently → practice → retest.

If the student repeatedly makes the same mistake:

> Flag the underlying concept for targeted revision.

If a previously mastered concept deteriorates:

> Bring it back into a future review.

---

# 17. Daily Review

At the end of the day:

- What was completed?
- What was not completed?
- What was difficult?
- What was mastered?
- What needs tomorrow's attention?

The system should avoid creating unnecessary guilt.

Instead of:

> “You failed to finish your work.”

Use:

> “Two missions remain. Let's decide what to do now.”

---

# 18. Weekly Review

Once per week, the system analyzes:

- Lessons covered
- Homework completion
- Quiz performance
- Repeated errors
- Weak concepts
- Strong concepts
- Saved content
- Revision history
- Time spent
- Learning format effectiveness

Then creates a short weekly review.

---

# 19. Spaced Revision

The system should schedule future reviews.

A concept learned today may appear again:

- Later today
- Tomorrow
- Several days later
- The following week
- Before the exam

The exact schedule should be adaptive rather than rigid.

---

# 20. Exam Preparation Engine

The student/parent can enter exam dates.

The application creates a preparation timeline.

Example:

### 30+ days before exam
Learning + normal practice

### 14 days before
Revision + weak areas

### 7 days before
Mock tests + targeted practice

### Final days
High-priority revision + exam simulations

The system should use the student's actual mastery map to prioritize topics.

---

# 21. Exam Simulation

The application can generate:

- Timed tests
- Subject-specific tests
- Mixed tests
- Topic tests
- Mock exams

After completion:

- Score
- Mistake analysis
- Weak concepts
- Recommended revision
- Suggested next mission

---

# 22. Parent Experience

The parent should not need to supervise every minute.

A parent dashboard can show:

- Overall progress
- Homework completion
- Upcoming exams
- Subjects requiring attention
- Recent achievements
- Repeated difficulties
- Recommended parent action

The parent view should be concise.

Example:

> **Today**
>
> Arabic homework — Complete  
> Math practice — Complete  
> Science — Needs review  
> Exam — 12 days

The system should avoid turning parents into constant monitors.

---

# 23. Teacher / School Extension — Future

A future version may allow teachers to:

- Assign homework
- Upload lessons
- Set quizzes
- Announce exams
- Review student work
- Provide feedback

But this should not be required for the first MVP.

The initial product must work independently for a student.

---

# 24. Notifications

Notifications should be useful rather than addictive.

Examples:

> “You have a 10-minute Arabic mission ready.”

> “Your math review is due today.”

> “Your science exam is in 7 days.”

Avoid unnecessary engagement notifications designed only to bring the student back into the app.

---

# 25. Gamification

Gamification should reinforce learning rather than replace it.

Possible mechanisms:

- XP
- Levels
- Streaks
- Missions
- Badges
- Progress bars
- Unlockable content
- Personal milestones

Avoid excessive competition.

The student's main competition should be with their previous performance.

---

# 26. Main Interface

The initial navigation could be:

### Home
Today's personalized school plan.

### Learn
Learning feed and curriculum content.
### Missions
Homework, practice, and daily tasks.

### Review
Spaced review and saved material.

### Progress
Mastery, strengths, weaknesses, and academic progress.

### Companion
Direct conversation with the AI.

### Profile
Student settings, timetable, curriculum, preferences, and parent controls.

---

# 27. Home Screen Concept

The home screen should immediately answer:

> **What should I do now?**

Example:

```text
Good afternoon, Amina.

TODAY

School
✓ Arabic
✓ Math
✓ Science

YOUR MISSIONS

▶ Arabic — Today's Lesson
10 min

▶ Arabic — Homework
15 min

▶ Math — Quick Challenge
8 min

▶ Science — Review
10 min

[ Talk to My Companion ]
```

The interface should remain visually simple.

---

# 28. Companion Personality

The AI should feel:

- Helpful
- Patient
- Encouraging
- Clear
- Non-judgmental
- Age-appropriate
- Adaptive

It should not pretend to be a human teacher.

It should identify itself as an AI learning companion.

---

# 29. Safety and Student Protection

Because the product may be used by children, safety must be part of the architecture.

Requirements should include:

- Parent/guardian controls where required
- Age-appropriate experiences
- Controlled communication
- No open public messaging in MVP
- Safe content filtering
- Privacy protection
- Minimal collection of personal data
- Clear separation of student and parent accounts
- No manipulative engagement mechanics
- No public exposure of student academic performance by default

---

# 30. AI Content Generation Rules

AI-generated educational content should be traceable.

Every generated learning activity should have:

- Subject
- Grade
- Curriculum reference
- Lesson/concept
- Difficulty
- Activity type
- Generation source
- Validation status

The system should distinguish between:

**Source content**

and

**AI interpretation/explanation.**

The AI should not silently invent curriculum facts.

---

# 31. Content Pipeline

A future content pipeline can be:

```text
Curriculum Source
      ↓
Curriculum Parser
      ↓
Lesson Structure
      ↓
Concept Extraction
      ↓
Learning Objectives
      ↓
AI Content Generator
      ↓
Reel / Story / Game / Quiz / Practice
      ↓
Validation
      ↓
Student
      ↓
Performance Data
      ↓
Adaptive Learning Engine
```

---

# 32. Core Data Model

The application will eventually need entities approximately like:

```text
Student
Parent
School
Curriculum
AcademicYear
Term
Subject
Unit
Lesson
Concept
Skill
Timetable
Assignment
Exam
LearningActivity
Quiz
Game
Reel
SavedItem
Collection
Note
StudentResponse
HomeworkSubmission
HandwritingSample
MasteryRecord
ReviewSchedule
DailyMission
WeeklyReview
ProgressRecord
AIConversation
Notification
```

---

# 33. MVP Scope

Do NOT attempt to build the entire platform immediately.

The first working MVP should prove the central loop:

```text
Student Setup
      ↓
Timetable
      ↓
Today's School Lessons
      ↓
Student tells Companion what happened
      ↓
AI builds Today's Missions
      ↓
Learn through interactive content
      ↓
Complete digital + handwritten homework
      ↓
AI checks work
      ↓
Update mastery
      ↓
Daily review
```

A fifth-grade student can be the first real-world test user, but the architecture must remain reusable.

---

# 34. MVP Interface Priority

Build these first:

1. Onboarding
2. Student profile
3. Curriculum/grade selection
4. Timetable
5. Home / Today's Missions
6. AI Companion chat/voice
7. Lesson page
8. Short learning content
9. Quiz
10. Simple game
11. Homework
12. Camera homework checking
13. Save / Like / Collections
14. Progress
15. Parent overview

---

# 35. Future Expansion

After the core loop works:

- More grades
- More curricula
- Teacher accounts
- School accounts
- Classrooms
- Private study groups
- Advanced handwriting analysis
- More game types
- Advanced voice interaction
- Richer AI tutor
- Automated curriculum ingestion
- Exam paper analysis
- Parent recommendations
- Teacher analytics
- Multi-student family accounts
- Cross-device synchronization

---

# 36. Product Success Criteria

The first prototype should answer five questions:

1. Does the student actually want to open the app after school?
2. Can the AI correctly understand what happened at school?
3. Can it create a useful daily learning plan?
4. Can the student complete real schoolwork through the experience?
5. Does the system improve understanding and retention without making the student feel like they spent the entire day studying?

If these five questions are not solved, additional features should not be prioritized.

---

# 37. Build Instruction for an AI Development Environment

This document is the **product specification**, not a request to generate the entire application in one step.

When giving this specification to Google AI Studio or another AI development environment, the AI should:

1. Analyze the product architecture.
2. Identify missing technical requirements.
3. Propose the smallest functional MVP.
4. Build the application incrementally.
5. Keep the architecture extensible to multiple grades and curricula.
6. Never invent unavailable curriculum data.
7. Clearly separate mock/demo data from real educational sources.
8. Preserve student data and learning state.
9. Make the UI mobile-first.
10. Test each major feature before moving to the next phase.

The implementation should be performed in phases rather than attempting to build the complete platform in one generation.

---

# 38. Product One-Liner

> **AI School Companion is a personal AI-powered school assistant that turns a student's real school day into a personalized learning, homework, revision, and exam-preparation journey.**

---

# 39. Core Vision

The ultimate product should feel like:

> **“My school life has a personal AI companion that knows what I studied, what I need to do, what I don't understand, and what I should do next.”**

Not:

> “Another homework app.”

Not:

> “Another educational video platform.”

Not:

> “TikTok for students.”

It is a **personal operating system for a student's academic life**, with short-form media, games, AI tutoring, homework, revision, and progress tracking as the tools inside it.