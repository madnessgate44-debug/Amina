/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HomeworkItem } from './homework';
import { CurriculumTrack } from './curriculum';

export type Language = 'ar' | 'en' | 'fr';

/** How Noor addresses the student, which drives Arabic grammatical gender. */
export type AddressForm = 'f' | 'm';

export type LearningStylePreference = 'videos' | 'games' | 'questions' | 'talking' | string;
export type SessionDurationPreference = '10min' | '30min' | string;

/**
 * Session length offered at onboarding. Deliberately narrower than the legacy
 * `SessionDurationPreference` string: a child picks one of three chips.
 */
export type SessionLengthMinutes = 5 | 10 | 20;

export interface InterviewAnswers {
  enjoyMost: string;
  hardest: string;
  learningStyle: LearningStylePreference;
  sessionDuration: SessionDurationPreference;
  upcomingExams: string;
}

/**
 * Preferences collected by the Noor-led onboarding. All fields are optional
 * so older profiles (and profiles saved before a question existed) remain
 * valid; an empty array means "no data", never a pre-filled default.
 */
export interface OnboardingPreferences {
  /** Subjects the child says they like (multi-select). */
  likedSubjects?: string[];
  /** How the child likes to learn (multi-select). */
  learningStyles?: LearningStylePreference[];
  /** Preferred single session length in minutes. */
  sessionLengthMinutes?: SessionLengthMinutes;
}

export interface Student {
  id: string;
  name: string;
  age: number;
  grade: string;
  country: string;
  curriculum: string;
  academicYear: string;
  preferredLanguage: Language;
  school?: string;
  location?: string;
  curriculumTrack?: CurriculumTrack | string;
  subjects: string[];
  interviewAnswers: InterviewAnswers;
  /**
   * Grammatical gender Noor uses when speaking to the student.
   * Defaults to 'f' for existing students (see migrateStudent).
   */
  addressForm?: AddressForm;
  /** Preferences from the Noor-led onboarding flow. */
  onboarding?: OnboardingPreferences;
  isOnboarded: boolean;
  createdAt: string;
  updatedAt: string;
}

export type SchoolDayKey = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday';

export interface TimeSlot {
  id: string;
  periodNumber: number;
  startTime: string;
  endTime: string;
  subject: string;
  isBreak?: boolean;
}

export interface DaySchedule {
  day: SchoolDayKey;
  dayNameAr: string;
  dayNameEn: string;
  periods: TimeSlot[];
}

export interface Timetable {
  id: string;
  studentId: string;
  days: DaySchedule[];
  updatedAt: string;
  isDemo: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  isInterviewQuestion?: boolean;
}

export interface AIConversation {
  id: string;
  studentId: string;
  messages: ChatMessage[];
  updatedAt: string;
}

export interface LessonCovered {
  subject: string;
  topic?: string;
  notes?: string;
}

export interface DayRecordDiscrepancies {
  missingTimetableSubjects?: string[];
  unexpectedSubjects?: string[];
  isVague?: boolean;
  notes?: string;
}

export interface DayRecord {
  id: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  lessonsCovered: LessonCovered[];
  homeworkAssigned: HomeworkItem[];
  notes?: string;
  confirmed: boolean;
  confirmedAt?: string;
  createdAt: string;
  updatedAt: string;
  origin: 'student_confirmed' | 'draft';
  discrepancies?: DayRecordDiscrepancies;
  rawStudentInput?: string;
}

export type MicPermissionState = 'granted' | 'denied' | 'prompt' | 'unsupported';

export interface AppSettings {
  language: Language;
  demoTimeSimulatorActive: boolean;
  simulatedTimeOfDay: 'school_hours' | 'after_school';
  simulatedTime: string;
  companionVoiceEnabled: boolean;
  micPermissionStatus: MicPermissionState;
  showEvidenceLog: boolean;
  simulatedDaysOffset?: number; // Days forward to test decay over time
  demoDefaultMigratedV1?: boolean;
}

export * from './curriculum';
export * from './mastery';
export * from './missions';
export * from './homework';
export * from './dailyReview';
export * from './spacedReview';
export * from './weeklyReview';
export * from './collections';
export * from './parent';
export * from './examCalendar';
export * from './gamification';
export * from './teachingSession';
export * from './stage';

export type NavigationTab = 
  | 'home' 
  | 'feed' 
  | 'learn' 
  | 'missions' 
  | 'homework'
  | 'review' 
  | 'progress' 
  | 'companion' 
  | 'timetable'
  | 'settings'
  | 'collections'
  | 'profile';
