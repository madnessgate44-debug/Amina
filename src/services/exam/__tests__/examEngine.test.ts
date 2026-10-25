/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Exam Engine v1 tests.
 *
 * These assert the engine's contract with real data: it plans from
 * parent-entered exams and official curriculum concepts only, ranks an
 * untouched concept above a partly-known one, never invents content, and
 * produces cards whose text is traceable to a source page.
 */

import { CurriculumService } from '../../curriculum/curriculumService';
import {
  buildExamPlan,
  buildNextExamPlan,
  buildExamCards,
  buildConceptCard,
  buildPracticeCard,
  rankConceptsForExam,
  getExamUrgency,
  resolveSubjectId,
  WEAK_SCORE_THRESHOLD,
  CONCEPTS_PER_DAY,
  MINUTES_PER_CONCEPT,
} from '../examEngine';
import { ExamEntry } from '../../../types/examCalendar';
import { MasteryRecord } from '../../../types/mastery';

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`✅ [PASS] ${message}`);
    passed++;
  } else {
    console.error(`❌ [FAIL] ${message}`);
    failed++;
    process.exitCode = 1;
  }
}

function makeExam(subjectId: string, date: string, topic?: string): ExamEntry {
  return {
    id: `exam_${subjectId}_${date}`,
    studentId: 'stu_test',
    subjectId,
    date,
    topic,
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z',
  };
}

function makeRecord(conceptId: string, score: number, evidenceCount = 3): MasteryRecord {
  return {
    id: `stu_test_${conceptId}`,
    studentId: 'stu_test',
    conceptId,
    score,
    confidence: 0.6,
    evidenceCount,
    lastUpdated: '2026-10-20T00:00:00.000Z',
    decayRate: 0.05,
    evidenceLog: [],
  };
}

const curriculum = new CurriculumService();
const lessons = curriculum.getAvailableLessons();

// ICT is the largest real subject (12 concepts over 12 lessons), so a
// multi-day plan can be exercised without inventing curriculum content.
const ictLessons = curriculum.getLessonsBySubject('subj_ict');
const ictConcepts = ictLessons.flatMap((l) => l.concepts);

const NOW = new Date(2026, 9, 20, 9, 0, 0); // 2026-10-20 local

// --- 1. Urgency bands ---------------------------------------------------
assert(getExamUrgency(0) === 'today', '1.1 an exam today is "today"');
assert(getExamUrgency(1) === 'imminent' && getExamUrgency(2) === 'imminent', '1.2 one to two days out is "imminent"');
assert(getExamUrgency(3) === 'soon' && getExamUrgency(7) === 'soon', '1.3 three to seven days out is "soon"');
assert(getExamUrgency(8) === 'later', '1.4 beyond a week is "later"');

// --- 2. Ranking: an untouched concept beats a weak one ------------------
const multiLesson = lessons.find((l) => l.concepts.length >= 2)!;
const ictLesson = ictLessons[0];
assert(Boolean(multiLesson), '2.0 a lesson with two or more concepts exists for ranking');

const aId = multiLesson.concepts[0].id;
const bId = multiLesson.concepts[1].id;

// Both concepts have evidence, both below the threshold, with different scores.
const bothWeak = rankConceptsForExam(multiLesson, [
  makeRecord(aId, 0.2),
  makeRecord(bId, 0.55),
]);
assert(bothWeak.every((c) => c.reason === 'weak'), '2.1 concepts below the threshold are labelled weak');
assert(bothWeak[0].conceptId === aId, '2.2 the lower-scoring weak concept is ranked first');
assert(bothWeak.find((c) => c.conceptId === bId)!.score === 0.55, '2.3 a weak concept keeps its real score');

// Now give one concept evidence and leave the other untouched.
const oneTouched = rankConceptsForExam(multiLesson, [makeRecord(aId, 0.2)]);
const untouched = oneTouched.filter((c) => c.reason === 'no_evidence');
assert(untouched.length === multiLesson.concepts.length - 1, '2.4 an untouched concept is labelled no_evidence');
assert(untouched[0].conceptId === bId, '2.5 the untouched concept is identified');
assert(oneTouched[0].reason === 'no_evidence', '2.6 an untouched concept outranks a weak one');
assert(oneTouched[oneTouched.length - 1].reason === 'weak', '2.7 the weak concept falls behind');

// An untouched concept also outranks a steady one.
const steady = rankConceptsForExam(multiLesson, [
  makeRecord(aId, WEAK_SCORE_THRESHOLD + 0.2),
]);
assert(steady[0].reason === 'no_evidence', '2.8 an untouched concept outranks a steady one');
assert(steady[steady.length - 1].reason === 'steady', '2.9 a concept at or above the threshold is steady and last');

