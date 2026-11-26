import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { NOOR_CURRICULUM_CONTEXT } from '../../data/noorCurriculumConfig';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../../..');

const ALLOWED_TRACK_LABELS: Record<string, string> = {
  trackLabelEn: 'French track',
  trackLabelFr: 'Parcours français',
  trackLabelAr: 'المسار الفرنسي',
};

const ALLOWED_PUBLIC_VALUES = new Set([
  'Learner',
  'French-track school',
  'Egypt',
]);

function walkFiles(dirPath: string): string[] {
  if (!fs.existsSync(dirPath)) {
    return [];
  }

  const results: string[] = [];
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name === 'node_modules') {
      continue;
    }

    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkFiles(fullPath));
    } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
      results.push(fullPath);
    }
  }

  return results;
}

test('public curriculum config keeps learner identity generic and non-identifying', () => {
  assert.equal(NOOR_CURRICULUM_CONTEXT.studentName, 'Learner');
  assert.equal(NOOR_CURRICULUM_CONTEXT.school, 'French-track school');
  assert.equal(NOOR_CURRICULUM_CONTEXT.location, 'Egypt');

  for (const [subjectKey, config] of Object.entries(NOOR_CURRICULUM_CONTEXT.subjectConfigs ?? {})) {
    if (config && typeof config.schoolContext === 'string') {
      assert.equal(
        config.schoolContext,
        'French-track school',
        `Unexpected schoolContext for subject "${subjectKey}"; learner-specific identity must come from the private on-device profile, not public source.`,
      );
    }
  }

  for (const [field, expected] of Object.entries(ALLOWED_TRACK_LABELS)) {
    const actual = (NOOR_CURRICULUM_CONTEXT as unknown as Record<string, unknown>)[field];
    assert.ok(actual === expected, `Track label "${field}" must be the generic public label; school-specific names must not be in public source.`);
  }

  const configSourcePath = path.join(repoRoot, 'src/data/noorCurriculumConfig.ts');
  const configSource = fs.readFileSync(configSourcePath, 'utf8');
  const keyValuePattern = /\b(studentName|school|location):\s*'([^']*)'/g;

  const trackPattern = /\b(trackLabelEn|trackLabelFr|trackLabelAr):\s*(['"])(.*?)\2/g;
  for (const match of configSource.matchAll(trackPattern)) {
    assert.ok(match[3] === ALLOWED_TRACK_LABELS[match[1]], `Disallowed value for "${match[1]}" in src/data/noorCurriculumConfig.ts.`);
  }

  for (const match of configSource.matchAll(keyValuePattern)) {
    const [, key, value] = match;
    assert.ok(
      ALLOWED_PUBLIC_VALUES.has(value),
      `Disallowed value for "${key}" in src/data/noorCurriculumConfig.ts; learner-specific identity must come from the private on-device profile, not public source.`,
    );
  }

  const scannedFiles = [
    ...walkFiles(path.join(repoRoot, 'src/data')),
    ...walkFiles(path.join(repoRoot, 'src/services')),
  ];

  const dataStudentNamePattern = /studentName:\s*'([^']+)'/g;

  for (const filePath of scannedFiles) {
    const relativePath = path.relative(repoRoot, filePath).split(path.sep).join('/');
    if (!relativePath.startsWith('src/data/')) {
      continue;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    for (const match of content.matchAll(dataStudentNamePattern)) {
      const studentNameValue = match[1];
      assert.equal(
        studentNameValue,
        'Learner',
        `Disallowed studentName in ${relativePath}; learner-specific identity must come from the private on-device profile, not public source.`,
      );
    }
  }
});

test('French curriculum subject still resolves with a generic, non-school curriculum source', () => {
  const french = NOOR_CURRICULUM_CONTEXT.subjectConfigs?.subj_french;
  assert.ok(french, 'subj_french config must still exist');
  assert.equal(french.subjectId, 'subj_french');
  assert.equal(french.curriculumSource, 'french_track');
  assert.equal(french.instructionLanguage, 'fr');
  assert.equal(french.isFrenchTrackSpecific, true);
  for (const subjectId of ['subj_arabic', 'subj_math', 'subj_science']) {
    assert.ok(NOOR_CURRICULUM_CONTEXT.subjectConfigs?.[subjectId as keyof typeof NOOR_CURRICULUM_CONTEXT.subjectConfigs], `${subjectId} config must still exist`);
  }
});

test('every curriculum source id and label in the public config is generic', () => {
  const source = fs.readFileSync(path.join(repoRoot, 'src/data/noorCurriculumConfig.ts'), 'utf8');
  const allowedSources = new Set(['egyptian_national', 'french_track']);
  for (const m of source.matchAll(/curriculumSource:\s*'([^']*)'/g)) {
    assert.ok(allowedSources.has(m[1]), 'Disallowed curriculumSource id in public config.');
  }
  const allowedLabels = new Set([
    'المنهج المصري', 'Egyptian National Curriculum',
    'منهج القسم الفرنسي', 'French-Track Curriculum', 'المنهج الإنجليزي المعتمد', 'English Curriculum', 'Programme du parcours français',
  ]);
  for (const m of source.matchAll(/curriculumSourceLabel(?:Ar|En|Fr):\s*'([^']*)'/g)) {
    assert.ok(allowedLabels.has(m[1]), 'Disallowed curriculumSourceLabel in public config.');
  }
});
