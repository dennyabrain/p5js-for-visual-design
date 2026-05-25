import { createFramework } from './framework/index.js';
import { initViewport } from './viewport.js';

createFramework({
  width: 432,
  height: 768,
  container: document.getElementById('app'),
});

initViewport(document.getElementById('viewport'));

document.getElementById('save-btn').addEventListener('click', () => {
  saveCanvas('sketch', 'png');
});
