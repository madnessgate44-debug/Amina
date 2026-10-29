# Miss Noor — where the app actually stands

**Date:** 29 October 2026
**Prepared for:** the club
**Repository:** `madnessgate44-debug/Amina`
**Live app:** `https://amina-nine-sepia.vercel.app`
**Current `main`:** `6af76c1`

---

## The one-paragraph version

Yesterday the app looked like it had not changed, and that complaint was **correct**. The tutor was
never reaching an AI model — every request hit a model that returned an error, the error was caught,
and a hardcoded sentence was shown instead. The child heard a template and the app hid the failure.
That is now fixed, deployed and verified live: the teacher writes real lessons in Egyptian Arabic.
We also did the research the club asked for on how OpenHands Cloud, ChatGPT Study Mode and Gemini
Guided Learning work as teaching agents, and turned it into a concrete plan. The teaching brain is
switched on. The reels/feed are still passive and are the next job.

---

## Part 1 — The research the club asked for

We studied three systems and separated what each one actually is. This matters, because two of them
are often confused for each other.

### 1.1 OpenHands Cloud — skills, sub-agents, delegation

**Source:** `docs.openhands.dev` (fetched, HTTP 200).

- **Skills** are reusable instruction files (`SKILL.md`). Only the name and description load up
  front; the full body loads when a task matches. Three trigger types: keyword, path, always-on.
- **Sub-agents** are files that the main agent calls and waits on, then gets a result back.
- **The rule that matters:** *"Skills guide the agent's behaviour; they do not grant permissions."*
  A skill is knowledge, not capability.

**Why this is not the same as teaching the child:** this system makes *our coding agents* consistent.
It does not run inside the child's app. Copying it into the app would be a category error. It is the
**container** pattern, not the teaching behaviour.

### 1.2 ChatGPT Study Mode — the behaviours

**Source:** OpenAI help centre (fetched, HTTP 200). Quoted:

- *"Instead of only giving a final answer, ChatGPT can ask questions, guide your thinking, explain
  ideas step by step, and check your understanding as you go."*
- Guide your thinking: *"can guide you with questions instead of giving the answer right away (a
  Socratic-style approach)."*
- Explain in layers: *"start with a simple explanation, then add more detail when you are ready."*
- Check understanding: *"quiz you one question at a time, wait for your answer, and explain what to
  review next."*
- Personalise with memory: remembers goals and preferred explanation style.

The four behaviours to copy: **ask before telling, layer the explanation, one question at a time and
wait, name the misunderstanding.**

### 1.3 Gemini Guided Learning — teach with a picture

**Source:** Google support (fetched, HTTP 200).

- It is a **mode you switch on** before you ask.
- May include **images and videos** in answers.
- **Practice questions with feedback and hints.**
- **Grounded sources** via `@OpenStax` real textbooks. Google states honest limits: OpenStax
  grounding is **English + US only** and **not for under-18 accounts**.

The behaviour to copy: **teach with a picture, and ground the explanation in a real book page.**

### 1.4 The conclusion that shaped the plan

- OpenHands shows the **container** (for engineering).
- Study Mode and Guided Learning show the **behaviours** (for the child).
- Miss Noor already had the behaviours, but **scattered across services with no names**.

The plan: give Miss Noor a **first-class teaching-skill layer** — the same `.agents/skills` idea, but
as an in-app registry of named, testable teaching skills with a trigger and a data contract.

---

## Part 2 — What we found wrong with the app

### 2.1 The headline bug: the teacher was not talking to a model

Every AI route defaulted to the model `gemini-3.8-flash`. On our key that model returns
**429 RESOURCE_EXHAUSTED**. Each route caught the error and returned a **hardcoded sentence**.

Live proof, before the fix:

```
POST /api/chat  →  {"source":"local_companion_fallback","degraded":true}
```

The child heard scripted text. Nothing on screen said the model had failed.

### 2.2 The second bug: the "teaching session" had no model at all

