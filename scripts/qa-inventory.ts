import { curriculumService } from '../src/services/curriculum/curriculumService';
const lessons = curriculumService.getAllLessons();
const bySubject = new Map<string, { name: string; total: number; available: number; units: Set<number>; tracks: Set<string>; instr: Set<string> }>();
for (const l of lessons) {
  const e = bySubject.get(l.subjectId) ?? { name: l.subjectNameEn, total: 0, available: 0, units: new Set(), tracks: new Set(), instr: new Set() };
  e.total++; if (l.isAvailable) e.available++;
  e.units.add(l.unitNumber); e.tracks.add(l.track ?? 'n/a'); e.instr.add(l.instructionLanguage ?? 'n/a');
  bySubject.set(l.subjectId, e);
}
console.log('SUBJECT'.padEnd(28), 'TOTAL', 'AVAIL', 'UNITS', 'TRACK', 'INSTR');
for (const [id, e] of [...bySubject].sort()) {
  console.log(id.padEnd(28), String(e.total).padStart(5), String(e.available).padStart(5), String(e.units.size).padStart(5), [...e.tracks].join('/'), [...e.instr].join('/'), '|', e.name);
}
console.log('\nTOTAL lessons:', lessons.length, 'available:', lessons.filter(l=>l.isAvailable).length);
