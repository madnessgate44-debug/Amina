/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { OfficialCurriculumLesson } from '../types/teachingSession';
import { ICT_CURRICULUM_LESSONS } from './curriculum/ictCurriculum';
import { MATH_CURRICULUM_LESSONS } from './curriculum/mathCurriculum';
import { ARABIC_CURRICULUM_LESSONS } from './curriculum/arabicCurriculum';
import { SCIENCE_CURRICULUM_LESSONS } from './curriculum/scienceCurriculum';
import { SOCIAL_STUDIES_CURRICULUM_LESSONS } from './curriculum/socialStudiesCurriculum';
import { ISLAMIC_CURRICULUM_LESSONS } from './curriculum/islamicCurriculum';
import { ENGLISH_CURRICULUM_LESSONS } from './curriculum/englishCurriculum';
import { CALLIGRAPHY_CURRICULUM_LESSONS } from './curriculum/calligraphyCurriculum';

/**
 * Official Egyptian Ministry of Education Curriculum for Grade 5 (Term 1)
 * Complete, unified repository covering all official books and subjects for Amina:
 * - تكنولوجيا المعلومات والاتصالات (ICT) — 12 Lessons (Units 1 & 2)
 * - الرياضيات (Maths / Mathématiques) — Units 1-6
 * - اللغة العربية (Arabic Language — تواصل)
 * - العلوم (Science)
 * - الدراسات الاجتماعية (Social Studies — معالم بلدنا)
 * - التربية الدينية الإسلامية (Islamic Education)
 * - اللغة الإنجليزية (English Connect 5)
 * - الخط العربي (Arabic Calligraphy)
 *
 * All lessons are 100% available, fully indexed with page numbers and exercises.
 */
export const OFFICIAL_CURRICULUM_LESSONS: OfficialCurriculumLesson[] = [
  ...ICT_CURRICULUM_LESSONS,
  ...MATH_CURRICULUM_LESSONS,
  ...ARABIC_CURRICULUM_LESSONS,
  ...SCIENCE_CURRICULUM_LESSONS,
  ...SOCIAL_STUDIES_CURRICULUM_LESSONS,
  ...ISLAMIC_CURRICULUM_LESSONS,
  ...ENGLISH_CURRICULUM_LESSONS,
  ...CALLIGRAPHY_CURRICULUM_LESSONS,
];
