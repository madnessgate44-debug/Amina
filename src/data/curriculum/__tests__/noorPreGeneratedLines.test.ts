/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Guards the pre-generated Noor lines.
 *
 * `preGeneratedNoorLines.ts` makes the fixed part of a lesson cost zero quota.
 * That only holds while the file covers every concept in the curriculum. When
 * someone adds a lesson, the data silently falls behind and that lesson drops
 * back to a live call — the exact cost this file exists to remove. This suite
 * fails loudly instead.
 *
 * It also proves the lines are usable as spoken teacher text, so a bad batch
 * (empty strings, placeholder text, wrong language) cannot ship.
 */

import { curriculumService } from '../../../services/curriculum/curriculumService';
import { PRE_GENERATED_NOOR_LINES, getPreGeneratedLine } from '../preGeneratedNoorLines';

let passed = 0;
let failed = 0;

function check(name: string, condition: boolean, detail?: string) {
  if (condition) {
    passed++;
    console.log(`  ✅ [PASS] ${name}`);
  } else {
    failed++;
    console.log(`  ❌ [FAIL] ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

function main() {
  console.log('\n=== PRE-GENERATED NOOR LINES SUITE ===\n');

  const lessons = curriculumService.getAllLessons();
  const expectedKeys: string[] = [];
  for (const lesson of lessons) {
    for (let i = 0; i < lesson.concepts.length; i++) {
      expectedKeys.push(`ar:${lesson.id}:${i}`);
    }
  }

  check('1.1 the curriculum has concepts to cover', expectedKeys.length > 0, `${expectedKeys.length} concepts`);

  const missing = expectedKeys.filter((k) => {
    const e = PRE_GENERATED_NOOR_LINES[k];
    return !e?.intro?.trim() || !e?.explanation?.trim() || !e?.check?.trim();
  });
  check(
    '1.2 every curriculum concept has all three fixed lines',
    missing.length === 0,
    missing.length ? `${missing.length} missing, e.g. ${missing[0]}` : undefined
  );

  const extra = Object.keys(PRE_GENERATED_NOOR_LINES).filter((k) => !expectedKeys.includes(k));
  check(
    '1.3 no orphaned lines for concepts that no longer exist',
    extra.length === 0,
    extra.length ? `${extra.length} orphaned, e.g. ${extra[0]}` : undefined
  );

  // Sample every concept's lines for placeholder or empty content.
  const badContent: string[] = [];
  for (const key of expectedKeys) {
    const e = PRE_GENERATED_NOOR_LINES[key];
    if (!e) continue;
    for (const slot of ['intro', 'explanation', 'check'] as const) {
      const v = e[slot];
      if (!v || v.trim().length < 15) badContent.push(`${key}.${slot} (too short)`);
      if (/lorem|TODO|placeholder|\.\.\.$/.test(v)) badContent.push(`${key}.${slot} (placeholder)`);
    }
  }
  check(
    '2.1 no line is empty, a placeholder or too short to speak',
    badContent.length === 0,
    badContent.length ? `${badContent.length} bad, e.g. ${badContent[0]}` : undefined
  );

  // The lines must be Arabic: the app speaks Egyptian Arabic to the child.
  const nonArabic = expectedKeys.filter((k) => {
    const e = PRE_GENERATED_NOOR_LINES[k];
    return e && !/[\u0600-\u06FF]/.test(e.explanation);
  });
  check(
    '2.2 the lines are Arabic script',
    nonArabic.length === 0,
    nonArabic.length ? `${nonArabic.length} non-Arabic, e.g. ${nonArabic[0]}` : undefined
  );

  // The lookup helper is what the teaching service calls at runtime.
  const firstKey = expectedKeys[0];
  const [, firstLessonId, firstIndex] = firstKey.split(':');
  check(
    '3.1 getPreGeneratedLine returns the stored intro',
    Boolean(getPreGeneratedLine('ar', firstLessonId, Number(firstIndex), 'intro'))
  );
  check(
    '3.2 getPreGeneratedLine returns null for an unknown lesson',
    getPreGeneratedLine('ar', 'no_such_lesson_xyz', 0, 'intro') === null
  );
  check(
    '3.3 getPreGeneratedLine returns null for a language with no lines',
    getPreGeneratedLine('fr', firstLessonId, Number(firstIndex), 'intro') === null
  );

  console.log(`\nPRE-GENERATED NOOR LINES SUMMARY: ${passed} PASSED, ${failed} FAILED\n`);
  process.exit(failed > 0 ? 1 : 0);
}

main();
