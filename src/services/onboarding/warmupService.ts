/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Warm-up quiz builder for onboarding (step 3).
 *
 * Noor asks three quick questions drawn from REAL curriculum exercises across
 * three different subjects. Nothing is invented: every question comes from a
 * lesson's own `exercises` array, and a question is only used when its answer
 * can be resolved unambiguously (the expected answer appears exactly once in
 * the options).
 *
 * Results are recorded through the existing mastery/evidence API by the
 * caller; this module only builds and grades questions.
 */

import { curriculumService } from '../curriculum/curriculumService';
import { OfficialCurriculumLesson, CurriculumExercise } from '../../types/teachingSession';
import { Language } from '../../types';

export interface WarmupQuestion {
  conceptId: string;
  lessonId: string;
  subjectId: string;
  subjectName: string;
  prompt: string;
  options: string[];
  /** Index into `options` of the single correct choice. */
  correctIndex: number;
  sourceLabel: string;
}

function subjectName(lesson: OfficialCurriculumLesson, lang: Language): string {
  if (lang === 'ar') return lesson.subjectNameAr;
  if (lang === 'fr') return lesson.subjectNameFr || lesson.subjectNameEn;
  return lesson.subjectNameEn;
}

function sourceLabel(lesson: OfficialCurriculumLesson): string {
  const ref = lesson.sourceRef;
  const book = ref?.bookEn || ref?.book || '';
  const page = ref?.page;
  return page !== undefined && page !== null && page !== '' ? `${book} p. ${page}` : book;
}

/**
 * Resolves a curriculum exercise into a tap-one-answer question.
 * Returns null when the exercise cannot be turned into a fair question:
 * no options, no expected answer, or an answer that is not among the options.
 */
export function toWarmupQuestion(
  lesson: OfficialCurriculumLesson,
  exercise: CurriculumExercise,
  lang: Language
): WarmupQuestion | null {
  const options = exercise.options;
  if (!options || options.length < 2) return null;
  if (exercise.expectedAnswer === undefined || exercise.expectedAnswer === null) return null;

  const expected = String(exercise.expectedAnswer).trim();
  const matches = options.filter((o) => String(o).trim() === expected);
  // Ambiguous (duplicate options) or unresolvable: skip rather than guess.
  if (matches.length !== 1) return null;

  const correctIndex = options.findIndex((o) => String(o).trim() === expected);
  const concept = lesson.concepts?.[0];
  if (!concept) return null;

  return {
    conceptId: concept.id,
    lessonId: lesson.id,
    subjectId: lesson.subjectId,
    subjectName: subjectName(lesson, lang),
    prompt: exercise.question,
    options: options.map((o) => String(o)),
    correctIndex,
    sourceLabel: sourceLabel(lesson),
  };
}

/** Deterministic PRNG (mulberry32). Small, dependency-free, seedable. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle<T>(input: T[], rand: () => number): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Builds `count` warm-up questions from `count` distinct subjects.
 *
 * Deterministic given the same seed: the same child sees the same warm-up if
 * they restart onboarding, and tests are reproducible. Subjects are chosen by
 * seeded shuffle so a child is not always asked about the same three books.
 */
export function buildWarmupQuestions(
  lang: Language,
  count = 3,
  seed = 1,
  lessons: OfficialCurriculumLesson[] = curriculumService.getAllLessons()
): WarmupQuestion[] {
  const rand = mulberry32(seed);

  // Group usable questions by subject.
  const bySubject = new Map<string, WarmupQuestion[]>();
  for (const lesson of lessons) {
    for (const exercise of lesson.exercises || []) {
      const q = toWarmupQuestion(lesson, exercise, lang);
      if (!q) continue;
      if (!bySubject.has(q.subjectId)) bySubject.set(q.subjectId, []);
      bySubject.get(q.subjectId)!.push(q);
    }
  }

  const subjectIds = shuffle([...bySubject.keys()], rand);
  const out: WarmupQuestion[] = [];
  for (const subjectId of subjectIds) {
    if (out.length >= count) break;
    const pool = shuffle(bySubject.get(subjectId)!, rand);
    if (pool.length) out.push(pool[0]);
  }
  return out;
}
