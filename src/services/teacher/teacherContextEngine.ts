/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Student,
  DayRecord,
  Timetable,
  MasteryRecord,
  Mission,
  HomeworkItem,
  SpacedReviewSchedule,
  Language,
} from '../../types';
import { OfficialCurriculumLesson, CurriculumLessonConcept } from '../../types/teachingSession';
import { curriculumService } from '../curriculum/curriculumService';
import { formatMasteryView } from '../mastery/masteryEngine';

export type ErrorDiagnosisType =
  | 'misconception'
  | 'vocabulary_confusion'
  | 'calculation_or_procedure'
  | 'missing_prerequisite'
  | 'carelessness'
  | 'solid_understanding';

export type TeachingStrategy =
  | 'visual_model'
  | 'everyday_analogy'
  | 'step_by_step_procedure'
  | 'bilingual_vocabulary'
  | 'simpler_prerequisite'
  | 'guided_practice';

export type TeachingDecisionOutcome =
  | 'mastered'
  | 'almost'
  | 'misconception_remediated'
  | 'struggling'
  | 'not_yet_learned';

export interface DiagnosticOption {
  textAr: string;
  textEn: string;
  textFr: string;
  isCorrect: boolean;
  diagnosisType: ErrorDiagnosisType;
  diagnosisExplanationAr: string;
  diagnosisExplanationEn: string;
  diagnosisExplanationFr: string;
  pedagogicHintAr: string;
  pedagogicHintEn: string;
  pedagogicHintFr: string;
  suggestedStrategy: TeachingStrategy;
}

export interface DiagnosticQuestion {
  id: string;
  conceptId: string;
  promptAr: string;
  promptEn: string;
  promptFr: string;
  thinkingPromptAr: string;
  thinkingPromptEn: string;
  thinkingPromptFr: string;
  options: DiagnosticOption[];
  correctAnswerTextAr: string;
  correctAnswerTextEn: string;
  correctAnswerTextFr: string;
  underlyingConceptAr: string;
  underlyingConceptEn: string;
}

export interface NormalizedTeacherContext {
  student: Student;
  studentName: string;
  currentDate: string;
  dayRecord: DayRecord | null;
  hasSchoolDayRecord: boolean;
  schoolDayConfirmed: boolean;
  todayLessonsCovered: Array<{ subject: string; topic?: string; notes?: string }>;
  todayHomeworkAssigned: HomeworkItem[];
  targetSubjectId: string;
  targetSubjectName: string;
  targetLesson: OfficialCurriculumLesson;
  targetConcept: CurriculumLessonConcept | null;
  masteryState: {
    score: number;
    confidenceBand: 'low' | 'medium' | 'high';
    threshold: 'unstarted' | 'needs_review' | 'learning' | 'mastered';
    evidenceCount: number;
    decayed: boolean;
    compositeLabel: string;
  } | null;
  recentStruggles: Array<{ conceptId: string; conceptName: string; subjectId: string }>;
  recentSuccesses: Array<{ conceptId: string; conceptName: string; subjectId: string }>;
  pendingHomework: HomeworkItem[];
  dueReviews: SpacedReviewSchedule[];
  activeMission: Mission | null;
  recommendedReason: string;
  recommendedNextAction: string;
  contextSource: 'home_next_action' | 'lesson' | 'weakness' | 'homework' | 'review' | 'general';
  proactiveOpeningSpeech: string;
  diagnosticQuestion: DiagnosticQuestion;
}

/**
 * Builds diagnostic questions grounded strictly in the official curriculum concepts,
 * distinguishing misconceptions, vocabulary confusion, and procedural errors.
 */
