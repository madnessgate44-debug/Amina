/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MissionReviewItem {
  id: string;
  title: string;
  subject: string;
  completed: boolean;
}

export interface DifficultConceptItem {
  conceptId: string;
  nameAr: string;
  nameEn: string;
  subject: string;
  evidenceSummary?: string;
  struggleNote: string;
}

export interface MasteredConceptItem {
  conceptId: string;
  nameAr: string;
  nameEn: string;
  subject: string;
  score: number;
}

export interface NeedsAttentionItem {
  conceptId: string;
  nameAr: string;
  nameEn: string;
  subject: string;
  reason: string;
}

export interface DailyReview {
  id: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  completedMissions: MissionReviewItem[];
  notCompletedMissions: MissionReviewItem[];
  difficultConcepts: DifficultConceptItem[];
  masteredConcepts: MasteredConceptItem[];
  needsAttentionTomorrow: NeedsAttentionItem[];
  tonePraise: string; // Specific celebration of actual work done
  uncompletedActionNote: string; // Calm, non-guilt statement (e.g. "Two missions remain. Let's decide what to do now.")
  summaryText: string;
  createdAt: string;
}
