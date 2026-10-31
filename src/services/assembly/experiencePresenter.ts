/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Presenting and assessing an assembled teaching experience.
 *
 * `contentAssembler.ts` builds the TEACH · ASSESS · ADAPT experience, but the
 * UI needs two more things the assembler deliberately does not do:
 *
 *  1. A render-ready view of EVERY phase (teach lines, media, the practice
 *     question with its options, the verification prompt, the next step) so the
 *     interface can show a real lesson instead of concatenating two text blobs.
 *
 *  2. A deterministic assessor for the child's actual answers, so practice and
 *     verification produce evidence rather than a "well done" that means
 *     nothing. Assessment is pure and model-free: the same answer always yields
 *     the same outcome, which is what makes it testable and honest.
 *
 * Nothing here invents content. Every presented line keeps the `reuseKey` it
 * came from, and every assessment names the concept it is evidence for.
 */

import { Language } from '../../types';
import {
  AssessmentResult,
  ExperiencePhase,
  ExperiencePresentation,
  PresentedPhase,
  TeachingExperience,
  VerificationAssessment,
} from '../../types/assembly';
import { curriculumService } from '../curriculum/curriculumService';

function pick(text: { ar?: string; en?: string; fr?: string } | undefined, lang: Language): string {
  if (!text) return '';
  if (lang === 'ar') return text.ar || text.en || text.fr || '';
  if (lang === 'fr') return text.fr || text.en || text.ar || '';
  return text.en || text.ar || text.fr || '';
}

/** Normalise text for token overlap: lowercase, strip punctuation, keep words. */
function tokenize(s: string): Set<string> {
  const words = (s || '')
    .toLowerCase()
    .replace(/[\u064B-\u0652]/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2);
  return new Set(words);
}

/**
 * Build the render-ready presentation of an experience. The four phases are
 * always returned in order, so the UI renders a fixed structure and never has
 * to guess which movement comes next.
 */
export function presentExperience(exp: TeachingExperience): ExperiencePresentation {
  const lang = exp.need.language;
  const phaseOrder: ExperiencePhase[] = ['dialogue', 'practice', 'verification', 'next_step'];

  const byName = new Map(exp.phases.map((p) => [p.phase, p] as const));
  const phases: PresentedPhase[] = phaseOrder.map((phase) => {
    const src = byName.get(phase);
    return {
      phase,
      purpose: src?.purpose || '',
      lines: src?.lines || [],
      options: src?.options,
    };
  });

  return {
    title: exp.title,
    phases,
    media: exp.media,
    conceptId: exp.need.matched?.conceptId || null,
    lessonId: exp.need.matched?.lessonId || null,
    usedGeneration: exp.usedGeneration,
    pendingGeneration: exp.pendingGeneration,
    reuseRatio: exp.resolution.reuseRatio,
  };
}

function practicePhase(exp: TeachingExperience): { options?: { text: string; isCorrect: boolean }[] } | undefined {
  return exp.phases.find((p) => p.phase === 'practice');
}

/**
 * Assess a practice answer. `optionIndex` is the option the child chose.
 * Returns null when the experience carries no answerable practice question —
 * the caller then simply does not record evidence.
 */
export function assessPractice(exp: TeachingExperience, optionIndex: number): AssessmentResult | null {
  const lang = exp.need.language;
  const options = practicePhase(exp)?.options;
  if (!options || options.length === 0) return null;
  const chosen = options[optionIndex];
  if (!chosen) return null;

  const correctIndex = options.findIndex((o) => o.isCorrect);
  const isCorrect = chosen.isCorrect;

  // When the concept records a misconception and the child picked a wrong
  // option, surface the remediation so the wrong choice teaches instead of
  // only being marked wrong.
  let remediation: string | undefined;
  if (!isCorrect && exp.need.matched) {
    const found = curriculumService.getConceptById(exp.need.matched.conceptId);
    const m = found?.concept.misconceptions?.[0];
    if (m) remediation = m.remediation || m.explanation;
  }

  const feedback = isCorrect
    ? pick({ ar: 'إجابة صحيحة! 🎉 فهمتِ الفكرة كويس.', en: 'Correct! 🎉 You understood it.', fr: 'Correct ! 🎉 Tu as compris.' }, lang)
    : pick(
        {
          ar: 'مش دقيق تماماً، يلا نراجع النقطة دي مع بعض.',
          en: "Not quite — let's look at this point together.",
          fr: "Pas tout à fait — revoyons ce point ensemble.",
        },
        lang
      );

  return {
    outcome: isCorrect ? 'correct' : 'wrong',
    correctness: isCorrect ? 'full' : 'wrong',
    feedback,
    remediation,
    conceptId: exp.need.matched?.conceptId || null,
    modality: 'practice',
    score: isCorrect ? 1 : 0,
    correctOptionIndex: correctIndex >= 0 ? correctIndex : undefined,
  };
}

/**
 * Assess an "explain it back" answer by key-point overlap with the matched
 * concept. Deterministic and model-free. When the ask did not match a concept
 * there is nothing to verify against, so the result is `unclear` with no
 * evidence recorded (the caller checks `conceptId`).
 */
