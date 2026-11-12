/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Guards the curriculum registry against a whole book being written but never
 * registered. This is not hypothetical: `mathCurriculum.ts` (12 lessons) and
 * `scienceCurriculum.ts` (3 lessons) were exported and imported nowhere, so
 * most of both Ministry books was unreachable in the app while the audit
 * reported only the handful of lessons that happened to load.
 */

import { OFFICIAL_CURRICULUM_LESSONS } from '../../data/officialCurriculum';
import { MATH_CURRICULUM_LESSONS } from '../../data/curriculum/mathCurriculum';
import { SCIENCE_CURRICULUM_LESSONS } from '../../data/curriculum/scienceCurriculum';
import { MATH_FR_CURRICULUM_LESSONS } from '../../data/curriculum/mathFrCurriculum';
import { FRENCH_ASSESSMENTS } from '../../data/curriculum/frenchAssessment';
import { FRENCH_TRACK_CONTENT } from '../../data/curriculum/frenchTrackContent';
import { TeachingSessionEngine } from '../teaching/teachingSession';


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

const titles = (lessons: typeof MATH_CURRICULUM_LESSONS) => lessons.map((l) => l.titleEn);
const registered = new Set(titles(OFFICIAL_CURRICULUM_LESSONS));

// 1. Every Ministry maths and science lesson is reachable by its exact id.
const registeredIds = new Set(OFFICIAL_CURRICULUM_LESSONS.map((l) => l.id));
const missing = [...MATH_CURRICULUM_LESSONS, ...SCIENCE_CURRICULUM_LESSONS].filter(
  (l) => !registeredIds.has(l.id),
);

check('1.1 no Ministry maths or science lesson is orphaned from the registry', missing.length === 0);
if (missing.length > 0) console.error('   orphaned:', missing);

// 2. The two books are far wider than the French-section extract, so the
//    registry must carry more of them than the extract alone.
const mathRegistered = OFFICIAL_CURRICULUM_LESSONS.filter((l) => l.subjectId === 'subj_math');
const scienceRegistered = OFFICIAL_CURRICULUM_LESSONS.filter((l) => l.subjectId === 'subj_science');

check(
  `2.1 maths carries the full Ministry book, not just the extract (${mathRegistered.length} lessons)`,
  mathRegistered.length >= MATH_CURRICULUM_LESSONS.length,
);
check(
  `2.2 science carries the full Ministry book, not just the extract (${scienceRegistered.length} lessons)`,
  scienceRegistered.length >= SCIENCE_CURRICULUM_LESSONS.length,
);

// 3. A topic may appear once per language track but no more, so the fuller
//    Ministry book and the French-section extract stay one lesson each.
const duplicateTopics = (lessons: typeof MATH_CURRICULUM_LESSONS) => {
  const seen = new Map<string, number>();
  for (const l of lessons) {
    const key = `${l.subjectId}::${l.titleEn}`;
    seen.set(key, (seen.get(key) ?? 0) + 1);
  }
  return [...seen.entries()].filter(([, n]) => n > 1).map(([k]) => k);
};

const dupes = [...duplicateTopics(mathRegistered), ...duplicateTopics(scienceRegistered)];
check('3.1 no lesson title appears twice within a subject', dupes.length === 0);
if (dupes.length > 0) console.error('   duplicates:', dupes);

// 3.2 the ids the app targets directly must still resolve.
const loadBearing = ['off_mathfr_u1_l1_decimaux', 'off_math_u1_l1', 'off_scifr_u1_l1_plantes', 'off_sci_u1_l1_plant_needs'];
const unresolved = loadBearing.filter((id) => !registeredIds.has(id));
check('3.2 every lesson id the app targets directly still resolves', unresolved.length === 0);
if (unresolved.length > 0) console.error('   unresolved:', unresolved);

// 4. Every registered lesson can enter the mastery loop, which needs a concept.
const zeroConcept = OFFICIAL_CURRICULUM_LESSONS.filter((l) => (l.concepts ?? []).length === 0);
check(
  `4.1 every registered lesson carries at least one concept (${zeroConcept.length} empty)`,
  zeroConcept.length === 0,
);
if (zeroConcept.length > 0) console.error('   empty:', zeroConcept.map((l) => l.titleEn));

