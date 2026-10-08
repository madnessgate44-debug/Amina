/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CurriculumOrigin = 'demo' | 'official' | 'ai_generated';

export type CurriculumSource =
  | 'egyptian_national'
  | 'french_girard_track'
  | 'school_specific';

export type CurriculumTrack =
  | 'french_bilingual'
  | 'national_arabic'
  | 'general';

export interface SubjectCurriculumConfig {
  subjectId: string;
  subjectNameAr: string;
  subjectNameEn: string;
  subjectNameFr?: string;
  curriculumSource: CurriculumSource;
  curriculumSourceLabelAr: string;
  curriculumSourceLabelEn: string;
  curriculumSourceLabelFr?: string;
  instructionLanguage: 'ar' | 'fr' | 'en';
  contentLanguage: 'ar' | 'fr' | 'en';
  assessmentLanguage: 'ar' | 'fr' | 'en';
  grade: string;
  track: CurriculumTrack;
  schoolContext?: string;
  isFrenchTrackSpecific?: boolean;
  bookTitleAr: string;
  bookTitleEn: string;
  bookTitleFr?: string;
}

export interface StudentCurriculumContext {
  studentName: string;
  school: string;
  location: string;
  grade: string;
  academicYear: string;
  track: CurriculumTrack;
  trackLabelAr: string;
  trackLabelEn: string;
  trackLabelFr?: string;
  subjectConfigs: Record<string, SubjectCurriculumConfig>;
}

export interface CurriculumNodeBase {
  id: string;
  parentId: string | null;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  origin: CurriculumOrigin;
}

export interface CurriculumConcept extends CurriculumNodeBase {
  parentId: string; // lessonId
  lessonId: string;
  unitId: string;
  subjectId: string;
  grade: string;
  conceptNumber: number;
}

export interface CurriculumLesson extends CurriculumNodeBase {
  parentId: string; // unitId
  unitId: string;
  subjectId: string;
  lessonNumber: number;
  concepts: CurriculumConcept[];
}

export interface CurriculumUnit extends CurriculumNodeBase {
  parentId: string; // subjectId
  subjectId: string;
  unitNumber: number;
  lessons: CurriculumLesson[];
}

export interface CurriculumSubject extends CurriculumNodeBase {
  parentId: null;
  icon: string;
  color: string;
  units: CurriculumUnit[];
}

export interface FlatCurriculumConcept {
  id: string;
  parentId: string;
  subjectId: string;
  subjectNameAr: string;
  subjectNameEn: string;
  unitId: string;
  unitNameAr: string;
  unitNameEn: string;
  lessonId: string;
  lessonNameAr: string;
  lessonNameEn: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  origin: CurriculumOrigin;
}
