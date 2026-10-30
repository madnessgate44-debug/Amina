# Miss Noor — teaching agents & skills, checked against the running app

**Date:** 2026-10-30
**Author:** OpenHands, for owner `madnessgate44-debug`
**Baseline:** `main` @ `4c1072e`; branch `feat/live-teacher-loop` @ `0680877` (7 commits ahead, not merged)
**Evidence tags:** `[V]` verified this session · `[C]` reported claim · `[I]` inference · `[A]` assumption · `[U]` unknown · `[B]` blocked

```text
TOOL DECLARATION
- Tools confirmed available this session: terminal (bash), file editor, git,
  Chromium via playwright-core, local production server, GitHub REST API (read),
  repository files, ENGINEERING_EXECUTION_OS.md
- Tools requested but absent: Tavily web search (plan limit reached, HTTP 432);
  browser-automation MCP (not needed — Playwright used directly)
- No other access claimed. Any later claim referencing an undeclared tool is invalid.
```

---

## Read this first (one screen)

You asked me to look into how **OpenHands Cloud, ChatGPT Study Mode and Gemini Guided
Learning** teach, and to produce a complete report on implementing those agents and skills
in Miss Noor — what is missing now, and how the app improves as a whole. You also said the
reel must feel like **Instagram/TikTok: full screen, a real conversation, not static**.

Three things change the answer, and all three are `[V]`:

1. **A report for this exact question already exists — and it is stale.** It is on the
   unmerged branch `docs/teaching-agents-skills-report` (`docs/design/TEACHING_AGENTS_AND_SKILLS_REPORT_2026-10-28.md`).
   Its requirements R1–R5 are **already done on `main`** `[V]`: the misconception data
   contract, misconception-aware evaluation, the 5-skill teaching registry, the coordinator
   wiring, and learning telemetry all exist. That report also states it **never ran the app
   in a browser** `[C]`. This report is the live check it was missing.

2. **I drove the real app end to end this session** `[V]`. The reel is no longer passive:
   it asks, reacts to the answer, records evidence and awards XP. But the interactive reel
   lives on an **unmerged branch**, so what the child sees on `main` today is still the old
   passive card. That single merge is the difference between the app you described and the
   app that ships.

3. **The TikTok/Instagram gap is real and now measured** `[V]`: the reel uses **84%** of the
   viewport (136px lost to header + bottom nav), contains **zero** images, video, audio or
   canvas, and has no voice conversation — hands-free voice exists but is wired only into the
   teaching modal, not the feed. It is a styled card, not a full-screen conversation.

**One defect found and fixed while capturing evidence:** the deterministic diagnosis path
pasted **French** misconception text into **Arabic** replies (all 10 curriculum
misconceptions are French-only) `[V]`. Fixed on the branch, with tests both directions.

**Your one decision:** see §8. My recommendation is to **merge the live-teacher-loop branch
first** — it is the only item that changes what your daughter experiences tonight.

---

# Details

## 1. What I did, and how

I started a local production build (`npm run build`, served with `NODE_ENV=production` on
port 12000) with **no Gemini key**, which is deliberate: it makes the offline teacher path
the default and proves the lesson still works when the model is unreachable `[V]`. I drove
it with Chromium via `playwright-core` at an emulated phone (390×844, `ar-EG`, DPR 2) `[V]`.

The walkthrough: complete the 4-step onboarding → open the feed → answer a question
**wrong** → observe the reaction → answer a question **correct** → observe the praise.
Screenshots are committed at `artifacts/teacher-loop/` with the full account in
`docs/reports/live-teacher-loop-evidence.md` `[V]`.

## 2. What the running app actually does (this is new — no prior report has this)

### 2.1 The reel already teaches, when it is allowed to

