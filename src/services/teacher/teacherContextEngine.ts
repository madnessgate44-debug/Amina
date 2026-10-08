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
  | 'misconception'
  | 'struggling'
  | 'not_yet_learned';

export type ReasoningCategory =
  | 'correct_reasoning'
  | 'misconception'
  | 'incomplete_reasoning'
  | 'procedural_error'
  | 'vocabulary_difficulty'
  | 'guessing'
  | 'unclear_reasoning'
  | 'prerequisite_gap';

export interface ReasoningAnalysisResult {
  category: ReasoningCategory;
  confidence: 'high' | 'medium' | 'low';
  explanationAr: string;
  explanationEn: string;
  explanationFr: string;
  detectedMisconceptionKey?: string;
  recommendedPedagogicalAction:
    | 'praise_and_challenge'
    | 'target_misconception'
    | 'reinforce_prerequisite'
    | 'bilingual_clarification'
    | 'guided_step_by_step'
    | 'clarify_thinking_with_new_example';
}

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

export interface TargetedTeachingContent {
  headlineAr: string;
  headlineEn: string;
  headlineFr: string;
  coreExplanationAr: string;
  coreExplanationEn: string;
  coreExplanationFr: string;
  contrastOrAnalogyAr: string;
  contrastOrAnalogyEn: string;
  contrastOrAnalogyFr: string;
  keyRuleAr: string;
  keyRuleEn: string;
  keyRuleFr: string;
  strategy: TeachingStrategy;
}

export interface RecheckPracticeQuestion {
  id: string;
  conceptId: string;
  promptAr: string;
  promptEn: string;
  promptFr: string;
  thinkingPromptAr: string;
  thinkingPromptEn: string;
  thinkingPromptFr: string;
  options: Array<{
    textAr: string;
    textEn: string;
    textFr: string;
    isCorrect: boolean;
    explanationAr: string;
    explanationEn: string;
    explanationFr: string;
  }>;
  correctIndex: number;
}

export interface NormalizedTeacherContext {
  student: Student | null;
  studentName: string;
  currentDate: string;
  dayRecord: DayRecord | null;
  hasSchoolDayRecord: boolean;
  schoolDayConfirmed: boolean;
  todayLessonsCovered: Array<{ subject: string; topic?: string; notes?: string }>;
  todayHomeworkAssigned: HomeworkItem[];
  targetSubjectId: string;
  targetSubjectName: string;
  targetLesson: OfficialCurriculumLesson | null;
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
  targetedTeaching: TargetedTeachingContent;
  recheckQuestion: RecheckPracticeQuestion;
}

/**
 * Builds concept-specific diagnostic questions grounded in the official curriculum.
 * Distinguishes between fractions, place value decimals, photosynthesis, ecosystems,
 * Arabic grammar, reading, and French vocabulary/salutations.
 */
