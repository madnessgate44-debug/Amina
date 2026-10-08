import { TeachingSessionEngine } from '../teachingSession';
import { curriculumService } from '../../curriculum/curriculumService';
import { writeFileSync } from 'node:fs';

function assert(condition: boolean, message: string) {
  if (!condition) {
    writeFileSync('teaching-test-failure.txt', message, 'utf8');
    throw new Error(message);
  }
}

const engine = new TeachingSessionEngine();
const lessonId = 'off_mathfr_u1_l1_decimaux';
const lesson = curriculumService.getLessonById(lessonId);
if (!lesson || !lesson.concepts[0]) throw new Error('authoritative test lesson missing');
const sourceConcept = lesson.concepts[0];
const sourceKeyPoint = sourceConcept.keyPoints[0] || sourceConcept.sourceText;

function advance(session: any, input: string) {
  return engine.advanceSession({ session, studentInput: input, language: 'ar' });
}

// Verify the loop reaches an explain-back gate without awarding mastery from practice alone.
{
  const initialized = engine.initializeSession({
    studentId: 'student_test',
    lessonId,
    language: 'ar',
  });

  let session = initialized.session;
  let result = advance(session, 'جاهزة');
  session = result.session;
  assert(session.currentStep === 'warmup', 'greet should advance to warmup');

  result = advance(session, 'جاهزة');
  session = result.session;
  assert(session.currentStep === 'teach', 'warmup should advance to teach');

  result = advance(session, 'القيمة المكانية بعد الفاصلة');
  session = result.session;
  assert(session.currentStep === 'ask', 'teach should advance to the understanding check');
  assert(!result.masteryUpdate, 'understanding check must not award mastery');
}

// Verify weak explain-back is captured and rejected.
{
  const initialized = engine.initializeSession({
    studentId: 'student_test_weak',
    lessonId,
    language: 'ar',
  });

  let session = initialized.session;
  session = advance(session, 'جاهزة').session;
  session = advance(session, 'جاهزة').session;
  session = advance(session, 'القيمة المكانية بعد الفاصلة ثم أجزاء من عشرة ومئة وألف').session;
  assert(session.currentStep === 'ask', 'setup should reach understanding check');

  session = advance(
    session,
    `${sourceConcept.titleAr}: ${sourceKeyPoint}. ${sourceConcept.titleEn}: ${sourceKeyPoint}.`
  ).session;
  assert(session.currentStep === 'explain_back', 'practice should lead to explain-back before evaluating reasoning');

  const result = advance(session, 'تخمين وحظ، مش متأكدة ومش عارفة أشرح');
  assert(result.session.currentStep === 'adjust', 'guessing explain-back must return to adjustment');
  assert(result.session.explainBackEvidence?.quality === 'guessing', 'guessing explain-back must be captured');
  assert(!result.masteryUpdate, 'guessing explain-back must never award mastery');
}

// Verify source-grounded sound explain-back is the mastery gate.
{
  const initialized = engine.initializeSession({
    studentId: 'student_test_sound',
    lessonId,
    language: 'ar',
  });

  let session = initialized.session;
  session = advance(session, 'جاهزة').session;
  session = advance(session, 'جاهزة').session;
  session = advance(session, `${sourceConcept.titleAr}: ${sourceKeyPoint}`).session;
  assert(session.currentStep === 'ask', 'sound-path setup should reach understanding check');

  const practice = advance(
    session,
    'القيمة المكانية بعد الفاصلة: الأول أجزاء من عشرة والثاني من مئة والثالث من ألف، وكل رتبة إلى اليمين أصغر بعشر مرات. Chaque rang vers la droite est 10 fois plus petit.'
  );
  assert(practice.session.currentStep === 'explain_back', 'successful understanding check should require explain-back');
  assert(!practice.masteryUpdate, 'practice success must not award mastery before explain-back');

  const final = advance(
    practice.session,
    `${sourceConcept.titleAr}: ${sourceKeyPoint}. ${sourceConcept.titleEn}: ${sourceKeyPoint}.`
  );
  assert(final.session.explainBackEvidence?.quality === 'sound', `sound explain-back must be captured: ${JSON.stringify(final.session.explainBackEvidence)}`);
  assert(final.masteryUpdate?.correctness === 'full', 'sound explain-back is the mastery gate');
  assert(final.masteryUpdate?.independence === 'unassisted', 'first successful explain-back remains unassisted');
}

console.log('TeachingSession explain-back evidence tests passed.');
