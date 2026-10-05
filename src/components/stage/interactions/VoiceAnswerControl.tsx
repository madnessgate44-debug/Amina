/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { VoiceInputControl } from '../../voice/VoiceInputControl';
import { Send, Keyboard, Mic, Sparkles } from 'lucide-react';

interface VoiceAnswerControlProps {
  promptText: string;
  onAnswerSubmit: (transcript: string) => void;
  language?: 'ar' | 'en' | 'fr';
}

/**
 * VoiceAnswerControl (Sub-Phase 11.4 — child_speak_answer)
 * Primary voice input with live transcript verification and silent text fallback.
 */
export const VoiceAnswerControl: React.FC<VoiceAnswerControlProps> = ({
  promptText,
  onAnswerSubmit,
  language = 'ar',
}) => {
  const isAr = language === 'ar';
  const [inputText, setInputText] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);

  const handleSubmit = (textToSubmit?: string) => {
    const final = (textToSubmit !== undefined ? textToSubmit : inputText).trim();
    if (!final) return;
    onAnswerSubmit(final);
  };

  return (
    <div
      className="w-full h-full flex flex-col justify-center max-w-md mx-auto p-2"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <div className="flex items-center justify-between mb-1.5 px-1">
        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
          {promptText}
        </span>
        <button
          type="button"
          onClick={() => setShowTextInput(!showTextInput)}
          className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
        >
          <Keyboard className="w-3 h-3" />
          <span>{showTextInput ? (isAr ? 'المايكروفون' : 'Use Voice') : (isAr ? 'الكتابة باليد' : 'Type')}</span>
        </button>
      </div>

      {!showTextInput ? (
        <div className="flex items-center justify-center p-3 rounded-2xl bg-indigo-50/70 dark:bg-slate-800/80 border-2 border-indigo-200 dark:border-indigo-800 gap-3">
          <VoiceInputControl
            buttonSize="lg"
            onTranscriptConfirmed={(spoken) => handleSubmit(spoken)}
          />
          <div className="text-right rtl:text-right ltr:text-left">
            <p className="text-xs font-bold text-indigo-950 dark:text-indigo-100">
              {isAr ? 'اضغط وتحدث بحرية...' : 'Tap and speak freely...'}
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              {isAr ? 'نور يستمع إليك بتركيز ويظهر كلماتك' : 'Nour listens and transcribes'}
            </p>
          </div>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isAr ? 'اكتب إجابتك هنا...' : 'Type your answer...'}
            className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white shadow-xs"
          >
            <Send className="w-4 h-4 rtl:rotate-180" />
          </button>
        </form>
      )}
    </div>
  );
};
