---
name: miss-noor-visual-redesign
description: "End-to-end product design, UX architecture, visual composition, design systems, frontend implementation, and visual QA for the Miss Noor Grade 5 learning app."
---

# Miss Noor — Product Visual Redesign Skill

## Mission
Redesign the whole Miss Noor learner experience as a coherent, distinctive, child-facing learning product. The audience is a 10-year-old learner using a phone first. The app must feel like a real teacher-guided learning studio, not a generic dashboard, a template SaaS app, or a TikTok clone.

## Non-negotiable product constraints
- Product/teacher name: Miss Noor. Amina remains the legacy repository name only.
- Grade 5 is the current supported grade. Never drift to Grade 3.
- Default UI language is Arabic with correct RTL. French and English are first-class, not afterthoughts.
- Preserve curriculum records, learning logic, student evidence, mastery tracking, homework semantics, and working flows unless the owner explicitly authorizes a functional change.
- Do not fabricate Ministry content, school-specific books, progress, homework, or teacher actions.
- Keep the app phone-first and accessible; design desktop as a deliberate extension.
- Avoid paid services, new accounts, or paid image-generation dependencies.
- No generic gradient-blob hero, arbitrary card grids, excessive glassmorphism, decorative dashboards, tiny labels, or repeated card-on-card composition.

## Required scope
Inspect and redesign the whole learner-facing experience, not just Home:
1. Home / daily entry point
2. Feed / lesson discovery and learning reels
3. Homework / assignments and HomeworkRunner
4. Miss Noor classroom / teaching session
5. Library / curriculum browser
6. Missions / revision / practice
7. Onboarding and language selection
8. Navigation, headers, menus, dialogs, sheets, empty/loading/error/success states
9. Timetable, school-day recap, review nudges, and progress surfaces wherever visible

## Design principles
- Start from the learner's task and content, not app chrome.
- Create a single art direction and design system; do not style each screen independently.
- Establish clear hierarchy with layout, typography, spacing, and content before decoration.
- Prefer editorial composition, expressive but disciplined typography, purposeful illustration, real educational diagrams, and clear visual storytelling.
- Every illustration or visual should teach, orient, reassure, or express the Miss Noor brand. Remove decoration that does none of these.
- Use reusable semantic color, typography, spacing, radius, elevation, and motion tokens.
- Use large readable type and generous touch targets. Preserve WCAG AA contrast and visible focus states.
- Respect Arabic shaping and RTL composition; test Arabic, French, and English with long text and mixed numerals.
- Design actual content states: empty, loading, error, disabled, selected, success, and long-content.
- Feed should be an educational discovery experience, not a dark full-screen clone of a social-video app.
- Homework should feel like a beautiful, calm digital workbook with space to think and write, not a stack of utility panels.
- Home should establish teacher presence and one clear next action without becoming a metrics dashboard.

## Mandatory workflow
### Phase 1 — Evidence-based audit
1. Read root AGENTS.md and ENGINEERING_EXECUTION_OS.md, then relevant authority/current-state docs.
2. Inspect current routes, components, tokens, typography, illustrations, media catalog, localization, tests, and historical UI audit artifacts.
3. Run the existing UI audit and capture real screenshots at minimum 390x844 and 1365x900. Include Arabic RTL, French, and English where the harness supports them.
4. Produce a screen inventory and evidence-based critique. Distinguish source observations from screenshots and browser-verified behavior.
5. Identify root causes shared across screens; do not start with isolated CSS tweaks.

### Phase 2 — Art direction and design system
1. Define one clear visual concept for Miss Noor with rationale grounded in the learner and learning context.
2. Define design tokens and rules: palette, semantic colors, Arabic/Latin typography, type scale, spacing, surfaces, illustration style, iconography, motion, and responsive breakpoints.
3. Define screen-specific composition and interaction rules. Screens may have different layouts while sharing the same visual language.
4. Show a cohesive direction in code and screenshot evidence. Do not ask the owner to choose among vague options; recommend a direction and explain why.

