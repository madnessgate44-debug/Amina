/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Book reader. Opens a real ministry textbook on the device: downloads it once
 * on demand, then reads it offline. Nothing here invents pages or content — if
 * a book is missing, it says so.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { X, Download, ChevronLeft, ChevronRight, Loader2, WifiOff, BookOpen, List } from 'lucide-react';
import {
  BookManifest,
  pageUrl,
  getBookManifest,
  downloadBook,
  markDownloaded,
  downloadedBookIds,
  requestPersistentStorage,
  type DownloadProgress,
} from '../../services/content/bookLibrary';

interface Props {
  bookId: string;
  language: 'ar' | 'en';
  startPage?: number;
  onClose: () => void;
}

type State =
  | { kind: 'loading' }
  | { kind: 'error'; message: string }
  | { kind: 'downloading'; progress: DownloadProgress }
  | { kind: 'ready'; manifest: BookManifest; offline: boolean };

const T = {
  ar: {
    loading: 'جارٍ فتح الكتاب…',
    download: 'تحميل الكتاب',
    downloading: 'جارٍ التحميل',
    ready: 'الكتاب متاح على جهازك',
    offline: 'متاح بدون إنترنت',
    missing: 'هذا الكتاب غير متاح بعد',
    retry: 'إعادة المحاولة',
    page: 'صفحة',
    of: 'من',
    close: 'إغلاق',
    contents: 'الفهرس',
    chapters: 'الوحدات والدروس',
  },
  en: {
    loading: 'Opening book…',
    download: 'Download book',
    downloading: 'Downloading',
    ready: 'Saved on this device',
    offline: 'Available offline',
    missing: 'This book is not available yet',
    retry: 'Try again',
    page: 'Page',
    of: 'of',
    close: 'Close',
    contents: 'Contents',
    chapters: 'Units & lessons',
  },
};

