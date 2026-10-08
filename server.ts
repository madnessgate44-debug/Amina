import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '15mb' }));

// Initialize GoogleGenAI
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Quota & Rate Limit Protection (Circuit breaker for 429 RESOURCE_EXHAUSTED)
let globalQuotaCooldownUntil = 0;

function isQuotaExhaustedError(err: any): boolean {
  if (!err) return false;
  const status = err.status || err.code;
  const msg = String(err.message || err).toLowerCase();
  return (
    status === 429 ||
    msg.includes('429') ||
    msg.includes('resource_exhausted') ||
    msg.includes('quota') ||
    msg.includes('rate limit')
  );
}

function handleAiError(scope: string, err: any) {
  if (isQuotaExhaustedError(err)) {
    // 10-minute cooldown where no external calls are made; graceful fallbacks are served
    globalQuotaCooldownUntil = Date.now() + 10 * 60 * 1000;
  } else {
    console.warn(`[${scope}] handled gracefully:`, err?.message || err);
  }
}

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(apiKey),
    timestamp: new Date().toISOString(),
  });
});

// Chat API endpoint for Companion
app.post('/api/chat', async (req, res) => {
  try {
    const { messages = [], studentName = 'طالب', grade = 'Grade 5', language = 'ar', schoolBrainContext = null } = req.body;

    const isArabic = language === 'ar';
    const lastUserMsg = (messages[messages.length - 1]?.content || '').trim();
    const lowerUserMsg = lastUserMsg.toLowerCase();

    // Specific intent detection for Phase 3
    const isDontUnderstand =
      lowerUserMsg.includes('مش فاهم') ||
      lowerUserMsg.includes('مش فاهمة') ||
      lowerUserMsg.includes("don't understand") ||
      lowerUserMsg.includes('dont understand') ||
      lowerUserMsg.includes("don't get it");

    const isExplainDifferently =
      lowerUserMsg.includes('اشرح بطريقة تانية') ||
      lowerUserMsg.includes('طريقة تانية') ||
      lowerUserMsg.includes('اشرح تاني') ||
      lowerUserMsg.includes('explain differently') ||
      lowerUserMsg.includes('another way') ||
      lowerUserMsg.includes('مش واضحة');

    const isTestMe =
      lowerUserMsg.includes('اختبرني') ||
      lowerUserMsg.includes('اسألني سؤال') ||
      lowerUserMsg.includes('اختبار') ||
      lowerUserMsg.includes('test me') ||
      lowerUserMsg.includes('quiz me');

    if (!ai || Date.now() < globalQuotaCooldownUntil) {
      // Graceful offline/local companion fallback if API key is not yet set or during quota cooldown
      let fallbackReply = '';
      if (isDontUnderstand) {
        fallbackReply = isArabic
          ? `ولا يهمك خالص يا ${studentName}! عادي جداً متفهمش من أول مرة، دي خطوة طبيعية في التعلم. قولي إيه أكثر نقطة حسيتها ملخبطة وهنبسطها سوا خطوة بخطوة.`
          : `No worries at all, ${studentName}! It's completely normal not to understand right away. Tell me which part felt tricky, and we'll break it down step by step together.`;
      } else if (isExplainDifferently) {
        fallbackReply = isArabic
          ? `حاضر يا ${studentName}! تعال نجرب مثال من حياتنا اليومية أو نشبه الموضوع بحاجة بنشوفها كل يوم. قولي تحب نبدأ من أول فكرة ولا من النص؟`
          : `Sure thing, ${studentName}! Let's look at this with a simple real-world analogy. Would you like to restart from the beginning or focus on the tricky part?`;
      } else if (isTestMe) {
        fallbackReply = isArabic
          ? `فكرة ممتازة وتحدي حلو يا ${studentName}! جاهز لسؤال خفيف وسريع على اللي ذكرته؟ خد وقتك خالص وفكر على مهلك.`
          : `Awesome attitude and great challenge, ${studentName}! Ready for a quick, friendly question on what we discussed? Take your time!`;
      } else {
        fallbackReply = isArabic
          ? `أهلاً يا ${studentName}! أنا رفيقك الذكي للتعلم. أنا هنا علشان أسمعك وأساعدك تنظم يومك وتفهم اللي محتاجه بهدوء ودون أي ضغط.`
          : `Hello ${studentName}! I am your AI School Companion. I am here to help organize your day and walk through any questions without stress.`;
      }

      return res.json({
        reply: fallbackReply,
        source: 'local_companion_fallback',
        detectedIntent: isDontUnderstand ? 'dont_understand' : isExplainDifferently ? 'explain_differently' : isTestMe ? 'test_me' : 'general',
      });
    }

    const contextJson = schoolBrainContext ? JSON.stringify({
      school: schoolBrainContext.school || null,
      location: schoolBrainContext.location || null,
      curriculumTrack: schoolBrainContext.curriculumTrack || null,
      dayRecord: schoolBrainContext.dayRecord || null,
      activeMission: schoolBrainContext.activeMission || null,
    }) : 'No verified School Brain context was supplied.';

    const systemInstruction = `
You are the "AI School Companion" (الرفيق الدراسي الذكي), a personal AI learning assistant for a ${grade} student named "${studentName}".
CRITICAL PRINCIPLES:
1. You are an AI companion, NOT a human teacher or parent. Never pretend to be human.
2. Tone: Warm, patient, encouraging, age-appropriate for an ~11-year-old child.
3. Absolutely NO moralizing, scolding, or guilt-tripping (e.g. never say "you should have studied earlier" or "why didn't you finish?").
4. Praise must be specific and grounded, never generic or effusive.
5. Language: Primarily Egyptian/Friendly Arabic when the student writes in Arabic (${isArabic ? 'Active' : 'Optional'}), clear simple English if English is selected.
6. SCHOOL BRAIN IS AUTHORITATIVE:
   - Treat the verified context below as the source of truth for the student's current school day, curriculum track, and active mission.
   - Do not invent lessons, homework, concepts, assignments, scores, mastery, or school events that are not present in the verified context.
   - If the context does not contain enough information to answer a school-specific question, say exactly what information is missing and ask for it or direct the student to record today's school information.
   - Never silently substitute another lesson or another subject.
   - When discussing learning, stay grounded in the active mission/day record when one exists.
7. VERIFIED SCHOOL BRAIN CONTEXT:
${contextJson}
8. SPECIAL INTENT HANDLING:
   - If the student says "I don't understand" / "مش فاهم": Reassure them warmly that learning takes time, normalize confusion, and invite them gently to say which part was confusing.
   - If the student says "explain differently" / "اشرح بطريقة تانية": Offer a simple everyday analogy or relatable example suited for an 11-year-old.
   - If the student says "test me" / "اختبرني": Provide a single, friendly, low-stakes practice question to build confidence, and encourage them to take their time.
   - Note: Do NOT trigger a rigid tutor escalation ladder yet; keep replies conversational, supportive, and grounded.
`.trim();

    // Prepare contents array for Gemini
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    // Generate response using SDK default model
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || (isArabic ? 'أنا معاك، نقدر نكمل!' : "I'm with you, let's continue!");
    res.json({
      reply,
      source: 'gemini',
      detectedIntent: isDontUnderstand ? 'dont_understand' : isExplainDifferently ? 'explain_differently' : isTestMe ? 'test_me' : 'general',
    });
  } catch (error: any) {
    handleAiError('chat', error);
    const isArabic = req.body?.language !== 'en';
    const errorFallback = isArabic
      ? 'أنا هنا معاك. واجهت ثانية بطء في الاتصال، بس نقدر نواصل تنظيم يومنا بدون أي مشكلة.'
      : "I'm right here with you. Had a momentary connection blip, but we can keep planning your day without issue.";
    res.json({ reply: errorFallback, source: 'error_fallback' });
  }
});

