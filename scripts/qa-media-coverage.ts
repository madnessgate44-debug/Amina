import { curriculumService } from '../src/services/curriculum/curriculumService';
import { MEDIA_CATALOG, mediaForConcept } from '../src/data/media/mediaCatalog';

const lessons = curriculumService.getAllLessons();
let totalConcepts = 0;
let withMedia = 0;
const noMedia: string[] = [];
for (const l of lessons) {
  for (const c of l.concepts) {
    totalConcepts++;
    if (mediaForConcept(l.id, c.id).length > 0) withMedia++;
    else noMedia.push(`${c.id}\t${l.subjectId || ''}\t${l.id}`);
  }
}
console.log(`lessons=${lessons.length} concepts=${totalConcepts} withMedia=${withMedia} without=${noMedia.length}`);
console.log('catalog items=', MEDIA_CATALOG.length);
console.log('--- without media ---');
noMedia.forEach((x) => console.log(x));
