/**
 * Returns a cell() function scoped to the given grid config.
 * cell(col, row, anchor?) → [x, y]  (0-indexed, spreadable into p5 calls)
 *
 * Anchors: 'center' (default), 'top', 'bottom', 'left', 'right'
 *
 * Uses p5 globals `width` and `height` so it's always current.
 *
 * Example:
 *   circle(...cell(2, 1), 40);
 *   line(...cell(0, 0, 'top'), ...cell(3, 3, 'bottom'));
 */
export function createCellFn(grid) {
  if (!grid) return () => { throw new Error('No grid configured for this layer'); };
  const { rows, cols } = grid;

  return function cell(col, row, anchor = 'center') {
    const cellW = width / cols;
    const cellH = height / rows;
    const x0 = col * cellW;
    const y0 = row * cellH;

    switch (anchor) {
      case 'top-left':    return [x0, y0];
      case 'top-right': return [x0 + cellW, y0];
      case 'bottom-left':   return [x0,              y0 + cellH];
      case 'bottom-right':  return [x0 + cellW,      y0 + cellH];
      default:       return [x0 + cellW / 2,  y0 + cellH / 2];
    }
  };
}

/**
 * Draws a grid overlay on the p5 canvas.
 * @param {import('p5')} p
 * @param {{ rows: number, cols: number, show: boolean, color: string }} config
 */
export function drawGrid(p, config) {
  if (!config || !config.show) return;

  const { rows, cols, color = '#ffffff' } = config;
  const cellW = p.width / cols;
  const cellH = p.height / rows;

  p.push();
  p.stroke(color);
  p.strokeWeight(1);
  p.noFill();

  for (let c = 1; c < cols; c++) {
    p.line(c * cellW, 0, c * cellW, p.height);
  }
  for (let r = 1; r < rows; r++) {
    p.line(0, r * cellH, p.width, r * cellH);
  }

  p.pop();
}
