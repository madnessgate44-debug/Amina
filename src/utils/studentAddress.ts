/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Language } from '../types';

/**
 * Neutral form of address used only when no real student name is available.
 * These are generic vocatives, not a fabricated student identity: the app must
 * never invent a name (e.g. "أمينة") and present it as the logged-in student.
 */
const NEUTRAL_ADDRESS: Record<Language, string> = {
  ar: 'صديقتي',
  fr: 'mon amie',
  en: 'friend',
};

/**
 * Resolves the name to use in teacher copy.
 * Returns the real student name when present, otherwise a neutral address term
 * in the requested language so no identity is fabricated.
 */
export function resolveStudentName(
  name: string | null | undefined,
  language: Language = 'ar'
): string {
  const trimmed = (name || '').trim();
  if (trimmed) return trimmed;
  return NEUTRAL_ADDRESS[language] || NEUTRAL_ADDRESS.en;
}
