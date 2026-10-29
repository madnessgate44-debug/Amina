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
import { DEFAULT_TEXT_MODELS } from '../src/services/ai/geminiModel.js';
import type { OfficialCurriculumLesson, CurriculumLessonConcept } from '../src/types/teachingSession.js';

const apiKey = process.env.GEMINI_API_KEY || process.env.OHGeminiAPI;
if (!apiKey) {
  console.error('BLOCKED: set GEMINI_API_KEY (or OHGeminiAPI) to generate lines.');
  process.exit(1);
}
const ai = new GoogleGenAI({ apiKey });
const force = process.argv.includes('--force');

/** The three fixed slots, with the instruction that produces each one. */
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

async function generate(slot: string, instruction: string, text: string, conceptTitle: string): Promise<string> {
  const systemInstruction = `
You are "مس نور" (Miss Noor), a warm, patient, world-class Grade-5 teacher in Egypt, speaking to a 10-11 year old.
Speak natural, warm Egyptian Arabic. Never claim to be human.

CURRICULUM (ground every word in this; never invent facts):
"""${text.slice(0, 1400)}"""

YOUR TASK: ${instruction}

RULES:
1. Stay strictly on the concept "${conceptTitle}".
2. Be concrete and warm. Never use generic boilerplate.
3. 2 to 4 short sentences. It will be read aloud, so keep it smooth.
`.trim();

  let lastError: unknown;
  // The free tier is rate limited per model per minute, so a burst of calls gets
  // 429s. Retry with backoff before giving up on a slot.
  for (let attempt = 0; attempt < 4; attempt++) {
    if (attempt > 0) await sleep(2000 * Math.pow(2, attempt));
    for (const model of DEFAULT_TEXT_MODELS) {
      try {
        const r = await ai.models.generateContent({
          model,
          contents: [{ role: 'user', parts: [{ text: 'اكتب النص المطلوب الآن.' }] }],
          config: { systemInstruction, temperature: 0.6 },
        });
        const out = (r.text || '').trim();
        if (out) return out;
      } catch (err) {
        lastError = err;
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
    const entry = { intro: '', explanation: '', check: '' };
    for (const { slot, instruction } of SLOTS) {
      try {
        entry[slot] = await generate(slot, instruction, job.text, job.conceptTitle);
      } catch {
        failed++;
      }
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
