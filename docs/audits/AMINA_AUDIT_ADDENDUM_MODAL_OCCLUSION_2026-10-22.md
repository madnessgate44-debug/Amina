# Amina / Miss Nour — audit addendum: Save-sheet hit-testing defect (F-08)

**Date:** 2026-10-22
**Auditor:** OpenHands (authorized repository coding/auditing executor per issue #9)
**Baseline for new findings:** `main` @ `86c1e73cf760069b1dd58fba994f3f3f0f49a00c`
**Companion report:** `docs/audits/AMINA_FORENSIC_AUDIT_2026-10-22.md` (R1/R3)
**Scope:** read-only investigation of the save/revisit loop, reproduced against a real production build. No production change, no merge, no deployment.

> Status labels: **Verified** (reproduced with the recorded output/artifact), **Observed-not-verified**, **Hypothesis**, **Blocked**.
>
> **Correction notice.** An earlier revision of this addendum claimed the Save button was "physically unclickable at all viewports". That was **overstated** — it generalised from `elementFromPoint` at the button's exact centre without testing a real pointer. The centre-hit test is a proxy, not proof, because it ignores the ancestor chain that determines whether a real event reaches the button. Section 2 below records the corrected, directly measured behaviour and section 2.4 explains the error so it is not repeated.

---

## 1. Why this addendum exists

The companion report's F-01 described a logic defect: the Save-to-Collection sheet allowed a save with no collection ticked, so the item was filed nowhere while a "Saved to collection" toast still appeared. A guard for that is proposed on **PR #15** (`fix/save-item-without-collection`).

While verifying PR #15 in a browser, a hit-testing anomaly appeared in the same flow. This addendum records what was actually measured, including where the anomaly does **not** break the flow.

---

## 2. F-08 — the sheet footer is overlapped, and its exact-centre pixel is dead on mobile (P2, layout/interaction)

> **Update 2026-10-22T12:10Z — fixed and verified on PR #15.** The sheet is now rendered through
> `createPortal(..., document.body)`, so it anchors to the viewport instead of the blurred Feed card.
> Re-verified with the hardened probe at both viewports, with a collection ticked so the button is
> enabled: the sheet now spans the full viewport (0–844 / 0–900), the button sits at 636–664 /
> 657–685 (no nav overlap anywhere), the centre hit-test resolves **inside the button**, and a
> **non-forced pointer click is delivered and saves the item** (saved_items 0 → 1) at both viewports.
> Evidence: `docs/audits/evidence/modal-occlusion-pr15-portal/`. This is in addition to the F-01
> guard; both are on PR #15. The overlap is therefore gone rather than merely reduced.

### 2.1 What is verified

The sheet is a `fixed inset-0` overlay that is **not** anchored to the viewport. Measured at the baseline:

| Viewport | Sheet rect (top–bottom) | Button rect (top–bottom) | Bottom nav (top–bottom) | Overlap of button by nav | Hit at button **centre** |
|---|---|---|---|---|---|
| 390x844 mobile | 397–697 | 761–789 | 774–844 | **15 px (54% of the button)** | `NAV` (not the button) |
| 1365x900 desktop | 460–722 | 805–833 | 830–900 | **3 px (11% of the button)** | button's own child `SPAN` |

The button sits **64 px below the sheet's own bottom edge** (`697` vs `761`), in the region occupied by the sticky nav. So the sheet's `fixed inset-0` is not resolving against the viewport, and the nav paints over the bottom of the button.

### 2.2 What actually happens on a real interaction (the part that matters)

A real pointer click was then sent to specific pixels (raw `mouse.click`, no auto-scroll, no actionability retry):

| Viewport | Raw click at button **centre** | Raw click at button **upper third** |
|---|---|---|
| 390x844 mobile | **SWALLOWED** — `saved_items` 0 to 0 | FIRED — `saved_items` 0 to 1 |
| 1365x900 desktop | FIRED — `saved_items` 0 to 1 | FIRED — `saved_items` 0 to 1 |

And a normal Playwright click (which clicks the element's centre with actionability checks) **succeeded on both viewports**: `saved_items 0 to 1`.

The machine-readable form of this table is in `docs/audits/evidence/modal-occlusion/modal-occlusion-report.json`, under `results[].probe` (geometry), `results[].rawCentreClick` and `results[].normalClick` (the side-effect assertions: `savedItemsBefore`, `savedItemsAfter`, `saved`). The probe's exit code is driven **only** by `rawCentreClick.saved`, so it fails on the baseline mobile case and passes elsewhere. The identical measurement for PR #15's build is in `docs/audits/evidence/modal-occlusion-pr15-fix/`, and it is unchanged — confirming the F-01 guard does not alter the layout.

**Conclusion, stated precisely:**

- The defect is **real but narrower than first reported**. On mobile, a pointer landing in the bottom ~half of the button is delivered to the nav and does nothing, silently, with no feedback. On desktop the overlap is only 3 px and did not block any tested click.
- The flow is **not** universally broken, and the earlier "unclickable at all viewports / F-01's guard is not sufficient" characterisation was **wrong** and is withdrawn. A learner who taps the button's upper half, or whose browser scrolls it clear, saves successfully.

### 2.3 Root cause (Verified by direct manipulation)

The sheet is a `fixed inset-0` overlay, but it is mounted **inside a FEED card** that carries `backdrop-blur-xl`:

- `src/components/feed/FeedScreen.tsx:153` and `:162` — the feed card: `rounded-[2rem] bg-white/10 backdrop-blur-xl ...`
- `src/components/collections/SaveLikeButton.tsx:89` — renders `<SaveToCollectionModal ...>` from inside that card.
- `src/components/collections/SaveToCollectionModal.tsx:69` — the overlay: `fixed inset-0 z-50 bg-black/60 backdrop-blur-xs ...`

Per CSS, an element whose `backdrop-filter` is not `none` becomes the **containing block for its `position: fixed` descendants** and forms its own stacking context. The feed card therefore captures the sheet's `fixed inset-0`, which is why the recorded sheet rect (397–697) does not match the button position (761–789), and why the card's `z-50` cannot beat the sibling nav's `z-40`.

Neutralising the ancestor's backdrop filter — what a document-level portal achieves — re-anchored the sheet to the viewport and moved the button from `761–789` to `636–664`, clear of the nav at `774`:

```
BEFORE:                             {"center":[279,775],"hit":"NAV"}
AFTER neutralizing backdrop-filter: {"center":[301,650],"hit":"SPAN"}   # button now at 636-664, no overlap
```

### 2.4 Methodological note: why the first claim was wrong

`document.elementFromPoint(cx, cy)` reports the **topmost element at that pixel**. It is a good occlusion *signal* but it is not proof that a click fails, because it ignores the ancestor chain: a real event is dispatched to the hit target and then **bubbles up through ancestors**, and it only fails if that chain never reaches a handler. Reading "hit is `NAV`, not the button" as "the button is unclickable" skipped that check.

The corrected method, used in section 2.2, is to send a real pointer event at the coordinates and assert a **side effect** (the IndexedDB `saved_items` count). Practical rules for this repo:

- Never conclude "broken" from `elementFromPoint` alone; confirm with a real click and a side-effect assertion.
- Never conclude "works" from `click({force:true})` or an in-page `el.click()` either — both bypass hit-testing and will report a false PASS on a genuinely covered control. Both were used during this investigation; both were misleading here, in opposite directions.
- Note that a normal Playwright click auto-scrolls the element into view first, so it can succeed on a control a real user cannot currently reach.

### 2.5 Impact and smallest safe fix

**Impact:** low-to-moderate. On a 390 px-wide phone the lower half of the confirm button is dead, so a tap there gives no feedback at all and the learner may believe the save failed. It does not lose data and it does not break the flow for every learner.

**Smallest safe fix (for a separate PR, not this audit):** render the sheet at document level so the feed card does not capture it — `createPortal(..., document.body)` for `SaveToCollectionModal`, or hoist it out of the blurred card in `FeedScreen`. Keep the markup and the `z-50` layer; do not change copy or save logic. This is a layout/portal change and belongs in its own PR reviewed as a UI change. A regression test should assert a **side effect** after a real click at the button's centre, not an `elementFromPoint` result.

---

## 3. PR #15 (F-01 guard) — independently re-checked

| Check | Result |
|---|---|
| Guard present: Save disabled with no collection ticked | **Yes** — `disabled: true` |
| `npm run test:integrity` on the PR head | **69 PASSED / 0 FAILED** (baseline 66) |
| Save with a collection ticked, real click | **Works** — `saved_items 0 to 1` |
| `npx vite build` | exit 0 |

PR #15 is a correct, necessary fix for F-01. The F-08 overlap is a separate, smaller issue and does **not** need to block it.

---

## 4. Status of the other reported items at this checkpoint

Re-checked against the live repository and API at 2026-10-22T11:42Z.

| Item | Status | Evidence |
|---|---|---|
| F-01 save-with-no-collection | **Fix proposed** — PR #15, guard verified, integrity 69/69 | PR #15; `npm run test:integrity` |
| F-04 typecheck gate | **Fix proposed** — PR #11 `3f898a72` (open); PR #12 closed as superseded | `npm run lint` on `main` = 11 errors (exit 1), reproduced |
| F-08 sheet overlap | **Open, verified** — see section 2 (narrower than first reported) | probe JSON + screenshots |
| F-02 branding, F-03 French copy | **Open, unchanged** | companion report section 4 |
| F-06 deployment identity | **Blocked** — no reachable deployed URL; `amina.onrender.com/api/health` returns 404; Pages URL 404; Pages API 404 | live probes; `render.yaml` |
| R1 audit report | **Delivered** on `audit/amina-forensic-2026-10-22` | `docs/audits/AMINA_FORENSIC_AUDIT_2026-10-22.md` |
| R3 learner-flow evidence | **Delivered**, 9/10 PASS in the independent rerun; task 5 FAIL is F-01 | companion report section 5 |

**R2 note.** `main`'s `tsconfig.json` does not set `strict: true`. The surviving typecheck PR adds `strict` + `allowUnreachableCode: false` and a gate suite; the competing PR was closed as superseded by the owner-coordinated session, so this is no longer an open decision.

---

## 5. Boundary compliance for this addendum

- No production change, no merge, no deployment.
- No app source, curriculum content, branding, or HOME/FEED/LIBRARY/NOUR structure changed; this adds one audit document and one probe script.
- No dependency added to the app; Playwright/Chromium are used only by the audit tooling and are not in `package.json`.
- Synthetic QA profile only; no real child or student data.
