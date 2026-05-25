/**
 * Discovers and returns sorted layer modules via Vite's import.meta.glob.
 * Each module should export: draw(p), optional setup(p), optional grid config.
 * Layers may also include frag.glsl / vert.glsl for a post-process shader pass.
 *
 * @returns {Array<{ name: string, module: object, frag?: string, vert?: string }>}
 */
export function loadLayers() {
  const raw   = import.meta.glob('../layers/*/sketch.js', { eager: true });
  const frags = import.meta.glob('../layers/*/frag.glsl', { eager: true, query: '?raw', import: 'default' });
  const verts = import.meta.glob('../layers/*/vert.glsl', { eager: true, query: '?raw', import: 'default' });

  return Object.entries(raw)
    .map(([path, module]) => {
      const name = path.match(/\/layers\/([^/]+)\//)?.[1] ?? path;
      const base = path.replace('sketch.js', '');
      return {
        name,
        module,
        frag: frags[`${base}frag.glsl`],
        vert: verts[`${base}vert.glsl`],
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
}
