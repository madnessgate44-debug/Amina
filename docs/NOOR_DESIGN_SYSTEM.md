# Miss Noor Design System — Anime Companion

**Status:** Approved direction; specification ready for implementation  
**Owner decision:** Option 3 — Anime Companion (confirmed 18 November 2026)  
**Product:** Miss Noor (legacy repository name: Amina)  
**Audience:** Grade 5 learner, phone-first Android; Arabic default, French and English supported  
**Source brief:** `miss-noor-product-brief.md`, Parts A–C  
**Implementation stack:** Existing React 19 + Vite 8 + Tailwind CSS v4 + Motion 12. No framework migration or new paid service.

## 1. Product and art direction

### 1.1 The chosen direction

Create an original, premium anime-inspired adult teacher character. The visual language may borrow broad qualities from expressive anime illustration and warm animated-film storytelling, but Noor must be an original character: do not reproduce a named franchise character, costume, face, logo, or signature composition.

Noor is a credible adult teacher and friendly companion, not a child, robot, mascot sticker, or romantic character. Her appearance is modest, age-appropriate, culturally respectful, and consistent across every state and language.

**Character brief**
- Adult Egyptian woman teacher; warm, expressive brown eyes; dark, naturally textured hair; modest contemporary clothing.
- Distinctive silhouette and one restrained signature detail (for example, a small moon/star hair pin or brooch).
- Softly expressive facial anatomy: eyebrows, eyelids, mouth shapes and head angle must communicate the five emotional states without relying on color alone.
- Waist-up or three-quarter framing for the main phone composition; face remains legible at narrow widths.
- Background belongs to Noor's quiet night-sky study world, not a generic school dashboard.
- The child remains the learner; Noor never completes homework on the child's behalf.

### 1.2 Visual principles

1. **Character first:** Noor is the primary interface and occupies the largest visual region.
2. **Conversation is the product:** explanations, questions, practice, assessment and feedback appear in one continuous conversation.
3. **Atmospheric, not gloomy:** dark indigo surroundings with warm face lighting and selective rose/lavender accents.
4. **Illustration with purpose:** every visual expresses Noor, clarifies learning, gives feedback or orients the child.
5. **Quiet hierarchy:** no card grid, KPI dashboard, decorative progress bar or school-menu home screen.
6. **Readable before beautiful:** body text, controls and answer feedback take priority over ornamental effects.
7. **Consistent identity:** the same character proportions, costume, lighting and line treatment persist across expressions.

## 2. Color system

The approved direction is a dark indigo / lavender / rose / moonlight palette. Values below are the initial design tokens; implementation must run contrast checks on actual foreground/background pairings before visual acceptance.

| Token | Hex | Usage |
|---|---|---|
| `noor-night` | `#20264A` | Main night-sky canvas |
| `noor-deep` | `#171B35` | Deepest background / input well |
| `noor-indigo` | `#343B70` | Elevated surfaces and structural accents |
| `noor-lavender` | `#A99AD6` | Brand accent, focus decoration, secondary highlights |
| `noor-rose` | `#F1A6A6` | Warm emphasis and gentle emotional accents |
| `noor-moonlight` | `#F5EEDB` | Primary text and light illustration details |
| `noor-muted` | `#C2BED2` | Secondary text (validate contrast per surface) |
| `noor-success` | `#8FD4B5` | Correct-answer feedback |
| `noor-warning` | `#F3C77B` | Gentle correction / attention |
| `noor-error` | `#F09A9A` | Errors only; never shame or punish the learner |

### Semantic rules
- Use moonlight for primary text on night/deep surfaces.
- Do not use lavender or rose as small body text on dark backgrounds until contrast is measured; use them for larger accents, borders, illustration and non-text decoration.
- Correctness must be communicated with words/icons and explanation, not green alone.
- A wrong answer uses encouraging language and a calm warning treatment; never red alarm styling.
- Never communicate Noor's emotional state by color alone; facial expression and accessible text label are required.
- Dark mode is the default. A future light theme is out of scope unless requested.

## 3. Typography and multilingual composition

### Font strategy
- Arabic: retain the existing Tajawal-first stack, with Cairo as a fallback; verify actual font loading and Arabic shaping before acceptance.
- French and English: use the existing Inter/system fallback in the same family stack. Do not introduce a font dependency until current font assets and network behavior are inspected.
- Arabic body text: minimum 16 CSS px; recommended 17–18 px on the main conversation.
- French/English body text: minimum 16 CSS px.
- Conversation line-height: 1.65–1.8 for Arabic; 1.45–1.6 for Latin scripts.
- Use weight and spacing, not tiny uppercase labels, to establish hierarchy.

