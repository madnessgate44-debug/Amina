/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Renders the reel's visual. A single <canvas>, drawn from the reel's own
 * curriculum text, so the feed shows a real graphic instead of a wall of text.
 *
 * Reduced motion still draws, but without the entrance animation: the child
 * gets the same information, just static.
 */

import React, { useEffect, useMemo, useRef } from 'react';
import { Reel } from '../../types/reel';
import { buildReelVisualModel, isDrawableReelVisual, REEL_VISUAL_LABEL } from '../../services/reels/reelVisual';
import { drawReelVisual, DARK_PALETTE } from '../../services/reels/reelVisualCanvas';

interface ReelVisualProps {
  reel: Reel;
  isAr: boolean;
  reducedMotion: boolean;
  className?: string;
}

const CANVAS_HEIGHT = 150;

export const ReelVisual: React.FC<ReelVisualProps> = ({ reel, isAr, reducedMotion, className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const model = useMemo(() => buildReelVisualModel(reel, isAr), [reel, isAr]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!isDrawableReelVisual(model)) return;

    const parent = canvas.parentElement;
    const width = Math.max(240, Math.round(parent?.clientWidth || canvas.clientWidth || 320));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(CANVAS_HEIGHT * dpr);
    canvas.style.width = '100%';
    canvas.style.height = `${CANVAS_HEIGHT}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawReelVisual(ctx, model, { width, height: CANVAS_HEIGHT, isAr }, DARK_PALETTE);
  }, [model, isAr, reducedMotion]);

  if (!isDrawableReelVisual(model)) return null;

  const kindLabel = isAr
    ? REEL_VISUAL_LABEL[model.kind].ar
    : reel.language === 'fr'
    ? REEL_VISUAL_LABEL[model.kind].fr
    : REEL_VISUAL_LABEL[model.kind].en;

  return (
    <figure
      className={`mt-4 rounded-2xl border border-white/15 bg-white/5 overflow-hidden ${className}`}
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <canvas
        ref={canvasRef}
        className={`w-full block ${reducedMotion ? '' : 'animate-in fade-in zoom-in-95 duration-300'}`}
        role="img"
        aria-label={`${kindLabel}: ${model.title}. ${model.caption}`}
      />
      <figcaption className="flex items-center justify-between gap-2 px-3 py-1.5 text-[12px] text-slate-400 border-t border-white/10">
        <span className="font-black text-cyan-300 uppercase tracking-widest">{kindLabel}</span>
        <span className="truncate">{model.sourceLabel}</span>
      </figcaption>
    </figure>
  );
};
