/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Guards registry identity, source-page mapping, and French teaching contracts.
 *
 * The current Term 1 Science book is represented by 28 numbered French lessons
 * across nine chapters. Maths remains a partial 12/46 lesson extraction.
 */

import { OFFICIAL_CURRICULUM_LESSONS } from '../../data/officialCurriculum';
import { MATH_CURRICULUM_LESSONS } from '../../data/curriculum/mathCurriculum';
import { SCIENCE_CURRICULUM_LESSONS } from '../../data/curriculum/scienceCurriculum';
import { SCIENCE_FR_CURRICULUM_LESSONS } from '../../data/curriculum/scienceFrCurriculum';
import { SCIENCE_FR_TEACHER_GUIDE_2026, SCIENCE_FR_TERM1_ENRICHMENT_2026, SCIENCE_FR_TERM1_METHOD_SKILLS_2026 } from '../../data/curriculum/scienceFrTeachingGuide2026';
import { SCIENCE_FR_CURRICULUM_2026_LESSONS } from '../../data/curriculum/scienceFrCurriculum2026';
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

// 2. The independent Ministry TOC manifest defines the real denominators.
//    These are inventory guards, not a claim that the current code is complete.
const EXPECTED_MATH_TOC_LESSONS = 46;
const EXPECTED_SCIENCE_TOC_CHAPTERS = 9;
const EXPECTED_SCIENCE_TOC_LESSONS = 28;
const ministryMathRegistered = OFFICIAL_CURRICULUM_LESSONS.filter(
  (lesson) => MATH_CURRICULUM_LESSONS.some((source) => source.id === lesson.id),
);
const ministryScienceRegistered = OFFICIAL_CURRICULUM_LESSONS.filter(
  (lesson) => SCIENCE_CURRICULUM_LESSONS.some((source) => source.id === lesson.id),
);
const mathRegistered = OFFICIAL_CURRICULUM_LESSONS.filter((lesson) => lesson.subjectId === 'subj_math');
const scienceRegistered = OFFICIAL_CURRICULUM_LESSONS.filter((lesson) => lesson.subjectId === 'subj_science');

check(
  `2.1 all current Ministry Maths source records are registered exactly once (${MATH_CURRICULUM_LESSONS.length} source records)`,
  ministryMathRegistered.length === MATH_CURRICULUM_LESSONS.length &&
    new Set(ministryMathRegistered.map((lesson) => lesson.id)).size === MATH_CURRICULUM_LESSONS.length,
);
check(
  `2.2 all current Ministry Science source records are registered exactly once (${SCIENCE_CURRICULUM_LESSONS.length} source records)`,
  ministryScienceRegistered.length === SCIENCE_CURRICULUM_LESSONS.length &&
    new Set(ministryScienceRegistered.map((lesson) => lesson.id)).size === SCIENCE_CURRICULUM_LESSONS.length,
);

const mathCoverageGap = EXPECTED_MATH_TOC_LESSONS - MATH_CURRICULUM_LESSONS.length;
const science2026Ids = new Set(SCIENCE_FR_CURRICULUM_2026_LESSONS.map((lesson) => lesson.id));
const science2026Registered = OFFICIAL_CURRICULUM_LESSONS.filter((lesson) => science2026Ids.has(lesson.id));
const expectedLessonsPerChapter: Record<number, number> = { 1: 4, 2: 2, 3: 5, 4: 2, 5: 3, 6: 3, 7: 3, 8: 3, 9: 3 };
const actualLessonsPerChapter = Array.from({ length: EXPECTED_SCIENCE_TOC_CHAPTERS }, (_, i) =>
  SCIENCE_FR_CURRICULUM_2026_LESSONS.filter((lesson) => lesson.unitNumber === i + 1).length,
);
const scienceSourcePagesMissing = SCIENCE_FR_CURRICULUM_2026_LESSONS.filter((lesson) => !lesson.sourceRef.page);
check(
  `2.4 current Science Term 1 contains all ${EXPECTED_SCIENCE_TOC_LESSONS} numbered lessons across nine chapters`,
  SCIENCE_FR_CURRICULUM_2026_LESSONS.length === EXPECTED_SCIENCE_TOC_LESSONS &&
    science2026Registered.length === EXPECTED_SCIENCE_TOC_LESSONS &&
    actualLessonsPerChapter.every((count, index) => count === expectedLessonsPerChapter[index + 1]) &&
    scienceSourcePagesMissing.length === 0,
);
check(
  `2.5 current Science Term 1 French assessment coverage (${SCIENCE_FR_CURRICULUM_2026_LESSONS.filter((lesson) => !lesson.exercisesByLanguage?.fr || lesson.exercisesByLanguage.fr.length < 2).length} incomplete)`,
  SCIENCE_FR_CURRICULUM_2026_LESSONS.every((lesson) => lesson.exercisesByLanguage?.fr && lesson.exercisesByLanguage.fr.length >= 2),
);

