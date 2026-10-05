/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StructuredVisualData } from '../../types/teachingSession';
import { Language } from '../../types';

interface VisualRendererProps {
  visual: StructuredVisualData;
  language?: Language;
  className?: string;
}

/**
 * Pure SVG Visual Renderer supporting all 7 mandatory structured visual types:
 * 1. diagram
 * 2. timeline
 * 3. map_like
 * 4. number_line
 * 5. concept_map
 * 6. stroke_guide
 * 7. comparison_table
 *
 * Rules:
 * - Rendered entirely as inline SVG (zero external image calls).
 * - Mobile-first responsive dimensions (viewBox).
 * - Full Arabic RTL and English LTR alignment.
 * - Color-blind-safe palette (indigo, teal, amber, purple with high contrast).
 */
export const VisualRenderer: React.FC<VisualRendererProps> = ({
  visual,
  language = 'ar',
  className = '',
}) => {
  const isAr = language === 'ar';
  const title = isAr ? visual.titleAr : visual.titleEn;
  const caption = isAr ? visual.captionAr : visual.captionEn;

  const renderContent = () => {
    switch (visual.type) {
      case 'stroke_guide':
        return renderStrokeGuide(visual, isAr);
      case 'map_like':
        return renderMapLike(visual, isAr);
      case 'timeline':
        return renderTimeline(visual, isAr);
      case 'comparison_table':
        return renderComparisonTable(visual, isAr);
      case 'concept_map':
        return renderConceptMap(visual, isAr);
      case 'number_line':
        return renderNumberLine(visual, isAr);
      case 'diagram':
      default:
        return renderDiagram(visual, isAr);
    }
  };

  return (
    <div
      className={`rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 sm:p-4 shadow-sm space-y-2 overflow-hidden ${className}`}
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
            {title}
          </h4>
        </div>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
          {visual.sourceRef.bookAr.split('ص.')[0].trim()}
        </span>
      </div>

      <div className="w-full flex justify-center py-1">
        {renderContent()}
      </div>

      {caption && (
        <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center italic">
          {caption}
        </p>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// 1. Calligraphy Stroke Guide (الخط العربي: ألف النسخ والرقعة)
// -------------------------------------------------------------
function renderStrokeGuide(visual: StructuredVisualData, isAr: boolean) {
  return (
    <svg
      viewBox="0 0 360 220"
      className="w-full max-w-sm h-auto select-none"
      aria-label={visual.titleAr}
    >
      {/* Background paper lines */}
      <rect width="360" height="220" rx="12" fill="#fafafa" className="dark:fill-slate-800" />
      <line x1="20" y1="40" x2="340" y2="40" stroke="#e2e8f0" strokeDasharray="3 3" />
      <line x1="20" y1="180" x2="340" y2="180" stroke="#3b82f6" strokeWidth="2" /> {/* Baseline */}

      {/* Baseline label */}
      <text x={isAr ? 330 : 30} y="195" textAnchor={isAr ? 'end' : 'start'} fill="#64748b" fontSize="10" fontWeight="bold">
        {isAr ? 'سطر الأساس (خط الارتكاز)' : 'Baseline'}
      </text>

      {/* --- Column 1: Naskh Alif (خمس نقاط + حلية) --- */}
      <g transform="translate(70, 0)">
        {/* Naskh title */}
        <text x="50" y="28" textAnchor="middle" fill="#1e293b" className="dark:fill-slate-100" fontSize="12" fontWeight="bold">
          {isAr ? 'ألف خط النسخ (٥ نقاط)' : 'Naskh Alif (5 Dots)'}
        </text>

        {/* 5 Dots measurement scale */}
        {[0, 1, 2, 3, 4].map((i) => (
          <rect
            key={i}
            x="20"
            y={48 + i * 26}
            width="12"
            height="12"
            transform={`rotate(45, ${20 + 6}, ${48 + i * 26 + 6})`}
            fill="#0ea5e9"
            opacity="0.8"
          />
        ))}

        {/* Zulfa / Crown detail */}
        <path
          d="M 50 48 C 42 45, 40 40, 44 38 C 48 40, 52 44, 52 48 Z"
          fill="#4338ca"
        />
        <text x="80" y="44" fill="#4338ca" fontSize="9" fontWeight="bold">
          {isAr ? 'الحلية (الزلفة)' : 'Ornamental Crown'}
        </text>
        <line x1="75" y1="44" x2="55" y2="44" stroke="#4338ca" strokeWidth="1" strokeDasharray="2 2" />

        {/* Main Naskh vertical body */}
        <path
          d="M 50 48 L 49 180 L 53 180 L 52 48 Z"
          fill="#1e1b4b"
          className="dark:fill-indigo-300"
        />

        {/* Step indicator arrow */}
        <path d="M 62 60 L 62 160" stroke="#059669" strokeWidth="1.5" strokeDasharray="3 3" />
        <polygon points="62,165 59,157 65,157" fill="#059669" />
        <text x="70" y="115" fill="#059669" fontSize="9" fontWeight="bold">
          {isAr ? 'نزول انسيابي' : 'Downward Stroke'}
        </text>
      </g>

      {/* --- Column 2: Ruq'ah Alif (ثلاث نقاط مستقيمة) --- */}
      <g transform="translate(220, 0)">
        <text x="50" y="28" textAnchor="middle" fill="#1e293b" className="dark:fill-slate-100" fontSize="12" fontWeight="bold">
          {isAr ? 'ألف خط الرقعة (٣ نقاط)' : 'Ruq’ah Alif (3 Dots)'}
        </text>

        {/* 3 Dots measurement scale */}
        {[0, 1, 2].map((i) => (
          <rect
            key={i}
            x="22"
            y={102 + i * 26}
            width="12"
            height="12"
            transform={`rotate(45, ${22 + 6}, ${102 + i * 26 + 6})`}
            fill="#f59e0b"
            opacity="0.8"
          />
        ))}

        {/* Ruq'ah straight short body (starts at ~102, ends at 180) */}
        <path
          d="M 48 102 L 50 180 L 54 180 L 52 102 Z"
          fill="#1e1b4b"
          className="dark:fill-amber-300"
        />

        {/* No Zulfa label */}
        <text x="50" y="92" textAnchor="middle" fill="#b45309" fontSize="9" fontWeight="bold">
          {isAr ? 'بدون حلية (مستقيم جاف)' : 'No crown (Clean stroke)'}
        </text>

        {/* Height comparison bracket */}
        <line x1="72" y1="102" x2="72" y2="180" stroke="#b45309" strokeWidth="1.5" strokeDasharray="3 3" />
        <polygon points="72,185 69,177 75,177" fill="#b45309" />
        <text x="78" y="145" fill="#b45309" fontSize="9" fontWeight="bold">
          {isAr ? 'أقصر بوضوح' : 'Shorter stem'}
        </text>
      </g>
    </svg>
  );
}

// -------------------------------------------------------------
// 2. Map-like Visual (الدراسات الاجتماعية: تضاريس مصر)
// -------------------------------------------------------------
function renderMapLike(visual: StructuredVisualData, isAr: boolean) {
  return (
    <svg viewBox="0 0 360 230" className="w-full max-w-sm h-auto select-none" aria-label={visual.titleAr}>
      <rect width="360" height="230" rx="12" fill="#f8fafc" className="dark:fill-slate-800" />

      {/* Mediterranean Sea in North */}
      <rect x="15" y="15" width="330" height="28" rx="6" fill="#0284c7" fillOpacity="0.15" />
      <text x="180" y="32" textAnchor="middle" fill="#0369a1" fontSize="10" fontWeight="bold">
        {isAr ? 'البحر المتوسط (شمالاً)' : 'Mediterranean Sea (North)'}
      </text>

      {/* Red Sea in East */}
      <path d="M 310 50 Q 325 120 290 200" stroke="#0284c7" strokeWidth="14" strokeLinecap="round" fill="none" opacity="0.25" />
      <text x="315" y="130" textAnchor="middle" fill="#0369a1" fontSize="9" fontWeight="bold" transform="rotate(75, 315, 130)">
        {isAr ? 'البحر الأحمر' : 'Red Sea'}
      </text>

      {/* 1. Nile Valley & Delta (Green Ribbon) */}
      {/* Delta Triangle */}
      <polygon points="175,45 155,75 195,75" fill="#10b981" fillOpacity="0.75" />
      {/* Valley winding down */}
      <path d="M 175 75 Q 165 110 178 150 Q 185 180 180 215" stroke="#10b981" strokeWidth="8" strokeLinecap="round" fill="none" />
      {/* Fayoum Oasis circle */}
      <circle cx="152" cy="95" r="7" fill="#059669" />

      {/* Nile Label */}
      <text x="175" y="65" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
        {isAr ? 'الدلتا' : 'Delta'}
      </text>
      <text x="135" y="98" textAnchor="end" fill="#065f46" fontSize="8" fontWeight="bold">
        {isAr ? 'الفيوم (ترعة بحر يوسف)' : 'Fayoum'}
      </text>

      {/* 2. Western Desert (68%) */}
      <rect x="25" y="55" width="115" height="150" rx="8" fill="#fef3c7" className="dark:fill-amber-950/40" stroke="#f59e0b" strokeDasharray="3 3" />
      <text x="82" y="80" textAnchor="middle" fill="#92400e" className="dark:fill-amber-200" fontSize="11" fontWeight="bold">
        {isAr ? 'الصحراء الغربية' : 'Western Desert'}
      </text>
      <text x="82" y="95" textAnchor="middle" fill="#b45309" fontSize="9">
        {isAr ? '(٦٨٪ من المساحة)' : '(68% of Egypt)'}
      </text>
      <text x="82" y="125" textAnchor="middle" fill="#78350f" fontSize="8">
        {isAr ? '• واحات وسيوة والمياه الجوفية' : '• Oases & Groundwater'}
      </text>
      <text x="82" y="145" textAnchor="middle" fill="#78350f" fontSize="8">
        {isAr ? '• بحر الرمال العظيم' : '• Great Sand Sea'}
      </text>
      <text x="82" y="165" textAnchor="middle" fill="#78350f" fontSize="8">
        {isAr ? '• هضبة الجلف الكبير' : '• Gilf Kebir Plateau'}
      </text>

      {/* 3. Eastern Desert (22%) */}
      <rect x="200" y="80" width="85" height="120" rx="8" fill="#fee2e2" className="dark:fill-rose-950/40" stroke="#f43f5e" strokeDasharray="3 3" />
      <text x="242" y="100" textAnchor="middle" fill="#9f1239" className="dark:fill-rose-200" fontSize="10" fontWeight="bold">
        {isAr ? 'الصحراء الشرقية' : 'Eastern Desert'}
      </text>
      <text x="242" y="115" textAnchor="middle" fill="#be123c" fontSize="8">
        {isAr ? '(٢٢٪ جبال وأودية)' : '(22% Rugged)'}
      </text>
      <text x="242" y="138" textAnchor="middle" fill="#881337" fontSize="8">
        {isAr ? '• جبال البحر الأحمر' : '• Red Sea Mts'}
      </text>
      <text x="242" y="155" textAnchor="middle" fill="#881337" fontSize="8">
        {isAr ? '• وادي العلاقي الجاف' : '• Wadi Allaqi'}
      </text>

      {/* 4. Sinai Peninsula (6%) */}
      <polygon points="255,45 285,45 270,75" fill="#ede9fe" className="dark:fill-purple-950/40" stroke="#8b5cf6" />
      <text x="270" y="55" textAnchor="middle" fill="#6d28d9" className="dark:fill-purple-300" fontSize="8" fontWeight="bold">
        {isAr ? 'سيناء (٦٪)' : 'Sinai (6%)'}
      </text>
      <circle cx="270" cy="65" r="3" fill="#e11d48" />
      <text x="270" y="74" textAnchor="middle" fill="#9f1239" fontSize="7" fontWeight="bold">
        {isAr ? 'سانت كاترين' : 'St. Catherine'}
      </text>
    </svg>
  );
}

// -------------------------------------------------------------
// 3. Timeline Visual (التربية الدينية: غزوة بدر وعيد النصر)
// -------------------------------------------------------------
function renderTimeline(visual: StructuredVisualData, isAr: boolean) {
  const events = [
    { year: isAr ? 'السنة ٢ هـ' : '2 AH', titleAr: 'غزوة بدر الكبرى', titleEn: 'Battle of Badr', descAr: '١٧ رمضان: نصر الله المؤزر وتأييد الحق', descEn: 'Decisive victory for truth' },
    { year: isAr ? 'شوال ٢ هـ' : 'Shawwal 2 AH', titleAr: 'عيد النصر بالمدينة', titleEn: 'Victory Celebration', descAr: 'عودة الجيش وفرحة المسلمين بالعدل والرحمة', descEn: 'Army returns; joy of justice' },
    { year: isAr ? 'المدينة' : 'Medina', titleAr: 'عفة عبد الرحمن', titleEn: 'Honest Labor', descAr: '«دلوني على السوق» والكسب الحلال بعرق الجبين', descEn: '"Show me to market" self-reliance' },
    { year: isAr ? 'التكافل' : 'Solidarity', titleAr: 'الإنفاق في الخير', titleEn: 'Generous Giving', descAr: 'مساعدة الأيتام والفقراء وتجهيز الجيوش', descEn: 'Philanthropy and orphan support' },
  ];

  return (
    <svg viewBox="0 0 360 210" className="w-full max-w-sm h-auto select-none" aria-label={visual.titleAr}>
      <rect width="360" height="210" rx="12" fill="#faf5ff" className="dark:fill-slate-800" />

      {/* Horizontal connector line */}
      <line x1="30" y1="70" x2="330" y2="70" stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round" />

      {events.map((ev, i) => {
        const x = isAr ? 315 - i * 90 : 45 + i * 90;
        return (
          <g key={i}>
            {/* Circle Node */}
            <circle cx={x} cy="70" r="10" fill="#7c3aed" stroke="#ffffff" strokeWidth="2" />
            <text x={x} y="74" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
              {i + 1}
            </text>

            {/* Top Date Tag */}
            <rect x={x - 30} y="32" width="60" height="18" rx="4" fill="#ede9fe" className="dark:fill-purple-950" stroke="#c4b5fd" />
            <text x={x} y="44" textAnchor="middle" fill="#6d28d9" className="dark:fill-purple-300" fontSize="8" fontWeight="bold">
              {ev.year}
            </text>

            {/* Bottom Card */}
            <rect x={x - 40} y="95" width="80" height="95" rx="8" fill="#ffffff" stroke="#e2e8f0" className="dark:fill-slate-900 dark:stroke-slate-700" />
            <text x={x} y="112" textAnchor="middle" fill="#1e1b4b" className="dark:fill-slate-100" fontSize="9" fontWeight="bold">
              {isAr ? ev.titleAr : ev.titleEn}
            </text>
            <foreignObject x={x - 38} y="118" width="76" height="68">
              <div className="text-[7.5px] leading-tight text-slate-500 dark:text-slate-400 text-center p-0.5">
                {isAr ? ev.descAr : ev.descEn}
              </div>
            </foreignObject>
          </g>
        );
      })}
    </svg>
  );
}

// -------------------------------------------------------------
// 4. Diagram Visual (English: The Apple Tree botanical parts)
// -------------------------------------------------------------
function renderDiagram(visual: StructuredVisualData, isAr: boolean) {
  return (
    <svg viewBox="0 0 360 230" className="w-full max-w-sm h-auto select-none" aria-label={visual.titleAr}>
      <rect width="360" height="230" rx="12" fill="#f0fdf4" className="dark:fill-slate-800" />

      {/* Ground line */}
      <line x1="20" y1="190" x2="340" y2="190" stroke="#84cc16" strokeWidth="4" strokeLinecap="round" />

      {/* Roots under ground */}
      <path d="M 180 190 Q 160 215 130 220 M 180 190 Q 185 215 180 225 M 180 190 Q 200 215 230 220" stroke="#78350f" strokeWidth="3" fill="none" />
      <text x="180" y="215" textAnchor="middle" fill="#92400e" fontSize="8" fontWeight="bold">
        {isAr ? 'الجذور (Roots)' : 'Roots'}
      </text>

      {/* Trunk (Main wooden stem) */}
      <path d="M 165 190 L 168 110 L 192 110 L 195 190 Z" fill="#854d0e" />
      <text x="180" y="150" textAnchor="middle" fill="#fef08a" fontSize="9" fontWeight="bold">
        {isAr ? 'الجذع (Trunk)' : 'Trunk'}
      </text>

      {/* Branches & Foliage Canopy */}
      <circle cx="180" cy="85" r="50" fill="#22c55e" fillOpacity="0.85" />
      <circle cx="145" cy="85" r="35" fill="#16a34a" fillOpacity="0.85" />
      <circle cx="215" cy="85" r="35" fill="#16a34a" fillOpacity="0.85" />
      <circle cx="180" cy="55" r="35" fill="#15803d" fillOpacity="0.9" />

      {/* Apples on tree */}
      <circle cx="160" cy="65" r="6" fill="#ef4444" />
      <circle cx="195" cy="70" r="6" fill="#ef4444" />
      <circle cx="140" cy="95" r="6" fill="#ef4444" />
      <circle cx="215" cy="90" r="6" fill="#ef4444" />
      <circle cx="180" cy="100" r="6" fill="#ef4444" />

      {/* Labels with pointer arrows */}
      {/* Branches Label */}
      <line x1="225" y1="65" x2="270" y2="50" stroke="#15803d" strokeWidth="1.5" />
      <rect x="270" y="40" width="75" height="20" rx="4" fill="#ffffff" className="dark:fill-slate-900" stroke="#86efac" />
      <text x="307" y="54" textAnchor="middle" fill="#166534" className="dark:fill-emerald-300" fontSize="8" fontWeight="bold">
        {isAr ? 'الأغصان (Branches)' : 'Branches & Shade'}
      </text>

      {/* Stump Label (Beside ground) */}
      <rect x="20" y="150" width="70" height="35" rx="4" fill="#ffffff" className="dark:fill-slate-900" stroke="#cbd5e1" />
      <text x="55" y="165" textAnchor="middle" fill="#475569" className="dark:fill-slate-300" fontSize="8" fontWeight="bold">
        {isAr ? 'الجذمور (Stump)' : 'Stump'}
      </text>
      <text x="55" y="177" textAnchor="middle" fill="#64748b" fontSize="7">
        {isAr ? 'مكان الراحة الأخير' : 'Quiet rest place'}
      </text>
    </svg>
  );
}

// -------------------------------------------------------------
// 5. Comparison Table (الصحراء الغربية vs الشرقية / مفاهيم)
// -------------------------------------------------------------
function renderComparisonTable(visual: StructuredVisualData, isAr: boolean) {
  return (
    <svg viewBox="0 0 360 210" className="w-full max-w-sm h-auto select-none" aria-label={visual.titleAr}>
      <rect width="360" height="210" rx="12" fill="#f8fafc" className="dark:fill-slate-800" />

      {/* Header Row */}
      <rect x="15" y="15" width="160" height="32" rx="6" fill="#0284c7" />
      <text x="95" y="35" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">
        {isAr ? 'الصحراء الغربية (٦٨٪)' : 'Western Desert (68%)'}
      </text>

      <rect x="185" y="15" width="160" height="32" rx="6" fill="#e11d48" />
      <text x="265" y="35" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">
        {isAr ? 'الصحراء الشرقية (٢٢٪)' : 'Eastern Desert (22%)'}
      </text>

      {/* Row 1: Topography */}
      <rect x="15" y="55" width="160" height="42" rx="6" fill="#ffffff" className="dark:fill-slate-900" stroke="#e2e8f0" />
      <text x="95" y="72" textAnchor="middle" fill="#0369a1" fontSize="9" fontWeight="bold">
        {isAr ? 'هضاب ومنخفضات منبسطة' : 'Plateaus & Low Depressions'}
      </text>
      <text x="95" y="87" textAnchor="middle" fill="#64748b" fontSize="8">
        {isAr ? 'الجلف الكبير وبحر الرمال' : 'Gilf Kebir & Great Sand Sea'}
      </text>

      <rect x="185" y="55" width="160" height="42" rx="6" fill="#ffffff" className="dark:fill-slate-900" stroke="#e2e8f0" />
      <text x="265" y="72" textAnchor="middle" fill="#be123c" fontSize="9" fontWeight="bold">
        {isAr ? 'سلاسل جبال شاهقة ووعرة' : 'Rugged Mountain Chains'}
      </text>
      <text x="265" y="87" textAnchor="middle" fill="#64748b" fontSize="8">
        {isAr ? 'جبال البحر الأحمر وشايب البنات' : 'Red Sea Mountains'}
      </text>

      {/* Row 2: Water & Life */}
      <rect x="15" y="105" width="160" height="42" rx="6" fill="#ffffff" className="dark:fill-slate-900" stroke="#e2e8f0" />
      <text x="95" y="122" textAnchor="middle" fill="#0369a1" fontSize="9" fontWeight="bold">
        {isAr ? 'واحات مأهولة بالمياه الجوفية' : 'Inhabited Oases (Aquifers)'}
      </text>
      <text x="95" y="137" textAnchor="middle" fill="#64748b" fontSize="8">
        {isAr ? 'سيوة، الفرافرة، البحرية، الداخلة' : 'Siwa, Farafra, Dakhla wells'}
      </text>

      <rect x="185" y="105" width="160" height="42" rx="6" fill="#ffffff" className="dark:fill-slate-900" stroke="#e2e8f0" />
      <text x="265" y="122" textAnchor="middle" fill="#be123c" fontSize="9" fontWeight="bold">
        {isAr ? 'أودية جافة ومجاري سيول' : 'Dry Wadis for Flood Runoff'}
      </text>
      <text x="265" y="137" textAnchor="middle" fill="#64748b" fontSize="8">
        {isAr ? 'وادي العلاقي لحصاد الأمطار' : 'Wadi Allaqi rain harvest'}
      </text>

      {/* Row 3: Economic features */}
      <rect x="15" y="155" width="160" height="42" rx="6" fill="#ffffff" className="dark:fill-slate-900" stroke="#e2e8f0" />
      <text x="95" y="172" textAnchor="middle" fill="#0369a1" fontSize="9" fontWeight="bold">
        {isAr ? 'زراعة الواحات والتمور والحديد' : 'Oasis Dates & Iron Ore'}
      </text>
      <text x="95" y="187" textAnchor="middle" fill="#64748b" fontSize="8">
        {isAr ? 'بترول وغاز طبيعي شمالاً' : 'Petroleum in North'}
      </text>

      <rect x="185" y="155" width="160" height="42" rx="6" fill="#ffffff" className="dark:fill-slate-900" stroke="#e2e8f0" />
      <text x="265" y="172" textAnchor="middle" fill="#be123c" fontSize="9" fontWeight="bold">
        {isAr ? 'معادن ثمينة والذهب والغرانيت' : 'Precious Metals, Gold & Granite'}
      </text>
      <text x="265" y="187" textAnchor="middle" fill="#64748b" fontSize="8">
        {isAr ? 'مناجم السكري وسياحة الشواطئ' : 'Sukari gold mines'}
      </text>
    </svg>
  );
}

// -------------------------------------------------------------
// 6. Concept Map (أفكار مترابطة: نهر النيل وترشيد الماء)
// -------------------------------------------------------------
function renderConceptMap(visual: StructuredVisualData, isAr: boolean) {
  return (
    <svg viewBox="0 0 360 210" className="w-full max-w-sm h-auto select-none" aria-label={visual.titleAr}>
      <rect width="360" height="210" rx="12" fill="#eff6ff" className="dark:fill-slate-800" />

      {/* Center Main Bubble */}
      <circle cx="180" cy="105" r="42" fill="#3b82f6" />
      <text x="180" y="102" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
        {isAr ? 'نهر النيل' : 'The River Nile'}
      </text>
      <text x="180" y="115" textAnchor="middle" fill="#dbeafe" fontSize="8">
        {isAr ? 'شريان الحياة' : 'Lifeline of Egypt'}
      </text>

      {/* Branch 1: Ancient History (Top Right) */}
      <line x1="150" y1="80" x2="80" y2="45" stroke="#93c5fd" strokeWidth="2" />
      <circle cx="70" cy="45" r="28" fill="#ffffff" className="dark:fill-slate-900" stroke="#60a5fa" strokeWidth="2" />
      <text x="70" y="42" textAnchor="middle" fill="#1e3a8a" className="dark:fill-blue-200" fontSize="8" fontWeight="bold">
        {isAr ? 'قسم الأجداد' : 'Ancient Oath'}
      </text>
      <text x="70" y="53" textAnchor="middle" fill="#64748b" fontSize="7">
        {isAr ? '«لم أوت ماء النهر»' : '"Never polluted"'}
      </text>

      {/* Branch 2: Modern Conservation (Top Left) */}
      <line x1="210" y1="80" x2="280" y2="45" stroke="#93c5fd" strokeWidth="2" />
      <circle cx="290" cy="45" r="28" fill="#ffffff" className="dark:fill-slate-900" stroke="#10b981" strokeWidth="2" />
      <text x="290" y="42" textAnchor="middle" fill="#065f46" className="dark:fill-emerald-200" fontSize="8" fontWeight="bold">
        {isAr ? 'الترشيد اليوم' : 'Conservation'}
      </text>
      <text x="290" y="53" textAnchor="middle" fill="#64748b" fontSize="7">
        {isAr ? 'حفظ كل قطرة' : 'Save every drop'}
      </text>

      {/* Branch 3: Agriculture & Food (Bottom Right) */}
      <line x1="150" y1="130" x2="80" y2="165" stroke="#93c5fd" strokeWidth="2" />
      <circle cx="70" cy="165" r="28" fill="#ffffff" className="dark:fill-slate-900" stroke="#f59e0b" strokeWidth="2" />
      <text x="70" y="162" textAnchor="middle" fill="#78350f" className="dark:fill-amber-200" fontSize="8" fontWeight="bold">
        {isAr ? 'خصوبة الأرض' : 'Fertile Land'}
      </text>
      <text x="70" y="173" textAnchor="middle" fill="#64748b" fontSize="7">
        {isAr ? 'طمي النيل والدلتا' : 'Rich Delta Silt'}
      </text>

      {/* Branch 4: Cleanliness & Health (Bottom Left) */}
      <line x1="210" y1="130" x2="280" y2="165" stroke="#93c5fd" strokeWidth="2" />
      <circle cx="290" cy="165" r="28" fill="#ffffff" className="dark:fill-slate-900" stroke="#8b5cf6" strokeWidth="2" />
      <text x="290" y="162" textAnchor="middle" fill="#5b21b6" className="dark:fill-purple-200" fontSize="8" fontWeight="bold">
        {isAr ? 'صحة المجتمع' : 'Public Health'}
      </text>
      <text x="290" y="173" textAnchor="middle" fill="#64748b" fontSize="7">
        {isAr ? 'منع التلوث' : 'Clean & pure water'}
      </text>
    </svg>
  );
}

// -------------------------------------------------------------
// 7. Number Line Visual
// -------------------------------------------------------------
function renderNumberLine(visual: StructuredVisualData, isAr: boolean) {
  return (
    <svg viewBox="0 0 360 120" className="w-full max-w-sm h-auto select-none" aria-label={visual.titleAr}>
      <rect width="360" height="120" rx="12" fill="#fafafa" className="dark:fill-slate-800" />
      <line x1="30" y1="60" x2="330" y2="60" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
      {/* Ticks */}
      {[0, 1, 2, 3, 4, 5].map((val) => {
        const x = isAr ? 310 - val * 56 : 50 + val * 56;
        return (
          <g key={val}>
            <line x1={x} y1="50" x2={x} y2="70" stroke="#1e293b" className="dark:stroke-slate-200" strokeWidth="2" />
            <text x={x} y="88" textAnchor="middle" fill="#1e293b" className="dark:fill-slate-200" fontSize="11" fontWeight="bold">
              {val}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
