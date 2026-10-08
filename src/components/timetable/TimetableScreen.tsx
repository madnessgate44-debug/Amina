/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Timetable, DaySchedule, TimeSlot, SchoolDayKey } from '../../types';
import { Badge } from '../common/Badge';
import { createDefaultTimetable } from '../../data/defaultTimetable';
import { Calendar, Plus, Edit2, Trash2, Clock, Check, RotateCcw, AlertCircle } from 'lucide-react';

export const TimetableScreen: React.FC = () => {
  const { t, language, timetable, saveTimetable, student, showToast } = useApp();
  const isArabic = language === 'ar';

  const [activeDayKey, setActiveDayKey] = useState<SchoolDayKey>('sunday');
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);

  // Form modal state
  const [slotPeriodNumber, setSlotPeriodNumber] = useState<number>(1);
  const [slotStartTime, setSlotStartTime] = useState<string>('08:00');
  const [slotEndTime, setSlotEndTime] = useState<string>('08:45');
  const [slotSubject, setSlotSubject] = useState<string>('اللغة العربية');
  const [slotIsBreak, setSlotIsBreak] = useState<boolean>(false);

  // If no saved timetable, do NOT silently pretend demo schedule is real.
  const isTimetableConfigured = Boolean(timetable);
  const currentTimetable = timetable || null;

  const activeDay = currentTimetable
    ? currentTimetable.days.find((d) => d.day === activeDayKey) || currentTimetable.days[0]
    : null;

  const handleOpenEdit = (slot: TimeSlot) => {
    setEditingSlot(slot);
    setIsAddingNew(false);
    setSlotPeriodNumber(slot.periodNumber);
    setSlotStartTime(slot.startTime);
    setSlotEndTime(slot.endTime);
    setSlotSubject(slot.subject);
    setSlotIsBreak(Boolean(slot.isBreak));
  };

  const handleOpenAdd = () => {
    if (!activeDay) return;
    const nextPeriodNum = (activeDay.periods.length || 0) + 1;
    setEditingSlot(null);
    setIsAddingNew(true);
    setSlotPeriodNumber(nextPeriodNum);
    setSlotStartTime('12:40');
    setSlotEndTime('13:25');
    setSlotSubject(isArabic ? 'العلوم' : 'Science');
    setSlotIsBreak(false);
  };

  const handleCreateBlankTimetable = async () => {
    if (!student?.id) {
      showToast(isArabic ? 'يرجى إعداد ملف الطالب أولاً' : 'Please set up student profile first');
      return;
    }
    const days: DaySchedule[] = [
      { day: 'sunday', dayNameAr: 'الأحد', dayNameEn: 'Sunday', periods: [] },
      { day: 'monday', dayNameAr: 'الإثنين', dayNameEn: 'Monday', periods: [] },
      { day: 'tuesday', dayNameAr: 'الثلاثاء', dayNameEn: 'Tuesday', periods: [] },
      { day: 'wednesday', dayNameAr: 'الأربعاء', dayNameEn: 'Wednesday', periods: [] },
      { day: 'thursday', dayNameAr: 'الخميس', dayNameEn: 'Thursday', periods: [] },
    ];
    const blankTt: Timetable = {
      id: `tt_${student.id}`,
      studentId: student.id,
      days,
      updatedAt: new Date().toISOString(),
      isDemo: false,
    };
    await saveTimetable(blankTt);
  };

  const handleLoadSampleTemplate = async () => {
    if (!student?.id) {
      showToast(isArabic ? 'يرجى إعداد ملف الطالب أولاً' : 'Please set up student profile first');
      return;
    }
    const sampleTt = createDefaultTimetable(student.id);
    await saveTimetable(sampleTt);
  };

  const handleSaveSlot = async () => {
    if (!currentTimetable || !student?.id) return;
    const updatedDays: DaySchedule[] = currentTimetable.days.map((day) => {
      if (day.day !== activeDayKey) return day;

      if (isAddingNew) {
        const newSlot: TimeSlot = {
          id: `slot_${Date.now()}`,
          periodNumber: slotPeriodNumber,
          startTime: slotStartTime,
          endTime: slotEndTime,
          subject: slotSubject,
          isBreak: slotIsBreak,
        };
        const updatedPeriods = [...day.periods, newSlot].sort((a, b) =>
          a.startTime.localeCompare(b.startTime)
        );
        return { ...day, periods: updatedPeriods };
      } else if (editingSlot) {
        const updatedPeriods = day.periods.map((p) => {
          if (p.id !== editingSlot.id) return p;
          return {
            ...p,
            periodNumber: slotPeriodNumber,
            startTime: slotStartTime,
            endTime: slotEndTime,
            subject: slotSubject,
            isBreak: slotIsBreak,
          };
        });
        return { ...day, periods: updatedPeriods };
      }
      return day;
    });

    const updatedTt: Timetable = {
      ...currentTimetable,
      studentId: student.id,
      days: updatedDays,
      updatedAt: new Date().toISOString(),
      isDemo: false,
    };

    await saveTimetable(updatedTt);
    setEditingSlot(null);
    setIsAddingNew(false);
  };

  const handleDeleteSlot = async (slotId: string) => {
    if (!currentTimetable || !student?.id) return;
    const updatedDays: DaySchedule[] = currentTimetable.days.map((day) => {
      if (day.day !== activeDayKey) return day;
      return {
        ...day,
        periods: day.periods.filter((p) => p.id !== slotId),
      };
    });

    const updatedTt: Timetable = {
      ...currentTimetable,
      studentId: student.id,
      days: updatedDays,
      updatedAt: new Date().toISOString(),
      isDemo: false,
    };

    await saveTimetable(updatedTt);
  };

  const handleResetToDefault = async () => {
    if (!student?.id) return;
    const defaultTt = createDefaultTimetable(student.id);
    await saveTimetable(defaultTt);
  };

  const subjectSuggestions = isArabic
    ? ['اللغة العربية', 'الرياضيات', 'العلوم', 'تربية دينية', 'تربية رياضية', 'تربية فنية', 'فسحة / استراحة']
    : ['Arabic Language', 'Mathematics', 'Science', 'Religious Studies', 'Physical Education', 'Art', 'Break / Recess'];

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-5 max-w-lg mx-auto w-full pb-20">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {t.timetable.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.timetable.subtitle}
              </p>
            </div>
          </div>
          {currentTimetable?.isDemo ? (
            <Badge variant="demo">{t.app.demoOriginTag}</Badge>
          ) : currentTimetable ? (
            <Badge variant="official">{isArabic ? 'جدول مدرسي معتمد' : 'Confirmed Schedule'}</Badge>
          ) : null}
        </div>

        {/* Demo Notice (Only when viewing demo timetable) */}
        {currentTimetable?.isDemo && (
          <div className="mt-3 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50 flex items-center gap-2 text-[11px] text-amber-800 dark:text-amber-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>{t.timetable.demoNotice}</span>
          </div>
        )}
      </div>

      {!currentTimetable ? (
        /* Empty / Unconfigured Timetable State */
        <div className="my-auto py-12 px-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center text-2xl shadow-xs">
            📅
          </div>
          <div className="space-y-1.5 max-w-sm mx-auto">
            <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
              {isArabic ? 'لم يتم إدخال جدول الحصص بعد' : 'No School Timetable Set Up Yet'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {isArabic
                ? 'المعلمة نور تعتمد حالياً على ما تسجلينه في سجل اليوم المدرسي. يمكنكِ إنشاء جدولك الآن أو استيراد نموذج لتعديله.'
                : 'Miss Nour currently relies on your daily school reports. You can build your schedule now or load a sample template.'}
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row gap-2 max-w-xs mx-auto">
            <button
              type="button"
              onClick={handleLoadSampleTemplate}
              className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
            >
              {isArabic ? 'تحميل نموذج تجريبي للتعديل' : 'Load Sample Template'}
            </button>
            <button
              type="button"
              onClick={handleCreateBlankTimetable}
              className="flex-1 py-3 px-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-750 transition-all cursor-pointer"
            >
              {isArabic ? 'إنشاء جدول فارغ' : 'Create Blank Schedule'}
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Days Tabs (Sunday - Thursday) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 no-scrollbar">
            {currentTimetable.days.map((d) => {
              const isActive = d.day === activeDayKey;
              return (
                <button
                  key={d.day}
                  onClick={() => setActiveDayKey(d.day)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <span>{isArabic ? d.dayNameAr : d.dayNameEn}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {d.periods.length}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Periods list for active day */}
          <div className="mt-4 space-y-2.5 flex-1">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1">
              <span>{isArabic ? `حصص يوم ${activeDay?.dayNameAr || ''}` : `${activeDay?.dayNameEn || ''} Periods`}</span>
              <button
                onClick={handleOpenAdd}
                className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-bold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.timetable.addPeriod}</span>
              </button>
            </div>

            {!activeDay || activeDay.periods.length === 0 ? (
              <div className="text-center py-10 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                <p className="text-xs text-slate-400">
                  {isArabic ? 'لا توجد حصص مسجلة لهذا اليوم' : 'No periods recorded for this day'}
                </p>
              </div>
            ) : (
          activeDay.periods.map((period) => (
            <div
              key={period.id}
              className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                period.isBreak
                  ? 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40 text-amber-900 dark:text-amber-200'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                    period.isBreak
                      ? 'bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100'
                      : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                  }`}
                >
                  {period.isBreak ? '☕' : period.periodNumber}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {period.subject}
                    </span>
                    {period.isBreak && (
                      <Badge variant="warning" size="sm">
                        {t.timetable.breakLabel}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span dir="ltr">
                      {period.startTime} - {period.endTime}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(period)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-all"
                  title={t.timetable.edit}
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteSlot(period.id)}
                  className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950 text-slate-400 hover:text-rose-600 transition-all"
                  title={t.timetable.delete}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer controls: Reset to Demo Timetable */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <button
          onClick={handleResetToDefault}
          className="text-xs text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1.5 font-medium transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t.timetable.resetToDemo}</span>
        </button>
        <span className="text-[11px] text-slate-400">
          {currentTimetable.days.reduce((acc, d) => acc + d.periods.length, 0)} {isArabic ? 'حصة مسجلة' : 'total periods'}
        </span>
      </div>
        </>
      )}

      {/* Modal for Add / Edit Slot */}
      {(editingSlot || isAddingNew) && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 max-w-sm w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {isAddingNew
                ? isArabic
                  ? `إضافة حصة ليوم ${activeDay?.dayNameAr || ''}`
                  : `Add Period for ${activeDay?.dayNameEn || ''}`
                : isArabic
                ? 'تعديل الحصة'
                : 'Edit Period'}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.timetable.subject}
                </label>
                <input
                  type="text"
                  value={slotSubject}
                  onChange={(e) => setSlotSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-medium"
                />
                {/* Suggestions */}
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {subjectSuggestions.slice(0, 5).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSlotSubject(s)}
                      className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.timetable.timeFrom}
                  </label>
                  <input
                    type="time"
                    value={slotStartTime}
                    onChange={(e) => setSlotStartTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.timetable.timeTo}
                  </label>
                  <input
                    type="time"
                    value={slotEndTime}
                    onChange={(e) => setSlotEndTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isBreakCheck"
                  checked={slotIsBreak}
                  onChange={(e) => setSlotIsBreak(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <label htmlFor="isBreakCheck" className="text-slate-700 dark:text-slate-300 font-medium">
                  {t.timetable.breakLabel}
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setEditingSlot(null);
                  setIsAddingNew(false);
                }}
                className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300"
              >
                {t.timetable.cancel}
              </button>
              <button
                type="button"
                onClick={handleSaveSlot}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm"
              >
                {t.timetable.save}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
