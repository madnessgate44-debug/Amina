/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { OfficialCurriculumLesson } from '../../types/teachingSession';

/**
 * Official Egyptian Ministry of Education Curriculum for Grade 5 (Term 1)
 * Subject: الرياضيات (Maths / Mathématiques — Cinquième primaire)
 * Ingested directly from official Ministry Techbook 2026/2027 (Discovery Education & MOETE).
 */
export const MATH_CURRICULUM_LESSONS: OfficialCurriculumLesson[] = [
  // =========================================================================
  // Unité 1: La Valeur de position de nombres décimaux et calcul
  // =========================================================================
  {
    id: 'off_math_u1_l1',
    subjectId: 'subj_math',
    subjectNameAr: 'الرياضيات',
    subjectNameEn: 'Mathematics (Maths)',
    unitNumber: 1,
    unitNameAr: 'الوحدة الأولى: القيمة المكانية للأعداد العشرية والحساب',
    unitNameEn: 'Unit 1: Decimals Place Value & Operations',
    lessonNumber: 1,
    titleAr: 'الكسور العشرية حتى الجزء من ألف',
    titleEn: 'Decimals up to Thousandths (Les nombres décimaux jusqu’aux millièmes)',
    originTag: 'official',
    isAvailable: true,
    sourceRef: {
      book: 'كتاب الرياضيات — الفصل الدراسي الأول — الصف الخامس الابتدائي',
      bookAr: 'الرياضيات — كتاب الوزارة ص. 3-6',
      bookEn: 'Maths Ministry Techbook pp. 3-6',
      grade: 'الصف الخامس',
      term: 'الفصل الدراسي الأول',
      unit: 'الوحدة الأولى',
      lesson: 'الدرس الأول',
      page: 3,
      isAvailable: true,
    },
    objectives: [
      'Lire et écrire des nombres décimaux jusqu\'aux millièmes (قراءة وكتابة الأعداد العشرية حتى الأجزاء من ألف).',
      'Identifier la valeur de position : unités, dixièmes, centièmes, et millièmes.',
      'Résoudre des problèmes concrets sur les masses d\'oiseaux du lac Qarun au Fayoum (0,65 kg, 1,27 kg, 0,875 kg).',
    ],
    readingText: `Le Fayoum est une destination ornithologique très populaire en Égypte. Des oiseaux migrent vers l'oasis à la recherche des plantes et des eaux du lac Qarun. Le Héron pourpré est l'un des oiseaux observés : sa taille est de 70 à 90 centimètres et il pèse entre 0,50 et 1,35 kg.
Exemples de masses relevées :
- 1er oiseau : 0,65 kg (6 dixièmes, 5 centièmes).
- 2ème oiseau : 1,27 kg (1 unité, 2 dixièmes, 7 centièmes).
- 3ème oiseau : 0,875 kg (0 unité, 8 dixièmes, 7 centièmes, 5 millièmes).
Dans le tableau de valeur de position, la première case après la virgule représente les dixièmes (1/10), la deuxième les centièmes (1/100), et la troisième les millièmes (1/1000).`,
    vocabulary: [
      { word: 'Millièmes (أجزاء من ألف)', definition: 'La troisième position après la virgule, représentant un millième (1/1000 ou 0,001).' },
      { word: 'Centièmes (أجزاء من مئة)', definition: 'La deuxième position après la virgule, valant un centième (0,01).' },
      { word: 'Dixièmes (أجزاء من عشرة)', definition: 'La première position immédiatement après la virgule décimale (0,1).' },
    ],
    exercises: [
      {
        type: 'multiple_choice',
        question: 'في العدد 0,875 كجم، ما هو الرقم الموجود في خانة الأجزاء من ألف (Millièmes)؟',
        options: ['الرقم 5', 'الرقم 7', 'الرقم 8', 'الرقم 0'],
        expectedAnswer: 'الرقم 5',
        page: 3,
      },
      {
        type: 'multiple_choice',
        question: 'Quel chiffre représente les dixièmes dans le nombre décimal 1,27 kg ?',
        options: ['2', '7', '1', '0'],
        expectedAnswer: '2',
        page: 3,
      },
      {
        type: 'multiple_choice',
        question: 'وفقاً لأسعار الغاز في ص. 6 (80 octane: 6,75 LE - 92 octane: 8,00 LE - 95 octane: 9,00 LE)، ما هو النوع الأقل سعراً؟',
        options: ['L\'essence à 80 octane (6,75 LE)', 'L\'essence à 92 octane (8,00 LE)', 'L\'essence à 95 octane (9,00 LE)'],
        expectedAnswer: 'L\'essence à 80 octane (6,75 LE)',
        page: 6,
      },
    ],
    concepts: [
      {
        id: 'off_math_u1_l1_c1',
        conceptNumber: 1,
        titleAr: 'قراءة الأعداد العشرية وتحديد خانة الألف',
        titleEn: 'Decimals up to the Thousandths Place',
        sourceText: 'يتكون العدد العشري من جزء صحيح وفاصلة عشرية وأجزاء من عشرة ومئة وألف.',
        keyPoints: [
          '0,1 يعني جزء واحد من عشرة أجزاء.',
          '0,01 يعني جزء واحد من مئة جزء.',
          '0,001 يعني جزء واحد من ألف جزء متساوٍ.',
        ],
        dailyLifeExampleAr: 'عند وزن الفاكهة في الميزان الإلكتروني ويظهر 1,525 كجم، فالرقم 5 الأخير هو 5 جرامات (أجزاء من ألف من الكيلو).',
        dailyLifeExampleEn: 'On a supermarket electronic scale showing 1.525 kg, the final 5 represents 5 grams (thousandths of a kilogram).',
        storyAnalogyAr: 'تخيلي رغيف خبز قطعناه إلى 1000 قطعة صغيرة جداً متساوية، كل فتاتة هي جزء من ألف!',
        storyAnalogyEn: 'Imagine cutting a cake into 1,000 equal tiny crumbs: each crumb is one thousandth!',
        prerequisiteAr: 'معرفة الأعداد الصحيحة وخانة العشرات والمئات.',
        prerequisiteEn: 'Understanding whole numbers place values.',
        visualType: 'diagram',
      },
    ],
  },
  {
    id: 'off_math_u1_l2',
    subjectId: 'subj_math',
    subjectNameAr: 'الرياضيات',
    subjectNameEn: 'Mathematics (Maths)',
    unitNumber: 1,
    unitNameAr: 'الوحدة الأولى: القيمة المكانية للأعداد العشرية والحساب',
    unitNameEn: 'Unit 1: Decimals Place Value & Operations',
    lessonNumber: 2,
    titleAr: 'تغير القيمة المكانية عند الضرب والقسمة',
    titleEn: 'Changing Place Value (Changement de la valeur de position)',
    originTag: 'official',
    isAvailable: true,
    sourceRef: {
      book: 'كتاب الرياضيات — الفصل الدراسي الأول — الصف الخامس الابتدائي',
      bookAr: 'الرياضيات — كتاب الوزارة ص. 7-10',
      bookEn: 'Maths Ministry Techbook pp. 7-10',
      grade: 'الصف الخامس',
      term: 'الفصل الدراسي الأول',
      unit: 'الوحدة الأولى',
      lesson: 'الدرس الثاني',
      page: 7,
      isAvailable: true,
    },
    objectives: [
      'Expliquer comment la valeur d\'un chiffre change en le multipliant ou divisant par 10.',
      'Démontrer que multiplier par 10 déplace les chiffres d\'un rang vers la gauche (augmente la valeur).',
      'Démontrer que diviser par 10 déplace les chiffres d\'un rang vers la droite (diminue la valeur).',
    ],
    readingText: `Exemple officiel (p. 8) : 57 × 10 = 570.
La valeur du nombre entier a augmenté d'un facteur de 10. Le chiffre 5 est passé de 50 à 500, et le chiffre 7 de 7 à 70.
À l'inverse, lors d'une division : 57 ÷ 10 = 5,7. Les chiffres glissent d'un rang vers la droite et la valeur diminue d'un facteur de 10.
Exemple avec décimaux : 6,5 × 10 = 65. Le 6 passe des unités aux dizaines, et le 5 passe des dixièmes aux unités.`,
    vocabulary: [
      { word: 'Facteur de 10', definition: 'الضرب في 10 أو القسمة على 10 مما ينقل الخانات بمقدار منزلة واحدة.' },
      { word: 'Déplacement à gauche', definition: 'حركة الأرقام لليسار تزيد قيمتها المكانية عشرة أضعاف عند الضرب.' },
      { word: 'Déplacement à droite', definition: 'حركة الأرقام لليمين تقلل قيمتها المكانية إلى العُشر عند القسمة.' },
    ],
    exercises: [
      {
        type: 'multiple_choice',
        question: 'عند ضرب العدد 6,5 في 10، يصبح الناتج:',
        options: ['65', '0,65', '650', '6,05'],
        expectedAnswer: '65',
        page: 9,
      },
      {
        type: 'multiple_choice',
        question: 'عند قسمة العدد 345 على 10، فإن قيمته المكانية:',
        options: ['تقل ويصبح الناتج 34,5', 'تزيد ويصبح الناتج 3450', 'تبقى ثابتة', 'تصبح 3,45'],
        expectedAnswer: 'تقل ويصبح الناتج 34,5',
        page: 9,
      },
    ],
    concepts: [
      {
        id: 'off_math_u1_l2_c1',
        conceptNumber: 1,
        titleAr: 'تأثير الضرب والقسمة على منزلة الرقم',
        titleEn: 'Place Value Shift with 10',
        sourceText: 'الضرب في 10 يحرك الأرقام يساراً ويزيد قيمتها، والقسمة تحركها يميناً.',
        keyPoints: [
          'عند الضرب في 10 يتحول الآحاد إلى عشرات، والأجزاء من عشرة إلى آحاد.',
          'عند القسمة على 10 يتحول الآحاد إلى أجزاء من عشرة.',
        ],
        dailyLifeExampleAr: 'لو كان معك 5 جنيهات وضربتيها في 10 صار معك 50 جنيهاً (قفز الرقم من خانة الآحاد إلى العشرات).',
        dailyLifeExampleEn: 'Having 5 pounds multiplied by 10 turns into 50 pounds (ones became tens).',
        storyAnalogyAr: 'مثل ركوب قطار سريع؛ الضرب ينقلك محطة للأمام (للأكبر)، والقسمة تنقلك محطة للوراء.',
        storyAnalogyEn: 'Like moving one station forward on an express train when multiplying by 10.',
        prerequisiteAr: 'جدول الضرب في 10.',
        prerequisiteEn: 'Multiplying by 10.',
        visualType: 'number_line',
      },
    ],
  },
  {
    id: 'off_math_u1_l3',
    subjectId: 'subj_math',
    subjectNameAr: 'الرياضيات',
    subjectNameEn: 'Mathematics (Maths)',
    unitNumber: 1,
    unitNameAr: 'الوحدة الأولى: القيمة المكانية للأعداد العشرية والحساب',
    unitNameEn: 'Unit 1: Decimals Place Value & Operations',
    lessonNumber: 3,
    titleAr: 'تكوين وتحليل الأعداد العشرية (الصيغة الممتدة)',
    titleEn: 'Composing & Decomposing Decimals (Composer et décomposer)',
    originTag: 'official',
    isAvailable: true,
    sourceRef: {
      book: 'كتاب الرياضيات — الفصل الدراسي الأول — الصف الخامس الابتدائي',
      bookAr: 'الرياضيات — كتاب الوزارة ص. 11-14',
      bookEn: 'Maths Ministry Techbook pp. 11-14',
      grade: 'الصف الخامس',
      term: 'الفصل الدراسي الأول',
      unit: 'الوحدة الأولى',
      lesson: 'الدرس الثالث',
      page: 11,
      isAvailable: true,
    },
    objectives: [
      'Composer et décomposer des nombres décimaux par plusieurs méthodes (Forme standard et forme développée).',
      'Décomposer par exemple 12,42 en : 10 + 2 + 0,4 + 0,02.',
      'Résoudre des problèmes sur les températures au Fayoum (16,3 °C).',
    ],
    readingText: `Pour décomposer un nombre décimal en forme développée (الصيغة الممتدة) :
Exemple officiel du livre (p. 12) : 12,42 = 10 + 2 + 0,4 + 0,02.
Autres exemples :
- 34,527 = 30 + 4 + 0,5 + 0,02 + 0,007
- 21,045 = 20 + 1 + 0,04 + 0,005
- 508,17 = 500 + 8 + 0,1 + 0,07
On peut également regrouper les entiers et les décimaux : 12,42 = 12 + 0,42.`,
    vocabulary: [
      { word: 'Forme développée (الصيغة الممتدة)', definition: 'كتابة العدد في صورة مجموع قيم أرقامه (مثل: 30 + 4 + 0,5 + 0,02).' },
      { word: 'Forme standard (الصيغة القياسية)', definition: 'كتابة العدد بالأرقام كالمعتاد (مثل: 34,52).' },
    ],
    exercises: [
      {
        type: 'multiple_choice',
        question: 'الصيغة الممتدة للعدد العشري 34,527 هي:',
        options: [
          '30 + 4 + 0,5 + 0,02 + 0,007',
          '3 + 4 + 5 + 2 + 7',
          '300 + 40 + 5 + 0,27',
          '34 + 527',
        ],
        expectedAnswer: '30 + 4 + 0,5 + 0,02 + 0,007',
        page: 12,
      },
    ],
    concepts: [
      {
        id: 'off_math_u1_l3_c1',
        conceptNumber: 1,
        titleAr: 'تحليل الأعداد العشرية إلى قيمها المكانية',
        titleEn: 'Expanded Form of Decimals',
        sourceText: 'العدد العشري يمكن تفكيكه إلى مجموع أجزائه: عشرات، آحاد، أجزاء من عشرة، أجزاء من مئة، وأجزاء من ألف.',
        keyPoints: [
          'الصفر في خانة معينة يعني عدم وجود قيمة لتلك المنزلة.',
          'الجمع بين الصيغ يعزز الفهم العميق للعدد.',
        ],
        dailyLifeExampleAr: 'مبلغ 15,75 جنيه هو عبارة عن 10 جنيهات + 5 جنيهات + 70 قرشاً + 5 قروش.',
        dailyLifeExampleEn: '15.75 pounds is 10 + 5 + 0.70 + 0.05 pounds.',
        storyAnalogyAr: 'مثل تفكيك لعبة المكعبات إلى قطعها الصغيرة ثم إعادة تركيبها في مجسم واحد.',
        storyAnalogyEn: 'Like taking apart Lego blocks into individual pieces and clicking them back together.',
        prerequisiteAr: 'الصيغة الممتدة للأعداد الصحيحة.',
        prerequisiteEn: 'Expanded form for whole numbers.',
        visualType: 'diagram',
      },
    ],
  },
  {
    id: 'off_math_u1_l4',
    subjectId: 'subj_math',
    subjectNameAr: 'الرياضيات',
    subjectNameEn: 'Mathematics (Maths)',
    unitNumber: 1,
    unitNameAr: 'الوحدة الأولى: القيمة المكانية للأعداد العشرية والحساب',
    unitNameEn: 'Unit 1: Decimals Place Value & Operations',
    lessonNumber: 4,
    titleAr: 'مقارنة الأعداد العشرية',
    titleEn: 'Comparing Decimals (Comparer des nombres décimaux)',
    originTag: 'official',
    isAvailable: true,
    sourceRef: {
      book: 'كتاب الرياضيات — الفصل الدراسي الأول — الصف الخامس الابتدائي',
      bookAr: 'الرياضيات — كتاب الوزارة ص. 15-16',
      bookEn: 'Maths Ministry Techbook pp. 15-16',
      grade: 'الصف الخامس',
      term: 'الفصل الدراسي الأول',
      unit: 'الوحدة الأولى',
      lesson: 'الدرس الرابع',
      page: 15,
      isAvailable: true,
    },
    objectives: [
      'Comparer deux nombres décimaux en utilisant les symboles >, < ou =.',
      'Aligner les valeurs de position en ajoutant des zéros à droite sans changer la valeur (ex: 34,5 = 34,500).',
      'Ordonner des températures et mesures réelles en Égypte.',
    ],
    readingText: `Pour comparer des nombres décimaux :
1. On compare d'abord la partie entière. Celui qui a la plus grande partie entière est le plus grand.
2. Si les parties entières sont égales, on compare les dixièmes, puis les centièmes, puis les millièmes.
Astuce essentielle (p. 15) : Ajouter des zéros à la fin de la partie décimale ne change pas sa valeur :
34,5 = 34,500
Exemples du livre :
- 45,057 < 45,100 (car 0 dixième < 1 dixième).
- 10,1 > 10,011 (car 1 dixième > 0 dixième).
- 38,80° = 38,8° (température égale).`,
    vocabulary: [
      { word: 'Égalité décimale', definition: 'تساوي الأعداد العشرية عند إضافة أصفار في أقصى اليمين (مثل 0,5 = 0,50 = 0,500).' },
      { word: 'Comparaison ordonnée', definition: 'المقارنة من اليسار لليمين بدءاً بالعدد الصحيح ثم الأجزاء من عشرة.' },
    ],
    exercises: [
      {
        type: 'multiple_choice',
        question: 'المقارنة الصحيحة بين العددين 10,1 و 10,011 هي:',
        options: ['10,1 > 10,011', '10,1 < 10,011', '10,1 = 10,011', 'لا يمكن المقارنة'],
        expectedAnswer: '10,1 > 10,011',
        page: 15,
      },
      {
        type: 'multiple_choice',
        question: 'أي من الأعداد التالية يمثل أصغر عدد عشري (ص. 16)؟',
        options: ['20,001', '20,09', '20,1', '20,21'],
        expectedAnswer: '20,001',
        page: 16,
      },
    ],
    concepts: [
      {
        id: 'off_math_u1_l4_c1',
        conceptNumber: 1,
        titleAr: 'مقارنة الأعداد العشرية وضبط المنازل',
        titleEn: 'Decimals Comparison & Zero Balancing',
        sourceText: 'نقارن الأعداد من اليسار، ومساواة عدد الخانات بإضافة أصفار يساعد على المقارنة الدقيقة.',
        keyPoints: [
          'العدد ذو الأرقام الأكثر بعد الفاصلة ليس دائماً هو الأكبر (10,1 أكبر من 10,099).',
          'وضع صفر جهة اليمين يسهل المقارنة: 10,100 مقابل 10,011.',
        ],
        dailyLifeExampleAr: 'مقارنة درجات الحرارة في نشرة الأخبار: 36,5° أعلى من 35,6° لأن 36 أكبر من 35.',
        dailyLifeExampleEn: 'Comparing daily temperatures: 36.5° is hotter than 35.6° because 36 > 35.',
        storyAnalogyAr: 'مثل سباق الجري؛ المتسابق الذي يبدأ بخطوة أوسع من البداية يكون متقدماً.',
        storyAnalogyEn: 'Like runners in a race: whoever has the bigger first stride leads from the start.',
        prerequisiteAr: 'مقارنة الأعداد الكلية.',
        prerequisiteEn: 'Comparing whole numbers.',
        visualType: 'comparison_table',
      },
    ],
  },
  {
    id: 'off_math_u1_l5',
    subjectId: 'subj_math',
    subjectNameAr: 'الرياضيات',
    subjectNameEn: 'Mathematics (Maths)',
    unitNumber: 1,
    unitNameAr: 'الوحدة الأولى: القيمة المكانية للأعداد العشرية والحساب',
    unitNameEn: 'Unit 1: Decimals Place Value & Operations',
    lessonNumber: 5,
    titleAr: 'تقريب الأعداد العشرية',
    titleEn: 'Rounding Decimals (Arrondir les décimaux)',
    originTag: 'official',
    isAvailable: true,
    sourceRef: {
      book: 'كتاب الرياضيات — الفصل الدراسي الأول — الصف الخامس الابتدائي',
      bookAr: 'الرياضيات — كتاب الوزارة ص. 17-19',
      bookEn: 'Maths Ministry Techbook pp. 17-19',
      grade: 'الصف الخامس',
      term: 'الفصل الدراسي الأول',
      unit: 'الوحدة الأولى',
      lesson: 'الدرس الخامس',
      page: 17,
      isAvailable: true,
    },
    objectives: [
      'Arrondir les nombres décimaux à l\'unité près, au dixième près, ou au centième près.',
      'Appliquer la règle d\'arrondi : si le chiffre suivant est 5 ou plus, on ajoute 1 ; s\'il est inférieur à 5, on laisse tel quel.',
      'Résoudre des problèmes sur les cascades de Wadi El Rayan (50,90 km² arrondi à 51 km²).',
    ],
    readingText: `Pour arrondir un nombre décimal (التقريب) :
1. On repère le chiffre de la position demandée (unités, dixièmes, centièmes).
2. On regarde le chiffre immédiatement à sa droite :
   - Si ce chiffre est 0, 1, 2, 3, 4 (chiffre faible) : on garde le chiffre inchangé.
   - Si ce chiffre est 5, 6, 7, 8, 9 (chiffre fort) : on ajoute 1 au chiffre.
Exemples du livre (p. 17-19) :
- 7,7 arrondi à l'unité près = 8
- 15,36 arrondi au nombre entier = 15
- 3,54 arrondi au dixième près = 3,5
- 1,277 arrondi au centième près = 1,28
- 56,284 arrondi au centième près = 56,28 ; au dixième près = 56,3 ; à l'unité près = 56.`,
    vocabulary: [
      { word: 'Arrondi (تقريب)', definition: 'استبدال العدد بعدد آخر قريب منه وأسهل في الحساب والاستخدام.' },
      { word: 'Règle des 5 (قاعدة الـ 5)', definition: 'إذا كان الرقم التالي 5 أو أكثر نزيد 1، وإذا كان أقل من 5 يظل كما هو.' },
    ],
    exercises: [
      {
        type: 'multiple_choice',
        question: 'تقريب العدد 1,277 إلى أقرب جزء من مئة (au centième près) هو:',
        options: ['1,28', '1,27', '1,30', '1,20'],
        expectedAnswer: '1,28',
        page: 18,
      },
      {
        type: 'multiple_choice',
        question: 'مساحة بحيرة وادي الريان 50,90 كم² عند تقريبها لأقرب عدد صحيح تصبح:',
        options: ['51 كم²', '50 كم²', '50,9 كم²', '52 كم²'],
        expectedAnswer: '51 كم²',
        page: 17,
      },
    ],
    concepts: [
      {
        id: 'off_math_u1_l5_c1',
        conceptNumber: 1,
        titleAr: 'قواعد التقريب للأعداد العشرية',
        titleEn: 'Rounding Decimals Rules',
        sourceText: 'النظر للخانة التالية: من 0 لـ 4 نهمل، ومن 5 لـ 9 نزيد واحداً.',
        keyPoints: [
          'تحديد الخانة المستهدفة أولاً.',
          'التقريب لأقرب وحدة يلغي كل الأجزاء العشرية.',
          'التقريب يسهل الحسابات الذهنية والتقدير السريع.',
        ],
        dailyLifeExampleAr: 'إذا كانت فاتورة الشراء 49,90 جنيهاً، ندفع 50 جنيهاً بالتقريب لأقرب جنيه.',
        dailyLifeExampleEn: 'Paying 50 pounds for a bill of 49.90 pounds rounded to the nearest integer.',
        storyAnalogyAr: 'مثل تسلق تلة؛ إذا وصلت إلى منتصف الطريق (5) تكمل إلى القمة، وإذا كنت قبل المنتصف تعود للبداية.',
        storyAnalogyEn: 'Like climbing a hill: if you reach the midpoint (5), you go over the top to the next number.',
        prerequisiteAr: 'تقريب الأعداد الكلية لأقرب عشرة ومئة.',
        prerequisiteEn: 'Rounding whole numbers.',
        visualType: 'number_line',
      },
    ],
  },

  // =========================================================================
  // Unité 2: Relations entre les nombres (Diviseurs, Multiples, P.G.C.D, P.P.C.M)
  // =========================================================================
  {
    id: 'off_math_u2_l1',
    subjectId: 'subj_math',
    subjectNameAr: 'الرياضيات',
    subjectNameEn: 'Mathematics (Maths)',
    unitNumber: 2,
    unitNameAr: 'الوحدة الثانية: العلاقات بين الأعداد',
    unitNameEn: 'Unit 2: Relations Between Numbers',
    lessonNumber: 1,
    titleAr: 'المعادلات والمتغيرات والتعبيرات الرياضية',
    titleEn: 'Expressions, Equations & Variables',
    originTag: 'official',
    isAvailable: true,
    sourceRef: {
      book: 'كتاب الرياضيات — الفصل الدراسي الأول — الصف الخامس الابتدائي',
      bookAr: 'الرياضيات — كتاب الوزارة ص. 44-46',
      bookEn: 'Maths Ministry Techbook pp. 44-46',
      grade: 'الصف الخامس',
      term: 'الفصل الدراسي الأول',
      unit: 'الوحدة الثانية',
      lesson: 'الدرس الأول',
      page: 44,
      isAvailable: true,
    },
    objectives: [
      'Expliquer la différence entre une expression mathématique et une équation (التعبير الرياضي والمعادلة).',
      'Identifier le rôle de la variable (المتغير x أو M) pour représenter une quantité inconnue.',
      'Résoudre des problèmes sur la géographie du Sinaï (largeur des isthmes : 275 - 180 = x).',
    ],
    readingText: `Dans l'apprentissage des mathématiques (p. 44) :
- Une équation (معادلة) : contient toujours le signe égal (=). Elle exprime l'égalité entre deux expressions. Exemple : 4,7 + 3,6 = M ou 180 + x = 275.
- Une expression mathématique (تعبير رياضي) : ne contient pas de signe égal. Exemple : 6,4 + 3,2 + 8 ou 3,4 + L.
- La variable (المتغير) : une lettre comme x, y, ou M qui représente une valeur inconnue qu'on cherche à trouver.
Exemple du Sinaï : Mariam écrit 180 + x = 275 pour trouver la différence de largeur entre deux isthmes. La lettre x représente les 95 km inconnus.`,
    vocabulary: [
      { word: 'Équation (معادلة)', definition: 'جملة رياضية تحتوي على علامة يساوي (=) تعبر عن تعادل طرفين.' },
      { word: 'Expression (تعبير رياضي)', definition: 'تركيب من أرقام وعمليات رياضية بدون علامة يساوي.' },
      { word: 'Variable (متغير)', definition: 'رمز أو حرف (مثل x أو M) يمثل قيمة مجهولة نبحث عنها.' },
    ],
    exercises: [
      {
        type: 'multiple_choice',
        question: 'الجملة الرياضية «56 - x = 47,5» تصنف على أنها:',
        options: ['معادلة (Équation)', 'تعبير رياضي فقط (Expression)', 'ليست جملة رياضية', 'مسألة بدون حل'],
        expectedAnswer: 'معادلة (Équation)',
        page: 46,
      },
      {
        type: 'multiple_choice',
        question: 'في المعادلة 180 + x = 275، ما هي قيمة المتغير x؟',
        options: ['95', '85', '455', '100'],
        expectedAnswer: '95',
        page: 45,
      },
    ],
    concepts: [
      {
        id: 'off_math_u2_l1_c1',
        conceptNumber: 1,
        titleAr: 'الفرق بين التعبير والمعادلة والمتغير',
        titleEn: 'Equations vs Expressions & Variables',
        sourceText: 'المعادلة ميزان يحتوي علامة (=)، والتعبير جملة بدون علامة، والمتغير هو المجهول.',
        keyPoints: [
          'وجود علامة (=) هو الفيصل في تمييز المعادلة.',
          'المتغير يمثل لغزاً رياضياً نحله بالعمليات العكسية.',
        ],
        dailyLifeExampleAr: 'إذا كان معك 10 جنيهات واشتريت قلماً وبقي 4 جنيهات، فالمعادلة هي: 10 - x = 4، وسعر القلم x = 6 جنيهات.',
        dailyLifeExampleEn: 'Starting with 10 pounds and having 4 left: 10 - x = 4, so pen price x = 6 pounds.',
        storyAnalogyAr: 'المعادلة كالميزان ذي الكفتين؛ يجب أن تتساوى الكفتان تماماً بفضل علامة (=).',
        storyAnalogyEn: 'An equation is like a balanced scale: both sides must be equal.',
        prerequisiteAr: 'الجمع والطرح البسيط.',
        prerequisiteEn: 'Basic addition and subtraction.',
        visualType: 'comparison_table',
      },
    ],
  },
  {
    id: 'off_math_u2_l4',
    subjectId: 'subj_math',
    subjectNameAr: 'الرياضيات',
    subjectNameEn: 'Mathematics (Maths)',
    unitNumber: 2,
    unitNameAr: 'الوحدة الثانية: العلاقات بين الأعداد',
    unitNameEn: 'Unit 2: Relations Between Numbers',
    lessonNumber: 4,
    titleAr: 'التحليل إلى العوامل الأولية وشجرة العوامل',
    titleEn: 'Prime Factorization & Factor Trees (Facteurs premiers)',
    originTag: 'official',
    isAvailable: true,
    sourceRef: {
      book: 'كتاب الرياضيات — الفصل الدراسي الأول — الصف الخامس الابتدائي',
      bookAr: 'الرياضيات — كتاب الوزارة ص. 51-53',
      bookEn: 'Maths Ministry Techbook pp. 51-53',
      grade: 'الصف الخامس',
      term: 'الفصل الدراسي الأول',
      unit: 'الوحدة الثانية',
      lesson: 'الدرس الرابع',
      page: 51,
      isAvailable: true,
    },
    objectives: [
      'Distinguer entre un nombre premier (عوامل أولية : 2, 3, 5, 7, 11...) et un nombre composé.',
      'Utiliser l\'arbre de facteurs (شجرة العوامل) pour décomposer un nombre en produit de facteurs premiers.',
      'Démontrer que le nombre 1 n\'est ni premier ni composé.',
    ],
    readingText: `Règles fondamentales (p. 51-52) :
- Nombre premier (عدد أولي) : nombre entier supérieur à 1 qui n'a exactement que deux diviseurs : 1 et lui-même (ex : 2, 3, 5, 7, 11, 13, 17, 19...). Le chiffre 2 est le seul nombre premier pair !
- Nombre composé (عدد متعدد العوامل) : nombre ayant plus de deux diviseurs (ex : 4, 6, 8, 9, 12, 24...).
- Le nombre 1 : n'a qu'un seul diviseur (lui-même), donc il n'est ni premier ni composé.
Arbre de facteurs pour 24 :
24 = 2 × 12 = 2 × 2 × 6 = 2 × 2 × 2 × 3.
Produit de facteurs premiers : 24 = 2 × 2 × 2 × 3.`,
    vocabulary: [
      { word: 'Nombre premier (عدد أولي)', definition: 'عدد أكبر من 1 له عاملان فقط: الواحد والعدد نفسه (مثل 2 و3 و5 و7).' },
      { word: 'Arbre de facteurs (شجرة العوامل)', definition: 'مخطط شجري لتفكيك العدد حتى نصل إلى جميع عوامله الأولية.' },
      { word: 'Nombre composé', definition: 'عدد له أكثر من عاملين ويمكن تفكيكه إلى حاصل ضرب أعداد أصغر منه.' },
    ],
    exercises: [
      {
        type: 'multiple_choice',
        question: 'العدد 2 يمثل في علم الرياضيات:',
        options: ['العدد الأولي الزوجي الوحيد', 'عدداً فردياً', 'عدداً مركباً', 'ليس عدداً أولياً'],
        expectedAnswer: 'العدد الأولي الزوجي الوحيد',
        page: 51,
      },
      {
        type: 'multiple_choice',
        question: 'حاصل ضرب العوامل الأولية: 2 × 3 × 7 يساوي العدد:',
        options: ['42', '21', '35', '12'],
        expectedAnswer: '42',
        page: 52,
      },
    ],
    concepts: [
      {
        id: 'off_math_u2_l4_c1',
        conceptNumber: 1,
        titleAr: 'تفكيك الأعداد عبر شجرة العوامل الأولية',
        titleEn: 'Prime Factor Trees',
        sourceText: 'الأعداد الأولية هي اللبنات الأساسية لكل الأعداد في الرياضيات.',
        keyPoints: [
          'العدد الأولي يقبل القسمة فقط على 1 وعلى نفسه.',
          'العدد 1 ليس أولياً لأنه يمتلك عاملاً واحداً فقط.',
          'شجرة العوامل تتفرع حتى نصل إلى دوائر كلها أعداد أولية.',
        ],
        dailyLifeExampleAr: 'مثل تفكيك قطعة كيك إلى مكوناتها الأصلية: دقيق وسكر وحليب؛ هذه هي العوامل الأولية.',
        dailyLifeExampleEn: 'Like decomposing a cake into its pure ingredients: flour, sugar, and milk.',
        storyAnalogyAr: 'الأعداد الأولية مثل ذرات العناصر الكيميائية البسيطة التي تركب منها كل المواد.',
        storyAnalogyEn: 'Prime numbers are like atoms in chemistry, building blocks of all composite numbers.',
        prerequisiteAr: 'جداول الضرب وقابلية القسمة.',
        prerequisiteEn: 'Multiplication tables.',
        visualType: 'concept_map',
      },
    ],
  },
  {
    id: 'off_math_u2_l5',
    subjectId: 'subj_math',
    subjectNameAr: 'الرياضيات',
    subjectNameEn: 'Mathematics (Maths)',
    unitNumber: 2,
    unitNameAr: 'الوحدة الثانية: العلاقات بين الأعداد',
    unitNameEn: 'Unit 2: Relations Between Numbers',
    lessonNumber: 5,
    titleAr: 'العامل المشترك الأكبر (ع.م.أ / P.G.C.D)',
    titleEn: 'Greatest Common Factor (P.G.C.D / GCF)',
    originTag: 'official',
    isAvailable: true,
    sourceRef: {
      book: 'كتاب الرياضيات — الفصل الدراسي الأول — الصف الخامس الابتدائي',
      bookAr: 'الرياضيات — كتاب الوزارة ص. 54-55',
      bookEn: 'Maths Ministry Techbook pp. 54-55',
      grade: 'الصف الخامس',
      term: 'الفصل الدراسي الأول',
      unit: 'الوحدة الثانية',
      lesson: 'الدرس الخامس',
      page: 54,
      isAvailable: true,
    },
    objectives: [
      'Identifier les facteurs communs de deux nombres entiers.',
      'Trouver le plus grand facteur commun (P.G.C.D - ع.م.أ) par factorisation première.',
      'Résoudre des situations concrètes de partage équitable (ex : billets de transport à Charm el-Cheikh, p. 55).',
    ],
    readingText: `Le plus grand facteur commun (P.G.C.D - العامل المشترك الأكبر) est le plus grand nombre qui divise exactement deux nombres sans reste.
Méthode par arbre de facteurs :
- 16 = 2 × 2 × 2 × 2
- 12 = 2 × 2 × 3
Les facteurs premiers communs sont : 2 et 2.
Le P.G.C.D = 2 × 2 = 4.
Exemple concret (p. 55) : Un groupe dépense 16 LE et un autre 12 LE en billets de bus de même tarif. Le prix maximal possible d'un billet est le P.G.C.D(16, 12) = 4 LE.`,
    vocabulary: [
      { word: 'P.G.C.D (ع.م.أ)', definition: 'Plus Grand Commun Diviseur (العامل المشترك الأكبر): أكبر عدد يقسم عددين معاً بدون باقٍ.' },
      { word: 'Facteurs communs', definition: 'العوامل المشتركة التي تقسم كلا العددين في نفس الوقت.' },
    ],
    exercises: [
      {
        type: 'multiple_choice',
        question: 'العامل المشترك الأكبر (P.G.C.D) للعددين 12 و 16 هو:',
        options: ['4', '2', '6', '12'],
        expectedAnswer: '4',
        page: 55,
      },
    ],
    concepts: [
      {
        id: 'off_math_u2_l5_c1',
        conceptNumber: 1,
        titleAr: 'إيجاد العامل المشترك الأكبر للتقسيم المتساوي',
        titleEn: 'Finding the Greatest Common Factor',
        sourceText: 'ع.م.أ هو أكبر قاسم مشترك يستخدم لتقسيم كميات مختلفة إلى مجموعات متساوية بدون باقٍ.',
        keyPoints: [
          'استخراج العوامل الأولية المشتركة وضربها معاً.',
          'يستخدم في مسائل التوزيع والتعبئة والتقسيم العادل.',
        ],
        dailyLifeExampleAr: 'توزيع 30 قطعة بسبوسة و48 قطعة كنافة على علب بالتساوي؛ أكبر عدد من العلب هو ع.م.أ(30, 48) = 6 علب.',
        dailyLifeExampleEn: 'Packing 30 and 48 desserts evenly into the maximum number of gift boxes: GCF is 6.',
        storyAnalogyAr: 'مثل البحث عن أكبر مفتاح سحري يستطيع فتح قفلين مختلفين في نفس الوقت.',
        storyAnalogyEn: 'Like finding the biggest master key that unlocks two different doors.',
        prerequisiteAr: 'التحليل إلى العوامل الأولية.',
        prerequisiteEn: 'Prime factorization.',
        visualType: 'diagram',
      },
    ],
  },
  {
    id: 'off_math_u2_l7',
    subjectId: 'subj_math',
    subjectNameAr: 'الرياضيات',
    subjectNameEn: 'Mathematics (Maths)',
    unitNumber: 2,
    unitNameAr: 'الوحدة الثانية: العلاقات بين الأعداد',
    unitNameEn: 'Unit 2: Relations Between Numbers',
    lessonNumber: 7,
    titleAr: 'المضاعف المشترك الأصغر (م.م.أ / P.P.C.M)',
    titleEn: 'Least Common Multiple (P.P.C.M / LCM)',
    originTag: 'official',
    isAvailable: true,
    sourceRef: {
      book: 'كتاب الرياضيات — الفصل الدراسي الأول — الصف الخامس الابتدائي',
      bookAr: 'الرياضيات — كتاب الوزارة ص. 59-61',
      bookEn: 'Maths Ministry Techbook pp. 59-61',
      grade: 'الصف الخامس',
      term: 'الفصل الدراسي الأول',
      unit: 'الوحدة الثانية',
      lesson: 'الدرس السابع',
      page: 59,
      isAvailable: true,
    },
    objectives: [
      'Expliquer la signification du plus petit commun multiple (P.P.C.M - م.م.أ).',
      'Identifier le P.P.C.M de deux nombres en listant les multiples ou par facteurs premiers.',
      'Résoudre des problèmes périodiques (ex : plantations de mangroves en Égypte tous les 4 et 6 jours, p. 61).',
    ],
    readingText: `Le plus petit commun multiple (P.P.C.M - المضاعف المشترك الأصغر) est le plus petit nombre non nul qui est multiple à la fois de deux nombres.
Exemple du livre (p. 60) :
Multiples de 6 : 6, 12, 18, 24, 30...
Multiples de 9 : 9, 18, 27, 36...
Le plus petit commun multiple P.P.C.M(6, 9) = 18.
Exemple des mangroves (p. 61) : Nada plante dans un jardin tous les 4 jours et dans un autre tous les 6 jours. Elle plantera dans les deux jardins le même jour tous les P.P.C.M(4, 6) = 12 jours !`,
    vocabulary: [
      { word: 'P.P.C.M (م.م.أ)', definition: 'Plus Petit Commun Multiple (المضاعف المشترك الأصغر): أصغر عدد يقبل القسمة على كلا العددين معاً.' },
      { word: 'Multiples (مضاعفات)', definition: 'نواتج ضرب العدد في 1, 2, 3, 4... إلى ما لا نهاية.' },
    ],
    exercises: [
      {
        type: 'multiple_choice',
        question: 'المضاعف المشترك الأصغر (P.P.C.M) للعددين 6 و 9 هو:',
        options: ['18', '54', '3', '12'],
        expectedAnswer: '18',
        page: 60,
      },
    ],
    concepts: [
      {
        id: 'off_math_u2_l7_c1',
        conceptNumber: 1,
        titleAr: 'تطبيقات المضاعف المشترك الأصغر في التكرار',
        titleEn: 'Least Common Multiple Applications',
        sourceText: 'م.م.أ هو أول نقطة يلتقي عندها حدثان يتكرران بانتظام في المستقبل.',
        keyPoints: [
          'يستخدم لمعرفة موعد التقاء حافلتين أو تكرار نشاطين دوريين.',
          'الصفر مضاعف لجميع الأعداد ولكن م.م.أ يحسب للأعداد غير الصفرية.',
        ],
        dailyLifeExampleAr: 'حافلة تنطلق كل 10 دقائق وحافلة كل 15 دقيقة، تنطلقان معاً كل 30 دقيقة (م.م.أ = 30).',
        dailyLifeExampleEn: 'Two bus routes departing every 10 and 15 minutes will depart together every 30 minutes.',
        storyAnalogyAr: 'مثل صديقين يقفزان في سباق؛ الأول يقفز خطوتين والثاني ثلاث خطوات، فيلتقيان عند الخطوة السادسة.',
        storyAnalogyEn: 'Two friends jumping: one leaps by 2s and the other by 3s; their footprints first match at step 6.',
        prerequisiteAr: 'مضاعفات الأعداد البسيطة.',
        prerequisiteEn: 'Multiples of integers.',
        visualType: 'timeline',
      },
    ],
  },

  // =========================================================================
  // Unité 3: Multiplication avec des nombres entiers (Modèle de l'aire & Algorithme)
  // =========================================================================
  {
    id: 'off_math_u3_l1',
    subjectId: 'subj_math',
    subjectNameAr: 'الرياضيات',
    subjectNameEn: 'Mathematics (Maths)',
    unitNumber: 3,
    unitNameAr: 'الوحدة الثالثة: الضرب في الأعداد الصحيحة',
    unitNameEn: 'Unit 3: Multiplication with Whole Numbers',
    lessonNumber: 1,
    titleAr: 'استخدام نموذج مساحة المستطيل في الضرب',
    titleEn: 'Area Model for Multiplication (Modèle de l’aire du rectangle)',
    originTag: 'official',
    isAvailable: true,
    sourceRef: {
      book: 'كتاب الرياضيات — الفصل الدراسي الأول — الصف الخامس الابتدائي',
      bookAr: 'الرياضيات — كتاب الوزارة ص. 65-67',
      bookEn: 'Maths Ministry Techbook pp. 65-67',
      grade: 'الصف الخامس',
      term: 'الفصل الدراسي الأول',
      unit: 'الوحدة الثالثة',
      lesson: 'الدرس الأول',
      page: 65,
      isAvailable: true,
    },
    objectives: [
      'Multiplier en utilisant le modèle de l\'aire du rectangle (نموذج مساحة المستطيل).',
      'Décomposer les facteurs en dizaines et unités : par exemple 234 × 27.',
      'Résoudre des problèmes de tourisme dans les montagnes de la Mer Rouge (12 bus × 25 passagers = 300, p. 67).',
    ],
    readingText: `Le modèle de l'aire du rectangle (p. 66) permet de visualiser la multiplication par décomposition :
Pour calculer 234 × 27 :
On décompose 234 en (200 + 30 + 4) et 27 en (20 + 7).
On calcule les 6 aires partielles :
- 20 × 200 = 4 000
- 20 × 30 = 600
- 20 × 4 = 80
- 7 × 200 = 1 400
- 7 × 30 = 210
- 7 × 4 = 28
Somme des produits partiels : 4 000 + 600 + 80 + 1 400 + 210 + 28 = 6 318.`,
    vocabulary: [
      { word: 'Modèle de l\'aire', definition: 'نموذج مساحة المستطيل: تقسيم المستطيل لمربعات تمثل حواصل الضرب الجزئية.' },
      { word: 'Produits partiels', definition: 'حواصل الضرب الجزئية الناتجة عن ضرب كل منزلة على حدة.' },
    ],
    exercises: [
      {
        type: 'multiple_choice',
        question: 'في نموذج مساحة المستطيل لحساب 201 × 32، حاصل ضرب 200 × 30 هو:',
        options: ['6 000', '600', '60 000', '60'],
        expectedAnswer: '6 000',
        page: 66,
      },
    ],
    concepts: [
      {
        id: 'off_math_u3_l1_c1',
        conceptNumber: 1,
        titleAr: 'نموذج مساحة المستطيل وحواصل الضرب الجزئية',
        titleEn: 'Rectangle Area Model for Multiplication',
        sourceText: 'تجزئة الأعداد الكبيرة إلى صيغ ممتدة يسهل حساب مساحة كل جزء وجمعها.',
        keyPoints: [
          'تقسيم العددين وتوزيع الضرب هندسياً.',
          'جمع حواصل الضرب الجزئية يعطي الناتج الإجمالي بدقة.',
        ],
        dailyLifeExampleAr: 'حساب مساحة صالة مربعة مقسمة إلى غرفتين وسيراميك مختلف.',
        dailyLifeExampleEn: 'Calculating total floor tile area across adjacent rooms.',
        storyAnalogyAr: 'مثل تجميع قطع أحجية الصور (Puzzle)؛ تجمع القطع الصغيرة لتكتمل اللوحة كاملة.',
        storyAnalogyEn: 'Like assembling puzzle pieces together to reveal the whole picture.',
        prerequisiteAr: 'ضرب مضاعفات 10 و 100.',
        prerequisiteEn: 'Multiplying by multiples of 10 and 100.',
        visualType: 'diagram',
      },
    ],
  },
  {
    id: 'off_math_u3_l3',
    subjectId: 'subj_math',
    subjectNameAr: 'الرياضيات',
    subjectNameEn: 'Mathematics (Maths)',
    unitNumber: 3,
    unitNameAr: 'الوحدة الثالثة: الضرب في الأعداد الصحيحة',
    unitNameEn: 'Unit 3: Multiplication with Whole Numbers',
    lessonNumber: 3,
    titleAr: 'خوارزمية الضرب المعيارية (الضرب الرأسي)',
    titleEn: 'Standard Multiplication Algorithm (L’algorithme standard)',
    originTag: 'official',
    isAvailable: true,
    sourceRef: {
      book: 'كتاب الرياضيات — الفصل الدراسي الأول — الصف الخامس الابتدائي',
      bookAr: 'الرياضيات — كتاب الوزارة ص. 72-74',
      bookEn: 'Maths Ministry Techbook pp. 72-74',
      grade: 'الصف الخامس',
      term: 'الفصل الدراسي الأول',
      unit: 'الوحدة الثالثة',
      lesson: 'الدرس الثالث',
      page: 72,
      isAvailable: true,
    },
    objectives: [
      'Multiplier par un nombre composé de deux chiffres en utilisant l\'algorithme standard (الخوارزمية المعيارية للضرب).',
      'Travailler de bas en haut et de droite à gauche en tenant compte de la retenue.',
      'Placer le zéro de position lors de la multiplication par le chiffre des dizaines.',
    ],
    readingText: `Étapes de l'algorithme standard (p. 73) :
Pour calculer 45 × 37 :
1. Multiplier 45 par le chiffre des unités 7 :
   7 × 5 = 35 (on pose 5 et on retient 3).
   7 × 4 = 28 + 3 = 31 -> premier produit partiel = 315.
2. Multiplier 45 par le chiffre des dizaines 3 (soit 30) :
   On place d'abord un zéro dans la colonne des unités !
   3 × 5 = 15 (on pose 5 et on retient 1).
   3 × 4 = 12 + 1 = 13 -> deuxième produit partiel = 1 350.
3. Additionner les deux produits partiels :
   315 + 1 350 = 1 665.`,
    vocabulary: [
      { word: 'Algorithme standard', definition: 'الخوارزمية المعيارية للضرب: الطريقة التقليدية المنظمة للضرب الرأسي مع حفظ الخانات.' },
      { word: 'Zéro de position', definition: 'صفر حفظ المنزلة الذي نضعه في خانة الآحاد عند البدء في ضرب رقم العشرات.' },
    ],
    exercises: [
      {
        type: 'multiple_choice',
        question: 'عند ضرب عدد في رقم العشرات بالخوارزمية المعيارية، الخطوة الأولى الإلزامية هي:',
        options: ['وضع صفر حفظ الخانة في خانة الآحاد', 'حذف الفاصلة', 'طرح العددين', 'الضرب في 100'],
        expectedAnswer: 'وضع صفر حفظ الخانة في خانة الآحاد',
        page: 73,
      },
    ],
    concepts: [
      {
        id: 'off_math_u3_l3_c1',
        conceptNumber: 1,
        titleAr: 'خطوات الضرب المعياري وحفظ الخانات',
        titleEn: 'Standard Column Multiplication Steps',
        sourceText: 'نبدأ بالآحاد ثم العشرات مع وضع صفر الحفظ في السطر الثاني والجمع في النهاية.',
        keyPoints: [
          'الترتيب من اليمين لليسار.',
          'مراعاة إضافة الأرقام المرحلة (الاحتفاظ).',
          'جمع حاصلي الضرب للحصول على الناتج النهائي.',
        ],
        dailyLifeExampleAr: 'حساب ثمن 24 كتاباً بسعر 76 جنيهاً للكتاب الواحد: 76 × 24 = 1824 جنيهاً.',
        dailyLifeExampleEn: 'Buying 24 books at 76 pounds each: 76 × 24 = 1,824 pounds.',
        storyAnalogyAr: 'مثل بناء برج من طابقين؛ تبنين الطابق الأول، ثم تؤسسين الطابق الثاني، ثم تدمجينهما معاً.',
        storyAnalogyEn: 'Like building a two-story tower: finish level 1, set up level 2, then connect them.',
        prerequisiteAr: 'حقائق جدول الضرب حتى 9.',
        prerequisiteEn: 'Multiplication facts up to 9.',
        visualType: 'diagram',
      },
    ],
  },

  // =========================================================================
  // Unité 6: Expressions numériques et modèles (Ordre des opérations)
  // =========================================================================
  {
    id: 'off_math_u6_l1',
    subjectId: 'subj_math',
    subjectNameAr: 'الرياضيات',
    subjectNameEn: 'Mathematics (Maths)',
    unitNumber: 6,
    unitNameAr: 'الوحدة السادسة: التعبيرات العددية والأنماط',
    unitNameEn: 'Unit 6: Numerical Expressions & Patterns',
    lessonNumber: 1,
    titleAr: 'ترتيب العمليات الحسابية',
    titleEn: 'Order of Operations (L’ordre des opérations mathématiques)',
    originTag: 'official',
    isAvailable: true,
    sourceRef: {
      book: 'كتاب الرياضيات — الفصل الدراسي الأول — الصف الخامس الابتدائي',
      bookAr: 'الرياضيات — كتاب الوزارة ص. 121-125',
      bookEn: 'Maths Ministry Techbook pp. 121-125',
      grade: 'الصف الخامس',
      term: 'الفصل الدراسي الأول',
      unit: 'الوحدة السادسة',
      lesson: 'الدرس الأول',
      page: 121,
      isAvailable: true,
    },
    objectives: [
      'Appliquer l\'ordre des opérations mathématiques pour évaluer des expressions numériques.',
      'Respecter la priorité : 1) Parenthèses et crochets, 2) Multiplication et division (de gauche à droite), 3) Addition et soustraction (de gauche à droite).',
      'Résoudre l\'activité officielle du bus dans la ville (p. 122).',
    ],
    readingText: `L'ordre fondamental des opérations (p. 121) :
Quand une expression contient plusieurs opérations :
1. D'abord les calculs entre parenthèses ( ) et crochets [ ].
2. Ensuite la multiplication (×) et la division (÷), calculées de gauche à droite selon l'ordre d'apparition.
3. Enfin l'addition (+) et la soustraction (-), calculées de gauche à droite.
Exemple du livre (p. 121) :
56,5 × 2,3 − 15 + 12,7
Étape 1 : Effectuer la multiplication 56,5 × 2,3 = 129,95.
Étape 2 : 129,95 − 15 = 114,95.
Étape 3 : 114,95 + 12,7 = 127,65.
Attention : Les parenthèses changent l'ordre ! (45,84 + 13,05) ÷ 5 oblige à faire l'addition d'abord.`,
    vocabulary: [
      { word: 'Ordre des opérations (ترتيب العمليات)', definition: 'القواعد الرياضية التي تحدد أي عملية تنفذ أولاً لتفادي الأخطاء في الناتج.' },
      { word: 'Parenthèses (الأقواس)', definition: 'رموز تمنح الأولوية القصوى لما بداخلها ليتم حسابه قبل أي عملية أخرى.' },
    ],
    exercises: [
      {
        type: 'multiple_choice',
        question: 'في التعبير الرياضي «12 + 24 ÷ 4»، العملية التي يجب تنفيذها أولاً هي:',
        options: ['القسمة (24 ÷ 4)', 'الجمع (12 + 24)', 'كلاهما معاً', 'الضرب في 2'],
        expectedAnswer: 'القسمة (24 ÷ 4)',
        page: 123,
      },
      {
        type: 'multiple_choice',
        question: 'ناتج العملية 10 × 4 - 3 وفقاً لقواعد ترتيب العمليات هو:',
        options: ['37 (لأن 40 - 3 = 37)', '10', '70', '40'],
        expectedAnswer: '37 (لأن 40 - 3 = 37)',
        page: 123,
      },
    ],
    concepts: [
      {
        id: 'off_math_u6_l1_c1',
        conceptNumber: 1,
        titleAr: 'قواعد أسبقية العمليات الحسابية',
        titleEn: 'Rules of Mathematical Precedence',
        sourceText: 'الأقواس أولاً، ثم الضرب والقسمة من اليسار لليمين، ثم الجمع والطرح.',
        keyPoints: [
          'الأقواس تحمي وتحدد العملية الأولى دوماً.',
          'الضرب والقسمة أقوى من الجمع والطرح.',
          'إذا تساوت العمليات ننفذ من اليسار إلى اليمين.',
        ],
        dailyLifeExampleAr: 'شراء 3 وجبات بسعر 50 جنيهاً مع خصم 10 جنيهات: 3 × 50 - 10 = 150 - 10 = 140 جنيهاً.',
        dailyLifeExampleEn: 'Buying 3 meals at 50 with a 10 discount: 3 × 50 - 10 = 140.',
        storyAnalogyAr: 'مثل إشارات المرور؛ اللون الأحمر (الأقواس) يلزم الجميع بالوقوف حتى يمر أولاً.',
        storyAnalogyEn: 'Like traffic lights giving right of way to priority vehicles first.',
        prerequisiteAr: 'العمليات الحسابية الأربع.',
        prerequisiteEn: 'The four basic arithmetic operations.',
        visualType: 'diagram',
      },
    ],
  },
];
