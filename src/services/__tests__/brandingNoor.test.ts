/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Branding and learner-name test.
 *
 * "Amina" is the legacy project name. The product is Miss Noor, and the
 * learner's name is whatever the parent entered — never a hardcoded name.
 * This suite reads the real source files so a hardcoded learner name cannot
 * quietly come back.
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`✅ [PASS] ${message}`);
    passed++;
  } else {
    console.error(`❌ [FAIL] ${message}`);
    failed++;
    process.exitCode = 1;
  }
}

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      if (name === '__tests__' || name === 'node_modules') continue;
      out.push(...walk(full));
    } else if (/\.(ts|tsx)$/.test(name)) {
      out.push(full);
    }
  }
  return out;
}

const componentsRoot = join(process.cwd(), 'src', 'components');
const componentFiles = walk(componentsRoot);

assert(componentFiles.length > 0, '1.1 the component tree was found and read');

/** Lines that show a learner-facing string, as opposed to a comment. */
function isCodeLine(line: string): boolean {
  const trimmed = line.trim();
  if (trimmed.startsWith('*') || trimmed.startsWith('//') || trimmed.startsWith('/*')) return false;
  return true;
}

// --- 1. No learner-facing string hardcodes a name ------------------------
const legacyNameHits: string[] = [];
for (const file of componentFiles) {
  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    if (!isCodeLine(line)) return;
    // A quoted/backticked user-facing string containing the legacy name.
    if (/['"`][^'"`]*\bAmina\b[^'"`]*['"`]/.test(line) || /['"`][^'"`]*أمينة[^'"`]*['"`]/.test(line)) {
      legacyNameHits.push(`${file.replace(process.cwd() + '/', '')}:${i + 1}: ${line.trim()}`);
    }
  });
}
assert(
  legacyNameHits.length === 0,
  `1.2 no component hardcodes the learner name in a user-facing string${
    legacyNameHits.length ? '\n      ' + legacyNameHits.join('\n      ') : ''
  }`
);

// --- 2. The two known defects stay fixed --------------------------------
const tutorCheck = readFileSync(
  join(componentsRoot, 'stage', 'interactions', 'TutorExplanationCheck.tsx'),
  'utf8'
);
assert(
  tutorCheck.includes('${studentName}, do you feel like you understood this concept?'),
  '2.1 the English comprehension prompt uses the learner\'s real name'
);
assert(
  tutorCheck.includes('Is it clear now, ${studentName}?'),
  '2.2 the English clarity prompt uses the learner\'s real name'
);
assert(
  !/Amina/.test(tutorCheck.replace(/^\s*\*.*$/gm, '').replace(/\/\/.*$/gm, '')),
  '2.3 the tutor check has no leftover hardcoded name'
);

const classroom = readFileSync(
  join(componentsRoot, 'teacher', 'VirtualTeacherClassroom.tsx'),
  'utf8'
);
assert(
  classroom.includes('${studentName}\'s reasoning:'),
  '2.4 the reasoning label uses the learner\'s real name'
);
assert(
  classroom.includes('Next Recommended Action for ${studentName}'),
  '2.5 the recommended-action label uses the learner\'s real name'
);

// --- 3. The product name is Miss Noor ------------------------------------
const productHits: string[] = [];
for (const file of componentFiles) {
  const text = readFileSync(file, 'utf8');
  if (/Miss Noor|مس نور/.test(text)) productHits.push(file);
}
assert(productHits.length > 0, '3.1 the product name Miss Noor appears in the UI');

// --- 4. Static brand surfaces carry no legacy name ----------------------
// The component scan above cannot see plain HTML, which is how `public/404.html`
// kept a stale "Amina" title long after the app itself was renamed.
const staticSurfaces = ['index.html', 'public/404.html'];
for (const rel of staticSurfaces) {
  let text: string;
  try {
    text = readFileSync(join(process.cwd(), rel), 'utf8');
  } catch {
    continue;
  }
  assert(
    !/\bAmina\b/.test(text),
    `4.${staticSurfaces.indexOf(rel) + 1} ${rel} carries no legacy name`
  );
}

console.log(`\nBRANDING SUITE SUMMARY: ${passed} PASSED, ${failed} FAILED`);
if (failed > 0) process.exit(1);
