/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * R7: per-session learning signals from the FEED reel loop.
 *
 * The reducer is the real code the feed runs; this exercises it directly, plus
 * a source scan that the feed actually calls `recordLearningSignal` from the
 * reel loop (not only from the teaching modal).
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import {
  initialFeedConceptState,
  reduceFeedSignal,
} from '../feedLearningSignals';

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

// 1. A first correct answer on a concept.
{
  const { state, outcome } = reduceFeedSignal(undefined, {
    conceptId: 'c1',
    correct: true,
    namedMisconception: false,
  });
  check('1.1 next-question correct is recorded', outcome.nextQuestionCorrect === true);
  check('1.2 a first answer is not an independent recheck', outcome.independentRecheckPassed === false);
  check('1.3 no misconception was pending', outcome.misconceptionResolved === false);
  check('1.4 the concept id is carried through', outcome.conceptId === 'c1');
  check('1.5 the seen counter advances', state.seen === 1);
}

// 2. Wrong answer, then a correct answer that clears the named misconception.
{
  const first = reduceFeedSignal(undefined, {
    conceptId: 'c2',
    correct: false,
    namedMisconception: true,
  });
  check('2.1 a wrong answer is not correct', first.outcome.nextQuestionCorrect === false);
  check('2.2 the named misconception is remembered', first.state.lastNamedMisconception === true);
  check('2.3 a wrong answer is not a recheck pass', first.outcome.independentRecheckPassed === false);

  const second = reduceFeedSignal(first.state, {
    conceptId: 'c2',
    correct: true,
    namedMisconception: false,
  });
  check('2.4 the cleared misconception is recorded', second.outcome.misconceptionResolved === true);
  check('2.5 the follow-up correct answer is a recheck pass', second.outcome.independentRecheckPassed === true);
  check('2.6 the pending flag is cleared after a correct answer', second.state.lastNamedMisconception === false);
}

// 3. A correct answer after a plain wrong one resolves nothing (no misconception).
{
  const first = reduceFeedSignal(undefined, {
    conceptId: 'c3',
    correct: false,
    namedMisconception: false,
  });
  const second = reduceFeedSignal(first.state, {
    conceptId: 'c3',
    correct: true,
    namedMisconception: false,
  });
  check('3.1 a plain wrong answer is not a misconception', second.outcome.misconceptionResolved === false);
  check('3.2 a later correct answer is still an independent recheck', second.outcome.independentRecheckPassed === true);
}

// 4. Repeated answers keep counting, and a later wrong answer resets the pass.
{
  let state = initialFeedConceptState;
  let last = reduceFeedSignal(state, { conceptId: 'c4', correct: true, namedMisconception: false });
  state = last.state;
  last = reduceFeedSignal(state, { conceptId: 'c4', correct: true, namedMisconception: false });
  state = last.state;
  check('4.1 the seen counter accumulates', state.seen === 2);
  check('4.2 a second correct answer is a recheck pass', last.outcome.independentRecheckPassed === true);

  const wrong = reduceFeedSignal(state, { conceptId: 'c4', correct: false, namedMisconception: false });
  check('4.3 a wrong answer is not a pass', wrong.outcome.independentRecheckPassed === false);
  check('4.4 a wrong answer records next-question false', wrong.outcome.nextQuestionCorrect === false);
}

// 5. The feed actually wires the signal (source scan).
{
  const feedScreen = readFileSync(join(process.cwd(), 'src/components/feed/FeedScreen.tsx'), 'utf8');
  const reelCard = readFileSync(join(process.cwd(), 'src/components/feed/ReelCard.tsx'), 'utf8');
  check(
    '5.1 the feed imports recordLearningSignal',
    /import \{ recordLearningSignal \} from '\.\.\/\.\.\/services\/telemetry\/learningSignals'/.test(feedScreen)
  );
  check(
    '5.2 the feed records a signal from the reel loop',
    /handleReelOutcome[\s\S]{0,400}recordLearningSignal\(outcome\)/.test(feedScreen)
  );
  check(
    '5.3 the feed passes the outcome callback to the reel',
    /onAnswerOutcome=\{\(\{ correct, namedMisconception \}\)/.test(feedScreen)
  );
  check(
    '5.4 the reel fires the outcome after the diagnosis resolves',
    /onAnswerOutcome\?\.\(\{ correct, namedMisconception: result\.namedMisconception \}\)/.test(reelCard)
  );
  check(
    '5.5 the reel fires the outcome on the failure path too',
    /onAnswerOutcome\?\.\(\{ correct, namedMisconception: false \}\)/.test(reelCard)
  );
}

console.log(`\nFEED LEARNING SIGNALS SUITE SUMMARY: ${passed} PASSED, ${failed} FAILED`);
if (failed > 0) process.exit(1);
