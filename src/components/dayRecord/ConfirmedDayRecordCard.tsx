/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { DayRecord } from '../../types';
import { Badge } from '../common/Badge';
import { CheckCircle2, Edit3, BookOpen, Clock, AlertTriangle, FileText } from 'lucide-react';

interface ConfirmedDayRecordCardProps {
  record: DayRecord;
  onEdit: () => void;
}

export const ConfirmedDayRecordCard: React.FC<ConfirmedDayRecordCardProps> = ({ record, onEdit }) => {
  const { t, language } = useApp();
  const isArabic = language === 'ar';

  const hasHomework = record.homeworkAssigned && record.homeworkAssigned.length > 0;
  const hasLessons = record.lessonsCovered && record.lessonsCovered.length > 0;

  return (
    <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/50 shadow-sm space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                {t.dayRecord.title}
              </h3>
              <Badge variant="official">origin: student_confirmed</Badge>
            </div>
            <span className="text-[10px] text-slate-400">
              {record.date} • {record.confirmedAt ? new Date(record.confirmedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onEdit}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center gap-1 transition-all"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>{t.dayRecord.editRecord}</span>
        </button>
      </div>

      {/* Discrepancies notification if timetable changed */}
      {record.discrepancies?.unexpectedSubjects && (
        <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 flex items-center gap-2 text-[11px] text-amber-800 dark:text-amber-300">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
          <span>
            {t.dayRecord.unexpectedSubjectNotice}: {record.discrepancies.unexpectedSubjects.join(', ')}
          </span>
        </div>
      )}

      {/* Lessons Covered Section */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
          {t.dayRecord.lessonsCovered}
        </span>
        {hasLessons ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {record.lessonsCovered.map((l, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-xs space-y-0.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-slate-100">{l.subject}</span>
                  <BookOpen className="w-3 h-3 text-slate-400" />
                </div>
                {l.topic && (
                  <p className="text-[11px] text-indigo-700 dark:text-indigo-400 font-medium">
                    {l.topic}
                  </p>
                )}
                {l.notes && <p className="text-[10px] text-slate-400">{l.notes}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">{t.dayRecord.noLessons}</p>
        )}
      </div>

      {/* Homework Assigned Section */}
      <div className="space-y-1.5 border-t border-slate-100 dark:border-slate-800 pt-2.5">
        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
          {t.dayRecord.homeworkAssigned}
        </span>
        {hasHomework ? (
          <div className="space-y-2">
            {record.homeworkAssigned.map((h, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-xs flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-indigo-950 dark:text-indigo-200">
                    {h.subject}: {h.description}
                  </span>
                  {h.dueDate && (
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>
                        {t.dayRecord.dueDateLabel}: {h.dueDate}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">{t.dayRecord.noHomework}</p>
        )}
      </div>
    </div>
  );
};
