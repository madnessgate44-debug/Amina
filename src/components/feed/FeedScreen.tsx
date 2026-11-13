/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * FEED — the reel feed.
 *
 * The feed is now a session of 30-45s single-concept reels built by the reel
 * engine (src/services/reels). Each reel teaches exactly one concept, keeps
 * the source line visible, and asks at most one question. The old mission /
 * lesson / review cards are kept as the fallback path when the engine has no
 * reel to show, so nothing that worked before was removed.
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { curriculumService } from '../../services/curriculum/curriculumService';
import { Mission } from '../../types';
import { Reel } from '../../types/reel';
import { buildFeedQueue, buildRetryAfterMistakes } from '../../services/reels/feedQueue';
import { recordLearningSignal } from '../../services/telemetry/learningSignals';
import {
  FeedConceptState,
  reduceFeedSignal,
} from '../../services/telemetry/feedLearningSignals';
import { QuizRunner } from '../missions/QuizRunner';
import { HomeworkRunner } from '../missions/HomeworkRunner';
import { TeachingSessionModal } from '../teaching/TeachingSessionModal';
import { ReelCard } from './ReelCard';
import { Play, BookOpen, Sparkles, ArrowDown, X, MessageCircle, Flame, Star } from 'lucide-react';

type FeedCard =
  | { kind: 'lesson'; id: string; title: string; subject: string; lessonId: string; purpose: string }
  | { kind: 'mission'; id: string; mission: Mission; purpose: string };

