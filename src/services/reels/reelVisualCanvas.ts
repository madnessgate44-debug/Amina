/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Draws a `ReelVisualModel` onto a 2D canvas.
 *
 * Kept apart from the React component so the geometry is a plain function of
 * (model, box) with no React and no globals. It paints with primitives only:
 * no image asset is fetched, so a reel costs zero extra network requests and
 * works offline, which is the point of a curriculum app used on a phone.
 */

import { ReelVisualModel } from './reelVisual';

export interface VisualPalette {
  ink: string;
  line: string;
  accent: string;
  accentSoft: string;
  text: string;
  textMuted: string;
}

export const DARK_PALETTE: VisualPalette = {
  ink: 'rgba(255,255,255,0.06)',
  line: 'rgba(255,255,255,0.22)',
  accent: '#26b8a8',
  accentSoft: 'rgba(38,184,168,0.18)',
  text: '#ffffff',
  textMuted: 'rgba(226,232,240,0.75)',
};

export interface DrawBox {
  width: number;
  height: number;
  isAr: boolean;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

/** Fit a single line of text into `maxWidth`, truncating with an ellipsis. */
function fitText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let out = text;
  while (out.length > 1 && ctx.measureText(`${out}…`).width > maxWidth) {
    out = out.slice(0, -1);
  }
  return `${out.trimEnd()}…`;
}

function drawNode(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  cy: number,
  w: number,
  h: number,
  palette: VisualPalette,
  fill = palette.ink
) {
  ctx.fillStyle = fill;
  roundRect(ctx, cx - w / 2, cy - h / 2, w, h, 10);
  ctx.fill();
  ctx.strokeStyle = palette.line;
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = palette.text;
  ctx.font = '600 12px system-ui, -apple-system, "Segoe UI", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(fitText(ctx, text, w - 14), cx, cy);
}

