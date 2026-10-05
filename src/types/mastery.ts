/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type MasteryThreshold = 'mastered' | 'needs_review' | 'learning';

export type ConfidenceBand = 'high' | 'medium' | 'low';

export type EvidenceCorrectness = 'full' | 'partial' | 'wrong';

export type EvidenceIndependence = 'unassisted' | 'hinted' | 'revealed';

export type EvidenceModality = 'quiz' | 'game' | 'reel_check' | 'homework';

export interface WeightBreakdown {
  correctnessWeight: number;
  difficultyWeight: number;
  independenceWeight: number;
  modalityWeight: number;
  recencyWeight: number;
  combinedWeight: number;
}

export interface EvidenceEntry {
  id: string;
  timestamp: string; // ISO string
  correctness: EvidenceCorrectness;
  difficulty: number; // 0..1
  independence: EvidenceIndependence;
  modality: EvidenceModality;
  deltaApplied: number;
  weights: WeightBreakdown;
  scoreAfter: number;
  confidenceAfter: number;
  notes?: string;
}

export interface MasteryRecord {
  id: string; // composite `${studentId}_${conceptId}`
  studentId: string;
  conceptId: string;
  score: number; // 0..1
  confidence: number; // 0..1
  evidenceCount: number;
  lastUpdated: string; // ISO timestamp
  decayRate: number; // per-concept default weekly factor
  decayAppliedCount?: number;
  lastDecayCheck?: string;
  evidenceLog: EvidenceEntry[];
}

export interface FormattedMasteryView {
  score: number;
  percentageText: string;
  confidence: number;
  confidencePercentageText: string;
  confidenceBand: ConfidenceBand;
  confidenceBandLabel: string;
  threshold: MasteryThreshold;
  thresholdLabel: string;
  compositeLabel: string; // e.g., "78% (High confidence)" - NEVER a naked percentage
  hasEvidence: boolean;
}
