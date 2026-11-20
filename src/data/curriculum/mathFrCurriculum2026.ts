/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * 2026/2027 Egypt Ministry Grade 5 Mathématiques en français, Term 1.
 *
 * Inventory and page spans are grounded in the inspected Ministry student book
 * (`Math_FR_prim5_TR1.pdf`, 141 pages, SHA-256 baea709a…d5ace): its printed
 * "Table des matières" lists 46 lessons across six units, and every lesson
 * below carries that book's own lesson title, unit and start page.
 *
 * The explanations, worked examples, exercises and answer keys are Miss Noor
 * teaching material written for this app. They are NOT official Ministry text
 * and are NOT taken from a Ministry teacher guide. Where the book page was not
 * opened line by line, the record says so rather than implying page-level
 * verification.
 */
import { CurriculumExercise, OfficialCurriculumLesson } from '../../types/teachingSession';

type Spec = {
  u: number;
  n: number;
  page: number;
  pages: string;
  fr: string;
  en: string;
  ar: string;
  focus: string;
  objectives: string[];
  vocab: [string, string][];
  q: string;
  options: string[];
  answer: string;
  why: string;
  exampleFr: string;
  exampleEn: string;
  exampleAr: string;
  /**
   * A second, independent exercise for lessons whose worked example states no
   * arithmetic equation to verify. It is written from that lesson's own example,
   * so it tests the same verified objective without inventing a new situation.
   */
  q2?: string;
  options2?: string[];
  answer2?: string;
};

const UNIT_TITLES: Record<number, { fr: string; en: string; ar: string }> = {
  1: {
    fr: 'Unité 1 : La valeur de position des nombres décimaux et le calcul',
    en: 'Unit 1: Decimal place value and calculation',
    ar: 'الوحدة الأولى: القيمة المكانية للأعداد العشرية والحساب',
  },
  2: {
    fr: 'Unité 2 : Relations entre les nombres',
    en: 'Unit 2: Relationships between numbers',
    ar: 'الوحدة الثانية: العلاقات بين الأعداد',
  },
  3: {
    fr: 'Unité 3 : Multiplication avec des nombres entiers',
    en: 'Unit 3: Multiplication with whole numbers',
    ar: 'الوحدة الثالثة: الضرب في الأعداد الصحيحة',
  },
  4: {
    fr: 'Unité 4 : Division avec des nombres entiers',
    en: 'Unit 4: Division with whole numbers',
    ar: 'الوحدة الرابعة: القسمة على الأعداد الصحيحة',
  },
  5: {
    fr: 'Unité 5 : Multiplication et division avec des décimaux',
    en: 'Unit 5: Multiplication and division with decimals',
    ar: 'الوحدة الخامسة: الضرب والقسمة بالأعداد العشرية',
  },
  6: {
    fr: 'Unité 6 : Expressions numériques et modèles',
    en: 'Unit 6: Numerical expressions and patterns',
    ar: 'الوحدة السادسة: التعابير العددية والأنماط',
  },
};

