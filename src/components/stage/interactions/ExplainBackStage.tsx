/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { VoiceInputControl } from '../../voice/VoiceInputControl';
import { Sparkles, Send, Keyboard, Lightbulb, CheckCircle2 } from 'lucide-react';

interface ExplainBackStageProps {
  conceptTitle: string;
  onExplainSubmitted: (explanationText: string) => void;
  language?: 'ar' | 'en' | 'fr';
}

/**
 * ExplainBackStage (Sub-Phase 11.4 — explain_back)
 * The mandatory master-level check where student teaches Nour back in their own words.
 */
export const ExplainBackStage: React.FC<ExplainBackStageProps> = ({
  conceptTitle,
  onExplainSubmitted,
  language = 'ar',
}) => {
  const isAr = language === 'ar';
  const [inputText, setInputText] = useState('');
  const [useKeyboard, setUseKeyboard] = useState(false);

  const handleSubmit = (text?: string) => {
    const toSubmit = (text !== undefined ? text : inputText).trim();
    if (!toSubmit || toSubmit.length < 5) return;
    onExplainSubmitted(toSubmit);
  };

  return (
    <div
      className="w-full h-full flex flex-col justify-between max-w-lg mx-auto p-2"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* Banner / Prompt Header */}
      <div className="flex items-center justify-between bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-700/80 px-3 py-1.5 rounded-xl">
        <div className="flex items-center gap-1.5 text-xs font-black text-amber-900 dark:text-amber-100">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>
            {isAr
              ? `دورك لتعلمني: اشرح لي «${conceptTitle}»!`
              : `Now you teach me: Explain "${conceptTitle}"!`}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setUseKeyboard(!useKeyboard)}
          className="text-[10px] font-bold text-amber-700 dark:text-amber-300 hover:underline flex items-center gap-1"
        >
          <Keyboard className="w-3 h-3" />
          <span>{useKeyboard ? (isAr ? 'صوت' : 'Voice') : (isAr ? 'كتابة' : 'Text')}</span>
        </button>
      </div>

      {/* Main Recording Surface */}
      {!useKeyboard ? (
        <div className="flex items-center justify-between p-3 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border-2 border-indigo-300 dark:border-indigo-800 gap-3 my-1">
          <div className="text-right rtl:text-right ltr:text-left flex-1">
            <p className="text-xs font-bold text-indigo-950 dark:text-indigo-100">
              {isAr ? 'اشرح لي بكلماتك البسيطة' : 'Explain in your own words'}
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              {isAr
                ? 'لا تقلق، احكِ بطريقتك كما لو كنت تشرح لصديقك في المدرسة'
                : 'Speak freely as if teaching a classmate'}
            </p>
          </div>

          <VoiceInputControl
            buttonSize="lg"
            onTranscriptConfirmed={(spoken) => handleSubmit(spoken)}
          />
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="flex items-center gap-2 my-1"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              isAr
                ? 'اكتب شرحك هنا بكلماتك أنت...'
                : 'Type your explanation in your own words...'
            }
            className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white shadow-xs font-bold"
          >
            <Send className="w-4 h-4 rtl:rotate-180" />
          </button>
        </form>
      )}

      {/* Encouraging Tip */}
      <div className="text-[10px] text-slate-500 text-center flex items-center justify-center gap-1">
        <Lightbulb className="w-3 h-3 text-amber-500" />
        <span>
          {isAr
            ? 'تذكر: الشرح العكسي يثبت المعلومة بنسبة ٩٠٪ في الذاكرة الدائمة!'
            : 'Explaining it back locks 90% into long-term memory!'}
        </span>
      </div>
    </div>
  );
};
