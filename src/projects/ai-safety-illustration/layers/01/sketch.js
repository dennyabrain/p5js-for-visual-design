export const grid = {
  rows: 8,
  cols: 8,
  // show: true,
  color: '#2a2a4a',
};

export const useBrush = true;

let _done = false;

export function setup() {
  brush.scaleBrushes(1.5);
  angleMode(DEGREES);

  brush.add("uli", {
    type:    "default",
    weight:  1.2,
    scatter: 32.95,
    sharpness: 0.3,
    grain:     0.9,
    opacity: 170,
    spacing: 0.3,
    noise:   0.5,
    pressure: {
      mode: "gaussian",
      curve: [0.23, 0.2],
      min_max: [1.1, 0.9],
    },
    rotate:  "natural",
  });
}

export function draw() {
  if (_done) return;
  _done = true;

  background(240);

  let colors = ["#03045e","#023e8a","#0077b6","#0096c7","#00b4d8","#48cae4","#90e0ef","#ade8f4","#caf0f8"]

  // for(let i=0;i<80;i++){
  //   rotate(36);
  //   let color = colors[Math.floor(Math.random() * colors.length)]
  //   brush.set('uli', color, random(12));
  //   let x = random(grid.rows)
  //   brush.line(...cell(x,random(grid.cols)), ...cell(x,random(grid.cols)))
  // }
}