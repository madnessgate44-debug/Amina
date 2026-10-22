# Conversation Synchronization Rule — Amina / Miss Noor

This project follows the cross-project conversation sync standard defined in the Firstborn repository:
https://github.com/madnessgate44-debug/Firstborn/blob/main/docs/CHAT_SYNC_PROTOCOL.md

## Project-specific application

- Repository: `madnessgate44-debug/Amina`
- Scope: conversations about Amina / Miss Noor, including product requirements, UX, curriculum, implementation, testing, and release decisions.
- Preserve exact source messages when available. Keep summaries clearly separate from transcripts.
- Track ChatGPT, OpenHands, and any other relevant app as separate sources; do not imply that one source covers another.
- Record every captured session in an index with date, source, status, and repository path.
- Status must be `COMPLETE`, `PARTIAL`, `EXCERPT`, or `SOURCE_UNAVAILABLE`.
- Do not change app code, merge, or deploy as part of transcript archival without separate authorization.

## Current limitation

The existing archive is partial. This rule does not grant access to historical chats or create a background real-time capture mechanism. Full historical ChatGPT transcripts require an official data export or another source containing the original messages. OpenHands and other apps require their own accessible session records.

## Session-close requirement

For each Amina / Miss Noor coding or product conversation, capture the available transcript or a clearly labelled session summary, update the archive index, and report the exact commit/PR and any gaps. Never label a summary as a word-for-word transcript.
