import './elements.js';
import p5 from 'p5';
import { loadLayers } from './layer-manager.js';
import { drawGrid, createCellFn } from './grid.js';
import { injectP5Globals } from './p5-globals.js';
import { getReflectionPasses } from './reflect.js';

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
 * @param {{ width?: number, height?: number, container?: HTMLElement }} config
 */
export function createFramework({ width = 800, height = 600, container } = {}) {
  const layers = loadLayers();

  new p5((p) => {
    injectP5Globals(p);

    // Per-layer shader state for layers that have GLSL files.
    // { drawBuf: p5.Graphics, shaderBuf: p5.Graphics, shader: p5.Shader }
    const shaderState = new Map();

    p.setup = async () => {
      const canvas = p.createCanvas(width, height);
      if (container) canvas.parent(container);

      for (const { name, module, frag, vert } of layers) {
        globalThis.cell = createCellFn(module.grid);

        if (frag || vert) {
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
          const passes = getReflectionPasses(module.reflect, width, height);
          for (const { a, b, c, d, e, f } of passes) {
            p.push();
            p.applyMatrix(a, b, c, d, e, f);
            await module.setup?.();
            p.pop();
          }
        }
      }
    };

    p.draw = () => {
      for (const { name, module } of layers) {
        globalThis.cell = createCellFn(module.grid);
        const state = shaderState.get(name);

        if (state) {
          const { drawBuf, shaderBuf, resultBuf, compiled } = state;
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
