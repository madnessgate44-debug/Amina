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
  subj_social_studies: {
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
   * Build a compact, citable reference block of the lesson's supplementary
   * resources (الأضواء / سلاح التلميذ / دليل المعلم) for tutor prompts.
   * Returns null when the lesson has no available supplementary material, so
   * callers never present a resource the student does not actually have.
   */
  public buildSupplementaryReference(lessonId: string): string | null {
    const lesson = this.getLessonById(lessonId);
    if (!lesson) return null;
    const available = (lesson.supplementaryResources || []).filter((r) => r.isAvailable);
    if (available.length === 0) return null;

    return available
      .map((r) => {
        const page = r.page ? `, p.${r.page}` : '';
        const notes = r.notes ? ` — ${r.notes}` : '';
        return `- ${r.sourceNameEn} (${r.sourceNameAr}) — ${r.unit} / ${r.lesson}${page}${notes}`;
      })
      .join('\n');
  }

  /**
   * Official source portals where the lesson material can actually be obtained.
   * These are real, verifiable destinations (the Egyptian Ministry of Education
   * portal and the Egyptian Knowledge Bank, which hosts ministry textbooks).
   * The app links out to them rather than pretending the full book is embedded.
   * Only publicly verifiable portals belong here — never invent a URL.
   */
  public static readonly RESOURCE_PORTALS = {
    ministryOfEducation: 'https://moe.gov.eg',
    egyptianKnowledgeBank: 'https://www.ekb.eg',
  } as const;

  /**
   * Return the best known official source link for a lesson's book, or null when
   * none is recorded. Callers must treat a null result as "no online source"
   * and must not substitute a fabricated one.
   */
  public getLessonResourceUrl(lessonId: string): string | null {
    const lesson = this.getLessonById(lessonId);
    if (!lesson) return null;
    if (lesson.sourceRef.resourceUrl) return lesson.sourceRef.resourceUrl;
    // The Egyptian Knowledge Bank hosts official ministry textbooks for all
    // school subjects; it is the correct general destination for a lesson whose
    // exact book URL is not individually recorded.
    return lesson.sourceRef.isAvailable
      ? CurriculumService.RESOURCE_PORTALS.egyptianKnowledgeBank
      : null;
  }

  /**
   * Truthful curriculum coverage report.
   *
   * Reports what is actually present in the repository — never an estimate of
   * what the physical textbook contains. A lesson counts as "complete" only
   * when it has concepts, vocabulary and exercises, so the app cannot present
   * a thin lesson as finished material.
   */
  public getCurriculumCoverage(): {
    totalLessons: number;
    completeLessons: number;
    pendingLessons: number;
    lessonsWithoutAvailableResource: number;
    bySubject: Array<{
      subjectId: string;
      subjectNameAr: string;
      units: number;
      lessons: number;
      completeLessons: number;
      pendingLessons: number;
      availableResources: number;
    }>;
  } {
    const all = this.getAllLessons();
    const isComplete = (l: OfficialCurriculumLesson) =>
      l.concepts.length > 0 && l.vocabulary.length > 0 && l.exercises.length > 0;

    const bySubjectMap = new Map<string, {
      subjectId: string;
      subjectNameAr: string;
      units: Set<number>;
      lessons: number;
      completeLessons: number;
      pendingLessons: number;
      availableResources: number;
    }>();

    let completeLessons = 0;
    let pendingLessons = 0;
    let lessonsWithoutAvailableResource = 0;

    for (const l of all) {
      const complete = isComplete(l);
      if (complete) completeLessons++;
      else pendingLessons++;

      const available = (l.supplementaryResources || []).filter((r) => r.isAvailable).length;
      if (available === 0) lessonsWithoutAvailableResource++;

      const entry = bySubjectMap.get(l.subjectId) || {
        subjectId: l.subjectId,
        subjectNameAr: l.subjectNameAr,
        units: new Set<number>(),
        lessons: 0,
        completeLessons: 0,
        pendingLessons: 0,
        availableResources: 0,
      };
      entry.units.add(l.unitNumber);
      entry.lessons++;
      if (complete) entry.completeLessons++;
      else entry.pendingLessons++;
      entry.availableResources += available;
      bySubjectMap.set(l.subjectId, entry);
    }

    return {
      totalLessons: all.length,
      completeLessons,
      pendingLessons,
      lessonsWithoutAvailableResource,
      bySubject: [...bySubjectMap.values()].map((e) => ({
        subjectId: e.subjectId,
        subjectNameAr: e.subjectNameAr,
        units: e.units.size,
        lessons: e.lessons,
        completeLessons: e.completeLessons,
        pendingLessons: e.pendingLessons,
        availableResources: e.availableResources,
      })),
    };
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
