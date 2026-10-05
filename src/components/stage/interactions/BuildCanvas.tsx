/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Plus, Check, Sparkles, Layers } from 'lucide-react';

export interface BuildNode {
  id: string;
  title: string;
  icon?: string;
  isPlaced: boolean;
}

interface BuildCanvasProps {
  centerConcept: string;
  nodes: BuildNode[];
  onBuildComplete: () => void;
  language?: 'ar' | 'en' | 'fr';
}

/**
 * BuildCanvas (Sub-Phase 11.4 — child_build)
 * Interactive concept-map and diagram builder on The Stage.
 */
export const BuildCanvas: React.FC<BuildCanvasProps> = ({
  centerConcept,
  nodes,
  onBuildComplete,
  language = 'ar',
}) => {
  const isAr = language === 'ar';
  const [placedNodeIds, setPlacedNodeIds] = useState<string[]>([]);

  const unplaced = nodes.filter((n) => !placedNodeIds.includes(n.id));

  const handleAttachNode = (nodeId: string) => {
    const next = [...placedNodeIds, nodeId];
    setPlacedNodeIds(next);

    if (next.length === nodes.length) {
      setTimeout(onBuildComplete, 700);
    }
  };

  return (
    <div
      className="w-full h-full flex flex-col justify-between max-w-lg mx-auto p-2"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* Central Interactive Builder Surface */}
      <div className="relative w-full h-24 bg-indigo-50/70 dark:bg-slate-900/60 rounded-2xl border-2 border-dashed border-indigo-300 dark:border-indigo-800 p-2 flex items-center justify-center overflow-hidden">
        {/* Center Node */}
        <div className="z-10 px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-black text-xs shadow-md">
          {centerConcept}
        </div>

        {/* Orbiting Placed Branches */}
        {placedNodeIds.map((id, idx) => {
          const node = nodes.find((n) => n.id === id);
          if (!node) return null;

          // Position around center
          const angle = (idx / nodes.length) * 2 * Math.PI;
          const x = 50 + 38 * Math.cos(angle);
          const y = 50 + 34 * Math.sin(angle);

          return (
            <div
              key={id}
              style={{ left: `${x}%`, top: `${y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 px-2 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 border border-emerald-400 text-[10px] font-bold shadow-xs animate-in zoom-in-75 duration-300 whitespace-nowrap"
            >
              {node.title}
            </div>
          );
        })}
      </div>

      {/* Available Building Elements to Attach */}
      <div className="mt-2">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-1">
          <span>{isAr ? 'المس الفكرة لربطها بشريان النيل:' : 'Tap to connect to Nile concept:'}</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">
            {placedNodeIds.length} / {nodes.length}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {unplaced.map((node) => (
            <button
              key={node.id}
              type="button"
              onClick={() => handleAttachNode(node.id)}
              className="flex-1 min-w-[120px] p-2 rounded-xl bg-white dark:bg-slate-800 border-2 border-indigo-200 dark:border-indigo-700 hover:border-indigo-400 text-indigo-900 dark:text-indigo-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all hover:scale-102"
            >
              <Plus className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>{node.title}</span>
            </button>
          ))}
          {unplaced.length === 0 && (
            <div className="w-full text-center py-2 text-emerald-600 font-bold text-xs flex items-center justify-center gap-1">
              <Check className="w-4 h-4" />
              <span>{isAr ? 'اكتمل المخطط المفاهيمي بنجاح!' : 'Concept map complete!'}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
