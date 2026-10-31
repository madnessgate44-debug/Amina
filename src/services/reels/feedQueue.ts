/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Feed queue builder.
 *
 * buildFeedQueue() assembles a session of reels from four pools:
 *   40% due review, 30% today's school lessons, 20% exam topics, 10% curiosity.
 *
 * Rules enforced (each is asserted by the test suite):
 *   1. the first reel is a sure win (a question the child can get right, or a
 *      teach/story reel when no fair question exists);
 *   2. never the same kind twice in a row;
 *   3. after 2 wrong answers on one concept, insert a teach_card then a retry;
 *   4. the queue ends with a win_closer at the session length;
 *   5. never dead-end: if a pool is empty the queue refills from mastery gaps.
 *
 * Everything is seeded, so the same inputs give the same queue.
 */

import { OfficialCurriculumLesson } from '../../types/teachingSession';
import { Language } from '../../types';
import { Reel, ReelReason } from '../../types/reel';
import { MasteryRecord } from '../../types/mastery';
import { SpacedReviewSchedule } from '../../types/spacedReview';
import { UpcomingExam } from '../../types/examCalendar';
import { curriculumService } from '../curriculum/curriculumService';
import { buildReelsForConcept, buildWinCloser, sourceLabelFor } from './reelGenerator';
import { createSeededRng } from './seededRng';

export interface FeedQueueInput {
  studentId: string;
  language: Language;
  /** Mastery by conceptId for the current student. */
  mastery: Record<string, MasteryRecord>;
  /** Reviews that are due or overdue. */
  dueReviews: SpacedReviewSchedule[];
  /** Subject names (lowercased) covered at school today. */
  todaySubjects: string[];
  /** Today's lessons covered, when a day record exists. */
  todayLessonIds?: string[];
  /** Parent-entered exams with days remaining. */
  examCalendar?: UpcomingExam[];
  now?: Date;
  /** Target session length in minutes. */
  sessionMinutes: number;
  /** Seconds per reel; 30-45s per the spec. */
  secondsPerReel?: number;
}

export interface FeedQueue {
  reels: Reel[];
  /** Which pool each reel came from, for debugging and the audit. */
  composition: Record<ReelReason, number>;
  seed: string;
}

const DEFAULT_SECONDS_PER_REEL = 40;

/** Lower mastery first, so gaps surface. */
function lowestMasteryConceptIds(mastery: Record<string, MasteryRecord>, limit: number): string[] {
  return Object.values(mastery)
    .slice()
    .sort((a, b) => a.score - b.score)
    .slice(0, limit)
    .map((m) => m.conceptId);
}

function reelsForLesson(
  lesson: OfficialCurriculumLesson,
  lang: Language,
  reason: ReelReason,
  maxConcepts = 1
): Reel[] {
  const out: Reel[] = [];
  const concepts = lesson.concepts.slice(0, maxConcepts);
  for (const concept of concepts) {
    out.push(...buildReelsForConcept(lesson, concept, lang, { reason }));
  }
  return out;
}

/** Picks the first reel that gives the child a fair, winnable start. */
function firstSureWin(pools: Reel[][], lang: Language): Reel | undefined {
  for (const pool of pools) {
    for (const reel of pool) {
      // Prefer a question the child can answer; fall back to any reel.
      if (reel.options && reel.options.some((o) => o.isCorrect)) return reel;
    }
  }
  for (const pool of pools) {
    if (pool.length) return pool[0];
  }
  return undefined;
}

/**
 * Rotates a list left by `n`, wrapping. A session only consumes the first few
 * reels of a pool, so without rotation the tail of a subject (e.g. the four
 * misconception-bearing maths lessons, last in file order) is never reached.
 * Rotating by the day index makes the whole subject reachable over sessions.
 */
function rotateBy<T>(arr: T[], n: number): T[] {
  if (arr.length === 0) return arr;
  const k = ((n % arr.length) + arr.length) % arr.length;
  return arr.slice(k).concat(arr.slice(0, k));
}

