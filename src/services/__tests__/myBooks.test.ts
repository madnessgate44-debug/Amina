/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * My Books tests (Phase 4).
 *
 * The privacy requirement is the point of this suite: page images must be
 * built and stored on the device, and no book content may appear in a request
 * body, in the repository, or in an export.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { buildImportedBook, isSupportedImage, withProgress } from '../myBooks/bookImportService';
import { parseTrainingCards } from '../myBooks/bookTraining';
import { IndexedDBStorageService } from '../storage/IndexedDBStorageService';
import { ImportedBook, BookTrainingCard } from '../../types';

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`✅ [PASS] ${message}`);
    passed++;
  } else {
    console.error(`❌ [FAIL] ${message}`);
    failed++;
    process.exitCode = 1;
  }
}

function makeFile(name: string, type: string, bytes: number[]): File {
  return new File([new Uint8Array(bytes)], name, { type });
}

// A tiny but real 1x1 PNG.
const PNG_BYTES = [
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
  0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
  0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
  0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4,
  0x89, 0x00, 0x00, 0x00, 0x0a, 0x49, 0x44, 0x41,
  0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00,
  0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00,
  0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae,
  0x42, 0x60, 0x82,
];

async function main() {
  // --- 1. Import builds real pages, on the device -----------------------
  const files = [
    makeFile('p1.png', 'image/png', PNG_BYTES),
    makeFile('p2.png', 'image/png', PNG_BYTES),
    makeFile('p3.png', 'image/png', PNG_BYTES),
  ];

  const book = await buildImportedBook({
    studentId: 'stu_test',
    title: '  Maths Term 1  ',
    author: 'Ministry',
    subject: 'Maths',
    files,
    makeId: () => 'book_fixed',
    now: () => '2026-10-25T00:00:00.000Z',
  });

  assert(book.pages.length === 3, '1.1 every chosen file becomes a page');
  assert(book.pages.every((p, i) => p.index === i + 1), '1.2 pages are numbered 1..n in the chosen order');
  assert(book.pages[0].dataUrl.startsWith('data:image/png;base64,'), '1.3 a page is stored as a device-local data URL');
  assert(book.coverDataUrl === book.pages[0].dataUrl, '1.4 the cover reuses page 1 (no extra copy)');
  assert(book.title === 'Maths Term 1', '1.5 the title is trimmed');
  assert(book.id === 'book_fixed' && book.createdAt === '2026-10-25T00:00:00.000Z', '1.6 id and timestamp come from the injected clock');

  const untitled = await buildImportedBook({ studentId: 's', title: '   ', files: [files[0]] });
  assert(untitled.title === 'Untitled book', '1.7 an empty title never yields an empty book name');
  assert(untitled.author === undefined, '1.8 a blank author is dropped rather than stored as ""');

  // --- 2. Progress is remembered ---------------------------------------
  const resumed = withProgress(book, 2, '2026-10-25T01:00:00.000Z');
  assert(resumed.lastPageIndex === 2, '2.1 reopening remembers the page the learner stopped on');
  assert(resumed.lastOpenedAt === '2026-10-25T01:00:00.000Z', '2.2 the open time is recorded');
  assert(resumed.pages === book.pages, '2.3 progress does not clone or drop the page images');

  // --- 3. Only images are accepted --------------------------------------
  assert(isSupportedImage(makeFile('a.jpg', 'image/jpeg', [1])), '3.1 jpeg accepted');
  assert(isSupportedImage(makeFile('a.png', 'image/png', [1])), '3.2 png accepted');
  assert(isSupportedImage(new File([new Uint8Array([1])], 'scan.HEIC', { type: '' })), '3.3 HEIC accepted by extension when the type is empty');
  assert(!isSupportedImage(makeFile('notes.pdf', 'application/pdf', [1])), '3.4 a pdf is rejected');
  assert(!isSupportedImage(makeFile('clip.mp4', 'video/mp4', [1])), '3.5 a video is rejected');

  // --- 4. Storage round-trips through the fallback (no IndexedDB) -------
  const storage = new IndexedDBStorageService();
  await storage.saveImportedBook(book);
  const stored = await storage.getImportedBooks('stu_test');
  assert(stored.length === 1 && stored[0].id === 'book_fixed', '4.1 a saved book is readable back');
  assert(stored[0].pages.length === 3, '4.2 page images survive the storage round trip');
  assert((await storage.getImportedBooks('someone_else')).length === 0, '4.3 books are scoped to one student');

  const card: BookTrainingCard = {
    id: 'card_1',
    bookId: 'book_fixed',
    studentId: 'stu_test',
    pageIndex: 2,
    question: 'What is 7 x 8?',
    answer: '56',
    createdAt: '2026-10-25T00:00:00.000Z',
  };
  await storage.saveBookTrainingCard(card);
  assert((await storage.getBookTrainingCards('stu_test')).length === 1, '4.4 a training card is readable back');

  await storage.deleteBookTrainingCard('card_1');
  assert((await storage.getBookTrainingCards('stu_test')).length === 0, '4.5 deleting a card removes it');

  await storage.saveBookTrainingCard(card);
  await storage.deleteImportedBook('book_fixed');
  assert((await storage.getImportedBooks('stu_test')).length === 0, '4.6 deleting a book removes it');
  assert((await storage.getBookTrainingCards('stu_test')).length === 0, '4.7 deleting a book also removes its training cards');

  // --- 5. Training-card parsing handles real model replies ---------------
  const wellFormed = parseTrainingCards('1. What is 2+2?\nA: 4\n2. What is 3x3?\nA: 9');
  assert(wellFormed.length === 2, '5.1 a numbered question/answer reply yields one card per question');
  assert(wellFormed[0].question === 'What is 2+2?' && wellFormed[0].answer === '4', '5.2 question text and answer are separated');
  assert(wellFormed[1].answer === '9', '5.3 the second answer is captured');

  const arabic = parseTrainingCards('١- ما هو الجمع؟\nج: ضم الأعداد\n٢- ما هو الطرح؟\nج: إنقاص الأعداد');
  assert(arabic.length === 2, '5.4 Arabic numbering is handled');
  assert(arabic[0].answer === 'ضم الأعداد', '5.5 the Arabic answer prefix "ج:" is stripped');

  const messy = parseTrainingCards('What is the capital of Egypt?\nIt is Cairo.');
  assert(messy.length >= 1 && messy[0].question.includes('capital'), '5.6 an unformatted reply still yields a usable card');
  assert(parseTrainingCards('').length === 0, '5.7 an empty reply yields no cards');

  // --- 6. The privacy boundary ------------------------------------------
  const serviceSrc = readFileSync(new URL('../myBooks/bookImportService.ts', import.meta.url), 'utf8');
  assert(!/fetch\(|XMLHttpRequest|axios|navigator\.sendBeacon/.test(serviceSrc), '6.1 the import service makes no network call');

  const componentDir = new URL('../../components/myBooks/', import.meta.url);
  const componentFiles = readdirSync(componentDir).filter((f) => f.endsWith('.tsx'));
  const bookReaderSrc = readFileSync(new URL('BookReader.tsx', componentDir), 'utf8');
  const trainSrc = readFileSync(new URL('TrainMeSheet.tsx', componentDir), 'utf8');

  assert(componentFiles.length > 0, '6.2 the My Books components exist');
  assert(!/dataUrl/.test(trainSrc), '6.3 "Train me" never references a page image');
  const askNoorPayload = bookReaderSrc.match(/setCompanionContext\(\{([\s\S]*?)\}\)/)?.[1] || '';
  assert(askNoorPayload.length > 0, '6.4a "Ask Noor" builds a companion context');
  assert(!/dataUrl/.test(askNoorPayload), '6.4b "Ask Noor" sends no page image');
  assert(/fetch\('\/api\/chat'/.test(trainSrc), '6.5 "Train me" uses the existing tutor route, not a new one');

  // --- 7. No book content in the repository ------------------------------
  const repoRoot = new URL('../../../', import.meta.url).pathname;
  const offenders: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir)) {
      if (entry === 'node_modules' || entry === '.git' || entry === 'dist' || entry === '.space-stage') continue;
      const full = join(dir, entry);
      const st = statSync(full);
      if (st.isDirectory()) {
        walk(full);
      } else if (/\.(jpe?g|png|gif|webp|bmp|heic)$/i.test(entry)) {
        offenders.push(relative(repoRoot, full));
      }
    }
  };
  walk(repoRoot);

  // The repo may legitimately hold app icons; what must not exist is a
  // directory of imported book pages.
  const bookContent = offenders.filter((f) => /my-?books?|imported[-_]?books?|book[-_]?pages?/i.test(f));
  assert(bookContent.length === 0, '7.1 no imported book images are committed to the repository');

  // --- 8. Exports omit page images --------------------------------------
  const exportSrc = readFileSync(new URL('../storage/IndexedDBStorageService.ts', import.meta.url), 'utf8');
  assert(/imagesOmitted: true/.test(exportSrc), '8.1 an export marks book images as omitted');
  assert(/importedBooks: importedBooks\.map\(/.test(exportSrc), '8.2 the export maps books to metadata only');

  console.log(`\nMY BOOKS SUITE SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  if (failed > 0) process.exit(1);
}

void main();
