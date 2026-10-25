/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FlatCurriculumConcept, Language } from '../../types';
import { curriculumService } from '../curriculum/curriculumService';
import { OfficialCurriculumLesson } from '../../types/teachingSession';
import { mulberry32, shuffle } from '../onboarding/warmupService';
import { hashSeed } from '../reels/seededRng';

export interface ReelScene {
  phase: 'hook' | 'explanation' | 'example' | 'quick_check';
  titleAr: string;
  titleEn: string;
  badgeAr: string;
  badgeEn: string;
  contentAr: string;
  contentEn: string;
  visualCue?: string; // Icon or key visual description
  durationSeconds: number;
}

export interface LearningReelContent {
  conceptId: string;
  conceptNameAr: string;
  conceptNameEn: string;
  subjectId: string;
  originTag: string; // e.g. "ai_explanation" from "demo" concept
  scenes: ReelScene[];
  quickCheck: {
    questionAr: string;
    questionEn: string;
    optionsAr: string[];
    optionsEn: string[];
    correctIndex: number;
    explanationAr: string;
    explanationEn: string;
  };
}

export interface QuizQuestion {
  id: string;
  conceptId: string;
  type: 'mcq' | 'true_false' | 'short_answer';
  difficulty: number; // 0.2 easy, 0.5 medium, 0.85 hard
  promptAr: string;
  promptEn: string;
  optionsAr?: string[];
  optionsEn?: string[];
  correctAnswer: string | number; // index or text
  hintAr: string;
  hintEn: string;
  explanationAr: string;
  explanationEn: string;
}

/**
 * Builds deterministic, pedagogically structured Short Learning Reel content
 * strictly from the seeded demo curriculum concepts (never fabricated).
 */
export function getReelForConcept(conceptId: string): LearningReelContent | null {
  const flatConcepts = curriculumService.getFlatConcepts();
  const concept = flatConcepts.find((c) => c.id === conceptId);
  if (!concept) return null;

  const isMath = concept.subjectId === 'subj_math';
  const isScience = concept.subjectId === 'subj_science';
  const isArabic = concept.subjectId === 'subj_arabic';

  return {
    conceptId: concept.id,
    conceptNameAr: concept.nameAr,
    conceptNameEn: concept.nameEn,
    subjectId: concept.subjectId,
    originTag: 'ai_explanation (from demo curriculum)',
    scenes: [
      {
        phase: 'hook',
        titleAr: 'مقدمة خاطفة: لماذا يهمنا هذا المفهوم؟',
        titleEn: 'Visual Hook: Why this matters',
        badgeAr: 'المشهد ١ • التشويق',
        badgeEn: 'Scene 1 • Hook',
        contentAr: `هل تساءلت يوماً كيف نستعمل «${concept.nameAr}» في حياتنا اليومية دون أن نشعر؟ كل لغز علمي أو مسألة رياضية لها سر بداية بسيط يفكك كل التعقيد!`,
        contentEn: `Ever wondered how "${concept.nameEn}" quietly powers our everyday choices? Every complex topic has a simple spark that unlocks everything!`,
        visualCue: isMath ? '🔢' : isScience ? '🔬' : '📖',
        durationSeconds: 15,
      },
      {
        phase: 'explanation',
        titleAr: 'الشرح الجوهري المركز',
        titleEn: 'Core Clear Explanation',
        badgeAr: 'المشهد ٢ • الشرح',
        badgeEn: 'Scene 2 • Core Explanation',
        contentAr: `${concept.descriptionAr}. تذكر دائماً: القاعدة لا تعتمد على الحفظ الصامت، بل على فهم العلاقة بين كل جزء والآخر بخطوة منظمة.`,
        contentEn: `${concept.descriptionEn}. Remember: true learning isn't blind memorization, it is grasping how pieces fit together sequentially.`,
        visualCue: '💡',
        durationSeconds: 30,
      },
      {
        phase: 'example',
        titleAr: 'مثال واقعي وتطبيقي',
        titleEn: 'Practical Applied Example',
        badgeAr: 'المشهد ٣ • المثال',
        badgeEn: 'Scene 3 • Practical Example',
        contentAr: `تعال نرى نموذجاً عملياً: عندما نطبق فكرة «${concept.nameAr}»، نبدأ أولاً برصد المعطى الأساسي، ثم ننفذ الخطوة التحليلية الأولى لنصل للنتيجة الصحيحة بثقة تامة.`,
        contentEn: `Let's see it in action: when applying "${concept.nameEn}", identify the starting condition first, then take the decisive step to reach the outcome confidently.`,
        visualCue: '🎯',
        durationSeconds: 25,
      },
      {
        phase: 'quick_check',
        titleAr: 'فحص الاستيعاب السريع (Quick Check)',
        titleEn: 'Quick Comprehension Check',
        badgeAr: 'المشهد ٤ • فحص الفهم',
        badgeEn: 'Scene 4 • Quick Check',
        contentAr: `الآن دورك يا بطل! لنتأكد من استيعابك للمفهوم في سؤال خاطف مدته نصف دقيقة:`,
        contentEn: `Your turn now! Let's verify your understanding with a quick 30-second check:`,
        visualCue: '⚡',
        durationSeconds: 20,
      },
    ],
    quickCheck: buildQuickCheck(conceptId),
  };
}

