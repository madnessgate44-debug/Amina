/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { OfficialCurriculumLesson } from '../../types/teachingSession';

/**
 * Official Egyptian Ministry of Education Curriculum for Grade 5 (Term 1)
 * Subject: English (Connect 5) — Primary 5
 */
export const ENGLISH_CURRICULUM_LESSONS: OfficialCurriculumLesson[] = [
  {
    id: 'off_en_u1_apple_tree',
    subjectId: 'subj_english',
    subjectNameAr: 'اللغة الإنجليزية',
    subjectNameEn: 'English (Connect 5)',
    unitNumber: 1,
    unitNameAr: 'الوحدة الأولى: نحن نزرع طعامنا',
    unitNameEn: 'Unit 1: We Plant Our Food',
    lessonNumber: 1,
    titleAr: 'شجرة التفاح المعطاءة',
    titleEn: 'The Generous Apple Tree',
    originTag: 'official',
    isAvailable: true,
    sourceRef: {
      book: 'Connect 5 — English for Primary 5 — Student Book — Term 1',
      bookAr: 'اللغة الإنجليزية كونكت 5 ص. 14-16',
      bookEn: 'English Connect 5 pp. 14-16',
      grade: 'Primary 5',
      term: 'Term 1',
      unit: 'Unit 1',
      lesson: 'Reading Story: The Apple Tree',
      page: 14,
      isAvailable: true,
    },
    objectives: [
      'Read and comprehend the narrative story "The Apple Tree".',
      'Identify key parts of a plant and tree: roots, trunk, branches, leaves, and fruit.',
      'Learn moral vocabulary: generous, grateful, shade, stump.',
      'Express empathy and appreciation for nature and parents who give unconditionally.',
    ],
    readingText: `A long time ago, there was a huge and beautiful apple tree. A little boy loved to come and play around it every single day. He climbed to the tree top, ate the sweet apples, and took a nap under its cool shadow and shade. He loved the tree, and the tree loved to play with him.

Time went by, and the little boy grew older. One day, the boy came back looking sad. "I want toys, but I have no money," he said. The tree smiled: "I have no money, but you can pick all my apples and sell them in the town market." The boy happily picked all the apples and went away.

Years later, the young man returned. "I need a house for my family," he said. The generous tree offered: "You can cut down my branches to build your house." The man cut all the branches happily.

Many years later on a hot summer day, the old man returned tired and weary. "All I need now is a quiet place to rest," said the man. The loving tree replied: "Old tree roots and a stump are the best place to lean on and rest. Come, sit down with me." The man sat down, and the apple tree wept with tears of joy.`,
    vocabulary: [
      { word: 'Trunk', definition: 'The main, thick wooden stem of a tree.' },
      { word: 'Branches', definition: 'Parts that grow out from the tree trunk with leaves.' },
      { word: 'Shade', definition: 'A cool area protected from direct sunlight.' },
      { word: 'Generous', definition: 'Willing to give help, kindness, or gifts freely.' },
      { word: 'Stump', definition: 'The bottom part of a tree left in the ground after it is cut.' },
    ],
    exercises: [
      {
        type: 'multiple_choice',
        question: 'What did the boy cut from the apple tree to build his house?',
        options: ['The branches', 'The roots', 'The trunk only', 'The leaves'],
        expectedAnswer: 'The branches',
        page: 15,
      },
      {
        type: 'multiple_choice',
        question: 'What did the tree have left at the very end of the story for the old man to rest on?',
        options: ['A quiet wooden stump', 'Fresh green apples', 'Big branches', 'Green leaves'],
        expectedAnswer: 'A quiet wooden stump',
        page: 15,
      },
    ],
    concepts: [
      {
        id: 'off_en_u1_apple_tree_c1',
        conceptNumber: 1,
        titleAr: 'عطاء الطبيعة والامتنان للوالدين',
        titleEn: 'Nature Generosity & Unconditional Love',
        sourceText: 'The tree represents unconditional giving and caring for those we love.',
        keyPoints: [
          'Appreciating trees and plants for giving us shade, fruit, and oxygen.',
          'Valuing parents who sacrifice selflessly for their children.',
        ],
        dailyLifeExampleAr: 'Helping plant a lemon or basil tree in the balcony and watering it daily.',
        dailyLifeExampleEn: 'Watering a potted plant on your balcony and thanking your family for their care.',
        storyAnalogyAr: 'Like motherly love that always gives warmth and comfort at every stage of life.',
        storyAnalogyEn: 'Like parents whose loving support embraces you at every stage of life.',
        prerequisiteAr: 'قراءة الكلمات الإنجليزية البسيطة.',
        prerequisiteEn: 'Elementary English vocabulary.',
        visualType: 'concept_map',
      },
    ],
  },
  {
    id: 'off_en_u4_elephantine',
    subjectId: 'subj_english',
    subjectNameAr: 'اللغة الإنجليزية',
    subjectNameEn: 'English (Connect 5)',
    unitNumber: 4,
    unitNameAr: 'الوحدة الرابعة: العناية بعالمنا',
    unitNameEn: 'Unit 4: Looking After Our World',
    lessonNumber: 1,
    titleAr: 'جزيرة إلفنتين في أسوان',
    titleEn: 'Elephantine Island in Aswan',
    originTag: 'official',
    isAvailable: true,
    sourceRef: {
      book: 'Connect 5 — English for Primary 5 — Student Book — Term 1',
      bookAr: 'اللغة الإنجليزية كونكت 5 ص. 60-64',
      bookEn: 'English Connect 5 pp. 60-64',
      grade: 'Primary 5',
      term: 'Term 1',
      unit: 'Unit 4',
      lesson: 'Reading: Elephantine Island',
      page: 60,
      isAvailable: true,
    },
    objectives: [
      'Read a descriptive postcard about Elephantine Island in Aswan.',
      'Explore ecological tourism, felucca sailing on the Nile, and clean air.',
      'Practice adjectives: peaceful, historic, colorful, traditional, ancient.',
    ],
    readingText: `Dear Dalia,
Greetings from beautiful Aswan! Yesterday, we took a traditional wooden felucca boat along the calm waters of the Nile River to visit Elephantine Island.
It is the oldest part of Aswan, full of colorful Nubian houses and ancient archaeological ruins. The air here is very clean, and there is no traffic noise at all. We walked through peaceful gardens with date palm trees and watched the sunset reflecting on the river.
Aswan is truly a magical place where nature and history live in harmony.
Best wishes,
Youssef.`,
    vocabulary: [
      { word: 'Felucca', definition: 'A traditional wooden sailing boat used on the Nile River in Egypt.' },
      { word: 'Peaceful', definition: 'Quiet, calm, and free from disturbance or noise.' },
      { word: 'Nubian houses', definition: 'Distinctive, brightly painted houses with beautiful geometric patterns in southern Egypt.' },
    ],
    exercises: [
      {
        type: 'multiple_choice',
        question: 'How did Youssef travel to Elephantine Island on the Nile River?',
        options: ['In a traditional wooden felucca', 'By airplane', 'By subway', 'By large truck'],
        expectedAnswer: 'In a traditional wooden felucca',
        page: 62,
      },
    ],
    concepts: [
      {
        id: 'off_en_u4_elephantine_c1',
        conceptNumber: 1,
        titleAr: 'السياحة البيئية وتراث النيل في أسوان',
        titleEn: 'Eco-Tourism & Nile Heritage in Aswan',
        sourceText: 'Elephantine Island is a haven of clean air, historic culture, and peaceful nature.',
        keyPoints: [
          'Eco-friendly travel preserves the environment and heritage.',
          'Nubian architecture is famous worldwide for its artistic vibrancy.',
        ],
        dailyLifeExampleAr: 'Enjoying a quiet boat ride on the Nile with family and keeping the river pristine.',
        dailyLifeExampleEn: 'Riding a Nile boat peacefully while ensuring no trash is left behind.',
        storyAnalogyAr: 'Like stepping into a living, open-air museum where time slows down gently.',
        storyAnalogyEn: 'Like visiting an open-air historical sanctuary surrounded by sparkling blue water.',
        prerequisiteAr: 'قراءة جمل وصفية باللغة الإنجليزية.',
        prerequisiteEn: 'Descriptive reading.',
        visualType: 'map_like',
      },
    ],
  },
];
