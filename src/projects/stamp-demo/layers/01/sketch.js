export const grid = {
  cellSize: 60,
  show: true,
  color: '#333355',
};

export const PARAMS = {
  crescentAngle: { type: 'number', min: 0, max: 360, step: 1, default: 0 },
  circleRadius:  { type: 'number', min: 20, max: 400, step: 1, default: 200 },
};

const colors = ['#845ec2', '#00c9a7', '#fbeaff', '#ff6f91'];

defineElement('crescent', (w, h) => {
  const r = w * 0.5;
  const offset = r * 0.4;
  fill(currentColor);
  noStroke();
  beginShape();
  for (let a = 0; a < TWO_PI; a += 0.05) {
    vertex(cos(a) * r, sin(a) * r);
  }
  beginContour();
  // inner circle counter-clockwise to cut a hole
  for (let a = TWO_PI; a > 0; a -= 0.05) {
    vertex(offset + cos(a) * r * 0.72, sin(a) * r * 0.72);
  }
  endContour();
  endShape(CLOSE);
});

let currentColor = '#845ec2';

export function setup() {}

export function beforeDraw() {
  background('#1a1a2e');
}

export function draw({ crescentAngle, circleRadius }) {
  noStroke();

  // Simple Stamp Feature
  // stamp('crescent', ...cell(2, 2), { width: grid.cellSize * 0.8, height: grid.cellSize * 0.8 });

  // Parametrized Stamp
  // const angle = radians(crescentAngle);
  // stamp('crescent', ...cell(2, 2), { width: grid.cellSize * 0.8, height: grid.cellSize * 0.8, angle });

  // Column of stamps with noise-driven angles
  // for(var col=0;col<cols;col++){
  //   const angle = map(noise(col * 0.3, col * 0.3), 0, 1, 0, TWO_PI);
  //   stamp('crescent', ...cell(0, col), { width: grid.cellSize * 0.8, height: grid.cellSize * 0.8, angle });
  // }

  // Radial burst: crescents along a circle's boundary, pointing outward
  const cx = width / 2;
  const cy = height / 2;
  const count = 16;
  for (let i = 0; i < count; i++) {
    const a = (TWO_PI / count) * i;
    const x = cx + cos(a) * circleRadius;
    const y = cy + sin(a) * circleRadius;
    currentColor = colors[i % colors.length];
    stamp('crescent', x, y, { width: grid.cellSize , height: grid.cellSize * 0.8, angle: a });
  }
}
