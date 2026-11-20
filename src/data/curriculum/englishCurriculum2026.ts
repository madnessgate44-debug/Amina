/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * 2026/2027 Egypt Ministry Grade 5 English (Connect 5, first foreign language),
 * Term 1.
 *
 * Unit names, lesson names and page numbers are taken from the inspected
 * Ministry student book `English_language_prim5_t1.pdf` (113 pages, SHA-256
 * da7e3dd7…). The book prints a Term 1 scope and sequence (page 3) and five
 * units, each ending in a Quick Review and a Self-Assessment, plus Review 1.
 *
 * Explanations, examples and exercises are Miss Noor teaching material written
 * for this app. They are NOT official Ministry text and are NOT taken from a
 * Ministry teacher guide.
 */
import { OfficialCurriculumLesson, SourceRef } from '../../types/teachingSession';

type Spec = {
  u: number;
  n: number;
  page: number;
  pages: string;
  en: string;
  ar: string;
  focus: string;
  objectives: string[];
  vocab: [string, string][];
  languageInUse: { title: string; rule: string; example: string };
  skills: { reading?: string; writing?: string; listening?: string; speaking?: string };
  q: string;
  options: string[];
  answer: string;
  why: string;
};

const UNIT_TITLES: Record<number, { en: string; ar: string }> = {
  1: { en: 'Unit 1: Food, Nature, and Culture', ar: 'الوحدة الأولى: الطعام والطبيعة والثقافة' },
  2: { en: 'Unit 2: My Healthy Body', ar: 'الوحدة الثانية: جسمي الصحي' },
  3: { en: 'Unit 3: When Nature Changes', ar: 'الوحدة الثالثة: حين تتغير الطبيعة' },
  4: { en: 'Unit 4: My Community', ar: 'الوحدة الرابعة: مجتمعي' },
  5: { en: 'Unit 5: Our World, Our Resources', ar: 'الوحدة الخامسة: عالمنا ومواردنا' },
  6: { en: 'Unit 6: The Talking Earth', ar: 'الوحدة السادسة: الأرض المتكلمة' },
};

