/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  TutorState,
  TutorResponse,
  TutorModality,
  FlatCurriculumConcept,
  Language,
} from '../../types';
import { curriculumService } from '../curriculum/curriculumService';

/**
 * In-memory registry of active tutor sessions keyed by `${studentId}_${conceptId}_${sessionId}`
 */
const sessionStates: Map<string, TutorState> = new Map();

export const TUTOR_LADDER_ORDER: TutorModality[] = [
  'normal_explanation',
  'simpler_example',
  'story_analogy_visual',
  'check_question',
  'flag_for_review',
];

/**
 * Gets or initializes a student's tutor state
 */
export function getOrCreateTutorState(
  studentId: string,
  conceptId: string,
  sessionId: string = 'default'
): TutorState {
  const key = `${studentId}_${conceptId}_${sessionId}`;
  const existing = sessionStates.get(key);
  if (existing) return existing;

  const initial: TutorState = {
    studentId,
    conceptId,
    sessionId,
    attemptCount: 0,
    currentModality: 'normal_explanation',
    isFlaggedForReview: false,
    historyModalities: [],
  };
  sessionStates.set(key, initial);
  return initial;
}

/**
 * Resets a tutor session state
 */
export function resetTutorState(
  studentId: string,
  conceptId: string,
  sessionId: string = 'default'
): void {
  const key = `${studentId}_${conceptId}_${sessionId}`;
  sessionStates.delete(key);
}

/**
 * Checks if the student message triggers the escalation ladder
 */
export function isEscalationTrigger(text: string): boolean {
  if (!text) return false;
  const s = text.toLowerCase().trim();
  return (
    s.includes('مش فاهم') ||
    s.includes('مش فاهمه') ||
    s.includes('مش فاهمة') ||
    s.includes("don't understand") ||
    s.includes('dont understand') ||
    s.includes("don't get it") ||
    s.includes('اشرح بطريقة تانية') ||
    s.includes('طريقة تانية') ||
    s.includes('اشرح تاني') ||
    s.includes('مش واضحة') ||
    s.includes('explain differently') ||
    s.includes('another way')
  );
}

interface GenerateTutorStepParams {
  studentId: string;
  conceptId: string;
  sessionId?: string;
  language?: Language;
  manualNextModality?: TutorModality;
}

/**
 * Escalation Ladder Core:
 * Attempt 1: Normal explanation
 * Attempt 2: Simpler example
 * Attempt 3: Story / analogy / visual
 * Attempt 4: Check question (verify understanding)
 * Attempt 5: Flag concept for review (do NOT loop)
 *
 * Rules:
 *  - Never repeat the same explanation format twice in a row.
 *  - Escalation state is per (studentId, conceptId, sessionId).
 *  - After flag: log it, offer to move on, do not pressure.
 */