| Step | Observed `[V]` | Console errors |
|---|---|---|
| Feed opens | A question reel: Noor's line, the concept, 4 options, source page, "1 / 17" | 0 |
| **Correct** answer | `برافو! 🎉`, XP `+5.3%`, no model call (`source: reel_line`) | 0 |
| **Wrong** answer | `قربت أوي! خليني أوضحلك الفكرة في سطر واحد.` + badge `🎒 معلمة بدون إنترنت`, `degraded: true`, evidence recorded `(-8.8%)` | 0 |
| After a wrong answer | The next question is revealed in the same reel; the card does not die | 0 |

So the "quiz with a red cross" problem the older audits describe is **fixed on this branch**:
a wrong answer produces a *response*, the offline case is **labelled honestly** instead of
pretending, and evidence is written to mastery `[V]`. **None of this is on `main`** `[V]`.

### 2.2 The smart path works — and was broken for Arabic

The deterministic diagnosis (no model call, no quota) was exercised against the live service
with real curriculum data `[V]`:

```
concept:  conc_mathfr_u1_l1_position     question: جدول القيمة المكانية للأعداد العشرية
child picked: 0,4
→ source: misconception   namedMisconception: true   degraded: false
→ text:   لأ يا سارة، خلّينا نفهم إيه اللي حصل. Vous avez lu le chiffre tout seul,
          sans regarder sa position après la virgule. La virgule donne sa valeur au
          chiffre : 4 unités vaut 4, mais 4 millièmes vaut 0,004.
```

Read that text again: **Arabic scaffolding, then French.** All **10** misconception entries
in the curriculum are Latin-script only; **0** are Arabic `[V]`. The code injected them
verbatim. A child reading Arabic got a French sentence in the middle of the explanation.

**Fixed on this branch** `[V]`: the deterministic diagnosis is still tried first, but only
when the stored text is in the language the child is reading; otherwise the turn falls
through to the model and is marked `degraded` rather than pretending. Tests assert both
directions (Arabic gets no Latin text; French still gets the stored diagnosis). The
remaining gap is **content**: the 10 misconceptions still need Arabic copies.

### 2.3 The most teacher-like behaviour is unreachable in the feed

`buildFeedQueue` returns **16** reels built from `conc_fr_u2_l1_articles_indefinis`,
`off_sci_u1_l2_c1`, `off_math_u6_l1_c1` and `closer` `[V]`. The five concepts that carry
misconception data are all `conc_mathfr_*` and **never appear** `[V]`. I scrolled all 17
cards in the live feed and never met one `[V]`. So in practice a child cannot reach the
deterministic diagnosis path from the feed at all.

## 3. Corrections to the two prior reports

I checked both rather than trusting them. Where they are stale, it is because `main` moved.

| Claim | Source | Status today |
|---|---|---|
| Two empty stub lessons | 2026-10-27 audit | **Stale.** `main` loads 51 lessons / 54 concepts / **0** empty `[V]` |
| Hands-free loop "already built", PR #59 makes it default | 2026-10-28 report | **Stale in the app.** `handsFreeLoop.ts` is on `main` `[V]` but is wired **only** into `TeachingSessionModal.tsx`; the feed has no voice `[V]` |
| R1 misconception data contract | 2026-10-28 report (open) | **Done on `main`** — `misconceptions?`/`distractors?` exist in `src/types/teachingSession.ts:86` and `src/types/homework.ts:46` `[V]` |
| R3 teaching-skill registry | 2026-10-28 report (open) | **Done on `main`** — 5 skills in `src/services/teaching/skills/teachingSkills.ts` `[V]` |
| R4 wire skills into the loop | 2026-10-28 report (open) | **Done on `main`** — `selectTeachingSkill` imported at `teachingSession.ts:16`, called at `:553` `[V]` |
| R5 learning telemetry | 2026-10-28 report (open) | **Done on `main`** — `src/services/telemetry/learningSignals.ts` exists; its suite passes 10/10 `[V]` |
| Reels are "still passive, no model calls" | 2026-10-29 club briefing | **True on `main`, fixed on the branch.** `src/services/reels/reelResponse.ts` does not exist on `main` `[V]` |

