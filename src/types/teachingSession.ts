/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Language } from './index';

export type SessionStep =
  | 'greet'
  | 'warmup'
  | 'teach'
  | 'ask'
  | 'adjust'
  | 'visual'
  | 'explain_back'
  | 'celebrate'
  | 'close';

export type TeachingModality =
  | 'source_explanation'
  | 'daily_life_example'
  | 'story_analogy'
  | 'structured_visual'
  | 'break_prerequisite'
  | 'flag_for_review';

export interface SourceRef {
  book: string;
  bookAr: string;
  bookEn: string;
  grade: string;
  term: string;
  unit: string;
  lesson: string;
  page: number | string;
  isAvailable: boolean;
}

export interface CurriculumVocabulary {
  word: string;
  definition: string;
  example?: string;
}

export interface CurriculumExercise {
  type: 'qa' | 'multiple_choice' | 'fill_blank' | 'matching' | 'calligraphy_trace';
  question: string;
  options?: string[];
  expectedAnswer?: string;
  page?: number | string;
}

export interface CurriculumLessonConcept {
  id: string;
  conceptNumber: number;
  titleAr: string;
  titleEn: string;
  sourceText: string;
  keyPoints: string[];
  dailyLifeExampleAr: string;
  dailyLifeExampleEn: string;
  storyAnalogyAr: string;
  storyAnalogyEn: string;
  prerequisiteAr: string;
  prerequisiteEn: string;
  visualType?: StructuredVisualType;
  visualPrompt?: string;
}

export interface OfficialCurriculumLesson {
  id: string;
  subjectId: string;
  subjectNameAr: string;
  subjectNameEn: string;
  unitNumber: number;
  unitNameAr: string;
  unitNameEn: string;
  lessonNumber: number;
  titleAr: string;
  titleEn: string;
  sourceRef: SourceRef;
  objectives: string[];
  readingText: string | null;
  vocabulary: CurriculumVocabulary[];
  exercises: CurriculumExercise[];
  concepts: CurriculumLessonConcept[];
  originTag: 'official';
  language?: 'ar' | 'en' | 'fr';
  isAvailable: boolean;
}

export type StructuredVisualType =
  | 'diagram'
  | 'timeline'
  | 'map_like'
  | 'number_line'
  | 'concept_map'
  | 'stroke_guide'
  | 'comparison_table';

export interface StructuredVisualData {
  type: StructuredVisualType;
  titleAr: string;
  titleEn: string;
  captionAr?: string;
  captionEn?: string;
  sourceRef: SourceRef;
  elements: any; // payload tailored per visual type
}

export interface TutorTurn {
  id: string;
  role: 'tutor' | 'student' | 'system';
  step: SessionStep;
  text: string;
  audioText?: string;
  modalityUsed?: TeachingModality;
  visualData?: StructuredVisualData;
  sourceRef?: SourceRef;
  isExplainBack?: boolean;
  offBookDetected?: boolean;
  timestamp: string;
}

export interface TeachingSession {
  sessionId: string;
  studentId: string;
  lessonId: string;
  subjectId: string;
  startedAt: string;
  lastActiveAt: string;
  completedAt?: string;
  currentConceptIndex: number;
  totalConcepts: number;
  currentStep: SessionStep;
  currentAttemptCount: number;
  modalityHistory: TeachingModality[];
  turnHistory: TutorTurn[];
  explainBackDone: boolean;
  activeVisual?: StructuredVisualData;
  offBookQuestions: Array<{
    question: string;
    timestamp: string;
    parentNote: string;
  }>;
  status: 'in_progress' | 'completed' | 'paused';
}
