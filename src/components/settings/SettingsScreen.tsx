/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { voiceService } from '../../services/voice/voiceService';
import {
  Settings,
  Globe,
  Clock,
  RotateCcw,
  Trash2,
  Database,
  AlertTriangle,
  Check,
  ShieldCheck,
  Volume2,
  Mic,
  MicOff,
  RefreshCw,
  Activity,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { DeveloperPanel } from './DeveloperPanel';

export const SettingsScreen: React.FC = () => {
  const {
    t,
    language,
    setLanguage,
    settings,
    setSimulatedTimeOfDay,
    toggleDemoTimeSimulator,
    toggleCompanionVoice,
    updateMicPermission,
    resetProfile,
    clearAllData,
    toggleShowEvidenceLog,
    exportProgressData,
    student,
  } = useApp();

  const isArabic = language === 'ar';

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showDevPanel, setShowDevPanel] = useState(false);
  const [isTestingMic, setIsTestingMic] = useState(false);
  const [testFeedback, setTestFeedback] = useState<string | null>(null);

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      await exportProgressData();
    } finally {
      setIsExporting(false);
    }
  };

  const handleRetestMic = async () => {
    setIsTestingMic(true);
    setTestFeedback(null);
    try {
      const result = await voiceService.testMicrophone();
      setIsTestingMic(false);
      if (result.status === 'granted') {
        await updateMicPermission('granted');
        setTestFeedback(t.settings.micTestSuccess);
      } else {
        await updateMicPermission(result.status);
        setTestFeedback(t.settings.micTestFailed);
      }
    } catch {
      setIsTestingMic(false);
      await updateMicPermission('denied');
      setTestFeedback(t.settings.micTestFailed);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-5 max-w-lg mx-auto w-full pb-20 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {t.settings.title}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t.settings.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* 1. Language Toggle */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
              {t.settings.languageSection}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setLanguage('ar')}
            className={`py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
              language === 'ar'
                ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 shadow-xs'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400'
            }`}
          >
            <span>العربية 🇪🇬</span>
            {language === 'ar' && <Check className="w-3.5 h-3.5 text-indigo-600" />}
          </button>

          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
              language === 'en'
                ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 shadow-xs'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400'
            }`}
          >
            <span>English 🇬🇧</span>
            {language === 'en' && <Check className="w-3.5 h-3.5 text-indigo-600" />}
          </button>

          <button
            type="button"
            onClick={() => setLanguage('fr')}
            className={`py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
              language === 'fr'
                ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 shadow-xs'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400'
            }`}
          >
            <span>Français 🇫🇷</span>
            {language === 'fr' && <Check className="w-3.5 h-3.5 text-indigo-600" />}
          </button>
        </div>
      </div>

      {/* 2. Voice & Microphone Controls (Deliverable 5) */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
              {t.settings.voiceSection}
            </span>
          </div>
          <Badge variant="official">Phase 3</Badge>
        </div>

        {/* Companion Voice Toggle */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex items-start justify-between gap-3">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
              {t.settings.voiceOutputToggle}
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              {t.settings.voiceOutputDesc}
            </p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={settings.companionVoiceEnabled ?? true}
            onClick={() => toggleCompanionVoice(!(settings.companionVoiceEnabled ?? true))}
            className={`w-11 h-6 shrink-0 rounded-full transition-colors relative focus:outline-hidden ${
              (settings.companionVoiceEnabled ?? true)
                ? 'bg-indigo-600'
                : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <span
              className={`w-4 h-4 rounded-full bg-white block shadow-sm transform transition-transform absolute top-1 ${
                (settings.companionVoiceEnabled ?? true)
                  ? 'left-6 rtl:left-1'
                  : 'left-1 rtl:left-6'
              }`}
            />
          </button>
        </div>

        {/* Microphone Permission Status & Test */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {t.settings.micStatusTitle}
              </span>
            </div>

            {settings.micPermissionStatus === 'granted' && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 flex items-center gap-1">
                <Check className="w-3 h-3" />
                {t.settings.micStatusGranted}
              </span>
            )}
            {settings.micPermissionStatus === 'denied' && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-300 flex items-center gap-1">
                <MicOff className="w-3 h-3" />
                {t.settings.micStatusDenied}
              </span>
            )}
            {settings.micPermissionStatus === 'prompt' && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300">
                {t.settings.micStatusPrompt}
              </span>
            )}
            {settings.micPermissionStatus === 'unsupported' && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                {t.settings.micStatusUnsupported}
              </span>
            )}
          </div>

          <div className="pt-1 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleRetestMic}
              disabled={isTestingMic}
              className="py-1.5 px-3 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTestingMic ? 'animate-spin' : ''}`} />
              <span>{isTestingMic ? t.settings.testingMic : t.settings.retestMicButton}</span>
            </button>

            {testFeedback && (
              <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                {testFeedback}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Developer-only demo controls: hidden from the child-facing settings surface. */}
      {showDevPanel && (
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
              {t.settings.demoSimulatorSection}
            </span>
          </div>
          <Badge variant="demo">{t.app.demoControl}</Badge>
        </div>

        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          {t.settings.demoSimulatorDesc}
        </p>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setSimulatedTimeOfDay('school_hours')}
            className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-start gap-1 transition-all ${
              settings.simulatedTimeOfDay === 'school_hours'
                ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 ring-2 ring-amber-400/20'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400'
            }`}
          >
            <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400">
              10:00 AM
            </span>
            <span className="text-xs">{t.settings.modeDuringSchool}</span>
          </button>

          <button
            type="button"
            onClick={() => setSimulatedTimeOfDay('after_school')}
            className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-start gap-1 transition-all ${
              settings.simulatedTimeOfDay === 'after_school'
                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400'
            }`}
          >
            <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400">
              02:30 PM
            </span>
            <span className="text-xs">{t.settings.modeAfterSchool}</span>
          </button>
        </div>
      </div>
      )}

      {/* 3. Data & Privacy Management (Reset Profile / Purge All Data) */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
              {t.settings.dataSection}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Local IndexedDB</span>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          {t.settings.storageEngine}
        </p>

        {student && (
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between">
            <div>
              <span className="font-bold block text-slate-900 dark:text-slate-100">{student.name}</span>
              <span className="text-[11px] text-slate-500">{student.grade} • {student.country}</span>
            </div>
            <Badge variant="demo">origin: demo</Badge>
          </div>
        )}

        {/* Deliverable 7: Show Evidence Log Toggle */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                {t.settings.showEvidenceLogToggle}
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {t.settings.showEvidenceLogDesc}
              </p>
            </div>
            <button
              type="button"
              onClick={() => toggleShowEvidenceLog(!settings.showEvidenceLog)}
              className={`w-11 h-6 rounded-full transition-colors relative focus:outline-hidden ${
                settings.showEvidenceLog ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white shadow-xs transition-transform absolute top-1 ${
                  settings.showEvidenceLog
                    ? isArabic ? 'right-1' : 'left-6'
                    : isArabic ? 'right-6' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Deliverable 7: Export My Progress Data Action */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <div>
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
              {t.settings.exportDataButton}
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {t.settings.exportDataDesc}
            </p>
          </div>
          <button
            type="button"
            onClick={handleExportData}
            disabled={isExporting}
            className="w-full py-2.5 px-3 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/70 dark:bg-indigo-950/30 text-indigo-800 dark:text-indigo-300 text-xs font-semibold flex items-center justify-center gap-2 hover:bg-indigo-100 dark:hover:bg-indigo-950/60 transition-all disabled:opacity-50"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>{isExporting ? (isArabic ? 'جاري التصدير...' : 'Exporting...') : t.settings.exportDataButton}</span>
          </button>
        </div>

        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="w-full py-2.5 px-3 rounded-xl border border-amber-300 dark:border-amber-800/70 bg-amber-50/60 dark:bg-amber-950/20 text-amber-900 dark:text-amber-300 text-xs font-semibold flex items-center justify-center gap-2 hover:bg-amber-100 dark:hover:bg-amber-950/40 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
            <span>{t.settings.resetProfileButton}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowClearConfirm(true)}
            className="w-full py-2.5 px-3 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/60 dark:bg-rose-950/20 text-rose-800 dark:text-rose-300 text-xs font-semibold flex items-center justify-center gap-2 hover:bg-rose-100 dark:hover:bg-rose-950/40 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
            <span>{t.settings.clearAllButton}</span>
          </button>
        </div>
      </div>

      {/* Developer Panel (Hidden by default / Telemetry) */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowDevPanel(!showDevPanel)}
          className="w-full py-2 px-3 rounded-2xl bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center justify-between transition-all"
        >
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-indigo-500" />
            <span>{isArabic ? 'أدوات المطور ومؤشرات الأداء والتكلفة (مخفية)' : 'Developer Panel — Cost & Latency (Hidden)'}</span>
          </div>
          {showDevPanel ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showDevPanel && (
          <div className="mt-2.5">
            <DeveloperPanel language={language} />
          </div>
        )}
      </div>

      {/* Confirmation Modal for Reset Profile */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 max-w-sm w-full shadow-2xl space-y-3">
            <div className="flex items-center gap-2 text-amber-600">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                {t.settings.resetProfileButton}
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {t.settings.resetProfileConfirm}
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                {t.common.cancel}
              </button>
              <button
                type="button"
                onClick={async () => {
                  await resetProfile();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold"
              >
                {t.common.confirm}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Clear All Data */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 max-w-sm w-full shadow-2xl space-y-3">
            <div className="flex items-center gap-2 text-rose-600">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                {t.settings.clearAllButton}
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {t.settings.clearAllConfirm}
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                {t.common.cancel}
              </button>
              <button
                type="button"
                onClick={async () => {
                  await clearAllData();
                  setShowClearConfirm(false);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold"
              >
                {t.common.delete}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
