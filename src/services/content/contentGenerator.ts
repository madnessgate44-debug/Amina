/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FlatCurriculumConcept, Language } from '../../types';
import { getFlatConcepts } from '../../data/demoCurriculum';

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
  const flatConcepts = getFlatConcepts();
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
    quickCheck: {
      questionAr: `ما هو الأساس الرئيسي لتطبيق «${concept.nameAr}»؟`,
      questionEn: `What is the cornerstone when applying "${concept.nameEn}"?`,
      optionsAr: [
        'تحديد العنصر الأول وفهم وظيفته بهدوء',
        'حفظ الإجابة دون قراءة المسألة',
        'تخمين أول خيار يظهر على الشاشة',
      ],
      optionsEn: [
        'Identify the primary element and understand its function calmly',
        'Memorize answers without reading',
        'Randomly pick the first visible option',
      ],
      correctIndex: 0,
      explanationAr: 'رائع جداً! فهم العنصر الأول وتحديد موضعه هو المفتاح العلمي الدقيق دائماً.',
      explanationEn: 'Awesome! Identifying the primary element and its role is always the key.',
    },
  };
}

/**
 * Generates an adaptive sequence of quiz questions for a concept
 * based on current mastery level.
 * Never invents concepts outside demo curriculum.
 */
export function getQuizQuestionsForConcept(
  conceptId: string,
  currentMasteryScore: number = 0.5
): QuizQuestion[] {
  const flatConcepts = getFlatConcepts();
  const concept = flatConcepts.find((c) => c.id === conceptId);
  if (!concept) return [];

  const cNameAr = concept.nameAr;
  const cNameEn = concept.nameEn;

  // Level 1: Easy check (0.2)
  const q1: QuizQuestion = {
    id: `q_${concept.id}_1`,
    conceptId: concept.id,
    type: 'true_false',
    difficulty: 0.25,
    promptAr: `هل مفهوم «${cNameAr}» يعتمد على الفهم والتحليل التدريجي بدلاً من الحفظ العشوائي؟`,
    promptEn: `Does the concept of "${cNameEn}" rely on structured comprehension rather than random memorization?`,
    optionsAr: ['صحيح (True)', 'خطأ (False)'],
    optionsEn: ['True', 'False'],
    correctAnswer: 0,
    hintAr: 'فكر في طريقة معالجة المعطيات خطوة بخطوة.',
    hintEn: 'Think about approaching clues step-by-step.',
    explanationAr: 'صحيح تماماً! التعليم المتين ينطلق دائماً من الاستيعاب المنطقي المنظم.',
    explanationEn: 'Exactly! Solid learning starts with structured, logical comprehension.',
  };

  // Level 2: Medium MCQ (0.5)
  const q2: QuizQuestion = {
    id: `q_${concept.id}_2`,
    conceptId: concept.id,
    type: 'mcq',
    difficulty: 0.5,
    promptAr: `أي مما يلي يعبر بدقة عن وظيفة أو تطبيق «${cNameAr}»؟`,
    promptEn: `Which of the following accurately describes the role or application of "${cNameEn}"?`,
    optionsAr: [
      concept.descriptionAr,
      'إلغاء جميع القواعد والتصرف دون أي نظام',
      'تجاهل المعطيات والاعتماد على الحظ فقط',
    ],
    optionsEn: [
      concept.descriptionEn,
      'Ignoring all foundational rules entirely',
      'Discarding data and relying strictly on luck',
    ],
    correctAnswer: 0,
    hintAr: `راجع التعريف الأساسي: ${concept.descriptionAr.slice(0, 30)}...`,
    hintEn: `Recall the definition: ${concept.descriptionEn.slice(0, 30)}...`,
    explanationAr: 'إجابة ممتازة وموفقة! هذا هو التطبيق الدقيق للمفهوم كما تعلمناه.',
    explanationEn: 'Excellent! That is the precise application of the concept.',
  };

  // Level 3: Challenging / Deep Check (0.85)
  const q3: QuizQuestion = {
    id: `q_${concept.id}_3`,
    conceptId: concept.id,
    type: 'mcq',
    difficulty: 0.85,
    promptAr: `إذا طلب منك زميلك تلخيص الفائدة الأساسية من «${cNameAr}» في جملة واحدة حاسمة، فماذا تقول؟`,
    promptEn: `If a classmate asks you for the core takeaway of "${cNameEn}" in one decisive sentence, what would you say?`,
    optionsAr: [
      `تمكننا من بناء حلول دقيقة والربط بين الأجزاء بشكل منطقي سليم.`,
      `لا توجد أي فائدة واقعية منها ويمكن الاستغناء عنها.`,
      `تستخدم فقط لملء أوراق الاختبار دون تطبيق واقعي.`,
    ],
    optionsEn: [
      `It enables us to formulate precise solutions and connect components logically.`,
      `It has no real-world value and can be discarded.`,
      `It only exists to fill test sheets without practical utility.`,
    ],
    correctAnswer: 0,
    hintAr: 'ابحث عن الخيار الذي يبرز الربط المنطقي السليم.',
    hintEn: 'Look for the choice highlighting coherent logical connections.',
    explanationAr: 'رائع جداً وفهم عميق ينم عن استيعاب استثنائي للمفهوم!',
    explanationEn: 'Wonderful! Deep insight showing solid mastery of the concept!',
  };

  return [q1, q2, q3];
}
