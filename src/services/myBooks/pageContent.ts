/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * What Noor may see for the page the learner is studying.
 *
 * The rule, in one place so it can be tested and audited:
 *
 *  - A page with a text layer is sent as TEXT ONLY. pdf.js extracts it on the
 *    device; the page image is never transmitted.
 *  - A scanned page (no text layer) is sent as that ONE page image, rendered on
 *    the device, as a transient pass-through. The server does not persist or log
 *    it, and the rest of the book is never sent.
 *  - Nothing else about the book leaves the device: not the file, not the other
 *    pages, not the cover.
 */

import { ImportedBook, StudiedPageContent } from '../../types';
import { getPageText, renderPageToDataUrl, openPdf, PdfDocumentLike } from './pdfService';

/** Text longer than this is truncated before being sent, to bound the payload. */
export const MAX_PAGE_TEXT_CHARS = 6000;

/**
 * Resolves the studied page into something sendable.
 *
 * Returns null when the page cannot be resolved (missing page, unreadable PDF),
 * so a caller can degrade to "viewer only" instead of sending an empty payload.
 */
export async function resolveStudiedPage(params: {
  book: ImportedBook;
  pageNumber: number;
  /** Overridable for tests: an already-open pdf.js document. */
  pdfDoc?: PdfDocumentLike;
  openDocument?: (blob: Blob) => Promise<PdfDocumentLike>;
}): Promise<StudiedPageContent | null> {
  const { book, pageNumber } = params;

  if (book.kind === 'pdf' && book.pdfBlob) {
    const doc = params.pdfDoc ?? (await (params.openDocument ?? openPdf)(book.pdfBlob));
    const text = await getPageText(doc, pageNumber);
    if (text) {
      return { pageNumber, text: text.slice(0, MAX_PAGE_TEXT_CHARS) };
    }
    const imageDataUrl = await renderPageToDataUrl(doc, pageNumber);
    return imageDataUrl ? { pageNumber, imageDataUrl } : null;
  }

  const page = book.pages.find((p) => p.index === pageNumber);
  if (!page) return null;
  return { pageNumber, imageDataUrl: page.dataUrl };
}

/** True when the payload carries a page image rather than extracted text. */
export function isImagePayload(content: StudiedPageContent | null): boolean {
  return Boolean(content?.imageDataUrl);
}
