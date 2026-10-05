/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { OfficialCurriculumLesson } from '../../types/teachingSession';

/**
 * Official Egyptian Ministry of Education Curriculum for Grade 5 (Term 1)
 * Subject: الدراسات الاجتماعية (Social Studies) — الصف الخامس الابتدائي
 */
export const SOCIAL_STUDIES_CURRICULUM_LESSONS: OfficialCurriculumLesson[] = [
  {
    id: 'off_soc_u1_l1_location',
    subjectId: 'subj_social_studies',
    subjectNameAr: 'الدراسات الاجتماعية',
    subjectNameEn: 'Social Studies',
    unitNumber: 1,
    unitNameAr: 'الوحدة الأولى: الملامح الطبيعية لبلدي مصر',
    unitNameEn: 'Unit 1: Natural Features of Egypt',
    lessonNumber: 1,
    titleAr: 'موقع بلدي مصر الجغرافي والفلكي',
    titleEn: 'Geographic and Astronomical Location of Egypt',
    originTag: 'official',
    isAvailable: true,
    sourceRef: {
      book: 'كتاب الدراسات الاجتماعية — معالم بلدنا — الصف الخامس الابتدائي',
      bookAr: 'الدراسات الاجتماعية — كتاب الوزارة ص. 10-16',
      bookEn: 'Social Studies Ministry Book pp. 10-16',
      grade: 'الصف الخامس',
      term: 'الفصل الدراسي الأول',
      unit: 'الوحدة الأولى',
      lesson: 'الدرس الأول: موقع بلدي',
      page: 10,
      isAvailable: true,
    },
    objectives: [
      'يميز بين الموقع الجغرافي (بالنسبة لليابسة والماء) والموقع الفلكي (بالنسبة لخطوط الطول ودوائر العرض).',
      'يوضح الأهمية الاستراتيجية لموقع مصر في قلب قارات العالم القديم وربطها بالبحرين المتوسط والأحمر عبر قناة السويس.',
      'يتعرف خط جرينتش (خط الطول الرئيسي) ودائرة الاستواء ومدار السرطان الذي يمر بجنوب مصر.',
    ],
    readingText: `تقع مصر في الركن الشمالي الشرقي من قارة أفريقيا، وهي قلب قارات العالم القديم الثلاث (أفريقيا، وآسيا، وأوروبا).
الموقع الجغرافي:
- يحد مصر من الشمال: البحر المتوسط، ومن الشرق: البحر الأحمر.
- يحدها من الغرب: دولة ليبيا، ومن الجنوب: دولة السودان.
وزادت أهمية موقع مصر الجغرافية والاستراتيجية بعد حفر وافتتاح قناة السويس وتوسعتها بقناة السويس الجديدة، مما جعلها شرياناً رئيسياً للتجارة العالمية.
الموقع الفلكي:
تقع مصر بين خطي طول 24° و37° شرق خط جرينتش، ودائرتي عرض 22° و31°36' شمال دائرة الاستواء. ويمر مدار السرطان في جنوب مصر، ولذلك يقع معظم أراضي مصر ضمن الإقليم الصحراوي الحار، بينما الأطراف الشمالية تقع ضمن إقليم البحر المتوسط المعتدل.`,
    vocabulary: [
      { word: 'الموقع الجغرافي', definition: 'موقع المكان أو الدولة بالنسبة لليابسة والمسطحات المائية المجاورة.' },
      { word: 'الموقع الفلكي', definition: 'موقع المكان بالنسبة لخطوط الطول الوهمية ودوائر العرض الجغرافية.' },
      { word: 'مدار السرطان', definition: 'دائرة عرض رئيسية (23.5° شمالاً) تمر في أقصى جنوب مصر.' },
    ],
    exercises: [
      {
        type: 'multiple_choice',
        question: 'تقع مصر جغرافياً في الركن الشمالي الشرقي من قارة:',
        options: ['أفريقيا', 'آسيا', 'أوروبا', 'أمريكا الشمالية'],
        expectedAnswer: 'أفريقيا',
        page: 12,
      },
      {
        type: 'multiple_choice',
        question: 'أي من دوائر العرض الرئيسية التالية يمر في جنوب الأراضي المصرية؟',
        options: ['مدار السرطان', 'مدار الجدي', 'دائرة الاستواء', 'الدائرة القطبية'],
        expectedAnswer: 'مدار السرطان',
        page: 14,
      },
    ],
    concepts: [
      {
        id: 'off_soc_u1_l1_c1',
        conceptNumber: 1,
        titleAr: 'أهمية موقع مصر وممر قناة السويس',
        titleEn: 'Egypt Strategic Position & Suez Canal',
        sourceText: 'مصر همزة الوصل بين قارات العالم، وقناة السويس شريان الملاحة البحرية الدولية.',
        keyPoints: [
          'ملتقى القارات الثلاث (أفريقيا وآسيا وأوروبا).',
          'إشرافها على بحرين من أهم بحار العالم للتجارة.',
          'الطقس المعتدل في الشمال والصحراوي الحار في الداخل.',
        ],
        dailyLifeExampleAr: 'مشاهدة السفن التجارية العملاقة التي تعبر قناة السويس كل يوم محملة ببضائع من الصين إلى أوروبا.',
        dailyLifeExampleEn: 'Seeing mega cargo ships traveling through the Suez Canal daily connecting Asia to Europe.',
        storyAnalogyAr: 'مصر مثل البيت الموجود على ناصية أهم وأكبر ميدان في المدينة؛ الكل يمر من أمامه!',
        storyAnalogyEn: 'Egypt is like the grand corner house at the crossroads of three bustling continents.',
        prerequisiteAr: 'قراءة خريطة مصر وتحديد الاتجاهات الأصلية (شمال، جنوب، شرق، غرب).',
        prerequisiteEn: 'Reading map cardinal directions.',
        visualType: 'map_like',
      },
    ],
  },
  {
    id: 'off_soc_u1_l2_surface',
    subjectId: 'subj_social_studies',
    subjectNameAr: 'الدراسات الاجتماعية',
    subjectNameEn: 'Social Studies',
    unitNumber: 1,
    unitNameAr: 'الوحدة الأولى: الملامح الطبيعية لبلدي مصر',
    unitNameEn: 'Unit 1: Natural Features of Egypt',
    lessonNumber: 2,
    titleAr: 'مظاهر سطح بلدي ووحداته التضاريسية',
    titleEn: 'Landforms & Relief Regions of Egypt',
    originTag: 'official',
    isAvailable: true,
    sourceRef: {
      book: 'كتاب الدراسات الاجتماعية — معالم بلدنا — الصف الخامس الابتدائي',
      bookAr: 'الدراسات الاجتماعية — كتاب الوزارة ص. 18-26',
      bookEn: 'Social Studies Ministry Book pp. 18-26',
      grade: 'الصف الخامس',
      term: 'الفصل الدراسي الأول',
      unit: 'الوحدة الأولى',
      lesson: 'الدرس الثالث: مظاهر سطح بلدي',
      page: 18,
      isAvailable: true,
    },
    objectives: [
      'يقسم تضاريس مصر إلى 4 وحدات رئيسية: وادي النيل والدلتا ومنخفض الفيوم، الصحراء الغربية، الصحراء الشرقية، وشبه جزيرة سيناء.',
      'يشرح تكون دلتا النيل ورواسب الطمي الخصبة عبر آلاف السنين.',
      'يتعرف أعلى قمة جبلية في مصر (جبل كاترين) وسلاسل جبال البحر الأحمر.',
    ],
    readingText: `ينقسم سطح مصر إلى 4 وحدات تضاريسية رئيسية تتنوع في أشكالها:
1. وادي النيل والدلتا ومنخفض الفيوم: أصغر الوحدات التضاريسية مساحة (نحو 4% من مساحة مصر)، لكنها أكثرها سكاناً وخصوبة بفضل الطمي النهري الذي جلبه نهر النيل.
2. الصحراء الغربية: أكبر الوحدات التضاريسية مساحة (تبلغ نحو ثلثي مساحة مصر 68%)، وتتميز بوجود المنخفضات الصالحة للحياة كالواحات (سيوة، البحرية، الفرافرة، الداخلة، والخارجة) لوجود المياه الجوفية العذبة والآبار.
3. الصحراء الشرقية: صحراء جبلية هضبية وعرة، بها سلاسل جبال البحر الأحمر الشاهقة وأعلاها قمة جبل شايب البنات، وتشتهر بغناها بالمعادن كالذهب والجرانيت.
4. شبه جزيرة سيناء: أرض الفيروز؛ يغلب على جزئها الجنوبي الطابع الجبلي الوعر وتضم أعلى قمة في مصر كلها وهي قمة جبل سانت كاترين (أكثر من 2600 متر فوق سطح البحر).`,
    vocabulary: [
      { word: 'الوادي والدلتا', definition: 'السهول الفيضية الخصبة التي نشأت حول مجرى نهر النيل ومصبه في البحر المتوسط.' },
      { word: 'الواحات والآبار', definition: 'أراضٍ منخفضة في الصحراء الغربية تتوفر فيها مياه جوفية عذبة تسمح بالزراعة وسكنى الناس.' },
      { word: 'جبل سانت كاترين', definition: 'أعلى قمة جبلية في جمهورية مصر العربية، يقع في جنوب شبه جزيرة سيناء.' },
    ],
    exercises: [
      {
        type: 'multiple_choice',
        question: 'تعد أعلى قمة جبلية في جمهورية مصر العربية هي قمة جبل:',
        options: ['سانت كاترين', 'جبل علبة', 'جبل موسى', 'المقطم'],
        expectedAnswer: 'سانت كاترين',
        page: 24,
      },
      {
        type: 'multiple_choice',
        question: 'أصغر الوحدات التضاريسية في مصر ولكنها تضم أخصب الأراضي الزراعية هي:',
        options: ['وادي النيل والدلتا ومنخفض الفيوم', 'الصحراء الغربية', 'شبه جزيرة سيناء', 'الصحراء الشرقية'],
        expectedAnswer: 'وادي النيل والدلتا ومنخفض الفيوم',
        page: 20,
      },
    ],
    concepts: [
      {
        id: 'off_soc_u1_l2_c1',
        conceptNumber: 1,
        titleAr: 'تنوع تضاريس مصر من النيل إلى الجبال الشاهقة',
        titleEn: 'Diversity of Egyptian Landforms',
        sourceText: 'مصر غنية بالسهول الزراعية والصحاري الذهبية وسلاسل الجبال الشامخة.',
        keyPoints: [
          'النيل صانع الزراعة والحضارة المصرية في الوادي والدلتا.',
          'الواحات في الصحراء الغربية جنان خضراء بفضل المياه الجوفية.',
          'سيناء والبحر الأحمر لوحات طبيعية من الجبال والصخور الملونة.',
        ],
        dailyLifeExampleAr: 'السفر في رحلة بالقطار من القاهرة للإسكندرية ورؤية حقول الدلتا الخضراء على جانبي الطريق.',
        dailyLifeExampleEn: 'Traveling by train from Cairo to Alexandria and seeing the lush green fields of the Nile Delta.',
        storyAnalogyAr: 'تضاريس مصر مثل منزل متعدد الطوابق؛ فيه حديقة خضراء (الدلتا) وفناء ذهبي واسع (الصحراء) وشرفة عالية في السحاب (جبل كاترين).',
        storyAnalogyEn: 'Egypt’s topography is like a grand house: a green garden (Delta), a sunlit patio (deserts), and a rooftop view (Sinai peaks).',
        prerequisiteAr: 'معرفة خريطة نهر النيل والبحرين.',
        prerequisiteEn: 'Basic map knowledge of Egypt.',
        visualType: 'map_like',
      },
    ],
  },
  {
    id: 'off_soc_u2_l1_water_resources',
    subjectId: 'subj_social_studies',
    subjectNameAr: 'الدراسات الاجتماعية',
    subjectNameEn: 'Social Studies',
    unitNumber: 2,
    unitNameAr: 'الوحدة الثانية: الموارد والتنمية في بلدي مصر',
    unitNameEn: 'Unit 2: Resources & Development in Egypt',
    lessonNumber: 1,
    titleAr: 'الموارد المائية وترشيدها في مصر',
    titleEn: 'Water Resources & Modern Conservation in Egypt',
    originTag: 'official',
    isAvailable: true,
    sourceRef: {
      book: 'كتاب الدراسات الاجتماعية — معالم بلدنا — الصف الخامس الابتدائي',
      bookAr: 'الدراسات الاجتماعية — كتاب الوزارة ص. 48-56',
      bookEn: 'Social Studies Ministry Book pp. 48-56',
      grade: 'الصف الخامس',
      term: 'الفصل الدراسي الأول',
      unit: 'الوحدة الثانية',
      lesson: 'الدرس الأول: الموارد المائية',
      page: 48,
      isAvailable: true,
    },
    objectives: [
      'يصنف موارد المياه في مصر إلى مياه عذبة (نهر النيل، الأمطار الشتوية، المياه الجوفية العذبة) ومياه مالحة (البحار والبحيرات).',
      'يشرح الأهمية الاقتصادية للمياه المالحة في صيد الأسماك واستخراج ملح الطعام والبترول والغاز الطبيعي وتحلية المياه.',
      'يوضح جهود الدولة المصرية في تبطين الترع وتحلية مياه البحر واستخدام الري الحديث بالتنقيط والرش.',
    ],
    readingText: `المياه هي أصل الحياة، وتتنوع مواردها في مصر إلى نوعين:
1. موارد المياه العذبة:
- نهر النيل وفرعاه (دمياط ورشيد) وبحيرة ناصر: المصدر الرئيسي لمياه الشرب والزراعة بنسبة تتجاوز 90%.
- المياه الجوفية العذبة: كخزان الحجر الرملي النوبي في الصحراء الغربية الذي قامت عليه مشاريع زراعية قومية كشرق العوينات.
- الأمطار الشتوية: تسقط على الساحل الشمالي وتعتمد عليها الزراعة في مطروح وسيناء.
2. موارد المياه المالحة:
- البحر المتوسط والبحر الأحمر وخليج السويس والعقبة والبحيرات الشمالية (المنزلة، البرلس، إدكو، مريوط).
- أهميتها: صيد ملايين الأطنان من الأسماك، استخراج ملح الطعام، حقول البترول والغاز، والنقل البحري.
جهود الدولة للترشيد:
تبطين الترع لتقليل تسرب المياه، إنشاء أكبر محطات تحلية مياه البحر ومحطات معالجة الصرف الزراعي كمحطة بحر البقر، وتطبيق الري بالتنقيط بدلاً من الري بالغمر.`,
    vocabulary: [
      { word: 'تبطين الترع', definition: 'مشروع قومي لتغطية جوانب الترع بالإسمنت لمنع تسرب المياه وإهدارها في التربة.' },
      { word: 'تحلية المياه', definition: 'فصل الأملاح عن مياه البحر لإنتاج مياه صالحة للشرب والاستخدام المنزلي.' },
      { word: 'الري بالتنقيط', definition: 'نظام ري حديث يوصل الماء مباشرة لجذور النبات بقطرات محسوبة دون إهدار.' },
    ],
    exercises: [
      {
        type: 'multiple_choice',
        question: 'المصدر الرئيسي والأول للمياه العذبة والزراعة في مصر هو:',
        options: ['نهر النيل وبحيرة ناصر', 'الأمطار الصيفية', 'مياه البحر المتوسط', 'مياه خليج العقبة'],
        expectedAnswer: 'نهر النيل وبحيرة ناصر',
        page: 52,
      },
      {
        type: 'multiple_choice',
        question: 'يهدف المشروع القومي لتبطين الترع في مصر إلى:',
        options: ['تقليل الفاقد من المياه ومنع تسربها وحماية البيئة', 'صيد الأسماك المفترسة', 'توسيع الطرق السريعة', 'تغيير مجرى النهر'],
        expectedAnswer: 'تقليل الفاقد من المياه ومنع تسربها وحماية البيئة',
        page: 54,
      },
    ],
    concepts: [
      {
        id: 'off_soc_u2_l1_c1',
        conceptNumber: 1,
        titleAr: 'الأمن المائي ومسؤولية الحفاظ على النيل',
        titleEn: 'Water Security & Conservation Leadership in Egypt',
        sourceText: 'مصر تنفذ مشاريع رائدة عالمياً لإعادة تدوير المياه وتحليتها وتبطين الترع.',
        keyPoints: [
          'النيل هو عصب الحياة ولا غنى عن كل قطرة ماء.',
          'التحول للري بالتنقيط يوفر مليارات الأمتار المكعبة.',
          'محطة بحر البقر من أضخم محطات معالجة المياه في العالم.',
        ],
        dailyLifeExampleAr: 'إصلاح صنبور المطبخ فوراً واستخدام كوب ماء عند غسل الأسنان لتوفير 10 لترات من الماء يومياً.',
        dailyLifeExampleEn: 'Using a cup of water while brushing teeth to save 10 liters of precious freshwater every day.',
        storyAnalogyAr: 'المياه مثل دم الإنسان؛ الترع هي الأوردة التي يجب الحفاظ عليها نظيفة وسليمة دون أي نزيف.',
        storyAnalogyEn: 'Canals are like clean veins carrying lifeblood to Egypt’s fertile soils: keeping them lined prevents any loss.',
        prerequisiteAr: 'الفرق بين الماء العذب والماء المالح.',
        prerequisiteEn: 'Freshwater vs saltwater distinction.',
        visualType: 'diagram',
      },
    ],
  },
];
