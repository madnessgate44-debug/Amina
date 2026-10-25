/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Exam Engine v1 — pure planning helpers.
 *
 * Everything here is a pure function of real inputs: parent-entered exams,
 * official curriculum concepts, and stored mastery records. No clock is read
 * except through an explicit `now` argument, so the plan is testable.
 */

import { ExamEntry } from '../../types/examCalendar';
import { MasteryRecord } from '../../types/mastery';
import { OfficialCurriculumLesson, CurriculumLessonConcept } from '../../types/teachingSession';
import {
  ExamFocusConcept,
  ExamPlan,
  ExamStudyDay,
  ExamUrgency,
  TeacherCard,
} from '../../types/examEngine';
import { localDateStr } from '../../utils/time';

/** A concept below this score is treated as weak and gets priority. */
export const WEAK_SCORE_THRESHOLD = 0.6;

/** Concepts per study day, so a plan stays a short, doable session. */
export const CONCEPTS_PER_DAY = 3;

/** Suggested minutes per concept. */
export const MINUTES_PER_CONCEPT = 12;

/** Concepts are ranked in this order; lower sorts first. */
const REASON_ORDER: Record<ExamFocusConcept['reason'], number> = {
  no_evidence: 0,
  weak: 1,
  unpracticed: 2,
  steady: 3,
};

/**
 * Resolves an exam's `subjectId` to the official curriculum's subject id.
 *
 * Exam entries are parent-entered, so the stored id may be `subj_math` or
 * `math`, and a parent may type a name. Matching is explicit and conservative:
 * an exact id, then a normalised id, then a subject name. When nothing
 * matches, the id is returned unchanged so the caller can see the mismatch
 * instead of silently planning nothing.
 */
export function resolveSubjectId(
  subjectId: string,
  lessons: OfficialCurriculumLesson[]
): string {
  const raw = (subjectId || '').trim();
  if (!raw) return raw;

  const known = new Map<string, OfficialCurriculumLesson>();
  for (const l of lessons) known.set(l.subjectId, l);

  if (known.has(raw)) return raw;

  const bare = raw.replace(/^subj_/, '').toLowerCase();
  for (const id of known.keys()) {
    if (id.replace(/^subj_/, '').toLowerCase() === bare) return id;
  }

  const lower = raw.toLowerCase();
  for (const l of known.values()) {
    if (
      l.subjectNameEn.toLowerCase() === lower ||
      l.subjectNameAr === raw ||
      (l.subjectNameFr || '').toLowerCase() === lower
    ) {
      return l.subjectId;
    }
  }
  return raw;
}

export function getExamUrgency(daysUntil: number): ExamUrgency {
  if (daysUntil <= 0) return 'today';
  if (daysUntil <= 2) return 'imminent';
  if (daysUntil <= 7) return 'soon';
  return 'later';
}

/** Local date string for `dayOffset` days after `from`'s local date. */
function datePlusDays(from: Date, dayOffset: number): string {
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate() + dayOffset);
  return localDateStr(d);
}

/**
 * Ranks a lesson's concepts for exam study.
 *
 * A concept with no evidence is ranked above a weak concept, because an
 * untouched topic is a bigger risk than a partly-known one. Within a bucket,
 * lower scores come first.
 */
export function rankConceptsForExam(
  lesson: OfficialCurriculumLesson,
  mastery: MasteryRecord[]
): ExamFocusConcept[] {
  const byConcept = new Map(mastery.map((r) => [r.conceptId, r]));

  const focus: ExamFocusConcept[] = lesson.concepts.map((concept) => {
    const record = byConcept.get(concept.id);
    let reason: ExamFocusConcept['reason'];
    if (!record || record.evidenceCount === 0) {
      reason = 'no_evidence';
    } else if (record.score < WEAK_SCORE_THRESHOLD) {
      reason = 'weak';
    } else {
      reason = 'steady';
    }
    return {
      conceptId: concept.id,
      lessonId: lesson.id,
      titleAr: concept.titleAr,
      titleEn: concept.titleEn,
      score: record && record.evidenceCount > 0 ? record.score : null,
      confidence: record && record.evidenceCount > 0 ? record.confidence : null,
      page: concept.conceptNumber ? concept.conceptNumber : null,
      reason,
    };
  });

  return focus.sort((a, b) => {
    const byReason = REASON_ORDER[a.reason] - REASON_ORDER[b.reason];
    if (byReason !== 0) return byReason;
    return (a.score ?? 0) - (b.score ?? 0);
  });
}

/**
 * Builds the study plan for one exam.
 *
 * The plan spreads the ranked focus concepts across the days remaining, so a
 * learner with a week left is not told to do everything tonight.
 */
