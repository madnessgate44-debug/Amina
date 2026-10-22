#!/usr/bin/env python3
"""
Refresh sessions that were exported while still running (`VERBATIM_PARTIAL`).

Those sessions have since settled, so the API now returns their complete event
stream. This script re-fetches each named session, rewrites its readable
transcript and raw export, and reports the new counts so the INDEX can be
updated.

It reuses the canonical layout:
    raw/openhands-cloud/<id>.events.json.gz
    transcripts/openhands-cloud/openhands-<id>.md

Usage:
    OPENHANDS_API_KEY=... python3 refresh_partial.py <id> [<id> ...]
"""

from __future__ import annotations

import gzip
import hashlib
import io
import json
import os
import sys
import time
import urllib.error
import urllib.request
import zipfile
from datetime import datetime, timezone

BASE = os.environ.get("OPENHANDS_BASE_URL", "https://app.all-hands.dev")
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from export_conversations import redact_obj  # noqa: E402  (shared secret redactor)
ARCHIVE = os.path.join(HERE, "..")
RAW_DIR = os.path.join(ARCHIVE, "raw", "openhands-cloud")
TR_DIR = os.path.join(ARCHIVE, "transcripts", "openhands-cloud")
SNAP_MARK = "[{kind} SNAPSHOT — summarized for readability; the complete value is preserved verbatim in the raw JSON export]"


def get_bytes(path: str, token: str, retries: int = 6) -> bytes:
    url = f"{BASE}/api/v1{path}"
    last = None
    for attempt in range(retries):
        req = urllib.request.Request(url, headers={"Authorization": f"Bearer {token}"})
        try:
            with urllib.request.urlopen(req, timeout=300) as resp:
                return resp.read()
        except urllib.error.HTTPError as exc:
            last = exc
            if exc.code == 429:
                time.sleep(min(60, 5 * (attempt + 1)))
                continue
            raise
        except Exception as exc:
            last = exc
            time.sleep(5)
    raise RuntimeError(f"GET failed for {url}: {last}")


def get_json(path: str, token: str, retries: int = 6):
    return json.loads(get_bytes(path, token, retries).decode("utf-8"))


def fetch_events(token: str, cid: str) -> list:
    blob = get_bytes(f"/app-conversations/{cid}/download", token)
    zf = zipfile.ZipFile(io.BytesIO(blob))
    events = [json.loads(zf.read(n).decode("utf-8"))
              for n in zf.namelist()
              if n.startswith("event_") and n.endswith(".json")]
    events.sort(key=lambda e: e.get("timestamp", ""))
    return events


def fence(text: str, limit: int = 400_000) -> str:
    if len(text) > limit:
        text = text[:limit] + f"\n[... truncated at {limit} chars; full text in raw JSON export]"
    return f"```\n{text}\n```"


def render(e: dict) -> str:
    e = redact_obj(e)
    kind = e.get("kind", "?")
    ts = e.get("timestamp", "")
    eid = e.get("id", "")
    src = e.get("source", "?")
    head = f"### {kind}"

    if kind == "MessageEvent":
        role = (e.get("message") or e.get("llm_message") or {}).get("role") \
            if isinstance(e.get("message") or e.get("llm_message"), dict) else src
        head = f"### MessageEvent — role: `{role}` — source: `{src}` — id: `{eid}` — {ts}"
        msg = e.get("message") or e.get("llm_message") or {}
        c = msg.get("content") if isinstance(msg, dict) else msg
        if isinstance(c, list):
            c = "\n".join(x.get("text", "") if isinstance(x, dict) else str(x) for x in c)
        return f"{head}\n\n{fence(str(c or ''))}\n"

    if kind == "SystemPromptEvent":
        head = f"### `SystemPromptEvent` — source: `{src}` — id: `{eid}` — {ts}"
        sp = e.get("system_prompt") or e.get("content") or ""
        if isinstance(sp, dict):
            sp = sp.get("text", json.dumps(sp, indent=1, ensure_ascii=False))
        return f"{head}\n\n{fence(str(sp))}\n"

    if kind == "ActionEvent":
        head = f"### ActionEvent — tool: `{e.get('tool_name','?')}` — source: `{src}` — id: `{eid}` — {ts}"
        body = fence(json.dumps(e.get("action") or {}, indent=1, ensure_ascii=False))
        rc = e.get("reasoning_content")
        if rc:
            body += f"\n\n**reasoning_content:**\n{fence(str(rc))}"
        return f"{head}\n\n{body}\n"

    if kind == "ObservationEvent":
        head = f"### ObservationEvent — tool: `{e.get('tool_name','?')}` — source: `{src}` — id: `{eid}` — {ts}"
        return f"{head}\n\n{fence(json.dumps(e.get('observation') or {}, indent=1, ensure_ascii=False))}\n"

    if kind == "ConversationStateUpdateEvent":
        key = e.get("key", "")
        head = f"### ConversationStateUpdateEvent — key: `{key}` — source: `{src}` — id: `{eid}` — {ts}"
        if key in ("full_state", "stats"):
            return f"{head}\n\n{fence(SNAP_MARK.format(kind=key.upper()))}\n"
        return f"{head}\n\n{fence(json.dumps(e.get('value'), indent=1, ensure_ascii=False)[:20000])}\n"

    head = f"### {kind} — source: `{src}` — id: `{eid}` — {ts}"
    return f"{head}\n\n{fence(json.dumps(e, indent=1, ensure_ascii=False)[:20000])}\n"


