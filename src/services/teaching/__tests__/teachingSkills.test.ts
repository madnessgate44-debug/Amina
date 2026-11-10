/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Teaching skills: the coordinator picks one skill per turn, and the diagnosis
 * skill names a real misconception from curriculum data. These tests prove the
 * behaviour the report promised (R2/R3) against real code, not mocks.
 */

import {
  matchMisconception,
  misconceptionText,
  diagnoseMisconceptionSkill,
  explainInLayersSkill,
  groundedVisualSkill,
} from '../skills/teachingSkills';
import { speaksLanguage } from '../../reels/reelResponse';
import { selectTeachingSkill, VISUAL_ESCALATION_ATTEMPT } from '../skills/selectTeachingSkill';
import { evaluateStudentAnswer } from '../../homework/homeworkGenerator';
import { curriculumService } from '../../curriculum/curriculumService';
import type { CurriculumLessonConcept } from '../../../types/teachingSession';
import type { HomeworkQuestion } from '../../../types/homework';

let passed = 0;
let failed = 0;

const check = (name: string, condition: boolean) => {
  if (condition) {
    passed += 1;
    console.log(`✅ [PASS] ${name}`);
  } else {
    failed += 1;
    console.error(`❌ [FAIL] ${name}`);
  }
};

const concept: CurriculumLessonConcept = {
  id: 'conc_test',
  conceptNumber: 1,
  titleAr: 'القيمة المكانية',
  titleEn: 'Place value',
  sourceText: 'Each rank to the right is ten times smaller.',
  keyPoints: ['0,1 = 10 centièmes'],
  dailyLifeExampleAr: 'مثال',
  dailyLifeExampleEn: 'example',
  storyAnalogyAr: 'قصة',
  storyAnalogyEn: 'story',
  prerequisiteAr: 'الأعداد الصحيحة',
  prerequisiteEn: 'whole numbers',
  visualType: 'number_line',
  misconceptions: [
    {
      id: 'mis_shift',
      trigger: '0,04',
      explanation: 'The digit value depends on its position.',
      remediation: 'Count the ranks: dixième, centième, millième.',
    },
  ],
};

// 1. Trigger matching.
{
  check('1.1 an exact trigger matches', matchMisconception('0,04', concept.misconceptions)?.id === 'mis_shift');
  check('1.2 an unrelated answer matches nothing', matchMisconception('0,004', concept.misconceptions) === undefined);
  check('1.3 no misconception list is safe', matchMisconception('anything', undefined) === undefined);
}

// 2. The coordinator prioritises correctly.
{
  const due = selectTeachingSkill({ concept, studentInput: '', attemptCount: 0, reviewDue: true });
  check('2.1 a due review wins', due.intent === 'schedule_recheck');

  const wrong = selectTeachingSkill({ concept, studentInput: '0,04', attemptCount: 0 });
  check('2.2 a matching misconception is named', wrong.intent === 'name_misconception');
  check('2.3 the named misconception is the right one', wrong.misconception?.id === 'mis_shift');

  const stuck = selectTeachingSkill({
    concept,
    studentInput: 'لا أعرف',
    attemptCount: VISUAL_ESCALATION_ATTEMPT,
  });
  check('2.4 a stuck learner gets a visual', stuck.intent === 'show_visual');

  const low = selectTeachingSkill({ concept, studentInput: 'لا أعرف', attemptCount: 1, confidenceBand: 'low' });
  check('2.5 low confidence gets layered explanation', low.intent === 'explain_layer');

  const fine = selectTeachingSkill({ concept, studentInput: '', attemptCount: 0, confidenceBand: 'high' });
  check('2.6 otherwise the tutor probes', fine.intent === 'socratic_probe');
}

// 3. A skill result carries its own id.
{
  const r = diagnoseMisconceptionSkill.run({ concept, studentInput: '0,04', attemptCount: 0 });
  check('3.1 the diagnosis skill reports its id', r.skillId === 'diagnose-misconception');
  const noMatch = diagnoseMisconceptionSkill.run({ concept, studentInput: '0,004', attemptCount: 0 });
  check('3.2 an unmatched answer falls back to probing', noMatch.intent === 'socratic_probe');

  const layers = explainInLayersSkill.run({ concept, studentInput: '', attemptCount: 0, confidenceBand: 'low' });
  check('3.3 the low band keeps it simple', layers.message.includes('simple'));

  const vis = groundedVisualSkill.run({ concept, studentInput: '', attemptCount: 5 });
  check('3.4 the visual skill asks for the structured visual', vis.message.includes('visual'));
}

