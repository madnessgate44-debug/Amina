/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phone-viewport UI audit for Miss Noor — step 1 of the miss-noor-design skill.
 *
 * Walks the real built app at 390x844 (iPhone 12/13/14 logical size), captures a
 * screenshot of every reachable screen, and records what is actually on each one:
 * heading text, primary button labels, how much of the viewport is used, and any
 * console error. The output is a JSON report plus PNGs, so a human can look at
 * the app the way a 10-year-old's phone shows it rather than at desktop width.
 *
 * Synthetic QA profile only. No real child or student data.
 *
 * Usage:  node scripts/ui-audit.mjs [baseUrl]
 * Env:    AMINA_BASE_URL, AMINA_OUT_DIR, PLAYWRIGHT_MODULE
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { setTimeout as delay } from 'node:timers/promises';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');

const baseURL = process.argv[2] || process.env.AMINA_BASE_URL || 'http://127.0.0.1:12000';
const outDir = process.env.AMINA_OUT_DIR || 'artifacts/ui-audit';
await mkdir(outDir, { recursive: true });

const PHONE = { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 3 };

const report = {
  mission: 'Phone-viewport UI audit (miss-noor-design skill, step 1)',
  baseURL,
  startedAt: new Date().toISOString(),
  viewport: PHONE,
  environment: 'Disposable headless Chromium; synthetic QA profile only; no real student data',
  screens: [],
  consoleErrors: [],
  notes: [],
};

async function waitForServer() {
  const deadline = Date.now() + 60_000;
  let last = 'not attempted';
  while (Date.now() < deadline) {
    try {
      const r = await fetch(`${baseURL}/api/health`);
      if (r.ok) return await r.json();
      last = `health ${r.status}`;
    } catch (e) {
      last = String(e);
    }
    await delay(500);
  }
  throw new Error(`server not healthy: ${last}`);
}

/** Everything a reviewer needs to judge a screen, read from the live DOM. */
async function describe(page) {
  return page.evaluate(() => {
    const visible = (el) => {
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none';
    };
    const text = (el) => (el.innerText || '').replace(/\s+/g, ' ').trim();

    const headings = Array.from(document.querySelectorAll('h1,h2,h3'))
      .filter(visible)
      .map(text)
      .filter(Boolean);

    const buttons = Array.from(document.querySelectorAll('button'))
      .filter(visible)
      .map(text)
      .filter(Boolean);

    const nav = document.querySelector('nav');
    const navButtons = nav
      ? Array.from(nav.querySelectorAll('button')).filter(visible).map(text).filter(Boolean)
      : [];

    // How much horizontal room is wasted, and does anything overflow the phone?
    const body = document.body;
    const overflowX = document.documentElement.scrollWidth - window.innerWidth;

    // Smallest and largest visible tap target: 44px is the accessibility floor.
    const rects = Array.from(document.querySelectorAll('button,a[role="button"]'))
      .filter(visible)
      .map((el) => el.getBoundingClientRect())
      .filter((r) => r.height > 0);
    const smallestTap = rects.length
      ? Math.round(Math.min(...rects.map((r) => Math.min(r.width, r.height))))
      : null;

    // Any text rendered so small or so light it will be hard for a child.
    const tinyText = Array.from(document.querySelectorAll('p,span,div,li'))
      .filter((el) => visible(el) && el.children.length === 0 && text(el).length > 3)
      .filter((el) => parseFloat(getComputedStyle(el).fontSize) < 12)
      .map(text)
      .slice(0, 8);

    return {
      title: document.title,
      dir: document.documentElement.dir || 'ltr',
      lang: document.documentElement.lang || '',
      headings,
      buttons,
      navButtons,
      overflowXPx: overflowX,
      smallestTapPx: smallestTap,
      tinyText,
      bodyTextLength: body.innerText.replace(/\s+/g, ' ').trim().length,
    };
  });
}

async function shot(page, name, { full = false } = {}) {
  const file = `${outDir}/${name}.png`;
  await page.screenshot({ path: file, fullPage: full });
  return file;
}

async function capture(page, name, extra = {}) {
  const info = await describe(page);
  const file = await shot(page, name);
  const entry = { name, screenshot: file, ...info, ...extra };
  report.screens.push(entry);
  console.log(`  captured ${name} — ${info.headings[0] || '(no heading)'}`);
  return entry;
}

/** Step 1 needs name + address form + age before Next enables. */
async function completeStepOne(page) {
  await page.locator('input[type="text"]').first().waitFor({ state: 'visible', timeout: 20_000 });
  await page.locator('input[type="text"]').first().fill('Learner QA');
  await page.getByRole('button', { name: /العربية/ }).first().click().catch(() => {});
  await page.getByRole('button', { name: /بنت|ولد/ }).first().click().catch(() => {});
  await page.getByRole('button', { name: /^10$/ }).first().click().catch(() => {});
  await delay(300);
}

