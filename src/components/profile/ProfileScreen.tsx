/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { ParentAuthModal } from '../parent/ParentAuthModal';
import { ParentDashboardModal } from '../parent/ParentDashboardModal';
import { DeveloperPanel } from '../settings/DeveloperPanel';
import { voiceService } from '../../services/voice/voiceService';
import {
  User,
  Shield,
  Award,
  Sparkles,
  Volume2,
  VolumeX,
  Globe,
  Download,
  Trash2,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Clock,
  Compass,
  Activity,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const ProfileScreen: React.FC = () => {
  const {
    student,
    language,
    setLanguage,
    settings,
    toggleCompanionVoice,
    parentAccount,
    isParentModeActive,
    gamification,
    exportProgressData,
    resetProfile,
    clearAllData,
    t,
  } = useApp();

  const isAr = language === 'ar';

  const [showParentAuthModal, setShowParentAuthModal] = useState<boolean>(false);
  const [showParentDashModal, setShowParentDashModal] = useState<boolean>(false);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [showDevPanel, setShowDevPanel] = useState<boolean>(false);

  const isParentLinked = Boolean(parentAccount && parentAccount.isLinked);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportProgressData();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-5 max-w-lg mx-auto w-full pb-24 space-y-4">
      {/* 1. Student Profile Card */}
      <div className="p-4 rounded-3xl bg-linear-to-br from-indigo-700 via-indigo-800 to-indigo-950 text-white shadow-xl shadow-indigo-900/20 relative overflow-hidden space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shadow-xs">
              <User className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-black">
                  {student?.name || (isAr ? 'الطالب' : 'Student')}
                </h2>
                <Badge variant="demo">Grade 5</Badge>
              </div>
              <p className="text-xs text-indigo-200">
                {student?.curriculum || (isAr ? 'المنهج المصري - الصف الخامس الابتدائي' : 'Egypt Curriculum - Grade 5')}
              </p>
            </div>
          </div>
        </div>

        {/* Gamification Bar: Level & XP */}
        {gamification && (
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{isAr ? `المستوى ${gamification.level}` : `Level ${gamification.level}`}</span>
              </span>
              <span className="text-[10px] text-indigo-100 font-mono">
                {gamification.xp} XP ({isAr ? `متبقي ${gamification.xpToNextLevel} للمستوى التالي` : `${gamification.xpToNextLevel} XP to next level`})
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/20 overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-amber-400 to-amber-300 transition-all rounded-full"
                style={{ width: `${Math.min(100, Math.max(10, ((100 - gamification.xpToNextLevel) / 100) * 100))}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* 2. Forgiving Achievements & Badges (No leaderboards, personal only) */}
      {gamification && (
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                {isAr ? 'الأوسمة والإنجازات الفردية' : 'Personal Achievements'}
              </h3>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              {gamification.badges.filter((b) => b.unlockedAt).length} / {gamification.badges.length}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {gamification.badges.map((b) => {
              const isUnlocked = Boolean(b.unlockedAt);
              return (
                <div
                  key={b.id}
                  className={`p-2.5 rounded-2xl border transition-all flex items-start gap-2 ${
                    isUnlocked
                      ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/40 text-amber-950 dark:text-amber-100'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 opacity-60'
                  }`}
                >
                  <div className={`p-1.5 rounded-xl shrink-0 ${isUnlocked ? 'bg-amber-400 text-slate-900' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'}`}>
                    <Award className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] font-bold block truncate">
                      {isAr ? b.titleAr : b.titleEn}
                    </span>
                    <span className="text-[9px] text-slate-500 dark:text-slate-400 leading-tight block line-clamp-2">
                      {isAr ? b.descriptionAr : b.descriptionEn}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. PARENT ACCOUNT LINK / SWITCH TO PARENT VIEW */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
              {isAr ? 'حساب ولي الأمر (إشراف آمن)' : 'Parent Account (Safe Summary)'}
            </h3>
          </div>
          {isParentLinked ? (
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              {isAr ? 'مرتبط' : 'Linked'}
            </span>
          ) : (
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
              {isAr ? 'غير مرتبط' : 'Not Linked'}
            </span>
          )}
        </div>

        {/* Student Informed Transparency Notice */}
        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
          {isParentLinked
            ? isAr
              ? `تم ربط حساب ولي الأمر (${parentAccount?.parentEmail}). يطّلع ولي الأمر على ملخص الإنجاز الأسبوعي فقط دون التعدي على خصوصيتك أو محادثاتك الخاصة.`
              : `Linked with parent (${parentAccount?.parentEmail}). Parent views broad weekly summaries only without reading private chats.`
            : isAr
              ? 'يمكن لولي الأمر إنشاء حساب منفصل برمز PIN للاطلاع على ملخص الإنجازات الأسبوعية وتفضيلات وقت النوم.'
              : 'Parents can create a separate account with PIN to review weekly summaries and bedtime settings.'}
        </p>

        <div className="pt-1">
          {isParentLinked ? (
            <button
              type="button"
              onClick={() => setShowParentAuthModal(true)}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 active:scale-98 shadow-sm flex items-center justify-center gap-2 transition-all"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isAr ? 'فتح لوحة ولي الأمر (أدخل PIN)' : 'Switch to Parent View (Enter PIN)'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowParentAuthModal(true)}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white active:scale-98 shadow-sm flex items-center justify-center gap-2 transition-all"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{isAr ? 'ربط وتفعيل حساب ولي الأمر الآن' : 'Link Parent Account Now'}</span>
            </button>
          )}
        </div>
      </div>

      {/* 4. Language & Voice Settings */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
          {isAr ? 'تفضيلات التطبيق والصوت' : 'App & Voice Preferences'}
        </h3>

        {/* Language */}
        <div className="flex items-center justify-between text-xs pt-1 border-b border-slate-100 dark:border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-600" />
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {isAr ? 'لغة الواجهة' : 'Interface Language'}
            </span>
          </div>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setLanguage('ar')}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                language === 'ar'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              عربي 🇪🇬
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              EN 🇬🇧
            </button>
            <button
              type="button"
              onClick={() => setLanguage('fr')}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                language === 'fr'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              FR 🇫🇷
            </button>
          </div>
        </div>

        {/* Companion Voice Toggle */}
        <div className="flex items-center justify-between text-xs pt-1">
          <div className="flex items-center gap-2">
            {settings.companionVoiceEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {isAr ? 'صوت الرفيق التعليمي' : 'Companion Voice'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => toggleCompanionVoice(!settings.companionVoiceEnabled)}
            className={`px-3 py-1 rounded-xl text-xs font-bold border transition-colors ${
              settings.companionVoiceEnabled
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-700 dark:text-emerald-300'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 text-slate-600'
            }`}
          >
            {settings.companionVoiceEnabled ? (isAr ? 'مفعل' : 'Enabled') : (isAr ? 'معطل' : 'Disabled')}
          </button>
        </div>
      </div>

      {/* 5. Data Privacy, Export & Account Management */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
          {isAr ? 'الخصوصية وإدارة البيانات' : 'Privacy & Data Controls'}
        </h3>

        {/* Export JSON */}
        <button
          type="button"
          disabled={isExporting}
          onClick={handleExport}
          className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between transition-all"
        >
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-indigo-600" />
            <span>{isAr ? 'تصدير نسخة احتياطية شفافة (JSON)' : 'Export Transparent Data (JSON)'}</span>
          </div>
          <span className="text-[10px] text-slate-400">
            {isExporting ? (isAr ? 'جارِ التصدير...' : 'Exporting...') : (isAr ? 'تحميل' : 'Download')}
          </span>
        </button>

        {/* Reset Profile */}
        {!showResetConfirm ? (
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{isAr ? 'إعادة ضبط ملف الطالب والمقابلة' : 'Reset Student Profile & Interview'}</span>
          </button>
        ) : (
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 space-y-2">
            <p className="text-xs text-amber-900 dark:text-amber-200 font-bold">
              {isAr ? 'هل أنت متأكد من إعادة ضبط المقابلة؟' : 'Are you sure you want to reset profile interview?'}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-1.5 rounded-xl text-xs bg-slate-200 dark:bg-slate-800 text-slate-700"
              >
                {t.common.cancel}
              </button>
              <button
                type="button"
                onClick={async () => {
                  await resetProfile();
                  setShowResetConfirm(false);
                }}
                className="flex-1 py-1.5 rounded-xl text-xs font-bold bg-amber-600 text-white"
              >
                {isAr ? 'تأكيد الإعادة' : 'Confirm'}
              </button>
            </div>
          </div>
        )}

        {/* Delete All Data */}
        {!showClearConfirm ? (
          <button
            type="button"
            onClick={() => setShowClearConfirm(true)}
            className="w-full p-2.5 rounded-xl border border-rose-200 dark:border-rose-900/40 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isAr ? 'حذف كافة البيانات والحساب نهائياً' : 'Completely Purge All Data'}</span>
          </button>
        ) : (
          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 space-y-2">
            <p className="text-xs text-rose-900 dark:text-rose-200 font-bold">
              {isAr ? 'حذف شامل لا يمكن التراجع عنه لكل السجلات.' : 'Permanent deletion of all local storage records.'}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-1.5 rounded-xl text-xs bg-slate-200 dark:bg-slate-800 text-slate-700"
              >
                {t.common.cancel}
              </button>
              <button
                type="button"
                onClick={async () => {
                  await clearAllData();
                  setShowClearConfirm(false);
                }}
                className="flex-1 py-1.5 rounded-xl text-xs font-bold bg-rose-600 text-white"
              >
                {isAr ? 'حذف نهائي' : 'Purge All'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 6. Developer Panel (Hidden by default / Telemetry) */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowDevPanel(!showDevPanel)}
          className="w-full py-2 px-3 rounded-2xl bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center justify-between transition-all"
        >
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-indigo-500" />
            <span>{isAr ? 'أدوات المطور ومؤشرات الأداء والتكلفة (مخفية)' : 'Developer Panel — Cost & Latency (Hidden)'}</span>
          </div>
          {showDevPanel ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showDevPanel && (
          <div className="mt-2.5">
            <DeveloperPanel language={language} />
          </div>
        )}
      </div>

      {/* Modals */}
      {showParentAuthModal && (
        <ParentAuthModal
          onClose={() => setShowParentAuthModal(false)}
          onSuccess={() => {
            setShowParentAuthModal(false);
            setShowParentDashModal(true);
          }}
        />
      )}

      {showParentDashModal && (
        <ParentDashboardModal onClose={() => setShowParentDashModal(false)} />
      )}
    </div>
  );
};
