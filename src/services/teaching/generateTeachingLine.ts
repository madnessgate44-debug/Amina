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
 * This helper asks the model to say the same turn in real teaching language,
 * grounded in the same curriculum text. If the model cannot answer, the
 * engine's own line is used unchanged, so the session never goes silent and
 * never loses its curriculum grounding.
 */

import { Language, AddressForm } from '../../types';
import { OfficialCurriculumLesson, CurriculumLessonConcept, TutorTurn } from '../../types/teachingSession';

export interface GenerateTeachingLineParams {
  engineTurn: TutorTurn;
  studentInput: string;
  concept: CurriculumLessonConcept;
  lesson: OfficialCurriculumLesson;
  studentName: string;
  addressForm: AddressForm;
  language: Language;
}

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

export async function generateTeachingLine(params: GenerateTeachingLineParams): Promise<string> {
  const { engineTurn, studentInput, concept, lesson, studentName, addressForm, language } = params;
  const fallback = engineTurn.text;

  try {
    const resp = await fetch('/api/teach-turn', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentInput,
        lessonTitle: language === 'ar' ? lesson.titleAr : lesson.titleEn,
        subjectName: language === 'ar' ? lesson.subjectNameAr : lesson.subjectNameEn,
        conceptTitle: language === 'ar' ? concept.titleAr : concept.titleEn,
        lessonText: curriculumTextFor(concept, lesson, language),
        step: engineTurn.step,
        studentName,
        addressForm,
        language,
        fallbackLine: fallback,
      }),
    });
    if (!resp.ok) return fallback;
    const data = await resp.json();
    const text = typeof data?.text === 'string' ? data.text.trim() : '';
    return text || fallback;
  } catch {
    return fallback;
  }
}