// --- 3. A plan uses only the exam's own subject -------------------------
const exam = makeExam('subj_ict', '2026-10-27', 'البرمجة');
const plan = buildExamPlan({ exam, daysUntil: 7, lessons, mastery: [], now: NOW });

assert(plan.exam.id === exam.id, '3.1 the plan is tied to the real exam entry');
assert(plan.daysUntil === 7 && plan.urgency === 'soon', '3.2 days and urgency come from the real countdown');
assert(plan.totalConceptCount === ictConcepts.length, '3.3 the plan covers exactly the exam subject\'s concepts');
assert(
  plan.focus.every((f) => ictLessons.some((l) => l.id === f.lessonId)),
  '3.4 every focus concept belongs to a lesson in that subject'
);
assert(plan.uncoveredConceptCount === ictConcepts.length, '3.5 with no mastery every concept is uncovered');
assert(plan.focus.length === CONCEPTS_PER_DAY, '3.6 the first session is short, not the whole subject');
assert(ictConcepts.length > CONCEPTS_PER_DAY, '3.7 the subject has more concepts than one session holds');

// --- 4. A plan with no mastery evidence still works --------------------
assert(plan.focus.every((f) => f.score === null), '4.1 an unpractised concept reports a null score, not a guessed one');
assert(plan.focus.every((f) => f.reason === 'no_evidence'), '4.2 unpractised concepts are all no_evidence');
assert(Boolean(ictLesson), '4.3 the subject has at least one real lesson');

// --- 5. Study days spread the work -------------------------------------
const expectedDays = Math.ceil(ictConcepts.length / CONCEPTS_PER_DAY);
assert(plan.days.length === expectedDays, '5.1 the plan stops once every concept is scheduled, leaving free days free');
assert(plan.days.length <= 7, '5.1b the plan never creates more days than the exam is away');
assert(plan.days[0].date === '2026-10-20', '5.2 the first study day is today, from the injected clock');
assert(plan.days[0].daysUntilExam === 7, '5.3 the first day counts the full distance to the exam');
const lastDay = plan.days[plan.days.length - 1];
assert(lastDay.daysUntilExam === 7 - (plan.days.length - 1), '5.4 the last study day counts down correctly to the exam');
assert(plan.days[0].minutes === plan.days[0].concepts.length * MINUTES_PER_CONCEPT, '5.5 the day carries a concrete time estimate');
assert(plan.days[0].concepts[0].conceptId === plan.focus[0].conceptId, '5.6 the first day starts with the top-ranked concept');

const plannedIds = plan.days.flatMap((d) => d.concepts.map((c) => c.conceptId));
assert(new Set(plannedIds).size === plannedIds.length, '5.7 no concept is repeated across study days');
assert(plannedIds.length === Math.min(ictConcepts.length, 7 * CONCEPTS_PER_DAY), '5.8 the plan covers as much as it can, no more');

// --- 6. An exam today yields no study days -----------------------------
const todayPlan = buildExamPlan({
  exam: makeExam('subj_ict', '2026-10-20'),
  daysUntil: 0,
  lessons,
  mastery: [],
  now: NOW,
});
assert(todayPlan.days.length === 0, '6.1 an exam today has no future study days');
assert(todayPlan.urgency === 'today', '6.2 an exam today is flagged today');

// --- 7. Mastery evidence steers the plan -------------------------------
const strongId = ictConcepts[0].id;
const strongPlan = buildExamPlan({
  exam,
  daysUntil: 7,
  lessons,
  mastery: [makeRecord(strongId, 0.95)],
  now: NOW,
});
assert(strongPlan.uncoveredConceptCount === ictConcepts.length - 1, '7.1 a practised concept is no longer uncovered');
assert(!strongPlan.focus.some((f) => f.conceptId === strongId), '7.2 a mastered concept drops out of the first session');

// --- 8. The next-exam helper uses the soonest exam ---------------------
const later = makeExam('subj_science', '2026-11-10');
const soon = makeExam('subj_ict', '2026-10-23');
const nextPlan = buildNextExamPlan({
  upcoming: [
    { entry: soon, daysUntil: 3 },
    { entry: later, daysUntil: 21 },
  ],
  lessons,
  mastery: [],
  now: NOW,
});
assert(nextPlan !== null && nextPlan.exam.id === soon.id, '8.1 the plan targets the soonest upcoming exam');
assert(buildNextExamPlan({ upcoming: [], lessons, mastery: [], now: NOW }) === null, '8.2 no upcoming exam means no plan');

// --- 9. Cards carry verbatim content and a real source -----------------
const concept = ictLesson.concepts[0];
const conceptCard = buildConceptCard({ lesson: ictLesson, concept });