export function buildDiagnosticForConcept(
  lesson: OfficialCurriculumLesson | null,
  concept: CurriculumLessonConcept | null,
  studentName: string
): DiagnosticQuestion {
  if (!lesson) {
    return {
      id: 'diag_none',
      conceptId: 'none',
      promptAr: 'لا يوجد درس محدد للتشخيص حالياً.',
      promptEn: 'No lesson currently selected for diagnostic.',
      promptFr: 'Aucune leçon sélectionnée actuellement.',
      thinkingPromptAr: 'يمكنك اختيار درس من خطة المنهج الدراسي.',
      thinkingPromptEn: 'You can choose a lesson from the curriculum plan.',
      thinkingPromptFr: 'Vous pouvez choisir une leçon dans le programme.',
      correctAnswerTextAr: '',
      correctAnswerTextEn: '',
      correctAnswerTextFr: '',
      underlyingConceptAr: '',
      underlyingConceptEn: '',
      options: [],
    };
  }

  const cId = concept?.id || `${lesson.id}_c1`;
  const subjectId = lesson.subjectId;
  const conceptTitle = (concept?.titleAr || lesson.titleAr || '').toLowerCase();
  const conceptTitleEn = (concept?.titleEn || lesson.titleEn || '').toLowerCase();

  // 1. Math: Fractions (comparing denominators, fraction parts)
  if (
    conceptTitle.includes('كسر') ||
    conceptTitle.includes('كسور') ||
    conceptTitleEn.includes('fraction') ||
    lesson.titleAr.includes('كسور')
  ) {
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

  // 2. Math / Math FR: Decimals & Place Value (e.g. off_math_u1_l1 - الأجزاء من ألف)
  if (
    subjectId === 'subj_math' ||
    subjectId === 'subj_math_fr' ||
    conceptTitle.includes('عشري') ||
    conceptTitle.includes('ألف') ||
    conceptTitle.includes('قيمة مكانية') ||
    conceptTitleEn.includes('decimal') ||
    conceptTitleEn.includes('thousandth')
  ) {
    return {
      id: `diag_${cId}`,
      conceptId: cId,
      promptAr: 'في العدد العشري 0,875 كجم، ما هو الرقم الذي يقع في خانة الأجزاء من ألف (Millièmes)؟',
      promptEn: 'In the decimal number 0.875 kg, which digit is in the thousandths place (Millièmes)?',
      promptFr: 'Dans le nombre décimal 0,875 kg, quel chiffre représente les millièmes ?',
      thinkingPromptAr: `قولي لي يا ${studentName}، إزاي رتبتي الخانات بعد الفاصلة العشرية في تفكيرك؟`,
      thinkingPromptEn: `Tell me ${studentName}, how did you order the places after the decimal point in your mind?`,
      thinkingPromptFr: `Dis-moi ${studentName}, comment as-tu compté les rangs après la virgule ?`,
      correctAnswerTextAr: 'الرقم 5 (الخانة الثالثة بعد الفاصلة تعني 5 أجزاء من ألف)',
      correctAnswerTextEn: 'The digit 5 (third place after decimal means 5 thousandths)',
      correctAnswerTextFr: 'Le chiffre 5 (troisième rang après la virgule)',
      underlyingConceptAr: 'القيمة المكانية بعد الفاصلة: جزء من عشرة، ثم جزء من مئة، ثم جزء من ألف',
      underlyingConceptEn: 'Decimal place value: tenths, then hundredths, then thousandths',
      options: [
        {
          textAr: 'الرقم 5، لأنه يقع في الخانة الثالثة مباشرة بعد الفاصلة العشرية (0,005)',
          textEn: 'Digit 5, because it is in the third position after the decimal point (0.005)',
          textFr: 'Le chiffre 5, car c’est la troisième position après la virgule (0,005)',
          isCorrect: true,
          diagnosisType: 'solid_understanding',
          diagnosisExplanationAr: 'إجابة صحيحة واستيعاب ممتاز للقيمة المكانية العشرية!',
          diagnosisExplanationEn: 'Accurate decimal place value understanding!',
          diagnosisExplanationFr: 'Excellente maîtrise de la valeur de position décimale!',
          pedagogicHintAr: 'ممتازة! دايماً تذكري: 8 أجزاء من عشرة، 7 أجزاء من مئة، 5 أجزاء من ألف.',
          pedagogicHintEn: 'Great! 8 tenths, 7 hundredths, 5 thousandths.',
          pedagogicHintFr: 'Très bien!',
          suggestedStrategy: 'guided_practice',
        },
        {
          textAr: 'الرقم 8، لأنه أول رقم نراه بعد الفاصلة العشرية',
          textEn: 'Digit 8, because it is the first digit right after the decimal point',
          textFr: 'Le chiffre 8, car c’est le premier après la virgule',
          isCorrect: false,
          diagnosisType: 'misconception',
          diagnosisExplanationAr: 'خلط بين خانة الأجزاء من عشرة (Dixièmes) وخانة الأجزاء من ألف (Millièmes).',
          diagnosisExplanationEn: 'Confusion between tenths and thousandths places.',
          diagnosisExplanationFr: 'Confusion entre dixièmes et millièmes.',
          pedagogicHintAr: 'أول خانة بعد الفاصلة هي جزء من عشرة (0.8)، والألف تحتاج ٣ خانات!',
          pedagogicHintEn: 'First digit after decimal is tenths (0.8); thousandths is the 3rd place!',
          pedagogicHintFr: 'Le premier chiffre après la virgule est le dixième !',
          suggestedStrategy: 'step_by_step_procedure',
        },
        {
          textAr: 'الرقم 0، لأنه أول رقم في العدد كله من جهة اليسار',
          textEn: 'Digit 0, because it is the first number on the left',
          textFr: 'Le chiffre 0, car il est le premier à gauche',
          isCorrect: false,
          diagnosisType: 'missing_prerequisite',
          diagnosisExplanationAr: 'عدم التمييز بين الجزء الصحيح (الآحاد) والأجزاء العشرية بعد الفاصلة.',
          diagnosisExplanationEn: 'Missing distinction between whole units and decimal fractions.',
          diagnosisExplanationFr: 'Confusion entre partie entière et partie décimale.',
          pedagogicHintAr: 'الصفر على الشمال يمثل خانة الآحاد الصحيحة، وليس أجزاء من ألف!',
          pedagogicHintEn: 'The zero represents whole units, not thousandths!',
          pedagogicHintFr: 'Le zéro représente les unités entières !',
          suggestedStrategy: 'simpler_prerequisite',
        },
      ],
    };
  }

  // 3. Science: Plant Needs & Photosynthesis (off_sci_u1_l1_plant_needs)
  if (
    conceptTitle.includes('بناء ضوئي') ||
    conceptTitle.includes('نبات') ||
    conceptTitleEn.includes('photosynthesis') ||
    conceptTitleEn.includes('plant') ||
    lesson.id.includes('plant_needs')
  ) {
    return {
      id: `diag_${cId}`,
      conceptId: cId,
      promptAr: 'ما هو المصدر الأساسي الذي يصنع به النبات غذاءه (سكر الجلوكوز) في عملية البناء الضوئي؟',
      promptEn: 'What is the primary energy source plants use to make food (glucose) in photosynthesis?',
      promptFr: 'Quelle est la source principale d’énergie pour la photosynthèse chez la plante ?',
      thinkingPromptAr: `إيه اللي بيحصل جوة أوراق النبات الأخضر بالظبط يا ${studentName}؟ اشرحي لي.`,
      thinkingPromptEn: `What happens inside green leaves, ${studentName}? Explain your reasoning.`,
      thinkingPromptFr: `Que se passe-t-il dans les feuilles, ${studentName}?`,
      correctAnswerTextAr: 'ضوء الشمس الممتص في الأوراق مع الماء وثاني أكسيد الكربون',
      correctAnswerTextEn: 'Sunlight absorbed by leaves along with water and carbon dioxide',
      correctAnswerTextFr: 'La lumière du soleil absorbée avec l’eau et le gaz carbonique',
      underlyingConceptAr: 'النبات كائن منتج يصنع غذاءه بنفسه من خلال طاقة ضوء الشمس',
      underlyingConceptEn: 'Plants are autotrophic producers creating food using sunlight energy',
      options: [
        {
          textAr: 'ضوء الشمس مع الماء وثاني أكسيد الكربون داخل البلاستيدات الخضراء بالأوراق',
          textEn: 'Sunlight with water and carbon dioxide inside chloroplasts in leaves',
          textFr: 'La lumière du soleil avec l’eau et le CO2 dans les feuilles',
          isCorrect: true,
          diagnosisType: 'solid_understanding',
          diagnosisExplanationAr: 'استيعاب علمي دقيق! النبات مصنع ذاتي التغذية بفضل طاقة ضوء الشمس.',
          diagnosisExplanationEn: 'Accurate scientific understanding of autotrophic photosynthesis.',
          diagnosisExplanationFr: 'Excellente compréhension scientifique !',
          pedagogicHintAr: 'برافو! الأوراق هي مطبخ النبات اللي بيشتغل بالطاقة الشمسية.',
          pedagogicHintEn: 'Great! Leaves are the solar-powered kitchen of the plant.',
          pedagogicHintFr: 'Bravo !',
          suggestedStrategy: 'guided_practice',
        },
        {
          textAr: 'التربة فقط، لأن النبات يأكل التربة عن طريق الجذور كغذاء جاهز',
          textEn: 'Soil only, because roots eat soil as ready-made food',
          textFr: 'Le sol uniquement, les racines mangent la terre',
          isCorrect: false,
          diagnosisType: 'misconception',
          diagnosisExplanationAr: 'سوء فهم كلاسيكي شائع: افتراض أن التربة طعام جاهز، بينما النبات يحصل منها فقط على الماء والأملاح.',
          diagnosisExplanationEn: 'Classic misconception: assuming plants consume soil directly as food.',
          diagnosisExplanationFr: 'Idée fausse classique: penser que la terre est la nourriture prête de la plante.',
          pedagogicHintAr: 'التربة بتدي النبات مية وأملاح، لكن مين اللي بيدي الطاقة لصنع السكر؟',
          pedagogicHintEn: 'Soil provides water and minerals, but what provides energy to bake the sugar?',
          pedagogicHintFr: 'Le sol donne l’eau et les minéraux, mais d’où vient l’énergie ?',
          suggestedStrategy: 'visual_model',
        },
        {
          textAr: 'الظلام والماء وحدهما دون الحاجة لأي ضوء على الإطلاق',
          textEn: 'Darkness and water alone without any light needed',
          textFr: 'L’obscurité et l’eau sans lumière',
          isCorrect: false,
          diagnosisType: 'missing_prerequisite',
          diagnosisExplanationAr: 'تجاهل دور الضوء كطاقة محركة لصنع الغذاء.',
          diagnosisExplanationEn: 'Ignoring the critical role of light as the energy driver.',
          diagnosisExplanationFr: 'Oublier le rôle fondamental de la lumière.',
          pedagogicHintAr: 'لو حطينا نبات أخضر في دولاب مقفول وضلمة، تفتكري هيعيش ولا هيصفر ويموت؟',
          pedagogicHintEn: 'If we put a plant in a dark closet with only water, will it thrive or turn yellow?',
          pedagogicHintFr: 'Si on enferme une plante dans le noir, peut-elle grandir ?',
          suggestedStrategy: 'everyday_analogy',
        },
      ],
    };
  }

  // 4. Science: Ecosystems & Food Webs (off_sci_u1_l2_ecosystem)
  if (
    conceptTitle.includes('طاقة') ||
    conceptTitle.includes('سلسلة غذائية') ||
    conceptTitle.includes('شبكة') ||
    conceptTitle.includes('نظام بيئي') ||
    conceptTitleEn.includes('ecosystem') ||
    conceptTitleEn.includes('food web') ||
    lesson.id.includes('ecosystem')
  ) {
    return {
      id: `diag_${cId}`,
      conceptId: cId,
      promptAr: 'في السلسلة الغذائية (نبات ⬅️ أرنب ⬅️ ثعلب)، ما هو المصدر الأولي الذي انطلقت منه كل طاقة السلسلة؟',
      promptEn: 'In the food chain (plant ⬅️ rabbit ⬅️ fox), what is the primary source of all energy?',
      promptFr: 'Dans la chaîne alimentaire (plante ⬅️ lapin ⬅️ renard), quelle est la source primaire d’énergie ?',
      thinkingPromptAr: `إزاي الطاقة بتتنقل بين الكائنات دي يا ${studentName}؟ اشرحي لي فكرتك.`,
      thinkingPromptEn: `How does energy flow between these organisms, ${studentName}? Explain.`,
      thinkingPromptFr: `Comment l’énergie circule-t-elle, ${studentName} ?`,
      correctAnswerTextAr: 'الشمس هي مصدر الطاقة الأولي لجميع الكائنات الحية',
      correctAnswerTextEn: 'The Sun is the primary source of energy for all living things',
      correctAnswerTextFr: 'Le Soleil est la source primaire d’énergie',
      underlyingConceptAr: 'انتقال الطاقة: الشمس ⬅️ النبات (منتج) ⬅️ المستهلكات ⬅️ المحللات',
      underlyingConceptEn: 'Energy flow: Sun ⬅️ Producer ⬅️ Consumers ⬅️ Decomposers',
      options: [
        {
          textAr: 'الشمس، لأن النبات يمتص طاقتها ثم تنتقل للأرنب ومنه إلى الثعلب',
          textEn: 'The Sun, because plants capture its energy which flows to rabbit then fox',
          textFr: 'Le Soleil, car la plante capte son énergie qui passe au lapin puis au renard',
          isCorrect: true,
          diagnosisType: 'solid_understanding',
          diagnosisExplanationAr: 'فهم علمي دقيق لدورة الطاقة في النظام البيئي!',
          diagnosisExplanationEn: 'Accurate grasp of ecological energy flow!',
          diagnosisExplanationFr: 'Excellente compréhension des chaînes alimentaires !',
          pedagogicHintAr: 'ممتازة! الشمس هي محطة توليد الطاقة الأولى لكل السلاسل الغذائية.',
          pedagogicHintEn: 'Great! The sun is the primary power station of life.',
          pedagogicHintFr: 'Très bien !',
          suggestedStrategy: 'guided_practice',
        },
        {
          textAr: 'الثعلب، لأنه المفترس الأقوى في نهاية السلسلة',
          textEn: 'The fox, because it is the strongest top predator',
          textFr: 'Le renard, car c’est le prédateur le plus fort',
          isCorrect: false,
          diagnosisType: 'misconception',
          diagnosisExplanationAr: 'سوء فهم اتجاه سريان الطاقة: الخلط بين القوة العضلية ومصدر إنتاج الطاقة.',
          diagnosisExplanationEn: 'Confusing predator strength with the source of ecological energy.',
          diagnosisExplanationFr: 'Confusion entre force du prédateur et source d’énergie.',
          pedagogicHintAr: 'الثعلب مستهلك للطاقة مش منتج ليها، لو مفيش نبات مش هيلاقي أرنب يأكله!',
          pedagogicHintEn: 'Foxes consume energy; without plants capturing sunlight, foxes have no food!',
          pedagogicHintFr: 'Le renard consomme l’énergie, il ne la crée pas !',
          suggestedStrategy: 'visual_model',
        },
        {
          textAr: 'الأرنب، لأنه الوحيد الذي يتحرك بين النبات والثعلب',
          textEn: 'The rabbit, because it moves between plant and fox',
          textFr: 'Le lapin, car il se déplace entre la plante et le renard',
          isCorrect: false,
          diagnosisType: 'missing_prerequisite',
          diagnosisExplanationAr: 'عدم التمييز بين الكائنات المنتجة والمستهلكة في السلسلة الغذائية.',
          diagnosisExplanationEn: 'Missing distinction between producers and primary consumers.',
          diagnosisExplanationFr: 'Confusion entre producteurs et consommateurs.',
          pedagogicHintAr: 'الأرنب مستهلك أول لأنه يأكل النبات، لكنه لا يصنع طاقته بنفسه!',
          pedagogicHintEn: 'Rabbits are primary consumers; they do not generate their own food!',
          pedagogicHintFr: 'Le lapin est un herbivore consommateur !',
          suggestedStrategy: 'step_by_step_procedure',
        },
      ],
    };
  }

  // 5. Arabic Grammar: Sentence Structure & Subject/Object (الفاعل والمفعول به)
  if (
    conceptTitle.includes('فاعل') ||
    conceptTitle.includes('مفعول') ||
    conceptTitle.includes('جملة فعلية') ||
    conceptTitle.includes('نحو')
  ) {
    return {
      id: `diag_${cId}`,
      conceptId: cId,
      promptAr: 'في الجملة: «قَرَأَتْ أَمِينَةُ الْقِصَّةَ»، ما هي الكلمة التي تمثل (الفاعل) الذي قام بالفعل؟',
      promptEn: 'In the sentence: "قَرَأَتْ أَمِينَةُ الْقِصَّةَ", which word is the subject (فاعل) who did the action?',
      promptFr: 'Dans la phrase arabe, quel mot est le sujet (فاعل) qui accomplit l’action ?',
      thinkingPromptAr: `إزاي عرفتي الفاعل في الجملة يا ${studentName}؟ اشرحي لي قاعدتك.`,
      thinkingPromptEn: `How did you identify the subject in the sentence, ${studentName}? Explain.`,
      thinkingPromptFr: `Comment as-tu reconnu le sujet, ${studentName} ?`,
      correctAnswerTextAr: '«أمينةُ» هي الفاعل لأنها هي التي قامت بفعل القراءة (مرفوع بالضمة)',
      correctAnswerTextEn: '"Amina" is the subject because she performed the reading action',
      correctAnswerTextFr: '«Amina» est le sujet',
      underlyingConceptAr: 'الجملة الفعلية: الفعل (الحدث) + الفاعل (من قام به) + المفعول به (من وقع عليه الفعل)',
      underlyingConceptEn: 'Verbal sentence components: Verb + Subject + Object',
      options: [
        {
          textAr: '«أمينةُ»، لأننا عندما نسأل «من قرأت؟» تكون الإجابة هي أمينة، وعلامتها الضمة',
          textEn: '"Amina", because asking "who read?" gives Amina, marked with damma',
          textFr: '«Amina», car c’est elle qui lit',
          isCorrect: true,
          diagnosisType: 'solid_understanding',
          diagnosisExplanationAr: 'إعراب سليم وفهم ممتاز لأركان الجملة الفعلية!',
          diagnosisExplanationEn: 'Accurate identification of the grammatical subject!',
          diagnosisExplanationFr: 'Excellente analyse grammaticale !',
          pedagogicHintAr: 'أحسنتِ! دايماً اسألي «مين اللي عمل الفعل؟» تعرفي الفاعل فوراً.',
          pedagogicHintEn: 'Great rule: asking "who did the action?" reveals the subject.',
          pedagogicHintFr: 'Bravo !',
          suggestedStrategy: 'guided_practice',
        },
        {
          textAr: '«القصةَ»، لأنها الكلمة الأخيرة والمهمة في الجملة',
          textEn: '"The story", because it is the last word in the sentence',
          textFr: '«L’histoire», car c’est le dernier mot',
          isCorrect: false,
          diagnosisType: 'misconception',
          diagnosisExplanationAr: 'خلط بين الفاعل (من قام بالفعل) والمفعول به (من وقع عليه الفعل).',
          diagnosisExplanationEn: 'Confusing the subject with the direct object.',
          diagnosisExplanationFr: 'Confusion entre sujet et complément d’objet direct.',
          pedagogicHintAr: 'هل القصة هي اللي قرأت، ولا أمينة هي اللي قرأتها؟ القصة مفعول به!',
          pedagogicHintEn: 'Did the story read, or was the story read by Amina? The story is the object!',
          pedagogicHintFr: 'L’histoire est l’objet lu, pas celui qui lit !',
          suggestedStrategy: 'step_by_step_procedure',
        },
        {
          textAr: '«قرأتْ»، لأن الفاعل دائماً هو أول كلمة في أي جملة',
          textEn: '"Read", because the subject is always the very first word',
          textFr: '«A lu», car le premier mot est toujours le sujet',
          isCorrect: false,
          diagnosisType: 'missing_prerequisite',
          diagnosisExplanationAr: 'عدم التمييز بين الفعل (الحدث المقترن بزمن) والفاعل (الاسم الذي فعل الحدث).',
          diagnosisExplanationEn: 'Failing to distinguish between the verb action and the actor noun.',
          diagnosisExplanationFr: 'Confusion entre verbe et nom sujet.',
          pedagogicHintAr: '«قرأتْ» فعل ماضٍ يدل على حدث، والفاعل اسم يأتي بعده!',
          pedagogicHintEn: '"Read" is the past verb; the subject is the actor that follows!',
          pedagogicHintFr: '«A lu» est le verbe, pas le sujet !',
          suggestedStrategy: 'simpler_prerequisite',
        },
      ],
    };
  }

  // 6. Arabic Reading: أنا أستطيع (off_ar_u1_l1_ana_astatee)
  if (
    lesson.id.includes('ana_astatee') ||
    conceptTitle.includes('أستطيع')
  ) {
    return {
      id: `diag_${cId}`,
      conceptId: cId,
      promptAr: 'في قصة «أنا أستطيع»، عندما شعر آسر بالإحباط بعد حصوله على تقدير ضعيف، ما هو الدرس الأهم الذي علمه إياه المعلم؟',
      promptEn: 'In the story "I Can", when Aser felt discouraged, what was the most important lesson taught?',
      promptFr: 'Dans l’histoire "Je peux", quand Asser était découragé, quelle leçon essentielle a-t-il apprise ?',
      thinkingPromptAr: `إيه اللي فهمتيه من تصرف المعلم مع آسر يا ${studentName}؟ اشرحي لي برأيك.`,
      thinkingPromptEn: `What did you understand from the teacher's attitude toward Aser, ${studentName}?`,
      thinkingPromptFr: `Qu'as-tu compris de l'attitude du maître, ${studentName} ?`,
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
          pedagogicHintFr: 'Très bien !',
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
          pedagogicHintFr: 'Rappelle-toi: Asser a-t-il abandonné ou a-t-il mené son équipe à la victoire ?',
          suggestedStrategy: 'everyday_analogy',
        },
        {
          textAr: 'أن الاعتماد الكامل على الآخرين دون أي جهد ذاتي هو الحل الوحيد للنجاح',
          textEn: 'That depending completely on others without personal effort is the only way',
          textFr: 'Compter entièrement sur les autres sans effort personnel',
          isCorrect: false,
          diagnosisType: 'missing_prerequisite',
          diagnosisExplanationAr: 'خلط بين التعاون الإيجابي مع الفريق والاتكالية الكاملة.',
          diagnosisExplanationEn: 'Confusing positive teamwork with complete dependency.',
          diagnosisExplanationFr: 'Confusion entre coopération et dépendance.',
          pedagogicHintAr: 'التعاون جميل ومهم، لكن كل واحد في الفريق له دور ومسؤولية خاصة بيه!',
          pedagogicHintEn: 'Teamwork is vital, but each team member has personal responsibility and effort!',
          pedagogicHintFr: 'L’entraide est essentielle, mais chacun a un rôle et un effort personnel !',
          suggestedStrategy: 'step_by_step_procedure',
        },
      ],
    };
  }

  // 7. French: Salutations & Personal Presentation
  if (subjectId === 'subj_french') {
    return {
      id: `diag_${cId}`,
      conceptId: cId,
      promptAr: 'عندما تسألكِ المعلمة: «Comment tu t’appelles ?»؛ ما هي الإجابة الصحيحة والدقيقة؟',
      promptEn: 'When the teacher asks: "Comment tu t’appelles ?"; what is the correct and accurate reply?',
      promptFr: 'Quand la maîtresse demande: «Comment tu t’appelles ?»; quelle est la bonne réponse ?',
      thinkingPromptAr: `قولي لي يا ${studentName}، إيه الكلمة المفتاحية اللي خلتك تختاري الإجابة دي؟`,
      thinkingPromptEn: `Tell me ${studentName}, which keyword helped you choose this answer?`,
      thinkingPromptFr: `Dis-moi ${studentName}, quel mot t'a aidée à choisir cette réponse ?`,
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
          pedagogicHintFr: 'Parfait !',
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
          pedagogicHintFr: 'Attention: «ans» c’est pour l’âge, «s’appeler» c’est pour le prénom !',
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
          pedagogicHintFr: 'Polie salutation, mais la maîtresse attend ton prénom !',
          suggestedStrategy: 'step_by_step_procedure',
        },
      ],
    };
  }

  // 8. General Concept Diagnostic Grounded in Actual Lesson Metadata (NO FABRICATED FACTS)
  const firstExercise = lesson.exercises?.[0];
  const conceptKeyPoint = concept?.keyPoints?.[0];
  const qPromptAr =
    firstExercise?.question ||
    (conceptKeyPoint
      ? `في درس «${lesson.titleAr}»، ما هي الحقيقة الأساسية المتعلقة بـ «${concept?.titleAr || lesson.titleAr}»؟`
      : `ما هو المحور الأساسي لدرس «${lesson.titleAr}» في ${lesson.sourceRef.bookAr}؟`);
  const qPromptEn =
    firstExercise?.question ||
    `What is the core principle of "${concept?.titleEn || lesson.titleEn}" in ${lesson.sourceRef.bookEn}?`;
  const expected =
    firstExercise?.expectedAnswer ||
    conceptKeyPoint ||
    lesson.objectives[0] ||
    'تطبيق القاعدة المنهجية بدقة وفق كتاب الوزارة';

  return {
    id: `diag_${cId}`,
    conceptId: cId,
    promptAr: qPromptAr,
    promptEn: qPromptEn,
    promptFr: qPromptEn,
    thinkingPromptAr: `قولي لي يا ${studentName}، إزاي فكرتي في إجابتك دي بالتحديد؟`,
    thinkingPromptEn: `Tell me ${studentName}, how did you reason through this answer?`,
    thinkingPromptFr: `Dis-moi ${studentName}, comment as-tu raisonné pour cette réponse ?`,
    correctAnswerTextAr: expected,
    correctAnswerTextEn: expected,
    correctAnswerTextFr: expected,
    underlyingConceptAr: concept?.titleAr || lesson.objectives[0] || lesson.titleAr,
    underlyingConceptEn: concept?.titleEn || lesson.objectives[0] || lesson.titleEn,
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
        pedagogicHintFr: 'Parfait !',
        suggestedStrategy: 'guided_practice',
      },
      {
        textAr: firstExercise?.options?.find((o) => o !== expected) || 'عكس المفهوم المطلوب تماماً أو خلط في المصطلحات',
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
        textAr: concept?.prerequisiteAr || 'معلومات غير محددة تفتقر للمفاهيم الأساسية السابقة',
        textEn: 'Missing prerequisite fundamentals',
        textFr: 'Bases fondamentales manquantes',
        isCorrect: false,
        diagnosisType: 'missing_prerequisite',
        diagnosisExplanationAr: 'عدم تذكر المصطلحات والمقدمات التمهيدية المحددة في الدرس.',
        diagnosisExplanationEn: 'Lacking the foundational prerequisite terms for this topic.',
        diagnosisExplanationFr: 'Manque des notions préalables du cours.',
        pedagogicHintAr: 'بصي على الكلمات المفتاحية والأساسيات عشان نحدد الإجابة بدقة.',
        pedagogicHintEn: 'Look at the fundamental keywords to identify the exact answer.',
        pedagogicHintFr: 'Regarde les mots-clés de base.',
        suggestedStrategy: 'simpler_prerequisite',
      },
    ],
  };
}