**Conclusion:** the design work is largely done and scattered across three unmerged branches.
The problem is no longer "what should we build" — it is "nothing is merged, so the child sees
none of it" `[I]`.

## 4. The Instagram/TikTok gap — measured, not guessed

You asked for full-screen, engaging, real conversation, not static. Here is what the live
reel is, in numbers `[V]`:

| Measure | Value | What it means |
|---|---|---|
| Viewport | 844px | phone height |
| Header | 65px | consumed |
| Bottom nav | 71px | consumed |
| Reel scroller | **708px (84%)** | 136px of chrome sits over/around the reel |
| Card height | 716px | taller than its window — the card is clipped |
| `<img>` / `<video>` / `<audio>` / `<canvas>` in the reel | **0 / 0 / 0 / 0** | it is text and buttons only |
| Buttons in the reel | 14 | press-driven |
| Voice in the feed | none | `handsFreeLoop` is not imported by any feed component `[V]` |

Against the three qualities you named:

| You asked for | Today | Verdict |
|---|---|---|
| **Full screen** | 84% of the viewport; header + nav always visible | Partial |
| **Like Instagram/TikTok** | one card per screen with scroll-snap `[V]`, but no media, no motion beyond one XP pop, no progress bar, no autoplay video | Partial |
| **A real conversation** | the reel reacts to the answer and Noor speaks her line `[V]`, but the child can only *tap*; there is no voice turn-taking in the feed | Partial |
| **Not static** | it is genuinely interactive now (asks, reacts, awards XP, records evidence) `[V]` | **Yes on the branch** |

The honest summary: the reel is a **good quiz card** that now responds like a teacher. It is
not yet a **full-screen spoken conversation**. The distance is finite and the pieces already
exist — see R-F1 to R-F4 in §5.

## 5. What to copy from the three references

Grounded in the sources the 2026-10-28 report already fetched and verified `[C]`; I did not
re-fetch them (Tavily plan limit `[B]`), so I treat their content as reported, not re-verified.

- **OpenHands Cloud — skills + sub-agents + delegation.** The *container* pattern: named,
  progressively-disclosed skills and delegatable specialists. This is the **engineering**
  layer (Layer A below). It does not run inside the child's app.
- **ChatGPT Study Mode.** The *behaviours*: ask before telling (Socratic), explain in layers,
  one question at a time and wait, name the misunderstanding.
- **Gemini Guided Learning.** Teach with a picture; ground the explanation in a real book
  page. (Google's own note: OpenStax grounding is English + US only and not for under-18
  accounts `[C]` — so we ground in **our** curriculum, not theirs.)

**The key distinction:** Layer A makes the *coding* consistent; Layer B makes the *teaching*
consistent. The 2026-10-28 report put it correctly and it still holds `[I]`:

```
LAYER A — build Miss Noor            LAYER B — the child's Miss Noor
.agents/skills/*.md  (PR #46)         src/services/teaching/skills/*.ts   ← EXISTS on main
.agents/agents/*.md  (PR #46)         driven by curriculum + student state ← EXISTS on main
runs in Cloud, on the repo            runs in the app, at request time
```

## 6. What is missing now — the corrected gap matrix

| ID | Gap | Evidence | Severity |
|---|---|---|---|
| **G1** | **The live teacher loop is unmerged** — `reelResponse.ts`, the reacting reel, the pre-generated lines | not on `main` `[V]` | **Critical** |
| **G2** | **No full-screen media experience** — 84% viewport, 0 media, 14 buttons | measured `[V]` | **High** |
| **G3** | **No voice conversation in the feed** — hands-free exists but only in the teaching modal | `grep` `[V]` | **High** |
| **G4** | **Misconception text is French-only** — 0/10 Arabic | counted `[V]` | **High** |
| **G5** | **Misconception reels unreachable from the feed** — `conc_mathfr_*` never queued | queue dump `[V]` | Medium |
| **G6** | **Auto-advance is a fixed timer** — 1400ms correct / 2600ms wrong, not "after she stops speaking" | source `[V]` | Medium |
| **G7** | Brand tokens defined, not applied | `[C]` prior report | Medium |
| **G8** | Two `text-slate-400` contrast failures | `[C]` prior report | Medium |
| **G9** | Homework and Missions render one screen | `[C]` prior report | Medium |
| **G10** | Legacy name "Amina" in shipped curriculum | `[C]` prior report | Medium |
| **G11** | French feed headline falls back to English (`dailyLifeExampleFr` missing) | `[C]` prior report | Low |
| **G12** | Model name duplicated across files | `[C]` prior report | Low |

