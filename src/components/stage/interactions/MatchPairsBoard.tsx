/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Check, Sparkles } from 'lucide-react';

export interface MatchPair {
  id: string;
  leftText: string;
  rightText: string;
}

interface MatchPairsBoardProps {
  pairs: MatchPair[];
  onAllMatched: () => void;
  language?: 'ar' | 'en' | 'fr';
}

/**
 * MatchPairsBoard (Sub-Phase 11.4 — child_match_pairs)
 * Two interactive columns where student connects textbook words to their definitions.
 */
export const MatchPairsBoard: React.FC<MatchPairsBoardProps> = ({
  pairs,
  onAllMatched,
  language = 'ar',
}) => {
  const isAr = language === 'ar';
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [errorPair, setErrorPair] = useState<{ left: string; right: string } | null>(null);

  // Shuffled rights on first mount
  const [shuffledRights] = useState(() =>
    [...pairs].sort(() => Math.random() - 0.5)
  );

  const handleLeftClick = (id: string) => {
    if (matchedIds.includes(id)) return;
    setErrorPair(null);
    setSelectedLeft(id);

    if (selectedRight) {
      checkMatch(id, selectedRight);
    }
  };

  const handleRightClick = (id: string) => {
    if (matchedIds.includes(id)) return;
    setErrorPair(null);
    setSelectedRight(id);

    if (selectedLeft) {
      checkMatch(selectedLeft, id);
    }
  };

  const checkMatch = (leftId: string, rightId: string) => {
    if (leftId === rightId) {
      // Correct match!
      const nextMatched = [...matchedIds, leftId];
      setMatchedIds(nextMatched);
      setSelectedLeft(null);
      setSelectedRight(null);

      if (nextMatched.length === pairs.length) {
        setTimeout(() => {
          onAllMatched();
        }, 500);
      }
    } else {
      // Mismatch
      setErrorPair({ left: leftId, right: rightId });
      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
        setErrorPair(null);
      }, 700);
    }
  };

  return (
    <div
      className="w-full h-full flex flex-col justify-center px-3 py-2 animate-in fade-in duration-200"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <div className="grid grid-cols-2 gap-2.5 max-w-lg mx-auto w-full">
        {/* Left Column (Words) */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block text-center">
            {isAr ? 'الكلمة' : 'Word'}
          </span>
          {pairs.map((p) => {
            const isMatched = matchedIds.includes(p.id);
            const isSelected = selectedLeft === p.id;
            const isError = errorPair?.left === p.id;

            return (
              <button
                key={p.id}
                type="button"
                disabled={isMatched}
                onClick={() => handleLeftClick(p.id)}
                className={`w-full min-h-[44px] p-2 rounded-xl text-xs font-bold border-2 transition-all flex items-center justify-between text-right rtl:text-right ltr:text-left ${
                  isMatched
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-800 dark:text-emerald-200 opacity-80'
                    : isError
                    ? 'bg-rose-50 border-rose-400 text-rose-800 animate-shake'
                    : isSelected
                    ? 'bg-indigo-100 dark:bg-indigo-950 border-indigo-500 text-indigo-950 dark:text-indigo-100 scale-102 shadow-xs'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:border-indigo-300'
                }`}
              >
                <span>{p.leftText}</span>
                {isMatched && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Right Column (Meanings / Definitions) */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block text-center">
            {isAr ? 'المعنى' : 'Definition'}
          </span>
          {shuffledRights.map((p) => {
            const isMatched = matchedIds.includes(p.id);
            const isSelected = selectedRight === p.id;
            const isError = errorPair?.right === p.id;

            return (
              <button
                key={p.id}
                type="button"
                disabled={isMatched}
                onClick={() => handleRightClick(p.id)}
                className={`w-full min-h-[44px] p-2 rounded-xl text-[11px] font-medium border-2 transition-all flex items-center justify-between text-right rtl:text-right ltr:text-left leading-snug ${
                  isMatched
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-800 dark:text-emerald-200 opacity-80'
                    : isError
                    ? 'bg-rose-50 border-rose-400 text-rose-800 animate-shake'
                    : isSelected
                    ? 'bg-indigo-100 dark:bg-indigo-950 border-indigo-500 text-indigo-950 dark:text-indigo-100 scale-102 shadow-xs'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-indigo-300'
                }`}
              >
                <span>{p.rightText}</span>
                {isMatched && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