/**
 * Builds a Re-Check Practice Question testing the SAME underlying concept on a NEW example.
 * This ensures Miss Nour verifies whether the teaching intervention actually worked.
 */
export function buildRecheckQuestionForConcept(
  lesson: OfficialCurriculumLesson | null,
  concept: CurriculumLessonConcept | null,
  studentName: string
): RecheckPracticeQuestion {
  if (!lesson) {
    return {
      id: 'recheck_none',
      conceptId: 'none',
      promptAr: 'لا توجد مسألة تحقق متاحة لعدم تحديد درس.',
      promptEn: 'No re-check question available without a selected lesson.',
      promptFr: 'Aucune question de vérification disponible.',
      thinkingPromptAr: '',
      thinkingPromptEn: '',
      thinkingPromptFr: '',
      options: [],
      correctIndex: -1,
    };
  }

  const cId = concept?.id || `${lesson.id}_c1`;
  const conceptTitle = (concept?.titleAr || lesson.titleAr || '').toLowerCase();
  const conceptTitleEn = (concept?.titleEn || lesson.titleEn || '').toLowerCase();

  // 1. Math: Fractions Re-Check (Different numbers: 1/4 vs 1/8)
  if (
    conceptTitle.includes('كسر') ||
    conceptTitle.includes('كسور') ||
    conceptTitleEn.includes('fraction') ||
    lesson.titleAr.includes('كسور')
  ) {
    return {
      id: `recheck_${cId}`,
      conceptId: cId,
      promptAr: 'لو قسمنا قالبي شوكولاتة متطابقين: الأول لـ ٤ قطع متساوية (١/٤)، والثاني لـ ٨ قطع متساوية (١/٨)؛ أي قطعة أكبر حجماً؟',
      promptEn: 'If we cut two identical chocolate bars: the first into 4 equal pieces (1/4), the second into 8 (1/8); which piece is larger?',
      promptFr: 'Si on partage deux barres de chocolat identiques : la première en 4 parts (1/4), la deuxième en 8 parts (1/8) ; quelle part est la plus grande ?',
      thinkingPromptAr: `قولي لي يا ${studentName}، ليه اخترتي الإجابة دي بعد ما وضحنا معنى المقام؟`,
      thinkingPromptEn: `Tell me ${studentName}, why did you choose this now that we explained the denominator?`,
      thinkingPromptFr: `Pourquoi as-tu choisi cette réponse, ${studentName} ?`,
      correctIndex: 0,
      options: [
        {
          textAr: 'قطعة (١/٤) أكبر لأن التقسيم على ٤ أشخاص يعطي نصيباً أكبر من التقسيم على ٨',
          textEn: 'The 1/4 piece is larger because dividing by 4 yields bigger slices than 8',
          textFr: 'La part de 1/4 est plus grande car partager en 4 donne une plus grande part',
          isCorrect: true,
          explanationAr: 'ممتازة ورائعة! أثبتِ فهمك الحقيقي لمعنى المقام وحجم الأجزاء.',
          explanationEn: 'Outstanding! You demonstrated genuine understanding of fraction denominators.',
          explanationFr: 'Bravo ! Tu as parfaitement compris la règle des dénominateurs.',
        },
        {
          textAr: 'قطعة (١/٨) أكبر لأن الرقم ٨ أكبر من ٤',
          textEn: 'The 1/8 piece is larger because 8 is bigger than 4',
          textFr: 'La part de 1/8 est plus grande car 8 est supérieur à 4',
          isCorrect: false,
          explanationAr: 'انتبهي: ٨ تعني أننا قطعنا الشوكولاتة إلى قطع أكثر بكثير، فصغرت كل قطعة!',
          explanationEn: 'Remember: 8 means we divided into many more tiny pieces, so each piece shrank!',
          explanationFr: 'Attention : plus on découpe en morceaux, plus chaque morceau est petit !',
        },
        {
          textAr: 'القطعتان متساويتان لأن البسط هو ١',
          textEn: 'Both pieces are equal because the numerator is 1',
          textFr: 'Les deux parts sont égales',
          isCorrect: false,
          explanationAr: 'البسط يقول عدد القطع المأخوذة، لكن حجم القطعة يحدده المقام.',
          explanationEn: 'Numerator tells how many pieces taken; denominator determines their size.',
          explanationFr: 'Le dénominateur détermine la taille de chaque morceau.',
        },
      ],
    };
  }

  // 2. Math: Decimals Re-Check (Different number: 2,468 - centièmes)
  if (
    lesson.subjectId === 'subj_math' ||
    lesson.subjectId === 'subj_math_fr' ||
    conceptTitle.includes('عشري') ||
    conceptTitle.includes('ألف') ||
    conceptTitleEn.includes('decimal')
  ) {
    return {
      id: `recheck_${cId}`,
      conceptId: cId,
      promptAr: 'في العدد العشري 2,468 كجم؛ ما هو الرقم الموجود في خانة الأجزاء من مئة (Centièmes)؟',
      promptEn: 'In the decimal number 2.468 kg; which digit is in the hundredths place (Centièmes)?',
      promptFr: 'Dans le nombre 2,468 kg, quel chiffre représente les centièmes ?',
      thinkingPromptAr: `إزاي حددتي الخانة التانية بعد الفاصلة يا ${studentName}؟`,
      thinkingPromptEn: `How did you identify the second place after the decimal point, ${studentName}?`,
      thinkingPromptFr: `Comment as-tu identifié le deuxième rang après la virgule ?`,
      correctIndex: 1,
      options: [
        {
          textAr: 'الرقم 4 (الأجزاء من عشرة)',
          textEn: 'Digit 4 (tenths)',
          textFr: 'Chiffre 4 (dixièmes)',
          isCorrect: false,
          explanationAr: 'الرقم 4 هو أول رقم بعد الفاصلة، أي الأجزاء من عشرة.',
          explanationEn: 'Digit 4 is the first place after decimal, which is tenths.',
          explanationFr: 'Le chiffre 4 représente les dixièmes.',
        },
        {
          textAr: 'الرقم 6 (الأجزاء من مئة)',
          textEn: 'Digit 6 (hundredths)',
          textFr: 'Chiffre 6 (centièmes)',
          isCorrect: true,
          explanationAr: 'رائعة ومتقنة! الرقم 6 هو الخانة الثانية بعد الفاصلة بدقة.',
          explanationEn: 'Well done! Digit 6 is accurately in the hundredths place.',
          explanationFr: 'Parfait ! Le chiffre 6 est exactement aux centièmes.',
        },
        {
          textAr: 'الرقم 8 (الأجزاء من ألف)',
          textEn: 'Digit 8 (thousandths)',
          textFr: 'Chiffre 8 (millièmes)',
          isCorrect: false,
          explanationAr: 'الرقم 8 هو الخانة الثالثة بعد الفاصلة، أي الأجزاء من ألف.',
          explanationEn: 'Digit 8 is the third place, which is thousandths.',
          explanationFr: 'Le chiffre 8 représente les millièmes.',
        },
      ],
    };
  }

  // 3. Science: Plant Needs Re-Check (Dark closet condition)
  if (
    conceptTitle.includes('بناء ضوئي') ||
    conceptTitle.includes('نبات') ||
    conceptTitleEn.includes('photosynthesis') ||
    lesson.id.includes('plant_needs')
  ) {
    return {
      id: `recheck_${cId}`,
      conceptId: cId,
      promptAr: 'إذا وضعنا نباتاً أخضر داخل صندوق معتم تماماً لا يصله أي ضوء، ولكن سقيناه بالماء والتربة بانتظام؛ ماذا سيحدث له ولماذا؟',
      promptEn: 'If we place a green plant in a dark box with regular water and soil but no light; what will happen and why?',
      promptFr: 'Si on place une plante verte dans le noir complet en l’arrosant régulièrement ; que se passera-t-il ?',
      thinkingPromptAr: `اشرحي لي يا ${studentName}، النبات هيقدر يعمل سكر من غير شمس؟`,
      thinkingPromptEn: `Explain ${studentName}, can the plant make sugar without sunlight?`,
      thinkingPromptFr: `Explique-moi ${studentName}, la plante peut-elle fabriquer du sucre sans lumière ?`,
      correctIndex: 0,
      options: [
        {
          textAr: 'سيصفر ويموت، لأنه لا يستطيع تصنيع سكر الجلوكوز دون طاقة ضوء الشمس',
          textEn: 'It will turn yellow and die, because it cannot synthesize glucose without sunlight energy',
          textFr: 'Elle va jaunir et mourir, car elle a besoin de lumière pour fabriquer son sucre',
          isCorrect: true,
          explanationAr: 'تطبيق علمي رائع! أثبتِ استيعابك لدور ضوء الشمس كمصدر طاقة البناء الضوئي.',
          explanationEn: 'Superb scientific application! You mastered the role of light energy.',
          explanationFr: 'Bravo ! Tu as parfaitement assimilé le rôle de la lumière.',
        },
        {
          textAr: 'سينمو بشكل طبيعي، لأن الماء والتربة كافيان تماماً كطعام جاهز',
          textEn: 'It will grow normally, because water and soil are sufficient food',
          textFr: 'Elle poussera normalement avec l’eau et la terre',
          isCorrect: false,
          explanationAr: 'تذكري: الماء وحده لا يكفي؛ ضوء الشمس هو مصدر الطاقة لصنع الغذاء.',
          explanationEn: 'Remember: water alone is not enough; sunlight is the energy source.',
          explanationFr: 'Rappelle-toi : la lumière est indispensable pour la photosynthèse.',
        },
        {
          textAr: 'سينمو أسرع لأن الظلام يريحه من حرارة الشمس',
          textEn: 'It will grow faster because darkness cools it',
          textFr: 'Elle grandira plus vite dans le noir',
          isCorrect: false,
          explanationAr: 'الظلام يمنع عملية البناء الضوئي فيتوقف النبات عن إنتاج طاقته.',
          explanationEn: 'Darkness prevents photosynthesis, stopping plant energy production.',
          explanationFr: 'L’obscurité empêche la photosynthèse.',
        },
      ],
    };
  }

  // 4. Science: Ecosystems Re-Check (Plants disappear)
  if (
    conceptTitle.includes('طاقة') ||
    conceptTitle.includes('غذائية') ||
    conceptTitleEn.includes('ecosystem') ||
    lesson.id.includes('ecosystem')
  ) {
    return {
      id: `recheck_${cId}`,
      conceptId: cId,
      promptAr: 'في بيئة طبيعية، إذا اختفت النباتات الخضراء تماماً بسبب الجفاف؛ ماذا سيحدث للحيوانات آكلة العشب كالأرانب؟',
      promptEn: 'In an ecosystem, if all green plants disappear due to drought; what happens to herbivore rabbits?',
      promptFr: 'Si toutes les plantes vertes disparaissent ; qu’arrive-t-il aux lapins herbivores ?',
      thinkingPromptAr: `إيه اللي هيربط غياب النبات بمصير الأرانب يا ${studentName}؟`,
      thinkingPromptEn: `How does plant loss impact the rabbits, ${studentName}?`,
      thinkingPromptFr: `Explique le lien entre plantes et herbivores, ${studentName}.`,
      correctIndex: 0,
      options: [
        {
          textAr: 'ستموت أو تهاجر، لأنها فقدت مصدر الطاقة والغذاء الأساسي',
          textEn: 'They will starve or migrate, losing their primary energy and food source',
          textFr: 'Ils vont mourir ou migrer, faute de source d’énergie',
          isCorrect: true,
          explanationAr: 'ممتازة! أدركتِ الترابط الحيوي وسريان الطاقة في السلسلة الغذائية.',
          explanationEn: 'Excellent! You clearly understand ecological energy interdependence.',
          explanationFr: 'Très bien ! Tu as bien compris l’interdépendance dans la chaîne alimentaire.',
        },
        {
          textAr: 'ستصنع غذاءها بنفسها من ضوء الشمس كالنباتات',
          textEn: 'They will make their own food from sunlight like plants',
          textFr: 'Ils fabriqueront leur nourriture avec le soleil',
          isCorrect: false,
          explanationAr: 'الحيوانات مستهلكة فقط وليست منتجة؛ لا تستطيع عمل بناء ضوئي.',
          explanationEn: 'Animals are consumers; they cannot perform photosynthesis.',
          explanationFr: 'Les animaux sont des consommateurs, pas des producteurs.',
        },
        {
          textAr: 'ستتغذى على الثعالب المفترسة بدلاً من النبات',
          textEn: 'They will feed on predator foxes instead of plants',
          textFr: 'Ils mangeront les renards',
          isCorrect: false,
          explanationAr: 'الأرانب كائنات عاشبة لا تفترس اللحوم.',
          explanationEn: 'Rabbits are herbivores, not predators.',
          explanationFr: 'Le lapin est herbivore.',
        },
      ],
    };
  }

  // 5. Arabic Grammar Re-Check (كتب التلميذ الدرس - مفعول به)
  if (
    conceptTitle.includes('فاعل') ||
    conceptTitle.includes('مفعول') ||
    conceptTitle.includes('نحو')
  ) {
    return {
      id: `recheck_${cId}`,
      conceptId: cId,
      promptAr: 'في الجملة: «كَتَبَ التِّلْمِيذُ الدَّرْسَ»، أين المفعول به (الذي وقع عليه فعل الكتابة)؟',
      promptEn: 'In: "كَتَبَ التِّلْمِيذُ الدَّرْسَ", where is the direct object (المفعول به)?',
      promptFr: 'Dans la phrase arabe, quel est le complément d’objet (المفعول به) ?',
      thinkingPromptAr: `إزاي ميزتي بين اللي عمل الفعل واللي اتعمل فيه الفعل يا ${studentName}؟`,
      thinkingPromptEn: `How did you distinguish the actor from the action receiver, ${studentName}?`,
      thinkingPromptFr: `Comment as-tu distingué le sujet et l’objet, ${studentName} ?`,
      correctIndex: 0,
      options: [
        {
          textAr: '«الدَّرْسَ»، لأنه الشيء الذي كُتِبَ (منصوب بالفتحة)',
          textEn: '"The lesson", because it was the thing written (marked with fatha)',
          textFr: '«La leçon» (مفعول به)',
          isCorrect: true,
          explanationAr: 'برافو يا أمينة! إعراب دقيق وتمييز رائع بين الفاعل والمفعول به.',
          explanationEn: 'Bravo Amina! Accurate distinction between subject and object.',
          explanationFr: 'Bravo ! Excellente distinction sujet / objet.',
        },
        {
          textAr: '«التِّلْمِيذُ»، لأنه جاء في منتصف الجملة',
          textEn: '"The student", because it is in the middle',
          textFr: '«L’élève»',
          isCorrect: false,
          explanationAr: '«التلميذُ» هو الفاعل الذي قام بالكتابة، وليس المفعول به.',
          explanationEn: '"The student" is the subject who wrote, not the object.',
          explanationFr: '«L’élève» est le sujet qui écrit.',
        },
        {
          textAr: '«كَتَبَ»، لأنها تدل على الحدث',
          textEn: '"Wrote", because it indicates action',
          textFr: '«A écrit»',
          isCorrect: false,
          explanationAr: '«كَتَبَ» هو الفعل نفسه، وليس المفعول به.',
          explanationEn: '"Wrote" is the verb itself.',
          explanationFr: '«A écrit» est le verbe.',
        },
      ],
    };
  }

  // 6. French Re-Check: Quel âge as-tu ?
  if (lesson.subjectId === 'subj_french') {
    return {
      id: `recheck_${cId}`,
      conceptId: cId,
      promptAr: 'عندما يسألكِ صديقكِ في المدرسة: «Quel âge as-tu ?»؛ ماذا تجيبين؟',
      promptEn: 'When your classmate asks: "Quel âge as-tu ?"; how do you answer?',
      promptFr: 'Quand un camarade te demande: «Quel âge as-tu ?»; que réponds-tu ?',
      thinkingPromptAr: `إيه الفرق بين السؤال ده وسؤال الاسم يا ${studentName}؟`,
      thinkingPromptEn: `What is the difference between this and the name question, ${studentName}?`,
      thinkingPromptFr: `Quelle est la différence avec la question du prénom, ${studentName} ?`,
      correctIndex: 0,
      options: [
        {
          textAr: 'J’ai 10 ans.',
          textEn: 'J’ai 10 ans.',
          textFr: 'J’ai 10 ans.',
          isCorrect: true,
          explanationAr: 'ممتازة! إجابة صحيحة باستخدام فعل avoir للتعبير عن السن.',
          explanationEn: 'Excellent! Accurate use of avoir for stating age.',
          explanationFr: 'Bravo ! Utilisation exacte de avoir pour l’âge.',
        },
        {
          textAr: 'Je m’appelle Amina.',
          textEn: 'Je m’appelle Amina.',
          textFr: 'Je m’appelle Amina.',
          isCorrect: false,
          explanationAr: 'انتبهي: «Je m’appelle» للإجابة عن الاسم، بينما «Quel âge» للسؤال عن السن.',
          explanationEn: 'Notice: "Je m’appelle" is for names; "Quel âge" asks for age.',
          explanationFr: 'Attention : «Je m’appelle» est pour le nom, pas pour l’âge.',
        },
        {
          textAr: 'Très bien, merci.',
          textEn: 'Très bien, merci.',
          textFr: 'Très bien, merci.',
          isCorrect: false,
          explanationAr: 'هذه إجابة عن «Comment ça va ?» وليست إجابة عن السن.',
          explanationEn: 'This answers "How are you?", not age.',
          explanationFr: 'Ceci répond à «Comment ça va ?».',
        },
      ],
    };
  }

  // 7. General Fallback Recheck from second exercise or concept key points
  const secondEx = lesson.exercises?.[1] || lesson.exercises?.[0];
  const expected = secondEx?.expectedAnswer || concept?.keyPoints?.[1] || lesson.objectives[0] || 'الإجابة المنهجية المعتمدة';

  return {
    id: `recheck_${cId}`,
    conceptId: cId,
    promptAr: secondEx?.question || `تطبيق جديد على درس «${lesson.titleAr}»: ما هي النتيجة الصحيحة؟`,
    promptEn: secondEx?.question || `New application for "${lesson.titleEn}": what is correct?`,
    promptFr: secondEx?.question || `Nouvelle application de «${lesson.titleEn}» : quelle est la réponse ?`,
    thinkingPromptAr: `اشرحي لي يا ${studentName} إزاي طبقتي القاعدة اللي شرحناها هنا؟`,
    thinkingPromptEn: `Explain ${studentName} how you applied our rule here?`,
    thinkingPromptFr: `Explique comment tu as appliqué la règle, ${studentName}.`,
    correctIndex: 0,
    options: [
      {
        textAr: expected,
        textEn: expected,
        textFr: expected,
        isCorrect: true,
        explanationAr: 'رائعة! تطبيق صحيح ومباشر للقاعدة التعليمية.',
        explanationEn: 'Great! Correct application of the learning rule.',
        explanationFr: 'Très bien ! Application correcte.',
      },
      {
        textAr: secondEx?.options?.find((o) => o !== expected) || 'عكس المفهوم المطلوب',
        textEn: 'Opposite idea',
        textFr: 'Idée contraire',
        isCorrect: false,
        explanationAr: 'انتبهي لمراجعة خطوات القاعدة جيداً.',
        explanationEn: 'Review the steps carefully.',
        explanationFr: 'Revois les étapes attentivement.',
      },
      {
        textAr: 'إجابة عامة غير دقيقة',
        textEn: 'Vague non-specific answer',
        textFr: 'Réponse vague',
        isCorrect: false,
        explanationAr: 'المطلوب تطبيق القاعدة المحددة من كتاب الوزارة.',
        explanationEn: 'Apply the specific textbook rule.',
        explanationFr: 'Applique la règle exacte.',
      },
    ],
  };
}

