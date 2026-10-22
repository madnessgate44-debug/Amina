# Project memory — Amina / Miss Noor

## Repo and branches (madnessgate44-debug/Amina)
- Shallow clone; `main` @ 86c1e73. Full branch list needs GitHub API, not local `git`.
- Long-lived branches beyond main: `archive/openhands-chat-recovery-2026-10-22` (PR #8, base = design branch),
  `design/ai-design-lab-toolkit` (PR #7 → main), `wip/handoff-2026-10-21`, `design/brand-and-visual-direction`,
  `audit/amina-readiness-2026-10-11`, plus merged fix/* branches.
- App code on the archive/design branches is ahead of main (adds BookReader.tsx, bookLibrary.ts, subjectIdentity.ts,
  studentAddress.ts, tools/curriculum/*.py). Main is not the newest app state.

## "Communication hub" = docs/openhands-archive/ on the archive branch
That directory (not any local folder) is the cross-app chat archive. Key files:
`CHAT_HUB_MISSION_AND_EXPORT_PROTOCOL.md`, `CHAT_SYNC_PROTOCOL.md`, `INDEX.md`, `README.md`,
`RECOVERY_REQUEST_AND_AVAILABLE_RECORDS.md`, `transcripts/`, `recovered-project-artifacts/`.
Hub status: OPEN / PARTIAL. Owner's standing request: OpenHands must export its own session history verbatim
into `transcripts/` and update `INDEX.md`. Documentation-only; no app-code edits, merge, or deploy.

## The only "schedule" GPT left (there is no cron anywhere)
No `schedule:`/`cron:` trigger exists in any Amina or Firstborn workflow. The schedule is a written cadence:
`docs/openhands-archive/CHAT_SYNC_PROTOCOL.md` §"Batch-capture operating model (clarification, 2026-10-22)" —
periodic chunk capture after a meaningful exchange / practical interval, atomic batch commits with a
checkpoint cursor, recorded batch start/end IDs + lag + gaps. Explicitly: ChatGPT's recurring-task scheduler
only does daily/weekly/monthly; a shorter cadence needs a GitHub Actions cron AND a supported conversation-data
source (GH Actions cannot read private ChatGPT threads). Firstborn mirrors this in
`docs/CHAT_SYNC_PROTOCOL.md` and `docs/conversation-sync/transcripts/2026-10-22-real-time-sync-requirement.md`.

## Product facts
- Name: **Miss Noor** (owner-corrected; "Bemis Noor" was wrong, "Amina" is legacy).
- Nav locked: HOME | FEED | LIBRARY | NOUR. Grade 5, École Girard, Alexandria, French track, Egyptian curriculum.
- Feed direction approved: Balanced Feed — Learn + Explore.
- Current app-work authorization is read-only / product-design planning. No app edits, merge, or deploy.
- Verification rule: claims must be Verified / Observed-not-verified / Hypothesis / Blocked. Never invent runs.
