/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * The visual a reel shows.
 *
 * The reel was text-only: a hook, a line, and buttons. The audit measured the
 * media count inside a reel at 0 image / 0 video / 0 audio / 0 canvas, which is
 * why the feed reads as static next to Instagram or TikTok.
 *
 * This module derives a visual *model* from the reel's own curriculum text, in
 * one deterministic function that holds no DOM and no React, so it can be
 * tested directly. `ReelVisual.tsx` draws that model as inline SVG: no network,
 * no image asset, no new dependency.
 *
 * Nothing is invented. Every label the visual draws is a substring of the reel
 * (its hook, its `show` line, its Noor line, or one of its answer options), and
 * the number line only marks numbers that literally appear in that text.
 */

import { Reel } from '../../types/reel';
import { StructuredVisualType } from '../../types/teachingSession';

export type ReelVisualKind = StructuredVisualType;

export interface ReelVisualMark {
  label: string;
  value: number;
}

export interface ReelVisualModel {
  kind: ReelVisualKind;
  title: string;
  caption: string;
  /** Short labels the SVG places around the drawing. Never empty. */
  nodes: string[];
  /** Present only for `number_line`. */
  marks?: ReelVisualMark[];
  sourceLabel: string;
}

const MAX_NODES = 4;
const MAX_LABEL_CHARS = 28;

/** Trim a label to something a phone can draw without overflow. */
function clip(text: string): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= MAX_LABEL_CHARS) return clean;
  return `${clean.slice(0, MAX_LABEL_CHARS - 1).trimEnd()}…`;
}

/**
 * Pull up to `MAX_NODES` short labels out of a passage. Sentence fragments are
 * preferred; a fragment is only kept when it carries more than one word, so a
 * stray punctuation mark never becomes a node.
 */
function labelsFrom(text: string): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const raw of text.split(/[.;:!?،؛\n\u2026]+/)) {
    const phrase = clip(raw);
    if (phrase.split(' ').filter(Boolean).length < 2) continue;
    const key = phrase.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(phrase);
    if (out.length >= MAX_NODES) break;
  }
  return out;
}

/**
 * Numbers written in the reel text, in order of appearance, normalised so the
 * Arabic decimal separator and the comma both read as a decimal point.
 */
function numbersFrom(text: string): ReelVisualMark[] {
  const out: ReelVisualMark[] = [];
  const seen = new Set<number>();
  const re = /\d+(?:[.,٫]\d+)?/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) {
    const value = Number(match[0].replace(/[٫,]/, '.'));
    if (!Number.isFinite(value)) continue;
    if (seen.has(value)) continue;
    seen.add(value);
    out.push({ label: match[0], value });
    if (out.length >= 5) break;
  }
  return out;
}

/**
 * Builds the visual model for one reel.
 *
 * Kind selection, in order:
 *  1. a question reel becomes a `concept_map` of its options, so the child sees
 *     the choices laid out rather than only as buttons;
 *  2. a reel carrying at least two real numbers becomes a `number_line`;
 *  3. otherwise the concept's own `visualType` is honoured;
 *  4. otherwise a `diagram`.
 */
export function buildReelVisualModel(reel: Reel, isAr: boolean): ReelVisualModel {
  const text = [reel.hook, reel.show, reel.noorLine].filter(Boolean).join('. ');
  const marks = numbersFrom(text);

  let kind: ReelVisualKind;
  let nodes: string[];

  if (reel.options && reel.options.length >= 2) {
    kind = 'concept_map';
    nodes = reel.options.slice(0, MAX_NODES).map((o) => clip(o.text));
  } else if (marks.length >= 2) {
    kind = 'number_line';
    nodes = [];
  } else {
    kind = reel.visualType || 'diagram';
    nodes = labelsFrom(text);
    // A declared number line is only drawable when the reel actually mentions
    // two numbers; otherwise the axis would be empty, so fall back to a diagram.
    if (kind === 'number_line' && marks.length < 2) {
      kind = 'diagram';
      nodes = labelsFrom(text);
    }
  }

  if (nodes.length === 0 && kind !== 'number_line') {
    nodes = [clip(reel.show || reel.hook || reel.subjectName)];
  }

  return {
    kind,
    title: clip(reel.hook),
    caption: clip(reel.show || reel.noorLine),
    nodes,
    marks: kind === 'number_line' ? marks : undefined,
    sourceLabel: reel.sourceLabel,
  };
}

/** True when the model has something real to draw. Used by the test suite. */
export function isDrawableReelVisual(model: ReelVisualModel): boolean {
  if (!model.title) return false;
  if (model.kind === 'number_line') return Boolean(model.marks && model.marks.length >= 2);
  return model.nodes.length > 0 && model.nodes.every((n) => n.trim().length > 0);
}

export const REEL_VISUAL_LABEL: Record<ReelVisualKind, { ar: string; en: string; fr: string }> = {
  diagram: { ar: 'رسم توضيحي', en: 'Diagram', fr: 'Schéma' },
  timeline: { ar: 'خط زمني', en: 'Timeline', fr: 'Chronologie' },
  map_like: { ar: 'خريطة', en: 'Map', fr: 'Carte' },
  number_line: { ar: 'خط الأعداد', en: 'Number line', fr: 'Droite graduée' },
  concept_map: { ar: 'خريطة أفكار', en: 'Concept map', fr: 'Carte mentale' },
  stroke_guide: { ar: 'دليل الكتابة', en: 'Stroke guide', fr: 'Guide de tracé' },
  comparison_table: { ar: 'مقارنة', en: 'Comparison', fr: 'Comparaison' },
};
