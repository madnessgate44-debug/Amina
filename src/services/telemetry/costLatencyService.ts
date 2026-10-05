/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ApiCallMetric {
  id: string;
  timestamp: string; // ISO string
  date: string; // YYYY-MM-DD
  endpoint: string;
  model: string;
  tokensIn: number;
  tokensOut: number;
  costUsd: number;
  latencyMs: number;
  status: 'success' | 'fallback' | 'error';
  studentId: string;
}

export interface DayMetricSummary {
  date: string;
  callCount: number;
  totalTokensIn: number;
  totalTokensOut: number;
  totalCostUsd: number;
  avgLatencyMs: number;
  p95LatencyMs: number;
  exceededCostBudget: boolean; // > $0.50
  endpointBreakdown: Record<
    string,
    {
      calls: number;
      costUsd: number;
      avgLatencyMs: number;
    }
  >;
}

export interface DegradationModeStatus {
  isActive: boolean;
  reason?: string;
  reuseCachedExplanations: boolean;
  shorterVoiceResponses: boolean;
  preferLocalEvaluators: boolean;
}

const STORAGE_KEY_LOGS = 'ais_companion_telemetry_logs_v1';
const MAX_HISTORY_DAYS = 7;

// Gemini 2.5/3.8 Flash Pricing:
// ~$0.000075 per 1,000 input tokens ($0.075 / 1M)
// ~$0.000300 per 1,000 output tokens ($0.300 / 1M)
const COST_PER_INPUT_TOKEN = 0.000000075;
const COST_PER_OUTPUT_TOKEN = 0.000000300;

export const TELEMETRY_TARGETS = {
  DAILY_COST_LIMIT_USD: 0.50,
  HOME_SCREEN_LOAD_MS: 2000,
  QUIZ_FEEDBACK_MS: 500,
  COMPANION_TEXT_REPLY_MS: 3000,
  COMPANION_VOICE_REPLY_MS: 4000,
  MAX_REQUEST_TIMEOUT_MS: 15000,
};

class CostLatencyService {
  private logs: ApiCallMetric[] = [];
  private initialized = false;

  constructor() {
    this.loadLogs();
  }

