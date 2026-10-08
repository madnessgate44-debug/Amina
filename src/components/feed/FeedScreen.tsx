/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { curriculumService } from '../../services/curriculum/curriculumService';
import { Mission } from '../../types';
import { ReelViewer } from '../missions/ReelViewer';
import { QuizRunner } from '../missions/QuizRunner';
import { HomeworkRunner } from '../missions/HomeworkRunner';
import { TeachingSessionModal } from '../teaching/TeachingSessionModal';
import { SaveLikeButton } from '../collections/SaveLikeButton';
import { Play, BookOpen, Sparkles, ArrowDown, X } from 'lucide-react';

type FeedCard =
  | { kind: 'lesson'; id: string; title: string; subject: string; lessonId: string; purpose: string }
  | { kind: 'mission'; id: string; mission: Mission; purpose: string };

export const FeedScreen: React.FC = () => {
  const {
    language,
    student,
    missionsForToday,
    currentDayRecord,
    dueReviewNudges,
    setActiveTab,
    startMission,
  } = useApp();
  const isAr = language === 'ar';
  const isFr = language === 'fr';
  const [activeLesson, setActiveLesson] = useState<string | null>(null);
  const [activeMission, setActiveMission] = useState<Mission | null>(null);

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
          purpose: isAr ? 'ده اللي محتاجاه النهارده' : 'This is useful for you today',
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
          subject: isAr ? lesson.subjectNameAr : lesson.subjectNameEn,
          lessonId: lesson.id,
          purpose: isAr ? 'منهجك ودرس حقيقي' : 'From your real curriculum',
        });
      });

    dueReviewNudges.slice(0, 4).forEach((review) => {
      const found = curriculumService.getConceptById(review.conceptId);
      if (!found) return;
      cards.push({
        kind: 'lesson',
        id: `review-${review.conceptId}`,
        title: isAr ? found.concept.titleAr : found.concept.titleEn,
        subject: isAr ? found.lesson.subjectNameAr : found.lesson.subjectNameEn,
        lessonId: found.lesson.id,
        purpose: isAr ? 'وقت مراجعة ذكية' : 'A good time to review this',
      });
    });

    return cards;
  }, [missionsForToday, currentDayRecord, dueReviewNudges, isAr, isFr]);

  const runMission = (mission: Mission) => {
    startMission(mission);
    setActiveMission(mission);
  };

  return (
    <div className="h-[calc(100vh-64px)] overflow-y-auto snap-y snap-mandatory bg-slate-950 text-white" dir={isAr ? 'rtl' : 'ltr'}>
      <section className="min-h-full snap-start flex flex-col justify-center px-6 py-12 relative">
        <div className="absolute inset-0 bg-linear-to-b from-indigo-950 via-slate-950 to-slate-950" />
        <div className="relative z-10 max-w-md mx-auto w-full">
          <div className="flex items-center gap-2 text-amber-300 text-sm font-black mb-4">
            <Sparkles className="w-4 h-4" />
            <span>{isAr ? 'مع مس نور' : 'With Miss Nour'}</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight">
            {isAr ? 'جاهزة لحاجة صغيرة؟' : 'Ready for one small challenge?'}
          </h1>
          <p className="mt-3 text-slate-300 text-sm leading-relaxed">
            {isAr ? `يا ${student?.name || 'أمينة'}، انزلي لتحت وخلينا نتعلم حاجة مفيدة واحدة ورا التانية.` : `Amina, swipe through short learning moments. Every one has a reason to be here.`}
          </p>
          <div className="mt-8 flex items-center gap-2 text-slate-400 text-xs">
            <ArrowDown className="w-4 h-4 animate-bounce" />
            <span>{isAr ? 'اسحبي لأعلى' : 'Swipe up'}</span>
          </div>
        </div>
      </section>

      {feed.length === 0 ? (
        <section className="min-h-full snap-start flex items-center px-6">
          <div className="max-w-md mx-auto w-full rounded-3xl bg-white/10 border border-white/10 p-6">
            <BookOpen className="w-8 h-8 text-indigo-300 mb-3" />
            <h2 className="text-xl font-black">{isAr ? 'نور محتاجة تعرف درس النهارده' : 'Nour needs today’s school lesson first'}</h2>
            <p className="text-sm text-slate-300 mt-2">{isAr ? 'افتحي الرئيسية وسجلي اللي حصل في المدرسة.' : 'Open Home and tell Nour what happened at school.'}</p>
            <button onClick={() => setActiveTab('home')} className="mt-5 px-4 py-2.5 rounded-2xl bg-white text-slate-950 text-sm font-black">
              {isAr ? 'الصفحة الرئيسية' : 'Go Home'}
            </button>
          </div>
        </section>
      ) : (
        feed.map((card) => (
          <section key={card.id} className="min-h-full snap-start flex items-center px-5 py-10 relative">
            <div className="absolute inset-0 bg-linear-to-br from-slate-950 via-indigo-950/40 to-slate-950" />
            <div className="relative z-10 max-w-md mx-auto w-full">
              {card.kind === 'mission' ? (
                <div className="rounded-[2rem] bg-white/10 backdrop-blur-xl border border-white/15 p-6 shadow-2xl">
                  <div className="text-[11px] uppercase tracking-widest text-amber-300 font-black mb-3">{card.purpose}</div>
                  <h2 className="text-3xl font-black leading-tight">{card.mission.title}</h2>
                  <p className="text-slate-300 text-sm mt-3">{card.mission.description}</p>
                  <button onClick={() => runMission(card.mission)} className="mt-7 w-full rounded-2xl bg-white text-slate-950 py-3 font-black flex items-center justify-center gap-2">
                    <Play className="w-4 h-4" /> {isAr ? 'يلا نبدأ' : 'Let’s try it'}
                  </button>
                </div>
              ) : (
                <div className="rounded-[2rem] bg-white/10 backdrop-blur-xl border border-white/15 p-6 shadow-2xl">
                  <div className="text-[11px] uppercase tracking-widest text-cyan-300 font-black mb-3">{card.purpose}</div>
                  <div className="text-xs text-slate-400">{card.subject}</div>
                  <h2 className="text-3xl font-black leading-tight mt-2">{card.title}</h2>
                  <p className="text-slate-300 text-sm mt-3">{isAr ? 'افتحي الدرس مع نور وخلّيها تشرح حسب إجابتك.' : 'Open the lesson with Nour and let her adapt to your answers.'}</p>
                  <div className="mt-6 flex items-center justify-between gap-3">
                    <SaveLikeButton sourceId={card.lessonId} type="lesson" title={card.title} subject={card.subject} />
                    <button onClick={() => setActiveLesson(card.lessonId)} className="flex-1 rounded-2xl bg-white text-slate-950 py-3 font-black flex items-center justify-center gap-2">
                      <BookOpen className="w-4 h-4" /> {isAr ? 'اتعلمي مع نور' : 'Learn with Nour'}
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
            ) : activeMission.type === 'reel' ? (
              <ReelViewer mission={activeMission} onComplete={() => setActiveMission(null)} onSkip={() => setActiveMission(null)} />
            ) : (
              <QuizRunner mission={activeMission} onComplete={() => setActiveMission(null)} onSkip={() => setActiveMission(null)} onExplainDifferently={() => setActiveMission(null)} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
