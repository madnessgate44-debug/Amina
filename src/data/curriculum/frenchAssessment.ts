/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * French-language assessment layer for the Egyptian Grade 5 Maths and Science
 * books used in the French-bilingual track at École Girard.
 *
 * The source lesson files retain their original Ministry exercise wording.
 * This layer supplies equivalent French prompts/options so the assessment
 * language matches the learner's instruction language. Page references are
 * preserved from the source lesson records.
 */
import { CurriculumExercise } from '../../types/teachingSession';

export const FRENCH_ASSESSMENTS: Record<string, CurriculumExercise[]> = {
  // MATHEMATICS — Grade 5, Term 1
  off_math_u1_l1: [
    { type: 'multiple_choice', question: 'Dans le nombre 0,875 kg, quel chiffre occupe le rang des millièmes ?', options: ['5', '7', '8', '0'], expectedAnswer: '5', page: 3 },
    { type: 'multiple_choice', question: 'Quel chiffre représente les dixièmes dans le nombre décimal 1,27 kg ?', options: ['2', '7', '1', '0'], expectedAnswer: '2', page: 3 },
    { type: 'multiple_choice', question: 'Selon les prix indiqués à la page 6, quel carburant est le moins cher ?', options: ['Essence 80 octane : 6,75 LE', 'Essence 92 octane : 8,00 LE', 'Essence 95 octane : 9,00 LE'], expectedAnswer: 'Essence 80 octane : 6,75 LE', page: 6 },
  ],
  off_math_u1_l2: [
    { type: 'multiple_choice', question: 'Quel est le résultat de 6,5 × 10 ?', options: ['65', '0,65', '650', '6,05'], expectedAnswer: '65', page: 9 },
    { type: 'multiple_choice', question: 'Que devient le nombre 345 lorsqu’on le divise par 10 ?', options: ['Il diminue : 34,5', 'Il augmente : 3 450', 'Il reste inchangé', 'Il devient 3,45'], expectedAnswer: 'Il diminue : 34,5', page: 9 },
  ],
  off_math_u1_l3: [
    { type: 'multiple_choice', question: 'Quelle est la décomposition du nombre décimal 34,527 ?', options: ['30 + 4 + 0,5 + 0,02 + 0,007', '3 + 4 + 5 + 2 + 7', '300 + 40 + 5 + 0,27', '34 + 527'], expectedAnswer: '30 + 4 + 0,5 + 0,02 + 0,007', page: 12 },
  ],
  off_math_u1_l4: [
    { type: 'multiple_choice', question: 'Quelle comparaison est correcte entre 10,1 et 10,011 ?', options: ['10,1 > 10,011', '10,1 < 10,011', '10,1 = 10,011', 'On ne peut pas les comparer'], expectedAnswer: '10,1 > 10,011', page: 15 },
    { type: 'multiple_choice', question: 'Quel est le plus petit nombre décimal ?', options: ['20,001', '20,09', '20,1', '20,21'], expectedAnswer: '20,001', page: 16 },
  ],
  off_math_u1_l5: [
    { type: 'multiple_choice', question: 'Quel est l’arrondi de 1,277 au centième près ?', options: ['1,28', '1,27', '1,30', '1,20'], expectedAnswer: '1,28', page: 18 },
    { type: 'multiple_choice', question: 'La superficie du lac Wadi El Rayan est de 50,90 km². Quel est son arrondi à l’unité la plus proche ?', options: ['51 km²', '50 km²', '50,9 km²', '52 km²'], expectedAnswer: '51 km²', page: 17 },
  ],
  off_math_u2_l1: [
    { type: 'multiple_choice', question: 'Comment classer l’égalité « 56 − x = 47,5 » ?', options: ['Une équation', 'Une expression numérique seulement', 'Ce n’est pas une phrase mathématique', 'Un problème sans solution'], expectedAnswer: 'Une équation', page: 46 },
    { type: 'multiple_choice', question: 'Dans l’équation 180 + x = 275, quelle est la valeur de x ?', options: ['95', '85', '455', '100'], expectedAnswer: '95', page: 45 },
  ],
  off_math_u2_l4: [
    { type: 'multiple_choice', question: 'En mathématiques, le nombre 2 est :', options: ['Le seul nombre premier pair', 'Un nombre impair', 'Un nombre composé', 'Un nombre qui n’est pas premier'], expectedAnswer: 'Le seul nombre premier pair', page: 51 },
    { type: 'multiple_choice', question: 'Quel nombre obtient-on en calculant 2 × 3 × 7 ?', options: ['42', '21', '35', '12'], expectedAnswer: '42', page: 52 },
  ],
  off_math_u2_l5: [
    { type: 'multiple_choice', question: 'Quel est le plus grand commun diviseur (PGCD) de 12 et 16 ?', options: ['4', '2', '6', '12'], expectedAnswer: '4', page: 55 },
  ],
  off_math_u2_l7: [
    { type: 'multiple_choice', question: 'Quel est le plus petit commun multiple (PPCM) de 6 et 9 ?', options: ['18', '54', '3', '12'], expectedAnswer: '18', page: 60 },
  ],
  off_math_u3_l1: [
    { type: 'multiple_choice', question: 'Avec le modèle de l’aire du rectangle pour calculer 201 × 32, quel est le produit de 200 × 30 ?', options: ['6 000', '600', '60 000', '60'], expectedAnswer: '6 000', page: 66 },
  ],
  off_math_u3_l3: [
    { type: 'multiple_choice', question: 'Dans l’algorithme usuel de la multiplication, quelle étape faut-il effectuer lorsqu’on multiplie par le chiffre des dizaines ?', options: ['Écrire un zéro de décalage dans la colonne des unités', 'Supprimer la virgule', 'Soustraire les deux nombres', 'Multiplier par 100'], expectedAnswer: 'Écrire un zéro de décalage dans la colonne des unités', page: 73 },
  ],
  off_math_u6_l1: [
    { type: 'multiple_choice', question: 'Dans l’expression « 12 + 24 ÷ 4 », quelle opération faut-il effectuer en premier ?', options: ['La division (24 ÷ 4)', 'L’addition (12 + 24)', 'Les deux en même temps', 'La multiplication par 2'], expectedAnswer: 'La division (24 ÷ 4)', page: 123 },
    { type: 'multiple_choice', question: 'Quel est le résultat de 10 × 4 − 3 en respectant les priorités opératoires ?', options: ['37 (car 40 − 3 = 37)', '10', '70', '40'], expectedAnswer: '37 (car 40 − 3 = 37)', page: 123 },
  ],

  // SCIENCE — Grade 5, Term 1
  off_sci_u1_l1_plant_needs: [
    { type: 'multiple_choice', question: 'Quels vaisseaux transportent l’eau et les sels minéraux des racines vers les feuilles ?', options: ['Les vaisseaux du xylème', 'Les vaisseaux du phloème', 'Les capillaires sanguins', 'Les plastes'], expectedAnswer: 'Les vaisseaux du xylème', page: 14 },
    { type: 'multiple_choice', question: 'Quel gaz est produit pendant la photosynthèse et utilisé par les êtres vivants pour respirer ?', options: ['Le dioxygène', 'Le dioxyde de carbone', 'Le diazote', 'La vapeur d’huile'], expectedAnswer: 'Le dioxygène', page: 16 },
  ],
  off_sci_u1_l2_ecosystem: [
    { type: 'multiple_choice', question: 'Par quel type d’organisme une chaîne alimentaire commence-t-elle toujours ?', options: ['Un producteur, comme une plante verte', 'Un prédateur, comme un lion', 'Un décomposeur', 'Un animal domestique'], expectedAnswer: 'Un producteur, comme une plante verte', page: 25 },
    { type: 'multiple_choice', question: 'Quel rôle essentiel les décomposeurs (champignons et bactéries) jouent-ils dans un écosystème ?', options: ['Ils recyclent les nutriments dans le sol et en améliorent la fertilité', 'Ils fabriquent leur nourriture grâce à la lumière du soleil', 'Ils chassent les insectes', 'Ils filtrent la poussière de l’air'], expectedAnswer: 'Ils recyclent les nutriments dans le sol et en améliorent la fertilité', page: 28 },
  ],
  off_sci_u1_l3_coral_bleaching: [
    { type: 'multiple_choice', question: 'Quelle est la principale cause du blanchissement des coraux de la mer Rouge ?', options: ['L’augmentation de la température de l’eau de mer', 'Le froid en hiver', 'Le grand nombre de poissons prédateurs', 'Les précipitations'], expectedAnswer: 'L’augmentation de la température de l’eau de mer', page: 38 },
    { type: 'multiple_choice', question: 'Pourquoi les tortues marines avalent-elles parfois des sacs en plastique ?', options: ['Parce qu’ils ressemblent aux méduses dont elles se nourrissent', 'Parce qu’ils ressemblent aux algues vertes', 'Parce qu’ils ressemblent au sable fin', 'Parce qu’ils ressemblent aux rochers coralliens'], expectedAnswer: 'Parce qu’ils ressemblent aux méduses dont elles se nourrissent', page: 40 },
  ],
};

/** Replace source-language assessment wording with the matching French version. */
export function withFrenchAssessments<T extends { id: string; exercises: CurriculumExercise[] }>(
  lesson: T,
): T {
  const exercises = FRENCH_ASSESSMENTS[lesson.id];
  return exercises ? { ...lesson, exercises } : lesson;
}
