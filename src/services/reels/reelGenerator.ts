/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Deterministic reel generator.
 *
 * buildReelsForConcept() turns ONE real curriculum lesson concept into a small
 * ordered list of reels. It never invents content:
 *  - hook / show / reaction lines come from the concept's own fields
 *    (dailyLifeExample, storyAnalogy, sourceText, keyPoints);
 *  - questions come from the lesson's own `exercises`;
 *  - a kind is SKIPPED when the lesson lacks the field it needs.
 *
 * There is no runtime LLM dependency. Given the same lesson and language the
 * output is byte-identical, which is what the test suite asserts.
 */

import {
  OfficialCurriculumLesson,
  CurriculumLessonConcept,
  CurriculumExercise,
} from '../../types/teachingSession';
import { Language } from '../../types';
import { Reel, ReelKind, ReelOption, ReelReason } from '../../types/reel';
import { createSeededRng } from './seededRng';

const KIND_ORDER: ReelKind[] = [
  'hook_question',
  'story_analogy',
  'vocab_flash',
  'spot_the_mistake',
  'quick_choice',
  'teach_card',
];

interface LangText {
  ar: string;
  en: string;
  fr: string;
}

function pickLang(text: LangText | undefined, lang: Language): string {
  if (!text) return '';
  if (lang === 'ar') return text.ar || text.en || text.fr;
  if (lang === 'fr') return text.fr || text.en || text.ar;
  return text.en || text.ar || text.fr;
}

function nonEmpty(...vals: Array<string | undefined | null>): string {
  for (const v of vals) {
    if (v && String(v).trim()) return String(v).trim();
  }
  return '';
}

function subjectName(lesson: OfficialCurriculumLesson, lang: Language): string {
  if (lang === 'ar') return lesson.subjectNameAr;
  if (lang === 'fr') return lesson.subjectNameFr || lesson.subjectNameEn;
  return lesson.subjectNameEn;
}

function lessonTitle(lesson: OfficialCurriculumLesson, lang: Language): string {
  if (lang === 'ar') return lesson.titleAr;
  if (lang === 'fr') return lesson.titleFr || lesson.titleEn;
  return lesson.titleEn;
}

function conceptTitle(concept: CurriculumLessonConcept, lang: Language): string {
  if (lang === 'ar') return concept.titleAr;
  if (lang === 'fr') return concept.titleEn;
  return concept.titleEn;
}

/** "Science Ministry Book pp. 10-18" or "Science book p. 10". */
export function sourceLabelFor(lesson: OfficialCurriculumLesson): string {
  const ref = lesson.sourceRef;
  const book = nonEmpty(ref?.bookEn, ref?.book);
  const page = ref?.page;
  if (page !== undefined && page !== null && String(page).trim()) {
    return `${book} p. ${page}`;
  }
  return book;
}

/** Lines Noor uses for praise / correction, in the reel's language. */
function praise(lang: Language): string {
  if (lang === 'ar') return 'برافو! إجابة صح 👏';
  if (lang === 'fr') return 'Bravo, c’est juste ! 👏';
  return 'Yes! That’s right 👏';
}

function gentlyWrong(lang: Language): string {
  if (lang === 'ar') return 'قربت أوي! خليني أوضحلك الفكرة في سطر واحد.';
  if (lang === 'fr') return 'Tu y es presque ! Je t’explique en une phrase.';
  return 'Almost! Let me explain it in one line.';
}

/** Resolves an exercise to a tap-one-answer option set, or null when unfair. */
export function exerciseToOptions(exercise: CurriculumExercise): ReelOption[] | null {
  const options = exercise.options;
  if (!options || options.length < 2) return null;
  if (exercise.expectedAnswer === undefined || exercise.expectedAnswer === null) return null;
  const expected = String(exercise.expectedAnswer).trim();
  const matches = options.filter((o) => String(o).trim() === expected);
  if (matches.length !== 1) return null;
  return options.map((o) => ({ text: String(o), isCorrect: String(o).trim() === expected }));
}

