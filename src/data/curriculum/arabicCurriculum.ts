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
        misconceptions: [
          {
            id: 'mis_ar_ar_confidence_giveup',
            trigger: '«سأستسلم»',
            explanation: 'ظننتِ أن رسالة القصة هي الاستسلام والتراجع عند أول صعوبة.',
            remediation: 'العبارة التي يسترجع بها آسر ثقته هي «أنا أستطيع»؛ فالثقة بالنفس تدفعه للمحاولة من جديد لا للاستسلام.',
          },
          {
            id: 'mis_ar_ar_confidence_impossible',
            trigger: '«الأمر مستحيل»',
            explanation: 'ظننتِ أن الموقف يائس وأن الأمر مستحيل.',
            remediation: '«الأمر مستحيل» نقيض الرسالة؛ الإصرار والعمل الجماعي يحوّلان ما يبدو مستحيلاً إلى ممكن.',
          },
          {
            id: 'mis_ar_ar_confidence_useless',
            trigger: '«لا فائدة»',
            explanation: 'ظننتِ أن المحاولة بلا فائدة.',
            remediation: '«لا فائدة» ضد التفاؤل؛ العبارة الصحيحة «أنا أستطيع» تزرع الأمل وتدفع للعمل والمثابرة.',
          },
          {
            id: 'mis_ar_ar_confidence_oneperson',
            trigger: 'الاعتماد على شخص واحد',
            explanation: 'ظننتِ أن الفوز جاء من جهد شخص واحد فقط.',
            remediation: 'المجموعة فازت بالتعاون وحسن تقسيم الأدوار، لا بالاعتماد على فرد واحد.',
          },
          {
            id: 'mis_ar_ar_confidence_haste',
            trigger: 'التسرع',
            explanation: 'ظننتِ أن التسرع هو سبب الفوز.',
            remediation: 'التسرع يوقع في الأخطاء؛ النجاح يحتاج تخطيطاً وتعاوناً وتقسيم مهام.',
          },
          {
            id: 'mis_ar_ar_confidence_noplan',
            trigger: 'عدم التخطيط',
            explanation: 'ظننتِ أن النجاح يحصل من غير تخطيط.',
            remediation: 'التخطيط وتوزيع المهام هو ما قاد المجموعة إلى المركز الأول.',
          },
        ],
        distractors: [
          '«سأستسلم»|mis_ar_ar_confidence_giveup',
          '«الأمر مستحيل»|mis_ar_ar_confidence_impossible',
          '«لا فائدة»|mis_ar_ar_confidence_useless',
          'الاعتماد على شخص واحد|mis_ar_ar_confidence_oneperson',
          'التسرع|mis_ar_ar_confidence_haste',
          'عدم التخطيط|mis_ar_ar_confidence_noplan',
        ],
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
        misconceptions: [
          {
            id: 'mis_ar_ar_nile_drink',
            trigger: 'لم أشرب',
            explanation: 'ظننتِ أن «لم أوت» تعني لم أشرب.',
            remediation: '«لم أوت» فعل قديم معناه لم أدنّس ولم ألوّث، لا لم أشرب.',
          },
          {
            id: 'mis_ar_ar_nile_swim',
            trigger: 'لم أسبح',
            explanation: 'ظننتِ أن «لم أوت» تعني لم أسبح.',
            remediation: '«لم أوت» لا تعني السباحة، بل تعني عدم التدنيس والتلويث.',
          },
          {
            id: 'mis_ar_ar_nile_hunt',
            trigger: 'لم أصطد',
            explanation: 'ظننتِ أن «لم أوت» تعني لم أصطد.',
            remediation: '«لم أوت» تعني لم أدنّس وألوّث، وهي معنى القدسية لا الصيد.',
          },
          {
            id: 'mis_ar_ar_nile_wide',
            trigger: 'لأنه نهر عريض',
            explanation: 'ظننتِ أن وصف النيل بـ«شريان الحياة» سببه أنه نهر عريض.',
            remediation: 'لولاه لما قامت الزراعة والحضارة وعاش الإنسان في مصر؛ فهو شريان الحياة لِما يعطيه لا لِاتساعه.',
          },
          {
            id: 'mis_ar_ar_nile_sea',
            trigger: 'لأنه يصب في البحر المتوسط',
            explanation: 'ظننتِ أن مصب النيل في البحر المتوسط هو سبب وصفه بشريان الحياة.',
            remediation: 'المصب ليس السبب؛ قيمته في الزراعة والحضارة وحياة الإنسان في مصر.',
          },
          {
            id: 'mis_ar_ar_nile_fish',
            trigger: 'لكثرة الأسماك فيه',
            explanation: 'ظننتِ أن كثرة الأسماك هي سبب وصف النيل بشريان الحياة.',
            remediation: 'السبب أعم : الماء العذب الذي أقام الزراعة والحضارة وأطعم الإنسان.',
          },
        ],
        distractors: [
          'لم أشرب|mis_ar_ar_nile_drink',
          'لم أسبح|mis_ar_ar_nile_swim',
          'لم أصطد|mis_ar_ar_nile_hunt',
          'لأنه نهر عريض|mis_ar_ar_nile_wide',
          'لأنه يصب في البحر المتوسط|mis_ar_ar_nile_sea',
          'لكثرة الأسماك فيه|mis_ar_ar_nile_fish',
        ],
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
        misconceptions: [
          {
            id: 'mis_ar_ar_grammar_khabar',
            trigger: 'شريانُ',
            explanation: 'ظننتِ أن «شريانُ» هو المبتدأ.',
            remediation: 'المبتدأ هو الاسم الذي نبدأ به الكلام ونتحدث عنه هنا «النيلُ»، و«شريانُ» خبره.',
          },
          {
            id: 'mis_ar_ar_grammar_word',
            trigger: 'الحياة',
            explanation: 'ظننتِ أن «الحياة» هي المبتدأ.',
            remediation: '«الحياة» مضاف إليه مجرور، والمبتدأ المرفوع هو «النيلُ».',
          },
          {
            id: 'mis_ar_ar_grammar_none',
            trigger: 'لا يوجد مبتدأ',
            explanation: 'ظننتِ أن الجملة بلا مبتدأ.',
            remediation: 'الجملة الاسمية تبدأ باسم؛ ومبتدأها «النيلُ» مرفوع وعلامته الضمة.',
          },
          {
            id: 'mis_ar_ar_grammar_damma',
            trigger: 'الضمة',
            explanation: 'ظننتِ أن علامة الرفع في «المعلمونَ مخلصونَ» هي الضمة.',
            remediation: 'هذا جمع مذكر سالم، ويُرفع بالواو لا بالضمة.',
          },
          {
            id: 'mis_ar_ar_grammar_alif',
            trigger: 'الألف',
            explanation: 'ظننتِ أن الرفع يكون بالألف.',
            remediation: 'الجمع المذكر السالم يُرفع بالواو، وليس بالألف.',
          },
          {
            id: 'mis_ar_ar_grammar_ya',
            trigger: 'الياء',
            explanation: 'ظننتِ أن الرفع يكون بالياء.',
            remediation: 'الياء علامة النصب والجر في الجمع، أما الرفع فبالواو.',
          },
        ],
        distractors: [
          'شريانُ|mis_ar_ar_grammar_khabar',
          'الحياة|mis_ar_ar_grammar_word',
          'لا يوجد مبتدأ|mis_ar_ar_grammar_none',
          'الضمة|mis_ar_ar_grammar_damma',
          'الألف|mis_ar_ar_grammar_alif',
          'الياء|mis_ar_ar_grammar_ya',
        ],
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
        misconceptions: [
          {
            id: 'mis_ar_ar_beauty_clothes',
            trigger: 'ارتداء الملابس الغالية فقط',
            explanation: 'ظننتِ أن الجمال الحقيقي هو الملبس الغالي.',
            remediation: 'النص يقول إن الجمال الدائم هو جمال الأخلاق والروح والعقل، لا ثمن الملابس.',
          },
          {
            id: 'mis_ar_ar_beauty_eyes',
            trigger: 'لون العيون',
            explanation: 'ظننتِ أن الجمال الحقيقي هو لون العيون.',
            remediation: 'لون العيون مظهر خارجي لا يدوم؛ الجمال الحقيقي داخلي في الأخلاق والعقل.',
          },
          {
            id: 'mis_ar_ar_beauty_outer',
            trigger: 'المظهر الخارجي الزائل',
            explanation: 'ظننتِ أن المظهر الخارجي هو الجمال الذي يدوم.',
            remediation: 'النص يسمّيه زائلاً؛ الذي يدوم هو جمال الأخلاق والروح والعقل.',
          },
        ],
        distractors: [
          'ارتداء الملابس الغالية فقط|mis_ar_ar_beauty_clothes',
          'لون العيون|mis_ar_ar_beauty_eyes',
          'المظهر الخارجي الزائل|mis_ar_ar_beauty_outer',
        ],
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
        misconceptions: [
          {
            id: 'mis_ar_ar_magdi_airport',
            trigger: 'بها مطار فقط',
            explanation: 'ظننتِ أن د. مجدي يعقوب اختار أسوان لأن بها مطاراً فقط.',
            remediation: 'السبب هو أن أسوان مركز الهدوء والجمال وتاريخ مصر العريق، لا مجرد وجود مطار.',
          },
          {
            id: 'mis_ar_ar_magdi_sea',
            trigger: 'قريبة من البحر المتوسط',
            explanation: 'ظننتِ أن أسوان اختيرت لقربها من البحر المتوسط.',
            remediation: 'أسوان مدينة في أقصى الصعيد وتشتهر بهدوائها وجمالها وتاريخها العريق؛ القرب من البحر ليس السبب.',
          },
          {
            id: 'mis_ar_ar_magdi_hospitals',
            trigger: 'فيها مستشفيات كثيرة',
            explanation: 'ظننتِ أن أسوان اختيرت لأن بها مستشفيات كثيرة.',
            remediation: 'د. مجدي يعقوب هو من أنشأ المركز؛ والسبب في اختيار أسوان هدوؤها وجمالها وتاريخها.',
          },
        ],
        distractors: [
          'بها مطار فقط|mis_ar_ar_magdi_airport',
          'قريبة من البحر المتوسط|mis_ar_ar_magdi_sea',
          'فيها مستشفيات كثيرة|mis_ar_ar_magdi_hospitals',
        ],
        visualType: 'concept_map',
      },
    ],
  },
];

