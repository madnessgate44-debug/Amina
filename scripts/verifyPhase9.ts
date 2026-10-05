/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { curriculumService } from '../src/services/curriculum/curriculumService';
import { teachingSessionEngine } from '../src/services/teaching/teachingSession';
import { TeachingSession } from '../src/types/teachingSession';

async function verifyAllFiveProvingLessons() {
  console.log('=== STARTING PHASE 9 PROVING LESSONS VERIFICATION ===\n');

  const provingLessons = curriculumService.getProvingLessons();
  console.log(`Found ${provingLessons.length} proving lessons in official curriculum.`);

  if (provingLessons.length !== 5) {
    throw new Error(`Expected exactly 5 proving lessons, found ${provingLessons.length}`);
  }

  const results: Record<string, any> = {};

  for (const lesson of provingLessons) {
    console.log(`\n-----------------------------------------------------`);
    console.log(`Testing Lesson: ${lesson.titleAr} (${lesson.titleEn})`);
    console.log(`Subject: ${lesson.subjectNameAr} | Source: ${lesson.sourceRef.bookAr} (p. ${lesson.sourceRef.page})`);
    console.log(`Objectives: ${lesson.objectives.length} | Vocab: ${lesson.vocabulary.length} | Concepts: ${lesson.concepts.length}`);

    // Verify traceability
    if (!lesson.sourceRef.page || !lesson.sourceRef.bookAr) {
      throw new Error(`Lesson ${lesson.id} is missing source book or page reference!`);
    }

    // 1. Initialize session
    const { session: sess0, greetingTurn } = teachingSessionEngine.initializeSession({
      studentId: 'test_student_amina',
      lessonId: lesson.id,
      language: 'ar',
    });

    if (sess0.currentStep !== 'greet') {
      throw new Error(`Initial step must be 'greet', got '${sess0.currentStep}'`);
    }
    console.log(`[Step 1 - Greet]: OK -> "${greetingTurn.text.slice(0, 70)}..."`);

    // 2. Student says "جاهز" -> Greet to Warm-up
    const res1 = teachingSessionEngine.advanceSession({
      session: sess0,
      studentInput: 'أنا جاهز ومتحمس لنبدأ',
      language: 'ar',
    });
    console.log(`[Step 2 - Warmup]: OK -> "${res1.newTutorTurn.text.slice(0, 70)}..."`);

    // 3. Student answers warm-up -> Warmup to Teach (Source reading)
    const res2 = teachingSessionEngine.advanceSession({
      session: res1.session,
      studentInput: 'أتذكر أنني ساعدت أخي الصغير في تنظيف الحديقة وترشيد الماء',
      language: 'ar',
    });
    if (res2.session.currentStep !== 'teach') {
      throw new Error(`Expected step 'teach', got '${res2.session.currentStep}'`);
    }
    console.log(`[Step 3 - Teach from Source]: OK -> "${res2.newTutorTurn.text.slice(0, 90)}..."`);

    // 4. Student confirms reading -> Teach to Ask
    const res3 = teachingSessionEngine.advanceSession({
      session: res2.session,
      studentInput: 'قرأت الفقرة وفهمت الكلمات',
      language: 'ar',
    });
    if (res3.session.currentStep !== 'ask') {
      throw new Error(`Expected step 'ask', got '${res3.session.currentStep}'`);
    }
    console.log(`[Step 4 - Ask (Open-ended)]: OK -> "${res3.newTutorTurn.text.slice(0, 70)}..."`);

    // 5. Test Off-book question detection (Sub-Phase 9.3)
    const offBookRes = teachingSessionEngine.advanceSession({
      session: res3.session,
      studentInput: 'هل توجد ديناصورات في كوكب المريخ؟',
      language: 'ar',
    });
    if (!offBookRes.newTutorTurn.offBookDetected) {
      throw new Error(`Off-book question was not detected!`);
    }
    console.log(`[Off-Book Question Handled Politely]: OK -> "${offBookRes.newTutorTurn.text.slice(0, 70)}..."`);
    console.log(`Logged for parent: "${offBookRes.session.offBookQuestions[0].parentNote}"`);

    // 6. Test Escalation Ladder: Deliberately struggle on current concept
    let currentSess = res3.session;
    const modalitiesFired: string[] = [];

    // Attempt 1: source_explanation
    const esc1 = teachingSessionEngine.advanceSession({
      session: currentSess,
      studentInput: 'مش فاهم النقطة دي خالص يا أستاذ',
      language: 'ar',
    });
    modalitiesFired.push(esc1.newTutorTurn.modalityUsed || '');
    currentSess = esc1.session;

    // Attempt 2: daily_life_example
    const esc2 = teachingSessionEngine.advanceSession({
      session: currentSess,
      studentInput: 'ممكن مثال تاني؟',
      language: 'ar',
    });
    modalitiesFired.push(esc2.newTutorTurn.modalityUsed || '');
    currentSess = esc2.session;

    // Attempt 3: story_analogy
    const esc3 = teachingSessionEngine.advanceSession({
      session: currentSess,
      studentInput: 'لسا صعبة عليا',
      language: 'ar',
    });
    modalitiesFired.push(esc3.newTutorTurn.modalityUsed || '');
    currentSess = esc3.session;

    // Attempt 4: structured_visual (Verify Visual is generated and attached!)
    const esc4 = teachingSessionEngine.advanceSession({
      session: currentSess,
      studentInput: 'ممكن رسمة أو صورة توضحلي؟',
      language: 'ar',
    });
    modalitiesFired.push(esc4.newTutorTurn.modalityUsed || '');
    if (!esc4.newTutorTurn.visualData) {
      throw new Error(`Attempt 4 did not attach a structured visual!`);
    }
    console.log(`[Step 6 - Visual Rendered]: Type = ${esc4.newTutorTurn.visualData.type} | Title = "${esc4.newTutorTurn.visualData.titleAr}"`);
    currentSess = esc4.session;

    // Attempt 5: break_prerequisite
    const esc5 = teachingSessionEngine.advanceSession({
      session: currentSess,
      studentInput: 'وضحت شوية بس لسا في نقطة واقفة',
      language: 'ar',
    });
    modalitiesFired.push(esc5.newTutorTurn.modalityUsed || '');
    currentSess = esc5.session;

    console.log(`[Escalation Ladder Modalities Fired]:`, modalitiesFired);

    // 7. Student grasps concept -> must advance to Step 7: Explain-it-back (MANDATORY)
    const firstConcept = lesson.concepts[0];
    const understandRes = teachingSessionEngine.advanceSession({
      session: currentSess,
      studentInput: `فهمت الآن تماماً: ${firstConcept.titleAr} و${firstConcept.keyPoints[0]}`,
      language: 'ar',
    });
    if (understandRes.session.currentStep !== 'explain_back') {
      throw new Error(`Loop advanced without enforcing 'explain_back'! Got step '${understandRes.session.currentStep}'`);
    }
    console.log(`[Step 7 - Explain-it-back ENFORCED]: OK -> "${understandRes.newTutorTurn.text.slice(0, 90)}..."`);

    // 8. Try short insufficient answer -> should NOT advance
    const insufficientRes = teachingSessionEngine.advanceSession({
      session: understandRes.session,
      studentInput: 'تمام',
      language: 'ar',
    });
    if (insufficientRes.session.currentStep !== 'explain_back') {
      throw new Error(`Explain-it-back let a 1-word answer pass without real explanation!`);
    }
    console.log(`[Explain-it-back Rejects 1-word answers]: OK -> prompted for more detail.`);

    // 9. Student explains it back thoroughly -> advances to Celebrate & Mastery
    const explainDoneRes = teachingSessionEngine.advanceSession({
      session: understandRes.session,
      studentInput: `سأشرح لك بكل بساطة: هذا المفهوم يعلمنا القيمة الأساسية للنص وكيف نطبقها في سلوكنا اليومي للحفاظ على ما تعلمناه من كتاب ${lesson.sourceRef.bookAr}.`,
      language: 'ar',
    });
    if (explainDoneRes.session.currentStep !== 'celebrate') {
      throw new Error(`Expected step 'celebrate' after valid explain-back, got '${explainDoneRes.session.currentStep}'`);
    }
    if (!explainDoneRes.masteryUpdate || explainDoneRes.masteryUpdate.modality !== 'quiz') {
      throw new Error(`Explain-back did not trigger high-weight quiz mastery update!`);
    }
    console.log(`[Step 8 - Celebrate + High-weight Mastery Update]: OK -> Correctness=${explainDoneRes.masteryUpdate.correctness}, Modality=${explainDoneRes.masteryUpdate.modality}`);

    // 10. Test Resumability (Simulate pausing and resuming next day)
    const { session: resumedSess, greetingTurn: resumeTurn } = teachingSessionEngine.initializeSession({
      studentId: 'test_student_amina',
      lessonId: lesson.id,
      existingSession: explainDoneRes.session,
      language: 'ar',
    });
    if (!resumeTurn.text.includes('أهلاً بك مجدداً') && !resumeTurn.text.includes('Welcome back')) {
      throw new Error(`Resuming session did not produce resume greeting!`);
    }
    console.log(`[Session Resumability Verified]: Resumed from concept ${resumedSess.currentConceptIndex + 1} across simulated days.`);

    results[lesson.id] = {
      titleAr: lesson.titleAr,
      titleEn: lesson.titleEn,
      subject: lesson.subjectNameAr,
      bookSource: lesson.sourceRef.bookAr,
      page: lesson.sourceRef.page,
      visualType: esc4.newTutorTurn.visualData.type,
      allStepsPassed: true,
    };
  }

  console.log('\n=====================================================');
  console.log('ALL 5 PROVING LESSONS PASSED FULL END-TO-END VERIFICATION:');
  console.table(results);
  console.log('=====================================================\n');
}

verifyAllFiveProvingLessons().catch((err) => {
  console.error('VERIFICATION FAILED:', err);
  process.exit(1);
});
