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

console.log(`\nCURRICULUM REGISTRY SUITE SUMMARY: ${passed} PASSED, ${failed} FAILED`);
if (failed > 0) process.exit(1);
