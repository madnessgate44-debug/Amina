// Modal hit-testing probe for Amina / Miss Nour.
//
// The "Save to Collection" sheet is rendered as `fixed inset-0` but it is mounted
// inside a Feed card that carries `backdrop-blur-xl`. A non-`none` `backdrop-filter`
// makes that card the containing block for `position: fixed` descendants, so the
// sheet's "fixed inset-0" is clamped to the card instead of the viewport and its
// footer can land under the sticky bottom nav.
//
// This probe reports geometry, but geometry alone is NOT proof that a click fails:
// `elementFromPoint` ignores the ancestor chain that a real event bubbles through.
// So it also sends a real pointer click at the button's centre and asserts a side
// effect (the IndexedDB saved_items count). Only the side-effect result decides
// PASS/FAIL; the hit-test is recorded as a signal. Note that a normal Playwright
// click auto-scrolls first, so `rawCenterClick` (no auto-scroll) is the strictest
// measure of what a learner's finger does at that pixel.
//
// Synthetic QA profile only. No real child or student data.

import { mkdir, writeFile } from 'node:fs/promises';
import { setTimeout as delay } from 'node:timers/promises';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');

const baseURL = process.env.AMINA_BASE_URL || 'http://127.0.0.1:4174';
const outDir = process.env.AMINA_OUT_DIR || 'artifacts/modal-occlusion';
await mkdir(outDir, { recursive: true });

const report = {
  mission: 'Modal occlusion probe — is the Save-to-Collection sheet clickable at its own coordinates?',
  baseURL,
  startedAt: new Date().toISOString(),
  environment: 'Disposable headless Chromium; synthetic QA profile only; no real student data',
  results: [],
  errors: [],
};

const VIEWPORTS = [
  { name: 'mobile-390x844', width: 390, height: 844, isMobile: true, hasTouch: true },
  { name: 'desktop-1365x900', width: 1365, height: 900, isMobile: false, hasTouch: false },
];

