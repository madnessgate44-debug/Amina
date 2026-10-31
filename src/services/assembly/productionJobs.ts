/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Lesson-production jobs: the "long" work class.
 *
 * A quick question is answered inline. A full lesson is different: it reuses
 * approved material, generates only the gaps, assembles the experience and
 * verifies it — work that must not block the child. This module models that as a
 * `LessonProductionJob` that moves through named stages and is PUMPED, one stage
 * per `pumpJob()` call, so a UI can show real progress (and a test can drive it
 * to completion deterministically).
 *
 * Stage → what it does:
 *   understand → the TeachingNeed is attached (done at creation).
 *   reuse      → resolveAssets() fills every role it can from approved material.
 *   generate   → the remaining roles are recorded as pending generation. When a
 *                generator callback is supplied it is asked to fill them; with no
 *                callback the job still completes, flagging the gaps, rather
 *                than blocking or fabricating content.
 *   assemble   → assembleExperience() builds the TEACH·ASSESS·ADAPT experience.
 *   verify     → the experience is checked (has a dialogue line, a practice
 *                question, and a next step) before the job is marked complete.
 */

import {
  AssetRole,
  AssetResolution,
  JobStage,
  JobStageName,
  LessonProductionJob,
  TeachingExperience,
  TeachingNeed,
} from '../../types/assembly';
import { resolveAssets } from './assetResolver';
import { assembleExperience } from './contentAssembler';

const STAGE_ORDER: JobStageName[] = ['understand', 'reuse', 'generate', 'assemble', 'verify'];

function freshStages(): JobStage[] {
  return STAGE_ORDER.map((name, i) => ({ name, status: i === 0 ? 'active' : 'pending' }));
}

/** A generator that fills a missing role. Returning null leaves the gap open. */
export type RoleGenerator = (
  role: AssetRole,
  brief: { ar: string; en: string },
  anchors: string[]
) => Promise<string | null> | string | null;

let jobCounter = 0;

/** Create a job for a need. The `understand` stage is complete on creation. */
export function createJob(need: TeachingNeed): LessonProductionJob {
  jobCounter += 1;
  const now = new Date().toISOString();
  const stages = freshStages();
  stages[0] = { name: 'understand', status: 'done', detail: need.matchReason };
  // Understanding is complete on creation, so the next stage is the active one.
  stages[1] = { ...stages[1], status: 'active' };
  return {
    kind: 'lesson_production',
    id: `job_${need.matched?.conceptId || 'generic'}_${Date.now()}_${jobCounter}`,
    status: 'running',
    need,
    stages,
    progress: Number((1 / STAGE_ORDER.length).toFixed(3)),
    createdAt: now,
    updatedAt: now,
  };
}

function activeStageIndex(job: LessonProductionJob): number {
  return job.stages.findIndex((s) => s.status === 'active');
}

function advance(job: LessonProductionJob, detail: string): void {
  const i = activeStageIndex(job);
  if (i >= 0) job.stages[i] = { ...job.stages[i], status: 'done', detail };
  const next = i + 1;
  if (next < job.stages.length) job.stages[next] = { ...job.stages[next], status: 'active' };
  const done = job.stages.filter((s) => s.status === 'done').length;
  job.progress = Number((done / job.stages.length).toFixed(3));
  job.updatedAt = new Date().toISOString();
}

/** Which roles the experience cannot be built without. */
const REQUIRED_ROLES: AssetRole[] = ['explanation', 'practice', 'next_step'];

/**
 * Advance a job by exactly one stage. Returns the same (mutated) job. The
 * `generate` stage is where the fast/long split matters: with a generator it
 * fills gaps; without one it records them and moves on.
 */
export async function pumpJob(
  job: LessonProductionJob,
  opts: { generator?: RoleGenerator } = {}
): Promise<LessonProductionJob> {
  if (job.status !== 'running') return job;
  const stage = job.stages[activeStageIndex(job)]?.name;

  try {
    switch (stage) {
      case 'reuse': {
        const resolution = resolveAssets(job.need);
        job.resolution = resolution;
        advance(job, `Reused ${resolution.reused.length} approved asset(s); ${resolution.missing.length} role(s) need generation.`);
        break;
      }

      case 'generate': {
        const missing = job.resolution?.missing || [];
        if (missing.length === 0) {
          advance(job, 'Nothing to generate; every role was reused from approved material.');
          break;
        }
        let filled = 0;
        if (opts.generator) {
          for (const req of missing) {
            const text = await opts.generator(req.role, req.brief, req.anchors);
            if (text && text.trim()) {
              job.resolution!.reused.push({
                role: req.role,
                origin: 'generated',
                reuseKey: `generated ${req.role}`,
                text: text.trim(),
              });
              filled += 1;
            }
          }
          job.resolution!.missing = missing.filter((m) => !job.resolution!.reused.some((r) => r.role === m.role));
          const total = job.resolution!.reused.length + job.resolution!.missing.length;
          job.resolution!.reuseRatio = total === 0 ? 1 : Number((job.resolution!.reused.length / total).toFixed(3));
        }
        advance(
          job,
          opts.generator
            ? `Generated ${filled} of ${missing.length} missing role(s).`
            : `No generator supplied; ${missing.length} role(s) remain as declared gaps.`
        );
        break;
      }

      case 'assemble': {
        if (!job.resolution) throw new Error('assemble ran before reuse');
        job.experience = assembleExperience(job.need, job.resolution);
        advance(job, `Assembled ${job.experience.phases.length} phase(s) with ${job.experience.media.length} media item(s).`);
        break;
      }

      case 'verify': {
        const exp = job.experience;
        if (!exp) throw new Error('verify ran before assemble');
        const problems: string[] = [];
        const hasDialogue = exp.phases.find((p) => p.phase === 'dialogue')?.lines.length;
        if (!hasDialogue) problems.push('no dialogue line');
        const hasPractice = exp.phases.find((p) => p.phase === 'practice')?.lines.length;
        if (!hasPractice) problems.push('no practice item');
        const hasNext = exp.phases.find((p) => p.phase === 'next_step')?.lines.length;
        if (!hasNext) problems.push('no next step');

        // Only the roles the experience cannot stand without are hard failures;
        // a missing optional asset is a declared gap, not an error.
        const blocking = exp.pendingGeneration.filter((r) => REQUIRED_ROLES.includes(r));
        if (blocking.length) problems.push(`missing required role(s): ${blocking.join(', ')}`);

        if (problems.length) {
          job.status = 'failed';
          job.error = problems.join('; ');
          advance(job, `Verification failed: ${job.error}`);
        } else {
          job.status = 'complete';
          advance(job, 'Experience verified: dialogue, practice and next step present.');
        }
        break;
      }

      default:
        // 'understand' is complete on creation; nothing to pump.
        advance(job, job.need.matchReason);
    }
  } catch (err) {
    job.status = 'failed';
    job.error = err instanceof Error ? err.message : String(err);
    job.updatedAt = new Date().toISOString();
  }
  return job;
}

/** Drive a job to completion (or failure) in one call. */
export async function runJobToCompletion(
  job: LessonProductionJob,
  opts: { generator?: RoleGenerator; maxSteps?: number } = {}
): Promise<LessonProductionJob> {
  const max = opts.maxSteps ?? STAGE_ORDER.length + 1;
  let steps = 0;
  while (job.status === 'running' && steps < max) {
    await pumpJob(job, opts);
    steps += 1;
  }
  return job;
}

/** True when the job is finished, successfully or not. */
export function isJobSettled(job: LessonProductionJob): boolean {
  return job.status === 'complete' || job.status === 'failed';
}
