/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  TeachingSession,
  SessionStep,
  TeachingModality,
  TutorTurn,
  OfficialCurriculumLesson,
  CurriculumLessonConcept,
  StructuredVisualData,
} from '../../types/teachingSession';
import { curriculumService } from '../curriculum/curriculumService';

export interface AdvanceSessionInput {
  session: TeachingSession;
  studentInput?: string;
  isAudio?: boolean;
  language?: 'ar' | 'en' | 'fr';
  forceVisual?: boolean;
}

export interface AdvanceSessionResult {
  session: TeachingSession;
  newTutorTurn: TutorTurn;
  masteryUpdate?: {
    conceptId: string;
    correctness: 'full' | 'partial' | 'wrong';
    independence: 'unassisted' | 'hinted' | 'revealed';
    modality: 'reel_check' | 'quiz';
  };
  shouldTriggerVisual?: boolean;
  isSessionCompleted?: boolean;
}

/**
 * Pure TypeScript, decoupled Teaching Session State Machine & Tutor Engine.
 * Enforces the strict 9-step Teaching Loop, 6-attempt Escalation Ladder,
 * mandatory Explain-it-back verification, and Source-Grounding rules.
 */
export class TeachingSessionEngine {
  /**
   * Initialize a brand new session or resume an existing one
   */
  public initializeSession(params: {
    studentId: string;
    lessonId: string;
    existingSession?: TeachingSession | null;
    language?: 'ar' | 'en' | 'fr';
  }): { session: TeachingSession; greetingTurn: TutorTurn } {
    const { studentId, lessonId, existingSession, language } = params;

    const lesson = curriculumService.getLessonById(lessonId);
    if (!lesson) {
      throw new Error(`Lesson ${lessonId} not found in official curriculum.`);
    }

    const effectiveLang = this.resolveLanguage(language, lesson.language);
    const isAr = effectiveLang === 'ar';
    const isFr = effectiveLang === 'fr';

    // Check if resuming an unfinished session
    if (existingSession && existingSession.status === 'in_progress') {
      const currentConcept = lesson.concepts[existingSession.currentConceptIndex] || lesson.concepts[0];
      const resumeGreeting = isFr
        ? `Rebonjour cher ami ! La dernière fois, nous explorions «${currentConcept.titleEn}» de la leçon «${lesson.titleEn}» (${lesson.sourceRef.bookEn}). Es-tu prêt à continuer ?`
        : isAr
        ? `أهلاً بك مجدداً يا بطل! في المرة السابقة كنا ندرس معاً «${currentConcept.titleAr}» من درس «${lesson.titleAr}» (${lesson.sourceRef.bookAr}). هل تحب أن نكمل من حيث توقفنا؟`
        : `Welcome back, friend! Last time we were exploring "${currentConcept.titleEn}" from "${lesson.titleEn}" (${lesson.sourceRef.bookEn}). Ready to pick up right where we left off?`;

      const greetingTurn: TutorTurn = {
        id: `turn_greet_${Date.now()}`,
        role: 'tutor',
        step: 'greet',
        text: resumeGreeting,
        sourceRef: lesson.sourceRef,
        timestamp: new Date().toISOString(),
      };

      const resumedSession: TeachingSession = {
        ...existingSession,
        lastActiveAt: new Date().toISOString(),
        turnHistory: [...existingSession.turnHistory, greetingTurn],
      };

      return { session: resumedSession, greetingTurn };
    }

    // Create a brand new session
    const sessionId = `teach_sess_${lessonId}_${Date.now()}`;

    const greetingText = isFr
      ? `Bonjour cher ami ! Je suis ton tuteur et compagnon d'apprentissage. Aujourd'hui, nous allons étudier ensemble une belle leçon de ton manuel : «${lesson.titleEn}» (${lesson.sourceRef.bookEn}). Prêt à commencer ?`
      : isAr
      ? `أهلاً بك يا بطل! أنا رفيقك التعليمي ومعلمك الخصوصي. اليوم سنجلس معاً لنتعلم بهدوء درساً ممتعاً من كتابك المدرسي: «${lesson.titleAr}» (${lesson.sourceRef.bookAr}). جاهز لنبدأ؟`
      : `Hello there! I am your personal study companion and tutor. Today we will sit down together to explore a great lesson from your textbook: "${lesson.titleEn}" (${lesson.sourceRef.bookEn}). Ready to begin?`;

    const greetingTurn: TutorTurn = {
      id: `turn_greet_${Date.now()}`,
      role: 'tutor',
      step: 'greet',
      text: greetingText,
      sourceRef: lesson.sourceRef,
      timestamp: new Date().toISOString(),
    };

    const newSession: TeachingSession = {
      sessionId,
      studentId,
      lessonId,
      subjectId: lesson.subjectId,
      startedAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      currentConceptIndex: 0,
      totalConcepts: lesson.concepts.length,
      currentStep: 'greet',
      currentAttemptCount: 0,
      modalityHistory: [],
      turnHistory: [greetingTurn],
      explainBackDone: false,
      offBookQuestions: [],
      status: 'in_progress',
    };

    return { session: newSession, greetingTurn };
  }

