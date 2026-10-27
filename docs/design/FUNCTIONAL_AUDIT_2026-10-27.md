# Miss Noor — functional audit: is every component working?

**Date:** 2026-10-27
**Branch:** `openhands/brand-jsx-text-guard` (head of PR #49) @ `416cb42`
**Method:** built (`npm run build`, exit 0), served on `http://127.0.0.1:12000`, drove the real
app in headless Chromium at 390×844 Arabic RTL with a synthetic "Learner QA" profile, and
called every backend route with `curl`. No real child data.
**Posture:** read-only. No app code changed by this audit.
**Evidence tags:** [V] verified by tool output this session, [I] inference, [U] unknown.

---

## 1. The change (PR #49) plays correctly

Full journey, all steps PASS, **0 console errors** [V]:

| Step | Result |
|---|---|
| LIBRARY opens | heading "مدرستي — الكتب والمناهج" |
| Bookshelf heading (the G1 fix) | "📚 كتب مس نور الدراسية (الصف الخامس):" — no "أمينة" |
| Book detail opens | "📖 الفصل الدراسي الأول — اللغة العربية" |
| Lesson list expands | "📑 فهرس الوحدات والدروس" |
| "اشرحي لي يا مس نور" → NOUR | lands on NOUR with the lesson title preloaded |

---

## 2. Front end — every screen and destination

Walked all 4 primary tabs and all 9 top-menu destinations. **0 console errors, 0 horizontal
overflow, 0 failed network requests on every one** [V].

| Destination | Heading rendered | Buttons | Status |
|---|---|---|---|
| HOME | "أهلاً بك يا Learner QA!" | 9 | OK |
| FEED | reel question | 13 | OK |
| LIBRARY | "مدرستي — الكتب والمناهج" | 7 | OK |
| NOUR | "فصل مس نور" | 25 | OK |
| كتبي (My Books) | "كتبي" | 6 | OK |
| المنهج الدراسي (Curriculum) | "مدرستي — الكتب والمناهج" | 7 | OK |
| مهامي (Missions) | "مهامي" | 6 | OK |
| الواجب (Homework) | "مهامي" | 6 | OK — see finding F-01 |
| مراجعة (Review) | "المراجعة والحفظ الذكي" | 11 | OK |
| المحفوظات والمجموعات | "المحفوظات والمجموعات" | 7 | OK |
| تقدمي (Progress) | "لوحة التقدم والإنجاز الفردي" | 19 | OK |
| ملفي (Profile) | "Learner QA" | 14 | OK |
| الإعدادات (Settings) | "الإعدادات والتحكم" | 15 | OK |

### Interactive flows that matter

| Flow | Evidence | Status |
|---|---|---|
| Onboarding S1→S2→S3(3 warmups)→S4→HOME | completed end-to-end, landed on HOME with nav | OK [V] |
| Onboarding step-1 gating | Next disabled until name+gender+age, then enabled | OK [V] |
| FEED → NOUR ("علّمني أكتر") | carries the reel topic into NOUR | OK [V] |
| Save-to-Collection | chip ticked → `saved_items` 0→1 in IndexedDB → toast "تم الحفظ في مجموعتك الخاصة" → sheet closed | OK [V] |
| Language switch ar/en/fr | dir=rtl/ltr/ltr, htmlLang set, nav labels translate (الرئيسية/Home/Accueil) | OK [V] |
| Settings language persistence | click English → stored `settings.language='en'`, `document.lang='en'` | OK [V] |
| NOUR teaching start (step 1) | session opens with real lesson content | OK [V] |

---

## 3. Back end — every API route

9 routes in `server.ts`. All respond; **0 unhandled 500s** [V].

| Route | Valid payload | Degenerate payload | Verdict |
|---|---|---|---|
| `GET /api/health` | 200 `{status:ok}` | — | OK |
| `POST /api/chat` | 200 reply (local fallback) | `{}` → 200 greeting | OK |
| `POST /api/tutor-explain` | 200 explanation | — | OK |
| `POST /api/tutor-reply` | 200 reply | — | OK |
| `POST /api/check-homework` | 200 `evaluation:"unclear"` | `{}` → 400 "Missing image or text payload" | OK |
| `POST /api/study-page` | 200 degraded reply | `{}` → 400 "No page content supplied" | OK |
| `POST /api/reconstruct-day` | 200 structured day | `{}` → 200 silence-safe | OK |
| `POST /api/tts` | 200 `useBrowserSpeech:true` | `{}` → 400 "Missing text" | OK |
| `POST /api/stt` | 400 "Missing audio data" (empty audio) | — | OK |
| malformed JSON | Express returns 400 HTML, not a crash | | OK |

Graceful degradation is consistent and localized: with no key, or on an upstream error, the
routes return child-safe fallback text and a `degraded:true` flag rather than failing.

### Live-AI path [V, partially blocked]
With a real key the server reports `hasApiKey:true`, but live calls returned
`source:"error_fallback"` because the upstream returned **503 "high demand"** and the key is on
the **free tier (429, limit 5 req/min)**. Two corrections to an earlier read of mine:
`gemini-3.8-flash` **does exist** for this key (my first model list was truncated); the failure
is quota/demand, not a wrong model name. The app handled it correctly by falling back. [V]

---

## 4. Findings

**F-01 — "الواجب" (Homework) and "مهامي" (Missions) render the same screen (low).**
`AppShell.tsx:97-98` maps both `activeTab === 'missions'` and `activeTab === 'homework'` to
`<MissionsScreen />`. Two distinct menu entries lead to one view. Intentional or a wiring
leftover — needs a decision. [V]

**F-02 — Live AI is unusable on the free tier at 5 req/min (medium, environment).**
Not a code defect; the fallback is correct. But a demo that needs live AI should use a paid
key or a higher-quota model, or the app will silently degrade. [V]

**F-03 — STT returns 400 on empty audio (informational).**
Expected; the client should not call STT without audio. Confirms input validation works. [V]

No crashes, no unhandled exceptions, no console errors anywhere in the walk.

---

## 5. Coverage: tests ↔ surfaces

`npm test` runs 17 suites, all green on this branch (16 summary lines; see CI run
`40438105153`). Mapping [V]:

| Suite | Proves |
|---|---|
| integritySourceOfTruth | curriculum/answer data integrity |
| strictTypecheckGate | the type gate itself |
| adaptiveLoop | teacher adaptive loop |
| teachingSession | teaching session state machine |
| onboardingNoor | onboarding contract |
| reels / feedSaveControl | feed generation + save control |
| myBooks | book import / mastery / training |
| examEngine | exam engine |
| brandingNoor | no legacy name in strings **and JSX text** (1.3, added here) |
| serverTutorVoice / noorVoiceAndTeaching / voiceAndQuestions / stageVoiceLifecycle | voice + tutor speech |
| payloadLimits | upload size limits |
| vercelEntryResolution | serverless entry resolution |
| phoneUiAccessibility | 44px targets, ≥12px text, overflow |

Services without a dedicated suite are exercised through the screens above (e.g.
`gamificationService`, `spacedReviewScheduler`, `parentService`).

---

## 6. Bottom line

The app is functionally healthy: every screen renders, every route responds, the primary flows
(onboarding, feed→Nour, save, language, teaching) all work, and there are no console errors or
unhandled 500s. The only correctness question found is F-01 (two menu items, one screen). The
live-AI path is quota-limited in this sandbox, not broken.

_Prepared by an AI agent (OpenHands) on behalf of the repository owner._
