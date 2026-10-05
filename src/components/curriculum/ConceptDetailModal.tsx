/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FlatCurriculumConcept,
  MasteryRecord,
  EvidenceCorrectness,
  EvidenceIndependence,
  EvidenceModality,
} from '../../types';
import { useApp } from '../../context/AppContext';
import { formatMasteryView } from '../../services/mastery/masteryEngine';
import { EvidenceLogViewer } from '../mastery/EvidenceLogViewer';
import { Badge } from '../common/Badge';
import { SaveLikeButton } from '../collections/SaveLikeButton';
import {
  X,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Layers,
  ChevronRight,
  TrendingDown,
  RotateCcw,
  PlusCircle,
  HelpCircle,
  BarChart3,
  Play,
} from 'lucide-react';

interface ConceptDetailModalProps {
  concept: FlatCurriculumConcept;
  onClose: () => void;
}

export const ConceptDetailModal: React.FC<ConceptDetailModalProps> = ({ concept, onClose }) => {
  const {
    t,
    language,
    settings,
    getMasteryForConcept,
    recordEvidence,
    simulateDecayDays,
    resetSimulatedDecay,
    toggleShowEvidenceLog,
    triggerManualReview,
  } = useApp();

  const isAr = language === 'ar';
  const masteryRecord = getMasteryForConcept(concept.id);
  const masteryView = formatMasteryView(masteryRecord, language);

  // Evidence simulation form state
  const [correctness, setCorrectness] = useState<EvidenceCorrectness>('full');
  const [difficulty, setDifficulty] = useState<number>(0.5);
  const [independence, setIndependence] = useState<EvidenceIndependence>('unassisted');
  const [modality, setModality] = useState<EvidenceModality>('quiz');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [localShowEvidenceLog, setLocalShowEvidenceLog] = useState<boolean>(
    settings.showEvidenceLog ?? false
  );

  const handleApplyEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await recordEvidence(concept.id, {
        correctness,
        difficulty,
        independence,
        modality,
        notes: notes.trim() || undefined,
      });
      setNotes('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleLog = async () => {
    const nextVal = !localShowEvidenceLog;
    setLocalShowEvidenceLog(nextVal);
    await toggleShowEvidenceLog(nextVal);
  };

  // Determine visual badge colors for confidence band & status
  const getBandBadgeClass = () => {
    switch (masteryView.confidenceBand) {
      case 'high':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
      case 'medium':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300 dark:border-amber-800';
      case 'low':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700';
    }
  };

  const getStatusBadgeClass = () => {
    switch (masteryView.threshold) {
      case 'mastered':
        return 'bg-emerald-500 text-white';
      case 'needs_review':
        return 'bg-rose-500 text-white';
      case 'learning':
        return 'bg-amber-500 text-white';
      default:
        return 'bg-slate-400 text-white';
    }
  };

  const formattedLastUpdated = masteryRecord?.lastUpdated
    ? new Date(masteryRecord.lastUpdated).toLocaleString(isAr ? 'ar-EG' : 'en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : t.curriculum.neverPracticed;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-lg max-h-[92vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between bg-slate-50 dark:bg-slate-800/50">
          <div className="space-y-1 pr-6 rtl:pr-0 rtl:pl-6">
            {/* Hierarchy trail */}
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
              <span>{isAr ? concept.subjectNameAr : concept.subjectNameEn}</span>
              <ChevronRight className="w-3 h-3 text-slate-400 rtl:rotate-180" />
              <span>{isAr ? concept.unitNameAr : concept.unitNameEn}</span>
              <ChevronRight className="w-3 h-3 text-slate-400 rtl:rotate-180" />
              <span>{isAr ? concept.lessonNameAr : concept.lessonNameEn}</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                {isAr ? concept.nameAr : concept.nameEn}
              </h3>
              {/* Mandatory Origin Badge */}
              <Badge variant="demo" size="sm">
                origin: {concept.origin}
              </Badge>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {isAr ? concept.descriptionAr : concept.descriptionEn}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Mastery Card - Probabilistic with NEVER naked percentage */}
          <div className="p-4 rounded-xl bg-linear-to-br from-indigo-50/70 to-slate-50 dark:from-slate-800 dark:to-slate-800/80 border border-indigo-100 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-xs ${getStatusBadgeClass()}`}>
                  {masteryView.thresholdLabel}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getBandBadgeClass()}`}
                >
                  {masteryView.confidenceBandLabel}
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                {masteryRecord?.evidenceCount ?? 0} {isAr ? 'أدلة' : 'evidence'}
              </span>
            </div>

            {/* Score & Band Display - Enforcing No Naked Percentage */}
            <div className="flex items-baseline justify-between border-y border-indigo-100/60 dark:border-slate-700/60 py-2.5">
              <div>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
                  {t.curriculum.scoreLabel}
                </span>
                <div className="text-2xl font-black text-slate-900 dark:text-white flex items-baseline gap-2">
                  <span>{masteryView.compositeLabel}</span>
                </div>
              </div>
              <div className="text-right rtl:text-left text-xs font-mono text-slate-500 dark:text-slate-400">
                <div>
                  <span className="text-slate-400">{isAr ? 'يقين احتمالي:' : 'Confidence:'} </span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    {masteryRecord ? `${(masteryRecord.confidence * 100).toFixed(0)}%` : '0%'}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400">
                  {isAr ? 'حد أقصى: 95%' : 'Ceiling: 95%'}
                </div>
              </div>
            </div>

            {/* Timestamps & Decay note */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{t.curriculum.lastPracticedLabel}: {formattedLastUpdated}</span>
              </span>
              {settings.simulatedDaysOffset && settings.simulatedDaysOffset > 0 ? (
                <span className="text-amber-600 dark:text-amber-400 font-bold font-mono text-[10px]">
                  +{settings.simulatedDaysOffset}d {isAr ? 'تلاشي نشط' : 'decay active'}
                </span>
              ) : null}
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed bg-white/60 dark:bg-slate-900/40 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {t.curriculum.nakedPercentageNotice}
              </span>{' '}
              {t.curriculum.decayWarning}
            </p>

            {/* Phase 7 Quick Actions: Review This Now & Save to Collections */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-200/50 dark:border-slate-700/50">
              <button
                type="button"
                onClick={() => {
                  triggerManualReview(concept.id);
                  onClose();
                }}
                className="py-1.5 px-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs active:scale-98 transition-all flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isAr ? 'راجع هذا المفهوم الآن' : 'Review this now'}</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 font-medium">
                  {isAr ? 'حفظ / إعجاب:' : 'Save / Like:'}
                </span>
                <SaveLikeButton
                  sourceId={concept.id}
                  type="concept"
                  title={isAr ? concept.nameAr : concept.nameEn}
                  subject={isAr ? concept.subjectNameAr : concept.subjectNameEn}
                  snippet={isAr ? concept.descriptionAr : concept.descriptionEn}
                  size="md"
                />
              </div>
            </div>
          </div>

          {/* Time Decay Simulation Controls */}
          <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-200">
                <TrendingDown className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>{t.curriculum.decaySimulatorTitle}</span>
              </div>
              <span className="text-[10px] font-mono text-amber-700 dark:text-amber-300">
                {settings.simulatedDaysOffset || 0} {isAr ? 'أيام ممررة' : 'days elapsed'}
              </span>
            </div>
            <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80">
              {t.curriculum.decaySimulatorDesc}
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => simulateDecayDays(7)}
                className="flex-1 py-1.5 px-2 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors text-center"
              >
                {t.curriculum.simulateDaysBtn}
              </button>
              <button
                type="button"
                onClick={() => simulateDecayDays(14)}
                className="flex-1 py-1.5 px-2 rounded-lg text-xs font-bold bg-amber-700 hover:bg-amber-800 text-white shadow-xs transition-colors text-center"
              >
                {t.curriculum.simulate14DaysBtn}
              </button>
              {(settings.simulatedDaysOffset || 0) > 0 && (
                <button
                  type="button"
                  onClick={resetSimulatedDecay}
                  title={t.curriculum.resetDecayBtn}
                  className="py-1.5 px-2.5 rounded-lg text-xs font-bold bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 transition-colors flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{isAr ? 'تصفير' : 'Reset'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Evidence Simulation Tool (Interactive Model Tester) */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <PlusCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>{t.curriculum.simEvidenceTitle}</span>
              </h4>
              <Badge variant="demo" size="sm">tester</Badge>
            </div>

            <form onSubmit={handleApplyEvidence} className="space-y-3">
              {/* Row 1: Correctness & Independence */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                    {t.curriculum.correctnessLabel}
                  </label>
                  <select
                    value={correctness}
                    onChange={(e) => setCorrectness(e.target.value as EvidenceCorrectness)}
                    className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="full">{t.curriculum.correctnessFull}</option>
                    <option value="partial">{t.curriculum.correctnessPartial}</option>
                    <option value="wrong">{t.curriculum.correctnessWrong}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                    {t.curriculum.independenceLabel}
                  </label>
                  <select
                    value={independence}
                    onChange={(e) => setIndependence(e.target.value as EvidenceIndependence)}
                    className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="unassisted">{t.curriculum.independenceUnassisted}</option>
                    <option value="hinted">{t.curriculum.independenceHinted}</option>
                    <option value="revealed">{t.curriculum.independenceRevealed}</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Difficulty & Modality */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                    {t.curriculum.difficultyLabel} ({difficulty.toFixed(2)})
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(parseFloat(e.target.value))}
                    className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="0.2">{t.curriculum.difficultyEasy}</option>
                    <option value="0.5">{t.curriculum.difficultyMedium}</option>
                    <option value="0.85">{t.curriculum.difficultyHard}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                    {t.curriculum.modalityLabel}
                  </label>
                  <select
                    value={modality}
                    onChange={(e) => setModality(e.target.value as EvidenceModality)}
                    className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="quiz">{t.curriculum.modalityQuiz}</option>
                    <option value="homework">{t.curriculum.modalityHomework}</option>
                    <option value="game">{t.curriculum.modalityGame}</option>
                    <option value="reel_check">{t.curriculum.modalityReelCheck}</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-98 shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{t.curriculum.applyEvidenceButton}</span>
              </button>
            </form>
          </div>

          {/* Evidence Log Viewer Toggle / Accordion */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-3">
            <div className="flex items-center justify-between mb-2">
              <button
                type="button"
                onClick={handleToggleLog}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>
                  {localShowEvidenceLog
                    ? isAr ? 'إخفاء سجل الأوزان والأدلة' : 'Hide Evidence Log'
                    : isAr ? 'عرض سجل الأوزان والأدلة التفصيلي' : 'Show Detailed Evidence Log'}
                </span>
              </button>
              <span className="text-[10px] text-slate-400">
                {masteryRecord?.evidenceLog.length ?? 0} {isAr ? 'مدخلات' : 'entries'}
              </span>
            </div>

            {localShowEvidenceLog && (
              <EvidenceLogViewer evidenceLog={masteryRecord?.evidenceLog || []} />
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="py-1.5 px-4 rounded-xl text-xs font-bold bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-100 transition-colors"
          >
            {t.common.close}
          </button>
        </div>
      </div>
    </div>
  );
};
