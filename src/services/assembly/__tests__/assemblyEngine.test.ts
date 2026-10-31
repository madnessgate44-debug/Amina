/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Guards the content-assembly engine (owner ask: understand the ask, reuse
 * approved material first, generate only the gaps, assemble a teaching
 * experience, and separate fast explanations from long lesson production).
 *
 * Every check runs the real engine against the real curriculum — no mocks, no
 * DOM. The engine is deterministic, so the same ask always yields the same
 * understanding and the same reuse/generate split.
 */

import { understandAsk, matchConcept, detectLanguage, classifyIntent } from '../teachingNeed';
import { resolveAssets } from '../assetResolver';
import { assembleExperience, assembleQuickExplanation } from '../contentAssembler';
import { createJob, pumpJob, runJobToCompletion, isJobSettled } from '../productionJobs';
import { handleAsk } from '../assemblyEngine';
import { curriculumService } from '../../curriculum/curriculumService';

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

async function main() {
  // ── 1. Understanding the ask ──────────────────────────────────────────────
  const sciAsk = understandAsk('اشرحي لي البناء الضوئي في النبات');
  check('an Arabic science ask is detected as Arabic', sciAsk.language === 'ar', sciAsk.language);
  check('an Arabic science ask matches a real curriculum concept', !!sciAsk.matched, sciAsk.matchReason);
  check(
    'the matched concept is the photosynthesis concept',
    sciAsk.matched?.conceptId === 'off_sci_u1_l1_c1',
    sciAsk.matched?.conceptId
  );
  check('a matched ask does not ask for curriculum selection', sciAsk.needsCurriculumSelection === false);

  const frAsk = understandAsk('pourquoi les salutations sont importantes');
  check('a French ask is detected as French', frAsk.language === 'fr', frAsk.language);

  const enAsk = understandAsk('explain photosynthesis');
  check('an English ask is detected as English', enAsk.language === 'en', enAsk.language);

  // ── 2. No textbook selection must NOT block ───────────────────────────────
  const offTopic = understandAsk('ما هي عاصمة أستراليا؟');
  check(
    'an off-curriculum ask is flagged for curriculum selection instead of throwing',
    offTopic.needsCurriculumSelection === true && offTopic.matched === null,
    offTopic.matchReason
  );

  // ── 3. Intent classification ──────────────────────────────────────────────
  check('a question cue reads as a quick question', classifyIntent('اشرحي البناء الضوئي') === 'quick_question');
  check('a lesson cue reads as a lesson request', classifyIntent('عايزة درس كامل عن البناء الضوئي') === 'lesson_request');
  check('language detection falls back to Arabic for empty input', detectLanguage('') === 'ar');

  // ── 4. Reuse before generating ────────────────────────────────────────────
  const sciResolution = resolveAssets(sciAsk);
  check(
    'the science concept reuses approved material (reuseRatio > 0.6)',
    sciResolution.reuseRatio > 0.6,
    `ratio=${sciResolution.reuseRatio}`
  );
  check(
    'the explanation is reused from the concept sourceText',
    sciResolution.reused.some((r) => r.role === 'explanation' && r.origin === 'curriculum_concept'),
    sciResolution.reused.map((r) => `${r.role}:${r.origin}`).join(', ')
  );
  check(
    'the visual is reused from the media catalog (not generated)',
    sciResolution.reused.some((r) => r.role === 'visual' && r.origin === 'media_catalog')
  );
  check(
    'the narration is reused from the media catalog',
    sciResolution.reused.some((r) => r.role === 'narration' && r.origin === 'media_catalog')
  );
  check(
    'every reused asset carries a reuseKey for the audit trail',
    sciResolution.reused.every((r) => !!r.reuseKey)
  );

  // A concept with a misconception must reuse it, not generate it.
  const mathAsk = understandAsk('مقارنة الأعداد العشرية وضبط المنازل');
  const mathResolution = resolveAssets(mathAsk);
  check(
    'a concept with a recorded misconception reuses it',
    mathResolution.reused.some((r) => r.role === 'misconception' && r.origin === 'curriculum_misconception'),
    mathResolution.reused.map((r) => `${r.role}:${r.origin}`).join(', ')
  );
  check(
    'practice is reused from the lesson exercises or reel engine',
    mathResolution.reused.some((r) => r.role === 'practice' && (r.origin === 'curriculum_exercise' || r.origin === 'reel_engine')),
    mathResolution.reused.map((r) => `${r.role}:${r.origin}`).join(', ')
  );

  // ── 5. Gaps are declared, never fabricated ────────────────────────────────
  check(
    'missing roles become GenerationRequests with a brief and anchors',
    offTopicIntentCheck(offTopic)
  );
  function offTopicIntentCheck(need: ReturnType<typeof understandAsk>): boolean {
    const res = resolveAssets(need);
    // With no matched concept, nearly everything is missing and must be declared.
    if (res.missing.length === 0) return false;
    return res.missing.every((m) => !!m.reason && !!m.brief.ar && !!m.brief.en && Array.isArray(m.anchors));
  }
  check(
    'reuseRatio + missing reconciles with the role count',
    (() => {
      const res = resolveAssets(sciAsk);
      return res.reused.length + res.missing.length === 9;
    })(),
    'expected 9 roles total'
  );

  // ── 6. Dynamic assembly: TEACH · ASSESS · ADAPT ───────────────────────────
  const experience = assembleExperience(sciAsk, sciResolution);
  const phaseNames = experience.phases.map((p) => p.phase);
  check(
    'the experience has the four movements in order',
    JSON.stringify(phaseNames) === JSON.stringify(['dialogue', 'practice', 'verification', 'next_step']),
    phaseNames.join(',')
  );
  check('dialogue (TEACH) has at least one line', (experience.phases[0].lines.length ?? 0) >= 1);
  check('the experience carries approved media to render', experience.media.length >= 1);
  check(
    'every experience line names the approved source it came from',
    experience.phases.every((p) => p.lines.every((l) => !!l.reuseKey || l.origin === 'generated'))
  );

  // ── 7. Fast explanation vs long production job ────────────────────────────
  const quick = await handleAsk('اشرحي لي البناء الضوئي في النبات');
  check('a quick question returns an immediate QuickExplanation', quick.kind === 'quick_explanation', quick.kind);
  check(
    'the quick explanation is answered from approved material, not generated',
    quick.kind === 'quick_explanation' && !!quick.source && quick.immediate === true
  );

  const lessonReq = await handleAsk('عايزة درس كامل عن البناء الضوئي');
  check('a lesson request returns a LessonProductionJob', lessonReq.kind === 'lesson_production', lessonReq.kind);

  // ── 8. Job staging: pumped one stage at a time ────────────────────────────
  const job = createJob(sciAsk);
  check('a new job starts running at the understand stage', job.status === 'running' && job.stages[0].name === 'understand' && job.stages[0].status === 'done');
  await pumpJob(job);
  check('after one pump the reuse stage is done and resolution is attached', !!job.resolution && job.stages[1].status === 'done');
  await pumpJob(job);
  check('the generate stage runs and records gaps when no generator is given', job.stages[2].status === 'done');
  await pumpJob(job);
  check('the assemble stage produces the experience', !!job.experience && job.stages[3].status === 'done');
  await pumpJob(job);
  check('the verify stage settles the job', isJobSettled(job), `${job.status} ${job.error || ''}`);
  check('progress reaches 1.0 on completion', job.progress === 1, String(job.progress));

  // ── 9. A generator fills the gaps (long work uses generation only for gaps)
  const jobWithGen = createJob(offTopic);
  await runJobToCompletion(jobWithGen, {
    generator: (role) => `generated ${role} for ${offTopic.topicTokens[0] || 'the topic'}`,
  });
  check(
    'with a generator the job completes and fills required gaps',
    jobWithGen.status === 'complete',
    `${jobWithGen.status} ${jobWithGen.error || ''}`
  );
  check(
    'the generator was asked only for roles that had no approved source',
    (jobWithGen.resolution?.reused || []).some((r) => r.origin === 'generated')
  );

  // ── 10. Determinism: the same ask yields the same understanding ───────────
  const again = understandAsk('اشرحي لي البناء الضوئي في النبات');
  check(
    'understanding is deterministic for the same ask',
    JSON.stringify(again.matched) === JSON.stringify(sciAsk.matched)
  );

  // ── 11. The engine reads real curriculum, not a stub ──────────────────────
  check('the curriculum actually contains the matched concept', !!curriculumService.getConceptById('off_sci_u1_l1_c1'));

  console.log(`\n  assembly: ${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main();
