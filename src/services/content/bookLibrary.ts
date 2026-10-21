/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * On-demand curriculum downloads.
 *
 * Books are not bundled with the app. The shell installs small, and the device
 * fetches a book the first time it is opened, then keeps it offline. Page files
 * are content-stable and served immutable, so the browser's HTTP cache makes
 * every later open free.
 *
 * Nothing here fabricates content. If a book cannot be fetched, the reader is
 * told it is unavailable rather than shown a substitute.
 */

export interface BookSummary {
  id: string;
  subject: string;
  language: string;
  term: number;
  pages: number;
  bytes: number;
  width: number;
  unitCount: number;
}

export interface BookPage {
  p: number;
  f: string;
  w: number;
  h: number;
  kb: number;
}

export interface CurriculumUnit {
  unit: string;
  lessons: Array<{ title: string; page: number | null }>;
}

export interface BookManifest extends Omit<BookSummary, 'unitCount'> {
  source: string;
  index: BookPage[];
  units?: CurriculumUnit[];
}

const API = '/api/curriculum';

async function json<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

/** List every book the server can serve. */
export function listBooks(): Promise<BookSummary[]> {
  return json<{ books: BookSummary[] }>(`${API}/index`).then((r) => r.books);
}

/** Fetch one book's manifest (page list + unit/lesson structure). */
export function getBookManifest(bookId: string): Promise<BookManifest> {
  return json<BookManifest>(`${API}/${bookId}/manifest`);
}

/** URL for a single page image. Immutable, so safe to cache forever. */
export function pageUrl(bookId: string, file: string): string {
  return `${API}/${bookId}/pages/${file}`;
}

/**
 * Ask the browser to keep the app's storage. Without this an installed app's
 * downloaded books are "best effort": the OS may evict them under pressure.
 * Returns whether storage is now persistent.
 */
export async function requestPersistentStorage(): Promise<boolean> {
  if (!navigator.storage?.persist) return false;
  try {
    if (await navigator.storage.persisted?.()) return true;
    return await navigator.storage.persist();
  } catch {
    return false;
  }
}

export interface StorageStatus {
  usageBytes: number;
  quotaBytes: number;
  persisted: boolean;
}

export async function storageStatus(): Promise<StorageStatus | null> {
  if (!navigator.storage?.estimate) return null;
  try {
    const est = await navigator.storage.estimate();
    return {
      usageBytes: est.usage ?? 0,
      quotaBytes: est.quota ?? 0,
      persisted: (await navigator.storage.persisted?.()) ?? false,
    };
  } catch {
    return null;
  }
}

export interface DownloadProgress {
  loaded: number;
  total: number;
  page: number;
  pages: number;
}

/**
 * Download every page of a book into the HTTP cache, reporting progress.
 * Sequential rather than parallel: a child's phone on school WiFi should not
 * open thirty sockets at once, and progress is more honest one page at a time.
 */
export async function downloadBook(
  manifest: BookManifest,
  onProgress?: (p: DownloadProgress) => void,
): Promise<{ ok: boolean; failedPage?: number }> {
  await requestPersistentStorage();
  const total = manifest.index.length;
  let loaded = 0;
  for (let i = 0; i < total; i++) {
    const page = manifest.index[i];
    try {
      const res = await fetch(pageUrl(manifest.id, page.f), { cache: 'force-cache' });
      if (!res.ok) return { ok: false, failedPage: page.p };
      // Read the body so it lands in the cache.
      await res.blob();
    } catch {
      return { ok: false, failedPage: page.p };
    }
    loaded += page.kb * 1024;
    onProgress?.({ loaded, total: manifest.bytes, page: i + 1, pages: total });
  }
  return { ok: true };
}

const KEY = 'amina.downloadedBooks.v1';

/** Book ids the device has finished downloading. */
export function downloadedBookIds(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]') as string[];
  } catch {
    return [];
  }
}

export function markDownloaded(bookId: string): void {
  const ids = new Set(downloadedBookIds());
  ids.add(bookId);
  localStorage.setItem(KEY, JSON.stringify([...ids]));
}
