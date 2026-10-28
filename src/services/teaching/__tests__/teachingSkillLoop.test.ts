/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Proves the teaching-skill coordinator is wired into the live teaching loop:
 * a wrong answer that matches curriculum misconception data produces a tutor
 * turn tagged with the diagnosis skill, and the loop still advances normally.
 */

import { TeachingSessionEngine } from '../teachingSession';
import { curriculumService } from '../../curriculum/curriculumService';
import { writeFileSync } from 'node:fs';

function assert(condition: boolean, message: string) {
  if (!condition) {
    writeFileSync('teaching-skill-loop-failure.txt', message, 'utf8');
    throw new Error(message);
  }
}

const engine = new TeachingSessionEngine();
const lessonId = 'off_mathfr_u1_l1_decimaux';
const lesson = curriculumService.getLessonById(lessonId);
if (!lesson || !lesson.concepts[0]) throw new Error('authoritative test lesson missing');
const concept = lesson.concepts[0];
if (!concept.misconceptions || concept.misconceptions.length === 0) {
  throw new Error('anchor lesson must carry misconception data for this test');
}
const trigger = concept.misconceptions[0].trigger;

const advance = (session: any, input: string) =>
  engine.advanceSession({ session, studentInput: input, language: 'ar' });

let session = engine.initializeSession({ studentId: 'skill_loop', lessonId, language: 'ar' }).session;
session = advance(session, 'جاهزة').session; // greet -> warmup
session = advance(session, 'جاهزة').session; // warmup -> teach
session = advance(session, 'لا أعرف').session; // teach -> ask
assert(session.currentStep === 'ask', 'setup should reach the understanding check');

// A wrong answer that matches curriculum misconception data.
const wrong = advance(session, trigger);
assert(wrong.session.currentStep === 'adjust', 'a wrong answer should escalate to adjust');
assert(
  wrong.newTutorTurn.skillId === 'diagnose-misconception',
  `the tutor turn should be tagged with the diagnosis skill, got ${wrong.newTutorTurn.skillId}`
);
assert(
  wrong.newTutorTurn.text.includes(concept.misconceptions[0].remediation),
  'the tutor should speak the curriculum remediation, not a generic "try again"'
);

// The loop still works when no misconception matches.
const other = advance(wrong.session, 'شيء آخر تماماً لا علاقة له');
assert(other.session.currentStep === 'adjust', 'an unmatched wrong answer still escalates');
assert(
  other.newTutorTurn.skillId !== 'diagnose-misconception',
  'an unmatched answer must not claim a diagnosis'
);

console.log('Teaching-skill loop wiring tests passed.');
