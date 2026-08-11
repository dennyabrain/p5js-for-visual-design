export const grid = (w,h) => ({
  rows: h/32,
  cols: w/32,
  color: '#2a2a2a',
  // show: true
});

let patternColors = ["#734112","#f2c192"]

// Rectangles defined in grid-cell coordinates
const RECTS = [
    { x: 4,  y: 10,  w: 30, h: 20 },
    { x: 38,  y: 6,  w: 12, h: 14 },
    { x: 4,  y: 36,  w: 30, h: 20 },
    { x: 39,  y: 28,  w: 12, h: 28 },
    { x: 4,  y: 60,  w: 34, h: 14 },
]

// Signed distance to rectangle border: negative = inside
function rectSDF(px, py, rx, ry, rw, rh) {
    const cx = rx + rw / 2, cy = ry + rh / 2
    const dx = Math.abs(px - cx) - rw / 2
    const dy = Math.abs(py - cy) - rh / 2
    if (dx <= 0 && dy <= 0) return Math.max(dx, dy)
    return Math.sqrt(Math.max(dx, 0) ** 2 + Math.max(dy, 0) ** 2)
}

// shape: 'circle' | 'rect' | 'triangle' | 'diamond'
// opts for circle:    { size }
// opts for rect:      { w, h, angle }  — angle in degrees
// opts for triangle:  { size }
// opts for diamond:   { w, h }
function drawShape(x, y, shape, opts = {}) {
    switch (shape) {
        case 'circle':
            circle(x, y, opts.size ?? 8)
            break
        case 'rect': {
            const angleDeg = opts.angle ?? 0
            push()
            translate(x, y)
            rotate(angleDeg * Math.PI / 180)
            rectMode(CENTER)
            rect(0, 0, opts.w ?? 8, opts.h ?? 8)
            pop()
            break
        }
        case 'triangle': {
            const s = (opts.size ?? 8) / 2
            triangle(x, y - s, x + s, y + s, x - s, y + s)
            break
        }
        case 'diamond': {
            const hw = (opts.w ?? 8) / 2, hh = (opts.h ?? 8) / 2
            quad(x, y - hh, x + hw, y, x, y + hh, x - hw, y)
            break
        }
    }
}

export const PARAMS = {
    PATTERN_COUNT: {type: 'number', step: 1, min: 0, max: 25, default: 12},
    PATTERN_WIDTH: { type: 'number', step: 1, min: 0, max: 25, default: 7 },
    CELL_WIDTH: {type: 'number', step: 0.1, min: 0, max: 32, default: 32},
    CELL_HEIGHT: {type: 'number', step: 0.1, min: 0, max: 32, default: 14.5},
    ANGLE: {type: 'number', step: 1, min: -180, max: 180, default: 127},
    BORDER_ZONE: {type: 'number', step: 1, min: 0, max: 30, default: 10},
}

export function setup(params) {}

export function draw(params) {
    const { rows, cols } = grid(width, height)
    noStroke()

    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            let minDist = Infinity
            let inside = false

            for (const r of RECTS) {
                const d = rectSDF(j, i, r.x, r.y, r.w, r.h)
                if (d < 0) { inside = true; break }
                if (d < minDist) minDist = d
            }

            if (inside) continue

            let noiseVal = noise(j * 0.15, i * 0.15)
            let colorIdx

            if (minDist < params.BORDER_ZONE) {
                // Isocontour rings that coalesce around the rect border
                let t = 1 - minDist / params.BORDER_ZONE
                let offset = noiseVal * params.PATTERN_WIDTH * (1 - t * 0.7)
                colorIdx = Math.floor(minDist * 0.8 + offset)
            } else {
                colorIdx = Math.floor(noiseVal * params.PATTERN_COUNT)
            }

            fill(patternColors[colorIdx % patternColors.length])
            drawShape(...cell(j, i, 'left'), 'rect', { w: params.CELL_WIDTH, h: params.CELL_HEIGHT, angle: params.ANGLE })
            // drawShape(...cell(j, i, 'left'), 'diamond', { size: params.CELL_WIDTH })
        }
    }

    // Draw rect outlines on top
    noFill()
    // stroke('#2a2a2a')
    strokeWeight(2)
    rectMode(CORNER)
    for (const r of RECTS) {
        const [x1, y1] = cell(r.x, r.y, 'left')
        const [x2, y2] = cell(r.x + r.w, r.y + r.h, 'left')
        rect(x1, y1, x2 - x1, y2 - y1)
    }
}
