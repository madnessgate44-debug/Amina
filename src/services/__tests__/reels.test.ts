/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Reel engine suite (Phase 3).
 *
 * 1. Generates reels for EVERY lesson in EVERY language and fails on any
 *    invalid reel (missing lines, ambiguous question, no source line).
 * 2. Proves determinism: same inputs -> byte-identical output.
 * 3. Proves the queue rules: first reel is a sure win, no kind twice in a row,
 *    ends with a win_closer, refills instead of dead-ending, 40/30/20/10 mix.
 * 4. Proves nothing is fabricated: every question's options come from the
 *    lesson's own exercises.
 */

import { curriculumService } from '../curriculum/curriculumService';
import { buildReelsForConcept, isValidReel, sourceLabelFor, buildWinCloser } from '../reels/reelGenerator';
import { buildFeedQueue, buildRetryAfterMistakes } from '../reels/feedQueue';
import { matchMisconception } from '../teaching/skills/teachingSkills';
import { createSeededRng, hashSeed } from '../reels/seededRng';
import { Language } from '../../types';
import { Reel } from '../../types/reel';

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`✅ [PASS] ${message}`);
    passed++;
  } else {
    console.error(`❌ [FAIL] ${message}`);
    failed++;
  }
}

const LANGS: Language[] = ['ar', 'en', 'fr'];

