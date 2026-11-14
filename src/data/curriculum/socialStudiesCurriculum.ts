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
        misconceptions: [
          {
            id: 'mis_ar_soc_loc_asia',
            trigger: 'آسيا',
            explanation: 'ظننتِ أن مصر تقع في قارة آسيا.',
            remediation: 'مصر تقع جغرافياً في الركن الشمالي الشرقي من قارة أفريقيا، وإن كان لها امتداد صغير في آسيا (سيناء) فإن موقعها القاري أفريقي.',
          },
          {
            id: 'mis_ar_soc_loc_europe',
            trigger: 'أوروبا',
            explanation: 'ظننتِ أن مصر تقع في قارة أوروبا.',
            remediation: 'مصر أفريقية الموقع؛ أوروبا قارة أخرى تقع شمال البحر المتوسط.',
          },
          {
            id: 'mis_ar_soc_loc_namerica',
            trigger: 'أمريكا الشمالية',
            explanation: 'ظننتِ أن مصر تقع في أمريكا الشمالية.',
            remediation: 'مصر قارة أفريقيا؛ أمريكا الشمالية تقع في النصف الغربي من الكرة الأرضية.',
          },
          {
            id: 'mis_ar_soc_loc_capricorn',
            trigger: 'الجدي',
            explanation: 'ظننتِ أن مدار الجدي يمر في جنوب مصر.',
            remediation: 'الدائرة التي تمر في جنوب مصر هي مدار السرطان.',
          },
          {
            id: 'mis_ar_soc_loc_equator',
            trigger: 'دائرة الاستواء',
            explanation: 'ظننتِ أن دائرة الاستواء تمر في جنوب مصر.',
            remediation: 'دائرة الاستواء تمر جنوب مصر بكثير؛ مدار السرطان هو الذي يمر بها.',
          },
          {
            id: 'mis_ar_soc_loc_polar',
            trigger: 'الدائرة القطبية',
            explanation: 'ظننتِ أن الدائرة القطبية تمر في جنوب مصر.',
            remediation: 'الدائرة القطبية في أقصى شمال الكرة الأرضية؛ الذي يمر بمصر هو مدار السرطان.',
          },
        ],
        distractors: [
          'آسيا|mis_ar_soc_loc_asia',
          'أوروبا|mis_ar_soc_loc_europe',
          'أمريكا الشمالية|mis_ar_soc_loc_namerica',
          'مدار الجدي|mis_ar_soc_loc_capricorn',
          'دائرة الاستواء|mis_ar_soc_loc_equator',
          'الدائرة القطبية|mis_ar_soc_loc_polar',
        ],
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
        misconceptions: [
          {
            id: 'mis_ar_soc_surf_elba',
            trigger: 'جبل علبة',
            explanation: 'ظننتِ أن أعلى قمة في مصر هي جبل علبة.',
            remediation: 'أعلى قمة جبلية في مصر هي قمة سانت كاترين في سيناء، لا جبل علبة.',
          },
          {
            id: 'mis_ar_soc_surf_mousa',
            trigger: 'جبل موسى',
            explanation: 'ظننتِ أن أعلى قمة في مصر هي جبل موسى.',
            remediation: 'جبل موسى قريب من سانت كاترين لكنه أقل ارتفاعاً؛ الأعلى هي سانت كاترين.',
          },
          {
            id: 'mis_ar_soc_surf_mokattam',
            trigger: 'المقطم',
            explanation: 'ظننتِ أن أعلى قمة في مصر هي جبل المقطم.',
            remediation: 'المقطم هضبة قرب القاهرة وليست الأعلى؛ الأعلى هي سانت كاترين في سيناء.',
          },
          {
            id: 'mis_ar_soc_surf_west',
            trigger: 'الصحراء الغربية',
            explanation: 'ظننتِ أن الصحراء الغربية هي أصغر وحدة تضم أخصب الأراضي.',
            remediation: 'الصحراء الغربية أكبر الوحدات وأقلها خصوبة زراعية؛ الأخصب هي وادي النيل والدلتا ومنخفض الفيوم.',
          },
          {
            id: 'mis_ar_soc_surf_sinai',
            trigger: 'شبه جزيرة سيناء',
            explanation: 'ظننتِ أن سيناء هي أصغر وحدة تضم أخصب الأراضي الزراعية.',
            remediation: 'سيناء تضاريسها جبلية وصحراوية وليست الأخصب؛ الأخصب هي وادي النيل والدلتا ومنخفض الفيوم.',
          },
          {
            id: 'mis_ar_soc_surf_east',
            trigger: 'الصحراء الشرقية',
            explanation: 'ظننتِ أن الصحراء الشرقية هي أصغر وحدة تضم أخصب الأراضي.',
            remediation: 'الصحراء الشرقية جبال وهضاب وغنية بالمعادن لكنها ليست الأخصب؛ الأخصب هي وادي النيل والدلتا والفيوم.',
          },
        ],
        distractors: [
          'جبل علبة|mis_ar_soc_surf_elba',
          'جبل موسى|mis_ar_soc_surf_mousa',
          'المقطم|mis_ar_soc_surf_mokattam',
          'الصحراء الغربية|mis_ar_soc_surf_west',
          'شبه جزيرة سيناء|mis_ar_soc_surf_sinai',
          'الصحراء الشرقية|mis_ar_soc_surf_east',
        ],
        visualType: 'map_like',
      },
    ],
  },
  {
    id: 'off_soc_u2_l1_water_resources',
    subjectId: 'subj_social_studies',
    subjectNameAr: 'الدراسات الاجتماعية',
    subjectNameEn: 'Social Studies',
    unitNumber: 3,
    unitNameAr: 'الوحدة الثالثة: كنوز مصر',
    unitNameEn: 'Unit 3: Egypt’s Treasures',
    lessonNumber: 2,
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
        misconceptions: [
          {
            id: 'mis_ar_soc_water_rain',
            trigger: 'الأمطار الصيفية',
            explanation: 'ظننتِ أن الأمطار الصيفية هي المصدر الأول للمياه في مصر.',
            remediation: 'الأمطار قليلة ومتغيرة في مصر؛ المصدر الرئيسي والأول هو نهر النيل وبحيرة ناصر.',
          },
          {
            id: 'mis_ar_soc_water_med',
            trigger: 'مياه البحر المتوسط',
            explanation: 'ظننتِ أن مياه البحر المتوسط مصدر للزراعة.',
            remediation: 'مياه البحر مالحة وغير صالحة للزراعة؛ المصدر هو نهر النيل وبحيرة ناصر.',
          },
          {
            id: 'mis_ar_soc_water_gulf',
            trigger: 'مياه خليج العقبة',
            explanation: 'ظننتِ أن مياه خليج العقبة مصدر للمياه العذبة والزراعة.',
            remediation: 'خليج العقبة مالح؛ المصدر الأول للعذوبة والزراعة هو نهر النيل وبحيرة ناصر.',
          },
          {
            id: 'mis_ar_soc_water_fish',
            trigger: 'صيد الأسماك المفترسة',
            explanation: 'ظننتِ أن هدف تبطين الترع هو صيد الأسماك المفترسة.',
            remediation: 'الهدف هو تقليل الفاقد من المياه ومنع تسربها وحماية البيئة.',
          },
          {
            id: 'mis_ar_soc_water_roads',
            trigger: 'توسيع الطرق السريعة',
            explanation: 'ظننتِ أن هدف تبطين الترع هو توسيع الطرق.',
            remediation: 'المشروع خاص بالمياه؛ هدفه تقليل الفاقد ومنع التسرب وحماية البيئة.',
          },
          {
            id: 'mis_ar_soc_water_course',
            trigger: 'تغيير مجرى النهر',
            explanation: 'ظننتِ أن المشروع القومي لتغيير مجرى النهر.',
            remediation: 'المشروع هو تبطين الترع لتقليل الفاقد من المياه ومنع تسربها وحماية البيئة، لا تغيير مجرى النيل.',
          },
        ],
        distractors: [
          'الأمطار الصيفية|mis_ar_soc_water_rain',
          'مياه البحر المتوسط|mis_ar_soc_water_med',
          'مياه خليج العقبة|mis_ar_soc_water_gulf',
          'صيد الأسماك المفترسة|mis_ar_soc_water_fish',
          'توسيع الطرق السريعة|mis_ar_soc_water_roads',
          'تغيير مجرى النهر|mis_ar_soc_water_course',
        ],
        visualType: 'diagram',
      },
    ],
  },
];