  /**
   * Advance the teaching loop based on student response
   */
  public advanceSession(input: AdvanceSessionInput): AdvanceSessionResult {
    let { session } = input;
    const { studentInput = '', isAudio = false, language, forceVisual = false } = input;

    const lesson = curriculumService.getLessonById(session.lessonId);
    if (!lesson) {
      throw new Error(`Lesson ${session.lessonId} not found.`);
    }

    const effectiveLang = this.resolveLanguage(language, lesson.language, studentInput);
    const isAr = effectiveLang === 'ar';
    const isFr = effectiveLang === 'fr';

    const currentConcept: CurriculumLessonConcept | undefined =
      lesson.concepts[session.currentConceptIndex] || lesson.concepts[0];

    // Record student turn if text provided
    const updatedTurns = [...session.turnHistory];
    if (studentInput.trim()) {
      updatedTurns.push({
        id: `turn_stu_${Date.now()}`,
        role: 'student',
        step: session.currentStep,
        text: studentInput.trim(),
        timestamp: new Date().toISOString(),
      });
    }

    // 1. Check for off-book questions (Sub-Phase 9.3 rule)
    const isOffBook = this.checkIsOffBook(studentInput, lesson, currentConcept);
    if (isOffBook && studentInput.trim().length > 5) {
      const offBookReply = isFr
        ? `C'est une excellente question très curieuse ! Cependant, elle n'est pas dans notre leçon d'aujourd'hui. Concentrons-nous sur ce que ton enseignant va évaluer dans (${lesson.sourceRef.bookEn}), et j'ai noté ta belle question pour en discuter plus tard !`
        : isAr
        ? `سؤال ذكي وفضولي جداً! لكنه خارج كتابنا لدرس اليوم. دعني أركز معك على ما يختبرك فيه المعلم من (${lesson.sourceRef.bookAr})، وسجلت سؤالك الجميل هذا لنتحدث عنه لاحقاً مع والديك!`
        : `That’s a brilliant curious question! It’s not in our textbook lesson today though. Let’s focus on what your teacher will test you on from (${lesson.sourceRef.bookEn}), and I saved your great question for later!`;

      const tutorTurn: TutorTurn = {
        id: `turn_tut_${Date.now()}`,
        role: 'tutor',
        step: session.currentStep,
        text: offBookReply,
        sourceRef: lesson.sourceRef,
        offBookDetected: true,
        timestamp: new Date().toISOString(),
      };

      const updatedSession: TeachingSession = {
        ...session,
        lastActiveAt: new Date().toISOString(),
        turnHistory: [...updatedTurns, tutorTurn],
        offBookQuestions: [
          ...session.offBookQuestions,
          {
            question: studentInput.trim(),
            timestamp: new Date().toISOString(),
            parentNote: isFr
              ? `L'élève a posé une question exploratoire hors programme : "${studentInput.trim()}".`
              : isAr
              ? `سأل الطالب سؤالاً استكشافياً خارج المقرر: "${studentInput.trim()}".`
              : `Student asked an exploratory off-book question: "${studentInput.trim()}".`,
          },
        ],
      };

      return { session: updatedSession, newTutorTurn: tutorTurn };
    }

    // 2. Handle on-demand visual request
    if (forceVisual) {
      const visualData = this.buildStructuredVisual(currentConcept, lesson);
      const visualTurn: TutorTurn = {
        id: `turn_tut_vis_${Date.now()}`,
        role: 'tutor',
        step: 'visual',
        text: isFr
          ? `Voici un schéma visuel tiré de ton livre (${lesson.sourceRef.bookEn}) pour rendre l'idée parfaitement claire. Regarde et dis-moi ce que tu remarques !`
          : isAr
          ? `تفضل يا بطل! أعددت لك هذا الرسم التوضيحي من كتابك المدرسي (${lesson.sourceRef.bookAr}) ليسهل عليك استيعاب الفكرة تماماً. ألقِ نظرة عليه وقل لي ما الذي لاحظته؟`
          : `Here you go! I prepared this structured visual straight from your textbook (${lesson.sourceRef.bookEn}) to make the idea crystal clear. Take a look and tell me what you see!`,
        sourceRef: lesson.sourceRef,
        modalityUsed: 'structured_visual',
        visualData,
        timestamp: new Date().toISOString(),
      };

      const updatedSession: TeachingSession = {
        ...session,
        lastActiveAt: new Date().toISOString(),
        activeVisual: visualData,
        modalityHistory: [...session.modalityHistory, 'structured_visual'],
        turnHistory: [...updatedTurns, visualTurn],
        currentStep: 'adjust',
      };

      return { session: updatedSession, newTutorTurn: visualTurn, shouldTriggerVisual: true };
    }

    // 3. Main Step Sequence Router
    let nextStep: SessionStep = session.currentStep;
    let replyText = '';
    let modalityUsed: TeachingModality | undefined;
    let visualData: StructuredVisualData | undefined;
    let masteryUpdate: AdvanceSessionResult['masteryUpdate'] | undefined;
    let isSessionCompleted = false;

    switch (session.currentStep) {
      case 'greet': {
        // Step 1 -> Step 2: Warm-up
        nextStep = 'warmup';
        replyText = isFr
          ? `Formidable ! Avant de commencer, échauffons nos méninges avec une petite question : Te rappelles-tu d'un moment où tu as aidé quelqu'un ou économisé une ressource précieuse ? (Juste un petit échauffement pour réveiller notre esprit !)`
          : isAr
          ? `ممتاز! قبل أن ندخل في الدرس، لنسخن أذهاننا بسؤال بسيط وخفيف: هل تذكر متى احتجت لترشيد شيء أو مساعدة شخص آخر في حياتك؟ (لا تقلق، هذا سؤال تنشيطي فقط لنبدأ به!)`
          : `Awesome! Before we jump in, let's warm up with a simple thought: Do you remember a time you helped someone or saved something precious? (Just a quick warm-up to get our minds ready!)`;
        break;
      }

      case 'warmup': {
        // Step 2 -> Step 3: Teach Concept from Source
        nextStep = 'teach';
        modalityUsed = 'source_explanation';
        replyText = isFr
          ? `Très bien ! Ouvrons notre manuel (${lesson.sourceRef.bookEn}) pour notre première notion : «${currentConcept.titleEn}».\n\n📖 Texte du manuel :\n"${currentConcept.sourceText}"\n\n📌 Points clés :\n${currentConcept.keyPoints.map((p) => `• ${p}`).join('\n')}\n\nPrends le temps d'assimiler ceci, et dis-moi quand tu es prêt !`
          : isAr
          ? `رائع جداً! الآن لنفتح كتابنا (${lesson.sourceRef.bookAr}) ونبدأ بالفكرة الأولى: «${currentConcept.titleAr}».\n\n📖 من نص الكتاب المدرسي:\n"${currentConcept.sourceText}"\n\n📌 النقاط الجوهرية:\n${currentConcept.keyPoints.map((p) => `• ${p}`).join('\n')}\n\n(خذ نفساً هادئاً، وعندما تكون مستعداً اخبرني لننتقل للخطوة التالية!)`
          : `Great! Now let’s open our textbook (${lesson.sourceRef.bookEn}) to our first concept: "${currentConcept.titleEn}".\n\n📖 From the textbook:\n"${currentConcept.sourceText}"\n\n📌 Key Points:\n${currentConcept.keyPoints.map((p) => `• ${p}`).join('\n')}\n\nTake your time to absorb this! Tell me when you're ready to continue.`;
        break;
      }

      case 'teach': {
        // Step 3 -> Step 4: Ask Open-Ended Check
        nextStep = 'ask';
        replyText = isFr
          ? `Maintenant cher ami, avec tes propres mots et sans mémorisation : qu'as-tu compris de «${currentConcept.titleEn}» ? (Explique-moi librement, je t'écoute !)`
          : isAr
          ? `الآن يا صديقي، بكلماتك البسيطة الخاصة وبدون حفظ حرفي: ما الذي فهمته من كلامنا عن «${currentConcept.titleAr}»؟ (احكِ لي بحرية، لا توجد إجابة خطأ هنا!)`
          : `Now friend, in your own words without memorization: what did you understand about "${currentConcept.titleEn}"? (Tell me freely, I am listening!)`;
        break;
      }

      case 'ask': {
        // Evaluate student's understanding
        const evalScore = this.evaluateStudentUnderstanding(studentInput, currentConcept);

        if (evalScore >= 0.7) {
          // Good grasp! Proceed to Step 7: Mandatory Explain-it-back
          nextStep = 'explain_back';
          replyText = isFr
            ? `Excellente compréhension ! 👍\n\nEt maintenant, voici le vrai test du maître :\n«À ton tour de m'enseigner ! Explique-moi la notion de '${currentConcept.titleEn}' comme si j'étais un nouvel élève qui ne sait absolument rien !»`
            : isAr
            ? `استيعاب رائع وتفكير سليم يا بطل! 👍\n\nوالآن جاء الاختبار الحقيقي للمعلم الماهر:\n«دورك الآن لتعلمني! اشرح لي فكرة "${currentConcept.titleAr}" وكأني طالب جديد لا أعرف أي شيء عنها على الإطلاق!»`
            : `Spot-on understanding! 👍\n\nNow comes the true test of a master:\n"Now you teach me! Explain '${currentConcept.titleEn}' as if I know absolutely nothing about it!"`;
        } else {
          // Needs escalation: Step 5 Adjust via Escalation Ladder
          nextStep = 'adjust';
          const attempt = session.currentAttemptCount + 1;
          const escalation = this.getEscalationResponse(attempt, currentConcept, lesson, effectiveLang);
          modalityUsed = escalation.modality;
          visualData = escalation.visualData;
          replyText = escalation.text;
        }
        break;
      }

      case 'adjust': {
        // Check student's response to the escalated explanation
        const evalScore = this.evaluateStudentUnderstanding(studentInput, currentConcept);

        if (evalScore >= 0.65) {
          // Understood through the ladder! Advance to mandatory explain-it-back
          nextStep = 'explain_back';
          replyText = isFr
            ? `Formidable ! Maintenant l'idée est limpide. 🎯\n\nÀ ton tour de m'enseigner ! Explique-moi «${currentConcept.titleEn}» avec tes propres mots comme si je n'avais pas lu le manuel !`
            : isAr
            ? `ممتاز جداً! الآن وصلت الفكرة بوضوح. 🎯\n\nوكما اتفقنا، لا يكتمل فهم درس إلا عندما تشرحه:\n«دورك الآن لتعلمني! اشرح لي فكرة "${currentConcept.titleAr}" بطريقتك الخاصة وكأني صديقك الذي لم يقرأ الدرس بعد!»`
            : `Terrific! Now the concept is crystal clear. 🎯\n\nNow you teach me! Explain "${currentConcept.titleEn}" in your own words as if I haven't read the textbook yet!`;
        } else if (session.currentAttemptCount >= 5) {
          // Reached Attempt 6: Flag for review gently
          nextStep = 'celebrate';
          modalityUsed = 'flag_for_review';
          replyText = isFr
            ? `Bravo pour tes efforts persévérants ! 🌟 Nous avons noté «${currentConcept.titleEn}» pour une révision calme demain sans surcharge. Ton confort passe avant tout !`
            : isAr
            ? `أحسنت المحاولة والجهد الكبير يا بطل! 🌟 وضعنا مفهوم «${currentConcept.titleAr}» في بطاقة (المراجعة اللاحقة) لنمر عليه غداً بروقان وبدون أي إجهاد. صحتك وراحتك هي الأهم دائماً!`
            : `Wonderful effort and persistence! 🌟 We flagged "${currentConcept.titleEn}" for a calm review tomorrow so you never feel overloaded. Your comfort always comes first!`;
        } else {
          // Continue climbing the escalation ladder
          const attempt = session.currentAttemptCount + 1;
          const escalation = this.getEscalationResponse(attempt, currentConcept, lesson, effectiveLang);
          modalityUsed = escalation.modality;
          visualData = escalation.visualData;
          replyText = escalation.text;
        }
        break;
      }

      case 'explain_back': {
        // Explain-back is the recheck/evaluation gate. Length alone is never enough.
        const explanation = studentInput.trim();
        const analysis = this.evaluateExplainBack(explanation, currentConcept);

        const evidence = {
          text: explanation,
          quality: analysis.quality,
          conceptKeywordMatches: analysis.conceptKeywordMatches,
          keyPointMatches: analysis.keyPointMatches,
          confidence: analysis.confidence,
          capturedAt: new Date().toISOString(),
        } as TeachingSession['explainBackEvidence'];

        if (analysis.quality === 'sound') {
          nextStep = 'celebrate';
          masteryUpdate = {
            conceptId: currentConcept.id,
            correctness: 'full',
            independence: session.currentAttemptCount === 0 ? 'unassisted' : 'hinted',
            modality: 'quiz',
          };

          replyText = isFr
            ? `Excellente explication de «${currentConcept.titleEn}» ! 🌟 Tu as relié l'idée aux points essentiels du cours.`
            : isAr
            ? `شرح قوي ومبني على الفكرة الأساسية في «${currentConcept.titleAr}»! 🌟 دلوقتي عندنا دليل حقيقي على الفهم، مش مجرد إجابة صحيحة.`
            : `Strong explanation of "${currentConcept.titleEn}"! 🌟 You connected the idea to the key points, so we have real evidence of understanding.`;

          if (session.currentConceptIndex < lesson.concepts.length - 1) {
            const nextConcept = lesson.concepts[session.currentConceptIndex + 1];
            replyText += isFr
              ? `\\n\\n✨ Passons maintenant à «${nextConcept.titleEn}» ?`
              : isAr
              ? `\\n\\n✨ والآن ننتقل للمفهوم التالي: «${nextConcept.titleAr}»؟`
              : `\\n\\n✨ Shall we move to the next concept: "${nextConcept.titleEn}"?`;
          } else {
            isSessionCompleted = true;
            nextStep = 'close';
            replyText += isFr
              ? `\\n\\n🎉 Félicitations ! Toutes les notions de «${lesson.titleEn}» sont maintenant vérifiées.`
              : isAr
              ? `\\n\\n🎉 ممتاز! تم التحقق من فهم جميع مفاهيم درس «${lesson.titleAr}».`
              : `\\n\\n🎉 Excellent! All concepts in "${lesson.titleEn}" have now been verified.`;
          }
        } else {
          // Weak/guessing explain-back: no mastery evidence. Return to targeted practice.
          nextStep = 'adjust';
          const attempt = session.currentAttemptCount + 1;
          const escalation = this.getEscalationResponse(attempt, currentConcept, lesson, effectiveLang);
          modalityUsed = escalation.modality;
          visualData = escalation.visualData;
          replyText = isFr
            ? `Ton idée est encore partielle. Je ne vais pas compter cela comme une maîtrise tout de suite. Reprenons avec une autre façon d'expliquer, puis tu réessaieras.\\n\\n${escalation.text}`
            : isAr
            ? `لسه محتاجين دليل أوضح على الفهم، فمش هاعتبر المفهوم متقن دلوقتي. هنغيّر طريقة الشرح ونجرّب تاني.\\n\\n${escalation.text}`
            : `We need stronger evidence of understanding, so I won't mark this mastered yet. Let's change the teaching strategy and try again.\\n\\n${escalation.text}`;
        }

        const evidenceTurn: TutorTurn = {
          id: `turn_evidence_${Date.now()}`,
          role: 'system',
          step: nextStep,
          text: '',
          isExplainBack: true,
          timestamp: new Date().toISOString(),
        };

        const updatedSessionWithEvidence: TeachingSession = {
          ...session,
          explainBackEvidence: evidence,
          explainBackDone: analysis.quality === 'sound',
          lastActiveAt: new Date().toISOString(),
          turnHistory: [...updatedTurns, evidenceTurn],
        };

        // Continue through the common final session update below.
        session = updatedSessionWithEvidence;
        break;
      }

      case 'celebrate': {
        if (session.currentConceptIndex < lesson.concepts.length - 1) {
          // Advance to next concept
          const nextConceptIdx = session.currentConceptIndex + 1;
          const nextConcept = lesson.concepts[nextConceptIdx];
          nextStep = 'teach';
          modalityUsed = 'source_explanation';

          replyText = isFr
            ? `En route ! La notion suivante dans notre manuel (${lesson.sourceRef.bookEn}) est : «${nextConcept.titleEn}».\n\n📖 Texte :\n"${nextConcept.sourceText}"\n\n📌 Points clés :\n${nextConcept.keyPoints.map((p) => `• ${p}`).join('\n')}\n\nQu'en penses-tu ?`
            : isAr
            ? `على بركة الله! المفهوم التالي في كتابنا (${lesson.sourceRef.bookAr}) هو: «${nextConcept.titleAr}».\n\n📖 من نص الدرس:\n"${nextConcept.sourceText}"\n\n📌 النقاط الرئيسية:\n${nextConcept.keyPoints.map((p) => `• ${p}`).join('\n')}\n\nما رأيك في هذه النقطة؟`
            : `Let's proceed! The next concept in our textbook (${lesson.sourceRef.bookEn}) is: "${nextConcept.titleEn}".\n\n📖 Text:\n"${nextConcept.sourceText}"\n\n📌 Key Points:\n${nextConcept.keyPoints.map((p) => `• ${p}`).join('\n')}\n\nWhat are your thoughts on this?`;

          const tutorTurn: TutorTurn = {
            id: `turn_tut_${Date.now()}`,
            role: 'tutor',
            step: nextStep,
            text: replyText,
            sourceRef: lesson.sourceRef,
            modalityUsed,
            timestamp: new Date().toISOString(),
          };

          const updatedSession: TeachingSession = {
            ...session,
            currentConceptIndex: nextConceptIdx,
            currentStep: nextStep,
            currentAttemptCount: 0,
            explainBackDone: false,
            lastActiveAt: new Date().toISOString(),
            turnHistory: [...updatedTurns, tutorTurn],
          };

          return { session: updatedSession, newTutorTurn: tutorTurn };
        } else {
          nextStep = 'close';
          isSessionCompleted = true;
          replyText = isFr
            ? `La séance d'aujourd'hui est terminée avec brio et sérénité. Je suis fier de ta concentration ! Veux-tu faire une petite pause maintenant ?`
            : isAr
            ? `لقد انتهت جلسة اليوم بنجاح هادئ ومثمر. أنا فخور بك وبتركيزك! هل ترغب في أخذ استراحة الآن؟`
            : `Today's session is successfully complete. I am so proud of your focus! Ready for a restful break?`;
        }
        break;
      }

      case 'close': {
        replyText = isFr
          ? `La séance est terminée et enregistrée. À demain pour une nouvelle aventure d'apprentissage !`
          : isAr
          ? `الجلسة مكتملة ومحفوظة. نلتقي غداً في درس جديد ومغامرة تعليمية ممتعة!`
          : `Session is complete and saved. See you tomorrow for our next learning journey!`;
        break;
      }
    }

    const tutorTurn: TutorTurn = {
      id: `turn_tut_${Date.now()}`,
      role: 'tutor',
      step: nextStep,
      text: replyText,
      sourceRef: lesson.sourceRef,
      modalityUsed,
      visualData,
      isExplainBack: nextStep === 'explain_back',
      timestamp: new Date().toISOString(),
    };

    const updatedSession: TeachingSession = {
      ...session,
      currentStep: nextStep,
      currentAttemptCount: nextStep === 'adjust' ? session.currentAttemptCount + 1 : session.currentAttemptCount,
      explainBackDone: nextStep === 'celebrate' || session.explainBackDone,
      modalityHistory: modalityUsed ? [...session.modalityHistory, modalityUsed] : session.modalityHistory,
      turnHistory: [...updatedTurns, tutorTurn],
      activeVisual: visualData || session.activeVisual,
      lastActiveAt: new Date().toISOString(),
      completedAt: isSessionCompleted ? new Date().toISOString() : session.completedAt,
      status: isSessionCompleted ? 'completed' : 'in_progress',
    };

    return {
      session: updatedSession,
      newTutorTurn: tutorTurn,
      masteryUpdate,
      shouldTriggerVisual: Boolean(visualData),
      isSessionCompleted,
    };
  }

