import { OFFICIAL_CURRICULUM_LESSONS } from '../src/data/officialCurriculum';
const rows = (OFFICIAL_CURRICULUM_LESSONS as any[]).map(l => ({
  id: l.id, subj: l.subjectId, term: l.sourceRef?.term, page: l.sourceRef?.page,
  range: l.sourceRef?.pageRange, u: l.unitNumber, n: l.lessonNumber,
  title: (l.titleFr || l.titleEn || l.titleAr).slice(0, 52),
  avail: l.isAvailable !== false, ex: l.exercises?.length ?? 0,
}));
for (const s of [...new Set(rows.map(r => r.subj))]) {
  const g = rows.filter(r => r.subj === s);
  console.log(`\n### ${s}  (${g.length})`);
  for (const r of g) console.log(`  ${r.avail?'+':'-'} u${r.u}l${r.n} ${String(r.page).padStart(4)} | ${String(r.ex).padStart(2)}ex | ${r.title}`);
}
console.log('\nTERMS:', JSON.stringify([...new Set(rows.map(r=>r.term))]));