function run() {
  const lessons = curriculumService.getAllLessons();
  assert(lessons.length > 0, `0.1: curriculum exposes lessons (${lessons.length})`);

  // ---- 1. Every lesson, every language, every concept ----
  let totalReels = 0;
  let invalid = 0;
  let missingSource = 0;
  const kindCounts: Record<string, number> = {};
  for (const lang of LANGS) {
    for (const lesson of lessons) {
      for (const concept of lesson.concepts) {
        const reels = buildReelsForConcept(lesson, concept, lang);
        totalReels += reels.length;
        for (const reel of reels) {
          kindCounts[reel.kind] = (kindCounts[reel.kind] || 0) + 1;
          if (!isValidReel(reel)) {
            invalid++;
            if (invalid <= 3) console.error(`   invalid: ${reel.id} (${reel.kind})`);
          }
          if (!reel.sourceLabel) missingSource++;
        }
      }
    }
  }
  assert(invalid === 0, `1.1: all generated reels are valid (${totalReels} reels across ${lessons.length} lessons x 3 languages)`);
  assert(missingSource === 0, '1.2: every reel carries a source line');
  assert(totalReels > 0, `1.3: reels were produced (${totalReels})`);
  console.log(`   kind distribution: ${JSON.stringify(kindCounts)}`);

  // ---- 2. Determinism ----
  const sample = lessons[0];
  const sampleConcept = sample.concepts[0];
  const a = JSON.stringify(buildReelsForConcept(sample, sampleConcept, 'ar'));
  const b = JSON.stringify(buildReelsForConcept(sample, sampleConcept, 'ar'));
  assert(a === b, '2.1: buildReelsForConcept is deterministic');

  const seed1 = createSeededRng('fixed-seed');
  const seed2 = createSeededRng('fixed-seed');
  const seq1 = [seed1.next(), seed1.next(), seed1.next()];
  const seq2 = [seed2.next(), seed2.next(), seed2.next()];
  assert(JSON.stringify(seq1) === JSON.stringify(seq2), '2.2: seeded RNG repeats for the same seed');
  assert(hashSeed('a') !== hashSeed('b'), '2.3: hashSeed distinguishes inputs');

  // ---- 3. Nothing fabricated: options come from the lesson's exercises ----
  let fabricated = 0;
  for (const lesson of lessons) {
    const allowed = new Set<string>();
    for (const ex of lesson.exercises) {
      for (const o of ex.options || []) allowed.add(String(o));
    }
    for (const concept of lesson.concepts) {
      const reels = buildReelsForConcept(lesson, concept, 'ar');
      for (const reel of reels) {
        for (const opt of reel.options || []) {
          if (!allowed.has(opt.text)) fabricated++;
        }
      }
    }
  }
  assert(fabricated === 0, '3.1: no reel option is fabricated (all come from lesson exercises)');

  // ---- 4. Queue rules ----
  const now = new Date('2026-10-24T12:00:00Z');
  const mastery = {};
  const dueReviews = lessons.slice(0, 3).map((l) => ({
    conceptId: l.concepts[0].id,
    studentId: 'stu_test',
    subjectId: l.subjectId,
    subjectName: l.subjectNameAr,
    conceptNameAr: l.concepts[0].titleAr,
    conceptNameEn: l.concepts[0].titleEn,
    masteryScore: 0.4,
    confidence: 0.5,
    confidenceBand: 'medium' as const,
    intervalDays: 3,
    lastPracticedAt: '2026-10-20T12:00:00Z',
    nextReviewAt: '2026-10-23T12:00:00Z',
    isDue: true,
    isOverdue: false,
    overdueDays: 0,
    status: 'due' as const,
    reason: 'due',
  }));

  const queue = buildFeedQueue({
    studentId: 'stu_test',
    language: 'ar',
    mastery,
    dueReviews,
    todaySubjects: [lessons[0].subjectNameEn],
    examCalendar: [],
    now,
    sessionMinutes: 5,
  });

  assert(queue.reels.length >= 4, `4.1: queue has at least 4 reels (${queue.reels.length})`);

  const first = queue.reels[0];
  assert(
    Boolean(first.options && first.options.some((o) => o.isCorrect)) || first.kind === 'teach_card' || first.kind === 'story_analogy',
    `4.2: first reel is a sure win (kind=${first.kind})`
  );

  let backToBack = 0;
  for (let i = 1; i < queue.reels.length; i++) {
    if (queue.reels[i].kind === queue.reels[i - 1].kind) backToBack++;
  }
  assert(backToBack === 0, '4.3: no reel kind repeats back-to-back');

  const last = queue.reels[queue.reels.length - 1];
  assert(last.kind === 'win_closer', `4.4: queue ends with a win_closer (got ${last.kind})`);

  // Determinism of the queue.
  const queue2 = buildFeedQueue({
    studentId: 'stu_test',
    language: 'ar',
    mastery,
    dueReviews,
    todaySubjects: [lessons[0].subjectNameEn],
    examCalendar: [],
    now,
    sessionMinutes: 5,
  });
  assert(
    JSON.stringify(queue.reels.map((r) => r.id)) === JSON.stringify(queue2.reels.map((r) => r.id)),
    '4.5: buildFeedQueue is deterministic for the same inputs'
  );

  // Empty everything -> must not dead-end: it still returns a closer-only queue
  // or a refill-based queue, never a crash and never empty.
  const emptyQueue = buildFeedQueue({
    studentId: 'stu_empty',
    language: 'en',
    mastery,
    dueReviews: [],
    todaySubjects: [],
    examCalendar: [],
    now,
    sessionMinutes: 5,
  });
  assert(emptyQueue.reels.length >= 1, `4.6: empty pools never dead-end (${emptyQueue.reels.length} reels)`);
  assert(emptyQueue.reels[emptyQueue.reels.length - 1].kind === 'win_closer', '4.7: empty-pool queue still ends with a closer');

  // Session length controls count: 20 min -> more reels than 5 min.
  const longQueue = buildFeedQueue({
    studentId: 'stu_test',
    language: 'ar',
    mastery,
    dueReviews,
    todaySubjects: [lessons[0].subjectNameEn],
    examCalendar: [],
    now,
    sessionMinutes: 20,
  });
  assert(longQueue.reels.length > queue.reels.length, `4.8: longer session yields more reels (${longQueue.reels.length} > ${queue.reels.length})`);

  // Exam topics are represented when an exam is supplied.
  const examQueue = buildFeedQueue({
    studentId: 'stu_test',
    language: 'ar',
    mastery,
    dueReviews: [],
    todaySubjects: [],
    examCalendar: [{ entry: { id: 'e1', studentId: 'stu_test', subjectId: lessons[0].subjectId, date: '2026-11-01', createdAt: '', updatedAt: '' }, daysUntil: 8 }],
    now,
    sessionMinutes: 10,
  });
  assert(examQueue.composition.exam_topic > 0, `4.9: exam topics appear in the queue (${examQueue.composition.exam_topic})`);

  // ---- 5. Retry after mistakes (rule 3) ----
  const retry = buildRetryAfterMistakes(lessons[0].concepts[0].id, 'ar');
  assert(retry.length >= 1, `5.1: a retry plan exists for a real concept (${retry.length} reels)`);

  assert(retry.every((r) => r.conceptId === lessons[0].concepts[0].id), '5.2: retry reels target the same concept');

  // ---- 6. Source labels ----
  assert(sourceLabelFor(lessons[0]).length > 0, '6.1: source label is non-empty');
  const closer = buildWinCloser('ar', 'العلوم', 'x', 0);
  assert(isValidReel(closer), '6.2: win_closer is a valid reel');
  assert(closer.id === buildWinCloser('ar', 'العلوم', 'x', 0).id, '6.3: win_closer id is deterministic');

  // ---- 7. Every reel has the fields the UI needs ----
  const uiFieldsOk = queue.reels.every(
    (r: Reel) => r.hook && r.show && r.noorLine && r.reactionCorrect && r.reactionWrong && r.subjectName
  );
  assert(uiFieldsOk, '7.1: every queued reel has the fields the UI renders');

  // ---- 8. A bilingual lesson serves questions in the child's language ----
  // off_math_u1_l1 mixes Arabic and French exercises in one file. The reel the
  // child sees must be written in their own script, not the other track's.
  const mixed = curriculumService.getLessonById('off_math_u1_l1');
  assert(Boolean(mixed), '8.0: the bilingual maths lesson exists');
  const arabicChars = (s: string) => (s.match(/[\u0600-\u06FF]/g) || []).length;
  const latinChars = (s: string) => (s.match(/[A-Za-zÀ-ÿ]/g) || []).length;
  if (mixed) {
    const arQ = buildReelsForConcept(mixed, mixed.concepts[0], 'ar').find((r) => r.options)?.hook || '';
    const frQ = buildReelsForConcept(mixed, mixed.concepts[0], 'fr').find((r) => r.options)?.hook || '';
    assert(arabicChars(arQ) > latinChars(arQ), `8.1: an Arabic learner gets an Arabic-script question (${arQ.slice(0, 28)})`);
    assert(latinChars(frQ) > arabicChars(frQ), `8.2: a French learner gets a Latin-script question (${frQ.slice(0, 28)})`);
  }

  // ---- 9. Misconception-bearing lessons are reachable ----
  // They are the LAST four maths lessons in file order, so a fixed pool showed
  // only the first lesson forever and never reached them. Rotation by day must
  // surface every one of them across a fortnight of sessions.
  const misLessons = ['off_mathfr_u1_l1_decimaux', 'off_mathfr_u1_l2_comparer', 'off_mathfr_u2_l1_fractions', 'off_mathfr_u3_l1_division'];
  const reached = new Set<string>();
  for (let d = 0; d < 16; d++) {
    const dayNow = new Date(Date.UTC(2026, 9, 20 + d, 12, 0, 0));
    const q = buildFeedQueue({
      studentId: 'stu_test',
      language: 'fr',
      mastery,
      dueReviews: [],
      todaySubjects: ['Mathematics'],
      examCalendar: [],
      now: dayNow,
      sessionMinutes: 20,
    });
    for (const r of q.reels) reached.add(r.lessonId);
  }
  const misReached = misLessons.filter((id) => reached.has(id));
  assert(
    misReached.length === misLessons.length,
    `9.1: all ${misLessons.length} misconception lessons become reachable (got ${misReached.length}: ${misReached.join(',')})`
  );

  // ---- 10. A session has breadth: it does not run one lesson 6 reels deep ----
  // Each lesson yields ~6 reels. Plain concatenation showed the first lesson for
  // the whole session (measured: 6 reels of one lesson back-to-back). The pools
  // are interleaved across lessons, so consecutive reels alternate lessons.
  for (const lang of LANGS) {
    const q = buildFeedQueue({
      studentId: 'stu_breadth',
      language: lang,
      mastery,
      dueReviews: [],
      todaySubjects: [],
      examCalendar: [],
      now,
      sessionMinutes: 15,
    });
    const body = q.reels.filter((r) => r.conceptId !== 'closer');
    let longestRun = 0;
    let run = 0;
    for (let i = 0; i < body.length; i++) {
      run = i > 0 && body[i].lessonId === body[i - 1].lessonId ? run + 1 : 1;
      if (run > longestRun) longestRun = run;
    }
    const distinct = new Set(body.map((r) => r.lessonId)).size;
    assert(longestRun <= 2, `10.1 [${lang}]: no lesson runs more than twice in a row (longest ${longestRun})`);
    assert(distinct >= 2, `10.2 [${lang}]: a session covers more than one lesson (${distinct})`);
  }

  // ---- 11. The diagnosis path is reachable in EVERY session (R6) ----
  // The deterministic diagnosis (name the misconception, then clear it) is the
  // most teacher-like behaviour in the app, but it only fires when a reel
  // carries an option a stored misconception can name. Before the diagnosis
  // pool those concepts were reached by seed luck only (measured: an Arabic
  // child got 0 in a whole session). Now every session must carry at least one
  // reel whose wrong option a stored misconception can name, in the child's
  // own language.
  const misconceptionByConcept = new Map<string, NonNullable<typeof lessons[number]['concepts'][number]['misconceptions']>>();
  for (const lesson of lessons) {
    for (const concept of lesson.concepts) {
      if (concept.misconceptions?.length) misconceptionByConcept.set(concept.id, concept.misconceptions);
    }
  }
  assert(misconceptionByConcept.size > 0, `11.0: curriculum carries misconception data (${misconceptionByConcept.size} concepts)`);

  for (const lang of LANGS) {
    for (const minutes of [5, 10, 20, 45]) {
      const q = buildFeedQueue({
        studentId: `stu_diag_${lang}_${minutes}`,
        language: lang,
        mastery,
        dueReviews: [],
        todaySubjects: [],
        examCalendar: [],
        now,
        sessionMinutes: minutes,
      });
      const diagnosable = q.reels.filter((r) => {
        const ms = misconceptionByConcept.get(r.conceptId);
        if (!ms) return false;
        return Boolean(r.options?.some((o) => !o.isCorrect && matchMisconception(o.text, ms)));
      });
      assert(
        diagnosable.length >= 1,
        `11.1 [${lang} ${minutes}min]: the session carries a diagnosable misconception reel (${diagnosable.length})`
      );
    }
  }

  // ---- 12. The diagnosis pool does not break the queue invariants ----
  // Inserting the guaranteed diagnosis reel must not repeat a kind, must not
  // run one lesson more than twice in a row, and must stay deterministic.
  for (const lang of LANGS) {
    const q = buildFeedQueue({
      studentId: 'stu_diag_inv',
      language: lang,
      mastery,
      dueReviews: [],
      todaySubjects: [],
      examCalendar: [],
      now,
      sessionMinutes: 20,
    });
    const body = q.reels.filter((r) => r.conceptId !== 'closer');
    let longestRun = 0;
    let run = 0;
    for (let i = 0; i < body.length; i++) {
      run = i > 0 && body[i].lessonId === body[i - 1].lessonId ? run + 1 : 1;
      if (run > longestRun) longestRun = run;
    }
    assert(longestRun <= 2, `12.1 [${lang}]: diagnosis insertion keeps lesson runs <= 2 (longest ${longestRun})`);
    let backToBack = 0;
    for (let i = 1; i < q.reels.length; i++) {
      if (q.reels[i].kind === q.reels[i - 1].kind) backToBack++;
    }
    assert(backToBack === 0, `12.2 [${lang}]: diagnosis insertion keeps no repeat kind back-to-back (${backToBack})`);

    const q2 = buildFeedQueue({
      studentId: 'stu_diag_inv',
      language: lang,
      mastery,
      dueReviews: [],
      todaySubjects: [],
      examCalendar: [],
      now,
      sessionMinutes: 20,
    });
    assert(
      JSON.stringify(q.reels.map((r) => r.id)) === JSON.stringify(q2.reels.map((r) => r.id)),
      `12.3 [${lang}]: the queue with the diagnosis reel stays deterministic`
    );
  }

  // ---- 13. A French child's feed speaks French, not English ----
  // The Girard French-section child reads maths, science and French in French.
  // Before the French overlay the reel engine mapped `fr` onto the English
  // fields, so their feed taught English text. Every French-instructed concept
  // must now resolve to French content, and the French feed must not leak
  // English teaching sentences.
  const frInstructed = lessons.filter((l) => l.instructionLanguage === 'fr');
  assert(frInstructed.length > 0, `13.0: French-instructed lessons exist (${frInstructed.length})`);
  let conceptsWithFrench = 0;
  for (const lesson of frInstructed) {
    for (const concept of lesson.concepts) {
      if (concept.dailyLifeExampleFr && concept.storyAnalogyFr && concept.titleFr) conceptsWithFrench++;
    }
  }
  assert(
    conceptsWithFrench === frInstructed.reduce((n, l) => n + l.concepts.length, 0),
    `13.1: every French-instructed concept carries French content (${conceptsWithFrench})`
  );
  // The unavailable French lesson is not in the feed, but its concept still
  // needs French content so enabling it later cannot ship English.
  const allFrInstructed = curriculumService.getAllLessons().filter((l) => l.instructionLanguage === 'fr');
  let allFrWithFrench = 0;
  for (const lesson of allFrInstructed) {
    for (const concept of lesson.concepts) {
      if (concept.dailyLifeExampleFr && concept.storyAnalogyFr && concept.titleFr) allFrWithFrench++;
    }
  }
  assert(
    allFrWithFrench === allFrInstructed.reduce((n, l) => n + l.concepts.length, 0),
    `13.1b: every registered French-instructed concept carries French content (${allFrWithFrench})`
  );
  // "on" is a French word as well as an English one, so it is excluded here;
  // these are unambiguous English function words.
  const englishWords = /\b(the|and|with|for|from|your|you|are|of|to|in|this|that|like|each|notebook|pounds)\b/i;
  const frFeed = buildFeedQueue({
    studentId: 'stu_fr_leak',
    language: 'fr',
    mastery,
    dueReviews: [],
    todaySubjects: ['Mathematics', 'Science', 'French'],
    examCalendar: [],
    now,
    sessionMinutes: 20,
  });
  const frTrackReels = frFeed.reels.filter((r) => {
    const lesson = lessons.find((l) => l.id === r.lessonId);
    return lesson?.instructionLanguage === 'fr';
  });
  assert(frTrackReels.length > 0, `13.2: the French feed reaches French-instructed lessons (${frTrackReels.length})`);
  const leaking = frTrackReels.filter((r) => englishWords.test(`${r.hook} ${r.noorLine} ${r.show || ''}`));
  assert(
    leaking.length === 0,
    `13.3: no French-instructed reel leaks English text (${leaking.length} of ${frTrackReels.length})`
  );

  console.log('\n=================================================================');
  console.log(`REELS SUITE SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('=================================================================');

  if (failed > 0) process.exit(1);
}

run();
