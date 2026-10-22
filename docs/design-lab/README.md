# Amina Design Lab

**Purpose:** a reusable, evidence-first design and learner-usability workflow for Amina. This is a tool integration, not a claim that the app has already been audited or redesigned.

## Why this combination

A single public GitHub repository did not cover all required roles. This kit combines three focused tools/workflows:

1. **Open Design Agent** — research, independent design critique, and design-system stewardship. The Amina agent files adapt these role contracts to this product rather than leaving upstream relative paths that would break when copied.
2. **UI Check** — rendered-screen inventory, real screenshot evidence, state coverage, and measurable visual findings. The upstream MIT-licensed skill is copied to `.github/skills/ui-check/SKILL.md`; its license is preserved separately.
3. **Humanish** — synthetic participants that can use a product through computer-use sessions and leave action traces/screenshots. This is the preferred participant runner only when its runtime is available. A no-key preview does not test Amina. Hosted desktop/API routes can cost money; no billable run is authorized by this setup.

This is deliberately not a production dependency and does not alter Amina's runtime or package scripts.

## How the agents are used

- `.github/agents/amina-design-researcher.agent.md`: evidence and learner/parent research plan.
- `.github/agents/amina-learner-simulator.agent.md`: task-based synthetic student attempt, without source-code hints during the attempt.
- `.github/agents/amina-design-critic.agent.md`: independent rendered UI critique.
- `.github/agents/amina-design-system-steward.agent.md`: duplicate-pattern, token, component, and accessibility audit.
- `.github/skills/amina-design-lab/SKILL.md`: sequence and release gate.
- `.github/skills/ui-check/SKILL.md`: full evidence-first visual audit procedure.

Run the design lab with the repository's supported coding agent by asking it to follow `.github/skills/amina-design-lab/SKILL.md`. The presence of these files does not itself launch an agent or browser.

## Humanish runtime decision

Humanish is MIT-licensed and its upstream documentation describes two live paths:
- Hosted desktop: needs E2B plus a model provider/account and may incur charges.
- Local browser: avoids E2B/API keys but has strict Linux/macOS virtualization/runtime requirements and uses a signed-in Codex account quota; it is not offline.

Because this repository is operated through GitHub and the owner works from a phone, do not assume either live runtime is available. First check the actual agent runner's Node version, browser/computer-use capability, and credentials without exposing secret values. If neither live route is available, use the available browser/computer-use tool or mark learner testing blocked. Never count Humanish's dry-run preview as app evidence.

## Execution status

- [x] Inspected Amina's current `package.json` and project handoff.
- [x] Selected and arranged role-specific design/research/critique/learner workflows.
- [ ] Rendered browser walkthrough against a running Amina build.
- [ ] Screenshot-backed duplicate-pattern and visual audit.
- [ ] Synthetic learner run against Amina.
- [ ] Concept comparison and owner review.
- [ ] Production implementation and regression verification.

The unchecked items are intentionally not claimed as completed.

## Upstream sources and attribution

- Open Design Agent: https://github.com/dragonoasis/open-design-agent — MIT License. The agent role structure has been adapted into Amina-specific files.
- UI Check: https://github.com/Octo-o-o-o/ui-check — MIT License. Its skill and license are included in this repository.
- Humanish: https://github.com/danielgwilson/humanish — MIT License. Referenced as an optional synthetic participant runtime; its package/runtime is not vendored or added as an Amina dependency.
- Design Loop (evaluated, not installed): https://github.com/rithvikx/design-loop. Its inspect→browse→evaluate→fix→verify loop informed the acceptance gate, but the project is currently too experimental to make the sole authority for this mission.
