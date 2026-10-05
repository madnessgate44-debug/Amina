/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Student,
  Timetable,
  AIConversation,
  AppSettings,
  DayRecord,
  MasteryRecord,
  Mission,
  MissionOutcome,
  HomeworkItem,
  HomeworkSubmission,
  DailyReview,
  WeeklyReview,
  SavedItem,
  Collection,
  ParentAccount,
  StudentGamification,
  TeachingSession,
} from '../../types';

export interface IStorageService {
  /**
   * Retrieves the active student profile.
   */
  getStudent(): Promise<Student | null>;

  /**
   * Persists the student profile.
   */
  saveStudent(student: Student): Promise<void>;

  /**
   * Retrieves the student timetable.
   */
  getTimetable(studentId?: string): Promise<Timetable | null>;

  /**
   * Persists the student timetable.
   */
  saveTimetable(timetable: Timetable): Promise<void>;

  /**
   * Retrieves the active AI Companion chat conversation.
   */
  getConversation(studentId?: string): Promise<AIConversation | null>;

  /**
   * Persists the AI Companion conversation.
   */
  saveConversation(conversation: AIConversation): Promise<void>;

  /**
   * Retrieves the confirmed or draft DayRecord for a specified date (defaulting to today YYYY-MM-DD).
   */
  getDayRecord(date: string): Promise<DayRecord | null>;

  /**
   * Persists a DayRecord (draft or confirmed).
   */
  saveDayRecord(record: DayRecord): Promise<void>;

  /**
   * Deletes a DayRecord.
   */
  deleteDayRecord(id: string): Promise<void>;

  /**
   * Retrieves user and demo app settings.
   */
  getSettings(): Promise<AppSettings>;

  /**
   * Persists app settings.
   */
  saveSettings(settings: AppSettings): Promise<void>;

  /**
   * Retrieves a single mastery record by student and concept ID.
   */
  getMasteryRecord(studentId: string, conceptId: string): Promise<MasteryRecord | null>;

  /**
   * Retrieves all mastery records for a student.
   */
  getAllMasteryRecords(studentId: string): Promise<MasteryRecord[]>;

  /**
   * Persists a mastery record.
   */
  saveMasteryRecord(record: MasteryRecord): Promise<void>;

  /**
   * Deletes a single mastery record.
   */
  deleteMasteryRecord(studentId: string, conceptId: string): Promise<void>;

  /**
   * Retrieves all missions for a student on a specific date.
   */
  getMissions(studentId: string, date: string): Promise<Mission[]>;

  /**
   * Persists a mission.
   */
  saveMission(mission: Mission): Promise<void>;

  /**
   * Saves multiple missions at once (e.g. initial plan).
   */
  saveMissions(missions: Mission[]): Promise<void>;

  /**
   * Records a mission outcome.
   */
  saveMissionOutcome(outcome: MissionOutcome): Promise<void>;

  /**
   * Retrieves all homework items for a student, optionally filtered by date.
   */
  getHomeworkItems(studentId: string, date?: string): Promise<HomeworkItem[]>;

  /**
   * Retrieves a single homework item by ID.
   */
  getHomeworkItem(id: string): Promise<HomeworkItem | null>;

  /**
   * Persists a single homework item.
   */
  saveHomeworkItem(item: HomeworkItem): Promise<void>;

  /**
   * Persists multiple homework items.
   */
  saveHomeworkItems(items: HomeworkItem[]): Promise<void>;

  /**
   * Deletes a homework item.
   */
  deleteHomeworkItem(id: string): Promise<void>;

  /**
   * Retrieves homework submission for an item.
   */
  getHomeworkSubmission(homeworkItemId: string, studentId: string): Promise<HomeworkSubmission | null>;

  /**
   * Persists a homework submission (digital or photo).
   */
  saveHomeworkSubmission(submission: HomeworkSubmission): Promise<void>;

  /**
   * Deletes a homework submission.
   */
  deleteHomeworkSubmission(id: string): Promise<void>;

  /**
   * Per-item photo delete: deletes the photo payload while retaining submission status.
   */
  deleteHomeworkPhoto(submissionId: string): Promise<void>;

  /**
   * Retrieves DailyReview for a student on a specific date.
   */
  getDailyReview(studentId: string, date: string): Promise<DailyReview | null>;

  /**
   * Persists a DailyReview.
   */
  saveDailyReview(review: DailyReview): Promise<void>;

  /**
   * Retrieves all saved DailyReviews for a student.
   */
  getAllDailyReviews(studentId: string): Promise<DailyReview[]>;

  /**
   * Retrieves all WeeklyReviews for a student.
   */
  getWeeklyReviews(studentId: string): Promise<WeeklyReview[]>;

  /**
   * Retrieves a single WeeklyReview by ID.
   */
  getWeeklyReview(id: string): Promise<WeeklyReview | null>;

  /**
   * Persists a WeeklyReview.
   */
  saveWeeklyReview(review: WeeklyReview): Promise<void>;

  /**
   * Retrieves all saved items for a student.
   */
  getSavedItems(studentId: string): Promise<SavedItem[]>;

  /**
   * Persists a saved item.
   */
  saveSavedItem(item: SavedItem): Promise<void>;

  /**
   * Deletes a saved item.
   */
  deleteSavedItem(id: string): Promise<void>;

  /**
   * Retrieves all collections for a student.
   */
  getCollections(studentId: string): Promise<Collection[]>;

  /**
   * Persists a collection.
   */
  saveCollection(collection: Collection): Promise<void>;

  /**
   * Deletes a collection.
   */
  deleteCollection(id: string): Promise<void>;

  /**
   * Retrieves the parent account linked to a student.
   */
  getParentAccount(studentId: string): Promise<ParentAccount | null>;

  /**
   * Persists a parent account.
   */
  saveParentAccount(account: ParentAccount): Promise<void>;

  /**
   * Deletes / unlinks a parent account.
   */
  deleteParentAccount(id: string): Promise<void>;

  /**
   * Retrieves student gamification data.
   */
  getGamification(studentId: string): Promise<StudentGamification | null>;

  /**
   * Persists student gamification data.
   */
  saveGamification(data: StudentGamification): Promise<void>;

  /**
   * Retrieves a teaching session by ID.
   */
  getTeachingSession(sessionId: string): Promise<TeachingSession | null>;

  /**
   * Retrieves all teaching sessions for a student.
   */
  getTeachingSessionsForStudent(studentId: string): Promise<TeachingSession[]>;

  /**
   * Persists a teaching session.
   */
  saveTeachingSession(session: TeachingSession): Promise<void>;

  /**
   * Deletes a teaching session.
   */
  deleteTeachingSession(sessionId: string): Promise<void>;

  /**
   * Exports all application data as a formatted JSON string for transparency and backup.
   */
  exportAllData(studentId?: string): Promise<string>;

  /**
   * Resets the student profile and interview answers while keeping general preferences.
   */
  resetProfile(): Promise<void>;

  /**
   * Completely purges all stored data (profile, timetable, chats, settings, mastery records).
   */
  clearAllData(): Promise<void>;
}