  private evaluateExplainBack(
    input: string,
    concept: CurriculumLessonConcept
  ): {
    quality: 'sound' | 'partial' | 'guessing' | 'unclear';
    conceptKeywordMatches: number;
    keyPointMatches: number;
    confidence: 'high' | 'medium' | 'low';
  } {
    const text = (input || '').trim().toLowerCase();
    if (!text) return { quality: 'unclear', conceptKeywordMatches: 0, keyPointMatches: 0, confidence: 'low' };

    const conceptTerms = [
      ...concept.titleAr.toLowerCase().split(/\\s+/),
      ...concept.titleEn.toLowerCase().split(/\\s+/),
    ].filter((w) => w.length > 2);

    const keyPointTerms = concept.keyPoints
      .flatMap((p) => p.toLowerCase().split(/\\s+/))
      .filter((w) => w.length > 2);

    const conceptKeywordMatches = [...new Set(conceptTerms.filter((t) => text.includes(t)))].length;
    const keyPointMatches = [...new Set(keyPointTerms.filter((t) => text.includes(t)))].length;

    const guessing = [
      'تخمين', 'مش متأكدة', 'مش متاكد', 'مش عارفة', 'حظ', 'يمكن',
      'guess', 'not sure', 'maybe', 'lucky',
      'au hasard', 'pas sûre', 'peut-être',
    ].some((t) => text.includes(t));

    if (guessing) {
      return { quality: 'guessing', conceptKeywordMatches, keyPointMatches, confidence: 'high' };
    }

    const causal = [
      'لأن', 'عشان', 'علشان', 'بسبب', 'يعني', 'كلما', 'لذلك',
      'because', 'since', 'therefore', 'means',
      'parce que', 'donc', 'cela signifie',
    ].some((t) => text.includes(t));

    if (text.length >= 25 && keyPointMatches >= 1 && (conceptKeywordMatches >= 1 || causal)) {
      return { quality: 'sound', conceptKeywordMatches, keyPointMatches, confidence: 'high' };
    }

    if (text.length >= 10 && (keyPointMatches >= 1 || conceptKeywordMatches >= 1 || causal)) {
      return { quality: 'partial', conceptKeywordMatches, keyPointMatches, confidence: 'medium' };
    }

    return { quality: 'unclear', conceptKeywordMatches, keyPointMatches, confidence: 'low' };
  }

