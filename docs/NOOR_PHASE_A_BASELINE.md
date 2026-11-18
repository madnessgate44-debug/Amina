# Phase A — Pre-implementation baseline record

**Date:** 18 November 2026  
**Branch:** `design/noor-anime-companion-system`  
**Source baseline:** `main` at `883127facf34e256e7490a48622b9d14c695f6a3`  
**Controlling OS:** `ENGINEERING_EXECUTION_OS.md` v2.2  
**Purpose:** Record repository-level inspection without misrepresenting it as the required rendered UI audit.

## 1. Execution status

- `npm run audit:ui`: **NOT RUN** — no active repository shell/browser session is available through the connected GitHub tools.
- Baseline screenshots: **NOT CAPTURED**.
- Runtime font verification: **NOT RUN**.
- Code changes: **NONE**.
- Phase A implementation: **BLOCKED pending baseline execution**.
- Phase B: **NOT STARTED**.

No screenshot, visual observation, test result, or browser behavior is claimed by this record.

## 2. Repository-level screen inventory

[VERIFIED — source inspection] Root `src/components/layout/AppShell.tsx` conditionally renders:

| Surface / state | Source component |
|---|---|
| Initial loading | AppShell loading branch |
| First-run onboarding | `OnboardingFlow` |
| Home | `HomeScreen` |
| Feed | `FeedScreen` |
| Curriculum / Library | `CurriculumBrowser` |
| Noor classroom / companion | `VirtualTeacherClassroom` |
| Missions | `MissionsScreen mode="missions"` |
| Homework | `MissionsScreen mode="homework"` |
| Collections / saved items | `CollectionsScreen` |
| My Books | `MyBooksScreen` |
| Review | `ReviewScreen` |
| Progress | `ProgressScreen` |
| Timetable | `TimetableScreen` |
| Profile | `ProfileScreen` |
| Settings | `SettingsScreen` |
| Persistent navigation | `BottomNav` |
| Child menu | `ChildTopMenu` |
| Transient feedback | AppShell toast |

This is a source-level route/screen inventory, not proof that every screen was reachable or rendered in a browser. The app shell currently exposes four primary bottom-navigation destinations plus additional state-driven destinations.

## 3. Audit harness inspection

[VERIFIED — source inspection] `package.json` defines:
- `audit:ui` → `node scripts/ui-audit.mjs`
- `dev` → `tsx server.ts`
- `lint` → `tsc --noEmit`
- `build` → `vite build`

[VERIFIED — source inspection] `scripts/ui-audit.mjs` uses Playwright + Chromium and supports six profiles:
- `phone-ar`: 390×844, Arabic RTL
- `desktop-ar`: 1365×900, Arabic RTL
- `phone-fr`: 390×844, French LTR
- `desktop-fr`: 1365×900, French LTR
- `phone-en`: 390×844, English LTR
- `desktop-en`: 1365×900, English LTR

The script captures onboarding steps, Home, Feed, Library, Noor classroom, a reachable lesson-start state, and a full-page Home image, plus DOM/overflow/tap-target/console information. It writes PNGs and a JSON report per profile.

[VERIFIED — source inspection] The audit harness defaults to `http://127.0.0.1:12000`, while `server.ts` defaults to port `3000`. The audit run must therefore explicitly set `AMINA_BASE_URL=http://127.0.0.1:3000` unless the server is deliberately started on another port.

Required six-profile invocation once a browser runtime is available:

```sh
# Terminal 1
npm run dev

# Terminal 2
AMINA_BASE_URL=http://127.0.0.1:3000 AMINA_PROFILES=phone-ar,desktop-ar,phone-fr,desktop-fr,phone-en,desktop-en npm run audit:ui
```

The audit script expects the Playwright module and Chromium executable (default `/usr/bin/chromium`). Their runtime availability has not been verified.

## 4. Font loading inspection

[VERIFIED — source inspection] `index.html` includes a Google Fonts stylesheet request for Cairo, Tajawal and Inter, with preconnects to `fonts.googleapis.com` and `fonts.gstatic.com`. `src/index.css` places Tajawal, Cairo and Inter in the sans font stack.

[UNPROVEN] This does not establish that the browser successfully downloaded the font files, that computed styles use them, or that Arabic/Latin glyphs render with the intended families. Browser network and computed-font inspection remain required.

## 5. Superseded PR #169 — naming convention retained

[VERIFIED] PR #169 was closed without merging. Its branch introduced the `mn-` CSS namespace, including selectors such as `.mn-app-outer`, `.mn-app-frame`, `.mn-topbar`, `.mn-page`, `.mn-bottom-nav`, and `.mn-home-hero`.

The new implementation must retain the `mn-` prefix for new Miss Noor-specific CSS classes. The superseded branch's teal/parchment color values and styling are not to be reused. The old branch has not been deleted.

## 6. Baseline screenshot matrix

| Locale | Phone 390×844 | Desktop 1365×900 |
|---|---|---|
| Arabic RTL | NOT RUN | NOT RUN |
| French LTR | NOT RUN | NOT RUN |
| English LTR | NOT RUN | NOT RUN |

## 7. Blocking condition

The available GitHub connection can inspect and commit repository files but does not provide a shell or browser runtime. No existing Vercel Sandbox session is available for this project. Creating a new sandbox may consume metered compute, so it was not created under the no-new-paid-services constraint.

**Required to unblock:** provide/enable a confirmed no-cost shell + Chromium/Playwright runtime for this repository, or authorize use of a specific existing free runtime. Until the six-profile baseline audit and screenshot review are complete, do not modify application code, font configuration, or character assets.
