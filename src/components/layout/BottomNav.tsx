/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { NavigationTab } from '../../types';
import { Home, Sparkles, BookOpen, Play } from 'lucide-react';

interface BottomNavProps {
  /**
   * On the feed the nav floats over the reel as a translucent overlay instead
   * of sitting in the layout, so the reel can own the full viewport.
   */
  overlay?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({ overlay = false }) => {
  const { activeTab, setActiveTab, language } = useApp();
  const isArabic = language === 'ar';
  const isFrench = language === 'fr';

  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: isArabic ? 'الرئيسية' : isFrench ? 'Accueil' : 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'feed', label: isArabic ? 'الموجز' : isFrench ? 'Fil' : 'Feed', icon: <Play className="w-5 h-5" /> },
    { id: 'learn', label: isArabic ? 'المكتبة' : isFrench ? 'Bibliothèque' : 'Library', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'companion', label: isArabic ? 'نور' : isFrench ? 'Noor' : 'Noor', icon: <Sparkles className="w-5 h-5" /> },
  ];

  return (
    <nav className={`${overlay ? 'fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md md:max-w-lg bg-slate-950/70 text-white/90 backdrop-blur-xl border-t border-white/10' : 'sticky bottom-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800'} z-40 py-1.5 px-3 safe-bottom`}>
      <div className="max-w-lg mx-auto grid grid-cols-4 gap-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-2 rounded-2xl transition-all cursor-pointer ${
                isActive
                  ? overlay
                    ? 'text-white bg-white/20'
                    : 'text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60'
                  : overlay
                  ? 'text-slate-300'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {item.icon}
              <span className="text-xs font-black tracking-tight mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