`src/services/teaching/teachingSession.ts` contained **zero** model calls. The teaching session was a
scripted switch statement. So even with a perfectly healthy model, it could not produce a real
lesson. This is why tapping answer choices changed nothing — the interactivity was decoration over a
template.

### 2.3 The real product gap: no diagnosis from data

The single thing that separates a smart tutor from a quiz with a red cross is that a wrong answer
tells the teacher **what** the child misunderstood. We measured:

- The app has **7** hardcoded misconception blocks.
- The curriculum data model had **zero** `misconception` / `distractor` fields.

So a wrong answer outside the handful of curated cases produced **no diagnosis at all**.

### 2.4 Model name duplicated 11 times

`gemini-3.8-flash` was written out in three different files. One retired name breaks everything at
once, silently. (This is exactly what had happened.)

---

## Part 3 — What we built and shipped

All of this is merged to `main`, deployed, and verified live.

| # | Change | What it fixes |
|---|---|---|
| 1 | **One source of truth for model names** + a fallback chain | A model that is gated now falls through to a working one instead of killing the turn. It remembers the last model that answered. |
| 2 | **All 8 AI calls routed through the helper** | No inlined model name left in the server. |
| 3 | **New `POST /api/teach-turn` endpoint** | Writes each real teaching step — teach, ask, adjust, explain-back, celebrate — grounded in the actual curriculum. |
| 4 | **The session speaks generated lines** | Including the opening greeting, so the child's *first* impression is a real teacher. |
| 5 | **A teaching-skill registry (5 skills)** | Named, testable behaviours: `diagnose-misconception`, `explain-in-layers`, `socratic-check`, `grounded-visual`, `spaced-recheck`. |
| 6 | **Misconception data started** | The data contract now exists in the types, and the French-maths track carries the first real misconception entries. |
| 7 | **Learning telemetry** | Per-session learning signals (misconception resolution rate, independent recheck rate), not just cost/latency. |
| 8 | **Regression test** | Forbids inlined model names and asserts the teaching turn is generated, not scripted. |

**The engine still owns pedagogy.** The model writes the words; the engine still decides the step,
the diagnosis and the mastery evidence. That boundary is deliberate.

---

## Part 4 — The proof

### 4.1 Live production, right now

```
GET  /api/health        → {"status":"ok","hasApiKey":true}
POST /api/teach-turn    → {"source":"gemini", "text": "أهلاً بيكي يا حبيبتي يا سارة! النهاردة هنعرف
                          إزاي النبات بيكبر، وزي ما إحنا بنحتاج أكل ومية، النبات كمان ليه احتياجات
                          أساسية زي المية والهوا وضوء الشمس..."}
```

That is a real, warm, curriculum-grounded explanation — not a bubble. The earlier test produced a
chocolate-bar explanation of the decimal 0.345 ("3 tenths, 4 hundredths, 5 thousandths").

### 4.2 Verification gates

| Check | Result |
|---|---|
| Typecheck | PASS (exit 0) |
| Tests | **547 checks passed, 0 failed** across 20 suites |
| Build | PASS (exit 0) |
| Smoke test (production) | **7/7 passed** |
| Deployed bundle identity | SHA-256 of the live bundle **matches our local build of `main` exactly** |

That last line is the important one: what is live is byte-for-byte what we tested. We do not claim a
deploy without proving the deployed artefact is the tested artefact.

### 4.3 Pull-request record

**24 pull requests** in this period, of which **22 are merged**. The two not merged were duplicates
whose findings were preserved elsewhere.

Key ones:
- **#61** — the teaching agent: misconception diagnosis, skills, telemetry
- **#65** — generate real lessons instead of canned fallbacks *(the headline fix)*
- **#66** — generate the session's opening line too
- **#46** — the engineering skills/sub-agents/hooks roster
- **#55 / #59** — hands-free voice conversation, made the default
- **#58** — bound AI calls so a slow route returns a lesson, not a 504

---

## Part 5 — The agent roster (the "skills that teach agents")

