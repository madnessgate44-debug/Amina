/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { voiceService, STTStatus } from '../../services/voice/voiceService';
import {
  Mic,
  MicOff,
  Square,
  Check,
  RotateCcw,
  Edit3,
  Sparkles,
  AlertCircle,
  ShieldCheck,
  Keyboard,
} from 'lucide-react';

interface VoiceInputControlProps {
  onTranscriptConfirmed: (transcript: string) => void;
  onFallbackToText?: () => void;
  className?: string;
  buttonSize?: 'sm' | 'md' | 'lg';
}

export const VoiceInputControl: React.FC<VoiceInputControlProps> = ({
  onTranscriptConfirmed,
  onFallbackToText,
  className = '',
  buttonSize = 'md',
}) => {
  const { t, language, settings, updateMicPermission } = useApp();
  const isArabic = language === 'ar';

  const [status, setStatus] = useState<STTStatus>('idle');
  const [interimText, setInterimText] = useState('');
  const [draftTranscript, setDraftTranscript] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isNoisyOrEmpty, setIsNoisyOrEmpty] = useState(false);
  const [isMicDenied, setIsMicDenied] = useState(settings.micPermissionStatus === 'denied');

  const isRecording = status === 'listening';
  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isHoldingRef = useRef(false);

  // Sync mic permission state
  useEffect(() => {
    setIsMicDenied(settings.micPermissionStatus === 'denied');
  }, [settings.micPermissionStatus]);

  const startVoiceRecording = async () => {
    // Barge-in: cut off any playing companion audio
    voiceService.cancelSpeech();

    setIsNoisyOrEmpty(false);
    setInterimText('');

    try {
      const result = await voiceService.startListening(
        language,
        (text) => setInterimText(text),
        (newStatus) => setStatus(newStatus)
      );

      if (result.isNoisyOrEmpty || !result.transcript.trim()) {
        setIsNoisyOrEmpty(true);
        setDraftTranscript('');
        setShowReviewModal(true);
      } else {
        setDraftTranscript(result.transcript);
        setIsNoisyOrEmpty(false);
        setShowReviewModal(true);
      }
      // Audio is discarded immediately by voiceService (Privacy rule)
    } catch (err: any) {
      if (err.message === 'mic_denied') {
        setIsMicDenied(true);
        updateMicPermission('denied');
      }
      setStatus('idle');
    }
  };

  const stopVoiceRecording = () => {
    if (isRecording) {
      voiceService.stopListening();
    }
  };

  // Support Tap-to-toggle
  const handleToggleClick = () => {
    if (isMicDenied) return;
    if (isRecording) {
      stopVoiceRecording();
    } else {
      startVoiceRecording();
    }
  };

  // Support Press-and-Hold
  const handleMouseDown = () => {
    if (isMicDenied) return;
    isHoldingRef.current = false;
    pressTimerRef.current = setTimeout(() => {
      isHoldingRef.current = true;
      if (!isRecording) {
        startVoiceRecording();
      }
    }, 250);
  };

  const handleMouseUp = () => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
    if (isHoldingRef.current && isRecording) {
      stopVoiceRecording();
      isHoldingRef.current = false;
    }
  };

  // Support Touch press-and-hold on mobile
  const handleTouchStart = () => {
    handleMouseDown();
  };

  const handleTouchEnd = () => {
    handleMouseUp();
  };

  const handleConfirmTranscript = () => {
    const finalClean = draftTranscript.trim();
    if (finalClean) {
      // Feed ONLY confirmed transcript downstream
      onTranscriptConfirmed(finalClean);
    }
    setShowReviewModal(false);
    setDraftTranscript('');
    setInterimText('');
  };

  const handleRerecord = () => {
    setShowReviewModal(false);
    setDraftTranscript('');
    setInterimText('');
    setIsNoisyOrEmpty(false);
    setTimeout(() => {
      startVoiceRecording();
    }, 150);
  };

  const handleDismissToText = () => {
    setShowReviewModal(false);
    setDraftTranscript('');
    setInterimText('');
    onFallbackToText?.();
  };

  const buttonSizeClasses = {
    sm: 'w-8 h-8 rounded-lg text-xs',
    md: 'w-10 h-10 rounded-xl text-sm',
    lg: 'w-12 h-12 rounded-2xl text-base',
  }[buttonSize];

  return (
    <>
      <div className={`relative inline-flex items-center ${className}`}>
        {isMicDenied ? (
          <div className="relative group">
            <button
              type="button"
              disabled
              className={`${buttonSizeClasses} bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-300 dark:border-slate-700 flex items-center justify-center cursor-not-allowed`}
              title={t.voice.micDeniedAdvice}
              aria-label="Microphone disabled"
            >
              <MicOff className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleToggleClick}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className={`${buttonSizeClasses} flex items-center justify-center transition-all ${
              isRecording
                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/30 scale-105 animate-pulse'
                : 'bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
            }`}
            title={isRecording ? t.voice.pushToTalkActive : t.voice.pushToTalk}
            aria-label="Push to Talk"
          >
            {isRecording ? (
              <Square className="w-4 h-4 fill-white" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </button>
        )}

        {/* Live recording status popover if currently recording */}
        {isRecording && (
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white text-[11px] px-3 py-1.5 rounded-xl shadow-lg border border-slate-700 whitespace-nowrap z-30 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span>{interimText || t.voice.listening}</span>
          </div>
        )}
      </div>

      {/* Transcript Confirmation Dialog (Must be confirmed by student before use) */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150"
            dir={isArabic ? 'rtl' : 'ltr'}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {t.voice.transcriptReviewTitle}
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    {t.voice.transcriptReviewSubtitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/40">
                <ShieldCheck className="w-3 h-3" />
                <span>{t.voice.audioDiscardedBadge}</span>
              </div>
            </div>

            {/* Noisy or empty state fallback */}
            {isNoisyOrEmpty ? (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 space-y-3">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed font-medium">
                    {t.voice.noisyOrEmptyPrompt}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleRerecord}
                    className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{t.voice.reRecord}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDismissToText}
                    className="py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5"
                  >
                    <Keyboard className="w-3.5 h-3.5" />
                    <span>{t.voice.tryTypingInstead}</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Transcript view and edit area */
              <div className="space-y-3">
                <div className="relative">
                  <textarea
                    value={draftTranscript}
                    onChange={(e) => setDraftTranscript(e.target.value)}
                    rows={3}
                    placeholder="اكتب أو عدل النص هنا..."
                    className="w-full p-3 text-xs rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/20 dark:bg-indigo-950/20 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 resize-none font-medium leading-relaxed"
                  />
                  <span className="absolute bottom-2.5 left-2.5 rtl:left-auto rtl:right-2.5 text-[10px] text-indigo-400 dark:text-indigo-500 flex items-center gap-1">
                    <Edit3 className="w-3 h-3" />
                    <span>{t.voice.editTranscript}</span>
                  </span>
                </div>

                {/* Action buttons: Re-record or Confirm */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleRerecord}
                    className="py-2.5 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{t.voice.reRecord}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleConfirmTranscript}
                    disabled={!draftTranscript.trim()}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 transition-all"
                  >
                    <Check className="w-4 h-4" />
                    <span>{t.voice.confirmTranscript}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
