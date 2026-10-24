/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Student profile migrations.
 *
 * Stored student data must keep working across releases. Every read path goes
 * through `migrateStudent`, which fills new fields with safe defaults without
 * ever overwriting a value the student already has.
 */

import { Student, AddressForm, OnboardingPreferences, LearningStylePreference, SessionLengthMinutes } from '../../types';

export const CURRENT_STUDENT_SCHEMA_VERSION = 2;

const VALID_SESSION_LENGTHS: SessionLengthMinutes[] = [5, 10, 20];

/**
 * Migrates a stored (possibly older) student record to the current shape.
 *
 * Guarantees:
 * - Never mutates the input object.
 * - `addressForm` defaults to 'f'. Existing students were onboarded with
 *   feminine Arabic copy, so 'f' preserves the experience they already had.
 * - `onboarding` is only created when the legacy interview answers give us
 *   something real to carry over. Otherwise it stays undefined: an empty
 *   profile must not look like a deliberate "no subjects" answer.
 */
export function migrateStudent(raw: Student): Student {
  if (!raw || typeof raw !== 'object') return raw;

  const migrated: Student = { ...raw };

  if (migrated.addressForm !== 'f' && migrated.addressForm !== 'm') {
    migrated.addressForm = 'f';
  }

  if (!migrated.onboarding) {
    const carried = carryOverLegacyAnswers(raw);
    if (carried) migrated.onboarding = carried;
  } else {
    migrated.onboarding = normalizeOnboarding(migrated.onboarding);
  }

  return migrated;
}

/**
 * Maps the pre-Noor interview answers onto the new preference shape.
 *
 * `learningStyle` and `sessionDuration` were single-value strings; the new
 * shape uses arrays and a numeric minute choice. We only carry over values we
 * can interpret, and return undefined when there is nothing usable, so we
 * never fabricate a preference the child did not express.
 */
export function carryOverLegacyAnswers(raw: Student): OnboardingPreferences | undefined {
  const answers = raw?.interviewAnswers;
  if (!answers) return undefined;

  const learningStyles: LearningStylePreference[] = [];
  if (answers.learningStyle) learningStyles.push(answers.learningStyle);

  const sessionLengthMinutes = parseLegacySessionDuration(answers.sessionDuration);

  const prefs: OnboardingPreferences = {};
  if (learningStyles.length) prefs.learningStyles = learningStyles;
  if (sessionLengthMinutes) prefs.sessionLengthMinutes = sessionLengthMinutes;

  return Object.keys(prefs).length ? prefs : undefined;
}

/**
 * Maps a legacy session-duration string onto one of the offered chips.
 *
 * The old flow offered "10min" and "30min"; the new one offers 5/10/20. We map
 * to the NEAREST chip so a child who asked for "longer sessions" (30min) still
 * gets the longest option (20) instead of losing that answer. Values outside a
 * plausible range are dropped rather than rounded into a number the child
 * never chose.
 */
export function parseLegacySessionDuration(
  value: string | undefined
): SessionLengthMinutes | undefined {
  if (!value) return undefined;
  const match = /(\d+)/.exec(String(value));
  if (!match) return undefined;
  const minutes = Number(match[1]);
  if (minutes < 1 || minutes > 60) return undefined;

  // Nearest chip by absolute distance; on a tie prefer the longer option,
  // because the legacy longer chip expressed a preference for longer sessions.
  let best: SessionLengthMinutes = VALID_SESSION_LENGTHS[0];
  for (const candidate of VALID_SESSION_LENGTHS) {
    const bestDist = Math.abs(minutes - best);
    const candDist = Math.abs(minutes - candidate);
    if (candDist < bestDist || (candDist === bestDist && candidate > best)) {
      best = candidate;
    }
  }
  return best;
}

export function normalizeOnboarding(prefs: OnboardingPreferences): OnboardingPreferences {
  const out: OnboardingPreferences = {};
  if (Array.isArray(prefs.likedSubjects) && prefs.likedSubjects.length) {
    out.likedSubjects = [...new Set(prefs.likedSubjects.filter((s) => typeof s === 'string' && s))];
  }
  if (Array.isArray(prefs.learningStyles) && prefs.learningStyles.length) {
    out.learningStyles = [...new Set(prefs.learningStyles.filter((s) => typeof s === 'string' && s))];
  }
  if (prefs.sessionLengthMinutes && VALID_SESSION_LENGTHS.includes(prefs.sessionLengthMinutes)) {
    out.sessionLengthMinutes = prefs.sessionLengthMinutes;
  }
  return out;
}

export function migrateStudents(list: Student[]): Student[] {
  return (list || []).map(migrateStudent);
}
