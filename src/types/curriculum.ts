/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CurriculumOrigin = 'demo' | 'official' | 'ai_generated';

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
