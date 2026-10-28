/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Learning telemetry — the three signals that tell us whether the teaching
 * actually landed, as opposed to whether the API was fast. The cost/latency
 * service answers "was it cheap"; this answers "did the child learn".
 *
 * Pure and dependency-free so it can be tested without a browser.
 */

export interface LearningSignal {
  conceptId: string;
  /** Did the very next question on this concept come out right? */
  nextQuestionCorrect: boolean;
  /** Did a named misconception get cleared after it was explained? */
  misconceptionResolved: boolean;
  /** Did the child re-explain the concept unaided on a later check? */
  independentRecheckPassed: boolean;
  recordedAt: string;
}

export interface LearningSignalSummary {
  conceptId: string;
  samples: number;
  nextQuestionCorrectRate: number;
  misconceptionResolutionRate: number;
  independentRecheckRate: number;
}

const STORAGE_KEY = 'ais_learning_signals_v1';
const MAX_SIGNALS = 500;

function readStore(): LearningSignal[] {
  try {
    if (typeof localStorage === 'undefined') return [];
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as LearningSignal[]) : [];
  } catch {
    return [];
  }
}

function writeStore(signals: LearningSignal[]): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(signals.slice(-MAX_SIGNALS)));
  } catch {
    /* storage full or unavailable: telemetry must never break a lesson */
  }
}

export function recordLearningSignal(
  signal: Omit<LearningSignal, 'recordedAt'> & { recordedAt?: string }
): LearningSignal {
  const full: LearningSignal = { ...signal, recordedAt: signal.recordedAt || new Date().toISOString() };
  const all = readStore();
  all.push(full);
  writeStore(all);
  return full;
}

export function getLearningSignals(conceptId?: string): LearningSignal[] {
  const all = readStore();
  return conceptId ? all.filter((s) => s.conceptId === conceptId) : all;
}

export function summarizeLearningSignals(conceptId?: string): LearningSignalSummary[] {
  const all = getLearningSignals(conceptId);
  const byConcept = new Map<string, LearningSignal[]>();
  for (const s of all) {
    const list = byConcept.get(s.conceptId) || [];
    list.push(s);
    byConcept.set(s.conceptId, list);
  }

  const rate = (list: LearningSignal[], pick: (s: LearningSignal) => boolean) =>
    list.length === 0 ? 0 : list.filter(pick).length / list.length;

  return [...byConcept.entries()].map(([id, list]) => ({
    conceptId: id,
    samples: list.length,
    nextQuestionCorrectRate: rate(list, (s) => s.nextQuestionCorrect),
    misconceptionResolutionRate: rate(list, (s) => s.misconceptionResolved),
    independentRecheckRate: rate(list, (s) => s.independentRecheckPassed),
  }));
}

export function clearLearningSignals(): void {
  writeStore([]);
}
