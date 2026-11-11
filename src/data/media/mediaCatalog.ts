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
