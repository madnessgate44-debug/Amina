/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * PDF reading for "My Books", built on pdf.js (pdfjs-dist, Apache-2.0).
 *
 * pdf.js is loaded lazily: a learner who never opens a PDF never downloads it.
 * The worker is bundled from the local package, never a CDN, so the app keeps
 * working offline and sends nothing to a third party just to render a page.
 *
 * Nothing here uploads anything. A page's text or a rendered page image is
 * returned to the caller, which decides whether the learner wants Noor to see
 * the page they are studying.
 */

/** The subset of the pdf.js module this service uses. */
export interface PdfjsLike {
  getDocument(src: unknown): { promise: Promise<PdfDocumentLike> };
  GlobalWorkerOptions?: { workerSrc: string };
}

export interface PdfDocumentLike {
  numPages: number;
  getPage(n: number): Promise<PdfPageLike>;
  destroy(): Promise<void>;
}

export interface PdfPageLike {
  getTextContent(): Promise<{ items: Array<{ str?: string }> }>;
  getViewport(params: { scale: number }): { width: number; height: number };
  render(params: unknown): { promise: Promise<void> };
}

/** Longest edge, in pixels, a rendered PDF page keeps before being sent. */
export const MAX_RENDER_EDGE = 1600;

/** JPEG quality for a rendered PDF page. */
export const RENDER_JPEG_QUALITY = 0.72;

/**
 * Loads pdf.js. Overridable so the Node test runner can hand in the legacy
 * build, which polyfills crypto calls the browser build assumes.
 */
export async function loadPdfjs(): Promise<PdfjsLike> {
  const mod = (await import('pdfjs-dist')) as unknown as PdfjsLike;
  if (typeof window !== 'undefined' && mod.GlobalWorkerOptions) {
    // Bundled locally by Vite; no CDN, no network fetch for the worker.
    mod.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url
    ).href;
  }
  return mod;
}

/** Opens a PDF held as a device-local Blob and reports how many pages it has. */
export async function openPdf(
  blob: Blob,
  loader: () => Promise<PdfjsLike> = loadPdfjs
): Promise<PdfDocumentLike> {
  const pdfjs = await loader();
  const data = new Uint8Array(await blob.arrayBuffer());
  // `isEvalSupported: false` keeps pdf.js from evaluating embedded JavaScript.
  return pdfjs.getDocument({ data, isEvalSupported: false }).promise;
}

/**
 * The text layer of one page, or null when the page has no usable text.
 *
 * A scanned page yields empty/whitespace text; the caller then falls back to
 * sending the rendered page image instead.
 */
export async function getPageText(doc: PdfDocumentLike, pageNumber: number): Promise<string | null> {
  const page = await doc.getPage(pageNumber);
  const content = await page.getTextContent();
  const text = content.items
    .map((item) => item.str || '')
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > 0 ? text : null;
}

/**
 * Renders one page to a JPEG data URL, scaled so its longest edge is `maxEdge`.
 *
 * Returns null outside a DOM (no canvas), so a caller in a test runner or
 * worker degrades to text-only rather than throwing.
 */
export async function renderPageToDataUrl(
  doc: PdfDocumentLike,
  pageNumber: number,
  maxEdge = MAX_RENDER_EDGE
): Promise<string | null> {
  if (typeof document === 'undefined') return null;

  const page = await doc.getPage(pageNumber);
  const base = page.getViewport({ scale: 1 });
  const scale = Math.min(2, maxEdge / Math.max(base.width, base.height));
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(viewport.width));
  canvas.height = Math.max(1, Math.round(viewport.height));
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  await page.render({ canvasContext: ctx, viewport, canvas }).promise;
  return canvas.toDataURL('image/jpeg', RENDER_JPEG_QUALITY);
}

/** True when the file is a PDF this importer accepts. */
export function isPdfFile(file: File): boolean {
  return file.type === 'application/pdf' || /\.pdf$/i.test(file.name);
}

/** Clamps a 1-based page number into the document's range. */
export function clampPage(pageNumber: number, pageCount: number): number {
  if (!Number.isFinite(pageNumber)) return 1;
  return Math.min(Math.max(1, Math.trunc(pageNumber)), Math.max(1, pageCount));
}
