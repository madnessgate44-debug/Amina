/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowUpDown, Check, ArrowRight, ArrowLeft } from 'lucide-react';

export interface SequenceStepItem {
  id: string;
  text: string;
  correctIndex: number;
}

interface SequenceOrderBoardProps {
  items: SequenceStepItem[];
  instructionAr: string;
  instructionEn: string;
  onSequenceCorrect: () => void;
  language?: 'ar' | 'en' | 'fr';
}

/**
 * SequenceOrderBoard (Sub-Phase 11.4 — child_order_sequence)
 * Interactive reordering board for timelines and process steps.
 */
export const SequenceOrderBoard: React.FC<SequenceOrderBoardProps> = ({
  items,
  instructionAr,
  instructionEn,
  onSequenceCorrect,
  language = 'ar',
}) => {
  const isAr = language === 'ar';

  // Initial scrambled order
  const [currentList, setCurrentList] = useState<SequenceStepItem[]>(() =>
    [...items].sort(() => Math.random() - 0.5)
  );
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleItemClick = (idx: number) => {
    if (selectedIndex === null) {
      setSelectedIndex(idx);
    } else if (selectedIndex === idx) {
      setSelectedIndex(null);
    } else {
      // Swap items
      const updated = [...currentList];
      const temp = updated[selectedIndex];
      updated[selectedIndex] = updated[idx];
      updated[idx] = temp;
      setCurrentList(updated);
      setSelectedIndex(null);

      // Check if all in correct order
      const isCorrect = updated.every((item, i) => item.correctIndex === i);
      if (isCorrect) {
        setIsSuccess(true);
        setTimeout(onSequenceCorrect, 700);
      }
    }
  };

  return (
    <div
      className="w-full h-full flex flex-col justify-center max-w-md mx-auto p-2"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-1.5 px-1">
        <span>{isAr ? instructionAr : instructionEn}</span>
        <span className="text-indigo-600 dark:text-indigo-400">
          {isAr ? 'اضغط عنصرين للتبديل' : 'Tap two to swap'}
        </span>
      </div>

      <div className="space-y-1.5">
        {currentList.map((item, idx) => {
          const isSelected = selectedIndex === idx;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleItemClick(idx)}
              className={`w-full p-2.5 px-3 rounded-xl border-2 text-xs font-bold transition-all flex items-center justify-between text-right rtl:text-right ltr:text-left ${
                isSuccess
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-900 dark:text-emerald-100'
                  : isSelected
                  ? 'bg-indigo-100 dark:bg-indigo-950 border-indigo-500 text-indigo-900 dark:text-indigo-100 scale-102 shadow-xs'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:border-indigo-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                <span>{item.text}</span>
              </div>
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>
          );
        })}
      </div>
    </div>
  );
};