export function assessVerification(exp: TeachingExperience, text: string): VerificationAssessment {
  const lang = exp.need.language;
  const answer = (text || '').trim();

  const guessCues = ['تخمين', 'حظ', 'مش عارف', 'مش عارفة', 'guess', 'not sure', 'au hasard'];
  const lower = answer.toLowerCase();
  const guessed = guessCues.some((g) => lower.includes(g));

  if (!answer || guessed) {
    return {
      quality: guessed ? 'guessing' : 'unclear',
      correctness: 'wrong',
      feedback: guessed
        ? pick({ ar: 'خدي وقتك وفكري بهدوء، أنا معاكي. 💛', en: "Take your time — I'm right here. 💛", fr: 'Prends ton temps — je suis là. 💛' }, lang)
        : pick({ ar: 'اكتبي لي بجملة واحدة إيه اللي فهمتيه.', en: 'Tell me in one sentence what you understood.', fr: 'Dis-moi en une phrase ce que tu as compris.' }, lang),
      score: 0,
      conceptId: exp.need.matched?.conceptId || null,
    };
  }

  const found = exp.need.matched ? curriculumService.getConceptById(exp.need.matched.conceptId) : null;
  const concept = found?.concept;
  const keyPointTerms = new Set(
    (concept?.keyPoints || []).flatMap((k) => [...tokenize(k)])
  );
  const titleTerms = new Set(tokenize(`${concept?.titleAr || ''} ${concept?.titleEn || ''}`));
  const studentTerms = tokenize(answer);

  const keyHits = [...keyPointTerms].filter((t) => studentTerms.has(t)).length;
  const titleHits = [...titleTerms].filter((t) => studentTerms.has(t)).length;

  let quality: VerificationAssessment['quality'];
  if (keyHits >= 2 || (keyHits >= 1 && titleHits >= 1 && answer.length >= 20)) quality = 'sound';
  else if (keyHits >= 1 || titleHits >= 1 || answer.length >= 15) quality = 'partial';
  else quality = 'unclear';

  const correctness = quality === 'sound' ? 'full' : quality === 'partial' ? 'partial' : 'wrong';
  const feedback =
    quality === 'sound'
      ? pick({ ar: 'ممتاز! شرحك يدل إنك فهمتِ الفكرة فعلاً. 🌟', en: 'Excellent! Your explanation shows you really understood. 🌟', fr: "Excellent ! Ton explication montre que tu as compris. 🌟" }, lang)
      : quality === 'partial'
      ? pick({ ar: 'قربتِ كتير! خلينا نضيف نقطة صغيرة تكمل الفهم.', en: 'Close! Let us add one small point to complete it.', fr: 'Presque ! Ajoutons un petit point.' }, lang)
      : pick({ ar: 'يلا نرجع نشرح الفكرة تاني بطريقة أبسط.', en: 'Let us explain the idea again, more simply.', fr: 'Réexpliquons l’idée plus simplement.' }, lang);

  return {
    quality,
    correctness,
    feedback,
    score: quality === 'sound' ? 1 : quality === 'partial' ? 0.5 : 0,
    conceptId: exp.need.matched?.conceptId || null,
  };
}

/** True when the presented experience has an answerable practice question. */
export function hasPracticeQuestion(exp: TeachingExperience): boolean {
  return !!practicePhase(exp)?.options?.length;
}

/**
 * The next step to recommend from verified evidence, so the "next learning
 * step" is a function of what the child demonstrated rather than a static line.
 */
export function recommendNextStep(
  exp: TeachingExperience,
  verification: VerificationAssessment | null
): { text: string; advance: boolean } {
  const lang = exp.need.language;
  const fallback = exp.phases.find((p) => p.phase === 'next_step')?.lines[0]?.text || '';
  if (!verification) {
    return { text: fallback, advance: false };
  }
  if (verification.quality === 'sound') {
    return {
      text: pick(
        {
          ar: `تمام كده! ننتقل لخطوة أصعب شوية. الخطوة التالية: ${fallback}`,
          en: `Well done! Let us move to a slightly harder step. Next: ${fallback}`,
          fr: `Bravo ! Passons à une étape un peu plus difficile. Ensuite : ${fallback}`,
        },
        lang
      ),
      advance: true,
    };
  }
  if (verification.quality === 'partial') {
    return {
      text: pick(
        {
          ar: `قربتِ! نثبّت الفكرة بتدريب بسيط قبل ما نكمل. الخطوة التالية: ${fallback}`,
          en: `Almost there! Let us practise once more before moving on. Next: ${fallback}`,
          fr: `Presque ! Entraînons-nous encore un peu. Ensuite : ${fallback}`,
        },
        lang
      ),
      advance: false,
    };
  }
  return {
    text: pick(
      {
        ar: `نعيد الشرح بطريقة تانية قبل أي خطوة جديدة. الخطوة التالية بعد كده: ${fallback}`,
        en: `Let us re-teach this a different way before moving on. After that: ${fallback}`,
        fr: `Réexpliquons autrement avant de continuer. Ensuite : ${fallback}`,
      },
      lang
    ),
    advance: false,
  };
}
