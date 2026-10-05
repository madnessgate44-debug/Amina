/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { OfficialCurriculumLesson } from '../../types/teachingSession';
import { useApp } from '../../context/AppContext';
import { TaskInstructionSpeaker } from '../voice/TaskInstructionSpeaker';
import { tutorSpeechService, EncouragementType } from '../../services/voice/tutorSpeechService';
import { soundEffects } from '../../services/sound/soundEffects';
import { StageModal } from '../stage/StageModal';
import {
  X,
  BookOpen,
  HelpCircle,
  Sparkles,
  Volume2,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Award,
  Layers,
  FileText,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

interface LessonStudyModalProps {
  lesson: OfficialCurriculumLesson;
  onClose: () => void;
}

export const LessonStudyModal: React.FC<LessonStudyModalProps> = ({ lesson, onClose }) => {
  const { language, student } = useApp();
  const isAr = language === 'ar';
  const studentName = student?.name || (isAr ? 'أمينة' : 'Amina');

  const [activeTab, setActiveTab] = useState<'explanation' | 'vocab' | 'exercises'>('explanation');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [exerciseFeedback, setExerciseFeedback] = useState<Record<number, { isCorrect: boolean; message: string }>>({});
  const [encouragingFeedback, setEncouragingFeedback] = useState<{
    type: EncouragementType;
    customNote?: string;
  } | null>(null);

  const [isFullStageOpen, setIsFullStageOpen] = useState(false);

  // Announce lesson entrance on mount
  useEffect(() => {
    const welcomeText = isAr
      ? `أهلاً يا ${studentName}! فتحنا درس: «${lesson.titleAr}» من ${lesson.sourceRef.bookAr}. أنا جاهزة أشرحلك كل فكرة ونحل التمارين سوا!`
      : `Welcome ${studentName}! We opened the lesson: "${lesson.titleEn}" from ${lesson.sourceRef.bookEn}. Ready to explore together!`;

    tutorSpeechService.speakEncouragingFeedback('welcome', studentName, welcomeText, {
      language,
    });
  }, [lesson, studentName, language, isAr]);

  const handleSelectOption = (exerciseIdx: number, optionIdx: number, expectedAnswer?: string, options?: string[]) => {
    if (selectedAnswers[exerciseIdx] !== undefined) return; // already answered

    soundEffects.playPop();
    setSelectedAnswers((prev) => ({ ...prev, [exerciseIdx]: optionIdx }));

    const chosenOption = options ? options[optionIdx] : '';
    const isCorrect = chosenOption === expectedAnswer;

    if (isCorrect) {
      soundEffects.playSuccess();
      soundEffects.playStarEarned();
      const praiseNote = isAr
        ? `إجابة عبقرية يا ${studentName}! «${chosenOption}» هي الإجابة الصحيحة تماماً.`
        : `Brilliant, ${studentName}! "${chosenOption}" is the correct answer.`;

      setExerciseFeedback((prev) => ({
        ...prev,
        [exerciseIdx]: { isCorrect: true, message: praiseNote },
      }));

      setEncouragingFeedback({
        type: 'correct',
        customNote: praiseNote,
      });
    } else {
      soundEffects.playBounce();
      const encouragementNote = isAr
        ? `محاولة كويسة يا ${studentName}! الإجابة الصحيحة من كتاب الوزارة هي: «${expectedAnswer}». ركزي في النقطة دي يا بطلة!`
        : `Good try, ${studentName}! The correct answer from the textbook is: "${expectedAnswer}".`;

      setExerciseFeedback((prev) => ({
        ...prev,
        [exerciseIdx]: { isCorrect: false, message: encouragementNote },
      }));

      setEncouragingFeedback({
        type: 'almost',
        customNote: encouragementNote,
      });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 select-none animate-in fade-in duration-200"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Top Header */}
        <div className="bg-linear-to-r from-indigo-700 via-indigo-600 to-purple-700 text-white p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-xl shadow-xs">
              📚
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-300 flex items-center gap-1">
                <span>{lesson.subjectNameAr}</span>
                <span>•</span>
                <span>{lesson.sourceRef.bookAr}</span>
              </span>
              <h2 className="text-sm sm:text-base font-black leading-tight text-white">
                {isAr ? lesson.titleAr : lesson.titleEn}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                soundEffects.playPop();
                setIsFullStageOpen(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-xs transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
              title={isAr ? 'افتح المسرح التفاعلي' : 'Open Stage'}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">{isAr ? 'المسرح التفاعلي' : 'The Stage'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title={isAr ? 'إغلاق' : 'Close'}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Audio Task Instruction Speaker */}
        <div className="p-3 bg-indigo-50/70 dark:bg-slate-800/60 border-b border-indigo-100 dark:border-slate-800 shrink-0">
          <TaskInstructionSpeaker
            instructionText={
              activeTab === 'explanation'
                ? isAr
                  ? `يا ${studentName}، اقرأي نص الدرس واستمعي لشرح كل فكرة رئيسية مع أمثلة من حياتنا اليومية.`
                  : `${studentName}, read the lesson text and explore concepts with real-world examples.`
                : activeTab === 'vocab'
                ? isAr
                  ? `اضغطي على أي كلمة تاريخية أو مصطلح علمي لتستمعي لنطقه وشرح معناه بصوت المعلمة نور.`
                  : `Tap any vocabulary word to hear Miss Nour pronounce and explain its definition.`
                : isAr
                ? `والآن مع التحدي والتمارين التفاعلية من كتاب الوزارة! اختاري الإجابة الصحيحة واستمعي للتشجيع!`
                : `Now for textbook exercises! Select the correct answer and listen to feedback.`
            }
            studentName={studentName}
            language={language}
            encouragingFeedback={encouragingFeedback}
          />
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-800/80 shrink-0 p-1 gap-1">
          <button
            type="button"
            onClick={() => {
              soundEffects.playPop();
              setActiveTab('explanation');
              setEncouragingFeedback(null);
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'explanation'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{isAr ? 'الشرح والمفاهيم' : 'Explanation'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEffects.playPop();
              setActiveTab('vocab');
              setEncouragingFeedback(null);
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'vocab'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isAr ? `المفردات (${lesson.vocabulary.length})` : `Vocab (${lesson.vocabulary.length})`}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEffects.playPop();
              setActiveTab('exercises');
              setEncouragingFeedback(null);
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'exercises'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span>{isAr ? `التمارين (${lesson.exercises.length})` : `Exercises (${lesson.exercises.length})`}</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* TAB 1: EXPLANATION & CONCEPTS */}
          {activeTab === 'explanation' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Learning Objectives Box */}
              <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 space-y-1.5">
                <h4 className="text-xs font-black text-amber-950 dark:text-amber-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>{isAr ? 'نواتج وأهداف التعلم في هذا الدرس:' : 'Learning Objectives:'}</span>
                </h4>
                <ul className="space-y-1 pr-4 rtl:pr-4 ltr:pl-4 list-disc text-xs text-slate-700 dark:text-slate-300 font-medium">
                  {lesson.objectives.map((obj, i) => (
                    <li key={i}>{obj}</li>
                  ))}
                </ul>
              </div>

              {/* Official Textbook Reading Text */}
              {lesson.readingText && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-indigo-700 dark:text-indigo-300 flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" />
                      <span>{isAr ? 'نص الدرس من كتاب الوزارة:' : 'Textbook Reading Content:'}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        soundEffects.playPop();
                        tutorSpeechService.speakTaskInstruction(lesson.readingText || '', studentName, { language });
                      }}
                      className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{isAr ? 'استمعي للنص كاملاً' : 'Read Aloud'}</span>
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-100 leading-relaxed font-medium whitespace-pre-line">
                    {lesson.readingText}
                  </p>
                </div>
              )}

              {/* Lesson In-Depth Concepts Breakdown */}
              {lesson.concepts.map((concept) => (
                <div
                  key={concept.id}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300 flex items-center justify-center text-xs font-bold">
                        {concept.conceptNumber}
                      </span>
                      <span>{isAr ? concept.titleAr : concept.titleEn}</span>
                    </h4>

                    <button
                      type="button"
                      onClick={() => {
                        soundEffects.playPop();
                        const text = isAr
                          ? `${concept.titleAr}. ${concept.sourceText}. مثال من حياتنا: ${concept.dailyLifeExampleAr}`
                          : `${concept.titleEn}. ${concept.sourceText}`;
                        tutorSpeechService.speakTaskInstruction(text, studentName, { language });
                      }}
                      className="p-1.5 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-700 cursor-pointer"
                      title={isAr ? 'استمع للشرح' : 'Listen'}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {concept.sourceText}
                  </p>

                  {/* Key Points */}
                  <div className="space-y-1 bg-slate-50 dark:bg-slate-700/40 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700">
                    <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 block">
                      {isAr ? 'نقاط الفهم الأساسية:' : 'Key Learning Points:'}
                    </span>
                    <ul className="list-disc pr-4 rtl:pr-4 ltr:pl-4 space-y-0.5 text-[11px] text-slate-600 dark:text-slate-300">
                      {concept.keyPoints.map((pt, i) => (
                        <li key={i}>{pt}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Daily Life Example & Story Analogy */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    {concept.dailyLifeExampleAr && (
                      <div className="p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200">
                        <span className="font-black block mb-0.5">🌱 {isAr ? 'من حياتنا اليومية:' : 'Daily Life:'}</span>
                        <span>{isAr ? concept.dailyLifeExampleAr : concept.dailyLifeExampleEn}</span>
                      </div>
                    )}
                    {concept.storyAnalogyAr && (
                      <div className="p-2.5 rounded-xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 text-purple-950 dark:text-purple-200">
                        <span className="font-black block mb-0.5">💡 {isAr ? 'تشبيه لتبسيط الفكرة:' : 'Story Analogy:'}</span>
                        <span>{isAr ? concept.storyAnalogyAr : concept.storyAnalogyEn}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: VOCABULARY BANK */}
          {activeTab === 'vocab' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {isAr
                  ? 'هذه هي المفردات والمصطلحات الأساسية الواردة في كتاب الوزارة لهذا الدرس. اضغطي على أي بطاقة لتستمعي لنطقها وشرحها:'
                  : 'Key textbook terminology. Tap any card to hear pronunciation and meaning:'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {lesson.vocabulary.map((v, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      soundEffects.playPop();
                      const spoken = isAr
                        ? `مصطلح: «${v.word}»، معناه: ${v.definition}. ${v.example ? `مثال: ${v.example}` : ''}`
                        : `Word: ${v.word}. Definition: ${v.definition}`;
                      tutorSpeechService.speakTaskInstruction(spoken, studentName, { language });
                    }}
                    className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 shadow-2xs hover:shadow-sm transition-all cursor-pointer space-y-1.5 hover:scale-[1.01]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-black text-indigo-600 dark:text-indigo-400">
                        {v.word}
                      </span>
                      <Volume2 className="w-4 h-4 text-indigo-500" />
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                      {v.definition}
                    </p>
                    {v.example && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                        {isAr ? `مثال: «${v.example}»` : `Example: "${v.example}"`}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: INTERACTIVE EXERCISES */}
          {activeTab === 'exercises' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {isAr
                  ? 'تمارين وتدريبات مطابقة تماماً لأسئلة كتاب الوزارة. كل إجابة صحيحة تمنحك نجماً وتشجيعاً من المعلمة نور!'
                  : 'Interactive exercises directly from the Ministry textbook. Answer each question to receive audio feedback!'}
              </p>

              {lesson.exercises.map((ex, exIdx) => {
                const answered = selectedAnswers[exIdx] !== undefined;
                const feedback = exerciseFeedback[exIdx];

                return (
                  <div
                    key={exIdx}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-black text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5" />
                        <span>{isAr ? `تمرين ${exIdx + 1}` : `Exercise ${exIdx + 1}`}</span>
                        {ex.page && <span>(ص. {ex.page})</span>}
                      </span>
                      {answered && feedback?.isCorrect && (
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{isAr ? 'تم الحل بنجاح ⭐' : 'Solved ⭐'}</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 leading-relaxed flex-1">
                        {ex.question}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          soundEffects.playPop();
                          tutorSpeechService.speakTaskInstruction(ex.question, studentName, { language });
                        }}
                        className="p-1.5 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-700 cursor-pointer shrink-0"
                        title={isAr ? 'استمع للسؤال' : 'Read Question'}
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Options if multiple choice */}
                    {ex.options && (
                      <div className="space-y-1.5">
                        {ex.options.map((opt, optIdx) => {
                          const isSelected = selectedAnswers[exIdx] === optIdx;
                          const isCorrect = opt === ex.expectedAnswer;

                          return (
                            <button
                              key={optIdx}
                              type="button"
                              disabled={answered}
                              onClick={() => handleSelectOption(exIdx, optIdx, ex.expectedAnswer, ex.options)}
                              className={`w-full p-2.5 px-3 rounded-xl border text-xs font-bold text-right rtl:text-right ltr:text-left transition-all flex items-center justify-between cursor-pointer ${
                                !answered
                                  ? 'bg-slate-50 dark:bg-slate-700/60 border-slate-200 dark:border-slate-600 hover:bg-indigo-50 hover:border-indigo-300'
                                  : isCorrect
                                  ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm'
                                  : isSelected
                                  ? 'bg-rose-500 text-white border-rose-600'
                                  : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-50'
                              }`}
                            >
                              <span>{opt}</span>
                              {answered && isCorrect && <CheckCircle2 className="w-4 h-4 text-white" />}
                              {answered && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-white" />}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Feedback Note if answered */}
                    {feedback && (
                      <div
                        className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between gap-2 animate-in zoom-in-95 duration-200 ${
                          feedback.isCorrect
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-950 dark:text-emerald-200'
                            : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 text-amber-950 dark:text-amber-200'
                        }`}
                      >
                        <span>{feedback.message}</span>
                        <button
                          type="button"
                          onClick={() => {
                            soundEffects.playPop();
                            tutorSpeechService.speakEncouragingFeedback(
                              feedback.isCorrect ? 'correct' : 'almost',
                              studentName,
                              feedback.message,
                              { language }
                            );
                          }}
                          className="p-1 rounded-lg text-current hover:opacity-80"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom Footer Actions */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">
            📖 {lesson.sourceRef.bookAr}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                soundEffects.playPop();
                setIsFullStageOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-linear-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isAr ? 'ادخلي المسرح مع مس نور 🎬' : 'Enter Stage 🎬'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-bold text-xs cursor-pointer"
            >
              {isAr ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </div>
      </div>

      {/* Embedded Full Stage Modal */}
      {isFullStageOpen && (
        <StageModal
          lessonId={lesson.id}
          onClose={() => setIsFullStageOpen(false)}
        />
      )}
    </div>
  );
};