/**
 * Real questions, drawn from the lesson's own textbook exercises.
 *
 * This replaces a generator that produced questions such as "Does the concept
 * of X rely on structured comprehension rather than random memorization?" with
 * the only sensible answer first. Those tested nothing about the subject, and
 * 48 of the 54 answers in the raw curriculum data sit at option A, so a child
 * could score full marks by always tapping the first choice. Options are now
 * shuffled with a seed derived from the concept id: stable for a given concept,
 * but no longer positionally predictable.
 */
interface RealQuestion {
  prompt: string;
  options: string[];
  correctIndex: number;
  page?: number | string;
  book: string;
}

function lessonBook(lesson: OfficialCurriculumLesson): string {
  return lesson.sourceRef?.bookAr || lesson.sourceRef?.book || '';
}

/**
 * Turns textbook exercises into fair tap-one-answer questions. An exercise is
 * skipped unless its expected answer appears exactly once among the options.
 */
export function realQuestionsForLesson(lessonId: string, seed: string): RealQuestion[] {
  const lesson = curriculumService.getLessonById(lessonId);
  if (!lesson) return [];
  const rand = mulberry32(hashSeed(seed));
  const book = lessonBook(lesson);
  const out: RealQuestion[] = [];

  for (const ex of lesson.exercises || []) {
    if (ex.type !== 'multiple_choice') continue;
    const opts = ex.options;
    if (!opts || opts.length < 2) continue;
    if (ex.expectedAnswer === undefined || ex.expectedAnswer === null) continue;

    const expected = String(ex.expectedAnswer).trim();
    if (opts.filter((o) => String(o).trim() === expected).length !== 1) continue;

    const shuffled = shuffle(opts.map((o) => String(o)), rand);
    const correctIndex = shuffled.findIndex((o) => o.trim() === expected);
    if (correctIndex < 0) continue;

    out.push({ prompt: ex.question, options: shuffled, correctIndex, page: ex.page, book });
  }
  return out;
}

/** A vocabulary question built from the lesson's own word list. */
function vocabQuestionForLesson(lesson: OfficialCurriculumLesson, rand: () => number): RealQuestion | null {
  const vocab = (lesson.vocabulary || []).filter((v) => v.word && v.definition);
  if (vocab.length < 3) return null;

  const target = vocab[0];
  const others = vocab.filter((v) => v.word !== target.word).slice(0, 2);
  if (others.length < 2) return null;

  const options = shuffle([target.definition, ...others.map((o) => o.definition)], rand);
  return {
    prompt: `ما معنى كلمة «${target.word}»؟`,
    options,
    correctIndex: options.findIndex((o) => o === target.definition),
    page: lesson.sourceRef?.page,
    book: lessonBook(lesson),
  };
}

