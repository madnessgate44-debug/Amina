/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  StageLessonSequence,
  StageSessionState,
  BeatDefinition,
  NourState,
} from '../../types/stage';
import { stageEngine } from '../../services/stage/stageEngine';
import { voiceService } from '../../services/voice/voiceService';
import { storageService } from '../../services/storage';
import { StageSceneCanvas } from './StageSceneCanvas';
import { NarrationBar } from './NarrationBar';

// Toolkit Interactions
import { TapWordCard } from './interactions/TapWordCard';
import { MatchPairsBoard } from './interactions/MatchPairsBoard';
import { DragDropMat } from './interactions/DragDropMat';
import { TraceCanvas } from './interactions/TraceCanvas';
import { ChoiceCard } from './interactions/ChoiceCard';
import { BuildCanvas } from './interactions/BuildCanvas';
import { VoiceAnswerControl } from './interactions/VoiceAnswerControl';
import { ExplainBackStage } from './interactions/ExplainBackStage';

import {
  X,
  Volume2,
  VolumeX,
  MessageCircle,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  HelpCircle,
  Send,
  Heart,
  Lightbulb,
} from 'lucide-react';

interface StageModalProps {
  lessonId: string;
  onClose: () => void;
  onSessionComplete?: () => void;
}

/**
 * THE STAGE — The Interactive Human-Like Animated Multimodal Tutor Modal
 * (Phase 11 & Sub-Phase 11.2 - 11.9)
 *
 * Implements an interactive private tutor (Nour) who:
 * 1. Speaks aloud with synchronized word-by-word highlights.
 * 2. Actively asks Amina if she understood after each explanation.
 * 3. Fulfils explanations with warm, relatable real-life Egyptian examples when asked.
 * 4. Answers Amina's questions dynamically in friendly conversation.
 * 5. Guides her through touch, calligraphy tracing, concept building, and explain-back.
 */
