/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { OfficialCurriculumLesson } from '../../types/teachingSession';

/**
 * Official Egyptian Ministry of Education Curriculum for Grade 5 (Term 1)
 * Subject: العلوم (Science) — الصف الخامس الابتدائي
 */
export const SCIENCE_CURRICULUM_LESSONS: OfficialCurriculumLesson[] = [
  {
    id: 'off_sci_u1_l1_plant_needs',
    subjectId: 'subj_science',
    subjectNameAr: 'العلوم',
    subjectNameEn: 'Science',
    unitNumber: 1,
    unitNameAr: 'الوحدة الأولى: العلاقات الغذائية في الأنظمة الحية',
    unitNameEn: 'Unit 1: Energy & Relationships in Living Systems',
    lessonNumber: 1,
    titleAr: 'احتياجات النبات وعملية البناء الضوئي',
    titleEn: 'Plant Needs & Photosynthesis Process',
    originTag: 'official',
    isAvailable: true,
    sourceRef: {
      book: 'كتاب العلوم — الصف الخامس الابتدائي — الفصل الدراسي الأول',
      bookAr: 'العلوم — كتاب الوزارة ص. 10-18',
      bookEn: 'Science Ministry Book pp. 10-18',
      grade: 'الصف الخامس',
      term: 'الفصل الدراسي الأول',
      unit: 'الوحدة الأولى',
      lesson: 'المفهوم الأول: احتياجات النبات',
      page: 10,
      isAvailable: true,
    },
    objectives: [
      'يميز بين الاحتياجات الأساسية للنبات (الماء، الهواء/ثاني أكسيد الكربون، ضوء الشمس، المساحة) وغير الأساسية كالتربة الصخرية.',
      'يشرح خطوات عملية البناء الضوئي وإنتاج سكر الجلوكوز وغاز الأكسجين.',
      'يوضح دور أوعية الخشب (Xylem) وأوعية اللحاء (Phloem) في نقل الماء والغذاء داخل النبات.',
    ],
    readingText: `يحتاج النبات إلى مقومات أساسية للنمو وصنع غذائه بنفسه:
1. الجذور: تمتص الماء والعناصر الغذائية من التربة، وبها شعيرات جذرية لزيادة الامتصاص.
2. الساق: تدعم النبات وتنقل الماء عبر أوعية الخشب (Xylem) إلى الأوراق.
3. الأوراق: مصنع الغذاء؛ تحتوي على البلاستيدات الخضراء بمادة الكلوروفيل التي تمتص ضوء الشمس، والثغور (Stomata) التي تمتص غاز ثاني أكسيد الكربون.
عملية البناء الضوئي:
يتحد الماء مع ثاني أكسيد الكربون في وجود ضوء الشمس لإنتاج:
- سكر الجلوكوز (مصدر طاقة النبات).
- غاز الأكسجين النقي الذي تتنفسه الكائنات الحية.
ثم تقوم أوعية اللحاء (Phloem) بنقل سكر الجلوكوز من الأوراق إلى باقي أجزاء النبات لينمو ويثمر.`,
    vocabulary: [
      { word: 'البناء الضوئي', definition: 'عملية حيوية تصنع بها النباتات الخضراء غذاءها باستخدام ضوء الشمس وثاني أكسيد الكربون والماء.' },
      { word: 'أوعية الخشب (Xylem)', definition: 'أنابيب دقيقة تنقل الماء والأملاح المعدنية صعوداً من الجذور إلى الأوراق.' },
      { word: 'أوعية اللحاء (Phloem)', definition: 'أنابيب تنقل السكر والغذاء الجاهز هبوطاً وصعوداً من الأوراق إلى سائر أجزاء النبات.' },
      { word: 'الثغور (Stomata)', definition: 'فتحات مجهرية على سطح الأوراق تسمح بدخول وخروج الغازات وبخار الماء.' },
    ],
    exercises: [
      {
        type: 'multiple_choice',
        question: 'الأوعية التي تنقل الماء والعناصر المعدنية من الجذور إلى الأوراق تسمى:',
        options: ['أوعية الخشب (Xylem)', 'أوعية اللحاء (Phloem)', 'الشعيرات الدموية', 'البلاستيدات'],
        expectedAnswer: 'أوعية الخشب (Xylem)',
        page: 14,
      },
      {
        type: 'multiple_choice',
        question: 'الغاز الناتج عن عملية البناء الضوئي والذي تحتاجه الكائنات الحية للتنفس هو:',
        options: ['غاز الأكسجين', 'غاز ثاني أكسيد الكربون', 'غاز النيتروجين', 'بخار الزيت'],
        expectedAnswer: 'غاز الأكسجين',
        page: 16,
      },
    ],
    concepts: [
      {
        id: 'off_sci_u1_l1_c1',
        conceptNumber: 1,
        titleAr: 'مصنع الغذاء في النبات الخضر',
        titleEn: 'Green Plant Food Factory',
        sourceText: 'النبات كائن منتج يصنع غذاءه بنفسه من خلال البناء الضوئي.',
        keyPoints: [
          'الجذور تمتص، وأوعية الخشب تنقل، والأوراق تصنع السكر.',
          'الكلوروفيل يمنح النبات لونه الأخضر ويمتص طاقة الشمس.',
          'بدون النباتات ينفد الأكسجين وتتوقف الحياة على كوكب الأرض.',
        ],
        dailyLifeExampleAr: 'وضع نبتة ظل داخل شرفة مشمسة وملاحظة اخضرار أوراقها السريع مقارنة بوضعها في غرفة مظلمة.',
        dailyLifeExampleEn: 'Placing a potted plant on a sunny balcony and seeing its leaves grow vibrant green.',
        storyAnalogyAr: 'ورقة الشجر مثل مطبخ البيت؛ الشمس هي الفرن، والماء وثاني أكسيد الكربون هما المقادير لصنع وجبة السكر!',
        storyAnalogyEn: 'A leaf is like a home kitchen: sunlight is the oven, water and CO2 are ingredients for a sugar meal.',
        prerequisiteAr: 'أجزاء النبات الأساسية: جذر وساق وأوراق.',
        prerequisiteEn: 'Basic plant parts.',
        visualType: 'diagram',
        misconceptions: [
          {
            id: 'mis_ar_sci_xylem_phloem',
            trigger: 'اللحاء',
            explanation: 'خلطتِ بين أوعية الخشب وأوعية اللحاء: اللحاء ينقل الغذاء الجاهز، لا الماء.',
            remediation: 'الماء والأملاح يصعدان في أوعية الخشب (Xylem) من الجذور إلى الأوراق؛ أما اللحاء (Phloem) فينقل السكر.',
          },
          {
            id: 'mis_ar_sci_root_hairs',
            trigger: 'الشعيرات',
            explanation: 'الشعيرات الدموية موجودة في جسم الإنسان، وليست في النبات.',
            remediation: 'النبات يمتص الماء بالشعيرات الجذرية الدقيقة على الجذور، ثم تنقله أوعية الخشب.',
          },
          {
            id: 'mis_ar_sci_chloroplast',
            trigger: 'البلاستيدات',
            explanation: 'البلاستيدات الخضراء هي مصنع الغذاء داخل الورقة، ولا تنقل الماء.',
            remediation: 'النقل وظيفة أوعية الخشب؛ البلاستيدات تحتوي الكلوروفيل الذي يمتص ضوء الشمس.',
          },
          {
            id: 'mis_ar_sci_co2_input',
            trigger: 'الكربون',
            explanation: 'ثاني أكسيد الكربون مادة داخلة في البناء الضوئي، وليس ناتجاً عنه.',
            remediation: 'النبات يأخذ ثاني أكسيد الكربون من الهواء، والناتج هو غاز الأكسجين.',
          },
          {
            id: 'mis_ar_sci_nitrogen',
            trigger: 'النيتروجين',
            explanation: 'النيتروجين ليس من نواتج البناء الضوئي.',
            remediation: 'نواتج البناء الضوئي هي سكر الجلوكوز وغاز الأكسجين.',
          },
          {
            id: 'mis_ar_sci_oil_vapour',
            trigger: 'الزيت',
            explanation: 'بخار الزيت ليس من نواتج البناء الضوئي.',
            remediation: 'نواتج البناء الضوئي هي سكر الجلوكوز وغاز الأكسجين.',
          },
        ],
        distractors: [
          'أوعية اللحاء (Phloem)|mis_ar_sci_xylem_phloem',
          'الشعيرات الدموية|mis_ar_sci_root_hairs',
          'البلاستيدات|mis_ar_sci_chloroplast',
          'غاز ثاني أكسيد الكربون|mis_ar_sci_co2_input',
          'غاز النيتروجين|mis_ar_sci_nitrogen',
          'بخار الزيت|mis_ar_sci_oil_vapour',
        ],
      },
    ],
  },
  {
    id: 'off_sci_u1_l2_ecosystem',
    subjectId: 'subj_science',
    subjectNameAr: 'العلوم',
    subjectNameEn: 'Science',
    unitNumber: 1,
    unitNameAr: 'الوحدة الأولى: العلاقات الغذائية في الأنظمة الحية',
    unitNameEn: 'Unit 1: Energy & Relationships in Living Systems',
    lessonNumber: 2,
    titleAr: 'انتقال الطاقة في النظام البيئي والشبكات الغذائية',
    titleEn: 'Energy Flow in Ecosystems & Food Webs',
    originTag: 'official',
    isAvailable: true,
    sourceRef: {
      book: 'كتاب العلوم — الصف الخامس الابتدائي — الفصل الدراسي الأول',
      bookAr: 'العلوم — كتاب الوزارة ص. 20-32',
      bookEn: 'Science Ministry Book pp. 20-32',
      grade: 'الصف الخامس',
      term: 'الفصل الدراسي الأول',
      unit: 'الوحدة الأولى',
      lesson: 'المفهوم الثاني: انتقال الطاقة',
      page: 20,
      isAvailable: true,
    },
    objectives: [
      'يصنف الكائنات الحية إلى منتجة (نباتات وطحالب)، ومستهلكة (أولية وثانوية ومفترسة)، ومحللة (بكتيريا وفطريات).',
      'يتتبع سريان الطاقة الشمسية عبر السلاسل والشبكات الغذائية المتداخلة.',
      'يوضح أهمية الكائنات المحللة في إعادة تدوير العناصر الغذائية إلى التربة للحفاظ على توازن البيئة.',
    ],
    readingText: `الشمس هي المصدر الرئيسي للطاقة لجميع الكائنات الحية على سطح الأرض:
1. الكائنات المنتجة (Producers): كالنباتات الخضراء في اليابسة والطحالب في البحار؛ تمتص ضوء الشمس لتصنع غذاءها.
2. الكائنات المستهلكة (Consumers):
   - مستهلك أولي: آكلات العشب (كالجراد والأرانب والغزلان).
   - مستهلك ثانوي: آكلات اللحوم الصغيرة (كالطيور والضفادع).
   - مستهلك ثالث وقائم في قمة السلسلة (مفترسات كبرى): كالأسود والنسور وأسماك القرش.
3. الكائنات المحللة (Decomposers): كالفطريات والبكتيريا وديدان الأرض؛ تحلل بقايا الكائنات الميتة وتعيد العناصر الكيميائية (كالنيتروجين والفسفور) إلى التربة لتتغذى عليها النباتات من جديد في دورة حياة متكاملة.`,
    vocabulary: [
      { word: 'سلسلة غذائية', definition: 'مسار انتقال الطاقة الغذائية من كائن حي إلى كائن حي آخر في النظام البيئي.' },
      { word: 'شبكة غذائية', definition: 'تداخل وترابط مجموعة من السلاسل الغذائية معاً في نفس البيئة.' },
      { word: 'كائنات محللة', definition: 'كائنات حية كالفطريات والبكتيريا تعيد تدوير المادة العضوية إلى التربة.' },
    ],
    exercises: [
      {
        type: 'multiple_choice',
        question: 'تبدأ السلسلة الغذائية في أي نظام بيئي دائماً بكائن:',
        options: ['كائن منتج (كالنباتات الخضراء)', 'كائن مفترس (كالأسد)', 'كائن محلل', 'حيوان أليف'],
        expectedAnswer: 'كائن منتج (كالنباتات الخضراء)',
        page: 25,
      },
      {
        type: 'multiple_choice',
        question: 'تلعب الكائنات المحللة (كالفطريات والبكتيريا) دوراً حيوياً في:',
        options: ['إعادة تدوير العناصر الغذائية إلى التربة وزيادة خصوبتها', 'صنع الغذاء من ضوء الشمس', 'افتراس الحشرات', 'تنقية الهواء من الغبار'],
        expectedAnswer: 'إعادة تدوير العناصر الغذائية إلى التربة وزيادة خصوبتها',
        page: 28,
      },
    ],
    concepts: [
      {
        id: 'off_sci_u1_l2_c1',
        conceptNumber: 1,
        titleAr: 'دورة الطاقة المستمرة من الشمس إلى التربة',
        titleEn: 'Solar Energy Cycle in Nature',
        sourceText: 'الشمس تمد النبات بالطاقة، والنبات يغذي الحيوانات، والمحللات تعيد المغذيات للتربة.',
        keyPoints: [
          'الطاقة لا تفنى بل تنتقل من مستوى غذائي لآخر.',
          'الشبكة الغذائية المتنوعة تجعل النظام البيئي أكثر استقراراً وقوة.',
        ],
        dailyLifeExampleAr: 'ملاحظة نبات الحديقة الذي يأكله الحلزون، ثم يأكل الطائر الحلزون، وعندما يموت الطائر تحلله بكتيريا التربة.',
        dailyLifeExampleEn: 'Garden grass eaten by a snail, which is eaten by a sparrow, which returns nutrients to soil upon decomposition.',
        storyAnalogyAr: 'مثل سباق تتابع العصا؛ الشمس تسلم العصا للنبات، والنبات يسلمها للحيوان، والمحللات تسلمها للأرض لتبدأ دورة جديدة.',
        storyAnalogyEn: 'Like a relay race where energy is the baton passed from sun to plant to animals and back to earth.',
        prerequisiteAr: 'التمييز بين الحيوانات آكلة العشب وآكلة اللحوم.',
        prerequisiteEn: 'Herbivore vs carnivore diets.',
        visualType: 'concept_map',
        misconceptions: [
          {
            id: 'mis_ar_sci_starts_predator',
            trigger: 'مفترس',
            explanation: 'السلسلة الغذائية لا تبدأ بمفترس؛ المفترس في نهايتها لا بدايتها.',
            remediation: 'ابدئي دائماً بالكائن المنتج كالنبات الأخضر الذي يصنع غذاءه بنفسه من ضوء الشمس.',
          },
          {
            id: 'mis_ar_sci_decomposer_start',
            trigger: 'محلل',
            explanation: 'الكائن المحلل لا يبدأ السلسلة، بل يعمل في نهايتها على تفكيك البقايا.',
            remediation: 'ابدئي بالكائن المنتج؛ المحللات تعيد العناصر الغذائية إلى التربة بعد موت الكائنات.',
          },
          {
            id: 'mis_ar_sci_pet',
            trigger: 'أليف',
            explanation: 'الحيوان الأليف ليس بداية السلسلة الغذائية في النظام البيئي.',
            remediation: 'السلسلة تبدأ بالكائن المنتج، ثم المستهلك آكل العشب، ثم آكل اللحوم.',
          },
          {
            id: 'mis_ar_sci_decomposer_photosynthesis',
            trigger: 'ضوء الشمس',
            explanation: 'صنع الغذاء من ضوء الشمس وظيفة الكائن المنتج، لا الكائن المحلل.',
            remediation: 'الكائنات المحللة كالفطريات والبكتيريا تفكك البقايا وتعيد المغذيات إلى التربة.',
          },
          {
            id: 'mis_ar_sci_decomposer_predation',
            trigger: 'افتراس',
            explanation: 'دور الكائنات المحللة ليس افتراس الحشرات.',
            remediation: 'المحللات تعيد تدوير العناصر الغذائية إلى التربة وتزيد خصوبتها.',
          },
          {
            id: 'mis_ar_sci_decomposer_air',
            trigger: 'الغبار',
            explanation: 'تنقية الهواء من الغبار ليست وظيفة الكائنات المحللة.',
            remediation: 'وظيفة المحللات إعادة المغذيات إلى التربة لتبدأ دورة جديدة.',
          },
        ],
        distractors: [
          'كائن مفترس (كالأسد)|mis_ar_sci_starts_predator',
          'كائن محلل|mis_ar_sci_decomposer_start',
          'حيوان أليف|mis_ar_sci_pet',
          'صنع الغذاء من ضوء الشمس|mis_ar_sci_decomposer_photosynthesis',
          'افتراس الحشرات|mis_ar_sci_decomposer_predation',
          'تنقية الهواء من الغبار|mis_ar_sci_decomposer_air',
        ],
      },
    ],
  },
  {
    id: 'off_sci_u1_l3_coral_bleaching',
    subjectId: 'subj_science',
    subjectNameAr: 'العلوم',
    subjectNameEn: 'Science',
    unitNumber: 1,
    unitNameAr: 'الوحدة الأولى: العلاقات الغذائية بين الكائنات الحية',
    unitNameEn: 'Unit 1: Food Relationships Between Living Things',
    lessonNumber: 3,
    titleAr: 'التغيرات في الشبكات الغذائية',
    titleEn: 'Changes in Food Webs',
    originTag: 'official',
    isAvailable: true,
    sourceRef: {
      book: 'كتاب العلوم 1 — الصف الخامس الابتدائي — الفصل الدراسي الأول',
      bookAr: 'العلوم — كتاب الوزارة ص. 36-59',
      bookEn: 'Science Student Book 1 pp. 36-59',
      grade: 'الصف الخامس',
      term: 'الفصل الدراسي الأول',
      unit: 'الوحدة الأولى',
      lesson: 'المفهوم الثالث: التغيرات في الشبكات الغذائية',
      page: 36,
      isAvailable: true,
    },
    objectives: [
      'يشرح باستخدام النماذج كيف يؤدي تغير البيئة أو أعداد أحد الكائنات الحية إلى تغير الشبكة الغذائية.',
      'يفسر أثر النشاط البشري وفقدان المواطن الطبيعية والتلوث في الكائنات الحية.',
      'يناقش حلولاً تساعد على حماية الأنظمة البيئية وإصلاح ما يتضرر منها.',
    ],
    readingText: "تتكون الشبكة الغذائية من سلاسل غذائية مترابطة، وتوضح كيف تنتقل الطاقة بين الكائنات الحية في النظام البيئي. تبدأ الطاقة من الشمس، وتستخدمها النباتات والطحالب بوصفها كائنات منتجة، ثم تنتقل إلى الحيوانات التي تتغذى عليها، وبعد ذلك إلى كائنات أخرى في الشبكة. لذلك فإن تغير أعداد نوع واحد قد يؤثر في أنواع كثيرة مرتبطة به.\n\nإذا اختفى العشب من بيئة صحراوية، فقد يقل غذاء الأرانب البرية، ثم تتأثر الطيور الجارحة التي تتغذى على الأرانب. كما أن الجفاف أو تغير المناخ أو فقدان الموطن الطبيعي قد يغير أعداد الكائنات ومصادر غذائها. وتؤثر الأنشطة البشرية مثل بناء الطرق والمباني وإلقاء المخلفات والصيد الجائر في المواطن الطبيعية والتوازن البيئي.\n\nيمكن حماية الشبكات الغذائية بالمحافظة على المواطن الطبيعية، وتقليل التلوث والمخلفات البلاستيكية، وتنظيم الصيد، وإنشاء المحميات ومتابعة صحة الأنظمة البيئية. ويساعدنا النموذج الغذائي على توقع ما قد يحدث إذا زاد نوع من الكائنات أو قل أو اختفى.",
    vocabulary: [
      { word: 'الشبكة الغذائية', definition: 'مجموعة من السلاسل الغذائية المترابطة في نظام بيئي واحد.' },
      { word: 'الموطن الطبيعي', definition: 'المكان الذي يوفر للكائن الحي الغذاء والماء والمأوى.' },
      { word: 'فقدان الموطن', definition: 'تغير المكان الذي يعيش فيه الكائن أو اختفاؤه بما يهدد بقاءه.' },
      { word: 'إصلاح النظام البيئي', definition: 'اتخاذ إجراءات تساعد البيئة المتضررة على استعادة توازنها.' },
    ],
    exercises: [
      {
        type: 'multiple_choice',
        question: 'إذا اختفى العشب من شبكة غذائية صحراوية، فما الأثر المتوقع أولاً على الأرانب البرية؟',
        options: ['يقل الغذاء المتاح لها', 'يزداد غذاؤها مباشرة', 'تتحول إلى كائنات منتجة', 'لا تتأثر مطلقاً'],
        expectedAnswer: 'يقل الغذاء المتاح لها',
        page: 42,
      },
      {
        type: 'multiple_choice',
        question: 'أي نشاط بشري قد يؤدي إلى فقدان المواطن الطبيعية؟',
        options: ['إزالة مناطق طبيعية لبناء الطرق والمباني', 'إنشاء محمية طبيعية', 'تقليل المخلفات البلاستيكية', 'تنظيم الصيد لحماية الأنواع'],
        expectedAnswer: 'إزالة مناطق طبيعية لبناء الطرق والمباني',
        page: 44,
      },
    ],
    concepts: [
      {
        id: 'off_sci_u1_l3_c1',
        conceptNumber: 3,
        titleAr: 'التغيرات في الشبكات الغذائية',
        titleEn: 'Changes in Food Webs',
        sourceText: 'تؤثر التغيرات البيئية وتغير أعداد الكائنات الحية والأنشطة البشرية في العلاقات الغذائية وتوازن النظام البيئي.',
        keyPoints: [
          'تنتقل الطاقة بين الكائنات عبر سلاسل وشبكات غذائية مترابطة.',
          'قد يؤثر اختفاء كائن أو فقدان موطنه في أعداد كائنات أخرى داخل الشبكة.',
          'تساعد حماية المواطن الطبيعية وتقليل التلوث وتنظيم الصيد على حماية النظام البيئي.',
        ],
        dailyLifeExampleAr: 'إذا قلت الحشرات في حديقة المدرسة فقد تجد الطيور غذاء أقل، وقد تتغير أعداد كائنات أخرى تعتمد على هذه الطيور أو الحشرات.',
        dailyLifeExampleEn: 'If insects decline in a school garden, birds may find less food and other connected populations may change.',
        storyAnalogyAr: 'الشبكة الغذائية مثل مجموعة تروس متصلة؛ إذا توقف ترس أو تغيرت سرعته تأثرت التروس المرتبطة به.',
        storyAnalogyEn: 'A food web is like connected gears: changing one gear affects the others linked to it.',
        prerequisiteAr: 'معرفة الكائنات المنتجة والمستهلكة والمحللة والسلاسل الغذائية.',
        prerequisiteEn: 'Knowledge of producers, consumers, decomposers, and food chains.',
        visualType: 'concept_map',
        misconceptions: [
          { id: 'mis_sci_foodweb_no_effect', trigger: 'لا تتأثر مطلقاً', explanation: 'اختفاء مصدر الغذاء قد يؤثر في الكائنات التي تعتمد عليه.', remediation: 'بص يا بطل، الكائنات مرتبطة بالغذاء؛ لو قل العشب يقل غذاء الأرانب وقد تتأثر الحيوانات التي تصطادها.' },
          { id: 'mis_sci_foodweb_producer', trigger: 'تتحول إلى كائنات منتجة', explanation: 'الأرانب لا تصنع غذاءها مثل النباتات؛ هي مستهلكات.', remediation: 'افتكر إن النبات هو المنتج، أما الأرنب فيحصل على غذائه بأكل النباتات.' },
          { id: 'mis_sci_foodweb_more_food', trigger: 'يزداد غذاؤها مباشرة', explanation: 'اختفاء العشب يقلل مصدر الغذاء الذي تعتمد عليه الأرانب.', remediation: 'لما مصدر الغذاء يختفي، المتغذي عليه غالباً يلاقي غذاء أقل مش أكتر.' },
          { id: 'mis_sci_foodweb_reserve', trigger: 'إنشاء محمية طبيعية', explanation: 'إنشاء المحميات يساعد على حماية المواطن ولا يسبب فقدانها.', remediation: 'المحمية بتحمي المكان والكائنات؛ فقدان الموطن يحصل لما يتدمر أو يتغير المكان الطبيعي.' },
          { id: 'mis_sci_foodweb_reduce_waste', trigger: 'تقليل المخلفات البلاستيكية', explanation: 'تقليل البلاستيك إجراء حماية وليس سبباً لفقدان الموطن.', remediation: 'تقليل البلاستيك بيحافظ على البيئة؛ اختاري النشاط اللي يزيل أو يدمر الموطن الطبيعي.' },
          { id: 'mis_sci_foodweb_control_hunting', trigger: 'تنظيم الصيد لحماية الأنواع', explanation: 'تنظيم الصيد يحافظ على أعداد الكائنات ولا يدمر المواطن الطبيعية.', remediation: 'تنظيم الصيد وسيلة حماية؛ إزالة الموطن تحدث مثلاً عند بناء الطرق والمباني في مكان الكائنات.' },
        ],
        distractors: [
          'لا تتأثر مطلقاً|mis_sci_foodweb_no_effect',
          'تتحول إلى كائنات منتجة|mis_sci_foodweb_producer',
          'يزداد غذاؤها مباشرة|mis_sci_foodweb_more_food',
          'إنشاء محمية طبيعية|mis_sci_foodweb_reserve',
          'تقليل المخلفات البلاستيكية|mis_sci_foodweb_reduce_waste',
          'تنظيم الصيد لحماية الأنواع|mis_sci_foodweb_control_hunting',
        ],
      },
    ],
  },
];

