/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ChatMessage, AIConversation } from '../../types';
import { storageService } from '../../services/storage';
import { voiceService } from '../../services/voice/voiceService';
import { curriculumService } from '../../services/curriculum/curriculumService';
import { isEscalationTrigger, advanceTutorEscalation } from '../../services/tutor/tutorEngine';
import { Badge } from '../common/Badge';
import { DayRecordFlowModal } from '../dayRecord/DayRecordFlowModal';
import { DailyReviewModal } from '../home/DailyReviewModal';
import { StageModal } from '../stage/StageModal';
import { VoiceInputControl } from '../voice/VoiceInputControl';
import { VoiceSpeakButton } from '../voice/VoiceSpeakButton';
import { costLatencyService } from '../../services/telemetry/costLatencyService';
import {
  Bot,
  Send,
  User,
  Sparkles,
  AlertCircle,
  CalendarCheck,
  HelpCircle,
  PlayCircle,
  CheckCircle2,
  Trash2,
} from 'lucide-react';

function isWhatShouldIDoIntent(text: string): boolean {
  const s = text.toLowerCase().trim();
  return (
    s.includes('ماذا') ||
    s.includes('أعمل إيه') ||
    s.includes('اعمل ايه') ||
    s.includes('نعمل إيه') ||
    s.includes('نعلم ايه') ||
    s.includes('ابدأ بإيه') ||
    s.includes('ابدا بايه') ||
    s.includes('المطلوب مني') ||
    s.includes('what should i do') ||
    s.includes('what to do') ||
    s.includes('what now') ||
    s.includes('next task')
  );
}

function isFinishedIntent(text: string): boolean {
  const s = text.toLowerCase().trim();
  return (
    s.includes('خلصت') ||
    s.includes('أنهيت') ||
    s.includes('انهيت') ||
    s.includes('تم الانتهاء') ||
    s.includes('انتهيت') ||
    s.includes('finished') ||
    s.includes('i finished') ||
    s.includes('done') ||
    s.includes('completed')
  );
}

function isSkipIntent(text: string): boolean {
  const s = text.toLowerCase().trim();
  return (
    s.includes('تخطي') ||
    s.includes('تخطى') ||
    s.includes('مش عايز دي') ||
    s.includes('مش عاوز دي') ||
    s.includes('تأجيل') ||
    s.includes('skip') ||
    s.includes('skip this') ||
    s.includes('skip mission')
  );
}

function isWrapUpIntent(text: string): boolean {
  const s = text.toLowerCase().trim();
  return (
    s.includes('لخص يومي') ||
    s.includes('لخص اليوم') ||
    s.includes('إنهاء اليوم') ||
    s.includes('انهاء اليوم') ||
    s.includes('مراجعة اليوم') ||
    s.includes('wrap up') ||
    s.includes('wrap up today') ||
    s.includes('daily review') ||
    s.includes('review my day')
  );
}

function isWeeklyReviewIntent(text: string): boolean {
  const s = text.toLowerCase().trim();
  return (
    s.includes('لخص أسبوعي') ||
    s.includes('لخص اسبوعي') ||
    s.includes('تقرير أسبوعي') ||
    s.includes('تقرير اسبوعي') ||
    s.includes('ملخص الأسبوع') ||
    s.includes('ملخص الاسبوع') ||
    s.includes('show my week') ||
    s.includes('weekly review') ||
    s.includes('my week')
  );
}

function isFrustrationIntent(text: string): boolean {
  const s = text.toLowerCase().trim();
  return (
    s.includes('تعبت') ||
    s.includes('زهقت') ||
    s.includes('مش قادر') ||
    s.includes('مش قادرة') ||
    s.includes('مش عايز اذاكر') ||
    s.includes('مش عاوز اذاكر') ||
    s.includes('صعب جدا') ||
    s.includes('صعبة جدا') ||
    s.includes('tired') ||
    s.includes('exhausted') ||
    s.includes('too hard') ||
    s.includes('i want to stop') ||
    s.includes('give up') ||
    s.includes('frustrated')
  );
}

