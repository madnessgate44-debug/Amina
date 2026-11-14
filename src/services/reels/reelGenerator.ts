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
import {
  readableByChild,
  scriptOf,
  wantedScript,
  latinLanguage,
} from './languageGuard';
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
  if (lang === 'fr') return concept.titleFr || concept.titleEn;
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

/**
 * Orders exercises so the ones written in the child's language come first.
 * It is a stable reordering only — no exercise is dropped and none is
 * fabricated, so a lesson with no matching-language exercise still works.
 */
function preferExercisesInLanguage(
  usable: Array<{ ex: CurriculumExercise; options: ReelOption[] }>,
  lang: Language
): Array<{ ex: CurriculumExercise; options: ReelOption[] }> {
  const want = wantedScript(lang);
  const score = (text: string): number => {
    const s = scriptOf(text);
    if (s !== want) return 2; // wrong script — last
    if (s === 'latin' && (lang === 'en' || lang === 'fr')) {
      const actual = latinLanguage(text);
      if (actual !== 'other' && actual !== lang) return 1; // right script, wrong language
    }
    return 0; // right script and (for Latin) right language or undecidable
  };
  return usable
    .map((item, i) => ({ item, i, score: score(item.ex.question || '') }))
    .sort((a, b) => a.score - b.score || a.i - b.i)
    .map((x) => x.item);
}

/**
 * True when the child can answer the exercise: every one of its choices must be
 * in a script they can read. A bilingual lesson can pair a prompt the child can
 * read with choices written for the other track (an Arabic maths exercise under
 * a French prompt), leaving an unanswerable question on screen. The choices are
 * always shown, so they are the guard; the prompt itself is checked where it is
 * displayed (the `show` field) by `readableByChild`. Such an exercise is skipped
 * rather than shown.
 */
function readableExercise(options: ReelOption[], lang: Language): boolean {
  return options.every((o) => readableByChild(o.text, lang));
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
    pickLang({ ar: concept.dailyLifeExampleAr, en: concept.dailyLifeExampleEn, fr: concept.dailyLifeExampleFr || concept.dailyLifeExampleEn }, lang),
    conceptTitle(concept, lang)
  );
  const analogy = pickLang({ ar: concept.storyAnalogyAr, en: concept.storyAnalogyEn, fr: concept.storyAnalogyFr || concept.storyAnalogyEn }, lang);
  const sourceText = nonEmpty(lang === 'fr' ? concept.sourceTextFr : undefined, concept.sourceText);
  const keyPoint = concept.keyPoints && concept.keyPoints.length ? concept.keyPoints[0] : '';

  // Collect question-capable exercises once. An exercise whose choices are
  // written for the other track cannot be answered (an Arabic maths exercise
  // under a French prompt), so it is excluded rather than shown: a question with
  // unreadable choices is worse than no question. Exercises in the child's own
  // language come first.
  const languageExercises = lesson.exercisesByLanguage?.[lang] ?? lesson.exercises;
  const usableExercises = preferExercisesInLanguage(
    languageExercises
      .map((ex) => ({ ex, options: exerciseToOptions(ex) }))
      .filter((x): x is { ex: CurriculumExercise; options: ReelOption[] } => x.options !== null)
      .filter((x) => readableExercise(x.options, lang)),
    lang
  );

  const vocab = lesson.vocabulary && lesson.vocabulary.length ? lesson.vocabulary[0] : null;

  // The three question kinds all draw from the same exercise list, so a lesson
  // with one or two exercises used to show the SAME question two or three times
  // in a single session (hook_question, spot_the_mistake and quick_choice each
  // reached for usableExercises[0]). The child saw the identical card return.
  // Each kind now claims the next DISTINCT exercise and a kind is skipped when
  // the lesson has no fresh exercise left, so a question is never repeated
  // inside a session. A concept with one exercise asks it once.
  const usedExercises = new Set<number>();
  const takeExercise = (
    predicate: (item: (typeof usableExercises)[number]) => boolean
  ): (typeof usableExercises)[number] | undefined => {
    for (let i = 0; i < usableExercises.length; i++) {
      if (usedExercises.has(i)) continue;
      if (!predicate(usableExercises[i])) continue;
      usedExercises.add(i);
      return usableExercises[i];
    }
    return undefined;
  };

  let idx = 0;
  const push = (kind: ReelKind, partial: Partial<Reel> & Pick<Reel, 'hook' | 'show' | 'noorLine'>) => {
    // The reel is READ on screen, so every piece of teaching text must be in a
    // script the child can read. Lesson vocabulary and source text are stored in
    // one language, so a reel built from them can otherwise show a sentence the
    // child cannot read at all. A reel in the wrong script is worse than no
    // reel; dropping it is the honest choice (see readableByChild).
    if (
      !readableByChild(partial.hook, lang) ||
      !readableByChild(partial.show, lang) ||
      !readableByChild(partial.noorLine, lang)
    ) {
      return;
    }
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
        // The card is a question, so it must SHOW its question. It used to set
        // `show` to the concept title, so the child saw four answer buttons
        // («أنا أستطيع» / «سأستسلم» …) with nothing above them saying what was
        // asked. The other two question kinds (spot_the_mistake, quick_choice)
        // already showed ex.question. A French-track exercise stores its prompt
        // in French over language-neutral choices, so for a non-French child the
        // prompt is unreadable; showing it would fail the script guard and drop
        // the whole reel. In that case the title stays (today's behaviour) and
        // the question is not displayed — an honest content gap (no Arabic
        // exercises exist for that lesson yet), not a fabricated one.
        const ex = takeExercise(() => true);
        const asksReadableQuestion = Boolean(ex && readableByChild(ex.ex.question, lang));
        push('hook_question', {
          hook: hookLine,
          show: asksReadableQuestion ? ex!.ex.question : conceptTitle(concept, lang),
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
        // Needs a misconception-bearing wrong option from a real exercise, and a
        // fresh one: the same question must not come back later as quick_choice.
        const ex = takeExercise((x) => x.options.some((o) => !o.isCorrect));
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
        const ex = takeExercise(() => true);
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
