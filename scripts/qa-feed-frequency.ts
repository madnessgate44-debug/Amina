/**
 * QA helper: over many simulated days, which concepts does the feed queue most?
 * Used to prioritise new media where the child will actually see it.
 */
import { buildFeedQueue } from '../src/services/reels/feedQueue';
import { curriculumService } from '../src/services/curriculum/curriculumService';
import { mediaForConcept } from '../src/data/media/mediaCatalog';

const subjects = [
  ['الرياضيات (بالفرنسية)'],
  ['العلوم'],
  ['اللغة العربية'],
  ['التربية الدينية الإسلامية'],
  ['الخط العربي'],
  ['الرياضيات'],
  ['اللغة الإنجليزية'],
  ['تكنولوجيا المعلومات'],
  ['الدراسات الاجتماعية'],
  ['العلوم (بالفرنسية)'],
];

const counts = new Map<string, number>();
const total = new Map<string, number>();
const start = Date.UTC(2026, 0, 1);
for (let d = 0; d < 120; d++) {
  const now = new Date(start + d * 86_400_000);
  for (const subj of subjects) {
    const q = buildFeedQueue({
      studentId: `sim-${d % 7}`,
      language: 'ar',
      mastery: {},
      dueReviews: [],
      todaySubjects: subj,
      examCalendar: [],
      sessionMinutes: 10,
      now,
    });
    for (const r of q.reels) {
      if (r.conceptId === 'closer') continue;
      const key = `${r.conceptId}`;
      counts.set(key, (counts.get(key) || 0) + 1);
      total.set(key, (total.get(key) || 0) + 1);
    }
  }
}

const rows = [...counts.entries()]
  .map(([conceptId, n]) => {
    const found = curriculumService.getConceptById(conceptId);
    const has = found ? mediaForConcept(found.lesson.id, conceptId).length : -1;
    return { conceptId, n, has, lessonId: found?.lesson.id, subject: found?.lesson.subjectNameAr };
  })
  .sort((a, b) => b.n - a.n);

console.log('total reels simulated:', [...total.values()].reduce((a, b) => a + b, 0));
console.log('concept\thits\tmedia?\tlesson\tsubject');
for (const r of rows) console.log(`${r.conceptId}\t${r.n}\t${r.has > 0 ? 'YES' : 'no'}\t${r.lessonId}\t${r.subject}`);