/** Last resort: a true/false statement taken verbatim from a lesson objective. */
function objectiveQuestionForLesson(lesson: OfficialCurriculumLesson, rand: () => number): RealQuestion | null {
  const objective = (lesson.objectives || []).find((o) => o && o.trim());
  if (!objective) return null;

  const labels = shuffle(['صحيح', 'خطأ'], rand);
  return {
    prompt: `هل هذا هدف من أهداف درس «${lesson.titleAr}»؟ «${objective}»`,
    options: labels,
    correctIndex: labels.indexOf('صحيح'),
    page: lesson.sourceRef?.page,
    book: lessonBook(lesson),
  };
}

/** Builds every real question available for a lesson, most authentic first. */
export function realQuestionsForConcept(conceptId: string): RealQuestion[] {
  const concept = curriculumService.getFlatConcepts().find((c) => c.id === conceptId);
  if (!concept) return [];

  const rand = mulberry32(hashSeed(conceptId));
  const exercises = realQuestionsForLesson(concept.lessonId, conceptId);
  if (exercises.length > 0) return exercises;

  const lesson = curriculumService.getLessonById(concept.lessonId);
  if (!lesson) return [];

  const vocab = vocabQuestionForLesson(lesson, rand);
  if (vocab) return [vocab];

  const objective = objectiveQuestionForLesson(lesson, rand);
  return objective ? [objective] : [];
}

function buildQuickCheck(conceptId: string): LearningReelContent['quickCheck'] {
  const questions = realQuestionsForConcept(conceptId);
  if (questions.length === 0) {
    // Should not happen: every lesson carries exercises, vocabulary or objectives.
    return {
      questionAr: 'لم يتم العثور على سؤال من كتاب الوزارة لهذا المفهوم.',
      questionEn: 'No textbook question was found for this concept.',
      optionsAr: ['حسناً'],
      optionsEn: ['OK'],
      correctIndex: 0,
      explanationAr: '',
      explanationEn: '',
    };
  }

  const q = questions[0];
  const answer = q.options[q.correctIndex];
  return {
    questionAr: q.prompt,
    questionEn: q.prompt,
    optionsAr: q.options,
    optionsEn: q.options,
    correctIndex: q.correctIndex,
    explanationAr: `الإجابة الصحيحة: «${answer}»${q.page ? ` (${q.book} ص. ${q.page})` : ''}.`,
    explanationEn: `The correct answer: "${answer}"${q.page ? ` (${q.book} p. ${q.page})` : ''}.`,
  };
}

/**
 * Adaptive quiz questions for a concept, taken from that lesson's real textbook
 * exercises. Returns an empty array when a concept has no usable question, which
 * the UI already reports honestly rather than showing invented content.
 */
export function getQuizQuestionsForConcept(
  conceptId: string,
  currentMasteryScore: number = 0.5
): QuizQuestion[] {
  const concept = curriculumService.getFlatConcepts().find((c) => c.id === conceptId);
  if (!concept) return [];

  const real = realQuestionsForConcept(conceptId);
  if (real.length === 0) return [];

  // Difficulty rises across the questions so the adaptive label stays meaningful.
  const tiers = [0.3, 0.55, 0.8];

  return real.slice(0, 3).map((q, i) => {
    const answer = q.options[q.correctIndex];
    const pageRef = q.page ? ` ص. ${q.page}` : '';
    return {
      id: `q_${concept.id}_${i + 1}`,
      conceptId: concept.id,
      type: 'mcq' as const,
      difficulty: tiers[i] ?? 0.6,
      promptAr: q.prompt,
      promptEn: q.prompt,
      optionsAr: q.options,
      optionsEn: q.options,
      correctAnswer: q.correctIndex,
      hintAr: `راجع ${q.book}${pageRef}.`,
      hintEn: `Check ${q.book}${q.page ? ` p. ${q.page}` : ''}.`,
      explanationAr: `الإجابة الصحيحة: «${answer}»${pageRef}.`,
      explanationEn: `The correct answer: "${answer}"${q.page ? ` (p. ${q.page})` : ''}.`,
    };
  });
}
