/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { OfficialCurriculumLesson } from '../../types/teachingSession';

/**
 * Official Egyptian Ministry of Education Curriculum for Grade 5 (Term 1)
 * Subject: Mathématiques (Section Langue Française / الماث بالفرنسية)
 * Textbooks: Techbook Mathématiques 5e Primaire (MOETE & Discovery Education)
 */
export const MATH_FR_CURRICULUM_LESSONS: OfficialCurriculumLesson[] = [
  // =========================================================================
  // Unité 1: La valeur de position des nombres décimaux et le calcul
  // =========================================================================
  {
    id: 'off_mathfr_u1_l1_decimaux',
    subjectId: 'subj_math_fr',
    subjectNameAr: 'الرياضيات (بالفرنسية)',
    subjectNameEn: 'French Mathematics',
    subjectNameFr: 'Mathématiques',
    unitNumber: 1,
    unitNameAr: 'الوحدة الأولى: القيمة المكانية للأعداد العشرية والحساب',
    unitNameEn: 'Unit 1: Decimals Place Value & Calculation',
    unitNameFr: 'Unité 1: La valeur de position des nombres décimaux',
    lessonNumber: 1,
    titleAr: 'الكسور العشرية حتى الجزء من ألف',
    titleEn: 'Decimals up to Thousandths (French Section)',
    titleFr: 'Les nombres décimaux jusqu\'aux millièmes',
    originTag: 'official',
    language: 'fr',
    isAvailable: true,
    contentStatus: 'available',
    sourceRef: {
      book: 'كتاب الماث بالفرنسية — الصف الخامس الابتدائي — الفصل الدراسي الأول',
      bookAr: 'كتاب الوزارة Mathématiques ص. 3-8',
      bookEn: 'Ministry Mathématiques Techbook pp. 3-8',
      grade: 'الصف الخامس',
      term: 'الفصل الدراسي الأول',
      unit: 'Unité 1',
      lesson: 'Leçon 1',
      page: 3,
      isAvailable: true,
    },
    objectives: [
      'Lire et écrire les nombres décimaux jusqu\'aux millièmes (0,001).',
      'Identifier la valeur de position : unités, dixièmes (1/10), centièmes (1/100), millièmes (1/1000).',
      'Décomposer un nombre décimal sous forme développée (ex: 3,456 = 3 + 0,4 + 0,05 + 0,006).',
    ],
    readingText: `Rappel et exploration :
Dans notre vie quotidienne, nous mesurons des quantités précises.
Par exemple, une bouteille d'eau contient 1,5 litre. Un petit oiseau pèse 0,875 kg.
Le tableau de numération décimale :
- Partie entière : Unités, Dizaines, Centaines.
- Virgule décimale (,).
- Partie décimale :
  * 1ère position : Dixièmes (1/10 = 0,1)
  * 2ème position : Centièmes (1/100 = 0,01)
  * 3ème position : Millièmes (1/1000 = 0,001)
Dans le nombre 4,725 :
- 4 est le chiffre des unités (valeur = 4).
- 7 est le chiffre des dixièmes (valeur = 0,7).
- 2 est le chiffre des centièmes (valeur = 0,02).
- 5 est le chiffre des millièmes (valeur = 0,005).`,
    vocabulary: [
      { word: 'Dixièmes (أجزاء من عشرة)', definition: 'La première position après la virgule (0,1).' },
      { word: 'Centièmes (أجزاء من مئة)', definition: 'La deuxième position بعد الفاصلة (0,01).' },
      { word: 'Millièmes (أجزاء من ألف)', definition: 'La troisième position après la virgule (0,001).' },
      { word: 'Forme développée (الصيغة الممتدة)', definition: 'Écrire le nombre comme somme des valeurs de chaque chiffre.' },
    ],
    exercises: [
      {
        type: 'multiple_choice',
        question: 'Dans le nombre 5,842, quelle est la valeur du chiffre 4 ?',
        options: ['0,4', '0,04', '0,004', '4'],
        expectedAnswer: '0,04',
        page: 6,
      },
      {
        type: 'qa',
        question: 'Écris sous forme développée le nombre : 2,308',
        expectedAnswer: '2 + 0,3 + 0,008',
        page: 7,
      },
    ],
    concepts: [
      {
        id: 'conc_mathfr_u1_l1_position',
        conceptNumber: 1,
        titleAr: 'جدول القيمة المكانية للأعداد العشرية',
        titleEn: 'Decimals Place Value Chart in French',
        sourceText: 'Le chiffre immédiatement après la virgule est le dixième, puis le centième, puis le millième.',
        keyPoints: [
          'Chaque rang vers la droite est 10 fois plus petit que le précédent.',
          '0,1 = 10 centièmes = 100 millièmes.',
        ],
        dailyLifeExampleAr: 'وزن حبة دواء صغيرة قد يكون 0,025 جرام (25 جزء من ألف من الجرام).',
        dailyLifeExampleEn: 'A small medication pill might weigh 0.025 grams.',
        storyAnalogyAr: 'تخيلي رغيف خبز: إذا قسمناه 10 أجزاء كل جزء هو (dixième)، وإذا قسمناه 1000 جزء صغير جداً كل فتفوتة هي (millième).',
        storyAnalogyEn: 'Imagine dividing bread into 1000 tiny crumbs, each is a millième.',
        prerequisiteAr: 'الأعداد الصحيحة والأجزاء من عشرة.',
        prerequisiteEn: 'Whole numbers and tenths.',
      },
    ],
    supplementaryResources: [
      {
        id: 'supp_mathfr_selah_1',
        sourceType: 'selah_el_telmeez',
        sourceNameAr: 'سلاح التلميذ — ماث لغات ٥ ابتدائي',
        sourceNameEn: 'Selah El-Telmeez Math Français',
        unit: 'Unité 1',
        lesson: 'Les décimaux',
        page: 15,
        notes: 'تمارين مكثفة وجداول قيمة مكانية للتدريب المنزلي.',
        isAvailable: true,
      },
    ],
  },

  {
    id: 'off_mathfr_u1_l2_comparer',
    subjectId: 'subj_math_fr',
    subjectNameAr: 'الرياضيات (بالفرنسية)',
    subjectNameEn: 'French Mathematics',
    subjectNameFr: 'Mathématiques',
    unitNumber: 1,
    unitNameAr: 'الوحدة الأولى: القيمة المكانية للأعداد العشرية والحساب',
    unitNameEn: 'Unit 1: Decimals Place Value & Calculation',
    unitNameFr: 'Unité 1: La valeur de position des nombres décimaux',
    lessonNumber: 2,
    titleAr: 'مقارنة وترتيب الأعداد العشرية',
    titleEn: 'Comparing & Ordering Decimals',
    titleFr: 'Comparer et ordonner les nombres décimaux',
    originTag: 'official',
    language: 'fr',
    isAvailable: true,
    contentStatus: 'available',
    sourceRef: {
      book: 'كتاب الماث بالفرنسية — الصف الخامس الابتدائي — الفصل الدراسي الأول',
      bookAr: 'كتاب الوزارة Mathématiques ص. 9-14',
      bookEn: 'Ministry Mathématiques Techbook pp. 9-14',
      grade: 'الصف الخامس',
      term: 'الفصل الدراسي الأول',
      unit: 'Unité 1',
      lesson: 'Leçon 2',
      page: 9,
      isAvailable: true,
    },
    objectives: [
      'Comparer deux nombres décimaux en utilisant les symboles >, <, =.',
      'Ordonner une série de nombres décimaux par ordre croissant ou décroissant.',
      'Équilibrer les parties décimales en ajoutant des zéros à droite si nécessaire.',
    ],
    readingText: `Méthode pour comparer deux nombres décimaux :
1. On compare d'abord la partie entière :
   Exemple : 5,32 et 4,99. Comme 5 > 4, alors 5,32 > 4,99.
2. Si les parties entières sont égales, on compare les dixièmes :
   Exemple : 3,75 et 3,48. Les entiers sont 3 = 3. Mais 7 dixièmes > 4 dixièmes, donc 3,75 > 3,48.
3. Astuce importante : On peut ajouter des zéros à droite pour avoir le même nombre de chiffres :
   Comparer 2,4 et 2,38 : On écrit 2,40 et 2,38. Comme 40 centièmes > 38 centièmes, 2,4 > 2,38 !`,
    vocabulary: [
      { word: 'Croissant (تصاعدي)', definition: 'Du plus petit au plus grand (من الأصغر إلى الأكبر).' },
      { word: 'Décroissant (تنازلي)', definition: 'Du plus grand au plus petit (من الأكبر إلى الأصغر).' },
    ],
    exercises: [
      {
        type: 'multiple_choice',
        question: 'Lequel est correct : 6,5 _____ 6,05 ?',
        options: ['>', '<', '='],
        expectedAnswer: '>',
        page: 11,
      },
    ],
    concepts: [
      {
        id: 'conc_mathfr_u1_l2_comparaison',
        conceptNumber: 1,
        titleAr: 'مقارنة الأعداد العشرية ومساواة الخانات',
        titleEn: 'Comparing Decimals with Zero Padding',
        sourceText: 'Comparer d\'abord la partie entière, puis chiffre par chiffre après la virgule de gauche à droite.',
        keyPoints: [
          'لا تنخدع بطول العدد بعد الفاصلة: 0,5 أكبر من 0,459 لأن 0,5 = 0,500.',
        ],
        dailyLifeExampleAr: 'مقارنة أسعار المنتجات أو أوقات الجري بالثواني وأجزاء المئة.',
        dailyLifeExampleEn: 'Comparing race times measured in seconds and hundredths.',
        storyAnalogyAr: 'مثل سباق الجري: نبدأ برؤية من عبر الأمتار الكاملة أولاً، وإذا تساووا ننظر إلى السنتيمترات الدقيقة.',
        storyAnalogyEn: 'Like a race: look at full meters first, then centimeters.',
        prerequisiteAr: 'القيمة المكانية للأعداد العشرية.',
        prerequisiteEn: 'Decimals place value.',
      },
    ],
    supplementaryResources: [
      {
        id: 'supp_mathfr_adwaa_comp',
        sourceType: 'al_adwaa',
        sourceNameAr: 'الأضواء ماث لغات — مقارنة الكسور العشرية',
        sourceNameEn: 'Al-Adwaa Math Decimals Comparison',
        unit: 'Unité 1',
        lesson: 'Comparer et ordonner',
        page: 20,
        notes: 'تدريبات على الترتيب التصاعدي والتنازلي مع مسائل كلامية.',
        isAvailable: true,
      },
    ],
  },

  // =========================================================================
  // Unité 2: Fractions et nombres fractionnaires (الكسور الاعتيادية)
  // =========================================================================
  {
    id: 'off_mathfr_u2_l1_fractions',
    subjectId: 'subj_math_fr',
    subjectNameAr: 'الرياضيات (بالفرنسية)',
    subjectNameEn: 'French Mathematics',
    subjectNameFr: 'Mathématiques',
    unitNumber: 2,
    unitNameAr: 'الوحدة الثانية: الكسور والعمليات الحسابية',
    unitNameEn: 'Unit 2: Fractions & Arithmetic Operations',
    unitNameFr: 'Unité 2: Fractions et nombres fractionnaires',
    lessonNumber: 1,
    titleAr: 'الكسور المتكافئة والتبسيط',
    titleEn: 'Equivalent Fractions & Simplification',
    titleFr: 'Fractions équivalentes et simplification',
    originTag: 'official',
    language: 'fr',
    isAvailable: true,
    contentStatus: 'available',
    sourceRef: {
      book: 'كتاب الماث بالفرنسية — الصف الخامس الابتدائي — الفصل الدراسي الأول',
      bookAr: 'كتاب الوزارة Mathématiques ص. 25-32',
      bookEn: 'Ministry Mathématiques Techbook pp. 25-32',
      grade: 'الصف الخامس',
      term: 'الفصل الدراسي الأول',
      unit: 'Unité 2',
      lesson: 'Leçon 1',
      page: 25,
      isAvailable: true,
    },
    objectives: [
      'Trouver des fractions équivalentes en multipliant ou divisant le numérateur et le dénominateur par un même nombre non nul.',
      'Simplifier une fraction pour la rendre irréductible.',
      'Représenter les fractions sur une droite numérique.',
    ],
    readingText: `Les fractions équivalentes :
Une fraction représente une partie d'un tout.
Le nombre du haut s'appelle le NUMÉRATEUR (البسط).
Le nombre du bas s'appelle le DÉNOMINATEUR (المقام).
Règle d'or :
Si on multiplie ou divise le numérateur ET le dénominateur par le MÊME nombre (différent de 0), la valeur de la fraction ne change pas !
Exemple :
1/2 = (1 × 2) / (2 × 2) = 2/4 = (1 × 3) / (2 × 3) = 3/6.
Ces fractions ont la même valeur : elles sont ÉQUIVALENTES.
Simplification :
Pour simplifier 6/8, on divise le haut et le bas par 2 :
6 ÷ 2 = 3 et 8 ÷ 2 = 4. Donc 6/8 = 3/4.`,
    vocabulary: [
      { word: 'Numérateur (البسط)', definition: 'Le nombre au-dessus de la barre de fraction (parts prises).' },
      { word: 'Dénominateur (المقام)', definition: 'Le nombre sous la barre de fraction (total des parts égales).' },
      { word: 'Fraction irréductible (كسر في أبسط صورة)', definition: 'Fraction qu\'on ne peut plus simplifier.' },
    ],
    exercises: [
      {
        type: 'multiple_choice',
        question: 'Quelle fraction est équivalente à 2/3 ?',
        options: ['4/6', '3/4', '2/6', '4/5'],
        expectedAnswer: '4/6',
        page: 28,
      },
    ],
    concepts: [
      {
        id: 'conc_mathfr_u2_l1_regle_or',
        conceptNumber: 1,
        titleAr: 'قاعدة تكافؤ وتبسيط الكسور',
        titleEn: 'Golden Rule of Equivalent Fractions',
        sourceText: 'Multiplier ou diviser le numérateur et le dénominateur par le même nombre conserve l\'égalité.',
        keyPoints: [
          'الضرب في نفس الرقم يعطي كسراً مكافئاً بأعداد أكبر.',
          'القسمة على العامل المشترك الأكبر تعطي أبسط صورة (fraction irréductible).',
        ],
        dailyLifeExampleAr: 'تقسيم بيتزا: نصف البيتزا (1/2) هو نفسه قطعتان من أصل 4 قطع (2/4).',
        dailyLifeExampleEn: 'Half a pizza is the same as 2 slices out of 4.',
        storyAnalogyAr: 'مثل تبديل ورقة نقدية فئة 100 جنيه بورقتين فئة 50 جنيهاً: القيمة الإجمالية هي نفسها تماماً.',
        storyAnalogyEn: 'Like exchanging a 100-pound note for two 50-pound notes: the value remains identical.',
        prerequisiteAr: 'جدول الضرب وقسمة الأعداد الصحيحة.',
        prerequisiteEn: 'Multiplication tables and integer division.',
      },
    ],
    supplementaryResources: [
      {
        id: 'supp_mathfr_selah_fractions',
        sourceType: 'selah_el_telmeez',
        sourceNameAr: 'سلاح التلميذ — بنك تمارين الكسور',
        sourceNameEn: 'Selah El-Telmeez Fractions Bank',
        unit: 'Unité 2',
        lesson: 'Fractions équivalentes',
        page: 35,
        notes: 'نماذج بصرية لشرائط ودوائر الكسور التفاعلية.',
        isAvailable: true,
      },
    ],
  },

  // =========================================================================
  // Unité 3: Opérations avancées (قيد تحديث مواد الوزارة)
  // =========================================================================
  {
    id: 'off_mathfr_u3_l1_division',
    subjectId: 'subj_math_fr',
    subjectNameAr: 'الرياضيات (بالفرنسية)',
    subjectNameEn: 'French Mathematics',
    subjectNameFr: 'Mathématiques',
    unitNumber: 3,
    unitNameAr: 'الوحدة الثالثة: قسمة وضرب الكسور العشرية',
    unitNameEn: 'Unit 3: Multiplication & Division of Decimals',
    unitNameFr: 'Unité 3: Multiplication et division des décimaux',
    lessonNumber: 1,
    titleAr: 'ضرب الأعداد العشرية في قوى العدد 10',
    titleEn: 'Multiplying Decimals by Powers of 10',
    titleFr: 'Multiplier les décimaux par 10, 100 et 1000',
    originTag: 'official',
    language: 'fr',
    isAvailable: false,
    contentStatus: 'pending_materials',
    sourceRef: {
      book: 'كتاب الماث بالفرنسية — الصف الخامس الابتدائي — الفصل الدراسي الأول',
      bookAr: 'كتاب الوزارة Mathématiques ص. 45-50 (قيد الرفع)',
      bookEn: 'Ministry Mathématiques Techbook pp. 45-50 (Pending Upload)',
      grade: 'الصف الخامس',
      term: 'الفصل الدراسي الأول',
      unit: 'Unité 3',
      lesson: 'Leçon 1',
      page: 45,
      isAvailable: false,
    },
    objectives: [
      'Multiplier un nombre décimal par 10, 100 et 1000 en déplaçant la virgule vers la droite.',
    ],
    readingText: null, // Cleanly marked as pending official ministry scan!
    vocabulary: [],
    exercises: [],
    concepts: [],
    supplementaryResources: [],
  },
];