  /**
   * Escalation Ladder (Sub-Phase 9.3)
   * Attempt 1: Normal explanation (from sourceRef)
   * Attempt 2: Simpler example (child's daily life)
   * Attempt 3: Story / analogy / metaphor
   * Attempt 4: Visual (SVG diagram or labeled picture)
   * Attempt 5: Break it into smaller pieces (teach prerequisite)
   * Attempt 6: Flag for review gently; no pressure
   */
  private getEscalationResponse(
    attempt: number,
    concept: CurriculumLessonConcept,
    lesson: OfficialCurriculumLesson,
    effectiveLang: 'ar' | 'en' | 'fr'
  ): { text: string; modality: TeachingModality; visualData?: StructuredVisualData } {
    const isAr = effectiveLang === 'ar';
    const isFr = effectiveLang === 'fr';

    switch (attempt) {
      case 1: {
        return {
          modality: 'source_explanation',
          text: isFr
            ? `Pas de souci ! Regardons cela directement à partir du texte de ton manuel (${lesson.sourceRef.bookEn}) :\n"${concept.sourceText}"\n\nEn clair : ${concept.keyPoints[0]}. Est-ce plus compréhensible ainsi ?`
            : isAr
            ? `لا بأس يا بطل، دعنا ننظر إليها من زاوية أوضح من نص الكتاب المدرسي (${lesson.sourceRef.bookAr}):\n"${concept.sourceText}"\n\nالمقصود هنا ببساطة: ${concept.keyPoints[0]}. هل يبدو هذا أوضح؟`
            : `No problem at all! Let's examine it straight from the textbook text (${lesson.sourceRef.bookEn}):\n"${concept.sourceText}"\n\nSimply put: ${concept.keyPoints[0]}. Does that make more sense?`,
        };
      }

      case 2: {
        return {
          modality: 'daily_life_example',
          text: isFr
            ? `Prenons un exemple de la vie quotidienne :\n${concept.dailyLifeExampleEn}\n\nTu vois ? C'est exactement ce que signifie «${concept.titleEn}». Qu'en penses-tu ?`
            : isAr
            ? `دعنا نأخذ مثالاً من حياتك اليومية:\n${concept.dailyLifeExampleAr}\n\nأرأيت؟ هذا بالضبط ما يقصده درس «${concept.titleAr}». ما رأيك في هذا المثال؟`
            : `Let's connect this to real daily life:\n${concept.dailyLifeExampleEn}\n\nSee? That is exactly what "${concept.titleEn}" is talking about. How does that sound?`,
        };
      }

      case 3: {
        return {
          modality: 'story_analogy',
          text: isFr
            ? `Imagine cette petite histoire et cette comparaison :\n${concept.storyAnalogyEn}\n\nArrives-tu à visualiser la scène ? C'est ainsi que cela fonctionne en réalité !`
            : isAr
            ? `تخيل معي هذه القصة الصغيرة والتشبيه الممتع:\n${concept.storyAnalogyAr}\n\nهل تخيلت الموقف؟ هكذا تماماً تعمل هذه الفكرة في الواقع!`
            : `Picture this vivid little story and analogy:\n${concept.storyAnalogyEn}\n\nCan you picture that scene? That is precisely how this idea works!`,
        };
      }

      case 4: {
        const visualData = this.buildStructuredVisual(concept, lesson);
        return {
          modality: 'structured_visual',
          visualData,
          text: isFr
            ? `Une image vaut mille mots ! J'ai tracé ce schéma visuel tiré de ton manuel (${lesson.sourceRef.bookEn}) :\n«${visualData.titleEn}».\n\nObserve le schéma : que remarques-tu ?`
            : isAr
            ? `الصورة بألف كلمة! رسمت لك هذا المخطط البصري من كتابك المدرسي (${lesson.sourceRef.bookAr}):\n«${visualData.titleAr}».\n\nتأمل الرسم المعروض أمامك وقل لي ماذا ترى؟`
            : `A picture is worth a thousand words! I rendered this structured diagram from your textbook (${lesson.sourceRef.bookEn}):\n"${visualData.titleEn}".\n\nLook at the diagram and tell me what stands out to you?`,
        };
      }

      case 5: {
        return {
          modality: 'break_prerequisite',
          text: isFr
            ? `Décomposons cela en une étape préparatoire plus simple :\n${concept.prerequisiteEn}\n\nUne fois ce socle bien compris, la suite devient facile. Est-ce clair pour toi ?`
            : isAr
            ? `تعال نبسط المسألة أكثر ونفهم الخطوة التمهيدية الأولى:\n${concept.prerequisiteAr}\n\nإذا ضبطنا هذه النقطة البسيطة، ستجد كل ما يليها سهلاً للغاية. هل هذه النقطة الأساسية واضحة لديك؟`
            : `Let's break this down into a simpler prerequisite building block:\n${concept.prerequisiteEn}\n\nOnce we anchor this foundational piece, the rest clicks easily. Does this make sense to you?`,
        };
      }

      case 6:
      default: {
        return {
          modality: 'flag_for_review',
          text: isFr
            ? `Tu es remarquable et tu as donné le meilleur de toi-même ! 🌟 Nous programmons «${concept.titleEn}» pour une révision calme demain, en toute sérénité. Ton bien-être passe toujours en premier !`
            : isAr
            ? `أنت رائع وبذلت وسعك اليوم! 🌟 سنضع مفهوم «${concept.titleAr}» في المراجعة الهادئة غداً لنعود إليها براحة ودون أي ضغط. راحتك وصحتك أهم من أي شيء!`
            : `You did great and gave it your honest effort! 🌟 We will flag "${concept.titleEn}" for a calm spaced review tomorrow so you can rest. Your well-being comes first!`,
        };
      }
    }
  }