// 4. Misconception-aware evaluation names the wrong answer from data.
{
  const q: HomeworkQuestion = {
    id: 'q1',
    homeworkItemId: 'h1',
    type: 'multiple_choice',
    prompt: 'Valeur du chiffre 4 dans 5,842 ?',
    correctAnswer: '0,04',
    options: ['0,4', '0,04', '0,004'],
    hint: 'Regarde la position.',
    workedStep: 'Compte les rangs.',
    explanation: '4 est au deuxième rang: 0,04.',
    distractors: ['0,004|mis_shift'],
  };
  const wrong = evaluateStudentAnswer(q, '0,004');
  check('4.1 a distractor names its misconception', wrong.misconceptionId === 'mis_shift');
  check('4.2 a wrong answer is still marked wrong', wrong.isCorrect === false);

  const right = evaluateStudentAnswer(q, '0,04');
  check('4.3 a correct answer has no misconception', right.isCorrect === true && right.misconceptionId === undefined);

  const off = evaluateStudentAnswer(q, 'zzz');
  check('4.4 an uncurated wrong answer names nothing', off.isCorrect === false && off.misconceptionId === undefined);
}

// 5. The anchor lesson actually ships misconception data (not just the type).
{
  const lesson = curriculumService.getLessonById('off_mathfr_u1_l1_decimaux');
  const shipped = lesson?.concepts?.[0]?.misconceptions?.length || 0;
  check('5.1 the anchor lesson carries real misconceptions', shipped >= 1);

  const mathFrLessonIds = [
    'off_mathfr_u1_l1_decimaux',
    'off_mathfr_u1_l2_comparer',
    'off_mathfr_u2_l1_fractions',
    'off_mathfr_u3_l1_division',
  ];
  const covered = mathFrLessonIds.filter((id) => {
    const l = curriculumService.getLessonById(id);
    return (l?.concepts || []).some((c) => (c.misconceptions?.length || 0) > 0);
  });
  check('5.2 every French-math lesson carries misconception data', covered.length === mathFrLessonIds.length);

  const allDistractorsResolve = mathFrLessonIds.every((id) => {
    const l = curriculumService.getLessonById(id);
    const ids = new Set<string>();
    (l?.concepts || []).forEach((c) => (c.misconceptions || []).forEach((m) => ids.add(m.id)));
    return (l?.concepts || []).every((c) =>
      (c.distractors || []).every((d) => {
        const [, misId] = String(d).split('|');
        return !!misId && ids.has(misId);
      })
    );
  });
  check('5.3 every distractor points at a misconception declared in the same lesson', allDistractorsResolve);
}

// 6. Arabic misconception content ships too (ask #3), and numeric triggers
//    match the exact option, never the correct answer.
{
  const arLessons = [
    'off_math_u1_l1',
    'off_math_u1_l2',
    'off_math_u1_l4',
    'off_math_u1_l5',
    'off_math_u2_l5',
  ];
  const allCovered = arLessons.every((id) => {
    const l = curriculumService.getLessonById(id);
    return (l?.concepts || []).some((c) => (c.misconceptions?.length || 0) > 0);
  });
  check('6.1 the Arabic maths lessons carry misconception data', allCovered);

  let allResolve = true;
  let wrongsDistinct = true;
  for (const id of arLessons) {
    const l = curriculumService.getLessonById(id);
    for (const c of l?.concepts || []) {
      const ids = new Set<string>();
      (c.misconceptions || []).forEach((m) => ids.add(m.id));
      for (const d of c.distractors || []) {
        const [value, misId] = String(d).split('|');
        if (!misId || !ids.has(misId)) allResolve = false;
        const matched = matchMisconception(value, c.misconceptions);
        if (matched?.id !== misId) allResolve = false;
      }
      // Two different wrong options must not collapse to one diagnosis.
      const wrongOptions = (c.distractors || []).map((d) => String(d).split('|')[0]);
      const diagnosed = new Set(wrongOptions.map((w) => matchMisconception(w, c.misconceptions)?.id));
      if (diagnosed.size !== wrongOptions.length) wrongsDistinct = false;
    }
  }
  check('6.2 every Arabic distractor names its own misconception', allResolve);
  check('6.3 distinct wrong options get distinct diagnoses', wrongsDistinct);

  // The correct answer must never be diagnosed as a misconception.
  const anchor = curriculumService.getLessonById('off_math_u2_l5');
  const gcdConcept = anchor?.concepts[0];
  check(
    '6.4 the correct answer is not mistaken for a misconception',
    matchMisconception('4', gcdConcept?.misconceptions) === undefined
  );
}