### Direction and mixed-script rules
- Set document direction from the active conversation language; Arabic is RTL, French/English LTR.
- Use logical CSS properties (`margin-inline`, `padding-inline`, `inset-inline`, `text-align: start`) rather than left/right assumptions.
- Keep numbers, equations, units, code, and Latin terms isolated with appropriate bidi handling (`dir="ltr"` or `unicode-bidi: isolate`) where needed.
- Message alignment follows speaker and locale; do not reverse icon meaning or physical media controls.
- Verify long Arabic, French accents, mixed Arabic/Latin words, numerals, punctuation, and multiline input.

## 4. Layout and responsive rules

### Main screen: one conversational space

The learner-facing main view has exactly three persistent zones:

1. **Noor's Space — upper ~60%:** character illustration and current emotional/interaction state. It can contract on short screens but must remain the visual anchor.
2. **Conversation Feed — lower ~30%:** scrollable chronological messages, one question at a time, learner replies, explanations and learning activities.
3. **Composer — bottom safe-area region:** text input, prominent microphone control and send action.

Percentages are composition targets, not fixed heights. Use viewport-aware layout and safe-area insets; the composer must never cover the latest message or keyboard focus.

### Secondary backpack drawer

A swipe-left gesture and an accessible labelled control expose a minimal backpack drawer containing only:
- My Books (available PDFs and books)
- My Streak (days and milestone celebrations)
- What We Covered (a topic timeline, not a grade report)

The drawer is secondary. No hamburger menu, tab bar, subject tile grid or dashboard returns to the primary screen. Provide an accessible non-gesture route to open and close it.

### Responsive breakpoints
- Phone baseline: 390 × 844; support down to 360 CSS px without horizontal overflow.
- Tablet / compact landscape: adapt character scale and conversation height; preserve the same hierarchy.
- Desktop baseline: 1365 × 900; constrain conversation reading width and avoid stretching message lines across the entire viewport.
- Respect Android keyboard, display cutouts and safe-area insets.

## 5. Component and interaction language

Build semantic, reusable components in the existing React architecture; do not introduce a new component library solely for this redesign.

| Component | Contract |
|---|---|
| `NoorStage` | Character canvas, emotional state, idle and thinking state; accessible state description |
| `NoorCharacter` | Original layered illustration; stable proportions and state-driven expression |
| `ConversationFeed` | Chronological messages; preserves session continuity and scroll position |
| `NoorMessage` | Teacher message, optional learning visual, direction-aware typography |
| `LearnerMessage` | Learner response; distinguish speaker without oversized chat bubbles |
| `ConversationComposer` | RTL-safe text input, microphone and send; keyboard-safe |
| `VoiceControl` | Permission, listening, transcript, error and unavailable states |
| `BackpackDrawer` | My Books, My Streak and What We Covered only |
| `SessionMilestone` | Inline celebration in conversation; no separate completion screen |

Avoid arbitrary rounded-card stacks. Conversation messages may have subtle speaker treatments, but should read as a continuous dialogue rather than a messaging utility template.

### Touch and focus
- Interactive targets: minimum 44 × 44 CSS px; prefer 48 × 48 for primary mic/send.
- Visible keyboard focus with sufficient contrast.
- Do not encode critical actions only as swipe or hover.
- Keep the primary composer reachable one-handed on Android.

## 6. Noor character states and animation architecture

### Required states

| State | Trigger | Expression / movement |
|---|---|---|
| Normal | Ready / conversational | Soft breathing, natural blink, attentive posture |
| Proud | Correct answer or demonstrated improvement | Bright eyes, broad smile, slight upward gesture |
| Curious | Asking / exploring | Head tilt, raised eyebrow, attentive gaze |
| Disappointed (gentle) | Careless or incomplete response | Mild concerned expression; no anger, shame or scolding |
| Encouraging | Learner stuck or struggling | Warm smile, slight lean-in, open hand gesture |
| Thinking | Model response pending | Eyes glance aside/up, subtle thought motion; no spinner |
| Celebrating | Streak / milestone | Distinctive short celebratory pose and spark accents |

### Recommended implementation

**Use a layered original SVG character with Motion (already present in package dependencies) for state transitions, plus CSS keyframes for low-cost idle details.** This avoids adding Lottie or sprite dependencies before the art asset and runtime needs are proven.

