/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Mission } from '../../types';
import { getReelForConcept, LearningReelContent } from '../../services/content/contentGenerator';
import { Badge } from '../common/Badge';
import {
  Sparkles,
  Play,
  Pause,
  CheckCircle,
  HelpCircle,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  X,
  Volume2,
  Clock,
  BookOpen,
} from 'lucide-react';

interface ReelViewerProps {
  mission: Mission;
  onComplete: (score: number) => void;
  onSkip: () => void;
  onExplainDifferently?: () => void;
}

export const ReelViewer: React.FC<ReelViewerProps> = ({
  mission,
  onComplete,
  onSkip,
  onExplainDifferently,
}) => {
  const { language, t } = useApp();
  const isAr = language === 'ar';

  const [reel, setReel] = useState<LearningReelContent | null>(null);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progressSec, setProgressSec] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnsweredCheck, setHasAnsweredCheck] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);

  useEffect(() => {
    if (mission.conceptId) {
      const generated = getReelForConcept(mission.conceptId);
      setReel(generated);
    }
  }, [mission.conceptId]);

  const currentScene = reel?.scenes[currentSceneIndex];
  const totalScenes = reel?.scenes.length || 0;
  const isLastScene = currentSceneIndex === totalScenes - 1;

  // Auto-advance scenes if playing (unless on quick check)
  useEffect(() => {
    if (!isPlaying || !currentScene || isLastScene) return;

    const timer = setInterval(() => {
      setProgressSec((prev) => {
        if (prev + 1 >= currentScene.durationSeconds) {
          setCurrentSceneIndex((idx) => Math.min(idx + 1, totalScenes - 1));
          return 0;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, currentScene, isLastScene, totalScenes]);

  if (!reel || !currentScene) {
    return (
      <div className="p-6 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-slate-800 dark:text-slate-100">
          {isAr ? 'المحتوى غير متوفر لهذا المفهوم' : 'Content not yet available'}
        </h3>
        <p className="text-xs text-slate-500 max-w-xs mx-auto">
          {isAr
            ? 'النظام يلتزم بعدم اختلاق أي درس خارج المنهج التجريبي المسجل.'
            : 'The engine strictly does not fabricate content outside demo curriculum.'}
        </p>
        <button
          onClick={onSkip}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
        >
          {isAr ? 'العودة وتخطي المهمة' : 'Skip Mission'}
        </button>
      </div>
    );
  }

  const handleOptionClick = (idx: number) => {
    if (hasAnsweredCheck) return;
    setSelectedOption(idx);
    const correct = idx === reel.quickCheck.correctIndex;
    setIsAnswerCorrect(correct);
    setHasAnsweredCheck(true);
  };

  const handleFinishReel = () => {
    // If passed check give 1.0, otherwise 0.4
    const score = isAnswerCorrect ? 1.0 : 0.4;
    onComplete(score);
  };

  const sceneProgressPercent = currentScene.durationSeconds > 0
    ? (progressSec / currentScene.durationSeconds) * 100
    : 100;

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white rounded-3xl overflow-hidden relative shadow-2xl border border-slate-800">
      {/* Top Meta Header */}
      <div className="p-4 bg-linear-to-b from-slate-900/90 to-transparent flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <Badge variant="demo">{reel.originTag}</Badge>
          <span className="text-xs font-semibold text-slate-300">
            {isAr ? reel.conceptNameAr : reel.conceptNameEn}
          </span>
        </div>
        <button
          onClick={onSkip}
          className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition-all"
          title={isAr ? 'إغلاق أو تخطي' : 'Close or Skip'}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Story Progress Bars */}
      <div className="px-4 flex gap-1.5 z-10">
        {reel.scenes.map((s, idx) => (
          <div
            key={idx}
            className="flex-1 h-1 rounded-full bg-white/20 overflow-hidden cursor-pointer"
            onClick={() => {
              setCurrentSceneIndex(idx);
              setProgressSec(0);
            }}
          >
            <div
              className={`h-full bg-amber-400 transition-all ${
                idx < currentSceneIndex ? 'w-full' : idx === currentSceneIndex ? '' : 'w-0'
              }`}
              style={{
                width: idx === currentSceneIndex ? `${sceneProgressPercent}%` : undefined,
              }}
            />
          </div>
        ))}
      </div>

      {/* Main Reel Viewport */}
      <div className="flex-1 flex flex-col justify-center p-6 relative z-10 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold w-fit">
          <span>{currentScene.visualCue || '✨'}</span>
          <span>{isAr ? currentScene.badgeAr : currentScene.badgeEn}</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
          {isAr ? currentScene.titleAr : currentScene.titleEn}
        </h2>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-sm sm:text-base leading-relaxed text-slate-200">
          {isAr ? currentScene.contentAr : currentScene.contentEn}
        </div>

        {/* Quick Check Panel (Scene 4) */}
        {isLastScene && (
          <div className="mt-4 p-4 rounded-2xl bg-indigo-950/70 border border-indigo-500/40 space-y-3">
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold">
              <Sparkles className="w-4 h-4" />
              <span>{isAr ? 'فحص الاستيعاب السريع:' : 'Quick Check Question:'}</span>
            </div>
            <p className="text-sm font-semibold text-white">
              {isAr ? reel.quickCheck.questionAr : reel.quickCheck.questionEn}
            </p>

            <div className="space-y-2">
              {(isAr ? reel.quickCheck.optionsAr : reel.quickCheck.optionsEn).map((opt, oIdx) => {
                const isSelected = selectedOption === oIdx;
                const isCorrect = oIdx === reel.quickCheck.correctIndex;
                let btnStyle = 'bg-white/10 hover:bg-white/20 border-white/10 text-white';

                if (hasAnsweredCheck) {
                  if (isCorrect) btnStyle = 'bg-emerald-600/60 border-emerald-500 text-emerald-100 font-bold';
                  else if (isSelected) btnStyle = 'bg-rose-600/60 border-rose-500 text-rose-100';
                  else btnStyle = 'bg-white/5 border-white/5 opacity-50 text-slate-400';
                }

                return (
                  <button
                    key={oIdx}
                    onClick={() => handleOptionClick(oIdx)}
                    disabled={hasAnsweredCheck}
                    className={`w-full p-2.5 rounded-xl border text-xs text-left rtl:text-right transition-all flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {hasAnsweredCheck && isCorrect && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {hasAnsweredCheck && (
              <div className="pt-2 text-xs text-indigo-200 leading-relaxed border-t border-indigo-500/30">
                {isAr ? reel.quickCheck.explanationAr : reel.quickCheck.explanationEn}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="p-4 bg-linear-to-t from-slate-900/90 to-transparent flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          {!isLastScene ? (
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white"
              title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          ) : (
            <button
              onClick={() => {
                setCurrentSceneIndex(0);
                setProgressSec(0);
                setHasAnsweredCheck(false);
                setSelectedOption(null);
              }}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 text-xs font-semibold px-3"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isAr ? 'إعادة المشاهدة' : 'Replay'}</span>
            </button>
          )}

          {onExplainDifferently && (
            <button
              onClick={onExplainDifferently}
              className="text-xs text-amber-300 hover:text-amber-200 underline font-semibold flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{isAr ? 'اشرح بطريقة تانية' : 'Explain differently'}</span>
            </button>
          )}
        </div>

        <div>
          {!isLastScene ? (
            <button
              onClick={() => {
                setCurrentSceneIndex((prev) => Math.min(prev + 1, totalScenes - 1));
                setProgressSec(0);
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
            >
              <span>{isAr ? 'التالي' : 'Next'}</span>
              {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          ) : (
            <button
              onClick={handleFinishReel}
              disabled={!hasAnsweredCheck}
              className={`px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-lg transition-all ${
                hasAnsweredCheck
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer'
                  : 'bg-slate-700 text-slate-400 cursor-not-allowed'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isAr ? 'إكمال المهمة وتحديث الإتقان' : 'Complete & Update Mastery'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
