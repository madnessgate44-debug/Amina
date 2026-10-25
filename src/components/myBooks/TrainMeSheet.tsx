/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * "Train me" — Noor writes practice questions from the page on screen.
 *
 * The learner types nothing to start: Noor reads the page (its text layer, or
 * the one page image when it is scanned) and writes 3–5 questions from that
 * content. The learner answers, Noor checks each answer, and every answer is
 * recorded as mastery evidence for this page.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { storageService } from '../../services/storage';
import { requestStudyPage, StudyPageCard } from '../../services/myBooks/studyPageService';
import { recordBookPractice } from '../../services/myBooks/bookMastery';
import { ImportedBook } from '../../types';
import { PdfDocumentLike } from '../../services/myBooks/pdfService';
import { Check, Loader2, X } from 'lucide-react';

interface Card extends StudyPageCard {
  id: string;
  learnerAnswer?: string;
  outcome?: 'full' | 'partial' | 'wrong';
}

export const TrainMeSheet: React.FC<{
  book: ImportedBook;
  pageIndex: number;
  studentId: string;
  pdfDoc?: PdfDocumentLike | null;
  onClose: () => void;
}> = ({ book, pageIndex, studentId, pdfDoc, onClose }) => {
  const { language, student } = useApp();
  const isAr = language === 'ar';
  const [cards, setCards] = useState<Card[]>([]);
  const [busy, setBusy] = useState(false);
  const [degraded, setDegraded] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [draft, setDraft] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [checked, setChecked] = useState(false);

  const generate = async () => {
    setBusy(true);
    setDegraded(false);
    try {
      const result = await requestStudyPage({
        book,
        pageNumber: pageIndex,
        mode: 'train',
        language,
        studentName: student?.name,
        addressForm: student?.addressForm,
        pdfDoc: pdfDoc ?? undefined,
      });

      const built: Card[] = result.cards.slice(0, 5).map((c, i) => ({
        id: `${Date.now()}_${i}`,
        question: c.question,
        answer: c.answer,
      }));

      setCards(built);
      setActiveIdx(0);
      setRevealed(false);
      setChecked(false);
      setDraft('');
      if (built.length === 0) setDegraded(true);

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
    } finally {
      setBusy(false);
    }
  };

  const card = cards[activeIdx];

  const checkAnswer = async () => {
    if (!card || !draft.trim()) return;
    setBusy(true);
    try {
      const { outcome } = await recordBookPractice({
        storage: storageService,
        studentId,
        bookId: book.id,
        pageNumber: pageIndex,
        expected: card.answer,
        learnerAnswer: draft,
        hadRevealed: revealed,
      });
      const updated = { ...card, learnerAnswer: draft, outcome };
      setCards((prev) => prev.map((c) => (c.id === card.id ? updated : c)));
      await storageService.saveBookTrainingCard({
        id: card.id,
        bookId: book.id,
        studentId,
        pageIndex,
        question: card.question,
        answer: card.answer,
        learnerAnswer: draft,
        outcome,
        createdAt: new Date().toISOString(),
      });
      setChecked(true);
      setRevealed(true);
    } finally {
      setBusy(false);
    }
  };

  const goTo = (next: number) => {
    setActiveIdx(next);
    setChecked(false);
    setRevealed(false);
    setDraft('');
  };

  const outcomeLabel = (o: 'full' | 'partial' | 'wrong') =>
    o === 'full'
      ? isAr ? 'إجابة صحيحة 👏' : 'Correct 👏'
      : o === 'partial'
        ? isAr ? 'قريبة جداً، كمان شوية' : 'Close — almost there'
        : isAr ? 'مش دقيقة، بصي على الإجابة' : "Not quite — look at the answer";

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
          <h2 className="text-lg font-black">
            {isAr ? `تدريب على صفحة ${pageIndex}` : `Practice on page ${pageIndex}`}
          </h2>
          <button type="button" onClick={onClose} aria-label={isAr ? 'إغلاق' : 'Close'} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        {cards.length === 0 ? (
          <>
            <p className="text-xs text-slate-500 leading-relaxed">
              {isAr
                ? 'نور هتقرا الصفحة دي وتكتبلك من ٣ لـ ٥ أسئلة تدريب. مش محتاجة تكتبي حاجة.'
                : "Noor will read this page and write you 3 to 5 practice questions. You don't need to type anything to start."}
            </p>
            <button
              type="button"
              disabled={busy}
              onClick={() => void generate()}
              className="w-full py-3 rounded-2xl bg-indigo-600 text-white text-sm font-black disabled:opacity-40 flex items-center justify-center gap-2"
            >
              {busy && <Loader2 className="w-4 h-4 animate-spin" />}
              {busy ? (isAr ? 'نور بتقرا الصفحة…' : 'Noor is reading the page…') : isAr ? 'اعملي أسئلة تدريب' : 'Make practice questions'}
            </button>
          </>
        ) : (
          <>
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 space-y-3">
              <p className="text-sm font-bold">{card?.question}</p>

              {!checked ? (
                <>
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && draft.trim() && !busy) void checkAnswer();
                    }}
                    placeholder={isAr ? 'اكتبي إجابتك هنا' : 'Type your answer here'}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={busy || !draft.trim()}
                      onClick={() => void checkAnswer()}
                      className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-black disabled:opacity-40 flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      {isAr ? 'صحّحيلي' : 'Check my answer'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setRevealed(true)}
                      className="px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-black"
                    >
                      {isAr ? 'وريني الإجابة' : 'Show answer'}
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-xs font-black text-indigo-700 dark:text-indigo-300">
                  {card?.outcome ? outcomeLabel(card.outcome) : ''}
                </p>
              )}

              {revealed && (
                <p className="text-sm text-slate-700 dark:text-slate-200 pt-1 border-t border-slate-200 dark:border-slate-700">
                  {card?.answer}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={activeIdx === 0}
                onClick={() => goTo(activeIdx - 1)}
                className="flex-1 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-black disabled:opacity-40"
              >
                {isAr ? 'السابق' : 'Previous'}
              </button>
              <span className="text-xs font-bold text-slate-500">{activeIdx + 1}/{cards.length}</span>
              <button
                type="button"
                disabled={activeIdx >= cards.length - 1}
                onClick={() => goTo(activeIdx + 1)}
                className="flex-1 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-black disabled:opacity-40"
              >
                {isAr ? 'التالي' : 'Next'}
              </button>
            </div>
          </>
        )}

        {degraded && (
          <p className="text-[11px] text-amber-700 dark:text-amber-400">
            {isAr
              ? 'نور مش قادرة تجهز أسئلة من الصفحة دي دلوقتي. تقدر تذاكر الصفحة وتكتب ملاحظاتك.'
              : "Noor can't make questions from this page right now. You can still study the page and keep your own notes."}
          </p>
        )}
      </div>
    </div>
  );
};