// 5. Every lesson keeps its Ministry source page, so a claim stays checkable.
const noPage = OFFICIAL_CURRICULUM_LESSONS.filter((l) => !l.sourceRef?.page);
check(`5.1 every lesson names its source page (${noPage.length} missing)`, noPage.length === 0);

// 6. The full Egyptian Grade 5 Maths and Science books are taught in French
//    on this track, so every registered assessment prompt and option must be French.
const ministryMathScience = [...MATH_CURRICULUM_LESSONS, ...SCIENCE_CURRICULUM_LESSONS];
const missingFrenchAssessment = ministryMathScience.filter(
  (lesson) => !FRENCH_ASSESSMENTS[lesson.id] || FRENCH_ASSESSMENTS[lesson.id].length === 0,
);
check(
  `6.1 every Ministry maths/science lesson has French assessment items (${missingFrenchAssessment.length} missing)`,
  missingFrenchAssessment.length === 0,
);
const registeredMinistry = OFFICIAL_CURRICULUM_LESSONS.filter(
  (lesson) => ministryMathScience.some((source) => source.id === lesson.id),
);
const arabicScript = /[\u0600-\u06FF]/;
const nonFrenchAssessment = registeredMinistry.filter((lesson) =>
  lesson.exercises.some((exercise) =>
    [exercise.question, ...(exercise.options ?? []), exercise.expectedAnswer ?? ''].some((value) => arabicScript.test(value)),
  ),
);
check(
  `6.2 registered Ministry maths/science assessments contain no Arabic-script text (${nonFrenchAssessment.length} affected lessons)`,
  nonFrenchAssessment.length === 0,
);
const assessmentCountMismatch = ministryMathScience.filter((source) => {
  const registeredLesson = registeredMinistry.find((lesson) => lesson.id === source.id);
  return !registeredLesson || registeredLesson.exercises.length !== FRENCH_ASSESSMENTS[source.id].length;
});
check(
  `6.3 each registered lesson uses the complete French assessment set (${assessmentCountMismatch.length} mismatches)`,
  assessmentCountMismatch.length === 0,
);

// 7. Every concept in the three owner-approved French-track subjects has a
//    French rendering. The teaching engine must not fall back to Arabic key points.
const frenchTrackSubjects = new Set(['subj_french', 'subj_math', 'subj_math_fr', 'subj_science', 'subj_science_fr']);
const frenchTrackLessons = OFFICIAL_CURRICULUM_LESSONS.filter((lesson) => frenchTrackSubjects.has(lesson.subjectId));
const conceptsMissingFrenchOverlay = frenchTrackLessons.flatMap((lesson) =>
  lesson.concepts.filter((concept) => {
    const french = FRENCH_TRACK_CONTENT[concept.id];
    return !french || !french.titleFr?.trim() || !french.sourceTextFr?.trim();
  }).map((concept) => ({ lesson: lesson.id, concept: concept.id })),
);
check(
  `7.1 all French-track lesson concepts have French title and source summary (${conceptsMissingFrenchOverlay.length} missing)`,
  conceptsMissingFrenchOverlay.length === 0,
);
if (conceptsMissingFrenchOverlay.length > 0) console.error('   missing French overlays:', conceptsMissingFrenchOverlay);

const frenchEngine = new TeachingSessionEngine();
const frenchStart = frenchEngine.initializeSession({
  studentId: 'curriculum-regression',
  lessonId: 'off_sci_u1_l1_plant_needs',
  language: 'fr',
});
const frenchWarmup = frenchEngine.advanceSession({
  session: frenchStart.session,
  studentInput: 'Oui',
  language: 'fr',
});
const frenchTeaching = frenchEngine.advanceSession({
  session: frenchWarmup.session,
  studentInput: 'Oui',
  language: 'fr',
});
const frenchTeachingText = frenchTeaching.newTutorTurn.text;
check(
  '7.2 French Science teaching turn uses French overlay and contains no Arabic script',
  frenchTeachingText.includes("L'usine alimentaire de la plante verte") &&
    !/[\u0600-\u06FF]/.test(frenchTeachingText),
);

console.log(`\nCURRICULUM REGISTRY SUITE SUMMARY: ${passed} PASSED, ${failed} FAILED`);
if (failed > 0) process.exit(1);
