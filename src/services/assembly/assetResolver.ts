/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Reuse-first asset resolution.
 *
 * For a `TeachingNeed`, this walks the roles a teaching experience needs and
 * fills each one from material the app ALREADY has, in priority order:
 *
 *   1. the matched curriculum concept's own fields (sourceText, keyPoints,
 *      dailyLifeExample, storyAnalogy, prerequisite);
 *   2. the lesson's own exercises (practice and verification questions);
 *   3. the concept's own misconceptions and their remediation;
 *   4. an approved asset in the media catalog (visuals and narration);
 *   5. a reel built deterministically from the concept (the reel engine).
 *
 * Only a role with NO approved source becomes a `GenerationRequest`, carrying a
 * precise brief so a generator (or a human author) can fill exactly that gap.
 * The resolver never fabricates content itself: reuse is recorded, gaps are
 * declared. This is what lets the app stop regenerating what it already has.
 */

import { Language } from '../../types';
import { OfficialCurriculumLesson, CurriculumLessonConcept } from '../../types/teachingSession';
import {
  AssetResolution,
  AssetRole,
  GenerationRequest,
  ReusedAsset,
  TeachingNeed,
} from '../../types/assembly';
import { EducationalMediaItem, localized } from '../../types/media';
import { curriculumService } from '../curriculum/curriculumService';
import { mediaForConcept } from '../../data/media/mediaCatalog';
import { buildReelsForConcept } from '../reels/reelGenerator';
import { Reel, ReelKind } from '../../types/reel';

function pick(text: { ar?: string; en?: string; fr?: string } | undefined, lang: Language): string {
  if (!text) return '';
  if (lang === 'ar') return text.ar || text.en || text.fr || '';
  if (lang === 'fr') return text.fr || text.en || text.ar || '';
  return text.en || text.ar || text.fr || '';
}

function trim(s: string | undefined | null): string {
  return (s || '').trim();
}

/** Roles every lesson-style experience needs, in teaching order. */
const LESSON_ROLES: AssetRole[] = [
  'explanation',
  'example',
  'analogy',
  'visual',
  'practice',
  'verification',
  'misconception',
  'narration',
  'next_step',
];

interface ReelIndex {
  byKind: Partial<Record<ReelKind, Reel>>;
}

function indexReels(reels: Reel[]): ReelIndex {
  const byKind: Partial<Record<ReelKind, Reel>> = {};
  for (const r of reels) if (!byKind[r.kind]) byKind[r.kind] = r;
  return { byKind };
}

/** The media item that best serves a role, from the approved catalog. */
function mediaForRole(items: EducationalMediaItem[], role: AssetRole): EducationalMediaItem | undefined {
  if (role === 'visual') {
    return items.find((m) => m.type === 'image' || m.type === 'interactive' || m.type === 'video');
  }
  if (role === 'narration') {
    return items.find((m) => !!m.narration?.src) || items.find((m) => !!m.narration);
  }
  return undefined;
}

/**
 * Resolve every role for a need. Pure and synchronous; reads the curriculum,
 * the media catalog and the reel engine only.
 */
export function resolveAssets(need: TeachingNeed, opts: { roles?: AssetRole[] } = {}): AssetResolution {
  const roles = opts.roles || LESSON_ROLES;
  const reused: ReusedAsset[] = [];
  const missing: GenerationRequest[] = [];
  const lang = need.language;

  const match = need.matched;
  const found = match ? curriculumService.getConceptById(match.conceptId) : null;
  const lesson: OfficialCurriculumLesson | null = found?.lesson || null;
  const concept: CurriculumLessonConcept | null = found?.concept || null;

  // Approved media and deterministic reels for the concept, when we have one.
  const media = match ? mediaForConcept(match.lessonId, match.conceptId) : [];
  const reels: Reel[] =
    lesson && concept ? buildReelsForConcept(lesson, concept, lang) : [];
  const reelIndex = indexReels(reels);

  for (const role of roles) {
    const resolved = resolveRole(role, { need, lesson, concept, media, reelIndex });
    if (resolved) reused.push(resolved);
    else missing.push(buildRequest(role, { need, lesson, concept }));
  }

  const total = reused.length + missing.length;
  const reuseRatio = total === 0 ? 1 : Number((reused.length / total).toFixed(3));

  return { reused, missing, reuseRatio };
}

