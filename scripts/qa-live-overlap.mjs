/**
 * Measure whether reel content (option buttons / toolbar) is covered by the
 * floating bottom navigation. Reports each control's rect, the nav rect, and
 * what elementFromPoint actually hits at each control's centre.
 */
import { mkdir, writeFile } from 'node:fs/promises';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || '/tmp/pwtool/node_modules/playwright-core/index.mjs');

const baseURL = process.env.AMINA_BASE_URL || 'https://amina-nine-sepia.vercel.app';
const lang = process.env.AMINA_LANG || 'ar';
const outDir = process.env.AMINA_OUT_DIR || `artifacts/overlap-${lang}`;
await mkdir(outDir, { recursive: true });
const report = { baseURL, lang, consoleErrors: [] };

const student = { id: 'qa-ov-1', name: 'سارة', age: 10, grade: 'الصف الخامس', country: 'EG', curriculum: 'national', academicYear: '2026/2027', preferredLanguage: lang, subjects: ['الرياضيات (بالفرنسية)', 'العلوم'], interviewAnswers: {}, addressForm: 'f', onboarding: { sessionLengthMinutes: 10, likedSubjects: [], learningStyles: [] }, isOnboarded: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
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

  report.measure = await page.evaluate(() => {
    const vh = window.innerHeight;
    const nav = document.querySelector('nav');
    const navRect = nav ? nav.getBoundingClientRect() : null;
    const controls = Array.from(document.querySelectorAll('button'))
      .map((b) => {
        const r = b.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const hit = document.elementFromPoint(cx, cy);
        return {
          text: (b.innerText || '').trim().slice(0, 30),
          top: Math.round(r.top), bottom: Math.round(r.bottom), h: Math.round(r.height),
          inOptions: Boolean(b.parentElement && b.parentElement.className.includes('space-y-2')),
          hitIsSelf: hit === b || b.contains(hit),
          hitText: hit ? (hit.innerText || '').trim().slice(0, 24) : null,
          coveredByNav: Boolean(navRect && r.top < navRect.bottom && r.bottom > navRect.top),
        };
      })
      .filter((c) => c.h >= 30);
    return {
      vh,
      navRect: navRect ? { top: Math.round(navRect.top), bottom: Math.round(navRect.bottom), h: Math.round(navRect.height) } : null,
      controls,
      optionsCovered: controls.filter((c) => c.inOptions && (c.coveredByNav || !c.hitIsSelf)).map((c) => c.text),
    };
  });

  // Break the card down into its parts so the fix can target the right one.
  report.parts = await page.evaluate(() => {
    const section = document.querySelector('section');
    if (!section) return null;
    const inner = section.querySelector(':scope > div.relative');
    const out = [];
    const walk = (el, depth) => {
      for (const c of Array.from(el.children)) {
        const r = c.getBoundingClientRect();
        if (r.height > 8) out.push({ depth, tag: c.tagName.toLowerCase(), cls: (c.className || '').toString().slice(0, 60), top: Math.round(r.top), h: Math.round(r.height), text: (c.innerText || '').trim().slice(0, 30) });
        if (depth < 3) walk(c, depth + 1);
      }
    };
    walk(inner || section, 0);
    const sr = section.getBoundingClientRect();
    return { sectionTop: Math.round(sr.top), sectionH: Math.round(sr.height), innerH: inner ? Math.round(inner.getBoundingClientRect().height) : null, parts: out };
  });

  await page.screenshot({ path: `${outDir}/first-reel.png` });
} catch (e) {
  report.error = String(e);
} finally {
  await writeFile(`${outDir}/report.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  await browser.close();
}
