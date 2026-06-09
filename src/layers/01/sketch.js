export const grid = {
  rows: 8,
  cols: 8,
  // show: true,
  color: '#2a2a4a',
};

export const useBrush = true;

export function setup() {
  brush.scaleBrushes(1.5);
  background(240);
  const [x1, y1] = cell(0, 0);
  const [x2, y2] = cell(5, 7);
  
  
  // brush.line(...cell(0,0), ...cell(1,8))
  // brush.line(...cell(1,0), ...cell(2,8))
  // brush.line(...cell(2,0), ...cell(3,8))
  // brush.line(...cell(3,0), ...cell(4,8))
  // brush.line(...cell(4,0), ...cell(5,8))
  // brush.line(...cell(5,0), ...cell(6,8))
  // brush.line(...cell(6,0), ...cell(7,8))
  // brush.line(...cell(7,0), ...cell(8,8))

  // for(var i=0; i<100; i++){
  //   let x = random(grid.rows) 
  //   brush.set('HB', '#001491', random(12));
  //   brush.line(...cell(x,random(grid.cols)), ...cell(x,random(grid.cols)))
  // }

  angleMode(DEGREES)

  brush.add("uli", {
    type:    "default",
    weight:  1.2,
    scatter: 18.95,
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

  let colors = ["#03045e","#023e8a","#0077b6","#0096c7","#00b4d8","#48cae4","#90e0ef","#ade8f4","#caf0f8"]

  
  for(let i=0;i<20;i++){
    rotate(36);
    // brush.set('HB', '#001491', random(12));
    let color = colors[Math.floor(Math.random() * colors.length)] 
    brush.set('uli', color, random(12));
    brush.line(...cell(2,0), ...cell(1,8))
  }

  

}

export function draw() {
  
}