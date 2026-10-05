/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { OfficialCurriculumLesson } from '../../types/teachingSession';

/**
 * Official Egyptian Ministry of Education Curriculum for Grade 5 (Term 1)
 * Subject: اللغة الفرنسية (Le Français — 5e Primaire)
 * Textbooks: Le Français en Égypte / Découvrir le Français
 */
export const FRENCH_CURRICULUM_LESSONS: OfficialCurriculumLesson[] = [
  // =========================================================================
  // Unité 1: Bienvenue et se présenter (الوحدة الأولى: مرحباً والتعارف)
  // =========================================================================
  {
    id: 'off_fr_u1_l1_salutations',
    subjectId: 'subj_french',
    subjectNameAr: 'اللغة الفرنسية',
    subjectNameEn: 'French Language',
    subjectNameFr: 'Français',
    unitNumber: 1,
    unitNameAr: 'الوحدة الأولى: مرحباً والتعارف',
    unitNameEn: 'Unit 1: Welcome & Introductions',
    unitNameFr: 'Unité 1: Bienvenue et Salutations',
    lessonNumber: 1,
    titleAr: 'التحيات والتعريف بالنفس',
    titleEn: 'Greetings & Introducing Oneself',
    titleFr: 'Les salutations et se présenter',
    originTag: 'official',
    language: 'fr',
    isAvailable: true,
    contentStatus: 'available',
    sourceRef: {
      book: 'كتاب اللغة الفرنسية — الصف الخامس الابتدائي — الفصل الدراسي الأول',
      bookAr: 'كتاب الوزارة للغة الفرنسية ص. 4-9',
      bookEn: 'Ministry French Book pp. 4-9',
      grade: 'الصف الخامس',
      term: 'الفصل الدراسي الأول',
      unit: 'Unité 1',
      lesson: 'Leçon 1',
      page: 4,
      isAvailable: true,
    },
    objectives: [
      'Saluer poliment selon le moment de la journée (Bonjour, Bonsoir, Bonne nuit).',
      'Se présenter et dire son prénom et son âge (Je m\'appelle Amina, j\'ai 10 ans).',
      'Poser des questions simples de présentation (Comment tu t\'appelles ? Quel âge as-tu ?).',
    ],
    readingText: `Dialogue en classe :
Madame Nour : Bonjour les enfants ! Bienvenue en 5e primaire !
Amina : Bonjour Madame !
Madame Nour : Comment tu t'appelles ?
Amina : Je m'appelle Amina. Je suis égyptienne et j'ai 10 ans.
Madame Nour : Enchantée, Amina ! Et toi, comment tu t'appelles ?
Omar : Moi, c'est Omar. J'ai aussi 10 ans et j'aime beaucoup l'école !
Madame Nour : Très bien les enfants. Ouvrez vos livres à la page 4 s'il vous plaît.`,
    vocabulary: [
      { word: 'Bonjour', definition: 'تحية الصباح وتستخدم للترحيب نهاراً (Good morning / Hello).' },
      { word: 'Je m\'appelle...', definition: 'تعبير لذكر الاسم بمعنى: اسمي أو أدعى... (My name is...).' },
      { word: 'Enchanté(e)', definition: 'تعبير ترحيب بمعنى: فرصة سعيدة أو سررت بلقائك (Pleased to meet you).' },
      { word: 'Comment tu t\'appelles ?', definition: 'سؤال التعارف بمعنى: ما اسمك؟ (What is your name?).' },
    ],
    exercises: [
      {
        type: 'multiple_choice',
        question: 'Pour saluer le matin en français, on dit :',
        options: ['Bonne nuit', 'Bonjour', 'Au revoir', 'Merci'],
        expectedAnswer: 'Bonjour',
        page: 6,
      },
      {
        type: 'fill_blank',
        question: 'Complète : Je __________ Amina.',
        options: ['m\'appelle', 'est', 'as', 'avons'],
        expectedAnswer: 'm\'appelle',
        page: 7,
      },
      {
        type: 'qa',
        question: 'Comment réponds-tu à la question : "Quel âge as-tu ?"',
        expectedAnswer: 'J\'ai 10 ans.',
        page: 8,
      },
    ],
    concepts: [
      {
        id: 'conc_fr_u1_l1_salutations',
        conceptNumber: 1,
        titleAr: 'صيغ التحية والوداع بالفرنسية',
        titleEn: 'French Greetings and Farewells',
        sourceText: 'Bonjour (نهاراً), Bonsoir (مساءً), Salut (بين الأصدقاء), Au revoir (إلى اللقاء), À bientôt (أراك قريباً).',
        keyPoints: [
          'Bonjour تقال نهاراً لكل الناس باحترام.',
          'Salut تقال كتحية غير رسمية بين الأصدقاء والزملاء.',
          'Au revoir تقال عند المغادرة والوداع.',
        ],
        dailyLifeExampleAr: 'عندما تقابل أمينة زملاءها صباحاً في حوش المدرسة تقول: Bonjour ! وعندما تودعهم تقول: Au revoir !',
        dailyLifeExampleEn: 'When Amina meets friends in the morning she says Bonjour, and when leaving she says Au revoir.',
        storyAnalogyAr: 'التحيات مثل مفاتيح القلوب السحرية؛ كل وقت له مفتاحه المناسب.',
        storyAnalogyEn: 'Greetings are like magic keys; each time of day has its own key.',
        prerequisiteAr: 'معرفة حروف الأبجدية الفرنسية ونطقها.',
        prerequisiteEn: 'Basic French alphabet pronunciation.',
      },
      {
        id: 'conc_fr_u1_l1_presentation',
        conceptNumber: 2,
        titleAr: 'فعل يُسمى (S\'appeler) والتقديم الذاتي',
        titleEn: 'Verb S\'appeler and Self Introduction',
        sourceText: 'Je m\'appelle [Nom]. Tu t\'appelles [Nom]. Il / Elle s\'appelle [Nom].',
        keyPoints: [
          'مع الضمير Je نستخدم m\'appelle مع علامة النبرة الصوتية.',
          'مع الضمير Tu نستخدم t\'appelles مع حرف s في النهاية.',
        ],
        dailyLifeExampleAr: 'Je m\'appelle Amina. Tu t\'appelles Omar.',
        dailyLifeExampleEn: 'Je m\'appelle Amina. Tu t\'appelles Omar.',
        storyAnalogyAr: 'جملة "Je m\'appelle" تشبه بطاقتك التعريفية الملونة التي تقدمها للملأ.',
        storyAnalogyEn: 'Je m\'appelle is like presenting your colorful student ID card.',
        prerequisiteAr: 'الضمائر الشخصية (Je, Tu).',
        prerequisiteEn: 'Personal pronouns.',
      },
    ],
    supplementaryResources: [
      {
        id: 'supp_fr_adwaa_1',
        sourceType: 'al_adwaa',
        sourceNameAr: 'سلسلة الأضواء للغة الفرنسية ٥ ابتدائي',
        sourceNameEn: 'Al-Adwaa French Grade 5',
        unit: 'الوحدة الأولى',
        lesson: 'الدرس الأول',
        page: 12,
        notes: 'تدريبات إضافية على النطق والتحيات اليومية مع تسجيلات صوتية مرافقة.',
        isAvailable: true,
      },
      {
        id: 'supp_fr_selah_1',
        sourceType: 'selah_el_telmeez',
        sourceNameAr: 'سلاح التلميذ — الفرنساوي المبسط',
        sourceNameEn: 'Selah El-Telmeez French Primer',
        unit: 'Unité 1',
        lesson: 'Les salutations',
        page: 8,
        notes: 'تمارين وصل وبطاقات مصورة للتحيات.',
        isAvailable: true,
      },
    ],
  },

  {
    id: 'off_fr_u1_l2_famille',
    subjectId: 'subj_french',
    subjectNameAr: 'اللغة الفرنسية',
    subjectNameEn: 'French Language',
    subjectNameFr: 'Français',
    unitNumber: 1,
    unitNameAr: 'الوحدة الأولى: مرحباً والتعارف',
    unitNameEn: 'Unit 1: Welcome & Introductions',
    unitNameFr: 'Unité 1: Bienvenue et Salutations',
    lessonNumber: 2,
    titleAr: 'أفراد عائلتي (Ma famille)',
    titleEn: 'My Family Members',
    titleFr: 'Ma famille et mes proches',
    originTag: 'official',
    language: 'fr',
    isAvailable: true,
    contentStatus: 'available',
    sourceRef: {
      book: 'كتاب اللغة الفرنسية — الصف الخامس الابتدائي — الفصل الدراسي الأول',
      bookAr: 'كتاب الوزارة للغة الفرنسية ص. 10-15',
      bookEn: 'Ministry French Book pp. 10-15',
      grade: 'الصف الخامس',
      term: 'الفصل الدراسي الأول',
      unit: 'Unité 1',
      lesson: 'Leçon 2',
      page: 10,
      isAvailable: true,
    },
    objectives: [
      'Nommer les membres de la famille (Le père, la mère, le frère, la sœur, le grand-père, la grand-mère).',
      'Employer les adjectifs possessifs : mon, ma, mes.',
      'Décrire sa famille en quelques phrases simples.',
    ],
    readingText: `Amina présente sa famille :
Voici ma famille !
Mon père s'appelle Ahmed, il est ingénieur.
Ma mère s'appelle Mariam, elle est médecin.
J'ai un petit frère, il s'appelle Youssef, il a 6 ans.
Et voici ma sœur Nour.
Nous habitons tous ensemble au Caire près du Nil. J'aime beaucoup ma famille !`,
    vocabulary: [
      { word: 'Le père / Mon père', definition: 'الأب / والدي (Father / My father).' },
      { word: 'La mère / Ma mère', definition: 'الأم / والدتي (Mother / My mother).' },
      { word: 'Le frère / Mon frère', definition: 'الأخ / أخي (Brother / My brother).' },
      { word: 'La sœur / Ma sœur', definition: 'الأخت / أختي (Sister / My sister).' },
    ],
    exercises: [
      {
        type: 'multiple_choice',
        question: 'Pour parler de sa mère, on dit :',
        options: ['Mon père', 'Ma mère', 'Mon frère', 'Mes amis'],
        expectedAnswer: 'Ma mère',
        page: 13,
      },
    ],
    concepts: [
      {
        id: 'conc_fr_u1_l2_possessifs',
        conceptNumber: 1,
        titleAr: 'صفات الملكية (Mon / Ma / Mes)',
        titleEn: 'Possessive Adjectives in French',
        sourceText: 'Mon للمفرد المذكر (Mon père, mon livre). Ma للمفرد المؤنث (Ma mère, ma classe). Mes للجمع (Mes parents, mes frères).',
        keyPoints: [
          'نحدد نوع الكلمة (مذكر أو مؤنث) لاختيار صفة الملكية الصحيحة.',
          'الاسم المذكر يأخذ Mon، والاسم المؤنث يأخذ Ma، والجمع بنوعيه يأخذ Mes.',
        ],
        dailyLifeExampleAr: 'Mon père (أبي), Ma mère (أمي), Mes frères (إخوتي).',
        dailyLifeExampleEn: 'Mon père, Ma mère, Mes frères.',
        storyAnalogyAr: 'صفات الملكية مثل ملصقات الاسم: ملصق أزرق للأولاد (Mon)، ملصق وردي للبنات (Ma)، وملصق كبير للمجموعة (Mes).',
        storyAnalogyEn: 'Possessive adjectives are like color-coded name tags.',
        prerequisiteAr: 'التفريق بين المذكر والمؤنث.',
        prerequisiteEn: 'Masculine vs feminine nouns.',
      },
    ],
    supplementaryResources: [
      {
        id: 'supp_fr_adwaa_2',
        sourceType: 'al_adwaa',
        sourceNameAr: 'الأضواء لغة فرنسية — شجرة العائلة',
        sourceNameEn: 'Al-Adwaa Family Tree French',
        unit: 'Unité 1',
        lesson: 'Ma famille',
        page: 16,
        notes: 'رسم توضيحي لشجرة العائلة مع تمارين لغوية.',
        isAvailable: true,
      },
    ],
  },

  // =========================================================================
  // Unité 2: Dans ma classe et à l'école (الوحدة الثانية: في فصلي ومدرستي)
  // =========================================================================
  {
    id: 'off_fr_u2_l1_classe',
    subjectId: 'subj_french',
    subjectNameAr: 'اللغة الفرنسية',
    subjectNameEn: 'French Language',
    subjectNameFr: 'Français',
    unitNumber: 2,
    unitNameAr: 'الوحدة الثانية: في فصلي ومدرستي',
    unitNameEn: 'Unit 2: In My Classroom & School',
    unitNameFr: 'Unité 2: Dans ma classe et à l\'école',
    lessonNumber: 1,
    titleAr: 'الأدوات المدرسية داخل الفصل',
    titleEn: 'Classroom Objects & School Supplies',
    titleFr: 'Les objets de la classe et les fournitures',
    originTag: 'official',
    language: 'fr',
    isAvailable: true,
    contentStatus: 'available',
    sourceRef: {
      book: 'كتاب اللغة الفرنسية — الصف الخامس الابتدائي — الفصل الدراسي الأول',
      bookAr: 'كتاب الوزارة للغة الفرنسية ص. 16-22',
      bookEn: 'Ministry French Book pp. 16-22',
      grade: 'الصف الخامس',
      term: 'الفصل الدراسي الأول',
      unit: 'Unité 2',
      lesson: 'Leçon 1',
      page: 16,
      isAvailable: true,
    },
    objectives: [
      'Identifier les fournitures scolaires : un cartable, un livre, un cahier, un stylo, une trousse, une règle, une gomme.',
      'Utiliser les articles indéfinis : un, une, des.',
      'Demander ce que c\'est : "Qu\'est-ce que c\'est ?" et répondre : "C\'est un / une..."',
    ],
    readingText: `Dans mon cartable :
Amina prépare son cartable pour l'école :
- Dans mon cartable, il y a un livre de français et un livre de mathématiques.
- J'ai aussi deux cahiers et une belle trousse rouge.
- Dans ma trousse, il y a des stylos bleus, un crayon, une gomme blanche et une règle.
Mon cartable est bien rangé et je suis prête pour les cours !`,
    vocabulary: [
      { word: 'Un cartable', definition: 'حقيبة مدرسية (Schoolbag).' },
      { word: 'Une trousse', definition: 'مقلمة لحفظ الأقلام (Pencil case).' },
      { word: 'Un cahier', definition: 'دفتر / كشكول للكتابة (Notebook).' },
      { word: 'Une règle', definition: 'مسطرة للتسطير والقياس (Ruler).' },
    ],
    exercises: [
      {
        type: 'multiple_choice',
        question: 'Complète avec l\'article correct : C\'est _____ trousse.',
        options: ['un', 'une', 'des', 'le'],
        expectedAnswer: 'une',
        page: 19,
      },
    ],
    concepts: [
      {
        id: 'conc_fr_u2_l1_articles_indefinis',
        conceptNumber: 1,
        titleAr: 'أدوات النكرة (Un / Une / Des)',
        titleEn: 'Indefinite Articles (Un, Une, Des)',
        sourceText: 'Un للمفرد المذكر (Un stylo). Une للمفرد المؤنث (Une gomme). Des للجمع (Des stylos, des gommes).',
        keyPoints: [
          'Un تسبق أي اسم مفرد مذكر نكرة.',
          'Une تسبق أي اسم مفرد مؤنث نكرة.',
          'Des تسبق الجمع بنوعيه.',
        ],
        dailyLifeExampleAr: 'Un livre (كتاب), Une règle (مسطرة), Des crayons (أقلام تلوين).',
        dailyLifeExampleEn: 'Un livre, Une règle, Des crayons.',
        storyAnalogyAr: 'أدوات النكرة مثل قبعات صغيرة تضعها الكلمات على رأسها لتعرفنا إن كانت مفرد مذكر أو مؤنث أو جمع.',
        storyAnalogyEn: 'Indefinite articles are like hats words wear to show their gender and number.',
        prerequisiteAr: 'أسماء الأشياء المدرسية الأساسية.',
        prerequisiteEn: 'Classroom nouns.',
      },
    ],
    supplementaryResources: [
      {
        id: 'supp_fr_selah_classe',
        sourceType: 'selah_el_telmeez',
        sourceNameAr: 'سلاح التلميذ — مصورات الفصل',
        sourceNameEn: 'Selah El-Telmeez Visual Classroom',
        unit: 'Unité 2',
        lesson: 'Les objets de classe',
        page: 24,
        notes: 'رسوم توضيحية لجميع الأدوات المدرسية مع تدريبات كتابة اليد.',
        isAvailable: true,
      },
    ],
  },

  // =========================================================================
  // Unité 3: Mes activités et mon emploi du temps (قيد تحديث مواد الوزارة)
  // =========================================================================
  {
    id: 'off_fr_u3_l1_horaire',
    subjectId: 'subj_french',
    subjectNameAr: 'اللغة الفرنسية',
    subjectNameEn: 'French Language',
    subjectNameFr: 'Français',
    unitNumber: 3,
    unitNameAr: 'الوحدة الثالثة: أنشطتي وجدولي المدرسي',
    unitNameEn: 'Unit 3: My Activities & Schedule',
    unitNameFr: 'Unité 3: Mes activités et mon emploi du temps',
    lessonNumber: 1,
    titleAr: 'جدول الحصص والمواد المفضلة',
    titleEn: 'School Timetable & Favorite Subjects',
    titleFr: 'Mon emploi du temps et mes matières préférées',
    originTag: 'official',
    language: 'fr',
    isAvailable: false,
    contentStatus: 'pending_materials',
    sourceRef: {
      book: 'كتاب اللغة الفرنسية — الصف الخامس الابتدائي — الفصل الدراسي الأول',
      bookAr: 'كتاب الوزارة للغة الفرنسية ص. 26-30 (قيد الرفع)',
      bookEn: 'Ministry French Book pp. 26-30 (Pending Upload)',
      grade: 'الصف الخامس',
      term: 'الفصل الدراسي الأول',
      unit: 'Unité 3',
      lesson: 'Leçon 1',
      page: 26,
      isAvailable: false,
    },
    objectives: [
      'Exprimer ses goûts : J\'aime le français, je préfère les mathématiques.',
      'Lire l\'emploi du temps en français.',
    ],
    readingText: null, // Marked honestly as pending rather than fabricated!
    vocabulary: [
      { word: 'L\'emploi du temps', definition: 'جدول الحصص الأسبوعي (Class timetable).' },
      { word: 'J\'aime...', definition: 'أنا أحب... (I like...).' },
    ],
    exercises: [],
    concepts: [
      {
        id: 'conc_fr_u3_l1_gouts',
        conceptNumber: 1,
        titleAr: 'التعبير عن الميول المدرسية (Aimer / Préférer)',
        titleEn: 'Expressing Preferences in School',
        sourceText: 'J\'aime le français. Je n\'aime pas les devoirs difficiles. Je préfère les sciences.',
        keyPoints: [
          'نستخدم فعل Aimer متبوعاً بأداة المعرفة (Le, La, L\', Les).',
        ],
        dailyLifeExampleAr: 'J\'aime le français et les mathématiques.',
        dailyLifeExampleEn: 'J\'aime le français et les mathématiques.',
        storyAnalogyAr: 'مثل النجوم التي تضعها بجانب مادتك المفضلة.',
        storyAnalogyEn: 'Like placing stars next to your favorite subjects.',
        prerequisiteAr: 'أفعال المجموعة الأولى.',
        prerequisiteEn: 'Regular -er verbs.',
      },
    ],
    supplementaryResources: [
      {
        id: 'supp_fr_guide_3',
        sourceType: 'school_guide',
        sourceNameAr: 'دليل المعلم المدرسي — أنشطة الجدول',
        sourceNameEn: 'Teacher Guide Schedule Activities',
        unit: 'Unité 3',
        lesson: 'Emploi du temps',
        page: 32,
        notes: 'ملاحظة: هذا الدرس قيد رفع المسح الضوئي الرسمي من وزارة التربية والتعليم.',
        isAvailable: false,
      },
    ],
  },
];
