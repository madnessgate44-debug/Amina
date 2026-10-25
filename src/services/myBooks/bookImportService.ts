/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Client-side book import for "My Books".
 *
 * Everything here runs in the browser. An image is read into memory, downscaled
 * with a canvas so a phone photo does not blow up IndexedDB, and stored as a
 * data URL on the device. Nothing is uploaded, and no page image ever reaches a
 * server route, the network, or the repository.
 */

import { BookPage, ImportedBook } from '../../types';

/** Longest edge, in pixels, a stored page image is allowed to keep. */
export const MAX_PAGE_EDGE = 1600;

/** JPEG quality for stored page images. */
export const PAGE_JPEG_QUALITY = 0.72;

/**
 * Reads a File into a downscaled JPEG data URL.
 *
 * Falls back to the original data URL when a canvas is unavailable or the image
 * cannot be decoded, so import never silently drops the learner's page.
 */
export async function fileToPageDataUrl(file: File, maxEdge = MAX_PAGE_EDGE): Promise<string> {
  const original = await readFileAsDataUrl(file);
  if (typeof document === 'undefined') return original;

  try {
    const img = await loadImage(original);
    const scale = Math.min(1, maxEdge / Math.max(img.width, img.height));
    if (scale === 1 && file.type === 'image/jpeg') return original;

    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(img.width * scale));
    canvas.height = Math.max(1, Math.round(img.height * scale));
    const ctx = canvas.getContext('2d');
    if (!ctx) return original;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', PAGE_JPEG_QUALITY);
  } catch {
    return original;
  }
}

/**
 * Reads a File into a data URL.
 *
 * Uses `arrayBuffer` rather than `FileReader` so the importer also works
 * outside a DOM (worker, test runner). `FileReader` is only a fallback for
 * older engines without `Blob.arrayBuffer`.
 */
async function readFileAsDataUrl(file: File): Promise<string> {
  const type = file.type || 'image/jpeg';
  if (typeof file.arrayBuffer === 'function') {
    const buf = new Uint8Array(await file.arrayBuffer());
    return `data:${type};base64,${bytesToBase64(buf)}`;
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/** Base64-encodes bytes in chunks so a large page photo cannot overflow the stack. */
function bytesToBase64(bytes: Uint8Array): string {
  const CHUNK = 0x8000;
  let binary = '';
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  return btoa(binary);
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('image decode failed'));
    img.src = src;
  });
}

/**
 * Builds an ImportedBook from a set of chosen files, in the order given.
 *
 * Files are treated as pages 1..n. The caller decides the order; this function
 * does not sort by name, because a learner who reorders the picker expects that
 * order to be kept.
 */
export async function buildImportedBook(params: {
  studentId: string;
  title: string;
  author?: string;
  subject?: string;
  files: File[];
  makeId?: () => string;
  now?: () => string;
}): Promise<ImportedBook> {
  const { studentId, title, author, subject, files } = params;
  const makeId = params.makeId ?? defaultId;
  const now = params.now ?? (() => new Date().toISOString());

  const addedAt = now();
  const pages: BookPage[] = [];
  for (let i = 0; i < files.length; i++) {
    pages.push({
      index: i + 1,
      dataUrl: await fileToPageDataUrl(files[i]),
      addedAt,
    });
  }

  return {
    id: makeId(),
    studentId,
    title: title.trim() || 'Untitled book',
    author: author?.trim() || undefined,
    subject: subject?.trim() || undefined,
    coverDataUrl: pages[0]?.dataUrl,
    pages,
    createdAt: addedAt,
  };
}

function defaultId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `book_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

/** Marks a book as opened now, and remembers the page. Returns the updated book. */
export function withProgress(book: ImportedBook, pageIndex: number, now = new Date().toISOString()): ImportedBook {
  return { ...book, lastOpenedAt: now, lastPageIndex: pageIndex };
}

/** True when the file looks like an image this importer can handle. */
export function isSupportedImage(file: File): boolean {
  return /^image\/(jpeg|png|webp|gif|bmp|heic|heif)$/i.test(file.type) || /\.(jpe?g|png|webp|gif|bmp|heic|heif)$/i.test(file.name);
}
