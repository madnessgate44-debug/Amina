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

import React, { useEffect, useRef, useState } from 'react';
import { Reel } from '../../types/reel';
import { NourState } from '../../types/stage';
import { Language } from '../../types';
import { NourCharacter } from '../stage/NourCharacter';
import { SaveLikeButton } from '../collections/SaveLikeButton';
import { voiceService } from '../../services/voice/voiceService';
import {
  HandsFreeState,
  initialHandsFreeState,
  reduceHandsFree,
} from '../../services/voice/handsFreeLoop';
import { VoiceInputControl } from '../voice/VoiceInputControl';
import { resolveReelResponse, matchSpokenOption } from '../../services/reels/reelResponse';
import { ReelVisual } from './ReelVisual';
import { ReelMedia } from './ReelMedia';
import { mediaForConcept } from '../../data/media/mediaCatalog';
import { EducationalMediaItem } from '../../types/media';
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
  /** Enables the spoken turn: after Noor speaks, the microphone opens by itself. */
  handsFreeEnabled?: boolean;
  /**
   * Fired once Noor has finished speaking her reaction (or, when voice is off,
   * once the reaction text has been shown). The feed advances on this signal
   * instead of a fixed timer, so a longer explanation is never cut off and a
   * short one never leaves the child waiting in silence.
   */
  onReactionSpoken?: () => void;
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
  handsFreeEnabled = false,
  onReactionSpoken,
}) => {
  const [chosen, setChosen] = useState<number | null>(null);
  const [xpPop, setXpPop] = useState(false);
  const [muted, setMuted] = useState(false);
  // Guard so the advance signal fires exactly once per answered reel.
  const advancedRef = useRef(false);
  // Always call the latest parent callback without re-running the speech effect.
  const onReactionSpokenRef = useRef(onReactionSpoken);
  onReactionSpokenRef.current = onReactionSpoken;
  // The live reaction to the child's answer, once it arrives.
  const [reaction, setReaction] = useState<string | null>(null);
  const [namedMisconception, setNamedMisconception] = useState(false);
  const [offlineTeacher, setOfflineTeacher] = useState(false);
  const [isReacting, setIsReacting] = useState(false);

  // The educational media this reel should show, if any. Real media wins over
  // the text-derived canvas: a curriculum illustration, animation or narration
  // teaches better than a schematic drawn from the reel's own words. Reels with
  // no catalogued media keep the canvas visual, so nothing regresses.
  const mediaItem: EducationalMediaItem | null = React.useMemo(() => {
    const items = mediaForConcept(reel.lessonId, reel.conceptId);
    if (items.length === 0) return null;
    return items.find((m) => m.reelKind === reel.kind) || items[0];
  }, [reel.lessonId, reel.conceptId, reel.kind]);

  // Hands-free turn taking: the microphone opens on its own once Noor has
  // stopped speaking, so a young learner can answer without finding a button.
  // Same state machine the teaching modal uses, so the two cannot drift.
  const [handsFree, setHandsFree] = useState<HandsFreeState>(() => initialHandsFreeState());
  const handsFreeOn = handsFreeEnabled && voiceEnabled && !muted && handsFree.enabled;
  const dispatchHandsFree = (event: Parameters<typeof reduceHandsFree>[1]) =>
    setHandsFree((prev) => reduceHandsFree(prev, event));

  // Noor's narration is a real audio element, not just a hidden player: the
  // child can replay her line, and the reel genuinely carries audio media.
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [hasAudio, setHasAudio] = useState(false);
  const markAudio = () => setHasAudio(true);

  // Narrate the reel as it appears, unless voice is off or muted. When the reel
  // asks a question and hands-free is on, the turn passes to the child only once
  // Noor has finished speaking — the microphone must never cut her off. The
  // ReelCard is keyed by reel id in the feed, so each question starts fresh.
  useEffect(() => {
    if (!voiceEnabled || muted) return;
    const spoken = `${reel.noorLine}`;
    if (handsFreeOn && reel.options?.length) {
      dispatchHandsFree({ type: 'tutor_turn_added' });
      let settled = false;
      const handOver = () => {
        if (settled) return;
        settled = true;
        dispatchHandsFree({ type: 'speech_finished' });
      };
      void voiceService.speak(spoken, language, markAudio, handOver, handOver, audioRef.current ?? undefined);
      // Safety net: if the engine never reports end, still open the microphone.
      const t = window.setTimeout(handOver, 9000);
      return () => {
        window.clearTimeout(t);
        voiceService.cancelSpeech();
      };
    }
    void voiceService.speak(spoken, language, markAudio, undefined, undefined, audioRef.current ?? undefined);
    return () => voiceService.cancelSpeech();
  }, [reel.id, voiceEnabled, muted, language, reel.noorLine, handsFreeOn, reel.options?.length]);

  /**
   * Match what the child said against the reel's own options before it counts as
   * a spoken answer. A free-form transcript ("شمال") must not be graded as
   * wrong just because it is not a verbatim option ("الرقم 5"), and Noor should
   * never name a misconception for an answer the child did not give.
   */
  const resolveSpokenAnswer = (transcript: string): number | null =>
    matchSpokenOption(transcript, reel.options);

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

  // Speak Noor's reaction once it arrives, then hand control back to the feed on
  // speech-end instead of a fixed timer (owner ask: advance "after she stops
  // speaking"). The same signal is the hook for voice turn-taking in the feed.
  useEffect(() => {
    if (!reaction) return;
    if (advancedRef.current) return;

    const fireAdvance = () => {
      if (advancedRef.current) return;
      advancedRef.current = true;
      onReactionSpokenRef.current?.();
    };

    if (!voiceEnabled || muted) {
      // No audio: hold the reaction long enough to read, then move on.
      const readMs = Math.min(6000, 1400 + reaction.length * 45);
      const t = window.setTimeout(fireAdvance, readMs);
      return () => window.clearTimeout(t);
    }

    let settled = false;
    const onSpoken = () => {
      if (settled) return;
      settled = true;
      fireAdvance();
    };
    void voiceService.speak(reaction, language, markAudio, onSpoken, onSpoken, audioRef.current ?? undefined);
    // Safety net: if the engine never reports end, still advance.
    const t = window.setTimeout(onSpoken, 12000);
    return () => window.clearTimeout(t);
  }, [reaction, voiceEnabled, muted, language]);

  // The reel asks a question: the microphone opens only after Noor has finished
  // speaking (see the narration effect above), so there is no timer here. The
  // card is keyed by reel id in the feed, so each question starts with a fresh
  // turn state.

  // A spoken answer resolves through the same path as a tap, so the diagnosis,
  // the quota rules and the feed's evidence stay identical.
  const handleSpokenAnswer = (transcript: string) => {
    if (chosen !== null) return;
    const index = resolveSpokenAnswer(transcript);
    if (index === null) {
      dispatchHandsFree({ type: 'transcript_empty' });
      return;
    }
    dispatchHandsFree({ type: 'student_answered' });
    handlePick(index);
  };

  const noorState: NourState = chosen === null
    ? 'talking'
    : chosen === correctIndex
    ? 'celebrating'
    : 'gentle_correct';

  // Until the reaction arrives, keep showing Noor's own line.
  const shownReaction = reaction ?? (chosen === null ? reel.noorLine : reel.reactionWrong);

  return (
    <section
      className="h-full snap-start flex items-center px-4 pt-6 pb-24 relative overflow-hidden"
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
          {mediaItem ? (
            <ReelMedia
              item={mediaItem}
              language={language}
              isAr={isAr}
              reducedMotion={reducedMotion}
            />
          ) : (
            <ReelVisual reel={reel} isAr={isAr} reducedMotion={reducedMotion} />
          )}

          {/* Noor's spoken line as real audio media. Hidden unless the tutor
              produced audio, so it never shows a dead player. */}
          <audio
            ref={audioRef}
            controls={hasAudio}
            preload="none"
            className={hasAudio ? 'mt-3 w-full h-9' : 'hidden'}
            aria-label={isAr ? 'صوت مس نور' : 'Miss Noor audio'}
          />

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

          {/* Spoken turn: answer out loud, no button press needed. The same
              control is the fallback when the mic cannot open on its own. */}
          {reel.options && reel.options.length > 0 && chosen === null && voiceEnabled && (
            <div className="mt-4 flex items-center gap-3">
              <VoiceInputControl
                buttonSize="md"
                handsFree={handsFreeOn}
                listenSignal={handsFree.listenToken}
                onTranscriptConfirmed={handleSpokenAnswer}
                onTranscriptUnusable={() => dispatchHandsFree({ type: 'transcript_empty' })}
              />
              <span className="text-[13px] text-slate-300">
                {handsFreeOn
                  ? isAr
                    ? 'قولي إجابتك بصوتك — أنا سامعاك'
                    : reel.language === 'fr'
                    ? 'Dis ta réponse à voix haute — je t’écoute'
                    : 'Say your answer out loud — I am listening'
                  : isAr
                  ? 'أو اضغطي المايك وقولي إجابتك'
                  : reel.language === 'fr'
                  ? 'Ou appuie sur le micro et réponds'
                  : 'Or tap the mic and say your answer'}
              </span>
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