This is the engineering-side answer, and it is worth being precise about it.

- **26 engineering skills** (`.agents/skills/`) — e.g. `engineering-execution-os`, `code-review-rubric`,
  `typescript-strict-gate`, `secret-redaction-scan`, `playwright-evidence-qa`, `miss-noor-design`.
- **19 sub-agents** (`.agents/agents/`) — e.g. `architect`, `frontend-engineer`, `security-engineer`,
  `evidence-verifier`, `pr-auditor`, `release-manager`.
- **Always-on skills** that apply to every task, including an `owner-policy` skill.

**The distinction that the club should hold onto:** these make *our coding agents* behave
consistently. They do **not** teach the child. The teaching-skill registry (Part 3, item 5) is the
separate, in-app layer that teaches the child. Confusing the two is the single easiest mistake to
make with this architecture.

---

## Part 6 — What is still missing

Being straight about this, because the club will ask.

### 6.1 The reels and feed are still passive — **this is the main remaining gap**

The reels are fully templated with **no model calls**. You watch a card; you do not get taught by it.
The "Teach me more" button now leads to a real teaching session, but the reel itself is still passive.
**This is the biggest gap between the app's promise and what the child experiences.**

### 6.2 The fix is a quota workaround, not a quota fix

We route around the gated model. If the free tier runs out on *every* model, the engine fallback line
is served and the response is marked `degraded:true`. That is **observable, not silent** — which is
the improvement — but it is not a capacity fix.

### 6.3 Misconception data covers one track so far

The data contract exists and the French-maths track carries real entries. The other subjects still
need their misconception data written. Until then, diagnosis works where the data exists.

### 6.4 We have not yet proven it on a real phone, by hand

We verified the API and proved the deployed bundle matches our build. We have not put the phone in a
child's hand and watched. That is a real, honest limit on our confidence.

### 6.5 Smaller items carried forward

- Two contrast failures below the accessibility floor.
- Homework and Missions render the same screen.
- The legacy name "Amina" still appears in some shipped curriculum text.
- The French feed headline falls back to English because no French string exists.

---

## Part 7 — What happens next

**Recommendation: make the reels teach.**

Now that there is a working teaching brain to route to, a reel can ask the child something and
respond to their answer — which is what Study Mode and Guided Learning both do. That is the change
that closes the gap between "looks like a feed" and "feels like a teacher".

In dependency order:

1. **Reels ask and respond.** Turn the passive card into a teaching moment. *(Highest value.)*
2. **Finish the misconception data** for the remaining subjects, so diagnosis works everywhere.
3. **Ground the explanation in a picture** — the one Guided Learning behaviour we have not copied.
4. **Fix the smaller items** in §6.5.

---

## Part 8 — How to read the evidence tags in our own documents

Our internal reports tag every claim:

- `[V]` — verified this session, with the command shown.
- `[R]` — read from a named source.
- `[I]` — inferred, and said so.

Where an older document disagrees with a newer one, the newer one says so and gives the command that
shows the current truth. We would rather correct ourselves in public than quietly leave a wrong claim
standing.

---

## Summary table for the club

| Question | Answer |
|---|---|
| Did the app actually change? | **Yes.** Verified live and by bundle hash. |
| Why did it look unchanged before? | The tutor never reached a model; failures were hidden behind hardcoded text. |
| Is the teacher real now? | **Yes** — `source:"gemini"`, real Egyptian-Arabic lessons on production. |
| Does it diagnose the child's mistake? | Partly — the skill layer and data contract exist; data covers one track so far. |
| Are the reels teaching yet? | **No.** Passive. This is the next job. |
| Does it cost anything new? | **No.** Existing free Gemini tier and code already in the repo. |
| Is it proven? | Lint, tests (547/0), build, smoke 7/7, and deployed-bundle SHA-256 match. |
| Biggest remaining gap | Reels/feed are passive. |
| Biggest honest limit | Not yet tested by hand on a real phone. |
