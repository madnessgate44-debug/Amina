/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { OfficialCurriculumLesson } from '../../types/teachingSession';
import { curriculumService } from '../../services/curriculum/curriculumService';
import { useApp } from '../../context/AppContext';
import {
  X,
  BookOpen,
  Search,
  Sparkles,
  Play,
  Layers,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
} from 'lucide-react';

interface CurriculumSubjectPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLesson: (lesson: OfficialCurriculumLesson) => void;
  initialSubjectId?: string;
  title?: string;
}

export const SUBJECT_METADATA: Record<
  string,
  { icon: string; color: string; bgGradient: string; termLabel: string }
> = {
  subj_arabic: {
    icon: '📖',
    color: 'emerald',
    bgGradient: 'from-emerald-600 to-teal-800',
    termLabel: 'الفصل الدراسي الأول',
  },
  subj_math: {
    icon: '📐',
    color: 'blue',
    bgGradient: 'from-blue-600 to-indigo-800',
    termLabel: 'الفصل الدراسي الأول',
  },
  subj_science: {
    icon: '🔬',
    color: 'cyan',
    bgGradient: 'from-cyan-600 to-blue-800',
    termLabel: 'الفصل الدراسي الأول',
  },
  subj_ict: {
    icon: '💻',
    color: 'purple',
    bgGradient: 'from-purple-600 to-indigo-800',
    termLabel: 'الفصل الدراسي الأول',
  },
  subj_social_studies: {
    icon: '🌍',
    color: 'amber',
    bgGradient: 'from-amber-600 to-orange-800',
    termLabel: 'الفصل الدراسي الأول',
  },
  subj_islamic: {
    icon: '🕌',
    color: 'green',
    bgGradient: 'from-emerald-700 to-green-900',
    termLabel: 'الفصل الدراسي الأول',
  },
  subj_english: {
    icon: '🇬🇧',
    color: 'rose',
    bgGradient: 'from-rose-600 to-pink-800',
    termLabel: 'Term 1',
  },
  subj_calligraphy: {
    icon: '✒️',
    color: 'slate',
    bgGradient: 'from-slate-700 to-slate-900',
    termLabel: 'الفصل الدراسي الأول',
  },
};

