/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Check, X } from 'lucide-react';

export interface ChoiceOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface ChoiceCardProps {
  questionText?: string;
  options: ChoiceOption[];
  onAnswerSelected: (isCorrect: boolean) => void;
  language?: 'ar' | 'en' | 'fr';
}

/**
 * ChoiceCard (Sub-Phase 11.4 — child_choose_answer)
 * 2-4 large, accessible touch targets for quick concept verification.
 */
export const ChoiceCard: React.FC<ChoiceCardProps> = ({
  questionText,
  options,
  onAnswerSelected,
  language = 'ar',
}) => {
  const isAr = language === 'ar';
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (opt: ChoiceOption) => {
    setSelectedId(opt.id);
    setTimeout(() => {
      onAnswerSelected(opt.isCorrect);
    }, 600);
  };

  return (
    <div
      className="w-full h-full flex flex-col justify-center max-w-lg mx-auto p-2"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {questionText && (
        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 text-center mb-2">
          {questionText}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {options.map((opt) => {
          const isSelected = selectedId === opt.id;
          const isCorrect = opt.isCorrect;

          let btnStyle =
            'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:border-indigo-400 hover:scale-101';
          if (isSelected) {
            btnStyle = isCorrect
              ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-100 scale-102 shadow-xs'
              : 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-900 dark:text-rose-100 animate-shake';
          }

          return (
            <button
              key={opt.id}
              type="button"
              disabled={selectedId !== null}
              onClick={() => handleSelect(opt)}
              className={`min-h-[48px] p-3 rounded-2xl border-2 font-bold text-xs sm:text-sm text-center flex items-center justify-between transition-all ${btnStyle}`}
            >
              <span className="flex-1">{opt.text}</span>
              {isSelected && (
                <span className="shrink-0 ml-2">
                  {isCorrect ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <X className="w-4 h-4 text-rose-600" />
                  )}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
