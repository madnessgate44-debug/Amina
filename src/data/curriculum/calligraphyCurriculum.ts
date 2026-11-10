/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { OfficialCurriculumLesson } from '../../types/teachingSession';

/**
 * Official Egyptian Ministry of Education Curriculum for Grade 5 (Term 1)
 * Subject: الخط العربي (Arabic Calligraphy) — كراسة الخط العربي
 */
export const CALLIGRAPHY_CURRICULUM_LESSONS: OfficialCurriculumLesson[] = [
  {
    id: 'off_callig_alif_naskh_ruqaa',
    subjectId: 'subj_calligraphy',
    subjectNameAr: 'الخط العربي',
    subjectNameEn: 'Arabic Calligraphy',
    unitNumber: 1,
    unitNameAr: 'الوحدة الأولى: جماليات خطي النسخ والرقعة',
    unitNameEn: 'Unit 1: Naskh & Ruqaa Calligraphy Aesthetics',
    lessonNumber: 1,
    titleAr: 'قواعد رسم حرف الألف في خطي النسخ والرقعة',
    titleEn: 'Letter Alif in Naskh & Ruqaa Scripts',
    originTag: 'official',
    isAvailable: true,
    sourceRef: {
      book: 'كراسة الخط العربي — الصف الخامس الابتدائي — الفصل الدراسي الأول',
      bookAr: 'كراسة الخط العربي ص. 4-6',
      bookEn: 'Arabic Calligraphy Workbook pp. 4-6',
      grade: 'الصف الخامس',
      term: 'الفصل الدراسي الأول',
      unit: 'الوحدة الأولى',
      lesson: 'الدرس الأول: حرف الألف',
      page: 4,
      isAvailable: true,
    },
    objectives: [
      'يميز بين رسم حرف الألف في خط النسخ (طوله 5 نقاط بقوام مستقيم وحلية خفيفة) وخط الرقعة (طوله 3 نقاط بميل خفيف).',
      'يتعلم استقرار الحروف على السطر وحسن التناسق البصري بين الكلمات.',
      'يطبق المحاكاة والكتابة بالقلم بزاوية ميل صحيحة.',
    ],
    readingText: `الخط العربي فن عريق يعكس جمال لغة القرآن وذوق الكاتب.
مقارنة بين رسم الألف في خطي النسخ والرقعة:
1. خط النسخ (خط المصحف والكتب):
- حرف الألف مستقيم تماماً، قائم بزاوية 90 درجة تقريباً.
- مقداره 5 نقاط بقلم الخط.
- تُرسم في أعلاه حلية خفيفة تسمى "الترويس" أو "الزلفة".
2. خط الرقعة (خط الكتابة السريعة اليومية):
- حرف الألف أقصر؛ مقداره 3 نقاط فقط.
- يميل قليلاً جهة اليسار من الأسفل بزاوية رشيقة.
- يخلو تماماً من الحلية (الترويس) لسرعة الكتابة وسهولتها.`,
    vocabulary: [
      { word: 'خط النسخ', definition: 'الخط العربي الأصيل المستخدم في كتابة المصحف الشريف والكتب المدرسية لوضوحه التام.' },
      { word: 'خط الرقعة', definition: 'خط عربي سريع وعملي ابتكره الخطاطون للأعمال والمراسلات اليومية.' },
      { word: 'الترويس (الزلفة)', definition: 'حلية جمالية صغيرة جداً تُرسم في رأس حرف الألف أو اللام في خط النسخ.' },
    ],
    exercises: [
      {
        type: 'multiple_choice',
        question: 'طول حرف الألف في خط النسخ يُقاس بمقدار:',
        options: ['5 نقاط بقلم الخط', '3 نقاط فقط', 'نقطة واحدة', '10 نقاط'],
        expectedAnswer: '5 نقاط بقلم الخط',
        page: 5,
      },
      {
        type: 'multiple_choice',
        question: 'يتميز خط الرقعة عن خط النسخ في الكتابة بأنه:',
        options: ['أسرع في الكتابة وتكون حروفه أقصر وتميل قليلاً', 'أطول في الحروف', 'يحتوي على زخارف وزلف في كل حرف', 'يكتب بالفرشاة فقط'],
        expectedAnswer: 'أسرع في الكتابة وتكون حروفه أقصر وتميل قليلاً',
        page: 5,
      },
    ],
    concepts: [
      {
        id: 'off_callig_alif_c1',
        conceptNumber: 1,
        titleAr: 'قواعد استقامة الحروف ورشاقة القلم',
        titleEn: 'Pen Angles & Calligraphic Straightness',
        sourceText: 'استقامة الألف في النسخ تعبر عن الهيبة، وميلها في الرقعة يعبر عن السرعة والرشاقة.',
        keyPoints: [
          'الجلوس الصحيح ومسكة القلم بزاوية 45 درجة.',
          'السطر هو الميزان الذي تستقر عليه الحروف.',
        ],
        dailyLifeExampleAr: 'تحسين خطك في كتابة الواجبات المدرسية لتبدو كراستك نظيفة ومنسقة كلوحة فنية.',
        dailyLifeExampleEn: 'Neat handwriting on daily homework pages that earns high praise from your teacher.',
        storyAnalogyAr: 'حرف الألف مثل شجرة النخيل؛ في النسخ باسقة ومستقيمة، وفي الرقعة تتمايل بنعومة مع نسيم الهواء.',
        storyAnalogyEn: 'Letter Alif is like a palm tree: standing tall in Naskh, gently swaying in Ruqaa.',
        prerequisiteAr: 'حروف الهجاء الأساسية.',
        prerequisiteEn: 'Arabic alphabet basics.',
        misconceptions: [
          {
            id: 'mis_ar_callig_alif_three',
            trigger: '3 نقاط فقط',
            explanation: 'ظننتِ أن طول الألف في خط النسخ ثلاث نقاط.',
            remediation: 'طول الألف في خط النسخ خمس نقاط بقلم الخط، لا ثلاث.',
          },
          {
            id: 'mis_ar_callig_alif_one',
            trigger: 'نقطة واحدة',
            explanation: 'ظننتِ أن طول الألف نقطة واحدة.',
            remediation: 'الألف في خط النسخ تمتد بمقدار خمس نقاط بقلم الخط.',
          },
          {
            id: 'mis_ar_callig_alif_ten',
            trigger: '10 نقاط',
            explanation: 'ظننتِ أن طول الألف عشر نقاط.',
            remediation: 'المقدار الصحيح خمس نقاط بقلم الخط، لا عشر.',
          },
          {
            id: 'mis_ar_callig_ruqaa_longer',
            trigger: 'أطول في الحروف',
            explanation: 'ظننتِ أن خط الرقعة أطول في الحروف من النسخ.',
            remediation: 'خط الرقعة أسرع في الكتابة وحروفه أقصر وتميل قليلاً، لا أطول.',
          },
          {
            id: 'mis_ar_callig_ruqaa_decor',
            trigger: 'يحتوي على زخارف وزلف في كل حرف',
            explanation: 'ظننتِ أن خط الرقعة مليء بالزخارف في كل حرف.',
            remediation: 'خط الرقعة حديث وبسيط وسريع، وليس خط زخرفة.',
          },
          {
            id: 'mis_ar_callig_ruqaa_brush',
            trigger: 'يكتب بالفرشاة فقط',
            explanation: 'ظننتِ أن خط الرقعة يكتب بالفرشاة فقط.',
            remediation: 'الرقعة يكتب بالقلم العادي بسرعة؛ الفرشاة ليست شرطاً له.',
          },
        ],
        distractors: [
          '3 نقاط فقط|mis_ar_callig_alif_three',
          'نقطة واحدة|mis_ar_callig_alif_one',
          '10 نقاط|mis_ar_callig_alif_ten',
          'أطول في الحروف|mis_ar_callig_ruqaa_longer',
          'يحتوي على زخارف وزلف في كل حرف|mis_ar_callig_ruqaa_decor',
          'يكتب بالفرشاة فقط|mis_ar_callig_ruqaa_brush',
        ],
        visualType: 'stroke_guide',
      },
    ],
  },
];
