/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Building the spoken lesson narration.
 *
 * Miss Noor must teach the whole lesson out loud before the child is asked any
 * question. The screen already holds the explanation text, but only the short
 * speech bubble was ever voiced, so the child reached the quiz without being
 * taught. This module turns the explanation segments into a queue of short
 * utterances, each small enough for the /api/tts endpoint (which trims long
 * input), so the full explanation is actually heard.
 *
 * Kept free of the DOM so it can be unit tested directly.
 */

/** The server trims TTS input; stay under it so no sentence is lost. */
export const MAX_TTS_CHARS = 450;

export interface LessonExplanationSegments {
  hook: string;
  chalkboard: string;
  analogy: string;
  discussion?: string;
}

/**
 * Split one explanation block into utterance-sized pieces, breaking at sentence
 * ends so a cut never lands mid-word. A single sentence longer than the limit is
 * hard-split as a last resort.
 */
export function splitForSpeech(text: string, maxChars: number = MAX_TTS_CHARS): string[] {
  const clean = (text || '').replace(/\s+/g, ' ').trim();
  if (!clean) return [];
  if (clean.length <= maxChars) return [clean];

  const sentences = clean.match(/[^.!?؟]+[.!?؟]+|[^.!?؟]+$/g) || [clean];
  const out: string[] = [];
  let buffer = '';

  const flush = () => {
    if (buffer.trim()) out.push(buffer.trim());
    buffer = '';
  };

  for (const raw of sentences) {
    const sentence = raw.trim();
    if (!sentence) continue;
    const joined = buffer ? `${buffer} ${sentence}` : sentence;
    if (joined.length > maxChars && buffer) {
      flush();
      buffer = sentence;
    } else {
      buffer = joined;
    }
    // A single sentence can still exceed the limit; split it in place.
    while (buffer.length > maxChars) {
      out.push(buffer.slice(0, maxChars).trim());
      buffer = buffer.slice(maxChars).trim();
    }
  }
  flush();
  return out;
}

/**
 * The teaching narration, in the order a child should hear it: a hook to create
 * interest, the core explanation, then a real-world analogy. The discussion
 * prompt is deliberately excluded — it is a question, and questions come after
 * the teaching.
 */
export function buildTeachingNarration(explanations: LessonExplanationSegments): string[] {
  const ordered = [explanations.hook, explanations.chalkboard, explanations.analogy];
  const queue: string[] = [];
  for (const segment of ordered) {
    queue.push(...splitForSpeech(segment));
  }
  return queue;
}
