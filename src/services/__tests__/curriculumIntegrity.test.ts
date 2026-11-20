/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Guards registry integrity independently of book coverage.
 *
 * Two defects reached the learner: Social Studies lessons declared no teaching
 * language, so a French-mode session had nothing to route on, and unit lists
 * showed the same lesson position twice because a legacy extract and the record
 * rebuilt from the inspected book TOC both stayed registered.
 */

import { curriculumService } from '../curriculum/curriculumService';

let passed = 0;
let failed = 0;

const check = (name: string, condition: boolean, detail = '') => {
  if (condition) {
    passed += 1;
    console.log(`✅ [PASS] ${name}`);
  } else {
    failed += 1;
    console.error(`❌ [FAIL] ${name}${detail ? ` — ${detail}` : ''}`);
  }
};

const lessons = curriculumService.getAllLessons();

check('1.1 registry is not empty', lessons.length > 0, `${lessons.length} lessons`);

// Every lesson must declare the language it is taught in, and all three
// language fields must agree: a lesson taught in Arabic is assessed in Arabic.
const languageFields = ['instructionLanguage', 'contentLanguage', 'assessmentLanguage'] as const;
const noLanguage = lessons.filter((l) => languageFields.some((f) => !l[f]));
check(
  '1.2 every lesson declares instruction, content and assessment language',
  noLanguage.length === 0,
  noLanguage.map((l) => l.id).join(', '),
);

const mismatched = lessons.filter(
  (l) => l.instructionLanguage !== l.contentLanguage || l.contentLanguage !== l.assessmentLanguage,
);
check(
  '1.3 a lesson is taught and assessed in one language',
  mismatched.length === 0,
  mismatched.map((l) => `${l.id}(${l.instructionLanguage}/${l.contentLanguage}/${l.assessmentLanguage})`).join(', '),
);

// A French-track lesson must carry French teaching text. Arabic-only content
// behind a French language tag is the exact failure the track plan calls out.
const frenchLessons = lessons.filter((l) => l.contentLanguage === 'fr');
const arabicScript = /[\u0600-\u06FF]/;
const frenchWithoutFrench = frenchLessons.filter(
  (l) => !l.concepts.some((c) => (c.sourceTextFr ?? '').trim().length > 0),
);
check(
  '1.4 every French-track lesson has French explanation text',
  frenchWithoutFrench.length === 0,
  frenchWithoutFrench.map((l) => l.id).join(', '),
);

const frenchWithArabicTitle = frenchLessons.filter(
  (l) => !(l.titleFr ?? '').trim() || arabicScript.test(l.titleFr ?? ''),
);
check(
  '1.5 every French-track lesson has a French lesson title',
  frenchWithArabicTitle.length === 0,
  frenchWithArabicTitle.map((l) => l.id).join(', '),
);

// Unit lists feed the browser straight into the render, so a repeated position
// becomes a repeated lesson the child can tap.
const subjects = [...new Set(lessons.map((l) => l.subjectId))];
const duplicatePositions: string[] = [];
for (const subjectId of subjects) {
  for (const unit of curriculumService.getUnitsForSubject(subjectId)) {
    const numbers = unit.lessons.map((l) => l.lessonNumber);
    const unique = new Set(numbers);
    if (unique.size !== numbers.length) {
      duplicatePositions.push(`${subjectId} u${unit.unitNumber}`);
    }
  }
}
check(
  '1.6 no unit list shows the same lesson number twice',
  duplicatePositions.length === 0,
  duplicatePositions.join(', '),
);

// The duplicate records stay registered so old lesson ids still resolve, so the
// dedupe must not silently drop a whole subject from the browser.
const browsable = subjects.filter((s) => curriculumService.getUnitsForSubject(s).length === 0);
check('1.7 every subject with lessons is still browsable', browsable.length === 0, browsable.join(', '));

const unitCounts = subjects.map((s) => ({
  s,
  registered: lessons.filter((l) => l.subjectId === s).length,
  browsable: curriculumService
    .getUnitsForSubject(s)
    .reduce((sum, u) => sum + u.lessons.length, 0),
}));
const droppedSubjects = unitCounts.filter((c) => c.browsable === 0 && c.registered > 0);
check(
  '1.8 dedupe only removes duplicates, never a subject',
  droppedSubjects.length === 0,
  droppedSubjects.map((c) => c.s).join(', '),
);

// Every exercise must be answerable: without an expected answer the engine
// cannot mark it, so the child can never complete the lesson.
const unanswerable = lessons.filter(
  (l) => l.exercises.length > 0 && l.exercises.some((e) => !(e.expectedAnswer ?? '').toString().trim()),
);
check(
  '1.9 every exercise carries an expected answer',
  unanswerable.length === 0,
  unanswerable.map((l) => l.id).join(', '),
);

