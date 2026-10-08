/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { BottomNav } from './BottomNav';
import { ChildTopMenu } from './ChildTopMenu';
import { HomeScreen } from '../home/HomeScreen';
import { TimetableScreen } from '../timetable/TimetableScreen';
import { SettingsScreen } from '../settings/SettingsScreen';
import { CurriculumBrowser } from '../curriculum/CurriculumBrowser';
import { ReviewScreen } from '../review/ReviewScreen';
import { ProgressScreen } from '../progress/ProgressScreen';
import { ProfileScreen } from '../profile/ProfileScreen';
import { OnboardingFlow } from '../onboarding/OnboardingFlow';
import { FeedScreen } from '../feed/FeedScreen';
import { VirtualTeacherClassroom } from '../teacher/VirtualTeacherClassroom';
import { Bot, Sparkles } from 'lucide-react';

export const AppShell: React.FC = () => {
  const {
    student,
    activeTab,
    isLoading,
    toastMessage,
    setLanguage,
    t,
    language,
  } = useApp();

  const isArabic = language === 'ar';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg animate-pulse mb-3">
          <Bot className="w-7 h-7" />
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{t.common.loading}</p>
      </div>
    );
  }

  const showOnboarding = !student || !student.isOnboarded;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col items-center text-slate-900 dark:text-slate-100">
      <div className="w-full max-w-md md:max-w-lg min-h-screen bg-slate-50 dark:bg-slate-900 border-x border-slate-200/80 dark:border-slate-800 shadow-2xl flex flex-col relative">
        {!showOnboarding && (
          <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800 px-3.5 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-linear-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-md">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-black tracking-tight">Miss Nour</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  {student?.name || (isArabic ? 'أمينة' : 'Amina')}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                {(['ar', 'en', 'fr'] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setLanguage(lang)}
                    className={`px-2 py-1 rounded-full text-[9px] font-black ${language === lang ? 'bg-indigo-600 text-white' : 'text-slate-500 dark:text-slate-300'}`}
                  >
                    {lang === 'ar' ? 'ع' : lang.toUpperCase()}
                  </button>
                ))}
              </div>
              <ChildTopMenu />
            </div>
          </header>
        )}

        {toastMessage && !showOnboarding && (
          <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-medium shadow-xl flex items-center gap-2 border border-slate-700">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        <main className="flex-1 min-h-0 flex flex-col overflow-hidden">
          {showOnboarding ? (
            <OnboardingFlow />
          ) : (
            <>
              {activeTab === 'home' && <HomeScreen />}
              {activeTab === 'feed' && <FeedScreen />}
              {activeTab === 'learn' && <CurriculumBrowser />}
              {activeTab === 'companion' && <VirtualTeacherClassroom />}
              {activeTab === 'missions' && <HomeScreen />}
              {activeTab === 'review' && <ReviewScreen />}
              {activeTab === 'progress' && <ProgressScreen />}
              {activeTab === 'timetable' && <TimetableScreen />}
              {activeTab === 'profile' && <ProfileScreen />}
              {activeTab === 'settings' && <SettingsScreen />}
            </>
          )}
        </main>

        {!showOnboarding && <BottomNav />}
      </div>
    </div>
  );
};