const S: Spec[] = [
  // ─────────────────────────────────────────────────────────── Unit 1
  {
    u: 1, n: 1, page: 8, pages: '8–10',
    en: 'Life Along The Nile', ar: 'الحياة على ضفاف النيل',
    focus:
      'The Nile River is home to many living things. Small fish eat water weeds, birds eat small fish and insects, and crocodiles eat fish, birds and larger animals. Each animal has a role, so people must keep the river clean.',
    objectives: [
      'Identify animals and plants that live in the Nile River.',
      'Answer comprehension questions about a listening text.',
      'Use the new vocabulary to complete a short text.',
    ],
    vocab: [
      ['crocodile', 'a large reptile with a long body and strong jaws'],
      ['hunt', 'to chase and catch an animal for food'],
      ['water weeds', 'plants that grow in the water'],
      ['insects', 'small creatures with six legs'],
    ],
    languageInUse: {
      title: 'Present simple for facts',
      rule: 'Use the present simple to state a fact that is always true. Add -s with he, she or it.',
      example: 'A crocodile hunts large animals. Small fish eat water weeds.',
    },
    skills: {
      listening: 'Listen to a conversation about life in the Nile and answer questions.',
      speaking: 'Describe what each river animal eats.',
    },
    q: 'What do small fish in the Nile River eat?',
    options: ['Water weeds', 'Crocodiles', 'Birds', 'Large animals'],
    answer: 'Water weeds',
    why: 'The listening text says small fish eat plants in the water, which are called water weeds.',
  },
  {
    u: 1, n: 2, page: 11, pages: '11–12',
    en: 'Food in the Hot Desert', ar: 'الغذاء في الصحراء الحارة',
    focus:
      'The desert is hot and dry, but many animals live there. Snakes eat rats and lizards, camels eat plants, and lizards eat insects. Some animals hide under rocks in the day, and owls come out at night when it is cooler.',
    objectives: [
      'Read a short information text and answer questions.',
      'Choose the correct word to complete sentences about desert animals.',
      'Use adverbs of frequency correctly.',
    ],
    vocab: [
      ['desert', 'a very dry place with little rain'],
      ['energy', 'the power to move and grow'],
      ['balance', 'a steady state where nothing is too much'],
    ],
    languageInUse: {
      title: 'Adverbs of frequency',
      rule: 'Adverbs of frequency (always, usually, often, sometimes, rarely, never) go before the main verb and after the verb to be.',
      example: 'Snakes never eat plants. Lizards are sometimes dangerous.',
    },
    skills: {
      reading: 'Read an information text about desert animals.',
      writing: 'Write sentences with adverbs of frequency.',
    },
    q: 'Camels eat plants to stay strong. Which adverb fits: Camels ___ eat meat?',
    options: ['never', 'always', 'usually', 'often'],
    answer: 'never',
    why: 'Camels eat plants, so they never eat meat. "Never" means zero per cent of the time.',
  },
  {
    u: 1, n: 3, page: 13, pages: '13–16',
    en: 'Story Time', ar: 'وقت القصة',
    focus:
      'A story has characters, a setting, a sequence of events and an end. When we read a story we look for the order of events and for the moral, which is the lesson the story teaches.',
    objectives: [
      'Identify the characters and the setting of a story.',
      'Put the events of a story in the correct order.',
      'State the moral of a story in my own words.',
    ],
    vocab: [
      ['character', 'a person or animal in a story'],
      ['setting', 'where and when a story happens'],
      ['moral', 'the lesson a story teaches'],
      ['sequence', 'the order in which things happen'],
    ],
    languageInUse: {
      title: 'Sequence words',
      rule: 'Use first, next, then and finally to show the order of events.',
      example: 'First the frog jumped. Then it fell. Finally it climbed out.',
    },
    skills: {
      reading: 'Read a short story and reorder its events.',
      speaking: 'Retell a story using sequence words.',
    },
    q: 'What is the moral of a story?',
    options: [
      'The lesson the story teaches.',
      'The place where the story happens.',
      'The name of the main character.',
      'The number of pages.',
    ],
    answer: 'The lesson the story teaches.',
    why: 'The moral is the message or lesson, not the setting or the characters.',
  },
  {
    u: 1, n: 4, page: 17, pages: '17–19',
    en: 'Writing: A Recipe', ar: 'الكتابة: وصفة طعام',
    focus:
      'A recipe tells the reader what to use and what to do, in order. We use sequence words and imperative verbs, and we list the ingredients before the steps.',
    objectives: [
      'List the ingredients of a simple recipe.',
      'Write the steps of a recipe in the correct order.',
      'Use imperative verbs in instructions.',
    ],
    vocab: [
      ['ingredient', 'one of the foods used in a recipe'],
      ['recipe', 'instructions for cooking a dish'],
      ['step', 'one action in a set of instructions'],
    ],
    languageInUse: {
      title: 'Imperative verbs',
      rule: 'Instructions start with the base verb: wash, cut, mix, add, cook.',
      example: 'Wash the rice. Add water. Cook for twenty minutes.',
    },
    skills: {
      writing: 'Write a recipe for an Egyptian dish using sequence words.',
    },
    q: 'Which sentence belongs in a recipe?',
    options: [
      'Cut the tomatoes into small pieces.',
      'I like tomatoes very much.',
      'Tomatoes are red.',
      'My mother bought tomatoes yesterday.',
    ],
    answer: 'Cut the tomatoes into small pieces.',
    why: 'A recipe step is an instruction, so it starts with an imperative verb.',
  },
  {
    u: 1, n: 5, page: 20, pages: '20–24',
    en: "Let's Make a Flyer!", ar: 'لنصنع منشوراً دعائياً',
    focus:
      'A flyer is a short page that gives information about a place or an event and tries to make people interested. A good flyer has a title, a picture, short sentences and contact details.',
    objectives: [
      'Identify the parts of a flyer.',
      'Write short persuasive sentences about a restaurant.',
      'Choose a title that fits the purpose.',
    ],
    vocab: [
      ['flyer', 'a short printed page that advertises something'],
      ['restaurant', 'a place where people pay to eat'],
      ['menu', 'a list of the food a place serves'],
    ],
    languageInUse: {
      title: 'Adjectives for description',
      rule: 'Use adjectives before a noun to make the writing lively.',
      example: 'Try our fresh fish and our famous rice.',
    },
    skills: {
      writing: 'Make a flyer about your favourite restaurant.',
    },
    q: 'What is the main purpose of a flyer?',
    options: [
      'To give information and make people interested.',
      'To tell a long story.',
      'To list grammar rules.',
      'To record a science experiment.',
    ],
    answer: 'To give information and make people interested.',
    why: 'A flyer is advertising material: it informs and persuades in a short space.',
  },

  // ─────────────────────────────────────────────────────────── Unit 2
  {
    u: 2, n: 1, page: 26, pages: '26–27',
    en: 'Sports for Better Health', ar: 'الرياضة من أجل صحة أفضل',
    focus:
      'Sports make the heart strong, help muscles grow and increase energy. When you feel tired during sport you should stop and rest, and you should drink water.',
    objectives: [
      'Explain how sport helps the body.',
      'Answer comprehension questions about a dialogue.',
      'Give advice about resting during exercise.',
    ],
    vocab: [
      ['fit', 'healthy and strong'],
      ['muscles', 'body parts that let you move'],
      ['energy', 'the power to be active'],
    ],
    languageInUse: {
      title: 'should for advice',
      rule: 'Use should + base verb to give advice.',
      example: 'You should drink water. You should not play when you are tired.',
    },
    skills: {
      listening: 'Listen to a dialogue about sport and health.',
      speaking: 'Talk about your own healthy habits.',
    },
    q: 'What should you do if you feel tired while playing sport?',
    options: ['Stop and rest.', 'Run faster.', 'Drink nothing.', 'Play for two more hours.'],
    answer: 'Stop and rest.',
    why: 'The dialogue says you should rest when you feel tired, so your body can recover.',
  },
  {
    u: 2, n: 2, page: 28, pages: '28–30',
    en: 'My Habits: Then and Now', ar: 'عاداتي: بين الأمس واليوم',
    focus:
      'Adam did not exercise in the past, but now he exercises and eats more fruit and vegetables. The past simple tells us about the past; the present simple tells us about now.',
    objectives: [
      'Contrast past and present habits.',
      'Form the past simple of regular verbs.',
      'Read and mark statements true or false.',
    ],
    vocab: [
      ['habit', 'something you do often'],
      ['past', 'the time before now'],
      ['vegetables', 'plants we eat as food'],
    ],
    languageInUse: {
      title: 'Past simple',
      rule: 'Regular past verbs add -ed. Irregular verbs change form.',
      example: 'Adam did not exercise. Now he eats fruit. Yesterday he walked to school.',
    },
    skills: {
      reading: 'Read a text about changing habits.',
      writing: 'Write about your own past and present habits.',
    },
    q: 'Which sentence is about the past?',
    options: [
      'Adam did not exercise last year.',
      'Adam eats fruit now.',
      'Adam plays football every day.',
      'Adam is healthy today.',
    ],
    answer: 'Adam did not exercise last year.',
    why: '"Last year" and "did not exercise" both show that the action happened in the past.',
  },
  {
    u: 2, n: 3, page: 31, pages: '31–33',
    en: "Our Body's Super Pump", ar: 'المضخة الخارقة في جسمنا',
    focus:
      'The heart pumps blood around the body. Blood carries oxygen and food to every part. The heart beats faster when we exercise because the body needs more oxygen.',
    objectives: [
      'Explain the job of the heart.',
      'Explain why the heart beats faster during exercise.',
      'Recognise that a syllable has one vowel sound.',
    ],
    vocab: [
      ['heart', 'the organ that pumps blood'],
      ['oxygen', 'the gas our body needs from the air'],
      ['beat', 'to move with a regular rhythm'],
    ],
    languageInUse: {
      title: 'Syllables',
      rule: 'A syllable is a word part with one vowel sound. "Bread" has one vowel sound, so it has one syllable.',
      example: 'heart (1 syllable), ox-y-gen (3 syllables)',
    },
    skills: {
      reading: 'Read an information text about the heart.',
      speaking: 'Explain what happens to your heart when you run.',
    },
    q: 'Why does the heart beat faster when you exercise?',
    options: [
      'The body needs more oxygen.',
      'The heart is cold.',
      'The blood stops moving.',
      'The muscles disappear.',
    ],
    answer: 'The body needs more oxygen.',
    why: 'Exercise uses more oxygen, so the heart pumps faster to deliver it.',
  },
  {
    u: 2, n: 4, page: 34, pages: '34–37',
    en: 'Healthcare Heroes', ar: 'أبطال الرعاية الصحية',
    focus:
      'Doctors, nurses, pharmacists and paramedics help us stay healthy. They work long hours and help people on the spot. When we write about a real person, every detail must be true.',
    objectives: [
      'Name healthcare workers and describe how they help.',
      'Explain the meaning of an expression from context.',
      'Write a short non-fiction text with true details.',
    ],
    vocab: [
      ['pharmacist', 'a person who prepares and sells medicine'],
      ['paramedic', 'a person who gives emergency medical help'],
      ['stethoscope', 'a tool a doctor uses to listen to the heart'],
    ],
    languageInUse: {
      title: 'Non-fiction writing',
      rule: 'Non-fiction must be true. Include an introductory sentence, true details and adjectives.',
      example: 'My neighbour, Selim, is a doctor. He wears a white coat.',
    },
    skills: {
      writing: 'Write a short true text about a healthcare worker.',
    },
    q: 'What does "to give help on the spot" mean?',
    options: ['To help immediately.', 'To help after a long time.', 'To help only if asked.', 'To refuse help.'],
    answer: 'To help immediately.',
    why: 'Emergency workers help at once, where the person is, which is what "on the spot" means.',
  },

  // ─────────────────────────────────────────────────────────── Unit 3
  {
    u: 3, n: 1, page: 42, pages: '42–44',
    en: 'When Nature Strikes!', ar: 'حين تغضب الطبيعة',
    focus:
      'Extreme weather includes thunderstorms, sandstorms, floods, heat waves, droughts and wildfires. Each one has its own danger and its own safety rule.',
    objectives: [
      'Name extreme weather events.',
      'Match each event to its description.',
      'Give a safety rule for one event.',
    ],
    vocab: [
      ['thunderstorm', 'a storm with thunder and lightning'],
      ['drought', 'a long time with no rain'],
      ['heat wave', 'a period of very hot weather'],
      ['flood', 'water covering dry land'],
    ],
    languageInUse: {
      title: 'Past simple for past events',
      rule: 'Use the past simple for events that finished in the past.',
      example: 'There was a flood in our city last week. It rained for two days.',
    },
    skills: {
      listening: 'Listen to a conversation about extreme weather.',
      speaking: 'Describe a weather event you have seen.',
    },
    q: 'Which event means a long period with no rain?',
    options: ['Drought', 'Flood', 'Thunderstorm', 'Heat wave'],
    answer: 'Drought',
    why: 'A drought is a long dry period; a flood is too much water, the opposite condition.',
  },
  {
    u: 3, n: 2, page: 45, pages: '45–48',
    en: 'Extreme Weather in Ancient Egypt', ar: 'الطقس المتطرف في مصر القديمة',
    focus:
      'Ancient Egypt depended on the Nile flood. When the flood was low, crops failed; when it was too high, villages were damaged. The weather shaped farming and daily life.',
    objectives: [
      'Explain how the Nile flood affected farming.',
      'Read a historical information text.',
      'Compare past and present weather problems.',
    ],
    vocab: [
      ['crops', 'plants grown for food'],
      ['harvest', 'the time when crops are collected'],
      ['flood', 'water covering land that is usually dry'],
    ],
    languageInUse: {
      title: 'Because and so',
      rule: 'Use because to give a reason and so to give a result.',
      example: 'The flood was low, so the crops failed. Farming was hard because the rain was rare.',
    },
    skills: {
      reading: 'Read about weather in Ancient Egypt.',
      writing: 'Write two sentences with because and so.',
    },
    q: 'What happened when the Nile flood was too low in Ancient Egypt?',
    options: ['The crops failed.', 'The villages were flooded.', 'The rain increased.', 'The harvest doubled.'],
    answer: 'The crops failed.',
    why: 'Less water meant less irrigation, so the crops could not grow.',
  },
  {
    u: 3, n: 3, page: 49, pages: '49–52',
    en: 'Story Time: Two Frogs', ar: 'وقت القصة: الضفدعان',
    focus:
      'In this story two frogs face a problem together. A story shows characters who meet a problem, act, and reach an end that carries a moral. Vowel digraphs such as ea in "leap" make one sound.',
    objectives: [
      'Identify the problem the characters face.',
      'Order the events of the story.',
      'State the moral in my own words.',
    ],
    vocab: [
      ['problem', 'a difficulty the character must solve'],
      ['brave', 'not afraid in a hard situation'],
      ['moral', 'the lesson of a story'],
    ],
    languageInUse: {
      title: 'Vowel digraphs',
      rule: 'A vowel digraph is two vowels together that make one sound.',
      example: 'leap (ea), flood (oo), boat (oa)',
    },
    skills: {
      reading: 'Read the story and reorder the events.',
      speaking: 'Retell the story and state its moral.',
    },
    q: 'What does a story moral do?',
    options: [
      'It teaches a lesson about life.',
      'It lists the characters.',
      'It describes the weather.',
      'It gives page numbers.',
    ],
    answer: 'It teaches a lesson about life.',
    why: 'The moral is the message the story leaves with the reader.',
  },
  {
    u: 3, n: 4, page: 53, pages: '53–56',
    en: 'Writing: Fiction Story', ar: 'الكتابة: قصة خيالية',
    focus:
      'A fiction story is made up. It has a beginning that introduces the characters and the setting, a middle with a problem, and an end that resolves it.',
    objectives: [
      'Plan a story with a beginning, a middle and an end.',
      'Introduce characters and setting.',
      'Write a simple resolution.',
    ],
    vocab: [
      ['fiction', 'writing that is made up, not true'],
      ['setting', 'where and when a story happens'],
      ['resolution', 'the way a story ends and the problem is solved'],
    ],
    languageInUse: {
      title: 'Story structure',
      rule: 'Beginning: characters and setting. Middle: a problem. End: a resolution.',
      example: 'One day a boy named Ziad found a small box. He could not open it. Finally his sister helped him.',
    },
    skills: {
      writing: 'Write a short fiction story with a clear structure.',
    },
    q: 'Which part of a story introduces the characters and the setting?',
    options: ['The beginning', 'The middle', 'The end', 'The title'],
    answer: 'The beginning',
    why: 'The beginning sets the scene, so the reader knows who and where before the problem starts.',
  },

  // ─────────────────────────────────────────────────────────── Unit 4
  {
    u: 4, n: 1, page: 62, pages: '62–64',
    en: 'Places in Our Community', ar: 'أماكن في مجتمعنا',
    focus:
      'A community has places that serve different needs: a school, a hospital, a market, a club and a library. Each place has a purpose and people who work there.',
    objectives: [
      'Name places in a community and their purpose.',
      'Ask and answer questions about favourite places.',
      'Recognise trigraph sounds in spoken words.',
    ],
    vocab: [
      ['community', 'the people and places around where you live'],
      ['club', 'a place where people play sport or meet'],
      ['library', 'a place where people read and borrow books'],
    ],
    languageInUse: {
      title: 'Questions about places',
      rule: 'Use Where is ...? and What can you do there? to ask about a place.',
      example: 'Where is the library? It is next to the school.',
    },
    skills: {
      speaking: 'Ask and answer about favourite places in your community.',
    },
    q: 'Where do people borrow books?',
    options: ['A library', 'A hospital', 'A club', 'A market'],
    answer: 'A library',
    why: 'A library keeps books and lends them to readers.',
  },
  {
    u: 4, n: 2, page: 65, pages: '65–67',
    en: 'Egyptian Villages', ar: 'القرى المصرية',
    focus:
      'An Egyptian village has fields, a small market, a mosque or a church, and a school. Village life is close to farming and to the Nile.',
    objectives: [
      'Describe the main features of an Egyptian village.',
      'Use there is and there are correctly.',
      'Listen and write missing words.',
    ],
    vocab: [
      ['village', 'a small town in the countryside'],
      ['field', 'land used for growing crops'],
      ['canal', 'a channel that carries water'],
    ],
    languageInUse: {
      title: 'There is / There are',
      rule: 'Use there is with one thing and there are with more than one.',
      example: 'There is a school in the village. There are many fields.',
    },
    skills: {
      listening: 'Listen to a description of a village and fill in words.',
      writing: 'Describe your village or neighbourhood.',
    },
    q: 'Which sentence is correct?',
    options: [
      'There are many fields in the village.',
      'There is many fields in the village.',
      'There are a school in the village.',
      'There is many field in the village.',
    ],
    answer: 'There are many fields in the village.',
    why: '"Fields" is plural, so we use there are.',
  },
  {
    u: 4, n: 3, page: 68, pages: '68–71',
    en: 'Multiply It with Words!', ar: 'الضرب بالكلمات',
    focus:
      'Word problems turn a real situation into mathematics. We read carefully, find the numbers, decide the operation and then check that the answer makes sense.',
    objectives: [
      'Read a word problem and identify the numbers.',
      'Choose multiplication for equal groups.',
      'Explain the answer in a full sentence.',
    ],
    vocab: [
      ['multiply', 'to add equal groups repeatedly'],
      ['product', 'the result of a multiplication'],
      ['equal groups', 'groups that have the same number in each'],
    ],
    languageInUse: {
      title: 'Explaining a solution',
      rule: 'State the numbers, the operation and the answer in a sentence.',
      example: 'A farmer has 4 boxes with 12 apples each. 4 × 12 = 48 apples.',
    },
    skills: {
      reading: 'Read and solve a multiplication word problem.',
      writing: 'Explain the solution in a sentence.',
    },
    q: 'A farmer has 4 boxes. Each box holds 12 apples. How many apples in total?',
    options: ['48', '16', '3', '24'],
    answer: '48',
    why: 'Four equal groups of twelve means 4 × 12 = 48.',
  },
  {
    u: 4, n: 4, page: 70, pages: '70–75',
    en: 'Writing: The New Administrative Capital', ar: 'الكتابة: العاصمة الإدارية الجديدة',
    focus:
      'The New Administrative Capital is a modern Egyptian city built to hold government offices. A description of a place needs a clear order: where it is, what is there, and why it matters.',
    objectives: [
      'Describe a place using spatial order.',
      'Use adjectives to describe a city.',
      'Write a short informative paragraph.',
    ],
    vocab: [
      ['capital', 'the city where a country\'s government works'],
      ['modern', 'new in style or design'],
      ['government', 'the group that runs a country'],
    ],
    languageInUse: {
      title: 'Spatial order',
      rule: 'Use next to, near, in the middle of and behind to describe where things are.',
      example: 'The tower is in the middle of the city, next to the park.',
    },
    skills: {
      writing: 'Write a paragraph describing a modern place in Egypt.',
    },
    q: 'Which word tells you where something is?',
    options: ['next to', 'quickly', 'very', 'always'],
    answer: 'next to',
    why: '"Next to" gives position; the other words give manner, degree or frequency.',
  },

  // ─────────────────────────────────────────────────────────── Unit 5
  {
    u: 5, n: 1, page: 78, pages: '78–82',
    en: 'Treasures of Egypt', ar: 'كنوز مصر',
    focus:
      'Natural resources are things from nature that people use: water, soil, minerals, sunlight and wind. Egypt uses these resources for farming, building and energy.',
    objectives: [
      'Name natural resources and their uses.',
      'Discuss why natural resources matter.',
      'Identify the stressed syllable in words with prefixes.',
    ],
    vocab: [
      ['natural resource', 'something from nature that people use'],
      ['mineral', 'a solid substance found in the ground'],
      ['resource', 'a supply that can be used'],
    ],
    languageInUse: {
      title: 'Using resources',
      rule: 'Use made of and used for to describe a resource.',
      example: 'Glass is made of sand. Water is used for farming.',
    },
    skills: {
      listening: 'Listen to a class discussion about natural resources.',
      speaking: 'Discuss the importance of one resource.',
    },
    q: 'Which of these is a natural resource?',
    options: ['Sunlight', 'A bicycle', 'A school bag', 'A football'],
    answer: 'Sunlight',
    why: 'Sunlight comes from nature and people use it; the others are made by people.',
  },
  {
    u: 5, n: 2, page: 81, pages: '81–83',
    en: 'Metals and Minerals', ar: 'المعادن والفلزات',
    focus:
      'Metals and minerals come from the ground. Gold, copper and iron are metals. We compare them with comparative adjectives: harder than, heavier than, more valuable than.',
    objectives: [
      'Distinguish metals from other materials.',
      'Use comparative adjectives correctly.',
      'Match a word to its definition.',
    ],
    vocab: [
      ['metal', 'a hard material such as iron or gold'],
      ['valuable', 'worth a lot'],
      ['copper', 'a reddish metal used in wires'],
    ],
    languageInUse: {
      title: 'Comparative adjectives',
      rule: 'Short adjectives add -er + than. Longer adjectives use more + adjective + than.',
      example: 'Iron is harder than copper. Gold is more valuable than iron.',
    },
    skills: {
      reading: 'Read about metals and minerals.',
      writing: 'Compare two materials using comparative adjectives.',
    },
    q: 'Which sentence uses the comparative correctly?',
    options: [
      'Gold is more valuable than iron.',
      'Gold is valuabler than iron.',
      'Gold is more valuable that iron.',
      'Gold is valuable than iron.',
    ],
    answer: 'Gold is more valuable than iron.',
    why: '"Valuable" is a long adjective, so the comparative is more valuable + than.',
  },
  {
    u: 5, n: 3, page: 84, pages: '84–87',
    en: 'Story Time: "Just Watch!"', ar: 'وقت القصة: «فقط راقب!»',
    focus:
      'The story follows a big ship and the people who admire it. A reader looks for the characters, the problem and the ending, and asks what the story is really saying.',
    objectives: [
      'Identify the characters and the problem in the story.',
      'Explain the meaning of words from context.',
      'State the message of the story.',
    ],
    vocab: [
      ['admire', 'to look at something with pleasure'],
      ['cargo', 'the goods a ship carries'],
      ['give up', 'to stop trying'],
    ],
    languageInUse: {
      title: 'Words in context',
      rule: 'Use the words around an unknown word to work out its meaning.',
      example: 'The ship carried cargo: boxes, machines and food.',
    },
    skills: {
      reading: 'Read the story and answer comprehension questions.',
      speaking: 'Retell the story and give its message.',
    },
    q: 'What does "cargo" mean?',
    options: [
      'The goods a ship carries.',
      'The captain of a ship.',
      'The colour of a ship.',
      'The speed of a ship.',
    ],
    answer: 'The goods a ship carries.',
    why: 'The text lists boxes, machines and food as cargo, so cargo means the goods carried.',
  },
  {
    u: 5, n: 4, page: 88, pages: '88–91',
    en: 'Writing: Object-Perspective Narratives', ar: 'الكتابة: الحكاية من منظور الأشياء',
    focus:
      'An object-perspective narrative is written as if a thing — water, copper or oil — is speaking. It uses I, me and my, describes with the five senses, and explains why the object matters.',
    objectives: [
      'Write in the first person as an object.',
      'Describe using the five senses.',
      'Explain why the object is important.',
    ],
    vocab: [
      ['perspective', 'the point of view from which something is told'],
      ['senses', 'sight, hearing, smell, taste and touch'],
      ['narrator', 'the voice that tells the story'],
    ],
    languageInUse: {
      title: 'First-person narration',
      rule: 'Use I, me and my when the narrator is the object itself.',
      example: 'I am water. I flow through the fields. You drink me every day.',
    },
    skills: {
      writing: 'Write a short object-perspective narrative about water or copper.',
    },
    q: 'Which pronoun belongs in an object-perspective narrative?',
    options: ['I', 'he', 'they', 'it is not used'],
    answer: 'I',
    why: 'The object speaks about itself, so it uses the first person.',
  },
  // ─────────────────────────────────────────────────────────── Unit 6
  {
    u: 6, n: 1, page: 92, pages: '92-94',
    en: 'The Talking Earth: Meet the Story', ar: 'الأرض المتكلمة: التعرف على القصة',
    focus:
      'Unit 6 is a single extended story, "The Talking Earth" by Jean Craighead George, about Billie Wind, a young Native American girl living in Florida. She loves science and wants to be a scientist, but her family and the elders of her tribe believe the Earth can talk and share wisdom through the wind, the water and the animals. The unit opens with the story vocabulary: canoe, Earth, Everglades, swamp, alligator, owl, shell, scientist, splash, and then native, tribe, elders, shelter, survive, attack, struggle, wisdom.',
    objectives: [
      'Ask and answer questions about the story.',
      'Identify the setting and the characters of the story.',
      'Use the new story vocabulary in context.',
    ],
    vocab: [
      ['canoe', 'a light narrow boat moved with a paddle'],
      ['Everglades', 'a large swamp area in Florida, in the United States'],
      ['swamp', 'soft wet ground covered with water'],
      ['alligator', 'a large reptile that lives in rivers and swamps'],
      ['tribe', 'a group of people who live together and share the same language, culture and history'],
      ['elders', 'older people who are wise and respected'],
      ['shelter', 'a safe place that protects someone from bad weather or danger'],
      ['survive', 'to stay alive, especially in dangerous situations'],
    ],
    languageInUse: {
      title: 'Present versus past',
      rule: 'Use the present simple for what is always true, and the past simple for events that finished.',
      example: 'Billie believes the Earth cannot talk. She went into the Everglades alone.',
    },
    skills: {
      reading: 'Analyse the elements of the story: setting, characters and events.',
      speaking: 'Ask and answer questions about the story.',
      writing: "Rewrite part of the story from the heroine's perspective.",
    },
    q: 'Who is the main character of "The Talking Earth"?',
    options: ['Billie Wind', 'Jean Craighead George', 'The elders', 'A scientist in Florida'],
    answer: 'Billie Wind',
    why: 'The story follows Billie Wind, a young Native American girl who loves science.',
  },
  {
    u: 6, n: 2, page: 95, pages: '95-99',
    en: 'The Talking Earth: Billie in the Everglades', ar: 'الأرض المتكلمة: بيلي في الإيفرجليدز',
    focus:
      'Billie Wind tells the elders she does not believe the Earth can talk. Disappointed, they send her alone into the Everglades National Park to listen. At first she struggles: no shelter, no food, strange sounds at night, alligators splashing and owls hooting. Slowly she pays attention: the alligators wait patiently for food, the turtles hide in their shells, the birds warn each other. She learns to catch fish, make a fire and find shelter, and she learns that the Earth does talk, not with words but through wind, animals and land.',
    objectives: [
      'Answer comprehension questions about the story.',
      'Put the events of the story in the correct order.',
      'Explain what Billie learns in the Everglades.',
    ],
    vocab: [
      ['struggle', 'to have a hard time doing something'],
      ['attack', 'to try to hurt someone'],
      ['wisdom', 'the quality of having good judgement from knowledge and experience'],
      ['native', 'the first person who lived in a place'],
    ],
    languageInUse: {
      title: 'Past simple for narrative',
      rule: 'A narrative tells finished events with the past simple.',
      example: 'She packed her canoe and went into the Everglades. She learned how to survive.',
    },
    skills: {
      reading: 'Identify the sequence of events and the moral of the story.',
      writing: 'Complete a summary of the story with the words in the box.',
    },
    q: 'Why did the elders send Billie Wind into the Everglades?',
    options: [
      'So that she would listen to the Earth and understand',
      'So that she would become a scientist',
      'So that she would learn to swim',
      'So that she would meet the animals',
    ],
    answer: 'So that she would listen to the Earth and understand',
    why: 'The elders told Billie that if she did not believe them, she should go into the park alone and listen to the Earth.',
  },
  {
    u: 6, n: 3, page: 100, pages: '100-104',
    en: 'The Talking Earth: Characters, Vocabulary and Events', ar: 'الأرض المتكلمة: الشخصيات والمفردات والأحداث',
    focus:
      'The book works through the story in three steps. Characters: match Billie Wind, her family and the elders to their descriptions. Vocabulary: write the word for each picture from the story word list. Events: put the events in order, from Billie going to the Everglades to her learning to survive, then complete a summary with the words in the box.',
    objectives: [
      'Match each character to the correct description.',
      'Write the story vocabulary word for each picture.',
      'Put the events of the story in order and complete a summary.',
    ],
    vocab: [
      ['shell', 'the hard outer covering of a turtle or a snail'],
      ['splash', 'the sound and movement of water hitting something'],
      ['owl', 'a bird that hunts at night and hoots'],
      ['scientist', 'a person who studies science'],
    ],
    languageInUse: {
      title: 'Sequencing words',
      rule: 'Use first, then, after that and finally to order the events of a story.',
      example: 'First Billie went to the Everglades. Then she learned to catch fish.',
    },
    skills: {
      reading: 'Answer critical thinking questions about the story.',
      writing: 'Complete a summary of the story using the words in the box.',
    },
    q: 'Which event happened first in the story?',
    options: [
      'Billie told the elders she did not believe the Earth could talk',
      'Billie learned how to make a fire',
      'Billie was no longer afraid',
      'Billie watched the alligators waiting for food',
    ],
    answer: 'Billie told the elders she did not believe the Earth could talk',
    why: 'The story begins with Billie telling the elders she does not believe them, and they send her to the Everglades.',
  },
  {
    u: 6, n: 4, page: 105, pages: '105-108',
    en: 'Unit 6 Quick Review and Review 2', ar: 'مراجعة الوحدة السادسة والمراجعة الثانية',
    focus:
      'The unit closes with a Quick Review: find and circle the story words, complete the sequence of events, and answer questions about Billie. Review 2 then covers the whole term: choose the correct answer on resources and community places, read a text about mineral resources and answer questions, and complete a mind map of story elements (moral, setting, characters).',
    objectives: [
      'Recall the story vocabulary and the sequence of events.',
      'Answer questions about resources and community places.',
      'Complete a mind map of story elements.',
    ],
    vocab: [
      ['resource', 'something useful that people take from the earth'],
      ['mineral', 'a natural solid substance found under the earth'],
      ['moral', 'the lesson or message in a story'],
      ['setting', 'the time and place where a story happens'],
    ],
    languageInUse: {
      title: 'Story elements',
      rule: 'Every story has characters, a setting, a plot and a moral.',
      example: 'Setting: the Everglades. Characters: Billie Wind and the elders. Moral: listen to nature.',
    },
    skills: {
      reading: 'Read a text about mineral resources and answer the questions.',
      writing: 'Complete a mind map of the story elements.',
    },
    q: 'What is the moral of "The Talking Earth"?',
    options: [
      'Everything in nature is connected and must be cared for',
      'Science is more important than tradition',
      'Children should never listen to older people',
      'The Everglades is a dangerous place to visit',
    ],
    answer: 'Everything in nature is connected and must be cared for',
    why: 'Billie learns that the Earth talks through wind, animals and land, and that the balance breaks if people do not care for it.',
  },
];

