/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * ReelMedia — renders one educational media item by its type.
 *
 * This is the single presentation component the whole feed uses, so a lesson
 * never needs a bespoke renderer. It handles images (with a real fallback),
 * video, audio narration, and interactive diagrams (a legend + tappable
 * hotspots). Loading, error and reduced-motion states are handled here, once.
 *
 * Accessibility: images carry meaningful alt text, hotspots are real buttons
 * with a 44px tap target and a keyboard focus ring, and nothing signals meaning
 * by colour alone (numbers and the legend carry it).
 */

import React, { useState } from 'react';
import { EducationalMediaItem, localized } from '../../types/media';
import { Language } from '../../types';
import { Play, Pause, Volume2, Loader2, AlertTriangle } from 'lucide-react';

interface ReelMediaProps {
  item: EducationalMediaItem;
  language: Language;
  isAr: boolean;
  reducedMotion: boolean;
  className?: string;
}

const BASE = (import.meta.env?.BASE_URL as string) || '/';
const assetUrl = (p: string) => `${BASE.replace(/\/$/, '')}/${p.replace(/^\//, '')}`;

export const ReelMedia: React.FC<ReelMediaProps> = ({ item, language, isAr, reducedMotion, className = '' }) => {
  const [src, setSrc] = useState(assetUrl(item.src));
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);

  const title = localized(item.title, language);
  const alt = localized(item.alt, language);
  const purpose = localized(item.purpose, language);
  const narrationText = item.narration ? localized(item.narration.text, language) : '';

  const onError = () => {
    // Prefer the vector source; if that also fails, show an honest fallback
    // instead of an empty box.
    if (item.fallbackSrc && src !== assetUrl(item.fallbackSrc)) {
      setSrc(assetUrl(item.fallbackSrc));
      return;
    }
    setStatus('error');
  };

  const figCaption = (
    <figcaption className="px-3 py-2 border-t border-white/10">
      <div className="flex items-center justify-between gap-2 text-[12px] text-slate-300">
        <span className="font-black text-cyan-300 uppercase tracking-widest">{title}</span>
        <span className="truncate text-slate-400">{item.curriculumRef}</span>
      </div>
      <p className="mt-1 text-[12px] text-slate-400 leading-snug">{purpose}</p>
    </figcaption>
  );

  // ── Video (animation / demonstration) ────────────────────────────────────
  if (item.type === 'video') {
    if (reducedMotion && item.playback?.reducedMotionFallback === 'poster' && item.playback.poster) {
      return (
        <figure className={`mt-4 rounded-2xl border border-white/15 bg-white/5 overflow-hidden ${className}`} dir={isAr ? 'rtl' : 'ltr'}>
          <img src={assetUrl(item.playback.poster)} alt={alt} className="w-full block" />
          {figCaption}
        </figure>
      );
    }
    return (
      <figure className={`mt-4 rounded-2xl border border-white/15 bg-white/5 overflow-hidden ${className}`} dir={isAr ? 'rtl' : 'ltr'}>
        {status === 'error' ? (
          <MediaFallback alt={alt} isAr={isAr} />
        ) : (
          <video
            src={src}
            poster={item.playback?.poster ? assetUrl(item.playback.poster) : undefined}
            className="w-full block bg-black"
            controls={item.playback?.controls ?? true}
            muted={item.playback?.muted ?? true}
            loop={item.playback?.loop}
            autoPlay={item.playback?.autoplay && !reducedMotion}
            playsInline
            preload="metadata"
            aria-label={alt}
            onLoadedData={() => setStatus('ready')}
            onError={onError}
          />
        )}
        {figCaption}
      </figure>
    );
  }

  // ── Audio (narration) ────────────────────────────────────────────────────
  if (item.type === 'audio') {
    return (
      <figure className={`mt-4 rounded-2xl border border-white/15 bg-white/5 overflow-hidden p-3 ${className}`} dir={isAr ? 'rtl' : 'ltr'}>
        <div className="flex items-center gap-2 text-[12px] font-black uppercase tracking-widest text-cyan-300 mb-2">
          <Volume2 className="w-3.5 h-3.5" />
          <span>{title}</span>
        </div>
        <audio src={src} controls className="w-full h-9" aria-label={alt} onError={onError} />
        <p className="mt-2 text-[12px] text-slate-400">{purpose}</p>
      </figure>
    );
  }

  // ── Image (diagram / illustration / chart / map / number line) ───────────
  const isInteractive = Boolean(item.hotspots && item.hotspots.length && item.legend && item.legend.length);
  return (
    <figure className={`mt-4 rounded-2xl border border-white/15 bg-white/5 overflow-hidden ${className}`} dir={isAr ? 'rtl' : 'ltr'}>
      <div className="relative">
        {status === 'error' ? (
          <MediaFallback alt={alt} isAr={isAr} />
        ) : (
          <>
            {status === 'loading' && (
              <div className="absolute inset-0 grid place-items-center text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            )}
            <img
              src={src}
              alt={alt}
              width={item.width}
              height={item.height}
              loading="lazy"
              decoding="async"
              className="w-full block"
              onLoad={() => setStatus('ready')}
              onError={onError}
            />
            {isInteractive &&
              item.hotspots!.map((h) => (
                <button
                  key={h.n}
                  type="button"
                  onClick={() => setActiveHotspot((cur) => (cur === h.n ? null : h.n))}
                  aria-label={`${h.n}: ${localized(item.legend!.find((l) => l.n === h.n)!.text, language)}`}
                  aria-pressed={activeHotspot === h.n}
                  className="absolute w-11 h-11 -translate-x-1/2 -translate-y-1/2 rounded-full grid place-items-center font-black text-[13px] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                  style={{
                    left: `${h.x * 100}%`,
                    top: `${h.y * 100}%`,
                    background: activeHotspot === h.n ? 'rgba(97,91,255,0.95)' : 'rgba(15,23,42,0.55)',
                    color: '#fff',
                    border: '2px solid rgba(255,255,255,0.85)',
                  }}
                >
                  {h.n}
                </button>
              ))}
          </>
        )}
      </div>

      {isInteractive && (
        <div className="px-3 py-2 border-t border-white/10">
          <div className="text-[11px] font-black uppercase tracking-widest text-cyan-300 mb-1">
            {isAr ? 'اضغطي الأرقام لتتعلمي' : language === 'fr' ? 'Touche les numéros' : 'Tap the numbers'}
          </div>
          <ul className="grid grid-cols-1 gap-1">
            {item.legend!.map((l) => (
              <li
                key={l.n}
                className={`text-[12px] leading-snug rounded-lg px-2 py-1 ${
                  activeHotspot === l.n ? 'bg-cyan-300/20 text-white font-bold' : 'text-slate-300'
                }`}
              >
                <span className="font-black text-cyan-300 me-1">{l.n}</span>
                {localized(l.text, language)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {item.narration && (
        <NarrationBar text={narrationText} src={assetUrl(item.narration.src!)} isAr={isAr} alt={alt} />
      )}
      {figCaption}
    </figure>
  );
};

const NarrationBar: React.FC<{ text: string; src: string; isAr: boolean; alt: string }> = ({ text, src, isAr, alt }) => {
  const [playing, setPlaying] = useState(false);
  const ref = React.useRef<HTMLAudioElement | null>(null);
  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    if (playing) {
      el.pause();
    } else {
      void el.play();
    }
  };
  return (
    <div className="px-3 py-2 border-t border-white/10 flex items-center gap-2">
      <button
        type="button"
        onClick={toggle}
        className="min-w-11 min-h-11 rounded-full grid place-items-center bg-cyan-500/20 text-cyan-200 border border-cyan-300/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
        aria-label={isAr ? 'استمعي للشرح' : 'Listen to the explanation'}
        aria-pressed={playing}
      >
        {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
      </button>
      <span className="text-[12px] text-slate-400 leading-snug line-clamp-2">{text}</span>
      <audio
        ref={ref}
        src={src}
        aria-label={alt}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />
    </div>
  );
};

const MediaFallback: React.FC<{ alt: string; isAr: boolean }> = ({ alt, isAr }) => (
  <div className="p-4 flex items-start gap-2 text-amber-200 bg-amber-500/10" role="note">
    <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
    <div className="text-[12px] leading-snug">
      <div className="font-black">{isAr ? 'الصورة مش متاحة دلوقتي' : 'Media unavailable'}</div>
      <div className="text-amber-100/80">{alt}</div>
    </div>
  </div>
);
