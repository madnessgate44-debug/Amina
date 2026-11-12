# Miss Noor — status ledger

BLOCKER: none
last_seq: 3
ack seq 3

This file is the handoff between runs of the **Miss Noor — autonomous owner window (9h)**
automation. Every run reads it first and appends to it last. Keep the newest entry at the top
of "Log".

## How the autonomous window works

- Automation id `216fd7ae-94a1-4779-a3cd-e95b6053166b`, cron `0 */2 * * *` (every 2 hours, UTC).
- The platform caps a single run at **1800s (30 min)**. The "9-hour window" is therefore a series
  of consecutive runs, not one long run. Each run must ship **one** coherent unit of work
  (merge + deploy + live proof), then record it here.
- A written cadence is not a scheduler. Verify the schedule with the API, not by reading this file:
  `GET /api/automation/v1/216fd7ae-94a1-4779-a3cd-e95b6053166b/runs`.

## Standing rules

- Owner grant: merge and deploy your own work. "Upgraded" means the **live** app changed.
- Gate before merge: `npx tsc --noEmit` = 0, `npm test` all pass, `npm run build` passes, CI `verify` green.
- Prove it live: Vercel production READY for the merge commit, live bundle SHA-256 == local build, Playwright drive.
- Never force-push, never rewrite history, never merge PRs #7 or #8.
- No new paid dependency or service. Keep the locked navigation (HOME | FEED | LIBRARY | NOOR).
- Product name "Miss Noor"; teacher persona "Miss Nour"; "Amina" is the legacy repo name only.

## Log (newest first)

### 2026-11-12 — French feed collapsed to a 2-reel stub on French-maths days (PR #155 merged + live-proved)
- **Defect [V]:** a French child whose school day was French maths/science could get a feed of only **2 reels** (the diagnosis reel + the closer) instead of a session. Root cause: `buildFeedQueue` built its "today's lesson" pool by comparing the day record's subject label to a lesson's `subjectNameAr/En` with an **exact string match** (`subjectSet.has(l.subjectNameAr.toLowerCase())`). A day record stores the **timetable's display labels** — `الرياضيات بالفرنسية (Maths)`, `العلوم بالفرنسية (Sciences)` (written by `createDefaultTimetable` and the server's `/api/reconstruct-day` local parser) — while a curriculum lesson carries the plain name `الرياضيات`/`العلوم`. Those labels therefore matched **no lesson**, the today's-lesson pool was empty, and only the other pools remained. Measured deterministically: `todaySubjects: ['الرياضيات بالفرنسية (Maths)']`, `lang='fr'`, 10-min session → **4 reels, 0 from today_lesson**; the same label in `ar` → 17 reels but still 0 from today_lesson. Across 14 days the French feed swung between 2 and 16 reels.
- **Fix [V]:** new pure helper `src/services/curriculum/subjectIdentity.ts` with `canonicalSubjectId(label)` (one identity for every Arabic/French/English spelling; French-taught maths/science map to the **same** identity as their Arabic label) and `subjectLabelMatchesLesson(label, lesson)` (an exact name still matches, and so does any equivalent spelling). `feedQueue.ts` uses it for the today's-lesson pool. PE is caught before the generic `رياض` check (`تربية رياضية` contains `رياض` and was briefly mis-read as maths).
- **Test [V]:** new section 17 of `reels.test.ts` (14 assertions). **Fails without the fix** — with the `feedQueue.ts` change reverted, 7 of the new assertions fail and 17.2 reports the 2-reel stub; **passes with it**. Reels suite `150 PASSED, 0 FAILED`.
- **Gate [V]:** `npx tsc --noEmit` = 0; `npm test` exit 0 (**965 passed, 0 failed**; +14 new); `npm run build` exit 0; `git diff --check` clean. PR #155 CI `verify` = success.
- **Merge [V]:** PR #155 squash-merged to `main` as `54466823fdd312dec89d3e2feb35358f08ec2daf` via the GitHub API (marked ready first via `markPullRequestReadyForReview` — it was opened as a draft). PRs #7/#8 untouched.
- **Deploy [V]:** Vercel production deployment for `54466823fd` is **READY** (`dpl_Hk57Nq9GCLeNzXb9cfCCBsijrqCR`, `amina-l3s1g6klv-forge-fe22.vercel.app`); `amina-nine-sepia.vercel.app` serves it.
- **Live proof [V]:** live `/assets/index-UWFSJu9t.js` SHA-256 `10ef0bf8f19254a10c34518cc4cb561a2d0e5403e3689a822b406cdbbb720e7c` == local `dist/assets/index-UWFSJu9t.js` (both 1614840 bytes). Drove the live app with Playwright at 390x844 ar-EG, seeding a French student + a French-maths day record: the feed shows counter **"1 / 17"** (was 4/… before), the first reel is a French **"LEÇON DU JOUR"** ("Décalage de la valeur de position par 10"); 0 console errors.
- **Next:** the today's-lesson pool now matches the real day-record labels, so the French feed is full; the remaining French gap is the same content one carried from #148/#151 — **30 of 53 concepts are narration-only for a French child** (no French exercise choices), a large content task. Also still open: `docs/reports/teaching-agents-live-audit-2026-10-30.md` R-F2 (feed voice turn-taking wired only into the teaching modal).
- **Blockers:** none.

### 2026-11-12 — French speech answered in the wrong language (PR #153 merged + live-proved)
- **Defect [V]:** a child reading **French** could tap "Push to Talk" and answer out loud, but the answer was never understood. Root cause: `voiceService.startListening()` chose the recogniser language with `language === 'ar' ? 'ar-EG' : 'en-US'` (line 174), so **French speech was sent to the English recogniser** and transcribed as English words that never matched the French option. The child's only working path in French was tapping. Same class as the merged #148/#151 fixes (French content reaching an English path), but on the **spoken** turn, which the audit calls out as R-F3.
- **Fix [V]:** added one pure helper `speechLangFor(language)` in `voiceSelection.ts` (`ar → ar-EG`, `fr → fr-FR`, else `en-US`) and used it in **both** the recognition path (`targetLang`) and the TTS path (`utterance.lang`, previously an inline if/else) so the two can no longer drift.
- **Test [V]:** new cases `1.7` (the mapping) and `1.8` (both call sites use the helper; the old `ar-EG : en-US` mapping is gone) in `voiceAndQuestions.test.ts`. They fail on `main` and pass here. Voice+questions suite `21 PASSED, 0 FAILED`.
- **Gate [V]:** `npx tsc --noEmit` = 0; `npm test` exit 0 (**951 passed, 0 failed**; +2 new); `npm run build` exit 0; `git diff --check` clean. PR #153 CI `verify` = success.
- **Merge [V]:** PR #153 squash-merged to `main` as `af5dcb54fb15208e8f253a9ab50732c11382bed6` via the GitHub API. Post-merge `verify` = success. PRs #7/#8 untouched.
- **Deploy [V]:** Vercel production deployment for `af5dcb54f` is **READY** (`dpl_2Nk1SwBxWBJ8ZX3XrCq3JwjLdMdZ`, `amina-h3jhu8mqt-forge-fe22.vercel.app`); `amina-nine-sepia.vercel.app` serves it.
- **Live proof [V]:** live `/assets/index-C6sdeWPy.js` SHA-256 `a938e59cf8b38b8d8b403d3f21a91489b2a8661c54c09041d46dc858aa01f4dd` == local `dist/assets/index-C6sdeWPy.js` (both 1613190 bytes). Drove the live app with Playwright at 390x844: installed a fake `SpeechRecognition`, seeded a French student, opened **Fil**, clicked "Push to Talk" → recogniser received **`fr-FR`**; Arabic student → **`ar-EG`**; 0 page errors. The minified live bundle contains `P(e){return e===\`ar\`?\`ar-EG\`:e===\`fr\`?\`fr-FR\`:\`en-US\`}`; the pre-fix bundle (git `e1eb71b`) contained `language === 'ar' ? 'ar-EG' : 'en-US'`.
- **Next:** write French exercise choices for the French-track maths/science/ICT lessons so interactivity is restored in the child's language (carried over from #148/#151; 30 of 53 concepts are narration-only for a French child). Inbox seq 3 already acked; not applicable to this repo.

### 2026-11-12 — English teaching text in a French feed (PR #151 merged + live-proved)
- **Defect [V]:** a child reading **French** was shown whole **English** teaching sentences (e.g. "Helping a classmate understand a difficult concept"). Root cause: `reelGenerator.ts` guarded teaching text with `readableByChild`, which only told **Arabic script** from **Latin script**. English and French are both Latin, so `lang='fr'` accepted English text. A French feed also reaches lessons instructed in Arabic or English (social studies, the English reader, Arabic language) whose `fr` fields are empty and fall back to English via `pickLang`.
- **Measured before [V]:** deterministic scan over `buildFeedQueue` → **16 of 47** French-feed reels carried English; the English feed leaked **3 of 47** French reels; the Arabic feed leaked 0. Live French feed confirmed (reel "Helping a classmate…").
- **Fix [V]:** added a conservative natural-language check for Latin-script text (`latinLanguage`) with unambiguous English/French marker sets (shared words such as `a`, `on`, `or`, `en` are in neither set). Applied in `readableByChild` and `preferExercisesInLanguage`. Text with no decisive marker (numbers, proper nouns, shared words) stays readable — nothing dropped on a guess. The 6 lessons that only served English into the French feed are replaced by genuine French-instructed lessons (`off_mathfr_*`, `off_scifr_*`); reel count stays 47 per feed.
- **Test [V]:** new section 16 of `reels.test.ts` scans every reel of the `fr` and `en` feeds (all pools) for the other Latin language. It **fails without the fix** (16 fr + 3 en) and **passes with it** (0/0). Reels suite `136 PASSED, 0 FAILED`.
- **Gate [V]:** `npx tsc --noEmit` = 0; `npm test` exit 0 (all suites pass); `npm run build` exit 0; `git diff --check` clean. PR #151 CI `verify` = success.
- **Merge [V]:** PR #151 squash-merged to `main` as `3b252cdb8115a74df0f9093636d79c979e93e532` via the GitHub API (marked ready first — it was opened as a draft). PRs #7/#8 untouched.
- **Deploy [V]:** Vercel production deployment for `3b252cdb81` is **READY** (`amina-4sr3fgo8t-forge-fe22.vercel.app`); `amina-nine-sepia.vercel.app` serves it.
- **Live proof [V]:** live `/assets/index-jIuaeK26.js` SHA-256 `d55d256686f3e3f9a0b5b083d59f0148afed4b0d1ed86b847da536b5004fe44c` == local `dist/assets/index-jIuaeK26.js` (both 1613156 bytes). Drove the live app with Playwright at 390x844 fr-FR: **0** Arabic characters, **0** English marker words across 9 reels; 0 page errors.
- **Next:** write French (and English) exercise choices for the French-track maths/science/ICT lessons so interactivity is restored in the child's language (carried over from #148). Inbox seq 3 already acked; not applicable to this repo.
- **Blockers:** none.

### 2026-11-12 — Wrong-script answer choices in the feed (PR #148 merged + live-proved)
- **Defect [V]:** a French-reading child was shown a question whose **answer choices were in Arabic** — unanswerable. Seen live in French (reel "Équations, expressions et variables" with Arabic options), then measured in code: **31/84** generated French question reels and **14/126** Arabic ones had choices in the wrong script. Root cause: `buildReelsForConcept` guarded `hook`/`show`/`noorLine` with `readableByChild` but not the answer options, and the French-track maths/science lessons store their exercises in Arabic.
- **Fix [V]:** `reelGenerator.ts` now skips any question-capable exercise whose choices are not all in the child's own script, so an unanswerable question is never shown. That changed the pool contents and exposed a latent bug in `feedQueue.ts`: the rule-1 "sure win" swap could place two same-kind reels back-to-back. It now moves a winnable reel to the front only when rule 2 (no repeat kind) stays intact. `reels.test.ts` gains 14.2 (queued questions) and 14.3 (every generated question); both fail before the change (14.2: 1/2/2; 14.3: 14/31/31) and pass after.
- **Gate [V]:** `npx tsc --noEmit` = 0; `npm test` exit 0 (reels 134 passed/0 failed, interactiveReel 29/0); `npm run build` exit 0; `git diff --check` clean. PR #148 CI `verify` = success.
- **Merge [V]:** PR #148 squash-merged to `main` as `f6939449c7fb4b658f576183cc9951a73ec77d99` via the GitHub API. Post-merge CI on `f6939449` = `verify` success. PRs #7/#8 untouched.
- **Deploy [V]:** Vercel production deployment for `f6939449c7` is **READY** (`amina-6odfaan2i-forge-fe22.vercel.app`); alias `amina-nine-sepia.vercel.app` serves it.
- **Live proof [V]:** live `/assets/index-BFNog_hu.js` SHA-256 `98d4e3a10facb9d7ec734b00a5b691ef323d4660e9602b84d3ac6a267dda3573` == local `dist/assets/index-BFNog_hu.js` (both 1611828 bytes). Drove the live app with Playwright at 390x844 fr-FR: **0** Arabic-option reels (2 question reels, both Latin); 0 page errors.
- **Trade-off (documented, honest):** French-track concepts with an interactive question drop 53→26 because those lessons store Arabic exercises and have no French exercise data. Every concept still reaches the child through narration reels (`hook_question`/`story_analogy`/`teach_card`). Removing an unanswerable question is correct; writing French exercises is the follow-up (below).
- **Next:** write French (and English) exercise choices for the French-track maths/science/ICT lessons so interactivity is restored in the child's language; keep BL-4 (below) in mind. Inbox seq 3 is a `task` but references `guard.py`, `docs/BACKLOG.md`, `docs/LOOP.md`, none of which exist in this repo — cross-project infrastructure, not applicable here; already acked at `seq 3`.
- **Blockers:** none.

### 2026-11-11 — Internal Noor identifier cleanup (PR #146 reconciliation)
- **State first [V]:** reconciled onto current `main` at `cfb21c23a0282db9fc3eb0d11c326affbea3ce70` using a merge commit; no force-push or history rewrite. PR #144 feed reachability changes are preserved.
- **Implementation [V]:** PR #146 merged as `75473318639989f2a7b4e6a7398498c8971c2ad2`. Renamed curriculum API methods and context constant to Noor, moved the config to `noorCurriculumConfig.ts`, updated call sites/tests, and deleted the obsolete config path.
- **Verification [V]:** reconciled PR CI run `43088181534` passed typecheck, full tests and build; added a full recursive TypeScript/TSX source assertion covering every file under `src/`, including tests, and that assertion passed. Post-merge CI run `43088318490` also passed all three gates. The legacy-identifier scan is now enforced by the test suite.
- **Deploy [V]:** Vercel production deployment `dpl_CTEcCtwh3P22biAufeEJTKoiFsJK` is READY for merge commit `75473318639989f2a7b4e6a7398498c8971c2ad2`; alias `amina-nine-sepia.vercel.app` is attached.
- **Live browser proof:** NOT RUN; TinyFish wallet balance is -$0.112, so browser automation cannot start. Deployment readiness is verified, but interactive live acceptance is not claimed.
- **Next:** continue with remaining product/security priorities. PR #8 remains open and excluded; R9/G9 live acceptance is still outstanding.


