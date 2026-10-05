/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Mission, TutorModality, TutorResponse } from '../../types';
import { ReelViewer } from './ReelViewer';
import { QuizRunner } from './QuizRunner';
import { HomeworkRunner } from './HomeworkRunner';
import { TeachingSessionModal } from '../teaching/TeachingSessionModal';
import { StageModal } from '../stage/StageModal';
import { curriculumService } from '../../services/curriculum/curriculumService';
import { advanceTutorEscalation, resetTutorState } from '../../services/tutor/tutorEngine';
import { Badge } from '../common/Badge';
import {
  Sparkles,
  Bot,
  HelpCircle,
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';

interface MissionRunnerModalProps {
  mission: Mission;
  onClose: () => void;
}

export const MissionRunnerModal: React.FC<MissionRunnerModalProps> = ({ mission, onClose }) => {
  const { student, language, completeMission, skipMission } = useApp();
  const isAr = language === 'ar';

  const [tutorActive, setTutorActive] = useState(false);
  const [tutorSessionId] = useState(`session_${Date.now()}`);
  const [tutorHistory, setTutorHistory] = useState<TutorResponse[]>([]);
  const [isFlaggedForReview, setIsFlaggedForReview] = useState(false);
  const [selectedCheckAnswers, setSelectedCheckAnswers] = useState<Record<number, string>>({});

  // Trigger Tutor Escalation Step
  const handleTriggerTutor = (modalityOverride?: TutorModality) => {
    if (!student || !mission.conceptId) return;

    const response = advanceTutorEscalation({
      studentId: student.id,
      conceptId: mission.conceptId,
      sessionId: tutorSessionId,
      language,
      manualNextModality: modalityOverride,
    });

    setTutorHistory((prev) => [...prev, response]);
    setTutorActive(true);

    if (response.modality === 'flag_for_review') {
      setIsFlaggedForReview(true);
    }
  };

  const handleCompleteMission = async (score: number) => {
    const modality = mission.type === 'understand_lesson' ? 'reel_check' : 'quiz';
    await completeMission(mission.id, { score, modality });
  };

  const handleSkipMission = async () => {
    await skipMission(mission.id, 'User skipped from runner');
  };

  // Sub-Phase 9.5: "understand_lesson" mission opens Teaching Session directly. The session IS the mission.
  if (mission.type === 'understand_lesson') {
    const targetLessonId =
      mission.lessonId && curriculumService.getLessonById(mission.lessonId)
        ? mission.lessonId
        : mission.subject.includes('عرب')
        ? 'off_ar_u1_l2'
        : mission.subject.toLowerCase().includes('eng')
        ? 'off_en_u1_apple_tree'
        : mission.subject.includes('دراس')
        ? 'off_soc_u1_l2_surface'
        : mission.subject.includes('دين')
        ? 'off_rel_abdurrahman_eid_nasr'
        : mission.subject.includes('خط')
        ? 'off_callig_alif_naskh_ruqaa'
        : 'off_ar_u1_l2';

    // Sub-Phase 11.8: "understand_lesson" mission opens The Stage directly.
    return (
      <StageModal
        lessonId={targetLessonId}
        onClose={onClose}
        onSessionComplete={() => handleCompleteMission(1.0)}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col h-[90vh] max-h-[720px] overflow-hidden relative">
        {/* Main Content: Reel or Quiz or Homework */}
        {!tutorActive ? (
          mission.type === 'homework' ? (
            <HomeworkRunner
              mission={mission}
              onComplete={handleCompleteMission}
              onSkip={handleSkipMission}
              onClose={onClose}
              onAskCompanion={(ctx) => handleTriggerTutor()}
            />
          ) : (
            <QuizRunner
              mission={mission}
              onComplete={handleCompleteMission}
              onSkip={handleSkipMission}
              onExplainDifferently={() => handleTriggerTutor()}
            />
          )
        ) : (
          /* Tutor Escalation Screen */
          <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold">
                    {isAr ? 'المعلم الذكي — سلم التدرج الإيضاحي' : 'AI Tutor — Escalation Ladder'}
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    {isAr ? 'تغيير أسلوب الشرح في كل محاولة' : 'Modality changes on every attempt'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setTutorActive(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Conversation Flow */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {tutorHistory.map((step, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={step.modality === 'flag_for_review' ? 'warning' : 'ai'}>
                      {isAr ? step.modalityLabelAr : step.modalityLabelEn}
                    </Badge>
                    <span className="text-[10px] text-slate-400">
                      {isAr ? `محاولة ${step.state.attemptCount} من ٥` : `Attempt ${step.state.attemptCount} of 5`}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm leading-relaxed shadow-xs">
                    {step.text}

                    {/* If Check Question */}
                    {step.checkQuestion && (
                      <div className="mt-3 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 space-y-2">
                        <span className="font-bold text-indigo-900 dark:text-indigo-200 block text-xs">
                          {step.checkQuestion.question}
                        </span>
                        <div className="space-y-1.5">
                          {step.checkQuestion.options?.map((opt, optIdx) => {
                            const isSelected = selectedCheckAnswers[idx] === opt;
                            const isCorrect = opt === step.checkQuestion?.correctAnswer;
                            return (
                              <button
                                key={optIdx}
                                onClick={() => {
                                  setSelectedCheckAnswers((prev) => ({ ...prev, [idx]: opt }));
                                }}
                                className={`w-full text-left rtl:text-right p-2 rounded-lg text-[11px] border transition-all ${
                                  isSelected
                                    ? isCorrect
                                      ? 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold'
                                      : 'bg-amber-100 dark:bg-amber-950/60 border-amber-500 text-amber-900 dark:text-amber-200'
                                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                                }`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                        {selectedCheckAnswers[idx] && step.checkQuestion.explanation && (
                          <div className="mt-2 p-2 rounded-lg bg-white/90 dark:bg-slate-900/90 text-[11px] text-slate-700 dark:text-slate-300 border border-indigo-100 dark:border-indigo-900">
                            💡 {step.checkQuestion.explanation}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Ladder Actions */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
              {!isFlaggedForReview ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleTriggerTutor()}
                    className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>{isAr ? 'اشرح بطريقة تانية (المحاولة التالية)' : 'Explain differently (Next step)'}</span>
                  </button>
                  <button
                    onClick={() => setTutorActive(false)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold"
                  >
                    {isAr ? 'العودة للمهمة' : 'Back to Mission'}
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-[11px] text-amber-800 dark:text-amber-200 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                    <span>
                      {isAr
                        ? 'تم تثبيت المفهوم للمراجعة اللاحقة لمنع الضغط الذهني.'
                        : 'Concept flagged for later review to prevent stress.'}
                    </span>
                  </div>
                  <button
                    onClick={handleSkipMission}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <span>{isAr ? 'الانتقال للمهمة التالية بهدوء' : 'Move to Next Mission'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