export function buildExamPlan(params: {
  exam: ExamEntry;
  daysUntil: number;
  lessons: OfficialCurriculumLesson[];
  mastery: MasteryRecord[];
  now?: Date;
  conceptsPerDay?: number;
}): ExamPlan {
  const {
    exam,
    daysUntil,
    lessons,
    mastery,
    now = new Date(),
    conceptsPerDay = CONCEPTS_PER_DAY,
  } = params;

  const subjectId = resolveSubjectId(exam.subjectId, lessons);
  const subjectLessons = lessons.filter((l) => l.subjectId === subjectId);

  const ranked: ExamFocusConcept[] = [];
  for (const lesson of subjectLessons) {
    ranked.push(...rankConceptsForExam(lesson, mastery));
  }
  ranked.sort((a, b) => {
    const byReason = REASON_ORDER[a.reason] - REASON_ORDER[b.reason];
    if (byReason !== 0) return byReason;
    return (a.score ?? 0) - (b.score ?? 0);
  });

  const days: ExamStudyDay[] = [];
  const dayCount = Math.max(0, daysUntil);
  for (let i = 0; i < dayCount; i++) {
    const start = i * conceptsPerDay;
    const slice = ranked.slice(start, start + conceptsPerDay);
    if (slice.length === 0) break;
    days.push({
      date: datePlusDays(now, i),
      daysUntilExam: daysUntil - i,
      concepts: slice,
      minutes: slice.length * MINUTES_PER_CONCEPT,
    });
  }

  return {
    exam,
    daysUntil,
    urgency: getExamUrgency(daysUntil),
    focus: ranked.slice(0, conceptsPerDay),
    days,
    uncoveredConceptCount: ranked.filter((c) => c.reason === 'no_evidence').length,
    totalConceptCount: ranked.length,
  };
}

/**
 * Builds the plan for the soonest upcoming exam, or null when none exists.
 * Past exams are already excluded by the caller, so a stale entry never drives
 * a plan.
 */
export function buildNextExamPlan(params: {
  upcoming: { entry: ExamEntry; daysUntil: number }[];
  lessons: OfficialCurriculumLesson[];
  mastery: MasteryRecord[];
  now?: Date;
}): ExamPlan | null {
  const { upcoming, lessons, mastery, now = new Date() } = params;
  const next = upcoming[0];
  if (!next) return null;
  return buildExamPlan({ exam: next.entry, daysUntil: next.daysUntil, lessons, mastery, now });
}

/**
 * Turns a curriculum concept into a teachable card.
 *
 * All text comes verbatim from the official lesson, and the source block
 * carries the book, unit, lesson and page so the card is always traceable.
 */
export function buildConceptCard(params: {
  lesson: OfficialCurriculumLesson;
  concept: CurriculumLessonConcept;
  examContext?: TeacherCard['examContext'];
}): TeacherCard {
  const { lesson, concept, examContext } = params;
  return {
    id: `card_${concept.id}`,
    conceptId: concept.id,
    lessonId: lesson.id,
    subjectId: lesson.subjectId,
    kind: 'concept',
    titleAr: concept.titleAr,
    titleEn: concept.titleEn,
    bodyAr: concept.sourceText,
    bodyEn: concept.sourceText,
    keyPointsAr: concept.keyPoints,
    keyPointsEn: concept.keyPoints,
    source: {
      bookAr: lesson.sourceRef.bookAr,
      bookEn: lesson.sourceRef.bookEn,
      unit: lesson.unitNameAr,
      lesson: lesson.titleAr,
      page: lesson.sourceRef.page ?? null,
    },
    examContext,
  };
}

/**
 * Turns the first usable exercise of a lesson into a practice card for a
 * concept. Returns null when the lesson has no exercise with a known answer,
 * so the engine never presents an unanswerable question.
 */
export function buildPracticeCard(params: {
  lesson: OfficialCurriculumLesson;
  concept: CurriculumLessonConcept;
  examContext?: TeacherCard['examContext'];
}): TeacherCard | null {
  const { lesson, concept, examContext } = params;
  const exercise = lesson.exercises.find((e) => (e.expectedAnswer || '').trim().length > 0);
  if (!exercise) return null;

  return {
    id: `card_${concept.id}_practice`,
    conceptId: concept.id,
    lessonId: lesson.id,
    subjectId: lesson.subjectId,
    kind: 'practice',
    titleAr: concept.titleAr,
    titleEn: concept.titleEn,
    bodyAr: concept.sourceText,
    bodyEn: concept.sourceText,
    keyPointsAr: concept.keyPoints,
    keyPointsEn: concept.keyPoints,
    question: exercise.question,
    expectedAnswer: exercise.expectedAnswer,
    options: exercise.options,
    source: {
      bookAr: lesson.sourceRef.bookAr,
      bookEn: lesson.sourceRef.bookEn,
      unit: lesson.unitNameAr,
      lesson: lesson.titleAr,
      page: exercise.page ?? lesson.sourceRef.page ?? null,
    },
    examContext,
  };
}

/**
 * Cards for a whole exam plan: one concept card per focus concept, plus a
 * practice card when the lesson has a usable exercise.
 */
export function buildExamCards(params: {
  plan: ExamPlan;
  lessons: OfficialCurriculumLesson[];
}): TeacherCard[] {
  const { plan, lessons } = params;
  const byLesson = new Map(lessons.map((l) => [l.id, l]));
  const cards: TeacherCard[] = [];
  const examContext = { examId: plan.exam.id, daysUntil: plan.daysUntil };

  for (const focus of plan.focus) {
    const lesson = byLesson.get(focus.lessonId);
    if (!lesson) continue;
    const concept = lesson.concepts.find((c) => c.id === focus.conceptId);
    if (!concept) continue;
    cards.push(buildConceptCard({ lesson, concept, examContext }));
    const practice = buildPracticeCard({ lesson, concept, examContext });
    if (practice) cards.push(practice);
  }
  return cards;
}
