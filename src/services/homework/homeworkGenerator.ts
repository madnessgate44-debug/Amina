/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  HomeworkItem,
  HomeworkQuestion,
  HomeworkQuestionType,
  MatchingPair,
  FlatCurriculumConcept,
  Language,
} from '../../types';
import { curriculumService } from '../curriculum/curriculumService';

/**
 * Normalizes subject string across Arabic, French, and English to curriculum subject ID
 */
export function normalizeSubjectId(subName?: string): string {
  if (!subName) return '';
  const s = subName.trim().toLowerCase();

  // French Math specific
  if (
    (s.includes('math') && (s.includes('fr') || s.includes('فرنس'))) ||
    s.includes('mathématiques') ||
    s.includes('الرياضيات بالفرنسية')
  ) {
    return 'subj_math_fr';
  }

  // French Science specific
  if (
    (s.includes('sci') && (s.includes('fr') || s.includes('فرنس'))) ||
    s.includes('sciences fr') ||
    s.includes('العلوم بالفرنسية')
  ) {
    return 'subj_science_fr';
  }

  // French Language
  if (s.includes('فرنساوي') || s.includes('فرنسي') || s.includes('french') || s.includes('français')) {
    return 'subj_french';
  }

  if (s.includes('عرب') || s.includes('لغة عربية') || s.includes('arabic')) return 'subj_arabic';
  if (s.includes('رياض') || s.includes('حساب') || s.includes('math') || s.includes('كسور')) return 'subj_math';
  if (s.includes('علوم') || s.includes('science') || s.includes('كائنات') || s.includes('بيئة')) return 'subj_science';
  if (s.includes('دراس') || s.includes('social')) return 'subj_social';
  if (s.includes('إنجليز') || s.includes('انجليز') || s.includes('english')) return 'subj_english';
  if (s.includes('تكنولوج') || s.includes('ict')) return 'subj_ict';
  if (s.includes('دين') || s.includes('islamic') || s.includes('religion')) return 'subj_islamic';
  if (s.includes('خط') || s.includes('calligraphy')) return 'subj_calligraphy';

  return '';
}

/**
 * Searches curriculum for a matching concept.
 * Returns null if the homework cannot be linked to any curriculum concept.
 */
