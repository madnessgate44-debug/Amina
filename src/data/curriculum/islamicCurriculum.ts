/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { OfficialCurriculumLesson } from '../../types/teachingSession';

/**
 * Official Egyptian Ministry of Education Curriculum for Grade 5 (Term 1)
 * Subject: التربية الدينية الإسلامية (Islamic Studies) — الصف الخامس الابتدائي
 */
export const ISLAMIC_CURRICULUM_LESSONS: OfficialCurriculumLesson[] = [
  {
    id: 'off_isl_u1_l1_names_of_allah',
    subjectId: 'subj_islamic',
    subjectNameAr: 'التربية الدينية الإسلامية',
    subjectNameEn: 'Islamic Studies',
    unitNumber: 1,
    unitNameAr: 'المحور الأول: أكتشف ذاتي — العقيدة',
    unitNameEn: 'Theme 1: Discovering Identity — Aqeedah',
    lessonNumber: 1,
    titleAr: 'سورة الحشر وأسماء الله الحسنى',
    titleEn: 'Surah Al-Hashr & The Beautiful Names of Allah',
    originTag: 'official',
    isAvailable: true,
    sourceRef: {
      book: 'كتاب التربية الدينية الإسلامية — الصف الخامس الابتدائي — الفصل الدراسي الأول',
      bookAr: 'التربية الدينية الإسلامية — كتاب الوزارة ص. 8-15',
      bookEn: 'Islamic Education Ministry Book pp. 8-15',
      grade: 'الصف الخامس',
      term: 'الفصل الدراسي الأول',
      unit: 'المحور الأول',
      lesson: 'الدرس الأول: العقيدة وتدبر القرآن',
      page: 8,
      isAvailable: true,
    },
    objectives: [
      'يتلو آيات أواخر سورة الحشر تلاوة صحيحة مع مراعاة أحكام التجويد والترتيل.',
      'يفسر معاني أسماء الله الحسنى: الملك، القدوس، السلام، المؤمن، المهيمن، العزيز، الجبار، المتكبر.',
      'يستشعر عظمة الخالق سبحانه ويتعلم شكر نعم الله في السلوك اليومي.',
    ],
    readingText: `قال الله تعالى في سورة الحشر: ﴿هُوَ اللَّهُ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْمَلِكُ الْقُدُّوسُ السَّلَامُ الْمُؤْمِنُ الْمُهَيْمِنُ الْعَزِيزُ الْجَبَّارُ الْمُتَكَبِّرُ سُبْحَانَ اللَّهِ عَمَّا يُشْرِكُونَ ۝ هُوَ اللَّهُ الْخَالِقُ الْبَارِئُ الْمُصَوِّرُ لَهُ الْأَسْمَاءُ الْحُسْنَى يُسَبِّحُ لَهُ مَا فِي السَّمَاوَاتِ وَالْأَرْضِ وَهُوَ الْعَزِيزُ الْحَكِيمُ﴾.
معاني الأسماء العظيمة:
- القدوس: المنزه عن كل عيب ونقص، الكامل في أسمائه وصفاته.
- السلام: الذي سلم من كل نقص، وناشر الأمان والسلام بين عباده.
- المهيمن: الرقيب الحافظ لكل شيء، والمطلع على سرائر القلوب.
- الخالق البارئ المصور: الذي أوجد الكون من العدم، وشكل كل مخلوق في أبهى صورة وهيئة.`,
    vocabulary: [
      { word: 'القدوس', definition: 'المنزه المطهر عن كل عيب وشبيه، وله الكمال المطلق سبحانه.' },
      { word: 'السلام', definition: 'الذي يسلم خلقه من الظلم، ومصدر الأمان والسكينة والطمأنينة.' },
      { word: 'المهيمن', definition: 'الحافظ الشاهد والرقيب على كل صغيرة وكبيرة في الكون.' },
    ],
    exercises: [
      {
        type: 'multiple_choice',
        question: 'معنى اسم الله تعالى «القدوس» في أواخر سورة الحشر هو:',
        options: ['المنزه والمطهر عن كل عيب ونقص', 'الذي ينشر المطر', 'الذي خلق الجبال فقط', 'الذي يسمع الأصوات العالية'],
        expectedAnswer: 'المنزه والمطهر عن كل عيب ونقص',
        page: 12,
      },
    ],
    concepts: [
      {
        id: 'off_isl_u1_l1_c1',
        conceptNumber: 1,
        titleAr: 'عظمة أسماء الله الحسنى وأثرها في طمأنينة القلب',
        titleEn: 'Allah Beautiful Names & Heart Peace',
        sourceText: 'معرفة أسماء الله تورث حبه ومراقبته في السر والعلن ونشر السلام بين الناس.',
        keyPoints: [
          'الدعاء بأسماء الله الحسنى يقرّب العبد من ربه.',
          'اسم الله السلام يحث المسلم على أن يسلم الناس من لسانه ويده.',
        ],
        dailyLifeExampleAr: 'إفشاء السلام ورد التحية بابتسامة لأهلك وزملائك في المدرسة اقتداءً باسم الله السلام.',
        dailyLifeExampleEn: 'Greeting friends and family with warmth and kindness embodying the name As-Salam.',
        storyAnalogyAr: 'مثل نور الصباح الذي يملأ الحجرة دفئاً وراحة، ذكر أسماء الله يملأ قلبك طمأنينة وسكينة.',
        storyAnalogyEn: 'Like morning sunshine filling a room with warmth, remembering Allah’s names fills your heart with tranquility.',
        prerequisiteAr: 'قراءة القرآن الكريم وأركان الإيمان.',
        prerequisiteEn: 'Basic Quran recitation.',
        visualType: 'concept_map',
      },
    ],
  },
  {
    id: 'off_isl_u1_l2_prayer_virtues',
    subjectId: 'subj_islamic',
    subjectNameAr: 'التربية الدينية الإسلامية',
    subjectNameEn: 'Islamic Studies',
    unitNumber: 2,
    unitNameAr: 'المحور الأول: أكتشف ذاتي — العبادات',
    unitNameEn: 'Theme 1: Worship — Prayer & Purification',
    lessonNumber: 1,
    titleAr: 'فضل الصلاة وآدابها وسننها',
    titleEn: 'Virtues, Sunnahs & Etiquette of Prayer',
    originTag: 'official',
    isAvailable: true,
    sourceRef: {
      book: 'كتاب التربية الدينية الإسلامية — الصف الخامس الابتدائي — الفصل الدراسي الأول',
      bookAr: 'التربية الدينية الإسلامية — كتاب الوزارة ص. 22-30',
      bookEn: 'Islamic Education Ministry Book pp. 22-30',
      grade: 'الصف الخامس',
      term: 'الفصل الدراسي الأول',
      unit: 'المحور الأول: العبادات',
      lesson: 'الدرس الأول: مكانة الصلاة',
      page: 22,
      isAvailable: true,
    },
    objectives: [
      'يوضح مكانة الصلاة كركن ثانٍ من أركان الإسلام الخمسة والصلة المباشرة بين العبد وربه.',
      'يميز بين شروط صحة الصلاة (الوضوء، الطهارة، ستر العورة، استقبال القبلة، دخول الوقت) وسنن الصلاة.',
      'يتعلم آداب الخشوع في الصلاة وأثرها في تهذيب الأخلاق والنهي عن الفحشاء والمنكر.',
    ],
    readingText: `الصلاة هي عماد الدين وثاني أركان الإسلام، وهي العبادة الوحيدة التي فرضها الله سبحانه وتعالى في ليلة الإسراء والمعراج في السماء السابعة مباشرة على نبيه محمد ﷺ.
شروط صحة الصلاة:
1. دخول وقت الصلاة.
2. الطهارة من الحدث (الوضوء أو الغسل).
3. طهارة البدن والثوب والمكان من النجاسات.
4. ستر العورة.
5. استقبال القبلة (الكعبة المشرفة).
6. النية ومحلها القلب.
سنن الصلاة: كدعاء الاستفتاح، ورفع اليدين عند تكبيرة الإحرام، وقراءة سورة قصيرة بعد الفاتحة في الركعتين الأوليين، وأذكار الركوع والسجود.`,
    vocabulary: [
      { word: 'تكبيرة الإحرام', definition: 'قول «الله أكبر» في بداية الصلاة وبها يدخل المصلي في حرمة الصلاة ويحرم عليه ما يشغله عنها.' },
      { word: 'الخشوع', definition: 'سكون الجوارح وحضور الذهن والقلب وتدبر الآيات أثناء الوقوف بين يدي الله.' },
      { word: 'سنن الصلاة', definition: 'أقوال وأفعال وردت عن النبي ﷺ يثاب فاعلها ولا تبطل الصلاة بتركها سهواً.' },
    ],
    exercises: [
      {
        type: 'multiple_choice',
        question: 'فُرضت الصلاة على المسلمين في مناسبة عظيمة هي:',
        options: ['ليلة الإسراء والمعراج', 'يوم فتح مكة', 'غزوة بدر', 'يوم عرفة'],
        expectedAnswer: 'ليلة الإسراء والمعراج',
        page: 24,
      },
    ],
    concepts: [
      {
        id: 'off_isl_u1_l2_c1',
        conceptNumber: 1,
        titleAr: 'الصلاة صلة يومية حية مع الله تعالى',
        titleEn: 'Daily Connection with Allah through Prayer',
        sourceText: 'الصلاة خمس مرات يومياً تغسل الذنوب وتملأ حياة المسلم بركة وتنظيماً للوقت.',
        keyPoints: [
          'الصلاة أول ما يحاسب عليه العبد يوم القيامة.',
          'الصلوات الخمس تنظم أوقات اليوم وتجدد النشاط والروح.',
        ],
        dailyLifeExampleAr: 'الوضوء بهدوء وإتقان وأداء صلاة الظهر في وقتها أثناء استراحة المذاكرة.',
        dailyLifeExampleEn: 'Performing Wudu attentively and praying Dhuhr on time during study breaks.',
        storyAnalogyAr: 'مثل النهر العذب الجاري عند باب بيتك؛ تغتسلين منه خمس مرات يومياً فلا يبقى من ذنوبك شيء.',
        storyAnalogyEn: 'Like a fresh river flowing right outside your doorstep in which you wash five times a day.',
        prerequisiteAr: 'خطوات الوضوء السليم.',
        prerequisiteEn: 'Wudu steps.',
        visualType: 'diagram',
      },
    ],
  },
];
