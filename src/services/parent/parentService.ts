/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ParentAccount,
  ParentPreferences,
  ParentWeeklySummary,
  Student,
  DayRecord,
  MasteryRecord,
  Mission,
  HomeworkItem,
  Language,
} from '../../types';
import { IStorageService } from '../storage/IStorageService';
import { curriculumService, FRENCH_SUBJECT_NAMES } from '../curriculum/curriculumService';
import { formatMasteryView } from '../mastery/masteryEngine';
import { getDueReviewConcepts } from '../review/spacedReviewScheduler';

export const DEFAULT_PARENT_PREFERENCES: ParentPreferences = {
  defaultAvailableMinutesPerDay: 45,
  bedtime: '21:30',
  bedtimeEnforced: true,
  voiceEnabledGlobally: true,
};

/**
 * Creates or updates a linked parent account with PIN protection.
 */
export async function linkParentAccount(
  storage: IStorageService,
  studentId: string,
  data: {
    parentEmail: string;
    parentName: string;
    pin: string;
    preferences?: Partial<ParentPreferences>;
  }
): Promise<ParentAccount> {
  const account: ParentAccount = {
    id: `parent_${studentId}`,
    studentId,
    parentEmail: data.parentEmail.trim().toLowerCase(),
    parentName: data.parentName.trim(),
    pin: data.pin.trim(),
    isLinked: true,
    createdAt: new Date().toISOString(),
    preferences: {
      ...DEFAULT_PARENT_PREFERENCES,
      ...(data.preferences || {}),
    },
  };

  await storage.saveParentAccount(account);
  return account;
}

/**
 * Verifies if entered PIN matches the stored parent PIN.
 */
export function verifyPin(account: ParentAccount, enteredPin: string): boolean {
  if (!account || !account.pin) return false;
  return account.pin.trim() === enteredPin.trim();
}

/**
 * Checks if current time is past the parent-enforced bedtime.
 */
export function isPastBedtime(preferences: ParentPreferences, currentTimeStr?: string): boolean {
  if (!preferences.bedtimeEnforced || !preferences.bedtime) return false;

  const now = new Date();
  const currentFormatted = currentTimeStr || `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  return currentFormatted >= preferences.bedtime;
}

/**
 * Subject labels for each supported language. Reads the real curriculum record
 * so a subject is never mislabelled (F-02: French/Science must not fall back to
 * "Science" or to English).
 */
function subjectLabel(meta: { subjectId: string; subjectNameAr: string; subjectNameEn: string }, language: Language): string {
  if (language === 'ar') return meta.subjectNameAr;
  if (language === 'fr') return FRENCH_SUBJECT_NAMES[meta.subjectId] || meta.subjectNameEn;
  return meta.subjectNameEn;
}

export interface BuildParentSummaryParams {
  student: Student;
  dayRecords: DayRecord[];
  masteryRecords: Record<string, MasteryRecord>;
  completedMissions: Mission[];
  homeworkItems: HomeworkItem[];
  language?: Language;
}

/**
 * Generates a clean, privacy-respecting summary for the Parent Dashboard.
 * Strictly NEVER exposes:
 *   - Raw homework answers
 *   - Companion chat transcripts
 *   - Individual wrong answers
 *   - Detailed internal evidence logs
 */
export function generateParentWeeklySummary(params: BuildParentSummaryParams): ParentWeeklySummary {
  const {
    student,
    dayRecords,
    masteryRecords,
    completedMissions,
    homeworkItems,
    language = 'ar',
  } = params;

  const isAr = language === 'ar';
  const flatConcepts = curriculumService.getFlatConcepts();
  const conceptMap = new Map(flatConcepts.map((c) => [c.id, c]));

  // 1. Lessons covered count — the real total. No demo baseline: an empty
  // database must read as zero, not as fabricated activity (F-02).
  let lessonsCount = 0;
  dayRecords.forEach((d) => {
    lessonsCount += d.lessonsCovered.length;
  });

  // 2. Homework completion
  const hwTotal = Math.max(1, homeworkItems.length);
  const hwCompleted = homeworkItems.filter((h) => h.status === 'completed').length;

  // 3. Upcoming reviews count (from spaced revision scheduler)
  const dueReviews = getDueReviewConcepts(student.id, masteryRecords, { language });
  const upcomingReviewsCount = dueReviews.length;

  // 4. Subjects needing attention
  const subjectStruggles: Record<string, number> = {};
  Object.values(masteryRecords).forEach((rec) => {
    const meta = conceptMap.get(rec.conceptId);
    if (!meta) return;

    const view = formatMasteryView(rec, language);
    if (view.threshold === 'needs_review' || rec.score < 0.6) {
      // Read the subject name from the real curriculum record instead of mapping
      // every non-maths/non-Arabic subject to "Science" (F-02).
      const sName = subjectLabel(meta, language);

      subjectStruggles[sName] = (subjectStruggles[sName] || 0) + 1;
    }
  });

  // An empty list means no subject needs attention. Do not push a sentence in as
  // if it were a subject.
  const subjectsNeedingAttention = Object.keys(subjectStruggles);

  // 5. Recent achievements (specific, non-gamified wins)
  const recentAchievements: string[] = [];
  const masteredList = Object.values(masteryRecords).filter((r) => r.score >= 0.75);

  if (masteredList.length > 0) {
    const top = conceptMap.get(masteredList[0].conceptId);
    if (top) {
      recentAchievements.push(
        isAr
          ? `إتقان ممتاز لمفهوم: "${top.nameAr}".`
          : `Demonstrated solid mastery in: "${top.nameEn}".`
      );
    }
  }

  if (hwCompleted > 0) {
    recentAchievements.push(
      isAr
        ? `حل وتثبيت ${hwCompleted} واجبات مدرسية باستقلالية متزايدة.`
        : `Completed ${hwCompleted} school assignments with increasing independence.`
    );
  }

  if (completedMissions.length > 0) {
    recentAchievements.push(
      isAr
        ? `إتمام ${completedMissions.length} مهمة دراسية هذا الأسبوع دون انقطاع.`
        : `Completed ${completedMissions.length} structured learning sessions this week.`
    );
  }

  // No evidence of an achievement means an empty list. Do not manufacture
  // praise that the child did not earn (F-02).

  // 6. One recommended action
  const recommendedAction = isAr
    ? 'تشجيع الطالب بكلمة ثناء على التزامه اليومي، ومنحه استراحة مريحة بعد جلسات المذاكرة المسائية.'
    : 'Offer verbal encouragement for consistent study habits and ensure a relaxing break after evening sessions.';

  const now = new Date();
  const weekStart = new Date(now.getTime() - 7 * 24 * 3600 * 1000).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', {
    month: 'short',
    day: 'numeric',
  });
  const weekEnd = now.toLocaleDateString(isAr ? 'ar-EG' : 'en-US', {
    month: 'short',
    day: 'numeric',
  });

  return {
    studentName: student.name,
    grade: student.grade,
    weekRange: `${weekStart} - ${weekEnd}`,
    lessonsCoveredCount: lessonsCount,
    homeworkCompletedCount: hwCompleted,
    homeworkTotalCount: hwTotal,
    upcomingReviewsCount,
    subjectsNeedingAttention,
    recentAchievements,
    recommendedAction,
  };
}