export function advanceTutorEscalation(params: GenerateTutorStepParams): TutorResponse {
  const {
    studentId,
    conceptId,
    sessionId = 'default',
    language = 'ar',
    manualNextModality,
  } = params;

  const isAr = language === 'ar';
  const state = getOrCreateTutorState(studentId, conceptId, sessionId);

  // Find concept in authoritative curriculum
  const flatConcepts = curriculumService.getFlatConcepts();
  const concept = flatConcepts.find((c) => c.id === conceptId);

  if (!concept) {
    return {
      state,
      text: isAr
        ? 'لا أريد أن أشرح لكِ شيئاً عشوائياً. اختاري درساً أو مهمة مرتبطة بمفهوم محدد، وسأشرحها لكِ بطريقة مختلفة.'
        : 'I do not want to explain something arbitrary. Please open a lesson or mission with a verified concept, and I will explain it in a different way.',
      modality: 'normal_explanation',
      modalityLabelAr: 'لا يوجد مفهوم موثّق بعد',
      modalityLabelEn: 'No verified concept yet',
      checkQuestion: undefined,
      suggestNextStep: isAr ? 'اختيار درس أو مهمة' : 'Choose a lesson or mission',
    };
  }

  const conceptName = isAr ? concept.nameAr : concept.nameEn;
  const conceptDesc = isAr ? concept.descriptionAr : concept.descriptionEn;

  // Determine next attempt step
  const nextAttempt = state.attemptCount + 1;
  let targetModality: TutorModality;

  if (manualNextModality) {
    targetModality = manualNextModality;
  } else {
    // Follow the 5-step ladder strictly
    if (nextAttempt === 1) targetModality = 'normal_explanation';
    else if (nextAttempt === 2) targetModality = 'simpler_example';
    else if (nextAttempt === 3) targetModality = 'story_analogy_visual';
    else if (nextAttempt === 4) targetModality = 'check_question';
    else targetModality = 'flag_for_review';
  }

  // Code invariant: Never repeat the same explanation format twice in a row
  if (state.historyModalities.length > 0) {
    const lastModality = state.historyModalities[state.historyModalities.length - 1];
    if (targetModality === lastModality) {
      const curIdx = TUTOR_LADDER_ORDER.indexOf(targetModality);
      const nextIdx = (curIdx + 1) % TUTOR_LADDER_ORDER.length;
      targetModality = TUTOR_LADDER_ORDER[nextIdx];
    }
  }

  // Update State
  state.attemptCount = nextAttempt;
  state.currentModality = targetModality;
  state.historyModalities.push(targetModality);

  if (targetModality === 'flag_for_review') {
    state.isFlaggedForReview = true;
  }

  // Generate modality-specific content
  let text = '';
  let modalityLabelAr = '';
  let modalityLabelEn = '';
  let checkQuestionData: TutorResponse['checkQuestion'] = undefined;
  let suggestNextStep: string | undefined = undefined;

  switch (targetModality) {
    case 'normal_explanation':
      modalityLabelAr = 'الخطوة ١: شرح مباشر وواضح';
      modalityLabelEn = 'Step 1: Direct Explanation';
      text = isAr
        ? `ولا يهمك خالص! تعال نبسط «${conceptName}». الفكرة الأساسية هي: ${conceptDesc} بكل بساطة، بنقسم الفكرة لخطوات متتابعة علشان عينك وعقلك يلقطوها بسهولة دون أي تعقيد.`
        : `No worries at all! Let's clarify "${conceptName}". The core concept is: ${conceptDesc}. We break it down into sequential, simple parts so you grasp it smoothly.`;
      break;

    case 'simpler_example':
      modalityLabelAr = 'الخطوة ٢: مثال مبسط جداً من الحياة';
      modalityLabelEn = 'Step 2: Simpler Everyday Example';
      text = isAr
        ? `تعال نغير الزاوية وناخد مثال خفيف ومباشر جداً: تخيل إنك في موقف يومي وبتشوف تطبيق لـ «${conceptName}» قدامك. لما تلاحظ المعطيات واحدة واحدة، هتلاقي إن القاعدة مش محتاجة حفظ، بل فهم للخطوة الأولى فقط.`
        : `Let's switch angles with a super simple everyday example: Imagine you are seeing "${conceptName}" in real life. When you observe the parts one by one, you realize it's just about understanding the very first step.`;
      break;

    case 'story_analogy_visual':
      modalityLabelAr = 'الخطوة ٣: قصة / تشبيه بصري مجازي';
      modalityLabelEn = 'Step 3: Story & Visual Analogy';
      text = isAr
        ? `تخيل «${conceptName}» زي قطار سريع أو فريق كرة: فيه قائد بيبدأ الحركة (المفتاح الأساسي)، وفيه أفراد بيكملوا العمل معاه بنفس التناغم. لو تخيلت الفكرة كصورة في خيالك، هتربط كل جزء بمكانه فوراً دون أي حيرة!`
        : `Picture "${conceptName}" like a team or a fast train: there is a leader who initiates the action, and teammates who complete the goal in harmony. Visualizing it this way connects each piece naturally in your mind!`;
      break;

    case 'check_question':
      modalityLabelAr = 'الخطوة ٤: سؤال فحص استيعاب تشجيعي';
      modalityLabelEn = 'Step 4: Comprehension Check Question';
      text = isAr
        ? `تعال نجرب نختبر فهمنا بسؤال بسيط جداً وممتع عن «${conceptName}». ركز في السؤال ده وقولي إيه رأيك:`
        : `Let's test our understanding with a light and encouraging question about "${conceptName}". Take a look at this:`;

      checkQuestionData = {
        question: isAr
          ? `ما هي القاعدة أو الخطوة الأولى عند التعامل مع: ${conceptName}؟`
          : `What is the first rule or step when addressing: ${conceptName}?`,
        options: isAr
          ? ['تحديد العنصر الأساسي أولاً', 'التخمين العشوائي بدون قراءة', 'تخطي السؤال فوراً']
          : ['Identify the core component first', 'Random guess without reading', 'Skip immediately'],
        correctAnswer: isAr ? 'تحديد العنصر الأساسي أولاً' : 'Identify the core component first',
        explanation: isAr
          ? 'بالضبط! أول خطوة دائماً هي تحديد العنصر الأساسي وفهمه بهدوء.'
          : 'Exactly! The first step is always identifying the core component calmly.',
      };
      break;

    case 'flag_for_review':
      modalityLabelAr = 'الخطوة ٥: تثبيت المفهوم للمراجعة اللاحقة';
      modalityLabelEn = 'Step 5: Flag for Later Review';
      text = isAr
        ? `أنت بذلت مجهود رائع ومحترم جداً اليوم يا بطل! 🌟 «${conceptName}» مفهوم عميق، وطبيعي تماماً يحتاج وقت ليتخمر في الذهن. لقد قمت الآن بتمييزه تلقائياً ليظهر في قائمة (المراجعة اللاحقة)، حتى نرجع له لاحقاً بهدوء. ما رأيك أن ننتقل الآن لمهمة ثانية خفيفة؟`
        : `You did a fantastic effort today! 🌟 "${conceptName}" is a deep concept, and it is completely natural for it to take a little time to settle. I have automatically flagged it for (Later Review) so we can revisit it calmly later. How about we move on to another lighter activity?`;
      suggestNextStep = isAr ? 'الانتقال للمهمة التالية' : 'Move to next mission';
      break;
  }

  return {
    state,
    text,
    modality: targetModality,
    modalityLabelAr,
    modalityLabelEn,
    checkQuestion: checkQuestionData,
    suggestNextStep,
  };
}
