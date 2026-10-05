/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Student,
  DayRecord,
  MasteryRecord,
  Mission,
  HomeworkItem,
  SavedItem,
  WeeklyReview,
  LessonSummaryItem,
  RepeatedErrorItem,
  ConceptMasterySummaryItem,
  ModalityEffectiveness,
  Language,
} from '../../types';
import { getFlatConcepts } from '../../data/demoCurriculum';
import { formatMasteryView } from '../mastery/masteryEngine';

export interface GenerateWeeklyReviewParams {
  student: Student;
  dayRecords: DayRecord[];
  masteryRecords: Record<string, MasteryRecord>;
  completedMissions: Mission[];
  homeworkItems: HomeworkItem[];
  savedItems?: SavedItem[];
  language?: Language;
  customStartDate?: string;
  customEndDate?: string;
}

/**
 * Pure TypeScript WeeklyReview generator adhering strictly to the non-guilt, specific wins tone rules.
 */
export function generateWeeklyReview(params: GenerateWeeklyReviewParams): WeeklyReview {
  const {
    student,
    dayRecords,
    masteryRecords,
    completedMissions,
    homeworkItems,
    savedItems = [],
    language = 'ar',
    customStartDate,
    customEndDate,
  } = params;

  const isAr = language === 'ar';
  const now = new Date();
  const weekEndDate = customEndDate || now.toISOString().split('T')[0];
  const weekStartObj = new Date(now.getTime() - 7 * 24 * 3600 * 1000);
  const weekStartDate = customStartDate || weekStartObj.toISOString().split('T')[0];

  const flatConcepts = getFlatConcepts();
  const conceptMap = new Map(flatConcepts.map((c) => [c.id, c]));

  // 1. Lessons covered this week
  const lessonsCovered: LessonSummaryItem[] = [];
  const seenLessons = new Set<string>();

  dayRecords.forEach((record) => {
    // Only records within this week range
    if (record.date >= weekStartDate && record.date <= weekEndDate) {
      record.lessonsCovered.forEach((l) => {
        const key = `${l.subject}_${l.topic || ''}`;
        if (!seenLessons.has(key)) {
          seenLessons.add(key);
          lessonsCovered.push({
            subject: l.subject,
            topic: l.topic,
            date: record.date,
          });
        }
      });
    }
  });

  // Fallback demo lessons if records are empty
  if (lessonsCovered.length === 0) {
    lessonsCovered.push(
      { subject: isAr ? 'الرياضيات' : 'Mathematics', topic: isAr ? 'ضرب الكسور الاعتيادية' : 'Multiplying Fractions' },
      { subject: isAr ? 'اللغة العربية' : 'Arabic', topic: isAr ? 'المفعول به وعلامات إعرابه' : 'Direct Object and Inflections' },
      { subject: isAr ? 'العلوم' : 'Science', topic: isAr ? 'السلاسل والشبكات الغذائية' : 'Food Chains & Food Webs' }
    );
  }

  // 2. Homework completion
  const recentHomework = homeworkItems.filter((hw) => !hw.date || (hw.date >= weekStartDate && hw.date <= weekEndDate));
  const hwTotal = recentHomework.length > 0 ? recentHomework.length : Math.max(1, homeworkItems.length);
  const hwCompleted = recentHomework.length > 0
    ? recentHomework.filter((hw) => hw.status === 'completed').length
    : homeworkItems.filter((hw) => hw.status === 'completed').length;

  const hwPercentage = Math.round((hwCompleted / Math.max(1, hwTotal)) * 100);

  // 3. Quiz performance trend & all evidence analysis
  let totalScoreSum = 0;
  let quizEvidenceCount = 0;
  const modalityStats: Record<string, { total: number; fullCorrect: number }> = {
    quiz: { total: 0, fullCorrect: 0 },
    practice: { total: 0, fullCorrect: 0 },
    game: { total: 0, fullCorrect: 0 },
    reel_check: { total: 0, fullCorrect: 0 },
    homework: { total: 0, fullCorrect: 0 },
  };

  const repeatedErrors: RepeatedErrorItem[] = [];
  const weakConcepts: ConceptMasterySummaryItem[] = [];
  const strongConcepts: ConceptMasterySummaryItem[] = [];

  Object.values(masteryRecords).forEach((rec) => {
    const meta = conceptMap.get(rec.conceptId);
    if (!meta) return;

    const subjName = meta.subjectId === 'subj_math'
      ? (isAr ? 'الرياضيات' : 'Mathematics')
      : meta.subjectId === 'subj_arabic'
      ? (isAr ? 'اللغة العربية' : 'Arabic')
      : (isAr ? 'العلوم' : 'Science');

    // Tally evidence
    const recentEvidence = rec.evidenceLog.slice(-5);
    const wrongEvidence = recentEvidence.filter((e) => e.correctness === 'wrong');
    if (wrongEvidence.length >= 2) {
      repeatedErrors.push({
        conceptId: rec.conceptId,
        nameAr: meta.nameAr,
        nameEn: meta.nameEn,
        subject: subjName,
        errorCount: wrongEvidence.length,
      });
    }

    // Collect weak concepts (needs_review or score < 0.6)
    const view = formatMasteryView(rec, language);
    if (view.threshold === 'needs_review' || (rec.score < 0.65 && rec.evidenceCount > 0)) {
      weakConcepts.push({
        conceptId: rec.conceptId,
        nameAr: meta.nameAr,
        nameEn: meta.nameEn,
        subject: subjName,
        score: rec.score,
      });
    }

    // Collect strong concepts (mastered)
    if (rec.score >= 0.75 && rec.confidence >= 0.35) {
      strongConcepts.push({
        conceptId: rec.conceptId,
        nameAr: meta.nameAr,
        nameEn: meta.nameEn,
        subject: subjName,
        score: rec.score,
      });
    }

    // Modality breakdown
    rec.evidenceLog.forEach((ev) => {
      const mod = ev.modality || 'quiz';
      if (!modalityStats[mod]) {
        modalityStats[mod] = { total: 0, fullCorrect: 0 };
      }
      modalityStats[mod].total++;
      if (ev.correctness === 'full') {
        modalityStats[mod].fullCorrect++;
      }
      if (mod === 'quiz') {
        totalScoreSum += ev.correctness === 'full' ? 1 : ev.correctness === 'partial' ? 0.6 : 0.2;
        quizEvidenceCount++;
      }
    });
  });

  // Quiz trend details
  const averageQuizScore = quizEvidenceCount > 0 ? Math.round((totalScoreSum / quizEvidenceCount) * 100) : 84;
  const trend: 'improving' | 'steady' | 'needs_boost' =
    averageQuizScore >= 80 ? 'improving' : averageQuizScore >= 65 ? 'steady' : 'needs_boost';

  const detailsAr = trend === 'improving'
    ? `أداء متصاعد ومطمئن في الأسئلة القصيرة بمعدل استيعاب يبلغ ${averageQuizScore}٪.`
    : trend === 'steady'
    ? `أداء مستقر ومتوازن في التقييمات السريعة بنسبة ${averageQuizScore}٪.`
    : `فرصة طيبة لمزيد من التمرن في جو مريح لتحسين الدقة (${averageQuizScore}٪).`;

  const detailsEn = trend === 'improving'
    ? `Ascending and confident performance on quick checks with ${averageQuizScore}% retention rate.`
    : trend === 'steady'
    ? `Consistent and steady performance across quizzes with ${averageQuizScore}% success.`
    : `A gentle opportunity to practice with simplified steps (${averageQuizScore}%).`;

  // 4. Time spent
  const timeSpentMinutes = completedMissions.reduce((acc, m) => acc + (m.estimatedMinutes || 10), 0) || 75;

  // 5. Format effectiveness
  const modalityLabels: Record<string, { ar: string; en: string }> = {
    game: { ar: 'الألعاب والتحديات التفاعلية', en: 'Interactive Games' },
    practice: { ar: 'التمارين التدريجية مع الرفيق', en: 'Guided Practice' },
    reel_check: { ar: 'المقاطع التعليمية السريعة', en: 'Micro-Lessons & Reels' },
    quiz: { ar: 'الاختبارات الذاتية القصيرة', en: 'Self-Check Quizzes' },
    homework: { ar: 'تطبيق الواجبات المدرسية', en: 'Homework Tasks' },
  };

  const formatEffectiveness: ModalityEffectiveness[] = Object.entries(modalityStats)
    .filter(([_, stats]) => stats.total > 0)
    .map(([mod, stats]) => {
      const retentionScore = Math.round((stats.fullCorrect / stats.total) * 100) / 100;
      const meta = modalityLabels[mod] || { ar: mod, en: mod };
      return {
        modality: mod as ModalityEffectiveness['modality'],
        labelAr: meta.ar,
        labelEn: meta.en,
        retentionScore,
        sampleCount: stats.total,
        descriptionAr: retentionScore >= 0.8
          ? `أعلى معدل استيعاب وحفظ للمفاهيم (${Math.round(retentionScore * 100)}٪).`
          : `معدل استيعاب متوسط (${Math.round(retentionScore * 100)}٪) يزداد مع الممارسة.`,
        descriptionEn: retentionScore >= 0.8
          ? `Highest retention and comprehension rate (${Math.round(retentionScore * 100)}%).`
          : `Moderate retention (${Math.round(retentionScore * 100)}%) improves with frequency.`,
      };
    })
    .sort((a, b) => b.retentionScore - a.retentionScore);

  // If empty, add standard pleasant modalities
  if (formatEffectiveness.length === 0) {
    formatEffectiveness.push(
      {
        modality: 'game',
        labelAr: 'الألعاب والتحديات التفاعلية',
        labelEn: 'Interactive Games',
        retentionScore: 0.92,
        sampleCount: 5,
        descriptionAr: 'تحقق أعلى تركيز واحتفاظ ذهني بالمعلومات.',
        descriptionEn: 'Yields highest retention and conceptual engagement.',
      },
      {
        modality: 'practice',
        labelAr: 'التمارين التدريجية مع الرفيق',
        labelEn: 'Guided Practice',
        retentionScore: 0.85,
        sampleCount: 6,
        descriptionAr: 'تثبيت ممتاز للمسائل خطوة بخطوة.',
        descriptionEn: 'Excellent step-by-step problem reinforcement.',
      }
    );
  }

  // 6. One recommended focus for next week
  let recommendedFocus = {
    subject: isAr ? 'الرياضيات' : 'Mathematics',
    conceptNameAr: 'ضرب الكسور الاعتيادية',
    conceptNameEn: 'Multiplying Fractions',
    rationaleAr: 'تثبيت تحويل الأعداد الكسرية قبل الضرب سيمنحك سهولة فائقة في حل مسائل الأسبوع القادم.',
    rationaleEn: 'Practicing fraction conversion prior to multiplication will make upcoming lessons a breeze.',
  };

  if (weakConcepts.length > 0) {
    const focusTarget = weakConcepts[0];
    recommendedFocus = {
      subject: focusTarget.subject,
      conceptNameAr: focusTarget.nameAr,
      conceptNameEn: focusTarget.nameEn,
      rationaleAr: `جلسة واحدة مدتها 10 دقائق لمفهوم (${focusTarget.nameAr}) كافية لاستعادة الثقة التامة.`,
      rationaleEn: `A single 10-minute refresh for (${focusTarget.nameEn}) is enough to restore complete confidence.`,
    };
  } else if (repeatedErrors.length > 0) {
    const errorTarget = repeatedErrors[0];
    recommendedFocus = {
      subject: errorTarget.subject,
      conceptNameAr: errorTarget.nameAr,
      conceptNameEn: errorTarget.nameEn,
      rationaleAr: `مراجعة لطيفة للملاحظات الأساسية في (${errorTarget.nameAr}) لتلافي تكرار الأخطاء البسيطة.`,
      rationaleEn: `A gentle review of key points in (${errorTarget.nameEn}) to prevent minor calculation slips.`,
    };
  }

  // 7. Non-guilt tone messages
  const toneMessageAr = strongConcepts.length > 0
    ? `أسبوع مليء بالخطوات الثابتة يا ${student.name}! أنجزت ${strongConcepts.length} مفاهيم بتفوق، ووقت دراستك (${timeSpentMinutes} دقيقة) يعكس التزامك الرائع دون أي ضغوط.`
    : `أسبوع إيجابي يا ${student.name}! خطوت خطوات حقيقية في ترسيخ معلومات المدرسة، وكل دقيقة بذلتها تثري حصيلتك المعرفية بهدوء.`;

  const toneMessageEn = strongConcepts.length > 0
    ? `A week of solid accomplishments, ${student.name}! You mastered ${strongConcepts.length} concepts smoothly, and your study time (${timeSpentMinutes} min) reflects great focus without pressure.`
    : `A positive week, ${student.name}! You made tangible progress cementing school topics at a healthy, sustainable pace.`;

  return {
    id: `wk_rev_${student.id}_${weekStartDate}`,
    studentId: student.id,
    weekStartDate,
    weekEndDate,
    createdAt: new Date().toISOString(),
    lessonsCovered,
    homeworkCompletion: {
      completed: hwCompleted,
      total: hwTotal,
      percentage: hwPercentage,
    },
    quizPerformanceTrend: {
      averageScore: averageQuizScore,
      trend,
      detailsAr,
      detailsEn,
    },
    repeatedErrors,
    weakConcepts,
    strongConcepts,
    savedContentCount: savedItems.length,
    timeSpentMinutes,
    formatEffectiveness,
    recommendedFocus,
    toneMessageAr,
    toneMessageEn,
  };
}
