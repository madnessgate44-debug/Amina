/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * The AI routes must answer inside Vercel's 60s function limit.
 *
 * A live smoke test against production returned FUNCTION_INVOCATION_TIMEOUT
 * (HTTP 504) from POST /api/tutor-reply: the child got a platform error page
 * instead of a lesson. Root cause is the Gemini SDK's defaults — 5 attempts with
 * exponential backoff up to 60s and no per-request timeout — which outlive the
 * platform budget. DEPLOY.md claimed the AI routes "already use short timeouts",
 * which was not true: server.ts had no timeout or abort logic at all.
 *
 * These tests pin the budget and the wiring that applies it.
 */

import assert from 'node:assert';
import { readFileSync, existsSync } from 'node:fs';
import { AI_HTTP_OPTIONS, AI_MAX_ATTEMPTS, AI_REQUEST_TIMEOUT_MS } from '../ai/requestBudget';

let passed = 0;
let failed = 0;
const test = (name: string, fn: () => void) => {
  try {
    fn();
    passed++;
    console.log(`✅ [PASS] ${name}`);
  } catch (e: any) {
    failed++;
    console.error(`❌ [FAIL] ${name}: ${e.message}`);
  }
};

// Vercel's limit, from vercel.json `functions["api/index.ts"].maxDuration`.
const vercelJson = JSON.parse(readFileSync('vercel.json', 'utf8'));
const VERCEL_LIMIT_MS = vercelJson.functions['api/index.ts'].maxDuration * 1000;

test('1.1 the per-request timeout is positive and under Vercel maxDuration', () => {
  assert.ok(AI_REQUEST_TIMEOUT_MS > 0, 'timeout must be positive');
  assert.ok(
    AI_REQUEST_TIMEOUT_MS < VERCEL_LIMIT_MS,
    `timeout ${AI_REQUEST_TIMEOUT_MS}ms must be under the platform limit ${VERCEL_LIMIT_MS}ms`
  );
});

test('1.2 the timeout leaves room for the fallback to be sent', () => {
  // The route's catch builds a local fallback and responds. That needs time, so
  // the timeout must not consume the whole budget.
  const headroom = VERCEL_LIMIT_MS - AI_REQUEST_TIMEOUT_MS;
  assert.ok(headroom >= 10_000, `only ${headroom}ms of headroom before the platform kills the function`);
});

test('1.3 a single attempt replaces the SDK retry storm', () => {
  assert.strictEqual(AI_MAX_ATTEMPTS, 1, 'attempts must be 1 so a slow call cannot multiply');
  assert.strictEqual(AI_HTTP_OPTIONS.retryOptions.attempts, 1);
});

test('1.4 the budget actually reduces the SDK default, not just restates it', () => {
  // Guard against a future SDK upgrade that lowers its default below ours, which
  // would make this a no-op. Reads the installed constant; skips if unavailable.
  const sdk = 'node_modules/@google/genai/dist/node/index.cjs';
  if (!existsSync(sdk)) {
    console.log('   (skipped: SDK bundle not present)');
    return;
  }
  const m = readFileSync(sdk, 'utf8').match(/DEFAULT_RETRY_ATTEMPTS\s*=\s*(\d+)/);
  assert.ok(m, 'could not read the SDK default attempt count');
  const sdkDefault = Number(m![1]);
  assert.ok(
    AI_MAX_ATTEMPTS < sdkDefault,
    `our ${AI_MAX_ATTEMPTS} attempt(s) must be fewer than the SDK default of ${sdkDefault}`
  );
});

test('1.5 httpOptions carries both the timeout and the attempt cap', () => {
  assert.strictEqual(AI_HTTP_OPTIONS.timeout, AI_REQUEST_TIMEOUT_MS);
  assert.strictEqual(AI_HTTP_OPTIONS.retryOptions.attempts, AI_MAX_ATTEMPTS);
});

test('1.6 server.ts applies the budget to the GoogleGenAI client', () => {
  const server = readFileSync('server.ts', 'utf8');
  assert.ok(
    server.includes('AI_HTTP_OPTIONS'),
    'server.ts must import and spread AI_HTTP_OPTIONS into httpOptions'
  );
  const clientInit = server.slice(server.indexOf('new GoogleGenAI'));
  const httpOptionsBlock = clientInit.slice(0, clientInit.indexOf('})'));
  assert.ok(
    httpOptionsBlock.includes('...AI_HTTP_OPTIONS'),
    'AI_HTTP_OPTIONS must be spread inside the client httpOptions, not merely imported'
  );
});

test('1.7 no AI route bypasses the client by passing its own unbounded httpOptions', () => {
  const server = readFileSync('server.ts', 'utf8');
  const perCallOverrides = server.match(/generateContent\(\{[\s\S]*?httpOptions/g) ?? [];
  assert.strictEqual(
    perCallOverrides.length,
    0,
    'a per-call httpOptions would override the client budget; apply it on the client instead'
  );
});

console.log(`\nAI REQUEST BUDGET SUITE SUMMARY: ${passed} PASSED, ${failed} FAILED`);
if (failed > 0) process.exit(1);
