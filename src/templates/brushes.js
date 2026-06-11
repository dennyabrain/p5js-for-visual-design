// ── brush definitions ─────────────────────────────────────────────────────────
// Optional per-brush properties (all override the UI controls when set):
//   color  – hardcoded stroke color; the UI color picker is bypassed
//   closed – collect all stroke points and draw a single closed shape on mouse-up
//   hatch  – { spacing, angle } fills the closed shape interior (implies closed)
const BRUSH_DEFS = [
  {
    id: 'pencil',
    label: 'Pencil',
    closed: true,                     // implied by hatch, but explicit for clarity
    hatch: { spacing: 18, angle: 45 },
    config: {
      type: 'default',
      weight: 0.7,
      scatter: 4,
      sharpness: 0.85,
      grain: 0.8,
      opacity: 185,
      spacing: 0.12,
      noise: 0.3,
      pressure: { mode: 'gaussian', curve: [0.1, 0.2], min_max: [1.1, 0.85] },
      rotate: 'natural',
    },
  },
  {
    id: 'marker',
    label: 'Marker',
    closed: true,                     // implied by hatch, but explicit for clarity
    hatch: { spacing: 24, angle: 75 },
    config: {
      type: 'marker',
      weight: 4,
      opacity: 200,
      spacing: 0.03,
      pressure: { curve: [0.3, 0.2], min_max: [1.1, 0.9] },
    },
  },
  {
    id: 'ink',
    label: 'Ink',
    closed: true,                     // implied by hatch, but explicit for clarity
    hatch: { spacing: 10, angle: 70 },
    config: {
      type: 'default',
      weight: 0.4,
      scatter: 1,
      sharpness: 0.97,
      grain: 0.25,
      opacity: 240,
      spacing: 0.08,
      noise: 0.08,
      pressure: { mode: 'gaussian', curve: [0.3, 0.15], min_max: [1.5, 0.6] },
      rotate: 'fixed',
    },
  },
  {
    id: 'charcoal',
    label: 'Charcoal',
    config: {
      type: 'default',
      weight: 2.5,
      scatter: 14,
      sharpness: 0.28,
      grain: 0.95,
      opacity: 115,
      spacing: 0.08,
      noise: 0.65,
      pressure: { mode: 'gaussian', curve: [0.2, 0.3], min_max: [1.15, 0.85] },
      rotate: 'natural',
    },
  },
  {
    id: 'spray',
    label: 'Spray',
    config: {
      type: 'spray',
      weight: 1.8,
      scatter: 16,
      sharpness: 0.7,
      grain: 28,
      opacity: 95,
      spacing: 0.22,
      noise: 0.45,
      pressure: { mode: 'gaussian', curve: [0.2, 0.25], min_max: [0.8, 1.1] },
    },
  },
  // ── closed-shape brushes ────────────────────────────────────────────────────
  {
    id: 'outline',
    label: 'Outline',
    closed: true,                     // draw a closed shape on mouse-up
    config: {
      type: 'default',
      weight: 0.6,
      scatter: 3,
      sharpness: 0.88,
      grain: 0.55,
      opacity: 200,
      spacing: 0.1,
      noise: 0.15,
      pressure: { mode: 'gaussian', curve: [0.15, 0.2], min_max: [1.2, 0.8] },
      rotate: 'natural',
    },
  },
  {
    id: 'hatch',
    label: 'Hatch',
    closed: true,                     // implied by hatch, but explicit for clarity
    hatch: { spacing: 18, angle: 45 },
    color: '#1a1a2e',                 // hardcoded dark color for the hatch lines
    config: {
      type: 'default',
      weight: 0.45,
      scatter: 1.5,
      sharpness: 0.92,
      grain: 0.3,
      opacity: 210,
      spacing: 0.09,
      noise: 0.1,
      pressure: { mode: 'gaussian', curve: [0.2, 0.18], min_max: [1.15, 0.85] },
      rotate: 'fixed',
    },
  },
];