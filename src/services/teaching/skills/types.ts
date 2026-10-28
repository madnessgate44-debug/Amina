/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Teaching skills — the in-app equivalent of an agent "skill".
 *
 * Each skill is a small, named, testable unit of teaching behaviour. A skill
 * declares `triggers` (the lesson/learner signals that select it) and a `run`
 * function that turns learner state into an instruction for the tutor. The
 * coordinator (`selectTeachingSkill`) picks the one skill that fits the current
 * moment, so the tutoring loop has one clear intent per turn instead of an
 * implicit pile of branches.
 *
 * Skills here are knowledge, not capability: they decide *what to teach next*,
 * they do not call the network or grant permissions.
 */

import type {
  CurriculumLessonConcept,
  ConceptMisconception,
} from '../../../types/teachingSession';
import type { ConfidenceBand } from '../../../types/mastery';

export interface TeachingSkillContext {
  /** The concept currently being taught. */
  concept: CurriculumLessonConcept;
  /** What the learner last typed or said (empty on a tutor-only turn). */
  studentInput: string;
  /** How many times the learner has already been re-taught this concept. */
  attemptCount: number;
  /** Mastery confidence band for this concept, when known. */
  confidenceBand?: ConfidenceBand;
  /** True when a spaced-review recheck is due for this concept. */
  reviewDue?: boolean;
}

export interface TeachingSkillResult {
  /** The skill that produced this result. */
  skillId: string;
  /** What the tutor should do this turn. */
  intent:
    | 'name_misconception'
    | 'explain_layer'
    | 'socratic_probe'
    | 'show_visual'
    | 'schedule_recheck';
  /** Human-readable instruction/reasoning the tutor can speak. */
  message: string;
  /** Present only when the intent is `name_misconception`. */
  misconception?: ConceptMisconception;
}

export interface TeachingSkill {
  id: string;
  description: string;
  /** Signals that select this skill. Free-form labels, matched by the coordinator. */
  triggers: string[];
  run(ctx: TeachingSkillContext): TeachingSkillResult;
}
