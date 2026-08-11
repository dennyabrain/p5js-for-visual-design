/**
 * Discovers and returns all project configs.
 * @returns {Array<{ slug: string, name: string, width?: number, height?: number }>}
 */
export function loadProjects() {
  const mods = import.meta.glob('../projects/*/project.js', { eager: true });
  return Object.entries(mods).map(([path, module]) => {
    const slug = path.match(/\/projects\/([^/]+)\//)?.[1] ?? path;
    return { slug, ...module };
  });
}

/**
 * Discovers and returns sorted layer modules for a given project slug.
 * @returns {Array<{ name: string, module: object, frag?: string, vert?: string, imageUrls: Record<string, string> }>}
 */
export function loadLayers(projectSlug) {
  const raw   = import.meta.glob('../projects/*/layers/*/sketch.js', { eager: true });
  const frags = import.meta.glob('../projects/*/layers/*/frag.glsl', { eager: true, query: '?raw', import: 'default' });
  const verts = import.meta.glob('../projects/*/layers/*/vert.glsl', { eager: true, query: '?raw', import: 'default' });
  const pngs  = import.meta.glob('../projects/*/layers/*/*.png',     { eager: true, query: '?url', import: 'default' });

  return Object.entries(raw)
    .filter(([path]) => path.includes(`/projects/${projectSlug}/`))
    .map(([path, module]) => {
      const name = path.match(/\/layers\/([^/]+)\//)?.[1] ?? path;
      const base = path.replace('sketch.js', '');
      const imageUrls = Object.fromEntries(
        Object.entries(pngs)
          .filter(([p]) => p.startsWith(base))
          .map(([p, url]) => [p.slice(base.length), url])
      );
      return {
        name,
        module,
        frag: frags[`${base}frag.glsl`],
        vert: verts[`${base}vert.glsl`],
        imageUrls,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
}
