# Miss Noor Balanced Feed — Product Specification
Date: 2026-10-22
Status: APPROVED FOR PRODUCT/DESIGN PLANNING; NOT APPROVED FOR IMPLEMENTATION
Owner decision: Balanced Feed (Learn + Explore), with the learner choosing the mode.
Scope restriction: No application code changes, builds, merges, or deployments until the owner explicitly approves implementation.

## 1. Product intent
Miss Noor should be a trusted, engaging place for Amina to learn school subjects and to explore the wider world for enjoyment. Explore is a first-class destination, not a reward for studying and not a disguised homework area. The product may borrow strong discovery and personalization patterns from social platforms, but must not optimize for compulsive scrolling or raw screen time.

## 2. Primary experience
The Feed has two clear modes:
- **Learn** — curriculum-aligned subjects, explanations, adaptive practice, revision, exam preparation, and recommendations informed by demonstrated learning needs.
- **Explore** — out-of-curriculum knowledge, hobbies, culture, creativity, entertainment, puzzles, stories, experiments, nature, technology, sport, art, music, and new discoveries.

Amina can switch modes whenever she wants. Do not shame, penalize, or label Explore as avoidance. Feed cards may have varied formats, but every card must communicate what it is and offer an appropriate action; not every Explore card needs a quiz.

## 3. Interest onboarding
Create a short, visual, skippable interest survey. Initial topic examples:
- Space and astronomy
- Animals and wildlife
- Science and experiments
- Robotics and AI
- Mysteries and puzzles
- Art and design
- Music and dance
- Sports
- Countries and cultures
- History and ancient worlds
- Food and cooking
- Nature and environment
- Stories and fantasy
- Inventions and how things work
- Games and strategy
- Psychology and human behavior
Allow custom interests. The list is a starting catalogue, not a fixed limit. Let the learner edit preferences later and opt out of personalization where feasible.

Optional preference signals can include preferred formats (short video, illustrated explanation, story, quiz, hands-on challenge), tone, difficulty, and appetite for familiar topics versus surprises. Avoid asking for unnecessary personal or sensitive data.

## 4. Explore recommendation policy
Use a transparent, rules-based ranking baseline first; do not introduce ML infrastructure until sufficient high-quality feedback data exists.
Candidate signals, in order of importance:
1. Explicit topic preferences and “more/less like this” controls.
2. Content quality, age suitability, source reliability, and safety eligibility (hard gates, not merely ranking bonuses).
3. Current interest fit and recency/variety within the chosen topics.
4. Explicit saves, ratings, revisits, and voluntary deeper exploration.
5. Controlled discovery of new topics to avoid a narrow interest bubble.
6. Format preferences and difficulty/complexity fit.
7. Skips as a weak, ambiguous signal; never assume a single skip means dislike.
Watch time/completion may be supporting signals only. Never optimize for time spent as the primary objective. Do not infer learning mastery from passive viewing.

## 5. Learn recommendation policy
Prioritize curriculum relevance, upcoming school needs, demonstrated misconceptions, repeated errors, need for revision, and delayed recall. Use successful independent answers and explanations as evidence of mastery. Do not equate swiping past a card with learning or failure.

## 6. Feed controls and explanations
Provide learner-facing controls where appropriate:
- More like this
- Less like this
- Not interested
- Show me something new
- Too easy / too difficult (for learning/practice content)
- Save for later
- Why am I seeing this?
Explanations should be honest and based on actual signals, e.g. “You chose space as an interest” or “This concept is due for revision.” Never fabricate a reason or imply that an unmeasured learning inference is certain.

## 7. Content supply and provenance
Use a controlled mix:
- Curated, trustworthy educational/science/culture sources.
- Approved external media with attribution and source links where appropriate.
- Original Miss Noor explainers, stories, challenges, and quizzes.
- Fresh discoveries only after suitable source, age, and safety checks.
AI-generated factual material requires quality/factuality checks and should distinguish fact, uncertainty, opinion, and fiction. Do not expose an unrestricted public-content firehose. Recommendations are only as reliable as the eligible content catalogue.

## 8. Safety, privacy, and wellbeing
- Apply age-appropriate safety and content-quality filters before content enters the eligible pool.
- Exclude sexual, exploitative, hateful, dangerous, manipulative, and otherwise age-inappropriate content.
- Minimize collection of personal data; do not target ads or use sensitive profiling.
- Provide reporting/feedback paths appropriate to the product.
- Avoid infinite-scroll pressure, fake urgency, streak guilt, and engagement rewards that encourage compulsive use.
- Support natural stopping points and meaningful session completion.
- Respect the learner’s explicit choices over inferred engagement patterns.

## 9. Content formats
Use a varied set of reusable formats, not separate navigation tabs for every format:
- Discover: a surprising fact or phenomenon.
- Watch/Read: short, sourced explainers and stories.
- Solve: a puzzle or optional challenge.
- Try: a safe, age-appropriate experiment or creative activity.
- Understand: a deeper explanation.
- Remember: curriculum-linked revision (Learn mode).
- Explore further: trusted sources or a related topic.
An Explore item need not turn into a test. Keep entertainment and curiosity intrinsically valuable.

## 10. Success measures
Primary outcome: meaningful learner value per useful session, not minutes in app.
Track/assess:
- Learner-reported enjoyment and usefulness.
- Topic relevance and preference-control effectiveness.
- Content diversity and novelty.
- Quality, safety, and factuality defects.
- Voluntary saves, revisits, and deeper exploration.
- For Learn only: misconception resolution, curriculum progress, and delayed recall where measurable.
- Wellbeing signals such as repeated frustration, excessive repetition, and poor stopping experiences.
Do not claim educational impact from engagement metrics alone.

## 11. Acceptance criteria
A design/prototype is acceptable only when:
1. Learn and Explore are both discoverable and visibly distinct.
2. The learner can switch modes without penalty.
3. Interest onboarding is visual, skippable, editable, and supports custom interests.
4. Explore includes genuinely out-of-curriculum hobbies, culture, creativity, and entertainment.
5. The feed mixes preferred topics with controlled novelty and reasonable variety.
6. Recommendation explanations and preference controls are available and honest.
7. Safety, age suitability, source provenance, and factuality are treated as eligibility gates.
8. Passive viewing is not treated as proof of mastery.
9. The experience does not depend on endless scrolling or maximize screen time.
10. Phone-first layouts are readable, accessible, and usable.
11. Empty/offline/low-content states are designed honestly; no fabricated media or fake sources.
12. No existing HOME, LIBRARY, or NOUR behavior is removed or changed as part of Feed planning without explicit approval.

## 12. Implementation gate and next workflow
This document authorizes product/design specification only. Before implementation:
1. Inspect the current Amina repository and existing design/Figma artifacts.
2. Map each requirement to current implementation, evidence, gap, and exact file/component.
3. Prepare a visual Feed design and interest-survey flow, clearly labelled as concept until rendered from the real app.
4. Present scope, risks, content sourcing plan, and acceptance-test plan.
5. Wait for explicit owner approval to implement.
6. After approval, implement narrowly, test, capture real current-head screenshots, and report evidence. Do not merge or deploy without explicit approval.

## 13. OpenHands handoff
OpenHands may read this document and perform read-only inspection of the existing Feed and design assets. For now, it must not edit application code, change builds, merge, deploy, or silently expand scope. It may return a requirements-to-evidence matrix, design recommendations, unresolved questions, and a proposed implementation plan for owner review.
