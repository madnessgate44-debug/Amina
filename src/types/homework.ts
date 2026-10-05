/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EvidenceIndependence } from './mastery';

export type HomeworkQuestionType =
  | 'multiple_choice'
  | 'short_answer'
  | 'matching'
  | 'fill_in_the_blank'
  | 'ordering'
  | 'voice_response';

export interface MatchingPair {
  id: string;
  left: string;
  right: string;
}

export interface HomeworkQuestion {
  id: string;
  homeworkItemId: string;
  conceptId?: string;
  type: HomeworkQuestionType;
  prompt: string;
  promptAr?: string;
  // Activity-specific attributes
  options?: string[]; // for multiple_choice
  correctAnswer: string | string[]; // string for mc/short/fill/voice, string[] for ordering
  matchingPairs?: MatchingPair[]; // for matching activity
  orderingItems?: string[]; // initial items (can be pre-shuffled for student)
  blanks?: {
    beforeText: string;
    blankAnswer: string;
    afterText: string;
  };
  // Hint-first pedagogical assets
  hint: string; // Attempt 1 wrong: conceptual rule
  workedStep: string; // Attempt 2 wrong: partial approach / first step
  explanation: string; // Attempt 3 wrong or reveal: complete answer & explanation
  difficulty?: number;
}

export type HomeworkItemStatus = 'pending' | 'in_progress' | 'completed';

export interface HomeworkItem {
  id?: string;
  studentId?: string;
  date?: string; // YYYY-MM-DD
  subject: string;
  description: string;
  dueDate?: string;
  conceptId?: string;
  unlinked?: boolean;
  status?: HomeworkItemStatus;
  questions?: HomeworkQuestion[];
  createdAt?: string;
  updatedAt?: string;
}

export type SubmissionType = 'digital' | 'photo';

export interface PhotoEvaluationResult {
  extractedAnswerText: string | null;
  extractionConfidence: number; // 0..1
  evaluation: 'correct' | 'partial' | 'wrong' | 'unclear';
  mistakeDescription: string | null;
  workedStep: string | null;
  finalAnswer: string | null;
  rawModelFeedback?: string;
}

export interface HomeworkSubmission {
  id: string;
  studentId: string;
  homeworkItemId: string;
  missionId?: string;
  type: SubmissionType;
  status: 'draft' | 'submitted' | 'evaluated';
  // Photo submission fields
  photoDataUrl?: string; // Stored only with student consent
  photoConsentGiven?: boolean;
  photoEvaluation?: PhotoEvaluationResult;
  // Digital submission fields
  answers?: Record<string, any>; // questionId -> student answer
  // State machine tracking per (studentId, homeworkItemId)
  attemptsCount: number;
  revealed: boolean;
  corrected: boolean;
  lastIndependence?: EvidenceIndependence;
  disputed?: boolean;
  disputeNote?: string;
  disputedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HomeworkAttempt {
  id: string;
  studentId: string;
  homeworkItemId: string;
  questionId?: string;
  attemptNumber: number;
  studentAnswer: any;
  isCorrect: boolean;
  evaluation: 'correct' | 'partial' | 'wrong' | 'unclear';
  hintShown?: string;
  workedStepShown?: string;
  revealed: boolean;
  independence: EvidenceIndependence;
  timestamp: string;
}

export interface HintFirstState {
  studentId: string;
  homeworkItemId: string;
  questionId?: string;
  attemptCount: number;
  revealed: boolean;
}
