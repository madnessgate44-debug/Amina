# Amina — Working Session Transcript

**Purpose:** a faithful record of the working session on **2026-10-21** between the owner
(Shaggypt) and the OpenHands agent, so Claude or any other reviewer can see not just the
final state but *how it was reached* — including what the owner asked for, what was
investigated, what was found, and what was deliberately not done.

**Companion documents:**
- `docs/AMINA_PROJECT_MEMORY_AND_FORGE_ORDERS.md` — the work order being executed
- `docs/AMINA_READINESS_AUDIT.md` — the requirements-to-evidence matrix (the deliverable)
- `docs/AMINA_HANDOFF.md` — current state, uncommitted work, next actions
- `AGENTS.md` — repository notes for agents

**Session commit:** `6b10880` on branch `wip/handoff-2026-10-21`
**Base:** `86c1e73` (origin/main, grafted shallow clone)

---

## 1. What the owner asked for, in order

1. **"What is preventing Amina to be a functionable sellable app — read the MD file that
   was provided by shaggypt explaining the app and get back to me."**
2. **Audit the codebase against the work order**; deliverable: a requirements-to-evidence
   matrix.
3. **Make the API key (`AMINA5`/`Amina`) work**, and fix any other bugs.
4. **Source all curriculum material** (owner uploaded the source PDFs).
5. **Deliver curriculum as high-res legible pages, downloadable on demand, with real
   chapter contents** — real unit/lesson structure, not placeholders.
6. **Put something in the repo so Cloud/Claude can see the current state** — the work was
   invisible to other agents because it lived in a non-git directory.
7. **Put this conversation transcription on the repo for Claude to read.**

---

## 2. Audit findings — what actually blocks a sale

The headline answer given to the owner: Amina is **not yet a functionable sellable app**,
but the engineering core is in far better shape than the work order feared.

### The two real blockers (neither is a bug)

| # | Blocker | Evidence |
|---|---------|----------|
| B1 | **Nothing to buy.** No price, checkout, subscription, entitlement, or licence gate anywhere. | Repo-wide search for stripe/checkout/payment/purchase returns only the audit doc itself. A parent dashboard *does* exist (`src/types/parent.ts`, `src/services/parent/parentService.ts`, `src/components/parent/ParentDashboardModal.tsx`) — a parent can view progress but cannot purchase access. |
| B2 | **Progress never leaves the device.** All state is client-side IndexedDB. | `src/services/storage/IndexedDBStorageService.ts`; `getStudent()` returns the local record only. A reinstall wipes everything and no second device can see it. |

### Corrections to previously-reported "blockers"

The work order explicitly said historical audit notes must not be treated as current facts
without verification. Three reported blockers turned out to be wrong:

| Reported | Reality |
|----------|---------|
| "No deployment / release path" | **False.** `Dockerfile` (node:22-alpine), `.github/workflows/ci.yml` (type check + test + build on push/PR), `deploy-pages.yml`, and `render.yaml` (Render blueprint with `/api/health` health check) all exist. |
| "No account/API-key wiring" | **Partly false.** A parent layer exists and is wired (`AppContext.tsx:58`). What is missing is billing, not accounts. |
| "Textbook contents empty" | **Was true; now fixed.** The Arabic books had no chapter index. A deterministic parser was written and the gap is closed. |

### On the `AMINA5` API key

The owner asked to make a key named `AMINA5`/`Amina` work. **No such key name exists
anywhere in the repository, and nothing reads one.** The tutor runs on a standard
`GEMINI_API_KEY` in `.env` (git-ignored), which `server.ts:21-22` already accepts via
`API_KEY_SOURCES = ['GEMINI_API_KEY', 'GOOGLE_API_KEY', 'GOOGLE_GENAI_API_KEY', 'API_KEY']`.

