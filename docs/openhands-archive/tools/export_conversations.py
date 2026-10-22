#!/usr/bin/env python3
"""
OpenHands conversation-history exporter for the project archive hub.

Primary strategy: one trajectory-zip download per conversation
(`/api/v1/app-conversations/{id}/download`) returns every event in a single
call, avoiding the pagination rate limits of the events/search endpoint.
Fallback: paginated `events/search` when the download is unavailable.

Usage:
    OPENHANDS_API_KEY=... python3 export_conversations.py --out docs/openhands-archive

Writes one verbatim Markdown transcript per conversation plus MANIFEST.json.
Secrets are redacted before writing; message text is never truncated.
"""

from __future__ import annotations

import argparse
import io
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request
import zipfile
from datetime import datetime, timezone

BASE_URL = os.environ.get("OPENHANDS_BASE_URL", "https://app.all-hands.dev")
API = f"{BASE_URL}/api/v1"

SECRET_PATTERNS = [
    re.compile(r"\bsk-[A-Za-z0-9_\-]{16,}"),
    re.compile(r"ghu_[A-Za-z0-9_]{20,}"),
    re.compile(r"ghp_[A-Za-z0-9_]{20,}"),
    re.compile(r"github_pat_[A-Za-z0-9_]{20,}"),
    re.compile(r"gho_[A-Za-z0-9_]{20,}"),
    re.compile(r"xox[baprs]-[A-Za-z0-9\-]{10,}"),
    re.compile(r"AIza[0-9A-Za-z_\-]{30,}"),
    re.compile(r"AQ\.[A-Za-z0-9_\-]{20,}"),          # Google API key (new format)
    re.compile(r"ya29\.[A-Za-z0-9_\-]{20,}"),        # Google OAuth access token
    re.compile(r"AKIA[0-9A-Z]{16}"),                # AWS access key id
    re.compile(r"ASIA[0-9A-Z]{16}"),                # AWS temporary key id
    re.compile(r"hf_[A-Za-z0-9]{30,}"),                # Hugging Face token
    re.compile(r"sk-ant-[A-Za-z0-9_\-]{20,}"),        # Anthropic key
    re.compile(r"sk-proj-[A-Za-z0-9_\-]{20,}"),       # OpenAI project key
    re.compile(r"sk_live_[A-Za-z0-9]{20,}"),           # Stripe live secret
    re.compile(r"rk_live_[A-Za-z0-9]{20,}"),
    re.compile(r"SG\.[A-Za-z0-9_\-]{20,}\.[A-Za-z0-9_\-]{20,}"),  # SendGrid
    re.compile(r"SK[0-9a-fA-F]{32}"),               # Twilio
    re.compile(r"-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]{0,4000}?-----END [A-Z ]*PRIVATE KEY-----"),
    re.compile(r"(?i)X-goog-api-key[\"\']?\s*[:=]\s*[\"\']?([A-Za-z0-9_.\-]{20,})"),
    re.compile(r"gAAAAA[A-Za-z0-9_\-=]{20,}"),
    re.compile(r"eyJ[A-Za-z0-9_\-]{20,}\.[A-Za-z0-9_\-]{20,}\.[A-Za-z0-9_\-]{10,}"),
    re.compile(r"Bearer\s+[A-Za-z0-9_\-\.]{20,}", re.IGNORECASE),
    # Only redact real assignments (quoted or := separated) with a long value,
    # so env-var *name* lists like "OPENAI_API_KEY GEMINI_API_KEY" survive.
    re.compile(r"(?i)(api[_-]?key|access[_-]?token|auth[_-]?token|client[_-]?secret|password|passwd)"
               r"[\"\']?\s*[:=]\s*[\"\']?([A-Za-z0-9_\-]{24,})"),
]
REDACTED = "<REDACTED>"


def redact(text: str) -> str:
    if not text:
        return text
    out = text
    for pat in SECRET_PATTERNS:
        if pat.groups:
            out = pat.sub(lambda m: m.group(0).replace(m.group(2), REDACTED), out)
        else:
            out = pat.sub(REDACTED, out)
    return out


