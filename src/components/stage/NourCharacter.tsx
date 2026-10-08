/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useId } from 'react';
import { NourState, SubjectOutfit } from '../../types/stage';

interface NourCharacterProps {
  state: NourState;
  outfit?: SubjectOutfit;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

/**
 * Nour (نور) — The Animated Personal Teacher
 * Feed teacher presentation: expressive human-like visual treatment
 *
 * Implements 9 expressive states with smooth CSS keyframe animations
 * and 8 subject-specific outfit variations.
 */
export const NourCharacter: React.FC<NourCharacterProps> = ({
  state = 'idle',
  outfit = 'arabic',
  className = '',
  size = 'md',
  onClick,
}) => {
  const uid = useId();

  // Size scale
  const sizeMap = {
    sm: 'w-24 h-28',
    md: 'w-36 h-44 sm:w-44 sm:h-52',
    lg: 'w-48 h-56 sm:w-56 sm:h-64',
  };

  // State-specific transforms & motion
  const getContainerAnimationClass = () => {
    switch (state) {
      case 'talking':
        return 'animate-pulse duration-700';
      case 'excited':
        return 'animate-bounce duration-500';
      case 'celebrating':
        return 'animate-bounce duration-300';
      case 'listening':
        return 'scale-105 transition-transform duration-300 -translate-y-1';
      case 'thinking':
        return '-rotate-2 transition-transform duration-500';
      case 'confused':
        return 'rotate-3 transition-transform duration-300';
      case 'gentle_correct':
        return 'scale-100 transition-transform duration-500';
      case 'encouraging':
        return 'scale-105 transition-transform duration-300';
      case 'idle':
      default:
        return 'hover:scale-105 transition-transform duration-500';
    }
  };

  // Eye and Face expressions
  const isBlinking = state === 'idle';
  const isEyesUp = state === 'thinking';
  const isEyesWide = state === 'excited' || state === 'celebrating';
  const isOneBrowRaised = state === 'confused';
  const isTalking = state === 'talking';
  const isSmilingWide = state === 'excited' || state === 'celebrating' || state === 'encouraging';
  const isHeadTilted = state === 'gentle_correct' || state === 'confused';

  // Outfit specific accessories / colors
  const getOutfitDetails = () => {
    switch (outfit) {
      case 'english':
        return {
          clothingColor: '#3b82f6', // Bright modern blue hoodie
          accentColor: '#f59e0b',
          chestBadge: 'A',
          headwear: null,
        };
      case 'social_studies':
        return {
          clothingColor: '#d97706', // Explorer khaki/amber
          accentColor: '#10b981',
          chestBadge: '🧭',
          headwear: 'explorer_hat',
        };
      case 'calligraphy':
        return {
          clothingColor: '#0f766e', // Teal calligrapher apron
          accentColor: '#d97706',
          chestBadge: '✒️',
          headwear: null,
        };
      case 'islamic':
        return {
          clothingColor: '#059669', // Emerald respectful attire
          accentColor: '#fef08a',
          chestBadge: '🌙',
          headwear: null,
        };
      case 'math':
        return {
          clothingColor: '#6366f1', // Indigo with measuring tape
          accentColor: '#ec4899',
          chestBadge: '📐',
          headwear: 'goggles',
        };
      case 'science':
        return {
          clothingColor: '#0284c7', // Lab coat cyan
          accentColor: '#a855f7',
          chestBadge: '🧪',
          headwear: null,
        };
      case 'french':
        return {
          clothingColor: '#e11d48', // Paris red/navy
          accentColor: '#3b82f6',
          chestBadge: '⚜️',
          headwear: 'beret',
        };
      case 'arabic':
      default:
        return {
          clothingColor: '#0284c7', // Soft Egyptian Nile Turquoise galabeya
          accentColor: '#f59e0b',   // Gold embroidered sash
          chestBadge: '☀️',
          headwear: null,
        };
    }
  };

  const outfitCfg = getOutfitDetails();

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center select-none cursor-pointer ${sizeMap[size]} ${getContainerAnimationClass()} ${className}`}
      role="img"
      aria-label={`نور — المعلم الروبوت الصديق (الحالة: ${state})`}
    >
      <svg
        viewBox="0 0 200 240"
        className="w-full h-full drop-shadow-md overflow-visible"
      >
        <defs>
          {/* Head & Body Gradients */}
          <linearGradient id={`nour_metal_${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#f1f5f9" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>

          <linearGradient id={`nour_gold_${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>

          <linearGradient id={`nour_cloth_${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={outfitCfg.clothingColor} />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.8" />
          </linearGradient>

          <radialGradient id={`nour_glow_${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Celebrating Confetti & Sparkles */}
        {state === 'celebrating' && (
          <g className="animate-spin duration-3000 origin-center">
            <circle cx="20" cy="30" r="3" fill="#f59e0b" />
            <circle cx="180" cy="40" r="4" fill="#ec4899" />
            <circle cx="40" cy="180" r="3" fill="#10b981" />
            <circle cx="170" cy="190" r="3.5" fill="#6366f1" />
            <polygon points="100,5 104,15 115,15 106,21 110,31 100,24 90,31 94,21 85,15 96,15" fill="#fbbf24" />
          </g>
        )}

        {state === 'excited' && (
          <g>
            <circle cx="25" cy="40" r="5" fill="#facc15" className="animate-ping" />
            <circle cx="175" cy="45" r="4" fill="#38bdf8" className="animate-ping" />
          </g>
        )}

        {/* Floating gentle shadow beneath */}
        <ellipse cx="100" cy="232" rx="42" ry="7" fill="#0f172a" fillOpacity="0.18" />

        {/* BODY & CLOTHING */}
        <g transform="translate(0, 10)">
          {/* Main Torso */}
          <path
            d="M65,130 C65,115 135,115 135,130 L145,200 C145,215 55,215 55,200 Z"
            fill={`url(#nour_cloth_${uid})`}
          />

          {/* Traditional Egyptian Sash or Outfit Belt */}
          <path
            d="M58,165 Q100,175 142,165 L144,178 Q100,188 56,178 Z"
            fill={`url(#nour_gold_${uid})`}
          />

          {/* Chest Badge / Gem (Nour's glowing core) */}
          <circle cx="100" cy="148" r="14" fill="#0f172a" opacity="0.4" />
          <circle
            cx="100"
            cy="148"
            r="10"
            fill={state === 'excited' || state === 'celebrating' ? '#f59e0b' : '#38bdf8'}
            className={state === 'talking' ? 'animate-pulse' : ''}
          />
          <text
            x="100"
            y="152"
            textAnchor="middle"
            fontSize="10"
            fill="#ffffff"
            fontWeight="bold"
          >
            {outfitCfg.chestBadge}
          </text>

          {/* Hands / Arms */}
          {state === 'celebrating' ? (
            // Arms up in air
            <g stroke="#cbd5e1" strokeWidth="10" strokeLinecap="round">
              <line x1="62" y1="135" x2="35" y2="85" />
              <line x1="138" y1="135" x2="165" y2="85" />
              <circle cx="35" cy="85" r="7" fill="#ffffff" stroke="none" />
              <circle cx="165" cy="85" r="7" fill="#ffffff" stroke="none" />
            </g>
          ) : state === 'thinking' ? (
            // One hand to chin
            <g stroke="#cbd5e1" strokeWidth="9" strokeLinecap="round">
              <line x1="62" y1="140" x2="50" y2="180" />
              <line x1="138" y1="140" x2="115" y2="105" />
              <circle cx="115" cy="105" r="7" fill="#ffffff" stroke="none" />
            </g>
          ) : state === 'encouraging' ? (
            // Both hands welcoming forward
            <g stroke="#cbd5e1" strokeWidth="9" strokeLinecap="round">
              <line x1="62" y1="145" x2="35" y2="135" />
              <line x1="138" y1="145" x2="165" y2="135" />
              <circle cx="35" cy="135" r="8" fill="#ffffff" stroke="none" />
              <circle cx="165" cy="135" r="8" fill="#ffffff" stroke="none" />
            </g>
          ) : (
            // Gentle resting hands
            <g stroke="#cbd5e1" strokeWidth="9" strokeLinecap="round">
              <line x1="62" y1="145" x2="48" y2="178" />
              <line x1="138" y1="145" x2="152" y2="178" />
              <circle cx="48" cy="178" r="6" fill="#ffffff" stroke="none" />
              <circle cx="152" cy="178" r="6" fill="#ffffff" stroke="none" />
            </g>
          )}
        </g>

        {/* HEAD & ROBOT ANTENNAE */}
        <g
          transform={`translate(0, ${isHeadTilted ? '2' : '0'}) ${
            state === 'confused' ? 'rotate(4 100 70)' : state === 'gentle_correct' ? 'rotate(-3 100 70)' : ''
          }`}
        >
          {/* Antenna Stem */}
          <line
            x1="100"
            y1="32"
            x2="100"
            y2="12"
            stroke="#94a3b8"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Glowing Antenna Orb */}
          <circle
            cx="100"
            cy="10"
            r={state === 'listening' ? '9' : '7'}
            fill={state === 'listening' ? '#f59e0b' : '#38bdf8'}
            className={state === 'listening' ? 'animate-ping' : ''}
          />
          <circle
            cx="100"
            cy="10"
            r="6"
            fill={state === 'listening' ? '#fbbf24' : '#38bdf8'}
          />

          {/* Ear Buds / Side Sensor Wings */}
          <rect
            x="40"
            y="58"
            width="10"
            height="26"
            rx="5"
            fill={outfitCfg.accentColor}
          />
          <rect
            x="150"
            y="58"
            width="10"
            height="26"
            rx="5"
            fill={outfitCfg.accentColor}
          />

          {/* Head Sphere */}
          <rect
            x="46"
            y="30"
            width="108"
            height="86"
            rx="40"
            fill={`url(#nour_metal_${uid})`}
            stroke="#cbd5e1"
            strokeWidth="2"
          />

          {/* Headwear Variations */}
          {outfitCfg.headwear === 'explorer_hat' && (
            <g transform="translate(100, 26)">
              <ellipse cx="0" cy="0" rx="60" ry="12" fill="#d97706" />
              <path d="M-36,0 C-36,-24 36,-24 36,0 Z" fill="#b45309" />
              <rect x="-36" y="-3" width="72" height="6" fill="#10b981" />
            </g>
          )}

          {outfitCfg.headwear === 'beret' && (
            <g transform="translate(100, 26)">
              <ellipse cx="8" cy="-6" rx="46" ry="16" fill="#be123c" transform="rotate(-8)" />
              <circle cx="10" cy="-22" r="3" fill="#be123c" />
            </g>
          )}

          {outfitCfg.headwear === 'goggles' && (
            <g transform="translate(100, 52)">
              <rect x="-42" y="-12" width="36" height="24" rx="8" fill="#1e293b" stroke="#f59e0b" strokeWidth="3" />
              <rect x="6" y="-12" width="36" height="24" rx="8" fill="#1e293b" stroke="#f59e0b" strokeWidth="3" />
              <line x1="-6" y1="0" x2="6" y2="0" stroke="#f59e0b" strokeWidth="4" />
            </g>
          )}

          {/* Dark Glass Visor Screen for Eyes */}
          <rect
            x="58"
            y="46"
            width="84"
            height="52"
            rx="22"
            fill="#0f172a"
          />

          {/* EYES (Anime / Friendly Robot LED Eyes) */}
          <g>
            {/* Left Eye */}
            <g transform={`translate(${isEyesUp ? '74, 62' : '74, 68'})`}>
              {isBlinking ? (
                // Blinking curve
                <path d="M-10,0 Q0,5 10,0" stroke="#38bdf8" strokeWidth="3.5" fill="none" strokeLinecap="round" />
              ) : isSmilingWide ? (
                // Happy squint inverted crescent
                <path d="M-10,2 Q0,-8 10,2" stroke="#38bdf8" strokeWidth="4" fill="none" strokeLinecap="round" />
              ) : (
                // Expressive glowing oval
                <>
                  <ellipse cx="0" cy="0" rx={isEyesWide ? '10' : '8'} ry={isEyesWide ? '13' : '10'} fill="#38bdf8" />
                  <circle cx="-3" cy="-3" r="3" fill="#ffffff" />
                  <circle cx="3" cy="3" r="1.5" fill="#ffffff" />
                </>
              )}
            </g>

            {/* Right Eye */}
            <g transform={`translate(${isEyesUp ? '126, 62' : '126, 68'})`}>
              {isBlinking ? (
                <path d="M-10,0 Q0,5 10,0" stroke="#38bdf8" strokeWidth="3.5" fill="none" strokeLinecap="round" />
              ) : isSmilingWide ? (
                <path d="M-10,2 Q0,-8 10,2" stroke="#38bdf8" strokeWidth="4" fill="none" strokeLinecap="round" />
              ) : (
                <>
                  <ellipse
                    cx="0"
                    cy="0"
                    rx={isEyesWide ? '10' : isOneBrowRaised ? '10' : '8'}
                    ry={isEyesWide ? '13' : isOneBrowRaised ? '12' : '10'}
                    fill="#38bdf8"
                  />
                  <circle cx="-3" cy="-3" r="3" fill="#ffffff" />
                  <circle cx="3" cy="3" r="1.5" fill="#ffffff" />
                </>
              )}
            </g>

            {/* Confused eyebrow */}
            {isOneBrowRaised && (
              <path d="M116,52 Q126,45 136,50" stroke="#38bdf8" strokeWidth="3" fill="none" strokeLinecap="round" />
            )}
          </g>

          {/* MOUTH */}
          <g transform="translate(100, 87)">
            {isTalking ? (
              // Lip-sync talking mouth
              <ellipse cx="0" cy="0" rx="7" ry="5" fill="#f87171" className="animate-ping" />
            ) : isSmilingWide ? (
              // Wide happy smile
              <path d="M-8,-2 Q0,8 8,-2" stroke="#38bdf8" strokeWidth="3.5" fill="#0284c7" strokeLinecap="round" />
            ) : state === 'gentle_correct' ? (
              // Soft reassuring curve
              <path d="M-6,0 Q0,4 6,0" stroke="#38bdf8" strokeWidth="3" fill="none" strokeLinecap="round" />
            ) : (
              // Default calm gentle smile
              <path d="M-6,-1 Q0,4 6,-1" stroke="#38bdf8" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            )}
          </g>

          {/* Cheeks Blush */}
          <circle cx="67" cy="82" r="5" fill="#f43f5e" opacity="0.45" />
          <circle cx="133" cy="82" r="5" fill="#f43f5e" opacity="0.45" />
        </g>
      </svg>
    </div>
  );
};
