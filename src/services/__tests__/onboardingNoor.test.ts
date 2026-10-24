/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * PR A regression suite: Noor-led onboarding.
 *
 * Covers the three surfaces the rewrite touches:
 *  1. Student migration — stored profiles keep working and gain safe defaults.
 *  2. Multi-select preference normalisation — empty means no data, never a
 *     pre-filled default.
 *  3. addressForm — Arabic grammar follows the child's chosen form, defaulting
 *     to feminine for existing students.
 * Plus the exam calendar that replaced the onboarding exams question.
 */

import { migrateStudent, carryOverLegacyAnswers, parseLegacySessionDuration } from '../storage/studentMigrations';
import { getArabicForms, withPossessive, pickByAddress } from '../i18n/arabicAddress';
import { buildWarmupQuestions, toWarmupQuestion, mulberry32, shuffle } from '../onboarding/warmupService';
import {
  daysBetweenLocalDates,
  getUpcomingExams,
  getNextExam,
  isExamEntryValid,
  createExamEntry,
  countExamsOn,
} from '../parent/examCalendarService';
import { Student } from '../../types';
import { curriculumService } from '../curriculum/curriculumService';

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`✅ [PASS] ${message}`);
    passed++;
  } else {
    console.error(`❌ [FAIL] ${message}`);
    failed++;
  }
}

