/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * "My Books" — the learner's own imported books.
 *
 * Privacy rule that shapes every type here: page images live in IndexedDB on
 * the device and are never uploaded, never sent to a route, and never written
 * to the repository. Only the learner's own questions about a page may reach
 * the AI, and only through the same tutor routes the rest of the app uses.
 */

/** A single imported page. `dataUrl` is device-local only. */
export interface BookPage {
  /** 1-based page number as the learner sees it. */
  index: number;
  /** Base64 data URL. Never leaves the device. */
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
  /** Cover thumbnail; also a device-local data URL. */
  coverDataUrl?: string;
  pages: BookPage[];
  createdAt: string;
  lastOpenedAt?: string;
  /** Page the learner was last on, so reopening resumes where they stopped. */
  lastPageIndex?: number;
}

/** A learner-authored study card derived from a book page. */
export interface BookTrainingCard {
  id: string;
  bookId: string;
  studentId: string;
  pageIndex: number;
  question: string;
  answer: string;
  createdAt: string;
}
