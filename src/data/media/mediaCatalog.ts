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
