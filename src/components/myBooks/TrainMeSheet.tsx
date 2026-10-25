/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * "Train me" — practice questions the learner generates from a book page.
 *
 * Only text the learner types (plus the book title and page number) is sent.
 * The page image never leaves the device.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { storageService } from '../../services/storage';
import { parseTrainingCards } from '../../services/myBooks/bookTraining';
import { ImportedBook } from '../../types';
import { X } from 'lucide-react';

interface Card {
  id: string;
  question: string;
  answer: string;
}

export const TrainMeSheet: React.FC<{
  book: ImportedBook;
  pageIndex: number;
  studentId: string;
  onClose: () => void;
}> = ({ book, pageIndex, studentId, onClose }) => {
  const { language, student } = useApp();
  const isAr = language === 'ar';
  const [summary, setSummary] = useState('');
  const [busy, setBusy] = useState(false);
  const [cards, setCards] = useState<Card[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const generate = async () => {
    if (!summary.trim()) return;
    setBusy(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: isAr
                ? `أنا بذاكر من كتاب «${book.title}» صفحة ${pageIndex}. أهم حاجة في الصفحة: ${summary}. اسأليني ٣ أسئلة قصيرة أتدرب بيها، وبعد كل سؤال اكتبي الإجابة في سطر يبدأ بـ "ج:".`
                : `I am studying "${book.title}", page ${pageIndex}. The key thing on this page: ${summary}. Ask me 3 short practice questions, and after each question put the answer on a line starting with "A:".`,
            },
          ],
          language,
          grade: 'Grade 5',
          studentName: student?.name,
          addressForm: student?.addressForm,
        }),
      });
      const data = await res.json();
      const text: string = data?.reply || data?.text || '';

      const parsed = parseTrainingCards(text);
      const built: Card[] = (parsed.length > 0
        ? parsed
        : [{ question: isAr ? 'إيه أهم حاجة في الصفحة دي؟' : 'What is the most important thing on this page?', answer: summary.trim() }]
      ).map((c, i) => ({ id: `${Date.now()}_${i}`, ...c }));

      setCards(built);
      for (const c of built) {
        await storageService.saveBookTrainingCard({
          id: c.id,
          bookId: book.id,
          studentId,
          pageIndex,
          question: c.question,
          answer: c.answer,
          createdAt: new Date().toISOString(),
        });
      }
      setActiveIdx(0);
      setRevealed(false);
    } finally {
      setBusy(false);
    }
  };

  const card = cards[activeIdx];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={isAr ? 'درّبيني' : 'Train me'}
      className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl p-5 space-y-3 max-h-[88vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        dir={isAr ? 'rtl' : 'ltr'}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black">{isAr ? 'درّبيني' : 'Train me'}</h2>
          <button type="button" onClick={onClose} aria-label={isAr ? 'إغلاق' : 'Close'} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        {cards.length === 0 ? (
          <>
            <label className="block">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                {isAr ? 'اكتبي بكلامك أهم حاجة في الصفحة' : 'In your own words, what is this page about?'}
              </span>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={3}
                className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm"
              />
            </label>
            <button
              type="button"
              disabled={busy || !summary.trim()}
              onClick={() => void generate()}
              className="w-full py-3 rounded-2xl bg-indigo-600 text-white text-sm font-black disabled:opacity-40"
            >
              {busy ? (isAr ? 'جاري التحضير…' : 'Preparing…') : isAr ? 'اعملي أسئلة تدريب' : 'Make practice questions'}
            </button>
          </>
        ) : (
          <>
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800">
              <p className="text-sm font-bold">{card?.question}</p>
              {revealed ? (
                <p className="text-sm text-slate-700 dark:text-slate-200 mt-3">{card?.answer}</p>
              ) : (
                <button type="button" onClick={() => setRevealed(true)} className="mt-3 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 text-xs font-black border border-slate-200 dark:border-slate-700">
                  {isAr ? 'وريني الإجابة' : 'Show answer'}
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={activeIdx === 0}
                onClick={() => { setActiveIdx((i) => i - 1); setRevealed(false); }}
                className="flex-1 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-black disabled:opacity-40"
              >
                {isAr ? 'السابق' : 'Previous'}
              </button>
              <span className="text-xs font-bold text-slate-500">{activeIdx + 1}/{cards.length}</span>
              <button
                type="button"
                disabled={activeIdx >= cards.length - 1}
                onClick={() => { setActiveIdx((i) => i + 1); setRevealed(false); }}
                className="flex-1 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-black disabled:opacity-40"
              >
                {isAr ? 'التالي' : 'Next'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
