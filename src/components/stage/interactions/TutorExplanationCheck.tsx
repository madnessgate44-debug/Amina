/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, ThumbsUp, HelpCircle, BookOpen, Volume2, Mic, Send, MessageCircle } from 'lucide-react';
import { VoiceInputControl } from '../../voice/VoiceInputControl';

interface TutorExplanationCheckProps {
  studentName: string;
  conceptPrompt: string;
  simplifiedAnalogyAr: string;
  simplifiedAnalogyEn: string;
  vocabularyHighlight?: {
    word: string;
    meaningAr: string;
    meaningEn: string;
  };
  onUnderstood: () => void;
  onAskTutor: (question: string) => void;
  onSpeakExplanation: (text: string) => void;
  language?: 'ar' | 'en' | 'fr';
}

/**
 * TutorExplanationCheck (Sub-Phase 11.3 & 11.7)
 * Acts exactly like a real human tutor sitting beside Amina:
 * Asks if she understood, offers everyday analogies if she didn't,
 * explains vocabulary, and listens to her spoken or typed questions.
 */
export const TutorExplanationCheck: React.FC<TutorExplanationCheckProps> = ({
  studentName = 'أمينة',
  conceptPrompt,
  simplifiedAnalogyAr,
  simplifiedAnalogyEn,
  vocabularyHighlight,
  onUnderstood,
  onAskTutor,
  onSpeakExplanation,
  language = 'ar',
}) => {
  const isAr = language === 'ar';
  const [activeMode, setActiveMode] = useState<'prompt' | 'analogy' | 'vocab' | 'ask'>('prompt');
  const [customQuestion, setCustomQuestion] = useState('');

  const handleNeedMoreExplanation = () => {
    setActiveMode('analogy');
    const textToSpeak = isAr
      ? `ولا يهمك خالص يا ${studentName}! ${simplifiedAnalogyAr}`
      : `No problem at all, ${studentName}! ${simplifiedAnalogyEn}`;
    onSpeakExplanation(textToSpeak);
  };

  const handleExplainVocab = () => {
    if (!vocabularyHighlight) return;
    setActiveMode('vocab');
    const textToSpeak = isAr
      ? `معنى كلمة ${vocabularyHighlight.word} في كتاب الوزارة هو: ${vocabularyHighlight.meaningAr}. وضحت ليكي يا ${studentName}؟`
      : `The meaning of ${vocabularyHighlight.word} is: ${vocabularyHighlight.meaningEn}. Is that clear, ${studentName}?`;
    onSpeakExplanation(textToSpeak);
  };

  const handleCustomSubmit = (q?: string) => {
    const finalQ = (q !== undefined ? q : customQuestion).trim();
    if (!finalQ) return;
    onAskTutor(finalQ);
    setCustomQuestion('');
    setActiveMode('prompt');
  };

  return (
    <div
      className="w-full h-full flex flex-col justify-center max-w-lg mx-auto p-2"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* 1. INITIAL PROMPT: Asking Amina if she understood */}
      {activeMode === 'prompt' && (
        <div className="space-y-2.5 animate-in fade-in duration-200">
          <div className="text-center px-1">
            <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center justify-center gap-1.5">
              <span>
                {isAr
                  ? `يا ${studentName}، هل حسّيتي إنك فهمتي الفكرة دي كويس؟`
                  : `Amina, do you feel like you understood this concept?`}
              </span>
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
              {isAr
                ? 'نور معاكِ خطوة بخطوة.. اختاري اللي يناسبك بكل راحة وبدون أي ضغط:'
                : 'Nour is right with you.. choose whatever feels comfortable:'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Option A: Understood */}
            <button
              type="button"
              onClick={onUnderstood}
              className="p-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-1.5 hover:scale-102 cursor-pointer"
            >
              <ThumbsUp className="w-4 h-4" />
              <span>{isAr ? 'فاهمة ومستعدة! 👍' : 'I get it! Ready 👍'}</span>
            </button>

            {/* Option B: Need more explanation with everyday analogy */}
            <button
              type="button"
              onClick={handleNeedMoreExplanation}
              className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border-2 border-amber-400 text-amber-950 dark:text-amber-100 font-black text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-1.5 hover:bg-amber-100 dark:hover:bg-amber-900/60 cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{isAr ? 'مش فاهماها أوي.. وضّحيلي اكتر 🤔' : 'Explain more simply 🤔'}</span>
            </button>

            {/* Option C: Vocabulary definition breakdown */}
            {vocabularyHighlight && (
              <button
                type="button"
                onClick={handleExplainVocab}
                className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-300 dark:border-indigo-700 text-indigo-900 dark:text-indigo-200 font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 hover:bg-indigo-100 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>{isAr ? `معنى كلمة «${vocabularyHighlight.word}» ❓` : `Word meaning ❓`}</span>
              </button>
            )}

            {/* Option D: Ask Nour via mic or typing */}
            <button
              type="button"
              onClick={() => setActiveMode('ask')}
              className={`p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer ${
                !vocabularyHighlight ? 'col-span-2' : ''
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
              <span>{isAr ? 'اسألي نور بالصوت أو الكتابة 🎙️' : 'Ask Nour (Voice/Text) 🎙️'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. ANALOGY VIEW: Real-life Egyptian Everyday Analogy */}
      {activeMode === 'analogy' && (
        <div className="space-y-2 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700 animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-amber-900 dark:text-amber-100 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>{isAr ? `مثال من حياتنا اليومية لـ ${studentName}:` : `Everyday Example for ${studentName}:`}</span>
            </span>
            <button
              type="button"
              onClick={() =>
                onSpeakExplanation(
                  isAr
                    ? `ولا يهمك خالص يا ${studentName}! ${simplifiedAnalogyAr}`
                    : simplifiedAnalogyEn
                )
              }
              className="text-[11px] font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1 hover:underline cursor-pointer"
            >
              <Volume2 className="w-3 h-3" />
              <span>{isAr ? 'استمعي للشرح' : 'Listen'}</span>
            </button>
          </div>

          <p className="text-xs text-slate-800 dark:text-slate-100 leading-relaxed font-medium">
            {isAr ? simplifiedAnalogyAr : simplifiedAnalogyEn}
          </p>

          <div className="pt-1 flex items-center justify-between gap-2 border-t border-amber-200 dark:border-amber-800">
            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
              {isAr ? 'ها يا أمينة، كده وضحت الفكرة؟' : 'Is it clear now, Amina?'}
            </span>
            <button
              type="button"
              onClick={onUnderstood}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-xs transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>{isAr ? 'أيوه كده فهمتها جداً! ✨' : 'Yes, I get it now! ✨'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. VOCABULARY VIEW */}
      {activeMode === 'vocab' && vocabularyHighlight && (
        <div className="space-y-2 p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border-2 border-indigo-300 dark:border-indigo-700 animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-indigo-950 dark:text-indigo-100 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              <span>{isAr ? `توضيح معنى كلمة: «${vocabularyHighlight.word}»` : `Meaning: "${vocabularyHighlight.word}"`}</span>
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-relaxed">
              {isAr ? vocabularyHighlight.meaningAr : vocabularyHighlight.meaningEn}
            </p>
          </div>

          <div className="pt-1 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setActiveMode('prompt')}
              className="text-[11px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
            >
              {isAr ? 'رجوع للخيارات' : 'Back'}
            </button>
            <button
              type="button"
              onClick={onUnderstood}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-xs transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>{isAr ? 'تمام، عرفت معناها لنكمل!' : 'Got it, let’s continue!'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. ASK NOUR VIEW (Voice & Text) */}
      {activeMode === 'ask' && (
        <div className="space-y-2 p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
              {isAr ? `اسألي نور أي سؤال يدور في ذهنك يا ${studentName}:` : `Ask Nour anything, ${studentName}:`}
            </span>
            <button
              type="button"
              onClick={() => setActiveMode('prompt')}
              className="text-[10px] text-slate-500 hover:underline cursor-pointer"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <VoiceInputControl
              buttonSize="md"
              onTranscriptConfirmed={(spoken) => handleCustomSubmit(spoken)}
            />
            <input
              type="text"
              value={customQuestion}
              onChange={(e) => setCustomQuestion(e.target.value)}
              placeholder={isAr ? 'أو اكتبي سؤالك هنا...' : 'Or type your question...'}
              className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleCustomSubmit();
                }
              }}
            />
            <button
              type="button"
              disabled={!customQuestion.trim()}
              onClick={() => handleCustomSubmit()}
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white shadow-xs cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
