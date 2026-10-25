/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Replaces the legacy learner name baked into the older stage scripts.
 *
 * The beat scripts were written when the app called the child "أمينة"/"Amina".
 * The audio path already swapped the name in, but the on-screen text did not, so
 * a child named e.g. "Sara" heard "يا سارة" while reading "يا أمينة". One helper
 * now serves both paths.
 */

const LEGACY_NAME_PATTERNS = [/أمينة/g, /Amina/g];

export function personalizeNoorText(text: string, studentName?: string | null): string {
  if (!text) return text;
  const name = (studentName || '').trim();
  if (!name) return text.replace(LEGACY_NAME_PATTERNS[0], 'صديقي').replace(LEGACY_NAME_PATTERNS[1], 'friend');

  return text.replace(LEGACY_NAME_PATTERNS[0], name).replace(LEGACY_NAME_PATTERNS[1], name);
}
