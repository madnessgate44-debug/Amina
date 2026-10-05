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
      },
    ],
  },
  {
    id: 'off_sci_u1_l3_coral_bleaching',
    subjectId: 'subj_science',
    subjectNameAr: 'العلوم',
    subjectNameEn: 'Science',
    unitNumber: 1,
    unitNameAr: 'الوحدة الأولى: العلاقات الغذائية في الأنظمة الحية',
    unitNameEn: 'Unit 1: Energy & Relationships in Living Systems',
    lessonNumber: 3,
    titleAr: 'تأثير التغيرات البيئية وابيضاض الشعاب المرجانية',
    titleEn: 'Environmental Changes & Coral Bleaching',
    originTag: 'official',
    isAvailable: true,
    sourceRef: {
      book: 'كتاب العلوم — الصف الخامس الابتدائي — الفصل الدراسي الأول',
      bookAr: 'العلوم — كتاب الوزارة ص. 34-45',
      bookEn: 'Science Ministry Book pp. 34-45',
      grade: 'الصف الخامس',
      term: 'الفصل الدراسي الأول',
      unit: 'الوحدة الأولى',
      lesson: 'المفهوم الثالث: التغيرات في الشبكات الغذائية',
      page: 34,
      isAvailable: true,
    },
    objectives: [
      'يشرح ظاهرة ابيضاض الشعاب المرجانية (Coral Bleaching) وأسبابها كارتفاع درجة حرارة مياه البحر الأحمر.',
      'يوضح أثر تلوث البلاستيك وتغير المناخ على شبكات الغذاء البحرية.',
      'يستنتج الحلول البيئية لمبادرات حماية المحميات الطبيعية كشرم الشيخ ورأس محمد.',
    ],
    readingText: `تعد الشعاب المرجانية في البحر الأحمر من أثمن النظم البيئية البحرية في العالم؛ فهي توفر المأوى والغذاء لآلاف الأنواع من الأسماك.
ظاهرة ابيضاض الشعاب المرجانية:
عندما ترتفع درجة حرارة مياه البحر بشكل غير طبيعي، تقوم المرجانات بطرد الطحالب الدقيقة الملونة التي تعيش داخل أنسجتها وتمدها بالغذاء، فتتحول الشعاب إلى اللون الأبيض تماماً وتصبح مهددة بالموت جوعاً.
أخطار أخرى:
- إلقاء المواد البلاستيكية في البحار: الأسماك والسلاحف البحرية لا تفرق بين قنديل البحر والأكياس البلاستيكية فتأكلها وتختنق.
مبادرات مصر: تنظم مصر حملات لحماية الشعاب ومبادرات "صفر بلاستيك" وإقامة المحميات في رأس محمد ووادي الجمال للحفاظ على التوازن البيئي.`,
    vocabulary: [
      { word: 'ابيضاض المرجان', definition: 'فقدان الشعاب المرجانية لطحالبها التكافلية بسبب سخونة المياه مما يحولها للأبيض ويعرضها للموت.' },
      { word: 'الموطن الطبيعي', definition: 'المكان الذي يوفر للكائن الحي الغذاء والماء والمأوى للبقاء والتكاثر.' },
      { word: 'الجسيمات البلاستيكية', definition: 'قطع بلاستيكية دقيقة تتفتت في الماء وتبتلعها الكائنات البحرية بالخطأ.' },
    ],
    exercises: [
      {
        type: 'multiple_choice',
        question: 'يحدث ابيضاض الشعاب المرجانية في البحر الأحمر بشكل رئيسي بسبب:',
        options: ['ارتفاع درجة حرارة مياه البحر', 'برودة الجو في الشتاء', 'كثرة الأسماك المفترسة', 'تساقط الأمطار'],
        expectedAnswer: 'ارتفاع درجة حرارة مياه البحر',
        page: 38,
      },
      {
        type: 'multiple_choice',
        question: 'ابتلاع السلاحف البحرية للأكياس البلاستيكية يحدث لأنها تشبه في مظهرها:',
        options: ['قناديل البحر التي تتغذى عليها', 'الطحالب الخضراء', 'الرمال الناعمة', 'الشعاب الصخرية'],
        expectedAnswer: 'قناديل البحر التي تتغذى عليها',
        page: 40,
      },
    ],
    concepts: [
      {
        id: 'off_sci_u1_l3_c1',
        conceptNumber: 1,
        titleAr: 'حماية البيئة البحرية والتنوع الحيوي في مصر',
        titleEn: 'Marine Biodiversity & Protection in Egypt',
        sourceText: 'ارتفاع حرارة المياه والتلوث البلاستيكي يهددان المرجان ومصائد الأسماك والسياحة.',
        keyPoints: [
          'الشعاب المرجانية مأوى ثلث الكائنات البحرية.',
          'الحد من البلاستيك واستخدام البدائل المستدامة.',
          'المحميات الطبيعية المصرية نموذج عالمي لحفظ التوازن البيئي.',
        ],
        dailyLifeExampleAr: 'استخدام زجاجة مياه قابلة لإعادة التعبئة وأكياس قماشية عند زيارة شواطئ البحر الأحمر بدلاً من البلاستيك أحادي الاستخدام.',
        dailyLifeExampleEn: 'Using reusable fabric bags and stainless bottles on Red Sea beaches to prevent ocean plastic.',
        storyAnalogyAr: 'المرجان مثل العمارة السكنية الضخمة للأسماك؛ إذا انهدمت تشردت كل العائلات التي تعيش بداخلها!',
        storyAnalogyEn: 'Coral reefs are like apartment towers for marine life: if destroyed, millions become homeless.',
        prerequisiteAr: 'معرفة مفهوم الكائنات المنتجة والمستهلكة.',
        prerequisiteEn: 'Basic ecosystem concepts.',
        visualType: 'diagram',
      },
    ],
  },
];
