/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { curriculumService } from '../../services/curriculum/curriculumService';
import { FlatCurriculumConcept, MasteryThreshold, ConfidenceBand } from '../../types';
import { useApp } from '../../context/AppContext';
import { formatMasteryView } from '../../services/mastery/masteryEngine';
import { Badge } from '../common/Badge';
import { ConceptDetailModal } from '../curriculum/ConceptDetailModal';
import {
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Layers,
  Sparkles,
  ChevronDown,
  ChevronRight,
  TrendingDown,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  BarChart2,
} from 'lucide-react';

export const KnowledgeMap: React.FC = () => {
  const {
    t,
    language,
    settings,
    masteryRecords,
    simulateDecayDays,
    resetSimulatedDecay,
  } = useApp();
  const isAr = language === 'ar';
  const isFrench = language === 'fr';

  const flatConcepts = useMemo(() => curriculumService.getFlatConcepts(), []);
  const allSubjects = useMemo(() => curriculumService.getSubjectsSummary(), []);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeConcept, setActiveConcept] = useState<FlatCurriculumConcept | null>(null);

  // Calculate statistics across all authoritative concepts
  const stats = useMemo(() => {
    let masteredCount = 0;
    let learningCount = 0;
    let needsReviewCount = 0;
    let unstartedCount = 0;

    for (const c of flatConcepts) {
      const rec = masteryRecords[c.id];
      const view = formatMasteryView(rec, language);
      if (!view.hasEvidence) unstartedCount++;
      else if (view.threshold === 'mastered') masteredCount++;
      else if (view.threshold === 'needs_review') needsReviewCount++;
      else if (view.threshold === 'learning') learningCount++;
    }

    return {
      total: flatConcepts.length,
      masteredCount,
      learningCount,
      needsReviewCount,
      unstartedCount,
    };
  }, [flatConcepts, masteryRecords, language]);

  // Filter subjects
  const filteredSubjects = useMemo(() => {
    if (selectedSubjectId === 'all') return allSubjects;
    return allSubjects.filter((s) => s.subjectId === selectedSubjectId);
  }, [allSubjects, selectedSubjectId]);

  return (
    <div className="flex-1 flex flex-col p-4 space-y-4 max-w-lg mx-auto w-full pb-24">
      {/* Knowledge Map Header */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>{t.curriculum.knowledgeMapTitle}</span>
                <Badge variant="official" size="sm">
                  {isAr ? 'المنهج الرسمي' : 'Official Curriculum'}
                </Badge>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isAr
                  ? 'نموذج إتقان احتمالي ذكي يرفض النسب المجردة ويتتبع التلاشي الزمني'
                  : 'Probabilistic mastery engine with confidence bands and decay tracking'}
              </p>
            </div>
          </div>
        </div>

        {/* 4 Summary Stat Cards */}
        <div className="grid grid-cols-4 gap-2 pt-1">
          <div
            onClick={() => setStatusFilter(statusFilter === 'mastered' ? 'all' : 'mastered')}
            className={`p-2 rounded-xl text-center border cursor-pointer transition-all ${
              statusFilter === 'mastered'
                ? 'ring-2 ring-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300'
                : 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200/70 dark:border-emerald-900/60'
            }`}
          >
            <span className="text-lg font-black text-emerald-700 dark:text-emerald-300 block font-mono">
              {stats.masteredCount}
            </span>
            <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-200">
              {t.curriculum.masteredBadge}
            </span>
          </div>

          <div
            onClick={() => setStatusFilter(statusFilter === 'learning' ? 'all' : 'learning')}
            className={`p-2 rounded-xl text-center border cursor-pointer transition-all ${
              statusFilter === 'learning'
                ? 'ring-2 ring-amber-500 bg-amber-50 dark:bg-amber-950/60 border-amber-300'
                : 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200/70 dark:border-amber-900/60'
            }`}
          >
            <span className="text-lg font-black text-amber-700 dark:text-amber-300 block font-mono">
              {stats.learningCount}
            </span>
            <span className="text-[10px] font-bold text-amber-800 dark:text-amber-200">
              {t.curriculum.learningBadge}
            </span>
          </div>

          <div
            onClick={() => setStatusFilter(statusFilter === 'needs_review' ? 'all' : 'needs_review')}
            className={`p-2 rounded-xl text-center border cursor-pointer transition-all ${
              statusFilter === 'needs_review'
                ? 'ring-2 ring-rose-500 bg-rose-50 dark:bg-rose-950/60 border-rose-300'
                : 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-200/70 dark:border-rose-900/60'
            }`}
          >
            <span className="text-lg font-black text-rose-700 dark:text-rose-300 block font-mono">
              {stats.needsReviewCount}
            </span>
            <span className="text-[10px] font-bold text-rose-800 dark:text-rose-200">
              {t.curriculum.needsReviewBadge}
            </span>
          </div>

          <div
            onClick={() => setStatusFilter(statusFilter === 'unstarted' ? 'all' : 'unstarted')}
            className={`p-2 rounded-xl text-center border cursor-pointer transition-all ${
              statusFilter === 'unstarted'
                ? 'ring-2 ring-slate-500 bg-slate-100 dark:bg-slate-800 border-slate-400'
                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
            }`}
          >
            <span className="text-lg font-black text-slate-700 dark:text-slate-300 block font-mono">
              {stats.unstartedCount}
            </span>
            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
              {isAr ? 'لم يبدأ' : 'Unstarted'}
            </span>
          </div>
        </div>

        {/* Model Anti-Slop Rule Card */}
        <p className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/40 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-800 leading-relaxed">
          <span className="font-bold text-slate-700 dark:text-slate-200">
            {isAr ? 'مبدأ الشفافية الاحتمالية:' : 'Probabilistic Discipline:'}
          </span>{' '}
          {isAr
            ? 'لا يعرض النظام نسبة مئوية مجردة أبداً. الدرجة العالية ذات اليقين المنخفض لا تُصنف كمتقن، وتنجرف نحو 0.5 بمرور الوقت دون مراجعة.'
            : 'The UI never shows a naked percentage. High score with low confidence is NOT mastered and decays toward 0.5 without review.'}
        </p>
      </div>

      {/* Time Decay Simulator Header Banner */}
      <div className="p-3.5 rounded-2xl bg-amber-500/10 dark:bg-amber-950/30 border border-amber-300/80 dark:border-amber-800/60 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-200">
            <TrendingDown className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>{t.curriculum.decaySimulatorTitle}</span>
          </div>
          <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700">
            {settings.simulatedDaysOffset || 0} {isAr ? 'أيام ممررة' : 'days elapsed'}
          </span>
        </div>
        <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80">
          {isAr
            ? 'اختبر التلاشي الزمني وتراجع اليقين والدرجة نحو 0.5 عند غياب الممارسة:'
            : 'Simulate passing days to watch score decay toward 0.5 and confidence erode:'}
        </p>
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => simulateDecayDays(7)}
            className="flex-1 py-1.5 px-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors"
          >
            {t.curriculum.simulateDaysBtn}
          </button>
          <button
            type="button"
            onClick={() => simulateDecayDays(14)}
            className="flex-1 py-1.5 px-2 rounded-xl text-xs font-bold bg-amber-700 hover:bg-amber-800 text-white shadow-xs transition-colors"
          >
            {t.curriculum.simulate14DaysBtn}
          </button>
          {(settings.simulatedDaysOffset || 0) > 0 && (
            <button
              type="button"
              onClick={resetSimulatedDecay}
              className="py-1.5 px-3 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{isAr ? 'تصفير' : 'Reset'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter by Subject */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => setSelectedSubjectId('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
            selectedSubjectId === 'all'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          {t.curriculum.allSubjects}
        </button>
        {allSubjects.map((s) => (
          <button
            key={s.subjectId}
            type="button"
            onClick={() => setSelectedSubjectId(s.subjectId)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              selectedSubjectId === s.subjectId
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <span>{s.icon}</span>
            <span>{isAr ? s.subjectNameAr : isFrench ? (s.subjectNameFr || s.subjectNameEn) : s.subjectNameEn}</span>
          </button>
        ))}
      </div>

      {/* Hierarchical Knowledge Tree */}
      <div className="space-y-4">
        {filteredSubjects.map((subject) => {
          const units = curriculumService.getUnitsForSubject(subject.subjectId);
          const subjectConceptsCount = flatConcepts.filter((c) => c.subjectId === subject.subjectId).length;
          return (
            <div
              key={subject.subjectId}
              className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden"
            >
              {/* Subject Banner */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">{subject.icon}</span>
                  <h3 className="text-xs font-black text-slate-900 dark:text-slate-100">
                    {isAr ? subject.subjectNameAr : isFrench ? (subject.subjectNameFr || subject.subjectNameEn) : subject.subjectNameEn}
                  </h3>
                  <Badge variant="official" size="sm">
                    {isAr ? 'منهج رسمي' : 'Official'}
                  </Badge>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  {subjectConceptsCount} {isAr ? 'مفهوماً' : 'concepts'}
                </span>
              </div>

              {/* Units & Concepts Grid */}
              <div className="p-3 space-y-4">
                {units.map((unit) => (
                  <div key={unit.unitNumber} className="space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-1">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                        {isAr ? unit.unitNameAr : isFrench ? (unit.unitNameFr || unit.unitNameEn) : unit.unitNameEn}
                      </span>
                      <Badge variant="official" size="sm">
                        {isAr ? `الوحدة ${unit.unitNumber}` : `Unit ${unit.unitNumber}`}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {unit.lessons.flatMap((lesson) =>
                        lesson.concepts.map((concept) => {
                          const flat: FlatCurriculumConcept = {
                            id: concept.id,
                            parentId: lesson.id,
                            subjectId: subject.subjectId,
                            subjectNameAr: subject.subjectNameAr,
                            subjectNameEn: subject.subjectNameEn,
                            unitId: `unit_${subject.subjectId}_${unit.unitNumber}`,
                            unitNameAr: unit.unitNameAr,
                            unitNameEn: unit.unitNameEn,
                            lessonId: lesson.id,
                            lessonNameAr: lesson.titleAr,
                            lessonNameEn: lesson.titleEn,
                            nameAr: concept.titleAr,
                            nameEn: concept.titleEn,
                            descriptionAr: concept.sourceText,
                            descriptionEn: concept.sourceText,
                            origin: 'official',
                          };

                        const record = masteryRecords[concept.id];
                        const view = formatMasteryView(record, language);

                        // If filter is active and doesn't match, skip
                        if (statusFilter !== 'all') {
                          if (statusFilter === 'unstarted' && view.hasEvidence) return null;
                          if (statusFilter !== 'unstarted' && (!view.hasEvidence || view.threshold !== statusFilter)) return null;
                        }

                        // Determine visual style according to confidence band and status
                        const getVisualStyles = () => {
                          if (!view.hasEvidence) {
                            return {
                              container:
                                'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 border-dashed text-slate-500',
                              badge:
                                'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200',
                              indicator: 'bg-slate-300 dark:bg-slate-600',
                            };
                          }
                          if (view.confidenceBand === 'high') {
                            return {
                              container:
                                'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 hover:border-emerald-500 shadow-2xs',
                              badge:
                                'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300',
                              indicator: 'bg-emerald-500',
                            };
                          }
                          if (view.confidenceBand === 'medium') {
                            return {
                              container:
                                'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800 hover:border-amber-500 shadow-2xs',
                              badge:
                                'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300',
                              indicator: 'bg-amber-500',
                            };
                          }
                          // Low confidence
                          return {
                            container:
                              'bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-800 border-dashed hover:border-indigo-400',
                            badge:
                              'bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border-indigo-200',
                            indicator: 'bg-indigo-400',
                          };
                        };

                        const styles = getVisualStyles();

                        return (
                          <div
                            key={concept.id}
                            onClick={() => setActiveConcept(flat)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => e.key === 'Enter' && setActiveConcept(flat)}
                            className={`p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 hover:scale-[1.01] ${styles.container}`}
                          >
                            <div className="flex items-start justify-between gap-1.5">
                              <div className="space-y-0.5 min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span
                                    className={`w-2 h-2 rounded-full shrink-0 ${styles.indicator}`}
                                  />
                                  <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                                    {isAr ? concept.titleAr : concept.titleEn}
                                  </h5>
                                  <Badge variant="official" size="sm">
                                    {isAr ? 'رسمي' : 'Official'}
                                  </Badge>
                                </div>
                                <span className="text-[10px] text-slate-400 truncate block">
                                  {isAr ? lesson.titleAr : lesson.titleEn}
                                </span>
                              </div>
                            </div>

                            {/* Probabilistic Display with Confidence Band */}
                            <div className="flex items-center justify-between border-t border-slate-200/50 dark:border-slate-700/50 pt-1.5 text-[10px]">
                              <span
                                className={`px-2 py-0.5 rounded-md font-bold border ${styles.badge}`}
                              >
                                {view.compositeLabel}
                              </span>

                              <div className="text-[9px] font-mono text-slate-400 flex items-center gap-1">
                                <span>{view.thresholdLabel}</span>
                                <span>•</span>
                                <span>{record?.evidenceCount ?? 0} {isAr ? 'أدلة' : 'ev'}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
      </div>

      {/* Concept Detail Modal */}
      {activeConcept && (
        <ConceptDetailModal
          concept={activeConcept}
          onClose={() => setActiveConcept(null)}
        />
      )}
    </div>
  );
};
