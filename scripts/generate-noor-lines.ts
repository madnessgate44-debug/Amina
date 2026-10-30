/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Generates Miss Noor's fixed lesson lines ONCE, into
 * `src/data/curriculum/preGeneratedNoorLines.ts`.
 *
 * Run:  npm run generate:noor-lines
 *
 * Only concepts that lack a line are generated, so re-running after a curriculum
 * change costs quota for the new lessons only. Pass `--force` to regenerate all.
 *
 * This is a build-time tool. It is never called at runtime, so it cannot affect
 * the child's session or the production quota.
 */

import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { GoogleGenAI } from '@google/genai';
import { curriculumService } from '../src/services/curriculum/curriculumService.js';
import { PRE_GENERATED_NOOR_LINES } from '../src/data/curriculum/preGeneratedNoorLines.js';
import type { OfficialCurriculumLesson, CurriculumLessonConcept } from '../src/types/teachingSession.js';

// A second key is used when the first is out of daily quota. Each key gets its
// own free-tier allowance, so a spare key doubles the number of lines one run
// can produce.
const apiKeys = [process.env.GEMINI_API_KEY, process.env.OHGeminiAPI, process.env.OHGeminiAPI2].filter(
  (k): k is string => Boolean(k)
);
if (apiKeys.length === 0) {
  console.error('BLOCKED: set GEMINI_API_KEY (or OHGeminiAPI) to generate lines.');
  process.exit(1);
}
const force = process.argv.includes('--force');

/** Models that already answered 429 today; skipped for the rest of the run. */
const exhaustedModels = new Set<string>();

/** Tries each configured key in turn, so one exhausted key does not stop a run. */
function clientFor(index: number) {
  return new GoogleGenAI({ apiKey: apiKeys[index % apiKeys.length] });
}

/**
 * Models used for generation, most capable first.
 *
 * The app's user-facing chain is deliberately short; generation is a batch job
 * and can range wider. Free-tier quota is counted per model per day, so a
 * longer list both improves the wording and multiplies the daily budget.
 */
const GENERATION_MODELS = [
  'gemini-3.6-flash',
  'gemini-3.5-flash',
  'gemini-3.7-flash',
  'gemini-3-flash-preview',
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
  'gemini-flash-lite-latest',
];

/** The three fixed slots, described to the model in one request. */
const SLOTS = [
  {
    slot: 'intro' as const,
    instruction:
      'Welcome the child warmly to this lesson in 2 short sentences. Say what you will learn together today. End with a short, friendly question asking if they are ready.',
  },
  {
    slot: 'explanation' as const,
    instruction:
      'Teach this ONE concept in plain words a 10-year-old follows, in 3 to 4 short sentences. Use one small everyday example a child in Egypt recognises. Do not read the textbook out loud and do not ask a question.',
  },
  {
    slot: 'check' as const,
    instruction:
      'Ask ONE clear question that checks whether the child understood this concept. Ask exactly one question and stop. Do not answer it yourself.',
  },
];

