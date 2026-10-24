/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Parent-entered exam calendar.
 *
 * Noor derives "exam in N days" from this store for feed ranking and Home.
 * We never invent Ministry or school dates: an entry exists only because a
 * parent typed it.
 */

export interface ExamEntry {
  id: string;
  studentId: string;
  subjectId: string;
  /** Exam date as a local calendar day, YYYY-MM-DD. */
  date: string;
  /** Optional free-text topic the parent wants Noor to prioritise. */
  topic?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExamCalendar {
  studentId: string;
  entries: ExamEntry[];
  updatedAt: string;
}

export interface UpcomingExam {
  entry: ExamEntry;
  /** Whole days from `now`'s local date to the exam date. 0 = today. */
  daysUntil: number;
}
