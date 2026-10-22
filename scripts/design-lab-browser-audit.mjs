import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { setTimeout as delay } from 'node:timers/promises';
import { chromium } from 'playwright';

const baseURL = process.env.AMINA_BASE_URL || 'http://127.0.0.1:4173';
const keepServer = process.env.AMINA_KEEP_SERVER === 'true';
const outDir = 'artifacts/design-audit';
await mkdir(outDir, { recursive: true });

const report = {
  mission: 'Amina rendered mobile UX reconnaissance',
  baseURL,
  viewport: { width: 390, height: 844 },
  startedAt: new Date().toISOString(),
  environment: 'GitHub Actions disposable browser; synthetic QA profile only',
  checks: [],
  screens: [],
  errors: [],
};

let server;
let browser;
let exitCode = 0;

function check(name, passed, detail) {
  report.checks.push({ name, passed: Boolean(passed), detail });
  if (!passed) exitCode = 1;
}

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

async function capture(page, name, tab = 'onboarding') {
  const screenshot = `${outDir}/${name}.png`;
  console.log(`Capturing ${name}`);
  await page.screenshot({ path: screenshot, animations: 'disabled', timeout: 10_000 });
  const state = await page.evaluate(() => ({
    viewportWidth: window.innerWidth,
    documentWidth: document.documentElement.scrollWidth,
    viewportHeight: window.innerHeight,
    documentHeight: document.documentElement.scrollHeight,
    direction: getComputedStyle(document.documentElement).direction,
    language: document.documentElement.lang || null,
    bodyText: (document.body.innerText || '').slice(0, 3500),
    visibleButtons: Array.from(document.querySelectorAll('button'))
      .filter((el) => el.getBoundingClientRect().width > 0 && el.getBoundingClientRect().height > 0)
      .map((el) => (el.innerText || el.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 100))
      .slice(0, 45),
  }));
  const entry = { name, tab, screenshot, ...state };
  report.screens.push(entry);
  check(`${name}: no horizontal overflow`, state.documentWidth <= state.viewportWidth,
    `viewport=${state.viewportWidth}px document=${state.documentWidth}px`);
  return entry;
}