  private loadLogs() {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY_LOGS);
      if (raw) {
        this.logs = JSON.parse(raw);
        this.pruneOldLogs();
      }
      this.initialized = true;
    } catch (e) {
      console.warn('Failed to load telemetry logs from localStorage:', e);
      this.logs = [];
    }
  }

  private saveLogs() {
    if (typeof window === 'undefined') return;
    try {
      this.pruneOldLogs();
      localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(this.logs.slice(-250)));
    } catch (e) {
      console.warn('Failed to save telemetry logs:', e);
    }
  }

  private pruneOldLogs() {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - MAX_HISTORY_DAYS);
    const cutoffStr = cutoffDate.toISOString().split('T')[0];
    this.logs = this.logs.filter((l) => l.date >= cutoffStr);
  }

  /**
   * Helper to estimate token count from string length
   * English: ~4 characters per token
   * Arabic: ~2 characters per token
   */
  public estimateTokens(text: string, language: 'ar' | 'en' = 'ar'): number {
    if (!text) return 0;
    const charsPerToken = language === 'ar' ? 2 : 4;
    return Math.max(1, Math.ceil(text.length / charsPerToken));
  }

  /**
   * Calculate cost in USD based on input & output token estimates
   */
  public computeCostUsd(tokensIn: number, tokensOut: number): number {
    return tokensIn * COST_PER_INPUT_TOKEN + tokensOut * COST_PER_OUTPUT_TOKEN;
  }

  /**
   * Record an API call metric
   */
  public recordCall(params: {
    endpoint: string;
    model?: string;
    tokensIn: number;
    tokensOut: number;
    latencyMs: number;
    status?: 'success' | 'fallback' | 'error';
    studentId?: string;
  }): ApiCallMetric {
    const today = new Date().toISOString().split('T')[0];
    const costUsd = this.computeCostUsd(params.tokensIn, params.tokensOut);

    const metric: ApiCallMetric = {
      id: `call_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      date: today,
      endpoint: params.endpoint,
      model: params.model || 'gemini-3.8-flash',
      tokensIn: params.tokensIn,
      tokensOut: params.tokensOut,
      costUsd,
      latencyMs: Math.round(params.latencyMs),
      status: params.status || 'success',
      studentId: params.studentId || 'demo_student',
    };

    this.logs.push(metric);
    this.saveLogs();

    // Check operator degradation alert (silent to student)
    const todaySummary = this.getSummaryForDate(today);
    if (todaySummary.exceededCostBudget) {
      console.warn(
        `[TELEMETRY OPERATOR ALERT] Daily cost limit exceeded for student: $${todaySummary.totalCostUsd.toFixed(
          4
        )} / $${TELEMETRY_TARGETS.DAILY_COST_LIMIT_USD}. Engaging graceful degradation.`
      );
    }

    return metric;
  }

  /**
   * Aggregate metrics for a specific date
   */
  public getSummaryForDate(dateStr: string): DayMetricSummary {
    const daysLogs = this.logs.filter((l) => l.date === dateStr);
    const callCount = daysLogs.length;

    let totalTokensIn = 0;
    let totalTokensOut = 0;
    let totalCostUsd = 0;
    const latencies: number[] = [];
    const endpointBreakdown: Record<string, { calls: number; costUsd: number; avgLatencyMs: number }> = {};

    for (const log of daysLogs) {
      totalTokensIn += log.tokensIn;
      totalTokensOut += log.tokensOut;
      totalCostUsd += log.costUsd;
      latencies.push(log.latencyMs);

      if (!endpointBreakdown[log.endpoint]) {
        endpointBreakdown[log.endpoint] = { calls: 0, costUsd: 0, avgLatencyMs: 0 };
      }
      endpointBreakdown[log.endpoint].calls += 1;
      endpointBreakdown[log.endpoint].costUsd += log.costUsd;
      endpointBreakdown[log.endpoint].avgLatencyMs += log.latencyMs;
    }

    // Compute averages
    for (const ep in endpointBreakdown) {
      if (endpointBreakdown[ep].calls > 0) {
        endpointBreakdown[ep].avgLatencyMs = Math.round(
          endpointBreakdown[ep].avgLatencyMs / endpointBreakdown[ep].calls
        );
      }
    }

    latencies.sort((a, b) => a - b);
    const avgLatencyMs = latencies.length > 0 ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length) : 0;
    const p95Idx = Math.floor(latencies.length * 0.95);
    const p95LatencyMs = latencies.length > 0 ? latencies[p95Idx] || latencies[latencies.length - 1] : 0;

    return {
      date: dateStr,
      callCount,
      totalTokensIn,
      totalTokensOut,
      totalCostUsd,
      avgLatencyMs,
      p95LatencyMs,
      exceededCostBudget: totalCostUsd > TELEMETRY_TARGETS.DAILY_COST_LIMIT_USD,
      endpointBreakdown,
    };
  }

  /**
   * Get 7-day history aggregates
   */
  public getLast7DaysSummaries(): DayMetricSummary[] {
    const days: DayMetricSummary[] = [];
    const now = new Date();

    for (let i = 0; i < MAX_HISTORY_DAYS; i++) {
      const d = new Date(now.getTime() - i * 24 * 3600 * 1000);
      const dateStr = d.toISOString().split('T')[0];
      days.push(this.getSummaryForDate(dateStr));
    }

    return days;
  }

  /**
   * Check if graceful degradation should be engaged
   */
  public getDegradationStatus(): DegradationModeStatus {
    const today = new Date().toISOString().split('T')[0];
    const todaySummary = this.getSummaryForDate(today);

    // If today's cost is >= 80% of limit or recent calls are timing out
    const isCostNearLimit = todaySummary.totalCostUsd >= TELEMETRY_TARGETS.DAILY_COST_LIMIT_USD * 0.8;
    const recentLogs = this.logs.slice(-5);
    const highLatencyDetected = recentLogs.length >= 3 && recentLogs.every((l) => l.latencyMs > 3500);

    const isActive = isCostNearLimit || highLatencyDetected;
    const reason = isCostNearLimit
      ? `Daily spend threshold reached ($${todaySummary.totalCostUsd.toFixed(3)} / $0.50)`
      : highLatencyDetected
      ? 'Elevated latency detected on consecutive AI calls'
      : undefined;

    return {
      isActive,
      reason,
      reuseCachedExplanations: isActive,
      shorterVoiceResponses: isActive,
      preferLocalEvaluators: isActive,
    };
  }

  /**
   * Fetch with 15s timeout wrapper and automatic latency/token telemetry recording
   */
  public async instrumentedFetch<T = any>(
    endpoint: string,
    payload: any,
    options: {
      studentId?: string;
      language?: 'ar' | 'en';
      model?: string;
      timeoutMs?: number;
    } = {}
  ): Promise<{ data: T; metric: ApiCallMetric }> {
    const t0 = performance.now();
    const timeout = options.timeoutMs || TELEMETRY_TARGETS.MAX_REQUEST_TIMEOUT_MS;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    const lang = options.language || 'ar';
    const payloadStr = JSON.stringify(payload);
    const tokensIn = this.estimateTokens(payloadStr, lang);

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payloadStr,
        signal: controller.signal,
      });

      clearTimeout(timer);
      const t1 = performance.now();
      const latencyMs = Math.round(t1 - t0);

      const data = await res.json();
      const responseStr = JSON.stringify(data);
      const tokensOut = this.estimateTokens(responseStr, lang);

      const metric = this.recordCall({
        endpoint,
        model: options.model || data.model || 'gemini-3.8-flash',
        tokensIn,
        tokensOut,
        latencyMs,
        status: data.source === 'error_fallback' ? 'fallback' : 'success',
        studentId: options.studentId,
      });

      return { data, metric };
    } catch (err: any) {
      clearTimeout(timer);
      const t1 = performance.now();
      const latencyMs = Math.round(t1 - t0);

      const metric = this.recordCall({
        endpoint,
        model: options.model || 'local_fallback',
        tokensIn,
        tokensOut: 10,
        latencyMs,
        status: 'error',
        studentId: options.studentId,
      });

      throw err;
    }
  }

  public getRawLogs(): ApiCallMetric[] {
    return [...this.logs];
  }

  public clearLogs() {
    this.logs = [];
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY_LOGS);
    }
  }
}

export const costLatencyService = new CostLatencyService();
