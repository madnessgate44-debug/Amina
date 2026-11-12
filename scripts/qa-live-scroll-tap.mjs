/**
 * Verify that on a short viewport the LAST option of a tall question reel is
 * reachable by scrolling the reel section, and that tapping it advances the
 * feed (i.e. the tap is not swallowed by the floating nav).
 */
import { mkdir, writeFile } from 'node:fs/promises';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || '/tmp/pwtool/node_modules/playwright-core/index.mjs');

const baseURL = process.env.AMINA_BASE_URL || 'http://127.0.0.1:12000';
const lang = process.env.AMINA_LANG || 'ar';
const outDir = process.env.AMINA_OUT_DIR || `artifacts/scroll-tap-${lang}`;
await mkdir(outDir, { recursive: true });
const report = { baseURL, lang, consoleErrors: [] };

const student = { id: 'qa-sc-1', name: 'سارة', age: 10, grade: 'الصف الخامس', country: 'EG', curriculum: 'national', academicYear: '2026/2027', preferredLanguage: lang, subjects: ['الرياضيات (بالفرنسية)', 'العلوم'], interviewAnswers: {}, addressForm: 'f', onboarding: { sessionLengthMinutes: 10, likedSubjects: [], learningStyles: [] }, isOnboarded: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
const settings = { language: lang, demoTimeSimulatorActive: true, simulatedTimeOfDay: 'after_school', simulatedTime: '14:30', companionVoiceEnabled: false, micPermissionStatus: 'denied', showEvidenceLog: false, simulatedDaysOffset: 0, demoDefaultMigratedV1: true };

const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3, locale: lang === 'ar' ? 'ar-EG' : 'fr-FR' });
const page = await context.newPage();
page.on('console', (m) => { if (m.type() === 'error') report.consoleErrors.push(m.text()); });
page.on('pageerror', (e) => report.consoleErrors.push('pageerror: ' + String(e)));
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

try {
  await page.goto(baseURL, { waitUntil: 'domcontentloaded' });
  await delay(1500);
  await page.evaluate(async ({ student, settings }) => {
    const req = indexedDB.open('ai_school_companion_v2', 10);
    await new Promise((res, rej) => { req.onsuccess = () => res(); req.onerror = () => rej(req.error); req.onupgradeneeded = () => { const db = req.result; if (!db.objectStoreNames.contains('student')) db.createObjectStore('student', { keyPath: 'id' }); if (!db.objectStoreNames.contains('settings')) db.createObjectStore('settings', { keyPath: 'id' }); if (!db.objectStoreNames.contains('day_records')) { const s = db.createObjectStore('day_records', { keyPath: 'id' }); s.createIndex('date', 'date', { unique: false }); } }; });
    const db = req.result; const d = new Date();
    const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const tx = db.transaction(['student', 'settings', 'day_records'], 'readwrite');
    tx.objectStore('student').put(student);
    tx.objectStore('settings').put({ id: 'app_settings', settings });
    tx.objectStore('day_records').put({ id: `day-${today}-${student.id}`, studentId: student.id, date: today, lessonsCovered: [{ subject: 'الرياضيات (بالفرنسية)', topic: 'مقارنة الأعداد العشرية' }], homeworkAssigned: [], confirmed: true, confirmedAt: new Date().toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), origin: 'student_confirmed' });
    await new Promise((res) => { tx.oncomplete = res; tx.onerror = res; }); db.close();
  }, { student, settings });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await delay(2500);
  await page.locator('nav button').nth(1).click();
  await delay(2500);

  const counterNow = () => page.evaluate(() => (document.body.innerText.match(/(\d+)\s*\/\s*(\d+)/) || []).slice(1, 3));
  report.before = await counterNow();

  // First try a REAL swipe (mouse wheel over the card centre), which is what a
  // child's finger does. Then, if that did not move the section, fall back to a
  // programmatic scroll and record which path was needed.
  const readScroll = () => page.evaluate(() => {
    const section = document.querySelector('section');
    return section ? { scrollTop: section.scrollTop, scrollHeight: section.scrollHeight, clientHeight: section.clientHeight } : null;
  });
  const s0 = await readScroll();
  await page.mouse.move(195, 500);
  for (let i = 0; i < 6; i += 1) { await page.mouse.wheel(0, 260); await delay(120); }
  await delay(600);
  const sWheel = await readScroll();
  report.wheelScroll = { before: s0, after: sWheel, moved: sWheel && s0 && sWheel.scrollTop > s0.scrollTop + 5 };

  if (!report.wheelScroll.moved) {
    report.scroll = await page.evaluate(() => {
      const section = document.querySelector('section');
      if (!section) return null;
      const before = section.scrollTop;
      section.scrollTop = section.scrollHeight;
      return { scrollTopBefore: before, scrollTopAfter: section.scrollTop, scrollHeight: section.scrollHeight, clientHeight: section.clientHeight };
    });
    await delay(600);
  }

  // Find the last option, report its rect and what elementFromPoint hits.
  const target = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('button')).filter((b) => b.parentElement && b.parentElement.className.includes('space-y-2'));
    const b = all[all.length - 1];
    if (!b) return null;
    const r = b.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const hit = document.elementFromPoint(cx, cy);
    return { text: (b.innerText || '').trim(), x: cx, y: cy, top: Math.round(r.top), bottom: Math.round(r.bottom), hitIsSelf: hit === b || b.contains(hit) };
  });
  report.target = target;
  if (target) {
    await page.mouse.click(target.x, target.y);
    await delay(6000);
  }
  report.after = await counterNow();
  await page.screenshot({ path: `${outDir}/after.png` });
} catch (e) {
  report.error = String(e);
} finally {
  await writeFile(`${outDir}/report.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  await browser.close();
}
