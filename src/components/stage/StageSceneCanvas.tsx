/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { NourState, SubjectOutfit } from '../../types/stage';
import { NourCharacter } from './NourCharacter';
import { Sparkles, Waves, Sun, Compass } from 'lucide-react';

interface InteractiveSceneObject {
  id: string;
  labelAr: string;
  labelEn: string;
  xPercent: number; // 0-100
  yPercent: number; // 0-100
  iconType?: string;
  descriptionAr: string;
  descriptionEn: string;
}

interface StageSceneCanvasProps {
  nourState: NourState;
  outfit: SubjectOutfit;
  isNourSpeaking: boolean;
  clipId?: string;
  interactiveObjects?: InteractiveSceneObject[];
  onObjectTap?: (obj: InteractiveSceneObject) => void;
  language?: 'ar' | 'en' | 'fr';
  onNourTap?: () => void;
  ambientTheme?: 'nile' | 'desert' | 'classroom' | 'calligraphy_studio';
}

/**
 * Top 55% Stage Scene Canvas (Sub-Phase 11.2 & 11.5)
 * Combines Tier 1 Live SVG/CSS animated scene layers with Tier 2 hero scene clips.
 */
export const StageSceneCanvas: React.FC<StageSceneCanvasProps> = ({
  nourState,
  outfit,
  isNourSpeaking,
  clipId,
  interactiveObjects = [],
  onObjectTap,
  language = 'ar',
  onNourTap,
  ambientTheme = 'nile',
}) => {
  const isAr = language === 'ar';
  const [activeTappedObj, setActiveTappedObj] = useState<InteractiveSceneObject | null>(null);

  const handleObjectClick = (obj: InteractiveSceneObject) => {
    setActiveTappedObj(obj);
    onObjectTap?.(obj);
    setTimeout(() => {
      setActiveTappedObj(null);
    }, 4500);
  };

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-linear-to-b from-sky-400 via-sky-200 to-amber-100 dark:from-slate-900 dark:via-indigo-950 dark:to-slate-900 flex items-center justify-center">
      {/* LAYER 1: ANIMATED SKY & DISTANT HORIZON */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Glowing Morning Sun */}
        <div className="absolute top-4 right-8 w-16 h-16 rounded-full bg-linear-to-tr from-amber-300 to-yellow-100 opacity-90 blur-xs shadow-2xl animate-pulse duration-3000" />

        {/* Floating Clouds */}
        <div className="absolute top-6 left-12 w-28 h-8 bg-white/70 dark:bg-slate-700/40 rounded-full blur-xs animate-[drift_25s_linear_infinite]" />
        <div className="absolute top-14 right-28 w-36 h-9 bg-white/60 dark:bg-slate-700/30 rounded-full blur-xs animate-[drift_35s_linear_infinite_reverse]" />

        {/* Ancient Egyptian Temple & Pyramids Horizon Silhouette */}
        <svg
          viewBox="0 0 1000 300"
          preserveAspectRatio="none"
          className="absolute bottom-16 w-full h-24 opacity-35 dark:opacity-20 text-amber-700 dark:text-indigo-400"
        >
          {/* Pyramids in distance */}
          <polygon points="120,300 200,160 280,300" fill="currentColor" />
          <polygon points="230,300 300,190 370,300" fill="currentColor" opacity="0.8" />
          {/* Distant palm trees */}
          <path d="M450,300 L450,220 Q440,200 420,205 M450,220 Q460,200 480,205 M450,220 Q450,195 440,190" stroke="currentColor" strokeWidth="4" fill="none" />
          <path d="M780,300 L780,210 Q770,190 750,195 M780,210 Q790,190 810,195 M780,210 Q780,185 770,180" stroke="currentColor" strokeWidth="4" fill="none" />
        </svg>
      </div>

      {/* LAYER 2: THE FLOWING NILE RIVER (Animated SVG water waves + Felucca) */}
      <div className="absolute bottom-0 inset-x-0 h-28 pointer-events-none">
        {/* River Water Gradient Base */}
        <div className="absolute inset-0 bg-linear-to-t from-sky-700 via-sky-600 to-cyan-500 dark:from-slate-950 dark:via-blue-950 dark:to-cyan-900 opacity-90" />

        {/* Animated River Waves */}
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full text-cyan-200/40 dark:text-cyan-400/20 animate-pulse duration-1000"
        >
          <path
            d="M0,40 Q150,10 300,40 T600,40 T900,40 T1200,40 L1200,120 L0,120 Z"
            fill="currentColor"
          />
          <path
            d="M0,60 Q200,30 400,60 T800,60 T1200,60 L1200,120 L0,120 Z"
            fill="currentColor"
            opacity="0.6"
          />
        </svg>

        {/* Sailing Felucca Boat (Egyptian Nile Sailboat) */}
        <div className="absolute bottom-8 left-1/4 -translate-x-1/2 animate-[bounce_4s_ease-in-out_infinite]">
          <svg viewBox="0 0 100 80" className="w-16 h-12 text-slate-800 dark:text-slate-200">
            {/* Wooden Hull */}
            <path d="M10,65 Q50,75 90,65 L80,50 L20,50 Z" fill="#78350f" />
            {/* Mast */}
            <line x1="50" y1="50" x2="50" y2="10" stroke="#451a03" strokeWidth="3" />
            {/* Triangular Sail */}
            <polygon points="50,12 88,48 50,48" fill="#f8fafc" opacity="0.95" />
          </svg>
        </div>

        {/* River Bank Reeds / Papyrus on right side */}
        <div className="absolute bottom-0 right-4 w-20 h-24 pointer-events-none">
          <svg viewBox="0 0 80 100" className="w-full h-full text-emerald-600 dark:text-emerald-500">
            <path d="M10,100 Q15,40 5,10 M25,100 Q30,30 40,5 M40,100 Q45,50 60,20" stroke="currentColor" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <ellipse cx="5" cy="10" rx="4" ry="8" fill="currentColor" />
            <ellipse cx="40" cy="5" rx="4" ry="8" fill="currentColor" />
            <ellipse cx="60" cy="20" rx="4" ry="8" fill="currentColor" />
          </svg>
        </div>
      </div>

      {/* LAYER 3: INTERACTIVE SCENE OBJECTS (child_tap_object) */}
      {interactiveObjects.map((obj) => (
        <button
          key={obj.id}
          type="button"
          onClick={() => handleObjectClick(obj)}
          style={{ left: `${obj.xPercent}%`, top: `${obj.yPercent}%` }}
          className="absolute -translate-x-1/2 -translate-y-1/2 group z-20 focus:outline-none"
          aria-label={isAr ? obj.labelAr : obj.labelEn}
        >
          {/* Animated Glow Ring */}
          <span className="relative flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-8 w-8 sm:h-9 sm:w-9 bg-white dark:bg-slate-800 shadow-lg border-2 border-amber-400 items-center justify-center text-xs font-bold text-slate-800 dark:text-slate-100 hover:scale-110 transition-transform">
              <Sparkles className="w-4 h-4 text-amber-500" />
            </span>
          </span>
          <span className="mt-1 block text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900/80 text-white backdrop-blur-xs shadow-xs">
            {isAr ? obj.labelAr : obj.labelEn}
          </span>
        </button>
      ))}

      {/* Tapped Object Information Popup Bubble */}
      {activeTappedObj && (
        <div
          style={{ left: `${activeTappedObj.xPercent}%`, top: `${Math.max(10, activeTappedObj.yPercent - 22)}%` }}
          className="absolute -translate-x-1/2 z-30 max-w-xs w-64 p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-2xl border-2 border-amber-400 animate-in zoom-in-95 duration-200 text-slate-900 dark:text-slate-100"
          dir={isAr ? 'rtl' : 'ltr'}
        >
          <div className="flex items-center gap-1.5 font-bold text-xs text-amber-600 dark:text-amber-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAr ? activeTappedObj.labelAr : activeTappedObj.labelEn}</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-700 dark:text-slate-300">
            {isAr ? activeTappedObj.descriptionAr : activeTappedObj.descriptionEn}
          </p>
        </div>
      )}

      {/* LAYER 4: NOUR, THE HERO CHARACTER */}
      <div className="relative z-10 flex flex-col items-center mt-6">
        <NourCharacter
          state={nourState}
          outfit={outfit}
          size="md"
          onClick={onNourTap}
        />

        {/* Nour Platform Glow */}
        <div className="w-32 h-4 rounded-full bg-cyan-400/30 blur-sm -mt-2 animate-pulse" />
      </div>

      {/* Hero Clip Badge (Tier 2 verification) */}
      {clipId && (
        <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/60 text-white text-[10px] font-bold backdrop-blur-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{clipId === 'nile_open_01' ? (isAr ? 'المشهد الأول: شريان النيل' : 'Scene 1: River Nile') : clipId}</span>
        </div>
      )}
    </div>
  );
};