const baseStudent: Student = {
  id: 'student_test',
  name: 'أمينة',
  age: 10,
  grade: 'Grade 5',
  country: 'Egypt',
  curriculum: 'Girard',
  academicYear: '2026-2027',
  preferredLanguage: 'ar',
  subjects: ['math'],
  interviewAnswers: {
    enjoyMost: 'Science',
    hardest: 'Math',
    learningStyle: 'games',
    sessionDuration: '10min',
    upcomingExams: 'soon',
  },
  isOnboarded: true,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

function run() {
  console.log('--- STARTING ONBOARDING / PR A SUITE ---\n');

  // =========================================================================
  // 1. Student migration
  // =========================================================================
  console.log('Test 1: Student migration');

  const legacy = { ...baseStudent } as Student;
  delete (legacy as any).addressForm;
  const migrated = migrateStudent(legacy);

  assert(migrated.addressForm === 'f', '1.1: legacy student defaults to feminine addressForm');
  assert(legacy.addressForm === undefined, '1.2: migration does not mutate the input object');
  assert(migrated.name === baseStudent.name, '1.3: migration preserves existing fields');
  assert(
    Array.isArray(migrated.onboarding?.learningStyles) &&
      migrated.onboarding!.learningStyles![0] === 'games',
    '1.4: legacy learningStyle carries over into onboarding preferences'
  );
  assert(
    migrated.onboarding?.sessionLengthMinutes === 10,
    '1.5: legacy "10min" sessionDuration maps to 10 minutes'
  );

  // An already-migrated student is left alone.
  const already = migrateStudent({ ...baseStudent, addressForm: 'm' });
  assert(already.addressForm === 'm', '1.6: an explicit addressForm is never overwritten');

  // No interview data -> no fabricated preferences.
  const blank = migrateStudent({
    ...baseStudent,
    interviewAnswers: { enjoyMost: '', hardest: '', learningStyle: '', sessionDuration: '', upcomingExams: '' },
  } as Student);
  assert(
    blank.onboarding === undefined,
    '1.7: no legacy answers means no onboarding preferences (no fabricated defaults)'
  );

  assert(parseLegacySessionDuration('30min') === 20, '1.8: 30min maps to the longest chip (20)');
  assert(parseLegacySessionDuration('') === undefined, '1.9: empty duration yields undefined');
  assert(parseLegacySessionDuration('5min') === 5, '1.10: 5min maps to 5');
  assert(parseLegacySessionDuration('120min') === undefined, '1.11: out-of-range duration is dropped');
  assert(parseLegacySessionDuration('not-a-number') === undefined, '1.12: non-numeric duration is dropped');

  // =========================================================================
  // 2. Multi-select normalisation
  // =========================================================================
  console.log('\nTest 2: Multi-select preferences');

  const multi = migrateStudent({
    ...baseStudent,
    onboarding: {
      likedSubjects: ['Math', 'Math', 'Science'],
      learningStyles: ['games', 'videos', 'games'],
      sessionLengthMinutes: 20,
    },
  } as Student);

  assert(
    JSON.stringify(multi.onboarding?.likedSubjects) === JSON.stringify(['Math', 'Science']),
    '2.1: duplicate liked subjects are de-duplicated, order preserved'
  );
  assert(
    JSON.stringify(multi.onboarding?.learningStyles) === JSON.stringify(['games', 'videos']),
    '2.2: duplicate learning styles are de-duplicated'
  );
  assert(multi.onboarding?.sessionLengthMinutes === 20, '2.3: a valid session length is preserved');

  const badLength = migrateStudent({
    ...baseStudent,
    onboarding: { sessionLengthMinutes: 45 as any },
  } as Student);
  assert(
    badLength.onboarding?.sessionLengthMinutes === undefined,
    '2.4: an unoffered session length is rejected rather than rounded'
  );

  // =========================================================================
  // 3. addressForm drives Arabic grammar
  // =========================================================================
  console.log('\nTest 3: Arabic addressForm grammar');

  const fem = getArabicForms('f');
  const masc = getArabicForms('m');
  assert(fem.you !== masc.you, '3.1: the standalone pronoun differs by address form');
  assert(getArabicForms(undefined).you === fem.you, '3.2: undefined defaults to feminine');
  assert(withPossessive('اسم', 'f') === 'اسمكِ', '3.3: feminine possessive suffix is كِ');
  assert(withPossessive('اسم', 'm') === 'اسمكَ', '3.4: masculine possessive suffix is كَ');
  assert(
    pickByAddress('f', 'شاطرة', 'شاطر') === 'شاطرة' && pickByAddress('m', 'شاطرة', 'شاطر') === 'شاطر',
    '3.5: pickByAddress selects the correct variant'
  );

  // =========================================================================
  // 4. Warm-up questions come from real curriculum
  // =========================================================================
  console.log('\nTest 4: Warm-up questions');

  const arWarmup = buildWarmupQuestions('ar', 3, 1);
  assert(arWarmup.length === 3, `4.1: builds 3 questions (got ${arWarmup.length})`);
  assert(
    new Set(arWarmup.map((q) => q.subjectId)).size === arWarmup.length,
    '4.2: the three questions come from three different subjects'
  );
  assert(
    arWarmup.every((q) => q.options.length >= 2 && q.correctIndex >= 0 && q.correctIndex < q.options.length),
    '4.3: every question has a resolvable correct answer index'
  );
  assert(
    arWarmup.every((q) => q.prompt.trim().length > 0 && q.sourceLabel.trim().length > 0),
    '4.4: every question has non-empty text and a source label'
  );

  const deterministic = buildWarmupQuestions('ar', 3, 1);
  assert(
    JSON.stringify(deterministic.map((q) => q.prompt)) === JSON.stringify(arWarmup.map((q) => q.prompt)),
    '4.5: the same seed yields the same questions (deterministic)'
  );

  const enWarmup = buildWarmupQuestions('en', 3, 1);
  assert(enWarmup.length === 3, '4.6: warm-up builds in English too');

  // A malformed exercise must be rejected, never guessed.
  const badLesson = curriculumService.getAllLessons()[0];
  const rejected = toWarmupQuestion(
    badLesson,
    { type: 'multiple_choice', question: 'q', options: ['a', 'b'], expectedAnswer: 'z' } as any,
    'ar'
  );
  assert(rejected === null, '4.7: an exercise whose answer is not among the options is rejected');

  const noOptions = toWarmupQuestion(
    badLesson,
    { type: 'qa', question: 'q', expectedAnswer: 'a' } as any,
    'ar'
  );
  assert(noOptions === null, '4.8: an exercise without options is rejected');

  const dupOptions = toWarmupQuestion(
    badLesson,
    { type: 'multiple_choice', question: 'q', options: ['a', 'a', 'b'], expectedAnswer: 'a' } as any,
    'ar'
  );
  assert(dupOptions === null, '4.9: an ambiguous exercise (duplicate options) is rejected');

  // PRNG sanity: same seed -> same sequence, different seed -> different.
  const r1 = mulberry32(42);
  const r2 = mulberry32(42);
  const r3 = mulberry32(43);
  const seq1 = [r1(), r1(), r1()];
  const seq2 = [r2(), r2(), r2()];
  const seq3 = [r3(), r3(), r3()];
  assert(JSON.stringify(seq1) === JSON.stringify(seq2), '4.10: mulberry32 is deterministic per seed');
  assert(JSON.stringify(seq1) !== JSON.stringify(seq3), '4.11: different seeds diverge');
  assert(
    shuffle([1, 2, 3, 4, 5], mulberry32(7)).sort().join(',') === '1,2,3,4,5',
    '4.12: shuffle preserves the full set of elements'
  );

  // =========================================================================
  // 5. Exam calendar (replaces the onboarding exams question)
  // =========================================================================
  console.log('\nTest 5: Exam calendar');

  const now = new Date(2026, 9, 24); // 2026-10-24 local
  const examA = createExamEntry({ studentId: 's1', subjectId: 'subj_math', date: '2026-10-27' });
  const examB = createExamEntry({ studentId: 's1', subjectId: 'subj_science', date: '2026-10-25' });
  const past = createExamEntry({ studentId: 's1', subjectId: 'subj_arabic', date: '2026-10-01' });

  assert(daysBetweenLocalDates(now, '2026-10-27') === 3, '5.1: daysUntil is a whole local-day count');
  assert(daysBetweenLocalDates(now, '2026-10-24') === 0, '5.2: today is 0 days away');

  const upcoming = getUpcomingExams([examA, examB, past], now);
  assert(upcoming.length === 2, `5.3: past exams are excluded (got ${upcoming.length})`);
  assert(upcoming[0].entry.id === examB.id, '5.4: the soonest exam sorts first');
  assert(getNextExam([examA, past], now)?.entry.id === examA.id, '5.5: getNextExam returns the soonest');

  assert(isExamEntryValid({ subjectId: 'subj_math', date: '2026-10-27' }), '5.6: a real date is valid');
  assert(!isExamEntryValid({ subjectId: 'subj_math', date: '2026-02-30' }), '5.7: an impossible date is invalid');
  assert(!isExamEntryValid({ subjectId: '', date: '2026-10-27' }), '5.8: a missing subject is invalid');
  assert(!isExamEntryValid({ subjectId: 'subj_math', date: '27/10/2026' }), '5.9: a wrong date format is invalid');

  assert(countExamsOn([examA, examB], '2026-10-27') === 1, '5.10: countExamsOn counts matching entries');

  // A malformed stored entry is ignored rather than guessed.
  const malformed = { ...examA, date: 'not-a-date' };
  assert(
    getUpcomingExams([malformed], now).length === 0,
    '5.11: an unparseable stored date is ignored'
  );

  console.log('\n=================================================================');
  console.log(`PR A SUITE SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('=================================================================');

  if (failed > 0) process.exit(1);
}

run();