export function findConceptForHomework(
  subject: string,
  description: string
): FlatCurriculumConcept | null {
  const subjectId = normalizeSubjectId(subject);
  if (!subjectId) return null;

  const flatConcepts = curriculumService.getFlatConcepts();
  const subjectConcepts = flatConcepts.filter((c) => c.subjectId === subjectId);
  if (subjectConcepts.length === 0) return null;

  const descLower = description.toLowerCase().trim();
  const descWords = descLower
    .split(/[\s,،.؛;()]+/)
    .filter((w) => w.length > 2 && !['صفحة', 'حل', 'واجب', 'تمارين', 'كتاب', 'page', 'hw'].includes(w));

  if (descWords.length === 0) {
    // If description is completely vague or has no keywords, return first topic of subject
    return subjectConcepts[0] || null;
  }

  // Score concepts based on keyword occurrences
  const scored = subjectConcepts.map((concept) => {
    const textAr = `${concept.nameAr} ${concept.descriptionAr || ''}`.toLowerCase();
    const textEn = `${concept.nameEn} ${concept.descriptionEn || ''}`.toLowerCase();
    let score = 0;
    for (const w of descWords) {
      if (textAr.includes(w) || textEn.includes(w)) {
        score += 1;
      }
    }
    return { concept, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.score > 0 ? scored[0].concept : subjectConcepts[0] || null;
}

/**
 * Generates questions for a linked concept across all 6 activity types.
 */
export function generateQuestionsForConcept(
  concept: FlatCurriculumConcept,
  homeworkItemId: string
): HomeworkQuestion[] {
  const cId = concept.id;
  const isMath = concept.subjectId === 'subj_math';
  const isArabic = concept.subjectId === 'subj_arabic';

  if (isMath) {
    // Math questions (e.g. fractions operations)
    return [
      {
        id: `q_${homeworkItemId}_1`,
        homeworkItemId,
        conceptId: cId,
        type: 'multiple_choice',
        prompt: 'ما ناتج ضرب الكسرين: (٢/٣) × (٣/٥) في أبسط صورة؟',
        promptAr: 'ما ناتج ضرب الكسرين: (٢/٣) × (٣/٥) في أبسط صورة؟',
        options: ['٢/٥', '٦/١٥', '٥/٨', '١/٢'],
        correctAnswer: '٢/٥',
        hint: 'تذكر القاعدة الأساسية: نضرب البسط في البسط والمقام في المقام، ثم نختصر العوامل المشتركة.',
        workedStep: 'الخطوة الأولى: اضرب البسوط (٢ × ٣ = ٦) والمقامات (٣ × ٥ = ١٥) لتحصل على ٦/١٥، ثم اقسم البسط والمقام على العامل المشترك ٣.',
        explanation: 'الناتج النهائي هو ٢/٥ لأن (٢ × ٣) / (٣ × ٥) = ٦/١٥، وبقسمة طرفي الكسر على ٣ ينتج ٢/٥.',
      },
      {
        id: `q_${homeworkItemId}_2`,
        homeworkItemId,
        conceptId: cId,
        type: 'short_answer',
        prompt: 'احسب قيمة: (١/٤) × (٤/٧). اكتب الناتج في أبسط صورة:',
        promptAr: 'احسب قيمة: (١/٤) × (٤/٧). اكتب الناتج في أبسط صورة:',
        correctAnswer: '1/7',
        hint: 'لاحظ وجود عدد ٤ في البسط وفي المقام قبل الضرب، هل يمكنك الاختصار مباشرة؟',
        workedStep: 'الخطوة الأولى: بسّط العدد ٤ في بسط الكسر الثاني مع ٤ في مقام الكسر الأول لتصبح المسألة (١/١) × (١/٧).',
        explanation: 'الناتج هو ١/٧ بعد اختصار العدد ٤ مع ٤.',
      },
      {
        id: `q_${homeworkItemId}_3`,
        homeworkItemId,
        conceptId: cId,
        type: 'fill_in_the_blank',
        prompt: 'أكمل الفراغ بالعدد المناسب: لضرب كسرين، نضرب البسط في البسط ونضرب المقام في _______',
        promptAr: 'أكمل الفراغ بالعدد المناسب: لضرب كسرين، نضرب البسط في البسط ونضرب المقام في _______',
        blanks: {
          beforeText: 'لضرب كسرين، نضرب البسط في البسط ونضرب المقام في',
          blankAnswer: 'المقام',
          afterText: 'ثم نبسط الناتج.',
        },
        correctAnswer: 'المقام',
        hint: 'تذكر طرفي الكسر: الرقم بالأعلى يسمى البسط، والرقم بالأسفل يسمى...',
        workedStep: 'الخطوة الأولى: الكسر يتكون من بسط ومقام، والعملية تنفذ بالتوازي: بسط × بسط ومقام × ...',
        explanation: 'الكلمة الصحيحة هي "المقام". القاعدة: (بسط × بسط) / (مقام × مقام).',
      },
      {
        id: `q_${homeworkItemId}_4`,
        homeworkItemId,
        conceptId: cId,
        type: 'matching',
        prompt: 'صل كل مسألة ضرب بالناتج المبسط المكافئ لها:',
        promptAr: 'صل كل مسألة ضرب بالناتج المبسط المكافئ لها:',
        matchingPairs: [
          { id: 'm1', left: '(١/٢) × (٢/٣)', right: '١/٣' },
          { id: 'm2', left: '(٣/٤) × (٤/٥)', right: '٣/٥' },
          { id: 'm3', left: '(٢/٥) × (٥/٦)', right: '١/٣' },
        ],
        correctAnswer: ['١/٣', '٣/٥', '١/٣'],
        hint: 'ابحث عن العوامل المتشابهة بين بسط الكسر الأول ومقام الكسر الثاني.',
        workedStep: 'الخطوة الأولى: في المسألة (١/٢) × (٢/٣)، يختصر العدد ٢ مع ٢ ويبقى ١ في البسط و٣ في المقام.',
        explanation: 'النواتج المتطابقة: (١/٢)×(٢/٣)=١/٣، (٣/٤)×(٤/٥)=٣/٥، (٢/٥)×(٥/٦)=١/٣.',
      },
      {
        id: `q_${homeworkItemId}_5`,
        homeworkItemId,
        conceptId: cId,
        type: 'ordering',
        prompt: 'رتّب خطوات ضرب الكسرين الاعتياديين بالترتيب الصحيح:',
        promptAr: 'رتّب خطوات ضرب الكسرين الاعتياديين بالترتيب الصحيح:',
        orderingItems: [
          'تبسيط الناتج إلى أبسط صورة بالقسمة على (ع. م. أ)',
          'البحث عن أي اختصارات بين البسوط والمقامات',
          'ضرب بسط الكسر الأول في بسط الكسر الثاني',
          'ضرب مقام الكسر الأول في مقام الكسر الثاني',
        ],
        correctAnswer: [
          'البحث عن أي اختصارات بين البسوط والمقامات',
          'ضرب بسط الكسر الأول في بسط الكسر الثاني',
          'ضرب مقام الكسر الأول في مقام الكسر الثاني',
          'تبسيط الناتج إلى أبسط صورة بالقسمة على (ع. م. أ)',
        ],
        hint: 'هل نبدأ بالبحث عن الاختصار أولاً أم ننتظر للنهاية؟ التبسيط المسبق يسهل الأرقام.',
        workedStep: 'الخطوة الأولى دائماً هي فحص الاختصارات المتبادلة قبل البدء في الضرب لتفادي الأرقام الكبيرة.',
        explanation: 'الترتيب الصحيح: الاختصار أولاً، ثم ضرب البسوط، ثم ضرب المقامات، وأخيراً التأكد من أبسط صورة.',
      },
      {
        id: `q_${homeworkItemId}_6`,
        homeworkItemId,
        conceptId: cId,
        type: 'voice_response',
        prompt: 'سجل بصوتك: اشرح باختصار كيف نضرب الكسر (١/٣) في (٣/٤).',
        promptAr: 'سجل بصوتك: اشرح باختصار كيف نضرب الكسر (١/٣) في (٣/٤).',
        correctAnswer: 'نختصر الثلاثة مع الثلاثة فيبقى ربع',
        hint: 'اذكر خطوة الاختصار أو اضرب البسوط والمقامات واذكر الناتج النهائي بصوتك.',
        workedStep: 'قل ببساطة: نضرب ١ في ٣ = ٣، ونضرب ٣ في ٤ = ١٢، فيكون الناتج ٣/١٢ وهو يساوي ربع (١/٤).',
        explanation: 'الشرح النموذجي: نضرب البسطين والمقامين ونختصر أو نحذف ٣ مع ٣ ليكون الناتج ربع (١/٤).',
      },
    ];
  } else if (isArabic) {
    // Arabic questions (e.g. Mubtada & Khabar)
    return [
      {
        id: `q_${homeworkItemId}_1`,
        homeworkItemId,
        conceptId: cId,
        type: 'multiple_choice',
        prompt: 'في الجملة: "العلمُ نورٌ"، علامة إعراب المبتدأ "العلمُ" هي:',
        promptAr: 'في الجملة: "العلمُ نورٌ"، علامة إعراب المبتدأ "العلمُ" هي:',
        options: ['الضمة الظاهرة', 'الفتحة', 'الكسرة', 'السكون'],
        correctAnswer: 'الضمة الظاهرة',
        hint: 'المبتدأ المفرد دائماً مرفوع، وعلامة الرفع الأصلية للمفرد هي الحركة التي توضع فوق الحرف الأخير.',
        workedStep: 'الخطوة الأولى: كلمة "العلمُ" اسم مفرد بدأنا به الجملة، إذن هو مبتدأ مرفوع بالضمة.',
        explanation: 'الإجابة الصحيحة: الضمة الظاهرة، لأن المبتدأ المفرد يرفع بالضمة.',
      },
      {
        id: `q_${homeworkItemId}_2`,
        homeworkItemId,
        conceptId: cId,
        type: 'short_answer',
        prompt: 'عيّن الخبر في الجملة التالية: "الحديقةُ واسعةٌ وجميلةٌ":',
        promptAr: 'عيّن الخبر في الجملة التالية: "الحديقةُ واسعةٌ وجميلةٌ":',
        correctAnswer: 'واسعة',
        hint: 'الخبر هو الكلمة التي تممت المعنى الأساسي بعد المبتدأ وأخبرتنا بمعلومة عنه.',
        workedStep: 'الخطوة الأولى: اسأل نفسك "الحديقة مالها؟" الإجابة المباشرة هي الكلمة الأولى التي تممت المعنى.',
        explanation: 'الخبر هو "واسعة" لأنه الجزء المتمم لفائدة الجملة الاسمية.',
      },
      {
        id: `q_${homeworkItemId}_3`,
        homeworkItemId,
        conceptId: cId,
        type: 'fill_in_the_blank',
        prompt: 'أكمل الجملة بمبتدأ مناسب مع الضبط: "_______ ماهرون في عملهم."',
        promptAr: 'أكمل الجملة بمبتدأ مناسب مع الضبط: "_______ ماهرون في عملهم."',
        blanks: {
          beforeText: '',
          blankAnswer: 'المعلمون',
          afterText: 'ماهرون في عملهم.',
        },
        correctAnswer: 'المعلمون',
        hint: 'الخبر "ماهرون" جمع مذكر سالم مرفوع بالواو، فيجب أن يكون المبتدأ مطابقاً له.',
        workedStep: 'الخطوة الأولى: المبتدأ يحتاج لكلمة جمع مذكر سالم تنتهي بواو ونون وتطابق الخبر.',
        explanation: 'الكلمة الصحيحة "المعلمون" أو "المهندسون" لأن المبتدأ يطابق الخبر في الجمع والتذكير.',
      },
      {
        id: `q_${homeworkItemId}_4`,
        homeworkItemId,
        conceptId: cId,
        type: 'matching',
        prompt: 'صل كل مبتدأ بالخبر المناسب الذي يطابقه:',
        promptAr: 'صل كل مبتدأ بالخبر المناسب الذي يطابقه:',
        matchingPairs: [
          { id: 'm1', left: 'الشمسُ', right: 'مشرقةٌ' },
          { id: 'm2', left: 'الطلابُ', right: 'مجتهدون' },
          { id: 'm3', left: 'المعلمتانِ', right: 'مخلصتانِ' },
        ],
        correctAnswer: ['مشرقةٌ', 'مجتهدون', 'مخلصتانِ'],
        hint: 'طابق المفرد المؤنث مع مؤنث، وجمع التكسير/المذكر مع جمع، والمثنى مع مثنى.',
        workedStep: 'الخطوة الأولى: "الشمس" مفرد مؤنث فتحتاج إلى خبر مفرد مؤنث ينتهي بتاء مربوطة.',
        explanation: 'التطابق الصحيح: الشمسُ مشرقةٌ، الطلابُ مجتهدون، المعلمتانِ مخلصتانِ.',
      },
      {
        id: `q_${homeworkItemId}_5`,
        homeworkItemId,
        conceptId: cId,
        type: 'ordering',
        prompt: 'رتّب الكلمات لتكوين جملة اسمية صحيحة تبدأ بالمبتدأ:',
        promptAr: 'رتّب الكلمات لتكوين جملة اسمية صحيحة تبدأ بالمبتدأ:',
        orderingItems: ['الكتابُ', 'مفيدٌ', 'للقارئ', 'دائماً'],
        correctAnswer: ['الكتابُ', 'مفيدٌ', 'دائماً', 'للقارئ'],
        hint: 'ابدأ بالاسم المعرف بأل (المبتدأ) ثم الخبر المباشر له.',
        workedStep: 'الخطوة الأولى: المبتدأ هو "الكتابُ" ويليه الخبر "مفيدٌ".',
        explanation: 'الترتيب الأصح نحوياً: الكتابُ مفيدٌ دائماً للقارئ.',
      },
      {
        id: `q_${homeworkItemId}_6`,
        homeworkItemId,
        conceptId: cId,
        type: 'voice_response',
        prompt: 'انطق الجملة بصوتك مع الضبط الصحيح لآخر الكلمتين: "القمرُ منيرٌ"',
        promptAr: 'انطق الجملة بصوتك مع الضبط الصحيح لآخر الكلمتين: "القمرُ منيرٌ"',
        correctAnswer: 'القمر منير',
        hint: 'انطق حرف الراء في القمر مضموماً، ونوّن كلمة منير بالضم.',
        workedStep: 'قل بوضوح: القمرُ (بضمة) منيرٌ (بتنوين ضم).',
        explanation: 'النطق السليم هو: القَمَرُ مُنِيرٌ، بضم الراء في المبتدأ وتنوين الضم في الخبر.',
      },
    ];
  } else {
    // Science questions (e.g. Ecosystems / Living Organisms)
    return [
      {
        id: `q_${homeworkItemId}_1`,
        homeworkItemId,
        conceptId: cId,
        type: 'multiple_choice',
        prompt: 'ما الكائن الحي الذي يعتبر منتجاً للغذاء في السلسلة الغذائية؟',
        promptAr: 'ما الكائن الحي الذي يعتبر منتجاً للغذاء في السلسلة الغذائية؟',
        options: ['النبات الأخضر', 'الصقر', 'الأرنب', 'الفطريات'],
        correctAnswer: 'النبات الأخضر',
        hint: 'الكائنات المنتجة تصنع غذاءها بنفسها من خلال عملية البناء الضوئي.',
        workedStep: 'الخطوة الأولى: ابحث عن الكائن الذي يحتوي على مادة الكلوروفيل ويمتص ضوء الشمس.',
        explanation: 'النبات الأخضر كائن منتج يصنع غذاءه بعملية البناء الضوئي.',
      },
      {
        id: `q_${homeworkItemId}_2`,
        homeworkItemId,
        conceptId: cId,
        type: 'short_answer',
        prompt: 'ما الغاز الذي تمتصه النباتات أثناء عملية البناء الضوئي؟',
        promptAr: 'ما الغاز الذي تمتصه النباتات أثناء عملية البناء الضوئي؟',
        correctAnswer: 'ثاني أكسيد الكربون',
        hint: 'النباتات تأخذ هذا الغاز من الهواء وتخرج بدلاً منه غاز الأكسجين.',
        workedStep: 'الخطوة الأولى: تذكر أن الغاز الناتج هو الأكسجين، أما الغاز المستهلك فهو ثاني أكسيد...',
        explanation: 'الغاز هو ثاني أكسيد الكربون (CO2).',
      },
      {
        id: `q_${homeworkItemId}_3`,
        homeworkItemId,
        conceptId: cId,
        type: 'fill_in_the_blank',
        prompt: 'تعتبر الفطريات والبكتيريا من الكائنات _______ التي تعيد العناصر الغذائية للتربة.',
        promptAr: 'تعتبر الفطريات والبكتيريا من الكائنات _______ التي تعيد العناصر الغذائية للتربة.',
        blanks: {
          beforeText: 'تعتبر الفطريات والبكتيريا من الكائنات',
          blankAnswer: 'المحللة',
          afterText: 'التي تعيد العناصر الغذائية للتربة.',
        },
        correctAnswer: 'المحللة',
        hint: 'هذه الكائنات تحلل بقايا الكائنات الميتة، لذا تسمى الكائنات...',
        workedStep: 'الخطوة الأولى: نوع الكائنات التي تأتي في نهاية السلسلة الغذائية لتفكيك البقايا العضوية.',
        explanation: 'الكلمة الصحيحة هي "المحللة".',
      },
      {
        id: `q_${homeworkItemId}_4`,
        homeworkItemId,
        conceptId: cId,
        type: 'matching',
        prompt: 'صل كل كائن حي بدوره في النظام البيئي:',
        promptAr: 'صل كل كائن حي بدوره في النظام البيئي:',
        matchingPairs: [
          { id: 'm1', left: 'الأعشاب الخضراء', right: 'كائن منتج' },
          { id: 'm2', left: 'الغزال', right: 'مستهلك أولي (عاشب)' },
          { id: 'm3', left: 'الأسد', right: 'مستهلك ثانوي (لاحم)' },
        ],
        correctAnswer: ['كائن منتج', 'مستهلك أولي (عاشب)', 'مستهلك ثانوي (لاحم)'],
        hint: 'الكائنات التي تأكل العشب فقط تسمى مستهلكاً أولياً.',
        workedStep: 'الخطوة الأولى: صنف العشب كمنتج، ثم رتب الحيوانات حسب ما تأكله.',
        explanation: 'التطابق: الأعشاب = كائن منتج، الغزال = مستهلك أولي، الأسد = مستهلك ثانوي.',
      },
      {
        id: `q_${homeworkItemId}_5`,
        homeworkItemId,
        conceptId: cId,
        type: 'ordering',
        prompt: 'رتّب الكائنات لتكوين سلسلة غذائية صحيحة من البداية:',
        promptAr: 'رتّب الكائنات لتكوين سلسلة غذائية صحيحة من البداية:',
        orderingItems: ['نبات أخضر', 'حشرة تأكل النبات', 'ضفدع يأكل الحشرة', 'ثعبان يأكل الضفدع'],
        correctAnswer: ['نبات أخضر', 'حشرة تأكل النبات', 'ضفدع يأكل الحشرة', 'ثعبان يأكل الضفدع'],
        hint: 'السلسلة الغذائية تبدأ دائماً بالكائن المنتج.',
        workedStep: 'الخطوة الأولى: ضع النبات في المرتبة الأولى، ثم الكائن الذي يتغذى عليه مباشرة.',
        explanation: 'الترتيب الصحيح: نبات أخضر ← حشرة ← ضفدع ← ثعبان.',
      },
      {
        id: `q_${homeworkItemId}_6`,
        homeworkItemId,
        conceptId: cId,
        type: 'voice_response',
        prompt: 'سجل بصوتك: ما هي وظيفة الجذور في النبات الأخضر؟',
        promptAr: 'سجل بصوتك: ما هي وظيفة الجذور في النبات الأخضر؟',
        correctAnswer: 'تثبيت النبات وامتصاص الماء والأملاح',
        hint: 'اذكر أمرين: تثبيت النبات في التربة، وامتصاص الماء.',
        workedStep: 'قل باختصار: تمتص الماء والأملاح من التربة وتثبت النبات.',
        explanation: 'الوظيفة الأساسية للجذور هي تثبيت النبات وامتصاص الماء والعناصر الغذائية من التربة.',
      },
    ];
  }
}

/**
 * Creates a HomeworkItem from a Day Record homework item.
 * If cannot be linked to a curriculum concept, marks unlinked = true.
 */
export function createHomeworkItemFromDayRecord(params: {
  studentId: string;
  date: string;
  subject: string;
  description: string;
  dueDate?: string;
  index: number;
}): HomeworkItem {
  const { studentId, date, subject, description, dueDate, index } = params;
  const homeworkItemId = `hw_${studentId}_${date}_${index}`;
  const matchedConcept = findConceptForHomework(subject, description);

  if (!matchedConcept) {
    return {
      id: homeworkItemId,
      studentId,
      date,
      subject,
      description,
      dueDate,
      unlinked: true,
      status: 'pending',
      questions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  const questions = generateQuestionsForConcept(matchedConcept, homeworkItemId);

  return {
    id: homeworkItemId,
    studentId,
    date,
    subject,
    description,
    dueDate,
    conceptId: matchedConcept.id,
    unlinked: false,
    status: 'pending',
    questions,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Normalizes text for lenient student answer checking
 */
export function normalizeStudentText(raw?: string): string {
  if (!raw) return '';
  return raw
    .trim()
    .toLowerCase()
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/[\u064B-\u065F]/g, '') // remove Arabic tashkeel / diacritics
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()؟?]/g, '')
    .replace(/\s+/g, ' ');
}

/**
 * Evaluates student answer for a digital homework question.
 */
export function evaluateStudentAnswer(
  question: HomeworkQuestion,
  studentAnswer: any
): {
  isCorrect: boolean;
  correctness: 'full' | 'partial' | 'wrong';
  feedback?: string;
} {
  if (studentAnswer === undefined || studentAnswer === null || studentAnswer === '') {
    return { isCorrect: false, correctness: 'wrong' };
  }

  switch (question.type) {
    case 'multiple_choice': {
      const isMatch = String(studentAnswer).trim() === String(question.correctAnswer).trim();
      return { isCorrect: isMatch, correctness: isMatch ? 'full' : 'wrong' };
    }

    case 'short_answer':
    case 'fill_in_the_blank': {
      const normStudent = normalizeStudentText(String(studentAnswer));
      const target = typeof question.correctAnswer === 'string'
        ? question.correctAnswer
        : question.blanks?.blankAnswer || '';
      const normTarget = normalizeStudentText(target);

      // Support fraction variations: 2/5 or 2 / 5 or ٢/٥
      const cleanStudent = normStudent.replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d))).replace(/\s+/g, '');
      const cleanTarget = normTarget.replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d))).replace(/\s+/g, '');

      const isMatch =
        normStudent === normTarget ||
        cleanStudent === cleanTarget ||
        normStudent.includes(normTarget) ||
        normTarget.includes(normStudent);

      return { isCorrect: isMatch, correctness: isMatch ? 'full' : 'wrong' };
    }

    case 'matching': {
      // studentAnswer is an array of right strings matched in order of matchingPairs
      if (!Array.isArray(studentAnswer) || !question.matchingPairs) {
        return { isCorrect: false, correctness: 'wrong' };
      }
      let correctMatches = 0;
      question.matchingPairs.forEach((pair, idx) => {
        if (studentAnswer[idx] === pair.right) {
          correctMatches += 1;
        }
      });
      const total = question.matchingPairs.length;
      if (correctMatches === total) {
        return { isCorrect: true, correctness: 'full' };
      } else if (correctMatches > 0) {
        return { isCorrect: false, correctness: 'partial' };
      }
      return { isCorrect: false, correctness: 'wrong' };
    }

    case 'ordering': {
      if (!Array.isArray(studentAnswer) || !Array.isArray(question.correctAnswer)) {
        return { isCorrect: false, correctness: 'wrong' };
      }
      const isMatch =
        studentAnswer.length === question.correctAnswer.length &&
        studentAnswer.every((val, idx) => val === (question.correctAnswer as string[])[idx]);
      return { isCorrect: isMatch, correctness: isMatch ? 'full' : 'wrong' };
    }

    case 'voice_response': {
      const normStudent = normalizeStudentText(String(studentAnswer));
      const targetStr = Array.isArray(question.correctAnswer)
        ? question.correctAnswer.join(' ')
        : String(question.correctAnswer);
      const targetKeywords = normalizeStudentText(targetStr)
        .split(' ')
        .filter((w) => w.length > 2);

      // If at least one essential concept keyword is spoken
      const matchedCount = targetKeywords.filter((k) => normStudent.includes(k)).length;
      const isMatch = targetKeywords.length > 0 && matchedCount >= Math.max(1, Math.floor(targetKeywords.length * 0.4));

      return { isCorrect: isMatch, correctness: isMatch ? 'full' : 'wrong' };
    }

    default:
      return { isCorrect: false, correctness: 'wrong' };
  }
}

