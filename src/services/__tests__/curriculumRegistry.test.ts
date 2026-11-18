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

import { readFileSync } from 'node:fs';
import { OFFICIAL_CURRICULUM_LESSONS } from '../../data/officialCurriculum';
import { MATH_CURRICULUM_LESSONS } from '../../data/curriculum/mathCurriculum';
import { SCIENCE_CURRICULUM_LESSONS } from '../../data/curriculum/scienceCurriculum';
import { SCIENCE_FR_CURRICULUM_2026_LESSONS } from '../../data/curriculum/scienceFrCurriculum2026';
import { SCIENCE_FR_TEACHER_GUIDE_2026, SCIENCE_FR_TERM1_CHAPTER_REVIEWS_2026, SCIENCE_FR_TERM1_ENRICHMENT_2026, SCIENCE_FR_TERM1_METHOD_SKILLS_2026 } from '../../data/curriculum/scienceFrTeachingGuide2026';
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
check(
  `2.6 obsolete French Science lessons are unavailable (${OFFICIAL_CURRICULUM_LESSONS.filter((lesson) => lesson.id.startsWith('off_scifr_') && !lesson.id.startsWith('off_scifr_2026_') && lesson.isAvailable).length} incorrectly available)`,
  OFFICIAL_CURRICULUM_LESSONS.filter((lesson) => lesson.id.startsWith('off_scifr_') && !lesson.id.startsWith('off_scifr_2026_')).every((lesson) => !lesson.isAvailable),
);
const legacyNationalScience = OFFICIAL_CURRICULUM_LESSONS.filter((lesson) => SCIENCE_CURRICULUM_LESSONS.some((source) => source.id === lesson.id));
check(
  `2.6a legacy national Science records are unavailable (${legacyNationalScience.filter((lesson) => lesson.isAvailable || lesson.contentStatus !== 'pending_materials').length} incorrectly available)`,
  legacyNationalScience.length === SCIENCE_CURRICULUM_LESSONS.length && legacyNationalScience.every((lesson) => !lesson.isAvailable && lesson.contentStatus === 'pending_materials'),
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

const lessonStudyModalSource = readFileSync(new URL('../../components/curriculum/LessonStudyModal.tsx', import.meta.url), 'utf8');
const teacherSequenceUiFields = [
  "activeTab === 'practice'",
  "activeTab === 'resources'",
  'lesson.supplementarySections',
  'section.summaryFr',
  'section.sourcePages',
  'teacherGuide.explanationFr',
  'teacherGuide.workedExampleFr',
  'teacherGuide.sourceEdition',
  'teacherGuide.sourcePages',
  'app-authored teaching support',
  'guidedPracticeFr',
  'independentPracticeFr',
  'answerKeyFr',
  'misconceptionDiagnosisFr',
  'remediationFr',
  'masteryCheckFr',
];
check(
  '2.10 learner lesson view exposes the complete teacher-plan practice sequence',
  teacherSequenceUiFields.every((field) => lessonStudyModalSource.includes(field)),
);

// 9. Plant-growth comparisons must name the exact controlled variables
//    recorded in the student book, not rely on an ambiguous 'other conditions'.
const sunlightPlan = SCIENCE_FR_TEACHER_GUIDE_2026['4-1'];
const fertilizerPlan = SCIENCE_FR_TEACHER_GUIDE_2026['4-2'];
const lowerFr = (value: string) => value.toLocaleLowerCase('fr');
const sunlightControls = ['eau', 'air', 'température', 'engrais', 'type de sol', 'type de plante'];
const fertilizerControls = ['eau', 'lumière', 'air', 'température', 'type de sol', 'type de plante'];
const sunlightControlPrompt = sunlightPlan.independentPracticeFr[1]?.prompt ?? '';
const fertilizerControlAnswer = fertilizerPlan.guidedPracticeFr[1]?.expectedAnswer ?? '';
check(
  '9.1 sunlight-growth lesson explicitly lists every controlled condition from the student book',
  sunlightControls.every((term) => lowerFr(sunlightPlan.explanationFr).includes(term)) &&
    sunlightControls.every((term) => lowerFr(sunlightControlPrompt).includes(term)),
);
check(
  '9.2 fertilizer-growth lesson explicitly lists every controlled condition from the student book',
  fertilizerControls.every((term) => lowerFr(fertilizerPlan.explanationFr).includes(term)) &&
    fertilizerControls.every((term) => lowerFr(fertilizerControlAnswer).includes(term)),
);

const expectedTeacherSourcePages: Record<string, string> = {
  '1-1': '6–7', '1-2': '8–11', '1-3': '12–13', '1-4': '14–17',
  '2-1': '20–21', '2-2': '22–25',
  '3-1': '28–29', '3-2': '30–33', '3-3': '34–35', '3-4': '36–39', '3-5': '40–42',
  '4-1': '44–45', '4-2': '46–49',
  '5-1': '52–54', '5-2': '55–59', '5-3': '60–62',
  '6-1': '64–65', '6-2': '66–67', '6-3': '68–71',
  '7-1': '72–73', '7-2': '74–75', '7-3': '76–79',
  '8-1': '80–81', '8-2': '82–85', '8-3': '86–89',
  '9-1': '92–93', '9-2': '94–97', '9-3': '98–101',
};
const teacherSourceRangeMismatches = SCIENCE_FR_CURRICULUM_2026_LESSONS.filter((lesson) => {
  const key = `${lesson.unitNumber}-${lesson.lessonNumber}`;
  const expected = expectedTeacherSourcePages[key];
  const plan = SCIENCE_FR_TEACHER_GUIDE_2026[key];
  const expectedStartPage = expected ? Number(expected.split('–')[0]) : Number.NaN;
  return !expected || !plan || plan.sourcePages !== expected || lesson.sourceRef.page !== expectedStartPage;
});
check(
  '9.3 all 28 French Science lessons retain their exact audited printed page ranges',
  Object.keys(expectedTeacherSourcePages).length === 28 &&
    SCIENCE_FR_CURRICULUM_2026_LESSONS.length === 28 &&
    teacherSourceRangeMismatches.length === 0,
);
const teacherPlansWithWrongProvenance = Object.values(SCIENCE_FR_TEACHER_GUIDE_2026).filter(
  (plan) => plan.provenance !== 'app_authored' || !plan.sourceEdition.includes('2026–2027'),
);
check(
  '9.4 all 28 teacher plans remain labelled app-authored for the 2026–2027 source edition',
  Object.keys(SCIENCE_FR_TEACHER_GUIDE_2026).length === 28 && teacherPlansWithWrongProvenance.length === 0,
);

const evaporationPlan = SCIENCE_FR_TEACHER_GUIDE_2026['9-1'];
const evaporationTerms = ['évaporation', 'eau liquide', 'vapeur d’eau', 'température', 'ensoleillé', 'vent'];
check(
  '9.5 lesson 9-1 teaches the complete source-grounded evaporation concept and both rate factors',
  !!evaporationPlan &&
    evaporationPlan.sourcePages === '92–93' &&
    evaporationTerms.every((term) => lowerFr(evaporationPlan.explanationFr).includes(term)) &&
    evaporationPlan.guidedPracticeFr.length >= 2 &&
    evaporationPlan.independentPracticeFr.length >= 2 &&
    evaporationPlan.masteryCheckFr.length >= 2,
);

const evaporationBookActivity = lowerFr(evaporationPlan.workedExampleFr);
const bookActivityGuided = evaporationPlan.guidedPracticeFr.some(
  (item) => lowerFr(item.prompt).includes('deux récipients') && lowerFr(item.expectedAnswer).includes('film plastique'),
);
const sourcePredictionGuided = evaporationPlan.guidedPracticeFr.some(
  (item) => lowerFr(item.prompt).includes('linge mouillé') && lowerFr(item.expectedAnswer).includes('au soleil'),
);
const bookActivityMastery = evaporationPlan.masteryCheckFr.some(
  (item) => lowerFr(item.prompt).includes('facteur') && lowerFr(item.expectedAnswer).includes('film plastique'),
);
check(
  '9.6 lesson 9-1 preserves the printed covered/uncovered-glasses activity without mislabelling it as a temperature test',
  !!evaporationPlan &&
    evaporationPlan.sourcePages === '92–93' &&
    ['linge mouillé', 'au soleil', 'à l’ombre', 'deux verres', 'film plastique', 'élastique', 'deux ou trois jours', 'ouvert', 'température', 'isolément', 'contrôle ajouté'].every((term) => evaporationBookActivity.includes(term)) &&
    bookActivityGuided &&
    sourcePredictionGuided &&
    bookActivityMastery &&
    evaporationPlan.independentPracticeFr.length >= 4,
);


const incompleteScienceTeacherPlans = Object.entries(SCIENCE_FR_TEACHER_GUIDE_2026)
  .filter(([, plan]) =>
    !plan.explanationFr.trim() ||
    !plan.workedExampleFr.trim() ||
    plan.guidedPracticeFr.length < 2 ||
    plan.guidedPracticeFr.some((item) => !item.prompt.trim() || !item.expectedAnswer.trim()) ||
    plan.independentPracticeFr.length < 2 ||
    plan.independentPracticeFr.some((item) => !item.prompt.trim() || !item.expectedAnswer.trim()) ||
    plan.answerKeyFr.length !== plan.independentPracticeFr.length ||
    plan.answerKeyFr.some((answer, index) => answer !== plan.independentPracticeFr[index]?.expectedAnswer) ||
    plan.misconceptionDiagnosisFr.length < 2 ||
    plan.misconceptionDiagnosisFr.some((item) => !item.observedResponse.trim() || !item.diagnosis.trim() || !item.correctivePrompt.trim()) ||
    plan.remediationFr.length < 2 ||
    plan.remediationFr.some((item) => !item.trim()) ||
    plan.masteryCheckFr.length < 2 ||
    plan.masteryCheckFr.some((item) => !item.prompt.trim() || !item.expectedAnswer.trim() || !item.successCriterion.trim()),
  )
  .map(([id]) => id);
check(
  '9.7 all 28 French Science teacher plans have complete, answer-aligned teaching sequences',
  Object.keys(SCIENCE_FR_TEACHER_GUIDE_2026).length === 28 && incompleteScienceTeacherPlans.length === 0,
);
if (incompleteScienceTeacherPlans.length > 0) {
  console.error('   incomplete Science teacher plans:', incompleteScienceTeacherPlans);
}


// 10. The exact nine chapter headings and per-lesson objectives/vocabulary
//     remain represented in the learner-facing French curriculum records.
const expectedChapterTitlesFr: Record<number, string> = {
  1: 'Les os et les muscles',
  2: 'Les changements des saisons',
  3: 'Les conditions de germination',
  4: 'Les conditions de croissance',
  5: 'De la fleur au fruit',
  6: 'La croissance et la reproduction humaines',
  7: 'La croissance et la reproduction des animaux',
  8: 'Les changements météorologiques',
  9: 'Le cycle de l’eau',
};
const chapterTitleMismatches = SCIENCE_FR_CURRICULUM_2026_LESSONS.filter((lesson) =>
  lesson.unitNameFr !== `Chapitre ${lesson.unitNumber} : ${expectedChapterTitlesFr[lesson.unitNumber] ?? ''}`,
);
check(
  '10.1 all 28 French Science lesson records carry the exact 2026–2027 TOC chapter heading',
  Object.keys(expectedChapterTitlesFr).length === 9 &&
    SCIENCE_FR_CURRICULUM_2026_LESSONS.length === 28 &&
    chapterTitleMismatches.length === 0,
);
const lessonsMissingObjectives = SCIENCE_FR_CURRICULUM_2026_LESSONS.filter(
  (lesson) => !lesson.objectives || lesson.objectives.length < 2 || lesson.objectives.some((item) => !item.trim()),
);
const lessonsMissingVocabulary = SCIENCE_FR_CURRICULUM_2026_LESSONS.filter(
  (lesson) => !lesson.vocabulary || lesson.vocabulary.length < 3 ||
    lesson.vocabulary.some((item) => !item.word.trim() || !item.definition.trim()),
);
check(
  `10.2 every lesson has at least two explicit learning objectives (${lessonsMissingObjectives.length} incomplete)`,
  lessonsMissingObjectives.length === 0,
);
check(
  `10.3 every lesson has at least three French vocabulary terms with definitions (${lessonsMissingVocabulary.length} incomplete)`,
  lessonsMissingVocabulary.length === 0,
);

// 10.4 Page 89 includes weather radar as well as satellite imagery.
//      Guard the source-backed concept across curriculum and teaching UI data.
const weatherRadarLesson = SCIENCE_FR_CURRICULUM_2026_LESSONS.find(
  (lesson) => lesson.unitNumber === 8 && lesson.lessonNumber === 3,
);
const weatherRadarPlan = SCIENCE_FR_TEACHER_GUIDE_2026['8-3'];
const radarTerms = ['radar météorologique', 'ondes radio', 'précipitations'];
check(
  '10.4 lesson 8-3 includes the page 89 weather-radar concept in its learner curriculum',
  !!weatherRadarLesson &&
    weatherRadarLesson.concepts.some((concept) => concept.sourceText.toLocaleLowerCase('fr').includes('radar météorologique')) &&
    weatherRadarLesson.objectives.some((item) => item.toLocaleLowerCase('fr').includes('radar')) &&
    weatherRadarLesson.vocabulary.some((item) => item.word.toLocaleLowerCase('fr').includes('radar')),
);
check(
  '10.5 lesson 8-3 teaches radar operation, use, practice and mastery',
  !!weatherRadarPlan &&
    radarTerms.every((term) => weatherRadarPlan.explanationFr.toLocaleLowerCase('fr').includes(term)) &&
    weatherRadarPlan.workedExampleFr.toLocaleLowerCase('fr').includes('radar') &&
    weatherRadarPlan.guidedPracticeFr.some((item) => item.expectedAnswer.toLocaleLowerCase('fr').includes('ondes radio')) &&
    weatherRadarPlan.independentPracticeFr.some((item) => item.expectedAnswer.toLocaleLowerCase('fr').includes('intensité')) &&
    weatherRadarPlan.masteryCheckFr.some((item) => item.prompt.toLocaleLowerCase('fr').includes('radar')),
);

// 10.6 Pages 65–67 connect human growth to reproduction, birth and parent care.
const humanGrowthLesson = SCIENCE_FR_CURRICULUM_2026_LESSONS.find(
  (lesson) => lesson.unitNumber === 6 && lesson.lessonNumber === 1,
);
const humanGrowthPlan = SCIENCE_FR_TEACHER_GUIDE_2026['6-1'];
const parentCareLesson = SCIENCE_FR_CURRICULUM_2026_LESSONS.find(
  (lesson) => lesson.unitNumber === 6 && lesson.lessonNumber === 2,
);
const parentCarePlan = SCIENCE_FR_TEACHER_GUIDE_2026['6-2'];
check(
  '10.6 lesson 6-1 includes the source-book pregnancy timeframe and reproduction continuity concepts',
  !!humanGrowthLesson &&
    humanGrowthLesson.concepts.some((concept) =>
      concept.sourceText.toLocaleLowerCase('fr').includes('neuf mois')) &&
    humanGrowthLesson.concepts.some((concept) =>
      concept.sourceText.toLocaleLowerCase('fr').includes('reproduction')) &&
    !!humanGrowthPlan &&
    humanGrowthPlan.explanationFr.toLocaleLowerCase('fr').includes('environ neuf mois') &&
    humanGrowthPlan.explanationFr.toLocaleLowerCase('fr').includes('continuité de la vie') &&
    humanGrowthPlan.guidedPracticeFr.some((item) =>
      item.expectedAnswer.toLocaleLowerCase('fr').includes('neuf mois')) &&
    humanGrowthPlan.independentPracticeFr.some((item) =>
      item.expectedAnswer.toLocaleLowerCase('fr').includes('continuité de l’espèce')),
);
check(
  '10.7 lesson 6-2 includes parents’ role in care and protection as well as inherited traits',
  !!parentCareLesson &&
    parentCareLesson.concepts.some((concept) =>
      concept.sourceText.toLocaleLowerCase('fr').includes('prennent soin')) &&
    parentCareLesson.objectives.some((item) =>
      item.toLocaleLowerCase('fr').includes('protection')) &&
    !!parentCarePlan &&
    parentCarePlan.explanationFr.toLocaleLowerCase('fr').includes('prennent soin') &&
    parentCarePlan.explanationFr.toLocaleLowerCase('fr').includes('protègent') &&
    parentCarePlan.guidedPracticeFr.some((item) =>
      item.expectedAnswer.toLocaleLowerCase('fr').includes('protection')) &&
    parentCarePlan.independentPracticeFr.some((item) =>
      item.expectedAnswer.toLocaleLowerCase('fr').includes('protection')),
);

// 11. The full teacher-ready sequence must be present for every numbered lesson.
//     This is a structural contract, not a claim that an official Ministry
//     teacher guide has been found.
const incompleteTeachingComponents = SCIENCE_FR_CURRICULUM_2026_LESSONS.flatMap((lesson) => {
  const key = `${lesson.unitNumber}-${lesson.lessonNumber}`;
  const plan = SCIENCE_FR_TEACHER_GUIDE_2026[key];
  const missing: string[] = [];
  if (!plan || plan.explanationFr.trim().split(/\s+/).length < 50) missing.push('explanation');
  if (!plan?.workedExampleFr.trim() || plan.workedExampleFr.trim().split(/\s+/).length < 20) missing.push('worked example');
  if (!plan || plan.guidedPracticeFr.length < 2 ||
      plan.guidedPracticeFr.some((item) => !item.prompt.trim() || !item.expectedAnswer.trim())) missing.push('guided practice');
  if (!plan || plan.independentPracticeFr.length < 2 ||
      plan.independentPracticeFr.some((item) => !item.prompt.trim() || !item.expectedAnswer.trim())) missing.push('independent practice');
  if (!plan || plan.answerKeyFr.length !== plan.independentPracticeFr.length ||
      plan.answerKeyFr.some((answer, index) => answer !== plan.independentPracticeFr[index]?.expectedAnswer)) missing.push('answer key');
  if (!plan || plan.misconceptionDiagnosisFr.length < 2 ||
      plan.misconceptionDiagnosisFr.some((item) => !item.observedResponse.trim() || !item.diagnosis.trim() || !item.correctivePrompt.trim())) missing.push('misconception diagnosis');
  if (!plan || plan.remediationFr.length < 2 || plan.remediationFr.some((item) => !item.trim())) missing.push('remediation');
  if (!plan || plan.masteryCheckFr.length < 2 ||
      plan.masteryCheckFr.some((item) => !item.prompt.trim() || !item.expectedAnswer.trim() || !item.successCriterion.trim())) missing.push('mastery check');
  return missing.map((component) => `${key}: ${component}`);
});
check(
  `11.1 all 28 lessons contain every teacher-ready component (${incompleteTeachingComponents.length} gaps)`,
  Object.keys(SCIENCE_FR_TEACHER_GUIDE_2026).length === 28 && incompleteTeachingComponents.length === 0,
);
if (incompleteTeachingComponents.length > 0) console.error('   incomplete plans:', incompleteTeachingComponents);
const lessonsMissingSourceCopyNote = SCIENCE_FR_CURRICULUM_2026_LESSONS.filter(
  (lesson) => !lesson.sourceRef.notes?.includes('[VERIFIED]') ||
    !lesson.sourceRef.notes?.includes('109 book pages') ||
    !lesson.sourceRef.notes?.includes('[UNPROVEN]') ||
    !lesson.sourceRef.notes?.includes('visual/layout identity') ||
    !lesson.sourceRef.notes?.includes('third-party-assembled'),
);
check(
  `11.2 all 28 lesson source records disclose verified page-text equivalence and remaining PDF identity limits (${lessonsMissingSourceCopyNote.length} missing)`,
  lessonsMissingSourceCopyNote.length === 0,
);

const expectedSciencePageRangeById: Record<string, string> = {
  'off_scifr_2026_u1_l1': '6–7',
  'off_scifr_2026_u1_l2': '8–11',
  'off_scifr_2026_u1_l3': '12–13',
  'off_scifr_2026_u1_l4': '14–17',
  'off_scifr_2026_u2_l1': '20–21',
  'off_scifr_2026_u2_l2': '22–25',
  'off_scifr_2026_u3_l1': '28–29',
  'off_scifr_2026_u3_l2': '30–33',
  'off_scifr_2026_u3_l3': '34–35',
  'off_scifr_2026_u3_l4': '36–39',
  'off_scifr_2026_u3_l5': '40–42',
  'off_scifr_2026_u4_l1': '44–45',
  'off_scifr_2026_u4_l2': '46–49',
  'off_scifr_2026_u5_l1': '52–54',
  'off_scifr_2026_u5_l2': '55–59',
  'off_scifr_2026_u5_l3': '60–62',
  'off_scifr_2026_u6_l1': '64–65',
  'off_scifr_2026_u6_l2': '66–67',
  'off_scifr_2026_u6_l3': '68–71',
  'off_scifr_2026_u7_l1': '72–73',
  'off_scifr_2026_u7_l2': '74–75',
  'off_scifr_2026_u7_l3': '76–79',
  'off_scifr_2026_u8_l1': '80–81',
  'off_scifr_2026_u8_l2': '82–85',
  'off_scifr_2026_u8_l3': '86–89',
  'off_scifr_2026_u9_l1': '92–93',
  'off_scifr_2026_u9_l2': '94–97',
  'off_scifr_2026_u9_l3': '98–101',
};
const scienceLessonsMissingPageRange = SCIENCE_FR_CURRICULUM_2026_LESSONS.filter(
  (lesson) => expectedSciencePageRangeById[lesson.id] !== lesson.sourceRef.pageRange,
);
check(
  `11.3 all 28 current Science lesson records carry exact printed page ranges (${scienceLessonsMissingPageRange.length} mismatches)`,
  Object.keys(expectedSciencePageRangeById).length === 28 &&
    SCIENCE_FR_CURRICULUM_2026_LESSONS.length === 28 &&
    scienceLessonsMissingPageRange.length === 0,
);
if (scienceLessonsMissingPageRange.length > 0) {
  console.error('   page-range mismatches:', scienceLessonsMissingPageRange.map((lesson) => lesson.id));
}

// 12. Enrichment, the separate chapter-5 review, and scientific-method appendix
//     remain distinct source-book sections, with their own printed page ranges.
const expectedEnrichmentPages = ['18–19', '26–27', '43', '50–51', '90–91', '102–103'];
const enrichmentPagesMatch = SCIENCE_FR_TERM1_ENRICHMENT_2026.map((item) => item.sourcePages).join('|') === expectedEnrichmentPages.join('|');
check(
  '12.1 all six source-book enrichment sections retain their exact printed page ranges',
  SCIENCE_FR_TERM1_ENRICHMENT_2026.length === 6 && enrichmentPagesMatch &&
    SCIENCE_FR_TERM1_ENRICHMENT_2026.every((item) => item.titleFr.trim() && item.appAuthoredSummaryFr.trim()),
);
check(
  '12.2 the chapter-5 review on printed page 63 remains separate from lesson 5-3',
  SCIENCE_FR_TERM1_CHAPTER_REVIEWS_2026.length === 1 &&
    SCIENCE_FR_TERM1_CHAPTER_REVIEWS_2026[0].sourcePages === '63' &&
    SCIENCE_FR_TERM1_CHAPTER_REVIEWS_2026[0].appAuthoredSummaryFr.trim() !== '' &&
    SCIENCE_FR_TEACHER_GUIDE_2026['5-3'].sourcePages === '60–62',
);
const expectedMethodSkillPages = ['104', '105', '106', '107'];
check(
  '12.3 all four scientific-method appendix skills retain their exact printed page ranges',
  SCIENCE_FR_TERM1_METHOD_SKILLS_2026.length === 4 &&
    SCIENCE_FR_TERM1_METHOD_SKILLS_2026.map((item) => item.sourcePages).join('|') === expectedMethodSkillPages.join('|') &&
    SCIENCE_FR_TERM1_METHOD_SKILLS_2026.every((item) => item.objectiveFr.trim() && item.teachingSequenceFr.trim()),
);

// 12.4 Guard the substantive details in enrichment pages and the methods appendix.
const enrichmentByPage = Object.fromEntries(
  SCIENCE_FR_TERM1_ENRICHMENT_2026.map((item) => [item.sourcePages, item.appAuthoredSummaryFr.toLocaleLowerCase('fr')]),
);
const methodByPage = Object.fromEntries(
  SCIENCE_FR_TERM1_METHOD_SKILLS_2026.map((item) => [item.sourcePages, item.teachingSequenceFr.toLocaleLowerCase('fr')]),
);
check(
  '12.4 page 26–27 enrichment covers fennec heat loss and galabeya airflow/colour',
  !!enrichmentByPage['26–27'] &&
    ['oreilles', 'vaisseaux sanguins', 'poils', 'galabeya', 'air plus frais', 'réfléchit'].every((term) => enrichmentByPage['26–27'].includes(term)),
);
check(
  '12.4a pages 18–19 enrichment covers the camel foot adaptations, fat reserve and heat-loss explanation',
  !!enrichmentByPage['18–19'] &&
    ['orteils', 'répartissent le poids', 'callosités', 'graisse', 'libération de chaleur'].every((term) =>
      enrichmentByPage['18–19'].includes(term),
    ),
);
check(
  '12.5 pages 50–51 enrichment covers seed dormancy and Nile sediment formation',
  !!enrichmentByPage['50–51'] &&
    ['3 000 ans', 'amidon', 'dormance', 'air sec', 'hauts plateaux', 'limon'].every((term) => enrichmentByPage['50–51'].includes(term)),
);
check(
  '12.6 pages 90–91 enrichment covers Egyptian cloud patterns and khamsin mechanism',
  !!enrichmentByPage['90–91'] &&
    ['zéro à une part sur huit', 'ouest en est', 'méditerranéenne', 'khamsin', 'dépression', 'vapeur d’eau'].every((term) => enrichmentByPage['90–91'].includes(term)),
);
check(
  '12.7 pages 102–103 enrichment covers desert condensation, African water route and Aswan storage',
  !!enrichmentByPage['102–103'] &&
    ['gouttelettes', 'océan indien', 'mer rouge', 'plateau éthiopien', 'soudan', 'haut barrage d’assouan'].every((term) => enrichmentByPage['102–103'].includes(term)),
);
check(
  '12.8 page 106 method skill records concrete plant indicators and iodine observations',
  !!methodByPage['106'] &&
    ['nombre de feuilles', 'hauteur de la tige', 'couleur', 'solution d’iode', 'tableau', 'graphique'].every((term) => methodByPage['106'].includes(term)),
);

// 12.9 Separate textbook enrichment, review and method pages must be reachable
//      from the learner lesson screen, not merely stored in an unused data export.
const lessonsWithSupplementarySections = SCIENCE_FR_CURRICULUM_2026_LESSONS.filter(
  (lesson) => (lesson.supplementarySections?.length ?? 0) > 0,
);
const attachedSupplementarySections = lessonsWithSupplementarySections.flatMap(
  (lesson) => lesson.supplementarySections ?? [],
);
const attachedEnrichmentPages = new Set(
  attachedSupplementarySections.filter((section) => section.kind === 'enrichment').map((section) => section.sourcePages),
);
const attachedReviewPages = attachedSupplementarySections.filter((section) => section.kind === 'review').map((section) => section.sourcePages);
const attachedMethodPages = attachedSupplementarySections.filter((section) => section.kind === 'method').map((section) => section.sourcePages);
const attachedPracticePages = attachedSupplementarySections.filter((section) => section.kind === 'practice').map((section) => section.sourcePages);
check(
  '12.9 all six distinct enrichment sections are attached to the relevant chapter-ending learner lessons',
  ['18–19', '26–27', '43', '50–51', '90–91', '102–103'].every((page) => attachedEnrichmentPages.has(page)) &&
    attachedEnrichmentPages.size === 6,
);
check(
  '12.10 the Chapter 5, Chapter 6 and Chapter 7 review sets are attached to their correct lessons',
  attachedReviewPages.length === 3 && attachedReviewPages.includes('63') &&
    attachedReviewPages.includes('69–71') && attachedReviewPages.includes('78–79') &&
    (SCIENCE_FR_CURRICULUM_2026_LESSONS.find((lesson) => lesson.unitNumber === 5 && lesson.lessonNumber === 3)
      ?.supplementarySections?.some((section) =>
        section.kind === 'review' && section.sourcePages === '63' && section.practiceItemsFr?.length === 5,
      ) ?? false),
);
check(
  '12.11 all four scientific-method appendix pages are attached to the lessons where the methods are practised',
  ['104', '105', '106', '107'].every((page) => attachedMethodPages.includes(page)) &&
    attachedMethodPages.length === 4,
);
check(
  '12.12 the lesson modal renders an accessible Resources tab with app-authored summaries and printed page labels',
  ["activeTab === 'resources'", 'lesson.supplementarySections.map', 'section.summaryFr', 'section.sourcePages',
    'Pages complémentaires du manuel', 'not reproduced textbook text or an official Ministry teacher guide',
    'section.practiceItemsFr.map', 'Questions de révision', 'Exercices du manuel', 'Reveal expected answer']
    .every((field) => lessonStudyModalSource.includes(field)),
);

// 12.13 Page 69 explicitly instructs learners to wash fruit and vegetables before eating.
const healthyGrowthLesson = SCIENCE_FR_CURRICULUM_2026_LESSONS.find(
  (lesson) => lesson.unitNumber === 6 && lesson.lessonNumber === 3,
);
const healthyGrowthPlan = SCIENCE_FR_TEACHER_GUIDE_2026['6-3'];
check(
  '12.13 lesson 6-3 teaches the source-book instruction to wash fruit and vegetables',
  !!healthyGrowthLesson &&
    healthyGrowthLesson.concepts.some((concept) => concept.sourceText.toLocaleLowerCase('fr').includes('bien lavés')) &&
    healthyGrowthLesson.vocabulary.some((item) => item.word.toLocaleLowerCase('fr').includes('hygiène alimentaire')) &&
    !!healthyGrowthPlan &&
    healthyGrowthPlan.explanationFr.toLocaleLowerCase('fr').includes('bien laver') &&
    healthyGrowthPlan.guidedPracticeFr.some((item) => item.expectedAnswer.toLocaleLowerCase('fr').includes('laver')) &&
    healthyGrowthPlan.independentPracticeFr.some((item) => item.expectedAnswer.toLocaleLowerCase('fr').includes('laver soigneusement')) &&
    healthyGrowthPlan.masteryCheckFr.some((item) => item.expectedAnswer.toLocaleLowerCase('fr').includes('laver soigneusement')),
);

// 12.14 Pages 69–71 practice questions and advice activities must be answerable in lesson 6-3.
const chapterSixReview = SCIENCE_FR_CURRICULUM_2026_LESSONS.find(
  (lesson) => lesson.unitNumber === 6 && lesson.lessonNumber === 3,
)?.supplementarySections?.find((section) => section.kind === 'review' && section.sourcePages === '69–71');
check(
  '12.14 lesson 6-3 exposes all fourteen app-authored advice and review questions from pages 69–71',
  !!chapterSixReview &&
    chapterSixReview.practiceItemsFr?.length === 14 &&
    ['alimentation', 'sommeil', 'activité physique', 'petite enfance', 'père et d’une mère', 'héritent',
      'parents', 'plus grand', 'collations'].every((term) =>
      chapterSixReview.practiceItemsFr?.some((item) =>
        (item.prompt + ' ' + item.expectedAnswer).toLocaleLowerCase('fr').includes(term),
      ),
    ),
);

// 12.15 Pages 78–79 review all major Chapter 7 reproduction and conservation concepts.
const chapterSevenReview = SCIENCE_FR_CURRICULUM_2026_LESSONS.find(
  (lesson) => lesson.unitNumber === 7 && lesson.lessonNumber === 3,
)?.supplementarySections?.find((section) => section.kind === 'review' && section.sourcePages === '78–79');
check(
  '12.15 lesson 7-3 exposes all eleven app-authored review questions from pages 78–79',
  !!chapterSevenReview &&
    chapterSevenReview.practiceItemsFr?.length === 11 &&
    ['donne naissance', 'lait maternel', 'tilapia', 'éclosion', 'dromadaire', 'grenouille',
      'reproduction', 'à l’intérieur', 'survie', 'réserves naturelles', 'dans l’eau'].every((term) =>
      chapterSevenReview.practiceItemsFr?.some((item) =>
        (item.prompt + ' ' + item.expectedAnswer).toLocaleLowerCase('fr').includes(term),
      ),
    ),
);

// 12.16 Printed exercise pages from Chapters 1–5 must be attached as answer-reveal resources.
const practiceResource = (unitNumber: number, lessonNumber: number, page: string) =>
  SCIENCE_FR_CURRICULUM_2026_LESSONS.find(
    (lesson) => lesson.unitNumber === unitNumber && lesson.lessonNumber === lessonNumber,
  )?.supplementarySections?.find((section) =>
    section.kind === 'practice' && section.sourcePages === page,
  );
const expectedPracticeResources = [
  { unit: 1, lesson: 4, page: '16–17', count: 8 },
  { unit: 2, lesson: 2, page: '24–25', count: 8 },
  { unit: 3, lesson: 5, page: '42', count: 6 },
  { unit: 4, lesson: 2, page: '48–49', count: 8 },
  { unit: 5, lesson: 3, page: '62', count: 4 },
  { unit: 8, lesson: 3, page: '88', count: 4 },
  { unit: 9, lesson: 3, page: '100–101', count: 4 },
];
check(
  '12.16 all seven printed exercise sets from Chapters 1–5 and 8–9 are attached to the matching lessons with complete answer keys',
  expectedPracticeResources.every((expected) => {
    const section = practiceResource(expected.unit, expected.lesson, expected.page);
    return !!section && section.practiceItemsFr?.length === expected.count;
  }) &&
    ['16–17', '24–25', '42', '48–49', '62', '88', '100–101'].every((page) => attachedPracticePages.includes(page)) &&
    attachedPracticePages.length === 7,
);

console.log(`\nCURRICULUM REGISTRY SUITE SUMMARY: ${passed} PASSED, ${failed} FAILED`);
if (failed > 0) process.exit(1);
