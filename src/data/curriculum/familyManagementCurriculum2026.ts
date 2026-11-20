/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * 2026/2027 Egypt Ministry Grade 5 Family Management Skills
 * (مهارات إدارة الأسرة), Term 1.
 *
 * Unit names, lesson names, lesson order and page numbers are taken from the
 * inspected Ministry student book `Family_management_Prim5_TR1.pdf` (56 pages):
 * Unit 1 "تحدي وإرادة" holds three lessons on printed pages 6, 14 and 20;
 * Unit 2 "بيدي أصنع الفرق" holds three lessons on printed pages 28, 36 and 44.
 * Each lesson runs eight printed pages, matching the contents page ranges
 * (5-25 and 27-44).
 *
 * Explanations, examples and exercises are Miss Noor teaching material written
 * for this app. They are NOT official Ministry text.
 */
import { OfficialCurriculumLesson, SourceRef } from '../../types/teachingSession';

type Spec = {
  u: number;
  n: number;
  page: number;
  pages: string;
  ar: string;
  en: string;
  focus: string;
  objectives: string[];
  vocab: [string, string][];
  sub: string[];
  q: string;
  options: string[];
  answer: string;
  why: string;
  mis: string;
};

const UNITS: Record<number, { ar: string; en: string }> = {
  1: { ar: 'الوحدة الأولى: تحدي وإرادة', en: 'Unit 1: Challenge and Willpower' },
  2: { ar: 'الوحدة الثانية: بيدي أصنع الفرق', en: 'Unit 2: With My Own Hands I Make a Difference' },
};

