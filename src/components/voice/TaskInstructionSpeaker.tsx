/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { tutorSpeechService, EncouragementType } from '../../services/voice/tutorSpeechService';
import { Volume2, VolumeX, RotateCcw, Sparkles } from 'lucide-react';
import { Language } from '../../types';

interface TaskInstructionSpeakerProps {
  instructionText: string;
  studentName?: string;
  autoSpeak?: boolean;
  language?: Language;
  encouragingFeedback?: {
    type: EncouragementType;
    customNote?: string;
  } | null;
  className?: string;
}

export const TaskInstructionSpeaker: React.FC<TaskInstructionSpeakerProps> = ({
  instructionText,
  studentName = 'أمينة',
  autoSpeak = false,
  language = 'ar',
  encouragingFeedback = null,
  className = '',
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const isAr = language === 'ar';

  // Speak instruction on mount or when instruction changes if autoSpeak is true
  useEffect(() => {
    if (autoSpeak && instructionText) {
      tutorSpeechService.speakTaskInstruction(instructionText, studentName, {
        language,
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
      });
    }
  }, [instructionText, autoSpeak, language, studentName]);

  // When encouraging feedback arrives, speak it out loud
  useEffect(() => {
    if (encouragingFeedback) {
      tutorSpeechService.speakEncouragingFeedback(
        encouragingFeedback.type,
        studentName,
        encouragingFeedback.customNote,
        {
          language,
          onStart: () => setIsSpeaking(true),
          onEnd: () => setIsSpeaking(false),
        }
      );
    }
  }, [encouragingFeedback, studentName, language]);

  const handleSpeakInstruction = () => {
    if (isSpeaking) {
      tutorSpeechService.stopSpeaking();
      setIsSpeaking(false);
    } else {
      tutorSpeechService.speakTaskInstruction(instructionText, studentName, {
        language,
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
      });
    }
  };

  return (
    <div
      className={`rounded-2xl p-3 border transition-all ${
        encouragingFeedback
          ? encouragingFeedback.type === 'almost'
            ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700'
            : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700'
          : 'bg-indigo-50/90 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800'
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-start gap-2 flex-1">
          <button
            type="button"
            onClick={handleSpeakInstruction}
            className={`p-2 rounded-xl shrink-0 transition-transform active:scale-95 cursor-pointer ${
              isSpeaking
                ? 'bg-amber-400 text-amber-950 shadow-md animate-pulse'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
            }`}
            title={isSpeaking ? (isAr ? 'إيقاف الصوت' : 'Stop Voice') : isAr ? 'استمعي لتعليمات المعلمة نور' : 'Listen to instructions'}
            aria-label={isAr ? 'استمعي لتعليمات المعلمة نور' : 'Listen to instructions'}
          >
            <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-bounce' : ''}`} />
          </button>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-black">
              <span className="text-indigo-900 dark:text-indigo-200 flex items-center gap-1">
                <span>👩‍🏫</span>
                <span>{isAr ? 'تعليمات المعلمة نور:' : "Miss Nour's Instructions:"}</span>
              </span>
              {isSpeaking && (
                <span className="text-[10px] bg-amber-400 text-amber-950 font-black px-2 py-0.2 rounded-full animate-pulse">
                  {isAr ? 'نور تتحدث 🔊' : 'Speaking 🔊'}
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 leading-relaxed">
              {instructionText}
            </p>

            {encouragingFeedback && encouragingFeedback.customNote && (
              <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 pt-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>{encouragingFeedback.customNote}</span>
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleSpeakInstruction}
          className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline shrink-0 p-1 flex items-center gap-0.5 cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>{isAr ? 'إعادة' : 'Replay'}</span>
        </button>
      </div>
    </div>
  );
};
