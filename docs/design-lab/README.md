# Amina Design Lab

**Purpose:** a reusable, evidence-first design and learner-usability workflow for Amina. This is a tool integration, not a claim that the app has already been audited or redesigned.

## Why this combination

A single public GitHub repository did not cover all required roles. This kit combines three focused tools/workflows:

1. **Open Design Agent** — research, independent design critique, and design-system stewardship. The Amina agent files adapt these role contracts to this product rather than leaving upstream relative paths that would break when copied.
2. **UI Check** — rendered-screen inventory, real screenshot evidence, state coverage, and measurable visual findings. The upstream MIT-licensed skill is copied to `.github/skills/ui-check/SKILL.md`; its license is preserved separately.
3. **Humanish** — synthetic participants that can use a product through computer-use sessions and leave action traces/screenshots. This is the preferred participant runner only when its runtime is available. A no-key preview does not test Amina. Hosted desktop/API routes can cost money; no billable run is authorized by this setup.

A Playwright-based rendered-browser audit now runs in the PR CI workflow using a disposable test install (not an Amina runtime dependency). It boots the production build with synthetic QA data, captures HOME / FEED / LIBRARY / NOUR and onboarding at phone size, checks the wider layout, and records Arabic RTL evidence. Screenshots and a machine-readable report are uploaded as the `amina-design-lab-browser-evidence` artifact. This is deterministic browser QA, not a model-driven synthetic participant and not real-child research.

The application package dependencies and runtime scripts are unchanged.

## How the agents are used

- `.github/agents/amina-design-researcher.agent.md`: evidence and learner/parent research plan.
- `.github/agents/amina-learner-simulator.agent.md`: task-based synthetic student attempt, without source-code hints during the attempt.
- `.github/agents/amina-design-critic.agent.md`: independent rendered UI critique.
- `.github/agents/amina-design-system-steward.agent.md`: duplicate-pattern, token, component, and accessibility audit.
- `.github/skills/amina-design-lab/SKILL.md`: sequence and release gate.
- `.github/skills/ui-check/SKILL.md`: full evidence-first visual audit procedure.

The rendered-browser audit runs automatically on pull requests through `scripts/design-lab-browser-audit.mjs`; its CI artifact is the source of screenshots and viewport/text evidence. The repository-native agent roles still require a compatible coding agent to execute the research/critique synthesis. A browser run alone does not constitute a synthetic participant study.

## Humanish runtime decision

Humanish is MIT-licensed and its upstream documentation describes two live paths:
- Hosted desktop: needs E2B plus a model provider/account and may incur charges.
- Local browser: avoids E2B/API keys but has strict Linux/macOS virtualization/runtime requirements and uses a signed-in Codex account quota; it is not offline.

Because this repository is operated through GitHub and the owner works from a phone, do not assume either live runtime is available. First check the actual agent runner's Node version, browser/computer-use capability, and credentials without exposing secret values. If neither live route is available, use the available browser/computer-use tool or mark learner testing blocked. Never count Humanish's dry-run preview as app evidence.

## Execution status

- [x] Inspected Amina's current `package.json` and project handoff.
- [x] Selected and arranged role-specific design/research/critique/learner workflows.
- [x] Automated rendered browser walkthrough wired into PR CI; first execution pending.
- [ ] Review first screenshot artifact and finish screenshot-backed duplicate-pattern / visual diagnosis.
- [ ] Model-driven synthetic learner run against Amina (Humanish remains gated on supported runtime/provider availability).
- [ ] Concept comparison and owner review.
- [ ] Production implementation and regression verification.

The unchecked items are intentionally not claimed as completed.

## Upstream sources and attribution

- Open Design Agent: https://github.com/dragonoasis/open-design-agent — MIT License. The agent role structure has been adapted into Amina-specific files.
- UI Check: https://github.com/Octo-o-o-o/ui-check — MIT License. Its skill and license are included in this repository.
- Humanish: https://github.com/danielgwilson/humanish — MIT License. Referenced as an optional synthetic participant runtime; its package/runtime is not vendored or added as an Amina dependency.
- Design Loop (evaluated, not installed): https://github.com/rithvikx/design-loop. Its inspect→browse→evaluate→fix→verify loop informed the acceptance gate, but the project is currently too experimental to make the sole authority for this mission.