const expectedSciencePageRanges: Record<string, string> = {
  '1-1': '6–7', '1-2': '8–11', '1-3': '12–13', '1-4': '14–18',
  '2-1': '20–21', '2-2': '22–25',
  '3-1': '28–29', '3-2': '30–33', '3-3': '34–35', '3-4': '36–39', '3-5': '40–43',
  '4-1': '44–45', '4-2': '46–49',
  '5-1': '52–54', '5-2': '55–59', '5-3': '60–63',
  '6-1': '64–65', '6-2': '66–67', '6-3': '68–71',
  '7-1': '72–73', '7-2': '74–75', '7-3': '76–79',
  '8-1': '80–81', '8-2': '82–85', '8-3': '86–89',
  '9-1': '92–93', '9-2': '94–97', '9-3': '98–101',
};
const incompleteScienceGuides = SCIENCE_FR_CURRICULUM_2026_LESSONS.filter((lesson) => {
  const key = `${lesson.unitNumber}-${lesson.lessonNumber}`;
  const guide = lesson.teacherGuide;
  if (!guide) return true;
  const guideText = [
    guide.explanationFr,
    guide.workedExampleFr,
    ...guide.guidedPracticeFr.flatMap((item) => [item.prompt, item.expectedAnswer]),
    ...guide.independentPracticeFr.flatMap((item) => [item.prompt, item.expectedAnswer]),
    ...guide.answerKeyFr,
    ...guide.misconceptionDiagnosisFr.flatMap((item) => [item.observedResponse, item.diagnosis, item.correctivePrompt]),
    ...guide.remediationFr,
    ...guide.masteryCheckFr.flatMap((item) => [item.prompt, item.expectedAnswer, item.successCriterion]),
  ];
  return guide.provenance !== 'app_authored' ||
    !guide.sourceEdition.includes('2026–2027') ||
    guide.sourcePages !== expectedSciencePageRanges[key] ||
    guide.explanationFr.trim().length < 180 ||
    !guide.workedExampleFr.trim() ||
    guide.guidedPracticeFr.length < 2 ||
    guide.independentPracticeFr.length < 2 ||
    guide.answerKeyFr.length !== guide.independentPracticeFr.length ||
    guide.independentPracticeFr.some((item, index) => item.expectedAnswer !== guide.answerKeyFr[index]) ||
    guide.misconceptionDiagnosisFr.length < 1 ||
    guide.remediationFr.length < 1 ||
    guide.masteryCheckFr.length < 2 ||
    guideText.some((value) => !value.trim() || /TODO|placeholder|lorem/i.test(value) || /[\\u0600-\\u06FF]/.test(value));
});
check(
  `2.7 all 28 current Science lessons have complete app-authored French teaching plans (${incompleteScienceGuides.length} incomplete)`,
  SCIENCE_FR_CURRICULUM_2026_LESSONS.length === 28 && incompleteScienceGuides.length === 0,
);
if (incompleteScienceGuides.length > 0) {
  console.error('   incomplete teacher guides:', incompleteScienceGuides.map((lesson) => lesson.id));
}
check(
  '2.8 enrichment and scientific-method material from the student book are indexed',
  SCIENCE_FR_TERM1_ENRICHMENT_2026.length === 6 && SCIENCE_FR_TERM1_METHOD_SKILLS_2026.length === 4,
);
const legacyScienceIds = new Set([...SCIENCE_CURRICULUM_LESSONS, ...SCIENCE_FR_CURRICULUM_LESSONS].map((lesson) => lesson.id));
const legacyScienceRegistered = OFFICIAL_CURRICULUM_LESSONS.filter((lesson) => legacyScienceIds.has(lesson.id));
check(
  `2.9 legacy Science records are retained only as unavailable compatibility entries (${legacyScienceRegistered.filter((lesson) => lesson.isAvailable || lesson.contentStatus !== 'pending_materials').length} incorrectly available)`,
  legacyScienceRegistered.length === legacyScienceIds.size &&
    legacyScienceRegistered.every((lesson) => !lesson.isAvailable && lesson.contentStatus === 'pending_materials'),
);
check(
  `2.6 obsolete French Science lessons are unavailable (${OFFICIAL_CURRICULUM_LESSONS.filter((lesson) => lesson.id.startsWith('off_scifr_') && !lesson.id.startsWith('off_scifr_2026_') && lesson.isAvailable).length} incorrectly available)`,
  OFFICIAL_CURRICULUM_LESSONS.filter((lesson) => lesson.id.startsWith('off_scifr_') && !lesson.id.startsWith('off_scifr_2026_')).every((lesson) => !lesson.isAvailable),
);
console.log(
  `[CURRICULUM COVERAGE] Maths: ${MATH_CURRICULUM_LESSONS.length}/${EXPECTED_MATH_TOC_LESSONS} Term 1 TOC lessons; Science: ${SCIENCE_FR_CURRICULUM_2026_LESSONS.length}/${EXPECTED_SCIENCE_TOC_LESSONS} Term 1 lessons across nine chapters. Maths remains incomplete.`,
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

// 3.1a source pages are checked against a fixed audit fixture, not read back
//      from the same arrays used to build the registry.
const expectedSourcePageById: Record<string, number> = {
  off_math_u1_l1: 3,
  off_math_u1_l2: 7,
  off_math_u1_l3: 11,
  off_math_u1_l4: 15,
  off_math_u1_l5: 17,
  off_math_u2_l1: 44,
  off_math_u2_l4: 51,
  off_math_u2_l5: 54,
  off_math_u2_l7: 59,
  off_math_u3_l1: 65,
  off_math_u3_l3: 72,
  off_math_u6_l1: 121,
  off_sci_u1_l1_plant_needs: 10,
  off_sci_u1_l2_ecosystem: 20,
  off_sci_u1_l3_coral_bleaching: 34,
};
const wrongSourcePages = [...MATH_CURRICULUM_LESSONS, ...SCIENCE_CURRICULUM_LESSONS]
  .filter((lesson) => expectedSourcePageById[lesson.id] !== lesson.sourceRef.page);
check(
  `3.1a current Ministry records retain the independently audited source page (${wrongSourcePages.length} wrong)`,
  wrongSourcePages.length === 0,
);
if (wrongSourcePages.length > 0) {
  console.error('   wrong source pages:', wrongSourcePages.map((lesson) => ({
    id: lesson.id, expected: expectedSourcePageById[lesson.id], actual: lesson.sourceRef.page,
  })));
}

const wrongSubjectMappings = OFFICIAL_CURRICULUM_LESSONS.filter((lesson) => {
  if (MATH_CURRICULUM_LESSONS.some((source) => source.id === lesson.id)) return lesson.subjectId !== 'subj_math';
  if (SCIENCE_CURRICULUM_LESSONS.some((source) => source.id === lesson.id)) return lesson.subjectId !== 'subj_science';
  return false;
});
check(
  `3.1b Ministry source records retain their correct subject mapping (${wrongSubjectMappings.length} wrong)`,
  wrongSubjectMappings.length === 0,
);
if (wrongSubjectMappings.length > 0) {
  console.error('   wrong subject mappings:', wrongSubjectMappings.map((lesson) => ({
    id: lesson.id, subjectId: lesson.subjectId,
  })));
}

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

const ministryConceptsMissingFrenchKeyPoints = [...MATH_CURRICULUM_LESSONS, ...SCIENCE_CURRICULUM_LESSONS, ...SCIENCE_FR_CURRICULUM_2026_LESSONS]
  .flatMap((lesson) => lesson.concepts.filter((concept) =>
    !FRENCH_TRACK_CONTENT[concept.id]?.keyPointsFr?.length,
  ).map((concept) => ({ lesson: lesson.id, concept: concept.id })));
check(
  `7.2 every Ministry Maths/Science concept has structured French key points (${ministryConceptsMissingFrenchKeyPoints.length} missing)`,
  ministryConceptsMissingFrenchKeyPoints.length === 0,
);
if (ministryConceptsMissingFrenchKeyPoints.length > 0) {
  console.error('   missing French key points:', ministryConceptsMissingFrenchKeyPoints);
}


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
  '7.3 French Science teaching turn uses French overlay and contains no Arabic script',
  frenchTeachingText.includes("L'usine alimentaire de la plante verte") &&
    !/[\u0600-\u06FF]/.test(frenchTeachingText),
);


 
// 8. Registry identity and language contracts are checked independently of array lengths.
const duplicateLessonIds = OFFICIAL_CURRICULUM_LESSONS
  .map((lesson) => lesson.id)
  .filter((id, index, all) => all.indexOf(id) !== index);
