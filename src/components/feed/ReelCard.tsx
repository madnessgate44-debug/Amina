/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * A single reel card. Full-screen, snaps, plays IN the feed (no modal).
 *
 * Accessibility floor: body text is at least 14px (hard floor 12px for the
 * source line), every tap target is at least 44px, and animations are skipped
 * when the user prefers reduced motion.
 */

import React, { useEffect, useState } from 'react';
import { Reel } from '../../types/reel';
import { NourState } from '../../types/stage';
import { Language } from '../../types';
import { NourCharacter } from '../stage/NourCharacter';
import { SaveLikeButton } from '../collections/SaveLikeButton';
import { voiceService } from '../../services/voice/voiceService';
import { resolveReelResponse } from '../../services/reels/reelResponse';
import { Sparkles, Check, X as XIcon, BookOpen, Volume2, VolumeX } from 'lucide-react';

interface ReelCardProps {
  reel: Reel;
  isAr: boolean;
  language: Language;
  reducedMotion: boolean;
  /** Mirrors settings.companionVoiceEnabled. */
  voiceEnabled: boolean;
  onAnswer: (correct: boolean) => void;
  onTeachMore: () => void;
  onSkip: () => void;
}

const REASON_LABEL: Record<string, { ar: string; en: string; fr: string }> = {
  due_review: { ar: 'مراجعة سريعة', en: 'Quick review', fr: 'Révision rapide' },
  today_lesson: { ar: 'درس النهارده', en: "Today's lesson", fr: 'Leçon du jour' },
  exam_topic: { ar: 'مهم للامتحان', en: 'Exam focus', fr: 'Pour l’examen' },
  curiosity: { ar: 'حاجة جديدة', en: 'Something new', fr: 'Une découverte' },
  refill: { ar: 'نقوّي الأساس', en: 'Build the basics', fr: 'Renforcer les bases' },
  closer: { ar: 'خلصنا!', en: 'All done!', fr: 'Terminé !' },
};

