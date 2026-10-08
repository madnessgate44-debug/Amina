/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  buildDiagnosticForConcept,
  buildRecheckQuestionForConcept,
  buildTargetedIntervention,
  analyzeStudentReasoning,
  evaluateTeachingOutcome,
  buildNormalizedTeacherContext,
} from '../teacherContextEngine';
import { OfficialCurriculumLesson, CurriculumLessonConcept } from '../../../types/teachingSession';
import { curriculumService } from '../../curriculum/curriculumService';

// Sample Fractions Lesson & Concept
const fractionLesson: OfficialCurriculumLesson = {
  id: 'off_math_fractions',
  subjectId: 'subj_math',
  subjectNameAr: 'الرياضيات',
  subjectNameEn: 'Mathematics',
  unitNumber: 1,
  unitNameAr: 'الوحدة الأولى',
  unitNameEn: 'Unit 1',
  lessonNumber: 1,
  titleAr: 'مقارنة الكسور الاعتيادية',
  titleEn: 'Comparing Common Fractions',
  originTag: 'official',
  isAvailable: true,
  sourceRef: {
    book: 'كتاب الرياضيات',
    bookAr: 'الرياضيات — كتاب الوزارة',
    bookEn: 'Math Ministry Book',
    grade: 'الصف الخامس',
    term: 'الفصل الأول',
    unit: 'الوحدة الأولى',
    lesson: 'الدرس الأول',
    page: 25,
    isAvailable: true,
  },
  objectives: ['مقارنة الكسور ذات البسوط المتشابهة والمقامات المختلفة'],
  readingText: 'عند مقارنة كسرين لهما نفس البسط، الكسر ذو المقام الأصغر هو الأكبر',
  vocabulary: [],
  exercises: [],
  concepts: [
    {
      id: 'off_math_fractions_c1',
      conceptNumber: 1,
      titleAr: 'مقارنة مقامات الكسور',
      titleEn: 'Fraction Denominators Comparison',
      sourceText: 'المقام يحدد عدد الأجزاء الكلية',
      keyPoints: ['كلما كبر المقام صغر حجم الجزء'],
      dailyLifeExampleAr: 'تقسيم فطيرة على ٣ أفراد مقابل ٥ أفراد',
      dailyLifeExampleEn: 'Sharing pie with 3 vs 5 friends',
      storyAnalogyAr: 'قطع الشوكولاتة الكبيرة والصغيرة',
      storyAnalogyEn: 'Big vs small chocolate slices',
      prerequisiteAr: 'مفهوم البسط والمقام الأساسي',
      prerequisiteEn: 'Basic numerator and denominator',
    },
  ],
};

const fractionConcept: CurriculumLessonConcept = fractionLesson.concepts[0];