const S: Spec[] = [
  // ---------------------------------------------------------------- Unité 1
  {
    u: 1, n: 6, page: 20, pages: '20–21',
    fr: 'Estimer la somme des décimaux', en: 'Estimating decimal sums', ar: 'تقدير مجموع الأعداد العشرية',
    focus: 'Pour estimer une somme de nombres décimaux, on arrondit chaque nombre à la position la plus proche et facile à calculer, puis on additionne les valeurs arrondies. Une estimation n’est pas la réponse exacte : elle sert à vérifier qu’un résultat est plausible. Si 4,7 + 3,2 est estimé à 5 + 3 = 8, un résultat de 79 est manifestement faux.',
    objectives: ['Arrondir des nombres décimaux pour estimer une somme.', 'Distinguer une estimation d’un calcul exact.', 'Utiliser une estimation pour contrôler un résultat.'],
    vocab: [['estimer', 'Calculer une valeur proche, sans chercher l’exactitude.'], ['arrondir', 'Remplacer un nombre par une valeur plus simple et proche.'], ['plausible', 'Qui paraît vraisemblable.']],
    q: 'Pour estimer 6,8 + 2,3, quelle estimation est la plus utile ?',
    options: ['7 + 2 = 9', '6 + 2 = 8', '6,8 + 2,3 = 9,1', '68 + 23 = 91'],
    answer: '7 + 2 = 9',
    why: 'On arrondit chaque nombre à l’unité la plus proche : 6,8 devient 7 et 2,3 devient 2.',
    exampleFr: 'Un cahier coûte 6,8 DT et un stylo 2,3 DT. On estime la dépense à 7 + 2 = 9 DT environ.',
    exampleEn: 'A notebook costs 6.8 and a pen 2.3. The total is about 7 + 2 = 9.',
    exampleAr: 'دفتر بـ٦٫٨ وقلم بـ٢٫٣، فالتقدير ٧ + ٢ = ٩ تقريباً.',
  },
  {
    u: 1, n: 7, page: 22, pages: '22–28',
    fr: 'Modéliser l’addition décimale', en: 'Modelling decimal addition', ar: 'نمذجة جمع الأعداد العشرية',
    focus: 'On additionne des nombres décimaux en alignant les virgules, donc les unités sous les unités, les dixièmes sous les dixièmes. On complète avec des zéros pour que les deux nombres aient le même nombre de chiffres après la virgule. Un modèle en bandes (dixièmes et centièmes) montre la même idée : on réunit les parties de même valeur.',
    objectives: ['Aligner les virgules avant d’additionner.', 'Compléter avec des zéros sans changer la valeur.', 'Additionner jusqu’aux millièmes.'],
    vocab: [['aligner', 'Placer sur la même colonne.'], ['virgule', 'Sépare la partie entière de la partie décimale.'], ['centième', 'Une part sur cent (0,01).']],
    q: 'Pour calculer 3,5 + 1,25, comment faut-il écrire les nombres ?',
    options: ['3,50 + 1,25', '3,5 + 1,25 sans rien changer', '35 + 125', '3,5 + 12,5'],
    answer: '3,50 + 1,25',
    why: 'On complète 3,5 en 3,50 pour avoir deux chiffres après la virgule, puis on aligne les virgules.',
    exampleFr: '3,50 + 1,25 = 4,75. Les centièmes s’additionnent ensemble, puis les dixièmes, puis les unités.',
    exampleEn: '3.50 + 1.25 = 4.75. Hundredths add with hundredths, then tenths, then units.',
    exampleAr: '٣٫٥٠ + ١٫٢٥ = ٤٫٧٥، فالأجزاء من مئة تُجمع معاً ثم الأجزاء من عشرة.',
  },
  {
    u: 1, n: 8, page: 29, pages: '29–33',
    fr: 'Soustraire des nombres décimaux', en: 'Subtracting decimals', ar: 'طرح الأعداد العشرية',
    focus: 'La soustraction de nombres décimaux suit la même règle que l’addition : on aligne les virgules et on complète avec des zéros. Quand un chiffre du haut est plus petit que celui du bas, on emprunte une unité à la colonne de gauche. Une vérification simple consiste à additionner le résultat et le nombre soustrait pour retrouver le nombre de départ.',
    objectives: ['Poser une soustraction en alignant les virgules.', 'Emprunter correctement lors d’un changement d’unité.', 'Vérifier une soustraction par l’addition.'],
    vocab: [['emprunter', 'Prendre une unité à la colonne voisine.'], ['différence', 'Résultat d’une soustraction.'], ['vérifier', 'Contrôler un résultat par une opération inverse.']],
    q: 'Que fait-on quand on doit calculer 5,2 − 0,8 et que 2 est plus petit que 8 ?',
    options: ['On emprunte une unité aux unités.', 'On inverse les deux nombres.', 'On ignore la virgule.', 'On ajoute 8 au lieu de soustraire.'],
    answer: 'On emprunte une unité aux unités.',
    why: '5,2 devient 4 unités et 12 dixièmes ; 12 − 8 = 4 dixièmes, donc 5,2 − 0,8 = 4,4.',
    exampleFr: 'Il reste 5,2 m de tissu, on en coupe 0,8 m : il reste 4,4 m.',
    exampleEn: 'There are 5.2 m of cloth; cutting 0.8 m leaves 4.4 m.',
    exampleAr: 'يتبقى ٥٫٢ متر من القماش، وبقص ٠٫٨ متر يتبقى ٤٫٤ متر.',

    q2: 'Combien vaut 5,2 − 0,8 ?',
    options2: ['4,4', '4,6', '5,6', '4,04'],
    answer2: '4,4',  },
  {
    u: 1, n: 9, page: 34, pages: '34–36',
    fr: 'Estimer la différence des décimaux', en: 'Estimating decimal differences', ar: 'تقدير فرق الأعداد العشرية',
    focus: 'Pour estimer une différence, on arrondit les deux nombres avant de soustraire. L’estimation indique l’ordre de grandeur du résultat. Elle aide aussi à repérer une erreur de virgule : si l’estimation donne environ 3 et que le calcul donne 30, la virgule est probablement mal placée.',
    objectives: ['Arrondir avant de soustraire.', 'Utiliser l’ordre de grandeur pour contrôler.', 'Repérer une erreur de virgule.'],
    vocab: [['ordre de grandeur', 'Valeur approximative qui situe un résultat.'], ['arrondi', 'Valeur simplifiée et proche du nombre.'], ['écart', 'Différence entre deux valeurs.']],
    q: 'Quelle est la meilleure estimation de 9,7 − 4,1 ?',
    options: ['10 − 4 = 6', '9 − 5 = 4', '97 − 41 = 56', '9,7 − 4,1 = 5,6'],
    answer: '10 − 4 = 6',
    why: '9,7 s’arrondit à 10 et 4,1 s’arrondit à 4 ; le résultat exact 5,6 est proche de 6.',
    exampleFr: 'Une planche de 9,7 m, on en utilise 4,1 m : il reste environ 6 m.',
    exampleEn: 'A 9.7 m plank with 4.1 m used leaves about 6 m.',
    exampleAr: 'لوح بطول ٩٫٧ متر، نستخدم ٤٫١ متر فيتبقى نحو ٦ أمتار.',

    q2: 'Quelle est la meilleure estimation de 9,7 − 4,1 ?',
    options2: ['10 − 4 = 6', '9 − 4 = 5', '9,7 − 4,1 = 5,6', '10 − 5 = 5'],
    answer2: '10 − 4 = 6',  },
  {
    u: 1, n: 10, page: 37, pages: '37–39',
    fr: 'Soustraire jusqu’aux millièmes', en: 'Subtracting to thousandths', ar: 'الطرح حتى الجزء من ألف',
    focus: 'Quand les nombres vont jusqu’aux millièmes, il y a trois chiffres après la virgule. On complète chaque nombre avec des zéros pour écrire trois chiffres, puis on soustrait colonne par colonne. Les zéros ajoutés à droite de la partie décimale ne changent pas la valeur du nombre.',
    objectives: ['Écrire trois chiffres après la virgule.', 'Soustraire colonne par colonne jusqu’aux millièmes.', 'Justifier qu’un zéro final ne change pas la valeur.'],
    vocab: [['millième', 'Une part sur mille (0,001).'], ['compléter', 'Ajouter des zéros à droite.'], ['colonne', 'Alignement vertical des chiffres de même valeur.']],
    q: 'Comment écrit-on 2,4 avec trois chiffres après la virgule ?',
    options: ['2,400', '2,004', '2,040', '24,000'],
    answer: '2,400',
    why: 'Ajouter deux zéros à droite de la partie décimale conserve la valeur : 2,4 = 2,400.',
    exampleFr: '2,400 − 0,875 = 1,525. On écrit 0,875 sous 2,400 en alignant les virgules.',
    exampleEn: '2.400 − 0.875 = 1.525, with decimal points lined up.',
    exampleAr: '٢٫٤٠٠ − ٠٫٨٧٥ = ١٫٥٢٥ مع محاذاة الفاصلة العشرية.',
  },
  {
    u: 1, n: 11, page: 40, pages: '40–43',
    fr: 'Problèmes sur les décimaux', en: 'Decimal word problems', ar: 'مسائل على الأعداد العشرية',
    focus: 'Dans un problème, on lit d’abord ce que l’on cherche, puis les données, puis l’opération qui relie les données. Les mots « de plus », « en tout », « gagne » indiquent souvent une addition ; « de moins », « reste », « dépense » indiquent souvent une soustraction. On termine en vérifiant que la réponse a un sens et une unité.',
    objectives: ['Choisir l’opération à partir de l’énoncé.', 'Écrire la réponse avec son unité.', 'Contrôler la vraisemblance du résultat.'],
    vocab: [['donnée', 'Information chiffrée de l’énoncé.'], ['unité', 'Ce que le nombre mesure (DT, m, kg…).'], ['énoncé', 'Texte du problème.']],
    q: '« Amira a 12,5 DT, elle dépense 4,75 DT. » Quelle opération trouve ce qu’il lui reste ?',
    options: ['12,5 − 4,75', '12,5 + 4,75', '12,5 × 4,75', '4,75 − 12,5'],
    answer: '12,5 − 4,75',
    why: '« Il lui reste » indique une soustraction : 12,5 − 4,75 = 7,75 DT.',
    exampleFr: 'Amira a 12,5 DT et dépense 4,75 DT ; il lui reste 7,75 DT.',
    exampleEn: 'Amira has 12.5 and spends 4.75, so she has 7.75 left.',
    exampleAr: 'لدى أميرة ١٢٫٥ وتنفق ٤٫٧٥، فيتبقى لها ٧٫٧٥.',

    q2: 'Amira a 12,5 DT et dépense 4,75 DT. Combien lui reste-t-il ?',
    options2: ['7,75 DT', '8,25 DT', '7,25 DT', '6,75 DT'],
    answer2: '7,75 DT',  },
  // ---------------------------------------------------------------- Unité 2
  {
    u: 2, n: 2, page: 47, pages: '47–48',
    fr: 'Variables dans les équations', en: 'Variables in equations', ar: 'المتغيرات في المعادلات',
    focus: 'Une variable est une lettre qui représente un nombre inconnu. Dans l’équation x + 7 = 12, la variable x vaut 5. Pour trouver la valeur, on fait l’opération inverse : on soustrait 7 des deux côtés. Une équation reste vraie si l’on applique la même opération aux deux membres.',
    objectives: ['Reconnaître une variable dans une équation.', 'Trouver la valeur d’une variable par l’opération inverse.', 'Vérifier une solution en la remplaçant dans l’équation.'],
    vocab: [['variable', 'Lettre qui représente un nombre inconnu.'], ['équation', 'Égalité contenant une inconnue.'], ['membre', 'Chaque côté du signe égal.']],
    q: 'Dans x + 7 = 12, que vaut x ?',
    options: ['5', '7', '12', '19'],
    answer: '5',
    why: 'On soustrait 7 des deux côtés : x = 12 − 7 = 5. Vérification : 5 + 7 = 12.',
    exampleFr: 'Si x + 7 = 12, alors x = 5 ; on vérifie 5 + 7 = 12.',
    exampleEn: 'If x + 7 = 12 then x = 5; check 5 + 7 = 12.',
    exampleAr: 'إذا كان س + ٧ = ١٢ فإن س = ٥، وبالتحقق ٥ + ٧ = ١٢.',
  },
  {
    u: 2, n: 3, page: 49, pages: '49–50',
    fr: 'Raconter des histoires au moyen des nombres', en: 'Telling stories with numbers', ar: 'حكاية قصص بالأعداد',
    focus: 'Une même expression numérique peut raconter une histoire. L’expression 3 × 4 + 2 peut décrire trois paquets de quatre crayons plus deux crayons seuls. Raconter l’histoire aide à décider quelle opération écrire, et à vérifier que l’expression correspond bien à la situation.',
    objectives: ['Traduire une situation par une expression numérique.', 'Expliquer ce que représente chaque nombre.', 'Vérifier qu’une expression correspond à l’histoire.'],
    vocab: [['expression', 'Suite de nombres et d’opérations.'], ['situation', 'Ce qui se passe dans l’histoire.'], ['traduire', 'Écrire en nombres.']],
    q: 'Trois boîtes de 6 œufs plus 2 œufs seuls. Quelle expression décrit la situation ?',
    options: ['3 × 6 + 2', '3 + 6 + 2', '3 × (6 + 2)', '6 × 2 + 3'],
    answer: '3 × 6 + 2',
    why: 'Trois boîtes de 6 donnent 3 × 6, puis on ajoute les 2 œufs seuls.',
    exampleFr: '3 boîtes de 6 œufs plus 2 œufs : 3 × 6 + 2 = 20 œufs.',
    exampleEn: 'Three boxes of 6 eggs plus 2 loose eggs: 3 × 6 + 2 = 20 eggs.',
    exampleAr: 'ثلاث علب فيها ٦ بيضات زائد بيضتين: ٣ × ٦ + ٢ = ٢٠ بيضة.',

    q2: 'Combien d’œufs y a-t-il dans 3 boîtes de 6 œufs plus 2 œufs seuls ?',
    options2: ['20', '18', '24', '11'],
    answer2: '20',  },
  {
    u: 2, n: 6, page: 56, pages: '56–58',
    fr: 'Identifier les multiples', en: 'Identifying multiples', ar: 'تحديد المضاعفات',
    focus: 'Un multiple d’un nombre s’obtient en multipliant ce nombre par un entier. Les multiples de 4 sont 4, 8, 12, 16, 20… Un nombre est multiple de 4 si l’on peut le partager en groupes de 4 sans reste. Les tables de multiplication donnent directement les multiples.',
    objectives: ['Énumérer les multiples d’un nombre.', 'Reconnaître si un nombre est multiple d’un autre.', 'Relier multiple et reste nul dans une division.'],
    vocab: [['multiple', 'Résultat du produit d’un nombre par un entier.'], ['reste', 'Ce qui reste après une division.'], ['table', 'Liste ordonnée des produits.']],
    q: 'Lequel de ces nombres est un multiple de 4 ?',
    options: ['24', '18', '14', '10'],
    answer: '24',
    why: '24 = 4 × 6, donc 24 est un multiple de 4. 18, 14 et 10 laissent un reste.',
    exampleFr: '24 est un multiple de 4 car 24 ÷ 4 = 6 exactement.',
    exampleEn: '24 is a multiple of 4 because 24 ÷ 4 = 6 exactly.',
    exampleAr: '٢٤ من مضاعفات ٤ لأن ٢٤ ÷ ٤ = ٦ بالضبط.',
  },
  {
    u: 2, n: 8, page: 62, pages: '62–64',
    fr: 'Facteurs ou multiples', en: 'Factors or multiples', ar: 'العوامل أو المضاعفات',
    focus: 'Un facteur divise un nombre exactement ; un multiple est obtenu en multipliant. Dans 3 × 8 = 24, 3 et 8 sont des facteurs de 24, et 24 est un multiple de 3 et de 8. Attention : 3 est un facteur de 24, mais 24 n’est pas un facteur de 3.',
    objectives: ['Distinguer facteur et multiple.', 'Relier facteurs et multiples dans une même égalité.', 'Éviter la confusion entre les deux mots.'],
    vocab: [['facteur', 'Nombre qui divise exactement un autre.'], ['multiple', 'Produit d’un nombre par un entier.'], ['diviser', 'Partager en parts égales.']],
    q: 'Dans 3 × 8 = 24, comment appelle-t-on 8 par rapport à 24 ?',
    options: ['Un facteur de 24', 'Un multiple de 24', 'Le double de 24', 'Un reste de 24'],
    answer: 'Un facteur de 24',
    why: '8 divise 24 exactement (24 ÷ 8 = 3), donc 8 est un facteur de 24.',
    exampleFr: '8 est un facteur de 24 ; 24 est un multiple de 8.',
    exampleEn: '8 is a factor of 24; 24 is a multiple of 8.',
    exampleAr: '٨ عامل من عوامل ٢٤، و٢٤ من مضاعفات ٨.',

    q2: 'Dans 3 × 8 = 24, comment appelle-t-on 3 par rapport à 24 ?',
    options2: ['Un facteur de 24', 'Un multiple de 24', 'Un reste', 'Un quotient'],
    answer2: 'Un facteur de 24',  },
  // ---------------------------------------------------------------- Unité 3
  {
    u: 3, n: 2, page: 68, pages: '68–71',
    fr: 'La propriété de distributivité de la multiplication', en: 'The distributive property of multiplication', ar: 'خاصية التوزيع في الضرب',
    focus: 'La distributivité permet de partager un produit : 6 × 14 = 6 × (10 + 4) = 6 × 10 + 6 × 4. On décompose un facteur en une somme, on multiplie chaque partie, puis on additionne. Cela rend le calcul mental plus simple et prépare l’algorithme de multiplication.',
    objectives: ['Décomposer un facteur en une somme.', 'Appliquer la distributivité pour calculer.', 'Expliquer pourquoi le résultat reste le même.'],
    vocab: [['distributivité', 'Propriété qui permet de distribuer une multiplication sur une addition.'], ['décomposer', 'Écrire un nombre comme une somme.'], ['facteur', 'Nombre que l’on multiplie.']],
    q: 'Comment calculer 6 × 14 avec la distributivité ?',
    options: ['6 × 10 + 6 × 4', '6 × 10 + 4', '6 + 10 + 4', '6 × 14 × 10'],
    answer: '6 × 10 + 6 × 4',
    why: '14 = 10 + 4, donc 6 × 14 = 6 × 10 + 6 × 4 = 60 + 24 = 84.',
    exampleFr: '6 × 14 = 6 × 10 + 6 × 4 = 60 + 24 = 84.',
    exampleEn: '6 × 14 = 6 × 10 + 6 × 4 = 60 + 24 = 84.',
    exampleAr: '٦ × ١٤ = ٦ × ١٠ + ٦ × ٤ = ٦٠ + ٢٤ = ٨٤.',

    q2: 'Combien vaut 6 × 14 en utilisant la distributivité ?',
    options2: ['84', '64', '20', '60'],
    answer2: '84',  },
  {
    u: 3, n: 4, page: 75, pages: '75–77',
    fr: 'Multiplication de nombres à plusieurs chiffres', en: 'Multiplying multi-digit numbers', ar: 'ضرب الأعداد متعددة الأرقام',
    focus: 'Pour multiplier des nombres à plusieurs chiffres, on répète l’algorithme pour chaque chiffre du multiplicateur, en décalant chaque ligne d’un rang supplémentaire. Le nombre de produits partiels dépend du nombre de chiffres du multiplicateur. Une estimation préalable permet de contrôler l’ordre de grandeur du résultat.',
    objectives: ['Poser une multiplication à trois chiffres.', 'Décaler chaque produit partiel du bon nombre de rangs.', 'Contrôler le résultat par une estimation.'],
    vocab: [['multiplicateur', 'Le nombre par lequel on multiplie.'], ['produit partiel', 'Résultat d’une ligne intermédiaire.'], ['rang', 'Position d’un chiffre (unités, dizaines…).']],
    q: 'Pour 234 × 12, combien de produits partiels écrit-on avant d’additionner ?',
    options: ['Deux', 'Un', 'Trois', 'Douze'],
    answer: 'Deux',
    why: 'Le multiplicateur 12 a deux chiffres, donc on écrit deux produits partiels.',
    exampleFr: '234 × 12 = 234 × 2 + 234 × 10 = 468 + 2 340 = 2 808.',
    exampleEn: '234 × 12 = 234 × 2 + 234 × 10 = 468 + 2 340 = 2 808.',
    exampleAr: '٢٣٤ × ١٢ = ٤٦٨ + ٢٣٤٠ = ٢٨٠٨.',

    q2: 'Combien vaut 234 × 12 ?',
    options2: ['2 808', '2 468', '2 340', '2 448'],
    answer2: '2 808',  },
  {
    u: 3, n: 5, page: 78, pages: '78–80',
    fr: 'Problèmes de multiplication dans le monde réel', en: 'Real-world multiplication problems', ar: 'مسائل الضرب في الحياة الواقعية',
    focus: 'Un problème de multiplication apparaît quand on répète un même groupe plusieurs fois : un prix unitaire fois une quantité, une distance par trajet fois le nombre de trajets. On identifie d’abord les deux quantités multipliées, puis on vérifie l’unité du résultat, par exemple « DT » pour un coût total.',
    objectives: ['Identifier les deux facteurs d’un problème.', 'Choisir la multiplication plutôt qu’une addition répétée.', 'Donner la réponse avec la bonne unité.'],
    vocab: [['prix unitaire', 'Prix d’un seul objet.'], ['quantité', 'Nombre d’objets.'], ['total', 'Somme de tous les éléments.']],
    q: 'Un cahier coûte 12 DT. Combien coûtent 7 cahiers ?',
    options: ['84 DT', '19 DT', '72 DT', '96 DT'],
    answer: '84 DT',
    why: '7 cahiers à 12 DT chacun coûtent 7 × 12 = 84 DT.',
    exampleFr: '7 × 12 = 84, donc 84 DT pour sept cahiers.',
    exampleEn: '7 × 12 = 84, so 84 for seven notebooks.',
    exampleAr: '٧ × ١٢ = ٨٤، أي ٨٤ لسبعة دفاتر.',
  },
  // ---------------------------------------------------------------- Unité 4
  {
    u: 4, n: 1, page: 81, pages: '81–82',
    fr: 'Utiliser le modèle de l’aire du rectangle pour diviser', en: 'Using the area model to divide', ar: 'استخدام نموذج المساحة للقسمة',
    focus: 'Le modèle de l’aire relie division et multiplication : si un rectangle a une aire de 96 et une largeur de 8, sa longueur est 96 ÷ 8 = 12, car 8 × 12 = 96. On peut décomposer l’aire en parties faciles : 96 = 80 + 16, donc 80 ÷ 8 = 10 et 16 ÷ 8 = 2, et 10 + 2 = 12.',
    objectives: ['Relier division et aire d’un rectangle.', 'Décomposer le dividende en parties faciles.', 'Additionner les quotients partiels.'],
    vocab: [['aire', 'Surface d’une figure.'], ['quotient', 'Résultat d’une division.'], ['dividende', 'Nombre que l’on divise.']],
    q: 'Un rectangle d’aire 96 et de largeur 8 a quelle longueur ?',
    options: ['12', '10', '14', '88'],
    answer: '12',
    why: '96 ÷ 8 = 12, et on vérifie 8 × 12 = 96.',
    exampleFr: '96 = 80 + 16 ; 80 ÷ 8 = 10 et 16 ÷ 8 = 2 ; 10 + 2 = 12.',
    exampleEn: '96 = 80 + 16; 80 ÷ 8 = 10 and 16 ÷ 8 = 2; 10 + 2 = 12.',
    exampleAr: '٩٦ = ٨٠ + ١٦، و٨٠ ÷ ٨ = ١٠ و١٦ ÷ ٨ = ٢، فالمجموع ١٢.',
  },
  {
    u: 4, n: 2, page: 83, pages: '83–84',
    fr: 'Estimer des quotients', en: 'Estimating quotients', ar: 'تقدير خارج القسمة',
    focus: 'Pour estimer un quotient, on remplace le dividende et le diviseur par des nombres proches qui se divisent facilement. 348 ÷ 6 s’estime par 360 ÷ 6 = 60. L’estimation donne l’ordre de grandeur : le quotient exact sera proche de 60.',
    objectives: ['Remplacer par des nombres faciles à diviser.', 'Estimer l’ordre de grandeur d’un quotient.', 'Contrôler un quotient exact par l’estimation.'],
    vocab: [['estimation', 'Valeur approchée.'], ['quotient', 'Résultat d’une division.'], ['diviseur', 'Nombre par lequel on divise.']],
    q: 'Quelle est la meilleure estimation de 348 ÷ 6 ?',
    options: ['360 ÷ 6 = 60', '300 ÷ 6 = 50', '350 ÷ 5 = 70', '348 ÷ 6 = 58'],
    answer: '360 ÷ 6 = 60',
    why: '360 est proche de 348 et se divise facilement par 6 ; le quotient exact est 58.',
    exampleFr: '348 ÷ 6 ≈ 360 ÷ 6 = 60 ; le quotient exact est 58.',
    exampleEn: '348 ÷ 6 ≈ 360 ÷ 6 = 60; the exact quotient is 58.',
    exampleAr: '٣٤٨ ÷ ٦ ≈ ٣٦٠ ÷ ٦ = ٦٠، والخارج الدقيق ٥٨.',
  },
  {
    u: 4, n: 3, page: 85, pages: '85–86',
    fr: 'Utiliser l’algorithme standard pour diviser', en: 'Using the standard division algorithm', ar: 'استخدام خوارزمية القسمة المعيارية',
    focus: 'L’algorithme standard divise chiffre par chiffre, de gauche à droite. Pour 856 ÷ 4 : 8 ÷ 4 = 2, puis 5 ÷ 4 = 1 reste 1, on abaisse le 6 pour former 16, et 16 ÷ 4 = 4. Le quotient est 214. On vérifie en multipliant : 214 × 4 = 856.',
    objectives: ['Diviser chiffre par chiffre de gauche à droite.', 'Gérer le reste en abaissant le chiffre suivant.', 'Vérifier le quotient par la multiplication.'],
    vocab: [['abaisser', 'Descendre le chiffre suivant.'], ['reste', 'Ce qui n’est pas divisible.'], ['quotient', 'Résultat de la division.']],
    q: 'Dans 856 ÷ 4, après 8 ÷ 4 = 2 et 5 ÷ 4 = 1 reste 1, que fait-on du 6 ?',
    options: ['On l’abaisse pour former 16 et on divise par 4.', 'On l’ignore.', 'On l’additionne au quotient.', 'On le multiplie par 4.'],
    answer: 'On l’abaisse pour former 16 et on divise par 4.',
    why: 'Le reste 1 avec le chiffre 6 abaissé donne 16, et 16 ÷ 4 = 4. Le quotient est 214.',
    exampleFr: '856 ÷ 4 = 214, et 214 × 4 = 856.',
    exampleEn: '856 ÷ 4 = 214, and 214 × 4 = 856.',
    exampleAr: '٨٥٦ ÷ ٤ = ٢١٤، وبالتحقق ٢١٤ × ٤ = ٨٥٦.',
  },
  {
    u: 4, n: 4, page: 87, pages: '87–88',
    fr: 'La relation entre la division et la multiplication', en: 'The relationship between division and multiplication', ar: 'العلاقة بين القسمة والضرب',
    focus: 'La division et la multiplication sont des opérations inverses. Si 7 × 8 = 56, alors 56 ÷ 7 = 8 et 56 ÷ 8 = 7. Cette relation permet de vérifier une division et de retrouver un facteur manquant.',
    objectives: ['Écrire les deux divisions issues d’un produit.', 'Utiliser la multiplication pour vérifier une division.', 'Retrouver un facteur manquant.'],
    vocab: [['inverse', 'Qui défait l’autre opération.'], ['produit', 'Résultat d’une multiplication.'], ['facteur', 'Nombre multiplié.']],
    q: 'Si 7 × 8 = 56, quelle division est correcte ?',
    options: ['56 ÷ 8 = 7', '56 ÷ 7 = 9', '8 ÷ 56 = 7', '56 ÷ 56 = 8'],
    answer: '56 ÷ 8 = 7',
    why: 'La division défait la multiplication : 56 partagé en 8 groupes donne 7.',
    exampleFr: '7 × 8 = 56 donne aussi 56 ÷ 7 = 8 et 56 ÷ 8 = 7.',
    exampleEn: '7 × 8 = 56 also gives 56 ÷ 7 = 8 and 56 ÷ 8 = 7.',
    exampleAr: '٧ × ٨ = ٥٦ تعني أيضاً ٥٦ ÷ ٧ = ٨ و٥٦ ÷ ٨ = ٧.',
  },
  {
    u: 4, n: 5, page: 89, pages: '89–91',
    fr: 'Des situations-problèmes à plusieurs étapes', en: 'Multi-step word problems', ar: 'مسائل متعددة الخطوات',
    focus: 'Un problème à plusieurs étapes demande plus d’une opération. On le découpe en questions simples : que faut-il trouver d’abord ? Pour 3 boîtes de 24 stylos partagés entre 8 élèves, on calcule d’abord 3 × 24 = 72 stylos, puis 72 ÷ 8 = 9 stylos par élève. L’ordre des étapes compte.',
    objectives: ['Découper un problème en étapes.', 'Choisir l’opération de chaque étape.', 'Présenter le résultat final avec son unité.'],
    vocab: [['étape', 'Partie d’un calcul.'], ['intermédiaire', 'Résultat provisoire.'], ['répartir', 'Partager en parts égales.']],
    q: '3 boîtes de 24 stylos réparties entre 8 élèves. Quelle est la première étape ?',
    options: ['3 × 24 = 72', '24 ÷ 8 = 3', '3 + 24 = 27', '8 × 24 = 192'],
    answer: '3 × 24 = 72',
    why: 'On cherche d’abord le nombre total de stylos : 3 × 24 = 72, puis 72 ÷ 8 = 9 par élève.',
    exampleFr: '3 × 24 = 72 stylos, puis 72 ÷ 8 = 9 stylos par élève.',
    exampleEn: '3 × 24 = 72 pens, then 72 ÷ 8 = 9 pens per pupil.',
    exampleAr: '٣ × ٢٤ = ٧٢ قلماً، ثم ٧٢ ÷ ٨ = ٩ أقلام لكل تلميذ.',
  },
  // ---------------------------------------------------------------- Unité 5
  {
    u: 5, n: 2, page: 95, pages: '95–96',
    fr: 'Multiplier des nombres décimaux par des nombres entiers', en: 'Multiplying decimals by whole numbers', ar: 'ضرب الأعداد العشرية في أعداد صحيحة',
    focus: 'Pour multiplier un décimal par un entier, on multiplie d’abord comme si le nombre était entier, puis on replace la virgule. 2,5 × 4 : on calcule 25 × 4 = 100, puis on replace la virgule pour un chiffre après la virgule : 10,0, donc 10. Le nombre de chiffres après la virgule du résultat est le même que celui du décimal de départ.',
    objectives: ['Multiplier sans la virgule puis la replacer.', 'Compter les chiffres après la virgule.', 'Contrôler le résultat par une estimation.'],
    vocab: [['virgule', 'Sépare la partie entière de la partie décimale.'], ['décimal', 'Nombre avec une partie après la virgule.'], ['entier', 'Nombre sans virgule.']],
    q: 'Que vaut 2,5 × 4 ?',
    options: ['10', '1,0', '100', '0,10'],
    answer: '10',
    why: '25 × 4 = 100 ; avec un chiffre après la virgule, on obtient 10,0, c’est-à-dire 10.',
    exampleFr: '2,5 × 4 = 10 : quatre bouteilles de 2,5 L font 10 L.',
    exampleEn: '2.5 × 4 = 10: four bottles of 2.5 L make 10 L.',
    exampleAr: '٢٫٥ × ٤ = ١٠، أي أربع زجاجات سعة ٢٫٥ لتر تساوي ١٠ لترات.',
  },
  {
    u: 5, n: 3, page: 97, pages: '97–98',
    fr: 'Multiplier des dixièmes par des dixièmes', en: 'Multiplying tenths by tenths', ar: 'ضرب الأجزاء من عشرة في الأجزاء من عشرة',
    focus: 'Quand on multiplie deux nombres à un chiffre après la virgule, le résultat a deux chiffres après la virgule, car dixième × dixième donne des centièmes. 0,3 × 0,4 : 3 × 4 = 12, et deux chiffres après la virgule donnent 0,12. Le produit est plus petit que chaque facteur, car on prend une partie d’une partie.',
    objectives: ['Compter deux chiffres après la virgule.', 'Comprendre pourquoi le produit est plus petit.', 'Relier dixième × dixième à des centièmes.'],
    vocab: [['dixième', 'Une part sur dix (0,1).'], ['centième', 'Une part sur cent (0,01).'], ['facteur', 'Nombre multiplié.']],
    q: 'Que vaut 0,3 × 0,4 ?',
    options: ['0,12', '1,2', '12', '0,7'],
    answer: '0,12',
    why: '3 × 4 = 12, et deux chiffres après la virgule donnent 0,12.',
    exampleFr: '0,3 × 0,4 = 0,12 : trois dixièmes d’un dixième font douze centièmes.',
    exampleEn: '0.3 × 0.4 = 0.12: three tenths of four tenths is twelve hundredths.',
    exampleAr: '٠٫٣ × ٠٫٤ = ٠٫١٢، فثلاثة أعشار من أربعة أعشار تساوي اثني عشر جزءاً من مئة.',
  },
  {
    u: 5, n: 4, page: 99, pages: '99–100',
    fr: 'Utiliser le modèle de l’aire du rectangle pour multiplier des nombres décimaux',
    en: 'Using the area model to multiply decimals', ar: 'استخدام نموذج المساحة لضرب الأعداد العشرية',
    focus: 'Un rectangle de 1,2 sur 0,5 se découpe en dixièmes. Le modèle montre que l’aire vaut 1,2 × 0,5 = 0,6 : on prend la moitié de 1,2. Le modèle d’aire rend visible pourquoi le produit de deux nombres inférieurs à 1 est inférieur à chacun d’eux.',
    objectives: ['Représenter un produit de décimaux par une aire.', 'Calculer l’aire d’un rectangle décimal.', 'Expliquer pourquoi le produit peut être plus petit.'],
    vocab: [['aire', 'Surface d’une figure.'], ['modèle', 'Représentation qui aide à comprendre.'], ['dixième', 'Une part sur dix.']],
    q: 'Un rectangle mesure 1,2 m sur 0,5 m. Quelle est son aire ?',
    options: ['0,6 m²', '1,7 m²', '6 m²', '0,06 m²'],
    answer: '0,6 m²',
    why: '1,2 × 0,5 = 0,6 : prendre la moitié de 1,2 donne 0,6.',
    exampleFr: '1,2 × 0,5 = 0,6, donc l’aire est 0,6 m².',
    exampleEn: '1.2 × 0.5 = 0.6, so the area is 0.6 m².',
    exampleAr: '١٫٢ × ٠٫٥ = ٠٫٦، فالمساحة ٠٫٦ متر مربع.',
  },
  {
    u: 5, n: 5, page: 101, pages: '101–102',
    fr: 'Multiplier des nombres décimaux jusqu’aux centièmes près', en: 'Multiplying decimals to hundredths', ar: 'ضرب الأعداد العشرية حتى الجزء من مئة',
    focus: 'On multiplie des nombres ayant jusqu’à deux chiffres après la virgule. 1,25 × 0,4 : on calcule 125 × 4 = 500, puis on place trois chiffres après la virgule (deux + un), ce qui donne 0,500 = 0,5. La règle du comptage des décimales reste la même.',
    objectives: ['Compter le total des chiffres après la virgule.', 'Placer correctement la virgule dans le produit.', 'Simplifier les zéros finaux.'],
    vocab: [['centième', 'Une part sur cent.'], ['produit', 'Résultat d’une multiplication.'], ['simplifier', 'Retirer les zéros inutiles.']],
    q: 'Que vaut 1,25 × 0,4 ?',
    options: ['0,5', '5', '0,05', '50'],
    answer: '0,5',
    why: '125 × 4 = 500 ; trois chiffres après la virgule donnent 0,500, soit 0,5.',
    exampleFr: '1,25 × 0,4 = 0,500 = 0,5.',
    exampleEn: '1.25 × 0.4 = 0.500 = 0.5.',
    exampleAr: '١٫٢٥ × ٠٫٤ = ٠٫٥٠٠ = ٠٫٥.',
  },
  {
    u: 5, n: 6, page: 103, pages: '103–104',
    fr: 'Multiplier des nombres décimaux jusqu’aux millièmes près', en: 'Multiplying decimals to thousandths', ar: 'ضرب الأعداد العشرية حتى الجزء من ألف',
    focus: 'Avec trois chiffres après la virgule, le produit peut avoir jusqu’à six chiffres après la virgule. 0,125 × 0,2 : 125 × 2 = 250, et trois plus un donnent quatre chiffres, donc 0,0250 = 0,025. On compte toujours le total des décimales des deux facteurs.',
    objectives: ['Additionner les nombres de décimales des facteurs.', 'Placer la virgule au bon rang.', 'Vérifier la vraisemblance du produit.'],
    vocab: [['millième', 'Une part sur mille.'], ['facteur', 'Nombre multiplié.'], ['vraisemblance', 'Caractère plausible d’un résultat.']],
    q: 'Combien de chiffres après la virgule aura le produit 0,125 × 0,2 ?',
    options: ['Quatre', 'Trois', 'Un', 'Six'],
    answer: 'Quatre',
    why: 'Trois décimales plus une décimale donnent quatre décimales : 0,0250.',
    exampleFr: '0,125 × 0,2 = 0,0250 = 0,025.',
    exampleEn: '0.125 × 0.2 = 0.0250 = 0.025.',
    exampleAr: '٠٫١٢٥ × ٠٫٢ = ٠٫٠٢٥٠ = ٠٫٠٢٥.',
  },
  {
    u: 5, n: 7, page: 105, pages: '105–107',
    fr: 'Les nombres décimaux et le système métrique', en: 'Decimals and the metric system', ar: 'الأعداد العشرية والنظام المتري',
    focus: 'Le système métrique est construit sur des puissances de dix : 1 m = 10 dm = 100 cm = 1 000 mm. On convertit en multipliant ou divisant par 10, 100 ou 1 000, ce qui revient à décaler la virgule. 2,5 m = 250 cm, car on multiplie par 100.',
    objectives: ['Convertir entre unités métriques.', 'Décaler la virgule selon la puissance de dix.', 'Choisir l’unité adaptée à une mesure.'],
    vocab: [['convertir', 'Changer d’unité sans changer la quantité.'], ['système métrique', 'Système de mesure fondé sur le mètre.'], ['préfixe', 'milli-, centi-, déci-.']],
    q: 'Combien de centimètres font 2,5 m ?',
    options: ['250 cm', '25 cm', '2 500 cm', '0,25 cm'],
    answer: '250 cm',
    why: '1 m = 100 cm, donc 2,5 × 100 = 250 cm.',
    exampleFr: '2,5 m = 250 cm = 2 500 mm.',
    exampleEn: '2.5 m = 250 cm = 2 500 mm.',
    exampleAr: '٢٫٥ متر = ٢٥٠ سم = ٢٥٠٠ مم.',

    q2: 'Combien de millimètres font 2,5 m ?',
    options2: ['2 500 mm', '250 mm', '25 mm', '25 000 mm'],
    answer2: '2 500 mm',  },
  {
    u: 5, n: 8, page: 108, pages: '108–109',
    fr: 'Mesure, nombres décimaux et puissances de dix', en: 'Measurement, decimals and powers of ten', ar: 'القياس والأعداد العشرية وقوى العشرة',
    focus: 'Chaque conversion métrique est une multiplication ou une division par une puissance de dix. Passer d’une unité plus petite à une unité plus grande divise ; passer d’une unité plus grande à une plus petite multiplie. 450 cm = 4,5 m, car on divise par 100.',
    objectives: ['Choisir entre multiplier et diviser lors d’une conversion.', 'Appliquer la puissance de dix correcte.', 'Contrôler la cohérence de l’unité obtenue.'],
    vocab: [['puissance de dix', '10, 100, 1 000…'], ['diviser', 'Partager en parts égales.'], ['cohérence', 'Absence de contradiction.']],
    q: 'Pour passer de 450 cm à des mètres, que fait-on ?',
    options: ['On divise par 100.', 'On multiplie par 100.', 'On divise par 10.', 'On multiplie par 1 000.'],
    answer: 'On divise par 100.',
    why: 'Le mètre est plus grand que le centimètre : 450 ÷ 100 = 4,5 m.',
    exampleFr: '450 cm ÷ 100 = 4,5 m.',
    exampleEn: '450 cm ÷ 100 = 4.5 m.',
    exampleAr: '٤٥٠ سم ÷ ١٠٠ = ٤٫٥ متر.',

    q2: 'Combien de mètres font 450 cm ?',
    options2: ['4,5 m', '45 m', '0,45 m', '450 m'],
    answer2: '4,5 m',  },
  {
    u: 5, n: 9, page: 110, pages: '110–111',
    fr: 'Résoudre des situations-problèmes à plusieurs étapes', en: 'Solving multi-step decimal problems', ar: 'حل مسائل متعددة الخطوات بالأعداد العشرية',
    focus: 'Un problème décimal à plusieurs étapes combine conversions, multiplications et additions. On note chaque résultat intermédiaire avec son unité, puis on convertit si nécessaire avant d’additionner. On termine par une vérification d’ordre de grandeur.',
    objectives: ['Enchaîner plusieurs opérations avec des décimaux.', 'Convertir avant d’additionner des unités différentes.', 'Vérifier le résultat final.'],
    vocab: [['intermédiaire', 'Résultat provisoire.'], ['convertir', 'Changer d’unité.'], ['ordre de grandeur', 'Valeur approximative.']],
    q: '2,5 m de tissu plus 75 cm de tissu : combien au total ?',
    options: ['3,25 m', '77,5 m', '3,2 m', '325 m'],
    answer: '3,25 m',
    why: '75 cm = 0,75 m, donc 2,5 + 0,75 = 3,25 m.',
    exampleFr: '75 cm = 0,75 m ; 2,5 + 0,75 = 3,25 m.',
    exampleEn: '75 cm = 0.75 m; 2.5 + 0.75 = 3.25 m.',
    exampleAr: '٧٥ سم = ٠٫٧٥ متر، و٢٫٥ + ٠٫٧٥ = ٣٫٢٥ متر.',
  },
  {
    u: 5, n: 10, page: 112, pages: '112–113',
    fr: 'Diviser par des puissances de dix', en: 'Dividing by powers of ten', ar: 'القسمة على قوى العشرة',
    focus: 'Diviser par 10, 100 ou 1 000 décale la virgule vers la gauche d’un, deux ou trois rangs. 34,5 ÷ 10 = 3,45 et 34,5 ÷ 100 = 0,345. La division rend le nombre plus petit ; si le résultat est plus grand, la virgule a été décalée du mauvais côté.',
    objectives: ['Décaler la virgule vers la gauche.', 'Compter le nombre de rangs selon la puissance.', 'Repérer une erreur de sens.'],
    vocab: [['virgule', 'Sépare les parties du nombre.'], ['décaler', 'Déplacer d’un rang.'], ['puissance de dix', '10, 100, 1 000…']],
    q: 'Que vaut 34,5 ÷ 100 ?',
    options: ['0,345', '3,45', '345', '3 450'],
    answer: '0,345',
    why: 'Diviser par 100 décale la virgule de deux rangs vers la gauche : 34,5 → 3,45 → 0,345.',
    exampleFr: '34,5 ÷ 100 = 0,345.',
    exampleEn: '34.5 ÷ 100 = 0.345.',
    exampleAr: '٣٤٫٥ ÷ ١٠٠ = ٠٫٣٤٥.',
  },
  {
    u: 5, n: 11, page: 114, pages: '114–115',
    fr: 'Modèles et relations avec des puissances de dix', en: 'Patterns and relationships with powers of ten', ar: 'الأنماط والعلاقات مع قوى العشرة',
    focus: 'Multiplier par 10, 100, 1 000 puis diviser par les mêmes nombres forme des familles de nombres liés. 4,2 ; 42 ; 420 ; 4 200 sont obtenus en multipliant par 10 à chaque étape. Reconnaître le modèle permet de prévoir le résultat sans calculer.',
    objectives: ['Décrire un modèle de multiplication par 10.', 'Prévoir le terme suivant d’une suite.', 'Relier multiplication et division par une puissance de dix.'],
    vocab: [['modèle', 'Régularité répétée.'], ['suite', 'Liste ordonnée de nombres.'], ['terme', 'Élément d’une suite.']],
    q: 'Quel nombre suit 4,2 ; 42 ; 420 dans ce modèle ?',
    options: ['4 200', '4,20', '42,0', '840'],
    answer: '4 200',
    why: 'Chaque terme est multiplié par 10 : 420 × 10 = 4 200.',
    exampleFr: '4,2 × 10 = 42 ; 42 × 10 = 420 ; 420 × 10 = 4 200.',
    exampleEn: '4.2 × 10 = 42; 42 × 10 = 420; 420 × 10 = 4 200.',
    exampleAr: '٤٫٢ × ١٠ = ٤٢، ثم ٤٢٠، ثم ٤٢٠٠.',
  },
  {
    u: 5, n: 12, page: 116, pages: '116–117',
    fr: 'Diviser des nombres décimaux par des nombres entiers', en: 'Dividing decimals by whole numbers', ar: 'قسمة الأعداد العشرية على أعداد صحيحة',
    focus: 'On divise un décimal par un entier comme un nombre entier, puis on place la virgule dans le quotient au même niveau que dans le dividende. 7,5 ÷ 3 : 75 ÷ 3 = 25, et avec un chiffre après la virgule on obtient 2,5. On vérifie en multipliant : 2,5 × 3 = 7,5.',
    objectives: ['Diviser un décimal par un entier.', 'Placer la virgule dans le quotient.', 'Vérifier le quotient par la multiplication.'],
    vocab: [['quotient', 'Résultat de la division.'], ['dividende', 'Nombre divisé.'], ['aligner', 'Placer au même niveau.']],
    q: 'Que vaut 7,5 ÷ 3 ?',
    options: ['2,5', '25', '0,25', '2,05'],
    answer: '2,5',
    why: '75 ÷ 3 = 25 ; avec un chiffre après la virgule, le quotient est 2,5. Vérification : 2,5 × 3 = 7,5.',
    exampleFr: '7,5 ÷ 3 = 2,5, et 2,5 × 3 = 7,5.',
    exampleEn: '7.5 ÷ 3 = 2.5, and 2.5 × 3 = 7.5.',
    exampleAr: '٧٫٥ ÷ ٣ = ٢٫٥، وبالتحقق ٢٫٥ × ٣ = ٧٫٥.',
  },
  {
    u: 5, n: 13, page: 118, pages: '118–120',
    fr: 'Diviser deux nombres décimaux', en: 'Dividing two decimals', ar: 'قسمة عددين عشريين',
    focus: 'Pour diviser par un décimal, on rend le diviseur entier en multipliant les deux nombres par la même puissance de dix. 4,5 ÷ 0,9 devient 45 ÷ 9 = 5. Le quotient ne change pas parce que les deux nombres ont été multipliés par 10.',
    objectives: ['Rendre le diviseur entier.', 'Multiplier les deux nombres par la même puissance de dix.', 'Justifier que le quotient reste identique.'],
    vocab: [['diviseur', 'Nombre par lequel on divise.'], ['quotient', 'Résultat de la division.'], ['équivalent', 'De même valeur.']],
    q: 'Comment calculer 4,5 ÷ 0,9 plus simplement ?',
    options: ['45 ÷ 9 = 5', '45 ÷ 0,9', '4,5 ÷ 9', '4 500 ÷ 9'],
    answer: '45 ÷ 9 = 5',
    why: 'On multiplie les deux nombres par 10 : 4,5 → 45 et 0,9 → 9, donc 45 ÷ 9 = 5.',
    exampleFr: '4,5 ÷ 0,9 = 45 ÷ 9 = 5.',
    exampleEn: '4.5 ÷ 0.9 = 45 ÷ 9 = 5.',
    exampleAr: '٤٫٥ ÷ ٠٫٩ = ٤٥ ÷ ٩ = ٥.',

    q2: 'Combien vaut 4,5 ÷ 0,9 ?',
    options2: ['5', '0,5', '50', '4,05'],
    answer2: '5',  },
  // ---------------------------------------------------------------- Unité 6
  {
    u: 6, n: 2, page: 123, pages: '123–125',
    fr: 'Expressions numériques avec des symboles de regroupement', en: 'Numerical expressions with grouping symbols', ar: 'التعابير العددية مع رموز التجميع',
    focus: 'Les parenthèses indiquent ce qui se calcule en premier. Dans 3 × (4 + 5), on calcule 4 + 5 = 9, puis 3 × 9 = 27. Sans parenthèses, 3 × 4 + 5 donne 17, car la multiplication passe avant l’addition. Les crochets et les accolades fonctionnent comme les parenthèses.',
    objectives: ['Calculer d’abord l’intérieur des parenthèses.', 'Comparer une expression avec et sans parenthèses.', 'Utiliser crochets et accolades correctement.'],
    vocab: [['parenthèses', 'Symboles ( ) qui regroupent un calcul.'], ['regroupement', 'Action de réunir une partie du calcul.'], ['priorité', 'Ordre dans lequel on calcule.']],
    q: 'Que vaut 3 × (4 + 5) ?',
    options: ['27', '17', '12', '35'],
    answer: '27',
    why: 'On calcule d’abord la parenthèse : 4 + 5 = 9, puis 3 × 9 = 27.',
    exampleFr: '3 × (4 + 5) = 3 × 9 = 27, alors que 3 × 4 + 5 = 17.',
    exampleEn: '3 × (4 + 5) = 3 × 9 = 27, while 3 × 4 + 5 = 17.',
    exampleAr: '٣ × (٤ + ٥) = ٣ × ٩ = ٢٧، بينما ٣ × ٤ + ٥ = ١٧.',
  },
  {
    u: 6, n: 3, page: 126, pages: '126–127',
    fr: 'Écrire des expressions pour représenter des scénarios', en: 'Writing expressions to represent scenarios', ar: 'كتابة التعابير لتمثيل المواقف',
    focus: 'On peut écrire une expression avant de calculer. « Le double de la somme de 3 et 5 » s’écrit 2 × (3 + 5). Traduire la phrase en expression oblige à respecter l’ordre indiqué par les mots, et notamment à placer les parenthèses au bon endroit.',
    objectives: ['Traduire une phrase en expression numérique.', 'Placer les parenthèses selon le sens de la phrase.', 'Vérifier l’expression sur un exemple.'],
    vocab: [['expression', 'Suite de nombres et d’opérations.'], ['somme', 'Résultat d’une addition.'], ['double', 'Deux fois une quantité.']],
    q: 'Comment écrire « le double de la somme de 3 et 5 » ?',
    options: ['2 × (3 + 5)', '2 × 3 + 5', '2 + 3 + 5', '3 + 5 × 2'],
    answer: '2 × (3 + 5)',
    why: 'La somme 3 + 5 se calcule d’abord, puis on la double : 2 × 8 = 16.',
    exampleFr: '2 × (3 + 5) = 2 × 8 = 16.',
    exampleEn: '2 × (3 + 5) = 2 × 8 = 16.',
    exampleAr: '٢ × (٣ + ٥) = ٢ × ٨ = ١٦.',
  },
  {
    u: 6, n: 4, page: 128, pages: '128–130',
    fr: 'Identifier les modèles numériques', en: 'Identifying numerical patterns', ar: 'تحديد الأنماط العددية',
    focus: 'Un modèle numérique est une règle qui produit une suite. Dans 5, 10, 15, 20, la règle est « ajouter 5 ». Dans 3, 6, 12, 24, la règle est « multiplier par 2 ». Pour trouver la règle, on compare deux termes voisins, puis on la teste sur un troisième.',
    objectives: ['Trouver la règle d’une suite.', 'Vérifier une règle sur plusieurs termes.', 'Continuer une suite à partir de sa règle.'],
    vocab: [['modèle', 'Règle qui produit une suite.'], ['suite', 'Liste ordonnée de nombres.'], ['terme', 'Élément de la suite.']],
    q: 'Quelle est la règle de la suite 3, 6, 12, 24 ?',
    options: ['Multiplier par 2', 'Ajouter 3', 'Ajouter 6', 'Multiplier par 3'],
    answer: 'Multiplier par 2',
    why: '3 × 2 = 6, 6 × 2 = 12, 12 × 2 = 24 : la règle est bien « multiplier par 2 ».',
    exampleFr: '3 → 6 → 12 → 24 : chaque terme est le double du précédent.',
    exampleEn: '3 → 6 → 12 → 24: each term is double the one before.',
    exampleAr: '٣ ← ٦ ← ١٢ ← ٢٤: كل حد ضعف الحد السابق.',

    q2: 'Dans la suite 3, 6, 12, 24, quel est le terme suivant ?',
    options2: ['48', '36', '30', '27'],
    answer2: '48',  },
  // ---------------------------------------------------------------- Unité 1 (1-5)
  {
    u: 1, n: 1, page: 3, pages: '3–6',
    fr: 'Les nombres décimaux jusqu’aux millièmes', en: 'Decimals to the thousandths', ar: 'الكسور العشرية حتى الجزء من ألف',
    focus: 'Un nombre décimal s’écrit avec une virgule qui sépare la partie entière de la partie décimale. À droite de la virgule, chaque rang vaut dix fois moins que celui à sa gauche : les dixièmes, puis les centièmes, puis les millièmes. Dans 4,375 le 3 vaut 3 dixièmes, le 7 vaut 7 centièmes et le 5 vaut 5 millièmes. Un zéro écrit à la fin d’un nombre décimal ne change pas sa valeur : 4,30 = 4,3.',
    objectives: ['Nommer les rangs décimaux jusqu’aux millièmes.', 'Donner la valeur de chaque chiffre d’un nombre décimal.', 'Reconnaître que des zéros finals ne changent pas la valeur.'],
    vocab: [['dixième', 'Une part sur dix (0,1).'], ['centième', 'Une part sur cent (0,01).'], ['millième', 'Une part sur mille (0,001).']],
    q: 'Dans 4,375, que vaut le chiffre 7 ?',
    options: ['7 centièmes', '7 dixièmes', '7 millièmes', '7 unités'],
    answer: '7 centièmes',
    why: 'Après la virgule on lit dixièmes puis centièmes : le 3 est dixième, le 7 est centième, le 5 est millième.',
    exampleFr: '4,375 = 4 unités + 3 dixièmes + 7 centièmes + 5 millièmes.',
    exampleEn: '4.375 = 4 units + 3 tenths + 7 hundredths + 5 thousandths.',
    exampleAr: '٤٫٣٧٥ = ٤ وحدات + ٣ أعشار + ٧ أجزاء من مئة + ٥ أجزاء من ألف.',

    q2: 'Dans 4,375, quelle est la valeur du chiffre 3 ?',
    options2: ['3 dixièmes', '3 centièmes', '3 millièmes', '3 unités'],
    answer2: '3 dixièmes',  },
  {
    u: 1, n: 2, page: 7, pages: '7–10',
    fr: 'Changement de la valeur de position', en: 'How place value changes', ar: 'تغير القيمة المكانية',
    focus: 'Quand on multiplie un nombre par 10, chaque chiffre se décale d’un rang vers la gauche et sa valeur devient dix fois plus grande. Quand on divise par 10, chaque chiffre se décale d’un rang vers la droite et sa valeur devient dix fois plus petite. Ainsi 3,25 × 10 = 32,5 et 3,25 ÷ 10 = 0,325 : les chiffres sont les mêmes, seule la virgule a bougé.',
    objectives: ['Multiplier et diviser un nombre décimal par 10.', 'Expliquer le décalage des rangs.', 'Prévoir la position de la virgule sans calculer.'],
    vocab: [['décaler', 'Changer un chiffre de rang.'], ['rang', 'Position d’un chiffre dans le nombre.']],
    q: 'Que vaut 3,25 × 10 ?',
    options: ['32,5', '3,250', '0,325', '325'],
    answer: '32,5',
    why: 'Multiplier par 10 décale chaque chiffre d’un rang vers la gauche : 3,25 devient 32,5.',
    exampleFr: '3,25 × 10 = 32,5 et 3,25 ÷ 10 = 0,325.',
    exampleEn: '3.25 × 10 = 32.5 and 3.25 ÷ 10 = 0.325.',
    exampleAr: '٣٫٢٥ × ١٠ = ٣٢٫٥ ، ٣٫٢٥ ÷ ١٠ = ٠٫٣٢٥.',
  },
  {
    u: 1, n: 3, page: 11, pages: '11–14',
    fr: 'Composer et décomposer des nombres décimaux', en: 'Composing and decomposing decimals', ar: 'تكوين وتحليل الأعداد العشرية',
    focus: 'Décomposer un nombre décimal, c’est l’écrire comme la somme de ses rangs : 7,408 = 7 + 0,4 + 0,008. On peut aussi l’écrire en fractions décimales : 7 + 4/10 + 8/1000. Composer, c’est l’opération inverse : réunir les parties pour retrouver le nombre. Cette écriture aide à comparer et à calculer.',
    objectives: ['Décomposer un décimal en somme de rangs.', 'Écrire un décimal en fractions décimales.', 'Recomposer un nombre à partir de ses parties.'],
    vocab: [['décomposer', 'Écrire un nombre comme somme de ses rangs.'], ['composer', 'Réunir des parties pour former un nombre.']],
    q: 'Quelle est la décomposition de 7,408 ?',
    options: ['7 + 0,4 + 0,008', '7 + 4 + 8', '7 + 0,04 + 0,008', '70 + 4 + 8'],
    answer: '7 + 0,4 + 0,008',
    why: 'Le 4 est le chiffre des dixièmes (0,4) et le 8 celui des millièmes (0,008) ; le rang des centièmes vaut 0.',
    exampleFr: '7,408 = 7 + 0,4 + 0,008 = 7 + 4/10 + 8/1000.',
    exampleEn: '7.408 = 7 + 0.4 + 0.008 = 7 + 4/10 + 8/1000.',
    exampleAr: '٧٫٤٠٨ = ٧ + ٠٫٤ + ٠٫٠٠٨.',

    q2: 'Quelle est la partie décimale du nombre 7,089 ?',
    options2: ['089', '7', '0,089', '789'],
    answer2: '0,089',  },
  {
    u: 1, n: 4, page: 15, pages: '15–16',
    fr: 'Comparer des nombres décimaux', en: 'Comparing decimals', ar: 'مقارنة الأعداد العشرية',
    focus: 'Pour comparer deux nombres décimaux, on compare d’abord les parties entières. Si elles sont égales, on compare chiffre par chiffre après la virgule, en commençant par les dixièmes. Le nombre qui a le plus de chiffres n’est pas forcément le plus grand : 0,9 > 0,85 parce que 9 dixièmes dépassent 8 dixièmes et 5 centièmes.',
    objectives: ['Comparer deux décimaux rang par rang.', 'Utiliser <, > et =.', 'Éviter l’erreur « plus long donc plus grand ».'],
    vocab: [['comparer', 'Dire lequel de deux nombres est le plus grand.'], ['ranger', 'Placer dans l’ordre croissant ou décroissant.']],
    q: 'Quel est le plus grand nombre ?',
    options: ['0,9', '0,85', '0,809', '0,099'],
    answer: '0,9',
    why: 'On compare d’abord les dixièmes : 9 dixièmes dépassent les 8, 8 et 0 dixièmes des autres nombres.',
    exampleFr: '0,9 > 0,85 > 0,809 > 0,099.',
    exampleEn: '0.9 > 0.85 > 0.809 > 0.099.',
    exampleAr: '٠٫٩ > ٠٫٨٥ > ٠٫٨٠٩ > ٠٫٠٩٩.',

    q2: 'Quelle est la partie entière du nombre 26,14 ?',
    options2: ['26', '14', '0,14', '2614'],
    answer2: '26',  },
  {
    u: 1, n: 5, page: 17, pages: '17–19',
    fr: 'Arrondir les décimaux', en: 'Rounding decimals', ar: 'تقريب الأعداد العشرية',
    focus: 'Arrondir, c’est remplacer un nombre par une valeur proche et plus simple. Pour arrondir à l’unité, on regarde le chiffre des dixièmes : s’il vaut 5 ou plus, on arrondit vers le haut ; s’il vaut moins de 5, on garde la partie entière. 6,4 s’arrondit à 6 et 6,5 s’arrondit à 7.',
    objectives: ['Arrondir un décimal à l’unité.', 'Arrondir au dixième.', 'Justifier le choix avec le chiffre suivant.'],
    vocab: [['arrondir', 'Donner une valeur proche et plus simple.'], ['tronquer', 'Couper les chiffres sans arrondir.']],
    q: 'Quel est l’arrondi de 6,47 à l’unité ?',
    options: ['6', '7', '6,5', '6,4'],
    answer: '6',
    why: 'Le chiffre des dixièmes est 4, donc inférieur à 5 : on garde la partie entière, 6.',
    exampleFr: '6,47 ≈ 6 et 6,5 ≈ 7 à l’unité près.',
    exampleEn: '6.47 ≈ 6 and 6.5 ≈ 7 to the nearest whole number.',
    exampleAr: '٦٫٤٧ ≈ ٦ ، ٦٫٥ ≈ ٧.',

    q2: 'Comment lit-on le nombre 0,006 ?',
    options2: ['six millièmes', 'six centièmes', 'six dixièmes', 'six unités'],
    answer2: 'six millièmes',  },
  // ---------------------------------------------------------------- Unité 2 (1,4,5,7)
  {
    u: 2, n: 1, page: 44, pages: '44–46',
    fr: 'Expressions, équations et variables', en: 'Expressions, equations and variables', ar: 'المعادلات والمتغيرات والتعبيرات الرياضية',
    focus: 'Une expression numérique combine des nombres et des opérations, par exemple 3 + 4 × 2. Une variable est une lettre qui représente un nombre inconnu, par exemple x. Une équation dit que deux expressions ont la même valeur, par exemple x + 5 = 12. Résoudre l’équation, c’est trouver la valeur de la variable qui rend l’égalité vraie : ici x = 7.',
    objectives: ['Distinguer expression, variable et équation.', 'Traduire une phrase en expression.', 'Trouver la valeur d’une variable dans une équation simple.'],
    vocab: [['expression', 'Combinaison de nombres et d’opérations.'], ['variable', 'Lettre qui représente un nombre inconnu.'], ['équation', 'Égalité entre deux expressions.']],
    q: 'Dans x + 5 = 12, que vaut x ?',
    options: ['7', '5', '12', '17'],
    answer: '7',
    why: 'Il faut trouver le nombre qui, ajouté à 5, donne 12 : c’est 7, car 7 + 5 = 12.',
    exampleFr: 'Si x + 5 = 12, alors x = 12 − 5 = 7.',
    exampleEn: 'If x + 5 = 12, then x = 12 − 5 = 7.',
    exampleAr: 'إذا كان س + ٥ = ١٢ فإن س = ٧.',
  },
  {
    u: 2, n: 4, page: 51, pages: '51–53',
    fr: 'Décomposer en facteurs premiers', en: 'Prime factorisation', ar: 'التحليل إلى العوامل الأولية',
    focus: 'Un nombre premier n’a que deux diviseurs : 1 et lui-même (2, 3, 5, 7, 11…). Décomposer un nombre en facteurs premiers, c’est l’écrire comme un produit de nombres premiers. On utilise un arbre de facteurs : 36 se coupe en 6 × 6, puis 2 × 3 et 2 × 3, donc 36 = 2 × 2 × 3 × 3 = 2² × 3².',
    objectives: ['Reconnaître un nombre premier.', 'Construire un arbre de facteurs.', 'Écrire la décomposition avec des exposants.'],
    vocab: [['premier', 'Nombre qui n’a que deux diviseurs : 1 et lui-même.'], ['facteur', 'Nombre qui en multiplie un autre.']],
    q: 'Quelle est la décomposition en facteurs premiers de 36 ?',
    options: ['2 × 2 × 3 × 3', '4 × 9', '2 × 18', '6 × 6'],
    answer: '2 × 2 × 3 × 3',
    why: '4 et 9, 2 et 18, 6 et 6 ne sont pas tous premiers : seule 2 × 2 × 3 × 3 ne contient que des nombres premiers.',
    exampleFr: '36 = 2 × 2 × 3 × 3 = 2² × 3².',
    exampleEn: '36 = 2 × 2 × 3 × 3 = 2² × 3².',
    exampleAr: '٣٦ = ٢ × ٢ × ٣ × ٣.',

    q2: 'Dans 3 × 8 = 24, comment appelle-t-on 24 par rapport à 8 ?',
    options2: ['Un multiple de 8', 'Un facteur de 8', 'Un diviseur de 8', 'Un reste'],
    answer2: 'Un multiple de 8',  },
  {
    u: 2, n: 5, page: 54, pages: '54–55',
    fr: 'Le grand facteur commun (P.G.C.D.)', en: 'The greatest common factor (G.C.F.)', ar: 'العامل المشترك الأكبر',
    focus: 'Le plus grand facteur commun de deux nombres est le plus grand nombre qui divise les deux. Pour 12 et 18, les diviseurs communs sont 1, 2, 3 et 6, donc le P.G.C.D. est 6. On le trouve aussi avec les décompositions en facteurs premiers : on prend les facteurs communs avec le plus petit exposant.',
    objectives: ['Lister les diviseurs de deux nombres.', 'Trouver le P.G.C.D.', 'Utiliser le P.G.C.D. pour simplifier une fraction.'],
    vocab: [['diviseur', 'Nombre qui divise un autre sans reste.'], ['P.G.C.D.', 'Plus grand commun diviseur.']],
    q: 'Quel est le P.G.C.D. de 12 et 18 ?',
    options: ['6', '3', '2', '36'],
    answer: '6',
    why: 'Les diviseurs communs de 12 et 18 sont 1, 2, 3 et 6 ; le plus grand est 6.',
    exampleFr: '12 = 2² × 3 et 18 = 2 × 3², donc P.G.C.D.(12, 18) = 2 × 3 = 6.',
    exampleEn: '12 = 2² × 3 and 18 = 2 × 3², so G.C.F.(12, 18) = 2 × 3 = 6.',
    exampleAr: '١٢ = ٢² × ٣ و ١٨ = ٢ × ٣²، إذاً ع.م.أ = ٦.',
  },
  {
    u: 2, n: 7, page: 59, pages: '59–61',
    fr: 'Plus petit commun multiple (P.P.C.M.)', en: 'The least common multiple (L.C.M.)', ar: 'المضاعف المشترك الأصغر',
    focus: 'Le plus petit commun multiple de deux nombres est le plus petit nombre qui est à la fois multiple des deux. Pour 4 et 6, les multiples de 4 sont 4, 8, 12, 16… et ceux de 6 sont 6, 12, 18… : le P.P.C.M. est 12. Avec les facteurs premiers, on prend tous les facteurs avec le plus grand exposant.',
    objectives: ['Lister les multiples de deux nombres.', 'Trouver le P.P.C.M.', 'Distinguer P.G.C.D. et P.P.C.M.'],
    vocab: [['multiple', 'Résultat de la multiplication par un entier.'], ['P.P.C.M.', 'Plus petit commun multiple.']],
    q: 'Quel est le P.P.C.M. de 4 et 6 ?',
    options: ['12', '24', '2', '10'],
    answer: '12',
    why: '12 est le plus petit nombre qui soit à la fois multiple de 4 (4 × 3) et de 6 (6 × 2).',
    exampleFr: '4 = 2² et 6 = 2 × 3, donc P.P.C.M.(4, 6) = 2² × 3 = 12.',
    exampleEn: '4 = 2² and 6 = 2 × 3, so L.C.M.(4, 6) = 2² × 3 = 12.',
    exampleAr: '٤ = ٢² و ٦ = ٢ × ٣، إذاً م.م.أ = ١٢.',

    q2: 'Quel est le plus petit commun multiple (PPCM) de 10 et 15 ?',
    options2: ['30', '25', '60', '5'],
    answer2: '30',  },
  // ---------------------------------------------------------------- Unité 3 (1,3)
  {
    u: 3, n: 1, page: 65, pages: '65–67',
    fr: 'Utiliser le modèle de l’aire du rectangle pour multiplier', en: 'Using the rectangle area model to multiply', ar: 'استخدام نموذج مساحة المستطيل في الضرب',
    focus: 'Un rectangle de longueur 23 et de largeur 14 a une aire de 23 × 14. On le découpe en quatre rectangles plus petits : 20 × 10, 20 × 4, 3 × 10 et 3 × 4. La somme des quatre aires donne le produit : 200 + 80 + 30 + 12 = 322. Ce modèle montre pourquoi l’algorithme écrit fonctionne.',
    objectives: ['Découper un rectangle selon les dizaines et les unités.', 'Additionner les aires partielles.', 'Relier le modèle à l’algorithme écrit.'],
    vocab: [['aire', 'Surface d’une figure.'], ['partiel', 'Morceau du produit total.']],
    q: 'Avec le modèle d’aire, quelles sont les quatre aires partielles de 23 × 14 ?',
    options: ['200, 80, 30 et 12', '20, 30, 4 et 10', '230 et 14', '200 et 42'],
    answer: '200, 80, 30 et 12',
    why: 'On découpe 23 en 20 + 3 et 14 en 10 + 4 : 20 × 10, 20 × 4, 3 × 10 et 3 × 4.',
    exampleFr: '23 × 14 = 200 + 80 + 30 + 12 = 322.',
    exampleEn: '23 × 14 = 200 + 80 + 30 + 12 = 322.',
    exampleAr: '٢٣ × ١٤ = ٢٠٠ + ٨٠ + ٣٠ + ١٢ = ٣٢٢.',

    q2: 'Avec le modèle de l’aire pour 201 × 32, quel est le produit de 1 × 32 ?',
    options2: ['32', '6 000', '3 200', '64'],
    answer2: '32',  },
  {
    u: 3, n: 3, page: 72, pages: '72–74',
    fr: 'Multiplier des nombres à deux chiffres avec l’algorithme standard', en: 'Multiplying two-digit numbers with the standard algorithm', ar: 'خوارزمية الضرب المعيارية',
    focus: 'Pour multiplier 34 par 26 avec l’algorithme standard, on multiplie d’abord par les unités (34 × 6 = 204), puis par les dizaines (34 × 2 dizaines = 680, écrit un rang plus à gauche), et on additionne : 204 + 680 = 884. Il ne faut pas oublier le décalage quand on multiplie par les dizaines.',
    objectives: ['Poser une multiplication à deux chiffres.', 'Décaler correctement le produit des dizaines.', 'Additionner les produits partiels.'],
    vocab: [['algorithme', 'Suite d’étapes qui donne toujours le résultat.'], ['produit partiel', 'Résultat intermédiaire de la multiplication.']],
    q: 'Dans 34 × 26, quel est le produit partiel des dizaines ?',
    options: ['680', '68', '204', '884'],
    answer: '680',
    why: '34 × 2 dizaines = 34 × 20 = 680, que l’on écrit décalé d’un rang vers la gauche.',
    exampleFr: '34 × 26 = 204 + 680 = 884.',
    exampleEn: '34 × 26 = 204 + 680 = 884.',
    exampleAr: '٣٤ × ٢٦ = ٢٠٤ + ٦٨٠ = ٨٨٤.',

    q2: 'Dans 34 × 26, quel est le produit partiel des unités ?',
    options2: ['204', '680', '884', '60'],
    answer2: '204',  },
  // ---------------------------------------------------------------- Unité 5 (1)
  {
    u: 5, n: 1, page: 92, pages: '92–94',
    fr: 'Multiplication par des puissances de dix', en: 'Multiplying by powers of ten', ar: 'ضرب الأعداد العشرية في قوى العدد ١٠',
    focus: 'Multiplier par 10, 100 ou 1000 décale la virgule d’un, deux ou trois rangs vers la droite. 4,25 × 100 = 425 : la virgule avance de deux rangs. Si les chiffres manquent, on ajoute des zéros : 4,5 × 100 = 450. La valeur de chaque chiffre devient 100 fois plus grande.',
    objectives: ['Multiplier un décimal par 10, 100, 1000.', 'Décaler la virgule du bon nombre de rangs.', 'Ajouter des zéros quand c’est nécessaire.'],
    vocab: [['puissance de dix', '10, 100, 1000…'], ['décaler', 'Déplacer la virgule.']],
    q: 'Que vaut 4,25 × 100 ?',
    options: ['425', '42,5', '0,425', '4250'],
    answer: '425',
    why: 'Multiplier par 100 décale la virgule de deux rangs vers la droite : 4,25 devient 425.',
    exampleFr: '4,25 × 100 = 425 et 4,5 × 100 = 450.',
    exampleEn: '4.25 × 100 = 425 and 4.5 × 100 = 450.',
    exampleAr: '٤٫٢٥ × ١٠٠ = ٤٢٥.',
  },
  // ---------------------------------------------------------------- Unité 6 (1)
  {
    u: 6, n: 1, page: 121, pages: '121–122',
    fr: 'Expressions numériques', en: 'Numerical expressions', ar: 'التعابير العددية',
    focus: 'Une expression numérique contient des nombres et des opérations, sans signe égal. Pour la calculer, on respecte l’ordre des opérations : d’abord les parenthèses, puis les multiplications et divisions, enfin les additions et soustractions, de gauche à droite. Dans 3 + 4 × 2, on calcule 4 × 2 = 8 puis 3 + 8 = 11, et non 7 × 2.',
    objectives: ['Lire une expression numérique.', 'Appliquer l’ordre des opérations.', 'Calculer une expression sans parenthèses.'],
    vocab: [['expression numérique', 'Nombres et opérations sans signe égal.'], ['ordre des opérations', 'Règles qui fixent l’ordre des calculs.']],
    q: 'Que vaut 3 + 4 × 2 ?',
    options: ['11', '14', '9', '24'],
    answer: '11',
    why: 'La multiplication passe avant l’addition : 4 × 2 = 8, puis 3 + 8 = 11.',
    exampleFr: '3 + 4 × 2 = 3 + 8 = 11.',
    exampleEn: '3 + 4 × 2 = 3 + 8 = 11.',
    exampleAr: '٣ + ٤ × ٢ = ٣ + ٨ = ١١.',

    q2: 'Dans 3 + 4 × 2, que calcule-t-on en premier ?',
    options2: ['4 × 2', '3 + 4', '3 × 2', '4 + 2'],
    answer2: '4 × 2',  },
];

