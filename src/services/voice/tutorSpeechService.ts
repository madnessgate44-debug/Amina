/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { voiceService } from './voiceService';
import { soundEffects } from '../sound/soundEffects';
import { Language } from '../../types';

export type EncouragementType = 'correct' | 'almost' | 'hint' | 'praise' | 'celebrate' | 'welcome';

export interface TutorSpeechOptions {
  language?: Language;
  playSoundFx?: boolean;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

/**
 * Speech Synthesis Tutor Module
 * Handles automated and interactive voice narration of task instructions
 * and personalized encouraging feedback for the student (Amina).
 */
class TutorSpeechService {
  private isAutoSpeechEnabled: boolean = true;
  private currentSpokenText: string = '';
  private isSpeaking: boolean = false;

  public setAutoSpeech(enabled: boolean) {
    this.isAutoSpeechEnabled = enabled;
  }

  public getAutoSpeech(): boolean {
    return this.isAutoSpeechEnabled;
  }

  public isCurrentlySpeaking(): boolean {
    return this.isSpeaking;
  }

  public stopSpeaking() {
    this.isSpeaking = false;
    voiceService.cancelSpeech();
  }

  /**
   * Reads out task instructions clearly to the student
   */
  public async speakTaskInstruction(
    instructionText: string,
    studentName: string = 'أمينة',
    options?: TutorSpeechOptions
  ): Promise<void> {
    if (!instructionText || !instructionText.trim()) return;

    const lang: Language = options?.language || 'ar';
    const isAr = lang === 'ar';

    if (options?.playSoundFx !== false) {
      soundEffects.playPop();
    }

    this.currentSpokenText = instructionText;
    this.isSpeaking = true;
    options?.onStart?.();

    try {
      await voiceService.speak(
        instructionText,
        lang,
        () => {
          this.isSpeaking = true;
          options?.onStart?.();
        },
        () => {
          this.isSpeaking = false;
          options?.onEnd?.();
        },
        (err) => {
          this.isSpeaking = false;
          options?.onError?.(err);
        }
      );
    } catch (e) {
      this.isSpeaking = false;
      options?.onEnd?.();
    }
  }

  /**
   * Reads encouraging feedback to the student based on outcome
   */
  public async speakEncouragingFeedback(
    type: EncouragementType,
    studentName: string = 'أمينة',
    customNote?: string,
    options?: TutorSpeechOptions
  ): Promise<void> {
    const lang: Language = options?.language || 'ar';
    const isAr = lang === 'ar';
    const isFr = lang === 'fr';

    let feedbackPhrase = '';

    if (isAr) {
      switch (type) {
        case 'correct':
          soundEffects.playSuccess();
          soundEffects.playStarEarned();
          feedbackPhrase = `يا سلام على الشطارة يا ${studentName}! إجابة ممتازة وصحيحة جداً! 🌟`;
          break;

        case 'celebrate':
          soundEffects.playSuccess();
          soundEffects.playStarEarned();
          feedbackPhrase = `ألف مبروك يا ${studentName} يا بطلة! أتممتي التحدي بتفوق وجمعتي النجوم! 🎉`;
          break;

        case 'almost':
          soundEffects.playBounce();
          feedbackPhrase = `محاولة ممتازة يا ${studentName}! اقتربتي جداً من الحل الصحيح، تعالي نفكر فيها خطوة بخطوة 💪`;
          break;

        case 'hint':
          soundEffects.playPop();
          feedbackPhrase = `ركزي يا ${studentName}: مفتاح الإجابة موجود في قراءة نص الدرس بهدوء 😉`;
          break;

        case 'welcome':
          soundEffects.playSchoolBell();
          feedbackPhrase = `أهلاً بكِ يا ${studentName} في درسنا اليوم! أنا المعلمة نور، ومتحمسة جداً نبدأ سوا 🚀`;
          break;

        case 'praise':
        default:
          soundEffects.playSuccess();
          feedbackPhrase = `ممتازة يا ${studentName}! تركيزك عالي وفهمك رائع ما شاء الله! ✨`;
          break;
      }
    } else if (isFr) {
      switch (type) {
        case 'correct':
          soundEffects.playSuccess();
          soundEffects.playStarEarned();
          feedbackPhrase = `Bravo ${studentName}! C'est une excellente réponse, tout à fait exacte! 🌟`;
          break;

        case 'celebrate':
          soundEffects.playSuccess();
          soundEffects.playStarEarned();
          feedbackPhrase = `Félicitations ${studentName}! Tu as brillamment réussi le défi et gagné tes étoiles! 🎉`;
          break;

        case 'almost':
          soundEffects.playBounce();
          feedbackPhrase = `Très bon essai, ${studentName}! Tu es tout près de la bonne réponse, réfléchissons ensemble étape par étape 💪`;
          break;

        case 'hint':
          soundEffects.playPop();
          feedbackPhrase = `Voici un indice, ${studentName}: relis attentivement le texte de la leçon 😉`;
          break;

        case 'welcome':
          soundEffects.playSchoolBell();
          feedbackPhrase = `Bienvenue dans notre leçon d'aujourd'hui, ${studentName}! Je suis Maîtresse Nour, et je suis ravie d'apprendre avec toi 🚀`;
          break;

        case 'praise':
        default:
          soundEffects.playSuccess();
          feedbackPhrase = `Magnifique travail, ${studentName}! Ta concentration et tes progrès sont superbes! ✨`;
          break;
      }
    } else {
      switch (type) {
        case 'correct':
          soundEffects.playSuccess();
          soundEffects.playStarEarned();
          feedbackPhrase = `Outstanding job, ${studentName}! That is completely correct! 🌟`;
          break;

        case 'celebrate':
          soundEffects.playSuccess();
          soundEffects.playStarEarned();
          feedbackPhrase = `Congratulations, ${studentName}! You mastered this challenge with flying stars! 🎉`;
          break;

        case 'almost':
          soundEffects.playBounce();
          feedbackPhrase = `Great try, ${studentName}! You are very close, let's look at the clue together 💪`;
          break;

        case 'hint':
          soundEffects.playPop();
          feedbackPhrase = `Here is a helpful tip, ${studentName}: re-read the first sentence carefully 😉`;
          break;

        case 'welcome':
          soundEffects.playSchoolBell();
          feedbackPhrase = `Welcome to today's lesson, ${studentName}! I am Miss Nour, and I'm thrilled to learn with you 🚀`;
          break;

        case 'praise':
        default:
          soundEffects.playSuccess();
          feedbackPhrase = `Wonderful work, ${studentName}! Your dedication is shining bright! ✨`;
          break;
      }
    }

    const fullSpoken = customNote ? `${feedbackPhrase} ${customNote}` : feedbackPhrase;
    this.currentSpokenText = fullSpoken;
    this.isSpeaking = true;
    options?.onStart?.();

    try {
      await voiceService.speak(
        fullSpoken,
        lang,
        () => {
          this.isSpeaking = true;
          options?.onStart?.();
        },
        () => {
          this.isSpeaking = false;
          options?.onEnd?.();
        },
        (err) => {
          this.isSpeaking = false;
          options?.onError?.(err);
        }
      );
    } catch {
      this.isSpeaking = false;
      options?.onEnd?.();
    }
  }

  /**
   * Replays the last spoken instruction or feedback
   */
  public replayLast(lang: Language = 'ar'): Promise<void> {
    if (!this.currentSpokenText) return Promise.resolve();
    return voiceService.speak(this.currentSpokenText, lang);
  }
}

export const tutorSpeechService = new TutorSpeechService();
