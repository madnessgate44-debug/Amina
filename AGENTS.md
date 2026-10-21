# Amina — repository notes for agents

## Running the app locally
- Dev server: `PORT=12000 npx tsx server.ts` (Express serves the Vite app + AI API).
- Work host in this sandbox: `https://work-1-xplvxvupzdnrwwrz.prod-runtime.all-hands.dev/`
  (`vite.config.ts` must keep `server.allowedHosts` set or the host is blocked).
- Verify with: `npx tsc --noEmit`, `npm test`, `npm run build`.

## AI provider: use the REST API, not the @google/genai SDK
Google now issues `AQ.`-prefixed authentication keys. The `@google/genai` SDK
misclassifies those as OAuth access tokens and returns
`403 ACCESS_TOKEN_SCOPE_INSUFFICIENT`, while the same key works over REST.
`server.ts` therefore calls the Gemini REST API directly with the key in the
`x-goog-api-key` header (works for both `AIza` and `AQ.` keys).

- API key env names accepted, in order: `GEMINI_API_KEY`, `GOOGLE_API_KEY`,
  `GOOGLE_GENAI_API_KEY`, `API_KEY`. `.env` is gitignored (`.gitignore` `.env*`).
- REST payload shape: `contents` at top level, `systemInstruction` at top level,
  and everything else (temperature, responseMimeType, speechConfig, ...) nested
  under `generationConfig`. Do not flatten these.
- Text models fall back automatically (`gemini-2.5-flash` -> `gemini-3.5-flash`)
  on 503/429/500. TTS/image models are never substituted for text models.
  `gemini-3.8-flash` is frequently overloaded with 503 — do not make it the default.
- Health: `GET /api/health` returns `hasApiKey` and `apiKeySource`.

## Curriculum truthfulness (non-negotiable)
- Never fabricate lessons, coverage, resources, or links. The Forge order doc
  (`docs/AMINA_PROJECT_MEMORY_AND_FORGE_ORDERS.md`) forbids it.
- Coverage counts only real content: `curriculumService.getCoverageReport()`.
- `buildSupplementaryReference()` returns `null` when no real resource exists.
- `getLessonResourceUrl()` links only to whitelisted official portals
  (`CurriculumService.RESOURCE_PORTALS`); integrity tests E.9–E.11 guard this.
- The curriculum is currently a partial skeleton (36 lessons across 9 subjects).
  Completing it requires real textbook content supplied by the owner.

## Curriculum ingestion pipeline (in-repo at `tools/curriculum/`)
Source of ministry books: `https://edu2-egypt.com/grade-5` (Grade 5 student books) and
`/curriculum-frameworks` (official CCIMD frameworks). Links are Google Drive files.

**Current work state, uncommitted diffs, and next actions: `docs/AMINA_HANDOFF.md`.**
Read that file before picking up work.

- `toc.py` — **preferred** structure extraction. Deterministic, offline, zero API calls.
  Handles four layouts: A dot-leader, B title-then-number, C title-leader,
  D two-column Arabic. CLI: `python3 tools/curriculum/toc.py <book.pdf>`.
- `fetch.py` — Drive downloader that handles the >100 MB virus-scan interstitial
  (parse the `download-form`, resubmit). Plain `uc?export=download` returns HTML
  for files over ~100 MB.
- `pipeline.py` — student books -> `books/<id>/pages/NNNN.webp` (1500px, WebP q82)
  + `manifest.json` with per-page sizes and `units` from `toc.py`.
- `teacher.py` — teacher guides + frameworks -> `teacher/<id>/text.jsonl` + manifest.
- Gemini vision (`gemini-2.5-flash`, `x-goog-api-key`) is a **last-resort fallback**
  only. `toc.py` replaced it for structure extraction and needs no quota.
- PDF text layers for Arabic body text are usable after NFKC + diacritic stripping,
  but still have gaps (e.g. "بإط ااق" for "بإطلاق"), so page images remain the
  source of truth for the student reader.

Paths are configurable: `AMINA_BOOKS_DIR`, `AMINA_TEACHER_DIR`, `AMINA_ENV_FILE`,
or `GEMINI_API_KEY` in the environment.

### Two resource classes (product decision)
1. **Student resources** — ministry textbooks; the student reads them (Library reader).
2. **Teacher resources** — teacher guides, assessments, and CCIMD curriculum
   frameworks; these ground how Miss Nour teaches (not shown to the student).

### French-track gap
Amina is at École Girard (French track): Math and Science are taught in French.
Egyptian ministry books exist in AR and EN only — no French editions. The AR/EN
books supply structure and pedagogy; the French editions must be sourced
separately (the school, or a French publisher).

## Product identity
- The product is **Amina**, a Personal AI School Companion. **Miss Nour** is the
  AI teacher and the front door to learning (doc §2). Nav tabs: HOME | FEED |
  LIBRARY | NOUR.
- `src/components/companion/CompanionChatScreen.tsx` is **dead code** (never
  rendered) and `/api/chat` is not called by the live UI. The live Nour flows are
  `/api/tutor-explain`, `/api/tutor-reply`, `/api/tts`, `/api/stt`,
  `/api/check-homework`, `/api/reconstruct-day`, rendered by
  `VirtualTeacherClassroom` (tab `companion`).