function toLesson(spec: Spec): OfficialCurriculumLesson {
  const unit = UNIT_TITLES[spec.u];
  const conceptId = `conc_en_2026_u${spec.u}_l${spec.n}`;
  const sourceRef: SourceRef = {
    book: 'English_language_prim5_t1.pdf',
    bookAr: 'كتاب اللغة الإنجليزية — الصف الخامس الابتدائي — الفصل الدراسي الأول',
    bookEn: 'English (Connect 5), Grade 5, Term 1 (Ministry of Education)',
    grade: '5',
    term: '1',
    unit: String(spec.u),
    lesson: String(spec.n),
    page: spec.page,
    pageRange: spec.pages,
    notes:
      'Student book inspected (113 pages, SHA-256 da7e3dd7…). Unit and lesson titles and page numbers are from the printed book; explanations and exercises are Miss Noor originals.',
    isAvailable: true,
  };

  const skillLines = Object.entries(spec.skills)
    .map(([key, value]) => `${key[0].toUpperCase()}${key.slice(1)}: ${value}`)
    .join('\n');

  return {
    id: `off_en_2026_u${spec.u}_l${spec.n}`,
    subjectId: 'subj_english',
    subjectNameAr: 'اللغة الإنجليزية',
    subjectNameEn: 'English Language',
    subjectNameFr: 'Anglais',
    unitNumber: spec.u,
    unitNameAr: unit.ar,
    unitNameEn: unit.en,
    unitNameFr: unit.en,
    lessonNumber: spec.n,
    titleAr: spec.ar,
    titleEn: spec.en,
    titleFr: spec.en,
    originTag: 'official',
    language: 'en',
    instructionLanguage: 'en',
    contentLanguage: 'en',
    assessmentLanguage: 'en',
    curriculumSource: 'egyptian_national',
    track: 'french_bilingual',
    isAvailable: true,
    contentStatus: 'available',
    sourceRef,
    objectives: spec.objectives,
    readingText:
      spec.focus +
      '\n\n' +
      spec.languageInUse.title +
      ': ' +
      spec.languageInUse.rule +
      '\nExample: ' +
      spec.languageInUse.example +
      '\n\n' +
      skillLines,
    vocabulary: spec.vocab.map(([word, definition]) => ({ word, definition })),
    exercises: [
      {
        type: 'multiple_choice',
        question: spec.q,
        options: spec.options,
        expectedAnswer: spec.answer,
        page: spec.page,
      },
      {
        type: 'qa',
        question: 'In your own words: ' + spec.objectives[0],
        expectedAnswer: spec.why,
        page: spec.page,
      },
    ],
    exercisesByLanguage: {
      en: [
        {
          type: 'multiple_choice',
          question: spec.q,
          options: spec.options,
          expectedAnswer: spec.answer,
          page: spec.page,
        },
      ],
    },
    concepts: [
      {
        id: conceptId,
        conceptNumber: 1,
        titleAr: spec.ar,
        titleEn: spec.en,
        titleFr: spec.en,
        sourceText: spec.focus,
        sourceTextFr: spec.focus,
        keyPoints: spec.objectives,
        keyPointsFr: spec.objectives,
        dailyLifeExampleAr: spec.languageInUse.example,
        dailyLifeExampleEn: spec.languageInUse.example,
        dailyLifeExampleFr: spec.languageInUse.example,
        storyAnalogyAr: spec.languageInUse.example,
        storyAnalogyEn: spec.languageInUse.example,
        storyAnalogyFr: spec.languageInUse.example,
        prerequisiteAr: 'مفردات الدرس السابق ومهاراته.',
        prerequisiteEn: 'The vocabulary and skills of the previous lesson.',
        prerequisiteFr: 'Le vocabulaire et les compétences de la leçon précédente.',
        misconceptions: [
          {
            id: `mis_${conceptId}_1`,
            trigger: spec.options.find((o) => o !== spec.answer) ?? '',
            explanation: 'This choice does not match the lesson.',
            remediation: spec.why,
            explanationFr: 'Ce choix ne correspond pas à la leçon.',
            remediationFr: spec.why,
          },
        ],
        visualType: 'diagram' as const,
        visualPrompt:
          'A teaching diagram about ' + spec.en + ' using only the elements named in the lesson.',
      },
    ],
  };
}

export const ENGLISH_CURRICULUM_2026_LESSONS: OfficialCurriculumLesson[] = S.map(toLesson);
