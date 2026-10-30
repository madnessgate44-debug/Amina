/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Guards the full-screen FEED (owner ask: the reel must feel like
 * Instagram/TikTok, not a card inside an app frame).
 *
 * The audit measured the reel at 84% of the viewport because a 65px header and
 * a 71px bottom nav always consumed space. This suite locks in the fix:
 *   - the app header is not rendered on the feed;
 *   - the reel scroller fills its container instead of subtracting a magic
 *     `8.5rem`;
 *   - the bottom nav still exists on the feed (navigation is preserved) but
 *     floats as an overlay so it does not consume layout height.
 *
 * Source-scanning, like the phoneUiAccessibility suite: no DOM, no network,
 * no build.
 */

import { readFileSync } from 'fs';
import { join } from 'path';

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

const src = (rel: string) => readFileSync(join(process.cwd(), rel), 'utf8');

const appShell = src('src/components/layout/AppShell.tsx');
const bottomNav = src('src/components/layout/BottomNav.tsx');
const feedScreen = src('src/components/feed/FeedScreen.tsx');
const reelCard = src('src/components/feed/ReelCard.tsx');

// --- R-F1.1 the feed is immersive ----------------------------------------
assert(
  /activeTab === 'feed'/.test(appShell) && /isImmersive/.test(appShell),
  'AppShell derives an immersive mode for the feed tab'
);
assert(
  /!showOnboarding && !isImmersive && \(/.test(appShell),
  'the app header is not rendered while the feed is immersive'
);

// --- R-F1.2 the reel fills the viewport ----------------------------------
assert(
  !/calc\(100dvh-8\.5rem\)/.test(feedScreen),
  'the feed scroller no longer subtracts a hard-coded 8.5rem of chrome'
);
assert(
  /className="flex-1 min-h-0 overflow-y-auto snap-y snap-mandatory/.test(feedScreen),
  'the reel scroller is a flex child that fills the remaining height (flex-1 min-h-0)'
);

// --- R-F1.3 the nav is preserved on the feed, as an overlay --------------
assert(
  /<BottomNav overlay=\{isImmersive\} \/>/.test(appShell),
  'AppShell passes overlay mode to the bottom nav on the feed'
);
assert(
  /overlay\?: boolean/.test(bottomNav),
  'BottomNav accepts an overlay prop'
);
assert(
  /fixed bottom-0/.test(bottomNav),
  'the overlay nav floats (fixed) so it consumes no layout height'
);
for (const tab of ['home', 'feed', 'learn', 'companion']) {
  assert(
    bottomNav.includes(`id: '${tab}'`),
    `the locked navigation still contains the "${tab}" tab`
  );
}

// --- R-F1.4 content clears the overlay -----------------------------------
assert(
  /pb-24/.test(reelCard),
  'the reel card reserves bottom space so the overlay nav does not cover content'
);

// --- R-F2 Noor speaks the reaction (spoken turn, not a static card) -------
assert(
  /voiceService\.speak\(reaction, language\)/.test(reelCard),
  'the reel speaks Noor\'s reaction after the child answers'
);
assert(
  /if \(!reaction\) return;/.test(reelCard),
  'the reaction is not spoken until it has arrived'
);

console.log(`\nIMMERSIVE FEED SUITE SUMMARY: ${passed} PASSED, ${failed} FAILED`);
if (failed > 0) process.exit(1);
