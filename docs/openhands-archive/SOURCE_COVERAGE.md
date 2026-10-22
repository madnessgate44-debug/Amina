# Source Coverage — OpenHands Chat-Hub Export

**Export timestamp (UTC):** `2026-10-22T10:28:59Z`

## Method

1. Enumerated all conversations via `GET /api/v1/app-conversations/search` on the OpenHands Cloud API (`https://app.all-hands.dev`) using the account's API key.
2. For each conversation ID, retrieved the full recorded event stream via `GET /api/v1/conversation/{id}/events/search` (paginated, `limit=100`, followed `next_page_id` to exhaustion).
3. Stored the untouched response as gzip-compressed JSON under `raw/openhands-cloud/<id>.events.json.gz`.
4. Rendered a readable, ordered transcript under `transcripts/openhands-cloud/openhands-<id>.md`, preserving role, order, timestamps, event IDs, tool names, tool arguments, tool observations, reasoning content, and system prompts.
5. Applied secret redaction to the readable render only (raw JSON is left untouched, exactly as the API returned it, including the API's own `**********` masking of credentials).

## Coverage by source

| Source | Enumerable? | Exported? | Coverage | Notes |
|---|---|---|---|---|
| OpenHands Cloud (this account) | Yes — API | Yes | **24/24 conversations** | Complete enumeration; no further pages. |
| OpenHands Cloud (other accounts/orgs) | Not from this credential | No | 0 | Would need separate credentials/authorization. |
| Local runtime session logs | N/A | No | — | The sandbox holds no prior-session logs; history lives in the cloud API. |
| ChatGPT | No — no export tool exposed | No | 0 complete | Requires official ChatGPT account data export. |
| GitHub issues / PR comments | Yes — API | Partial | PR #7 (3 comments) | Other threads not exhaustively swept. |
| Other connected apps | Unknown | No | 0 | Not inventoried by this pass. |

## Counts

- Conversations discovered: **24**
- Conversations exported: **24**
- Events exported: **32977**
- MessageEvents exported: **507** (user 314 / assistant 193)
- Tool ActionEvents exported: **9573**
- `VERBATIM_COMPLETE`: **20**
- `VERBATIM_PARTIAL` (still running at export): **4**
- Inaccessible: **0** — every conversation in the list returned its event stream.

## Per-conversation verification

| Conversation ID | Events | Msgs | Raw SHA-256 | Raw bytes (gz) | Status |
|---|---:|---:|---|---:|---|
| `0b53fb8a302848898effb4b87f8d5774` | 226 | 2 | `092b626b5143d781…` | 591748 | `VERBATIM_COMPLETE` |
| `59eb12e8f97547449519fcd6bdb7ed20` | 187 | 2 | `95f05ff73d654cda…` | 523318 | `VERBATIM_COMPLETE` |
| `5612bd51a7564219b069dc1ebe4dd0f4` | 135 | 2 | `f845f9ec2f9bdaad…` | 512055 | `VERBATIM_COMPLETE` |
| `ff7b917f8f0b466ba557f01945a79fbe` | 165 | 2 | `005960a99c97ac64…` | 527553 | `VERBATIM_COMPLETE` |
| `3df8d9826c5542b8aa9efce877ad3f1b` | 148 | 2 | `6be883b2a4df3b51…` | 555084 | `VERBATIM_COMPLETE` |
| `aa7dd27bd6bf4996820a79c5ce14db6e` | 141 | 2 | `f5ff98c0a920b12f…` | 537834 | `VERBATIM_COMPLETE` |
| `807d545c379e4eb38e02a695587328f1` | 128 | 2 | `d8550bbafdd572fd…` | 546461 | `VERBATIM_COMPLETE` |
| `319cdf69ecbb45b8a1c267edba0cdf7c` | 135 | 2 | `14e1360ff7cc7962…` | 525958 | `VERBATIM_COMPLETE` |
| `f992c925e6444e3181d2796ecacc1591` | 150 | 1 | `d5677fe48e2efa09…` | 516446 | `VERBATIM_COMPLETE` |
| `8f0765bd42544025bfca64ad23e663fe` | 4100 | 107 | `a1c6d07ab467da8d…` | 16197185 | `VERBATIM_COMPLETE` |
| `c1ff545e46e443d1a65f0f774fdb523c` | 127 | 2 | `418519b8e4d5c11e…` | 433463 | `VERBATIM_COMPLETE` |
| `13ba118db5e9455a8fac654e3ba53730` | 9 | 2 | `e6c0ea0175d98662…` | 14225 | `VERBATIM_COMPLETE` |
| `db0c07a7e4604daab9b8565ebc37fdce` | 6677 | 167 | `03612420231871b5…` | 27166768 | `VERBATIM_COMPLETE` |
| `d3bba29a861d4126862a5bda7ad77aec` | 16 | 2 | `31b7cac2ce8c4365…` | 549216 | `VERBATIM_COMPLETE` |
| `43bfdf2b750d47b6b896afd567218bb9` | 3670 | 44 | `beee31c227392948…` | 10987437 | `VERBATIM_COMPLETE` |
| `0a1a3e39a8724c4782569a2ef395580b` | 605 | 27 | `fb520d47db8c1dba…` | 2951707 | `VERBATIM_COMPLETE` |
| `8e7ac5344f0948fc8b9f0b68599647a0` | 200 | 2 | `f0d8bbfa4c8bfd85…` | 513925 | `VERBATIM_COMPLETE` |
| `4c8d052277f44e8ba02c8131e4d42ba4` | 1225 | 32 | `02406edc7fe33da1…` | 4398583 | `VERBATIM_COMPLETE` |
| `38a3b41f4302467197d375a026fe3c30` | 7625 | 87 | `25eda36d76e23411…` | 17340438 | `VERBATIM_COMPLETE` |
| `94cd4b3331a74ac9b731965330ca5186` | 6534 | 13 | `173b7ef528b91193…` | 8184284 | `VERBATIM_PARTIAL` |
| `90d3f13ea700425681b643bc56c776ce` | 207 | 2 | `dcd14eeb493d5a57…` | 491960 | `VERBATIM_COMPLETE` |
| `c315f0b0f03a4a0ba7751954f2ebf63a` | 250 | 1 | `739974a1508fad5d…` | 564608 | `VERBATIM_PARTIAL` |
| `296b0ce0a1f34183ac8244418ca253fd` | 230 | 1 | `563fdef66ac83bd8…` | 490652 | `VERBATIM_PARTIAL` |
| `8db6375184834040bc49dabfae41e8ad` | 87 | 1 | `e61889b23fb2fb05…` | 426891 | `VERBATIM_PARTIAL` |

