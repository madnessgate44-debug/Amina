/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { NavigationTab } from '../../types';
import { BookOpen, Target, CheckCircle2, TrendingUp, Layers } from 'lucide-react';

interface StubScreenProps {
  type: 'learn' | 'missions' | 'review' | 'progress';
}

export const StubScreen: React.FC<StubScreenProps> = ({ type }) => {
  const { t, language, setActiveTab } = useApp();
  const isArabic = language === 'ar';

  const config = {
    learn: {
      title: t.stubs.learnTitle,
      desc: t.stubs.learnDesc,
      phase: isArabic ? 'المرحلة 2: خريطة المنهج ونموذج الإتقان' : 'Phase 2: Curriculum Map & Mastery',
      icon: <BookOpen className="w-8 h-8 text-sky-600" />,
      color: 'sky',
    },
    missions: {
      title: t.stubs.missionsTitle,
      desc: t.stubs.missionsDesc,
      phase: isArabic ? 'المرحلة 3/4: سجل اليوم المدرسي والمهام' : 'Phase 3/4: Day Record & Missions',
      icon: <Target className="w-8 h-8 text-indigo-600" />,
      color: 'indigo',
    },
    review: {
      title: t.stubs.reviewTitle,
      desc: t.stubs.reviewDesc,
      phase: isArabic ? 'المرحلة 5: المراجعة اليومية والواجبات' : 'Phase 5: Daily Review & Homework',
      icon: <CheckCircle2 className="w-8 h-8 text-emerald-600" />,
      color: 'emerald',
    },
    progress: {
      title: t.stubs.progressTitle,
      desc: t.stubs.progressDesc,
      phase: isArabic ? 'المرحلة 2/6: مستويات الإتقان ونطاقات اليقين' : 'Phase 2/6: Mastery Levels & Confidence Bands',
      icon: <TrendingUp className="w-8 h-8 text-amber-600" />,
      color: 'amber',
    },
  }[type];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto w-full pb-20">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 shadow-xs">
        {config.icon}
      </div>

      <div className="flex items-center gap-2 mb-2">
        <Badge variant="demo">{t.app.demoBadge}</Badge>
        <Badge variant="neutral">{config.phase}</Badge>
      </div>

      <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
        {config.title}
      </h2>

      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed mb-6">
        {config.desc}
      </p>

      <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-[11px] text-indigo-900 dark:text-indigo-200 max-w-sm mb-6">
        <div className="flex items-center justify-center gap-1.5 font-bold mb-1">
          <Layers className="w-3.5 h-3.5" />
          <span>{t.stubs.phaseNotice}</span>
        </div>
        <p className="text-slate-600 dark:text-slate-400 text-[10px]">
          {isArabic
            ? 'نحن نتبع خطة بناء مرحلية صارمة تضمن استقرار كل ركيزة قبل الانتقال للخطوة التالية.'
            : 'We are building in strict sequential phases to guarantee academic reliability and architectural integrity.'}
        </p>
      </div>

      <button
        type="button"
        onClick={() => setActiveTab('home')}
        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold shadow-xs transition-all"
      >
        {isArabic ? 'العودة للرئيسية' : 'Back to Home'}
      </button>
    </div>
  );
};
