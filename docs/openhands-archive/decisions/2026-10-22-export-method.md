# Decision — use the trajectory download, not paginated search

**Date:** 2026-10-22
**Status:** accepted

## Context

The archive needs every event of every conversation, verbatim. Two OpenHands
Cloud endpoints can supply events:

- `GET /api/v1/conversation/{id}/events/search?limit=100&page_id=N` — paginated.
- `GET /api/v1/app-conversations/{id}/download` — one zip containing all events.

## Decision

Use the trajectory download as the primary path; keep paginated search only as
a fallback.

## Rationale

Pagination issues one request per 100 events. Conversations in this account
reach 7,625 events (77 requests), and the endpoint rate-limits aggressively
(HTTP 429, frequently with `Retry-After: 0`, which is unusable). The
7,625-event conversation could not be exported by pagination at all; via the
download it completed in ~60 seconds. The download is also atomic, so a
partial export cannot masquerade as complete.

## Consequences

- Raw zips total ~122 MB, so they are not committed; `tools/fetch_raw.py`
  reproduces them and verifies hashes.
- The fallback path stays for conversations where the download is unavailable.