function resolveRole(
  role: AssetRole,
  ctx: {
    need: TeachingNeed;
    lesson: OfficialCurriculumLesson | null;
    concept: CurriculumLessonConcept | null;
    media: EducationalMediaItem[];
    reelIndex: ReelIndex;
  }
): ReusedAsset | null {
  const { need, lesson, concept, media, reelIndex } = ctx;
  const lang = need.language;

  switch (role) {
    case 'explanation': {
      const text = trim(concept?.sourceText);
      if (!text) return null;
      return {
        role,
        origin: 'curriculum_concept',
        reuseKey: `concept ${concept!.id}.sourceText`,
        text,
      };
    }

    case 'example': {
      // The child's own language is preferred; the English field is a fallback.
      const text =
        lang === 'ar'
          ? trim(concept?.dailyLifeExampleAr) || trim(concept?.dailyLifeExampleEn)
          : trim(concept?.dailyLifeExampleEn) || trim(concept?.dailyLifeExampleAr);
      if (!text) return null;
      return {
        role,
        origin: 'curriculum_concept',
        reuseKey: `concept ${concept!.id}.dailyLifeExample`,
        text,
      };
    }

    case 'analogy': {
      const text =
        lang === 'ar'
          ? trim(concept?.storyAnalogyAr) || trim(concept?.storyAnalogyEn)
          : trim(concept?.storyAnalogyEn) || trim(concept?.storyAnalogyAr);
      if (!text) return null;
      return {
        role,
        origin: 'curriculum_concept',
        reuseKey: `concept ${concept!.id}.storyAnalogy`,
        text,
      };
    }

    case 'visual': {
      const item = mediaForRole(media, 'visual');
      if (!item) return null;
      return {
        role,
        origin: 'media_catalog',
        reuseKey: `media ${item.id}`,
        text: localized(item.title, lang),
        media: item,
      };
    }

    case 'practice': {
      const reel = reelIndex.byKind['quick_choice'] || reelIndex.byKind['spot_the_mistake'];
      if (reel?.options?.length) {
        return {
          role,
          origin: 'reel_engine',
          reuseKey: `reel ${reel.id}`,
          text: reel.noorLine || reel.hook,
          reelKind: reel.kind,
          options: reel.options,
        };
      }
      // Fall back to a fair multiple-choice exercise on the lesson itself.
      const ex = (lesson?.exercises || []).find(
        (e) => e.type === 'multiple_choice' && e.options && e.options.length >= 2 && trim(e.expectedAnswer)
      );
      if (ex) {
        const expected = trim(ex.expectedAnswer);
        return {
          role,
          origin: 'curriculum_exercise',
          reuseKey: `lesson ${lesson!.id}.exercise(multiple_choice)`,
          text: trim(ex.question),
          options: ex.options!.map((o) => ({ text: trim(o), isCorrect: trim(o) === expected })),
        };
      }
      return null;
    }

    case 'verification': {
      // Verification is the "explain it back" prompt, anchored on a key point.
      const kp = (concept?.keyPoints || []).map(trim).filter(Boolean)[0];
      if (!kp) return null;
      return {
        role,
        origin: 'curriculum_concept',
        reuseKey: `concept ${concept!.id}.keyPoints[0]`,
        text: kp,
      };
    }

    case 'misconception': {
      const m = concept?.misconceptions?.[0];
      if (!m) return null;
      return {
        role,
        origin: 'curriculum_misconception',
        reuseKey: `concept ${concept!.id}.misconception ${m.id}`,
        text: m.remediation || m.explanation,
      };
    }

    case 'narration': {
      const item = mediaForRole(media, 'narration');
      if (item?.narration) {
        return {
          role,
          origin: 'media_catalog',
          reuseKey: `media ${item.id}.narration`,
          text: pick(item.narration.text, lang),
          media: item,
        };
      }
      // A narration can also be the reel's own spoken line.
      const reel = reelIndex.byKind['teach_card'] || reelIndex.byKind['hook_question'];
      if (reel?.noorLine) {
        return {
          role,
          origin: 'reel_engine',
          reuseKey: `reel ${reel.id}.noorLine`,
          text: reel.noorLine,
          reelKind: reel.kind,
        };
      }
      return null;
    }

    case 'next_step': {
      // The next step is the concept's prerequisite when it has one, else the
      // lesson's first objective. Reuse beats inventing a suggestion.
      const pre =
        lang === 'ar'
          ? trim(concept?.prerequisiteAr) || trim(concept?.prerequisiteEn)
          : trim(concept?.prerequisiteEn) || trim(concept?.prerequisiteAr);
      const text = pre || trim(lesson?.objectives?.[0]);
      if (!text) return null;
      return {
        role,
        origin: 'curriculum_concept',
        reuseKey: `concept ${concept?.id}.prerequisite|lesson.objectives[0]`,
        text,
      };
    }

    default:
      return null;
  }
}