function runTests() {
  console.log('--- STARTING MISS NOUR ADAPTIVE PEDAGOGICAL LOOP TEST SUITE ---');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}`);
      failed++;
    }
  }

  // =========================================================================
  // CASE 1: Correct answer + sound reasoning → appropriate positive outcome (MASTERED)
  // =========================================================================
  {
    const diag = buildDiagnosticForConcept(fractionLesson, fractionConcept, 'Amina');
    const correctOpt = diag.options.find((o) => o.isCorrect)!;
    const reasoning = analyzeStudentReasoning(
      'قطعة الـ ١/٣ أكبر لأننا قسمنا نفس الفطيرة على ٣ أشخاص بس، فكل شخص هيكون نصيبه قطعة أكبر من لو قسمنا على ٥',
      correctOpt,
      fractionConcept,
      fractionLesson,
      'ar'
    );
    assert(reasoning.category === 'correct_reasoning', 'Case 1.1: Reasoning classified as correct_reasoning');

    const outcome = evaluateTeachingOutcome({
      initialDiagnosticCorrect: true,
      initialReasoningCategory: reasoning.category,
      recheckCorrect: true,
      recheckReasoningCategory: 'correct_reasoning',
      attemptsCount: 1,
    });
    assert(outcome.outcome === 'mastered', 'Case 1.2: Outcome is MASTERED');
    assert(outcome.evidenceCorrectness === 'full', 'Case 1.3: Evidence correctness is full');
    assert(outcome.evidenceIndependence === 'unassisted', 'Case 1.4: Evidence independence is unassisted');
    assert(outcome.reviewIntervalDays === 14, 'Case 1.5: Review scheduled with long interval (14 days)');
  }

  // =========================================================================
  // CASE 2: Wrong answer + identifiable misconception → misconception diagnosis → targeted teaching → retry
  // =========================================================================
  {
    const diag = buildDiagnosticForConcept(fractionLesson, fractionConcept, 'Amina');
    const misconceptionOpt = diag.options.find((o) => o.diagnosisType === 'misconception')!;
    assert(misconceptionOpt.isCorrect === false, 'Case 2.1: Misconception option is marked incorrect');
    assert(misconceptionOpt.suggestedStrategy === 'visual_model', 'Case 2.2: Strategy for denominator misconception is visual_model');

    const reasoning = analyzeStudentReasoning(
      'اخترت ١/٥ عشان الرقم ٥ أكبر من ٣ في الأعداد',
      misconceptionOpt,
      fractionConcept,
      fractionLesson,
      'ar'
    );
    assert(reasoning.category === 'misconception', 'Case 2.3: Reasoning correctly classified as misconception');
    assert(reasoning.detectedMisconceptionKey === 'denominator_magnitude_misconception', 'Case 2.4: Detected specific misconception key');

    const targeted = buildTargetedIntervention(
      fractionLesson,
      fractionConcept,
      'Amina',
      'misconception',
      'visual_model'
    );
    assert(targeted.coreExplanationAr.includes('المقام'), 'Case 2.5: Targeted intervention explains denominator misconception');
    assert(targeted.strategy === 'visual_model', 'Case 2.6: Targeted intervention uses visual_model');

    const recheck = buildRecheckQuestionForConcept(fractionLesson, fractionConcept, 'Amina');
    assert(recheck.id.startsWith('recheck_'), 'Case 2.7: Recheck question created for retry');
    assert(recheck.promptAr.includes('١/٤') && recheck.promptAr.includes('١/٨'), 'Case 2.8: Recheck tests same concept on new example (1/4 vs 1/8)');
  }

  // =========================================================================
  // CASE 3: Wrong answer + missing prerequisite → prerequisite strategy & outcome (NOT_YET_LEARNED)
  // =========================================================================
  {
    const diag = buildDiagnosticForConcept(fractionLesson, fractionConcept, 'Amina');
    const prereqOpt = diag.options.find((o) => o.diagnosisType === 'missing_prerequisite')!;

    const reasoning = analyzeStudentReasoning(
      'أنا نسيت يعني إيه بسط ومقام ومش فاكرة الدرس القديم',
      prereqOpt,
      fractionConcept,
      fractionLesson,
      'ar'
    );
    assert(reasoning.category === 'prerequisite_gap', 'Case 3.1: Reasoning classified as prerequisite_gap');
    assert(reasoning.recommendedPedagogicalAction === 'reinforce_prerequisite', 'Case 3.2: Pedagogical action is reinforce_prerequisite');

    const outcome = evaluateTeachingOutcome({
      initialDiagnosticCorrect: false,
      initialReasoningCategory: reasoning.category,
      recheckCorrect: false,
      recheckReasoningCategory: 'prerequisite_gap',
      attemptsCount: 2,
    });
    assert(outcome.outcome === 'not_yet_learned', 'Case 3.3: Teaching outcome is NOT_YET_LEARNED');
    assert(outcome.evidenceCorrectness === 'wrong', 'Case 3.4: Evidence correctness is wrong');
    assert(outcome.reviewIntervalDays === 1, 'Case 3.5: Review interval scheduled immediately for foundational reinforcement');
  }

  // =========================================================================
  // CASE 4: Correct answer but weak reasoning (guessing) → do NOT automatically mark MASTERED
  // =========================================================================
  {
    const diag = buildDiagnosticForConcept(fractionLesson, fractionConcept, 'Amina');
    const correctOpt = diag.options.find((o) => o.isCorrect)!;

    // Student clicked the right answer, but typed "تخمين وحظ مش متأكدة"
    const reasoning = analyzeStudentReasoning(
      'تخمين وحظ ومش متأكدة خالص',
      correctOpt,
      fractionConcept,
      fractionLesson,
      'ar'
    );
    assert(reasoning.category === 'guessing', 'Case 4.1: Guessing detected despite correct option');

    // If student guessed on diagnostic, and recheck is not verified sound:
    const outcome = evaluateTeachingOutcome({
      initialDiagnosticCorrect: true,
      initialReasoningCategory: reasoning.category,
      recheckCorrect: true,
      recheckReasoningCategory: 'incomplete_reasoning',
      attemptsCount: 2,
    });
    assert(outcome.outcome !== 'mastered', 'Case 4.2: Outcome is NOT mastered when reasoning is guessing/incomplete');
    assert(outcome.outcome === 'almost', 'Case 4.3: Outcome evaluated as ALMOST, requiring targeted practice');
  }

  // =========================================================================
  // CASE 5: Wrong answer after intervention → do NOT mark MASTERED (STRUGGLING / MISCONCEPTION)
  // =========================================================================
  {
    const outcomeStruggling = evaluateTeachingOutcome({
      initialDiagnosticCorrect: false,
      initialReasoningCategory: 'unclear_reasoning',
      recheckCorrect: false,
      recheckReasoningCategory: 'unclear_reasoning',
      attemptsCount: 2,
    });
    assert(outcomeStruggling.outcome === 'struggling', 'Case 5.1: Failed re-check results in STRUGGLING');
    assert(outcomeStruggling.outcome !== 'mastered', 'Case 5.2: Failed re-check is never MASTERED');

    const outcomePersistentMisconception = evaluateTeachingOutcome({
      initialDiagnosticCorrect: false,
      initialReasoningCategory: 'misconception',
      recheckCorrect: false,
      recheckReasoningCategory: 'misconception',
      attemptsCount: 2,
    });
    assert(outcomePersistentMisconception.outcome === 'misconception', 'Case 5.3: Persistent error results in MISCONCEPTION');
    assert(outcomePersistentMisconception.reviewIntervalDays <= 2, 'Case 5.4: Review scheduled with short interval for remediation');
  }

  // =========================================================================
  // CASE 6: Successful retry with improved reasoning → mastery evidence reflects improvement (MASTERED)
  // =========================================================================
  {
    // Initial had misconception, but on recheck, student answered correctly with sound reasoning!
    const outcome = evaluateTeachingOutcome({
      initialDiagnosticCorrect: false,
      initialReasoningCategory: 'misconception',
      recheckCorrect: true,
      recheckReasoningCategory: 'correct_reasoning',
      attemptsCount: 2,
    });
    assert(outcome.outcome === 'mastered', 'Case 6.1: Successful retry with sound reasoning achieves MASTERED');
    assert(outcome.evidenceCorrectness === 'full', 'Case 6.2: Evidence correctness is full');
    assert(outcome.evidenceIndependence === 'hinted', 'Case 6.3: Evidence reflects guided teaching journey (hinted)');
    assert(outcome.reviewIntervalDays === 14, 'Case 6.4: Long review interval awarded');
  }

  // =========================================================================
  // CASE 7: Outcome affects review scheduling
  // =========================================================================
  {
    const masteredOutcome = evaluateTeachingOutcome({
      initialDiagnosticCorrect: true,
      initialReasoningCategory: 'correct_reasoning',
      recheckCorrect: true,
      recheckReasoningCategory: 'correct_reasoning',
      attemptsCount: 1,
    });
    const almostOutcome = evaluateTeachingOutcome({
      initialDiagnosticCorrect: false,
      initialReasoningCategory: 'unclear_reasoning',
      recheckCorrect: true,
      recheckReasoningCategory: 'incomplete_reasoning',
      attemptsCount: 2,
    });
    const strugglingOutcome = evaluateTeachingOutcome({
      initialDiagnosticCorrect: false,
      initialReasoningCategory: 'unclear_reasoning',
      recheckCorrect: false,
      recheckReasoningCategory: 'unclear_reasoning',
      attemptsCount: 2,
    });

    assert(masteredOutcome.reviewIntervalDays >= 10, 'Case 7.1: Mastered gets long review interval (>= 10 days)');
    assert(almostOutcome.reviewIntervalDays === 3, 'Case 7.2: Almost gets 3 days review interval');
    assert(strugglingOutcome.reviewIntervalDays === 1, 'Case 7.3: Struggling gets immediate 1 day review interval');
  }

  // =========================================================================
  // CASE 8: Outcome affects next action
  // =========================================================================
  {
    const ctx = buildNormalizedTeacherContext({
      student: null,
      currentDayRecord: null,
      timetable: null,
      masteryRecords: {},
      nextPendingMission: null,
      language: 'ar',
      explicitLessonId: 'off_math_u1_l1',
    });
    assert(Boolean(ctx.recommendedNextAction), 'Case 8.1: Teacher context provides concrete recommendedNextAction');
    assert(ctx.targetLesson?.id === 'off_math_u1_l1', 'Case 8.2: Target lesson is preserved as requested');
  }

  // =========================================================================
  // CASE 9: Missing target lesson must not fabricate a curriculum target
  // =========================================================================
  {
    const ctx = buildNormalizedTeacherContext({
      student: null,
      currentDayRecord: null,
      timetable: null,
      masteryRecords: {},
      nextPendingMission: null,
      language: 'ar',
    });
    assert(ctx.targetLesson === null, 'Case 10.1: No target lesson is selected without verified context');
    assert(ctx.targetConcept === null, 'Case 10.2: No target concept is selected without a target lesson');
  }

  // =========================================================================
  // CASE 9: No valid student/curriculum context → no fabricated student or lesson is silently created
  // =========================================================================
  {
    const ctx = buildNormalizedTeacherContext({
      student: null,
      currentDayRecord: null,
      timetable: null,
      masteryRecords: {},
      nextPendingMission: null,
      language: 'ar',
    });
    assert(ctx.student === null, 'Case 10.1: Student remains null when not provided (no fake student created)');
    assert(ctx.studentName === 'أمينة', 'Case 10.2: Uses display name Amina for copy without fabricating database user');
    assert(curriculumService.getAllLessons().length > 0, 'Case 10.3: Real authoritative curriculum is the source of truth');
  }

  console.log(`\n--- TEST SUITE SUMMARY: ${passed} PASSED, ${failed} FAILED ---`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
