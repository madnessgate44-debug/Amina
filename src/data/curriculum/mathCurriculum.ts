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
        misconceptions: [
          {
            id: 'mis_ar_pv_tenths',
            trigger: 'الرقم 8',
            explanation: 'اخترتِ الرقم 8، وهو في خانة الأجزاء من عشرة، لكن السؤال عن خانة الأجزاء من ألف.',
            remediation: 'عدّي الخانات بعد الفاصلة بالترتيب: الأولى أجزاء من عشرة، الثانية أجزاء من مئة، الثالثة أجزاء من ألف. في 0,875 الرقم 5 هو الثالث.',
          },
          {
            id: 'mis_ar_pv_hundredths',
            trigger: 'الرقم 7',
            explanation: 'اخترتِ الرقم 7، وهو في خانة الأجزاء من مئة، لا خانة الأجزاء من ألف.',
            remediation: 'كل خانة لليمين تساوي عُشر التي قبلها؛ الرقم الثالث بعد الفاصلة هو الأجزاء من ألف وهو 5.',
          },
          {
            id: 'mis_ar_pv_units',
            trigger: 'الرقم 0',
            explanation: 'اخترتِ الرقم 0 وهو الجزء الصحيح قبل الفاصلة، وليس في الجزء العشري.',
            remediation: 'ابدئي العدّ بعد الفاصلة مباشرة، لا قبلها؛ الرقم الثالث بعد الفاصلة هو 5.',
          },
        ],
        distractors: ['الرقم 8|mis_ar_pv_tenths', 'الرقم 7|mis_ar_pv_hundredths', 'الرقم 0|mis_ar_pv_units'],
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
        misconceptions: [
          {
            id: 'mis_ar_mult_direction',
            trigger: '0,65',
            explanation: 'ضربتِ في 10 فحرّكتِ الفاصلة يميناً بدل الشمال؛ الضرب في 10 يكبّر العدد.',
            remediation: 'الضرب في 10 يزيد القيمة: 6,5 تصبح 65 (تحركت الفاصلة خانة واحدة لليمين). القسمة على 10 هي التي تصغّر العدد.',
            explanationFr: 'Vous avez gardé 0,65 : multiplier par 10 agrandit le nombre, la virgule doit avancer d’un rang vers la droite.',
            remediationFr: 'Multiplier par 10 augmente la valeur : 6,5 devient 65 (la virgule avance d’un rang à droite). C’est la division par 10 qui rend le nombre plus petit.',
            explanationEn: 'You kept 0.65: multiplying by 10 makes the number larger, so the decimal point must move one place to the right.',
            remediationEn: 'Multiplying by 10 increases the value: 6.5 becomes 65 (the point moves one place right). Dividing by 10 is what makes the number smaller.',
          },
          {
            id: 'mis_ar_mult_extra_zero',
            trigger: '650',
            explanation: 'أضفتِ صفراً زائداً؛ الضرب في 10 يحرّك الفاصلة خانة واحدة فقط.',
            remediation: 'انقلي الفاصلة خانة واحدة لليمين لكل ضرب في 10، لا أكثر: 6,5 ← 65.',
            explanationFr: 'Vous avez ajouté un zéro en trop : multiplier par 10 déplace la virgule d’un seul rang.',
            remediationFr: 'Pour une multiplication par 10, déplacez la virgule d’un rang vers la droite, pas plus : 6,5 → 65.',
            explanationEn: 'You added an extra zero: multiplying by 10 moves the decimal point just one place.',
            remediationEn: 'For a multiplication by 10, move the point one place to the right, no more: 6.5 → 65.',
          },
        ],
        distractors: ['0,65|mis_ar_mult_direction', '650|mis_ar_mult_extra_zero'],
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
        misconceptions: [
          {
            id: 'mis_ar_expand_digit',
            trigger: '3 + 4 + 5 + 2 + 7',
            explanation: 'كتبتِ الأرقام كما هي دون قيمتها المكانية؛ العدد 34,527 ليس 3 + 4 + 5 + 2 + 7.',
            remediation: 'كل رقم يأخذ قيمته من خانته: 3 عشرات = 30، و5 أجزاء من عشرة = 0,5، لا 3 و5 مجرّدين.',
            explanationFr: 'Vous avez écrit les chiffres tels quels, sans leur valeur de position : 34,527 n’est pas 3 + 4 + 5 + 2 + 7.',
            remediationFr: 'Chaque chiffre prend sa valeur de sa position : 3 dizaines = 30, et 5 dixièmes = 0,5, pas 3 et 5 tout seuls.',
            explanationEn: 'You wrote the digits as they are, without their place value: 34.527 is not 3 + 4 + 5 + 2 + 7.',
            remediationEn: 'Each digit takes its value from its place: 3 tens = 30, and 5 tenths = 0.5, not 3 and 5 on their own.',
          },
          {
            id: 'mis_ar_expand_scale',
            trigger: '300 + 40 + 5 + 0,27',
            explanation: 'ضاعفتِ المراتب: 3 عشرات وليست 3 مئات، و5 أجزاء من عشرة وليست 5 آحاد، والـ 0,027 صارت 0,27.',
            remediation: 'راجعي كل خانة على حدة: 3 في العشرات = 30، و4 في الآحاد = 4، و5 في أجزاء العشرة = 0,5، و2 في أجزاء المئة = 0,02، و7 في أجزاء الألف = 0,007.',
            explanationFr: 'Vous avez doublé les rangs : 3 dizaines et non 3 centaines, 5 dixièmes et non 5 unités, et 0,027 est devenu 0,27.',
            remediationFr: 'Reprenez chaque rang : 3 aux dizaines = 30, 4 aux unités = 4, 5 aux dixièmes = 0,5, 2 aux centièmes = 0,02, 7 aux millièmes = 0,007.',
            explanationEn: 'You doubled the places: 3 tens, not 3 hundreds; 5 tenths, not 5 units; and 0.027 became 0.27.',
            remediationEn: 'Check each place: 3 in the tens = 30, 4 in the units = 4, 5 in the tenths = 0.5, 2 in the hundredths = 0.02, 7 in the thousandths = 0.007.',
          },
          {
            id: 'mis_ar_expand_group',
            trigger: '34 + 527',
            explanation: 'نسيتِ الفاصلة العشرية فكتبتِ الجزء العشري 0,527 عدداً صحيحاً 527.',
            remediation: 'احتفظي بالفاصلة: كل ما بعدها أصغر من 1، فيصير 0,5 + 0,02 + 0,007 وليس 527.',
            explanationFr: 'Vous avez oublié la virgule et écrit la partie décimale 0,527 comme l’entier 527.',
            remediationFr: 'Gardez la virgule : tout ce qui suit est plus petit que 1, donc 0,5 + 0,02 + 0,007 et non 527.',
            explanationEn: 'You forgot the decimal point and wrote the decimal part 0.527 as the whole number 527.',
            remediationEn: 'Keep the point: everything after it is smaller than 1, so it is 0.5 + 0.02 + 0.007, not 527.',
          },
        ],
        distractors: ['3 + 4 + 5 + 2 + 7|mis_ar_expand_digit', '300 + 40 + 5 + 0,27|mis_ar_expand_scale', '34 + 527|mis_ar_expand_group'],
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
        misconceptions: [
          {
            id: 'mis_ar_cmp_longer_is_bigger',
            trigger: '20,09',
            explanation: 'ظننتِ أن 20,09 صغير لأن كسرَه يبدأ بالصفر، لكن الأجزاء من عشرة فيه (0) أكبر من نظيرها في 20,001.',
            remediation: 'قارني خانة بخانة: الأجزاء من عشرة 0 = 0، ثم الأجزاء من مئة 0 مقابل 9. أصغر عدد هو 20,001.',
            explanationFr: 'Vous avez cru que 20,09 était petit parce que sa partie décimale commence par un zéro, mais ses dixièmes (0) sont plus grands que ceux de 20,001.',
            remediationFr: 'Comparez rang par rang : dixièmes 0 = 0, puis centièmes 0 contre 9. Le plus petit nombre est 20,001.',
            explanationEn: 'You thought 20.09 was small because its decimal part starts with a zero, but its tenths (0) are larger than those of 20.001.',
            remediationEn: 'Compare place by place: tenths 0 = 0, then hundredths 0 versus 9. The smallest number is 20.001.',
          },
        ],
        distractors: ['20,09|mis_ar_cmp_longer_is_bigger'],
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
        misconceptions: [
          {
            id: 'mis_ar_round_truncate',
            trigger: '1,27',
            explanation: 'أخذتِ 1,27 كما هي دون إكمال التقريب إلى أقرب جزء من مئة.',
            remediation: 'انظري إلى الرقم التالي للخانة المطلوبة: في 1,277 الرقم في خانة الأجزاء من ألف هو 7 (أكبر من 5)، فنقرّب لأعلى فيصبح 1,28.',
            explanationFr: 'Vous avez gardé 1,27 tel quel, sans terminer l’arrondi au centième le plus proche.',
            remediationFr: 'Regardez le chiffre qui suit le rang demandé : dans 1,277 le chiffre des millièmes est 7 (plus grand que 5), donc on arrondit au-dessus : 1,28.',
            explanationEn: 'You kept 1.27 as it is, without finishing the rounding to the nearest hundredth.',
            remediationEn: 'Look at the digit after the place you need: in 1.277 the thousandths digit is 7 (greater than 5), so round up: 1.28.',
          },
          {
            id: 'mis_ar_round_wrong_place',
            trigger: '1,30',
            explanation: 'قرّبتِ إلى أقرب جزء من عشرة (1,30) بدل أقرب جزء من مئة.',
            remediation: 'المطلوب أقرب جزء من مئة، أي خانة ثانية بعد الفاصلة، فيكون الناتج 1,28 لا 1,30.',
            explanationFr: 'Vous avez arrondi au dixième le plus proche (1,30) au lieu du centième le plus proche.',
            remediationFr: 'On demande le centième le plus proche, c’est-à-dire la deuxième place après la virgule : le résultat est 1,28, pas 1,30.',
            explanationEn: 'You rounded to the nearest tenth (1.30) instead of the nearest hundredth.',
            remediationEn: 'The nearest hundredth is asked, that is the second place after the point: the result is 1.28, not 1.30.',
          },
        ],
        distractors: ['1,27|mis_ar_round_truncate', '1,30|mis_ar_round_wrong_place'],
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
        misconceptions: [
          {
            id: 'mis_ar_eq_expression',
            trigger: 'تعبير رياضي فقط (Expression)',
            explanation: 'ظننتِ أنها تعبير رياضي، لكن وجود علامة (=) هو الفيصل: بها تصبح الجملة معادلة لا تعبيراً.',
            remediation: 'التعبير جملة بلا علامة يساوي، مثل 56 - x. أما 56 - x = 47,5 ففيها (=) إذن هي معادلة.',
          },
          {
            id: 'mis_ar_eq_not_sentence',
            trigger: 'ليست جملة رياضية',
            explanation: 'اعتقدتِ أنها ليست جملة رياضية، لكن كل ما فيها متوازن حول علامة (=) فهو جملة رياضية صحيحة.',
            remediation: 'المعادلة جملة رياضية تحتوي متغيراً وعلامة (=) وتكون صحيحة أو خاطئة، وليست مجرد أرقام بلا معنى.',
          },
          {
            id: 'mis_ar_eq_no_solution',
            trigger: 'مسألة بدون حل',
            explanation: 'ظننتِ أنه لا حل لها، لكن وجود المتغير x يعني أن هناك قيمة واحدة تجعل الكفتين متساويتين.',
            remediation: 'المتغير لغز له حل واحد: في 56 - x = 47,5 يكون x = 8,5، فالمعادلة قابلة للحل.',
          },
          {
            id: 'mis_ar_var_add',
            trigger: '455',
            explanation: 'جمعتِ الطرفين بدل استخدام العملية العكسية: 180 + 275 = 455، وهذا ليس قيمة x.',
            remediation: 'لإيجاد x نستخدم العملية العكسية: 275 - 180 = 95، فقيمة x هي 95.',
            explanationFr: 'Vous avez additionné les deux membres au lieu d’utiliser l’opération inverse : 180 + 275 = 455, ce n’est pas la valeur de x.',
            remediationFr: 'Pour trouver x, on utilise l’opération inverse : 275 - 180 = 95, donc x = 95.',
            explanationEn: 'You added the two sides instead of using the inverse operation: 180 + 275 = 455, which is not the value of x.',
            remediationEn: 'To find x, use the inverse operation: 275 - 180 = 95, so x = 95.',
          },
          {
            id: 'mis_ar_var_wrong_side',
            trigger: '85',
            explanation: 'قربتِ جداً لكن الطرح انعكس؛ x = 95 وليس 85.',
            remediation: 'اطرحي العدد الأصغر من الأكبر: 275 - 180 = 95. تحققي: 180 + 95 = 275 ✔',
            explanationFr: 'Vous y êtes presque, mais la soustraction est inversée : x = 95 et non 85.',
            remediationFr: 'Soustrayez le plus petit du plus grand : 275 - 180 = 95. Vérifiez : 180 + 95 = 275 ✔',
            explanationEn: 'You are almost there, but the subtraction is reversed: x = 95, not 85.',
            remediationEn: 'Subtract the smaller from the larger: 275 - 180 = 95. Check: 180 + 95 = 275 ✔',
          },
          {
            id: 'mis_ar_var_guess',
            trigger: '100',
            explanation: 'قدّرتِ القيمة تقريباً بدل حسابها؛ 180 + 100 = 280 وليس 275.',
            remediation: 'احسبي الفرق بدقة: 275 - 180 = 95، ثم تحققي بالتعويض: 180 + 95 = 275 ✔',
            explanationFr: 'Vous avez estimé la valeur au lieu de la calculer : 180 + 100 = 280, pas 275.',
            remediationFr: 'Calculez la différence exactement : 275 - 180 = 95, puis vérifiez en remplaçant : 180 + 95 = 275 ✔',
            explanationEn: 'You estimated the value instead of computing it: 180 + 100 = 280, not 275.',
            remediationEn: 'Compute the difference exactly: 275 - 180 = 95, then check by substituting: 180 + 95 = 275 ✔',
          },
        ],
        distractors: ['تعبير رياضي فقط (Expression)|mis_ar_eq_expression', 'ليست جملة رياضية|mis_ar_eq_not_sentence', 'مسألة بدون حل|mis_ar_eq_no_solution', '455|mis_ar_var_add', '85|mis_ar_var_wrong_side', '100|mis_ar_var_guess'],
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
        misconceptions: [
          {
            id: 'mis_ar_prime_odd',
            trigger: 'فردياً',
            explanation: 'خلطتِ بين «أولي» و«فردي»؛ العدد 2 أولي لكنه زوجي، فليست كل الأعداد الفردية أولية ولا العكس.',
            remediation: 'الأولية تعني القسمة على 1 وعلى نفسه فقط، أما الزوجي والفردي فهي صفة أخرى. 9 فردي لكنه ليس أولياً.',
          },
          {
            id: 'mis_ar_prime_composite',
            trigger: 'مركباً',
            explanation: 'ظننتِ أن 2 عدد مركّب، لكن المركّب له عوامل غير 1 ونفسه، و2 ليس له.',
            remediation: 'قواسم 2 هي 1 و2 فقط، لذا هو أولي، وهو أصغر عدد أولي على الإطلاق.',
          },
          {
            id: 'mis_ar_prime_not_prime',
            trigger: 'أولياً',
            explanation: 'استبعدتِ 2 من الأعداد الأولية، لكنه أولي بالفعل: لا يقبل القسمة إلا على 1 وعلى نفسه.',
            remediation: 'العدد 1 وحده ليس أولياً لأنه له عامل واحد فقط؛ أما 2 فله عاملان، لذلك هو أولي.',
          },
          {
            id: 'mis_ar_prime_prod21',
            trigger: '21',
            explanation: 'حسبتِ 3 × 7 فقط ونسيتِ العامل 2: 3 × 7 = 21، لكن المطلوب 2 × 3 × 7.',
            remediation: 'اضربي العوامل الثلاثة كلها: 2 × 3 = 6، ثم 6 × 7 = 42.',
            explanationFr: 'Vous avez calculé 3 × 7 seulement et oublié le facteur 2 : 3 × 7 = 21, alors qu’on demande 2 × 3 × 7.',
            remediationFr: 'Multipliez les trois facteurs : 2 × 3 = 6, puis 6 × 7 = 42.',
            explanationEn: 'You computed 3 × 7 only and forgot the factor 2: 3 × 7 = 21, but 2 × 3 × 7 is asked.',
            remediationEn: 'Multiply all three factors: 2 × 3 = 6, then 6 × 7 = 42.',
          },
          {
            id: 'mis_ar_prime_prod35',
            trigger: '35',
            explanation: 'استخدمتِ العاملين 5 و7 بدل 3 و7: 5 × 7 = 35، وهذا ليس حاصل الضرب المطلوب.',
            remediation: 'العوامل المطلوبة هي 2 و3 و7 بالترتيب: 2 × 3 × 7 = 42.',
            explanationFr: 'Vous avez utilisé les facteurs 5 et 7 au lieu de 3 et 7 : 5 × 7 = 35, ce n’est pas le produit demandé.',
            remediationFr: 'Les facteurs demandés sont 2, 3 et 7 dans cet ordre : 2 × 3 × 7 = 42.',
            explanationEn: 'You used the factors 5 and 7 instead of 3 and 7: 5 × 7 = 35, which is not the product asked.',
            remediationEn: 'The factors asked are 2, 3 and 7 in that order: 2 × 3 × 7 = 42.',
          },
          {
            id: 'mis_ar_prime_prod12',
            trigger: '12',
            explanation: 'ضربتِ 2 × 3 = 6 ثم ضاعفتِ الناتج خطأً إلى 12 بدل ضربه في 7.',
            remediation: 'أكملي الضرب: بعد 2 × 3 = 6 اضربي في العامل الأخير 7 فيصبح 42.',
            explanationFr: 'Vous avez fait 2 × 3 = 6 puis doublé le résultat à tort jusqu’à 12, au lieu de le multiplier par 7.',
            remediationFr: 'Terminez la multiplication : après 2 × 3 = 6, multipliez par le dernier facteur 7 pour obtenir 42.',
            explanationEn: 'You did 2 × 3 = 6 and then wrongly doubled the result to 12 instead of multiplying it by 7.',
            remediationEn: 'Finish the multiplication: after 2 × 3 = 6, multiply by the last factor 7 to get 42.',
          },
        ],
        distractors: ['عدداً فردياً|mis_ar_prime_odd', 'عدداً مركباً|mis_ar_prime_composite', 'ليس عدداً أولياً|mis_ar_prime_not_prime', '21|mis_ar_prime_prod21', '35|mis_ar_prime_prod35', '12|mis_ar_prime_prod12'],
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
        misconceptions: [
          {
            id: 'mis_ar_gcd_pick_factor',
            trigger: '2',
            explanation: 'اخترتِ 2 لأنه يقسم العددين، لكن المطلوب أكبر عامل مشترك، لا أي عامل مشترك.',
            remediation: 'اكتبي عوامل كل عدد: عوامل 12 هي 1,2,3,4,6,12 وعوامل 16 هي 1,2,4,8,16؛ أكبر عامل مشترك هو 4.',
            explanationFr: 'Vous avez choisi 2 parce qu’il divise les deux nombres, mais on demande le plus grand diviseur commun, pas un diviseur commun quelconque.',
            remediationFr: 'Écrivez les diviseurs de chaque nombre : ceux de 12 sont 1,2,3,4,6,12 et ceux de 16 sont 1,2,4,8,16 ; le plus grand diviseur commun est 4.',
            explanationEn: 'You chose 2 because it divides both numbers, but the greatest common factor is asked, not just any common factor.',
            remediationEn: 'List the factors of each number: 12 gives 1,2,3,4,6,12 and 16 gives 1,2,4,8,16; the greatest common factor is 4.',
          },
          {
            id: 'mis_ar_gcd_pick_other_factor',
            trigger: '6',
            explanation: 'اخترتِ 6 وهو من عوامل 12 فقط، ولا يقسم 16.',
            remediation: 'العامل المشترك يجب أن يقسم العددين معاً؛ 6 لا يقسم 16، أما 4 فيقسمهما، لذا هو العامل المشترك الأكبر.',
            explanationFr: 'Vous avez choisi 6, qui est un diviseur de 12 seulement, et ne divise pas 16.',
            remediationFr: 'Un facteur commun doit diviser les deux nombres : 6 ne divise pas 16, alors que 4 divise les deux, c’est donc le plus grand diviseur commun.',
            explanationEn: 'You chose 6, which is a factor of 12 only and does not divide 16.',
            remediationEn: 'A common factor must divide both numbers: 6 does not divide 16, while 4 divides both, so it is the greatest common factor.',
          },
          {
            id: 'mis_ar_gcd_smaller_number',
            trigger: '12',
            explanation: 'اخترتِ 12 لأنه أحد العددين، لكنه لا يقسم 16.',
            remediation: 'العامل المشترك الأكبر لا يمكن أن يكون أكبر من أصغر العددين ولا بد أن يقسمهما؛ 4 هو الجواب.',
            explanationFr: 'Vous avez choisi 12 parce que c’est l’un des deux nombres, mais il ne divise pas 16.',
            remediationFr: 'Le plus grand diviseur commun ne peut pas dépasser le plus petit des deux nombres et doit diviser les deux ; la réponse est 4.',
            explanationEn: 'You chose 12 because it is one of the two numbers, but it does not divide 16.',
            remediationEn: 'The greatest common factor cannot be larger than the smaller number and must divide both; the answer is 4.',
          },
        ],
        distractors: ['2|mis_ar_gcd_pick_factor', '6|mis_ar_gcd_pick_other_factor', '12|mis_ar_gcd_smaller_number'],
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
        misconceptions: [
          {
            id: 'mis_ar_lcm_mult',
            trigger: '54',
            explanation: 'حسبتِ حاصل الضرب 6 × 9 = 54، لكن المضاعف المشترك الأصغر هو أصغر عدد يقبل القسمة على الاثنين معاً.',
            remediation: 'اكتبي مضاعفات العددين وخذي أول عدد مشترك: مضاعفات 6: 6، 12، 18… ومضاعفات 9: 9، 18… فأول لقاء عند 18.',
            explanationFr: 'Vous avez pris le produit 6 × 9 = 54, mais le plus petit commun multiple est le plus petit nombre divisible par les deux à la fois.',
            remediationFr: 'Écrivez les multiples des deux nombres et prenez le premier commun : multiples de 6 : 6, 12, 18… et de 9 : 9, 18… ; la première rencontre est 18.',
            explanationEn: 'You took the product 6 × 9 = 54, but the least common multiple is the smallest number divisible by both at once.',
            remediationEn: 'List the multiples of both numbers and take the first shared one: multiples of 6: 6, 12, 18… and of 9: 9, 18…; the first match is 18.',
          },
          {
            id: 'mis_ar_lcm_gcd',
            trigger: '3',
            explanation: 'أعطيتِ القاسم المشترك الأكبر (3) بدل المضاعف المشترك الأصغر.',
            remediation: 'القاسم الأكبر 3 يقسم العددين، لكن المضاعف الأصغر 18 هو الذي يقبل القسمة عليهما معاً.',
            explanationFr: 'Vous avez donné le plus grand diviseur commun (3) au lieu du plus petit commun multiple.',
            remediationFr: 'Le plus grand diviseur 3 divise bien les deux nombres, mais c’est le plus petit multiple 18 qui est divisible par les deux à la fois.',
            explanationEn: 'You gave the greatest common factor (3) instead of the least common multiple.',
            remediationEn: 'The greatest factor 3 does divide both numbers, but it is the least multiple 18 that is divisible by both at once.',
          },
          {
            id: 'mis_ar_lcm_sum',
            trigger: '12',
            explanation: 'جمعتِ العددين 6 + 9 = 15 أو استخدمتِ مضاعفاً أصغر من اللازم؛ 12 من مضاعفات 6 فقط وليس 9.',
            remediation: 'تحققي من الشرط: يجب أن يقبل العدد القسمة على 6 و9 معاً. 12 ÷ 9 لا تعطي عدداً صحيحاً، أما 18 فتعطي 3 و2.',
            explanationFr: 'Vous avez additionné les deux nombres (6 + 9 = 15) ou utilisé un multiple trop petit : 12 est un multiple de 6 seulement, pas de 9.',
            remediationFr: 'Vérifiez la condition : le nombre doit être divisible par 6 et 9 à la fois. 12 ÷ 9 ne donne pas un entier, alors que 18 donne 3 et 2.',
            explanationEn: 'You added the two numbers (6 + 9 = 15) or used a multiple that is too small: 12 is a multiple of 6 only, not of 9.',
            remediationEn: 'Check the condition: the number must be divisible by both 6 and 9. 12 ÷ 9 is not a whole number, while 18 gives 3 and 2.',
          },
        ],
        distractors: ['54|mis_ar_lcm_mult', '3|mis_ar_lcm_gcd', '12|mis_ar_lcm_sum'],
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
        misconceptions: [
          {
            id: 'mis_ar_area_60k',
            trigger: '60 000',
            explanation: 'أضفتِ صفراً زائداً: 200 × 30 = 6000 وليس 60000.',
            remediation: 'احسبي 2 × 3 = 6 ثم أضيفي عدد الأصفار: صفران في 200 وصفر واحد في 30 = ثلاثة أصفار، فيكون 6000.',
            explanationFr: 'Vous avez ajouté un zéro en trop : 200 × 30 = 6000 et non 60000.',
            remediationFr: 'Calculez 2 × 3 = 6 puis ajoutez le nombre de zéros : deux dans 200 et un dans 30 = trois zéros, donc 6000.',
            explanationEn: 'You added an extra zero: 200 × 30 = 6000, not 60000.',
            remediationEn: 'Compute 2 × 3 = 6 then add the zeros: two in 200 and one in 30 = three zeros, so 6000.',
          },
          {
            id: 'mis_ar_area_600',
            trigger: '600',
            explanation: 'أسقطتِ صفراً: 200 × 30 = 6000، لا 600.',
            remediation: 'عدّي الأصفار بدقة: صفران من 200 + صفر من 30 = ثلاثة أصفار بعد الـ 6، أي 6000.',
            explanationFr: 'Vous avez oublié un zéro : 200 × 30 = 6000, pas 600.',
            remediationFr: 'Comptez les zéros avec soin : deux zéros dans 200 + un zéro dans 30 = trois zéros après le 6, soit 6000.',
            explanationEn: 'You dropped a zero: 200 × 30 = 6000, not 600.',
            remediationEn: 'Count the zeros carefully: two zeros in 200 + one zero in 30 = three zeros after the 6, giving 6000.',
          },
          {
            id: 'mis_ar_area_60',
            trigger: '60',
            explanation: 'حسبتِ 2 × 30 = 60 وتجاهلتِ صفري المئات في 200.',
            remediation: 'لا تتجاهلي أصفار المراتب: 200 هي 2 × 100، فاضربي 6 × 100 = 6000.',
            explanationFr: 'Vous avez calculé 2 × 30 = 60 en ignorant les deux zéros des centaines dans 200.',
            remediationFr: 'N’ignorez pas les zéros des rangs : 200 = 2 × 100, donc multipliez 6 × 100 = 6000.',
            explanationEn: 'You computed 2 × 30 = 60 and ignored the two hundreds zeros in 200.',
            remediationEn: 'Do not ignore the place-value zeros: 200 = 2 × 100, so multiply 6 × 100 = 6000.',
          },
        ],
        distractors: ['600|mis_ar_area_600', '60 000|mis_ar_area_60k', '60|mis_ar_area_60'],
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
        misconceptions: [
          {
            id: 'mis_ar_alg_drop_comma',
            trigger: 'حذف الفاصلة',
            explanation: 'الفاصلة لا تُحذف في الضرب المعياري؛ الضرب الصحيح لا يحتاج حذف أي فاصلة.',
            remediation: 'نضرب الأرقام كما هي ثم نجمع الحواصل، ولا نحذف الفاصلة إلا في القسمة عند نقلها.',
          },
          {
            id: 'mis_ar_alg_subtract',
            trigger: 'طرح العددين',
            explanation: 'الخوارزمية المعيارية عملية ضرب وليست طرحاً؛ لا نطرح العددين.',
            remediation: 'اضربي عدد الآحاد ثم عدد العشرات في السطر الثاني، ثم اجمعي الحاصلين.',
          },
          {
            id: 'mis_ar_alg_times100',
            trigger: 'الضرب في 100',
            explanation: 'لا نضرب في 100 في الخوارزمية؛ الضرب في رقم العشرات يبدأ بوضع صفر في خانة الآحاد.',
            remediation: 'عند الضرب في رقم العشرات نكتب صفر الحفظ في الآحاد، لأن كل عشرة تساوي 10 أضعاف الوحدة.',
          },
        ],
        distractors: ['حذف الفاصلة|mis_ar_alg_drop_comma', 'طرح العددين|mis_ar_alg_subtract', 'الضرب في 100|mis_ar_alg_times100'],
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
        misconceptions: [
          {
            id: 'mis_ar_order_left_right',
            trigger: 'الجمع (12 + 24)',
            explanation: 'نفّذتِ الجمع أولاً لأنه على اليسار، لكن الضرب والقسمة أقوى من الجمع والطرح.',
            remediation: 'الأسبقية للقسمة: 24 ÷ 4 = 6 أولاً، ثم الجمع: 12 + 6 = 18.',
          },
          {
            id: 'mis_ar_order_both',
            trigger: 'كلاهما معاً',
            explanation: 'ظننتِ أن العمليتين تُنفَّذان معاً، لكن الترتيب يحدد عملية واحدة أولاً.',
            remediation: 'القسمة أقوى من الجمع، فنبدأ بها وحدها: 24 ÷ 4 = 6، ثم نجمع 12 + 6 = 18.',
          },
          {
            id: 'mis_ar_order_times',
            trigger: 'الضرب في 2',
            explanation: 'لا وجود لضرب في 2 في هذا التعبير؛ التعبير فيه جمع وقسمة فقط.',
            remediation: 'اقرئي التعبير جيداً: 12 + 24 ÷ 4. العملية الأولى الصحيحة هي القسمة 24 ÷ 4.',
          },
          {
            id: 'mis_ar_order_tens',
            trigger: '70',
            explanation: 'جمعتِ 10 + 4 أولاً ثم ضربتِ خطأً، أو طرحتِ بترتيب خاطئ؛ الناتج الصحيح 37.',
            remediation: 'الضرب قبل الطرح: 10 × 4 = 40 أولاً، ثم 40 - 3 = 37.',
            explanationFr: 'Vous avez d’abord fait 10 + 4 puis multiplié à tort, ou soustrait dans le mauvais ordre ; le résultat correct est 37.',
            remediationFr: 'La multiplication avant la soustraction : 10 × 4 = 40 d’abord, puis 40 - 3 = 37.',
            explanationEn: 'You first did 10 + 4 then multiplied by mistake, or subtracted in the wrong order; the correct result is 37.',
            remediationEn: 'Multiplication before subtraction: 10 × 4 = 40 first, then 40 - 3 = 37.',
          },
          {
            id: 'mis_ar_order_no_subtract',
            trigger: '10',
            explanation: 'طرحتِ قبل الضرب: 4 - 3 = 1 ثم ضربتِ في 10، لكن الضرب له الأولوية.',
            remediation: 'ابدئي بالضرب: 10 × 4 = 40، ثم اطرحي 3: 40 - 3 = 37.',
            explanationFr: 'Vous avez soustrait avant de multiplier : 4 - 3 = 1 puis × 10, mais la multiplication est prioritaire.',
            remediationFr: 'Commencez par la multiplication : 10 × 4 = 40, puis soustrayez 3 : 40 - 3 = 37.',
            explanationEn: 'You subtracted before multiplying: 4 - 3 = 1 then × 10, but multiplication has priority.',
            remediationEn: 'Start with the multiplication: 10 × 4 = 40, then subtract 3: 40 - 3 = 37.',
          },
        ],
        distractors: ['الجمع (12 + 24)|mis_ar_order_left_right', 'كلاهما معاً|mis_ar_order_both', 'الضرب في 2|mis_ar_order_times', '70|mis_ar_order_tens', '10|mis_ar_order_no_subtract'],
        visualType: 'diagram',
      },
    ],
  },
];

