/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Guards the educational media system (owner ask: the feed must carry real
 * educational media, not only a canvas drawing).
 *
 * These checks are what make the catalog trustworthy:
 *   - every catalogued item points at a real file that ships in public/media;
 *   - every item is bound to a real lesson + concept in the curriculum;
 *   - every item teaches: it has a localized title, purpose and alt text, and
 *     a curriculum reference;
 *   - numbered diagrams have a complete legend (1..N, no gaps, no duplicates)
 *     and, when interactive, a hotspot for every legend entry;
 *   - the media is actually reachable: the reel the item targets is buildable,
 *     so the feed will render it.
 *
 * No DOM is used: the catalog and the reel engine are pure, so this is
 * deterministic. The rendering itself is exercised in a browser by the QA drive.
 */

import { readFileSync, existsSync, statSync } from 'fs';
import { join } from 'path';
import { MEDIA_CATALOG, mediaForConcept } from '../../data/media/mediaCatalog';
import { curriculumService } from '../curriculum/curriculumService';
import { buildReelsForConcept } from '../reels/reelGenerator';
import { EducationalMediaItem, localized } from '../../types/media';

let passed = 0;
let failed = 0;

function check(name: string, condition: boolean, detail?: string) {
  if (condition) {
    passed++;
    console.log(`  ✅ [PASS] ${name}`);
  } else {
    failed++;
    console.log(`  ❌ [FAIL] ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

const ROOT = process.cwd();
const publicPath = (src: string) => join(ROOT, 'public', src.replace(/^\/+/, ''));
const srcPath = (p: string) => join(ROOT, 'media-src', p.replace(/^media\//, ''));

function main() {
  check('the catalog has media to check', MEDIA_CATALOG.length >= 3, `found ${MEDIA_CATALOG.length}`);

  // 1. Every item carries the metadata that makes it educational.
  const missingMeta = MEDIA_CATALOG.filter(
    (m) =>
      !m.id ||
      !m.lessonId ||
      !m.conceptId ||
      !m.curriculumRef ||
      !m.width ||
      !m.height ||
      !localized(m.title, 'ar') ||
      !localized(m.title, 'en') ||
      !localized(m.purpose, 'ar') ||
      !localized(m.purpose, 'en') ||
      !localized(m.alt, 'ar') ||
      !localized(m.alt, 'en')
  );
  check('every item has id, lesson, concept, curriculum ref, size and bilingual title/purpose/alt', missingMeta.length === 0, missingMeta.map((m) => m.id).join(', '));

  // 2. Every item is bound to a real lesson + concept.
  const unbound = MEDIA_CATALOG.filter((m) => {
    const found = curriculumService.getConceptById(m.conceptId);
    return !found || found.lesson.id !== m.lessonId;
  });
  check('every item points at a real lesson+concept in the curriculum', unbound.length === 0, unbound.map((m) => `${m.id}->${m.conceptId}`).join(', '));

  // 3. Every referenced asset ships in public/media and is non-trivial.
  const missingFiles: string[] = [];
  const tinyFiles: string[] = [];
  for (const m of MEDIA_CATALOG) {
    const refs = [m.src, m.fallbackSrc, m.narration?.src, m.playback?.poster].filter(Boolean) as string[];
    for (const ref of refs) {
      const p = publicPath(ref);
      if (!existsSync(p)) {
        missingFiles.push(`${m.id}:${ref}`);
        continue;
      }
      // SVGs are small but valid; require any shipped asset to be at least 1 KB.
      if (statSync(p).size < 1024) tinyFiles.push(`${m.id}:${ref}`);
    }
  }
  check('every referenced asset exists in public/media', missingFiles.length === 0, missingFiles.slice(0, 5).join(', '));
  check('every shipped asset is non-trivial (>= 1 KB)', tinyFiles.length === 0, tinyFiles.slice(0, 5).join(', '));

  // 4. The committed source for each raster/vector asset exists (reproducible).
  const missingSources = MEDIA_CATALOG.filter((m) => m.source.origin !== 'authored_video')
    .filter((m) => !existsSync(srcPath(m.src)))
    .map((m) => m.src);
  check('every image item has a committed source in media-src/', missingSources.length === 0, missingSources.join(', '));

  // 5. Legend completeness + hotspots match the legend.
  const badLegend: string[] = [];
  for (const m of MEDIA_CATALOG) {
    if (!m.legend) continue;
    const ns = m.legend.map((l) => l.n);
    const unique = new Set(ns);
    const complete = ns.length === unique.size && ns.every((n) => n >= 1 && n <= ns.length);
    const everyText = m.legend.every((l) => localized(l.text, 'ar') && localized(l.text, 'en'));
    if (!complete || !everyText) badLegend.push(m.id);
    if (m.hotspots) {
      const hs = m.hotspots.map((h) => h.n).sort((a, b) => a - b);
      const ls = [...ns].sort((a, b) => a - b);
      const inRange = m.hotspots.every((h) => h.x >= 0 && h.x <= 1 && h.y >= 0 && h.y <= 1);
      if (hs.join(',') !== ls.join(',') || !inRange) badLegend.push(`${m.id}:hotspots`);
    }
  }
  check('numbered diagrams have a complete 1..N bilingual legend and matching in-range hotspots', badLegend.length === 0, badLegend.join(', '));

  // 6. Video items declare playback and a poster (reduced-motion fallback).
  const badVideo = MEDIA_CATALOG.filter((m) => m.type === 'video' && (!m.playback || !m.playback.poster)).map((m) => m.id);
  check('every video item declares playback and a poster fallback', badVideo.length === 0, badVideo.join(', '));

  // 7. Narration, when present, points at a real audio file.
  const badNarration = MEDIA_CATALOG.filter((m) => m.narration && !m.narration.src).map((m) => m.id);
  check('every narration has an audio source', badNarration.length === 0, badNarration.join(', '));

  // 8. The media is reachable: the targeted reel is buildable for each item.
  const unreachable: string[] = [];
  for (const m of MEDIA_CATALOG) {
    const found = curriculumService.getConceptById(m.conceptId);
    if (!found) continue;
    const reels = buildReelsForConcept(found.lesson, found.concept, 'ar');
    const hasKind = reels.some((r) => r.kind === m.reelKind);
    if (!hasKind) unreachable.push(`${m.id}:${m.reelKind}`);
  }
  check('every item targets a reel kind the engine actually builds (so the feed shows it)', unreachable.length === 0, unreachable.join(', '));

  // 9. mediaForConcept returns exactly the items bound to a concept.
  const sciItems = mediaForConcept('off_sci_u1_l1_plant_needs', 'off_sci_u1_l1_c1');
  check('mediaForConcept returns the science concept media', sciItems.length === 2, `got ${sciItems.length}`);

  // 10. Types present: at least one image, one video and one narration.
  const types = new Set(MEDIA_CATALOG.map((m) => m.type));
  check('the catalog covers images and video', types.has('image') && types.has('video'), [...types].join(','));
  check('the catalog carries at least one real narration track', MEDIA_CATALOG.some((m) => m.narration?.src), 'none');

  // 11. No words are baked into the diagram images (RTL rule): the SVG sources
  // may contain numeric callouts (digits, decimal points, operators) but no
  // letters. All wording lives in the catalog's localized legend/alt HTML, so a
  // diagram never shows a language that is not the child's.
  const withWords: string[] = [];
  for (const m of MEDIA_CATALOG.filter((x) => x.source.origin === 'authored_svg')) {
    const p = srcPath(m.src);
    if (!existsSync(p)) continue;
    const svg = readFileSync(p, 'utf8');
    const texts = [...svg.matchAll(/<text[^>]*>([\s\S]*?)<\/text>/gi)].map((mm) => mm[1].trim());
    if (texts.some((t) => /[^\s0-9.,+\-x×÷=<>()٠-٩٫٬]/.test(t))) withWords.push(m.id);
  }
  check('no words are baked into diagrams (numeric callouts only; labels are localized HTML)', withWords.length === 0, withWords.join(', '));

  console.log(`\n  media: ${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main();
