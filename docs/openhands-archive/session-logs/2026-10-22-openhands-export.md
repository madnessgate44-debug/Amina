# Session log — 2026-10-22 — OpenHands conversation export

**Agent:** OpenHands
**Branch:** `archive/openhands-chat-recovery-2026-10-22`

## Goal

Close the OpenHands half of the conversation-archive mission: enumerate and
export every reachable OpenHands conversation verbatim, per
`CHAT_HUB_MISSION_AND_EXPORT_PROTOCOL.md`.

## What happened

1. Proved the OpenHands Cloud API is reachable from inside the sandbox
   (`/api/v1/app-conversations/count` → 23).
2. Wrote `tools/export_conversations.py`. First version paginated
   `events/search`; it hit HTTP 429 rate limits and could not finish
   conversations above a few hundred events.
3. Found and switched to the single-call trajectory download
   (`/api/v1/app-conversations/{id}/download`), which returns every event in one
   request with no rate limiting. This took the 7,625-event conversation from
   "failing after 15 minutes" to "done in 60 seconds".
4. Fixed two renderer bugs found by inspecting real events: `thought` and
   `observation.content` are content-block lists, not strings; and assistant
   messages have `source == "agent"`, not `"assistant"`.
5. Tightened the secret redactor after noticing it was replacing env-var
   *names* and branch-name substrings. Added word boundaries and required a real
   assignment. Redactions dropped from ~187 to ~46 in the worst file, with no
   real key patterns remaining.
6. Re-downloaded every trajectory zip and recorded SHA-256 hashes as proof of
   provenance.

## Result

- 23 / 23 conversations `VERBATIM_COMPLETE`, 0 `SOURCE_UNAVAILABLE`.
- 33,152 events; 506 message events (313 user / 193 assistant).
- One transcript per conversation in `transcripts/openhands/`.
- `MANIFEST.json` + generated `INDEX.md`.

## What is still open

- ChatGPT source remains blocked (needs an official account data export).
- The `Amina School Companion — Product Transformation Report` is a ChatGPT-side
  artifact and is not in any OpenHands conversation.
- OpenHands visibility is limited to 2026-10-11 onward for this account.
