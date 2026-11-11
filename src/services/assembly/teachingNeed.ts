/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Understanding an ask.
 *
 * Step one of the assembly engine: turn a raw ask ("Amina asks a question or
 * pastes text") into a `TeachingNeed` — what she is after, in which language,
 * about which topic, and which real curriculum concept it maps to. When no
 * textbook selection matches, the need is still returned, flagged with
 * `needsCurriculumSelection`, so the experience can be built anyway and the UI
 * can offer a lesson list. Understanding never blocks assembly.
 */

import { Language } from '../../types';
import { TeachingNeed, AskIntent, AskChannel } from '../../types/assembly';
import { curriculumService } from '../curriculum/curriculumService';
import { normalizeText } from '../teaching/teachingSession';

/** Arabic, French and English question words / request cues. */
const QUESTION_CUES = [
  'ايه', 'إيه', 'ايه يعني', 'ليه', 'لماذا', 'كيف', 'ازاي', 'إزاي', 'هل', 'ماذا', 'ما هو', 'ما هي',
  'وضح', 'وضحي', 'اشرح', 'اشرحي', 'فسر', 'فسري',
  'what', 'why', 'how', 'when', 'where', 'explain', 'tell me', 'help me',
  'pourquoi', 'comment', 'explique', 'quand', 'quest-ce',
];

/** Words that ask for a full lesson rather than a one-line answer. */
const LESSON_CUES = [
  'درس', 'احفظ', 'أذاكر', 'ذاكر', 'شرح كامل', 'منهج', 'unit', 'lesson', 'chapter',
  'lecon', 'chapitre', 'full lesson', 'teach me', 'ادرسني',
];

function hasAny(hay: string, needles: string[]): boolean {
  const n = ` ${normalizeText(hay)} `;
  return needles.some((x) => n.includes(` ${normalizeText(x)} `) || n.includes(normalizeText(x)));
}

/**
 * Which script the ask is written in, by dominant character count. Some
 * children mix Arabic and French; this picks the language they read in.
 */
export function detectLanguage(text: string): Language {
  const ar = (text.match(/[\u0600-\u06FF]/g) || []).length;
  const latin = (text.match(/[A-Za-zÀ-ÿ]/g) || []).length;
  if (ar > 0 && ar >= latin) return 'ar';
  if (latin > 0 && latin > ar) {
    // A French-only accented letter is decisive: English does not use them.
    if (/[éèêëàâôûùçîïœ]/.test(text)) return 'fr';
    // Otherwise a short, deliberate French/English cue decides between the two.
    const n = ` ${normalizeText(text)} `;
    const fr = ['pourquoi', 'comment', 'salut', 'bonjour', 'merci', 'lecon', 'cest', 'quest', 'explique', 'expliquer', 'avec', 'dans', 'pour'];
    if (fr.some((w) => n.includes(` ${w} `) || n.includes(`${w} `))) return 'fr';
    return 'en';
  }
  return 'ar';
}

/** The content words of an ask, normalised and de-stopped. */
export function topicTokensOf(text: string): string[] {
  const stop = new Set(
    [
      'ايه', 'إيه', 'يعني', 'ليه', 'لماذا', 'كيف', 'ازاي', 'إزاي', 'هل', 'ماذا', 'هو', 'هي',
      'وضح', 'وضحي', 'اشرح', 'اشرحي', 'من', 'في', 'على', 'عن', 'الى', 'مع', 'يا', 'مس',
      'يعمل', 'تعمل', 'يشتغل', 'تشتغل', 'معنى', 'تعريف', 'يعني', 'ايه', 'ازاى',
      'what', 'why', 'how', 'is', 'are', 'the', 'and', 'explain', 'tell', 'me', 'about', 'a', 'an',
      'pourquoi', 'comment', 'explique', 'est', 'que', 'qui', 'le', 'la', 'les', 'un', 'une', 'de',
    ].map(normalizeText)
  );
  return normalizeText(text)
    .split(' ')
    .filter((w) => w.length > 2 && !stop.has(w))
    .map((w) => w.replace(/^ال/, ''));
}

/** Classify what the child is after from the wording. */
export function classifyIntent(text: string): AskIntent {
  if (hasAny(text, LESSON_CUES)) return 'lesson_request';
  if (hasAny(text, QUESTION_CUES)) return 'quick_question';
  // A longer paste with no question cue reads as exploring a topic.
  if (normalizeText(text).split(' ').length > 18) return 'topic_exploration';
  return 'quick_question';
}

/**
 * Find the curriculum concept an ask is about, by token overlap against the
 * concept titles and key points. Returns the best match above a floor, or null.
 */
export function matchConcept(
  text: string,
  language?: Language
): {
  lessonId: string;
  conceptId: string;
  subjectId: string;
  titleAr: string;
  titleEn: string;
  confidence: number;
} | null {
  const ask = new Set(topicTokensOf(text));
  if (ask.size === 0) return null;
  const askLang = language || detectLanguage(text);

  let best: ReturnType<typeof matchConcept> = null;
  for (const lesson of curriculumService.getAllLessons()) {
    for (const concept of lesson.concepts) {
      const hay = new Set([
        ...topicTokensOf(concept.titleAr),
        ...topicTokensOf(concept.titleEn),
        ...topicTokensOf(concept.sourceText),
        ...concept.keyPoints.flatMap((k) => topicTokensOf(k)),
      ]);
      if (hay.size === 0) continue;
      let overlap = 0;
      for (const t of ask) if (hay.has(t)) overlap += 1;
      // Weight the title much more than the body, so "photosynthesis" wins over
      // a concept that merely mentions the word once.
      const titleHit = topicTokensOf(`${concept.titleAr} ${concept.titleEn}`).some((t) => ask.has(t));
      // A concept matches only when the ask and the concept genuinely share
      // material. Two content words is decisive. A single shared word is only
      // accepted when it is a title word AND the ask is essentially that word
      // (so a one-word topic like "الإنترنت" matches, but "why does ice float
      // on water" does not borrow a lesson that merely says "water").
      const decisive = overlap >= 2;
      const singleTitleMatch = titleHit && overlap >= 1 && overlap / ask.size >= 0.5;
      if (!decisive && !singleTitleMatch) continue;
      // Confidence saturates on the number of shared content words (four is
      // already a strong match), so a long paste is not penalised just for
      // being long. A title hit is worth more than a body-only overlap.
      let confidence = Math.min(1, overlap / 4) * (titleHit ? 1 : 0.8);
      // A French lesson must not answer an Arabic or English ask (and vice
      // versa): a matching-language lesson wins, a mismatched one is demoted.
      const lessonLang = lesson.language || 'ar';
      if (askLang === 'fr') {
        if (lessonLang !== 'fr') confidence *= 0.5;
      } else if (lessonLang === 'fr') {
        confidence *= 0.5;
      }
      if (confidence > 0.2 && (!best || confidence > best.confidence)) {
        best = {
          lessonId: lesson.id,
          conceptId: concept.id,
          subjectId: lesson.subjectId,
          titleAr: concept.titleAr,
          titleEn: concept.titleEn,
          confidence: Number(confidence.toFixed(3)),
        };
      }
    }
  }
  return best;
}

/**
 * Turn a raw ask into a `TeachingNeed`. Pure and synchronous: it reads the
 * curriculum index only, never calls a model.
 */
export function understandAsk(
  rawAsk: string,
  opts: { channel?: AskChannel; language?: Language } = {}
): TeachingNeed {
  const raw = (rawAsk || '').trim();
  const language = opts.language || detectLanguage(raw);
  const intent = classifyIntent(raw);
  const match = matchConcept(raw, language);
  const needsCurriculumSelection = !match;

  const matchReason = match
    ? `Matched concept ${match.conceptId} (${match.titleAr} / ${match.titleEn}) with confidence ${match.confidence} from token overlap.`
    : 'No curriculum concept matched the ask; experience will be built generically and the child should be offered a lesson selection.';

  return {
    rawAsk: raw,
    channel: opts.channel || 'typed',
    language,
    intent,
    topicTokens: topicTokensOf(raw),
    matched: match,
    needsCurriculumSelection,
    matchReason,
  };
}
