/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phone-viewport UI/UX regression suite (docs/design/UI_AUDIT_PHONE_2026-10-26.md).
 *
 * Guards the findings the audit ranked high, so a later refactor cannot quietly
 * bring them back:
 *   F1 — step 1 says what it still needs instead of a silent disabled Next.
 *   F2 — interactive controls on the primary screens stay at the 44px floor.
 *   F3 — body text on the primary screens stays at 12px or above.
 *   F4 — the teacher is "مس نور" in the UI, never "المعلمة نور".
 *   F5 — every onboarding step renders a real heading.
 *
 * Source-scanning, like the branding suite: no DOM, no network, no build.
 */

import { readFileSync } from 'fs';
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

const src = (rel: string) => readFileSync(join(process.cwd(), rel), 'utf8');

// --- F1: step 1 explains what is missing ---------------------------------
const onboarding = src('src/components/onboarding/OnboardingFlow.tsx');
assert(
  onboarding.includes('canContinueStep1'),
  'F1.1 step 1 derives a single can-continue condition'
);
assert(
  onboarding.includes('step1Hint'),
  'F1.2 step 1 renders a hint for the unmet requirement'
);
assert(
  /!canContinueStep1\s*&&/.test(onboarding),
  'F1.3 the hint only shows while the step is incomplete'
);
assert(
  onboarding.includes('aria-live="polite"'),
  'F1.4 the hint is announced to assistive tech'
);

// --- F5: onboarding headings ---------------------------------------------
assert(
  /<h1/.test(onboarding),
  'F5.1 onboarding renders an h1 heading'
);
assert(
  ['step1Title', 'step2Title', 'step3Title', 'step4Title'].every((k) => onboarding.includes(k)),
  'F5.2 every onboarding step has a title wired into the heading'
);

const translations = src('src/i18n/translations.ts');
for (const key of ['step1Title', 'step2Title', 'step3Title', 'step4Title', 'step1Hint']) {
  const hits = translations.split('\n').filter((l) => l.trim().startsWith(`${key}:`)).length;
  assert(hits === 3, `F5.3 "${key}" is defined once per language (found ${hits})`);
}

// --- F2: 44px tap floor on the primary screens ---------------------------
// Each entry is a control the audit measured below the floor. The class must
// carry min-h-[44px] (or a 44px icon button) after the fix.
const tapTargets: Array<[string, string, string]> = [
  ['teacher', 'src/components/teacher/VirtualTeacherClassroom.tsx', 'the Switch-lesson button'],
  ['teacher', 'src/components/teacher/VirtualTeacherClassroom.tsx', 'the school-bell icon button'],
  ['teacher', 'src/components/teacher/VirtualTeacherClassroom.tsx', 'the replay-voice icon button'],
  ['home', 'src/components/home/HomeScreen.tsx', 'the re-plan missions icon button'],
  ['layout', 'src/components/layout/ChildTopMenu.tsx', 'the top menu button'],
  ['feed', 'src/components/collections/SaveLikeButton.tsx', 'the like/save icon buttons'],
  ['picker', 'src/components/curriculum/CurriculumSubjectPickerModal.tsx', 'the subject chips'],
  ['library', 'src/components/curriculum/CurriculumBrowser.tsx', 'the bookshelf/units view switch'],
];
for (const [name, file, label] of tapTargets) {
  const text = src(file);
  assert(
    text.includes('min-h-[44px]') || text.includes('min-w-[44px]'),
    `F2 ${name}: ${label} carries a 44px minimum`
  );
}

// --- F3: no sub-12px text on the primary screens -------------------------
const primaryScreens = [
  'src/components/onboarding/OnboardingFlow.tsx',
  'src/components/home/HomeScreen.tsx',
  'src/components/curriculum/CurriculumBrowser.tsx',
  'src/components/curriculum/CurriculumSubjectPickerModal.tsx',
  'src/components/teacher/VirtualTeacherClassroom.tsx',
  'src/components/layout/BottomNav.tsx',
  'src/components/layout/AppShell.tsx',
];
for (const file of primaryScreens) {
  const hits = src(file).match(/text-\[(?:[0-9]|1[01])px\]/g) ?? [];
  assert(
    hits.length === 0,
    `F3 ${file.replace('src/components/', '')} has no text below 12px (found ${hits.length})`
  );
}

// --- F4: one Arabic name for the teacher --------------------------------
const uiFiles = [
  'src/components/teacher/VirtualTeacherClassroom.tsx',
  'src/components/home/HomeScreen.tsx',
  'src/components/timetable/TimetableScreen.tsx',
  'src/components/missions/MissionRunnerModal.tsx',
  'src/components/curriculum/LessonStudyModal.tsx',
  'src/components/voice/TaskInstructionSpeaker.tsx',
];
const offenders: string[] = [];
for (const file of uiFiles) {
  if (src(file).includes('المعلمة نور')) offenders.push(file);
}
assert(
  offenders.length === 0,
  `F4.1 no UI component calls the teacher "المعلمة نور"${offenders.length ? ` (${offenders.join(', ')})` : ''}`
);
assert(
  src('src/components/teacher/VirtualTeacherClassroom.tsx').includes('مس نور'),
  'F4.2 the classroom uses the canonical name "مس نور"'
);

console.log(`\nPHONE UI ACCESSIBILITY SUITE SUMMARY: ${passed} PASSED, ${failed} FAILED`);
if (failed > 0) process.exit(1);
