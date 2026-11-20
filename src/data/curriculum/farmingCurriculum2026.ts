/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * 2026/2027 Egypt Ministry Grade 5 Farming Skills (مهارات الزراعة), Term 1.
 *
 * Structure is taken from the inspected Ministry student book
 * `Farming_skills_prim5_t1.pdf` (35 pages). The contents page (printed page 4)
 * lists three units holding five lessons numbered continuously 1-5, and the
 * lesson opener pages confirm it: lesson 1 on printed page 7, lesson 2 on 12,
 * lesson 3 on 16, lesson 4 on 22 and lesson 5 on 27. The unit dividers are on
 * printed pages 5-6 (الزراعة المستدامة), 15 (الصناعات الغذائية) and 26
 * (الألبان). Lesson headings are rendered in Arabic presentation forms and were
 * read after NFKC normalisation.
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
  1: { ar: 'الوحدة الأولى: الزراعة المستدامة', en: 'Unit 1: Sustainable Farming' },
  2: { ar: 'الوحدة الثانية: الصناعات الغذائية', en: 'Unit 2: Food Industries' },
  3: { ar: 'الوحدة الثالثة: الألبان', en: 'Unit 3: Dairy' },
};

const S: Spec[] = [
  {
    u: 1, n: 1, page: 7, pages: '7-11',
    ar: 'الزراعة في حديقة المدرسة', en: 'Farming in the School Garden',
    focus:
      'حديقة المدرسة مكان نتعلم فيه الزراعة بأيدينا. نتعرف على أدوات الزراعة الأساسية مثل الفأس والمنقاش والمرش، ثم نعدّ حوضاً زراعياً ونزرع فيه بذوراً أو شتلات. نلاحظ الفرق بين نبات جيد الرعاية ونبات مهمل، ونقيّم مع مجموعتنا نجاح خطة الري والعناية.',
    objectives: [
      'يعدد أدوات الزراعة الأساسية المستخدمة في حديقة المدرسة.',
      'ينفذ خطوات إعداد حوض زراعي وزراعة بذور أو شتلات فيه.',
      'يميز بين نبات جيد الرعاية وآخر مهمل مستنتجاً أسباب الفرق.',
      'يقيّم مدى نجاح خطة الري والعناية التي وضعتها مجموعته.',
    ],
    vocab: [
      ['حوض زراعي', 'مساحة أرض مجهزة لزراعة النباتات'],
      ['شتلة', 'نبات صغير جاهز للنقل إلى الأرض'],
      ['بسترة', 'تسخين ثم تبريد سريع لقتل الميكروبات'],
    ],
    sub: [
      'أدوات الزراعة الأساسية',
      'مراحل نمو النبات في حديقة المدرسة',
      'إعداد الحوض وزراعة البذور',
      'خطة الري والعناية',
    ],
    q: 'أي مما يلي من أدوات الزراعة الأساسية؟',
    options: ['المنقاش', 'المسطرة', 'المقص الورقي', 'الآلة الحاسبة'],
    answer: 'المنقاش',
    why: 'المنقاش أداة صغيرة نحفر بها التربة ونقلع بها الحشائش، فهو من أدوات الزراعة.',
    mis: 'المسطرة من أدوات الزراعة الأساسية',
  },
  {
    u: 1, n: 2, page: 12, pages: '12-14',
    ar: 'إعادة تدوير مخلفات النباتات', en: 'Recycling Plant Waste',
    focus:
      'مخلفات النباتات في المنزل والمدرسة ليست قمامة، بل مادة نافعة. نتعرف على ثلاثة أنواع منها، ونفرق بين ما يتحلل وما لا يتحلل. ونتعلم خطوات عمل كومة سماد عضوي بسيطة (كمبوست) نعيد بها إلى التربة ما أخذته من النبات.',
    objectives: [
      'يعدد ثلاثة أنواع من مخلفات النباتات المنزلية أو المدرسية.',
      'ينفذ خطوات عمل كومة سماد عضوي (كمبوست) بسيطة.',
      'يفسر الفرق بين المخلفات النباتية القابلة للتحلل وغير القابلة للتحلل.',
      'يميز أثر إلقاء المخلفات النباتية وأثر إعادة تدويرها على البيئة.',
    ],
    vocab: [
      ['كمبوست', 'سماد عضوي نصنعه من تحلل مخلفات النباتات'],
      ['تحلل', 'تفكك المادة بفعل الكائنات الدقيقة'],
      ['إعادة تدوير', 'إعادة استخدام المخلفات في منتج نافع'],
    ],
    sub: [
      'أنواع مخلفات النباتات',
      'المخلفات القابلة للتحلل وغير القابلة للتحلل',
      'خطوات عمل الكمبوست',
      'أثر إعادة التدوير على البيئة',
    ],
    q: 'ما السماد الذي نصنعه من تحلل مخلفات النباتات؟',
    options: ['الكمبوست', 'الملح', 'السكر', 'الزيت'],
    answer: 'الكمبوست',
    why: 'الكمبوست سماد عضوي نصنعه من تحلل المخلفات النباتية، فيغذي التربة.',
    mis: 'الكمبوست سماد كيميائي مصنوع',
  },
  {
    u: 2, n: 1, page: 16, pages: '16-21',
    ar: 'الشراب المستخلص', en: 'Extracted Herbal Drinks',
    focus:
      'من النباتات نصنع مشروبات مستخلصة مثل شراب الكركديه واليانسون. الاستخلاص غير العصر وغير الخلط: الاستخلاص هو أن نسحب المادة النافعة من النبات بالماء أو الحرارة. ننفذ خطوات استخلاص شراب الكركديه البارد داخل معمل الزراعة.',
    objectives: [
      'يسمي ثلاثة مشروبات مصرية مستخلصة من النبات.',
      'ينفذ خطوات استخلاص شراب الكركديه البارد عملياً داخل معمل الزراعة.',
      'يفسر معنى الاستخلاص ويميزه عن العصر والخلط.',
      'يبتكر خلطة مشروب جديدة من نباتات متاحة.',
    ],
    vocab: [
      ['استخلاص', 'سحب المادة النافعة من النبات بالماء أو الحرارة'],
      ['عصر', 'استخراج السائل بالضغط'],
      ['خلط', 'جمع مواد مختلفة دون استخلاص'],
    ],
    sub: [
      'مشروبات مصرية مستخلصة من النبات',
      'طرق استخلاص الشراب',
      'خطوات استخلاص الكركديه البارد',
      'الاستخلاص ليس عصراً ولا خلطاً',
    ],
    q: 'ما الفرق بين الاستخلاص والخلط؟',
    options: ['الاستخلاص يسحب المادة النافعة من النبات', 'الخلط يسحب المادة النافعة', 'لا فرق بينهما', 'الاستخلاص أسرع دائماً'],
    answer: 'الاستخلاص يسحب المادة النافعة من النبات',
    why: 'الخلط يجمع المواد كما هي، أما الاستخلاص فيسحب ما في النبات من طعم أو رائحة أو فائدة.',
    mis: 'الخلط هو نفسه الاستخلاص',
  },
  {
    u: 2, n: 2, page: 22, pages: '22-25',
    ar: 'جولة داخل مصنع شراب الفاكهة', en: 'A Tour Inside a Fruit-Drink Factory',
    focus:
      'في المصنع يتحول عصير الفاكهة إلى شراب معلب. نتعرف على من يعمل داخل المصنع، ونرتب مراحل التصنيع بالترتيب الصحيح، ونفرق بين الشراب المصنع في المصنع والعصير المحضر يدوياً في المنزل. ونفهم سبب استخدام البسترة لحفظ الشراب من التلف، وأهمية إجراءات الجودة.',
    objectives: [
      'يرتب مراحل تصنيع شراب الفاكهة داخل المصنع بالترتيب الصحيح.',
      'يميز بين شراب الفاكهة المصنع في المصنع والعصير المحضر يدوياً في المنزل.',
      'يفسر سبب استخدام البسترة في حفظ شراب الفاكهة من التلف.',
      'يقيم أهمية إجراءات الجودة في المصنع.',
    ],
    vocab: [
      ['تصنيع', 'تحويل المادة الخام إلى منتج جاهز'],
      ['بسترة', 'تسخين ثم تبريد سريع لقتل الميكروبات'],
      ['جودة', 'مطابقة المنتج للمواصفات المطلوبة'],
    ],
    sub: [
      'من يعمل داخل المصنع',
      'مراحل تصنيع شراب الفاكهة',
      'البسترة وحفظ الشراب',
      'إجراءات الجودة',
    ],
    q: 'لماذا نستخدم البسترة في حفظ شراب الفاكهة؟',
    options: ['لقتل الميكروبات ومنع التلف', 'لزيادة السكر', 'لتغيير اللون', 'لتقليل الحجم'],
    answer: 'لقتل الميكروبات ومنع التلف',
    why: 'البسترة تسخّن الشراب ثم تبرّده سريعاً، فتقتل الميكروبات التي تفسده.',
    mis: 'البسترة تجعل الشراب أغلى فقط',
  },
  {
    u: 3, n: 1, page: 27, pages: '27-35',
    ar: 'اللبن: مصادر إنتاج اللبن', en: 'Milk: Sources of Milk Production',
    focus:
      'اللبن غذاء كامل. نتعرف على خمسة مصادر حيوانية لإنتاج اللبن، ونرتب مراحل رحلة اللبن من الحلب حتى وصوله إلى مائدة الأسرة. ونفهم أهمية البسترة في حفظ اللبن وضمان سلامته، ثم نقترح فكرة منتج جديد قائم على اللبن مثل الزبادي أو الجبن.',
    objectives: [
      'يعدد خمسة مصادر حيوانية لإنتاج اللبن.',
      'يرتب مراحل رحلة اللبن من الحلب حتى وصوله لمائدة الأسرة.',
      'يفسر سبب أهمية البسترة في حفظ اللبن وضمان سلامته.',
      'يقترح فكرة منتج جديد قائم على اللبن.',
    ],
    vocab: [
      ['حلب', 'استخراج اللبن من الحيوان'],
      ['بسترة', 'تسخين ثم تبريد سريع لقتل الميكروبات'],
      ['منتجات لبنية', 'أطعمة تصنع من اللبن مثل الجبن والزبادي'],
    ],
    sub: [
      'مصادر الحصول على اللبن',
      'مراحل رحلة اللبن',
      'البسترة وسلامة اللبن',
      'المنتجات اللبنية',
    ],
    q: 'ما أول مرحلة في رحلة اللبن حتى مائدة الأسرة؟',
    options: ['الحلب', 'التعبئة', 'البيع في السوق', 'صناعة الجبن'],
    answer: 'الحلب',
    why: 'الرحلة تبدأ بالحلب، ثم التبريد والبسترة، ثم التعبئة والنقل حتى المائدة.',
    mis: 'رحلة اللبن تبدأ بالتعبئة',
  },
];

