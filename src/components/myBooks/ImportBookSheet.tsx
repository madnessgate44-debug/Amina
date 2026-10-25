/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Import sheet for "My Books". Images are read on the device only.
 */

import React, { useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { buildImportedBook, isSupportedImage } from '../../services/myBooks/bookImportService';
import { ImportedBook } from '../../types';
import { Upload, X } from 'lucide-react';

export const ImportBookSheet: React.FC<{
  studentId: string;
  onClose: () => void;
  onImported: (book: ImportedBook) => void | Promise<void>;
}> = ({ studentId, onClose, onImported }) => {
  const { language } = useApp();
  const isAr = language === 'ar';
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [subject, setSubject] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (picked: FileList | null) => {
    if (!picked) return;
    setFiles((prev) => [...prev, ...Array.from(picked).filter(isSupportedImage)]);
  };

  const submit = async () => {
    if (files.length === 0) return;
    setBusy(true);
    try {
      const book = await buildImportedBook({ studentId, title, author, subject, files });
      await onImported(book);
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
          <h2 className="text-lg font-black">{isAr ? 'إضافة كتاب' : 'Add a book'}</h2>
          <button type="button" onClick={onClose} aria-label={isAr ? 'إغلاق' : 'Close'} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        <label className="block">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{isAr ? 'اسم الكتاب' : 'Book title'}</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={isAr ? 'مثال: الرياضيات — الترم الأول' : 'e.g. Mathematics — Term 1'}
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

        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full py-3 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-sm font-bold text-slate-600 dark:text-slate-300 flex items-center justify-center gap-2"
        >
          <Upload className="w-4 h-4" />
          {isAr ? 'اختاري صور الصفحات' : 'Choose page photos'}
        </button>

        {files.length > 0 && (
          <p className="text-xs text-slate-500">
            {isAr ? `${files.length} صفحة جاهزة` : `${files.length} page${files.length === 1 ? '' : 's'} ready`}
          </p>
        )}

        <p className="text-[11px] text-slate-500 leading-relaxed">
          {isAr
            ? 'الصور بتتخزن على جهازك بس. مفيش صورة بتترفع ولا بتتسجل في مكان تاني.'
            : 'The pictures are stored on your device only. Nothing is uploaded or saved anywhere else.'}
        </p>

        <button
          type="button"
          disabled={busy || files.length === 0}
          onClick={() => void submit()}
          className="w-full py-3 rounded-2xl bg-indigo-600 text-white text-sm font-black disabled:opacity-40"
        >
          {busy ? (isAr ? 'جاري التحضير…' : 'Preparing…') : isAr ? 'أضيفي الكتاب' : 'Add the book'}
        </button>
      </div>
    </div>
  );
};
