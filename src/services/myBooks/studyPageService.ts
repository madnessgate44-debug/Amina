/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Talks to `/api/study-page` for the one page the learner is studying.
 *
 * This is the only place in "My Books" that sends anything to the server, and
 * what it sends is bounded by `resolveStudiedPage`: the page's extracted text,
 * or that one page's image. The book file, the cover and every other page stay
 * on the device.
 */

import { ImportedBook } from '../../types';
import { resolveStudiedPage } from './pageContent';
import { PdfDocumentLike } from './pdfService';

export interface StudyPageCard {
  question: string;
  answer: string;
}

export interface StudyPageResult {
  reply?: string;
  cards: StudyPageCard[];
  pageNumber: number;
  degraded?: boolean;
}

export interface StudyPageRequest {
  book: ImportedBook;
  pageNumber: number;
  mode: 'explain' | 'train';
  question?: string;
  language: string;
  grade?: string;
  studentName?: string;
  addressForm?: string;
  /** Overridable for tests. */
  pdfDoc?: PdfDocumentLike;
  fetchImpl?: typeof fetch;
}

/** True when the resolved payload is a page image rather than extracted text. */
export interface StudyPagePayloadSummary {
  pageNumber: number;
  usedText: boolean;
  usedImage: boolean;
}

/**
 * Sends the studied page and returns Noor's reply or practice cards.
 *
 * Returns a `degraded` result when the page cannot be resolved or the network
 * fails, so the reader can stay a plain viewer instead of showing an error.
 */
export async function requestStudyPage(req: StudyPageRequest): Promise<StudyPageResult> {
  const content = await resolveStudiedPage({
    book: req.book,
    pageNumber: req.pageNumber,
    pdfDoc: req.pdfDoc,
  });

  if (!content) {
    return { cards: [], pageNumber: req.pageNumber, degraded: true };
  }

  const body: Record<string, unknown> = {
    pageNumber: content.pageNumber,
    mode: req.mode,
    language: req.language,
    grade: req.grade || 'Grade 5',
    studentName: req.studentName,
    addressForm: req.addressForm,
    bookTitle: req.book.title,
    subject: req.book.subject,
  };
  if (content.text) body.pageText = content.text;
  if (content.imageDataUrl) body.imageBase64 = content.imageDataUrl;
  if (req.question) body.question = req.question;

  const doFetch = req.fetchImpl ?? fetch;
  try {
    const res = await doFetch('/api/study-page', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return {
      reply: data?.reply,
      cards: Array.isArray(data?.cards) ? data.cards : [],
      pageNumber: content.pageNumber,
      degraded: Boolean(data?.degraded),
    };
  } catch {
    return { cards: [], pageNumber: content.pageNumber, degraded: true };
  }
}

/** Describes what a request WOULD send, without sending it. Used by tests. */
export async function summarizeStudyPagePayload(req: {
  book: ImportedBook;
  pageNumber: number;
  pdfDoc?: PdfDocumentLike;
}): Promise<StudyPagePayloadSummary> {
  const content = await resolveStudiedPage({
    book: req.book,
    pageNumber: req.pageNumber,
    pdfDoc: req.pdfDoc,
  });
  return {
    pageNumber: content?.pageNumber ?? req.pageNumber,
    usedText: Boolean(content?.text),
    usedImage: Boolean(content?.imageDataUrl),
  };
}
