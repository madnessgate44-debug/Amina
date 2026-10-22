# Amina rendered audit — first evidence pass

**Evidence run:** [GitHub Actions run 39738852961](https://github.com/madnessgate44-debug/Amina/actions/runs/39738852961)  
**Artifact:** `amina-design-lab-browser-evidence` (12 screenshots, `report.json`, Forera loop trace)  
**Build/test result:** passed in that run  
**Viewports:** 390×844 phone; 1365×900 desktop  
**Synthetic profile:** fictional `Learner QA` only  
**Scope:** rendered UI and browser interaction; not real-child research

## Verified checks

- App health endpoint and app route returned successfully.
- 12 screen captures were produced across onboarding, HOME, FEED, LIBRARY, NOUR, desktop, and Arabic RTL.
- No horizontal overflow was measured at the captured viewports.
- No uncaught page errors or browser console errors were recorded.
- Arabic mode set document direction to RTL.
- Four primary navigation destinations rendered.

These checks do not prove every control works or the design is good. The first run is a baseline.

## Findings from the rendered evidence

### ADF-005 — Product identity and teacher identity are conflated

- **Severity:** P2
- **Evidence:** the persistent app header says “Miss Nour” on HOME, FEED, LIBRARY, and NOUR. See `04-home-mobile.png`, `04-feed-mobile.png`, and `04-library-mobile.png` in the run artifact.
- **Impact:** the product and the AI teacher are difficult to distinguish as separate brand entities.
- **Change made on this branch:** header title is now “Amina”; subtitle retains “Miss Nour” and the learner name.
- **Acceptance:** rendered header clearly presents Amina as product and Miss Nour as teacher, without clipping at phone width.
- **Status:** implemented, awaiting the current branch's CI rerun.

### ADF-006 — Feed viewport height competes with the persistent navigation

- **Severity:** P1 — interaction / layout
- **Evidence:** `04-feed-mobile.png` shows the Feed panel extending to the bottom-navigation boundary. The original root used `h-[calc(100vh-64px)]` even though the shell also reserves space for the header and bottom navigation. The initial wheel capture moved the intro content only slightly and did not reach the next card.
- **Impact:** vertical snap progression is harder to discover and the feed's scroll viewport does not match the available shell height.
- **Change made on this branch:** the Feed root now uses `flex-1 min-h-0` so it occupies the actual main-content space.
- **Acceptance:** on 390×844, scrolling advances to the next snap section while the bottom navigation remains fixed and does not cover the feed.
- **Status:** implemented, awaiting the current branch's CI rerun.

### ADF-007 — French app-language selection produces a mixed-language experience

- **Severity:** P1 — localization / trust
- **Evidence:** the French onboarding selection led to HOME and FEED screens with English headings and instructions, while the bottom navigation was French. LIBRARY combined French subject titles with English metadata and an Arabic heading; NOUR combined French UI copy, Arabic curriculum content, and English controls.
- **Impact:** the app appears partially translated rather than intentionally bilingual. This is especially confusing when the setting is explicitly labeled “Preferred App Language.”
- **Changes made on this branch:** French copy and subject labels added to the Feed; curriculum search now matches French and English subject names; the search placeholder, subject filters, curriculum actions, and French textbook titles are localized where translations exist; key HOME headings and textbook actions have French copy.
- **Known remaining gap:** the whole application does not yet have a complete French translation dictionary. Mission content and several secondary controls may still fall back to English. Do not claim full French localization.
- **Acceptance:** primary screen labels and actions use French consistently when French is selected; French curriculum content remains French; any fallback is intentional and documented.
- **Status:** partial fix implemented; current browser rerun must validate it and identify remaining gaps.

### ADF-008 — Library search was not aligned with its visible localized labels

- **Severity:** P2 — discoverability
- **Evidence:** the initial search filter did not include `subjectNameFr` or `subjectNameEn`, despite displaying French subject labels on the bookshelf.
- **Impact:** a learner could search for a visible French subject name and miss lessons that exist.
- **Change made on this branch:** search now includes Arabic, English, and French subject names, plus both available Arabic and English book names.
- **Acceptance:** searching “Mathématiques” returns the French-track mathematics lessons.
- **Status:** implemented; current browser rerun contains an explicit check.

### ADF-009 — First Forera synthetic learner pass stopped during onboarding

- **Severity:** test-runner limitation, not a product defect by itself
- **Evidence:** the trace opened the app, selected a language, entered the fictional name, and reached interview questions, but later actions used stale element indexes and attempted to click a disabled Submit button. The loop reached its 12-step limit without completing a verified walkthrough.
- **Change made on this branch:** the follow-up prompt explicitly requires fresh element indexes after each interaction, avoids disabled Submit, and raises the limit to 24 steps.
- **Acceptance:** trace shows a completed browser walkthrough of HOME, FEED, LIBRARY search, NOUR, and return to HOME—or a clearly evidenced, reproducible blocker.
- **Status:** rerun queued; the earlier BLOCKED result is retained and not relabeled as a pass.

## Visual direction implications

1. Preserve the four-destination navigation; the captured screens confirm it is present and fits the phone width.
2. Keep the calm dark Feed stage, but fix its viewport and snap progression before polishing animation or card styling.
3. Establish one product brand (Amina) and one teacher identity (Miss Nour) with a stable relationship across screens.
4. Treat French as a real UI language, not a few translated labels over English copy. Finish primary flows before secondary labels.
5. Reduce language mixing in Library metadata and make book/subject search follow the labels the learner sees.
6. Do not infer learner preference from this synthetic run. A real student/parent check is still needed for tone, comprehension, and perceived trust.

## Evidence limits

The Forera run is a model-driven synthetic participant, not a real child. It failed to finish the intended task sequence, so it provides useful friction evidence but no completion-rate or usability-success claim. The Playwright screenshots and measurements are valid rendered-browser evidence for the exact build in run 39738852961. Changes listed as implemented above have not been visually re-verified in that older run.
