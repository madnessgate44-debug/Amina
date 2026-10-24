/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Mission, OfficialCurriculumLesson, SchoolDayKey } from '../../types';
import { curriculumService } from '../../services/curriculum/curriculumService';
import { NourCharacter } from '../stage/NourCharacter';
import { DayRecordFlowModal } from '../dayRecord/DayRecordFlowModal';
import { EditDayRecordModal } from '../dayRecord/EditDayRecordModal';
import { ConfirmedDayRecordCard } from '../dayRecord/ConfirmedDayRecordCard';
import { WelcomeHomeCard } from '../dayRecord/WelcomeHomeCard';
import { MissionRunnerModal } from '../missions/MissionRunnerModal';
import { MissionList } from '../missions/MissionList';
import { StageModal } from '../stage/StageModal';
import { DailyReviewModal } from './DailyReviewModal';
import { Badge } from '../common/Badge';
import { getEffectiveTimeOfDay, localTimeStr } from '../../utils/time';
import {
  Sparkles,
  Clock,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  CheckCircle,
  AlertCircle,
  Sun,
  Moon,
  PlusCircle,
  RotateCcw,
  Sliders,
  Shield,
  X,
  Bot,
  Play,
  Calendar,
  CheckCircle2,
  Heart,
  MessageCircle,
  Star,
  Flame,
} from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const {
    t,
    language,
    student,
    timetable,
    settings,
    currentDayRecord,
    missionsForToday,
    activeMission,
    activeMissionRunnerOpen,
    plannerExplanation,
    startMission,
    closeMissionRunner,
    regenerateMissionsForToday,
    saveDayRecord,
    setActiveTab,
    currentDailyReview,
    isDailyReviewOpen,
    openDailyReview,
    closeDailyReview,
    dueReviewNudges,
    gentleCompanionNudge,
    dismissGentleNudge,
    setCompanionContext,
    gamification,
    upcomingExams,
  } = useApp();

  const isArabic = language === 'ar';
  const isFrench = language === 'fr';

  const [showReconstructionModal, setShowReconstructionModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState<number>(45);
  const [isStageOpen, setIsStageOpen] = useState(false);
  const defaultStageLessonId = curriculumService.getAvailableLessons()[0]?.id || curriculumService.getAllLessons()[0]?.id || '';
  const [activeStageLessonId, setActiveStageLessonId] = useState<string>(defaultStageLessonId);

  const studentName = student?.name || '';
  const gradeLabel = student?.grade || (isArabic ? 'الصف الخامس الابتدائي 🇪🇬' : 'Grade 5 Primary 🇪🇬');

  // Determine current day of week
  const currentDayIndex = new Date().getDay();
  const dayKeyMap: Record<number, SchoolDayKey> = {
    0: 'sunday',
    1: 'monday',
    2: 'tuesday',
    3: 'wednesday',
    4: 'thursday',
  };
  const todayKey: SchoolDayKey | null = dayKeyMap[currentDayIndex] ?? null;
  const todaySchedule = todayKey ? timetable?.days.find((d) => d.day === todayKey) : undefined;

  // Phase 5d: nearest parent-entered exam, if any. No dates are invented.
  const nextExam = upcomingExams[0];

  const isPostSchool = getEffectiveTimeOfDay(settings) === 'after_school';
  const hasConfirmedDayRecord = Boolean(currentDayRecord && currentDayRecord.confirmed);

  // Compute Next Action Mission
  const nextPendingMission: Mission | undefined = missionsForToday.find(
    (m) => m.status === 'pending' || m.status === 'started'
  );
  const completedMissionsCount = missionsForToday.filter((m) => m.status === 'completed').length;
  const allMissionsDone = missionsForToday.length > 0 && completedMissionsCount === missionsForToday.length;

  const curriculumBooks = curriculumService.getSubjectsSummary();

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-5 max-w-lg mx-auto w-full pb-24 space-y-4" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* 1. Header Greeting & Status Bar */}
      <div className="p-4 rounded-3xl bg-linear-to-br from-indigo-700 via-indigo-800 to-purple-900 text-white shadow-xl shadow-indigo-950/20 relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -left-8 -bottom-8 w-28 h-28 bg-indigo-400/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full font-bold">
                {t.app.title}
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950 shadow-xs">
                {gradeLabel}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs bg-black/25 px-2.5 py-1 rounded-full text-indigo-100 font-mono">
              <Clock className="w-3.5 h-3.5" />
              <span dir="ltr">{settings.demoTimeSimulatorActive ? settings.simulatedTime : localTimeStr()}</span>
            </div>
          </div>

          {gamification && (
            <div className="flex items-center gap-2 text-[12px] font-black">
              <span className="flex items-center gap-1 bg-black/25 px-2.5 py-1 rounded-full text-amber-300">
                <Star className="w-3.5 h-3.5" />
                {gamification.xp} XP
              </span>
              <span className="flex items-center gap-1 bg-black/25 px-2.5 py-1 rounded-full text-orange-300">
                <Flame className="w-3.5 h-3.5" />
                {gamification.streak.currentDays}
                {gamification.streak.isPaused && (isArabic ? ' (راحة)' : ' (rest)')}
              </span>
            </div>
          )}

          <div>
            <h1 className="text-xl font-black tracking-tight flex items-center gap-1.5">
              <span>{isFrench ? 'Bienvenue' : t.home.welcome} {studentName}!</span>
              <span className="text-amber-300">👋</span>
            </h1>
            <p className="text-xs text-indigo-200 mt-0.5">
              {isArabic
                ? 'رفيقكِ ومعلمتكِ الذكية لتنظيم يومك والمذاكرة خطوة بخطوة بدون ضغط'
                : isFrench ? 'Ton enseignante IA personnelle pour apprendre sereinement, à ton rythme' : 'Your personal AI teacher & companion for relaxed, joyful learning'}
            </p>
          </div>

        </div>
      </div>

      {/* Phase 5d: Today with Noor + parent-entered exam countdown */}
      <section className="space-y-2">
        <button
          onClick={() => setActiveTab('feed')}
          className="w-full rounded-3xl bg-linear-to-br from-violet-600 via-purple-700 to-indigo-800 text-white p-4 shadow-lg flex items-center gap-3 text-start"
        >
          <span className="p-2.5 rounded-2xl bg-white/15 shrink-0">
            <Play className="w-5 h-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-base font-black">
              {isArabic ? 'حصة النهارده مع نور' : isFrench ? 'La leçon du jour avec Noor' : 'Today with Noor'}
            </span>
            <span className="block text-[12px] text-indigo-200 mt-0.5">
              {isArabic
                ? 'دقايق قليلة، درس واحد، وسؤال واحد بس'
                : isFrench ? 'Quelques minutes, une idée, une seule question' : 'A few minutes, one idea, one quick question'}
            </span>
          </span>
          <ArrowRight className="w-5 h-5 shrink-0 rtl:rotate-180" />
        </button>

        {nextExam && (
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 flex items-center gap-3">
            <span className="p-2 rounded-2xl bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 shrink-0">
              <Calendar className="w-4 h-4" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-black text-slate-500 dark:text-slate-400">
                {isArabic ? 'امتحان قريب' : isFrench ? 'Examen à venir' : 'Upcoming exam'}
              </div>
              <div className="text-sm font-black text-slate-900 dark:text-slate-100 truncate">
                {nextExam.entry.topic || nextExam.entry.subjectId}
              </div>
            </div>
            <div className="text-end shrink-0">
              <div className="text-xl font-black text-rose-600 dark:text-rose-400 leading-none">{nextExam.daysUntil}</div>
              <div className="text-[10px] font-bold text-slate-500">
                {nextExam.daysUntil === 0
                  ? (isArabic ? 'النهاردة' : isFrench ? "aujourd'hui" : 'today')
                  : nextExam.daysUntil === 1
                  ? (isArabic ? 'يوم' : isFrench ? 'jour' : 'day')
                  : (isArabic ? 'يوم' : isFrench ? 'jours' : 'days')}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 2. THE MAIN "WHAT SHOULD I DO NOW?" HERO SECTION */}
      <section className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
            <span>{isArabic ? 'ماذا أفعل الآن يا مس نور؟' : isFrench ? 'Que dois-je faire maintenant, Maîtresse Noor ?' : 'What Should I Do Now, Miss Noor?'}</span>
          </span>

        </div>

        {/* STATE A: Need School Day Reconstruction */}
        {isPostSchool && !hasConfirmedDayRecord && (
          <div className="rounded-3xl bg-linear-to-br from-amber-500 via-amber-600 to-orange-600 text-slate-950 p-4 sm:p-5 shadow-lg relative overflow-hidden space-y-3 border-2 border-amber-300/60">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-950 text-amber-400 rounded-2xl shadow-md">
                  <NourCharacter state="excited" outfit="arabic" size="sm" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-950 text-white">
                    {isArabic ? 'الخطوة الأولى والأهم' : isFrench ? 'Action prioritaire' : 'Top Priority Action'}
                  </span>
                  <h2 className="text-base sm:text-lg font-black text-slate-950 mt-1">
                    {isArabic ? `حمد الله على سلامتك يا ${studentName}!` : `Welcome home, ${studentName}!`}
                  </h2>
                </div>
              </div>
            </div>

            <div className="bg-slate-950/10 rounded-2xl p-3 backdrop-blur-xs text-xs sm:text-sm font-bold text-slate-950 leading-relaxed">
              <p>
                {isArabic
                  ? '«طمنيني يا بطلة.. إيه اللي حصل في المدرسة النهارده؟ أخدتي إيه في كل مادة؟ وإيه الواجب المطلوب؟»'
                  : `"Tell me ${studentName}, what happened at school today? What did you cover in each subject? Any homework?"`}
              </p>
            </div>

            <p className="text-[11px] text-slate-950/80 font-medium">
              💡 {isArabic ? 'السبب: عشان أفهم يومك وأجهز لك خطة مذاكرة ذكية مخصصة ليكي توفر وقتك.' : 'Why: So I can build your personalized study plan and save your time.'}
            </p>

            <button
              type="button"
              onClick={() => setShowReconstructionModal(true)}
              className="w-full py-3.5 px-4 rounded-2xl bg-slate-950 hover:bg-slate-900 active:scale-[0.99] text-amber-400 font-black text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{isArabic ? 'سجلي يومك مع نور صوتياً أو كتابةً 🎙️' : 'Report My Day with Noor (Voice/Text) 🎙️'}</span>
              {isArabic ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        )}

        {/* STATE B: Personalized Study Plan is Ready & Next Mission is Queued */}
        {(hasConfirmedDayRecord || !isPostSchool) && nextPendingMission && (
          <div className="rounded-3xl bg-linear-to-br from-indigo-900 via-indigo-950 to-purple-950 text-white p-4 sm:p-5 shadow-xl border-2 border-indigo-400/50 space-y-3.5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950 shadow-xs">
                  {nextPendingMission.type === 'homework'
                    ? (isArabic ? '✍️ واجب اليوم' : isFrench ? '✍️ Devoirs du jour' : "✍️ Today's homework")
                    : nextPendingMission.type === 'understand_lesson'
                    ? (isArabic ? '👩‍🏫 شرح درس' : isFrench ? '👩‍🏫 Explication de leçon' : '👩‍🏫 Lesson explanation')
                    : (isArabic ? '🎯 تطبيق وتدريب' : isFrench ? '🎯 Pratique et entraînement' : '🎯 Practice and drill')}
                </span>
                <span className="text-[10px] font-bold text-indigo-200">
                  {nextPendingMission.subject}
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-amber-300">
                <Clock className="w-3.5 h-3.5" />
                <span>{nextPendingMission.estimatedMinutes} {isArabic ? 'دقيقة' : 'min'}</span>
              </div>
            </div>

            {/* Teacher Voice Dialogue */}
            <div className="flex items-center gap-3">
              <div className="shrink-0 p-1.5 rounded-2xl bg-white/10 border border-white/15">
                <NourCharacter state="talking" outfit="arabic" size="sm" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-black text-white leading-tight">
                  {nextPendingMission.title}
                </h3>
                <p className="text-[11px] text-indigo-200 leading-snug">
                  {nextPendingMission.whyNow ? (
                    <span>💡 {isArabic ? 'لماذا الآن؟ ' : 'Why now? '}{nextPendingMission.whyNow}</span>
                  ) : (
                    <span>💡 {nextPendingMission.type === 'homework'
                      ? (isArabic ? 'واجب تم تسجيله اليوم ويجب إنهاؤه لتفادي التراكم.' : 'Homework due soon to keep your progress clear.')
                      : (isArabic ? 'تثبيت هذا المفهوم خطوة حاسمة لفهم الدروس القادمة.' : 'Mastering this concept unlocks upcoming topics.')}
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="pt-1 flex gap-2">
              <button
                type="button"
                onClick={() => startMission(nextPendingMission)}
                className="flex-1 py-3.5 px-4 rounded-2xl bg-linear-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>{isArabic ? 'ابدئي هذه المهمة الآن 🚀' : 'Start This Mission Now 🚀'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const todayLessonsStr = currentDayRecord?.lessonsCovered?.map((l) => `${l.subject}: ${l.topic || ''}`).join(', ') || '';
                  setCompanionContext({
                    source: nextPendingMission.type === 'homework' ? 'homework' : 'home_next_action',
                    missionId: nextPendingMission.id,
                    lessonId: nextPendingMission.lessonId,
                    conceptId: nextPendingMission.conceptId,
                    subjectName: nextPendingMission.subject,
                    topic: nextPendingMission.title,
                    notes: nextPendingMission.whyNow,
                    whyNow: nextPendingMission.whyNow,
                    schoolDaySummary: todayLessonsStr,
                    reasonWhyRecommended: nextPendingMission.whyNow,
                  });
                  setActiveTab('companion');
                }}
                className="px-3.5 py-3.5 rounded-2xl bg-white/15 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center transition-all cursor-pointer"
                title={isArabic ? 'اسألي مس نور عن أي شيء' : 'Ask Miss Noor'}
              >
                <Bot className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STATE C: All Missions Done for Today */}
        {allMissionsDone && (
          <div className="rounded-3xl bg-linear-to-br from-emerald-600 via-teal-700 to-indigo-900 text-white p-4 sm:p-5 shadow-xl border border-emerald-400/40 space-y-3 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md mx-auto flex items-center justify-center text-3xl shadow-sm">
              ⭐
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-black">
                {isArabic ? `أحسنتِ يا بطلة يا ${studentName}! 🌟` : `Awesome Job ${studentName}! 🌟`}
              </h3>
              <p className="text-xs text-emerald-100 max-w-sm mx-auto">
                {isArabic
                  ? 'أتممتِ كل مهام وخطة المذاكرة لليوم بنجاح رائع. مستعدة للملخص السريع لغلق اليوم بهدوء؟'
                  : 'You have completed all planned missions for today. Ready for our quick daily wrap-up?'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => openDailyReview()}
              className="py-3 px-6 rounded-2xl bg-white text-emerald-950 font-black text-xs shadow-md hover:bg-emerald-50 transition-all inline-flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>{isArabic ? 'افتحي المراجعة الهادئة لليوم (Calm Review)' : 'Open Calm Daily Review'}</span>
            </button>
          </div>
        )}
      </section>

      {/* 3. CONFIRMED DAY SNAPSHOT (WHAT HAPPENED AT SCHOOL) */}
      {hasConfirmedDayRecord && currentDayRecord && (
        <ConfirmedDayRecordCard
          record={currentDayRecord}
          onEdit={() => setShowEditModal(true)}
        />
      )}

      {/* 4. TODAY'S STUDY PLAN QUEUE */}
      <section className="space-y-3">
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-600" />
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {isArabic ? 'وقت المذاكرة المتاح اليوم:' : isFrench ? 'Temps d’étude disponible :' : 'Available Study Time:'}
            </span>
            <select
              value={selectedDuration}
              onChange={(e) => {
                const val = Number(e.target.value);
                setSelectedDuration(val);
                regenerateMissionsForToday(val);
              }}
              className="bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-2 py-1 font-bold text-indigo-700 dark:text-indigo-300 focus:outline-hidden"
            >
              <option value={10}>{isArabic ? '١٠ دقائق (أدنى يوم فعال)' : '10 min (MVD)'}</option>
              <option value={20}>{isArabic ? '٢٠ دقيقة' : '20 min'}</option>
              <option value={35}>{isArabic ? '٣٥ دقيقة' : '35 min'}</option>
              <option value={45}>{isArabic ? '٤٥ دقيقة (افتراضي)' : '45 min'}</option>
              <option value={60}>{isArabic ? '٦٠ دقيقة' : '60 min'}</option>
            </select>
          </div>

          <button
            onClick={() => regenerateMissionsForToday(selectedDuration)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-700 transition-all"
            title={isArabic ? 'إعادة جدولة المهام' : 'Re-plan missions'}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mission List */}
        <MissionList
          missions={missionsForToday}
          onStartMission={(m) => startMission(m)}
        />
      </section>

      {/* 5. VIRTUAL BOOKSHELF QUICK ENTRY */}
      <section className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">📚</span>
            <div>
              <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100">
                {isArabic ? 'مدرستي — كتبي المدرسية' : isFrench ? 'Mon école — Manuels' : 'My School — Textbooks'}
              </h3>
              <p className="text-[10px] text-slate-400">
                {isArabic ? 'جميع كتب وزارة التربية والتعليم الرسمية والداعمة' : 'All official & supplementary curriculum books'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('learn')}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>{isArabic ? 'تصفح الرف كاملاً' : 'View Shelf'}</span>
            <span>←</span>
          </button>
        </div>

        {/* Scrollable Bookshelf Row displaying ALL subjects without arbitrarily hiding any */}
        <div className="flex items-stretch gap-2 overflow-x-auto pb-2 pt-0.5 scrollbar-thin">
          {curriculumBooks.map((b) => (
            <div
              key={b.subjectId}
              onClick={() => setActiveTab('learn')}
              className="min-w-[125px] w-[125px] p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-indigo-400 bg-slate-50 dark:bg-slate-750 transition-all cursor-pointer flex flex-col justify-between shrink-0 group hover:shadow-md"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-2xl group-hover:scale-110 transition-transform">{b.icon}</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-2xs">
                    {b.availableLessons} {isArabic ? 'دروس' : isFrench ? 'leçons' : 'lessons'}
                  </span>
                </div>
                <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 truncate pt-1">
                  {isArabic ? b.subjectNameAr : isFrench && b.subjectNameFr ? b.subjectNameFr : b.subjectNameEn}
                </h4>
                <p className="text-[9px] text-slate-400 truncate">
                  {isArabic ? b.bookTitleAr : isFrench && b.bookTitleFr ? b.bookTitleFr : b.bookTitleEn}
                </p>
              </div>

              <div className="pt-2 mt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                <span>{isArabic ? 'افتحي الكتاب' : 'Open'}</span>
                <span>←</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. PERSISTENT TALK TO MISS NOUR ACTION */}
      <button
        type="button"
        onClick={() => {
          const todayLessonsStr = currentDayRecord?.lessonsCovered?.map((l) => `${l.subject}: ${l.topic || ''}`).join(', ') || '';
          setCompanionContext({
            source: nextPendingMission ? (nextPendingMission.type === 'homework' ? 'homework' : 'home_next_action') : 'general',
            missionId: nextPendingMission?.id,
            lessonId: nextPendingMission?.lessonId,
            conceptId: nextPendingMission?.conceptId,
            subjectName: nextPendingMission?.subject,
            topic: nextPendingMission?.title,
            notes: nextPendingMission?.whyNow,
            whyNow: nextPendingMission?.whyNow,
            schoolDaySummary: todayLessonsStr,
            reasonWhyRecommended: nextPendingMission?.whyNow,
          });
          setActiveTab('companion');
        }}
        className="w-full p-4 rounded-3xl bg-linear-to-r from-indigo-600 via-indigo-700 to-purple-700 hover:from-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center justify-between shadow-lg shadow-indigo-600/20 transition-all group cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center group-hover:scale-105 transition-transform">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="text-left rtl:text-right">
            <span className="block font-black text-sm">{isArabic ? 'تحدثي مع المعلمة نور 👩‍🏫' : 'Talk with Miss Noor 👩‍🏫'}</span>
            <span className="block text-[10px] text-indigo-100 font-normal mt-0.5">
              {isArabic ? 'اسأليها عن أي درس أو مفهوم، صوتياً أو كتابة في أي وقت' : 'Ask her anything about lessons, voice or text'}
            </span>
          </div>
        </div>
        {isArabic ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
      </button>

      {/* Modals */}
      {showReconstructionModal && (
        <DayRecordFlowModal onClose={() => setShowReconstructionModal(false)} />
      )}

      {showEditModal && currentDayRecord && (
        <EditDayRecordModal
          record={currentDayRecord}
          onClose={() => setShowEditModal(false)}
          onSave={async (updated) => {
            await saveDayRecord(updated);
            setShowEditModal(false);
          }}
        />
      )}

      {activeMissionRunnerOpen && activeMission && (
        <MissionRunnerModal
          mission={activeMission}
          onClose={() => closeMissionRunner()}
        />
      )}

      {isDailyReviewOpen && currentDailyReview && (
        <DailyReviewModal
          review={currentDailyReview}
          onClose={() => closeDailyReview()}
        />
      )}

      {isStageOpen && (
        <StageModal
          lessonId={activeStageLessonId}
          onClose={() => setIsStageOpen(false)}
        />
      )}
    </div>
  );
};
