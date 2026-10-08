/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DayRecord, SchoolDayKey } from '../../types';
import { Badge } from '../common/Badge';
import {
  reconcileDayWithTimetable,
  ReconciliationResult,
  ExtractedDayData,
} from '../../services/reconstruction/dayRecordReconciliation';
import { EditDayRecordModal } from './EditDayRecordModal';
import { VoiceInputControl } from '../voice/VoiceInputControl';
import { VoiceSpeakButton } from '../voice/VoiceSpeakButton';
import {
  Bot,
  Sparkles,
  Send,
  CheckCircle,
  Edit3,
  X,
  AlertTriangle,
  HelpCircle,
  Clock,
  BookOpen,
} from 'lucide-react';

interface DayRecordFlowModalProps {
  onClose: () => void;
}

export const DayRecordFlowModal: React.FC<DayRecordFlowModalProps> = ({ onClose }) => {
  const {
    t,
    language,
    student,
    timetable,
    saveDayRecord,
  } = useApp();
  const isArabic = language === 'ar';

  const [studentInput, setStudentInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'input' | 'neutral_followup' | 'readback_confirmation'>('input');
  const [followUpCount, setFollowUpCount] = useState(0);

  // Extracted proposal state
  const [proposedRecord, setProposedRecord] = useState<DayRecord | null>(null);
  const [reconciliation, setReconciliation] = useState<ReconciliationResult | null>(null);
  const [followUpPrompt, setFollowUpPrompt] = useState<string>('');
  const [followUpResponse, setFollowUpResponse] = useState<string>('');
  const [isManualEditing, setIsManualEditing] = useState(false);

  const studentName = student?.name || (isArabic ? 'يا بطل' : 'Friend');

  // Determine current day of week for Egypt timetable
  const currentDayIndex = new Date().getDay();
  const dayKeyMap: Record<number, SchoolDayKey> = {
    0: 'sunday',
    1: 'monday',
    2: 'tuesday',
    3: 'wednesday',
    4: 'thursday',
  };
  const todayKey = dayKeyMap[currentDayIndex] || 'sunday';
  const todayDate = new Date().toISOString().split('T')[0];

  // Pipeline Step 1 -> Step 4
  const handleProcessInput = async (inputText: string) => {
    const text = (inputText || studentInput).trim();
    if (!text || isProcessing || !student?.id) return;

    setIsProcessing(true);

    try {
      // Step 2 & 3: Send to Gemini via server proxy
      const response = await fetch('/api/reconstruct-day', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentInput: text,
          studentName,
          grade: student.grade || 'Grade 5',
          language,
          todayTimetableSubjects: timetable?.days.find((d) => d.day === todayKey)?.periods.map((p) => p.subject) || [],
        }),
      });

      const extracted: ExtractedDayData = await response.json();

      // Step 4: Pure TypeScript reconciliation with timetable
      const recon = reconcileDayWithTimetable(extracted, timetable, todayKey, language);
      setReconciliation(recon);

      const draftRecord: DayRecord = {
        id: 'dr_' + Date.now(),
        studentId: student.id,
        date: todayDate,
        lessonsCovered: extracted.lessonsCovered,
        homeworkAssigned: extracted.homeworkAssigned,
        notes: extracted.notes || text,
        confirmed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        origin: 'draft',
        discrepancies: recon.discrepancies,
        rawStudentInput: text,
      };

      setProposedRecord(draftRecord);

      // Check failure paths: do we need a neutral follow-up?
      if (recon.neutralFollowUpPrompt && followUpCount < 3) {
        setFollowUpPrompt(recon.neutralFollowUpPrompt);
        setStep('neutral_followup');
      } else {
        setStep('readback_confirmation');
      }
    } catch (err) {
      console.error('Reconstruction error:', err);
      // Safe draft without fabricating unconfirmed lessons
      const fallbackDraft: DayRecord = {
        id: 'dr_' + Date.now(),
        studentId: student.id,
        date: todayDate,
        lessonsCovered: [],
        homeworkAssigned: [],
        notes: text,
        rawStudentInput: text,
        confirmed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        origin: 'draft',
      };
      setProposedRecord(fallbackDraft);
      setStep('readback_confirmation');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle student answering the neutral follow-up question
  const handleFollowUpAnswer = async (answer: string) => {
    if (!proposedRecord || isProcessing) return;
    const newCount = followUpCount + 1;
    setFollowUpCount(newCount);

    const fullDescription = `${proposedRecord.rawStudentInput}. [إجابة الطالب على السؤال]: ${answer}`;

    // If student confirmed change (e.g. "نعم الجدول اتغير" or "العلوم اتلغت")
    if (answer.includes('اتغير') || answer.includes('changed') || answer.includes('اتلغت')) {
      const updated: DayRecord = {
        ...proposedRecord,
        notes: fullDescription,
        discrepancies: {
          ...proposedRecord.discrepancies,
          notes: isArabic ? 'أكد الطالب تغيير جدول الحصص في المدرسة اليوم.' : 'Student confirmed timetable changed at school today.',
        },
      };
      setProposedRecord(updated);
      setStep('readback_confirmation');
      return;
    }

    // Otherwise, re-run reconciliation with the added context or advance to confirmation if limit reached
    if (newCount >= 3) {
      setStep('readback_confirmation');
    } else {
      await handleProcessInput(fullDescription);
    }
  };

  // Step 7: Student confirms Day Record
  const handleConfirmRecord = async () => {
    if (!proposedRecord || !student) return;
    const confirmedRecord: DayRecord = {
      ...proposedRecord,
      studentId: student.id,
      confirmed: true,
      confirmedAt: new Date().toISOString(),
      origin: 'student_confirmed',
    };
    await saveDayRecord(confirmedRecord);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3.5 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full max-h-[92vh] shadow-2xl flex flex-col overflow-hidden my-auto">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/70 dark:bg-slate-900/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  {t.dayRecord.title}
                </h3>
                <Badge variant="ai">AI Reconstruction</Badge>
              </div>
              <span className="text-[10px] text-slate-400">
                {followUpCount > 0 && `${t.dayRecord.followUpCountNotice}: ${followUpCount}/3`}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* STEP 1: FREE-TEXT DESCRIPTION */}
          {step === 'input' && (
            <div className="space-y-4">
              {/* Companion Welcome Speech Bubble */}
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-slate-800 dark:text-slate-200 border border-indigo-100 dark:border-indigo-900/50 leading-relaxed">
                  <p className="font-bold text-indigo-900 dark:text-indigo-200 mb-1">
                    {t.dayRecord.welcomeHomePrompt}
                  </p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    {isArabic
                      ? `احكي لي براحتك يا ${studentName}: إيه الدروس اللي أخدتوها، وهل في واجبات استلمتها لبكره أو الأيام الجاية؟`
                      : `Tell me in your own words ${studentName}: what lessons did you have, and did you receive any homework for tomorrow?`}
                  </p>
                </div>
              </div>

              {/* Free Text Input Area */}
              <div className="space-y-2">
                <textarea
                  rows={3}
                  value={studentInput}
                  onChange={(e) => setStudentInput(e.target.value)}
                  placeholder={t.dayRecord.inputPlaceholder}
                  disabled={isProcessing}
                  className="w-full p-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                />

                <div className="flex items-center gap-2">
                  <VoiceInputControl
                    buttonSize="md"
                    onTranscriptConfirmed={(transcript) => {
                      setStudentInput(transcript);
                      handleProcessInput(transcript);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleProcessInput(studentInput)}
                    disabled={!studentInput.trim() || isProcessing}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold flex items-center justify-center gap-2 shadow-xs transition-all text-xs"
                  >
                    <Send className="w-3.5 h-3.5 rtl:rotate-180" />
                    <span>{isProcessing ? t.dayRecord.reconstructing : t.dayRecord.sendInput}</span>
                  </button>
                </div>
              </div>

              {/* Sample / Test Failure Path Chips */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                  {isArabic ? 'نماذج جاهزة لاختبار مسارات التعافي:' : 'Test Scenarios & Failure Paths:'}
                </span>

                <div className="grid grid-cols-1 gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setStudentInput(t.dayRecord.sampleFullDay);
                      handleProcessInput(t.dayRecord.sampleFullDay);
                    }}
                    className="p-2 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-300 text-left rtl:text-right hover:bg-emerald-100/60 transition-colors"
                  >
                    <span className="font-bold block text-[11px]">✨ {isArabic ? 'وصف مكتمل لليوم والواجبات' : 'Full Day Description'}</span>
                    <span className="text-[10px] opacity-80">{t.dayRecord.sampleFullDay}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setStudentInput(t.dayRecord.sampleContradiction);
                      handleProcessInput(t.dayRecord.sampleContradiction);
                    }}
                    className="p-2 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-300 text-left rtl:text-right hover:bg-amber-100/60 transition-colors"
                  >
                    <span className="font-bold block text-[11px]">⚠️ {isArabic ? 'مسار التعارض مع الجدول (Art بدلاً من Science)' : 'Contradiction Failure Path'}</span>
                    <span className="text-[10px] opacity-80">{t.dayRecord.sampleContradiction}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setStudentInput(t.dayRecord.sampleSilence);
                      handleProcessInput(t.dayRecord.sampleSilence);
                    }}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 text-left rtl:text-right hover:bg-slate-100 transition-colors"
                  >
                    <span className="font-bold block text-[11px]">🤐 {isArabic ? 'مسار النسيان / الصمت («مش فاكر»)' : 'Silence / Amnesia Failure Path'}</span>
                    <span className="text-[10px] opacity-80">{t.dayRecord.sampleSilence}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setStudentInput(t.dayRecord.sampleVague);
                      handleProcessInput(t.dayRecord.sampleVague);
                    }}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 text-left rtl:text-right hover:bg-slate-100 transition-colors"
                  >
                    <span className="font-bold block text-[11px]">🌫️ {isArabic ? 'مسار الغموض («يوم عادي عملنا حاجات»)' : 'Vagueness Failure Path'}</span>
                    <span className="text-[10px] opacity-80">{t.dayRecord.sampleVague}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: NEUTRAL FOLLOW-UP QUESTION */}
          {step === 'neutral_followup' && (
            <div className="space-y-4">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-950 dark:text-amber-100 border border-amber-200/80 dark:border-amber-900/50 leading-relaxed space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>{t.dayRecord.discrepancyTitle}</span>
                  </div>
                  <p className="text-xs font-medium">{followUpPrompt}</p>
                </div>
              </div>

              {/* Quick choices for the follow-up */}
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleFollowUpAnswer(isArabic ? 'نعم الجدول اتغير النهارده في المدرسة' : 'Yes, timetable changed today')}
                  className="px-3 py-1.5 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-100/60 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 text-xs font-semibold hover:bg-amber-200"
                >
                  {isArabic ? 'نعم الجدول اتغير' : 'Yes, timetable changed'}
                </button>
                <button
                  type="button"
                  onClick={() => handleFollowUpAnswer(isArabic ? 'لا افتكرت، كان عندنا علوم وأخدنا درس' : 'No, remembered we had science')}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200"
                >
                  {isArabic ? 'افتكرت مادة الجدول' : 'I remember the timetable class'}
                </button>
                <button
                  type="button"
                  onClick={() => setStep('readback_confirmation')}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-700 text-xs"
                >
                  {isArabic ? 'تخطي والمتابعة' : 'Skip & proceed'}
                </button>
              </div>

              {/* Or type an answer */}
              <div className="flex items-center gap-2 pt-2">
                <VoiceInputControl
                  buttonSize="sm"
                  onTranscriptConfirmed={(transcript) => {
                    setFollowUpResponse(transcript);
                    handleFollowUpAnswer(transcript);
                  }}
                />
                <input
                  type="text"
                  value={followUpResponse}
                  onChange={(e) => setFollowUpResponse(e.target.value)}
                  placeholder={isArabic ? 'اكتب ردك هنا...' : 'Type your answer...'}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                />
                <button
                  type="button"
                  onClick={() => handleFollowUpAnswer(followUpResponse)}
                  disabled={!followUpResponse.trim()}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs"
                >
                  {isArabic ? 'متابعة' : 'Submit'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: NATURAL LANGUAGE READBACK & CONFIRMATION */}
          {step === 'readback_confirmation' && proposedRecord && (
            <div className="space-y-4">
              {/* Natural Language Readback Bubble per spec */}
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/50 leading-relaxed text-slate-800 dark:text-slate-200 flex-1">
                  <div className="flex items-center justify-between gap-1.5 mb-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 dark:text-indigo-200">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{t.dayRecord.readbackTitle}</span>
                    </div>
                    <VoiceSpeakButton
                      text={reconciliation?.naturalLanguageSummary || ''}
                      size="sm"
                    />
                  </div>
                  <p className="text-xs leading-relaxed font-medium">
                    {reconciliation?.naturalLanguageSummary}
                  </p>
                </div>
              </div>

              {/* Summary Card of Draft Record */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500">
                    {t.dayRecord.title} (مسودة قيد التأكيد)
                  </span>
                  <Badge variant="warning">{t.dayRecord.draftBadge}</Badge>
                </div>

                {/* Lessons summary */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">
                    {t.dayRecord.lessonsCovered}
                  </span>
                  {proposedRecord.lessonsCovered.length > 0 ? (
                    proposedRecord.lessonsCovered.map((l, i) => (
                      <div key={i} className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        • {l.subject}: {l.topic || 'شرح وحل تمارين'}
                      </div>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">{t.dayRecord.noLessons}</span>
                  )}
                </div>

                {/* Homework summary */}
                <div className="space-y-1 border-t border-slate-200 dark:border-slate-700/60 pt-2">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">
                    {t.dayRecord.homeworkAssigned}
                  </span>
                  {proposedRecord.homeworkAssigned.length > 0 ? (
                    proposedRecord.homeworkAssigned.map((h, i) => (
                      <div key={i} className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                        • {h.subject}: {h.description} {h.dueDate && `(${h.dueDate})`}
                      </div>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">{t.dayRecord.noHomework}</span>
                  )}
                </div>
              </div>

              {/* Action Buttons: Confirm or Edit */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={handleConfirmRecord}
                  className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{t.dayRecord.confirmRecord}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsManualEditing(true)}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{t.dayRecord.editRecord}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Manual Edit Modal if opened */}
      {isManualEditing && proposedRecord && (
        <EditDayRecordModal
          record={proposedRecord}
          onClose={() => setIsManualEditing(false)}
          onSave={async (updated) => {
            setProposedRecord(updated);
            setIsManualEditing(false);
            await saveDayRecord(updated);
            onClose();
          }}
        />
      )}
    </div>
  );
};
