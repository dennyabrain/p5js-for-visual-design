import { createFramework } from './framework/index.js';

createFramework({
  width: 432,
  height: 768,
  container: document.getElementById('app'),
});

document.getElementById('save-btn').addEventListener('click', () => {
  saveCanvas('sketch', 'png');
});
