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
| Conversations exported | 24 |
| Amina-repository sessions | 7 |
| Sessions on other repositories | 17 |
| Events exported | 32977 |
| MessageEvents (user/assistant) | 314 / 193 |
| Tool ActionEvents | 9573 |
| `VERBATIM_COMPLETE` | 20 |
| `VERBATIM_PARTIAL` (running at export) | 4 |
| Inaccessible | 0 |

## Honest boundaries

- This closes the **OpenHands Cloud history for this account**. It does not close ChatGPT history, other
  OpenHands accounts, or other apps.
- Four conversations were still executing when the export was taken and are labelled `VERBATIM_PARTIAL`.
- Attachment binary payloads are not part of the event stream; only attachment metadata is preserved.
- Credentials are redacted in the readable render. The raw JSON is preserved exactly as the API returned it,
  which already masks live secrets as `**********`.
- Documentation only. No application code was edited, no build was run for implementation, and nothing was merged or deployed.

**Export timestamp (UTC):** `2026-10-22T10:24:19Z`
