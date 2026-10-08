/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { OfficialCurriculumLesson } from '../types/teachingSession';
import { ARABIC_CURRICULUM_LESSONS } from './curriculum/arabicCurriculum';
import { FRENCH_CURRICULUM_LESSONS } from './curriculum/frenchCurriculum';
import { MATH_FR_CURRICULUM_LESSONS } from './curriculum/mathFrCurriculum';
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
 * 3. الرياضيات (Mathematics — Egyptian curriculum, taught in French)
 * 4. العلوم (Science — Egyptian curriculum, taught in French)
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
  ...MATH_FR_CURRICULUM_LESSONS.map((lesson) => ({
    ...lesson,
    subjectId: 'subj_math',
    subjectNameAr: 'الرياضيات',
    subjectNameEn: 'Mathematics',
    subjectNameFr: 'Mathématiques',
    curriculumSource: 'egyptian_national' as const,
    instructionLanguage: 'fr' as const,
    contentLanguage: 'fr' as const,
    assessmentLanguage: 'fr' as const,
    track: 'french_bilingual' as const,
  })),
  ...SCIENCE_FR_CURRICULUM_LESSONS.map((lesson) => ({
    ...lesson,
    subjectId: 'subj_science',
    subjectNameAr: 'العلوم',
    subjectNameEn: 'Science',
    subjectNameFr: 'Sciences',
    curriculumSource: 'egyptian_national' as const,
    instructionLanguage: 'fr' as const,
    contentLanguage: 'fr' as const,
    assessmentLanguage: 'fr' as const,
    track: 'french_bilingual' as const,
  })),
  ...SOCIAL_STUDIES_CURRICULUM_LESSONS,
  ...ENGLISH_CURRICULUM_LESSONS,
  ...ICT_CURRICULUM_LESSONS,
  ...ISLAMIC_CURRICULUM_LESSONS,
  ...CALLIGRAPHY_CURRICULUM_LESSONS,
];
