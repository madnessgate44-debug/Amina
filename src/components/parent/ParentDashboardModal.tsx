/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { generateParentWeeklySummary } from '../../services/parent/parentService';
import { storageService } from '../../services/storage';
import { curriculumService } from '../../services/curriculum/curriculumService';
import { TeachingSession, TeachingModality } from '../../types/teachingSession';
import {
  Shield,
  Clock,
  Moon,
  Volume2,
  VolumeX,
  X,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Award,
  BookOpen,
  Calendar,
  Lock,
  Sparkles,
  HelpCircle,
  Layers,
  GraduationCap,
} from 'lucide-react';

interface ParentDashboardModalProps {
  onClose: () => void;
}

export const ParentDashboardModal: React.FC<ParentDashboardModalProps> = ({ onClose }) => {
  const {
    student,
    parentAccount,
    masteryRecords,
    missionsForToday,
    currentDayRecord,
    exitParentMode,
    updateParentPrefs,
    unlinkParent,
    language,
    t,
  } = useApp();

  const isAr = language === 'ar';

  // Build safe weekly summary (strictly no raw answers, no transcripts)
  const summary = generateParentWeeklySummary({
    student: student || ({ id: 'demo_student', name: 'الطالب', grade: 'الصف الخامس' } as any),
    dayRecords: currentDayRecord ? [currentDayRecord] : [],
    masteryRecords,
    completedMissions: missionsForToday.filter((m) => m.status === 'completed'),
    homeworkItems: currentDayRecord?.homeworkAssigned || [],
    language,
  });

  const [activeTab, setActiveTab] = useState<'summary' | 'sessions' | 'controls'>('summary');
  const [teachingSessions, setTeachingSessions] = useState<TeachingSession[]>([]);

  useEffect(() => {
    async function loadSessions() {
      const studentId = student?.id || 'demo_student';
      const list = await storageService.getTeachingSessionsForStudent(studentId);
      setTeachingSessions(
        [...list].sort(
          (a, b) => new Date(b.lastActiveAt).getTime() - new Date(a.lastActiveAt).getTime()
        )
      );
    }
    loadSessions();
  }, [student?.id]);

  const getModalityLabel = (modality: TeachingModality) => {
    switch (modality) {
      case 'source_explanation':
        return isAr ? 'شرح نص الكتاب' : 'Book Text';
      case 'daily_life_example':
        return isAr ? 'مثال حياتي' : 'Daily Example';
      case 'story_analogy':
        return isAr ? 'تشبيه وقصة' : 'Analogy';
      case 'structured_visual':
        return isAr ? 'رسم تخطيطي' : 'Visual SVG';
      case 'break_prerequisite':
        return isAr ? 'تبسيط تمهيدي' : 'Prerequisite';
      case 'flag_for_review':
        return isAr ? 'مراجعة هادئة' : 'Flagged';
      default:
        return modality;
    }
  };

  // Action states (PIN required for saving changes)
  const prefs = parentAccount?.preferences || {
    defaultAvailableMinutesPerDay: 45,
    bedtime: '21:30',
    bedtimeEnforced: true,
    voiceEnabledGlobally: true,
  };

  const [availableMinutes, setAvailableMinutes] = useState<number>(
    prefs.defaultAvailableMinutesPerDay || 45
  );
  const [bedtime, setBedtime] = useState<string>(prefs.bedtime || '21:30');
  const [bedtimeEnforced, setBedtimeEnforced] = useState<boolean>(
    prefs.bedtimeEnforced ?? true
  );
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(
    prefs.voiceEnabledGlobally ?? true
  );

  const [pinPromptOpen, setPinPromptOpen] = useState<boolean>(false);
  const [actionPin, setActionPin] = useState<string>('');
  const [actionError, setActionError] = useState<string | null>(null);
  const [pendingActionType, setPendingActionType] = useState<'save_prefs' | 'unlink' | null>(null);

  const triggerSavePrefs = () => {
    setPendingActionType('save_prefs');
    setActionError(null);
    setPinPromptOpen(true);
  };

  const triggerUnlink = () => {
    setPendingActionType('unlink');
    setActionError(null);
    setPinPromptOpen(true);
  };

  const handleConfirmPinAction = async () => {
    if (!actionPin) {
      setActionError(isAr ? 'يرجى إدخال رمز المرور السري.' : 'Please enter PIN.');
      return;
    }

    if (pendingActionType === 'save_prefs') {
      const ok = await updateParentPrefs(actionPin, {
        defaultAvailableMinutesPerDay: availableMinutes,
        bedtime,
        bedtimeEnforced,
        voiceEnabledGlobally: voiceEnabled,
      });

      if (ok) {
        setPinPromptOpen(false);
        setActionPin('');
      } else {
        setActionError(isAr ? 'رمز المرور غير صحيح.' : 'Incorrect PIN.');
      }
    } else if (pendingActionType === 'unlink') {
      const ok = await unlinkParent(actionPin);
      if (ok) {
        setPinPromptOpen(false);
        onClose();
      } else {
        setActionError(isAr ? 'رمز المرور غير صحيح.' : 'Incorrect PIN.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 bg-linear-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-black tracking-tight">
                  {isAr ? 'لوحة ولي الأمر (للقراءة فقط)' : 'Parent Dashboard (Read-Only Summary)'}
                </h3>
                <span className="text-[9px] bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded-full font-bold">
                  {isAr ? 'إشراف معتمد' : 'Verified'}
                </span>
              </div>
              <p className="text-[10px] text-slate-300">
                {parentAccount?.parentName} • {parentAccount?.parentEmail}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              exitParentMode();
              onClose();
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-800/40 p-1.5 gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('summary')}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'summary'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{isAr ? 'ملخص الأسبوع' : 'Weekly Summary'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sessions')}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'sessions'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>{isAr ? 'جلسات التدريس' : 'Teaching Sessions'}</span>
            {teachingSessions.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold flex items-center justify-center">
                {teachingSessions.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('controls')}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'controls'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{isAr ? 'التحكم والتفضيلات' : 'Controls'}</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-4 overflow-y-auto">
          {/* Transparency & Boundaries Banner */}
          <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed flex items-start gap-2">
            <Shield className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
            <p>
              {isAr
                ? '🛡️ خصوصية الطالب مصونة: تعرض هذه اللوحة ملخص الأداء العام والواجبات المنجزة، ولا تسمح بالاطلاع على المحادثات الخاصة مع الرفيق أو تفاصيل الأخطاء الفردية.'
                : '🛡️ Student privacy guaranteed: This dashboard displays high-level weekly summaries and homework status without surveillance of private chats or raw mistakes.'}
            </p>
          </div>

          {/* TAB 1: WEEKLY SUMMARY */}
          {activeTab === 'summary' && (
            <>
              {/* SECTION 1: OVERALL PROGRESS SUMMARY (THIS WEEK) */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{isAr ? 'ملخص الأسبوع الحالي' : 'Weekly Progress Summary'} ({summary.weekRange})</span>
                </h4>

                <div className="grid grid-cols-3 gap-2">
                  <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 text-center">
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 block font-bold">
                      {isAr ? 'دروس مسجلة' : 'Lessons Logged'}
                    </span>
                    <span className="text-lg font-black text-indigo-900 dark:text-indigo-100">
                      {summary.lessonsCoveredCount}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 text-center">
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-bold">
                      {isAr ? 'إنجاز الواجبات' : 'Homework'}
                    </span>
                    <span className="text-lg font-black text-emerald-900 dark:text-emerald-100">
                      {summary.homeworkCompletedCount} / {summary.homeworkTotalCount}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/40 text-center">
                    <span className="text-[10px] text-sky-600 dark:text-sky-400 block font-bold">
                      {isAr ? 'مراجعات قادمة' : 'Upcoming Reviews'}
                    </span>
                    <span className="text-lg font-black text-sky-900 dark:text-sky-100">
                      {summary.upcomingReviewsCount}
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 2: SUBJECTS NEEDING ATTENTION */}
              <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 space-y-1.5">
                <h5 className="text-[11px] font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>{isAr ? 'المواد التي تحتاج اهتماماً ومراجعة هادئة:' : 'Subjects Needing Gentle Attention:'}</span>
                </h5>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {summary.subjectsNeedingAttention.map((sub, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-xl text-xs font-bold bg-amber-100 dark:bg-amber-900/50 text-amber-900 dark:text-amber-200"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>

              {/* SECTION 3: RECENT ACHIEVEMENTS (SPECIFIC, NOT GAMIFIED) */}
              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                <h5 className="text-[11px] font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{isAr ? 'إنجازات ونجاحات ملموسة هذا الأسبوع:' : 'Recent Achievements This Week:'}</span>
                </h5>
                <ul className="space-y-1.5">
                  {summary.recentAchievements.map((ach, i) => (
                    <li key={i} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{ach}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* SECTION 4: ONE RECOMMENDED ACTION FOR PARENT */}
              <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/40 space-y-1">
                <h5 className="text-[11px] font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  <span>{isAr ? 'إجراء مقترح لولي الأمر:' : 'Recommended Action for Parent:'}</span>
                </h5>
                <p className="text-xs text-indigo-800 dark:text-indigo-300 leading-relaxed">
                  {summary.recommendedAction}
                </p>
              </div>
            </>
          )}

          {/* TAB 2: SUB-PHASE 9.5 TEACHING SESSIONS VIEW */}
          {activeTab === 'sessions' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-indigo-600" />
                  <span>{isAr ? 'سجل جلسات التدريس المباشرة' : 'Live Teaching Sessions Log'}</span>
                </h4>
                <span className="text-[10px] text-slate-400 font-medium">
                  {isAr ? 'من كتب الوزارة الرسمية' : 'From Official Ministry Books'}
                </span>
              </div>

              {teachingSessions.length === 0 ? (
                <div className="p-6 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-2">
                  <BookOpen className="w-8 h-8 text-indigo-400 mx-auto" />
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {isAr ? 'لم تبدأ أي جلسة تدريس بعد' : 'No teaching sessions recorded yet'}
                  </p>
                  <p className="text-[11px] text-slate-500 max-w-xs mx-auto leading-relaxed">
                    {isAr
                      ? 'عندما يبدأ طفلك دراسة أي درس من متصفح المنهج أو المهام اليومية، ستظهر هنا الوسائل التعليمية المستخدمة وأسئلة الاستكشاف المسجلة.'
                      : 'When your child begins a lesson, the teaching modalities and curiosity questions will appear here.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {teachingSessions.map((sess) => {
                    const lesson = curriculumService.getLessonById(sess.lessonId);
                    const completedConcepts = sess.explainBackDone
                      ? Math.min(sess.totalConcepts, sess.currentConceptIndex + 1)
                      : sess.currentConceptIndex;

                    return (
                      <div
                        key={sess.sessionId}
                        className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 space-y-2.5 shadow-xs"
                      >
                        {/* Title & Source Book */}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                                {isAr ? lesson?.titleAr || sess.lessonId : lesson?.titleEn || sess.lessonId}
                              </h5>
                              <span
                                className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                                  sess.status === 'completed'
                                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                                    : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                                }`}
                              >
                                {sess.status === 'completed'
                                  ? isAr
                                    ? 'مكتملة بنجاح'
                                    : 'Completed'
                                  : isAr
                                  ? 'قيد المتابعة'
                                  : 'In Progress'}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                              📖 {isAr ? lesson?.sourceRef.bookAr : lesson?.sourceRef.bookEn}
                            </p>
                          </div>

                          <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                            {new Date(sess.lastActiveAt).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>

                        {/* Modalities Tried (Deliverable 2b) */}
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block">
                            {isAr ? 'الوسائل التعليمية المستخدمة:' : 'Modalities Explored:'}
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {Array.from(new Set(sess.modalityHistory)).map((mod, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/60"
                              >
                                {getModalityLabel(mod)}
                              </span>
                            ))}
                            {sess.modalityHistory.length === 0 && (
                              <span className="text-[10px] text-slate-400 italic">
                                {isAr ? 'الشرح المباشر الأولي' : 'Initial explanation'}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Explain-it-back Summary (Deliverable 2c - NOT raw answers) */}
                        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span>
                              {isAr
                                ? `تم إثبات استيعاب ${completedConcepts} من أصل ${sess.totalConcepts} مفاهيم عبر خطوة الشرح العكسي.`
                                : `Verified understanding for ${completedConcepts} of ${sess.totalConcepts} concepts via explain-it-back.`}
                            </span>
                          </div>
                        </div>

                        {/* Off-Book Questions Saved for Parent (Deliverable 2d) */}
                        {sess.offBookQuestions && sess.offBookQuestions.length > 0 && (
                          <div className="p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 space-y-1">
                            <span className="text-[10px] font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-amber-600" />
                              {isAr
                                ? 'أسئلة فضول واستكشاف سألها الطفل (فرصة جميلة للحوار الأسري):'
                                : 'Curiosity Questions Asked (Saved for family talk):'}
                            </span>
                            <ul className="space-y-1">
                              {sess.offBookQuestions.map((q, idx) => (
                                <li
                                  key={idx}
                                  className="text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-1.5"
                                >
                                  <span>•</span>
                                  <span className="font-semibold italic">«{q.question}»</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CONTROLS & PREFERENCES */}
          {activeTab === 'controls' && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{isAr ? 'تفضيلات الدراسة والوقت (تتطلب PIN):' : 'Study & Bedtime Controls (Requires PIN):'}</span>
                </h5>
                <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                  <Lock className="w-3 h-3" />
                  PIN
                </span>
              </div>

              {/* Daily study budget */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  {isAr ? 'وقت المذاكرة الموصى به يومياً:' : 'Daily study time budget:'}
                </span>
                <select
                  value={availableMinutes}
                  onChange={(e) => setAvailableMinutes(Number(e.target.value))}
                  className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1 font-bold text-indigo-600 dark:text-indigo-400"
                >
                  <option value={15}>{isAr ? '١٥ دقيقة' : '15 min'}</option>
                  <option value={30}>{isAr ? '٣٠ دقيقة' : '30 min'}</option>
                  <option value={45}>{isAr ? '٤٥ دقيقة (افتراضي)' : '45 min'}</option>
                  <option value={60}>{isAr ? '٦٠ دقيقة' : '60 min'}</option>
                </select>
              </div>

              {/* Bedtime control */}
              <div className="flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <span className="text-slate-700 dark:text-slate-300 font-medium block">
                    {isAr ? 'موعد النوم (حجب التطبيق بعد الوقت):' : 'Bedtime (block app afterwards):'}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {bedtimeEnforced ? (isAr ? 'مفعل حالياً' : 'Currently enforced') : (isAr ? 'غير مفعل' : 'Disabled')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={bedtime}
                    onChange={(e) => setBedtime(e.target.value)}
                    className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1 font-mono text-xs font-bold"
                  />
                  <input
                    type="checkbox"
                    checked={bedtimeEnforced}
                    onChange={(e) => setBedtimeEnforced(e.target.checked)}
                    className="w-4 h-4 rounded-md accent-indigo-600"
                  />
                </div>
              </div>

              {/* Voice toggle globally */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  {isAr ? 'تفعيل الصوت والقراءة الآلية للطالب:' : 'Companion Voice Enabled:'}
                </span>
                <button
                  type="button"
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className={`p-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-colors ${
                    voiceEnabled
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-700 dark:text-emerald-300'
                      : 'bg-slate-200 dark:bg-slate-700 border-slate-300 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {voiceEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                  <span>{voiceEnabled ? (isAr ? 'مفعل' : 'Enabled') : (isAr ? 'معطل' : 'Disabled')}</span>
                </button>
              </div>

              {/* Save Preferences Button */}
              <button
                type="button"
                onClick={triggerSavePrefs}
                className="w-full py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{isAr ? 'حفظ التفضيلات (أدخل PIN)' : 'Save Settings (Enter PIN)'}</span>
              </button>
            </div>
          )}

          {/* Unlink Account */}
          <div className="pt-2 flex justify-between items-center text-xs">
            <button
              type="button"
              onClick={triggerUnlink}
              className="text-rose-600 dark:text-rose-400 hover:underline text-[11px] font-bold"
            >
              {isAr ? 'إلغاء ربط حساب ولي الأمر' : 'Unlink Parent Account'}
            </button>
          </div>
        </div>

        {/* PIN Prompt Modal Overlay */}
        {pinPromptOpen && (
          <div className="fixed inset-0 z-60 bg-black/75 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 max-w-xs w-full shadow-2xl space-y-3">
              <div className="text-center">
                <Lock className="w-6 h-6 text-indigo-600 mx-auto mb-1.5" />
                <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {isAr ? 'أدخل رمز المرور (PIN) للتأكيد' : 'Enter PIN to Confirm'}
                </h5>
              </div>

              {actionError && (
                <div className="p-2 rounded-lg bg-rose-50 text-rose-700 text-[10px] text-center">
                  {actionError}
                </div>
              )}

              <input
                type="password"
                maxLength={6}
                autoFocus
                value={actionPin}
                onChange={(e) => setActionPin(e.target.value)}
                placeholder="••••"
                className="w-full p-2.5 text-center font-mono tracking-widest text-base rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPinPromptOpen(false)}
                  className="flex-1 py-1.5 rounded-xl text-xs text-slate-600 hover:bg-slate-100 dark:text-slate-300"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="button"
                  onClick={handleConfirmPinAction}
                  className="flex-1 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  {isAr ? 'تأكيد' : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
          <span className="text-[10px] text-slate-400">
            {isAr ? 'وضع ولي الأمر نشط' : 'Parent Mode Active'}
          </span>
          <button
            type="button"
            onClick={() => {
              exitParentMode();
              onClose();
            }}
            className="py-1.5 px-4 rounded-xl text-xs font-bold bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-100 transition-colors"
          >
            {isAr ? 'الخروج من لوحة ولي الأمر' : 'Exit Parent View'}
          </button>
        </div>
      </div>
    </div>
  );
};
