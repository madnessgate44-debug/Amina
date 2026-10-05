/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { Mission } from '../../types';
import { Badge } from '../common/Badge';
import {
  Play,
  CheckCircle,
  Clock,
  Sparkles,
  HelpCircle,
  RotateCcw,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Flame,
  Award,
} from 'lucide-react';

interface MissionListProps {
  missions: Mission[];
  onStartMission: (mission: Mission) => void;
}

export const MissionList: React.FC<MissionListProps> = ({ missions, onStartMission }) => {
  const { language, t } = useApp();
  const isAr = language === 'ar';

  const completedCount = missions.filter((m) => m.status === 'completed').length;
  const totalCount = missions.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  if (missions.length === 0) {
    return (
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3 shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center mx-auto">
          <BookOpen className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
            {isAr ? 'لا توجد مهام مجدولة بعد' : 'No missions planned yet'}
          </h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
            {isAr
              ? 'قم بتأكيد ملخص يومك المدرسي أو حدد وقتك لنقوم بجدولة مهامك تلقائياً.'
              : 'Confirm your school day record or pick your study time to generate daily missions.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3.5">
      {/* Header and Progress Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600">
              <Award className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
              {isAr ? 'إنجاز مهام اليوم' : "Today's Mission Progress"}
            </h3>
          </div>
          <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400">
            {isAr ? `${completedCount} من ${totalCount} مكتملة` : `${completedCount} of ${totalCount} done`}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-indigo-500 to-emerald-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Cards List */}
      <div className="space-y-3">
        {missions.map((mission) => {
          const isCompleted = mission.status === 'completed';
          const isStarted = mission.status === 'started';
          const isSkipped = mission.status === 'skipped';

          return (
            <div
              key={mission.id}
              className={`p-4 rounded-3xl border transition-all shadow-xs relative overflow-hidden flex flex-col justify-between space-y-3 ${
                isCompleted
                  ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-800/40'
                  : isSkipped
                  ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-indigo-300'
              }`}
            >
              {/* Top row: Subject badge, origin badge, duration */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50">
                    {mission.subject}
                  </span>
                  <Badge variant="demo">{mission.originTag}</Badge>
                  {mission.type === 'homework' && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/50">
                      {isAr ? 'رقمي / صورة' : 'Digital & Photo'}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    {mission.estimatedMinutes} {isAr ? 'د' : 'min'}
                  </span>
                </div>
              </div>

              {/* Title & Why Now */}
              <div>
                <h4
                  className={`text-sm font-bold ${
                    isCompleted
                      ? 'text-emerald-900 dark:text-emerald-200 line-through decoration-emerald-500/60'
                      : 'text-slate-900 dark:text-slate-100'
                  }`}
                >
                  {mission.title}
                </h4>

                {/* WHY NOW (Mandatory line) */}
                <div className="mt-1.5 flex items-start gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="leading-snug">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {isAr ? 'لماذا الآن: ' : 'Why now: '}
                    </span>
                    {mission.whyNow}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <div className="text-[10px] text-slate-400">
                  {mission.type === 'understand_lesson'
                    ? isAr ? 'فيديو قصير (Reel)' : 'Short Reel'
                    : mission.type === 'homework'
                    ? isAr ? 'واجب مدرسي' : 'Homework'
                    : mission.type === 'practice'
                    ? isAr ? 'تطبيق عملي' : 'Practice'
                    : isAr ? 'اختبار متكيف' : 'Adaptive Quiz'}
                </div>

                {isCompleted ? (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle className="w-4 h-4" />
                    <span>{isAr ? 'مكتملة بنجاح' : 'Completed'}</span>
                  </div>
                ) : (
                  <button
                    onClick={() => onStartMission(mission)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                      isStarted
                        ? 'bg-amber-500 hover:bg-amber-600 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>
                      {isStarted
                        ? isAr ? 'متابعة' : 'Resume'
                        : mission.type === 'homework'
                        ? isAr ? 'بدء الواجب' : 'Start Homework'
                        : isAr ? 'بدء المهمة' : 'Start'}
                    </span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
