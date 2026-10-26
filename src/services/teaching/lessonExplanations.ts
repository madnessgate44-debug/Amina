/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Building the four explanation segments Miss Noor teaches for a lesson.
 *
 * This used to live inline in the classroom component, which meant the text
 * could only be produced for the lesson already in state. Opening a lesson from
 * the library therefore could not narrate the *new* lesson (a stale closure), so
 * the explanation was never spoken. Extracting it makes the segments available
 * for any lesson at the moment it is chosen, and makes them unit testable.
 */

export interface ExplanationLesson {
  id: string;
  titleAr: string;
  titleEn: string;
  readingText?: string | null;
  objectives: string[];
  sourceRef: { bookAr: string; bookEn: string };
}

export interface ExplanationContext {
  isArabic: boolean;
  isFrench: boolean;
  studentName: string;
  /** AI-refined segments keyed `${lessonId}_hook` etc.; override the defaults. */
  dynamicExplanations?: Record<string, string>;
}

export interface LessonExplanationSet {
  hook: string;
  chalkboard: string;
  analogy: string;
  discussion: string;
}

export function buildLessonExplanations(
  lesson: ExplanationLesson,
  ctx: ExplanationContext
): LessonExplanationSet {
  const { isArabic, isFrench, studentName } = ctx;
  const dynamic = ctx.dynamicExplanations || {};
  const title = isArabic ? lesson.titleAr : lesson.titleEn;
  const book = isArabic ? lesson.sourceRef.bookAr : lesson.sourceRef.bookEn;
  const textSnippet = lesson.readingText
    ? lesson.readingText.slice(0, 300)
    : lesson.objectives.join(' — ');

  return {
    hook:
      dynamic[`${lesson.id}_hook`] ||
      (isArabic
        ? `عارفة يا ${studentName}، ورا درس «${title}» سر ممتع جداً! تخيلي لو واجهتي موقف في حياتك ومحتاجة تفهمي إزاي تتصرفي بذكاء؛ الدرس ده في ${book} بيعلمنا القاعدة الذهبية اللي هتخليكي متميزة وتفهمي اللي بيدور حواليكي بسهولة!`
        : isFrench
        ? `Sais-tu ${studentName}, derrière la leçon «${title}», il y a une énigme captivante! Ce chapitre du manuel ${book} nous montre concrètement comment observer et résoudre des défis avec brio!`
        : `Did you know, ${studentName}, there is a fascinating secret behind "${title}"? This lesson from ${book} teaches us the golden principle to solve problems and understand our world with confidence!`),
    chalkboard:
      dynamic[`${lesson.id}_core`] ||
      (isArabic
        ? `بصي معايا على السبورة يا ${studentName}: المحور الأساسي لدرسنا هو: ${textSnippet}. أهم حاجة ترتبي أفكارك: قراءة نص الدرس بهدوء، فهم معنى الكلمات الجديدة، وتطبيق القاعدة خطوة بخطوة في تمارين الوزارة.`
        : isFrench
        ? `Regarde le tableau avec moi, ${studentName}: Le point central est: ${textSnippet}. L'essentiel est de lire posément et d'appliquer la règle méthodiquement dans les exercices du manuel.`
        : `Look at the blackboard with me, ${studentName}: The core topic is: ${textSnippet}. The key is to break down the concept into simple steps and apply it to each practice exercise.`),
    analogy:
      dynamic[`${lesson.id}_analogy`] ||
      (isArabic
        ? `تعالي نشبه درس «${title}» بمثال من بيتنا ويومنا يا ${studentName}! تخيلي لو بنلعب لعبة تركيب مكعبات أو بنقسم حاجة حلوة مع أصحابنا؛ كل جزء لازم يتحط في مكانه بالظبط عشان الرسمة تطلع مظبوطة، وده بالظبط نفس منطق درس النهاردة!`
        : isFrench
        ? `Comparons «${title}» à la vie de tous les jours, ${studentName}! Comme lorsqu'on assemble des briques de jeu ou qu'on partage un goûter: chaque élément a sa place précise pour que tout fonctionne à merveille!`
        : `Let's relate "${title}" to everyday life, ${studentName}! Just like fitting puzzle pieces together or sharing a favorite snack with friends, each step has its exact place so everything works smoothly!`),
    discussion:
      dynamic[`${lesson.id}_discussion`] ||
      (isArabic
        ? `يا ترى يا ${studentName}، لو سألتك: إيه أكتر فكرة لفتت نظرك في درس «${title}»؟ وإزاي نقدر نطبقها في حياتنا النهاردة؟ قولي لي رأيك بالصوت أو بالكتابة!`
        : isFrench
        ? `À ton avis ${studentName}, quel est le détail le plus marquant dans «${title}»? Dis-le-moi à haute voix ou écris-le!`
        : `What do you think, ${studentName}: what was the most interesting part of "${title}"? Share your thought by voice or typing!`),
  };
}

/** The greeting Miss Noor says the moment a lesson is opened. */
export function buildLessonGreeting(
  lesson: ExplanationLesson,
  ctx: Pick<ExplanationContext, 'isArabic' | 'isFrench' | 'studentName'>
): string {
  const { isArabic, isFrench, studentName } = ctx;
  if (isArabic) {
    return `أهلاً يا ${studentName}! فتحنا درس «${lesson.titleAr}» من ${lesson.sourceRef.bookAr}! تعالي أشرحلك الدرس كله بصوتي الأول، وبعدها هنسألك أسئلة نتأكد بيها إنك فهمتي!`;
  }
  if (isFrench) {
    return `Bienvenue ${studentName}! Nous avons ouvert la leçon «${lesson.titleEn}». Je vais d'abord tout t'expliquer à voix haute, puis nous ferons les exercices ensemble!`;
  }
  return `Welcome ${studentName}! We opened "${lesson.titleEn}" from ${lesson.sourceRef.bookEn}! Let me explain the whole lesson out loud first, then we will do the questions together!`;
}
