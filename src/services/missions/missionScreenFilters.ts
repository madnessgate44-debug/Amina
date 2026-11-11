/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Keeps the HOMEWORK and MISSIONS navigation destinations mutually exclusive.
 */

import { Mission } from '../../types';

export type MissionScreenMode = 'missions' | 'homework';

export function filterMissionsForScreen(missions: Mission[], mode: MissionScreenMode): Mission[] {
  return missions.filter((mission) => mode === 'homework'
    ? mission.type === 'homework'
    : mission.type !== 'homework');
}
