/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * The Stage / feed voice: starting a new utterance must fully supersede the
 * previous one. The original defect was that a speak() call awaiting /api/tts
 * would still start its own <audio> element after a newer speak() had begun,
 * so two voices played at once and neither stopped on cancel.
 *
 * These tests drive the real voiceService against a minimal fake DOM. Only the
 * browser APIs the service talks to are stubbed (Audio, fetch, speechSynthesis);
 * the sequencing logic under test is the shipped code.
 */

import assert from 'node:assert';
import { voiceService } from '../voice/voiceService';

let passed = 0;
const test = (name: string, fn: () => Promise<void> | void) => {
  return Promise.resolve()
    .then(fn)
    .then(() => {
      passed++;
      console.log(`✅ [PASS] ${name}`);
    })
    .catch((e: any) => {
      console.error(`❌ [FAIL] ${name}: ${e.message}`);
      process.exitCode = 1;
    });
};

/** Let queued microtasks (promise continuations) drain. */
const flush = async (rounds = 8) => {
  for (let i = 0; i < rounds; i++) {
    await Promise.resolve();
  }
};

// ---------------------------------------------------------------------------
// Minimal browser environment
// ---------------------------------------------------------------------------

interface FakeAudio {
  src: string;
  played: number;
  paused: boolean;
  currentTime: number;
  onplay: (() => void) | null;
  onended: (() => void) | null;
  onerror: ((e: any) => void) | null;
  play: () => Promise<void>;
  pause: () => void;
}

const createdAudios: FakeAudio[] = [];
let speechSynthesisCancelCount = 0;

// unlockAudio() primes the browser with a silent 1-sample WAV; that element is
// not narration and must not be counted as a voice.
const UNLOCK_SRC_FRAGMENT = 'UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
const playbackAudios = () => createdAudios.filter((a) => !a.src.includes(UNLOCK_SRC_FRAGMENT));

function installFakeDom() {
  createdAudios.length = 0;
  speechSynthesisCancelCount = 0;

  (globalThis as any).window = globalThis;

  (globalThis as any).Audio = class {
    constructor(public src: string) {
      const el: FakeAudio = {
        src,
        played: 0,
        paused: false,
        currentTime: 0,
        onplay: null,
        onended: null,
        onerror: null,
        play() {
          el.played++;
          el.paused = false;
          // Browsers fire onplay asynchronously.
          return Promise.resolve().then(() => el.onplay?.());
        },
        pause() {
          el.paused = true;
        },
      };
      createdAudios.push(el);
      return el as any;
    }
  } as any;

  (globalThis as any).speechSynthesis = {
    getVoices: () => [],
    cancel: () => {
      speechSynthesisCancelCount++;
    },
    resume: () => {},
    speak: () => {},
  };
}

/** Deferred fetch so a test can control when the TTS response lands. */
function makeDeferredFetch() {
  const pending: Array<(v: any) => void> = [];
  (globalThis as any).fetch = (_url: string, _init?: any) => {
    return new Promise((resolve) => {
      pending.push((body: any) =>
        resolve({
          ok: true,
          status: 200,
          json: async () => ({ audioBase64: body }),
        })
      );
    });
  };
  return {
    resolveNext: (audioBase64: string) => pending.shift()?.(audioBase64),
    count: () => pending.length,
  };
}

// ---------------------------------------------------------------------------

async function run() {
  await test('1.1 a single speak() plays exactly one audio element', async () => {
    installFakeDom();
    const deferred = makeDeferredFetch();

    voiceService.cancelSpeech();
    void voiceService.speak('hello', 'en');
    deferred.resolveNext('AAAA');
    await flush();

    assert.strictEqual(playbackAudios().length, 1, 'expected exactly one narration audio element');
    assert.strictEqual(playbackAudios()[0].played, 1, 'expected one play() call');
  });

  await test('1.2 a superseded speak() does NOT start a second audio element', async () => {
    installFakeDom();
    const deferred = makeDeferredFetch();

    voiceService.cancelSpeech();

    // First call is in flight, awaiting /api/tts.
    void voiceService.speak('first line', 'en');
    assert.strictEqual(deferred.count(), 1, 'first fetch should be pending');

    // User taps play again before the first response lands.
    void voiceService.speak('second line', 'en');
    assert.strictEqual(deferred.count(), 2, 'second fetch should be pending');

    // The stale response arrives AFTER the newer call started.
    deferred.resolveNext('OLD');
    deferred.resolveNext('NEW');
    await flush();

    assert.strictEqual(
      playbackAudios().length,
      1,
      `only the newest utterance may create audio; got ${playbackAudios().length} (the duplicate-voice bug)`
    );
  });

  await test('1.3 cancelSpeech() stops playback and settles the pending promise', async () => {
    installFakeDom();
    const deferred = makeDeferredFetch();

    voiceService.cancelSpeech();
    let ended = false;
    void voiceService.speak('long narration', 'ar', undefined, () => {
      ended = true;
    });
    deferred.resolveNext('AAAA');
    await flush();

    assert.strictEqual(playbackAudios().length, 1, 'audio should have started');
    const el = playbackAudios()[0];
    assert.strictEqual(el.paused, false, 'audio should be playing before cancel');

    // Simulate the user hitting close / mute / barge-in.
    voiceService.cancelSpeech();
    assert.ok(el.paused, 'active audio must be paused by cancelSpeech()');
    assert.strictEqual(el.currentTime, 0, 'active audio must be rewound');

    // A later onended from the cancelled element must not resurrect anything.
    const before = playbackAudios().length;
    el.onended?.();
    await flush();
    assert.strictEqual(playbackAudios().length, before, 'no new audio after cancel');
    assert.strictEqual(ended, false, 'cancelled playback should not report a clean end');
  });

  await test('1.4 the stale element cannot fire onended into the new one', async () => {
    installFakeDom();
    const deferred = makeDeferredFetch();

    voiceService.cancelSpeech();
    void voiceService.speak('first', 'en');
    deferred.resolveNext('OLD');
    await flush();
    const staleEl = playbackAudios()[0];

    void voiceService.speak('second', 'en');
    deferred.resolveNext('NEW');
    await flush();

    // The old element finally reports it finished, long after being replaced.
    staleEl.onended?.();
    await flush();

    assert.strictEqual(playbackAudios().length, 2, 'exactly two elements total, no cascade');
    assert.strictEqual(
      playbackAudios()[1].played,
      1,
      'the replacement should have played exactly once'
    );
  });

  await test('1.5 cancelSpeech() cancels the browser speech-synthesis queue', async () => {
    installFakeDom();
    makeDeferredFetch();

    const before = speechSynthesisCancelCount;
    voiceService.cancelSpeech();
    assert.ok(
      speechSynthesisCancelCount > before,
      'speechSynthesis.cancel() must be invoked for the offline fallback path'
    );
  });

  console.log(
    `\nSTAGE VOICE LIFECYCLE SUMMARY: ${passed} PASSED, ${process.exitCode ? '1+' : 0} FAILED`
  );
  if (process.exitCode) process.exit(1);
}

run();
