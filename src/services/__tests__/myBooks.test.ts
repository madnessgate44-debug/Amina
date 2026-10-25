/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * My Books tests (Phase 4).
 *
 * The privacy requirement is the point of this suite: a book lives on the
 * device, and the only thing that may reach the server is the single page being
 * studied. These tests also cover PDF import and on-demand page rendering with
 * a small PDF generated in-test.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import {
  buildImportedBook,
  buildPdfBook,
  isSupportedImage,
  isSupportedBookFile,
  withProgress,
} from '../myBooks/bookImportService';
import { parseTrainingCards } from '../myBooks/bookTraining';
import { resolveStudiedPage } from '../myBooks/pageContent';
import { judgeAnswer, bookPageConceptId, recordBookPractice } from '../myBooks/bookMastery';
import { requestStudyPage } from '../myBooks/studyPageService';
import { renderPageToDataUrl, getPageText, isPdfFile, clampPage, PdfDocumentLike } from '../myBooks/pdfService';
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

/**
 * Builds a small, valid 2-page PDF: page 1 carries a text layer, page 2 has an
 * empty content stream, which stands in for a scanned page with no text.
 */
function buildTestPdf(): Uint8Array {
  const objs: string[] = [];
  objs[1] = '<< /Type /Catalog /Pages 2 0 R >>';
  objs[2] = '<< /Type /Pages /Kids [3 0 R 6 0 R] /Count 2 >>';
  objs[3] = '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 300 200] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>';
  const s1 = 'BT /F1 18 Tf 20 150 Td (Chapter One Fractions) Tj ET';
  objs[4] = `<< /Length ${s1.length} >>\nstream\n${s1}\nendstream`;
  objs[5] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';
  objs[6] = '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 300 200] /Contents 7 0 R /Resources << >> >>';
  objs[7] = '<< /Length 0 >>\nstream\n\nendstream';

  let out = '%PDF-1.4\n';
  const offsets: number[] = [];
  for (let i = 1; i < objs.length; i++) {
    offsets[i] = out.length;
    out += `${i} 0 obj\n${objs[i]}\nendobj\n`;
  }
  const xref = out.length;
  out += `xref\n0 ${objs.length}\n0000000000 65535 f \n`;
  for (let i = 1; i < objs.length; i++) out += String(offsets[i]).padStart(10, '0') + ' 00000 n \n';
  out += `trailer\n<< /Size ${objs.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return new TextEncoder().encode(out);
}

/** Opens a PDF Blob with the legacy pdf.js build, which Node needs. */
async function openTestPdf(blob: Blob): Promise<PdfDocumentLike> {
  const mod = (await import('pdfjs-dist/legacy/build/pdf.mjs')) as unknown as {
    getDocument(src: unknown): { promise: Promise<PdfDocumentLike> };
  };
  const data = new Uint8Array(await blob.arrayBuffer());
  return mod.getDocument({ data, isEvalSupported: false }).promise;
}

async function main() {
  // --- 1. Image import builds real pages, on the device -----------------
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
  assert(book.kind === 'images' && book.pageCount === 3, '1.7 an image book reports its kind and page count');

  const untitled = await buildImportedBook({ studentId: 's', title: '   ', files: [files[0]] });
  assert(untitled.title === 'Untitled book', '1.8 an empty title never yields an empty book name');
  assert(untitled.author === undefined, '1.9 a blank author is dropped rather than stored as ""');

  // --- 2. Progress is remembered ---------------------------------------
  const resumed = withProgress(book, 2, '2026-10-25T01:00:00.000Z');
  assert(resumed.lastPageIndex === 2, '2.1 reopening remembers the page the learner stopped on');
  assert(resumed.lastOpenedAt === '2026-10-25T01:00:00.000Z', '2.2 the open time is recorded');
  assert(resumed.pages === book.pages, '2.3 progress does not clone or drop the page images');

  // --- 3. Accepted files: images and PDFs -------------------------------
  assert(isSupportedImage(makeFile('a.jpg', 'image/jpeg', [1])), '3.1 jpeg accepted');
  assert(isSupportedImage(makeFile('a.png', 'image/png', [1])), '3.2 png accepted');
  assert(isSupportedImage(new File([new Uint8Array([1])], 'scan.HEIC', { type: '' })), '3.3 HEIC accepted by extension when the type is empty');
  assert(!isSupportedImage(makeFile('notes.pdf', 'application/pdf', [1])), '3.4 the image filter still rejects a pdf (kept separate)');
  assert(isPdfFile(makeFile('book.pdf', 'application/pdf', [1])), '3.5 a pdf is recognised by its type');
  assert(isPdfFile(new File([new Uint8Array([1])], 'Al-Adwaa.PDF', { type: '' })), '3.6 a pdf is recognised by its extension');
  assert(isSupportedBookFile(makeFile('book.pdf', 'application/pdf', [1])), '3.7 the book importer accepts a pdf');
  assert(isSupportedBookFile(makeFile('p.png', 'image/png', [1])), '3.8 the book importer still accepts images');
  assert(!isSupportedBookFile(makeFile('clip.mp4', 'video/mp4', [1])), '3.9 a video is rejected');
  assert(clampPage(0, 10) === 1 && clampPage(99, 10) === 10, '3.10 page numbers are clamped into the book');

  // --- 4. PDF import keeps the file as a Blob ---------------------------
  const pdfBytes = buildTestPdf();
  const pdfFile = new File([pdfBytes as BlobPart], 'Al-Adwaa-Term1.pdf', { type: 'application/pdf' });
  const pdfBook = await buildPdfBook({
    studentId: 'stu_test',
    title: '',
    subject: 'Maths',
    file: pdfFile,
    makeId: () => 'book_pdf',
    now: () => '2026-10-25T00:00:00.000Z',
    openDocument: openTestPdf,
  });

  assert(pdfBook.kind === 'pdf', '4.1 a pdf import is marked as a pdf book');
  assert(pdfBook.pageCount === 2, '4.2 the page count is read from the file (no pages rendered at import)');
  assert(pdfBook.pages.length === 0, '4.3 a pdf book stores no per-page base64');
  assert(pdfBook.pdfBlob instanceof Blob && pdfBook.pdfBlob.size === pdfBytes.length, '4.4 the original pdf is kept whole as a Blob');
  assert(pdfBook.title === 'Al-Adwaa-Term1', '4.5 a blank title falls back to the file name');
  assert(pdfBook.coverDataUrl === undefined, '4.6 a pdf book carries no cover image');

  // --- 5. A PDF with a text layer sends TEXT ONLY -----------------------
  const pdfDoc = await openTestPdf(pdfFile);
  const page1Text = await getPageText(pdfDoc, 1);
  assert(page1Text === 'Chapter One Fractions', '5.1 the text layer of page 1 is extracted');

  const studied1 = await resolveStudiedPage({ book: pdfBook, pageNumber: 1, pdfDoc });
  assert(studied1?.text === 'Chapter One Fractions', '5.2 a text page is sent as its text');
  assert(studied1?.imageDataUrl === undefined, '5.3 a text page sends NO image');

  // --- 6. A scanned page (no text layer) sends ONE page image -----------
  const page2Text = await getPageText(pdfDoc, 2);
  assert(page2Text === null, '6.1 a page with no text layer yields no text');

  // Node has no canvas, so a DOM stub is required to exercise the real
  // render path. The scaling and data-URL logic under test is not stubbed.
  const originalDocument = (globalThis as any).document;
  const canvasStub: any = { width: 0, height: 0 };
  canvasStub.getContext = () => ({ drawImage() {} });
  canvasStub.toDataURL = (type: string) => `data:${type};base64,RENDERED`;
  (globalThis as any).document = { createElement: () => canvasStub };

  const renderDoc: PdfDocumentLike = {
    numPages: 1,
    destroy: async () => {},
    getPage: async () => ({
      getTextContent: async () => ({ items: [] }),
      getViewport: ({ scale }: { scale: number }) => ({ width: 300 * scale, height: 200 * scale }),
      render: () => ({ promise: Promise.resolve() }),
    }),
  };

  const rendered = await renderPageToDataUrl(renderDoc, 1, 1600);
  assert(rendered === 'data:image/jpeg;base64,RENDERED', '6.2 a scanned page renders to a JPEG data URL');
  assert(canvasStub.width === 600 && canvasStub.height === 400, '6.3 the render is scaled to the configured edge');

  const studied2 = await resolveStudiedPage({ book: pdfBook, pageNumber: 2, pdfDoc: renderDoc });
  assert(studied2?.imageDataUrl === 'data:image/jpeg;base64,RENDERED', '6.4 a scanned page is sent as that ONE page image');
  assert(studied2?.text === undefined, '6.5 a scanned page sends no text');

  (globalThis as any).document = originalDocument;

  // --- 7. An image book sends only the page being studied ---------------
  const studiedImg = await resolveStudiedPage({ book, pageNumber: 2 });
  assert(studiedImg?.imageDataUrl === book.pages[1].dataUrl, '7.1 an image book sends the studied page only');
  assert((await resolveStudiedPage({ book, pageNumber: 99 })) === null, '7.2 a missing page resolves to nothing, not a wrong page');

  // --- 8. The request body carries one page, never the book -------------
  let capturedBody: any = null;
  const fetchStub = (async (_url: string, init: any) => {
    capturedBody = JSON.parse(init.body);
    return { json: async () => ({ reply: 'ok', cards: [], pageNumber: 2 }) } as any;
  }) as unknown as typeof fetch;

  await requestStudyPage({ book, pageNumber: 2, mode: 'explain', language: 'ar', fetchImpl: fetchStub });
  assert(capturedBody.pageNumber === 2, '8.1 the studied page number is sent');
  assert(capturedBody.imageBase64 === book.pages[1].dataUrl, '8.2 exactly the studied page image is sent');
  assert(!('pages' in capturedBody) && !('pdfBlob' in capturedBody), '8.3 the book file and other pages are never sent');

  await requestStudyPage({ book: pdfBook, pageNumber: 1, mode: 'explain', language: 'ar', pdfDoc, fetchImpl: fetchStub });
  assert(typeof capturedBody.pageText === 'string' && capturedBody.pageText.includes('Fractions'), '8.4 a text page sends only the page text');
  assert(!('imageBase64' in capturedBody), '8.5 a text page sends no image in the request body');

  // --- 9. Answer checking and mastery evidence --------------------------
  assert(judgeAnswer('Cairo', 'cairo') === 'full', '9.1 a matching answer is correct, case-insensitively');
  assert(judgeAnswer('Cairo, Egypt', 'cairo egypt') === 'full', '9.2 the same key words with different punctuation is correct');
  assert(judgeAnswer('The Nile river', 'the nile') === 'partial', '9.2b a key word left out is only partial');
  assert(judgeAnswer('', 'anything') === 'wrong', '9.3 an unanswerable card is never "correct"');
  assert(judgeAnswer('Cairo', '') === 'wrong', '9.4 a blank answer is wrong');
  assert(judgeAnswer('seven times eight', 'seven times') === 'partial', '9.5 a partial answer is scored partial');
  assert(judgeAnswer('Cairo', 'Alexandria') === 'wrong', '9.6 a different answer is wrong');
  assert(bookPageConceptId('b1', 3) === 'book:b1:p3', '9.7 a book page maps to its own mastery concept');

  const storage = new IndexedDBStorageService();
  const first = await recordBookPractice({
    storage, studentId: 'stu_test', bookId: 'b1', pageNumber: 3,
    expected: '56', learnerAnswer: '56', hadRevealed: false,
  });
  assert(first.outcome === 'full' && first.record.evidenceCount === 1, '9.8 a correct answer is recorded as mastery evidence');
  const peeked = await recordBookPractice({
    storage, studentId: 'stu_test', bookId: 'b1', pageNumber: 3,
    expected: '56', learnerAnswer: '56', hadRevealed: true,
  });
  assert(peeked.record.evidenceLog[0].independence === 'revealed', '9.9 an answer given after peeking is marked as revealed');
  const persisted = await storage.getMasteryRecord('stu_test', 'book:b1:p3');
  assert(persisted !== null && persisted.evidenceCount === 2, '9.10 mastery evidence persists for the page');

  // --- 10. Storage round-trips books and cards --------------------------
  await storage.saveImportedBook(book);
  await storage.saveImportedBook(pdfBook);
  const stored = await storage.getImportedBooks('stu_test');
  assert(stored.length === 2, '10.1 saved books are readable back');
  assert(stored.find((b) => b.id === 'book_fixed')!.pages.length === 3, '10.2 page images survive the storage round trip');
  assert(stored.find((b) => b.id === 'book_pdf')!.kind === 'pdf', '10.3 a pdf book keeps its kind through storage');
  assert((await storage.getImportedBooks('someone_else')).length === 0, '10.4 books are scoped to one student');

  const card: BookTrainingCard = {
    id: 'card_1', bookId: 'book_fixed', studentId: 'stu_test', pageIndex: 2,
    question: 'What is 7 x 8?', answer: '56', createdAt: '2026-10-25T00:00:00.000Z',
  };
  await storage.saveBookTrainingCard(card);
  assert((await storage.getBookTrainingCards('stu_test')).length === 1, '10.5 a training card is readable back');
  await storage.deleteBookTrainingCard('card_1');
  assert((await storage.getBookTrainingCards('stu_test')).length === 0, '10.6 deleting a card removes it');

  await storage.saveBookTrainingCard(card);
  await storage.deleteImportedBook('book_fixed');
  assert((await storage.getImportedBooks('stu_test')).some((b) => b.id === 'book_pdf'), '10.7 deleting one book leaves the others');
  assert((await storage.getBookTrainingCards('stu_test')).length === 0, '10.8 deleting a book also removes its training cards');

  // --- 11. Training-card parsing handles real model replies -------------
  const wellFormed = parseTrainingCards('1. What is 2+2?\nA: 4\n2. What is 3x3?\nA: 9');
  assert(wellFormed.length === 2, '11.1 a numbered question/answer reply yields one card per question');
  assert(wellFormed[0].question === 'What is 2+2?' && wellFormed[0].answer === '4', '11.2 question text and answer are separated');
  const arabic = parseTrainingCards('١- ما هو الجمع؟\nج: ضم الأعداد\n٢- ما هو الطرح؟\nج: إنقاص الأعداد');
  assert(arabic.length === 2 && arabic[0].answer === 'ضم الأعداد', '11.3 Arabic numbering and the "ج:" prefix are handled');
  assert(parseTrainingCards('').length === 0, '11.4 an empty reply yields no cards');

  // --- 12. The privacy boundary, client side ----------------------------
  const importSrc = readFileSync(new URL('../myBooks/bookImportService.ts', import.meta.url), 'utf8');
  assert(!/fetch\(|XMLHttpRequest|axios|navigator\.sendBeacon/.test(importSrc), '12.1 the import service makes no network call');

  const componentDir = new URL('../../components/myBooks/', import.meta.url);
  const componentFiles = readdirSync(componentDir).filter((f) => f.endsWith('.tsx'));
  const bookReaderSrc = readFileSync(new URL('BookReader.tsx', componentDir), 'utf8');
  const trainSrc = readFileSync(new URL('TrainMeSheet.tsx', componentDir), 'utf8');

  assert(componentFiles.length > 0, '12.2 the My Books components exist');
  assert(/requestStudyPage/.test(trainSrc), '12.3 "Train me" goes through the study-page service');
  assert(/requestStudyPage/.test(bookReaderSrc), '12.4 "Ask Noor" goes through the study-page service');
  assert(!/dataUrl/.test(trainSrc), '12.5 "Train me" never touches a page image directly');
  assert(/resolveStudiedPage/.test(bookReaderSrc), '12.6 "Ask Noor" resolves exactly one studied page');

  const serviceSrc = readFileSync(new URL('../myBooks/studyPageService.ts', import.meta.url), 'utf8');
  assert(/content\.text/.test(serviceSrc) && /content\.imageDataUrl/.test(serviceSrc), '12.7 only resolved page content is sent');
  assert(!/book\.pages/.test(serviceSrc) && !/pdfBlob/.test(serviceSrc), '12.8 the service never sends the book or its pages array');

  // --- 13. The server never stores or logs book content -----------------
  const serverSrc = readFileSync(new URL('../../../server.ts', import.meta.url), 'utf8');
  const routeStart = serverSrc.indexOf("app.post('/api/study-page'");
  assert(routeStart > -1, '13.1 the study-page route exists');
  const routeSrc = serverSrc.slice(routeStart, serverSrc.indexOf('\n// Day Record Reconstruction', routeStart));

  assert(!/console\./.test(routeSrc), '13.2 the study-page route logs nothing');
  assert(!/writeFile|createWriteStream|fs\.|appendFile/.test(routeSrc), '13.3 the study-page route writes nothing to disk');
  assert(!/saveImportedBook|localStorage|sessionStorage|cache|\.put\(/.test(routeSrc), '13.4 the study-page route persists and caches nothing');
  assert(/pageText/.test(routeSrc) && /imageBase64/.test(routeSrc), '13.5 the route accepts exactly one page (text or image)');
  assert(!/book\.pages/.test(routeSrc), '13.6 the route has no concept of a whole book');

  // --- 14. No book content in the repository ----------------------------
  const repoRoot = new URL('../../../', import.meta.url).pathname;
  const offenders: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir)) {
      if (entry === 'node_modules' || entry === '.git' || entry === 'dist' || entry === '.space-stage') continue;
      const full = join(dir, entry);
      const st = statSync(full);
      if (st.isDirectory()) walk(full);
      else if (/\.(jpe?g|png|gif|webp|bmp|heic|pdf)$/i.test(entry)) offenders.push(relative(repoRoot, full));
    }
  };
  walk(repoRoot);

  const bookContent = offenders.filter((f) => /my-?books?|imported[-_]?books?|book[-_]?pages?|al-?adwaa|selah/i.test(f));
  assert(bookContent.length === 0, '14.1 no imported book files are committed to the repository');

  // --- 15. Exports omit book content ------------------------------------
  const exportSrc = readFileSync(new URL('../storage/IndexedDBStorageService.ts', import.meta.url), 'utf8');
  assert(/imagesOmitted: true/.test(exportSrc), '15.1 an export marks book content as omitted');
  assert(/importedBooks: importedBooks\.map\(/.test(exportSrc), '15.2 the export maps books to metadata only');
  assert(!/pdfBlob/.test(exportSrc), '15.3 the export never carries the pdf Blob');

  console.log(`\nMY BOOKS SUITE SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  if (failed > 0) process.exit(1);
}

void main();
