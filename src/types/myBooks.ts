/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * "My Books" — the learner's own imported books.
 *
 * Privacy rule that shapes every type here: book content lives in IndexedDB on
 * the device. A PDF is kept as its original Blob, not as per-page base64. The
 * server never stores, logs, caches or serves book content, and no book file is
 * ever committed to the repository.
 *
 * One page may be sent to the AI while it is being studied — as extracted text
 * when the page has a text layer, otherwise as that single page image — as a
 * transient pass-through that is neither persisted nor logged. See
 * `pageContent.ts` for the rule and `/api/study-page` in server.ts for the route.
 */

/** How a book was imported. */
export type BookKind = 'images' | 'pdf';

/** A single imported page image. `dataUrl` is device-local only. */
export interface BookPage {
  /** 1-based page number as the learner sees it. */
  index: number;
  /** Base64 data URL. Never leaves the device except as a studied page. */
  dataUrl: string;
  /** Optional learner caption, e.g. "exercises 3-5". */
  caption?: string;
  addedAt: string;
}

export interface ImportedBook {
  id: string;
  studentId: string;
  title: string;
  author?: string;
  subject?: string;
  /** `images` = photographed pages; `pdf` = an imported PDF file. */
  kind: BookKind;
  /** Cover thumbnail; also a device-local data URL. */
  coverDataUrl?: string;
  /** Page images. Populated for `images`; empty for `pdf`. */
  pages: BookPage[];
  /**
   * The original PDF, device-local. Stored as a Blob so a 400-page book costs
   * one compact file rather than 400 base64 strings. `pdf` books only.
   */
  pdfBlob?: Blob;
  /** Total pages. Equals `pages.length` for `images`. */
  pageCount: number;
  createdAt: string;
  lastOpenedAt?: string;
  /** Page the learner was last on, so reopening resumes where they stopped. */
  lastPageIndex?: number;
}

/** A practice card derived from a book page. */
export interface BookTrainingCard {
  id: string;
  bookId: string;
  studentId: string;
  pageIndex: number;
  question: string;
  answer: string;
  /** The learner's last typed answer, when they attempted it. */
  learnerAnswer?: string;
  /** How that answer was judged, once it has been checked. */
  outcome?: 'full' | 'partial' | 'wrong';
  createdAt: string;
}

/**
 * What can be sent to the AI for one studied page.
 *
 * Exactly one of `text` / `imageDataUrl` is set: text when the page has a text
 * layer, the rendered image otherwise.
 */
export interface StudiedPageContent {
  pageNumber: number;
  text?: string;
  imageDataUrl?: string;
}
