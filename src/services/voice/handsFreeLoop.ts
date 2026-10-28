/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Hands-free turn taking for the teaching session.
 *
 * The session was press-driven: the tutor spoke, then the student had to find
 * and press the microphone before every answer. That is not a conversation, and
 * it is unusable for a young learner on a phone. This module holds the turn
 * rule in one place, away from the React tree, so it can be tested directly.
 *
 * Rule: the microphone opens only when the tutor has stopped speaking, and the
 * tutor only speaks when the microphone is closed. The two never overlap, which
 * is what makes a spoken interruption (barge-in) safe.
 */

export type HandsFreePhase =
  | 'idle'
  | 'tutor_speaking'
  | 'listening'
  | 'thinking'
  | 'paused';

export interface HandsFreeState {
  enabled: boolean;
  phase: HandsFreePhase;
  /**
   * Consecutive failed captures in the current listening turn. Bounded so a
   * broken microphone cannot spin the loop forever; after the limit the loop
   * pauses and the learner is asked to answer by hand.
   */
  failedCaptures: number;
  /** Bumped on every request to open the microphone, so repeats are distinct. */
  listenToken: number;
}

export const MAX_FAILED_CAPTURES = 2;

export const initialHandsFreeState = (enabled = false): HandsFreeState => ({
  enabled,
  phase: 'idle',
  failedCaptures: 0,
  listenToken: 0,
});

/**
 * Whether the microphone should be open. Kept as a pure predicate so the
 * component never has to re-derive it and drift from the state machine.
 */
export const shouldListen = (state: HandsFreeState): boolean =>
  state.enabled && state.phase === 'listening';

/** Whether the tutor is allowed to start speaking. */
export const shouldSpeak = (state: HandsFreeState): boolean =>
  state.enabled && state.phase === 'tutor_speaking';

export type HandsFreeEvent =
  | { type: 'toggle'; enabled: boolean }
  | { type: 'tutor_turn_added' }
  | { type: 'speech_finished' }
  | { type: 'speech_failed' }
  | { type: 'student_answered' }
  | { type: 'transcript_empty' }
  | { type: 'pause' }
  | { type: 'resume' };

/**
 * Advance the turn. Unknown combinations are ignored rather than throwing, so a
 * late callback from a superseded utterance can never wedge the loop.
 */
export const reduceHandsFree = (
  state: HandsFreeState,
  event: HandsFreeEvent,
): HandsFreeState => {
  switch (event.type) {
    case 'toggle':
      return event.enabled
        ? { ...state, enabled: true, phase: 'tutor_speaking', failedCaptures: 0, listenToken: 0 }
        : { ...initialHandsFreeState(false) };

    case 'tutor_turn_added':
      if (!state.enabled) return state;
      // A fresh tutor turn is a fresh attempt, so the retry budget resets.
      return { ...state, phase: 'tutor_speaking', failedCaptures: 0 };

    case 'speech_finished':
    case 'speech_failed':
      if (!state.enabled || state.phase !== 'tutor_speaking') return state;
      // A failed utterance must still hand the turn back, or the loop stalls.
      return { ...state, phase: 'listening', listenToken: state.listenToken + 1 };

    case 'student_answered':
      if (!state.enabled) return state;
      return { ...state, phase: 'thinking', failedCaptures: 0 };

    case 'transcript_empty':
      if (!state.enabled || state.phase !== 'listening') return state;
      if (state.failedCaptures >= MAX_FAILED_CAPTURES) {
        // Stop asking. The learner can still answer by hand; the loop is not
        // left silently spinning on a microphone that is not working.
        return { ...state, phase: 'paused' };
      }
      return {
        ...state,
        failedCaptures: state.failedCaptures + 1,
        listenToken: state.listenToken + 1,
      };

    case 'pause':
      return { ...state, phase: 'paused' };

    case 'resume':
      if (!state.enabled || state.phase !== 'paused') return state;
      return { ...state, phase: 'listening', failedCaptures: 0, listenToken: state.listenToken + 1 };

    default:
      return state;
  }
};

/**
 * Short, plain prompt read out when the microphone is waiting. The student
 * hears what to do without looking at the screen.
 */
export const listeningPrompt = (isArabic: boolean): string =>
  isArabic ? 'تفضل، أنا أسمعك الآن.' : 'Go ahead, I am listening.';
