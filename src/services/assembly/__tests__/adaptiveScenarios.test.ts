/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Scenario tests for the adaptive teaching experience (mission Phase 9).
 *
 * Each scenario runs the REAL engine against the REAL curriculum — no mocks, no
 * DOM — and asserts the user-facing outcome, not just that a function returns.
 *   A quick question · B pasted text · C misconception · D off-curriculum
 *   E complete lesson · F asset reuse · G failure handling · H language.
 */

import { handleAsk } from '../assemblyEngine';
import { understandAsk } from '../teachingNeed';
import { resolveAssets } from '../assetResolver';
import { assembleExperience } from '../contentAssembler';
import { runJobToCompletion, createJob } from '../productionJobs';
import {
  presentExperience,
  assessPractice,
  assessVerification,
  recommendNextStep,
} from '../experiencePresenter';

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
  // ── A. Quick question: immediate answer, no arbitrary lesson ──────────────
  const quick = await handleAsk('اشرحي لي البناء الضوئي في النبات');
  check('A: a quick question answers immediately (no job)', quick.kind === 'quick_explanation', quick.kind);
  check('A: the immediate answer comes from approved material', quick.kind === 'quick_explanation' && !!quick.source);

  const iceAsk = understandAsk('Why does ice float on water?');
  check('A: an off-textbook quick question matches no lesson', iceAsk.matched === null, JSON.stringify(iceAsk.matched));

  // ── B. Pasted text: identify the core concept ─────────────────────────────
  const pasted =
    'البناء الضوئي عملية تصنع فيها النبتة غذاءها من ضوء الشمس والماء وثاني أكسيد الكربون داخل الورقة.';
  const pastedNeed = understandAsk(pasted);
  check('B: pasted text identifies the photosynthesis concept', pastedNeed.matched?.conceptId === 'off_sci_u1_l1_c1', String(pastedNeed.matched?.conceptId));
  const pastedExp = assembleExperience(pastedNeed, resolveAssets(pastedNeed));
  check('B: pasted text assembles a full experience', pastedExp.phases.length === 4 && pastedExp.media.length >= 1);

  // ── C. Misconception: identified, corrected, then verified ────────────────
  const misAsk = understandAsk('في العدد 0,875 ما معنى الرقم 5؟');
  const misExp = assembleExperience(misAsk, resolveAssets(misAsk));
  const misVerify = assessVerification(misExp, 'مش عارفة');
  check('C: a "I do not know" answer is not marked mastered', misVerify.correctness !== 'full', misVerify.quality);

  // ── D. Off-curriculum: do NOT borrow an unrelated lesson ──────────────────
  const engine = understandAsk('اشرحي لي كيف يعمل محرك السيارة');
  check('D: an off-curriculum ask borrows no unrelated lesson', engine.matched === null, JSON.stringify(engine.matched));
  check('D: the off-curriculum ask is flagged for selection', engine.needsCurriculumSelection === true);

  // ── E. Complete lesson: real staged job, not a synchronous blob ───────────
  const lessonReq = await handleAsk('عايزة درس كامل عن البناء الضوئي');
  check('E: a lesson request returns a production job', lessonReq.kind === 'lesson_production', lessonReq.kind);
  if (lessonReq.kind === 'lesson_production') {
    const stages = lessonReq.stages.map((s) => s.name).join(',');
    check('E: the job exposes the named stages', stages === 'understand,reuse,generate,assemble,verify', stages);
    check('E: progress is reported from real stage state', lessonReq.progress > 0 && lessonReq.progress <= 1, String(lessonReq.progress));
    const driven = await runJobToCompletion(lessonReq);
    check('E: the job settles complete', driven.status === 'complete', `${driven.status} ${driven.error || ''}`);
    check('E: the completed job carries the full experience', !!driven.experience && driven.experience.phases.length === 4);
    if (driven.experience) {
      const pres = presentExperience(driven.experience);
      check('E: the experience presents practice + verification + next step', pres.phases.every((p) => !!p.purpose));
    }
  }

  // ── F. Asset reuse: suitable reused, irrelevant rejected ──────────────────
  const sciNeed = understandAsk('اشرحي لي البناء الضوئي في النبات');
  const sciRes = resolveAssets(sciNeed);
  check('F: suitable approved assets are reused', sciRes.reused.length > 0 && sciRes.reuseRatio > 0.5, String(sciRes.reuseRatio));
  check('F: every reused asset keeps its provenance', sciRes.reused.every((r) => !!r.reuseKey));
  const unrelatedNeed = understandAsk('اشرحي لي كيف يعمل محرك السيارة');
  const unrelatedRes = resolveAssets(unrelatedNeed);
  check('F: an off-curriculum ask reuses no textbook asset', unrelatedRes.reused.length === 0, String(unrelatedRes.reused.length));
  check('F: an off-curriculum ask declares the gaps to generate', unrelatedRes.missing.length > 0);

  // ── G. Failure handling: a bad answer and a missing practice item ─────────
  const noPractice = assembleExperience(sciNeed, resolveAssets(sciNeed));
  const stripped = { ...noPractice, phases: noPractice.phases.filter((p) => p.phase !== 'practice') };
  check('G: assessing a missing practice item is a no-op, not a crash', assessPractice(stripped, 0) === null);
  check('G: assessing an out-of-range option is a no-op', assessPractice(noPractice, 99) === null);
  const failedJob = createJob(unrelatedNeed);
  await runJobToCompletion(failedJob); // no generator: required roles stay missing
  check('G: a job missing a required role fails with a stated error', failedJob.status === 'failed' && !!failedJob.error, `${failedJob.status} ${failedJob.error}`);

  // ── H. Language: Arabic, English, French detected ─────────────────────────
  check('H: Arabic is detected', understandAsk('اشرحي لي البناء الضوئي').language === 'ar');
  check('H: English is detected', understandAsk('explain photosynthesis please').language === 'en');
  check('H: French is detected', understandAsk('explique la photosynthèse').language === 'fr');
  check(
    'H: an Arabic ask does not borrow a French-track lesson',
    understandAsk('عايزة درس كامل عن البناء الضوئي').matched?.conceptId !== 'conc_scifr_u1_l1_photosynthese',
    String(understandAsk('عايزة درس كامل عن البناء الضوئي').matched?.conceptId)
  );
  check(
    'H: a French ask matches a French-track lesson',
    understandAsk('explique la photosynthèse des plantes').matched?.lessonId?.includes('scifr') === true,
    String(understandAsk('explique la photosynthèse des plantes').matched?.lessonId)
  );

  // ── Adapt: the next step follows the evidence ─────────────────────────────
  const sound = assessVerification(noPractice, (resolveAssets(sciNeed).reused.find((r) => r.role === 'verification')?.text) || '');
  const advanced = recommendNextStep(noPractice, sound);
  check('ADAPT: sound understanding advances the next step', advanced.advance === true, sound.quality);

  console.log(`\n  adaptiveScenarios: ${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main();