/**
 * Builds targeted pedagogical intervention based on the diagnosed need and selected strategy.
 * Instead of repeating generic text, Miss Nour directly addresses the misconception or prerequisite.
 */
export function buildTargetedIntervention(
  lesson: OfficialCurriculumLesson | null,
  concept: CurriculumLessonConcept | null,
  studentName: string,
  diagnosisType: ErrorDiagnosisType,
  strategy: TeachingStrategy
): TargetedTeachingContent {
  if (!lesson) {
    return {
      headlineAr: 'توجيه تعليمي',
      headlineEn: 'Learning Guidance',
      headlineFr: 'Orientation pédagogique',
      coreExplanationAr: `يا أهلاً يا ${studentName}! حددي درساً من المنهج لنبدأ رحلة الشرح التفاعلي خطوة بخطوة.`,
      coreExplanationEn: `Hello ${studentName}! Please select a lesson from the curriculum to start our guided session.`,
      coreExplanationFr: `Bonjour ${studentName}! Choisis une leçon pour commencer.`,
      contrastOrAnalogyAr: '',
      contrastOrAnalogyEn: '',
      contrastOrAnalogyFr: '',
      keyRuleAr: '',
      keyRuleEn: '',
      keyRuleFr: '',
      strategy,
    };
  }

  const isFraction =
    (concept?.titleAr || lesson.titleAr).includes('كسر') ||
    (concept?.titleAr || lesson.titleAr).includes('كسور');

  const isDecimal =
    (concept?.titleAr || lesson.titleAr).includes('عشري') ||
    lesson.subjectId === 'subj_math' ||
    lesson.subjectId === 'subj_math_fr';

  const isScience =
    lesson.subjectId === 'subj_science' ||
    lesson.subjectId === 'subj_science_fr';

  const isFrench = lesson.subjectId === 'subj_french';

  // 1. Fractions Misconception: Larger Denominator = Smaller Pieces
  if (isFraction && (diagnosisType === 'misconception' || strategy === 'visual_model')) {
    return {
      headlineAr: `رسم توضيحي للمقام مع مس نور 🍕`,
      headlineEn: `Visual Denominator Model with Miss Nour 🍕`,
      headlineFr: `Modèle visuel du dénominateur avec Maîtresse Nour 🍕`,
      coreExplanationAr: `عارفة يا ${studentName}، في الأعداد العادية ٥ أكبر من ٣. لكن في الكسور، الرقم اللي تحت (المقام) بيعبر عن عدد القطع اللي بنقسم عليها الحاجه كلها! لو قسمنا نفس البيتزا على ٣ أصحاب، كل واحد هياخد شريحة كبيرة ومشبعة. لكن لو قسمنا نفس البيتزا على ٥ أصحاب، هنضطر نصغّر كل قطعة عشان تكفي الجميع!`,
      coreExplanationEn: `In regular whole numbers, 5 is larger than 3. But in fractions, the bottom number (denominator) represents how many slices we divide the whole into! Sharing a pizza among 3 gives each friend a big generous slice. Sharing among 5 forces us to cut much smaller pieces!`,
      coreExplanationFr: `En nombres entiers, 5 est plus grand que 3. Mais dans les fractions, le dénominateur indique en combien de parts on découpe ! Plus on partage entre amis, plus chaque part est petite !`,
      contrastOrAnalogyAr: `نموذج المقارنة البصرية:\n🍰 (١/٣): البيتزا مقطوعة لـ ٣ قطع كبيرة فقط.\n🍕 (١/٥): نفس البيتزا مقطوعة لـ ٥ قطع أصغر حجماً.\nالقاعدة الذهبية: كلما زاد المقام، صغر حجم الجزء المتساوي!`,
      contrastOrAnalogyEn: `Visual contrast:\n🍰 (1/3): Pizza divided into only 3 big slices.\n🍕 (1/5): Same pizza divided into 5 smaller slices.\nGolden Rule: Larger denominator = Smaller slice!`,
      contrastOrAnalogyFr: `Contraste visuel :\n🍰 1/3 = 3 grandes parts.\n🍕 1/5 = 5 petites parts.\nRègle d'or : Plus le dénominateur est grand, plus la part est petite !`,
      keyRuleAr: `المقام الأكبر = قطع أصغر حجماً! (١/٣ > ١/٥)`,
      keyRuleEn: `Larger denominator = Smaller slices! (1/3 > 1/5)`,
      keyRuleFr: `Plus grand dénominateur = parts plus petites ! (1/3 > 1/5)`,
      strategy: 'visual_model',
    };
  }

  // 2. Decimals Place Value Misconception: Tenths vs Hundredths vs Thousandths
  if (isDecimal && (diagnosisType === 'misconception' || strategy === 'step_by_step_procedure')) {
    return {
      headlineAr: `ترتيب الخانات العشرية خطوة بخطوة 📝`,
      headlineEn: `Decimal Place Value Step-by-Step 📝`,
      headlineFr: `Les rangs décimaux pas à pas 📝`,
      coreExplanationAr: `بعد الفاصلة العشرية، كل خانة لها اسم وقيمة محددة يا ${studentName}:\n١. الخانة الأولى بعد الفاصلة: أجزاء من عشرة (Dixièmes - 0,1).\n٢. الخانة الثانية بعد الفاصلة: أجزاء من مئة (Centièmes - 0,01).\n٣. الخانة الثالثة بعد الفاصلة: أجزاء من ألف (Millièmes - 0,001).\nفي العدد 0,875: الرقم 8 أجزاء من عشرة، و7 أجزاء من مئة، و5 أجزاء من ألف!`,
      coreExplanationEn: `After the decimal point, each position has a specific place value:\n1. First place: Tenths (0.1)\n2. Second place: Hundredths (0.01)\n3. Third place: Thousandths (0.001)\nIn 0.875: 8 is tenths, 7 is hundredths, 5 is thousandths!`,
      coreExplanationFr: `Après la virgule :\n1. Premier rang = Dixièmes (0,1)\n2. Deuxième rang = Centièmes (0,01)\n3. Troisième rang = Millièmes (0,001)\nDans 0,875 : 8 dixièmes, 7 centièmes, 5 millièmes !`,
      contrastOrAnalogyAr: `تذكري مثال ميزان السوبرماركت الإلكتروني: الكيلوجرام فيه 1000 جرام، فالخانة التالتة هي الجرامات الدقيقة!`,
      contrastOrAnalogyEn: `Remember a digital kitchen scale: 1 kg has 1,000 grams, so the 3rd place represents exact grams!`,
      contrastOrAnalogyFr: `Dans 1 kg il y a 1000 grammes, le troisième rang donne les grammes précis !`,
      keyRuleAr: `الخانة الأولى = عشرة | الثانية = مئة | الثالثة = ألف`,
      keyRuleEn: `1st place = tenths | 2nd = hundredths | 3rd = thousandths`,
      keyRuleFr: `1er = dixièmes | 2e = centièmes | 3e = millièmes`,
      strategy: 'step_by_step_procedure',
    };
  }

  // 3. Science: Plants & Photosynthesis (Sunlight vs Soil)
  if (isScience && (diagnosisType === 'misconception' || strategy === 'visual_model')) {
    return {
      headlineAr: `سر مطبخ النبات الأخضر والطاقة الشمسية ☀️🌱`,
      headlineEn: `The Green Plant Kitchen & Solar Power ☀️🌱`,
      headlineFr: `La cuisine végétale et l'énergie solaire ☀️🌱`,
      coreExplanationAr: `كتير من الناس بيفكروا إن النبات بياكل التراب كطعام جاهز يا ${studentName}، لكن الحقيقة العلمية مدهشة:\nالجذور بتمتص بس الماء والأملاح المعدنية من التربة، وبتبعتها عبر أنابيب الخشب (Xylem) للورقة.\nوفي الورقة الخضراء، مادة الكلوروفيل بتمتص ضوء الشمس زي الفرن الشمسي، وبتخلط المية مع ثاني أكسيد الكربون لصنع سكر الجلوكوز!`,
      coreExplanationEn: `Many think plants eat soil directly, ${studentName}, but the real science is fascinating:\nRoots only absorb water and minerals from soil and send them through xylem tubes up to leaves.\nIn green leaves, chlorophyll absorbs sunlight like a solar oven, combining water and CO2 to bake glucose sugar!`,
      coreExplanationFr: `La plante ne mange pas la terre ! Les racines absorbent l'eau et les sels minéraux. Les feuilles captent la lumière du soleil pour fabriquer le sucre glucose par photosynthèse !`,
      contrastOrAnalogyAr: `تخيلي مطبخ البيت: التربة بتدينا المقادير الخام (الماء)، لكن الفرن اللي بيخبز كعكة السكر هو ضوء الشمس! بدون شمس لا يوجد طعام!`,
      contrastOrAnalogyEn: `Think of a kitchen: soil provides the raw water ingredient, but sunlight is the oven baking the sugar meal!`,
      contrastOrAnalogyFr: `L'eau est l'ingrédient, mais le soleil est le four indispensable !`,
      keyRuleAr: `النبات يصنع طعامه بنفسه بضوء الشمس وليس بأكل التربة!`,
      keyRuleEn: `Plants produce food using sunlight, not by eating soil!`,
      keyRuleFr: `La plante fabrique sa nourriture grâce à la lumière du soleil !`,
      strategy: 'visual_model',
    };
  }

  // 4. French: Name vs Age Confusion (s'appeler vs avoir l'âge)
  if (isFrench && (diagnosisType === 'vocabulary_confusion' || strategy === 'bilingual_vocabulary')) {
    return {
      headlineAr: `التمييز بين السؤال عن الاسم والعمر بالفرنسية 📘`,
      headlineEn: `Name vs Age in French: S'appeler vs Avoir 📘`,
      headlineFr: `Différencier Nom et Âge en Français 📘`,
      coreExplanationAr: `في اللغة الفرنسية يا ${studentName}، لازم نميز بين سؤالين مهمين:\n١. «Comment tu t’appelles ?» ⬅️ السؤال عن الاسم (الرد: Je m’appelle Amina).\n٢. «Quel âge as-tu ?» ⬅️ السؤال عن السن والعمر (الرد: J’ai 10 ans).\nكلمة «appeler» تعني ينادي أو يسمى، وكلمة «âge» و «ans» تعني العمر والسنوات!`,
      coreExplanationEn: `In French, ${studentName}, distinguish between two key questions:\n1. "Comment tu t’appelles ?" ⬅️ Asking for name (Answer: Je m’appelle Amina).\n2. "Quel âge as-tu ?" ⬅️ Asking for age (Answer: J’ai 10 ans).\n"Appeler" means to call by name; "âge / ans" means age and years!`,
      coreExplanationFr: `Ne confonds pas :\n1. «Comment tu t’appelles ?» ➔ Je m’appelle...\n2. «Quel âge as-tu ?» ➔ J’ai ... ans.`,
      contrastOrAnalogyAr: `تذكري دائماً:\n• t'appelles ➔ Amina (الاسم)\n• âge / ans ➔ 10 (الرقم والعمر)`,
      contrastOrAnalogyEn: `Always remember:\n• t'appelles ➔ Amina (Name)\n• âge / ans ➔ 10 (Age number)`,
      contrastOrAnalogyFr: `• t'appelles = prénom\n• ans = âge`,
      keyRuleAr: `s'appeler للاسم | avoir ans للعمر`,
      keyRuleEn: `s'appeler for name | avoir ans for age`,
      keyRuleFr: `s'appeler pour le nom | avoir ans pour l'âge`,
      strategy: 'bilingual_vocabulary',
    };
  }

  // 5. Default Targeted Intervention from Concept Metadata
  return {
    headlineAr: `شرح مركز ومبسط لقاعدة درس «${lesson.titleAr}» 💡`,
    headlineEn: `Targeted Concept Breakdown for "${lesson.titleEn}" 💡`,
    headlineFr: `Explication ciblée pour «${lesson.titleEn}» 💡`,
    coreExplanationAr: `يا ${studentName}، القاعدة الأساسية في كتاب الوزارة هي: ${concept?.sourceText || lesson.objectives[0] || 'تطبيق الخطوات المنهجية بدقة'}. المهم نركز على تسلسل الخطوات وفهم المعنى قبل الحل.`,
    coreExplanationEn: `The core textbook principle, ${studentName}, is: ${concept?.sourceText || lesson.objectives[0] || 'Methodical application'}. Focus on the step sequence and understanding.`,
    coreExplanationFr: `Le principe fondamental est : ${concept?.sourceText || lesson.objectives[0] || 'Application rigoureuse'}.`,
    contrastOrAnalogyAr: concept?.dailyLifeExampleAr || concept?.storyAnalogyAr || `مثل خطوات تركيب أي شيء بنجاح: خطوة بخطوة بالترتيب الصحيح!`,
    contrastOrAnalogyEn: concept?.dailyLifeExampleEn || `Like building anything successfully: one step at a time!`,
    contrastOrAnalogyFr: `Comme tout travail bien fait : étape par étape !`,
    keyRuleAr: concept?.keyPoints?.[0] || lesson.objectives[0] || 'التركيز والتطبيق المنهجي المباشر',
    keyRuleEn: concept?.keyPoints?.[0] || 'Methodical focus and application',
    keyRuleFr: 'Rigueur et méthode',
    strategy: strategy || 'guided_practice',
  };
}

