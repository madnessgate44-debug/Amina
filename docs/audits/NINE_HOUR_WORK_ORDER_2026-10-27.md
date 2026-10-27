# Nine-hour autonomous work order — Miss Noor

**Window:** 2026-10-27 09:21 UTC → 18:21 UTC (nine hours)
**Owner:** offline. Authority granted: implement, open PRs, squash-merge to main.
**Cadence:** one scheduled run every two hours, plus the kickoff run.

This file is the instruction set for each scheduled run. Read it first, work out which
blocks are already done, and execute the **next unfinished block**. Do not restart
completed work.

---

## Standing rules for every run

**Merge gate — all must pass before merging:**
`npm run lint` 0 errors, `npm test` all pass, `npm run build` passes, CI `verify` green,
and re-read the diff against the acceptance criteria in this file.

**Never:** force-push or rewrite `main`; merge PR #7 or #8; deploy; add dependencies;
start paid provider or desktop runs; change production UI in ways not listed here.

**If `main` goes red after a merge:** revert immediately with a revert PR.

**Verification rule:** a claim must be Verified, not trusted. Label findings
Verified / Observed-not-verified / Hypothesis / Blocked. Never invent a command result.

**Names:** the product is **Miss Noor**. "Amina" and "Bemis Noor" are legacy and wrong.
Nav is locked: HOME | FEED | LIBRARY | NOUR. Grade 5, École Girard, Alexandria,
French track, Egyptian curriculum.

**At the end of every run:** comment on issue #9 with what changed, the commit SHA, the
exact gate results, and anything blocked. Then stop.

---

## Block 1 — Fix the two empty-stub lessons

**Deliverable:** `Mathematics — "Multiplying Decimals by Powers of 10"` and
`Science — "States of Matter & Particle Movement"` currently have no concepts, no
`readingText`, no `vocabulary` and no `exercises`. Give both real content consistent
with the Egyptian Grade 5 curriculum and the French-track context.

**Acceptance:** both lessons carry at least one concept with `prerequisiteAr/En` and a
daily-life example, plus reading text and exercises. Verified by running
`getAminaFlatConcepts()` and confirming the count of zero-concept lessons is 0.

---

## Block 2 — Make the conversation hands-free

This is the owner's headline complaint: the child has to press a button for every turn.

**Deliverable:** Miss Noor listens automatically after she finishes speaking, and the
child can interrupt her. `voiceService.speak()` / `startListening()` and
`VoiceInputControl` already exist, so this is a turn-taking loop, not a rebuild.

**Acceptance:** a learner can complete a full lesson turn cycle by voice alone without
touching the screen. Add a test covering the auto-listen transition and the interrupt
path. Do not remove the existing press-to-talk path; make hands-free the default.

---

## Block 3 — Study the three references, skill by skill

**Deliverable:** a design document that reads the reference skills line by line and maps
each to a concrete change in this app.

1. `anthropics/k12-teacher-skills` — the four skills, their instructions and their
   rubrics. Clone it and read the actual files, do not work from summaries.
2. ChatGPT Study Mode — the controlled interaction strategy: when to explain, hint,
   ask, or test.
3. Gemini Guided Learning — teaching through visuals, not only text.

**Acceptance:** one row per reference skill with: what it does, what exists here already,
what is missing, and the smallest change that would deliver it. Then implement the
single highest-value item, which is expected to be misconception-aware feedback (Block 4).

---

## Block 4 — Make misconceptions data, not hardcoded strings

**Deliverable:** add misconception and distractor fields to the curriculum model, and
extend `evaluateStudentAnswer` so a wrong answer identifies **what** was misunderstood
instead of only returning `full | partial | wrong`.

**Acceptance:** a wrong answer on a lesson that has no hardcoded diagnosis block still
produces a specific, content-sourced explanation. That test currently fails and must pass.

---

## Block 5 — Depth, naming and polish

**Deliverable, in priority order:**

1. Deepen the French-track subjects — Mathematics has 3 concepts across 4 lessons and
   Science 2 across 3, against ICT's 12 across 12.
2. Remove the legacy name from curriculum content. The French reading passage currently
   teaches the child to say *"Je m'appelle Amina"*. Extend the existing branding guard to
   scan `src/data/`.
3. Apply the defined-but-unused brand tokens, and fix the two `text-slate-400` contrast
   failures at `CurriculumBrowser.tsx:388` and `:574` (2.56:1 on white; raise to
   `text-slate-600` at 7.58:1).

**Acceptance:** each item verified by a command, not by inspection. Re-run the visual
audit if the tokens change.

---

## Final run — verify and report

After Block 5, do not start new work. Instead:

1. Confirm `main` is green and every merged block is actually on `main`.
2. Re-run the full gate suite on `main` and paste the real output.
3. Post a single closing comment on issue #9: what shipped, what did not, what is
   blocked, and the recommended next work.
4. State plainly that no deploy was performed.

---

## Known context so each run does not re-discover it

- Repo: `madnessgate44-debug/Amina`. `gh` CLI auth is broken — use the GitHub REST API
  with `$GITHUB_TOKEN`.
- To mark a draft PR ready, use GraphQL `markPullRequestReadyForReview` (needs the
  PR `node_id`), then merge with the **full 40-character** SHA. Short SHAs are rejected.
- Tailwind v4 renamed `bg-gradient-to-*` to `bg-linear-to-*`. Grep for `bg-gradient`
  returns 0 and is misleading.
- Counting concepts with `grep` is unreliable — ids use different suffixes. Count through
  `getAminaFlatConcepts()`, which is what the app loads. A `grep` zero is not a measurement.
- The audit to read first: `docs/audits/TEACHING_ENGINE_GAP_AUDIT_2026-10-27.md`.
