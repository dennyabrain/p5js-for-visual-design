export const useBrush = true;
export const grid = { rows: 1, cols: 1, show: false };

// ── state ─────────────────────────────────────────────────────────────────────
let activeBrush = 'pencil';
let activeColor = '#1a1a2e';
let brushScale = 1.0;
let uiActive = false;
let clearFlag = false;

// Closed-shape mode: collect points while dragging, draw on mouse-up.
let strokePoints = [];
let wasPressed = false;

// p5's mouseX/mouseY use canvas.scrollWidth (CSS width, ignoring parent CSS
// transforms) as the scale divisor, so coordinates are in screen-pixels rather
// than canvas-pixels when the viewport is zoomed. We invert the CSS transform
// ourselves using getBoundingClientRect for zoom-invariant positions.
let _canvas = null;
let _overlay = null;
let _overlayCtx = null;
let mx = 0, my = 0, pmx = 0, pmy = 0;

function _canvasPos(winX, winY) {
  const rect = _canvas.getBoundingClientRect();
  return [
    (winX - rect.left) * (1080 / rect.width),
    (winY - rect.top)  * (1920 / rect.height),
  ];
}

// ── brush definitions ─────────────────────────────────────────────────────────
// Optional per-brush properties (all override the UI controls when set):
//   color    – hardcoded stroke color; the UI color picker is bypassed
//   closed   – collect all stroke points and draw a single closed shape on mouse-up
//   hatch    – { spacing, angle } fills the closed shape interior (implies closed)
//   boundary – (default true) set to false to suppress the outline; only the
//              hatch fill is drawn. Requires hatch to be set.
const BRUSH_DEFS = [
  {
    id: 'pencil',
    label: 'Pencil',
    closed: true,                     // implied by hatch, but explicit for clarity
    boundary: false,
    hatch: { spacing: 20, angle: 45, },
    config: {
      type: 'default',
      weight: 0.7,
      scatter: 4,
      sharpness: 0.85,
      grain: 0.8,
      opacity: 185,
      spacing: 0.12,
      noise: 0.3,
      pressure: { mode: 'gaussian', curve: [0.1, 0.2], min_max: [1.1, 0.85] },
      rotate: 'natural',
    },
  },
  {
    id: 'pencil-two',
    label: 'Pencil Two',
    closed: true,                     // implied by hatch, but explicit for clarity
    boundary: false,
    hatch: { spacing: 12, angle: 25 },
    config: {
      type: 'default',
      weight: 0.7,
      scatter: 4,
      sharpness: 0.85,
      grain: 0.8,
      opacity: 185,
      spacing: 0.12,
      noise: 0.3,
      pressure: { mode: 'gaussian', curve: [0.1, 0.2], min_max: [1.1, 0.85] },
      rotate: 'natural',
    },
  },

    {
    id: 'pencil-three',
    label: 'Pencil Three',
    closed: true,                     // implied by hatch, but explicit for clarity
    boundary: false,
    hatch: { spacing: 4, angle: 75 },
    config: {
      type: 'default',
      weight: 0.7,
      scatter: 4,
      sharpness: 0.85,
      grain: 0.8,
      opacity: 185,
      spacing: 0.12,
      noise: 0.3,
      pressure: { mode: 'gaussian', curve: [0.1, 0.2], min_max: [1.1, 0.85] },
      rotate: 'natural',
    },
  },
  {
    id: 'pencil-four',
    label: 'Pencil Four',
    closed: true,                     // implied by hatch, but explicit for clarity
    boundary: false,
    hatch: { spacing: 4, angle: 12 },
    config: {
      type: 'default',
      weight: 0.7,
      scatter: 4,
      sharpness: 0.85,
      grain: 0.8,
      opacity: 185,
      spacing: 0.12,
      noise: 0.3,
      pressure: { mode: 'gaussian', curve: [0.1, 0.2], min_max: [1.1, 0.85] },
      rotate: 'natural',
    },
  },
  {
    id: 'ink',
    label: 'Ink',
    config: {
      type: 'default',
      weight: 0.4,
      scatter: 1,
      sharpness: 0.97,
      grain: 0.25,
      opacity: 240,
      spacing: 0.08,
      noise: 0.08,
      pressure: { mode: 'gaussian', curve: [0.3, 0.15], min_max: [1.5, 0.6] },
      rotate: 'fixed',
    },
  },
];

const PALETTE = [
  '#1a1a2e', '#e63946', '#2a9d8f',
  '#e9c46a', '#f4a261', '#457b9d',
  '#7b2d8b', '#f5f0e8',
];

// ── setup ─────────────────────────────────────────────────────────────────────
export function setup() {
  _canvas = document.querySelector('#app canvas');
  _overlay = document.createElement('canvas');
  _overlay.width = 1080;
  _overlay.height = 1920;
  _overlay.style.cssText = 'position:absolute;top:0;left:0;pointer-events:none;';
  document.getElementById('app').appendChild(_overlay);
  _overlayCtx = _overlay.getContext('2d');

  for (const { id, config } of BRUSH_DEFS) {
    brush.add(id, config);
  }

  // brush.mass("pastel", "#4b6cb7", {
  //   precision: 0.55,
  //   strength: 0.9,
  //   gradient: 0.35,
  //   outline: true,
  // });
  // brush.circle(width / 2, height / 2, 180);
  background(252, 248, 243);
  _buildPanel();
}

