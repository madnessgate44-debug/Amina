/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Exam calendar service.
 *
 * Pure helpers (testable without storage) plus storage-backed CRUD. Dates are
 * compared as local calendar days so a device timezone never shifts "exam in
 * N days" by one.
 */

import { ExamEntry, ExamCalendar, UpcomingExam } from '../../types/examCalendar';
import { IStorageService } from '../storage/IStorageService';
import { localDateStr } from '../../utils/time';

/** Whole calendar days from `from`'s local date to `to`'s local date. */
export function daysBetweenLocalDates(from: Date, to: string): number {
  const [y, m, d] = to.split('-').map(Number);
  const target = new Date(y, (m || 1) - 1, d || 1);
  const start = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  return Math.round((target.getTime() - start.getTime()) / (1000 * 3600 * 24));
}

/**
 * Exams on or after `now`, soonest first. Past exams are dropped so a stale
 * entry never drives the feed. Entries without a parseable date are ignored
 * rather than guessed.
 */
export function getUpcomingExams(
  entries: ExamEntry[],
  now: Date = new Date(),
  horizonDays = 60
): UpcomingExam[] {
  const out: UpcomingExam[] = [];
  for (const entry of entries) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.date || '')) continue;
    const daysUntil = daysBetweenLocalDates(now, entry.date);
    if (daysUntil < 0 || daysUntil > horizonDays) continue;
    out.push({ entry, daysUntil });
  }
  return out.sort((a, b) => a.daysUntil - b.daysUntil);
}

/** The soonest upcoming exam, or null. */
export function getNextExam(entries: ExamEntry[], now: Date = new Date()): UpcomingExam | null {
  return getUpcomingExams(entries, now)[0] || null;
}

export function createExamEntry(input: {
  studentId: string;
  subjectId: string;
  date: string;
  topic?: string;
}): ExamEntry {
  const nowIso = new Date().toISOString();
  return {
    id: 'exam_' + nowIso + '_' + Math.random().toString(36).slice(2, 8),
    studentId: input.studentId,
    subjectId: input.subjectId,
    date: input.date,
    topic: input.topic?.trim() || undefined,
    createdAt: nowIso,
    updatedAt: nowIso,
  };
}

export function isExamEntryValid(input: { subjectId: string; date: string }): boolean {
  if (!input.subjectId) return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date || '')) return false;
  const [y, m, d] = input.date.split('-').map(Number);
  const parsed = new Date(y, m - 1, d);
  return (
    parsed.getFullYear() === y && parsed.getMonth() === m - 1 && parsed.getDate() === d
  );
}

/** Count of exams falling on the given local date. */
export function countExamsOn(entries: ExamEntry[], date: string): number {
  return entries.filter((e) => e.date === date).length;
}

export class ExamCalendarService {
  async load(studentId: string, storage: IStorageService): Promise<ExamCalendar> {
    const stored = await storage.getExamCalendar(studentId);
    if (stored) return stored;
    const empty: ExamCalendar = { studentId, entries: [], updatedAt: new Date().toISOString() };
    return empty;
  }

  async add(
    studentId: string,
    input: { subjectId: string; date: string; topic?: string },
    storage: IStorageService
  ): Promise<ExamCalendar> {
    if (!isExamEntryValid(input)) {
      throw new Error('Invalid exam entry: subjectId and a real YYYY-MM-DD date are required');
    }
    const calendar = await this.load(studentId, storage);
    const next: ExamCalendar = {
      ...calendar,
      entries: [...calendar.entries, createExamEntry({ studentId, ...input })],
      updatedAt: new Date().toISOString(),
    };
    await storage.saveExamCalendar(next);
    return next;
  }

  async remove(studentId: string, entryId: string, storage: IStorageService): Promise<ExamCalendar> {
    const calendar = await this.load(studentId, storage);
    const next: ExamCalendar = {
      ...calendar,
      entries: calendar.entries.filter((e) => e.id !== entryId),
      updatedAt: new Date().toISOString(),
    };
    await storage.saveExamCalendar(next);
    return next;
  }

  async update(
    studentId: string,
    entryId: string,
    patch: { subjectId?: string; date?: string; topic?: string },
    storage: IStorageService
  ): Promise<ExamCalendar> {
    const calendar = await this.load(studentId, storage);
    const next: ExamCalendar = {
      ...calendar,
      entries: calendar.entries.map((e) =>
        e.id === entryId
          ? {
              ...e,
              ...patch,
              topic: patch.topic !== undefined ? patch.topic.trim() || undefined : e.topic,
              updatedAt: new Date().toISOString(),
            }
          : e
      ),
      updatedAt: new Date().toISOString(),
    };
    await storage.saveExamCalendar(next);
    return next;
  }
}

export const examCalendarService = new ExamCalendarService();

/** Convenience re-export so callers can compare against "today" consistently. */
export { localDateStr };
