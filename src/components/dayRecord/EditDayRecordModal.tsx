/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DayRecord, LessonCovered, HomeworkItem } from '../../types';
import { X, Plus, Trash2, Check, AlertCircle } from 'lucide-react';

interface EditDayRecordModalProps {
  record: DayRecord;
  onClose: () => void;
  onSave: (updatedRecord: DayRecord) => void;
}

export const EditDayRecordModal: React.FC<EditDayRecordModalProps> = ({
  record,
  onClose,
  onSave,
}) => {
  const { t, language } = useApp();
  const isArabic = language === 'ar';

  const [lessons, setLessons] = useState<LessonCovered[]>(record.lessonsCovered || []);
  const [homework, setHomework] = useState<HomeworkItem[]>(record.homeworkAssigned || []);
  const [notes, setNotes] = useState<string>(record.notes || '');

  const handleAddLesson = () => {
    setLessons([
      ...lessons,
      {
        subject: isArabic ? 'اللغة العربية' : 'Arabic',
        topic: '',
        notes: '',
      },
    ]);
  };

  const handleUpdateLesson = (index: number, field: keyof LessonCovered, value: string) => {
    const updated = [...lessons];
    updated[index] = { ...updated[index], [field]: value };
    setLessons(updated);
  };

  const handleRemoveLesson = (index: number) => {
    setLessons(lessons.filter((_, i) => i !== index));
  };

  const handleAddHomework = () => {
    setHomework([
      ...homework,
      {
        subject: isArabic ? 'الرياضيات' : 'Mathematics',
        description: '',
        dueDate: isArabic ? 'غداً' : 'Tomorrow',
      },
    ]);
  };

  const handleUpdateHomework = (index: number, field: keyof HomeworkItem, value: string) => {
    const updated = [...homework];
    updated[index] = { ...updated[index], [field]: value };
    setHomework(updated);
  };

  const handleRemoveHomework = (index: number) => {
    setHomework(homework.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const updated: DayRecord = {
      ...record,
      lessonsCovered: lessons.filter((l) => l.subject.trim()),
      homeworkAssigned: homework.filter((h) => h.subject.trim()),
      notes,
      confirmed: true,
      confirmedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      origin: 'student_confirmed',
    };
    onSave(updated);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3.5 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full max-h-[90vh] shadow-2xl flex flex-col overflow-hidden my-auto">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {t.dayRecord.editRecord}
            </h3>
            <span className="text-[11px] text-slate-500">{record.date}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* Lessons Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {t.dayRecord.lessonsCovered}
              </span>
              <button
                type="button"
                onClick={handleAddLesson}
                className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.dayRecord.addLesson}</span>
              </button>
            </div>

            {lessons.map((lesson, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="text"
                    value={lesson.subject}
                    onChange={(e) => handleUpdateLesson(idx, 'subject', e.target.value)}
                    placeholder={t.dayRecord.subjectLabel}
                    className="w-1/2 px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveLesson(idx)}
                    className="p-1 text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <input
                  type="text"
                  value={lesson.topic || ''}
                  onChange={(e) => handleUpdateLesson(idx, 'topic', e.target.value)}
                  placeholder={t.dayRecord.topicLabel}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                />
              </div>
            ))}
          </div>

          {/* Homework Section */}
          <div className="space-y-2 border-t border-slate-200 dark:border-slate-800 pt-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {t.dayRecord.homeworkAssigned}
              </span>
              <button
                type="button"
                onClick={handleAddHomework}
                className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.dayRecord.addHomework}</span>
              </button>
            </div>

            {homework.map((hw, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="text"
                    value={hw.subject}
                    onChange={(e) => handleUpdateHomework(idx, 'subject', e.target.value)}
                    placeholder={t.dayRecord.subjectLabel}
                    className="w-1/2 px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-bold"
                  />
                  <input
                    type="text"
                    value={hw.dueDate || ''}
                    onChange={(e) => handleUpdateHomework(idx, 'dueDate', e.target.value)}
                    placeholder={t.dayRecord.dueDateLabel}
                    className="w-1/3 px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-[11px]"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveHomework(idx)}
                    className="p-1 text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <input
                  type="text"
                  value={hw.description}
                  onChange={(e) => handleUpdateHomework(idx, 'description', e.target.value)}
                  placeholder={t.dayRecord.hwDescLabel}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                />
              </div>
            ))}
          </div>

          {/* General Notes */}
          <div className="space-y-1.5 border-t border-slate-200 dark:border-slate-800 pt-3">
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {t.dayRecord.notesLabel}
            </span>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={isArabic ? 'أي ملاحظات أخرى عن اليوم...' : 'Any other notes about today...'}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2 shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300"
          >
            {t.dayRecord.cancelEdit}
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>{t.dayRecord.saveChanges}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