/**
 * A lesson's worked example usually states an equation such as "3,50 + 1,25 =
 * 4,75". Where that equation is arithmetically sound, asking the child to
 * reproduce it is a second, independent check of the same lesson. The equation
 * is only used when the stated result really follows from the operands, so a
 * typo in an example can never become a wrong answer key. Lessons whose example
 * carries no verifiable equation get no second exercise rather than a made-up
 * one.
 */
/**
 * The lesson's second exercise. Preference order is fixed and honest:
 *
 *  1. a declared `q2`, written by hand from the lesson's own worked example;
 *  2. an equation taken from the worked example, but only when the stated result
 *     really follows from the operands, so a typo can never become a wrong key.
 *
 * A lesson with neither keeps one exercise rather than gaining an invented one.
 */
function secondExercise(spec: Spec): CurriculumExercise | null {
  if (spec.q2 && spec.options2 && spec.answer2) {
    return {
      type: 'multiple_choice',
      question: spec.q2,
      options: spec.options2,
      expectedAnswer: spec.answer2,
      page: spec.page,
    };
  }
  return workedExampleExercise(spec);
}

function workedExampleExercise(spec: Spec): CurriculumExercise | null {
  const text = spec.exampleFr.replace(/\s+/g, ' ');
  const match = text.match(/(\d+(?:[.,]\d+)?)\s*([+\-\u2212\u00d7x*\u00f7/])\s*(\d+(?:[.,]\d+)?)\s*=\s*(\d+(?:[.,]\d+)?)/);
  if (!match) return null;

  const value = (raw: string) => Number(raw.replace(',', '.'));
  const [left, op, right, stated] = [value(match[1]), match[2], value(match[3]), value(match[4])];
  if (![left, right, stated].every(Number.isFinite)) return null;

  let actual: number;
  if (op === '+') actual = left + right;
  else if (op === '-' || op === '\u2212') actual = left - right;
  else if (op === '\u00d7' || op === 'x' || op === '*') actual = left * right;
  else actual = right === 0 ? NaN : left / right;
  if (!Number.isFinite(actual) || Math.abs(actual - stated) > 1e-9) return null;

  const decimal = (n: number) => String(n).replace('.', ',');
  const distractors = [left + right, left * right, left - right, right === 0 ? left : left / right]
    .filter((n) => Number.isFinite(n) && Math.abs(n - stated) > 1e-9)
    .map(decimal);
  const options = [...new Set([decimal(stated), ...distractors])].slice(0, 4);
  if (options.length < 3) return null;

  return {
    type: 'multiple_choice',
    question: `Combien vaut ${match[1]} ${op} ${match[3]} ?`,
    options,
    expectedAnswer: decimal(stated),
    page: spec.page,
  };
}

