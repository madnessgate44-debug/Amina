/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * The Parent Weekly Summary must report only what the data proves.
 *
 * Audit finding F-02: the summary fabricated activity and mislabelled subjects.
 *   - `lessonsCount` was forced to 4 ("demo baseline") whenever the student had
 *     no logged lessons, so a brand-new child showed "4 lessons".
 *   - `subjectsNeedingAttention` was filled with a praise sentence when empty.
 *   - `recentAchievements` was filled with canned praise when empty.
 *   - every subject other than maths/Arabic was reported as "Science", and
 *     French mode fell back to English labels.
 *
 * These tests pin the honest behaviour: zero means zero, an empty list means an
 * empty list, and a subject keeps its real name in every language.
 */

import assert from 'node:assert';
import { generateParentWeeklySummary } from '../parentService';
import { curriculumService } from '../../curriculum/curriculumService';
import type { Student, DayRecord, Mission, HomeworkItem, Language } from '../../../types';
import type { MasteryRecord } from '../../../types/mastery';

let passed = 0;
let failed = 0;
const test = (name: string, fn: () => void) => {
  try {
    fn();
    passed++;
    console.log(`✅ [PASS] ${name}`);
  } catch (e: any) {
    failed++;
    console.error(`❌ [FAIL] ${name}: ${e.message}`);
  }
};

const flat = curriculumService.getFlatConcepts();
const conceptFor = (subjectId: string) => {
  const c = flat.find((x) => x.subjectId === subjectId);
  if (!c) throw new Error(`no seeded concept for ${subjectId}`);
  return c;
};

const student: Student = {
  id: 'stu_1',
  name: 'Test Student',
  age: 11,
  grade: '5',
  country: 'EG',
  curriculum: 'egypt',
  academicYear: '2026-2027',
  preferredLanguage: 'en',
  subjects: [],
  interviewAnswers: {
    enjoyMost: '',
    hardest: '',
    learningStyle: 'games',
    sessionDuration: '10min',
    upcomingExams: '',
  },
  isOnboarded: true,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

const mastery = (conceptId: string, score: number): MasteryRecord => ({
  id: `stu_1_${conceptId}`,
  studentId: 'stu_1',
  conceptId,
  score,
  confidence: 0.9,
  evidenceCount: 3,
  lastUpdated: '2026-11-01T00:00:00.000Z',
  decayRate: 1,
  evidenceLog: [],
});

const build = (over: {
  dayRecords?: DayRecord[];
  masteryRecords?: Record<string, MasteryRecord>;
  completedMissions?: Mission[];
  homeworkItems?: HomeworkItem[];
  language?: Language;
}) =>
  generateParentWeeklySummary({
    student,
    dayRecords: over.dayRecords ?? [],
    masteryRecords: over.masteryRecords ?? {},
    completedMissions: over.completedMissions ?? [],
    homeworkItems: over.homeworkItems ?? [],
    language: over.language ?? 'en',
  });

// 1. No data must read as no data --------------------------------------------

test('1.1 an empty database reports zero lessons, not a demo baseline of 4', () => {
  assert.strictEqual(build({}).lessonsCoveredCount, 0);
});

test('1.2 an empty database reports no achievements (no canned praise)', () => {
  assert.deepStrictEqual(build({}).recentAchievements, []);
});

test('1.3 an empty database reports no subjects needing attention (no fake subject)', () => {
  assert.deepStrictEqual(build({}).subjectsNeedingAttention, []);
});

// 2. Real activity is still reported ----------------------------------------

test('2.1 lessons covered sums the real day records', () => {
  const day: DayRecord = {
    id: 'd1',
    studentId: 'stu_1',
    date: '2026-11-01',
    lessonsCovered: [
      { subject: 'math' },
      { subject: 'science' },
      { subject: 'arabic' },
    ],
    homeworkAssigned: [],
    confirmed: true,
    createdAt: '2026-11-01T00:00:00.000Z',
    updatedAt: '2026-11-01T00:00:00.000Z',
    origin: 'student_confirmed',
  };
  assert.strictEqual(build({ dayRecords: [day] }).lessonsCoveredCount, 3);
});

// 3. Subjects keep their real name in every language -------------------------

test('3.1 a weak French subject is named "Français" in French, not "Science"', () => {
  const c = conceptFor('subj_french');
  const summary = build({ masteryRecords: { [c.id]: mastery(c.id, 0.3) }, language: 'fr' });
  assert.deepStrictEqual(summary.subjectsNeedingAttention, ['Français']);
});

test('3.2 a weak science subject is named "Science" in English', () => {
  const c = conceptFor('subj_science');
  const summary = build({ masteryRecords: { [c.id]: mastery(c.id, 0.3) }, language: 'en' });
  assert.deepStrictEqual(summary.subjectsNeedingAttention, ['Science']);
});

test('3.3 a weak ICT subject is not mislabelled as "Science"', () => {
  const c = conceptFor('subj_ict');
  const summary = build({ masteryRecords: { [c.id]: mastery(c.id, 0.3) }, language: 'en' });
  assert.ok(
    summary.subjectsNeedingAttention.includes('ICT') ||
      summary.subjectsNeedingAttention.includes('Information Technology') ||
      summary.subjectsNeedingAttention.includes('Informatique'),
    `expected the real ICT label, got ${JSON.stringify(summary.subjectsNeedingAttention)}`
  );
  assert.ok(
    !summary.subjectsNeedingAttention.includes('Science'),
    'ICT must not be reported as Science'
  );
});

test('3.4 a weak Arabic subject is named in Arabic when the language is Arabic', () => {
  const c = conceptFor('subj_arabic');
  const summary = build({ masteryRecords: { [c.id]: mastery(c.id, 0.3) }, language: 'ar' });
  assert.deepStrictEqual(summary.subjectsNeedingAttention, [c.subjectNameAr]);
});

// 4. Achievements require evidence ------------------------------------------

test('4.1 a mastered concept produces a real achievement', () => {
  const c = conceptFor('subj_math');
  const summary = build({ masteryRecords: { [c.id]: mastery(c.id, 0.9) } });
  assert.ok(summary.recentAchievements.length >= 1, 'a mastered concept is an achievement');
});

console.log(`\nPARENT WEEKLY SUMMARY SUITE: ${passed} PASSED, ${failed} FAILED`);
if (failed > 0) process.exit(1);
