/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type MissionType = 'understand_lesson' | 'practice' | 'review' | 'game' | 'quiz' | 'homework';

export type MissionStatus = 'pending' | 'started' | 'completed' | 'skipped';

export interface Mission {
  id: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  subject: string;
  lessonId?: string; // if tied to a lesson
  conceptId?: string; // if targeting a concept
  homeworkItemId?: string; // if tied to homework item
  homeworkDescription?: string; // linked homework description
  title: string;
  type: MissionType;
  estimatedMinutes: number; // typically 5 to 15, max 20
  whyNow: string; // one clear, student-facing sentence
  originTag: string; // e.g. "demo", "curriculum_node"
  successCriterion: string; // e.g. "Complete quick check with understanding" or "Answer 3 questions"
  status: MissionStatus;
  completedAt?: string;
  skippedAt?: string;
}

export interface MissionOutcome {
  id: string;
  missionId: string;
  studentId: string;
  completedAt: string;
  status: 'completed' | 'skipped';
  score?: number; // 0.0 - 1.0 if quiz or check
  modalityUsed?: 'reel_check' | 'quiz' | 'practice' | 'homework';
  durationSeconds?: number;
  evidenceAdded?: boolean;
}

export type TutorModality = 
  | 'normal_explanation'
  | 'simpler_example'
  | 'story_analogy_visual'
  | 'check_question'
  | 'flag_for_review';

export interface TutorState {
  studentId: string;
  conceptId: string;
  sessionId: string;
  attemptCount: number; // 1 to 5
  currentModality: TutorModality;
  isFlaggedForReview: boolean;
  historyModalities: TutorModality[];
}

export interface TutorResponse {
  state: TutorState;
  text: string;
  modality: TutorModality;
  modalityLabelAr: string;
  modalityLabelEn: string;
  checkQuestion?: {
    question: string;
    options?: string[];
    correctAnswer: string;
    explanation: string;
  };
  suggestNextStep?: string;
}