const S: Spec[] = [
  {
    u: 1, n: 1, page: 6, pages: '6-13',
    ar: 'مدرستي المنتجة', en: 'My Productive School',
    focus:
      'المدرسة المنتجة مكان نتعلم فيه العمل اليدوي والمهن. نكتشف ميولنا ومهاراتنا لنعرف ما يناسبنا، ونتعرف على مهن المجتمع من حولنا مثل الطبيب والمعلم والمزارع والنجار. ونفهم أن لكل مهنة قيمتها، وأن التعاون والاحترام أساس العمل معاً.',
    objectives: [
      'يكتشف ميوله ومهاراته ليعرف ما يناسبه من أعمال.',
      'يعدد مهن مختلفة في المجتمع ويذكر فائدة كل منها.',
      'يوضح أهمية التعاون والاحترام في العمل المشترك.',
    ],
    vocab: [
      ['مدرسة منتجة', 'مدرسة تنتج أعمالاً يدوية ومهارات عملية'],
      ['ميل', 'شيء أحبه وأرغب في عمله'],
      ['مهارة', 'قدرة أتعلمها وأتقنها بالتدريب'],
    ],
    sub: ['مدرستي المنتجة والمقصف المدرسي', 'أكتشف ميولي ومهاراتي', 'مهن المجتمع', 'التعاون والاحترام'],
    q: 'لماذا نكتشف ميولنا ومهاراتنا؟',
    options: ['لمعرفة الأعمال التي تناسبنا', 'لنحفظ أسماء المهن فقط', 'لنتجنب العمل', 'لنقلد الآخرين'],
    answer: 'لمعرفة الأعمال التي تناسبنا',
    why: 'من يعرف ما يحبه وما يتقنه يختار عملاً ينجح فيه ويحبه.',
    mis: 'الميول لا علاقة لها باختيار العمل',
  },
  {
    u: 1, n: 2, page: 14, pages: '14-19',
    ar: 'الإسعافات الأولية', en: 'First Aid',
    focus:
      'الإسعافات الأولية هي ما نفعله فوراً قبل وصول الطبيب. نتعلم كيف نتصرف إذا سقط أحد زملائنا أو جرح، وكيف نطلب المساعدة من الكبار، وما يجب ألا نفعله كي لا نزيد الإصابة. الهدف أن نحفظ السلامة ونساعد بأمان.',
    objectives: [
      'يعرف معنى الإسعافات الأولية وهدفها.',
      'يذكر تصرفاً صحيحاً إذا سقط أحد زملائه أثناء اللعب.',
      'يوضح أهمية طلب المساعدة من الكبار.',
    ],
    vocab: [
      ['إسعافات أولية', 'مساعدة فورية قبل وصول الطبيب'],
      ['إصابة', 'ضرر يصيب الجسم'],
      ['سلامة', 'تجنب الأخطار والمحافظة على الصحة'],
    ],
    sub: ['ما الإسعافات الأولية؟', 'ماذا أفعل إذا سقط زميل؟', 'طلب المساعدة من الكبار', 'ما يجب ألا أفعله'],
    q: 'إذا سقط أحد زملائك أثناء اللعب، ماذا تفعل أولاً؟',
    options: ['أطلب المساعدة من الكبار وأطمئنه', 'أحمله بسرعة على كتفي', 'أضحك عليه', 'أتركه وأمضي'],
    answer: 'أطلب المساعدة من الكبار وأطمئنه',
    why: 'طلب المساعدة من الكبار وأمانة التصرف يمنعان مضاعفة الإصابة.',
    mis: 'أحمل المصاب بسرعة دون مساعدة',
  },
  {
    u: 1, n: 3, page: 20, pages: '20-25',
    ar: 'معاً نستطيع', en: 'Together We Can',
    focus:
      'العمل الجماعي يجعل الصعب سهلاً: كل فرد يقدم ما يتقنه، ونستمع إلى آراء بعضنا، ونتقبل النقد. نتعلم كيف نقسم المهمة، وكيف نحل الخلاف بالحوار لا بالخصام، وكيف نصل إلى هدفنا معاً.',
    objectives: [
      'يوضح فوائد العمل الجماعي.',
      'يقسم مهمة بين أفراد المجموعة بحسب مهاراتهم.',
      'يتقبل رأي الآخر ونقده ويحل الخلاف بالحوار.',
    ],
    vocab: [
      ['تعاون', 'عمل مشترك يقدم فيه كل فرد ما يستطيع'],
      ['حوار', 'كلام متبادل نفهم به وجهة نظر الآخر'],
      ['نقد', 'رأي يبين ما يحتاج إلى تحسين'],
    ],
    sub: ['فوائد العمل الجماعي', 'تقسيم المهمة', 'الاستماع وتقبل النقد', 'حل الخلاف بالحوار'],
    q: 'كيف نحل خلافاً بين أفراد المجموعة؟',
    options: ['بالحوار والاستماع لبعضنا', 'بالخصام والصراخ', 'بترك العمل', 'بإخفاء المشكلة'],
    answer: 'بالحوار والاستماع لبعضنا',
    why: 'الحوار يجعل كل فرد يعبر عن رأيه، فنصل إلى حل يقبله الجميع.',
    mis: 'الخصام يحل الخلاف',
  },
  {
    u: 2, n: 1, page: 28, pages: '28-35',
    ar: 'تغذية سليمة', en: 'Healthy Nutrition',
    focus:
      'الغذاء الصحي يمنح الجسم ما يحتاجه للنمو والطاقة. نتناول وجبة الإفطار، ونوازن بين المجموعات الغذائية، ونقلل الوجبات السريعة والمشروبات الغازية. نتعلم كيف نختار وجبة صحية من المقصف المدرسي.',
    objectives: [
      'يوضح أهمية وجبة الإفطار للجسم.',
      'يختار وجبة متوازنة من مجموعات الغذاء المختلفة.',
      'يفسر ضرر الإكثار من الوجبات السريعة والمشروبات الغازية.',
    ],
    vocab: [
      ['تغذية سليمة', 'غذاء متوازن يمنح الجسم ما يحتاجه'],
      ['وجبة متوازنة', 'وجبة تجمع مجموعات الغذاء بنسب مناسبة'],
      ['وجبة سريعة', 'طعام جاهز سريع غني بالدهون والسكر'],
    ],
    sub: ['أهمية وجبة الإفطار', 'مجموعات الغذاء', 'الوجبات السريعة والمشروبات الغازية', 'اختيار وجبة المقصف'],
    q: 'لماذا نتناول وجبة الإفطار؟',
    options: ['لتمنح الجسم الطاقة لبدء اليوم', 'لأنها وجبة ثقيلة', 'لتوفير وقت الغداء', 'لأنها لا تفيد'],
    answer: 'لتمنح الجسم الطاقة لبدء اليوم',
    why: 'بعد ليل طويل يحتاج الجسم إلى طاقة، فيمنحه الإفطار ما يبدأ به يومه.',
    mis: 'الإفطار وجبة يمكن إهمالها دائماً',
  },
  {
    u: 2, n: 2, page: 36, pages: '36-43',
    ar: 'مواردي واحتياجاتي', en: 'My Resources and My Needs',
    focus:
      'كل ما حولنا يُعد مورداً: الماء والكهرباء والوقت والمال. ولكل إنسان احتياجات يريد تلبيتها. نتعلم كيف نوازن بين الموارد والاحتياجات، وكيف نرشد الاستهلاك فنحافظ على الموارد ونلبي احتياجات أكثر.',
    objectives: [
      'يعرف معنى المورد والاحتياج ويميز بينهما.',
      'يذكر أمثلة لموارد في المنزل والمدرسة.',
      'يوضح كيف يساعد ترشيد الاستهلاك في تلبية احتياجات أكثر.',
    ],
    vocab: [
      ['مورد', 'ما نحتاجه ونستخدمه مثل الماء والوقت والمال'],
      ['احتياج', 'ما لا نستطيع الاستغناء عنه'],
      ['ترشيد الاستهلاك', 'استخدام الشيء بقدر الحاجة دون إسراف'],
    ],
    sub: ['ما المورد؟', 'ما الاحتياج؟', 'موارد المنزل والمدرسة', 'ترشيد الاستهلاك'],
    q: 'أي مما يلي يُعد مورداً؟',
    options: ['الماء', 'اللون الأحمر', 'اسم الشارع', 'عدد الحروف'],
    answer: 'الماء',
    why: 'الماء مورد نستخدمه كل يوم، وعلينا ألا نسرف فيه.',
    mis: 'الوقت ليس مورداً',
  },
  {
    u: 2, n: 3, page: 44, pages: '44-48',
    ar: 'إعادة التدوير', en: 'Recycling',
    focus:
      'إعادة التدوير تعني تحويل شيء انتهى دوره إلى منتج جديد نافع. نفرق بين إعادة الاستخدام وإعادة التدوير: الأولى تستخدم الشيء كما هو، والثانية تحوله إلى شيء آخر. نتعلم كيف نعيد تدوير الورق والبلاستيك لنحمي البيئة من التلوث.',
    objectives: [
      'يعرف معنى إعادة التدوير ويميزها عن إعادة الاستخدام.',
      'يذكر أمثلة لمخلفات يمكن إعادة تدويرها في المنزل.',
      'يوضح كيف تقلل إعادة التدوير من تلوث البيئة.',
    ],
    vocab: [
      ['إعادة تدوير', 'تحويل المخلفات إلى منتج جديد'],
      ['إعادة استخدام', 'استخدام الشيء مرة أخرى كما هو'],
      ['تلوث', 'إدخال مواد ضارة إلى البيئة'],
    ],
    sub: ['ما إعادة التدوير؟', 'الفرق بين إعادة التدوير وإعادة الاستخدام', 'أمثلة من المنزل', 'أثرها على البيئة'],
    q: 'ما معنى إعادة التدوير؟',
    options: ['تحويل المخلفات إلى منتج جديد', 'رمي المخلفات في الشارع', 'ترك المخلفات كما هي', 'حرق كل المخلفات'],
    answer: 'تحويل المخلفات إلى منتج جديد',
    why: 'إعادة التدوير تحول ما انتهى دوره إلى منتج نافع، فتقل المخلفات والتلوث.',
    mis: 'إعادة التدوير تعني رمي المخلفات',
  },
];

