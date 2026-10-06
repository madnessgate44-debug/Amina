/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  MasteryRecord,
  FlatCurriculumConcept,
  SpacedReviewSchedule,
  SpacedReviewSummary,
  Language,
} from '../../types';
import { curriculumService } from '../curriculum/curriculumService';
import { formatMasteryView } from '../mastery/masteryEngine';

export interface SchedulerOptions {
  currentDate?: Date;
  language?: Language;
  flaggedForReviewConceptIds?: Set<string>;
}

/**
 * Computes the adaptive spaced revision schedule for a single concept with mastery evidence.
 * Follows the adaptive interval ladder:
 *   - Strong + high confidence   → 7-14 days
 *   - Strong + medium confidence → 4-7 days
 *   - Medium                     → 2-4 days
 *   - Weak                       → 1-2 days
 *   - Just revealed              → retry next session (0.5 - 1 day)
 *
 * Failure paths:
 *   - No prior evidence → concept does not enter review queue (returns null)
 *   - Concept just mastered → enters review queue with longest interval (14 days)
 *   - Concept flagged for review → enters queue with short interval (1 day)
 */
export function computeConceptReviewSchedule(
  studentId: string,
  concept: FlatCurriculumConcept,
  masteryRecord: MasteryRecord | undefined,
  options: SchedulerOptions = {}
): SpacedReviewSchedule | null {
  // Failure path 1: No prior evidence → concept does not enter review queue
  if (!masteryRecord || masteryRecord.evidenceCount === 0 || masteryRecord.evidenceLog.length === 0) {
    return null;
  }

  const {
    currentDate = new Date(),
    language = 'ar',
    flaggedForReviewConceptIds = new Set<string>(),
  } = options;

  const isAr = language === 'ar';
  const lastEvidence = masteryRecord.evidenceLog[masteryRecord.evidenceLog.length - 1];
  const recentEvidence = masteryRecord.evidenceLog.slice(-3);
  const masteryView = formatMasteryView(masteryRecord, language);

  const lastPracticedTime = new Date(masteryRecord.lastUpdated).getTime();
  const nowTime = currentDate.getTime();
  const daysSincePractice = Math.max(0, (nowTime - lastPracticedTime) / (1000 * 3600 * 24));

  // Analyze recent evidence trends
  const recentCorrectCount = recentEvidence.filter((e) => e.correctness === 'full').length;
  const recentUnassistedCount = recentEvidence.filter((e) => e.independence === 'unassisted').length;
  const isFlagged = flaggedForReviewConceptIds.has(concept.id) || masteryView.threshold === 'needs_review';

  let intervalDays: number;
  let status: SpacedReviewSchedule['status'] = 'upcoming';
  let reason = '';

  // 1. Just revealed (post-answer) → retry next session (0.5 to 1 day)
  if (lastEvidence && lastEvidence.independence === 'revealed') {
    intervalDays = 1;
    status = 'just_revealed';
    reason = isAr
      ? 'تم الكشف عن الحل الكامل في آخر محاولة؛ يُنصح بإعادة المحاولة المستقلة في الجلسة التالية.'
      : 'Solution was revealed on last attempt; retry independently next session.';
  }
  // 2. Flagged for review (e.g. Phase 5 tutor ladder or needs_review) → short interval (1 day)
  else if (isFlagged || masteryRecord.score < 0.6) {
    intervalDays = recentCorrectCount >= 2 ? 2 : 1;
    status = 'due';
    reason = isAr
      ? 'المفهوم بحاجة إلى تعزيز ومراجعة قريبة لتثبيت الأساسيات.'
      : 'Concept requires quick review to reinforce fundamentals.';
  }
  // 3. Medium mastery (0.6 <= score < 0.8) → 2-4 days
  else if (masteryRecord.score < 0.8) {
    if (recentCorrectCount === 3 && recentUnassistedCount >= 2) {
      intervalDays = 4;
    } else if (recentCorrectCount >= 2) {
      intervalDays = 3;
    } else {
      intervalDays = 2;
    }
    reason = isAr
      ? 'المفهوم في مرحلة التعلم النشط؛ المراجعة بعد بضعة أيام تضمن الاستيعاب التام.'
      : 'Concept is actively being learned; review in a few days ensures solid retention.';
  }
  // 4. Strong mastery (score >= 0.8)
  else {
    if (masteryView.confidenceBand === 'high') {
      // High confidence (>= 0.7) → 7-14 days
      // Concept just mastered with strong track record gets longest interval (14 days)
      if (recentCorrectCount === 3 && recentUnassistedCount === 3) {
        intervalDays = 14;
      } else if (recentCorrectCount >= 2) {
        intervalDays = 10;
      } else {
        intervalDays = 7;
      }
      status = 'mastered';
      reason = isAr
        ? 'إتقان قوي وثقة عالية! المراجعة المتباعدة طويلة المدى (كل أسبوع أو أسبوعين).'
        : 'Strong mastery and high confidence! Long-range spaced revision (7-14 days).';
    } else if (masteryView.confidenceBand === 'medium') {
      // Medium confidence → 4-7 days
      intervalDays = recentCorrectCount >= 2 ? 6 : 4;
      reason = isAr
        ? 'الدرجة ممتازة وبحاجة لمزيد من الأدلة لرفع الثقة؛ مراجعة خلال 4-7 أيام.'
        : 'Good score with moderate confidence; review in 4-7 days.';
    } else {
      // Low confidence → 3-4 days
      intervalDays = 3;
      reason = isAr
        ? 'درجة جيدة ولكن الثقة ما زالت منخفضة لقلة المحاولات؛ مراجعة سريعة.'
        : 'Good score but low confidence due to limited samples; quick check in 3 days.';
    }
  }

  // Calculate next review timestamp
  const nextReviewTime = lastPracticedTime + intervalDays * 24 * 3600 * 1000;
  const nextReviewAt = new Date(nextReviewTime).toISOString();
  const isDue = nowTime >= nextReviewTime;
  const overdueDays = Math.max(0, Math.floor(daysSincePractice - intervalDays));
  const isOverdue = overdueDays >= 3;

  if (isOverdue) {
    status = 'overdue';
  } else if (isDue && status !== 'just_revealed') {
    status = 'due';
  }

  const subjectName = concept.subjectId === 'subj_math'
    ? (isAr ? 'الرياضيات' : 'Mathematics')
    : concept.subjectId === 'subj_arabic'
    ? (isAr ? 'اللغة العربية' : 'Arabic')
    : (isAr ? 'العلوم' : 'Science');

  return {
    conceptId: concept.id,
    studentId,
    subjectId: concept.subjectId,
    subjectName,
    conceptNameAr: concept.nameAr,
    conceptNameEn: concept.nameEn,
    masteryScore: masteryRecord.score,
    confidence: masteryRecord.confidence,
    confidenceBand: masteryView.confidenceBand,
    intervalDays,
    lastPracticedAt: new Date(lastPracticedTime).toISOString(),
    nextReviewAt,
    isDue,
    isOverdue,
    overdueDays,
    status,
    reason,
  };
}