def main() -> int:
    if len(sys.argv) < 2:
        print(__doc__)
        return 2
    token = os.environ.get("OPENHANDS_API_KEY") or os.environ.get("OPENHANDS_CLOUD_API_KEY")
    if not token:
        print("ERROR: set OPENHANDS_API_KEY", file=sys.stderr)
        return 2

    os.makedirs(RAW_DIR, exist_ok=True)
    os.makedirs(TR_DIR, exist_ok=True)

    listing = get_json("/app-conversations/search?limit=100", token)
    index = {c["id"]: c for c in (listing.get("items", listing) if isinstance(listing, dict) else listing)}

    for cid in sys.argv[1:]:
        meta = index.get(cid, {})
        events = fetch_events(token, cid)
        now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

        raw = json.dumps(redact_obj(events), separators=(",", ":")).encode()
        buf = io.BytesIO()
        with gzip.GzipFile(fileobj=buf, mode="wb", mtime=0) as fh:
            fh.write(raw)
        gz = buf.getvalue()
        with open(os.path.join(RAW_DIR, f"{cid}.events.json.gz"), "wb") as fh:
            fh.write(gz)
        sha = hashlib.sha256(gz).hexdigest()

        msgs = [e for e in events if e.get("kind") == "MessageEvent"]
        user = [e for e in msgs if e.get("source") == "user"]
        asst = [e for e in msgs if e.get("source") in ("assistant", "agent")]
        acts = [e for e in events if e.get("kind") == "ActionEvent"]
        first_user = ""
        for e in msgs:
            if e.get("source") == "user":
                m = e.get("message") or {}
                c = m.get("content") if isinstance(m, dict) else m
                if isinstance(c, list):
                    c = " ".join(x.get("text", "") for x in c if isinstance(x, dict))
                first_user = (str(c or "").strip().splitlines() or [""])[0][:200]
                break

        exec_status = meta.get("execution_status")
        sandbox = meta.get("sandbox_status")
        running = exec_status == "running" or (exec_status is None and sandbox == "RUNNING")
        label = "VERBATIM_PARTIAL" if running else "VERBATIM_COMPLETE"
        note = ("— the conversation was still running at refresh time; the stream below "
                "is complete up to the export timestamp.") if running else \
               ("— the conversation had finished by refresh time; the full recorded event "
                "stream is rendered below in order.")

        title = meta.get("title") or f"Conversation {cid}"
        repo = meta.get("selected_repository")
        lines = [
            f"# OpenHands Cloud session transcript — `{cid}`",
            "",
            f"**Archive status:** `{label}`",
            note,
            "",
            "| Field | Value |",
            "|---|---|",
            f"| Source app | OpenHands Cloud (`{BASE}`) |",
            f"| Conversation ID | `{cid}` |",
            f"| Conversation UI | {BASE}/canvas/conversations/{cid} |",
            f"| Title | {title} |",
            f"| Repository | `{repo}` |",
            f"| Selected branch | `{meta.get('selected_branch')}` |",
            f"| Trigger | `{meta.get('trigger')}` |",
            f"| Agent kind | `{meta.get('agent_kind')}` |",
            f"| LLM model | `{meta.get('llm_model')}` |",
            f"| PR number(s) | `{meta.get('pr_number')}` |",
            f"| Created (UTC) | `{meta.get('created_at')}` |",
            f"| Last updated (UTC) | `{meta.get('updated_at')}` |",
            f"| Run status at export | execution=`{exec_status}`, sandbox=`{sandbox}` |",
            f"| Events | {len(events)} total; {len(msgs)} MessageEvent "
            f"({len(user)} user, {len(asst)} assistant); {len(acts)} ActionEvent |",
            f"| Export method | `GET /api/v1/app-conversations/{cid}/download` "
            "(single-call trajectory) |",
            f"| Export timestamp (UTC) | `{now}` |",
            f"| Raw export | `raw/openhands-cloud/{cid}.events.json.gz` |",
            f"| Raw export SHA-256 | `{sha}` |",
            "",
            "**Completeness limitations:** the events API returns the recorded event",
            "stream. Live-only streaming deltas, unpersisted UI state, and attachment",
            "binary payloads are not retrievable through this interface. Credentials,",
            "API keys and tokens appearing in the stream are redacted.",
            "",
            f"**First user message (preview):** {first_user}",
            "",
            "---",
            "",
            "## Event stream (in order)",
            "",
        ]
        lines += [render(e) for e in events]
        with open(os.path.join(TR_DIR, f"openhands-{cid}.md"), "w", encoding="utf-8") as fh:
            fh.write("\n".join(lines) + "\n")

        print(f"{cid}  {label}  events={len(events)} msgs={len(msgs)} "
              f"(user {len(user)}/asst {len(asst)}) actions={len(acts)} sha={sha[:16]}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