// STT (Speech-to-Text) API endpoint (Tier 2 fallback)
app.post('/api/stt', async (req, res) => {
  try {
    const { audioBase64, mimeType = 'audio/webm', language = 'ar' } = req.body;

    if (!audioBase64) {
      return res.status(400).json({ error: 'Missing audio data', transcript: '' });
    }

    if (!ai) {
      return res.json({
        transcript: '',
        error: 'Gemini STT requires API key',
        tier: 'fallback_unavailable',
      });
    }

    const isArabic = language === 'ar';
    const promptText = isArabic
      ? 'استمع إلى التسجيل الصوتي المرفق وقم بتفريغه نصياً بدقة كما نطق الطالب باللغة العربية (اللهجة المصرية أو الفصحى). أرجع فقط النص الدقيق بدون أي مقدمات أو تحيات أو إضافات.'
      : 'Listen to the audio recording and transcribe it accurately as spoken. Return only the exact transcription without any commentary.';

    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                data: audioBase64,
                mimeType,
              },
            },
            {
              text: promptText,
            },
          ],
        },
      ],
      config: {
        temperature: 0.1,
      },
    });

    const transcript = (response.text || '').trim();
    res.json({
      transcript,
      tier: 'gemini_stt',
    });
  } catch (error: any) {
    console.error('STT API Error:', error);
    res.json({
      transcript: '',
      error: error.message || 'STT failed',
      tier: 'gemini_stt_error',
    });
  }
});

// TTS in-memory cache
const ttsCache = new Map<string, string>();

