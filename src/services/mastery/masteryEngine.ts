/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  MasteryRecord,
  EvidenceEntry,
  EvidenceCorrectness,
  EvidenceIndependence,
  EvidenceModality,
  WeightBreakdown,
  MasteryThreshold,
  ConfidenceBand,
  FormattedMasteryView,
} from '../../types/mastery';
import { Language } from '../../types';

export const SCORE_FLOOR = 0.5;
export const MAX_CONFIDENCE = 0.95;
export const DEFAULT_WEEKLY_DECAY = 0.05; // 5% drift per week

/**
 * Creates an empty, initial mastery record for a concept
 */
export function createInitialMasteryRecord(
  studentId: string,
  conceptId: string,
  decayRate: number = DEFAULT_WEEKLY_DECAY
): MasteryRecord {
  return {
    id: `${studentId}_${conceptId}`,
    studentId,
    conceptId,
    score: 0.5,
    confidence: 0.0,
    evidenceCount: 0,
    lastUpdated: new Date().toISOString(),
    decayRate,
    evidenceLog: [],
  };
}

/**
 * Computes the individual weights and combined weight for an evidence item.
 */
export function computeEvidenceWeights(params: {
  correctness: EvidenceCorrectness;
  difficulty: number;
  independence: EvidenceIndependence;
  modality: EvidenceModality;
  recencyDays?: number;
}): WeightBreakdown {
  const { correctness, difficulty, independence, modality, recencyDays = 0 } = params;

  // 1. Correctness Weight
  let correctnessWeight = 1.0;
  if (correctness === 'partial') {
    correctnessWeight = 0.75;
  } else if (correctness === 'wrong') {
    correctnessWeight = 1.0;
  }

  // 2. Difficulty Weight (0..1)
  const clampedDifficulty = Math.max(0, Math.min(1, difficulty));
  let difficultyWeight = 0.5 + 0.5 * clampedDifficulty;
  if (correctness === 'wrong') {
    // Failing an easy problem (low difficulty) is a strong negative signal
    difficultyWeight = 0.5 + 0.5 * (1 - clampedDifficulty);
  }

  // 3. Independence Weight
  let independenceWeight = 1.0;
  if (independence === 'hinted') {
    independenceWeight = 0.65;
  } else if (independence === 'revealed') {
    independenceWeight = 0.30;
  }

  // 4. Modality Weight
  let modalityWeight = 1.0;
  switch (modality) {
    case 'quiz':
      modalityWeight = 1.0;
      break;
    case 'homework':
      modalityWeight = 0.90;
      break;
    case 'game':
      modalityWeight = 0.75;
      break;
    case 'reel_check':
      modalityWeight = 0.60;
      break;
  }

  // 5. Recency Weight (1.0 for new immediate evidence, decays for backfilled logs)
  const recencyWeight = Math.max(0.2, 1.0 / (1.0 + 0.05 * recencyDays));

  // Combined Weight
  const rawCombined =
    correctnessWeight * difficultyWeight * independenceWeight * modalityWeight * recencyWeight;
  const combinedWeight = Number(Math.max(0.05, Math.min(1.0, rawCombined)).toFixed(4));

  return {
    correctnessWeight: Number(correctnessWeight.toFixed(3)),
    difficultyWeight: Number(difficultyWeight.toFixed(3)),
    independenceWeight: Number(independenceWeight.toFixed(3)),
    modalityWeight: Number(modalityWeight.toFixed(3)),
    recencyWeight: Number(recencyWeight.toFixed(3)),
    combinedWeight,
  };
}

/**
 * Probabilistic Bayesian-style update rule:
 * - Moves score toward new evidence (weighted)
 * - Increases confidence as evidenceCount grows
 * - Enforces residual uncertainty ceiling at 0.95
 */