/**
 * 2026/2027 Unit 2 gap fill. Lesson titles and scope are cross-checked against
 * the current Grade 5 Social Studies index; explanations are Miss Noor-authored.
 */
type SocialGapSpec = {
  id:string; lessonNumber:number; titleAr:string; titleEn:string;
  objectives:string[]; readingText:string;
  vocabulary:{word:string;definition:string}[];
  questions:{question:string;options:string[];answer:string}[];
  keyPoints:string[]; exampleAr:string; exampleEn:string;
  analogyAr:string; analogyEn:string; correction:string;
};
function makeSocialGapLesson(spec:SocialGapSpec):OfficialCurriculumLesson {
  const wrong=spec.questions.flatMap((q,qi)=>q.options.filter(o=>o!==q.answer).map((option,wi)=>({
    id:spec.id+'_mis_'+(qi+1)+'_'+(wi+1),trigger:option,
    explanation:'اختيار «'+option+'» لا يطابق الدليل التاريخي أو الجغرافي الذي يسأل عنه السؤال.',
    remediation:'بص يا بطل، '+spec.correction,
  })));
  return {
    id:spec.id,subjectId:'subj_social_studies',
    subjectNameAr:'الدراسات الاجتماعية',subjectNameEn:'Social Studies',
    unitNumber:2,unitNameAr:'الوحدة الثانية: الحضارة المصرية القديمة',
    unitNameEn:'Unit 2: Ancient Egyptian Civilization',
    lessonNumber:spec.lessonNumber,titleAr:spec.titleAr,titleEn:spec.titleEn,
    originTag:'official',isAvailable:true,
    sourceRef:{
      book:'كتاب الدراسات الاجتماعية 1 — الصف الخامس الابتدائي — الفصل الدراسي الأول 2026/2027',
      bookAr:'الدراسات الاجتماعية — الوحدة الثانية: الحضارة المصرية القديمة',
      bookEn:'Social Studies 1 — Unit 2: Ancient Egyptian Civilization',
      grade:'الصف الخامس',term:'الفصل الدراسي الأول 2026/2027',
      unit:'الوحدة الثانية',lesson:spec.titleAr,
      page:'غير محدد في الفهرس الإلكتروني المتاح',isAvailable:true,
    },
    objectives:spec.objectives,readingText:spec.readingText,vocabulary:spec.vocabulary,
    exercises:spec.questions.map(q=>({type:'multiple_choice' as const,question:q.question,options:q.options,expectedAnswer:q.answer})),
    concepts:[{
      id:spec.id+'_c1',conceptNumber:1,titleAr:spec.titleAr,titleEn:spec.titleEn,
      sourceText:spec.readingText,keyPoints:spec.keyPoints,
      dailyLifeExampleAr:spec.exampleAr,dailyLifeExampleEn:spec.exampleEn,
      storyAnalogyAr:spec.analogyAr,storyAnalogyEn:spec.analogyEn,
      prerequisiteAr:'معرفة موقع مصر ونهر النيل وقراءة خط زمني بسيط.',
      prerequisiteEn:'Basic knowledge of Egypt, the Nile, and simple timelines.',
      visualType:'timeline',misconceptions:wrong,
      distractors:wrong.map(m=>m.trigger+'|'+m.id),
    }],
  };
}
const SOCIAL_UNIT_2_GAP_LESSONS:OfficialCurriculumLesson[]=[
makeSocialGapLesson({
id:'off_soc_u2_l1_ancient_civilization_factors',lessonNumber:1,
titleAr:'عوامل قيام الحضارة المصرية القديمة',titleEn:'Factors Behind the Rise of Ancient Egyptian Civilization',
objectives:[
'يحدد العوامل الطبيعية التي ساعدت على قيام الحضارة المصرية القديمة، وفي مقدمتها نهر النيل والموقع والمناخ.',
'يميز بين العوامل الطبيعية والعوامل البشرية مثل الجيش والحكومة المركزية والعمل المنظم.',
'يفسر كيف ساعد استقرار مياه النيل وقياس الفيضان على الزراعة وتنظيم حياة السكان.'
],
readingText:"قامت الحضارة المصرية القديمة في وادي النيل؛ فقد وفر النهر الماء اللازم للشرب والزراعة، وترك الفيضان تربة خصبة تساعد على نمو المحاصيل. كما ساعد الموقع والمناخ والموارد الطبيعية على استقرار السكان وتكوين مجتمعات متعاونة.\n\nلم تكن الطبيعة وحدها كافية لبناء حضارة عظيمة. فقد احتاج المصريون إلى العمل والتعاون، وإلى جيش يحمي البلاد، وحكومة مركزية تنظم شؤون الناس وتدير الموارد والمشروعات.\n\nوكان قياس مستوى مياه النيل مهماً لمعرفة قوة الفيضان وتوقع أثره في الزراعة. وعندما اجتمعت الموارد الطبيعية مع التنظيم والعمل البشري، استطاع المصريون بناء مجتمع مستقر وترك آثار عظيمة.",
vocabulary:[
{word:'الحضارة',definition:'إنجازات الإنسان في العلم والعمل والتنظيم والفنون عبر الزمن.'},
{word:'الحكومة المركزية',definition:'جهة تتولى إدارة شؤون الدولة وتنظيمها وتطبيق القوانين.'},
{word:'الفيضان',definition:'ارتفاع مياه النهر وخروجها إلى الأراضي المجاورة في موسم معين.'}
],
questions:[
{question:'أي عامل طبيعي وفر الماء والتربة الخصبة للزراعة في مصر القديمة؟',options:['نهر النيل','الجيش','الحكومة المركزية','الكتابة الهيروغليفية'],answer:'نهر النيل'},
{question:'أي مما يلي يعد عاملاً بشرياً ساعد على تنظيم الدولة؟',options:['الحكومة المركزية','التربة الطينية','مياه النيل','المناخ'],answer:'الحكومة المركزية'}
],
keyPoints:['نهر النيل وفر الماء والتربة الخصبة وساعد على الاستقرار.','الجيش والحكومة المركزية من العوامل البشرية.','التنظيم وقياس الفيضان ساهما في إدارة الزراعة والموارد.'],
exampleAr:'عندما يتعاون سكان القرية لتنظيم الري وتقسيم المياه بعدل، فهم يستخدمون التنظيم لخدمة المجتمع.',
exampleEn:'A village coordinating irrigation fairly is using organization to support its community.',
analogyAr:'الحضارة مثل بيت كبير؛ الطبيعة توفر الأرض والماء، والناس يبنونه بالتعاون والتنظيم.',
analogyEn:'Civilization is like a large home: nature provides the land and water, while people build it through cooperation.',
correction:'فرّق بين ما توفره الطبيعة مثل النيل والتربة، وما يصنعه الإنسان مثل الجيش والحكومة والتنظيم.'
}),
makeSocialGapLesson({
id:'off_soc_u2_l2_prehistory',lessonNumber:2,
titleAr:'حياة المصري القديم: عصور ما قبل التاريخ',titleEn:'Life of Ancient Egyptians: Prehistoric Periods',
objectives:[
'يرتب بصورة عامة العصر الحجري القديم والعصر الحجري الحديث وعصر المعادن ضمن عصور ما قبل التاريخ.',
'يصف بعض أنشطة الإنسان المصري القديم مثل الصيد وجمع الغذاء ثم الزراعة والاستقرار وصناعة الأدوات.',
'يفسر ارتباط انتقال الإنسان إلى وادي النيل بتغير الظروف البيئية وتوافر الماء والغذاء.'
],
readingText:"عصور ما قبل التاريخ هي الفترات التي سبقت معرفة الإنسان بالكتابة. في العصر الحجري القديم عاش الإنسان في جماعات صغيرة، واعتمد على الصيد وجمع النباتات والثمار، وصنع أدوات بسيطة من الحجر. وكان يبحث عن الماء والغذاء ويتنقل من مكان إلى آخر.\n\nومع تغير المناخ وقلة الأمطار في بعض المناطق، اتجه الإنسان إلى وادي النيل حيث الماء والحياة. وفي العصر الحجري الحديث تعلم الزراعة وتربية الحيوانات، فبدأ يستقر في مساكن وقرى، وصنع أدوات أكثر ملاءمة لأعماله.\n\nثم عرف الإنسان استخدام المعادن في صناعة أدوات وأشياء أكثر قوة. وتطورت التجمعات البشرية في مصر حتى ظهرت مجتمعات منظمة وممالك في الشمال والجنوب، ومهد ذلك لقيام الدولة المصرية القديمة.",
vocabulary:[
{word:'ما قبل التاريخ',definition:'الزمن الذي سبق معرفة الإنسان بالكتابة وتسجيل الأحداث.'},
{word:'الصيد',definition:'الحصول على الحيوانات البرية لتوفير الغذاء.'},
{word:'الاستقرار',definition:'الإقامة في مكان واحد بدلاً من التنقل المستمر.'},
{word:'عصر المعادن',definition:'مرحلة عرف فيها الإنسان استخدام المعادن لصناعة الأدوات.'}
],
questions:[
{question:'كيف كان الإنسان يحصل غالباً على غذائه في العصر الحجري القديم؟',options:['الصيد وجمع النباتات','الزراعة المنظمة فقط','المصانع الحديثة','التجارة البحرية الواسعة'],answer:'الصيد وجمع النباتات'},
{question:'ما الذي ساعد الإنسان على الاستقرار في وادي النيل؟',options:['توافر الماء والغذاء','اختفاء الأنهار','قلة النباتات','عدم وجود حيوانات'],answer:'توافر الماء والغذاء'}
],
keyPoints:['ما قبل التاريخ سبق معرفة الكتابة.','اعتمد الإنسان القديم على الصيد والجمع ثم تعلم الزراعة والاستقرار.','ساعد وادي النيل على قيام تجمعات بشرية أكثر استقراراً.'],
exampleAr:'عندما يزرع الإنسان حديقة صغيرة ويعتني بها بدلاً من البحث كل يوم عن طعامه، فهذا يشبه الانتقال إلى الاستقرار.',
exampleEn:'Growing and caring for a garden instead of constantly searching for food illustrates settled life.',
analogyAr:'تطور حياة الإنسان مثل تعلم مهارة جديدة: يبدأ بأدوات بسيطة ثم يطورها مع الخبرة.',
analogyEn:'Human development is like learning a skill: people begin with simple tools and improve them over time.',
correction:'رتّب الفترات وتذكر أن الصيد والجمع ارتبطا بالعصر الحجري القديم، والزراعة والاستقرار بالعصر الحجري الحديث.'
}),
makeSocialGapLesson({
id:'off_soc_u2_l3_historical_ages',lessonNumber:3,
titleAr:'حياة المصري القديم: العصور التاريخية',titleEn:'Life of Ancient Egyptians: Historical Periods',
objectives:[
'يشرح أهمية توحيد مملكتي الشمال والجنوب في بداية التاريخ المصري القديم.',
'يميز بصورة عامة بين العصر العتيق والدولة القديمة والدولة الوسطى والدولة الحديثة.',
'يربط بعض إنجازات الملوك بعصورهم مثل بناء الأهرامات والرخاء الاقتصادي والانتصارات العسكرية.'
],
readingText:"بدأت العصور التاريخية عندما عرف الإنسان الكتابة وأصبح قادراً على تسجيل الأحداث. ومن الأحداث المهمة في بداية تاريخ مصر توحيد مملكتي الشمال والجنوب على يد الملك نعرمر المعروف أيضاً بمينا، فبدأت مرحلة جديدة من وحدة البلاد وتنظيم الحكم.\n\nاشتهرت الدولة القديمة ببناء الأهرامات، لذلك عُرفت بعصر بناة الأهرام. أما الدولة الوسطى فارتبطت بالرخاء الاقتصادي والمشروعات التي دعمت الزراعة والري. وتوضح هذه العصور كيف تطورت الدولة وأعمال ملوكها عبر الزمن.\n\nوفي الدولة الحديثة اتسعت قوة مصر وحققت انتصارات عسكرية، وبرز ملوك مثل تحتمس الثالث ورمسيس الثاني. ويساعد الخط الزمني على ترتيب الأحداث من الأقدم إلى الأحدث وفهم أن لكل عصر خصائصه وإنجازاته.",
vocabulary:[
{word:'العصور التاريخية',definition:'الفترات التي بدأت بعد معرفة الإنسان بالكتابة وتسجيل الأحداث.'},
{word:'التوحيد',definition:'جمع مملكتي الشمال والجنوب في دولة واحدة.'},
{word:'الخط الزمني',definition:'وسيلة لترتيب الأحداث بحسب زمن وقوعها.'},
{word:'بناة الأهرام',definition:'اسم اشتهرت به الدولة القديمة بسبب بناء الأهرامات.'}
],
questions:[
{question:'من الملك الذي ارتبط بتوحيد مملكتي الشمال والجنوب؟',options:['نعرمر (مينا)','تحتمس الثالث','كليوباترا السابعة','بطلميوس الأول'],answer:'نعرمر (مينا)'},
{question:'لماذا سميت الدولة القديمة بعصر بناة الأهرام؟',options:['لإنشاء الأهرامات الضخمة','لاكتشاف الطباعة','لبناء مكتبة الإسكندرية','لإنشاء قناة السويس'],answer:'لإنشاء الأهرامات الضخمة'}
],
keyPoints:['توحيد الشمال والجنوب أسس دولة مصرية موحدة.','الدولة القديمة اشتهرت ببناء الأهرامات.','الدولة الوسطى ارتبطت بالرخاء، والحديثة بالانتصارات والتوسع.'],
exampleAr:'ترتيب أحداث حياة الأسرة على خط زمني يساعدنا على فهم أيها حدث أولاً وأيها جاء بعده.',
exampleEn:'Placing family events on a timeline helps show which happened first and which came later.',
analogyAr:'الخط الزمني مثل سلم درجات؛ كل درجة تمثل فترة، ونصعد عليه من الأقدم إلى الأحدث.',
analogyEn:'A timeline is like a staircase, with each step representing a period from earlier to later.',
correction:'استخدم الخط الزمني: مينا والتوحيد أولاً، ثم عصور الدولة القديمة والوسطى والحديثة بإنجازاتها المختلفة.'
}),
makeSocialGapLesson({
id:'off_soc_u2_l4_ptolemaic_roman',lessonNumber:4,
titleAr:'مصر في عصري البطالمة والرومان',titleEn:'Egypt under the Ptolemies and Romans',
objectives:[
'يتتبع بصورة مبسطة انتقال الحكم في مصر بعد دخول الإسكندر الأكبر ثم قيام دولة البطالمة.',
'يتعرف دور الإسكندر في تأسيس مدينة الإسكندرية ودور البطالمة في إنشاء مكتبتها القديمة.',
'يفسر انتهاء حكم البطالمة بعد معركة أكتيوم البحرية ووقوع مصر تحت الحكم الروماني.'
],
readingText:"دخل الإسكندر الأكبر مصر في القرن الرابع قبل الميلاد، وأسس مدينة الإسكندرية التي أصبحت مركزاً مهماً للتجارة والثقافة. وبعد وفاته تولى بطلميوس الأول حكم مصر، وبدأ عصر البطالمة الذين اهتموا بالإدارة والعلم، ومن أشهر إنجازاتهم مكتبة الإسكندرية القديمة.\n\nكانت كليوباترا السابعة آخر ملوك البطالمة. وفي عام 31 قبل الميلاد هُزمت قواتها في معركة أكتيوم البحرية أمام الرومان، وانتهى بذلك حكم البطالمة وأصبحت مصر ولاية رومانية. وخلال الحكم الروماني تعرض المصريون لضرائب وظلم، وضعفت أحوال كثير منهم.\n\nدخل الإسلام مصر عام 641 ميلادياً بقيادة عمرو بن العاص، ورحب كثير من المصريين بالفتح بعد معاناتهم من الحكم البيزنطي. ويساعد ترتيب هذه الأحداث على فهم تعاقب العصور وتأثيرها في تاريخ مصر.",
vocabulary:[
{word:'الإمبراطورية',definition:'دولة واسعة تسيطر على أقاليم وشعوب متعددة.'},
{word:'البطالمة',definition:'أسرة حكمت مصر بعد وفاة الإسكندر الأكبر.'},
{word:'أكتيوم',definition:'معركة بحرية عام 31 ق.م انتهى بعدها حكم البطالمة في مصر.'},
{word:'ولاية رومانية',definition:'إقليم خاضع لحكم الدولة الرومانية.'}
],
questions:[
{question:'من أسس مدينة الإسكندرية بعد دخوله مصر؟',options:['الإسكندر الأكبر','نعرمر','رمسيس الثاني','عمرو بن العاص'],answer:'الإسكندر الأكبر'},
{question:'ما المعركة التي انتهى بعدها حكم البطالمة في مصر؟',options:['أكتيوم البحرية','قادش','مجدو','حطين'],answer:'أكتيوم البحرية'}
],
keyPoints:['أسس الإسكندر مدينة الإسكندرية، ثم حكم البطالمة مصر بعد وفاته.','اشتهرت مكتبة الإسكندرية القديمة بالعلم والثقافة.','هزيمة كليوباترا في أكتيوم أنهت حكم البطالمة وبدأ الحكم الروماني.'],
exampleAr:'زيارة مكتبة عامة اليوم تذكرنا بأهمية المؤسسات الثقافية التي تجمع الكتب والمعرفة مثل مكتبة الإسكندرية القديمة.',
exampleEn:'A modern public library reminds us why cultural institutions such as the ancient Library of Alexandria mattered.',
analogyAr:'تعاقب العصور مثل فصول كتاب التاريخ؛ كل فصل له حكامه وأحداثه، لكنه يكمل ما قبله.',
analogyEn:'Historical periods are like chapters in a history book: each has its own rulers and events.',
correction:'اربط الإسكندر بتأسيس الإسكندرية، والبطالمة بمكتبتها، وأكتيوم بنهاية حكمهم وبداية الحكم الروماني.'
})
];
SOCIAL_STUDIES_CURRICULUM_LESSONS.push(...SOCIAL_UNIT_2_GAP_LESSONS);
