import './elements.js';
import p5 from 'p5';
import { loadLayers } from './layer-manager.js';
import { drawGrid, createCellFn } from './grid.js';
import { injectP5Globals } from './p5-globals.js';
import { getReflectionPasses } from './reflect.js';

// p5.brush checks `typeof p5` (the global) before calling p5.registerAddon.
// Since p5 is an ES module it doesn't set window.p5, so we must set it first,
// then dynamically import p5.brush so its module-level registration code runs
// after the global is in place.
globalThis.p5 = p5;
const brush = await import('p5.brush');

// Passthrough vert — applies p5's model/projection matrices so rect() fills correctly.
const DEFAULT_VERT = `precision mediump float;
attribute vec3 aPosition;
attribute vec2 aTexCoord;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform float uTime;
varying vec2 vTexCoord;
void main() {
  vTexCoord = vec2(aTexCoord.x, 1.0 - aTexCoord.y);
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
}`;


/**
 * Wraps the p5.brush module so all coordinate arguments are automatically
 * shifted from top-left origin to the WEBGL center origin that brush uses
 * internally. Sketch code can use (0,0) = top-left as with normal p5.
 */
function makeBrushProxy(b, ox, oy) {
  // Functions whose first two args are (x, y, ...)
  const xy = new Set(['circle', 'arc', 'rect', 'polygon', 'wash', 'clip', 'wiggle']);
  // Functions whose first four args are (x1, y1, x2, y2, ...)
  const xyxy = new Set(['line', 'flowLine']);

  return new Proxy(b, {
    get(target, prop) {
      const fn = target[prop];
      if (typeof fn !== 'function') return fn;
      if (prop === 'vertex') {
        return (x, y) => fn.call(target, x - ox, y - oy);
      }
      if (prop === 'spline') {
        // alternating x,y pairs
        return (...args) => {
          const shifted = args.map((v, i) => typeof v === 'number' ? (i % 2 === 0 ? v - ox : v - oy) : v);
          return fn.apply(target, shifted);
        };
      }
      if (xy.has(prop)) {
        return (x, y, ...rest) => fn.call(target, x - ox, y - oy, ...rest);
      }
      if (xyxy.has(prop)) {
        return (x1, y1, x2, y2, ...rest) => fn.call(target, x1 - ox, y1 - oy, x2 - ox, y2 - oy, ...rest);
      }
      return fn.bind(target);
    }
  });
}

/**
 * @param {{ width?: number, height?: number, container?: HTMLElement }} config
 */
export function createFramework({ width = 800, height = 600, container } = {}) {
  const layers = loadLayers();
  const brushProxy = makeBrushProxy(brush, width / 2, height / 2);

  new p5((p) => {
    injectP5Globals(p);
    brush.instance(p);

    // Per-layer shader state for layers that have GLSL files.
    // { drawBuf: p5.Graphics, shaderBuf: p5.Graphics, shader: p5.Shader }
    const shaderState = new Map();

    // Per-layer brush state for layers that export useBrush = true.
    // { brushBuf: p5.Graphics }
    const brushState = new Map();

    p.setup = async () => {
      // p5.brush requires WEBGL on the main canvas.
      const canvas = p.createCanvas(width, height, p.WEBGL);
      if (container) canvas.parent(container);

      for (const { name, module, frag, vert } of layers) {
        globalThis.cell = createCellFn(module.grid);

        if (module.useBrush) {
          brushState.set(name, true);
          globalThis.brush = brushProxy;
          injectP5Globals(p);
          await module.setup?.();
          injectP5Globals(p);
        } else if (frag || vert) {
          const drawBuf   = p.createGraphics(width, height);
          const shaderBuf = p.createGraphics(width, height, p.WEBGL);
          const resultBuf = p.createGraphics(width, height);
          const compiled  = shaderBuf.createShader(vert ?? DEFAULT_VERT, frag);
          shaderState.set(name, { drawBuf, shaderBuf, resultBuf, compiled });

          injectP5Globals(drawBuf);
          const passes = getReflectionPasses(module.reflect, width, height);
          for (const { a, b, c, d, e, f } of passes) {
            drawBuf.push();
            drawBuf.applyMatrix(a, b, c, d, e, f);
            await module.setup?.();
            drawBuf.pop();
          }
          injectP5Globals(p);
        } else {
          // Plain layer: main canvas is WEBGL, translate to restore top-left origin.
          p.push();
          p.translate(-width / 2, -height / 2);
          const passes = getReflectionPasses(module.reflect, width, height);
          for (const { a, b, c, d, e, f } of passes) {
            p.push();
            p.applyMatrix(a, b, c, d, e, f);
            await module.setup?.();
            p.pop();
          }
          p.pop();
        }
      }
    };

    p.draw = () => {
      // WEBGL canvas has center origin; shift to top-left for consistent coordinates.
      p.translate(-width / 2, -height / 2);

      for (const { name, module } of layers) {
        globalThis.cell = createCellFn(module.grid);
        const brushSt  = brushState.get(name);
        const shaderSt = shaderState.get(name);

        if (brushSt) {
          globalThis.brush = brushProxy;
          // Brush layers draw directly onto the main WEBGL canvas so that
          // p5.brush's auto-flush (which fires at the end of p.draw) lands on
          // the correct target. brush.load(buffer) defers the flush, causing
          // strokes to be lost by the time we composite.
          injectP5Globals(p);
          drawGrid(p, module.grid);
          const passes = getReflectionPasses(module.reflect, width, height);
          for (const { a, b, c, d, e, f } of passes) {
            p.push();
            p.applyMatrix(a, b, c, d, e, f);
            module.draw?.();
            p.pop();
          }
        } else if (shaderSt) {
          const { drawBuf, shaderBuf, resultBuf, compiled } = shaderSt;
          drawGrid(drawBuf, module.grid);

          injectP5Globals(drawBuf);
          const passes = getReflectionPasses(module.reflect, width, height);
          for (const { a, b, c, d, e, f } of passes) {
            drawBuf.push();
            drawBuf.applyMatrix(a, b, c, d, e, f);
            module.draw?.();
            drawBuf.pop();
          }
          injectP5Globals(p);

          // Pass 1: user shader into shaderBuf
          shaderBuf.clear();
          shaderBuf.shader(compiled);
          compiled.setUniform('uLayer', drawBuf);
          compiled.setUniform('uTime',  p.millis() / 1000);
          shaderBuf.noStroke();
          shaderBuf.rect(-width / 2, -height / 2, width, height);

          // Pass 2: copy shader result into a 2D buffer, then clip to original
          // layer alpha using destination-in. This avoids relying on the WEBGL
          // buffer's alpha channel, which p5 may create without alpha support.
          resultBuf.clear();
          resultBuf.image(shaderBuf, 0, 0);
          resultBuf.drawingContext.globalCompositeOperation = 'destination-in';
          resultBuf.image(drawBuf, 0, 0);
          resultBuf.drawingContext.globalCompositeOperation = 'source-over';

          p.image(resultBuf, 0, 0);
        } else {
          drawGrid(p, module.grid);
          const passes = getReflectionPasses(module.reflect, p.width, p.height);
          for (const { a, b, c, d, e, f } of passes) {
            p.push();
            p.applyMatrix(a, b, c, d, e, f);
            module.draw?.();
            p.pop();
          }
        }
      }
    };
  });
}
