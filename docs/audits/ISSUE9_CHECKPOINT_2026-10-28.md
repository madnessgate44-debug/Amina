# Issue #9 checkpoint — R1–R4 status, R3 breadth closure, and F-12 preservation

**Date:** 2026-10-28
**Baseline:** `main` = `0c10f3f` ("fix(ui): 44px LIBRARY view toggle, extend audit to
desktop and French (#56)").
**Scope:** documentation and QA evidence only. No app behaviour change, no
curriculum edit, no dependency added, no deployment, no merge of PR #7 or #8.

This addendum answers the owner's latest request on Issue #9: it resolves the
duplication between the open draft PR #47 and the already-merged PR #56, closes
the last R3 breadth gap, and preserves PR #47's unique finding so it cannot be
lost if that PR is closed.

---

## 1. Why this checkpoint exists — the duplication, resolved

While working Issue #9 a second session created PR #56, which fixed the same 32px
LIBRARY view-switch floor that the long-open draft **PR #47** already fixed. PR
#56 was merged first (`0c10f3f`). PR #47 remains open, draft, and `CONFLICTING`
(verified via the GitHub API, not the description).

The overlap is now settled in one direction: **the code fix lives on `main`**
(`CurriculumBrowser.tsx:184,197` carry `min-h-[44px]`; the `library` guard entry
is in `phoneUiAccessibility.test.ts:83`). Nothing in this checkpoint re-applies
it.

What PR #47 still holds that `main` does not:

| Unique to PR #47 | Where it now lives |
|---|---|
| **F-12** — French FEED headline renders English | §4 below (preserved here) |
| Forensic-audit §15 (R3 breadth + F-11 record) | §3 below |
| Phone-audit correction note | §3 below |
| A **mobile + English** walk cell | §2 below (`phone-en`) |

Nothing unique is lost if PR #47 is closed. The owner still holds the decision on
whether to rebase PR #47 or close it (see §6).

---

## 2. R3 breadth — the six-cell matrix, now complete

`main`'s harness already ran five profiles; it had **no mobile + English** cell.
Issue #9 R3 asks for "mobile (390px), desktop (1365px), French/English, and Arabic
RTL" evidence. Adding `phone-en` closes the last combination.

**Harness change (one line):** a `phone-en` entry in the `PROFILES` map of
`scripts/ui-audit.mjs`. Additive; the default profile is unchanged.

**Command (identical for every cell), against the real production build on
`http://127.0.0.1:12000`:**

```bash
npm run build
PORT=12000 NODE_ENV=production node ./node_modules/.bin/tsx server.ts &
PLAYWRIGHT_MODULE=/tmp/ops/pw.mjs CHROMIUM_PATH=/usr/bin/chromium \
  AMINA_PROFILES=phone-ar,desktop-ar,phone-fr,desktop-fr,phone-en,desktop-en \
  node scripts/ui-audit.mjs http://127.0.0.1:12000
```

**Result — six cells, one run, 2026-10-28:**

| Cell | Screens | Console errors | Min tap | Text < 12px | H-overflow | `dir` |
|---|---:|---:|---:|---:|---:|---|
| `phone-ar` 390×844 ar-EG | 10 | 0 | 44px | 0 | 0px | `rtl` |
| `desktop-ar` 1365×900 ar-EG | 10 | 0 | 44px | 0 | 0px | `rtl` |
| `phone-fr` 390×844 fr-FR | 9 | 0 | 44px | 0 | 0px | `ltr` |
| `desktop-fr` 1365×900 fr-FR | 9 | 0 | 44px | 0 | 0px | `ltr` |
| `phone-en` 390×844 en-GB | 9 | 0 | 44px | 0 | 0px | `ltr` |
| `desktop-en` 1365×900 en-GB | 9 | 0 | 44px | 0 | 0px | `ltr` |

Machine-readable evidence is committed under `artifacts/ui-audit/<profile>/report.json`
(plus the canonical `artifacts/ui-audit/report.json`). Screenshots regenerate with
one command and are `.gitignore`d by size.

**Why non-Arabic cells show 9 screens, not 10:** the lesson-start screen is not
reachable from the nav in those locales within the walk; the harness records that
in `notes` ("No lesson-start button found on the reachable screens") rather than
inventing a pass. Arabic reaches all 10.

**Explicit limitation:** this is a scripted walk with a synthetic profile
("Learner QA"). It proves the screens render and are reachable at each
viewport/locale with no console error, no sub-44px control and no overflow. It is
**not** proof that a real child completed every task, and no real child or student
data was involved.

---

## 3. PR #47's documentation, preserved

The two documentation corrections carried only by PR #47 are folded in here so the
canonical record is complete on `main`:

- **F-11** — the LIBRARY view-switch buttons measured **32px** whenever their label
  fitted on one line (Arabic at desktop width, and French/English everywhere). The
  original phone audit's "44px on all ten screens" held only for the Arabic phone
  cell, whose labels wrap to two lines and lift the box to ~44px by accident. Fixed
  by `min-h-[44px]`; guarded by the `library` entry in `phoneUiAccessibility.test.ts`.
- **R3 breadth** — the walk is parameterised by `AMINA_PROFILES`; see §2.

---

## 4. F-12 — French FEED headline renders English (P3, observed) — decision request

In the French walk the first FEED card headline renders in English:

> "Performing Wudu attentively and praying Dhuhr on time during study breaks."

**Cause (Verified in source):** `src/services/reels/reelGenerator.ts:139` maps the
French hook to the English curriculum field:

```ts
pickLang({ ar: concept.dailyLifeExampleAr, en: concept.dailyLifeExampleEn, fr: concept.dailyLifeExampleEn }, lang),
```

No `dailyLifeExampleFr` field exists in any curriculum file
(`grep -rn "dailyLifeExampleFr" src/` → no matches). The surrounding reel chrome
(mistake/quiz/teach/session hooks) is properly localised, so this is a
**content-data gap**, not a code defect.

**Not changed.** Adding French curriculum text is inside the "do not modify
curriculum content" boundary (R5). Recorded as a decision request. Options:

1. Add a French `dailyLifeExampleFr` per concept (curriculum work), or
2. Accept the English FEED fallback in the French locale.

Reproduced live on 2026-10-28: the French and English cells both show the English
headline; the Arabic cell is correct.

---

## 5. R1 / R2 / R4 — status at this checkpoint

**R1 — baseline (Verified).** `main` = `0c10f3f`. Audit report
`docs/audits/AMINA_FORENSIC_AUDIT_2026-10-22.md` (requirement-to-evidence matrix,
§3); phone audit `docs/design/UI_AUDIT_PHONE_2026-10-26.md`; multi-profile audit
`docs/design/UI_AUDIT_MULTI_PROFILE_2026-10-28.md`.

**R2 — strict TypeScript gate (Verified: already fixed on `main`).** No typecheck
PR is needed; the defect described in the issue (F-04) is closed.

| Gate | Command | Result |
|---|---|---|
| Typecheck (blocking) | `npm run lint` (`tsc --noEmit`) | **exit 0, 0 errors** |
| Full tests | `npm test` | **exit 0, 503 passed / 0 failed** |
| Production build | `npm run build` | **exit 0** |

- `tsconfig.json` sets `"strict": true`.
- `.github/workflows/ci.yml` runs the typecheck step with **no**
  `continue-on-error` (grep across `.github/` → no matches). The job is a real
  blocking gate.
- The `strictTypecheckGate` suite (8 assertions) passes, guarding the gate itself.

**R4 — deployment identity (Verified, with one named limitation).** Production
target is Vercel Hobby (`vercel.json`, `DEPLOY.md`).

| Check | Result |
|---|---|
| `GET https://amina-nine-sepia.vercel.app/api/health` | **200** `{"status":"ok","hasApiKey":true}` |
| `GET …/assets/index-JMhJHId3.js` | **200**, 1,273,730 bytes |
| Local production build asset | `dist/assets/index-JMhJHId3.js`, same size |
| **SHA-256 (live vs local)** | **byte-identical** — `f6a9c0b5…90c0` |
| `node scripts/smoke.mjs https://amina-nine-sepia.vercel.app` | **7 passed, 0 failed** |

The deployed **frontend bundle** is byte-identical to a local build of `main`
`0c10f3f`, so the live app matches this baseline. **Limitation:** this ties the
bundle to the SHA; Vercel's recorded commit metadata is not readable by OpenHands
without dashboard access. No deployment was performed.

---

## 6. Decision requests (owner)

1. **PR #47** — rebase it (taking `main`'s side for the code hunk, keeping its
   unique docs) or close it. Its unique content is preserved here either way. My
   recommendation: **close it**; the fix and the F-12 record now both live on
   `main`, so a rebase would only re-add already-landed work.
2. **F-12** — add French `dailyLifeExampleFr` curriculum content, or accept the
   English FEED fallback in French?
3. **M3** (`UI_AUDIT_MULTI_PROFILE_2026-10-28.md`) — onboarding warm-up questions
   are Arabic curriculum text in every locale. Product decision; recorded, not
   changed.

---

## 7. Boundary compliance

- Did **not** merge PR #7 or #8; both remain open and untouched.
- Did **not** deploy or change production.
- Added **no** dependency to the app; audit tooling (`playwright-core`) lives
  outside the repository, under `/tmp`.
- Did **not** modify curriculum content or the HOME/FEED/LIBRARY/NOUR structure.
- Did **not** touch PR #47's branch; the duplication is reported, not silently
  resolved by force-push.
- The only source change is the additive `phone-en` harness profile; everything
  else is evidence and documentation.