export const ReelCard: React.FC<ReelCardProps> = ({
  reel,
  isAr,
  language,
  reducedMotion,
  voiceEnabled,
  onAnswer,
  onTeachMore,
  onSkip,
}) => {
  const [chosen, setChosen] = useState<number | null>(null);
  const [xpPop, setXpPop] = useState(false);
  const [muted, setMuted] = useState(false);
  // The live reaction to the child's answer, once it arrives.
  const [reaction, setReaction] = useState<string | null>(null);
  const [namedMisconception, setNamedMisconception] = useState(false);
  const [offlineTeacher, setOfflineTeacher] = useState(false);
  const [isReacting, setIsReacting] = useState(false);

  // Narrate the reel as it appears, unless voice is off or muted.
  useEffect(() => {
    if (!voiceEnabled || muted) return;
    const spoken = `${reel.noorLine}`;
    void voiceService.speak(spoken, language);
    return () => voiceService.cancelSpeech();
  }, [reel.id, voiceEnabled, muted, language, reel.noorLine]);

  const reason = reel.reason ? REASON_LABEL[reel.reason] : null;
  const reasonText = reason ? (isAr ? reason.ar : reel.language === 'fr' ? reason.fr : reason.en) : '';
  const correctIndex = reel.options ? reel.options.findIndex((o) => o.isCorrect) : -1;

  const handlePick = (index: number) => {
    if (chosen !== null) return;
    setChosen(index);
    const correct = index === correctIndex;
    if (correct) {
      setXpPop(true);
      if (!reducedMotion) window.setTimeout(() => setXpPop(false), 1200);
    }
    onAnswer(correct);

    // React to the answer the child actually gave. A correct answer reuses the
    // reel's praise line; a wrong one is diagnosed against curriculum
    // misconceptions first, and only then asks the model.
    const answerText = reel.options?.[index]?.text || '';
    setIsReacting(true);
    void resolveReelResponse({
      reel,
      answerText,
      correct,
      language,
    })
      .then((result) => {
        setReaction(result.text);
        setNamedMisconception(result.namedMisconception);
        setOfflineTeacher(result.degraded);
      })
      .catch(() => {
        setReaction(reel.reactionWrong);
        setOfflineTeacher(true);
      })
      .finally(() => setIsReacting(false));
  };

  // Speak Noor's reaction once it arrives, so the child hears the answer back
  // instead of only reading it. This is the second half of the turn: the reel
  // prompt is spoken on appear (above), and the reaction is spoken on answer.
  useEffect(() => {
    if (!voiceEnabled || muted) return;
    if (!reaction) return;
    void voiceService.speak(reaction, language);
  }, [reaction, voiceEnabled, muted, language]);

  const noorState: NourState = chosen === null
    ? 'talking'
    : chosen === correctIndex
    ? 'celebrating'
    : 'gentle_correct';

  // Until the reaction arrives, keep showing Noor's own line.
  const shownReaction = reaction ?? (chosen === null ? reel.noorLine : reel.reactionWrong);

  return (
    <section
      className="min-h-full snap-start flex items-center px-4 pt-6 pb-24 relative overflow-hidden"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <div className="absolute inset-0 bg-linear-to-br from-slate-950 via-indigo-950/50 to-slate-950" />
      <div className="relative z-10 max-w-md mx-auto w-full">
        <div className="flex items-start gap-2 mb-3">
          <NourCharacter state={noorState} outfit="arabic" size="sm" />
          <div className="flex-1 min-w-0">
            {reasonText && (
              <div className="inline-block text-[12px] uppercase tracking-widest text-amber-300 font-black mb-1">
                {reasonText}
              </div>
            )}
            <div className="rounded-2xl rounded-bl-md bg-white text-slate-900 px-4 py-3 shadow-xl">
              <div className="flex items-center gap-1.5 text-violet-600 text-[12px] font-black uppercase tracking-wider mb-1">
                <Sparkles className="w-3 h-3" />
                <span>{isAr ? 'نور' : 'Noor'}</span>
              </div>
              <p className="text-[15px] font-bold leading-relaxed">
                {isReacting && chosen !== null ? (isAr ? '…' : '…') : shownReaction}
              </p>
              {namedMisconception && (
                <div className="mt-2 inline-block text-[11px] font-black text-violet-700 bg-violet-100 px-2 py-0.5 rounded-lg">
                  {isAr ? '🔍 عرفنا الغلطة' : '🔍 Misconception named'}
                </div>
              )}
              {offlineTeacher && (
                <div className="mt-2 inline-block text-[11px] font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-lg">
                  {isAr ? '🎒 معلمة بدون إنترنت' : '🎒 Offline teacher'}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] bg-white/10 backdrop-blur-xl border border-white/15 p-5 shadow-2xl">
          <div className="text-[12px] uppercase tracking-widest text-cyan-300 font-black mb-2">
            {reel.subjectName}
          </div>
          <h2 className="text-[22px] font-black leading-snug text-white">{reel.hook}</h2>
          {reel.show && reel.show !== reel.hook && (
            <p className="text-[14px] text-slate-300 mt-2 leading-relaxed">{reel.show}</p>
          )}

          {reel.options && reel.options.length > 0 && (
            <div className="mt-4 space-y-2.5">
              {reel.options.map((opt, i) => {
                const isChosen = chosen === i;
                const revealCorrect = chosen !== null && i === correctIndex;
                const revealWrong = isChosen && i !== correctIndex;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handlePick(i)}
                    disabled={chosen !== null}
                    className={`w-full min-h-[44px] px-4 py-3 rounded-2xl text-start text-[15px] font-bold flex items-center justify-between gap-2 transition-all ${
                      revealCorrect
                        ? 'bg-emerald-500 text-white'
                        : revealWrong
                        ? 'bg-rose-500/80 text-white'
                        : 'bg-white/15 text-white hover:bg-white/25'
                    }`}
                  >
                    <span>{opt.text}</span>
                    {revealCorrect && <Check className="w-5 h-5 shrink-0" />}
                    {revealWrong && <XIcon className="w-5 h-5 shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}

          {chosen !== null && chosen === correctIndex && xpPop && (
            <div className={`mt-3 text-center text-emerald-300 font-black text-[16px] ${reducedMotion ? '' : 'animate-bounce'}`}>
              +XP ✨
            </div>
          )}

          <div className="mt-5 flex items-center justify-between gap-2 flex-wrap">
            <span className="text-[12px] text-slate-400 flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              {reel.sourceLabel}
            </span>
            <SaveLikeButton
              sourceId={reel.id}
              type="reel"
              title={reel.hook}
              subject={reel.subjectName}
              snippet={reel.show}
            />
            {voiceEnabled && (
              <button
                type="button"
                aria-label={muted ? 'Unmute Noor' : 'Mute Noor'}
                onClick={() => {
                  setMuted((m) => {
                    if (!m) voiceService.cancelSpeech();
                    return !m;
                  });
                }}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-white/10 text-slate-200 hover:bg-white/20"
              >
                {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            )}
            <div className="flex items-center gap-2">
              {reel.conceptId !== 'closer' && (
                <button
                  type="button"
                  onClick={onTeachMore}
                  className="min-h-[44px] px-3 py-2 rounded-xl bg-white/15 text-white text-[14px] font-black hover:bg-white/25"
                >
                  {isAr ? 'علّمني أكتر' : reel.language === 'fr' ? 'Explique-moi plus' : 'Teach me more'}
                </button>
              )}
              {chosen === null && (
                <button
                  type="button"
                  onClick={onSkip}
                  className="min-h-[44px] px-3 py-2 rounded-xl bg-transparent text-slate-300 text-[14px] font-bold hover:text-white"
                >
                  {isAr ? 'تخطّي' : reel.language === 'fr' ? 'Passer' : 'Skip'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
