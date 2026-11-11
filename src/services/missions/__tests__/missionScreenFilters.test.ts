/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { Mission, MissionType } from '../../../types';
import { filterMissionsForScreen } from '../missionScreenFilters';

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    passed++;
    console.log(`✅ [PASS] ${message}`);
  } else {
    failed++;
    console.error(`❌ [FAIL] ${message}`);
  }
}

function mission(type: MissionType, index: number): Mission {
  return {
    id: `mission-${index}`,
    studentId: 'student-test',
    date: '2026-11-11',
    subject: 'Mathematics',
    title: `Mission ${index}`,
    type,
    estimatedMinutes: 10,
    whyNow: 'Test fixture',
    originTag: 'test',
    successCriterion: 'Complete the task',
    status: 'pending',
  };
}

function main() {
  const all = [
    mission('practice', 1),
    mission('homework', 2),
    mission('review', 3),
    mission('understand_lesson', 4),
    mission('quiz', 5),
    mission('game', 6),
  ];

  const missions = filterMissionsForScreen(all, 'missions');
  const homework = filterMissionsForScreen(all, 'homework');

  assert(missions.length === 5, 'Missions mode keeps every non-homework mission');
  assert(missions.every((item) => item.type !== 'homework'), 'Missions mode excludes homework missions');
  assert(homework.length === 1 && homework[0].type === 'homework', 'Homework mode keeps only homework missions');
  assert(all.length === 6, 'Filtering does not mutate the shared mission list');

  const screen = readFileSync(join(process.cwd(), 'src/components/missions/MissionsScreen.tsx'), 'utf8');
  const shell = readFileSync(join(process.cwd(), 'src/components/layout/AppShell.tsx'), 'utf8');
  assert(screen.includes('currentDayRecord?.homeworkAssigned'), 'Homework mode reads the existing day-record assignments');
  assert(screen.includes('<HomeworkAssignments items={homeworkAssignments}'), 'Homework mode falls back to the day-record assignment list');
  assert(shell.includes('<MissionsScreen mode="missions" />'), 'AppShell routes the Missions tab to missions mode');
  assert(shell.includes('<MissionsScreen mode="homework" />'), 'AppShell routes the Homework tab to homework mode');

  console.log(`\nMISSION SCREEN FILTERS: ${passed} PASSED, ${failed} FAILED`);
  if (failed > 0) process.exit(1);
}

main();
