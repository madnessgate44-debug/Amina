/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Regression tests for the two defects the owner reported on the live app:
 *   1. "voices do not work"  — the app picked a wrong-language voice, or none
 *      at all, and failed silently.
 *   2. "questions are stupid" — every generated question had the correct answer
 *      as the first option and tested nothing about the subject.
 *
 * These exercise the real code paths, not mocks.
 */

import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import { pickBestVoice, hasVoiceForLanguage, VoiceLike } from '../voice/voiceSelection';
import { getQuizQuestionsForConcept, getReelForConcept, realQuestionsForConcept } from '../content/contentGenerator';
import { personalizeNoorText } from '../stage/personalizeNoorText';
import { curriculumService } from '../curriculum/curriculumService';

let passed = 0;
const test = (name: string, fn: () => void) => {
  try {
    fn();
    passed++;
    console.log(`✅ [PASS] ${name}`);
  } catch (e: any) {
    console.error(`❌ [FAIL] ${name}: ${e.message}`);
    process.exitCode = 1;
  }
};

// ---------------------------------------------------------------------------
// 1. Voice selection
// ---------------------------------------------------------------------------

const V = (lang: string, name: string, extra: Partial<VoiceLike> = {}): VoiceLike => ({
  lang,
  name,
  localService: true,
  ...extra,
});

test('1.1 an Arabic sentence never falls back to an English voice', () => {
  const englishOnly = [V('en-US', 'Samantha'), V('en-GB', 'Daniel')];
  assert.strictEqual(hasVoiceForLanguage(englishOnly, 'ar'), false);
  assert.strictEqual(pickBestVoice(englishOnly, 'ar'), undefined);
});

test('1.2 Egyptian Arabic wins over other Arabic voices', () => {
  const voices = [V('ar-SA', 'Majed'), V('ar-EG', 'Salma'), V('ar', 'Generic')];
  assert.strictEqual(pickBestVoice(voices, 'ar')?.name, 'Salma');
});

test('1.3 a generic Arabic voice is still used when no regional one exists', () => {
  const voices = [V('en-US', 'Samantha'), V('ar', 'Hoda')];
  assert.strictEqual(pickBestVoice(voices, 'ar')?.name, 'Hoda');
});

test('1.4 a neural/cloud voice is preferred within the same region', () => {
  const voices = [V('en-US', 'Plain Voice'), V('en-US', 'Microsoft Aria Natural', { localService: false })];
  assert.strictEqual(pickBestVoice(voices, 'en')?.name, 'Microsoft Aria Natural');
});

test('1.5 French prefers fr-FR and does not steal an English voice', () => {
  const voices = [V('en-US', 'Samantha'), V('fr-CA', 'Amelie'), V('fr-FR', 'Thomas')];
  assert.strictEqual(pickBestVoice(voices, 'fr')?.name, 'Thomas');
  assert.strictEqual(hasVoiceForLanguage([V('en-US', 'Samantha')], 'fr'), false);
});

test('1.6 no voices loaded yet is reported as unavailable, not as success', () => {
  assert.strictEqual(hasVoiceForLanguage([], 'ar'), false);
  assert.strictEqual(pickBestVoice([], 'ar'), undefined);
});

// ---------------------------------------------------------------------------
// 2. Questions come from the textbook, not a template
// ---------------------------------------------------------------------------

const concepts = curriculumService.getFlatConcepts();

test('2.1 every concept yields at least one real question', () => {
  const missing = concepts.filter((c) => getQuizQuestionsForConcept(c.id).length === 0);
  assert.strictEqual(
    missing.length,
    0,
    `concepts with no question: ${missing.map((c) => c.id).join(', ')}`
  );
});

test('2.2 the correct answer is genuinely among the options', () => {
  for (const c of concepts) {
    for (const q of getQuizQuestionsForConcept(c.id)) {
      const opts = q.optionsAr || [];
      const idx = q.correctAnswer as number;
      assert.ok(idx >= 0 && idx < opts.length, `${c.id}: correctAnswer ${idx} outside options`);
    }
  }
});

test('2.3 questions are textbook text, not the old filler phrasing', () => {
  const banned = [
    'هل مفهوم',
    'ما هو الأساس الرئيسي لتطبيق',
    'rely on structured comprehension',
    'What is the cornerstone when applying',
  ];
  for (const c of concepts) {
    for (const q of getQuizQuestionsForConcept(c.id)) {
      for (const phrase of banned) {
        assert.ok(
          !q.promptAr.includes(phrase) && !q.promptEn.includes(phrase),
          `${c.id} still contains filler phrasing: ${phrase}`
        );
      }
    }
  }
});

test('2.4 the correct answer is not always the first option', () => {
  const positions = new Set<number>();
  for (const c of concepts) {
    for (const q of getQuizQuestionsForConcept(c.id)) positions.add(q.correctAnswer as number);
  }
  assert.ok(
    positions.size >= 3,
    `answers still cluster: only positions ${[...positions].join(',')} are ever correct`
  );
  assert.ok(!(positions.size === 1 && positions.has(0)), 'every answer is still option A');
});

test('2.5 shuffling is deterministic for a given concept', () => {
  const first = realQuestionsForConcept(concepts[0].id);
  const second = realQuestionsForConcept(concepts[0].id);
  assert.deepStrictEqual(first, second, 'question order/options changed between calls');
});

test('2.6 the reel quick check uses the same real question', () => {
  const reel = getReelForConcept(concepts[0].id);
  assert.ok(reel, 'reel was not produced');
  const real = realQuestionsForConcept(concepts[0].id);
  assert.strictEqual(reel!.quickCheck.questionAr, real[0].prompt);
  assert.ok(
    reel!.quickCheck.optionsAr.includes(reel!.quickCheck.optionsAr[reel!.quickCheck.correctIndex]),
    'quick-check answer is not among its options'
  );
  assert.ok(!reel!.quickCheck.questionAr.includes('الأساس الرئيسي'), 'old filler question returned');
});

// ---------------------------------------------------------------------------
// 3. The learner's own name is used everywhere
// ---------------------------------------------------------------------------

test('3.1 the legacy name is replaced in displayed text', () => {
  assert.strictEqual(personalizeNoorText('مرحباً بكِ يا أمينة!', 'سارة'), 'مرحباً بكِ يا سارة!');
  assert.strictEqual(personalizeNoorText('Welcome Amina!', 'Sara'), 'Welcome Sara!');
});

test('3.2 with no name the legacy name never leaks to the screen', () => {
  const out = personalizeNoorText('يا أمينة و Amina', '');
  assert.ok(!out.includes('أمينة'), 'Arabic legacy name leaked');
  assert.ok(!out.includes('Amina'), 'Latin legacy name leaked');
});

test('3.3 the Arabic welcome line calls the teacher "مس نور"', () => {
  const src = readFileSync(new URL('../voice/tutorSpeechService.ts', import.meta.url), 'utf8');
  assert.ok(src.includes('أنا مس نور'), 'teacher name is not "مس نور"');
  assert.ok(!src.includes('أنا المعلمة نور'), 'wrong teacher name "المعلمة نور" still present');
});

console.log(`\nVOICE + QUESTIONS SUITE SUMMARY: ${passed} PASSED, ${process.exitCode ? '1+' : 0} FAILED`);
if (process.exitCode) process.exit(1);
