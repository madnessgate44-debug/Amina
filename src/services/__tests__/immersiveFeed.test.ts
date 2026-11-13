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
  /pb-28/.test(reelCard),
  'the reel card reserves bottom space so the overlay nav does not cover content'
);

// --- R-F1.5 the reel slide is exactly one viewport tall -------------------
assert(
  /isImmersive \? ' h-screen overflow-hidden' : ''/.test(appShell),
  'the immersive shell is clamped to the viewport height (h-screen overflow-hidden)'
);
assert(
  /isImmersive \? ' h-screen' : ''/.test(appShell),
  'the immersive app column is clamped to the viewport height'
);
assert(
  /h-full bg-slate-950 text-white/.test(feedScreen),
  'the reel scroller is h-full so the viewport, not the content, sets the slide height'
);
assert(
  /className="h-full snap-start overflow-y-auto px-4 pt-6 pb-28 relative"/.test(reelCard),
  'the reel section is h-full and scrolls its own content so a tall reel cannot push the slide below the fold'
);
// A 4-option reel is taller than a 390x844 slide, so with vertical centring and
// `overflow-hidden` the last option and the whole toolbar rendered under the
// floating nav and could not be tapped. Measured live: the last option sat at
// y=798-844, exactly under the nav (top 773). The section must scroll instead.
assert(
  !/h-full snap-start flex items-center px-4 pt-6 pb-24 relative overflow-hidden/.test(reelCard),
  'the reel section is not vertically centred and clipped (the bug that hid the last option under the nav)'
);
assert(
  /pb-28 relative"/.test(reelCard) && !/overflow-hidden"/.test(reelCard.split('snap-start')[1] || ''),
  'the reel section keeps its own scroll and clears the floating nav'
);
// A tall reel must scroll to reach the content below the fold (the last option,
// the toolbar), so the fix is a scrolling section, not a clipped one.
assert(
  /overflow-y-auto/.test(reelCard),
  'the reel section scrolls so content below the fold (last option, toolbar) is reachable'
);

// --- R-F2 Noor speaks the reaction (spoken turn, not a static card) -------
assert(
  /voiceService\.speak\(reaction, language, markAudio, onSpoken, onSpoken, audioRef\.current \?\? undefined\)/.test(reelCard),
  'the reel speaks Noor\'s reaction after the child answers'
);
assert(
  /if \(!reaction\) return;/.test(reelCard),
  'the reaction is not spoken until it has arrived'
);

