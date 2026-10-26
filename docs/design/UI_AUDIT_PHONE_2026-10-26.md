# Miss Noor — Phone UI Audit (skill step 1)

**Date:** 2026-10-26
**Baseline commit:** `ed8b4c2` (`main`, after PR #40 merged)
**Method:** `node scripts/ui-audit.mjs` — real built app, headless Chromium, viewport
**390×844 @3×** (iPhone 12/13/14 logical size), Arabic RTL, synthetic learner
("Learner QA"). No real child or student data.
**Screens captured:** 10 PNGs + `report.json` in `artifacts/ui-audit/`.
**Console errors:** 0.

This is an observation record, not a redesign. It answers one question: what does
a 10-year-old actually see on a phone? Findings are ranked by how much they would
make a child hesitate.

## How to reproduce

```bash
npm run build
PORT=12000 NODE_ENV=production npx tsx server.ts &
node scripts/ui-audit.mjs http://127.0.0.1:12000
```

The harness walks onboarding end to end (four steps), then all four nav
destinations, then the classroom, capturing a screenshot and a DOM summary at each.
It prints headings, button labels, horizontal overflow, the smallest tap target,
and any text under 12px.

## What works well

- **No horizontal overflow anywhere.** `overflowXPx` is 0 on all ten screens, so
  nothing is cut off at 390px. RTL is handled correctly (`dir="rtl"`).
- **Zero console errors** across the whole walk, including the classroom.
- **Onboarding tap targets are 44px.** Every button in all four onboarding steps
  meets the accessibility floor, and none is crowded.
- **The nav is honest.** Four tabs, correctly labelled:
  الرئيسية | الموجز | المكتبة | نور (HOME | FEED | LIBRARY | NOUR).
- **The warm-up quiz is real.** Step 3 asked "ليلة الإسراء والمعراج" with
  plausible history options, not filler.
- **Degraded mode is truthful.** With no API key the app runs the full learner
  flow; only live AI text is replaced.

## Findings, ranked

### F1 — The "Next" button is disabled with no reason given (high)

`01-onboarding-step1.png`. Step 1 requires a name, an address form (بنت/ولد) and an
age before التالي enables. A child who types their name and taps Next gets a
dimmed button and no hint about what is missing.

Evidence: `OnboardingFlow.tsx:307` — `disabled={!name.trim() || !addressForm || age === null}`.
The disabled state only lowers opacity (`disabled:opacity-50`); there is no message.

Why it matters: this is the very first interaction in the app. A dead button on
step 1 is the most likely place for a child to give up.

### F2 — Small tap targets on HOME, FEED and the classroom (high)

The smallest visible tap target is **19px** on the classroom and NOUR screens
(`08-nour.png`, `09-lesson-start.png`), **26px** on HOME and FEED, and **40px** in
LIBRARY. The floor is 44px.

Worst case: the "تغيير الدرس" (Switch lesson) button at
`VirtualTeacherClassroom.tsx:1101` — `py-1.5` with `text-[11px]`, giving a ~19px
tall control that a small finger will miss.

### F3 — Body text below 12px on most screens (medium)

The harness found sub-12px text on HOME (8 items), LIBRARY (8), NOUR (8) and the
classroom (8). Examples: `text-[9px]` for the book/page reference
(`VirtualTeacherClassroom.tsx:1092`), and 9–11px labels for grade, subject counts
and the lesson source line.

A 10-year-old on a phone should not have to squint at the lesson reference.

### F4 — The teacher is called "المعلمة نور" in some places, "مس نور" in others (medium)

`08-nour.png` titles the screen **"فصل المعلمة نور"**. Elsewhere the app says
"مس نور" (for example the Arabic welcome line fixed in PR #39). Both refer to the
same teacher, so the child sees two different names for her.

Occurrences of "المعلمة نور" in user-visible Arabic strings include
`VirtualTeacherClassroom.tsx:1026,1045,1186,1420,1820`, `HomeScreen.tsx:513`,
`TimetableScreen.tsx:214`, and `LessonStudyModal.tsx:163,386`.

### F5 — No headings on any onboarding screen (low)

`headings` is empty for all four onboarding steps: the screens are built from
speech bubbles and buttons with no `h1`/`h2`. This is a screen-reader and
skimmability gap rather than a visual one.

### F6 — The FEED card headline reads as a task, not a story (low, needs owner judgment)

`06-feed.png` shows the first card headline as a full sentence:
"الوضوء بهدوء وإتقان وأداء صلاة الظهر في وقتها أثناء استراحة المذاكرة."

It is accurate but dense for a child's feed. Whether FEED should lead with a
shorter hook is a product decision, not a defect — recorded here rather than
changed.

## Screens

| # | File | Screen | Smallest tap | Text < 12px |
|---|---|---|---:|---:|
| 1 | `01-onboarding-step1.png` | Onboarding 1 — language, name, gender, age | 44px | 0 |
| 2 | `02-onboarding-step2-books.png` | Onboarding 2 — books and today's lessons | 44px | 0 |
| 3 | `03-onboarding-step3-quiz.png` | Onboarding 3 — warm-up question | 44px | 0 |
| 4 | `04-onboarding-step4-preferences.png` | Onboarding 4 — subjects, style, session length | 44px | 0 |
| 5 | `05-home.png` | HOME | 26px | 8 |
| 6 | `06-feed.png` | FEED | 26px | 4 |
| 7 | `07-library.png` | LIBRARY | 40px | 8 |
| 8 | `08-nour.png` | NOUR (classroom) | 19px | 8 |
| 9 | `09-lesson-start.png` | Classroom with a lesson open | 19px | 8 |
| 10 | `10-home-fullpage.png` | HOME, full scroll | 19px | 8 |

## Boundaries respected

Read-only audit. No production UI was changed, no curriculum content touched, no
dependencies added. The harness is additive and writes only to
`artifacts/ui-audit/`.

## Recommended next work (not done here)

1. **F1** — show what step 1 still needs (for example a hint under the button, or
   enable Next and validate on tap). Highest impact for the least code.
2. **F2** — raise the classroom and HOME tap targets to at least 44px.
3. **F4** — pick one Arabic name for the teacher and use it everywhere.
4. **F3** — raise the smallest text to at least 12px.
5. **F5/F6** — add real headings to onboarding; review the FEED headline with the
   owner.

F2 and F4 are small, self-contained changes and are the natural candidates for the
next PR.
