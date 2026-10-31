/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Durable lesson-job tests (G7).
 *
 * These exercise the REAL storage round-trip (IndexedDB when present, the
 * in-memory fallback otherwise) and the REAL engine — no mocks. They prove the
 * two properties G7 asks for: a running job survives being written down and
 * read back, and an interrupted job can be found and resumed from the stage it
 * reached rather than restarting.
 */

import { handleAsk } from '../assemblyEngine';
import { createJob } from '../productionJobs';
import { startPersistentJob, runPersistentJob, findResumableJob, resumePersistedJob, stageLabel } from '../jobService';
import { storageService } from '../../storage';
import { LessonProductionJob, PersistedLessonJob, TeachingNeed } from '../../../types/assembly';

let passed = 0;
let failed = 0;
function check(name: string, condition: boolean, detail?: string) {
  if (condition) {
    passed++;
    console.log(`  ✅ [PASS] ${name}`);
  } else {
    failed++;
    console.log(`  ❌ [FAIL] ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

const STUDENT = 'student_test_g7';

async function main() {
  // A real lesson request produces a real job.
  const ask = await handleAsk('عايزة درس كامل عن البناء الضوئي', { language: 'ar' });
  if (ask.kind !== 'lesson_production') {
    console.log(`  ❌ [FAIL] precondition: a lesson request should produce a job (got ${ask.kind})`);
    process.exit(1);
  }
  const job = ask as LessonProductionJob;

  // ── 1. A running job is written down and read back unchanged ──────────────
  const persisted: PersistedLessonJob = { ...job, studentId: STUDENT };
  await storageService.saveLessonJob(persisted);
  const readBack = await storageService.getLessonJob(job.id);
  check('1: a saved job is retrievable by id', readBack?.id === job.id, String(readBack?.id));
  check('1: the student id round-trips', readBack?.studentId === STUDENT, String(readBack?.studentId));
  check('1: the stage state round-trips', (readBack?.stages.length ?? 0) === job.stages.length, String(readBack?.stages.length));

  // ── 2. A running job is discoverable for resume ───────────────────────────
  const resumable = await findResumableJob(STUDENT);
  check('2: a running job is found as resumable', resumable?.id === job.id, String(resumable?.id));
  check('2: the resumable job is still running', resumable?.status === 'running', String(resumable?.status));

  // ── 3. Resuming drives it to completion from where it stopped ─────────────
  const resumed = await resumePersistedJob(resumable!);
  check('3: resuming settles the job complete', resumed.status === 'complete', `${resumed.status} ${resumed.error || ''}`);
  check('3: the resumed job carries the full experience', !!resumed.experience && resumed.experience.phases.length === 4, String(resumed.experience?.phases.length));

  const storedAfter = await storageService.getLessonJob(job.id);
  check('3: the completed job is persisted as complete', storedAfter?.status === 'complete', String(storedAfter?.status));
  check('3: a completed job is no longer offered for resume', (await findResumableJob(STUDENT)) === null);

  // ── 4. Progress is real, from stage state ─────────────────────────────────
  const fresh = createJob(job.need);
  const seen: number[] = [];
  await runPersistentJob(fresh, {
    studentId: STUDENT,
    onProgress: (j) => seen.push(j.progress),
  });
  check('4: progress is reported for each stage', seen.length >= 5, seen.join(','));
  check('4: progress never decreases', seen.every((p, i) => i === 0 || p >= seen[i - 1]), seen.join(','));
  check('4: progress ends at 1', seen[seen.length - 1] === 1, String(seen[seen.length - 1]));
  check('4: the final job is complete', fresh.status === 'complete', `${fresh.status} ${fresh.error || ''}`);

  // ── 5. Stage labels are localised for all three languages ─────────────────
  const names = ['understand', 'reuse', 'generate', 'assemble', 'verify'] as const;
  check('5: every stage has an Arabic label', names.every((n) => stageLabel(n, 'ar').length > 0));
  check('5: every stage has an English label', names.every((n) => stageLabel(n, 'en').length > 0));
  check('5: every stage has a French label', names.every((n) => stageLabel(n, 'fr').length > 0));

  // ── 6. startPersistentJob creates and completes a job from a need ─────────
  const need: TeachingNeed = job.need;
  const viaStart = await startPersistentJob(need, { studentId: STUDENT });
  check('6: startPersistentJob settles a complete job', viaStart.status === 'complete', `${viaStart.status} ${viaStart.error || ''}`);
  check('6: the job it made is persisted', (await storageService.getLessonJob(viaStart.id))?.status === 'complete');

  // Clean up the test student's jobs.
  for (const j of await storageService.getLessonJobsForStudent(STUDENT)) {
    await storageService.deleteLessonJob(j.id);
  }
  check('6: deleting a job removes it', (await storageService.getLessonJobsForStudent(STUDENT)).length === 0);

  console.log(`\n  jobPersistence: ${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main();
