/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ParentPreferences {
  defaultAvailableMinutesPerDay: number; // e.g. 45
  maxDailyStudyMinutes?: number;
  bedtime: string; // e.g. "21:30"
  bedtimeLimit?: string;
  bedtimeEnforced: boolean;
  voiceEnabledGlobally: boolean;
}

export interface ParentAccount {
  id: string;
  studentId: string;
  parentEmail: string;
  parentName: string;
  pin: string; // 4-digit PIN for MVP
  isLinked: boolean;
  createdAt: string; // ISO
  preferences: ParentPreferences;
}

export interface ParentWeeklySummary {
  studentName: string;
  grade: string;
  weekRange: string;
  lessonsCoveredCount: number;
  homeworkCompletedCount: number;
  homeworkTotalCount: number;
  upcomingReviewsCount: number;
  subjectsNeedingAttention: string[];
  recentAchievements: string[];
  recommendedAction: string;
}
