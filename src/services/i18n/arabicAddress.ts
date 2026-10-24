/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Arabic address-form grammar.
 *
 * Egyptian Arabic (and Modern Standard Arabic) inflect verbs, pronouns and
 * possessive suffixes by the gender of the person addressed. Onboarding asks
 * the child (or parent) "Noor calls you…" boy/girl and stores the answer as
 * `Student.addressForm`. Every generated Arabic sentence that speaks TO the
 * student then picks its forms from here instead of hardcoding the feminine.
 */

import type { AddressForm } from '../../types';

export interface ArabicAddressForms {
  /** "you (m/f)" as a standalone pronoun. */
  you: string;
  /** Imperative/2nd-person verb prefix, e.g. ت/ي attached forms. */
  verbYou: string;
  /** "your" possessive suffix attached to a noun. */
  yourSuffix: string;
  /** Adjective agreement suffix, e.g. "متميز/متميزة". */
  adjectiveSuffix: string;
  /** Friendly address word: "يا بطل" / "يا بطلة". */
  champion: string;
  /** "well done" agreement: "أحسنت" / "أحسنتِ". */
  wellDone: string;
  /** "smart one": "شاطر" / "شاطرة". */
  smart: string;
  /** "ready?": "جاهز" / "جاهزة". */
  ready: string;
  /** "brave": "شجاع" / "شجاعة". */
  brave: string;
}

const FEMININE: ArabicAddressForms = {
  you: 'أنتِ',
  verbYou: 'ت',
  yourSuffix: 'كِ',
  adjectiveSuffix: 'ة',
  champion: 'يا بطلة',
  wellDone: 'أحسنتِ',
  smart: 'شاطرة',
  ready: 'جاهزة',
  brave: 'شجاعة',
};

const MASCULINE: ArabicAddressForms = {
  you: 'أنت',
  verbYou: '',
  yourSuffix: 'كَ',
  adjectiveSuffix: '',
  champion: 'يا بطل',
  wellDone: 'أحسنت',
  smart: 'شاطر',
  ready: 'جاهز',
  brave: 'شجاع',
};

/**
 * Returns Arabic agreement forms for the student's address form.
 * Defaults to feminine: existing students have no `addressForm`, and the
 * product's first user (and the original copy) was feminine.
 */
export function getArabicForms(addressForm?: AddressForm): ArabicAddressForms {
  return addressForm === 'm' ? MASCULINE : FEMININE;
}

/** "أحسنت" / "أحسنتِ" */
export function wellDone(addressForm?: AddressForm): string {
  return getArabicForms(addressForm).wellDone;
}

/**
 * Appends the correct 2nd-person possessive suffix to an Arabic noun stem.
 * e.g. withPossessive('اسم', 'f') -> 'اسمكِ'
 */
export function withPossessive(nounStem: string, addressForm?: AddressForm): string {
  return nounStem + getArabicForms(addressForm).yourSuffix;
}

/**
 * Chooses between a feminine and masculine variant of any phrase. Lets copy
 * authors write both forms inline without duplicating whole sentences.
 */
export function pickByAddress<T>(addressForm: AddressForm | undefined, feminine: T, masculine: T): T {
  return addressForm === 'm' ? masculine : feminine;
}
