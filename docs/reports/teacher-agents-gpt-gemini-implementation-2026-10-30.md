# Teacher agents: GPT + Gemini, what is missing, and how we improve the app

Date: 2026-10-30. Author: an AI agent (OpenHands) on behalf of the repository owner.
Scope: how to run GPT and Gemini as **teacher agents** in Miss Noor, what the project lacks today,
and a staged plan to improve the app. Every claim is tagged: `[V]` verified by running something,
`[C]` reported by a prior document, `[I]` inference, `[A]` assumption, `[U]` unknown.

---

## 0. Read this first (one screen)

- The app's AI layer is **Gemini-only today** `[V]`. There is no GPT, OpenAI, or Anthropic code in
  `src/` at all `[V]`.
- The **teaching-agent architecture already exists** on `main`: a skill registry, a misconception
  contract, and a live loop that reacts to answers `[V]`.
- The **live teacher loop is now shipped to production** (`main` @ `c6656c9`) and proven live `[V]`.
- The single biggest product gap is **not** the model. It is the **feed experience**: the reel uses
  84% of the viewport, contains **0 media elements**, and has **no voice conversation in the feed**
  `[V]`. That is what makes the app feel static.
- **Adding GPT breaks the zero-cost rule.** Gemini has a free tier; the OpenAI API does not `[I]`.
  GPT is therefore an owner decision, not an engineering default. See §3.
- Recommended order: **fix the feed (Gemini only, no new cost) → add Arabic teaching content →
  then, only if the owner approves the spend, add GPT as a second teacher voice.**

---

## 1. What "teacher agent" means in this codebase

A teacher agent here is not one model. It is three layers `[V]`:

| Layer | Where it lives | What it does |
|---|---|---|
| **Model** | `src/services/ai/geminiModel.ts` | Text, speech-to-text, text-to-speech. |
| **Teaching skills** | `src/services/teaching/skills/` | `selectTeachingSkill` + `teachingSkills` pick a pedagogy (e.g. diagnose-misconception, explain-in-lay-terms). |
| **The loop** | `src/services/reels/reelResponse.ts`, `src/services/teaching/teachingSession.ts` | Ask → judge the answer → react → record mastery evidence → pick the next skill. |

The **API surface** the agent runs behind `[V]`:
`/api/chat`, `/api/stt`, `/api/tts`, `/api/tutor-explain`, `/api/tutor-reply`, `/api/teach-turn`,
`/api/check-homework`, `/api/study-page`.

So "running GPT as a teacher agent" means: keep the skills and the loop, and swap or add the
**model** behind them. The skills and the loop are model-agnostic by design `[I]` — that is the good
news, and it is why this is an achievable change rather than a rewrite.

---

## 2. What is missing now (corrected gap matrix)

This is the honest list, measured against the running app, not against a plan document.

| # | Gap | Evidence | Severity |
|---|---|---|---|
| G1 | ~~Live teacher loop unmerged~~ | **Fixed**: shipped to `main` `c6656c9`, live `[V]` | done |
| G2 | **No full-screen media experience** — reel = 84% of viewport, 0 media, 14 buttons | measured `[V]` | **Critical** |
| G3 | **No voice conversation in the feed** — `handsFreeLoop.ts` wired only into `TeachingSessionModal.tsx` | grep `[V]` | **High** |
| G4 | **Misconception text is French-only** — 0 of 10 Arabic | counted `[V]` | **High** |
| G5 | Misconception reels unreachable from the feed — `buildFeedQueue` never selects `conc_mathfr_*` | queue dump `[V]` | Medium |
| G6 | Auto-advance is a fixed timer (`setTimeout(advance, correct ? 1400 : 2600)`), not "when she stops speaking" | source `[V]` | Medium |
| G7 | Brand tokens defined but not applied | `[C]` | Medium |
| G8 | Two `text-slate-400` contrast failures | `[C]` | Medium |
| G9 | Homework and Missions render one screen only | `[C]` | Medium |
| G10 | Legacy name "Amina" in shipped curriculum text | `[C]` | Medium |
| G11 | French feed headline falls back to English (`dailyLifeExampleFr` missing) | `[C]` | Low |
| G12 | Model name duplicated across files | `[C]` — partly mitigated: `geminiModel.ts` is the single source `[V]` | Low |

**The pattern:** the intelligence is largely built; the *experience* is not. A child opens a reel
that is a static card with four buttons. That is the complaint to fix.

---

## 3. GPT and Gemini as teacher agents — the honest engineering view

### 3.1 Gemini today

| Constant | Value | File |
|---|---|---|
| `DEFAULT_TEXT_MODELS` | `gemini-3.6-flash`, `gemini-3.5-flash`, `gemini-2.5-flash`, `gemini-3.8-flash` | `src/services/ai/geminiModel.ts:32` |
| `PRIMARY_TEXT_MODEL` | `gemini-3.6-flash` | `:40` |
| `DEFAULT_STT_MODEL` | `gemini-3.8-flash` | `:43` |
| `GEMINI_TTS_MODEL` | `gemini-3.8-flash-lite-tts` | `:46` |