function buildDiagnosticForConcept(
  lesson: OfficialCurriculumLesson,
  concept: CurriculumLessonConcept | null,
  studentName: string
): DiagnosticQuestion {
  const cId = concept?.id || `${lesson.id}_c1`;
  const subjectId = lesson.subjectId;
  const isFrenchSubject = subjectId === 'subj_french' || subjectId === 'subj_math_fr' || subjectId === 'subj_science_fr';

  // 1. Math: Fractions & Decimals (e.g., comparing denominators, place value)
  if (subjectId === 'subj_math' || subjectId === 'subj_math_fr') {
    return {
      id: `diag_${cId}`,
      conceptId: cId,
      promptAr: 'لو قسمنا فطيرتين متطابقتين: الأولى لـ ٣ أجزاء متساوية (١/٣)، والثانية لـ ٥ أجزاء متساوية (١/٥)؛ أي قطعة أكبر حجماً؟',
      promptEn: 'If we cut two identical pies: the first into 3 equal parts (1/3), the second into 5 equal parts (1/5); which piece is larger?',
      promptFr: 'Si on partage deux tartes identiques: la première en 3 parts égales (1/3), la deuxième en 5 parts (1/5); quelle part est la plus grande?',
      thinkingPromptAr: `إزاي وصلتي للحل ده يا ${studentName}؟ اشرحي لي طريقتك وتفكيرك عشان نفهمها سوا.`,
      thinkingPromptEn: `How did you arrive at this, ${studentName}? Explain your reasoning in your own words.`,
      thinkingPromptFr: `Comment es-tu arrivée à cette réponse, ${studentName}? Explique-moi ta façon de penser.`,
      correctAnswerTextAr: 'قطعة الـ (١/٣) أكبر من قطعة الـ (١/٥)',
      correctAnswerTextEn: 'The 1/3 piece is larger than the 1/5 piece',
      correctAnswerTextFr: 'La part de 1/3 est plus grande que la part de 1/5',
      underlyingConceptAr: 'مفهوم الكسر: كلما زاد المقام، قل حجم كل جزء متساوي',
      underlyingConceptEn: 'Fraction concept: larger denominator means smaller equal pieces',
      options: [
        {
          textAr: 'قطعة (١/٣) أكبر لأن التقسيم على ٣ أفراد يعطي كل شخص نصيباً أكبر من التقسيم على ٥',
          textEn: 'The 1/3 piece is larger because sharing among 3 gives each a bigger slice than 5',
          textFr: 'La part de 1/3 est plus grande car partager en 3 donne une part plus grande',
          isCorrect: true,
          diagnosisType: 'solid_understanding',
          diagnosisExplanationAr: 'تفكير رياضي ممتاز! استيعاب دقيق للعلاقة بين عدد الأجزاء وحجم القطعة.',
          diagnosisExplanationEn: 'Outstanding mathematical reasoning! Accurate grasp of denominator size.',
          diagnosisExplanationFr: 'Excellent raisonnement mathématique!',
          pedagogicHintAr: 'ممتازة! دايماً افتكري رسمة البيتزا المقسمة.',
          pedagogicHintEn: 'Great! Always visualize the divided pizza.',
          pedagogicHintFr: 'Très bien!',
          suggestedStrategy: 'guided_practice',
        },
        {
          textAr: 'قطعة (١/٥) أكبر لأن الرقم ٥ أكبر من الرقم ٣ في الأعداد العادية',
          textEn: 'The 1/5 piece is larger because the number 5 is bigger than 3',
          textFr: 'La part de 1/5 est plus grande car 5 est plus grand que 3',
          isCorrect: false,
          diagnosisType: 'misconception',
          diagnosisExplanationAr: 'سوء فهم شائع جداً: تطبيق قاعدة الأعداد الصحيحة على المقام في الكسور دون الانتباه لمعنى التقسيم.',
          diagnosisExplanationEn: 'Common misconception: applying whole-number rules to fraction denominators.',
          diagnosisExplanationFr: 'Erreur conceptuelle classique: confondre taille du dénominateur et valeur de la part.',
          pedagogicHintAr: 'تخيلي لو وزعنا نفس الشوكولاتة على ٥ أصحاب بدل ٣: نصيب كل واحد هيصغر ولا هيكبر؟',
          pedagogicHintEn: 'Imagine sharing chocolate with 5 friends instead of 3: does each slice get smaller or bigger?',
          pedagogicHintFr: 'Si on partage avec 5 amis au lieu de 3, la part est-elle plus petite ou plus grande?',
          suggestedStrategy: 'visual_model',
        },
        {
          textAr: 'القطعتان متساويتان لأن البسط في كليهما هو الرقم ١',
          textEn: 'Both pieces are equal because the numerator is 1 for both',
          textFr: 'Les deux parts sont égales car le numérateur est 1',
          isCorrect: false,
          diagnosisType: 'missing_prerequisite',
          diagnosisExplanationAr: 'التركيز على البسط فقط وتجاهل المقام كلياً يعكس حاجة لمراجعة تعريف الكسر الأساسي.',
          diagnosisExplanationEn: 'Ignoring the denominator indicates need for reviewing fraction fundamentals.',
          diagnosisExplanationFr: 'Négliger le dénominateur montre un besoin de réviser les bases des fractions.',
          pedagogicHintAr: 'البسط بيقولنا كام قطعة أخدنا، لكن المقام بيقولنا الكعكة اتقسمت لكام حتة أصلاً!',
          pedagogicHintEn: 'Numerator tells us how many slices we took; denominator tells how many total slices were cut!',
          pedagogicHintFr: 'Le dénominateur indique en combien de parts la tarte a été découpée!',
          suggestedStrategy: 'simpler_prerequisite',
        },
      ],
    };
  }

  // 2. French: Salutations & Personal Presentation
  if (subjectId === 'subj_french') {
    return {
      id: `diag_${cId}`,
      conceptId: cId,
      promptAr: 'عندما تسألكِ المعلمة: «Comment tu t’appelles ?»؛ ما هي الإجابة الصحيحة والدقيقة؟',
      promptEn: 'When the teacher asks: "Comment tu t’appelles ?"; what is the correct and accurate reply?',
      promptFr: 'Quand la maîtresse demande: «Comment tu t’appelles ?»; quelle est la bonne réponse?',
      thinkingPromptAr: `قولي لي يا ${studentName}، إيه الكلمة المفتاحية اللي خلتك تختاري الإجابة دي؟`,
      thinkingPromptEn: `Tell me ${studentName}, which keyword helped you choose this answer?`,
      thinkingPromptFr: `Dis-moi ${studentName}, quel mot t'a aidée à choisir cette réponse?`,
      correctAnswerTextAr: 'Je m’appelle Amina.',
      correctAnswerTextEn: 'Je m’appelle Amina.',
      correctAnswerTextFr: 'Je m’appelle Amina.',
      underlyingConceptAr: 'التمييز بين السؤال عن الاسم (Comment tu t’appelles) والسؤال عن العمر (Quel âge as-tu)',
      underlyingConceptEn: 'Distinguishing between asking for name vs age in French',
      options: [
        {
          textAr: 'Je m’appelle Amina.',
          textEn: 'Je m’appelle Amina.',
          textFr: 'Je m’appelle Amina.',
          isCorrect: true,
          diagnosisType: 'solid_understanding',
          diagnosisExplanationAr: 'ممتازة! إدراك صحيح لفعل s’appeler المخصص للتعريف بالاسم.',
          diagnosisExplanationEn: 'Excellent! Accurate recognition of the verb s’appeler for personal names.',
          diagnosisExplanationFr: 'Bravo! Utilisation correcte du verbe s’appeler.',
          pedagogicHintAr: 'تمام يا أمينة! "Je m’appelle" تعني "اسمي".',
          pedagogicHintEn: 'Great! "Je m’appelle" means "My name is".',
          pedagogicHintFr: 'Parfait!',
          suggestedStrategy: 'guided_practice',
        },
        {
          textAr: 'J’ai 10 ans.',
          textEn: 'J’ai 10 ans.',
          textFr: 'J’ai 10 ans.',
          isCorrect: false,
          diagnosisType: 'vocabulary_confusion',
          diagnosisExplanationAr: 'خلط بين السؤال عن الاسم والسؤال عن السن (Quel âge as-tu).',
          diagnosisExplanationEn: 'Confusion between asking for name vs age.',
          diagnosisExplanationFr: 'Confusion entre demander le prénom et demander l’âge.',
          pedagogicHintAr: 'ركزي في كلمة "t’appelles" جاية من "appeler" يعني النداء أو الاسم، مش العمر!',
          pedagogicHintEn: 'Focus on "appelles" which relates to calling someone by name, not age!',
          pedagogicHintFr: 'Attention: «ans» c’est pour l’âge, «s’appeler» c’est pour le prénom!',
          suggestedStrategy: 'bilingual_vocabulary',
        },
        {
          textAr: 'Bonjour, Madame.',
          textEn: 'Bonjour, Madame.',
          textFr: 'Bonjour, Madame.',
          isCorrect: false,
          diagnosisType: 'carelessness',
          diagnosisExplanationAr: 'إجابة بتحية عامة بدل الإجابة عن السؤال المحدد عن الاسم.',
          diagnosisExplanationEn: 'Greeting instead of answering the specific question about name.',
          diagnosisExplanationFr: 'Salutation générale au lieu de répondre à la question précise.',
          pedagogicHintAr: 'التحية مؤدبة وجميلة، لكن السؤال محتاج اسمك بالتحديد!',
          pedagogicHintEn: 'Polite greeting, but the teacher specifically asked for your name!',
          pedagogicHintFr: 'Polie salutation, mais la maîtresse attend ton prénom!',
          suggestedStrategy: 'step_by_step_procedure',
        },
      ],
    };
  }

  // 3. Arabic: Reading & Grammar (e.g., أنا أستطيع / الفاعل والمفعول)
  if (subjectId === 'subj_arabic') {
    return {
      id: `diag_${cId}`,
      conceptId: cId,
      promptAr: 'في قصة «أنا أستطيع»، عندما شعر آسر بالإحباط بعد حصوله على تقدير ضعيف، ما هو الدرس الأهم الذي علمه إياه المعلم؟',
      promptEn: 'In the story "I Can", when Aser felt discouraged, what was the most important lesson taught?',
      promptFr: 'Dans l’histoire "Je peux", quand Asser était découragé, quelle leçon essentielle a-t-il apprise?',
      thinkingPromptAr: `إيه اللي فهمتيه من تصرف المعلم مع آسر يا ${studentName}؟ اشرحي لي برأيك.`,
      thinkingPromptEn: `What did you understand from the teacher's attitude toward Aser, ${studentName}?`,
      thinkingPromptFr: `Qu'as-tu compris de l'attitude du maître, ${studentName}?`,
      correctAnswerTextAr: 'أن الفشل في تجربة واحدة ليس نهاية المطاف، بل خطوة للتعلم والمحاولة من جديد بثقة',
      correctAnswerTextEn: 'A single setback is not the end, but a stepping stone to learn and try again with confidence',
      correctAnswerTextFr: 'Un échec n’est pas la fin, mais une étape pour apprendre et réessayer avec confiance',
      underlyingConceptAr: 'قيمة الثقة بالنفس والتعلم من الأخطاء والعمل الجماعي',
      underlyingConceptEn: 'Self-confidence and resilience through learning from mistakes',
      options: [
        {
          textAr: 'أن الفشل في خطوة لا يعني العجز، بل حافز لتنظيم الوقت والمحاولة بإصرار',
          textEn: 'Failure is not helplessness, but a motivation to organize and try with persistence',
          textFr: 'L’échec n’est pas une fatalité mais une motivation à persévérer',
          isCorrect: true,
          diagnosisType: 'solid_understanding',
          diagnosisExplanationAr: 'فهم عميق ورائع لمغزى النص القرائي ورسالة كتاب الوزارة.',
          diagnosisExplanationEn: 'Deep and accurate understanding of the text theme.',
          diagnosisExplanationFr: 'Excellente compréhension du sens du texte.',
          pedagogicHintAr: 'أحسنتِ! آسر أثبت إنه يستطيع لما وثق في قدراته واشتغل مع فريقه.',
          pedagogicHintEn: 'Well done! Aser proved he could do it by trusting his abilities.',
          pedagogicHintFr: 'Très bien!',
          suggestedStrategy: 'guided_practice',
        },
        {
          textAr: 'أن يبتعد عن أي مهمة صعبة حتى لا يحصل على تقدير ضعيف مرة أخرى',
          textEn: 'To avoid difficult tasks so he does not receive a low mark again',
          textFr: 'Éviter toute tâche difficile pour ne plus échouer',
          isCorrect: false,
          diagnosisType: 'misconception',
          diagnosisExplanationAr: 'سوء فهم للرسالة التربوية للقصة؛ التجنب عكس الإصرار والثقة بالنفس.',
          diagnosisExplanationEn: 'Misunderstanding story theme; avoidance is opposite of confidence.',
          diagnosisExplanationFr: 'Mauvaise interprétation du message pédagogique.',
          pedagogicHintAr: 'تذكري يا أمينة حكمة القصة: هل آسر استسلم ولا قاد فريقه وفاز بالمسابقة؟',
          pedagogicHintEn: 'Remember Amina: did Aser give up, or did he lead his team to win?',
          pedagogicHintFr: 'Rappelle-toi: Asser a-t-il abandonné ou a-t-il mené son équipe à la victoire?',
          suggestedStrategy: 'everyday_analogy',
        },
        {
          textAr: 'أن الاعتماد الكامل على الآخرين هو الحل الوحيد للنجاح',
          textEn: 'That depending completely on others is the only way to succeed',
          textFr: 'Compter entièrement sur les autres pour réussir',
          isCorrect: false,
          diagnosisType: 'missing_prerequisite',
          diagnosisExplanationAr: 'خلط بين التعاون الإيجابي مع الفريق والاتكالية الكاملة.',
          diagnosisExplanationEn: 'Confusing positive teamwork with complete dependency.',
          diagnosisExplanationFr: 'Confusion entre coopération et dépendance.',
          pedagogicHintAr: 'التعاون جميل ومهم، لكن كل واحد في الفريق له دور ومسؤولية خاصة بيه!',
          pedagogicHintEn: 'Teamwork is vital, but each team member has personal responsibility and effort!',
          pedagogicHintFr: 'L’entraide est essentielle, mais chacun a un rôle et un effort personnel!',
          suggestedStrategy: 'step_by_step_procedure',
        },
      ],
    };
  }

  // 4. Science / Sciences FR: Plants & Ecosystems
  if (subjectId === 'subj_science' || subjectId === 'subj_science_fr') {
    return {
      id: `diag_${cId}`,
      conceptId: cId,
      promptAr: 'ما هو المصدر الأساسي الذي يصنع به النبات غذاءه (السكر) في عملية البناء الضوئي؟',
      promptEn: 'What is the primary source by which plants produce food (sugar) in photosynthesis?',
      promptFr: 'Quelle est la source principale par laquelle la plante fabrique sa nourriture lors de la photosynthèse?',
      thinkingPromptAr: `إيه اللي بيحصل في أوراق النبات الأخضر بالظبط يا ${studentName}؟ اشرحي لي.`,
      thinkingPromptEn: `What happens inside green plant leaves, ${studentName}? Explain to me.`,
      thinkingPromptFr: `Que se passe-t-il dans les feuilles de la plante, ${studentName}?`,
      correctAnswerTextAr: 'ضوء الشمس الممتص عبر مادة الكلوروفيل في الأوراق مع الماء وثاني أكسيد الكربون',
      correctAnswerTextEn: 'Sunlight absorbed by chlorophyll with water and carbon dioxide',
      correctAnswerTextFr: 'La lumière du soleil absorbée avec l’eau et le gaz carbonique',
      underlyingConceptAr: 'النبات كائن منتج يصنع غذاءه بنفسه عبر طاقة ضوء الشمس',
      underlyingConceptEn: 'Plants are producers making their own food using sunlight energy',
      options: [
        {
          textAr: 'ضوء الشمس مع الماء وثاني أكسيد الكربون داخل الأوراق الخضراء',
          textEn: 'Sunlight with water and carbon dioxide inside green leaves',
          textFr: 'La lumière du soleil avec l’eau et le CO2 dans les feuilles',
          isCorrect: true,
          diagnosisType: 'solid_understanding',
          diagnosisExplanationAr: 'استيعاب علمي دقيق! النبات مصنع ذاتي التغذية بفضل ضوء الشمس.',
          diagnosisExplanationEn: 'Accurate scientific understanding of autotrophic photosynthesis.',
          diagnosisExplanationFr: 'Excellente compréhension scientifique!',
          pedagogicHintAr: 'برافو! الأوراق هي مطبخ النبات اللي بيشتغل بالطاقة الشمسية.',
          pedagogicHintEn: 'Great! Leaves are the solar-powered kitchen of the plant.',
          pedagogicHintFr: 'Bravo!',
          suggestedStrategy: 'guided_practice',
        },
        {
          textAr: 'التربة فقط، لأن النبات يأكل التربة عن طريق الجذور كغذاء جاهز',
          textEn: 'Soil only, because roots eat soil as ready-made food',
          textFr: 'Le sol uniquement, les racines mangent la terre',
          isCorrect: false,
          diagnosisType: 'misconception',
          diagnosisExplanationAr: 'سوء فهم كلاسيكي: افتراض أن التربة طعام جاهز، بينما النبات يحصل منها فقط على الماء والأملاح.',
          diagnosisExplanationEn: 'Classic misconception: assuming plants eat soil directly.',
          diagnosisExplanationFr: 'Idée fausse classique: penser que la terre est la nourriture de la plante.',
          pedagogicHintAr: 'التربة بتدي النبات مية وأملاح، لكن مين اللي بيدي الطاقة لصنع السكر؟',
          pedagogicHintEn: 'Soil provides water and minerals, but what provides energy to bake the sugar?',
          pedagogicHintFr: 'Le sol donne l’eau et les minéraux, mais d’où vient l’énergie pour fabriquer le sucre?',
          suggestedStrategy: 'visual_model',
        },
        {
          textAr: 'الظلام والماء وحدهما دون الحاجة لأي ضوء',
          textEn: 'Darkness and water alone without any light needed',
          textFr: 'L’obscurité et l’eau sans lumière',
          isCorrect: false,
          diagnosisType: 'missing_prerequisite',
          diagnosisExplanationAr: 'تجاهل دور الضوء كطاقة محركة لصنع الغذاء.',
          diagnosisExplanationEn: 'Ignoring the critical role of light as the energy driver.',
          diagnosisExplanationFr: 'Oublier le rôle fondamental de la lumière.',
          pedagogicHintAr: 'لو حطينا نبات أخضر في دولاب مقفول وضلمة، تفتكري هيعيش ولا هيصفر ويموت؟',
          pedagogicHintEn: 'If we put a plant in a dark closet with only water, will it thrive or turn yellow?',
          pedagogicHintFr: 'Si on enferme une plante dans le noir, peut-elle grandir?',
          suggestedStrategy: 'everyday_analogy',
        },
      ],
    };
  }

  // 5. General Fallback from Lesson Objectives & Exercises
  const firstExercise = lesson.exercises?.[0];
  const qPromptAr = firstExercise?.question || `ما هي الفكرة الأساسية لدرس «${lesson.titleAr}» في ${lesson.sourceRef.bookAr}؟`;
  const qPromptEn = firstExercise?.question || `What is the core principle of "${lesson.titleEn}" in ${lesson.sourceRef.bookEn}?`;
  const expected = firstExercise?.expectedAnswer || lesson.objectives[0] || 'تطبيق القاعدة المنهجية بدقة';

  return {
    id: `diag_${cId}`,
    conceptId: cId,
    promptAr: qPromptAr,
    promptEn: qPromptEn,
    promptFr: qPromptEn,
    thinkingPromptAr: `قولي لي يا ${studentName}، إزاي فكرتي في إجابتك دي بالتحديد؟`,
    thinkingPromptEn: `Tell me ${studentName}, how did you reason through this answer?`,
    thinkingPromptFr: `Dis-moi ${studentName}, comment as-tu raisonné pour cette réponse?`,
    correctAnswerTextAr: expected,
    correctAnswerTextEn: expected,
    correctAnswerTextFr: expected,
    underlyingConceptAr: lesson.objectives[0] || lesson.titleAr,
    underlyingConceptEn: lesson.objectives[0] || lesson.titleEn,
    options: [
      {
        textAr: expected,
        textEn: expected,
        textFr: expected,
        isCorrect: true,
        diagnosisType: 'solid_understanding',
        diagnosisExplanationAr: 'إجابة نموذجية مطابقة تماماً لكتاب الوزارة.',
        diagnosisExplanationEn: 'Model textbook answer demonstrating solid understanding.',
        diagnosisExplanationFr: 'Réponse conforme au manuel scolaire.',
        pedagogicHintAr: 'ممتازة! إجابة دقيقة ومنهجية.',
        pedagogicHintEn: 'Excellent! Accurate and methodical.',
        pedagogicHintFr: 'Parfait!',
        suggestedStrategy: 'guided_practice',
      },
      {
        textAr: 'عكس ذلك تماماً أو خلط في المصطلحات',
        textEn: 'The opposite or conceptual confusion',
        textFr: 'Le contraire ou confusion conceptuelle',
        isCorrect: false,
        diagnosisType: 'misconception',
        diagnosisExplanationAr: 'التباس في تطبيق القاعدة الأساسية للدرس.',
        diagnosisExplanationEn: 'Confusion in applying the fundamental lesson rule.',
        diagnosisExplanationFr: 'Confusion dans l’application de la règle.',
        pedagogicHintAr: 'تعالي نراجع نص كتاب الوزارة ونبسط القاعدة سوا خطوة بخطوة.',
        pedagogicHintEn: 'Let’s review the textbook text and simplify the rule step by step.',
        pedagogicHintFr: 'Relisons la règle du manuel ensemble pas à pas.',
        suggestedStrategy: 'step_by_step_procedure',
      },
      {
        textAr: 'إجابة عامة غير محددة',
        textEn: 'Vague non-specific answer',
        textFr: 'Réponse vague et imprécise',
        isCorrect: false,
        diagnosisType: 'missing_prerequisite',
        diagnosisExplanationAr: 'عدم تذكر المصطلحات المحددة في الدرس.',
        diagnosisExplanationEn: 'Lacking the specific textbook terms for this topic.',
        diagnosisExplanationFr: 'Manque des termes précis du cours.',
        pedagogicHintAr: 'بصي على الكلمات المفتاحية في الدرس عشان نحدد الإجابة بدقة.',
        pedagogicHintEn: 'Look at the keywords in the lesson to identify the exact answer.',
        pedagogicHintFr: 'Regarde les mots-clés de la leçon.',
        suggestedStrategy: 'bilingual_vocabulary',
      },
    ],
  };
}

