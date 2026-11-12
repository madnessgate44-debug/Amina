/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Canonical subject identity.
 *
 * The app stores subject names in several shapes: the curriculum's own
 * `subjectNameAr/En/Fr` (e.g. "الرياضيات"), the timetable's display labels
 * (e.g. "الرياضيات بالفرنسية (Maths)"), the server's day-record subjects, and
 * parent-typed exam names. Any code that compares two of those strings with an
 * exact match silently misses the others.
 *
 * `canonicalSubjectId` reduces a subject label to one stable identity so two
 * labels for the same subject compare equal. It is deliberately conservative:
 * an unrecognised label yields '' and callers must treat that as "no match"
 * rather than guessing.
 */

/**
 * Maps a subject label in Arabic, French or English to one canonical id:
 * `arabic | math | science | french | social | english | ict | islamic |
 * calligraphy`. Returns '' when the label names no known subject.
 *
 * The Egyptian national curriculum teaches maths and science in French, so a
 * French-labelled maths/science subject is the SAME identity as its Arabic
 * label — French wording must never create a second subject.
 */
export function canonicalSubjectId(name?: string): string {
  if (!name) return '';
  const s = name.trim().toLowerCase();
  if (!s) return '';

  // Physical education must be caught BEFORE the generic "رياض" (math) check:
  // "تربية رياضية" (PE) contains the letters of "رياض" and would otherwise be
  // read as maths. PE has no curriculum lessons, so it is its own identity.
  if (
    s.includes('رياضة') ||
    s.includes('رياضية') ||
    s.includes('بدنية') ||
    s.includes('physical') ||
    s.includes('sport') ||
    s.includes('pe ')
  ) {
    return 'pe';
  }

  const isFrench = s.includes('franç') || s.includes('french') || s.includes('francais') || s.includes('français') || s.includes('فرنس');

  // French-taught maths/science keep the canonical identity of the subject.
  if ((s.includes('math') || s.includes('رياض') || s.includes('حساب')) && isFrench) return 'math';
  if ((s.includes('sci') || s.includes('علوم') || s.includes('ساينس')) && isFrench) return 'science';
  if (s.includes('mathématiques') || s.includes('mathematiques')) return 'math';

  // French Language must be checked before the generic "فرنس" alias.
  if (s.includes('français') || s.includes('francais') || s.includes('french') || s.includes('فرنساوي') || s.includes('اللغة الفرنسية') || s.includes('فرنسي')) {
    return 'french';
  }

  if (s.includes('عرب') || s.includes('arabic') || s.includes('لغة عربية')) return 'arabic';
  if (s.includes('رياض') || s.includes('حساب') || s.includes('math')) return 'math';
  if (s.includes('علوم') || s.includes('ساينس') || s.includes('science')) return 'science';
  if (s.includes('دراس') || s.includes('social')) return 'social';
  if (s.includes('إنجليز') || s.includes('انجليز') || s.includes('english')) return 'english';
  if (s.includes('تكنولوج') || s.includes('ict') || s.includes('information technology') || s.includes('informatique')) return 'ict';
  if (s.includes('دين') || s.includes('islamic') || s.includes('religion')) return 'islamic';
  if (s.includes('خط') || s.includes('calligraphy')) return 'calligraphy';

  return '';
}

/**
 * True when a subject label refers to the same subject as a lesson, using the
 * lesson's id and its three localized names. An exact name match still counts,
 * so no comparison that worked before stops working.
 */
export function subjectLabelMatchesLesson(
  label: string,
  lesson: { subjectId: string; subjectNameAr: string; subjectNameEn: string; subjectNameFr?: string }
): boolean {
  const lower = (label || '').trim().toLowerCase();
  if (!lower) return false;
  if (
    lower === lesson.subjectId.toLowerCase() ||
    lower === lesson.subjectNameAr.toLowerCase() ||
    lower === lesson.subjectNameEn.toLowerCase() ||
    lower === (lesson.subjectNameFr || '').toLowerCase()
  ) {
    return true;
  }
  const want = canonicalSubjectId(label);
  if (!want) return false;
  return [lesson.subjectId, lesson.subjectNameAr, lesson.subjectNameEn, lesson.subjectNameFr]
    .some((n) => canonicalSubjectId(n || '') === want);
}