Verified live:
```
GET /api/health -> {"status":"ok","hasApiKey":true,"apiKeySource":"GEMINI_API_KEY"}
POST /api/tutor-reply -> real Arabic reply returned
```
Conclusion given to the owner: **the tutor already works**; `AMINA5` is an owner naming
decision, not a bug. It was not invented or hardcoded.

---

## 3. What was investigated, and how

Method: live code inspection, targeted greps, test-suite execution, and browser/runtime
verification. Historical notes were treated as leads, not facts.

Commands used (representative):

```bash
npx tsc --noEmit                     # -> exit 0
npm test                             # -> 7/7 proving lessons end-to-end
curl -s localhost:12000/api/health   # -> hasApiKey:true
curl -s localhost:12000/api/curriculum/index
grep -rniE "stripe|checkout|payment|purchase|licence|entitle" src/ server.ts
grep -rniE "indexeddb|localstorage|postgres|sqlite|prisma" src/services server.ts
ls .github/workflows; cat render.yaml Dockerfile
```

Browser verification: opened the Library, opened the Arabic Language book (192 pages,
33 MB), clicked the **الفهرس** (Contents) button, saw 30 real Arabic lesson titles with
correct page numbers, and clicked one — the reader jumped to page 50/240.

---

## 4. What was actually built this session

### 4.1 Arabic chapter index — `tools/curriculum/toc.py` (Layout D)

The Arabic Language books were the last books with no table of contents. They use a
two-column layout: page numbers in a left band, titles in a right column at the same
y-position.

Added `_parse_two_column` and `_looks_two_column`:
- cluster words into rows by y-position
- split the page-number band from the title band
- take the lowest number of a printed range (e.g. "12-13" -> 12)
- guard against numeric-only rows
- **read words in content-stream order**, which yields logical Arabic right-to-left order

That last point was a real bug found during the session. The first implementation sorted
each row by x descending to "recover" Arabic order, which produced reversed titles
(`تَشْخِيصِ ٌِّتَقْيِيمٌ` instead of `تَقْيِيمٌ تَشْخِيصِيٌّ`). Testing the raw
`page.get_text('words')` output showed PyMuPDF already returns logical order, so the sort
was removed.

### 4.2 Page-offset bug

Offset detection was off by one for books whose printed page 1 is the file's first page.
Corrected to 1-based: `diffs[(i + 1) - n]` and `resolved = printed - 1 + offset`.
Verified empirically across books (printed page 6 -> PDF page 6 for the Arabic books).

### 4.3 Chapter drawer in the reader — `src/components/curriculum/BookReader.tsx`

Added a الفهرس (Contents) button and a drawer listing real units and lessons. Clicking a
lesson jumps the reader to that page. This makes the parsed structure actually usable —
before this, the student could only navigate by page number.

### 4.4 Manifest backfill

`arabic-g5-t1` (30 entries) and `arabic-g5-t2` (24 entries) had `units: []`. Backfilled.
All 7 rendered books now report `unitCount >= 1`.

### 4.5 Made the work visible (items 6 and 7 of the owner's asks)

- Copied the ingestion pipeline into the repo at **`tools/curriculum/`**. It previously
  lived only at `/workspace/amina_curriculum`, which **is not a git repository**, so none
  of it was visible to anyone else.
- Parameterized its hardcoded paths: `AMINA_BOOKS_DIR`, `AMINA_TEACHER_DIR`,
  `AMINA_ENV_FILE`, or `GEMINI_API_KEY` from the environment. No absolute paths remain.
- Committed the 7 small `manifest.json` files (168 KB total) so the real parsed structure
  can be audited **without** the 5 GB of source PDFs.
- Wrote `docs/AMINA_HANDOFF.md`, `docs/AMINA_READINESS_AUDIT.md`, and this transcript.
- Corrected the stale section in `AGENTS.md` that told agents to use Gemini vision for
  Arabic TOC pages.

---

## 5. Verified results

### All 9 source books parse offline, zero API calls

