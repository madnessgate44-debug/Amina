/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Proves the interactive reel reacts to the answer the child actually gave.
 *
 * The behaviour under test is the one that separates a teacher from a quiz:
 * a wrong answer must be DIAGNOSED (a named misconception with a reframing),
 * not merely marked wrong. The correct-answer and offline paths are tested too,
 * because the child must never be left without a reaction.
 *
 * No network is used: the diagnosis path is deterministic curriculum data, and
 * the offline path is forced, so this suite is fast and cannot flake on quota.
 */

import { buildReelsForConcept } from '../reels/reelGenerator';
import { resolveReelResponse, matchSpokenOption } from '../reels/reelResponse';
import { curriculumService } from '../curriculum/curriculumService';
import { Reel } from '../../types/reel';

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

/** The French-maths lesson that carries real misconception data. */
function lessonWithMisconceptions() {
  const lessons = curriculumService.getAllLessons();
  // This suite exercises the French diagnosis path and the cross-language guard
  // (a French diagnosis must not be injected into an Arabic reply), so it needs
  // a lesson whose misconception text is French, not merely the first one found.
  return lessons.find((l) =>
    l.concepts.some((c) => (c.misconceptions ?? []).some((m) => /[A-Za-zÀ-ÿ]/.test(m.explanation)))
  );
}

