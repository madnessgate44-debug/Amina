/**
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
 * The `noorPreGeneratedLines` test fails if a lesson is missing a line, so this
 * file cannot silently fall behind the curriculum.
 *
 * Key format: `${language}:${lessonId}:${conceptIndex}`.
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

export const PRE_GENERATED_NOOR_LINES: Record<string, PreGeneratedNoorLines> = {
  "ar:off_ar_u3_l1_dr_magdi_yacoub:0": {
    "intro": "أهلاً بك يا بطل! النهارده هنسمع سوا حوار دكتور مجدي يعقوب، وهنتعلم إزاي نجاحنا وتفوقنا بيخلينا نرد الجميل لبلدنا مصر ونسعد كل إنسان محتاج. جاهز نبدأ رحلتنا سوا؟",
    "explanation": "حبنا الحقيقي لبلدنا مصر بيظهر لما ننجح ونرد جميلها علينا ونخفف التعب عن الناس، بالظبط زي ما عمل دكتور مجدي يعقوب. وشطارتك وتفوقك في دراستك دلوقتي هما أول خطوة عشان لما تكبري تبقي طبيبة أو مهندسة تبتكري حلول تسعد أطفال بلدنا وتخدمهم. الإنسان الأصيل عامل زي الشجرة اللي كبرت في حديقة بيتها، وأول ما طرحت ثمار حلوة، قدّمتها لأهلها اللي رعوها وسقوها من البداية.",
    "check": "أهلاً بيك يا شاطر! شُفنا مع بعض إزاي دكتور مجدي يعقوب رجع لمصر علشان يرد جميل وطنه ويسعد الناس المتألمة. تفتكر بقى، إزاي تفوقك وشطارتك في مدرستك دلوقتي ممكن يكونوا طريقتك لخدمة بلدك وأهلها لما تكبر؟"
  }
};

export function preGeneratedKey(
  language: string,
  lessonId: string,
  conceptIndex: number
): string {
  return `${language}:${lessonId}:${conceptIndex}`;
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