This is already correct practice: **one file owns every model string**, with a comment recording
which models returned 200 and which returned 429 `[V]`. The `model-string-hygiene` rule is satisfied
for Gemini. The fallback list is ordered, and there is no silent paid fallback `[V]`.

### 3.2 Adding GPT

Two honest facts first:

1. **Cost.** Gemini's free tier covers this app's traffic today. The OpenAI API has no equivalent
   free tier; every `/api/chat` call becomes a real charge `[I]`. The `zero-cost-gate` rule says do
   not add a paid provider without the owner's explicit, informed consent. So GPT is **an owner
   decision**, not something to switch on quietly.
2. **Benefit.** A second provider gives (a) resilience if Gemini rate-limits (the file already
   documents 429s `[V]`), and (b) a genuinely different "voice" — which is pedagogically useful for
   the *diagnose-misconception* skill, where a second opinion can catch a wrong diagnosis `[I]`.

**How to add it safely, if the owner approves:**

- Put GPT behind the **same interface** the skills already call. The skills must never import a
  provider directly; they ask for "a completion", and a provider module fulfils it `[I]`.
- Add `src/services/ai/openaiModel.ts` with the same shape as `geminiModel.ts`: one exported
  constant list, one primary, rate limits stated next to the constant.
- Route by **capability, not by cost surprise**: cheap/free Gemini for high-volume feed text; GPT
  only for low-volume, high-value turns (misconception diagnosis, homework grading) `[I]`.
- **Never** make a paid provider a silent fallback. If Gemini fails, the app must degrade to the
  offline teacher, not silently bill the owner `[V]` — this rule already holds for Gemini.

**Recommendation:** do **not** add GPT yet. Ship G2/G3/G4 first; they improve the app more than a
second model does, and they cost nothing. Revisit GPT when the owner wants to fund it.

---

## 4. How we improve the app — staged plan

### Stage 1 — ship what is already built (done)
- R1 merge the live-teacher-loop branch → **done** (`c6656c9`, live) `[V]`.
- R2 merge the hands-free default (branch `block-2-hands-free-default` exists) `[V]`.

### Stage 2 — make the feed feel like Instagram/TikTok (the owner's main ask)
- **R3 Full-screen reel.** Hide the header and bottom nav while a reel is open; make the reel fill
  `100dvh`. *Accept:* measured reel height ≥ 98% of viewport; nav returns on scroll-up `[V]`-able.
- **R4 Real spoken turn-taking in the feed.** Wire `handsFreeLoop.ts` into the reel, not just the
  teaching modal. *Accept:* the child speaks and the reel reacts without tapping `[V]`-able.
- **R5 Media in the reel.** At least one of: illustration, animated card, or a short generated
  audio cue per reel. *Accept:* media element count > 0 for a standard reel `[V]`-able.
- **R6 Advance when she stops speaking**, not on a fixed 1400/2600 ms timer `[V]`-able.

### Stage 3 — make the teaching smarter
- **R7 Arabic misconception content.** Write Arabic `explanation`/`remediation` for all 10
  misconceptions. *Accept:* an Arabic child gets a real diagnosis, not a generic line `[V]`-able.
- **R8 Misconception reels reachable.** Let `buildFeedQueue` select `conc_mathfr_*` (and the new
  Arabic set) `[V]`-able.
- **R9 Per-session learning signal in the feed** (next-question correctness), extending
  `learningSignals.ts` `[V]`-able.

### Stage 4 — carried-forward polish
- R10 apply brand tokens (G7); R11 fix the two contrast failures (G8); R12 give Homework and
  Missions their own screens (G9); R13 remove the legacy name "Amina" from curriculum text (G10).

### Stage 5 — optional, owner-funded
- R14 GPT as a second teacher voice (§3.2). Blocked on the owner's cost decision.

---

## 5. What I could not verify

- Audible speech output: headless Chromium has no audio device, so TTS *calls* were confirmed, not
  the sound `[V]`.
- Real-child usability: not tested with a child `[U]`.
- GPT cost at this app's real traffic: no OpenAI key present, so no measured figure `[U]`.
- Web search for provider pricing: Tavily returned HTTP 432 (plan limit) `[V]`, so the OpenAI
  free-tier statement is inference `[I]`, not a quoted price.

---

## 6. Decisions for the owner

1. **Approve or reject GPT.** It costs money per call; Gemini's free tier does not. Default: no.
2. **Feed priority.** Confirm the full-screen/voice feed is the next thing built. Default: yes.
3. **Arabic content.** Confirm we may write Arabic misconception text (curriculum edits were
   previously out of scope). Default: yes — it is a High gap.

_This report was created by an AI agent (OpenHands) on behalf of the repository owner._
