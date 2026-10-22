# Miss Noor — OpenHands / Forge Synchronization Handoff
**Updated:** 2026-10-22  
**Repository:** `madnessgate44-debug/Amina`  
**Purpose:** Durable handoff so OpenHands/Forge can continue the same work without losing decisions, duplicating audits, or assuming unverified results.

## 0. Owner decision — latest instruction overrides older naming
The owner explicitly corrected the intended product name to **Miss Noor**. Use this exact spelling and capitalization. Do not use “Bemis Noor.” Older repository documents call the product “Amina”; that is historical context, not the current naming decision.

Before renaming files, package IDs, URLs, repository name, deployment resources, or persisted data, inventory every occurrence and identify compatibility/deployment consequences. Do not make destructive or broad identifier changes without reporting them first. At minimum, audit the user-facing brand: app title, manifest/PWA metadata, page title, header, onboarding, settings/about, accessibility labels, and docs. Clarify in the report whether “Miss Noor” is both the app/brand and the AI teacher, because older product architecture distinguishes the product from the teacher. Do not silently invent a second name.

## 1. Current work in flight
- Open PR #7: https://github.com/madnessgate44-debug/Amina/pull/7
- Head branch: `design/ai-design-lab-toolkit`
- Last inspected head: `00dd508d40a148087408c4266e58e870e5058c33`
- PR is open and unmerged. Do not merge it without owner approval.
- The PR adds repository-native design/UX audit agents and skills, learner test matrix, source review, and browser-evidence tooling. It does not itself complete the product redesign.
- A separate handoff branch exists: `wip/handoff-2026-10-21`. It contains `docs/AMINA_HANDOFF.md`, `docs/AMINA_READINESS_AUDIT.md`, `docs/AMINA_PROJECT_MEMORY_AND_FORGE_ORDERS.md`, and `docs/AMINA_SESSION_TRANSCRIPT_2026-10-21.md`. These are useful prior evidence, but are on a different branch; do not assume their commits are in PR #7 or main.

## 2. Design concept
Figma concept file: https://www.figma.com/design/OtmW0yS6txIKCmquViINil  
File name at creation: “Amina — Deep Design Direction”. It contains conceptual mobile HOME, FEED, LIBRARY, and NOUR screens. This is a proposal, not proof of the current app rendering and not an approved implementation. Reconcile its name/brand with the latest owner decision (“Miss Noor”) before treating the concept as final. Compare against current browser screenshots; do not describe stock or illustrative images as actual app screenshots.

## 3. Evidence and verification status
A prior browser audit workflow run was recorded at https://github.com/madnessgate44-debug/Amina/actions/runs/39738852961 and captured phone/desktop screenshots in artifact `amina-design-lab-browser-evidence`. Its observations were for the earlier build, so rerun against the current PR head before relying on them.
Historical findings to re-check (not assume still true):
- Header identity may conflate app name and teacher name.
- FEED viewport height/scroll progression may conflict with shell/header/navigation.
- French mode may show mixed English/French/Arabic.
- LIBRARY search may not match French/English subject names.
- Earlier Forera synthetic learner attempt was blocked by stale element indexes and a disabled Submit action; it did **not** pass the end-to-end learner journey.
- Follow-up changes to Feed sizing, localization, curriculum search, browser assertions, and synthetic runner were made on the design branch, but their latest runtime status was not confirmed in the previous handoff. Inspect actual branch files and run the workflow. Do not claim they are fixed until current evidence proves it.
- Earlier CI had typecheck, unit tests, and build passing before later edits; rerun all required checks after current changes.

## 4. Product constraints to preserve
The established primary destinations are HOME / FEED / LIBRARY / NOUR. The target learner is Grade 5 at École Girard in Alexandria, French track, with Egyptian curriculum and French-language learning/assessment for Mathematics and Science. Treat this as product context, not proof that every requirement is implemented.

Preserve the existing connected learning loop and working features. FEED must be a real vertically navigable educational learning experience, not merely a tab or list. Any available curriculum lesson should hand its context into the same genuine adaptive teacher flow. Keep curriculum truthful; do not fabricate books, lessons, timetable entries, or test evidence. No marketing/SEO/ads scope unless explicitly authorized.

## 5. Required OpenHands/Forge next actions
Follow INSPECT → SPECIFY → PLAN → EXECUTE → VERIFY → CLOSE. Work from the actual current repository state; preserve unrelated user changes.

1. Read this file and the four historical handoff/audit docs listed above if available in the branch. Compare branch contents instead of assuming branch commits are shared.
2. Inspect PR #7 diff and current source. Produce a compact requirement-to-evidence matrix with requirement, status, file/line or screenshot/run evidence, gap, and next action.
3. Audit all brand/name occurrences and propose a safe migration plan for **Miss Noor**. Distinguish user-facing text from technical identifiers; do not perform risky identifier/deployment changes without owner confirmation.
4. Run lint, tests, production build, and the current browser audit on the exact head commit. Fix only demonstrated defects, with minimal targeted changes. Ensure browser assertions match actual selectors and UI copy.
5. Retry the synthetic learner walkthrough using fresh element indexes and enabled controls; capture step-by-step outcomes. If blocked, report exact blocker and do not label it passed.
6. Compare current browser screenshots at 390×844 and desktop viewport against the Figma concept; report differences and recommendations. Do not claim the Figma concept is implemented.
7. Check that CI evidence artifacts and report files are produced and accessible. Add a dated report to `docs/design-lab/` with commit SHA, run URL, checks and outcomes, screenshots/artifacts, findings, limitations, and next steps.
8. Update this handoff at session end with exact commit SHA, files changed, tests run and results, open blockers, and links to artifacts/PR. Commit and push changes to a working branch, but do not merge or deploy without approval.

## 6. Reporting contract
Every claim must be one of:
- **Verified** — backed by current source, test output, browser evidence, or workflow run.
- **Observed, not fully verified** — evidence exists but does not prove the whole requirement.
- **Hypothesis** — requires a test.
- **Blocked** — explain the precise blocker and smallest next action.

Never invent test runs, screenshots, users, participant results, successful actions, or production deployment status. Report failures as well as passes. Keep the work phone-friendly and free of new paid services unless the owner approves otherwise.

## 7. Explicit non-goals
- Do not merge PR #7 or deploy.
- Do not restart the app architecture or remove settled HOME / FEED / LIBRARY / NOUR destinations.
- Do not add runtime dependencies just to create the appearance of progress.
- Do not treat synthetic learner behavior as real child research.
- Do not assume the old name “Amina” remains the user-facing brand after the owner's correction.
