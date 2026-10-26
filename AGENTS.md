# Repository Agent Instructions

## Mandatory Engineering Execution OS

Before any engineering, repository, audit, or implementation task, read `ENGINEERING_EXECUTION_OS.md` from the repository root and follow it as the controlling project procedure. If it is absent or cannot be read, stop and report BLOCKED; do not improvise a replacement.

Required:
- Follow OUTCOME → INSPECT → SPECIFY → PLAN → EXECUTE → VERIFY → REVIEW → CLOSE.
- Establish repository state and baseline before changing files; number requirements and map each to evidence and acceptance criteria.
- Use the OS's TOOL DECLARATION at the start and COMPLIANCE HEADER at the end of every execution report.
- Tag non-trivial claims inline with the OS evidence tags.
- Record real verification actions, outcomes, raw excerpts, timestamps, and exit codes; never claim checks passed if they were not run.
- Inspect diffs and preserve unrelated work. No fabricated paths, tests, results, sync, deployments, or agent capabilities.
- Follow the OS authority boundaries. Never bypass required human approval for consequential actions.
- If the OS conflicts with older repository instructions, identify the conflict and follow the OS unless the user explicitly directs otherwise in the current session.

## Always-on skills and agents

Detailed workflows live in `.agents/skills/`; specialized workers live in `.agents/agents/`. These load in every conversation.

- Evidence grading: label every factual claim Verified / Observed-not-verified / Hypothesis / Blocked. Never invent a run, a count, or a green gate. Quote the exact command and output.
- Multi-session PRs: several OpenHands sessions run against this repo. Enumerate PRs via the GitHub API before acting, and re-fetch head SHAs immediately before writing. Extend an existing audit/typecheck PR rather than opening a duplicate.
- Git safety: never push to `main`; work on a branch. The owner retains merge and deploy.
- Cadence: no `schedule:`/`cron:` trigger exists in any workflow, and sessions cannot self-schedule. Verify with `actions/runs?event=schedule` before claiming a schedule exists.
- Test hygiene: `run_check` runs `git diff --check`, so a trailing blank line at EOF in any edited file fails it. Strip before `npm test`: `perl -0pi -e 's/\n+\z/\n/' <files>`.
- Secrets: never echo a secret value. Run the `secret-redaction-scan` sweep over text AND compressed content before any push that includes data you did not write by hand.
