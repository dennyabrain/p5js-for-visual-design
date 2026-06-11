import { createFramework } from './framework/index.js';
import { initViewport } from './viewport.js';
import { loadProjects } from './framework/layer-manager.js';

const params = new URLSearchParams(location.search);
const projectSlug = params.get('project');

if (projectSlug) {
  showProject(projectSlug);
} else {
  showHome();
}

function showProject(slug) {
  const project = loadProjects().find(p => p.slug === slug);
  if (!project) { location.replace('/'); return; }

  document.getElementById('home').style.display = 'none';
  document.getElementById('project-view').style.display = '';
  document.title = `${project.name} — p5-live`;

  createFramework({
    width: project.width ?? 1080,
    height: project.height ?? 1920,
    projectSlug: slug,
    container: document.getElementById('app'),
  });
  initViewport(document.getElementById('viewport'));

  document.getElementById('save-btn').addEventListener('click', () => {
    saveCanvas('sketch', 'png');
  });

  document.getElementById('back-btn').addEventListener('click', () => {
    location.href = location.pathname;
  });
}

function showHome() {
  document.getElementById('project-view').style.display = 'none';
  const projects = loadProjects();
  const grid = document.getElementById('project-grid');
  grid.innerHTML = projects.map(({ slug, name, width = 1080, height = 1920 }) => `
    <a class="project-card" href="?project=${slug}">
      <div class="project-card__name">${name}</div>
      <div class="project-card__meta">${width} × ${height}</div>
    </a>
  `).join('');
}
