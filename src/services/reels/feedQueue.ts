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
import { subjectLabelMatchesLesson } from '../curriculum/subjectIdentity';
import { buildReelsForConcept, buildWinCloser, sourceLabelFor } from './reelGenerator';
import { matchMisconception, misconceptionText } from '../teaching/skills/teachingSkills';
import { speaksLanguage } from './reelResponse';
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
  dayIndex = 0,
  maxConcepts = 1
): Reel[] {
  const out: Reel[] = [];
  // A lesson can carry several concepts, but a session consumes only the first
  // few reels of a pool, so slicing to the first concept left the rest of every
  // multi-concept lesson unreachable from the feed. Rotating the concepts by the
  // day index (the same trick used for lessons) makes them all reachable over
  // days while keeping each pool's size unchanged.
  const concepts = rotateBy(lesson.concepts, dayIndex).slice(0, maxConcepts);
  for (const concept of concepts) {
    out.push(...buildReelsForConcept(lesson, concept, lang, { reason }));
  }
  return out;
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
  const reviewLists: Reel[][] = [];
  for (const review of input.dueReviews) {
    const found = curriculumService.getConceptById(review.conceptId);
    if (!found) continue;
    reviewLists.push(buildReelsForConcept(found.lesson, found.concept, lang, { reason: 'due_review' }));
  }
  const reviewPool = interleave(reviewLists);

  // ---- pool 2: today's school lessons ----
  const todayLists: Reel[][] = [];
  const lessons = curriculumService.getAvailableLessons();
  const todaySubjectLabels = input.todaySubjects || [];
  const lessonIdSet = new Set(input.todayLessonIds || []);
  // Match a lesson to today's subjects through the canonical identity, not an
  // exact string compare. A day record stores the timetable's display labels
  // ("الرياضيات بالفرنسية (Maths)") and the server's parser writes the same
  // shape, while a lesson carries "الرياضيات"; an exact match silently found
  // nothing, so a French child whose day was French maths got no today's-lesson
  // pool at all and the feed collapsed to the diagnosis + closer reels.
  const matchedToday = lessons.filter(
    (l) =>
      lessonIdSet.has(l.id) ||
      todaySubjectLabels.some((label) => subjectLabelMatchesLesson(label, l))
  );
  // Rotate the day's lessons by the day index so the tail of a long subject
  // (where the misconception-bearing maths lessons live) is reached over days.
  const dayIndex = Math.floor(now.getTime() / 86_400_000);
  const todayLessons = rotateBy(matchedToday, dayIndex);
  for (const lesson of todayLessons) {
    todayLists.push(reelsForLesson(lesson, lang, 'today_lesson', dayIndex));
  }
  const todayPool = interleave(todayLists);

  // ---- pool 3: exam topics ----
  const examLists: Reel[][] = [];
  for (const exam of input.examCalendar || []) {
    const subjectLessons = lessons.filter((l) => l.subjectId === exam.entry.subjectId);
    for (const lesson of rotateBy(subjectLessons, dayIndex)) {
      examLists.push(reelsForLesson(lesson, lang, 'exam_topic', dayIndex));
    }
  }
  const examPool = interleave(examLists);

  // ---- pool 4: curiosity wildcard (deterministic pick from remaining) ----
  const curiosityLists: Reel[][] = [];
  const usedLessonIds = new Set([...todayLessons.map((l) => l.id), ...(input.examCalendar || []).flatMap((e) => lessons.filter((l) => l.subjectId === e.entry.subjectId).map((l) => l.id))]);
  const wildcardLessons = lessons.filter((l) => !usedLessonIds.has(l.id));
  const shuffledWild = rng.shuffle(wildcardLessons);
  // On a first feed the wildcard pool is the ONLY pool with content: a fresh
  // child has no day record, no mastery and no due reviews, so nothing fills
  // the 40/30/20/10 pools. A fixed cap of 3 lessons starved that session —
  // measured 8 reels in Arabic and 4 in French against the 15-reel target of a
  // 10-minute session. Build enough wildcard lessons to fill the session; the
  // pools that are already full are unaffected because the wildcard only ever
  // tops up.
  for (const lesson of shuffledWild.slice(0, Math.max(3, targetCount))) {
    curiosityLists.push(reelsForLesson(lesson, lang, 'curiosity', dayIndex));
  }
  const curiosityPool = interleave(curiosityLists);

  // ---- refill pool: mastery gaps (never dead-end) ----
  const refillLists: Reel[][] = [];
  for (const conceptId of lowestMasteryConceptIds(input.mastery, 8)) {
    const found = curriculumService.getConceptById(conceptId);
    if (!found) continue;
    refillLists.push(buildReelsForConcept(found.lesson, found.concept, lang, { reason: 'refill' }));
  }
  const refillPool = interleave(refillLists);

  // ---- diagnosis pool: misconception-bearing concepts (R6) ----
  // The deterministic diagnosis path is the most teacher-like behaviour in the
  // app, but it only fires when a reel carries an option the curriculum's
  // `misconceptions` can name. Those concepts live in the maths lessons, which
  // the 40/30/20/10 pools reached only by seed luck (measured: an Arabic child
  // got 0 of them in a whole session). This pool guarantees at least one such
  // reel is queued, in the child's own language: the stored diagnosis is only
  // served when its script matches the child's, so a concept whose entries are
  // all the other script would degrade to the model and is not offered here.
  const diagnosisLists: Reel[][] = [];
  for (const lesson of lessons) {
    for (const concept of lesson.concepts) {
      if (!concept.misconceptions || concept.misconceptions.length === 0) continue;
      const servable = concept.misconceptions.some((m) =>
        speaksLanguage(misconceptionText(m, lang), lang)
      );
      if (!servable) continue;
      const reels = buildReelsForConcept(lesson, concept, lang, { reason: 'diagnosis' });
      // Keep only reels whose wrong options a stored misconception can name, so
      // the diagnosis path is genuinely reachable, not merely theoretically so.
      const diagnosable = reels.filter(
        (r) =>
          r.options?.some((o) => !o.isCorrect && matchMisconception(o.text, concept.misconceptions))
      );
      if (diagnosable.length) diagnosisLists.push(diagnosable);
    }
  }
  const diagnosisPool = interleave(rotateBy(diagnosisLists, dayIndex));

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
    diagnosis: diagnosisPool,
    closer: [],
  };

  const cursors: Record<string, number> = { due_review: 0, today_lesson: 0, exam_topic: 0, curiosity: 0, refill: 0, diagnosis: 0 };
  const composition: Record<ReelReason, number> = {
    due_review: 0,
    today_lesson: 0,
    exam_topic: 0,
    curiosity: 0,
    refill: 0,
    diagnosis: 0,
    closer: 0,
  };

  const chosen: Reel[] = [];
  const order: ReelReason[] = ['due_review', 'today_lesson', 'exam_topic', 'curiosity'];

  // Same-kind candidates are deferred, not discarded: a pool interleaved across
  // lessons puts equal kinds next to each other, and dropping them there would
  // shrink the session instead of just reordering it.
  const pending: Record<string, Reel[]> = { due_review: [], today_lesson: [], exam_topic: [], curiosity: [], refill: [], diagnosis: [] };

  const takeFrom = (reason: ReelReason): Reel | undefined => {
    // Rule 2: no reel kind twice in a row. Breadth rule: a lesson may appear at
    // most twice in a row. The second rule is what keeps a session from showing
    // one lesson's whole reel set back-to-back; it became load-bearing once the
    // generator started dropping wrong-script reels, which can leave one lesson
    // as the only source left in a pool.
    const fits = (reel: Reel): boolean => {
      const n = chosen.length;
      if (n === 0) return true;
      const last = chosen[n - 1];
      if (last.kind === reel.kind) return false;
      return !(n >= 2 && chosen[n - 2].lessonId === reel.lessonId && last.lessonId === reel.lessonId);
    };

    const deferred = pending[reason];
    for (let i = 0; i < deferred.length; i++) {
      if (fits(deferred[i])) return deferred.splice(i, 1)[0];
    }
    const pool = poolByReason[reason];
    while (cursors[reason] < pool.length) {
      const candidate = pool[cursors[reason]++];
      if (!fits(candidate)) {
        deferred.push(candidate); // retry after a different kind / lesson
        continue;
      }
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

  // Rule 1: the first reel must be a sure win. Move a winnable reel in — but
  // only a move that keeps rule 2 (no repeat kind back-to-back) intact. The
  // old unconditional swap could bring two same-kind reels together, and the
  // child then saw two identical cards in a row.
  const isSureWin = (r: Reel) => Boolean(r.options && r.options.some((o) => o.isCorrect));
  const swapKeepsKindsDistinct = (arr: Reel[], from: number): boolean => {
    const copy = arr.slice();
    const [reel] = copy.splice(from, 1);
    copy.unshift(reel);
    for (let i = 1; i < copy.length; i++) {
      if (copy[i].kind === copy[i - 1].kind) return false;
    }
    return true;
  };
  if (chosen.length && !isSureWin(chosen[0])) {
    for (const candidate of chosen) {
      if (!isSureWin(candidate)) continue;
      const at = chosen.findIndex((r) => r.id === candidate.id);
      if (at > 0 && swapKeepsKindsDistinct(chosen, at)) {
        const [reel] = chosen.splice(at, 1);
        chosen.unshift(reel);
        break;
      }
    }
  }

  // Rule 6: guarantee the diagnosis path is reachable. A session must contain at
  // least one reel whose wrong option a stored misconception can name, or the
  // most teacher-like behaviour in the app is never met by the child. The reel is
  // slotted where it repeats neither the neighbouring kind (rule 2) nor the
  // neighbouring lesson (breadth), and never duplicates a reel already queued.
  if (!chosen.some((r) => r.reason === 'diagnosis')) {
    const fits = (i: number, candidate: Reel, strictLesson: boolean): boolean => {
      const prev = i > 0 ? chosen[i - 1] : undefined;
      const next = i < chosen.length ? chosen[i] : undefined;
      if (prev?.kind === candidate.kind || next?.kind === candidate.kind) return false;
      if (strictLesson && (prev?.lessonId === candidate.lessonId || next?.lessonId === candidate.lessonId)) return false;
      return true;
    };
    // Try each diagnosis reel until one can be slotted where it repeats neither
    // the neighbouring kind (rule 2, hard) nor the neighbouring lesson
    // (breadth, soft). A candidate whose kind collides everywhere (e.g. the
    // pool leads with hook_question and every slot neighbours one) is skipped in
    // favour of one whose kind fits — appending it unconditionally is what put
    // two same-kind reels back-to-back and broke rule 2.
    const candidates = diagnosisPool.filter((r) => !chosen.some((c) => c.id === r.id));
    let placed = false;
    for (const candidate of candidates) {
      let at = chosen.findIndex((_, i) => i >= 1 && fits(i, candidate, true));
      if (at < 0) at = chosen.findIndex((_, i) => i >= 1 && fits(i, candidate, false));
      if (at < 0) continue;
      chosen.splice(at, 0, candidate);
      composition.diagnosis++;
      placed = true;
      break;
    }
    if (!placed && candidates.length) {
      // Last resort: append, but only when it does not repeat the final kind.
      const candidate = candidates[0];
      const last = chosen[chosen.length - 1];
      if (!last || last.kind !== candidate.kind) {
        chosen.push(candidate);
        composition.diagnosis++;
      }
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