function toLesson(spec: Spec): OfficialCurriculumLesson {
  const conceptId = `conc_farm_2026_u${spec.u}_l${spec.n}`;
  const unit = UNITS[spec.u];
  const sourceRef: SourceRef = {
    book: 'Farming_skills_prim5_t1.pdf',
    bookAr: 'مهارات الزراعة — الصف الخامس الابتدائي — الفصل الدراسي الأول',
    bookEn: 'Farming Skills, Grade 5, Term 1 (Ministry of Education)',
    grade: '5',
    term: '1',
    unit: String(spec.u),
    lesson: String(spec.n),
    page: spec.page,
    pageRange: spec.pages,
    notes:
      'Student book inspected (35 pages). Unit and lesson structure and printed page numbers are from the book; lesson headings use Arabic presentation forms and were read after NFKC normalisation. Explanations and exercises are Miss Noor originals, not Ministry text.',
    isAvailable: true,
  };

  return {
    id: `off_farm_2026_u${spec.u}_l${spec.n}`,
    subjectId: 'subj_farming',
    subjectNameAr: 'مهارات الزراعة',
    subjectNameEn: 'Farming Skills',
    subjectNameFr: 'Compétences agricoles',
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

export const FARMING_CURRICULUM_2026_LESSONS: OfficialCurriculumLesson[] = S.map(toLesson);
