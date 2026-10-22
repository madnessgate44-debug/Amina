---
name: amina-design-lab
description: Orchestrates Amina's evidence-led brand, UX, visual QA, and synthetic-learner mission. Use before changing UI, branding, design tokens, or navigation.
---

# Amina Design Lab — Operating Skill

## Goal
Deliver a visibly stronger and more coherent Amina experience based on actual learner tasks and rendered evidence—not a palette-only document or generic design opinions.

## Hard requirements
- Preserve HOME / FEED / LIBRARY / NOUR unless reproducible evidence justifies a change.
- Preserve learning behavior, student identity/data integrity, and connected context between screens.
- Marketing, ads, SEO, and growth operations are out of scope.
- Never invent user research or claim synthetic participants are real students.
- Do not change production UI during the audit phase.
- No paid provider/desktop runs without explicit authorization.
- Every material finding must trace to screenshot/action trace and source file(s), or be marked unverified.

## Workflow
### Phase A — Baseline and evidence
1. Read `docs/AMINA_PROJECT_MEMORY_AND_FORGE_ORDERS.md`.
2. Inspect actual screen components, routes, styles/tokens, content, data flow, and tests. Record commit SHA and exact paths.
3. Establish a requirement-to-evidence matrix for HOME, FEED, LIBRARY, NOUR, cross-screen handoff, mobile, and localization.
4. Run existing lint/build/tests when a real runner is available; report exact commands and results. Do not infer pass from configuration.

### Phase B — Observe the product as a learner
1. Run `node scripts/design-lab-browser-audit.mjs` from a built app with Playwright installed, or inspect the `amina-design-lab-browser-evidence` artifact from PR CI. The harness uses synthetic QA profile data, a 390×844 phone viewport, a desktop viewport, and Arabic RTL capture.
2. Complete the seven tasks in `.github/agents/amina-learner-simulator.agent.md`.
3. Capture initial screen, onboarding transitions, HOME / FEED / LIBRARY / NOUR, feed scroll, and Arabic RTL. Inspect the uploaded `report.json` and screenshots. The scripted run is browser evidence, not a model-driven synthetic participant; continue with the learner task matrix for deeper tasks.
4. Use the upstream UI Check skill in `.github/skills/ui-check/SKILL.md` for screenshot inventory, state coverage, and evidence-backed visual findings.
5. Use Humanish only if the configured local/hosted runtime and credentials are available. Its no-key preview is a format preview, not a product test. Do not incur hosted desktop or model spend without explicit authorization.

### Phase C — Research and diagnosis
1. Researcher separates facts, observed behavior, hypotheses, and unknowns.
2. Critic independently reviews rendered evidence and traces symptoms to root causes.
3. Steward inventories tokens/components and identifies duplicate or competing patterns.
4. Merge findings only when evidence supports the same root cause; keep contradictory evidence visible.

### Phase D — Visual direction
Create at least three materially distinct concepts for the screens that matter most. Concepts must use Amina's real content, existing navigation, and current character/assets where appropriate. Compare actual screen compositions, not just palette names. For each concept, show hierarchy, typography, density, cards, states, and motion behavior. Do not copy other brands' assets or signature expression.

### Phase E — Recommendation and implementation gate
Deliver a ranked issue register with:
- ID / severity / confidence
- task and screen/state
- evidence link(s) and source path(s)
- current behavior and user impact
- root cause
- proposed visual/interaction change
- acceptance criteria and regression checks
- whether real learner/parent validation is needed

Recommend one coherent direction, explain why alternatives lost, and identify the smallest implementation batch. Stop before production edits until the owner reviews concrete visual comparisons.

### Quality gate
No issue is closed by prose alone. A fix is accepted only after the same task is replayed, rendered evidence is captured again, the original problem is absent, and relevant tests pass. Record unavailable evidence and unresolved questions explicitly.