export interface TeacherContextBuildParams {
  student: Student | null;
  currentDayRecord: DayRecord | null;
  timetable: Timetable | null;
  masteryRecords: Record<string, MasteryRecord>;
  nextPendingMission: Mission | null;
  companionContext?: {
    source: string;
    lessonId?: string;
    conceptId?: string;
    missionId?: string;
    topic?: string;
    notes?: string;
  } | null;
  dueReviews?: SpacedReviewSchedule[];
  language?: Language;
  explicitLessonId?: string;
}

/**
 * Builds the authoritative, normalized teacher context for Miss Nour.
 * Integrates real student identity, today's school-day record, curriculum progress,
 * existing mastery state, due reviews, and pending homework.
 */
export function buildNormalizedTeacherContext(
  params: TeacherContextBuildParams
): NormalizedTeacherContext {
  const {
    student,
    currentDayRecord,
    timetable,
    masteryRecords,
    nextPendingMission,
    companionContext,
    dueReviews = [],
    language = 'ar',
    explicitLessonId,
  } = params;

  const isAr = language === 'ar';
  const isFr = language === 'fr';
  const studentName = student?.name || (isAr ? 'أمينة' : 'Amina');
  const currentDate = new Date().toISOString().split('T')[0];

  // 1. Resolve Target Lesson
  let targetLessonId =
    explicitLessonId ||
    companionContext?.lessonId ||
    nextPendingMission?.lessonId;

  // If no explicit lesson, check if Amina studied something at school today
  if (!targetLessonId && currentDayRecord?.lessonsCovered && currentDayRecord.lessonsCovered.length > 0) {
    const todayFirst = currentDayRecord.lessonsCovered[0];
    const all = curriculumService.getAllLessons();
    const matched = all.find(
      (l) =>
        l.subjectNameAr.includes(todayFirst.subject) ||
        todayFirst.subject.includes(l.subjectNameAr) ||
        (todayFirst.topic && l.titleAr.includes(todayFirst.topic))
    );
    if (matched) targetLessonId = matched.id;
  }

  // Fallback to first available lesson from authoritative curriculum
  if (!targetLessonId) {
    targetLessonId = 'off_ar_u1_l1_ana_astatee';
  }

  const targetLesson =
    curriculumService.getLessonById(targetLessonId) ||
    curriculumService.getAllLessons()[0];

  // 2. Resolve Target Concept
  const targetConcept =
    (companionContext?.conceptId &&
      targetLesson.concepts.find((c) => c.id === companionContext.conceptId)) ||
    (nextPendingMission?.conceptId &&
      targetLesson.concepts.find((c) => c.id === nextPendingMission.conceptId)) ||
    targetLesson.concepts[0] ||
    null;

  // 3. Extract Mastery State for Target Concept
  const rec = targetConcept ? masteryRecords[targetConcept.id] : null;
  const masteryView = rec ? formatMasteryView(rec, language) : null;
  const masteryState = rec && masteryView
    ? {
        score: rec.score,
        confidenceBand: masteryView.confidenceBand,
        threshold: masteryView.threshold,
        evidenceCount: rec.evidenceCount,
        decayed: Boolean(rec.decayAppliedCount && rec.decayAppliedCount > 0),
        compositeLabel: masteryView.compositeLabel,
      }
    : null;

  // 4. Analyze Recent Struggles & Successes across all concepts
  const flatConcepts = curriculumService.getFlatConcepts();
  const recentStruggles: Array<{ conceptId: string; conceptName: string; subjectId: string }> = [];
  const recentSuccesses: Array<{ conceptId: string; conceptName: string; subjectId: string }> = [];

  for (const fc of flatConcepts) {
    const mRec = masteryRecords[fc.id];
    if (mRec) {
      if (mRec.score < 0.6 || (mRec.evidenceCount > 0 && mRec.score < 0.7)) {
        recentStruggles.push({
          conceptId: fc.id,
          conceptName: isAr ? fc.nameAr : fc.nameEn,
          subjectId: fc.subjectId,
        });
      } else if (mRec.score >= 0.75) {
        recentSuccesses.push({
          conceptId: fc.id,
          conceptName: isAr ? fc.nameAr : fc.nameEn,
          subjectId: fc.subjectId,
        });
      }
    }
  }

  // 5. Analyze Today's School Record & Homework
  const todayLessonsCovered = currentDayRecord?.lessonsCovered || [];
  const todayHomeworkAssigned = currentDayRecord?.homeworkAssigned || [];
  const pendingHomework = todayHomeworkAssigned.filter((h) => h.status !== 'completed');

  // 6. Resolve Context Source & Recommended Reason
  const contextSource = (companionContext?.source as any) || (nextPendingMission ? 'home_next_action' : 'general');
  let recommendedReason = '';
  let recommendedNextAction = '';

  if (contextSource === 'homework') {
    recommendedReason = isAr
      ? `تم تسجيل واجب مدرسي في «${targetLesson.subjectNameAr}» يجب إنجازه اليوم بثقة ودون تراكم.`
      : `Pending homework assigned today in "${targetLesson.subjectNameEn}".`;
    recommendedNextAction = isAr ? 'تثبيت الفكرة الأساسية ثم إكمال الواجب' : 'Master core concept and complete homework';
  } else if (contextSource === 'home_next_action' && nextPendingMission) {
    recommendedReason = nextPendingMission.whyNow || (isAr ? 'المهمة ذات الأولوية القصوى في خطة اليوم.' : 'Top priority daily mission.');
    recommendedNextAction = nextPendingMission.title;
  } else if (contextSource === 'weakness') {
    recommendedReason = isAr
      ? `لاحظنا أن مفهوم «${targetConcept?.titleAr || targetLesson.titleAr}» يحتاج إلى زاوية شرح إيضاحية بديلة.`
      : `Concept needs alternative explanatory perspective.`;
    recommendedNextAction = isAr ? 'إعادة تثبيت المفهوم بنموذج بصري ومثال' : 'Re-anchor concept with visual model';
  } else if (dueReviews.length > 0) {
    recommendedReason = isAr
      ? `مفهوم مستحق للمراجعة المتباعدة لضمان ترسيخه في الذاكرة طويلة المدى.`
      : `Spaced review due to ensure long-term retention.`;
    recommendedNextAction = isAr ? 'مراجعة سريعة وتثبيت الإتقان' : 'Quick refresh and mastery re-check';
  } else {
    recommendedReason = isAr
      ? `متابعة التسلسل الطبيعي في كتاب الوزارة لـ «${targetLesson.titleAr}».`
      : `Following official curriculum textbook progression.`;
    recommendedNextAction = isAr ? 'استكشاف الدرس وحل تمارين الوزارة' : 'Explore lesson and solve textbook practice';
  }

  // 7. Synthesize Proactive Opening Speech
  let proactiveOpeningSpeech = '';
  const didStudyTodayAtSchool = todayLessonsCovered.some(
    (l) => l.subject.includes(targetLesson.subjectNameAr) || targetLesson.subjectNameAr.includes(l.subject)
  );

  if (didStudyTodayAtSchool) {
    proactiveOpeningSpeech = isAr
      ? `يا أهلاً يا ${studentName}! شفت في سجل يومك إنك درستي «${targetLesson.titleAr}» في المدرسة النهاردة. قبل ما نفتح التمارين، عايزة أسألك سؤال استكشافي ذكي عشان نتأكد إن الفكرة الأساسية واضحة في دماغك ومفيش أي التباس!`
      : isFr
      ? `Bonjour ${studentName}! J'ai vu que tu as étudié «${targetLesson.titleEn}» à l'école aujourd'hui. Avant de passer aux exercices, commençons par une petite question diagnostique pour vérifier tes repères!`
      : `Hello ${studentName}! I noticed you studied "${targetLesson.titleEn}" at school today. Before we jump into practice, let's start with a quick diagnostic question to see exactly what clicked!`;
  } else if (pendingHomework.length > 0 && pendingHomework.some((h) => h.subject.includes(targetLesson.subjectNameAr))) {
    proactiveOpeningSpeech = isAr
      ? `أهلاً يا ${studentName}! عندك واجب مسجل في «${targetLesson.sourceRef.bookAr}». تعالي نختبر فهمك للفكرة المحورية الأول بسؤال بسيط عشان تحلي الواجب بسرعة وبدون تردد!`
      : isFr
      ? `Bonjour ${studentName}! Tu as des devoirs pour «${targetLesson.sourceRef.bookEn}». Vérifions la notion clé ensemble pour que tu puisses les faire en toute autonomie!`
      : `Hello ${studentName}! You have homework recorded for "${targetLesson.sourceRef.bookEn}". Let's test the core concept first so you can complete it smoothly!`;
  } else if (masteryState && (masteryState.threshold === 'needs_review' || masteryState.score < 0.6)) {
    proactiveOpeningSpeech = isAr
      ? `يا هلا ببطلتنا ${studentName}! درس «${targetLesson.titleAr}» محتاج مننا زاوية شرح جديدة وممتعة. جهزت لك سؤال تشخيصي لطيف يحدد بالظبط النقطة اللي محتاجة توضيح!`
      : isFr
      ? `Bonjour ${studentName}! La leçon «${targetLesson.titleEn}» mérite un nouvel éclairage. Faisons un petit test amical pour voir exactement ce qu'on va consolider!`
      : `Hello ${studentName}! "${targetLesson.titleEn}" calls for a fresh, engaging angle. Let's start with a diagnostic check to pinpoint exactly where to focus!`;
  } else {
    proactiveOpeningSpeech = isAr
      ? `أهلاً يا ${studentName}! أنا معلمتكِ نور 👩‍🏫 خطوتنا الدراسية الآن هي درس «${targetLesson.titleAr}» من ${targetLesson.sourceRef.bookAr}. يلا نكتشف مستوانا بسؤال تشخيصي سريع قبل الشرح!`
      : isFr
      ? `Bienvenue ${studentName}! Je suis Maîtresse Nour 👩‍🏫 Notre étape actuelle est «${targetLesson.titleEn}». Commençons par un rapide diagnostic avant le tableau!`
      : `Welcome, ${studentName}! I'm Miss Nour 👩‍🏫 Our current lesson is "${targetLesson.titleEn}" from ${targetLesson.sourceRef.bookEn}. Let's check where we stand with a quick diagnostic!`;
  }

  // 8. Generate Curriculum Diagnostic Question
  const diagnosticQuestion = buildDiagnosticForConcept(targetLesson, targetConcept, studentName);

  return {
    student: student || ({ id: 'student_amina', name: studentName } as Student),
    studentName,
    currentDate,
    dayRecord: currentDayRecord,
    hasSchoolDayRecord: Boolean(currentDayRecord),
    schoolDayConfirmed: Boolean(currentDayRecord?.confirmed),
    todayLessonsCovered,
    todayHomeworkAssigned,
    targetSubjectId: targetLesson.subjectId,
    targetSubjectName: isAr ? targetLesson.subjectNameAr : targetLesson.subjectNameEn,
    targetLesson,
    targetConcept,
    masteryState,
    recentStruggles,
    recentSuccesses,
    pendingHomework,
    dueReviews,
    activeMission: nextPendingMission,
    recommendedReason,
    recommendedNextAction,
    contextSource,
    proactiveOpeningSpeech,
    diagnosticQuestion,
  };
}
