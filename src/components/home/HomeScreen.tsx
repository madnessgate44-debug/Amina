/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { SchoolDayKey } from '../../types';
import { WelcomeHomeCard } from '../dayRecord/WelcomeHomeCard';
import { ConfirmedDayRecordCard } from '../dayRecord/ConfirmedDayRecordCard';
import { DayRecordFlowModal } from '../dayRecord/DayRecordFlowModal';
import { EditDayRecordModal } from '../dayRecord/EditDayRecordModal';
import { MissionList } from '../missions/MissionList';
import { MissionRunnerModal } from '../missions/MissionRunnerModal';
import { DailyReviewModal } from './DailyReviewModal';
import { StageModal } from '../stage/StageModal';
import { NourCharacter } from '../stage/NourCharacter';
import { LessonStudyModal } from '../curriculum/LessonStudyModal';
import {
  CurriculumSubjectPickerModal,
  SUBJECT_METADATA,
} from '../curriculum/CurriculumSubjectPickerModal';
import { curriculumService } from '../../services/curriculum/curriculumService';
import { OfficialCurriculumLesson } from '../../types/teachingSession';
import {
  Bot,
  Calendar,
  Settings,
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
    setSelectedCurriculumLessonId,
  } = useApp();
  const isArabic = language === 'ar';

  const [showReconstructionModal, setShowReconstructionModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState<number>(45);
  const [isStageOpen, setIsStageOpen] = useState(false);

  // Curriculum & Lesson Picker States
  const [selectedSubjectForModal, setSelectedSubjectForModal] = useState<string>('subj_arabic');
  const [isSubjectPickerOpen, setIsSubjectPickerOpen] = useState(false);
  const [studyLessonModal, setStudyLessonModal] = useState<OfficialCurriculumLesson | null>(null);
  const [activeStageLessonId, setActiveStageLessonId] = useState<string>('off_ar_u1_l1_ana_astatee');

  const curriculumSubjects = curriculumService.getSubjectsSummary();

  const studentName = student?.name || (isArabic ? 'يا بطل' : 'Student');
  const gradeLabel = student?.grade || t.common.grade5;

  // Determine current day of week for Egypt timetable
  // (0 = Sunday, 1 = Monday, 2 = Tuesday, 3 = Wednesday, 4 = Thursday, 5 = Friday, 6 = Saturday)
  const currentDayIndex = new Date().getDay();
  const dayKeyMap: Record<number, SchoolDayKey> = {
    0: 'sunday',
    1: 'monday',
    2: 'tuesday',
    3: 'wednesday',
    4: 'thursday',
  };

  const todayKey = dayKeyMap[currentDayIndex] || 'sunday';
  const todaySchedule = timetable?.days.find((d) => d.day === todayKey);

  const isPostSchool = settings.simulatedTimeOfDay === 'after_school';
  const hasConfirmedDayRecord = currentDayRecord && currentDayRecord.confirmed;

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-5 max-w-lg mx-auto w-full pb-20 space-y-4">
      {/* Student Welcome Header Card */}
      <div className="p-4 rounded-3xl bg-linear-to-br from-indigo-600 to-indigo-800 text-white shadow-lg shadow-indigo-600/20 relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -left-8 -bottom-8 w-28 h-28 bg-indigo-400/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full font-medium">
                {t.app.title}
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950 shadow-xs">
                {isArabic ? 'الصف الخامس الابتدائي 🇪🇬' : 'Grade 5 Primary'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs bg-black/20 px-2.5 py-1 rounded-full text-indigo-100">
              <Clock className="w-3.5 h-3.5" />
              <span dir="ltr">{settings.simulatedTime}</span>
            </div>
          </div>

          <div>
            <h1 className="text-xl font-extrabold tracking-tight">
              {t.home.welcome} {studentName}! 👋
            </h1>
            <p className="text-xs text-indigo-100/90 mt-0.5">
              {gradeLabel} • {t.app.subtitle}
            </p>
          </div>

          <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              {!isPostSchool ? (
                <Sun className="w-4 h-4 text-amber-300" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-200" />
              )}
              <span className="font-medium text-[11px]">
                {!isPostSchool ? t.home.statusSchoolOngoing : t.home.statusSchoolEnded}
              </span>
            </div>
            <button
              onClick={() => setActiveTab('settings')}
              className="text-[10px] text-amber-200 underline font-semibold"
            >
              {t.app.demoControl}
            </button>
          </div>
        </div>
      </div>

      {/* VIRTUAL TEACHER HERO HUB — MISS NOUR'S INTERACTIVE PRESENCE */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-indigo-950 via-indigo-900 to-purple-950 text-white p-4 sm:p-5 shadow-xl border-2 border-indigo-400/50">
        <div className="absolute top-0 right-0 w-36 h-36 bg-amber-400/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-cyan-400/15 rounded-full blur-2xl pointer-events-none" />

        {/* Live Virtual Teacher Greeting Bar */}
        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-amber-950 flex items-center gap-1 shadow-xs">
                👩‍🏫 {isArabic ? 'معلمتكِ الافتراضية الذكية' : 'Your Virtual AI Teacher'}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/15 text-indigo-100 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>{isArabic ? 'المعلمة نور مستعدة!' : 'Miss Nour is Ready!'}</span>
              </span>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('companion')}
              className="text-[11px] font-black text-amber-300 hover:text-amber-200 underline cursor-pointer"
            >
              {isArabic ? 'دخول الفصل 🚪' : 'Enter Classroom 🚪'}
            </button>
          </div>

          {/* Teacher & Bubble Row */}
          <div className="flex items-center gap-3">
            {/* Clickable Nour Avatar */}
            <div
              onClick={() => {
                setActiveTab('companion');
              }}
              className="shrink-0 cursor-pointer flex flex-col items-center group"
              title={isArabic ? 'اضغطي لدخول فصل مس نور' : "Click to enter Miss Nour's class"}
            >
              <div className="p-2 rounded-2xl bg-white/10 group-hover:bg-white/20 transition-all border border-white/20 shadow-md">
                <NourCharacter
                  state="excited"
                  outfit="arabic"
                  size="sm"
                  className="group-hover:scale-110 transition-transform"
                />
              </div>
              <span className="text-[10px] font-bold text-amber-300 mt-1">
                {isArabic ? 'المعلمة نور 🌟' : 'Miss Nour 🌟'}
              </span>
            </div>

            {/* Speech Dialogue Bubble */}
            <div className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15 text-indigo-100 space-y-1">
              <p className="text-xs sm:text-sm font-black text-white leading-relaxed">
                {isArabic
                  ? `«أهلاً يا ${studentName}! كل كتب ومناهج الصف الخامس الابتدائي جاهزة؛ اختاري أي مادة وافتحي دروسها لنذاكر ونحل التمارين سوا!»`
                  : `"Hello ${studentName}! All your Grade 5 textbooks and lessons are ready. Choose any subject to start studying!"`}
              </p>
              <p className="text-[10px] text-amber-300 font-bold">
                {isArabic ? '✨ اختاري من الأزرار أو تصفحي رف الكتب بالأسفل:' : '✨ Choose from below or browse your bookshelf:'}
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              type="button"
              onClick={() => setActiveTab('companion')}
              className="p-2.5 rounded-2xl bg-linear-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 active:scale-95 text-slate-950 font-black text-[11px] shadow-md transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>👩‍🏫</span>
              <span>{isArabic ? 'فصل مس نور' : "Classroom"}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('learn')}
              className="p-2.5 rounded-2xl bg-white/20 hover:bg-white/30 active:scale-95 text-white font-black text-[11px] border border-white/20 shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>📚</span>
              <span>{isArabic ? 'كل المناهج' : 'Curriculum'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveStageLessonId('off_ar_u1_l1_ana_astatee');
                setIsStageOpen(true);
              }}
              className="p-2.5 rounded-2xl bg-white/15 hover:bg-white/25 active:scale-95 text-white font-black text-[11px] border border-white/20 shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>🎭</span>
              <span>{isArabic ? 'المسرح الحي' : 'Stage'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* GRADE 5 OFFICIAL CURRICULUM SHELF (ALL 8 BOOKS & SUBJECTS FOR AMINA) */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 shadow-xs border border-slate-200 dark:border-slate-700 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-lg font-black shadow-xs">
              📚
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <span>{isArabic ? 'مناهج وكتب الصف الخامس الابتدائي' : 'Grade 5 Official Curriculum'}</span>
                <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  {isArabic ? '٨ كتب معتمدة' : '8 Books'}
                </span>
              </h2>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                {isArabic
                  ? 'مناهج وزارة التربية والتعليم الرسمية — اختاري أي كتاب وافتحي دروسه كاملة'
                  : 'Official Egyptian Ministry Curriculum — pick any book to study its lessons'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('learn')}
            className="text-xs font-black text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5 cursor-pointer shrink-0"
          >
            <span>{isArabic ? 'تصفح الكل ←' : 'View All →'}</span>
          </button>
        </div>

        {/* 8 Books Shelf Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {curriculumSubjects.map((sub) => {
            const meta = SUBJECT_METADATA[sub.subjectId] || {
              icon: '📚',
              color: 'indigo',
              bgGradient: 'from-indigo-600 to-indigo-800',
              termLabel: 'الفصل الدراسي الأول',
            };

            return (
              <div
                key={sub.subjectId}
                onClick={() => {
                  setSelectedSubjectForModal(sub.subjectId);
                  setIsSubjectPickerOpen(true);
                }}
                className="p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50/80 dark:bg-slate-750 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 transition-all cursor-pointer flex flex-col justify-between group hover:shadow-md"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xl group-hover:scale-110 transition-transform">
                      {meta.icon}
                    </span>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-700">
                      {sub.availableLessons} {isArabic ? 'دروس' : 'les'}
                    </span>
                  </div>
                  <h3 className="text-xs font-black text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate">
                    {isArabic ? sub.subjectNameAr : sub.subjectNameEn}
                  </h3>
                  <p className="text-[9px] text-slate-500 dark:text-slate-400 truncate">
                    {isArabic ? sub.bookTitleAr : sub.bookTitleEn}
                  </p>
                </div>

                <div className="pt-2 mt-1.5 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                  <span>{isArabic ? 'افتح الدروس' : 'View'}</span>
                  <span>←</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PHASE 2 DELIVERABLE: Welcome Home Trigger / Confirmed Day Record */}
      {isPostSchool && !hasConfirmedDayRecord && (
        <WelcomeHomeCard onStartReconstruction={() => setShowReconstructionModal(true)} />
      )}

      {hasConfirmedDayRecord && (
        <ConfirmedDayRecordCard
          record={currentDayRecord}
          onEdit={() => setShowEditModal(true)}
        />
      )}

      {/* PHASE 5: TODAY'S MISSIONS LIST & TIME BUDGET CONTROLS */}
      <div className="space-y-3">
        {/* Time Budget Selector & Quick Re-plan Bar */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-600" />
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {isArabic ? 'وقت المذاكرة المتاح اليوم:' : 'Available time today:'}
            </span>
            <select
              value={selectedDuration}
              onChange={(e) => {
                const val = Number(e.target.value);
                setSelectedDuration(val);
                regenerateMissionsForToday(val);
              }}
              className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1 font-bold text-indigo-700 dark:text-indigo-300 focus:outline-hidden"
            >
              <option value={10}>{isArabic ? '١٠ دقائق (أدنى يوم فعال)' : '10 min (Minimum Viable Day)'}</option>
              <option value={20}>{isArabic ? '٢٠ دقيقة' : '20 min'}</option>
              <option value={35}>{isArabic ? '٣٥ دقيقة' : '35 min'}</option>
              <option value={45}>{isArabic ? '٤٥ دقيقة (افتراضي)' : '45 min (Default)'}</option>
              <option value={60}>{isArabic ? '٦٠ دقيقة' : '60 min'}</option>
            </select>
          </div>

          <button
            onClick={() => regenerateMissionsForToday(selectedDuration)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-all"
            title={isArabic ? 'إعادة جدولة المهام' : 'Re-plan missions'}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Dropped / Realistic Planner Notice (Failure path B) */}
        {plannerExplanation?.droppedMessage && (
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <p className="leading-snug">{plannerExplanation.droppedMessage}</p>
          </div>
        )}

        {/* Minimum Viable Day Notice (Failure path A) */}
        {plannerExplanation?.isMinimumViableDay && (
          <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/40 text-xs text-indigo-900 dark:text-indigo-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
            <p className="leading-snug">
              {isArabic
                ? 'وقتك محدود اليوم؟ جهزنا لك (اليوم الأدنى الفعال): مهمة واحدة فقط هي الأعلى أولوية لإبقاء الحماس مشتعلاً دون إجهاد!'
                : 'Limited time today? We activated "Minimum Viable Day": ONE top-priority mission to keep progress alive without burnout!'}
            </p>
          </div>
        )}

        {/* Parent Override Notice (Failure mode 1h: Student is informed, not silent) */}
        {plannerExplanation?.parentOverrideMessage && (
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-xs text-emerald-950 dark:text-emerald-200 flex items-start gap-2">
            <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold block mb-0.5">
                {isArabic ? 'إشعار توجيه ولي الأمر:' : 'Parent Setting Notice:'}
              </span>
              <p className="leading-snug">{plannerExplanation.parentOverrideMessage}</p>
            </div>
          </div>
        )}

        {/* 3x Rejection Gentle Nudge (Failure mode 1c: "Companion asks why once gently, planner drops, no nagging") */}
        {gentleCompanionNudge && (
          <div className="p-3.5 rounded-2xl bg-indigo-50/90 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-900/60 text-xs text-indigo-950 dark:text-indigo-200 flex items-start gap-2.5 shadow-xs">
            <Bot className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1">
              <span className="font-bold block text-indigo-900 dark:text-indigo-200">
                {isArabic ? 'سؤال لطيف من الرفيق:' : 'A Gentle Check-in from Companion:'}
              </span>
              <p className="leading-relaxed">{gentleCompanionNudge}</p>
            </div>
            <button
              onClick={() => dismissGentleNudge()}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              title={isArabic ? 'إغلاق الإشعار' : 'Dismiss notice'}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Gentle Overdue Review Nudge (Deliverable 1) */}
        {dueReviewNudges && dueReviewNudges.length > 0 && (
          <div className="p-3.5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/40 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span className="font-bold text-indigo-950 dark:text-indigo-200">
                  {isArabic ? 'تذكير لطيف لمراجعة المكتسبات' : 'Gentle Refresh Reminder'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('review')}
                className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
              >
                {isArabic ? 'عرض قسم المراجعة' : 'Open Review'}
              </button>
            </div>
            <p className="text-[11px] text-indigo-900/80 dark:text-indigo-300 leading-snug">
              {isArabic
                ? `حان موعد تنشيط بسيط لمفهوم (${dueReviewNudges[0].conceptNameAr}) لتثبيت الفهم في الذاكرة دون أي إرهاق.`
                : `Time for a gentle refresh on (${dueReviewNudges[0].conceptNameEn}) to keep understanding solid without effort.`}
            </p>
          </div>
        )}

        {/* Main Mission List */}
        <MissionList
          missions={missionsForToday}
          onStartMission={(m) => startMission(m)}
        />
      </div>

      {/* Talk to Companion Persistent Action */}
      <button
        type="button"
        onClick={() => setActiveTab('companion')}
        className="w-full p-4 rounded-3xl bg-linear-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-xs sm:text-sm flex items-center justify-between shadow-lg shadow-indigo-600/20 transition-all group"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center group-hover:scale-105 transition-transform">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="text-left rtl:text-right">
            <span className="block font-extrabold">{isArabic ? 'تحدث مع الرفيق الدراسي الذكي' : 'Talk to My Companion'}</span>
            <span className="block text-[10px] text-indigo-100 font-normal mt-0.5">
              {isArabic ? 'جاهز لمساعدتك في أي مهمة أو سؤال صوتياً أو كتابياً' : 'Ready to help with any task or question via voice or text'}
            </span>
          </div>
        </div>
        {isArabic ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
      </button>

      {/* If School is Ongoing (10:00 AM) note */}
      {!isPostSchool && (
        <div className="p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="text-[11px]">
              {isArabic
                ? 'المحاكي مضبوط على 10:00 صباحاً (ساعات المدرسة). لطلب استرجاع اليوم، بدّل المحاكي إلى 14:30.'
                : 'Simulator set to 10:00 AM (school hours). Switch to 14:30 to trigger the Welcome Home flow.'}
            </span>
          </div>
        </div>
      )}

      {/* Today's Timetable Preview Card */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-sky-600" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
              {t.home.todaySchedule} (
              {todaySchedule ? (isArabic ? todaySchedule.dayNameAr : todaySchedule.dayNameEn) : ''})
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('timetable')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>{isArabic ? 'الجدول كاملاً' : 'Full Timetable'}</span>
            {isArabic ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>

        {todaySchedule && todaySchedule.periods.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {todaySchedule.periods.slice(0, 4).map((p) => (
              <div
                key={p.id}
                className={`p-2.5 rounded-xl border text-xs flex flex-col justify-between ${
                  p.isBreak
                    ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 text-amber-800 dark:text-amber-200'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                  <span>{p.isBreak ? '☕' : `#${p.periodNumber}`}</span>
                  <span dir="ltr">{p.startTime}</span>
                </div>
                <span className="font-bold truncate text-[11px]">{p.subject}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-3 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
            {t.home.noSchoolToday}
          </div>
        )}
      </div>

      {/* PHASE 6: CALM DAILY REVIEW (End of Day Wrap-Up) */}
      <div className="p-4 rounded-3xl bg-linear-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 border border-indigo-200/80 dark:border-indigo-800/60 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                {isArabic ? 'المراجعة اليومية الهادئة (ملخص اليوم)' : 'Calm Daily Review (Wrap-Up)'}
              </h3>
              <p className="text-[10px] text-slate-500">
                {isArabic ? 'مراجعة خالية من اللوم لما أُنجز وما يحتاج عناية الغد' : 'Guilt-free review of achievements & next steps'}
              </p>
            </div>
          </div>
          <button
            onClick={() => openDailyReview()}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isArabic ? 'عرض المراجعة' : 'Open Review'}</span>
          </button>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setActiveTab('companion')}
          className="p-3.5 rounded-2xl bg-indigo-50/80 hover:bg-indigo-100/80 dark:bg-indigo-950/40 dark:hover:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/60 text-left rtl:text-right transition-all group shadow-xs flex flex-col justify-between"
        >
          <div className="p-2 w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-2">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
              {t.home.actionChat}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
              {isArabic ? 'تحدث مع الرفيق الذكي' : 'Converse with AI Companion'}
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('timetable')}
          className="p-3.5 rounded-2xl bg-sky-50/80 hover:bg-sky-100/80 dark:bg-sky-950/40 dark:hover:bg-sky-950/60 border border-sky-200/80 dark:border-sky-800/60 text-left rtl:text-right transition-all group shadow-xs flex flex-col justify-between"
        >
          <div className="p-2 w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center mb-2">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
              {t.home.actionTimetable}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
              {isArabic ? 'تعديل جدول الحصص' : 'Weekly Egyptian schedule'}
            </span>
          </div>
        </button>
      </div>

      {/* Phase 2 Verification & Roadmap Card */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
              {isArabic ? 'المرحلة 2: استرجاع وسجل اليوم مكتمل' : 'Phase 2: Day Record Active'}
            </h4>
          </div>
          <Badge variant="official">Phase 2 Active</Badge>
        </div>

        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
          {t.home.phase1Notice}
        </p>

        <div className="border-t border-slate-100 dark:border-slate-800 pt-2 space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider">
            {t.home.nextPhasesTitle}
          </span>
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
            <span>{t.home.phase2Preview}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
            <span>{t.home.phase3Preview}</span>
          </div>
        </div>
      </div>

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

      {/* PHASE 5: Active Mission Runner Modal */}
      {activeMissionRunnerOpen && activeMission && (
        <MissionRunnerModal
          mission={activeMission}
          onClose={closeMissionRunner}
        />
      )}

      {/* PHASE 6: Daily Review Modal */}
      {isDailyReviewOpen && currentDailyReview && (
        <DailyReviewModal
          review={currentDailyReview}
          onClose={closeDailyReview}
        />
      )}

      {/* PHASE 11: The Stage Modal */}
      {isStageOpen && (
        <StageModal
          lessonId={activeStageLessonId}
          onClose={() => setIsStageOpen(false)}
        />
      )}

      {/* Curriculum Subject & Lesson Picker Modal */}
      {isSubjectPickerOpen && (
        <CurriculumSubjectPickerModal
          isOpen={isSubjectPickerOpen}
          onClose={() => setIsSubjectPickerOpen(false)}
          initialSubjectId={selectedSubjectForModal}
          onSelectLesson={(lesson) => {
            setIsSubjectPickerOpen(false);
            setStudyLessonModal(lesson);
          }}
          title={isArabic ? 'اختر درساً للمذاكرة وحل التمارين' : 'Choose Lesson to Study'}
        />
      )}

      {/* Full Lesson Textbook Study & Exercises Modal */}
      {studyLessonModal && (
        <LessonStudyModal
          lesson={studyLessonModal}
          onClose={() => setStudyLessonModal(null)}
        />
      )}
    </div>
  );
};
