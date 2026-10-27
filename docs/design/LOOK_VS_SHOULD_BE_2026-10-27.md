# Miss Noor — "how it looks" vs "how it's supposed to look"

**Date:** 2026-10-27
**Baseline commit:** `a889e3d` (`main`, PR #48 merged)
**Method:** built the real app (`npm run build`), served it (`PORT=12000`), walked it
with `scripts/ui-audit.mjs` at 390×844 Arabic RTL, then probed live computed styles
and contrast in headless Chromium. Synthetic "Learner QA" profile only; no real child data.
**Posture:** the review was read-only. The G1 fix below ships in the same PR as this
document; no other app code changed. Screens/measurements are from the pre-fix build.

Evidence tags: [V] verified by tool output in this session, [I] inference, [U] unknown.

---

## 1. How it looks now — verified

Build and runtime [V]:

- `npm run build` → exit 0. `dist/index.html` 2.87 kB; CSS 142.62 kB; main JS 1.20 MB (320 kB gzip).
- `/api/health` → `{"status":"ok","hasApiKey":false}`. Degraded mode, as designed.
- `scripts/ui-audit.mjs` → **10 screens captured, 0 console errors, 0 horizontal overflow,
  44px smallest tap target, 0 text under 12px on every screen.** The F1–F5 phone-UI fixes
  from PR #44 hold [V].

Screens and what is actually on them [V]:

| Screen | Dominant look | Content |
|---|---|---|
| Onboarding 1 | Rounded card, big emoji teacher, language + name + gender + age | "أهلاً! أنا مس نور 👩‍🏫" |
| HOME | Light card stack on `#f6f7fb`; gradient hero tile; Nour character (small SVG) | greeting, "حصة النهارده مع نور", shelf preview, 17 shadowed cards, 4 gradients |
| FEED | Calm single-card stage, dark accents | one dense reel headline + 4 quiz options + "علّمني أكتر" / "تخطّي" |
| LIBRARY | Long scroll, 9 subject tiles, 11 gradients | "مدرستي — الكتب والمناهج", subject list, two shelf buttons |
| NOUR | Teaching stage: lesson title, 5 numbered steps, mic, lesson picker | "فصل مس نور", "محطة التشخيص الاستكشافي", 3 answer options |

Structural facts measured on the live DOM [V]:

- **Palette is Tailwind default, not the brand tokens.** `src/index.css` declares a full
  brand palette in `@theme` (midnight, indigo-brand, teal-clear, apricot-spark, cloud,
  paper, mist, slate-text). **Zero components use any of those utility classes**
  (`grep` for `bg-midnight`, `text-indigo-brand`, `bg-teal-clear`, … → 0 matches).
  Components use raw Tailwind `slate-*`/`indigo-*` (3,424 occurrences) plus three literal
  `#615bff`/`#26b8a8` gradient pairs. [V]
- **Gradients are heavy:** 49 `bg-gradient`/`bg-linear-to` uses; 11 on LIBRARY, 6 on NOUR,
  4 on HOME [V]. The design direction explicitly warns "avoid making every card a purple
  gradient." [C]
- **No raster imagery in the app.** `img` count is 0 on every screen. Visuals are emoji
  (21 on LIBRARY) plus Lucide icons (7–17 per screen) [V].
- **The custom Nour character exists but is used on only 4 surfaces** (`ReelCard`,
  `NoorSpeechBubble`, `VirtualTeacherClassroom`, `HomeScreen`) [V].
- **Dark mode is half-wired:** 1,838 `dark:` classes, but the whole UI was walked in the
  light theme only; there is no theme toggle exercised in the audit [U].
- **Contrast (WCAG AA, solid backgrounds only):** most body text passes (4.7–17.7:1) [V].
  **One confirmed failure:** the 12px book-reference line
  "اللغة العربية — تواصل ص. 6-11" (light slate `oklch(0.704 0.04 256.788)`) on a near-white
  card (`oklch(0.984 …)`) measures **≈2.5:1**, far below the 4.5:1 floor [V].
  Correction to an earlier draft: the hero subtitle "رفيقكِ ومعلمتكِ الذكية…" measured
  ~1.4:1 against *white*, but its real background is a
  `linear-gradient(to right bottom, …)` tile, so that number is **unmeasured, not a fail** —
  gradient-backed text needs a gradient-aware check I did not run [V]. White text on the
  indigo gradient is likewise unmeasured [V].

---

## 2. How it's supposed to look — the spec on record

From `docs/BRAND_AND_PRODUCT_VISUAL_DIRECTION.md` (on branch
`design/brand-and-visual-direction`, fetched this session) [C]:

- Feel: "premium personal learning companion… polished and fluid… approachable like a
  trusted mentor," **not** "noisy gamification or decoration."
- Palette: indigo used **intentionally**; "avoid making every card a purple gradient";
  "dark mode must be designed, not mechanically inverted."
- Typography: **Tajawal** primary for Arabic, **Cairo** for headings, **Inter** for FR/EN.
- Art direction: "one coherent illustration family; avoid mixing emoji-heavy cards, stock
  photography, 3D characters, and thin icons without a system"; "use real curriculum
  diagrams… before generic imagery"; "playful but not babyish."
- Miss Nour: refine the existing SVG into one coherent mentor character; keep lesson
  content more prominent than the character.
- Navigation: HOME | FEED | LIBRARY | NOUR locked.

Quality bar (10 items) [C], the ones with a measured gap flagged:

| # | Bar item | Status vs this build |
|---|---|---|
| 1 | Main action clear within 3s | [I] HOME and NOUR yes; FEED leads with a dense sentence |
| 2 | Every screen has a clear next step | [I] mostly yes |
| 3 | Cards/buttons/type/spacing/icons/states consistent | [I] partial — gradient-heavy, mixed radii (16/24/32) |
| 4 | Progress claims reflect real data | [V] verified in prior audits (SOURCES.md) |
| 5 | Upper-primary, not childish | [I] emoji-heavy UI leans young |
| 6 | Tap targets/text/safe areas on phones | [V] 44px + ≥12px everywhere — **met** |
| 7 | Arabic RTL + FR/EN natural | [I] RTL verified; FR has known gaps (ADF-007) |
| 8 | Contrast, focus, non-color cues, reduced motion | [V] focus + reduced-motion CSS present; **1 confirmed contrast fail** |
| 9 | Visuals help learning | [I] mostly emoji/icons, no curriculum diagrams rendered |
| 10 | Recognizably Miss Noor without the logo | [V] was failing (G1); **fixed in this PR** |

---

## 3. Where "looks" diverges from "should be"

Ranked by how much they hurt the intended impression.

**G1 — Brand identity leaks the old name on a primary screen (high).**
`CurriculumBrowser.tsx:239` renders the LIBRARY heading
`📚 كتب أمينة الدراسية (الصف الخامس):` — "Amina's school books." The owner's decision is
Miss Noor; the product must not call itself Amina [V]. The `brandingNoor` test does not
catch it because the string is JSX text, not a quoted literal [V]. Quality-bar item 10
fails on this one string.
**Status: FIXED in this PR** — the heading now reads `📚 كتب مس نور الدراسية (الصف الخامس):`,
and `brandingNoor.test.ts` gains check 1.3 which scans JSX text nodes. Verified in the
rendered LIBRARY DOM (0 legacy strings, new heading present) and by a negative run that
restored the old string and saw 1.3 fail (exit 1) [V].

**G2 — The approved brand system is not applied (medium).**
`@theme` defines the whole palette and fonts; no component consumes the utilities [V].
So the "should be" palette (midnight anchor, deliberate indigo, teal positives, apricot
sparing) is not what the user sees — they see Tailwind's default indigo/slate. The design
direction calls this out directly ("use indigo intentionally; avoid making every card a
purple gradient"), and the build has 49 gradients [V].

**G3 — Illustration strategy is unresolved (medium).**
The spec wants "one coherent illustration family" and "real curriculum diagrams before
generic imagery." The build renders **no raster images and no diagrams**; it leans on
emoji (21 on LIBRARY) and Lucide icons, and uses its one custom SVG character on only
four surfaces [V]. This is the biggest visible gap between the "premium mentor" feel and
the current "clean utility" feel.

**G4 — One contrast failure on a 12px line (medium).**
"اللغة العربية — تواصل ص. 6-11" measures ≈2.5:1 on its near-white card, against a 4.5:1 AA
floor [V]. Small text, real child reader, direct readability cost. (Gradient-backed text is
still unmeasured — see §1.)

**G5 — Cairo is loaded but never used (low).**
`index.html` loads Cairo; `--font-display` names it, but no component applies
`font-display`, and Cairo survives only in the boot-splash inline style [V]. Either
intentional or dead weight — worth a decision.

**G6 — Dark mode unverified (low/unknown).**
1,838 `dark:` classes exist, but the audit walked light theme only and there is no
toggle in the four primary screens [U]. The spec says dark mode "must be designed, not
mechanically inverted."

---

## 4. What already matches the spec (so it is not regressed)

- Four locked destinations, correctly labelled Arabic (الرئيسية | الموجز | المكتبة | نور) [V].
- Phone quality bar item 6 fully met: 44px targets, ≥12px text, no overflow, RTL correct [V].
- FEED is a real single-item immersive stage with real curriculum content, not a list
  pretending to be reels [V].
- NOUR shows the teaching loop as visible steps (شرح → تشخيص → إتقان → تمارين → اسألي نور) [V].
- The Miss Nour character asset exists and animates across 9 states [V].

---

## 5. Recommended next actions

1. ~~**Fix G1** — one-string change in `CurriculumBrowser.tsx:239` to "مس نور", and add a
   JSX-text guard to `brandingNoor.test.ts`.~~ **DONE in this PR.**
2. **Decide G2** — either apply the `@theme` tokens (swap `slate/indigo` utilities and the
   literal hex gradients) or delete the unused tokens so the CSS stops claiming a system
   the UI does not use. Do not do both.
3. **Decide G3** — pick one: commission a small illustration set, or formally adopt
   "emoji + Lucide" as the system and stop calling for "one coherent illustration family."
4. **Fix G4** — raise the failing book-reference text color to ≥4.5:1; run a
   gradient-aware contrast check for the hero/indigo tiles.
5. **Decide G5/G6** — keep or drop Cairo; design dark mode or remove the `dark:` classes.

G2–G6 are not done. G1 is fixed on branch `openhands/brand-jsx-text-guard` (PR pending).

---

_Prepared by an AI agent (OpenHands) on behalf of the repository owner._
