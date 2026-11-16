/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { OfficialCurriculumLesson } from '../../types/teachingSession';

const SOURCE_EDITION = 'Connect 5 Grade 5 StudentBook, Term 1 (2026–2027)';
const SOURCE_BOOK_AR = 'كونكت 5 — كتاب الطالب — الصف الخامس — الفصل الدراسي الأول 2026–2027';

const UNIT_INFO: Record<number, { en: string; ar: string }> = {
  1: { en: 'Food, Nature, and Culture', ar: 'الغذاء والطبيعة والثقافة' },
  2: { en: 'My Healthy Body', ar: 'جسمي الصحي' },
  3: { en: 'When Nature Changes', ar: 'عندما تتغير الطبيعة' },
  4: { en: 'My Community', ar: 'مجتمعي' },
  5: { en: 'Our World, Our Resources', ar: 'عالمنا ومواردنا' },
  6: { en: 'The Talking Earth', ar: 'الأرض المتحدثة' },
};

type Practice = { prompt: string; expectedAnswer: string };
type EnglishSeed = {
  id: string;
  unit: number;
  lesson: number;
  titleEn: string;
  titleAr: string;
  page: number;
  pages: string;
  assessmentPages?: string;
  summary: string;
  objectives: string[];
  vocabulary: { word: string; definition: string }[];
  workedExample: string;
  guided: Practice[];
  independent: Practice[];
  misconception: { observedResponse: string; diagnosis: string; correctivePrompt: string };
  remediation?: string[];
  mastery?: { prompt: string; expectedAnswer: string; successCriterion: string };
  exercises?: Array<{ type: 'qa' | 'multiple_choice'; question: string; options?: string[]; expectedAnswer: string; page?: number }>;
};

function makeEnglishLesson(seed: EnglishSeed): OfficialCurriculumLesson {
  const unit = UNIT_INFO[seed.unit];
  const conceptId = seed.id === 'off_en_u1_apple_tree'
    ? 'off_en_u1_apple_tree_c1'
    : seed.id + '_c1';
  const assessmentNote = seed.assessmentPages
    ? 'Assessment-book PDF page(s): ' + seed.assessmentPages + '.'
    : 'No direct matching assessment-book task was identified for this pronunciation lesson.';
  const misconceptionId = seed.id + '_misconception';
  const exercises = seed.exercises ?? [
    { type: 'qa' as const, question: seed.guided[0].prompt, expectedAnswer: seed.guided[0].expectedAnswer, page: seed.page },
    { type: 'qa' as const, question: seed.guided[1].prompt, expectedAnswer: seed.guided[1].expectedAnswer, page: seed.page },
    { type: 'qa' as const, question: seed.independent[0].prompt, expectedAnswer: seed.independent[0].expectedAnswer, page: seed.page },
    { type: 'qa' as const, question: seed.independent[1].prompt, expectedAnswer: seed.independent[1].expectedAnswer, page: seed.page },
  ];

  return {
    id: seed.id,
    subjectId: 'subj_english',
    subjectNameAr: 'اللغة الإنجليزية',
    subjectNameEn: 'English (Connect 5)',
    unitNumber: seed.unit,
    unitNameAr: 'الوحدة ' + seed.unit + ': ' + unit.ar,
    unitNameEn: 'Unit ' + seed.unit + ': ' + unit.en,
    lessonNumber: seed.lesson,
    titleAr: seed.titleAr,
    titleEn: seed.titleEn,
    originTag: 'app_authored',
    language: 'en',
    instructionLanguage: 'en',
    contentLanguage: 'en',
    assessmentLanguage: 'en',
    curriculumSource: 'egyptian_national',
    isAvailable: true,
    contentStatus: 'available',
    sourceRef: {
      book: SOURCE_BOOK_AR,
      bookAr: SOURCE_BOOK_AR,
      bookEn: SOURCE_EDITION,
      grade: 'Primary 5',
      term: 'Term 1 (2026–2027)',
      unit: 'Unit ' + seed.unit + ': ' + unit.en,
      lesson: 'Lesson ' + seed.lesson + ': ' + seed.titleEn,
      page: seed.page,
      notes: '[V] StudentBook printed pages ' + seed.pages + ' mapped to this lesson. ' + assessmentNote + ' [APP-AUTHORED] Summary, examples, explanations and questions are original app material, not verbatim textbook text.',
      isAvailable: true,
    },
    objectives: seed.objectives,
    readingText: seed.summary,
    vocabulary: seed.vocabulary,
    exercises,
    concepts: [
      {
        id: conceptId,
        conceptNumber: 1,
        titleAr: seed.titleAr,
        titleEn: seed.titleEn,
        sourceText: seed.summary,
        keyPoints: seed.objectives,
        dailyLifeExampleAr: 'طبّق الفكرة باستخدام موقف مألوف من المدرسة أو المنزل.',
        dailyLifeExampleEn: seed.workedExample,
        storyAnalogyAr: 'اربط الفكرة بمثال قصير ثم اطلب من المتعلم تفسيره بكلماته.',
        storyAnalogyEn: seed.workedExample,
        prerequisiteAr: 'فهم المفردات الأساسية وقراءة جملة إنجليزية قصيرة.',
        prerequisiteEn: 'Basic vocabulary and the ability to read a short English sentence.',
        misconceptions: [
          {
            id: misconceptionId,
            trigger: seed.misconception.observedResponse,
            explanation: seed.misconception.diagnosis,
            explanationEn: seed.misconception.diagnosis,
            remediation: seed.misconception.correctivePrompt,
            remediationEn: seed.misconception.correctivePrompt,
          },
        ],
        distractors: [seed.misconception.observedResponse + '|' + misconceptionId],
        visualType: 'concept_map',
      },
    ],
    teacherGuideEn: {
      provenance: 'app_authored',
      sourceEdition: SOURCE_EDITION,
      sourcePages: seed.pages,
      assessmentPages: seed.assessmentPages,
      explanationEn: seed.summary,
      workedExampleEn: seed.workedExample,
      guidedPracticeEn: seed.guided,
      independentPracticeEn: seed.independent,
      answerKeyEn: seed.independent.map((item) => item.expectedAnswer),
      misconceptionDiagnosisEn: [
        {
          observedResponse: seed.misconception.observedResponse,
          diagnosis: seed.misconception.diagnosis,
          correctivePrompt: seed.misconception.correctivePrompt,
        },
      ],
      remediationEn: seed.remediation ?? [seed.misconception.correctivePrompt, 'Repeat the worked example, then retry the independent practice without looking at the answer key.'],
      masteryCheckEn: [seed.mastery ?? {
        prompt: 'Explain the main idea of ' + seed.titleEn + ' in your own words and give one example.',
        expectedAnswer: seed.summary,
        successCriterion: 'The learner accurately explains the lesson idea and gives a relevant example without copying the source text.',
      }],
    },
  };
}

