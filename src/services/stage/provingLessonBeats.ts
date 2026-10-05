/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StageLessonSequence } from '../../types/stage';

/**
 * The Seeded Proving Lesson Sequence (Sub-Phase 11.6 & 11.9)
 * اللغة العربية — الوحدة الأولى — الدرس الثاني: «لم أوت ماء النهر»
 * Textbook Source: كتاب اللغة العربية (تواصل) — الصف الخامس الابتدائي — الترم الأول (ص. 12-15)
 *
 * Authored Hybrid Sequence: 14 beats utilizing 9 distinct beat types.
 * Every fact, word, and exercise is traceable to pages 12-15.
 */
export const PROVING_LESSON_BEAT_SEQUENCE: StageLessonSequence = {
  lessonId: 'off_ar_u1_l2',
  lessonTitleAr: 'لم أوت ماء النهر',
  lessonTitleEn: 'I Have Not Polluted the River Water',
  subjectId: 'subj_arabic',
  outfit: 'arabic',
  sourceRefText: 'اللغة العربية (تواصل) ص. 12-15',
  beats: [
    // BEAT 1: scene_open (Tier 2 hero animated clip)
    {
      id: 'beat_1_scene_open',
      type: 'scene_open',
      conceptId: 'off_ar_u1_l2_c1',
      sourcePage: 12,
      nourState: 'excited',
      nourTextAr:
        'مرحباً بكِ يا أمينة! انظري إلى نهر النيل العظيم وهو يتدفق بجماله منذ آلاف السنين. اليوم سنعيش معاً قصة ملهمة من كتابك المدرسي: «لم أوت ماء النهر»!',
      nourTextEn:
        'Welcome, Amina! Look at the majestic River Nile flowing as it has for thousands of years. Today we explore an inspiring textbook lesson: "I Have Not Polluted the River Water"!',
      scenePayload: {
        clipId: 'nile_open_01',
        backgroundTheme: 'nile',
      },
    },

    // BEAT 2: character_speak (Setting the concept from Source p. 12)
    {
      id: 'beat_2_char_speak',
      type: 'character_speak',
      conceptId: 'off_ar_u1_l2_c1',
      sourcePage: 12,
      nourState: 'talking',
      nourTextAr:
        'في مصر القديمة، كان أجدادنا يقفون فخورين ويقسمون: «لم أوت ماء النهر، ولم أحرم الماشية من عشبها». النيل كان شريان الحياة والخير كله. يا ترى الفكرة دي واضحة ليكي يا أمينة؟',
      nourTextEn:
        'In ancient Egypt, our ancestors proudly swore: "I have not polluted the river water, nor deprived cattle of grass." The Nile was their true lifeline. Does this make sense to you, Amina?',
      interactionPayload: {
        simplifiedAnalogyAr:
          'تخيلي يا أمينة لو المية اتقطعت عن بيتنا يوم كامل.. هنعمل إيه؟ مش هنعرف نشرب ولا نطبخ ولا نزرع! عشان كده أجدادنا الفراعنة كانوا بيعتبروا النيل مش مجرد نهر عادي، ده شريان الحياة اللي بيغذي مصر كلها، وكانوا بيقسموا إنهم مش هيلوثوه أبداً.',
        simplifiedAnalogyEn:
          'Imagine if water was cut from our home for a whole day.. we couldn’t drink, cook, or farm! That’s why our ancestors treated the Nile as a sacred lifeline and swore never to pollute it.',
        vocabularyHighlight: {
          word: 'لم أوت',
          meaningAr: 'لم أدنس، ولم ألوث، ولم أفسد طهارة ماء النهر أبداً بإلقاء المخلفات (ص. 12).',
          meaningEn: 'I did not pollute or spoil the purity of the river water.',
        },
      },
    },

    // BEAT 3: child_tap_word (Vocabulary 1: لم أوت)
    {
      id: 'beat_3_tap_word_1',
      type: 'child_tap_word',
      conceptId: 'off_ar_u1_l2_c1',
      sourcePage: 12,
      nourState: 'encouraging',
      nourTextAr:
        'المسي هذه الكلمة التاريخية المهمة من نص الدرس لنستمع إلى نطقها ونفهم معناها الدقيق كما ورد في صفحة ١٢.',
      nourTextEn:
        'Tap this important word from page 12 to hear how it sounds and uncover its exact textbook meaning.',
      interactionPayload: {
        word: 'لَمْ أُوَتِّ',
        definition: 'لم أدنّس، ولم ألوّث، ولم أفسد طهارة ماء النهر أبداً بإلقاء المخلفات.',
        exampleSentence: 'أقسم المصري القديم: لم أوت ماء النهر طوال حياتي.',
      },
    },

    // BEAT 4: child_tap_word (Vocabulary 2: شريان)
    {
      id: 'beat_4_tap_word_2',
      type: 'child_tap_word',
      conceptId: 'off_ar_u1_l2_c1',
      sourcePage: 13,
      nourState: 'talking',
      nourTextAr:
        'والآن المسي كلمة «شريان» لنعرف كيف وصف الكتاب المدرسي نهر النيل في صفحة ١٣.',
      nourTextEn:
        'Now tap the word "Lifeline / Artery" to see how our textbook describes the Nile on page 13.',
      interactionPayload: {
        word: 'شِرْيَانٌ',
        definition: 'المجرى الأساسي لتدفق الدم في الجسم، والمقصود في النص: مصدر الحياة الرئيس لأرض مصر.',
        exampleSentence: 'نهر النيل شريان الحياة والزراعة في مصر.',
      },
    },

    // BEAT 5: child_tap_object (Exploratory Learning in Nile scene)
    {
      id: 'beat_5_tap_object',
      type: 'child_tap_object',
      conceptId: 'off_ar_u1_l2_c1',
      sourcePage: 13,
      nourState: 'thinking',
      nourTextAr:
        'انظري إلى مياه النيل الصافية في المشهد أمامك! المسي مجرى النهر المتلألئ لتكتشفي سراً تاريخياً كتبه الفراعنة.',
      nourTextEn:
        'Look at the sparkling Nile waters in our scene! Tap the glowing river to discover what the ancient Egyptians believed.',
      scenePayload: {
        interactiveObjects: [
          {
            id: 'obj_nile_water',
            labelAr: 'مياه النيل العذبة',
            labelEn: 'Pure Nile Waters',
            xPercent: 38,
            yPercent: 78,
            descriptionAr:
              'كان المصري القديم يرى تلويث مياه النيل ذنباً كبيراً في محكمة العدالة، واعتبر الحفاظ على نقائه واجباً دينياً ووطنياً مقدساً (ص. 13).',
            descriptionEn:
              'Ancient Egyptians considered polluting the Nile a grave offence, treating pure water as a sacred duty (p. 13).',
          },
        ],
      },
    },

    // BEAT 6: child_match_pairs (Textbook Vocabulary Check)
    {
      id: 'beat_6_match_pairs',
      type: 'child_match_pairs',
      conceptId: 'off_ar_u1_l2_c1',
      sourcePage: 13,
      nourState: 'encouraging',
      nourTextAr:
        'أنتِ ذكية وملاحظتك قوية! صلي كل كلمة بمعناها الصحيح من جدول المفردات في كتابك المدرسي.',
      nourTextEn:
        'Great focus! Match each word to its textbook definition to prove your vocabulary mastery.',
      interactionPayload: {
        pairs: [
          {
            id: 'pair_1',
            leftText: 'لم أوت',
            rightText: 'لم أدنس ولم ألوث طهارة الماء',
          },
          {
            id: 'pair_2',
            leftText: 'شريان',
            rightText: 'مصدر الحياة الرئيس والتدفق',
          },
          {
            id: 'pair_3',
            leftText: 'ترشيد',
            rightText: 'حسن الاستخدام دون إسراف أو إهدار',
          },
        ],
      },
    },

    // BEAT 7: child_trace (Arabic Calligraphy Alif in word أوت)
    {
      id: 'beat_7_trace',
      type: 'child_trace',
      conceptId: 'off_ar_u1_l2_c1',
      sourcePage: 14,
      nourState: 'talking',
      nourTextAr:
        'دعينا نربط درسنا بالخط العربي الجميل! تتبعي حرف الألف (أ) في بداية كلمة «أوت» برسم مستقيم ومتوازن.',
      nourTextEn:
        'Let’s practice Arabic calligraphy! Trace the straight Alif letter from the word "أوت".',
      interactionPayload: {
        letterPrompt: 'أ',
        instructionAr: 'ارسمي حرف الألف بالهمزة بلمسة هادئة:',
        instructionEn: 'Trace the letter Alif with steady focus:',
      },
    },

    // BEAT 8: explain_back (Mandatory Concept 1 check)
    {
      id: 'beat_8_explain_back_1',
      type: 'explain_back',
      conceptId: 'off_ar_u1_l2_c1',
      sourcePage: 14,
      nourState: 'listening',
      nourTextAr:
        'والآن جاء دوركِ لتعلميني! اشرحي لي بكلماتكِ البسيطة: لماذا كان المصري القديم يقسم قائلاً «لم أوت ماء النهر»؟',
      nourTextEn:
        'Now you teach me! Explain in your own words: why did the ancient Egyptian swear "I have not polluted the river"?',
      interactionPayload: {
        conceptTitle: 'قسم المصري القديم لحماية النيل (ص. 12-14)',
      },
    },

    // BEAT 9: character_speak (Bridge to Concept 2: Modern Conservation)
    {
      id: 'beat_9_char_speak_2',
      type: 'character_speak',
      conceptId: 'off_ar_u1_l2_c2',
      sourcePage: 14,
      nourState: 'excited',
      nourTextAr:
        'شرحكِ في منتهى الروعة يا أمينة! واليوم، ونحن في عصرنا الحديث، كيف نقتدي بأجدادنا ونحافظ على كل قطرة ماء؟ كل نقطة مية بتفرق في مستقبلنا. يا ترى النقطة دي واضحة ليكي؟',
      nourTextEn:
        'Brilliant explanation, Amina! Today, how do we follow our ancestors and conserve every drop of water? Every drop counts for our future. Does this make sense to you?',
      interactionPayload: {
        simplifiedAnalogyAr:
          'زي ما بنقفل النور لما نخرج من الأوضة أو بنحافظ على شحن الموبايل، المية أهم بكتير! لو قفلنا الصنبور وإحنا بنغسل سناننا، بنوفر لترات مية تكفي شرب أطفال تانيين. ترشيد المية ده عمل بطولي بنعمله كل يوم!',
        simplifiedAnalogyEn:
          'Just like we turn off the lights when leaving a room, water is even more precious! Turning off the faucet while brushing teeth saves enough water for another child to drink. Conserving water is a real daily superpower!',
      },
    },

    // BEAT 10: child_drag_drop (Categorize Good vs Harmful Habits)
    {
      id: 'beat_10_drag_drop',
      type: 'child_drag_drop',
      conceptId: 'off_ar_u1_l2_c2',
      sourcePage: 14,
      nourState: 'encouraging',
      nourTextAr:
        'صنفي السلوكيات التالية بحسب ما تعلمناه: أيها يحمي نهر النيل، وأيها يضره ويهدره؟',
      nourTextEn:
        'Sort these actions: which ones protect the Nile, and which ones waste or harm water?',
      interactionPayload: {
        zones: [
          { id: 'zone_protect', title: 'حماية وترشيد الماء', color: 'emerald' },
          { id: 'zone_waste', title: 'إهدار وتلويث الماء', color: 'rose' },
        ],
        items: [
          {
            id: 'item_1',
            text: 'غلق الصنبور أثناء تنظيف الأسنان',
            correctZoneId: 'zone_protect',
          },
          {
            id: 'item_2',
            text: 'إلقاء الأكياس والمخلفات في المجرى',
            correctZoneId: 'zone_waste',
          },
          {
            id: 'item_3',
            text: 'استخدام أساليب الري الحديثة بالرش والتنقيط',
            correctZoneId: 'zone_protect',
          },
          {
            id: 'item_4',
            text: 'ترك الخرطوم مفتوحاً في الشارع',
            correctZoneId: 'zone_waste',
          },
        ],
      },
    },

    // BEAT 11: child_build (Concept Map Builder)
    {
      id: 'beat_11_build',
      type: 'child_build',
      conceptId: 'off_ar_u1_l2_c2',
      sourcePage: 15,
      nourState: 'thinking',
      nourTextAr:
        'ابني معي شبكة الأفكار المتصلة بنهر النيل كشريان للحياة من كتاب الوزارة صفحة ١٥!',
      nourTextEn:
        'Build the Nile concept map connecting its vital roles as described on page 15!',
      interactionPayload: {
        centerConcept: 'نهر النيل: شريان الحياة',
        nodes: [
          { id: 'n1', title: 'الزراعة والخير', isPlaced: false },
          { id: 'n2', title: 'مياه الشرب العذبة', isPlaced: false },
          { id: 'n3', title: 'أمانة للأجيال القادمة', isPlaced: false },
        ],
      },
    },

    // BEAT 12: child_choose_answer (Quick Textbook Exercise Check)
    {
      id: 'beat_12_choose_answer',
      type: 'child_choose_answer',
      conceptId: 'off_ar_u1_l2_c2',
      sourcePage: 15,
      nourState: 'talking',
      nourTextAr:
        'سؤال سريع من تدريبات صفحة ١٥: ما هو المعنى المقصود بكلمة «لم أوت» في سياق النص؟',
      nourTextEn:
        'Quick textbook check from page 15: what is the meaning of "لم أوت" in the text?',
      interactionPayload: {
        questionText: 'معنى كلمة (لم أوت) في برديات المحاكمة الأخلاقية القديمة:',
        options: [
          { id: 'opt_1', text: 'لم أشرب من ماء النهر', isCorrect: false },
          { id: 'opt_2', text: 'لم أدنّس ولم ألوّث مياهه أبداً', isCorrect: true },
          { id: 'opt_3', text: 'لم أسبح في أعماقه', isCorrect: false },
        ],
      },
    },

    // BEAT 13: explain_back (Mandatory Concept 2 check)
    {
      id: 'beat_13_explain_back_2',
      type: 'explain_back',
      conceptId: 'off_ar_u1_l2_c2',
      sourcePage: 15,
      nourState: 'listening',
      nourTextAr:
        'آخر خطوة وأهم خطوة يا بطلة! اشرحي لي: كيف نستطيع عملياً في بيوتنا ومدارسنا حماية نهر النيل وترشيد استهلاك الماء؟',
      nourTextEn:
        'Final and most important step! Teach me back: how can we practically protect and conserve the Nile at home and school?',
      interactionPayload: {
        conceptTitle: 'واجبنا الوطني في ترشيد وحماية النيل اليوم (ص. 15)',
      },
    },

    // BEAT 14: character_speak + celebration (Mastery update & joyful closing)
    {
      id: 'beat_14_celebrate_close',
      type: 'character_speak',
      conceptId: 'off_ar_u1_l2_c2',
      sourcePage: 15,
      nourState: 'celebrating',
      nourTextAr:
        'مبارك يا أمينة! أنتِ معلمة عبقرية وشرحتِ الدرس ببراعة لا تصدق! تم تسجيل إتقانكِ الكامل لدرس «لم أوت ماء النهر» في خريطة المعرفة. أنا فخور بكِ جداً!',
      nourTextEn:
        'Hooray, Amina! You taught that with true brilliance and confidence! Full mastery of "I Have Not Polluted the River Water" is recorded in your knowledge map. So proud of you!',
    },
  ],
};