// TTS (Text-to-Speech) API endpoint powered by Gemini Flash Lite TTS
app.post('/api/tts', async (req, res) => {
  try {
    const { text = '', language = 'ar' } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Missing text' });
    }

    const cleanText = text
      .replace(/[*#_~`]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 450); // Safe length for natural speech delivery

    const langKey = language === 'fr' ? 'fr' : language === 'en' ? 'en' : 'ar';
    const cacheKey = `${langKey}:${cleanText}`;

    // 1. Serve from in-memory cache if previously generated
    if (ttsCache.has(cacheKey)) {
      return res.json({
        success: true,
        audioBase64: ttsCache.get(cacheKey),
        mimeType: 'audio/wav',
        fromCache: true,
      });
    }

    if (!ai) {
      return res.json({
        success: false,
        useBrowserSpeech: true,
        text: cleanText,
        language: langKey,
      });
    }

    try {
      const voiceName = langKey === 'ar' ? 'Puck' : langKey === 'fr' ? 'Kore' : 'Kore';
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: [
          {
            role: 'user',
            parts: [{ text: cleanText }],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        ttsCache.set(cacheKey, base64Audio);
        return res.json({
          success: true,
          audioBase64: base64Audio,
          mimeType: 'audio/wav',
        });
      }
    } catch (genErr: any) {
      console.warn('Gemini TTS generation issue:', genErr?.message || genErr);
    }

    // Graceful browser speech fallback if server TTS encountered an issue
    res.json({
      success: false,
      useBrowserSpeech: true,
      text: cleanText,
      language: langKey,
    });
  } catch (error: any) {
    res.json({
      success: false,
      useBrowserSpeech: true,
      text: req.body?.text || '',
      language: req.body?.language || 'ar',
    });
  }
});

// Dynamic Lesson Explanation Generation (Miss Nour Deep Explanation)
app.post('/api/tutor-explain', async (req, res) => {
  try {
    const {
      lessonTitle = 'الدرس',
      subjectName = 'المادة',
      lessonText = '',
      studentName = 'أمينة',
      language = 'ar',
      mode = 'full_hook_story',
    } = req.body;

    const isArabic = language === 'ar';
    const isFrench = language === 'fr';

    if (!ai || Date.now() < globalQuotaCooldownUntil) {
      // Local pedagogic explanations fallback
      const fallbackExplanations: Record<string, string> = {
        full_hook_story: isArabic
          ? `يا أهلاً يا ${studentName}! تعالي أحكي لك سر مشوق عن درس «${lessonTitle}» في ${subjectName}. تخيلي لو إنتي عالمة أو مستكشفة صغيرة بتواجه لغز كبير؛ الدرس ده بيعلمنا إزاي نفكر بذكاء ونحل أصعب التحديات خطوة بخطوة. يلا نفتح عيوننا وتركيزنا ونبدأ المغامرة سوا!`
          : isFrench
          ? `Bonjour ${studentName}! Laisse-moi te raconter une histoire passionnante sur la leçon «${lessonTitle}» en ${subjectName}. Imagine que tu sois une jeune chercheuse explorant une énigme fascinante. Cette leçon va nous donner les clés pour comprendre le monde qui nous entoure!`
          : `Hello ${studentName}! Let me tell you an exciting story about our lesson "${lessonTitle}" in ${subjectName}. Imagine you are a young explorer facing a great discovery. This lesson will show us how to think critically and solve big puzzles step by step!`,
        core_concepts: isArabic
          ? `ركزي معايا يا ${studentName} في أهم ثلاث نقاط في درس «${lessonTitle}»: أولاً: الفكرة المركزية اللي بيبني عليها كتاب الوزارة. ثانياً: المصطلحات الجديدة اللي بنقابلها. ثالثاً: القاعدة الأساسية اللي بتخلينا نحل أي تمرين بكل سهولة.`
          : isFrench
          ? `Retiens bien ces points clés pour «${lessonTitle}», ${studentName}: D'abord, l'idée principale du manuel. Ensuite, les termes nouveaux indispensables. Enfin, la règle pratique pour résoudre tous les exercices.`
          : `Focus with me on the key ideas for "${lessonTitle}", ${studentName}: First, the main concept from the textbook. Second, our core vocabulary. Third, the practical rule to solve any practice problem with confidence.`,
        real_world_analogy: isArabic
          ? `عارفة يا ${studentName}، بنقدر نشبه فكرة «${lessonTitle}» بحاجة بنشوفها في بيتنا كل يوم! لما بننظم ألعابنا أو نقسم وجبة حلوة مع أصحابنا، بنطبق نفس المبدأ العلمي ده تماماً. شفتي بقى العلم قريب من حياتنا إزاي؟`
          : isFrench
          ? `Tu sais ${studentName}, le concept de «${lessonTitle}» ressemble exactement à ce que l'on fait au quotidien quand on partage un gâteau avec ses amis ou qu'on range sa chambre. La science est partout autour de nous!`
          : `You know ${studentName}, we can relate "${lessonTitle}" to everyday life! Just like sharing a delicious treat or organizing your room, we apply this exact concept naturally. Science is all around us!`,
        discussion_question: isArabic
          ? `يا ترى يا ${studentName}، لو سألتك: إيه أكتر فكرة لفتت نظرك في درس «${lessonTitle}»؟ وإزاي نقدر نستخدم الفكرة دي عشان نساعد بلدنا أو بيتنا النهاردة؟`
          : isFrench
          ? `À ton avis ${studentName}, quelle est la partie la plus intéressante de «${lessonTitle}»? Comment pourrais-tu utiliser cette idée pour aider tes proches aujourd'hui?`
          : `What do you think, ${studentName}: what was the most interesting part of "${lessonTitle}"? How could we use this idea in our daily life today?`,
      };

      return res.json({
        explanation: fallbackExplanations[mode] || fallbackExplanations.full_hook_story,
        source: 'local_tutor_fallback',
      });
    }

    const systemInstruction = `
You are "المعلمة نور" (Miss Nour), an extraordinary, caring, world-class 5th-grade primary school teacher in Egypt.
You are teaching a 5th-grade student named "${studentName}".
CURRENT LESSON: "${lessonTitle}" in Subject: "${subjectName}".
LESSON TEXT / CURRICULUM CONTEXT:
"""${lessonText ? lessonText.slice(0, 1000) : 'Official Egyptian Ministry Curriculum for Grade 5.'}"""

TEACHING GOAL FOR MODE "${mode}":
- If mode is "full_hook_story": Create an irresistible, captivating 3-4 sentence hook/story that makes an 11-year-old curious and excited to learn this specific lesson!
- If mode is "core_concepts": Clearly break down the 2-3 essential concepts of "${lessonTitle}" using simple, engaging language and practical clarity suited for Grade 5.
- If mode is "real_world_analogy": Give a vivid everyday real-world analogy (e.g. food, sports, nature, family) that makes the abstract concept immediately click.
- If mode is "discussion_question": Ask Amina a gentle, thought-provoking question to test her understanding warmly.
- If mode is "simplify": Amina found the lesson hard. Reassure her affectionately, and re-explain in ultra-simple, reassuring terms.

STYLE & LANGUAGE:
- If language is "ar": Use natural, warm, affectionate Egyptian Arabic (e.g. "يا حبيبتي يا أمينة", "شوفي يا ستي", "الموضوع ممتع جداً", "بصي معايا").
- If language is "fr": Use warm, polite, enthusiastic French adapted for primary school students ("Chère Amina", "C'est très simple et passionnant!").
- If language is "en": Use warm, encouraging, engaging English suitable for 5th grade.
- Keep output concise (max 4-5 sentences) so it reads beautifully and can be spoken out loud by the voice engine without lagging.
`.trim();

    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: `Generate the ${mode} explanation for ${studentName} about ${lessonTitle}.` }],
        },
      ],
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const explanation = response.text || (isArabic ? `درس «${lessonTitle}» درس ممتع ومهم جداً يا ${studentName}!` : `Our lesson "${lessonTitle}" is exciting and important, ${studentName}!`);
    res.json({ explanation, source: 'gemini' });
  } catch (error: any) {
    handleAiError('tutor-explain', error);
    const isAr = req.body?.language !== 'en' && req.body?.language !== 'fr';
    res.json({
      explanation: isAr
        ? `أهلاً يا ${req.body?.studentName || 'أمينة'}! درس «${req.body?.lessonTitle || 'الدرس'}» من أهم الدروس في كتاب الوزارة، يلا نستكشفه سوا خطوة بخطوة!`
        : `Welcome ${req.body?.studentName || 'Amina'}! This lesson is a key part of your textbook, let's explore it together!`,
      source: 'error_fallback',
    });
  }
});