/**
 * Verified 2026/2027 Term 1 gaps. Lesson titles are taken from the current
 * curriculum outline; explanations and exercises are Miss Noor-authored.
 * المفعول المطلق والاسم المجرور are Term 2 topics in the available 2025/2026
 * sources, so they are intentionally not mislabeled as 2026/2027 Term 1.
 */
type ArabicGapSpec = {
 id:string; unitNumber:number; unitNameAr:string; unitNameEn:string;
 lessonNumber:number; titleAr:string; titleEn:string; lessonLabel:string;
 objectives:string[]; readingText:string; vocabulary:{word:string;definition:string}[];
 questions:{question:string;options:string[];answer:string}[];
 keyPoints:string[]; exampleAr:string; exampleEn:string; analogyAr:string; analogyEn:string; correction:string;
};
function makeArabicGapLesson(spec:ArabicGapSpec):OfficialCurriculumLesson {
 const wrong=spec.questions.flatMap((q,qi)=>q.options.filter(o=>o!==q.answer).map((option,wi)=>({
  id:spec.id+'_mis_'+(qi+1)+'_'+(wi+1),trigger:option,
  explanation:'اختيار «'+option+'» لا يحقق القاعدة أو الغرض المطلوب في السؤال.',
  remediation:'بصي يا بطلة، '+spec.correction,
 })));
 return {
  id:spec.id,subjectId:'subj_arabic',subjectNameAr:'اللغة العربية',subjectNameEn:'Arabic Language',
  unitNumber:spec.unitNumber,unitNameAr:spec.unitNameAr,unitNameEn:spec.unitNameEn,
  lessonNumber:spec.lessonNumber,titleAr:spec.titleAr,titleEn:spec.titleEn,
  originTag:'official',isAvailable:true,
  sourceRef:{
   book:'كتاب اللغة العربية — الصف الخامس الابتدائي — الفصل الدراسي الأول 2026/2027',
   bookAr:'اللغة العربية — كتاب الوزارة — الفصل الدراسي الأول',
   bookEn:'Arabic Ministry Student Book — Grade 5 — Term 1',
   grade:'الصف الخامس',term:'الفصل الدراسي الأول 2026/2027',
   unit:spec.unitNameAr,lesson:spec.lessonLabel,
   page:'غير محدد في الفهرس المفتوح',isAvailable:true,
  },
  objectives:spec.objectives,readingText:spec.readingText,vocabulary:spec.vocabulary,
  exercises:spec.questions.map(q=>({type:'multiple_choice' as const,question:q.question,options:q.options,expectedAnswer:q.answer})),
  concepts:[{
   id:spec.id+'_c1',conceptNumber:1,titleAr:spec.titleAr,titleEn:spec.titleEn,
   sourceText:spec.readingText,keyPoints:spec.keyPoints,
   dailyLifeExampleAr:spec.exampleAr,dailyLifeExampleEn:spec.exampleEn,
   storyAnalogyAr:spec.analogyAr,storyAnalogyEn:spec.analogyEn,
   prerequisiteAr:'معرفة الجملة الاسمية والفعلية والتمييز بين الاسم والفعل والحرف.',
   prerequisiteEn:'Recognizing nouns, verbs, particles, and basic sentence structure.',
   visualType:'diagram',misconceptions:wrong,
   distractors:wrong.map(m=>m.trigger+'|'+m.id),
  }],
 };
}
const ARABIC_TERM_1_GAP_LESSONS:OfficialCurriculumLesson[]=[
makeArabicGapLesson({
 id:'off_ar_u1_l4_writing_official_letter',unitNumber:1,
 unitNameAr:'الوحدة الأولى: نيلنا أمانة',unitNameEn:'Unit 1: Our Nile Is a Trust',
 lessonNumber:4,titleAr:'التعبير الكتابي: الرسالة الرسمية',
 titleEn:'Writing: The Formal Letter',lessonLabel:'التعبير الكتابي: الرسالة الرسمية',
 objectives:[
 'يحدد عناصر الرسالة الرسمية مثل المرسل إليه والتحية والمقدمة والموضوع والخاتمة والتوقيع.',
 'يرتب أفكاره في فقرات واضحة ويستخدم لغة مهذبة ومناسبة للجهة المرسل إليها.',
 'يكتب رسالة قصيرة يطلب فيها إجراءً يحافظ على نظافة نهر النيل أو البيئة المدرسية.'
 ],
 readingText:"الرسالة الرسمية نص نكتبه إلى جهة أو شخص في موقع مسؤولية لعرض طلب أو اقتراح أو شكوى بأسلوب مهذب وواضح. ويجب أن نحدد الهدف من الرسالة قبل الكتابة حتى تكون الأفكار مرتبة ومباشرة.\n\nتبدأ الرسالة بذكر الجهة المرسل إليها والتحية المناسبة، ثم مقدمة قصيرة توضح سبب الكتابة، يليها الموضوع وفيه التفاصيل والطلب أو الاقتراح. وتنتهي الرسالة بعبارة احترام واسم المرسل وتاريخ الكتابة عند الحاجة.\n\nعند كتابة رسالة عن حماية النيل، يمكن أن نعرض مشكلة إلقاء المخلفات، ونوضح أثرها في الماء والكائنات الحية، ثم نقترح وضع سلال للقمامة وتنظيم حملة توعية. نراجع في النهاية وضوح الأفكار والإملاء وعلامات الترقيم.",
 vocabulary:[
 {word:'المرسل إليه',definition:'الشخص أو الجهة التي نوجه إليها الرسالة.'},
 {word:'المقدمة',definition:'بداية قصيرة توضح سبب كتابة الرسالة.'},
 {word:'الخاتمة',definition:'الجزء الأخير الذي يتضمن الشكر أو التحية الختامية.'}
 ],
 questions:[
 {question:'أي جزء يوضح سبب كتابة الرسالة الرسمية؟',options:['المقدمة','التوقيع فقط','عنوان المرسل إليه فقط','التاريخ وحده'],answer:'المقدمة'},
 {question:'ما الأسلوب الأنسب في رسالة رسمية إلى مسؤول المدرسة؟',options:['لغة مهذبة وواضحة','ألفاظ عامية جارحة','جمل غير مرتبة','أوامر بلا تحية'],answer:'لغة مهذبة وواضحة'}
 ],
 keyPoints:['تتكون الرسالة من عناصر مرتبة تبدأ بالجهة والتحية وتنتهي بالتوقيع.','يجب أن يكون الهدف واضحاً واللغة مهذبة.','تراجع الرسالة للتأكد من ترتيب الأفكار وصحة الكتابة.'],
 exampleAr:'كتابة رسالة إلى إدارة المدرسة لطلب زيادة صناديق القمامة في الفناء.',
 exampleEn:'Writing to the school administration to request more waste bins in the playground.',
 analogyAr:'الرسالة الرسمية مثل طريق له محطات مرتبة؛ إذا نسينا محطة قد لا تصل الفكرة بوضوح.',
 analogyEn:'A formal letter is like a route with ordered stops; missing one can make the message unclear.',
 correction:'ابدئي بالجهة والتحية، ثم اشرحي السبب والطلب، واختمي بالشكر واسمك.'
}),
makeArabicGapLesson({
 id:'off_ar_u3_l2_grammar_causative_object',unitNumber:3,
 unitNameAr:'الوحدة الثالثة: جمال الاختلاف',unitNameEn:'Unit 3: The Beauty of Difference',
 lessonNumber:2,titleAr:'القواعد النحوية: المفعول لأجله',
 titleEn:'Grammar: The Causal Object',lessonLabel:'القواعد النحوية: المفعول لأجله',
 objectives:[
 'يتعرف المفعول لأجله بوصفه اسماً منصوباً يبين سبب حدوث الفعل.',
 'يميز المفعول لأجله من المفعول به والظرف في جمل قصيرة.',
 'يوظف المفعول لأجله في جمل تعبر عن دوافع التعاون واحترام الاختلاف.'
 ],
 readingText:"المفعول لأجله اسم منصوب يذكر في الجملة ليبين سبب حدوث الفعل. نسأل عنه غالباً بكلمة «لماذا؟» أو «لأي سبب؟». ففي جملة «ساعدتُ زميلي احتراماً له» جاءت كلمة «احتراماً» لتوضح سبب المساعدة.\n\nيكون المفعول لأجله مصدراً يدل على معنى قلبي أو دافع للفعل، مثل حباً أو رغبةً أو خوفاً أو تقديراً. ونلاحظ أنه يجيب عن سؤال السبب، وليس عن سؤال «ماذا؟» الذي يساعدنا على معرفة المفعول به.\n\nيمكن أن نقول: «تعاون التلاميذ رغبةً في النجاح» و«نحافظ على البيئة حباً لوطننا». عند الإعراب نقول إن الكلمة التي تبين السبب مفعول لأجله منصوب، ونبحث عن الفعل الذي تفسر سببه.",
 vocabulary:[
 {word:'المفعول لأجله',definition:'مصدر منصوب يبين سبب وقوع الفعل.'},
 {word:'المصدر',definition:'اسم يدل على الحدث دون ارتباط بزمن.'},
 {word:'الدافع',definition:'السبب الذي يشجع الإنسان على القيام بالفعل.'}
 ],
 questions:[
 {question:'في جملة «تعاونتُ مع زملائي رغبةً في النجاح»، ما المفعول لأجله؟',options:['رغبةً','زملائي','تعاونتُ','النجاح'],answer:'رغبةً'},
 {question:'أي جملة تحتوي على مفعول لأجله؟',options:['أحترم الآخرين تقديراً لهم','قرأتُ القصة مساءً','شاهدتُ المباراة','وضعتُ الكتاب على المكتب'],answer:'أحترم الآخرين تقديراً لهم'}
 ],
 keyPoints:['المفعول لأجله يوضح سبب حدوث الفعل.','يكون اسماً منصوباً، وغالباً مصدراً يدل على دافع.','السؤال الذي يساعد على اكتشافه هو: لماذا حدث الفعل؟'],
 exampleAr:'أراجع دروسي رغبةً في التفوق؛ فكلمة رغبةً توضح سبب المراجعة.',
 exampleEn:'I revise my lessons out of a desire to do well; the phrase explains why I revise.',
 analogyAr:'المفعول لأجله مثل بطاقة صغيرة تشرح لماذا بدأ الفعل.',
 analogyEn:'The causal object is like a small label explaining why an action happened.',
 correction:'اسألي «لماذا حدث الفعل؟» وابحثي عن المصدر المنصوب الذي يوضح السبب.'
}),
makeArabicGapLesson({
 id:'off_ar_u3_l3_grammar_time_place_adverbs',unitNumber:3,
 unitNameAr:'الوحدة الثالثة: جمال الاختلاف',unitNameEn:'Unit 3: The Beauty of Difference',
 lessonNumber:3,titleAr:'القواعد النحوية: ظرفا الزمان والمكان',
 titleEn:'Grammar: Adverbs of Time and Place',lessonLabel:'القواعد النحوية: إعراب ظرفي الزمان والمكان',
 objectives:[
 'يميز ظرف الزمان الذي يحدد وقت الفعل من ظرف المكان الذي يحدد موضعه.',
 'يستخرج ظرفي الزمان والمكان من جمل بسيطة ويحدد ما يدل عليه كل منهما.',
 'يوظف ظروفاً مناسبة في جمل تصف أنشطة يومية ومواقف تحترم التنوع.'
 ],
 readingText:"الظرف اسم منصوب يوضح زمان حدوث الفعل أو مكان حدوثه. فإذا أجاب عن سؤال «متى؟» فهو ظرف زمان، مثل: صباحاً أو مساءً أو اليوم. وإذا أجاب عن سؤال «أين؟» فهو ظرف مكان، مثل: أمام أو خلف أو فوق أو تحت.\n\nفي جملة «نلتقي صباحاً» تخبرنا كلمة «صباحاً» بوقت اللقاء، فهي ظرف زمان. وفي جملة «وقفتُ أمام المدرسة» تخبرنا كلمة «أمام» بمكان الوقوف، فهي ظرف مكان.\n\nيساعدنا الظرف على جعل الجملة أكثر دقة؛ فنستطيع أن نحدد متى حدث النشاط وأين وقع. وعند الإعراب نذكر نوع الظرف وعلامة نصبه، مع الانتباه إلى أن بعض الظروف أسماء مبنية في محل نصب.",
 vocabulary:[
 {word:'ظرف الزمان',definition:'اسم يبين وقت حدوث الفعل ويجيب عن سؤال متى.'},
 {word:'ظرف المكان',definition:'اسم يبين مكان حدوث الفعل ويجيب عن سؤال أين.'},
 {word:'منصوب',definition:'حالة إعرابية تظهر غالباً بالفتحة في الاسم المفرد.'}
 ],
 questions:[
 {question:'في جملة «أزور جدتي مساءً»، كلمة «مساءً» تعرب:',options:['ظرف زمان','مفعولاً به','فاعلاً','مبتدأ'],answer:'ظرف زمان'},
 {question:'في جملة «جلستُ تحت الشجرة»، كلمة «تحت» تدل على:',options:['ظرف مكان','مفعول لأجله','اسم مجرور','خبر'],answer:'ظرف مكان'}
 ],
 keyPoints:['ظرف الزمان يجيب عن متى ويحدد وقت الفعل.','ظرف المكان يجيب عن أين ويحدد موضع الفعل.','الظرف منصوب أو في محل نصب بحسب نوعه.'],
 exampleAr:'نلتقي صباحاً في المكتبة؛ صباحاً زمان، وفي المكتبة مكان.',
 exampleEn:'We meet in the library in the morning: the morning is time and the library is place.',
 analogyAr:'ظرف الزمان والمكان مثل دبوسين على خريطة الحدث: واحد يحدد الوقت والآخر يحدد الموقع.',
 analogyEn:'Time and place adverbs are like two pins on an event map: one marks when and the other where.',
 correction:'اسألي «متى؟» للزمان و«أين؟» للمكان، ثم حددي الكلمة التي تجيب عن السؤال.'
})
];
ARABIC_CURRICULUM_LESSONS.push(...ARABIC_TERM_1_GAP_LESSONS);
