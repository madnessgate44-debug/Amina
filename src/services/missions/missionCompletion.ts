/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Student,
  Mission,
  MissionOutcome,
  MasteryRecord,
  EvidenceCorrectness,
  EvidenceModality,
  StudentGamification,
} from '../../types';
import { IStorageService } from '../storage';
import { curriculumService } from '../curriculum/curriculumService';
import { createInitialMasteryRecord, addEvidenceToMastery } from '../mastery/masteryEngine';
import { awardMissionGamification } from '../gamification/gamificationService';

export interface ProcessMissionCompletionParams {
  student: Student | null | undefined;
  mission: Mission | null | undefined;
  outcomeParams?: {
    score?: number;
    modality?: 'quiz' | 'reel_check' | 'practice' | 'homework';
  };
  storage: IStorageService;
  masteryRecords?: Record<string, MasteryRecord>;
  onRecordEvidence?: (
    conceptId: string,
    params: {
      correctness: EvidenceCorrectness;
      difficulty: number;
      independence: 'unassisted' | 'hinted' | 'revealed';
      modality: EvidenceModality;
      notes?: string;
    }
  ) => Promise<MasteryRecord | null>;
}

export interface ProcessMissionCompletionResult {
  success: boolean;
  rejectedReason?: 'no_active_student' | 'mission_not_found' | 'student_id_mismatch';
  completedMission?: Mission;
  outcome?: MissionOutcome;
  evidenceAdded: boolean;
  gamificationAwarded: boolean;
  updatedGamification?: StudentGamification;
}

/**
 * Authoritative Mission Completion Processor.
 *
 * Rules:
 * 1. Active student identity is mandatory. If no active student with student.id, safely reject.
 * 2. mission.studentId must strictly match student.id. If mismatch, safely reject.
 * 3. On rejection: do NOT persist completed mission, do NOT persist MissionOutcome,
 *    do NOT record mastery evidence, and do NOT award gamification.
 * 4. evidenceAdded is true ONLY if mastery evidence was actually recorded successfully
 *    (concept exists in authoritative curriculum + evaluated score was supplied).
 */
export async function processMissionCompletion(
  params: ProcessMissionCompletionParams
): Promise<ProcessMissionCompletionResult> {
  const { student, mission, outcomeParams, storage, masteryRecords = {}, onRecordEvidence } = params;

  // RULE 1: Require an active student with a valid student.id
  if (!student || !student.id) {
    console.warn('Mission completion rejected: no active student profile');
    return {
      success: false,
      rejectedReason: 'no_active_student',
      evidenceAdded: false,
      gamificationAwarded: false,
    };
  }

  // RULE 2: Mission must exist
  if (!mission) {
    return {
      success: false,
      rejectedReason: 'mission_not_found',
      evidenceAdded: false,
      gamificationAwarded: false,
    };
  }

  // RULE 3: Authoritative Student ID Check: mission.studentId === student.id
  if (mission.studentId !== student.id) {
    console.warn(
      `Mission completion rejected: mission.studentId ("${mission.studentId}") does not match active student.id ("${student.id}")`
    );
    return {
      success: false,
      rejectedReason: 'student_id_mismatch',
      evidenceAdded: false,
      gamificationAwarded: false,
    };
  }

  const completedAt = new Date().toISOString();
  const completedMission: Mission = {
    ...mission,
    status: 'completed',
    completedAt,
  };

  // Persist completed mission
  await storage.saveMission(completedMission);

  // RULE 4: Evidence Recording
  // Evidence is only recorded if:
  // a) mission has a conceptId
  // b) evaluated score is explicitly supplied
  // c) concept actually exists in the authoritative curriculum
  let evidenceActuallyAdded = false;
  if (mission.conceptId && outcomeParams?.score !== undefined) {
    const modality: EvidenceModality =
      outcomeParams?.modality === 'quiz'
        ? 'quiz'
        : outcomeParams?.modality === 'reel_check'
        ? 'reel_check'
        : 'homework';

    const correctness: EvidenceCorrectness =
      outcomeParams.score >= 0.7
        ? 'full'
        : outcomeParams.score >= 0.4
        ? 'partial'
        : 'wrong';

    if (onRecordEvidence) {
      const rec = await onRecordEvidence(mission.conceptId, {
        correctness,
        difficulty: 0.5,
        independence: 'unassisted',
        modality,
        notes: `Completed mission with score ${(outcomeParams.score * 100).toFixed(0)}%: ${mission.title}`,
      });
      if (rec) {
        evidenceActuallyAdded = true;
      }
    } else {
      // Default direct storage engine path
      const flatConcepts = curriculumService.getFlatConcepts();
      const conceptExists = flatConcepts.some((c) => c.id === mission.conceptId);
      if (conceptExists) {
        const existing =
          masteryRecords[mission.conceptId] ||
          (await storage.getMasteryRecord(student.id, mission.conceptId)) ||
          createInitialMasteryRecord(student.id, mission.conceptId);

        const { updatedRecord } = addEvidenceToMastery(existing, {
          correctness,
          difficulty: 0.5,
          independence: 'unassisted',
          modality,
          notes: `Completed mission with score ${(outcomeParams.score * 100).toFixed(0)}%: ${mission.title}`,
        });

        await storage.saveMasteryRecord(updatedRecord);
        evidenceActuallyAdded = true;
      }
    }
  }

  // RULE 5: Save MissionOutcome with truthful evidenceAdded
  const outcome: MissionOutcome = {
    id: `out_${mission.id}_${Date.now()}`,
    missionId: mission.id,
    studentId: student.id,
    completedAt,
    status: 'completed',
    score: outcomeParams?.score,
    modalityUsed: outcomeParams?.modality,
    evidenceAdded: evidenceActuallyAdded,
  };
  await storage.saveMissionOutcome(outcome);

  // RULE 6: Gamification Award
  let updatedGamification: StudentGamification | undefined;
  let gamificationAwarded = false;
  try {
    updatedGamification = await awardMissionGamification(
      student.id,
      storage,
      completedMission,
      masteryRecords
    );
    gamificationAwarded = true;
  } catch (e) {
    console.warn('Could not award gamification:', e);
  }

  return {
    success: true,
    completedMission,
    outcome,
    evidenceAdded: evidenceActuallyAdded,
    gamificationAwarded,
    updatedGamification,
  };
}
