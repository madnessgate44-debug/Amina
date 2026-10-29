/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Turns an engine decision into the words Miss Noor actually says.
 *
 * The teaching session engine (src/services/teaching/teachingSession.ts) owns
 * the pedagogy: which step comes next, whether an answer is sound, and what
 * mastery evidence to record. It writes its own deterministic line for every
 * turn. That line is grounded in the curriculum but reads like a template.
 *
 * There are two kinds of turn, and they are handled differently on purpose:
 *
 *  1. FIXED turns (greet / teach / ask). The opening, the layered explanation
 *     and the check question are the same for every child. They are generated
 *     once into `preGeneratedNoorLines.ts` and served from that data, so they
 *     cost ZERO quota at runtime and work even with the model fully down.
 *
 *  2. FREE-FORM turns (adjust / explain_back / celebrate / close). These must
 *     react to what THIS child said, so they are the only turns that spend a
 *     live model call. The last few turns ride along as context.
 *
 * If a live call cannot answer, the pre-generated line (or the engine's own
 * line) is used and `degraded` is set, so the UI can say the teacher is offline
 * instead of silently showing a canned sentence.
 */

import { Language, AddressForm } from '../../types';
import { OfficialCurriculumLesson, CurriculumLessonConcept, TutorTurn } from '../../types/teachingSession';
import { getPreGeneratedLine, PreGeneratedSlot } from '../../data/curriculum/preGeneratedNoorLines';

export interface GenerateTeachingLineParams {
  engineTurn: TutorTurn;
  studentInput: string;
  concept: CurriculumLessonConcept;
  conceptIndex: number;
  lesson: OfficialCurriculumLesson;
  studentName: string;
  addressForm: AddressForm;
  language: Language;
  /** The last few turns, oldest first. Context for a free-form reply. */
  history?: TutorTurn[];
}

export interface TeachingLineResult {
  text: string;
  /** True when every live model call failed and a stored line was served. */
  degraded: boolean;
  source: 'pre_generated' | 'gemini' | 'engine_fallback';
}

/** How many prior turns to send as context. */
export const TEACHING_HISTORY_TURNS = 6;

/**
 * Which fixed line, if any, answers a step without a model call.
 * The remaining steps depend on the child's answer and must be live.
 */
const FIXED_SLOT_FOR_STEP: Partial<Record<TutorTurn['step'], PreGeneratedSlot>> = {
  greet: 'intro',
  teach: 'explanation',
  ask: 'check',
};

/** The step's real curriculum text, so the model answers from the lesson, not thin air. */
function curriculumTextFor(concept: CurriculumLessonConcept, lesson: OfficialCurriculumLesson, language: Language): string {
  const conceptTitle = language === 'ar' ? concept.titleAr : concept.titleEn;
  const source = concept.sourceText || '';
  const keyPoints = (concept.keyPoints || []).join(' | ');
  const example = language === 'ar' ? concept.dailyLifeExampleAr : concept.dailyLifeExampleEn;
  const analogy = language === 'ar' ? concept.storyAnalogyAr : concept.storyAnalogyEn;
  return [
    `Lesson: ${language === 'ar' ? lesson.titleAr : lesson.titleEn}`,
    `Concept: ${conceptTitle}`,
    source ? `Textbook text: ${source}` : '',
    keyPoints ? `Key points: ${keyPoints}` : '',
    example ? `Everyday example: ${example}` : '',
    analogy ? `Analogy: ${analogy}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

export async function generateTeachingLine(params: GenerateTeachingLineParams): Promise<TeachingLineResult> {
  const { engineTurn, studentInput, concept, conceptIndex, lesson, studentName, addressForm, language, history } = params;
  const fallback = engineTurn.text;

  // Fixed turn: serve the pre-generated line. No model call, no quota, works offline.
  const slot = FIXED_SLOT_FOR_STEP[engineTurn.step];
  if (slot) {
    const stored = getPreGeneratedLine(language, lesson.id, conceptIndex, slot);
    if (stored) return { text: stored, degraded: false, source: 'pre_generated' };
  }

  const trimmedHistory = (history || [])
    .slice(-TEACHING_HISTORY_TURNS)
    .map((t) => ({ role: t.role, text: t.text.slice(0, 300) }));

  try {
    const resp = await fetch('/api/teach-turn', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentInput,
        lessonId: lesson.id,
        conceptIndex,
        lessonTitle: language === 'ar' ? lesson.titleAr : lesson.titleEn,
        subjectName: language === 'ar' ? lesson.subjectNameAr : lesson.subjectNameEn,
        conceptTitle: language === 'ar' ? concept.titleAr : concept.titleEn,
        lessonText: curriculumTextFor(concept, lesson, language),
        step: engineTurn.step,
        studentName,
        addressForm,
        language,
        history: trimmedHistory,
        fallbackLine: fallback,
      }),
    });
    if (!resp.ok) {
      const stored = slot ? getPreGeneratedLine(language, lesson.id, conceptIndex, slot) : null;
      return { text: stored || fallback, degraded: true, source: stored ? 'pre_generated' : 'engine_fallback' };
    }
    const data = await resp.json();
    const text = typeof data?.text === 'string' ? data.text.trim() : '';
    const degraded = Boolean(data?.degraded);
    const source = data?.source === 'gemini' ? 'gemini' : degraded ? 'engine_fallback' : 'gemini';
    return { text: text || fallback, degraded, source };
  } catch {
    const stored = slot ? getPreGeneratedLine(language, lesson.id, conceptIndex, slot) : null;
    return { text: stored || fallback, degraded: true, source: stored ? 'pre_generated' : 'engine_fallback' };
  }
}
