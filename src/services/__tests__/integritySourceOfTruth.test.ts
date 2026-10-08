/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { buildNormalizedTeacherContext, buildDiagnosticForConcept } from '../teacher/teacherContextEngine';
import { planDailyMissions } from '../missions/missionPlanner';
import { curriculumService } from '../curriculum/curriculumService';
import { createInitialMasteryRecord, addEvidenceToMastery, formatMasteryView } from '../mastery/masteryEngine';
import { getAllSpacedReviewSchedules, computeConceptReviewSchedule } from '../review/spacedReviewScheduler';
import { reconcileDayWithTimetable } from '../reconstruction/dayRecordReconciliation';
import { Student, DayRecord, Timetable } from '../../types';

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`✅ [PASS] ${message}`);
    passed++;
  } else {
    console.error(`❌ [FAIL] ${message}`);
    failed++;
  }
}

async function runIntegrityTests() {
  console.log('--- STARTING PHASE 3A: INTEGRITY & SOURCE-OF-TRUTH TEST SUITE ---\n');

  // =========================================================================
  // TEST 1: No student → no fake student created
  // =========================================================================
  console.log('Test 1: Student Identity Integrity');
  const teacherContextNoStudent = buildNormalizedTeacherContext({
    student: null,
    currentDayRecord: null,
    timetable: null,
    masteryRecords: {},
    nextPendingMission: null,
  });
  assert(teacherContextNoStudent.student === null, '1.1: Teacher context student is null when no student exists');
  assert(teacherContextNoStudent.studentName === 'أمينة', '1.2: Uses display name Amina for respectful child copy without creating synthetic DB user');

  const missionPlanNoStudent = planDailyMissions({
    student: null,
    masteryRecords: {},
  });
  assert(missionPlanNoStudent.missions.length === 0, '1.3: Mission planner creates 0 missions when student is null');
  assert(missionPlanNoStudent.explanation.emptyReason === 'no_student', '1.4: Safe empty reason "no_student" emitted');
  assert(missionPlanNoStudent.explanation.needsSchoolInformation === true, '1.5: Fails safely to onboarding / profile setup');

  // =========================================================================
  // TEST 2: No timetable → no fake timetable silently created
  // =========================================================================
  console.log('\nTest 2: Timetable Integrity');
  const reconNoTimetable = reconcileDayWithTimetable(
    {
      lessonsCovered: [{ subject: 'الرياضيات', topic: 'الكسور' }],
      homeworkAssigned: [],
      notes: 'درس رياضيات',
      detectedConfidence: 'high',
    },
    null,
    'sunday',
    'ar'
  );
  assert(reconNoTimetable.discrepancies.missingTimetableSubjects === undefined, '2.1: Reconciler does not invent timetable mismatch when timetable is null');
  assert(reconNoTimetable.discrepancies.unexpectedSubjects === undefined, '2.2: Reconciler does not flag unexpected subjects when timetable is null');

  // =========================================================================
  // TEST 3: No curriculum lesson → no synthetic lesson returned
  // =========================================================================
  console.log('\nTest 3: Curriculum Source of Truth');
  const nonExistentLesson = curriculumService.getLessonById('fake_non_existent_lesson_999');
  assert(nonExistentLesson === undefined, '3.1: Unknown lesson ID returns undefined, not a synthetic lesson object');

  const diagnosticNoLesson = buildDiagnosticForConcept(null, null, 'أمينة');
  assert(diagnosticNoLesson.conceptId === 'none', '3.2: Safe fallback diagnostic has conceptId none');
  assert(diagnosticNoLesson.options.length === 0, '3.3: Does not fabricate fake diagnostic options when lesson is missing');

  // =========================================================================
  // TEST 4: Unknown subject → does not become Science
  // =========================================================================
  console.log('\nTest 4: Review Subject Mapping & Metadata');
  const testStudentId = 'student_real_123';
  const realConcepts = curriculumService.getFlatConcepts();
  const mathConcept = realConcepts.find((c) => c.subjectId === 'subj_math');
  const frenchConcept = realConcepts.find((c) => c.subjectId === 'subj_french');
  const englishConcept = realConcepts.find((c) => c.subjectId === 'subj_english');
  const socialConcept = realConcepts.find((c) => c.subjectId === 'subj_social_studies');
  const ictConcept = realConcepts.find((c) => c.subjectId === 'subj_ict');
  const islamicConcept = realConcepts.find((c) => c.subjectId === 'subj_islamic');
  const calligConcept = realConcepts.find((c) => c.subjectId === 'subj_calligraphy');

  assert(Boolean(mathConcept), '4.1: Mathematics concept exists in authoritative curriculum');
  assert(Boolean(frenchConcept), '4.2: French concept exists in authoritative curriculum');
  assert(Boolean(englishConcept), '4.3: English concept exists in authoritative curriculum');
  assert(Boolean(socialConcept), '4.4: Social studies concept exists in authoritative curriculum');
  assert(Boolean(ictConcept), '4.5: ICT concept exists in authoritative curriculum');
  assert(Boolean(islamicConcept), '4.6: Islamic studies concept exists in authoritative curriculum');
  assert(Boolean(calligConcept), '4.7: Calligraphy concept exists in authoritative curriculum');

  // Test schedule metadata for distinct subjects
  if (mathConcept) {
    const initMath = createInitialMasteryRecord(testStudentId, mathConcept.id);
    const noEvidenceSched = computeConceptReviewSchedule(testStudentId, mathConcept, initMath);
    assert(noEvidenceSched === null, '4.8: Concept with zero evidence does not enter spaced review queue');

    const { updatedRecord: mathMastery } = addEvidenceToMastery(initMath, {
      correctness: 'full',
      difficulty: 0.5,
      independence: 'unassisted',
      modality: 'quiz',
    });
    const mathSched = computeConceptReviewSchedule(testStudentId, mathConcept, mathMastery, { language: 'ar' });
    assert(mathSched !== null && mathSched.subjectName.includes('الرياضيات'), '4.9: Mathematics displays Arabic Mathematics name, not Science');
  }

  if (englishConcept) {
    const initEng = createInitialMasteryRecord(testStudentId, englishConcept.id);
    const { updatedRecord: engMastery } = addEvidenceToMastery(initEng, {
      correctness: 'full',
      difficulty: 0.5,
      independence: 'unassisted',
      modality: 'quiz',
    });
    const engSched = computeConceptReviewSchedule(testStudentId, englishConcept, engMastery, { language: 'ar' });
    assert(engSched !== null && engSched.subjectName.includes('الإنجليزية'), '4.10: English displays English subject name, not Science');
  }

  if (islamicConcept) {
    const initIsl = createInitialMasteryRecord(testStudentId, islamicConcept.id);
    const { updatedRecord: islMastery } = addEvidenceToMastery(initIsl, {
      correctness: 'full',
      difficulty: 0.5,
      independence: 'unassisted',
      modality: 'quiz',
    });
    const islSched = computeConceptReviewSchedule(testStudentId, islamicConcept, islMastery, { language: 'ar' });
    assert(islSched !== null && (islSched.subjectName.includes('الدينية') || islSched.subjectName.includes('التربية')), '4.11: Islamic studies displays religious education name, not Science');
  }

  // Unknown subject test
  const fakeConcept: any = {
    id: 'unknown_c1',
    subjectId: 'subj_robotics_ai',
    nameAr: 'مقدمة في الروبوتات',
    nameEn: 'Intro to Robotics',
    origin: 'official',
  };
  const initFake = createInitialMasteryRecord(testStudentId, fakeConcept.id);
  const { updatedRecord: fakeMastery } = addEvidenceToMastery(initFake, {
    correctness: 'full',
    difficulty: 0.5,
    independence: 'unassisted',
    modality: 'quiz',
  });
  const unknownSched = computeConceptReviewSchedule(testStudentId, fakeConcept, fakeMastery, { language: 'ar' });
  assert(unknownSched !== null && !unknownSched.subjectName.includes('العلوم'), '4.12: Unknown subject does NOT silently become Science');
  assert(unknownSched !== null && unknownSched.subjectName === 'subj_robotics_ai', '4.13: Unknown subject safely defaults to subjectId identifier');

  // =========================================================================
  // TEST 5: No mastery evidence → does not imply mastery
  // =========================================================================
  console.log('\nTest 5: Mastery Integrity');
  const initialRecord = createInitialMasteryRecord(testStudentId, 'test_concept');
  assert(initialRecord.score === 0.5, '5.1: Initial mastery score is at baseline floor 0.5');
  assert(initialRecord.confidence === 0.0, '5.2: Initial confidence is exactly 0.0 (untested)');
  assert(initialRecord.evidenceLog.length === 0, '5.3: Initial evidenceLog has 0 entries');
  const view = formatMasteryView(initialRecord, 'ar');
  assert(view.hasEvidence === false, '5.4: Mastery view explicitly reports hasEvidence=false');
  assert(view.compositeLabel.includes('دون أدلة'), '5.5: Mastery label clearly indicates no evidence yet');

  // =========================================================================
  // TEST 6: Demo curriculum isolation
  // =========================================================================
  console.log('\nTest 6: Demo Curriculum Isolation');
  const allLessons = curriculumService.getAllLessons();
  const hasDemoLessons = allLessons.some((l) => (l.originTag as string) === 'demo' || l.id.startsWith('demo_'));
  assert(!hasDemoLessons, '6.1: Authoritative curriculum contains 0 demo-origin lessons');
  assert(allLessons.length >= 10, '6.2: Authoritative curriculum contains full set of official Egyptian lessons');

  // =========================================================================
  // TEST 7: Mission planner does NOT arbitrarily restrict subjects to 4
  // =========================================================================
  console.log('\nTest 7: Mission Planner Subject Breadth');
  const realStudent: Student = {
    id: 'student_amina_real',
    name: 'أمينة',
    age: 10,
    grade: 'الصف الخامس الابتدائي',
    country: 'Egypt',
    curriculum: 'Egyptian Bilingue',
    academicYear: '2026',
    preferredLanguage: 'ar',
    subjects: ['اللغة العربية', 'الرياضيات بالفرنسية', 'العلوم بالفرنسية'],
    interviewAnswers: {
      enjoyMost: 'العلوم',
      hardest: 'الرياضيات',
      learningStyle: 'games',
      sessionDuration: '30min',
      upcomingExams: '',
    },
    isOnboarded: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const dayRecordWithSixSubjects: DayRecord = {
    id: 'dr_multi_subj',
    studentId: realStudent.id,
    date: '2026-10-07',
    lessonsCovered: [
      { subject: 'اللغة العربية', topic: 'قراءة' },
      { subject: 'الرياضيات بالفرنسية (Maths)', topic: 'الكسور' },
      { subject: 'العلوم بالفرنسية (Sciences)', topic: 'النباتات' },
      { subject: 'اللغة الفرنسية', topic: 'حوار' },
      { subject: 'اللغة الإنجليزية', topic: 'قواعد' },
      { subject: 'الدراسات الاجتماعية', topic: 'مصر القديمة' },
    ],
    homeworkAssigned: [
      { id: 'hw_1', subject: 'اللغة العربية', description: 'حل تدريبات ص 20', status: 'pending' },
      { id: 'hw_2', subject: 'الرياضيات بالفرنسية (Maths)', description: 'Exercice p 15', status: 'pending' },
      { id: 'hw_3', subject: 'العلوم بالفرنسية (Sciences)', description: 'Schéma p 30', status: 'pending' },
      { id: 'hw_4', subject: 'اللغة الفرنسية', description: 'Vocabulaire', status: 'pending' },
      { id: 'hw_5', subject: 'اللغة الإنجليزية', description: 'Workbook Unit 1', status: 'pending' },
    ],
    confirmed: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    origin: 'student_confirmed',
  };

  const planMulti = planDailyMissions({
    student: realStudent,
    dayRecord: dayRecordWithSixSubjects,
    masteryRecords: {},
    availableMinutes: 90,
  });

  const uniqueMissionSubjects = new Set(planMulti.missions.map((m) => m.subject));
  assert(uniqueMissionSubjects.size > 4, '7.1: Mission planner schedules more than 4 subjects when budget & day record warrant it (no arbitrary slice(0, 4))');

  // =========================================================================
  // TEST 8: Mission planner with no learning signal → safe onboarding state
  // =========================================================================
  console.log('\nTest 8: Mission Planner Empty / Safe Fallback');
  const planNoSignal = planDailyMissions({
    student: realStudent,
    dayRecord: null,
    timetable: null,
    masteryRecords: {},
  });
  assert(planNoSignal.missions.length === 0, '8.1: No missions generated when no school signal or history exists');
  assert(planNoSignal.explanation.needsSchoolInformation === true, '8.2: Returns needsSchoolInformation=true flag');
  assert(planNoSignal.explanation.emptyReason === 'needs_school_info', '8.3: Safe explanation reason is "needs_school_info"');

  // =========================================================================
  // TEST 9: Real student + real concept → mastery evidence works normally
  // =========================================================================
  console.log('\nTest 9: Real Evidence Recording Flow');
  if (mathConcept) {
    const initRec = createInitialMasteryRecord(realStudent.id, mathConcept.id);
    const { updatedRecord, newEntry } = addEvidenceToMastery(initRec, {
      correctness: 'full',
      difficulty: 0.5,
      independence: 'unassisted',
      modality: 'quiz',
      notes: 'Solved common fractions comparison independently',
    });
    assert(updatedRecord.score > initRec.score, '9.1: Mastery score increased after full correctness evidence');
    assert(updatedRecord.evidenceLog.length === 1, '9.2: Evidence log has 1 verified entry');
    assert(newEntry.correctness === 'full', '9.3: Evidence entry records full correctness');
    assert(updatedRecord.studentId === realStudent.id, '9.4: Evidence belongs strictly to real active student');
  }

  // =========================================================================
  // TEST 10: Miss Nour adaptive loop continues to work deterministically
  // =========================================================================
  console.log('\nTest 10: Miss Nour Adaptive Pedagogical Loop Continuity');
  const fractionLesson = allLessons.find((l) => l.id.includes('math') || l.id.includes('ar')) || allLessons[0];
  const targetConcept = fractionLesson.concepts[0];
  const diagnostic = buildDiagnosticForConcept(fractionLesson, targetConcept, realStudent.name);
  assert(diagnostic.options.length >= 2, '10.1: Diagnostic question constructed for concept');
  assert(diagnostic.conceptId === targetConcept.id, '10.2: Diagnostic question bound to real curriculum concept');

  console.log('\n=================================================================');
  console.log(`INTEGRITY TEST SUITE SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('=================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runIntegrityTests().catch((err) => {
  console.error('Test suite uncaught error:', err);
  process.exit(1);
});
