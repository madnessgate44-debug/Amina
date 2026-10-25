/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Choosing which installed speech voice reads the tutor's lines.
 *
 * This is the part that decides whether a child actually hears anything. The
 * old code took the first voice whose language merely *started* with the target
 * prefix, and if the device had no such voice it still called speak() — so an
 * Arabic sentence was read by an English voice, which sounds like noise. On a
 * device with no Arabic voice at all, the caller now needs to know that, so the
 * app can say so instead of failing silently.
 *
 * Kept free of the DOM so it can be unit tested with plain objects.
 */

export interface VoiceLike {
  lang: string;
  name: string;
  localService?: boolean;
  default?: boolean;
}

/** BCP-47 prefix used to match a voice to an app language. */
const LANG_PREFIX: Record<string, string> = { ar: 'ar', fr: 'fr', en: 'en' };

/**
 * Regional variants in descending preference. Egyptian Arabic first because the
 * learner is in Alexandria; a generic `ar` voice is still far better than none.
 */
const PREFERRED_REGIONS: Record<string, string[]> = {
  ar: ['ar-eg', 'ar-sa', 'ar-ae', 'ar'],
  fr: ['fr-fr', 'fr-ca', 'fr'],
  en: ['en-us', 'en-gb', 'en'],
};

/** Name fragments that tend to mark a higher-quality neural/cloud voice. */
const QUALITY_HINTS = [
  'natural',
  'neural',
  'google',
  'online',
  'samantha',
  'thomas',
  'amelie',
  'amélie',
  'hoda',
  'salma',
  'zariyah',
  'laila',
];

function prefixFor(language: string): string {
  return LANG_PREFIX[language] || language;
}

function candidatesFor(voices: VoiceLike[], language: string): VoiceLike[] {
  const prefix = prefixFor(language).toLowerCase();
  return (voices || []).filter((v) => typeof v?.lang === 'string' && v.lang.toLowerCase().startsWith(prefix));
}

/**
 * True when the device has at least one voice for this language. When false the
 * caller must not attempt to read the text: it would come out in the wrong
 * language.
 */
export function hasVoiceForLanguage(voices: VoiceLike[], language: string): boolean {
  return candidatesFor(voices, language).length > 0;
}

/**
 * Best available voice for a language, or undefined when the device has none.
 *
 * Ordering: a preferred regional variant wins, then a quality-hinted name, then
 * a local voice (works offline), then the browser default, then anything.
 */
export function pickBestVoice(voices: VoiceLike[], language: string): VoiceLike | undefined {
  const candidates = candidatesFor(voices, language);
  if (candidates.length === 0) return undefined;

  const regions = PREFERRED_REGIONS[language] || [prefixFor(language).toLowerCase()];

  const regionRank = (v: VoiceLike): number => {
    const lang = v.lang.toLowerCase();
    const idx = regions.findIndex((r) => lang === r || lang.startsWith(r));
    return idx === -1 ? regions.length : idx;
  };

  const qualityRank = (v: VoiceLike): number => {
    const name = (v.name || '').toLowerCase();
    const idx = QUALITY_HINTS.findIndex((h) => name.includes(h));
    return idx === -1 ? QUALITY_HINTS.length : idx;
  };

  return candidates.slice().sort((a, b) => {
    const region = regionRank(a) - regionRank(b);
    if (region !== 0) return region;
    const quality = qualityRank(a) - qualityRank(b);
    if (quality !== 0) return quality;
    const local = Number(b.localService === true) - Number(a.localService === true);
    if (local !== 0) return local;
    const isDefault = Number(b.default === true) - Number(a.default === true);
    if (isDefault !== 0) return isDefault;
    return (a.name || '').localeCompare(b.name || '');
  })[0];
}
