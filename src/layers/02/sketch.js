export const grid = {
  rows: 40,
  cols: 20,
  show: false,
  color: '#2a2a4a',
};

export function setup() {
    // stamp('leaf', ...cell(0, 0), { width: 40, height: 40, angle: 20 });
    for(var i=10;i<12;i++){
      var dim = 4*random(i)
      stamp('leaf', ...cell(random(i), random(i)), { width: dim, height: dim, angle: random(i*180) });
    }
}

defineElement('leaf', (w, h) => {
  fill("#ff0292")
  stroke("#ff0292")
//   ellipse(0, 0, w, h);
//   ellipse(2, 2, w, h);
  // arc(0,0,w/2,h/2, 0, HALF_PI)
  // arc(w/2,0,w,h, 0, HALF_PI)
  // arc(0,h/2,w,h, 0, HALF_PI)
//   line(w,0,w,h)
//   line(0,h,w,h)
  arc(0,0,w/2,h/2, 0, QUARTER_PI)
  arc(0,0,random(0.7)*w,random(0.7)*h, 1.4*QUARTER_PI, HALF_PI)
  arc(0,0,random(0.7)*w,random(0.7), 1.2*HALF_PI, HALF_PI+QUARTER_PI)
  arc(0,0,0.7*w,0.7*h, 1.1*(QUARTER_PI+HALF_PI), 1.2*PI)

});

export function draw() {
    
    // circle(...cell(1,1), 4)
    // circle(...cell(2,1), 4)

    // let x = 100 * noise(0.005 * frameCount);
    // let y = 100 * noise(0.005 * frameCount + 10000);
    // // Draw the point.
    // strokeWeight(5);
    // point(x, y);
    
    // stamp('leaf', mouseX, mouseY, { width: 20, height: 20 });
}

export const reflect = [
  { axis: 'x', at: 0.5 },  
  { axis: 'y', at: 0.5 },  
];


