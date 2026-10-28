/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Turn-taking for the hands-free teaching loop. The learner must never have to
 * press the microphone between answers, and the tutor must never speak over the
 * learner.
 */

import {
  initialHandsFreeState,
  reduceHandsFree,
  shouldListen,
  shouldSpeak,
  listeningPrompt,
  MAX_FAILED_CAPTURES,
  type HandsFreeState,
} from '../voice/handsFreeLoop';

let passed = 0;
let failed = 0;

const check = (name: string, condition: boolean) => {
  if (condition) {
    passed += 1;
    console.log(`✅ [PASS] ${name}`);
  } else {
    failed += 1;
    console.error(`❌ [FAIL] ${name}`);
  }
};

const run = (...events: Parameters<typeof reduceHandsFree>[1][]): HandsFreeState =>
  events.reduce(reduceHandsFree, initialHandsFreeState(true));

// 1. Off by default: nothing changes until the learner opts in.
{
  const off = initialHandsFreeState(false);
  check('1.1 hands-free is off by default', off.enabled === false && off.phase === 'idle');
  check('1.2 an off loop never opens the microphone', shouldListen(off) === false);
  check('1.3 an off loop never speaks', shouldSpeak(off) === false);
}

// 2. Enabling starts the tutor, and the microphone stays shut while it speaks.
{
  const s = reduceHandsFree(initialHandsFreeState(false), { type: 'toggle', enabled: true });
  check('2.1 enabling hands-free starts the tutor turn', s.phase === 'tutor_speaking');
  check('2.2 the microphone is shut while the tutor speaks', shouldListen(s) === false);
  check('2.3 the tutor may speak', shouldSpeak(s) === true);
}

// 3. The core handover: tutor stops speaking, microphone opens, no press needed.
{
  const s = run({ type: 'tutor_turn_added' }, { type: 'speech_finished' });
  check('3.1 the microphone opens by itself once the tutor stops', s.phase === 'listening');
  check('3.2 listening is now true', shouldListen(s) === true);
  check('3.3 the tutor is silent while the learner answers', shouldSpeak(s) === false);
}

// 4. Answering hands the turn back to the tutor.
{
  const s = run(
    { type: 'tutor_turn_added' },
    { type: 'speech_finished' },
    { type: 'student_answered' },
    { type: 'tutor_turn_added' },
  );
  check('4.1 a new tutor turn makes the tutor speak again', s.phase === 'tutor_speaking');
  check('4.2 the microphone is shut again', shouldListen(s) === false);
}

// 5. A failed utterance must still hand the turn back, or the loop stalls.
{
  const s = run({ type: 'tutor_turn_added' }, { type: 'speech_failed' });
  check('5.1 a failed utterance still opens the microphone', s.phase === 'listening');
}

// 6. Empty transcript keeps listening rather than stalling.
{
  const s = run(
    { type: 'tutor_turn_added' },
    { type: 'speech_finished' },
    { type: 'transcript_empty' },
  );
  check('6.1 an empty transcript keeps the microphone open', s.phase === 'listening');
  check('6.2 the loop is still listening after an empty transcript', shouldListen(s) === true);
}

// 7. Pause stops both sides, and only resume restarts listening.
{
  const paused = run({ type: 'tutor_turn_added' }, { type: 'speech_finished' }, { type: 'pause' });
  check('7.1 pause stops the microphone', shouldListen(paused) === false);
  check('7.2 pause stops the tutor', shouldSpeak(paused) === false);
  const resumed = reduceHandsFree(paused, { type: 'resume' });
  check('7.3 resume returns to listening, not to speaking', resumed.phase === 'listening');
}

// 8. Late callbacks from a superseded utterance must not wedge the loop.
{
  const listening = run({ type: 'tutor_turn_added' }, { type: 'speech_finished' });
  const late = reduceHandsFree(listening, { type: 'speech_finished' });
  check('8.1 a late speech_finished while listening is ignored', late.phase === 'listening');
  const lateAnswer = reduceHandsFree(
    reduceHandsFree(listening, { type: 'student_answered' }),
    { type: 'transcript_empty' },
  );
  check('8.2 a late empty transcript while thinking is ignored', lateAnswer.phase === 'thinking');
}

// 9. Disabling stops everything immediately.
{
  const s = run(
    { type: 'tutor_turn_added' },
    { type: 'speech_finished' },
    { type: 'toggle', enabled: false },
  );
  check('9.1 disabling closes the microphone', shouldListen(s) === false);
  check('9.2 disabling silences the tutor', shouldSpeak(s) === false);
  check('9.3 disabling returns to idle', s.phase === 'idle');
}

// 10. The spoken cue exists in both languages.
{
  check('10.1 there is an Arabic listening prompt', listeningPrompt(true).length > 0);
  check('10.2 there is an English listening prompt', listeningPrompt(false).length > 0);
  check('10.3 the two prompts differ', listeningPrompt(true) !== listeningPrompt(false));
}

// 11. A broken microphone must not spin the loop forever.
{
  let s = run({ type: 'tutor_turn_added' }, { type: 'speech_finished' });
  const tokens: number[] = [];
  for (let i = 0; i < MAX_FAILED_CAPTURES; i++) {
    s = reduceHandsFree(s, { type: 'transcript_empty' });
    tokens.push(s.listenToken);
  }
  check('11.1 each failed capture asks for another listen', tokens.every((t) => t > 0));
  check('11.2 repeated failures keep the microphone open', shouldListen(s) === true);
  s = reduceHandsFree(s, { type: 'transcript_empty' });
  check('11.3 past the limit the loop stops asking', s.phase === 'paused');
  check('11.4 a paused loop opens no microphone', shouldListen(s) === false);
}

// 12. A new tutor turn resets the retry budget.
{
  const s = run(
    { type: 'tutor_turn_added' },
    { type: 'speech_finished' },
    { type: 'transcript_empty' },
    { type: 'transcript_empty' },
    { type: 'tutor_turn_added' },
    { type: 'speech_finished' },
  );
  check('12.1 a new tutor turn clears the failure count', s.failedCaptures === 0);
  check('12.2 the loop is listening again', shouldListen(s) === true);
}

console.log(`\nHANDS-FREE LOOP SUITE SUMMARY: ${passed} PASSED, ${failed} FAILED`);
if (failed > 0) process.exit(1);
