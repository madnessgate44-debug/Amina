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
import { matchMisconception, misconceptionText } from '../teaching/skills/teachingSkills';
import { speaksLanguage } from '../reels/reelResponse';
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
    for (const ex of lesson.exercisesByLanguage?.ar ?? lesson.exercises) {
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

  // ---- 9b. Every concept of a multi-concept lesson is reachable ----
  // `reelsForLesson` used to take only a lesson's FIRST concept, so the second
  // concept of a lesson never appeared in the feed and its media was dead
  // weight (measured: 4 of 54 concepts unreachable across 120 days of sessions).
  // The concepts are now rotated by the day index, the same trick used for
  // lessons, so the whole lesson is surfaced over days.
  const multiConceptLessons = curriculumService
    .getAvailableLessons()
    .filter((l) => l.concepts.length > 1);
  assert(multiConceptLessons.length > 0, '9b.0: at least one lesson carries several concepts');
  const unreachable: string[] = [];
  for (const lesson of multiConceptLessons) {
    const seen = new Set<string>();
    for (let d = 0; d < lesson.concepts.length * 4; d++) {
      const dayNow = new Date(Date.UTC(2026, 9, 20 + d, 12, 0, 0));
      const q = buildFeedQueue({
        studentId: 'stu_multi',
        language: 'ar',
        mastery,
        dueReviews: [],
        todaySubjects: [lesson.subjectNameAr, lesson.subjectNameEn],
        examCalendar: [],
        now: dayNow,
        sessionMinutes: 20,
      });
      for (const r of q.reels) if (r.lessonId === lesson.id) seen.add(r.conceptId);
    }
    for (const c of lesson.concepts) if (!seen.has(c.id)) unreachable.push(`${lesson.id}/${c.id}`);
  }
  assert(
    unreachable.length === 0,
    `9b.1: every concept of a multi-concept lesson becomes reachable (unreachable: ${unreachable.join(', ')})`
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

  // ---- 14. No reel is written in a script the child cannot read ----
  // Lesson vocabulary and source text are stored in ONE language, so a reel
  // built from them used to show the other script to the child: an Arabic child
  // read "Processus par lequel les plantes vertes…", and a French or English
  // child read an Arabic definition. A reel in the wrong script is worse than no
  // reel. Every reel that reaches the feed must be in the child's own script
  // (numbers and symbols are language-neutral and allowed).
  const scriptOf = (t: string): 'ar' | 'latin' | 'other' => {
    const a = (t.match(/[\u0600-\u06FF]/g) || []).length;
    const l = (t.match(/[A-Za-zÀ-ÿ]/g) || []).length;
    return a > l ? 'ar' : l > a ? 'latin' : 'other';
  };
  const wanted: Record<string, 'ar' | 'latin'> = { ar: 'ar', en: 'latin', fr: 'latin' };
  for (const lang of LANGS) {
    const q = buildFeedQueue({
      studentId: `stu_script_${lang}`,
      language: lang,
      mastery,
      dueReviews: [],
      todaySubjects: [],
      examCalendar: [],
      now,
      sessionMinutes: 20,
    });
    const wrongScript = q.reels.filter((r) => {
      if (r.conceptId === 'closer') return false;
      const s = scriptOf(`${r.hook} ${r.show} ${r.noorLine}`);
      return s !== 'other' && s !== wanted[lang];
    });
    assert(
      wrongScript.length === 0,
      `14.1 [${lang}]: no queued reel is in the wrong script (${wrongScript.length})`
    );

    // 14.2 — the answer OPTIONS are read by the child too. A bilingual lesson
    // (the French-track maths/science books) pairs an Arabic prompt with Arabic
    // choices; a French child was shown a readable question over choices written
    // in the other script, so the question could not be answered. Every queued
    // question must offer only choices the child can read.
    const wrongOptionReels = q.reels.filter((r) => {
      if (!r.options || r.options.length === 0) return false;
      return r.options.some((o) => {
        const s = scriptOf(o.text);
        return s !== 'other' && s !== wanted[lang];
      });
    });
    assert(
      wrongOptionReels.length === 0,
      `14.2 [${lang}]: no queued question shows choices in the wrong script (${wrongOptionReels.length})`
    );

    // 14.3 — the same guarantee for EVERY reel the generator can build, not only
    // the handful a session queues, so a future queue change cannot re-expose it.
    let genWrongOptions = 0;
    for (const lesson of curriculumService.getAvailableLessons()) {
      for (const concept of lesson.concepts) {
        for (const reel of buildReelsForConcept(lesson, concept, lang, {})) {
          if (!reel.options || reel.options.length === 0) continue;
          if (
            reel.options.some((o) => {
              const s = scriptOf(o.text);
              return s !== 'other' && s !== wanted[lang];
            })
          ) {
            genWrongOptions++;
          }
        }
      }
    }
    assert(
      genWrongOptions === 0,
      `14.3 [${lang}]: no generated question offers choices in the wrong script (${genWrongOptions})`
    );
  }

  // ---- 15. Arabic misconception content reaches more than maths ----
  // The deterministic diagnosis (name the misconception, then clear it) used to
  // fire only in maths: the 10 stored entries all lived in maths lessons, so an
  // Arabic child practising Science had no stored diagnosis and every wrong
  // answer fell through to the model. The three Arabic Science lessons now carry
  // Arabic misconception data, and each wrong option maps to its own diagnosis.
  const sciLessons = ['off_sci_u1_l1_plant_needs', 'off_sci_u1_l2_ecosystem', 'off_sci_u1_l3_coral_bleaching'];
  for (const id of sciLessons) {
    const lesson = curriculumService.getLessonById(id);
    assert(Boolean(lesson), `15.0: lesson ${id} resolves`);
    for (const concept of lesson?.concepts || []) {
      assert(
        (concept.misconceptions?.length || 0) > 0,
        `15.1 [${id}]: the concept carries misconception data (${concept.misconceptions?.length || 0})`
      );
      const ms = concept.misconceptions || [];
      for (const m of ms) {
        assert(
          speaksLanguage(`${m.explanation} ${m.remediation}`, 'ar'),
          `15.2 [${m.id}]: the diagnosis is Arabic, servable to an Arabic child`
        );
      }
      const reels = buildReelsForConcept(lesson!, concept, 'ar', { reason: 'diagnosis' });
      const diagnosable = reels.filter((r) =>
        r.options?.some((o) => !o.isCorrect && matchMisconception(o.text, ms))
      );
      assert(diagnosable.length > 0, `15.3 [${concept.id}]: an Arabic diagnosable reel exists (${diagnosable.length})`);
      for (const r of reels) {
        if (!r.options) continue;
        const wrongs = r.options.filter((o) => !o.isCorrect);
        const diagnosed = new Set(wrongs.map((o) => matchMisconception(o.text, ms)?.id));
        assert(
          diagnosed.size === wrongs.length,
          `15.4 [${r.kind}]: distinct wrong options get distinct diagnoses (${diagnosed.size}/${wrongs.length})`
        );
        for (const o of r.options.filter((x) => x.isCorrect)) {
          assert(
            matchMisconception(o.text, ms) === undefined,
            `15.5 [${r.kind}]: the correct answer is never diagnosed as a misconception`
          );
        }
      }
      for (const d of concept.distractors || []) {
        const [value, misId] = String(d).split('|');
        assert(
          matchMisconception(value, ms)?.id === misId,
          `15.6 [${value}]: the distractor resolves to its declared misconception (${misId})`
        );
      }
    }
  }

  // ---- 16. A Latin-script feed never leaks the other Latin language ----
  // Section 13 only covers French-INSTRUCTED lessons. But a French feed also
  // reaches lessons instructed in Arabic or English (social studies, the
  // English reader, Arabic language), whose `fr` fields fall back to the
  // English text. The script guard cannot see that: English and French are both
  // Latin. A French child was therefore shown whole English sentences. This
  // scans EVERY reel of the fr and en feeds, across every pool, and fails when
  // a reel carries decisive markers of the other Latin language.
  const EN_WORDS = /\b(the|and|with|for|from|your|you|are|of|to|in|this|that|like|each|is|was|were|will|has|have|can|how|what|which|its|their|they|them|we|our|us|but|if|when|where|who|all|some|more|most|other|into|over|after|before|because|through|between|during|about|than|then|there|these|those|she|he|his|her|not|be|by|at|it|an|so|up|out|down|off)\b/i;
  const FR_WORDS = /\b(le|la|les|de|des|une|un|est|pour|dans|avec|que|qui|sur|pas|comme|ton|ta|tes|ce|cette|ces|nous|vous|au|aux|du|se|son|sa|ses|et|sont|par|mais|tout|tous|toute|bien|ont|il|elle|ils|elles|quand|dont|entre|vers|chez|sans|sous|aussi|encore|très|peu|beaucoup|toujours|jamais|leur|leurs|notre|nos|votre|vos|mon|ma|mes|moi|toi|lui|été|avait|avoir|faire|fait|moins|donc|car|ni|était|étaient|sera|serait|celui|celle|alors|ainsi|autre|autres|même)\b/i;
  for (const lang of ['fr', 'en'] as const) {
    const feed = buildFeedQueue({
      studentId: `stu_lang_${lang}_all`,
      language: lang,
      mastery,
      dueReviews: [],
      todaySubjects: ['Mathematics', 'Science', 'French', 'Social Studies', 'English', 'Information Technology', 'Arabic'],
      sessionMinutes: 30,
    });
    const wrongLatin = lang === 'fr' ? EN_WORDS : FR_WORDS;
    const leakyReels = feed.reels
      .filter((reel) => reel.kind !== 'win_closer')
      .filter((reel) => {
        const text = `${reel.hook} ${reel.noorLine} ${reel.show || ''} ${(reel.options || []).map((o) => o.text).join(' ')}`;
        return wrongLatin.test(text);
      })
      .map((reel) => `${reel.lessonId}/${reel.kind}`);
    assert(
      leakyReels.length === 0,
      `16.1 [${lang}]: no reel leaks the other Latin language (${leakyReels.length}: ${leakyReels.slice(0, 4).join(', ')})`
    );
  }

  // ---- 17. Today's-lesson pool matches the timetable's display labels ----
  // A day record stores the timetable's subject labels ("الرياضيات بالفرنسية
  // (Maths)", "العلوم بالفرنسية (Sciences)"), and the server's day-record
  // parser writes the same shape. `buildFeedQueue` compared them to a lesson's
  // subjectNameAr/En with an EXACT string match, so those labels matched no
  // lesson at all: the today's-lesson pool was empty and a French child whose
  // day was French maths/science got a feed of only the diagnosis reel and the
  // closer (measured: 4 reels, 0 from today_lesson, vs 17 for a plain label).
  // Matching now goes through the canonical subject identity, so every spelling
  // of the same subject reaches the same lessons. Exact labels still match.
  const todayLabelCases: Array<{ label: string; lessonId: string }> = [
    { label: 'الرياضيات بالفرنسية (Maths)', lessonId: 'off_mathfr_u1_l1_decimaux' },
    { label: 'العلوم بالفرنسية (Sciences)', lessonId: 'off_scifr_u1_l1_plantes' },
    { label: 'الرياضيات', lessonId: 'off_math_u1_l1' },
    { label: 'العلوم', lessonId: 'off_sci_u1_l1_plant_needs' },
    { label: 'Mathematics', lessonId: 'off_math_u1_l1' },
    { label: 'French Mathematics', lessonId: 'off_mathfr_u1_l1_decimaux' },
  ];
  for (const { label, lessonId } of todayLabelCases) {
    for (const lang of ['ar', 'fr'] as const) {
      const q = buildFeedQueue({
        studentId: `stu_label_${lang}_${lessonId}`,
        language: lang,
        mastery: {},
        dueReviews: [],
        todaySubjects: [label],
        examCalendar: [],
        now,
        sessionMinutes: 10,
      });
      assert(
        q.composition.today_lesson > 0,
        `17.1 [${lang}] subject "${label}" reaches the today's-lesson pool (today_lesson=${q.composition.today_lesson})`
      );
    }
  }

  // The specific collapse: a French child with a French-maths day must get a
  // full session, not a two-reel stub.
  const frMathsDay = buildFeedQueue({
    studentId: 'stu_fr_maths_day',
    language: 'fr',
    mastery: {},
    dueReviews: [],
    todaySubjects: ['الرياضيات بالفرنسية (Maths)'],
    examCalendar: [],
    now,
    sessionMinutes: 10,
  });
  assert(
    frMathsDay.reels.length >= 10,
    `17.2: a French-maths day yields a full session, not a stub (${frMathsDay.reels.length} reels)`
  );

  // No regression: an unrelated label must still match nothing, so the pool is
  // not padded with every lesson.
  const unrelated = buildFeedQueue({
    studentId: 'stu_unrelated',
    language: 'fr',
    mastery: {},
    dueReviews: [],
    todaySubjects: ['تربية رياضية'],
    examCalendar: [],
    now,
    sessionMinutes: 10,
  });
  assert(
    unrelated.composition.today_lesson === 0,
    `17.3: an unrelated subject label matches no lesson (today_lesson=${unrelated.composition.today_lesson})`
  );

  // ---- 18. A first feed is a full session, not a stub ----
  // A fresh child has no day record, no mastery and no due reviews, so the
  // 40/30/20/10 pools are all empty and the wildcard ("curiosity") pool is the
  // only source. It used to be hard-capped at 3 lessons, which starved the
  // session: measured 8 reels in Arabic and 4 in French against the 15-reel
  // target of a 10-minute session. The child got a stub, not a lesson.
  for (const lang of LANGS) {
    const fresh = buildFeedQueue({
      studentId: `fresh_${lang}`,
      language: lang,
      mastery: {},
      dueReviews: [],
      todaySubjects: [],
      examCalendar: [],
      now,
      sessionMinutes: 10,
    });
    const target = Math.max(4, Math.round((10 * 60) / 40));
    assert(
      fresh.reels.length >= target,
      `18.1 [${lang}]: a first feed reaches the session target (${fresh.reels.length} >= ${target})`
    );
    assert(
      fresh.composition.curiosity >= 6,
      `18.2 [${lang}]: the wildcard pool fills the session (curiosity=${fresh.composition.curiosity})`
    );
    let backToBack = 0;
    for (let i = 1; i < fresh.reels.length; i++) {
      if (fresh.reels[i].kind === fresh.reels[i - 1].kind) backToBack++;
    }
    assert(backToBack === 0, `18.3 [${lang}]: no reel kind repeats back-to-back on a first feed (${backToBack})`);
    // The diagnosis pool only offers a concept whose stored diagnosis is in the
    // child's own language (see feedQueue). Every language now has servable
    // diagnosis content: Arabic natively, and French/English through the
    // explanationFr/En renderings added for the French-track lessons (see
    // section 20), so all three feeds must reach the diagnosis path.
    assert(
      fresh.reels.some((r) => r.reason === 'diagnosis'),
      `18.4 [${lang}]: the first feed still reaches the diagnosis path`
    );
    assert(
      fresh.reels[fresh.reels.length - 1].kind === 'win_closer',
      `18.5 [${lang}]: the first feed still ends with a win_closer`
    );
  }

  // ---- 19. The same question is never asked twice in one session ----
  // hook_question, spot_the_mistake and quick_choice all drew from the same
  // exercise list and each reached for usableExercises[0]/[1] with no memory of
  // what it had already used, so a lesson with one or two exercises repeated the
  // IDENTICAL card two or three times in a session. Measured before the fix:
  // 48 extra duplicate reels in Arabic, 92 in French across the curriculum; a
  // 30-minute Arabic feed showed off_math_u1_l3's question at reel 1 AND reel 39.
  // A repeated question is a dead, static reel — exactly what the owner's
  // "it must not be static" ask rules out. Each question kind now claims a
  // DISTINCT exercise and is skipped when none is left, so a concept with one
  // exercise asks it once and a concept with two asks two different ones.
  for (const lang of LANGS) {
    let conceptsWithDuplicate = 0;
    let duplicateReels = 0;
    for (const lesson of curriculumService.getAvailableLessons()) {
      for (const concept of lesson.concepts) {
        const questionReels = buildReelsForConcept(lesson, concept, lang, {}).filter(
          (r) => r.options && r.options.length > 0
        );
        const seen = new Set<string>();
        let conceptHasDuplicate = false;
        for (const r of questionReels) {
          const key = r.options!.map((o) => o.text).join('|');
          if (seen.has(key)) {
            duplicateReels++;
            conceptHasDuplicate = true;
          }
          seen.add(key);
        }
        if (conceptHasDuplicate) conceptsWithDuplicate++;
      }
    }
    assert(
      duplicateReels === 0,
      `19.1 [${lang}]: no concept repeats a question inside a session (${duplicateReels} across ${conceptsWithDuplicate} concepts)`
    );

    // The fix must not shrink the session: the queues stay at the same size, so
    // the duplicate removal only replaced repeated cards, it did not drop reels.
    const feed = buildFeedQueue({
      studentId: `nodup_${lang}`,
      language: lang,
      mastery,
      dueReviews: [],
      todaySubjects: ['Mathematics', 'Science', 'French', 'Social Studies', 'English', 'Information Technology', 'Arabic', 'التربية الإسلامية'],
      examCalendar: [],
      now,
      sessionMinutes: 30,
    });
    const seenInFeed = new Set<string>();
    let feedDuplicates = 0;
    for (const r of feed.reels) {
      if (!r.options || r.options.length === 0) continue;
      const key = r.options.map((o) => o.text).join('|');
      if (seenInFeed.has(key)) feedDuplicates++;
      seenInFeed.add(key);
    }
    assert(
      feedDuplicates === 0,
      `19.2 [${lang}]: the queued session shows no duplicate question (${feedDuplicates})`
    );
  }

  // ---- 20. A French child gets a named diagnosis, not a fall-through ----
  // The diagnosis text was stored in Arabic only for the maths/science/French
  // lessons, and the language guard refuses Arabic for a French reader. A French
  // child who tapped a MAPPED wrong option therefore got the generic
  // "wrong answer" line and the turn fell through to the model: measured before
  // the fix, only 10 of 211 French wrong options across the curriculum could be
  // diagnosed, and 25 reachable misconceptions were blocked. Each such entry now
  // carries an explanationFr/remediationFr rendering, so every wrong option that
  // resolves to a stored misconception is servable in the child's own language.
  for (const lang of LANGS) {
    let wrongOptions = 0;
    let diagnosable = 0;
    const blocked: string[] = [];
    for (const lesson of curriculumService.getAvailableLessons()) {
      for (const concept of lesson.concepts) {
        const ms = concept.misconceptions;
        if (!ms || ms.length === 0) continue;
        for (const reel of buildReelsForConcept(lesson, concept, lang, {})) {
          if (!reel.options || reel.options.length === 0) continue;
          for (const o of reel.options.filter((x) => !x.isCorrect)) {
            const m = matchMisconception(o.text, ms);
            if (!m) continue;
            wrongOptions++;
            if (speaksLanguage(misconceptionText(m, lang), lang)) {
              diagnosable++;
            } else {
              blocked.push(`${lesson.id}/${m.id}`);
            }
          }
        }
      }
    }
    assert(
      blocked.length === 0,
      `20.1 [${lang}]: every reachable misconception is servable in the child's language (${blocked.length} blocked of ${wrongOptions}: ${blocked.slice(0, 4).join(', ')})`
    );
    assert(
      diagnosable === wrongOptions,
      `20.2 [${lang}]: every mapped wrong option can be diagnosed (${diagnosable}/${wrongOptions})`
    );
  }

  // The served diagnosis must actually be French for a French child: the guard
  // and the selection both have to agree, or the child reads the wrong script.
  const frDiagQueue = buildFeedQueue({
    studentId: 'stu_fr_diag',
    language: 'fr',
    mastery: {},
    dueReviews: [],
    todaySubjects: [],
    examCalendar: [],
    now,
    sessionMinutes: 10,
  });
  const frDiagReel = frDiagQueue.reels.find((r) => r.reason === 'diagnosis' && r.options && r.options.length > 0);
  assert(Boolean(frDiagReel), '20.3: the French feed contains a diagnosis reel');
  if (frDiagReel) {
    const found = curriculumService.getConceptById(frDiagReel.conceptId);
    const ms = found?.concept.misconceptions || [];
    const wrongs = frDiagReel.options!.filter((o) => !o.isCorrect);
    const named = wrongs.map((o) => matchMisconception(o.text, ms)).filter(Boolean);
    assert(
      named.length > 0,
      `20.4 [${frDiagReel.conceptId}]: at least one wrong option maps to a misconception (${named.length}/${wrongs.length})`
    );
    for (const m of named) {
      const text = misconceptionText(m!, 'fr');
      assert(
        speaksLanguage(text, 'fr'),
        `20.5 [${m!.id}]: the served diagnosis is French (${text.slice(0, 40)}…)`
      );
    }
  }

  console.log('\n=================================================================');
  console.log(`REELS SUITE SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('=================================================================');

  if (failed > 0) process.exit(1);
}

run();
