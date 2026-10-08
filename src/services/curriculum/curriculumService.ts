/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  OfficialCurriculumLesson,
  CurriculumLessonConcept,
  SourceRef,
} from '../../types/teachingSession';
import { FlatCurriculumConcept } from '../../types/curriculum';
import { OFFICIAL_CURRICULUM_LESSONS } from '../../data/officialCurriculum';
import { AMINA_CURRICULUM_CONTEXT } from '../../data/aminaCurriculumConfig';

export interface SubjectCurriculumSummary {
  subjectId: string;
  subjectNameAr: string;
  subjectNameEn: string;
  subjectNameFr?: string;
  totalLessons: number;
  availableLessons: number;
  bookTitleAr: string;
  bookTitleEn: string;
  icon: string;
  color: string;
  bgGradient: string;
  termLabel: string;
  badgeAr: string;
  badgeEn: string;
}

export interface UnitCurriculumSummary {
  unitNumber: number;
  unitNameAr: string;
  unitNameEn: string;
  unitNameFr?: string;
  lessons: OfficialCurriculumLesson[];
}

export const SUBJECT_METADATA_MAP: Record<string, {
  icon: string;
  color: string;
  bgGradient: string;
  termLabel: string;
  badgeAr: string;
  badgeEn: string;
}> = {
  subj_arabic: {
    icon: '📖',
    color: 'sky',
    bgGradient: 'from-sky-600 to-indigo-800',
    termLabel: 'الفصل الدراسي الأول',
    badgeAr: 'لغة عربية',
    badgeEn: 'Arabic',
  },
  subj_french: {
    icon: '🥐',
    color: 'blue',
    bgGradient: 'from-blue-600 via-indigo-700 to-rose-700',
    termLabel: '1er Semestre',
    badgeAr: 'لغة فرنسية',
    badgeEn: 'Français',
  },
  subj_math: {
    icon: '📐',
    color: 'emerald',
    bgGradient: 'from-emerald-600 to-teal-800',
    termLabel: 'الفصل الدراسي الأول',
    badgeAr: 'رياضيات',
    badgeEn: 'Mathematics',
  },
  subj_math_fr: {
    icon: '🔢',
    color: 'teal',
    bgGradient: 'from-teal-600 via-cyan-700 to-blue-800',
    termLabel: '1er Semestre — Bilingue',
    badgeAr: 'ماث بالفرنسية',
    badgeEn: 'Maths Français',
  },
  subj_science: {
    icon: '🔬',
    color: 'purple',
    bgGradient: 'from-purple-600 to-indigo-900',
    termLabel: 'الفصل الدراسي الأول',
    badgeAr: 'علوم',
    badgeEn: 'Science',
  },
  subj_science_fr: {
    icon: '🧪',
    color: 'violet',
    bgGradient: 'from-violet-600 via-purple-700 to-pink-800',
    termLabel: '1er Semestre — Bilingue',
    badgeAr: 'ساينس بالفرنسية',
    badgeEn: 'Sciences Français',
  },
  subj_social: {
    icon: '🌍',
    color: 'amber',
    bgGradient: 'from-amber-600 to-orange-800',
    termLabel: 'الفصل الدراسي الأول',
    badgeAr: 'دراسات',
    badgeEn: 'Social Studies',
  },
  subj_english: {
    icon: '🇬🇧',
    color: 'blue',
    bgGradient: 'from-blue-600 to-indigo-800',
    termLabel: 'Term 1',
    badgeAr: 'إنجليزي',
    badgeEn: 'English',
  },
  subj_ict: {
    icon: '💻',
    color: 'cyan',
    bgGradient: 'from-cyan-600 to-blue-800',
    termLabel: 'الفصل الدراسي الأول',
    badgeAr: 'تكنولوجيا',
    badgeEn: 'ICT',
  },
  subj_islamic: {
    icon: '🕌',
    color: 'emerald',
    bgGradient: 'from-emerald-700 to-green-900',
    termLabel: 'الفصل الدراسي الأول',
    badgeAr: 'تربية إسلامية',
    badgeEn: 'Islamic Education',
  },
  subj_calligraphy: {
    icon: '✒️',
    color: 'amber',
    bgGradient: 'from-amber-700 to-stone-900',
    termLabel: 'الفصل الدراسي الأول',
    badgeAr: 'خط عربي',
    badgeEn: 'Calligraphy',
  },
};

export class CurriculumService {
  private lessons: OfficialCurriculumLesson[] = [];