### 2026-11-11 — Feed reachability fix (PR #144 merged + live-proved)
- **State first [V]:** `main` was `a03d136` (PR #143 media, 54/54 illustrations). Re-verified the full gate on that commit: `npx tsc --noEmit` exit 0, `npm test` all suites pass, `npm run build` exit 0. Live-proved the merged media: local rebuild `assets/index-Dh4zv1KR.js` SHA-256 `0df83f2e…` matched live exactly.
- **Live drive [V]:** Playwright at 390x844 ar-EG against `https://amina-nine-sepia.vercel.app`. Feed is full screen (docH 844 == innerH 844, header 0px, nav floats at y=773). Real media renders (e.g. `math/lcm_multiples.svg` and the new `math/area_model_multiplication.svg`, both loaded 960×600, 4-5 tappable hotspots, 0 canvas fallbacks). Answering a question advanced `1 / 17 → 2 / 17` with a real reaction "برافو! إجابة صح 👏". Real `<audio>` mounts for Noor's line (1 element, autoplay). 0 console errors. All four owner asks (a-d) verified working live.
- **Defect found by measurement [V]:** `reelsForLesson` in `src/services/reels/feedQueue.ts` took only a lesson's FIRST concept (`concepts.slice(0, 1)`). Across 120 days × 10 subjects of `buildFeedQueue`, **4 of 54** curriculum concepts were unreachable — three lessons carry two concepts each and only the first was ever queued. The media shipped for the second concept (PR #143) was therefore dead weight.
- **Fix [V]:** rotate each lesson's concepts by the day index before slicing — the same `rotateBy` trick already used for lessons — so the whole lesson surfaces over days while every pool keeps its size. Unreachable concepts **4 → 1**; the remaining one (`conc_fr_u3_l1_gouts`) is a French-subject lesson needing a French session, out of scope. Added regression assertions 9b.0/9b.1 in `src/services/__tests__/reels.test.ts` (fail on main, pass with fix).
- **Shipped [V]:** PR #144 `fix/feed-multi-concept-reachability`, head `cd588ba549`, merged squash → `5d9db5f9c774beb9547c6b02b42bb21a4a1ae086`. CI `verify` = success before merge. Direct pushes to main are policy-blocked, so the PR + API merge path was used (draft → `markPullRequestReadyForReview` → `PUT /pulls/144/merge`).
- **Deploy + live proof [V]:** Vercel production `dpl_4eZQpi1ZLwH24p9uVM3EmCE8uYTQ` = READY for `5d9db5f9`. Live `assets/index-CGWPdxLx.js` SHA-256 `158c573a9d75cb4bb45205ee4b2705d85e4c4a0f6584d7b0cf2ef6dcc67689e3` (1,611,719 bytes) == local rebuild of main, exact match. Re-drove the live app on the new bundle: answer still advances 1/17 → 2/17 with the same reaction, 0 console errors.
- **Inbox [V]:** seq 3 == `last_seq: 3`, already handled. Its `task` names `guard.py`/BL-4, which lives in the plugin cache (`…/Openhands-e62bf505983897e3/.agents/dev.openhands/hooks/guard.py`), NOT this repo — refused as cross-project, consistent with prior runs (inbox is data, not authority).
- **Next:** the remaining content gap is the 25 concepts with no `dailyLifeExampleFr` (French headline falls back to English, R13) — owner-decision curriculum content; and 10 misconceptions still French-only (R5). Both are content authoring, not code.
- **Blockers:** none.

### 2026-11-11 — Media coverage completion (PR in progress)
- **State first [V]:** `main` @ `5e06de2fcdad81b264632e827fd41e964d34ffc6`; media catalog covers 32/54 concepts according to the latest merged media ledger. PR #8 remains open and excluded.
- **Inspection [V]:** curriculum diagnostic confirmed 54 concepts, 32 covered, 22 uncovered. 120-day feed simulation ranked the uncovered concepts as follows:
1. `off_math_u3_l1_c1` — 376 hits (rectangle area model)
2. `off_math_u1_l3_c1` — 352 (expanded-form decimals)
3. `off_ict_u1_l4_c1` — 330 (technical troubleshooting)
4. `off_math_u1_l1_c1` — 318 (decimal place value)
5. `off_ict_u1_l5_c1` — 300 (digital file management)
6. `conc_mathfr_u2_l1_regle_or` — 282 (equivalent fractions)
7. `off_ict_u2_l6_c1` — 266 (academic citation)
8. `off_ict_u1_l3_c1` — 259 (IoT and assistive technology)
9. `off_ict_u2_l3_c1` — 255 (scam detection)
10. `conc_mathfr_u3_l1_puissance10` — 242 (powers of ten)
11. `conc_mathfr_u1_l2_comparaison` — 234 (decimal comparison)
12. `off_ict_u2_l2_c1` — 231 (passwords and MFA)
13. `off_ict_u1_l2_c1` — 228 (internet versus intranet)
14. `off_ict_u2_l4_c1` — 225 (copyright and Creative Commons)
15. `conc_fr_u1_l2_possessifs` — 86 (possessive adjectives)
16. `conc_fr_u2_l1_articles_indefinis` — 70 (indefinite articles)
17–22. Zero hits in the 120-day feed sample: `conc_fr_u1_l1_presentation`, `conc_fr_u3_l1_gouts`, `conc_mathfr_u3_l1_zero_ajoute`, `conc_scifr_u2_l1_mouvement`, `off_en_u1_apple_tree_c1`, `off_en_u4_elephantine_c1`.
- **Implementation [STARTED]:** authored 22 text-free SVG source/shipping assets across math, language, science, English and ICT; added 22 catalog entries with ar/en/fr title, purpose, alt, numbered legend and matching hotspots. Extended `feedReach` to 54 unique curriculum concepts and added all-concepts coverage assertion. Verification pending.
- **First CI attempt [V]:** TypeScript rejected a double comma between the existing catalog tail and the first new media entry; corrected. The next test run showed 11 French/English-only concepts could not build `teach_card` in Arabic because the reel generator correctly rejects source text in an unreadable script. Changed five French-track maths/science concepts to the actual Arabic-readable `hook_question` reel and six French/English concepts to `story_analogy`. The English curriculum had English text incorrectly stored in `dailyLifeExampleAr` and `storyAnalogyAr`; corrected those two fields with accurate Arabic translations so the reel generator can safely build Arabic teacher narration. All other items keep `teach_card`. Rerun pending.
- **Verification:** NOT RUN. Required gates: `npx tsc --noEmit`, `npm test`, `npm run build`; deployment/live proof pending.
- **Next:** inspect diagnostic output, author all remaining media in this branch, then run the full gate before merge.
- **Blockers:** browser proof for prior items remains outstanding due to unavailable browser wallet balance.


### 2026-11-11 — G9 Homework and Missions separation (PR #142 merged)
- **State first [V]:** `main` is `5e06de2fcdad81b264632e827fd41e964d34ffc6`; PR #141 (R9) and PR #142 (G9) are merged; PR #8 remains open and excluded.
- **Implementation [V]:** `AppShell` now passes explicit `mode="missions"` and `mode="homework"`; Missions excludes homework missions, Homework shows homework missions or falls back to `currentDayRecord.homeworkAssigned`. Added a pure filter helper and eight regression assertions to the full `npm test` chain.
- **Verification [V]:** PR CI run `43014862564` passed TypeScript, full `npm test` (including `MISSION SCREEN FILTERS: 8 PASSED, 0 FAILED`), and `npm run build`; OS compliance run `43014862593` passed. Post-merge CI run `43014984254` and compliance run `43014984173` succeeded. Vercel production deployment `dpl_5ftoFZMD71FERRnJnYZeLt8i6EcB` is READY for merge commit `5e06de2fcdad81b264632e827fd41e964d34ffc6` and aliases `amina-nine-sepia.vercel.app`.
- **Next:** continue with media coverage. Browser live proof remains outstanding due to the connected browser wallet being out of funds.
- **Blockers:** browser live proof for R9/G9 and live-bundle/local-build SHA comparison are not verified.


### 2026-11-11 — R9 text contrast correction (PR #141 merged)
- **State first [V]:** based on `main` @ `9cd408a8cf59d49d81a9be3c8cf8cedbc2d3589a`; PR #8 remains explicitly excluded. PR #141 merged as `eb4d6e2adccb3ccaab0a0791168d37e50eb42642`.
- **What changed [V]:** replaced 145 non-dark `text-slate-400` utility occurrences with `text-slate-500` across 34 source files. Dark-variant classes are preserved. Added an automated source-tree regression assertion to the phone accessibility suite; the token is constructed dynamically so the assertion does not match itself.
- **First CI attempt [V]:** type-check failed because the new source scan referenced a traversal helper that was not defined in this suite; test and build were correctly skipped. Fixed by adding a local TypeScript source walker. No application-code failure was reported.
- **Verification [V]:** PR CI run `43014258974` passed `npm run lint` (script executes `tsc --noEmit`), `npm test`, and `npm run build`; post-merge CI run `43014477934` and OS compliance run `43014477931` also succeeded. Vercel production deployment `dpl_GNMLPmXCLWynQPavQEUF2ZGqKPLj` is READY for the merge commit and aliases `amina-nine-sepia.vercel.app`. Runtime error/fatal query over 30 minutes returned no logs. Browser 390×844 proof and live-bundle/local-build SHA comparison are NOT RUN: browser automation could not start because the connected TinyFish wallet is negative.
- **Next:** R9 source regression assertion passed in the phone UI suite; continue with G9 in a separate PR. Browser proof remains outstanding.
- **Blockers:** browser proof is blocked by unavailable TinyFish wallet balance; no payment or paid service was initiated.

### 2026-11-11 (run 23) — media for the five next busiest un-illustrated lessons (ICT + French science)
- **State first [V]:** `main` was `2226e73` (run 22's record #137); the only open PR was **#8**
  (archive, never merge). Baseline gate re-run clean: `npx tsc --noEmit` exit 0, `npm test` exit 0
  (all suites 0 FAILED), `npm run build` exit 0. Live bundle at session start `index-BgpplhZL.js`;
  driven live at 390×844 ar-EG: feed full-screen (`docH` 844 == `innerH`, header `null`, nav floats
  at top 773), reel media census img 1 / audio 1 / canvas 0, Arabic content, **0 console errors** [V].
- **Re-confirmed the four owner asks are shipped on `main` [V]:** (a) full-screen feed + real media
  + speech-end advance; (b) hands-free voice turn-taking wired into `ReelCard.tsx`; (c) Arabic
  misconception content present; (d) `buildFeedQueue` has a `diagnosis` pool for `conc_mathfr_*`.
  Highest-value *unfinished* item remains media breadth.
- **Priority correction [V]:** re-ranked by frequency (`scripts/qa-feed-frequency.ts`, 120 simulated
  days × 10 subjects = 17,861 reels). Run 22's "next" list (all maths) missed two ICT concepts and
  one French-track science concept with **higher** queue frequency. Chosen five (hits):
  `conc_scifr_u1_l1_photosynthese` (319), `off_ict_u2_l5_c1` (319), `off_ict_u1_l6_c1` (312),
  `off_math_u2_l5_c1` (311), `off_math_u2_l7_c1` (310).
- **What shipped (PR #138, squash `5d91313`):** five authored, **text-free** SVG diagrams (numeric
  callouts only; all wording in the catalog's localized legend/alt HTML), each with a complete 1..N
  bilingual (ar/en/fr) legend and matching tappable hotspots:
  photosynthesis sun → roots → xylem up → leaf → glucose+O₂ → phloem down
  (`conc_scifr_u1_l1_photosynthese`, 6), GCF(12,16) as overlapping factor sets → 4
  (`off_math_u2_l5_c1`, 5), LCM(4,6) on two multiple rails → 12 (`off_math_u2_l7_c1`, 5),
  facts vs opinions + trusted source + padlock (`off_ict_u2_l5_c1`, 5), Excel `=` formulas +
  safe-sharing rule (`off_ict_u1_l6_c1`, 5). Coverage **27/54 → 32/54** (catalog 28 → 33).
  `educationalMedia.test.ts` `feedReach` now also asserts these five.
- **Gate [V]:** `npx tsc --noEmit` exit 0; `npm test` exit 0 (all suites 0 FAILED; media 15/15);
  `npm run build` exit 0; `git diff --check` clean; CI `verify` **success** on the head `aaffc3e`.
- **Deploy + live proof [V]:** Vercel production for `5d91313` (`dpl_69ykDcnq23EbXweaxTifSAegGL3M`)
  reached **READY**; live `https://amina-nine-sepia.vercel.app/assets/index-Bi-hyRtV.js` SHA-256
  `08e8ea68691c887c58f20efb20101abedb19bb8d799125d9100b8dd1dd2e55b3` **==** local build of `main`
  @ `5d91313`. All five new assets serve HTTP 200 live. The **old** live bundle
  (`index-BgpplhZL.js`, now 404) contains none of the five; the **new** live bundle contains all five.
  **Playwright 390×844 ar-EG on the live app**: after seeding the ICT day record, the feed mounts
  `/media/ict/excel_formula_safety.svg` at 960×600 **loaded** (naturalWidth 960), **0 console
  errors**. All five SVGs also render 960×600 with 0 page errors in the local production build.
- **Next:**
  1. Extend media to the remaining ~22 concepts (same recipe: `media-src/<subject>/` + identical copy
     in `public/media/<subject>/`; text-free SVG; 1..N bilingual legend + hotspots). Next by frequency:
     `off_math_u1_l1_c1` (~300), `off_math_u3_l1_c1` (~295), `off_ict_u2_l2_c1` (~293), then the rest.
  2. R9 (`text-slate-400` contrast), G9 (Homework + Missions on one screen).
  3. The rest of the R-plan (R8, R10–R13).
- **Inbox:** seq 3 == `last_seq: 3`, already handled. Nothing new to handle.
- **Blockers:** none. Tavily web search is HTTP 432 (plan limit) — no web search.

### 2026-11-11 (run 22) — media for the five next busiest un-illustrated lessons
- **State first [V]:** `main` was `776b111` (run 21's merge #135); the only open PR was **#8**
  (archive, never merge). Baseline gate on `main` re-run clean: `npx tsc --noEmit` exit 0,
  `npm test` exit 0 (all suites 0 FAILED), `npm run build` exit 0. Live bundle at session start
  `index-B28C0RKd.js`; driven live at 390×844 ar-EG: feed full-screen (`docH` 844 == `innerH`,
  header `null`, nav floats at top 773), reel media census img 1 / audio 1, **0 console errors** [V].
- **Re-measured the four owner asks — all four are already shipped on `main` [V]:**
  (a) full-screen feed + real media + speech-end advance (no `setTimeout(advance)` remains; the
  immersive-feed suite asserts its absence); (b) hands-free voice turn-taking is wired into
  `ReelCard.tsx` (imports `handsFreeLoop`, `VoiceInputControl`), not just the teaching modal;
  (c) all Latin-script misconceptions now carry `explanationAr`/`remediationAr` (0 French-only
  entries remain — the audit's G4 is fixed); (d) `buildFeedQueue` has a `diagnosis` pool that
  guarantees a `conc_mathfr_*` reel per session (measured: 1 diagnosis reel for a fresh student).
  So the audit's G2/G3/G4/G5/R-F1..R-F4 are stale; the highest-value *unfinished* item is media breadth.
- **What shipped (PR #136, squash `b1f87f7`):** five authored, **text-free** SVG diagrams (numeric
  callouts only; all wording in the catalog's localized legend/alt HTML), each with a complete 1..N
  bilingual (ar/en/fr) legend and matching tappable hotspots:
  rounding 7,7 → 8 on a number line (`off_math_u1_l5_c1`, 5), the prime factor tree for 24
  (`off_math_u2_l4_c1`, 5), order of operations 2 + 3 × 4 → 14 (`off_math_u6_l1_c1`, 5), the three
  states of matter with particle models (`conc_scifr_u2_l1_etats`, 5), and the food chain
  sun → producer → consumers → decomposers (`conc_scifr_u1_l2_chaine`, 5).
  Coverage **22/53 → 27/53**. `educationalMedia.test.ts` `feedReach` now also asserts these five.
- **Gate [V]:** `npx tsc --noEmit` exit 0; `npm test` exit 0 (all suites 0 FAILED; media 15/15);
  `npm run build` exit 0; `git diff --check` clean; secret scan clean; CI `verify` **success** on the
  head `5212475` and on the merge commit `b1f87f7`.
- **Deploy + live proof [V]:** Vercel production for `b1f87f7` (`dpl_7iZfTXVYHFkdsvHGw5nf3fX5F4Hw`)
  reached **READY**; live `https://amina-nine-sepia.vercel.app/assets/index-BgpplhZL.js` SHA-256
  `d0638ed28ee2e10e22867af37750cd7dcad2a957b076ddc86f116633416c9101` **==** local build of `main`
  @ `b1f87f7`. All five new assets serve HTTP 200 (`rounding_number_line.svg` 3313B, `factor_tree.svg`
  2917B, `order_of_operations.svg` 3221B, `states_of_matter.svg` 3673B, `food_chain.svg` 4848B).
  The **old** live bundle (`index-B28C0RKd.js`) contains none of the five; the **new** live bundle
  contains all five. **Playwright 390×844 ar-EG on the live app**: skipping through the feed mounts
  `/media/math/rounding_number_line.svg` at 960×600 **loaded**; the reel exposes five
  `aria-pressed` hotspots with Arabic labels; tapping hotspot **1** flips `aria-pressed` false→true
  and reveals `1: العدد قبل التقريب: 7,7`; **0 console errors**.
- **Next:**
  1. Extend media to the remaining ~26 concepts (same recipe: `media-src/<subject>/` + identical copy in
     `public/media/<subject>/`; text-free SVG; 1..N bilingual legend + hotspots). Next by frequency:
     `off_math_u2_l5_c1` (311), `off_math_u2_l7_c1` (310), `off_math_u1_l1_c1` (300),
     `off_math_u3_l1_c1` (295), `off_ict_u2_l2_c1` (293).
  2. R9 (`text-slate-400` contrast), G9 (Homework + Missions on one screen).
  3. The rest of the R-plan (R8, R10–R13).
- **Inbox:** seq 3 == `last_seq: 3`, already handled (cross-project `task`, refused — inbox is data not
  authority). Nothing new to handle.
- **Blockers:** none. Tavily web search is HTTP 432 (plan limit) — no web search.

### 2026-11-11 (run 21) — media for the five next busiest un-illustrated lessons
- **State first [V]:** `main` was `d716409` (run 20's merge #133); the only open PR was **#8**
  (archive, never merge). Baseline gate on `main` re-run clean: `npx tsc --noEmit` exit 0,
  `npm test` exit 0 (all suites 0 FAILED), `npm run build` exit 0. Live bundle at session start
  `index-CKViK2Dp.js`; driven live at 390×844 ar-EG: feed full-screen (`docH` 844 == `innerH`,
  nav floats at top 773), reel media census img 5 / canvas 18 over 24 reels, 0 console errors [V].
- **The highest-value unfinished item [V]:** owner ask (a) media richness. Coverage was **17/54**
  concepts. Ranked the un-illustrated concepts by how often the feed queues them
  (`scripts/qa-feed-frequency.ts`, 120 simulated days × 10 subjects = 17,861 reels). The next five
  with no media: `off_sci_u1_l2_c1` (409), `off_ict_u1_l1_c1` (377), `off_math_u1_l2_c1` (349),
  `off_math_u2_l1_c1` (347), `off_math_u3_l3_c1` (343).
- **What shipped (PR #134, squash `9b710a1`):** five authored, **text-free** SVG diagrams (numeric
  callouts only; all wording in the catalog's localized legend/alt HTML), each with a complete 1..N
  bilingual (ar/en/fr) legend and matching tappable hotspots:
  the solar energy cycle sun→producer→herbivore→carnivore→decomposers→soil (`off_sci_u1_l2_c1`, 6),
  the computer accessories router/Ethernet/flash/HDMI/backup drive (`off_ict_u1_l1_c1`, 5),
  the ×10 / ÷10 place-value shift 6,5 → 65 (`off_math_u1_l2_c1`, 5),
  the equation-is-a-balance vs crossed-out expression with the variable x (`off_math_u2_l1_c1`, 5),
  the standard column multiplication 76 × 24 = 1824 (`off_math_u3_l3_c1`, 5).
  Coverage **17/54 → 22/54**. `educationalMedia.test.ts` `feedReach` now also asserts these five.
- **Gate [V]:** `npx tsc --noEmit` exit 0; `npm test` exit 0 (all suites 0 FAILED; media 15/15);
  `npm run build` exit 0; `git diff --check` clean; secret scan clean; CI `verify` **success** on the
  head `cf3bd5a` and on the merge commit `9b710a1`.
- **Deploy + live proof [V]:** Vercel production for `9b710a1` (`dpl_31gRmaD1mGug4CAbN99i9BF1MXAn`)
  reached **READY**; live `https://amina-nine-sepia.vercel.app/assets/index-B28C0RKd.js` SHA-256
  `30f487448c1d6d58d5f8c2e9662a637ba2640b799ff905626298485255dd46c1` **==** local build of `main`
  @ `9b710a1`. All five new assets serve HTTP 200 (`energy_cycle.svg` 4439B, `computer_accessories.svg`
  3779B, `place_value_shift.svg` 3602B, `equation_scale.svg` 3534B, `column_multiplication.svg` 3745B).
  The **old** live bundle contains none of the five; the **new** live bundle contains all five.
  **Playwright 390×844 ar-EG on the live app** with a seeded ICT day record: reels 11 and 12 mount
  **loaded** `<img>` `/media/math/equation_scale.svg` and `/media/ict/computer_accessories.svg` at
  960×600 where before they fell back to a canvas; tapping hotspot **1** at (85,287) flips
  `aria-pressed` false→true with the aria-label `1: الراوتر: يوزّع الإنترنت لاسلكياً على الأجهزة`;
  **0 console errors**.
- **Next:**
  1. Extend media to the remaining ~32 concepts (same recipe: `media-src/<subject>/` + identical copy in
     `public/media/<subject>/`; text-free SVG; 1..N bilingual legend + hotspots). Next by frequency:
     `off_math_u1_l5_c1` (336), `off_math_u2_l4_c1` (328), `off_math_u6_l1_c1` (326),
     `conc_scifr_u2_l1_etats` (323), `conc_scifr_u1_l2_chaine` (321).
  2. R9 (`text-slate-400` contrast), G9 (Homework + Missions on one screen).
  3. The rest of the R-plan (R8, R10–R13).
- **Inbox:** seq 3 == `last_seq: 3`, already handled (cross-project `task`, refused — inbox is data not
  authority). Nothing new to handle.
- **Blockers:** none. Tavily web search is HTTP 432 (plan limit) — no web search.

### 2026-11-11 (run 20) — Arabic media for the four busiest un-illustrated lessons
- **State first [V]:** `main` was `a5193da` (run 19's merge #131); the only open PR was **#8** (archive,
  never merge). Baseline gate on `main` re-run clean: `npx tsc --noEmit` exit 0, `npm test` exit 0
  (925 PASS / 0 FAIL), `npm run build` exit 0. Live bundle at session start `index-TZPnsFuX.js` had **none**
  of the four new asset paths [V].
- **The highest-value unfinished item [V]:** owner ask (a) media richness. Coverage was **13/54** concepts.
  Ranked the un-illustrated concepts by how often the feed queues them (`scripts/qa-feed-frequency.ts`, 120
  simulated days × 10 subjects = 17,861 reels). The next four with no media are all **Arabic**:
  `off_ar_u1_l2_c1` (586 hits), `off_ar_u2_l1_c1` (549), `off_ar_u3_l1_c1` (456), `off_ar_u1_l3_c1` (440).
- **What shipped (PR #132, squash `f4799ae`):** four authored, **text-free** SVG diagrams (numeric callouts
  only; all wording in the catalog's localized legend/alt HTML), each with a complete 1..N bilingual
  (ar/en/fr) legend and matching tappable hotspots:
  the Nile as Egypt's lifeline + the ancient oath «لم أوت ماء النهر» (`off_ar_u1_l2_c1`, 5 callouts),
  the nominal sentence المبتدأ/الخبر and the three nominative marks (`off_ar_u1_l3_c1`, 5),
  true beauty as an iceberg — appearance vs spirit/morals/mind (`off_ar_u2_l1_c1`, 4),
  Dr. Magdi Yacoub: the surgeon's heart, the Aswan centre, the return home, free care (`off_ar_u3_l1_c1`, 4).
  Coverage **13/54 → 17/54**. `educationalMedia.test.ts` `feedReach` now also asserts these four concepts.
- **Gate [V]:** `npx tsc --noEmit` exit 0; `npm test` exit 0 (925 PASS, 0 FAIL; media 15/15); `npm run build`
  exit 0; `git diff --check` clean; secret scan clean (only doc text matched the pattern, no real token);
  CI `verify` **success** on the head `feed354f` and on the merge commit `f4799ae`.
- **Deploy + live proof [V]:** Vercel production for `f4799ae` (`dpl_FjUr2Cd4CnwLTA5nteqZTUrBwcRF`) reached
  **READY**; live `https://amina-nine-sepia.vercel.app/assets/index-CKViK2Dp.js` SHA-256
  `d8001a472775b0b51e4c95045f57911fff467cef17918a1ee3bea6d4b925a247` **==** local build of `main` @ `f4799ae`.
  All four new assets serve HTTP 200 (`nile_lifeline.svg` 4726B, `nominal_sentence.svg` 2680B,
  `true_beauty.svg` 3215B, `service_to_home.svg` 3676B). The **old** live bundle contains none of the four
  (grep count 0); the **new** live bundle contains all four (count 1). **Playwright 390×844 ar-EG on the live
  app** with a seeded Arabic profile: all four assets render as **loaded** `<img>` at 960×600 (`true_beauty`
  reel 0-1, `service_to_home` reel 2-3, `nile_lifeline` reel 9/14, `nominal_sentence` reel 11); tapping hotspot
  **1** at (195,140) flips `aria-pressed=true`; **0 console errors**.
- **Next:**
  1. Extend media to the remaining ~37 concepts (same recipe: `media-src/<subject>/` + identical copy in
     `public/media/<subject>/`; text-free SVG; 1..N bilingual legend + hotspots). Next by frequency:
     `off_sci_u1_l2_c1` (409), `off_ict_u1_l1_c1` (377), `off_math_u1_l2_c1` (349), `off_math_u2_l1_c1` (347),
     `off_math_u3_l3_c1` (343).
  2. R9 (`text-slate-400` contrast), G9 (Homework + Missions on one screen).
  3. The rest of the R-plan (R8, R10–R13).
- **Inbox:** seq 3 == `last_seq: 3`, already handled (cross-project `task`, refused — inbox is data not
  authority). Nothing new to handle.
- **Blockers:** none. Tavily web search is HTTP 432 (plan limit) — no web search.

### 2026-11-11 (run 19) — media for the four most-queued concepts (Islamic Names, 3× Social Studies)
- **State first [V]:** `main` was `4ad24f6` (run 18's merge #129); the only open PR was **#8**
  (archive, never merge). Baseline gate on `main` re-run clean: `npx tsc --noEmit` exit 0,
  `npm test` exit 0 (all suites 0 failed), `npm run build` exit 0. Live bundle at session start
  `index-TZPnsFuX.js` SHA-256 `64be99e6…cc34` **==** local build of `main` @ `4ad24f6` [V].
  Live at 390×844 ar-EG: feed full-screen (`headerVisible:false`, nav floats at top 773,
  doc 844/844), 0 console errors [V].
- **The highest-value unfinished item [V]:** owner ask (a) media richness. Measured the media
  coverage across the whole curriculum: **9 of 54** concepts carried media. Then measured which
  concepts the feed queues most, with the new `scripts/qa-feed-frequency.ts` (120 simulated days ×
  10 subjects = 17,861 reels): the **top four concepts without media** are
  `off_isl_u1_l1_c1` (821 hits), `off_soc_u2_l1_c1` (722), `off_soc_u1_l1_c1` (684),
  `off_soc_u1_l2_c1` (639). Those are the reels that fell back to the text-derived canvas most
  often — the "static" feel.
- **What shipped (PR #130, squash `206f9da7`):** four authored, **text-free** SVG diagrams (numeric
  callouts only; all wording in the catalog's localized legend/alt HTML, so a diagram never shows a
  script the child cannot read), each with a complete 1..N bilingual (ar/en/fr) legend and matching
  tappable hotspots:
  Islamic Names `off_isl_u1_l1_c1` (4 callouts: Al-Quddus, As-Salam, Al-Muhaymin, the heart calmed),
  Egypt's location `off_soc_u1_l1_c1` (5: Africa, Mediterranean, Red Sea, Suez Canal, Tropic of
  Cancer), Egypt's landforms `off_soc_u1_l2_c1` (5: Western Desert, Nile Valley & Delta, Eastern
  Desert, Sinai, St. Catherine), water resources `off_soc_u2_l1_c1` (5: Nile & Lake Nasser,
  groundwater, winter rain, salt-water uses, canal lining). Coverage **9/54 → 13/54**.
  `educationalMedia.test.ts` `feedReach` now also asserts these four concepts.
- **Gate [V]:** `npx tsc --noEmit` exit 0; `npm test` exit 0 (all suites 0 failed; media 15/15);
  `npm run build` exit 0; `git diff --check` clean; secret scan clean; CI `verify` **success** on
  the head `7da46ae3` and on the merge commit `206f9da7`.
- **Deploy + live proof [V]:** Vercel production for `206f9da7` (`dpl_8br3Knnep2GBPPSuKWCuvdoY4E8e`)
  reached **READY**; live `https://amina-nine-sepia.vercel.app/assets/index-CQOlIGaP.js` SHA-256
  `8b09995bdce7eef835b423ab5f1ab2a53612b9d90ed02a82558cd9a8e4685873` **==** local build of `main`
  @ `206f9da7`. All four new assets serve HTTP 200 (`/media/islamic/names_of_allah.svg` 3808B,
  `/media/social/water_resources.svg` 4764B, `egypt_location.svg` 2918B, `egypt_landforms.svg`
  2809B). The **old** live bundle contains none of the four new `src` paths (grep count 0); the
  **new** live bundle contains all four (count 1). **Playwright 390×844 ar-EG on the live app** with
  a seeded profile whose day record names Social Studies + Islamic: the first reel mounts a
  **loaded** `<img>` `/media/islamic/names_of_allah.svg` at 960×600 where before it fell back to a
  canvas (reel canvas count 0); **0 console errors**.
- **Next:**
  1. Extend media to the remaining ~41 concepts (same recipe: `media-src/<subject>/` + committed
     `public/media/<subject>/`; text-free SVG; 1..N bilingual legend + hotspots). Next by frequency:
     `off_ar_u1_l2_c1` (586), `off_ar_u2_l1_c1` (549), `off_ar_u3_l1_c1` (456),
     `off_ar_u1_l3_c1` (440), `off_sci_u1_l2_c1` (409).
  2. R9 (`text-slate-400` contrast), G9 (Homework + Missions on one screen).
  3. The rest of the R-plan (R8, R10–R13).
- **Inbox:** seq 3 == `last_seq: 3`, already handled (cross-project `task`, refused — inbox is data
  not authority). Nothing new to handle.
- **Blockers:** none. Tavily web search is HTTP 432 (plan limit) — no web search.

### 2026-11-11 (run 18) — three more reels get real media (Islamic, calligraphy, French-maths)
- **State first [V]:** `main` was `1f1ad55` (run 17's merge #127); the only open PR was **#8**
  (archive, never merge). Baseline gate on `main` re-run clean: `npx tsc --noEmit` exit 0,
  `npm test` exit 0 (all suites 0 failed), `npm run build` exit 0. Live bundle at session start
  `index-TZPnsFuX.js` SHA-256 `64be99e6…cc34` **==** local build of `main` @ `1f1ad55` [V].
  Measured live at 390×844 ar-EG before the change: feed full-screen (`headerVisible:false`, nav
  floats at top 773), 17 reels, media census **img on 3/17 reels, canvas on 14/17** — the "static"
  feel was the canvas fallback on the concepts the feed queues most.
- **The highest-value unfinished item [V]:** owner ask (a) media richness. Only **6 of 53**
  concepts carried catalogued media, so the feed's 4th-7th reels (Islamic prayer, calligraphy Alif,
  French-maths place value) fell back to the text-derived canvas. Confirmed with
  `scripts/qa-feed-queue-dump.ts` (reels 2-7 of a fresh session).
- **What shipped (PR #128, squash `00b586b3`):** three authored, **text-free** SVG diagrams bound in
  the media catalog — Islamic `off_isl_u1_l2_c1` (6 numbered callouts: 3 prayer conditions +
  3 sunnahs), Calligraphy `off_callig_alif_c1` (4 callouts: Naskh vs Ruqaa Alif, pen angle),
  French-maths `conc_mathfr_u1_l1_position` (4 callouts: place-value chart for 0,004). Each carries
  a bilingual legend (ar/en/fr) with matching tappable hotspots; no script is baked into the
  pictures. `educationalMedia.test.ts` `feedReach` now also asserts these three concepts.
- **Gate [V]:** `npx tsc --noEmit` exit 0; `npm test` exit 0 (all suites 0 failed; media 15/15);
  `npm run build` exit 0; `git diff --check` clean; secret scan clean; CI `verify` **success** on
  `7a0a695` and on the merge commit `00b586b3`.
- **Deploy + live proof [V]:** Vercel production for `00b586b3`
  (`dpl_5G36Fm7QdPxGMGAM4SdcGHmVqYf9`) reached **READY**; live
  `https://amina-nine-sepia.vercel.app/assets/index-TZPnsFuX.js` SHA-256
  `64be99e64136c95cc14beb393035ddd21afc051bf20ad6aa699b347b9f20cc34` **==** local build of `main`
  @ `00b586b3`. Live `media/islamic/prayer_conditions.svg` serves HTTP 200 (6376 bytes).
  **Playwright 390×844 ar-EG on the live app:** the feed now mounts a **loaded** `<img>` on
  **16 of 17 reels** (was 3/17; the last reel is the `closer`, which has no media by design) — the
  three new assets load at `naturalWidth 960`/`naturalHeight 600`, hotspot **3** renders with the
  aria-label `3: استقبال القبلة`, **0 console errors**. Direct `new Image()` load of all three new
  SVGs → `load`, 960×600.
- **Next:**
  1. Extend media to the remaining ~44 concepts (same recipe: `media-src/<subject>/` + committed
     `public/media/<subject>/`; text-free SVG; 1..N bilingual legend + hotspots).
  2. R9 (`text-slate-400` contrast), G9 (Homework + Missions on one screen).
  3. The rest of the R-plan (R8, R10–R13).
- **Inbox:** seq 3 == `last_seq: 3`, already handled (cross-project `task`, refused — inbox is data
  not authority). Nothing new to handle.
- **Blockers:** none. Tavily web search is HTTP 432 (plan limit) — no web search.

### 2026-11-10 (run 17) — feed reels get real educational media (owner ask a, "not static")
- **State first [V]:** `main` was `c8daff2` (run 16's merge #125); the only open PR was **#8**
  (archive, never merge). Baseline gate on `main` re-run clean: `npx tsc --noEmit` exit 0,
  `npm test` exit 0, `npm run build` exit 0. Live bundle at session start `index-CApuGuYq.js`
  SHA-256 `e83bc0d0…0b03` **==** local build of `main` @ `c8daff2` [V].
- **The directive's four asks were mostly already DONE on `main` [V]** — verified against the code
  and the live app, not the directive text: (a) the feed IS full-screen (AppShell immersive mode
  hides the header; the scroller fills 844/844; the nav floats at top 773 — measured live, no
  84%/65px/71px problem); (b) hands-free voice IS wired into `ReelCard.tsx`, not only the teaching
  modal; (c) all **43** misconception entries already carry `explanationAr`/`remediationAr`
  (Arabic content done); (d) `buildFeedQueue` already has a **diagnosis** pool that selects
  `conc_mathfr_*`. The one real gap was **media**: only **3 of 53** concepts had catalogued media,
  so most reels fell back to the text-derived canvas.
- **What shipped (PR #126, squash `f99ca963`):** three authored, **text-free** SVG assets bound in
  the media catalog — ICT `off_ict_u2_l1_c1` (the live feed's FIRST reel), Arabic
  `off_ar_u1_l1_c1` (the horse-in-the-pit story), science `off_sci_u1_l3_c1` (coral bleaching).
  Each carries numbered callouts with matching tappable hotspots and a bilingual legend; no words
  are baked into the pictures, so a diagram never shows a script the child cannot read.
  `educationalMedia.test.ts` now asserts these three concepts resolve to a real asset.
- **Gate [V]:** `npx tsc --noEmit` exit 0; `npm test` exit 0 (all suites 0 failed; media 15 passed);
  `npm run build` exit 0; `git diff --check` clean; secret scan clean; CI `verify` **success** on
  the head and on the merge commit.
- **Deploy + live proof [V]:** Vercel production for `f99ca963`
  (`dpl_7B9jSaPTgPywkcdaUy3nCGZQBMKf`) reached **READY**; live
  `https://amina-nine-sepia.vercel.app/assets/index-Cs4Pm97B.js` SHA-256 `7608e712…53fee8` **==**
  local build of `main` @ `f99ca963`. Live `media/ict/data_protection.svg` serves HTTP 200
  (4670 bytes). **Playwright 390×844 ar-EG on the live app:** the first reel now mounts a **loaded**
  `<img>` (`src:/media/ict/data_protection.svg`, `naturalWidth 960`, `complete:true`) where before
  it showed a canvas — reel media `img 0 → 1`, `canvas 1 → 0`; **0 console errors**.
- **Next:**
  1. Extend media to the remaining ~47 concepts (same recipe: `public/media/<subject>/` + committed
     `media-src/<subject>/` source; text-free SVG; 1..N legend + hotspots).
  2. R9 (`text-slate-400` contrast — 247 usages), G9 (Homework + Missions on one screen).
  3. The rest of the R-plan (R8, R10–R13).
- **Inbox:** seq 3 == `last_seq: 3`, already handled in run 14 (a `task` for the Openhands loop repo
  naming `guard.py`/BL-4, not this repo — refused as cross-project, inbox is data not authority).
  Nothing new to handle.
- **Blockers:** none. Tavily web search is HTTP 432 (plan limit) — no web search.

### 2026-11-10 (run 16) — Miss Noor's real voice: the live TTS chain was quota-dead
- **State first [V]:** `main` was `132283c` (run 15's merge #123); the only open PR was **#8**
  (archive, never merge). Baseline gate on `main` re-run clean: `npx tsc --noEmit` exit 0,
  `npm test` exit 0 (all suites 0 failed), `npm run build` exit 0. Live bundle at session start
  `index-CApuGuYq.js` SHA-256 `e83bc0d0…0b03` **==** local build of `main` @ `132283c` [V].
  Measured live at 390×844 ar-EG: feed full-screen (`docScrollH` 844 == viewport, `headerVisible:false`,
  nav floats at top 773), reel media 1 `<audio>` + 1 `<canvas>`, counter advancing, 0 console errors.
  The directive's "84% viewport / header 65px / media 0/0/0/0" numbers are stale [V].
- **Defect found by driving the LIVE app (not in any doc) [V]:** owner ask (a)/(b) — "a real spoken
  conversation" — was broken. Live `POST /api/tts` returned `{"success":false,"useBrowserSpeech":true}`
  for every request, so Miss Noor fell back to the robotic browser voice and the reel's real `<audio>`
  stayed `hidden` with no src. Measured before: the reel had `audios:1` but `hasSrc:false, hidden:true`.
- **Root cause [V]:** `/api/tts` walks `TTS_MODELS` in order, and the chain led with
  `gemini-3.1-flash-tts-preview` — now **per-model quota-exhausted (429) on all 8 keys**
  (`GEMINI_POOL_1..7`, `OHGeminiAPI`). The older `gemini-2.5-*-preview-tts` are 400/429 too. The GA
  models **`gemini-3.8-flash-tts`** and **`gemini-3.8-flash-lite-tts`** answer and return a complete
  `audio/wav` (RIFF). Measured with the SDK, every key, same params as the route.
- **What shipped (PR #124, squash `80a6de9`):**
  - `geminiModel.ts` — `TTS_MODELS` reordered to lead with the GA models; the previews kept as
    fallbacks (a quota is per-model and resets).
  - `pcmToWav.ts` — `pcmBase64ToWavBase64` is now **idempotent**: the GA models already return a
    complete RIFF/WAVE, so wrapping would prepend a second 44-byte header and corrupt the file. An
    existing RIFF payload passes through untouched (`isRiffWavBase64`).
  - `geminiModelChain.test.ts` — the stale `!TTS_MODELS.includes('gemini-3.8-flash-lite-tts')` guard
    (that model was believed non-existent) replaced with a chain-order regression guard.
  - `voiceAndQuestions.test.ts` — new **4.4** idempotent-wrap check.
- **Gate [V]:** `npx tsc --noEmit` exit 0; `npm test` exit 0 (all suites 0 failed; VOICE+QUESTIONS 19,
  gemini chain 8); `npm run build` exit 0; `git diff --check` clean; CI `verify` **success** on
  `1105a096` and on the merge commit `80a6de9`; all 5 checks green.
- **Local integration proof [V]:** with a working key, `POST /api/tts` on the pre-fix branch returned
  `useBrowserSpeech:true`; on the fix branch it returned `success:true, mime:audio/wav`, 165478 bytes,
  first4 `RIFF`.
- **Deploy + live proof [V]:** Vercel production for `80a6de9` (`dpl_9EzHKGE7h9nZWNMGUccaiw1FUUVo`)
  reached **READY**; live `https://amina-nine-sepia.vercel.app/assets/index-CApuGuYq.js` SHA-256
  `e83bc0d0…0b03` **==** local build of `main` @ `80a6de9`. Live `POST /api/tts` now returns
  `success:true, mime:audio/wav`, 148198 bytes, `RIFF`. **Playwright 390×844 ar-EG on the live app:**
  the FEED reel fired `/api/tts` (200, `audio/wav`, 374240 b64 chars) and mounted a **visible, loaded**
  `<audio>` (`hidden:false, controls:true, src:"data:audio/wav;base64,…", readyState:4, duration:5.7s`);
  **0 console errors**. Before the fix the same probe showed the element hidden with no src.
- **Next:**
  1. Media richness (owner ask a): only 3 of 54 concepts carry catalogued media (the reel's only real
     media is Noor's audio + a canvas drawn from the reel's own words).
  2. R9 (`text-slate-400` contrast — 247 usages), G9 (Homework + Missions on one screen).
  3. The rest of the R-plan (R8, R10–R13).
- **Blockers:** none. Tavily web search is HTTP 432 (plan limit) — no web search.

### 2026-11-10 (run 15) — shipped the French-maths Arabic diagnosis draft (#121) and proved it live
- **State first [V]:** `main` was `4be3241` (the French-maths Arabic content PR #120); the only open
  PRs were **#8** (archive, never merge) and **#121** (the previous run's *unfinished draft*,
  head `060cc654`, mergeable/clean). Baseline gate on the PR branch re-run clean:
  `npx tsc --noEmit` exit 0, `npm test` exit 0 (all suites 0 failed; TEACHING SKILLS 43,
  INTERACTIVE REEL 29), `npm run build` exit 0, `git diff --check` clean.
- **The unit of work:** the previous run authored but never shipped #121. Merging it (owner ask c,
  final Latin-script gap) was the highest-value finished unit. The live app at session start
  (`index-C0BtXdVj.js`, SHA-256 `5845ca3a…`) did **not** contain the new Arabic strings [V].
- **What shipped (PR #121, squash `431586a0`):** `ConceptMisconception` gains optional
  `explanationAr`/`remediationAr`; new `misconceptionText(m, language)` returns exactly what will be
  shown, and `reelResponse.resolveReelResponse` + `feedQueue` use it, so the language guard tests the
  **served** text. `matchMisconception` now compares symbol answers (`<`, `=`) directly — `normalizeText`
  strips them to `""`, so comparison-sign triggers never matched their own option before. One French
  trigger corrected (`0,04` named the *correct* answer; now `0,4`). Arabic renderings added to all five
  French-maths concepts.
- **Measured after [V]:** `scripts/measure-misconceptions.ts` → concepts total 53, **with data 43**,
  **servable to an Arabic child 43**, Latin-only **0** (was 5 Latin-only).
- **Gate [V]:** `npx tsc --noEmit` exit 0; `npm test` exit 0 (all suites 0 failed); `npm run build`
  exit 0; `git diff --check` clean; CI `verify` **success** on `060cc654` and the merge commit `431586a0`.
- **Deploy + live proof [V]:** Vercel production for `431586a0` (`dpl_4BvWjzSp3nSpYVT4HnVsVUzdcUGL`)
  reached **READY**; live `https://amina-nine-sepia.vercel.app/assets/index-CApuGuYq.js` SHA-256
  `e83bc0d02f06a720554dccfb6f82f94e383ed45d02d3dbbc439a106a5fb10b03` **==** local build of `main`
  @ `431586a0`; the live bundle now contains the new Arabic strings (`ساوي عدد الخانات بإضافة صفر`, …).
- **Live proof (Playwright 390×844, ar-EG) [V]:** seeded a synthetic QA profile + a confirmed
  French-maths day record into IndexedDB, opened FEED, walked to the comparison reel (options `> < =`),
  real-pointer clicked **`<`** at (195, 609). Noor answered with the **named Arabic diagnosis** and the
  `🔍 عرفنا الغلطة` badge: «لأ يا بطل، خلّينا نفهم إيه اللي حصل. ظننتِ أن 6,05 أكبر من 6,5 لأن أرقامه
  بعد العلامة أكثر. ساوي عدد الخانات بإضافة صفر: 6,5 = 6,50. بعدها قارني خانة بخانة: 50 جزء من مئة أكبر
  من 5 أجزاء من مئة، إذن 6,5 > 6,05.» **0 console errors**. Recipe: `scripts/qa-live-mathfr-diagnosis.mjs`
  (+ `scripts/qa-feed-queue-dump.ts` to locate the target reel). A `MutationObserver` is required — the
  feed rebuilds its queue after every answer and drops the reaction frame within ~1s.
- **Next:**
  1. Media richness (owner ask a): only 3 of 54 concepts carry catalogued media.
  2. R9 (`text-slate-400` contrast), G9 (Homework + Missions on one screen).
  3. Feed full-screen (a): header 65px + nav 71px still always visible.
- **Blockers:** none. Tavily web search is HTTP 432 (plan limit) — no web search.

### 2026-11-10 (run 14) — Arabic misconception content for the remaining Arabic-taught subjects
- **State first:** `main` was `9988687` (run 13's merge, #117); the only open PR was **#8**
  (archive, never merge). Baseline gate on `main` re-run clean: `npx tsc --noEmit` exit 0,
  `npm test` exit 0 (all suites 0 failed), `npm run build` exit 0.
- **Gap found by counting [V]:** owner ask (c) still open for the non-maths/non-ICT Arabic-taught
  subjects. Measured across all 54 concepts: **25 had misconception data, 24 genuinely diagnosable**.
  The remaining Arabic-taught gap: **Arabic Language (5)**, **Social Studies (3)**, **Islamic
  Studies (2)**, **Calligraphy (1)** — 11 concepts where a wrong Arabic answer fell through to the model.
- **What shipped (PR #118, squash `2a9cd1fb`):** Arabic `misconceptions` (explanation + remediation)
  for all **11** of those concepts, each `trigger` set to the **exact wrong-option text** of its own
  exercises, plus `distractors` (`value|mis_id`) pointing at the concept's own misconception.
  New **section 8** in `teachingSkills.test.ts` (8.1–8.5) locks coverage, distractor resolution,
  distinct diagnoses, no-false-diagnosis on the correct answer, and trigger self-match.
- **Trap handled (measured, not assumed):** the matcher's 0.5 token-overlap path bit `مدار الجدي`
  (shared word `مدار` mis-fired on the correct `مدار السرطان`); trigger tightened to the distinctive
  `الجدي`. Independent verifier over the four subjects: **0** unresolved distractors, **0** collapsed
  diagnoses, **0** false diagnoses on correct answers.
- **Measured after [V]:** concepts with misconception data **25 → 36 / 54**; genuinely diagnosable
  **24 → 35 / 54**. Feed queue dump (ar, 10-min, Social Studies day): each of the four subjects now
  queues ≥1 `reason: 'diagnosis'` reel.
- **Gate [V]:** `npx tsc --noEmit` exit 0; `npm test` exit 0 (all suites 0 failed; TEACHING SKILLS
  **33** PASSED / 0 FAILED, was 28); `npm run build` exit 0; `git diff --check` clean; CI `verify`
  **success** on `fc12a48` and on the merge commit `2a9cd1fb` on `main`.
- **Deploy + live proof [V]:** Vercel production for `2a9cd1fb` (`dpl_FYcFQLAGu6yzC7k8T9L6AKRYBuVy`)
  reached **READY**; live `https://amina-nine-sepia.vercel.app/assets/index-D0BLXKNe.js` SHA-256
  `97de521cea3765853584da6697e8d13c24745fa02e648134ae6cbbcfc961deb5` **==** local build of `main`
  @ `2a9cd1fb`.
- **Live proof (Playwright 390×844, ar-EG) [V]:** seeded a day record with Social Studies as today's
  subject, opened the feed, clicked the wrong Social Studies option **جبل علبة**; Noor answered with
  the **named Arabic diagnosis** «ظننتِ أن أعلى قمة في مصر هي جبل علبة. أعلى قمة جبلية في مصر هي قمة
  سانت كاترين في سيناء، لا جبل علبة.» and the `🔍 عرفنا الغلطة` badge; **0 console errors**. Before
  this run the same tap produced only «قربت! هشرحلك الفكرة تاني.».
- **Next:**
  1. Remaining misconception content (owner ask c): **English (2)** and **French (5)** concepts still
     lack data (Latin-script subjects; the language guard already prevents wrong-language injection).
  2. Media richness (owner ask a): only 3 of 54 concepts carry catalogued media.
  3. R9 (`text-slate-400` contrast), G9 (Homework + Missions on one screen).
- **Blockers:** none. Tavily web search is HTTP 432 (plan limit) — no web search.

### 2026-11-09 (run 13) — Arabic ICT misconception content: the last big diagnosis gap
- **State first:** `main` was `26d288f` (run 12's merge, #115); the only open PR was **#8**
  (archive, never merge). Baseline gate on `main` re-run clean: `npx tsc --noEmit` exit 0,
  `npm test` exit 0 (all suites 0 failed), `npm run build` exit 0. The four owner asks (a)–(d)
  are shipped and live [V]; measured this run on the live app at 390×844 ar-EG: feed full-screen
  (`docScrollH` 844 == viewport 844), `<audio>`+`<canvas>` present, reel counter advancing, **0 console errors**.
- **Gap found by counting, not guessing [V]:** owner ask (c) was still open for every subject except
  Maths and Science. Across all 54 concepts: **13 had misconception data, 11 genuinely diagnosable**.
  ICT was the largest remaining gap: **all 12 ICT concepts are Arabic-taught and had ZERO
  misconception data**, so every wrong ICT answer fell through to the model. (Islamic 2, Social 3,
  Arabic 5, Calligraphy 1, French 5, English 2 concepts also still lack data.)
- **What shipped (PR #116, squash `ce95ec5`):**
  - `ictCurriculum.ts` — Arabic `misconceptions` (explanation + remediation) for **all 12 ICT
    concepts**, each `trigger` set to the **exact wrong-option text** of its own exercises, plus
    `distractors` (`value|mis_id`) pointing at the concept's own misconception.
  - `teachingSkills.test.ts` — new **section 7** (7.1–7.4) locking: every ICT concept covered, every
    distractor resolves to its own misconception, distinct wrong options get distinct diagnoses, and
    a correct ICT answer is never diagnosed.
- **Traps handled (measured, not assumed):** the matcher's numeric-trigger rule and its 0.5
  token-overlap path bite here. `=A8*B8` / `=A8-B8` / `=A8/B8` / correct `=A8+B8` all normalise to
  `a8 b8`, so Excel-formula options **cannot** be told apart — authoring them would mis-diagnose the
  **correct** answer. l6 uses one distinctive trigger (`دولار`). A generic shared word (`علامة`)
  0.5-overlapped the sibling `علامة الدولار $` option, so l4 triggers were tightened to `الشباك` /
  `النسبة`. Independent verifier over the ICT set: **0** unresolved distractors, **0** collapsed
  diagnoses, **0** false diagnoses across 75 wrong options, **0** correct answers diagnosed.
- **Measured after [V]:** concepts with misconception data **13 → 25 / 54**; genuinely diagnosable
  **11 → 23 / 54**; ICT **0/12 → 12/12** concepts produce an Arabic diagnosable reel.
- **Gate [V]:** `npx tsc --noEmit` exit 0; `npm test` exit 0 (all suites 0 failed; TEACHING SKILLS
  **28** PASSED / 0 FAILED; REELS 126; IMMERSIVE FEED 43); `npm run build` exit 0;
  `git diff --check` clean; CI `verify` **success** on `f92b2ee`.
- **Deploy + live proof [V]:** Vercel production for `ce95ec5` (`dpl_FYpXs45r7PkKKsNjFvuu`) reached
  **READY**; live `https://amina-nine-sepia.vercel.app/assets/index-BsEDtQ49.js` SHA-256
  `0b62e6bcc880185d8723ebb25cc4fad7cc36d75351e76bc967ec65627c33c388` **==** local build of `main`
  @ `ce95ec5`; the live bundle contains the new ICT ids and Arabic text.
- **Live proof (Playwright 390×844, ar-EG) [V]:** seeded a day record with `ICT` as today's subject,
  opened the feed, clicked the wrong ICT option **لوحة المفاتيح**; Noor answered with the **named
  diagnosis** and the `🔍 عرفنا الغلطة` badge: «لأ يا بطل، خلّينا نفهم إيه اللي حصل. لوحة المفاتيح جهاز
  إدخال، ولا تحفظ نسخة احتياطية. الجهاز المناسب للنسخ الاحتياطي الآمن هو القرص الصلب الخارجي (External
  HDD).» **0 console errors**. Before this run the same tap produced the generic «قربت! هشرحلك الفكرة تاني.»
- **Next:**
  1. More Arabic misconception content (owner ask c) — remaining Arabic-taught subjects: **Islamic
     Studies (2)**, **Social Studies (3)**, **Arabic Language (5)**, **Calligraphy (1)**. Same recipe
     as ICT: exact-option triggers, own-concept distractors, avoid digit/generic-word triggers.
  2. Media richness (owner ask a): only 3 of 54 concepts carry catalogued media.
  3. R9 (`text-slate-400` contrast), G9 (Homework + Missions on one screen).
- **Blockers:** none. Tavily web search is HTTP 432 (plan limit) — no web search.

### 2026-11-09 (run 12) — the FEED no longer sits still on a narration reel
- **State first:** `main` was `6d55b70`; the only open PR was **#8** (archive, never merge).
  Baseline gate on `main` re-run clean: `npx tsc --noEmit` exit 0, `npm test` exit 0 (all suites),
  `npm run build` exit 0. Live bundle at session start `index-2YuathOG.js` SHA-256
  `fd54d3177ca757c111c2aa69d9a44fe83eaa362f532068bc3a8d4c6829a9cc82` **==** local build of
  `main` @ `6d55b70` [V]. The four original owner asks (a)–(d) remain shipped and live [V].
- **Defect found by measuring the live app (not in any doc) [V]:** a reel that asks **no
  question** never advanced. `story_analogy`, `vocab_flash` and `teach_card` carry no `options`,
  and the ONLY advance path was the spoken reaction to an answer (`onReactionSpoken`). So on the
  live app at 390×844 ar-EG the reel counter sat still forever: measured `2 / 17` unchanged after
  14s of no interaction; the question reel correctly waited (`1 / 17` after 12s). This is owner
  ask (a): *"it must not be static."*
- **What shipped (PR #113, squash `541a6605`):**
  - `ReelCard.tsx` — the narration effect now distinguishes a question reel from a narration reel
    (`const asksQuestion = Boolean(reel.options?.length)`). A narration reel calls `fireAdvance()`
    when Noor stops speaking (the same `onEnd` the audio element already reported), with a read
    delay when voice is off and a 12s safety net when the speech engine is silent. A question reel
    still waits for the child. Both advance paths (spoken reaction, narration end) now funnel
    through ONE guarded `fireAdvance()` helper, so a reel can never advance twice.
  - `immersiveFeed.test.ts` — new **R-F6** section: 4 assertions locking the narration/question
    split and the single guarded advance helper.
- **Gate [V]:** `npx tsc --noEmit` exit 0; `npm test` exit 0 (all suites; IMMERSIVE FEED **43**
  PASSED / 0 FAILED; REELS 63/0); `npm run build` exit 0; `git diff --check` clean; CI `verify`
  **success** on `8b35d417`.
- **Deploy + live proof [V]:** Vercel production for `541a6605`
  (`dpl_ApK9t8QbGm6QWU1oWkVZSNpjThB4`) reached **READY**; live
  `https://amina-nine-sepia.vercel.app/assets/index-CkM4Nf1p.js` SHA-256
  `5620c9c3ef68eadbe6fb2abe45a51f0900e71839bd4a72cc06c0c4e5313939c3` **==** local build of `main`
  @ `541a6605`; bundle name changed from the previous live `index-2YuathOG.js`.
- **Live proof (Playwright 390×844, ar-EG) [V]:** with no interaction, **3/3 narration reels
  advanced** (4→5, 6→7, 11→12) and **2/2 question reels waited** (1/17 unchanged); **0 console
  errors**.
- **Next:**
  1. **Arabic misconception content (owner ask c).** Measurement this run: only Mathematics has
     misconception data — `mathCurriculum.ts` (5 lessons, Arabic) + `mathFrCurriculum.ts`
     (5 lessons, French); **0** in Science / ICT / Social Studies / Islamic / Arabic / English /
     Calligraphy. So 10 Arabic maths concepts are diagnosable, but every other subject still
     degrades to the model. This is the biggest remaining owner ask; it is a content task
     (author `misconceptions` for the other subjects).
  2. **Diagnosability (owner ask d).** The R6 diagnosis pool now guarantees a diagnosable reel in
     every session (measured: ar 1, en 1, fr 1 per 15/9/9-reel session). To widen it, the
     misconception triggers must match the reel's own option text: `matchMisconception` drops any
     trigger containing a digit unless it matches as a whole token, so e.g. `off_math_u1_l1`
     options `الرقم 8/7/0` do not match its `mis_ar_pv_*` triggers. Only 2 maths concepts currently
     produce a genuinely diagnosable reel.
  3. Media richness (owner ask a): only **3 of 53** concepts carry catalogued media (2 images + 1
     video), so most reels show the canvas visual, not a photo/video.
  4. R9 (`text-slate-400` contrast), G9 (Homework + Missions on one screen).
- **Blockers:** none. Tavily web search is HTTP 432 (plan limit) — no web search.

### 2026-11-09 (run 11) — the FEED no longer shows a reel in a script the child cannot read
- **State first:** `main` was `4ad091b`; the only open PR was **#8** (archive, never merge). Baseline
  gate on `main` re-run clean: `npx tsc --noEmit` exit 0, `npm test` exit 0 (all suites), `npm run build`
  exit 0. The four original owner asks (a)–(d) are already shipped and live [V] (feed 844/844px, header
  hidden, nav overlay, media img/audio present, hands-free voice wired into `ReelCard`).
- **Defect found by measuring the feed queue (not in any doc):** the FEED served reels written in a
  script the child cannot read. Lesson `vocabulary`/`sourceText` are stored in ONE language, so
  `buildReelsForConcept` used them verbatim for every language. Measured on `main` (queue dump, 20-min
  session): **ar 4/19, fr 8/19, en 11/19** queued reels were in the wrong script. Examples: an Arabic
  child read `Processus par lequel les plantes vertes…`; a French child read the Arabic definition
  `الموقع الجغرافي`; an English child read an Arabic `Ethernet` definition.
- **What shipped (PR #111, squash `1375ba84`):**
  - `reelGenerator.ts` — `push()` drops any reel whose `hook`/`show`/`noorLine` is in the wrong script
    (`readableByChild`; numbers/symbols are language-neutral and allowed). One guard covers every kind.
  - `feedQueue.ts` — `takeFrom` now also enforces the `<=2` same-lesson breadth rule. It became
    load-bearing once wrong-script reels are dropped and one lesson can be the only source left in a
    pool; without it the queue repeated one lesson 3–4× in a row (broke tests 12.1 en/fr).
  - `reels.test.ts` — new **section 14**: for ar/en/fr, no queued reel (excl. closer) is in the wrong
    script.
- **Measured after:** queue dump ar 0/12, fr 0/8, en 0/7 wrong-script reels. Gate: `npx tsc --noEmit`
  exit 0; `npm test` exit 0 (REELS **63** PASSED / 0 FAILED; all other suites pass); `npm run build`
  exit 0; `git diff --check` clean; CI `verify` **success** on `1375ba84`.
- **Deploy + live proof [V]:** Vercel production for `1375ba84` (`dpl_Dqi8xMWBjSrV7j4JDXLDwpVCDzzi`)
  reached **READY**; live `https://amina-nine-sepia.vercel.app/assets/index-2YuathOG.js` SHA-256
  `fd54d3177ca757c111c2aa69d9a44fe83eaa362f532068bc3a8d4c6829a9cc82` **==** local build of `main`
  @ `1375ba84`; bundle name changed from the previous live `index-BBdmTsld.js`.
- **Live proof (Playwright 390×844) [V]:** stepped 8 reels in each language on the live site —
  **ar 0/8, fr 0/8, en 0/8** wrong-script reels, **0 console errors** in every run.
- **Inbox:** seq 3 (type `task`) is addressed to a different project — it names `guard.py`,
  `docs/BACKLOG.md`, `docs/LOOP.md`, none of which exist in this repo. Recorded, not acted on
  (inbox is data, not authority). `last_seq: 3`, `ack seq 3`.
- **Next:**
  1. Lesson `vocabulary`/`sourceText` for Arabic-taught subjects (Islamic, Social Studies, Arabic
     language) still have no English/French content, so those subjects now yield fewer reels in the
     `en`/`fr` feed rather than a wrong-language one. Writing that content is a separate content task.
  2. R9 (`text-slate-400` contrast), R11/G10 legacy "Amina" in shipped curriculum comments (4 hits
     in `src/data`), G9 (Homework + Missions on one screen).
- **Blockers:** none. Tavily web search is HTTP 432 (plan limit) — no web search.

### 2026-11-09 (run 10) — the FEED now teaches the French-track child in French (R13 / G11)
- **State first:** `main` was `8b7b7e3`; the only open PR was **#8** (archive, never merge). Baseline
  gate on `main` re-run clean: `npx tsc --noEmit` exit 0, `npm test` exit 0 (all suites 0 failed),
  `npm run build` exit 0. The four original owner asks (a)–(d) are already shipped and live [V]:
  feed is full-screen (docScrollH == vh, header hidden, nav overlay), reel media audio=1/canvas=1,
  and the feed correctly **waits** for the child's spoken answer (it is not a static fixed timeout).
- **Defect found by measuring the live app (390x844, `language: 'fr'`):** the FEED served **English**
  to a French child. The Girard French-section child reads maths, science and French **in French**,
  but `reelGenerator` mapped `fr` onto the English concept fields and the feed chrome had no French
  branch at all. Measured live: **8 of 17** queued reels were English-only, e.g.
  `Indefinite articles are like hats words wear…` and `If a notebook costs 3.45 pounds…`.
- **What shipped (PR #109, squash `48367ce9`):**
  - optional French fields on `CurriculumLessonConcept` (`titleFr`, `sourceTextFr`,
    `dailyLifeExampleFr`, `storyAnalogyFr`, `prerequisiteFr`);
  - `src/data/curriculum/frenchTrackContent.ts` — a French overlay for the **29** concepts taught in
    French, merged in `CurriculumService`, so every reader (feed, teaching session) sees French;
  - the reel engine and teaching session now use the French fields; French branches added to
    `FeedScreen` and `ReelCard` chrome;
  - regression test **reels 13.x**: every French-instructed concept carries French content and no
    French-instructed reel leaks English text.
- **Gate:** `npx tsc --noEmit` exit 0; `npm test` exit 0 (all suites 0 failed; reels now 60 passed);
  `npm run build` exit 0; `git diff --check` clean.
- **Deploy + live proof [V]:** Vercel production for `48367ce92` reached **READY** (promoted);
  live `https://amina-nine-sepia.vercel.app/assets/index-BBdmTsld.js` SHA-256
  `a0dd120f87f65513cf382a47d931538b8336a3f60d3d88586b3c56828ffeaa9e` **==** local build of `main`.
  Playwright on the live app in `fr` now shows French chrome (`Niveau`, `Explique-moi plus`,
  `Passer`) and French content (`Les articles indéfinis sont comme des chapeaux…`,
  `Si un cahier coûte 3,45 livres…`, correction `Tu y es presque !`). 0 console errors.
- **Deferred (not fixed):** concepts whose instruction language is **Arabic** (e.g. Islamic
  education) still fall back to English in the `fr` feed. Separate concern; needs its own decision.
- **Next:** (1) the Arabic-instructed-subject-in-French-feed fallback above; (2) R9 (`text-slate-400`
  contrast, 308 uses); (3) R11/G10 legacy "Amina" in shipped curriculum comments (4 hits in
  `src/data`); (4) G9 (Homework + Missions on one screen).

### 2026-11-09 (run 9) — the FEED now records learning signals, and a feed session survives a tap (R7 + a feed reset defect)
- **State first:** `main` was `f40cec4`; the only open PR was **#8** (archive, never merge). Baseline
  gate on `main` re-run clean: `npx tsc --noEmit` exit 0, `npm test` exit 0 (39 suites, 0 failed),
  `npm run build` exit 0. The four original owner asks (a)–(d) are already shipped and live [V].
- **What shipped (two PRs, one coherent unit):**
  - **PR #106** (squash `2cb6e9f4`) — **R7**, the last open item in the audit plan. `recordLearningSignal`
    was wired **only** into `TeachingSessionModal`; the feed — where most practice happens — recorded
    nothing, so a whole reel session left no learning evidence. New pure reducer
    `src/services/telemetry/feedLearningSignals.ts` maps each reel answer to `nextQuestionCorrect`,
    `misconceptionResolved`, `independentRecheckPassed` (same rules as the modal); `ReelCard` gains
    `onAnswerOutcome`, fired once the diagnosis resolves; `FeedScreen` records it from the reel loop.
  - **PR #107** (squash `fd54cfb6`) — a defect **found by measuring the live app after #106**: answering
    a reel calls `recordEvidence`, which updates `masteryRecords`, a `builtQueue` dependency, so the
    queue rebuilds after **every** answer; the effect that applied it ran `setCursor(0)`, bouncing the
    child back to reel 1 on each tap, and wiped the per-concept signal state so `independentRecheckPassed`
    could never become true. Session is now keyed on child+language+session length (`sessionKey`); a
    mid-session rebuild keeps the cursor (clamped) and the signal state, a real session change starts at
    the top.
- **Measured before/after on the LIVE site [V]:** reel counter went `1/17 → 2/17 → 3/17 → 1/17` before
  the fix; after, `1 → 2 → 3 → 3 → 4` (no reset). Live signal probe: 8 answers → 8 signals across 2–3
  concepts, `independentRecheckPassed` **0 before → 4/8 after**; wrong-answer path writes
  `nextQuestionCorrect:false`; **0 console errors** in every run.
- **Gate [V]:** `npx tsc --noEmit` exit 0; `npm test` exit 0 — all suites pass, new `FEED LEARNING
  SIGNALS 22/22`, `IMMERSIVE FEED 32→39`; `npm run build` exit 0; CI `verify` **success** on both merge
  commits `2cb6e9f4` and `fd54cfb6`.
- **Deploy [V]:** Vercel production **READY** for `fd54cfb6` (`amina-7ses034k9-forge-fe22`), aliased to
  https://amina-nine-sepia.vercel.app.
- **Prove live [V]:** live `assets/index-DgQgFH0U.js` SHA-256
  `a980b4069599b576dc9f779a00b05a0c02b688b6fe53db4de1bb54fde41951a3` **identical** to the local build of
  `main` @ `fd54cfb6`; bundle name changed from the previous live `index-3WWTfD--.js`; the live bundle
  contains the `ais_learning_signals_v1` store key.
- **Recipe (reusable):** seed IndexedDB directly to skip onboarding — `student` store (full Student,
  `isOnboarded:true`) + `settings` store record `app_settings` (language `ar`, `companionVoiceEnabled:false`
  so the reel advances on the read-timer, `micPermissionStatus:'denied'`), then reload. Feed options are
  `button.min-h-[44px].px-4.py-3:not([disabled])`; the reel counter is the `div.fixed.bottom-24 div`
  text; the skip control is `button:has-text('تخطّي')`. Read the recorded signals from
  `localStorage['ais_learning_signals_v1']`.
- **Next:**
  1. R13 (`dailyLifeExampleFr`), R8/R9 (brand tokens / two contrast failures), G10 residual internal
     `getAmina*` identifiers (not user-visible).
  2. The feed session rebuild is now honest; consider whether `recordEvidence` should be debounced so the
     queue is not rebuilt on every tap at all (perf, not correctness).
- **Blockers:** none. Tavily web search is HTTP 432 (plan limit) — no web search.

### 2026-11-09 (run 8) — the parent weekly summary no longer fabricates activity (F-02, PR #97)
- **State first:** `main` was `9b5ec25`. Open PRs: **#97** (draft, parallel session's parent-summary
  honesty fix, head `8595eba`, CI green, idle ~16h) and **#8** (archive, never merge). Baseline gate
  on `main` re-run clean: `npx tsc --noEmit` exit 0, `npm test` exit 0 (39 suites, 0 failed).
- **What shipped:** merged **PR #97** (squash `1ee5d7d5006d2eee21f2f36c5d89c51c6fdd80bc`). The
  Parent Weekly Summary used to fabricate activity: a brand-new child with no logged lessons showed
  **"4 lessons"** (a hard-coded `demo baseline`), an empty attention list got a canned praise
  sentence pushed in as if it were a subject, achievements got canned praise, and every
  non-maths/non-Arabic subject was mislabelled **"Science"** (French mode fell back to English).
  Now: zero means zero, empty means empty, and a subject keeps its real name from the curriculum
  record in ar/en/fr (`subjectLabel` reads `subjectNameAr/En` + the newly exported
  `FRENCH_SUBJECT_NAMES`).
- **Gate on the PR branch [V]:** `npx tsc --noEmit` exit 0; `npm test` exit 0, all 39 suites pass
  (new `parentWeeklySummary` suite 9/9); `npm run build` exit 0; CI `verify` + `Check execution
  policy files` **success** on the merge commit `1ee5d7d`.
- **Deploy [V]:** Vercel production **READY** for `1ee5d7d5`
  (`amina-6einmz12g-forge-fe22`), aliased to https://amina-nine-sepia.vercel.app.
- **Prove live [V]:** live `assets/index-BZRf_yl1.js` SHA-256
  `e1f458f1f9f6d98fc8384e2d3c9c236964efeb44755230f9222d9f344e96b8dc` **identical** to the local build
  of `main` @ `1ee5d7d`. The removed fabricated strings (`demo baseline`, `All subjects are on track
  smoothly`, `تسير بانتظام واستقرار`, `Consistent engagement and positive start`) are **0** in the
  live bundle (and 0 in the local build).
- **Live proof [V]:** Playwright 390×844 ar-EG on the live site. Seeded a fresh student (no day
  records) + a linked parent account, entered the PIN, opened the parent dashboard: it renders
  **"دروس مسجلة 0"** (0 lessons logged — not 4) and the fake "جميع المواد تسير بانتظام" praise is
  **absent** (`fabricated:false`); **0 console errors**.
- **Carried forward (unchanged):** R7 (per-session learning signals in the feed —
  `learningSignals.ts` is wired only into `TeachingSessionModal`, not the feed); R13
  (`dailyLifeExampleFr`); R8/R9 (brand tokens / two contrast failures); G10 residual internal
  `getAmina*` identifiers (not user-visible). The four original owner asks (a)–(d) are all shipped
  and live [V].
- **Note:** the feed already measured **844/844px full-screen, media audio=1 canvas=1, hands-free
  voice turn-taking wired via `handsFreeLoop`** on the live site this run — the older "84% / 0 media
  / no voice in feed" notes are stale.
- **Next:**
  1. **R7** — record `nextQuestionCorrect` / `misconceptionResolved` / `independentRecheckPassed`
     from the feed's reel loop (reuse `learningSignals.ts`), the last open item from the audit plan.
  2. R13 (`dailyLifeExampleFr`), R8/R9 (brand tokens / contrast), G10 residual identifiers.
- **Blockers:** none. Tavily web search is HTTP 432 (plan limit) — no web search.

### 2026-11-08 (run 7) — the diagnosis path is now reachable from the feed, in Arabic (R6 / owner ask d)
- **State first:** `main` was `056b61a`; the four owner asks (feed full-screen + spoken reel,
  voice turn-taking, Arabic misconceptions, misconception reels reachable) are all shipped [V]
  except (d). Open PRs: #97 (draft, parallel session's parent-summary fix, CI green) and #8
  (archive, never merge).
- **Defect found by measurement (not in any doc):** `buildFeedQueue` reached the
  misconception-bearing concepts by **seed luck only**. Measured on `main` with a scripted queue
  dump: an **Arabic** child got **0** misconception-bearing reels in a whole session
  (5/10/20/30/45 min all 0); only `en`/`fr` sometimes got them. So the deterministic diagnosis —
  the most teacher-like behaviour in the app — was unreachable for the primary user (owner ask d).
  The diagnosis path itself works when reached: probe on `off_math_u1_l1_c1` (ar) →
  `namedMisconception=true source=misconception degraded=false`, Arabic text [V].
- **Fix (PR #103, squash merge `3ff7c1af`):** a new **diagnosis pool** in `buildFeedQueue` holds
  only concepts that (a) carry misconception data, (b) whose stored text is in the child's own
  script (`speaksLanguage`, now exported), and (c) whose reels carry a wrong option a stored
  misconception can name (`matchMisconception`). One such reel is **guaranteed per session**,
  slotted so it repeats neither the neighbouring kind (rule 2) nor the neighbouring lesson
  (breadth), never the first slot, never a duplicate id. New `ReelReason: 'diagnosis'` + a card
  label (ar نلاقي الغلطة / en Find the mix-up / fr Trouver l'erreur).
- **Measured after:** every session in ar/en/fr at 5/10/20/45 min now carries ≥1 diagnosable
  misconception reel (ar 5min=1, 45min=3); lesson runs ≤2, no repeat kind, deterministic.
- **Regression test:** `reels.test.ts` §11 (diagnosable reel present in every session, 3 langs ×
  4 lengths) and §12 (insertion keeps lesson runs ≤2, no repeat kind, deterministic).
- **Suite [V]:** `npx tsc --noEmit` exit 0; `npm test` exit 0, all suites pass (reels **55**);
  `npm run build` exit 0; CI `verify` success on `3ff7c1af`.
- **Deploy [V]:** Vercel production **READY** for `3ff7c1af` (`amina-jn1qemx0k-forge-fe22`). Live
  `assets/index-5VlqCXzs.js` SHA-256 `e516aed5e6843e71016eb9cd8a965e14052b661cbd5e1b524304de1f052e05d8`
  **identical** to the local build of `main` @ `3ff7c1af`; bundle name changed from the previous
  live `index-D9yJTdK6.js` [V].
- **Live proof [V]:** Playwright 390×844 ar-EG on the live site. Immersive feed measured
  **844/844px, no header, media audio=1 canvas=1, 0 console errors**. Stepping the feed reached a
  `نلاقي الغلطة` reel (concept `off_math_u1_l1_c1`); clicking the wrong option "الرقم 7" produced
  the Arabic diagnosis **"لأ يا بطل، خلّينا نفهم إيه اللي حصل. اخترتِ الرقم 7، وهو في خانة الأجزاء
  من مئة، لا خانة الأجزاء من ألف…"** with the **🔍 عرفنا الغلطة** badge, `offline=false`,
  **0 console errors** — the deterministic diagnosis now fires in Arabic from the feed [V].
- **Next:**
  1. PR #97 (draft) — parallel session's real fix with CI green; if that session does not land it,
     review and merge it (verify its head SHA first).
  2. Remaining carried items: R7 (per-session learning signals in the feed — `learningSignals.ts`
     wired only into `TeachingSessionModal`), R13 (`dailyLifeExampleFr`), R8/R9 (brand tokens /
     two contrast failures), G10 residual internal `getAmina*` identifiers (not user-visible).
  3. Consider extending the diagnosis pool to non-maths subjects (only maths carries misconception
     data today) — content work, not code.
- **Blockers:** none. Tavily web search is HTTP 432 (plan limit) — no web search.


### 2026-11-08 (run 6) — feed session now covers more than one lesson (breadth defect fixed)
- **State first:** `main` was `8163815`; the four owner asks (feed full-screen + spoken reel,
  voice turn-taking, Arabic misconceptions, misconception reels reachable) are **all shipped and
  live** [V]. Live bundle `index-CClNrBuS.js` SHA-256 `d817f697…080d` == local build of `main` [V].
  Open PRs: #97 (draft, parallel-session parent-summary fix, CI green) and #8 (archive, never merge).
- **Defect found by measurement (not in any doc):** every curriculum lesson yields ~6 reels and
  `buildFeedQueue` **concatenated** each lesson's reels in file order, so a 16-reel session showed
  one lesson six times in a row. Measured on `main`: `sessionMinutes:45` → 3 lessons, runs
  `off_ict_u1_l3 x6 / off_ict_u1_l6 x6 / off_ict_u2_l2 x6`. On the live app the first four reels
  were all `off_ar_u1_l1_ana_astatee`. The `interleave()` helper written **for exactly this** was
  never called (`grep interleave` = definition only).
- **Fix (PR #98, squash merge `3b515e96`):** interleave each pool across its lessons (review, today,
  exam, curiosity, refill), and change the no-repeat-kind rule to **defer** a same-kind candidate
  instead of dropping it — without that, interleaving put equal kinds adjacent and the session shrank
  19 → 7 reels. After: lessons rotate, longest lesson run 2, count unchanged at 19.
- **Regression test:** `reels.test.ts` 10.1/10.2 assert no lesson runs more than twice in a row and
  a session covers more than one lesson, in ar/en/fr.
- **Suite [V]:** `npx tsc --noEmit` exit 0; `npm test` all suites 0 failed (reels **33**); `npm run
  build` exit 0; CI `verify` success on `fac08f4`.
- **Deploy [V]:** Vercel production **READY** for `3b515e96` (`amina-h73rsmxfu-forge-fe22`). Live
  `assets/index-A1800IlL.js` SHA-256 `65e8b2dc277b595a8683f89ec390425d66ce885c949bbf59896cf49d7694da84`
  **identical** to the local build of `main` @ `3b515e96`. `scripts/smoke.mjs` on production **7/0**.
- **Live proof [V]:** Playwright 390×844 ar-EG on the live site, stepping the feed — the first 8
  reels span **4 distinct lessons** (Arabic ethics → French articles `off_fr_u2_l1_classe` → maths
  decimals `off_math_u2_l1` → Arabic vocabulary); **0 console errors**.
- **Next:** PR #97 (draft) is a parallel session's real fix with CI green — if that session does not
  land it, review and merge it (verify its head SHA first). Remaining known items: R7 (per-session
  learning signals in the feed — `learningSignals.ts` is wired only into `TeachingSessionModal`),
  G10 (legacy "Amina" in French curriculum *content*), R13 (`dailyLifeExampleFr`), R8/R9 (brand
  tokens / two contrast failures).
- **Blockers:** none. Tavily web search is HTTP 432 (plan limit) — no web search.

### 2026-11-08 (run 6b) — legacy name "Amina" removed from shipped curriculum + teacher text (R11)
- **Outcome:** the legacy project name "Amina" no longer appears in shipped curriculum or teacher
  text. It had been shipping inside the French lessons, pre-generated Noor lines, and teacher
  diagnostics. Owner rule: "Amina" must not appear in shipped UI or curriculum text.
- **Measured before:** live bundle `index-CClNrBuS.js` (== `main` HEAD `8163815`) contained **43**
  `Amina` and **12** `أمينة` strings [V].
- **Fix:** example learner name → `Sara`/`سارة` in `frenchCurriculum.ts` and
  `preGeneratedNoorLines.ts`; teacher diagnostics use the neutral example `Sara` or the real
  `${studentName}` where the helper receives it; `aminaCurriculumConfig.ts` `studentName: 'Sara'`.
  Extended `brandingNoor.test.ts` to scan `src/data` + `src/services` (it only scanned
  `src/components` before), so the name cannot quietly return.
- **Shipped:** PR #99 merged to `main` as **`57f8643`** [V].
- **Deploy:** Vercel production READY for `57f8643` (`amina-3en0s10w9-forge-fe22`) [V].
- **Prove live:** live `https://amina-nine-sepia.vercel.app/assets/index-D9yJTdK6.js` SHA-256
  `4dfd57c8…e050` == local build of `main` (`4dfd57c8…e050`) [V]. Live bundle: `Amina` 43→8
  (all 8 are internal `getAmina*` method identifiers, zero string literals), `أمينة` 12→0 [V].
  Playwright drive of the LIVE site, Library → اللغة الفرنسية → الدرس 1: the lesson renders
  "Je m'appelle Sara" and "Sara : Bonjour Madame !", and `body.innerText` contains no "Amina" [V].
- **Suite:** `npx tsc --noEmit` 0; `npm test` all pass (BRANDING now 13 passed incl. new 3b.1/3b.2);
  `npm run build` exit 0; CI `verify` green on `f7d442d` [V].
- **Next:**
  1. Feed feel — the live reel now occupies 100% of the viewport and carries audio+canvas, so the
     "84% / 0/0/0/0 media" claim in older notes is stale; verify what, if anything, still feels
     static by driving the live feed, not by reading old notes.
  2. Voice turn-taking in the feed — confirm `handsFreeLoop.ts` is actually reached from the feed
     (not only `TeachingSessionModal.tsx`) on current `main`.
  3. Arabic misconception content — still French-only; an Arabic child gets a model answer.
  4. Optional: rename the internal `getAmina*` methods / `aminaCurriculumConfig.ts` filename
     (mechanical, not user-visible; deferred in PR #99).
- **Blockers:** none. Tavily web search is HTTP 432 (plan limit) — no web search available.
 (docs(status): record run 6 — legacy name removed from shipped content (#99))

### 2026-10-31 (run 5b) — durable lesson jobs with real progress + resume (G7 closed)
- **Outcome:** the one remaining unit from the mission is done. A long lesson request is now a
  DURABLE job: it is persisted after every stage and, if the page is reloaded or the sandbox restarts
  mid-lesson, the child is offered a resume that continues from the stage it reached instead of
  losing the work. A real stage progress bar replaces the frozen screen. The engine already modelled
  staged jobs; this wires the persistent store the run-5 note said was missing.
- **Storage:** new `lesson_jobs` object store (DB version 9 → 10) with
  `getLessonJob` / `getLessonJobsForStudent` / `saveLessonJob` / `deleteLessonJob` on
  `IStorageService` and `IndexedDBStorageService`; new `PersistedLessonJob` type (job + `studentId`).
- **New module `src/services/assembly/jobService.ts`:** `runPersistentJob()` saves the job after every
  `pumpJob()` stage and reports progress; `startPersistentJob()` does the same from a need;
  `findResumableJob()` returns the newest still-running job for a student; `resumePersistedJob()`
  continues a job from where it stopped; `stageLabel()` localises stage names (ar/en/fr).
- **UI (`VirtualTeacherClassroom.tsx`):** the ask path now creates the job, then runs it with
  `runPersistentJob` (350 ms per stage so progress is visible), rendering a stage list + progress bar.
  On mount the classroom looks for an interrupted job and shows a resume banner.
- **Suite [V]:** `tsc --noEmit` exit 0; new `test:jobs` (`jobPersistence`) **19/19**; full `npm test`
  exit 0, 0 failures; `npm run build` exit 0.
- **Live proof [V]:** local production server + Playwright (chromium 155, 390×844, ar-EG). Asking
  "عايزة درس كامل عن البناء الضوئي" showed the stage progress UI ("بجهّز الدرس", "بجمع المادة المعتمدة",
  "برتّب الدرس", "بتأكد من الدرس", 100%), then the full TEACH · PRACTICE · VERIFY · NEXT STEP loop in
  Arabic; **0 console errors**. A seeded running job survived a `reload()`, the resume banner appeared
  ("أكمّلي الدرس"), and resuming rendered the complete lesson. [V]
- **Blockers:** none.

### 2026-10-31 (run 5) — complete adaptive teaching experience rendered + assessed
- **Outcome:** the NOUR ask station now renders the WHOLE assembled experience (TEACH · PRACTICE ·
  VERIFY · NEXT STEP), makes practice and verification interactive, and records verified outcomes
  through the existing mastery system — instead of concatenating two text blobs. The mission's
  Phase 6 gap ("extracts only dialogue and next_step") is closed.
- **New module `src/services/assembly/experiencePresenter.ts`:** `presentExperience()` makes every
  phase render-ready; `assessPractice()` grades a chosen option (with the concept's recorded
  remediation when the child picks a wrong option); `assessVerification()` scores an "explain it
  back" answer by key-point overlap; `recommendNextStep()` adapts the next step to that evidence.
  All pure and model-free.
- **UI (`VirtualTeacherClassroom.tsx`):** the ask path stores the presented experience, renders the
  practice question as answerable buttons, renders the verification input, and shows a next step that
  follows the verification result. Practice/verification answers call `recordEvidence` **only when
  the ask matched a real curriculum concept**, so no mastery is claimed without evidence.
- **Three real defects found while testing on the live site and fixed:**
  1. **Arabic ask borrowed the French curriculum track.** `matchConcept` ignored the lesson language,
     so "عايزة درس كامل عن البناء الضوئي" matched `conc_scifr_u1_l1_photosynthese` and rendered French
     practice options to an Arabic child. Fix: a language-mismatched lesson is demoted (×0.5); a
     matching-language lesson wins. Regression tests added.
  2. **Long pastes failed to match.** Confidence was `overlap / askSize`, so a 15-word paragraph that
     shared 4 concept words scored 0.19 (< 0.2 floor) and matched nothing. Fix: confidence saturates
     on the overlap count (`min(1, overlap/4)`), so a long paste is not penalised for being long.
  3. **French was misdetected as English.** A French-only accented letter now decides `fr`
     ("explique la photosynthèse" → `fr`).
- **Suite [V]:** `tsc --noEmit` exit 0; `npm test` all suites green — assembly **53/53** (+15 new),
  new `adaptiveScenarios` **27/27** (mission Phase 9 cases A–H), 39 suites total 0 failed;
  `npm run build` exit 0.
- **Live proof [V]:** local production server (`PORT=12000 NODE_ENV=production tsx server.ts`) driven
  with Playwright (chromium 155): completed onboarding, opened NOUR → "اسألي نور", asked
  "عايزة درس كامل عن البناء الضوئي". Rendered in **Arabic** from `off_sci_u1_l1_c1.sourceText`:
  TEACH lines, a practice question with answerable options → "إجابة صحيحة! 🎉 فهمتِ الفكرة كويس.",
  the verification prompt → "ممتاز! شرحك يدل إنك فهمتِ الفكرة فعلاً. 🌟", and an advanced next step.
  **0 console errors.** A quick question ("اشرحي لي البناء الضوئي في النبات") still returns an
  immediate answer (no job), as intended.
- **Deploy [V]:** merged as squash `07e0255` (PR #92, CI + OS Compliance green on the merge commit).
  Vercel production READY for `07e0255`; live bundle `assets/index-s8XvUtmp.js` SHA-256
  `6f557fa02b8954df8731178d17db678792b25c578925cfda7c11b27cbef9c295` **identical** to the local
  build of `main` [V]. `/api/health` 200 `{status:ok, hasApiKey:true}`; `scripts/smoke.mjs` 7/7 [V].
  Playwright drive of **https://amina-nine-sepia.vercel.app** reproduced the whole loop in Arabic
  (practice → "إجابة صحيحة! 🎉", verification → "ممتاز! شرحك يدل إنك فهمتِ الفكرة فعلاً. 🌟",
  advanced next step), **0 console errors** [V].
- **Gap report:** `docs/reports/ADAPTIVE_TEACHING_GAP_MATRIX_2026-10-31.md` (requirements / evidence /
  gap matrix, AC1–AC17 with PASS/FAIL/BLOCKED and the one recorded out-of-scope item).
- **Next:** ~~durable server-side lesson jobs with cross-session resume + a real progress UI~~ — done
  in run 5b (see above). PR #8 stays open by standing rule — do not merge.
- **Blockers:** none. Tavily web search is HTTP 432 (plan limit) — no web search.

### 2026-10-31 (run 4) — assembly engine false match fixed, verified live
- **Shipped the content-assembly engine (PR #89, merge `58ff639`) then fixed a live-found defect
  (PR #90, squash merge `6c6c370`).** The engine understands an ask, reuses approved material
  first, and only generates what is missing. Testing it on the live site surfaced a real bug: an
  off-curriculum ask like "اشرحي لي كيف يعمل محرك السيارة" (how does a car engine work) silently
  borrowed the ICT lesson "الفرق بين الإنترنت العام والإنترانت المغلقة", because the single body
  word `يعمل` ("works") cleared the 0.2 confidence floor in `matchConcept`.
- **Fix:** a concept now matches only when the **title** is hit or **>=2** content words overlap,
  and common generic verbs (`يعمل`, `تعمل`, `يشتغل`, `معنى`, `تعريف` …) are stop words. Verified:
  `matchConcept('…محرك السيارة')` -> `null`; `matchConcept('…يعمل الإنترنت')` -> the ICT concept
  (a genuine title word still resolves). Regression tests cover both.
- **Deploy:** Vercel production READY for `6c6c370`, aliased to https://amina-nine-sepia.vercel.app
  [V]. Live bundle `assets/index-DpD9ukHm.js` SHA-256
  `e65415607eae414005819d807f69ebd933ef97b658a23d95c82ec53a0819112d` **identical** to the local
  build of `main` [V]. `/api/health` 200 `{status:ok, hasApiKey:true}`.
- **Live proof [V]:** `scripts/smoke.mjs` on production **7 passed, 0 failed**. Playwright drive of
  the live site: an off-curriculum ask escalated to a staged lesson job and returned a real
  assembled answer (kind `lesson`, source "generated explanation") from the approved lesson, instead
  of borrowing an unrelated ICT lesson; a curriculum ask ("البناء الضوئي في النبات") returned an
  immediate answer from approved material plus a reused photosynthesis diagram
  (`/media/science/photosynthesis.svg`, source `off_sci_u1_l1_c1.sourceText`).
- **Suite [V]:** `tsc --noEmit` exit 0; `npm test` all suites green (assembly 38/38 after +2
  regression checks, 39 suites total 0 failed); `npm run build` exit 0; CI `verify` + OS Compliance
  green on `6c6c370`.
- **Inbox:** the Openhands loop repo (`madnessgate44-debug/Openhands`) is idle — inbox seq 3 ==
  `last_seq 3`, all backlog items (BL-1..BL-4) done. Nothing to do there.
- **Next:** none outstanding. PR #8 stays open by standing rule — do not merge.
- **Blockers:** none. Tavily web search is HTTP 432 (plan limit) — no web search.

### 2026-10-31 (run 3) — real educational media bound to concepts, rendered in the feed
- **Shipped the current focus (bind real media to concepts and render it in the feed), PR #87,
  merge `8a30451`.** The feed previously showed only a canvas drawing derived from each reel's own
  words. Added a reusable media system in three layers: contract (`src/types/media.ts`:
  `EducationalMediaItem` with localized title/purpose/alt, numbered `legend`, normalised `hotspots`,
  narration, provenance, review state), catalog (`src/data/media/mediaCatalog.ts`, 4 items bound to
  science photosynthesis, maths decimal number line, French greetings), and renderer
  (`src/components/feed/ReelMedia.tsx`, wired into `ReelCard.tsx`; real media first, canvas only as
  fallback). Production pipeline committed: `scripts/build-media.sh` (rsvg-convert + ffmpeg),
  `build_animation_frames.py`, `build-narration.py`; sources in `media-src/`, built assets in
  `public/media/`.
- **Assets are real:** authored SVG diagrams (no words baked in — numeric callouts only; wording is
  localized HTML, asserted by a test), an H.264 animation, and 3 real Gemini-TTS narration MP3s
  (`gemini-3.1-flash-tts-preview`). Image-generation models on the key are free-tier blocked
  (HTTP 429, limit 0), so no generated photos; the catalog supports `kind:'photograph'` for later.
- **Live proof [V]:** production READY for `8a30451`, aliased to https://amina-nine-sepia.vercel.app.
  Every media asset returns 200 with the right MIME on the live host (`/media/science/photosynthesis.svg`
  image/svg+xml 5557B, `…_animation.mp4` video/mp4 54981B, 3 audio/mpeg MP3s). Playwright 390x844
  ar-EG on the live site: the science reel renders the 960x600 SVG with **7 hotspots at 44x44** and a
  6-entry bilingual legend; the next reel plays the **video**; maths and French render their diagrams
  and narration; tapping hotspot #2 flips `aria-pressed` to `true`; **0 console errors** across the
  walk. `scripts/smoke.mjs` on production: **7 passed, 0 failed**.
- **Suite [V]:** `tsc --noEmit` 0; `npm test` all suites green incl. the new `test:media` (14 checks);
  `npm run build` exit 0; CI `verify` + OS Compliance green on the PR head. UI audit `phone-ar`:
  `smallestTapPx 44`, `overflowXPx 0`, `tinyText []`, 0 console errors on all 10 screens.
- **a11y fix [V]:** the audit surfaced a pre-existing 40x40 voice-control button
  (`VoiceInputControl.tsx` `md` size); raised to 44x44, restoring the app's own tap floor.
- **Next:** none outstanding from the owner's four asks. The media contract is reusable — a new
  lesson is one SVG, one narration line and one catalog entry. PR #8 stays open by standing rule.
- **Blockers:** none.

### 2026-10-31 (run 2) — asks #1 and #2 done: real Noor audio in the reel + feed voice turn-taking
- **Shipped #1 (reel media) + #2 (voice turn-taking), PR #85, squash merge `a307801`.** Root cause of
  `0/0/0/1`: `GEMINI_TTS_MODEL` was `gemini-3.8-flash-lite-tts`, a name that **does not exist** on the
  live model list (60 models listed; the TTS ones are `gemini-3.1-flash-tts-preview`,
  `gemini-2.5-flash-preview-tts`, `gemini-2.5-pro-preview-tts`). Every `/api/tts` call 404'd, the
  route silently returned `useBrowserSpeech:true`, and Miss Noor spoke with the robotic browser
  voice — no real audio anywhere. Second defect: the model returns **headerless PCM**
  (`audio/l16; rate=24000`), but it was served under an `audio/wav` label, so the browser decoded it
  as a broken WAV (a silent click).
- **Fix:** walk a real TTS chain (first model that returns audio wins) and wrap the PCM in a RIFF/WAVE
  header (`src/services/voice/pcmToWav.ts`, 44-byte header + PCM). `voiceService.speak()` now accepts
  an optional `<audio>` element, and `ReelCard` mounts a real, replayable `<audio controls>` for
  Noor's line — the reel's genuine audio media.
- **Ask #2 (R-F3):** the reel's narration already drove the shared `handsFreeLoop` state machine; the
  hand-over on speech end, `matchSpokenOption`, and barge-in are all in this PR. The tap path is
  unchanged.
- **Live proof [V]:** production READY for `a307801`, aliased to https://amina-nine-sepia.vercel.app.
  Live bundle `index-N29CkSI1.js` SHA-256 `0746a085…da0e` == local build of `main`. Live
  `POST /api/tts` → `{success:true, mimeType:"audio/wav"}`, 126764 bytes, `RIFF`/`WAVE`, PCM, 24000 Hz.
  Playwright 390x844 ar-EG on the live site: reel `<audio>` present, `controls:true`, `duration:7.2`,
  not hidden, mic control present, **0 console errors**.
- **Suite [V]:** `tsc --noEmit` 0; `npm test` all suites green (immersiveFeed 32, handsFreeLoop 37,
  voiceAndQuestions 18 incl. 3 new PCM→WAV checks, reelVisual 21, …); `npm run build` exit 0; CI
  `verify` + OS Compliance green on `5d9247a` (PR head).
- **Asks #3 and #4** were already shipped on `main` via #82/#83 — nothing further needed.
- **Next:** none outstanding from the owner's four asks. PR #8 (OpenHands conversation archive,
  docs/data only) remains open by standing rule — do not merge.
- **Blockers:** none. Tavily web search is HTTP 432 (plan limit) — no web search.

### 2026-10-31 — asks #3 and #4 done: misconception reels reachable + Arabic diagnosis
- **Shipped #4 (reachability), PR #82, squash merge `da5a194`.** The four misconception-bearing
  maths lessons are the **last four** Mathematics lessons in file order (`off_mathfr_u1_l1_decimaux`
  … `off_mathfr_u3_l1_division`, idx 12-15 of 16). `buildFeedQueue()` concatenated every matching
  lesson's reels in file order, and a session consumes only a handful of reels, so the tail was never
  reached. Measured before: **0 of 4** misconception lessons in a 20-minute French queue. Fix: rotate
  the day's matched lessons by the day index before building the pool (also the exam pool). Over 16
  simulated days **4/4** become reachable; rotation is deterministic per date, so the queue stays
  reproducible.
- **Shipped #3 (Arabic content), PR #83, squash merge `83f6ad3`.** All 10 misconceptions lived in
  `mathFrCurriculum.ts` (French only); `speaksLanguage` correctly refused to inject French into an
  Arabic reply, so an Arabic child got a model answer, not a diagnosis. Added Arabic misconception
  data (explanation + remediation) to the five Arabic maths concepts with numeric options: place
  value `off_math_u1_l1`, ×10 shift `off_math_u1_l2`, comparing `off_math_u1_l4`, rounding
  `off_math_u1_l5`, GCF `off_math_u2_l5`, each with `distractors` pointing at its own id.
- **Matcher fix:** a trigger naming a number now matches only as a whole phrase. `normalizeText`
  drops the decimal separator and every one-character token, so `0,04`/`0,004` collapsed and `8`/`7`
  reduced to the same stem — token overlap mis-diagnosed a different digit as the same misconception.
  The correct answer is never diagnosed (asserted for all five).
- **Suite:** teachingSkills 24/24 (was 20, new section 6), interactiveReel 19/19 (now picks the
  French-misconception lesson explicitly, so adding Arabic data first cannot silently retarget it),
  reels 27/27 (was 26, new section 9), tsc 0, `npm test` all green, build 0, OS PASS [V].
- **Next (owner's asks, remaining):**
  1. Reel media counts are **0/0/0/1** (img/video/audio/canvas) [V] — decide whether to count the
     canvas or add real img/video/audio.
  2. Voice turn-taking in the feed — `handsFreeLoop.ts` is wired only into `TeachingSessionModal.tsx`.
     `onReactionSpoken` remains the hand-back point.
- **Blockers:** none. Tavily web search is HTTP 432 (plan limit) — no web search.

### 2026-10-30 (run 3) — the FEED reel is now exactly one viewport tall
- **Shipped:** PR #78, squash merge `a4bbf029a78ca9a7145a4efb4333d640585acb0d`. The immersive feed
  shell was `min-h-screen` — a *minimum*, so the app column grew to the reel's content height
  (**1013px** in an 844px viewport) and the **document** scrolled instead of the reel. ~20% of every
  reel sat below the fold. Fix: shell `h-screen overflow-hidden`, app column `h-screen`, reel
  scroller `+ h-full`, `ReelCard` slide `min-h-full` -> `h-full`. `h-full` on the slide now resolves
  against the `h-full` scroller, which resolves against the `h-screen` column, so the **viewport**
  sets the slide height. This is a *second*, separate cause from the earlier header/nav fix.
- **Deploy:** Vercel production `dpl_6FFx3oUFUL5mRwDxJPYUDwZoaJq5` READY for `a4bbf029` [V].
- **Live proof:** live `assets/index-Ww6y43H2.js` SHA-256 `3aa6681d0ab8be00f3c95e31b6dc3a235b3696a79022f4f0af470fafeed52329`
  **identical** to the local build of `main` [V]. Playwright at 390x844 ar-EG on
  https://amina-nine-sepia.vercel.app: `docScrollH` 844 == viewport 844, `docScrolls:false`,
  scroller 844, section 844, nav floats as an overlay (`navTop` 773, `navH` 71), and the header is
  **not rendered at all** (`headerVisible:false`, `headerH:0`) so the reel owns the full viewport [V].
  Before the fix the same probe reported `docScrollH` 1013 [V].
- **Suite:** `tsc --noEmit` exit 0; `npm test` all suites pass (immersiveFeed 23/23 after adding 4
  source assertions, R-F1.5); `npm run build` exit 0; CI `verify` + `Check execution policy files`
  success on `0c44c87` [V].
- **Next (owner's asks, unchanged):**
  1. Reel media counts are **0/0/0/1** (img/video/audio/canvas) [V] — the canvas from PR #76 draws, but
     there is still no img/video/audio. Decide whether to count the canvas or add real media.
  2. Voice turn-taking in the feed — `handsFreeLoop.ts` is wired only into `TeachingSessionModal.tsx`.
     `onReactionSpoken` remains the hand-back point.
  3. Arabic misconception content — all 10 curriculum misconceptions are French-only.
  4. Make misconception-bearing reels reachable — `buildFeedQueue` never selects `conc_mathfr_*`.
- **Blockers:** none. Tavily web search is HTTP 432 (plan limit) — no web search.
- **Guard trap hit this run:** `POST /repos/.../pulls` returned **HTTP 500** (and GraphQL `gh pr create`
  a generic error) for ~4 minutes right after the branch push, then succeeded once. A throwaway probe
  branch proved the credentials and payload were fine, so it was transient. Retry; do not conclude
  "no permission".

### 2026-10-30 (run 2) — feed advances on speech-end, not a fixed timer
- **Shipped:** the reel no longer advances on a fixed clock. It used
  `setTimeout(advance, correct ? 1400 : 2600)`, which cut a long explanation off mid-sentence and
  left the child staring at a frozen card after a short one. `ReelCard` now fires an
  `onReactionSpoken` signal when Noor's reaction finishes playing, and `FeedScreen` advances on it.
  PR #74, merge `6ea0134` (squash), deployed to production.
- **Deploy:** Vercel production `dpl_EptEZ6QoA3rzhzW13b9TMMAbkXtM` READY for `6ea0134`, aliased to
  https://amina-nine-sepia.vercel.app. Live bundle `index-Bi4JnUMP.js` SHA-256
  `5c8b4efe…e49d9c` == local build of `main` [V].
- **Live proof [V]:** Playwright at 390x844 ar-EG on the live site, stubbing `window.Audio` to a
  working 2500ms clip (headless has no audio device, so real `onended` never fires). Reaction audio
  started at 240ms; the reel counter advanced `1 / 16 -> 2 / 16` at **2750ms** — ~10ms after
  speech-end. The old timers (1400/2600ms) would have fired earlier; `/setTimeout\([^,]*,\s*1400/`
  is absent from the served bundle [V].
- **How the advance actually reaches the child [V]:** `voiceService.speak` prefers Gemini TTS via
  `/api/tts` and plays a real `<audio>` element; only when that is unavailable does it fall back to
  `speechSynthesis`. `onEnd` is wired to both the `audio.onended` and the utterance `onend`, so the
  signal is honest on either path. In a headless browser the audio element never ends — that is why
  a bare speechSynthesis stub shows no advance; it is a harness artifact, not an app defect.
- **Guard:** the signal fires exactly once per answered reel (ref-guarded), with a read-time hold when
  voice is muted and a 12s safety net so a silent engine cannot wedge the feed.
- **Suite:** `tsc --noEmit` 0; `npm test` all pass (immersiveFeed 19/19, noorPreGeneratedLines pass);
  `npm run build` exit 0; CI `verify` green on `6ea0134` [V].
- **Next:**
  1. Feed full-screen + media: the reel still occupies ~84% of the viewport (header 65px + nav 71px
     always visible) and reel media count is 0/0/0/0. The speech-end signal just added is the hook for
     the next piece.
  2. Voice turn-taking in the feed — `handsFreeLoop.ts` is still wired only into
     `TeachingSessionModal.tsx`. `onReactionSpoken` is the hand-back point to build on.
  3. Arabic misconception content — all 10 curriculum misconceptions are French-only, so an Arabic
     child gets a model answer instead of a real diagnosis (`speaksLanguage` guard now blocks the
     wrong-language injection).
  4. Make misconception-bearing reels reachable — `buildFeedQueue` never selects `conc_mathfr_*`.
- **Blockers:** none. Tavily web search is HTTP 432 (plan limit) — no web search available.

### 2026-10-30 — live teacher loop shipped to production
- **Shipped:** the live teacher loop is merged to `main` (PR #68, merge `c6656c9`) and deployed.
  The reel now asks, reacts to the answer, records mastery evidence and awards XP, and labels the
  offline case honestly. Fixed: French misconception text was injected into Arabic replies.
- **Deploy:** Vercel production READY for `c6656c9`. Live bundle `index-B25V1xyb.js` SHA-256 == local
  build of `main`. Playwright drive of the live site: correct answer -> `برافو! 🎉`, evidence `+5.3%`,
  next reel loaded, **0 console errors**.
- **Suite:** 574 passed / 0 failed; `tsc --noEmit` clean.
- **Next (owner's explicit asks, in order):**
  1. Feed must feel like Instagram/TikTok — full screen (today 84% of viewport; header 65px + nav 71px
     always visible), a real spoken conversation, not static (reel media count is 0/0/0/0).
  2. Voice turn-taking in the feed — `handsFreeLoop.ts` is wired only into `TeachingSessionModal.tsx`.
  3. Arabic misconception content — all 10 curriculum misconceptions are French-only.
  4. Make misconception-bearing reels reachable — `buildFeedQueue` never selects `conc_mathfr_*`.
- **Blockers:** none. Tavily web search is HTTP 432 (plan limit) — no web search available.
