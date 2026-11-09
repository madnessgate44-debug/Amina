/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Per-session learning signals for the FEED.
 *
 * The teaching modal already records the three signals (did the teaching land,
 * not did the API respond). The feed — where most of the child's practice
 * happens — recorded none, so a whole session of reel answers left no learning
 * evidence behind. This module derives the same three signals from the reel
 * loop so the feed and the modal cannot drift.
 *
 * The rules mirror `TeachingSessionModal`'s mapping:
 *  - `nextQuestionCorrect` — the question just answered came out right.
 *  - `misconceptionResolved` — a named misconception on this concept was
 *    cleared by the next answer.
 *  - `independentRecheckPassed` — a later, unaided check on the same concept
 *    came out right (feed answers are always unassisted).
 *
 * Pure and dependency-free, so the reducer is tested without a browser.
 */

export interface FeedConceptState {
  /** How many questions the child has answered on this concept this session. */
  seen: number;
  /** The previous answer on this concept was wrong. */
  lastWrong: boolean;
  /** The previous wrong answer named a stored misconception. */
  lastNamedMisconception: boolean;
}

export interface FeedAnswerInput {
  conceptId: string;
  correct: boolean;
  /** True when the wrong answer matched a stored curriculum misconception. */
  namedMisconception: boolean;
}

export interface FeedLearningOutcome {
  conceptId: string;
  nextQuestionCorrect: boolean;
  misconceptionResolved: boolean;
  independentRecheckPassed: boolean;
}

export const initialFeedConceptState: FeedConceptState = {
  seen: 0,
  lastWrong: false,
  lastNamedMisconception: false,
};

/**
 * Fold one answered reel into the concept's session state and return both the
 * next state and the signal to record. Deterministic; no storage, no network.
 */
export function reduceFeedSignal(
  prev: FeedConceptState | undefined,
  input: FeedAnswerInput
): { state: FeedConceptState; outcome: FeedLearningOutcome } {
  const before = prev ?? initialFeedConceptState;
  const outcome: FeedLearningOutcome = {
    conceptId: input.conceptId,
    nextQuestionCorrect: input.correct,
    misconceptionResolved: input.correct && before.lastNamedMisconception,
    independentRecheckPassed: input.correct && before.seen >= 1,
  };
  const state: FeedConceptState = {
    seen: before.seen + 1,
    lastWrong: !input.correct,
    lastNamedMisconception: input.correct ? false : input.namedMisconception,
  };
  return { state, outcome };
}