/** Deterministic id so tests and React keys are stable. */
function reelId(lessonId: string, conceptId: string, kind: ReelKind, index: number): string {
  return `${lessonId}__${conceptId}__${kind}__${index}`;
}

/**
 * Builds the ordered reels for one concept.
 * `seedExtra` lets the queue builder produce a retry variant deterministically.
 */
export function buildReelsForConcept(
  lesson: OfficialCurriculumLesson,
  concept: CurriculumLessonConcept,
  lang: Language,
  opts: { reason?: ReelReason; seedExtra?: string } = {}
): Reel[] {
  const reels: Reel[] = [];
  const rng = createSeededRng(`${lesson.id}|${concept.id}|${lang}|${opts.seedExtra || ''}`);
  const base = {
    conceptId: concept.id,
    lessonId: lesson.id,
    subjectId: lesson.subjectId,
    subjectName: subjectName(lesson, lang),
    lessonTitle: lessonTitle(lesson, lang),
    sourceLabel: sourceLabelFor(lesson),
    originTag: lesson.originTag,
    language: lang,
    reason: opts.reason,
    // Carried through so the reel's visual honours the type the curriculum
    // declares for this concept instead of always defaulting to a diagram.
    visualType: concept.visualType,
  } as const;

  const hookLine = nonEmpty(
    pickLang({ ar: concept.dailyLifeExampleAr, en: concept.dailyLifeExampleEn, fr: concept.dailyLifeExampleEn }, lang),
    conceptTitle(concept, lang)
  );
  const analogy = pickLang({ ar: concept.storyAnalogyAr, en: concept.storyAnalogyEn, fr: concept.storyAnalogyEn }, lang);
  const sourceText = nonEmpty(concept.sourceText);
  const keyPoint = concept.keyPoints && concept.keyPoints.length ? concept.keyPoints[0] : '';

  // Collect question-capable exercises once, in curriculum order.
  const usableExercises = lesson.exercises
    .map((ex) => ({ ex, options: exerciseToOptions(ex) }))
    .filter((x): x is { ex: CurriculumExercise; options: ReelOption[] } => x.options !== null);

  const vocab = lesson.vocabulary && lesson.vocabulary.length ? lesson.vocabulary[0] : null;

  let idx = 0;
  const push = (kind: ReelKind, partial: Partial<Reel> & Pick<Reel, 'hook' | 'show' | 'noorLine'>) => {
    reels.push({
      id: reelId(lesson.id, concept.id, kind, idx++),
      kind,
      ...base,
      ...partial,
    } as Reel);
  };

  for (const kind of KIND_ORDER) {
    switch (kind) {
      case 'hook_question': {
        if (!hookLine) break;
        const ex = usableExercises[0];
        push('hook_question', {
          hook: hookLine,
          show: conceptTitle(concept, lang),
          noorLine: lang === 'ar'
            ? `تعالي نبدأ بحاجة صغيرة عن «${conceptTitle(concept, lang)}».`
            : lang === 'fr'
            ? `Commençons par un petit défi sur « ${conceptTitle(concept, lang)} ».`
            : `Let’s start with a small challenge about “${conceptTitle(concept, lang)}”.`,
          options: ex ? ex.options : undefined,
          reactionCorrect: praise(lang),
          reactionWrong: gentlyWrong(lang),
        });
        break;
      }
      case 'story_analogy': {
        if (!analogy) break;
        push('story_analogy', {
          hook: conceptTitle(concept, lang),
          show: lang === 'ar' ? 'تشبيه من الحياة' : lang === 'fr' ? 'Une image du quotidien' : 'A picture from daily life',
          noorLine: analogy,
          reactionCorrect: praise(lang),
          reactionWrong: gentlyWrong(lang),
        });
        break;
      }
      case 'vocab_flash': {
        if (!vocab) break;
        push('vocab_flash', {
          hook: vocab.word,
          show: lang === 'ar' ? 'كلمة مهمة' : lang === 'fr' ? 'Un mot important' : 'An important word',
          noorLine: vocab.definition,
          reactionCorrect: praise(lang),
          reactionWrong: gentlyWrong(lang),
        });
        break;
      }
      case 'spot_the_mistake': {
        // Needs a misconception-bearing wrong option from a real exercise.
        const ex = usableExercises.find((x) => x.options.some((o) => !o.isCorrect));
        if (!ex) break;
        const wrong = ex.options.find((o) => !o.isCorrect);
        if (!wrong) break;
        push('spot_the_mistake', {
          hook: lang === 'ar' ? 'فيه غلطة هنا… تلاقيها؟' : lang === 'fr' ? 'Il y a une erreur ici… tu la vois ?' : 'There’s a mistake here… can you spot it?',
          show: ex.ex.question,
          noorLine: lang === 'ar' ? 'بصّي كويس على الاختيارات.' : lang === 'fr' ? 'Regarde bien les choix.' : 'Look closely at the choices.',
          options: ex.options,
          reactionCorrect: praise(lang),
          reactionWrong: gentlyWrong(lang),
        });
        break;
      }
      case 'quick_choice': {
        const ex = usableExercises[1] || usableExercises[0];
        if (!ex) break;
        push('quick_choice', {
          hook: lang === 'ar' ? 'سؤال سريع' : lang === 'fr' ? 'Question rapide' : 'Quick question',
          show: ex.ex.question,
          noorLine: lang === 'ar' ? 'اختاري الإجابة الصح.' : lang === 'fr' ? 'Choisis la bonne réponse.' : 'Tap the right answer.',
          options: ex.options,
          reactionCorrect: praise(lang),
          reactionWrong: gentlyWrong(lang),
        });
        break;
      }
      case 'teach_card': {
        const body = nonEmpty(sourceText, keyPoint, analogy);
        if (!body) break;
        push('teach_card', {
          hook: lang === 'ar' ? 'خليني أعلّمك' : lang === 'fr' ? 'Laisse-moi t’expliquer' : 'Let me teach you',
          show: conceptTitle(concept, lang),
          noorLine: body,
          reactionCorrect: praise(lang),
          reactionWrong: gentlyWrong(lang),
        });
        break;
      }
      default:
        break;
    }
  }

  void rng; // rng reserved for future variation; output is currently order-stable
  return reels;
}

