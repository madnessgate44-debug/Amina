/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Turns a tutor reply into practice cards for "Train me".
 *
 * The model is asked to answer with "A:"-prefixed lines, but replies vary, so a
 * reply that does not parse still yields one usable card rather than none.
 */

export interface ParsedCard {
  question: string;
  answer: string;
}

const ANSWER_PREFIX = /^(?:ج|A)\s*[:：]\s*/i;
const QUESTION_PREFIX = /^(?:\d+[.)\-]|[-*•])\s*/;

export function parseTrainingCards(text: string): ParsedCard[] {
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  const out: ParsedCard[] = [];
  let current: ParsedCard | null = null;

  const flush = () => {
    if (current && current.question) out.push(current);
    current = null;
  };

  for (const line of lines) {
    if (ANSWER_PREFIX.test(line)) {
      const answer = line.replace(ANSWER_PREFIX, '').trim();
      if (current) {
        current.answer = answer;
        flush();
      }
      continue;
    }
    if (current) {
      // A question with no explicit answer line: keep what followed as answer.
      current.answer = current.answer ? `${current.answer} ${line}` : line;
      flush();
    }
    current = { question: line.replace(QUESTION_PREFIX, '').trim(), answer: '' };
  }
  flush();

  return out;
}