def redact_obj(obj):
    """Recursively redact secrets in a parsed event value.

    Redacting before JSON serialization matters: serialization turns a newline
    into the two characters ``\\n``, so a token that follows a line break ends
    up preceded by a letter and a leading ``\\b`` boundary no longer matches.
    """
    if isinstance(obj, str):
        return redact(obj)
    if isinstance(obj, dict):
        return {k: redact_obj(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [redact_obj(v) for v in obj]
    return obj


REQUEST_INTERVAL = float(os.environ.get("OH_EXPORT_INTERVAL", "1.0"))
_last_call = [0.0]


def _throttle() -> None:
    wait = REQUEST_INTERVAL - (time.time() - _last_call[0])
    if wait > 0:
        time.sleep(wait)


def _backoff(exc, attempt, label):
    ra = exc.headers.get("Retry-After") if getattr(exc, "headers", None) else None
    delay = float(ra) if (ra and ra.replace('.', '', 1).isdigit()) else 0
    delay = max(delay, min(45, 4 * (attempt + 1)))
    print(f"  429 {label}; sleep {delay:.0f}s", file=sys.stderr)
    time.sleep(delay)


def api_get_json(path: str, token: str, retries: int = 8):
    url = path if path.startswith("http") else f"{API}{path}"
    last = None
    for attempt in range(retries):
        _throttle()
        req = urllib.request.Request(
            url, headers={"Authorization": f"Bearer {token}", "Accept": "application/json"})
        try:
            with urllib.request.urlopen(req, timeout=120) as resp:
                _last_call[0] = time.time()
                return json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as exc:
            last = exc
            if exc.code == 429:
                _backoff(exc, attempt, "json")
                continue
            if exc.code in (500, 502, 503, 504):
                time.sleep(min(30, 2 ** attempt))
                continue
            raise
        except Exception as exc:
            last = exc
            time.sleep(min(30, 2 ** attempt))
    raise RuntimeError(f"GET failed for {url}: {last}")


def api_get_bytes(path: str, token: str, retries: int = 8) -> bytes:
    url = path if path.startswith("http") else f"{API}{path}"
    last = None
    for attempt in range(retries):
        _throttle()
        req = urllib.request.Request(url, headers={"Authorization": f"Bearer {token}"})
        try:
            with urllib.request.urlopen(req, timeout=300) as resp:
                _last_call[0] = time.time()
                return resp.read()
        except urllib.error.HTTPError as exc:
            last = exc
            if exc.code == 429:
                _backoff(exc, attempt, "zip")
                continue
            if exc.code in (500, 502, 503, 504):
                time.sleep(min(30, 2 ** attempt))
                continue
            raise
        except Exception as exc:
            last = exc
            time.sleep(min(30, 2 ** attempt))
    raise RuntimeError(f"GET failed for {url}: {last}")


def list_conversations(token: str) -> list:
    found = {}
    for page in range(1, 40):
        data = api_get_json(f"/app-conversations/search?limit=100&page_id={page}", token)
        items = data.get("items", data) if isinstance(data, dict) else data
        if not items:
            break
        for it in items:
            found[it["id"]] = it
        if len(items) < 100:
            break
    return list(found.values())


def events_from_zip(token: str, cid: str) -> list:
    """One download -> every event. Preferred path."""
    blob = api_get_bytes(f"/app-conversations/{cid}/download", token)
    zf = zipfile.ZipFile(io.BytesIO(blob))
    events = []
    for name in zf.namelist():
        if not name.startswith("event_") or not name.endswith(".json"):
            continue
        try:
            events.append(json.loads(zf.read(name).decode("utf-8")))
        except Exception:
            continue
    events.sort(key=lambda e: e.get("timestamp", ""))
    return events


def events_from_search(token: str, cid: str) -> list:
    """Fallback: paginated events/search."""
    events, seen, page = [], set(), 1
    while page < 500:
        data = api_get_json(f"/conversation/{cid}/events/search?limit=100&page_id={page}", token)
        items = data.get("items", data) if isinstance(data, dict) else data
        if not items:
            break
        for e in items:
            eid = e.get("id")
            if eid and eid not in seen:
                seen.add(eid)
                events.append(e)
        if len(items) < 100:
            break
        page += 1
    events.sort(key=lambda e: e.get("timestamp", ""))
    return events


def content_text(msg) -> str:
    if msg is None:
        return ""
    if isinstance(msg, str):
        return msg
    if isinstance(msg, list):
        parts = []
        for x in msg:
            if isinstance(x, dict):
                if x.get("type") == "text" or "text" in x:
                    parts.append(x.get("text", ""))
                elif x.get("type") == "image_url":
                    parts.append("[image attachment]")
            else:
                parts.append(str(x))
        return "\n".join(p for p in parts if p)
    if isinstance(msg, dict):
        c = msg.get("content")
        if isinstance(c, list):
            parts = []
            for x in c:
                if isinstance(x, dict):
                    if x.get("type") == "text" or "text" in x:
                        parts.append(x.get("text", ""))
                    elif x.get("type") == "image_url":
                        parts.append("[image attachment]")
                else:
                    parts.append(str(x))
            return "\n".join(p for p in parts if p)
        return str(c or "")
    return ""


def render_event(e: dict) -> str:
    kind, source, ts = e.get("kind", "?"), e.get("source", "?"), e.get("timestamp", "")

    if kind == "MessageEvent":
        body = content_text(e.get("message") or e.get("llm_message") or {})
        if not body:
            return ""
        return f"### {source} — {ts}\n\n{redact(body)}\n"

    if kind == "ActionEvent":
        tool = e.get("tool_name", "?")
        action = e.get("action") or {}
        detail = ""
        if isinstance(action, dict):
            if tool == "terminal":
                detail = action.get("command", "")
            elif tool == "file_editor":
                detail = f"{action.get('command','')} {action.get('path','')}"
            else:
                detail = json.dumps(action, ensure_ascii=False)[:4000]
        thought = content_text(e.get("thought"))
        block = f"#### [tool] {tool} — {ts}\n\n"
        if thought:
            block += f"*reasoning:* {redact(thought)[:1500]}\n\n"
        if detail:
            block += f"```\n{redact(str(detail))[:6000]}\n```\n"
        return block

    if kind == "ObservationEvent":
        tool = e.get("tool_name", "?")
        obs = e.get("observation") or {}
        out = ""
        if isinstance(obs, dict):
            out = content_text(obs) or obs.get("stdout") or obs.get("text") or ""
            if not out and "exit_code" in obs:
                out = f"(exit_code={obs.get('exit_code')})"
        elif isinstance(obs, str):
            out = obs
        if not out:
            return ""
        return f"#### [result] {tool} — {ts}\n\n```\n{redact(str(out))[:6000]}\n```\n"

    if kind == "SystemPromptEvent":
        return ""
    if kind == "ConversationStateUpdateEvent":
        key = e.get("key", "")
        if key in ("execution_status", "sandbox_status", "title", "last_error"):
            return f"<!-- state {key}={e.get('value')} @ {ts} -->\n"
    return ""


def slugify(text: str, limit: int = 60) -> str:
    s = re.sub(r"[^a-zA-Z0-9\u0600-\u06FF]+", "-", text or "").strip("-").lower()
    return (s[:limit] or "untitled").strip("-")


def conversation_transcript(token: str, conv: dict):
    cid = conv["id"]
    method = "trajectory download"
    try:
        events = events_from_zip(token, cid)
        if not events:
            raise RuntimeError("zip contained no events")
    except Exception as exc:
        print(f"  zip failed ({exc}); falling back to events/search", file=sys.stderr)
        events = events_from_search(token, cid)
        method = "events/search (paginated)"

    title = conv.get("title") or f"Conversation {cid}"
    created, updated = conv.get("created_at", ""), conv.get("updated_at", "")
    messages = [e for e in events if e.get("kind") == "MessageEvent"]
    user_msgs = [e for e in messages if e.get("source") == "user"]
    asst_msgs = [e for e in messages if e.get("source") in ("assistant", "agent")]

    lines = [
        "<!-- GENERATED FILE - do not edit by hand. -->",
        f"# {title}",
        "",
        "| field | value |",
        "|---|---|",
        "| source_app | OpenHands Cloud |",
        f"| conversation_id | `{cid}` |",
        f"| repository | `{conv.get('selected_repository')}` |",
        f"| branch | `{conv.get('selected_branch')}` |",
        f"| created_at | {created} |",
        f"| updated_at | {updated} |",
        f"| total_events | {len(events)} |",
        f"| message_events | {len(messages)} (user {len(user_msgs)} / assistant {len(asst_msgs)}) |",
        f"| export_method | {method} |",
        f"| exported_at | {datetime.now(timezone.utc).isoformat()} |",
        f"| completeness | VERBATIM_COMPLETE (all {len(events)} reachable events) |",
        "",
        "> Verbatim export. Secrets are redacted as `<REDACTED>`. Message text is",
        "> preserved; tool arguments and outputs are truncated per event at 6000 chars.",
        "",
        "---",
        "",
    ]
    body = "\n".join(r for r in (render_event(e) for e in events) if r)
    lines.append(body if body.strip() else "_No renderable message content._")

    meta = {
        "conversation_id": cid, "title": title,
        "repository": conv.get("selected_repository"),
        "branch": conv.get("selected_branch"),
        "created_at": created, "updated_at": updated,
        "total_events": len(events), "message_events": len(messages),
        "user_messages": len(user_msgs), "assistant_messages": len(asst_msgs),
        "export_method": method,
        "completeness": "VERBATIM_COMPLETE", "slug": slugify(title),
    }
    return "\n".join(lines) + "\n", meta


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default="docs/openhands-archive")
    ap.add_argument("--only", default="")
    ap.add_argument("--force", action="store_true", help="re-export complete conversations")
    args = ap.parse_args()

    token = os.environ.get("OPENHANDS_API_KEY") or os.environ.get("OPENHANDS_CLOUD_API_KEY")
    if not token:
        print("ERROR: set OPENHANDS_API_KEY", file=sys.stderr)
        return 2

    tdir = os.path.join(args.out, "transcripts", "openhands")
    os.makedirs(tdir, exist_ok=True)

    convs = list_conversations(token)
    if args.only:
        wanted = {c.strip() for c in args.only.split(",") if c.strip()}
        convs = [c for c in convs if c["id"] in wanted]
    convs.sort(key=lambda c: c.get("created_at", ""))

    manifest, already = [], set()
    mpath = os.path.join(args.out, "MANIFEST.json")
    if os.path.exists(mpath) and not args.force:
        try:
            prev = json.load(open(mpath, encoding="utf-8"))
            for c in prev.get("conversations", []):
                if c.get("completeness") == "VERBATIM_COMPLETE":
                    already.add(c["conversation_id"])
                    manifest.append(c)
        except Exception:
            manifest, already = [], set()

    for conv in convs:
        cid = conv["id"]
        if cid in already:
            continue
        print(f"-> {cid[:8]} {str(conv.get('title',''))[:50]}", file=sys.stderr)
        try:
            text, meta = conversation_transcript(token, conv)
        except Exception as exc:
            print(f"FAILED {cid}: {exc}", file=sys.stderr)
            manifest.append({"conversation_id": cid, "completeness": "SOURCE_UNAVAILABLE",
                             "title": conv.get("title"),
                             "repository": conv.get("selected_repository"),
                             "created_at": conv.get("created_at"),
                             "error": str(exc)[:300]})
            continue
        date = (meta["created_at"] or "")[:10]
        fname = f"{date}-{cid[:8]}-{meta['slug']}.md"
        meta["transcript_path"] = f"transcripts/openhands/{fname}"
        with open(os.path.join(tdir, fname), "w", encoding="utf-8") as fh:
            fh.write(text)
        manifest.append(meta)
        print(f"OK {cid[:8]} {meta['total_events']:>5} events -> {fname}")

    with open(mpath, "w", encoding="utf-8") as fh:
        json.dump({"source_app": "OpenHands Cloud",
                   "exported_at": datetime.now(timezone.utc).isoformat(),
                   "conversation_count": len(manifest),
                   "conversations": manifest}, fh, ensure_ascii=False, indent=2)
    done = len([c for c in manifest if c.get("completeness") == "VERBATIM_COMPLETE"])
    print(f"\nWrote {len(manifest)} records ({done} complete) to {tdir}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
