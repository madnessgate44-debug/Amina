/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 5a: the server tutor voice must follow the student's addressForm and
 * must never fall back to the hardcoded name "أمينة"/"Amina".
 */

import assert from 'node:assert';
import {
  tutorArabicVoice,
  resolveStudentName,
  genderRuleLine,
  addressFormWord,
} from '../i18n/serverTutorVoice';
import { readFileSync } from 'node:fs';

let passed = 0;
const test = (name: string, fn: () => void) => {
  try {
    fn();
    passed++;
    console.log(`✅ [PASS] ${name}`);
  } catch (e: any) {
    console.error(`❌ [FAIL] ${name}: ${e.message}`);
    process.exitCode = 1;
  }
};

test('1.1 feminine is the default (existing students have no addressForm)', () => {
  assert.strictEqual(tutorArabicVoice(undefined).address, 'يا حبيبتي');
  assert.strictEqual(tutorArabicVoice(null).comeOn, 'تعالي');
  assert.strictEqual(tutorArabicVoice('f').champion, 'يا بطلة');
});

test('1.2 masculine flips every form used by the server copy', () => {
  const v = tutorArabicVoice('m');
  assert.strictEqual(v.address, 'يا حبيبي');
  assert.strictEqual(v.comeOn, 'تعال');
  assert.strictEqual(v.look, 'بص');
  assert.strictEqual(v.lookAt, 'شوف');
  assert.strictEqual(v.imagine, 'تخيل');
  assert.strictEqual(v.focus, 'ركّز');
  assert.strictEqual(v.tellMe, 'قول لي');
  assert.strictEqual(v.champion, 'يا بطل');
  assert.strictEqual(v.listenToYou, 'سامعك');
  assert.strictEqual(v.youAsk, 'بتسأل');
  assert.strictEqual(v.ready, 'جاهز');
  assert.strictEqual(v.yourSuffix, 'كَ');
});

test('1.3 no form is identical between the two genders', () => {
  const f = tutorArabicVoice('f');
  const m = tutorArabicVoice('m');
  for (const key of Object.keys(f) as (keyof typeof f)[]) {
    assert.notStrictEqual(f[key], m[key], `form "${key}" did not change with addressForm`);
  }
});

test('2.1 resolveStudentName uses the supplied name', () => {
  assert.strictEqual(resolveStudentName('سلمى', 'ar'), 'سلمى');
  assert.strictEqual(resolveStudentName('  Salma  ', 'en'), 'Salma');
});

test('2.2 resolveStudentName never returns the old hardcoded child name', () => {
  assert.notStrictEqual(resolveStudentName(undefined, 'ar'), 'أمينة');
  assert.notStrictEqual(resolveStudentName('', 'en'), 'Amina');
  assert.strictEqual(resolveStudentName(undefined, 'ar'), 'صديقي');
  assert.strictEqual(resolveStudentName(undefined, 'en'), 'friend');
});

test('2.3 resolveStudentName tolerates non-string input', () => {
  assert.strictEqual(resolveStudentName(42, 'en'), 'friend');
  assert.strictEqual(resolveStudentName({}, 'ar'), 'صديقي');
});

test('3.1 genderRuleLine is only emitted for Arabic and names the right form', () => {
  assert.strictEqual(genderRuleLine('m', 'en'), '');
  assert.strictEqual(genderRuleLine('f', 'fr'), '');
  const m = genderRuleLine('m', 'ar');
  assert.ok(m.includes('masculine'), 'masculine rule missing');
  assert.ok(m.includes('يا حبيبي'), 'masculine address example missing');
  const f = genderRuleLine('f', 'ar');
  assert.ok(f.includes('feminine'), 'feminine rule missing');
  assert.ok(f.includes('يا حبيبتي'), 'feminine address example missing');
});

test('3.2 addressFormWord maps correctly', () => {
  assert.strictEqual(addressFormWord('m'), 'masculine');
  assert.strictEqual(addressFormWord('f'), 'feminine');
  assert.strictEqual(addressFormWord(undefined), 'feminine');
});

test('4.1 server.ts contains no hardcoded child name or feminine-only address', () => {
  const server = readFileSync(new URL('../../../server.ts', import.meta.url), 'utf8');
  assert.ok(!/أمينة/.test(server), 'server.ts still contains "أمينة"');
  assert.ok(!/\bAmina\b/.test(server), 'server.ts still contains "Amina"');
  // Feminine-only imperatives that ignore addressForm must not appear.
  for (const phrase of ['يا حبيبتي يا', 'بصي معايا', 'ركزي معايا', 'تعالي أحكي', 'تخيلي لو', 'سامعاكي']) {
    assert.ok(!server.includes(phrase), `server.ts still hardcodes "${phrase}"`);
  }
});

test('4.2 server.ts imports and uses the address-form helper', () => {
  const server = readFileSync(new URL('../../../server.ts', import.meta.url), 'utf8');
  assert.ok(server.includes('serverTutorVoice'), 'helper not imported');
  assert.ok(server.includes('tutorArabicVoice('), 'tutorArabicVoice not used');
  assert.ok(server.includes('resolveStudentName('), 'resolveStudentName not used');
  assert.ok(server.includes('genderRuleLine('), 'genderRuleLine not used');
});

test('4.3 AI routes accept addressForm from the request body', () => {
  const server = readFileSync(new URL('../../../server.ts', import.meta.url), 'utf8');
  const hits = server.match(/req\.body\?\.addressForm/g) || [];
  assert.ok(hits.length >= 4, `expected addressForm reads in /chat, /tutor-explain, /tutor-reply and their fallbacks; found ${hits.length}`);
});

console.log(`\nPHASE 5A ADDRESS-FORM SUITE SUMMARY: ${passed} PASSED, ${process.exitCode ? '1+' : 0} FAILED`);
if (process.exitCode) process.exit(1);
