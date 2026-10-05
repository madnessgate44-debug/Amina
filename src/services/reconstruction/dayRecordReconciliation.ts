/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Timetable, SchoolDayKey, DayRecord, LessonCovered, HomeworkItem, DayRecordDiscrepancies, Language } from '../../types';

export interface ExtractedDayData {
  lessonsCovered: LessonCovered[];
  homeworkAssigned: HomeworkItem[];
  notes?: string;
  isSilence?: boolean;
  isVague?: boolean;
  detectedConfidence: 'high' | 'partial' | 'vague';
}

export interface ReconciliationResult {
  discrepancies: DayRecordDiscrepancies;
  scheduledSubjects: string[];
  mentionedSubjects: string[];
  neutralFollowUpPrompt?: string;
  naturalLanguageSummary: string;
}

// Normalized subject matching
function normalizeSubject(name: string): string {
  const clean = name.toLowerCase().trim();

  // French Math
  if (
    (clean.includes('math') && (clean.includes('fr') || clean.includes('فرنس'))) ||
    clean.includes('mathématiques') ||
    clean.includes('رياضيات بالفرنسية')
  ) {
    return 'math_fr';
  }

  // French Science
  if (
    (clean.includes('sci') && (clean.includes('fr') || clean.includes('فرنس'))) ||
    clean.includes('sciences fr') ||
    clean.includes('علوم بالفرنسية')
  ) {
    return 'science_fr';
  }

  // French Language
  if (clean.includes('فرنساوي') || clean.includes('فرنسي') || clean.includes('french') || clean.includes('français')) {
    return 'french';
  }

  if (clean.includes('عرب') || clean.includes('arabic')) return 'arabic';
  if (clean.includes('رياض') || clean.includes('حساب') || clean.includes('math')) return 'math';
  if (clean.includes('علوم') || clean.includes('ساينس') || clean.includes('science')) return 'science';
  if (clean.includes('دراس') || clean.includes('social')) return 'social';
  if (clean.includes('إنجليز') || clean.includes('انجليز') || clean.includes('english')) return 'english';
  if (clean.includes('تكنولوج') || clean.includes('ict')) return 'ict';
  if (clean.includes('دين') || clean.includes('islamic') || clean.includes('religion')) return 'religion';
  if (clean.includes('رسم') || clean.includes('فني') || clean.includes('art')) return 'art';
  if (clean.includes('رياضي') || clean.includes('pe') || clean.includes('gym') || clean.includes('ألعاب')) return 'pe';
  if (clean.includes('خط') || clean.includes('calligraphy')) return 'calligraphy';
  return clean;
}

export function detectSilenceOrAmnesia(text: string): boolean {
  const trimmed = text.trim().toLowerCase();
  if (!trimmed) return true;
  const silencePhrases = [
    'مش فاكر',
    'نسيت',
    'مش متذكر',
    'مش عارف',
    'don\'t remember',
    'dont remember',
    'i forgot',
    'forgot',
    'nothing',
    'لا اتذكر',
    'معرفش',
  ];
  return silencePhrases.some((p) => trimmed.includes(p));
}

export function detectVagueness(text: string): boolean {
  const trimmed = text.trim().toLowerCase();
  const vaguePhrases = [
    'عادي',
    'معملناش حاجة',
    'درسنا وخلاص',
    'يوم عادي',
    'حاجات عادية',
    'stuff',
    'we did stuff',
    'nothing special',
    'just normal',
  ];
  const words = trimmed.split(/\s+/);
  return vaguePhrases.some((p) => trimmed === p || trimmed.includes(p)) || (words.length <= 2 && !trimmed.includes('واجب') && !trimmed.includes('درس'));
}

/**
 * Pure logic reconciliation between AI extracted day data and the student's timetable.
 */
