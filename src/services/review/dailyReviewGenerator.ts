/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  DailyReview,
  Mission,
  MasteryRecord,
  Student,
  Language,
  MissionReviewItem,
  DifficultConceptItem,
  MasteredConceptItem,
  NeedsAttentionItem,
} from '../../types';
import { curriculumService } from '../curriculum/curriculumService';

export interface GenerateDailyReviewParams {
  student: Student;
  missions: Mission[];
  masteryRecords: Record<string, MasteryRecord>;
  date?: string;
  language?: Language;
}

/**
 * Pure TypeScript generator for DailyReview enforcing the strict Tone Rules:
 * 1. Absolutely NO guilt. No "you failed to finish".
 * 2. Use calm, collaborative framing: "X missions remain. Let's decide what to do now."
 * 3. Specific celebrations of concrete effort rather than empty generic praise.
 */
export function generateDailyReview(params: GenerateDailyReviewParams): DailyReview {
  const {
    student,
    missions,
    masteryRecords,
    date = new Date().toISOString().split('T')[0],
    language = 'ar',
  } = params;

  const isAr = language === 'ar';
  const flatConcepts = curriculumService.getFlatConcepts();
  const conceptMap = new Map(flatConcepts.map((c) => [c.id, c]));

  // 1. Partition Missions
  const completedMissions: MissionReviewItem[] = missions
    .filter((m) => m.status === 'completed')
    .map((m) => ({
      id: m.id,
      title: m.title,
      subject: m.subject,
      completed: true,
    }));

  const notCompletedMissions: MissionReviewItem[] = missions
    .filter((m) => m.status !== 'completed')
    .map((m) => ({
      id: m.id,
      title: m.title,
      subject: m.subject,
      completed: false,
    }));

  // 2. Identify Concepts: Difficult vs Mastered vs Needs Attention Tomorrow
  const difficultConcepts: DifficultConceptItem[] = [];
  const masteredConcepts: MasteredConceptItem[] = [];
  const needsAttentionTomorrow: NeedsAttentionItem[] = [];

  Object.values(masteryRecords).forEach((rec) => {
    const meta = conceptMap.get(rec.conceptId);
    if (!meta) return;

    // Check evidence log for struggle / wrong answers today
    const recentEvidence = rec.evidenceLog.slice(-5);
    const struggleEvidence = recentEvidence.filter((e) => e.correctness === 'wrong' || e.independence === 'revealed');

    if (struggleEvidence.length >= 2 || (rec.score < 0.6 && rec.evidenceCount >= 2)) {
      difficultConcepts.push({
        conceptId: rec.conceptId,
        nameAr: meta.nameAr,
        nameEn: meta.nameEn,
        subject: meta.subjectId === 'subj_math' ? (isAr ? 'الرياضيات' : 'Math') : (isAr ? 'اللغة العربية' : 'Arabic'),
        struggleNote: isAr
          ? 'واجهت بعض التحدي في حل المسائل اليوم، وسنراجعها بهدوء بخطوة تمهيدية مبسطة.'
          : 'Encountered some difficulty today; we will revisit this gently with a simplified foundation.',
      });
    }

    if (rec.score >= 0.75 && rec.confidence >= 0.4) {
      masteredConcepts.push({
        conceptId: rec.conceptId,
        nameAr: meta.nameAr,
        nameEn: meta.nameEn,
        subject: meta.subjectId === 'subj_math' ? (isAr ? 'الرياضيات' : 'Math') : (isAr ? 'اللغة العربية' : 'Arabic'),
        score: rec.score,
      });
    }

    if (rec.score < 0.70 && rec.evidenceCount > 0) {
      needsAttentionTomorrow.push({
        conceptId: rec.conceptId,
        nameAr: meta.nameAr,
        nameEn: meta.nameEn,
        subject: meta.subjectId === 'subj_math' ? (isAr ? 'الرياضيات' : 'Math') : (isAr ? 'اللغة العربية' : 'Arabic'),
        reason: isAr
          ? 'تثبيت الفكرة بتطبيق عملي إضافي قصير في خطة الغد.'
          : 'Reinforce understanding with a brief follow-up practice tomorrow.',
      });
    }
  });

  // 3. Calm Tone & Action Note (STRICT NO-GUILT RULE)
  let uncompletedActionNote = '';
  const remainingCount = notCompletedMissions.length;

  if (remainingCount === 0) {
    uncompletedActionNote = isAr
      ? 'أتممت كافة المهام المجدولة لليوم بنجاح رائع وهدوء!'
      : 'You completed every planned mission for today with great calm and focus!';
  } else if (remainingCount === 1) {
    uncompletedActionNote = isAr
      ? 'تبقت مهمة واحدة فقط. دعنا نقرر معاً ماذا نفعل الآن: إما إكمالها سريعاً أو ترحيلها للغد بارتياح.'
      : 'One mission remains. Let’s decide what to do now: either complete it briefly or roll it into tomorrow comfortably.';
  } else {
    uncompletedActionNote = isAr
      ? `تبقت ${remainingCount} مهام. دعنا نقرر ماذا نفعل الآن دون أي استعجال.`
      : `${remainingCount} missions remain. Let’s decide what to do now without any pressure.`;
  }

  // 4. Grounded, Specific Praise
  let tonePraise = '';
  if (completedMissions.length > 0) {
    const firstDone = completedMissions[0];
    tonePraise = isAr
      ? `تركيزك اليوم في إنجاز "${firstDone.title}" بمادة ${firstDone.subject} خطوة ممتازة نحو التمكن والتفوق.`
      : `Your focus on finishing "${firstDone.title}" in ${firstDone.subject} today is a solid step toward true mastery.`;
  } else {
    tonePraise = isAr
      ? 'حضورك اليوم ومتابعة ملخصك الدراسي خطوة مهمة لتنظيم عاداتك الدراسية.'
      : 'Showing up today and reviewing your academic plan is a valuable step in building steady learning habits.';
  }

  const summaryText = isAr
    ? `ملخص يوم ${student.name}: تم إنجاز ${completedMissions.length} من أصل ${missions.length} مهمة، وتحديد النقاط التي تحتاج عناية الغد.`
    : `Daily Review for ${student.name}: ${completedMissions.length} of ${missions.length} missions completed, with clear next steps mapped for tomorrow.`;

  return {
    id: `review_${student.id}_${date}`,
    studentId: student.id,
    date,
    completedMissions,
    notCompletedMissions,
    difficultConcepts: difficultConcepts.slice(0, 3),
    masteredConcepts: masteredConcepts.slice(0, 3),
    needsAttentionTomorrow: needsAttentionTomorrow.slice(0, 3),
    tonePraise,
    uncompletedActionNote,
    summaryText,
    createdAt: new Date().toISOString(),
  };
}
