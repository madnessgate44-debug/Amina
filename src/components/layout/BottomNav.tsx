/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { NavigationTab } from '../../types';
import {
  Home,
  BookOpen,
  Target,
  CheckCircle2,
  TrendingUp,
  Bot,
  User,
  Sparkles,
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { t, activeTab, setActiveTab, language } = useApp();
  const isArabic = language === 'ar';

  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'home',
      label: t.nav.home,
      icon: <Home className="w-4 h-4" />,
    },
    {
      id: 'learn',
      label: t.nav.learn,
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      id: 'missions',
      label: t.nav.missions,
      icon: <Target className="w-4 h-4" />,
    },
    {
      id: 'companion',
      label: isArabic ? 'المعلمة نور 👩‍🏫' : 'Teacher Nour 👩‍🏫',
      icon: <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />,
    },
    {
      id: 'review',
      label: t.nav.review,
      icon: <CheckCircle2 className="w-4 h-4" />,
    },
    {
      id: 'progress',
      label: t.nav.progress,
      icon: <TrendingUp className="w-4 h-4" />,
    },
    {
      id: 'profile',
      label: t.nav.profile || 'Profile',
      icon: <User className="w-4 h-4" />,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 py-1 px-2 safe-bottom">
      <div className="max-w-lg mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const isCompanion = item.id === 'companion';

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all relative ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-medium'
              }`}
            >
              <div
                className={`p-1 rounded-lg transition-transform ${
                  isActive ? 'scale-110 bg-indigo-50 dark:bg-indigo-950/60' : ''
                } ${isCompanion && !isActive ? 'text-indigo-500' : ''}`}
              >
                {item.icon}
              </div>
              <span className="text-[10px] tracking-tight leading-none mt-1">
                {item.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 absolute -top-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
