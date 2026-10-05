/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { OfficialCurriculumLesson } from '../types/teachingSession';
import { ARABIC_CURRICULUM_LESSONS } from './curriculum/arabicCurriculum';
import { FRENCH_CURRICULUM_LESSONS } from './curriculum/frenchCurriculum';
import { MATH_CURRICULUM_LESSONS } from './curriculum/mathCurriculum';
import { MATH_FR_CURRICULUM_LESSONS } from './curriculum/mathFrCurriculum';
import { SCIENCE_CURRICULUM_LESSONS } from './curriculum/scienceCurriculum';
import { SCIENCE_FR_CURRICULUM_LESSONS } from './curriculum/scienceFrCurriculum';
import { SOCIAL_STUDIES_CURRICULUM_LESSONS } from './curriculum/socialStudiesCurriculum';
import { ENGLISH_CURRICULUM_LESSONS } from './curriculum/englishCurriculum';
import { ICT_CURRICULUM_LESSONS } from './curriculum/ictCurriculum';
import { ISLAMIC_CURRICULUM_LESSONS } from './curriculum/islamicCurriculum';
import { CALLIGRAPHY_CURRICULUM_LESSONS } from './curriculum/calligraphyCurriculum';

/**
 * Official Egyptian Ministry of Education Curriculum for Grade 5 (Term 1)
 * Complete, unified repository covering all official books and subjects for Amina:
 *
 * 1. اللغة العربية (Arabic Language)
 * 2. اللغة الفرنسية (French Language / Français)
 * 3. الرياضيات (Mathematics)
 * 4. الرياضيات بالفرنسية (French Mathematics / Mathématiques)
 * 5. العلوم (Science)
 * 6. العلوم بالفرنسية (French Science / Sciences)
 * 7. الدراسات الاجتماعية (Social Studies)
 * 8. اللغة الإنجليزية (English Connect 5)
 * 9. تكنولوجيا المعلومات والاتصالات (ICT)
 * 10. التربية الدينية الإسلامية (Islamic Religious Education)
 * 11. الخط العربي (Arabic Calligraphy)
 *
 * All lessons are cleanly indexed with page numbers, learning objectives,
 * concepts, and supplementary resources (الأضواء / سلاح التلميذ).
 */
export const OFFICIAL_CURRICULUM_LESSONS: OfficialCurriculumLesson[] = [
  ...ARABIC_CURRICULUM_LESSONS,
  ...FRENCH_CURRICULUM_LESSONS,
  ...MATH_CURRICULUM_LESSONS,
  ...MATH_FR_CURRICULUM_LESSONS,
  ...SCIENCE_CURRICULUM_LESSONS,
  ...SCIENCE_FR_CURRICULUM_LESSONS,
  ...SOCIAL_STUDIES_CURRICULUM_LESSONS,
  ...ENGLISH_CURRICULUM_LESSONS,
  ...ICT_CURRICULUM_LESSONS,
  ...ISLAMIC_CURRICULUM_LESSONS,
  ...CALLIGRAPHY_CURRICULUM_LESSONS,
];