/**
 * Deterministically analyzes Amina's typed or spoken reasoning.
 * Classifies reasoning into 8 distinct categories, detecting guessing,
 * specific misconceptions, prerequisite gaps, and distinguishing sound from weak reasoning.
 */
export function analyzeStudentReasoning(
  reasoningText: string,
  selectedOption: DiagnosticOption,
  concept: CurriculumLessonConcept | null,
  lesson: OfficialCurriculumLesson,
  language: Language
): ReasoningAnalysisResult {
  const text = (reasoningText || '').trim().toLowerCase();
  const isAr = language === 'ar';
  const isFr = language === 'fr';

  // 1. Unclear / Missing Reasoning (insufficient input)
  if (text.length === 0) {
    return {
      category: 'unclear_reasoning',
      confidence: 'low',
      explanationAr: 'لم تسجل أمينة تعليلاً كافياً؛ نحتاج لسؤال استكشافي لتحديد طريقة تفكيرها بدقة.',
      explanationEn: 'No reasoning text provided; exploratory questioning needed.',
      explanationFr: 'Aucun raisonnement fourni ; questionnement nécessaire.',
      recommendedPedagogicalAction: 'clarify_thinking_with_new_example',
    };
  }

  // 2. Guessing Detection
  const guessingTerms = [
    'تخمين', 'مش عارفة', 'مش متاكدة', 'مش متأكدة', 'حظ', 'يمكن', 'شكيت',
    'اخترت وخلاص', 'ماعرفش', 'ضربة حظ', 'حسيت كدة', 'بالبركة',
    'guess', 'guessed', 'guessing', 'not sure', 'lucky', 'maybe', 'just picked', 'dunno', 'no idea',
    'au hasard', 'hasard', 'pas sûre', 'je ne sais pas', 'peut-être', 'deviné',
  ];
  const isGuessing = guessingTerms.some((term) => text.includes(term));
  if (isGuessing) {
    return {
      category: 'guessing',
      confidence: 'high',
      explanationAr: 'أمينة تعتمد على التخمين أو غير متأكدة من إجابتها؛ لا يمكن اعتماد الإتقان قبل توضيح القاعدة وتثبيتها.',
      explanationEn: 'Student is guessing or uncertain; cannot assume mastery without reinforcing the rule.',
      explanationFr: 'L’élève devine ou hésite ; consolidation nécessaire avant validation.',
      recommendedPedagogicalAction: 'guided_step_by_step',
    };
  }

  // 3. Prerequisite Gap Detection
  const prerequisiteGapTerms = [
    'مش فاكرة يعني ايه', 'نسيت', 'مش فاهمة الأساس', 'يعني ايه كسر أصلاً', 'ما أخدتهاش', 'ما درستهاش',
    'يعني إيه بسط', 'يعني إيه مقام', 'نسيت الدرس القديم',
    'forgot', "don't know what", 'forgot the basics', 'never learned', "what is fraction",
    'oublié', 'pas compris les bases', 'jamais appris', "c'est quoi",
  ];
  const isPrerequisiteGap = prerequisiteGapTerms.some((term) => text.includes(term)) ||
    selectedOption.diagnosisType === 'missing_prerequisite';
  if (isPrerequisiteGap && (!selectedOption.isCorrect || text.includes('نسيت') || text.includes('مش فاكرة'))) {
    return {
      category: 'prerequisite_gap',
      confidence: 'high',
      explanationAr: 'فجوة في المتطلبات الأساسية السابقة للدرس؛ يجب تثبيت الأساسيات والمفاهيم التمهيدية أولاً.',
      explanationEn: 'Prerequisite foundational gap detected; foundational material needed first.',
      explanationFr: 'Lacune dans les prérequis fondamentaux ; révision de base nécessaire.',
      recommendedPedagogicalAction: 'reinforce_prerequisite',
    };
  }

  // 4. Vocabulary / Language Difficulty Detection
  const vocabConfusionTerms = [
    'مش فاهمة الكلمة', 'المصطلح ملخبطني', 'الكلمة بالفرنسي', 'مش عارفة معنى',
    'الترجمة', 'الكلمات شبه بعض',
    'confused the word', "don't know this word", 'vocabulary', 'term translation',
    'le mot', 'pas compris le terme', 'vocabulaire', 'traduction',
  ];
  const isVocabDifficulty = vocabConfusionTerms.some((term) => text.includes(term)) ||
    selectedOption.diagnosisType === 'vocabulary_confusion';
  if (isVocabDifficulty) {
    return {
      category: 'vocabulary_difficulty',
      confidence: 'high',
      explanationAr: 'صعوبة لغوية أو التباس في المصطلحات والمفردات ثنائية اللغة.',
      explanationEn: 'Language or bilingual terminology difficulty detected.',
      explanationFr: 'Difficulté avec le vocabulaire bilingue.',
      recommendedPedagogicalAction: 'bilingual_clarification',
    };
  }

  // 5. Specific Conceptual Misconceptions
  // Fraction denominator misconception:
  const fractionMisconceptionTerms = [
    'المقام أكبر', '٥ أكبر من ٣', '5 اكبر من 3', 'الرقم الكبير', 'خمسة أكبر',
    'عشان 5 أكبر', 'الخمسة اكبر', 'علشان ٥', 'الرقم 5 كبير',
    'denominator is bigger', '5 is bigger', 'bigger denominator', 'larger number',
    'plus grand nombre', '5 est plus grand',
  ];
  if (fractionMisconceptionTerms.some((t) => text.includes(t)) || (!selectedOption.isCorrect && selectedOption.diagnosisType === 'misconception')) {
    return {
      category: 'misconception',
      confidence: 'high',
      explanationAr: 'سوء فهم تصوري محدد: تطبيق قاعدة الأعداد الصحيحة على مقامات الكسور أو عكس معنى المفهوم.',
      explanationEn: 'Specific conceptual misconception: applying whole number intuition to fraction denominators.',
      explanationFr: 'Erreur conceptuelle spécifique identifiée.',
      detectedMisconceptionKey: 'denominator_magnitude_misconception',
      recommendedPedagogicalAction: 'target_misconception',
    };
  }

  // Science plant needs misconception (soil as food):
  const plantMisconceptionTerms = ['بتاكل تراب', 'بتاكل طين', 'التربة طعام', 'التربة هي الأكل', 'eats soil', 'soil is food', 'terre est nourriture'];
  if (plantMisconceptionTerms.some((t) => text.includes(t))) {
    return {
      category: 'misconception',
      confidence: 'high',
      explanationAr: 'سوء فهم بيولوجي: افتراض أن التربة طعام جاهز بدلاً من إدراك دور البناء الضوئي.',
      explanationEn: 'Biological misconception: assuming soil is food rather than understanding photosynthesis.',
      explanationFr: 'Idée fausse biologique : penser que le sol est la nourriture de la plante.',
      detectedMisconceptionKey: 'soil_eating_misconception',
      recommendedPedagogicalAction: 'target_misconception',
    };
  }

  // 6. Procedural or Calculation Error
  const proceduralTerms = [
    'حسبت غلط', 'جمعت بدل ما أطرح', 'بدلت الخانات', 'تلخبطت في الحساب', 'خطوات ملخبطة',
    'miscalculated', 'added instead of subtracted', 'swapped positions', 'calculation slip',
    'erreur de calcul', 'inversé les rangs',
  ];
  if (proceduralTerms.some((t) => text.includes(t)) || selectedOption.diagnosisType === 'calculation_or_procedure') {
    return {
      category: 'procedural_error',
      confidence: 'high',
      explanationAr: 'خطأ إجرائي أو حسابي في تسلسل الخطوات مع وضوح الفكرة العامة.',
      explanationEn: 'Procedural or calculation step error with basic concept intact.',
      explanationFr: 'Erreur de procédure ou de calcul.',
      recommendedPedagogicalAction: 'guided_step_by_step',
    };
  }

  // 7. Sound / Correct Reasoning
  if (selectedOption.isCorrect) {
    const soundCausalTerms = [
      'لأن', 'عشان', 'علشان', 'قسمنا', 'نصيب', 'أجزاء', 'كلما', 'صغر', 'بما أن',
      'قطعة', 'التقسيم', 'مقام', 'شمس', 'بناء ضوئي', 'فاعل', 'أنا أستطيع', 's’appeler',
      'because', 'since', 'divide', 'divided', 'share', 'shared', 'parts', 'smaller', 'pieces',
      'parce que', 'car', 'partagé', 'divisé', 'parts', 'morceau',
    ];
    const hasCausalExplanation = soundCausalTerms.some((term) => text.includes(term));

    // If student gave a rich causal justification:
    if (hasCausalExplanation && text.length >= 8) {
      return {
        category: 'correct_reasoning',
        confidence: 'high',
        explanationAr: 'تفكير سليم ومنطقي يعلل الإجابة بناءً على الفهم الحقيقي للمفهوم.',
        explanationEn: 'Sound, logical reasoning justifying the answer through genuine concept comprehension.',
        explanationFr: 'Raisonnement rigoureux et fondé sur la compréhension réelle.',
        recommendedPedagogicalAction: 'praise_and_challenge',
      };
    }

    // If answer is correct but reasoning is minimal / terse (e.g. "صح وخلاص", "it's right")
    if (text.length < 8 || text.includes('صح وخلاص') || text.includes('كده') || text.includes('yes')) {
      return {
        category: 'incomplete_reasoning',
        confidence: 'medium',
        explanationAr: 'الإجابة صحيحة ولكن التعليل مختصر أو سطحي؛ نحتاج لتأكيد الفهم بمثال تطبيقي جديد.',
        explanationEn: 'Answer is correct but reasoning is brief or surface-level; verification on new example needed.',
        explanationFr: 'Réponse correcte mais justification incomplète ; vérification requise.',
        recommendedPedagogicalAction: 'clarify_thinking_with_new_example',
      };
    }
  }

  // 8. Incomplete or Unclear Reasoning (Fallback avoiding false certainty)
  return {
    category: 'unclear_reasoning',
    confidence: 'medium',
    explanationAr: 'التعليل غير واضح تماماً؛ سنختبر الفهم بمثال جديد وتوجيه لطيف لنتبين طريقة التفكير.',
    explanationEn: 'Reasoning is ambiguous; Miss Nour will test understanding on a new guided example.',
    explanationFr: 'Raisonnement encore ambigu ; nous allons clarifier avec un nouvel exemple guidé.',
    recommendedPedagogicalAction: 'clarify_thinking_with_new_example',
  };
}