/** Clicks the button whose visible label matches, if it exists. */
async function tapButton(page, pattern) {
  const btn = page.getByRole('button', { name: pattern }).first();
  if (await btn.count()) {
    await btn.click({ timeout: 8_000 }).catch(() => {});
    return true;
  }
  return false;
}

/**
 * Walks onboarding end to end with a synthetic learner.
 * S1 details -> S2 books -> S3 three warm-up questions -> S4 preferences -> HOME.
 */
async function onboard(page, { captureSteps = [] } = {}) {
  await page.goto(baseURL, { waitUntil: 'domcontentloaded' });
  await completeStepOne(page);
  if (captureSteps.includes(1)) await capture(page, '01-onboarding-step1');

  await tapButton(page, /التالي|Continue|Suivant/);
  await delay(900);
  if (captureSteps.includes(2)) await capture(page, '02-onboarding-step2-books');

  await tapButton(page, /كمّل|Continue|Suivant/);
  await delay(900);
  if (captureSteps.includes(3)) await capture(page, '03-onboarding-step3-quiz');

  // S3: three warm-up questions. Pick the first option, then advance.
  for (let q = 0; q < 4; q += 1) {
    const advanced = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button')).filter(
        (b) => b.offsetWidth > 0 && !b.disabled && b.closest('nav') === null
      );
      const skip = /^(رجوع|Back|Retour|اضغط لتسمع)$/;
      const option = btns.find((b) => !skip.test((b.innerText || '').trim()) && (b.innerText || '').trim());
      if (!option) return false;
      option.click();
      return true;
    });
    if (!advanced) break;
    await delay(500);
    // After answering, the advance button appears.
    await tapButton(page, /السؤال التالي|كمّل|Continue|Suivant/);
    await delay(600);
  }

  await delay(400);
  if (captureSteps.includes(4)) await capture(page, '04-onboarding-step4-preferences');

  // S4: pick a subject and a session length, then finish.
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button')).filter(
      (b) => b.offsetWidth > 0 && !b.disabled
    );
    const subject = btns.find((b) => (b.innerText || '').trim().length > 1 && !/رجوع|Back|Retour/.test(b.innerText));
    if (subject) subject.click();
  });
  await delay(300);
  // A session length keeps the preference step honest, then finish.
  await tapButton(page, /دقايق|دقيقة|min/);
  await delay(300);
  await tapButton(page, /يلا نبدأ|ابدأ|Start|Commencer|Finish|حفظ/);
  await delay(2500);

  const nav = page.locator('nav button').first();
  await nav.waitFor({ state: 'visible', timeout: 25_000 });
  await delay(800);
}

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium' });
const context = await browser.newContext({
  viewport: { width: PHONE.width, height: PHONE.height },
  isMobile: PHONE.isMobile,
  hasTouch: PHONE.hasTouch,
  deviceScaleFactor: PHONE.deviceScaleFactor,
  locale: 'ar-EG',
});
const page = await context.newPage();
page.on('console', (m) => {
  if (m.type() === 'error') report.consoleErrors.push(m.text().slice(0, 300));
});
page.on('pageerror', (e) => report.consoleErrors.push(`pageerror: ${String(e).slice(0, 300)}`));

try {
  report.health = await waitForServer();
  console.log(`Server healthy: ${JSON.stringify(report.health)}`);

  // 1-4. Onboarding, every step.
  await onboard(page, { captureSteps: [1, 2, 3, 4] });

  // 5. HOME.
  await capture(page, '05-home');

  // 6-8. The other three nav destinations.
  const nav = page.locator('nav button');
  const navCount = await nav.count();
  const names = ['06-feed', '07-library', '08-nour'];
  for (let i = 1; i < Math.min(navCount, 4); i += 1) {
    await nav.nth(i).click();
    await delay(1400);
    await capture(page, names[i - 1] || `nav-${i}`);
  }

  // 9. A lesson / stage screen, if one is reachable from the current screen.
  const startLesson = page.getByRole('button', { name: /ابدأ|Start|Study|تعلّم|تعلم|درس/ }).first();
  if (await startLesson.count()) {
    await startLesson.click().catch(() => {});
    await delay(1800);
    await capture(page, '09-lesson-start');
  } else {
    report.notes.push('No lesson-start button found on the reachable screens.');
  }

  // 8. Full-page capture of HOME, to see how far the scroll goes.
  await page.locator('nav button').first().click().catch(() => {});
  await delay(1000);
  const home = await describe(page);
  const fullFile = await shot(page, '10-home-fullpage', { full: true });
  report.screens.push({ name: '10-home-fullpage', screenshot: fullFile, ...home, fullPage: true });
  console.log('  captured 10-home-fullpage');
} catch (error) {
  report.fatal = String(error);
  console.error('audit error:', error);
} finally {
  await writeFile(`${outDir}/report.json`, JSON.stringify(report, null, 2));
  await browser.close();
}

console.log(`\nScreens captured: ${report.screens.length}`);
console.log(`Console errors: ${report.consoleErrors.length}`);
console.log(`Report: ${outDir}/report.json`);
