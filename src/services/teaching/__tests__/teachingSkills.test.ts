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
  diagnoseMisconceptionSkill,
  explainInLayersSkill,
  groundedVisualSkill,
} from '../skills/teachingSkills';
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

console.log(`\nTEACHING SKILLS SUITE SUMMARY: ${passed} PASSED, ${failed} FAILED`);
if (failed > 0) process.exit(1);
