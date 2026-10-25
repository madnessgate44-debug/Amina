/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Exam Engine v1.
 *
 * The engine turns the parent-entered exam calendar into a study plan. It only
 * ever uses real inputs: exam dates the parent typed, official curriculum
 * concepts for the exam's subject, and mastery evidence the learner actually
 * produced. It never invents dates, topics or content.
 */

import { ExamEntry, UpcomingExam } from './examCalendar';

/** How urgent an exam is, used to rank it against other work. */
export type ExamUrgency = 'today' | 'imminent' | 'soon' | 'later';

/** A concept worth studying for an exam, with the reason it was chosen. */
export interface ExamFocusConcept {
  conceptId: string;
  lessonId: string;
  titleAr: string;
  titleEn: string;
  /** Mastery score 0..1, or null when there is no evidence yet. */
  score: number | null;
  /** Confidence 0..1, or null when there is no evidence yet. */
  confidence: number | null;
  /** Source page from the official curriculum, when known. */
  page: number | string | null;
  /** Why this concept is on the list. */
  reason: 'no_evidence' | 'weak' | 'unpracticed' | 'steady';
}

/** One day of the exam plan. */
export interface ExamStudyDay {
  /** Local calendar day, YYYY-MM-DD. */
  date: string;
  daysUntilExam: number;
  concepts: ExamFocusConcept[];
  /** Minutes of focused study suggested for this day. */
  minutes: number;
}

/** The full plan for one exam. */
export interface ExamPlan {
  exam: ExamEntry;
  daysUntil: number;
  urgency: ExamUrgency;
  /** Concepts ranked most-urgent-first, capped for a short session. */
  focus: ExamFocusConcept[];
  /** Ordered study days up to the exam. Empty when the exam is today. */
  days: ExamStudyDay[];
  /** Total concepts with no evidence at all for this subject. */
  uncoveredConceptCount: number;
  /** Total official concepts for the subject. */
  totalConceptCount: number;
}

/** A short, teachable card derived from official curriculum content. */
export interface TeacherCard {
  id: string;
  conceptId: string;
  lessonId: string;
  subjectId: string;
  kind: 'concept' | 'practice';
  titleAr: string;
  titleEn: string;
  /** Concept explanation, taken verbatim from the official source text. */
  bodyAr: string;
  bodyEn: string;
  keyPointsAr: string[];
  keyPointsEn: string[];
  /** A practice question and its expected answer, when the lesson has one. */
  question?: string;
  expectedAnswer?: string;
  options?: string[];
  /** Provenance so a card is never mistaken for invented content. */
  source: {
    bookAr: string;
    bookEn: string;
    unit: string;
    lesson: string;
    page: number | string | null;
  };
  /** Present when this card is recommended for an upcoming exam. */
  examContext?: {
    examId: string;
    daysUntil: number;
  };
}
