import { TeachingSessionEngine } from '../teachingSession';

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const engine = new TeachingSessionEngine();
const initialized = engine.initializeSession({
  studentId: 'student_test',
  lessonId: 'off_mathfr_u1_l1_decimaux',
  language: 'ar',
});

let session = initialized.session;
const conceptText = 'القيمة المكانية بعد الفاصلة: جزء من عشرة، ثم جزء من مئة، ثم جزء من ألف';

let result = engine.advanceSession({ session, studentInput: 'جاهزة', language: 'ar' });
session = result.session;
assert(session.currentStep === 'warmup', 'greet should advance to warmup');

result = engine.advanceSession({ session, studentInput: 'جاهزة', language: 'ar' });
session = result.session;
assert(session.currentStep === 'teach', 'warmup should advance to teach');

result = engine.advanceSession({ session, studentInput: conceptText, language: 'ar' });
session = result.session;
assert(session.currentStep === 'ask', 'teach should advance to the practice/check step');
assert(!result.masteryUpdate, 'practice/check must not create mastery evidence');

result = engine.advanceSession({
  session,
  studentInput: 'القيمة المكانية بعد الفاصلة هي جزء من عشرة ثم جزء من مئة ثم جزء من ألف',
  language: 'ar',
});
session = result.session;
assert(session.currentStep === 'explain_back', 'successful practice should require explain-back');
assert(!result.masteryUpdate, 'successful practice must not award mastery before explain-back');

result = engine.advanceSession({
  session,
  studentInput: 'تخمين وحظ، مش متأكدة من الإجابة ومش عارفة أشرح القاعدة',
  language: 'ar',
});
session = result.session;
assert(session.explainBackEvidence?.quality === 'guessing', 'guessing explain-back must be captured');
assert(session.currentStep === 'adjust', 'weak explain-back must return to targeted practice');
assert(!result.masteryUpdate, 'guessing explain-back must never award mastery evidence');

result = engine.advanceSession({
  session,
  studentInput: 'القيمة المكانية بعد الفاصلة تعني ترتيب الأرقام: الأول أجزاء من عشرة والثاني من مئة والثالث من ألف. Chaque rang vers la droite est 10 fois plus petit، لذلك نعرف قيمة كل رقم من مكانه.',
  language: 'ar',
});
session = result.session;
assert(session.currentStep === 'explain_back', 'targeted practice should lead back to explain-back');
assert(!result.masteryUpdate, 'targeted practice must not award mastery by itself');

result = engine.advanceSession({
  session,
  studentInput: 'القيمة المكانية بعد الفاصلة تعني ترتيب الأرقام: الأول أجزاء من عشرة والثاني من مئة والثالث من ألف. كلما اتجهنا يميناً يصبح كل رتبة أصغر بعشر مرات، لذلك نعرف قيمة كل رقم من مكانه.',
  language: 'ar',
});
session = result.session;
assert(session.explainBackEvidence?.quality === 'sound', 'sound explain-back must be captured');
assert(result.masteryUpdate?.correctness === 'full', 'sound explain-back should be the mastery gate');
assert(result.masteryUpdate?.independence === 'hinted', 'successful explain-back after targeted retry reflects guided teaching');
console.log('TeachingSession explain-back evidence tests passed.');