- Separate SVG groups/layers for face, brows, eyelids, mouth, hair, torso and gesture elements.
- Keep a stable viewBox and anchor points so expressions do not jump between states.
- Use Motion for controlled transitions between expression/pose variants; use CSS for breathing and blink loops.
- Thinking animation starts immediately when a request begins and resolves into the actual response state; never imply an answer is ready before it is.
- Celebration is short and non-blocking; never trap the child in an animation.
- Respect `prefers-reduced-motion`: stop idle loops, replace large movement with a still expression and short opacity transition.
- Do not ship placeholder art. The original character illustration must be reviewed before it becomes the production default.

### Art asset acceptance
- Original design, no recognizable franchise likeness.
- Face legible at 180 px character width.
- All seven states are visually distinct and readable without relying on color.
- No clipping at phone viewport or drawer/keyboard transitions.
- SVG remains performant and accessible; decorative sublayers are hidden from assistive technology while the character container exposes the current state in text.

## 7. Sound design

Sound is optional feedback, never required to understand correctness.
- Subtle original chime for correct answers and milestones.
- Gentle non-verbal "hmm" cue for a misconception only if an original licensed asset exists and the child has sound enabled.
- Default sound state must respect device/browser policies; no autoplay before a user gesture.
- Provide mute control in the backpack/settings surface and respect device volume.
- No copyrighted character voice or imitation of a real person.
- Sound cues must have visual/text equivalents.

## 8. Conversation and learning behavior contracts

- Noor opens the session with a specific, context-aware line when valid prior-session context exists; otherwise she introduces herself or asks a relevant starter question.
- Ask one question per turn. Avoid question walls and multiple-choice walls.
- React to the learner's actual response before advancing.
- Wrong answers receive acknowledgement, a hint or diagnostic follow-up, then scaffolding; do not reveal the answer immediately.
- Correct answers receive celebration, explanation and a follow-up that probes understanding.
- Maximum three sentences per Noor turn, except a learner-requested longer explanation.
- Arabic is the default. Science/Math use the language of the selected curriculum track; French subject is French-first. The learner can override language at any time.
- Do not fabricate remembered facts. Memory references must be grounded in stored session data.
- Curriculum content remains source-backed; character warmth must never weaken academic accuracy.
- Session close is conversational and names what was actually covered; no generic "lesson complete" screen.

## 9. Privacy, child safety and retention boundaries

- Child-facing memory must be scoped to the correct learner and protected by the app's existing parent/privacy model.
- Store only the minimum session facts needed for teaching continuity; do not put private learner transcripts or personal data in public repository docs.
- Do not invent streak activity, progress, parent baselines or notifications.
- No guilt, anxiety, streak-loss punishment, manipulative scarcity, or pressure to return.
- "Life between sessions" notifications require explicit parent-controlled notification settings and must be neutral, non-urgent and child-safe. No outbound notification behavior is authorized by this design document.
- Character ownership/customization is cosmetic and optional; no monetization or manipulative engagement loop.

## 10. Accessibility and visual acceptance

- WCAG AA contrast for text and controls; validate computed colors, not palette intent.
- Minimum 16 px body type; Arabic body target 17–18 px.
- Touch targets >=44 px.
- Keyboard focus visible; screen-reader labels for mic/send/drawer and character state.
- Reduced motion fully supported.
- No horizontal overflow at 360, 390, tablet and desktop widths.
- Test Arabic RTL, French and English, including long and mixed-script content.
- Character is not the only source of instruction or feedback; all essential meaning is present in text.

## 11. Out of scope for this design-system change

- Generating or committing final character artwork before the art asset is reviewed.
- Replacing the teaching engine, curriculum registries, assessment logic, or persistence layer.
- Adding new paid services, API providers, accounts, fonts, audio subscriptions or animation packages.
- Building a notification campaign or external messaging system.
- Merging or deploying this redesign without CI, screenshot review and the required owner/release boundary.

## 12. Decision log

- **D1 — Art direction:** Anime Companion, Option 3; owner confirmed 18 November 2026.
- **D2 — Palette:** Deep indigo, lavender, rose and moonlight; selected from Option 3.
- **D3 — Character rendering:** Original layered SVG; no franchise likeness.
- **D4 — Animation:** Existing Motion package for expression transitions + CSS idle animation; no new animation dependency.
- **D5 — Primary IA:** One conversational screen with character / conversation / composer zones.
- **D6 — Secondary IA:** Backpack drawer limited to My Books, My Streak and What We Covered.
- **D7 — Locale:** Arabic default and RTL; French and English first-class.
- **D8 — Motion safety:** Reduced-motion support and no blocking animation.