// Interactive Stage Tutor Dialogue (Nour - Real human-like tutor for ANY official lesson)
app.post('/api/tutor-reply', async (req, res) => {
  try {
    const {
      studentInput,
      currentBeatText = '',
      lessonTitle = 'الدرس',
      subjectName = 'المادة',
      studentName = 'أمينة',
      language = 'ar',
    } = req.body;

    const isArabic = language === 'ar';
    const isFrench = language === 'fr';

    if (!ai || Date.now() < globalQuotaCooldownUntil) {
      const lower = (studentInput || '').toLowerCase();
      let contextualReply = '';

      if (lower.includes('معنى') || lower.includes('يعني ايه') || lower.includes('يعني إيه') || lower.includes('meaning') || lower.includes('c\'est quoi')) {
        contextualReply = isArabic
          ? `سؤال ممتاز يا ${studentName}! في درسنا «${lessonTitle}»، المعنى الأساسي هنا بيوضح لنا إزاي نفهم الفكرة بدقة ونربطها بالسياق في كتاب الوزارة.`
          : isFrench
          ? `Excellente question ${studentName}! Dans la leçon «${lessonTitle}», ce terme nous aide à comprendre précisément le sujet du manuel.`
          : `Great question, ${studentName}! In our lesson "${lessonTitle}", this key idea helps us understand the textbook concept clearly.`;
      } else if (lower.includes('ليه') || lower.includes('لماذا') || lower.includes('عشان ايه') || lower.includes('why') || lower.includes('pourquoi')) {
        contextualReply = isArabic
          ? `ذكاء رائع منك يا ${studentName} إنك بتسألي عن السبب! في «${lessonTitle}»، ده بيحصل علشان يحقق التوازن والنتيجة الصحيحة اللي بندرسها في كتاب الوزارة.`
          : isFrench
          ? `Très bonne curiosité, ${studentName}! Dans «${lessonTitle}», cela s'explique par la règle fondamentale de notre cours.`
          : `Brilliant curiosity, ${studentName}! In "${lessonTitle}", this happens because of the core principle we are studying.`;
      } else if (lower.includes('مش فاهم') || lower.includes('مش فاهمة') || lower.includes("don't understand") || lower.includes('pas compris')) {
        contextualReply = isArabic
          ? `ولا يهمك خالص يا حبيبتي يا ${studentName}! طبيعي جداً نحتاج نبسطها. تعالي نتخيل «${lessonTitle}» بمثال بسيط من بيتنا ويومنا: الفكرة ببساطة إننا بنمشي خطوة بخطوة عشان نوصل للحل.`
          : isFrench
          ? `Ne t'inquiète pas du tout, ${studentName}! C'est tout à fait normal. Prenons un exemple tout simple de la vie de tous les jours pour «${lessonTitle}».`
          : `Don't worry at all, ${studentName}! It's totally normal to need a simpler look. Let's look at "${lessonTitle}" with a simple everyday example!`;
      } else {
        contextualReply = isArabic
          ? `أنا سامعاكي ومركّزة معاكي جداً يا ${studentName}! في درسنا «${lessonTitle}»، كلامك ده بيقربنا أكتر من فهم الفكرة وتطبيقها في التمارين.`
          : isFrench
          ? `Je t'écoute attentivement, ${studentName}! Dans «${lessonTitle}», ton point de vue est super pertinent pour résoudre nos exercices.`
          : `I hear you loud and clear, ${studentName}! In "${lessonTitle}", your insight brings us closer to mastering the exercise!`;
      }
      return res.json({ reply: contextualReply });
    }

    const systemInstruction = `
You are "نور" (Nour), an inspiring, loving, warm, enthusiastic, highly skilled private tutor talking to Amina (أمينة), an 11-year-old 5th-grade student in Egypt.
CURRENT SUBJECT: "${subjectName}".
CURRENT LESSON: "${lessonTitle}".
CURRICULUM CONTEXT / TEXTBOOK TEXT:
"""${currentBeatText ? currentBeatText.slice(0, 1000) : 'Grade 5 Egyptian Ministry Curriculum.'}"""

RULES:
1. Ground your answer in the ACTUAL lesson "${lessonTitle}" and "${subjectName}". Never give generic boilerplate.
2. If student says they don't understand, reassure them warmly and give a concrete, memorable everyday analogy suited for an 11-year-old.
3. Language:
   - If language is "ar": Speak in warm, natural, friendly Egyptian Arabic (e.g. "يا حبيبتي يا أمينة", "بصي يا ستي", "الفكرة ببساطة", "تعالي نتخيلها سوا").
   - If language is "fr": Speak in gentle, encouraging French for primary school ("Chère Amina, c'est très simple...").
   - If language is "en": Speak in clear, warm, enthusiastic English.
4. Keep it concise (2-4 sentences max) so it can be read smoothly and spoken aloud without overwhelming the child.
5. End with a friendly, gentle check for understanding (e.g. "وضحت كده يا بطلة ولا نجرب مثال تاني؟").
`.trim();

    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: `Amina said: "${studentInput}". Context: Lesson "${lessonTitle}" (${subjectName}). Reply to her as Nour!` }],
        },
      ],
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || (isArabic ? `أنا سامعاكي يا ${studentName}، وضحت ليكي الفكرة في «${lessonTitle}»؟` : `I hear you ${studentName}, does that make sense for "${lessonTitle}"?`);
    res.json({ reply });
  } catch (error: any) {
    handleAiError('tutor-reply', error);
    const isAr = req.body?.language !== 'en' && req.body?.language !== 'fr';
    res.json({
      reply: isAr
        ? `أنا معاكي يا ${req.body?.studentName || 'أمينة'} خطوة بخطوة! في درسنا «${req.body?.lessonTitle || 'الدرس'}»، أهم فكرة هي الفهم والتركيز في كتاب الوزارة.`
        : `I'm right here with you, ${req.body?.studentName || 'Amina'}! In "${req.body?.lessonTitle || 'our lesson'}", the main point is to stay curious and focused.`,
    });
  }
});

