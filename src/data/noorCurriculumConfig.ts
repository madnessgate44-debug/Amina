/**
 * Noor's authoritative school/curriculum context.
 *
 * Curriculum source and language of instruction are intentionally separate:
 * Math and Science use the Egyptian national curriculum but are taught and
 * assessed in French at the French-track school context.
 */
import { StudentCurriculumContext, SubjectCurriculumConfig } from '../types/curriculum';

export const NOOR_CURRICULUM_CONTEXT: StudentCurriculumContext = {
  studentName: 'Learner',
  school: 'French-track school',
  location: 'Egypt',
  grade: 'Grade 5',
  academicYear: '2026 – 2027',
  track: 'french_bilingual',
  trackLabelAr: 'المسار الفرنسي',
  trackLabelEn: 'French track',
  trackLabelFr: 'Parcours français',
  subjectConfigs: {
    subj_arabic: {
      subjectId: 'subj_arabic', subjectNameAr: 'اللغة العربية', subjectNameEn: 'Arabic',
      curriculumSource: 'egyptian_national', curriculumSourceLabelAr: 'المنهج المصري', curriculumSourceLabelEn: 'Egyptian National Curriculum',
      instructionLanguage: 'ar', contentLanguage: 'ar', assessmentLanguage: 'ar', grade: 'Grade 5', track: 'french_bilingual',
      schoolContext: 'French-track school', bookTitleAr: 'كتاب اللغة العربية', bookTitleEn: 'Arabic Language',
    },
    subj_french: {
      subjectId: 'subj_french', subjectNameAr: 'اللغة الفرنسية', subjectNameEn: 'French Language', subjectNameFr: 'Français',
      curriculumSource: 'french_track', curriculumSourceLabelAr: 'منهج القسم الفرنسي', curriculumSourceLabelEn: 'French-Track Curriculum', curriculumSourceLabelFr: 'Programme du parcours français',
      instructionLanguage: 'fr', contentLanguage: 'fr', assessmentLanguage: 'fr', grade: 'Grade 5', track: 'french_bilingual',
      schoolContext: 'French-track school', isFrenchTrackSpecific: true, bookTitleAr: 'كتاب اللغة الفرنسية', bookTitleEn: 'French Language', bookTitleFr: 'Français',
    },
    subj_math: {
      subjectId: 'subj_math', subjectNameAr: 'الرياضيات', subjectNameEn: 'Mathematics', subjectNameFr: 'Mathématiques',
      curriculumSource: 'egyptian_national', curriculumSourceLabelAr: 'المنهج المصري', curriculumSourceLabelEn: 'Egyptian National Curriculum',
      instructionLanguage: 'fr', contentLanguage: 'fr', assessmentLanguage: 'fr', grade: 'Grade 5', track: 'french_bilingual',
      schoolContext: 'French-track school', bookTitleAr: 'كتاب الرياضيات', bookTitleEn: 'Mathematics', bookTitleFr: 'Mathématiques',
    },
    subj_science: {
      subjectId: 'subj_science', subjectNameAr: 'العلوم', subjectNameEn: 'Science', subjectNameFr: 'Sciences',
      curriculumSource: 'egyptian_national', curriculumSourceLabelAr: 'المنهج المصري', curriculumSourceLabelEn: 'Egyptian National Curriculum',
      instructionLanguage: 'fr', contentLanguage: 'fr', assessmentLanguage: 'fr', grade: 'Grade 5', track: 'french_bilingual',
      schoolContext: 'French-track school', bookTitleAr: 'كتاب العلوم', bookTitleEn: 'Science', bookTitleFr: 'Sciences',
    },
    subj_english: {
      subjectId: 'subj_english', subjectNameAr: 'اللغة الإنجليزية', subjectNameEn: 'English',
      curriculumSource: 'egyptian_national', curriculumSourceLabelAr: 'المنهج الإنجليزي المعتمد', curriculumSourceLabelEn: 'English Curriculum',
      instructionLanguage: 'en', contentLanguage: 'en', assessmentLanguage: 'en', grade: 'Grade 5', track: 'french_bilingual',
      schoolContext: 'French-track school', bookTitleAr: 'اللغة الإنجليزية', bookTitleEn: 'English',
    },
    subj_social: {
      subjectId: 'subj_social', subjectNameAr: 'الدراسات الاجتماعية', subjectNameEn: 'Social Studies',
      curriculumSource: 'egyptian_national', curriculumSourceLabelAr: 'المنهج المصري', curriculumSourceLabelEn: 'Egyptian National Curriculum',
      instructionLanguage: 'ar', contentLanguage: 'ar', assessmentLanguage: 'ar', grade: 'Grade 5', track: 'french_bilingual',
      schoolContext: 'French-track school', bookTitleAr: 'الدراسات الاجتماعية', bookTitleEn: 'Social Studies',
    },
    subj_ict: {
      subjectId: 'subj_ict', subjectNameAr: 'تكنولوجيا المعلومات والاتصالات', subjectNameEn: 'ICT',
      curriculumSource: 'egyptian_national', curriculumSourceLabelAr: 'المنهج المصري', curriculumSourceLabelEn: 'Egyptian National Curriculum',
      instructionLanguage: 'ar', contentLanguage: 'ar', assessmentLanguage: 'ar', grade: 'Grade 5', track: 'french_bilingual',
      schoolContext: 'French-track school', bookTitleAr: 'تكنولوجيا المعلومات والاتصالات', bookTitleEn: 'ICT',
    },
    subj_islamic: {
      subjectId: 'subj_islamic', subjectNameAr: 'التربية الإسلامية', subjectNameEn: 'Islamic Religious Education',
      curriculumSource: 'egyptian_national', curriculumSourceLabelAr: 'المنهج المصري', curriculumSourceLabelEn: 'Egyptian National Curriculum',
      instructionLanguage: 'ar', contentLanguage: 'ar', assessmentLanguage: 'ar', grade: 'Grade 5', track: 'french_bilingual',
      schoolContext: 'French-track school', bookTitleAr: 'التربية الإسلامية', bookTitleEn: 'Islamic Religious Education',
    },
    subj_calligraphy: {
      subjectId: 'subj_calligraphy', subjectNameAr: 'الخط العربي', subjectNameEn: 'Arabic Calligraphy',
      curriculumSource: 'egyptian_national', curriculumSourceLabelAr: 'المنهج المصري', curriculumSourceLabelEn: 'Egyptian National Curriculum',
      instructionLanguage: 'ar', contentLanguage: 'ar', assessmentLanguage: 'ar', grade: 'Grade 5', track: 'french_bilingual',
      schoolContext: 'French-track school', bookTitleAr: 'الخط العربي', bookTitleEn: 'Arabic Calligraphy',
    },
  } satisfies Record<string, SubjectCurriculumConfig>,
};
