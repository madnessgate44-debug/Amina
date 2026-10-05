/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Volume2, Sparkles, CheckCircle2 } from 'lucide-react';

interface TapWordCardProps {
  word: string;
  definition: string;
  exampleSentence?: string;
  sourceRefText?: string;
  onTappedWord: () => void;
  language?: 'ar' | 'en' | 'fr';
}

/**
 * TapWordCard (Sub-Phase 11.4 — child_tap_word)
 * Displays a textbook word with diacritics. When tapped, reveals pronunciation,
 * definition, and example sentence with immediate visual feedback.
 */
export const TapWordCard: React.FC<TapWordCardProps> = ({
  word,
  definition,
  exampleSentence,
  sourceRefText,
  onTappedWord,
  language = 'ar',
}) => {
  const isAr = language === 'ar';
  const [hasTapped, setHasTapped] = useState(false);

  const handleTap = () => {
    setHasTapped(true);
    onTappedWord();
  };

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center p-3 animate-in fade-in zoom-in-95 duration-200"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-800 border-2 border-indigo-200 dark:border-indigo-800 p-4 shadow-sm flex flex-col items-center text-center space-y-3">
        {/* Word Display with Tashkeel */}
        <button
          type="button"
          onClick={handleTap}
          className={`w-full py-4 px-6 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-1 ${
            hasTapped
              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 text-amber-900 dark:text-amber-100 shadow-sm'
              : 'bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 border-indigo-300 dark:border-indigo-700 text-indigo-900 dark:text-indigo-100 animate-pulse hover:scale-102'
          }`}
        >
          <span className="text-2xl sm:text-3xl font-black tracking-wide font-serif">
            {word}
          </span>
          <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 mt-1">
            <Volume2 className="w-3.5 h-3.5" />
            <span>{hasTapped ? (isAr ? 'اضغط للاستماع مجدداً' : 'Tap to hear again') : (isAr ? 'المس الكلمة لاكتشاف معناها!' : 'Tap to reveal meaning!')}</span>
          </span>
        </button>

        {/* Revealed Meaning Card */}
        {hasTapped && (
          <div className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-right rtl:text-right ltr:text-left space-y-1.5 animate-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isAr ? 'المعنى في الكتاب المدرسي:' : 'Textbook Definition:'}</span>
            </div>
            <p className="text-xs text-slate-800 dark:text-slate-200 font-semibold leading-relaxed">
              {definition}
            </p>
            {exampleSentence && (
              <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                {isAr ? 'مثال:' : 'Example:'} «{exampleSentence}»
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
