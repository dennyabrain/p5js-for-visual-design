const registry = new Map();

/**
 * defineElement(name, fn)
 *   fn(w, h) — draws the element centered at (0,0) within the given width/height.
 *
 * stamp(name, x, y, { width, height, angle })
 *   Draws the named element at (x,y), rotated by `angle` (respects current angleMode).
 *
 * Example:
 *   defineElement('leaf', (w, h) => ellipse(0, 0, w, h));
 *   stamp('leaf', ...cell(2, 3), { width: 40, height: 60, angle: 45 });
 */
globalThis.defineElement = (name, fn) => {
  registry.set(name, fn);
};

globalThis.stamp = (name, x, y, { width = 50, height = 50, angle = 0 } = {}) => {
  const fn = registry.get(name);
  if (!fn) {
    console.warn(`stamp: element "${name}" is not defined`);
    return;
  }
  push();
  translate(x, y);
  rotate(angle);
  fn(width, height);
  pop();
};
