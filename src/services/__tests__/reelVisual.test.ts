/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Guards the reel's visual (owner ask: the feed must not be static).
 *
 * The audit measured 0 image / 0 video / 0 audio / 0 canvas inside a reel. This
 * suite locks in the fix at the model level: every reel the engine can build
 * produces a drawable visual, the visual is derived from the reel's own text,
 * and the number line only ever marks numbers that literally appear in it.
 *
 * No DOM and no canvas is used here: the model is a pure function, so the test
 * is deterministic and fast. The canvas painter is exercised separately, in a
 * browser, by the QA drive of the live app.
 */

import { buildReelsForConcept } from '../reels/reelGenerator';
import { buildReelVisualModel, isDrawableReelVisual, REEL_VISUAL_LABEL } from '../reels/reelVisual';
import { curriculumService } from '../curriculum/curriculumService';
import { Reel } from '../../types/reel';
import { readFileSync } from 'fs';
import { join } from 'path';

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

function everyReel(): Reel[] {
  const out: Reel[] = [];
  for (const lesson of curriculumService.getAllLessons()) {
    for (const concept of lesson.concepts) {
      out.push(...buildReelsForConcept(lesson, concept, 'ar'));
      out.push(...buildReelsForConcept(lesson, concept, 'en'));
    }
  }
  return out;
}

function main() {
  const reels = everyReel();
  check('the engine builds reels to inspect', reels.length > 50, `built ${reels.length}`);

  const undrawable = reels.filter((r) => !isDrawableReelVisual(buildReelVisualModel(r, true)));
  check(
    'every reel produces a drawable visual',
    undrawable.length === 0,
    undrawable.slice(0, 3).map((r) => r.id).join(', ')
  );

  // The visual is derived from the reel, not invented: every node label must be
  // a substring of the reel's own text (or of one of its options).
  const fabricated = reels.filter((r) => {
    const model = buildReelVisualModel(r, true);
    const haystack = [r.hook, r.show, r.noorLine, ...(r.options || []).map((o) => o.text)]
      .join(' ')
      .replace(/…/g, '');
    return model.nodes.some((n) => {
      const needle = n.replace(/…/g, '').trim();
      return needle.length > 0 && !haystack.includes(needle);
    });
  });
  check(
    'no visual label is invented outside the reel text',
    fabricated.length === 0,
    fabricated.slice(0, 3).map((r) => `${r.id}:${buildReelVisualModel(r, true).nodes.join('|')}`).join(' ; ')
  );

  // A question reel lays its options out as a concept map.
  const questionReel = reels.find((r) => r.options && r.options.length >= 2);
  check('a question reel exists to inspect', Boolean(questionReel));
  if (questionReel) {
    const model = buildReelVisualModel(questionReel, true);
    check('a question reel draws a concept map of its options', model.kind === 'concept_map', model.kind);
    check(
      'the concept map carries the option texts',
      questionReel.options!.slice(0, model.nodes.length).every((o, i) => model.nodes[i] === o.text)
    );
  }

  // A number line only marks numbers present in the reel.
  const numericReel: Reel = {
    ...(questionReel as Reel),
    options: undefined,
    hook: 'قارني بين 6,5 و 6,05',
    show: '6,5 أكبر من 6,05',
    noorLine: 'الفرق واضح: 6,50 و 6,05',
  };
  const numericModel = buildReelVisualModel(numericReel, true);
  check('a reel with real numbers draws a number line', numericModel.kind === 'number_line', numericModel.kind);
  check(
    'the number line only marks numbers that appear in the reel',
    (numericModel.marks || []).every((m) =>
      ['6,5', '6,05', '6,50'].some((n) => n.replace(',', '.') === String(m.value))
    ),
    JSON.stringify(numericModel.marks)
  );

  // Every kind the model can emit has a human label in all three languages.
  for (const kind of Object.keys(REEL_VISUAL_LABEL) as Array<keyof typeof REEL_VISUAL_LABEL>) {
    const label = REEL_VISUAL_LABEL[kind];
    check(`the "${kind}" visual has ar/en/fr labels`, Boolean(label.ar && label.en && label.fr));
  }

  // The component is actually mounted in the reel, and it is a real media element.
  const reelCard = readFileSync(join(process.cwd(), 'src/components/feed/ReelCard.tsx'), 'utf8');
  check('the reel renders <ReelVisual />', /<ReelVisual reel=\{reel\}/.test(reelCard));

  const visualComponent = readFileSync(join(process.cwd(), 'src/components/feed/ReelVisual.tsx'), 'utf8');
  check('the visual is a <canvas> element', /<canvas/.test(visualComponent));
  check(
    'the canvas carries an accessible description',
    /role="img"/.test(visualComponent) && /aria-label=\{/.test(visualComponent)
  );
  check(
    'reduced motion drops the animation but keeps the drawing',
    /reducedMotion \? '' : 'animate-in/.test(visualComponent)
  );

  const painter = readFileSync(join(process.cwd(), 'src/services/reels/reelVisualCanvas.ts'), 'utf8');
  check('the painter fetches no image asset', !/<img|new Image\(|url\(/.test(painter));
  check('the painter covers every structured visual kind', ['number_line', 'concept_map', 'timeline', 'comparison_table', 'map_like', 'stroke_guide', 'diagram'].every((k) => painter.includes(`case '${k}'`)));

  console.log(`\nREEL VISUAL SUITE SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  if (failed > 0) process.exit(1);
}

main();