check(
  `8.1 registered lesson ids are globally unique (${duplicateLessonIds.length} duplicates)`,
  duplicateLessonIds.length === 0,
);
if (duplicateLessonIds.length > 0) console.error('   duplicate lesson ids:', duplicateLessonIds);

const duplicateConceptIds = OFFICIAL_CURRICULUM_LESSONS.flatMap((lesson) =>
  lesson.concepts.map((concept) => ({ subjectId: lesson.subjectId, conceptId: concept.id, lessonId: lesson.id })),
).filter((entry, index, all) =>
  all.findIndex((candidate) => candidate.subjectId === entry.subjectId && candidate.conceptId === entry.conceptId) !== index,
);
check(
  `8.2 concept ids are unique within each subject (${duplicateConceptIds.length} duplicates)`,
  duplicateConceptIds.length === 0,
);
if (duplicateConceptIds.length > 0) console.error('   duplicate concepts:', duplicateConceptIds);

const incorrectlyTaggedFrenchLessons = OFFICIAL_CURRICULUM_LESSONS.filter((lesson) =>
  ['subj_math', 'subj_science'].includes(lesson.subjectId) &&
  (!lesson.subjectNameFr || lesson.instructionLanguage !== 'fr' ||
    lesson.contentLanguage !== 'fr' || lesson.assessmentLanguage !== 'fr'),
);
check(
  `8.3 Grade 5 Maths and Science registry entries declare the French learning track (${incorrectlyTaggedFrenchLessons.length} inconsistent)`,
  incorrectlyTaggedFrenchLessons.length === 0,
);
if (incorrectlyTaggedFrenchLessons.length > 0) {
  console.error('   inconsistent French-track metadata:', incorrectlyTaggedFrenchLessons.map((lesson) => lesson.id));
}

console.log(`\nCURRICULUM REGISTRY SUITE SUMMARY: ${passed} PASSED, ${failed} FAILED`);
if (failed > 0) process.exit(1);