function connector(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  palette: VisualPalette
) {
  ctx.strokeStyle = palette.line;
  ctx.lineWidth = 1.25;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function drawNumberLine(
  ctx: CanvasRenderingContext2D,
  model: ReelVisualModel,
  box: DrawBox,
  palette: VisualPalette
) {
  const marks = model.marks || [];
  const padX = 26;
  const y = box.height * 0.62;
  const left = box.isAr ? box.width - padX : padX;
  const right = box.isAr ? padX : box.width - padX;

  ctx.strokeStyle = palette.line;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(left, y);
  ctx.lineTo(right, y);
  ctx.stroke();

  const values = marks.map((m) => m.value);
  const min = Math.min(...values, 0);
  const max = Math.max(...values, 1);
  const span = max - min || 1;
  const usable = box.width - padX * 2;

  marks.forEach((mark) => {
    const ratio = (mark.value - min) / span;
    const x = box.isAr ? right - ratio * usable : left + ratio * usable;

    ctx.strokeStyle = palette.accent;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y - 7);
    ctx.lineTo(x, y + 7);
    ctx.stroke();

    ctx.fillStyle = palette.accent;
    ctx.beginPath();
    ctx.arc(x, y, 3.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = palette.text;
    ctx.font = '700 13px system-ui, -apple-system, "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(fitText(ctx, mark.label, 64), x, y + 12);
  });
}

function drawConceptMap(
  ctx: CanvasRenderingContext2D,
  model: ReelVisualModel,
  box: DrawBox,
  palette: VisualPalette
) {
  const nodes = model.nodes;
  const cx = box.width / 2;
  const centerY = box.height * 0.42;
  const hubW = Math.min(box.width - 40, 220);
  const hubH = 44;

  const ringY = box.height - 34;
  const spacing = box.width / (nodes.length + 1);

  nodes.forEach((node, i) => {
    const x = spacing * (i + 1);
    connector(ctx, cx, centerY + hubH / 2, x, ringY - 18, palette);
    drawNode(ctx, node, x, ringY, Math.min(spacing - 12, 130), 36, palette, palette.accentSoft);
  });

  drawNode(ctx, model.title, cx, centerY, hubW, hubH, palette);
}

function drawDiagram(
  ctx: CanvasRenderingContext2D,
  model: ReelVisualModel,
  box: DrawBox,
  palette: VisualPalette
) {
  const nodes = model.nodes;
  const cx = box.width / 2;
  const boxW = Math.min(box.width - 60, 230);
  const boxH = 34;
  const gap = 14;
  const total = nodes.length * boxH + (nodes.length - 1) * gap;
  let y = (box.height - total) / 2 + boxH / 2;

  nodes.forEach((node, i) => {
    if (i > 0) {
      connector(ctx, cx, y - boxH / 2 - gap, cx, y - boxH / 2, palette);
    }
    drawNode(ctx, node, cx, y, boxW, boxH, palette, i === 0 ? palette.accentSoft : palette.ink);
    y += boxH + gap;
  });
}

function drawTimeline(
  ctx: CanvasRenderingContext2D,
  model: ReelVisualModel,
  box: DrawBox,
  palette: VisualPalette
) {
  const nodes = model.nodes;
  const padX = 28;
  const y = box.height / 2;
  const left = box.isAr ? box.width - padX : padX;
  const right = box.isAr ? padX : box.width - padX;

  ctx.strokeStyle = palette.line;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(left, y);
  ctx.lineTo(right, y);
  ctx.stroke();

  const spacing = (right - left) / Math.max(1, nodes.length - 1 || 1);
  nodes.forEach((node, i) => {
    const x = nodes.length === 1 ? (left + right) / 2 : left + spacing * i;
    ctx.fillStyle = palette.accent;
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = palette.textMuted;
    ctx.font = '600 11px system-ui, -apple-system, "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = i % 2 === 0 ? 'bottom' : 'top';
    const label = fitText(ctx, node, Math.abs(spacing) - 8);
    ctx.fillText(label, x, i % 2 === 0 ? y - 12 : y + 12);
  });
}

function drawComparisonTable(
  ctx: CanvasRenderingContext2D,
  model: ReelVisualModel,
  box: DrawBox,
  palette: VisualPalette
) {
  const rows = model.nodes.slice(0, 3);
  const padX = 22;
  const tableW = box.width - padX * 2;
  const rowH = Math.min(44, (box.height - 40) / Math.max(1, rows.length + 1));
  const colW = tableW / 2;
  const top = (box.height - rowH * (rows.length + 1)) / 2;

  ctx.strokeStyle = palette.line;
  ctx.lineWidth = 1;
  for (let r = 0; r <= rows.length + 1; r++) {
    const y = top + r * rowH;
    ctx.beginPath();
    ctx.moveTo(padX, y);
    ctx.lineTo(padX + tableW, y);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(padX, top);
  ctx.lineTo(padX, top + rowH * (rows.length + 1));
  ctx.moveTo(padX + tableW, top);
  ctx.lineTo(padX + tableW, top + rowH * (rows.length + 1));
  ctx.moveTo(padX + colW, top);
  ctx.lineTo(padX + colW, top + rowH * (rows.length + 1));
  ctx.stroke();

  ctx.font = '700 11px system-ui, -apple-system, "Segoe UI", sans-serif';
  ctx.fillStyle = palette.accent;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const headers = box.isAr ? ['الفكرة', 'الشرح'] : ['Idea', 'Detail'];
  ctx.fillText(headers[0], padX + colW / 2, top + rowH / 2);
  ctx.fillText(headers[1], padX + colW * 1.5, top + rowH / 2);

  ctx.fillStyle = palette.text;
  ctx.font = '600 12px system-ui, -apple-system, "Segoe UI", sans-serif';
  rows.forEach((row, i) => {
    const y = top + rowH * (i + 1) + rowH / 2;
    ctx.fillText(fitText(ctx, row, colW - 12), padX + colW / 2, y);
    ctx.fillText(fitText(ctx, model.caption, colW - 12), padX + colW * 1.5, y);
  });
}

function drawMapLike(
  ctx: CanvasRenderingContext2D,
  model: ReelVisualModel,
  box: DrawBox,
  palette: VisualPalette
) {
  const nodes = model.nodes;
  const padX = 30;
  const top = 22;
  const bottom = box.height - 22;
  const usable = box.width - padX * 2;

  const points = nodes.map((node, i) => {
    const t = nodes.length === 1 ? 0.5 : i / (nodes.length - 1);
    const x = padX + (box.isAr ? usable * (1 - t) : usable * t);
    const y = top + ((bottom - top) * (i % 2 === 0 ? 0.25 : 0.75));
    return { node, x, y };
  });

  ctx.strokeStyle = palette.accent;
  ctx.lineWidth = 1.5;
  ctx.setLineDash([5, 4]);
  ctx.beginPath();
  points.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
  ctx.stroke();
  ctx.setLineDash([]);

  points.forEach((p, i) => {
    ctx.fillStyle = palette.accent;
    ctx.beginPath();
    ctx.arc(p.x, p.y - 12, 4, 0, Math.PI * 2);
    ctx.fill();
    drawNode(ctx, p.node, p.x, p.y + 8, Math.min(usable, 140), 32, palette, i === 0 ? palette.accentSoft : palette.ink);
  });
}

function drawStrokeGuide(
  ctx: CanvasRenderingContext2D,
  model: ReelVisualModel,
  box: DrawBox,
  palette: VisualPalette
) {
  const padX = 26;
  const w = box.width - padX * 2;
  const h = Math.min(box.height - 24, 96);
  const top = (box.height - h) / 2;

  ctx.strokeStyle = palette.line;
  ctx.lineWidth = 1.5;
  ctx.setLineDash([6, 5]);
  roundRect(ctx, padX, top, w, h, 14);
  ctx.stroke();
  ctx.setLineDash([]);

  const innerPad = 14;
  ctx.strokeStyle = palette.accentSoft;
  ctx.lineWidth = 1;
  const innerH = (h - innerPad * 2) / Math.max(1, model.nodes.length);
  model.nodes.forEach((node, i) => {
    const y = top + innerPad + innerH * i;
    ctx.beginPath();
    ctx.moveTo(padX + innerPad, y);
    ctx.lineTo(padX + w - innerPad, y);
    ctx.stroke();
    ctx.fillStyle = palette.textMuted;
    ctx.font = '600 11px system-ui, -apple-system, "Segoe UI", sans-serif';
    ctx.textAlign = box.isAr ? 'right' : 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      fitText(ctx, node, w - innerPad * 2),
      box.isAr ? padX + w - innerPad : padX + innerPad,
      y + innerH / 2
    );
  });
}

/**
 * Paint the model. `box` is in CSS pixels; the caller has already scaled the
 * context by the device pixel ratio, so the drawing is crisp on a phone.
 */
export function drawReelVisual(
  ctx: CanvasRenderingContext2D,
  model: ReelVisualModel,
  box: DrawBox,
  palette: VisualPalette = DARK_PALETTE
) {
  ctx.clearRect(0, 0, box.width, box.height);
  ctx.save();
  ctx.direction = box.isAr ? 'rtl' : 'ltr';

  switch (model.kind) {
    case 'number_line':
      drawNumberLine(ctx, model, box, palette);
      break;
    case 'concept_map':
      drawConceptMap(ctx, model, box, palette);
      break;
    case 'timeline':
      drawTimeline(ctx, model, box, palette);
      break;
    case 'comparison_table':
      drawComparisonTable(ctx, model, box, palette);
      break;
    case 'map_like':
      drawMapLike(ctx, model, box, palette);
      break;
    case 'stroke_guide':
      drawStrokeGuide(ctx, model, box, palette);
      break;
    case 'diagram':
    default:
      drawDiagram(ctx, model, box, palette);
      break;
  }

  ctx.restore();
}
