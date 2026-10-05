/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type NourState =
  | 'idle'
  | 'talking'
  | 'listening'
  | 'thinking'
  | 'excited'
  | 'celebrating'
  | 'gentle_correct'
  | 'confused'
  | 'encouraging';

export type SubjectOutfit =
  | 'arabic'
  | 'english'
  | 'social_studies'
  | 'islamic'
  | 'calligraphy'
  | 'math'
  | 'science'
  | 'french';

export type BeatType =
  | 'scene_open'
  | 'character_speak'
  | 'child_tap_word'
  | 'child_tap_object'
  | 'child_drag_drop'
  | 'child_match_pairs'
  | 'child_order_sequence'
  | 'child_trace'
  | 'child_speak_answer'
  | 'child_choose_answer'
  | 'child_build'
  | 'explain_back';

export interface BeatDefinition {
  id: string;
  type: BeatType;
  conceptId?: string;
  sourcePage?: number | string;
  nourState: NourState;
  nourTextAr: string;
  nourTextEn: string;
  nourTextFr?: string;
  scenePayload?: {
    clipId?: string;
    backgroundTheme?: string;
    ambientSound?: string;
    interactiveObjects?: Array<{
      id: string;
      labelAr: string;
      labelEn: string;
      xPercent: number;
      yPercent: number;
      iconType?: string;
      descriptionAr: string;
      descriptionEn: string;
    }>;
  };
  interactionPayload?: any;
  escalationSupportBeat?: BeatDefinition;
}

export interface StageLessonSequence {
  lessonId: string;
  lessonTitleAr: string;
  lessonTitleEn: string;
  subjectId: string;
  outfit: SubjectOutfit;
  sourceRefText: string;
  beats: BeatDefinition[];
}

export interface StageSessionState {
  lessonId: string;
  currentBeatIndex: number;
  totalBeats: number;
  nourCurrentState: NourState;
  isAudioPlaying: boolean;
  isMuted: boolean;
  currentConceptId?: string;
  beatsCompleted: string[];
  explainBackPassed: Record<string, boolean>;
  offBookQuestions: string[];
}
