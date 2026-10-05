/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SpacedReviewSchedule {
  conceptId: string;
  studentId: string;
  subjectId: string;
  subjectName: string;
  conceptNameAr: string;
  conceptNameEn: string;
  masteryScore: number;
  confidence: number;
  confidenceBand: 'low' | 'medium' | 'high';
  intervalDays: number;
  lastPracticedAt: string; // ISO
  nextReviewAt: string; // ISO
  isDue: boolean;
  isOverdue: boolean; // overdue by 3+ days
  overdueDays: number;
  status: 'due' | 'upcoming' | 'overdue' | 'just_revealed' | 'mastered';
  reason: string;
}

export interface SpacedReviewSummary {
  dueCount: number;
  overdueCount: number;
  upcomingCount: number;
  items: SpacedReviewSchedule[];
}
