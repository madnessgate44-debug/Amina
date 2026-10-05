/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { OfficialCurriculumLesson } from '../../types/teachingSession';

/**
 * Official Egyptian Ministry of Education Curriculum for Grade 5 (Term 1)
 * Subject: تكنولوجيا المعلومات والاتصالات (ICT - Information and Communications Technology)
 * Ingested directly from official textbook 2026/2027 (الأستاذ د. تامر عبد المحسن، د. عبير حامد، د. طاهر العدلي).
 */
export const ICT_CURRICULUM_LESSONS: OfficialCurriculumLesson[] = [
  // =========================================================================
  // الوحدة الأولى: دور تكنولوجيا المعلومات في حياتنا
  // =========================================================================
  {
    id: 'off_ict_u1_l1',
    subjectId: 'subj_ict',
    subjectNameAr: 'تكنولوجيا المعلومات والاتصالات',
    subjectNameEn: 'ICT',
    unitNumber: 1,
    unitNameAr: 'الوحدة الأولى: دور تكنولوجيا المعلومات في حياتنا',
    unitNameEn: 'Unit 1: The Role of ICT in Our Lives',
    lessonNumber: 1,
    titleAr: 'الأجهزة الملحقة بالحاسب الآلي',
    titleEn: 'Computer Accessories & Measurement Units',
    originTag: 'official',
    isAvailable: true,
    sourceRef: {
      book: 'كتاب تكنولوجيا المعلومات والاتصالات — الصف الخامس الابتدائي — الفصل الدراسي الأول',
      bookAr: 'تكنولوجيا المعلومات والاتصالات ص. 7-9',
      bookEn: 'ICT Ministry Book pp. 7-9',
      grade: 'الصف الخامس',
      term: 'الفصل الدراسي الأول',
      unit: 'الوحدة الأولى',
      lesson: 'الدرس الأول',
      page: 7,
      isAvailable: true,
    },
    objectives: [
      'يوضح المفاهيم الأساسية للأدوات الملحقة بالحاسب الآلي (HDD, Ethernet, Router, Flash Memory, HDMI).',
      'يتعرف وحدات قياس البيانات (بت، بايت، كيلوبايت، ميجابايت، جيجابايت، تيرابايت) وسرعة المعالج (Hz) وسرعة الشبكة (Mbps).',
      'يصف مشكلات الحاسب الآلي الشائعة ويشرح كيفية حلها خطوة بخطوة.',
    ],
    readingText: `درسنا في الصف الرابع أجهزة الحاسب ومكوناتها المادية، وفي هذا الدرس نتناول الأجهزة الملحقة:
1. القرص الصلب الخارجي (External HDD): أسرع من القرص التقليدي لأنه يتصل مباشرة بمنافذ الحاسب الآلي، ويستخدم لحفظ وتخزين ونقل الملفات بأمان.
2. كابل ومنفذ الإيثرنت (Ethernet): يربطان الحاسب بالموجه (Router)، وهو أسرع وأكثر استقراراً من شبكة الواي فاي.
3. ذاكرة الفلاش (Flash Memory): مثل USB أو SSD، سريعة جداً لصغر حجمها وعدم احتوائها على أجزاء متحركة.
4. الموجه (Router): يستخدم لتوصيل عدة أجهزة بالإنترنت عبر الواي فاي أو الإيثرنت.
5. كابل HDMI: يستخدم لنقل الصوت والفيديو عالي الدقة بين الحاسب والشاشة.
وحدات القياس: البت (bit) أصغر وحدة، البايت = 8 بت (يمثل حرفاً واحداً)، الكيلوبايت = 1024 بايت، الميجابايت = 1024 كيلوبايت، الجيجابايت = 1024 ميجابايت، والتيرابايت = 1024 جيجابايت. وتقاس سرعة الإنترنت بوحدة (Mbps)، بينما تقاس سرعة المعالج بالهيرتز (Hz).`,
    vocabulary: [
      { word: 'Ethernet', definition: 'كابل سلكي يربط الكمبيوتر بالراوتر لتوفير اتصال إنترنت فائق السرعة والاستقرار.' },
      { word: 'Router', definition: 'جهاز التوجيه الذي يربط أجهزة المنزل بشبكة الإنترنت العالمية.' },
      { word: 'HDMI', definition: 'كابل رقمي ينقل الصوت والصورة بجودة عالية من الكمبيوتر إلى شاشات العرض.' },
      { word: 'Byte', definition: 'وحدة قياس سعة البيانات وتساوي 8 بت، وتكفي لتمثيل حرف واحد أو رمز واحد.' },
      { word: 'Hertz (Hz)', definition: 'وحدة قياس سرعة المعالج، وتدل على عدد الدورات التي ينفذها في الثانية الواحدة.' },
    ],
    exercises: [
      {
        type: 'multiple_choice',
        question: 'كابل يربط أجهزة الحاسب الآلي بجهاز الراوتر وهو أكثر استقراراً من الواي فاي:',
        options: ['كابل الإيثرنت (Ethernet)', 'كابل الشاحن', 'ذاكرة الفلاش', 'الماوس'],
        expectedAnswer: 'كابل الإيثرنت (Ethernet)',
        page: 9,
      },
      {
        type: 'multiple_choice',
        question: 'تعتبر ............... أصغر وحدة بيانات في الحاسب الآلي:',
        options: ['البت (Bit)', 'البايت (Byte)', 'الميجابايت (MB)', 'التيرابايت (TB)'],
        expectedAnswer: 'البت (Bit)',
        page: 9,
      },
      {
        type: 'multiple_choice',
        question: 'لحل مشكلة عدم ظهور أي صورة على الشاشة بعد توصيل الكمبيوتر بها:',
        options: ['التأكد من توصيل كابل HDMI بإحكام أو تجربة كابل آخر', 'تغيير لوحة المفاتيح', 'إغلاق الراوتر', 'مسح الملفات'],
        expectedAnswer: 'التأكد من توصيل كابل HDMI بإحكام أو تجربة كابل آخر',
        page: 9,
      },
    ],
    concepts: [
      {
        id: 'off_ict_u1_l1_c1',
        conceptNumber: 1,
        titleAr: 'ملحقات الحاسب الآلي ووظيفة كل منها',
        titleEn: 'Computer Accessories & Functions',
        sourceText: 'يتصل بالحاسب ملحقات هامة مثل الراوتر، الإيثرنت، الفلاش ميموري، والـ HDMI.',
        keyPoints: [
          'الإيثرنت يوفر اتصالاً أكثر سرعة واستقراراً من الشبكات اللاسلكية.',
          'القرص الصلب الخارجي يوفر مساحة إضافية لحفظ البيانات والنسخ الاحتياطي.',
          'كابل HDMI ينقل الصوت والصورة بدقة ممتازة.',
        ],
        dailyLifeExampleAr: 'عندما تشاهدين فيديو تعليمياً مع مس نور وتصلين اللابتوب بشاشة التلفاز الكبيرة عبر كابل HDMI.',
        dailyLifeExampleEn: 'Connecting your laptop to the family TV screen using an HDMI cable to watch a video lesson.',
        storyAnalogyAr: 'الملحقات مثل الحقيبة والمقلمة والمسطرة للطالب؛ تساعد الكمبيوتر على إنجاز مهامه بمهارة.',
        storyAnalogyEn: 'Accessories are like a pencil case and ruler for a student, helping the computer perform great tasks.',
        prerequisiteAr: 'التمييز بين أجهزة الإدخال وأجهزة الإخراج الأساسية.',
        prerequisiteEn: 'Basic familiarity with computer inputs and outputs.',
        visualType: 'diagram',
      },
    ],
  },
  {
    id: 'off_ict_u1_l2',
    subjectId: 'subj_ict',
    subjectNameAr: 'تكنولوجيا المعلومات والاتصالات',
    subjectNameEn: 'ICT',
    unitNumber: 1,
    unitNameAr: 'الوحدة الأولى: دور تكنولوجيا المعلومات في حياتنا',
    unitNameEn: 'Unit 1: The Role of ICT in Our Lives',
    lessonNumber: 2,
    titleAr: 'الشبكات وأنواعها',
    titleEn: 'Networks and Their Types',
    originTag: 'official',
    isAvailable: true,
    sourceRef: {
      book: 'كتاب تكنولوجيا المعلومات والاتصالات — الصف الخامس الابتدائي',
      bookAr: 'تكنولوجيا المعلومات والاتصالات ص. 10-12',
      bookEn: 'ICT Ministry Book pp. 10-12',
      grade: 'الصف الخامس',
      term: 'الفصل الدراسي الأول',
      unit: 'الوحدة الأولى',
      lesson: 'الدرس الثاني',
      page: 10,
      isAvailable: true,
    },
    objectives: [
      'يشرح ماهية شبكات الحاسب الآلي وأنواعها المختلفة.',
      'يميز بين الشبكة المحلية (LAN) وشبكة الإنترنت وشبكة الإنترانت المغلقة.',
      'يتعرف دور بنك المعرفة المصري (EKB) كمصدر موثوق ومجاني لجميع المصريين.',
    ],
    readingText: `الشبكة هي مجموعة من الأشخاص أو الأجهزة المتصلة معاً لهدف مشترك؛ فكما أن شبكة العائلة تربط بين الأقارب، فإن شبكة الحاسب تربط الأجهزة لتبادل المعلومات.
أنواع الشبكات:
1. الشبكة المحلية (LAN): تربط أجهزة الحاسب داخل مساحة محدودة كمنزل أو معمل مدرسة، وتتيح مشاركة الطابعات والأجهزة.
2. شبكة الإنترنت (Internet): شبكة عالمية مفتوحة تربط ملايين الأجهزة حول العالم عبر بوابة الراوتر ومزود خدمة الإنترنت (ISP).
3. شبكة الإنترانت (Intranet): شبكة خاصة ومغلقة يقتصر استخدامها على أفراد مؤسسة معينة (مثل معمل الحاسب الآلي بالمدرسة أو بنك).
مثال للمواقع الموثوقة: بنك المعرفة المصري (EKB) متاح بالمجان لجميع المواطنين المصريين للبحث والتعلم.`,
    vocabulary: [
      { word: 'LAN', definition: 'Local Area Network: شبكة محلية تربط أجهزة في نطاق جغرافي ضيق كمنزل أو مدرسة.' },
      { word: 'Internet', definition: 'الشبكة العالمية العامة والمفتوحة للجميع في أنحاء العالم.' },
      { word: 'Intranet', definition: 'شبكة داخلية مغلقة وخاصة بمؤسسة محددة لأمان البيانات.' },
      { word: 'ISP', definition: 'Internet Service Provider: الشركة التي تزودك بخدمة الاتصال بالإنترنت.' },
      { word: 'EKB', definition: 'Egyptian Knowledge Bank: بنك المعرفة المصري، مكتبة رقمية وطنية مجانية.' },
    ],
    exercises: [
      {
        type: 'multiple_choice',
        question: 'شبكة معمل الحاسب الآلي بالمدرسة التي يقتصر استخدامها على الطلاب والمعلمين هي شبكة:',
        options: ['إنترانت (Intranet) مغلقة', 'إنترنت عام مفتوح', 'بلوتوث خارجي', 'شبكة هاتف'],
        expectedAnswer: 'إنترانت (Intranet) مغلقة',
        page: 12,
      },
      {
        type: 'multiple_choice',
        question: 'عند توصيل جهازي حاسب آلي معاً في نفس الغرفة أو المكتب لتبادل الملفات، يتكون لديك:',
        options: ['شبكة محلية (LAN)', 'وحدة معالجة مركزية (CPU)', 'مزود خدمة (ISP)', 'بصمة رقمية'],
        expectedAnswer: 'شبكة محلية (LAN)',
        page: 12,
      },
    ],
    concepts: [
      {
        id: 'off_ict_u1_l2_c1',
        conceptNumber: 1,
        titleAr: 'الفرق بين الإنترنت العام والإنترانت المغلقة',
        titleEn: 'Internet vs Intranet',
        sourceText: 'الإنترنت مفتوح للجميع عالمياً، بينما الإنترانت شبكة خاصة ومغلقة لمؤسسة واحدة.',
        keyPoints: [
          'الإنترانت توفر أماناً أعلى لأنها لا تسمح للغرباء بالدخول.',
          'الإنترنت بمثابة مكتبة عالمية كبرى مفتوحة للجميع.',
          'الراوتر يعمل كبوابة (Gateway) للوصول للإنترنت.',
        ],
        dailyLifeExampleAr: 'الحديث مع عائلتك في البيت يشبه الإنترانت الخاصة، بينما التحدث في ميدان عام يشبه الإنترنت المفتوح.',
        dailyLifeExampleEn: 'Talking privately inside your living room is like an Intranet; speaking in a public square is like the Internet.',
        storyAnalogyAr: 'الإنترانت حديقة مغلقة بسور وأبواب، والإنترنت حديقة عامة يزورها الناس من كل المدن.',
        storyAnalogyEn: 'An Intranet is a private fenced garden; the Internet is a vast public park.',
        prerequisiteAr: 'فهم معنى الاتصال بين الأجهزة.',
        prerequisiteEn: 'Understanding how devices connect.',
        visualType: 'concept_map',
      },
    ],
  },
  {
    id: 'off_ict_u1_l3',
    subjectId: 'subj_ict',
    subjectNameAr: 'تكنولوجيا المعلومات والاتصالات',
    subjectNameEn: 'ICT',
    unitNumber: 1,
    unitNameAr: 'الوحدة الأولى: دور تكنولوجيا المعلومات في حياتنا',
    unitNameEn: 'Unit 1: The Role of ICT in Our Lives',
    lessonNumber: 3,
    titleAr: 'أنظمة التواصل الذكية وإنترنت الأشياء',
    titleEn: 'Smart Communication Systems & IoT',
    originTag: 'official',
    isAvailable: true,
    sourceRef: {
      book: 'كتاب تكنولوجيا المعلومات والاتصالات — الصف الخامس الابتدائي',
      bookAr: 'تكنولوجيا المعلومات والاتصالات ص. 13-15',
      bookEn: 'ICT Ministry Book pp. 13-15',
      grade: 'الصف الخامس',
      term: 'الفصل الدراسي الأول',
      unit: 'الوحدة الأولى',
      lesson: 'الدرس الثالث',
      page: 13,
      isAvailable: true,
    },
    objectives: [
      'يشرح مفهوم إنترنت الأشياء (IoT) وتطبيقاته اليومية مثل مكبرات الصوت الذكية والأجهزة المنزلية.',
      'يتعرف كيفية استخدام تقنية البلوتوث لنقل البيانات لاسلكياً عبر مسافات قصيرة.',
      'يوضح دور التكنولوجيا المساعدة في تمكين ذوي الهمم (قارئات الشاشة، طريقة برايل).',
    ],
    readingText: `الأنظمة الذكية جزء أساسي من حياتنا اليومية:
1. إنترنت الأشياء (IoT - Internet of Things): ربط الأجهزة الرقمية والمنزلية بالإنترنت عبر الواي فاي، مما يتيح التحكم بها عن بُعد (مثل تشغيل الغسالة أو مكبرات الصوت الذكية أو الثلاجة).
2. تقنية البلوتوث (Bluetooth): تقنية لاسلكية لنقل البيانات والصوت بين الأجهزة المحمولة عبر مسافات قصيرة.
3. التكنولوجيا لذوي الاحتياجات الخاصة: تمنح ذوي الهمم استقلالية وثقة؛ حيث تساعد قارئات الشاشة وطريقة برايل ضعاف البصر على القراءة وأداء الواجبات وكتابة الأبحاث بسهولة.`,
    vocabulary: [
      { word: 'IoT', definition: 'Internet of Things: شبكة تتيح للأجهزة المنزلية والذكية التواصل عبر الإنترنت والتحكم بها عن بعد.' },
      { word: 'Bluetooth', definition: 'تقنية لاسلكية تربط الأجهزة القريبة لنقل البيانات والملفات بدون أسلاك.' },
      { word: 'Screen Readers', definition: 'برمجيات قارئات الشاشة التي تحول النص المعروض إلى صوت مسموع لضعاف البصر.' },
      { word: 'E-Commerce', definition: 'التجارة الإلكترونية وشراء المنتجات عبر الإنترنت بأمان.' },
    ],
    exercises: [
      {
        type: 'multiple_choice',
        question: 'تقنية لاسلكية تستخدم لنقل البيانات والصوت بين الأجهزة المحمولة عبر مسافات قصيرة:',
        options: ['البلوتوث (Bluetooth)', 'المسح الضوئي', 'لوحة التحكم', 'الراوتر'],
        expectedAnswer: 'البلوتوث (Bluetooth)',
        page: 15,
      },
      {
        type: 'multiple_choice',
        question: 'تساعد برامج ................. ضعاف البصر في قراءة النصوص وكتابة الأبحاث على الكمبيوتر:',
        options: ['قارئات الشاشة (Screen Readers)', 'مكبرات الصوت البسيطة', 'برامج الرسام', 'الطابعة'],
        expectedAnswer: 'قارئات الشاشة (Screen Readers)',
        page: 15,
      },
    ],
    concepts: [
      {
        id: 'off_ict_u1_l3_c1',
        conceptNumber: 1,
        titleAr: 'إنترنت الأشياء والتكنولوجيا المساعدة',
        titleEn: 'Internet of Things & Assistive Tech',
        sourceText: 'إنترنت الأشياء يربط الأجهزة بالإنترنت للتحكم بها، والتكنولوجيا المساعدة تساند ذوي الهمم.',
        keyPoints: [
          'التحكم في الأجهزة المنزلية بضغطة زر من الهاتف.',
          'البلوتوث يربط السماعات والساعات الذكية لاسلكياً.',
          'قارئات الشاشة تدعم استقلالية الطلاب من ضعاف البصر.',
        ],
        dailyLifeExampleAr: 'استخدام سماعة لاسلكية بالبلوتوث لسماع شرح المعلمة نور أثناء التدوين في كراستك.',
        dailyLifeExampleEn: 'Listening to Miss Nour through Bluetooth headphones while taking notes.',
        storyAnalogyAr: 'إنترنت الأشياء كأن الأجهزة في المنزل تتحدث لغة واحدة تفهم بها رغباتك.',
        storyAnalogyEn: 'IoT is like home gadgets speaking a common language to help you effortlessly.',
        prerequisiteAr: 'معرفة مفهوم الاتصال اللاسلكي Wi-Fi.',
        prerequisiteEn: 'Basic Wi-Fi understanding.',
        visualType: 'diagram',
      },
    ],
  },
  {
    id: 'off_ict_u1_l4',
    subjectId: 'subj_ict',
    subjectNameAr: 'تكنولوجيا المعلومات والاتصالات',
    subjectNameEn: 'ICT',
    unitNumber: 1,
    unitNameAr: 'الوحدة الأولى: دور تكنولوجيا المعلومات في حياتنا',
    unitNameEn: 'Unit 1: The Role of ICT in Our Lives',
    lessonNumber: 4,
    titleAr: 'مشكلات الاتصال بالإنترنت وخطوات حلها',
    titleEn: 'Internet Troubleshooting Steps',
    originTag: 'official',
    isAvailable: true,
    sourceRef: {
      book: 'كتاب تكنولوجيا المعلومات والاتصالات — الصف الخامس الابتدائي',
      bookAr: 'تكنولوجيا المعلومات والاتصالات ص. 16-18',
      bookEn: 'ICT Ministry Book pp. 16-18',
      grade: 'الصف الخامس',
      term: 'الفصل الدراسي الأول',
      unit: 'الوحدة الأولى',
      lesson: 'الدرس الرابع',
      page: 16,
      isAvailable: true,
    },
    objectives: [
      'يصف المشكلات الشائعة في الاتصال والأجهزة (بطء الحاسب، بطء المتصفح، انقطاع النت).',
      'يتبع الخطوات الخمس المنطقية لحل المشكلات التقنية: تحديد، تخطيط، تجربة، مراجعة، طلب مساعدة.',
      'يطبق خطوات فحص الراوتر وكابل الإيثرنت عند انقطاع الاتصال.',
    ],
    readingText: `عندما يواجه المستخدم مشكلة تقنية، ينبغي اتباع 5 خطوات منظمة:
1. تحديد المشكلة: هل هي في المكونات المادية (Hardware) أم البرامج (Software) أم في الاتصال؟
2. التخطيط للحلول: مثل إعادة تشغيل الجهاز، فحص التحديثات، أو التأكد من الأسلاك.
3. تجربة الحلول: تطبيق الحلول المقترحة واحداً تلو الآخر.
4. المراجعة: هل نجح الحل؟ ولماذا؟
5. طلب المساعدة: من المعلم أو أحد أفراد الأسرة عند عدم التمكن من الحل.
حلول سريعة:
- بطء الجهاز: إعادة التشغيل، التحقق من التحديثات، حذف التطبيقات غير المرغوبة.
- بطء النت: فحص الراوتر، تجربة كابل إيثرنت بدلاً من الواي فاي.
- انقطاع النت: استخدام أداة إصلاح الشبكة، إعادة تشغيل الراوتر، أو الاتصال بمزود الخدمة (ISP).`,
    vocabulary: [
      { word: 'Troubleshooting', definition: 'عملية اكتشاف أسباب المشكلات التقنية واختبار الحلول المناسبة لها.' },
      { word: 'Hardware issue', definition: 'عطل في الأجزاء الملموسة كالكابلات أو الشاشة أو الراوتر.' },
      { word: 'Software issue', definition: 'مشكلة في نظام التشغيل أو البرامج والتطبيقات تتطلب التحديث أو إعادة التثبيت.' },
    ],
    exercises: [
      {
        type: 'multiple_choice',
        question: 'الخطوة الأولى من خطوات اكتشاف مشكلات الحاسب وحلها هي:',
        options: ['تحديد المشكلة بدقة', 'شراء جهاز جديد', 'مسح كل الملفات', 'طلب المساعدة فوراً دون تفكير'],
        expectedAnswer: 'تحديد المشكلة بدقة',
        page: 18,
      },
      {
        type: 'multiple_choice',
        question: 'إذا كان الاتصال بالواي فاي ضعيفاً أثناء مكالمة فيديو تعليمية، فالحل المقترح هو:',
        options: ['استخدام كابل إيثرنت سلكي بدلاً من اللاسلكي', 'تغيير لوحة المفاتيح', 'إغلاق الشاشة', 'شراء طابعة'],
        expectedAnswer: 'استخدام كابل إيثرنت سلكي بدلاً من اللاسلكي',
        page: 18,
      },
    ],
    concepts: [
      {
        id: 'off_ict_u1_l4_c1',
        conceptNumber: 1,
        titleAr: 'المنهج العلمي في حل المشكلات التقنية',
        titleEn: 'Scientific Troubleshooting Method',
        sourceText: 'تحديد المشكلة، التخطيط للحلول، التجربة خطوة بخطوة، ثم المراجعة وطلب المساعدة.',
        keyPoints: [
          'عدم التسرع وتجربة حل واحد في كل مرة لمعرفة السبب.',
          'التمييز بين عطل الكابل وعطل التطبيق.',
          'إعادة تشغيل الجهاز والراوتر تحل الكثير من المشكلات الشائعة.',
        ],
        dailyLifeExampleAr: 'إذا تعطلت صفحة درس اليوم، نتحقق أولاً من لمبات الراوتر ثم نعيد تحميل الصفحة بهدوء.',
        dailyLifeExampleEn: 'If a lesson page fails to load, first check the router lights then refresh patiently.',
        storyAnalogyAr: 'مثل الطبيب الذي يفحص المريض ويكتشف سبب الألم قبل كتابة الدواء المناسب.',
        storyAnalogyEn: 'Like a doctor diagnosing symptoms before prescribing the right remedy.',
        prerequisiteAr: 'معرفة كابلات الراوتر والواي فاي.',
        prerequisiteEn: 'Understanding router and Wi-Fi connections.',
        visualType: 'diagram',
      },
    ],
  },
  {
    id: 'off_ict_u1_l5',
    subjectId: 'subj_ict',
    subjectNameAr: 'تكنولوجيا المعلومات والاتصالات',
    subjectNameEn: 'ICT',
    unitNumber: 1,
    unitNameAr: 'الوحدة الأولى: دور تكنولوجيا المعلومات في حياتنا',
    unitNameEn: 'Unit 1: The Role of ICT in Our Lives',
    lessonNumber: 5,
    titleAr: 'الملفات الرقمية وكيفية التعامل معها',
    titleEn: 'Digital Files & Management',
    originTag: 'official',
    isAvailable: true,
    sourceRef: {
      book: 'كتاب تكنولوجيا المعلومات والاتصالات — الصف الخامس الابتدائي',
      bookAr: 'تكنولوجيا المعلومات والاتصالات ص. 19-22',
      bookEn: 'ICT Ministry Book pp. 19-22',
      grade: 'الصف الخامس',
      term: 'الفصل الدراسي الأول',
      unit: 'الوحدة الأولى',
      lesson: 'الدرس الخامس',
      page: 19,
      isAvailable: true,
    },
    objectives: [
      'يصف ماهية إدارة الملفات (Folders) وأهمية التسمية الواضحة والتنظيم.',
      'يتعلم خطوات إنشاء مجلد رئيسي ومجلدات فرعية على سطح المكتب أو المستندات.',
      'يتجنب استخدام وسائط التخزين مجهولة المصدر لتفادي الفيروسات وسرقة البيانات.',
    ],
    readingText: `تنظيم المعلومات داخل الحاسب الآلي يشبه تنظيم الكتب داخل مكتبة المدرسة:
عندما ننشئ مجلدات (Folders) ونضع كل ملف في مكانه الصحيح، يسهل الوصول إليه بسرعة.
خطوات إنشاء مجلد جديد في نظام Windows:
1. الذهاب إلى المكان المطلوب (سطح المكتب Desktop أو المستندات Documents).
2. الضغط بزر الفأرة الأيمن في مساحة فارغة واختيار جديد (New).
3. اختيار مجلد (Folder) ثم كتابة اسم واضح ومعبر (مثال: «واجبات الرياضيات» أو «صور العائلة»).
4. الضغط على مفتاح Enter لتثبيت الاسم.
تنبيه هام: تجنب توصيل فلاش ميموري (Flash Memory) مجهولة المصدر بجهازك لأنها قد تنقل الفيروسات الضارة، واحرص على فحصها دائماً بمكافح الفيروسات المحدث.`,
    vocabulary: [
      { word: 'Folder', definition: 'المجلد: صندوق رقمي لتجميع وتنظيم الملفات المتشابهة داخل جهاز الكمبيوتر.' },
      { word: 'Subfolder', definition: 'مجلد فرعي موجود داخل مجلد رئيسي لمزيد من دقة التصنيف.' },
      { word: 'Antivirus scan', definition: 'فحص وسائط التخزين ببرنامج الحماية للتأكد من خلوها من البرمجيات الخبيثة.' },
    ],
    exercises: [
      {
        type: 'multiple_choice',
        question: 'نستخدم ............... لتنظيم وترتيب الملفات المتشابهة داخل جهاز الحاسب الآلي:',
        options: ['المجلدات (Folders)', 'الشاشة', 'المايكروفون', 'كابل HDMI'],
        expectedAnswer: 'المجلدات (Folders)',
        page: 22,
      },
      {
        type: 'multiple_choice',
        question: 'استخدام فلاش ميموري (Flash Memory) مجهولة المصدر قد يعرض جهازك وبياناتك لـ:',
        options: ['خطر الفيروسات وسرقة الملفات', 'زيادة سرعة الجهاز', 'تحسين جودة الصوت', 'تنظيم المجلدات'],
        expectedAnswer: 'خطر الفيروسات وسرقة الملفات',
        page: 22,
      },
    ],
    concepts: [
      {
        id: 'off_ict_u1_l5_c1',
        conceptNumber: 1,
        titleAr: 'إدارة الملفات الرقمية والأمان',
        titleEn: 'Digital File Management & Safe Storage',
        sourceText: 'إنشاء المجلدات وتسميتها بوضوح يسهل العثور عليها، وتجنب الفلاشات المجهولة يحمي النظام.',
        keyPoints: [
          'تسمية المجلد بمحتواه وتاريخه يمنع ضياع الملفات.',
          'المجلد الرئيسي يمكن أن يحتوي على عدة مجلدات فرعية.',
          'الأمان يبدأ من الحذر عند توصيل وحدات التخزين الخارجية.',
        ],
        dailyLifeExampleAr: 'إنشاء مجلد باسم «أبحاث الصف الخامس»، وبداخله مجلدات فرعية: «علوم»، «عربي»، «تكنولوجيا».',
        dailyLifeExampleEn: 'Creating a "Grade 5 Projects" folder, with subfolders for "Science", "Arabic", and "ICT".',
        storyAnalogyAr: 'المجلد مثل أدراج المكتب؛ تضعين الأقلام في درج والدفاتر في درج آخر لتجدي كل شيء بنظام.',
        storyAnalogyEn: 'Folders are like organized desk drawers: one for pencils, another for notebooks.',
        prerequisiteAr: 'استخدام الفأرة وزر الفأرة الأيمن.',
        prerequisiteEn: 'Right-clicking with mouse.',
        visualType: 'concept_map',
      },
    ],
  },
  {
    id: 'off_ict_u1_l6',
    subjectId: 'subj_ict',
    subjectNameAr: 'تكنولوجيا المعلومات والاتصالات',
    subjectNameEn: 'ICT',
    unitNumber: 1,
    unitNameAr: 'الوحدة الأولى: دور تكنولوجيا المعلومات في حياتنا',
    unitNameEn: 'Unit 1: The Role of ICT in Our Lives',
    lessonNumber: 6,
    titleAr: 'مشاركة المعلومات: متى وأين وكيف؟',
    titleEn: 'Information Sharing & MS Excel Formulas',
    originTag: 'official',
    isAvailable: true,
    sourceRef: {
      book: 'كتاب تكنولوجيا المعلومات والاتصالات — الصف الخامس الابتدائي',
      bookAr: 'تكنولوجيا المعلومات والاتصالات ص. 23-25',
      bookEn: 'ICT Ministry Book pp. 23-25',
      grade: 'الصف الخامس',
      term: 'الفصل الدراسي الأول',
      unit: 'الوحدة الأولى',
      lesson: 'الدرس السادس',
      page: 23,
      isAvailable: true,
    },
    objectives: [
      'يناقش متى يقرر نشر المعلومات على شبكة داخلية (Intranet) ومتى على شبكة الإنترنت المفتوحة.',
      'يحذر من مشاركة البيانات الشخصية الحساسة (الاسم الكامل، العنوان، رقم الهاتف).',
      'يستخدم برنامج الجداول الحسابية (MS Excel) لإنشاء صيغ الجمع (+) والطرح (-) والضرب (*) والقسمة (/) والفرز (Sort).',
    ],
    readingText: `مشاركة المعلومات تشبه تقديم هدية؛ يجب أن نعرف لمن نعطيها، ومتى، وكيف:
- الشبكة الداخلية (Intranet): مكان آمن لمشاركة الواجبات والمشروعات مع المعلم والزملاء في المدرسة أو الصور العائلية في المنزل.
- شبكة الإنترنت (Internet): نشارك عليها معلومات عامة مفيدة للجميع (مثل أبحاث الفضاء والطبيعة)، ولا نشارك أبداً معلوماتنا الشخصية كالعنوان أو الهاتف أو كلمات المرور.
الجداول الحسابية (MS Excel):
أداة لتنظيم الأرقام والحسابات. لبدء أي صيغة حسابية نكتب أولاً علامة (=):
- الجمع: =A1+B1
- الطرح: =A1-B1
- الضرب: =A1*B1
- القسمة: =A1/B1
ويمكن فرز وترتيب البيانات أبجدياً من شريط الأدوات (Data -> Sort).`,
    vocabulary: [
      { word: 'Formula (=)', definition: 'الصيغة الحسابية في إكسل وتبدأ دائماً بعلامة يساوي (=) لإجراء العمليات الحسابية تلقائياً.' },
      { word: 'Cell (الخلية)', definition: 'نقطة تقاطع العمود مع الصف في جدول إكسل (مثل A1 أو B2).' },
      { word: 'Sort (فرز)', definition: 'ترتيب البيانات تصاعدياً أو تنازلياً أو أبجدياً بنقرة زر واحدة.' },
    ],
    exercises: [
      {
        type: 'multiple_choice',
        question: 'لإنشاء صيغة حسابية بسيطة داخل برنامج إكسل Excel يجب أن نبدأ بكتابة علامة:',
        options: ['علامة يساوي (=)', 'علامة الدولار ($)', 'علامة آت (@)', 'علامة النجمة (*)'],
        expectedAnswer: 'علامة يساوي (=)',
        page: 25,
      },
      {
        type: 'multiple_choice',
        question: 'لجمع القيم الموجودة في الخلية A8 والخلية B8 نكتب الصيغة:',
        options: ['=A8+B8', '=A8*B8', '=A8-B8', '=A8/B8'],
        expectedAnswer: '=A8+B8',
        page: 25,
      },
    ],
    concepts: [
      {
        id: 'off_ict_u1_l6_c1',
        conceptNumber: 1,
        titleAr: 'صيغ إكسل وقواعد المشاركة الآمنة',
        titleEn: 'Excel Formulas & Safe Sharing',
        sourceText: 'تبدأ العمليات بعلامة (=)، ولا نشارك معلوماتنا الشخصية مع الغرباء على الإنترنت.',
        keyPoints: [
          'علامة (=) تخبر إكسل أن يحسب النتيجة بدلاً من كتابة نص عادي.',
          'الإنترانت أكثر أماناً لمشاركة الواجبات المدرسية مع المعلم.',
          'البيانات الشخصية خط أحمر لا ينشر على المواقع المفتوحة.',
        ],
        dailyLifeExampleAr: 'حساب مجموع درجات المواد في جدول إكسل بكتابة الصيغة: =B2+C2+D2.',
        dailyLifeExampleEn: 'Calculating total exam scores in Excel with =B2+C2+D2 formula.',
        storyAnalogyAr: 'علامة (=) مثل زر التشغيل في الآلة الحاسبة؛ بدونها لا تبدأ الحسابات.',
        storyAnalogyEn: 'The (=) sign is like the power switch: without it, the calculation never starts.',
        prerequisiteAr: 'معرفة العمليات الحسابية الأساسية (+, -, *, /).',
        prerequisiteEn: 'Basic math operations.',
        visualType: 'comparison_table',
      },
    ],
  },

  // =========================================================================
  // الوحدة الثانية: احتياطات الأمن والسلامة الرقمية
  // =========================================================================
  {
    id: 'off_ict_u2_l1',
    subjectId: 'subj_ict',
    subjectNameAr: 'تكنولوجيا المعلومات والاتصالات',
    subjectNameEn: 'ICT',
    unitNumber: 2,
    unitNameAr: 'الوحدة الثانية: احتياطات الأمن والسلامة الرقمية',
    unitNameEn: 'Unit 2: Digital Security & Safety Precautions',
    lessonNumber: 1,
    titleAr: 'أساليب حماية البيانات والمعلومات',
    titleEn: 'Data Protection & Backup Methods',
    originTag: 'official',
    isAvailable: true,
    sourceRef: {
      book: 'كتاب تكنولوجيا المعلومات والاتصالات — الصف الخامس الابتدائي',
      bookAr: 'تكنولوجيا المعلومات والاتصالات ص. 27-29',
      bookEn: 'ICT Ministry Book pp. 27-29',
      grade: 'الصف الخامس',
      term: 'الفصل الدراسي الأول',
      unit: 'الوحدة الثانية',
      lesson: 'الدرس الأول',
      page: 27,
      isAvailable: true,
    },
    objectives: [
      'يصف أهمية حماية معلومات الهوية الشخصية (PII) من قراصنة الحاسب (Hackers).',
      'يوضح أهمية النسخ الاحتياطي الدوري للملفات باستخدام قرص صلب خارجي أو وسائط آمنة.',
      'يشرح دور تحديث الأجهزة وبرامج مكافحة الفيروسات في سد الثغرات الأمنية.',
    ],
    readingText: `يمكن لقراصنة الحاسب سرقة معلوماتك الشخصية كاسمك الكامل وكلمات مرورك وتفاصيل حساباتك لسرقة أموالك أو إرسال فيروسات، لذا اتبع هذه الطرق الخمس لحماية نفسك:
1. شارك قدراً أقل من المعلومات الشخصية عبر الإنترنت (كلما قلّت المعلومات قلت فرص سرقتها).
2. استخدم كلمات مرور قوية وفريدة لا تتكرر بين الحسابات.
3. ثبّت برنامج مكافحة الفيروسات واحرص على تحديثه باستمرار لاكتشاف التهديدات وإزالتها.
4. حافظ على تحديث أجهزتك وتطبيقاتك لأن التحديثات تسد الثغرات الأمنية التي يستغلها القراصنة.
5. انسخ بياناتك احتياطياً بانتظام على قرص صلب خارجي (External HDD) أو ذاكرة فلاش موثوقة لحمايتها من التلف أو الفقدان.`,
    vocabulary: [
      { word: 'Hackers', definition: 'قراصنة الكمبيوتر الذين يحاولون اختراق الأنظمة وسرقة البيانات الشخصية أو المالية.' },
      { word: 'Backup', definition: 'النسخ الاحتياطي: حفظ نسخة إضافية من ملفاتك المهمة في مكان منفصل لتفادي ضياعها.' },
      { word: 'Security Patch', definition: 'التحديث الأمني الذي يسد الثغرات في البرامج ويمنع اختراق الجهاز.' },
    ],
    exercises: [
      {
        type: 'multiple_choice',
        question: 'يعد أحد أفضل الأجهزة الملحقة المستخدمة لحفظ الملفات المهمة وعمل نسخة احتياطية بشكل آمن:',
        options: ['القرص الصلب الخارجي (External HDD)', 'الشاشة', 'لوحة المفاتيح', 'الفأرة'],
        expectedAnswer: 'القرص الصلب الخارجي (External HDD)',
        page: 29,
      },
      {
        type: 'multiple_choice',
        question: 'تحديث أجهزتك وتطبيقاتك باستمرار يساعدك على:',
        options: ['مواجهة المخاطر المحتملة وسد الثغرات الأمنية', 'تغيير خلفية الشاشة', 'إلغاء كلمات المرور', 'حذف الصور القديمة'],
        expectedAnswer: 'مواجهة المخاطر المحتملة وسد الثغرات الأمنية',
        page: 29,
      },
    ],
    concepts: [
      {
        id: 'off_ict_u2_l1_c1',
        conceptNumber: 1,
        titleAr: 'حماية البيانات الشخصية والنسخ الاحتياطي',
        titleEn: 'Data Protection & Backup',
        sourceText: 'تقليل المعلومات المنشورة وعمل نسخ احتياطية على قرص خارجي يحمي ملفاتك من القراصنة.',
        keyPoints: [
          'الحد من مشاركة البيانات الشخصية على الإنترنت.',
          'النسخ الاحتياطي يحميك عند تلف الجهاز أو تعطل النظام.',
          'التحديث الدوري للأجهزة يغلق الأبواب أمام القراصنة.',
        ],
        dailyLifeExampleAr: 'حفظ نسخة من أبحاثك وصورك المدرسية على فلاشة أو هارد ديسك خاص بالبيت.',
        dailyLifeExampleEn: 'Backing up your school projects and family pictures onto a dedicated home drive.',
        storyAnalogyAr: 'النسخ الاحتياطي مثل عمل نسخة ثانية من مفتاح بيتك وحفظها في مكان آمن عند الطوارئ.',
        storyAnalogyEn: 'A backup is like a spare house key kept in a safe place for emergencies.',
        prerequisiteAr: 'معرفة مفهوم القرص الصلب والملفات.',
        prerequisiteEn: 'Understanding storage and files.',
        visualType: 'diagram',
      },
    ],
  },
  {
    id: 'off_ict_u2_l2',
    subjectId: 'subj_ict',
    subjectNameAr: 'تكنولوجيا المعلومات والاتصالات',
    subjectNameEn: 'ICT',
    unitNumber: 2,
    unitNameAr: 'الوحدة الثانية: احتياطات الأمن والسلامة الرقمية',
    unitNameEn: 'Unit 2: Digital Security & Safety Precautions',
    lessonNumber: 2,
    titleAr: 'إدارة كلمات المرور والمصادقة متعددة العوامل',
    titleEn: 'Password Management & MFA',
    originTag: 'official',
    isAvailable: true,
    sourceRef: {
      book: 'كتاب تكنولوجيا المعلومات والاتصالات — الصف الخامس الابتدائي',
      bookAr: 'تكنولوجيا المعلومات والاتصالات ص. 30-32',
      bookEn: 'ICT Ministry Book pp. 30-32',
      grade: 'الصف الخامس',
      term: 'الفصل الدراسي الأول',
      unit: 'الوحدة الثانية',
      lesson: 'الدرس الثاني',
      page: 30,
      isAvailable: true,
    },
    objectives: [
      'يتعرف أساليب التصيد الاحتيالي عبر البريد (Phishing) وعبر الرسائل النصية (Smishing).',
      'يشرح دور برامج إدارة كلمات المرور (Password Managers) في توليد وفحص الكلمات القوية.',
      'يطبق المصادقة متعددة العوامل (MFA) لحماية الحسابات بأكثر من وسيلة تحقق.',
    ],
    readingText: `يستخدم القراصنة أساليب خداعية لسرقة كلمات المرور:
- التصيد الاحتيالي (Phishing): رسائل بريد إلكتروني أو صفحات مزيفة تبدو حقيقية تطلب منك الضغط على رابط لإدخال بياناتك.
- التصيد عبر الرسائل النصية (Smishing): رسائل SMS خادعة على هاتفك تدعي فوزك بجوائز.
من علامات التحذير: الأخطاء الإملائية أو النحوية، والطلب الملح لمعلومات شخصية وسرية.
طرق الحماية:
1. برامج إدارة كلمات المرور: تنشئ كلمات مرور قوية ومعقدة تفحص ما إذا كانت كلمتك مسربة أو ضعيفة.
2. المصادقة متعددة العوامل (MFA): تتطلب عاملين للتحقق: كلمة المرور (عامل تعرفه) + رمز مؤقت يُرسل لهاتفك (عامل تمتلكه)، فلا يستطيع المخترق الدخول حتى لو عرف كلمة المرور.`,
    vocabulary: [
      { word: 'Phishing', definition: 'التصيد الاحتيالي عبر البريد الإلكتروني لخداع المستخدم وسرقة بياناته.' },
      { word: 'Smishing', definition: 'التصيد عبر الرسائل النصية القصيرة SMS على الهواتف الذكية.' },
      { word: 'MFA', definition: 'Multi-Factor Authentication: المصادقة متعددة العوامل لحماية الحساب بطبقتين من الأمان أو أكثر.' },
      { word: 'Password Manager', definition: 'برنامج ينشئ كلمات سر فريدة ويخزنها بأمان وينبهك للكلمات الضعيفة.' },
    ],
    exercises: [
      {
        type: 'multiple_choice',
        question: 'المصادقة متعددة العوامل (MFA) تتطلب وسيلتي تحقق أو أكثر للدخول لحسابك مثل:',
        options: ['كلمة المرور ورمز مؤقت يرسل لهاتفك', 'اسمك فقط', 'لونك المفضل', 'صورة شخصية'],
        expectedAnswer: 'كلمة المرور ورمز مؤقت يرسل لهاتفك',
        page: 32,
      },
      {
        type: 'multiple_choice',
        question: 'إرسال رسائل نصية قصيرة SMS مزيفة تدعي الفوز بجائزة بهدف سرقة البيانات يسمى:',
        options: ['التصيد بالرسائل النصية (Smishing)', 'البحث الآمن', 'إدارة الملفات', 'التحديث التلقائي'],
        expectedAnswer: 'التصيد بالرسائل النصية (Smishing)',
        page: 32,
      },
    ],
    concepts: [
      {
        id: 'off_ict_u2_l2_c1',
        conceptNumber: 1,
        titleAr: 'قوة كلمات المرور وطبقات الأمان (MFA)',
        titleEn: 'Strong Passwords & MFA Security',
        sourceText: 'استخدم كلمات مرور قوية ومدير كلمات مرور، وفعل المصادقة الثنائية لحساباتك.',
        keyPoints: [
          'كلمة المرور القوية تحتوي حروفا كبيرة وصغيرة وأرقاما ورموزا.',
          'رمز الهاتف المؤقت يحميك حتى لو عرف القراصنة كلمة المرور.',
          'احذر الرسائل التي تحتوي أخطاء لغوية وتطلب بياناتك.',
        ],
        dailyLifeExampleAr: 'تفعيل رمز التأكيد على هاتف والدك عند تسجيل الدخول لحساب بنكي أو إيميل المدرسة.',
        dailyLifeExampleEn: 'Receiving a 6-digit confirmation code on your phone when logging into an account.',
        storyAnalogyAr: 'MFA مثل باب البيت الذي يحتاج مفتاحاً عادياً وبصمة إصبع معاً؛ سارق المفتاح لن يستطيع الدخول!',
        storyAnalogyEn: 'MFA is like having a lock with both a physical key and a fingerprint scanner.',
        prerequisiteAr: 'معرفة مفهوم تسجيل الدخول وكلمة المرور.',
        prerequisiteEn: 'Basic login and password concept.',
        visualType: 'concept_map',
      },
    ],
  },
  {
    id: 'off_ict_u2_l3',
    subjectId: 'subj_ict',
    subjectNameAr: 'تكنولوجيا المعلومات والاتصالات',
    subjectNameEn: 'ICT',
    unitNumber: 2,
    unitNameAr: 'الوحدة الثانية: احتياطات الأمن والسلامة الرقمية',
    unitNameEn: 'Unit 2: Digital Security & Safety Precautions',
    lessonNumber: 3,
    titleAr: 'طرق التعامل مع المواقع الإلكترونية الاحتيالية',
    titleEn: 'Dealing with Fraudulent Websites & Scareware',
    originTag: 'official',
    isAvailable: true,
    sourceRef: {
      book: 'كتاب تكنولوجيا المعلومات والاتصالات — الصف الخامس الابتدائي',
      bookAr: 'تكنولوجيا المعلومات والاتصالات ص. 33-35',
      bookEn: 'ICT Ministry Book pp. 33-35',
      grade: 'الصف الخامس',
      term: 'الفصل الدراسي الأول',
      unit: 'الوحدة الثانية',
      lesson: 'الدرس الثالث',
      page: 33,
      isAvailable: true,
    },
    objectives: [
      'يوضح أساليب خداع المستخدمين عبر الإنترنت (الجوائز الوهمية، برمجيات التخويف Scareware).',
      'يشرح كيفية فحص عنوان الموقع (URL) والتحقق من مصداقيته قبل إدخال أي بيانات.',
      'يحدد الجهات التي يتم إبلاغها عند التعرض للاحتيال (الأسرة، المعلم، خط نجدة الطفل، إدارة مكافحة جرائم الإنترنت).',
    ],
    readingText: `المواقع المزيفة حيلة شائعة لخداع المستخدمين وسرقة أموالهم أو بياناتهم:
أساليب المواقع الاحتيالية:
1. الإغراء بشيء يثير الحماس كالجوائز والمكافآت الخيالية الوهمية.
2. برمجيات التخويف (Scareware): إظهار تحذيرات مفزعة كاذبة بأن جهازك مخترق وعليك الضغط فوراً لتنظيفه!
3. استغلال بياناتك للحصول على المال أو تدمير ملفاتك.
كيف تتجنبها؟
- تحقق دائماً من عنوان الموقع (URL)؛ يتكون من البروتوكول، واسم المورد، ومسار الملف.
- انتبه للأخطاء الإملائية الشائعة في عناوين المواقع المزيفة.
- عند الوقوع ضحية للاحتيال: أبلغ والديك، أو معلمك، أو اتصل بخط نجدة الطفل، أو أبلغ إدارة مكافحة جرائم الإنترنت فوراً.`,
    vocabulary: [
      { word: 'Scareware', definition: 'برمجيات التخويف التي تعرض رسائل تحذير كاذبة لإجبارك على الضغط أو الدفع.' },
      { word: 'URL Inspection', definition: 'فحص عنوان الرابط للتأكد من كتابته الصحيحة ووجود بروتوكول الأمان https://.' },
      { word: 'Cybercrime Dept', definition: 'إدارة مكافحة جرائم الإنترنت التابعة لوزارة الداخلية لحماية المواطنين.' },
    ],
    exercises: [
      {
        type: 'multiple_choice',
        question: 'مواقع برمجيات التخويف (Scareware) التي تعرض تحذيرات كاذبة بوجود فيروسات تعتبر من المواقع:',
        options: ['الاحتيالية الخطيرة', 'التعليمية الموثوقة', 'الرسمية لوزارة التعليم', 'محركات البحث العالمية'],
        expectedAnswer: 'الاحتيالية الخطيرة',
        page: 35,
      },
      {
        type: 'multiple_choice',
        question: 'في حال وقعت ضحية لأحد المواقع الاحتيالية، يجب عليك فوراً:',
        options: ['إبلاغ أحد أفراد أسرتك أو معلمك وإدارة مكافحة جرائم الإنترنت', 'عدم إخبار أي شخص', 'إدخال بطاقة الائتمان', 'إغلاق الهاتف وتركه'],
        expectedAnswer: 'إبلاغ أحد أفراد أسرتك أو معلمك وإدارة مكافحة جرائم الإنترنت',
        page: 35,
      },
    ],
    concepts: [
      {
        id: 'off_ict_u2_l3_c1',
        conceptNumber: 1,
        titleAr: 'كشف المواقع الاحتيالية والإبلاغ السريع',
        titleEn: 'Detecting Scams & Fast Reporting',
        sourceText: 'المواقع المزيفة تغريك بالجوائز أو تخيفك بتحذيرات كاذبة لسرقة بياناتك.',
        keyPoints: [
          'التحقق من الرابط الرسمي وعدم الوثوق بالرسائل المفزعة.',
          'الهدوء وعدم الضغط على روابط مجهولة تطلب بيانات بنكية.',
          'إبلاغ الكبار فوراً يحميك ويحمي غيرك من الاحتيال.',
        ],
        dailyLifeExampleAr: 'ظهور إعلان مفاجئ: "مبروك كسبت لابتوب جديد اضغط هنا"؛ هذا فخ احتيالي نتجاهله فوراً.',
        dailyLifeExampleEn: 'Seeing a pop-up saying "You won a free laptop, click here": ignore it as an obvious scam.',
        storyAnalogyAr: 'مثل البائع المزيف في الشارع الذي يبيع علبة فارغة بمظهر جذاب ليأخذ نقودك ويهرب.',
        storyAnalogyEn: 'Like a street trickster offering an empty decorated box to grab your pocket money.',
        prerequisiteAr: 'معرفة روابط المواقع URLs.',
        prerequisiteEn: 'Understanding website links.',
        visualType: 'comparison_table',
      },
    ],
  },
  {
    id: 'off_ict_u2_l4',
    subjectId: 'subj_ict',
    subjectNameAr: 'تكنولوجيا المعلومات والاتصالات',
    subjectNameEn: 'ICT',
    unitNumber: 2,
    unitNameAr: 'الوحدة الثانية: احتياطات الأمن والسلامة الرقمية',
    unitNameEn: 'Unit 2: Digital Security & Safety Precautions',
    lessonNumber: 4,
    titleAr: 'حقوق النشر والملكية الفكرية',
    titleEn: 'Copyright & Intellectual Property',
    originTag: 'official',
    isAvailable: true,
    sourceRef: {
      book: 'كتاب تكنولوجيا المعلومات والاتصالات — الصف الخامس الابتدائي',
      bookAr: 'تكنولوجيا المعلومات والاتصالات ص. 36-38',
      bookEn: 'ICT Ministry Book pp. 36-38',
      grade: 'الصف الخامس',
      term: 'الفصل الدراسي الأول',
      unit: 'الوحدة الثانية',
      lesson: 'الدرس الرابع',
      page: 36,
      isAvailable: true,
    },
    objectives: [
      'يشرح مفهوم حقوق النشر وقوانين حماية الإبداع للمؤلفين والمبدعين.',
      'يتعرف الرمز الدولي لحقوق النشر © وشروط الاقتباس وإعادة الصياغة مع ذكر المصدر.',
      'يميز بين الملكية الفكرية المحمية، ورخصة المشاع الإبداعي (Creative Commons)، والملكية العامة.',
    ],
    readingText: `تحمي حقوق النشر أعمال المبدعين والمؤلفين؛ كالكتب، الصور، الموسيقى، الأفلام، الألعاب، والمواقع الإلكترونية، وتمنع نسخها أو استخدامها دون إذن صاحبها.
الرمز الدولي لحقوق النشر هو الحرف C داخل دائرة ©.
قواعد استخدام المحتوى:
- المحتوى المكتوب: يمكنك اقتباس جزء صغير أو إعادة صياغته بأسلوبك، مع وجوب نسب العمل لمؤلفه الأصلي.
- الصور: يلزم ذكر اسم المصور والمصدر والرابط ونوع الترخيص.
أعمال لا تشملها حقوق النشر (الملكية العامة):
- الحقائق التاريخية والعلمية والاكتشافات.
- المستندات والقوانين الرسمية.
- الأعمال التي مر على وفاة صاحبها 50 عاماً في القانون المصري.
- رخصة المشاع الإبداعي (Creative Commons): ترخيص يسمح بإعادة استخدام العمل مجاناً وفق شروط محددة.`,
    vocabulary: [
      { word: 'Copyright ©', definition: 'حق قانوني يمنح صاحب العمل الإبداعي حصرية نشره ويمنع سرقته أو تقليده.' },
      { word: 'Creative Commons', definition: 'رخصة المشاع الإبداعي التي تسمح بالمشاركة والاستخدام وفق رغبة المؤلف.' },
      { word: 'Public Domain', definition: 'الملكية العامة: أعمال انقضت فترة حمايتها القانونية وأصبحت متاحة للجميع مجاناً.' },
      { word: 'Paraphrasing', definition: 'إعادة الصياغة: كتابة المعنى بأسلوبك وكلماتك الخاصة مع ذكر صاحب الفكرة الأصلية.' },
    ],
    exercises: [
      {
        type: 'multiple_choice',
        question: 'الرمز الدولي المعتمد لحقوق النشر هو:',
        options: ['حرف C داخل دائرة ©', 'علامة الدولار $', 'علامة الشباك #', 'علامة النسبة المئوية %'],
        expectedAnswer: 'حرف C داخل دائرة ©',
        page: 38,
      },
      {
        type: 'multiple_choice',
        question: 'أي من الأعمال التالية يندرج ضمن الملكية العامة ولا يخضع لحقوق النشر:',
        options: ['الحقائق العلمية والأعمال التي مر على وفاة مؤلفها 50 عاماً', 'رواية جديدة منشورة هذا الأسبوع', 'ألبوم صور لمصور محترف', 'برنامج كمبيوتر حديث'],
        expectedAnswer: 'الحقائق العلمية والأعمال التي مر على وفاة مؤلفها 50 عاماً',
        page: 38,
      },
    ],
    concepts: [
      {
        id: 'off_ict_u2_l4_c1',
        conceptNumber: 1,
        titleAr: 'احترام الملكية الفكرية والمشاع الإبداعي',
        titleEn: 'Respecting Intellectual Property & Creative Commons',
        sourceText: 'يحمي القانون إبداع المؤلفين ©، ويجب الاستئذان أو استخدام المصادر المفتوحة مع ذكر المصدر.',
        keyPoints: [
          'عدم نسخ نصوص وصور الآخرين وادعاء ملكيتها.',
          'إعادة الصياغة مع ذكر المؤلف دليل على الأمانة العلمية.',
          'المشاع الإبداعي يمنحك تصريحاً مسبقاً للاستفادة من المحتوى.',
        ],
        dailyLifeExampleAr: 'عند وضع صورة في بحث مدرسي، نكتب تحتها رابط واسم موقع المشاع الإبداعي الذي أخذنا منه الصورة.',
        dailyLifeExampleEn: 'Citing the photographer and Creative Commons source link under an image in your project.',
        storyAnalogyAr: 'مثل استعارة لعبة صديقك؛ يجب أن تستأذنه أولاً وتشكر فضله أمام الجميع.',
        storyAnalogyEn: 'Like borrowing a friend’s toy: ask permission first and credit their generosity.',
        prerequisiteAr: 'فهم مفهوم الملكية الشخصية.',
        prerequisiteEn: 'Understanding personal ownership.',
        visualType: 'concept_map',
      },
    ],
  },
  {
    id: 'off_ict_u2_l5',
    subjectId: 'subj_ict',
    subjectNameAr: 'تكنولوجيا المعلومات والاتصالات',
    subjectNameEn: 'ICT',
    unitNumber: 2,
    unitNameAr: 'الوحدة الثانية: احتياطات الأمن والسلامة الرقمية',
    unitNameEn: 'Unit 2: Digital Security & Safety Precautions',
    lessonNumber: 5,
    titleAr: 'الأمن الوقائي وانتقاء المصادر الرقمية',
    titleEn: 'Preventive Security & Digital Source Evaluation',
    originTag: 'official',
    isAvailable: true,
    sourceRef: {
      book: 'كتاب تكنولوجيا المعلومات والاتصالات — الصف الخامس الابتدائي',
      bookAr: 'تكنولوجيا المعلومات والاتصالات ص. 39-41',
      bookEn: 'ICT Ministry Book pp. 39-41',
      grade: 'الصف الخامس',
      term: 'الفصل الدراسي الأول',
      unit: 'الوحدة الثانية',
      lesson: 'الدرس الخامس',
      page: 39,
      isAvailable: true,
    },
    objectives: [
      'يشرح مفهوم الأمن الوقائي وأهمية التدابير الاستباقية لتجنب المخاطر الرقمية.',
      'يميز بدقة بين الحقائق المثبتة (Facts) والآراء الشخصية (Opinions) أثناء البحث.',
      'يتحقق من أمان المواقع بوجود علامة القفل وبروتوكول https:// قبل كتابة البيانات.',
    ],
    readingText: `الأمن الوقائي هو مجموعة الإجراءات والتدابير الاستباقية التي نتخذها لحماية أنفسنا وأجهزتنا من المخاطر قبل حدوثها.
كيف تختار مصادرك الرقمية عند إجراء البحث؟
1. اختيار المصادر المعتمدة والموثوقة مثل بنك المعرفة المصري (EKB).
2. التمييز بين الحقائق والآراء:
   - الحقائق (Facts): معلومات مؤكدة ناتجة عن البحث والملاحظة ويمكن إثبات صحتها ويتفق عليها الجميع.
   - الآراء (Opinions): وجهات نظر شخصية ومشاعر تختلف من شخص لآخر وتحتمل الجدل والنقاش.
3. التثبت من أكثر من مرجع موثوق للتأكد من صحة المعلومة.
إرشادات أمان هامة: تأكد من وجود علامة القفل بجوار الرابط وبروتوكول https://، ولا تضغط على الروابط المشبوهة.`,
    vocabulary: [
      { word: 'Preventive Security', definition: 'الأمن الوقائي: أخذ الحيطة مسبقاً وتأمين الحسابات لتفادي الاختراقات قبل وقوعها.' },
      { word: 'Fact (حقيقة)', definition: 'معلومة مثبتة علمياً بالتجربة والبرهان لا تقبل الشك والجدل.' },
      { word: 'Opinion (رأي)', definition: 'وجهة نظر أو تفضيل شخصي يختلف من فرد لآخر ولا يُعد دليلاً علمياً.' },
      { word: 'https://', definition: 'بروتوكول نقل النص الفائق الآمن والمشفر لحماية سرية البيانات.' },
    ],
    exercises: [
      {
        type: 'multiple_choice',
        question: 'العبارات التي يمكن إثبات صحتها بالتجربة والبحث ويتفق عليها الجميع تسمى:',
        options: ['حقائق (Facts)', 'آراء شخصية (Opinions)', 'شائعات', 'برمجيات تخويف'],
        expectedAnswer: 'حقائق (Facts)',
        page: 41,
      },
      {
        type: 'multiple_choice',
        question: 'للتأكد من أمان الموقع الإلكتروني قبل إدخال أي معلومات، يجب فحص الرابط والتأكد من وجود:',
        options: ['علامة القفل وبروتوكول https://', 'صور متحركة كثيرة', 'إعلانات جوائز وهمية', 'أخطاء إملائية'],
        expectedAnswer: 'علامة القفل وبروتوكول https://',
        page: 41,
      },
    ],
    concepts: [
      {
        id: 'off_ict_u2_l5_c1',
        conceptNumber: 1,
        titleAr: 'التمييز بين الحقائق والآراء في البحث العلمي',
        titleEn: 'Facts vs Opinions in Digital Research',
        sourceText: 'الحقيقة مثبتة علمياً، والرأي وجهة نظر شخصية؛ ويجب الاعتماد على الحقائق في أبحاثنا.',
        keyPoints: [
          'الحقيقة قابلة للإثبات والتكرار (مثال: الأرض تدور حول الشمس).',
          'الرأي يعبر عن إحساس شخصي (مثال: فصل الصيف أجمل من الشتاء).',
          'الرجوع للمصادر الوطنية المعتمدة كبنك المعرفة المصري.',
        ],
        dailyLifeExampleAr: 'قولك "النيل أطول أنهار العالم" حقيقة جغرافية مثبتة، أما "النيل أجمل أنهار العالم" فرأي شخصي جميل.',
        dailyLifeExampleEn: '"The Nile is the longest river" is a fact; "The Nile is the most beautiful river" is an opinion.',
        storyAnalogyAr: 'الحقيقة مثل شروق الشمس يراها الجميع، والرأي مثل اختيار لون الملابس المفضل لديك.',
        storyAnalogyEn: 'A fact is like the sunrise everyone sees; an opinion is like picking your favorite shirt color.',
        prerequisiteAr: 'قراءة النصوص واستخراج الأفكار الرئيسية.',
        prerequisiteEn: 'Reading and identifying key ideas.',
        visualType: 'comparison_table',
      },
    ],
  },
  {
    id: 'off_ict_u2_l6',
    subjectId: 'subj_ict',
    subjectNameAr: 'تكنولوجيا المعلومات والاتصالات',
    subjectNameEn: 'ICT',
    unitNumber: 2,
    unitNameAr: 'الوحدة الثانية: احتياطات الأمن والسلامة الرقمية',
    unitNameEn: 'Unit 2: Digital Security & Safety Precautions',
    lessonNumber: 6,
    titleAr: 'توثيق المعلومات والمراجع في الأبحاث',
    titleEn: 'Documenting Information & Citations',
    originTag: 'official',
    isAvailable: true,
    sourceRef: {
      book: 'كتاب تكنولوجيا المعلومات والاتصالات — الصف الخامس الابتدائي',
      bookAr: 'تكنولوجيا المعلومات والاتصالات ص. 42-44',
      bookEn: 'ICT Ministry Book pp. 42-44',
      grade: 'الصف الخامس',
      term: 'الفصل الدراسي الأول',
      unit: 'الوحدة الثانية',
      lesson: 'الدرس السادس',
      page: 42,
      isAvailable: true,
    },
    objectives: [
      'يشرح كيفية تدوين الملاحظات وإعادة صياغة المحتوى بأمانة علمية.',
      'يطبق وضع علامات الاقتباس « » عند نقل كلمات الكاتب حرفياً.',
      'يوثق المصادر في نهاية التقرير البحثي بترتيب أبجدي سليم وذكر الرابط الدائم (Permalink).',
    ],
    readingText: `عندما تجري بحثاً وتجد معلومات رائعة، يجب توثيقها بشكل صحيح:
1. تدوين الملاحظات: اكتب الأفكار بكلماتك الخاصة، واذكر اسم المؤلف والموقع (URL).
2. الاقتباس الحرفي: إذا نسخت كلمات حرفية، ضعها بين علامتي اقتباس « » واذكر صاحب النص وسبب تضمينه.
3. إعادة الصياغة: غير المفردات وبنية الجمل ولكن حافظ على دقة المعنى ونسب الفكرة لصاحبها.
4. قائمة المراجع في نهاية التقرير: ضع صفحة "المصادر والمراجع" ورتبها أبجدياً حسب اسم عائلة المؤلف أو عنوان المقال، وتاريخ النشر، والرابط الدائم (Permalink).
5. توثيق الفيديوهات: اذكر اسم القناة أو من رفع الفيديو، تاريخ النشر، عنوان المقطع، ورابط المشاهدة.`,
    vocabulary: [
      { word: 'Citation', definition: 'التوثيق: ذكر اسم الكاتب والمصدر المقتبس منه لإثبات الأمانة العلمية.' },
      { word: 'Quotation Marks « »', definition: 'علامات التنصيص التي تحيط بالكلمات المنقولة نصاً كما كتبها المؤلف الأصلي.' },
      { word: 'Permalink', definition: 'الرابط الدائم للموقع لضمان الرجوع للصفحة الأصلية في أي وقت.' },
    ],
    exercises: [
      {
        type: 'multiple_choice',
        question: 'عند نسخ كلمات حرفية من كتاب أو موقع للبحث، يجب وضعها بين:',
        options: ['علامتي اقتباس « »', 'أقواس مربعة [ ]', 'علامات استفهام ؟؟', 'نقاط متتالية ...'],
        expectedAnswer: 'علامتي اقتباس « »',
        page: 44,
      },
      {
        type: 'multiple_choice',
        question: 'في نهاية التقرير البحثي، توضع قائمة المراجع في صفحة خاصة ويتم ترتيبها:',
        options: ['ترتيباً أبجدياً بحسب اسم المؤلف أو العنوان', 'بحسب طول الكلمات', 'بحسب عدد الصور', 'بدون أي ترتيب'],
        expectedAnswer: 'ترتيباً أبجدياً بحسب اسم المؤلف أو العنوان',
        page: 44,
      },
    ],
    concepts: [
      {
        id: 'off_ict_u2_l6_c1',
        conceptNumber: 1,
        titleAr: 'قواعد التوثيق والأمانة العلمية',
        titleEn: 'Academic Citation & Honesty',
        sourceText: 'توثيق المراجع واستخدام علامات الاقتباس وإعادة الصياغة باحترافية.',
        keyPoints: [
          'الاقتباس الحرفي يوضع بين « » مع ذكر الكاتب.',
          'قائمة المراجع توضع في نهاية البحث مرتبة أبجدياً.',
          'احترام تعب الآخرين في إنتاج المعرفة يعكس أخلاق الطالب الباحث.',
        ],
        dailyLifeExampleAr: 'كتابة اسم كتاب المدرسة ورقم الصفحة في أسفل بحث العلوم الذي تقدمينه لمعلمتك.',
        dailyLifeExampleEn: 'Writing the textbook title and page number at the bottom of your science report.',
        storyAnalogyAr: 'مثل أن تنقلي قصة سمعتيها من جدتك؛ تقولين في البداية: "كما حكت لي جدتي الحبيبة".',
        storyAnalogyEn: 'Like telling a story from your grandmother and starting by saying "As my dear grandma told me".',
        prerequisiteAr: 'كتابة التقارير البسيطة والفقرات.',
        prerequisiteEn: 'Writing basic report paragraphs.',
        visualType: 'concept_map',
      },
    ],
  },
];