export function addEvidenceToMastery(
  record: MasteryRecord,
  evidence: {
    correctness: EvidenceCorrectness;
    difficulty: number;
    independence: EvidenceIndependence;
    modality: EvidenceModality;
    notes?: string;
    timestamp?: string;
  }
): { updatedRecord: MasteryRecord; newEntry: EvidenceEntry } {
  const ts = evidence.timestamp || new Date().toISOString();
  const weights = computeEvidenceWeights({
    correctness: evidence.correctness,
    difficulty: evidence.difficulty,
    independence: evidence.independence,
    modality: evidence.modality,
    recencyDays: 0,
  });

  // Target score from correctness
  let targetScore = 0.0;
  if (evidence.correctness === 'full') {
    targetScore = 1.0;
  } else if (evidence.correctness === 'partial') {
    targetScore = 0.5;
  } else {
    targetScore = 0.0;
  }

  const currentScore = record.evidenceCount === 0 ? 0.5 : record.score;
  const currentConfidence = record.confidence;

  // Adaptive learning rate with diminishing sensitivity as evidence accumulates
  const adaptiveRate = 0.35 / (1 + 0.12 * Math.min(12, record.evidenceCount));
  const effectiveAlpha = weights.combinedWeight * adaptiveRate;

  // Probabilistic movement toward target
  const newScoreRaw = currentScore + effectiveAlpha * (targetScore - currentScore);
  const newScore = Number(Math.max(0.0, Math.min(1.0, newScoreRaw)).toFixed(4));
  const deltaApplied = Number((newScore - currentScore).toFixed(4));

  // Confidence gain with asymptotic ceiling at MAX_CONFIDENCE (0.95)
  // Even with hundreds of perfect answers, residual uncertainty stays >= 0.05
  const confidenceGap = MAX_CONFIDENCE - currentConfidence;
  const confidenceGain = confidenceGap * (0.24 * weights.combinedWeight);
  const newConfidence = Number(
    Math.min(MAX_CONFIDENCE, currentConfidence + confidenceGain).toFixed(4)
  );

  const entry: EvidenceEntry = {
    id: `ev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: ts,
    correctness: evidence.correctness,
    difficulty: Number(evidence.difficulty.toFixed(2)),
    independence: evidence.independence,
    modality: evidence.modality,
    deltaApplied,
    weights,
    scoreAfter: newScore,
    confidenceAfter: newConfidence,
    notes: evidence.notes,
  };

  const updatedRecord: MasteryRecord = {
    ...record,
    score: newScore,
    confidence: newConfidence,
    evidenceCount: record.evidenceCount + 1,
    lastUpdated: ts,
    evidenceLog: [entry, ...record.evidenceLog].slice(0, 50), // keep recent 50 entries
  };

  return { updatedRecord, newEntry: entry };
}

/**
 * Decay Rule:
 * - Over time, score drifts toward 0.5 floor
 * - Decay accelerates when evidenceCount is low
 * - Decay is paused for concepts actively in review (within grace period)
 */
export function applyDecay(
  record: MasteryRecord,
  currentTime: Date | string | number = new Date(),
  simulatedDaysElapsed?: number
): MasteryRecord {
  if (record.evidenceCount === 0) {
    return record;
  }

  let daysElapsed = 0;
  if (typeof simulatedDaysElapsed === 'number' && simulatedDaysElapsed >= 0) {
    daysElapsed = simulatedDaysElapsed;
  } else {
    const now = typeof currentTime === 'object' ? currentTime.getTime() : new Date(currentTime).getTime();
    const last = new Date(record.lastUpdated).getTime();
    daysElapsed = Math.max(0, (now - last) / (1000 * 60 * 60 * 24));
  }

  // Grace period: decay is paused for actively reviewed concepts (within 1.5 days)
  if (daysElapsed <= 1.5) {
    return record;
  }

  const effectiveDaysToDecay = daysElapsed - 1.5;

  // Decay accelerates when evidence count is low (fragile memory)
  // A concept with 1 piece of evidence decays faster than one with 10 pieces
  const lowEvidenceMultiplier = 1.0 + Math.max(0, (6 - record.evidenceCount) * 0.25);
  const dailyDecayRate = (record.decayRate / 7) * lowEvidenceMultiplier;

  // Decay factor compounded
  const totalDecayStep = effectiveDaysToDecay * dailyDecayRate;

  let decayedScore = record.score;
  if (record.score > SCORE_FLOOR) {
    // Drifts downward toward 0.5 floor
    decayedScore = Math.max(SCORE_FLOOR, record.score - totalDecayStep * (record.score - SCORE_FLOOR));
  } else if (record.score < SCORE_FLOOR) {
    // Drifts upward toward 0.5 floor
    decayedScore = Math.min(SCORE_FLOOR, record.score + totalDecayStep * (SCORE_FLOOR - record.score));
  }

  // Confidence also gently experiences entropy over long periods of non-practice
  const confidenceEntropy = effectiveDaysToDecay * 0.003;
  const decayedConfidence = Math.max(0.15, record.confidence - confidenceEntropy);

  return {
    ...record,
    score: Number(decayedScore.toFixed(4)),
    confidence: Number(decayedConfidence.toFixed(4)),
    decayAppliedCount: (record.decayAppliedCount || 0) + 1,
    lastDecayCheck: new Date().toISOString(),
  };
}

/**
 * Calculates current threshold:
 * - mastered     : score >= 0.85 AND confidence >= 0.70
 * - needs_review : score < 0.60 OR (decayed) score < 0.70
 * - learning     : everything else
 */
export function getMasteryThreshold(score: number, confidence: number): MasteryThreshold {
  if (score >= 0.85 && confidence >= 0.70) {
    return 'mastered';
  }
  if (score < 0.60 || (score < 0.70 && confidence >= 0.40)) {
    return 'needs_review';
  }
  return 'learning';
}

/**
 * Calculates confidence band:
 * - high   : confidence >= 0.70
 * - medium : confidence >= 0.40
 * - low    : confidence <  0.40
 */
export function getConfidenceBand(confidence: number): ConfidenceBand {
  if (confidence >= 0.70) return 'high';
  if (confidence >= 0.40) return 'medium';
  return 'low';
}

/**
 * Formats a mastery record for UI display.
 * MANDATORY RULE: UI NEVER shows a naked percentage. Always percentage + band!
 */
export function formatMasteryView(
  record: MasteryRecord | null | undefined,
  language: Language
): FormattedMasteryView {
  const isArabic = language === 'ar';

  if (!record || record.evidenceCount === 0) {
    return {
      score: 0.5,
      percentageText: isArabic ? 'لم يبدأ بعد' : 'Not started',
      confidence: 0,
      confidencePercentageText: '0%',
      confidenceBand: 'low',
      confidenceBandLabel: isArabic ? 'ثقة غير كافية' : 'Insufficient confidence',
      threshold: 'learning',
      thresholdLabel: isArabic ? 'جديد / قيد التعلم' : 'New / Learning',
      compositeLabel: isArabic ? 'لم يبدأ بعد (دون أدلة)' : 'Not started (no evidence yet)',
      hasEvidence: false,
    };
  }

  const scorePct = Math.round(record.score * 100);
  const confPct = Math.round(record.confidence * 100);
  const band = getConfidenceBand(record.confidence);
  const threshold = getMasteryThreshold(record.score, record.confidence);

  let bandLabel = '';
  switch (band) {
    case 'high':
      bandLabel = isArabic ? 'ثقة عالية' : 'High confidence';
      break;
    case 'medium':
      bandLabel = isArabic ? 'ثقة متوسطة' : 'Medium confidence';
      break;
    case 'low':
      bandLabel = isArabic ? 'ثقة مبدئية / أولية' : 'Low confidence';
      break;
  }

  let thresholdLabel = '';
  switch (threshold) {
    case 'mastered':
      thresholdLabel = isArabic ? 'مُتقن' : 'Mastered';
      break;
    case 'needs_review':
      thresholdLabel = isArabic ? 'يحتاج مراجعة' : 'Needs review';
      break;
    case 'learning':
      thresholdLabel = isArabic ? 'قيد التعلم' : 'Learning';
      break;
  }

  const percentageText = `${scorePct}%`;
  const confidencePercentageText = `${confPct}%`;

  // Explicit composite string ensuring percentage is NEVER naked in any display context
  const compositeLabel = `${percentageText} (${bandLabel})`;

  return {
    score: record.score,
    percentageText,
    confidence: record.confidence,
    confidencePercentageText,
    confidenceBand: band,
    confidenceBandLabel: bandLabel,
    threshold,
    thresholdLabel,
    compositeLabel,
    hasEvidence: true,
  };
}