const lessonsWithoutExercises = lessons.filter((l) => l.exercises.length === 0 && l.isAvailable);
check(
  '1.10 every available lesson has at least one exercise',
  lessonsWithoutExercises.length === 0,
  lessonsWithoutExercises.map((l) => l.id).join(', '),
);

// The browser lists a pending lesson on purpose and badges it "Materials
// Pending". What it must never do is badge it as complete.
const falselyComplete = lessons.filter(
  (l) => l.isAvailable && l.contentStatus === 'pending_materials',
);
check(
  '1.11 an unavailable lesson is never presented as complete',
  falselyComplete.length === 0,
  falselyComplete.map((l) => l.id).join(', '),
);

const pendingWithoutBadge = lessons.filter(
  (l) => !l.isAvailable && l.contentStatus !== 'pending_materials',
);
check(
  '1.12 a lesson that cannot be opened is marked pending',
  pendingWithoutBadge.length === 0,
  pendingWithoutBadge.map((l) => `${l.id}(${l.contentStatus})`).join(', '),
);

// Lesson ids are the persistence key for progress, so a collision would merge
// two children's progress or two lessons' mastery.
const ids = lessons.map((l) => l.id);
check('1.13 lesson ids are unique', new Set(ids).size === ids.length, `${ids.length} ids`);

// A unit number that appears under two different titles makes the child see two
// "Unit 3" sections, and a unit titled with the wrong number hides the real one.
const mislabelledUnits: string[] = [];
for (const subjectId of subjects) {
  for (const unit of curriculumService.getUnitsForSubject(subjectId)) {
    const declared = `${unit.unitNameEn ?? ''} ${unit.unitNameFr ?? ''}`.match(/\b(?:Unit|Unité|Chapter)\s*(\d+)/i);
    if (declared && Number(declared[1]) !== unit.unitNumber) {
      mislabelledUnits.push(`${subjectId} u${unit.unitNumber} titled "${unit.unitNameEn}"`);
    }
  }
}
check(
  '1.14 no unit is titled with a different unit number',
  mislabelledUnits.length === 0,
  mislabelledUnits.join('; '),
);

const duplicateUnitNames: string[] = [];
for (const subjectId of subjects) {
  const titles = curriculumService
    .getUnitsForSubject(subjectId)
    .map((u) => (u.unitNameEn ?? '').trim().toLowerCase());
  if (new Set(titles).size !== titles.length) duplicateUnitNames.push(subjectId);
}
check(
  '1.15 no subject shows two units with the same title',
  duplicateUnitNames.length === 0,
  duplicateUnitNames.join(', '),
);

// A session asks each exercise once, so a lesson with a single exercise can only
// ever pose one question. A child who misses it has nothing left to try, and the
// lesson cannot show whether the idea was understood. Only lessons whose own
// worked example yields no verifiable second equation may stay at one.
const THIN_ALLOWED = new Set<string>([
  // Maths lessons whose worked example states no arithmetic equation that can be
  // checked; a second exercise there would have to be invented.
]);
const thinLessons = lessons
  .filter((l) => l.isAvailable && l.exercises.length < 2)
  .map((l) => l.id)
  .filter((id) => !THIN_ALLOWED.has(id));
check(
  '1.16 every available lesson offers at least two exercises',
  thinLessons.length === 0,
  thinLessons.slice(0, 25).join(', ') + (thinLessons.length > 25 ? ` … +${thinLessons.length - 25}` : ''),
);

// Swapping two lesson titles without swapping their bodies leaves each lesson
// teaching the other one's topic: the child opened "أحكام التجويد" and read about
// مخارج الحروف. A lesson's title normally appears in its own teaching text. When
// it does not, but another lesson in the same subject carries that exact title in
// its text, the two records have been crossed. A reading passage whose body
// paraphrases its title is not flagged, because no other lesson mentions it.
const bodyOf = (l: (typeof lessons)[number]): string =>
  [l.readingText ?? '', ...l.concepts.map((c) => c.sourceText ?? '')].join(' ');
const normalizedTitle = (l: (typeof lessons)[number]): string =>
  (l.titleAr ?? '').replace(/[«»:،.]/g, ' ').replace(/\s+/g, ' ').trim();
const crossedLessons: string[] = [];
for (const lesson of lessons) {
  if (!lesson.isAvailable || lesson.contentLanguage !== 'ar') continue;
  const title = normalizedTitle(lesson);
  if (title.length < 6) continue;
  if (bodyOf(lesson).includes(title)) continue;
  const elsewhere = lessons.some(
    (other) =>
      other.id !== lesson.id &&
      other.subjectId === lesson.subjectId &&
      bodyOf(other).includes(title)
  );
  if (elsewhere) crossedLessons.push(lesson.id);
}
check(
  '1.17 no lesson title has been swapped onto another lesson\'s content',
  crossedLessons.length === 0,
  crossedLessons.join(', '),
);

console.log(`\nCURRICULUM INTEGRITY SUITE SUMMARY: ${passed} PASSED, ${failed} FAILED`);
if (failed > 0) process.exit(1);
