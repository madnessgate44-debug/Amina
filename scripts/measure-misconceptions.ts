/**
 * Measurement: how many concepts carry misconception data, and how many are
 * actually servable in each child language (the deterministic diagnosis is only
 * served when the stored text is in the child's own script).
 */
import { curriculumService } from '../src/services/curriculum/curriculumService';
import { speaksLanguage } from '../src/services/reels/reelResponse';
import { misconceptionText } from '../src/services/teaching/skills/teachingSkills';

const lessons = curriculumService.getAvailableLessons();
let total = 0;
let withData = 0;
const notAr: string[] = [];
const diagnosableAr: string[] = [];

for (const lesson of lessons) {
  for (const concept of lesson.concepts) {
    total++;
    const mis = concept.misconceptions || [];
    if (mis.length === 0) continue;
    withData++;
    const text = mis.map((m) => misconceptionText(m, 'ar')).join(' ');
    if (!speaksLanguage(text.trim(), 'ar')) notAr.push(`${concept.id} (${lesson.subjectNameAr})`);
    else diagnosableAr.push(concept.id);
  }
}

console.log('concepts total:', total);
console.log('concepts WITH misconception data:', withData);
console.log('concepts servable to an ARABIC child:', diagnosableAr.length);
console.log('\nLatin-only (Arabic child gets NO deterministic diagnosis):', notAr.length);
for (const id of notAr) console.log('  ', id);
