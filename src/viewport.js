const MIN_SCALE = 0.05;
const MAX_SCALE = 8;
const ZOOM_SPEED = 0.001;

export function initViewport(container) {
  let scale = 1;
  let tx = 0;
  let ty = 0;
  let isPanning = false;
  let lastX = 0;
  let lastY = 0;
  let spaceDown = false;

  const el = document.getElementById('app');

  function apply() {
    el.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
  }

  function fitToScreen() {
    const vw = container.clientWidth;
    const vh = container.clientHeight;
    const cw = el.offsetWidth;
    const ch = el.offsetHeight;
    scale = Math.min(vw / cw, vh / ch) * 0.9;
    tx = (vw - cw * scale) / 2;
    ty = (vh - ch * scale) / 2;
    apply();
  }

  function zoomAt(cx, cy, newScale) {
    newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, newScale));
    tx = cx - (cx - tx) * (newScale / scale);
    ty = cy - (cy - ty) * (newScale / scale);
    scale = newScale;
    apply();
  }

  // Wheel: zoom toward cursor
  container.addEventListener('wheel', (e) => {
    e.preventDefault();
    const rect = container.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const delta = -e.deltaY * ZOOM_SPEED;
    zoomAt(cx, cy, scale * (1 + delta));
  }, { passive: false });

  // Middle mouse or space+drag to pan
  container.addEventListener('mousedown', (e) => {
    if (e.button === 1 || (e.button === 0 && spaceDown)) {
      e.preventDefault();
      isPanning = true;
      lastX = e.clientX;
      lastY = e.clientY;
      container.classList.add('panning');
    }
  });

  window.addEventListener('mousemove', (e) => {
    if (!isPanning) return;
    tx += e.clientX - lastX;
    ty += e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    apply();
  });

  window.addEventListener('mouseup', (e) => {
    if (e.button === 1 || e.button === 0) {
      isPanning = false;
      container.classList.remove('panning');
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !e.repeat) {
      spaceDown = true;
      container.style.cursor = 'grab';
      e.preventDefault();
    }
    if (e.key === 'f' || e.key === 'F') fitToScreen();
    if (e.key === '0') fitToScreen();
  });

  window.addEventListener('keyup', (e) => {
    if (e.code === 'Space') {
      spaceDown = false;
      container.style.cursor = '';
    }
  });

  // Fit on load, and on resize
  fitToScreen();
  window.addEventListener('resize', fitToScreen);
}
