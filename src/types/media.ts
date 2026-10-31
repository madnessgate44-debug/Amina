/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * The educational media contract.
 *
 * The feed's only substantive visual used to be a canvas drawn from the reel's
 * text. This module defines the reusable contract every real media item (image,
 * diagram, animation, video, narration, interactive) satisfies, so the feed can
 * render media *by type* instead of a custom implementation per lesson.
 *
 * Nothing here is decorative: each item carries its curriculum reference, the
 * educational purpose it serves, its accessibility text, and its provenance.
 */

import { Language } from './index';
import { ReelKind } from './reel';

/** The four media families the feed can render. */
export type MediaType = 'image' | 'video' | 'audio' | 'interactive';

export type ImageKind =
  | 'diagram'
  | 'illustration'
  | 'photograph'
  | 'chart'
  | 'map'
  | 'number_line'
  | 'concept_map';

export type VideoKind = 'animation' | 'demonstration' | 'explanation';

export type AudioKind = 'narration' | 'pronunciation' | 'listening';

export type InteractiveKind = 'interactive_diagram' | 'manipulable' | 'visual_experiment';

export type MediaKind = ImageKind | VideoKind | AudioKind | InteractiveKind;

/** A string that exists in every language the app teaches. */
export interface LocalizedText {
  ar: string;
  en: string;
  fr?: string;
}

/** Visual identity of an asset, so the feed stays recognisably Miss Noor. */
export interface MediaBranding {
  /** Design-system palette the asset is drawn from. */
  palette: 'noor-core' | 'science' | 'math' | 'language';
  /** Watermark drawn into the asset, when one exists. */
  watermark?: LocalizedText;
}

/** Where the asset came from and under what rights. */
export interface MediaSource {
  /** How the asset came to exist. `generated` means an external model made it. */
  origin: 'authored_svg' | 'authored_audio' | 'authored_video' | 'generated';
  /** Human-readable author. */
  author: string;
  /** Licence or rights statement. */
  license: string;
  /** Content provenance, for traceability to the curriculum. */
  attribution: string;
}

/** Quality-review state. Media may not ship as `approved` without review. */
export interface MediaReview {
  status: 'draft' | 'reviewed' | 'approved';
  reviewedBy?: string;
  reviewedAt?: string;
  notes?: string;
}

/**
 * One numbered part of a diagram. The image carries only the number, so the
 * key can be read in the child's own language and stays correct in RTL/LTR.
 */
export interface MediaLegendEntry {
  n: number;
  text: LocalizedText;
}

/**
 * A tappable point on a diagram, in normalised coordinates (0..1 of the
 * image box). Any item that has a legend and hotspots becomes an interactive
 * diagram for free: tapping a hotspot reveals its legend entry. This is what
 * makes interactive media reusable across lessons instead of per-lesson code.
 */
export interface MediaHotspot {
  n: number;
  x: number;
  y: number;
}

/** Narration that can accompany any media item. */
export interface MediaNarration {
  /** The exact words spoken. */
  text: LocalizedText;
  /** Pre-generated audio file for the words, when one exists. */
  src?: string;
  /** Language the recorded audio is in. */
  language?: Language;
}

/** Playback configuration for timed media. */
export interface MediaPlayback {
  loop?: boolean;
  /** Autoplay is only honoured for muted media. */
  autoplay?: boolean;
  muted?: boolean;
  controls?: boolean;
  /** Still frame shown before playback, and used as the reduced-motion fallback. */
  poster?: string;
  /** What to show when the user prefers reduced motion. */
  reducedMotionFallback?: 'poster' | 'hide';
}

/** One educational media item, addressed by lesson + concept. */
export interface EducationalMediaItem {
  id: string;
  type: MediaType;
  kind: MediaKind;
  /** Lesson and concept association. */
  lessonId: string;
  conceptId: string;
  subjectId: string;
  /** Reel kind this media belongs to, when it is reel-specific. */
  reelKind?: ReelKind;
  /** Curriculum provenance, e.g. "Science Ministry Book pp. 10-18". */
  curriculumRef: string;
  /** Asset location, relative to the site root (e.g. "media/science/x.png"). */
  src: string;
  /** Alternate asset used if `src` fails to load (e.g. the vector source). */
  fallbackSrc?: string;
  /** MIME type of `src`. */
  mimeType: string;
  /** Intrinsic dimensions, for layout stability. */
  width?: number;
  height?: number;
  /** What the media shows, for the UI caption. */
  title: LocalizedText;
  /** The educational purpose: what this teaches. */
  purpose: LocalizedText;
  /** Accessibility text (alt / aria-label). */
  alt: LocalizedText;
  /** Numbered key for diagrams that use numeric callouts. */
  legend?: MediaLegendEntry[];
  /** Tappable points on the diagram, when it is interactive. */
  hotspots?: MediaHotspot[];
  /** Narration associated with this media. */
  narration?: MediaNarration;
  /** How long the media is shown, when it is timed. */
  displayDurationMs?: number;
  playback?: MediaPlayback;
  branding: MediaBranding;
  source: MediaSource;
  review: MediaReview;
}

/** Pick a localized string, falling back to Arabic when a language is absent. */
export function localized(text: LocalizedText, language: Language): string {
  if (language === 'fr') return text.fr || text.en || text.ar;
  if (language === 'en') return text.en || text.ar;
  return text.ar || text.en;
}
