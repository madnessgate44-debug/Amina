# Amina — Agent Handoff / Current Work State

**Purpose:** a new agent (Cloud or any other) can read this file alone and know exactly
where the work stands, what was verified, what is uncommitted, and what to do next.
Update it at the end of every working session.

**Last updated:** 2026-10-21
**Repository:** `madnessgate44-debug/Amina`
**Branch:** `main` (shallow clone; HEAD `86c1e73`)
**Work order:** `docs/AMINA_PROJECT_MEMORY_AND_FORGE_ORDERS.md`
**Audit result:** `docs/AMINA_READINESS_AUDIT.md`

---

## 1. Where things stand in one paragraph

The learning engine is real and tested, the FEED requirement is met, and textbooks now
carry real chapter indexes. The app is **not yet sellable** for exactly two reasons:
there is **nothing to buy** (no price, checkout, entitlement, or licence gate) and
**progress never leaves the child's browser** (everything is in IndexedDB, so a
reinstall wipes it and no second device can see it). Neither is a bug; both are product
decisions the owner must make. Everything else is depth, polish, or running a deploy.

---

## 2. READ THIS FIRST — uncommitted state

**Nothing below is committed.** The working tree has 35 modified/untracked entries on
`main`. A new agent will not see any of this work until it is committed and pushed.
Do not assume the remote `main` reflects what is described here.

```
git status --short | wc -l   # => 35
git log --oneline -1         # => 86c1e73 (grafted) Merge pull request #5
```

Notable untracked files:

| Path | What it is |
|------|-----------|
| `AGENTS.md` | Repo notes for agents (already existed; **now stale**, see §7) |
| `docs/AMINA_READINESS_AUDIT.md` | Requirements-to-evidence matrix (the audit deliverable) |
| `src/components/curriculum/BookReader.tsx` | Book reader + chapter drawer |
| `src/services/content/bookLibrary.ts` | On-demand book fetch / offline cache |
| `src/services/curriculum/subjectIdentity.ts` | Subject identity helper |
| `src/utils/studentAddress.ts` | Student address helper |
| `tools/curriculum/*.py` | The curriculum ingestion pipeline (see §4) |

---

## 3. What this session verified and fixed

### Verified working (with evidence)

| Item | Evidence |
|------|----------|
| Type check clean | `npx tsc --noEmit` → exit 0 |
| Test suite | `npm test` → adaptive + teaching + integrity + phase9 suites pass; **7/7 proving lessons** pass full end-to-end; resumability and explain-it-back rejection verified |
| API key live | `GET /api/health` → `{"status":"ok","hasApiKey":true,"apiKeySource":"GEMINI_API_KEY"}` |
| Tutor returns real replies | `POST /api/tutor-reply` returns a genuine Arabic response |
| All 9 source books parse | `python3 toc.py <pdf>` for each book; see §5 |
| Chapter drawer works in the browser | Opened Science AR → drew real lessons → clicked one → jumped to page 50/240 |

### Fixed this session

1. **Arabic textbook chapter index (`toc.py` Layout D).** The Arabic Language books were
   the only books with no table of contents. Added a coordinate-aware two-column parser
   (`_parse_two_column`, `_looks_two_column`) that clusters words into rows by y-position,
   separates the page-number band from the title band, and reads words in
   content-stream order (which yields logical Arabic right-to-left order).
2. **Page-offset bug.** Offset detection was off by one for books whose printed page 1 is
   the file's first page. Corrected to 1-based: `diffs[(i + 1) - n]` and
   `resolved = printed - 1 + offset`.
3. **Chapter drawer in the reader.** `BookReader.tsx` gained an الفهرس (Contents) button
   and drawer listing real units/lessons that jump to the lesson page.
4. **Backfilled two manifests.** `arabic-g5-t1` (30 entries) and `arabic-g5-t2` (24) had
   `units: []`. All 7 rendered books now report `unitCount >= 1`.
5. **Corrections to the audit.** Three previously-reported blockers were wrong and are
   now marked as such in `docs/AMINA_READINESS_AUDIT.md`:
   - Deployment **does** exist (`Dockerfile`, `.github/workflows/ci.yml`,
     `deploy-pages.yml`, `render.yaml`).
   - `AMINA5` / `Amina` is **not a real key name** anywhere in the repo. The tutor runs on
     a standard `GEMINI_API_KEY`. If `AMINA5` was meant as an alias, that is an owner
     naming decision, not a bug.
   - The Arabic chapter-index gap is **resolved** (items 1–4 above).

---

## 4. Curriculum pipeline — where the code lives now

The ingestion tooling used to live only at `/workspace/amina_curriculum`, which is
**not a git repository** — so none of it was visible to anyone else. It has been copied
into this repo at **`tools/curriculum/`**:

| File | Role |
|------|------|
| `toc.py` | **Deterministic** table-of-contents parser. Four layouts: A dot-leader, B title-then-number, C title-leader, D two-column Arabic. No API calls. This is the important one. |
| `pipeline.py` | Student books → `books/<id>/pages/NNNN.webp` + `manifest.json` with structure |
| `convert.py` | Renders a single PDF into a book directory |
| `teacher.py` | Teacher guides + frameworks → Nour's knowledge base |
| `fetch.py` | Google Drive downloader (handles the >100 MB virus-scan interstitial) |
| `analyze.py`, `extract_toc.py`, `sweep.py` | Analysis / debugging helpers |

Paths were parameterized so the tooling runs from anywhere:
`AMINA_BOOKS_DIR`, `AMINA_TEACHER_DIR`, `AMINA_ENV_FILE`, or `GEMINI_API_KEY` in the
environment. All eight modules compile (`python3 -m py_compile`).

`toc.py` is self-contained and has a CLI:

```bash
python3 tools/curriculum/toc.py /path/to/book.pdf
```

### What is deliberately NOT in the repo

| Artifact | Size | Why excluded |
|----------|------|--------------|
| Source PDFs | 5.0 GB | Too large; re-fetch with `fetch.py` |
| Rendered books (`content/curriculum/`) | 237 MB | Generated; regenerate with `pipeline.py`. Now gitignored |
| Frameworks | 98 MB | Regenerate |
| Teacher extracts | 13 MB | Regenerate |

`content/curriculum/books` is a **symlink** into the external pipeline output, which is
why `du -sh content/curriculum` reports ~4 KB. Git will not follow it; that is intended.

---

## 5. Verified parse results (all 9 source books, offline, zero API calls)

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

### Rendered books currently served (7)

`arabic-g5-t1` (192p), `arabic-g5-t2` (144p), `math-g5-t1-ar` (256p),
`science-g5-t1-ar` (240p), `science-g5-t1-en` (244p), `science-g5-t2-ar` (206p),
`science-g5-t2-en` (210p). Verify with:

```bash
curl -s localhost:12000/api/curriculum/index
```

---

## 6. What still blocks "sellable"

Ordered by impact. The first two are the difference between an app and a product.

1. **Nothing to buy (Critical).** No price, checkout, subscription, entitlement, or
   licence gate exists anywhere. A parent dashboard *does* exist
   (`src/types/parent.ts`, `src/services/parent/parentService.ts`,
   `src/components/parent/ParentDashboardModal.tsx`) — a parent can view progress but
   cannot purchase access. **Needs an owner business-model decision first.**
2. **Progress cannot leave the device (Critical).** All state is IndexedDB
   (`src/services/storage/IndexedDBStorageService.ts`). Add a server-side student/progress
   store. `render.yaml` already targets Render, so that is the cheapest path.
3. **Content depth (High).** 7 of 9 subjects have rendered books. Missing: French,
   English, Social Studies, ICT, Islamic Education. Add the source PDFs and run
   `pipeline.py`.
4. **Day-one review queue (Medium).** Spaced review seeds from history only, so a fresh
   install has no review items. Seed first-review timing from completed lessons.
5. **Live deploy (Low).** Config is complete but nothing is known to be deployed.
   Needs the owner to run a real deploy.

Full matrix with requirement IDs R1–R25:
`docs/AMINA_READINESS_AUDIT.md`.

---

## 7. Known stale / incorrect documentation

`AGENTS.md` currently says to use **Gemini vision** for Arabic TOC pages and that raw
PDF text extraction is unreliable. **That is now out of date.** `toc.py` parses Arabic
TOC pages deterministically, offline, with no API calls, and it is the preferred path.
Vision remains a last-resort fallback only. Update `AGENTS.md` before relying on it.

---

## 8. Next actions for the next agent

1. **Commit and push the current work.** It is all uncommitted on `main`. The work order
   (§Phase B item 11) asks for a dedicated branch and a reviewable PR. There are ~28
   other modified files in the tree; separate them from this session's changes so the
   diff is reviewable.
2. **Ask the owner for the two product decisions** in §6 items 1–2 before building
   billing or persistence. Do not guess a business model.
3. **Add the missing source PDFs** (French, English, Social Studies, ICT, Islamic Ed) and
   run `tools/curriculum/pipeline.py` to close the content-depth gap.
4. **Fix the stale `AGENTS.md`** section described in §7.
5. Do **not** merge or deploy without explicit owner approval.

---

## 9. How to run and verify

```bash
# Dev server (serves the Vite app + AI API)
PORT=12000 npx tsx server.ts

# Checks
npx tsc --noEmit
npm test
npm run build

# Curriculum checks
python3 tools/curriculum/toc.py /path/to/book.pdf
curl -s localhost:12000/api/curriculum/index
curl -s localhost:12000/api/health
```

Work host in this sandbox:
`https://work-1-xplvxvupzdnrwwrz.prod-runtime.all-hands.dev/`
(`vite.config.ts` must keep `server.allowedHosts` set, or the host is blocked.)