function toLesson(spec: Spec): OfficialCurriculumLesson {
  const conceptId = `conc_fam_2026_u${spec.u}_l${spec.n}`;
  const unit = UNITS[spec.u];
  const sourceRef: SourceRef = {
    book: 'Family_management_Prim5_TR1.pdf',
    bookAr: 'مهارات إدارة الأسرة — الصف الخامس الابتدائي — الفصل الدراسي الأول',
    bookEn: 'Family Management Skills, Grade 5, Term 1 (Ministry of Education)',
    grade: '5',
    term: '1',
    unit: String(spec.u),
    lesson: String(spec.n),
    page: spec.page,
    pageRange: spec.pages,
    notes:
      'Student book inspected (56 pages). Unit names, lesson names, lesson order and page ranges are from the printed contents page; each lesson runs eight printed pages. Explanations and exercises are Miss Noor originals, not Ministry text.',
    isAvailable: true,
  };

  return {
    id: `off_fam_2026_u${spec.u}_l${spec.n}`,
    subjectId: 'subj_family_management',
    subjectNameAr: 'مهارات إدارة الأسرة',
    subjectNameEn: 'Family Management Skills',
    subjectNameFr: 'Compétences de gestion familiale',
    unitNumber: spec.u,
    unitNameAr: unit.ar,
    unitNameEn: unit.en,
    unitNameFr: unit.en,
    lessonNumber: spec.n,
    titleAr: spec.ar,
    titleEn: spec.en,
    titleFr: spec.en,
    originTag: 'official',
    language: 'ar',
    instructionLanguage: 'ar',
    contentLanguage: 'ar',
    assessmentLanguage: 'ar',
    curriculumSource: 'egyptian_national',
    track: 'french_bilingual',
    isAvailable: true,
    contentStatus: 'available',
    sourceRef,
    objectives: spec.objectives,
    readingText: spec.focus + '\n\n' + spec.sub.map((s) => '• ' + s).join('\n'),
    vocabulary: spec.vocab.map(([word, definition]) => ({ word, definition })),
    exercises: [
      { type: 'multiple_choice', question: spec.q, options: spec.options, expectedAnswer: spec.answer, page: spec.page },
      { type: 'qa', question: 'اشرح بأسلوبك: ' + spec.objectives[0], expectedAnswer: spec.why, page: spec.page },
    ],
    exercisesByLanguage: {
      ar: [{ type: 'multiple_choice', question: spec.q, options: spec.options, expectedAnswer: spec.answer, page: spec.page }],
    },
    concepts: [
      {
        id: conceptId,
        conceptNumber: 1,
        titleAr: spec.ar,
        titleEn: spec.en,
        titleFr: spec.en,
        sourceText: spec.focus,
        sourceTextFr: spec.focus,
        keyPoints: spec.objectives,
        keyPointsFr: spec.objectives,
        dailyLifeExampleAr: spec.sub[0],
        dailyLifeExampleEn: spec.sub[0],
        dailyLifeExampleFr: spec.sub[0],
        storyAnalogyAr: spec.why,
        storyAnalogyEn: spec.why,
        storyAnalogyFr: spec.why,
        prerequisiteAr: 'معلومات الدرس السابق في نفس الوحدة.',
        prerequisiteEn: 'The information of the previous lesson in the same unit.',
        prerequisiteFr: 'Les informations de la leçon précédente de la même unité.',
        misconceptions: [
          {
            id: `mis_${conceptId}_1`,
            trigger: spec.mis,
            explanation: 'هذا الفهم لا يطابق الدرس.',
            remediation: spec.why,
            explanationFr: 'Cette compréhension ne correspond pas à la leçon.',
            remediationFr: spec.why,
          },
        ],
        visualType: 'diagram' as const,
        visualPrompt: 'رسم تعليمي يوضح ' + spec.ar + ' بالعناصر المذكورة في الدرس فقط.',
      },
    ],
  };
}

export const FAMILY_MANAGEMENT_CURRICULUM_2026_LESSONS: OfficialCurriculumLesson[] = S.map(toLesson);
