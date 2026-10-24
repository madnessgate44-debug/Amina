/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Reel engine types.
 *
 * A "reel" is a 30-45 second, single-concept card that plays IN the feed.
 * Every reel is generated deterministically from real curriculum fields; a
 * kind is skipped when the lesson lacks the field it needs. Nothing is
 * fabricated, and every reel carries the source line it came from.
 */

import { Language } from './index';
import { StructuredVisualType } from './teachingSession';

export type ReelKind =
  | 'hook_question'
  | 'story_analogy'
  | 'vocab_flash'
  | 'spot_the_mistake'
  | 'quick_choice'
  | 'teach_card'
  | 'win_closer';

/** Why this reel is in the queue. Drives the small label on the card. */
export type ReelReason = 'due_review' | 'today_lesson' | 'exam_topic' | 'curiosity' | 'refill' | 'closer';

export interface ReelOption {
  text: string;
  isCorrect: boolean;
}

export interface Reel {
  id: string;
  kind: ReelKind;
  conceptId: string;
  lessonId: string;
  subjectId: string;
  subjectName: string;
  lessonTitle: string;
  /** Hook line Noor says first (3s). */
  hook: string;
  /** The single visual cue (text prompt for now; no images invented). */
  show: string;
  /** Optional structured-visual type carried from the concept. */
  visualType?: StructuredVisualType;
  /** The one Noor line during "Show". */
  noorLine: string;
  /** Present when the reel asks a question. */
  options?: ReelOption[];
  /** Noor's reaction when correct. */
  reactionCorrect: string;
  /** Noor's reaction when wrong (the existing misconception line, one line). */
  reactionWrong: string;
  /** Provenance line, e.g. "Science book p. 10". */
  sourceLabel: string;
  originTag: 'official' | 'ai_generated' | 'demo';
  language: Language;
  reason?: ReelReason;
}
