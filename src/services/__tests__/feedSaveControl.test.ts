/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Regression guard: the reel rewrite must not drop the save/like control.
 *
 * Phase 3 replaced FeedScreen with the reel engine and silently removed the
 * SaveLikeButton that the old FeedScreen rendered. The learner-flow browser
 * probe caught it as "T6 save/reopen :: no save control on FEED" in all four
 * viewports. This suite fails fast on a source-level regression.
 */

import { readFileSync } from 'node:fs';
import assert from 'node:assert';

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

const reelCard = readFileSync(new URL('../../components/feed/ReelCard.tsx', import.meta.url), 'utf8');
const feedScreen = readFileSync(new URL('../../components/feed/FeedScreen.tsx', import.meta.url), 'utf8');

test('1.1 ReelCard renders the shared SaveLikeButton', () => {
  assert.ok(reelCard.includes("from '../collections/SaveLikeButton'"), 'SaveLikeButton not imported');
  assert.ok(reelCard.includes('<SaveLikeButton'), 'SaveLikeButton not rendered');
});

test('1.2 reels are saved with the reel savable type', () => {
  assert.ok(/type="reel"/.test(reelCard), 'type="reel" missing');
  assert.ok(/sourceId=\{reel\.id\}/.test(reelCard), 'sourceId not bound to the reel id');
});

test('1.3 the savable type is one the collection model accepts', () => {
  const collections = readFileSync(new URL('../../types/collections.ts', import.meta.url), 'utf8');
  const match = collections.match(/export type SavableType = ([^;]+);/);
  assert.ok(match, 'SavableType not found');
  assert.ok(/'reel'/.test(match![1]), `'reel' is not a SavableType: ${match![1]}`);
});

test('1.4 FeedScreen still delegates each card to ReelCard', () => {
  assert.ok(feedScreen.includes('<ReelCard'), 'FeedScreen no longer renders ReelCard');
});

test('1.5 the feed does not render a bare bookmark icon it cannot wire up', () => {
  // A raw Bookmark icon in the feed would look saved-capable but do nothing.
  assert.ok(!/\bBookmark\b/.test(feedScreen), 'FeedScreen imports/renders Bookmark directly instead of SaveLikeButton');
});

console.log(`\nFEED SAVE-CONTROL SUITE SUMMARY: ${passed} PASSED, ${process.exitCode ? '1+' : 0} FAILED`);
if (process.exitCode) process.exit(1);
