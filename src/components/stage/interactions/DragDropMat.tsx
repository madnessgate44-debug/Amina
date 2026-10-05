/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Check, ShieldCheck, AlertCircle } from 'lucide-react';

export interface DragItem {
  id: string;
  text: string;
  correctZoneId: string;
}

export interface DropZone {
  id: string;
  title: string;
  color: 'emerald' | 'rose' | 'indigo' | 'amber';
}

interface DragDropMatProps {
  items: DragItem[];
  zones: DropZone[];
  onComplete: () => void;
  language?: 'ar' | 'en' | 'fr';
}

/**
 * DragDropMat (Sub-Phase 11.4 — child_drag_drop)
 * Responsive categorization mat playable with one hand on mobile.
 */
export const DragDropMat: React.FC<DragDropMatProps> = ({
  items,
  zones,
  onComplete,
  language = 'ar',
}) => {
  const isAr = language === 'ar';
  const [remainingItems, setRemainingItems] = useState<DragItem[]>(items);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(items[0]?.id || null);
  const [placedItems, setPlacedItems] = useState<Record<string, string[]>>({});
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  const selectedItem = remainingItems.find((i) => i.id === selectedItemId) || remainingItems[0];

  const handlePlaceIntoZone = (zoneId: string) => {
    if (!selectedItem) return;

    if (selectedItem.correctZoneId === zoneId) {
      // Correct!
      const nextRemaining = remainingItems.filter((i) => i.id !== selectedItem.id);
      setPlacedItems((prev) => ({
        ...prev,
        [zoneId]: [...(prev[zoneId] || []), selectedItem.text],
      }));
      setRemainingItems(nextRemaining);
      setSelectedItemId(nextRemaining[0]?.id || null);
      setFeedbackError(null);

      if (nextRemaining.length === 0) {
        setTimeout(onComplete, 600);
      }
    } else {
      // Incorrect
      setFeedbackError(zoneId);
      setTimeout(() => setFeedbackError(null), 600);
    }
  };

  return (
    <div
      className="w-full h-full flex flex-col justify-between p-2 max-w-lg mx-auto animate-in fade-in duration-200"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* Current Active Item to Place */}
      <div className="text-center my-auto">
        {selectedItem ? (
          <div className="inline-block p-2.5 px-4 rounded-2xl bg-amber-100 dark:bg-amber-950/70 border-2 border-amber-400 text-amber-950 dark:text-amber-100 font-bold text-xs sm:text-sm shadow-xs animate-bounce duration-1000">
            <span>{isAr ? 'أين تصنف هذا السلوك؟' : 'Where does this belong?'}</span>
            <div className="text-sm sm:text-base font-black text-slate-900 dark:text-slate-100 mt-1">
              «{selectedItem.text}»
            </div>
          </div>
        ) : (
          <div className="text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center gap-1.5">
            <Check className="w-4 h-4" />
            <span>{isAr ? 'تم تصنيف جميع السلوكيات بنجاح!' : 'All items categorized!'}</span>
          </div>
        )}
      </div>

      {/* Target Drop Zones */}
      <div className="grid grid-cols-2 gap-2 mt-2">
        {zones.map((zone) => {
          const isErr = feedbackError === zone.id;
          const placedCount = (placedItems[zone.id] || []).length;

          const isGood = zone.color === 'emerald';
          return (
            <button
              key={zone.id}
              type="button"
              disabled={!selectedItem}
              onClick={() => handlePlaceIntoZone(zone.id)}
              className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-center min-h-[58px] ${
                isErr
                  ? 'border-rose-500 bg-rose-50 dark:bg-rose-950 animate-shake'
                  : isGood
                  ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60'
                  : 'border-rose-300 dark:border-rose-700 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50'
              }`}
            >
              <div className="flex items-center gap-1 text-xs font-black text-slate-800 dark:text-slate-100">
                {isGood ? (
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-500" />
                )}
                <span>{zone.title}</span>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                {isAr ? `(المصنفة: ${placedCount})` : `(${placedCount} placed)`}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
