/**
 * Reflection across a line through point (px, py) at angle θ (degrees from horizontal).
 *
 * Matrix form (p5 applyMatrix convention: x' = a*x + c*y + e, y' = b*x + d*y + f):
 *   a =  cos(2θ),  c = sin(2θ),  e = px*(1 - cos(2θ)) - py*sin(2θ)
 *   b =  sin(2θ),  d = -cos(2θ), f = py*(1 + cos(2θ)) - px*sin(2θ)
 */
function reflectionMatrix(px, py, angleDeg) {
  const t = (angleDeg * Math.PI) / 180;
  const cos2 = Math.cos(2 * t);
  const sin2 = Math.sin(2 * t);
  return {
    a: cos2,  b: sin2,
    c: sin2,  d: -cos2,
    e: px * (1 - cos2) - py * sin2,
    f: py * (1 + cos2) - px * sin2,
  };
}

// Matrix multiply: apply m1 first, then m2.
function compose(m1, m2) {
  return {
    a: m2.a * m1.a + m2.c * m1.b,
    b: m2.b * m1.a + m2.d * m1.b,
    c: m2.a * m1.c + m2.c * m1.d,
    d: m2.b * m1.c + m2.d * m1.d,
    e: m2.a * m1.e + m2.c * m1.f + m2.e,
    f: m2.b * m1.e + m2.d * m1.f + m2.f,
  };
}

const IDENTITY = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };

/**
 * Returns one transform pass per unique reflection combination.
 * N axes → 2^N passes (identity + all reflected copies).
 *
 * Axis config:
 *   { axis: 'x', at: 0.5 }          vertical mirror at x = 50% of width  (angle = 90°)
 *   { axis: 'y', at: 0.5 }          horizontal mirror at y = 50% of height (angle = 0°)
 *   { axis: 'x', at: 0.5, angle: 45 } 45° line through (50% width, 50% height)
 *
 * 'at' is normalized 0–1 (relative to canvas). Values > 1 treated as pixels.
 * 'angle' rotates the axis around its pivot point (degrees, default 90° for 'x', 0° for 'y').
 * Pivot: axis='x' → (pos, h/2),  axis='y' → (w/2, pos)
 */
export function getReflectionPasses(reflect, w, h) {
  if (!reflect?.length) return [IDENTITY];

  let passes = [IDENTITY];

  for (const { axis, at, angle } of reflect) {
    const pos = at <= 1 ? (axis === 'x' ? at * w : at * h) : at;
    const px  = axis === 'x' ? pos : w / 2;
    const py  = axis === 'y' ? pos : h / 2;
    const deg = angle ?? (axis === 'x' ? 90 : 0);
    const R   = reflectionMatrix(px, py, deg);

    passes = [...passes, ...passes.map(p => compose(p, R))];
  }

  return passes;
}
