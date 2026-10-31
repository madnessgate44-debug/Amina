/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Durable lesson-production jobs.
 *
 * `productionJobs.ts` models a job as a state machine; this module makes it
 * survive a page reload. A long lesson request is created, persisted, then
 * advanced ONE STAGE AT A TIME with the job saved after every stage. If the
 * child closes the tab (or the sandbox restarts) mid-lesson, the running job is
 * still on disk and can be resumed from the stage it reached — the same job ID,
 * the same stages, the same progress — instead of starting over.
 *
 * Progress is real: it is derived from the persisted stage state, never a timer.
 */

import {
  AskResult,
  JobStageName,
  LessonProductionJob,
  PersistedLessonJob,
  TeachingNeed,
} from '../../types/assembly';
import { storageService } from '../storage';
import { createJob, pumpJob, RoleGenerator } from './productionJobs';

export interface StartPersistentJobOptions {
  studentId: string;
  generator?: RoleGenerator;
  /** Called after every stage so the UI can render live progress. */
  onProgress?: (job: LessonProductionJob) => void;
  /** Called once the job settles (complete or failed). */
  onSettled?: (job: LessonProductionJob) => void;
  /** Milliseconds to pause between stages, so progress is visible. */
  stageDelayMs?: number;
}

function toPersisted(job: LessonProductionJob, studentId: string): PersistedLessonJob {
  return { ...job, studentId };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Persist an already-created job and advance it stage by stage, saving after
 * every stage. Use this when the engine has already created the job (so the ID
 * the UI shows is the ID that is persisted).
 */
export async function runPersistentJob(
  job: LessonProductionJob,
  opts: StartPersistentJobOptions
): Promise<LessonProductionJob> {
  await storageService.saveLessonJob(toPersisted(job, opts.studentId));
  opts.onProgress?.(job);

  let guard = 0;
  while (job.status === 'running' && guard < 8) {
    if (opts.stageDelayMs) await sleep(opts.stageDelayMs);
    await pumpJob(job, { generator: opts.generator });
    await storageService.saveLessonJob(toPersisted(job, opts.studentId));
    opts.onProgress?.(job);
    guard += 1;
  }

  opts.onSettled?.(job);
  return job;
}

/**
 * Create a lesson job for a need, persist it, and advance it stage by stage.
 * Resolves once the job settles. The persisted copy always reflects the latest
 * stage, so a reload at any point resumes from there.
 */
export async function startPersistentJob(
  need: TeachingNeed,
  opts: StartPersistentJobOptions
): Promise<LessonProductionJob> {
  return runPersistentJob(createJob(need), opts);
}

/**
 * Resume a persisted job from the stage it reached. Safe to call on mount: a
 * job that is already settled is returned untouched.
 */
export async function resumePersistedJob(
  job: PersistedLessonJob,
  opts: Omit<StartPersistentJobOptions, 'studentId'> & { studentId?: string } = {}
): Promise<LessonProductionJob> {
  const studentId = opts.studentId || job.studentId;
  const job2: LessonProductionJob = { ...job };
  opts.onProgress?.(job2);

  let guard = 0;
  while (job2.status === 'running' && guard < 8) {
    if (opts.stageDelayMs) await sleep(opts.stageDelayMs);
    await pumpJob(job2, { generator: opts.generator });
    await storageService.saveLessonJob(toPersisted(job2, studentId));
    opts.onProgress?.(job2);
    guard += 1;
  }

  opts.onSettled?.(job2);
  return job2;
}

/**
 * The most recent still-running job for a student, if any. This is what a
 * reload looks up to offer "resume the lesson you were building".
 */
export async function findResumableJob(studentId: string): Promise<PersistedLessonJob | null> {
  const jobs = await storageService.getLessonJobsForStudent(studentId);
  const running = jobs
    .filter((j) => j.status === 'running' || j.status === 'queued')
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
  return running[0] || null;
}

/** Human-readable label for a stage, in the child's language. */
export function stageLabel(name: JobStageName, lang: 'ar' | 'en' | 'fr'): string {
  const labels: Record<JobStageName, { ar: string; en: string; fr: string }> = {
    understand: { ar: 'فهمتِ طلبك', en: 'Understanding your ask', fr: 'Compréhension de ta demande' },
    reuse: { ar: 'بجمع المادة المعتمدة', en: 'Gathering approved material', fr: 'Rassemblement du matériel approuvé' },
    generate: { ar: 'بجهّز الأمثلة الناقصة', en: 'Preparing the missing examples', fr: 'Préparation des exemples manquants' },
    assemble: { ar: 'برتّب الدرس', en: 'Assembling the lesson', fr: 'Assemblage de la leçon' },
    verify: { ar: 'بتأكد من الدرس', en: 'Checking the lesson', fr: 'Vérification de la leçon' },
  };
  return labels[name][lang];
}
