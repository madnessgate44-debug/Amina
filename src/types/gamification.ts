/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AchievementBadge {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  icon: string;
  unlockedAt?: string;
  progressCurrent?: number;
  progressTarget?: number;
}

export interface PersonalMilestone {
  id: string;
  titleAr: string;
  titleEn: string;
  achievedAt: string;
}

export interface ForgivingStreak {
  currentDays: number;
  lastActiveDate: string; // YYYY-MM-DD
  restDayUsedThisWeek: boolean; // 1 automatic rest day per week
  isPaused: boolean;
  totalActiveDays: number;
}

export interface StudentGamification {
  studentId: string;
  xp: number;
  level: number;
  xpToNextLevel: number;
  streak: ForgivingStreak;
  badges: AchievementBadge[];
  milestones: PersonalMilestone[];
  subjectMasteryPercentages: Record<string, number>;
}