function isParentOverrideIntent(text: string): boolean {
  const s = text.toLowerCase().trim();
  return (
    s.includes('ليه وقت المذاكرة اتغير') ||
    s.includes('ليه خطتي اتغيرت') ||
    s.includes('ليه المهام قلت') ||
    s.includes('ليه ولي الأمر') ||
    s.includes('ليه ولي الامر') ||
    s.includes('إشعار توجيه ولي الأمر') ||
    s.includes('اشعار توجيه ولي الامر') ||
    s.includes('توجيه ولي الأمر') ||
    s.includes('توجيه ولي الامر') ||
    s.includes('why parent') ||
    s.includes('why was my study time changed') ||
    s.includes('why did study time change') ||
    s.includes('why did my plan change')
  );
}

export const CompanionChatScreen: React.FC = () => {
  const {
    t,
    language,
    student,
    settings,
    currentDayRecord,
    missionsForToday,
    activeMission,
    startMission,
    completeMission,
    skipMission,
    setActiveTab,
    currentDailyReview,
    isDailyReviewOpen,
    openDailyReview,
    closeDailyReview,
    generateAndOpenWeeklyReview,
    plannerExplanation,
  } = useApp();
  const isArabic = language === 'ar';

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showReconstructModal, setShowReconstructModal] = useState(false);
  const [showClearConfirmModal, setShowClearConfirmModal] = useState(false);
  const [showStage, setShowStage] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const studentName = student?.name || (isArabic ? 'صديقي' : 'Friend');

  // Load existing conversation or initialize with introductory message
  useEffect(() => {
    async function loadChat() {
      try {
        const storedConv = student?.id ? await storageService.getConversation(student.id) : null;
        if (storedConv && storedConv.messages.length > 0) {
          setMessages(storedConv.messages);
        } else {
          // Welcome message directly adhering to the prompt rules
          const initialGreeting: ChatMessage = {
            id: 'msg_welcome_' + Date.now(),
            role: 'assistant',
            content: isArabic
              ? `أهلاً يا ${studentName}! أنا «الرفيق الدراسي الذكي». أنا نظام ذكاء اصطناعي للتعلم، لست معلماً بشرياً ولست هنا لتقييمك أو معاتبتك. وظيفتي هي تنظيم يومك الدراسي، ومساعدتك لفهم المواد بهدوء وبدون ضغط. كيف كان يومك أو ما الذي تود التحدث عنه؟`
              : `Hello ${studentName}! I am your AI School Companion. I am an AI system, not a human teacher, and I am not here to judge or scold you. My purpose is to help structure your school day, untangle difficult topics, and ensure you study effectively without burnout. How is your day going?`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          setMessages([initialGreeting]);
          if (student?.id) {
            const newConv: AIConversation = {
              id: 'conv_' + student.id,
              studentId: student.id,
              messages: [initialGreeting],
              updatedAt: new Date().toISOString(),
            };
            await storageService.saveConversation(newConv);
          }
        }
      } catch (e) {
        console.error('Failed to load conversation:', e);
      }
    }

    loadChat();
  }, [studentName, isArabic, student?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = async (textToSend?: string) => {
    const content = (textToSend || inputText).trim();
    if (!content || isSending) return;

    setErrorMessage(null);
    setInputText('');

    const userMessage: ChatMessage = {
      id: 'msg_u_' + Date.now(),
      role: 'user',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedHistory = [...messages, userMessage];
    setMessages(updatedHistory);
    setIsSending(true);

    try {
      let replyContent = '';

      // 1. Check Mission Intent: "What should I do now?"
      if (isWhatShouldIDoIntent(content)) {
        const topPending =
          activeMission ||
          missionsForToday.find((m) => m.status === 'pending' || m.status === 'started');

        if (topPending) {
          replyContent = isArabic
            ? `المهمة المقترحة لك الآن بأعلى أولوية هي:\n🎯 «${topPending.title}»\n📚 المادة: ${topPending.subject} • ⏱️ ${topPending.estimatedMinutes} دقيقة\n💡 لماذا الآن؟ ${topPending.whyNow}\n🏷️ المصدر: [${topPending.originTag}]\n\nهل نتوكل على الله ونبدأها الآن؟`
            : `Your highest priority mission right now is:\n🎯 "${topPending.title}"\n📚 Subject: ${topPending.subject} • ⏱️ ${topPending.estimatedMinutes} min\n💡 Why now? ${topPending.whyNow}\n🏷️ Origin: [${topPending.originTag}]\n\nReady to get started?`;
        } else if (missionsForToday.length > 0 && missionsForToday.every((m) => m.status === 'completed')) {
          replyContent = isArabic
            ? `ما شاء الله عليك يا ${studentName}! 🌟 لقد أكملت جميع مهام اليوم بنجاح (${missionsForToday.length}/${missionsForToday.length}). استرح واستمتع بوقتك، لقد أنجزت يومك بامتياز!`
            : `Fantastic job ${studentName}! 🌟 You completed all your daily missions (${missionsForToday.length}/${missionsForToday.length}). Take a restful break!`;
        } else {
          replyContent = isArabic
            ? `لا توجد مهام مجدولة حالياً. يمكنك الانتقال إلى الشاشة الرئيسية وضبط وقت المذاكرة المتاح لنرتب لك مهام اليوم فوراً.`
            : `No missions are planned yet. You can check the Home screen and adjust your available time to generate today's missions.`;
        }
      }
      // 2. Check Mission Intent: "I finished"
      else if (isFinishedIntent(content)) {
        const targetMission =
          activeMission ||
          missionsForToday.find((m) => m.status === 'started') ||
          missionsForToday.find((m) => m.status === 'pending');

        if (targetMission) {
          replyContent = isArabic
            ? `ممتاز يا بطلة! لتسجيل إتمام مهمة «${targetMission.title}» رسمياً في سجل إتقانك، تعالي نفتح تمرين المهمة السريع لنتأكد من تثبيت الفكرة ونمنحك نجوم الإنجاز! ⭐`
            : `Great job! To record completion of "${targetMission.title}" in your mastery records, let's open the quick mission check to verify understanding and earn your stars! ⭐`;
        } else {
          replyContent = isArabic
            ? `رائع جداً! كل مهام اليوم مسجلة كمكتملة، ولا توجد مهمة قيد التنفيذ الآن.`
            : `Great! All missions are already completed, no active mission pending right now.`;
        }
      }
      // 3. Check Mission Intent: "Skip this"
      else if (isSkipIntent(content)) {
        const targetMission =
          activeMission ||
          missionsForToday.find((m) => m.status === 'started') ||
          missionsForToday.find((m) => m.status === 'pending');

        if (targetMission) {
          await skipMission(targetMission.id, 'Student skipped via companion chat');
          replyContent = isArabic
            ? `تم تخطي مهمة «${targetMission.title}» بناءً على رغبتك.\n\n📌 الملاحظة والأثر الأكاديمي:\nلا تقلق إطلاقاً يا ${studentName}! هذا ليس تقصيراً. سنقوم فقط بإعادة إدراج هذه المفاهيم في خطة قادمة بهدوء حتى لا تفوتك أساسيات المادة، وبدون أي إرهاق لوقتك اليوم.`
            : `Mission "${targetMission.title}" has been skipped per your request.\n\n📌 Consequence & Note:\nNo worries at all, ${studentName}! This is not a failure. We will simply reschedule these concepts in a future study session so you stay on track, keeping your schedule stress-free.`;
        } else {
          replyContent = isArabic
            ? `لا توجد مهمة نشطة لتخطيها حالياً.`
            : `There is no active mission to skip right now.`;
        }
      }
      // 4. Check Daily Review Intent: "wrap up today" / "لخص يومي"
      else if (isWrapUpIntent(content)) {
        const review = await openDailyReview();
        replyContent = isArabic
          ? `حاضر يا ${studentName}! قمت بإعداد المراجعة اليومية الهادئة:\n\n✨ إنجاز اليوم: ${review.tonePraise}\n🧭 الخطوة القادمة: ${review.uncompletedActionNote}\n\nتم فتح نافذة المراجعة التفصيلية لتطّلع عليها بارتياح.`
          : `Sure thing, ${studentName}! I have prepared your calm daily review:\n\n✨ Win Today: ${review.tonePraise}\n🧭 Next Step: ${review.uncompletedActionNote}\n\nYour Daily Review card has been opened for you.`;
      }
      // 4b. Check Weekly Review Intent: "show my week" / "لخص أسبوعي"
      else if (isWeeklyReviewIntent(content)) {
        const wkReview = await generateAndOpenWeeklyReview(true);
        replyContent = isArabic
          ? `بكل سرور يا ${studentName}! قمت بإعداد ملخص أسبوعك الدراسي:\n\n🌟 ${wkReview.toneMessageAr}\n\n📊 إنجاز الواجبات: ${wkReview.homeworkCompletion.completed}/${wkReview.homeworkCompletion.total} (${wkReview.homeworkCompletion.percentage}٪)\n🎯 التركيز المقترح للأسبوع القادم: ${wkReview.recommendedFocus.rationaleAr}\n\nتم فتح تبويب المراجعة لتتصفح كامل تفاصيل أسبوعك بهدوء.`
          : `With pleasure, ${studentName}! I have prepared your weekly summary:\n\n🌟 ${wkReview.toneMessageEn}\n\n📊 Homework: ${wkReview.homeworkCompletion.completed}/${wkReview.homeworkCompletion.total} (${wkReview.homeworkCompletion.percentage}%)\n🎯 Recommended focus: ${wkReview.recommendedFocus.rationaleEn}\n\nI have switched to the Review tab for you to see all the details!`;
      }
      // 5. Check AI Tutor Escalation Ladder ("I don't understand" / "Explain differently")
      else if (isEscalationTrigger(content)) {
        const targetConceptId =
          activeMission?.conceptId ||
          missionsForToday.find((m) => m.conceptId)?.conceptId ||
          '';

        if (!student?.id || !targetConceptId) {
          replyContent = isArabic
            ? 'أحتاج أولاً إلى تحديد الطالب والمفهوم الذي نعمل عليه. افتحي مهمة اليوم أو اختاري درساً من المنهج، ثم قولي لي «اشرحي بطريقة تانية».'
            : 'I first need the active student and the concept we are working on. Open today’s mission or choose a curriculum lesson, then ask me to explain it differently.';
        } else {
          const tutorResponse = advanceTutorEscalation({
          studentId: student?.id || '',
          conceptId: targetConceptId,
          sessionId: 'companion_session',
          language,
        });

        const label = isArabic ? tutorResponse.modalityLabelAr : tutorResponse.modalityLabelEn;
        const attemptLabel = isArabic
          ? `(المحاولة ${tutorResponse.state.attemptCount} من ٥)`
          : `(Attempt ${tutorResponse.state.attemptCount} of 5)`;

        replyContent = `[${label} ${attemptLabel}]\n\n${tutorResponse.text}`;

        if (tutorResponse.checkQuestion) {
          const q = tutorResponse.checkQuestion;
          replyContent += isArabic
            ? `\n\n❓ سؤال فحص فهم تشجيعي:\n${q.question}\n• الخيارات: ${q.options?.join(' | ')}`
            : `\n\n❓ Comprehension Check Question:\n${q.question}\n• Options: ${q.options?.join(' | ')}`;
        }

        if (tutorResponse.modality === 'flag_for_review') {
          replyContent += isArabic
            ? `\n\n📌 ملحوظة: تم وسم المفهوم لخانة (المراجعة اللاحقة) لحمايتك من الإرهاق. ما رأيك أن ننتقل لنشاط آخر خفيف؟`
            : `\n\n📌 Note: Concept marked for (Later Review) to prevent fatigue. Would you like to move on to a lighter activity?`;
        }
        }
      }
      // 6. Check Student Frustration / Disengagement (Failure mode 1g)
      // "Signal detected (session drop, skip streak, tone) -> Companion offers a break or lighter load -> No guilt"
      else if (isFrustrationIntent(content)) {
        replyContent = isArabic
          ? `سلامتك يا ${studentName}! لما تحس بالتعب أو الزهق، أحسن قرار هو إنك تاخد راحة (10 إلى 15 دقيقة) وتفصل خالص. راحتك وصحتك أهم من أي مذاكرة.\n\n✨ تحب نخفف خطة اليوم ونكتفي بما أنجزته، ولا نوقف خالص دلوقتي وتستريح؟ مفيش أي مشكلة إطلاقاً، والأيام جاية!`
          : `Take a deep breath and a gentle pause, ${studentName}! When fatigue or frustration hits, taking a 10-15 minute screen break is the best move. Your well-being comes first.\n\n✨ Would you like to lighten today's missions or call it a day? Zero guilt either way!`;
      }
      // 6b. Check Parent Override Intent (Failure mode 1h: Student asks why)
      else if (isParentOverrideIntent(content)) {
        const msg = plannerExplanation?.parentOverrideMessage;
        replyContent = isArabic
          ? `سؤال في محله يا ${studentName}! تم ضبط خطة المذاكرة اليوم لتراعي توجيه ولي أمرك:\n\n🛡️ «${msg || 'تم وضع حد زمني مناسب أو موعد نوم هادئ'}»\n\nالهدف مش تقليل قدراتك، بل حمايتك من السهر والإرهاق عشان تستمتع بيومك وتصحى بكامل نشاطك. وظيفتي أساعدك تنجز الأساسيات في هذا الوقت بدون أي ضغط!`
          : `Great question, ${studentName}! Your study plan was adapted to respect your parent's settings:\n\n🛡️ "${msg || 'Daily study limit or bedtime set by parent'}"\n\nThis isn't a restriction, but a healthy safeguard against fatigue and late nights so you can rest. I'm here to ensure you get the most out of your focused study time comfortably!`;
      }
      // 7. General Chat via server proxy with 15s timeout & telemetry
      else {
        const { data } = await costLatencyService.instrumentedFetch(
          '/api/chat',
          {
            messages: updatedHistory.slice(-8).map((m) => ({
              role: m.role,
              content: m.content,
            })),
            studentName,
            grade: student?.grade || 'Grade 5',
            language,
            schoolBrainContext: {
              studentId: student?.id,
              school: student?.school,
              location: student?.location,
              curriculumTrack: student?.curriculumTrack,
              dayRecord: currentDayRecord
                ? {
                    date: currentDayRecord.date,
                    confirmed: currentDayRecord.confirmed,
                    lessons: currentDayRecord.lessons,
                    homework: currentDayRecord.homework,
                    notes: currentDayRecord.notes,
                  }
                : null,
              activeMission: activeMission
                ? {
                    id: activeMission.id,
                    subjectId: activeMission.subjectId,
                    conceptId: activeMission.conceptId,
                    title: activeMission.title,
                    status: activeMission.status,
                    whyNow: activeMission.whyNow,
                  }
                : null,
            },
          },
          {
            studentId: student?.id,
            language: isArabic ? 'ar' : 'en',
            timeoutMs: 15000,
          }
        );

        replyContent =
          data.reply ||
          (isArabic ? 'أنا معاك، نقدر نكمل!' : "I'm with you, let's continue!");
      }

      const assistantMessage: ChatMessage = {
        id: 'msg_a_' + Date.now(),
        role: 'assistant',
        content: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      const finalMessages = [...updatedHistory, assistantMessage];
      setMessages(finalMessages);

      // Auto-voice if enabled in settings
      if (settings?.companionVoiceEnabled) {
        voiceService.speak(replyContent, language);
      }

      // Persist to storage
      if (student?.id) {
        await storageService.saveConversation({
          id: 'conv_' + student.id,
          studentId: student.id,
          messages: finalMessages,
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      const assistantFallback: ChatMessage = {
        id: 'msg_fallback_' + Date.now(),
        role: 'assistant',
        content: isArabic
          ? 'سمعتك بوضوح. كرفيق ذكاء اصطناعي، أنا مبرمج أكون معاك في كل خطوة. نقدر نرتب جدولك وموادك في أي لحظة.'
          : 'I heard you clearly. As your AI companion, I am set up to assist you with every step of your study routine.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      const finalMessages = [...updatedHistory, assistantFallback];
      setMessages(finalMessages);
    } finally {
      setIsSending(false);
    }
  };

  const handleClearChat = async () => {
    if (!confirm(isArabic ? 'هل تريد مسح سجل المحادثة بالكامل؟' : 'Clear entire conversation transcript?')) return;
    const initialGreeting: ChatMessage = {
      id: 'msg_welcome_' + Date.now(),
      role: 'assistant',
      content: isArabic
        ? `أهلاً يا ${studentName}! تم مسح سجل المحادثة السابق. أنا رفيقك التعليمي، هنا لمساعدتك في أي وقت بهدوء وبدون أي ضغط.`
        : `Hello ${studentName}! Previous transcript cleared. I'm here whenever you need study help without stress.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([initialGreeting]);
    if (student?.id) {
      await storageService.saveConversation({
        id: 'conv_' + student.id,
        studentId: student.id,
        messages: [initialGreeting],
        updatedAt: new Date().toISOString(),
      });
    }
  };

  const samplePrompts = [
    t.companion.intentWhatShouldIDoNow,
    t.companion.intentIFinished,
    t.companion.intentSkipThis,
    t.companion.intentDontUnderstand,
    t.companion.intentExplainDifferently,
    t.companion.intentTestMe,
  ];

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-8.5rem)] max-w-lg mx-auto w-full">
      {/* Top Companion Header */}
      <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {t.companion.title}
              </h3>
              <Badge variant="ai">AI Companion</Badge>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {t.companion.subheading}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleClearChat}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all"
            title={isArabic ? 'مسح سجل المحادثة' : 'Clear conversation history'}
            aria-label={isArabic ? 'مسح سجل المحادثة' : 'Clear conversation history'}
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setShowReconstructModal(true)}
            className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1.5 transition-all ${
              currentDayRecord?.confirmed
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-800 dark:text-emerald-300'
                : 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-300 text-indigo-800 dark:text-indigo-300 hover:bg-indigo-100'
            }`}
            title={t.dayRecord.title}
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>{currentDayRecord?.confirmed ? t.dayRecord.confirmedBadge : t.dayRecord.title}</span>
          </button>
        </div>
      </div>

      {/* Role Notice Banner */}
      <div className="px-3.5 py-2 bg-indigo-50/70 dark:bg-indigo-950/30 border-b border-indigo-100 dark:border-indigo-900/40 text-[11px] text-indigo-900 dark:text-indigo-200 flex items-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
        <span>{t.companion.systemRoleDescription}</span>
      </div>

      {/* PHASE 11: Direct Link to The Stage with Nour */}
      <div className="mx-3.5 my-2 p-3 rounded-2xl bg-linear-to-r from-indigo-950 via-indigo-900 to-purple-950 text-white flex items-center justify-between shadow-md border border-indigo-400/30">
        <div className="space-y-0.5 text-right rtl:text-right ltr:text-left flex-1">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="text-xs font-black">
              {isArabic ? 'المسرح التفاعلي مع نور 🎭' : 'The Interactive Stage with Nour 🎭'}
            </span>
          </div>
          <p className="text-[11px] text-indigo-200">
            {isArabic
              ? 'جرّبي تجربة المعلم الناطق والمتحرك بالصوت واللمس لدرس «لم أوت ماء النهر»!'
              : 'Try the voice-first animated tutor lesson for "River Nile Oath"!'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowStage(true)}
          className="px-3.5 py-2 rounded-xl bg-linear-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs shadow-xs transition-all shrink-0 hover:scale-102 cursor-pointer"
        >
          {isArabic ? 'افتح المسرح 🎬' : 'Open Stage 🎬'}
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 ${
                  isUser
                    ? 'bg-slate-700 text-white'
                    : 'bg-indigo-600 text-white shadow-xs'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                  isUser
                    ? 'bg-indigo-600 text-white rounded-br-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-800 shadow-xs rounded-bl-xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
                <div
                  className={`text-[9px] mt-1.5 flex items-center justify-between gap-2 ${
                    isUser ? 'text-indigo-200' : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {!isUser && (
                    <VoiceSpeakButton
                      text={msg.content}
                      size="sm"
                      className="ml-auto rtl:ml-0 rtl:mr-auto"
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isSending && (
          <div className="flex items-center gap-2 text-xs text-slate-400 italic">
            <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center">
              <Bot className="w-4 h-4 text-indigo-600" />
            </div>
            <span>{t.companion.typing}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="px-3 pb-2">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(p)}
              disabled={isSending}
              className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-600 dark:text-slate-300 text-[11px] font-medium whitespace-nowrap border border-slate-200 dark:border-slate-700 transition-colors"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Input Bar */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <VoiceInputControl
            buttonSize="md"
            onTranscriptConfirmed={(confirmedText) => {
              handleSendMessage(confirmedText);
            }}
            onFallbackToText={() => {
              inputRef.current?.focus();
            }}
          />

          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t.companion.inputPlaceholder}
            disabled={isSending}
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isSending}
            className="px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-semibold text-xs shadow-sm transition-all flex items-center justify-center shrink-0"
          >
            <Send className="w-4 h-4 rtl:rotate-180" />
          </button>
        </form>
      </div>

      {showReconstructModal && (
        <DayRecordFlowModal onClose={() => setShowReconstructModal(false)} />
      )}

      {isDailyReviewOpen && currentDailyReview && (
        <DailyReviewModal
          review={currentDailyReview}
          onClose={closeDailyReview}
        />
      )}

      {/* PHASE 11: The Stage Modal */}
      {showStage && (
        <StageModal
          lessonId="off_ar_u1_l2"
          onClose={() => setShowStage(false)}
        />
      )}
    </div>
  );
};
