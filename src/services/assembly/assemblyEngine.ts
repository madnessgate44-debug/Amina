/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * The content-assembly engine: one entry point for an ask.
 *
 * Flow for every ask:
 *   understand → resolve (reuse first) → route fast or long.
 *
 *  - A quick question is answered NOW as a `QuickExplanation`, built only from
 *    approved material. If nothing approved can answer it, the engine does not
 *    guess: it escalates to a lesson-production job.
 *  - A lesson request (or topic exploration) becomes a `LessonProductionJob`
 *    that is pumped stage by stage, so the child sees progress instead of a
 *    frozen screen.
 *
 * The engine is deterministic and model-free by default. A caller may pass a
 * `generator` to fill missing roles; without one, gaps are declared, never
 * fabricated.
 */

import { AskChannel } from '../../types/assembly';
import { AskResult, AssemblyContext, LessonProductionJob, QuickExplanation, TeachingNeed } from '../../types/assembly';
import { Language } from '../../types';
import { understandAsk } from './teachingNeed';
import { resolveAssets } from './assetResolver';
import { assembleQuickExplanation } from './contentAssembler';
import { createJob, pumpJob, RoleGenerator } from './productionJobs';

/** Roles needed to answer a quick question (kept small so it stays fast). */
const QUICK_ROLES = ['explanation', 'example', 'narration', 'visual'] as const;

export interface HandleAskOptions extends AssemblyContext {
  channel?: AskChannel;
  /** When set, the long job is pumped to completion inline (tests, batch). */
  runToCompletion?: boolean;
  /** Fills missing roles during the generate stage. */
  generator?: RoleGenerator;
}

function languageOf(ctx: AssemblyContext): Language | undefined {
  return ctx.language;
}

/**
 * Understand an ask without building anything. Useful for a UI that wants to
 * show the matched lesson before committing to a long job.
 */
export function analyzeAsk(rawAsk: string, ctx: AssemblyContext & { channel?: AskChannel } = {}): TeachingNeed {
  return understandAsk(rawAsk, { channel: ctx.channel, language: languageOf(ctx) });
}

/**
 * Handle an ask end to end. Returns either an immediate answer or a production
 * job. The decision is the child's intent, not the answer's size.
 */
export async function handleAsk(
  rawAsk: string,
  opts: HandleAskOptions = {}
): Promise<AskResult> {
  const need = understandAsk(rawAsk, { channel: opts.channel, language: languageOf(opts) });

  // A lesson request is always long work.
  if (need.intent === 'lesson_request') {
    return startLessonJob(need, opts);
  }

  // A quick question: try to answer immediately from approved material.
  const resolution = resolveAssets(need, { roles: [...QUICK_ROLES] });
  const quick = assembleQuickExplanation(need, resolution);
  if (quick) {
    const result: QuickExplanation = {
      kind: 'quick_explanation',
      need,
      text: quick.text,
      media: quick.media,
      source: quick.source,
      immediate: true,
    };
    return result;
  }

  // Nothing approved to say: escalate to the long job rather than inventing.
  return startLessonJob(need, opts);
}

/** Create a lesson-production job and optionally drive it to completion. */
export async function startLessonJob(
  need: TeachingNeed,
  opts: { generator?: RoleGenerator; runToCompletion?: boolean } = {}
): Promise<LessonProductionJob> {
  const job = createJob(need);
  if (opts.runToCompletion) {
    // Pump through reuse → generate → assemble → verify.
    let guard = 0;
    while (job.status === 'running' && guard < 8) {
      await pumpJob(job, { generator: opts.generator });
      guard += 1;
    }
  }
  return job;
}

export { understandAsk } from './teachingNeed';
export { resolveAssets } from './assetResolver';
export { assembleExperience, assembleQuickExplanation } from './contentAssembler';
export { createJob, pumpJob, runJobToCompletion, isJobSettled } from './productionJobs';
export {
  presentExperience,
  assessPractice,
  assessVerification,
  hasPracticeQuestion,
  recommendNextStep,
} from './experiencePresenter';