export const StageModal: React.FC<StageModalProps> = ({
  lessonId,
  onClose,
  onSessionComplete,
}) => {
  const { language, recordEvidence, showToast, student } = useApp();
  const isAr = language === 'ar';
  const studentName = student?.name || (isAr ? 'أمينة' : 'Amina');

  const [sequence] = useState<StageLessonSequence>(() =>
    stageEngine.getSequenceForLesson(lessonId)
  );

  const [sessionState, setSessionState] = useState<StageSessionState>(() =>
    stageEngine.initSession(lessonId)
  );

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasStartedAudio, setHasStartedAudio] = useState(false);

  // Conversational Tutor state
  const [tutorSpokenText, setTutorSpokenText] = useState<string>('');
  const [isAskingClarification, setIsAskingClarification] = useState(false);
  const [showQuestionInput, setShowQuestionInput] = useState(false);
  const [customQuestionInput, setCustomQuestionInput] = useState('');
  const [isAnsweringQuestion, setIsAnsweringQuestion] = useState(false);

  // Chat Drawer Fallback state
  const [showChatFallback, setShowChatFallback] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'nour' | 'child'; text: string }>>([]);

  const currentBeat: BeatDefinition | undefined =
    sequence.beats[sessionState.currentBeatIndex];

  // Helper to speak and update state
  const playTutorSpeech = (text: string) => {
    if (isMuted) return;
    setIsSpeaking(true);
    setHasStartedAudio(true);
    voiceService.unlockAudio();

    voiceService.speak(
      text,
      isAr ? 'ar' : 'en',
      () => setIsSpeaking(true),
      () => setIsSpeaking(false),
      () => setIsSpeaking(false)
    );
  };

  // Sync spoken text when beat changes
  useEffect(() => {
    if (!currentBeat) return;

    let baseText = isAr ? currentBeat.nourTextAr : currentBeat.nourTextEn;
    // Personalize with Amina's name
    baseText = baseText.replace(/أمينة/g, studentName).replace(/Amina/g, studentName);

    setTutorSpokenText(baseText);
    setIsAskingClarification(false);
    setShowQuestionInput(false);

    // If user has already interacted, speak immediately
    if (hasStartedAudio && !isMuted) {
      playTutorSpeech(baseText);
    }

    return () => {
      voiceService.cancelSpeech();
    };
  }, [currentBeat?.id, hasStartedAudio, isMuted, isAr, studentName]);

  const handleNextBeat = async (childSuccess: boolean = true) => {
    voiceService.cancelSpeech();
    setIsSpeaking(false);
    setHasStartedAudio(true);

    const { newState, result } = stageEngine.advanceBeat(sessionState, childSuccess);
    setSessionState(newState);

    // Record invisible mastery evidence
    if (result.masteryEvidence) {
      await recordEvidence(result.masteryEvidence.conceptId, {
        correctness: result.masteryEvidence.correctness,
        difficulty: 0.5,
        independence: result.masteryEvidence.independence,
        modality: result.masteryEvidence.modality,
        notes: `The Stage: Beat ${currentBeat?.type} in ${sequence.lessonTitleAr}`,
      });
    }

    // Save session in IndexedDB
    const studentId = student?.id || 'demo_student';
    await storageService.saveTeachingSession({
      sessionId: `stage_sess_${lessonId}`,
      studentId,
      lessonId,
      subjectId: sequence.subjectId,
      startedAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      currentConceptIndex: newState.currentBeatIndex,
      totalConcepts: sequence.beats.length,
      currentStep: 'teach',
      currentAttemptCount: 0,
      modalityHistory: ['structured_visual'],
      turnHistory: [],
      explainBackDone: Object.values(newState.explainBackPassed).some(Boolean),
      offBookQuestions: newState.offBookQuestions.map((q) => ({
        question: q,
        timestamp: new Date().toISOString(),
        parentNote: `سؤال استكشافي من المسرح التفاعلي: "${q}"`,
      })),
      status: result.isLessonCompleted ? 'completed' : 'in_progress',
    });

    if (result.isLessonCompleted) {
      showToast(
        isAr
          ? `🎉 مبارك يا ${studentName}! أتممتِ جلسة المسرح التفاعلي لدرس «${sequence.lessonTitleAr}» بنجاح باهر!`
          : `🎉 Congratulations ${studentName}! You completed The Stage for "${sequence.lessonTitleEn}"!`
      );
      onSessionComplete?.();
    }
  };

  // Conversational Action: When Amina says "مش فاهماها أوي.. وضحيلي بمثال"
  const handleExplainWithAnalogy = () => {
    setHasStartedAudio(true);
    setIsAskingClarification(true);
    setSessionState((prev) => ({ ...prev, nourCurrentState: 'encouraging' }));

    const analogyText = isAr
      ? `ولا يهمك خالص يا ${studentName} يا حبيبتي! تعالي نتخيلها بمثال من بيتنا: لو المية اتقطعت عن البيت يوم كامل في الصيف.. لا هنعرف نشرب، ولا ماما هتعرف تطبخ، والزرع هيموت! عشان كده أجدادنا الفراعنة كانوا بيعتبروا النيل مش مجرد نهر عادي، ده سر الحياة، وكانوا بيقسموا إنهم ميوسخوهوش أبداً بإلقاء القمامة. ها، كده الرؤية وضحت في دماغك؟`
      : `Don't worry at all, ${studentName}! Picture this: if water was shut off at home for an entire day, we couldn't drink, cook, or water plants! That's why ancient Egyptians swore to never pollute the Nile. Does that make sense now?`;

    setTutorSpokenText(analogyText);
    playTutorSpeech(analogyText);
  };

  // Conversational Action: When Amina asks "يعني إيه الكلمة دي؟"
  const handleExplainWordMeaning = () => {
    setHasStartedAudio(true);
    setIsAskingClarification(true);
    setSessionState((prev) => ({ ...prev, nourCurrentState: 'talking' }));

    const meaningText = isAr
      ? `بصي يا ${studentName}: كلمة «لم أوتِ» معناها في اللغة المصرية القديمة: لم أدنّس، ولم ألوّث، ولم أفسد طهارة ماء النهر أبداً بإلقاء المخلفات. كلمة قوية جداً بتدل على احترامهم العظيم للنيل!`
      : `Look ${studentName}: "لم أوت" means: I have never defiled, polluted, or spoiled the purity of the river water with waste. It shows deep respect for the Nile!`;

    setTutorSpokenText(meaningText);
    playTutorSpeech(meaningText);
  };

  // Conversational Action: When Amina asks an open question
  const handleSendCustomQuery = async () => {
    const query = customQuestionInput.trim();
    if (!query) return;

    setHasStartedAudio(true);
    setIsAnsweringQuestion(true);
    setCustomQuestionInput('');
    setSessionState((prev) => ({ ...prev, nourCurrentState: 'thinking' }));

    try {
      const resp = await fetch('/api/tutor-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentInput: query,
          currentBeatText: tutorSpokenText,
          language: isAr ? 'ar' : 'en',
        }),
      });

      const data = await resp.json();
      const reply = data.reply || (isAr ? `أنا معاكي يا ${studentName}، وضحت ليكي الفكرة؟` : `I'm with you ${studentName}!`);

      setSessionState((prev) => ({ ...prev, nourCurrentState: 'talking' }));
      setTutorSpokenText(reply);
      playTutorSpeech(reply);
      setIsAskingClarification(true);
    } catch (e) {
      console.warn('tutor-reply error:', e);
    } finally {
      setIsAnsweringQuestion(false);
      setShowQuestionInput(false);
    }
  };

  const handleReplayVoice = () => {
    if (!tutorSpokenText) return;
    playTutorSpeech(tutorSpokenText);
  };

  const handleToggleMute = () => {
    if (!isMuted) {
      voiceService.cancelSpeech();
      setIsSpeaking(false);
    }
    setIsMuted(!isMuted);
  };

  // Fallback Chat Handler (routes off-book questions safely)
  const handleSendFallbackChat = (e: React.FormEvent) => {
    e.preventDefault();
    const query = chatInput.trim();
    if (!query) return;

    setChatMessages((prev) => [...prev, { role: 'child', text: query }]);
    setChatInput('');

    const lower = query.toLowerCase();
    const isOffBook =
      lower.includes('فضاء') ||
      lower.includes('ديناصور') ||
      lower.includes('كورة') ||
      lower.includes('space');

    if (isOffBook) {
      setSessionState((prev) => ({
        ...prev,
        offBookQuestions: [...prev.offBookQuestions, query],
      }));
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'nour',
          text: isAr
            ? `سؤال ذكي وفضولي جداً يا ${studentName}! لكنه خارج كتابنا لدرس اليوم (${sequence.sourceRefText}). دعيني أركز معكِ على الدرس وسجلت سؤالكِ الجميل لمناقشته مع والديك!`
            : `That’s a brilliant curious question ${studentName}! It’s not in our textbook lesson today though. Let’s focus on your lesson, and I saved your great question for family talk!`,
        },
      ]);
    } else {
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'nour',
          text: isAr
            ? `أنا معاكي يا ${studentName}! نحن ندرس معاً درس «${sequence.lessonTitleAr}» من صفحة ${currentBeat?.sourcePage || 12}. دعينا نركز في هذه الخطوة الجميلة!`
            : `I'm with you, ${studentName}! We are learning "${sequence.lessonTitleEn}" from page ${currentBeat?.sourcePage || 12}. Let's continue on the stage!`,
        },
      ]);
    }
  };

  // Render context-sensitive interaction component for the bottom 25%
  const renderInteractionZone = () => {
    if (!currentBeat) return null;

    switch (currentBeat.type) {
      case 'scene_open':
      case 'character_speak':
        return (
          <div className="w-full h-full flex flex-col justify-center p-2.5 max-w-lg mx-auto space-y-2 animate-in fade-in duration-200">
            {/* Real Human-Like Tutor Check-In */}
            <div className="flex items-center justify-between text-xs font-bold bg-amber-50 dark:bg-slate-800/80 p-2 rounded-xl border border-amber-200 dark:border-slate-700">
              <span className="flex items-center gap-1.5 text-amber-950 dark:text-amber-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>
                  {isAr
                    ? `يا ${studentName}، هل النقطة دي واضحة ليكي ولا تحبي أوضحهالك أكتر؟`
                    : `${studentName}, does this make sense or would you like another example?`}
                </span>
              </span>

              <button
                type="button"
                onClick={() => setShowQuestionInput(!showQuestionInput)}
                className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1 shrink-0 ml-1"
              >
                <HelpCircle className="w-3 h-3" />
                <span>{isAr ? 'اسألي نور' : 'Ask Nour'}</span>
              </button>
            </div>

            {/* Conversational Action Options */}
            {!isAskingClarification && !showQuestionInput ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleNextBeat(true)}
                  className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-between hover:scale-101 cursor-pointer"
                >
                  <span>{isAr ? 'فهمت كويس يا نور! كملي 👍' : 'Understood, continue! 👍'}</span>
                  {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={handleExplainWithAnalogy}
                  className="p-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-700 text-amber-950 dark:text-amber-100 font-bold text-xs transition-all flex items-center justify-between hover:scale-101 cursor-pointer"
                >
                  <span>{isAr ? 'مش فاهماها أوي.. بمثال 🤔' : 'Explain with example 🤔'}</span>
                  <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={handleExplainWordMeaning}
                  className="p-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200 font-bold text-xs transition-all flex items-center justify-between hover:scale-101 cursor-pointer"
                >
                  <span>{isAr ? 'يعني إيه الكلمة دي؟ ❓' : 'Word meaning? ❓'}</span>
                  <HelpCircle className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                </button>
              </div>
            ) : isAskingClarification ? (
              <div className="space-y-1.5 animate-in zoom-in-95 duration-200">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAskingClarification(false);
                      handleNextBeat(true);
                    }}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>{isAr ? 'أيوة كده فهمت جداً يا نور! 🌟 يلا نكمل' : 'Now I understand! Let’s continue 🌟'}</span>
                    {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowQuestionInput(true)}
                    className="py-2.5 px-3 rounded-xl bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-100 font-bold text-xs cursor-pointer"
                  >
                    {isAr ? 'عندي سؤال تاني' : 'Another question'}
                  </button>
                </div>
              </div>
            ) : (
              /* Custom Question to Nour */
              <div className="flex items-center gap-2 animate-in slide-in-from-bottom-2 duration-200">
                <input
                  type="text"
                  value={customQuestionInput}
                  onChange={(e) => setCustomQuestionInput(e.target.value)}
                  placeholder={isAr ? 'اسألي نور: يعني إيه...؟ أو ليه كانوا...؟' : 'Ask Nour anything about the lesson...'}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendCustomQuery();
                  }}
                />
                <button
                  type="button"
                  disabled={!customQuestionInput.trim() || isAnsweringQuestion}
                  onClick={handleSendCustomQuery}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs shadow-xs flex items-center gap-1 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 rtl:rotate-180" />
                  <span>{isAr ? 'اسألي' : 'Ask'}</span>
                </button>
              </div>
            )}
          </div>
        );

      case 'child_tap_word':
        return (
          <TapWordCard
            word={currentBeat.interactionPayload?.word || 'لَمْ أُوَتِّ'}
            definition={currentBeat.interactionPayload?.definition || ''}
            exampleSentence={currentBeat.interactionPayload?.exampleSentence}
            sourceRefText={sequence.sourceRefText}
            onTappedWord={() => {
              setHasStartedAudio(true);
              setTimeout(() => handleNextBeat(true), 1200);
            }}
            language={language}
          />
        );

      case 'child_match_pairs':
        return (
          <MatchPairsBoard
            pairs={currentBeat.interactionPayload?.pairs || []}
            onAllMatched={() => {
              setHasStartedAudio(true);
              handleNextBeat(true);
            }}
            language={language}
          />
        );

      case 'child_drag_drop':
        return (
          <DragDropMat
            zones={currentBeat.interactionPayload?.zones || []}
            items={currentBeat.interactionPayload?.items || []}
            onComplete={() => {
              setHasStartedAudio(true);
              handleNextBeat(true);
            }}
            language={language}
          />
        );

      case 'child_trace':
        return (
          <TraceCanvas
            letterPrompt={currentBeat.interactionPayload?.letterPrompt || 'أ'}
            instructionAr={currentBeat.interactionPayload?.instructionAr || 'تتبعي الحرف:'}
            instructionEn={currentBeat.interactionPayload?.instructionEn || 'Trace letter:'}
            onTraceComplete={() => {
              setHasStartedAudio(true);
              handleNextBeat(true);
            }}
            language={language}
          />
        );

      case 'child_choose_answer':
        return (
          <ChoiceCard
            questionText={currentBeat.interactionPayload?.questionText}
            options={currentBeat.interactionPayload?.options || []}
            onAnswerSelected={(isCorrect) => {
              setHasStartedAudio(true);
              handleNextBeat(isCorrect);
            }}
            language={language}
          />
        );

      case 'child_build':
        return (
          <BuildCanvas
            centerConcept={currentBeat.interactionPayload?.centerConcept || 'نهر النيل'}
            nodes={currentBeat.interactionPayload?.nodes || []}
            onBuildComplete={() => {
              setHasStartedAudio(true);
              handleNextBeat(true);
            }}
            language={language}
          />
        );

      case 'child_speak_answer':
        return (
          <VoiceAnswerControl
            promptText={isAr ? currentBeat.nourTextAr : currentBeat.nourTextEn}
            onAnswerSubmit={(text) => {
              setHasStartedAudio(true);
              handleNextBeat(true);
            }}
            language={language}
          />
        );

      case 'explain_back':
        return (
          <ExplainBackStage
            conceptTitle={
              currentBeat.interactionPayload?.conceptTitle ||
              (isAr ? 'قسم حماية النيل' : 'Nile Protection Oath')
            }
            onExplainSubmitted={(explanation) => {
              setHasStartedAudio(true);
              handleNextBeat(true);
            }}
            language={language}
          />
        );

      case 'child_tap_object':
      default:
        return (
          <div className="w-full h-full flex flex-col justify-center p-3 max-w-sm mx-auto space-y-2 animate-in fade-in duration-200">
            <button
              type="button"
              onClick={() => handleNextBeat(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-xs transition-all flex items-center justify-between cursor-pointer"
            >
              <span>{isAr ? 'فهمت الفكرة يا نور، لنكمل!' : 'Understood Nour, let’s continue!'}</span>
              {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-0 sm:p-3 overflow-hidden select-none"
      dir={isAr ? 'rtl' : 'ltr'}
      onClick={() => {
        // Unlock browser audio context on any modal click
        if (!hasStartedAudio) {
          setHasStartedAudio(true);
          playTutorSpeech(tutorSpokenText);
        }
      }}
    >
      <div className="relative w-full max-w-xl h-full sm:h-[94vh] sm:max-h-[860px] bg-slate-900 border border-slate-700/80 rounded-none sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* TOP HEADER: TITLE, PROGRESS DOTS, VOICE CONTROLS & CHAT FALLBACK */}
        <div className="px-3 py-2 bg-slate-900/90 text-white border-b border-slate-800 flex items-center justify-between shrink-0 z-30">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h3 className="text-xs font-black tracking-tight flex items-center gap-1.5">
                <span>{isAr ? sequence.lessonTitleAr : sequence.lessonTitleEn}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 font-bold">
                  {isAr ? `مع نور لـ ${studentName}` : `With Nour for ${studentName}`}
                </span>
              </h3>
              <p className="text-[10px] text-slate-400 font-medium">
                {sequence.sourceRefText}
              </p>
            </div>
          </div>

          {/* Center Beat Progress Dots */}
          <div className="hidden sm:flex items-center gap-1">
            {sequence.beats.map((b, i) => (
              <span
                key={b.id}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === sessionState.currentBeatIndex
                    ? 'w-5 bg-amber-400'
                    : i < sessionState.currentBeatIndex
                    ? 'w-2 bg-emerald-400'
                    : 'w-1.5 bg-slate-700'
                }`}
              />
            ))}
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-1">
            {/* Talk to Nour (Fallback Chat Drawer Trigger) */}
            <button
              type="button"
              onClick={() => setShowChatFallback(!showChatFallback)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title={isAr ? 'محادثة مفتوحة مع نور' : 'Talk to Nour'}
              aria-label={isAr ? 'محادثة مفتوحة مع نور' : 'Talk to Nour'}
            >
              <MessageCircle className="w-4 h-4" />
            </button>

            {/* Mute Toggle */}
            <button
              type="button"
              onClick={handleToggleMute}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isMuted ? 'text-rose-400 bg-rose-950/40' : 'text-slate-400 hover:text-white'
              }`}
              title={isMuted ? (isAr ? 'تشغيل الصوت' : 'Unmute') : isAr ? 'كتم الصوت' : 'Mute'}
              aria-label={isMuted ? (isAr ? 'تشغيل الصوت' : 'Unmute') : isAr ? 'كتم الصوت' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title={isAr ? 'إغلاق' : 'Close'}
              aria-label={isAr ? 'إغلاق' : 'Close'}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Browser Audio Unlock Reminder Banner */}
        {!hasStartedAudio && !isMuted && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              setHasStartedAudio(true);
              playTutorSpeech(tutorSpokenText);
            }}
            className="w-full bg-linear-to-r from-amber-500 via-amber-400 to-yellow-400 text-slate-950 font-black text-xs py-1.5 px-3 flex items-center justify-center gap-2 cursor-pointer shadow-md animate-pulse z-40"
          >
            <Volume2 className="w-4 h-4 animate-bounce" />
            <span>{isAr ? 'اضغطي هنا لتشغيل صوت نور التفاعلي 🔊' : 'Tap here to enable Nour’s voice 🔊'}</span>
          </div>
        )}

        {/* 1. TOP 55%: SCENE CANVAS */}
        <div className="h-[55%] w-full relative shrink-0">
          <StageSceneCanvas
            nourState={sessionState.nourCurrentState}
            outfit={sequence.outfit}
            isNourSpeaking={isSpeaking}
            clipId={currentBeat?.scenePayload?.clipId}
            interactiveObjects={currentBeat?.scenePayload?.interactiveObjects}
            onObjectTap={(obj) => {
              const text = isAr ? obj.descriptionAr : obj.descriptionEn;
              setTutorSpokenText(text);
              playTutorSpeech(text);
            }}
            language={language}
            onNourTap={handleReplayVoice}
          />
        </div>

        {/* 2. MIDDLE 20%: NARRATION BAR */}
        <div className="h-[20%] w-full shrink-0 flex flex-col justify-center">
          <NarrationBar
            spokenText={tutorSpokenText}
            isSpeaking={isSpeaking}
            isMuted={isMuted}
            sourceRefText={`ص. ${currentBeat?.sourcePage || 12}`}
            language={language}
            onReplayAudio={handleReplayVoice}
            onToggleMute={handleToggleMute}
          />
        </div>

        {/* 3. BOTTOM 25%: INTERACTION BAR */}
        <div className="h-[25%] w-full bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 shrink-0 overflow-y-auto">
          {renderInteractionZone()}
        </div>

        {/* FALLBACK CHAT DRAWER ("Talk to Nour" - Sub-Phase 11.7) */}
        {showChatFallback && (
          <div className="absolute inset-x-0 bottom-0 h-[65%] z-40 bg-white dark:bg-slate-900 border-t-2 border-indigo-500 rounded-t-3xl shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-300">
            <div className="p-3 bg-indigo-50 dark:bg-slate-800 border-b border-indigo-100 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {isAr ? `محادثة مفتوحة مع نور يا ${studentName}` : `Talk to Nour, ${studentName}`}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowChatFallback(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat History */}
            <div className="flex-1 p-3 overflow-y-auto space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 leading-relaxed">
                {isAr
                  ? `أهلاً يا ${studentName}! أنا رفيقتكِ ومعلمتكِ نور. لو فيه أي سؤال في درس «${sequence.lessonTitleAr}» مش فاهماه أو سؤال يدور في ذهنكِ، احكيلي براحتك خالص!`
                  : `Hi ${studentName}! I’m Nour. If anything in "${sequence.lessonTitleEn}" isn't clear or you have any curious thought, ask me freely!`}
              </div>

              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'child' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-2.5 rounded-2xl ${
                      msg.role === 'child'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendFallbackChat} className="p-2 border-t border-slate-200 dark:border-slate-800 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={isAr ? 'اسألي نور أي سؤال...' : 'Ask Nour anything...'}
                className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                {isAr ? 'إرسال' : 'Send'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
