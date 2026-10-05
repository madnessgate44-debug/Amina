/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Language, MicPermissionState } from '../../types';

// Web Speech API interfaces
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface IWindowWithSpeech extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export interface STTResult {
  transcript: string;
  confidence: number;
  tierUsed: 'web_speech' | 'gemini_fallback';
  isNoisyOrEmpty: boolean;
}

export type STTStatus = 'idle' | 'listening' | 'processing' | 'error';

class VoiceService {
  private recognition: any = null;
  private currentAudioElement: HTMLAudioElement | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private mediaStream: MediaStream | null = null;

  constructor() {
    this.initWebSpeechRecognition();
  }

  private initWebSpeechRecognition() {
    if (typeof window === 'undefined') return;
    const win = window as IWindowWithSpeech;
    const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 1;
      } catch (e) {
        console.warn('SpeechRecognition initialization error:', e);
        this.recognition = null;
      }
    }
  }

  public isWebSpeechSupported(): boolean {
    if (typeof window === 'undefined') return false;
    const win = window as IWindowWithSpeech;
    return Boolean(win.SpeechRecognition || win.webkitSpeechRecognition);
  }

  public isSpeechSynthesisSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return Boolean('speechSynthesis' in window);
  }

  /**
   * Check current microphone permission status
   */
  public async getMicPermissionStatus(): Promise<MicPermissionState> {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices) {
      return 'unsupported';
    }

    try {
      if (navigator.permissions && navigator.permissions.query) {
        const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        return result.state as MicPermissionState;
      }
    } catch {
      // Permission API not supported for microphone on some browsers (e.g. Safari)
    }

    return 'prompt';
  }

  /**
   * Actively test or re-test microphone access
   */
  public async testMicrophone(): Promise<{ status: MicPermissionState; error?: string }> {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      return { status: 'unsupported', error: 'MediaDevices API not supported' };
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Clean up tracks immediately
      stream.getTracks().forEach((track) => track.stop());
      return { status: 'granted' };
    } catch (err: any) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        return { status: 'denied', error: 'Microphone permission denied' };
      }
      return { status: 'denied', error: err.message || 'Microphone access failed' };
    }
  }

  /**
   * Barge-in support: Instantly stops any active voice playback
   */
  public cancelSpeech(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (err) {
        console.warn('speechSynthesis.cancel error:', err);
      }
    }

    if (this.currentAudioElement) {
      try {
        this.currentAudioElement.pause();
        this.currentAudioElement.currentTime = 0;
        this.currentAudioElement = null;
      } catch (err) {
        console.warn('Audio pause error:', err);
      }
    }
  }

  /**
   * Start listening for speech (Tier 1 Web Speech with MediaRecorder Tier 2 safety net)
   */
  public startListening(
    language: Language,
    onInterimResult: (interimText: string) => void,
    onStatusChange: (status: STTStatus) => void
  ): Promise<STTResult> {
    // Barge-in: immediately cut off any active TTS playback
    this.cancelSpeech();

    return new Promise(async (resolve, reject) => {
      onStatusChange('listening');

      const targetLang = language === 'ar' ? 'ar-EG' : 'en-US';

      // Setup MediaRecorder as Tier 2 fallback recorder in parallel
      let fallbackAudioBlob: Blob | null = null;
      let recorderActive = false;

      if (navigator.mediaDevices?.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          this.mediaStream = stream;
          this.audioChunks = [];
          const recorder = new MediaRecorder(stream);
          this.mediaRecorder = recorder;

          recorder.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) {
              this.audioChunks.push(e.data);
            }
          };

          recorder.onstop = () => {
            if (this.audioChunks.length > 0) {
              fallbackAudioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
              // Clear chunk references
              this.audioChunks = [];
            }
            // Stop media stream tracks
            if (this.mediaStream) {
              this.mediaStream.getTracks().forEach((t) => t.stop());
              this.mediaStream = null;
            }
          };

          recorder.start(100);
          recorderActive = true;
        } catch (mediaErr) {
          console.warn('Could not initialize parallel MediaRecorder:', mediaErr);
        }
      }

      // Check if Web Speech Recognition is available
      if (this.recognition) {
        let finalTranscript = '';
        let hasResolved = false;

        this.recognition.lang = targetLang;

        this.recognition.onresult = (event: SpeechRecognitionEvent) => {
          let interim = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const res = event.results[i];
            if (res.isFinal) {
              finalTranscript += res[0].transcript;
            } else {
              interim += res[0].transcript;
            }
          }

          if (interim) {
            onInterimResult(interim);
          }
        };

        this.recognition.onerror = async (event: SpeechRecognitionErrorEvent) => {
          console.warn('SpeechRecognition error:', event.error);
          if (hasResolved) return;

          // Stop recorder
          if (recorderActive && this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            this.mediaRecorder.stop();
          }

          // If permission denied, reject immediately so UI can show mic denied
          if (event.error === 'not-allowed') {
            onStatusChange('error');
            hasResolved = true;
            return reject(new Error('mic_denied'));
          }

          // If no-speech or network error, attempt Tier 2 Gemini STT fallback
          onStatusChange('processing');
          try {
            await new Promise((r) => setTimeout(r, 200)); // allow recorder onstop to fire
            if (fallbackAudioBlob) {
              const geminiResult = await this.transcribeWithGeminiFallback(fallbackAudioBlob, language);
              hasResolved = true;
              onStatusChange('idle');
              // Discard raw audio immediately (Privacy Rule)
              fallbackAudioBlob = null;
              return resolve(geminiResult);
            }
          } catch (e) {
            console.warn('Fallback failed:', e);
          }

          hasResolved = true;
          onStatusChange('idle');
          resolve({
            transcript: '',
            confidence: 0,
            tierUsed: 'web_speech',
            isNoisyOrEmpty: true,
          });
        };

        this.recognition.onend = async () => {
          if (hasResolved) return;
          hasResolved = true;

          // Stop recorder
          if (recorderActive && this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            this.mediaRecorder.stop();
          }

          const trimmed = finalTranscript.trim();
          if (trimmed) {
            onStatusChange('idle');
            // Raw audio is discarded immediately
            fallbackAudioBlob = null;
            return resolve({
              transcript: trimmed,
              confidence: 0.9,
              tierUsed: 'web_speech',
              isNoisyOrEmpty: false,
            });
          }

          // If empty, try Gemini fallback if recorder produced audio
          onStatusChange('processing');
          try {
            await new Promise((r) => setTimeout(r, 200));
            if (fallbackAudioBlob && fallbackAudioBlob.size > 1000) {
              const geminiResult = await this.transcribeWithGeminiFallback(fallbackAudioBlob, language);
              onStatusChange('idle');
              // Discard raw audio immediately
              fallbackAudioBlob = null;
              return resolve(geminiResult);
            }
          } catch (e) {
            console.warn('Tier 2 Gemini fallback error:', e);
          }

          // Otherwise mark as noisy/empty
          onStatusChange('idle');
          fallbackAudioBlob = null;
          resolve({
            transcript: '',
            confidence: 0,
            tierUsed: 'web_speech',
            isNoisyOrEmpty: true,
          });
        };

        try {
          this.recognition.start();
        } catch (e) {
          console.warn('SpeechRecognition start error:', e);
          try {
            this.recognition.stop();
          } catch {}
          reject(e);
        }
      } else {
        // Web Speech API completely unavailable, rely on MediaRecorder + Gemini Tier 2
        if (!recorderActive) {
          onStatusChange('error');
          return reject(new Error('voice_unsupported'));
        }

        // Wait for stopListening to be called
        // Handler will be resolved when stopListening is triggered
      }
    });
  }

  /**
   * Stop listening actively
   */
  public stopListening(): void {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (err) {
        console.warn('Recognition stop error:', err);
      }
    }

    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try {
        this.mediaRecorder.stop();
      } catch (err) {
        console.warn('MediaRecorder stop error:', err);
      }
    }

    if (this.mediaStream) {
      try {
        this.mediaStream.getTracks().forEach((track) => track.stop());
        this.mediaStream = null;
      } catch (err) {
        console.warn('MediaStream stop error:', err);
      }
    }
  }

  /**
   * Tier 2 Gemini STT Fallback: Send audio bytes to /api/stt
   * Raw audio blob is discarded right after reading.
   */
  private async transcribeWithGeminiFallback(audioBlob: Blob, language: Language): Promise<STTResult> {
    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          const res = reader.result as string;
          // extract base64 part
          const base64 = res.split(',')[1] || '';
          resolve(base64);
        };
        reader.onerror = reject;
      });
      reader.readAsDataURL(audioBlob);

      const base64Audio = await base64Promise;

      const resp = await fetch('/api/stt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioBase64: base64Audio,
          mimeType: audioBlob.type || 'audio/webm',
          language,
        }),
      });

      if (!resp.ok) {
        throw new Error('STT server response not ok');
      }

      const data = await resp.json();
      const transcript = (data.transcript || '').trim();

      return {
        transcript,
        confidence: transcript ? 0.85 : 0,
        tierUsed: 'gemini_fallback',
        isNoisyOrEmpty: !transcript,
      };
    } catch (err) {
      console.warn('transcribeWithGeminiFallback error:', err);
      return {
        transcript: '',
        confidence: 0,
        tierUsed: 'gemini_fallback',
        isNoisyOrEmpty: true,
      };
    }
  }

  private clientTtsCache: Map<string, string> = new Map();

  /**
   * Unlock audio context and SpeechSynthesis on first user touch/click
   */
  public unlockAudio(): void {
    if (typeof window !== 'undefined') {
      try {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.resume();
        }
        // Unlock HTMLAudio by playing and pausing a zero-length data sound
        const unlockAudio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA');
        unlockAudio.volume = 0.01;
        unlockAudio.play().catch(() => {});
      } catch (e) {
        // ignore
      }
    }
  }

  /**
   * Speech Synthesis: High-Fidelity Gemini TTS Priority with Web Speech Fallback
   */
  public async speak(
    text: string,
    language: Language,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (err: any) => void
  ): Promise<void> {
    this.cancelSpeech();

    if (!text || !text.trim()) {
      onEnd?.();
      return Promise.resolve();
    }

    const cleanText = text
      .replace(/[*#_~`]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    // Unlock audio on playback attempt
    this.unlockAudio();

    // 1. Try Premier Studio-Grade Gemini TTS first for natural, human teacher voice
    const geminiSuccess = await this.speakWithGeminiTTS(cleanText, language, onStart, onEnd, onError);
    if (geminiSuccess) {
      return;
    }

    // 2. Fallback to Local Web Speech Synthesis if server TTS unavailable or offline
    if (this.isSpeechSynthesisSupported()) {
      await this.speakWithWebSpeech(cleanText, language, onStart, onEnd, onError);
      return;
    }

    onEnd?.();
  }

  /**
   * Play speech using local Web Speech Synthesis (Offline Fallback)
   */
  private speakWithWebSpeech(
    cleanText: string,
    language: Language,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (err: any) => void
  ): Promise<void> {
    return new Promise((resolve) => {
      try {
        window.speechSynthesis.cancel();
        window.speechSynthesis.resume();
      } catch (e) {
        // ignore
      }

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = language === 'ar' ? 0.95 : 1.0;
      utterance.pitch = 1.05;

      if (language === 'ar') {
        utterance.lang = 'ar-EG';
      } else if (language === 'fr') {
        utterance.lang = 'fr-FR';
      } else {
        utterance.lang = 'en-US';
      }

      const assignBestVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          let bestVoice: SpeechSynthesisVoice | undefined;

          if (language === 'ar') {
            bestVoice =
              voices.find((v) => v.lang === 'ar-EG' || v.lang.includes('EG')) ||
              voices.find((v) => v.lang.startsWith('ar'));
          } else if (language === 'fr') {
            bestVoice =
              voices.find((v) => v.lang.startsWith('fr') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Thomas'))) ||
              voices.find((v) => v.lang.startsWith('fr'));
          } else {
            bestVoice =
              voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha'))) ||
              voices.find((v) => v.lang.startsWith('en'));
          }

          if (bestVoice) {
            utterance.voice = bestVoice;
          }
        }
      };

      assignBestVoice();
      if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = () => assignBestVoice();
      }

      utterance.onstart = () => {
        onStart?.();
      };

      utterance.onend = () => {
        onEnd?.();
        resolve();
      };

      utterance.onerror = (e) => {
        if (e.error !== 'canceled' && e.error !== 'interrupted') {
          onError?.(e);
        }
        onEnd?.();
        resolve();
      };

      try {
        window.speechSynthesis.resume();
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        onError?.(err);
        onEnd?.();
        resolve();
      }
    });
  }

  /**
   * Tier 1 Gemini TTS: Studio-Quality Lifelike Teacher Voice
   */
  private async speakWithGeminiTTS(
    text: string,
    language: Language,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (err: any) => void
  ): Promise<boolean> {
    try {
      const cacheKey = `${language}:${text}`;
      let audioBase64 = this.clientTtsCache.get(cacheKey);

      if (!audioBase64) {
        const resp = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, language }),
        });

        if (!resp.ok) {
          return false;
        }

        const data = await resp.json();
        if (!data.audioBase64) {
          return false;
        }

        audioBase64 = data.audioBase64;
        this.clientTtsCache.set(cacheKey, audioBase64!);
      }

      const audioUrl = `data:audio/wav;base64,${audioBase64}`;
      const audio = new Audio(audioUrl);
      this.currentAudioElement = audio;

      return new Promise<boolean>((resolve) => {
        audio.onplay = () => onStart?.();
        audio.onended = () => {
          this.currentAudioElement = null;
          onEnd?.();
          resolve(true);
        };
        audio.onerror = (e) => {
          this.currentAudioElement = null;
          onError?.(e);
          onEnd?.();
          resolve(false);
        };

        audio.play().catch((err) => {
          console.warn('Audio play autoplay restriction:', err);
          this.currentAudioElement = null;
          resolve(false);
        });
      });
    } catch (e) {
      console.warn('speakWithGeminiTTS error:', e);
      return false;
    }
  }
}

export const voiceService = new VoiceService();
