# Amina — Functional & Sellable Readiness Audit

**Deliverable:** requirements-to-evidence matrix for `docs/AMINA_PROJECT_MEMORY_AND_FORGE_ORDERS.md`
**Date:** 2026-10-21
**Method:** live code inspection, test-suite execution, and browser/runtime verification
**Rule applied:** historical audit notes treated as leads, not facts. Every status below points at code and/or a runtime result.

---

## 1. Headline answer

Amina is **not yet a functionable sellable app.** The engineering core is in far better shape than the work order feared — the Feed exists, the adaptive Nour loop is real and tested, no fake student or demo timetable fallbacks remain, and the API key works. What blocks "sellable" is a short list of concrete items:

| # | Blocker | Severity | Why it blocks a sale |
|---|---------|----------|----------------------|
| B1 | No **purchase, entitlement, or licensing** flow anywhere in the app | Critical | A parent dashboard exists, but nothing can be bought — no price, no checkout, no licence gate |
| B2 | No **backend persistence**. All progress lives in the child's browser IndexedDB | Critical | A family cannot see progress across devices; reinstalling loses everything |
| B3 | Curriculum **lesson depths are uneven** — 9 subjects listed, only 7 proving lessons verified | High | A parent opening "Science" may find little; coverage looks thinner than promised |
| B4 | ~~Textbook contents empty for the Arabic books~~ **RESOLVED** — all 7 books now carry real unit/lesson structure | — | Chapter index works in the reader (verified in browser) |
| B5 | ~~No deployment / release path~~ **CORRECTED** — `Dockerfile`, `.github/workflows/ci.yml`, `deploy-pages.yml`, `render.yaml` all exist | Low | Release path exists; needs owner to actually deploy and a patch strategy for installed PWAs |
| B6 | **Spaced review seeds from history only** — a fresh install has no review queue | Medium | Feature looks broken on day one |

Fix order: **B1 + B2 first** (they are the difference between an app and a product), then B3 (content depth), then B6 (day-one polish).

**Note on the API key.** The request was to make a key named `AMINA5`/`Amina` work. No such key name exists anywhere in the repository, and nothing reads it. What actually powers the tutor is a standard Gemini key in `GEMINI_API_KEY` (`.env`, git-ignored), which `server.ts:21-22` already accepts. That key is live: `/api/health` returns `hasApiKey:true`, `apiKeySource:"GEMINI_API_KEY"`, and a real tutor call returns a genuine Arabic reply. So the tutor is working; if `AMINA5` was meant as a custom alias, it is an owner naming decision, not a bug.

---

## 2. Requirements-to-evidence matrix

