import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { NOOR_CURRICULUM_CONTEXT } from '../../data/noorCurriculumConfig';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../../..');

test('OnboardingFlow newStudent regression and curriculum config invariants', () => {
  const onboardingPath = path.join(
    repoRoot,
    'src/components/onboarding/OnboardingFlow.tsx',
  );
  const onboardingSource = fs.readFileSync(onboardingPath, 'utf8');

  const startMarker = 'const newStudent: Student = {';
  const endLine = '      };';

  const startIndex = onboardingSource.indexOf(startMarker);
  assert.notEqual(
    startIndex,
    -1,
    'Expected to find object literal starting with "const newStudent: Student = {"',
  );

  const lines = onboardingSource.slice(startIndex).split(/\r?\n/);
  const endLineIndex = lines.findIndex((line) => line === endLine);
  assert.notEqual(
    endLineIndex,
    -1,
    'Expected to find closing line with 6 spaces followed by "};" for newStudent',
  );

  const literalBlock = lines.slice(0, endLineIndex + 1).join('\n');

  assert.doesNotMatch(
    literalBlock,
    /^\s*school\s*:/m,
    'newStudent literal must not contain a school property',
  );
  assert.doesNotMatch(
    literalBlock,
    /^\s*location\s*:/m,
    'newStudent literal must not contain a location property',
  );

  const literalLines = literalBlock.split(/\r?\n/);
  const expectedTrack = 'french_bilingual';
  assert.ok(
    literalLines.some((line) => line.includes(`curriculumTrack: '${expectedTrack}'`)),
    "newStudent literal must contain curriculumTrack: 'french_bilingual'",
  );

  const expectedCurriculum = 'French Track — Egyptian National + French Curriculum';
  assert.ok(
    literalLines.some((line) => line.trim() === `curriculum: '${expectedCurriculum}',`),
    "newStudent literal must contain curriculum property with exact expected string",
  );

  const frenchSubject = NOOR_CURRICULUM_CONTEXT.subjectConfigs.subj_french;
  assert.ok(frenchSubject, 'NOOR_CURRICULUM_CONTEXT.subjectConfigs.subj_french must exist');
  assert.equal(frenchSubject.curriculumSource, 'french_track');
  assert.equal(frenchSubject.instructionLanguage, 'fr');
  assert.equal(frenchSubject.track, 'french_bilingual');
  assert.equal(frenchSubject.track, expectedTrack);

  const companionPath = path.join(
    repoRoot,
    'src/components/companion/CompanionChatScreen.tsx',
  );
  const companionSource = fs.readFileSync(companionPath, 'utf8');

  assert.ok(
    companionSource.includes('school: student?.school'),
    'CompanionChatScreen.tsx must contain "school: student?.school"',
  );
  assert.ok(
    companionSource.includes('location: student?.location'),
    'CompanionChatScreen.tsx must contain "location: student?.location"',
  );
});
