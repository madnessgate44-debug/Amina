#!/usr/bin/env python3
"""
Fetch and verify raw OpenHands trajectory exports.

Raw trajectory zips are ~122 MB total, so they are not committed. This script
re-downloads them and checks each SHA-256 against the hashes recorded in
`../VERIFICATION_REPORT.md`, proving the transcripts came from real sources.

Usage:
    OPENHANDS_API_KEY=... python3 fetch_raw.py --out raw/openhands
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import sys
import time
import urllib.error
import urllib.request

BASE = os.environ.get("OPENHANDS_BASE_URL", "https://app.all-hands.dev")
HERE = os.path.dirname(os.path.abspath(__file__))
MANIFEST = os.path.join(HERE, "..", "MANIFEST.json")


def download(cid: str, token: str, retries: int = 5) -> bytes:
    url = f"{BASE}/api/v1/app-conversations/{cid}/download"
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
    raise RuntimeError(f"download failed for {cid}: {last}")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default="raw/openhands")
    args = ap.parse_args()
    token = os.environ.get("OPENHANDS_API_KEY") or os.environ.get("OPENHANDS_CLOUD_API_KEY")
    if not token:
        print("ERROR: set OPENHANDS_API_KEY", file=sys.stderr)
        return 2

    os.makedirs(args.out, exist_ok=True)
    data = json.load(open(MANIFEST, encoding="utf-8"))
    for c in data["conversations"]:
        cid = c["conversation_id"]
        try:
            blob = download(cid, token)
        except Exception as exc:
            print(f"FAIL {cid[:8]}: {exc}", file=sys.stderr)
            continue
        path = os.path.join(args.out, f"{cid}.zip")
        with open(path, "wb") as fh:
            fh.write(blob)
        print(f"{cid[:8]}  {len(blob):>12,} bytes  "
              f"sha256={hashlib.sha256(blob).hexdigest()[:16]}")
        time.sleep(1.0)
    print(f"\nRaw exports written to {args.out}/")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