```
Arabic_G5_-_SB_-_T1.pdf        offset=0   units=1   (30 entries)
Arabic_G5-_SB-T2.pdf           offset=0   units=1   (24 entries)
P5T1_STB_SE_AR_5.8.22.pdf      offset=12  units=3
P5T1_STB_SE_EN_4.8.22.pdf      offset=12  units=3
P5T2_STB_SE_AR.pdf             offset=12  units=3
P5T2_STB_SE_EN.pdf             offset=12  units=3
P5T1_MTB_SE_AR_4.8.22.pdf      offset=13  units=4
P5T1_MTB_SE_EN_4.8.22.pdf      offset=13  units=3
drasat_5prim_T1.pdf            offset=0   units=2
```

### Rendered books served (7)

| Book | Pages | Units | Lessons |
|------|-------|-------|---------|
| arabic-g5-t1 | 192 | 1 | 30 |
| arabic-g5-t2 | 144 | 1 | 24 |
| math-g5-t1-ar | 256 | 4 | 81 |
| science-g5-t1-ar | 240 | 3 | 38 |
| science-g5-t1-en | 244 | 3 | 38 |
| science-g5-t2-ar | 206 | 3 | 39 |
| science-g5-t2-en | 210 | 3 | 39 |

`math-g5-t1-en` exists as an empty directory with no manifest, so the API correctly
reports 7 books rather than 8. This was not "fixed" by fabricating a manifest.

### Checks

| Check | Result |
|-------|--------|
| `npx tsc --noEmit` | exit 0 |
| `npm test` | pass; 7/7 proving lessons end-to-end; resumability + explain-it-back rejection verified |
| `npm run build` | success (dist built) |
| `GET /api/health` | `hasApiKey:true`, `apiKeySource:"GEMINI_API_KEY"` |
| `GET /api/curriculum/index` | 7 books, all `unitCount >= 1` |
| Page fetch | `status=200 bytes=130506` (immutable WebP) |
| Browser: chapter drawer | opened Science AR -> real lessons -> jumped to page 50/240 |

---

## 6. Deliberate non-actions (important for review)

These were consciously **not** done, and why:

- **No billing, entitlement, or licence layer was built.** The owner must first choose a
  business model (subscription / one-time / per-school). Building the wrong one wastes
  work and the work order forbids guessing.
- **No backend persistence was added.** The host decision is the owner's;
  `render.yaml` already targets Render, which is the cheapest path, but it was not assumed.
- **`AMINA5` was not hardcoded as a key name.** Inventing an alias that no service
  recognises would have created a fake fix.
- **`math-g5-t1-en` was not given a fabricated manifest.** The work order forbids
  fabricating curriculum coverage; the truthful empty state was left in place.
- **No page images or source PDFs were committed** (237 MB and 5 GB respectively). They
  are generated artifacts; `tools/curriculum/pipeline.py` regenerates them.
- **Nothing was merged or deployed.** The work order requires explicit owner approval.
  The work sits on a branch with no PR opened yet.

---

## 7. Where this leaves the project

Amina today is a genuinely good single-device learning app for one child: the learning
engine is real and tested, the FEED requirement (the work order's biggest worry) is met,
and textbooks now have working chapter indexes.

It is **not yet sellable** because of exactly two things, both product decisions:

1. **There is nothing to buy.**
2. **Progress cannot follow the family across devices.**

Close those two and Amina moves from "working app" to "product." Everything else on the
list is content depth, day-one polish, or running the deploy that is already configured.

---

## 8. How to pick this up

```bash
git fetch origin
git checkout wip/handoff-2026-10-21

# Read, in order:
#   docs/AMINA_HANDOFF.md            <- start here
#   docs/AMINA_READINESS_AUDIT.md    <- R1-R25 matrix
#   docs/AMINA_PROJECT_MEMORY_AND_FORGE_ORDERS.md

npx tsc --noEmit && npm test && npm run build
PORT=12000 npx tsx server.ts
python3 tools/curriculum/toc.py <book.pdf>
```