G1 is the headline. Every "the app feels passive" complaint traces to work that is finished
and sitting on a branch `[I]`.

## 7. Implementation plan — numbered requirements

Each has a testable acceptance criterion. Order is dependency-driven. **No new dependency, no
paid service, no change to the locked HOME | FEED | LIBRARY | NOUR navigation.**

### Stage 1 — ship what is already built (highest value, lowest risk)

- **R1 — Merge the live-teacher-loop branch.** *Accept:* `main` contains
  `src/services/reels/reelResponse.ts`; `npm test` passes with the interactive-reel suite
  green; the feed asks a question and reacts in a production build `[V]`.
- **R2 — Merge the hands-free default.** *Accept:* hands-free is the default turn-taking mode
  in the teaching modal; its 31 tests pass `[C]` (re-run to confirm `[U]`).

### Stage 2 — make the reel feel like a conversation (your Instagram/TikTok ask)

- **R-F1 — Reclaim the full screen on the feed.** The reel scroller is
  `h-[calc(100dvh-8.5rem)]`; make the reel viewport full height and float the header/nav as
  translucent overlays that fade while the child is answering. *Accept:* the reel scroller
  measures ≥ 95% of the viewport at 390×844, and the bottom nav remains reachable (44px min
  tap targets preserved).
- **R-F2 — Give the reel a face and a voice.** Add an autoplaying, muted-by-default visual
  per reel kind (image or short loop for `story_analogy`, a diagram for `grounded-visual`),
  reusing `StructuredVisualData` / `visualType` which already exist. *Accept:* a reel renders
  at least one media element for `story_analogy`; `reduced-motion` still renders a static
  fallback; 0 console errors.
- **R-F3 — Voice turn-taking in the feed.** Wire `handsFreeLoop` into `ReelCard`/`FeedScreen`
  so Noor's line auto-speaks (already does `[V]`) and the mic auto-opens after she stops, with
  barge-in. *Accept:* in a browser, the reel enters `listening` after `tutor_speaking` without
  a button press; the tap path still works as a fallback.
- **R-F4 — Advance on speech end, not a timer.** Replace the fixed 1400/2600ms
  `setTimeout(advance, …)` with "advance when Noor's audio finishes (or the reaction text is
  fully shown)". *Accept:* a test asserts advance fires on the speech-end signal; no
  `setTimeout(advance)` remains.

### Stage 3 — make the teaching smarter

- **R5 — Arabic misconception data.** Write Arabic `explanation`/`remediation` for the 10
  existing entries (and add entries for the other subjects). *Accept:* `0` misconception
  entries are Latin-only for an Arabic child; the language guard test stays green.
- **R6 — Put misconception reels in the feed.** Make `buildFeedQueue` eligible to select
  concepts that carry misconception data. *Accept:* a feed built for a fresh student contains
  at least one `conc_mathfr_*` reel; the diagnosis path is reachable by tapping in a browser.
- **R7 — Per-session learning signal in the feed.** Record next-question correctness,
  misconception resolution and independent-recheck success from the reel loop, reusing
  `learningSignals.ts`. *Accept:* a test asserts the three signals are written after a reel
  session.

### Stage 4 — the smaller carried-forward items

- **R8** — apply brand tokens in real components (usage > 0; build exits 0).
- **R9** — fix the two contrast failures (`text-slate-600`; ratio ≥ 4.5:1).
- **R10** — separate Homework from Missions (two tabs, two components).
- **R11** — remove the legacy name from curriculum content; extend the branding guard to
  `src/data/`.
