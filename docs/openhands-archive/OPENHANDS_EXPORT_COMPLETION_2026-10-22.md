# OpenHands Export Completion — 2026-10-22

**Status:** EXECUTED. This file reports what OpenHands actually did in response to
`RECOVERY_REQUEST_AND_AVAILABLE_RECORDS.md` §4 and `CHAT_HUB_MISSION_AND_EXPORT_PROTOCOL.md`.

## What was executed

OpenHands enumerated every conversation visible to its OpenHands Cloud account and exported each one in full,
using the OpenHands Cloud REST API.

- Enumeration: `GET /api/v1/app-conversations/search?limit=100` → **24 conversations**, single page, no further pages.
- Cross-check: `GET /api/v1/app-conversations/count` → `24`.
- Per conversation: `GET /api/v1/conversation/{id}/events/search?limit=100` with `next_page_id` followed to exhaustion.
- Raw, untouched JSON: `raw/openhands-cloud/<conversation-id>.events.json.gz`.
- Readable, ordered transcript: `transcripts/openhands-cloud/openhands-<conversation-id>.md`.
- Index with per-conversation links and counts: `INDEX.md`.
- Coverage, counts, hashes: `SOURCE_COVERAGE.md`.
- Open gaps: `GAPS_AND_INACCESSIBLE_SOURCES.md`.
- Validation evidence: `VERIFICATION_REPORT.md`.

## Counts

| Metric | Value |
|---|---:|
| Conversations exported | 25 |
| Amina-repository sessions | 8 |
| Sessions on other repositories | 17 |
| Events exported | 36762 |
| MessageEvents (user/assistant) | 319 / 196 |
| Tool ActionEvents | 10556 |
| `VERBATIM_COMPLETE` | 24 |
| `VERBATIM_PARTIAL` (running at export) | 1 |
| Inaccessible | 0 |

**Refresh note (2026-10-22T12:15:00Z):** a second pass re-ran the exporter. One new conversation
(`ab92584b`, created 2026-10-22T11:02:35) was found and exported; four sessions that were
`VERBATIM_PARTIAL` at the first export (`94cd4b33`, `296b0ce0`, `c315f0b0`, and the then-partial
`8db63751` snapshot) have settled and were refreshed. `8db63751` is this export session and remains
`VERBATIM_PARTIAL` while it runs. Counts above are the post-refresh totals.

## Honest boundaries

- This closes the **OpenHands Cloud history for this account**. It does not close ChatGPT history, other
  OpenHands accounts, or other apps.
- One conversation (`8db63751`) was still executing at the refresh and is labelled `VERBATIM_PARTIAL`; the other 24 are `VERBATIM_COMPLETE`.
- Attachment binary payloads are not part of the event stream; only attachment metadata is preserved.
- Credentials are redacted in the readable render. The raw JSON is preserved exactly as the API returned it,
  which already masks live secrets as `**********`.
- Documentation only. No application code was edited, no build was run for implementation, and nothing was merged or deployed.

**Export timestamp (UTC):** `2026-10-22T10:24:19Z`