/**
 * HINT-FIRST POLICY EVALUATION
 * Deliverable 3:
 * Attempt 1 wrong: show hint (conceptual — what rule applies), do NOT reveal answer
 * Attempt 2 wrong: show worked step (partial — how to approach), do NOT show final answer
 * Attempt 3 wrong OR student requested reveal ("show me" / "ورّيني"): reveal full answer + explanation, mark revealed = true
 */
export function getHintFirstGuidance(params: {
  attemptCount: number;
  revealed: boolean;
  forceReveal?: boolean;
  question: HomeworkQuestion;
}): {
  guidanceType: 'hint' | 'worked_step' | 'reveal';
  guidanceText: string;
  revealed: boolean;
  allowRetry: boolean;
  offerSimilarQuestion: boolean;
} {
  const { attemptCount, revealed, forceReveal, question } = params;

  if (forceReveal || revealed || attemptCount >= 3) {
    return {
      guidanceType: 'reveal',
      guidanceText: question.explanation,
      revealed: true,
      allowRetry: false,
      offerSimilarQuestion: true,
    };
  }

  if (attemptCount === 2) {
    return {
      guidanceType: 'worked_step',
      guidanceText: question.workedStep,
      revealed: false,
      allowRetry: true,
      offerSimilarQuestion: false,
    };
  }

  // attemptCount === 1 or default
  return {
    guidanceType: 'hint',
    guidanceText: question.hint,
    revealed: false,
    allowRetry: true,
    offerSimilarQuestion: false,
  };
}

/**
 * Generates a similar practice problem after reveal to re-establish mastery
 */
export function generateSimilarPracticeQuestion(
  question: HomeworkQuestion
): HomeworkQuestion {
  return {
    ...question,
    id: `${question.id}_similar_${Date.now()}`,
    prompt: `مسألة تدريبية مماثلة: ${question.prompt}`,
    promptAr: `مسألة تدريبية مماثلة: ${question.promptAr || question.prompt}`,
  };
}
