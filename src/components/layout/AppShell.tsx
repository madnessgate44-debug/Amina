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
import { MissionsScreen } from '../missions/MissionsScreen';
import { CollectionsScreen } from '../collections/CollectionsScreen';
import { MyBooksScreen } from '../myBooks/MyBooksScreen';
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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
        <div className="w-16 h-16 rounded-3xl bg-linear-to-br from-[#615bff] to-[#26b8a8] flex items-center justify-center text-white shadow-lg animate-pulse mb-4">
          <Bot className="w-8 h-8" />
        </div>
        <p className="text-sm font-extrabold text-slate-700 dark:text-slate-200 mb-1">
          {isArabic ? 'مس نور تستيقظ…' : language === 'fr' ? 'Mademoiselle Noor se réveille…' : 'Miss Noor is waking up…'}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
          {isArabic
            ? 'التحميل الأول قد يستغرق لحظة'
            : language === 'fr'
            ? 'Le premier chargement peut prendre un instant'
            : 'The first load can take a moment'}
        </p>
      </div>
    );
  }

  const showOnboarding = !student || !student.isOnboarded;

  // On the feed the reel is the whole screen: the header would steal 65px and
  // break the Instagram/TikTok feel. The bottom nav stays, floating as a
  // translucent overlay so the learner can still leave the feed.
  const isImmersive = !showOnboarding && activeTab === 'feed';

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col items-center text-slate-900 dark:text-slate-100">
      <div className="w-full max-w-md md:max-w-lg min-h-screen bg-slate-50 dark:bg-slate-900 border-x border-slate-200/80 dark:border-slate-800 shadow-2xl flex flex-col relative">
        {!showOnboarding && !isImmersive && (
          <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800 px-3.5 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-linear-to-br from-[#615bff] to-[#26b8a8] text-white flex items-center justify-center shadow-md">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-black tracking-tight">{t.app.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {student?.name || ''}
                </div>
              </div>
            </div>

            <ChildTopMenu />
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
              {activeTab === 'missions' && <MissionsScreen />}
              {activeTab === 'homework' && <MissionsScreen />}
              {activeTab === 'collections' && <CollectionsScreen />}
              {activeTab === 'mybooks' && <MyBooksScreen />}
              {activeTab === 'review' && <ReviewScreen />}
              {activeTab === 'progress' && <ProgressScreen />}
              {activeTab === 'timetable' && <TimetableScreen />}
              {activeTab === 'profile' && <ProfileScreen />}
              {activeTab === 'settings' && <SettingsScreen />}
            </>
          )}
        </main>

        {!showOnboarding && <BottomNav overlay={isImmersive} />}
      </div>
    </div>
  );
};
