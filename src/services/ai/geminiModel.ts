/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Single source of truth for Gemini model names (see the model-string-hygiene
 * rule: a model name lives in ONE place, never repeated across the codebase).
 *
 * Why a chain, not one name: a single model name hardcoded in eight routes once
 * took the whole tutor down. The default model returned 429 RESOURCE_EXHAUSTED
 * on the live key, every route caught the error and served a canned fallback,
 * and the child saw scripted text instead of teaching. A working model on the
 * same key (verified 2026-10-29) proved the failure was the model, not the key.
 *
 * So a text call now walks a short, ordered chain and uses the first model that
 * answers. `GEMINI_MODEL` still overrides, and is tried first.
 *
 * Free-tier note: the free tier is rate limited per model per minute and per
 * day. The chain below is ordered so the most capable model is tried first and a
 * busy or gated model falls through to the next instead of failing the turn.
 */

import type { GoogleGenAI } from '@google/genai';

/**
 * Ordered text-model chain. First model that answers wins.
 * Verified against the live model list on 2026-10-29:
 *   gemini-3.8-flash -> 429 RESOURCE_EXHAUSTED (gated on this key)
 *   gemini-3.6-flash -> 200
 *   gemini-3.5-flash -> 200
 *   gemini-2.5-flash -> 200
 */
export const DEFAULT_TEXT_MODELS = [
  'gemini-3.6-flash',
  'gemini-3.5-flash',
  'gemini-2.5-flash',
  'gemini-3.8-flash',
] as const;

/** The model shown to users and used as the telemetry default. */
export const PRIMARY_TEXT_MODEL = DEFAULT_TEXT_MODELS[0];

/** Speech-to-text uses a text-capable model. */
export const DEFAULT_STT_MODEL = 'gemini-3.8-flash';

/**
 * Text-to-speech model chain. Speech models are specialised, so the text chain
 * above never applies. Ordered: the newest verified TTS model first, then older
 * ones that still answer on the same key.
 *
 * Why a chain: the previous single name (`gemini-3.8-flash-lite-tts`) does not
 * exist on the live model list (verified 2026-10-30). Every TTS call 404'd,
 * `/api/tts` silently returned `useBrowserSpeech:true`, and Miss Noor's voice
 * was the robotic browser one with no real audio for the reel to show.
 */
export const TTS_MODELS = [
  'gemini-3.1-flash-tts-preview',
  'gemini-2.5-flash-preview-tts',
  'gemini-2.5-pro-preview-tts',
] as const;

/** The first TTS model tried. */
export const GEMINI_TTS_MODEL = TTS_MODELS[0];

/** Sample rate (Hz) of the mono 16-bit PCM the TTS models return. */
export const TTS_SAMPLE_RATE = 24000;

/** `GEMINI_MODEL` (when set) is tried first, then the defaults, de-duplicated. */
export function resolveTextModelChain(): string[] {
  const override = (process.env.GEMINI_MODEL || '').trim();
  const chain = override ? [override, ...DEFAULT_TEXT_MODELS] : [...DEFAULT_TEXT_MODELS];
  return Array.from(new Set(chain));
}

/** True when the error means "this model cannot serve right now", so try the next. */
export function isModelUnavailable(err: unknown): boolean {
  if (!err) return false;
  const e = err as { status?: number; code?: number | string; message?: string };
  const status = e.status ?? (typeof e.code === 'number' ? e.code : undefined);
  const msg = String(e.message || err).toLowerCase();
  if (status === 429 || status === 503 || status === 404) return true;
  return (
    msg.includes('429') ||
    msg.includes('503') ||
    msg.includes('resource_exhausted') ||
    msg.includes('unavailable') ||
    msg.includes('not_found') ||
    msg.includes('not found') ||
    msg.includes('overloaded')
  );
}

type GenerateContentParams = Parameters<GoogleGenAI['models']['generateContent']>[0];
type GenerateContentResult = ReturnType<GoogleGenAI['models']['generateContent']>;

/**
 * Last model that answered. A serverless instance reuses it on the next call, so
 * a gated model is discovered once per instance instead of on every request.
 */
let preferredModel: string | null = null;

/**
 * Calls Gemini, walking the model chain until one answers.
 *
 * - No `model` on the params  -> walk `resolveTextModelChain()`.
 * - A `model` on the params   -> use only that model (e.g. the TTS model).
 *
 * A non-availability error (bad request, safety block, auth) is rethrown at once,
 * because retrying it on another model would only waste a request.
 */
export async function generateContentWithFallback(
  ai: GoogleGenAI,
  params: Omit<GenerateContentParams, 'model'> & { model?: string }
): Promise<GenerateContentResult> {
  const { model: requested, ...rest } = params;
  let models = requested ? [requested] : resolveTextModelChain();
  if (!requested && preferredModel && models.includes(preferredModel)) {
    models = [preferredModel, ...models.filter((m) => m !== preferredModel)];
  }

  let lastError: unknown;
  for (const model of models) {
    try {
      const result = await ai.models.generateContent({ ...rest, model } as GenerateContentParams);
      if (!requested) preferredModel = model;
      return result;
    } catch (err) {
      lastError = err;
      if (!isModelUnavailable(err)) throw err;
    }
  }
  throw lastError;
}
