/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { OfficialCurriculumLesson } from '../../types/teachingSession';
import { curriculumService } from '../../services/curriculum/curriculumService';
import { useApp } from '../../context/AppContext';
import { formatMasteryView } from '../../services/mastery/masteryEngine';
import { Badge } from '../common/Badge';
import { StageModal } from '../stage/StageModal';
import { LessonStudyModal } from './LessonStudyModal';
import { SUBJECT_METADATA } from './CurriculumSubjectPickerModal';
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
} from 'lucide-react';

export const CurriculumBrowser: React.FC = () => {
  const { language, getMasteryForConcept, setSelectedCurriculumLessonId, setActiveTab } = useApp();
  const isAr = language === 'ar';

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedLessons, setExpandedLessons] = useState<Record<string, boolean>>({
    'off_ar_u1_l1_ana_astatee': true,
    'off_ar_u1_l2': true,
    'off_math_u1_l1': true,
    'off_sci_u1_l1_plant_needs': true,
    'off_ict_u1_l1_archaeology_explorer': true,
  });

  const [activeTeachingLessonId, setActiveTeachingLessonId] = useState<string | null>(null);
  const [activeStudyLesson, setActiveStudyLesson] = useState<OfficialCurriculumLesson | null>(null);

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
          l.subjectNameAr.toLowerCase().includes(q) ||
          l.sourceRef.bookAr.toLowerCase().includes(q) ||
          (l.readingText && l.readingText.toLowerCase().includes(q))
      );
    }
    return list;
  }, [officialLessons, selectedSubjectId, searchQuery]);

  // Group lessons by subject and units if a specific subject is selected
  const activeSubjectUnits = useMemo(() => {
    if (selectedSubjectId === 'all') return null;
    return curriculumService.getUnitsForSubject(selectedSubjectId);
  }, [selectedSubjectId]);

  return (
    <div className="flex-1 flex flex-col p-3 sm:p-4 space-y-4 max-w-lg mx-auto w-full pb-24" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header & Stats Banner */}
      <div className="p-4 rounded-3xl bg-linear-to-br from-indigo-900 via-indigo-800 to-purple-950 text-white shadow-xl border border-indigo-700/60 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md text-white flex items-center justify-center text-2xl shadow-sm border border-white/15">
              📚
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-black text-white">
                  {isAr ? 'مناهج وكتب الصف الخامس الابتدائي' : 'Grade 5 Official Curriculum'}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-400 text-slate-950 shadow-xs">
                  {isAr ? 'المنهج المصري الرسمي 🇪🇬' : 'Egyptian Ministry'}
                </span>
              </div>
              <p className="text-xs text-indigo-200 mt-0.5">
                {isAr
                  ? 'جميع كتب ومناهج وزارة التربية والتعليم الرسمية لأمينة (الفصل الدراسي الأول)'
                  : 'Official Egyptian Ministry of Education Textbooks & Lessons (Term 1)'}
              </p>
            </div>
          </div>
        </div>

        {/* Stats summary row */}
        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-white/15 text-center text-xs">
          <div className="p-2 rounded-xl bg-white/10 backdrop-blur-xs">
            <span className="text-[10px] text-indigo-200 block font-bold">{isAr ? 'المواد الدراسية' : 'Subjects'}</span>
            <span className="text-sm font-black text-white">{officialSubjectsSummary.length} {isAr ? 'مواد' : 'subjects'}</span>
          </div>
          <div className="p-2 rounded-xl bg-white/10 backdrop-blur-xs">
            <span className="text-[10px] text-indigo-200 block font-bold">{isAr ? 'الدروس الرسمية' : 'Official Lessons'}</span>
            <span className="text-sm font-black text-amber-300">{officialLessons.length} {isAr ? 'درساً' : 'lessons'}</span>
          </div>
          <div className="p-2 rounded-xl bg-white/10 backdrop-blur-xs">
            <span className="text-[10px] text-indigo-200 block font-bold">{isAr ? 'الفصل الدراسي' : 'Term'}</span>
            <span className="text-sm font-black text-emerald-300">{isAr ? 'الترم الأول' : 'Term 1'}</span>
          </div>
        </div>
      </div>

      {/* 8 OFFICIAL BOOKS CAROUSEL / GRID */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold px-1">
          <span className="text-slate-800 dark:text-slate-200 flex items-center gap-1.5 font-black">
            <span>📖 رف الكتب المدرسية لأمينة:</span>
            <span className="text-slate-400 font-normal">({officialSubjectsSummary.length} كتب)</span>
          </span>
          {selectedSubjectId !== 'all' && (
            <button
              type="button"
              onClick={() => setSelectedSubjectId('all')}
              className="text-indigo-600 dark:text-indigo-400 text-[11px] hover:underline"
            >
              {isAr ? 'عرض جميع المواد' : 'Show All'}
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {officialSubjectsSummary.map((s) => {
            const meta = SUBJECT_METADATA[s.subjectId] || {
              icon: '📚',
              color: 'indigo',
              bgGradient: 'from-indigo-600 to-indigo-800',
              termLabel: 'الفصل الدراسي الأول',
            };
            const isSelected = selectedSubjectId === s.subjectId;

            return (
              <button
                key={s.subjectId}
                type="button"
                onClick={() => setSelectedSubjectId(isSelected ? 'all' : s.subjectId)}
                className={`p-3 rounded-2xl border text-right rtl:text-right ltr:text-left transition-all flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-700 shadow-md scale-[1.02]'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-2xl">{meta.icon}</span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {s.availableLessons} {isAr ? 'دروس' : 'lessons'}
                    </span>
                  </div>
                  <h3 className="text-xs font-black truncate">{isAr ? s.subjectNameAr : s.subjectNameEn}</h3>
                  <p
                    className={`text-[9px] truncate mt-0.5 ${
                      isSelected ? 'text-indigo-100' : 'text-slate-400'
                    }`}
                  >
                    {isAr ? s.bookTitleAr : s.bookTitleEn}
                  </p>
                </div>

                <div
                  className={`pt-2 mt-2 border-t text-[10px] font-bold flex items-center justify-between ${
                    isSelected ? 'border-white/20 text-amber-200' : 'border-slate-100 dark:border-slate-700/60 text-indigo-600 dark:text-indigo-400'
                  }`}
                >
                  <span>{isSelected ? (isAr ? 'محدد حالياً ✓' : 'Selected') : (isAr ? 'تصفح الدروس' : 'View')}</span>
                  <span>←</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute top-3 left-3 rtl:left-auto rtl:right-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={
            isAr
              ? 'ابحثي في جميع كتب ودروس الصف الخامس (مثال: كسور، نبات، النيل، المستكشف)...'
              : 'Search all Grade 5 lessons, text, or book titles...'
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

      {/* Subject Filter Pills */}
      {!searchQuery && (
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
            {isAr ? 'جميع المواد (٤٠ درساً)' : 'All Subjects (40 Lessons)'}
          </button>

          {officialSubjectsSummary.map((s) => {
            const meta = SUBJECT_METADATA[s.subjectId];
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
                <span>{meta?.icon || '📚'}</span>
                <span>{isAr ? s.subjectNameAr : s.subjectNameEn}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                }`}>
                  {s.availableLessons}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* LESSONS LIST */}
      <div className="space-y-3">
        {filteredOfficialLessons.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="text-3xl">🔍</span>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {isAr ? 'لم نعثر على دروس مطابقة لبحثك' : 'No lessons found'}
            </p>
            <p className="text-xs text-slate-500">
              {isAr ? 'جربي البحث باسم المادة أو الدرس أو كتاب الوزارة' : 'Try searching for subject or lesson name'}
            </p>
          </div>
        ) : (
          filteredOfficialLessons.map((lesson) => {
            const isLessonExpanded = expandedLessons[lesson.id] ?? false;
            const firstConcept = lesson.concepts[0];
            const masteryRec = firstConcept ? getMasteryForConcept(firstConcept.id) : null;
            const masteryView = formatMasteryView(masteryRec, language);
            const meta = SUBJECT_METADATA[lesson.subjectId] || { icon: '📚' };

            return (
              <div
                key={lesson.id}
                className="rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden transition-all hover:border-indigo-300 dark:hover:border-indigo-700"
              >
                {/* Lesson Header */}
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 flex items-start justify-between gap-3">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-lg">{meta.icon}</span>
                      <h3 className="text-sm font-black text-slate-900 dark:text-slate-100">
                        {isAr ? lesson.titleAr : lesson.titleEn}
                      </h3>
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-md">
                        {isAr ? 'كتاب الوزارة الرسمي' : 'Official Ministry Book'}
                      </span>
                      <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-md">
                        {isAr ? lesson.subjectNameAr : lesson.subjectNameEn}
                      </span>
                    </div>

                    {/* Book Source Reference */}
                    <div className="flex items-center gap-1.5 text-xs text-indigo-700 dark:text-indigo-300 font-semibold">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{isAr ? lesson.sourceRef.bookAr : lesson.sourceRef.bookEn}</span>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {isAr ? lesson.unitNameAr : lesson.unitNameEn}
                    </p>
                  </div>

                  {/* Mastery Badge */}
                  <div className="flex flex-col items-end shrink-0">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                        masteryView.confidenceBand === 'high'
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                          : masteryView.confidenceBand === 'medium'
                          ? 'border-amber-300 bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                          : 'border-slate-200 bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {masteryView.compositeLabel}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400 mt-0.5">
                      {masteryRec?.evidenceCount || 0} {isAr ? 'أدلة إتقان' : 'ev'}
                    </span>
                  </div>
                </div>

                {/* Lesson Actions & Details */}
                <div className="p-3.5 space-y-3">
                  {/* Objectives */}
                  {lesson.objectives.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                        {isAr ? 'أهداف الدرس الرسمية:' : 'Official Objectives:'}
                      </span>
                      <ul className="list-disc list-inside text-[11px] text-slate-600 dark:text-slate-400 space-y-0.5">
                        {lesson.objectives.slice(0, 2).map((obj, i) => (
                          <li key={i}>{obj}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Vocabulary Preview */}
                  {lesson.vocabulary.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      <span className="text-[10px] font-bold text-slate-400">
                        {isAr ? 'المفردات:' : 'Vocab:'}
                      </span>
                      {lesson.vocabulary.slice(0, 3).map((v, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700/60 text-[10px] font-bold text-slate-700 dark:text-slate-300"
                        >
                          {v.word}: {v.definition}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* 3 CORE STUDY BUTTONS */}
                  <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800 flex-wrap">
                    <button
                      type="button"
                      onClick={() => toggleLesson(lesson.id)}
                      className="text-[11px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                    >
                      {isLessonExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
                      )}
                      <span>
                        {isLessonExpanded
                          ? isAr
                            ? 'إخفاء التفاصيل'
                            : 'Hide Details'
                          : isAr
                          ? `المفاهيم (${lesson.concepts.length})`
                          : `Concepts (${lesson.concepts.length})`}
                      </span>
                    </button>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      {/* Button 1: Open Textbook & Exercises */}
                      <button
                        type="button"
                        onClick={() => setActiveStudyLesson(lesson)}
                        className="py-1.5 px-3 rounded-xl bg-linear-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs shadow-xs transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{isAr ? 'افتح الدرس والتمارين' : 'Study Lesson'}</span>
                      </button>

                      {/* Button 2: Study with Miss Nour in Classroom */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCurriculumLessonId(lesson.id);
                          setActiveTab('companion');
                        }}
                        className="py-1.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
                      >
                        <span>👩‍🏫</span>
                        <span>{isAr ? 'شرح المعلمة نور' : 'Teach with Nour'}</span>
                      </button>

                      {/* Button 3: Interactive Stage */}
                      <button
                        type="button"
                        onClick={() => setActiveTeachingLessonId(lesson.id)}
                        className="py-1.5 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold text-xs shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>{isAr ? 'المسرح 🎭' : 'Stage 🎭'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Expanded Concepts List */}
                  {isLessonExpanded && (
                    <div className="pt-2 space-y-1.5 border-t border-slate-100 dark:border-slate-800">
                      {lesson.concepts.map((concept) => (
                        <div
                          key={concept.id}
                          className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs flex items-center justify-between gap-2"
                        >
                          <div className="space-y-0.5">
                            <span className="font-bold text-slate-900 dark:text-slate-100 block">
                              {isAr ? concept.titleAr : concept.titleEn}
                            </span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400">
                              {concept.keyPoints[0]}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 shrink-0">
                            {isAr ? `مفهوم ${concept.conceptNumber}` : `C${concept.conceptNumber}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Lesson Study Modal */}
      {activeStudyLesson && (
        <LessonStudyModal
          lesson={activeStudyLesson}
          onClose={() => setActiveStudyLesson(null)}
        />
      )}

      {/* The Stage Modal */}
      {activeTeachingLessonId && (
        <StageModal
          lessonId={activeTeachingLessonId}
          onClose={() => setActiveTeachingLessonId(null)}
        />
      )}
    </div>
  );
};
