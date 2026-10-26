/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Which Gemini prebuilt voice speaks as Miss Noor.
 *
 * Miss Noor is a woman, so every language must use a voice whose official
 * gender is female. The Arabic route previously asked for "Puck", which Google
 * documents as Male (see the Cloud TTS Chirp3-HD voice table), so the child
 * heard a man. The value is centralised here so a single test can guard it.
 *
 * The Gemini TTS model detects the input language automatically; the voice name
 * selects the timbre, not the language. Using one female voice everywhere keeps
 * Miss Noor recognisable across Arabic, French and English.
 */

/** Google-documented female prebuilt voices (Cloud TTS Chirp3-HD voice table). */
export const FEMALE_PREBUILT_VOICES = [
  'Achernar',
  'Aoede',
  'Autonoe',
  'Callirrhoe',
  'Despina',
  'Erinome',
  'Gacrux',
  'Kore',
  'Laomedeia',
  'Leda',
  'Pulcherrima',
  'Sulafat',
  'Vindemiatrix',
  'Zephyr',
] as const;

/** Google-documented male prebuilt voices — never use one for Miss Noor. */
export const MALE_PREBUILT_VOICES = [
  'Achird',
  'Algenib',
  'Algieba',
  'Alnilam',
  'Charon',
  'Enceladus',
  'Fenrir',
  'Iapetus',
  'Orus',
  'Puck',
  'Rasalgethi',
  'Sadachbia',
  'Sadaltager',
  'Schedar',
  'Umbriel',
  'Zubenelgenubi',
] as const;

/**
 * The single voice Miss Noor speaks with in every language. Kore is female,
 * already proven in this app for French and English, and supported by the
 * Gemini Flash-Lite TTS model.
 */
export const MISS_NOOR_VOICE = 'Kore';

export type TutorLanguage = 'ar' | 'fr' | 'en';

/**
 * Resolve the voice name for a language. Kept as a function (rather than a
 * bare constant read) so the server call site stays a single source of truth
 * and future per-language overrides have one place to live.
 */
export function tutorVoiceFor(_language: TutorLanguage): string {
  return MISS_NOOR_VOICE;
}

/** True when the given voice is documented as female. */
export function isFemaleVoice(voiceName: string): boolean {
  return (FEMALE_PREBUILT_VOICES as readonly string[]).includes(voiceName);
}