async function waitForServer() {
  const deadline = Date.now() + 45_000;
  let lastError = 'not attempted';
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${baseURL}/api/health`);
      if (response.ok) return await response.json();
      lastError = `health status ${response.status}`;
    } catch (error) {
      lastError = String(error);
    }
    await delay(500);
  }
  throw new Error(`Amina server did not become healthy: ${lastError}`);
}

async function onboard(page) {
  await page.goto(baseURL, { waitUntil: 'domcontentloaded' });
  await page.locator('input[type="text"]').first().waitFor({ state: 'visible', timeout: 20_000 });
  await page.locator('input[type="text"]').first().fill('Learner QA');
  await page.getByRole('button', { name: /Français/ }).first().click().catch(() => {});
  await delay(200);
  await page.locator('button').last().click();
  await delay(600);
  const skip = '^(Back|Next Question|Submit|Retour|Question Suivante|Envoyer|رجوع|السؤال التالي|إرسال)$';
  for (let i = 0; i < 5; i += 1) {
    await page.evaluate((skipSrc) => {
      const re = new RegExp(skipSrc);
      const buttons = Array.from(document.querySelectorAll('button')).filter((b) => b.offsetWidth > 0);
      const preset = buttons.find((b) => {
        const text = (b.innerText || '').trim();
        return text && !re.test(text) && !/🇪🇬|🇬🇧|🇫🇷/.test(text);
      });
      if (preset) preset.click();
    }, skip);
    await delay(400);
  }
  await page.locator('button').last().click();
  await delay(600);
  const count = await page.locator('button').count();
  await page.locator('button').nth(count - 2).click();
  await page.locator('nav button').first().waitFor({ state: 'visible', timeout: 20_000 });
  await delay(600);
}

async function reachSaveSheet(page) {
  // Confirm the day so the FEED plan gate opens, then open a FEED card's save sheet.
  const reportDay = page.getByRole('button', { name: /Report My Day/ }).first();
  if (await reportDay.count()) {
    await reportDay.click();
    await delay(800);
    const sample = page.getByRole('button', { name: /We had Arabic/ }).first();
    if (await sample.count()) { await sample.click(); await delay(2000); }
    const confirm = page.getByRole('button', { name: /Yes, that is correct/ }).first();
    if (await confirm.count()) { await confirm.click(); await delay(1500); }
  }
  await page.locator('nav button').nth(1).click();
  await delay(900);
  const save = page.getByRole('button', { name: /Save to Collection/ }).first();
  if (!(await save.count())) return false;
  await save.click({ force: true });
  await delay(900);
  if (!/Save to Collections/i.test(await page.evaluate(() => document.body.innerText || ''))) return false;
  // Optionally tick a collection so the probe also measures the enabled button
  // (relevant once a guard disables Save while nothing is selected).
  if (process.env.PROBE_SELECT_COLLECTION === '1') {
    const chip = page.locator('div.grid button').first();
    if (await chip.count()) { await chip.click({ force: true }); await delay(400); }
  }
  return true;
}

async function savedItemCount(page) {
  return page.evaluate(async () => {
    try {
      const db = await new Promise((resolve) => {
        const req = indexedDB.open('ai_school_companion_v2');
        req.onsuccess = () => resolve(req.result);
      });
      return await new Promise((ok) => {
        const rq = db.transaction('saved_items', 'readonly').objectStore('saved_items').count();
        rq.onsuccess = () => ok(rq.result);
      });
    } catch {
      return -1;
    }
  });
}

async function probe(page) {
  return page.evaluate(() => {
    const button = Array.from(document.querySelectorAll('button'))
      .find((b) => (b.innerText || '').trim() === 'Save Item');
    if (!button) return { found: false };
    const rect = button.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const hit = document.elementFromPoint(cx, cy);
    const sheet = button.closest('div.fixed');
    const nav = document.querySelector('nav');
    const box = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { top: Math.round(r.top), bottom: Math.round(r.bottom), height: Math.round(r.height) };
    };
    return {
      found: true,
      disabled: button.disabled,
      button: box(button),
      sheet: box(sheet),
      nav: box(nav),
      viewportHeight: window.innerHeight,
      hitTag: hit ? hit.tagName : null,
      hitIsButton: hit === button,
      // A non-button hit is only a *signal*: it does not by itself mean the click
      // fails, because the event still bubbles through the button's ancestors.
      centreHitIsButton: hit === button,
      centreHitIsDescendant: Boolean(hit && button.contains(hit)),
    };
  });
}

let browser;
let exitCode = 0;
try {
  const health = await waitForServer();
  report.health = health;
  // Allow a system Chromium so the probe runs without downloading Playwright browsers.
  browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox'],
    ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}),
  });

  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      isMobile: vp.isMobile,
      hasTouch: vp.hasTouch,
    });
    const page = await ctx.newPage();
    // Pin a post-school clock: the app derives "after school" from the wall clock and
    // exposes no in-app control to force it, so this keeps the flow reproducible.
    await page.clock.setFixedTime(new Date('2026-10-22T15:30:00'));
    const entry = { viewport: vp.name, sheetOpened: false, probe: null, error: null };
    try {
      await onboard(page);
      entry.sheetOpened = await reachSaveSheet(page);
      if (entry.sheetOpened) {
        entry.probe = await probe(page);
        await page.screenshot({ path: `${outDir}/save-sheet-${vp.name}.png`, animations: 'disabled' });

        // Select a collection so the confirm button is enabled and a click is meaningful.
        const chip = page.locator('div.grid button').first();
        if (await chip.count()) { await chip.click({ force: true }); await delay(400); }
        entry.afterSelectingCollection = await probe(page);

        // Decisive test: a raw pointer click at the button centre, then a side effect.
        const rect = await page.evaluate(() => {
          const b = Array.from(document.querySelectorAll('button'))
            .find((x) => (x.innerText || '').trim() === 'Save Item');
          const r = b.getBoundingClientRect();
          return { cx: r.left + r.width / 2, cy: r.top + r.height / 2, top: r.top, height: r.height };
        });
        const before = await savedItemCount(page);
        await page.mouse.click(rect.cx, rect.cy);   // no auto-scroll, no actionability retry
        await delay(1200);
        const after = await savedItemCount(page);
        entry.rawCentreClick = { savedItemsBefore: before, savedItemsAfter: after, saved: after > before };

        // Comparison: a normal Playwright click, which auto-scrolls first.
        const beforeNormal = after;
        await page.getByRole('button', { name: /Save Item/ }).first().click({ timeout: 6000 }).catch(() => {});
        await delay(1200);
        const afterNormal = await savedItemCount(page);
        entry.normalClick = { savedItemsBefore: beforeNormal, savedItemsAfter: afterNormal, saved: afterNormal > beforeNormal };

        // PASS/FAIL is decided by the strictest real interaction, not by geometry.
        if (!entry.rawCentreClick.saved) exitCode = 1;
      }
    } catch (error) {
      entry.error = String(error);
      report.errors.push(`${vp.name}: ${entry.error}`);
      exitCode = 1;
    }
    report.results.push(entry);
    await ctx.close();
  }
} catch (error) {
  report.errors.push(String(error));
  exitCode = 1;
} finally {
  if (browser) await browser.close();
  report.finishedAt = new Date().toISOString();
  await writeFile(`${outDir}/modal-occlusion-report.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
}

process.exit(exitCode);
