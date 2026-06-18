import * as dat from 'dat.gui';

/**
 * Builds a dat.gui panel from each layer's exported PARAMS.
 * Returns a Map<layerName, stateObject> where each stateObject is mutated
 * live by the GUI — pass it directly to setup()/draw() for reactive params.
 *
 * PARAMS schema (in sketch.js):
 *   export const PARAMS = {
 *     MY_VAL: { type: 'number', min: 0, max: 100, step: 1, default: 50 },
 *     LABEL:  { type: 'string', default: 'hello' },
 *     ACTIVE: { type: 'boolean', default: true },
 *   }
 */
export function buildParamsPanel(layers) {
  const stateMap = new Map();
  const activeLayers = layers.filter(({ module }) => module.PARAMS);
  if (activeLayers.length === 0) return stateMap;

  const gui = new dat.GUI({ name: 'Sketch Params' });

  for (const { name, module } of activeLayers) {
    const state = {};
    for (const [key, spec] of Object.entries(module.PARAMS)) {
      state[key] = spec.default;
    }
    stateMap.set(name, state);

    const folder = activeLayers.length > 1 ? gui.addFolder(name) : gui;

    for (const [key, spec] of Object.entries(module.PARAMS)) {
      if (spec.type === 'number' && spec.min != null && spec.max != null) {
        const ctrl = folder.add(state, key, spec.min, spec.max);
        if (spec.step != null) ctrl.step(spec.step);
      } else {
        folder.add(state, key);
      }
    }

    if (activeLayers.length > 1) folder.open();
  }

  return stateMap;
}
