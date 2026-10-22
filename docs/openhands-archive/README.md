# OpenHands Conversation Archive and Recovery

**Purpose:** Build a durable, source-labelled record of the full Miss Noor/Amina project conversation history available to the owner, ChatGPT, and OpenHands.

**Status:** RECOVERY IN PROGRESS — this is not yet a complete transcript archive.

## Rules
1. Preserve original messages verbatim wherever a transcript or export is available. Do not paraphrase text placed in a transcript file.
2. Keep each source clearly identified: OpenHands session/export, GitHub issue/PR comment, repository document, ChatGPT conversation, or owner-provided text.
3. Record the source URL/ID, date/time and timezone when available, participants/roles, and whether the record is complete or partial.
4. Do not fabricate missing messages or infer transcript content from a summary.
5. Do not include credentials, API keys, access tokens, or other secrets. Redact secrets and note that redaction occurred.
6. Preserve chronology. If multiple exports overlap, retain originals and add an index instead of silently deleting duplicates.
7. This archive is documentation-only. Do not edit application code, run implementation builds, merge product changes, or deploy.
8. The existing master file `docs/AMINA_PROJECT_MEMORY_AND_FORGE_ORDERS.md` is a synthesized handoff, not a verbatim chat export.

## Archive layout
- `RECOVERY_REQUEST_AND_AVAILABLE_RECORDS.md` — request to OpenHands and currently accessible source inventory.
- `transcripts/` — OpenHands should add original conversation/session transcripts here, one file per session or export, with source metadata.
- `INDEX.md` — OpenHands should maintain a chronological inventory of every recovered transcript, including missing/inaccessible sessions.

## Completion criteria
Recovery is complete only when OpenHands has searched all conversation/session history it can access for this repository/project, exported the full available message text without summarization, listed any inaccessible or expired sessions, and provided a count of sessions/messages plus a manifest of source IDs and dates. Do not call it complete if only summaries or selected excerpts were recovered.

---

## OpenHands-side recovery executed — 2026-10-22

The OpenHands portion of this recovery has been executed. OpenHands enumerated and exported **24** conversations
(7 on the Amina repository) via the OpenHands Cloud API, preserving raw JSON under `raw/openhands-cloud/`
and readable transcripts under `transcripts/openhands-cloud/`. See `OPENHANDS_EXPORT_COMPLETION_2026-10-22.md`,
`SOURCE_COVERAGE.md`, `GAPS_AND_INACCESSIBLE_SOURCES.md`, and `VERIFICATION_REPORT.md`.

ChatGPT-side coverage and other sources remain incomplete and are listed as open gaps.
