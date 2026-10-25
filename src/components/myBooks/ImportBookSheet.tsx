/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Import sheet for "My Books".
 *
 * A learner can import a PDF (a whole textbook) or photograph individual pages.
 * A PDF is read on the device and stored as its original file; page photos are
 * downscaled and stored as data URLs. Nothing is uploaded at import time.
 */

import React, { useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { buildImportedBook, buildPdfBook, isSupportedImage } from '../../services/myBooks/bookImportService';
import { isPdfFile } from '../../services/myBooks/pdfService';
import { ImportedBook } from '../../types';
import { FileText, Upload, X } from 'lucide-react';

export const ImportBookSheet: React.FC<{
  studentId: string;
  onClose: () => void;
  onImported: (book: ImportedBook) => void | Promise<void>;
}> = ({ studentId, onClose, onImported }) => {
  const { language } = useApp();
  const isAr = language === 'ar';
  const isFr = language === 'fr';
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [subject, setSubject] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const addFiles = (picked: FileList | null) => {
    if (!picked) return;
    setFiles((prev) => [...prev, ...Array.from(picked).filter(isSupportedImage)]);
  };

  const choosePdf = (picked: FileList | null) => {
    const file = picked?.[0];
    if (!file || !isPdfFile(file)) return;
    setPdfFile(file);
    setFiles([]);
    if (!title.trim()) setTitle(file.name.replace(/\.pdf$/i, ''));
  };

  const canSubmit = Boolean(pdfFile) || files.length > 0;

  const submit = async () => {
    if (!canSubmit) return;
    setBusy(true);
    setError(null);
    try {
      const book = pdfFile
        ? await buildPdfBook({ studentId, title, author, subject, file: pdfFile })
        : await buildImportedBook({ studentId, title, author, subject, files });
      await onImported(book);
    } catch {
      setError(isAr ? 'مش عارفة أقرا الملف ده. جربي ملف تاني.' : "I couldn't read that file. Try another one.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={isAr ? 'إضافة كتاب' : 'Add a book'}
      className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl p-5 space-y-3 max-h-[88vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        dir={isAr ? 'rtl' : 'ltr'}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black">{isAr ? 'إضافة كتاب' : isFr ? 'Ajouter un livre' : 'Add a book'}</h2>
          <button type="button" onClick={onClose} aria-label={isAr ? 'إغلاق' : 'Close'} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        <label className="block">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{isAr ? 'اسم الكتاب' : 'Book title'}</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={isAr ? 'مثال: الأضواء — رياضيات' : 'e.g. Al-Adwaa — Mathematics'}
            className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm"
          />
        </label>

        <div className="grid grid-cols-2 gap-2">
          <label className="block">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{isAr ? 'المؤلف' : 'Author'}</span>
            <input value={author} onChange={(e) => setAuthor(e.target.value)} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm" />
          </label>
          <label className="block">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{isAr ? 'المادة' : 'Subject'}</span>
            <input value={subject} onChange={(e) => setSubject(e.target.value)} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm" />
          </label>
        </div>

        {/* PDF — the whole book as one file. */}
        <input ref={pdfInputRef} type="file" accept="application/pdf,.pdf" className="hidden" onChange={(e) => choosePdf(e.target.files)} />
        <button
          type="button"
          onClick={() => pdfInputRef.current?.click()}
          className="w-full py-3 rounded-2xl border-2 border-dashed border-indigo-300 dark:border-indigo-800 text-sm font-bold text-indigo-700 dark:text-indigo-300 flex items-center justify-center gap-2"
        >
          <FileText className="w-4 h-4" />
          {isAr ? 'اختاري ملف PDF للكتاب كامل' : 'Choose a PDF of the whole book'}
        </button>

        {/* Page photos — for a book without a PDF. */}
        <input ref={imageInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />
        <button
          type="button"
          onClick={() => imageInputRef.current?.click()}
          className="w-full py-3 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-sm font-bold text-slate-600 dark:text-slate-300 flex items-center justify-center gap-2"
        >
          <Upload className="w-4 h-4" />
          {isAr ? 'أو صوّري صفحات' : 'Or photograph page photos'}
        </button>

        {pdfFile && (
          <p className="text-xs text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            {pdfFile.name}
          </p>
        )}
        {files.length > 0 && (
          <p className="text-xs text-slate-500">
            {isAr ? `${files.length} صفحة جاهزة` : `${files.length} page${files.length === 1 ? '' : 's'} ready`}
          </p>
        )}

        <p className="text-[11px] text-slate-500 leading-relaxed">
          {isAr
            ? 'الكتاب بيتخزن على جهازك بس، ومش بيتترفع ولا بيتسجل في أي مكان. لما تذاكري صفحة، نور تقدر تبص على الصفحة دي لوحدها علشان تشرحلك أو تجهزلك أسئلة.'
            : 'The book is stored on your device only — never uploaded, never saved anywhere else. When you study a page, Noor may look at that one page to explain it or make you practice questions.'}
        </p>

        {error && <p className="text-[11px] text-rose-600 font-bold">{error}</p>}

        <button
          type="button"
          disabled={busy || !canSubmit}
          onClick={() => void submit()}
          className="w-full py-3 rounded-2xl bg-indigo-600 text-white text-sm font-black disabled:opacity-40"
        >
          {busy ? (isAr ? 'جاري التحضير…' : 'Preparing…') : isAr ? 'أضيفي الكتاب' : 'Add the book'}
        </button>
      </div>
    </div>
  );
};