// 7. Arabic misconception content for ICT (ask #3, second subject).
//    Every ICT concept is Arabic-taught and every wrong option must name its own
//    misconception, or an Arabic child studying ICT gets a model answer instead
//    of a real diagnosis.
{
  const ictLessons = curriculumService.getAllLessons().filter((l) => l.subjectId === 'subj_ict');

  const allCovered = ictLessons.every((l) =>
    l.concepts.every((c) => (c.misconceptions?.length || 0) > 0)
  );
  check('7.1 every ICT concept carries Arabic misconception data', allCovered);

  let distractorResolves = true;
  let wrongsDistinct = true;
  let correctNeverDiagnosed = true;
  for (const l of ictLessons) {
    for (const c of l.concepts) {
      const ids = new Set<string>((c.misconceptions || []).map((m) => m.id));
      for (const d of c.distractors || []) {
        const [value, misId] = String(d).split('|');
        if (!misId || !ids.has(misId)) distractorResolves = false;
        if (matchMisconception(value, c.misconceptions)?.id !== misId) distractorResolves = false;
      }
      const wrongOptions = (c.distractors || []).map((d) => String(d).split('|')[0]);
      const diagnosed = new Set(wrongOptions.map((w) => matchMisconception(w, c.misconceptions)?.id));
      if (diagnosed.size !== wrongOptions.length) wrongsDistinct = false;
      // The correct answer of any exercise in the lesson must stay undiagnosed.
      for (const ex of l.exercises) {
        if (ex.type !== 'multiple_choice') continue;
        if (matchMisconception(String(ex.expectedAnswer), c.misconceptions)) correctNeverDiagnosed = false;
      }
    }
  }
  check('7.2 every ICT distractor names its own misconception', distractorResolves);
  check('7.3 distinct ICT wrong options get distinct diagnoses', wrongsDistinct);
  check('7.4 a correct ICT answer is never diagnosed as a misconception', correctNeverDiagnosed);
}

// 8. Arabic misconception content for the remaining Arabic-taught subjects
//    (ask #3, third wave): Arabic Language, Social Studies, Islamic Studies and
//    Calligraphy. Each wrong option must name its own misconception, a distinct
//    wrong option must get a distinct diagnosis, and the correct answer must
//    never be diagnosed (the Arabic-language matcher's 0.5 token-overlap path
//    can mis-fire on a shared generic word).
{
  const newSubjects = ['subj_arabic', 'subj_social_studies', 'subj_islamic', 'subj_calligraphy'];
  const lessons = curriculumService.getAllLessons().filter((l) => newSubjects.includes(l.subjectId));

  let allCovered = true;
  let distractorResolves = true;
  let wrongsDistinct = true;
  let correctNeverDiagnosed = true;
  let triggersSelfMatch = true;
  for (const l of lessons) {
    for (const c of l.concepts) {
      const mis = c.misconceptions || [];
      if (mis.length === 0) allCovered = false;
      const ids = new Set(mis.map((m) => m.id));
      for (const m of mis) {
        if (matchMisconception(m.trigger, mis)?.id !== m.id) triggersSelfMatch = false;
      }
      for (const d of c.distractors || []) {
        const [value, misId] = String(d).split('|');
        if (!misId || !ids.has(misId)) distractorResolves = false;
        if (matchMisconception(value, mis)?.id !== misId) distractorResolves = false;
      }
      const wrongOptions = (c.distractors || []).map((d) => String(d).split('|')[0]);
      const diagnosed = new Set(wrongOptions.map((w) => matchMisconception(w, mis)?.id));
      if (diagnosed.size !== wrongOptions.length) wrongsDistinct = false;
      for (const ex of l.exercises) {
        if (ex.type !== 'multiple_choice') continue;
        if (matchMisconception(String(ex.expectedAnswer), mis)) correctNeverDiagnosed = false;
      }
    }
  }
  check('8.1 every Arabic-taught subject concept carries misconception data', allCovered);
  check('8.2 every new distractor names its own misconception', distractorResolves);
  check('8.3 distinct new wrong options get distinct diagnoses', wrongsDistinct);
  check('8.4 a correct answer in the new subjects is never diagnosed', correctNeverDiagnosed);
  check('8.5 every new trigger matches itself', triggersSelfMatch);
}

