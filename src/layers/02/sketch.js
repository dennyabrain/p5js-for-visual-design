export const grid = {
  rows: 40,
  cols: 20,
  show: false,
  color: '#2a2a4a22',
};

export function setup() {
  fill(255);
  noStroke();
  textAlign(LEFT, BASELINE);
  
  textSize(40);
  var [x,y] = cell(2,4, 'top-left')
  text('DAU DATASET', x-2,y );
  
  textSize(20);
  text('release event', ...cell(2,5, 'top-left'))
}

export function draw() {
  
}
