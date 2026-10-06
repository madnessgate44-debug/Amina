/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Mission,
  DayRecord,
  Timetable,
  MasteryRecord,
  Student,
  FlatCurriculumConcept,
  SchoolDayKey,
  Language,
  ParentPreferences,
} from '../../types';
import { curriculumService } from '../curriculum/curriculumService';
import { formatMasteryView } from '../mastery/masteryEngine';
import { getDueReviewConcepts } from '../review/spacedReviewScheduler';

export interface PlanMissionsParams {
  student: Student;
  dayRecord?: DayRecord | null;
  timetable?: Timetable | null;
  masteryRecords: Record<string, MasteryRecord>;
  availableMinutes?: number;
  sessionHistoryCount?: number;
  fatigueSignal?: boolean;
  date?: string; // YYYY-MM-DD
  language?: Language;
  parentPreferences?: ParentPreferences | null;
}

export interface PlanMissionsResult {
  missions: Mission[];
  explanation: {
    droppedCount: number;
    droppedMessage?: string;
    isMinimumViableDay: boolean;
    usedTimetableFallback: boolean;
    totalEstimatedMinutes: number;
    budgetMinutes: number;
    parentOverrideApplied?: boolean;
    parentOverrideMessage?: string;
  };
}

const DEFAULT_SCHOOL_DAY_BUDGET = 45;
const MAX_MISSIONS_CAP = 6;
const MAX_MISSION_MINUTES = 20;

/**
 * Maps subject strings across Arabic, French, and English to curriculum subject IDs
 */
function normalizeSubject(subName?: string): string {
  if (!subName) return '';
  const s = subName.trim().toLowerCase();

  // French Math specific
  if (
    (s.includes('math') && (s.includes('fr') || s.includes('فرنس'))) ||
    s.includes('mathématiques') ||
    s.includes('الرياضيات بالفرنسية')
  ) {
    return 'subj_math_fr';
  }

  // French Science specific
  if (
    (s.includes('sci') && (s.includes('fr') || s.includes('فرنس'))) ||
    s.includes('sciences fr') ||
    s.includes('العلوم بالفرنسية')
  ) {
    return 'subj_science_fr';
  }

  // French Language
  if (s.includes('فرنساوي') || s.includes('فرنسي') || s.includes('french') || s.includes('français')) {
    return 'subj_french';
  }

  if (s.includes('عرب') || s.includes('لغة عربية') || s.includes('arabic')) return 'subj_arabic';
  if (s.includes('رياض') || s.includes('حساب') || s.includes('math')) return 'subj_math';
  if (s.includes('علوم') || s.includes('science')) return 'subj_science';
  if (s.includes('دراس') || s.includes('social')) return 'subj_social';
  if (s.includes('إنجليز') || s.includes('انجليز') || s.includes('english')) return 'subj_english';
  if (s.includes('تكنولوج') || s.includes('ict')) return 'subj_ict';
  if (s.includes('دين') || s.includes('islamic') || s.includes('religion')) return 'subj_islamic';
  if (s.includes('خط') || s.includes('calligraphy')) return 'subj_calligraphy';

  return '';
}

/**
 * Gets human-readable subject name
 */