// 9. Arabic misconception content for Mathematics (ask #3, final Arabic wave).
//    Seven Arabic maths lessons still had zero misconception data, so a wrong
//    Arabic maths answer fell through to the model. Every remaining Arabic maths
//    concept now carries a diagnosis. Triggers are whole numeric expressions or
//    distinctive Arabic phrases, never a bare digit that also occurs in the
//    correct answer, so the correct answer can never be diagnosed.
{
  const mathLessons = curriculumService
    .getAllLessons()
    .filter((l) => l.subjectId === 'subj_math' && !l.id.startsWith('off_mathfr_'));

  const allCovered = mathLessons.every((l) =>
    l.concepts.every((c) => (c.misconceptions?.length || 0) > 0)
  );
  check('9.1 every Arabic maths concept carries misconception data', allCovered);

  let distractorResolves = true;
  let wrongsDistinct = true;
  let correctNeverDiagnosed = true;
  let triggersSelfMatch = true;
  let allArabic = true;
  for (const l of mathLessons) {
    for (const c of l.concepts) {
      const mis = c.misconceptions || [];
      const ids = new Set(mis.map((m) => m.id));
      for (const m of mis) {
        if (matchMisconception(m.trigger, mis)?.id !== m.id) triggersSelfMatch = false;
        if (!/[\u0600-\u06FF]/.test(`${m.explanation} ${m.remediation}`)) allArabic = false;
      }
      for (const d of c.distractors || []) {
        const [value, misId] = String(d).split('|');
        if (!misId || !ids.has(misId)) distractorResolves = false;
        if (matchMisconception(value, mis)?.id !== misId) distractorResolves = false;
      }
      const wrongOptions = (c.distractors || []).map((d) => String(d).split('|')[0]);
      const diagnosed = new Set(wrongOptions.map((w) => matchMisconception(w, mis)?.id));
      if (diagnosed.size !== wrongOptions.length) wrongsDistinct = false;
      for (const ex of l.exercises) {
        if (ex.type !== 'multiple_choice') continue;
        if (matchMisconception(String(ex.expectedAnswer), mis)) correctNeverDiagnosed = false;
      }
    }
  }
  check('9.2 every maths distractor names its own misconception', distractorResolves);
  check('9.3 distinct maths wrong options get distinct diagnoses', wrongsDistinct);
  check('9.4 a correct maths answer is never diagnosed as a misconception', correctNeverDiagnosed);
  check('9.5 every maths trigger matches itself', triggersSelfMatch);
  check('9.6 every maths diagnosis is written in Arabic', allArabic);
}

// 10. The French-maths track is diagnosable for an Arabic child (ask #3, final
//     gap). Its misconceptions were authored in French, so an Arabic child who
//     tapped a wrong option fell through to the model. Each now carries an
//     Arabic rendering, and the comparison-sign triggers ("<", "=") match their
//     own option after the matcher learned to compare symbols. The correct
//     answer must still never be diagnosed.
{
  const mathFrLessons = curriculumService
    .getAllLessons()
    .filter((l) => l.id.startsWith('off_mathfr_'));

  let allArabic = true;
  let distractorResolves = true;
  let correctNeverDiagnosed = true;
  let symbolTriggersMatch = true;
  for (const l of mathFrLessons) {
    for (const c of l.concepts) {
      const mis = c.misconceptions || [];
      for (const m of mis) {
        if (!speaksLanguage(misconceptionText(m, 'ar'), 'ar')) allArabic = false;
        // A symbol trigger ("<", "=") has no letters, so it must still resolve
        // to itself rather than to nothing.
        if (!/[A-Za-z\u0600-\u06FF]/.test(m.trigger) && matchMisconception(m.trigger, mis)?.id !== m.id) {
          symbolTriggersMatch = false;
        }
      }
      const ids = new Set(mis.map((m) => m.id));
      for (const d of c.distractors || []) {
        const [value, misId] = String(d).split('|');
        if (!misId || !ids.has(misId)) distractorResolves = false;
        if (matchMisconception(value, mis)?.id !== misId) distractorResolves = false;
      }
      for (const ex of l.exercises) {
        if (ex.type !== 'multiple_choice') continue;
        if (matchMisconception(String(ex.expectedAnswer), mis)) correctNeverDiagnosed = false;
      }
    }
  }
  check('10.1 every French-maths diagnosis is servable in Arabic', allArabic);
  check('10.2 every French-maths distractor names its own misconception', distractorResolves);
  check('10.3 a symbol trigger still matches itself', symbolTriggersMatch);
  check('10.4 a correct French-maths answer is never diagnosed', correctNeverDiagnosed);
}

console.log(`\nTEACHING SKILLS SUITE SUMMARY: ${passed} PASSED, ${failed} FAILED`);
if (failed > 0) process.exit(1);
