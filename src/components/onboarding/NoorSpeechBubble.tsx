/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Noor speech bubble.
 *
 * Shows what Noor is "saying" and lets the child tap to hear it through the
 * existing tutorSpeechService. Used on every onboarding screen so the flow
 * always feels led by a teacher, not by a form.
 *
 * Accessibility: the bubble is a real <button> so it is keyboard reachable,
 * meets the 44px touch-target floor, and is announced as a control that reads
 * the text aloud.
 */

import React, { useState } from 'react';
import { Volume2, Loader2 } from 'lucide-react';
import { NourCharacter } from '../stage/NourCharacter';
import { NourState, SubjectOutfit } from '../../types/stage';
import { Language } from '../../types';

interface NoorSpeechBubbleProps {
  text: string;
  language: Language;
  state?: NourState;
  outfit?: SubjectOutfit;
  /** Optional label override for the tap-to-hear affordance. */
  speakHint?: string;
  /** When false, the bubble is a plain panel with no audio control. */
  speakable?: boolean;
  onSpeak?: () => Promise<void> | void;
}

export const NoorSpeechBubble: React.FC<NoorSpeechBubbleProps> = ({
  text,
  language,
  state = 'talking',
  outfit = 'arabic',
  speakHint,
  speakable = true,
  onSpeak,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const isArabic = language === 'ar';

  const handleSpeak = async () => {
    if (!speakable || !onSpeak || isSpeaking) return;
    setIsSpeaking(true);
    try {
      await onSpeak();
    } finally {
      setIsSpeaking(false);
    }
  };

  const hint = speakHint || (isArabic ? 'اضغط لتسمع' : language === 'fr' ? 'Appuie pour écouter' : 'Tap to hear');

  return (
    <div className="flex items-start gap-3 w-full">
      <NourCharacter state={state} outfit={outfit} size="md" className="shrink-0" />
      <div className="relative flex-1 min-w-0">
        {/* Tail of the speech bubble, flipped automatically under RTL. */}
        <div className="absolute top-6 -start-2 w-4 h-4 bg-white dark:bg-slate-800 border-s border-b border-slate-200 dark:border-slate-700 rotate-45 rtl:rotate-[135deg]" />
        <div className="relative rounded-2xl rounded-ss-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm p-3.5">
          <p className="text-[15px] leading-relaxed text-slate-800 dark:text-slate-100 font-medium">
            {text}
          </p>
          {speakable && (
            <button
              type="button"
              onClick={handleSpeak}
              aria-label={hint}
              className="mt-2 inline-flex items-center gap-1.5 min-h-[44px] px-3 -ms-1 rounded-xl text-xs font-semibold text-indigo-600 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            >
              {isSpeaking ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
              <span>{hint}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