/** The precise brief for a role that had no approved source. */
function buildRequest(
  role: AssetRole,
  ctx: {
    need: TeachingNeed;
    lesson: OfficialCurriculumLesson | null;
    concept: CurriculumLessonConcept | null;
  }
): GenerationRequest {
  const { need, lesson, concept } = ctx;
  const lang = need.language;
  const conceptTitle =
    concept ? pick({ ar: concept.titleAr, en: concept.titleEn }, lang) : need.topicTokens.join(' ');
  const lessonTitle = lesson ? pick({ ar: lesson.titleAr, en: lesson.titleEn }, lang) : '';

  const reasonFor: Record<AssetRole, string> = {
    explanation: 'No concept sourceText was available for this ask.',
    example: 'No dailyLifeExample on the matched concept (or no concept matched).',
    analogy: 'No storyAnalogy on the matched concept (or no concept matched).',
    visual: 'No approved image/diagram/video in the media catalog for this concept.',
    practice: 'No fair multiple-choice practice item (reel or lesson exercise).',
    verification: 'No keyPoints on the matched concept to verify against.',
    misconception: 'No misconception recorded on the matched concept.',
    narration: 'No narration audio or reel spoken line for this concept.',
    next_step: 'No prerequisite or lesson objective to suggest as the next step.',
  };

  const briefFor: Record<AssetRole, string> = {
    explanation: `Explain "${conceptTitle}" simply for a 10-year-old.`,
    example: `Give one everyday example of "${conceptTitle}".`,
    analogy: `Give one familiar analogy for "${conceptTitle}".`,
    visual: `Produce a diagram for "${conceptTitle}" (no words baked in; numeric callouts only).`,
    practice: `Write one fair multiple-choice question on "${conceptTitle}" with exactly one correct answer.`,
    verification: `Write one "explain it back" prompt for "${conceptTitle}".`,
    misconception: `State one common wrong belief about "${conceptTitle}" and its correction.`,
    narration: `Write a 2-3 sentence narration for "${conceptTitle}".`,
    next_step: `Name the next thing to learn after "${conceptTitle}".`,
  };

  const anchors: string[] = [];
  if (lesson) anchors.push(`lesson:${lesson.id}`, `source:${lesson.sourceRef?.bookEn || lesson.sourceRef?.book || ''}`);
  if (concept) anchors.push(`concept:${concept.id}`, `title:${concept.titleAr}`);
  if (lessonTitle) anchors.push(`lessonTitle:${lessonTitle}`);

  const mediaType: GenerationRequest['mediaType'] =
    role === 'visual' ? 'image' : role === 'narration' ? 'audio' : undefined;

  return {
    role,
    reason: reasonFor[role],
    brief: {
      ar: briefFor[role],
      en: briefFor[role],
    },
    mediaType,
    anchors,
  };
}
