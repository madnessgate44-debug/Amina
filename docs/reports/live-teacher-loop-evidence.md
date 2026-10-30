# Live teacher loop — captured evidence

Captured 2026-10-30 against a local production build of `feat/live-teacher-loop`
(`npm run build`, served with `NODE_ENV=production` on port 12000), driven with
Playwright at an emulated phone (390x844, `ar-EG`, DPR 2).

The local server was started **without** a Gemini key, which is deliberate: it
makes the offline teacher path the default and proves the lesson still works
when the model is unreachable.

## What each screenshot shows

| File | What it proves |
|---|---|
| `01-question.png` | A real lesson reel in the child's feed. Miss Noor opens the concept and asks a question with four options. This text comes from `preGeneratedNoorLines.ts`, so it costs zero quota. |
| `02-wrong-immediate.png` | The instant after the child taps a wrong option: the chosen option is marked red, the correct one green, and the card already shows the "🎒 معلمة بدون إنترنت" (teacher offline) badge — the fallback is honest rather than silent. |
| `03-wrong-diagnosis.png` | The settled reaction. Noor answers the specific answer instead of a generic "wrong", the next question in the reel is revealed, and evidence was recorded (`تم تسجيل الدليل بنجاح`). |
| `04-correct-answer.png` | A correct answer: the reel praises (`برافو! 🎉`) and awards XP (`+5.3%`). No model call is made for a correct answer — the praise line is already stored. |

All four were captured with **0 console errors**.

## The misconception path (verified directly, not via the feed)

The engine diagnoses a wrong answer against curriculum misconceptions **before**
calling any model. That path is real and was exercised against the live service
with real curriculum data:

```
concept:            conc_mathfr_u1_l1_position
question:           جدول القيمة المكانية للأعداد العشرية
child picked:       0,4
→ source:           misconception
→ namedMisconception: true
→ degraded:         false
→ text:             لأ يا سارة، خلّينا نفهم إيه اللي حصل. Vous avez lu le chiffre
                    tout seul, sans regarder sa position après la virgule. La
                    virgule donne sa valeur au chiffre : 4 unités vaut 4, mais 4
                    millièmes vaut 0,004.
```

It could not be captured as a screenshot because the misconception-carrying
reels are **not reachable from the feed**. `buildFeedQueue` returns 16 reels
built from `conc_fr_u2_l1_articles_indefinis`, `off_sci_u1_l2_c1`,
`off_math_u6_l1_c1` and `closer`; the five concepts that carry misconception data
(`conc_mathfr_*`) never appear in it.

## Two real defects found while capturing this

### D-1: misconception text is French, even for an Arabic child — FIXED

All 10 misconception entries in the curriculum are written in French, and the
Arabic branch of `resolveReelResponse` injected them verbatim:

```ts
const named = language === 'ar'
  ? `لأ يا ${studentName || 'بطل'}، خلّينا نفهم إيه اللي حصل. ${misconception.explanation} ${misconception.remediation}`
  : ...
```

Measured across the whole curriculum:

| Misconception text | Count |
|---|---|
| Arabic only | 0 |
| Latin (French) only | **10** |
| Mixed | 0 |

So every named-misconception reply mixed Arabic scaffolding with a French
explanation. A child reading Arabic got a French sentence in the middle of it.

Fixed on this branch: the deterministic diagnosis is still tried first, but only
when the stored text is in the language the child is reading. On a script
mismatch the turn falls through to the model, which can explain in the child's
own language, and is marked `degraded` rather than pretending. The remaining
gap is the **content** one — the 10 misconceptions still need Arabic copies.

### D-2: the misconception path is unreachable in the feed

The five concepts with misconception data are all `conc_mathfr_*` (French-track
maths). `buildFeedQueue` does not select them, so in practice a child can never
reach the deterministic, zero-quota diagnosis path. The most teacher-like
behaviour in the app is effectively dead code from the feed's point of view.

## Reproduce

```bash
npm ci --legacy-peer-deps
npm run build
PORT=12000 NODE_ENV=production node ./node_modules/.bin/tsx server.ts &
# driver scripts in /tmp (not committed); Playwright via PLAYWRIGHT_MODULE shim
```