export const FeedScreen: React.FC = () => {
  const {
    language,
    settings,
    student,
    missionsForToday,
    currentDayRecord,
    dueReviewNudges,
    masteryRecords,
    upcomingExams,
    recordEvidence,
    awardReelXp,
    gamification,
    setActiveTab,
    startMission,
  } = useApp();
  const isAr = language === 'ar';
  const isFr = language === 'fr';
  const [activeLesson, setActiveLesson] = useState<string | null>(null);
  const [activeMission, setActiveMission] = useState<Mission | null>(null);

  // Reel session state.
  const [queue, setQueue] = useState<Reel[] | null>(null);
  const [cursor, setCursor] = useState(0);
  const consecutiveWrong = useRef(0);
  // Per-concept session state for the learning signals, reset when the queue is
  // rebuilt. Kept in a ref so a reel answer never re-renders the whole feed.
  const feedSignalState = useRef<Map<string, FeedConceptState>>(new Map());
  // The session the cursor currently belongs to. The queue rebuilds after every
  // answer, so the cursor is only rewound when the SESSION changes — otherwise
  // the child is bounced back to reel 1 on each tap.
  const activeSessionRef = useRef<string | null>(null);
  // Latest cursor, read by the queue effect without making it a dependency.
  const cursorRef = useRef(0);
  cursorRef.current = cursor;
  const [reducedMotion, setReducedMotion] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  const sessionMinutes = student?.onboarding?.sessionLengthMinutes || 10;
  // A feed session is identified by who is reading and in which language, NOT by
  // the queue contents. The queue rebuilds after every answer (recordEvidence
  // updates masteryRecords), so keying session state on the queue would reset the
  // child's progress and learning signals on every tap.
  const sessionKey = `${student?.id ?? ''}|${language}|${sessionMinutes}`;

  const builtQueue = useMemo(() => {
    if (!student?.id) return null;
    const todaySubjects = (currentDayRecord?.lessonsCovered || []).map((l) => l.subject);
    return buildFeedQueue({
      studentId: student.id,
      language,
      mastery: masteryRecords,
      dueReviews: dueReviewNudges,
      todaySubjects,
      examCalendar: upcomingExams,
      sessionMinutes,
    });
  }, [student?.id, language, masteryRecords, dueReviewNudges, currentDayRecord, upcomingExams, sessionMinutes]);

  useEffect(() => {
    if (!builtQueue) return;
    const sessionChanged = activeSessionRef.current !== sessionKey;
    activeSessionRef.current = sessionKey;
    setQueue(builtQueue.reels);
    if (sessionChanged) {
      // A new session starts at the top; a rebuild inside one keeps the place.
      setCursor(0);
      consecutiveWrong.current = 0;
      return;
    }
    // Keep the child on the same reel across a rebuild (clamped to the new length).
    setCursor(Math.min(cursorRef.current, Math.max(0, builtQueue.reels.length - 1)));
  }, [builtQueue, sessionKey]);

  // The per-concept signal state spans a whole session, so it must survive a
  // queue rebuild — and the queue DOES rebuild after every answer, because
  // recordEvidence updates masteryRecords. Reset it only when the session
  // identity changes (a different child, language or session length).
  useEffect(() => {
    feedSignalState.current = new Map();
  }, [sessionKey]);

  // Legacy fallback cards (kept for when the engine yields nothing to show).
  const feed = useMemo<FeedCard[]>(() => {
    const cards: FeedCard[] = [];
    const lessons = curriculumService.getAvailableLessons();

    missionsForToday
      .filter((m) => m.status !== 'completed')
      .slice(0, 6)
      .forEach((mission) => {
        cards.push({
          kind: 'mission',
          id: `mission-${mission.id}`,
          mission,
          purpose: isAr ? 'ده اللي محتاجاه النهارده' : isFr ? 'Un moment d\'apprentissage choisi pour toi' : 'A learning moment Noor chose for you',
        });
      });

    const schoolSubjects = new Set((currentDayRecord?.lessonsCovered || []).map((l) => l.subject.toLowerCase()));
    lessons
      .filter((lesson) => schoolSubjects.size === 0 || schoolSubjects.has(lesson.subjectNameEn.toLowerCase()) || schoolSubjects.has(lesson.subjectNameAr.toLowerCase()))
      .slice(0, 6)
      .forEach((lesson) => {
        cards.push({
          kind: 'lesson',
          id: `lesson-${lesson.id}`,
          title: isAr ? lesson.titleAr : isFr && lesson.titleFr ? lesson.titleFr : lesson.titleEn,
          subject: isAr ? lesson.subjectNameAr : isFr && lesson.subjectNameFr ? lesson.subjectNameFr : lesson.subjectNameEn,
          lessonId: lesson.id,
          purpose: isAr ? 'درس حقيقي من منهجك' : isFr ? 'Une vraie leçon de ton programme' : 'A real lesson from your curriculum',
        });
      });

    dueReviewNudges.slice(0, 4).forEach((review) => {
      const found = curriculumService.getConceptById(review.conceptId);
      if (!found) return;
      cards.push({
        kind: 'lesson',
        id: `review-${review.conceptId}`,
        title: isAr ? found.concept.titleAr : isFr && found.concept.titleFr ? found.concept.titleFr : found.concept.titleEn,
        subject: isAr ? found.lesson.subjectNameAr : isFr && found.lesson.subjectNameFr ? found.lesson.subjectNameFr : found.lesson.subjectNameEn,
        lessonId: found.lesson.id,
        purpose: isAr ? 'نور اختارت ده للمراجعة' : isFr ? 'Noor a choisi ceci pour une bonne révision' : 'Noor picked this for a smart review',
      });
    });

    return cards;
  }, [missionsForToday, currentDayRecord, dueReviewNudges, isAr, isFr]);

  const runMission = (mission: Mission) => {
    startMission(mission);
    setActiveMission(mission);
  };

  const handleReelAnswer = async (reel: Reel, correct: boolean) => {
    if (reel.conceptId === 'closer') return;

    await recordEvidence(reel.conceptId, {
      correctness: correct ? 'full' : 'wrong',
      difficulty: 0.5,
      independence: 'unassisted',
      modality: 'reel_check',
      notes: `reel:${reel.kind}`,
    });

    const record = masteryRecords[reel.conceptId];
    const conceptMastered = Boolean(record && record.score >= 0.75);

    await awardReelXp({ earnedXp: correct ? 10 : 2, correct, conceptMastered });

    if (!correct) {
      consecutiveWrong.current += 1;
      setAnnouncement(isAr ? 'قربت! هشرحلك الفكرة تاني.' : isFr ? 'Tu y es presque ! Je t\'explique encore une fois.' : 'Almost! Let me re-explain this idea.');
      if (consecutiveWrong.current >= 2) {
        // Rule 3: after two wrong in a row on the same concept, teach then retry.
        const retry = buildRetryAfterMistakes(reel.conceptId, language);
        if (retry.length > 0) {
          setQueue((prev) => {
            if (!prev) return prev;
            const next = prev.slice();
            next.splice(cursor + 1, 0, ...retry);
            return next;
          });
        }
        consecutiveWrong.current = 0;
      }
    } else {
      consecutiveWrong.current = 0;
      setAnnouncement(isAr ? 'برافو! 🎉' : isFr ? 'Bravo ! 🎉' : 'Nice work! 🎉');
    }
  };

  const advance = () => {
    setCursor((c) => {
      const next = c + 1;
      return queue && next < queue.length ? next : c;
    });
  };

  /**
   * Record the per-session learning signals once a reel's answer is resolved.
   * The reel loop is where most practice happens, so without this a whole feed
   * session left no learning evidence behind — only the teaching modal did.
   */
  const handleReelOutcome = (reel: Reel, correct: boolean, namedMisconception: boolean) => {
    if (reel.conceptId === 'closer') return;
    const { state, outcome } = reduceFeedSignal(
      feedSignalState.current.get(reel.conceptId),
      { conceptId: reel.conceptId, correct, namedMisconception }
    );
    feedSignalState.current.set(reel.conceptId, state);
    recordLearningSignal(outcome);
  };

  const currentReel = queue && cursor < queue.length ? queue[cursor] : null;

  if (currentReel) {
    return (
      <div className="flex-1 min-h-0 overflow-y-auto snap-y snap-mandatory h-full bg-slate-950 text-white">
        <div className="sr-only" aria-live="polite">{announcement}</div>
        {gamification && (
          <div className="fixed top-2 start-3 end-3 z-20 flex items-center justify-between pointer-events-none">
            <span className="flex items-center gap-1 text-[12px] font-black text-amber-300 bg-slate-950/70 px-2.5 py-1 rounded-full">
              <Star className="w-3 h-3" /> {isAr ? 'مستوى' : isFr ? 'Niveau' : 'Level'} {gamification.level}
            </span>
            <span className="flex items-center gap-1 text-[12px] font-black text-orange-300 bg-slate-950/70 px-2.5 py-1 rounded-full">
              <Flame className="w-3 h-3" />
              {gamification.streak.currentDays}
              {gamification.streak.isPaused && (isAr ? ' (راحة)' : isFr ? ' (repos)' : ' (rest)')}
            </span>
          </div>
        )}
        <ReelCard
          key={currentReel.id}
          reel={currentReel}
          isAr={isAr}
          language={language}
          reducedMotion={reducedMotion}
          voiceEnabled={settings.companionVoiceEnabled}
          handsFreeEnabled={settings.companionVoiceEnabled}
          onAnswer={(correct) => {
            void handleReelAnswer(currentReel, correct);
          }}
          onAnswerOutcome={({ correct, namedMisconception }) => {
            handleReelOutcome(currentReel, correct, namedMisconception);
          }}
          onReactionSpoken={() => {
            if (currentReel.kind !== 'win_closer') advance();
          }}
          onTeachMore={() => {
            if (currentReel.lessonId && currentReel.lessonId !== 'closer') {
              setActiveLesson(currentReel.lessonId);
            }
          }}
          onSkip={advance}
        />
        <div className="fixed bottom-24 left-0 right-0 z-20 flex justify-center pointer-events-none">
          <div className="text-[12px] text-slate-500 bg-slate-950/70 px-3 py-1 rounded-full">
            {cursor + 1} / {queue!.length}
          </div>
        </div>
        {activeLesson && (
          <TeachingSessionModal lessonId={activeLesson} onClose={() => setActiveLesson(null)} />
        )}
      </div>
    );
  }

  return (
    <div className="mn-feed-surface flex-1 min-h-0 overflow-y-auto snap-y snap-mandatory text-white" dir={isAr ? 'rtl' : 'ltr'}>
      <section className="min-h-full snap-start flex flex-col justify-center px-5 py-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-violet-950 via-slate-950 to-slate-950" />
        <div className="relative z-10 max-w-md mx-auto w-full">
          <div className="flex items-center justify-center gap-2 text-amber-300 text-sm font-black mb-4">
            <Sparkles className="w-4 h-4" />
            <span>{isAr ? 'نور دخلت معاكِ الحصة' : isFr ? 'Noor t\'accompagne dans la leçon' : 'Noor is teaching you now'}</span>
          </div>
          <div className="mx-auto max-w-sm rounded-[2rem] bg-white/10 backdrop-blur-xl border border-white/15 p-5 text-center">
            <p className="text-lg font-black leading-relaxed">
              {isAr
                ? `"يلا يا ${student?.name || ''} — هوريكي حاجة، وبعدها عايزة أشوفك بتفكري إزاي."`
                : isFr
                ? `« Allez ${student?.name || ''} — je te montre quelque chose, puis je veux voir comment tu réfléchis. »`
                : `“Come on, ${student?.name || ''}. Watch what I’m showing you, then show me how you think.”`}
            </p>
          </div>
          <div className="mt-6 flex items-center justify-center gap-2 text-slate-500 text-xs">
            <ArrowDown className="w-4 h-4 animate-bounce" />
            <span>{isAr ? 'اسحبي لأعلى — نور هتكمّل معاكي خطوة بخطوة' : isFr ? 'Glisse vers le haut — Noor t\'accompagne pas à pas' : 'Swipe up — Noor will guide you step by step'}</span>
          </div>
        </div>
      </section>

      {feed.length === 0 ? (
        <section className="min-h-full snap-start flex items-center px-6">
          <div className="max-w-md mx-auto w-full rounded-3xl bg-white/10 border border-white/10 p-6">
            <BookOpen className="w-8 h-8 text-indigo-300 mb-3" />
            <h2 className="text-xl font-black">{isAr ? 'نور محتاجة تعرف درس النهارده' : isFr ? 'Noor a besoin de la leçon du jour' : 'Noor needs today’s school lesson first'}</h2>
            <p className="text-sm text-slate-300 mt-2">{isAr ? 'افتحي الرئيسية وسجلي اللي حصل في المدرسة.' : isFr ? 'Ouvre l\'Accueil et dis à Noor ce qui s\'est passé à l\'école.' : 'Open Home and tell Noor what happened at school.'}</p>
            <button onClick={() => setActiveTab('home')} className="mt-5 px-4 py-2.5 rounded-2xl bg-white text-slate-950 text-sm font-black">
              {isAr ? 'الصفحة الرئيسية' : isFr ? 'Accueil' : 'Go Home'}
            </button>
          </div>
        </section>
      ) : (
        feed.map((card) => (
          <section key={card.id} className="min-h-full snap-start flex items-center px-5 py-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-slate-950 via-indigo-950/50 to-slate-950" />
            <div className="relative z-10 max-w-md mx-auto w-full">
              <div className="flex items-end justify-center gap-3 mb-4">
                <div className="mb-5 max-w-[68%] rounded-2xl rounded-bl-md bg-white text-slate-900 px-4 py-3 shadow-xl">
                  <div className="flex items-center gap-1.5 text-violet-600 text-[10px] font-black uppercase tracking-wider mb-1">
                    <MessageCircle className="w-3 h-3" />
                    <span>{isAr ? 'نور' : 'Noor'}</span>
                  </div>
                  <p className="text-sm font-bold leading-relaxed">
                    {card.kind === 'mission'
                      ? (isAr ? 'تعالي نجرب دي. بعد كده هسألك إنتِ فكرتي إزاي.' : isFr ? 'Essayons ceci. Ensuite je te demanderai comment tu as réfléchi.' : 'Let’s try this. Then I’ll ask you how you thought about it.')
                      : (isAr ? 'أنا عايزة أشرحلك الدرس ده بطريقتنا، مش مجرد تقريه.' : isFr ? 'Je veux t\'expliquer cette leçon à notre façon, pas seulement te la montrer.' : 'I want to teach this with you, not just show you the page.')}
                  </p>
                </div>
              </div>

              {card.kind === 'mission' ? (
                <div className="rounded-[2rem] bg-white/10 backdrop-blur-xl border border-white/15 p-6 shadow-2xl">
                  <div className="text-[11px] uppercase tracking-widest text-amber-300 font-black mb-3">{card.purpose}</div>
                  <h2 className="text-3xl font-black leading-tight">{card.mission.title}</h2>
                  <p className="text-slate-300 text-sm mt-3">{card.mission.whyNow}</p>
                  <button onClick={() => runMission(card.mission)} className="mt-7 w-full rounded-2xl bg-white text-slate-950 py-3 font-black flex items-center justify-center gap-2">
                    <Play className="w-4 h-4" /> {isAr ? 'يلا نبدأ' : isFr ? 'Commençons' : 'Let’s learn'}
                  </button>
                </div>
              ) : (
                <div className="rounded-[2rem] bg-white/10 backdrop-blur-xl border border-white/15 p-6 shadow-2xl">
                  <div className="text-[11px] uppercase tracking-widest text-cyan-300 font-black mb-3">{card.purpose}</div>
                  <div className="text-xs text-slate-500">{card.subject}</div>
                  <h2 className="text-3xl font-black leading-tight mt-2">{card.title}</h2>
                  <p className="text-slate-300 text-sm mt-3">{isAr ? 'نور هتبدأ معاكِ، تسألك، تسمع تفكيرك، وتغيّر الشرح حسب إجابتك.' : isFr ? 'Noor va t\'accompagner, te questionner, écouter ton raisonnement et adapter l\'explication.' : 'Noor will teach, question you, listen to your reasoning, and adapt.'}</p>
                  <div className="mt-6 flex items-center justify-between gap-3">
                    <button onClick={() => setActiveLesson(card.lessonId)} className="flex-1 rounded-2xl bg-white text-slate-950 py-3 font-black flex items-center justify-center gap-2">
                      <BookOpen className="w-4 h-4" /> {isAr ? 'اتعلمي مع نور' : isFr ? 'Apprendre avec Noor' : 'Learn with Noor'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        ))
      )}

      {activeLesson && (
        <TeachingSessionModal lessonId={activeLesson} onClose={() => setActiveLesson(null)} />
      )}

      {activeMission && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3">
          <div className="w-full max-w-lg h-[90vh] bg-white dark:bg-slate-900 rounded-3xl overflow-hidden relative">
            <button onClick={() => setActiveMission(null)} className="absolute right-3 top-3 z-10 p-2 rounded-full bg-slate-900/80 text-white"><X className="w-4 h-4" /></button>
            {activeMission.type === 'homework' ? (
              <HomeworkRunner mission={activeMission} onComplete={() => setActiveMission(null)} onSkip={() => setActiveMission(null)} onClose={() => setActiveMission(null)} />
            ) : activeMission.lessonId ? (
              <TeachingSessionModal lessonId={activeMission.lessonId} onClose={() => setActiveMission(null)} />
            ) : (
              <QuizRunner mission={activeMission} onComplete={() => setActiveMission(null)} onSkip={() => setActiveMission(null)} onExplainDifferently={() => setActiveMission(null)} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
