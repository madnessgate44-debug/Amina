/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Records "Train me" answers as mastery evidence.
 *
 * A practice card is tied to a book page, which has no curriculum concept id,
 * so the page is its own concept: `book:<bookId>:p<page>`. That keeps book
 * practice inside the same mastery engine as curriculum practice without
 * pretending a book page is a Ministry lesson.
 */

import { MasteryRecord } from '../../types';
import { createInitialMasteryRecord, addEvidenceToMastery } from '../mastery/masteryEngine';
import { IStorageService } from '../storage/IStorageService';

/**
 * Short, high-frequency words that carry little meaning on their own. They are
 * ignored when judging a partial answer, so "seven times" is not credited for
 * "seven times eight" merely because it contains "times".
 */
const STOPWORDS = new Set(['the', 'and', 'for', 'with', 'from', 'that', 'this', 'are', 'was', 'were', 'into', 'times', 'في', 'من', 'على', 'عن', 'إلى', 'هو', 'هي']);

/** The mastery concept id that represents one page of one book. */
export function bookPageConceptId(bookId: string, pageNumber: number): string {
  return `book:${bookId}:p${pageNumber}`;
}

/**
 * Judges a learner's typed answer against the card's expected answer.
 *
 * Deliberately forgiving: a child typing an answer on a phone should not fail
 * for punctuation, spacing, or a shorter phrasing that still contains the
 * substance. An empty answer is `wrong`; a substantially matching answer is
 * `full`; a partial overlap is `partial`.
 */
export function judgeAnswer(expected: string, learnerAnswer: string): 'full' | 'partial' | 'wrong' {
  const normalize = (s: string) =>
    s
      .toLowerCase()
      .replace(/[\u064B-\u065F\u0670]/g, '') // Arabic diacritics
      .replace(/[^\p{L}\p{N}\s]/gu, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  const exp = normalize(expected);
  const got = normalize(learnerAnswer);
  if (!got || !exp) return 'wrong';
  if (got === exp) return 'full';

  const keyTokens = (s: string) => s.split(' ').filter((t) => t.length > 2 && !STOPWORDS.has(t));
  const expTokens = new Set(keyTokens(exp));
  const gotTokens = keyTokens(got);

  // An expected answer with no key tokens (e.g. all stopwords) can only be
  // matched by containment.
  if (expTokens.size === 0) return exp.includes(got) || got.includes(exp) ? 'full' : 'wrong';
  if (gotTokens.length === 0) return 'wrong';

  const gotSet = new Set(gotTokens);
  // The learner gave every key word the answer needs, possibly with more.
  if ([...expTokens].every((t) => gotSet.has(t))) return 'full';

  const overlap = gotTokens.filter((t) => expTokens.has(t)).length;
  const ratio = overlap / expTokens.size;
  return ratio >= 0.5 ? 'partial' : 'wrong';
}

/**
 * Adds one practice answer as evidence, returning the updated record.
 *
 * `independence` is `unassisted` when the learner answered before revealing the
 * answer, and `revealed` when they had already seen it — so peeking does not
 * count the same as knowing.
 */
export async function recordBookPractice(params: {
  storage: IStorageService;
  studentId: string;
  bookId: string;
  pageNumber: number;
  expected: string;
  learnerAnswer: string;
  hadRevealed: boolean;
  timestamp?: string;
}): Promise<{ record: MasteryRecord; outcome: 'full' | 'partial' | 'wrong' }> {
  const { storage, studentId, bookId, pageNumber, expected, learnerAnswer, hadRevealed } = params;
  const conceptId = bookPageConceptId(bookId, pageNumber);

  const existing = (await storage.getMasteryRecord(studentId, conceptId)) ?? createInitialMasteryRecord(studentId, conceptId);
  const outcome = judgeAnswer(expected, learnerAnswer);

  const { updatedRecord } = addEvidenceToMastery(existing, {
    correctness: outcome,
    difficulty: 2,
    independence: hadRevealed ? 'revealed' : 'unassisted',
    modality: 'practice',
    notes: `My Books page ${pageNumber}`,
    timestamp: params.timestamp,
  });

  await storage.saveMasteryRecord(updatedRecord);
  return { record: updatedRecord, outcome };
}
