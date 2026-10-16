/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { AppSettings } from '../types';

export function localDateStr(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function localTimeStr(d: Date = new Date()): string {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function getEffectiveTimeOfDay(
  settings: Pick<AppSettings, 'demoTimeSimulatorActive' | 'simulatedTimeOfDay'>,
  now: Date = new Date()
): 'school_hours' | 'after_school' {
  if (settings.demoTimeSimulatorActive) return settings.simulatedTimeOfDay;
  // ponytail: fixed 14:00 school end; upgrade: use today's last timetable period endTime
  return now.getHours() * 60 + now.getMinutes() >= 14 * 60 ? 'after_school' : 'school_hours';
}
