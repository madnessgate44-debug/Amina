/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  OfficialCurriculumLesson,
  CurriculumLessonConcept,
  SourceRef,
} from '../../types/teachingSession';
import { OFFICIAL_CURRICULUM_LESSONS } from '../../data/officialCurriculum';

export interface SubjectCurriculumSummary {
  subjectId: string;
  subjectNameAr: string;
  subjectNameEn: string;
  totalLessons: number;
  availableLessons: number;
  bookTitleAr: string;
  bookTitleEn: string;
}

export interface UnitCurriculumSummary {
  unitNumber: number;
  unitNameAr: string;
  unitNameEn: string;
  lessons: OfficialCurriculumLesson[];
}

export class CurriculumService {
  private lessons: OfficialCurriculumLesson[] = [];

  constructor() {
    this.lessons = [...OFFICIAL_CURRICULUM_LESSONS];
  }

  /**
   * Ingest a new official curriculum lesson (e.g. when French books are uploaded)
   * Ensures zero engine changes for new subjects.
   */
  public ingest(lesson: OfficialCurriculumLesson): void {
    const existingIndex = this.lessons.findIndex((l) => l.id === lesson.id);
    if (existingIndex >= 0) {
      this.lessons[existingIndex] = lesson;
    } else {
      this.lessons.push(lesson);
    }
  }

  /**
   * Return all ingested official lessons
   */
  public getAllLessons(): OfficialCurriculumLesson[] {
    return [...this.lessons];
  }

  /**
   * Return only available lessons (excluding unreadable / unavailable ones)
   */
  public getAvailableLessons(): OfficialCurriculumLesson[] {
    return this.lessons.filter((l) => l.isAvailable);
  }

  /**
   * Return the 5 primary proving lessons (one per subject)
   */
  public getProvingLessons(): OfficialCurriculumLesson[] {
    const provingIds = [
      'off_ar_u1_l2',
      'off_en_u1_apple_tree',
      'off_soc_u1_l2_surface',
      'off_rel_abdurrahman_eid_nasr',
      'off_callig_alif_naskh_ruqaa',
    ];
    return this.lessons.filter((l) => provingIds.includes(l.id));
  }

  /**
   * Find a lesson by ID
   */
  public getLessonById(lessonId: string): OfficialCurriculumLesson | undefined {
    return this.lessons.find((l) => l.id === lessonId);
  }

  /**
   * Find all lessons for a specific subject
   */
  public getLessonsBySubject(subjectId: string): OfficialCurriculumLesson[] {
    return this.lessons.filter((l) => l.subjectId === subjectId);
  }

  /**
   * Find a specific concept by conceptId across all lessons
   */
  public getConceptById(conceptId: string): {
    concept: CurriculumLessonConcept;
    lesson: OfficialCurriculumLesson;
  } | null {
    for (const lesson of this.lessons) {
      const concept = lesson.concepts.find((c) => c.id === conceptId);
      if (concept) {
        return { concept, lesson };
      }
    }
    return null;
  }

  /**
   * Get all official subjects with lesson counts and book source titles
   */
  public getSubjectsSummary(): SubjectCurriculumSummary[] {
    const map = new Map<string, SubjectCurriculumSummary>();

    for (const l of this.lessons) {
      if (!map.has(l.subjectId)) {
        map.set(l.subjectId, {
          subjectId: l.subjectId,
          subjectNameAr: l.subjectNameAr,
          subjectNameEn: l.subjectNameEn,
          totalLessons: 0,
          availableLessons: 0,
          bookTitleAr: l.sourceRef.bookAr,
          bookTitleEn: l.sourceRef.bookEn,
        });
      }
      const entry = map.get(l.subjectId)!;
      entry.totalLessons += 1;
      if (l.isAvailable) {
        entry.availableLessons += 1;
      }
    }

    return Array.from(map.values());
  }

  /**
   * Group lessons of a subject by unit
   */
  public getUnitsForSubject(subjectId: string): UnitCurriculumSummary[] {
    const subjectLessons = this.getLessonsBySubject(subjectId);
    const unitMap = new Map<number, UnitCurriculumSummary>();

    for (const lesson of subjectLessons) {
      if (!unitMap.has(lesson.unitNumber)) {
        unitMap.set(lesson.unitNumber, {
          unitNumber: lesson.unitNumber,
          unitNameAr: lesson.unitNameAr,
          unitNameEn: lesson.unitNameEn,
          lessons: [],
        });
      }
      unitMap.get(lesson.unitNumber)!.lessons.push(lesson);
    }

    return Array.from(unitMap.values()).sort((a, b) => a.unitNumber - b.unitNumber);
  }
}

export const curriculumService = new CurriculumService();