  constructor() {
    this.lessons = OFFICIAL_CURRICULUM_LESSONS.map((lesson) => {
      const config = AMINA_CURRICULUM_CONTEXT.subjectConfigs[lesson.subjectId];
      if (!config) return lesson;
      return {
        ...lesson,
        curriculumSource: config.curriculumSource,
        instructionLanguage: config.instructionLanguage,
        contentLanguage: config.contentLanguage,
        assessmentLanguage: config.assessmentLanguage,
        track: config.track,
      };
    });
  }

  /**
   * Ingest a new official curriculum lesson
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
   * Return primary proving lessons (one per main discipline)
   */
  public getProvingLessons(): OfficialCurriculumLesson[] {
    const provingIds = [
      'off_ar_u1_l2',
      'off_fr_u1_l1_salutations',
      'off_math_u1_l1',
      'off_mathfr_u1_l1_decimaux',
      'off_sci_u1_l1_plant_needs',
      'off_scifr_u1_l1_plantes',
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
   * Get all official subjects with lesson counts, virtual book metadata and badges
   */
  public getSubjectsSummary(): SubjectCurriculumSummary[] {
    const map = new Map<string, SubjectCurriculumSummary>();

    for (const l of this.lessons) {
      if (!map.has(l.subjectId)) {
        const meta = SUBJECT_METADATA_MAP[l.subjectId] || {
          icon: '📚',
          color: 'indigo',
          bgGradient: 'from-indigo-600 to-indigo-800',
          termLabel: 'الفصل الدراسي الأول',
          badgeAr: l.subjectNameAr,
          badgeEn: l.subjectNameEn,
        };

        map.set(l.subjectId, {
          subjectId: l.subjectId,
          subjectNameAr: l.subjectNameAr,
          subjectNameEn: l.subjectNameEn,
          subjectNameFr: l.subjectNameFr,
          totalLessons: 0,
          availableLessons: 0,
          bookTitleAr: l.sourceRef.bookAr,
          bookTitleEn: l.sourceRef.bookEn,
          icon: meta.icon,
          color: meta.color,
          bgGradient: meta.bgGradient,
          termLabel: meta.termLabel,
          badgeAr: meta.badgeAr,
          badgeEn: meta.badgeEn,
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
          unitNameFr: lesson.unitNameFr,
          lessons: [],
        });
      }
      unitMap.get(lesson.unitNumber)!.lessons.push(lesson);
    }

    return Array.from(unitMap.values()).sort((a, b) => a.unitNumber - b.unitNumber);
  }

  /**
   * Return all curriculum concepts in flat format for planning, mastery, and review
   * Derived 100% from Amina's authoritative official curriculum.
   */
  public getFlatConcepts(): FlatCurriculumConcept[] {
    const flat: FlatCurriculumConcept[] = [];
    for (const l of this.lessons) {
      for (const c of l.concepts) {
        flat.push({
          id: c.id,
          parentId: l.id,
          subjectId: l.subjectId,
          subjectNameAr: l.subjectNameAr,
          subjectNameEn: l.subjectNameEn,
          unitId: `unit_${l.subjectId}_${l.unitNumber}`,
          unitNameAr: l.unitNameAr,
          unitNameEn: l.unitNameEn,
          lessonId: l.id,
          lessonNameAr: l.titleAr,
          lessonNameEn: l.titleEn,
          nameAr: c.titleAr,
          nameEn: c.titleEn,
          descriptionAr: c.sourceText,
          descriptionEn: c.sourceText,
          origin: 'official',
        });
      }
    }
    return flat;
  }

  /**
   * Authoritative Amina Curriculum API methods
   */
  public getAminaCurriculum(): OfficialCurriculumLesson[] {
    return this.getAllLessons().filter((lesson) => Boolean(AMINA_CURRICULUM_CONTEXT.subjectConfigs[lesson.subjectId]));
  }

  public getAminaCurriculumContext() {
    return AMINA_CURRICULUM_CONTEXT;
  }

  public getAminaSubjectConfig(id: string) {
    return AMINA_CURRICULUM_CONTEXT.subjectConfigs[id];
  }

  public getAminaSubjects(): SubjectCurriculumSummary[] {
    return this.getSubjectsSummary();
  }

  public getAminaSubject(id: string): SubjectCurriculumSummary | undefined {
    return this.getSubjectsSummary().find((s) => s.subjectId === id);
  }

  public getAminaLesson(id: string): OfficialCurriculumLesson | undefined {
    return this.getLessonById(id);
  }

  public getAminaConcept(id: string) {
    return this.getConceptById(id);
  }
}

export const curriculumService = new CurriculumService();
export const getAminaFlatConcepts = () => curriculumService.getFlatConcepts();