/**
 * Round-robins several reel lists into one, taking the first reel of each list,
 * then the second of each, and so on. Each lesson yields ~6 reels, but a
 * session consumes only a handful, so plain concatenation would show one lesson
 * in depth and never reach the rest of the subject. Interleaving gives breadth
 * first, which is what makes every lesson (and its misconception reels) reachable.
 */
function interleave<T>(lists: T[][]): T[] {
  const out: T[] = [];
  const max = lists.reduce((m, l) => Math.max(m, l.length), 0);
  for (let i = 0; i < max; i++) {
    for (const list of lists) {
      if (i < list.length) out.push(list[i]);
    }
  }
  return out;
}

export function buildFeedQueue(input: FeedQueueInput): FeedQueue {
  const lang = input.language;
  const now = input.now || new Date();
  const perReel = input.secondsPerReel || DEFAULT_SECONDS_PER_REEL;
  const seed = `${input.studentId}|${now.toISOString().slice(0, 10)}|${lang}|${input.sessionMinutes}`;
  const rng = createSeededRng(seed);

  const targetCount = Math.max(4, Math.round((input.sessionMinutes * 60) / perReel));

  // ---- pool 1: due review ----
  const reviewPool: Reel[] = [];
  for (const review of input.dueReviews) {
    const found = curriculumService.getConceptById(review.conceptId);
    if (!found) continue;
    reviewPool.push(...buildReelsForConcept(found.lesson, found.concept, lang, { reason: 'due_review' }));
  }

  // ---- pool 2: today's school lessons ----
  const todayPool: Reel[] = [];
  const lessons = curriculumService.getAvailableLessons();
  const subjectSet = new Set((input.todaySubjects || []).map((s) => s.toLowerCase()));
  const lessonIdSet = new Set(input.todayLessonIds || []);
  const matchedToday = lessons.filter(
    (l) =>
      lessonIdSet.has(l.id) ||
      subjectSet.has(l.subjectNameEn.toLowerCase()) ||
      subjectSet.has(l.subjectNameAr.toLowerCase())
  );
  // Rotate the day's lessons by the day index so the tail of a long subject
  // (where the misconception-bearing maths lessons live) is reached over days.
  const dayIndex = Math.floor(now.getTime() / 86_400_000);
  const todayLessons = rotateBy(matchedToday, dayIndex);
  for (const lesson of todayLessons) {
    todayPool.push(...reelsForLesson(lesson, lang, 'today_lesson'));
  }

  // ---- pool 3: exam topics ----
  const examPool: Reel[] = [];
  for (const exam of input.examCalendar || []) {
    const subjectLessons = lessons.filter((l) => l.subjectId === exam.entry.subjectId);
    for (const lesson of rotateBy(subjectLessons, dayIndex)) {
      examPool.push(...reelsForLesson(lesson, lang, 'exam_topic'));
    }
  }

  // ---- pool 4: curiosity wildcard (deterministic pick from remaining) ----
  const curiosityPool: Reel[] = [];
  const usedLessonIds = new Set([...todayLessons.map((l) => l.id), ...(input.examCalendar || []).flatMap((e) => lessons.filter((l) => l.subjectId === e.entry.subjectId).map((l) => l.id))]);
  const wildcardLessons = lessons.filter((l) => !usedLessonIds.has(l.id));
  const shuffledWild = rng.shuffle(wildcardLessons);
  for (const lesson of shuffledWild.slice(0, 3)) {
    curiosityPool.push(...reelsForLesson(lesson, lang, 'curiosity'));
  }

  // ---- refill pool: mastery gaps (never dead-end) ----
  const refillPool: Reel[] = [];
  for (const conceptId of lowestMasteryConceptIds(input.mastery, 8)) {
    const found = curriculumService.getConceptById(conceptId);
    if (!found) continue;
    refillPool.push(...buildReelsForConcept(found.lesson, found.concept, lang, { reason: 'refill' }));
  }

  const quota = {
    due_review: Math.round(targetCount * 0.4),
    today_lesson: Math.round(targetCount * 0.3),
    exam_topic: Math.round(targetCount * 0.2),
    curiosity: Math.round(targetCount * 0.1),
  } as Record<string, number>;

  const poolByReason: Record<ReelReason, Reel[]> = {
    due_review: reviewPool,
    today_lesson: todayPool,
    exam_topic: examPool,
    curiosity: curiosityPool,
    refill: refillPool,
    closer: [],
  };

  const cursors: Record<string, number> = { due_review: 0, today_lesson: 0, exam_topic: 0, curiosity: 0, refill: 0 };
  const composition: Record<ReelReason, number> = {
    due_review: 0,
    today_lesson: 0,
    exam_topic: 0,
    curiosity: 0,
    refill: 0,
    closer: 0,
  };

  const chosen: Reel[] = [];
  const order: ReelReason[] = ['due_review', 'today_lesson', 'exam_topic', 'curiosity'];

  const takeFrom = (reason: ReelReason): Reel | undefined => {
    const pool = poolByReason[reason];
    while (cursors[reason] < pool.length) {
      const candidate = pool[cursors[reason]++];
      const last = chosen[chosen.length - 1];
      if (last && last.kind === candidate.kind) continue; // rule 2: no repeat kind
      return candidate;
    }
    return undefined;
  };

  for (const reason of order) {
    for (let i = 0; i < quota[reason]; i++) {
      const reel = takeFrom(reason);
      if (reel) {
        chosen.push(reel);
        composition[reason]++;
      } else {
        const refill = takeFrom('refill');
        if (refill) {
          chosen.push(refill);
          composition.refill++;
        }
      }
    }
  }

  // Top up to the target count from any remaining pool (still no repeat kind).
  const anyOrder: ReelReason[] = ['due_review', 'today_lesson', 'exam_topic', 'curiosity', 'refill'];
  let guard = 0;
  while (chosen.length < targetCount && guard++ < 200) {
    let added = false;
    for (const reason of anyOrder) {
      if (chosen.length >= targetCount) break;
      const reel = takeFrom(reason);
      if (reel) {
        chosen.push(reel);
        composition[reason]++;
        added = true;
      }
    }
    if (!added) break;
  }

  // Rule 1: the first reel must be a sure win. Swap the first winnable reel in.
  const sureWin = firstSureWin(
    [chosen.filter((r) => r.options), chosen],
    lang
  );
  if (sureWin && chosen.length && chosen[0].id !== sureWin.id) {
    const at = chosen.findIndex((r) => r.id === sureWin.id);
    if (at > 0) {
      const [reel] = chosen.splice(at, 1);
      chosen.unshift(reel);
    }
  }

  // Rule 4: end with a win_closer.
  const lastReel = chosen[chosen.length - 1];
  const closerSubject = lastReel?.subjectName || (lang === 'ar' ? 'نور' : 'Noor');
  const closerSource = lastReel?.sourceLabel || sourceLabelFor(curriculumService.getAvailableLessons()[0] || ({} as OfficialCurriculumLesson));
  chosen.push(buildWinCloser(lang, closerSubject, closerSource, chosen.length));
  composition.closer = 1;

  return { reels: chosen, composition, seed };
}

/**
 * Applies rule 3 at runtime: given the concepts the child just got wrong twice
 * in a row, returns the teach_card + retry reels to splice in next.
 */
export function buildRetryAfterMistakes(
  conceptId: string,
  lang: Language
): Reel[] {
  const found = curriculumService.getConceptById(conceptId);
  if (!found) return [];
  const reels = buildReelsForConcept(found.lesson, found.concept, lang, {
    reason: 'refill',
    seedExtra: 'retry',
  });
  const teach = reels.find((r) => r.kind === 'teach_card');
  const retry = reels.find((r) => r.kind === 'quick_choice') || reels.find((r) => r.options);
  return [teach, retry].filter((r): r is Reel => Boolean(r));
}