function toLesson(spec: Spec): OfficialCurriculumLesson {
  const unit = UNIT_TITLES[spec.u];
  const id = `off_mathfr_2026_u${spec.u}_l${spec.n}`;
  return {
    id,
    subjectId: 'subj_math',
    subjectNameAr: 'الرياضيات',
    subjectNameEn: 'Mathematics',
    subjectNameFr: 'Mathématiques',
    unitNumber: spec.u,
    unitNameAr: unit.ar,
    unitNameEn: unit.en,
    unitNameFr: unit.fr,
    lessonNumber: spec.n,
    titleAr: spec.ar,
    titleEn: spec.en,
    titleFr: spec.fr,
    originTag: 'official',
    language: 'fr',
    curriculumSource: 'egyptian_national',
    instructionLanguage: 'fr',
    contentLanguage: 'fr',
    assessmentLanguage: 'fr',
    track: 'french_bilingual',
    isAvailable: true,
    contentStatus: 'available',
    sourceRef: {
      book: 'Mathématiques — livre de l’élève — 5e primaire — semestre 1',
      bookAr: 'كتاب الرياضيات بالفرنسية — الصف الخامس الابتدائي — الفصل الدراسي الأول',
      bookEn: 'Mathematics — student book — Grade 5 — Term 1',
      grade: 'Grade 5',
      term: 'Term 1 — 2026–2027',
      unit: `Unité ${spec.u}`,
      lesson: `Leçon ${spec.n}`,
      page: spec.page,
      pageRange: spec.pages,
      notes:
        'Lesson title, unit and start page read from the printed "Table des matières" of the Ministry student book (Math_FR_prim5_TR1.pdf, 141 pages, SHA-256 baea709a…d5ace). The explanation, examples, exercises and answer key are Miss Noor-authored teaching material, not Ministry text.',
      isAvailable: true,
    },
    objectives: spec.objectives,
    readingText: spec.focus,
    vocabulary: spec.vocab.map(([word, definition]) => ({ word, definition })),
    exercises: [
      {
        type: 'multiple_choice',
        question: spec.q,
        options: spec.options,
        expectedAnswer: spec.answer,
        page: spec.page,
      },
      ...(secondExercise(spec) ? [secondExercise(spec)!] : []),
    ],
    exercisesByLanguage: {
      fr: [
        {
          type: 'multiple_choice',
          question: spec.q,
          options: spec.options,
          expectedAnswer: spec.answer,
          page: spec.page,
        },
        ...(secondExercise(spec) ? [secondExercise(spec)!] : []),
      ],
    },
    concepts: [
      {
        id: `conc_mathfr_2026_u${spec.u}_l${spec.n}`,
        conceptNumber: 1,
        titleAr: spec.ar,
        titleEn: spec.en,
        titleFr: spec.fr,
        sourceText: spec.focus,
        sourceTextFr: spec.focus,
        keyPoints: spec.objectives,
        keyPointsFr: spec.objectives,
        dailyLifeExampleAr: spec.exampleAr,
        dailyLifeExampleEn: spec.exampleEn,
        dailyLifeExampleFr: spec.exampleFr,
        storyAnalogyAr: spec.exampleAr,
        storyAnalogyEn: spec.exampleEn,
        storyAnalogyFr: spec.exampleFr,
        prerequisiteAr: 'المفاهيم السابقة في الوحدة نفسها.',
        prerequisiteEn: 'The earlier lessons of the same unit.',
        prerequisiteFr: 'Les leçons précédentes de la même unité.',
      },
    ],
  };
}

export const MATH_FR_CURRICULUM_2026_LESSONS: OfficialCurriculumLesson[] = S.map(toLesson);