function getSubjectDisplayName(subjId: string, lang: Language): string {
  const isAr = lang === 'ar';
  const isFr = lang === 'fr';

  switch (subjId) {
    case 'subj_french':
      return isAr ? 'اللغة الفرنسية' : isFr ? 'Français' : 'French Language';
    case 'subj_math_fr':
      return isAr ? 'الرياضيات بالفرنسية' : isFr ? 'Mathématiques' : 'French Mathematics';
    case 'subj_science_fr':
      return isAr ? 'العلوم بالفرنسية' : isFr ? 'Sciences' : 'French Science';
    case 'subj_arabic':
      return isAr ? 'اللغة العربية' : isFr ? 'Langue Arabe' : 'Arabic Language';
    case 'subj_math':
      return isAr ? 'الرياضيات' : isFr ? 'Maths' : 'Mathematics';
    case 'subj_science':
      return isAr ? 'العلوم' : isFr ? 'Sciences' : 'Science';
    case 'subj_social':
      return isAr ? 'الدراسات الاجتماعية' : isFr ? 'Études Sociales' : 'Social Studies';
    case 'subj_english':
      return isAr ? 'اللغة الإنجليزية' : isFr ? 'Anglais' : 'English Connect 5';
    case 'subj_ict':
      return isAr ? 'تكنولوجيا المعلومات والاتصالات' : isFr ? 'TIC' : 'ICT';
    case 'subj_islamic':
      return isAr ? 'التربية الدينية الإسلامية' : isFr ? 'Éducation Islamique' : 'Islamic Education';
    case 'subj_calligraphy':
      return isAr ? 'الخط العربي' : isFr ? 'Calligraphie' : 'Arabic Calligraphy';
    default:
      return isAr ? 'المادة الدراسية' : isFr ? 'Matière Scolaire' : 'School Subject';
  }
}

/**
 * Finds curriculum concepts related to a subject or topic text
 */
function findConceptsForSubject(
  subjectId: string,
  topicText: string = '',
  flatConcepts: FlatCurriculumConcept[]
): FlatCurriculumConcept[] {
  const subjectConcepts = flatConcepts.filter((c) => c.subjectId === subjectId);
  if (!topicText || subjectConcepts.length === 0) return subjectConcepts;

  const words = topicText.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
  const matched = subjectConcepts.filter((c) => {
    const textAr = (c.nameAr + ' ' + (c.descriptionAr || '')).toLowerCase();
    const textEn = (c.nameEn + ' ' + (c.descriptionEn || '')).toLowerCase();
    return words.some((w) => textAr.includes(w) || textEn.includes(w));
  });

  return matched.length > 0 ? matched : subjectConcepts;
}

/**
 * Pure TypeScript, decoupled daily mission planner.
 * Follows exact priority ordering:
 *  a. Homework assigned today (per Day Record)
 *  b. Lessons covered today that have concepts with low mastery
 *  c. Concepts flagged needs_review
 *  d. Due-for-spaced-review concepts (stub)
 *  e. General practice for weakest subject
 */
