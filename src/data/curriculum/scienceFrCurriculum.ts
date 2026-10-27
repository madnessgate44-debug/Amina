/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { OfficialCurriculumLesson } from '../../types/teachingSession';

/**
 * Official Egyptian Ministry of Education Curriculum for Grade 5 (Term 1)
 * Subject: Sciences (Section Langue Française / الساينس بالفرنسية)
 * Textbooks: Manuel de Sciences 5e Primaire (MOETE)
 */
export const SCIENCE_FR_CURRICULUM_LESSONS: OfficialCurriculumLesson[] = [
  // =========================================================================
  // Unité 1: Les relations d'énergie dans les écosystèmes
  // =========================================================================
  {
    id: 'off_scifr_u1_l1_plantes',
    subjectId: 'subj_science_fr',
    subjectNameAr: 'العلوم (بالفرنسية)',
    subjectNameEn: 'French Science',
    subjectNameFr: 'Sciences',
    unitNumber: 1,
    unitNameAr: 'الوحدة الأولى: العلاقات الغذائية في الأنظمة البيئية',
    unitNameEn: 'Unit 1: Energy Relationships in Ecosystems',
    unitNameFr: 'Unité 1: Les relations d\'énergie dans les écosystèmes',
    lessonNumber: 1,
    titleAr: 'احتياجات النبات وعملية البناء الضوئي',
    titleEn: 'Plant Needs & Photosynthesis (French Section)',
    titleFr: 'Les besoins des plantes et la photosynthèse',
    originTag: 'official',
    language: 'fr',
    isAvailable: true,
    contentStatus: 'available',
    sourceRef: {
      book: 'كتاب الساينس بالفرنسية — الصف الخامس الابتدائي — الفصل الدراسي الأول',
      bookAr: 'كتاب الوزارة Sciences ص. 8-15',
      bookEn: 'Ministry Sciences Textbook pp. 8-15',
      grade: 'الصف الخامس',
      term: 'الفصل الدراسي الأول',
      unit: 'Unité 1',
      lesson: 'Leçon 1',
      page: 8,
      isAvailable: true,
    },
    objectives: [
      'Distinguer les besoins fondamentaux des plantes (eau, dioxyde de carbone, lumière solaire, espace) des besoins secondaires.',
      'Expliquer le processus de la photosynthèse : production de glucose et dégagement de dioxygène.',
      'Décrire le rôle des vaisseaux du xylème (transport de sève brute) et du phloème (transport de sève élaborée).',
    ],
    readingText: `Les besoins vitaux d'une plante :
Une plante verte est un organisme vivant AUTOTROPHE : elle fabrique sa propre nourriture grâce à la photosynthèse.
Les parties de la plante :
1. Les racines : absorbent l'eau et les sels minéraux du sol via les poils absorbants.
2. La tige : soutient la plante et contient les vaisseaux conducteurs du XYLÈME.
3. Les feuilles : véritables usines chimiques de la plante. Elles contiennent la chlorophylle qui capte l'énergie lumineuse et les STOMATES qui absorbent le dioxyde de carbone (CO2).
L'équation de la photosynthèse :
Eau + Dioxyde de carbone + Lumière solaire = Glucose (sucre riche en énergie) + Dioxygène (O2 gazeux rejeté dans l'air).
Le PHLOÈME transporte ensuite cette sève nourricière vers toutes les cellules de la plante.`,
    vocabulary: [
      { word: 'Photosynthèse (البناء الضوئي)', definition: 'Processus par lequel les plantes vertes synthétisent du glucose en utilisant la lumière du soleil.' },
      { word: 'Xylème (أوعية الخشب)', definition: 'Vaisseaux transportant l\'eau et les minéraux des racines vers les feuilles.' },
      { word: 'Phloème (أوعية اللحاء)', definition: 'Vaisseaux transportant les nutriments (glucose) des feuilles vers toute la plante.' },
      { word: 'Stomates (الثغور)', definition: 'Minuscules ouvertures sur les feuilles permettant les échanges gazeux.' },
    ],
    exercises: [
      {
        type: 'multiple_choice',
        question: 'Quel gaz est rejeté dans l\'atmosphère lors de la photosynthèse ?',
        options: ['Le dioxyde de carbone', 'Le dioxygène (O2)', 'L\'azote', 'Le méthane'],
        expectedAnswer: 'Le dioxygène (O2)',
        page: 12,
      },
      {
        type: 'qa',
        question: 'Quels vaisseaux transportent l\'eau des racines vers les feuilles ?',
        expectedAnswer: 'Les vaisseaux du xylème.',
        page: 13,
      },
    ],
    concepts: [
      {
        id: 'conc_scifr_u1_l1_photosynthese',
        conceptNumber: 1,
        titleAr: 'عملية البناء الضوئي وأوعية النبات',
        titleEn: 'Photosynthesis & Vascular Tissues in French',
        sourceText: 'La photosynthèse transforme l\'énergie lumineuse en énergie chimique stockée dans le glucose.',
        keyPoints: [
          'Les racines absorbent eau et minéraux (transportés par le xylème).',
          'Les feuilles absorbent le CO2 par les stomates.',
          'Résultats : Glucose (énergie) + Dioxygène (respiration des vivants).',
        ],
        dailyLifeExampleAr: 'النباتات التي نزرعها في شرفة منزلنا تمتص شمس الصباح لتنتج هواءً نقياً منعشاً.',
        dailyLifeExampleEn: 'Plants in our home balcony absorb morning sun to produce fresh oxygen.',
        storyAnalogyAr: 'أوراق الشجر مثل مطابخ صغيرة تعمل بالطاقة الشمسية وتطبخ سكر الجلوكوز اللذيذ للنبات.',
        storyAnalogyEn: 'Leaves are like solar-powered kitchens cooking sweet glucose for the plant.',
        prerequisiteAr: 'أجزاء النبات ووظائفها.',
        prerequisiteEn: 'Basic plant anatomy.',
      },
    ],
    supplementaryResources: [
      {
        id: 'supp_scifr_adwaa_1',
        sourceType: 'al_adwaa',
        sourceNameAr: 'الأضواء ساينس لغات — تجارب البناء الضوئي',
        sourceNameEn: 'Al-Adwaa Sciences Experiments',
        unit: 'Unité 1',
        lesson: 'La photosynthèse',
        page: 18,
        notes: 'تجربة حجب الضوء عن ورقة نبات وملاحظة تأثير النشا مع صبغة اليود.',
        isAvailable: true,
      },
    ],
  },

  {
    id: 'off_scifr_u1_l2_chaines',
    subjectId: 'subj_science_fr',
    subjectNameAr: 'العلوم (بالفرنسية)',
    subjectNameEn: 'French Science',
    subjectNameFr: 'Sciences',
    unitNumber: 1,
    unitNameAr: 'الوحدة الأولى: العلاقات الغذائية في الأنظمة البيئية',
    unitNameEn: 'Unit 1: Energy Relationships in Ecosystems',
    unitNameFr: 'Unité 1: Les relations d\'énergie dans les écosystèmes',
    lessonNumber: 2,
    titleAr: 'السلاسل والشبكات الغذائية',
    titleEn: 'Food Chains & Food Webs',
    titleFr: 'Les chaînes alimentaires et les réseaux trophiques',
    originTag: 'official',
    language: 'fr',
    isAvailable: true,
    contentStatus: 'available',
    sourceRef: {
      book: 'كتاب الساينس بالفرنسية — الصف الخامس الابتدائي — الفصل الدراسي الأول',
      bookAr: 'كتاب الوزارة Sciences ص. 16-24',
      bookEn: 'Ministry Sciences Textbook pp. 16-24',
      grade: 'الصف الخامس',
      term: 'الفصل الدراسي الأول',
      unit: 'Unité 1',
      lesson: 'Leçon 2',
      page: 16,
      isAvailable: true,
    },
    objectives: [
      'Identifier les maillons d\'une chaîne alimentaire : Producteurs, Consommateurs (primaires, secondaires, tertiaires), Décomposeurs.',
      'Comprendre le flux d\'énergie du soleil vers les producteurs puis les consommateurs.',
      'Expliquer l\'importance vitale des décomposeurs (bactéries, champignons) pour recycler les nutriments dans le sol.',
    ],
    readingText: `Le flux d'énergie dans un écosystème :
1. Le Soleil : La source principale d'énergie pour tous les êtres vivants sur Terre.
2. Les producteurs : Les plantes vertes fabriquent leur nourriture.
3. Les consommateurs primaires : Herbivores qui mangent les plantes (ex : la chenille, le lapin).
4. Les consommateurs secondaires : Carnivores qui mangent les herbivores (ex : l'oiseau, le renard).
5. Les décomposeurs : Bactéries, moisissures et vers de terre qui recyclent la matière organique morte et enrichissent le sol en sels minéraux.`,
    vocabulary: [
      { word: 'Producteur (كائن منتج)', definition: 'Organisme qui fabrique sa propre nourriture par photosynthèse.' },
      { word: 'Consommateur primaire (مستهلك أولي)', definition: 'Animal herbivore qui se nourrit de plantes.' },
      { word: 'Décomposeur (كائن محلل)', definition: 'Organisme qui décompose les cadavres et recycle les minéraux dans le sol.' },
    ],
    exercises: [
      {
        type: 'multiple_choice',
        question: 'Qui est toujours au tout début d\'une chaîne alimentaire terrestre ?',
        options: ['Un carnivore', 'Un producteur (plante verte)', 'Un décomposeur', 'Un aigle'],
        expectedAnswer: 'Un producteur (plante verte)',
        page: 20,
      },
    ],
    concepts: [
      {
        id: 'conc_scifr_u1_l2_chaine',
        conceptNumber: 1,
        titleAr: 'انتقال الطاقة عبر السلسلة الغذائية',
        titleEn: 'Energy Transfer in Food Chains',
        sourceText: 'L\'énergie circule du soleil vers les plantes, puis vers les herbivores et les carnivores.',
        keyPoints: [
          'Toute chaîne alimentaire débute par un organisme autotrophe (plante).',
          'Les décomposeurs ferment le cycle en restituant les sels minéraux.',
        ],
        dailyLifeExampleAr: 'العشب الأخضر تأكله الأرانب، والأرنب يأكله الثعلب.',
        dailyLifeExampleEn: 'Grass is eaten by a rabbit, which is eaten by a fox.',
        storyAnalogyAr: 'مثل تمرير شعلة الألعاب الأولمبية: الشمس تعطي الشعلة للنبات، والنبات يمررها لباقي الحيوانات.',
        storyAnalogyEn: 'Like passing an Olympic torch of energy from the sun to plants and animals.',
        prerequisiteAr: 'الكائنات الحية واحتياجاتها.',
        prerequisiteEn: 'Living organisms needs.',
      },
    ],
    supplementaryResources: [
      {
        id: 'supp_scifr_selah_chaine',
        sourceType: 'selah_el_telmeez',
        sourceNameAr: 'سلاح التلميذ — مخطط الشبكات الغذائية',
        sourceNameEn: 'Selah El-Telmeez Food Web Diagrams',
        unit: 'Unité 1',
        lesson: 'Les chaînes alimentaires',
        page: 28,
        notes: 'مخططات تفاعلية لشبكة غذائية في البيئة الصحراوية المصرية ووادي النيل.',
        isAvailable: true,
      },
    ],
  },

  // =========================================================================
  // Unité 2: La matière et ses états (قيد تحديث مواد الوزارة)
  // =========================================================================
  {
    id: 'off_scifr_u2_l1_matiere',
    subjectId: 'subj_science_fr',
    subjectNameAr: 'العلوم (بالفرنسية)',
    subjectNameEn: 'French Science',
    subjectNameFr: 'Sciences',
    unitNumber: 2,
    unitNameAr: 'الوحدة الثانية: المادة والجسيمات في عالمنا',
    unitNameEn: 'Unit 2: Matter & Particles in Our World',
    unitNameFr: 'Unité 2: La matière dans notre univers',
    lessonNumber: 1,
    titleAr: 'حالات المادة وحركة الجسيمات',
    titleEn: 'States of Matter & Particle Movement',
    titleFr: 'Les états de la matière et le modèle particulaire',
    originTag: 'official',
    language: 'fr',
    isAvailable: true,
    contentStatus: 'available',
    sourceRef: {
      book: 'كتاب الساينس بالفرنسية — الصف الخامس الابتدائي — الفصل الدراسي الأول',
      bookAr: 'كتاب الوزارة Sciences ص. 35-40',
      bookEn: 'Ministry Sciences Textbook pp. 35-40',
      grade: 'الصف الخامس',
      term: 'الفصل الدراسي الأول',
      unit: 'Unité 2',
      lesson: 'Leçon 1',
      page: 35,
      isAvailable: true,
    },
    objectives: [
      'Comparer les trois états de la matière : solide, liquide et gazeux.',
      'Décrire le mouvement et l\'arrangement des particules dans chaque état.',
      'Relier les changements d\'état (fusion, solidification, évaporation) au comportement des particules.',
    ],
    readingText: `Les trois états de la matière et le modèle particulaire :
Toute matière est faite de minuscules particules en mouvement.
1. L'état SOLIDE :
   - Les particules sont très serrées et bien ordonnées.
   - Elles vibrent sur place sans se déplacer.
   - Le solide a une forme propre et un volume fixe. Exemple : un glaçon, une pierre.
2. L'état LIQUIDE :
   - Les particules sont proches mais désordonnées et glissent les unes sur les autres.
   - Le liquide n'a pas de forme propre : il prend la forme du récipient, mais garde un volume fixe. Exemple : l'eau d'un verre.
3. L'état GAZEUX :
   - Les particules sont très éloignées et se déplacent rapidement dans toutes les directions.
   - Le gaz n'a ni forme propre ni volume fixe : il occupe tout l'espace disponible. Exemple : l'air d'un ballon.
Changement d'état : quand on chauffe un solide, ses particules vibrent plus fort et s'écartent : le solide fond (fusion). Quand on refroidit un liquide, les particules ralentissent et se rapprochent : il se solidifie.`,
    vocabulary: [
      { word: 'Particule (جسيم)', definition: 'La plus petite partie de la matière, invisible à l\'œil nu.' },
      { word: 'Solide (صلب)', definition: 'État de la matière où les particules sont serrées et ordonnées ; forme propre.' },
      { word: 'Liquide (سائل)', definition: 'État de la matière où les particules glissent ; pas de forme propre.' },
      { word: 'Gaz (غاز)', definition: 'État de la matière où les particules sont très éloignées et rapides.' },
      { word: 'Fusion (الانصهار)', definition: 'Passage de l\'état solide à l\'état liquide sous l\'effet de la chaleur.' },
    ],
    exercises: [
      {
        type: 'multiple_choice',
        question: 'Dans quel état les particules sont-elles très serrées et bien ordonnées ?',
        options: ['L\'état solide', 'L\'état liquide', 'L\'état gazeux', 'Aucun des trois'],
        expectedAnswer: 'L\'état solide',
        page: 36,
      },
      {
        type: 'multiple_choice',
        question: 'Quel état occupe tout l\'espace disponible ?',
        options: ['L\'état gazeux', 'L\'état solide', 'L\'état liquide', 'Aucun des trois'],
        expectedAnswer: 'L\'état gazeux',
        page: 38,
      },
      {
        type: 'qa',
        question: 'Comment s\'appelle le passage de l\'état solide à l\'état liquide ?',
        expectedAnswer: 'La fusion',
        page: 39,
      },
    ],
    concepts: [
      {
        id: 'conc_scifr_u2_l1_etats',
        conceptNumber: 1,
        titleAr: 'حالات المادة الثلاث والترتيب الجسيمي',
        titleEn: 'The Three States of Matter',
        sourceText: 'Les trois états de la matière se distinguent par l\'arrangement et le mouvement de leurs particules.',
        keyPoints: [
          'Solide : particules serrées et ordonnées, forme propre.',
          'Liquide : particules proches et désordonnées, pas de forme propre.',
          'Gaz : particules très éloignées et rapides, ni forme ni volume fixes.',
        ],
        dailyLifeExampleAr: 'مكعب الثلج (صلب) يذوب في كوب فيصبح ماءً (سائل)، ويتصاعد منه بخار الماء (غاز) عند الغليان.',
        dailyLifeExampleEn: 'An ice cube (solid) melts into water (liquid), which turns into steam (gas) when boiled.',
        storyAnalogyAr: 'تخيلي فصل المدرسة: الجلوس في صفوف منتظمة = حالة صلبة، المشي بحرية = سائل، الجري في الملعب كله = غاز.',
        storyAnalogyEn: 'Imagine a classroom: sitting in neat rows = solid, walking around = liquid, running everywhere = gas.',
        prerequisiteAr: 'المادة وخصائصها ووجود الغازات حولنا.',
        prerequisiteEn: 'Matter and its basic properties.',
      },
      {
        id: 'conc_scifr_u2_l1_mouvement',
        conceptNumber: 2,
        titleAr: 'حركة الجسيمات وتغيرات الحالة',
        titleEn: 'Particle Movement & Changes of State',
        sourceText: 'La chaleur accélère les particules : elles s\'écartent (fusion, évaporation) ou se rapprochent en se refroidissant (solidification).',
        keyPoints: [
          'Chauffer fait vibrer plus fort les particules → fusion d\'un solide ou évaporation d\'un liquide.',
          'Refroidir ralentit les particules et les rapproche → solidification.',
          'La masse reste la même pendant un changement d\'état : seule la disposition change.',
        ],
        dailyLifeExampleAr: 'عند وضع الماء في الفريزر تقل حركة جسيماته فيتجمد، وعند وضعه على النار تزيد حركتها فيتبخر.',
        dailyLifeExampleEn: 'Water in a freezer slows its particles and freezes; on the stove they speed up and evaporate.',
        storyAnalogyAr: 'مثل تلاميذ في ساحة باردة يتقاربون ليتدفأوا، وفي يوم حار يتباعدون ويجرون.',
        storyAnalogyEn: 'Like pupils huddling together in the cold and spreading out on a hot day.',
        prerequisiteAr: 'حالات المادة الثلاث.',
        prerequisiteEn: 'The three states of matter.',
      },
    ],
    supplementaryResources: [
      {
        id: 'supp_scifr_adwaa_matiere',
        sourceType: 'al_adwaa',
        sourceNameAr: 'الأضواء ساينس لغات — نموذج الجسيمات وتغيرات الحالة',
        sourceNameEn: 'Al-Adwaa Sciences Particle Model',
        unit: 'Unité 2',
        lesson: 'Les états de la matière',
        page: 42,
        notes: 'تجارب على ذوبان الجليد وتبخر الماء وملاحظة حركة الجسيمات بالنموذج المصور.',
        isAvailable: true,
      },
    ],
  },
];
