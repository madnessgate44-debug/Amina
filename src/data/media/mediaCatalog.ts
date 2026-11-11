/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * The educational media catalog.
 *
 * Every entry binds a real asset in `public/media/` to a specific lesson and
 * concept, with the curriculum reference it illustrates, its educational
 * purpose, its accessibility text, its provenance and its review state. The
 * feed looks media up by (lessonId, conceptId) and renders by type; no lesson
 * needs a bespoke component.
 *
 * Assets are produced by `scripts/build-media.sh` from committed sources in
 * `media-src/` (see `scripts/build-media.sh`, `scripts/build-narration.py`).
 * Nothing here is decorative: each item explains its lesson.
 */

import { EducationalMediaItem } from '../../types/media';

export const MEDIA_CATALOG: EducationalMediaItem[] = [
  // ── Science: photosynthesis (off_sci_u1_l1_plant_needs / c1) ─────────────
  {
    id: 'sci_photosynthesis_diagram',
    type: 'image',
    kind: 'diagram',
    lessonId: 'off_sci_u1_l1_plant_needs',
    conceptId: 'off_sci_u1_l1_c1',
    subjectId: 'subj_science',
    reelKind: 'teach_card',
    curriculumRef: 'Science Ministry Book pp. 10-18',
    src: 'media/science/photosynthesis.svg',
    fallbackSrc: 'media/science/photosynthesis.png',
    mimeType: 'image/svg+xml',
    width: 960,
    height: 600,
    title: {
      ar: 'البناء الضوئي داخل الورقة',
      en: 'Photosynthesis inside the leaf',
      fr: 'La photosynthèse dans la feuille',
    },
    purpose: {
      ar: 'يوضح كيف يتحول ضوء الشمس والماء وثاني أكسيد الكربون إلى سكر وأكسجين، ويسمّي الأجزاء بالأرقام.',
      en: 'Shows how sunlight, water and carbon dioxide become sugar and oxygen, naming each part with a numbered key.',
      fr: 'Montre comment la lumière, l’eau et le CO₂ deviennent sucre et oxygène, avec une légende numérotée.',
    },
    alt: {
      ar: 'رسم للنبات: شمس مرقّمة ١، ماء يصعد من الجذور مرقّم ٢، ثاني أكسيد الكربون يدخل الورقة مرقّم ٣، ورقة خضراء مرقّمة ٤، جزيء سكر مرقّم ٥، وأكسجين يخرج مرقّم ٦.',
      en: 'Diagram of a plant: sun labelled 1, water rising from the roots labelled 2, carbon dioxide entering a leaf labelled 3, a green leaf labelled 4, a sugar molecule labelled 5, and oxygen leaving labelled 6.',
      fr: 'Schéma d’une plante : soleil (1), eau montant des racines (2), dioxyde de carbone entrant dans une feuille (3), feuille verte (4), molécule de sucre (5), oxygène sortant (6).',
    },
    legend: [
      { n: 1, text: { ar: 'ضوء الشمس (طاقة)', en: 'Sunlight (energy)', fr: 'Lumière du soleil (énergie)' } },
      { n: 2, text: { ar: 'الماء من الجذور', en: 'Water from the roots', fr: 'L’eau des racines' } },
      { n: 3, text: { ar: 'ثاني أكسيد الكربون من الهواء', en: 'Carbon dioxide from the air', fr: 'Le CO₂ de l’air' } },
      { n: 4, text: { ar: 'الورقة: مصنع الغذاء (الكلوروفيل)', en: 'The leaf: food factory (chlorophyll)', fr: 'La feuille : usine (chlorophylle)' } },
      { n: 5, text: { ar: 'سكر الجلوكوز الناتج', en: 'The glucose produced', fr: 'Le glucose produit' } },
      { n: 6, text: { ar: 'غاز الأكسجين الناتج', en: 'The oxygen released', fr: 'L’oxygène libéré' } },
    ],
    // Callout centres from media-src/science/photosynthesis.svg, normalised to
    // the 960x600 box. Tapping one opens its legend entry.
    hotspots: [
      { n: 1, x: 0.125, y: 0.183 },
      { n: 2, x: 0.344, y: 0.933 },
      { n: 3, x: 0.729, y: 0.350 },
      { n: 4, x: 0.500, y: 0.383 },
      { n: 5, x: 0.500, y: 0.517 },
      { n: 6, x: 0.188, y: 0.358 },
    ],
    narration: {
      text: {
        ar: 'شاهدي كيف يصنع النبات غذاءه: ضوء الشمس، وماء من الجذور، وثاني أكسيد الكربون من الهواء، فتنتج الأوراق سكر الجلوكوز وتُطلق غاز الأكسجين.',
        en: 'Watch how the plant makes its food: sunlight, water from the roots, and carbon dioxide from the air, so the leaves make glucose sugar and release oxygen.',
        fr: 'Regarde comment la plante fabrique sa nourriture : la lumière, l’eau des racines et le dioxyde de carbone de l’air donnent du glucose et libèrent de l’oxygène.',
      },
      src: 'media/audio/sci_photosynthesis_ar.mp3',
      language: 'ar',
    },
    displayDurationMs: 12000,
    branding: { palette: 'science', watermark: { ar: 'مس نور', en: 'Miss Noor' } },
    source: {
      origin: 'authored_svg',
      author: 'Miss Noor media pipeline',
      license: 'Project-owned (Apache-2.0)',
      attribution: 'Drawn from the Egyptian Ministry of Education Grade 5 Science curriculum.',
    },
    review: { status: 'reviewed', reviewedBy: 'owner-window', notes: 'Curriculum text and part names checked against the lesson.' },
  },
  {
    id: 'sci_photosynthesis_animation',
    type: 'video',
    kind: 'animation',
    lessonId: 'off_sci_u1_l1_plant_needs',
    conceptId: 'off_sci_u1_l1_c1',
    subjectId: 'subj_science',
    reelKind: 'story_analogy',
    curriculumRef: 'Science Ministry Book pp. 10-18',
    src: 'media/science/photosynthesis_animation.mp4',
    mimeType: 'video/mp4',
    width: 960,
    height: 600,
    title: {
      ar: 'البناء الضوئي خطوة بخطوة',
      en: 'Photosynthesis step by step',
      fr: 'La photosynthèse étape par étape',
    },
    purpose: {
      ar: 'يُبرز ترتيب خطوات البناء الضوئي: الشمس ثم الماء ثم ثاني أكسيد الكربون ثم الورقة ثم السكر ثم الأكسجين.',
      en: 'Highlights the order of photosynthesis: sun, then water, then carbon dioxide, then the leaf, then sugar, then oxygen.',
      fr: 'Met en évidence l’ordre : soleil, eau, CO₂, feuille, sucre, oxygène.',
    },
    alt: {
      ar: 'رسوم متحركة تُضيء كل جزء من أجزاء البناء الضوئي بالترتيب من واحد إلى ستة.',
      en: 'Animation that lights up each part of photosynthesis in turn, from 1 to 6.',
      fr: 'Animation qui illumine chaque étape de la photosynthèse de 1 à 6.',
    },
    displayDurationMs: 9000,
    playback: {
      loop: true,
      autoplay: true,
      muted: true,
      controls: true,
      poster: 'media/science/photosynthesis_animation_poster.png',
      reducedMotionFallback: 'poster',
    },
    branding: { palette: 'science', watermark: { ar: 'مس نور', en: 'Miss Noor' } },
    source: {
      origin: 'authored_video',
      author: 'Miss Noor media pipeline',
      license: 'Project-owned (Apache-2.0)',
      attribution: 'Frames generated from the photosynthesis diagram (ffmpeg H.264).',
    },
    review: { status: 'reviewed', reviewedBy: 'owner-window', notes: 'Stage order checked against the lesson text.' },
  },

  // ── Maths: comparing decimals (off_math_u1_l4 / c1) ──────────────────────
  {
    id: 'math_decimal_number_line',
    type: 'image',
    kind: 'number_line',
    lessonId: 'off_math_u1_l4',
    conceptId: 'off_math_u1_l4_c1',
    subjectId: 'subj_math',
    reelKind: 'teach_card',
    curriculumRef: 'Math Ministry Book — Unit 1, Lesson 4',
    src: 'media/math/decimal_number_line.svg',
    fallbackSrc: 'media/math/decimal_number_line.png',
    mimeType: 'image/svg+xml',
    width: 960,
    height: 420,
    title: {
      ar: 'مقارنة العددين ٠٫٤ و ٠٫٤٠ على خط الأعداد',
      en: 'Comparing 0.4 and 0.40 on the number line',
      fr: 'Comparer 0,4 et 0,40 sur la droite graduée',
    },
    purpose: {
      ar: 'يوضح أن ٠٫٤ = ٠٫٤٠ لأن الصفر بعد الفاصلة لا يغيّر القيمة، ويُري موضعهما على خط الأعداد مقسّمًا إلى أعشار.',
      en: 'Shows that 0.4 = 0.40 because a trailing zero does not change the value, placing both at the same point on a line divided into tenths.',
      fr: 'Montre que 0,4 = 0,40 : un zéro final ne change pas la valeur ; les deux nombres sont au même point.',
    },
    alt: {
      ar: 'خط أعداد من صفر إلى واحد مقسّم إلى عشرة أعشار، وعلامة عند ٠٫٤ مع بطاقة توضح أن ٠٫٤ يساوي ٠٫٤٠.',
      en: 'A number line from 0 to 1 divided into ten tenths, with a marker at 0.4 and a badge showing 0.4 equals 0.40.',
      fr: 'Une droite graduée de 0 à 1 divisée en dix dixièmes, avec un repère à 0,4 et l’égalité 0,4 = 0,40.',
    },
    narration: {
      text: {
        ar: 'على خط الأعداد، العدد أربعة من عشرة يساوي أربعين من مئة. الصفر بعد الفاصلة لا يغيّر القيمة.',
        en: 'On the number line, four tenths equals forty hundredths. A zero after the decimal point does not change the value.',
        fr: 'Sur la droite graduée, quatre dixièmes égale quarante centièmes. Un zéro après la virgule ne change pas la valeur.',
      },
      src: 'media/audio/math_decimals_ar.mp3',
      language: 'ar',
    },
    displayDurationMs: 10000,
    branding: { palette: 'math', watermark: { ar: 'مس نور', en: 'Miss Noor' } },
    source: {
      origin: 'authored_svg',
      author: 'Miss Noor media pipeline',
      license: 'Project-owned (Apache-2.0)',
      attribution: 'Drawn from the Egyptian Ministry of Education Grade 5 Maths curriculum.',
    },
    review: { status: 'reviewed', reviewedBy: 'owner-window', notes: 'Equality 0.4 = 0.40 checked; tick spacing is one tenth.' },
  },

  // ── Language: French greetings (off_fr_u1_l1_salutations / conc_…_salutations) ──
  {
    id: 'fr_greetings_scene',
    type: 'image',
    kind: 'illustration',
    lessonId: 'off_fr_u1_l1_salutations',
    conceptId: 'conc_fr_u1_l1_salutations',
    subjectId: 'subj_french',
    reelKind: 'teach_card',
    curriculumRef: 'Al-Adwaa French Grade 5 — Unité 1, p. 12',
    src: 'media/language/greetings_scene.svg',
    fallbackSrc: 'media/language/greetings_scene.png',
    mimeType: 'image/svg+xml',
    width: 960,
    height: 600,
    title: {
      ar: 'تبادل التحية بين صديقين',
      en: 'Two friends greeting each other',
      fr: 'Deux amis qui se saluent',
    },
    purpose: {
      ar: 'يمثّل موقف التحية والوداع حتى يفهم الطفل متى يقول Bonjour و Salut و Au revoir.',
      en: 'Depicts a greeting-and-farewell scene so the child sees when to say Bonjour, Salut and Au revoir.',
      fr: 'Illustre une scène de salutation et de départ pour comprendre quand dire Bonjour, Salut et Au revoir.',
    },
    alt: {
      ar: 'طفلان يتحدثان ويتبادلان التحية، لكل منهما فقاعة كلام، وأحدهما يلوّح بيده.',
      en: 'Two children talking and greeting each other, each with a speech bubble, one waving.',
      fr: 'Deux enfants qui se saluent, chacun avec une bulle de dialogue, l’un fait un signe de la main.',
    },
    narration: {
      text: {
        ar: 'بونجور! سالو! كومان تو تابيل؟ جو مابيل لينا. أورفوار!',
        en: 'Bonjour! Salut! Comment tu t’appelles? Je m’appelle Lina. Au revoir!',
        fr: 'Bonjour ! Salut ! Comment tu t’appelles ? Je m’appelle Lina. Au revoir !',
      },
      src: 'media/audio/fr_salutations_fr.mp3',
      language: 'fr',
    },
    displayDurationMs: 8000,
    branding: { palette: 'language', watermark: { ar: 'مس نور', en: 'Miss Noor' } },
    source: {
      origin: 'authored_svg',
      author: 'Miss Noor media pipeline',
      license: 'Project-owned (Apache-2.0)',
      attribution: 'Drawn from the Grade 5 French curriculum (Les salutations).',
    },
    review: { status: 'reviewed', reviewedBy: 'owner-window', notes: 'French phrases match the lesson sourceText; no text baked into the image.' },
  },
  // ── ICT: data protection & backup (off_ict_u2_l1 / c1) ───────────────────
  {
    id: 'ict_data_protection_steps',
    type: 'image',
    kind: 'diagram',
    lessonId: 'off_ict_u2_l1',
    conceptId: 'off_ict_u2_l1_c1',
    subjectId: 'subj_ict',
    reelKind: 'teach_card',
    curriculumRef: 'ICT Ministry Book pp. 27-29',
    src: 'media/ict/data_protection.svg',
    mimeType: 'image/svg+xml',
    width: 960,
    height: 600,
    title: {
      ar: 'خمس خطوات لحماية بياناتك',
      en: 'Five steps to protect your data',
      fr: 'Cinq étapes pour protéger tes données',
    },
    purpose: {
      ar: 'يذكّر الطفل بالطرق الخمس لحماية معلوماته الشخصية: قلّل المشاركة، كلمة مرور قوية، برنامج مكافحة فيروسات، تحديث الأجهزة، والنسخ الاحتياطي.',
      en: 'Reminds the child of the five ways to protect personal data: share less, a strong password, antivirus, updates, and a backup.',
      fr: 'Rappelle les cinq façons de protéger ses données : partager moins, un mot de passe fort, un antivirus, les mises à jour et une sauvegarde.',
    },
    alt: {
      ar: 'درع في المنتصف تحته خمس بطاقات مرقّمة من ١ إلى ٥: مشاركة أقل للمعلومات، مفتاح لكلمة مرور قوية، حشرة عليها خط أحمر لمكافحة الفيروسات، أسهم تحديث دائرية، وقرص صلب عليه سهم نسخ احتياطي.',
      en: 'A shield at the centre above five numbered cards (1-5): sharing less information, a key for a strong password, a bug crossed out for antivirus, circular update arrows, and a drive with a backup arrow.',
      fr: 'Un bouclier au centre au-dessus de cinq cartes numérotées (1-5) : partager moins, une clé pour un mot de passe fort, un insecte barré pour l’antivirus, des flèches de mise à jour et un disque avec une flèche de sauvegarde.',
    },
    legend: [
      { n: 1, text: { ar: 'شاركي قدراً أقل من المعلومات الشخصية', en: 'Share less personal information', fr: 'Partage moins d’informations personnelles' } },
      { n: 2, text: { ar: 'كلمة مرور قوية وفريدة', en: 'A strong, unique password', fr: 'Un mot de passe fort et unique' } },
      { n: 3, text: { ar: 'برنامج مكافحة الفيروسات وتحديثه', en: 'Antivirus, kept updated', fr: 'Un antivirus, mis à jour' } },
      { n: 4, text: { ar: 'تحديث الأجهزة لسدّ الثغرات', en: 'Update devices to close gaps', fr: 'Mettre à jour les appareils' } },
      { n: 5, text: { ar: 'نسخ احتياطي على قرص صلب خارجي', en: 'Back up on an external drive', fr: 'Sauvegarder sur un disque externe' } },
    ],
    hotspots: [
      { n: 1, x: 0.146, y: 0.75 },
      { n: 2, x: 0.339, y: 0.75 },
      { n: 3, x: 0.531, y: 0.75 },
      { n: 4, x: 0.724, y: 0.75 },
      { n: 5, x: 0.917, y: 0.75 },
    ],
    displayDurationMs: 12000,
    branding: { palette: 'noor-core', watermark: { ar: 'مس نور', en: 'Miss Noor' } },
    source: {
      origin: 'authored_svg',
      author: 'Miss Noor media pipeline',
      license: 'Project-owned (Apache-2.0)',
      attribution: 'Drawn from the Egyptian Ministry of Education Grade 5 ICT curriculum, pp. 27-29.',
    },
    review: { status: 'reviewed', reviewedBy: 'owner-window', notes: 'The five steps match the lesson reading text in order.' },
  },

  // ── Arabic: "I can" listening story (off_ar_u1_l1_ana_astatee / c1) ──────
  {
    id: 'ar_i_can_story_scene',
    type: 'image',
    kind: 'illustration',
    lessonId: 'off_ar_u1_l1_ana_astatee',
    conceptId: 'off_ar_u1_l1_c1',
    subjectId: 'subj_arabic',
    reelKind: 'story_analogy',
    curriculumRef: 'Arabic Ministry Book pp. 6-11',
    src: 'media/arabic/i_can_story.svg',
    mimeType: 'image/svg+xml',
    width: 960,
    height: 600,
    title: {
      ar: 'الحصان الذي صعد من الحفرة',
      en: 'The horse that climbed out of the pit',
      fr: 'Le cheval qui sort du trou',
    },
    purpose: {
      ar: 'يمثّل قصة الحصان التي ذكّر بها حسن صديقه آسر: كلما نزل عليه التراب نفضه وصعد خطوة، حتى خرج. الفشل خطوة نحو النجاح.',
      en: 'Depicts the horse story Hassan told Aseer: each load of earth thrown on its back was shaken off as one step up, until it climbed out. Failure is a step toward success.',
      fr: 'Illustre l’histoire du cheval racontée à Aseer : chaque pelletée de terre était secouée comme un pas de plus, jusqu’à sortir. L’échec est un pas vers la réussite.',
    },
    alt: {
      ar: 'حصان يرتفع من حفرة وهو ينفض التراب عن ظهره، وكتل تراب تتساقط حوله، وأسهم خضراء تشير لأعلى على الجانبين، وشمس في السماء.',
      en: 'A horse rising out of a pit, shaking earth off its back, clods of dirt falling around it, green upward arrows on both sides, and a sun in the sky.',
      fr: 'Un cheval qui sort d’un trou en secouant la terre de son dos, des mottes qui tombent autour, des flèches vertes vers le haut et un soleil.',
    },
    displayDurationMs: 9000,
    branding: { palette: 'language', watermark: { ar: 'مس نور', en: 'Miss Noor' } },
    source: {
      origin: 'authored_svg',
      author: 'Miss Noor media pipeline',
      license: 'Project-owned (Apache-2.0)',
      attribution: 'Drawn from the Grade 5 Arabic listening story «أنا أستطيع».',
    },
    review: { status: 'reviewed', reviewedBy: 'owner-window', notes: 'Scene matches the horse-in-the-pit metaphor in the lesson reading text.' },
  },

  // ── Science: coral bleaching (off_sci_u1_l3_coral_bleaching / c1) ────────
  {
    id: 'sci_coral_bleaching_diagram',
    type: 'image',
    kind: 'diagram',
    lessonId: 'off_sci_u1_l3_coral_bleaching',
    conceptId: 'off_sci_u1_l3_c1',
    subjectId: 'subj_science',
    reelKind: 'teach_card',
    curriculumRef: 'Science Ministry Book pp. 34-45',
    src: 'media/science/coral_bleaching.svg',
    mimeType: 'image/svg+xml',
    width: 960,
    height: 600,
    title: {
      ar: 'ابيضاض الشعاب المرجانية',
      en: 'Coral bleaching',
      fr: 'Le blanchissement des coraux',
    },
    purpose: {
      ar: 'يقارن مرجاناً ملوّناً صحياً بمرجان أبيض بعد طرد الطحالب الملونة بسبب سخونة المياه، ويُظهر الكائنات البحرية التي تفقد موطنها.',
      en: 'Contrasts a healthy coloured reef with a white one after the coloured algae are expelled by warm water, showing the marine life that loses its home.',
      fr: 'Compare un récif coloré sain à un récif blanchi après l’expulsion des algues colorées par l’eau chaude, et montre la vie marine qui perd son habitat.',
    },
    alt: {
      ar: 'مشهد بحري: شمس وأشعة دافئة أعلى اليمين، مرجان ملوّن عليه نقاط طحالب خضراء على اليسار، ومرجان أبيض على اليمين تخرج منه نقاط الطحالب، وسمكة صفراء بجانبه. أربعة أرقام من ١ إلى ٤ تشير إلى المياه الدافئة والمرجان الأبيض والطحالب الخارجة والسمكة.',
      en: 'An underwater scene: a sun with warm rays top right, coloured coral with green algae dots on the left, white coral on the right with the algae drifting away, and a yellow fish beside it. Four numbers 1-4 mark the warm water, the white coral, the leaving algae and the fish.',
      fr: 'Une scène sous-marine : un soleil et des rayons chauds en haut à droite, un corail coloré avec des algues vertes à gauche, un corail blanc à droite dont les algues partent, et un poisson jaune. Quatre numéros 1-4 marquent l’eau chaude, le corail blanc, les algues qui partent et le poisson.',
    },
    legend: [
      { n: 1, text: { ar: 'ارتفاع درجة حرارة المياه', en: 'Rising water temperature', fr: 'La hausse de la température de l’eau' } },
      { n: 2, text: { ar: 'المرجان يفقد لونه ويبيضّ', en: 'The reef loses colour and turns white', fr: 'Le récif perd sa couleur et blanchit' } },
      { n: 3, text: { ar: 'طرد الطحالب الملونة التي تغذّيه', en: 'It expels the coloured algae that feed it', fr: 'Il expulse les algues colorées qui le nourrissent' } },
      { n: 4, text: { ar: 'الكائنات البحرية تفقد موطنها', en: 'Marine life loses its home', fr: 'La vie marine perd son habitat' } },
    ],
    hotspots: [
      { n: 1, x: 0.854, y: 0.333 },
      { n: 2, x: 0.729, y: 0.717 },
      { n: 3, x: 0.717, y: 0.5 },
      { n: 4, x: 0.583, y: 0.5 },
    ],
    displayDurationMs: 12000,
    branding: { palette: 'science', watermark: { ar: 'مس نور', en: 'Miss Noor' } },
    source: {
      origin: 'authored_svg',
      author: 'Miss Noor media pipeline',
      license: 'Project-owned (Apache-2.0)',
      attribution: 'Drawn from the Egyptian Ministry of Education Grade 5 Science curriculum, pp. 34-45.',
    },
    review: { status: 'reviewed', reviewedBy: 'owner-window', notes: 'Cause (warm water) and effect (algae expelled, reef white) match the lesson text.' },
  },

  // ── Islamic Studies: conditions & sunnahs of prayer (off_isl_u1_l2 / c1) ──
  {
    id: 'isl_prayer_conditions',
    type: 'image',
    kind: 'diagram',
    lessonId: 'off_isl_u1_l2_prayer_virtues',
    conceptId: 'off_isl_u1_l2_c1',
    subjectId: 'subj_islamic',
    reelKind: 'teach_card',
    curriculumRef: 'Islamic Education Ministry Book pp. 22-30',
    src: 'media/islamic/prayer_conditions.svg',
    mimeType: 'image/svg+xml',
    width: 960,
    height: 600,
    title: {
      ar: 'شروط الصلاة وسننها',
      en: 'Conditions and sunnahs of prayer',
      fr: 'Conditions et sunnas de la prière',
    },
    purpose: {
      ar: 'يميّز بين شروط صحة الصلاة (الوقت، الطهارة، استقبال القبلة) وسنن الصلاة (رفع اليدين، سورة قصيرة بعد الفاتحة، أذكار الركوع والسجود).',
      en: 'Distinguishes the conditions of a valid prayer (its time, purity, facing the qibla) from its sunnahs (raising the hands, a short surah after Al-Fatihah, the remembrances of bowing and prostration).',
      fr: 'Distingue les conditions d’une prière valide (le temps, la pureté, la qibla) des sunnas (lever les mains, une sourate courte après Al-Fatiha, les invocations de l’inclinaison et de la prosternation).',
    },
    alt: {
      ar: 'ست بطاقات مرقّمة من ١ إلى ٦: في الصف الأول ساعة (وقت الصلاة)، وقطرة ماء (الطهارة والوضوء)، والكعبة مع سهم اتجاه (استقبال القبلة)؛ وفي الصف الثاني كفّان مفتوحتان مرفوعتان (رفع اليدين ودعاء الاستفتاح)، وكتاب مفتوح (سورة قصيرة بعد الفاتحة)، وهيئة مصلٍّ راكع (أذكار الركوع والسجود).',
      en: 'Six numbered cards (1-6): the top row is a clock (the prayer time), a water drop (purity and wudu), and the Kaaba with a direction arrow (facing the qibla); the bottom row is two open raised hands (raising the hands and the opening supplication), an open book (a short surah after Al-Fatihah), and a bowing worshipper (the remembrances of bowing and prostration).',
      fr: 'Six cartes numérotées (1-6) : en haut une horloge (le temps de la prière), une goutte d’eau (la pureté et les ablutions) et la Kaaba avec une flèche (l’orientation vers la qibla) ; en bas deux mains ouvertes levées, un livre ouvert et un fidèle incliné.',
    },
    legend: [
      { n: 1, text: { ar: 'دخول وقت الصلاة', en: 'The prayer time has come', fr: 'L’entrée du temps de la prière' } },
      { n: 2, text: { ar: 'الطهارة والوضوء', en: 'Purity and wudu', fr: 'La pureté et les ablutions' } },
      { n: 3, text: { ar: 'استقبال القبلة', en: 'Facing the qibla', fr: 'S’orienter vers la qibla' } },
      { n: 4, text: { ar: 'رفع اليدين ودعاء الاستفتاح', en: 'Raising the hands and the opening supplication', fr: 'Lever les mains et l’invocation d’ouverture' } },
      { n: 5, text: { ar: 'سورة قصيرة بعد الفاتحة', en: 'A short surah after Al-Fatihah', fr: 'Une sourate courte après Al-Fatiha' } },
      { n: 6, text: { ar: 'أذكار الركوع والسجود', en: 'The remembrances of bowing and prostration', fr: 'Les invocations de l’inclinaison et de la prosternation' } },
    ],
    hotspots: [
      { n: 1, x: 0.100, y: 0.410 },
      { n: 2, x: 0.397, y: 0.410 },
      { n: 3, x: 0.694, y: 0.410 },
      { n: 4, x: 0.100, y: 0.727 },
      { n: 5, x: 0.397, y: 0.727 },
      { n: 6, x: 0.694, y: 0.727 },
    ],
    displayDurationMs: 12000,
    branding: { palette: 'noor-core', watermark: { ar: 'مس نور', en: 'Miss Noor' } },
    source: {
      origin: 'authored_svg',
      author: 'Miss Noor media pipeline',
      license: 'Project-owned (Apache-2.0)',
      attribution: 'Drawn from the Egyptian Ministry of Education Grade 5 Islamic Education curriculum, pp. 22-30.',
    },
    review: { status: 'reviewed', reviewedBy: 'owner-window', notes: 'Conditions (1-3) and sunnahs (4-6) match the lesson reading text in order.' },
  },

  // ── Calligraphy: Alif in Naskh & Ruqaa (off_callig_alif / c1) ────────────
  {
    id: 'callig_alif_naskh_ruqaa',
    type: 'image',
    kind: 'diagram',
    lessonId: 'off_callig_alif_naskh_ruqaa',
    conceptId: 'off_callig_alif_c1',
    subjectId: 'subj_calligraphy',
    reelKind: 'teach_card',
    curriculumRef: 'Arabic Calligraphy Workbook pp. 4-6',
    src: 'media/calligraphy/alif_naskh_ruqaa.svg',
    mimeType: 'image/svg+xml',
    width: 960,
    height: 600,
    title: {
      ar: 'حرف الألف في خطي النسخ والرقعة',
      en: 'The letter Alif in Naskh and Ruqaa',
      fr: 'La lettre Alif en Naskh et Rouqaa',
    },
    purpose: {
      ar: 'يقارن رسم الألف في خط النسخ (مستقيم، مقداره خمس نقاط، وفيه حلية الترويس) برسمها في خط الرقعة (أقصر، ثلاث نقاط، ويميل قليلاً بلا حلية)، ويُظهر زاوية القلم ٤٥ درجة.',
      en: 'Compares the Alif of Naskh (straight, five dots tall, with the taroos ornament) with the Alif of Ruqaa (shorter, three dots, gently tilted, no ornament), and shows the pen held at a 45-degree angle.',
      fr: 'Compare l’Alif du Naskh (droit, haut de cinq points, avec l’ornement taroos) à l’Alif du Rouqaa (plus court, trois points, légèrement incliné, sans ornement), et montre le calame à 45 degrés.',
    },
    alt: {
      ar: 'أربع إشارات مرقّمة: لوحة على اليسار لحرف ألف مستقيم طويل بخط النسخ مع حلية صغيرة أعلاه، وبجانبه خمس نقاط لقياس الطول؛ ولوحة على اليمين لحرف ألف أقصر مائل قليلاً بخط الرقعة وبجانبه ثلاث نقاط؛ وأسفل المنتصف قلم مائل بزاوية ٤٥ درجة.',
      en: 'Four numbered callouts: a left panel with a tall, straight Naskh Alif and a small ornament at its top, measured by five dots beside it; a right panel with a shorter, slightly tilted Ruqaa Alif measured by three dots; and a pen tilted at 45 degrees below the centre.',
      fr: 'Quatre repères numérotés : à gauche un Alif de Naskh long et droit avec un petit ornement, mesuré par cinq points ; à droite un Alif de Rouqaa plus court et incliné, mesuré par trois points ; et un calame incliné à 45 degrés sous le centre.',
    },
    legend: [
      { n: 1, text: { ar: 'ألف النسخ: مستقيمة ومقدارها ٥ نقاط', en: 'Naskh Alif: straight and five dots tall', fr: 'Alif Naskh : droit, haut de cinq points' } },
      { n: 2, text: { ar: 'ألف الرقعة: أقصر (٣ نقاط) وتميل قليلاً', en: 'Ruqaa Alif: shorter (three dots) and gently tilted', fr: 'Alif Rouqaa : plus court (trois points) et incliné' } },
      { n: 3, text: { ar: 'حلية الترويس (الزلفة) أعلى ألف النسخ', en: 'The taroos (zulfa) ornament atop the Naskh Alif', fr: 'L’ornement taroos au sommet de l’Alif Naskh' } },
      { n: 4, text: { ar: 'مسكة القلم بزاوية ٤٥ درجة', en: 'The pen held at a 45-degree angle', fr: 'Le calame tenu à 45 degrés' } },
    ],
    hotspots: [
      { n: 1, x: 0.135, y: 0.220 },
      { n: 2, x: 0.583, y: 0.220 },
      { n: 3, x: 0.246, y: 0.173 },
      { n: 4, x: 0.531, y: 0.873 },
    ],
    displayDurationMs: 12000,
    branding: { palette: 'language', watermark: { ar: 'مس نور', en: 'Miss Noor' } },
    source: {
      origin: 'authored_svg',
      author: 'Miss Noor media pipeline',
      license: 'Project-owned (Apache-2.0)',
      attribution: 'Drawn from the Grade 5 Arabic Calligraphy workbook, pp. 4-6.',
    },
    review: { status: 'reviewed', reviewedBy: 'owner-window', notes: 'Dot counts (5 Naskh, 3 Ruqaa) and the pen angle match the lesson reading text.' },
  },

  // ── Maths (French track): decimal place value (off_mathfr_u1_l1 / c1) ────
  {
    id: 'mathfr_place_value_chart',
    type: 'image',
    kind: 'chart',
    lessonId: 'off_mathfr_u1_l1_decimaux',
    conceptId: 'conc_mathfr_u1_l1_position',
    subjectId: 'subj_math_fr',
    reelKind: 'hook_question',
    curriculumRef: 'Al-Adwaa Maths (French) Grade 5 — Unité 1, Leçon 1',
    src: 'media/math/place_value_chart.svg',
    mimeType: 'image/svg+xml',
    width: 960,
    height: 600,
    title: {
      ar: 'جدول القيمة المكانية للعدد ٠٫٠٠٤',
      en: 'Place-value chart for 0.004',
      fr: 'Tableau de numération pour 0,004',
    },
    purpose: {
      ar: 'يُظهر أن مكان الرقم بعد العلامة العشرية هو الذي يحدّد قيمته: الرقم ٤ في الخانة الثالثة يساوي ٤ أجزاء من ألف (٠٫٠٠٤)، وليس ٤ أجزاء من عشرة، وكل خانة أصغر من التي قبلها عشر مرات.',
      en: 'Shows that a digit’s place after the decimal comma decides its value: the 4 in the third place is four thousandths (0.004), not four tenths, and each place is ten times smaller than the one before.',
      fr: 'Montre que la position d’un chiffre après la virgule décide de sa valeur : le 4 à la troisième place vaut quatre millièmes (0,004), et non quatre dixièmes ; chaque rang est dix fois plus petit.',
    },
    alt: {
      ar: 'جدول من أربع خانات: خانة الآحاد فيها ٠، ثم العلامة العشرية، ثم ثلاث خانات بعدها (أجزاء من عشرة، أجزاء من مئة، أجزاء من ألف) فيها ٠ و ٠ و ٤، والرقم ٤ مبرَز في الخانة الثالثة. أسهم تشير إلى أن كل خانة تُقسَم على عشرة.',
      en: 'A four-column chart: the units column holds 0, then the decimal comma, then three columns after it (tenths, hundredths, thousandths) holding 0, 0 and 4, with the 4 highlighted in the third column. Arrows show each place is divided by ten.',
      fr: 'Un tableau à quatre colonnes : les unités (0), la virgule, puis trois colonnes (dixièmes, centièmes, millièmes) avec 0, 0 et 4, le 4 mis en évidence. Des flèches montrent chaque rang divisé par dix.',
    },
    legend: [
      { n: 1, text: { ar: 'العلامة العشرية (الفاصلة)', en: 'The decimal comma', fr: 'La virgule décimale' } },
      { n: 2, text: { ar: 'خانة الأجزاء من عشرة', en: 'The tenths place', fr: 'Le rang des dixièmes' } },
      { n: 3, text: { ar: 'خانة الأجزاء من مئة', en: 'The hundredths place', fr: 'Le rang des centièmes' } },
      { n: 4, text: { ar: 'خانة الأجزاء من ألف: هنا الرقم ٤ = ٠٫٠٠٤', en: 'The thousandths place: here the 4 means 0.004', fr: 'Le rang des millièmes : ici le 4 vaut 0,004' } },
    ],
    hotspots: [
      { n: 1, x: 0.297, y: 0.217 },
      { n: 2, x: 0.401, y: 0.217 },
      { n: 3, x: 0.578, y: 0.217 },
      { n: 4, x: 0.755, y: 0.217 },
    ],
    displayDurationMs: 12000,
    branding: { palette: 'math', watermark: { ar: 'مس نور', en: 'Miss Noor' } },
    source: {
      origin: 'authored_svg',
      author: 'Miss Noor media pipeline',
      license: 'Project-owned (Apache-2.0)',
      attribution: 'Drawn from the Al-Adwaa Grade 5 Maths (French) curriculum, Unité 1, Leçon 1.',
    },
    review: { status: 'reviewed', reviewedBy: 'owner-window', notes: 'The 4 sits in the thousandths place, so its value is 0.004; ranks halve the value tenfold.' },
  },

  // ── Islamic Studies: the Beautiful Names of Allah (off_isl_u1_l1 / c1) ───
  {
    id: 'isl_names_of_allah',
    type: 'image',
    kind: 'concept_map',
    lessonId: 'off_isl_u1_l1_names_of_allah',
    conceptId: 'off_isl_u1_l1_c1',
    subjectId: 'subj_islamic',
    reelKind: 'teach_card',
    curriculumRef: 'Islamic Education Ministry Book pp. 8-15',
    src: 'media/islamic/names_of_allah.svg',
    mimeType: 'image/svg+xml',
    width: 960,
    height: 600,
    title: {
      ar: 'أسماء الله الحسنى ومعانيها',
      en: 'The Beautiful Names of Allah and their meanings',
      fr: 'Les Beaux Noms d’Allah et leurs sens',
    },
    purpose: {
      ar: 'يُبيّن معاني أسماء الله الواردة في أواخر سورة الحشر: القدوس (المنزه عن كل نقص)، السلام (ناشر الأمن)، المهيمن (الرقيب الحافظ)، وأثر ذكرها في طمأنينة القلب.',
      en: 'Shows the meanings of the Names in Surah Al-Hashr: Al-Quddus (free of every flaw), As-Salam (the giver of peace), Al-Muhaymin (the watchful preserver), and how remembering them calms the heart.',
      fr: 'Montre le sens des Noms de la sourate Al-Hashr : Al-Quddus (exempt de tout défaut), As-Salam (source de paix), Al-Muhaymin (le gardien vigilant), et l’apaisement du cœur qui les évoque.',
    },
    alt: {
      ar: 'أربع إشارات مرقّمة: دائرة بها علامة صح (الكمال والتنزيه: القدوس)، وحمامة تحمل غصن زيتون (الأمن والسلام: السلام)، وعين مفتوحة واسعة (الرقيب الحافظ: المهيمن)، وقلب أحمر مضيء في الأسفل (طمأنينة القلب بذكر أسماء الله).',
      en: 'Four numbered callouts: a circle with a tick (perfection: Al-Quddus), a dove carrying an olive branch (peace and safety: As-Salam), a wide open eye (the watchful preserver: Al-Muhaymin), and a glowing red heart below (the heart calmed by remembering the Names).',
      fr: 'Quatre repères numérotés : un cercle avec une coche (la perfection : Al-Quddus), une colombe portant un rameau d’olivier (la paix : As-Salam), un œil grand ouvert (le gardien vigilant : Al-Muhaymin), et un cœur rouge lumineux (le cœur apaisé).',
    },
    legend: [
      { n: 1, text: { ar: 'القدوس: المنزّه المطهّر عن كل عيب ونقص', en: 'Al-Quddus: free of every fault and imperfection', fr: 'Al-Quddus : exempt de tout défaut' } },
      { n: 2, text: { ar: 'السلام: ناشر الأمن والسلام بين عباده', en: 'As-Salam: the giver of safety and peace', fr: 'As-Salam : source de sécurité et de paix' } },
      { n: 3, text: { ar: 'المهيمن: الرقيب الحافظ لكل شيء', en: 'Al-Muhaymin: the watchful preserver of all', fr: 'Al-Muhaymin : le gardien vigilant de tout' } },
      { n: 4, text: { ar: 'ذكر أسماء الله يملأ القلب طمأنينة', en: 'Remembering Allah’s Names fills the heart with calm', fr: 'Évoquer les Noms d’Allah apaise le cœur' } },
    ],
    hotspots: [
      { n: 1, x: 0.108, y: 0.340 },
      { n: 2, x: 0.892, y: 0.340 },
      { n: 3, x: 0.548, y: 0.340 },
      { n: 4, x: 0.438, y: 0.683 },
    ],
    displayDurationMs: 12000,
    branding: { palette: 'noor-core', watermark: { ar: 'مس نور', en: 'Miss Noor' } },
    source: {
      origin: 'authored_svg',
      author: 'Miss Noor media pipeline',
      license: 'Project-owned (Apache-2.0)',
      attribution: 'Drawn from the Egyptian Ministry of Education Grade 5 Islamic Education curriculum, pp. 8-15.',
    },
    review: { status: 'reviewed', reviewedBy: 'owner-window', notes: 'The three Names and the heart-peace idea match the lesson reading text; no text baked into the image.' },
  },

  // ── Social Studies: Egypt’s location & Suez Canal (off_soc_u1_l1 / c1) ──
  {
    id: 'soc_egypt_location',
    type: 'image',
    kind: 'map',
    lessonId: 'off_soc_u1_l1_location',
    conceptId: 'off_soc_u1_l1_c1',
    subjectId: 'subj_social_studies',
    reelKind: 'teach_card',
    curriculumRef: 'Social Studies Ministry Book pp. 10-16',
    src: 'media/social/egypt_location.svg',
    mimeType: 'image/svg+xml',
    width: 960,
    height: 600,
    title: {
      ar: 'موقع مصر وقناة السويس',
      en: 'Egypt’s position and the Suez Canal',
      fr: 'La position de l’Égypte et le canal de Suez',
    },
    purpose: {
      ar: 'يبيّن أن مصر في الركن الشمالي الشرقي من أفريقيا، تحدّها البحر المتوسط شمالاً والبحر الأحمر شرقاً، وأن قناة السويس تربط البحرين، ويمر مدار السرطان بجنوبها.',
      en: 'Shows that Egypt lies in the north-east of Africa, bordered by the Mediterranean to the north and the Red Sea to the east, that the Suez Canal links the two seas, and that the Tropic of Cancer crosses its south.',
      fr: 'Montre que l’Égypte se trouve au nord-est de l’Afrique, bordée par la Méditerranée au nord et la mer Rouge à l’est, que le canal de Suez relie les deux mers, et que le tropique du Cancer traverse le sud.',
    },
    alt: {
      ar: 'خريطة مبسّطة: قارة أفريقيا على اليسار وفيها مصر، والبحر المتوسط أعلى الوسط، والبحر الأحمر قناة مائية مائلة بين أفريقيا وشبه الجزيرة العربية، وقناة السويس خط أصفر قصير يصل المتوسط بالبحر الأحمر، وخط أحمر متقطع يمثل مدار السرطان في جنوب مصر. خمسة أرقام من ١ إلى ٥ تشير إلى أفريقيا والمتوسط والبحر الأحمر وقناة السويس ومدار السرطان.',
      en: 'A simplified map: Africa on the left containing Egypt, the Mediterranean at the top centre, the Red Sea as a diagonal channel between Africa and Arabia, the Suez Canal as a short amber line joining the Mediterranean to the Red Sea, and a dashed red line for the Tropic of Cancer across southern Egypt. Five numbers 1-5 mark Africa, the Mediterranean, the Red Sea, the Suez Canal and the Tropic of Cancer.',
      fr: 'Une carte simplifiée : l’Afrique à gauche avec l’Égypte, la Méditerranée en haut, la mer Rouge en canal diagonal entre l’Afrique et l’Arabie, le canal de Suez en court trait ambré reliant les deux mers, et le tropique du Cancer en pointillés rouges. Cinq numéros 1-5 repèrent l’Afrique, la Méditerranée, la mer Rouge, le canal de Suez et le tropique.',
    },
    legend: [
      { n: 1, text: { ar: 'مصر في الركن الشمالي الشرقي من قارة أفريقيا', en: 'Egypt in the north-east of Africa', fr: 'L’Égypte au nord-est de l’Afrique' } },
      { n: 2, text: { ar: 'البحر المتوسط يحدّ مصر من الشمال', en: 'The Mediterranean borders Egypt to the north', fr: 'La Méditerranée borde l’Égypte au nord' } },
      { n: 3, text: { ar: 'البحر الأحمر يحدّ مصر من الشرق', en: 'The Red Sea borders Egypt to the east', fr: 'La mer Rouge borde l’Égypte à l’est' } },
      { n: 4, text: { ar: 'قناة السويس تربط المتوسط بالبحر الأحمر', en: 'The Suez Canal links the Mediterranean to the Red Sea', fr: 'Le canal de Suez relie la Méditerranée à la mer Rouge' } },
      { n: 5, text: { ar: 'مدار السرطان يمرّ في جنوب مصر', en: 'The Tropic of Cancer crosses southern Egypt', fr: 'Le tropique du Cancer traverse le sud de l’Égypte' } },
    ],
    hotspots: [
      { n: 1, x: 0.250, y: 0.550 },
      { n: 2, x: 0.313, y: 0.310 },
      { n: 3, x: 0.583, y: 0.700 },
      { n: 4, x: 0.508, y: 0.370 },
      { n: 5, x: 0.177, y: 0.717 },
    ],
    displayDurationMs: 12000,
    branding: { palette: 'noor-core', watermark: { ar: 'مس نور', en: 'Miss Noor' } },
    source: {
      origin: 'authored_svg',
      author: 'Miss Noor media pipeline',
      license: 'Project-owned (Apache-2.0)',
      attribution: 'Drawn from the Egyptian Ministry of Education Grade 5 Social Studies curriculum, pp. 10-16.',
    },
    review: { status: 'reviewed', reviewedBy: 'owner-window', notes: 'Continent, the two seas, the canal link and the Tropic of Cancer match the lesson reading text.' },
  },

  // ── Social Studies: landforms of Egypt (off_soc_u1_l2 / c1) ─────────────
  {
    id: 'soc_egypt_landforms',
    type: 'image',
    kind: 'map',
    lessonId: 'off_soc_u1_l2_surface',
    conceptId: 'off_soc_u1_l2_c1',
    subjectId: 'subj_social_studies',
    reelKind: 'teach_card',
    curriculumRef: 'Social Studies Ministry Book pp. 18-26',
    src: 'media/social/egypt_landforms.svg',
    mimeType: 'image/svg+xml',
    width: 960,
    height: 600,
    title: {
      ar: 'وحدات تضاريس مصر الأربع وأعلى قمة',
      en: 'The four landform regions of Egypt and its highest peak',
      fr: 'Les quatre régions de relief de l’Égypte et son plus haut sommet',
    },
    purpose: {
      ar: 'يقسم سطح مصر إلى وحدات: وادي النيل والدلتا (الأخصب)، الصحراء الغربية (الأكبر)، الصحراء الشرقية (جبال ومعادن)، وسيناء، ويشير إلى أعلى قمة جبل سانت كاترين.',
      en: 'Divides Egypt into its regions: the Nile Valley and Delta (the most fertile), the Western Desert (the largest), the Eastern Desert (mountains and minerals), and Sinai, pointing to the highest peak, St. Catherine.',
      fr: 'Divise l’Égypte en régions : la vallée du Nil et le Delta (les plus fertiles), le désert occidental (le plus vaste), le désert oriental (montagnes et minerais) et le Sinaï, avec le plus haut sommet, Sainte-Catherine.',
    },
    alt: {
      ar: 'مشهد تضاريسي: كثبان صحراوية صفراء على اليسار (الصحراء الغربية)، وشريط أخضر ضيق في المنتصف هو وادي النيل والدلتا، وجبال برتقالية على يمينه (الصحراء الشرقية)، وجبل رمادي عالٍ في أقصى اليمين عليه قمة بيضاء (جبل سانت كاترين في سيناء). خمسة أرقام من ١ إلى ٥ تشير إلى هذه الوحدات.',
      en: 'A landscape: golden dunes on the left (Western Desert), a narrow green strip in the middle (the Nile Valley and Delta), orange mountains to its right (Eastern Desert), and a tall grey mountain at the far right with a white peak (St. Catherine in Sinai). Five numbers 1-5 mark these regions.',
      fr: 'Un paysage : des dunes dorées à gauche (désert occidental), une étroite bande verte au centre (vallée du Nil et Delta), des montagnes orange à droite (désert oriental), et une haute montagne grise à l’extrême droite avec un sommet blanc (Sainte-Catherine au Sinaï). Cinq numéros 1-5 repèrent ces régions.',
    },
    legend: [
      { n: 1, text: { ar: 'الصحراء الغربية: أكبر الوحدات وفيها الواحات', en: 'The Western Desert: the largest region, with oases', fr: 'Le désert occidental : la plus vaste région, avec ses oasis' } },
      { n: 2, text: { ar: 'وادي النيل والدلتا: أصغر الوحدات وأخصبها', en: 'The Nile Valley and Delta: the smallest and most fertile', fr: 'La vallée du Nil et le Delta : les plus petits et les plus fertiles' } },
      { n: 3, text: { ar: 'الصحراء الشرقية: جبال وهضاب وغنية بالمعادن', en: 'The Eastern Desert: mountains, plateaus and minerals', fr: 'Le désert oriental : montagnes, plateaux et minerais' } },
      { n: 4, text: { ar: 'شبه جزيرة سيناء: أرض الفيروز', en: 'Sinai: the land of turquoise', fr: 'Le Sinaï : la terre de la turquoise' } },
      { n: 5, text: { ar: 'جبل سانت كاترين: أعلى قمة في مصر', en: 'St. Catherine: the highest peak in Egypt', fr: 'Sainte-Catherine : le plus haut sommet d’Égypte' } },
    ],
    hotspots: [
      { n: 1, x: 0.156, y: 0.700 },
      { n: 2, x: 0.536, y: 0.200 },
      { n: 3, x: 0.729, y: 0.567 },
      { n: 4, x: 0.833, y: 0.750 },
      { n: 5, x: 0.896, y: 0.293 },
    ],
    displayDurationMs: 12000,
    branding: { palette: 'noor-core', watermark: { ar: 'مس نور', en: 'Miss Noor' } },
    source: {
      origin: 'authored_svg',
      author: 'Miss Noor media pipeline',
      license: 'Project-owned (Apache-2.0)',
      attribution: 'Drawn from the Egyptian Ministry of Education Grade 5 Social Studies curriculum, pp. 18-26.',
    },
    review: { status: 'reviewed', reviewedBy: 'owner-window', notes: 'The four regions and St. Catherine as the highest peak match the lesson reading text.' },
  },

  // ── Social Studies: water resources (off_soc_u2_l1 / c1) ────────────────
  {
    id: 'soc_water_resources',
    type: 'image',
    kind: 'diagram',
    lessonId: 'off_soc_u2_l1_water_resources',
    conceptId: 'off_soc_u2_l1_c1',
    subjectId: 'subj_social_studies',
    reelKind: 'teach_card',
    curriculumRef: 'Social Studies Ministry Book pp. 48-56',
    src: 'media/social/water_resources.svg',
    mimeType: 'image/svg+xml',
    width: 960,
    height: 600,
    title: {
      ar: 'موارد المياه في مصر وترشيدها',
      en: 'Egypt’s water resources and their conservation',
      fr: 'Les ressources en eau de l’Égypte et leur conservation',
    },
    purpose: {
      ar: 'يصنّف موارد المياه: العذبة (نهر النيل وبحيرة ناصر، المياه الجوفية، أمطار الشتاء) والمالحة (البحار والبحيرات وما تُستخدم فيه)، ويُظهر جهود الترشيد بتبطين الترع.',
      en: 'Classifies Egypt’s water: fresh (the Nile and Lake Nasser, groundwater, winter rain) and salty (seas and lakes and what they are used for), and shows conservation by lining the canals.',
      fr: 'Classe l’eau d’Égypte : douce (le Nil et le lac Nasser, les nappes phréatiques, la pluie d’hiver) et salée (mers et lacs et leurs usages), et montre la conservation par le revêtement des canaux.',
    },
    alt: {
      ar: 'خمس إشارات مرقّمة: نهر أزرق يتدفق إلى بحيرة (النيل وبحيرة ناصر)، وطبقة مياه جوفية زرقاء تحت رمال صفراء، وسحابة بمطر (أمطار الشتاء)، وسمكة مع ملّاحة (استخدامات المياه المالحة)، وقناة مائية مبطّنة بالطوب (تبطين الترع).',
      en: 'Five numbered callouts: a blue river flowing into a lake (the Nile and Lake Nasser), a blue aquifer under yellow sand (groundwater), a rain cloud (winter rain), a fish with a salt shaker (the uses of salt water), and a brick-lined water channel (canal lining).',
      fr: 'Cinq repères numérotés : un fleuve bleu se jetant dans un lac (le Nil et le lac Nasser), une nappe bleue sous le sable (nappes phréatiques), un nuage de pluie, un poisson avec une salière (usages de l’eau salée), et un canal revêtu de briques.',
    },
    legend: [
      { n: 1, text: { ar: 'نهر النيل وبحيرة ناصر: المصدر الأول للعذوبة والزراعة', en: 'The Nile and Lake Nasser: the main source of fresh water and farming', fr: 'Le Nil et le lac Nasser : la première source d’eau douce' } },
      { n: 2, text: { ar: 'المياه الجوفية العذبة تحت الصحراء', en: 'Fresh groundwater beneath the desert', fr: 'Les nappes d’eau douce sous le désert' } },
      { n: 3, text: { ar: 'أمطار الشتاء على الساحل الشمالي', en: 'Winter rain on the northern coast', fr: 'La pluie d’hiver sur la côte nord' } },
      { n: 4, text: { ar: 'المياه المالحة: صيد الأسماك واستخراج الملح والغاز', en: 'Salt water: fishing, salt extraction and gas', fr: 'L’eau salée : pêche, sel et gaz' } },
      { n: 5, text: { ar: 'تبطين الترع لتقليل الفاقد من المياه', en: 'Lining the canals to cut water loss', fr: 'Revêtir les canaux pour réduire les pertes' } },
    ],
    hotspots: [
      { n: 1, x: 0.240, y: 0.250 },
      { n: 2, x: 0.219, y: 0.667 },
      { n: 3, x: 0.708, y: 0.067 },
      { n: 4, x: 0.792, y: 0.717 },
      { n: 5, x: 0.438, y: 0.717 },
    ],
    displayDurationMs: 12000,
    branding: { palette: 'noor-core', watermark: { ar: 'مس نور', en: 'Miss Noor' } },
    source: {
      origin: 'authored_svg',
      author: 'Miss Noor media pipeline',
      license: 'Project-owned (Apache-2.0)',
      attribution: 'Drawn from the Egyptian Ministry of Education Grade 5 Social Studies curriculum, pp. 48-56.',
    },
    review: { status: 'reviewed', reviewedBy: 'owner-window', notes: 'Fresh vs salt water, the Nile as the main source, and canal lining match the lesson reading text.' },
  },

  // ── Arabic: the Nile reading text (off_ar_u1_l2 / c1) ────────────────────
  {
    id: 'ar_nile_lifeline',
    type: 'image',
    kind: 'illustration',
    lessonId: 'off_ar_u1_l2',
    conceptId: 'off_ar_u1_l2_c1',
    subjectId: 'subj_arabic',
    reelKind: 'teach_card',
    curriculumRef: 'Arabic Ministry Book pp. 12-15',
    src: 'media/arabic/nile_lifeline.svg',
    mimeType: 'image/svg+xml',
    width: 960,
    height: 600,
    title: {
      ar: 'النيل شريان الحياة وواجب الترشيد',
      en: 'The Nile, Egypt’s lifeline, and the duty to conserve it',
      fr: 'Le Nil, artère de la vie, et le devoir de l’économiser',
    },
    purpose: {
      ar: 'يبيّن أن نهر النيل شريان حياة مصر، وأن قدماء المصريين أقسموا ألا يلوّثوه، وأن الحفاظ عليه اليوم واجب وطني بالأرقام.',
      en: 'Shows that the Nile is Egypt’s lifeline, that the ancient Egyptians swore never to pollute it, and that keeping it clean is a national duty today, named by number.',
      fr: 'Montre que le Nil est l’artère de la vie en Égypte, que les anciens Égyptiens juraient de ne pas le polluer, et que le préserver est un devoir national aujourd’hui.',
    },
    alt: {
      ar: 'رسم: نهر أزرق يعبر صحراء صفراء وعليه شريط زراعة أخضر ونخيل، وبردية قديمة مرفوعة مرقّمة ٢، وصنبور مغلق مرقّم ٤، وبرميل مخلفات مشطوب بالأحمر مرقّم ٥. خمسة أرقام من ١ إلى ٥ تشير إلى النهر والشريان الزراعي والبردية والصنبور المغلق ومنع التلوث.',
      en: 'A drawing: a blue river crossing a yellow desert with a green farm strip and palms, a raised papyrus scroll labelled 2, a closed tap labelled 4, and a red-crossed waste barrel labelled 5. Five numbers 1-5 mark the river artery, the farmland, the ancient scroll, the closed tap and the ban on pollution.',
      fr: 'Un dessin : un fleuve bleu traversant un désert jaune avec une bande cultivée verte et des palmiers, un papyrus levé (2), un robinet fermé (4) et un tonneau de déchets barré de rouge (5). Cinq numéros 1-5 repèrent le fleuve, la zone cultivée, le papyrus, le robinet fermé et l’interdiction de polluer.',
    },
    legend: [
      { n: 1, text: { ar: 'نهر النيل: شريان الحياة ومصدر الخير في مصر', en: 'The Nile: Egypt’s artery of life and source of good', fr: 'Le Nil : artère de la vie et source de bien en Égypte' } },
      { n: 2, text: { ar: 'قسم المصري القديم: «لم أوت ماء النهر» أي لم أدنّسه', en: 'The ancient oath: “I have not polluted the river water”', fr: 'Le serment ancien : « je n’ai pas pollué l’eau du fleuve »' } },
      { n: 3, text: { ar: 'الأرض الزراعية على ضفافه: منبع الغذاء والحضارة', en: 'The farmland on its banks: the source of food and civilisation', fr: 'Les terres cultivées sur ses rives : source de nourriture et de civilisation' } },
      { n: 4, text: { ar: 'ترشيد الاستهلاك: غلق الصنبور وعدم الإسراف في الماء', en: 'Conserving water: closing the tap and never wasting it', fr: 'Économiser l’eau : fermer le robinet et ne pas la gaspiller' } },
      { n: 5, text: { ar: 'منع إلقاء المخلفات: لا تلويث لمجرى النيل', en: 'No dumping waste: never pollute the river’s course', fr: 'Interdiction de jeter des déchets : ne pas polluer le fleuve' } },
    ],
    hotspots: [
      { n: 1, x: 0.240, y: 0.833 },
      { n: 2, x: 0.375, y: 0.133 },
      { n: 3, x: 0.344, y: 0.783 },
      { n: 4, x: 0.854, y: 0.308 },
      { n: 5, x: 0.673, y: 0.833 },
    ],
    displayDurationMs: 12000,
    branding: { palette: 'language', watermark: { ar: 'مس نور', en: 'Miss Noor' } },
    source: {
      origin: 'authored_svg',
      author: 'Miss Noor media pipeline',
      license: 'Project-owned (Apache-2.0)',
      attribution: 'Drawn from the Egyptian Ministry of Education Grade 5 Arabic curriculum (تواصل), pp. 12-15.',
    },
    review: { status: 'reviewed', reviewedBy: 'owner-window', notes: 'The river artery, the ancient oath, the farmland, conservation and the pollution ban match the lesson reading text.' },
  },

  // ── Arabic grammar: the nominal sentence (off_ar_u1_l3 / c1) ─────────────
  {
    id: 'ar_nominal_sentence',
    type: 'image',
    kind: 'concept_map',
    lessonId: 'off_ar_u1_l3_grammar_nominal',
    conceptId: 'off_ar_u1_l3_c1',
    subjectId: 'subj_arabic',
    reelKind: 'teach_card',
    curriculumRef: 'Arabic Ministry Book pp. 24-28',
    src: 'media/arabic/nominal_sentence.svg',
    mimeType: 'image/svg+xml',
    width: 960,
    height: 600,
    title: {
      ar: 'أركان الجملة الاسمية وعلامات الرفع',
      en: 'The nominal sentence and its case endings',
      fr: 'La phrase nominale et ses désinences',
    },
    purpose: {
      ar: 'يوضح أن الجملة الاسمية ركنان (المبتدأ والخبر)، وأنهما مرفوعان دائماً بالضمة أو الألف أو الواو.',
      en: 'Shows that the nominal sentence has two elements (subject and predicate), always in the nominative case, marked by ḍamma, alif or waw.',
      fr: 'Montre que la phrase nominale a deux éléments (sujet et prédicat), toujours au nominatif, marqués par ḍamma, alif ou waw.',
    },
    alt: {
      ar: 'مخطط: مستطيل بنفسجي للمبتدأ مرقّم ١ ومستطيل أخضر للخبر مرقّم ٢ بينهما قضيب برتقالي، وأسفله ثلاث علامات للرفع: ضمة مرقّمة ٣، وألف قائمة مرقّمة ٤، وواو مرقّمة ٥.',
      en: 'A diagram: a violet block for the subject (1) and a green block for the predicate (2) joined by an amber bar, above three nominative marks: a ḍamma (3), a tall alif (4) and a waw hook (5).',
      fr: 'Un schéma : un bloc violet pour le sujet (1) et un bloc vert pour le prédicat (2) reliés par une barre ambrée, au-dessus de trois marques du nominatif : une ḍamma (3), un alif (4) et un waw (5).',
    },
    legend: [
      { n: 1, text: { ar: 'المبتدأ: الاسم الذي نبدأ به الجملة وتدور حوله الفكرة', en: 'The subject (mubtada’): the name the sentence begins with', fr: 'Le sujet (mubtada’) : le nom par lequel commence la phrase' } },
      { n: 2, text: { ar: 'الخبر: الذي يتمم المعنى مع المبتدأ', en: 'The predicate (khabar): it completes the meaning with the subject', fr: 'Le prédicat (khabar) : il complète le sens avec le sujet' } },
      { n: 3, text: { ar: 'الضمة: علامة الرفع للمفرد وجمع التكسير وجمع المؤنث السالم', en: 'Ḍamma: the nominative mark for the singular and broken/plural feminine nouns', fr: 'Ḍamma : marque du nominatif du singulier et de certains pluriels' } },
      { n: 4, text: { ar: 'الألف: علامة رفع المثنى', en: 'Alif: the nominative mark for the dual', fr: 'Alif : marque du nominatif du duel' } },
      { n: 5, text: { ar: 'الواو: علامة رفع جمع المذكر السالم', en: 'Waw: the nominative mark for the sound masculine plural', fr: 'Waw : marque du nominatif du pluriel masculin régulier' } },
    ],
    hotspots: [
      { n: 1, x: 0.208, y: 0.283 },
      { n: 2, x: 0.625, y: 0.283 },
      { n: 3, x: 0.156, y: 0.700 },
      { n: 4, x: 0.417, y: 0.700 },
      { n: 5, x: 0.677, y: 0.700 },
    ],
    displayDurationMs: 12000,
    branding: { palette: 'language', watermark: { ar: 'مس نور', en: 'Miss Noor' } },
    source: {
      origin: 'authored_svg',
      author: 'Miss Noor media pipeline',
      license: 'Project-owned (Apache-2.0)',
      attribution: 'Drawn from the Egyptian Ministry of Education Grade 5 Arabic grammar curriculum (تواصل), pp. 24-28.',
    },
    review: { status: 'reviewed', reviewedBy: 'owner-window', notes: 'The two elements and the three nominative marks (ḍamma, alif, waw) match the lesson grammar text.' },
  },

  // ── Arabic: true beauty (off_ar_u2_l1 / c1) ──────────────────────────────
  {
    id: 'ar_true_beauty',
    type: 'image',
    kind: 'concept_map',
    lessonId: 'off_ar_u2_l1_real_beauty',
    conceptId: 'off_ar_u2_l1_c1',
    subjectId: 'subj_arabic',
    reelKind: 'teach_card',
    curriculumRef: 'Arabic Ministry Book pp. 34-40',
    src: 'media/arabic/true_beauty.svg',
    mimeType: 'image/svg+xml',
    width: 960,
    height: 600,
    title: {
      ar: 'الجمال الحقيقي: الجوهر أهم من المظهر',
      en: 'True beauty: the essence matters more than the look',
      fr: 'La vraie beauté : l’essentiel compte plus que l’apparence',
    },
    purpose: {
      ar: 'يشبّه الجمال بجبل الجليد: قمة صغيرة ظاهرة هي المظهر، وكتلة كبيرة غارقة هي الجمال الداخلي: الروح والأخلاق والعقل.',
      en: 'Compares beauty to an iceberg: a small visible tip is appearance, a large submerged mass is inner beauty — spirit, morals and mind.',
      fr: 'Compare la beauté à un iceberg : une petite pointe visible est l’apparence, une grande masse immergée est la beauté intérieure — esprit, morale et raison.',
    },
    alt: {
      ar: 'رسم جبل جليد: قمة صغيرة فوق سطح الماء مرقّمة ١ تمثل المظهر، وكتلة كبيرة تحت الماء فيها وجه مبتسم مرقّم ٢ يمثل جمال الروح، وقلب مرقّم ٣ يمثل جمال الأخلاق، وكتاب مفتوح مرقّم ٤ يمثل جمال العقل.',
      en: 'An iceberg: a small tip above the water (1) for outer appearance, and a large submerged mass holding a smiling face (2) for beauty of spirit, a heart (3) for beauty of morals and an open book (4) for beauty of the mind.',
      fr: 'Un iceberg : une petite pointe visible (1) pour l’apparence, et une grande masse immergée avec un visage souriant (2) pour la beauté de l’esprit, un cœur (3) pour la beauté morale et un livre ouvert (4) pour la beauté de la raison.',
    },
    legend: [
      { n: 1, text: { ar: 'المظهر الخارجي: قمة صغيرة تتغيّر بمرور السنين', en: 'Outer appearance: a small tip that changes over the years', fr: 'L’apparence : une petite pointe qui change avec les années' } },
      { n: 2, text: { ar: 'جمال الروح: الابتسامة الصادقة والطمأنينة', en: 'Beauty of the spirit: a sincere smile and calm', fr: 'La beauté de l’esprit : un sourire sincère et la sérénité' } },
      { n: 3, text: { ar: 'جمال الأخلاق: الصدق والأمانة ومساعدة المحتاج', en: 'Beauty of morals: honesty, trust and helping those in need', fr: 'La beauté morale : honnêteté, loyauté et aide aux nécessiteux' } },
      { n: 4, text: { ar: 'جمال العقل: التفكير الحكيم وحب القراءة والتعلم', en: 'Beauty of the mind: wise thinking and a love of reading and learning', fr: 'La beauté de la raison : réflexion sage et amour de la lecture' } },
    ],
    hotspots: [
      { n: 1, x: 0.500, y: 0.117 },
      { n: 2, x: 0.344, y: 0.450 },
      { n: 3, x: 0.646, y: 0.420 },
      { n: 4, x: 0.490, y: 0.883 },
    ],
    displayDurationMs: 12000,
    branding: { palette: 'language', watermark: { ar: 'مس نور', en: 'Miss Noor' } },
    source: {
      origin: 'authored_svg',
      author: 'Miss Noor media pipeline',
      license: 'Project-owned (Apache-2.0)',
      attribution: 'Drawn from the Egyptian Ministry of Education Grade 5 Arabic curriculum (تواصل), pp. 34-40.',
    },
    review: { status: 'reviewed', reviewedBy: 'owner-window', notes: 'The iceberg tip (appearance) vs the submerged mass (spirit, morals, mind) matches the lesson reading text.' },
  },

  // ── Arabic: Dr. Magdi Yacoub (off_ar_u3_l1 / c1) ─────────────────────────
  {
    id: 'ar_service_to_home',
    type: 'image',
    kind: 'illustration',
    lessonId: 'off_ar_u3_l1_dr_magdi_yacoub',
    conceptId: 'off_ar_u3_l1_c1',
    subjectId: 'subj_arabic',
    reelKind: 'teach_card',
    curriculumRef: 'Arabic Ministry Book pp. 52-58',
    src: 'media/arabic/service_to_home.svg',
    mimeType: 'image/svg+xml',
    width: 960,
    height: 600,
    title: {
      ar: 'رد الجميل للوطن وخدمة الإنسانية',
      en: 'Giving back to the homeland, serving humanity',
      fr: 'Rendre à sa patrie, servir l’humanité',
    },
    purpose: {
      ar: 'يوضح مسيرة د. مجدي يعقوب: جراح القلب، ثم عودته إلى مصر وتأسيسه مركز أسوان، وتقديمه العلاج المجاني للأطفال.',
      en: 'Shows Dr. Magdi Yacoub’s path: a heart surgeon who returned to Egypt, founded the Aswan centre, and offers free care to children.',
      fr: 'Montre le parcours du Dr Magdi Yacoub : chirurgien cardiaque revenu en Égypte, fondateur du centre d’Assouan, soignant les enfants gratuitement.',
    },
    alt: {
      ar: 'رسم: قلب كبير مرقّم ١ في الأعلى، ومستشفى بقبة مرقّم ٢ على اليسار، وسهم منحني عائد مرقّم ٣ يمثل العودة إلى الوطن، ويد مفتوحة تقدم قلباً مرقّمة ٤ تمثل العلاج المجاني للأطفال.',
      en: 'A drawing: a large heart (1), a domed hospital (2) on the left, a curved returning arrow (3) for the journey home, and an open hand offering a heart (4) for free care to children.',
      fr: 'Un dessin : un grand cœur (1), un hôpital à dôme (2) à gauche, une flèche courbe de retour (3) pour le retour au pays, et une main ouverte offrant un cœur (4) pour les soins gratuits aux enfants.',
    },
    legend: [
      { n: 1, text: { ar: 'جراحة القلب: رسالة د. مجدي يعقوب لإنقاذ الأرواح', en: 'Cardiac surgery: Dr. Yacoub’s calling to save lives', fr: 'La chirurgie cardiaque : la vocation du Dr Yacoub' } },
      { n: 2, text: { ar: 'مركز أسوان لجراحة القلب: أسسه بعد عودته لمصر', en: 'The Aswan Heart Centre: he founded it after returning to Egypt', fr: 'Le centre cardiaque d’Assouan : fondé après son retour en Égypte' } },
      { n: 3, text: { ar: 'العودة للوطن: النجاح في الخارج دافع لخدمة مصر', en: 'Returning home: success abroad drives service to Egypt', fr: 'Le retour au pays : la réussite à l’étranger au service de l’Égypte' } },
      { n: 4, text: { ar: 'العلاج المجاني: رد الجميل بمساعدة الأطفال والفقراء', en: 'Free treatment: giving back by helping children and the poor', fr: 'Les soins gratuits : aider les enfants et les pauvres' } },
    ],
    hotspots: [
      { n: 1, x: 0.500, y: 0.100 },
      { n: 2, x: 0.115, y: 0.783 },
      { n: 3, x: 0.887, y: 0.420 },
      { n: 4, x: 0.715, y: 0.783 },
    ],
    displayDurationMs: 12000,
    branding: { palette: 'language', watermark: { ar: 'مس نور', en: 'Miss Noor' } },
    source: {
      origin: 'authored_svg',
      author: 'Miss Noor media pipeline',
      license: 'Project-owned (Apache-2.0)',
      attribution: 'Drawn from the Egyptian Ministry of Education Grade 5 Arabic curriculum (تواصل), pp. 52-58.',
    },
    review: { status: 'reviewed', reviewedBy: 'owner-window', notes: 'The surgeon’s heart, the Aswan centre, the return home and free care match the lesson listening text.' },
  },

  // ── Science: the solar energy cycle (off_sci_u1_l2 / c1) ─────────────────
  {
    id: 'sci_energy_cycle',
    type: 'image',
    kind: 'concept_map',
    lessonId: 'off_sci_u1_l2_ecosystem',
    conceptId: 'off_sci_u1_l2_c1',
    subjectId: 'subj_science',
    reelKind: 'teach_card',
    curriculumRef: 'Science Ministry Book pp. 24-30',
    src: 'media/science/energy_cycle.svg',
    mimeType: 'image/svg+xml',
    width: 960,
    height: 600,
    title: {
      ar: 'دورة الطاقة من الشمس إلى التربة',
      en: 'The energy cycle, from the sun back to the soil',
      fr: 'Le cycle de l’énergie, du soleil au sol',
    },
    purpose: {
      ar: 'يوضح أن الطاقة لا تفنى بل تنتقل: من الشمس إلى النبات المنتج، ثم إلى الحيوان العاشب، ثم إلى المفترس، ثم تعيد المحللات المغذيات إلى التربة لتبدأ الدورة من جديد.',
      en: 'Shows that energy is never destroyed, only transferred: from the sun to the plant producer, to the herbivore, to the carnivore, and the decomposers return nutrients to the soil to start again.',
      fr: 'Montre que l’énergie ne disparaît pas, elle se transfère : du soleil à la plante productrice, à l’herbivore, au carnivore, et les décomposeurs rendent les nutriments au sol.',
    },
    alt: {
      ar: 'رسم: شمس مرقّمة ١ في الأعلى، ونبات أخضر مرقّم ٢ يصنع غذاءه، وحلزون مرقّم ٣ يأكل النبات، وطائر مرقّم ٤ يأكل الحلزون، وفطر وبكتيريا مرقّمان ٥ في التربة، وسهم منحن مرقّم ٦ يعيد المغذيات إلى التربة.',
      en: 'A drawing: a sun labelled 1, a green plant labelled 2 that makes its own food, a snail labelled 3 that eats the plant, a bird labelled 4 that eats the snail, a fungus and bacteria labelled 5 in the soil, and a curved arrow labelled 6 returning nutrients to the soil.',
      fr: 'Un dessin : un soleil (1), une plante verte (2) qui fabrique sa nourriture, un escargot (3) qui mange la plante, un oiseau (4) qui mange l’escargot, un champignon et des bactéries (5) dans le sol, et une flèche courbe (6) qui ramène les nutriments au sol.',
    },
    legend: [
      { n: 1, text: { ar: 'الشمس: مصدر الطاقة الأول لكل الكائنات', en: 'The sun: the primary energy source for all life', fr: 'Le soleil : source première d’énergie de toute vie' } },
      { n: 2, text: { ar: 'الكائن المنتج: النبات الأخضر يصنع غذاءه بنفسه', en: 'The producer: the green plant makes its own food', fr: 'Le producteur : la plante verte fabrique sa nourriture' } },
      { n: 3, text: { ar: 'الكائن المستهلك العاشب: يتغذى على النبات', en: 'The herbivore consumer: it feeds on the plant', fr: 'Le consommateur herbivore : il se nourrit de la plante' } },
      { n: 4, text: { ar: 'الكائن المستهلك اللاحم: يتغذى على العاشب', en: 'The carnivore consumer: it feeds on the herbivore', fr: 'Le consommateur carnivore : il se nourrit de l’herbivore' } },
      { n: 5, text: { ar: 'المحللات: الفطريات والبكتيريا تفكك البقايا', en: 'The decomposers: fungi and bacteria break down remains', fr: 'Les décomposeurs : champignons et bactéries décomposent les restes' } },
      { n: 6, text: { ar: 'المغذيات تعود إلى التربة فتبدأ الدورة من جديد', en: 'Nutrients return to the soil and the cycle begins again', fr: 'Les nutriments retournent au sol et le cycle recommence' } },
    ],
    hotspots: [
      { n: 1, x: 0.125, y: 0.183 },
      { n: 2, x: 0.312, y: 0.500 },
      { n: 3, x: 0.490, y: 0.633 },
      { n: 4, x: 0.719, y: 0.500 },
      { n: 5, x: 0.448, y: 0.783 },
      { n: 6, x: 0.156, y: 0.867 },
    ],
    displayDurationMs: 12000,
    branding: { palette: 'science', watermark: { ar: 'مس نور', en: 'Miss Noor' } },
    source: {
      origin: 'authored_svg',
      author: 'Miss Noor media pipeline',
      license: 'Project-owned (Apache-2.0)',
      attribution: 'Drawn from the Egyptian Ministry of Education Grade 5 Science curriculum, pp. 24-30.',
    },
    review: { status: 'reviewed', reviewedBy: 'owner-window', notes: 'The relay from sun to producer to herbivore to carnivore to decomposers matches the lesson reading text.' },
  },

  // ── ICT: computer accessories and their functions (off_ict_u1_l1 / c1) ───
  {
    id: 'ict_computer_accessories',
    type: 'image',
    kind: 'diagram',
    lessonId: 'off_ict_u1_l1',
    conceptId: 'off_ict_u1_l1_c1',
    subjectId: 'subj_ict',
    reelKind: 'teach_card',
    curriculumRef: 'ICT Ministry Book pp. 8-10',
    src: 'media/ict/computer_accessories.svg',
    mimeType: 'image/svg+xml',
    width: 960,
    height: 600,
    title: {
      ar: 'ملحقات الحاسب الآلي ووظيفة كل منها',
      en: 'Computer accessories and what each one does',
      fr: 'Les accessoires de l’ordinateur et leur rôle',
    },
    purpose: {
      ar: 'يسمّي ملحقات الحاسب بالأرقام: الراوتر للاتصال بالإنترنت، وكابل الإيثرنت لاتصال أكثر استقراراً، والفلاش ميموري لنقل البيانات، وكابل HDMI لنقل الصوت والصورة، والقرص الصلب الخارجي للنسخ الاحتياطي.',
      en: 'Names the computer accessories by number: the router for internet access, the Ethernet cable for a steadier connection, flash memory for moving data, the HDMI cable for sound and picture, and the external hard drive for backup.',
      fr: 'Nomme les accessoires par numéro : le routeur, le câble Ethernet, la clé USB, le câble HDMI et le disque dur externe pour la sauvegarde.',
    },
    alt: {
      ar: 'رسم: لابتوب في المنتصف، وراوتر بموجات واي فاي مرقّم ١ أعلى اليسار، وكابل إيثرنت أصفر مرقّم ٢ يساراً، وفلاش ميموري حمراء مرقّمة ٣ أعلى اليمين، وكابل HDMI بنفسجي مرقّم ٤ يميناً، وقرص صلب خارجي مرقّم ٥ أسفل.',
      en: 'A drawing: a laptop in the middle, a router with wi-fi waves labelled 1 top left, a yellow Ethernet cable labelled 2 on the left, a red flash drive labelled 3 top right, a purple HDMI cable labelled 4 on the right, and an external hard drive labelled 5 at the bottom.',
      fr: 'Un dessin : un portable au centre, un routeur (1) en haut à gauche, un câble Ethernet jaune (2), une clé USB rouge (3), un câble HDMI violet (4) et un disque dur externe (5).',
    },
    legend: [
      { n: 1, text: { ar: 'الراوتر: يوزّع الإنترنت لاسلكياً على الأجهزة', en: 'The router: it shares the internet wirelessly', fr: 'Le routeur : il partage Internet sans fil' } },
      { n: 2, text: { ar: 'كابل الإيثرنت: اتصال أكثر سرعة واستقراراً من الواي فاي', en: 'The Ethernet cable: faster and steadier than wi-fi', fr: 'Le câble Ethernet : plus rapide et plus stable que le wi-fi' } },
      { n: 3, text: { ar: 'الفلاش ميموري: لنقل البيانات وحفظها بحجم صغير', en: 'Flash memory: moving and storing data in a small device', fr: 'La clé USB : transférer et stocker des données' } },
      { n: 4, text: { ar: 'كابل HDMI: ينقل الصوت والصورة معاً بدقة عالية', en: 'The HDMI cable: carries sound and picture together in high quality', fr: 'Le câble HDMI : transporte le son et l’image en haute qualité' } },
      { n: 5, text: { ar: 'القرص الصلب الخارجي: مساحة إضافية للنسخ الاحتياطي', en: 'The external hard drive: extra space for backup', fr: 'Le disque dur externe : de l’espace pour la sauvegarde' } },
    ],
    hotspots: [
      { n: 1, x: 0.146, y: 0.400 },
      { n: 2, x: 0.156, y: 0.633 },
      { n: 3, x: 0.854, y: 0.400 },
      { n: 4, x: 0.854, y: 0.600 },
      { n: 5, x: 0.500, y: 0.883 },
    ],
    displayDurationMs: 12000,
    branding: { palette: 'noor-core', watermark: { ar: 'مس نور', en: 'Miss Noor' } },
    source: {
      origin: 'authored_svg',
      author: 'Miss Noor media pipeline',
      license: 'Project-owned (Apache-2.0)',
      attribution: 'Drawn from the Egyptian Ministry of Education Grade 5 ICT curriculum, pp. 8-10.',
    },
    review: { status: 'reviewed', reviewedBy: 'owner-window', notes: 'Router, Ethernet, flash memory, HDMI and the external backup drive match the lesson reading text.' },
  },

  // ── Maths: place-value shift with 10 (off_math_u1_l2 / c1) ───────────────
  {
    id: 'math_place_value_shift',
    type: 'image',
    kind: 'diagram',
    lessonId: 'off_math_u1_l2',
    conceptId: 'off_math_u1_l2_c1',
    subjectId: 'subj_math',
    reelKind: 'teach_card',
    curriculumRef: 'Maths Ministry Book pp. 16-20',
    src: 'media/math/place_value_shift.svg',
    mimeType: 'image/svg+xml',
    width: 960,
    height: 600,
    title: {
      ar: 'تأثير الضرب في 10 على منزلة الرقم',
      en: 'How multiplying by 10 moves a digit’s place',
      fr: 'L’effet de la multiplication par 10 sur la position d’un chiffre',
    },
    purpose: {
      ar: 'يوضح أن الضرب في 10 يحرّك كل رقم خانة واحدة إلى اليسار فيكبر العدد (6,5 تصبح 65)، وأن القسمة على 10 تحرّكه خانة إلى اليمين فيصغر العدد.',
      en: 'Shows that multiplying by 10 moves every digit one place left and makes the number bigger (6,5 becomes 65), while dividing by 10 moves it one place right and makes it smaller.',
      fr: 'Montre que multiplier par 10 déplace chaque chiffre d’une place vers la gauche (6,5 devient 65), et diviser par 10 le déplace vers la droite.',
    },
    alt: {
      ar: 'مخطط: العدد 6,5 في الأعلى فيه رقم 6 مرقّم ٢ في خانة الآحاد ورقم 5 مرقّم ٣ في خانة الأجزاء من عشرة، وسهم أزرق مرقّم ٤ مكتوب عليه ×10 ينزل إلى الناتج 65,0، وسهم برتقالي مرقّم ٥ مكتوب عليه ÷10 يعود للأعلى، والعدد كله مرقّم ١.',
      en: 'A diagram: the number 6,5 at the top with the digit 6 labelled 2 in the units place and the digit 5 labelled 3 in the tenths place; a blue arrow labelled 4 marked ×10 leads down to 65,0; an amber arrow labelled 5 marked ÷10 leads back up; the whole number is labelled 1.',
      fr: 'Un schéma : le nombre 6,5 en haut (chiffre 6 en unités (2), chiffre 5 en dixièmes (3)) ; une flèche bleue ×10 (4) descend vers 65,0 ; une flèche orange ÷10 (5) remonte ; le nombre entier est (1).',
    },
    legend: [
      { n: 1, text: { ar: 'العدد قبل الضرب: 6,5', en: 'The number before multiplying: 6,5', fr: 'Le nombre avant la multiplication : 6,5' } },
      { n: 2, text: { ar: 'رقم الآحاد: 6', en: 'The units digit: 6', fr: 'Le chiffre des unités : 6' } },
      { n: 3, text: { ar: 'رقم الأجزاء من عشرة: 5', en: 'The tenths digit: 5', fr: 'Le chiffre des dixièmes : 5' } },
      { n: 4, text: { ar: 'الضرب في 10: تحرّك الفاصلة خانة لليمين فيكبر العدد', en: 'Multiplying by 10: the comma moves one place right and the number grows', fr: 'Multiplier par 10 : la virgule se décale à droite, le nombre grandit' } },
      { n: 5, text: { ar: 'القسمة على 10: تحرّك الفاصلة خانة لليسار فيصغر العدد', en: 'Dividing by 10: the comma moves one place left and the number shrinks', fr: 'Diviser par 10 : la virgule se décale à gauche, le nombre diminue' } },
    ],
    hotspots: [
      { n: 1, x: 0.125, y: 0.333 },
      { n: 2, x: 0.375, y: 0.117 },
      { n: 3, x: 0.542, y: 0.117 },
      { n: 4, x: 0.312, y: 0.633 },
      { n: 5, x: 0.833, y: 0.500 },
    ],
    displayDurationMs: 12000,
    branding: { palette: 'math', watermark: { ar: 'مس نور', en: 'Miss Noor' } },
    source: {
      origin: 'authored_svg',
      author: 'Miss Noor media pipeline',
      license: 'Project-owned (Apache-2.0)',
      attribution: 'Drawn from the Egyptian Ministry of Education Grade 5 Maths curriculum, pp. 16-20.',
    },
    review: { status: 'reviewed', reviewedBy: 'owner-window', notes: 'The 6,5 → 65 shift under ×10 and the ÷10 return match the lesson key points.' },
  },

  // ── Maths: equation vs expression and the variable (off_math_u2_l1 / c1) ─
  {
    id: 'math_equation_scale',
    type: 'image',
    kind: 'concept_map',
    lessonId: 'off_math_u2_l1',
    conceptId: 'off_math_u2_l1_c1',
    subjectId: 'subj_math',
    reelKind: 'teach_card',
    curriculumRef: 'Maths Ministry Book pp. 42-48',
    src: 'media/math/equation_scale.svg',
    mimeType: 'image/svg+xml',
    width: 960,
    height: 600,
    title: {
      ar: 'المعادلة ميزان: الفرق بين المعادلة والتعبير والمتغير',
      en: 'An equation is a balance: equation, expression and variable',
      fr: 'Une équation est une balance : équation, expression et variable',
    },
    purpose: {
      ar: 'يوضح أن المعادلة كالميزان المتوازن حول علامة (=)، وأن التعبير جملة بلا علامة (=) فيُشطب، وأن المتغير x هو المجهول الذي نحله بالعمليات العكسية.',
      en: 'Shows that an equation is a balance around the equals sign, that an expression without an equals sign is not one (shown crossed out), and that the variable x is the unknown we solve for.',
      fr: 'Montre qu’une équation est une balance autour du signe égal, qu’une expression sans signe égal n’en est pas une (barrée), et que la variable x est l’inconnue.',
    },
    alt: {
      ar: 'مخطط: ميزان مرقّم ١ في الوسط، وكفة يسرى مرقّمة ٢ عليها 56 - x، وكفة يمنى مرقّمة ٣ عليها 47,5، وعلامة (=) مرقّمة ٤ في المنتصف، والمتغير x مرقّم ٥، وأسفل الميزان تعبير 56 - x بلا علامة (=) مشطوب بالأحمر.',
      en: 'A diagram: a balance labelled 1, a left pan labelled 2 holding 56 - x, a right pan labelled 3 holding 47,5, an equals sign labelled 4 in the centre, the variable x labelled 5, and below the balance the expression 56 - x without an equals sign, crossed out in red.',
      fr: 'Un schéma : une balance (1), un plateau gauche (2) portant 56 - x, un plateau droit (3) portant 47,5, le signe égal (4), la variable x (5), et en bas l’expression 56 - x sans égal, barrée en rouge.',
    },
    legend: [
      { n: 1, text: { ar: 'المعادلة كالميزان: الكفتان متساويتان تماماً', en: 'The equation is a balance: both sides are exactly equal', fr: 'L’équation est une balance : les deux côtés sont égaux' } },
      { n: 2, text: { ar: 'الكفة اليسرى: التعبير 56 - x', en: 'The left pan: the expression 56 - x', fr: 'Le plateau gauche : l’expression 56 - x' } },
      { n: 3, text: { ar: 'الكفة اليمنى: الناتج 47,5', en: 'The right pan: the result 47,5', fr: 'Le plateau droit : le résultat 47,5' } },
      { n: 4, text: { ar: 'علامة (=) هي الفيصل: بها تصبح الجملة معادلة', en: 'The equals sign is the test: with it, the statement is an equation', fr: 'Le signe égal est le critère : avec lui, c’est une équation' } },
      { n: 5, text: { ar: 'المتغير x: المجهول الذي نحله بالعمليات العكسية', en: 'The variable x: the unknown we solve for with inverse operations', fr: 'La variable x : l’inconnue que l’on résout par opérations inverses' } },
    ],
    hotspots: [
      { n: 1, x: 0.500, y: 0.133 },
      { n: 2, x: 0.188, y: 0.550 },
      { n: 3, x: 0.812, y: 0.550 },
      { n: 4, x: 0.500, y: 0.267 },
      { n: 5, x: 0.646, y: 0.417 },
    ],
    displayDurationMs: 12000,
    branding: { palette: 'math', watermark: { ar: 'مس نور', en: 'Miss Noor' } },
    source: {
      origin: 'authored_svg',
      author: 'Miss Noor media pipeline',
      license: 'Project-owned (Apache-2.0)',
      attribution: 'Drawn from the Egyptian Ministry of Education Grade 5 Maths curriculum, pp. 42-48.',
    },
    review: { status: 'reviewed', reviewedBy: 'owner-window', notes: 'The balanced scale, the crossed-out expression and the variable x match the lesson key points.' },
  },

  // ── Maths: standard column multiplication (off_math_u3_l3 / c1) ──────────
  {
    id: 'math_column_multiplication',
    type: 'image',
    kind: 'diagram',
    lessonId: 'off_math_u3_l3',
    conceptId: 'off_math_u3_l3_c1',
    subjectId: 'subj_math',
    reelKind: 'teach_card',
    curriculumRef: 'Maths Ministry Book pp. 74-80',
    src: 'media/math/column_multiplication.svg',
    mimeType: 'image/svg+xml',
    width: 960,
    height: 600,
    title: {
      ar: 'خطوات الضرب المعياري: 76 × 24 = 1824',
      en: 'Standard column multiplication: 76 × 24 = 1824',
      fr: 'La multiplication posée : 76 × 24 = 1824',
    },
    purpose: {
      ar: 'يوضح خطوات الضرب المعياري بالترتيب من اليمين لليسار: حاصل ضرب الآحاد، ورقم الاحتفاظ، وصفر الخانة في السطر الثاني، وحاصل ضرب العشرات، ثم جمع الحاصلين للحصول على الناتج.',
      en: 'Shows the standard multiplication steps in right-to-left order: the units product, the carried digit, the zero placeholder on the second line, the tens product, then adding the two products for the final answer.',
      fr: 'Montre les étapes de la multiplication posée de droite à gauche : le produit des unités, la retenue, le zéro de la deuxième ligne, le produit des dizaines, puis la somme des deux produits.',
    },
    alt: {
      ar: 'مخطط: المسألة 76 × 24 = 1824 في صفوف. حاصل ضرب الآحاد 304 مرقّم ١، ورقم الاحتفاظ 2 مرقّم ٢، وصفر الخانة في السطر الثاني مرقّم ٣، وحاصل ضرب العشرات 152 مرقّم ٤، والناتج النهائي 1824 مرقّم ٥.',
      en: 'A diagram: the sum 76 × 24 = 1824 in rows. The units product 304 is labelled 1, the carried digit 2 is labelled 2, the zero placeholder on the second line is labelled 3, the tens product 152 is labelled 4, and the final answer 1824 is labelled 5.',
      fr: 'Un schéma : l’opération 76 × 24 = 1824 en lignes. Le produit des unités 304 est (1), la retenue 2 est (2), le zéro (3), le produit des dizaines 152 est (4), et le résultat 1824 est (5).',
    },
    legend: [
      { n: 1, text: { ar: 'حاصل ضرب الآحاد: 76 × 4 = 304', en: 'The units product: 76 × 4 = 304', fr: 'Le produit des unités : 76 × 4 = 304' } },
      { n: 2, text: { ar: 'رقم الاحتفاظ: يُضاف إلى الخانة التالية', en: 'The carried digit: added to the next place', fr: 'La retenue : ajoutée à la place suivante' } },
      { n: 3, text: { ar: 'صفر الخانة: نبدأ السطر الثاني بمكان فارغ', en: 'The zero placeholder: the second line starts one place left', fr: 'Le zéro : la deuxième ligne commence une place à gauche' } },
      { n: 4, text: { ar: 'حاصل ضرب العشرات: 76 × 20 = 1520', en: 'The tens product: 76 × 20 = 1520', fr: 'Le produit des dizaines : 76 × 20 = 1520' } },
      { n: 5, text: { ar: 'الناتج النهائي: جمع الحاصلين 304 + 1520 = 1824', en: 'The final answer: adding the two products, 304 + 1520 = 1824', fr: 'Le résultat final : 304 + 1520 = 1824' } },
    ],
    hotspots: [
      { n: 1, x: 0.854, y: 0.533 },
      { n: 2, x: 0.375, y: 0.483 },
      { n: 3, x: 0.750, y: 0.717 },
      { n: 4, x: 0.854, y: 0.717 },
      { n: 5, x: 0.854, y: 0.900 },
    ],
    displayDurationMs: 12000,
    branding: { palette: 'math', watermark: { ar: 'مس نور', en: 'Miss Noor' } },
    source: {
      origin: 'authored_svg',
      author: 'Miss Noor media pipeline',
      license: 'Project-owned (Apache-2.0)',
      attribution: 'Drawn from the Egyptian Ministry of Education Grade 5 Maths curriculum, pp. 74-80.',
    },
    review: { status: 'reviewed', reviewedBy: 'owner-window', notes: 'The two partial products, the carry and the zero placeholder match the lesson key points.' },
  },

  // ── Maths: rounding decimals (off_math_u1_l5 / c1) ────────────────────────
  {
    id: 'math_rounding_number_line',
    type: 'image',
    kind: 'number_line',
    lessonId: 'off_math_u1_l5',
    conceptId: 'off_math_u1_l5_c1',
    subjectId: 'subj_math',
    reelKind: 'teach_card',
    curriculumRef: 'Maths Ministry Book pp. 17-19',
    src: 'media/math/rounding_number_line.svg',
    mimeType: 'image/svg+xml',
    width: 960,
    height: 600,
    title: {
      ar: 'تقريب الأعداد العشرية على خط الأعداد',
      en: 'Rounding a decimal on the number line',
      fr: 'Arrondir un décimal sur la droite graduée',
    },
    purpose: {
      ar: 'يوضح قاعدة التقريب: ننظر للرقم على يمين الخانة المطلوبة، فإن كان 5 أو أكثر نزيد واحداً، ثم نرى أن 7,7 أقرب إلى 8 من 7.',
      en: 'Shows the rounding rule: look at the digit to the right of the target place, and if it is 5 or more round up; 7,7 sits nearer to 8 than to 7 on the line.',
      fr: 'Montre la règle : on regarde le chiffre à droite de la position demandée ; s’il vaut 5 ou plus on arrondit au-dessus, et 7,7 est plus proche de 8 que de 7.',
    },
    alt: {
      ar: 'مخطط: العدد 7,7 مرقّم ١ وفيه رقم الآحاد 7 مرقّم ٢ ورقم الأجزاء من عشرة 7 مرقّم ٣، وسهم يقود إلى الناتج 8 مرقّم ٤، وخط أعداد من 7 إلى 8 وعليه علامة العدد 7,7 مرقّمة ٥.',
      en: 'A diagram: the number 7,7 labelled 1 with the units digit 7 labelled 2 and the tenths digit 7 labelled 3; an arrow leads to the rounded result 8 labelled 4; a number line from 7 to 8 carries the mark for 7,7 labelled 5.',
      fr: 'Un schéma : le nombre 7,7 (1) avec le chiffre des unités 7 (2) et le chiffre des dixièmes 7 (3) ; une flèche mène au résultat 8 (4) ; une droite graduée de 7 à 8 porte le repère de 7,7 (5).',
    },
    legend: [
      { n: 1, text: { ar: 'العدد قبل التقريب: 7,7', en: 'The number before rounding: 7,7', fr: 'Le nombre avant l’arrondi : 7,7' } },
      { n: 2, text: { ar: 'رقم الآحاد: 7', en: 'The units digit: 7', fr: 'Le chiffre des unités : 7' } },
      { n: 3, text: { ar: 'الرقم على اليمين: 7، وهو 5 أو أكثر، إذن نقرّب لأعلى', en: 'The digit on the right: 7, which is 5 or more, so we round up', fr: 'Le chiffre à droite : 7, soit 5 ou plus, donc on arrondit au-dessus' } },
      { n: 4, text: { ar: 'الناتج بعد التقريب لأقرب وحدة: 8', en: 'The result after rounding to the nearest unit: 8', fr: 'Le résultat arrondi à l’unité : 8' } },
      { n: 5, text: { ar: 'على خط الأعداد، 7,7 أقرب إلى 8 من 7', en: 'On the number line, 7,7 is nearer to 8 than to 7', fr: 'Sur la droite graduée, 7,7 est plus proche de 8 que de 7' } },
    ],
    hotspots: [
      { n: 1, x: 0.083, y: 0.25 },
      { n: 2, x: 0.198, y: 0.2 },
      { n: 3, x: 0.391, y: 0.2 },
      { n: 4, x: 0.943, y: 0.383 },
      { n: 5, x: 0.652, y: 0.683 },
    ],
    displayDurationMs: 12000,
    branding: { palette: 'math', watermark: { ar: 'مس نور', en: 'Miss Noor' } },
    source: {
      origin: 'authored_svg',
      author: 'Miss Noor media pipeline',
      license: 'Project-owned (Apache-2.0)',
      attribution: 'Drawn from the Egyptian Ministry of Education Grade 5 Maths curriculum, pp. 17-19.',
    },
    review: { status: 'reviewed', reviewedBy: 'owner-window', notes: '7,7 rounds up to 8 because the tenths digit is 7; the number line shows it nearer to 8, matching the lesson.' },
  },

  // ── Maths: prime factor tree (off_math_u2_l4 / c1) ────────────────────────
  {
    id: 'math_factor_tree',
    type: 'image',
    kind: 'diagram',
    lessonId: 'off_math_u2_l4',
    conceptId: 'off_math_u2_l4_c1',
    subjectId: 'subj_math',
    reelKind: 'teach_card',
    curriculumRef: 'Maths Ministry Book pp. 51-53',
    src: 'media/math/factor_tree.svg',
    mimeType: 'image/svg+xml',
    width: 960,
    height: 600,
    title: {
      ar: 'شجرة العوامل الأولية للعدد 24',
      en: 'The prime factor tree for 24',
      fr: 'L’arbre des facteurs premiers de 24',
    },
    purpose: {
      ar: 'يوضح كيف نفكك العدد 24 إلى عوامله الأولية بالتفرع حتى نصل إلى أوراق كلها أعداد أولية (2 و 2 و 2 و 3).',
      en: 'Shows how to break 24 into its prime factors by branching until every leaf is a prime number (2, 2, 2 and 3).',
      fr: 'Montre comment décomposer 24 en facteurs premiers en ramifiant jusqu’à ce que chaque feuille soit un nombre premier (2, 2, 2 et 3).',
    },
    alt: {
      ar: 'مخطط شجرة: العدد 24 في القمة مرقّم ١، يتفرع إلى 2 و 12 مرقّم ٢، ثم 12 تتفرع إلى 2 و 6 مرقّم ٣، ثم 6 تتفرع إلى 2 و 3 مرقّم ٤، والأوراق الدائرية 2 و 3 مرقّمة ٥ وهي أعداد أولية.',
      en: 'A tree diagram: 24 at the top labelled 1 splits into 2 and 12 labelled 2; 12 splits into 2 and 6 labelled 3; 6 splits into 2 and 3 labelled 4; the circled leaves 2 and 3 are labelled 5 and are all prime numbers.',
      fr: 'Un arbre : 24 en haut (1) se divise en 2 et 12 (2) ; 12 se divise en 2 et 6 (3) ; 6 se divise en 2 et 3 (4) ; les feuilles cerclées 2 et 3 (5) sont des nombres premiers.',
    },
    legend: [
      { n: 1, text: { ar: 'العدد الذي نريد تفكيكه: 24', en: 'The number to factorise: 24', fr: 'Le nombre à décomposer : 24' } },
      { n: 2, text: { ar: 'التفرع الأول: 24 = 2 × 12', en: 'The first split: 24 = 2 × 12', fr: 'La première division : 24 = 2 × 12' } },
      { n: 3, text: { ar: 'تفكيك 12: 12 = 2 × 6', en: 'Breaking 12: 12 = 2 × 6', fr: 'Décomposer 12 : 12 = 2 × 6' } },
      { n: 4, text: { ar: 'تفكيك 6: 6 = 2 × 3', en: 'Breaking 6: 6 = 2 × 3', fr: 'Décomposer 6 : 6 = 2 × 3' } },
      { n: 5, text: { ar: 'الأوراق كلها أعداد أولية: 2 و 2 و 2 و 3', en: 'The leaves are all prime numbers: 2, 2, 2 and 3', fr: 'Les feuilles sont toutes premières : 2, 2, 2 et 3' } },
    ],
    hotspots: [
      { n: 1, x: 0.5, y: 0.067 },
      { n: 2, x: 0.625, y: 0.3 },
      { n: 3, x: 0.729, y: 0.6 },
      { n: 4, x: 0.49, y: 0.883 },
      { n: 5, x: 0.654, y: 0.908 },
    ],
    displayDurationMs: 12000,
    branding: { palette: 'math', watermark: { ar: 'مس نور', en: 'Miss Noor' } },
    source: {
      origin: 'authored_svg',
      author: 'Miss Noor media pipeline',
      license: 'Project-owned (Apache-2.0)',
      attribution: 'Drawn from the Egyptian Ministry of Education Grade 5 Maths curriculum, pp. 51-53.',
    },
    review: { status: 'reviewed', reviewedBy: 'owner-window', notes: '24 = 2 × 2 × 2 × 3; every leaf is prime, matching the lesson key points.' },
  },

  // ── Maths: order of operations (off_math_u6_l1 / c1) ──────────────────────
  {
    id: 'math_order_of_operations',
    type: 'image',
    kind: 'concept_map',
    lessonId: 'off_math_u6_l1',
    conceptId: 'off_math_u6_l1_c1',
    subjectId: 'subj_math',
    reelKind: 'teach_card',
    curriculumRef: 'Maths Ministry Book pp. 121-125',
    src: 'media/math/order_of_operations.svg',
    mimeType: 'image/svg+xml',
    width: 960,
    height: 600,
    title: {
      ar: 'أسبقية العمليات الحسابية',
      en: 'The order of operations',
      fr: 'La priorité des opérations',
    },
    purpose: {
      ar: 'يوضح أن الضرب يُنفَّذ قبل الجمع، فالمقدار 2 + 3 × 4 يصبح 2 + 12 ثم 14، وأن الأقواس تأتي أولاً دائماً.',
      en: 'Shows that multiplication is done before addition, so 2 + 3 × 4 becomes 2 + 12 and then 14, and that brackets always come first.',
      fr: 'Montre que la multiplication précède l’addition : 2 + 3 × 4 devient 2 + 12 puis 14, et que les parenthèses passent toujours en premier.',
    },
    alt: {
      ar: 'مخطط: المقدار 2 + 3 × 4 مرقّم ١، والجزء 3 × 4 محاط بإطار متقطع مرقّم ٢، وسهم ينزل إلى 2 + 12 مرقّم ٣، والسطر الثاني مرقّم ٤، والناتج 14 مرقّم ٥.',
      en: 'A diagram: the expression 2 + 3 × 4 labelled 1; the part 3 × 4 is boxed with a dashed outline labelled 2; an arrow leads down to 2 + 12 labelled 3; the second line is labelled 4; the result 14 is labelled 5.',
      fr: 'Un schéma : l’expression 2 + 3 × 4 (1) ; la partie 3 × 4 encadrée en pointillés (2) ; une flèche descend vers 2 + 12 (3) ; la deuxième ligne (4) ; le résultat 14 (5).',
    },
    legend: [
      { n: 1, text: { ar: 'المقدار كاملاً: 2 + 3 × 4', en: 'The whole expression: 2 + 3 × 4', fr: 'L’expression entière : 2 + 3 × 4' } },
      { n: 2, text: { ar: 'نبدأ بالضرب: 3 × 4 = 12', en: 'Start with the multiplication: 3 × 4 = 12', fr: 'On commence par la multiplication : 3 × 4 = 12' } },
      { n: 3, text: { ar: 'بعد الضرب يصبح المقدار: 2 + 12', en: 'After the multiplication the expression is: 2 + 12', fr: 'Après la multiplication : 2 + 12' } },
      { n: 4, text: { ar: 'ثم نجمع أو نطرح من اليسار إلى اليمين', en: 'Then add or subtract from left to right', fr: 'Puis on additionne ou soustrait de gauche à droite' } },
      { n: 5, text: { ar: 'الناتج النهائي: 14', en: 'The final result: 14', fr: 'Le résultat final : 14' } },
    ],
    hotspots: [
      { n: 1, x: 0.094, y: 0.183 },
      { n: 2, x: 0.625, y: 0.067 },
      { n: 3, x: 0.344, y: 0.6 },
      { n: 4, x: 0.125, y: 0.9 },
      { n: 5, x: 0.938, y: 0.683 },
    ],
    displayDurationMs: 12000,
    branding: { palette: 'math', watermark: { ar: 'مس نور', en: 'Miss Noor' } },
    source: {
      origin: 'authored_svg',
      author: 'Miss Noor media pipeline',
      license: 'Project-owned (Apache-2.0)',
      attribution: 'Drawn from the Egyptian Ministry of Education Grade 5 Maths curriculum, pp. 121-125.',
    },
    review: { status: 'reviewed', reviewedBy: 'owner-window', notes: '2 + 3 × 4 = 14; the dashed box marks the multiplication that is done first, matching the lesson.' },
  },

  // ── Science: the three states of matter (off_scifr_u2_l1_matiere / etats) ──
  {
    id: 'sci_states_of_matter',
    type: 'image',
    kind: 'concept_map',
    lessonId: 'off_scifr_u2_l1_matiere',
    conceptId: 'conc_scifr_u2_l1_etats',
    subjectId: 'subj_science',
    reelKind: 'story_analogy',
    curriculumRef: 'Sciences Ministry Book pp. 35-40',
    src: 'media/science/states_of_matter.svg',
    mimeType: 'image/svg+xml',
    width: 960,
    height: 600,
    title: {
      ar: 'حالات المادة الثلاث وترتيب الجسيمات',
      en: 'The three states of matter and their particles',
      fr: 'Les trois états de la matière et leurs particules',
    },
    purpose: {
      ar: 'يقارن حالات المادة الثلاث: الصلب جسيماته مرصوصة ومنتظمة، والسائل جسيماته قريبة لكن غير منتظمة، والغاز جسيماته متباعدة وسريعة.',
      en: 'Compares the three states: a solid has particles packed in neat rows, a liquid has particles close but jumbled, and a gas has particles far apart and fast.',
      fr: 'Compare les trois états : un solide a des particules serrées et ordonnées, un liquide des particules proches mais désordonnées, un gaz des particules éloignées et rapides.',
    },
    alt: {
      ar: 'مخطط بثلاث لوحات: مكعب صلب مرقّم ١ بجسيمات في صفوف منتظمة، وكأس سائل مرقّم ٢ بجسيمات قريبة وغير منتظمة، ووعاء غاز مرقّم ٣ بجسيمات متباعدة وأسهم حركة، والصفوف المنتظمة مرقّمة ٤، وجسيمات الغاز المتفرقة مرقّمة ٥.',
      en: 'A diagram with three panels: a solid block labelled 1 with particles in ordered rows, a beaker of liquid labelled 2 with particles close but jumbled, and a gas container labelled 3 with particles far apart and motion arrows; the ordered rows are labelled 4 and the scattered gas particles labelled 5.',
      fr: 'Un schéma à trois panneaux : un solide (1) aux particules en rangées, un bécher de liquide (2) aux particules proches et désordonnées, un récipient de gaz (3) aux particules éloignées avec flèches ; les rangées (4) et les particules de gaz (5).',
    },
    legend: [
      { n: 1, text: { ar: 'الحالة الصلبة: جسيمات مرصوصة ومرتبة، ولها شكل وحجم ثابتان', en: 'Solid: particles packed and ordered, with a fixed shape and volume', fr: 'Solide : particules serrées et ordonnées, forme et volume fixes' } },
      { n: 2, text: { ar: 'الحالة السائلة: جسيمات قريبة لكن غير مرتبة، تأخذ شكل الإناء', en: 'Liquid: particles close but disordered, taking the shape of the container', fr: 'Liquide : particules proches mais désordonnées, prenant la forme du récipient' } },
      { n: 3, text: { ar: 'الحالة الغازية: جسيمات متباعدة وسريعة، تملأ الإناء كله', en: 'Gas: particles far apart and fast, filling the whole container', fr: 'Gaz : particules éloignées et rapides, remplissant tout le récipient' } },
      { n: 4, text: { ar: 'ترتيب الجسيمات في الصلب: صفوف منتظمة', en: 'The particle order in a solid: neat rows', fr: 'L’ordre des particules dans un solide : des rangées régulières' } },
      { n: 5, text: { ar: 'حركة جسيمات الغاز: متباعدة وسريعة', en: 'The motion of gas particles: far apart and fast', fr: 'Le mouvement des particules de gaz : éloignées et rapides' } },
    ],
    hotspots: [
      { n: 1, x: 0.063, y: 0.183 },
      { n: 2, x: 0.391, y: 0.183 },
      { n: 3, x: 0.719, y: 0.183 },
      { n: 4, x: 0.297, y: 0.483 },
      { n: 5, x: 0.969, y: 0.5 },
    ],
    displayDurationMs: 12000,
    branding: { palette: 'science', watermark: { ar: 'مس نور', en: 'Miss Noor' } },
    source: {
      origin: 'authored_svg',
      author: 'Miss Noor media pipeline',
      license: 'Project-owned (Apache-2.0)',
      attribution: 'Drawn from the Egyptian Ministry of Education Grade 5 Sciences curriculum, pp. 35-40.',
    },
    review: { status: 'reviewed', reviewedBy: 'owner-window', notes: 'Solid ordered rows, liquid close but jumbled, gas far apart and fast match the lesson key points.' },
  },

  // ── Science: the food chain (off_scifr_u1_l2_chaines / chaine) ────────────
  {
    id: 'sci_food_chain',
    type: 'image',
    kind: 'diagram',
    lessonId: 'off_scifr_u1_l2_chaines',
    conceptId: 'conc_scifr_u1_l2_chaine',
    subjectId: 'subj_science',
    reelKind: 'story_analogy',
    curriculumRef: 'Sciences Ministry Book pp. 16-24',
    src: 'media/science/food_chain.svg',
    mimeType: 'image/svg+xml',
    width: 960,
    height: 600,
    title: {
      ar: 'السلسلة الغذائية وانتقال الطاقة',
      en: 'The food chain and the flow of energy',
      fr: 'La chaîne alimentaire et le flux d’énergie',
    },
    purpose: {
      ar: 'يوضح انتقال الطاقة في السلسلة الغذائية: تبدأ من الشمس، ثم النبات الأخضر (المنتج)، ثم آكل العشب (المستهلك الأول)، ثم آكل اللحم (المستهلك الثاني)، وتغلق المحللات الدورة في التربة.',
      en: 'Shows how energy flows in a food chain: it starts with the sun, then the green plant (producer), the herbivore (primary consumer), the carnivore (secondary consumer), and the decomposers close the cycle in the soil.',
      fr: 'Montre le flux d’énergie : du soleil, à la plante verte (producteur), à l’herbivore (consommateur primaire), au carnivore (consommateur secondaire), et les décomposeurs ferment le cycle dans le sol.',
    },
    alt: {
      ar: 'مخطط سلسلة غذائية: الشمس مرقّمة ١، سهم يقود إلى النبات الأخضر مرقّم ٢، ثم إلى أرنب آكل للعشب مرقّم ٣، ثم إلى ثعلب آكل للحوم مرقّم ٤، وفي التربة محللات مرقّمة ٥ مع سهم يعود إلى النبات.',
      en: 'A food chain diagram: the sun labelled 1, an arrow to the green plant labelled 2, then to a plant-eating rabbit labelled 3, then to a meat-eating fox labelled 4, and decomposers in the soil labelled 5 with an arrow returning to the plant.',
      fr: 'Un schéma de chaîne alimentaire : le soleil (1), une flèche vers la plante verte (2), puis un lapin herbivore (3), puis un renard carnivore (4), et des décomposeurs dans le sol (5) avec une flèche revenant à la plante.',
    },
    legend: [
      { n: 1, text: { ar: 'الشمس: مصدر الطاقة الأول', en: 'The sun: the first source of energy', fr: 'Le soleil : la première source d’énergie' } },
      { n: 2, text: { ar: 'النبات الأخضر (المنتج): يصنع غذاءه بنفسه', en: 'The green plant (producer): makes its own food', fr: 'La plante verte (producteur) : fabrique sa nourriture' } },
      { n: 3, text: { ar: 'آكل العشب (المستهلك الأول): يتغذى على النبات', en: 'The herbivore (primary consumer): eats the plant', fr: 'L’herbivore (consommateur primaire) : mange la plante' } },
      { n: 4, text: { ar: 'آكل اللحم (المستهلك الثاني): يتغذى على آكل العشب', en: 'The carnivore (secondary consumer): eats the herbivore', fr: 'Le carnivore (consommateur secondaire) : mange l’herbivore' } },
      { n: 5, text: { ar: 'المحللات في التربة: تعيد الأملاح المعدنية إلى النبات وتغلق الدورة', en: 'The decomposers in the soil: return mineral salts to the plant and close the cycle', fr: 'Les décomposeurs du sol : rendent les sels minéraux à la plante et ferment le cycle' } },
    ],
    hotspots: [
      { n: 1, x: 0.063, y: 0.1 },
      { n: 2, x: 0.438, y: 0.2 },
      { n: 3, x: 0.688, y: 0.333 },
      { n: 4, x: 0.927, y: 0.4 },
      { n: 5, x: 0.125, y: 0.933 },
    ],
    displayDurationMs: 12000,
    branding: { palette: 'science', watermark: { ar: 'مس نور', en: 'Miss Noor' } },
    source: {
      origin: 'authored_svg',
      author: 'Miss Noor media pipeline',
      license: 'Project-owned (Apache-2.0)',
      attribution: 'Drawn from the Egyptian Ministry of Education Grade 5 Sciences curriculum, pp. 16-24.',
    },
    review: { status: 'reviewed', reviewedBy: 'owner-window', notes: 'Sun -> producer -> primary consumer -> secondary consumer -> decomposers matches the lesson reading text.' },
  },

  // ── Science (French track): photosynthesis & plant vessels
  //    (off_scifr_u1_l1_plantes / conc_scifr_u1_l1_photosynthese) ─────────────
  {
    id: 'scifr_photosynthese_diagram',
    type: 'image',
    kind: 'diagram',
    lessonId: 'off_scifr_u1_l1_plantes',
    conceptId: 'conc_scifr_u1_l1_photosynthese',
    subjectId: 'subj_science_fr',
    reelKind: 'story_analogy',
    curriculumRef: 'Ministry Sciences Textbook pp. 8-15',
    src: 'media/science/photosynthese_fr.svg',
    mimeType: 'image/svg+xml',
    width: 960,
    height: 600,
    title: {
      ar: 'البناء الضوئي وأوعية النبات',
      en: 'Photosynthesis and the plant’s vessels',
      fr: 'La photosynthèse et les vaisseaux de la plante',
    },
    purpose: {
      ar: 'يوضح كيف تحوّل الورقة ضوء الشمس والماء وثاني أكسيد الكربون إلى سكر الجلوكوز وأكسجين، وكيف ينقل الخشب الماء إلى الأعلى بينما يوزّع اللحاء السكر إلى باقي النبات.',
      en: 'Shows how the leaf turns sunlight, water and carbon dioxide into glucose and oxygen, with the xylem carrying water up and the phloem distributing glucose to the whole plant.',
      fr: 'Montre comment la feuille transforme la lumière, l’eau et le CO₂ en glucose et dioxygène, le xylème montant l’eau et le phloème distribuant le glucose à toute la plante.',
    },
    alt: {
      ar: 'رسم لنبات: الشمس مرقّمة ١، الجذور تمتص الماء والأملاح مرقّمة ٢، أوعية الخشب تنقل الماء لأعلى مرقّمة ٣، الورقة بها الثغور والكلوروفيل مرقّمة ٤، خروج السكر والأكسجين مرقّم ٥، وأوعية اللحاء توزّع السكر مرقّمة ٦.',
      en: 'Diagram of a plant: the sun labelled 1, the roots taking up water and salts labelled 2, the xylem carrying water up labelled 3, the leaf with stomata and chlorophyll labelled 4, the glucose and oxygen leaving labelled 5, and the phloem distributing glucose labelled 6.',
      fr: 'Schéma d’une plante : soleil (1), racines absorbant eau et sels (2), xylème montant l’eau (3), feuille avec stomates et chlorophylle (4), glucose et dioxygène sortant (5), phloème distribuant le glucose (6).',
    },
    legend: [
      { n: 1, text: { ar: 'ضوء الشمس (الطاقة)', en: 'Sunlight (energy)', fr: 'La lumière du soleil (énergie)' } },
      { n: 2, text: { ar: 'الجذور تمتص الماء والأملاح المعدنية', en: 'The roots take up water and mineral salts', fr: 'Les racines absorbent l’eau et les sels minéraux' } },
      { n: 3, text: { ar: 'أوعية الخشب تنقل الماء لأعلى إلى الأوراق', en: 'The xylem carries water up to the leaves', fr: 'Le xylème transporte l’eau vers les feuilles' } },
      { n: 4, text: { ar: 'الورقة: الثغور تأخذ ثاني أكسيد الكربون والكلوروفيل يلتقط الضوء', en: 'The leaf: the stomata take in CO₂ and the chlorophyll captures the light', fr: 'La feuille : les stomates absorbent le CO₂ et la chlorophylle capte la lumière' } },
      { n: 5, text: { ar: 'الناتج: سكر الجلوكوز وغاز الأكسجين', en: 'The products: glucose sugar and oxygen gas', fr: 'Les produits : glucose et dioxygène' } },
      { n: 6, text: { ar: 'أوعية اللحاء توزّع السكر إلى كل خلايا النبات', en: 'The phloem distributes the glucose to every cell of the plant', fr: 'Le phloème distribue le glucose à toutes les cellules' } },
    ],
    hotspots: [
      { n: 1, x: 0.156, y: 0.05 },
      { n: 2, x: 0.1, y: 0.927 },
      { n: 3, x: 0.263, y: 0.653 },
      { n: 4, x: 0.5, y: 0.25 },
      { n: 5, x: 0.846, y: 0.627 },
      { n: 6, x: 0.683, y: 0.81 },
    ],
    displayDurationMs: 12000,
    branding: { palette: 'science', watermark: { ar: 'مس نور', en: 'Miss Noor' } },
    source: {
      origin: 'authored_svg',
      author: 'Miss Noor media pipeline',
      license: 'Project-owned (Apache-2.0)',
      attribution: 'Drawn from the Egyptian Ministry of Education Grade 5 Sciences curriculum, pp. 8-15.',
    },
    review: { status: 'reviewed', reviewedBy: 'owner-window', notes: 'Water + CO2 + light -> glucose + dioxygen; xylem up, phloem down, matching the lesson reading text.' },
  },

  // ── Maths: greatest common factor of 12 and 16 (off_math_u2_l5 / c1) ──────
  {
    id: 'math_gcd_venn',
    type: 'image',
    kind: 'diagram',
    lessonId: 'off_math_u2_l5',
    conceptId: 'off_math_u2_l5_c1',
    subjectId: 'subj_math',
    reelKind: 'teach_card',
    curriculumRef: 'Maths Ministry Techbook pp. 54-55',
    src: 'media/math/gcd_venn.svg',
    mimeType: 'image/svg+xml',
    width: 960,
    height: 600,
    title: {
      ar: 'العامل المشترك الأكبر للعددين 12 و 16',
      en: 'The greatest common factor of 12 and 16',
      fr: 'Le plus grand facteur commun de 12 et 16',
    },
    purpose: {
      ar: 'يوضح أن العامل المشترك الأكبر هو حاصل ضرب العوامل الأولية المشتركة فقط: 12 = 2 × 2 × 3 و 16 = 2 × 2 × 2 × 2، فالعوامل المشتركة 2 و 2، إذن ع.م.أ = 4.',
      en: 'Shows that the greatest common factor is the product of the shared prime factors only: 12 = 2 × 2 × 3 and 16 = 2 × 2 × 2 × 2, so the shared factors 2 and 2 give GCF = 4.',
      fr: 'Montre que le P.G.C.D est le produit des facteurs premiers communs : 12 = 2 × 2 × 3 et 16 = 2 × 2 × 2 × 2, donc 2 × 2 = 4.',
    },
    alt: {
      ar: 'مخططان متداخلان: مجموعة عوامل العدد 12 مرقّمة ١ وفيها 3 و 2 و 2، ومجموعة عوامل العدد 16 مرقّمة ٢ وفيها 2 و 2 و 2 و 2، والعوامل المشتركة 2 و 2 في المنتصف مرقّمة ٣، وحاصل ضربها مرقّم ٤، والنتيجة 4 مرقّمة ٥.',
      en: 'Two overlapping sets: the factors of 12 labelled 1 (3, 2 and 2), the factors of 16 labelled 2 (2, 2, 2 and 2), the shared factors 2 and 2 in the middle labelled 3, their product labelled 4, and the result 4 labelled 5.',
      fr: 'Deux ensembles qui se chevauchent : les facteurs de 12 (1) avec 3, 2 et 2 ; les facteurs de 16 (2) avec 2, 2, 2 et 2 ; les facteurs communs 2 et 2 (3) ; leur produit (4) ; le résultat 4 (5).',
    },
    legend: [
      { n: 1, text: { ar: 'عوامل العدد 12: 2 و 2 و 3', en: 'The factors of 12: 2, 2 and 3', fr: 'Les facteurs de 12 : 2, 2 et 3' } },
      { n: 2, text: { ar: 'عوامل العدد 16: 2 و 2 و 2 و 2', en: 'The factors of 16: 2, 2, 2 and 2', fr: 'Les facteurs de 16 : 2, 2, 2 et 2' } },
      { n: 3, text: { ar: 'العوامل المشتركة: 2 و 2', en: 'The shared factors: 2 and 2', fr: 'Les facteurs communs : 2 et 2' } },
      { n: 4, text: { ar: 'نضرب العوامل المشتركة: 2 × 2', en: 'Multiply the shared factors: 2 × 2', fr: 'On multiplie les facteurs communs : 2 × 2' } },
      { n: 5, text: { ar: 'العامل المشترك الأكبر: 4', en: 'The greatest common factor: 4', fr: 'Le plus grand facteur commun : 4' } },
    ],
    hotspots: [
      { n: 1, x: 0.26, y: 0.183 },
      { n: 2, x: 0.74, y: 0.183 },
      { n: 3, x: 0.5, y: 0.367 },
      { n: 4, x: 0.646, y: 0.717 },
      { n: 5, x: 0.625, y: 0.9 },
    ],
    displayDurationMs: 12000,
    branding: { palette: 'math', watermark: { ar: 'مس نور', en: 'Miss Noor' } },
    source: {
      origin: 'authored_svg',
      author: 'Miss Noor media pipeline',
      license: 'Project-owned (Apache-2.0)',
      attribution: 'Drawn from the Egyptian Ministry of Education Grade 5 Maths curriculum, pp. 54-55.',
    },
    review: { status: 'reviewed', reviewedBy: 'owner-window', notes: 'GCF(12,16)=4; only the shared prime factors 2 and 2 are multiplied, matching the lesson key points.' },
  },

  // ── Maths: least common multiple of 4 and 6 (off_math_u2_l7 / c1) ─────────
  {
    id: 'math_lcm_multiples',
    type: 'image',
    kind: 'number_line',
    lessonId: 'off_math_u2_l7',
    conceptId: 'off_math_u2_l7_c1',
    subjectId: 'subj_math',
    reelKind: 'teach_card',
    curriculumRef: 'Maths Ministry Techbook pp. 59-61',
    src: 'media/math/lcm_multiples.svg',
    mimeType: 'image/svg+xml',
    width: 960,
    height: 600,
    title: {
      ar: 'المضاعف المشترك الأصغر للعددين 4 و 6',
      en: 'The least common multiple of 4 and 6',
      fr: 'Le plus petit commun multiple de 4 et 6',
    },
    purpose: {
      ar: 'يوضح أن المضاعف المشترك الأصغر هو أول عدد يظهر في قائمتي المضاعفات: مضاعفات 4 هي 4 و 8 و 12… ومضاعفات 6 هي 6 و 12… فأول لقاء هو 12، وهو موعد التقاء الحدثين المتكررين.',
      en: 'Shows that the least common multiple is the first number to appear in both lists of multiples: 4, 8, 12… and 6, 12…, so the first meeting is 12, the moment two repeating events line up.',
      fr: 'Montre que le P.P.C.M est le premier nombre présent dans les deux listes : 4, 8, 12… et 6, 12…, donc le premier rendez-vous est 12.',
    },
    alt: {
      ar: 'خطان متوازيان: مضاعفات العدد 4 مرقّمة ١ وهي 4 و 8 و 12 و 16 و 20 و 24، ومضاعفات العدد 6 مرقّمة ٢ وهي 6 و 12 و 18 و 24 و 30 و 36، وأول عدد مشترك 12 مرقّم ٣، ونقطة الالتقاء على الخط العمودي مرقّمة ٤، والنتيجة 12 مرقّمة ٥.',
      en: 'Two parallel rails: the multiples of 4 labelled 1 (4, 8, 12, 16, 20, 24) and the multiples of 6 labelled 2 (6, 12, 18, 24, 30, 36); the first shared number 12 labelled 3; the meeting point on the vertical line labelled 4; the result 12 labelled 5.',
      fr: 'Deux rails parallèles : les multiples de 4 (1) avec 4, 8, 12, 16, 20, 24 ; les multiples de 6 (2) avec 6, 12, 18, 24, 30, 36 ; le premier commun 12 (3) ; le point de rencontre (4) ; le résultat 12 (5).',
    },
    legend: [
      { n: 1, text: { ar: 'مضاعفات العدد 4: 4 و 8 و 12 و 16 و 20 و 24', en: 'The multiples of 4: 4, 8, 12, 16, 20 and 24', fr: 'Les multiples de 4 : 4, 8, 12, 16, 20 et 24' } },
      { n: 2, text: { ar: 'مضاعفات العدد 6: 6 و 12 و 18 و 24 و 30 و 36', en: 'The multiples of 6: 6, 12, 18, 24, 30 and 36', fr: 'Les multiples de 6 : 6, 12, 18, 24, 30 et 36' } },
      { n: 3, text: { ar: 'أول عدد يظهر في القائمتين معاً: 12', en: 'The first number in both lists: 12', fr: 'Le premier nombre présent dans les deux listes : 12' } },
      { n: 4, text: { ar: 'موعد التقاء الحدثين المتكررين', en: 'The moment the two repeating events meet', fr: 'Le moment où les deux événements se rencontrent' } },
      { n: 5, text: { ar: 'المضاعف المشترك الأصغر: 12', en: 'The least common multiple: 12', fr: 'Le plus petit commun multiple : 12' } },
    ],
    hotspots: [
      { n: 1, x: 0.125, y: 0.25 },
      { n: 2, x: 0.125, y: 0.817 },
      { n: 3, x: 0.313, y: 0.183 },
      { n: 4, x: 0.313, y: 0.933 },
      { n: 5, x: 0.667, y: 0.517 },
    ],
    displayDurationMs: 12000,
    branding: { palette: 'math', watermark: { ar: 'مس نور', en: 'Miss Noor' } },
    source: {
      origin: 'authored_svg',
      author: 'Miss Noor media pipeline',
      license: 'Project-owned (Apache-2.0)',
      attribution: 'Drawn from the Egyptian Ministry of Education Grade 5 Maths curriculum, pp. 59-61.',
    },
    review: { status: 'reviewed', reviewedBy: 'owner-window', notes: 'LCM(4,6)=12, the first number shared by both lists of multiples, matching the lesson (mangrove planting example).' },
  },

  // ── ICT: facts vs opinions & source safety (off_ict_u2_l5 / c1) ───────────
  {
    id: 'ict_facts_vs_opinions',
    type: 'image',
    kind: 'concept_map',
    lessonId: 'off_ict_u2_l5',
    conceptId: 'off_ict_u2_l5_c1',
    subjectId: 'subj_ict',
    reelKind: 'teach_card',
    curriculumRef: 'ICT Ministry Book pp. 39-41',
    src: 'media/ict/facts_vs_opinions.svg',
    mimeType: 'image/svg+xml',
    width: 960,
    height: 600,
    title: {
      ar: 'الحقيقة مقابل الرأي والأمان الرقمي',
      en: 'Fact versus opinion and digital safety',
      fr: 'Fait ou opinion et sécurité numérique',
    },
    purpose: {
      ar: 'يوضح الفرق بين الحقيقة المثبتة يتفق عليها الجميع والرأي الشخصي الذي يختلف من فرد لآخر، ويذكّر بالرجوع للمصادر الموثوقة والتحقق من علامة القفل قبل إدخال أي بيانات.',
      en: 'Shows the difference between a fact everyone agrees on and a personal opinion that differs from one person to another, and reminds the child to use trusted sources and check the padlock before entering any data.',
      fr: 'Montre la différence entre un fait accepté par tous et une opinion personnelle, et rappelle d’utiliser des sources fiables et de vérifier le cadenas avant de saisir des données.',
    },
    alt: {
      ar: 'مخطط بعمودين: عمود الحقيقة مرقّم ١ وفيه شروق الشمس يراه الجميع مرقّم ٢، وعمود الرأي مرقّم ٣ وفيه لون القميص المفضل مختلف من شخص لآخر، ورمز المصدر الموثوق مرقّم ٤، وعلامة القفل للأمان مرقّمة ٥.',
      en: 'A two-column diagram: the fact column labelled 1 with a sunrise everyone sees labelled 2, the opinion column labelled 3 with a preferred shirt colour that differs per person, a trusted-source badge labelled 4, and the padlock safety marker labelled 5.',
      fr: 'Un schéma à deux colonnes : la colonne fait (1) avec un lever de soleil vu par tous (2), la colonne opinion (3) avec une couleur de chemise préférée, un badge de source fiable (4) et le cadenas de sécurité (5).',
    },
    legend: [
      { n: 1, text: { ar: 'عمودان: الحقيقة على اليسار والرأي على اليمين', en: 'Two columns: fact on the left, opinion on the right', fr: 'Deux colonnes : le fait à gauche, l’opinion à droite' } },
      { n: 2, text: { ar: 'حقيقة: شروق الشمس يراه ويؤكده الجميع', en: 'A fact: everyone sees and confirms the sunrise', fr: 'Un fait : tout le monde voit le lever du soleil' } },
      { n: 3, text: { ar: 'رأي: لون القميص المفضل يختلف من شخص لآخر', en: 'An opinion: the preferred shirt colour differs from person to person', fr: 'Une opinion : la couleur préférée diffère selon la personne' } },
      { n: 4, text: { ar: 'نتحقق من الحقائق في المصادر الوطنية المعتمدة مثل بنك المعرفة المصري', en: 'Check facts against trusted national sources such as the Egyptian Knowledge Bank', fr: 'On vérifie les faits dans les sources nationales fiables comme la banque de connaissances égyptienne' } },
      { n: 5, text: { ar: 'قبل إدخال أي بيانات تأكدي من علامة القفل وبروتوكول https://', en: 'Before entering any data, check the padlock and the https:// protocol', fr: 'Avant de saisir des données, vérifiez le cadenas et le protocole https://' } },
    ],
    hotspots: [
      { n: 1, x: 0.5, y: 0.1 },
      { n: 2, x: 0.271, y: 0.333 },
      { n: 3, x: 0.729, y: 0.333 },
      { n: 4, x: 0.313, y: 0.783 },
      { n: 5, x: 0.625, y: 0.85 },
    ],
    displayDurationMs: 12000,
    branding: { palette: 'noor-core', watermark: { ar: 'مس نور', en: 'Miss Noor' } },
    source: {
      origin: 'authored_svg',
      author: 'Miss Noor media pipeline',
      license: 'Project-owned (Apache-2.0)',
      attribution: 'Drawn from the Egyptian Ministry of Education Grade 5 ICT curriculum, pp. 39-41.',
    },
    review: { status: 'reviewed', reviewedBy: 'owner-window', notes: 'Fact = provable and agreed by all; opinion = personal; padlock + https check matches the lesson reading text.' },
  },

  // ── ICT: Excel formulas & safe sharing (off_ict_u1_l6 / c1) ───────────────
  {
    id: 'ict_excel_formula_safety',
    type: 'image',
    kind: 'concept_map',
    lessonId: 'off_ict_u1_l6',
    conceptId: 'off_ict_u1_l6_c1',
    subjectId: 'subj_ict',
    reelKind: 'teach_card',
    curriculumRef: 'ICT Ministry Book pp. 23-25',
    src: 'media/ict/excel_formula_safety.svg',
    mimeType: 'image/svg+xml',
    width: 960,
    height: 600,
    title: {
      ar: 'صيغ إكسل وقواعد المشاركة الآمنة',
      en: 'Excel formulas and safe sharing',
      fr: 'Les formules Excel et le partage sûr',
    },
    purpose: {
      ar: 'يوضح أن كل صيغة في إكسل تبدأ بعلامة (=) وأن =A1+B1 تجمع خليتين، ويقابل ذلك قاعدة المشاركة الآمنة: العمل المدرسي على الشبكة الداخلية، ولا بيانات شخصية على الشبكة المفتوحة.',
      en: 'Shows that every Excel formula starts with the equals sign and that =A1+B1 adds two cells, next to the safe-sharing rule: school work on the private network, never personal data on the open one.',
      fr: 'Montre que chaque formule Excel commence par le signe égal et que =A1+B1 additionne deux cellules, face à la règle de partage : le travail scolaire sur le réseau interne, jamais de données personnelles en ligne.',
    },
    alt: {
      ar: 'مخطط: جدول إكسل بخلايا وأرقام مرقّم ١، شريط الصيغة الذي يبدأ بعلامة (=) مرقّم ٢، الخلية الناتجة عن الجمع مرقّمة ٣، الشبكة الداخلية الآمنة مرقّمة ٤، والشبكة المفتوحة وعليها علامة منع مرقّمة ٥.',
      en: 'A diagram: an Excel grid with cells and numbers labelled 1, the formula bar that starts with the equals sign labelled 2, the cell holding the sum labelled 3, the safe private network labelled 4, and the open network marked with a cross labelled 5.',
      fr: 'Un schéma : une grille Excel (1), la barre de formule commençant par le signe égal (2), la cellule du total (3), le réseau interne sûr (4) et le réseau ouvert barré (5).',
    },
    legend: [
      { n: 1, text: { ar: 'جدول إكسل: الخلايا والمراجع مثل A1 و B1', en: 'The Excel grid: the cells and their references such as A1 and B1', fr: 'La grille Excel : les cellules et leurs références comme A1 et B1' } },
      { n: 2, text: { ar: 'شريط الصيغة: كل صيغة تبدأ بعلامة يساوي (=)', en: 'The formula bar: every formula starts with the equals sign (=)', fr: 'La barre de formule : chaque formule commence par le signe égal (=)' } },
      { n: 3, text: { ar: 'صيغة الجمع =A1+B1 تجمع قيمتي الخليتين', en: 'The sum formula =A1+B1 adds the two cell values', fr: 'La formule =A1+B1 additionne les deux cellules' } },
      { n: 4, text: { ar: 'الشبكة الداخلية الآمنة لمشاركة الواجبات مع المعلم', en: 'The safe private network for sharing homework with the teacher', fr: 'Le réseau interne sûr pour partager les devoirs avec le professeur' } },
      { n: 5, text: { ar: 'الشبكة المفتوحة: لا نشارك أبداً بياناتنا الشخصية', en: 'The open network: never share personal data there', fr: 'Le réseau ouvert : on ne partage jamais ses données personnelles' } },
    ],
    hotspots: [
      { n: 1, x: 0.49, y: 0.383 },
      { n: 2, x: 0.073, y: 0.243 },
      { n: 3, x: 0.635, y: 0.543 },
      { n: 4, x: 0.667, y: 0.2 },
      { n: 5, x: 0.667, y: 0.933 },
    ],
    displayDurationMs: 12000,
    branding: { palette: 'noor-core', watermark: { ar: 'مس نور', en: 'Miss Noor' } },
    source: {
      origin: 'authored_svg',
      author: 'Miss Noor media pipeline',
      license: 'Project-owned (Apache-2.0)',
      attribution: 'Drawn from the Egyptian Ministry of Education Grade 5 ICT curriculum, pp. 23-25.',
    },
    review: { status: 'reviewed', reviewedBy: 'owner-window', notes: 'Every formula starts with =; the safe-sharing rule (intranet for school work, no personal data online) matches the lesson reading text.' },
  },
  {
    "id": "math_area_model_multiplication",
    "type": "image",
    "kind": "diagram",
    "lessonId": "off_math_u3_l1",
    "conceptId": "off_math_u3_l1_c1",
    "subjectId": "subj_math",
    "reelKind": "teach_card",
    "curriculumRef": "Egyptian Ministry Grade 5 Mathematics — Unit 3, Lesson 1",
    "src": "media/math/area_model_multiplication.svg",
    "mimeType": "image/svg+xml",
    "width": 960,
    "height": 600,
    "title": {
      "ar": "نموذج مساحة المستطيل للضرب",
      "en": "Rectangle area model for multiplication",
      "fr": "Modèle de l’aire du rectangle pour la multiplication"
    },
    "purpose": {
      "ar": "تقسيم المستطيل إلى أجزاء أصغر وحساب المساحات الجزئية ثم جمعها.",
      "en": "Split a rectangle into smaller sections, calculate partial areas and add them.",
      "fr": "Partager un rectangle en parties, calculer les aires partielles puis les additionner."
    },
    "alt": {
      "ar": "مستطيل مقسم إلى أربعة أجزاء مرقمة يوضح المساحات الجزئية والناتج الكلي.",
      "en": "A rectangle split into four numbered parts shows partial areas and the total product.",
      "fr": "Un rectangle partagé en quatre parties numérotées montre les aires partielles et le produit total."
    },
    "legend": [
      {
        "n": 1,
        "text": {
          "ar": "نقسم العامل الأول إلى أجزاء",
          "en": "Split the first factor into parts",
          "fr": "Décomposer le premier facteur"
        }
      },
      {
        "n": 2,
        "text": {
          "ar": "نقسم العامل الثاني بالطريقة نفسها",
          "en": "Split the second factor in the same way",
          "fr": "Décomposer le deuxième facteur de la même façon"
        }
      },
      {
        "n": 3,
        "text": {
          "ar": "نحسب مساحة كل جزء",
          "en": "Calculate each partial area",
          "fr": "Calculer chaque aire partielle"
        }
      },
      {
        "n": 4,
        "text": {
          "ar": "نجمع المساحات للحصول على الناتج",
          "en": "Add the areas to get the product",
          "fr": "Additionner les aires pour obtenir le produit"
        }
      }
    ],
    "hotspots": [
      {
        "n": 1,
        "x": 0.34,
        "y": 0.193
      },
      {
        "n": 2,
        "x": 0.819,
        "y": 0.193
      },
      {
        "n": 3,
        "x": 0.34,
        "y": 0.61
      },
      {
        "n": 4,
        "x": 0.819,
        "y": 0.61
      }
    ],
    "displayDurationMs": 12000,
    "branding": {
      "palette": "math",
      "watermark": {
        "ar": "مس نور",
        "en": "Miss Noor",
        "fr": "Miss Noor"
      }
    },
    "source": {
      "origin": "authored_svg",
      "author": "Miss Noor media pipeline",
      "license": "Project-owned (Apache-2.0)",
      "attribution": "Drawn from Egyptian Ministry Grade 5 Mathematics — Unit 3, Lesson 1."
    },
    "review": {
      "status": "reviewed",
      "reviewedBy": "assistant-audit",
      "notes": "Numbered callouts, localized legend, matching hotspots and text-free SVG checked against the curriculum concept."
    }
  },
  {
    "id": "math_decimal_expanded_form",
    "type": "image",
    "kind": "diagram",
    "lessonId": "off_math_u1_l3",
    "conceptId": "off_math_u1_l3_c1",
    "subjectId": "subj_math",
    "reelKind": "teach_card",
    "curriculumRef": "Egyptian Ministry Grade 5 Mathematics — Unit 1, Lesson 3",
    "src": "media/math/decimal_expanded_form.svg",
    "mimeType": "image/svg+xml",
    "width": 960,
    "height": 600,
    "title": {
      "ar": "تحليل العدد العشري إلى قيم منازله",
      "en": "Expanded form of a decimal",
      "fr": "Décomposition d’un nombre décimal"
    },
    "purpose": {
      "ar": "تفكيك العدد العشري إلى مجموع العشرات والآحاد والأعشار والأجزاء من مئة.",
      "en": "Break a decimal into tens, ones, tenths and hundredths.",
      "fr": "Décomposer un décimal en dizaines, unités, dixièmes et centièmes."
    },
    "alt": {
      "ar": "خمسة أجزاء مرقمة تعرض أعمدة القيم المكانية ثم الأجزاء المنفصلة ومجموعها.",
      "en": "Five numbered panels show place-value bars, separated parts and their sum.",
      "fr": "Cinq panneaux numérotés montrent les rangs, les parties séparées puis leur somme."
    },
    "legend": [
      {
        "n": 1,
        "text": {
          "ar": "العشرات مجموعات من عشرة",
          "en": "Tens are groups of ten",
          "fr": "Les dizaines sont des groupes de dix"
        }
      },
      {
        "n": 2,
        "text": {
          "ar": "الآحاد وحدات كاملة",
          "en": "Ones are whole units",
          "fr": "Les unités sont des unités entières"
        }
      },
      {
        "n": 3,
        "text": {
          "ar": "الأعشار بعد الفاصلة مباشرة",
          "en": "Tenths come just after the decimal point",
          "fr": "Les dixièmes suivent la virgule"
        }
      },
      {
        "n": 4,
        "text": {
          "ar": "الأجزاء من مئة أصغر من الأعشار",
          "en": "Hundredths are smaller than tenths",
          "fr": "Les centièmes sont plus petits que les dixièmes"
        }
      },
      {
        "n": 5,
        "text": {
          "ar": "نجمع قيم المنازل لتكوين العدد",
          "en": "Add place values to form the number",
          "fr": "Additionner les rangs pour former le nombre"
        }
      }
    ],
    "hotspots": [
      {
        "n": 1,
        "x": 0.246,
        "y": 0.193
      },
      {
        "n": 2,
        "x": 0.579,
        "y": 0.193
      },
      {
        "n": 3,
        "x": 0.912,
        "y": 0.193
      },
      {
        "n": 4,
        "x": 0.412,
        "y": 0.61
      },
      {
        "n": 5,
        "x": 0.746,
        "y": 0.61
      }
    ],
    "displayDurationMs": 12000,
    "branding": {
      "palette": "math",
      "watermark": {
        "ar": "مس نور",
        "en": "Miss Noor",
        "fr": "Miss Noor"
      }
    },
    "source": {
      "origin": "authored_svg",
      "author": "Miss Noor media pipeline",
      "license": "Project-owned (Apache-2.0)",
      "attribution": "Drawn from Egyptian Ministry Grade 5 Mathematics — Unit 1, Lesson 3."
    },
    "review": {
      "status": "reviewed",
      "reviewedBy": "assistant-audit",
      "notes": "Numbered callouts, localized legend, matching hotspots and text-free SVG checked against the curriculum concept."
    }
  },
  {
    "id": "ict_technical_troubleshooting",
    "type": "image",
    "kind": "diagram",
    "lessonId": "off_ict_u1_l4",
    "conceptId": "off_ict_u1_l4_c1",
    "subjectId": "subj_ict",
    "reelKind": "teach_card",
    "curriculumRef": "Egyptian Ministry Grade 5 ICT — Unit 1, Lesson 4",
    "src": "media/ict/technical_troubleshooting.svg",
    "mimeType": "image/svg+xml",
    "width": 960,
    "height": 600,
    "title": {
      "ar": "خطوات حل المشكلات التقنية",
      "en": "Technical troubleshooting steps",
      "fr": "Étapes de dépannage informatique"
    },
    "purpose": {
      "ar": "تحديد المشكلة ووضع خطة وتجربة حل ثم مراجعة النتيجة وطلب المساعدة.",
      "en": "Identify a problem, plan, test a solution, then review and ask for help.",
      "fr": "Identifier le problème, planifier, tester une solution puis vérifier et demander de l’aide."
    },
    "alt": {
      "ar": "أربع مراحل مرقمة من اكتشاف العطل إلى التخطيط والتجربة ومراجعة النتيجة.",
      "en": "Four numbered stages move from finding a fault to planning, testing and reviewing.",
      "fr": "Quatre étapes numérotées vont de la détection à la planification, au test et à la vérification."
    },
    "legend": [
      {
        "n": 1,
        "text": {
          "ar": "نحدد المشكلة بوضوح",
          "en": "Identify the problem clearly",
          "fr": "Identifier clairement le problème"
        }
      },
      {
        "n": 2,
        "text": {
          "ar": "نخطط لحل مناسب",
          "en": "Plan a suitable solution",
          "fr": "Prévoir une solution adaptée"
        }
      },
      {
        "n": 3,
        "text": {
          "ar": "نجرب خطوة واحدة في كل مرة",
          "en": "Test one step at a time",
          "fr": "Tester une étape à la fois"
        }
      },
      {
        "n": 4,
        "text": {
          "ar": "نراجع النتيجة ونطلب المساعدة",
          "en": "Review the result and ask for help",
          "fr": "Vérifier le résultat et demander de l’aide"
        }
      }
    ],
    "hotspots": [
      {
        "n": 1,
        "x": 0.34,
        "y": 0.193
      },
      {
        "n": 2,
        "x": 0.819,
        "y": 0.193
      },
      {
        "n": 3,
        "x": 0.34,
        "y": 0.61
      },
      {
        "n": 4,
        "x": 0.819,
        "y": 0.61
      }
    ],
    "displayDurationMs": 12000,
    "branding": {
      "palette": "noor-core",
      "watermark": {
        "ar": "مس نور",
        "en": "Miss Noor",
        "fr": "Miss Noor"
      }
    },
    "source": {
      "origin": "authored_svg",
      "author": "Miss Noor media pipeline",
      "license": "Project-owned (Apache-2.0)",
      "attribution": "Drawn from Egyptian Ministry Grade 5 ICT — Unit 1, Lesson 4."
    },
    "review": {
      "status": "reviewed",
      "reviewedBy": "assistant-audit",
      "notes": "Numbered callouts, localized legend, matching hotspots and text-free SVG checked against the curriculum concept."
    }
  },
  {
    "id": "math_decimal_thousandths",
    "type": "image",
    "kind": "diagram",
    "lessonId": "off_math_u1_l1",
    "conceptId": "off_math_u1_l1_c1",
    "subjectId": "subj_math",
    "reelKind": "teach_card",
    "curriculumRef": "Egyptian Ministry Grade 5 Mathematics — Unit 1, Lesson 1",
    "src": "media/math/decimal_thousandths.svg",
    "mimeType": "image/svg+xml",
    "width": 960,
    "height": 600,
    "title": {
      "ar": "القيمة المكانية حتى خانة الألف",
      "en": "Decimal place value to thousandths",
      "fr": "Valeur décimale jusqu’aux millièmes"
    },
    "purpose": {
      "ar": "يوضح ترتيب الجزء الصحيح والأعشار والأجزاء من مئة وألف في العدد العشري.",
      "en": "Shows the whole part, tenths, hundredths and thousandths in a decimal.",
      "fr": "Présente la partie entière, les dixièmes, les centièmes et les millièmes."
    },
    "alt": {
      "ar": "أربع بطاقات مرقمة تعرض أعمدة للقيمة المكانية وفاصلة عشرية.",
      "en": "Four numbered cards show place-value columns and a decimal separator.",
      "fr": "Quatre cartes numérotées montrent les rangs et la virgule décimale."
    },
    "legend": [
      {
        "n": 1,
        "text": {
          "ar": "الجزء الصحيح وحدات كاملة",
          "en": "The whole part contains full units",
          "fr": "La partie entière contient les unités"
        }
      },
      {
        "n": 2,
        "text": {
          "ar": "الفاصلة تفصل الصحيح عن العشري",
          "en": "The decimal point separates whole and decimal parts",
          "fr": "La virgule sépare les parties entière et décimale"
        }
      },
      {
        "n": 3,
        "text": {
          "ar": "الأعشار: عشرة أجزاء متساوية",
          "en": "Tenths: ten equal parts",
          "fr": "Dixièmes : dix parts égales"
        }
      },
      {
        "n": 4,
        "text": {
          "ar": "الأجزاء من مئة وألف أجزاء أدق",
          "en": "Hundredths and thousandths are smaller parts",
          "fr": "Centièmes et millièmes : des parts plus petites"
        }
      }
    ],
    "hotspots": [
      {
        "n": 1,
        "x": 0.34,
        "y": 0.193
      },
      {
        "n": 2,
        "x": 0.819,
        "y": 0.193
      },
      {
        "n": 3,
        "x": 0.34,
        "y": 0.61
      },
      {
        "n": 4,
        "x": 0.819,
        "y": 0.61
      }
    ],
    "displayDurationMs": 12000,
    "branding": {
      "palette": "math",
      "watermark": {
        "ar": "مس نور",
        "en": "Miss Noor",
        "fr": "Miss Noor"
      }
    },
    "source": {
      "origin": "authored_svg",
      "author": "Miss Noor media pipeline",
      "license": "Project-owned (Apache-2.0)",
      "attribution": "Drawn from Egyptian Ministry Grade 5 Mathematics — Unit 1, Lesson 1."
    },
    "review": {
      "status": "reviewed",
      "reviewedBy": "assistant-audit",
      "notes": "Numbered callouts, localized legend, matching hotspots and text-free SVG checked against the curriculum concept."
    }
  },
  {
    "id": "ict_digital_file_management",
    "type": "image",
    "kind": "concept_map",
    "lessonId": "off_ict_u1_l5",
    "conceptId": "off_ict_u1_l5_c1",
    "subjectId": "subj_ict",
    "reelKind": "teach_card",
    "curriculumRef": "Egyptian Ministry Grade 5 ICT — Unit 1, Lesson 5",
    "src": "media/ict/digital_file_management.svg",
    "mimeType": "image/svg+xml",
    "width": 960,
    "height": 600,
    "title": {
      "ar": "إدارة الملفات الرقمية بأمان",
      "en": "Digital file management and safe storage",
      "fr": "Gestion des fichiers et stockage sécurisé"
    },
    "purpose": {
      "ar": "تنظيم الملفات في مجلدات واضحة وحفظها بأمان وتجنب وحدات التخزين المجهولة.",
      "en": "Organise files in clear folders, store them safely and avoid unknown storage devices.",
      "fr": "Organiser les fichiers, les conserver en sécurité et éviter les supports inconnus."
    },
    "alt": {
      "ar": "أربع لوحات مرقمة تعرض مجلدا وملفات مرتبة وقفل حماية ووحدة تخزين مجهولة.",
      "en": "Four numbered panels show a folder, organised files, a lock and an unknown storage device.",
      "fr": "Quatre panneaux montrent un dossier, des fichiers rangés, un cadenas et un support inconnu."
    },
    "legend": [
      {
        "n": 1,
        "text": {
          "ar": "ننشئ مجلدات بأسماء واضحة",
          "en": "Create folders with clear names",
          "fr": "Créer des dossiers aux noms clairs"
        }
      },
      {
        "n": 2,
        "text": {
          "ar": "نرتب الملفات في المجلد المناسب",
          "en": "Organise files in the right folder",
          "fr": "Ranger les fichiers dans le bon dossier"
        }
      },
      {
        "n": 3,
        "text": {
          "ar": "نحفظ الملفات في مكان آمن",
          "en": "Store files in a safe place",
          "fr": "Conserver les fichiers en lieu sûr"
        }
      },
      {
        "n": 4,
        "text": {
          "ar": "نتجنب وحدات التخزين المجهولة",
          "en": "Avoid unknown storage devices",
          "fr": "Éviter les supports inconnus"
        }
      }
    ],
    "hotspots": [
      {
        "n": 1,
        "x": 0.34,
        "y": 0.193
      },
      {
        "n": 2,
        "x": 0.819,
        "y": 0.193
      },
      {
        "n": 3,
        "x": 0.34,
        "y": 0.61
      },
      {
        "n": 4,
        "x": 0.819,
        "y": 0.61
      }
    ],
    "displayDurationMs": 12000,
    "branding": {
      "palette": "noor-core",
      "watermark": {
        "ar": "مس نور",
        "en": "Miss Noor",
        "fr": "Miss Noor"
      }
    },
    "source": {
      "origin": "authored_svg",
      "author": "Miss Noor media pipeline",
      "license": "Project-owned (Apache-2.0)",
      "attribution": "Drawn from Egyptian Ministry Grade 5 ICT — Unit 1, Lesson 5."
    },
    "review": {
      "status": "reviewed",
      "reviewedBy": "assistant-audit",
      "notes": "Numbered callouts, localized legend, matching hotspots and text-free SVG checked against the curriculum concept."
    }
  },
  {
    "id": "math_equivalent_fractions",
    "type": "image",
    "kind": "diagram",
    "lessonId": "off_mathfr_u2_l1_fractions",
    "conceptId": "conc_mathfr_u2_l1_regle_or",
    "subjectId": "subj_math",
    "reelKind": "hook_question",
    "curriculumRef": "Grade 5 French-track Mathematics — Unité 2, Fractions équivalentes",
    "src": "media/math/equivalent_fractions_rule.svg",
    "mimeType": "image/svg+xml",
    "width": 960,
    "height": 600,
    "title": {
      "ar": "قاعدة الكسور المتكافئة",
      "en": "Equivalent fractions rule",
      "fr": "Règle des fractions équivalentes"
    },
    "purpose": {
      "ar": "ضرب البسط والمقام أو قسمتهما على العدد نفسه يحافظ على قيمة الكسر.",
      "en": "Multiplying or dividing the numerator and denominator by the same number preserves the fraction’s value.",
      "fr": "Multiplier ou diviser le numérateur et le dénominateur par le même nombre conserve la valeur."
    },
    "alt": {
      "ar": "أربع مراحل تعرض دائرتين مقسمتين إلى أجزاء متساوية وسهما يربط كسرين متكافئين.",
      "en": "Four stages show two fraction circles divided into equal parts and an arrow linking equivalent fractions.",
      "fr": "Quatre étapes montrent deux cercles fractionnés et une flèche reliant des fractions équivalentes."
    },
    "legend": [
      {
        "n": 1,
        "text": {
          "ar": "الكسر الأول يمثل أجزاء من الكل",
          "en": "The first fraction represents parts of a whole",
          "fr": "La première fraction représente des parts d’un tout"
        }
      },
      {
        "n": 2,
        "text": {
          "ar": "نضرب البسط والمقام بالعدد نفسه",
          "en": "Multiply numerator and denominator by the same number",
          "fr": "Multiplier le numérateur et le dénominateur par le même nombre"
        }
      },
      {
        "n": 3,
        "text": {
          "ar": "أو نقسمهما على العدد نفسه",
          "en": "Or divide both by the same number",
          "fr": "Ou diviser les deux par le même nombre"
        }
      },
      {
        "n": 4,
        "text": {
          "ar": "القيمة تبقى متساوية",
          "en": "The value stays equal",
          "fr": "La valeur reste égale"
        }
      }
    ],
    "hotspots": [
      {
        "n": 1,
        "x": 0.34,
        "y": 0.193
      },
      {
        "n": 2,
        "x": 0.819,
        "y": 0.193
      },
      {
        "n": 3,
        "x": 0.34,
        "y": 0.61
      },
      {
        "n": 4,
        "x": 0.819,
        "y": 0.61
      }
    ],
    "displayDurationMs": 12000,
    "branding": {
      "palette": "math",
      "watermark": {
        "ar": "مس نور",
        "en": "Miss Noor",
        "fr": "Miss Noor"
      }
    },
    "source": {
      "origin": "authored_svg",
      "author": "Miss Noor media pipeline",
      "license": "Project-owned (Apache-2.0)",
      "attribution": "Drawn from Grade 5 French-track Mathematics — Unité 2, Fractions équivalentes."
    },
    "review": {
      "status": "reviewed",
      "reviewedBy": "assistant-audit",
      "notes": "Numbered callouts, localized legend, matching hotspots and text-free SVG checked against the curriculum concept."
    }
  },
  {
    "id": "ict_academic_citation",
    "type": "image",
    "kind": "concept_map",
    "lessonId": "off_ict_u2_l6",
    "conceptId": "off_ict_u2_l6_c1",
    "subjectId": "subj_ict",
    "reelKind": "teach_card",
    "curriculumRef": "Egyptian Ministry Grade 5 ICT — Unit 2, Lesson 6",
    "src": "media/ict/academic_citation_honesty.svg",
    "mimeType": "image/svg+xml",
    "width": 960,
    "height": 600,
    "title": {
      "ar": "التوثيق والأمانة العلمية",
      "en": "Academic citation and honesty",
      "fr": "Citation et honnêteté intellectuelle"
    },
    "purpose": {
      "ar": "استخدام مصدر موثوق والاقتباس وإعادة الصياغة ثم تسجيل المرجع.",
      "en": "Use a trustworthy source, quote, paraphrase and record the reference.",
      "fr": "Utiliser une source fiable, citer, reformuler puis noter la référence."
    },
    "alt": {
      "ar": "أربع بطاقات لكتاب مصدر وفقاعة اقتباس وملاحظة معاد صياغتها وقائمة مراجع.",
      "en": "Four cards show a source book, quotation bubble, paraphrased note and reference list.",
      "fr": "Quatre cartes montrent un livre source, une citation, une note reformulée et une bibliographie."
    },
    "legend": [
      {
        "n": 1,
        "text": {
          "ar": "نبدأ بمصدر موثوق",
          "en": "Start with a trustworthy source",
          "fr": "Commencer par une source fiable"
        }
      },
      {
        "n": 2,
        "text": {
          "ar": "نضع الكلام المنقول بين علامتي اقتباس",
          "en": "Put copied words in quotation marks",
          "fr": "Mettre les mots repris entre guillemets"
        }
      },
      {
        "n": 3,
        "text": {
          "ar": "نعيد الصياغة بكلماتنا مع حفظ المعنى",
          "en": "Paraphrase in our own words without changing meaning",
          "fr": "Reformuler sans changer le sens"
        }
      },
      {
        "n": 4,
        "text": {
          "ar": "نسجل المرجع لننسب الفكرة لصاحبها",
          "en": "Record the reference to credit the source",
          "fr": "Noter la référence pour créditer la source"
        }
      }
    ],
    "hotspots": [
      {
        "n": 1,
        "x": 0.34,
        "y": 0.193
      },
      {
        "n": 2,
        "x": 0.819,
        "y": 0.193
      },
      {
        "n": 3,
        "x": 0.34,
        "y": 0.61
      },
      {
        "n": 4,
        "x": 0.819,
        "y": 0.61
      }
    ],
    "displayDurationMs": 12000,
    "branding": {
      "palette": "noor-core",
      "watermark": {
        "ar": "مس نور",
        "en": "Miss Noor",
        "fr": "Miss Noor"
      }
    },
    "source": {
      "origin": "authored_svg",
      "author": "Miss Noor media pipeline",
      "license": "Project-owned (Apache-2.0)",
      "attribution": "Drawn from Egyptian Ministry Grade 5 ICT — Unit 2, Lesson 6."
    },
    "review": {
      "status": "reviewed",
      "reviewedBy": "assistant-audit",
      "notes": "Numbered callouts, localized legend, matching hotspots and text-free SVG checked against the curriculum concept."
    }
  },
  {
    "id": "ict_iot_assistive",
    "type": "image",
    "kind": "diagram",
    "lessonId": "off_ict_u1_l3",
    "conceptId": "off_ict_u1_l3_c1",
    "subjectId": "subj_ict",
    "reelKind": "teach_card",
    "curriculumRef": "Egyptian Ministry Grade 5 ICT — Unit 1, Lesson 3",
    "src": "media/ict/iot_assistive_technology.svg",
    "mimeType": "image/svg+xml",
    "width": 960,
    "height": 600,
    "title": {
      "ar": "إنترنت الأشياء والتكنولوجيا المساعدة",
      "en": "Internet of Things and assistive technology",
      "fr": "Internet des objets et technologies d’assistance"
    },
    "purpose": {
      "ar": "ربط الأجهزة الذكية واستخدام أدوات مساعدة تدعم الوصول والاستقلال.",
      "en": "Connect smart devices and use assistive tools that improve access and independence.",
      "fr": "Connecter les appareils intelligents et utiliser des outils qui favorisent l’accès et l’autonomie."
    },
    "alt": {
      "ar": "أجهزة منزلية متصلة بشبكة وهاتف ثم واجهة مساعدة تدعم المستخدم.",
      "en": "Smart devices connect to a network and phone, then an assistive interface supports the user.",
      "fr": "Des appareils se connectent à un réseau et à un téléphone, puis une interface adaptée aide l’utilisateur."
    },
    "legend": [
      {
        "n": 1,
        "text": {
          "ar": "الأجهزة الذكية تجمع معلومات",
          "en": "Smart devices collect information",
          "fr": "Les appareils intelligents recueillent des informations"
        }
      },
      {
        "n": 2,
        "text": {
          "ar": "الشبكة تربط الأجهزة",
          "en": "The network connects devices",
          "fr": "Le réseau relie les appareils"
        }
      },
      {
        "n": 3,
        "text": {
          "ar": "التقنية المساعدة تسهل الاستخدام",
          "en": "Assistive technology makes use easier",
          "fr": "La technologie d’assistance facilite l’usage"
        }
      },
      {
        "n": 4,
        "text": {
          "ar": "الهدف دعم الوصول والاستقلال",
          "en": "The goal is access and independence",
          "fr": "L’objectif est l’accès et l’autonomie"
        }
      }
    ],
    "hotspots": [
      {
        "n": 1,
        "x": 0.34,
        "y": 0.193
      },
      {
        "n": 2,
        "x": 0.819,
        "y": 0.193
      },
      {
        "n": 3,
        "x": 0.34,
        "y": 0.61
      },
      {
        "n": 4,
        "x": 0.819,
        "y": 0.61
      }
    ],
    "displayDurationMs": 12000,
    "branding": {
      "palette": "noor-core",
      "watermark": {
        "ar": "مس نور",
        "en": "Miss Noor",
        "fr": "Miss Noor"
      }
    },
    "source": {
      "origin": "authored_svg",
      "author": "Miss Noor media pipeline",
      "license": "Project-owned (Apache-2.0)",
      "attribution": "Drawn from Egyptian Ministry Grade 5 ICT — Unit 1, Lesson 3."
    },
    "review": {
      "status": "reviewed",
      "reviewedBy": "assistant-audit",
      "notes": "Numbered callouts, localized legend, matching hotspots and text-free SVG checked against the curriculum concept."
    }
  },
  {
    "id": "ict_scam_detection",
    "type": "image",
    "kind": "diagram",
    "lessonId": "off_ict_u2_l3",
    "conceptId": "off_ict_u2_l3_c1",
    "subjectId": "subj_ict",
    "reelKind": "teach_card",
    "curriculumRef": "Egyptian Ministry Grade 5 ICT — Unit 2, Lesson 3",
    "src": "media/ict/scam_detection_reporting.svg",
    "mimeType": "image/svg+xml",
    "width": 960,
    "height": 600,
    "title": {
      "ar": "كشف المواقع الاحتيالية والإبلاغ",
      "en": "Detecting scams and reporting",
      "fr": "Détecter les arnaques et les signaler"
    },
    "purpose": {
      "ar": "فحص عنوان الموقع وتجنب الروابط المشبوهة وحماية البيانات والإبلاغ.",
      "en": "Check website addresses, avoid suspicious links, protect data and report scams.",
      "fr": "Vérifier les adresses, éviter les liens suspects, protéger les données et signaler les arnaques."
    },
    "alt": {
      "ar": "رسالة تحذير وعدسة تفحص العنوان ودرع يمنع الرابط وهاتف للإبلاغ.",
      "en": "A warning message, magnifier checking an address, shield blocking a link and phone for reporting.",
      "fr": "Un message d’alerte, une loupe, un bouclier bloquant un lien et un téléphone pour signaler."
    },
    "legend": [
      {
        "n": 1,
        "text": {
          "ar": "ننتبه للجوائز والتهديدات المفاجئة",
          "en": "Watch for unexpected prizes and threats",
          "fr": "Se méfier des prix et menaces inattendus"
        }
      },
      {
        "n": 2,
        "text": {
          "ar": "نفحص عنوان الموقع والمرسل",
          "en": "Check the website address and sender",
          "fr": "Vérifier l’adresse du site et l’expéditeur"
        }
      },
      {
        "n": 3,
        "text": {
          "ar": "لا نضغط ولا نشارك البيانات",
          "en": "Do not click or share personal data",
          "fr": "Ne pas cliquer ni partager ses données"
        }
      },
      {
        "n": 4,
        "text": {
          "ar": "نخبر شخصا موثوقا ونبلغ",
          "en": "Tell a trusted person and report it",
          "fr": "Prévenir une personne de confiance et signaler"
        }
      }
    ],
    "hotspots": [
      {
        "n": 1,
        "x": 0.34,
        "y": 0.193
      },
      {
        "n": 2,
        "x": 0.819,
        "y": 0.193
      },
      {
        "n": 3,
        "x": 0.34,
        "y": 0.61
      },
      {
        "n": 4,
        "x": 0.819,
        "y": 0.61
      }
    ],
    "displayDurationMs": 12000,
    "branding": {
      "palette": "noor-core",
      "watermark": {
        "ar": "مس نور",
        "en": "Miss Noor",
        "fr": "Miss Noor"
      }
    },
    "source": {
      "origin": "authored_svg",
      "author": "Miss Noor media pipeline",
      "license": "Project-owned (Apache-2.0)",
      "attribution": "Drawn from Egyptian Ministry Grade 5 ICT — Unit 2, Lesson 3."
    },
    "review": {
      "status": "reviewed",
      "reviewedBy": "assistant-audit",
      "notes": "Numbered callouts, localized legend, matching hotspots and text-free SVG checked against the curriculum concept."
    }
  },
  {
    "id": "math_decimal_powers_ten",
    "type": "image",
    "kind": "diagram",
    "lessonId": "off_mathfr_u3_l1_division",
    "conceptId": "conc_mathfr_u3_l1_puissance10",
    "subjectId": "subj_math",
    "reelKind": "hook_question",
    "curriculumRef": "Grade 5 French-track Mathematics — Unité 3, Puissances de dix",
    "src": "media/math/decimal_powers_of_ten.svg",
    "mimeType": "image/svg+xml",
    "width": 960,
    "height": 600,
    "title": {
      "ar": "ضرب الأعداد العشرية في قوى العشرة",
      "en": "Multiplying decimals by powers of ten",
      "fr": "Multiplier les décimaux par des puissances de dix"
    },
    "purpose": {
      "ar": "تحريك الفاصلة يمينا منزلة أو منزلتين أو ثلاثا عند الضرب في 10 أو 100 أو 1000.",
      "en": "Shift the decimal point right one, two or three places when multiplying by 10, 100 or 1000.",
      "fr": "Déplacer la virgule d’un, deux ou trois rangs vers la droite en multipliant par 10, 100 ou 1000."
    },
    "alt": {
      "ar": "ثلاث لوحات مرقمة تعرض الفاصلة قبل الضرب وبعد انتقالها إلى اليمين.",
      "en": "Three numbered panels show a decimal point before and after shifting right.",
      "fr": "Trois panneaux montrent la virgule avant et après son déplacement vers la droite."
    },
    "legend": [
      {
        "n": 1,
        "text": {
          "ar": "الضرب في 10 يحرك الفاصلة منزلة",
          "en": "Multiplying by 10 shifts one place",
          "fr": "Multiplier par 10 décale d’un rang"
        }
      },
      {
        "n": 2,
        "text": {
          "ar": "الضرب في 100 يحركها منزلتين",
          "en": "Multiplying by 100 shifts two places",
          "fr": "Multiplier par 100 décale de deux rangs"
        }
      },
      {
        "n": 3,
        "text": {
          "ar": "الضرب في 1000 يحركها ثلاث منازل",
          "en": "Multiplying by 1000 shifts three places",
          "fr": "Multiplier par 1000 décale de trois rangs"
        }
      }
    ],
    "hotspots": [
      {
        "n": 1,
        "x": 0.267,
        "y": 0.393
      },
      {
        "n": 2,
        "x": 0.579,
        "y": 0.393
      },
      {
        "n": 3,
        "x": 0.892,
        "y": 0.393
      }
    ],
    "displayDurationMs": 12000,
    "branding": {
      "palette": "math",
      "watermark": {
        "ar": "مس نور",
        "en": "Miss Noor",
        "fr": "Miss Noor"
      }
    },
    "source": {
      "origin": "authored_svg",
      "author": "Miss Noor media pipeline",
      "license": "Project-owned (Apache-2.0)",
      "attribution": "Drawn from Grade 5 French-track Mathematics — Unité 3, Puissances de dix."
    },
    "review": {
      "status": "reviewed",
      "reviewedBy": "assistant-audit",
      "notes": "Numbered callouts, localized legend, matching hotspots and text-free SVG checked against the curriculum concept."
    }
  },
  {
    "id": "math_decimal_comparison",
    "type": "image",
    "kind": "number_line",
    "lessonId": "off_mathfr_u1_l2_comparer",
    "conceptId": "conc_mathfr_u1_l2_comparaison",
    "subjectId": "subj_math",
    "reelKind": "hook_question",
    "curriculumRef": "Grade 5 French-track Mathematics — Unité 1, Comparer les décimaux",
    "src": "media/math/decimal_comparison_zero_padding.svg",
    "mimeType": "image/svg+xml",
    "width": 960,
    "height": 600,
    "title": {
      "ar": "مقارنة الأعداد العشرية",
      "en": "Comparing decimals with zero padding",
      "fr": "Comparer les décimaux avec des zéros"
    },
    "purpose": {
      "ar": "محاذاة الفواصل ثم مقارنة الجزء الصحيح والخانات العشرية من اليسار إلى اليمين.",
      "en": "Align decimal points, then compare whole and decimal places from left to right.",
      "fr": "Aligner les virgules puis comparer les rangs de gauche à droite."
    },
    "alt": {
      "ar": "أربع مراحل لمحاذاة عددين عشريين وإضافة أصفار ثم مقارنة الخانات.",
      "en": "Four stages align two decimals, add zeros and compare place values.",
      "fr": "Quatre étapes alignent deux décimaux, ajoutent des zéros puis comparent les rangs."
    },
    "legend": [
      {
        "n": 1,
        "text": {
          "ar": "نقارن الجزء الصحيح أولا",
          "en": "Compare the whole parts first",
          "fr": "Comparer d’abord les parties entières"
        }
      },
      {
        "n": 2,
        "text": {
          "ar": "نحاذي الفاصلتين",
          "en": "Align the decimal points",
          "fr": "Aligner les virgules"
        }
      },
      {
        "n": 3,
        "text": {
          "ar": "نضيف أصفارا لإكمال الخانات",
          "en": "Add zeros to complete the places",
          "fr": "Ajouter des zéros pour compléter les rangs"
        }
      },
      {
        "n": 4,
        "text": {
          "ar": "نقارن من اليسار إلى اليمين",
          "en": "Compare from left to right",
          "fr": "Comparer de gauche à droite"
        }
      }
    ],
    "hotspots": [
      {
        "n": 1,
        "x": 0.34,
        "y": 0.193
      },
      {
        "n": 2,
        "x": 0.819,
        "y": 0.193
      },
      {
        "n": 3,
        "x": 0.34,
        "y": 0.61
      },
      {
        "n": 4,
        "x": 0.819,
        "y": 0.61
      }
    ],
    "displayDurationMs": 12000,
    "branding": {
      "palette": "math",
      "watermark": {
        "ar": "مس نور",
        "en": "Miss Noor",
        "fr": "Miss Noor"
      }
    },
    "source": {
      "origin": "authored_svg",
      "author": "Miss Noor media pipeline",
      "license": "Project-owned (Apache-2.0)",
      "attribution": "Drawn from Grade 5 French-track Mathematics — Unité 1, Comparer les décimaux."
    },
    "review": {
      "status": "reviewed",
      "reviewedBy": "assistant-audit",
      "notes": "Numbered callouts, localized legend, matching hotspots and text-free SVG checked against the curriculum concept."
    }
  },
  {
    "id": "math_decimal_zero_completion",
    "type": "image",
    "kind": "diagram",
    "lessonId": "off_mathfr_u3_l1_division",
    "conceptId": "conc_mathfr_u3_l1_zero_ajoute",
    "subjectId": "subj_math",
    "reelKind": "hook_question",
    "curriculumRef": "Grade 5 French-track Mathematics — Unité 3, Puissances de dix",
    "src": "media/math/decimal_zero_completion.svg",
    "mimeType": "image/svg+xml",
    "width": 960,
    "height": 600,
    "title": {
      "ar": "إضافة الأصفار عند انتهاء الخانات",
      "en": "Adding zeros when decimal places run out",
      "fr": "Ajouter des zéros quand les rangs manquent"
    },
    "purpose": {
      "ar": "إضافة أصفار إلى يمين العدد عندما يتجاوز تحريك الفاصلة عدد الخانات المتاحة.",
      "en": "Add zeros to the right when shifting the decimal point goes beyond available digits.",
      "fr": "Ajouter des zéros à droite lorsque le déplacement dépasse les chiffres disponibles."
    },
    "alt": {
      "ar": "ثلاث مراحل لعدد عشري تتحرك فيه الفاصلة ثم تضاف أصفار إلى اليمين.",
      "en": "Three stages show a decimal shifting and zeros being added on the right.",
      "fr": "Trois étapes montrent un décimal qui se déplace puis des zéros ajoutés à droite."
    },
    "legend": [
      {
        "n": 1,
        "text": {
          "ar": "نبدأ بالعدد العشري",
          "en": "Start with the decimal number",
          "fr": "Commencer par le nombre décimal"
        }
      },
      {
        "n": 2,
        "text": {
          "ar": "نحرك الفاصلة حسب قوة العشرة",
          "en": "Shift the decimal point by the power of ten",
          "fr": "Déplacer la virgule selon la puissance de dix"
        }
      },
      {
        "n": 3,
        "text": {
          "ar": "نضيف أصفارا إذا انتهت الخانات",
          "en": "Add zeros when digits run out",
          "fr": "Ajouter des zéros lorsque les chiffres manquent"
        }
      }
    ],
    "hotspots": [
      {
        "n": 1,
        "x": 0.267,
        "y": 0.393
      },
      {
        "n": 2,
        "x": 0.579,
        "y": 0.393
      },
      {
        "n": 3,
        "x": 0.892,
        "y": 0.393
      }
    ],
    "displayDurationMs": 12000,
    "branding": {
      "palette": "math",
      "watermark": {
        "ar": "مس نور",
        "en": "Miss Noor",
        "fr": "Miss Noor"
      }
    },
    "source": {
      "origin": "authored_svg",
      "author": "Miss Noor media pipeline",
      "license": "Project-owned (Apache-2.0)",
      "attribution": "Drawn from Grade 5 French-track Mathematics — Unité 3, Puissances de dix."
    },
    "review": {
      "status": "reviewed",
      "reviewedBy": "assistant-audit",
      "notes": "Numbered callouts, localized legend, matching hotspots and text-free SVG checked against the curriculum concept."
    }
  },
  {
    "id": "science_particle_movement",
    "type": "image",
    "kind": "diagram",
    "lessonId": "off_scifr_u2_l1_matiere",
    "conceptId": "conc_scifr_u2_l1_mouvement",
    "subjectId": "subj_science",
    "reelKind": "hook_question",
    "curriculumRef": "Grade 5 French-track Science — Unité 2, Les états de la matière",
    "src": "media/science/particle_movement_states.svg",
    "mimeType": "image/svg+xml",
    "width": 960,
    "height": 600,
    "title": {
      "ar": "حركة الجسيمات وحالات المادة",
      "en": "Particle movement and states of matter",
      "fr": "Mouvement des particules et états de la matière"
    },
    "purpose": {
      "ar": "مقارنة ترتيب الجسيمات وحركتها في الصلب والسائل والغاز.",
      "en": "Compare particle spacing and movement in solids, liquids and gases.",
      "fr": "Comparer l’espacement et le mouvement des particules dans les solides, liquides et gaz."
    },
    "alt": {
      "ar": "ثلاث حجرات تعرض جسيمات متراصة في الصلب ومتقاربة في السائل ومتباعدة في الغاز.",
      "en": "Three chambers show tightly packed solid particles, close liquid particles and widely spaced gas particles.",
      "fr": "Trois compartiments montrent des particules serrées, proches puis éloignées."
    },
    "legend": [
      {
        "n": 1,
        "text": {
          "ar": "الصلب: جسيمات متراصة تهتز",
          "en": "Solid: tightly packed particles vibrate",
          "fr": "Solide : particules serrées qui vibrent"
        }
      },
      {
        "n": 2,
        "text": {
          "ar": "السائل: جسيمات متقاربة تنزلق",
          "en": "Liquid: close particles slide",
          "fr": "Liquide : particules proches qui glissent"
        }
      },
      {
        "n": 3,
        "text": {
          "ar": "الغاز: جسيمات متباعدة تتحرك بحرية",
          "en": "Gas: spaced particles move freely",
          "fr": "Gaz : particules éloignées qui bougent librement"
        }
      }
    ],
    "hotspots": [
      {
        "n": 1,
        "x": 0.267,
        "y": 0.393
      },
      {
        "n": 2,
        "x": 0.579,
        "y": 0.393
      },
      {
        "n": 3,
        "x": 0.892,
        "y": 0.393
      }
    ],
    "displayDurationMs": 12000,
    "branding": {
      "palette": "science",
      "watermark": {
        "ar": "مس نور",
        "en": "Miss Noor",
        "fr": "Miss Noor"
      }
    },
    "source": {
      "origin": "authored_svg",
      "author": "Miss Noor media pipeline",
      "license": "Project-owned (Apache-2.0)",
      "attribution": "Drawn from Grade 5 French-track Science — Unité 2, Les états de la matière."
    },
    "review": {
      "status": "reviewed",
      "reviewedBy": "assistant-audit",
      "notes": "Numbered callouts, localized legend, matching hotspots and text-free SVG checked against the curriculum concept."
    }
  },
  {
    "id": "fr_self_introduction",
    "type": "image",
    "kind": "illustration",
    "lessonId": "off_fr_u1_l1_salutations",
    "conceptId": "conc_fr_u1_l1_presentation",
    "subjectId": "subj_french",
    "reelKind": "story_analogy",
    "curriculumRef": "Grade 5 French — Unité 1, Se présenter",
    "src": "media/language/french_self_introduction.svg",
    "mimeType": "image/svg+xml",
    "width": 960,
    "height": 600,
    "title": {
      "ar": "التعريف بالنفس بالفرنسية",
      "en": "Introducing yourself in French",
      "fr": "Se présenter en français"
    },
    "purpose": {
      "ar": "عرض صيغ s’appeler عند الحديث عن النفس ومخاطبة شخص ووصف شخص آخر.",
      "en": "Shows s’appeler when speaking about yourself, addressing someone and describing another person.",
      "fr": "Présente s’appeler pour parler de soi, s’adresser à quelqu’un et parler d’une autre personne."
    },
    "alt": {
      "ar": "ثلاثة مشاهد مرقمة لأشخاص يتبادلون التعارف من المتكلم إلى المخاطب ثم الغائب.",
      "en": "Three numbered scenes show a speaker, a person being addressed and another person.",
      "fr": "Trois scènes numérotées montrent le locuteur, l’interlocuteur puis une autre personne."
    },
    "legend": [
      {
        "n": 1,
        "text": {
          "ar": "أنا: Je m’appelle",
          "en": "I: Je m’appelle",
          "fr": "Je : Je m’appelle"
        }
      },
      {
        "n": 2,
        "text": {
          "ar": "أنت: Tu t’appelles",
          "en": "You: Tu t’appelles",
          "fr": "Tu : Tu t’appelles"
        }
      },
      {
        "n": 3,
        "text": {
          "ar": "هو أو هي: Il / Elle s’appelle",
          "en": "He or she: Il / Elle s’appelle",
          "fr": "Il ou elle : Il / Elle s’appelle"
        }
      }
    ],
    "hotspots": [
      {
        "n": 1,
        "x": 0.267,
        "y": 0.393
      },
      {
        "n": 2,
        "x": 0.579,
        "y": 0.393
      },
      {
        "n": 3,
        "x": 0.892,
        "y": 0.393
      }
    ],
    "displayDurationMs": 12000,
    "branding": {
      "palette": "language",
      "watermark": {
        "ar": "مس نور",
        "en": "Miss Noor",
        "fr": "Miss Noor"
      }
    },
    "source": {
      "origin": "authored_svg",
      "author": "Miss Noor media pipeline",
      "license": "Project-owned (Apache-2.0)",
      "attribution": "Drawn from Grade 5 French — Unité 1, Se présenter."
    },
    "review": {
      "status": "reviewed",
      "reviewedBy": "assistant-audit",
      "notes": "Numbered callouts, localized legend, matching hotspots and text-free SVG checked against the curriculum concept."
    }
  },
  {
    "id": "fr_possessive_adjectives",
    "type": "image",
    "kind": "diagram",
    "lessonId": "off_fr_u1_l2_famille",
    "conceptId": "conc_fr_u1_l2_possessifs",
    "subjectId": "subj_french",
    "reelKind": "story_analogy",
    "curriculumRef": "Grade 5 French — Unité 1, Ma famille",
    "src": "media/language/french_possessives.svg",
    "mimeType": "image/svg+xml",
    "width": 960,
    "height": 600,
    "title": {
      "ar": "صفات الملكية Mon وMa وMes",
      "en": "French possessive adjectives",
      "fr": "Les adjectifs possessifs"
    },
    "purpose": {
      "ar": "تمييز mon للمذكر المفرد وma للمؤنث المفرد وmes للجمع.",
      "en": "Distinguish mon for masculine singular, ma for feminine singular and mes for plural.",
      "fr": "Distinguer mon au masculin, ma au féminin et mes au pluriel."
    },
    "alt": {
      "ar": "ثلاث بطاقات مرقمة تعرض شخصا ومفردا مؤنثا ومجموعة للدلالة على صيغ الملكية.",
      "en": "Three numbered cards show a masculine person, a feminine object and a group for possessive forms.",
      "fr": "Trois cartes montrent un nom masculin, un nom féminin et un groupe pour les formes possessives."
    },
    "legend": [
      {
        "n": 1,
        "text": {
          "ar": "Mon مع اسم مذكر مفرد",
          "en": "Mon with a masculine singular noun",
          "fr": "Mon avec un nom masculin singulier"
        }
      },
      {
        "n": 2,
        "text": {
          "ar": "Ma مع اسم مؤنث مفرد",
          "en": "Ma with a feminine singular noun",
          "fr": "Ma avec un nom féminin singulier"
        }
      },
      {
        "n": 3,
        "text": {
          "ar": "Mes مع اسم جمع",
          "en": "Mes with a plural noun",
          "fr": "Mes avec un nom pluriel"
        }
      }
    ],
    "hotspots": [
      {
        "n": 1,
        "x": 0.267,
        "y": 0.393
      },
      {
        "n": 2,
        "x": 0.579,
        "y": 0.393
      },
      {
        "n": 3,
        "x": 0.892,
        "y": 0.393
      }
    ],
    "displayDurationMs": 12000,
    "branding": {
      "palette": "language",
      "watermark": {
        "ar": "مس نور",
        "en": "Miss Noor",
        "fr": "Miss Noor"
      }
    },
    "source": {
      "origin": "authored_svg",
      "author": "Miss Noor media pipeline",
      "license": "Project-owned (Apache-2.0)",
      "attribution": "Drawn from Grade 5 French — Unité 1, Ma famille."
    },
    "review": {
      "status": "reviewed",
      "reviewedBy": "assistant-audit",
      "notes": "Numbered callouts, localized legend, matching hotspots and text-free SVG checked against the curriculum concept."
    }
  },
  {
    "id": "fr_indefinite_articles",
    "type": "image",
    "kind": "diagram",
    "lessonId": "off_fr_u2_l1_classe",
    "conceptId": "conc_fr_u2_l1_articles_indefinis",
    "subjectId": "subj_french",
    "reelKind": "story_analogy",
    "curriculumRef": "Grade 5 French — Unité 2, Les objets de la classe",
    "src": "media/language/french_indefinite_articles.svg",
    "mimeType": "image/svg+xml",
    "width": 960,
    "height": 600,
    "title": {
      "ar": "أدوات النكرة Un وUne وDes",
      "en": "French indefinite articles",
      "fr": "Les articles indéfinis"
    },
    "purpose": {
      "ar": "ربط un بالمذكر المفرد وune بالمؤنث المفرد وdes بالجمع.",
      "en": "Connect un with masculine singular, une with feminine singular and des with plural nouns.",
      "fr": "Associer un au masculin, une au féminin et des au pluriel."
    },
    "alt": {
      "ar": "ثلاث مجموعات مرقمة تعرض أداة مفردة وممحاة مفردة ومجموعة أدوات.",
      "en": "Three numbered groups show one masculine object, one feminine object and several objects.",
      "fr": "Trois groupes montrent un objet masculin, un objet féminin et plusieurs objets."
    },
    "legend": [
      {
        "n": 1,
        "text": {
          "ar": "Un مع اسم مذكر مفرد",
          "en": "Un with a masculine singular noun",
          "fr": "Un avec un nom masculin singulier"
        }
      },
      {
        "n": 2,
        "text": {
          "ar": "Une مع اسم مؤنث مفرد",
          "en": "Une with a feminine singular noun",
          "fr": "Une avec un nom féminin singulier"
        }
      },
      {
        "n": 3,
        "text": {
          "ar": "Des مع أكثر من شيء",
          "en": "Des with plural nouns",
          "fr": "Des avec plusieurs objets"
        }
      }
    ],
    "hotspots": [
      {
        "n": 1,
        "x": 0.267,
        "y": 0.393
      },
      {
        "n": 2,
        "x": 0.579,
        "y": 0.393
      },
      {
        "n": 3,
        "x": 0.892,
        "y": 0.393
      }
    ],
    "displayDurationMs": 12000,
    "branding": {
      "palette": "language",
      "watermark": {
        "ar": "مس نور",
        "en": "Miss Noor",
        "fr": "Miss Noor"
      }
    },
    "source": {
      "origin": "authored_svg",
      "author": "Miss Noor media pipeline",
      "license": "Project-owned (Apache-2.0)",
      "attribution": "Drawn from Grade 5 French — Unité 2, Les objets de la classe."
    },
    "review": {
      "status": "reviewed",
      "reviewedBy": "assistant-audit",
      "notes": "Numbered callouts, localized legend, matching hotspots and text-free SVG checked against the curriculum concept."
    }
  },
  {
    "id": "fr_school_preferences",
    "type": "image",
    "kind": "concept_map",
    "lessonId": "off_fr_u3_l1_horaire",
    "conceptId": "conc_fr_u3_l1_gouts",
    "subjectId": "subj_french",
    "reelKind": "story_analogy",
    "curriculumRef": "Grade 5 French — Unité 3, Mes matières préférées",
    "src": "media/language/french_school_preferences.svg",
    "mimeType": "image/svg+xml",
    "width": 960,
    "height": 600,
    "title": {
      "ar": "التعبير عن الميول المدرسية",
      "en": "Expressing school preferences",
      "fr": "Exprimer ses goûts scolaires"
    },
    "purpose": {
      "ar": "تمييز الإعجاب والتفضيل وعدم الإعجاب باستخدام aimer وpréférer.",
      "en": "Distinguish liking, preferring and not liking using aimer and préférer.",
      "fr": "Distinguer aimer, préférer et ne pas aimer."
    },
    "alt": {
      "ar": "ثلاث رموز مرقمة لقلب ونجمة وعلامة ناقص تمثل الإعجاب والتفضيل وعدم الإعجاب.",
      "en": "Three numbered symbols—a heart, star and minus—represent liking, preferring and not liking.",
      "fr": "Trois symboles — cœur, étoile et signe moins — représentent aimer, préférer et ne pas aimer."
    },
    "legend": [
      {
        "n": 1,
        "text": {
          "ar": "J’aime: أحب المادة",
          "en": "J’aime: I like the subject",
          "fr": "J’aime : j’aime la matière"
        }
      },
      {
        "n": 2,
        "text": {
          "ar": "Je préfère: أفضل هذه المادة",
          "en": "Je préfère: I prefer this subject",
          "fr": "Je préfère : je préfère cette matière"
        }
      },
      {
        "n": 3,
        "text": {
          "ar": "Je n’aime pas: لا أحب",
          "en": "Je n’aime pas: I do not like it",
          "fr": "Je n’aime pas : je n’aime pas"
        }
      }
    ],
    "hotspots": [
      {
        "n": 1,
        "x": 0.267,
        "y": 0.393
      },
      {
        "n": 2,
        "x": 0.579,
        "y": 0.393
      },
      {
        "n": 3,
        "x": 0.892,
        "y": 0.393
      }
    ],
    "displayDurationMs": 12000,
    "branding": {
      "palette": "language",
      "watermark": {
        "ar": "مس نور",
        "en": "Miss Noor",
        "fr": "Miss Noor"
      }
    },
    "source": {
      "origin": "authored_svg",
      "author": "Miss Noor media pipeline",
      "license": "Project-owned (Apache-2.0)",
      "attribution": "Drawn from Grade 5 French — Unité 3, Mes matières préférées."
    },
    "review": {
      "status": "reviewed",
      "reviewedBy": "assistant-audit",
      "notes": "Numbered callouts, localized legend, matching hotspots and text-free SVG checked against the curriculum concept."
    }
  },
  {
    "id": "english_generous_apple_tree",
    "type": "image",
    "kind": "concept_map",
    "lessonId": "off_en_u1_apple_tree",
    "conceptId": "off_en_u1_apple_tree_c1",
    "subjectId": "subj_english",
    "reelKind": "story_analogy",
    "curriculumRef": "English Connect 5 — Unit 1, The Generous Apple Tree",
    "src": "media/english/generous_apple_tree.svg",
    "mimeType": "image/svg+xml",
    "width": 960,
    "height": 600,
    "title": {
      "ar": "شجرة التفاح المعطاءة",
      "en": "The generous apple tree",
      "fr": "Le pommier généreux"
    },
    "purpose": {
      "ar": "ربط عطاء الشجرة بالرعاية غير المشروطة والامتنان لمن نحب.",
      "en": "Connect the tree’s giving with unconditional care and gratitude for loved ones.",
      "fr": "Relier les dons de l’arbre à la générosité et à la gratitude envers les proches."
    },
    "alt": {
      "ar": "شجرة تفاح مرقمة بجذور وثمار ومجموعة أشخاص وقلب يرمز للحب.",
      "en": "A numbered apple tree with roots and fruit beside people and a heart symbolising love.",
      "fr": "Un pommier numéroté avec racines et fruits, des personnes et un cœur symbolisant l’amour."
    },
    "legend": [
      {
        "n": 1,
        "text": {
          "ar": "الشجرة تعطي دون انتظار مقابل",
          "en": "The tree gives without expecting a reward",
          "fr": "L’arbre donne sans attendre de récompense"
        }
      },
      {
        "n": 2,
        "text": {
          "ar": "الثمار تمثل ما نقدمه للآخرين",
          "en": "The fruit represents what we give to others",
          "fr": "Les fruits représentent ce que nous offrons"
        }
      },
      {
        "n": 3,
        "text": {
          "ar": "العائلة والأصدقاء يتلقون الرعاية",
          "en": "Family and friends receive care",
          "fr": "La famille et les amis reçoivent de l’attention"
        }
      },
      {
        "n": 4,
        "text": {
          "ar": "الامتنان يقدر العطاء",
          "en": "Gratitude appreciates generosity",
          "fr": "La gratitude valorise la générosité"
        }
      }
    ],
    "hotspots": [
      {
        "n": 1,
        "x": 0.34,
        "y": 0.193
      },
      {
        "n": 2,
        "x": 0.819,
        "y": 0.193
      },
      {
        "n": 3,
        "x": 0.34,
        "y": 0.61
      },
      {
        "n": 4,
        "x": 0.819,
        "y": 0.61
      }
    ],
    "displayDurationMs": 12000,
    "branding": {
      "palette": "language",
      "watermark": {
        "ar": "مس نور",
        "en": "Miss Noor",
        "fr": "Miss Noor"
      }
    },
    "source": {
      "origin": "authored_svg",
      "author": "Miss Noor media pipeline",
      "license": "Project-owned (Apache-2.0)",
      "attribution": "Drawn from English Connect 5 — Unit 1, The Generous Apple Tree."
    },
    "review": {
      "status": "reviewed",
      "reviewedBy": "assistant-audit",
      "notes": "Numbered callouts, localized legend, matching hotspots and text-free SVG checked against the curriculum concept."
    }
  },
  {
    "id": "english_elephantine_ecotourism",
    "type": "image",
    "kind": "map",
    "lessonId": "off_en_u4_elephantine",
    "conceptId": "off_en_u4_elephantine_c1",
    "subjectId": "subj_english",
    "reelKind": "story_analogy",
    "curriculumRef": "English Connect 5 — Unit 4, Elephantine Island",
    "src": "media/english/elephantine_ecotourism.svg",
    "mimeType": "image/svg+xml",
    "width": 960,
    "height": 600,
    "title": {
      "ar": "جزيرة إلفنتين والسياحة البيئية",
      "en": "Elephantine Island and eco-tourism",
      "fr": "L’île Éléphantine et l’écotourisme"
    },
    "purpose": {
      "ar": "عرض النيل والطبيعة والمعالم التاريخية والسياحة المسؤولة في الجزيرة.",
      "en": "Show the Nile, nature, historic landmarks and responsible tourism on the island.",
      "fr": "Présenter le Nil, la nature, les sites historiques et le tourisme responsable."
    },
    "alt": {
      "ar": "خريطة مبسطة لجزيرة وسط النيل مع معلم تاريخي ونباتات وزوار يحافظون على البيئة.",
      "en": "A simplified Nile island map with a historic landmark, plants and environmentally responsible visitors.",
      "fr": "Une carte simplifiée d’une île du Nil avec un monument, des plantes et des visiteurs responsables."
    },
    "legend": [
      {
        "n": 1,
        "text": {
          "ar": "النيل يحيط بالجزيرة",
          "en": "The Nile surrounds the island",
          "fr": "Le Nil entoure l’île"
        }
      },
      {
        "n": 2,
        "text": {
          "ar": "المعالم تحفظ تاريخ المكان",
          "en": "Landmarks preserve local history",
          "fr": "Les monuments préservent l’histoire locale"
        }
      },
      {
        "n": 3,
        "text": {
          "ar": "الطبيعة موطن للكائنات",
          "en": "Nature is a habitat for living things",
          "fr": "La nature est un habitat pour les êtres vivants"
        }
      },
      {
        "n": 4,
        "text": {
          "ar": "الزائر المسؤول يحافظ على المكان",
          "en": "Responsible visitors protect the place",
          "fr": "Les visiteurs responsables protègent le lieu"
        }
      }
    ],
    "hotspots": [
      {
        "n": 1,
        "x": 0.34,
        "y": 0.193
      },
      {
        "n": 2,
        "x": 0.819,
        "y": 0.193
      },
      {
        "n": 3,
        "x": 0.34,
        "y": 0.61
      },
      {
        "n": 4,
        "x": 0.819,
        "y": 0.61
      }
    ],
    "displayDurationMs": 12000,
    "branding": {
      "palette": "language",
      "watermark": {
        "ar": "مس نور",
        "en": "Miss Noor",
        "fr": "Miss Noor"
      }
    },
    "source": {
      "origin": "authored_svg",
      "author": "Miss Noor media pipeline",
      "license": "Project-owned (Apache-2.0)",
      "attribution": "Drawn from English Connect 5 — Unit 4, Elephantine Island."
    },
    "review": {
      "status": "reviewed",
      "reviewedBy": "assistant-audit",
      "notes": "Numbered callouts, localized legend, matching hotspots and text-free SVG checked against the curriculum concept."
    }
  },
  {
    "id": "ict_internet_intranet",
    "type": "image",
    "kind": "concept_map",
    "lessonId": "off_ict_u1_l2",
    "conceptId": "off_ict_u1_l2_c1",
    "subjectId": "subj_ict",
    "reelKind": "teach_card",
    "curriculumRef": "Egyptian Ministry Grade 5 ICT — Unit 1, Lesson 2",
    "src": "media/ict/internet_vs_intranet.svg",
    "mimeType": "image/svg+xml",
    "width": 960,
    "height": 600,
    "title": {
      "ar": "الإنترنت والإنترانت",
      "en": "Internet versus intranet",
      "fr": "Internet et intranet"
    },
    "purpose": {
      "ar": "مقارنة الشبكة العامة المفتوحة بالشبكة الداخلية الخاصة بمؤسسة.",
      "en": "Compare the public global internet with a private internal organisational network.",
      "fr": "Comparer l’internet public mondial à un réseau interne privé."
    },
    "alt": {
      "ar": "أربع لوحات تقارن كرة أرضية متصلة بالجميع بشبكة مغلقة داخل مؤسسة.",
      "en": "Four panels contrast a globally connected globe with a closed network inside an organisation.",
      "fr": "Quatre panneaux opposent un globe connecté au monde à un réseau fermé dans une organisation."
    },
    "legend": [
      {
        "n": 1,
        "text": {
          "ar": "الإنترنت شبكة عامة واسعة",
          "en": "The internet is a wide public network",
          "fr": "Internet est un vaste réseau public"
        }
      },
      {
        "n": 2,
        "text": {
          "ar": "الأجهزة تتصل عبر العالم",
          "en": "Devices connect across the world",
          "fr": "Les appareils se connectent dans le monde entier"
        }
      },
      {
        "n": 3,
        "text": {
          "ar": "الإنترانت شبكة خاصة مغلقة",
          "en": "An intranet is a private closed network",
          "fr": "L’intranet est un réseau privé fermé"
        }
      },
      {
        "n": 4,
        "text": {
          "ar": "تستخدمها مؤسسة وأعضاؤها المصرح لهم",
          "en": "An organisation and authorised members use it",
          "fr": "Une organisation et ses membres autorisés l’utilisent"
        }
      }
    ],
    "hotspots": [
      {
        "n": 1,
        "x": 0.34,
        "y": 0.193
      },
      {
        "n": 2,
        "x": 0.819,
        "y": 0.193
      },
      {
        "n": 3,
        "x": 0.34,
        "y": 0.61
      },
      {
        "n": 4,
        "x": 0.819,
        "y": 0.61
      }
    ],
    "displayDurationMs": 12000,
    "branding": {
      "palette": "noor-core",
      "watermark": {
        "ar": "مس نور",
        "en": "Miss Noor",
        "fr": "Miss Noor"
      }
    },
    "source": {
      "origin": "authored_svg",
      "author": "Miss Noor media pipeline",
      "license": "Project-owned (Apache-2.0)",
      "attribution": "Drawn from Egyptian Ministry Grade 5 ICT — Unit 1, Lesson 2."
    },
    "review": {
      "status": "reviewed",
      "reviewedBy": "assistant-audit",
      "notes": "Numbered callouts, localized legend, matching hotspots and text-free SVG checked against the curriculum concept."
    }
  },
  {
    "id": "ict_password_mfa",
    "type": "image",
    "kind": "diagram",
    "lessonId": "off_ict_u2_l2",
    "conceptId": "off_ict_u2_l2_c1",
    "subjectId": "subj_ict",
    "reelKind": "teach_card",
    "curriculumRef": "Egyptian Ministry Grade 5 ICT — Unit 2, Lesson 2",
    "src": "media/ict/password_mfa_security.svg",
    "mimeType": "image/svg+xml",
    "width": 960,
    "height": 600,
    "title": {
      "ar": "كلمات المرور القوية والمصادقة المتعددة",
      "en": "Strong passwords and multi-factor authentication",
      "fr": "Mots de passe forts et authentification multifacteur"
    },
    "purpose": {
      "ar": "استخدام كلمة مرور فريدة ومدير كلمات مرور وعامل ثان لحماية الحساب.",
      "en": "Use a unique password, password manager and second factor to protect an account.",
      "fr": "Utiliser un mot de passe unique, un gestionnaire et un second facteur pour protéger un compte."
    },
    "alt": {
      "ar": "أربع رموز لمفتاح وخزانة كلمات مرور وهاتف تحقق ودرع حماية.",
      "en": "Four symbols show a key, password vault, verification phone and security shield.",
      "fr": "Quatre symboles montrent une clé, un coffre, un téléphone de vérification et un bouclier."
    },
    "legend": [
      {
        "n": 1,
        "text": {
          "ar": "كلمة مرور طويلة وفريدة",
          "en": "A long, unique password",
          "fr": "Un mot de passe long et unique"
        }
      },
      {
        "n": 2,
        "text": {
          "ar": "مدير كلمات المرور يحفظها بأمان",
          "en": "A password manager stores them safely",
          "fr": "Un gestionnaire les conserve en sécurité"
        }
      },
      {
        "n": 3,
        "text": {
          "ar": "عامل ثان يؤكد هويتك",
          "en": "A second factor confirms your identity",
          "fr": "Un second facteur confirme ton identité"
        }
      },
      {
        "n": 4,
        "text": {
          "ar": "طبقات الأمان تحمي الحساب",
          "en": "Security layers protect the account",
          "fr": "Les couches de sécurité protègent le compte"
        }
      }
    ],
    "hotspots": [
      {
        "n": 1,
        "x": 0.34,
        "y": 0.193
      },
      {
        "n": 2,
        "x": 0.819,
        "y": 0.193
      },
      {
        "n": 3,
        "x": 0.34,
        "y": 0.61
      },
      {
        "n": 4,
        "x": 0.819,
        "y": 0.61
      }
    ],
    "displayDurationMs": 12000,
    "branding": {
      "palette": "noor-core",
      "watermark": {
        "ar": "مس نور",
        "en": "Miss Noor",
        "fr": "Miss Noor"
      }
    },
    "source": {
      "origin": "authored_svg",
      "author": "Miss Noor media pipeline",
      "license": "Project-owned (Apache-2.0)",
      "attribution": "Drawn from Egyptian Ministry Grade 5 ICT — Unit 2, Lesson 2."
    },
    "review": {
      "status": "reviewed",
      "reviewedBy": "assistant-audit",
      "notes": "Numbered callouts, localized legend, matching hotspots and text-free SVG checked against the curriculum concept."
    }
  },
  {
    "id": "ict_copyright_creative_commons",
    "type": "image",
    "kind": "concept_map",
    "lessonId": "off_ict_u2_l4",
    "conceptId": "off_ict_u2_l4_c1",
    "subjectId": "subj_ict",
    "reelKind": "teach_card",
    "curriculumRef": "Egyptian Ministry Grade 5 ICT — Unit 2, Lesson 4",
    "src": "media/ict/copyright_creative_commons.svg",
    "mimeType": "image/svg+xml",
    "width": 960,
    "height": 600,
    "title": {
      "ar": "الملكية الفكرية والمشاع الإبداعي",
      "en": "Copyright and Creative Commons",
      "fr": "Droit d’auteur et Creative Commons"
    },
    "purpose": {
      "ar": "احترام عمل المؤلف وطلب الإذن أو استخدام ترخيص مناسب وذكر المصدر.",
      "en": "Respect an author's work, get permission or use an appropriate licence, and credit the source.",
      "fr": "Respecter l’œuvre, obtenir une autorisation ou une licence adaptée et citer la source."
    },
    "alt": {
      "ar": "أربع رموز لمبدع وعلامة حقوق وترخيص وكتاب مصدر مع نسبة العمل لصاحبه.",
      "en": "Four symbols show a creator, rights seal, licence and source book with attribution.",
      "fr": "Quatre symboles montrent un créateur, un sceau de droits, une licence et un livre source."
    },
    "legend": [
      {
        "n": 1,
        "text": {
          "ar": "المؤلف يملك حق عمله الأصلي",
          "en": "The creator owns rights to original work",
          "fr": "Le créateur détient les droits de son œuvre"
        }
      },
      {
        "n": 2,
        "text": {
          "ar": "نطلب الإذن قبل إعادة الاستخدام",
          "en": "Ask permission before reusing work",
          "fr": "Demander l’autorisation avant réutilisation"
        }
      },
      {
        "n": 3,
        "text": {
          "ar": "نختار ترخيصا يسمح بالاستخدام",
          "en": "Choose a licence that permits use",
          "fr": "Choisir une licence qui autorise l’usage"
        }
      },
      {
        "n": 4,
        "text": {
          "ar": "نذكر المؤلف والمصدر",
          "en": "Credit the author and source",
          "fr": "Citer l’auteur et la source"
        }
      }
    ],
    "hotspots": [
      {
        "n": 1,
        "x": 0.34,
        "y": 0.193
      },
      {
        "n": 2,
        "x": 0.819,
        "y": 0.193
      },
      {
        "n": 3,
        "x": 0.34,
        "y": 0.61
      },
      {
        "n": 4,
        "x": 0.819,
        "y": 0.61
      }
    ],
    "displayDurationMs": 12000,
    "branding": {
      "palette": "noor-core",
      "watermark": {
        "ar": "مس نور",
        "en": "Miss Noor",
        "fr": "Miss Noor"
      }
    },
    "source": {
      "origin": "authored_svg",
      "author": "Miss Noor media pipeline",
      "license": "Project-owned (Apache-2.0)",
      "attribution": "Drawn from Egyptian Ministry Grade 5 ICT — Unit 2, Lesson 4."
    },
    "review": {
      "status": "reviewed",
      "reviewedBy": "assistant-audit",
      "notes": "Numbered callouts, localized legend, matching hotspots and text-free SVG checked against the curriculum concept."
    }
  }
];

/** All media for one lesson+concept, in catalog order. */
export function mediaForConcept(lessonId: string, conceptId: string): EducationalMediaItem[] {
  return MEDIA_CATALOG.filter((m) => m.lessonId === lessonId && m.conceptId === conceptId);
}

/** All media for a lesson, across its concepts. */
export function mediaForLesson(lessonId: string): EducationalMediaItem[] {
  return MEDIA_CATALOG.filter((m) => m.lessonId === lessonId);
}

/** Media of one family (image / video / audio / interactive). */
export function mediaOfType(type: EducationalMediaItem['type']): EducationalMediaItem[] {
  return MEDIA_CATALOG.filter((m) => m.type === type);
}
