/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Deterministic seeded RNG (mulberry32).
 *
 * The feed must be reproducible for a given (student, day) so the child sees a
 * stable plan and tests can assert exact output. Never use Math.random here.
 */

export interface SeededRng {
  next(): number; // [0, 1)
  int(maxExclusive: number): number; // [0, maxExclusive)
  pick<T>(items: T[]): T | undefined;
  shuffle<T>(items: T[]): T[];
}

/** Hashes a string to a 32-bit unsigned seed. */
export function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function createSeededRng(seed: number | string): SeededRng {
  let state = (typeof seed === 'string' ? hashSeed(seed) : seed >>> 0) || 1;

  const next = (): number => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const int = (maxExclusive: number): number => {
    if (maxExclusive <= 0) return 0;
    return Math.floor(next() * maxExclusive);
  };

  const pick = <T>(items: T[]): T | undefined => {
    if (!items || items.length === 0) return undefined;
    return items[int(items.length)];
  };

  const shuffle = <T>(items: T[]): T[] => {
    const copy = items.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = int(i + 1);
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  return { next, int, pick, shuffle };
}
