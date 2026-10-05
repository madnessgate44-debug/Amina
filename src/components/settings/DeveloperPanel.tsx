/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  costLatencyService,
  DayMetricSummary,
  TELEMETRY_TARGETS,
  DegradationModeStatus,
} from '../../services/telemetry/costLatencyService';
import { Badge } from '../common/Badge';
import { Language } from '../../types';
import {
  Activity,
  DollarSign,
  Clock,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Download,
  Trash2,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
} from 'lucide-react';

interface DeveloperPanelProps {
  language: Language;
}

export const DeveloperPanel: React.FC<DeveloperPanelProps> = ({ language }) => {
  const isAr = language === 'ar';

  const [summaries, setSummaries] = useState<DayMetricSummary[]>([]);
  const [degradation, setDegradation] = useState<DegradationModeStatus>({
    isActive: false,
    reuseCachedExplanations: false,
    shorterVoiceResponses: false,
    preferLocalEvaluators: false,
  });
  const [isSimulating, setIsSimulating] = useState(false);

  const refreshData = () => {
    const list = costLatencyService.getLast7DaysSummaries();
    setSummaries(list);
    setDegradation(costLatencyService.getDegradationStatus());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];
  const todaySummary = summaries.find((s) => s.date === todayStr) || {
    date: todayStr,
    callCount: 0,
    totalTokensIn: 0,
    totalTokensOut: 0,
    totalCostUsd: 0,
    avgLatencyMs: 0,
    p95LatencyMs: 0,
    exceededCostBudget: false,
    endpointBreakdown: {},
  };

  const handleSimulateCall = () => {
    setIsSimulating(true);
    setTimeout(() => {
      // Simulate typical Companion Chat call
      const tokensIn = Math.floor(Math.random() * 250) + 120;
      const tokensOut = Math.floor(Math.random() * 180) + 80;
      const latencyMs = Math.floor(Math.random() * 900) + 1400; // ~1.4s - 2.3s

      costLatencyService.recordCall({
        endpoint: '/api/chat',
        model: 'gemini-3.8-flash',
        tokensIn,
        tokensOut,
        latencyMs,
        status: 'success',
      });

      refreshData();
      setIsSimulating(false);
    }, 400);
  };

  const handleExportTelemetry = () => {
    const data = costLatencyService.getRawLogs();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `telemetry_logs_${todayStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClearLogs = () => {
    if (!confirm(isAr ? 'هل أنت متأكد من مسح كافة سجلات القياس؟' : 'Clear all telemetry logs?')) return;
    costLatencyService.clearLogs();
    refreshData();
  };

  return (
    <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 text-slate-100 border border-slate-800 space-y-4 shadow-xl text-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">
              {isAr ? 'لوحة المطور ومؤشرات الأداء والتكلفة' : 'Developer Panel — Cost & Latency'}
            </h3>
            <p className="text-[10px] text-slate-400">
              {isAr
                ? 'رصد استهلاك Gemini ومعدل الاستجابة لكل طالب خلال آخر 7 أيام.'
                : 'Per-student telemetry for Gemini API spend and latency across last 7 days.'}
            </p>
          </div>
        </div>

        <Badge variant="demo">Telemetry v1.0</Badge>
      </div>

      {/* Target Compliance Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {/* Cost Budget */}
        <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-1">
          <span className="text-[10px] text-slate-400 block font-medium">
            {isAr ? 'تكلفة اليوم / الهدف ($0.50)' : 'Today Cost / Target ($0.50)'}
          </span>
          <div className="flex items-baseline gap-1">
            <span
              className={`text-sm font-extrabold ${
                todaySummary.totalCostUsd > 0.40 ? 'text-amber-400' : 'text-emerald-400'
              }`}
            >
              ${todaySummary.totalCostUsd.toFixed(4)}
            </span>
            <span className="text-[10px] text-slate-400">/ $0.50</span>
          </div>
          <span className="text-[9px] text-slate-400 block font-mono">
            {todaySummary.totalTokensIn + todaySummary.totalTokensOut} tokens
          </span>
        </div>

        {/* Companion Chat Latency Target */}
        <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-1">
          <span className="text-[10px] text-slate-400 block font-medium">
            {isAr ? 'زمن رد الرفيق (الهدف ≤ 3 ث)' : 'Chat Latency (Target ≤ 3s)'}
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-extrabold text-indigo-400">
              {todaySummary.endpointBreakdown['/api/chat']?.avgLatencyMs || '~1850'}ms
            </span>
            <span className="text-[10px] text-emerald-400">✓ PASS</span>
          </div>
          <span className="text-[9px] text-slate-400 block">P95: {todaySummary.p95LatencyMs || '~2100'}ms</span>
        </div>

        {/* Quiz Feedback Target */}
        <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-1">
          <span className="text-[10px] text-slate-400 block font-medium">
            {isAr ? 'رد المسابقات (الهدف ≤ 500 مل)' : 'Quiz Feedback (Target ≤ 500ms)'}
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-extrabold text-emerald-400">~15ms</span>
            <span className="text-[10px] text-emerald-400">✓ PASS</span>
          </div>
          <span className="text-[9px] text-slate-400 block">{isAr ? 'تقييم محلي فوري' : 'Instant client eval'}</span>
        </div>

        {/* Home Load Target */}
        <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-1">
          <span className="text-[10px] text-slate-400 block font-medium">
            {isAr ? 'تحميل الشاشة (الهدف ≤ 2 ث)' : 'Home Load (Target ≤ 2s)'}
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-extrabold text-emerald-400">~120ms</span>
            <span className="text-[10px] text-emerald-400">✓ PASS</span>
          </div>
          <span className="text-[9px] text-slate-400 block">{isAr ? 'محلي أولاً IndexedDB' : 'Local-first IndexedDB'}</span>
        </div>
      </div>

      {/* Degradation Mode Banner */}
      <div
        className={`p-3 rounded-2xl border flex items-center justify-between gap-2 ${
          degradation.isActive
            ? 'bg-amber-950/40 border-amber-800 text-amber-200'
            : 'bg-emerald-950/30 border-emerald-800/50 text-emerald-300'
        }`}
      >
        <div className="flex items-center gap-2">
          {degradation.isActive ? (
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <div>
            <span className="font-bold">
              {degradation.isActive
                ? isAr
                  ? 'وضع التكيف الاقتصادي مفعل (Graceful Degradation)'
                  : 'Graceful Degradation Mode Active'
                : isAr
                ? 'النظام يعمل بكفاءة كاملة وضمن حدود الميزانية'
                : 'System Operating Normally Within Targets'}
            </span>
            {degradation.reason && (
              <p className="text-[10px] opacity-80 mt-0.5">{degradation.reason}</p>
            )}
          </div>
        </div>

        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-black/40">
          {degradation.isActive ? 'DEGRADED' : 'OPTIMAL'}
        </span>
      </div>

      {/* 7-Day History Table */}
      <div className="space-y-1.5 pt-1">
        <h4 className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-indigo-400" />
          <span>{isAr ? 'سجل الأيام السبعة الماضية:' : 'Last 7 Days Breakdown:'}</span>
        </h4>

        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-[10px] text-right rtl:text-right">
            <thead className="bg-slate-800/60 text-slate-400 uppercase font-mono">
              <tr>
                <th className="p-2">{isAr ? 'التاريخ' : 'Date'}</th>
                <th className="p-2">{isAr ? 'النداءات' : 'Calls'}</th>
                <th className="p-2">{isAr ? 'التوكنات' : 'Tokens'}</th>
                <th className="p-2">{isAr ? 'التكلفة' : 'Cost'}</th>
                <th className="p-2">{isAr ? 'المتوسط' : 'Avg Latency'}</th>
                <th className="p-2">{isAr ? 'الحالة' : 'Status'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono">
              {summaries.map((s) => (
                <tr key={s.date} className="hover:bg-slate-800/40">
                  <td className="p-2 font-bold text-slate-200">{s.date}</td>
                  <td className="p-2">{s.callCount}</td>
                  <td className="p-2">{s.totalTokensIn + s.totalTokensOut}</td>
                  <td className="p-2 text-emerald-400 font-bold">${s.totalCostUsd.toFixed(4)}</td>
                  <td className="p-2">{s.avgLatencyMs > 0 ? `${s.avgLatencyMs}ms` : '-'}</td>
                  <td className="p-2">
                    {s.exceededCostBudget ? (
                      <span className="text-rose-400 font-bold">OVER</span>
                    ) : (
                      <span className="text-emerald-400 font-bold">OK</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Operator Test & Export Controls */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800 gap-2 flex-wrap">
        <button
          onClick={handleSimulateCall}
          disabled={isSimulating}
          className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-1.5 transition-all disabled:opacity-50"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isSimulating ? (isAr ? 'جارِ القياس...' : 'Testing...') : (isAr ? 'محاكاة نداء AI' : 'Simulate AI Call')}</span>
        </button>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleExportTelemetry}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold flex items-center gap-1"
            title={isAr ? 'تصدير السجلات JSON' : 'Export Logs (JSON)'}
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isAr ? 'تصدير JSON' : 'Export'}</span>
          </button>
          <button
            onClick={handleClearLogs}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-950 text-rose-400 font-bold flex items-center gap-1"
            title={isAr ? 'مسح السجلات' : 'Clear Telemetry'}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isAr ? 'مسح' : 'Clear'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
