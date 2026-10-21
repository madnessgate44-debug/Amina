/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Canonical subject identity for the whole app.
 *
 * The "one School Brain" rule requires that every engine (planner, homework,
 * review, day-record reconciliation, UI) resolves a subject *name* to the same
 * authoritative subject *ID* used by the curriculum data. Before this module
 * each engine had its own copy of the mapping and they disagreed:
 *   - Social Studies: "الدراسات الاجتماعية" -> `subj_social` (0 lessons) while
 *     the curriculum stores it as `subj_social_studies` (3 lessons).
 *   - ICT: "تكنولوجيا المعلومات والاتصالات" contains the substring "علوم" so it
 *     was matched as Science before ICT was ever tested.
 *   - Calligraphy: "الخط العربي" contains "عرب" so it was matched as Arabic.
 *
 * `normalizeSubjectId` is now the single source of truth. Keep it dependency
 * free so both `src/data` and `src/services` can import it without cycles.
 */

/**
 * Returns the canonical curriculum subject ID for a free-text subject label,
 * or an empty string when nothing authoritative matches.
 */
export function normalizeSubjectId(subName?: string): string {
  if (!subName) return '';
  const s = subName.trim().toLowerCase();

  // Math is the Egyptian national curriculum taught in French.
  // French wording must never create a second subject identity.
  if (
    (s.includes('math') && (s.includes('fr') || s.includes('فرنس'))) ||
    s.includes('mathématiques') ||
    s.includes('الرياضيات بالفرنسية')
  ) {
    return 'subj_math';
  }

  // Science is the Egyptian national curriculum taught in French.
  if (
    (s.includes('sci') && (s.includes('fr') || s.includes('فرنس'))) ||
    s.includes('sciences fr') ||
    s.includes('العلوم بالفرنسية')
  ) {
    return 'subj_science';
  }

  // Most specific subjects first. Calligraphy and ICT must be tested before the
  // generic Arabic / Science substring checks that would otherwise swallow them.
  if (s.includes('خط') || s.includes('calligraph') || s.includes('خط العربي')) return 'subj_calligraphy';
  if (s.includes('تكنولوج') || s.includes('ict') || s.includes('information technology')) return 'subj_ict';

  // Social Studies is stored as `subj_social_studies` in the curriculum data.
  if (s.includes('دراس') || s.includes('social') || s.includes('études sociales') || s.includes('etudes sociales')) {
    return 'subj_social_studies';
  }

  if (s.includes('دين') || s.includes('islamic') || s.includes('religion') || s.includes('إسلامي')) return 'subj_islamic';

  // French Language before generic Arabic/French substring checks.
  if (s.includes('فرنساوي') || s.includes('فرنسي') || s.includes('french') || s.includes('français') || s.includes('francais')) {
    return 'subj_french';
  }

  if (s.includes('عرب') || s.includes('لغة عربية') || s.includes('arabic')) return 'subj_arabic';
  if (s.includes('إنجليز') || s.includes('انجليز') || s.includes('english')) return 'subj_english';
  if (s.includes('رياض') || s.includes('حساب') || s.includes('math')) return 'subj_math';
  if (s.includes('علوم') || s.includes('ساينس') || s.includes('science')) return 'subj_science';

  return '';
}

/**
 * Canonical child-facing display name for a subject ID.
 */
export function getSubjectDisplayName(subjId: string, language: string = 'ar'): string {
  const isAr = language === 'ar';
  const isFr = language === 'fr';

  switch (subjId) {
    case 'subj_french':
      return isAr ? 'اللغة الفرنسية' : isFr ? 'Français' : 'French Language';
    case 'subj_arabic':
      return isAr ? 'اللغة العربية' : isFr ? 'Langue Arabe' : 'Arabic Language';
    case 'subj_math':
    case 'subj_math_fr':
      return isAr ? 'الرياضيات' : isFr ? 'Maths' : 'Mathematics';
    case 'subj_science':
    case 'subj_science_fr':
      return isAr ? 'العلوم' : isFr ? 'Sciences' : 'Science';
    case 'subj_social_studies':
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
