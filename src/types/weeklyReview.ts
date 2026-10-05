/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface LessonSummaryItem {
  subject: string;
  topic?: string;
  date?: string;
}

export interface RepeatedErrorItem {
  conceptId: string;
  nameAr: string;
  nameEn: string;
  subject: string;
  errorCount: number;
}

export interface ConceptMasterySummaryItem {
  conceptId: string;
  nameAr: string;
  nameEn: string;
  subject: string;
  score: number;
}

export interface ModalityEffectiveness {
  modality: 'quiz' | 'practice' | 'game' | 'reel_check' | 'homework';
  labelAr: string;
  labelEn: string;
  retentionScore: number; // 0.0 - 1.0
  sampleCount: number;
  descriptionAr: string;
  descriptionEn: string;
}

export interface WeeklyReview {
  id: string;
  studentId: string;
  weekStartDate: string; // YYYY-MM-DD
  weekEndDate: string; // YYYY-MM-DD
  createdAt: string; // ISO
  lessonsCovered: LessonSummaryItem[];
  homeworkCompletion: {
    completed: number;
    total: number;
    percentage: number;
  };
  quizPerformanceTrend: {
    averageScore: number;
    trend: 'improving' | 'steady' | 'needs_boost';
    detailsAr: string;
    detailsEn: string;
  };
  repeatedErrors: RepeatedErrorItem[];
  weakConcepts: ConceptMasterySummaryItem[]; // needs_review
  strongConcepts: ConceptMasterySummaryItem[]; // mastered this week
  savedContentCount: number;
  timeSpentMinutes: number;
  formatEffectiveness: ModalityEffectiveness[];
  recommendedFocus: {
    subject: string;
    conceptNameAr: string;
    conceptNameEn: string;
    rationaleAr: string;
    rationaleEn: string;
  };
  toneMessageAr: string;
  toneMessageEn: string;
}
