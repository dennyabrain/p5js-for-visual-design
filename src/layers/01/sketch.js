// import heroUrl from './hero.jpg';

// console.log(heroUrl)

export const grid = {
  rows: 10,
  cols: 6,
  show: false,
  color: '#2a2a4a22',
};

let img;

export async function setup() {
  img = await loadImage("/hero.jpg");
}

export function draw() {
  const [x1, y1] = cell(0, 6, 'top-left');
  const [x2, y2] = cell(5, 9, 'bottom-right');
  // image(img, x1, y1, x2 - x1, y2 - y1);

  // noStroke();
  textAlign(LEFT, BASELINE);
  // textSize(28);
  // for (let r = 2; r < grid.rows; r++) {
  //   for (let c = 0; c < grid.cols; c++) {
  //     circle(...cell(c, r), 20+10*Math.sin(c*r));
  //   }
  // }
}