export function planDailyMissions(params: PlanMissionsParams): PlanMissionsResult {
  const {
    student,
    dayRecord,
    timetable,
    masteryRecords,
    availableMinutes,
    fatigueSignal = false,
    date = new Date().toISOString().split('T')[0],
    language = 'ar',
    parentPreferences,
  } = params;

  const isAr = language === 'ar';
  const flatConcepts = curriculumService.getFlatConcepts();

  let parentOverrideApplied = false;
  let parentOverrideMessage: string | undefined;

  // 1. Determine Time Budget
  // Default is 45 min, or student declared. If fatigue signal is high, adjust downward.
  let declaredBudget = availableMinutes ?? DEFAULT_SCHOOL_DAY_BUDGET;
  if (declaredBudget < 5) declaredBudget = 10; // minimum sensible budget

  // Check parent override on daily study budget
  if (parentPreferences?.maxDailyStudyMinutes && parentPreferences.maxDailyStudyMinutes < declaredBudget) {
    declaredBudget = parentPreferences.maxDailyStudyMinutes;
    parentOverrideApplied = true;
    parentOverrideMessage = isAr
      ? `تم تعديل وقت المذاكرة اليومي إلى (${parentPreferences.maxDailyStudyMinutes} دقيقة) وفقاً للحد المحدد مع ولي الأمر لضمان راحة متوازنة.`
      : `Daily study time adjusted to (${parentPreferences.maxDailyStudyMinutes} min) per parent settings to ensure healthy rest.`;
  }

  if (fatigueSignal) {
    declaredBudget = Math.max(15, Math.floor(declaredBudget * 0.75));
  }

  // Check parent bedtime constraint
  let nearBedtime = false;
  if (parentPreferences?.bedtimeLimit) {
    try {
      const [bHour, bMin] = parentPreferences.bedtimeLimit.split(':').map(Number);
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const bedtimeMinutes = bHour * 60 + (bMin || 0);
      if (bedtimeMinutes - currentMinutes <= 45 && bedtimeMinutes - currentMinutes > -60) {
        nearBedtime = true;
        parentOverrideApplied = true;
        parentOverrideMessage = isAr
          ? `اقترب موعد النوم المحدد مع ولي الأمر (${parentPreferences.bedtimeLimit}). تم تقليص الخطة لمهمة واحدة سريعة لمساعدتك على النوم مبكراً.`
          : `Approaching bedtime set by parent (${parentPreferences.bedtimeLimit}). Tasks limited to a single quick mission.`;
      }
    } catch {
      // Ignore time parse issues
    }
  }

  // Failure path A: No time today / under 15 minutes or near bedtime → Offer "minimum viable day": ONE mission of 5-10 min
  const isMinimumViableDay = declaredBudget <= 15 || nearBedtime;

  const candidatePool: Array<{
    mission: Mission;
    priorityWeight: number; // Higher number = higher priority
  }> = [];

  const usedConceptIds = new Set<string>();

  // Determine subjects active today
  let activeSubjectIds: string[] = [];
  let usedTimetableFallback = false;

  const isConfirmedDay = Boolean(dayRecord && dayRecord.confirmed);

  if (dayRecord && dayRecord.lessonsCovered && dayRecord.lessonsCovered.length > 0) {
    // Collect from today's recorded lessons (confirmed or student-logged)
    dayRecord.lessonsCovered.forEach((l) => {
      const sId = normalizeSubject(l.subject);
      if (sId && !activeSubjectIds.includes(sId)) activeSubjectIds.push(sId);
    });
  }

  // Fallback to timetable if no confirmed day record or no subjects identified
  if (activeSubjectIds.length === 0 && timetable) {
    usedTimetableFallback = true;
    const currentDayIndex = new Date().getDay();
    const dayKeyMap: Record<number, SchoolDayKey> = {
      0: 'sunday',
      1: 'monday',
      2: 'tuesday',
      3: 'wednesday',
      4: 'thursday',
    };
    const todayKey = dayKeyMap[currentDayIndex] || 'sunday';
    const daySched = timetable.days.find((d) => d.day === todayKey);
    if (daySched) {
      daySched.periods.forEach((p) => {
        if (!p.isBreak) {
          const sId = normalizeSubject(p.subject);
          if (sId && !activeSubjectIds.includes(sId)) activeSubjectIds.push(sId);
        }
      });
    }
  }

  // Fallback if no subjects identified from day record or timetable:
  // First prioritize subjects with due reviews or low mastery; then fall back to authoritative curriculum subjects.
  if (activeSubjectIds.length === 0) {
    const dueReviews = getDueReviewConcepts(student.id, masteryRecords, { language });
    for (const r of dueReviews) {
      const c = flatConcepts.find((fc) => fc.id === r.conceptId);
      if (c && !activeSubjectIds.includes(c.subjectId)) {
        activeSubjectIds.push(c.subjectId);
      }
    }

    if (activeSubjectIds.length === 0) {
      // Use available subjects from Amina's authoritative curriculum
      const allSubjects = curriculumService.getSubjectsSummary().map((s) => s.subjectId);
      activeSubjectIds = allSubjects.slice(0, 4);
    }
  }

  // PRIORITY A: Homework assigned today (per Day Record)
  if (isConfirmedDay && dayRecord && dayRecord.homeworkAssigned?.length > 0) {
    const authoritativeFallbackSubj = curriculumService.getSubjectsSummary()[0]?.subjectId || 'subj_arabic';
    dayRecord.homeworkAssigned.forEach((hw, idx) => {
      const sId = normalizeSubject(hw.subject) || activeSubjectIds[0] || authoritativeFallbackSubj;
      const matched = findConceptsForSubject(sId, hw.description, flatConcepts);
      const targetConcept = matched[0];
      const conceptId = targetConcept?.id;

      if (conceptId) usedConceptIds.add(conceptId);

      const subjName = getSubjectDisplayName(sId, language);
      const missionTitle = isAr
        ? `تثبيت وتطبيق واجب: ${hw.description.slice(0, 32)}${hw.description.length > 32 ? '...' : ''}`
        : `Homework Practice: ${hw.description.slice(0, 32)}${hw.description.length > 32 ? '...' : ''}`;

      const whyNow = isAr
        ? `واجب تم تسجيله في مدرسة اليوم بمادة ${subjName}.`
        : `Homework logged for ${subjName} in today's school record.`;

      candidatePool.push({
        priorityWeight: 1000 - idx,
        mission: {
          id: `mis_hw_${date}_${idx}`,
          studentId: student.id,
          date,
          subject: subjName,
          lessonId: targetConcept?.lessonId,
          conceptId,
          homeworkItemId: hw.id || `hw_${student.id}_${date}_${idx}`,
          homeworkDescription: hw.description,
          title: missionTitle,
          type: 'homework',
          estimatedMinutes: 10,
          whyNow,
          originTag: targetConcept?.origin || 'official',
          successCriterion: isAr
            ? 'حل أسئلة الواجب والتحقق من الاستيعاب'
            : 'Complete homework questions and verify comprehension',
          status: 'pending',
        },
      });
    });
  }

  // PRIORITY B: Lessons covered today that have concepts with low mastery
  if (isConfirmedDay && dayRecord && dayRecord.lessonsCovered?.length > 0) {
    dayRecord.lessonsCovered.forEach((les, idx) => {
      const sId = normalizeSubject(les.subject);
      if (!sId) return;

      const matched = findConceptsForSubject(sId, les.topic || '', flatConcepts);
      // Find concept with lowest mastery or unstarted
      let candidate = matched.find((c) => !usedConceptIds.has(c.id));
      if (!candidate && matched.length > 0) candidate = matched[0];

      if (candidate) {
        usedConceptIds.add(candidate.id);
        const mastery = masteryRecords[candidate.id];
        const masteryView = formatMasteryView(mastery, language);
        const subjName = getSubjectDisplayName(sId, language);

        const isUnstartedOrLow = !masteryView.hasEvidence || (mastery?.score ?? 0.5) < 0.7;
        const missionType = isUnstartedOrLow ? 'understand_lesson' : 'quiz';
        const estMin = missionType === 'understand_lesson' ? 10 : 8;

        const conceptName = isAr ? candidate.nameAr : candidate.nameEn;
        const whyNow = isAr
          ? `درس تم تناوله اليوم في المدرسة (${conceptName}) لتثبيت الفهم فوراً.`
          : `Covered at school today (${conceptName}) to reinforce comprehension immediately.`;

        candidatePool.push({
          priorityWeight: 800 - idx,
          mission: {
            id: `mis_lesson_${date}_${idx}`,
            studentId: student.id,
            date,
            subject: subjName,
            lessonId: candidate.lessonId,
            conceptId: candidate.id,
            title: isAr ? `فهم واستيعاب: ${conceptName}` : `Understand: ${conceptName}`,
            type: missionType,
            estimatedMinutes: estMin,
            whyNow,
            originTag: candidate.origin,
            successCriterion: isAr
              ? 'مشاهدة الشرح والإجابة على فحص الاستيعاب السريع'
              : 'Watch explanation and pass quick check',
            status: 'pending',
          },
        });
      }
    });
  }

  // PRIORITY C: Concepts flagged needs_review (from Phase 4 mastery records)
  flatConcepts.forEach((concept) => {
    if (usedConceptIds.has(concept.id)) return;
    const rec = masteryRecords[concept.id];
    if (!rec) return;

    const view = formatMasteryView(rec, language);
    if (view.threshold === 'needs_review') {
      usedConceptIds.add(concept.id);
      const subjName = getSubjectDisplayName(concept.subjectId, language);
      const conceptName = isAr ? concept.nameAr : concept.nameEn;

      candidatePool.push({
        priorityWeight: 600,
        mission: {
          id: `mis_review_${date}_${concept.id}`,
          studentId: student.id,
          date,
          subject: subjName,
          lessonId: concept.lessonId,
          conceptId: concept.id,
          title: isAr ? `مراجعة داعمة: ${conceptName}` : `Review: ${conceptName}`,
          type: 'review',
          estimatedMinutes: 8,
          whyNow: isAr
            ? `مفهوم علمي انخفض استيعابه أو يحتاج دعماً إضافياً (${view.compositeLabel}).`
            : `Concept flagged as needs review based on mastery records (${view.compositeLabel}).`,
          originTag: concept.origin,
          successCriterion: isAr
            ? 'الإجابة على أسئلة المراجعة واستعادة الثقة'
            : 'Answer review questions and restore confidence',
          status: 'pending',
        },
      });
    }
  });

  // PRIORITY D: Due-for-spaced-review concepts (Phase 7 Spaced Revision Scheduler)
  const dueSpacedReviews = getDueReviewConcepts(student.id, masteryRecords, {
    currentDate: new Date(),
    language,
  });

  dueSpacedReviews.forEach((item, idx) => {
    if (usedConceptIds.has(item.conceptId)) return;
    usedConceptIds.add(item.conceptId);

    const conceptMeta = flatConcepts.find((c) => c.id === item.conceptId);
    const conceptName = isAr ? item.conceptNameAr : item.conceptNameEn;

    candidatePool.push({
      priorityWeight: 450 - idx,
      mission: {
        id: `mis_spaced_${date}_${item.conceptId}`,
        studentId: student.id,
        date,
        subject: item.subjectName,
        lessonId: conceptMeta?.lessonId,
        conceptId: item.conceptId,
        title: isAr ? `مراجعة متباعدة: ${conceptName}` : `Spaced Review: ${conceptName}`,
        type: 'review',
        estimatedMinutes: 8,
        whyNow: isAr
          ? `حان موعد المراجعة المتباعدة (${item.reason}).`
          : `Spaced review interval reached (${item.reason}).`,
        originTag: conceptMeta?.origin || 'official',
        successCriterion: isAr
          ? 'إكمال أسئلة المراجعة وتأكيد ثبات المفهوم'
          : 'Complete review questions and confirm retention',
        status: 'pending',
      },
    });
  });

  // PRIORITY E: General practice for active or weakest subject
  if (candidatePool.length < 3) {
    // Find unstarted or learning concepts in active subjects
    for (const sId of activeSubjectIds) {
      const pool = flatConcepts.filter((c) => c.subjectId === sId && !usedConceptIds.has(c.id));
      if (pool.length > 0) {
        const nextConcept = pool[0];
        usedConceptIds.add(nextConcept.id);
        const subjName = getSubjectDisplayName(sId, language);
        const conceptName = isAr ? nextConcept.nameAr : nextConcept.nameEn;

        candidatePool.push({
          priorityWeight: 200,
          mission: {
            id: `mis_practice_${date}_${nextConcept.id}`,
            studentId: student.id,
            date,
            subject: subjName,
            lessonId: nextConcept.lessonId,
            conceptId: nextConcept.id,
            title: isAr ? `استكشاف وتدريب: ${conceptName}` : `Explore & Practice: ${conceptName}`,
            type: 'practice',
            estimatedMinutes: 10,
            whyNow: isAr
              ? `تدريب استباقي في مادة ${subjName} لبناء قاعدة معرفية قوية.`
              : `Proactive practice in ${subjName} to strengthen learning foundations.`,
            originTag: nextConcept.origin,
            successCriterion: isAr
              ? 'خوض جولة تدريبية وتجربة الأسئلة'
              : 'Engage with practice questions',
            status: 'pending',
          },
        });
      }
    }
  }

  // Sort strictly by priorityWeight descending
  candidatePool.sort((a, b) => b.priorityWeight - a.priorityWeight);

  // Time Budget & Capacity Truncation
  // Max time allowed is declaredBudget + 10 min
  const maxAllowedMinutes = declaredBudget + 10;

  let selectedMissions: Mission[] = [];
  let totalMinutes = 0;
  let droppedCount = 0;

  if (isMinimumViableDay) {
    // Pick exactly ONE highest priority mission (5-10 min)
    if (candidatePool.length > 0) {
      const top = candidatePool[0].mission;
      top.estimatedMinutes = Math.min(top.estimatedMinutes, 10);
      selectedMissions = [top];
      totalMinutes = top.estimatedMinutes;
      droppedCount = candidatePool.length - 1;
    }
  } else {
    for (const item of candidatePool) {
      if (selectedMissions.length >= MAX_MISSIONS_CAP) {
        droppedCount++;
        continue;
      }

      // Enforce constraint: missions never exceed 20 min without student opt-in
      const missionMin = Math.min(item.mission.estimatedMinutes, MAX_MISSION_MINUTES);
      item.mission.estimatedMinutes = missionMin;

      if (totalMinutes + missionMin <= maxAllowedMinutes) {
        selectedMissions.push(item.mission);
        totalMinutes += missionMin;
      } else {
        droppedCount++;
      }
    }
  }

  // If candidate pool was completely empty (e.g. initial setup)
  if (selectedMissions.length === 0 && flatConcepts.length > 0) {
    const firstConcept = flatConcepts[0];
    const subjName = getSubjectDisplayName(firstConcept.subjectId, language);
    selectedMissions.push({
      id: `mis_starter_${date}`,
      studentId: student.id,
      date,
      subject: subjName,
      lessonId: firstConcept.lessonId,
      conceptId: firstConcept.id,
      title: isAr ? `بداية الانطلاق: ${firstConcept.nameAr}` : `Kickoff: ${firstConcept.nameEn}`,
      type: 'understand_lesson',
      estimatedMinutes: 8,
      whyNow: isAr
        ? 'مهمة ترحيبية خفيفة لبدء التعلم المنظم لليوم.'
        : 'A light starter mission to initiate your learning day.',
      originTag: firstConcept.origin,
      successCriterion: isAr ? 'استكمال الشروع وفحص الفهم' : 'Complete check and build confidence',
      status: 'pending',
    });
    totalMinutes = 8;
  }

  // Prepare explanation note if items were dropped to honor time budget
  let droppedMessage: string | undefined;
  if (droppedCount > 0) {
    droppedMessage = isAr
      ? `أسقطنا ${droppedCount} ${droppedCount === 1 ? 'مهمة' : 'مهام'} ذات أولوية أقل للحفاظ على وقتك واقعياً ومريحاً (${totalMinutes} دقيقة).`
      : `Dropped ${droppedCount} lower-priority ${droppedCount === 1 ? 'mission' : 'missions'} to keep today realistic (${totalMinutes} min).`;
  }

  return {
    missions: selectedMissions,
    explanation: {
      droppedCount,
      droppedMessage,
      isMinimumViableDay,
      usedTimetableFallback,
      totalEstimatedMinutes: totalMinutes,
      budgetMinutes: declaredBudget,
      parentOverrideApplied,
      parentOverrideMessage,
    },
  };
}
