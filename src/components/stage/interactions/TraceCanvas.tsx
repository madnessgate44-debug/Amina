/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { RotateCcw, Check, Sparkles } from 'lucide-react';

interface TraceCanvasProps {
  letterPrompt: string; // e.g. "أ"
  instructionAr: string;
  instructionEn: string;
  onTraceComplete: () => void;
  language?: 'ar' | 'en' | 'fr';
}

/**
 * TraceCanvas (Sub-Phase 11.4 — child_trace)
 * High-precision touch & pointer tracing canvas for Arabic calligraphy letter formation.
 */
export const TraceCanvas: React.FC<TraceCanvasProps> = ({
  letterPrompt,
  instructionAr,
  instructionEn,
  onTraceComplete,
  language = 'ar',
}) => {
  const isAr = language === 'ar';
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokePointsCount, setStrokePointsCount] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high-dpi resolution
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 14;
    ctx.strokeStyle = '#0284c7';
  }, []);

  const handleStart = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setStrokePointsCount((prev) => prev + 1);
  };

  const handleMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    setStrokePointsCount((prev) => prev + 1);
  };

  const handleEnd = () => {
    setIsDrawing(false);
    if (strokePointsCount > 15 && !hasCompleted) {
      setHasCompleted(true);
      setTimeout(onTraceComplete, 700);
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setStrokePointsCount(0);
    setHasCompleted(false);
  };

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-between p-2 max-w-sm mx-auto"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <div className="flex items-center justify-between w-full px-2 text-[11px] font-bold text-slate-600 dark:text-slate-300">
        <span>{isAr ? instructionAr : instructionEn}</span>
        <button
          type="button"
          onClick={handleClear}
          className="flex items-center gap-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{isAr ? 'مسح' : 'Clear'}</span>
        </button>
      </div>

      {/* Tracing Canvas with Calligraphy Background Guide */}
      <div className="relative w-full h-32 bg-amber-50/60 dark:bg-slate-900/80 rounded-2xl border-2 border-dashed border-indigo-300 dark:border-indigo-700 flex items-center justify-center overflow-hidden touch-none shadow-xs">
        {/* Calligraphy Guidelines (Ruling lines) */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-b border-indigo-200 dark:border-indigo-900 pointer-events-none" />

        {/* Faint Dashed Letter Guide (Alif with Hamza) */}
        <span className="text-7xl font-serif text-slate-300 dark:text-slate-700 select-none pointer-events-none opacity-80">
          {letterPrompt}
        </span>

        {/* Interactive Drawing Surface */}
        <canvas
          ref={canvasRef}
          onPointerDown={handleStart}
          onPointerMove={handleMove}
          onPointerUp={handleEnd}
          onPointerLeave={handleEnd}
          className="absolute inset-0 w-full h-full cursor-crosshair"
        />

        {hasCompleted && (
          <div className="absolute inset-0 bg-emerald-500/20 backdrop-blur-2xs flex items-center justify-center animate-in fade-in duration-300 pointer-events-none">
            <span className="p-2 rounded-full bg-emerald-500 text-white shadow-lg animate-bounce">
              <Check className="w-6 h-6" />
            </span>
          </div>
        )}
      </div>

      <div className="text-[10px] text-slate-400 text-center">
        {isAr ? 'مرر إصبعك من أعلى إلى أسفل لرسم الألف باستقامة' : 'Trace top-to-bottom smoothly'}
      </div>
    </div>
  );
};
