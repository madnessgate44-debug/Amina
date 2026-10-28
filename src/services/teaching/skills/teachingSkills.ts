/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * The five teaching skills. Each copies a behaviour that Study Mode or Guided
 * Learning proves is valuable, and each reuses code the app already has.
 */

import { normalizeText } from '../teachingSession';
import type {
  TeachingSkill,
  TeachingSkillContext,
  TeachingSkillResult,
} from './types';
import type { ConceptMisconception } from '../../../types/teachingSession';

/**
 * Finds the misconception whose trigger best matches the learner's answer.
 * Whole-phrase match first, then token overlap, so "الجزء اللي بعد الفاصلة
 * هو العشرات" still hits a trigger of "العشرات".
 */
export function matchMisconception(
  studentInput: string,
  misconceptions?: ConceptMisconception[]
): ConceptMisconception | undefined {
  if (!misconceptions || misconceptions.length === 0) return undefined;
  const answer = normalizeText(studentInput);
  if (!answer) return undefined;

  let best: { m: ConceptMisconception; score: number } | undefined;
  for (const m of misconceptions) {
    const trigger = normalizeText(m.trigger);
    if (!trigger) continue;
    let score = 0;
    if (` ${answer} `.includes(` ${trigger} `)) {
      score = 1;
    } else {
      const triggerWords = trigger.split(' ').filter((w) => w.length > 2);
      if (triggerWords.length === 0) continue;
      const hits = triggerWords.filter((w) => answer.includes(w)).length;
      score = hits / triggerWords.length;
    }
    if (score > 0 && (!best || score > best.score)) best = { m, score };
  }
  // ponytail: 0.5 overlap is a heuristic; upgrade: grade with the model against a rubric
  return best && best.score >= 0.5 ? best.m : undefined;
}

/**
 * `diagnose-misconception` — name the misunderstanding instead of only marking
 * it wrong (Study Mode: "help you correct misunderstandings").
 */
export const diagnoseMisconceptionSkill: TeachingSkill = {
  id: 'diagnose-misconception',
  description:
    'When a wrong answer matches a known misconception, name it and clear it.',
  triggers: ['wrong_answer', 'misconception_match'],
  run(ctx: TeachingSkillContext): TeachingSkillResult {
    const m = matchMisconception(ctx.studentInput, ctx.concept.misconceptions);
    if (!m) {
      return {
        skillId: this.id,
        intent: 'socratic_probe',
        message: 'No known misconception matched; probe understanding instead.',
      };
    }
    return {
      skillId: this.id,
      intent: 'name_misconception',
      misconception: m,
      message: `Name the misconception "${m.explanation}" then clear it: ${m.remediation}`,
    };
  },
};

/**
 * `explain-in-layers` — start simple and add detail only when ready
 * (Study Mode: "explain concepts in layers"). The layer is chosen from the
 * mastery confidence band the app already computes.
 */
export const explainInLayersSkill: TeachingSkill = {
  id: 'explain-in-layers',
  description: 'Choose the explanation layer from the learner confidence band.',
  triggers: ['reteach', 'low_confidence'],
  run(ctx: TeachingSkillContext): TeachingSkillResult {
    const band = ctx.confidenceBand ?? 'low';
    const layer =
      band === 'high'
        ? 'go deeper: connect to the key points and the why'
        : band === 'medium'
        ? 'add detail: one worked step at a time'
        : 'keep it simple: one idea, the daily-life example, then stop';
    return {
      skillId: this.id,
      intent: 'explain_layer',
      message: `Explain in layers (${band} confidence): ${layer}.`,
    };
  },
};

/**
 * `socratic-check` — ask before telling, one question at a time
 * (Study Mode: "ask what you already know, where you got stuck").
 */
export const socraticCheckSkill: TeachingSkill = {
  id: 'socratic-check',
  description: 'Ask one open question and wait, rather than giving the answer.',
  triggers: ['check_understanding', 'stuck'],
  run(ctx: TeachingSkillContext): TeachingSkillResult {
    return {
      skillId: this.id,
      intent: 'socratic_probe',
      message: `Ask one question about "${ctx.concept.titleEn}" and wait for the answer.`,
    };
  },
};

/**
 * `grounded-visual` — teach with a picture grounded in the textbook
 * (Guided Learning: "learn with images"). Reuses the concept's visual data.
 */
export const groundedVisualSkill: TeachingSkill = {
  id: 'grounded-visual',
  description: 'Show the textbook-grounded visual when words are not landing.',
  triggers: ['visual_needed', 'high_attempt_count'],
  run(ctx: TeachingSkillContext): TeachingSkillResult {
    const hasVisual = Boolean(ctx.concept.visualType || ctx.concept.visualPrompt);
    return {
      skillId: this.id,
      intent: 'show_visual',
      message: hasVisual
        ? `Show the structured visual for "${ctx.concept.titleEn}" and ask what stands out.`
        : `Words are not landing; render a simple diagram for "${ctx.concept.titleEn}".`,
    };
  },
};

/**
 * `spaced-recheck` — bring a concept back after a gap to confirm it stuck
 * (Study Mode: "explain what to review next"). Reuses the review scheduler.
 */
export const spacedRecheckSkill: TeachingSkill = {
  id: 'spaced-recheck',
  description: 'Re-ask a due concept to confirm the understanding held.',
  triggers: ['review_due'],
  run(ctx: TeachingSkillContext): TeachingSkillResult {
    return {
      skillId: this.id,
      intent: 'schedule_recheck',
      message: `Re-ask "${ctx.concept.titleEn}" now that its spaced review is due.`,
    };
  },
};

export const TEACHING_SKILLS: TeachingSkill[] = [
  diagnoseMisconceptionSkill,
  explainInLayersSkill,
  socraticCheckSkill,
  groundedVisualSkill,
  spacedRecheckSkill,
];
