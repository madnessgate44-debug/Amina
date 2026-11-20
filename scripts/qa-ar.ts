import { curriculumService } from '../src/services/curriculum/curriculumService';
import { buildReelsForConcept } from '../src/services/reels/reelGenerator';
const ls = curriculumService.getAllLessons().filter((l:any)=>l.id.startsWith('off_ar_2026_'));
console.log('count', ls.length);
for (const l of ls.slice(0,3)) {
  const r = buildReelsForConcept(l, l.concepts[0], 'ar');
  console.log(l.id, '|', l.titleAr, '| reels:', r.map((x:any)=>x.kind).join(','));
}