export function reconcileDayWithTimetable(
  extracted: ExtractedDayData,
  timetable: Timetable | null,
  dayKey: SchoolDayKey,
  language: Language
): ReconciliationResult {
  const isArabic = language === 'ar';

  // 1. Extract scheduled subjects from timetable
  let scheduledSubjects: string[] = [];
  if (timetable && timetable.days) {
    const todaySchedule = timetable.days.find((d) => d.day === dayKey);
    if (todaySchedule) {
      scheduledSubjects = todaySchedule.periods
        .filter((p) => !p.isBreak && !p.subject.includes('استراحة') && !p.subject.includes('فسحة'))
        .map((p) => p.subject);
    }
  }

  // Deduplicate scheduled subjects
  const uniqueScheduled = Array.from(new Set(scheduledSubjects));
  const normalizedScheduled = new Map<string, string>(); // normalizedKey -> originalName
  for (const s of uniqueScheduled) {
    normalizedScheduled.set(normalizeSubject(s), s);
  }

  // 2. Extract mentioned subjects from student's extracted data
  const mentionedSet = new Set<string>();
  extracted.lessonsCovered.forEach((l) => mentionedSet.add(l.subject));
  extracted.homeworkAssigned.forEach((h) => mentionedSet.add(h.subject));
  const mentionedSubjects = Array.from(mentionedSet);

  const normalizedMentioned = new Set<string>();
  for (const s of mentionedSubjects) {
    normalizedMentioned.add(normalizeSubject(s));
  }

  // 3. Compare sets
  const unexpectedSubjects: string[] = [];
  const missingTimetableSubjects: string[] = [];

  // If timetable is missing entirely, skip mismatch flags (rely fully on student description)
  if (uniqueScheduled.length > 0) {
    for (const [norm, orig] of normalizedScheduled.entries()) {
      if (!normalizedMentioned.has(norm)) {
        missingTimetableSubjects.push(orig);
      }
    }

    for (const m of mentionedSubjects) {
      if (!normalizedScheduled.has(normalizeSubject(m))) {
        unexpectedSubjects.push(m);
      }
    }
  }

  const discrepancies: DayRecordDiscrepancies = {
    missingTimetableSubjects: missingTimetableSubjects.length > 0 ? missingTimetableSubjects : undefined,
    unexpectedSubjects: unexpectedSubjects.length > 0 ? unexpectedSubjects : undefined,
    isVague: extracted.isVague || extracted.detectedConfidence === 'vague',
    notes: extracted.notes,
  };

  // 4. Generate Neutral Follow-up Prompt based on failure paths
  let neutralFollowUpPrompt: string | undefined;

  if (extracted.isSilence) {
    // Failure path 1: Student says nothing / doesn't remember
    if (uniqueScheduled.length > 0) {
      const topSubjects = uniqueScheduled.slice(0, 2).join(isArabic ? ' و ' : ' and ');
      neutralFollowUpPrompt = isArabic
        ? `ولا يهمك خالص! حسب جدولك كان عندك النهارده ${topSubjects}. تحب تقولي إيه اللي حصل في ${uniqueScheduled[0]}؟`
        : `No worries at all! According to your timetable you had ${topSubjects} today. Want to tell me what happened in ${uniqueScheduled[0]}?`;
    } else {
      neutralFollowUpPrompt = isArabic
        ? 'ولا يهمك يا بطل! فاكر أي مادة أو واجب أخدته النهارده نبدأ بيه؟'
        : 'No problem at all! Do you remember any specific subject or homework you received today?';
    }
  } else if (unexpectedSubjects.length > 0 && uniqueScheduled.length > 0) {
    // Failure path 2: Description contradicts timetable
    const firstUnexpected = unexpectedSubjects[0];
    const missingExample = missingTimetableSubjects[0] || uniqueScheduled[0];
    neutralFollowUpPrompt = isArabic
      ? `جدولك بيقول كان عندك ${missingExample} النهارده، وأنت ذكرت ${firstUnexpected} — هل الجدول اتغير النهارده في المدرسة؟`
      : `Your timetable shows ${missingExample} today, and you mentioned ${firstUnexpected} — did your school schedule change today?`;
  } else if (discrepancies.isVague) {
    // Failure path 3: Student was vague ("we did stuff")
    const focusSub = uniqueScheduled[0] || (isArabic ? 'اللغة العربية' : 'Arabic');
    neutralFollowUpPrompt = isArabic
      ? `فهمت إن اليوم كان ماشي بهدوء. يا ترى أخدتم درس جديد أو حل تمارين في ${focusSub}؟`
      : `Got it! Did you start a new lesson or practice problems in ${focusSub} today?`;
  }

  // 5. Generate Natural Language Readback Summary
  const naturalLanguageSummary = generateNaturalLanguageSummary(
    extracted.lessonsCovered,
    extracted.homeworkAssigned,
    language
  );

  return {
    discrepancies,
    scheduledSubjects: uniqueScheduled,
    mentionedSubjects,
    neutralFollowUpPrompt,
    naturalLanguageSummary,
  };
}

/**
 * Reads back the proposed Day Record in warm natural language (NEVER a sterile form).
 * E.g.: "So today you had Arabic — new lesson on verbs, homework due tomorrow. And Math — fractions practice. Did I get that right?"
 */
export function generateNaturalLanguageSummary(
  lessons: LessonCovered[],
  homework: HomeworkItem[],
  language: Language
): string {
  const isArabic = language === 'ar';

  if (lessons.length === 0 && homework.length === 0) {
    return isArabic
      ? 'سجلت إن اليوم كان مراجعة عامة بدون واجبات جديدة مسجلة. تحب نضيف أي تفاصيل تانية؟'
      : 'I noted that today was a general review day with no new homework recorded. Would you like to add anything else?';
  }

  const parts: string[] = [];

  lessons.forEach((l) => {
    if (isArabic) {
      let desc = `في ${l.subject}`;
      if (l.topic) desc += `: درس «${l.topic}»`;
      if (l.notes) desc += ` (${l.notes})`;
      parts.push(desc);
    } else {
      let desc = `in ${l.subject}`;
      if (l.topic) desc += `: lesson on "${l.topic}"`;
      if (l.notes) desc += ` (${l.notes})`;
      parts.push(desc);
    }
  });

  const hwParts: string[] = [];
  homework.forEach((h) => {
    if (isArabic) {
      let desc = `واجب ${h.subject}`;
      if (h.description) desc += `: ${h.description}`;
      if (h.dueDate) desc += ` (تسليم: ${h.dueDate})`;
      hwParts.push(desc);
    } else {
      let desc = `homework for ${h.subject}`;
      if (h.description) desc += `: ${h.description}`;
      if (h.dueDate) desc += ` (due: ${h.dueDate})`;
      hwParts.push(desc);
    }
  });

  if (isArabic) {
    let summary = 'يعني النهارده ';
    if (parts.length > 0) {
      summary += parts.join('، ومادة ') + '.';
    }
    if (hwParts.length > 0) {
      summary += ' وبالنسبة للواجبات: ' + hwParts.join('، و') + '.';
    }
    summary += ' فهمت كلامك صح كده ولا تحب نعدل حاجة؟';
    return summary;
  } else {
    let summary = 'So today you had ';
    if (parts.length > 0) {
      summary += parts.join(', and ') + '.';
    }
    if (hwParts.length > 0) {
      summary += ' And for homework: ' + hwParts.join(', and ') + '.';
    }
    summary += ' Did I get that right, or would you like to tweak anything?';
    return summary;
  }
}
