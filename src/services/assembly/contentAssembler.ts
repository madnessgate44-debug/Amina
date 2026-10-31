/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Dynamic assembly of a teaching experience.
 *
 * Given a resolved `TeachingNeed` and its `AssetResolution`, this assembles the
 * four movements the product asks for:
 *
 *   dialogue      → TEACH: the explanation, an example and an analogy, said
 *                   conversationally.
 *   practice      → ASSESS: a fair question drawn from approved material.
 *   verification  → ASSESS: the "explain it back" check.
 *   next_step     → ADAPT: the next learning step, plus a misconception repair
 *                   when the concept has one.
 *
 * Assembly is dynamic: it places only the roles that resolved, and leaves the
 * rest to the generation stage. It never invents text — every line carries the
 * `reuseKey` it came from.
 */

import { Language } from '../../types';
import {
  AssetResolution,
  ExperiencePhaseContent,
  ReusedAsset,
  TeachingExperience,
  TeachingNeed,
} from '../../types/assembly';
import { EducationalMediaItem } from '../../types/media';
import { curriculumService } from '../curriculum/curriculumService';

function pick(text: { ar?: string; en?: string; fr?: string } | undefined, lang: Language): string {
  if (!text) return '';
  if (lang === 'ar') return text.ar || text.en || text.fr || '';
  if (lang === 'fr') return text.fr || text.en || text.ar || '';
  return text.en || text.ar || text.fr || '';
}

const PURPOSE: Record<'dialogue' | 'practice' | 'verification' | 'next_step', { ar: string; en: string }> = {
  dialogue: { ar: 'نشرح الفكرة بأسلوب بسيط ومثال من الحياة.', en: 'Teach the idea simply, with an everyday example.' },
  practice: { ar: 'نتدرّب على سؤال واحد عادل.', en: 'Practise with one fair question.' },
  verification: { ar: 'نتأكد إنك فهمتِ بشرحك بأسلوبك.', en: 'Verify understanding by explaining it back.' },
  next_step: { ar: 'نحدّد الخطوة التعليمية التالية.', en: 'Set the next learning step.' },
};

function lineFrom(asset: ReusedAsset): { role: ReusedAsset['role']; text: string; origin: ReusedAsset['origin']; reuseKey?: string } {
  return { role: asset.role, text: asset.text || '', origin: asset.origin, reuseKey: asset.reuseKey };
}

/**
 * Assemble a `TeachingExperience` from a need and its resolution. Pure and
 * synchronous. `pendingGeneration` lists the roles the experience still lacks.
 */
export function assembleExperience(need: TeachingNeed, resolution: AssetResolution): TeachingExperience {
  const lang = need.language;
  const byRole = new Map(resolution.reused.map((r) => [r.role, r] as const));
  const at = (role: ReusedAsset['role']) => byRole.get(role);

  const dialogueLines = [at('explanation'), at('example'), at('analogy')]
    .filter((a): a is ReusedAsset => !!a && !!a.text)
    .map(lineFrom);

  const practice = at('practice');
  const practiceLines = practice ? [lineFrom(practice)] : [];

  const verification = at('verification');
  const verificationLines = verification ? [lineFrom(verification)] : [];

  const nextStep = at('next_step');
  const misconception = at('misconception');
  const nextLines = [nextStep, misconception]
    .filter((a): a is ReusedAsset => !!a && !!a.text)
    .map(lineFrom);

  const phases: ExperiencePhaseContent[] = [
    { phase: 'dialogue', purpose: pick(PURPOSE.dialogue, lang), lines: dialogueLines },
    {
      phase: 'practice',
      purpose: pick(PURPOSE.practice, lang),
      lines: practiceLines,
      options: practice?.options,
    },
    { phase: 'verification', purpose: pick(PURPOSE.verification, lang), lines: verificationLines },
    { phase: 'next_step', purpose: pick(PURPOSE.next_step, lang), lines: nextLines },
  ];

  const media: EducationalMediaItem[] = resolution.reused
    .map((r) => r.media)
    .filter((m): m is EducationalMediaItem => !!m);

  const title = need.matched
    ? (lang === 'ar' ? need.matched.titleAr : need.matched.titleEn)
    : (lang === 'ar' ? 'درس من سؤالك' : 'A lesson from your question');

  const pendingGeneration = resolution.missing.map((m) => m.role);

  return {
    need,
    title,
    phases,
    media,
    resolution,
    pendingGeneration,
    usedGeneration: resolution.missing.length > 0,
  };
}

/**
 * A one-line-to-short immediate answer for a quick question, built from reused
 * material only. Returns null when there is nothing approved to answer with —
 * the caller then escalates to a production job instead of guessing.
 */
export function assembleQuickExplanation(
  need: TeachingNeed,
  resolution: AssetResolution
): { text: string; media?: EducationalMediaItem; source: string } | null {
  const byRole = new Map(resolution.reused.map((r) => [r.role, r] as const));
  const explanation = byRole.get('explanation');
  const example = byRole.get('example');

  const parts: string[] = [];
  let source = '';
  if (explanation?.text) {
    parts.push(explanation.text);
    source = explanation.reuseKey;
  }
  if (example?.text) {
    parts.push(example.text);
    source = source || example.reuseKey;
  }
  if (parts.length === 0) {
    // A visual or narration can still carry a short answer.
    const narration = byRole.get('narration');
    if (narration?.text) {
      parts.push(narration.text);
      source = narration.reuseKey;
    }
  }
  if (parts.length === 0) return null;

  const media =
    byRole.get('visual')?.media ||
    byRole.get('narration')?.media ||
    resolution.reused.find((r) => !!r.media)?.media;

  return {
    text: parts.join(' '),
    media,
    source,
  };
}

/** Convenience: the concept the need matched, if any. */
export function matchedConcept(need: TeachingNeed) {
  if (!need.matched) return null;
  return curriculumService.getConceptById(need.matched.conceptId);
}
