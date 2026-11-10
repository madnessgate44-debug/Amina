/**
 * QA helper: reproduce the feed queue the live app builds for a fixed seeded
 * student, so a browser probe can target the exact diagnosis reel.
 */
import { buildFeedQueue } from '../src/services/reels/feedQueue';
import { matchMisconception } from '../src/services/teaching/skills/teachingSkills';
import { curriculumService } from '../src/services/curriculum/curriculumService';

const studentId = process.argv[2] || 'qa-seed-1';
const subject = process.argv[3] || 'الرياضيات (بالفرنسية)';

const q = buildFeedQueue({
  studentId,
  language: 'ar',
  mastery: {},
  dueReviews: [],
  todaySubjects: [subject],
  examCalendar: [],
  sessionMinutes: 10,
});

console.log('reels:', q.reels.length);
q.reels.forEach((r, i) => {
  const lesson = curriculumService.getLessonById(r.lessonId);
  const concept = lesson?.concepts.find((c) => c.id === r.conceptId);
  const mis = concept?.misconceptions || [];
  const wrongDiagnosable = (r.options || []).filter(
    (o) => !o.isCorrect && matchMisconception(o.text, mis)
  );
  console.log(
    `${i}\t${r.reason}\t${r.kind}\t${r.conceptId}\t${r.subjectName}\topts=${(r.options || []).length}` +
      `\tdiagnosableWrong=${JSON.stringify(wrongDiagnosable.map((o) => o.text))}`
  );
});