async function main() {
  console.log('\n=== INTERACTIVE REEL SUITE ===\n');

  const lesson = lessonWithMisconceptions();
  check('1.1 a lesson with misconception data exists', Boolean(lesson));
  if (!lesson) {
    console.log(`\nSUMMARY: ${passed} PASSED, ${failed} FAILED`);
    process.exit(1);
  }

  const conceptWithMis = lesson.concepts.find((c) => (c.misconceptions?.length ?? 0) > 0)!;
  const reels = buildReelsForConcept(lesson, conceptWithMis, 'fr');
  const questionReel = reels.find((r) => r.options && r.options.length > 1);

  check('1.2 the lesson produces a question reel with options', Boolean(questionReel));
  if (!questionReel) {
    console.log(`\nSUMMARY: ${passed} PASSED, ${failed} FAILED`);
    process.exit(1);
  }

  // --- Correct answer: praise, no diagnosis, no quota spent. ---
  const correctOpt = questionReel.options!.find((o) => o.isCorrect)!;
  const correctResult = await resolveReelResponse({
    reel: questionReel,
    answerText: correctOpt.text,
    correct: true,
    language: 'fr',
  });
  check('2.1 a correct answer is praised, not diagnosed', correctResult.namedMisconception === false);
  check('2.2 a correct answer is never marked degraded', correctResult.degraded === false);
  check('2.3 a correct answer uses the reel praise line', correctResult.source === 'reel_line');

  // --- Wrong answer matching a misconception: named, at zero quota. ---
  const mis = conceptWithMis.misconceptions![0];
  const wrongResult = await resolveReelResponse({
    reel: { ...questionReel, conceptId: conceptWithMis.id } as Reel,
    answerText: mis.trigger,
    correct: false,
    language: 'fr',
  });
  check('3.1 a wrong answer matching a misconception is diagnosed', wrongResult.namedMisconception === true);
  check('3.2 the diagnosis comes from curriculum data', wrongResult.source === 'misconception');
  check('3.3 the diagnosis names the misconception explanation', wrongResult.text.includes(mis.explanation.slice(0, 30)));
  check('3.4 the diagnosis includes the remediation', wrongResult.text.includes(mis.remediation.slice(0, 30)));
  check('3.5 a diagnosed answer costs no quota', wrongResult.degraded === false);

  // --- Forced failure: the child still gets a reaction, marked offline. ---
  const offlineResult = await resolveReelResponse({
    reel: { ...questionReel, conceptId: 'no_such_concept' } as Reel,
    answerText: 'إجابة غير معروفة تماما',
    correct: false,
    language: 'ar',
    forceOffline: true,
  });
  check('4.1 an offline teacher still reacts to the child', offlineResult.text.length > 0);
  check('4.2 the offline path is marked degraded, never silent', offlineResult.degraded === true);
  check('4.3 the offline path uses the reel fallback line', offlineResult.source === 'reel_line');

  // --- Answer-specific: two different wrong answers must not give the same text. ---
  const mis2 = conceptWithMis.misconceptions![1];
  if (mis2) {
    const other = await resolveReelResponse({
      reel: { ...questionReel, conceptId: conceptWithMis.id } as Reel,
      answerText: mis2.trigger,
      correct: false,
      language: 'fr',
    });
    check('5.1 two different wrong answers get different diagnoses', other.text !== wrongResult.text);
  }

  // --- Language guard: a French diagnosis must never be injected into Arabic. ---
  // Build the reel the way the app would for an Arabic child, then answer wrong.
  const arReels = buildReelsForConcept(lesson, conceptWithMis, 'ar');
  const arQuestion = arReels.find((r) => r.options && r.options.length > 1)!;
  const arWrong = arQuestion.options!.find((o) => !o.isCorrect)!;
  const arabicResult = await resolveReelResponse({
    reel: arQuestion,
    answerText: arWrong.text,
    correct: false,
    language: 'ar',
    studentName: 'سارة',
  });
  const hasLatin = /[A-Za-zÀ-ÿ]{4,}/.test(arabicResult.text);
  check('6.1 a French misconception is not injected into an Arabic reply', !hasLatin,
    `got: ${arabicResult.text.slice(0, 60)}`);
  check('6.2 the mismatched diagnosis is not reported as named', arabicResult.namedMisconception === false);
  check('6.3 the child still gets a reaction in their own language', /[\u0600-\u06FF]/.test(arabicResult.text));
  check('6.4 the mismatched path is honest about being degraded', arabicResult.degraded === true);

  // The same concept answered in French still gets the full diagnosis.
  const frReels = buildReelsForConcept(lesson, conceptWithMis, 'fr');
  const frQuestion = frReels.find((r) => r.options && r.options.length > 1)!;
  const frWrong = frQuestion.options!.find((o) => !o.isCorrect)!;
  const frenchResult = await resolveReelResponse({
    reel: frQuestion,
    answerText: frWrong.text,
    correct: false,
    language: 'fr',
  });
  check('6.5 a French child still gets the stored diagnosis',
    frenchResult.source === 'misconception' && frenchResult.namedMisconception === true);

  // --- Spoken answer (owner ask #2: voice turn-taking in the feed) ----------
  // The child answers out loud. The transcript is free-form, so it must be
  // matched against the reel's own options before it is graded.
  const options = questionReel.options!;
  const wrongIdx = options.findIndex((o) => !o.isCorrect);
  const correctIdx = options.findIndex((o) => o.isCorrect);

  check('7.1 an exact spoken option resolves to that option',
    matchSpokenOption(options[wrongIdx].text, options) === wrongIdx);
  check('7.2 a spoken correct option resolves to the correct one',
    matchSpokenOption(options[correctIdx].text, options) === correctIdx);
  check('7.3 speech with surrounding words still resolves',
    matchSpokenOption(`أعتقد إن الإجابة هي ${options[correctIdx].text}`, options) === correctIdx);
  check('7.4 an unrelated transcript is not treated as an answer',
    matchSpokenOption('مش عارفة خالص', options) === null);
  check('7.5 an empty transcript is not an answer', matchSpokenOption('   ', options) === null);
  check('7.6 a reel with no options never resolves a spoken answer',
    matchSpokenOption('أي كلام', undefined) === null);

  // A spoken wrong answer takes the same diagnosis path as a tap.
  const spokenWrong = await resolveReelResponse({
    reel: { ...questionReel, conceptId: conceptWithMis.id } as Reel,
    answerText: options[wrongIdx].text,
    correct: false,
    language: 'fr',
  });
  check('7.7 a spoken wrong answer reaches the same diagnosis as a tap',
    spokenWrong.source === wrongResult.source && spokenWrong.namedMisconception === wrongResult.namedMisconception);

  console.log(`\nINTERACTIVE REEL SUITE SUMMARY: ${passed} PASSED, ${failed} FAILED\n`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error('suite crashed:', e);
  process.exit(1);
});
