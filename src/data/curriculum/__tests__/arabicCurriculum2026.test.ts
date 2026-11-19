/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Guards the 2026/2027 Arabic Language Term 1 coverage against the inspected
 * Ministry student book.
 *
 * The book's printed index (pages 5–6 of the PDF) lists three units of four
 * lessons. This suite fails if a unit or lesson disappears from the registry,
 * if a lesson loses its exercise or answer key, or if a lesson is not
 * instructed in Arabic.
 */

import { ARABIC_CURRICULUM_2026_LESSONS } from '../arabicCurriculum2026';
import { OFFICIAL_CURRICULUM_LESSONS } from '../../officialCurriculum';
import { getPreGeneratedLine } from '../preGeneratedNoorLines';

let passed = 0;
let failed = 0;

const check = (name: string, condition: boolean, detail = '') => {
  if (condition) {
    passed += 1;
    console.log(`✅ [PASS] ${name}`);
  } else {
    failed += 1;
    console.error(`❌ [FAIL] ${name}${detail ? ` — ${detail}` : ''}`);
  }
};

const lessons = ARABIC_CURRICULUM_2026_LESSONS;

/** Unit → lesson numbers printed in the book index. */
const EXPECTED: Record<number, number[]> = {
  1: [1, 2, 3, 4],
  2: [1, 2, 3, 4],
  3: [1, 2, 3, 4],
};

const present = new Map<number, Set<number>>();
for (const lesson of lessons) {
  const set = present.get(lesson.unitNumber) ?? new Set<number>();
  set.add(lesson.lessonNumber);
  present.set(lesson.unitNumber, set);
}

const missingPositions: string[] = [];
for (const [unit, numbers] of Object.entries(EXPECTED)) {
  for (const n of numbers) {
    if (!present.get(Number(unit))?.has(n)) missingPositions.push(`u${unit}l${n}`);
  }
}
check(
  'every lesson position in the printed index exists',
  missingPositions.length === 0,
  missingPositions.join(', '),
);

check(
  'the book registers exactly 12 Term 1 lessons',
  lessons.length === 12,
  `found ${lessons.length}`,
);

check(
  'all 12 lessons are registered in the app curriculum',
  lessons.every((lesson) =>
    OFFICIAL_CURRICULUM_LESSONS.some((registered) => registered.id === lesson.id),
  ),
  lessons
    .filter((l) => !OFFICIAL_CURRICULUM_LESSONS.some((r) => r.id === l.id))
    .map((l) => l.id)
    .join(', '),
);

check(
  'every lesson is available to the learner',
  lessons.every((lesson) => lesson.isAvailable && lesson.contentStatus === 'available'),
);

check(
  'every lesson is instructed, written and assessed in Arabic',
  lessons.every(
    (lesson) =>
      lesson.instructionLanguage === 'ar' &&
      lesson.contentLanguage === 'ar' &&
      lesson.assessmentLanguage === 'ar',
  ),
);

const withoutExercises = lessons.filter(
  (lesson) => !lesson.exercises || lesson.exercises.length === 0,
);
check('every lesson has at least one exercise', withoutExercises.length === 0, withoutExercises.map((l) => l.id).join(', '));

const withoutAnswers = lessons.filter(
  (lesson) =>
    !lesson.exercises?.every(
      (exercise) =>
        typeof exercise.expectedAnswer === 'string' && exercise.expectedAnswer.trim().length > 0,
    ),
);
check('every exercise carries an answer key', withoutAnswers.length === 0, withoutAnswers.map((l) => l.id).join(', '));

const multipleChoiceBroken = lessons.filter((lesson) =>
  lesson.exercises?.some(
    (exercise) =>
      exercise.type === 'multiple_choice' &&
      (!exercise.options ||
        exercise.options.length < 2 ||
        !exercise.options.includes(exercise.expectedAnswer ?? '')),
  ),
);
check(
  'every multiple-choice answer is one of its own options',
  multipleChoiceBroken.length === 0,
  multipleChoiceBroken.map((l) => l.id).join(', '),
);

const withoutConcepts = lessons.filter((lesson) => !lesson.concepts || lesson.concepts.length === 0);
check('every lesson has a teachable concept', withoutConcepts.length === 0, withoutConcepts.map((l) => l.id).join(', '));

const withoutSource = lessons.filter(
  (lesson) => !lesson.sourceRef || typeof lesson.sourceRef.page !== 'number',
);
check(
  'every lesson carries a verified source page reference',
  withoutSource.length === 0,
  withoutSource.map((l) => l.id).join(', '),
);

const sourcePages = lessons.map((lesson) => Number(lesson.sourceRef?.page ?? -1));
check(
  'source pages are inside the inspected 154-page book',
  sourcePages.every((page) => page > 0 && page <= 154),
  sourcePages.filter((p) => !(p > 0 && p <= 154)).join(', '),
);

const noNoorLines = lessons.flatMap((lesson) =>
  lesson.concepts
    .map((_concept, index) =>
      ['intro', 'explanation', 'check'].every(
        (slot) =>
          getPreGeneratedLine('ar', lesson.id, index, slot as 'intro' | 'explanation' | 'check') !==
          null,
      )
        ? []
        : [`${lesson.id}:${index}`],
    )
    .flat(),
);
check(
  'every Arabic lesson can start with zero model quota',
  noNoorLines.length === 0,
  noNoorLines.join(', '),
);

const titlesAr = new Set(lessons.map((lesson) => lesson.titleAr));
check('no two lessons share a title', titlesAr.size === lessons.length);

console.log(`\nARABIC CURRICULUM 2026 SUMMARY: ${passed} PASSED, ${failed} FAILED\n`);
process.exit(failed === 0 ? 0 : 1);
