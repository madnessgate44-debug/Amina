/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * One language guard for every piece of text the child is shown.
 *
 * The reel generator, the diagnosis path and the feed's diagnosis pool all need
 * the same answer to "can this child read this text?". They used to answer it
 * with different checks, so a French-only diagnosis could still be pasted into
 * an English reply (both are Latin) and an Arabic diagnosis could be served to a
 * French child whenever it carried a Latin parenthetical like "(Byte)": the old
 * check asked only whether a Latin letter appeared ANYWHERE, not which script
 * dominated. This module is the single source of truth, so the call sites cannot
 * drift apart again.
 */

import type { Language } from '../../types';

/** Which script dominates `text`: Arabic, Latin, or neither. */
export function scriptOf(text: string): 'ar' | 'latin' | 'other' {
  const ar = (text.match(/[\u0600-\u06FF]/g) || []).length;
  const latin = (text.match(/[A-Za-zÀ-ÿ]/g) || []).length;
  if (ar > latin) return 'ar';
  if (latin > ar) return 'latin';
  return 'other';
}

/** The script the child reads in: Arabic for ar, Latin for en/fr. */
export function wantedScript(lang: Language): 'ar' | 'latin' {
  return lang === 'ar' ? 'ar' : 'latin';
}

/**
 * Function words that identify the natural language of Latin-script text.
 *
 * Script alone cannot tell English from French, and a French child was shown
 * whole English sentences ("Helping a classmate understand a difficult
 * concept") because the script guard only rejected Arabic. Only unambiguous
 * markers are listed: words shared by both languages ("a", "on", "or", "en")
 * are in neither set, so they never tip the verdict.
 */
const ENGLISH_MARKERS = new Set([
  'the','and','with','for','from','your','you','are','of','to','in','this','that','like','each','is','was',
  'were','will','has','have','can','how','what','which','its','their','they','them','we','our','us','as',
  'but','if','when','where','who','all','some','more','most','other','into','over','after','before',
  'because','through','between','during','about','than','then','there','these','those','him','her','she',
  'he','his','not','be','by','at','it','an','so','up','out','down','off','again','once','here','why','both',
  'few','many','much','such','no','nor','too','very','just','only','own','same',
]);
const FRENCH_MARKERS = new Set([
  'le','la','les','de','des','une','un','est','pour','dans','avec','que','qui','sur','pas','comme','ton','ta',
  'tes','ce','cette','ces','nous','vous','au','aux','du','se','son','sa','ses','et','sont','par','mais','tout',
  'tous','toute','bien','être','ont','il','elle','ils','elles','qu','quand','dont','entre','vers','chez','sans',
  'sous','aussi','encore','très','peu','beaucoup','toujours','jamais','leur','leurs','notre','nos','votre','vos',
  'mon','ma','mes','moi','toi','lui','été','avait','avoir','faire','fait','moins','donc','car','ni','était',
  'étaient','sera','serait','celui','celle','alors','ainsi','autre','autres','même',
]);

/**
 * The natural language of Latin-script text, or 'other' when it carries no
 * decisive marker. Deliberately conservative: numbers, symbols and short proper
 * nouns (which are the same in both languages) stay 'other' and are never
 * dropped.
 */
export function latinLanguage(text: string): 'en' | 'fr' | 'other' {
  const words = text.toLowerCase().split(/[^a-zà-ÿ']+/).filter((w) => w.length > 1);
  if (words.length === 0) return 'other';
  let en = 0;
  let fr = 0;
  for (const w of words) {
    if (ENGLISH_MARKERS.has(w)) en++;
    if (FRENCH_MARKERS.has(w)) fr++;
  }
  if (en === fr) return 'other';
  return en > fr ? 'en' : 'fr';
}

/**
 * True when `text` is written in the language the child reads.
 *
 * The script must DOMINATE, not merely be present: a stored Arabic diagnosis
 * often ends with a Latin parenthetical ("أصغر وحدة هي البت (bit)"), and an
 * older presence-only check served that whole Arabic sentence to a French or
 * English child. For Latin text the language must also be decisive, so a
 * French-only diagnosis is never pasted into an English reply (both are Latin,
 * so script alone cannot tell them apart).
 */
export function speaksLanguage(text: string, language: Language): boolean {
  const ar = (text.match(/[\u0600-\u06FF]/g) || []).length;
  const latin = (text.match(/[A-Za-zÀ-ÿ]/g) || []).length;
  if (language === 'ar') return ar > 0 && ar >= latin;
  if (latin === 0 || latin < ar) return false;
  const actual = latinLanguage(text);
  return actual === 'other' || actual === language;
}

/**
 * True when a piece of teaching text can be read by the child.
 *
 * Lesson vocabulary and source text are stored in ONE language, so a reel built
 * from them can end up showing a sentence the child cannot read: an Arabic child
 * read "Processus par lequel les plantes vertes…" and a French child read an
 * Arabic definition. A reel in the wrong script is worse than no reel, so the
 * generator drops it. Text with no letters at all (numbers, symbols) is
 * language-neutral and always allowed.
 */
export function readableByChild(text: string, lang: Language): boolean {
  const s = scriptOf(text);
  if (s === 'other') return true;
  if (s !== wantedScript(lang)) return false;
  if (s === 'latin' && (lang === 'en' || lang === 'fr')) {
    const actual = latinLanguage(text);
    if (actual !== 'other' && actual !== lang) return false;
  }
  return true;
}
