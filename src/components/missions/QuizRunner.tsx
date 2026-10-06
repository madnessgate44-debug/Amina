/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Mission } from '../../types';
import { getQuizQuestionsForConcept, QuizQuestion } from '../../services/content/contentGenerator';
import { Badge } from '../common/Badge';
import {
  CheckCircle,
  XCircle,
  HelpCircle,
  Lightbulb,
  ArrowRight,
  ArrowLeft,
  X,
  Sparkles,
  TrendingUp,
  Award,
  RotateCcw,
} from 'lucide-react';

interface QuizRunnerProps {
  mission: Mission;
  onComplete: (score: number) => void;
  onSkip: () => void;
  onExplainDifferently?: () => void;
}

export const QuizRunner: React.FC<QuizRunnerProps> = ({
  mission,
  onComplete,
  onSkip,
  onExplainDifferently,
}) => {
  const { language, masteryRecords, recordEvidence, setCompanionContext, setActiveTab } = useApp();
  const isAr = language === 'ar';

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [scoreCount, setScoreCount] = useState(0);
  const [adaptiveDifficulty, setAdaptiveDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [hasRetriedCurrent, setHasRetriedCurrent] = useState(false);

  const currentMastery = mission.conceptId ? masteryRecords[mission.conceptId]?.score ?? 0.5 : 0.5;

  useEffect(() => {
    if (mission.conceptId) {
      const qs = getQuizQuestionsForConcept(mission.conceptId, currentMastery);
      setQuestions(qs);
    }
  }, [mission.conceptId, currentMastery]);

  const currentQ = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  if (!currentQ) {
    return (
      <div className="p-6 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-slate-800 dark:text-slate-100">
          {isAr ? 'الأسئلة غير متوفرة لهذا المفهوم' : 'Questions not yet available'}
        </h3>
        <p className="text-xs text-slate-500 max-w-xs mx-auto">
          {isAr
            ? 'النظام يعتمد فقط على مفاهيم المنهج التجريبي المسجلة دون أي اختلاق.'
            : 'The engine relies solely on registered demo concepts without fabricating.'}
        </p>
        <button
          onClick={onSkip}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
        >
          {isAr ? 'تخطي المهمة' : 'Skip Mission'}
        </button>
      </div>
    );
  }

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedAnswer(index);
    setIsAnswered(true);

    const isCorrect = index === currentQ.correctAnswer;
    if (isCorrect) {
      setScoreCount((prev) => prev + (hasRetriedCurrent ? 0.75 : 1));
      setAdaptiveDifficulty('hard');
      if (mission.conceptId) {
        recordEvidence(mission.conceptId, {
          correctness: 'full',
          difficulty: adaptiveDifficulty === 'hard' ? 0.8 : 0.5,
          independence: showHint || hasRetriedCurrent ? 'hinted' : 'unassisted',
          modality: 'quiz',
          notes: hasRetriedCurrent ? 'Quiz answered correctly after adaptive explanation' : 'Quiz question answered correctly',
        });
      }
    } else {
      setAdaptiveDifficulty('easy');
      if (mission.conceptId) {
        recordEvidence(mission.conceptId, {
          correctness: 'partial',
          difficulty: 0.4,
          independence: 'unassisted',
          modality: 'quiz',
          notes: 'Quiz struggle - adaptive scaffold presented',
        });
      }
    }
  };

  const handleRetryWithScaffolding = () => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    setShowHint(true);
    setHasRetriedCurrent(true);
  };

  const handleLaunchDeepExplanation = () => {
    if (mission.conceptId) {
      setCompanionContext({
        source: 'weakness',
        conceptId: mission.conceptId,
        lessonId: mission.lessonId,
        topic: mission.title,
        notes: isAr ? currentQ.hintAr : currentQ.hintEn,
      });
    }
    if (onExplainDifferently) {
      onExplainDifferently();
    } else {
      setActiveTab('companion');
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      const finalScore = totalQuestions > 0 ? scoreCount / totalQuestions : 0.8;
      onComplete(finalScore);
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setShowHint(false);
      setHasRetriedCurrent(false);
    }
  };

  const isCurrentCorrect = selectedAnswer === currentQ.correctAnswer;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
      {/* Top Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
        <div className="flex items-center gap-2">
          <Badge variant="official">
            {isAr ? `السؤال ${currentQuestionIndex + 1} من ${totalQuestions}` : `Question ${currentQuestionIndex + 1} of ${totalQuestions}`}
          </Badge>
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
            {mission.subject}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
            <span>
              {isAr ? 'الصعوبة المتكيفة:' : 'Adaptive:'}{' '}
              {adaptiveDifficulty === 'hard'
                ? isAr ? 'متقدمة' : 'Advanced'
                : adaptiveDifficulty === 'easy'
                ? isAr ? 'مبسطة' : 'Foundational'
                : isAr ? 'متوسطة' : 'Balanced'}
            </span>
          </div>
          <button
            onClick={onSkip}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            title={isAr ? 'تخطي أو إغلاق' : 'Skip or close'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Question Prompt Area */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4">
        <div>
          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
            {currentQ.type === 'true_false'
              ? isAr ? 'صح أم خطأ' : 'True or False'
              : isAr ? 'اختيار من متعدد' : 'Multiple Choice'}
          </span>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug">
            {isAr ? currentQ.promptAr : currentQ.promptEn}
          </h2>
        </div>

        {/* Options List */}
        <div className="space-y-2.5 pt-2">
          {(isAr ? currentQ.optionsAr : currentQ.optionsEn)?.map((opt, idx) => {
            const isSelected = selectedAnswer === idx;
            const isCorrect = idx === currentQ.correctAnswer;

            let btnClass =
              'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200';

            if (isAnswered) {
              if (isCorrect) {
                btnClass =
                  'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold';
              } else if (isSelected) {
                btnClass =
                  'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-200 font-bold';
              } else {
                btnClass = 'opacity-40 border-slate-200 dark:border-slate-800 text-slate-400';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                disabled={isAnswered}
                className={`w-full p-3.5 rounded-2xl border text-xs sm:text-sm text-left rtl:text-right transition-all flex items-center justify-between ${btnClass}`}
              >
                <span>{opt}</span>
                {isAnswered && isCorrect && <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />}
                {isAnswered && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Immediate Feedback Box & Adaptive Scaffolding */}
        {isAnswered && (
          <div
            className={`p-3.5 rounded-2xl border text-xs leading-relaxed space-y-2.5 ${
              isCurrentCorrect
                ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                : 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-200'
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold">
              {isCurrentCorrect ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{isAr ? 'إجابة صحيحة وموفقة!' : 'Correct Answer!'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{isAr ? 'قريبة جداً! تعالي نفهم الفكرة بزاوية مبسطة:' : 'Close! Let\'s look at it from another angle:'}</span>
                </>
              )}
            </div>
            <p className="leading-relaxed">{isAr ? currentQ.explanationAr : currentQ.explanationEn}</p>

            {/* Adaptive Intervention Pathways when incorrect */}
            {!isCurrentCorrect && (
              <div className="pt-2 border-t border-amber-200/80 dark:border-amber-800/60 flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleRetryWithScaffolding}
                  className="py-1.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-[11px] shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{isAr ? 'أعيدي المحاولة مع تلميح مبسط' : 'Retry with Scaffolding'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleLaunchDeepExplanation}
                  className="py-1.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>👩‍🏫</span>
                  <span>{isAr ? 'اشرحي لي صوتياً مع مس نور' : 'Explain with Miss Nour'}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Hint Section */}
        {!isAnswered && (
          <div className="pt-2">
            {!showHint ? (
              <button
                onClick={() => setShowHint(true)}
                className="text-xs text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>{isAr ? 'أحتاج تلميحاً صغيراً' : 'Show a hint'}</span>
              </button>
            ) : (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200 flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{isAr ? currentQ.hintAr : currentQ.hintEn}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Footer Action */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between">
        <div>
          {onExplainDifferently && (
            <button
              onClick={onExplainDifferently}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{isAr ? 'اشرح بطريقة تانية' : 'Explain differently'}</span>
            </button>
          )}
        </div>

        <div>
          {isAnswered && (
            <button
              onClick={handleNext}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
            >
              <span>
                {isLastQuestion
                  ? isAr ? 'إنهاء وحفظ النتيجة' : 'Finish & Save'
                  : isAr ? 'السؤال التالي' : 'Next Question'}
              </span>
              {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