export const BookReader: React.FC<Props> = ({ bookId, language, startPage = 1, onClose }) => {
  const t = T[language] ?? T.en;
  const [state, setState] = useState<State>({ kind: 'loading' });
  const [page, setPage] = useState(startPage);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [showToc, setShowToc] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load the manifest. If the book was downloaded before, go straight to ready.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const manifest = await getBookManifest(bookId);
        if (cancelled) return;
        const already = downloadedBookIds().includes(bookId);
        setState({ kind: 'ready', manifest, offline: already });
      } catch {
        if (!cancelled) setState({ kind: 'error', message: t.missing });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [bookId, t.missing]);

  const startDownload = useCallback(async () => {
    if (state.kind !== 'ready' && state.kind !== 'error') return;
    let manifest: BookManifest;
    try {
      manifest = state.kind === 'ready' ? state.manifest : await getBookManifest(bookId);
    } catch {
      setState({ kind: 'error', message: t.missing });
      return;
    }
    await requestPersistentStorage();
    setState({ kind: 'downloading', progress: { loaded: 0, total: manifest.bytes, page: 0, pages: manifest.pages } });
    const res = await downloadBook(manifest, (p) => setState({ kind: 'downloading', progress: p }));
    if (res.ok) {
      markDownloaded(bookId);
      setState({ kind: 'ready', manifest, offline: true });
    } else {
      setState({ kind: 'error', message: t.missing });
    }
  }, [state, bookId, t.missing]);

  // Reset the image fade whenever the page changes.
  useEffect(() => setImgLoaded(false), [page]);

  // Preload the next two pages so turning a page never stalls.
  useEffect(() => {
    if (state.kind !== 'ready') return;
    for (const p of [page + 1, page + 2]) {
      const entry = state.manifest.index.find((x) => x.p === p);
      if (entry) new Image().src = pageUrl(bookId, entry.f);
    }
  }, [page, state, bookId]);

  const totalPages = state.kind === 'ready' ? state.manifest.pages : 0;
  const current = state.kind === 'ready' ? state.manifest.index.find((x) => x.p === page) : undefined;

  const go = (delta: number) => setPage((p) => Math.min(totalPages || 1, Math.max(1, p + delta)));

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0b1020]" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <button
          onClick={onClose}
          className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/10"
        >
          <X size={18} /> {t.close}
        </button>

        {state.kind === 'ready' && (
          <div className="flex items-center gap-2 text-xs text-white/60">
            <BookOpen size={14} />
            <span>
              {t.page} {page} {t.of} {totalPages}
            </span>
            {state.offline && (
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-emerald-300">
                <WifiOff size={12} /> {t.offline}
              </span>
            )}
            {(state.manifest.units?.length ?? 0) > 0 && (
              <button
                onClick={() => setShowToc((v) => !v)}
                className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-white/80 hover:bg-white/20"
              >
                <List size={12} /> {t.contents}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Contents drawer — real units and lessons from the source book. */}
      {showToc && state.kind === 'ready' && (
        <div className="max-h-[55vh] overflow-auto border-b border-white/10 bg-[#111834] px-4 py-3">
          <div className="mb-2 text-xs font-bold text-white/70">{t.chapters}</div>
          <div className="space-y-3">
            {state.manifest.units?.map((u, ui) => (
              <div key={ui} className="space-y-1">
                <div className="text-sm font-semibold text-indigo-200">{u.unit}</div>
                {u.lessons.map((l, li) => (
                  <button
                    key={li}
                    onClick={() => {
                      if (l.page) {
                        setPage(l.page);
                        setShowToc(false);
                      }
                    }}
                    disabled={!l.page}
                    className="flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-start text-xs text-white/75 hover:bg-white/10 disabled:opacity-40"
                  >
                    <span>{l.title}</span>
                    {l.page && <span className="shrink-0 text-white/45">{l.page}</span>}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Body */}
      <div ref={scrollRef} className="relative flex-1 overflow-auto">
        {state.kind === 'loading' && (
          <div className="flex h-full items-center justify-center gap-3 text-white/70">
            <Loader2 className="animate-spin" size={22} /> {t.loading}
          </div>
        )}

        {state.kind === 'downloading' && (
          <div className="flex h-full flex-col items-center justify-center gap-4 px-8 text-center">
            <Download className="text-indigo-300" size={30} />
            <div className="text-white/90">
              {t.downloading} — {state.progress.page}/{state.progress.pages}
            </div>
            <div className="h-2 w-full max-w-sm overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-indigo-400 transition-all"
                style={{
                  width: `${state.progress.total ? Math.round((state.progress.loaded / state.progress.total) * 100) : 0}%`,
                }}
              />
            </div>
          </div>
        )}

        {state.kind === 'error' && (
          <div className="flex h-full flex-col items-center justify-center gap-4 px-8 text-center text-white/75">
            <WifiOff size={28} />
            <p>{state.message}</p>
            <button
              onClick={startDownload}
              className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400"
            >
              {t.retry}
            </button>
          </div>
        )}

        {state.kind === 'ready' && current && (
          <div className="flex justify-center p-2">
            {!imgLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="animate-spin text-white/40" size={22} />
              </div>
            )}
            <img
              key={current.f}
              src={pageUrl(bookId, current.f)}
              alt={`${t.page} ${page}`}
              onLoad={() => setImgLoaded(true)}
              className={`h-auto w-full max-w-3xl rounded-lg transition-opacity duration-200 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
              style={{ aspectRatio: `${current.w} / ${current.h}` }}
            />
          </div>
        )}
      </div>

      {/* Footer: download prompt + page turner */}
      {state.kind === 'ready' && !state.offline && (
        <div className="border-t border-white/10 px-4 py-3">
          <button
            onClick={startDownload}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-500 px-4 py-3 text-sm font-medium text-white hover:bg-indigo-400"
          >
            <Download size={18} /> {t.download} ({Math.round(state.manifest.bytes / 1024 / 1024)} MB)
          </button>
        </div>
      )}

      {state.kind === 'ready' && (
        <div className="flex items-center justify-between border-t border-white/10 px-4 py-2">
          <button
            onClick={() => go(language === 'ar' ? 1 : -1)}
            className="rounded-lg p-2 text-white/80 hover:bg-white/10"
            aria-label="previous"
          >
            <ChevronRight size={20} className={language === 'ar' ? '' : 'rotate-180'} />
          </button>
          <input
            type="range"
            min={1}
            max={totalPages}
            value={page}
            onChange={(e) => setPage(Number(e.target.value))}
            className="mx-4 flex-1 accent-indigo-400"
          />
          <button
            onClick={() => go(language === 'ar' ? -1 : 1)}
            className="rounded-lg p-2 text-white/80 hover:bg-white/10"
            aria-label="next"
          >
            <ChevronLeft size={20} className={language === 'ar' ? '' : 'rotate-180'} />
          </button>
        </div>
      )}
    </div>
  );
};
