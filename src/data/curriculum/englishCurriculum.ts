/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { OfficialCurriculumLesson } from '../../types/teachingSession';

/**
 * Connect 5 Grade 5 Term 1 records.
 * Reading summaries, explanations and questions are app-authored paraphrases,
 * not verbatim textbook passages. Source page references identify the Ministry
 * StudentBook lesson they support.
 */
export const ENGLISH_CURRICULUM_LESSONS: OfficialCurriculumLesson[] = [
  {
    id: 'off_en_u1_apple_tree',
    subjectId: 'subj_english',
    subjectNameAr: 'اللغة الإنجليزية',
    subjectNameEn: 'English (Connect 5)',
    unitNumber: 1,
    unitNameAr: 'الوحدة الأولى: الغذاء والطبيعة والثقافة',
    unitNameEn: 'Unit 1: Food, Nature, and Culture',
    lessonNumber: 3,
    titleAr: 'الشجرة المعطاءة',
    titleEn: 'The Giving Tree',
    originTag: 'app_authored',
    language: 'en',
    instructionLanguage: 'en',
    contentLanguage: 'en',
    assessmentLanguage: 'en',
    curriculumSource: 'egyptian_national',
    isAvailable: true,
    contentStatus: 'available',
    sourceRef: {
      book: 'Connect 5 — English for Primary 5 — Student Book — Term 1 (2026–2027)',
      bookAr: 'كونكت 5 — كتاب الطالب — الصف الخامس — الفصل الدراسي الأول 2026–2027',
      bookEn: 'Connect 5 Grade 5 StudentBook, Term 1 (2026–2027)',
      grade: 'Primary 5',
      term: 'Term 1 (2026–2027)',
      unit: 'Unit 1: Food, Nature, and Culture',
      lesson: 'Lesson 3: Story Time — The Giving Tree; Pronunciation',
      page: 13,
      notes: '[V] Lesson title, lesson number and page range 13–16 verified against the Ministry-hosted StudentBook. [APP-AUTHORED] The reading summary, explanations and exercises are paraphrases written for the app, not textbook reproduction.',
      isAvailable: true,
    },
    objectives: [
      'Retell the main change in Tom’s behaviour toward the apple tree.',
      'Use the words crown, shade, trunk, branch, selfish and care for in context.',
      'Infer the story message about responsibility and caring for things that help us.',
      'Recognize consonant clusters in words such as tree, trunk and branch.',
    ],
    readingText: `Tom enjoyed spending time with an apple tree. He made leaf crowns, ate its apples, rested in its shade and climbed its trunk. He rarely gave the tree food or water. After a long time away, he returned and noticed that its leaves were bent and its branches were weak. He understood that he had neglected the tree. Tom began watering it and protecting it from strong sunlight. As the tree recovered, Tom learned that care should be returned, not only received.`,
    vocabulary: [
      { word: 'Crown', definition: 'A special decorated hat worn by a king or queen.' },
      { word: 'Shade', definition: 'A cooler place protected from direct sunlight.' },
      { word: 'Trunk', definition: 'The thick main stem of a tree.' },
      { word: 'Branch', definition: 'A part that grows out from the trunk of a tree.' },
      { word: 'Selfish', definition: 'Thinking only about yourself and not about others.' },
      { word: 'Care for', definition: 'To look after someone or something and provide what it needs.' },
    ],
    exercises: [
      {
        type: 'multiple_choice',
        question: 'What did Tom make from the tree’s leaves?',
        options: ['Crowns', 'A boat', 'A school bag', 'A kite'],
        expectedAnswer: 'Crowns',
        page: 14,
      },
      {
        type: 'qa',
        question: 'Why did the tree become weak while Tom was away?',
        expectedAnswer: 'Tom had neglected it and rarely gave it food or water.',
        page: 14,
      },
      {
        type: 'qa',
        question: 'What did Tom do when he noticed the tree was weak?',
        expectedAnswer: 'He watered it and protected it from strong sunlight.',
        page: 15,
      },
      {
        type: 'qa',
        question: 'What lesson can readers learn from Tom’s change?',
        expectedAnswer: 'We should care for the people and living things that help us, and give care back.',
        page: 15,
      },
      {
        type: 'multiple_choice',
        question: 'Which pair begins with a consonant cluster?',
        options: ['tree and trunk', 'apple and eat', 'open and idea', 'under and over'],
        expectedAnswer: 'tree and trunk',
        page: 16,
      },
    ],
    concepts: [
      {
        id: 'off_en_u1_giving_tree_c1',
        conceptNumber: 1,
        titleAr: 'المسؤولية وردّ الرعاية',
        titleEn: 'Responsibility and Reciprocal Care',
        sourceText: 'Tom first receives benefits from the tree without looking after it. When he notices its condition, he changes his behaviour and begins to care for it.',
        keyPoints: [
          'Identify what Tom receives from the tree.',
          'Explain how neglect affects the tree.',
          'Describe the actions Tom takes to help it recover.',
          'Connect the story message to caring for living things and people.',
        ],
        dailyLifeExampleAr: 'الاعتناء بنبات في المنزل بسقيه وملاحظة احتياجاته بدلاً من الاستفادة منه فقط.',
        dailyLifeExampleEn: 'Looking after a plant by watering it and noticing what it needs, rather than only taking its fruit.',
        storyAnalogyAr: 'العلاقة الصحية تشبه حديقة: تنمو عندما نهتم بها باستمرار.',
        storyAnalogyEn: 'A healthy relationship is like a garden: it grows when we care for it consistently.',
        prerequisiteAr: 'معرفة أجزاء الشجرة ووصف الأفعال في الماضي.',
        prerequisiteEn: 'Basic tree-part vocabulary and understanding of past-tense actions.',
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
    unitNameAr: 'الوحدة الرابعة: مجتمعي',
    unitNameEn: 'Unit 4: My Community',
    lessonNumber: 1,
    titleAr: 'جزيرة إلفنتين في أسوان',
    titleEn: 'Elephantine Island in Aswan',
    originTag: 'app_authored',
    language: 'en',
    instructionLanguage: 'en',
    contentLanguage: 'en',
    assessmentLanguage: 'en',
    curriculumSource: 'egyptian_national',
    isAvailable: false,
    contentStatus: 'pending_materials',
    sourceRef: {
      book: 'Legacy app-authored content — source not verified',
      bookAr: 'محتوى قديم من التطبيق — المصدر غير موثق',
      bookEn: 'Unverified app-only source; no matching lesson in the inspected 2026–2027 Connect 5 StudentBook',
      grade: 'Primary 5',
      term: 'Term 1 (2026–2027)',
      unit: 'Unit 4: My Community',
      lesson: 'Legacy record — no matching StudentBook lesson established',
      page: 60,
      notes: '[U] No matching title or page was found in the inspected Connect 5 Term 1 StudentBook. The original app-authored text is preserved below for compatibility/review only and is not exposed to learners.',
      isAvailable: false,
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
        dailyLifeExampleAr: 'الاستمتاع برحلة هادئة بالقارب في النيل مع العائلة مع الحفاظ على نظافة النهر.',
        dailyLifeExampleEn: 'Riding a Nile boat peacefully while ensuring no trash is left behind.',
        storyAnalogyAr: 'كأنك تدخل متحفا مفتوحا حيا، حيث يهدأ الوقت وسط مياه النيل والطبيعة.',
        storyAnalogyEn: 'Like visiting an open-air historical sanctuary surrounded by sparkling blue water.',
        prerequisiteAr: 'قراءة جمل وصفية باللغة الإنجليزية.',
        prerequisiteEn: 'Descriptive reading.',
        visualType: 'map_like',
      },
    ],
  }
];
