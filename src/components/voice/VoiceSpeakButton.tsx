/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { voiceService } from '../../services/voice/voiceService';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';

interface VoiceSpeakButtonProps {
  text: string;
  size?: 'sm' | 'md';
  autoPlay?: boolean;
  className?: string;
  label?: string;
}

export const VoiceSpeakButton: React.FC<VoiceSpeakButtonProps> = ({
  text,
  size = 'sm',
  autoPlay = false,
  className = '',
  label,
}) => {
  const { language, settings } = useApp();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Auto-play when mounted if enabled in settings and requested
  useEffect(() => {
    if (autoPlay && settings.companionVoiceEnabled && text && text.trim()) {
      handleSpeak();
    }

    return () => {
      // Clean up when unmounting
      if (isPlaying) {
        voiceService.cancelSpeech();
      }
    };
  }, [text, autoPlay, settings.companionVoiceEnabled]);

  const handleSpeak = async () => {
    if (!settings.companionVoiceEnabled) return;

    if (isPlaying) {
      voiceService.cancelSpeech();
      setIsPlaying(false);
      return;
    }

    setIsLoading(true);
    try {
      await voiceService.speak(
        text,
        language,
        () => {
          setIsLoading(false);
          setIsPlaying(true);
        },
        () => {
          setIsPlaying(false);
          setIsLoading(false);
        },
        () => {
          setIsPlaying(false);
          setIsLoading(false);
        }
      );
    } catch {
      setIsPlaying(false);
      setIsLoading(false);
    }
  };

  if (!settings.companionVoiceEnabled) {
    return null;
  }

  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';
  const buttonPadding = size === 'sm' ? 'p-1.5' : 'px-2.5 py-1.5';

  return (
    <button
      type="button"
      onClick={handleSpeak}
      className={`rounded-xl transition-all flex items-center gap-1.5 ${buttonPadding} ${
        isPlaying
          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-200 animate-pulse border border-amber-300'
          : 'bg-indigo-50/70 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60'
      } ${className}`}
      title={isPlaying ? 'إيقاف الصوت / Stop audio' : 'استمع للرد / Listen'}
      aria-label="Toggle voice output"
    >
      {isLoading ? (
        <Loader2 className={`${iconSize} animate-spin`} />
      ) : isPlaying ? (
        <VolumeX className={iconSize} />
      ) : (
        <Volume2 className={iconSize} />
      )}
      {label && <span className="text-[11px] font-semibold">{label}</span>}
    </button>
  );
};