- **R12** — one constant for the model name; delete the duplicates.
- **R13** — add `dailyLifeExampleFr` (curriculum content — owner decision).

**Explicit non-goals:** no rebuild of the teaching engine; no new dependency; no paid tier; no
change to the locked navigation; no merge of unrelated PRs.

## 8. Decisions for you

**Decision 1 (the one I need):** do I merge Stage 1 now?

- **(a) Yes — merge the live-teacher-loop branch (and the hands-free default).** *My
  recommendation.* It is finished, tested, and it is the only change that alters what your
  daughter experiences tonight. Owner policy is "merge/deploy into everything you own"; I am
  still asking because it changes `main`.
- **(b) Hold — keep it on the branch** while you review the evidence report first.

Stages 2–4 can proceed in either order once Stage 1 is decided.

**Decisions I made without asking, and why:**

- **I did not merge anything.** Even though the standing directive permits it, merging to
  `main` is a consequential action and this session's task was to report, not to ship `[I]`.
- **I did not open a PR for this report.** You asked for a report; it is on the branch so it is
  reviewable. Say the word and I will open one.
- **I fixed the French-in-Arabic defect** rather than only reporting it, because it is in a
  file this branch introduced and a diagnosis in the wrong language is worse than none `[I]`.
- **I treated both prior reports as stale where I could measure them** — and said so in §3.

## 9. What I could not verify

- **The three external sources were not re-fetched this session** — Tavily returned HTTP 432
  (plan limit) `[B]`. Their content is carried as `[C]` from the 2026-10-28 report, which
  states it fetched them at HTTP 200. I did not independently confirm them.
- **PR #46 (19 sub-agents + skills) and PR #59 (hands-free default) were not executed.** Per
  OS §7, capability must be proven end-to-end, not inferred from files existing `[U]`. I
  confirmed `handsFreeLoop.ts` is on `main` `[V]`; I did not run it in a browser.
- **The live Vercel deployment was not driven.** Everything here is a **local production
  build** `[V]`. Whether the deployed bundle matches this branch is `[U]`.
- **Audio/TTS behaviour was not verified** — headless Chromium has no audio device, so I
  confirmed speech *calls* in source, not audible output `[U]`.
- **Real child usability was not tested.** I am an agent at a keyboard; I did not watch a
  ten-year-old use it. That remains the honest limit on every "engaging" claim.

## 10. Verification ledger (this session)

| # | Command / action | Exit | Raw excerpt | Result | Time (UTC) |
|---|---|---|---|---|---|
| L1 | `git rev-parse --short HEAD` | 0 | `0680877` on `feat/live-teacher-loop` | PASS | 03:32 |
| L2 | onboarding drive (Playwright, 390×844 ar-EG) | 0 | reached main app | PASS | 03:19 |
| L3 | feed + wrong answer | 0 | `قربت أوي!…` + `🎒 معلمة بدون إنترنت` | PASS | 03:21 |
| L4 | feed + correct answer | 0 | `برافو! 🎉` `+5.3%`, `source: reel_line` | PASS | 03:24 |
| L5 | console error count across L2–L4 | 0 | `0` | PASS | 03:24 |
| L6 | direct `resolveReelResponse` on real concept | 0 | `source: misconception`, French text | PASS (defect) | 03:26 |
| L7 | misconception language count | 0 | Arabic 0 / Latin 10 / mixed 0 | PASS (defect) | 03:27 |
| L8 | `buildFeedQueue` dump | 0 | 16 reels; `conc_mathfr_*` absent | PASS (gap) | 03:28 |
| L9 | viewport/media measurement | 0 | 708/844 = 84%; media 0/0/0/0 | PASS (gap) | 03:33 |
| L10 | `npx tsx interactiveReel.test.ts` | 0 | `19 PASSED, 0 FAILED` | PASS | 03:29 |
| L11 | `npx tsc --noEmit` | 0 | no output | PASS | 03:29 |
| L12 | `npm test` (full) | 0 | `TOTAL PASSED=574 FAILED=0` | PASS | 03:30 |
| L13 | secret scan of staged diff | 0 | `0` matches | PASS | 03:31 |
| L14 | Tavily search | 432 | plan limit | NOT RUN (blocked) | 03:25 |

