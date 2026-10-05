/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { SaveLikeButton } from '../collections/SaveLikeButton';
import {
  CheckCircle2,
  Bookmark,
  Calendar,
  Clock,
  Sparkles,
  RotateCcw,
  Play,
  FileText,
  Trash2,
  Edit3,
  Plus,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Award,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export const ReviewScreen: React.FC = () => {
  const {
    student,
    language,
    masteryRecords,
    allReviewSchedules,
    savedItems,
    collections,
    weeklyReviews,
    triggerManualReview,
    generateAndOpenWeeklyReview,
    createCollection,
    updateSavedNote,
    removeSavedItem,
    t,
  } = useApp();

  const isAr = language === 'ar';

  const [activeSubTab, setActiveSubTab] = useState<'spaced' | 'saved' | 'weekly'>('spaced');
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>('all');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [tempNote, setTempNote] = useState<string>('');
  const [reviewFilter, setReviewFilter] = useState<'all' | 'due' | 'upcoming'>('due');

  // Filtered Review Items
  const dueItems = allReviewSchedules.items.filter((i) => i.isDue);
  const upcomingItems = allReviewSchedules.items.filter((i) => !i.isDue);
  const displayReviewItems =
    reviewFilter === 'due'
      ? dueItems
      : reviewFilter === 'upcoming'
      ? upcomingItems
      : allReviewSchedules.items;

  // Filtered Saved Items
  const filteredSavedItems =
    selectedCollectionId === 'all'
      ? savedItems
      : savedItems.filter((item) => item.collectionIds.includes(selectedCollectionId));

  const handleStartEditNote = (itemId: string, currentNote?: string) => {
    setEditingNoteId(itemId);
    setTempNote(currentNote || '');
  };

  const handleSaveNote = async (itemId: string) => {
    await updateSavedNote(itemId, tempNote);
    setEditingNoteId(null);
  };

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-5 max-w-lg mx-auto w-full pb-24 space-y-4">
      {/* Screen Header */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-indigo-600" />
            <span>{isAr ? 'المراجعة والحفظ الذكي' : 'Review & Smart Saves'}</span>
          </h1>
          <Badge variant="demo">Phase 7 Active</Badge>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {isAr
            ? 'مراجعة متباعدة تكيفية، محفوظاتك الخاصة، وتقارير أسبوعية خالية من الضغوط.'
            : 'Adaptive spaced revision, private collections, and guilt-free weekly reviews.'}
        </p>
      </div>

      {/* Sub-Tab Navigation Bar */}
      <div className="flex p-1 bg-slate-200/70 dark:bg-slate-800 rounded-2xl gap-1">
        <button
          type="button"
          onClick={() => setActiveSubTab('spaced')}
          className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'spaced'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{isAr ? 'المراجعة المتباعدة' : 'Spaced Review'}</span>
          {dueItems.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center">
              {dueItems.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('saved')}
          className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'saved'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>{isAr ? 'المحفوظات' : 'Saved Items'}</span>
          {savedItems.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-[10px] flex items-center justify-center">
              {savedItems.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('weekly')}
          className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'weekly'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>{isAr ? 'التقرير الأسبوعي' : 'Weekly Review'}</span>
        </button>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* SUB-TAB 1: SPACED REVIEW */}
      {/* ──────────────────────────────────────────────────────────── */}
      {activeSubTab === 'spaced' && (
        <div className="space-y-3">
          {/* Summary counters */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 text-center">
              <span className="text-[10px] text-indigo-600 dark:text-indigo-400 block font-bold">
                {isAr ? 'حان وقت مراجعتها' : 'Due for Review'}
              </span>
              <span className="text-lg font-black text-indigo-900 dark:text-indigo-100">
                {allReviewSchedules.dueCount}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/40 text-center">
              <span className="text-[10px] text-amber-600 dark:text-amber-400 block font-bold">
                {isAr ? 'تنبيه لطيف (+3 أيام)' : 'Gentle Nudge'}
              </span>
              <span className="text-lg font-black text-amber-900 dark:text-amber-100">
                {allReviewSchedules.overdueCount}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-center">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-bold">
                {isAr ? 'مستقرة وقادمة' : 'Upcoming'}
              </span>
              <span className="text-lg font-black text-slate-800 dark:text-slate-200">
                {allReviewSchedules.upcomingCount}
              </span>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => setReviewFilter('due')}
              className={`px-3 py-1 rounded-full font-bold transition-all ${
                reviewFilter === 'due'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {isAr ? 'المستحقة الآن' : 'Due Now'} ({dueItems.length})
            </button>
            <button
              type="button"
              onClick={() => setReviewFilter('upcoming')}
              className={`px-3 py-1 rounded-full font-bold transition-all ${
                reviewFilter === 'upcoming'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {isAr ? 'المراجعات القادمة' : 'Upcoming'} ({upcomingItems.length})
            </button>
            <button
              type="button"
              onClick={() => setReviewFilter('all')}
              className={`px-3 py-1 rounded-full font-bold transition-all ${
                reviewFilter === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {isAr ? 'الكل' : 'All'} ({allReviewSchedules.items.length})
            </button>
          </div>

          {/* Review Concept Cards */}
          <div className="space-y-2.5">
            {displayReviewItems.length === 0 ? (
              <div className="p-8 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {isAr ? 'رائع! لا توجد مفاهيم مستحقة للمراجعة الآن' : 'All clear! No concepts due for review right now.'}
                </h4>
                <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                  {isAr
                    ? 'الجدولة التكيفية ستنبهك بلطف عندما يحين موعد مراجعة أي مفهوم علمي للحفاظ على ثباته.'
                    : 'The adaptive scheduler will gently remind you when any concept is ready for a refresh.'}
                </p>
              </div>
            ) : (
              displayReviewItems.map((item) => {
                const intervalLabel =
                  item.intervalDays >= 7
                    ? isAr ? `متباعدة (${item.intervalDays} أيام)` : `Long-range (${item.intervalDays}d)`
                    : item.intervalDays >= 3
                    ? isAr ? `متوسطة (${item.intervalDays} أيام)` : `Medium (${item.intervalDays}d)`
                    : isAr ? `قريبة (${item.intervalDays} يوم)` : `Quick (${item.intervalDays}d)`;

                return (
                  <div
                    key={item.conceptId}
                    className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                            {item.subjectName}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                            {intervalLabel}
                          </span>
                          {item.isOverdue && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                              {isAr ? `تنشيط لطيف (${item.overdueDays} أيام)` : `Gentle nudge (${item.overdueDays}d)`}
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 pt-0.5">
                          {isAr ? item.conceptNameAr : item.conceptNameEn}
                        </h4>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {/* Save / Like */}
                        <SaveLikeButton
                          sourceId={item.conceptId}
                          type="concept"
                          title={isAr ? item.conceptNameAr : item.conceptNameEn}
                          subject={item.subjectName}
                        />

                        {/* Review this now trigger */}
                        <button
                          type="button"
                          onClick={() => triggerManualReview(item.conceptId)}
                          className="py-1.5 px-3 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-98 shadow-sm flex items-center gap-1 transition-all"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>{isAr ? 'راجع الآن' : 'Review Now'}</span>
                        </button>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                      {item.reason}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* SUB-TAB 2: SAVED ITEMS & COLLECTIONS */}
      {/* ──────────────────────────────────────────────────────────── */}
      {activeSubTab === 'saved' && (
        <div className="space-y-3">
          {/* Collection Pills Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            <button
              type="button"
              onClick={() => setSelectedCollectionId('all')}
              className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
                selectedCollectionId === 'all'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              {isAr ? 'جميع المحفوظات' : 'All Saves'} ({savedItems.length})
            </button>

            {collections.map((col) => {
              const isSelected = selectedCollectionId === col.id;
              const count = savedItems.filter((i) => i.collectionIds.includes(col.id)).length;
              return (
                <button
                  key={col.id}
                  type="button"
                  onClick={() => setSelectedCollectionId(col.id)}
                  className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>{isAr && col.nameAr ? col.nameAr : col.name}</span>
                  <span className="opacity-70 text-[10px] ml-1 rtl:mr-1 rtl:ml-0 font-mono">
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>

          {/* Saved Items List */}
          {filteredSavedItems.length === 0 ? (
            <div className="p-8 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <Bookmark className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {isAr ? 'لا توجد عناصر محفوظة في هذه المجموعة بعد' : 'No items saved in this collection yet.'}
              </h4>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                {isAr
                  ? 'يمكنك حفظ أي درس، أو بطاقة مفهوم، أو ملاحظة، أو مقطع تعليمي بالضغط على أيقونة الإشارة المرجعية.'
                  : 'You can save any lesson, quiz, concept card, or note by tapping the bookmark icon.'}
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredSavedItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase">
                          {item.type}
                        </span>
                        {item.subject && (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600">
                            {item.subject}
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {item.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleStartEditNote(item.id, item.note)}
                        title={isAr ? 'تعديل الملاحظة' : 'Edit note'}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeSavedItem(item.id)}
                        title={isAr ? 'حذف من المحفوظات' : 'Remove item'}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Note block */}
                  {editingNoteId === item.id ? (
                    <div className="space-y-1.5 pt-1">
                      <textarea
                        rows={2}
                        value={tempNote}
                        onChange={(e) => setTempNote(e.target.value)}
                        placeholder={isAr ? 'أضف ملاحظتك الشخصية...' : 'Add your note...'}
                        className="w-full p-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                      />
                      <div className="flex justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setEditingNoteId(null)}
                          className="py-1 px-2.5 text-[10px] text-slate-500"
                        >
                          {t.common.cancel}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveNote(item.id)}
                          className="py-1 px-3 text-[10px] font-bold bg-indigo-600 text-white rounded-lg"
                        >
                          {isAr ? 'حفظ الملاحظة' : 'Save Note'}
                        </button>
                      </div>
                    </div>
                  ) : item.note ? (
                    <div className="p-2 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-[11px] text-amber-900 dark:text-amber-200 flex items-start gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>{item.note}</span>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* SUB-TAB 3: WEEKLY REVIEWS */}
      {/* ──────────────────────────────────────────────────────────── */}
      {activeSubTab === 'weekly' && (
        <div className="space-y-3">
          {/* Action to generate weekly review on demand */}
          <div className="p-4 rounded-3xl bg-linear-to-r from-indigo-600 to-indigo-800 text-white shadow-lg shadow-indigo-600/20 flex items-center justify-between">
            <div className="space-y-0.5 max-w-[240px]">
              <span className="text-xs font-bold block">
                {isAr ? 'حصادك الأسبوعي المشجع' : 'Your Encouraging Weekly Win'}
              </span>
              <p className="text-[10px] text-indigo-100">
                {isAr
                  ? 'يتولد تلقائياً كل 7 أيام أو عند طلبك عبر الرفيق أو بالضغط هنا.'
                  : 'Auto-generated every 7 days, or on demand whenever you ask.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => generateAndOpenWeeklyReview(true)}
              className="py-2 px-3.5 rounded-xl bg-white text-indigo-700 font-bold text-xs shadow-xs hover:bg-indigo-50 active:scale-98 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{isAr ? 'أنشئ تقرير الأسبوع' : 'Generate Week'}</span>
            </button>
          </div>

          {/* Past Weekly Reviews List */}
          <div className="space-y-3">
            {weeklyReviews.length === 0 ? (
              <div className="p-8 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <Calendar className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {isAr ? 'لا توجد تقارير أسبوعية مسجلة بعد' : 'No weekly reviews generated yet.'}
                </h4>
                <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                  {isAr
                    ? 'اضغط على زر (أنشئ تقرير الأسبوع) بالأعلى للاطلاع على ملخص استيعابك وإنجازاتك في جو مريح.'
                    : 'Tap "Generate Week" above to see your conceptual retention and wins.'}
                </p>
              </div>
            ) : (
              weeklyReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3.5"
                >
                  {/* Card Header & Non-Guilt Tone Message */}
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          {isAr ? 'تقرير الأسبوع الدراسي' : 'Weekly Review'} ({rev.weekStartDate} - {rev.weekEndDate})
                        </h4>
                        <span className="text-[10px] text-slate-400">
                          {rev.timeSpentMinutes} {isAr ? 'دقيقة مذاكرة هادفة' : 'minutes studied'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Warm Tone Message Banner */}
                  <div className="p-3 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-xs text-indigo-950 dark:text-indigo-200 leading-relaxed flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>{isAr ? rev.toneMessageAr : rev.toneMessageEn}</span>
                  </div>

                  {/* Homework & Quiz Trends Counters */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">
                        {isAr ? 'إنجاز الواجبات المدرسية:' : 'Homework Completion:'}
                      </span>
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-slate-900 dark:text-slate-100">
                          {rev.homeworkCompletion.completed} / {rev.homeworkCompletion.total} ({rev.homeworkCompletion.percentage}٪)
                        </span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 transition-all"
                          style={{ width: `${rev.homeworkCompletion.percentage}%` }}
                        />
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">
                        {isAr ? 'مؤشر أسئلة الفهم:' : 'Comprehension Trend:'}
                      </span>
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-slate-900 dark:text-slate-100">
                          {rev.quizPerformanceTrend.averageScore}٪
                        </span>
                        <TrendingUp className="w-4 h-4 text-indigo-500" />
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        {isAr ? rev.quizPerformanceTrend.detailsAr : rev.quizPerformanceTrend.detailsEn}
                      </p>
                    </div>
                  </div>

                  {/* Strong Concepts Mastered This Week */}
                  {rev.strongConcepts.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{isAr ? 'مفاهيم تم إتقانها بجدارة هذا الأسبوع:' : 'Concepts Mastered This Week:'}</span>
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {rev.strongConcepts.map((sc) => (
                          <span
                            key={sc.conceptId}
                            className="px-2.5 py-1 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200"
                          >
                            {isAr ? sc.nameAr : sc.nameEn}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Repeated Errors / Concepts Needing Review */}
                  {rev.repeatedErrors.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        <span>{isAr ? 'مفاهيم واجهت فيها بعض الصعوبة:' : 'Concepts With Repeated Errors:'}</span>
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {rev.repeatedErrors.map((re) => (
                          <span
                            key={re.conceptId}
                            className="px-2.5 py-1 rounded-xl text-xs font-bold bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200"
                          >
                            {isAr ? re.nameAr : re.nameEn}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Format Effectiveness */}
                  {rev.formatEffectiveness.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{isAr ? 'أكثر أساليب التعلم فاعلية واحتفاظاً لك:' : 'Most Effective Learning Modalities:'}</span>
                      </span>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {rev.formatEffectiveness.slice(0, 2).map((fe) => (
                          <div
                            key={fe.modality}
                            className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-0.5"
                          >
                            <span className="font-bold text-slate-800 dark:text-slate-200 block truncate">
                              {isAr ? fe.labelAr : fe.labelEn}
                            </span>
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">
                              {Math.round(fe.retentionScore * 100)}٪ {isAr ? 'معدل استيعاب' : 'retention'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* One Recommended Focus Next Week */}
                  <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/40 space-y-1">
                    <span className="text-[11px] font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                      <span>{isAr ? 'التركيز المقترح للأسبوع القادم:' : 'Recommended Focus For Next Week:'}</span>
                    </span>
                    <p className="text-xs text-indigo-800 dark:text-indigo-300 leading-relaxed">
                      {isAr ? rev.recommendedFocus.rationaleAr : rev.recommendedFocus.rationaleEn}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
