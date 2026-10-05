/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { OfficialCurriculumLesson } from '../../types/teachingSession';

/**
 * Official Egyptian Ministry of Education Curriculum for Grade 5 (Term 1)
 * Subject: اللغة العربية (تواصل) — الصف الخامس الابتدائي
 */
export const ARABIC_CURRICULUM_LESSONS: OfficialCurriculumLesson[] = [
  {
    id: 'off_ar_u1_l1_ana_astatee',
    subjectId: 'subj_arabic',
    subjectNameAr: 'اللغة العربية',
    subjectNameEn: 'Arabic Language',
    unitNumber: 1,
    unitNameAr: 'الوحدة الأولى: أكتشف ذاتي وتراثي',
    unitNameEn: 'Unit 1: Discovering Identity & Heritage',
    lessonNumber: 1,
    titleAr: 'قصة الاستماع: «أنا أستطيع»',
    titleEn: 'Listening Story: "I Can"',
    originTag: 'official',
    isAvailable: true,
    sourceRef: {
      book: 'كتاب اللغة العربية — تواصل — الصف الخامس الابتدائي — الفصل الدراسي الأول',
      bookAr: 'اللغة العربية — تواصل ص. 6-11',
      bookEn: 'Arabic Ministry Book pp. 6-11',
      grade: 'الصف الخامس',
      term: 'الفصل الدراسي الأول',
      unit: 'الوحدة الأولى',
      lesson: 'الدرس الأول: قصة الاستماع',
      page: 6,
      isAvailable: true,
    },
    objectives: [
      'يستمع الطالب بتركيز لقصة "أنا أستطيع" ويستخلص الفكرة العامة وعوامل الثقة بالنفس.',
      'يتعلم من قصة آسر وأستاذه أن الفشل في تجربة واحدة لا يعني نهاية الطريق بل بداية التحدي والنجاح.',
      'يميز بين أقسام الكلام الثلاثة: الاسم، الفعل، والحرف.',
    ],
    readingText: `«أنا أستطيع، هذه العبارة التي كنت أقولها لنفسي حين يواجهني شيء لا أقدر عليه أو حين يضيع مني الأمل».
بهذه الكلمات بدأ آسر حديثه بعد حصوله على تقدير ضعيف في اختبار مادة اللغة العربية. شعر بالخجل والإحباط، وظن أن كل زملائه يتحدثون عن خيبته. لكن معلم اللغة العربية الرائع وقف بجواره قائلاً: "يا آسر، إن الخطأ خطوة في طريق التعلم، ومن لا يخطئ لا يتعلم أبداً".
وفي مسابقة تصميم مجلة الحائط، اختار المعلم آسر ليكون قائداً لمجموعته! اندهش آسر، لكن صديقه الوفي حسن ذكره بقصة الحصان الذي وقع في الحفرة وظن صاحبه أنه سيموت، فرمى عليه التراب ليدفنه، لكن الحصان كلما نزل عليه التراب نفضه عن ظهره وصعد خطوة إلى الأعلى حتى نجا!
تفانى آسر مع فريقه في تقسيم المهام، ورسموا وكتبوا أروع مجلة مدرسية وفازوا بالمركز الأول في المدرسة كلها! هنا قال المعلم: "أرأيتم؟ الفشل مجرد خطوة أولى نحو النجاح الباهر لمن يمتلك العزيمة!".`,
    vocabulary: [
      { word: 'الإحباط', definition: 'الشعور باليأس وخيبة الأمل وفقدان الحماس.' },
      { word: 'العزيمة', definition: 'الإرادة القوية والتصميم الصلب على تحقيق الهدف.' },
      { word: 'تفانى', definition: 'بذل أقصى جهده وطاقته بإخلاص وحب.' },
    ],
    exercises: [
      {
        type: 'multiple_choice',
        question: 'كانت العبارة الملهمة التي يسترجع بها آسر ثقته بنفسه هي:',
        options: ['«أنا أستطيع»', '«سأستسلم»', '«الأمر مستحيل»', '«لا فائدة»'],
        expectedAnswer: '«أنا أستطيع»',
        page: 9,
      },
      {
        type: 'multiple_choice',
        question: 'فازت مجموعة آسر بالمركز الأول في مسابقة المدرسة بفضل:',
        options: ['التعاون وحسن تقسيم الأدوار والعزيمة القوية', 'الاعتماد على شخص واحد', 'التسرع', 'عدم التخطيط'],
        expectedAnswer: 'التعاون وحسن تقسيم الأدوار والعزيمة القوية',
        page: 10,
      },
    ],
    concepts: [
      {
        id: 'off_ar_u1_l1_c1',
        conceptNumber: 1,
        titleAr: 'الثقة بالنفس وتحويل الصعاب إلى نجاح',
        titleEn: 'Self-Confidence & Growth Mindset',
        sourceText: 'الفشل ليس نهاية المطاف بل هو بداية تجربة جديدة تصنع بطلاً لا يستسلم.',
        keyPoints: [
          'الاعتراف بالخطأ والتعلم منه شجاعة.',
          'العمل الجماعي وتقسيم المهام يضاعف النجاح.',
        ],
        dailyLifeExampleAr: 'عندما تخطئين في مسألة رياضيات، تمسحين الحل وتراجعين الخطوات بهدوء حتى تصلي للجواب الصحيح.',
        dailyLifeExampleEn: 'Reviewing a math mistake patiently to understand the correct formula.',
        storyAnalogyAr: 'مثل الطفل الصغير وهو يتعلم المشي؛ يسقط عشرات المرات ويضحك ثم يقف مجدداً حتى يجري كالغزال!',
        storyAnalogyEn: 'Like a toddler learning to walk: stumbling many times only to stand up stronger and run.',
        prerequisiteAr: 'الاستماع الجيد والتعبير بالرأي.',
        prerequisiteEn: 'Attentive listening.',
        visualType: 'concept_map',
      },
    ],
  },
  {
    id: 'off_ar_u1_l2',
    subjectId: 'subj_arabic',
    subjectNameAr: 'اللغة العربية',
    subjectNameEn: 'Arabic Language',
    unitNumber: 1,
    unitNameAr: 'الوحدة الأولى: أكتشف ذاتي وتراثي',
    unitNameEn: 'Unit 1: Discovering Identity & Heritage',
    lessonNumber: 2,
    titleAr: 'نص القراءة: «لم أوت ماء النهر»',
    titleEn: 'Reading Text: "I Have Not Polluted the River Water"',
    originTag: 'official',
    isAvailable: true,
    sourceRef: {
      book: 'كتاب اللغة العربية — تواصل — الصف الخامس الابتدائي — الفصل الدراسي الأول',
      bookAr: 'اللغة العربية — تواصل ص. 12-15',
      bookEn: 'Arabic Ministry Book pp. 12-15',
      grade: 'الصف الخامس',
      term: 'الفصل الدراسي الأول',
      unit: 'الوحدة الأولى',
      lesson: 'الدرس الثاني: نص القراءة',
      page: 12,
      isAvailable: true,
    },
    objectives: [
      'يتعرف المتعلم اعتزاز المصري القديم بنهر النيل كشريان للحياة والحضارة.',
      'يستنتج معاني المفردات الجديدة من السياق اللغوي للنص (أوت، أدنّس، ترشيد، شريان).',
      'يحدد مظاهر الحفاظ على مياه النيل قديماً وحديثاً لمنع التلوث والإهدار.',
      'يشرح المفهوم بأسلوبه الخاص تعبيراً عن التزامه الشخصي بحماية البيئة.',
    ],
    readingText: `كان المصري القديم يدرك أن نهر النيل هو هبة الخالق ومصدر الحياة والخير على أرض مصر، ولذلك كان يحرص كل الحرص على طهارته ونقائه.
في برديات المحاكمة الأخلاقية القديمة، كان المتوفى يقف أمام محكمة العدالة مقسماً بكل فخر واعتزاز: «لم أوت ماء النهر، ولم أحرم الماشية من عشبها، ولم أمنع النهر أن يجري في موسمه». وكلمة (لم أوت) تعني في نصوصهم القديمة: لم أدنّس ولم ألوّث مياهه أبداً بإلقاء القاذورات أو تعكير صفوه.
واليوم، ونحن نعيش في عصر النهضة والبناء، يبقى واجبنا الوطني والأخلاقي أن نقتدي بأجدادنا العظماء؛ فنحافظ على كل قطرة ماء ونرشد استخدامها، ونمنع إلقاء المخلفات الصناعية أو الزراعية في مجرى النيل الخالد، ليبقى شرياناً متدفقاً بالحياة لأبناء مصر جيلًا بعد جيل.`,
    vocabulary: [
      { word: 'لم أوت', definition: 'لم أدنّس، ولم ألوّث، ولم أفسد طهارة ماء النهر.' },
      { word: 'ألوّث', definition: 'أجعل الشيء غير نظيف أو ضاراً بالصحة والبيئة.' },
      { word: 'شريان', definition: 'المجرى الأساسي لتدفق الدم، والمقصود هنا: مصدر الحياة الرئيس لمصر.' },
      { word: 'ترشيد', definition: 'حسن الاستخدام والاقتصاد دون إسراف أو إهدار.' },
    ],
    exercises: [
      {
        type: 'multiple_choice',
        question: 'معنى كلمة (لم أوت) في النص القديم هو:',
        options: ['لم أدنّس وألوّث', 'لم أشرب', 'لم أسبح', 'لم أصطد'],
        expectedAnswer: 'لم أدنّس وألوّث',
        page: 14,
      },
      {
        type: 'multiple_choice',
        question: 'وصف النص نهر النيل بأنه «شريان الحياة» في مصر لأن:',
        options: ['لولاه لما قامت الزراعة والحضارة وعاش الإنسان في مصر', 'لأنه نهر عريض', 'لأنه يصب في البحر المتوسط', 'لكثرة الأسماك فيه'],
        expectedAnswer: 'لولاه لما قامت الزراعة والحضارة وعاش الإنسان في مصر',
        page: 14,
      },
    ],
    concepts: [
      {
        id: 'off_ar_u1_l2_c1',
        conceptNumber: 1,
        titleAr: 'قدسية النيل وواجب الترشيد الوطني',
        titleEn: 'Sacred Nile & Civic Conservation',
        sourceText: 'حماية ماء النيل سلوك مصري أصيل ممتد من الفراعنة حتى اليوم.',
        keyPoints: [
          'الاعتزاز بنهر النيل كسر وجود مصر ونهضتها.',
          'الترشيد مسؤولية فردية تبدأ من صنبور البيت والمدرسة.',
        ],
        dailyLifeExampleAr: 'غلق الصنبور تماماً أثناء تنظيف الأسنان بالفرشاة وعدم ترك خراطيم المياه مفتوحة في الشوارع.',
        dailyLifeExampleEn: 'Closing taps tightly and avoiding running water while brushing.',
        storyAnalogyAr: 'لو كان في بيتك بئر ماء عذب يشرب منه أهلك، هل تسمحين بتلويثه؟ النيل بئر مصر العظيم.',
        storyAnalogyEn: 'The Nile is Egypt’s single grand well of life.',
        prerequisiteAr: 'معرفة جغرافيا نهر النيل.',
        prerequisiteEn: 'Basic knowledge of the Nile River.',
        visualType: 'concept_map',
      },
    ],
  },
  {
    id: 'off_ar_u1_l3_grammar_nominal',
    subjectId: 'subj_arabic',
    subjectNameAr: 'اللغة العربية',
    subjectNameEn: 'Arabic Language',
    unitNumber: 1,
    unitNameAr: 'الوحدة الأولى: أكتشف ذاتي وتراثي',
    unitNameEn: 'Unit 1: Discovering Identity & Heritage',
    lessonNumber: 3,
    titleAr: 'القواعد النحوية: الجملة الاسمية وركناها (المبتدأ والخبر)',
    titleEn: 'Arabic Grammar: The Nominal Sentence (Subject & Predicate)',
    originTag: 'official',
    isAvailable: true,
    sourceRef: {
      book: 'كتاب اللغة العربية — تواصل — الصف الخامس الابتدائي — الفصل الدراسي الأول',
      bookAr: 'اللغة العربية — تواصل ص. 24-28',
      bookEn: 'Arabic Ministry Book pp. 24-28',
      grade: 'الصف الخامس',
      term: 'الفصل الدراسي الأول',
      unit: 'الوحدة الأولى',
      lesson: 'الدرس الثالث: القواعد النحوية',
      page: 24,
      isAvailable: true,
    },
    objectives: [
      'يميز الجملة الاسمية التي تبدأ باسم وتتكون من ركنين أساسيين: المبتدأ والخبر.',
      'يحدد علامات رفع المبتدأ والخبر: الضمة (للمفرد وجمع التكسير وجمع المؤنث السالم)، والألف (للمثنى)، والواو (لجمع المذكر السالم).',
      'يضبط أواخر الكلمات ضبطاً إعرابياً صحيحاً في الحديث والكتابة.',
    ],
    readingText: `الجملة في لغتنا العربية الجميلة نوعان:
1. الجملة الاسمية: هي الجملة التي تبدأ باسم، ولها ركنان أساسيان لا تستغني عنهما:
   - المبتدأ: الاسم الذي نبدأ به الجملة وتدور حوله الفكرة.
   - الخبر: الكلمة التي تتمم معنى الجملة الاسمية مع المبتدأ ويحسن السكوت عليها.
حكمهما الإعرابي: المبتدأ والخبر مرفوعان دائماً!
علامات الرفع:
- الضمة: إذا كان مفرداً (النيلُ عذبٌ)، أو جمع تكسير (العلماءُ أذكياءُ)، أو جمع مؤنث سالماً (المعلماتُ ماهراتٌ).
- الألف: إذا كان مثنى (الطالبانِ مجتهدانِ).
- الواو: إذا كان جمع مذكر سالماً (المعلمونَ مخلصونَ).`,
    vocabulary: [
      { word: 'المبتدأ', definition: 'الاسم المرفوع الذي يقع في صدر الجملة الاسمية ويبتدأ به الكلام.' },
      { word: 'الخبر', definition: 'الجزء الذي يتمم مع المبتدأ معنى مفيداً يكتمل به الكلام.' },
      { word: 'الرفع بالواو', definition: 'علامة فرعية لرفع المبتدأ والخبر عندما يكون كل منهما جمع مذكر سالماً.' },
    ],
    exercises: [
      {
        type: 'multiple_choice',
        question: 'في جملة «النيلُ شريانُ الحياة»، الكلمة التي تعرب مبتدأ مرفوعاً بالضمة هي:',
        options: ['النيلُ', 'شريانُ', 'الحياة', 'لا يوجد مبتدأ'],
        expectedAnswer: 'النيلُ',
        page: 26,
      },
      {
        type: 'multiple_choice',
        question: 'علامة رفع المبتدأ والخبر في جملة «المعلمونَ مخلصونَ» هي:',
        options: ['الواو لأنه جمع مذكر سالم', 'الضمة', 'الألف', 'الياء'],
        expectedAnswer: 'الواو لأنه جمع مذكر سالم',
        page: 27,
      },
    ],
    concepts: [
      {
        id: 'off_ar_u1_l3_c1',
        conceptNumber: 1,
        titleAr: 'أركان الجملة الاسمية وعلامات الرفع',
        titleEn: 'Nominal Sentence Elements & Case Endings',
        sourceText: 'المبتدأ والخبر توأمان مرفوعان دائماً بالضمة أو الألف أو الواو.',
        keyPoints: [
          'المبتدأ هو البداية والخبر هو تمام الفائدة.',
          'الضمة للأصل (المفرد والجموع)، الألف للمثنى، الواو للمذكر السالم.',
        ],
        dailyLifeExampleAr: 'قولك لأمك: "الشمسُ مشرقةٌ"، أو "الطعامُ لذيذٌ"، كلاهما جملة اسمية كاملة الأركان.',
        dailyLifeExampleEn: '"The sun is bright" is a complete nominal sentence: subject and predicate.',
        storyAnalogyAr: 'المبتدأ والخبر مثل الصديقين المخلصين؛ الأول يدخل الغرفة والثاني يخبرنا ماذا يفعل!',
        storyAnalogyEn: 'Subject and predicate are best friends: one introduces the topic, the other tells what happened.',
        prerequisiteAr: 'التمييز بين الاسم والفعل.',
        prerequisiteEn: 'Noun vs verb identification.',
        visualType: 'comparison_table',
      },
    ],
  },
  {
    id: 'off_ar_u2_l1_real_beauty',
    subjectId: 'subj_arabic',
    subjectNameAr: 'اللغة العربية',
    subjectNameEn: 'Arabic Language',
    unitNumber: 2,
    unitNameAr: 'الوحدة الثانية: علاقاتي مع الآخرين',
    unitNameEn: 'Unit 2: Relationships with Others',
    lessonNumber: 1,
    titleAr: 'النص المعلوماتي: «الجمال الحقيقي»',
    titleEn: 'Informational Text: "True Beauty"',
    originTag: 'official',
    isAvailable: true,
    sourceRef: {
      book: 'كتاب اللغة العربية — تواصل — الصف الخامس الابتدائي — الفصل الدراسي الأول',
      bookAr: 'اللغة العربية — تواصل ص. 34-40',
      bookEn: 'Arabic Ministry Book pp. 34-40',
      grade: 'الصف الخامس',
      term: 'الفصل الدراسي الأول',
      unit: 'الوحدة الثانية',
      lesson: 'الدرس الأول: الجمال الحقيقي',
      page: 34,
      isAvailable: true,
    },
    objectives: [
      'يتعرف مفهوم الجمال الداخلي القائم على الأخلاق والروح الطيبة ومساعدة الآخرين.',
      'يقارن بين الجمال الشكلي الزائل وجمال العقل والروح والعطاء الدائم.',
      'يكتسب معاني المفردات الجديدة: (الأخّاذ، السمات، الجوهر، ينبع).',
    ],
    readingText: `قد يعتقد بعض الناس أن الجمال يقتصر على المظهر الخارجي؛ كملامح الوجه ولون العيون وارتداء أحدث الملابس، لكن الدراسات الإنسانية تؤكد أن "الجمال الحقيقي" ينبع من داخل الإنسان!
جمال الجوهر:
- جمال الروح: الابتسامة الصادقة التي تبعث الطمأنينة في قلوب الآخرين.
- جمال الأخلاق: الصدق، والأمانة، وإغاثة المحتاج، واحترام الكبير، والعطف على الصغير.
- جمال العقل: التفكير الحكيم، والشغف بالقراءة والتعلم، وحل المشكلات بحكمة ورزانة.
إن المظهر الخارجي قد يتغير بمرور السنين، أما طيب الأخلاق وجمال الأفعال فيبقى خالداً في ذاكرة القلوب والعقول لا يمحوه الزمان أبداً.`,
    vocabulary: [
      { word: 'الجوهر', definition: 'حقيقة الشيء وأصله وأعماقه الداخلية.' },
      { word: 'ينبع', definition: 'يصدر ويتدفق من الأعماق.' },
      { word: 'الأخّاذ', definition: 'الآسر الذي يشد الانتباه بروعته ونقائه.' },
    ],
    exercises: [
      {
        type: 'multiple_choice',
        question: 'وفقاً للنص المعلوماتي، فإن الجمال الحقيقي الذي يدوم طويلاً هو:',
        options: ['جمال الأخلاق والروح والعقل الداخلي', 'ارتداء الملابس الغالية فقط', 'لون العيون', 'المظهر الخارجي الزائل'],
        expectedAnswer: 'جمال الأخلاق والروح والعقل الداخلي',
        page: 38,
      },
    ],
    concepts: [
      {
        id: 'off_ar_u2_l1_c1',
        conceptNumber: 1,
        titleAr: 'الجمال الداخلي وقيمة الأخلاق والعطاء',
        titleEn: 'Inner Beauty & Moral Excellence',
        sourceText: 'الجمال الحقيقي ينبع من الداخل بالأخلاق والابتسامة ونفع الناس.',
        keyPoints: [
          'الجوهر أهم من المظهر الزائل.',
          'العطاء والتعامل بلطف يزرعان المحبة الحقيقية.',
        ],
        dailyLifeExampleAr: 'مساعدة زميلتك في فهم درس صعب بابتسامة وصبر؛ هذا هو قمة الجمال الحقيقي.',
        dailyLifeExampleEn: 'Helping a classmate understand a difficult concept with kindness and patience.',
        storyAnalogyAr: 'مثل العطر الثمين؛ زجاجته قد تكون بسيطة، لكن رائحته تملأ المكان بهجة وانتعاشاً.',
        storyAnalogyEn: 'Like precious perfume: the bottle may be modest, but its fragrance enchants everyone.',
        prerequisiteAr: 'قراءة النصوص واستنتاج المعاني.',
        prerequisiteEn: 'Reading comprehension.',
        visualType: 'concept_map',
      },
    ],
  },
  {
    id: 'off_ar_u3_l1_dr_magdi_yacoub',
    subjectId: 'subj_arabic',
    subjectNameAr: 'اللغة العربية',
    subjectNameEn: 'Arabic Language',
    unitNumber: 3,
    unitNameAr: 'الوحدة الثالثة: عاداتي وهواياتي',
    unitNameEn: 'Unit 3: Habits & Inspirations',
    lessonNumber: 1,
    titleAr: 'نص الاستماع: «حوار مع د. مجدي يعقوب»',
    titleEn: 'Listening Text: "Interview with Dr. Magdi Yacoub"',
    originTag: 'official',
    isAvailable: true,
    sourceRef: {
      book: 'كتاب اللغة العربية — تواصل — الصف الخامس الابتدائي — الفصل الدراسي الأول',
      bookAr: 'اللغة العربية — تواصل ص. 52-58',
      bookEn: 'Arabic Ministry Book pp. 52-58',
      grade: 'الصف الخامس',
      term: 'الفصل الدراسي الأول',
      unit: 'الوحدة الثالثة',
      lesson: 'الدرس الأول: حوار مع د. مجدي يعقوب',
      page: 52,
      isAvailable: true,
    },
    objectives: [
      'يتعرف السيرة الملهمة للجراح العالمي د. مجدي يعقوب مؤسس مركز أسوان لجراحة القلب.',
      'يستخلص قيمة الانتماء للوطن ورد الجميل لمصر وخدمة الأطفال والفقراء بالمجان.',
      'يتعلم آداب الحوار الصحفي وطرح الأسئلة الذكية.',
    ],
    readingText: `هو جراح القلوب المصري العالمي البروفيسور د. مجدي يعقوب، الذي ولد في محافظة الشرقية وعاش طفولته يتنقل بين مدن مصر الجميلة.
قرر دراسة جراحة القلب بعد وفاة عمته الصغرى وهي في ريعان شبابها بسبب مرض في صمامات القلب، فعاهد نفسه أن يصبح جراحاً لإنقاذ أرواح الأطفال والمرضى.
بعد مسيرة عالمية حافلة في كبرى مستشفيات إنجلترا، قرر العودة إلى مصر وتأسيس "مركز أسوان لجراحة وأبحاث القلب" بالمجان تماماً.
وعندما سُئل في الحوار: "لماذا اخترت أسوان بالذات؟"، أجاب بابتسامة: "أسوان مركز الهدوء والجمال والصفاء، وأهلها طيبون وأوفياء، وشعرت أن لي ديناً كبيراً تجاه وطني مصر يجب أن أرده، وأسعد لحظات حياتي هي أن أرى طفلاً مريضاً يبتسم وتعود له الحياة!".`,
    vocabulary: [
      { word: 'رد الجميل', definition: 'الوفاء والاعتراف بفضل الوطن ومساعدة أهله.' },
      { word: 'حافلة', definition: 'مليئة بالإنجازات والنجاحات والخير.' },
      { word: 'السكينة', definition: 'الهدوء والطمأنينة وراحة البال.' },
    ],
    exercises: [
      {
        type: 'multiple_choice',
        question: 'اختار د. مجدي يعقوب مدينة أسوان لتأسيس مركز جراحة القلب لأنها:',
        options: ['مركز الهدوء والجمال وتاريخ مصر العريق', 'بها مطار فقط', 'قريبة من البحر المتوسط', 'فيها مستشفيات كثيرة'],
        expectedAnswer: 'مركز الهدوء والجمال وتاريخ مصر العريق',
        page: 56,
      },
    ],
    concepts: [
      {
        id: 'off_ar_u3_l1_c1',
        conceptNumber: 1,
        titleAr: 'الانتماء الوطني وخدمة المجتمع والإنسانية',
        titleEn: 'Patriotism & Humanitarian Service',
        sourceText: 'رد الجميل للوطن وإسعاد المرضى أعظم رسالة يقدمها العالم المخلص.',
        keyPoints: [
          'النجاح في الخارج دافع لخدمة الوطن الأم مصر.',
          'الطب رسالة إنسانية نبيلة هدفها التخفيف عن المتألمين.',
        ],
        dailyLifeExampleAr: 'التفوق في دراستك حتى تصبحي طبيبة أو مهندسة تبتكرين حلولاً تفيد أطفال مصر ومستقبلها.',
        dailyLifeExampleEn: 'Excelling in school to become a skilled professional serving your community.',
        storyAnalogyAr: 'مثل الشجرة التي تثمر فواكه حلوة في حديقة بيتها الذي رعاها وسقاها منذ كانت بذرة صغيرة.',
        storyAnalogyEn: 'Like a tree yielding sweet fruit in the very orchard that nurtured its initial sapling.',
        prerequisiteAr: 'الاستماع والمناقشة.',
        prerequisiteEn: 'Listening and discussing.',
        visualType: 'concept_map',
      },
    ],
  },
];