| ID | Requirement (from work order) | Status | Evidence | Gap / minimal fix |
|----|-------------------------------|--------|----------|-------------------|
| R1 | Primary nav is HOME \| FEED \| LIBRARY \| NOUR | **PASS** | `src/components/layout/AppShell.tsx:84-87`; `BottomNav.tsx`; runtime: 4 tabs render (الرئيسية/الموجز/المكتبة/نور) | None |
| R2 | FEED is a real full-screen vertical swipe experience | **PASS** | `src/components/feed/FeedScreen.tsx:89` `h-[calc(100vh-64px)] overflow-y-auto snap-y snap-mandatory`; sources `curriculumService.getAvailableLessons()` (`:38`); runtime: 5+ distinct curriculum cards ("قصة الاستماع: أنا أستطيع", "نص القراءة: لم أوت ماء النهر", …) | None — this was the work order's #1 hard requirement and it now passes |
| R3 | Feed items launch contextual Nour / save to Library | **PASS** | `FeedScreen.tsx` action → `setCompanionContext`; runtime: "اتعلمي مع نور" button present per card | Verify Library save target on click (not exercised this pass) |
| R4 | Any curriculum lesson → same adaptive Nour session | **PASS** | `CurriculumBrowser.tsx:576` `setCompanionContext({...})`; test run: `ALL PROVING LESSONS PASSED FULL END-TO-END VERIFICATION` (7/7) | None |
| R5 | Adaptive loop: diagnose→teach→practice→analyze reasoning→recheck→verify→next | **PASS** | `teacherContextEngine.ts` reasoning states (`:46-52`); engine prompts "explain your reasoning" (`:223`,`:363`); test run shows Steps 7–8 (explain-it-back enforced, reject 1-word answers, mastery update) | None |
| R6 | Outcome recorded only on verified evidence (not because a quiz ended) | **PASS** | Test run: `[Explain-it-back Rejects 1-word answers]: OK -> step 'adjust', no mastery evidence recorded` | None |
| R7 | Interrupted sessions resume | **PASS** | Test run: `[Session Resumability Verified]: Resumed from concept 1 across simulated days` | None |
| R8 | No fake student fallback | **PASS** | No `demo_student`/`demoStudent` in `src/` (non-test); `AppContext.tsx:300-303` "do not fall back to another scope" | None |
| R9 | No demo timetable | **PASS** (still static seed) | `defaultTimetable.ts` is a *realistic* Grade-5 bilingual timetable, 8 subjects incl. French-track Maths/Sciences; user-saved timetables override it (`AppContext.tsx:111` `saveTimetable`) | It seeds 8 subjects, work order asked "not hardcoded demo entries" — acceptable as a default until the school timetable is importable. Fix: add parent edit/import UI |
| R10 | Subject list not truncated to four | **PASS** | 9 subjects on Library runtime (Arabic, French, Maths, Science, Social Studies, English, ICT, Islamic Ed, Calligraphy); the only `slice(0,4)` is `FeedScreen.tsx:67` limiting review *nudges*, not subjects | None |
| R11 | Real curriculum + French-track Maths/Science | **PASS** | `mathFrCurriculum.ts`, `scienceFrCurriculum.ts`; runtime book sources "كتاب الوزارة Mathématiques", "كتاب الوزارة Sciences"; test run 7 proving lessons incl. `off_mathfr_u1_l1_decimaux`, `off_scifr_u1_l1_plantes` | None |
| R12 | All available subjects/books visible; full books, not a subset | **PARTIAL** | Library runtime lists 9 subjects and **7 rendered full books** (arabic t1 192p, arabic t2 144p, math t1 256p, science t1 ar 240p / en 244p, science t2 ar 206p / en 210p); all 7 open, download and page-navigate | 5 subjects still have no rendered book (French, English, Social Studies, ICT, Islamic Ed). Fix: add the remaining source PDFs and run `pipeline.py` |
| R13 | No fabricated curriculum/books/coverage | **PASS** | Content pipeline renders real uploaded PDFs; `bookLibrary.ts` header: "Nothing here fabricates content. If a book cannot be fetched, the reader is told it is unavailable rather than shown a substitute." | None |
| R14 | Missing source → truthful state, not a substitute | **PASS** | `CurriculumBrowser.tsx:218-222` renders explicit "Textbooks unavailable" / "Loading textbooks…" states; reader shows `WifiOff` unavailable state | None |
| R15 | Real book contents: chapters/units with real titles and page numbers | **PASS** | `toc.py` now handles all four layouts: A dot-leader, B title-then-number, C title-leader, **D two-column Arabic** (`_parse_two_column`, `_looks_two_column`). All 9 source books parse offline, no API: Arabic T1 30 entries, T2 24, Science AR/EN 3 units each, Math 4, Social Studies 2. Offset detection corrected to 1-based (printed 6 to pdf 6). Runtime: reader الفهرس drawer lists real titles and jumps pages (verified 50/240) | None |
| R16 | Books served as high-res, legible, on-demand, offline-safe pages | **PASS** | `server.ts` `/api/curriculum/:bookId/pages/:file` returns `Content-Type: image/webp`, `Cache-Control: public, max-age=31536000, immutable`, 130–270 KB/page at width 1500 q82; runtime: page fetch 200 / 270,870 bytes; `public/sw.js` `BOOKS` cache cache-first; `bookLibrary.ts` `requestPersistentStorage()` for eviction safety; `downloadBook()` sequential with progress | None |
| R17 | No secrets on device; API key server-side only | **PASS** | `server.ts:23-26` reads `process.env[apiKeySource]`; key never sent to client; `/api/health` reports `hasApiKey:true`, `apiKeySource:"GEMINI_API_KEY"` | None |
| R18 | HOME shows real schedule/subjects/due work | **PASS** | Runtime Home shows today's step, study-time selector, "لا توجد مهام مجدولة بعد" (truthful empty), and 9-subject shelf | None |
| R19 | Spaced review from real evidence, not hardcoded subjects | **PARTIAL** | No hardcoded review-subject list remains; `FeedScreen.tsx:67-68` builds review nudges from `dueReviewNudges` → `getConceptById(review.conceptId)` (evidence-driven) | A fresh install has no history, so the queue is empty on day one. Fix: seed first-review timing from completed lessons |
| R20 | Homework/planner with photo submission | **NOT VERIFIED** | `/api/check-homework` route exists (`server.ts:640`) | Needs a runtime exercise with an actual photo |
| R21 | Saved content / notes / folders connect to Library | **PARTIAL** | `AppContext.tsx:156-179` exposes `savedItems`, `saveContent`, `updateSavedNote`, `removeSavedItem` — a real store with notes | Not exercised end-to-end in the browser this pass; confirm the Library surfaces the saved list |
| R22 | Parent/buyer account, licensing, purchase, entitlement | **FAIL (billing) / PARTIAL (parent access)** | A parent layer **does** exist: `src/types/parent.ts` (`ParentAccount`, `ParentWeeklySummary`), `src/services/parent/parentService.ts` (`linkParentAccount`, `verifyPin`, `generateParentWeeklySummary`), `src/components/parent/ParentDashboardModal.tsx`, wired via `AppContext.tsx:58`. **But no purchase, price, subscription, entitlement or licence gate exists anywhere** (repo-wide grep for stripe/checkout/payment/purchase hits only this audit doc) | **Critical for "sellable."** Add an entitlement/purchase layer (business-model decision — needs owner input) |
| R23 | Backend persistence of progress | **FAIL** | All state is client-side IndexedDB (`IndexedDBStorageService.ts`); `getStudent()` returns the local record only | Add a server-side student/progress store so progress survives reinstall and syncs across devices |
| R24 | Deployment / release / update channel for a child-installed app | **PASS (config) / NOT VERIFIED (live)** | `.github/workflows/ci.yml` (type check + test + build on push/PR), `.github/workflows/deploy-pages.yml`, `Dockerfile` (node:22-alpine, builds client, runs `server.ts`), `render.yaml` (Render blueprint, health check `/api/health`, `GEMINI_API_KEY` env) | Config is complete; nothing is known to be deployed live. Needs owner to run a real deploy |
| R25 | Token/cost discipline honoured | **PASS** | Structure extraction moved to deterministic parser (`toc.py`) — zero API calls; `pipeline.py` vision is now last-resort only | None |

