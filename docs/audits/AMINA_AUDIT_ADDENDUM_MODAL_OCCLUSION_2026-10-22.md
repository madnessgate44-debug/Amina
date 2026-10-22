# Amina / Miss Nour — audit addendum: modal occlusion defeats the Save fix (F-08)

**Date:** 2026-10-22
**Auditor:** OpenHands (authorized repository coding/auditing executor per issue #9)
**Baseline for new findings:** `main` @ `86c1e73cf760069b1dd58fba994f3f3f0f49a00c`
**Companion report:** `docs/audits/AMINA_FORENSIC_AUDIT_2026-10-22.md` (R1/R3)
**Scope:** read-only investigation of the save/revisit loop, reproduced against a real production build. No production change, no merge, no deployment.

> Status labels used below: **Verified** (reproduced with the recorded output/artifact), **Observed-not-verified**, **Hypothesis**, **Blocked**.

---

## 1. Why this addendum exists

The companion report's F-01 described a logic defect: the Save-to-Collection sheet allowed a save with no collection ticked, so the item was filed nowhere while a "Saved to collection" toast still appeared.

That logic defect is now addressed on **PR #15** (`fix/save-item-without-collection`, head `ec4f48ef74`), which disables **Save Item** until at least one collection is selected. Independently re-checked here: the guard is present, `npm run test:integrity` is 69/69, and a save that names a collection is discoverable in it.

This addendum records a **second, independent defect in the same flow** that the PR #15 guard does **not** fix, and that the PR's own test cannot detect, because the test calls the service directly and never clicks the button in a browser.

---

## 2. F-08 — The Save-to-Collection sheet's confirm button is physically unclickable (P1, functional)

**Verified.** In a real headless browser, at both tested viewports, the **Save Item** button's centre hit-tests to an element that is **not** the button. A real pointer/touch click therefore never reaches it.

| Viewport | Button rect (top–bottom) | Sheet rect (top–bottom) | Bottom nav (top–bottom) | `elementFromPoint` at button centre | Occluded |
|---|---|---|---|---|---|
| 390×844 mobile | 761–789 | 397–697 | 774–844 | `NAV` | **Yes** |
| 1365×900 desktop | 805–833 | 460–722 | 830–900 | `SPAN` | **Yes** |

Read the geometry: the sheet claims `top: 397, bottom: 697`, but its button renders at `761–789`. The button is laid out **64px below the sheet's own bottom edge**, in the region occupied by the sticky bottom nav. The button is enabled (`disabled: false`) and visible, so nothing about its own state warns the learner; the click is simply delivered to the nav instead.

**Evidence (reproducible, no pointer events synthesised):**

- `docs/audits/evidence/modal-occlusion/modal-occlusion-report.json` — baseline `main`.
- `docs/audits/evidence/modal-occlusion-pr15-fix/modal-occlusion-report.json` — PR #15 head, with a collection selected so the button is enabled.
- Screenshots: `save-sheet-mobile-390x844.png`, `save-sheet-desktop-1365x900.png` in both directories.
- Harness: `scripts/modal-occlusion-probe.mjs`.

### 2.1 Root cause (Verified by direct manipulation)

The sheet is a `fixed inset-0` overlay, but it is mounted **inside a FEED card** that carries `backdrop-blur-xl`:

- `src/components/feed/FeedScreen.tsx:153` and `:162` — the feed card: `rounded-[2rem] bg-white/10 backdrop-blur-xl …`
- `src/components/collections/SaveLikeButton.tsx:89` — renders `<SaveToCollectionModal …>` from inside that card.
- `src/components/collections/SaveToCollectionModal.tsx:69` — the overlay: `fixed inset-0 z-50 bg-black/60 backdrop-blur-xs …`

Per CSS, an element whose `backdrop-filter` is not `none` becomes the **containing block for its `position: fixed` descendants**. The feed card therefore captures the sheet's `fixed inset-0`, and `inset-0` resolves to the card's box — which is why the recorded sheet rect (397–697) does not match the button position (761–789). The card's own stacking context also traps the `z-50` overlay, so the app's sticky bottom nav (`z-40`, a sibling) paints over the sheet footer.

**Decisive confirmation.** Neutralising the ancestor's backdrop filter — exactly what moving the sheet to a document-level portal would achieve — changed the outcome from failure to success with no other change:

```
BEFORE: {"center":[279,775],"hit":"NAV","isBtn":false}
AFTER neutralizing backdrop-filter: {"hit":"SPAN","isBtn":false}   # sheet re-anchored to the viewport, button moved to 636-664
pointer click with stacking context neutralized: saved_items 0 -> 1
```

The same script showed that dispatching the button's own DOM `.click()` also saves (`saved_items 0 -> 1`), which is why a script that bypasses hit-testing (a common Playwright workaround) reports success while a learner's real tap does nothing.

### 2.2 Why PR #15's guard does not resolve it

| Check | Baseline `main` | PR #15 (`ec4f48ef74`) |
|---|---|---|
| Save enabled with no collection | Yes (defect F-01) | **No — correctly disabled** |
| Save enabled with a collection ticked | Yes | Yes |
| Button centre hit-tests to the button | **No (`NAV`)** | **No (`NAV`)** |
| Real pointer click saves the item | **No** | **No** (only a synthetic DOM click does) |

PR #15 is a correct and necessary fix for F-01. It is **not sufficient** for the learner-facing flow: after ticking a collection, the button is enabled but still covered, so the sheet appears frozen. This is a second, independent finding rather than a re-report of F-01.

### 2.3 Impact

- The learner taps the enabled "Save Item" button and nothing happens; the sheet stays open with no feedback.
- This affects **both** mobile and desktop, and every FEED card, not just the one exercised here.
- It also invalidates any browser evidence that used a DOM-dispatched click to prove the save loop works, because that path is not what a learner does. The companion report's task-5 result must be read with this in mind: its FAIL is real, and a PASS obtained by force-clicking would be a false positive.

### 2.4 Smallest safe fix (for a separate PR, not this audit)

Render the sheet at document level so it is not captured by the feed card. The minimal, behaviour-preserving option is to portal it, e.g. mount `SaveToCollectionModal` (and the other `fixed inset-0` sheets) with `createPortal(..., document.body)`, or hoist it out of the blurred card in `FeedScreen`. Keep the visual markup and the `z-50` layer; do not change copy or the save logic. Add a regression test that **hit-tests** the button rather than dispatching a synthetic click, so the class of bug cannot return silently. This is a layout/portal change, so it belongs in its own PR and should be reviewed as a UI change, not folded into the typecheck or audit work.

---

## 3. Status of the other reported items at this checkpoint

Re-checked against the live repository and API at 2026-10-22T11:36Z.

| Item | Status | Evidence |
|---|---|---|
| F-01 save-with-no-collection | **Fix proposed** — PR #15 `ec4f48ef74`, guard verified, integrity 69/69 | PR #15; `npm run test:integrity` |
| F-04 typecheck gate | **Fix proposed twice** — PR #11 `3abfa2e181` and PR #12 `25388f8188`; both CI-green | `npm run lint` on `main` = 11 errors (exit 1), reproduced; both PRs' runs `success` |
| F-08 sheet occlusion | **Open, verified** — see §2 | occlusion probe JSON + screenshots |
| F-02 branding, F-03 French copy | **Open, unchanged** | companion report §4 |
| F-06 deployment identity | **Still Blocked** — no deployed URL; `amina.onrender.com/api/health` → 404; Pages site → 404; Pages API → 404 | live probes; `render.yaml` |
| R1 audit report | **Delivered** on `audit/amina-forensic-2026-10-22` | `docs/audits/AMINA_FORENSIC_AUDIT_2026-10-22.md` |
| R3 learner-flow evidence | **Delivered**, 9/10 PASS in the independent rerun; task 5 FAIL is F-08 | companion report §5; this addendum §2 |

**R2 note (Observed-not-verified, needs an owner decision).** `main`'s `tsconfig.json` does **not** set `strict: true`. PR #12 adds `"strict": true` and `"allowUnreachableCode": false`; PR #11 fixes the same errors without tightening the config. Both make the gate blocking. "Strict TypeScript gate" is satisfied more literally by the PR that also turns on `strict`, but the two PRs overlap and one should be chosen and the other closed to avoid divergent fixes to the same files.

---

## 4. Boundary compliance for this addendum

- No production change, no merge, no deployment.
- PR #7, #8, #10, #11, #12, #13, #15 all left untouched.
- No app source, curriculum content, branding, or HOME/FEED/LIBRARY/NOUR structure changed by this addendum; it adds one audit document and one probe script.
- No dependency added to the app; Playwright/Chromium are used only by the audit tooling and are not in `package.json`.
- Synthetic QA profile only; no real child or student data.