try {
  // Spawn tsx directly (not through npm's shell wrapper) so cleanup cannot orphan the server child.
  server = spawn('./node_modules/.bin/tsx', ['server.ts'], {
    env: { ...process.env, PORT: '4173', NODE_ENV: 'production' },
    stdio: 'ignore',
    detached: true,
  });
  server.unref();
  if (keepServer && server.pid) await writeFile('/tmp/amina-server.pid', String(server.pid));
  const health = await waitForServer();
  check('local app health endpoint responds', health.status === 'ok',
    `status=${health.status}; API key presence intentionally not recorded`);

  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  page.on('pageerror', (error) => report.errors.push({ type: 'pageerror', message: error.message }));
  page.on('console', (message) => {
    if (message.type() === 'error') {
      report.errors.push({ type: 'console', message: message.text().slice(0, 500) });
    }
  });
  const response = await page.goto(baseURL, { waitUntil: 'domcontentloaded', timeout: 30_000 });
  check('app route returns HTTP 200', response?.status() === 200, `status=${response?.status()}`);
  await page.locator('input[type="text"]').first().waitFor({ state: 'visible', timeout: 15_000 });
  await capture(page, '01-onboarding-initial');

  // Use synthetic, non-personal test data. French is the primary target language for this run.
  await page.locator('input[type="text"]').first().fill('Learner QA');
  const frenchButton = page.getByRole('button', { name: /Français/ }).first();
  await frenchButton.click();
  await page.locator('button').last().click();
  await delay(300);
  await capture(page, '02-onboarding-interview-q1');

  // Progress through the conversational interview without using source-code hints.
  for (let i = 0; i < 4; i += 1) {
    await page.locator('button').last().click();
    await delay(180);
  }
  // The fifth interview screen has a separate finish action; click it to reach profile confirmation.
  await page.locator('button').last().click();
  await delay(250);
  await capture(page, '03-onboarding-profile-confirmation');
  const buttonCount = await page.locator('button').count();
  if (buttonCount < 2) throw new Error('Profile confirmation screen did not expose expected actions.');
  await page.locator('button').nth(buttonCount - 2).click();
  await page.locator('nav button').first().waitFor({ state: 'visible', timeout: 15_000 });
  await delay(600);

  const nav = page.locator('nav button');
  check('four primary destinations are rendered', await nav.count() === 4,
    `count=${await nav.count()}`);

  const tabNames = ['home', 'feed', 'library', 'nour'];
  for (let i = 0; i < tabNames.length; i += 1) {
    await nav.nth(i).click();
    await delay(450);
    await capture(page, `04-${tabNames[i]}-mobile`, tabNames[i]);
    if (tabNames[i] === 'feed') {
      // Capture a second position in the vertical feed if content is scrollable.
      await page.mouse.wheel(0, 650);
      await delay(250);
      await capture(page, '05-feed-after-scroll-mobile', 'feed');
      await page.mouse.wheel(0, -900);
    }
  }

  await page.setViewportSize({ width: 1365, height: 900 });
  await delay(250);
  await nav.nth(0).click();
  await capture(page, '06-home-desktop', 'home');
  await nav.nth(1).click();
  await capture(page, '07-feed-desktop', 'feed');

  check('no uncaught page errors', report.errors.filter((e) => e.type === 'pageerror').length === 0,
    JSON.stringify(report.errors.filter((e) => e.type === 'pageerror')));
  check('no browser console errors', report.errors.filter((e) => e.type === 'console').length === 0,
    JSON.stringify(report.errors.filter((e) => e.type === 'console')));

  await context.close();

  // A fresh context checks Arabic RTL without carrying over the French synthetic profile.
  const rtlContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
  });
  const rtlPage = await rtlContext.newPage();
  rtlPage.on('pageerror', (error) => report.errors.push({ type: 'rtl-pageerror', message: error.message }));
  await rtlPage.goto(baseURL, { waitUntil: 'domcontentloaded', timeout: 30_000 });
  await rtlPage.locator('input[type="text"]').first().waitFor({ state: 'visible', timeout: 15_000 });
  await rtlPage.locator('input[type="text"]').first().fill('اختبار');
  await rtlPage.getByRole('button', { name: /العربية/ }).first().click();
  await rtlPage.locator('button').last().click();
  for (let i = 0; i < 4; i += 1) {
    await rtlPage.locator('button').last().click();
    await delay(120);
  }
  // Finish the fifth question before selecting profile confirmation.
  await rtlPage.locator('button').last().click();
  await delay(200);
  const rtlButtonCount = await rtlPage.locator('button').count();
  await rtlPage.locator('button').nth(rtlButtonCount - 2).click();
  await rtlPage.locator('nav button').first().waitFor({ state: 'visible', timeout: 15_000 });
  await delay(500);
  await rtlPage.locator('nav button').first().click();
  const rtlShot = await capture(rtlPage, '08-home-arabic-rtl-mobile', 'home-ar');
  check('Arabic page exposes RTL direction', rtlShot.direction === 'rtl',
    `document direction=${rtlShot.direction}`);
  await rtlPage.locator('nav button').nth(1).click();
  await delay(300);
  await capture(rtlPage, '09-feed-arabic-rtl-mobile', 'feed-ar');
  await rtlContext.close();

  check('at least eight screen states captured', report.screens.length >= 8,
    `screens=${report.screens.length}`);
} catch (error) {
  exitCode = 1;
  report.fatalError = error instanceof Error ? error.stack || error.message : String(error);
  report.serverOutputTail = 'Server output is captured by the workflow step when applicable.';
} finally {
  if (browser) await browser.close().catch(() => {});
  if (server?.pid && !keepServer) {
    try { process.kill(-server.pid, 'SIGTERM'); } catch { /* already stopped */ }
  }
  report.finishedAt = new Date().toISOString();
  report.exitCode = exitCode;
  await writeFile(`${outDir}/report.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify({
    exitCode,
    checks: report.checks,
    screens: report.screens.map(({ name, screenshot, viewportWidth, documentWidth, direction }) =>
      ({ name, screenshot, viewportWidth, documentWidth, direction })),
    errors: report.errors,
    fatalError: report.fatalError,
  }, null, 2));
}
process.exitCode = exitCode;