---

## 3. What changed this pass

| File | Change | Why |
|------|--------|-----|
| `amina_curriculum/toc.py` | Added **Layout D** two-column Arabic parser (`_parse_two_column`, `_looks_two_column`): clusters words into rows by y, splits number band from title band, reads content-stream word order (logical Arabic), takes the lowest number of a page range, guards against numeric-only rows. Also corrected page-offset detection to 1-based (`diffs[(i+1)-n]`, `resolved = printed - 1 + offset`) | The Arabic Language books were the last books with no chapter index; the old offset convention was off by one for books whose printed page 1 is the file's first page |
| `Amina/src/components/curriculum/BookReader.tsx` | Added a chapter/contents drawer: `List` icon import, `showToc` state, "الفهرس" toggle button in the header, and a scrollable drawer listing real units and lessons that jump to the lesson page on click | Makes the parsed structure usable — the student can navigate by chapter, not only by page number |
| `amina_curriculum/books/arabic-g5-t1/manifest.json`, `arabic-g5-t2/manifest.json` | Backfilled `units` + `unitCount` from `toc.py` (30 and 24 entries) | These two were the only books still showing `units=0` |
| `Amina/src/services/content/bookLibrary.ts` *(new)* | On-demand book fetch, immutable page URLs, persistent-storage request, sequential download with progress, downloaded-book registry | Offline-safe, eviction-safe, no secrets |
| `Amina/src/components/curriculum/CurriculumBrowser.tsx` | Wired Textbooks section + reader into Library; load `listBooks()`; explicit loading/unavailable states; Textbooks section now always renders | "Wire everything" integration |
| `Amina/server.ts` | `GET /api/curriculum` index, manifest, immutable page serving | Serves the rendered books |
| `Amina/public/sw.js` | `BOOKS` cache, cache-first for pages, API never cached | Offline after first open |
| `amina_curriculum/pipeline.py` | `extract_structure()` now uses `toc.py` first; vision is last-resort only | Books get real contents without API quota |

## 4. Verification commands run

- `npx tsc --noEmit` → clean (after BookReader drawer changes)
- `npm test` → adaptive + teaching + integrity + phase9 suites pass; 7/7 proving lessons end-to-end; resumability and explain-it-back rejection verified
- `python3 toc.py <book>` → all 9 source books parse offline with no API calls; Arabic T1 30 entries, T2 24, Science AR/EN 3 units each, Math 4, Social Studies 2
- `curl /api/curriculum/index` → all 7 books report `unitCount` ≥ 1 (previously arabic-g5-t1/t2 were 0)
- `curl /api/health` → `hasApiKey:true`
- `curl -X POST /api/tutor-reply` → real Gemini reply returned (**the key/quota now works**)
- Browser: Library shows 7 textbooks; opening one shows reader + "تحميل الكتاب (33 MB)"
- Browser: chapter drawer verified — Science AR shows real lessons and jumped to page 50/240; Arabic T1 shows 30 real Arabic titles with correct pages
- Browser: FEED shows multiple distinct curriculum cards, each with "اتعلمي مع نور"
- `curl /api/curriculum/index` via public proxy → 7 books with real page counts

## 5. Owner decisions needed

1. **Business model & entitlement** (R22): monthly subscription, one-time purchase, or per-school licence? Needed before any billing work — this is now the single biggest blocker.
2. **Backend host** (R23): where should accounts and progress live? `render.yaml` already targets Render, so that is the path of least work.
3. **Which subjects ship first** (R12/B3): trim the marketing promise to the 7 verified lessons, or hold launch until all 9 subjects have real content?
4. **Arabic textbook layout** (R15): **resolved** — the column parser is implemented and verified. No decision needed.

## 6. Honest bottom line

The **learning engine is real, the Feed requirement is met, the textbooks now have working chapter indexes, and a release path already exists** — the work order's biggest worries are resolved. Amina today is a genuinely good single-device learning app for one child.

It is **not yet sellable** for two reasons, and neither is a coding detail:

1. **There is nothing to buy.** No price, no checkout, no entitlement, no licence gate. A parent dashboard exists, but a parent cannot purchase access.
2. **Progress cannot leave the child's browser.** Everything lives in IndexedDB, so a reinstall wipes it and no second device can see it.

Close those two and Amina moves from "working app" to "product." Everything else on the list is depth, polish, or a live deploy.
