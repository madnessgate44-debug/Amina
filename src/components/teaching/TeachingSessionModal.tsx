/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { TeachingSession, TutorTurn, OfficialCurriculumLesson } from '../../types/teachingSession';
import { curriculumService } from '../../services/curriculum/curriculumService';
import { teachingSessionEngine } from '../../services/teaching/teachingSession';
import { storageService } from '../../services/storage';
import { VisualRenderer } from '../../services/visuals/visualRenderer';
import { VoiceInputControl } from '../voice/VoiceInputControl';
import { VoiceSpeakButton } from '../voice/VoiceSpeakButton';
import { Badge } from '../common/Badge';
import {
  X,
  Bot,
  Sparkles,
  Send,
  BookOpen,
  Image as ImageIcon,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  PauseCircle,
  Lightbulb,
} from 'lucide-react';

interface TeachingSessionModalProps {
  lessonId: string;
  onClose: () => void;
  onSessionComplete?: () => void;
}

export const TeachingSessionModal: React.FC<TeachingSessionModalProps> = ({
  lessonId,
  onClose,
  onSessionComplete,
}) => {
  const { language, student, recordEvidence, showToast } = useApp();
  const isAr = language === 'ar';

  const [lesson, setLesson] = useState<OfficialCurriculumLesson | null>(null);
  const [session, setSession] = useState<TeachingSession | null>(null);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showVisualPanel, setShowVisualPanel] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize or resume session on mount
  useEffect(() => {
    async function init() {
      const foundLesson = curriculumService.getLessonById(lessonId);
      if (!foundLesson) return;
      setLesson(foundLesson);

      if (!student?.id) return;
      const studentId = student.id;
      const existingSessions = await storageService.getTeachingSessionsForStudent(studentId);
      const existing = existingSessions.find(
        (s) => s.lessonId === lessonId && s.status === 'in_progress'
      );

      const { session: initializedSession } = teachingSessionEngine.initializeSession({
        studentId,
        lessonId,
        existingSession: existing || null,
        language: isAr ? 'ar' : 'en',
      });

      setSession(initializedSession);
      await storageService.saveTeachingSession(initializedSession);
    }

    init();
  }, [lessonId, student?.id, isAr]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session?.turnHistory.length]);

  if (!lesson || !session) {
    return null;
  }

  const currentConcept =
    lesson.concepts[session.currentConceptIndex] || lesson.concepts[0];

  const handleSendResponse = async (text?: string, isAudio = false) => {
    const toSend = (text !== undefined ? text : inputText).trim();
    if (!toSend || isProcessing) return;

    setInputText('');
    setIsProcessing(true);

    try {
      const result = teachingSessionEngine.advanceSession({
        session,
        studentInput: toSend,
        isAudio,
        language: isAr ? 'ar' : 'en',
      });

      setSession(result.session);
      await storageService.saveTeachingSession(result.session);

      // Record mastery if generated (invisible to student in-session)
      if (result.masteryUpdate) {
        await recordEvidence(result.masteryUpdate.conceptId, {
          correctness: result.masteryUpdate.correctness,
          difficulty: 0.5,
          independence: result.masteryUpdate.independence,
          modality: result.masteryUpdate.modality,
          notes: `Teaching Session: ${lesson.titleAr} (Concept ${session.currentConceptIndex + 1})`,
        });
      }

      if (result.isSessionCompleted) {
        showToast(
          isAr
            ? `مبارك يا بطل! أتممت جلسة تعليم درس «${lesson.titleAr}» بالكامل!`
            : `Hooray! You completed the full teaching session for "${lesson.titleEn}"!`
        );
        onSessionComplete?.();
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRequestVisual = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      const result = teachingSessionEngine.advanceSession({
        session,
        forceVisual: true,
        language: isAr ? 'ar' : 'en',
      });

      setSession(result.session);
      await storageService.saveTeachingSession(result.session);
      setShowVisualPanel(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePauseSession = async () => {
    if (session) {
      const paused: TeachingSession = {
        ...session,
        status: 'paused',
        lastActiveAt: new Date().toISOString(),
      };
      await storageService.saveTeachingSession(paused);
      showToast(
        isAr
          ? 'تم حفظ تقدم الجلسة بنجاح، يمكنك استئنافها في أي وقت غداً!'
          : 'Session paused and saved! You can pick it up anytime tomorrow.'
      );
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full h-[92vh] max-h-[850px] shadow-2xl flex flex-col overflow-hidden my-auto">
        {/* Header: Book Source, Lesson Title & Concept Progress */}
        <div className="p-3 sm:p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100">
                  {isAr ? lesson.titleAr : lesson.titleEn}
                </h3>
                <Badge variant="official" size="sm">
                  {isAr ? 'كتاب الوزارة الرسمي' : 'Official Ministry Book'}
                </Badge>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {isAr ? lesson.sourceRef.bookAr : lesson.sourceRef.bookEn}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            {/* Step / Concept Progress indicator */}
            <div className="text-right rtl:text-left text-[11px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-xl border border-indigo-200 dark:border-indigo-800">
              {isAr
                ? `المفهوم ${session.currentConceptIndex + 1} من ${session.totalConcepts}`
                : `Concept ${session.currentConceptIndex + 1} of ${session.totalConcepts}`}
            </div>

            <button
              onClick={handlePauseSession}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={isAr ? 'إيقاف مؤقت وحفظ' : 'Pause and Save'}
              aria-label={isAr ? 'إيقاف مؤقت وحفظ' : 'Pause and Save'}
            >
              <PauseCircle className="w-5 h-5" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={isAr ? 'إغلاق' : 'Close'}
              aria-label={isAr ? 'إغلاق' : 'Close'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Concept Step Banner */}
        <div className="px-4 py-2 bg-indigo-50/60 dark:bg-indigo-950/30 border-b border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between text-[11px] text-indigo-900 dark:text-indigo-200 shrink-0">
          <div className="flex items-center gap-1.5 font-bold">
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
            <span>
              {isAr ? currentConcept?.titleAr : currentConcept?.titleEn}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {session.currentStep === 'explain_back' && (
              <span className="animate-bounce inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 font-black text-[10px]">
                <Sparkles className="w-3 h-3 text-amber-600" />
                {isAr ? 'الآن دورك لتشرح لي!' : 'Now you teach me!'}
              </span>
            )}
            <button
              onClick={handleRequestVisual}
              className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>{isAr ? 'عرض الرسم التوضيحي' : 'Show Visual'}</span>
            </button>
          </div>
        </div>

        {/* Scrollable Dialogue Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs sm:text-sm">
          {session.turnHistory.map((turn, idx) => {
            const isTutor = turn.role === 'tutor';
            return (
              <div
                key={turn.id || idx}
                className={`flex flex-col space-y-1.5 ${
                  isTutor ? 'items-start' : 'items-end'
                }`}
              >
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-semibold px-1">
                  <span>
                    {isTutor
                      ? isAr
                        ? 'الرفيق المعلم'
                        : 'Your Tutor'
                      : student?.name || (isAr ? 'أنت' : 'You')}
                  </span>
                  {turn.sourceRef && isTutor && (
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">
                      • {turn.sourceRef.bookAr}
                    </span>
                  )}
                </div>

                <div
                  className={`max-w-[88%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                    isTutor
                      ? turn.isExplainBack
                        ? 'bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 text-slate-900 dark:text-slate-100'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-xs rtl:rounded-tr-xs'
                      : 'bg-indigo-600 text-white rounded-tr-xs rtl:rounded-tl-xs shadow-xs'
                  }`}
                >
                  <p>{turn.text}</p>

                  {/* Inline Visual if turn provided one */}
                  {turn.visualData && (
                    <div className="mt-3">
                      <VisualRenderer visual={turn.visualData} language={language} />
                    </div>
                  )}

                  {/* Voice speak button for tutor message */}
                  {isTutor && (
                    <div className="mt-2 pt-1 border-t border-slate-200/50 dark:border-slate-700/50 flex justify-end">
                      <VoiceSpeakButton
                        text={turn.text}
                        size="sm"
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Active Visual Drawer if opened on-demand */}
          {session.activeVisual && showVisualPanel && (
            <div className="my-3">
              <VisualRenderer
                visual={session.activeVisual}
                language={language}
              />
            </div>
          )}

          <div ref={scrollRef} />
        </div>

        {/* Explain-Back Highlight Helper */}
        {session.currentStep === 'explain_back' && (
          <div className="px-4 py-2 bg-amber-50 dark:bg-amber-950/60 border-t border-amber-200 dark:border-amber-800 text-[11px] text-amber-900 dark:text-amber-200 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              {isAr
                ? 'تذكر: اشرح الفكرة بأسلوبك وبكلماتك أنت وكأنك المعلم! هذا يثبت الفهم في ذاكرتك.'
                : 'Tip: Explain it in your own words as the teacher! This locks the concept permanently into memory.'}
            </span>
          </div>
        )}

        {/* Input Bar: Voice + Text */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendResponse();
            }}
            className="flex items-center gap-2"
          >
            <VoiceInputControl
              buttonSize="md"
              onTranscriptConfirmed={(text) => handleSendResponse(text, true)}
              onFallbackToText={() => inputRef.current?.focus()}
            />

            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                session.currentStep === 'explain_back'
                  ? isAr
                    ? 'اكتب شرحك هنا أو اضغط المايكروفون وتحدث بحرية...'
                    : 'Type your explanation or use the microphone...'
                  : isAr
                  ? 'اكتب إجابتك أو سؤالك للمعلم...'
                  : 'Type your answer or question for the tutor...'
              }
              disabled={isProcessing}
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={!inputText.trim() || isProcessing}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center shrink-0"
              aria-label={isAr ? 'إرسال' : 'Send'}
            >
              <Send className="w-4 h-4 rtl:rotate-180" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
