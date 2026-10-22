# Amina design lab — initial source review

**Review type:** source-only reconnaissance  
**Repository baseline:** `main` at `86c1e73cf760069b1dd58fba994f3f3f0f49a00c`  
**Rendered browser evidence:** not captured  
**Synthetic learner run:** not executed  
**Status:** preliminary findings; no product code changed

This review applies the evidence-first rules from the integrated UI Check workflow, but the current GitHub inspection surface cannot render the app. Therefore, visual appearance, tap behavior, and task completion remain unverified.

## Confirmed implementation facts

- `src/components/layout/AppShell.tsx:83-99` routes HOME, FEED, LIBRARY (`learn`), and NOUR (`companion`) to distinct screen components; it also has secondary screens for missions, homework, collections, review, progress, timetable, profile, and settings.
- `src/components/layout/BottomNav.tsx:12-17` defines the four primary destinations. The four-destination structure is present in source.
- `src/components/feed/FeedScreen.tsx:36-81` constructs the Feed by appending up to six pending missions, six available lessons, and four due-review nudges from three independent sources.
- `src/components/feed/FeedScreen.tsx:88-91` uses a vertically scrollable, mandatory-snap container and tells the learner to swipe up.
- `src/components/curriculum/CurriculumBrowser.tsx:81-98` searches Arabic and English titles, optional French lesson titles, Arabic subject names, Arabic book names, and reading text. It does not search French subject names or French book names in this filter.

## Preliminary findings

### ADF-001 — Feed can show the same learning destination through multiple card sources

- **Severity:** P2 — verify in rendered app
- **Evidence:** `src/components/feed/FeedScreen.tsx:49-79` appends general lesson cards and review-nudge cards separately. A general lesson gets ID `lesson-{lesson.id}`; a review card gets ID `review-{conceptId}`, but both may carry the same `lessonId`. There is no shared de-duplication pass across these sources.
- **Observed fact:** the feed builder has no cross-source uniqueness check.
- **User impact hypothesis:** when a due-review concept belongs to a lesson already in the selected general-lesson slice, the learner can see two cards leading to the same lesson, one described as a lesson and another as a review.
- **Root-cause hypothesis:** independent source lists are concatenated without a product-level rule for whether a review should replace, annotate, or coexist with the general lesson card.
- **Proposed fix:** do not patch yet. Use a fixture or live student state to confirm a duplicate. If confirmed, define a precedence rule (e.g., one card per lesson, with a review reason attached) and test it.
- **Acceptance:** for a known student state, no two Feed cards unintentionally lead to the same lesson/concept; intentional repeat practice must explain why it repeats.
- **Confidence:** medium; code path confirmed, occurrence depends on runtime data.

### ADF-002 — French-mode Feed metadata is inconsistent with French-mode lesson titles

- **Severity:** P2 — localization consistency
- **Evidence:** `src/components/feed/FeedScreen.tsx:59-64` localizes lesson titles to French when available but sets `subject` to Arabic or English only. `src/components/feed/FeedScreen.tsx:67-75` uses Arabic or English for review titles and subjects, with no French branch. The purpose copy also falls back to English outside Arabic.
- **Observed fact:** the Feed's French handling is incomplete in these fields.
- **User impact:** mixed-language cards can look unfinished and make the subject/review context less immediately legible in the French-track experience.
- **Proposed fix:** use the same language-resolution helper for title, subject, review text, and purpose copy; preserve a documented fallback when a French translation is unavailable.
- **Acceptance:** with French selected, all visible Feed labels use French where translations exist; any fallback is deliberate and consistent.
- **Confidence:** high for source inconsistency; rendered severity remains unverified.

### ADF-003 — Curriculum search can miss French subject/book-name matches

- **Severity:** P2 — discoverability
- **Evidence:** `src/components/curriculum/CurriculumBrowser.tsx:85-96` checks French lesson titles but not `subjectNameFr` or a French book-name field. The bookshelf display elsewhere in the same file uses `subjectNameFr` when French is selected (`265`, `321`), so displayed French labels may not be searchable by the same words.
- **User impact hypothesis:** a learner searching with the visible French subject label may get no result even though the subject exists.
- **Proposed fix:** confirm the type/data model fields, then include available localized subject/book fields in search.
- **Acceptance:** every visible localized subject and book label is searchable in the selected language.
- **Confidence:** medium-high; the exact available French book field still needs type inspection.

### ADF-004 — Global header labels the entire app “Miss Nour”

- **Severity:** P3 — brand/wayfinding hypothesis
- **Evidence:** `src/components/layout/AppShell.tsx:53-65` renders a persistent header whose title is “Miss Nour” regardless of the active primary tab; the same shell routes to Home, Feed, Library, and Nour at lines 83-86.
- **User impact hypothesis:** the product brand and AI teacher identity may be conflated, particularly on HOME and LIBRARY. This may be intentional; a screenshot and first-time learner walkthrough are needed before changing it.
- **Proposed validation:** test whether a first-time learner can tell the product is Amina and understand that Miss Nour is the teacher inside it.
- **Acceptance:** brand identity and teacher identity are distinguishable without weakening Nour's presence.
- **Confidence:** low-medium; visual impact cannot be determined from source alone.

## Required next evidence

1. Run the app in a real browser and capture HOME, FEED intro + two consecutive cards, LIBRARY bookshelf + search results, and NOUR at a phone viewport.
2. Run the learner task matrix in `LEARNER_TEST_MATRIX.md`; do not read source during the synthetic participant attempt.
3. Confirm whether ADF-001 occurs using a known state with a due-review concept whose lesson is also in the general lesson slice.
4. Verify French and Arabic RTL screenshots; code inspection cannot certify layout direction or readability.
5. Only then create visual concepts and rank production changes.

## Not done

No rendered screenshot, live user task, Humanish participant, real learner/parent study, build, lint, or test run is claimed. This report is not approval to change production UI.