/**
 * Arabic-track additions for the two missing concepts in Unit 2.
 * Concept scope and page anchors are checked against the Grade 5 Science
 * student-book pages indexed for Unit 2; explanations are Miss Noor-authored.
 */
type ScienceGapSpec={
 id:string;conceptNumber:number;lessonNumber:number;titleAr:string;titleEn:string;page:number;
 objectives:string[];readingText:string;vocabulary:{word:string;definition:string}[];
 questions:{question:string;options:string[];answer:string}[];
 keyPoints:string[];exampleAr:string;exampleEn:string;analogyAr:string;analogyEn:string;correction:string;
};
function makeScienceGapLesson(spec:ScienceGapSpec):OfficialCurriculumLesson {
 const wrong=spec.questions.flatMap((q,qi)=>q.options.filter(o=>o!==q.answer).map((option,wi)=>({
  id:spec.id+'_mis_'+(qi+1)+'_'+(wi+1),trigger:option,
  explanation:'الاختيار «'+option+'» لا يصف الفكرة العلمية التي يختبرها السؤال. '+spec.correction,
  remediation:'بص يا بطل، '+spec.correction,
 })));
 return {
  id:spec.id,subjectId:'subj_science',subjectNameAr:'العلوم',subjectNameEn:'Science',
  unitNumber:2,unitNameAr:'الوحدة الثانية: حركة الجسيمات',unitNameEn:'Unit 2: Particle Motion',
  lessonNumber:spec.lessonNumber,titleAr:spec.titleAr,titleEn:spec.titleEn,
  sourceRef:{
   book:'كتاب العلوم 1 — الصف الخامس الابتدائي — الفصل الدراسي الأول',
   bookAr:'العلوم — كتاب الوزارة — الوحدة الثانية: حركة الجسيمات',
   bookEn:'Science Student Book 1 — Unit 2: Particle Motion',
   grade:'الصف الخامس',term:'الفصل الدراسي الأول',
   unit:'الوحدة الثانية',lesson:'المفهوم '+spec.conceptNumber+': '+spec.titleAr,
   page:spec.page,isAvailable:true,
  },
  objectives:spec.objectives,readingText:spec.readingText,vocabulary:spec.vocabulary,
  exercises:spec.questions.map(q=>({type:'multiple_choice' as const,question:q.question,options:q.options,expectedAnswer:q.answer})),
  concepts:[{
   id:spec.id+'_c'+spec.conceptNumber,conceptNumber:spec.conceptNumber,
   titleAr:spec.titleAr,titleEn:spec.titleEn,sourceText:spec.readingText,
   keyPoints:spec.keyPoints,dailyLifeExampleAr:spec.exampleAr,dailyLifeExampleEn:spec.exampleEn,
   storyAnalogyAr:spec.analogyAr,storyAnalogyEn:spec.analogyEn,
   prerequisiteAr:'معرفة أن المادة تشغل حيزاً ولها كتلة، والقدرة على ملاحظة التغيرات حولنا.',
   prerequisiteEn:'Understanding that matter has mass and occupies space, and observing everyday changes.',
   visualType:'diagram',misconceptions:wrong,distractors:wrong.map(m=>m.trigger+'|'+m.id),
  }],
  originTag:'official',language:'ar',instructionLanguage:'ar',contentLanguage:'ar',assessmentLanguage:'ar',isAvailable:true,
 };
}
const SCIENCE_UNIT_2_GAP_LESSONS:OfficialCurriculumLesson[]=[
makeScienceGapLesson({
 id:'off_sci_u2_c1_matter_in_world',conceptNumber:1,lessonNumber:1,page:64,
 titleAr:'المادة في العالم من حولنا',titleEn:'Matter in the World Around Us',
 objectives:[
 'يناقش الخصائص المميزة لحالات المادة الثلاث: الصلبة والسائلة والغازية.',
 'يشرح كيف تؤثر التغيرات في حالة المادة في حركة جسيماتها.',
 'يطور نماذج توضح ترتيب الجسيمات وحركتها في حالات المادة المختلفة.'
 ],
 readingText:"كل ما يحيط بنا من أشياء مادية يتكون من مادة، والمادة هي كل ما له كتلة ويشغل حيزاً من الفراغ. توجد المادة في ثلاث حالات أساسية: صلبة وسائلة وغازية. ولكل حالة خصائص تساعدنا على تمييزها.\n\nفي الحالة الصلبة تكون الجسيمات متقاربة ومترابطة وتهتز في أماكنها، لذلك يحتفظ الجسم الصلب بشكله وحجمه غالباً. أما السائل فجسيماته متقاربة لكنها تستطيع الانزلاق والتحرك حول بعضها، لذلك يحتفظ بحجمه ويأخذ شكل الوعاء. وفي الحالة الغازية تكون الجسيمات متباعدة وتتحرك بحرية، فينتشر الغاز ويأخذ شكل وحجم الوعاء.\n\nيمكن أن تتغير حالة المادة عندما تكتسب طاقة حرارية أو تفقدها. فعند تسخين الثلج ينصهر ويتحول إلى ماء سائل، وعند تبريد الماء يتجمد. تساعدنا النماذج على تصور الجسيمات الصغيرة التي لا نراها بالعين المجردة وفهم اختلاف حركتها وترتيبها.",
 vocabulary:[
 {word:'المادة',definition:'كل شيء له كتلة ويشغل حيزاً من الفراغ.'},
 {word:'جسيم',definition:'جزء صغير جداً تتكون منه المادة.'},
 {word:'الحالة الصلبة',definition:'حالة تحتفظ فيها المادة بشكلها وحجمها غالباً.'},
 {word:'الحالة الغازية',definition:'حالة تنتشر فيها الجسيمات وتملأ الوعاء.'}
 ],
 questions:[
 {question:'أي وصف يناسب جسيمات المادة في الحالة الصلبة؟',options:['متقاربة وتهتز في أماكنها','متباعدة وتتحرك بحرية كبيرة','تختفي تماماً','تتحرك بعيداً حتى تملأ الوعاء'],answer:'متقاربة وتهتز في أماكنها'},
 {question:'لماذا يأخذ السائل شكل الوعاء الذي يوضع فيه؟',options:['لأن جسيماته تنزلق وتتحرك حول بعضها','لأن جسيماته ثابتة في أماكنها تماماً','لأنه لا يمتلك كتلة','لأن جسيماته متباعدة جداً مثل الغاز'],answer:'لأن جسيماته تنزلق وتتحرك حول بعضها'}
 ],
 keyPoints:['المادة لها كتلة وتشغل حيزاً من الفراغ.','تختلف حالات المادة في ترتيب الجسيمات وحركتها.','تغير درجة الحرارة قد يغير حالة المادة وحركة جسيماتها.'],
 exampleAr:'مكعب الثلج صلب، وبعد أن يذوب يصبح ماءً سائلاً، وعند التسخين الشديد يظهر بخار الماء.',
 exampleEn:'Ice is solid, melting turns it into liquid water, and heating can produce water vapour.',
 analogyAr:'تخيّل التلاميذ في طابور ثابت كجسيمات الصلب، وفي ساحة يتحركون حول بعضهم كالسائل، وفي ملعب واسع ينتشرون كغاز.',
 analogyEn:'Pupils standing in fixed places resemble a solid, moving around one another resemble a liquid, and spreading out resembles a gas.',
 correction:'قارِنِي المسافات والحركة: الصلب متقارب يهتز، والسائل متقارب ينزلق، والغاز متباعد ينتشر.'
}),
makeScienceGapLesson({
 id:'off_sci_u2_c3_compare_matter_changes',conceptNumber:3,lessonNumber:3,page:94,
 titleAr:'مقارنة التغيرات في المادة',titleEn:'Comparing Changes in Matter',
 objectives:[
 'يشرح العلاقة بين تغير درجة الحرارة وحالات المادة وكتلتها.',
 'يميز بين التغيرات الفيزيائية والتغيرات الكيميائية للمادة.',
 'يقارن بين المخاليط والمركبات ويبحث فيما يحدث عند خلط مادتين أو أكثر.'
 ],
 readingText:"تتعرض المادة لتغيرات في حياتنا اليومية عند تسخينها أو تبريدها أو خلطها بمواد أخرى. تعتمد حالة المادة جزئياً على درجة حرارتها؛ فعندما تفقد جسيمات الماء طاقة حرارية تقل حركتها وقد يتجمد الماء، وعندما تكتسب جسيمات الثلج طاقة تتحرك أكثر وينصهر إلى ماء سائل.\n\nالتغير الفيزيائي يغير شكل المادة أو حجمها أو حالتها دون تكوين مادة جديدة، مثل تقطيع الخضراوات أو انصهار الثلج. أما التغير الكيميائي فينتج عنه مادة جديدة لها خصائص مختلفة، مثل تغير العجين عند خبزه. لذلك نلاحظ أن بعض التغيرات يمكن عكسها بسهولة وبعضها لا يعود إلى المادة الأصلية بسهولة.\n\nالمخلوط يتكون من مادتين أو أكثر تحتفظ كل مادة فيه بخصائصها، مثل الرمل مع الحصى أو الماء المالح. أما المركب فيتكون عندما تتحد عناصر كيميائياً لتكوين مادة جديدة. وعند دراسة التغيرات نلاحظ المادة قبل التغير وبعده، ونقارن الخصائص والكتلة في نظام مغلق لفهم ما حدث.",
 vocabulary:[
 {word:'التغير الفيزيائي',definition:'تغير في الشكل أو الحجم أو الحالة دون تكوين مادة جديدة.'},
 {word:'التغير الكيميائي',definition:'تغير ينتج عنه مادة جديدة بخصائص مختلفة.'},
 {word:'المخلوط',definition:'مادتان أو أكثر تختلطان مع احتفاظ كل مادة بخصائصها.'},
 {word:'المركب',definition:'مادة جديدة تنتج من اتحاد عناصر كيميائياً.'}
 ],
 questions:[
 {question:'أي مما يلي مثال على تغير فيزيائي؟',options:['انصهار مكعب الثلج','احتراق الورق','خبز العجين','صدأ الحديد'],answer:'انصهار مكعب الثلج'},
 {question:'ما الفرق الأساسي بين المخلوط والمركب؟',options:['في المخلوط تحتفظ المواد بخصائصها، أما المركب فينتج من اتحاد كيميائي','المخلوط دائماً مادة واحدة','المركب لا يحتوي على عناصر','لا يوجد أي اختلاف بينهما'],answer:'في المخلوط تحتفظ المواد بخصائصها، أما المركب فينتج من اتحاد كيميائي'}
 ],
 keyPoints:['تغير درجة الحرارة قد يؤدي إلى تغير حالة المادة وحركة جسيماتها.','التغير الفيزيائي لا ينتج مادة جديدة، بينما الكيميائي ينتج مادة جديدة.','المخلوط يحتفظ بمكونات وخصائص مواده، أما المركب فيتكون باتحاد كيميائي.'],
 exampleAr:'ذوبان الثلج في كوب تغير فيزيائي، أما خبز العجين في الفرن فينتج مواد جديدة ويمثل تغيراً كيميائياً.',
 exampleEn:'Melting ice is a physical change, while baking dough creates new substances and is a chemical change.',
 analogyAr:'المخلوط مثل طبق مكسرات يمكن تمييز مكوناته، أما المركب مثل وصفة جديدة تتحد مكوناتها لتنتج شيئاً بخصائص مختلفة.',
 analogyEn:'A mixture is like a bowl of nuts whose parts remain distinct; a compound is like a new recipe with chemically joined ingredients.',
 correction:'اسألي: هل تكونت مادة جديدة؟ إذا لم تتكون فغالباً تغير فيزيائي؛ وإذا تكونت مادة جديدة فهو تغير كيميائي، والمخلوط يحتفظ بمكوناته.'
})
];
SCIENCE_CURRICULUM_LESSONS.push(...SCIENCE_UNIT_2_GAP_LESSONS);
