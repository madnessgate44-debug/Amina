/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Tests for the upload size limits required by the hosted (Vercel) deployment.
 *
 * The host rejects request bodies over about 4.5 MB before they reach the app,
 * so the client must shrink images and cap recordings. These tests exercise the
 * real sizing functions, not mocks.
 */

import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import {
  base64ByteLength,
  fitWithinBox,
  requestBodyBytes,
  isBodyTooLarge,
  isPayloadTooLargeStatus,
  payloadTooLargeMessage,
  MAX_REQUEST_BYTES,
  MAX_IMAGE_DIMENSION,
  MAX_AUDIO_MS,
} from '../upload/payloadLimits';

let passed = 0;
const test = (name: string, fn: () => void) => {
  try {
    fn();
    passed++;
    console.log(`✅ [PASS] ${name}`);
  } catch (e: any) {
    console.error(`❌ [FAIL] ${name}: ${e.message}`);
    process.exitCode = 1;
  }
};

test('1.1 base64 size matches the decoded byte count', () => {
  // "hello" is 5 bytes -> "aGVsbG8="
  assert.strictEqual(base64ByteLength('aGVsbG8='), 5);
  assert.strictEqual(base64ByteLength('data:image/jpeg;base64,aGVsbG8='), 5);
  assert.strictEqual(base64ByteLength(''), 0);
});

test('1.2 a 4 MB base64 image is reported as too large', () => {
  const big = 'A'.repeat(6 * 1024 * 1024); // ~4.5 MB decoded
  assert.strictEqual(isBodyTooLarge({ imageBase64: big }), true);
});

test('1.3 a small body is accepted', () => {
  assert.strictEqual(isBodyTooLarge({ imageBase64: 'aGVsbG8=' }), false);
});

test('1.4 the safe ceiling stays under the ~4.5 MB platform limit', () => {
  assert.ok(MAX_REQUEST_BYTES < 4.5 * 1024 * 1024, 'safe ceiling is not below the platform limit');
});

test('2.1 an oversized phone photo is scaled to the max dimension', () => {
  const { width, height } = fitWithinBox(4000, 3000);
  assert.strictEqual(Math.max(width, height), MAX_IMAGE_DIMENSION);
  // aspect ratio preserved (4:3)
  assert.ok(Math.abs(width / height - 4000 / 3000) < 0.01, 'aspect ratio changed');
});

test('2.2 a small image is never enlarged', () => {
  assert.deepStrictEqual(fitWithinBox(800, 600), { width: 800, height: 600 });
});

test('2.3 a portrait image is capped on its long edge too', () => {
  const { width, height } = fitWithinBox(1200, 5000);
  assert.strictEqual(height, MAX_IMAGE_DIMENSION);
  assert.ok(width < height);
});

test('2.4 degenerate dimensions do not throw', () => {
  assert.deepStrictEqual(fitWithinBox(0, 0), { width: 0, height: 0 });
});

test('3.1 a 413 status is recognised', () => {
  assert.strictEqual(isPayloadTooLargeStatus(413), true);
  assert.strictEqual(isPayloadTooLargeStatus(200), false);
});

test('3.2 the too-large message is friendly and in the right language', () => {
  const ar = payloadTooLargeMessage('ar');
  const en = payloadTooLargeMessage('en');
  const fr = payloadTooLargeMessage('fr');
  for (const msg of [ar, en, fr]) {
    assert.ok(msg.length > 10, 'message is too short to be helpful');
    assert.ok(!/413|error|exception/i.test(msg), `message leaks a raw error: ${msg}`);
  }
  assert.ok(/[\u0600-\u06FF]/.test(ar), 'Arabic message is not in Arabic');
  assert.ok(!/[\u0600-\u06FF]/.test(en), 'English message contains Arabic');
  assert.ok(!/[\u0600-\u06FF]/.test(fr), 'French message contains Arabic');
});

test('3.3 the audio cap is 30 seconds', () => {
  assert.strictEqual(MAX_AUDIO_MS, 30_000);
});

test('4.1 the server body limit is at or below the safe ceiling', () => {
  const server = readFileSync(new URL('../../../server.ts', import.meta.url), 'utf8');
  const match = server.match(/express\.json\(\{\s*limit:\s*'(\d+)mb'\s*\}\)/);
  assert.ok(match, 'could not find the express.json limit');
  const mb = Number(match![1]);
  assert.ok(mb <= 4, `server allows ${mb}mb, above the safe 4mb ceiling`);
});

test('4.2 the server only listens when not on Vercel', () => {
  const server = readFileSync(new URL('../../../server.ts', import.meta.url), 'utf8');
  assert.ok(server.includes('process.env.VERCEL'), 'server does not check for Vercel');
  assert.ok(server.includes('export default app'), 'server does not export the app');
});

test('4.3 the Vercel function entry re-exports the app', () => {
  const entry = readFileSync(new URL('../../../api/index.ts', import.meta.url), 'utf8');
  // The .js extension is required: Vercel runs the emitted file as ESM, where an
  // extensionless specifier throws ERR_MODULE_NOT_FOUND. See vercelEntryResolution.
  assert.ok(entry.includes("from '../server.js'"), 'api/index.ts does not import server.ts');
  assert.ok(entry.includes('export default app'), 'api/index.ts does not export the app');
});

test('4.4 the three upload paths shrink their payload', () => {
  const homework = readFileSync(
    new URL('../../components/missions/HomeworkRunner.tsx', import.meta.url),
    'utf8'
  );
  const study = readFileSync(new URL('../myBooks/studyPageService.ts', import.meta.url), 'utf8');
  assert.ok(homework.includes('shrinkImageDataUrl('), 'homework upload does not shrink the photo');
  assert.ok(study.includes('shrinkImageDataUrl('), 'study-page upload does not shrink the page');
});

console.log(`\nPAYLOAD LIMITS SUITE SUMMARY: ${passed} PASSED, ${process.exitCode ? '1+' : 0} FAILED`);
if (process.exitCode) process.exit(1);
