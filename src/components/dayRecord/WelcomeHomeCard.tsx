/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { VoiceSpeakButton } from '../voice/VoiceSpeakButton';
import { Sparkles, MessageCircle, X, ArrowRight, ArrowLeft } from 'lucide-react';

interface WelcomeHomeCardProps {
  onStartReconstruction: () => void;
}

export const WelcomeHomeCard: React.FC<WelcomeHomeCardProps> = ({ onStartReconstruction }) => {
  const { t, language, student, isWelcomeHomeDismissed, dismissWelcomeHome } = useApp();
  const isArabic = language === 'ar';

  const studentName = student?.name || (isArabic ? 'صديقي' : 'Friend');

  if (isWelcomeHomeDismissed) {
    // Small, non-nagging entry point per spec: "Tell my Companion about today"
    return (
      <button
        type="button"
        onClick={onStartReconstruction}
        className="w-full p-3 rounded-2xl bg-indigo-50/90 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-between text-xs font-semibold text-indigo-900 dark:text-indigo-200 hover:bg-indigo-100/80 dark:hover:bg-indigo-950/60 transition-all shadow-xs"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-xl bg-indigo-600 text-white">
            <MessageCircle className="w-4 h-4" />
          </div>
          <span>{t.dayRecord.tellCompanion}</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-400 font-bold">
          <span>{t.dayRecord.startReconstruction}</span>
          {isArabic ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
        </div>
      </button>
    );
  }

  // Full Welcome Home Card trigger
  return (
    <div className="p-4 rounded-3xl bg-linear-to-r from-amber-500/10 via-indigo-500/10 to-indigo-600/10 border border-indigo-200/80 dark:border-indigo-800/60 shadow-sm relative overflow-hidden space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-2xl bg-amber-500 text-white shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {t.dayRecord.welcomeHomeTitle}
            </h3>
            <span className="text-[10px] text-amber-700 dark:text-amber-400 font-medium">
              14:30 PM • Post-School Trigger
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={dismissWelcomeHome}
          className="p-1.5 rounded-full hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors"
          title={t.dayRecord.dismiss}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-bold text-indigo-950 dark:text-indigo-100">
            «{t.dayRecord.welcomeHomePrompt}»
          </p>
          <VoiceSpeakButton
            text={`${t.dayRecord.welcomeHomePrompt}. ${t.dayRecord.welcomeHomeSubtitle}`}
            size="sm"
            label={isArabic ? 'استمع' : 'Listen'}
          />
        </div>
        <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
          {t.dayRecord.welcomeHomeSubtitle}
        </p>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={onStartReconstruction}
          className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>{t.dayRecord.startReconstruction}</span>
        </button>

        <button
          type="button"
          onClick={dismissWelcomeHome}
          className="py-2.5 px-3.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {t.dayRecord.dismiss}
        </button>
      </div>
    </div>
  );
};
