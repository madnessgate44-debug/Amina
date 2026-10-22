# Amina learner walkthrough matrix

These are synthetic task hypotheses, not validated observations about real children. Run each task against a rendered build and record the exact screen, action, response, and outcome.

| ID | Task | Pass condition | Failure signals to capture |
|---|---|---|---|
| L1 | From HOME, identify what to do next today | Learner identifies one clear next action and can start it | Competing CTAs, unclear status, fake/ambiguous priority |
| L2 | Find a relevant curriculum lesson in LIBRARY | Correct lesson can be found without source-code hints | Missing/duplicated lesson entries, unclear subjects, dead ends |
| L3 | Start the selected lesson with NOUR | Lesson context carries into Nour and is visible | Context lost, generic chatbot, wrong subject/language |
| L4 | Complete a FEED learning item | Item has a clear purpose and next action | Feed is only a list, swipe fails, repetitive/duplicate content |
| L5 | Answer incorrectly and recover | Feedback helps the learner understand the mistake and continue | Punitive/opaque error, repeated same question, no recovery |
| L6 | Save an item and find it again | Saved state is visible and item is retrievable | Save affordance unclear, duplicate saves, saved item disappears |
| L7 | Navigate away and resume where supported | Existing progress/context survives the transition | State resets, misleading completion, unclear resume behavior |
| L8 | Encounter loading/empty/error state | Status is truthful and a safe next action is available | Infinite loading, blank screen, duplicate retry, false success |
| L9 | Compare repeated UI patterns across HOME/FEED/LIBRARY/NOUR | Same action has predictable labels and behavior unless difference is intentional | Duplicate cards/actions, inconsistent icons, competing progress indicators |
| L10 | Check phone and language behavior | No overflow or clipped controls at phone width; French accents and RTL behave correctly in their supported modes | Tiny tap targets, overlap, wrong direction, unreadable text |

## Finding format

- **ID / severity:** P0 blocker, P1 major, P2 moderate, P3 polish
- **Task and state:** reproducible sequence
- **Evidence:** screenshot/trace/run ID and viewport; source file(s) only as root-cause evidence
- **Observed result:** factual, not interpretation
- **User impact / root cause:** explain the consequence and likely cause separately
- **Fix:** smallest change that addresses the root cause
- **Acceptance:** repeatable pass condition
- **Confidence:** high/medium/low
- **Validation needed:** synthetic-only or requires real learner/parent confirmation

Do not publish personal data, real student records, or unredacted screenshots.
