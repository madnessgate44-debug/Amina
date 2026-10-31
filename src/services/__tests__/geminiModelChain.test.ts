/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Regression guard for the "no real teacher" outage.
 *
 * A single hardcoded model name in eight routes took the whole tutor down: the
 * model returned 429 RESOURCE_EXHAUSTED, every route caught the error and served
 * a canned fallback, and the child heard scripted text instead of teaching.
 * These checks keep the model name in one place and keep a chain in front of it.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import {
  DEFAULT_TEXT_MODELS,
  GEMINI_TTS_MODEL,
  TTS_MODELS,
  PRIMARY_TEXT_MODEL,
  resolveTextModelChain,
  isModelUnavailable,
} from '../ai/geminiModel';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, '..', '..', '..');
const serverSource = readFileSync(join(repoRoot, 'server.ts'), 'utf8');

test('server has no hardcoded default model name', () => {
  assert.ok(
    !serverSource.includes("process.env.GEMINI_MODEL || '"),
    'server.ts must not inline a default model; use generateContentWithFallback'
  );
  assert.ok(
    !/model:\s*'gemini-\d/.test(serverSource.replace(/model: GEMINI_TTS_MODEL,/g, '')),
    'server.ts must not inline a text model literal'
  );
});

test('every Gemini call in server.ts goes through the fallback helper', () => {
  const direct = serverSource.match(/ai\.models\.generateContent\(/g) || [];
  assert.equal(direct.length, 0, 'all Gemini calls must use generateContentWithFallback');
  const viaHelper = serverSource.match(/generateContentWithFallback\(ai,/g) || [];
  assert.ok(viaHelper.length >= 8, `expected the routes to use the helper; found ${viaHelper.length}`);
});

test('the model chain starts with a model verified to answer', () => {
  assert.equal(PRIMARY_TEXT_MODEL, DEFAULT_TEXT_MODELS[0]);
  assert.ok(DEFAULT_TEXT_MODELS.length >= 2, 'a single-model chain reintroduces the outage');
  assert.ok(DEFAULT_TEXT_MODELS.includes('gemini-3.6-flash'));
});

test('GEMINI_MODEL overrides first, then defaults, without duplicates', () => {
  const prev = process.env.GEMINI_MODEL;
  try {
    process.env.GEMINI_MODEL = 'gemini-3.5-flash';
    const chain = resolveTextModelChain();
    assert.equal(chain[0], 'gemini-3.5-flash');
    assert.equal(new Set(chain).size, chain.length, 'chain must not repeat a model');

    delete process.env.GEMINI_MODEL;
    assert.deepEqual(resolveTextModelChain(), [...DEFAULT_TEXT_MODELS]);
  } finally {
    if (prev === undefined) delete process.env.GEMINI_MODEL;
    else process.env.GEMINI_MODEL = prev;
  }
});

test('quota and outage errors fall through; real errors do not', () => {
  assert.equal(isModelUnavailable({ status: 429 }), true);
  assert.equal(isModelUnavailable({ status: 503 }), true);
  assert.equal(isModelUnavailable({ message: 'RESOURCE_EXHAUSTED' }), true);
  assert.equal(isModelUnavailable({ message: 'model not found' }), true);
  assert.equal(isModelUnavailable({ status: 400, message: 'invalid argument' }), false);
  assert.equal(isModelUnavailable({ status: 401, message: 'unauthorized' }), false);
});

test('the TTS model stays a specialised constant', () => {
  assert.ok(serverSource.includes('for (const model of TTS_MODELS)'), 'TTS must walk the shared chain');
  assert.ok(!DEFAULT_TEXT_MODELS.includes(GEMINI_TTS_MODEL as never), 'TTS model is not a text model');
  assert.ok(TTS_MODELS.length >= 2, 'a single TTS model silently drops Miss Noor to browser speech');
  assert.ok(!TTS_MODELS.includes('gemini-3.8-flash-lite-tts' as never), 'the removed, non-existent model must not return');
});

test('the teaching turn is generated, not scripted', () => {
  assert.ok(
    serverSource.includes("app.post('/api/teach-turn'"),
    'the generated teaching-turn endpoint must exist'
  );
  const helper = readFileSync(
    join(repoRoot, 'src', 'services', 'teaching', 'generateTeachingLine.ts'),
    'utf8'
  );
  assert.ok(helper.includes("fetch('/api/teach-turn'"), 'the session must call the teaching endpoint');
  assert.ok(helper.includes('fallbackLine'), 'the engine line must be the fallback');

  const modal = readFileSync(
    join(repoRoot, 'src', 'components', 'teaching', 'TeachingSessionModal.tsx'),
    'utf8'
  );
  assert.ok(
    modal.includes('generateTeachingLine('),
    'the session modal must speak generated lines, not raw engine templates'
  );
});