  /**
   * Simple semantic check for open-ended answers
   */
  private evaluateStudentUnderstanding(input: string, concept: CurriculumLessonConcept): number {
    const text = input.trim().toLowerCase();
    if (!text || text.length < 4) return 0.2;

    const keywords = [
      ...concept.titleAr.toLowerCase().split(/\s+/),
      ...concept.keyPoints.flatMap((k) => k.toLowerCase().split(/\s+/)),
    ].filter((w) => w.length > 2);

    const matches = keywords.filter((k) => text.includes(k));
    const score = Math.min(1.0, 0.4 + (matches.length / Math.max(3, keywords.length)) * 0.8);
    return score;
  }

  /**
   * Helper to detect off-book questions (Sub-Phase 9.3 rule)
   */
  private checkIsOffBook(
    input: string,
    lesson: OfficialCurriculumLesson,
    concept: CurriculumLessonConcept
  ): boolean {
    const text = input.toLowerCase().trim();
    if (!text.includes('?') && !text.includes('هل') && !text.includes('لماذا') && !text.includes('ليه') && !text.includes('why') && !text.includes('pourquoi')) {
      return false;
    }

    const offKeywords = [
      'فضاء', 'ديناصور', 'كوكب المريخ', 'كرة القدم', 'رونالدو', 'ميسي', 'بلايستيشن',
      'space', 'mars', 'dinosaurs', 'football', 'messi', 'ronaldo', 'video game',
      'minecraft', 'roblox', 'الطقس في اليابان', 'سعر الدولار', 'espace', 'dinosaures'
    ];

    return offKeywords.some((k) => text.includes(k));
  }