// Photo & Digital Homework Check API endpoint (Phase 6)
app.post('/api/check-homework', async (req, res) => {
  try {
    const {
      imageBase64,
      mimeType = 'image/jpeg',
      questionPrompt = '',
      expectedAnswer = '',
      rubric = '',
      language = 'ar',
      grade = 'Grade 5',
      subject = '',
      simulateConfidence,
      simulateEvaluation,
    } = req.body;

    const isArabic = language === 'ar';

    if (!imageBase64 && !req.body.studentAnswerText) {
      return res.status(400).json({ error: 'Missing image or text payload' });
    }

    if (!ai || Date.now() < globalQuotaCooldownUntil) {
      // Graceful local evaluation fallback when running offline or during quota cooldown
      const simConfidence = typeof simulateConfidence === 'number' ? simulateConfidence : 0.88;
      if (simConfidence < 0.5) {
        return res.json({
          extractedAnswerText: isArabic ? 'نص غير واضح أو خط يدوي باهت' : 'Unclear handwriting / blurred snippet',
          extractionConfidence: simConfidence,
          evaluation: 'unclear',
          mistakeDescription: isArabic
            ? 'لم أستطع قراءة هذا بوضوح. هل يمكنك كتابة ما كتبته، أو تجربة صورة أوضح؟'
            : "I couldn't read this clearly. Can you tell me what you wrote, or try a clearer photo?",
          workedStep: null,
          finalAnswer: null,
          source: 'local_ocr_fallback_low_confidence',
        });
      }

      const evalResult = simulateEvaluation || 'correct';
      return res.json({
        extractedAnswerText: expectedAnswer || (isArabic ? 'إجابة واضحة ومقروءة' : 'Clear student response'),
        extractionConfidence: simConfidence,
        evaluation: evalResult,
        mistakeDescription: evalResult === 'wrong'
          ? (isArabic ? 'يبدو أنك جمعت المقامات بدلاً من توحيدها أو ضرب البسط مباشرة.' : 'It appears denominators were added instead of finding a common base.')
          : null,
        workedStep: isArabic ? 'الخطوة الأولى: تأكد من ضرب البسط في البسط والمقام في المقام.' : 'Step 1: Multiply numerators and denominators independently.',
        finalAnswer: expectedAnswer,
        source: 'local_ocr_fallback_evaluated',
      });
    }

    const cleanBase64 = imageBase64 ? imageBase64.replace(/^data:image\/[a-z]+;base64,/, '') : '';

    const systemInstruction = `
You are the "AI School Companion" Homework OCR & Evaluation Assessor for an ~11-year-old (${grade}) student.
Language: ${isArabic ? 'Arabic (Egypt/Standard)' : 'English'}.
Subject: "${subject}".
Question Prompt: "${questionPrompt}".
Expected Answer / Rubric: "${expectedAnswer || rubric}".

YOUR TASK:
1. Best-effort OCR: Inspect the student's handwritten or printed homework response.
2. Transcribe the student's answer text into "extractedAnswerText".
3. CRITICAL HONESTY RULE:
   - Arabic handwriting and camera angles can be tricky.
   - If the writing is faint, blurry, cut off, or ambiguous, assign "extractionConfidence" < 0.5 (e.g. 0.2 to 0.45) and set evaluation to "unclear".
   - NEVER guess or make up a verdict if you cannot read it clearly.
   - If confidence < 0.5, do NOT declare it wrong or correct; set evaluation = 'unclear'.
4. If legible (extractionConfidence >= 0.5):
   - Evaluate correctness against the expected answer/rubric: 'correct' | 'partial' | 'wrong' | 'unclear'.
   - If wrong or partial, identify the specific mistake in a gentle, warm tone in "mistakeDescription".
   - Provide a partial hint / worked step ("workedStep") to guide them without revealing the full answer.
   - Set "finalAnswer" to the correct target answer.
5. SEPARATION OF ACADEMIC CORRECTNESS VS HANDWRITING QUALITY:
   - If the student's concept, calculation, or fact is right, assign evaluation = "correct", EVEN IF the handwriting is messy or uneven!
   - Separately evaluate "handwritingQuality": "neat" | "readable" | "messy" | "unclear".
   - In "handwritingFeedback", provide gentle, friendly handwriting advice (e.g. "حلك الرياضي صحيح ١٠٠٪! نصيحة لتحسين الخط: باعدي قليلاً بين الأرقام").
6. Return JSON ONLY matching this exact schema:
{
  "extractedAnswerText": string | null,
  "extractionConfidence": number (between 0.0 and 1.0),
  "evaluation": "correct" | "partial" | "wrong" | "unclear",
  "mistakeDescription": string | null,
  "workedStep": string | null,
  "finalAnswer": string | null,
  "handwritingQuality": "neat" | "readable" | "messy" | "unclear",
  "handwritingFeedback": string | null
}
`.trim();

    const parts: any[] = [];
    if (cleanBase64) {
      parts.push({
        inlineData: {
          mimeType,
          data: cleanBase64,
        },
      });
    }
    parts.push({
      text: `Please inspect this student's homework photo and evaluate the answer for prompt: "${questionPrompt}". Expected answer: "${expectedAnswer}".`,
    });

    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
      contents: [{ role: 'user', parts }],
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);

    res.json({
      extractedAnswerText: parsed.extractedAnswerText ?? null,
      extractionConfidence: typeof parsed.extractionConfidence === 'number' ? parsed.extractionConfidence : 0.85,
      evaluation: parsed.evaluation || (parsed.extractionConfidence < 0.5 ? 'unclear' : 'correct'),
      mistakeDescription: parsed.mistakeDescription ?? null,
      workedStep: parsed.workedStep ?? null,
      finalAnswer: parsed.finalAnswer ?? null,
      handwritingQuality: parsed.handwritingQuality ?? 'readable',
      handwritingFeedback: parsed.handwritingFeedback ?? null,
      source: 'gemini_vision',
    });
  } catch (error: any) {
    handleAiError('check-homework', error);
    const isArabic = req.body?.language !== 'en';
    res.json({
      extractedAnswerText: null,
      extractionConfidence: 0.2,
      evaluation: 'unclear',
      mistakeDescription: isArabic
        ? 'لم أستطع قراءة هذا بوضوح. هل يمكنك كتابة ما كتبته، أو تجربة صورة أوضح؟'
        : "I couldn't read this clearly. Can you tell me what you wrote, or try a clearer photo?",
      workedStep: null,
      finalAnswer: null,
      source: 'error_fallback',
    });
  }
});

