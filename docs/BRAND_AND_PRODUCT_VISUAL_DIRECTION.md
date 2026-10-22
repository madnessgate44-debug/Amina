# Amina — Brand and Product Visual Direction

Status: Proposed creative direction, not approval to change production UI.

## Creative direction
Amina should feel like a premium personal learning companion: polished and fluid, clear like a great learning tool, and emotionally approachable like a trusted mentor. Use purposeful motion, real lesson content, and Miss Nour to make the app feel alive—not noisy gamification or decoration.

## Brand promise
Help students know what to do next, understand lessons in a way that works for them, and see real progress without feeling overwhelmed.

## Positioning hypothesis
For students who need school to feel clearer and more manageable, Amina is the personal learning companion that brings lessons, practice, and the next step together—adapting to the learner instead of leaving them to figure it out alone.

## Proposed palette
- Midnight Ink: #17233B — primary text and premium anchor.
- Amina Indigo: #615BFF — primary actions and active navigation.
- Clear Teal: #26B8A8 — positive learning accents.
- Apricot Spark: #FFB86B — sparing highlights.
- Cloud: #F6F7FB — main light canvas.
- Paper White: #FFFFFF — reading and card surfaces.
- Mist: #E4E8F1 — borders and quiet containers.
- Slate Text: #586277 — secondary text.

Use indigo intentionally; avoid making every card a purple gradient. Validate contrast before implementation. Dark mode must be designed, not mechanically inverted.

## Typography
Use Tajawal as the primary Arabic UI font; use Cairo only where it improves heading legibility. For French and English, evaluate Inter or another highly legible sans-serif. Keep hierarchy consistent, support French accents and mixed scripts, and ensure Arabic RTL layouts are correct.

## Art direction
- Mobile-first, calm, editorially clean, tactile, and lightly animated.
- Rounded geometry, disciplined spacing, subtle borders, restrained shadows.
- One coherent illustration family; avoid mixing emoji-heavy cards, stock photography, 3D characters, and thin icons without a system.
- Use real curriculum diagrams, worked examples, and lesson-specific visuals before generic imagery.
- Respect an upper-primary learner: playful but not babyish.

## Miss Nour
The existing custom SVG character is an asset to evaluate before replacing. Refine the silhouette, facial expression system, proportions, and subject accessories into one coherent mentor-like character. Use motion to signal listening, explaining, thinking, encouragement, and celebration—not as constant decoration. Keep lesson content more prominent than the character when teaching.

## Screen direction
### HOME
A clear greeting, one dominant next action, a concise daily plan, upcoming work, evidence-based progress, and a small supportive Nour presence. Avoid many equally prominent cards.

### FEED
Immersive vertical learning items: real micro-lessons, worked examples, quick checks, and relevant reviews. Keep continue-with-Nour, answer/check, save, and next actions predictable. No filler or fake engagement metrics.

### LIBRARY
Discover real subjects, books, lessons, and saved items with clear cover art or subject tiles. Do not truncate available curriculum arbitrarily or imply missing content exists.

### NOUR
A clear teaching stage with current lesson context, one main prompt at a time, obvious voice/text input, concept-supporting visuals, legible interaction states, and a clear outcome/next step.

## Navigation
Preserve the established HOME / FEED / LIBRARY / NOUR primary navigation. Keep schedule, review, progress, profile, and settings secondary or contextual.

## Voice and microcopy
Be clear, encouraging, specific, calm, and respectful. Avoid internal terms like “AI diagnostic completed” and punitive labels like “Mission failed.” Prefer natural prompts such as “Let’s see what you already know” and “Not yet. Want a hint?” only where they match actual app state.

## Quality bar
1. The main action is clear within 3 seconds.
2. Every screen has a clear purpose and expected next step.
3. Cards, buttons, type, spacing, icons, and states are consistent.
4. Progress and availability claims reflect real data.
5. The design respects an upper-primary learner without feeling childish.
6. Tap targets, text, and system-safe areas work on phones.
7. Arabic RTL and French/English layouts are natural.
8. Contrast, focus, non-color state cues, and reduced motion are considered.
9. Visuals help the learner understand, practice, or act.
10. The product remains recognizably Amina without the logo.

## Reference qualities—not templates
Borrow character-led friendliness from Duolingo, calm simplified illustration from Headspace, and polished layered digital craft from Google Gemini. Do not copy their logos, characters, or signature assets.

## Boundaries and next stage
This is a design proposal, not permission to change app code or replace the logo. First compare mobile concepts for HOME, FEED, LIBRARY, and NOUR against the current implementation. Inspect the running product; source code alone cannot prove the rendered experience. Preserve working behavior, then translate approved decisions into design tokens and component tasks. Student and parent preferences have not yet been user-tested.
