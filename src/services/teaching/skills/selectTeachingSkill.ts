/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * The teaching-skill coordinator.
 *
 * This is the app's equivalent of an agent's task/delegation tool: it looks at
 * the current moment (a wrong answer, a due review, a learner who is stuck) and
 * picks the one teaching skill that fits, then returns its instruction. The
 * teaching loop asks the coordinator "what should I do this turn?" instead of
 * carrying every rule inline.
 */

import {
  diagnoseMisconceptionSkill,
  groundedVisualSkill,
  explainInLayersSkill,
  socraticCheckSkill,
  spacedRecheckSkill,
} from './teachingSkills';
import { matchMisconception } from './teachingSkills';
import type { TeachingSkillContext, TeachingSkillResult } from './types';

/** Attempt count at which words alone have stopped working and a visual is due. */
export const VISUAL_ESCALATION_ATTEMPT = 4;

/**
 * Picks the single teaching skill for this turn.
 *
 * Priority, highest first:
 *   1. a due spaced review,
 *   2. a wrong answer that matches a known misconception,
 *   3. a learner who is stuck after repeated re-teaching (show a visual),
 *   4. low confidence (explain in layers),
 *   5. otherwise probe with one Socratic question.
 */
export function selectTeachingSkill(
  ctx: TeachingSkillContext
): TeachingSkillResult {
  if (ctx.reviewDue) {
    return spacedRecheckSkill.run(ctx);
  }

  if (matchMisconception(ctx.studentInput, ctx.concept.misconceptions)) {
    return diagnoseMisconceptionSkill.run(ctx);
  }

  if (ctx.attemptCount >= VISUAL_ESCALATION_ATTEMPT) {
    return groundedVisualSkill.run(ctx);
  }

  if (ctx.confidenceBand === 'low' || ctx.confidenceBand === 'medium') {
    return explainInLayersSkill.run(ctx);
  }

  return socraticCheckSkill.run(ctx);
}
