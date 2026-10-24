/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Gender-aware Egyptian-Arabic tutor voice for the server prompts.
 *
 * The server used to hardcode feminine agreement and the name "أمينة"
 * ("يا حبيبتي يا أمينة", "تعالي", "بصي"). Every one of those strings is now
 * derived from the student's `addressForm`, which the client sends with each
 * AI request. Nothing here invents a name: when the client does not send one,
 * a neutral default is used instead of a fake child.
 *
 * This module is deliberately dependency-free and side-effect-free so it can
 * be imported by `server.ts` and by the test suite alike.
 */

export type AddressFormInput = 'f' | 'm' | undefined | null;

export interface TutorArabicVoice {
  /** Affectionate address: "يا حبيبتي" / "يا حبيبي". */
  address: string;
  /** Praise word: "يا بطلة" / "يا بطل". */
  champion: string;
  /** Standalone pronoun: "إنتي" / "إنت". */
  pronoun: string;
  /** Possessive suffix for a noun stem: "كِ" / "كَ". */
  yourSuffix: string;
  /** Imperatives and 2nd-person verbs used by the copy. */
  look: string; // "بصي" / "بص"
  lookAt: string; // "شوفي" / "شوف"
  comeOn: string; // "تعالي" / "تعال"
  imagine: string; // "تخيلي" / "تخيل"
  focus: string; // "ركزي" / "ركّز"
  tellMe: string; // "قولي لي" / "قول لي"
  youAre: string; // "إنتي" (verb copula omitted in Arabic)
  listenToYou: string; // "سامعاكي" / "سامعك"
  youAsk: string; // "بتسألي" / "بتسأل"
  youWant: string; // "عايزة" / "عايز"
  ready: string; // "جاهزة" / "جاهز"
}

const FEMININE: TutorArabicVoice = {
  address: 'يا حبيبتي',
  champion: 'يا بطلة',
  pronoun: 'إنتي',
  yourSuffix: 'كِ',
  look: 'بصي',
  lookAt: 'شوفي',
  comeOn: 'تعالي',
  imagine: 'تخيلي',
  focus: 'ركزي',
  tellMe: 'قولي لي',
  youAre: 'إنتي',
  listenToYou: 'سامعاكي',
  youAsk: 'بتسألي',
  youWant: 'عايزة',
  ready: 'جاهزة',
};

const MASCULINE: TutorArabicVoice = {
  address: 'يا حبيبي',
  champion: 'يا بطل',
  pronoun: 'إنت',
  yourSuffix: 'كَ',
  look: 'بص',
  lookAt: 'شوف',
  comeOn: 'تعال',
  imagine: 'تخيل',
  focus: 'ركّز',
  tellMe: 'قول لي',
  youAre: 'إنت',
  listenToYou: 'سامعك',
  youAsk: 'بتسأل',
  youWant: 'عايز',
  ready: 'جاهز',
};

/** Defaults to feminine, matching the product's original copy and first user. */
export function tutorArabicVoice(addressForm: AddressFormInput): TutorArabicVoice {
  return addressForm === 'm' ? MASCULINE : FEMININE;
}

/**
 * Returns the student's name, or a neutral placeholder when the client did not
 * supply one. Never returns the old hardcoded "أمينة".
 */
export function resolveStudentName(studentName: unknown, language: string): string {
  const name = typeof studentName === 'string' ? studentName.trim() : '';
  if (name) return name;
  if (language === 'ar') return 'صديقي';
  return 'friend';
}

/**
 * A single prompt line that tells the model which agreement to use, so the
 * generated text stays consistent with the child's chosen form.
 */
export function genderRuleLine(addressForm: AddressFormInput, language: string): string {
  if (language !== 'ar') return '';
  const v = tutorArabicVoice(addressForm);
  return `The student is addressed as ${addressForm === 'm' ? 'masculine (مذكر)' : 'feminine (مؤنث)'}. Use matching Arabic agreement: "${v.address}", "${v.comeOn}", "${v.look}", "${v.tellMe}", "${v.champion}", and the possessive suffix "${v.yourSuffix}".`;
}

/** Prompt-safe spelling of the address form for the English/French examples. */
export function addressFormWord(addressForm: AddressFormInput): 'masculine' | 'feminine' {
  return addressForm === 'm' ? 'masculine' : 'feminine';
}