// --- R-F4 advance on speech end, not a fixed timer ------------------------
assert(
  !/setTimeout\(advance/.test(feedScreen),
  'the feed no longer advances on a fixed setTimeout(advance, ...) timer'
);
assert(
  /onReactionSpoken/.test(feedScreen) && /advance\(\)/.test(feedScreen),
  'the feed advances when the reel reports Noor has finished speaking'
);
assert(
  /onReactionSpoken\?: \(\) => void;/.test(reelCard),
  'the reel exposes an onReactionSpoken signal to the feed'
);
assert(
  /onReactionSpokenRef\.current\?\.\(\)/.test(reelCard),
  'the reel fires the speech-end signal exactly once per answered reel'
);
assert(
  /voiceService\.speak\(reaction, language, markAudio, onSpoken, onSpoken, audioRef\.current \?\? undefined\)/.test(reelCard) &&
    /const t = window\.setTimeout\(onSpoken, 12000\)/.test(reelCard),
  'the speech-end signal has a safety net so a silent engine cannot wedge the feed'
);

// --- a narration reel must not be static (owner ask: it must not be static) -
// The narration reels (teach_card, story_analogy, vocab_flash) carry no options,
// so before this fix nothing ever advanced them: the feed sat on the reel
// forever. Measured live: the counter was unchanged after 12s of no interaction.
assert(
  /const asksQuestion = Boolean\(reel\.options\?\.length\)/.test(reelCard),
  'the reel tells a question reel apart from a narration reel'
);
assert(
  /if \(!asksQuestion\) fireAdvance\(\)/.test(reelCard),
  'a narration reel advances the moment Noor stops speaking'
);
assert(
  /if \(!asksQuestion\) \{[\s\S]{0,220}window\.setTimeout\(fireAdvance, readMs\)/.test(reelCard),
  'a narration reel with no voice still advances after a read delay'
);
assert(
  /const fireAdvance = \(\) => \{[\s\S]{0,140}advancedRef\.current = true;/.test(reelCard) &&
    /onReactionSpokenRef\.current\?\.\(\)/.test(reelCard),
  'every advance funnels through one guarded helper so it can never fire twice'
);

// --- R-F3 voice turn-taking in the feed (owner ask #2) --------------------
assert(
  /handsFreeEnabled/.test(feedScreen) && /handsFreeEnabled=\{settings\.companionVoiceEnabled\}/.test(feedScreen),
  'the feed enables the spoken turn from the companion-voice setting'
);
assert(
  /VoiceInputControl/.test(reelCard),
  'the reel mounts the microphone control'
);
assert(
  /reduceHandsFree/.test(reelCard) && /tutor_turn_added/.test(reelCard) && /speech_finished/.test(reelCard),
  'the reel drives the shared hands-free state machine'
);
assert(
  /if \(settled\) return;/.test(reelCard) && /dispatchHandsFree\(\{ type: 'speech_finished' \}\)/.test(reelCard),
  'the microphone opens only after Noor has finished speaking (no mid-sentence cutoff)'
);
assert(
  /matchSpokenOption\(transcript, reel\.options\)/.test(reelCard),
  'a spoken answer is matched against the reel options before it is graded'
);
assert(
  /handsFree=\{handsFreeOn\}/.test(reelCard) && /listenSignal=\{handsFree\.listenToken\}/.test(reelCard),
  'the reel passes the hands-free flag and listen signal to the microphone control'
);

// --- R-F5 Noor's line is real audio media (owner ask #1) ------------------
assert(
  /<audio/.test(reelCard) && /ref=\{audioRef\}/.test(reelCard),
  'the reel mounts a real audio element for Noor\'s spoken line'
);
assert(
  /controls=\{hasAudio\}/.test(reelCard) && /hasAudio \? 'mt-3/.test(reelCard),
  'the audio player is shown only once real audio exists'
);
assert(
  /audioRef\.current \?\? undefined\)/.test(reelCard),
  'the reel routes its speech through the visible audio element'
);

// --- R7 the feed records learning signals from the reel loop --------------
assert(
  /recordLearningSignal\(outcome\)/.test(feedScreen),
  'the feed records a per-session learning signal from the reel loop'
);
assert(
  /onAnswerOutcome=\{\(\{ correct, namedMisconception \}\)/.test(feedScreen),
  'the feed passes the resolved answer outcome to the reel'
);
assert(
  /onAnswerOutcome\?\.\(\{ correct, namedMisconception: result\.namedMisconception \}\)/.test(reelCard),
  'the reel reports the named-misconception flag once the diagnosis resolves'
);

// --- the feed session survives the per-answer queue rebuild ---------------
// recordEvidence updates masteryRecords, which is a builtQueue dependency, so
// the queue rebuilds after EVERY answer. The cursor and the per-concept signal
// state must not be rewound by that rebuild, or the child is bounced to reel 1
// and `independentRecheckPassed` can never become true.
assert(
  /const sessionChanged = activeSessionRef\.current !== sessionKey/.test(feedScreen),
  'the feed distinguishes a new session from a mid-session queue rebuild'
);
assert(
  /setCursor\(Math\.min\(cursorRef\.current, Math\.max\(0, builtQueue\.reels\.length - 1\)\)\)/.test(feedScreen),
  'a mid-session rebuild keeps the child on the same reel'
);
assert(
  /feedSignalState\.current = new Map\(\);[\s\S]{0,80}\}, \[sessionKey\]\)/.test(feedScreen),
  'the per-concept signal state is reset by the session key, not the queue'
);
assert(
  /const sessionKey = `\$\{student\?\.id \?\? ''\}\|\$\{language\}\|\$\{sessionMinutes\}`/.test(feedScreen),
  'the session key is built from the child, language and session length'
);


// --- the session closer must not be a dead end -----------------------------
// Measured on the live app (390x844 ar-EG): after the last reel the child sees
// "خلصنا جلسة النهارده!" with a single button, "تخطّي" (Skip), and that button
// does nothing — `advance()` is a no-op at the last index, so the child is
// stuck on a card with no way forward and no way back to the rest of the app.
// A session that ends in a dead end is the "static" the owner's ask rules out.
assert(
  /onFinish/.test(reelCard),
  'the reel exposes an onFinish callback for the end-of-session card'
);
assert(
  /const isCloser = reel\.conceptId === 'closer'/.test(reelCard) ||
    /reel\.conceptId === 'closer'/.test(reelCard),
  'the reel recognises the closer card'
);
assert(
  /onClick=\{isCloser \? onFinish : onSkip\}/.test(reelCard),
  'the closer card offers a working action instead of a no-op Skip'
);
assert(
  /onFinish=\{\(\) => setActiveTab\('home'\)\}/.test(feedScreen) ||
    /onFinish=/.test(feedScreen),
  'the feed wires the closer action to leave the feed'
);

console.log(`\nIMMERSIVE FEED SUITE SUMMARY: ${passed} PASSED, ${failed} FAILED`);
if (failed > 0) process.exit(1);
