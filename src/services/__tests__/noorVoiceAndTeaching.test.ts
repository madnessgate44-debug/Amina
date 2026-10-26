/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Regression tests for the two defects the owner reported on the live app:
 *   1. Miss Noor is a woman, but the Arabic narration was spoken by a man.
 *      The server asked Gemini for the "Puck" voice, which Google documents as
 *      Male. Every language must now use a female voice.
 *   2. Only the short speech bubble was voiced; the lesson explanation itself
 *      was never read out, so the child reached the quiz untaught. The whole
 *      explanation must be spoken, and teaching must come before questions.
 *
 * These exercise the real modules, not mocks.
 */

import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import {
  tutorVoiceFor,
  isFemaleVoice,
  MISS_NOOR_VOICE,
  FEMALE_PREBUILT_VOICES,
  MALE_PREBUILT_VOICES,
} from '../voice/tutorVoice';
import { splitForSpeech, buildTeachingNarration, MAX_TTS_CHARS } from '../voice/lessonNarration';
import { buildLessonExplanations, buildLessonGreeting } from '../teaching/lessonExplanations';

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

// ---------------------------------------------------------------------------
// 1. Miss Noor speaks with a woman's voice
// ---------------------------------------------------------------------------

test('1.1 every language resolves to a documented female voice', () => {
  for (const lang of ['ar', 'fr', 'en'] as const) {
    const voice = tutorVoiceFor(lang);
    assert.ok(
      isFemaleVoice(voice),
      `${lang} resolves to "${voice}", which is not a documented female voice`
    );
  }
});

test('1.2 the male voice "Puck" is never used', () => {
  for (const lang of ['ar', 'fr', 'en'] as const) {
    assert.notStrictEqual(tutorVoiceFor(lang), 'Puck', `${lang} still uses the male voice Puck`);
  }
  assert.ok(
    (MALE_PREBUILT_VOICES as readonly string[]).includes('Puck'),
    'Puck must be listed as male so this guard stays meaningful'
  );
});

test('1.3 the voice lists do not overlap', () => {
  const female = new Set<string>(FEMALE_PREBUILT_VOICES);
  const overlap = (MALE_PREBUILT_VOICES as readonly string[]).filter((v) => female.has(v));
  assert.deepStrictEqual(overlap, [], `voices listed as both female and male: ${overlap.join(', ')}`);
});

test('1.4 the chosen voice is the shared constant', () => {
  assert.strictEqual(tutorVoiceFor('ar'), MISS_NOOR_VOICE);
  assert.strictEqual(tutorVoiceFor('en'), MISS_NOOR_VOICE);
});

test('1.5 server.ts asks for the female voice and no longer hardcodes Puck', () => {
  const server = readFileSync(new URL('../../../server.ts', import.meta.url), 'utf8');
  assert.ok(server.includes('tutorVoiceFor('), 'server.ts does not use tutorVoiceFor()');
  assert.ok(!/'Puck'/.test(server), "server.ts still hardcodes the male voice 'Puck'");
  assert.ok(
    !/voiceName = .*Kore.*:.*Kore/.test(server),
    'server.ts still inlines a per-language voice ternary'
  );
});

// ---------------------------------------------------------------------------
// 2. The whole explanation is spoken
// ---------------------------------------------------------------------------

test('2.1 long text is split into TTS-sized utterances at sentence ends', () => {
  const sentence = 'هذه جملة قصيرة للاختبار. ';
  const long = sentence.repeat(40).trim();
  const chunks = splitForSpeech(long);
  assert.ok(chunks.length > 1, 'long text was not split');
  for (const c of chunks) {
    assert.ok(c.length <= MAX_TTS_CHARS, `chunk exceeds the TTS limit: ${c.length}`);
  }
  assert.ok(chunks.every((c) => c.endsWith('.')), 'a chunk was cut mid-sentence');
});

test('2.2 short text is returned as a single utterance', () => {
  assert.deepStrictEqual(splitForSpeech('مرحباً يا سلمى.'), ['مرحباً يا سلمى.']);
});

test('2.3 empty text produces no utterances', () => {
  assert.deepStrictEqual(splitForSpeech('   '), []);
  assert.deepStrictEqual(splitForSpeech(''), []);
});

test('2.4 a single over-long sentence is still hard-split, losing nothing', () => {
  const long = 'ا'.repeat(MAX_TTS_CHARS * 2 + 50);
  const chunks = splitForSpeech(long);
  assert.ok(chunks.length >= 3, 'over-long sentence was not hard-split');
  assert.strictEqual(chunks.join(''), long, 'characters were lost while splitting');
});

test('2.5 the narration covers hook, blackboard and analogy, in teaching order', () => {
  const queue = buildTeachingNarration({
    hook: 'المقدمة.',
    chalkboard: 'الشرح.',
    analogy: 'التشبيه.',
  });
  assert.deepStrictEqual(queue, ['المقدمة.', 'الشرح.', 'التشبيه.']);
});

test('2.6 the discussion question is not narrated (questions come after teaching)', () => {
  const queue = buildTeachingNarration({
    hook: 'المقدمة.',
    chalkboard: 'الشرح.',
    analogy: 'التشبيه.',
    discussion: 'سؤال للنقاش.',
  });
  assert.ok(!queue.includes('سؤال للنقاش.'), 'the discussion question was narrated as teaching');
});