export interface TeachingOutcomeEvaluationParams {
  initialDiagnosticCorrect: boolean;
  initialReasoningCategory: ReasoningCategory;
  recheckCorrect: boolean;
  recheckReasoningCategory: ReasoningCategory;
  attemptsCount: number;
}

/**
 * Determines the genuine teaching outcome based on the complete pedagogical chain:
 * Answer 1 + Reasoning 1 -> Teaching Intervention -> Answer 2 + Reasoning 2.
 */
export function evaluateTeachingOutcome(params: TeachingOutcomeEvaluationParams): {
  outcome: TeachingDecisionOutcome;
  rationaleAr: string;
  rationaleEn: string;
  rationaleFr: string;
  evidenceCorrectness: 'full' | 'partial' | 'wrong';
  evidenceIndependence: 'unassisted' | 'hinted' | 'revealed';
  reviewIntervalDays: number;
} {
  const {
    initialDiagnosticCorrect,
    initialReasoningCategory,
    recheckCorrect,
    recheckReasoningCategory,
    attemptsCount: _attemptsCount,
  } = params;

  // Outcome 5: NOT_YET_LEARNED (Missing prerequisite foundations)
  if (
    initialReasoningCategory === 'prerequisite_gap' ||
    recheckReasoningCategory === 'prerequisite_gap'
  ) {
    return {
      outcome: 'not_yet_learned',
      rationaleAr: 'تم رصد فجوة في المتطلبات الأساسية السابقة للدرس؛ يجب تثبيت الأساسيات أولاً قبل التقدم في هذا المفهوم.',
      rationaleEn: 'Prerequisite knowledge gap detected; foundational material must be mastered before progressing.',
      rationaleFr: 'Prérequis manquant ; consolidation des bases requise avant de poursuivre.',
      evidenceCorrectness: 'wrong',
      evidenceIndependence: 'revealed',
      reviewIntervalDays: 1,
    };
  }

  // Outcome 1: MASTERED
  // Must demonstrate correct answer AND sound reasoning on the re-check example
  if (
    recheckCorrect &&
    (recheckReasoningCategory === 'correct_reasoning' ||
      (initialDiagnosticCorrect && initialReasoningCategory === 'correct_reasoning'))
  ) {
    const isUnassisted = initialDiagnosticCorrect && initialReasoningCategory === 'correct_reasoning';
    return {
      outcome: 'mastered',
      rationaleAr: 'إتقان تام مثبت! أجابت أمينة بشكل صحيح مع تعليل منطقي سليم على مثال تطبيقي جديد.',
      rationaleEn: 'Fully mastered! Amina answered correctly with sound reasoning verified on a new example.',
      rationaleFr: 'Parfaitement maîtrisé ! Réponse exacte avec raisonnement rigoureux sur un nouvel exemple.',
      evidenceCorrectness: 'full',
      evidenceIndependence: isUnassisted ? 'unassisted' : 'hinted',
      reviewIntervalDays: 14,
    };
  }

  // Outcome 2: ALMOST
  // Re-check is correct, but reasoning has minor incompleteness / uncertainty
  if (recheckCorrect) {
    return {
      outcome: 'almost',
      rationaleAr: 'استيعاب جيد جداً ومقارب للإتقان؛ الإجابة صحيحة مع حاجة لتمرين تطبيقي إضافي لتثبيت الثقة التامة.',
      rationaleEn: 'Almost mastered! Correct answer with minor reasoning weakness; one targeted exercise needed.',
      rationaleFr: 'Presque maîtrisé ! Bonne réponse, un exercice ciblé renforcera la confiance.',
      evidenceCorrectness: 'partial',
      evidenceIndependence: 'hinted',
      reviewIntervalDays: 3,
    };
  }

  // If re-check failed:
  // Outcome 3: MISCONCEPTION
  if (
    recheckReasoningCategory === 'misconception' ||
    initialReasoningCategory === 'misconception'
  ) {
    return {
      outcome: 'misconception',
      rationaleAr: 'استمرار سوء الفهم التصوري رغم الشرح الأولي؛ يتطلب إعادة الشرح بزاوية بصرية أو قصة تشبيهية بديلة.',
      rationaleEn: 'Persistent misconception detected; requires reteaching through an alternative visual or analogy angle.',
      rationaleFr: 'Idée fausse persistante ; réexplication nécessaire sous un autre angle.',
      evidenceCorrectness: 'wrong',
      evidenceIndependence: 'revealed',
      reviewIntervalDays: 1,
    };
  }

  // Outcome 4: STRUGGLING
  return {
    outcome: 'struggling',
    rationaleAr: 'صعوبة متكررة في اجتياز السؤال التطبيقي؛ المفهوم بحاجة إلى تبسيط متدرج وجدولة مراجعة قريبة غداً.',
    rationaleEn: 'Repeated difficulty after intervention; concept requires simplification and review scheduled tomorrow.',
    rationaleFr: 'Difficulté persistante ; simplification et révision rapide prévues.',
    evidenceCorrectness: 'wrong',
    evidenceIndependence: 'revealed',
    reviewIntervalDays: 1,
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
 * Safely handles missing students/lessons without introducing fake curriculum or fake models.
 */
export function buildNormalizedTeacherContext(
  params: TeacherContextBuildParams
): NormalizedTeacherContext {
  const {
    student,
    currentDayRecord,
    masteryRecords = {},
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

  // 1. Resolve Target Lesson safely from authoritative curriculum
  const allLessons = curriculumService.getAllLessons();
  let targetLesson: OfficialCurriculumLesson | null = null;

  const targetLessonId =
    explicitLessonId ||
    companionContext?.lessonId ||
    nextPendingMission?.lessonId;

  if (targetLessonId) {
    targetLesson = curriculumService.getLessonById(targetLessonId) || null;
  }

  // If no explicit lesson ID, match with today's school record
  if (!targetLesson && currentDayRecord?.lessonsCovered && currentDayRecord.lessonsCovered.length > 0) {
    const todayFirst = currentDayRecord.lessonsCovered[0];
    targetLesson = allLessons.find(
      (l) =>
        l.subjectNameAr.includes(todayFirst.subject) ||
        todayFirst.subject.includes(l.subjectNameAr) ||
        (todayFirst.topic && l.titleAr.includes(todayFirst.topic))
    ) || null;
  }

  // No verified learning target means no teaching target.
  // Never silently substitute the first curriculum lesson.

  // 2. Resolve Target Concept
  const targetConcept = targetLesson
    ? (companionContext?.conceptId &&
        targetLesson.concepts.find((c) => c.id === companionContext.conceptId)) ||
      (nextPendingMission?.conceptId &&
        targetLesson.concepts.find((c) => c.id === nextPendingMission.conceptId)) ||
      targetLesson.concepts[0] ||
      null
    : null;

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

  if (contextSource === 'homework' && targetLesson) {
    recommendedReason = isAr
      ? `تم تسجيل واجب مدرسي في «${targetLesson.subjectNameAr}» يجب إنجازه اليوم بثقة ودون تراكم.`
      : `Pending homework assigned today in "${targetLesson.subjectNameEn}".`;
    recommendedNextAction = isAr ? 'تثبيت الفكرة الأساسية ثم إكمال الواجب' : 'Master core concept and complete homework';
  } else if (contextSource === 'home_next_action' && nextPendingMission) {
    recommendedReason = nextPendingMission.whyNow || (isAr ? 'المهمة ذات الأولوية القصوى في خطة اليوم.' : 'Top priority daily mission.');
    recommendedNextAction = nextPendingMission.title;
  } else if (contextSource === 'weakness') {
    recommendedReason = isAr
      ? `لاحظنا أن مفهوم «${targetConcept?.titleAr || targetLesson?.titleAr || ''}» يحتاج إلى زاوية شرح إيضاحية بديلة.`
      : `Concept needs alternative explanatory perspective.`;
    recommendedNextAction = isAr ? 'إعادة تثبيت المفهوم بنموذج بصري ومثال' : 'Re-anchor concept with visual model';
  } else if (dueReviews.length > 0) {
    recommendedReason = isAr
      ? `مفهوم مستحق للمراجعة المتباعدة لضمان ترسيخه في الذاكرة طويلة المدى.`
      : `Spaced review due to ensure long-term retention.`;
    recommendedNextAction = isAr ? 'مراجعة سريعة وتثبيت الإتقان' : 'Quick refresh and mastery re-check';
  } else if (targetLesson) {
    recommendedReason = isAr
      ? `متابعة التسلسل الطبيعي في كتاب الوزارة لـ «${targetLesson.titleAr}».`
      : `Following official curriculum textbook progression.`;
    recommendedNextAction = isAr ? 'استكشاف الدرس وحل تمارين الوزارة' : 'Explore lesson and solve textbook practice';
  } else {
    recommendedReason = isAr
      ? 'لم يتم تحديد درس حالياً؛ يمكنكِ اختيار مادة أو درس من خطة المنهج.'
      : 'No lesson currently selected; you can pick a subject or lesson from the curriculum.';
    recommendedNextAction = isAr ? 'تصفح المنهج الدراسي واختيار درس' : 'Browse curriculum and select a lesson';
  }

  // 7. Synthesize Proactive Opening Speech
  let proactiveOpeningSpeech = '';
  const didStudyTodayAtSchool =
    Boolean(currentDayRecord?.confirmed) &&
    Boolean(targetLesson) &&
    todayLessonsCovered.some(
      (l) => l.subject.includes(targetLesson!.subjectNameAr) || targetLesson!.subjectNameAr.includes(l.subject)
    );

  if (didStudyTodayAtSchool && targetLesson) {
    proactiveOpeningSpeech = isAr
      ? `يا أهلاً يا ${studentName}! شفت في سجل يومك المؤكد إنك درستي «${targetLesson.titleAr}» في المدرسة النهاردة. قبل ما نفتح التمارين، عايزة أسألك سؤال استكشافي ذكي عشان نتأكد إن الفكرة الأساسية واضحة في دماغك ومفيش أي التباس!`
      : isFr
      ? `Bonjour ${studentName}! J'ai vu dans ton journal confirmé que tu as étudié «${targetLesson.titleEn}» à l'école aujourd'hui. Avant de passer aux exercices, commençons par une petite question diagnostique pour vérifier tes repères !`
      : `Hello ${studentName}! I noticed in your confirmed school record that you studied "${targetLesson.titleEn}" at school today. Before we jump into practice, let's start with a quick diagnostic question to see exactly what clicked!`;
  } else if (targetLesson && pendingHomework.length > 0 && pendingHomework.some((h) => h.subject.includes(targetLesson.subjectNameAr))) {
    proactiveOpeningSpeech = isAr
      ? `أهلاً يا ${studentName}! عندك واجب مسجل في «${targetLesson.sourceRef.bookAr}». تعالي نختبر فهمك للفكرة المحورية الأول بسؤال بسيط عشان تحلي الواجب بسرعة وبدون تردد!`
      : isFr
      ? `Bonjour ${studentName}! Tu as des devoirs pour «${targetLesson.sourceRef.bookEn}». Vérifions la notion clé ensemble pour que tu puisses les faire en toute autonomie !`
      : `Hello ${studentName}! You have homework recorded for "${targetLesson.sourceRef.bookEn}". Let's test the core concept first so you can complete it smoothly!`;
  } else if (masteryState && (masteryState.threshold === 'needs_review' || masteryState.score < 0.6) && targetLesson) {
    proactiveOpeningSpeech = isAr
      ? `يا هلا ببطلتنا ${studentName}! درس «${targetLesson.titleAr}» محتاج مننا زاوية شرح جديدة وممتعة. جهزت لك سؤال تشخيصي لطيف يحدد بالظبط النقطة اللي محتاجة توضيح!`
      : isFr
      ? `Bonjour ${studentName}! La leçon «${targetLesson.titleEn}» mérite un nouvel éclairage. Faisons un petit test amical pour voir exactement ce qu'on va consolider !`
      : `Hello ${studentName}! "${targetLesson.titleEn}" calls for a fresh, engaging angle. Let's start with a diagnostic check to pinpoint exactly where to focus!`;
  } else if (targetLesson) {
    proactiveOpeningSpeech = isAr
      ? `أهلاً يا ${studentName}! أنا معلمتكِ نور 👩‍🏫 خطوتنا الدراسية الآن هي درس «${targetLesson.titleAr}» من ${targetLesson.sourceRef.bookAr}. يلا نكتشف مستوانا بسؤال تشخيصي سريع قبل الشرح!`
      : isFr
      ? `Bienvenue ${studentName}! Je suis Maîtresse Nour 👩‍🏫 Notre étape actuelle est «${targetLesson.titleEn}». Commençons par un rapide diagnostic avant le tableau !`
      : `Welcome, ${studentName}! I'm Miss Nour 👩‍🏫 Our current lesson is "${targetLesson.titleEn}" from ${targetLesson.sourceRef.bookEn}. Let's check where we stand with a quick diagnostic!`;
  } else {
    proactiveOpeningSpeech = isAr
      ? `أهلاً يا ${studentName}! أنا معلمتكِ نور 👩‍🏫 لم يتم تحديد درس حالياً من المنهج. تعالي نستكشف رف الكتب والمواد الدراسية لنبدأ!`
      : isFr
      ? `Bienvenue ${studentName}! Je suis Maîtresse Nour 👩‍🏫 Aucune leçon n'est sélectionnée. Choisissons un livre pour commencer !`
      : `Welcome ${studentName}! I'm Miss Nour 👩‍🏫 No lesson is currently selected. Let's explore your curriculum books to get started!`;
  }

  // 8. Generate Curriculum Diagnostic Question, Targeted Teaching, and Recheck Question
  const diagnosticQuestion = buildDiagnosticForConcept(targetLesson, targetConcept, studentName);
  const targetedTeaching = buildTargetedIntervention(
    targetLesson,
    targetConcept,
    studentName,
    'solid_understanding',
    'visual_model'
  );
  const recheckQuestion = buildRecheckQuestionForConcept(targetLesson, targetConcept, studentName);

  return {
    student,
    studentName,
    currentDate,
    dayRecord: currentDayRecord,
    hasSchoolDayRecord: Boolean(currentDayRecord),
    schoolDayConfirmed: Boolean(currentDayRecord?.confirmed),
    todayLessonsCovered,
    todayHomeworkAssigned,
    targetSubjectId: targetLesson?.subjectId || '',
    targetSubjectName: targetLesson ? (isAr ? targetLesson.subjectNameAr : targetLesson.subjectNameEn) : '',
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
    targetedTeaching,
    recheckQuestion,
  };
}
