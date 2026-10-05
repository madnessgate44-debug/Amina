/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { EvidenceEntry } from '../../types';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { Layers, Activity, Brain, Clock, ShieldCheck, HelpCircle } from 'lucide-react';

interface EvidenceLogViewerProps {
  evidenceLog: EvidenceEntry[];
}

export const EvidenceLogViewer: React.FC<EvidenceLogViewerProps> = ({ evidenceLog }) => {
  const { t, language } = useApp();
  const isAr = language === 'ar';

  if (!evidenceLog || evidenceLog.length === 0) {
    return (
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-dashed border-slate-200 dark:border-slate-700 text-center">
        <Layers className="w-6 h-6 text-slate-400 mx-auto mb-2 opacity-60" />
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          {t.curriculum.evidenceLogEmpty}
        </p>
      </div>
    );
  }

  // Reverse chronological
  const reversed = [...evidenceLog].reverse();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-indigo-500" />
          <span>{t.curriculum.evidenceLogTitle}</span>
        </h4>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800">
          {evidenceLog.length} {isAr ? 'أدلة مسجلة' : 'entries'}
        </span>
      </div>

      <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
        {reversed.map((entry, idx) => {
          const isPositive = entry.deltaApplied >= 0;
          const deltaColor = isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400';
          const deltaSign = isPositive ? '+' : '';

          const correctnessLabel =
            entry.correctness === 'full'
              ? isAr ? 'صحيح بالكامل' : 'Full'
              : entry.correctness === 'partial'
              ? isAr ? 'جزئي' : 'Partial'
              : isAr ? 'خطأ' : 'Wrong';

          const independenceLabel =
            entry.independence === 'unassisted'
              ? isAr ? 'مستقل (1.0)' : 'Unassisted (1.0)'
              : entry.independence === 'hinted'
              ? isAr ? 'بتلميح (0.65)' : 'Hinted (0.65)'
              : isAr ? 'كشف الحل (0.30)' : 'Revealed (0.30)';

          const modalityLabel =
            entry.modality === 'quiz'
              ? 'Quiz (1.0)'
              : entry.modality === 'homework'
              ? 'Homework (0.75)'
              : entry.modality === 'reel_check'
              ? 'Reel Check (0.60)'
              : 'Game (0.50)';

          const formattedDate = new Date(entry.timestamp).toLocaleString(isAr ? 'ar-EG' : 'en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <div
              key={entry.id || `${entry.timestamp}_${idx}`}
              className="p-3 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-xs text-xs space-y-2"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-1.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span
                    className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                      entry.correctness === 'full'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                        : entry.correctness === 'partial'
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                        : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                    }`}
                  >
                    {correctnessLabel}
                  </span>
                  <span className="px-2 py-0.5 rounded-md font-medium text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {modalityLabel}
                  </span>
                  <span className="px-2 py-0.5 rounded-md font-medium text-[10px] bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    {independenceLabel}
                  </span>
                </div>

                <div className="flex items-center gap-1 font-mono font-bold text-[11px]">
                  <span className="text-slate-400 dark:text-slate-500">Δ</span>
                  <span className={deltaColor}>
                    {deltaSign}{(entry.deltaApplied * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Weights breakdown row */}
              <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/60 p-2 rounded-lg font-mono">
                <div>
                  <span className="text-slate-400">{t.curriculum.difficultyLabel}: </span>
                  <span className="font-semibold">{entry.difficulty.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-slate-400">{t.curriculum.weightCombined}: </span>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                    {(entry.weights?.combinedWeight ?? 0).toFixed(3)}
                  </span>
                </div>
                {entry.scoreAfter !== undefined && (
                  <div>
                    <span className="text-slate-400">{t.curriculum.scoreAfter}: </span>
                    <span className="font-semibold">{(entry.scoreAfter * 100).toFixed(1)}%</span>
                  </div>
                )}
                {entry.confidenceAfter !== undefined && (
                  <div>
                    <span className="text-slate-400">{t.curriculum.confidenceAfter}: </span>
                    <span className="font-semibold">{(entry.confidenceAfter * 100).toFixed(1)}%</span>
                  </div>
                )}
              </div>

              {entry.notes && (
                <p className="text-[11px] text-slate-500 italic border-l-2 rtl:border-r-2 rtl:border-l-0 border-indigo-400 pl-2 rtl:pr-2">
                  {entry.notes}
                </p>
              )}

              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-0.5">
                <span className="flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />
                  {formattedDate}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-slate-400">
                  {isAr ? 'دليل موثق' : 'VERIFIED EVIDENCE'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
