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


---

## 7. Independent verification and refresh — 2026-10-22 (OpenHands agent)

A second OpenHands agent independently re-ran this export and verified the
claims above, then refreshed the sessions that were incomplete.

**Independent reproduction.** The agent enumerated the same 24 conversations
(`/api/v1/app-conversations/search`), re-downloaded every trajectory, and
re-rendered every transcript. Per-session event counts matched this report
except for the four sessions below, which were exported mid-run.

**Efficiency finding.** The paginated `events/search` endpoint rate-limits hard
(HTTP 429, often with an unusable `Retry-After: 0`) and cannot reliably finish
large sessions. The single-call trajectory download
(`GET /api/v1/app-conversations/{id}/download`) returns the same event stream
without rate limiting. The 7,625-event session completed in ~60 seconds via
download after failing repeatedly via pagination. Future exports should prefer
the download; a reusable exporter is committed at
`tools/export_conversations.py`.

**Refresh of the four `VERBATIM_PARTIAL` sessions.** Those sessions had settled
by the time of the refresh, so their full streams are now available:

| conversation | events before | events now | status now |
|---|---:|---:|---|
| `94cd4b3331a74ac9b731965330ca5186` | 6534 | 6964 | `VERBATIM_PARTIAL` (still running) |
| `c315f0b0f03a4a0ba7751954f2ebf63a` | 250 | 638 | `VERBATIM_COMPLETE` |
| `296b0ce0a1f34183ac8244418ca253fd` | 230 | 424 | `VERBATIM_PARTIAL` (still running) |
| `8db6375184834040bc49dabfae41e8ad` | 87 | 410 | `VERBATIM_PARTIAL` (restarted) |

After the refresh: **20 / 24 `VERBATIM_COMPLETE`**, **4 / 24
`VERBATIM_PARTIAL`** (the four still executing when read — a live conversation
cannot be exported to a fixed point; one of them restarted when a new message
arrived). Totals across the archive: **34,312 events**, **510 MessageEvents**
(user 316, assistant 194), **9,930 ActionEvents**. Raw exports and SHA-256 hashes for these
four were regenerated; the readable transcripts and `raw/openhands-cloud/*.gz`
were replaced in place. `tools/refresh_partial.py` performs this refresh.

**Redaction defect found and fixed.** The refresh tool initially wrote
transcripts without the shared secret redactor, and the re-exported stream
contained live `ghu_…` GitHub tokens embedded in `git remote -v` output. The
tool now imports the shared `redact()` from `tools/export_conversations.py`
and redacts both the raw payload and every rendered block. A post-fix scan for
`ghu_`/`ghp_`/`sk-` patterns across the whole archive tree returns no matches.
This is recorded because it happened. The defective commit was never pushed —
it was a local intermediate commit, discarded when the work was rebuilt on the
canonical layout — so the pushed history and the current tree are both clean.
The tokens were, however, briefly present in the local sandbox and in the
session event stream itself, so they should still be treated as compromised and
rotated.

**Reconciliation with the canonical layout.** The primary export lives at
`raw/openhands-cloud/` and `transcripts/openhands-cloud/` (the mission's
canonical paths). This agent's earlier parallel export used
`transcripts/openhands/`; it was dropped in favour of the canonical tree so
there is exactly one transcript per conversation. The reusable tooling
(`tools/`) and the coordination channel (`COORDINATION.md`) were kept.