function curriculumText(concept: CurriculumLessonConcept, lesson: OfficialCurriculumLesson): string {
  return [
    `Lesson: ${lesson.titleAr} (${lesson.titleEn})`,
    `Subject: ${lesson.subjectNameAr}`,
    `Concept: ${concept.titleAr} (${concept.titleEn})`,
    concept.sourceText ? `Textbook text: ${concept.sourceText}` : '',
    concept.keyPoints?.length ? `Key points: ${concept.keyPoints.join(' | ')}` : '',
    concept.dailyLifeExampleAr ? `Everyday example: ${concept.dailyLifeExampleAr}` : '',
    concept.storyAnalogyAr ? `Analogy: ${concept.storyAnalogyAr}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Asks for all three fixed lines in ONE request.
 *
 * The free tier allows only 20 requests per model per day, and the curriculum
 * has 54 concepts. One request per concept (54) fits inside a day's budget;
 * one per slot (162) does not. So the model returns JSON with the three fields.
 */
async function generateAll(text: string, conceptTitle: string): Promise<{ intro: string; explanation: string; check: string }> {
  const slotBrief = SLOTS.map((s, i) => `${i + 1}. "${s.slot}": ${s.instruction}`).join('\n');

  const systemInstruction = `
You are "مس نور" (Miss Noor), a warm, patient, world-class Grade-5 teacher in Egypt, speaking to a 10-11 year old.
Speak natural, warm Egyptian Arabic. Never claim to be human.

CURRICULUM (ground every word in this; never invent facts):
"""${text.slice(0, 1400)}"""

YOUR TASK: write THREE short pieces for the concept "${conceptTitle}".
${slotBrief}

RULES:
1. Stay strictly on the concept "${conceptTitle}".
2. Be concrete and warm. Never use generic boilerplate.
3. Each piece is 2 to 4 short sentences. They will be read aloud, so keep them smooth.

Reply with ONLY this JSON, no other text:
{"intro": "...", "explanation": "...", "check": "..."}
`.trim();

  let lastError: unknown;
  for (let attempt = 0; attempt < 5; attempt++) {
    if (attempt > 0) await sleep(1500 * attempt);
    // Rotate keys across attempts so an exhausted key is not retried forever.
    const ai = clientFor(attempt);
    for (const model of GENERATION_MODELS) {
      // A model that answered 429 is out for the whole day; skip it from now on
      // instead of spending the rest of the run retrying it.
      if (exhaustedModels.has(model)) continue;
      try {
        const r = await ai.models.generateContent({
          model,
          contents: [{ role: 'user', parts: [{ text: 'اكتب النص المطلوب الآن بصيغة JSON.' }] }],
          config: { systemInstruction, temperature: 0.6, responseMimeType: 'application/json' },
        });
        const raw = (r.text || '').trim();
        if (!raw) continue;
        const parsed = JSON.parse(raw);
        if (parsed.intro && parsed.explanation && parsed.check) {
          return { intro: String(parsed.intro), explanation: String(parsed.explanation), check: String(parsed.check) };
        }
      } catch (err) {
        lastError = err;
        if ((err as { status?: number })?.status === 429) exhaustedModels.add(model);
      }
    }
  }
  throw lastError ?? new Error('no model answered');
}

/** Runs `worker` over `items` with a bounded number of in-flight calls. */
async function pool<T, R>(items: T[], limit: number, worker: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  async function run() {
    while (next < items.length) {
      const i = next++;
      results[i] = await worker(items[i]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run));
  return results;
}

async function main() {
  const lessons = curriculumService.getAllLessons();
  const out: Record<string, { intro: string; explanation: string; check: string }> = force
    ? {}
    : { ...PRE_GENERATED_NOOR_LINES };

  type Job = { key: string; text: string; conceptTitle: string; concept: CurriculumLessonConcept };
  const jobs: Job[] = [];
  let reused = 0;
  for (const lesson of lessons) {
    for (let i = 0; i < lesson.concepts.length; i++) {
      const concept = lesson.concepts[i];
      const key = `ar:${lesson.id}:${i}`;
      if (!force && out[key]?.intro && out[key]?.explanation && out[key]?.check) {
        reused++;
        continue;
      }
      jobs.push({ key, text: curriculumText(concept, lesson), conceptTitle: concept.titleAr, concept });
    }
  }

  console.log(`lessons=${lessons.length} toGenerate=${jobs.length} reused=${reused}`);
  let done = 0;
  let failed = 0;
  const CONCURRENCY = 2;

  const results = await pool(jobs, CONCURRENCY, async (job) => {
    let entry = { intro: '', explanation: '', check: '' };
    try {
      entry = await generateAll(job.text, job.conceptTitle);
    } catch {
      failed++;
    }
    done++;
    if (done % 5 === 0) console.log(`  progress ${done}/${jobs.length}`);
    return { key: job.key, entry };
  });

  let generated = 0;
  for (const { key, entry } of results) {
    if (entry.intro && entry.explanation && entry.check) {
      out[key] = entry;
      generated++;
    }
  }

  const header = `/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Miss Noor's fixed lesson lines, generated once and committed as data.
 *
 * Why this exists: the fixed part of every lesson is the same for every child —
 * the opening, the layered explanation and the check question. Asking a model
 * for those on every session burns quota for text that never changes. Generating
 * them once makes the core lesson path cost ZERO quota at runtime, so a child
 * can always start a lesson even when the model is rate limited or down.
 *
 * Live model calls are then spent only on the part that must be live: reacting
 * to what this child actually said.
 *
 * GENERATED FILE — do not edit by hand. Regenerate with:
 *   npm run generate:noor-lines
 * The \`noorPreGeneratedLines\` test fails if a lesson is missing a line, so this
 * file cannot silently fall behind the curriculum.
 *
 * Key format: \`\${language}:\${lessonId}:\${conceptIndex}\`.
 */

export interface PreGeneratedNoorLines {
  /** The warm opening for the lesson. */
  intro: string;
  /** The layered explanation of the concept. */
  explanation: string;
  /** The single check question that follows the explanation. */
  check: string;
}

/** Slot names, so callers never pass a bare string. */
export type PreGeneratedSlot = keyof PreGeneratedNoorLines;

export const PRE_GENERATED_NOOR_LINES: Record<string, PreGeneratedNoorLines> = `;

  const body = JSON.stringify(out, null, 2);
  const footer = `;

export function preGeneratedKey(
  language: string,
  lessonId: string,
  conceptIndex: number
): string {
  return \`\${language}:\${lessonId}:\${conceptIndex}\`;
}

/**
 * The fixed line for a lesson concept, or null when it has not been generated.
 * A null result is the caller's signal to fall back to a live call.
 */
export function getPreGeneratedLine(
  language: string,
  lessonId: string,
  conceptIndex: number,
  slot: PreGeneratedSlot
): string | null {
  const entry = PRE_GENERATED_NOOR_LINES[preGeneratedKey(language, lessonId, conceptIndex)];
  const value = entry?.[slot];
  return value && value.trim() ? value : null;
}
`;

  const target = resolve(process.cwd(), 'src/data/curriculum/preGeneratedNoorLines.ts');
  writeFileSync(target, header + body + footer, 'utf8');
  console.log(`lessons=${lessons.length} generated=${generated} reused=${reused} failed=${failed}`);
  console.log(`wrote ${target}`);
  if (failed > 0) process.exitCode = 1;
}

main().catch((e) => {
  console.error('generator failed:', e?.message || e);
  process.exit(1);
});