/**
 * Computes all spaced review schedules across all curriculum concepts for a student.
 */
export function getAllSpacedReviewSchedules(
  studentId: string,
  masteryRecords: Record<string, MasteryRecord>,
  options: SchedulerOptions = {}
): SpacedReviewSummary {
  const flatConcepts = curriculumService.getFlatConcepts();
  const items: SpacedReviewSchedule[] = [];

  for (const concept of flatConcepts) {
    const rec = masteryRecords[concept.id];
    const schedule = computeConceptReviewSchedule(studentId, concept, rec, options);
    if (schedule) {
      items.push(schedule);
    }
  }

  // Sort: overdue first (by overdueDays desc), then due, then upcoming (by nextReviewAt asc)
  items.sort((a, b) => {
    if (a.isOverdue && !b.isOverdue) return -1;
    if (!a.isOverdue && b.isOverdue) return 1;
    if (a.isDue && !b.isDue) return -1;
    if (!a.isDue && b.isDue) return 1;
    if (a.isOverdue && b.isOverdue) return b.overdueDays - a.overdueDays;
    return new Date(a.nextReviewAt).getTime() - new Date(b.nextReviewAt).getTime();
  });

  const dueCount = items.filter((i) => i.isDue).length;
  const overdueCount = items.filter((i) => i.isOverdue).length;
  const upcomingCount = items.filter((i) => !i.isDue).length;

  return {
    dueCount,
    overdueCount,
    upcomingCount,
    items,
  };
}

/**
 * Retrieves the list of concepts currently due or overdue for spaced revision.
 */
export function getDueReviewConcepts(
  studentId: string,
  masteryRecords: Record<string, MasteryRecord>,
  options: SchedulerOptions = {}
): SpacedReviewSchedule[] {
  const summary = getAllSpacedReviewSchedules(studentId, masteryRecords, options);
  return summary.items.filter((item) => item.isDue);
}

/**
 * Retrieves concepts that are overdue by 3+ days for the gentle nudge on Home.
 */
export function getOverdueReviewNudges(
  studentId: string,
  masteryRecords: Record<string, MasteryRecord>,
  options: SchedulerOptions = {}
): SpacedReviewSchedule[] {
  const summary = getAllSpacedReviewSchedules(studentId, masteryRecords, options);
  return summary.items.filter((item) => item.isOverdue);
}
