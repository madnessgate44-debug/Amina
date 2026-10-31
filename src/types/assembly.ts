/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * The content-assembly contract.
 *
 * The app can already generate a teaching line, a reel, or a lesson narration.
 * What it could not do is take a raw ask ("Amina asks a question or pastes
 * text"), work out what the child actually needs, and then build a teaching
 * experience from what the app ALREADY has — reaching for generation only for
 * the parts that are genuinely missing.
 *
 * Three ideas drive this contract:
 *
 *  1. Understand first. An ask becomes a `TeachingNeed`: intent, language,
 *     topic, and the curriculum concept it maps to (or a flag saying no
 *     textbook selection could be matched, so the engine must still proceed).
 *
 *  2. Reuse before generating. Every role a teaching experience needs
 *     (explanation, example, analogy, visual, practice, misconception,
 *     narration) is first resolved from approved material — the curriculum
 *     concept, the media catalog, the lesson's own exercises. Only roles with
 *     no approved source become `GenerationRequest`s. `AssetResolution`
 *     reports exactly what was reused and what must be produced, so the ratio
 *     is measurable instead of assumed.
 *
 *  3. Separate fast from long. A quick question is answered inline
 *     (`QuickExplanation`). A full lesson is a `LessonProductionJob` that moves
 *     through named stages and is pumped over time, so the UI can show progress
 *     instead of blocking on a slow generation.
 */

import { Language } from './index';
import { ReelKind } from './reel';
import { EducationalMediaItem, LocalizedText } from './media';

// ─── 1. Understanding the ask ────────────────────────────────────────────────

/** What the child is after, inferred from the ask's wording. */
export type AskIntent = 'quick_question' | 'topic_exploration' | 'lesson_request';

/** How the ask reached the engine. */
export type AskChannel = 'typed' | 'voice' | 'pasted_text' | 'feed';

export interface TeachingNeed {
  /** The raw ask, trimmed, exactly as it arrived. */
  rawAsk: string;
  channel: AskChannel;
  /** Language the child reads in. */
  language: Language;
  intent: AskIntent;
  /** The content words of the ask, after normalisation. */
  topicTokens: string[];
  /**
   * The curriculum concept the ask maps to, when one was matched. `null` means
   * the ask could not be tied to a textbook selection — the engine still builds
   * an experience, but flags it so the UI can ask the child to pick a lesson.
   */
  matched: {
    lessonId: string;
    conceptId: string;
    subjectId: string;
    titleAr: string;
    titleEn: string;
    /** 0..1 confidence of the match, from token overlap. */
    confidence: number;
  } | null;
  /** True when no concept matched and the child should be offered a lesson list. */
  needsCurriculumSelection: boolean;
  /** Human-readable reason for the match decision, for the audit trail. */
  matchReason: string;
}

// ─── 2. Reuse before generating ──────────────────────────────────────────────

/**
 * The part a teaching experience needs. Each role is resolved independently, so
 * a lesson can reuse an approved diagram while generating only a missing
 * analogy.
 */
export type AssetRole =
  | 'explanation'
  | 'example'
  | 'analogy'
  | 'visual'
  | 'practice'
  | 'verification'
  | 'misconception'
  | 'narration'
  | 'next_step';

/** Where a resolved asset came from. */
export type AssetOrigin =
  | 'curriculum_concept' // a field on the lesson concept (sourceText, keyPoints, …)
  | 'curriculum_exercise' // one of the lesson's own exercises
  | 'curriculum_misconception' // a concept misconception + its remediation
  | 'media_catalog' // an approved asset in src/data/media/mediaCatalog.ts
  | 'reel_engine' // a reel built deterministically from the concept
  | 'generated'; // produced because no approved source existed

/** An asset that was satisfied for a role. Usually reused; `generated` when
 *  no approved source existed and a generator filled the gap. */
export interface ReusedAsset {
  role: AssetRole;
  origin: AssetOrigin;
  /** Exact provenance, e.g. "concept off_sci_u1_l1_c1.sourceText". */
  reuseKey: string;
  /** The text content, when the role is textual. */
  text?: string;
  /** The approved media item, when the role is visual/narration. */
  media?: EducationalMediaItem;
  /** The reel kind this came from, when it came from the reel engine. */
  reelKind?: ReelKind;
  /** Practice options, when the role is a question. */
  options?: { text: string; isCorrect: boolean }[];
}

/**
 * A part of the experience that has NO approved source and must be produced.
 * The engine never fabricates the content inline — it records precisely what is
 * missing so a generation step (or a human author) can fill it.
 */
export interface GenerationRequest {
  role: AssetRole;
  /** Why reuse failed, e.g. "concept has no storyAnalogyAr/En". */
  reason: string;
  /** What the generator should produce, as a localised brief. */
  brief: LocalizedText;
  /** Media family to produce, when the role is a visual or narration. */
  mediaType?: 'image' | 'video' | 'audio' | 'interactive';
  /** Curriculum anchors the generated asset must stay faithful to. */
  anchors: string[];
}

/** The outcome of reuse-first resolution: what we had, and what we still need. */
export interface AssetResolution {
  reused: ReusedAsset[];
  missing: GenerationRequest[];
  /** reused / (reused + missing). 1.0 means nothing had to be generated. */
  reuseRatio: number;
}

// ─── 3. Fast vs long ─────────────────────────────────────────────────────────

/**
 * The two work classes the owner asked to be distinguished:
 *  - `fast` — an immediate explanation, answered inline from reused material.
 *  - `long` — lesson production, which reuses, generates the gaps, assembles
 *    and verifies across named stages, and is pumped over time.
 */
export type WorkClass = 'fast' | 'long';

/** An immediate answer, produced without a production job. */
export interface QuickExplanation {
  kind: 'quick_explanation';
  need: TeachingNeed;
  /** The one-line-to-short answer the child hears now. */
  text: string;
  /** An approved visual to show with it, when one exists. */
  media?: EducationalMediaItem;
  /** Which approved source answered it. */
  source: string;
  /** Always true for this shape; kept explicit so callers can branch on it. */
  immediate: true;
}

export type JobStatus = 'queued' | 'running' | 'complete' | 'failed';

export type JobStageName =
  | 'understand'
  | 'reuse'
  | 'generate'
  | 'assemble'
  | 'verify';

export interface JobStage {
  name: JobStageName;
  status: 'pending' | 'active' | 'done';
  /** One line describing what this stage did, filled in as it runs. */
  detail?: string;
}

/** A longer lesson-production job, advanced stage by stage. */
export interface LessonProductionJob {
  kind: 'lesson_production';
  id: string;
  status: JobStatus;
  need: TeachingNeed;
  stages: JobStage[];
  /** 0..1, from completed stages. */
  progress: number;
  resolution?: AssetResolution;
  experience?: TeachingExperience;
  /** Populated only when status is 'failed'. */
  error?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── 4. The assembled teaching experience ────────────────────────────────────

/** The four movements of a lesson: teach, assess, adapt. */
export type ExperiencePhase = 'dialogue' | 'practice' | 'verification' | 'next_step';

export interface ExperienceLine {
  role: AssetRole;
  text: string;
  origin: AssetOrigin;
  reuseKey?: string;
}

export interface ExperiencePhaseContent {
  phase: ExperiencePhase;
  /** What this movement is for, in the child's language. */
  purpose: string;
  lines: ExperienceLine[];
  /** Practice options, when the phase asks a question. */
  options?: { text: string; isCorrect: boolean }[];
}

/** A dynamically assembled teaching experience. */
export interface TeachingExperience {
  need: TeachingNeed;
  title: string;
  phases: ExperiencePhaseContent[];
  /** Approved media to render alongside the experience. */
  media: EducationalMediaItem[];
  resolution: AssetResolution;
  /** Roles that still need generation; empty means the experience is complete. */
  pendingGeneration: AssetRole[];
  /** True when the experience leans on generated material rather than reuse. */
  usedGeneration: boolean;
}

// ─── 5. The engine's answer to an ask ────────────────────────────────────────

export type AskResult =
  | QuickExplanation
  | LessonProductionJob;

// ─── 6. Presenting and assessing an experience ───────────────────────────────

/**
 * A phase made render-ready for the UI: always present (in order), so the
 * interface renders a fixed structure instead of guessing which movement came
 * back from the assembler.
 */
export interface PresentedPhase {
  phase: ExperiencePhase;
  purpose: string;
  lines: ExperienceLine[];
  options?: { text: string; isCorrect: boolean }[];
}

/** The render-ready view of a `TeachingExperience`. */
export interface ExperiencePresentation {
  title: string;
  phases: PresentedPhase[];
  media: EducationalMediaItem[];
  conceptId: string | null;
  lessonId: string | null;
  usedGeneration: boolean;
  pendingGeneration: AssetRole[];
  reuseRatio: number;
}

/** The outcome of assessing one practice answer. */
export interface AssessmentResult {
  outcome: 'correct' | 'wrong';
  correctness: 'full' | 'partial' | 'wrong';
  feedback: string;
  /** The concept remediation, when a wrong answer matched a known misconception. */
  remediation?: string;
  /** The concept this is evidence for, or null when the ask matched no concept. */
  conceptId: string | null;
  modality: 'practice' | 'verification';
  /** 0..1 */
  score: number;
  correctOptionIndex?: number;
}

/** The outcome of an "explain it back" verification. */
export interface VerificationAssessment {
  quality: 'sound' | 'partial' | 'guessing' | 'unclear';
  correctness: 'full' | 'partial' | 'wrong';
  feedback: string;
  score: number;
  conceptId: string | null;
}

/** Context the engine may use to adapt the "next learning step". */
export interface AssemblyContext {
  studentName?: string;
  /** Current mastery 0..1 for the matched concept, when known. */
  masteryScore?: number;
  /** Preferred reading language, overriding detection when set. */
  language?: Language;
}
