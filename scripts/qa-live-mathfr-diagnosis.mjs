/**
 * Live proof: an Arabic child on the LIVE app who taps the wrong option of a
 * French-maths comparison reel ("<" or "=") gets a NAMED Arabic diagnosis from
 * the deterministic path (zero model quota) instead of falling through.
 *
 * Seeds a synthetic QA profile into IndexedDB (no real child data), opens the
 * FEED, walks to the reel whose options are the comparison symbols, taps "<",
 * and records Noor's reaction and the diagnosis badge.
 */
import { mkdir, writeFile } from 'node:fs/promises';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || '/tmp/pwtool/node_modules/playwright-core/index.mjs');

const baseURL = process.env.AMINA_BASE_URL || 'https://amina-nine-sepia.vercel.app';
const outDir = process.env.AMINA_OUT_DIR || 'artifacts/live-mathfr';
await mkdir(outDir, { recursive: true });

const report = {
  mission: 'Live proof — Arabic diagnosis for the French-maths comparison reel',
  baseURL,
  startedAt: new Date().toISOString(),
  viewport: '390x844',
  steps: [],
  consoleErrors: [],
  result: null,
};

const student = {
  id: 'qa-seed-1',
  name: 'سارة',
  age: 10,
  grade: 'الصف الخامس',
  country: 'EG',
  curriculum: 'national',
  academicYear: '2026/2027',
  preferredLanguage: 'ar',
  subjects: ['الرياضيات (بالفرنسية)', 'العلوم'],
  interviewAnswers: {},
  addressForm: 'f',
  onboarding: { sessionLengthMinutes: 10, likedSubjects: [], learningStyles: [] },
  isOnboarded: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const settings = {
  language: 'ar',
  demoTimeSimulatorActive: true,
  simulatedTimeOfDay: 'after_school',
  simulatedTime: '14:30',
  companionVoiceEnabled: false,
  micPermissionStatus: 'denied',
  showEvidenceLog: false,
  simulatedDaysOffset: 0,
  demoDefaultMigratedV1: true,
};

const browser = await chromium.launch({
  executablePath: '/usr/bin/chromium',
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
  deviceScaleFactor: 3,
  locale: 'ar-EG',
});
const page = await context.newPage();
page.on('console', (m) => { if (m.type() === 'error') report.consoleErrors.push(m.text()); });
page.on('pageerror', (e) => report.consoleErrors.push('pageerror: ' + String(e)));

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

try {
  await page.goto(baseURL, { waitUntil: 'domcontentloaded' });
  await delay(1500);

  // Seed the synthetic QA profile directly into IndexedDB, then reload so the
  // app reads it on boot (the onboarding gate is AppShell).
  await page.evaluate(async ({ student, settings }) => {
    const DB_NAME = 'ai_school_companion_v2';
    const req = indexedDB.open(DB_NAME, 10);
    await new Promise((resolve, reject) => {
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains('student')) db.createObjectStore('student', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('settings')) db.createObjectStore('settings', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('day_records')) {
          const s = db.createObjectStore('day_records', { keyPath: 'id' });
          s.createIndex('date', 'date', { unique: false });
        }
      };
    });
    const db = req.result;
    const d = new Date();
    const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const dayRecord = {
      id: `day-${today}-${student.id}`,
      studentId: student.id,
      date: today,
      lessonsCovered: [{ subject: 'الرياضيات (بالفرنسية)', topic: 'مقارنة الأعداد العشرية' }],
      homeworkAssigned: [],
      confirmed: true,
      confirmedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      origin: 'student_confirmed',
    };
    const tx = db.transaction(['student', 'settings', 'day_records'], 'readwrite');
    tx.objectStore('student').put(student);
    tx.objectStore('settings').put({ id: 'app_settings', settings });
    tx.objectStore('day_records').put(dayRecord);
    await new Promise((res) => { tx.oncomplete = res; tx.onerror = res; });
    db.close();
  }, { student, settings });

  await page.reload({ waitUntil: 'domcontentloaded' });
  await delay(2500);

  // Open the FEED tab (HOME | FEED | LIBRARY | NOOR).
  const nav = page.locator('nav button');
  await nav.nth(1).waitFor({ state: 'visible', timeout: 20000 });
  await nav.nth(1).click();
  await delay(2000);
  report.steps.push('opened FEED tab');

  // Walk the reel session to the comparison reel: options are exactly >, <, =.
  const isTarget = async () =>
    page.evaluate(() => {
      const texts = Array.from(document.querySelectorAll('button'))
        .map((b) => (b.innerText || '').trim())
        .filter(Boolean);
      return texts.includes('>') && texts.includes('<') && texts.includes('=');
    });

  let reached = false;
  for (let i = 0; i < 16 && !reached; i += 1) {
    reached = await isTarget();
    if (reached) break;
    const skip = page.getByRole('button', { name: /تخطّي|Skip|Passer/ }).first();
    if (await skip.count()) {
      await skip.click().catch(() => {});
    } else {
      // A narration reel may have no skip yet; wait a beat.
      await delay(1200);
    }
    await delay(1200);
  }
  report.steps.push(`reached comparison reel: ${reached}`);
  if (!reached) {
    await page.screenshot({ path: `${outDir}/not-reached.png` });
    report.result = { reached: false };
    await writeFile(`${outDir}/report.json`, JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
    await browser.close();
    process.exit(2);
  }

  const before = await page.evaluate(() => {
    const subject = Array.from(document.querySelectorAll('div')).map((d) => d.innerText).find((t) => t && t.includes('الرياضيات'));
    return { counter: (document.body.innerText.match(/\d+\s*\/\s*\d+/) || [])[0] || null, subject: subject ? subject.slice(0, 40) : null };
  });

  // Tap the wrong option "<" with a real pointer click at its pixel.
  const box = await page.evaluate(() => {
    const b = Array.from(document.querySelectorAll('button')).find((x) => (x.innerText || '').trim() === '<');
    if (!b) return null;
    const r = b.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height };
  });
  // The feed rebuilds its queue after every answer, which remounts the card and
  // can drop the reaction frame within milliseconds. A MutationObserver records
  // every DOM state the instant it appears, so the diagnosis frame is not missed.
  await page.evaluate(() => {
    window.__snaps = [];
    const rec = () => window.__snaps.push(document.body.innerText || '');
    window.__obs = new MutationObserver(rec);
    window.__obs.observe(document.body, { subtree: true, childList: true, characterData: true });
  });

  report.steps.push(`clicking '<' at ${JSON.stringify(box)}`);
  await page.mouse.click(box.x, box.y);
  await delay(4000);

  const snaps = await page.evaluate(() => window.__snaps || []);
  const allText = snaps.join('\n');
  const diagnosis = (allText.match(/ظننتِ أن 6,05[^\n]{0,220}/) || [])[0] || null;
  const namedPrefix = (allText.match(/لأ يا [^\n]{0,60}خلّينا نفهم إيه اللي حصل\.[^\n]{0,200}/) || [])[0] || null;
  const captured = {
    snapCount: snaps.length,
    hasBadge: allText.includes('عرفنا الغلطة'),
    arabicDiagnosis: diagnosis,
    namedPrefix,
    genericWrongSeen: allText.includes('قربت! هشرحلك الفكرة تاني'),
  };
  report.capturedReaction = captured;

  const after = await page.evaluate(() => {
    const text = document.body.innerText || '';
    return { latinSentence: /[A-Za-zÀ-ÿ]{4,}/.test(text), screenshotText: text.slice(0, 200) };
  });

  await page.screenshot({ path: `${outDir}/after-tap.png`, fullPage: false });
  report.result = { before, box, after };
  report.finishedAt = new Date().toISOString();
  await writeFile(`${outDir}/report.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
} catch (err) {
  report.error = String(err);
  await writeFile(`${outDir}/report.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  process.exitCode = 1;
} finally {
  await browser.close();
}
