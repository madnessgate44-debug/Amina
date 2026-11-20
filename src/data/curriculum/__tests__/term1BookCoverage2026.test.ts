/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Guards the 2026/2027 Term 1 language-book coverage against the inspected
 * Ministry student books.
 *
 * Arabic: the printed index lists three units of four lessons.
 * English: the book prints five units and twenty lesson headings.
 * Social Studies: three units of four, four and three lessons.
 * Libraries: one unit of twelve lessons.
 * Farming Skills: two units of two and three lessons.
 * Family Management: two units of three lessons each.
 * Islamic Education: three units of seven, seven and six lessons.
 *
 * This suite fails if a unit or lesson disappears from the registry, if a
 * lesson loses its exercise or answer key, or if a lesson is not instructed
 * in the language its book is written in.
 */

import { ARABIC_CURRICULUM_2026_LESSONS } from '../arabicCurriculum2026';
import { ENGLISH_CURRICULUM_2026_LESSONS } from '../englishCurriculum2026';
import { SOCIAL_STUDIES_CURRICULUM_2026_LESSONS } from '../socialStudiesCurriculum2026';
import { LIBRARIES_CURRICULUM_2026_LESSONS } from '../librariesCurriculum2026';
import { FARMING_CURRICULUM_2026_LESSONS } from '../farmingCurriculum2026';
import { FAMILY_MANAGEMENT_CURRICULUM_2026_LESSONS } from '../familyManagementCurriculum2026';
import { ISLAMIC_CURRICULUM_2026_LESSONS } from '../islamicCurriculum2026';
import { CHRISTIAN_CURRICULUM_2026_LESSONS } from '../christianCurriculum2026';
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

type BookCase = {
  label: string;
  lessons: typeof ARABIC_CURRICULUM_2026_LESSONS;
  language: 'ar' | 'en' | 'fr';
  expected: Record<number, number[]>;
  bookPages: number;
};

