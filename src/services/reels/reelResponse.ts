/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Turns a reel answer into what Miss Noor says next.
 *
 * A reel used to end at "correct" or "wrong": the child tapped, saw a fixed
 * line, and the reel moved on. That is a quiz, not a teacher.
 *
 * This service makes the reel respond to the answer the child actually gave:
 *
 *  1. The engine diagnoses first. If the wrong option matches a known
 *     misconception, `matchMisconception` names it and supplies the reframing
 *     from curriculum data. This is deterministic and costs no quota.
 *  2. Only when the answer is wrong AND no misconception is on file does it ask
 *     the model to react to the child's own words. That keeps live calls rare.
 *  3. If the model cannot answer, the curriculum remediation (or the reel's own
 *     line) is used and `degraded` is set, so the card can say the teacher is
 *     offline instead of pretending.
 *
 * A correct answer never costs a call: the reel already has a praise line.
 */

import { Reel } from '../../types/reel';
import { Language } from '../../types';
import { curriculumService } from '../curriculum/curriculumService';
import { matchMisconception } from '../teaching/skills/teachingSkills';

export interface ReelResponseResult {
  /** What Miss Noor says after the answer. */
  text: string;
  /** True when a known misconception was named and cleared. */
  namedMisconception: boolean;
  /** True when the live model could not answer and a stored line was served. */
  degraded: boolean;
  source: 'misconception' | 'gemini' | 'reel_line';
}

export interface ResolveReelResponseParams {
  reel: Reel;
  /** The option text the child tapped. */
  answerText: string;
  correct: boolean;
  studentName?: string;
  addressForm?: string;
  language: Language;
  /** Forced failure, used by tests and the offline-teacher demo. */
  forceOffline?: boolean;
}

/** The wrong option the child chose, if the reel has options. */
function misconceptionForAnswer(reel: Reel, answerText: string) {
  const found = curriculumService.getConceptById(reel.conceptId);
  if (!found) return undefined;
  return matchMisconception(answerText, found.concept.misconceptions);
}

export async function resolveReelResponse(
  params: ResolveReelResponseParams
): Promise<ReelResponseResult> {
  const { reel, answerText, correct, studentName, addressForm, language, forceOffline } = params;

  if (correct) {
    return { text: reel.reactionCorrect, namedMisconception: false, degraded: false, source: 'reel_line' };
  }

  // Wrong answer: the engine diagnoses first, at zero quota.
  const misconception = misconceptionForAnswer(reel, answerText);
  if (misconception) {
    const named =
      language === 'ar'
        ? `لأ يا ${studentName || 'بطل'}، خلّينا نفهم إيه اللي حصل. ${misconception.explanation} ${misconception.remediation}`
        : `${misconception.explanation} ${misconception.remediation}`;
    return { text: named, namedMisconception: true, degraded: false, source: 'misconception' };
  }

  if (forceOffline) {
    return { text: reel.reactionWrong, namedMisconception: false, degraded: true, source: 'reel_line' };
  }

  // No known misconception: ask the model to react to this child's own words.
  const found = curriculumService.getConceptById(reel.conceptId);
  try {
    const resp = await fetch('/api/teach-turn', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentInput: answerText,
        lessonId: reel.lessonId,
        conceptIndex: found ? found.lesson.concepts.findIndex((c) => c.id === reel.conceptId) : 0,
        lessonTitle: reel.lessonTitle,
        subjectName: reel.subjectName,
        conceptTitle: reel.show,
        lessonText: found ? found.concept.sourceText : '',
        step: 'adjust',
        studentName,
        addressForm,
        language,
        fallbackLine: reel.reactionWrong,
      }),
    });
    if (!resp.ok) {
      return { text: reel.reactionWrong, namedMisconception: false, degraded: true, source: 'reel_line' };
    }
    const data = await resp.json();
    const text = typeof data?.text === 'string' ? data.text.trim() : '';
    return {
      text: text || reel.reactionWrong,
      namedMisconception: false,
      degraded: Boolean(data?.degraded),
      source: data?.source === 'gemini' ? 'gemini' : 'reel_line',
    };
  } catch {
    return { text: reel.reactionWrong, namedMisconception: false, degraded: true, source: 'reel_line' };
  }
}