### Phase 3 — Implementation
1. Implement shared tokens and reusable components first.
2. Redesign screens in coherent slices while preserving app state and business logic.
3. Use existing assets and media pipeline where possible; add original SVG/CSS educational visuals only when they improve learning. Do not ship fake media or placeholders.
4. Maintain localization keys and proper RTL; do not hardcode one-language UI.
5. Keep dependencies and scope minimal. No stack migration.

### Phase 4 — Visual QA and acceptance
1. Run typecheck, tests, build, and existing phone UI checks.
2. Use browser screenshots and inspect the actual rendered result; source inspection alone is not visual verification.
3. Verify at 390x844 phone and 1365x900 desktop, Arabic RTL, French, and English.
4. Verify tap targets >=44px, no horizontal overflow, readable body type, contrast, focus, and reduced-motion behavior.
5. Test important flows with real pointer clicks and assert side effects; do not rely only on forced clicks.
6. Compare screenshots against the stated art direction. Fix visual regressions before handoff.
7. Report exact tested routes, viewport, locale, screenshots/artifacts, commands, and results. Never claim visual QA without screenshot inspection.

## Acceptance criteria
- All learner-facing screens share one recognizable Miss Noor identity.
- No screen looks like an unrelated template or generic dashboard.
- Home, Feed, Homework, Classroom, and Library have distinct, task-appropriate compositions.
- The teacher presence is consistent and intentional, not a mascot sticker.
- Educational visuals are specific to lesson content and support comprehension.
- Arabic RTL, French, and English layouts are complete and visually coherent.
- Existing curriculum and learning behavior remain intact.
- Accessibility and responsive gates pass.
- Actual browser screenshots are reviewed and included as evidence.
- No placeholder art, TODOs, fake data, or unsupported completion claims.

## Required handoff
Provide:
- Before/after screenshot matrix by screen, viewport, and locale.
- Design-system tokens and component inventory.
- Changed files and preserved behaviors.
- Test/build/browser evidence with [VERIFIED], [HYPOTHESIS], [UNPROVEN], [BLOCKED], or [FAILED].
- Remaining gaps, not hidden.

## Existing project skills to load
- `.agents/agents/ux-designer.md`
- `.agents/agents/frontend-engineer.md`
- `.agents/agents/browser-qa-runner.md`
- `.agents/skills/miss-noor-design/SKILL.md`
- `.agents/skills/amina-brand-and-i18n/SKILL.md`
- `.agents/skills/accessibility-audit/SKILL.md`
- `.agents/skills/playwright-evidence-qa/SKILL.md`
- `.agents/skills/testing-strategy/SKILL.md`

## External skill sources curated for this task
Use their relevant principles, adapted to this React + Vite + Tailwind v4 repository. Do not blindly import framework assumptions or dependencies:
- hueyexe/frontend-agent-skills — UI Visual Composition; Design Systems & Frontend Architecture; UX Research & Discovery Testing; UX Usability Foundations; Information Architecture & Navigation; Interaction Patterns & Components; UX Writing & Content Design; Accessibility & Inclusive Design. MIT: https://github.com/hueyexe/frontend-agent-skills
- PyModel/react-frontend-skills — ui-design, tailwind, web-design-guidelines, playwright, react, vercel-react-best-practices. https://github.com/PyModel/react-frontend-skills
- first-fluke/oh-my-agent — oma-design, oma-frontend, oma-qa. Selectively adapt design review and execution discipline; do not import its Next.js/shadcn defaults into this Vite app. https://github.com/first-fluke/oh-my-agent
- Vercel Web Interface Guidelines: https://github.com/vercel-labs/web-interface-guidelines
- Emil Design Engineering: https://github.com/emilkowalski/skills
- Taste Skill: https://github.com/leonxlnx/taste-skill

Do not claim an external package has been installed unless its files are actually present in this repository. This document is the curated operational skill for this project.
