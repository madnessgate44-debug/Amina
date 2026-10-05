/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { DailyReview } from '../../types';
import { Badge } from '../common/Badge';
import {
  Calendar,
  CheckCircle,
  Clock,
  Sparkles,
  AlertCircle,
  Award,
  ArrowRight,
  ArrowLeft,
  X,
  Compass,
  BookOpen,
} from 'lucide-react';

interface DailyReviewModalProps {
  review: DailyReview;
  onClose: () => void;
}

export const DailyReviewModal: React.FC<DailyReviewModalProps> = ({ review, onClose }) => {
  const { language } = useApp();
  const isAr = language === 'ar';

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[85vh] overflow-hidden relative">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                {isAr ? 'المراجعة اليومية الهادئة' : 'Calm Daily Review'}
              </h3>
              <p className="text-[10px] text-slate-500">{review.date}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs sm:text-sm">
          {/* Grounded Praise Banner (Specific wins celebrated) */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 space-y-1.5">
            <div className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-300 font-bold text-xs">
              <Sparkles className="w-4 h-4" />
              <span>{isAr ? 'إنجاز ملموس اليوم' : 'Specific Win Today'}</span>
            </div>
            <p className="text-slate-800 dark:text-slate-200 leading-relaxed text-right rtl:text-right font-medium">
              {review.tonePraise}
            </p>
          </div>

          {/* Action Note (Strict No-Guilt Rule: "Two missions remain. Let's decide what to do now.") */}
          <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-2.5">
            <Compass className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div className="text-right rtl:text-right space-y-0.5">
              <span className="font-bold text-slate-900 dark:text-slate-100 block text-xs">
                {isAr ? 'الخطوة التالية بهدوء:' : 'Next Step:'}
              </span>
              <p className="text-slate-600 dark:text-slate-300 text-xs leading-snug">
                {review.uncompletedActionNote}
              </p>
            </div>
          </div>

          {/* 1. Completed Missions */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{isAr ? 'ما أُنجز اليوم:' : 'What was completed today:'}</span>
              </span>
              <span className="text-[11px] text-slate-400">
                {review.completedMissions.length} {isAr ? 'مهام' : 'missions'}
              </span>
            </div>
            {review.completedMissions.length === 0 ? (
              <p className="text-[11px] text-slate-400 p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl text-center">
                {isAr ? 'لم تُكتمل أي مهام اليوم بعد.' : 'No missions completed yet today.'}
              </p>
            ) : (
              <div className="space-y-1.5">
                {review.completedMissions.map((m) => (
                  <div
                    key={m.id}
                    className="p-2.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 flex items-center justify-between text-xs"
                  >
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{m.title}</span>
                    <Badge variant="accent">{m.subject}</Badge>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2. Not Completed Missions */}
          {review.notCompletedMissions.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                <span className="flex items-center gap-1 text-slate-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{isAr ? 'مهام باقية (للمتابعة أو التأجيل):' : 'Remaining missions:'}</span>
                </span>
                <span className="text-[11px] text-slate-400">
                  {review.notCompletedMissions.length}
                </span>
              </div>
              <div className="space-y-1.5">
                {review.notCompletedMissions.map((m) => (
                  <div
                    key={m.id}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400"
                  >
                    <span>{m.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800">
                      {m.subject}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Difficult Concepts (Struggled today) */}
          {review.difficultConcepts.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{isAr ? 'نقاط واجهت فيها تحدياً اليوم:' : 'What was tricky today:'}</span>
              </div>
              <div className="space-y-1.5">
                {review.difficultConcepts.map((c) => (
                  <div
                    key={c.conceptId}
                    className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 text-xs space-y-1 text-right rtl:text-right"
                  >
                    <div className="flex items-center justify-between font-bold text-amber-900 dark:text-amber-200">
                      <span>{isAr ? c.nameAr : c.nameEn}</span>
                      <span className="text-[10px] text-slate-500">{c.subject}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                      {c.struggleNote}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Mastered Concepts */}
          {review.masteredConcepts.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <Award className="w-3.5 h-3.5" />
                <span>{isAr ? 'مفاهيم انتقلت لمرحلة الإتقان:' : 'What was mastered today:'}</span>
              </div>
              <div className="space-y-1.5">
                {review.masteredConcepts.map((m) => (
                  <div
                    key={m.conceptId}
                    className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs"
                  >
                    <span className="font-bold text-emerald-900 dark:text-emerald-200">
                      {isAr ? m.nameAr : m.nameEn}
                    </span>
                    <Badge variant="official">
                      {Math.round(m.score * 100)}%
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. What Needs Tomorrow's Attention */}
          {review.needsAttentionTomorrow.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{isAr ? 'عناية خطة الغد:' : 'Needs attention tomorrow:'}</span>
              </div>
              <div className="space-y-1.5">
                {review.needsAttentionTomorrow.map((item) => (
                  <div
                    key={item.conceptId}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs text-right rtl:text-right"
                  >
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {isAr ? item.nameAr : item.nameEn}
                    </span>
                    <span className="text-[11px] text-slate-500">{item.reason}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
          <p className="text-[11px] text-slate-400">
            {isAr ? 'محفوظ في سجلك دائماً وبإمكانك مراجعته أي وقت' : 'Saved in history; accessible anytime'}
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all"
          >
            {isAr ? 'إغلاق ومتابعة اليوم' : 'Close & Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};
