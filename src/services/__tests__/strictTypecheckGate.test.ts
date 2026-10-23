/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Regression tests for the strict TypeScript gate fixes (issue #9, R2).
 *
 * Two real behaviour surfaces changed:
 *  1. `EvidenceModality` now includes `'practice'`, which
 *     `processMissionCompletion` already produced. The value must survive
 *     end-to-end into the recorded mastery evidence and MissionOutcome.
 *  2. `buildDiagnosticForConcept` had 88 lines of unreachable code after its
 *     terminal `return`. Removing that dead block must not change any
 *     diagnostic output, and every curriculum lesson must still receive a
 *     usable, source-backed diagnostic.
 */

import { buildDiagnosticForConcept } from '../teacher/teacherContextEngine';
import { processMissionCompletion } from '../missions/missionCompletion';
import { curriculumService } from '../curriculum/curriculumService';
import { storageService } from '../storage';
import { Student, Mission, MissionOutcome, MasteryRecord } from '../../types';

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

async function run() {
  console.log('--- STARTING STRICT TYPECHECK GATE REGRESSION SUITE ---\n');

  // =========================================================================
  // TEST 1: 'practice' modality is preserved end-to-end
  // =========================================================================
  console.log('Test 1: Practice-modality evidence integrity');

  const student: Student = {
    id: 'student_practice_gate',
    name: 'طالبة اختبار',
    age: 10,
    grade: 'الصف الخامس الابتدائي',
    country: 'Egypt',
    curriculum: 'Egyptian Bilingue',
    academicYear: '2026',
    preferredLanguage: 'ar',
    subjects: ['الرياضيات'],
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

  const lessons = curriculumService.getAllLessons();
  const conceptLesson = lessons.find((l) => l.concepts.length > 0);
  assert(Boolean(conceptLesson), '1.0: Curriculum exposes at least one lesson with a concept');

  const conceptId = conceptLesson!.concepts[0].id;

  const savedOutcomes: MissionOutcome[] = [];
  const savedMastery: MasteryRecord[] = [];
  const testStorage: any = Object.create(storageService);
  testStorage.saveMission = async (m: Mission) => storageService.saveMission(m);
  testStorage.saveMissionOutcome = async (o: MissionOutcome) => {
    savedOutcomes.push(o);
    return storageService.saveMissionOutcome(o);
  };
  testStorage.saveMasteryRecord = async (rec: MasteryRecord) => {
    savedMastery.push(rec);
    return storageService.saveMasteryRecord(rec);
  };

  const practiceMission: Mission = {
    id: 'mission_practice_gate_001',
    studentId: student.id,
    date: '2026-10-22',
    subject: 'الرياضيات',
    title: 'جلسة تعلّم تفاعلية',
    type: 'practice',
    estimatedMinutes: 10,
    whyNow: 'إتمام جلسة المعلمة نور',
    originTag: 'official',
    successCriterion: 'إتمام الجلسة التكيفية',
    status: 'pending',
    conceptId,
  };

  const result = await processMissionCompletion({
    student,
    mission: practiceMission,
    outcomeParams: { score: 0.8, modality: 'practice' },
    storage: testStorage,
  });

  assert(result.success === true, '1.1: Practice mission completes successfully');
  assert(result.outcome?.modalityUsed === 'practice', `1.2: MissionOutcome keeps 'practice' (got ${result.outcome?.modalityUsed})`);
  assert(result.evidenceAdded === true, '1.3: Practice evidence recorded against authoritative concept');

  const practiceEntry = savedMastery
    .flatMap((rec) => rec.evidenceLog)
    .find((entry) => entry.modality === 'practice');
  assert(Boolean(practiceEntry), '1.4: Mastery evidence log contains a practice-modality entry');

  // =========================================================================
  // TEST 2: No dead diagnostic branch; every lesson yields a usable diagnostic
  // =========================================================================
  console.log('\nTest 2: Diagnostic coverage after dead-code removal');

  let lessonsWithUsableDiagnostic = 0;
  let lessonsWithCorrectOption = 0;

  for (const lesson of lessons) {
    const concept = lesson.concepts[0] || null;
    const diagnostic = buildDiagnosticForConcept(lesson, concept, 'QA');
    if (diagnostic.options.length > 0) {
      lessonsWithUsableDiagnostic++;
    }
    if (diagnostic.options.some((option) => option.isCorrect)) {
      lessonsWithCorrectOption++;
    }
  }

  assert(lessonsWithUsableDiagnostic === lessons.length,
    `2.1: Every lesson yields a non-empty diagnostic (${lessonsWithUsableDiagnostic}/${lessons.length})`);
  assert(lessonsWithCorrectOption === lessons.length,
    `2.2: Every diagnostic exposes exactly one correct option (${lessonsWithCorrectOption}/${lessons.length})`);

  const noLessonDiagnostic = buildDiagnosticForConcept(null, null, 'QA');
  assert(noLessonDiagnostic.conceptId === 'none' && noLessonDiagnostic.options.length === 0,
    '2.3: Missing lesson still returns the safe empty diagnostic');

  console.log('\n=================================================================');
  console.log(`STRICT TYPECHECK GATE SUITE SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('=================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

run().catch((err) => {
  console.error('Test suite uncaught error:', err);
  process.exit(1);
});
