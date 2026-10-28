# Miss Noor — Multi-profile UI audit (desktop, French, English)

**Date:** 2026-10-28
**Baseline commit:** `15d268c` (`main`, after PR #55 merged)
**Method:** `AMINA_PROFILES=... node scripts/ui-audit.mjs` — real built app, headless
Chromium, five profiles in one run. Synthetic learner ("Learner QA"). No real child
or student data.
**Screens captured:** 10 (Arabic phone/desktop), 9 (French phone/desktop, English
desktop) per profile, plus a `report.json` per profile.
**Console errors:** 0 in every profile.

This continues the phone audit (`UI_AUDIT_PHONE_2026-10-26.md`), whose
"recommended next work" asked for exactly this: run the same walk at desktop
width, in French and in English. It is an observation record, not a redesign.

## How to reproduce

```bash
npm run build
PORT=12001 NODE_ENV=production npx tsx server.ts &
AMINA_PROFILES=phone-ar,desktop-ar,phone-fr,desktop-fr,desktop-en \
  node scripts/ui-audit.mjs http://127.0.0.1:12001
```

Reports land in `artifacts/ui-audit/<profile>/report.json` with a PNG per screen.
`AMINA_PROFILES` defaults to `phone-ar`, so the original single-profile behaviour
is unchanged when the variable is unset.

| Profile | Viewport | Locale |
|---|---|---|
| `phone-ar` | 390×844 | ar-EG |
| `desktop-ar` | 1365×900 | ar-EG |
| `phone-fr` | 390×844 | fr-FR |
| `desktop-fr` | 1365×900 | fr-FR |
| `desktop-en` | 1365×900 | en-GB |

## Result

| Profile | Screens | Console errors | Smallest tap | Horizontal overflow | Text < 12px |
|---|---:|---:|---:|---:|---:|
| `phone-ar` | 10 | 0 | 44px | 0px | 0 |
| `desktop-ar` | 10 | 0 | 44px | 0px | 0 |
| `phone-fr` | 9 | 0 | 44px | 0px | 0 |
| `desktop-fr` | 9 | 0 | 44px | 0px | 0 |
| `desktop-en` | 9 | 0 | 44px | 0px | 0 |

The French and English profiles reach 9 screens rather than 10: the lesson-start
screen is not reachable from the nav in those locales within the walk, so the
harness records that in `notes` instead of inventing a pass. Arabic reaches all 10.

## Findings

### M1 — The LIBRARY view toggle was 32px, below the 44px floor (high)

Every profile except the Arabic phone measured a **32px** smallest tap target on
LIBRARY (`07-library.png`). The offenders were the two view-mode buttons,
"School Bookshelf" and "Units & Lessons", at `CurriculumBrowser.tsx:180,197` —
`py-2` with `text-xs` gives a 32px-tall control.

The original phone audit measured LIBRARY at 40px and the F2 fix raised the
buttons it *measured*; this pair was never measured at the time, so it was missed.
It is the same defect class, on a control a child uses to switch how their whole
library is shown.

**Status: fixed.** Both buttons now carry `min-h-[44px]`. Re-measured across all
five profiles: **44px everywhere**. Guarded by `test:phoneui`
(`phoneUiAccessibility.test.ts`, entry `library`).

### M2 — The harness could not complete non-Arabic onboarding (harness defect)

Running the walk in French and English stalled at onboarding step 4 and produced a
fatal timeout, not a clean report. Root cause was in the harness, not the app:

1. The step-1 advance pattern was `/التالي|Continue|Suivant/`. The English button
   is **"Next"** (`translations.ts:347`), so English never left step 1.
2. The step-3 quiz advance pattern omitted French **"Question suivante"**
   (`:674`) and English **"Next question"** (`:364`).
3. The quiz option-picker skip-list omitted the read-aloud control, so in French
   and English it clicked **"Appuie pour écouter" / "Tap to hear"** instead of an
   answer and stalled.
4. The step-4 finish pattern omitted **"Let us start! ✨"** (`:378`) and
   **"Commençons ! ✨"** (`:688`).

**Status: fixed** in `scripts/ui-audit.mjs`. This was a measurement gap: the app
was never broken, the instrument could not see past step 1 outside Arabic. Worth
recording because the previous audit's claim of coverage was narrower than it read
— it was Arabic-phone only, exactly as its own method section said.

### M3 — Onboarding warm-up prompts are Arabic in every locale (needs owner judgment)

`03-onboarding-step3-quiz.png` in the French and English profiles shows Arabic
questions and options ("ليلة الإسراء والمعراج", "يوم فتح مكة"). The prompt text
comes from curriculum exercises via `buildWarmupQuestions(language, …)`
(`warmupService.ts:109`); the surrounding chrome, headings and buttons are
correctly localised, but the question body is curriculum content, which is Arabic.

This is not a regression and not obviously a defect: the material is genuinely
Arabic-language curriculum, and R5 forbids editing curriculum content. Whether a
French-track child should see a French-rendered warm-up is a product decision.

**Status: open, owner decision.** Recorded, not changed.

## Boundaries respected

The harness is additive and writes only under `artifacts/ui-audit/`. The one app
change (M1) is a 44px minimum height on two existing buttons — no redesign, no
colour, wording, layout, curriculum or behaviour change. No dependency added. No
merge of PR #7 or #8. No deployment.

## Recommended next work

1. **M3** needs an owner decision on warm-up localisation for non-Arabic tracks.
2. Extend the walk to reach the lesson-start screen in French and English, so the
   profile counts match Arabic's 10.
3. Re-run this harness against a deployment once R4 establishes which commit is
   live, so the evidence is tied to a deployed SHA rather than a local build.
