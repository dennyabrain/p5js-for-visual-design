/**
 * Injects all p5 public methods and properties onto globalThis as getters,
 * so layer sketches can use p5 global-mode syntax without a `p.` prefix.
 * Dynamic properties (mouseX, frameCount, width, etc.) stay live because
 * each getter reads from the p5 instance on access.
 */
export function injectP5Globals(p) {
  function define(key) {
    if (key === 'constructor' || key.startsWith('_')) return;
    const existing = Object.getOwnPropertyDescriptor(globalThis, key);
    if (existing && !existing.configurable) return;

    Object.defineProperty(globalThis, key, {
      get() {
        const val = p[key];
        return typeof val === 'function' ? val.bind(p) : val;
      },
      configurable: true,
    });
  }

  let proto = Object.getPrototypeOf(p);
  while (proto && proto !== Object.prototype) {
    Object.getOwnPropertyNames(proto).forEach(define);
    proto = Object.getPrototypeOf(proto);
  }
  Object.getOwnPropertyNames(p).forEach(define);
}
