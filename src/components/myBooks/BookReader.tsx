/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Reader for an imported book, with "Ask Noor" and "Train me".
 *
 * For a PDF, the page is rendered on demand from the device-local Blob. Only
 * the page being studied is ever sent to Noor, and only when the learner taps
 * "Ask Noor" or "Train me" — never on page turn.
 */

import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ImportedBook, StudiedPageContent } from '../../types';
import { clampPage, openPdf, renderPageToDataUrl, PdfDocumentLike } from '../../services/myBooks/pdfService';
import { resolveStudiedPage } from '../../services/myBooks/pageContent';
import { requestStudyPage } from '../../services/myBooks/studyPageService';
import { TrainMeSheet } from './TrainMeSheet';
import { Bot, ChevronLeft, ChevronRight, GraduationCap, Loader2, X } from 'lucide-react';

export const BookReader: React.FC<{
  book: ImportedBook;
  onClose: () => void;
  onProgress: (pageIndex: number) => void | Promise<void>;
}> = ({ book, onClose, onProgress }) => {
  const { language, student, setActiveTab } = useApp();
  const isAr = language === 'ar';

  const totalPages = book.kind === 'pdf' ? book.pageCount : book.pages.length;
  const start = book.lastPageIndex && book.lastPageIndex >= 1 && book.lastPageIndex <= totalPages
    ? book.lastPageIndex
    : 1;

  const [pageIndex, setPageIndex] = useState(start);
  const [pdfDoc, setPdfDoc] = useState<PdfDocumentLike | null>(null);
  const [pdfImage, setPdfImage] = useState<string | null>(null);
  const [rendering, setRendering] = useState(false);
  const [trainOpen, setTrainOpen] = useState(false);
  const [askOpen, setAskOpen] = useState(false);

  const isPdf = book.kind === 'pdf' && Boolean(book.pdfBlob);
  const imagePage = book.pages.find((p) => p.index === pageIndex) || book.pages[0];

  // Open the PDF once; pages are rendered on demand below.
  useEffect(() => {
    if (!isPdf || !book.pdfBlob) return;
    let cancelled = false;
    void (async () => {
      try {
        const doc = await openPdf(book.pdfBlob!);
        if (!cancelled) setPdfDoc(doc);
      } catch {
        if (!cancelled) setPdfDoc(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isPdf, book.pdfBlob]);

  // Render only the page on screen.
  useEffect(() => {
    if (!isPdf || !pdfDoc) return;
    let cancelled = false;
    setRendering(true);
    void (async () => {
      try {
        const url = await renderPageToDataUrl(pdfDoc, pageIndex);
        if (!cancelled) setPdfImage(url);
      } catch {
        if (!cancelled) setPdfImage(null);
      } finally {
        if (!cancelled) setRendering(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isPdf, pdfDoc, pageIndex]);

  const canPrev = pageIndex > 1;
  const canNext = pageIndex < totalPages;

  const go = (next: number) => {
    const clamped = clampPage(next, totalPages);
    setPageIndex(clamped);
    void onProgress(clamped);
  };

  const shownImage = isPdf ? pdfImage : imagePage?.dataUrl;
  const showLoading = isPdf && (rendering || !pdfDoc);

  return (
    <div className="flex-1 flex flex-col min-h-0" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between gap-2 px-3 py-2.5 border-b border-slate-200 dark:border-slate-800">
        <button type="button" onClick={onClose} aria-label={isAr ? 'رجوع' : 'Back'} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="min-w-0 text-center">
          <div className="text-sm font-black truncate">{book.title}</div>
          <div className="text-[11px] text-slate-500">
            {isAr ? 'صفحة' : 'Page'} {pageIndex} / {totalPages}
          </div>
        </div>
        <button type="button" onClick={onClose} aria-label={isAr ? 'إغلاق' : 'Close'} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-auto bg-slate-200 dark:bg-slate-950 flex items-start justify-center p-2">
        {showLoading ? (
          <div className="flex items-center gap-2 text-slate-500 text-sm p-8">
            <Loader2 className="w-4 h-4 animate-spin" />
            {isAr ? 'جاري تحضير الصفحة…' : 'Preparing the page…'}
          </div>
        ) : shownImage ? (
          <img src={shownImage} alt={`${book.title} — page ${pageIndex}`} className="max-w-full h-auto bg-white shadow-lg" />
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
            onClick={() => setAskOpen(true)}
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
            ? 'لما تطلبي من نور تشرحلك أو تدربك، بتبص على الصفحة دي بس. باقي الكتاب بيفضل على جهازك.'
            : 'When you ask Noor to explain or train, she looks at this one page only. The rest of the book stays on your device.'}
        </p>
      </div>

      {askOpen && (
        <AskNoorSheet
          book={book}
          pageIndex={pageIndex}
          pdfDoc={pdfDoc}
          onClose={() => setAskOpen(false)}
          onOpenCompanion={() => {
            setActiveTab('companion');
            setAskOpen(false);
          }}
        />
      )}

      {trainOpen && (
        <TrainMeSheet book={book} pageIndex={pageIndex} pdfDoc={pdfDoc} studentId={student?.id || ''} onClose={() => setTrainOpen(false)} />
      )}
    </div>
  );
};

/**
 * "Ask Noor" — Noor explains the page on screen and answers the child's
 * questions about it, citing the page number.
 */
const AskNoorSheet: React.FC<{
  book: ImportedBook;
  pageIndex: number;
  pdfDoc: PdfDocumentLike | null;
  onClose: () => void;
  onOpenCompanion: () => void;
}> = ({ book, pageIndex, pdfDoc, onClose, onOpenCompanion }) => {
  const { language, student } = useApp();
  const isAr = language === 'ar';
  const [question, setQuestion] = useState('');
  const [busy, setBusy] = useState(false);
  const [reply, setReply] = useState<string | null>(null);
  const [degraded, setDegraded] = useState(false);
  const [content, setContent] = useState<StudiedPageContent | null>(null);
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const c = await resolveStudiedPage({ book, pageNumber: pageIndex, pdfDoc: pdfDoc ?? undefined });
      if (!cancelled) {
        setContent(c);
        setResolved(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [book, pageIndex, pdfDoc]);

  const ask = async (text: string) => {
    setBusy(true);
    try {
      const result = await requestStudyPage({
        book,
        pageNumber: pageIndex,
        mode: 'explain',
        question: text,
        language,
        studentName: student?.name,
        addressForm: student?.addressForm,
        pdfDoc: pdfDoc ?? undefined,
      });
      setReply(result.reply || null);
      setDegraded(Boolean(result.degraded));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={isAr ? 'اسألي نور' : 'Ask Noor'}
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
            {isAr ? `نور تشرح صفحة ${pageIndex}` : `Noor explains page ${pageIndex}`}
          </h2>
          <button type="button" onClick={onClose} aria-label={isAr ? 'إغلاق' : 'Close'} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        {resolved && !content && (
          <p className="text-xs text-slate-500">
            {isAr ? 'مش قادرة أقرا الصفحة دي.' : "I can't read this page."}
          </p>
        )}

        {reply ? (
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-sm whitespace-pre-wrap">{reply}</div>
        ) : (
          <button
            type="button"
            disabled={busy || !content}
            onClick={() => void ask('')}
            className="w-full py-3 rounded-2xl bg-indigo-600 text-white text-sm font-black disabled:opacity-40"
          >
            {busy ? (isAr ? 'جاري التحضير…' : 'Preparing…') : isAr ? `اشرحيلي صفحة ${pageIndex}` : `Explain page ${pageIndex} to me`}
          </button>
        )}

        <label className="block">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
            {isAr ? 'أو اسألي سؤال عن الصفحة' : 'Or ask a question about this page'}
          </span>
          <div className="mt-1 flex gap-2">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && question.trim() && !busy) void ask(question.trim());
              }}
              className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm"
            />
            <button
              type="button"
              disabled={busy || !question.trim() || !content}
              onClick={() => void ask(question.trim())}
              className="px-4 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-black disabled:opacity-40"
            >
              {isAr ? 'اسألي' : 'Ask'}
            </button>
          </div>
        </label>

        {degraded && (
          <p className="text-[11px] text-amber-700 dark:text-amber-400">
            {isAr
              ? 'نور مش متاحة دلوقتي، فتقدر تشوف الصفحة وتكتب ملاحظاتك. لما ترجع هتساعدك.'
              : "Noor isn't available right now, so you can still read the page and keep your own notes. She'll help when she's back."}
          </p>
        )}

        <button type="button" onClick={onOpenCompanion} className="w-full py-2 text-[11px] font-bold text-indigo-700 dark:text-indigo-300">
          {isAr ? 'كملي الكلام مع نور في المحادثة' : 'Continue with Noor in the chat'}
        </button>
      </div>
    </div>
  );
};