// Day Record Reconstruction API endpoint
app.post('/api/reconstruct-day', async (req, res) => {
  try {
    const {
      studentInput = '',
      studentName = 'طالب',
      grade = 'Grade 5',
      language = 'ar',
      todayTimetableSubjects = [],
    } = req.body;

    const trimmedInput = (studentInput || '').trim();
    const isArabic = language === 'ar';

    // Fast-path local failure mode detection
    const lower = trimmedInput.toLowerCase();
    const silenceTriggers = ['مش فاكر', 'نسيت', 'مش عارف', 'don\'t remember', 'dont remember', 'i forgot', 'forgot'];
    const vagueTriggers = ['عادي', 'معملناش حاجة', 'stuff', 'we did stuff', 'nothing special'];

    const isSilence = !trimmedInput || silenceTriggers.some((t) => lower.includes(t));
    const isVague = vagueTriggers.some((t) => lower === t || lower.includes(t));

    if (isSilence) {
      return res.json({
        lessonsCovered: [],
        homeworkAssigned: [],
        notes: isArabic ? 'الطالب لم يتذكر أحداث اليوم أو اختصر بالنسيان.' : 'Student did not recall details or stated amnesia.',
        isSilence: true,
        isVague: false,
        detectedConfidence: 'vague',
        source: 'rule_detection',
      });
    }

    if (isVague) {
      return res.json({
        lessonsCovered: [],
        homeworkAssigned: [],
        notes: trimmedInput,
        isSilence: false,
        isVague: true,
        detectedConfidence: 'vague',
        source: 'rule_detection',
      });
    }

    if (!ai) {
      // Local rule-based parser fallback
      const lessons: { subject: string; topic?: string; notes?: string }[] = [];
      const homework: { subject: string; description: string; dueDate?: string }[] = [];

      if (lower.includes('فرنساوي') || lower.includes('french') || lower.includes('français')) {
        lessons.push({ subject: 'اللغة الفرنسية', topic: 'Salutations et vocabulaire', notes: 'حسب وصف الطالب' });
        if (lower.includes('واجب') || lower.includes('homework') || lower.includes('devoir')) {
          homework.push({ subject: 'اللغة الفرنسية', description: 'Exercices du livre', dueDate: isArabic ? 'غداً' : 'Demain' });
        }
      }
      if (lower.includes('ماث') || (lower.includes('math') && lower.includes('fr')) || lower.includes('mathématiques')) {
        lessons.push({ subject: 'الرياضيات بالفرنسية (Maths)', topic: 'Nombres décimaux et fractions', notes: 'حسب وصف الطالب' });
        if (lower.includes('واجب') || lower.includes('homework') || lower.includes('devoir')) {
          homework.push({ subject: 'الرياضيات بالفرنسية (Maths)', description: 'Exercices Techbook', dueDate: isArabic ? 'غداً' : 'Demain' });
        }
      } else if (lower.includes('رياض') || lower.includes('math') || lower.includes('حساب') || lower.includes('كسور')) {
        lessons.push({ subject: 'الرياضيات', topic: 'الكسور والعمليات الحسابية', notes: 'حسب وصف الطالب' });
        if (lower.includes('واجب') || lower.includes('homework') || lower.includes('مسائل')) {
          homework.push({ subject: 'الرياضيات', description: 'تمارين الكتاب', dueDate: isArabic ? 'غداً' : 'Tomorrow' });
        }
      }
      if (lower.includes('ساينس') || (lower.includes('sci') && lower.includes('fr')) || lower.includes('sciences')) {
        lessons.push({ subject: 'العلوم بالفرنسية (Sciences)', topic: 'Écosystèmes et photosynthèse', notes: 'حسب وصف الطالب' });
      } else if (lower.includes('علوم') || lower.includes('science')) {
        lessons.push({ subject: 'العلوم', topic: 'الكائنات الحية والبيئة', notes: 'حسب وصف الطالب' });
      }
      if (lower.includes('عرب') || lower.includes('arabic')) {
        lessons.push({ subject: 'اللغة العربية', topic: 'نحو وقراءة', notes: 'حسب وصف الطالب' });
        if (lower.includes('واجب') || lower.includes('homework')) {
          homework.push({ subject: 'اللغة العربية', description: 'حل تدريبات الدرس', dueDate: isArabic ? 'غداً' : 'Tomorrow' });
        }
      }
      if (lower.includes('إنجليز') || lower.includes('انجليز') || lower.includes('english')) {
        lessons.push({ subject: 'اللغة الإنجليزية', topic: 'Connect 5 Unit 1', notes: 'حسب وصف الطالب' });
      }

      return res.json({
        lessonsCovered: lessons.length > 0 ? lessons : [{ subject: 'مراجعة عامة', topic: trimmedInput }],
        homeworkAssigned: homework,
        notes: trimmedInput,
        isSilence: false,
        isVague: false,
        detectedConfidence: lessons.length > 0 ? 'high' : 'partial',
        source: 'local_parser_fallback',
      });
    }

    const systemInstruction = `
You are the "AI School Companion" Day Record extractor for a ${grade} student named "${studentName}".
The student has just come home from school and described their day in free-text: "${trimmedInput}".
Today's timetable scheduled subjects are: ${JSON.stringify(todayTimetableSubjects)}.

YOUR TASK:
Extract the concrete lessons covered and homework assigned into structured JSON.
CRITICAL RULES:
1. Do not hallucinate or invent subjects that the student did not attend or mention.
2. If the student explicitly names a subject not in the timetable, capture it accurately.
3. Extract homework with clear subject, description, and due date if stated.
4. If input is vague or brief, mark detectedConfidence as "partial" or "vague".
5. Return JSON ONLY matching this exact structure:
{
  "lessonsCovered": [
    { "subject": "string", "topic": "string (optional)", "notes": "string (optional)" }
  ],
  "homeworkAssigned": [
    { "subject": "string", "description": "string", "dueDate": "string (optional)" }
  ],
  "notes": "string (optional)",
  "detectedConfidence": "high" | "partial" | "vague",
  "isSilence": boolean,
  "isVague": boolean
}
`.trim();

    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
      contents: [{ role: 'user', parts: [{ text: trimmedInput }] }],
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);

    res.json({
      lessonsCovered: parsed.lessonsCovered || [],
      homeworkAssigned: parsed.homeworkAssigned || [],
      notes: parsed.notes || trimmedInput,
      detectedConfidence: parsed.detectedConfidence || 'partial',
      isSilence: Boolean(parsed.isSilence),
      isVague: Boolean(parsed.isVague),
      source: 'gemini',
    });
  } catch (error: any) {
    console.error('Reconstruct Day API Error:', error);
    res.json({
      lessonsCovered: [{ subject: 'اللغة العربية', topic: 'مراجعة عامة' }],
      homeworkAssigned: [],
      notes: req.body?.studentInput || '',
      detectedConfidence: 'partial',
      isSilence: false,
      isVague: false,
      source: 'error_fallback',
    });
  }
});

// Dev vs Prod server setup
if (process.env.NODE_ENV !== 'production') {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`AI School Companion Server running on http://0.0.0.0:${PORT}`);
});
