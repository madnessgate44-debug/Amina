/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BottomNav } from './BottomNav';
import { HomeScreen } from '../home/HomeScreen';
import { TimetableScreen } from '../timetable/TimetableScreen';
import { CompanionChatScreen } from '../companion/CompanionChatScreen';
import { SettingsScreen } from '../settings/SettingsScreen';
import { CurriculumBrowser } from '../curriculum/CurriculumBrowser';
import { KnowledgeMap } from '../mastery/KnowledgeMap';
import { ReviewScreen } from '../review/ReviewScreen';
import { ProgressScreen } from '../progress/ProgressScreen';
import { ProfileScreen } from '../profile/ProfileScreen';
import { StubScreen } from '../stubs/StubScreen';
import { OnboardingFlow } from '../onboarding/OnboardingFlow';
import { StageModal } from '../stage/StageModal';
import { VirtualTeacherClassroom } from '../teacher/VirtualTeacherClassroom';
import { Badge } from '../common/Badge';
import { Bot, Clock, Globe, Sparkles } from 'lucide-react';

export const AppShell: React.FC = () => {
  const {
    student,
    activeTab,
    isLoading,
    toastMessage,
    settings,
    setLanguage,
    setSimulatedTimeOfDay,
    t,
    language,
  } = useApp();

  const [showStageDirect, setShowStageDirect] = useState(false);
  const isArabic = language === 'ar';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg animate-pulse mb-3">
          <Bot className="w-7 h-7" />
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
          {t.common.loading}
        </p>
      </div>
    );
  }

  // If student profile is missing or not onboarded, display onboarding experience
  const showOnboarding = !student || !student.isOnboarded;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col items-center justify-start text-slate-900 dark:text-slate-100">
      {/* Mobile container wrapper */}
      <div className="w-full max-w-md md:max-w-lg min-h-screen bg-slate-50 dark:bg-slate-900 border-x border-slate-200/80 dark:border-slate-800 shadow-2xl flex flex-col relative">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-3.5 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black tracking-tight text-slate-900 dark:text-slate-100">
                  {t.app.name}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  {student?.grade || (isArabic ? 'الصف الخامس 🇪🇬' : 'Grade 5 🇪🇬')}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Demo Time Simulator Quick Toggle */}
            <button
              type="button"
              onClick={() =>
                setSimulatedTimeOfDay(
                  settings.simulatedTimeOfDay === 'school_hours' ? 'after_school' : 'school_hours'
                )
              }
              title={t.settings.demoSimulatorDesc}
              className={`px-2 py-1 rounded-full text-[10px] font-mono font-bold border transition-all flex items-center gap-1 ${
                settings.simulatedTimeOfDay === 'school_hours'
                  ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-300'
                  : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 border-indigo-300'
              }`}
            >
              <Clock className="w-3 h-3 text-current" />
              <span>{settings.simulatedTime}</span>
            </button>

            {/* 3-Way Language Quick Switcher (Arabic, French, English) */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-xs">
              <button
                type="button"
                onClick={() => setLanguage('ar')}
                className={`px-2 py-0.5 rounded-full text-[10px] font-black transition-all cursor-pointer ${
                  language === 'ar'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
                title="العربية"
              >
                عربي
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded-full text-[10px] font-black transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
                title="English"
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('fr')}
                className={`px-2 py-0.5 rounded-full text-[10px] font-black transition-all cursor-pointer ${
                  language === 'fr'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
                title="Français"
              >
                FR
              </button>
            </div>

            {/* Direct Launch to The Stage */}
            <button
              type="button"
              onClick={() => setShowStageDirect(true)}
              className="px-2.5 py-1 rounded-full text-[10px] font-black bg-linear-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-xs flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
              title={isArabic ? 'ادخل المسرح التفاعلي مع نور' : 'Enter The Stage with Nour'}
            >
              <Sparkles className="w-3 h-3 text-amber-950" />
              <span>{isArabic ? 'المسرح 🎭' : 'The Stage 🎭'}</span>
            </button>
          </div>
        </header>

        {/* Global Toast Notification */}
        {toastMessage && (
          <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-medium shadow-xl flex items-center gap-2 animate-fade-in border border-slate-700">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Main View Area */}
        <main className="flex-1 flex flex-col overflow-y-auto">
          {showOnboarding ? (
            <OnboardingFlow />
          ) : (
            <>
              {activeTab === 'home' && <HomeScreen />}
              {activeTab === 'learn' && <CurriculumBrowser />}
              {activeTab === 'missions' && <HomeScreen />}
              {activeTab === 'review' && <ReviewScreen />}
              {activeTab === 'progress' && <ProgressScreen />}
              {activeTab === 'companion' && <VirtualTeacherClassroom />}
              {activeTab === 'timetable' && <TimetableScreen />}
              {(activeTab === 'profile' || activeTab === 'settings') && <ProfileScreen />}
            </>
          )}
        </main>

        {/* Bottom Navigation */}
        {!showOnboarding && <BottomNav />}

        {/* Global The Stage Modal */}
        {showStageDirect && (
          <StageModal
            lessonId="off_ar_u1_l2"
            onClose={() => setShowStageDirect(false)}
          />
        )}
      </div>
    </div>
  );
};
