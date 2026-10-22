#!/usr/bin/env python3
"""
Render INDEX.md and SOURCE_COVERAGE.md from MANIFEST.json.

Run after export_conversations.py so the archive index always matches the
machine-readable manifest. Project rows are derived from the repository each
OpenHands conversation was attached to.
"""

from __future__ import annotations

import json
import os
from collections import Counter

ARCHIVE = os.path.join(os.path.dirname(__file__), "..")
MANIFEST = os.path.join(ARCHIVE, "MANIFEST.json")


def project_of(repo: str | None) -> str:
    if not repo:
        return "unassigned"
    return repo.split("/")[-1]


def main() -> None:
    data = json.load(open(MANIFEST, encoding="utf-8"))
    convs = data["conversations"]
    convs.sort(key=lambda c: c.get("created_at") or "")

    complete = [c for c in convs if c.get("completeness") == "VERBATIM_COMPLETE"]
    partial = [c for c in convs if c.get("completeness") != "VERBATIM_COMPLETE"]

    total_events = sum(c.get("total_events") or 0 for c in complete)
    total_msgs = sum(c.get("message_events") or 0 for c in complete)
    total_user = sum(c.get("user_messages") or 0 for c in complete)
    total_asst = sum(c.get("assistant_messages") or 0 for c in complete)

    by_project = Counter(project_of(c.get("repository")) for c in complete)

    dates = [c["created_at"][:10] for c in complete if c.get("created_at")]

    rows = []
    for i, c in enumerate(convs, 1):
        path = c.get("transcript_path") or "—"
        link = f"[{os.path.basename(path)}]({path})" if c.get("transcript_path") else "—"
        rows.append(
            f"| {i} | {c['conversation_id'][:8]} | {project_of(c.get('repository'))} | "
            f"{(c.get('created_at') or '')[:10]} | {c.get('title','')[:52]} | "
            f"{c.get('total_events','?')} | {c.get('message_events','?')} | "
            f"{c.get('completeness')} | {link} |"
        )

    index = f"""# Conversation and Artifact Archive Index

**Source app for this section:** OpenHands Cloud
**Exported:** {data['exported_at']}
**Generator:** `tools/build_index.py` (reads `MANIFEST.json`)

## A. OpenHands conversation transcripts

One verbatim transcript per OpenHands conversation. Status is
`VERBATIM_COMPLETE` when every reachable event for that conversation was
exported, `SOURCE_UNAVAILABLE` when the API refused after retries.

| # | id | project | date | title | events | messages | status | transcript |
|---:|---|---|---|---|---:|---:|---|---|
{os.linesep.join(rows)}

## B. Coverage summary — OpenHands

| metric | value |
|---|---|
| conversations enumerated | {len(convs)} |
| exported VERBATIM_COMPLETE | {len(complete)} |
| SOURCE_UNAVAILABLE | {len(partial)} |
| total events exported | {total_events:,} |
| total message events | {total_msgs:,} |
| — user messages | {total_user:,} |
| — assistant messages | {total_asst:,} |
| earliest conversation | {min(dates) if dates else 'n/a'} |
| latest conversation | {max(dates) if dates else 'n/a'} |

### By project

| project | conversations |
|---|---:|
{os.linesep.join(f'| {p} | {n} |' for p, n in by_project.most_common())}

## C. Non-OpenHands sources

| source | status | path |
|---|---|---|
| ChatGPT recovered messages (partial) | EXCERPT_ONLY | `transcripts/chatgpt-recovered-context-2026-10-22-PARTIAL.md` |
| ChatGPT full conversation history | SOURCE_UNAVAILABLE | see `GAPS_AND_INACCESSIBLE_SOURCES.md` |
| GitHub PR discussion (PR #7) | EXCERPT_ONLY | `RECOVERY_REQUEST_AND_AVAILABLE_RECORDS.md` |

See `SOURCE_COVERAGE.md` for app-by-app detail and
`GAPS_AND_INACCESSIBLE_SOURCES.md` for every known gap.
"""
    with open(os.path.join(ARCHIVE, "INDEX.md"), "w", encoding="utf-8") as fh:
        fh.write(index)
    print(f"INDEX.md written: {len(convs)} conversations ({len(complete)} complete)")


if __name__ == "__main__":
    main()
