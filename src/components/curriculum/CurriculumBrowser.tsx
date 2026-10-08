/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { OfficialCurriculumLesson } from '../../types/teachingSession';
import { curriculumService, SubjectCurriculumSummary } from '../../services/curriculum/curriculumService';
import { useApp } from '../../context/AppContext';
import { formatMasteryView } from '../../services/mastery/masteryEngine';
import { Badge } from '../common/Badge';
import { TeachingSessionModal } from '../teaching/TeachingSessionModal';
import { LessonStudyModal } from './LessonStudyModal';
import { QuizRunner } from '../missions/QuizRunner';
import { HomeworkRunner } from '../missions/HomeworkRunner';
import { SaveLikeButton } from '../collections/SaveLikeButton';
import { Mission } from '../../types';
import {
  BookOpen,
  Search,
  ChevronDown,
  ChevronRight,
  GraduationCap,
  Play,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Layers,
  Filter,
  ArrowRight,
  ArrowLeft,
  Bookmark,
  ExternalLink,
  HelpCircle,
  FileText,
  Clock,
  Check,
} from 'lucide-react';

export const CurriculumBrowser: React.FC = () => {
  const {
    language,
    getMasteryForConcept,
    setSelectedCurriculumLessonId,
    setActiveTab,
    startMission,
    student,
    setCompanionContext,
  } = useApp();
  const isAr = language === 'ar';
  const isFr = language === 'fr';

  const [activeViewMode, setActiveViewMode] = useState<'bookshelf' | 'units'>('bookshelf');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [selectedBookForDetail, setSelectedBookForDetail] = useState<SubjectCurriculumSummary | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedLessons, setExpandedLessons] = useState<Record<string, boolean>>({
    'off_ar_u1_l1_ana_astatee': true,
    'off_ar_u1_l2': true,
    'off_fr_u1_l1_salutations': true,
    'off_math_u1_l1': true,
    'off_mathfr_u1_l1_decimaux': true,
    'off_sci_u1_l1_plant_needs': true,
    'off_scifr_u1_l1_plantes': true,
  });

  const [activeTeachingLessonId, setActiveTeachingLessonId] = useState<string | null>(null);
  const [activeStudyLesson, setActiveStudyLesson] = useState<OfficialCurriculumLesson | null>(null);
  const [activePracticeMission, setActivePracticeMission] = useState<Mission | null>(null);

  const officialLessons = useMemo(() => curriculumService.getAllLessons(), []);
  const officialSubjectsSummary = useMemo(() => curriculumService.getSubjectsSummary(), []);

  const toggleLesson = (lessonId: string) => {
    setExpandedLessons((prev) => ({ ...prev, [lessonId]: !prev[lessonId] }));
  };

  // Filter official lessons
  const filteredOfficialLessons = useMemo(() => {
    let list = officialLessons;
    if (selectedSubjectId !== 'all') {
      list = list.filter((l) => l.subjectId === selectedSubjectId);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (l) =>
          l.titleAr.toLowerCase().includes(q) ||
          l.titleEn.toLowerCase().includes(q) ||
          (l.titleFr && l.titleFr.toLowerCase().includes(q)) ||
          l.subjectNameAr.toLowerCase().includes(q) ||
          l.sourceRef.bookAr.toLowerCase().includes(q) ||
          (l.readingText && l.readingText.toLowerCase().includes(q))
      );
    }
    return list;
  }, [officialLessons, selectedSubjectId, searchQuery]);

  // Group lessons of current selected subject by unit
  const activeSubjectUnits = useMemo(() => {
    if (selectedSubjectId === 'all') return null;
    return curriculumService.getUnitsForSubject(selectedSubjectId);
  }, [selectedSubjectId]);

  const handleLaunchPracticeQuiz = (lesson: OfficialCurriculumLesson) => {
    if (!student?.id) return;
    const dummyMission: Mission = {
      id: 'mission_quiz_' + lesson.id,
      studentId: student.id,
      date: new Date().toISOString().split('T')[0],
      subject: isAr ? lesson.subjectNameAr : lesson.subjectNameEn,
      title: (isAr ? 'تمارين وتطبيق: ' : 'Practice Quiz: ') + (isAr ? lesson.titleAr : lesson.titleEn),
      type: 'quiz',
      estimatedMinutes: 10,
      whyNow: isAr ? 'تطبيق وتدريب لتثبيت المفهوم' : 'Practice to solidify concept',
      originTag: 'official_curriculum',
      successCriterion: isAr ? 'حل التمارين بنجاح' : 'Complete practice quiz',
      status: 'pending',
      conceptId: lesson.concepts[0]?.id,
      lessonId: lesson.id,
    };
    setActivePracticeMission(dummyMission);
  };

  const handleLaunchHomework = (lesson: OfficialCurriculumLesson) => {
    if (!student?.id) return;
    const dummyMission: Mission = {
      id: 'mission_hw_' + lesson.id,
      studentId: student.id,
      date: new Date().toISOString().split('T')[0],
      subject: isAr ? lesson.subjectNameAr : lesson.subjectNameEn,
      title: (isAr ? 'واجب كتاب الوزارة: ' : 'Homework: ') + (isAr ? lesson.titleAr : lesson.titleEn),
      type: 'homework',
      estimatedMinutes: 15,
      whyNow: isAr ? 'واجب مدرسي لتثبيت الدرس' : 'Textbook homework for the lesson',
      originTag: 'official_curriculum',
      successCriterion: isAr ? 'إنهاء وحل مسائل الواجب' : 'Complete homework exercises',
      status: 'pending',
      conceptId: lesson.concepts[0]?.id,
      lessonId: lesson.id,
    };
    setActivePracticeMission(dummyMission);
  };

  return (
    <div className="flex-1 flex flex-col p-3 sm:p-4 space-y-4 max-w-lg mx-auto w-full pb-24" dir={isAr ? 'rtl' : 'ltr'}>
      {/* 1. Header & Virtual Bookshelf Badge */}
      <div className="p-4 rounded-3xl bg-linear-to-br from-indigo-950 via-indigo-900 to-purple-950 text-white shadow-xl border border-indigo-700/60 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md text-white flex items-center justify-center text-2xl shadow-sm border border-white/15">
              📚
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-black text-white">
                  {isAr ? 'مدرستي — كتب ومناهج أمينة' : isFr ? 'Mon École — Manuels d’Amina' : 'My School — Amina\'s Books'}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-400 text-slate-950 shadow-xs">
                  {isAr ? 'المنهج المعتمد 🇪🇬' : 'Official Curriculum'}
                </span>
              </div>
              <p className="text-xs text-indigo-200 mt-0.5">
                {isAr
                  ? 'جميع كتب وزارة التربية والتعليم الرسمية والكتب الداعمة (الفصل الدراسي الأول)'
                  : 'Official Ministry of Education Textbooks & Supplementary Guides (Term 1)'}
              </p>
            </div>
          </div>
        </div>

        {/* View Mode Switcher: Virtual Bookshelf vs Units Outline */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/15">
          <button
            type="button"
            onClick={() => {
              setActiveViewMode('bookshelf');
              setSelectedBookForDetail(null);
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeViewMode === 'bookshelf'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'bg-white/10 text-white hover:bg-white/15'
            }`}
          >
            <span>📖</span>
            <span>{isAr ? 'رف الكتب المدرسية' : 'School Bookshelf'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveViewMode('units')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeViewMode === 'units'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'bg-white/10 text-white hover:bg-white/15'
            }`}
          >
            <span>📑</span>
            <span>{isAr ? 'فهرس الوحدات والدروس' : 'Units & Lessons'}</span>
          </button>
        </div>
      </div>

      {/* 2. Search Bar across All Books */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute top-3 left-3 rtl:left-auto rtl:right-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={
            isAr
              ? 'ابحثي في جميع كتب أمينة (كسور، نبات، salutations، décimaux، النيل)...'
              : 'Search in all Amina\'s books (fractions, plants, decimals)...'
          }
          className="w-full py-2.5 px-9 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 shadow-2xs"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute top-2.5 right-3 rtl:right-auto rtl:left-3 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold"
          >
            ✕
          </button>
        )}
      </div>

      {/* 3. VIRTUAL BOOKSHELF VIEW (Conceptually: MY SCHOOL -> BOOKS -> UNITS -> LESSONS) */}
      {activeViewMode === 'bookshelf' && !selectedBookForDetail && !searchQuery && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold px-1">
            <span className="text-slate-800 dark:text-slate-200 flex items-center gap-1.5 font-black">
              <span>📚 كتب أمينة الدراسية (الصف الخامس):</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-normal">
                ({officialSubjectsSummary.length} كتب معتمدة)
              </span>
            </span>
          </div>

          {/* Book Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {officialSubjectsSummary.map((b) => (
              <div
                key={b.subjectId}
                onClick={() => {
                  setSelectedSubjectId(b.subjectId);
                  setSelectedBookForDetail(b);
                }}
                className="group relative rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden flex flex-col justify-between"
              >
                {/* Book Spine / Cover Header */}
                <div className={`p-3 bg-linear-to-br ${b.bgGradient} text-white space-y-1 relative`}>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl group-hover:scale-110 transition-transform">
                      {b.icon}
                    </span>
                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs">
                      {b.termLabel}
                    </span>
                  </div>
                  <h3 className="text-xs font-black leading-tight pt-1">
                    {isAr ? b.subjectNameAr : isFr && b.subjectNameFr ? b.subjectNameFr : b.subjectNameEn}
                  </h3>
                  <p className="text-[9px] text-white/80 line-clamp-1">
                    {isAr ? b.bookTitleAr : b.bookTitleEn}
                  </p>
                </div>

                {/* Book Meta & Action */}
                <div className="p-2.5 text-xs space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                    <span>{b.totalLessons} {isAr ? 'دروس مسجلة' : 'Lessons'}</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {b.availableLessons} {isAr ? 'متاح للدراسة' : 'Available'}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                    <span>{isAr ? 'افتحي الكتاب 📖' : 'Open Book 📖'}</span>
                    <span>←</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. OPENED VIRTUAL BOOK DETAIL VIEW (Inside a specific book) */}
      {selectedBookForDetail && !searchQuery && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Book Top Banner */}
          <div className={`p-4 rounded-3xl bg-linear-to-br ${selectedBookForDetail.bgGradient} text-white shadow-lg space-y-2 relative overflow-hidden`}>
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedBookForDetail(null)}
                className="px-2.5 py-1 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-bold flex items-center gap-1 transition-all"
              >
                {isAr ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
                <span>{isAr ? 'العودة لرف الكتب' : 'Back to Shelf'}</span>
              </button>

              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-white/20 text-white">
                  {selectedBookForDetail.termLabel}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-400 text-slate-950">
                  {isAr ? 'كتاب رسمي معتمد' : 'Official Ministry Book'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <span className="text-3xl">{selectedBookForDetail.icon}</span>
              <div>
                <h3 className="text-base font-black">
                  {isAr ? selectedBookForDetail.subjectNameAr : isFr && selectedBookForDetail.subjectNameFr ? selectedBookForDetail.subjectNameFr : selectedBookForDetail.subjectNameEn}
                </h3>
                <p className="text-xs text-white/90">
                  {isAr ? selectedBookForDetail.bookTitleAr : selectedBookForDetail.bookTitleEn}
                </p>
              </div>
            </div>
          </div>

          {/* Units Navigation for this book */}
          {activeSubjectUnits && (
            <div className="space-y-3">
              {activeSubjectUnits.map((u) => (
                <div
                  key={u.unitNumber}
                  className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden"
                >
                  {/* Unit Title Header */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-750 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                        {u.unitNumber}
                      </span>
                      <h4 className="text-xs font-black text-slate-900 dark:text-slate-100">
                        {isAr ? u.unitNameAr : isFr && u.unitNameFr ? u.unitNameFr : u.unitNameEn}
                      </h4>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold">
                      {u.lessons.length} {isAr ? 'دروس' : 'lessons'}
                    </span>
                  </div>

                  {/* Lessons list inside unit */}
                  <div className="p-2.5 space-y-2">
                    {u.lessons.map((lesson) => {
                      const isExpanded = Boolean(expandedLessons[lesson.id]);

                      return (
                        <div
                          key={lesson.id}
                          className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 p-3 space-y-2"
                        >
                          {/* Lesson Head */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 space-y-0.5">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                                  {isAr ? `الدرس ${lesson.lessonNumber}` : `Lesson ${lesson.lessonNumber}`}
                                </span>
                                {lesson.contentStatus === 'pending_materials' ? (
                                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200">
                                    ⏳ {isAr ? 'قيد رفع مواد الوزارة' : 'Materials Pending'}
                                  </span>
                                ) : (
                                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                                    ✓ {isAr ? 'كامل التمارين والأهداف' : 'Complete'}
                                  </span>
                                )}
                              </div>

                              <h5 className="text-xs font-black text-slate-900 dark:text-slate-100 pt-0.5">
                                {isAr ? lesson.titleAr : isFr && lesson.titleFr ? lesson.titleFr : lesson.titleEn}
                              </h5>
                              <p className="text-[10px] text-slate-400">
                                {isAr ? lesson.sourceRef.bookAr : lesson.sourceRef.bookEn}
                              </p>
                            </div>

                            {/* Save/Like & Toggle */}
                            <div className="flex items-center gap-1">
                              <SaveLikeButton
                                sourceId={lesson.id}
                                type="lesson"
                                title={isAr ? lesson.titleAr : lesson.titleEn}
                                subject={isAr ? lesson.subjectNameAr : lesson.subjectNameEn}
                                snippet={lesson.readingText?.slice(0, 100) || undefined}
                              />
                              <button
                                type="button"
                                onClick={() => toggleLesson(lesson.id)}
                                className="p-1 rounded text-slate-400 hover:text-slate-600"
                              >
                                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>

                          {/* Expanded Lesson View */}
                          {isExpanded && (
                            <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 space-y-3">
                              {/* Learning Objectives */}
                              {lesson.objectives && lesson.objectives.length > 0 && (
                                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-750 text-[11px] space-y-1">
                                  <span className="font-bold text-slate-700 dark:text-slate-300 block text-[10px]">
                                    🎯 {isAr ? 'أهداف التعلم الوزارية:' : 'Learning Objectives:'}
                                  </span>
                                  <ul className="list-disc list-inside space-y-0.5 text-slate-600 dark:text-slate-400 text-[10px]">
                                    {lesson.objectives.map((obj, oIdx) => (
                                      <li key={oIdx}>{obj}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Reading Text Preview if available */}
                              {lesson.readingText && (
                                <div className="p-2.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-[11px] space-y-1 text-right rtl:text-right">
                                  <span className="font-bold text-indigo-950 dark:text-indigo-200 block text-[10px]">
                                    📖 {isAr ? 'نص الدرس من كتاب الوزارة:' : 'Textbook Passage:'}
                                  </span>
                                  <p className="text-[10px] text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-3">
                                    {lesson.readingText}
                                  </p>
                                </div>
                              )}

                              {/* Supplementary Learning Resources (Clearly marked as supplementary, NOT official) */}
                              {lesson.supplementaryResources && lesson.supplementaryResources.length > 0 && (
                                <div className="p-2.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 space-y-1.5">
                                  <span className="text-[10px] font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1">
                                    <span>📘</span>
                                    <span>{isAr ? 'مصادر خارجية داعمة (تمارين وإثراء):' : 'Supplementary Learning Resources:'}</span>
                                  </span>
                                  <div className="space-y-1">
                                    {lesson.supplementaryResources.map((supp) => (
                                      <div
                                        key={supp.id}
                                        className="flex items-center justify-between text-[10px] text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 p-1.5 rounded-lg border border-amber-100 dark:border-amber-900"
                                      >
                                        <div className="flex items-center gap-1.5">
                                          <Badge variant="demo">{supp.sourceType === 'al_adwaa' ? 'الأضواء' : 'سلاح التلميذ'}</Badge>
                                          <span className="font-semibold">{isAr ? supp.sourceNameAr : supp.sourceNameEn}</span>
                                        </div>
                                        {supp.page && <span className="text-slate-400">صـ {supp.page}</span>}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* 4 Interactive Modalities for this Lesson */}
                              <div className="grid grid-cols-3 gap-1.5 pt-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedCurriculumLessonId(lesson.id);
                                    setCompanionContext({
                                      source: 'lesson',
                                      lessonId: lesson.id,
                                      topic: isAr ? lesson.titleAr : isFr && lesson.titleFr ? lesson.titleFr : lesson.titleEn,
                                    });
                                    setActiveStageLessonId(lesson.id);
                                  }}
                                  className="p-2 rounded-xl bg-linear-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-slate-950 font-black text-[10px] shadow-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
                                >
                                  <span>👩‍🏫</span>
                                  <span>{isAr ? 'اشرحي لي يا مس نور' : 'Learn with Nour'}</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleLaunchPracticeQuiz(lesson)}
                                  className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] shadow-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
                                >
                                  <span>🎯</span>
                                  <span>{isAr ? 'تدريبات واختبار' : 'Practice Quiz'}</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleLaunchHomework(lesson)}
                                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-black text-[10px] border border-slate-200 dark:border-slate-600 flex items-center justify-center gap-1 transition-all cursor-pointer"
                                >
                                  <span>✍️</span>
                                  <span>{isAr ? 'حل الواجب' : 'Homework'}</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. UNITS & LESSONS FLAT VIEW (When user clicks "Units & Lessons" tab or searches) */}
      {(activeViewMode === 'units' || searchQuery) && (
        <div className="space-y-3">
          {/* Subject Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedSubjectId('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedSubjectId === 'all'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              {isAr ? `جميع المواد (${officialLessons.length} درساً)` : `All Subjects (${officialLessons.length})`}
            </button>

            {officialSubjectsSummary.map((s) => {
              const isSelected = selectedSubjectId === s.subjectId;

              return (
                <button
                  key={s.subjectId}
                  type="button"
                  onClick={() => setSelectedSubjectId(s.subjectId)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{s.icon}</span>
                  <span>{isAr ? s.badgeAr : s.badgeEn}</span>
                </button>
              );
            })}
          </div>

          {/* Lessons List */}
          <div className="space-y-2">
            {filteredOfficialLessons.map((lesson) => (
              <div
                key={lesson.id}
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                        {isAr ? lesson.subjectNameAr : lesson.subjectNameEn}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {isAr ? `الوحدة ${lesson.unitNumber}` : `Unit ${lesson.unitNumber}`}
                      </span>
                    </div>

                    <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 pt-0.5">
                      {isAr ? lesson.titleAr : isFr && lesson.titleFr ? lesson.titleFr : lesson.titleEn}
                    </h4>
                    <p className="text-[10px] text-slate-400">
                      {isAr ? lesson.sourceRef.bookAr : lesson.sourceRef.bookEn}
                    </p>
                  </div>

                  <SaveLikeButton
                    sourceId={lesson.id}
                    type="lesson"
                    title={isAr ? lesson.titleAr : lesson.titleEn}
                    subject={isAr ? lesson.subjectNameAr : lesson.subjectNameEn}
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/60">
                  <button
                    type="button"
                    onClick={() => setActiveStudyLesson(lesson)}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <span>{isAr ? 'عرض تفاصيل الدرس' : 'View Lesson'}</span>
                    <span>←</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTeachingLessonId(lesson.id)}
                    className="px-2.5 py-1 rounded-xl bg-linear-to-r from-amber-400 to-amber-500 text-slate-950 text-[10px] font-black shadow-xs flex items-center gap-1"
                  >
                    <span>👩‍🏫 {isAr ? 'اشرحي يا مس نور' : 'Teach with Nour'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full Modal Runners */}
      {activeTeachingLessonId && (
        <TeachingSessionModal
          lessonId={activeTeachingLessonId}
          onClose={() => setActiveTeachingLessonId(null)}
        />
      )}

      {activeStudyLesson && (
        <LessonStudyModal
          lesson={activeStudyLesson}
          onClose={() => setActiveStudyLesson(null)}
        />
      )}

      {activePracticeMission && (
        activePracticeMission.type === 'homework' ? (
          <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-3">
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl h-[88vh] overflow-hidden">
              <HomeworkRunner
                mission={activePracticeMission}
                onComplete={() => setActivePracticeMission(null)}
                onSkip={() => setActivePracticeMission(null)}
                onClose={() => setActivePracticeMission(null)}
              />
            </div>
          </div>
        ) : (
          <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-3">
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl h-[88vh] overflow-hidden">
              <QuizRunner
                mission={activePracticeMission}
                onComplete={() => setActivePracticeMission(null)}
                onSkip={() => setActivePracticeMission(null)}
                onExplainDifferently={() => {
                  setActivePracticeMission(null);
                  if (activePracticeMission.lessonId) setActiveTeachingLessonId(activePracticeMission.lessonId);
                }}
              />
            </div>
          </div>
        )
      )}
    </div>
  );
};
