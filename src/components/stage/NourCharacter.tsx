/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { NourState, SubjectOutfit } from '../../types/stage';

interface NourCharacterProps {
  state: NourState;
  outfit?: SubjectOutfit;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

/**
 * Miss Noor — an expressive, human female teacher.
 * Keep her appearance consistent across Home, Feed and the classroom;
 * state changes affect expression and posture, never her identity.
 */
export const NourCharacter: React.FC<NourCharacterProps> = ({
  state = 'idle',
  outfit = 'arabic',
  className = '',
  size = 'md',
  onClick,
}) => {
  const sizeMap = {
    sm: 'w-24 h-28',
    md: 'w-36 h-44 sm:w-44 sm:h-52',
    lg: 'w-48 h-56 sm:w-56 sm:h-64',
  } as const;

  const palette: Record<SubjectOutfit, { coat: string; accent: string; badge: string }> = {
    arabic: { coat: '#0f766e', accent: '#fbbf24', badge: '✦' },
    english: { coat: '#2563eb', accent: '#fbbf24', badge: 'A' },
    social_studies: { coat: '#a16207', accent: '#34d399', badge: '⌖' },
    calligraphy: { coat: '#115e59', accent: '#fbbf24', badge: '✒' },
    islamic: { coat: '#047857', accent: '#fde68a', badge: '☾' },
    math: { coat: '#4f46e5', accent: '#f9a8d4', badge: '∑' },
    science: { coat: '#0369a1', accent: '#c4b5fd', badge: '⚗' },
    french: { coat: '#be123c', accent: '#93c5fd', badge: 'É' },
  };

  const colors = palette[outfit] || palette.arabic;
  const talking = state === 'talking';
  const smiling = state === 'excited' || state === 'celebrating' || state === 'encouraging';
  const thinking = state === 'thinking';
  const confused = state === 'confused';
  const listening = state === 'listening';

  const motion = state === 'excited' || state === 'celebrating'
    ? 'animate-bounce'
    : state === 'thinking'
      ? '-rotate-2 transition-transform duration-500'
      : state === 'listening'
        ? 'scale-[1.03] transition-transform duration-300'
        : 'transition-transform duration-500 hover:scale-[1.02]';

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center select-none ${onClick ? 'cursor-pointer' : ''} ${sizeMap[size]} ${motion} ${className}`}
      role="img"
      aria-label={`Miss Noor, your teacher — ${state}`}
    >
      <svg viewBox="0 0 220 260" className="h-full w-full overflow-visible drop-shadow-lg" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="noor-coat" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={colors.coat} />
            <stop offset="100%" stopColor="#172554" />
          </linearGradient>
          <linearGradient id="noor-skin" x1="0" y1="0" x2="0.9" y2="1">
            <stop offset="0%" stopColor="#f7c9a8" />
            <stop offset="100%" stopColor="#d99572" />
          </linearGradient>
        </defs>

        {state === 'celebrating' && (
          <g fill={colors.accent}>
            <path d="M22 58l5 12 13 1-10 8 3 13-11-7-11 7 3-13-10-8 13-1z" />
            <path d="M190 36l4 9 10 1-8 6 2 10-8-5-8 5 2-10-8-6 10-1z" />
            <circle cx="27" cy="145" r="4" />
            <circle cx="194" cy="148" r="4" />
          </g>
        )}

        {/* Hair behind the face */}
        <path d="M49 111C34 72 42 27 83 17c34-9 74 4 86 38 9 25 3 65-8 94l-19 29H72l-19-28z" fill="#30201d" />
        <path d="M56 80c-12 35-8 86 5 112l18-9-8-88zM163 79c13 35 8 88-7 113l-18-10 9-89z" fill="#49302a" />

        {/* Neck and shoulders */}
        <path d="M87 155h46v33H87z" fill="#c98261" />
        <path d="M48 244c4-37 23-58 48-65h30c27 7 45 28 49 65z" fill="url(#noor-coat)" />
        <path d="M87 177l23 25 23-25 19 18-24 49H92l-24-49z" fill="#fff7ed" />
        <path d="M87 178l23 24-18 21-22-28zM133 178l-23 24 18 21 22-28z" fill={colors.coat} />
        <path d="M89 226l21-24 21 24-11 18h-20z" fill={colors.accent} opacity=".95" />
        <circle cx="110" cy="222" r="8" fill="#fff7ed" />
        <text x="110" y="225" textAnchor="middle" fontSize="8" fontWeight="900" fill={colors.coat}>{colors.badge}</text>

        {/* Face */}
        <ellipse cx="110" cy="103" rx="55" ry="66" fill="url(#noor-skin)" />
        <path d="M57 87c-2-40 23-67 56-67 33 0 54 25 53 62-13-5-24-17-29-30-15 17-42 25-80 24z" fill="#30201d" />
        <path d="M59 81c-4 28 1 55 12 72-17-8-24-30-21-51 1-9 4-16 9-21zM161 80c5 28 0 55-12 73 17-9 24-30 21-52-1-9-4-16-9-21z" fill="#3b2722" />
        <path d="M65 76c10-17 25-25 43-27 20-2 34 5 48 18-13-3-25-10-33-19-13 15-34 24-58 28z" fill="#3b2722" />

        {/* Ears and small earrings */}
        <ellipse cx="54" cy="108" rx="8" ry="13" fill="#d99572" />
        <ellipse cx="166" cy="108" rx="8" ry="13" fill="#d99572" />
        <circle cx="54" cy="122" r="3" fill={colors.accent} />
        <circle cx="166" cy="122" r="3" fill={colors.accent} />

        {/* Brows and expressive eyes */}
        <path d={confused ? 'M72 86q13-12 25-3' : 'M72 84q12-8 24 0'} stroke="#49302a" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d={thinking ? 'M124 82q13-10 25-1' : 'M124 84q12-8 24 0'} stroke="#49302a" strokeWidth="4" fill="none" strokeLinecap="round" />
        {listening ? (
          <g fill="#fff" stroke="#49302a" strokeWidth="2">
            <ellipse cx="85" cy="103" rx="10" ry="13" />
            <ellipse cx="135" cy="103" rx="10" ry="13" />
            <circle cx="86" cy="105" r="4" fill="#49302a" stroke="none" />
            <circle cx="134" cy="105" r="4" fill="#49302a" stroke="none" />
          </g>
        ) : (
          <g>
            <ellipse cx="85" cy="103" rx="9" ry={state === 'idle' ? 8 : 11} fill="#fff" />
            <ellipse cx="135" cy="103" rx="9" ry={state === 'idle' ? 8 : 11} fill="#fff" />
            <circle cx={thinking ? 88 : 86} cy="104" r="4.5" fill="#49302a" />
            <circle cx={thinking ? 138 : 134} cy="104" r="4.5" fill="#49302a" />
            <circle cx="87" cy="102" r="1.5" fill="#fff" />
            <circle cx="135" cy="102" r="1.5" fill="#fff" />
          </g>
        )}

        {/* Nose, cheeks and mouth */}
        <path d="M109 108q-5 13 2 15" stroke="#bd795d" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <ellipse cx="75" cy="126" rx="10" ry="5" fill="#e88f88" opacity=".35" />
        <ellipse cx="145" cy="126" rx="10" ry="5" fill="#e88f88" opacity=".35" />
        {talking ? (
          <ellipse cx="110" cy="139" rx="8" ry="10" fill="#8f3d42" className="animate-pulse" />
        ) : smiling ? (
          <path d="M94 135q16 21 32 0" stroke="#8f3d42" strokeWidth="4" fill="#fff7ed" strokeLinecap="round" />
        ) : (
          <path d="M96 137q14 12 28 0" stroke="#8f3d42" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        )}

        {/* Teacher detail: a slim lapel pin, not a robot badge */}
        <path d="M153 204l6 10-6 10-6-10z" fill={colors.accent} />
      </svg>
    </div>
  );
};
