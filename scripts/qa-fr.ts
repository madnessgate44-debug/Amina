import { curriculumService } from '../src/services/curriculum/curriculumService';
for (const l of curriculumService.getAllLessons().filter((x:any)=>x.subjectId==='subj_french')) {
  console.log(l.id, '|', l.unitNumber, l.lessonNumber, '|', l.titleEn, '| avail:', l.isAvailable, '| lang:', l.instructionLanguage, '| src:', String(l.sourceRef).slice(0,60));
}
