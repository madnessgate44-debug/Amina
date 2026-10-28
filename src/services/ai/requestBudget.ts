/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Request budget for the AI routes.
 *
 * Vercel kills a serverless function at 60s (`maxDuration` in vercel.json) and
 * returns FUNCTION_INVOCATION_TIMEOUT to the child. The Gemini SDK, left to its
 * defaults, makes up to 5 attempts (DEFAULT_RETRY_ATTEMPTS = 5, including the
 * first) with exponential backoff up to 60s between them, and sets no
 * per-request timeout. A slow upstream call therefore outlives the platform
 * limit, and the child sees a raw platform error page instead of a lesson.
 *
 * These two values keep the whole route inside the platform budget: one attempt,
 * and a timeout well below 60s. A timeout throws, the route's existing catch
 * serves its local fallback, and the child gets a lesson.
 */

/** Per-request HTTP timeout, in ms. Kept well under Vercel's 60s function limit. */
export const AI_REQUEST_TIMEOUT_MS = 20_000;

/** Attempts including the first. 1 replaces the SDK default of 5 attempts. */
export const AI_MAX_ATTEMPTS = 1;

/** `httpOptions` for every `GoogleGenAI` call: bounded time, no retry storm. */
export const AI_HTTP_OPTIONS = {
  timeout: AI_REQUEST_TIMEOUT_MS,
  retryOptions: { attempts: AI_MAX_ATTEMPTS },
} as const;
