/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Mission,
  HomeworkItem,
  HomeworkQuestion,
  HomeworkSubmission,
  PhotoEvaluationResult,
  EvidenceIndependence,
  EvidenceCorrectness,
} from '../../types';
import {
  createHomeworkItemFromDayRecord,
  evaluateStudentAnswer,
  getHintFirstGuidance,
  generateSimilarPracticeQuestion,
} from '../../services/homework/homeworkGenerator';
import { storageService } from '../../services/storage';
import { voiceService } from '../../services/voice/voiceService';
import { costLatencyService } from '../../services/telemetry/costLatencyService';
import { Badge } from '../common/Badge';
import {
  Camera,
  Upload,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Lightbulb,
  Eye,
  RefreshCw,
  Trash2,
  Mic,
  MicOff,
  Send,
  ArrowRight,
  ArrowLeft,
  X,
  Sparkles,
  Info,
  Check,
  AlertTriangle,
  RotateCcw,
  ShieldAlert,
} from 'lucide-react';

interface HomeworkRunnerProps {
  mission: Mission;
  onComplete: (score: number) => void;
  onSkip: () => void;
  onClose: () => void;
  onAskCompanion?: (mistakeContext: string) => void;
}

export const HomeworkRunner: React.FC<HomeworkRunnerProps> = ({
  mission,
  onComplete,
  onSkip,
  onClose,
  onAskCompanion,
}) => {
  const { student, language, currentDayRecord, recordEvidence, showToast } = useApp();
  const isAr = language === 'ar';

  // Mode: 'digital' | 'photo'
  const [activeMode, setActiveMode] = useState<'digital' | 'photo'>('digital');

  // Homework Item state
  const [homeworkItem, setHomeworkItem] = useState<HomeworkItem | null>(null);
  const [questions, setQuestions] = useState<HomeworkQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Digital answer state
  const [currentAnswer, setCurrentAnswer] = useState<any>('');
  const [matchingSelections, setMatchingSelections] = useState<Record<number, string>>({});
  const [orderingList, setOrderingList] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  // Photo submission state
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [photoConsentGiven, setPhotoConsentGiven] = useState(true);
  const [isEvaluatingPhoto, setIsEvaluatingPhoto] = useState(false);
  const [photoEvaluation, setPhotoEvaluation] = useState<PhotoEvaluationResult | null>(null);
  const [clarifiedStudentText, setClarifiedStudentText] = useState('');
  const [simulateLowConfidence, setSimulateLowConfidence] = useState(false);

  // Hint-First State Machine per (studentId, homeworkItemId, questionId)
  const [attemptCount, setAttemptCount] = useState<number>(0);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [guidanceMessage, setGuidanceMessage] = useState<{
    type: 'hint' | 'worked_step' | 'reveal' | 'success';
    text: string;
  } | null>(null);

  // Active submission tracking
  const [submission, setSubmission] = useState<HomeworkSubmission | null>(null);

  // Track if current answer was corrected
  const [hasMadeCorrection, setHasMadeCorrection] = useState(false);
  const [correctionIndependence, setCorrectionIndependence] = useState<EvidenceIndependence>('unassisted');

  // Dispute verdict state (Failure mode 1b)
  const [isDisputeOpen, setIsDisputeOpen] = useState(false);
  const [disputeNote, setDisputeNote] = useState('');
  const [isDisputed, setIsDisputed] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Initialize or Load Homework Item
  useEffect(() => {
    async function initHomework() {
      if (!student) return;

      const studentId = student.id;
      const todayDate = mission.date || new Date().toISOString().split('T')[0];

      // Check if Day Record has a matching homework item
      let matchedDayHw = currentDayRecord?.homeworkAssigned?.find(
        (h) => (h.id && h.id === mission.homeworkItemId) || h.description === mission.homeworkDescription
      );

      // If not found by ID, use first homework item from day record if available
      if (!matchedDayHw && currentDayRecord?.homeworkAssigned && currentDayRecord.homeworkAssigned.length > 0) {
        matchedDayHw = currentDayRecord.homeworkAssigned[0];
      }

      if (!matchedDayHw) {
        // If no day record homework item matches, check storage for saved homework item
        if (mission.homeworkItemId) {
          const saved = await storageService.getHomeworkItem(mission.homeworkItemId);
          if (saved) {
            setHomeworkItem(saved);
            setQuestions(saved.questions || []);
            if (saved.questions && saved.questions.length > 0) {
              initQuestionAnswers(saved.questions[0]);
            }
            return;
          }
        }

        // UNLINKED HOMEWORK / Not in Day Record
        // NEVER fabricate a homework assignment that the student didn't receive
        setHomeworkItem({
          id: mission.homeworkItemId || `hw_${mission.id}`,
          studentId,
          date: todayDate,
          subject: mission.subject,
          description: mission.homeworkDescription || mission.title,
          unlinked: true,
          status: 'pending',
          questions: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        return;
      }

      // Generate or load homework item linked to Day Record
      const hwItem = createHomeworkItemFromDayRecord({
        studentId,
        date: todayDate,
        subject: matchedDayHw.subject || mission.subject,
        description: matchedDayHw.description,
        dueDate: matchedDayHw.dueDate,
        index: 0,
      });

      // Persist generated item to storage
      await storageService.saveHomeworkItem(hwItem);
      setHomeworkItem(hwItem);
      setQuestions(hwItem.questions || []);

      if (hwItem.questions && hwItem.questions.length > 0) {
        initQuestionAnswers(hwItem.questions[0]);
      }

      // Load existing submission if any
      const hwItemId = hwItem.id || `hw_${studentId}_${todayDate}_0`;
      const existingSub = await storageService.getHomeworkSubmission(hwItemId, studentId);
      if (existingSub) {
        setSubmission(existingSub);
        setAttemptCount(existingSub.attemptsCount || 0);
        setIsRevealed(existingSub.revealed || false);
        if (existingSub.photoDataUrl) {
          setPhotoDataUrl(existingSub.photoDataUrl);
          setPhotoConsentGiven(existingSub.photoConsentGiven ?? true);
        }
        if (existingSub.photoEvaluation) {
          setPhotoEvaluation(existingSub.photoEvaluation);
        }
      }
    }

    initHomework();
  }, [mission, currentDayRecord, student]);

  // Helper to initialize answers when question changes
  const initQuestionAnswers = (q: HomeworkQuestion) => {
    setCurrentAnswer('');
    setGuidanceMessage(null);
    setAttemptCount(0);
    setIsRevealed(false);
    setHasMadeCorrection(false);
    setCorrectionIndependence('unassisted');

    if (q.type === 'ordering' && q.orderingItems) {
      // Shuffle items for student
      const shuffled = [...q.orderingItems].sort(() => Math.random() - 0.5);
      setOrderingList(shuffled);
    } else {
      setOrderingList([]);
    }
    setMatchingSelections({});
  };

  const currentQuestion = questions[currentQuestionIndex];

  // 2. Handle Digital Answer Submission & Evaluation
  const handleSubmitDigitalAnswer = async (forcedAnswer?: any) => {
    if (!currentQuestion || !homeworkItem || !student) return;

    let ansToEval = forcedAnswer !== undefined ? forcedAnswer : currentAnswer;
    if (currentQuestion.type === 'ordering') {
      ansToEval = orderingList;
    } else if (currentQuestion.type === 'matching') {
      // Collect matching right values in order of matchingPairs
      ansToEval = currentQuestion.matchingPairs?.map((_, idx) => matchingSelections[idx] || '') || [];
    }

    const evalResult = evaluateStudentAnswer(currentQuestion, ansToEval);
    const newAttemptCount = attemptCount + 1;
    setAttemptCount(newAttemptCount);

    if (evalResult.isCorrect) {
      // Correct answer!
      setGuidanceMessage({
        type: 'success',
        text: isAr ? 'إجابة صحيحة وممتازة! أحسنت العمل.' : 'Correct answer! Excellent work.',
      });

      // Determine independence level for mastery evidence
      let finalIndependence: EvidenceIndependence = 'unassisted';
      if (isRevealed) {
        finalIndependence = 'revealed';
      } else if (newAttemptCount > 1 || hasMadeCorrection) {
        finalIndependence = 'hinted';
      }

      // Record evidence to mastery engine (Deliverable 1 & 4)
      if (currentQuestion.conceptId) {
        await recordEvidence(currentQuestion.conceptId, {
          correctness: 'full',
          difficulty: currentQuestion.difficulty ?? 0.5,
          independence: finalIndependence,
          modality: 'homework',
          notes: `Homework question ${currentQuestionIndex + 1} (${currentQuestion.type}) - ${finalIndependence}`,
        });
      }

      // Update submission state
      const targetHwId = homeworkItem.id || `hw_${student.id}_${mission.id}`;
      const updatedSub: HomeworkSubmission = {
        id: submission?.id || `sub_${targetHwId}_${Date.now()}`,
        studentId: student.id,
        homeworkItemId: targetHwId,
        missionId: mission.id,
        type: 'digital',
        status: currentQuestionIndex === questions.length - 1 ? 'evaluated' : 'draft',
        attemptsCount: newAttemptCount,
        revealed: isRevealed,
        corrected: hasMadeCorrection,
        lastIndependence: finalIndependence,
        completedAt: currentQuestionIndex === questions.length - 1 ? new Date().toISOString() : undefined,
        createdAt: submission?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setSubmission(updatedSub);
      await storageService.saveHomeworkSubmission(updatedSub);

      showToast(isAr ? 'تم تقييم إجابتك وتحديث إتقان الدرس!' : 'Answer evaluated & mastery updated!');
    } else {
      // Wrong or partial answer: APPLY HINT-FIRST POLICY (Deliverable 3)
      setHasMadeCorrection(true);
      const guidance = getHintFirstGuidance({
        attemptCount: newAttemptCount,
        revealed: isRevealed,
        question: currentQuestion,
      });

      setGuidanceMessage({
        type: guidance.guidanceType,
        text: guidance.guidanceText,
      });

      if (guidance.revealed) {
        setIsRevealed(true);
      }

      // Record negative/struggle evidence
      const independence: EvidenceIndependence = guidance.revealed ? 'revealed' : 'hinted';
      setCorrectionIndependence(independence);

      if (currentQuestion.conceptId) {
        await recordEvidence(currentQuestion.conceptId, {
          correctness: 'wrong',
          difficulty: currentQuestion.difficulty ?? 0.5,
          independence,
          modality: 'homework',
          notes: `Homework attempt ${newAttemptCount} incorrect - ${guidance.guidanceType} shown`,
        });
      }
    }
  };

  // 3. Force Reveal ("Show me" / "ورّيني")
  const handleTriggerShowMe = async () => {
    if (!currentQuestion || !student || !homeworkItem) return;
    setIsRevealed(true);
    setHasMadeCorrection(true);
    setCorrectionIndependence('revealed');

    setGuidanceMessage({
      type: 'reveal',
      text: currentQuestion.explanation,
    });

    // Record revealed evidence (Deliverable 3)
    if (currentQuestion.conceptId) {
      await recordEvidence(currentQuestion.conceptId, {
        correctness: 'partial',
        difficulty: 0.5,
        independence: 'revealed',
        modality: 'homework',
        notes: 'Student requested "Show me" / ورّيني prompt reveal',
      });
    }

    showToast(isAr ? 'تم إظهار الحل والشرح النموذجي' : 'Full answer & explanation revealed');
  };

  // 4. Offer similar practice question after reveal
  const handleTrySimilarQuestion = () => {
    if (!currentQuestion) return;
    const similar = generateSimilarPracticeQuestion(currentQuestion);
    setQuestions((prev) => {
      const copy = [...prev];
      copy[currentQuestionIndex] = similar;
      return copy;
    });
    initQuestionAnswers(similar);
    showToast(isAr ? 'تم تجهيز مسألة مماثلة للتدريب وإثبات الإتقان!' : 'Prepared similar problem for practice!');
  };

  // 5. Photo Homework Flow (Deliverable 2)
  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setPhotoDataUrl(dataUrl);
      setPhotoEvaluation(null);
      setGuidanceMessage(null);
      setClarifiedStudentText('');
    };
    reader.readAsDataURL(file);
  };

  // Submit Photo to Server POST /api/check-homework (with 15s timeout & telemetry)
  const handleUploadAndCheckPhoto = async () => {
    if (!photoDataUrl || !currentQuestion || !homeworkItem || !student) return;

    setIsEvaluatingPhoto(true);
    try {
      const { data } = await costLatencyService.instrumentedFetch<PhotoEvaluationResult>(
        '/api/check-homework',
        {
          imageBase64: photoDataUrl,
          questionPrompt: currentQuestion.prompt,
          expectedAnswer: String(currentQuestion.correctAnswer),
          rubric: currentQuestion.explanation,
          language,
          grade: student.grade || 'Grade 5',
          subject: homeworkItem.subject,
          simulateConfidence: simulateLowConfidence ? 0.35 : undefined,
        },
        {
          studentId: student.id,
          language: isAr ? 'ar' : 'en',
          timeoutMs: 15000,
        }
      );

      setPhotoEvaluation(data);

      const newAttemptCount = attemptCount + 1;
      setAttemptCount(newAttemptCount);

      // OCR Honesty Check (Deliverable 2):
      // If extractionConfidence < 0.5 → do NOT present a verdict.
      if (data.extractionConfidence < 0.5 || data.evaluation === 'unclear') {
        setGuidanceMessage({
          type: 'hint',
          text: isAr
            ? 'لم أستطع قراءة هذا بوضوح. هل يمكنك كتابة ما كتبته أدناه، أو تجربة صورة أوضح؟'
            : "I couldn't read this clearly. Can you tell me what you wrote below, or try a clearer photo?",
        });
      } else if (data.evaluation === 'correct') {
        // High confidence correct
        setGuidanceMessage({
          type: 'success',
          text: isAr ? 'تم التحقق من الصورة بنجاح: إجابتك صحيحة!' : 'Photo verified: Your answer is correct!',
        });

        const finalIndependence: EvidenceIndependence = isRevealed ? 'revealed' : newAttemptCount > 1 ? 'hinted' : 'unassisted';

        if (currentQuestion.conceptId) {
          await recordEvidence(currentQuestion.conceptId, {
            correctness: 'full',
            difficulty: 0.5,
            independence: finalIndependence,
            modality: 'homework',
            notes: `Photo homework evaluation: correct (${Math.round(data.extractionConfidence * 100)}% OCR confidence)`,
          });
        }
      } else {
        // High confidence wrong or partial: Apply Hint-First Policy
        setHasMadeCorrection(true);
        const guidance = getHintFirstGuidance({
          attemptCount: newAttemptCount,
          revealed: isRevealed,
          question: currentQuestion,
        });

        setGuidanceMessage({
          type: guidance.guidanceType,
          text: data.mistakeDescription || guidance.guidanceText,
        });

        if (guidance.revealed) {
          setIsRevealed(true);
        }

        const independence: EvidenceIndependence = guidance.revealed ? 'revealed' : 'hinted';
        if (currentQuestion.conceptId) {
          await recordEvidence(currentQuestion.conceptId, {
            correctness: data.evaluation === 'partial' ? 'partial' : 'wrong',
            difficulty: 0.5,
            independence,
            modality: 'homework',
            notes: `Photo homework evaluation: ${data.evaluation}`,
          });
        }
      }

      // Save submission to IndexedDB
      const photoHwId = homeworkItem.id || `hw_${student.id}_${mission.id}`;
      const updatedSub: HomeworkSubmission = {
        id: submission?.id || `sub_${photoHwId}_${Date.now()}`,
        studentId: student.id,
        homeworkItemId: photoHwId,
        missionId: mission.id,
        type: 'photo',
        status: data.evaluation === 'correct' ? 'evaluated' : 'submitted',
        photoDataUrl: photoConsentGiven ? photoDataUrl : undefined,
        photoConsentGiven,
        photoEvaluation: data,
        attemptsCount: newAttemptCount,
        revealed: isRevealed,
        corrected: hasMadeCorrection,
        createdAt: submission?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setSubmission(updatedSub);
      await storageService.saveHomeworkSubmission(updatedSub);
    } catch (err) {
      console.error('Photo check error:', err);
      showToast(isAr ? 'تعذر الاتصال بفحص الصور خلال 15 ثانية، يمكنك المتابعة رقمياً' : 'Photo check timed out after 15s, you can continue digitally');
    } finally {
      setIsEvaluatingPhoto(false);
    }
  };

  // Student Dispute Verdict handler (Failure mode 1b)
  // "Student can dispute a verdict -> Dispute doesn't silently change mastery"
  const handleDisputeVerdict = async () => {
    if (!homeworkItem || !student) return;
    setIsDisputed(true);
    setIsDisputeOpen(false);

    const subId = submission?.id || `sub_${homeworkItem.id || 'hw'}_${Date.now()}`;
    const updatedSub: HomeworkSubmission = {
      id: subId,
      studentId: student.id,
      homeworkItemId: homeworkItem.id || 'hw',
      missionId: mission.id,
      type: activeMode,
      status: 'evaluated',
      attemptsCount: attemptCount,
      revealed: isRevealed,
      corrected: hasMadeCorrection,
      disputed: true,
      disputeNote: disputeNote.trim() || undefined,
      disputedAt: new Date().toISOString(),
      createdAt: submission?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await storageService.saveHomeworkSubmission(updatedSub);
    setSubmission(updatedSub);
    showToast(
      isAr
        ? 'تم تسجيل اعتراضك لمراجعته مع المعلم أو ولي الأمر، ولم يتم تغيير أو خفض تقييمك.'
        : 'Dispute registered for teacher/parent review. Your mastery score was not penalized.'
    );
  };

  // Submit clarified text when OCR confidence was low
  const handleConfirmClarifiedText = () => {
    if (!clarifiedStudentText.trim()) return;
    handleSubmitDigitalAnswer(clarifiedStudentText.trim());
  };

  // Delete stored photo (Deliverable 2 requirement: per-item delete always available)
  const handleDeletePhoto = async () => {
    setPhotoDataUrl(null);
    setPhotoEvaluation(null);
    if (submission) {
      await storageService.deleteHomeworkPhoto(submission.id);
      showToast(isAr ? 'تم حذف صورة الواجب بنجاح من جهازك' : 'Homework photo deleted from local storage');
    }
  };

  // Voice recording toggle for voice question
  const handleToggleVoiceRecord = async () => {
    if (isRecording) {
      voiceService.stopListening();
      setIsRecording(false);
    } else {
      setIsRecording(true);
      try {
        const result = await voiceService.startListening(
          language,
          (interim) => {
            if (interim) setCurrentAnswer(interim);
          },
          (status) => {
            setIsRecording(status === 'listening');
          }
        );
        if (result && result.transcript) {
          setCurrentAnswer(result.transcript);
        }
      } catch (err) {
        console.warn('Voice record error:', err);
      } finally {
        setIsRecording(false);
      }
    }
  };

  // Next Question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      const nextIdx = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIdx);
      initQuestionAnswers(questions[nextIdx]);
    } else {
      // Completed all homework questions!
      onComplete(1.0);
    }
  };

  // Previous Question
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      const prevIdx = currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevIdx);
      initQuestionAnswers(questions[prevIdx]);
    }
  };

  // ==========================================
  // UNLINKED HOMEWORK VIEW (Never fabricated)
  // ==========================================
  if (homeworkItem?.unlinked) {
    return (
      <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-6">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold">{mission.subject}</h3>
              <p className="text-xs text-slate-500">{mission.homeworkDescription || mission.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4 max-w-sm mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {isAr ? 'الواجب غير متوفر حالياً' : 'Homework Not Yet Available'}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {isAr
                ? 'لم نتمكن من ربط هذا الواجب بدرس مطابق في المنهج المسجل. لحماية دقة تعلمك، لن نقوم بتأليف أو اختراع أسئلة غير مؤكدة.'
                : 'Could not link this homework item to a confirmed curriculum concept. To maintain pedagogical integrity, questions are never fabricated.'}
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 text-right rtl:text-right w-full">
            <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              {isAr ? 'الوصف المسجل:' : 'Logged Description:'}
            </span>
            "{homeworkItem.description}"
          </div>
          <div className="flex gap-2 w-full pt-4">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-bold hover:bg-slate-300 transition-all"
            >
              {isAr ? 'المحاولة لاحقاً' : 'Retry Later'}
            </button>
            <button
              onClick={() => onSkip()}
              className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all"
            >
              {isAr ? 'تخطي المهمة' : 'Skip Mission'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold">{mission.subject}</span>
              <Badge variant="demo">{isAr ? 'واجب اليوم' : "Today's Homework"}</Badge>
              {attemptCount > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                  {isAr ? `المحاولة ${attemptCount}` : `Attempt ${attemptCount}`}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 truncate max-w-xs">
              {homeworkItem?.description || mission.homeworkDescription || mission.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode Switcher: Digital vs Photo */}
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-0.5 text-xs font-bold">
            <button
              onClick={() => setActiveMode('digital')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeMode === 'digital'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {isAr ? 'حل رقمي' : 'Digital'}
            </button>
            <button
              onClick={() => setActiveMode('photo')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                activeMode === 'photo'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Camera className="w-3 h-3" />
              <span>{isAr ? 'تصوير الواجب' : 'Photo'}</span>
            </button>
          </div>

          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar (Questions 1 to N) */}
      {questions.length > 0 && (
        <div className="px-4 py-2 bg-slate-100 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px]">
          <span className="font-semibold text-slate-600 dark:text-slate-300">
            {isAr
              ? `السؤال ${currentQuestionIndex + 1} من ${questions.length}`
              : `Question ${currentQuestionIndex + 1} of ${questions.length}`}
          </span>
          <div className="flex items-center gap-1">
            {questions.map((_, idx) => (
              <div
                key={idx}
                className={`w-2.5 h-1.5 rounded-full transition-all ${
                  idx === currentQuestionIndex
                    ? 'w-5 bg-indigo-600'
                    : idx < currentQuestionIndex
                    ? 'bg-emerald-500'
                    : 'bg-slate-300 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {currentQuestion && (
          <>
            {/* Prompt Box */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                <span className="capitalize">
                  {currentQuestion.type === 'multiple_choice'
                    ? isAr ? 'اختيار من متعدد' : 'Multiple Choice'
                    : currentQuestion.type === 'short_answer'
                    ? isAr ? 'إجابة قصيرة' : 'Short Answer'
                    : currentQuestion.type === 'matching'
                    ? isAr ? 'توصيل' : 'Matching'
                    : currentQuestion.type === 'fill_in_the_blank'
                    ? isAr ? 'أكمل الفراغ' : 'Fill in the Blank'
                    : currentQuestion.type === 'ordering'
                    ? isAr ? 'ترتيب' : 'Ordering'
                    : isAr ? 'إجابة صوتية' : 'Voice Response'}
                </span>
                {isRevealed && (
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold">
                    {isAr ? 'تم كشف الحل' : 'Revealed'}
                  </span>
                )}
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
                {currentQuestion.prompt}
              </h3>
            </div>

            {/* Mode 1: DIGITAL HOMEWORK ACTIVITIES */}
            {activeMode === 'digital' && (
              <div className="space-y-3">
                {/* 1. Multiple Choice */}
                {currentQuestion.type === 'multiple_choice' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentQuestion.options?.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentAnswer(opt)}
                        className={`p-3 rounded-xl border text-xs sm:text-sm font-semibold text-right rtl:text-right transition-all flex items-center justify-between ${
                          currentAnswer === opt
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-900 dark:text-indigo-200 font-bold'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-slate-400'
                        }`}
                      >
                        <span>{opt}</span>
                        {currentAnswer === opt && <Check className="w-4 h-4 text-indigo-600" />}
                      </button>
                    ))}
                  </div>
                )}

                {/* 2. Short Answer (Text) */}
                {currentQuestion.type === 'short_answer' && (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={currentAnswer}
                      onChange={(e) => setCurrentAnswer(e.target.value)}
                      placeholder={isAr ? 'اكتب إجابتك هنا...' : 'Type your answer here...'}
                      className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm focus:outline-hidden focus:border-indigo-500 text-right rtl:text-right"
                    />
                  </div>
                )}

                {/* 3. Fill in the Blank */}
                {currentQuestion.type === 'fill_in_the_blank' && (
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 text-xs sm:text-sm">
                    <div className="leading-loose text-slate-800 dark:text-slate-200 text-right rtl:text-right">
                      <span>{currentQuestion.blanks?.beforeText} </span>
                      <input
                        type="text"
                        value={currentAnswer}
                        onChange={(e) => setCurrentAnswer(e.target.value)}
                        placeholder="______"
                        className="inline-block px-3 py-1 w-32 text-center rounded-lg bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-300 dark:border-indigo-700 font-bold text-indigo-700 dark:text-indigo-300 focus:outline-hidden"
                      />
                      <span> {currentQuestion.blanks?.afterText}</span>
                    </div>
                  </div>
                )}

                {/* 4. Matching */}
                {currentQuestion.type === 'matching' && currentQuestion.matchingPairs && (
                  <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5">
                    <span className="text-[11px] font-bold text-slate-500 block">
                      {isAr ? 'اختر النظير المطابق لكل عنصر:' : 'Match each left item with its partner:'}
                    </span>
                    {currentQuestion.matchingPairs.map((pair, idx) => (
                      <div
                        key={pair.id}
                        className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2"
                      >
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                          {pair.left}
                        </span>
                        <select
                          value={matchingSelections[idx] || ''}
                          onChange={(e) =>
                            setMatchingSelections((prev) => ({ ...prev, [idx]: e.target.value }))
                          }
                          className="text-xs p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 focus:border-indigo-500"
                        >
                          <option value="">{isAr ? '-- اختر --' : '-- Select --'}</option>
                          {currentQuestion.matchingPairs?.map((p, pIdx) => (
                            <option key={pIdx} value={p.right}>
                              {p.right}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                )}

                {/* 5. Ordering */}
                {currentQuestion.type === 'ordering' && (
                  <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                    <span className="text-[11px] font-bold text-slate-500 block">
                      {isAr ? 'استخدم الأسهم لترتيب الخطوات:' : 'Use arrows to arrange the correct order:'}
                    </span>
                    {orderingList.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2 text-xs font-semibold"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 text-[10px] font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span>{item}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            disabled={idx === 0}
                            onClick={() => {
                              const copy = [...orderingList];
                              const temp = copy[idx - 1];
                              copy[idx - 1] = copy[idx];
                              copy[idx] = temp;
                              setOrderingList(copy);
                            }}
                            className="p-1 rounded-md bg-white dark:bg-slate-700 text-slate-600 hover:text-indigo-600 disabled:opacity-30"
                          >
                            ↑
                          </button>
                          <button
                            disabled={idx === orderingList.length - 1}
                            onClick={() => {
                              const copy = [...orderingList];
                              const temp = copy[idx + 1];
                              copy[idx + 1] = copy[idx];
                              copy[idx] = temp;
                              setOrderingList(copy);
                            }}
                            className="p-1 rounded-md bg-white dark:bg-slate-700 text-slate-600 hover:text-indigo-600 disabled:opacity-30"
                          >
                            ↓
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 6. Voice Response */}
                {currentQuestion.type === 'voice_response' && (
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 text-center">
                    <p className="text-xs text-slate-500">
                      {isAr ? 'اضغط وتحدث بصوتك للإجابة على السؤال:' : 'Tap and speak to answer the question:'}
                    </p>
                    <button
                      onClick={handleToggleVoiceRecord}
                      className={`w-14 h-14 rounded-full mx-auto flex items-center justify-center transition-all shadow-md ${
                        isRecording
                          ? 'bg-rose-500 text-white animate-pulse'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      }`}
                    >
                      {isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                    </button>
                    {isRecording && (
                      <span className="text-[11px] text-rose-500 font-bold block animate-pulse">
                        {isAr ? 'جارِ الاستماع...' : 'Listening...'}
                      </span>
                    )}
                    {currentAnswer && (
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs text-right rtl:text-right font-medium">
                        <span className="text-[10px] text-slate-400 block mb-0.5">
                          {isAr ? 'النص المنطوق:' : 'Spoken Transcript:'}
                        </span>
                        "{currentAnswer}"
                      </div>
                    )}
                  </div>
                )}

                {/* Submit Digital Button */}
                <button
                  onClick={() => handleSubmitDigitalAnswer()}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isAr ? 'تحقق من الإجابة' : 'Check Answer'}</span>
                </button>
              </div>
            )}

            {/* Mode 2: PHOTO HOMEWORK FLOW (Deliverable 2) */}
            {activeMode === 'photo' && (
              <div className="space-y-3">
                {/* Visible Best-Effort Note (Mandatory requirement) */}
                <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start gap-2 text-[11px] text-amber-800 dark:text-amber-200 leading-snug">
                  <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">
                      {isAr ? 'تنويه التعرف البصري (جهد تقريبي): ' : 'Best-effort OCR Note: '}
                    </span>
                    {isAr
                      ? 'التعرف على الخط اليدوي للغة العربية يتم بأفضل جهد ممكن وقد لا يكون دقيقاً بنسبة 100%. سنعرض لك ما قرأناه لتأكيده دائماً دون إصدار أحكام متسرعة.'
                      : 'Handwriting OCR for Arabic script is best-effort. We will always present what was extracted for your confirmation rather than guessing.'}
                  </div>
                </div>

                {/* Camera / Upload Box */}
                {!photoDataUrl ? (
                  <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center mx-auto">
                      <Camera className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {isAr ? 'التقط صورة لدفتر الواجب' : 'Take a photo of your notebook'}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {isAr ? 'تأكد من وضوح الإضاءة واستقامة الصفحة' : 'Ensure good lighting and page framing'}
                      </p>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handlePhotoCapture}
                      className="hidden"
                    />

                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>{isAr ? 'فتح الكاميرا / اختيار صورة' : 'Open Camera / Pick Photo'}</span>
                      </button>
                    </div>

                    {/* Test Harness low confidence simulator toggle */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-2 text-[10px] text-slate-400">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={simulateLowConfidence}
                          onChange={(e) => setSimulateLowConfidence(e.target.checked)}
                          className="rounded text-indigo-600"
                        />
                        <span>{isAr ? 'محاكاة خط غير واضح (< 0.5) للاختبار' : 'Simulate low confidence (< 0.5)'}</span>
                      </label>
                    </div>
                  </div>
                ) : (
                  /* Photo Preview & Consent */
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="relative rounded-xl overflow-hidden max-h-56 bg-black flex items-center justify-center">
                      <img src={photoDataUrl} alt="Homework capture" className="max-h-56 object-contain" />
                      <button
                        onClick={handleDeletePhoto}
                        className="absolute top-2 left-2 p-1.5 rounded-lg bg-black/60 text-rose-400 hover:text-rose-200 transition-all"
                        title={isAr ? 'حذف الصورة' : 'Delete photo'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Storage Consent Toggle (Deliverable 2 requirement) */}
                    <div className="flex items-center justify-between text-[11px] p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                      <span className="text-slate-600 dark:text-slate-300">
                        {isAr ? 'حفظ الصورة في سجلي الدراسي للرجوع إليها' : 'Save photo in learning history'}
                      </span>
                      <input
                        type="checkbox"
                        checked={photoConsentGiven}
                        onChange={(e) => setPhotoConsentGiven(e.target.checked)}
                        className="rounded text-indigo-600"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 flex items-center justify-center gap-1"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>{isAr ? 'إعادة التصوير' : 'Retake'}</span>
                      </button>
                      <button
                        disabled={isEvaluatingPhoto}
                        onClick={handleUploadAndCheckPhoto}
                        className="flex-2 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-50"
                      >
                        {isEvaluatingPhoto ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <CheckCircle className="w-3.5 h-3.5" />
                        )}
                        <span>{isEvaluatingPhoto ? (isAr ? 'جارِ التحليل...' : 'Evaluating...') : (isAr ? 'فحص الواجب الآن' : 'Check Photo')}</span>
                      </button>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handlePhotoCapture}
                      className="hidden"
                    />
                  </div>
                )}

                {/* Photo OCR Feedback Screen (Deliverable 2 & 7) */}
                {photoEvaluation && (
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        {isAr ? 'نتائج الفحص البصري:' : 'Visual OCR Result:'}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          photoEvaluation.extractionConfidence >= 0.7
                            ? 'bg-emerald-100 text-emerald-800'
                            : photoEvaluation.extractionConfidence >= 0.5
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {isAr ? 'دقة القراءة: ' : 'Confidence: '}
                        {Math.round(photoEvaluation.extractionConfidence * 100)}%
                      </span>
                    </div>

                    {/* Low Confidence fallback prompt (< 0.5) */}
                    {photoEvaluation.extractionConfidence < 0.5 ? (
                      <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 space-y-2 text-xs">
                        <p className="font-bold text-rose-900 dark:text-rose-200">
                          {isAr
                            ? 'لم أستطع قراءة هذا بوضوح. هل يمكنك كتابة ما كتبته، أو تجربة صورة أوضح؟'
                            : "I couldn't read this clearly. Can you tell me what you wrote, or try a clearer photo?"}
                        </p>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={clarifiedStudentText}
                            onChange={(e) => setClarifiedStudentText(e.target.value)}
                            placeholder={isAr ? 'اكتب ما كتبته في الدفتر هنا...' : 'Type what you wrote in notebook...'}
                            className="flex-1 p-2 rounded-lg bg-white dark:bg-slate-900 border border-rose-300 text-xs text-right rtl:text-right"
                          />
                          <button
                            onClick={handleConfirmClarifiedText}
                            className="px-3 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
                          >
                            {isAr ? 'تأكيد' : 'Confirm'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Legible OCR extraction */
                      <div className="space-y-2">
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs space-y-1 text-right rtl:text-right">
                          <span className="text-[10px] text-slate-400 block font-bold">
                            {isAr ? 'النص المستخرج من صورتك:' : 'Extracted Text:'}
                          </span>
                          <p className="font-bold text-slate-900 dark:text-slate-100">
                            "{photoEvaluation.extractedAnswerText || (isAr ? 'لا يوجد نص محدد' : 'No specific text')}"
                          </p>
                        </div>

                        {/* Separate Handwriting Quality Evaluation (Does not penalize academic score) */}
                        {photoEvaluation.handwritingQuality && (
                          <div className="p-3 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs space-y-1 text-right rtl:text-right">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1">
                                <span>✍️</span>
                                <span>{isAr ? 'تقييم جودة الخط اليدوي (منفصل تماماً عن صحة الحل):' : 'Handwriting Quality (Separated from Academic Correctness):'}</span>
                              </span>
                              <Badge variant={photoEvaluation.handwritingQuality === 'neat' ? 'official' : photoEvaluation.handwritingQuality === 'readable' ? 'demo' : 'warning'}>
                                {photoEvaluation.handwritingQuality === 'neat'
                                  ? (isAr ? 'خط أنيق وممتاز' : 'Neat')
                                  : photoEvaluation.handwritingQuality === 'readable'
                                  ? (isAr ? 'خط مقروء وواضح' : 'Readable')
                                  : (isAr ? 'يحتاج تنظيماً وترتيباً' : 'Needs Practice')}
                              </Badge>
                            </div>
                            {photoEvaluation.handwritingFeedback && (
                              <p className="text-[11px] text-indigo-950/80 dark:text-indigo-300">
                                {photoEvaluation.handwritingFeedback}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* HINT-FIRST POLICY GUIDANCE SCREEN (Deliverable 3 & 7) */}
            {guidanceMessage && (
              <div
                className={`p-4 rounded-2xl border transition-all space-y-3 ${
                  guidanceMessage.type === 'success'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                    : guidanceMessage.type === 'reveal'
                    ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-300 dark:border-purple-800'
                    : guidanceMessage.type === 'worked_step'
                    ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800'
                    : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  {guidanceMessage.type === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  ) : guidanceMessage.type === 'reveal' ? (
                    <Eye className="w-5 h-5 text-purple-600" />
                  ) : guidanceMessage.type === 'worked_step' ? (
                    <Lightbulb className="w-5 h-5 text-blue-600" />
                  ) : (
                    <HelpCircle className="w-5 h-5 text-amber-600" />
                  )}
                  <h4 className="text-xs font-bold">
                    {guidanceMessage.type === 'success'
                      ? isAr ? 'إجابة ممتازة' : 'Great Job'
                      : guidanceMessage.type === 'reveal'
                      ? isAr ? 'الحل الكامل والشرح النموذجي' : 'Full Explanation & Target Answer'
                      : guidanceMessage.type === 'worked_step'
                      ? isAr ? 'خطوة تمهيدية للمساعدة (بدون إظهار الناتج النهائي)' : 'Worked Step (Approach only)'
                      : isAr ? 'تلميح للمحاولة الأولى (تذكير بالقاعدة)' : 'First Attempt Hint'}
                  </h4>
                </div>

                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed text-right rtl:text-right">
                  {guidanceMessage.text}
                </p>

                {/* Action buttons inside feedback */}
                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-2 flex-wrap">
                  {/* "Let me look again" button always available */}
                  <button
                    onClick={() => {
                      setGuidanceMessage(null);
                      setCurrentAnswer('');
                    }}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{isAr ? 'دعني أراجع مجدداً' : 'Let me look again'}</span>
                  </button>

                  {/* Student Dispute Verdict Button (Failure mode 1b) */}
                  {!isDisputed && guidanceMessage.type !== 'success' && (
                    <button
                      onClick={() => setIsDisputeOpen(true)}
                      className="px-3 py-1.5 rounded-lg border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 bg-amber-50/60 dark:bg-amber-950/40 text-xs font-bold hover:bg-amber-100 transition-all flex items-center gap-1"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>{isAr ? 'اعتراض على التقييم' : 'Dispute verdict'}</span>
                    </button>
                  )}

                  {/* Ask Companion to explain mistake */}
                  {onAskCompanion && guidanceMessage.type !== 'success' && (
                    <button
                      onClick={() => onAskCompanion(guidanceMessage.text)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100 flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isAr ? 'اسأل الرفيق للشرح' : 'Ask Companion'}</span>
                    </button>
                  )}

                  {/* "Show me" button if not yet revealed */}
                  {!isRevealed && guidanceMessage.type !== 'success' && (
                    <button
                      onClick={handleTriggerShowMe}
                      className="px-3 py-1.5 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 text-xs font-bold hover:bg-purple-200 flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{isAr ? 'ورّيني الحل' : 'Show me'}</span>
                    </button>
                  )}

                  {/* Similar practice question offer after reveal */}
                  {isRevealed && (
                    <button
                      onClick={handleTrySimilarQuestion}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>{isAr ? 'تجربة مسألة مماثلة' : 'Try Similar Problem'}</span>
                    </button>
                  )}
                </div>

                {/* Dispute Input Section (Failure mode 1b) */}
                {isDisputeOpen && (
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 space-y-2 mt-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-200">
                      <ShieldAlert className="w-4 h-4 text-amber-600" />
                      <span>{isAr ? 'هل تعتقد أن الإجابة صحيحة أو تم تقييمها خطأ؟' : 'Do you believe this evaluation is in error?'}</span>
                    </div>
                    <input
                      type="text"
                      value={disputeNote}
                      onChange={(e) => setDisputeNote(e.target.value)}
                      placeholder={isAr ? 'اكتب ملاحظتك (مثال: بسطت الكسر بطريقة صحيحة...)' : 'Add a note (e.g. simplified fraction correctly...)'}
                      className="w-full p-2 text-xs rounded-lg border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-900 text-right rtl:text-right"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setIsDisputeOpen(false)}
                        className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-700"
                      >
                        {isAr ? 'إلغاء' : 'Cancel'}
                      </button>
                      <button
                        onClick={handleDisputeVerdict}
                        className="px-3 py-1 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-lg shadow-xs"
                      >
                        {isAr ? 'تأكيد الاعتراض' : 'Confirm Dispute'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Dispute confirmed status note */}
                {isDisputed && (
                  <div className="p-2.5 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-[11px] text-indigo-900 dark:text-indigo-200 flex items-center gap-2 mt-2">
                    <ShieldAlert className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>
                      {isAr
                        ? 'تم تسجيل اعتراضك على هذا التقييم لمراجعته مع المعلم. لم يتم التأثير سلباً على مستوى إتقانك.'
                        : 'Dispute registered for review. Your mastery score was not penalized.'}
                    </span>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between shrink-0">
        <button
          disabled={currentQuestionIndex === 0}
          onClick={handlePrevQuestion}
          className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-30 flex items-center gap-1"
        >
          {isAr ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
          <span>{isAr ? 'السابق' : 'Previous'}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={onSkip}
            className="px-3 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800"
          >
            {isAr ? 'تخطي' : 'Skip'}
          </button>

          <button
            onClick={handleNextQuestion}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1"
          >
            <span>
              {currentQuestionIndex === questions.length - 1
                ? isAr ? 'إنهاء الواجب' : 'Finish Homework'
                : isAr ? 'التالي' : 'Next'}
            </span>
            {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