assert(conceptCard.kind === 'concept', '9.1 a concept card is labelled concept');
assert(conceptCard.bodyAr === concept.sourceText, '9.2 the card body is the official source text, verbatim');
assert(conceptCard.titleAr === concept.titleAr && conceptCard.titleEn === concept.titleEn, '9.3 both language titles come from the curriculum');
assert(conceptCard.keyPointsAr === concept.keyPoints, '9.4 key points are the official ones, not generated');
assert(conceptCard.source.bookAr === ictLesson.sourceRef.bookAr, '9.5 the card names its real book');
assert(conceptCard.source.page === ictLesson.sourceRef.page, '9.6 the card cites the real source page');
assert(conceptCard.source.unit === ictLesson.unitNameAr && conceptCard.source.lesson === ictLesson.titleAr, '9.7 the card cites unit and lesson');

const practiceCard = buildPracticeCard({ lesson: ictLesson, concept });
assert(practiceCard !== null, '9.8 an ICT lesson has an answerable exercise');
if (practiceCard) {
  assert(practiceCard.kind === 'practice', '9.9 a practice card is labelled practice');
  const used = ictLesson.exercises.find((e) => e.expectedAnswer === practiceCard.expectedAnswer);
  assert(Boolean(used), '9.10 the practice answer is a real curriculum answer, not generated');
  assert(practiceCard.question === used!.question, '9.11 the question text is verbatim from the curriculum');
}

// --- 10. A lesson with no answerable exercise yields no practice card --
const emptyLesson = { ...ictLesson, exercises: [] };
assert(buildPracticeCard({ lesson: emptyLesson, concept }) === null, '10.1 no answerable exercise means no practice card');
const noAnswerLesson = { ...ictLesson, exercises: [{ type: 'qa' as const, question: 'q' }] };
assert(buildPracticeCard({ lesson: noAnswerLesson, concept }) === null, '10.2 an exercise without an answer is never shown');

// --- 11. Exam cards are built only from the plan's focus ---------------
const cards = buildExamCards({ plan, lessons });
assert(cards.length > 0, '11.1 an exam plan produces cards');
assert(cards.every((c) => c.examContext?.examId === exam.id), '11.2 every card is tied to the real exam');
assert(cards.every((c) => c.examContext?.daysUntil === 7), '11.3 every card carries the real countdown');
assert(
  cards.every((c) => plan.focus.some((f) => f.conceptId === c.conceptId)),
  '11.4 no card is produced for a concept outside the plan'
);
assert(cards.every((c) => c.source.page !== undefined), '11.5 every card has a source page field');
assert(new Set(cards.map((c) => c.id)).size === cards.length, '11.6 card ids are unique');
assert(cards.some((c) => c.kind === 'practice'), '11.7 the plan includes at least one practice card');

// --- 12. No invented dates anywhere in the engine ----------------------
const planDates = new Set(plan.days.map((d) => d.date));
assert(planDates.size === plan.days.length, '12.1 no duplicate study days');
assert(plan.days.every((d) => /^\d{4}-\d{2}-\d{2}$/.test(d.date)), '12.2 every study day is a real calendar day string');
assert(plan.days.every((d) => d.date < exam.date), '12.3 study days all fall before the exam date');

// --- 13. Subject ids resolve tolerantly, never silently -----------------
assert(resolveSubjectId('subj_ict', lessons) === 'subj_ict', '13.1 an exact subject id is kept');
assert(resolveSubjectId('ict', lessons) === 'subj_ict', '13.2 a bare subject id resolves to the official one');
assert(resolveSubjectId('ICT', lessons) === 'subj_ict', '13.3 a name-cased id resolves');
assert(resolveSubjectId('unknown_subject', lessons) === 'unknown_subject', '13.4 an unknown id is returned unchanged, not guessed');

const barePlan = buildExamPlan({
  exam: makeExam('ict', '2026-10-27'),
  daysUntil: 7,
  lessons,
  mastery: [],
  now: NOW,
});
assert(barePlan.totalConceptCount === ictConcepts.length, '13.5 a bare subject id still plans the real subject');
const unknownPlan = buildExamPlan({
  exam: makeExam('nope', '2026-10-27'),
  daysUntil: 7,
  lessons,
  mastery: [],
  now: NOW,
});
assert(unknownPlan.totalConceptCount === 0, '13.6 an unknown subject yields an empty plan, not invented content');
assert(unknownPlan.days.length === 0, '13.7 an empty plan has no study days');

console.log(`\nEXAM ENGINE SUITE SUMMARY: ${passed} PASSED, ${failed} FAILED`);
if (failed > 0) process.exit(1);
