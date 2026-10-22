# Verification Report — OpenHands Chat-Hub Export

**Generated (UTC):** `2026-10-22T10:28:59Z`

This report records validation evidence, not self-attested completion.

## 1. Enumeration evidence

- Endpoint: `GET https://app.all-hands.dev/api/v1/app-conversations/search?limit=100`
- Result: `24` items, no `next_page_id` (single page, so no truncation).
- Cross-check: `GET /api/v1/app-conversations/count` returned `24`, matching the exported count.

## 2. Per-conversation retrieval evidence

Every conversation was fetched by following `next_page_id` until the API stopped returning one. Event counts and raw SHA-256 hashes are recorded per conversation in `SOURCE_COVERAGE.md`. A transcript's raw export can be re-fetched and its hash compared to detect drift.

## 3. Content-integrity checks

| Check | Result |
|---|---|
| Conversations listed vs exported | 24 vs 24 — match |
| `count` endpoint vs exported | 24 vs 24 — match |
| Total events across exports | 32977 |
| MessageEvents (user/assistant) | 314 / 193 |
| Conversation ID set uniqueness | 24 unique IDs |
| Transcript files present | 24 files in `transcripts/openhands-cloud/` |
| Raw exports present | 24 files in `raw/openhands-cloud/` |

## 4. Redaction evidence

The readable transcripts redact credentials while the raw JSON is preserved exactly as the API returned it (the API already masks live credentials as `**********`). Redaction markers present in the readable render:

| Marker | Occurrences |
|---|---:|
| `REDACTED` | 60 |
| `REDACTED_API_KEY` | 495 |
| `REDACTED_ENCRYPTED_SECRET` | 1084 |
| `REDACTED_GCP_API_KEY` | 9 |
| `REDACTED_GITHUB_OAUTH` | 2 |
| `REDACTED_GITHUB_PAT` | 2 |
| `REDACTED_GITHUB_TOKEN` | 2 |
| `REDACTED_GITHUB_USER_TOKEN` | 39 |
| `REDACTED_PRIVATE_KEY` | 2 |

A post-export scan for common credential shapes (`ghp_`, `gho_`, `ghu_`, `ghs_`, `github_pat_`, `sk-`, `gAAAAA…` Fernet blobs, `user:token@github.com` URLs, PEM private keys) found **no unredacted matches** in the exported archive tree.

## 5. Readable-render conventions

- `MessageEvent`, `SystemPromptEvent`, `ActionEvent`, `ObservationEvent`, and non-snapshot state events are rendered verbatim.
- Repeated `full_state` and `stats` snapshots (internal agent configuration and token-usage blobs) are **summarized** in the readable render, each marked inline as `[FULL_STATE SNAPSHOT - summarized for readability...]` or `[STATS SNAPSHOT - summarized for readability...]`. These events dominate raw volume (roughly 244 MB of ~377 MB) and are near-identical repeats. The complete values are preserved verbatim in the raw JSON export, so no information is lost.

## 6. Honest limitations

- Four conversations were still running at export and are labelled `VERBATIM_PARTIAL`.
- Attachment binary payloads are not in the event stream; only metadata is preserved.
- The readable render truncates any single block above 400,000 characters, and says so inline; the raw JSON keeps the full text.
- The archive adds roughly 213 MB to the branch (92 MB gzipped raw JSON, 121 MB readable transcripts). All individual files are below GitHub's 100 MB limit.
- Redaction replaces credential values with `[REDACTED_*]` markers, so original credential values are not recoverable from this archive; the surrounding conversation text is preserved.
- This archive is documentation only. No application code, build, merge, or deployment was touched.

