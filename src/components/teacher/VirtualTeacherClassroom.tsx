/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { NourCharacter } from '../stage/NourCharacter';
import { NourState, SubjectOutfit } from '../../types/stage';
import { voiceService } from '../../services/voice/voiceService';
import { tutorSpeechService } from '../../services/voice/tutorSpeechService';
import { soundEffects } from '../../services/sound/soundEffects';
import { StageModal } from '../stage/StageModal';
import { LessonStudyModal } from '../curriculum/LessonStudyModal';
import {
  CurriculumSubjectPickerModal,
  SUBJECT_METADATA,
} from '../curriculum/CurriculumSubjectPickerModal';
import { curriculumService } from '../../services/curriculum/curriculumService';
import { OfficialCurriculumLesson } from '../../types/teachingSession';
import { VoiceInputControl } from '../voice/VoiceInputControl';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Bell,
  Star,
  BookOpen,
  Award,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Shirt,
  Send,
  MessageCircle,
  ChevronDown,
  HelpCircle,
  Flame,
  ArrowRight,
  Headphones,
  Square,
  Bookmark,
} from 'lucide-react';

interface QuickQuizQuestion {
  id: string;
  questionAr: string;
  questionEn: string;
  questionFr: string;
  optionsAr: string[];
  optionsEn: string[];
  optionsFr: string[];
  correctIndex: number;
  explanationAr: string;
  explanationEn: string;
  explanationFr: string;
}