/** A closing "you did it" reel, always present at the end of a queue. */
export function buildWinCloser(lang: Language, subjectNameIn: string, sourceLabel: string, index = 0): Reel {
  return {
    id: `closer__${subjectNameIn}__${index}`,
    kind: 'win_closer',
    conceptId: 'closer',
    lessonId: 'closer',
    subjectId: 'closer',
    subjectName: subjectNameIn,
    lessonTitle: '',
    hook: lang === 'ar' ? 'خلصنا جلسة النهارده!' : lang === 'fr' ? 'Fin de la session !' : 'That’s the session!',
    show: lang === 'ar' ? '🎉' : '🎉',
    noorLine: lang === 'ar'
      ? 'شغلك النهارده جميل. نرتاح ونكمل بكرة؟'
      : lang === 'fr'
      ? 'Beau travail aujourd’hui. On se repose et on continue demain ?'
      : 'Great work today. Rest up and we’ll continue tomorrow.',
    reactionCorrect: praise(lang),
    reactionWrong: gentlyWrong(lang),
    sourceLabel,
    originTag: 'official',
    language: lang,
    reason: 'closer',
  };
}

/** True when the reel is well-formed (used by the test suite). */
export function isValidReel(reel: Reel): boolean {
  if (!reel.id || !reel.kind || !reel.language) return false;
  if (!reel.hook || !reel.show || !reel.noorLine) return false;
  if (!reel.sourceLabel) return false;
  if (reel.options) {
    if (reel.options.length < 2) return false;
    if (reel.options.filter((o) => o.isCorrect).length !== 1) return false;
  }
  return true;
}
