/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * "My Books" — the learner's own imported books.
 *
 * Privacy contract this screen keeps:
 *  - A PDF and page photos are read and stored entirely on the device.
 *  - No book file or page image is uploaded at import time, or committed.
 *  - "Ask Noor" and "Train me" send only the page being studied: its extracted
 *    text when it has a text layer, otherwise that one page's image.
 */

import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { storageService } from '../../services/storage';
import { withProgress } from '../../services/myBooks/bookImportService';
import { ImportedBook } from '../../types';
import { ImportBookSheet } from './ImportBookSheet';
import { BookReader } from './BookReader';
import { BookOpen, Plus, Trash2 } from 'lucide-react';

/** Pages in a book, whether it is a PDF (page count) or page photos. */
function pageCountOf(book: ImportedBook): number {
  return book.kind === 'pdf' ? book.pageCount : book.pages.length;
}

export const MyBooksScreen: React.FC = () => {
  const { language, student } = useApp();
  const isAr = language === 'ar';
  const isFr = language === 'fr';

  const [books, setBooks] = useState<ImportedBook[]>([]);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [openBookId, setOpenBookId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    if (!student?.id) return;
    const list = await storageService.getImportedBooks(student.id);
    setBooks(list.sort((a, b) => (b.lastOpenedAt || b.createdAt).localeCompare(a.lastOpenedAt || a.createdAt)));
    setIsLoading(false);
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [student?.id]);

  const openBook = books.find((b) => b.id === openBookId) || null;

  const handleDelete = async (book: ImportedBook) => {
    await storageService.deleteImportedBook(book.id);
    setBooks((prev) => prev.filter((b) => b.id !== book.id));
  };

  if (openBook) {
    return (
      <BookReader
        book={openBook}
        onClose={() => setOpenBookId(null)}
        onProgress={async (pageIndex) => {
          const updated = withProgress(openBook, pageIndex);
          await storageService.saveImportedBook(updated);
          setBooks((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
        }}
      />
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-5 max-w-lg mx-auto w-full pb-24 space-y-4" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black">{isAr ? 'كتبي' : isFr ? 'Mes livres' : 'My Books'}</h1>
          <p className="text-xs text-slate-500 mt-1">
            {isAr
              ? 'ضيفي كتبك (PDF أو صور) وذاكري منها. الكتاب بيفضل على جهازك ومش بيتترفع لأي مكان.'
              : 'Add your books — a PDF or page photos — and study from them. The book stays on your device and is never uploaded.'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsImportOpen(true)}
          className="shrink-0 px-3.5 py-2.5 rounded-2xl bg-indigo-600 text-white text-xs font-black flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          {isAr ? 'أضيفي كتاب' : 'Add book'}
        </button>
      </div>

      {isLoading ? null : books.length === 0 ? (
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-sm text-slate-500">
          <BookOpen className="w-8 h-8 mx-auto mb-2" />
          {isAr ? 'لسه مفيش كتب. اضغطي "أضيفي كتاب" وصوّري أول صفحة.' : 'No books yet. Tap "Add book" and photograph your first page.'}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {books.map((book) => (
            <div key={book.id} className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
              <button type="button" onClick={() => setOpenBookId(book.id)} className="w-full text-start">
                <div className="aspect-3/4 bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                  {book.coverDataUrl ? (
                    <img src={book.coverDataUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <BookOpen className="w-8 h-8 text-slate-400" />
                  )}
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-black line-clamp-2">{book.title}</h3>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {book.kind === 'pdf' ? 'PDF · ' : ''}
                    {pageCountOf(book)} {isAr ? 'صفحة' : pageCountOf(book) === 1 ? 'page' : 'pages'}
                    {book.lastPageIndex ? ` · ${isAr ? 'وصلتِ لصفحة' : 'on page'} ${book.lastPageIndex}` : ''}
                  </p>
                </div>
              </button>
              <div className="px-3 pb-3">
                <button
                  type="button"
                  onClick={() => void handleDelete(book)}
                  aria-label={isAr ? 'احذفي الكتاب' : 'Delete book'}
                  className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-rose-600 flex items-center justify-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  {isAr ? 'حذف' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isImportOpen && (
        <ImportBookSheet
          studentId={student?.id || ''}
          onClose={() => setIsImportOpen(false)}
          onImported={async (book) => {
            await storageService.saveImportedBook(book);
            setIsImportOpen(false);
            await load();
            setOpenBookId(book.id);
          }}
        />
      )}
    </div>
  );
};