const BOOKS: BookCase[] = [
  {
    label: 'Arabic',
    lessons: ARABIC_CURRICULUM_2026_LESSONS,
    language: 'ar',
    expected: { 1: [1, 2, 3, 4], 2: [1, 2, 3, 4], 3: [1, 2, 3, 4] },
    bookPages: 154,
  },
  {
    label: 'English',
    lessons: ENGLISH_CURRICULUM_2026_LESSONS,
    language: 'en',
    expected: {
      1: [1, 2, 3, 4, 5],
      2: [1, 2, 3, 4],
      3: [1, 2, 3, 4],
      4: [1, 2, 3, 4],
      5: [1, 2, 3, 4],
    },
    bookPages: 113,
  },
  {
    label: 'Social Studies',
    lessons: SOCIAL_STUDIES_CURRICULUM_2026_LESSONS,
    language: 'ar',
    expected: {
      1: [1, 2, 3, 4],
      2: [1, 2, 3, 4],
      3: [1, 2, 3],
    },
    bookPages: 98,
  },
  {
    label: 'Libraries',
    lessons: LIBRARIES_CURRICULUM_2026_LESSONS,
    language: 'ar',
    expected: { 1: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
    bookPages: 41,
  },
  {
    label: 'Farming Skills',
    lessons: FARMING_CURRICULUM_2026_LESSONS,
    language: 'ar',
    expected: { 1: [1, 2], 2: [1, 2], 3: [1] },
    bookPages: 35,
  },
  {
    label: 'Family Management',
    lessons: FAMILY_MANAGEMENT_CURRICULUM_2026_LESSONS,
    language: 'ar',
    expected: { 1: [1, 2, 3], 2: [1, 2, 3] },
    bookPages: 47,
  },
  {
    label: 'Islamic Religious Education',
    lessons: ISLAMIC_CURRICULUM_2026_LESSONS,
    language: 'ar',
    expected: { 1: [1, 2, 3, 4, 5, 6, 7], 2: [1, 2, 3, 4, 5, 6, 7], 3: [1, 2, 3, 4, 5, 6] },
    bookPages: 95,
  },
  {
    label: 'Christian Religious Education',
    lessons: CHRISTIAN_CURRICULUM_2026_LESSONS,
    language: 'ar',
    expected: { 1: [1, 2, 3, 4, 5, 6], 2: [1, 2, 3, 4, 5, 6], 3: [1, 2, 3, 4, 5, 6] },
    bookPages: 98,
  },
];

for (const book of BOOKS) {
  const { label, lessons, expected } = book;

  const present = new Map<number, Set<number>>();
  for (const lesson of lessons) {
    const set = present.get(lesson.unitNumber) ?? new Set<number>();
    set.add(lesson.lessonNumber);
    present.set(lesson.unitNumber, set);
  }

  const missingPositions: string[] = [];
  for (const [unit, numbers] of Object.entries(expected)) {
    for (const n of numbers) {
      if (!present.get(Number(unit))?.has(n)) missingPositions.push(`u${unit}l${n}`);
    }
  }
  check(
    `[${label}] every lesson position in the printed index exists`,
    missingPositions.length === 0,
    missingPositions.join(', '),
  );

  const expectedCount = Object.values(expected).flat().length;
  check(
    `[${label}] the book registers exactly ${expectedCount} Term 1 lessons`,
    lessons.length === expectedCount,
    `found ${lessons.length}`,
  );

  const unregistered = lessons.filter(
    (lesson) => !OFFICIAL_CURRICULUM_LESSONS.some((registered) => registered.id === lesson.id),
  );
  check(
    `[${label}] all ${expectedCount} lessons are registered in the app curriculum`,
    unregistered.length === 0,
    unregistered.map((l) => l.id).join(', '),
  );

  check(
    `[${label}] every lesson is available to the learner`,
    lessons.every((lesson) => lesson.isAvailable && lesson.contentStatus === 'available'),
  );

  check(
    `[${label}] every lesson is instructed, written and assessed in ${book.language}`,
    lessons.every(
      (lesson) =>
        lesson.instructionLanguage === book.language &&
        lesson.contentLanguage === book.language &&
        lesson.assessmentLanguage === book.language,
    ),
  );

  const withoutExercises = lessons.filter(
    (lesson) => !lesson.exercises || lesson.exercises.length === 0,
  );
  check(
    `[${label}] every lesson has at least one exercise`,
    withoutExercises.length === 0,
    withoutExercises.map((l) => l.id).join(', '),
  );

  const withoutAnswers = lessons.filter(
    (lesson) =>
      !lesson.exercises?.every(
        (exercise) =>
          typeof exercise.expectedAnswer === 'string' && exercise.expectedAnswer.trim().length > 0,
      ),
  );
  check(
    `[${label}] every exercise carries an answer key`,
    withoutAnswers.length === 0,
    withoutAnswers.map((l) => l.id).join(', '),
  );

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
    `[${label}] every multiple-choice answer is one of its own options`,
    multipleChoiceBroken.length === 0,
    multipleChoiceBroken.map((l) => l.id).join(', '),
  );

  const withoutConcepts = lessons.filter(
    (lesson) => !lesson.concepts || lesson.concepts.length === 0,
  );
  check(
    `[${label}] every lesson has a teachable concept`,
    withoutConcepts.length === 0,
    withoutConcepts.map((l) => l.id).join(', '),
  );

  const withoutSource = lessons.filter(
    (lesson) => !lesson.sourceRef || typeof lesson.sourceRef.page !== 'number',
  );
  check(
    `[${label}] every lesson carries a verified source page reference`,
    withoutSource.length === 0,
    withoutSource.map((l) => l.id).join(', '),
  );

  const sourcePages = lessons.map((lesson) => Number(lesson.sourceRef?.page ?? -1));
  check(
    `[${label}] source pages are inside the inspected ${book.bookPages}-page book`,
    sourcePages.every((page) => page > 0 && page <= book.bookPages),
    sourcePages.filter((p) => !(p > 0 && p <= book.bookPages)).join(', '),
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
    `[${label}] every lesson can start with zero model quota`,
    noNoorLines.length === 0,
    noNoorLines.join(', '),
  );

  const titles = new Set(lessons.map((lesson) => lesson.titleAr));
  check(`[${label}] no two lessons share a title`, titles.size === lessons.length);
}

console.log(`\nTERM 1 BOOK COVERAGE SUMMARY: ${passed} PASSED, ${failed} FAILED\n`);
process.exit(failed === 0 ? 0 : 1);