const ENGLISH_SOURCE_SEEDS: EnglishSeed[] = [
  {
    id: 'off_en_u1_l1_where_life_flows', unit: 1, lesson: 1, titleEn: 'Where Life Flows', titleAr: 'حيث تتدفق الحياة', page: 8, pages: '8–10', assessmentPages: '5',
    summary: 'The Nile supports connected habitats and food relationships. Water plants and insects support smaller animals, while fish and birds depend on other living things. Learners trace these relationships and explain why the river should be protected.',
    objectives: ['Identify living things connected to the Nile habitat.', 'Describe a simple food relationship using because or so.', 'Give one reason to protect the Nile.'],
    vocabulary: [{word:'Nile',definition:'The major river flowing through Egypt.'},{word:'water weeds',definition:'Plants that grow in water.'},{word:'insect',definition:'A small animal with six legs.'},{word:'crocodile',definition:'A large reptile that lives in or near water.'}],
    workedExample: 'A simple food chain can be described as water plants → insects → small fish. Each arrow shows what provides food for the next living thing.',
    guided: [{prompt:'Name one living thing that can be found in the Nile habitat.',expectedAnswer:'Examples include water plants, insects, fish, birds or crocodiles.'},{prompt:'Why can a change to water plants affect other animals?',expectedAnswer:'Some animals depend on plants directly or depend on animals that eat the plants.'}],
    independent: [{prompt:'Write a three-part food relationship using organisms from the lesson.',expectedAnswer:'A sensible chain such as water plants → insects → small fish, with the arrows explained.'},{prompt:'Write one action that helps protect the Nile habitat.',expectedAnswer:'For example, do not throw rubbish into the river and keep the water clean.'}],
    misconception:{observedResponse:'All animals in the Nile eat plants.',diagnosis:'The learner is treating a food web as a single diet; different organisms depend on different food sources.',correctivePrompt:'Trace the arrows in the food relationship and identify what each organism eats.'},
  },
  {
    id:'off_en_u1_l2_hot_desert',unit:1,lesson:2,titleEn:'Food in the Hot Desert',titleAr:'الغذاء في الصحراء الحارة',page:11,pages:'11–12',assessmentPages:'6',
    summary:'Desert animals survive in a hot, dry habitat and do not all eat the same food. The lesson uses examples such as camels, snakes, lizards and owls while practising adverbs of frequency.',
    objectives:['Identify examples of animals living in a hot desert.','Use adverbs of frequency to describe routines or habits.','Distinguish always, usually, often, sometimes, rarely and never.'],
    vocabulary:[{word:'desert',definition:'A very dry place that receives little rain.'},{word:'camel',definition:'A desert animal adapted to dry conditions.'},{word:'lizard',definition:'A reptile with four legs in many species.'},{word:'rarely',definition:'Not often.'}],
    workedExample:'“A camel usually lives in a dry habitat.” The adverb usually tells how often the statement is true.',
    guided:[{prompt:'Put these adverbs in order from most frequent to least frequent: never, usually, always.',expectedAnswer:'Always, usually, never.'},{prompt:'Choose an adverb for an action that happens almost no times.',expectedAnswer:'Rarely or never, depending on the intended meaning.'}],
    independent:[{prompt:'Write a sentence about a desert animal using usually.',expectedAnswer:'A grammatically correct sentence such as “A camel usually lives in the desert.”'},{prompt:'Write one sentence with rarely and one with sometimes.',expectedAnswer:'Two meaningful sentences using the adverbs with correct word order.'}],
    misconception:{observedResponse:'“I go never to the desert.”',diagnosis:'The learner places the frequency adverb after the main verb instead of before it in a simple present sentence.',correctivePrompt:'Build the sentence in the order subject + adverb of frequency + main verb.'},
  },
  {
    id:'off_en_u1_apple_tree',unit:1,lesson:3,titleEn:'The Giving Tree',titleAr:'الشجرة المعطاءة',page:13,pages:'13–16',assessmentPages:'7',
    summary:'Tom enjoys the apple tree but rarely gives it food or water. After returning and noticing its weak leaves and branches, he begins watering and protecting it. The story explores responsibility and caring for living things; the pronunciation section practises consonant clusters.',
    objectives:['Retell how Tom’s behaviour toward the tree changes.','Use crown, shade, trunk, branch, selfish and care for in context.','Infer the story message about responsibility.','Recognize consonant clusters in words such as tree, trunk and branch.'],
    vocabulary:[{word:'crown',definition:'A special decorated hat worn by a king or queen.'},{word:'shade',definition:'A cooler place protected from direct sunlight.'},{word:'trunk',definition:'The thick main stem of a tree.'},{word:'branch',definition:'A part that grows out from the trunk.'},{word:'selfish',definition:'Thinking only about yourself.'},{word:'care for',definition:'To look after someone or something.'}],
    workedExample:'Tom first takes fruit and shade without looking after the tree. Later he waters and protects it; this change shows responsibility.',
    guided:[{prompt:'What did Tom make from the tree’s leaves?',expectedAnswer:'Crowns.'},{prompt:'What did Tom do when he noticed the tree was weak?',expectedAnswer:'He began watering it and protecting it from strong sunlight.'}],
    independent:[{prompt:'Why did the tree become weak while Tom was away?',expectedAnswer:'Tom had neglected it and rarely gave it food or water.'},{prompt:'What lesson can readers learn from Tom’s change?',expectedAnswer:'We should care for living things and give care back rather than only taking.'}],
    misconception:{observedResponse:'Tom cut the branches of the tree.',diagnosis:'This confuses the source story with a different tree story; the Connect 5 text describes neglect followed by care, not branch cutting.',correctivePrompt:'Re-read the part where Tom returns and notices the weak leaves and branches. Identify what he does next.'},
    exercises:[
      {type:'multiple_choice',question:'What did Tom make from the tree’s leaves?',options:['Crowns','A boat','Branches','A nest'],expectedAnswer:'Crowns',page:14},
      {type:'qa',question:'Why did the tree become weak?',expectedAnswer:'Tom rarely gave it food or water.',page:14},
      {type:'qa',question:'What did Tom do to help the tree?',expectedAnswer:'He watered it and protected it from strong sunlight.',page:15},
      {type:'qa',question:'What message does the story communicate?',expectedAnswer:'Care for living things and give back to those that help us.',page:15},
    ],
  },
  {
    id:'off_en_u1_l4_recipe',unit:1,lesson:4,titleEn:"Let's Make a Recipe!",titleAr:'لنعدّ وصفة طعام',page:17,pages:'17–19',assessmentPages:'11',
    summary:'Learners read and create a simple procedural text using an Egyptian koshari recipe. They identify ingredients and put preparation instructions in a clear sequence.',
    objectives:['Identify ingredients and actions in a recipe.','Use sequencing words to order instructions.','Write clear steps for preparing a simple dish.'],
    vocabulary:[{word:'ingredient',definition:'One of the foods used to make a dish.'},{word:'recipe',definition:'A set of instructions for preparing food.'},{word:'boil',definition:'To cook food in very hot water.'},{word:'finally',definition:'The last step in a sequence.'}],
    workedExample:'A procedural text uses an ordered sequence: First prepare the ingredients; next cook them; then combine the parts; finally serve the dish.',
    guided:[{prompt:'Which word can introduce the last step of a recipe?',expectedAnswer:'Finally.'},{prompt:'Why should recipe steps be placed in order?',expectedAnswer:'The reader needs to complete actions in the correct sequence to prepare the dish.'}],
    independent:[{prompt:'Write three ordered steps for a simple recipe.',expectedAnswer:'Three clear imperative steps in a logical order, using sequencing words.'},{prompt:'Name two ingredients and one cooking action from the koshari task.',expectedAnswer:'Examples include rice or lentils and an action such as boil or mix.'}],
    misconception:{observedResponse:'A recipe is written as an unordered list of actions.',diagnosis:'The learner has not distinguished an ingredient list from the ordered method.',correctivePrompt:'Separate what is needed (ingredients) from what the cook does (method), then number the method.'},
  },
  {
    id:'off_en_u1_l5_flyer',unit:1,lesson:5,titleEn:"Let's Make a Flyer!",titleAr:'لنصمم إعلاناً',page:20,pages:'20–22',assessmentPages:'12',
    summary:'Learners plan a restaurant flyer for a clear audience. A useful flyer has a main heading, a supporting line, an image, menu information and an invitation to visit.',
    objectives:['Identify the main parts of a flyer.','Choose concise information for a target audience.','Create a readable flyer with text and visual support.'],
    vocabulary:[{word:'flyer',definition:'A one-page notice used to share information.'},{word:'heading',definition:'The main title of a page.'},{word:'menu',definition:'A list of food and drinks available.'},{word:'invitation',definition:'Words that ask someone to attend or visit.'}],
    workedExample:'A restaurant flyer can use the heading “Family Koshari Day”, a short menu, an image and a clear invitation.',
    guided:[{prompt:'Name two elements that help a reader understand a restaurant flyer quickly.',expectedAnswer:'A clear heading and menu details; an image or invitation can also help.'},{prompt:'Why should a flyer use short phrases?',expectedAnswer:'Readers should understand the message quickly.'}],
    independent:[{prompt:'Plan a flyer for a school food event using a heading and two details.',expectedAnswer:'An original heading and two relevant event details.'},{prompt:'Check your flyer against three criteria.',expectedAnswer:'It has a clear heading, accurate details and readable layout with a relevant image or invitation.'}],
    misconception:{observedResponse:'A flyer should contain a long paragraph with every detail.',diagnosis:'The learner is treating a flyer like an essay instead of a concise visual communication format.',correctivePrompt:'Keep only the information the audience needs first: event, offer, place/time and invitation.'},
  },
  {
    id:'off_en_u2_l1_sports_health',unit:2,lesson:1,titleEn:'Sports for Better Health',titleAr:'الرياضة لصحة أفضل',page:26,pages:'26–27',assessmentPages:'15',
    summary:'A dialogue explains how activities such as football and swimming support a healthy body. Regular exercise helps the heart, lungs and muscles and can improve energy, sleep and mental well-being.',
    objectives:['Name ways exercise supports the body.','Explain one link between physical activity and well-being.','Use health vocabulary in a short conversation.'],
    vocabulary:[{word:'muscle',definition:'Body tissue that helps us move.'},{word:'lungs',definition:'Organs that help us breathe.'},{word:'stressed',definition:'Feeling worried or under pressure.'},{word:'fit',definition:'Healthy and able to do physical activity.'}],
    workedExample:'Swimming uses many muscles and makes the heart and lungs work harder in a healthy way.',
    guided:[{prompt:'Name two activities mentioned as ways to exercise.',expectedAnswer:'Football and swimming.'},{prompt:'How can regular exercise help the body?',expectedAnswer:'It can strengthen muscles and support the heart and lungs.'}],
    independent:[{prompt:'Write two sentences explaining why a child might choose a sport.',expectedAnswer:'Two sensible reasons such as fitness, stronger muscles, energy or enjoyment.'},{prompt:'Give one example of how exercise can support mental health.',expectedAnswer:'It can help someone feel less stressed or improve mood.'}],
    misconception:{observedResponse:'Only athletes need exercise.',diagnosis:'The learner treats exercise as a specialist activity rather than a healthy habit for everyone.',correctivePrompt:'Connect the lesson examples to ordinary daily movement and age-appropriate activities.'},
  },
  {
    id:'off_en_u2_l2_habits',unit:2,lesson:2,titleEn:'My Habits: Then and Now',titleAr:'عاداتي في الماضي والحاضر',page:28,pages:'28–30',assessmentPages:'16',
    summary:'Adam compares his earlier habits with healthier choices he makes now. The lesson practises a, an, some and any with countable and uncountable nouns.',
    objectives:['Compare past and present habits.','Choose a/an for singular countable nouns.','Use some and any appropriately in simple statements and questions.'],
    vocabulary:[{word:'habit',definition:'Something a person does regularly.'},{word:'vitamin',definition:'A nutrient needed by the body.'},{word:'soda',definition:'A sweet fizzy drink.'},{word:'healthy',definition:'Good for the body or mind.'}],
    workedExample:'Use “an apple” before a vowel sound, “some water” for an uncountable noun and “any” in many questions or negatives.',
    guided:[{prompt:'Choose the correct phrase: a apple or an apple.',expectedAnswer:'An apple.'},{prompt:'Choose some or any: “Do you have ___ water?”',expectedAnswer:'Any.'}],
    independent:[{prompt:'Write one sentence with some and an uncountable noun.',expectedAnswer:'A correct example such as “I drink some water.”'},{prompt:'Write one question using any.',expectedAnswer:'A correct question such as “Do you have any fruit?”'}],
    misconception:{observedResponse:'“a water” or “an bananas”.',diagnosis:'The learner is not distinguishing countable singular nouns from plural or uncountable nouns.',correctivePrompt:'Ask whether the noun can be counted as one item; choose a/an only for a singular countable noun.'},
  },
  {
    id:'off_en_u2_l3_heart_blood',unit:2,lesson:3,titleEn:'Heart and Blood',titleAr:'القلب والدم',page:31,pages:'31–33',assessmentPages:'17',
    summary:'The heart pumps blood around the body. Blood carries oxygen and nutrients to cells and helps remove waste. The lesson also practises syllable awareness and clear pronunciation.',
    objectives:['Describe the heart’s pumping role.','Explain what blood carries around the body.','Identify syllables in selected words.'],
    vocabulary:[{word:'heart',definition:'The organ that pumps blood.'},{word:'blood vessel',definition:'A tube that carries blood.'},{word:'oxygen',definition:'A gas the body needs to release energy.'},{word:'nutrient',definition:'A substance in food that helps the body grow and work.'}],
    workedExample:'The heart pumps blood; blood carries oxygen and nutrients to body cells.',
    guided:[{prompt:'What does the heart do?',expectedAnswer:'It pumps blood around the body.'},{prompt:'Name two things blood carries to cells.',expectedAnswer:'Oxygen and nutrients.'}],
    independent:[{prompt:'Explain the route in one sentence: heart → blood vessels → body cells.',expectedAnswer:'The heart pumps blood through blood vessels to deliver oxygen and nutrients to cells.'},{prompt:'Clap the syllables in “oxygen”.',expectedAnswer:'Three syllables: ox-y-gen.'}],
    misconception:{observedResponse:'The heart makes oxygen.',diagnosis:'The learner confuses the pumping function of the heart with the role of the lungs in breathing.',correctivePrompt:'Separate the jobs: lungs bring oxygen into the body; the heart pumps blood that carries it.'},
  },
  {
    id:'off_en_u2_l4_life_savers',unit:2,lesson:4,titleEn:'Life Savers in Action',titleAr:'منقذون في العمل',page:34,pages:'34–37',assessmentPages:'21',
    summary:'The lesson introduces people who protect health, including doctors, nurses, pharmacists and paramedics. Learners organize factual information in a short non-fiction text.',
    objectives:['Match healthcare workers with their responsibilities.','Use accurate vocabulary to describe a health role.','Organize facts into a short non-fiction paragraph.'],
    vocabulary:[{word:'doctor',definition:'A trained person who diagnoses and treats illness.'},{word:'nurse',definition:'A healthcare worker who cares for patients.'},{word:'pharmacist',definition:'A professional who prepares and supplies medicines.'},{word:'paramedic',definition:'A trained emergency medical worker.'}],
    workedExample:'A pharmacist checks and supplies medicine; a paramedic gives urgent care during an emergency.',
    guided:[{prompt:'Who helps supply the correct medicine?',expectedAnswer:'A pharmacist.'},{prompt:'Who provides urgent medical help before or during transport to hospital?',expectedAnswer:'A paramedic.'}],
    independent:[{prompt:'Write three factual sentences about one healthcare worker.',expectedAnswer:'Three accurate sentences naming the role and describing relevant duties.'},{prompt:'Organize your paragraph with a topic sentence and two supporting facts.',expectedAnswer:'A clear topic sentence followed by two relevant facts.'}],
    misconception:{observedResponse:'A pharmacist and a paramedic do the same job.',diagnosis:'The learner is grouping all healthcare roles together without distinguishing responsibilities.',correctivePrompt:'Compare where each worker helps and what task each one performs.'},
  },
  {
    id:'off_en_u2_l5_healthy_poster',unit:2,lesson:5,titleEn:'Think and Create: A Poster',titleAr:'فكر وصمم: ملصق صحي',page:38,pages:'38',assessmentPages:'22',
    summary:'Learners create a poster that communicates healthy habits. The task combines short, accurate statements with visual organization so that a reader can understand the message quickly.',
    objectives:['Select a clear healthy-living message.','Write short accurate poster statements.','Use a heading and visual elements to organize information.'],
    vocabulary:[{word:'poster',definition:'A large printed or drawn notice that communicates a message.'},{word:'slogan',definition:'A short memorable phrase.'},{word:'healthy habit',definition:'A repeated action that supports health.'}],
    workedExample:'A poster titled “Move Every Day” can include a short slogan, a picture of a child walking and two practical tips.',
    guided:[{prompt:'Choose one clear message for a healthy-habits poster.',expectedAnswer:'A focused message such as “Drink water” or “Move every day”.'},{prompt:'What should a poster heading do?',expectedAnswer:'Tell the reader the main topic quickly.'}],
    independent:[{prompt:'Create a poster plan with a heading, slogan and two tips.',expectedAnswer:'An original plan with all four elements and accurate health advice.'},{prompt:'Check the poster for readability.',expectedAnswer:'Large heading, short text, readable layout and relevant image.'}],
    misconception:{observedResponse:'A poster should contain a full essay.',diagnosis:'The learner has not adapted the amount of text to the visual format.',correctivePrompt:'Reduce each idea to one short statement and let the heading and image carry part of the message.'},
  },
  {
    id:'off_en_u3_l1_weather_wonders',unit:3,lesson:1,titleEn:'Weather Wonders and Warnings',titleAr:'عجائب الطقس وتحذيراته',page:42,pages:'42–44',assessmentPages:'24',
    summary:'Learners identify extreme-weather events and discuss their effects. The dialogue connects hazards such as floods, droughts and wildfires with warnings, safety and changes in the environment.',
    objectives:['Name examples of extreme weather.','Describe one effect of a weather hazard.','Give a sensible safety response to a warning.'],
    vocabulary:[{word:'flood',definition:'A large amount of water covering normally dry land.'},{word:'drought',definition:'A long period with too little rain.'},{word:'wildfire',definition:'A large uncontrolled fire in a natural area.'},{word:'warning',definition:'Information that tells people about possible danger.'}],
    workedExample:'A flood can cover roads and homes, so people should follow official safety instructions and move away from dangerous water.',
    guided:[{prompt:'What is a drought?',expectedAnswer:'A long period with too little rain.'},{prompt:'Give one possible effect of a flood.',expectedAnswer:'It can cover roads, damage homes or disrupt travel.'}],
    independent:[{prompt:'Choose one weather hazard and explain one effect.',expectedAnswer:'A correct hazard-effect relationship.'},{prompt:'Write one safe action during a severe-weather warning.',expectedAnswer:'Follow trusted instructions and move to a safe place.'}],
    misconception:{observedResponse:'A drought means too much rain.',diagnosis:'The learner has reversed the meaning of drought and flood.',correctivePrompt:'Compare the key idea: drought is too little rain; flood is too much water covering land.'},
  },
  {
    id:'off_en_u3_l2_extreme_weather',unit:3,lesson:2,titleEn:'Extreme Weather in Ancient Egypt',titleAr:'الطقس القاسي في مصر القديمة',page:45,pages:'45–48',assessmentPages:'25',
    summary:'The lesson explains how Nile floods, droughts and Khamsin sandstorms affected people in ancient Egypt. Learners connect weather events with people’s responses and practise the past simple.',
    objectives:['Describe how an extreme-weather event affected people in ancient Egypt.','Use past-simple verbs to describe completed events.','Distinguish a past event from a present habit.'],
    vocabulary:[{word:'Khamsin',definition:'A hot, dry wind that can carry dust and sand.'},{word:'harvest',definition:'The gathering of crops.'},{word:'flood',definition:'Water covering normally dry land.'},{word:'ancient',definition:'Belonging to a very long time ago.'}],
    workedExample:'“The river flooded the fields.” Flooded is the past-simple form of flood.',
    guided:[{prompt:'Change “People adapt to the weather” into the past simple.',expectedAnswer:'People adapted to the weather.'},{prompt:'Name one weather challenge discussed for ancient Egypt.',expectedAnswer:'Nile floods, droughts or Khamsin sandstorms.'}],
    independent:[{prompt:'Write two past-simple sentences about how people responded to weather.',expectedAnswer:'Two relevant sentences with correct past-simple forms.'},{prompt:'Explain why a flood could help and also create problems.',expectedAnswer:'It could bring water or fertile soil but also damage homes or crops if severe.'}],
    misconception:{observedResponse:'“People adapt yesterday.”',diagnosis:'The learner uses a present-tense verb with a finished past-time marker.',correctivePrompt:'Find the time marker, then change the main verb to its past form.'},
  },
  {
    id:'off_en_u3_l3_two_frogs',unit:3,lesson:3,titleEn:'The Two Frogs',titleAr:'الضفدعتان',page:49,pages:'49–51',assessmentPages:'26',
    summary:'Two frogs face a pond that is drying. One suggests jumping into a deep well, while the other considers how difficult it would be to leave. The story encourages learners to think through consequences before choosing.',
    objectives:['Retell the two frogs’ different choices.','Explain why considering consequences matters.','Recognize the vowel-digraph patterns practised in the lesson.'],
    vocabulary:[{word:'pond',definition:'A small area of still water.'},{word:'well',definition:'A deep hole from which water can be taken.'},{word:'consequence',definition:'A result of an action or decision.'},{word:'choice',definition:'A decision between possibilities.'}],
    workedExample:'Before entering a deep well, ask: “Can I get out again?” This checks a consequence before making a choice.',
    guided:[{prompt:'Why did one frog suggest the well?',expectedAnswer:'The pond was drying and the frog wanted to find water.'},{prompt:'What problem did the other frog notice?',expectedAnswer:'It might be difficult or impossible to climb out of the deep well.'}],
    independent:[{prompt:'State the story’s advice in one sentence.',expectedAnswer:'Think about the consequences before making a decision.'},{prompt:'Give one example of a vowel-digraph word from the lesson and identify the two-letter pattern.',expectedAnswer:'A correct example and pattern from the pronunciation section.'}],
    misconception:{observedResponse:'The safest choice is always the first idea suggested.',diagnosis:'The learner is not evaluating the risks and consequences in the story.',correctivePrompt:'List one benefit and one risk of the well before deciding.'},
  },
  {
    id:'off_en_u3_l4_imagination',unit:3,lesson:4,titleEn:'Once Upon My Imagination',titleAr:'كان يا ما كان في خيالي',page:52,pages:'52–53',assessmentPages:'30',
    summary:'A fictional story follows Lily and an unusual world of upside-down clouds. Learners notice how a story develops from a beginning through a problem and events to an ending, then plan their own imaginative narrative.',
    objectives:['Identify the beginning, problem, events and ending of a story.','Use descriptive details to develop an imaginative setting.','Plan a short fictional narrative with a clear sequence.'],
    vocabulary:[{word:'imagination',definition:'The ability to form ideas or pictures in the mind.'},{word:'setting',definition:'The time and place where a story happens.'},{word:'problem',definition:'A difficulty that characters need to address.'},{word:'ending',definition:'The part that completes a story.'}],
    workedExample:'A story plan can begin with a character noticing an unusual cloud, develop a problem caused by it and end with the character solving the problem.',
    guided:[{prompt:'Name two parts of a story structure.',expectedAnswer:'Examples include beginning, problem, middle/events, climax or ending.'},{prompt:'What does the setting tell the reader?',expectedAnswer:'Where and when the story happens.'}],
    independent:[{prompt:'Plan a story with a character, setting and problem.',expectedAnswer:'An original plan containing all three elements.'},{prompt:'Write an ending that solves the story problem.',expectedAnswer:'An ending that connects logically to the problem and events.'}],
    misconception:{observedResponse:'A story is only a list of unrelated events.',diagnosis:'The learner has not connected events through a problem or character goal.',correctivePrompt:'Ask what the character wants, what prevents it and how the ending resolves the difficulty.'},
  },
  {
    id:'off_en_u3_l5_weather_collage',unit:3,lesson:5,titleEn:'Think and Create: A Collage',titleAr:'فكر وصمم: لوحة قصاصات عن الطقس',page:54,pages:'54',assessmentPages:'31',
    summary:'Learners create a collage about weather. They select images and words that communicate a weather idea, then organize the pieces so that the main message is clear.',
    objectives:['Choose a weather topic for a collage.','Select images and vocabulary that support one message.','Present the collage with a short explanation.'],
    vocabulary:[{word:'collage',definition:'An artwork made by arranging different materials or images.'},{word:'caption',definition:'A short text that explains an image.'},{word:'forecast',definition:'A statement about expected weather.'}],
    workedExample:'A storm collage can combine a cloud image, rain vocabulary and a caption explaining one safety action.',
    guided:[{prompt:'Choose one weather topic and name two suitable images.',expectedAnswer:'A coherent topic with two relevant images.'},{prompt:'What does a caption add to a collage?',expectedAnswer:'It explains or gives context for an image.'}],
    independent:[{prompt:'Plan a collage with a title, three images and two captions.',expectedAnswer:'A coherent plan with all required elements.'},{prompt:'Explain how your images support the same weather message.',expectedAnswer:'A clear explanation linking each image to the chosen topic.'}],
    misconception:{observedResponse:'Any unrelated pictures make a good collage.',diagnosis:'The learner is choosing images for decoration rather than communication.',correctivePrompt:'State the main message first; keep only images and words that support it.'},
  },
  {
    id:'off_en_u4_l1_community_places',unit:4,lesson:1,titleEn:'Places in Our Community',titleAr:'أماكن في مجتمعنا',page:62,pages:'62–64',assessmentPages:'37',
    summary:'Learners explore places in a community and discuss what people do there. The dialogue includes places such as restaurants, coffee shops, bakeries, supermarkets, clubs and theme parks.',
    objectives:['Name common places in a community.','Match a place with an activity people do there.','Ask and answer simple questions about where to go.'],
    vocabulary:[{word:'bakery',definition:'A shop where bread and cakes are made or sold.'},{word:'supermarket',definition:'A large shop selling food and household goods.'},{word:'coffee shop',definition:'A place where people buy drinks and light food.'},{word:'theme park',definition:'A place with rides and attractions.'}],
    workedExample:'People go to a bakery to buy bread and to a supermarket to buy different groceries.',
    guided:[{prompt:'Where can someone buy bread?',expectedAnswer:'At a bakery.'},{prompt:'Where might a family go for rides and attractions?',expectedAnswer:'To a theme park.'}],
    independent:[{prompt:'Write three place-and-activity pairs.',expectedAnswer:'Three correct pairs such as bakery/buy bread, supermarket/buy groceries, theme park/enjoy rides.'},{prompt:'Ask a partner where they would go to buy food and answer.',expectedAnswer:'A clear question and a place-appropriate response.'}],
    misconception:{observedResponse:'A supermarket and a theme park have the same purpose.',diagnosis:'The learner is matching places by familiarity rather than function.',correctivePrompt:'Describe the main activity at each place and compare their purposes.'},
  },
  {
    id:'off_en_u4_l2_egyptian_villages',unit:4,lesson:2,titleEn:'Egyptian Villages',titleAr:'القرى المصرية',page:65,pages:'65–67',assessmentPages:'38',
    summary:'The lesson describes places and daily life in Egyptian villages, including cottages, a community centre, a main square, barns and fields. Learners practise prepositions of time such as at, in and on.',
    objectives:['Identify places in a village.','Describe a simple village routine.','Choose at, in or on for common time expressions.'],
    vocabulary:[{word:'cottage',definition:'A small house, often in the countryside.'},{word:'barn',definition:'A farm building used for animals or storage.'},{word:'field',definition:'An area of land used for farming or open activity.'},{word:'main square',definition:'An open central place in a town or village.'}],
    workedExample:'Use “at” with a clock time, “on” with a day and “in” with a month or part of the day.',
    guided:[{prompt:'Choose the preposition: ___ Monday.',expectedAnswer:'On Monday.'},{prompt:'Choose the preposition: ___ 7 o’clock.',expectedAnswer:'At 7 o’clock.'}],
    independent:[{prompt:'Write one sentence using in, one using on and one using at for time.',expectedAnswer:'Three correct examples with the appropriate time expression.'},{prompt:'Describe two places in an Egyptian village.',expectedAnswer:'Two accurate descriptions using vocabulary such as cottage, barn, field or main square.'}],
    misconception:{observedResponse:'“At Monday” and “in 7 o’clock”.',diagnosis:'The learner has not connected each preposition to the type of time expression.',correctivePrompt:'Sort examples into clock times, days/dates and longer periods, then choose at/on/in.'},
  },
  {
    id:'off_en_u4_l3_trigraphs',unit:4,lesson:3,titleEn:'Pronunciation: Trigraphs',titleAr:'النطق: مجموعات من ثلاثة أحرف',page:69,pages:'69',assessmentPages:undefined,
    summary:'The pronunciation lesson practises three-letter spelling patterns such as dge, tch and igh. Learners connect each pattern with example words and pronounce the words clearly.',
    objectives:['Recognize the dge, tch and igh spelling patterns.','Read example words with the correct sound.','Identify the trigraph in a written word.'],
    vocabulary:[{word:'trigraph',definition:'A group of three letters that represents one sound.'},{word:'bridge',definition:'A structure that lets people cross over water or a road.'},{word:'match',definition:'A small stick used to light a fire, or a game between teams.'},{word:'flight',definition:'A journey through the air.'}],
    workedExample:'In bridge, the letters dge work together to represent the final sound.',
    guided:[{prompt:'Which three letters form the trigraph in bridge?',expectedAnswer:'dge.'},{prompt:'Which three letters form the trigraph in match?',expectedAnswer:'tch.'}],
    independent:[{prompt:'Find the trigraph in flight.',expectedAnswer:'igh.'},{prompt:'Write one word for each pattern: dge, tch and igh.',expectedAnswer:'Correct examples such as bridge, match and flight.'}],
    misconception:{observedResponse:'A trigraph is any three letters next to each other.',diagnosis:'The learner is counting letters without checking whether the group represents one sound.',correctivePrompt:'Say the word aloud and identify the three-letter group that represents the target sound.'},
  },
  {
    id:'off_en_u4_l4_new_capital',unit:4,lesson:4,titleEn:'The New Administrative Capital',titleAr:'العاصمة الإدارية الجديدة',page:70,pages:'70–72',assessmentPages:'42',
    summary:'An informational text introduces Egypt’s New Administrative Capital, including its location east of Cairo, modern technology, green areas and major buildings. Learners then write a first-person narrative about a city or village.',
    objectives:['Identify key facts about the New Administrative Capital from the source text.','Use descriptive vocabulary for a city.','Write a short first-person narrative about a place.'],
    vocabulary:[{word:'capital',definition:'The city where a country’s main government is based.'},{word:'technology',definition:'Tools and systems used to solve problems or perform tasks.'},{word:'green area',definition:'A place with plants, trees or open natural space.'},{word:'reduce',definition:'To make something smaller or less.'}],
    workedExample:'A first-person paragraph can begin “I visited the city…” and then describe what the writer saw and how the place felt.',
    guided:[{prompt:'Name two features of the New Administrative Capital mentioned in the lesson.',expectedAnswer:'Examples include modern technology, green areas or major buildings.'},{prompt:'Which point of view uses I and my?',expectedAnswer:'First person.'}],
    independent:[{prompt:'Write three first-person sentences about a city or village you know.',expectedAnswer:'Three connected first-person sentences with accurate place details.'},{prompt:'Underline two descriptive words in your paragraph.',expectedAnswer:'Two relevant adjectives or descriptive phrases.'}],
    misconception:{observedResponse:'A first-person narrative uses he and they throughout.',diagnosis:'The learner is mixing first-person and third-person points of view.',correctivePrompt:'Check each sentence and replace the narrator’s name with I or we where appropriate.'},
  },
  {
    id:'off_en_u4_l5_research',unit:4,lesson:5,titleEn:'Think and Create: Research',titleAr:'فكر وصمم: بحث عن مجتمعنا',page:73,pages:'73',assessmentPages:'43',
    summary:'Learners research a city or community and organize selected facts for a short presentation. The task emphasizes choosing relevant information and communicating it clearly.',
    objectives:['Choose a focused research question about a community.','Select relevant facts from suitable sources.','Present information in an organized short report.'],
    vocabulary:[{word:'research',definition:'Careful study to find information about a topic.'},{word:'fact',definition:'Information that can be checked.'},{word:'source',definition:'A place or document where information comes from.'},{word:'present',definition:'To share information with an audience.'}],
    workedExample:'A research card about a town can include its location, one important place and one feature of daily life.',
    guided:[{prompt:'What makes a research fact useful?',expectedAnswer:'It answers the research question and can be checked.'},{prompt:'Name two details that could describe a community.',expectedAnswer:'Location and an important place, service or activity.'}],
    independent:[{prompt:'Plan a short report with a title and three verified facts.',expectedAnswer:'A focused title and three relevant facts with their sources.'},{prompt:'Present your report in four clear sentences.',expectedAnswer:'Four connected sentences that communicate the selected facts.'}],
    misconception:{observedResponse:'A personal guess can be presented as a research fact.',diagnosis:'The learner is not distinguishing evidence from opinion or assumption.',correctivePrompt:'Ask where the information came from and whether it can be checked before including it.'},
  },
  {
    id:'off_en_u5_l1_gifts_nature',unit:5,lesson:1,titleEn:'Treasures of Egypt',titleAr:'كنوز مصر',page:78,pages:'78–80',assessmentPages:'47',
    summary:'The lesson explores natural resources in Egypt, including Nile water, sunlight, fertile soil, oil, natural gas, cotton and minerals. Learners consider how resources support people and why they should be used responsibly.',
    objectives:['Name natural resources discussed in the lesson.','Explain one way a resource supports life or work.','Suggest a responsible way to use a resource.'],
    vocabulary:[{word:'natural resource',definition:'Something from nature that people use.'},{word:'fertile',definition:'Able to support healthy plant growth.'},{word:'mineral',definition:'A naturally occurring substance found in the Earth.'},{word:'cotton',definition:'A soft plant fibre used to make cloth.'}],
    workedExample:'Fertile soil helps crops grow, while Nile water supports people, farms and other living things.',
    guided:[{prompt:'Name two natural resources found in Egypt.',expectedAnswer:'Examples include Nile water, sunlight, fertile soil, oil, natural gas, cotton or minerals.'},{prompt:'How does fertile soil help people?',expectedAnswer:'It helps crops grow.'}],
    independent:[{prompt:'Choose one resource and explain two ways it is useful.',expectedAnswer:'Two accurate uses linked to the chosen resource.'},{prompt:'Suggest one way to avoid wasting water.',expectedAnswer:'A practical action such as closing taps or repairing leaks.'}],
    misconception:{observedResponse:'Natural resources can never run out.',diagnosis:'The learner assumes every resource is unlimited, including finite resources.',correctivePrompt:'Sort resources by whether they can be renewed quickly or are limited, then explain careful use.'},
  },
  {
    id:'off_en_u5_l2_metals_minerals',unit:5,lesson:2,titleEn:'Metals and Minerals in Our World',titleAr:'المعادن والفلزات في عالمنا',page:81,pages:'81–83',assessmentPages:'48',
    summary:'Learners explore metals and minerals such as gold, diamond, copper and iron, their uses and properties. The grammar focus practises comparative adjectives when comparing materials.',
    objectives:['Name examples of metals and minerals.','Compare two materials using comparative adjectives.','Explain why minerals should be used carefully.'],
    vocabulary:[{word:'metal',definition:'A material such as iron or copper.'},{word:'mineral',definition:'A naturally occurring substance in the Earth.'},{word:'copper',definition:'A metal used in electrical wires and other products.'},{word:'comparative',definition:'A form used to compare two things.'}],
    workedExample:'“Copper is softer than iron” compares two materials using the comparative form softer than.',
    guided:[{prompt:'Complete: “Gold is ___ (valuable) than many common metals.”',expectedAnswer:'More valuable.'},{prompt:'Name one use of copper.',expectedAnswer:'Electrical wires or another accurate use.'}],
    independent:[{prompt:'Write two comparisons between materials using -er than or more … than.',expectedAnswer:'Two grammatically correct comparisons with sensible adjectives.'},{prompt:'Explain why minerals should not be wasted.',expectedAnswer:'Many minerals are limited and take a very long time to form.'}],
    misconception:{observedResponse:'“More stronger than”.',diagnosis:'The learner is using both the -er ending and more with the same adjective.',correctivePrompt:'Choose one comparative pattern: stronger than OR more useful than.'},
  },
  {
    id:'off_en_u5_l3_little_digger',unit:5,lesson:3,titleEn:'Just Watch! — The Little Digger',titleAr:'شاهد فقط: الحفار الصغير',page:84,pages:'84–86',assessmentPages:'50',
    summary:'A story follows a small digger that helps free a stuck ship after larger machines fail. The lesson highlights persistence, practical problem-solving and helping others.',
    objectives:['Retell the problem and solution in the story.','Use the lesson vocabulary in context.','Explain how persistence helps solve a problem.'],
    vocabulary:[{word:'digger',definition:'A machine used to move earth.'},{word:'cargo',definition:'Goods carried by a ship, plane or vehicle.'},{word:'give up',definition:'Stop trying to do something.'},{word:'load',definition:'A quantity of goods being carried.'}],
    workedExample:'The larger machines cannot solve the problem, but the small digger keeps trying and finds a useful way to help.',
    guided:[{prompt:'What problem does the ship face?',expectedAnswer:'It is stuck and needs help to move.'},{prompt:'What quality does the little digger show?',expectedAnswer:'Persistence and willingness to help.'}],
    independent:[{prompt:'Explain why the little digger’s size does not decide whether it can help.',expectedAnswer:'Its useful actions and persistence matter more than its size.'},{prompt:'Write one sentence using give up correctly.',expectedAnswer:'A meaningful sentence such as “Do not give up when a task is difficult.”'}],
    misconception:{observedResponse:'The biggest machine must always be the most useful.',diagnosis:'The learner is judging ability only by size rather than by the task and the solution.',correctivePrompt:'Compare what each machine can do and identify which action solves the problem.'},
  },
  {
    id:'off_en_u5_l4_i_am_water',unit:5,lesson:4,titleEn:'Who Am I? — I Am Water',titleAr:'من أنا؟ أنا الماء',page:87,pages:'87–88',assessmentPages:'53',
    summary:'The text presents water speaking in the first person. Learners consider the roles water plays in daily life and practise writing from the point of view of an object or natural resource.',
    objectives:['Identify the first-person voice in a text.','Describe important roles of water.','Write a short paragraph from an object’s point of view.'],
    vocabulary:[{word:'first person',definition:'A point of view using I, me and my.'},{word:'resource',definition:'Something useful that people need or use.'},{word:'essential',definition:'Very important or necessary.'},{word:'conserve',definition:'Use carefully and avoid waste.'}],
    workedExample:'“I am water. I help plants grow and people stay hydrated.” The speaker is water, so the text uses I.',
    guided:[{prompt:'Which pronoun signals first-person writing?',expectedAnswer:'I, me or my.'},{prompt:'Name two ways people use water.',expectedAnswer:'Drinking, cooking, cleaning, farming or another accurate use.'}],
    independent:[{prompt:'Write three first-person sentences from the point of view of water.',expectedAnswer:'Three relevant sentences using I or my and describing water’s roles.'},{prompt:'Add one sentence encouraging people to conserve water.',expectedAnswer:'A practical conservation message.'}],
    misconception:{observedResponse:'The narrator says “Water helps me” while speaking as water.',diagnosis:'The learner has shifted from first person to third person.',correctivePrompt:'Keep the speaker as water and check that the sentences use I, me or my consistently.'},
  },
  {
    id:'off_en_u5_l5_my_gold_poster',unit:5,lesson:5,titleEn:'Think and Create: A Poster — My Gold',titleAr:'فكر وصمم: ملصق ما هو ثمين',page:89,pages:'89',assessmentPages:'54',
    summary:'Learners create a poster about what is valuable in their lives. The task asks them to communicate a personal idea through a clear title, short statements and relevant images.',
    objectives:['Choose a clear idea about what is valuable.','Support the idea with short statements.','Organize a poster using a title and images.'],
    vocabulary:[{word:'valuable',definition:'Important or worth a lot to someone.'},{word:'poster',definition:'A visual page that communicates a message.'},{word:'message',definition:'The main idea a person wants to communicate.'}],
    workedExample:'A poster titled “My Family Is My Gold” can include two short reasons and a picture that supports the message.',
    guided:[{prompt:'Name one thing that can be valuable without being money.',expectedAnswer:'Family, friendship, health, learning or another reasoned example.'},{prompt:'What should a poster title do?',expectedAnswer:'Communicate the main idea clearly.'}],
    independent:[{prompt:'Plan a poster with a title and two supporting statements.',expectedAnswer:'An original title and two relevant statements.'},{prompt:'Explain how one image supports your poster message.',expectedAnswer:'A clear link between the image and the main idea.'}],
    misconception:{observedResponse:'Valuable always means expensive.',diagnosis:'The learner is using only a money-based meaning and missing personal or non-material value.',correctivePrompt:'Ask what makes something important to a person even if it has little or no price.'},
  },
  {
    id:'off_en_u6_l1_talking_earth',unit:6,lesson:1,titleEn:'The Talking Earth',titleAr:'الأرض المتحدثة',page:92,pages:'92–105',assessmentPages:'58',
    summary:'The extended reading follows Billie Wind in the Everglades as she learns to observe the natural world and understand how living things depend on their environment. The app uses a concise paraphrase and original comprehension work, not the copyrighted story text.',
    objectives:['Identify the main character and setting.','Sequence key events from the source story.','Use evidence from the reading to explain what Billie learns about nature.'],
    vocabulary:[{word:'Everglades',definition:'A large wetland region in Florida.'},{word:'environment',definition:'The natural surroundings in which living things exist.'},{word:'observe',definition:'Watch carefully to notice details.'},{word:'relationship',definition:'A connection between people, animals or things.'}],
    workedExample:'When a character watches how animals behave and how plants, water and weather connect, the character is observing relationships in the environment.',
    guided:[{prompt:'Who is the central character in the story?',expectedAnswer:'Billie Wind.'},{prompt:'What does Billie learn to do more carefully?',expectedAnswer:'Observe and listen to the natural world.'}],
    independent:[{prompt:'Write a short sequence of three important events from the story.',expectedAnswer:'Three events in the correct order, paraphrased in the learner’s own words.'},{prompt:'Explain one way the natural environment connects living things.',expectedAnswer:'A sensible relationship such as animals depending on plants, water or habitat.'}],
    misconception:{observedResponse:'The story is only about a character talking; the natural setting is unimportant.',diagnosis:'The learner has missed the relationship between the character’s learning and the environment.',correctivePrompt:'Identify what Billie notices in the setting and explain how each observation changes her understanding.'},
  },
];

export const ENGLISH_CURRICULUM_LESSONS: OfficialCurriculumLesson[] = [
  ...ENGLISH_SOURCE_SEEDS.map(makeEnglishLesson),
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
