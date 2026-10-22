# Cross-App Conversation Hub — Mission and Export Protocol

**Mission status: OPEN — NOT COMPLETE**

## Required outcome

Create a durable, searchable repository archive containing a separate, word-for-word transcript of every recoverable conversation related to the Amina / Miss Noor project from every in-scope app or agent, including ChatGPT and OpenHands. This is a transcript archive, not a summary collection.

## Non-negotiable rules

1. Preserve original message text exactly when source data permits, including spelling, punctuation, formatting, timestamps, speaker/role, attachments metadata, tool calls/results, and message order.
2. Keep each conversation as its own file. Never combine distinct conversations into a synthesized narrative.
3. Do not silently omit assistant messages, user messages, system-visible transcript content, tool outputs, or attachments. Record unavailable attachment payloads and their original names/identifiers where possible.
4. Never reconstruct missing text from memory, project specifications, summaries, or snippets and label it as verbatim.
5. Label each record as one of: `VERBATIM_COMPLETE`, `VERBATIM_PARTIAL`, `EXCERPT_ONLY`, `SUMMARY_ONLY`, or `SOURCE_UNAVAILABLE`.
6. Store provenance: source app, conversation/thread ID, title, participants/roles, date range, export method, export timestamp, message count if known, attachment count if known, and completeness limitations.
7. Preserve raw exports unchanged under `raw/<source-app>/` when possible. Create normalized readable transcripts separately under `transcripts/<source-app>/`. Do not modify raw exports.
8. Maintain `INDEX.md` with one row per conversation and direct links to the raw export and readable transcript. Track discovered, exported, verified, partial, inaccessible, and pending counts separately.
9. Verify each copied artifact against the source export where possible (message counts, hashes, byte counts, or source checksums). Record the method and result.
10. Do not edit application code, build, merge, or deploy as part of this documentation mission.

## Source-by-source execution

### ChatGPT

Search all authorized sources available to the operator for every conversation about Amina, School Companion, Nour / Miss Noor, the product brief, school curriculum, feed/reels, library/books, homework, lesson planning, and related implementation/audit work.

If the connected context/file tools expose only saved artifacts, excerpts, or summaries, explicitly record that limitation. Do not represent a library document as the original chat that produced it.

The current assistant environment does not expose an API/tool that can enumerate and retrieve every historical ChatGPT conversation as full raw message-by-message transcripts. To close this source gap, obtain an official account data export or a user-provided ChatGPT conversation export, then ingest every matching conversation without rewriting it. Until that source is available, ChatGPT transcript coverage must remain marked **INCOMPLETE**.

### OpenHands

Enumerate all accessible OpenHands sessions, runs, tasks, and threads concerning Amina / Miss Noor. Export each session in full, preserving role, order, timestamps, tool calls, tool results, and attachments or their metadata. Record expired or inaccessible sessions individually and provide evidence for the final counts. A posted request/comment is not evidence that export execution has occurred.

### Other connected apps / agents

Inventory available authorized apps and connectors that were used for this project. For each source, document whether full conversation export is supported, execute export when supported and authorized, and otherwise record the precise blocker and the next required access/export mechanism. Never claim an app was searched if it was not.

## Required deliverables

- One original transcript per conversation, never a merged substitute.
- Raw exports preserved where available.
- `INDEX.md`: complete source inventory and per-conversation status.
- `SOURCE_COVERAGE.md`: app-by-app coverage, counts, blockers, and verification.
- `GAPS_AND_INACCESSIBLE_SOURCES.md`: every missing/partial source and what is needed to recover it.
- `VERIFICATION_REPORT.md`: validation evidence, not self-attested completion.
- This mission file.

## Definition of done

The task is complete only when every identified in-scope conversation has been exported and verified, or each inaccessible source is explicitly documented with a proven access limitation and the archive is clearly marked incomplete. Never declare full completion while any source remains unenumerated, unexported, or unverified.

## Current known state at creation

- Existing archive branch: `archive/openhands-chat-recovery-2026-10-22`.
- Existing PR: https://github.com/madnessgate44-debug/Amina/pull/8 (not merged).
- Two prior project artifacts and a partial recovered-context record have been archived; these are not a complete transcript corpus.
- A request for OpenHands session recovery has been posted, but completion is not verified.
- Full historical ChatGPT conversations are not currently available to this assistant through the connected retrieval tools. This is an explicit source-access blocker, not proof that those conversations do not exist.
- Overall status: **OPEN / PARTIAL / NOT COMPLETE**.