  /**
   * Determine effective turn language based on lesson default and child's dominant input
   */
  public resolveLanguage(
    explicitLang?: 'ar' | 'en' | 'fr',
    lessonLang?: 'ar' | 'en' | 'fr',
    studentInput?: string
  ): 'ar' | 'en' | 'fr' {
    if (studentInput && studentInput.trim().length > 3) {
      const text = studentInput.trim().toLowerCase();
      // Check Arabic characters
      const arabicMatches = (text.match(/[\u0600-\u06FF]/g) || []).length;
      // Check French specific characters or common words
      const frenchMatches = (text.match(/[éèêëàâôûùçîï]|(bonjour|oui|non|merci|j'ai|c'est|leçon|livre|pourquoi)/g) || []).length;
      const totalChars = text.length;

      if (arabicMatches > totalChars * 0.3) {
        return 'ar';
      }
      if (frenchMatches > 0 || (lessonLang === 'fr' && !text.match(/[\u0600-\u06FF]/))) {
        return 'fr';
      }
      if (lessonLang === 'en' || explicitLang === 'en') {
        return 'en';
      }
    }

    if (lessonLang) return lessonLang;
    if (explicitLang) return explicitLang;
    return 'ar';
  }

  /**
   * Construct structured visual data matching the concept
   */
  public buildStructuredVisual(
    concept: CurriculumLessonConcept,
    lesson: OfficialCurriculumLesson
  ): StructuredVisualData {
    return {
      type: concept.visualType || 'diagram',
      titleAr: concept.titleAr,
      titleEn: concept.titleEn,
      captionAr: `مصدر الشكل: ${lesson.sourceRef.bookAr}`,
      captionEn: `Source: ${lesson.sourceRef.bookEn}`,
      sourceRef: lesson.sourceRef,
      elements: {
        conceptId: concept.id,
        lessonTitle: lesson.titleAr,
        keyPoints: concept.keyPoints,
      },
    };
  }
}

export const teachingSessionEngine = new TeachingSessionEngine();