export const CurriculumSubjectPickerModal: React.FC<CurriculumSubjectPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectLesson,
  initialSubjectId = 'subj_arabic',
  title,
}) => {
  const { language, student } = useApp();
  const isAr = language === 'ar';
  const studentName = student?.name || (isAr ? 'أمينة' : 'Amina');

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(initialSubjectId);
  const [searchQuery, setSearchQuery] = useState('');

  const allLessons = useMemo(() => curriculumService.getAllLessons(), []);
  const subjectsSummary = useMemo(() => curriculumService.getSubjectsSummary(), []);

  // Filter lessons
  const filteredLessons = useMemo(() => {
    let list = allLessons;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return list.filter(
        (l) =>
          l.titleAr.toLowerCase().includes(q) ||
          l.titleEn.toLowerCase().includes(q) ||
          l.subjectNameAr.toLowerCase().includes(q) ||
          l.sourceRef.bookAr.toLowerCase().includes(q) ||
          l.readingText?.toLowerCase().includes(q)
      );
    }
    return list.filter((l) => l.subjectId === selectedSubjectId);
  }, [allLessons, selectedSubjectId, searchQuery]);

  // Group lessons by unit for the active subject
  const currentSubjectUnits = useMemo(() => {
    if (searchQuery.trim()) return [];
    return curriculumService.getUnitsForSubject(selectedSubjectId);
  }, [selectedSubjectId, searchQuery]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-linear-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-xl shadow-xs">
              📚
            </div>
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                <span>{title || (isAr ? 'مناهج وكتب الصف الخامس الابتدائي' : 'Grade 5 Curriculum & Books')}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950">
                  {isAr ? 'المنهج الرسمي' : 'Official'}
                </span>
              </h3>
              <p className="text-[11px] text-indigo-200">
                {isAr ? `اختاري المادة والدرس الذي تريدين دراسته يا ${studentName}` : `Choose a subject and lesson to study, ${studentName}`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-3 bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute top-2.5 right-3 rtl:right-3 rtl:left-auto ltr:left-3 ltr:right-auto" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? 'ابحثي في كل كتب ودروس الصف الخامس (مثال: كسور، نبات، النيل)...' : 'Search all Grade 5 lessons...'}
              className="w-full py-2 px-9 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute top-2 left-3 rtl:left-3 rtl:right-auto ltr:right-3 ltr:left-auto text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Subject Pills (when not searching) */}
        {!searchQuery && (
          <div className="p-2.5 px-3 bg-slate-100/80 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
            {subjectsSummary.map((sub) => {
              const meta = SUBJECT_METADATA[sub.subjectId] || {
                icon: '📚',
                color: 'indigo',
                bgGradient: 'from-indigo-600 to-indigo-800',
              };
              const isSelected = selectedSubjectId === sub.subjectId;

              return (
                <button
                  key={sub.subjectId}
                  type="button"
                  onClick={() => setSelectedSubjectId(sub.subjectId)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>{meta.icon}</span>
                  <span>{isAr ? sub.subjectNameAr : sub.subjectNameEn}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {sub.availableLessons}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Lesson List (Scrollable Area) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {searchQuery ? (
            /* Search Results */
            <div className="space-y-2.5">
              <p className="text-xs font-bold text-slate-500">
                {isAr ? `نتائج البحث (${filteredLessons.length} درساً):` : `Search Results (${filteredLessons.length} lessons):`}
              </p>
              {filteredLessons.length === 0 ? (
                <div className="text-center py-10 space-y-2 text-slate-400">
                  <p className="text-sm font-bold">{isAr ? 'لم نعثر على دروس مطابقة للبحث' : 'No lessons matched your search'}</p>
                  <p className="text-xs">{isAr ? 'جربي البحث بكلمة أخرى مثل: «نبات»، «كسور»، «نيل»' : 'Try searching for plant, math, or Nile'}</p>
                </div>
              ) : (
                filteredLessons.map((lesson) => (
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    onSelect={() => onSelectLesson(lesson)}
                    isAr={isAr}
                  />
                ))
              )}
            </div>
          ) : (
            /* Organized by Subject Units */
            <div className="space-y-4">
              {/* Subject Book Info Banner */}
              {(() => {
                const activeSub = subjectsSummary.find((s) => s.subjectId === selectedSubjectId);
                const meta = SUBJECT_METADATA[selectedSubjectId];
                if (!activeSub) return null;
                return (
                  <div
                    className={`p-3.5 rounded-2xl bg-linear-to-r ${meta?.bgGradient || 'from-indigo-600 to-indigo-800'} text-white shadow-md flex items-center justify-between`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xl">{meta?.icon || '📚'}</span>
                        <h4 className="text-xs font-black">
                          {isAr ? activeSub.bookTitleAr : activeSub.bookTitleEn}
                        </h4>
                      </div>
                      <p className="text-[10px] text-white/80">
                        {isAr
                          ? `كتاب الوزارة المعتمد • الصف الخامس • ${activeSub.availableLessons} درساً رسمياً`
                          : `Ministry Textbook • Grade 5 • ${activeSub.availableLessons} official lessons`}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-xl bg-white/20 backdrop-blur-xs text-[10px] font-black">
                      {isAr ? 'الترم الأول' : 'Term 1'}
                    </span>
                  </div>
                );
              })()}

              {/* Units & Lessons */}
              {currentSubjectUnits.map((unit) => (
                <div key={unit.unitNumber} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                    <h5 className="text-xs font-black text-slate-800 dark:text-slate-200">
                      {isAr ? unit.unitNameAr : unit.unitNameEn}
                    </h5>
                  </div>

                  <div className="space-y-2">
                    {unit.lessons.map((lesson) => (
                      <LessonCard
                        key={lesson.id}
                        lesson={lesson}
                        onSelect={() => onSelectLesson(lesson)}
                        isAr={isAr}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs shrink-0">
          <span className="text-[11px] font-bold text-slate-500">
            {isAr ? 'مناهج وزارة التربية والتعليم المصرية — موثقة بالكامل' : 'Egyptian Ministry of Education — Fully Verified'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold hover:bg-slate-300 cursor-pointer"
          >
            {isAr ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};

const LessonCard: React.FC<{
  lesson: OfficialCurriculumLesson;
  onSelect: () => void;
  isAr: boolean;
}> = ({ lesson, onSelect, isAr }) => {
  return (
    <div
      onClick={onSelect}
      className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col gap-1.5"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-black text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {isAr ? lesson.titleAr : lesson.titleEn}
            </span>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
              {isAr ? lesson.sourceRef.bookAr : lesson.sourceRef.bookEn}
            </span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
            {isAr ? lesson.unitNameAr : lesson.unitNameEn}
          </p>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className="py-1 px-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 group-hover:bg-indigo-600 group-hover:text-white font-black text-[10px] transition-all shrink-0 flex items-center gap-1"
        >
          <span>{isAr ? 'اختر هذا الدرس' : 'Select'}</span>
          <ChevronLeft className="w-3 h-3 rtl:block ltr:hidden" />
          <ChevronRight className="w-3 h-3 ltr:block rtl:hidden" />
        </button>
      </div>

      {/* Objectives / Summary Snippet */}
      {lesson.objectives && lesson.objectives.length > 0 && (
        <p className="text-[10px] text-slate-600 dark:text-slate-400 line-clamp-1 bg-slate-50 dark:bg-slate-900/60 p-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
          🎯 {lesson.objectives[0]}
        </p>
      )}

      {/* Vocabulary Tags */}
      {lesson.vocabulary && lesson.vocabulary.length > 0 && (
        <div className="flex items-center gap-1 flex-wrap pt-0.5">
          {lesson.vocabulary.slice(0, 3).map((v, i) => (
            <span
              key={i}
              className="text-[9px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/50 px-1.5 py-0.5 rounded-md"
            >
              {v.word}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
