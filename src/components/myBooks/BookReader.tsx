/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Page viewer for an imported book, with "Ask Noor" and "Train me".
 *
 * The reader never transmits a page image. "Ask Noor" hands Noor the book
 * title, the page number, and the learner's own words.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ImportedBook } from '../../types';
import { TrainMeSheet } from './TrainMeSheet';
import { Bot, ChevronLeft, ChevronRight, GraduationCap, X } from 'lucide-react';

export const BookReader: React.FC<{
  book: ImportedBook;
  onClose: () => void;
  onProgress: (pageIndex: number) => void | Promise<void>;
}> = ({ book, onClose, onProgress }) => {
  const { language, student, setCompanionContext, setActiveTab } = useApp();
  const isAr = language === 'ar';

  const start = book.lastPageIndex && book.lastPageIndex >= 1 && book.lastPageIndex <= book.pages.length
    ? book.lastPageIndex
    : 1;
  const [pageIndex, setPageIndex] = useState(start);
  const [trainOpen, setTrainOpen] = useState(false);

  const page = book.pages.find((p) => p.index === pageIndex) || book.pages[0];
  const canPrev = pageIndex > 1;
  const canNext = pageIndex < book.pages.length;

  const go = (next: number) => {
    setPageIndex(next);
    void onProgress(next);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between gap-2 px-3 py-2.5 border-b border-slate-200 dark:border-slate-800">
        <button type="button" onClick={onClose} aria-label={isAr ? 'رجوع' : 'Back'} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="min-w-0 text-center">
          <div className="text-sm font-black truncate">{book.title}</div>
          <div className="text-[11px] text-slate-500">
            {isAr ? 'صفحة' : 'Page'} {page?.index ?? 1} / {book.pages.length}
          </div>
        </div>
        <button type="button" onClick={onClose} aria-label={isAr ? 'إغلاق' : 'Close'} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-auto bg-slate-200 dark:bg-slate-950 flex items-start justify-center p-2">
        {page ? (
          <img src={page.dataUrl} alt={`${book.title} — page ${page.index}`} className="max-w-full h-auto bg-white shadow-lg" />
        ) : (
          <p className="text-sm text-slate-500 p-6">{isAr ? 'الصفحة غير متاحة.' : 'This page is unavailable.'}</p>
        )}
      </div>

      <div className="px-3 py-2.5 border-t border-slate-200 dark:border-slate-800 space-y-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={!canPrev}
            onClick={() => go(pageIndex - 1)}
            className="flex-1 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-black disabled:opacity-40 flex items-center justify-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            {isAr ? 'السابقة' : 'Previous'}
          </button>
          <button
            type="button"
            disabled={!canNext}
            onClick={() => go(pageIndex + 1)}
            className="flex-1 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-black disabled:opacity-40 flex items-center justify-center gap-1"
          >
            {isAr ? 'التالية' : 'Next'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setCompanionContext({
                source: 'lesson',
                subjectName: book.subject,
                topic: book.title,
                notes: isAr
                  ? `الطالبة بتذاكر من كتاب «${book.title}» صفحة ${page?.index ?? 1}. اسأليها هي إيه اللي في الصفحة وساعديها تفهمه.`
                  : `The student is studying "${book.title}", page ${page?.index ?? 1}. Ask what is on the page and help them understand it.`,
              });
              setActiveTab('companion');
            }}
            className="flex-1 py-2.5 rounded-2xl bg-linear-to-r from-[#615bff] to-[#26b8a8] text-white text-xs font-black flex items-center justify-center gap-1.5"
          >
            <Bot className="w-4 h-4" />
            {isAr ? 'اسألي نور' : 'Ask Noor'}
          </button>
          <button
            type="button"
            onClick={() => setTrainOpen(true)}
            className="flex-1 py-2.5 rounded-2xl bg-amber-400 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5"
          >
            <GraduationCap className="w-4 h-4" />
            {isAr ? 'درّبيني' : 'Train me'}
          </button>
        </div>
        <p className="text-[10px] text-slate-500 text-center">
          {isAr
            ? 'نور بتساعدك من كلامك واسم الكتاب. الصورة نفسها مش بتتبعت.'
            : 'Noor works from your own words and the book title. The picture itself is not sent.'}
        </p>
      </div>

      {trainOpen && (
        <TrainMeSheet book={book} pageIndex={page?.index ?? 1} studentId={student?.id || ''} onClose={() => setTrainOpen(false)} />
      )}
    </div>
  );
};
