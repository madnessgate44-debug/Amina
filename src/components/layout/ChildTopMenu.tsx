/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { BookOpen, ClipboardCheck, CheckCircle2, Heart, TrendingUp, User, Settings, Menu, X, Target } from 'lucide-react';

export const ChildTopMenu: React.FC = () => {
  const { language, setActiveTab } = useApp();
  const [open, setOpen] = React.useState(false);
  const isAr = language === 'ar';
  const isFr = language === 'fr';

  const items = [
    { id: 'learn' as const, label: isAr ? 'كتبي والمنهج' : isFr ? 'Mes livres & programme' : 'My Books & Curriculum', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'missions' as const, label: isAr ? 'مهامي' : 'Missions', icon: <Target className="w-4 h-4" /> },
    { id: 'homework' as const, label: isAr ? 'الواجب' : 'Homework', icon: <ClipboardCheck className="w-4 h-4" /> },
    { id: 'review' as const, label: isAr ? 'مراجعة' : 'Review', icon: <CheckCircle2 className="w-4 h-4" /> },
    { id: 'collections' as const, label: isAr ? 'المحفوظات والمجموعات' : 'Saved & Collections', icon: <Heart className="w-4 h-4" /> },
    { id: 'progress' as const, label: isAr ? 'تقدمي' : 'Progress', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'profile' as const, label: isAr ? 'ملفي' : 'Profile', icon: <User className="w-4 h-4" /> },
    { id: 'settings' as const, label: isAr ? 'الإعدادات' : 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={isAr ? 'القائمة' : 'Menu'}
        className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
      >
        <Menu className="w-5 h-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <aside
            className="absolute top-0 bottom-0 right-0 w-[84%] max-w-sm bg-white dark:bg-slate-900 shadow-2xl p-5 overflow-y-auto"
            dir={isAr ? 'rtl' : 'ltr'}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-7">
              <div>
                <div className="text-lg font-black text-slate-900 dark:text-white">Amina</div>
                <div className="text-xs text-slate-500">{isAr ? 'عالمك الدراسي' : 'Your learning world'}</div>
              </div>
              <button onClick={() => setOpen(false)} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-2">
              {items.map((item, index) => (
                <button
                  key={item.label + index}
                  onClick={() => { setOpen(false); setActiveTab(item.id); }}
                  className="w-full flex items-center gap-3 p-3.5 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <span className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 flex items-center justify-center">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            <div className="mt-8 p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-xs text-indigo-900 dark:text-indigo-200">
              {isAr ? 'نور موجودة في الرئيسية وفي كل درس. اختاري أي حاجة من هنا وقت ما تحتاجيها.' : 'Nour is available from Home and inside your lessons whenever you need her.'}
            </div>
          </aside>
        </div>
      )}
    </>
  );
};