## 11. Sources

- Repository `main` @ `4c1072e`, branch `feat/live-teacher-loop` @ `0680877` (this session) `[V]`.
- `docs/reports/live-teacher-loop-evidence.md`, `artifacts/teacher-loop/*.png` (this session) `[V]`.
- `docs/design/TEACHING_AGENTS_AND_SKILLS_REPORT_2026-10-28.md` (branch `docs/teaching-agents-skills-report`) `[V]`.
- `docs/audits/TEACHING_ENGINE_GAP_AUDIT_2026-10-27.md`, `docs/reports/CLUB_BRIEFING_2026-10-29.md` `[V]`.
- `ENGINEERING_EXECUTION_OS.md` v2.2 `[V]`.
- `https://docs.openhands.dev/overview/skills`, `https://help.openai.com/en/articles/11780217-study-mode`,
  `https://support.google.com/gemini/answer/16448384` — `[C]` via the 2026-10-28 report, not re-fetched.

---

```text
COMPLIANCE HEADER
- Outcome claimed: COMPLETE (report delivered; one code defect found and fixed on branch)
- Tools confirmed this session: terminal, file editor, git, Chromium/playwright-core,
  local production server, GitHub REST API (read), repository files, ENGINEERING_EXECUTION_OS.md
- Tools absent / not claimed: Tavily (HTTP 432), browser-automation MCP, Vercel API, audio device
- Evidence refs (commands, files, logs): L1–L14 ledger; docs/reports/live-teacher-loop-evidence.md;
  artifacts/teacher-loop/{01-question,02-wrong-immediate,03-wrong-diagnosis,04-correct-answer}.png
- Requirements: R1 NOT DONE (awaiting decision) | R2 NOT DONE | R-F1..R-F4 NOT DONE |
  R5 PARTIAL (language guard done, Arabic content NOT DONE) | R6..R13 NOT DONE
- Checks run (Verification Ledger):
  git rev-parse -> exit 0 -> PASS -> 03:32
  playwright onboarding+feed drive -> exit 0 -> PASS -> 03:19-03:24
  resolveReelResponse direct -> exit 0 -> PASS -> 03:26
  misconception language count -> exit 0 -> PASS -> 03:27
  buildFeedQueue dump -> exit 0 -> PASS -> 03:28
  viewport/media measurement -> exit 0 -> PASS -> 03:33
  npx tsx interactiveReel.test.ts -> exit 0 -> PASS -> 03:29
  npx tsc --noEmit -> exit 0 -> PASS -> 03:29
  npm test -> exit 0 -> PASS (574/0) -> 03:30
  secret scan -> exit 0 -> PASS -> 03:31
  tavily search -> exit 432 -> NOT RUN -> 03:25
- Changed files: docs/reports/teaching-agents-live-audit-2026-10-30.md (this),
  src/services/reels/reelResponse.ts, src/services/__tests__/interactiveReel.test.ts,
  docs/reports/live-teacher-loop-evidence.md, artifacts/teacher-loop/*.png (diff inspected: Y)
- Regressions checked: full suite 574 pass / 0 fail after the language fix; tsc clean
- Not attempted / out of scope: merging any branch; opening a PR; driving the Vercel deployment;
  running PR #46 / #59; re-fetching the three external sources
- Blockers / unknowns: Tavily plan limit; headless audio; real-child usability
- Repo/PR/deploy state: branch feat/live-teacher-loop @ 0680877, pushed; main @ 4c1072e; no merge; no deploy
- Unsupported claims removed: Y
- Claim tags applied inline in body: Y
```