// ── draw ──────────────────────────────────────────────────────────────────────
export function draw() {
  pmx = mx;
  pmy = my;
  [mx, my] = _canvasPos(winMouseX, winMouseY);

  if (clearFlag) {
    background(252, 248, 243);
    strokePoints = [];
    _overlayCtx.clearRect(0, 0, 1080, 1920);
    clearFlag = false;
  }

  const def = BRUSH_DEFS.find(b => b.id === activeBrush);
  const isClosed = def.closed || !!def.hatch;
  const drawColor = def.color ?? activeColor;
  const isDrawing = mouseIsPressed && !uiActive;
  const justReleased = wasPressed && !isDrawing;
  wasPressed = isDrawing;

  if (isClosed) {
    if (isDrawing) {
      strokePoints.push([mx, my]);
      _drawPreview(drawColor);
    } else if (justReleased && strokePoints.length >= 3) {
      _overlayCtx.clearRect(0, 0, 1080, 1920);
      if (def.hatch) {
        brush.hatch(def.hatch.spacing, def.hatch.angle);
      }
      // boundary: false — suppress the outline stroke but keep hatch active.
      // brush.hatchStyle() tells the hatch system which brush to use for its
      // own scanlines, so it can re-enable stroke internally even though
      // noStroke() has disabled it for the shape outline.
      if (def.boundary === false) {
        brush.hatchStyle(def.id, drawColor, brushScale);
        brush.noStroke();
      } else {
        brush.set(def.id, drawColor, brushScale);
      }
      brush.beginShape(0.5);
      for (const [x, y] of strokePoints) {
        brush.vertex(x, y);
      }
      brush.endShape(true);
      if (def.hatch) {
        brush.noHatch();
      }
      strokePoints = [];
    } else if (justReleased) {
      _overlayCtx.clearRect(0, 0, 1080, 1920);
    }
  } else {
    strokePoints = [];
    if (isDrawing) {
      brush.set(def.id, drawColor, brushScale);
      brush.line(pmx, pmy, mx, my);
    }
  }
}

function _drawPreview(color) {
  const ctx = _overlayCtx;
  ctx.clearRect(0, 0, 1080, 1920);
  if (strokePoints.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(strokePoints[0][0], strokePoints[0][1]);
  for (let i = 1; i < strokePoints.length; i++) {
    ctx.lineTo(strokePoints[i][0], strokePoints[i][1]);
  }
  ctx.closePath();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.setLineDash([8, 5]);
  ctx.globalAlpha = 0.55;
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.globalAlpha = 1;
}

// ── UI ────────────────────────────────────────────────────────────────────────
function _buildPanel() {
  document.getElementById('draw-panel')?.remove();

  const panel = document.createElement('div');
  panel.id = 'draw-panel';

  const brushBtns = BRUSH_DEFS.map(({ id, label, color, closed, hatch }) => {
    const badges = [
      closed || hatch ? '<span class="dp-badge">closed</span>' : '',
      color ? `<span class="dp-color-dot" style="background:${color}"></span>` : '',
    ].join('');
    return `<button class="dp-brush${id === activeBrush ? ' active' : ''}" data-brush="${id}">${label}${badges}</button>`;
  }).join('');

  const swatches = PALETTE.map(c =>
    `<button class="dp-swatch${c === activeColor ? ' active' : ''}" data-color="${c}" style="background:${c}" title="${c}"></button>`
  ).join('');

  const activeDef = BRUSH_DEFS.find(b => b.id === activeBrush);
  const colorLocked = !!activeDef?.color;

  panel.innerHTML = `
    <div class="dp-inner">
      <div class="dp-brushes">${brushBtns}</div>
      <div class="dp-divider"></div>
      <div class="dp-colors${colorLocked ? ' dp-colors--locked' : ''}">
        ${swatches}
        <label class="dp-custom-color" title="Custom color">
          <span>+</span>
          <input type="color" id="dp-color-input" value="${activeColor}">
        </label>
      </div>
      <div class="dp-divider"></div>
      <label class="dp-size">
        <span>Size</span>
        <input type="range" id="dp-size-input" min="0.3" max="5" step="0.1" value="${brushScale}">
      </label>
      <button id="dp-clear">Clear</button>
    </div>
  `;

  document.body.appendChild(panel);

  panel.addEventListener('mousedown', (e) => {
    e.stopPropagation();
    uiActive = true;
  });
  document.addEventListener('mouseup', () => { uiActive = false; });

  panel.querySelectorAll('.dp-brush').forEach(btn => {
    btn.addEventListener('click', () => {
      activeBrush = btn.dataset.brush;
      strokePoints = [];
      panel.querySelectorAll('.dp-brush').forEach(b => b.classList.toggle('active', b === btn));
      const def = BRUSH_DEFS.find(b => b.id === activeBrush);
      panel.querySelector('.dp-colors').classList.toggle('dp-colors--locked', !!def?.color);
    });
  });

  panel.querySelectorAll('.dp-swatch').forEach(sw => {
    sw.addEventListener('click', () => {
      activeColor = sw.dataset.color;
      _syncColor(panel, activeColor);
    });
  });

  panel.querySelector('#dp-color-input').addEventListener('input', (e) => {
    activeColor = e.target.value;
    panel.querySelectorAll('.dp-swatch').forEach(s => s.classList.remove('active'));
  });

  panel.querySelector('#dp-size-input').addEventListener('input', (e) => {
    brushScale = parseFloat(e.target.value);
  });

  panel.querySelector('#dp-clear').addEventListener('click', () => {
    clearFlag = true;
  });
}

function _syncColor(panel, color) {
  panel.querySelectorAll('.dp-swatch').forEach(s => s.classList.toggle('active', s.dataset.color === color));
  panel.querySelector('#dp-color-input').value = color;
}
