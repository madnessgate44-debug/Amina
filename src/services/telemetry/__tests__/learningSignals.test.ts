/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Learning telemetry: the three signals that say whether the teaching landed.
 * A tiny in-memory localStorage stands in for the browser so the real code runs
 * (no mocks of the module under test).
 */

class MemoryStorage {
  private map = new Map<string, string>();
  getItem(k: string) { return this.map.has(k) ? this.map.get(k)! : null; }
  setItem(k: string, v: string) { this.map.set(k, v); }
  removeItem(k: string) { this.map.delete(k); }
  clear() { this.map.clear(); }
}
(globalThis as any).localStorage = new MemoryStorage();

import {
  recordLearningSignal,
  getLearningSignals,
  summarizeLearningSignals,
  clearLearningSignals,
} from '../learningSignals';

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

clearLearningSignals();

// 1. Recording and reading back.
{
  recordLearningSignal({ conceptId: 'c1', nextQuestionCorrect: true, misconceptionResolved: false, independentRecheckPassed: true });
  recordLearningSignal({ conceptId: 'c1', nextQuestionCorrect: false, misconceptionResolved: true, independentRecheckPassed: false });
  recordLearningSignal({ conceptId: 'c2', nextQuestionCorrect: true, misconceptionResolved: true, independentRecheckPassed: true });

  const all = getLearningSignals();
  check('1.1 all signals are stored', all.length === 3);
  check('1.2 a timestamp is stamped', Boolean(all[0].recordedAt));
  check('1.3 filtering by concept works', getLearningSignals('c1').length === 2);
}

// 2. Summaries compute real rates.
{
  const summary = summarizeLearningSignals('c1');
  check('2.1 one row per concept', summary.length === 1);
  check('2.2 next-question rate is 1/2', Math.abs(summary[0].nextQuestionCorrectRate - 0.5) < 1e-9);
  check('2.3 misconception resolution rate is 1/2', Math.abs(summary[0].misconceptionResolutionRate - 0.5) < 1e-9);
  check('2.4 independent recheck rate is 1/2', Math.abs(summary[0].independentRecheckRate - 0.5) < 1e-9);

  const all = summarizeLearningSignals();
  check('2.5 both concepts summarised', all.length === 2);
}

// 3. An empty store summarises to nothing, not a crash.
{
  clearLearningSignals();
  check('3.1 cleared store is empty', getLearningSignals().length === 0);
  check('3.2 empty summary is safe', summarizeLearningSignals().length === 0);
}

console.log(`\nLEARNING SIGNALS SUITE SUMMARY: ${passed} PASSED, ${failed} FAILED`);
if (failed > 0) process.exit(1);
