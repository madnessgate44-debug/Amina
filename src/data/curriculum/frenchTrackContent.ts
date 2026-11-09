/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * French rendering for concepts the Girard French-section child is taught in
 * French (maths, science, French language).
 *
 * The curriculum type carries Arabic and English strings per concept, and the
 * reel engine mapped `fr` onto the English field, so a French child read English
 * lessons. This overlay supplies the French strings the concepts were missing.
 * It is merged into the lesson registry by CurriculumService, so every reader
 * (feed reels, teaching session, study modal) sees French without each call site
 * knowing about it.
 */

export interface ConceptFrenchContent {
  titleFr: string;
  sourceTextFr: string;
  dailyLifeExampleFr: string;
  storyAnalogyFr: string;
}

export const FRENCH_TRACK_CONTENT: Record<string, ConceptFrenchContent> = {
  // --- Mathématiques (Ministry book, taught in French) ---
  off_math_u1_l1_c1: {
    titleFr: 'Les nombres décimaux jusqu\'aux millièmes',
    sourceTextFr: 'Le rang d\'un chiffre après la virgule fixe sa valeur : dixièmes, centièmes, millièmes.',
    dailyLifeExampleFr: 'Sur une balance électronique qui affiche 1,525 kg, le dernier 5 représente 5 grammes (des millièmes de kilogramme).',
    storyAnalogyFr: 'Imagine couper un gâteau en 1 000 miettes égales : chaque miette est un millième !',
  },
  off_math_u1_l2_c1: {
    titleFr: 'Décalage de la valeur de position par 10',
    sourceTextFr: 'Multiplier par 10 décale chaque chiffre d\'un rang vers la gauche : les unités deviennent des dizaines.',
    dailyLifeExampleFr: '5 livres multipliées par 10 donnent 50 livres (les unités deviennent des dizaines).',
    storyAnalogyFr: 'Comme avancer d\'une gare sur un train express quand on multiplie par 10.',
  },
  off_math_u1_l3_c1: {
    titleFr: 'Forme développée des nombres décimaux',
    sourceTextFr: 'Décomposer un décimal, c\'est l\'écrire comme la somme de ses rangs : 15,75 = 10 + 5 + 0,70 + 0,05.',
    dailyLifeExampleFr: '15,75 livres, c\'est 10 + 5 + 0,70 + 0,05 livres.',
    storyAnalogyFr: 'Comme démonter des briques de Lego en pièces séparées puis les reclipser ensemble.',
  },
  off_math_u1_l4_c1: {
    titleFr: 'Comparer les décimaux en complétant par des zéros',
    sourceTextFr: 'On compare d\'abord les parties entières ; si elles sont égales, on complète par des zéros pour comparer les décimales.',
    dailyLifeExampleFr: 'On compare des températures : 36,5° est plus chaud que 35,6° car 36 > 35.',
    storyAnalogyFr: 'Comme des coureurs : celui qui a la plus grande première enjambée mène dès le départ.',
  },
  off_math_u1_l5_c1: {
    titleFr: 'Règles de l\'arrondi des décimaux',
    sourceTextFr: 'Pour arrondir, on regarde le chiffre juste après le rang voulu : 5 ou plus, on arrondit au-dessus.',
    dailyLifeExampleFr: 'Payer 50 livres pour une note de 49,90 livres arrondie à l\'entier.',
    storyAnalogyFr: 'Comme gravir une colline : si tu atteins le sommet (5), tu passes de l\'autre côté vers le nombre suivant.',
  },
  off_math_u2_l1_c1: {
    titleFr: 'Équations, expressions et variables',
    sourceTextFr: 'Une expression décrit un calcul ; une équation affirme que deux quantités sont égales.',
    dailyLifeExampleFr: 'On part de 10 livres et il en reste 4 : 10 − x = 4, donc le prix du stylo x = 6 livres.',
    storyAnalogyFr: 'Une équation est comme une balance équilibrée : les deux plateaux doivent rester égaux.',
  },
  off_math_u2_l4_c1: {
    titleFr: 'Arbre des facteurs premiers',
    sourceTextFr: 'Tout nombre composé se décompose en un produit de facteurs premiers.',
    dailyLifeExampleFr: 'Comme décomposer un gâteau en ses ingrédients purs : farine, sucre et lait.',
    storyAnalogyFr: 'Les nombres premiers sont comme les atomes en chimie : les briques de tous les nombres composés.',
  },
  off_math_u2_l5_c1: {
    titleFr: 'Trouver le plus grand commun diviseur',
    sourceTextFr: 'Le PGCD est le plus grand nombre qui divise deux nombres à la fois.',
    dailyLifeExampleFr: 'Répartir 30 et 48 desserts dans le plus grand nombre de boîtes cadeaux : le PGCD est 6.',
    storyAnalogyFr: 'Comme trouver la plus grande clé passe-partout qui ouvre deux portes différentes.',
  },
  off_math_u2_l7_c1: {
    titleFr: 'Applications du plus petit commun multiple',
    sourceTextFr: 'Le PPCM est le plus petit nombre commun à deux listes de multiples.',
    dailyLifeExampleFr: 'Deux bus partant toutes les 10 et 15 minutes repartiront ensemble toutes les 30 minutes.',
    storyAnalogyFr: 'Deux amis qui sautent : l\'un de 2 en 2, l\'autre de 3 en 3 ; leurs traces se rejoignent au pas 6.',
  },
  off_math_u3_l1_c1: {
    titleFr: 'Modèle de l\'aire du rectangle pour la multiplication',
    sourceTextFr: 'On peut décomposer un grand rectangle en rectangles plus petits pour multiplier plus facilement.',
    dailyLifeExampleFr: 'Calculer la surface totale de carrelage de deux pièces voisines.',
    storyAnalogyFr: 'Comme assembler des pièces de puzzle pour révéler l\'image complète.',
  },
  off_math_u3_l3_c1: {
    titleFr: 'Étapes de la multiplication posée en colonnes',
    sourceTextFr: 'On multiplie par les unités, puis par les dizaines, et on additionne les produits partiels.',
    dailyLifeExampleFr: 'Acheter 24 livres à 76 livres chacun : 76 × 24 = 1 824 livres.',
    storyAnalogyFr: 'Comme construire une tour à deux étages : finir l\'étage 1, poser l\'étage 2, puis les relier.',
  },
  off_math_u6_l1_c1: {
    titleFr: 'Règles de priorité des opérations',
    sourceTextFr: 'On calcule d\'abord les parenthèses, puis les multiplications et divisions, enfin les additions et soustractions.',
    dailyLifeExampleFr: 'Acheter 3 repas à 50 avec une remise de 10 : 3 × 50 − 10 = 140.',
    storyAnalogyFr: 'Comme des feux de circulation qui donnent la priorité aux véhicules prioritaires.',
  },

  // --- Sciences (Ministry book, taught in French) ---
  off_sci_u1_l1_c1: {
    titleFr: 'L\'usine alimentaire de la plante verte',
    sourceTextFr: 'La plante fabrique sa nourriture grâce à la lumière, à l\'eau et au dioxyde de carbone.',
    dailyLifeExampleFr: 'Placer une plante en pot sur un balcon ensoleillé et voir ses feuilles devenir bien vertes.',
    storyAnalogyFr: 'Une feuille est comme une cuisine : la lumière est le four, l\'eau et le CO₂ sont les ingrédients.',
  },
  off_sci_u1_l2_c1: {
    titleFr: 'Le cycle de l\'énergie solaire dans la nature',
    sourceTextFr: 'L\'énergie du soleil passe des plantes aux herbivores puis aux carnivores.',
    dailyLifeExampleFr: 'L\'herbe du jardin est mangée par un escargot, mangé par un moineau, qui rend ses nutriments au sol.',
    storyAnalogyFr: 'Comme un relais où l\'énergie est le témoin passé du soleil aux plantes, aux animaux et à la terre.',
  },
  off_sci_u1_l3_c1: {
    titleFr: 'La biodiversité marine et sa protection en Égypte',
    sourceTextFr: 'Les récifs coralliens abritent une vie marine immense et fragile.',
    dailyLifeExampleFr: 'Utiliser des sacs en tissu et des gourdes inox sur les plages de la mer Rouge au lieu du plastique.',
    storyAnalogyFr: 'Les récifs coralliens sont comme des immeubles pour la vie marine : détruits, des millions d\'êtres perdent leur maison.',
  },

  // --- Français (French language lesson) ---
  conc_fr_u1_l1_salutations: {
    titleFr: 'Les salutations et les formules d\'adieu',
    sourceTextFr: 'Bonjour le matin, Bonsoir le soir, Bonne nuit avant de dormir, Au revoir en partant.',
    dailyLifeExampleFr: 'Quand Sara rencontre ses amis le matin elle dit « Bonjour ! » et en partant « Au revoir ! ».',
    storyAnalogyFr: 'Les salutations sont comme des clés magiques : chaque moment de la journée a sa clé.',
  },
  conc_fr_u1_l1_presentation: {
    titleFr: 'Le verbe s\'appeler et se présenter',
    sourceTextFr: 'On se présente avec « Je m\'appelle… » et on demande « Comment tu t\'appelles ? ».',
    dailyLifeExampleFr: 'Je m\'appelle Sara. Tu t\'appelles Omar.',
    storyAnalogyFr: '« Je m\'appelle » c\'est comme présenter ta carte d\'élève colorée.',
  },
  conc_fr_u1_l2_possessifs: {
    titleFr: 'Les adjectifs possessifs (Mon / Ma / Mes)',
    sourceTextFr: 'Mon devant un nom masculin, Ma devant un nom féminin, Mes devant un pluriel.',
    dailyLifeExampleFr: 'Mon père, Ma mère, Mes frères.',
    storyAnalogyFr: 'Les adjectifs possessifs sont comme des étiquettes de couleur qui marquent chaque objet.',
  },
  conc_fr_u2_l1_articles_indefinis: {
    titleFr: 'Les articles indéfinis (Un / Une / Des)',
    sourceTextFr: 'Un pour le masculin singulier (Un stylo), Une pour le féminin (Une gomme), Des pour le pluriel.',
    dailyLifeExampleFr: 'Un livre, Une règle, Des crayons.',
    storyAnalogyFr: 'Les articles indéfinis sont comme des chapeaux que portent les mots pour montrer leur genre et leur nombre.',
  },
  conc_fr_u3_l1_gouts: {
    titleFr: 'Exprimer ses goûts scolaires (Aimer / Préférer)',
    sourceTextFr: 'On exprime ses préférences avec « J\'aime… » et « Je préfère… ».',
    dailyLifeExampleFr: 'J\'aime le français et les mathématiques.',
    storyAnalogyFr: 'Comme coller des étoiles à côté de tes matières préférées.',
  },

  // --- Mathématiques (French-section extract) ---
  conc_mathfr_u1_l1_position: {
    titleFr: 'Tableau de la valeur de position des décimaux',
    sourceTextFr: 'Chaque rang vers la droite est 10 fois plus petit : unités, dixièmes, centièmes, millièmes.',
    dailyLifeExampleFr: 'Un petit comprimé peut peser 0,025 gramme (25 millièmes de gramme).',
    storyAnalogyFr: 'Imagine partager du pain en 1 000 miettes : chaque miette est un millième.',
  },
  conc_mathfr_u1_l2_comparaison: {
    titleFr: 'Comparer les décimaux en complétant par des zéros',
    sourceTextFr: 'On compare les parties entières, puis on aligne les décimales en ajoutant des zéros.',
    dailyLifeExampleFr: 'Comparer des temps de course mesurés en secondes et centièmes.',
    storyAnalogyFr: 'Comme une course : on regarde d\'abord les mètres entiers, puis les centimètres.',
  },
  conc_mathfr_u2_l1_regle_or: {
    titleFr: 'Règle d\'or des fractions équivalentes',
    sourceTextFr: 'Multiplier ou diviser le numérateur et le dénominateur par le même nombre conserve l\'égalité.',
    dailyLifeExampleFr: 'Une demi-pizza (1/2) c\'est pareil que 2 parts sur 4 (2/4).',
    storyAnalogyFr: 'Comme échanger un billet de 100 livres contre deux billets de 50 : la valeur reste identique.',
  },
  conc_mathfr_u3_l1_puissance10: {
    titleFr: 'Multiplier un décimal par une puissance de 10',
    sourceTextFr: 'Multiplier par 10, 100 ou 1 000 décale la virgule d\'un, deux ou trois rangs vers la droite.',
    dailyLifeExampleFr: 'Si un cahier coûte 3,45 livres, 100 cahiers coûtent 3,45 × 100 = 345 livres.',
    storyAnalogyFr: 'Comme déplacer le curseur d\'une règle : chaque ×10 décale la virgule d\'un pas vers la droite.',
  },
  conc_mathfr_u3_l1_zero_ajoute: {
    titleFr: 'Ajouter des zéros quand les chiffres s\'épuisent',
    sourceTextFr: 'Quand il n\'y a plus de chiffres, on ajoute des zéros à la fin du nombre.',
    dailyLifeExampleFr: 'Un sac de sucre pèse 0,7 kg ; 1 000 sacs pèsent 0,7 × 1 000 = 700 kg.',
    storyAnalogyFr: 'Comme une rangée de sièges : quand elle est pleine, on ajoute de nouveaux sièges (des zéros) à la fin.',
  },

  // --- Sciences (French-section extract) ---
  conc_scifr_u1_l1_photosynthese: {
    titleFr: 'La photosynthèse et les vaisseaux de la plante',
    sourceTextFr: 'La photosynthèse transforme l\'énergie lumineuse en énergie chimique stockée dans le glucose.',
    dailyLifeExampleFr: 'Les plantes de notre balcon absorbent le soleil du matin pour produire de l\'oxygène frais.',
    storyAnalogyFr: 'Les feuilles sont comme des cuisines solaires qui préparent du glucose sucré pour la plante.',
  },
  conc_scifr_u1_l2_chaine: {
    titleFr: 'Le transfert d\'énergie dans les chaînes alimentaires',
    sourceTextFr: 'L\'énergie passe du soleil aux plantes, puis aux animaux herbivores et carnivores.',
    dailyLifeExampleFr: 'L\'herbe est mangée par le lapin, qui est mangé par le renard.',
    storyAnalogyFr: 'Comme passer une torche olympique d\'énergie du soleil aux plantes puis aux animaux.',
  },
  conc_scifr_u2_l1_etats: {
    titleFr: 'Les trois états de la matière',
    sourceTextFr: 'La matière existe sous trois états : solide, liquide et gazeux.',
    dailyLifeExampleFr: 'Un glaçon (solide) fond en eau (liquide), qui devient de la vapeur (gaz) à l\'ébullition.',
    storyAnalogyFr: 'Imagine une classe : assis bien rangés = solide, en mouvement = liquide, courant partout = gaz.',
  },
  conc_scifr_u2_l1_mouvement: {
    titleFr: 'Le mouvement des particules et les changements d\'état',
    sourceTextFr: 'Quand les particules bougent moins, la matière se solidifie ; quand elles bougent plus, elle s\'évapore.',
    dailyLifeExampleFr: 'Au congélateur les particules de l\'eau ralentissent et gèlent ; sur le feu elles accélèrent et s\'évaporent.',
    storyAnalogyFr: 'Comme des élèves serrés quand il fait froid et dispersés quand il fait chaud.',
  },
};
