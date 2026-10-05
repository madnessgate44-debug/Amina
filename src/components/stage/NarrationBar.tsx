/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX, RotateCcw, Sparkles } from 'lucide-react';

interface NarrationBarProps {
  spokenText: string;
  isSpeaking: boolean;
  isMuted: boolean;
  sourceRefText?: string;
  language?: 'ar' | 'en' | 'fr';
  onReplayAudio?: () => void;
  onToggleMute?: () => void;
  className?: string;
}

/**
 * Narration Bar (Middle 20% of The Stage - Sub-Phase 11.2 & 11.7)
 * Displays live synchronized subtitles with animated word highlighting,
 * audio status indicator, speaker replay, and silent mode toggle.
 */
export const NarrationBar: React.FC<NarrationBarProps> = ({
  spokenText,
  isSpeaking,
  isMuted,
  sourceRefText,
  language = 'ar',
  onReplayAudio,
  onToggleMute,
  className = '',
}) => {
  const isAr = language === 'ar';
  const [highlightWordIndex, setHighlightWordIndex] = useState<number>(0);

  // Synchronize simulated word highlighting across sentence duration when speaking
  useEffect(() => {
    if (!isSpeaking || !spokenText) {
      setHighlightWordIndex(0);
      return;
    }

    const words = spokenText.split(/\s+/).filter(Boolean);
    if (words.length === 0) return;

    // Approximate reading speed ~ 220ms per word
    const interval = setInterval(() => {
      setHighlightWordIndex((prev) => (prev < words.length - 1 ? prev + 1 : prev));
    }, 240);

    return () => clearInterval(interval);
  }, [spokenText, isSpeaking]);

  const words = spokenText.split(/\s+/).filter(Boolean);

  return (
    <div
      className={`w-full bg-white/95 dark:bg-slate-900/95 border-y border-slate-200 dark:border-slate-800 px-4 py-3 flex flex-col justify-center shadow-xs backdrop-blur-md ${className}`}
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <div className="flex items-center justify-between mb-1.5">
        {/* Speaker Indicator with Audio Wave */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span
              className={`absolute inline-flex h-full w-full rounded-full ${
                isSpeaking ? 'bg-indigo-400 animate-ping' : 'bg-slate-400'
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                isSpeaking ? 'bg-indigo-600' : 'bg-slate-500'
              }`}
            />
          </span>

          <span className="text-[11px] font-black text-indigo-700 dark:text-indigo-400 flex items-center gap-1">
            <span>{isAr ? 'نور يوجهك:' : 'Nour is speaking:'}</span>
            {isSpeaking && (
              <span className="flex items-end gap-0.5 h-3 ml-1">
                <span className="w-0.5 h-2 bg-indigo-500 rounded-full animate-[bounce_0.6s_infinite]" />
                <span className="w-0.5 h-3 bg-indigo-500 rounded-full animate-[bounce_0.8s_infinite_100ms]" />
                <span className="w-0.5 h-1.5 bg-indigo-500 rounded-full animate-[bounce_0.5s_infinite_200ms]" />
              </span>
            )}
          </span>
        </div>

        {/* Source Reference Tag & Audio Controls */}
        <div className="flex items-center gap-1.5">
          {sourceRefText && (
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
              📖 {sourceRefText}
            </span>
          )}

          <button
            type="button"
            onClick={onReplayAudio}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold transition-all shadow-2xs hover:scale-102 cursor-pointer"
            title={isAr ? 'استمعي لصوت نور' : 'Play Nour Voice'}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{isAr ? 'صوت نور' : 'Voice'}</span>
          </button>

          <button
            type="button"
            onClick={onReplayAudio}
            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isAr ? 'إعادة الاستماع' : 'Replay Voice'}
            aria-label={isAr ? 'إعادة الاستماع' : 'Replay Voice'}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onToggleMute}
            className={`p-1.5 rounded-lg transition-colors ${
              isMuted
                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                : 'text-slate-500 hover:text-indigo-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={isMuted ? (isAr ? 'تشغيل الصوت' : 'Unmute') : isAr ? 'كتم الصوت' : 'Mute'}
            aria-label={isMuted ? (isAr ? 'تشغيل الصوت' : 'Unmute') : isAr ? 'كتم الصوت' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Live Caption with Word-by-Word Highlight */}
      <p className="text-xs sm:text-sm font-medium leading-relaxed text-slate-800 dark:text-slate-100 min-h-10 flex flex-wrap items-center gap-1">
        {words.map((word, idx) => {
          const isCurrentWord = isSpeaking && idx === highlightWordIndex;
          const isPastWord = isSpeaking && idx < highlightWordIndex;

          return (
            <span
              key={idx}
              className={`transition-all duration-150 px-0.5 rounded-sm ${
                isCurrentWord
                  ? 'bg-amber-200 dark:bg-amber-900/60 text-amber-950 dark:text-amber-100 font-bold scale-105 shadow-2xs'
                  : isPastWord
                  ? 'text-slate-900 dark:text-slate-100 font-semibold'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              {word}
            </span>
          );
        })}
      </p>
    </div>
  );
};