/**
 * Complete Grade 5 Term 1 units 4–6 gap fill for the Arabic mathematics track.
 * Titles follow the 2026/2027 curriculum index; the explanations, examples,
 * and formative questions are original Miss Noor teaching material.
 */
type MathGapSpec={
 id:string;unitNumber:4|5|6;lessonNumber:number;titleAr:string;titleEn:string;
 paragraphs:string[];vocabulary:{word:string;definition:string}[];
 questions:{question:string;options:string[];answer:string}[];
 keyPoints:string[];exampleAr:string;exampleEn:string;analogyAr:string;analogyEn:string;correction:string;
};
function makeMathGapLesson(spec:MathGapSpec):OfficialCurriculumLesson {
 const wrong=spec.questions.flatMap((q,qi)=>q.options.filter(o=>o!==q.answer).map((option,wi)=>({
  id:spec.id+'_mis_'+(qi+1)+'_'+(wi+1),trigger:option,
  explanation:'الاختيار «'+option+'» لا يطبق الفكرة الرياضية المطلوبة في هذا الدرس. '+spec.correction,
  remediation:'بص يا بطل، '+spec.correction,
 })));
 const unitNames={
  4:['الوحدة الرابعة: القسمة على أعداد صحيحة','Unit 4: Division of Whole Numbers'],
  5:['الوحدة الخامسة: عمليتا الضرب والقسمة مع الكسور العشرية','Unit 5: Multiplication and Division with Decimals'],
  6:['الوحدة السادسة: التعبيرات العددية والأنماط','Unit 6: Numerical Expressions and Patterns'],
 } as const;
 const unit=unitNames[spec.unitNumber];
 const conceptTitle=spec.titleAr;
 return {
  id:spec.id,subjectId:'subj_math',subjectNameAr:'الرياضيات',subjectNameEn:'Mathematics',
  unitNumber:spec.unitNumber,unitNameAr:unit[0],unitNameEn:unit[1],
  lessonNumber:spec.lessonNumber,titleAr:spec.titleAr,titleEn:spec.titleEn,
  sourceRef:{
   book:'فهرس منهج الرياضيات للصف الخامس الابتدائي 2026/2027 — الفصل الدراسي الأول',
   bookAr:'الرياضيات — الصف الخامس — الفصل الدراسي الأول 2026/2027',
   bookEn:'Grade 5 Mathematics Curriculum Index — Term 1 2026/2027',
   grade:'الصف الخامس',term:'الفصل الدراسي الأول 2026/2027',
   unit:unit[0],lesson:spec.titleAr,page:'غير محدد في الفهرس الإلكتروني',isAvailable:true,
  },
  objectives:[
   'يفسر '+spec.titleAr+' ويشرح خطوات تطبيقها باستخدام أمثلة مناسبة للصف الخامس.',
   'يحل تدريبات متنوعة على '+spec.titleAr+' ويتحقق من معقولية الناتج.',
   'يوظف '+spec.titleAr+' في موقف حياتي ويشرح طريقة الحل بترتيب واضح.',
  ],
  readingText:spec.paragraphs.join('\n\n'),
  vocabulary:spec.vocabulary,
  exercises:spec.questions.map(q=>({type:'multiple_choice' as const,question:q.question,options:q.options,expectedAnswer:q.answer})),
  originTag:'official',language:'ar',instructionLanguage:'ar',contentLanguage:'ar',assessmentLanguage:'ar',isAvailable:true,
  concepts:[{
   id:spec.id+'_c1',conceptNumber:1,titleAr:conceptTitle,titleEn:spec.titleEn,
   sourceText:spec.paragraphs.join(' '),keyPoints:spec.keyPoints,
   dailyLifeExampleAr:spec.exampleAr,dailyLifeExampleEn:spec.exampleEn,
   storyAnalogyAr:spec.analogyAr,storyAnalogyEn:spec.analogyEn,
   prerequisiteAr:'إتقان العمليات الحسابية الأساسية والقيمة المكانية للأعداد.',
   prerequisiteEn:'Fluency with basic arithmetic and place value.',
   visualType:'diagram',misconceptions:wrong,
   distractors:wrong.map(m=>m.trigger+'|'+m.id),
  }],
 };
}
const MATH_TERM_1_GAP_LESSONS:OfficialCurriculumLesson[]=[
/* Unit 4 — five lessons */
makeMathGapLesson({
id:'off_math_u4_l1_division_area_model',unitNumber:4,lessonNumber:1,
titleAr:'القسمة باستخدام نموذج مساحة المستطيل',titleEn:'Division Using an Area Model',
paragraphs:[
'يساعدنا نموذج مساحة المستطيل على فهم القسمة بتقسيم العدد إلى أجزاء يسهل قسمتها. نمثل المقسوم بمساحة المستطيل، ونكتب المقسوم عليه على أحد الأضلاع، ثم نبحث عن الأجزاء التي تكوّن المساحة.',
'مثلاً لإيجاد 156 ÷ 12 يمكن تقسيم 156 إلى 120 و36. نقسم 120 ÷ 12 = 10، ثم 36 ÷ 12 = 3، ونجمع الجزأين: 10 + 3 = 13. إذن خارج القسمة 13.',
'يمكن استخدام النموذج عندما تكون القسمة على عدد من رقمين؛ فهو يوضح كيف نجزئ العدد ونحسب خارج القسمة خطوة خطوة بدلاً من تخمين الناتج.'
],
vocabulary:[{word:'المقسوم',definition:'العدد الذي نريد تقسيمه.'},{word:'المقسوم عليه',definition:'العدد الذي نقسم عليه.'},{word:'خارج القسمة',definition:'الناتج الذي نحصل عليه بعد القسمة.'}],
questions:[
{question:'باستخدام التجزئة، ما ناتج 156 ÷ 12 إذا قسمنا 156 إلى 120 و36؟',options:['13','12','14','23'],answer:'13'},
{question:'في نموذج مساحة المستطيل للقسمة، ماذا يمثل مجموع الأجزاء أعلى المستطيل؟',options:['خارج القسمة','المقسوم عليه','الباقي دائماً','المقسوم فقط'],answer:'خارج القسمة'}
],
keyPoints:['نقسم المقسوم إلى أجزاء مناسبة للقسمة على العدد نفسه.','نحسب خارج قسمة كل جزء ثم نجمع النواتج.','النموذج يوضح العلاقة بين المساحة والضرب والقسمة.'],
exampleAr:'تقسيم 240 كتاباً بالتساوي على 12 رفاً: نستخدم النموذج لإيجاد 240 ÷ 12 = 20 كتاباً لكل رف.',
exampleEn:'Sharing 240 books equally across 12 shelves gives 20 books per shelf.',
analogyAr:'النموذج مثل تقسيم فطيرة كبيرة إلى قطع معروفة؛ نحسب كل جزء ثم نجمع الأجزاء.',
analogyEn:'The model is like splitting a large pie into known pieces and adding the pieces.',
correction:'جزّئ المقسوم إلى مضاعفات سهلة للمقسوم عليه، اقسم كل جزء، ثم اجمع نواتج القسمة.'
}),
makeMathGapLesson({
id:'off_math_u4_l2_estimate_quotients',unitNumber:4,lessonNumber:2,
titleAr:'تقدير خارج القسمة',titleEn:'Estimating Quotients',
paragraphs:[
'التقدير يساعدنا على توقع ناتج القسمة قبل إجراء الحساب الدقيق. نختار أعداداً قريبة وسهلة القسمة، مع المحافظة على قيمة تقريبية مناسبة للمقسوم والمقسوم عليه.',
'مثلاً يمكن تقدير 5,600 ÷ 70 باستخدام 56 ÷ 7، ثم نعيد النظر في قيمة المنازل: 5,600 ÷ 70 = 80. يساعد التقدير على اكتشاف الإجابات غير المعقولة.',
'التقدير لا يعطي الناتج الدقيق دائماً، لكنه يقدم قيمة قريبة نستخدمها للتحقق من أن الناتج الفعلي منطقي.'
],
vocabulary:[{word:'التقدير',definition:'إيجاد قيمة قريبة من الناتج دون حساب دقيق.'},{word:'عدد متوافق',definition:'عدد يسهل إجراء العملية الحسابية عليه.'},{word:'معقولية الناتج',definition:'مدى قرب الناتج من القيمة المتوقعة.'}],
questions:[
{question:'ما التقدير المناسب لناتج 5,600 ÷ 70؟',options:['80','8','800','70'],answer:'80'},
{question:'ما فائدة تقدير خارج القسمة؟',options:['التحقق من معقولية الناتج','إلغاء الحاجة إلى القسمة دائماً','الحصول على الناتج الدقيق في كل مرة','تغيير المقسوم عليه'],answer:'التحقق من معقولية الناتج'}
],
keyPoints:['نستخدم أعداداً متوافقة لتسهيل القسمة ذهنياً.','نحافظ على قيمة المنازل عند التقدير.','التقدير للتحقق وليس بديلاً دائماً عن الحل الدقيق.'],
exampleAr:'قبل حساب تكلفة تقسيم 1,200 قطعة على 30 صندوقاً، نتوقع أن يكون الناتج قريباً من 40 قطعة للصندوق.',
exampleEn:'Before dividing 1,200 items into 30 boxes, we estimate about 40 items per box.',
analogyAr:'التقدير مثل النظر إلى الخريطة قبل الرحلة؛ يعطينا فكرة عن المسافة ولا يغني عن الطريق الدقيق.',
analogyEn:'Estimation is like checking a map before a trip: it gives a useful idea, not every exact turn.',
correction:'اختاري أعداداً قريبة سهلة القسمة، وانتبهِي إلى الأصفار وقيمة المنازل.'
}),
makeMathGapLesson({
id:'off_math_u4_l3_division_algorithm',unitNumber:4,lessonNumber:3,
titleAr:'استخدام خوارزمية القسمة',titleEn:'Using the Division Algorithm',
paragraphs:[
'الخوارزمية المعيارية للقسمة طريقة منظمة لقسمة عدد على عدد آخر. نبدأ بتقدير كم مرة يدخل المقسوم عليه في الجزء الأول من المقسوم، ثم نضرب ونطرح وننزل الرقم التالي.',
'تتكرر الخطوات: اقسم، اضرب، اطرح، ثم أنزل الرقم التالي. يجب أن يكون كل رقم في خارج القسمة في مكانه الصحيح، وأن يكون الباقي في نهاية العملية أصغر من المقسوم عليه.',
'يمكن التحقق من الإجابة باستخدام العلاقة: المقسوم = المقسوم عليه × خارج القسمة + الباقي. إذا لم تتحقق العلاقة نراجع خطواتنا.'
],
vocabulary:[{word:'الخوارزمية المعيارية',definition:'خطوات مرتبة وثابتة لإجراء عملية حسابية.'},{word:'الباقي',definition:'الكمية التي تبقى بعد القسمة ولا تكوّن مجموعة كاملة.'},{word:'التحقق',definition:'إعادة فحص الإجابة باستخدام عملية عكسية.'}],
questions:[
{question:'ما ناتج 756 ÷ 22؟',options:['34 والباقي 8','33 والباقي 10','35 والباقي 4','32 والباقي 12'],answer:'34 والباقي 8'},
{question:'أي ترتيب يصف خطوات القسمة المطولة؟',options:['اقسم ثم اضرب ثم اطرح ثم أنزل','اجمع ثم اضرب ثم اقسم ثم اطرح','اضرب ثم اجمع ثم أنزل ثم اطرح','اطرح ثم اجمع ثم اضرب ثم اقسم'],answer:'اقسم ثم اضرب ثم اطرح ثم أنزل'}
],
keyPoints:['نكرر خطوات القسمة بترتيب ثابت.','يجب أن يكون الباقي النهائي أصغر من المقسوم عليه.','نستخدم الضرب والجمع للتحقق من الناتج والباقي.'],
exampleAr:'قسمة 756 قطعة بالتساوي على 22 مجموعة تعطي 34 قطعة لكل مجموعة ويتبقى 8.',
exampleEn:'Dividing 756 items into groups of 22 gives 34 full groups with 8 left over.',
analogyAr:'الخوارزمية مثل وصفة طبخ؛ ترتيب الخطوات مهم حتى نحصل على نتيجة صحيحة.',
analogyEn:'The algorithm is like a recipe: the order of steps matters.',
correction:'اتبعي الترتيب اقسم، اضرب، اطرح، أنزل، ثم تحققي من أن الباقي أصغر من المقسوم عليه.'
}),
makeMathGapLesson({
id:'off_math_u4_l4_division_multiplication_inverse',unitNumber:4,lessonNumber:4,
titleAr:'علاقة القسمة بالضرب',titleEn:'The Relationship Between Division and Multiplication',
paragraphs:[
'الضرب والقسمة عمليتان عكسيتان؛ فالضرب يكوّن مجموعات متساوية، والقسمة تساعدنا على معرفة عدد المجموعات أو عدد العناصر في كل مجموعة.',
'إذا عرفنا أن 12 × 8 = 96، فيمكننا معرفة أن 96 ÷ 12 = 8 وأن 96 ÷ 8 = 12. تساعدنا حقائق الضرب على حل القسمة بسرعة والتحقق من الإجابة.',
'عند وجود باقٍ نستخدم العلاقة: المقسوم = المقسوم عليه × خارج القسمة + الباقي. ويجب أن يكون الباقي أقل من المقسوم عليه.'
],
vocabulary:[{word:'عملية عكسية',definition:'عملية تساعد على الرجوع من الناتج إلى أحد العوامل.'},{word:'حقيقة الضرب',definition:'جملة ضرب صحيحة تربط ثلاثة أعداد.'},{word:'الباقي',definition:'ما يتبقى بعد تكوين مجموعات متساوية كاملة.'}],
questions:[
{question:'إذا كان 12 × 8 = 96، فما ناتج 96 ÷ 12؟',options:['8','12','84','108'],answer:'8'},
{question:'أي جملة تتحقق من قسمة 200 على 17 خارجها 11 والباقي 13؟',options:['17 × 11 + 13 = 200','17 + 11 + 13 = 200','17 × 13 + 11 = 200','200 × 17 = 11'],answer:'17 × 11 + 13 = 200'}
],
keyPoints:['الضرب والقسمة عمليتان عكسيتان.','حقائق الضرب تساعد على إيجاد خارج القسمة.','التحقق مع الباقي يكون بضرب المقسوم عليه في الخارج ثم إضافة الباقي.'],
exampleAr:'إذا وزعنا 48 قلماً على 6 تلاميذ، نستخدم 6 × 8 = 48 لنعرف أن كل تلميذ يأخذ 8 أقلام.',
exampleEn:'Sharing 48 pencils among 6 pupils gives 8 each because 6 × 8 = 48.',
analogyAr:'الضرب والقسمة مثل طريقين متعاكسين يصلان بين الأعداد نفسها.',
analogyEn:'Multiplication and division are two opposite routes connecting the same numbers.',
correction:'حوّلي القسمة إلى سؤال ضرب، ثم استخدمي العلاقة العكسية للتحقق.'
}),
makeMathGapLesson({
id:'off_math_u4_l5_multistep_word_problems',unitNumber:4,lessonNumber:5,
titleAr:'مسائل كلامية متعددة الخطوات',titleEn:'Multi-step Word Problems',
paragraphs:[
'المسألة متعددة الخطوات تحتاج إلى أكثر من عملية حسابية للوصول إلى الإجابة. نقرأ المسألة بعناية، ونحدد المعلومات المعطاة والمطلوب، ثم نختار العمليات بالترتيب المناسب.',
'قد نحتاج إلى الجمع أو الطرح قبل القسمة، أو إلى الضرب ثم القسمة. من المهم كتابة خطوة وسيطة وتفسير معناها، وعدم اختيار العملية اعتماداً على كلمة واحدة فقط.',
'بعد الحل نراجع الوحدة والسياق: هل المطلوب عدد مجموعات كاملة أم عدد عناصر في كل مجموعة؟ وهل للباقي معنى في الموقف؟'
],
vocabulary:[{word:'مسألة متعددة الخطوات',definition:'مسألة تحتاج إلى عمليتين أو أكثر لحلها.'},{word:'المعطيات',definition:'الأعداد والمعلومات الواردة في المسألة.'},{word:'المطلوب',definition:'السؤال الذي نبحث عن إجابته.'}],
questions:[
{question:'لدى متجر 350 كعكة، وضع 12 كعكة في كل كيس. كم كيساً ممتلئاً يمكن تكوينه؟',options:['29','28','30','31'],answer:'29'},
{question:'ما أول خطوة مناسبة قبل حل مسألة كلامية متعددة الخطوات؟',options:['تحديد المعطيات والمطلوب','اختيار أكبر عدد','إجراء كل العمليات عشوائياً','تجاهل وحدات القياس'],answer:'تحديد المعطيات والمطلوب'}
],
keyPoints:['نحدد المعطيات والمطلوب قبل اختيار العمليات.','نكتب الحل على خطوات ونفسر كل ناتج وسيط.','نفسر الباقي وفق سياق المسألة.'],
exampleAr:'لحساب عدد الصناديق المطلوبة، نحسب أولاً عدد القطع ثم نقسمه على سعة الصندوق.',
exampleEn:'To find the number of boxes needed, first count the items, then divide by each box capacity.',
analogyAr:'حل المسألة مثل ترتيب قطع الأحجية؛ نضع كل معلومة في مكانها قبل رؤية الصورة كاملة.',
analogyEn:'Solving a word problem is like assembling a puzzle: each piece must fit.',
correction:'اقرئي المطلوب، اكتبي المعطيات، حددي ترتيب العمليات، ثم فسري الناتج والباقي.'
}),
/* Unit 5 — thirteen lessons */
makeMathGapLesson({
id:'off_math_u5_l1_multiply_powers_ten',unitNumber:5,lessonNumber:1,
titleAr:'الضرب في قوى العدد 10',titleEn:'Multiplying by Powers of Ten',
paragraphs:[
'عند ضرب عدد عشري في 10 أو 100 أو 1000 تتغير قيمة منازله؛ فينتقل كل رقم إلى منزلة أكبر، وتصبح قيمة العدد أكبر عشر مرات أو مئة مرة أو ألف مرة.',
'مثلاً 4.25 × 10 = 42.5، و4.25 × 100 = 425. نستخدم القيمة المكانية لفهم انتقال الأرقام بدلاً من الاعتماد على تحريك العلامة العشرية دون فهم.',
'عند الضرب في 0.1 أو 0.01 تقل قيمة العدد؛ فالضرب في 0.1 يكافئ القسمة على 10.'
],
vocabulary:[{word:'قوة العدد 10',definition:'عدد مثل 10 أو 100 أو 1000 نستخدمه لتغيير قيمة المنازل.'},{word:'القيمة المكانية',definition:'قيمة الرقم بحسب مكانه في العدد.'},{word:'جزء من عشرة',definition:'واحد من عشرة أجزاء متساوية من الواحد الصحيح.'}],
questions:[
{question:'ما ناتج 4.25 × 10؟',options:['42.5','0.425','4.025','4250'],answer:'42.5'},
{question:'الضرب في 100 يجعل العدد أكبر بمقدار:',options:['100 مرة','10 مرات','مرة واحدة','1000 مرة'],answer:'100 مرة'}
],
keyPoints:['الضرب في 10 ينقل كل رقم منزلة إلى اليسار في جدول القيمة المكانية.','الضرب في 100 أو 1000 يغير القيمة بمقدار 100 أو 1000 مرة.','الضرب في 0.1 يعادل القسمة على 10.'],
exampleAr:'إذا كان طول شريط 1.25 متر، فإن طوله بالسنتيمترات 125 سم لأننا نضرب في 100.',
exampleEn:'A 1.25-metre ribbon is 125 centimetres because we multiply by 100.',
analogyAr:'القيمة المكانية مثل مصعد؛ كل انتقال لمنزلة أكبر يجعل قيمة الرقم أكبر عشر مرات.',
analogyEn:'Place value is like an elevator: moving one place to a larger unit multiplies value by ten.',
correction:'حددي قوة العدد 10 أولاً، ثم راقبي عدد المنازل التي تتغير قيمتها.'
}),
makeMathGapLesson({
id:'off_math_u5_l2_decimal_times_whole',unitNumber:5,lessonNumber:2,
titleAr:'ضرب الكسور العشرية في أعداد صحيحة',titleEn:'Multiplying Decimals by Whole Numbers',
paragraphs:[
'يمكن ضرب كسر عشري في عدد صحيح باستخدام معنى الضرب بوصفه جمعاً متكرراً. فإذا كان ثمن القلم 2.5 جنيه واشترينا 4 أقلام، نحسب 2.5 × 4.',
'نضرب الأعداد كما لو كانت أعداداً صحيحة، ثم نحدد موضع العلامة العشرية وفق عدد المنازل العشرية في العوامل. ويمكن التحقق بالتقدير أو باستخدام الجمع المتكرر.',
'من المهم تقدير الناتج قبل الحساب؛ فـ 2.5 × 4 قريب من 2 × 4 وأكثر من ذلك بقليل، لذلك الناتج 10 معقول.'
],
vocabulary:[{word:'كسر عشري',definition:'عدد يحتوي على علامة عشرية ويمثل أجزاء من الواحد.'},{word:'الضرب',definition:'جمع مجموعات متساوية أو إيجاد حاصل تكرار عدد.'},{word:'الناتج',definition:'القيمة التي نحصل عليها بعد إجراء العملية.'}],
questions:[
{question:'ما ناتج 2.5 × 4؟',options:['10','1','100','6.5'],answer:'10'},
{question:'ما الطريقة المناسبة للتحقق من ناتج ضرب 3.2 × 5؟',options:['تقدير الناتج أو الجمع المتكرر','طرح 5 من 3.2','قسمة 3.2 على 5 فقط','تجاهل العلامة العشرية'],answer:'تقدير الناتج أو الجمع المتكرر'}
],
keyPoints:['يمكن تفسير الضرب في عدد صحيح بوصفه جمعاً متكرراً.','نضرب الأرقام ثم نضع العلامة العشرية في موضعها الصحيح.','التقدير يساعد على كشف الأخطاء.'],
exampleAr:'شراء 4 زجاجات ماء ثمن الواحدة 2.5 جنيه يكلف 10 جنيهات.',
exampleEn:'Four water bottles at 2.5 pounds each cost 10 pounds.',
analogyAr:'ضرب الكسر العشري في عدد صحيح مثل تكرار كوب عصير نصف لتر عدة مرات.',
analogyEn:'Multiplying a decimal by a whole number is like repeating a half-litre serving.',
correction:'اضربي القيمة دون العلامة أولاً، ثم راجعي عدد المنازل العشرية وقدّري الناتج.'
}),
makeMathGapLesson({
id:'off_math_u5_l3_tenths_times_tenths',unitNumber:5,lessonNumber:3,
titleAr:'ضرب الأجزاء من عشرة في أجزاء من عشرة',titleEn:'Multiplying Tenths by Tenths',
paragraphs:[
'الجزء من عشرة يساوي 0.1. وعند ضرب 0.1 في 0.1 نحصل على 0.01، أي جزء من مائة؛ لأننا نأخذ عُشر عُشر.',
'يمكن تمثيل ذلك بشبكة من 100 مربع: تظليل عُشر الصف ثم عُشر العمود يحدد مربعاً واحداً من مائة. ويساعد النموذج على فهم سبب وجود منزلتين عشريتين في الناتج.',
'عند ضرب كسرين عشريين نضرب الأرقام أولاً، ثم نضع العلامة العشرية بحيث يساوي عدد المنازل العشرية في الناتج مجموع المنازل في العاملين.'
],
vocabulary:[{word:'عُشر',definition:'جزء واحد من عشرة أجزاء متساوية.'},{word:'جزء من مائة',definition:'جزء واحد من مئة جزء متساوٍ.'},{word:'شبكة المائة',definition:'مربع مقسم إلى 100 جزء متساوٍ لتمثيل الكسور.'}],
questions:[
{question:'ما ناتج 0.3 × 0.4؟',options:['0.12','1.2','0.012','12'],answer:'0.12'},
{question:'ما ناتج 0.1 × 0.1؟',options:['0.01','0.1','1','0.001'],answer:'0.01'}
],
keyPoints:['عُشر عُشر يساوي جزءاً من مائة.','نموذج شبكة المائة يوضح ناتج الضرب بصرياً.','عدد المنازل العشرية في الناتج يساوي مجموعها في العاملين.'],
exampleAr:'إذا كان طول قطعة 0.3 متر وعرضها 0.4 متر، فمساحتها 0.12 متر مربع.',
exampleEn:'A rectangle 0.3 m by 0.4 m has an area of 0.12 square metres.',
analogyAr:'العُشر مثل تقسيم لوح إلى عشرة أجزاء؛ وعُشر هذا الجزء يصبح جزءاً صغيراً من مائة.',
analogyEn:'A tenth is one strip out of ten; a tenth of that strip is one hundredth.',
correction:'عدّي المنازل العشرية في العاملين واجمعيها، ثم مثّلي الناتج على شبكة المائة.'
}),
makeMathGapLesson({
id:'off_math_u5_l4_decimal_area_model',unitNumber:5,lessonNumber:4,
titleAr:'ضرب الكسور العشرية باستخدام نموذج مساحة المستطيل',titleEn:'Multiplying Decimals with an Area Model',
paragraphs:[
'نموذج مساحة المستطيل يساعد على ضرب كسرين عشريين بتقسيم كل ضلع إلى أجزاء صحيحة وأجزاء عشرية. نضرب كل جزء في الجزء المقابل له، ثم نجمع المساحات الصغيرة.',
'مثلاً في 1.2 × 1.3 نقسم 1.2 إلى 1 و0.2، ونقسم 1.3 إلى 1 و0.3. نوجد مساحات الأجزاء الأربع ثم نجمعها للحصول على 1.56.',
'يعرض النموذج معنى الضرب بوصفه مساحة، ويساعد على فهم موضع العلامة العشرية بدلاً من حفظ قاعدة دون تفسير.'
],
vocabulary:[{word:'المساحة',definition:'مقدار السطح الذي يغطيه شكل مستوٍ.'},{word:'نموذج المساحة',definition:'رسم يقسم المستطيل إلى أجزاء لتوضيح الضرب.'},{word:'التجزئة',definition:'تقسيم العدد إلى أجزاء يسهل التعامل معها.'}],
questions:[
{question:'ما ناتج 1.2 × 1.3؟',options:['1.56','15.6','0.156','2.5'],answer:'1.56'},
{question:'في نموذج مساحة المستطيل، ماذا نفعل بعد حساب مساحات الأجزاء؟',options:['نجمع مساحات الأجزاء','نطرح كل المساحات','نقسم على أحد الأضلاع فقط','نحذف الأجزاء العشرية'],answer:'نجمع مساحات الأجزاء'}
],
keyPoints:['نقسم كل عامل إلى أجزاء صحيحة وعشرية.','نحسب مساحة كل مستطيل صغير.','نجمع المساحات الجزئية للحصول على الناتج.'],
exampleAr:'لحساب مساحة لوحة طولها 1.2 متر وعرضها 1.3 متر نستخدم نموذج المساحة ونحصل على 1.56 متر مربع.',
exampleEn:'A 1.2 m by 1.3 m board has an area of 1.56 square metres.',
analogyAr:'النموذج مثل تقسيم حديقة إلى أحواض صغيرة؛ نحسب مساحة كل حوض ثم نجمعها.',
analogyEn:'The model is like dividing a garden into smaller beds and adding their areas.',
correction:'قسّمي الضلعين، احسبي نواتج الضرب الجزئية، ثم اجمعيها كلها.'
}),
makeMathGapLesson({
id:'off_math_u5_l5_decimal_hundredths',unitNumber:5,lessonNumber:5,
titleAr:'ضرب الكسور العشرية حتى جزء من مائة',titleEn:'Multiplying Decimals to Hundredths',
paragraphs:[
'عند ضرب كسور عشرية قد يحتوي كل عامل على منزلتين عشريتين أو أقل. نضرب الأرقام كما لو كانت صحيحة، ثم نحدد عدد المنازل العشرية في الناتج بجمع منازل العاملين.',
'مثلاً 0.25 × 0.4: نضرب 25 × 4 = 100، وفي العاملين ثلاث منازل عشرية معاً، فيكون الناتج 0.100 أي 0.1.',
'يجب أن نميز بين قيمة الرقم وعدد الأرقام المكتوبة بعد العلامة؛ فالأصفار في نهاية الكسر العشري لا تغير قيمته.'
],
vocabulary:[{word:'جزء من مائة',definition:'منزلة الرقم الثانية يمين العلامة العشرية.'},{word:'عامل',definition:'عدد يدخل في عملية الضرب.'},{word:'منزلة عشرية',definition:'موضع رقم بعد العلامة العشرية.'}],
questions:[
{question:'ما ناتج 0.25 × 0.4؟',options:['0.1','1.0','0.01','10'],answer:'0.1'},
{question:'كم منزلة عشرية توجد في ناتج ضرب 0.25 × 0.4 قبل حذف الصفر النهائي؟',options:['ثلاث منازل','منزلة واحدة','منزلتان','أربع منازل'],answer:'ثلاث منازل'}
],
keyPoints:['نضرب الأرقام أولاً دون العلامة العشرية.','نجمع عدد المنازل العشرية في العاملين.','يمكن حذف الصفر النهائي دون تغيير القيمة.'],
exampleAr:'إذا كان ثمن 0.4 كجم من الفاكهة 0.25 من سعر الكيلو، نستخدم الضرب لإيجاد الجزء المناسب من السعر.',
exampleEn:'Decimal multiplication can calculate a fractional part of a unit price.',
analogyAr:'العلامة العشرية مثل الفاصل بين الوحدات والأجزاء؛ لا نضعها عشوائياً.',
analogyEn:'The decimal point separates whole units from parts and must be placed carefully.',
correction:'اجمعي المنازل العشرية في العاملين، ثم ضعي العلامة في الناتج مع الحفاظ على قيمته.'
}),
makeMathGapLesson({
id:'off_math_u5_l6_decimal_thousandths',unitNumber:5,lessonNumber:6,
titleAr:'ضرب الكسور العشرية حتى جزء من ألف',titleEn:'Multiplying Decimals to Thousandths',
paragraphs:[
'قد نحتاج إلى ضرب أعداد تحتوي على أجزاء من ألف، مثل 0.125. نتبع الخطوات نفسها: نضرب الأرقام ثم نحدد عدد المنازل العشرية في الناتج.',
'إذا ضربنا 0.125 × 2 فإن الناتج 0.250، وهو يساوي 0.25. وإذا ضربنا 0.125 × 0.4 فيجب جمع ثلاث منازل في العامل الأول ومنزلة في الثاني.',
'تساعدنا الأجزاء من ألف في التعبير عن قياسات دقيقة مثل الكتل والأطوال، لذلك يجب الانتباه إلى القيمة المكانية وعدم حذف أرقام مؤثرة.'
],
vocabulary:[{word:'جزء من ألف',definition:'جزء واحد من ألف جزء متساوٍ من الواحد الصحيح.'},{word:'الدقة',definition:'مدى قرب القياس أو الناتج من القيمة الحقيقية.'},{word:'صفر نهائي',definition:'صفر في نهاية كسر عشري لا يغير قيمته.'}],
questions:[
{question:'ما ناتج 0.125 × 2؟',options:['0.25','2.5','0.025','0.0125'],answer:'0.25'},
{question:'أي عدد يساوي 0.250؟',options:['0.25','2.50','0.025','25'],answer:'0.25'}
],
keyPoints:['نستخدم القيمة المكانية حتى الأجزاء من ألف.','عدد المنازل العشرية في الناتج يساوي مجموعها في العاملين.','يمكن حذف الأصفار النهائية فقط إذا لم تتغير القيمة.'],
exampleAr:'ميزان دقيق قد يعرض كتلة 0.125 كجم؛ ضربها في 2 يعطي 0.25 كجم.',
exampleEn:'Doubling a 0.125 kg measurement gives 0.25 kg.',
analogyAr:'الأجزاء من ألف مثل تقسيم متر إلى ألف جزء صغير لقياس طول بدقة.',
analogyEn:'Thousandths are like splitting a metre into a thousand tiny parts.',
correction:'احتفظي بجميع المنازل أثناء الضرب، ثم تحققي من قيمة الناتج قبل حذف أي صفر.'
}),
makeMathGapLesson({
id:'off_math_u5_l7_decimals_metric_system',unitNumber:5,lessonNumber:7,
titleAr:'الكسور العشرية والنظام المتري',titleEn:'Decimals and the Metric System',
paragraphs:[
'يعتمد النظام المتري على وحدات مرتبطة بقوى العدد 10، مثل المتر والسنتيمتر والمليمتر، واللتر والمليلتر، والكيلوجرام والجرام. لذلك يمكن كتابة التحويلات باستخدام الكسور العشرية.',
'في الطول: 1 متر = 100 سنتيمتر، و1 سنتيمتر = 10 مليمترات. وفي الكتلة: 1 كيلوجرام = 1000 جرام. نختار الضرب أو القسمة بحسب الانتقال إلى وحدة أصغر أو أكبر.',
'عند التحويل من وحدة كبيرة إلى وحدة أصغر تزداد القيمة العددية، وعند التحويل إلى وحدة أكبر تقل القيمة العددية مع بقاء المقدار نفسه.'
],
vocabulary:[{word:'النظام المتري',definition:'نظام قياس يستخدم وحدات مترابطة بعوامل العدد 10.'},{word:'سنتيمتر',definition:'جزء من مائة من المتر.'},{word:'مليمتر',definition:'جزء من ألف من المتر.'}],
questions:[
{question:'كم سنتيمتراً في 1.5 متر؟',options:['150 سم','15 سم','1.5 سم','1500 سم'],answer:'150 سم'},
{question:'كم جراماً في 2 كيلوجرام؟',options:['2000 جرام','200 جرام','20 جراماً','2 جرام'],answer:'2000 جرام'}
],
keyPoints:['وحدات النظام المتري ترتبط بقوى العدد 10.','التحويل إلى وحدة أصغر يزيد العدد، وإلى أكبر يقلله.','نكتب الوحدة في الإجابة حتى لا نخلط بين القياسات.'],
exampleAr:'زجاجة سعتها 1.5 لتر تساوي 1500 مليلتر.',
exampleEn:'A 1.5-litre bottle holds 1,500 millilitres.',
analogyAr:'الوحدات مثل درجات سلم؛ كل درجة تغير مقدار الوحدة بعشرة أو مائة أو ألف.',
analogyEn:'Metric units are like steps on a ladder, changing by tens, hundreds, or thousands.',
correction:'حددي الوحدة التي تبدأين منها والوحدة المطلوبة، ثم اختاري الضرب أو القسمة بقوة العدد 10.'
}),
makeMathGapLesson({
id:'off_math_u5_l8_measurement_decimals_powers_ten',unitNumber:5,lessonNumber:8,
titleAr:'القياس والكسور العشرية وقوى العدد 10',titleEn:'Measurement, Decimals, and Powers of Ten',
paragraphs:[
'تظهر الكسور العشرية في القياس اليومي للأطوال والكتل والسعات. نستخدم قوى العدد 10 للتحويل بين وحدات النظام المتري أو لتغيير طريقة كتابة القياس.',
'مثلاً 0.75 متر يساوي 75 سنتيمتراً، لأننا نضرب في 100. و3500 جرام تساوي 3.5 كيلوجرام، لأننا نقسم على 1000.',
'قبل إجراء التحويل نكتب الوحدة الأصلية والوحدة المطلوبة، ثم نحدد عامل التحويل ونراجع أن العدد الناتج يناسب حجم القياس.'
],
vocabulary:[{word:'عامل التحويل',definition:'عدد نضرب أو نقسم به للانتقال بين وحدات القياس.'},{word:'السعة',definition:'مقدار ما يمكن أن يحتويه الوعاء من سائل.'},{word:'الكتلة',definition:'مقدار ما يحتويه الجسم من مادة.'}],
questions:[
{question:'ما قيمة 0.75 متر بالسنتيمتر؟',options:['75 سم','7.5 سم','750 سم','0.075 سم'],answer:'75 سم'},
{question:'ما قيمة 3500 جرام بالكيلوجرام؟',options:['3.5 كجم','35 كجم','350 كجم','0.35 كجم'],answer:'3.5 كجم'}
],
keyPoints:['نستخدم قوى العدد 10 للتحويل بين وحدات القياس.','التحويل من متر إلى سنتيمتر يكون بالضرب في 100.','التحويل من جرام إلى كيلوجرام يكون بالقسمة على 1000.'],
exampleAr:'طول طاولة 0.8 متر يساوي 80 سنتيمتراً.',
exampleEn:'A table that is 0.8 metres long is 80 centimetres long.',
analogyAr:'عامل التحويل مثل مفتاح يبدل اسم الوحدة مع الحفاظ على المقدار نفسه.',
analogyEn:'A conversion factor is like a key that changes the unit while preserving the amount.',
correction:'اكتبي عامل التحويل المناسب، ونفذي العملية، ثم تأكدي أن الوحدة النهائية هي المطلوبة.'
}),
makeMathGapLesson({
id:'off_math_u5_l9_multistep_decimal_word_problems',unitNumber:5,lessonNumber:9,
titleAr:'حل مسائل كلامية متعددة الخطوات',titleEn:'Multi-step Decimal Word Problems',
paragraphs:[
'تجمع المسائل الكلامية متعددة الخطوات بين أكثر من مهارة، مثل ضرب الكسور العشرية وتحويل الوحدات والجمع أو الطرح. نقرأ المطلوب ونحدد البيانات قبل البدء.',
'إذا اشترى شخص 1.5 متر من القماش بسعر 10 جنيهات للمتر، نحسب ثمن القماش بالضرب. وإذا اشترى أيضاً 2.5 كجم من الفاكهة بسعر 20 جنيهاً للكيلوجرام، نحسب ثمنها ثم نجمع المبلغين.',
'نكتب كل خطوة مع وحدتها ونراجع أن الإجمالي منطقي. قد نحتاج إلى تحويل المتر أو الكيلوجرام قبل الحساب إذا كانت الوحدات مختلفة.'
],
vocabulary:[{word:'المسألة الكلامية',definition:'سؤال يصف موقفاً حياتياً ونستخدم الرياضيات لحله.'},{word:'الإجمالي',definition:'المجموع الكلي للقيم أو التكاليف.'},{word:'الوحدة',definition:'اسم القياس مثل متر أو كيلوجرام أو جنيه.'}],
questions:[
{question:'اشترى شخص 1.5 متر قماش بسعر 10 جنيهات للمتر. ما الثمن؟',options:['15 جنيهاً','150 جنيهاً','1.5 جنيه','10 جنيهات'],answer:'15 جنيهاً'},
{question:'إذا كان ثمن القماش 15 جنيهاً وثمن الفاكهة 50 جنيهاً، فما الإجمالي؟',options:['65 جنيهاً','35 جنيهاً','750 جنيهاً','50 جنيهاً'],answer:'65 جنيهاً'}
],
keyPoints:['نحدد البيانات والمطلوب ونرتب العمليات.','نضرب الكمية في سعر الوحدة لإيجاد التكلفة.','نجمع التكاليف ونكتب الوحدة المناسبة.'],
exampleAr:'حساب ثمن عدة مشتريات يتطلب إيجاد تكلفة كل نوع أولاً ثم جمعها.',
exampleEn:'To calculate a shopping total, find each item cost first, then add them.',
analogyAr:'المسألة مثل فاتورة متجر؛ نحسب كل بند ثم نجمع البنود في النهاية.',
analogyEn:'A word problem is like a shop receipt: calculate each line, then total them.',
correction:'احسبي كل كمية في خطوة منفصلة، واكتبي الوحدة، ثم اجمعي النتائج المطلوبة.'
}),
makeMathGapLesson({
id:'off_math_u5_l10_divide_powers_ten',unitNumber:5,lessonNumber:10,
titleAr:'القسمة على قوى العدد 10',titleEn:'Dividing by Powers of Ten',
paragraphs:[
'عند قسمة عدد عشري على 10 أو 100 أو 1000 تقل قيمة العدد؛ فتنتقل الأرقام إلى منازل أصغر في جدول القيمة المكانية.',
'مثلاً 5.7 ÷ 10 = 0.57، و5.7 ÷ 100 = 0.057. يجب أن نفهم أثر القسمة في قيمة المنازل، لا أن نحرك العلامة العشرية بلا تفسير.',
'القسمة على 0.1 تختلف عن القسمة على 10؛ فالقسمة على 0.1 تكافئ الضرب في 10 لأننا نقسم على جزء صغير من الواحد.'
],
vocabulary:[{word:'القسمة',definition:'توزيع كمية إلى مجموعات متساوية أو إيجاد عدد المجموعات.'},{word:'قوى العدد 10',definition:'أعداد مثل 10 و100 و1000.'},{word:'منزلة عشرية',definition:'موضع رقم على يمين العلامة العشرية.'}],
questions:[
{question:'ما ناتج 5.7 ÷ 100؟',options:['0.057','0.57','57','570'],answer:'0.057'},
{question:'ما ناتج 2500 ÷ 10؟',options:['250','25','25000','2.5'],answer:'250'}
],
keyPoints:['القسمة على 10 أو 100 أو 1000 تقلل القيمة العددية.','نستخدم جدول القيمة المكانية لتحديد الناتج.','القسمة على 0.1 تكافئ الضرب في 10.'],
exampleAr:'تحويل 570 سنتيمتراً إلى أمتار يتطلب القسمة على 100، فيكون 5.7 أمتار.',
exampleEn:'570 centimetres equals 5.7 metres after dividing by 100.',
analogyAr:'القسمة على 10 مثل الانتقال درجة إلى وحدة أكبر؛ نحتاج عدداً أقل لتمثيل المقدار نفسه.',
analogyEn:'Dividing by ten is like moving to a larger unit, so fewer units represent the same amount.',
correction:'حددي المقسوم عليه بدقة: 10 أم 100 أم 1000 أم 0.1، ثم راقبي أثره في القيمة.'
}),
makeMathGapLesson({
id:'off_math_u5_l11_patterns_powers_ten',unitNumber:5,lessonNumber:11,
titleAr:'الأنماط والعلاقات في قوى العدد 10',titleEn:'Patterns and Relationships with Powers of Ten',
paragraphs:[
'تساعدنا الأنماط على ملاحظة ما يحدث للأعداد عند الضرب أو القسمة في قوى العدد 10. عند الضرب في 10 تتضاعف قيمة كل منزلة عشر مرات، وعند القسمة على 10 تصبح عُشر قيمتها.',
'يمكن مقارنة 0.6 و6 و60 و600؛ كل انتقال إلى اليمين في هذا التسلسل يعني الضرب في 10. والانتقال في الاتجاه العكسي يعني القسمة على 10.',
'نستخدم النمط للتنبؤ بنتائج جديدة، ثم نتحقق من التوقع باستخدام القيمة المكانية أو الحساب المباشر.'
],
vocabulary:[{word:'نمط عددي',definition:'تتابع أعداد تربطها قاعدة تتكرر.'},{word:'قاعدة النمط',definition:'العملية التي نكررها للانتقال من حد إلى الحد التالي.'},{word:'التنبؤ',definition:'توقع نتيجة اعتماداً على قاعدة معروفة.'}],
questions:[
{question:'ما العدد التالي في النمط 0.6، 6، 60، ...؟',options:['600','66','6.1','0.06'],answer:'600'},
{question:'ما القاعدة المستخدمة للانتقال من 8 إلى 0.8؟',options:['القسمة على 10','الضرب في 10','الجمع 10','الطرح 10'],answer:'القسمة على 10'}
],
keyPoints:['الضرب في 10 يزيد قيمة العدد عشرة أضعاف.','القسمة على 10 تقلل قيمة العدد إلى عُشرها.','نستنتج قاعدة النمط ثم نستخدمها للتنبؤ بالحد التالي.'],
exampleAr:'إذا كان سعر وحدة 0.8 جنيه، فإن سعر عشر وحدات يساوي 8 جنيهات.',
exampleEn:'If one unit costs 0.8 pounds, ten units cost 8 pounds.',
analogyAr:'النمط مثل خطوات منتظمة على سلم؛ كل خطوة تتبع القاعدة نفسها.',
analogyEn:'A number pattern is like regular steps on a staircase.',
correction:'قارني كل حد بالذي قبله، وحددي هل نضرب في 10 أم نقسم على 10.'
}),
makeMathGapLesson({
id:'off_math_u5_l12_decimal_divide_whole',unitNumber:5,lessonNumber:12,
titleAr:'قسمة كسور عشرية على أعداد صحيحة',titleEn:'Dividing Decimals by Whole Numbers',
paragraphs:[
'عند قسمة كسر عشري على عدد صحيح نقسم كما نفعل مع الأعداد الصحيحة، مع وضع العلامة العشرية في خارج القسمة فوق موضعها في المقسوم.',
'مثلاً 51.65 ÷ 5 = 10.33. نبدأ من اليسار، ونقسم كل منزلة بالترتيب، ونضع العلامة العشرية في خارج القسمة عندما نصل إليها في المقسوم.',
'يمكن التحقق بضرب خارج القسمة في المقسوم عليه؛ فإذا أعادنا إلى المقسوم تكون الإجابة صحيحة.'
],
vocabulary:[{word:'خارج القسمة',definition:'الناتج الذي نحصل عليه بعد القسمة.'},{word:'العلامة العشرية',definition:'علامة تفصل الجزء الصحيح عن الجزء العشري.'},{word:'التحقق بالضرب',definition:'ضرب الناتج في المقسوم عليه للتأكد من المقسوم.'}],
questions:[
{question:'ما ناتج 51.65 ÷ 5؟',options:['10.33','1.033','103.3','10.3'],answer:'10.33'},
{question:'أين نضع العلامة العشرية في خارج القسمة؟',options:['فوق موضعها في المقسوم','في بداية الناتج دائماً','بعد آخر رقم دائماً','نحذفها'],answer:'فوق موضعها في المقسوم'}
],
keyPoints:['نقسم الأرقام بالترتيب كما في القسمة المعتادة.','نضع العلامة العشرية في خارج القسمة فوق موضعها في المقسوم.','نستخدم الضرب للتحقق من الناتج.'],
exampleAr:'تقسيم 12.6 لتراً من العصير على 3 أوعية بالتساوي يعطي 4.2 لتر لكل وعاء.',
exampleEn:'Sharing 12.6 litres equally among 3 containers gives 4.2 litres each.',
analogyAr:'العلامة العشرية مثل علامة طريق؛ نحافظ على موضعها حتى لا تتغير قيمة العدد.',
analogyEn:'The decimal point is a road marker that keeps the number’s value in place.',
correction:'ابدئي بالقسمة من اليسار، وضعي العلامة فوق موضعها، ثم تحققي بالضرب.'
}),
makeMathGapLesson({
id:'off_math_u5_l13_decimal_divide_decimal',unitNumber:5,lessonNumber:13,
titleAr:'قسمة كسور عشرية على كسور عشرية',titleEn:'Dividing a Decimal by a Decimal',
paragraphs:[
'عند قسمة عدد عشري على عدد عشري آخر، نجعل المقسوم عليه عدداً صحيحاً بضرب المقسوم والمقسوم عليه في القوة نفسها من 10.',
'مثلاً 26.4 ÷ 2.2 تصبح 264 ÷ 22 بعد ضرب العددين في 10، والناتج 12. تغيير العددين بالعامل نفسه لا يغير خارج القسمة.',
'بعد تحويل المقسوم عليه إلى عدد صحيح نستخدم خوارزمية القسمة، ثم نتحقق بضرب الناتج في المقسوم عليه الأصلي.'
],
vocabulary:[{word:'المقسوم عليه',definition:'العدد الذي نقسم عليه.'},{word:'عدد صحيح',definition:'عدد لا يحتوي على جزء عشري.'},{word:'عامل مشترك للتحويل',definition:'عدد نضرب به المقسوم والمقسوم عليه معاً.'}],
questions:[
{question:'ما ناتج 26.4 ÷ 2.2؟',options:['12','1.2','120','0.12'],answer:'12'},
{question:'لتحويل 2.2 إلى عدد صحيح في 26.4 ÷ 2.2، نضرب العددين في:',options:['10','2','100','0.1'],answer:'10'}
],
keyPoints:['نحوّل المقسوم عليه إلى عدد صحيح.','نضرب المقسوم والمقسوم عليه في القوة نفسها من 10.','نحسب القسمة ثم نتحقق باستخدام الأعداد الأصلية.'],
exampleAr:'إذا كان طول شريط 2.4 متر ونقسمه إلى قطع طول كل منها 0.6 متر، نحسب 2.4 ÷ 0.6 = 4 قطع.',
exampleEn:'A 2.4-metre ribbon cut into 0.6-metre pieces makes 4 pieces.',
analogyAr:'نحوّل الوحدتين معاً مثل تكبير صورة؛ يكبر الطرفان بالمقدار نفسه وتبقى النسبة ثابتة.',
analogyEn:'Scaling both numbers equally is like enlarging both sides of a picture while keeping the ratio.',
correction:'اضربي العددين في 10 أو 100 حتى يصبح المقسوم عليه صحيحاً، ثم اقسمي.'
}),
/* Unit 6 — lessons 2–4; lesson 1 already exists */
makeMathGapLesson({
id:'off_math_u6_l2_parentheses_expressions',unitNumber:6,lessonNumber:2,
titleAr:'تعبيرات عددية تتضمن أقواساً',titleEn:'Numerical Expressions with Parentheses',
paragraphs:[
'الأقواس في التعبير العددي تحدد العملية التي يجب تنفيذها أولاً. نبدأ بحساب ما داخل الأقواس، ثم نكمل بقية العمليات وفق ترتيبها.',
'في التعبير 3 × (4 + 2) نجمع داخل القوس أولاً: 4 + 2 = 6، ثم نضرب 3 × 6 = 18. إذا تجاهلنا الأقواس قد نحصل على ناتج مختلف.',
'تساعدنا الأقواس على تمثيل مواقف الحياة بدقة، مثل حساب تكلفة عدة أشياء معاً قبل إضافة تكلفة أخرى.'
],
vocabulary:[{word:'تعبير عددي',definition:'أعداد وعمليات حسابية تمثل قيمة أو موقفاً.'},{word:'الأقواس',definition:'علامات تحدد جزءاً من التعبير ينفذ أولاً.'},{word:'ترتيب العمليات',definition:'قواعد تحدد تسلسل تنفيذ العمليات الحسابية.'}],
questions:[
{question:'ما قيمة 3 × (4 + 2)؟',options:['18','14','20','24'],answer:'18'},
{question:'ما العملية التي تنفذ أولاً في 8 + (6 ÷ 2)؟',options:['القسمة داخل القوس','الجمع خارج القوس','الضرب في 2','الطرح'],answer:'القسمة داخل القوس'}
],
keyPoints:['نحسب ما داخل الأقواس أولاً.','بعد الأقواس نطبق قواعد أسبقية العمليات.','الأقواس قد تغير قيمة التعبير إذا تغير ترتيب التنفيذ.'],
exampleAr:'ثمن 3 ألعاب سعر كل منها 20 جنيهاً مع إضافة 10 جنيهات للتوصيل: (3 × 20) + 10.',
exampleEn:'Three toys at 20 pounds each plus 10 delivery is (3 × 20) + 10.',
analogyAr:'الأقواس مثل غرفة مغلقة نرتب ما بداخلها أولاً قبل الخروج لبقية العمل.',
analogyEn:'Parentheses are like a room we finish organizing before moving to the rest of the task.',
correction:'ابدئي بما داخل القوس، ثم انتقلي إلى الضرب والقسمة، وبعدها الجمع والطرح.'
}),
makeMathGapLesson({
id:'off_math_u6_l3_write_numeric_expression',unitNumber:6,lessonNumber:3,
titleAr:'كتابة تعبير عددي لتمثيل موقف ما',titleEn:'Writing a Numerical Expression for a Situation',
paragraphs:[
'يمكن تمثيل موقف حياتي بتعبير عددي يوضح العمليات اللازمة للحل. نحدد الكميات والعلاقات بينها، ثم نختار الرموز المناسبة للجمع أو الطرح أو الضرب أو القسمة.',
'إذا اشترينا 4 دفاتر ثمن الواحد 12 جنيهاً، ثم أضفنا قلماً ثمنه 5 جنيهات، يمكن تمثيل الموقف بالتعبير 4 × 12 + 5.',
'يجب أن يعكس التعبير ترتيب الأحداث والمعنى المطلوب، وقد نستخدم الأقواس إذا احتجنا إلى تنفيذ مجموعة عمليات معاً.'
],
vocabulary:[{word:'تمثيل رياضي',definition:'استخدام الأعداد والرموز لوصف موقف.'},{word:'تعبير عددي',definition:'جملة رياضية تحتوي على أعداد وعمليات دون علامة مساواة.'},{word:'رمز العملية',definition:'علامة مثل + أو − أو × أو ÷.'}],
questions:[
{question:'اشترى سامي 4 دفاتر ثمن الواحد 12 جنيهاً وقلمًا بـ5 جنيهات. أي تعبير يمثل التكلفة؟',options:['4 × 12 + 5','4 + 12 × 5','4 × (12 + 5)','12 ÷ 4 + 5'],answer:'4 × 12 + 5'},
{question:'أي عملية تمثل توزيع 36 قطعة بالتساوي على 6 أطفال؟',options:['36 ÷ 6','36 + 6','36 × 6','36 − 6'],answer:'36 ÷ 6'}
],
keyPoints:['نحدد الكميات والعلاقة بينها قبل كتابة التعبير.','نختار العملية التي تمثل الموقف بدقة.','نستخدم الأقواس عندما تتطلب المسألة ترتيباً خاصاً.'],
exampleAr:'ثمن 2 كتاب بسعر 30 جنيهاً لكل كتاب مع خصم 5 جنيهات يمثله 2 × 30 − 5.',
exampleEn:'Two books at 30 pounds each with a 5-pound discount is 2 × 30 − 5.',
analogyAr:'التعبير العددي مثل خريطة للموقف؛ كل رمز يوضح خطوة من خطواته.',
analogyEn:'A numerical expression is a map of the situation, with each symbol showing a step.',
correction:'حوّلي الكلمات إلى عمليات: مجموع يعني جمعاً، لكل يعني ضرباً غالباً، والتوزيع بالتساوي يعني قسمة.'
}),
makeMathGapLesson({
id:'off_math_u6_l4_number_patterns',unitNumber:6,lessonNumber:4,
titleAr:'تحديد الأنماط العددية',titleEn:'Identifying Number Patterns',
paragraphs:[
'النمط العددي سلسلة من الأعداد تتبع قاعدة محددة. قد نضيف العدد نفسه كل مرة، أو نطرح، أو نضرب، أو نقسم وفق قاعدة تتكرر.',
'لإيجاد القاعدة نقارن كل حد بالحد الذي يليه. في النمط 4، 8، 12، 16 نضيف 4 كل مرة، لذلك العدد التالي 20.',
'بعض الأنماط تحتاج إلى ملاحظة أكثر من خطوة؛ نتحقق من القاعدة باستخدام عدة حدود قبل التنبؤ بالعدد التالي.'
],
vocabulary:[{word:'نمط عددي',definition:'سلسلة أعداد تتبع قاعدة متكررة.'},{word:'حد',definition:'عدد واحد في سلسلة النمط.'},{word:'قاعدة',definition:'العملية التي تحدد الانتقال من حد إلى آخر.'}],
questions:[
{question:'ما العدد التالي في النمط 4، 8، 12، 16، ...؟',options:['20','18','22','24'],answer:'20'},
{question:'ما قاعدة النمط 3، 6، 12، 24، ...؟',options:['الضرب في 2','الجمع 2','الطرح 3','القسمة على 2'],answer:'الضرب في 2'}
],
keyPoints:['نقارن الحدود المتتالية لاكتشاف القاعدة.','قد تكون القاعدة جمعاً أو طرحاً أو ضرباً أو قسمة.','نتحقق من القاعدة على أكثر من حد قبل التنبؤ.'],
exampleAr:'إذا ادخر طفل 5 جنيهات كل أسبوع، فإن مدخراته تتبع نمطاً يزيد 5 كل مرة.',
exampleEn:'Saving 5 pounds each week creates a pattern that increases by 5 each time.',
analogyAr:'النمط مثل إيقاع الموسيقى؛ تتكرر الحركة نفسها فنستطيع توقع النغمة التالية.',
analogyEn:'A pattern is like a musical rhythm: repeated steps help predict what comes next.',
correction:'قارني كل عدد بالذي يليه، واختبري القاعدة على جميع الحدود قبل اختيار العدد التالي.'
})
];
MATH_CURRICULUM_LESSONS.push(...MATH_TERM_1_GAP_LESSONS);