export const VirtualTeacherClassroom: React.FC = () => {
  const { language, student, selectedCurriculumLessonId, setSelectedCurriculumLessonId } = useApp();
  const isArabic = language === 'ar';
  const isFrench = language === 'fr';
  const studentName = student?.name || (isArabic ? 'أمينة' : 'Amina');

  // Currently Active Lesson from Ministry Curriculum
  const [currentLessonId, setCurrentLessonId] = useState<string>(
    selectedCurriculumLessonId || 'off_ar_u1_l1_ana_astatee'
  );

  // Sync if global selected lesson changes
  useEffect(() => {
    if (selectedCurriculumLessonId && selectedCurriculumLessonId !== currentLessonId) {
      setCurrentLessonId(selectedCurriculumLessonId);
    }
  }, [selectedCurriculumLessonId, currentLessonId]);

  const currentLesson: OfficialCurriculumLesson = useMemo(() => {
    return (
      curriculumService.getLessonById(currentLessonId) ||
      curriculumService.getAllLessons()[0]
    );
  }, [currentLessonId]);

  // Outfit mapping based on subject
  const outfitMap: Record<string, SubjectOutfit> = {
    subj_arabic: 'arabic',
    subj_math: 'math',
    subj_science: 'science',
    subj_ict: 'science',
    subj_social_studies: 'social_studies',
    subj_islamic: 'islamic',
    subj_english: 'english',
    subj_calligraphy: 'calligraphy',
  };

  // Teacher State
  const [nourState, setNourState] = useState<NourState>('excited');
  const [currentOutfit, setCurrentOutfit] = useState<SubjectOutfit>(() => {
    return outfitMap[currentLesson.subjectId] || 'arabic';
  });

  // Synchronize outfit when lesson subject changes
  useEffect(() => {
    const desired = outfitMap[currentLesson.subjectId] || 'arabic';
    setCurrentOutfit(desired);
  }, [currentLesson]);

  const [teacherSpeech, setTeacherSpeech] = useState<string>(() => {
    return isArabic
      ? `أهلاً بكِ يا ${studentName}! أنا معلمتكِ نور 👩‍🏫 درس اليوم هو «${currentLesson.titleAr}» من ${currentLesson.sourceRef.bookAr}. جاهزة نكتشف سر الدرس ونحل التمارين سوا؟`
      : isFrench
      ? `Bienvenue ${studentName}! Je suis Maîtresse Nour 👩‍🏫 Notre leçon est «${currentLesson.titleEn}». Prête à découvrir les secrets du cours ensemble?`
      : `Welcome, ${studentName}! I'm Miss Nour 👩‍🏫 Today's lesson is "${currentLesson.titleEn}" from ${currentLesson.sourceRef.bookEn}. Ready to explore and master it together?`;
  });

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(!soundEffects.getMuted());

  // Interactive Classroom Station: 'chalkboard' | 'quiz' | 'vocab' | 'ask'
  const [activeStation, setActiveStation] = useState<'chalkboard' | 'quiz' | 'vocab' | 'ask'>('chalkboard');

  // Chalkboard Deep Explanation Sub-Tab: 'hook' | 'chalkboard' | 'analogy' | 'discussion'
  const [explanationSubTab, setExplanationSubTab] = useState<'hook' | 'chalkboard' | 'analogy' | 'discussion'>('hook');

  // Gamification & Rewards
  const [starsCount, setStarsCount] = useState<number>(3);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [activeVocabIndex, setActiveVocabIndex] = useState(0);

  // Modals
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isFullStageOpen, setIsFullStageOpen] = useState(false);
  const [isStudyModalOpen, setIsStudyModalOpen] = useState(false);

  // Custom Ask / Interaction Input
  const [askInput, setAskInput] = useState('');
  const [isAnswering, setIsAnswering] = useState(false);
  const [customExplanationLoading, setCustomExplanationLoading] = useState(false);

  // Dynamic explanation content state
  const [dynamicExplanations, setDynamicExplanations] = useState<Record<string, string>>({});

  // Dynamic Quiz Questions from Lesson Exercises
  const quizQuestions: QuickQuizQuestion[] = useMemo(() => {
    if (currentLesson.exercises && currentLesson.exercises.length > 0) {
      return currentLesson.exercises.map((ex, idx) => {
        const options = ex.options && ex.options.length > 0 ? ex.options : ['نعم، صحيح', 'غير صحيح'];
        let correctIdx = options.findIndex((opt) => opt === ex.expectedAnswer);
        if (correctIdx === -1) correctIdx = 0;

        return {
          id: `ex_${idx}`,
          questionAr: ex.question,
          questionEn: ex.question,
          questionFr: ex.question,
          optionsAr: options,
          optionsEn: options,
          optionsFr: options,
          correctIndex: correctIdx,
          explanationAr: `ممتازة يا ${studentName}! الإجابة الصحيحة من كتاب الوزارة هي «${ex.expectedAnswer}».`,
          explanationEn: `Great job, ${studentName}! The correct textbook answer is "${ex.expectedAnswer}".`,
          explanationFr: `Bravo ${studentName}! La bonne réponse du manuel est «${ex.expectedAnswer}».`,
        };
      });
    }

    return [
      {
        id: 'q_default',
        questionAr: `ما هو المحور الأساسي لدرس «${currentLesson.titleAr}»؟`,
        questionEn: `What is the core topic of "${currentLesson.titleEn}"?`,
        questionFr: `Quel est le thème principal de la leçon «${currentLesson.titleEn}»?`,
        optionsAr: [
          currentLesson.objectives[0] || currentLesson.titleAr,
          'موضوع مختلف لا علاقة له بالدرس',
          'معلومات خارج كتاب الوزارة',
        ],
        optionsEn: [
          currentLesson.objectives[0] || currentLesson.titleEn,
          'Unrelated topic',
          'External info',
        ],
        optionsFr: [
          currentLesson.objectives[0] || currentLesson.titleEn,
          'Sujet sans rapport',
          'Information externe',
        ],
        correctIndex: 0,
        explanationAr: `رائعة يا ${studentName}! هذا هو الهدف الأساسي للدرس في كتاب الوزارة.`,
        explanationEn: `Well done, ${studentName}! That is the core objective in your ministry book.`,
        explanationFr: `Super travail ${studentName}! C'est l'objectif principal du manuel officiel.`,
      },
    ];
  }, [currentLesson, studentName]);

  // Dynamic Vocabulary Cards from Lesson
  const vocabCards = useMemo(() => {
    if (currentLesson.vocabulary && currentLesson.vocabulary.length > 0) {
      return currentLesson.vocabulary.map((v, i) => ({
        word: v.word,
        meaningAr: v.definition,
        meaningEn: v.definition,
        meaningFr: v.definition,
        icon: ['💡', '🔍', '📘', '✨', '🌱', '⭐'][i % 6],
      }));
    }

    return [
      {
        word: currentLesson.titleAr,
        meaningAr: currentLesson.objectives[0] || 'المفهوم الأساسي للدرس وفق كتاب الوزارة المعتمد.',
        meaningEn: currentLesson.objectives[0] || 'Core lesson concept from the textbook.',
        meaningFr: currentLesson.objectives[0] || 'Notion fondamentale du manuel officiel.',
        icon: '📘',
      },
    ];
  }, [currentLesson]);

  // Pre-generate rich default explanation segments for the active lesson
  const currentLessonExplanations = useMemo(() => {
    const title = isArabic ? currentLesson.titleAr : currentLesson.titleEn;
    const book = isArabic ? currentLesson.sourceRef.bookAr : currentLesson.sourceRef.bookEn;
    const textSnippet = currentLesson.readingText ? currentLesson.readingText.slice(0, 300) : currentLesson.objectives.join(' — ');

    return {
      hook:
        dynamicExplanations[`${currentLesson.id}_hook`] ||
        (isArabic
          ? `عارفة يا ${studentName}، ورا درس «${title}» سر ممتع جداً! تخيلي لو واجهتي موقف في حياتك ومحتاجة تفهمي إزاي تتصرفي بذكاء؛ الدرس ده في ${book} بيعلمنا القاعدة الذهبية اللي هتخليكي متميزة وتفهمي اللي بيدور حواليكي بسهولة!`
          : isFrench
          ? `Sais-tu ${studentName}, derrière la leçon «${title}», il y a une énigme captivante! Ce chapitre du manuel ${book} nous montre concrètement comment observer et résoudre des défis avec brio!`
          : `Did you know, ${studentName}, there is a fascinating secret behind "${title}"? This lesson from ${book} teaches us the golden principle to solve problems and understand our world with confidence!`),
      chalkboard:
        dynamicExplanations[`${currentLesson.id}_core`] ||
        (isArabic
          ? `بصي معايا على السبورة يا ${studentName}: المحور الأساسي لدرسنا هو: ${textSnippet}. أهم حاجة ترتبي أفكارك: قراءة نص الدرس بهدوء، فهم معنى الكلمات الجديدة، وتطبيق القاعدة خطوة بخطوة في تمارين الوزارة.`
          : isFrench
          ? `Regarde le tableau avec moi, ${studentName}: Le point central est: ${textSnippet}. L'essentiel est de lire posément et d'appliquer la règle méthodiquement dans les exercices du manuel.`
          : `Look at the blackboard with me, ${studentName}: The core topic is: ${textSnippet}. The key is to break down the concept into simple steps and apply it to each practice exercise.`),
      analogy:
        dynamicExplanations[`${currentLesson.id}_analogy`] ||
        (isArabic
          ? `تعالي نشبه درس «${title}» بمثال من بيتنا ويومنا يا ${studentName}! تخيلي لو بنلعب لعبة تركيب مكعبات أو بنقسم حاجة حلوة مع أصحابنا؛ كل جزء لازم يتحط في مكانه بالظبط عشان الرسمة تطلع مظبوطة، وده بالظبط نفس منطق درس النهاردة!`
          : isFrench
          ? `Comparons «${title}» à la vie de tous les jours, ${studentName}! Comme lorsqu'on assemble des briques de jeu ou qu'on partage un goûter: chaque élément a sa place précise pour que tout fonctionne à merveille!`
          : `Let's relate "${title}" to everyday life, ${studentName}! Just like fitting puzzle pieces together or sharing a favorite snack with friends, each step has its exact place so everything works smoothly!`),
      discussion:
        dynamicExplanations[`${currentLesson.id}_discussion`] ||
        (isArabic
          ? `يا ترى يا ${studentName}، لو سألتك: إيه أكتر فكرة لفتت نظرك في درس «${title}»؟ وإزاي نقدر نطبقها في حياتنا النهاردة؟ قولي لي رأيك بالصوت أو بالكتابة!`
          : isFrench
          ? `À ton avis ${studentName}, quel est le détail le plus marquant dans «${title}»? Dis-le-moi à haute voix ou écris-le!`
          : `What do you think, ${studentName}: what was the most interesting part of "${title}"? Share your thought by voice or typing!`),
    };
  }, [currentLesson, isArabic, isFrench, studentName, dynamicExplanations]);

  // Speak Teacher text aloud using the Premier Gemini TTS pipeline
  const speakText = (text: string, state: NourState = 'talking') => {
    setTeacherSpeech(text);
    setNourState(state);
    setIsSpeaking(true);

    voiceService.unlockAudio();
    voiceService.speak(
      text,
      language,
      () => setIsSpeaking(true),
      () => {
        setIsSpeaking(false);
        setNourState('idle');
      },
      () => {
        setIsSpeaking(false);
        setNourState('idle');
      }
    );
  };

  const handleStopSpeaking = () => {
    voiceService.cancelSpeech();
    setIsSpeaking(false);
    setNourState('idle');
  };

  // Lesson selection handler
  const handleSelectLesson = (lesson: OfficialCurriculumLesson) => {
    setCurrentLessonId(lesson.id);
    setSelectedCurriculumLessonId(lesson.id);
    setIsPickerOpen(false);
    setSelectedAnswer(null);
    setCurrentQuizIndex(0);
    setQuizFeedback(null);
    setActiveVocabIndex(0);
    setExplanationSubTab('hook');

    const greeting = isArabic
      ? `أهلاً يا ${studentName}! فتحنا درس «${lesson.titleAr}» من ${lesson.sourceRef.bookAr}! أنا مستعدة لشرح كل فكرة وحل التمارين معاكي!`
      : isFrench
      ? `Bienvenue ${studentName}! Nous avons ouvert la leçon «${lesson.titleEn}». Prête à apprendre et réussir ensemble!`
      : `Welcome ${studentName}! We opened "${lesson.titleEn}" from ${lesson.sourceRef.bookEn}! Let's master this lesson together!`;

    speakText(greeting, 'excited');
  };

  // Tap on Nour for a fun interactive cheer
  const handleNourTap = () => {
    soundEffects.playBounce();
    const cheers = [
      isArabic
        ? `أهلاً ببطلتنا ${studentName}! أنا فخورة بوجودك معايا في الفصل النهاردة! 🌟`
        : `Hello champion ${studentName}! I am so happy to learn with you today! 🌟`,
      isArabic
        ? `كل سؤال بتسأليه يا ${studentName} بيخلّيكي أذكى وأقوى في مذاكرتك! 💪`
        : `Every question you ask makes you sharper and stronger in your studies, ${studentName}! 💪`,
      isArabic
        ? `يا سلام على النشاط والتركيز يا ${studentName}! يلا نذاكر ونجمع النجوم الذهبية سوا! 🚀`
        : `Look at that focus and energy, ${studentName}! Let's earn our gold stars together! 🚀`,
    ];
    const cheer = cheers[Math.floor(Math.random() * cheers.length)];
    speakText(cheer, 'excited');
  };

  // Ring the school bell
  const handleRingBell = () => {
    soundEffects.playSchoolBell();
    const greeting = isArabic
      ? `🔔 رن جرس الحصة! الكل يركز مع مس نور في درس «${currentLesson.titleAr}»!`
      : isFrench
      ? `🔔 La cloche a sonné! Tout le monde est concentré pour notre leçon «${currentLesson.titleEn}»!`
      : `🔔 Class bell rang! Let's get focused on "${currentLesson.titleEn}" with Miss Nour!`;
    speakText(greeting, 'excited');
  };

  // Voice Test Function: Unmute and play an immediate clear voice sample
  const handleVoiceTest = () => {
    soundEffects.playPop();
    const testPhrase = isArabic
      ? `صوت المعلمة نور يعمل بأعلى جودة يا ${studentName}! أنا جاهزة لشرح أي درس في كتب الوزارة!`
      : isFrench
      ? `La voix de Maîtresse Nour fonctionne parfaitement, ${studentName}! Je suis prête à t'expliquer toute la leçon!`
      : `Miss Nour's voice is crystal clear, ${studentName}! I am ready to teach any lesson from your textbooks!`;
    speakText(testPhrase, 'excited');
  };

  // Sound FX toggle
  const handleToggleSound = () => {
    const muted = soundEffects.toggleMute();
    setSoundEnabled(!muted);
  };

  // Request targeted AI explanation for current lesson
  const handleRequestTutorMode = async (mode: 'full_hook_story' | 'core_concepts' | 'real_world_analogy' | 'discussion_question' | 'simplify') => {
    soundEffects.playPop();
    setCustomExplanationLoading(true);
    setNourState('thinking');

    try {
      const resp = await fetch('/api/tutor-explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonTitle: isArabic ? currentLesson.titleAr : currentLesson.titleEn,
          subjectName: isArabic ? currentLesson.sourceRef.bookAr : currentLesson.sourceRef.bookEn,
          lessonText: currentLesson.readingText || currentLesson.objectives.join(' - '),
          studentName,
          language,
          mode,
        }),
      });

      const data = await resp.json();
      const expl = data.explanation || (isArabic ? 'درس ممتع ومهم جداً!' : 'An exciting lesson!');

      if (mode === 'full_hook_story') setExplanationSubTab('hook');
      else if (mode === 'core_concepts') setExplanationSubTab('chalkboard');
      else if (mode === 'real_world_analogy') setExplanationSubTab('analogy');
      else if (mode === 'discussion_question') setExplanationSubTab('discussion');

      speakText(expl, 'talking');
    } catch {
      speakText(currentLessonExplanations.chalkboard, 'talking');
    } finally {
      setCustomExplanationLoading(false);
    }
  };

  // Quiz Answer Selection
  const handleSelectQuizOption = (optionIndex: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(optionIndex);

    const question = quizQuestions[currentQuizIndex];
    const isCorrect = optionIndex === question.correctIndex;

    if (isCorrect) {
      soundEffects.playSuccess();
      soundEffects.playStarEarned();
      setStarsCount((prev) => prev + 1);
      const praise = isArabic
        ? question.explanationAr
        : isFrench
        ? question.explanationFr
        : question.explanationEn;
      setQuizFeedback(praise);
      speakText(praise, 'celebrating');
    } else {
      soundEffects.playPop();
      const encouragement = isArabic
        ? `ولا يهمك خالص يا ${studentName}! الإجابة الصحيحة من كتاب الوزارة هي: «${question.optionsAr[question.correctIndex]}». تعالي نفهم السبب ونجرب السؤال اللي بعده!`
        : isFrench
        ? `Presque, ${studentName}! La bonne réponse est: «${question.optionsFr[question.correctIndex]}». Regardons ensemble l'explication!`
        : `Almost there, ${studentName}! The correct answer was: "${question.optionsEn[question.correctIndex]}". Let's look at why!`;
      setQuizFeedback(encouragement);
      speakText(encouragement, 'encouraging');
    }
  };

  const handleNextQuizQuestion = () => {
    soundEffects.playPop();
    setSelectedAnswer(null);
    setQuizFeedback(null);
    if (currentQuizIndex < quizQuestions.length - 1) {
      setCurrentQuizIndex((prev) => prev + 1);
      const nextQ = quizQuestions[currentQuizIndex + 1];
      const qText = isArabic ? nextQ.questionAr : isFrench ? nextQ.questionFr : nextQ.questionEn;
      speakText(qText, 'thinking');
    } else {
      soundEffects.playSuccess();
      const congrats = isArabic
        ? `🎉 برافو عليكي يا ${studentName}! أتممتي كل أسئلة درس «${currentLesson.titleAr}» وجمعتي ${starsCount} نجوم ذهبية متألقة!`
        : isFrench
        ? `🎉 Félicitations ${studentName}! Tu as terminé le quiz avec ${starsCount} étoiles dorées!`
        : `🎉 Amazing job, ${studentName}! You completed the quiz for "${currentLesson.titleEn}" with ${starsCount} gold stars!`;
      speakText(congrats, 'celebrating');
    }
  };

  // Vocabulary Card Tap
  const handleSelectVocabCard = (idx: number) => {
    soundEffects.playPop();
    setActiveVocabIndex(idx);
    const card = vocabCards[idx];
    const text = isArabic
      ? `مصطلح «${card.word}»: معناه في كتاب الوزارة: ${card.meaningAr}`
      : isFrench
      ? `Mot «${card.word}»: définition: ${card.meaningFr}`
      : `Vocabulary word "${card.word}": ${card.meaningEn}`;
    speakText(text, 'talking');
  };

  // Ask Teacher question handler
  const handleAskQuestion = async () => {
    const q = askInput.trim();
    if (!q) return;

    soundEffects.playPop();
    setIsAnswering(true);
    setAskInput('');
    setNourState('thinking');

    try {
      const resp = await fetch('/api/tutor-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentInput: q,
          currentBeatText: currentLesson.readingText || currentLesson.objectives.join(' - '),
          lessonTitle: isArabic ? currentLesson.titleAr : currentLesson.titleEn,
          subjectName: isArabic ? currentLesson.sourceRef.bookAr : currentLesson.sourceRef.bookEn,
          studentName,
          language,
        }),
      });

      const data = await resp.json();
      const answer = data.reply || (isArabic ? `أنا سامعاكي ومركّزة معاكي يا ${studentName}!` : `I hear you loud and clear, ${studentName}!`);
      speakText(answer, 'talking');
    } catch {
      const fallback = isArabic
        ? `سؤال ذكي جداً يا ${studentName}! في درسنا «${currentLesson.titleAr}»، أهم نقطة هي: ${currentLesson.objectives[0] || 'التركيز والتعلم المستمر'}.`
        : `Great question, ${studentName}! In our lesson "${currentLesson.titleEn}", the core idea is: ${currentLesson.objectives[0] || 'Keep exploring'}.`;
      speakText(fallback, 'talking');
    } finally {
      setIsAnswering(false);
    }
  };

  const subjectMeta = SUBJECT_METADATA[currentLesson.subjectId] || {
    icon: '📚',
    color: 'indigo',
    bgGradient: 'from-indigo-600 to-indigo-800',
    termLabel: 'الفصل الدراسي الأول',
  };

  return (
    <div
      className="flex-1 flex flex-col p-3 sm:p-4 max-w-lg mx-auto w-full pb-24 select-none space-y-2.5"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {/* 1. TOP CLASSROOM BANNER: TEACHER BADGE, STARS JAR, AUDIO TEST & BELL */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-800/95 rounded-2xl p-2.5 px-3 shadow-xs border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-linear-to-br from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center text-base font-black shadow-xs">
            👩‍🏫
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100">
                {isArabic ? 'فصل المعلمة نور' : isFrench ? 'Classe de Maîtresse Nour' : "Miss Nour's Classroom"}
              </h2>
              <span className="px-1.5 py-0.2 rounded-md text-[9px] font-black bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                {isArabic ? 'الصف الخامس' : 'Grade 5'}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              {isArabic ? 'شرح ذكي • صوت حقيقي • كتاب الوزارة' : 'Smart Voice Tutor • Ministry Textbooks'}
            </p>
          </div>
        </div>

        {/* Right side controls: Sound test, Star jar, Bell, Audio mute */}
        <div className="flex items-center gap-1.5">
          {/* Quick Voice Sound Test Button */}
          <button
            type="button"
            onClick={handleVoiceTest}
            className="px-2 py-1 rounded-xl bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-[10px] shadow-xs transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
            title={isArabic ? 'اختبار صوت المعلمة نور' : "Test Miss Nour's Voice"}
          >
            <Headphones className="w-3 h-3" />
            <span className="hidden xs:inline">{isArabic ? 'صوت' : 'Audio'}</span>
          </button>

          {/* Star Jar */}
          <div
            className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60 px-2 py-1 rounded-xl text-amber-900 dark:text-amber-300 font-black text-xs shadow-xs"
            title={isArabic ? 'برطمان النجوم الذهبية' : 'Gold Star Jar'}
          >
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500 animate-spin-slow" />
            <span>{starsCount}</span>
          </div>

          {/* School Bell */}
          <button
            type="button"
            onClick={handleRingBell}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all active:scale-95 cursor-pointer"
            title={isArabic ? 'دق جرس الحصة 🔔' : 'Ring School Bell'}
          >
            <Bell className="w-3.5 h-3.5" />
          </button>

          {/* Mute Sound FX */}
          <button
            type="button"
            onClick={handleToggleSound}
            className={`p-1.5 rounded-xl transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                : 'bg-rose-100 dark:bg-rose-950 text-rose-600'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* 2. ACTIVE LESSON SELECTOR STRIP: BUTTON TO CHANGE SUBJECT OR LESSON */}
      <div className="bg-linear-to-r from-indigo-700 via-indigo-800 to-purple-800 text-white p-2.5 rounded-2xl shadow-md flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xl shrink-0 p-1.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20">
            {subjectMeta.icon}
          </span>
          <div className="min-w-0">
            <span className="text-[9px] font-bold text-indigo-200 block truncate">
              {currentLesson.sourceRef.bookAr} • ص. {currentLesson.sourceRef.page || 1}
            </span>
            <h3 className="text-xs sm:text-sm font-black truncate">
              «{isArabic ? currentLesson.titleAr : currentLesson.titleEn}»
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsPickerOpen(true)}
          className="shrink-0 py-1.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[11px] shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1"
        >
          <span>📚</span>
          <span>{isArabic ? 'تغيير الدرس' : isFrench ? 'Changer' : 'Switch'}</span>
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      {/* 3. VIRTUAL CLASSROOM LIVING SCENE: MISS NOUR & THE CHALKBOARD */}
      <div className="relative bg-linear-to-b from-indigo-950 via-slate-900 to-indigo-950 rounded-3xl p-3 sm:p-4 text-white shadow-xl border border-indigo-800/80 overflow-hidden">
        {/* Room Classroom Wall Lighting Effect */}
        <div className="absolute top-0 inset-x-0 h-24 bg-linear-to-b from-amber-400/10 to-transparent pointer-events-none" />

        {/* Teacher Speech Dialogue Bubble */}
        <div className="relative z-20 mb-3 animate-in slide-in-from-top-2 duration-300">
          <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-2xl p-3 shadow-lg border border-indigo-200/80 dark:border-slate-700 text-slate-800 dark:text-slate-100 flex items-start gap-2.5">
            <div className="shrink-0 mt-0.5">
              <span className={`w-2.5 h-2.5 rounded-full inline-block ${isSpeaking ? 'bg-emerald-500 animate-ping' : 'bg-indigo-400'}`} />
            </div>
            <div className="flex-1">
              <p className="text-xs sm:text-sm font-bold leading-relaxed">{teacherSpeech}</p>
              {isSpeaking && (
                <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">
                  <span className="flex items-center gap-0.5">
                    <span className="w-1 h-2 bg-indigo-600 dark:bg-indigo-400 animate-pulse rounded-full" />
                    <span className="w-1 h-3.5 bg-indigo-600 dark:bg-indigo-400 animate-pulse delay-75 rounded-full" />
                    <span className="w-1 h-2 bg-indigo-600 dark:bg-indigo-400 animate-pulse delay-150 rounded-full" />
                  </span>
                  <span>{isArabic ? 'مس نور تتحدث بصوت طبيعي...' : 'Miss Nour is speaking...'}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {isSpeaking ? (
                <button
                  type="button"
                  onClick={handleStopSpeaking}
                  className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-300 transition-transform active:scale-95 cursor-pointer"
                  title={isArabic ? 'إيقاف الصوت' : 'Stop Voice'}
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => speakText(teacherSpeech, 'talking')}
                  className="p-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 transition-transform active:scale-95 cursor-pointer"
                  title={isArabic ? 'استمعي لمس نور مجدداً' : 'Replay Voice'}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
          {/* Bubble Pointer triangle */}
          <div className="w-3 h-3 bg-white/95 dark:bg-slate-800/95 rotate-45 transform origin-top-left ml-8 -mt-1 border-r border-b border-indigo-200/80 dark:border-slate-700" />
        </div>

        {/* Miss Nour Character Avatar & Interactive Chalkboard */}
        <div className="relative z-10 flex items-end justify-between gap-2 pt-1">
          {/* Miss Nour Living Animated Avatar */}
          <div
            onClick={handleNourTap}
            className="flex flex-col items-center cursor-pointer group shrink-0"
            title={isArabic ? 'اضغطي على مس نور لتتحدث معكِ!' : 'Tap Miss Nour to chat!'}
          >
            <div className="relative">
              <NourCharacter
                state={nourState}
                outfit={currentOutfit}
                size="md"
                className="transform transition-transform group-hover:scale-105 active:scale-95 drop-shadow-2xl"
              />
              {/* Sound waves when speaking */}
              {isSpeaking && (
                <div className="absolute -top-2 right-1 flex items-center gap-0.5 bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full text-[9px] font-black shadow-xs animate-bounce">
                  <span>صوت</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-950 animate-ping" />
                </div>
              )}
            </div>
            <span className="text-[10px] font-black text-amber-300 mt-1 bg-black/50 px-2.5 py-0.5 rounded-full border border-amber-300/30">
              {isArabic ? 'المعلمة نور 🌟' : 'Miss Nour 🌟'}
            </span>
          </div>

          {/* Interactive Pedagogical Chalkboard */}
          <div className="flex-1 bg-emerald-950/95 border-4 border-amber-800 rounded-2xl p-2.5 sm:p-3 shadow-inner text-emerald-100 flex flex-col justify-between min-h-[210px] relative overflow-hidden">
            {/* Wooden Chalkboard Frame Details */}
            <div className="flex items-center justify-between border-b border-emerald-800/80 pb-1.5 mb-2 text-[10px] font-bold">
              <span className="text-amber-300 flex items-center gap-1 font-mono">
                <span>📝 سبورة الدرس:</span>
                <span className="truncate max-w-[130px]">{currentLesson.sourceRef.bookAr}</span>
              </span>
              <span className="text-emerald-400 font-mono">ص. {currentLesson.sourceRef.page || 1}</span>
            </div>

            {/* Blackboard Dynamic Content */}
            <div className="space-y-1.5 min-h-[90px]">
              <h3 className="text-xs font-black text-amber-200">
                «{isArabic ? currentLesson.titleAr : currentLesson.titleEn}»
              </h3>
              <p className="text-[11px] text-emerald-200/90 leading-relaxed font-medium line-clamp-3">
                {currentLesson.readingText
                  ? currentLesson.readingText.slice(0, 180) + '...'
                  : currentLesson.objectives[0] || 'درس مقرر من كتب وزارة التربية والتعليم المصرية.'}
              </p>
            </div>

            {/* Chalkboard Quick Action Buttons */}
            <div className="grid grid-cols-2 gap-1.5 pt-2 mt-auto border-t border-emerald-800/60">
              <button
                type="button"
                onClick={() => {
                  soundEffects.playPop();
                  setIsFullStageOpen(true);
                }}
                className="py-1.5 px-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[11px] shadow-xs transition-all flex items-center justify-center gap-1 active:scale-95 cursor-pointer"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>{isArabic ? 'المسرح الحي 🎭' : 'Live Stage 🎭'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEffects.playPop();
                  setIsStudyModalOpen(true);
                }}
                className="py-1.5 px-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-black text-[11px] border border-white/20 transition-all flex items-center justify-center gap-1 active:scale-95 cursor-pointer"
              >
                <BookOpen className="w-3 h-3" />
                <span>{isArabic ? 'كتاب الوزارة 📖' : 'Textbook 📖'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Teacher Outfit Wardrobe Chips */}
        <div className="mt-3 pt-2 border-t border-indigo-800/60 flex items-center justify-between text-[11px] text-indigo-200 flex-wrap gap-1">
          <span className="flex items-center gap-1 font-bold text-amber-300 text-[10px]">
            <Shirt className="w-3 h-3" />
            <span>{isArabic ? 'زي المعلمة:' : "Outfit:"}</span>
          </span>
          <div className="flex items-center gap-1 flex-wrap">
            {[
              { id: 'arabic' as SubjectOutfit, label: 'عربي 📜' },
              { id: 'math' as SubjectOutfit, label: 'رياضيات 📐' },
              { id: 'science' as SubjectOutfit, label: 'علوم 🔬' },
              { id: 'english' as SubjectOutfit, label: 'إنجليزي 🇬🇧' },
              { id: 'social_studies' as SubjectOutfit, label: 'دراسات 🧭' },
              { id: 'islamic' as SubjectOutfit, label: 'دين 🕌' },
            ].map((outfit) => (
              <button
                key={outfit.id}
                type="button"
                onClick={() => {
                  soundEffects.playPop();
                  setCurrentOutfit(outfit.id);
                  const msg = isArabic
                    ? `غيرت زي مس نور لمادة ${outfit.label.split(' ')[0]}! جاهزة يا ${studentName}؟`
                    : `Switched outfit for ${outfit.label}! Ready, ${studentName}?`;
                  speakText(msg, 'excited');
                }}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                  currentOutfit === outfit.id
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'bg-white/10 hover:bg-white/20 text-indigo-100'
                }`}
              >
                {outfit.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. FOUR MAIN CLASSROOM STATIONS SELECTOR TABS */}
      <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-200/80 dark:bg-slate-800/90 rounded-2xl">
        {[
          { id: 'chalkboard', labelAr: 'الشرح والسبورة', labelEn: 'Explanation', icon: '👩‍🏫' },
          { id: 'quiz', labelAr: 'تحدي الأسئلة', labelEn: 'Quiz Challenge', icon: '⭐' },
          { id: 'vocab', labelAr: 'المفردات والمعاني', labelEn: 'Vocabulary', icon: '📘' },
          { id: 'ask', labelAr: 'اسألي مس نور', labelEn: 'Ask Nour', icon: '💬' },
        ].map((tab) => {
          const isActive = activeStation === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                soundEffects.playPop();
                setActiveStation(tab.id as any);
              }}
              className={`py-2 px-1 rounded-xl text-center transition-all flex flex-col items-center gap-0.5 cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md font-black scale-[1.02]'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-700/60 font-bold'
              }`}
            >
              <span className="text-base">{tab.icon}</span>
              <span className="text-[10px] leading-tight truncate">
                {isArabic ? tab.labelAr : tab.labelEn}
              </span>
            </button>
          );
        })}
      </div>

      {/* 5. STATION CONTENT VIEW */}

      {/* STATION 1: DEEP INTERACTIVE EXPLANATION STATION */}
      {activeStation === 'chalkboard' && (
        <div className="p-3.5 sm:p-4 rounded-3xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">👩‍🏫</span>
              <div>
                <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100">
                  {isArabic ? 'محطة الشرح التفاعلي مع مس نور' : 'Interactive Explanation with Miss Nour'}
                </h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  {isArabic ? 'شرح مبسط وممتع لكل جوانب درس كتاب الوزارة' : 'Clear pedagogic breakdown with audio'}
                </p>
              </div>
            </div>

            {/* Listen Button for this explanation */}
            <button
              type="button"
              onClick={() => {
                const textToSpeak = currentLessonExplanations[explanationSubTab];
                speakText(textToSpeak, 'talking');
              }}
              className="px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-bold text-[10px] flex items-center gap-1 transition-all active:scale-95 cursor-pointer shadow-xs"
              title={isArabic ? 'استمعي لهذا الجزء بصوت مس نور' : "Listen to Miss Nour's voice"}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{isArabic ? 'استمعي للشرح 🔊' : 'Listen 🔊'}</span>
            </button>
          </div>

          {/* Sub-tabs for the explanation: Hook Story | Core Blackboard | Real Analogy | Discussion */}
          <div className="flex items-center gap-1 border-b border-slate-100 dark:border-slate-700 pb-2 overflow-x-auto text-[11px] font-bold">
            {[
              { id: 'hook', labelAr: 'القصة والمقدمة 🌟', labelEn: 'The Hook 🌟' },
              { id: 'chalkboard', labelAr: 'الشرح والسبورة 📝', labelEn: 'Blackboard 📝' },
              { id: 'analogy', labelAr: 'مثال وتشبيه من الواقع 💡', labelEn: 'Real Analogy 💡' },
              { id: 'discussion', labelAr: 'سؤال للنقاش ❓', labelEn: 'Discussion ❓' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  soundEffects.playPop();
                  setExplanationSubTab(tab.id as any);
                  speakText(currentLessonExplanations[tab.id as keyof typeof currentLessonExplanations], 'talking');
                }}
                className={`px-2.5 py-1 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  explanationSubTab === tab.id
                    ? 'bg-amber-400 text-slate-950 shadow-xs font-black'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {isArabic ? tab.labelAr : tab.labelEn}
              </button>
            ))}
          </div>

          {/* Explanation Text Box */}
          <div className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-slate-750 border border-indigo-100 dark:border-slate-700 space-y-2">
            <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
              {currentLessonExplanations[explanationSubTab]}
            </p>
          </div>

          {/* 4 Pedagogical Quick Help Action Buttons for Amina */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">
              {isArabic ? '✨ اختاري ما يناسبكِ لتتعمقي أكثر مع مس نور:' : '✨ Ask Miss Nour to help you further:'}
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={customExplanationLoading}
                onClick={() => handleRequestTutorMode('simplify')}
                className="p-2 rounded-xl bg-slate-50 hover:bg-amber-50 dark:bg-slate-700/60 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 text-[11px] font-bold text-right rtl:text-right ltr:text-left transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span>💡</span>
                <span className="truncate">{isArabic ? 'مش فاهمة.. بسطيها لي!' : 'Simplify this for me!'}</span>
              </button>

              <button
                type="button"
                disabled={customExplanationLoading}
                onClick={() => handleRequestTutorMode('real_world_analogy')}
                className="p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 dark:bg-slate-700/60 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 text-[11px] font-bold text-right rtl:text-right ltr:text-left transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span>🍕</span>
                <span className="truncate">{isArabic ? 'مثال من حياتنا اليومية' : 'Everyday life example'}</span>
              </button>

              <button
                type="button"
                disabled={customExplanationLoading}
                onClick={() => handleRequestTutorMode('core_concepts')}
                className="p-2 rounded-xl bg-slate-50 hover:bg-indigo-50 dark:bg-slate-700/60 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 text-[11px] font-bold text-right rtl:text-right ltr:text-left transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span>📝</span>
                <span className="truncate">{isArabic ? 'أهم سؤال في الامتحان' : 'Key exam question'}</span>
              </button>

              <button
                type="button"
                disabled={customExplanationLoading}
                onClick={() => {
                  soundEffects.playPop();
                  setActiveStation('quiz');
                }}
                className="p-2 rounded-xl bg-slate-50 hover:bg-purple-50 dark:bg-slate-700/60 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 text-[11px] font-bold text-right rtl:text-right ltr:text-left transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span>🎯</span>
                <span className="truncate">{isArabic ? 'ابدأي اختبار التمارين' : 'Start Lesson Quiz'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STATION 2: QUIZ & STAR CHALLENGE */}
      {activeStation === 'quiz' && (
        <div className="p-3.5 sm:p-4 rounded-3xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">⭐</span>
              <div>
                <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100">
                  {isArabic ? 'تحدي الأسئلة والنجوم' : 'Textbook Quiz Challenge'}
                </h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  {isArabic
                    ? `السؤال ${currentQuizIndex + 1} من ${quizQuestions.length} من كتاب الوزارة`
                    : `Question ${currentQuizIndex + 1} of ${quizQuestions.length} from textbook`}
                </p>
              </div>
            </div>

            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300">
              +{starsCount} ⭐
            </span>
          </div>

          {/* Current Question Card */}
          {quizQuestions[currentQuizIndex] && (
            <div className="space-y-3 pt-1">
              <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-slate-750 border border-indigo-100 dark:border-slate-700">
                <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 block mb-1">
                  {isArabic ? 'السؤال:' : 'Question:'}
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 leading-relaxed">
                  {isArabic
                    ? quizQuestions[currentQuizIndex].questionAr
                    : isFrench
                    ? quizQuestions[currentQuizIndex].questionFr
                    : quizQuestions[currentQuizIndex].questionEn}
                </h4>
              </div>

              {/* Options */}
              <div className="space-y-1.5">
                {(isArabic
                  ? quizQuestions[currentQuizIndex].optionsAr
                  : isFrench
                  ? quizQuestions[currentQuizIndex].optionsFr
                  : quizQuestions[currentQuizIndex].optionsEn
                ).map((opt, oIdx) => {
                  const isSelected = selectedAnswer === oIdx;
                  const isCorrect = oIdx === quizQuestions[currentQuizIndex].correctIndex;
                  const showResult = selectedAnswer !== null;

                  return (
                    <button
                      key={oIdx}
                      type="button"
                      disabled={selectedAnswer !== null}
                      onClick={() => handleSelectQuizOption(oIdx)}
                      className={`w-full p-2.5 rounded-xl border text-xs font-bold text-right rtl:text-right ltr:text-left transition-all flex items-center justify-between cursor-pointer ${
                        showResult
                          ? isCorrect
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200'
                            : isSelected
                            ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-900 dark:text-rose-200'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-60'
                          : 'bg-slate-50 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <span>{opt}</span>
                      {showResult && (
                        <span>
                          {isCorrect ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : isSelected ? (
                            <XCircle className="w-4 h-4 text-rose-600" />
                          ) : null}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Feedback and Next Button */}
              {selectedAnswer !== null && (
                <div className="pt-2 animate-in fade-in duration-200 space-y-2">
                  <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs font-medium text-amber-900 dark:text-amber-200">
                    {quizFeedback}
                  </div>
                  <button
                    type="button"
                    onClick={handleNextQuizQuestion}
                    className="w-full py-2.5 rounded-xl bg-linear-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs shadow-md transition-all flex items-center justify-center gap-1 active:scale-95 cursor-pointer"
                  >
                    <span>{isArabic ? 'السؤال التالي ←' : 'Next Question →'}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* STATION 3: VOCABULARY & FLASHCARDS */}
      {activeStation === 'vocab' && (
        <div className="p-3.5 sm:p-4 rounded-3xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">📘</span>
              <div>
                <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100">
                  {isArabic ? 'المفردات والمصطلحات الرسمية' : 'Textbook Vocabulary'}
                </h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  {isArabic ? 'اضغطي على أي بطاقة لتسمعي النطق والمعنى من مس نور' : 'Tap any card to hear pronunciation'}
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-slate-400 font-mono">
              {vocabCards.length} {isArabic ? 'كلمات' : 'words'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {vocabCards.map((card, idx) => {
              const isSelected = activeVocabIndex === idx;
              return (
                <div
                  key={idx}
                  onClick={() => handleSelectVocabCard(idx)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-750 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base">{card.icon}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectVocabCard(idx);
                      }}
                      className="p-1 rounded-lg bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 dark:text-slate-100">
                      {card.word}
                    </h4>
                    <p className="text-[10px] text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                      {isArabic ? card.meaningAr : isFrench ? card.meaningFr : card.meaningEn}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STATION 4: ASK MISS NOUR (LIVE INTERACTIVE DISCUSSION & VOICE INPUT) */}
      {activeStation === 'ask' && (
        <div className="p-3.5 sm:p-4 rounded-3xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">💬</span>
            <div>
              <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100">
                {isArabic ? 'اسألي المعلمة نور عن أي شيء في الدرس' : 'Ask Miss Nour Anything'}
              </h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                {isArabic ? 'اكتبي أو تحدثي بصوتك ومس نور ستجيبك بالشرح الصوتي!' : 'Type or speak your question aloud'}
              </p>
            </div>
          </div>

          {/* Quick Prompt Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px] font-bold">
            {[
              isArabic ? 'مش فاهمة الفقرة الأولى' : "I don't understand the first paragraph",
              isArabic ? 'اشرحي لي بطريقة تانية' : 'Explain differently',
              isArabic ? 'إيه أهم سؤال في الامتحان؟' : 'What is the key exam question?',
              isArabic ? 'معنى الكلمات الصعبة' : 'Hard vocabulary meaning',
            ].map((prompt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setAskInput(prompt);
                }}
                className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 shrink-0 transition-all cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Voice Input & Text Control */}
          <div className="space-y-2">
            <VoiceInputControl
              onTranscriptConfirmed={(text) => {
                setAskInput(text);
              }}
            />

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={askInput}
                onChange={(e) => setAskInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion()}
                placeholder={
                  isArabic
                    ? 'اكتبي سؤالك لمس نور هنا...'
                    : 'Type your question to Miss Nour here...'
                }
                className="flex-1 px-3 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-indigo-500"
              />

              <button
                type="button"
                disabled={!askInput.trim() || isAnswering}
                onClick={handleAskQuestion}
                className="p-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CURRICULUM SUBJECT & LESSON PICKER MODAL */}
      <CurriculumSubjectPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelectLesson={handleSelectLesson}
        initialSubjectId={currentLesson.subjectId}
      />

      {/* STAGE MODAL (THE STAGE LIVE INTERACTIVE EXPERIENCE) */}
      {isFullStageOpen && (
        <StageModal
          lessonId={currentLesson.id}
          onClose={() => setIsFullStageOpen(false)}
        />
      )}

      {/* LESSON STUDY TEXTBOOK MODAL */}
      {isStudyModalOpen && (
        <LessonStudyModal
          lesson={currentLesson}
          onClose={() => setIsStudyModalOpen(false)}
        />
      )}
    </div>
  );
};