test('2.7 every lesson segment is actually read (nothing is dropped)', () => {
  const segments = { hook: 'أ'.repeat(600), chalkboard: 'ب'.repeat(600), analogy: 'ج'.repeat(600) };
  const queue = buildTeachingNarration(segments);
  const joined = queue.join('');
  assert.ok(joined.includes('أ') && joined.includes('ب') && joined.includes('ج'), 'a segment was lost');
  assert.ok(queue.length >= 3, 'long segments were not split');
});

// ---------------------------------------------------------------------------
// 3. Teaching before questioning
// ---------------------------------------------------------------------------

const lesson = {
  id: 'lesson_test',
  titleAr: 'درس تجريبي',
  titleEn: 'Test Lesson',
  readingText: 'نص القراءة للدرس.',
  objectives: ['هدف أول', 'هدف ثان'],
  sourceRef: { bookAr: 'كتاب الوزارة', bookEn: 'Ministry Book' },
};

test('3.1 the lesson greeting announces explanation before questions', () => {
  const ar = buildLessonGreeting(lesson, { isArabic: true, isFrench: false, studentName: 'سلمى' });
  assert.ok(ar.includes('سلمى'), 'the child name is missing');
  assert.ok(ar.includes('أشرحلك'), 'the greeting does not promise an explanation');
  assert.ok(ar.includes('أسئلة'), 'the greeting does not mention the questions that follow');
});

test('3.2 explanations are built for the lesson being opened, not a stale one', () => {
  const other = { ...lesson, id: 'lesson_other', titleAr: 'درس آخر', titleEn: 'Other Lesson' };
  const set = buildLessonExplanations(other, { isArabic: true, isFrench: false, studentName: 'سلمى' });
  assert.ok(set.hook.includes('درس آخر'), 'hook used the wrong lesson');
  assert.ok(set.analogy.includes('درس آخر'), 'analogy used the wrong lesson');
  // The blackboard quotes the reading text, so give the two lessons different text.
  const a = buildLessonExplanations(
    { ...lesson, id: 'a', readingText: 'نص الدرس الأول.' },
    { isArabic: true, isFrench: false, studentName: 'سلمى' }
  );
  const b = buildLessonExplanations(
    { ...lesson, id: 'b', readingText: 'نص الدرس الثاني.' },
    { isArabic: true, isFrench: false, studentName: 'سلمى' }
  );
  assert.ok(a.chalkboard.includes('نص الدرس الأول'), 'blackboard did not quote the right reading text');
  assert.ok(b.chalkboard.includes('نص الدرس الثاني'), 'blackboard did not quote the right reading text');
  assert.ok(!a.chalkboard.includes('نص الدرس الثاني'), 'blackboard leaked another lesson\'s text');
});

test('3.3 AI-refined segments override the defaults', () => {
  const set = buildLessonExplanations(lesson, {
    isArabic: true,
    isFrench: false,
    studentName: 'سلمى',
    dynamicExplanations: {
      [`${lesson.id}_hook`]: 'مقدمة مخصصة.',
      [`${lesson.id}_core`]: 'شرح مخصص.',
      [`${lesson.id}_analogy`]: 'تشبيه مخصص.',
    },
  });
  assert.strictEqual(set.hook, 'مقدمة مخصصة.');
  assert.strictEqual(set.chalkboard, 'شرح مخصص.');
  assert.strictEqual(set.analogy, 'تشبيه مخصص.');
});

test('3.4 a null readingText does not crash and falls back to objectives', () => {
  const set = buildLessonExplanations(
    { ...lesson, readingText: null },
    { isArabic: true, isFrench: false, studentName: 'سلمى' }
  );
  assert.ok(set.chalkboard.includes('هدف أول'), 'objectives were not used as the fallback');
});

test('3.5 the classroom opens on the teaching station, not the quiz', () => {
  const src = readFileSync(
    new URL('../../components/teacher/VirtualTeacherClassroom.tsx', import.meta.url),
    'utf8'
  );
  const openLesson = src.slice(src.indexOf('const handleSelectLesson'));
  const body = openLesson.slice(0, openLesson.indexOf('// Diagnostic Question Selection'));
  assert.ok(
    body.includes("setActiveStation('chalkboard')"),
    'opening a lesson no longer starts on the teaching station'
  );
  assert.ok(
    !body.includes("setActiveStation('diagnostic')"),
    'opening a lesson still starts on the diagnostic question'
  );
});

test('3.6 the teaching station is listed before the question stations in the tab order', () => {
  const src = readFileSync(
    new URL('../../components/teacher/VirtualTeacherClassroom.tsx', import.meta.url),
    'utf8'
  );
  const teachIdx = src.indexOf("labelAr: '1. الشرح الموجه'");
  const diagIdx = src.indexOf("labelAr: '2. التشخيص'");
  assert.ok(teachIdx > -1, 'the teaching station is not labelled first');
  assert.ok(diagIdx > -1, 'the diagnostic station label changed unexpectedly');
  assert.ok(teachIdx < diagIdx, 'the diagnostic question is still shown before the teaching tab');
});

console.log(`\nNOOR VOICE + TEACHING SUITE SUMMARY: ${passed} PASSED, ${process.exitCode ? '1+' : 0} FAILED`);
if (process.exitCode) process.exit(1);
