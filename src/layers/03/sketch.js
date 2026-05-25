export const grid = {
  rows: 160,
  cols: 80,
  show: false,
  color: '#2a2a4a',
};

const NUM_OF_POINTS = 20
const PATTERN = 10

// let points = [];

function generatePoints(count = 7) {
  const x = Array.from({ length: count }, (el, ix) => [
    floor(random(100)),
    floor(ix)
  ]);
  // console.log(x)
  return x
}


export function setup() {
    // points = generatePoints(NUM_OF_POINTS);
    fill("#ff9202")
    stroke("#ff9202")
    strokeWeight(2)
    // let points=[
    //   [0,0], [1,0], [2,0], [1,2], [3,3], [3,6], [2,6]
    // ]
    let points = generatePoints(101)
    for (let i = 0; i < points.length - 1; i++) {
      line(...cell(...points[i]), ...cell(...points[i + 1]));
    }

    let points_2 = Array.from({ length: 101 }, (el, ix) => [
      floor(ix),
      floor(random(80))
    ]);
    for (let i = 0; i < points_2.length - 1; i++) {
      line(...cell(...points_2[i]), ...cell(...points_2[i + 1]));
    }
    // line(...cell(0,0), ...cell(1,0))
    // line(...cell(1,0), ...cell(2,0))
    // line(...cell(2,0), ...cell(1,2))
    // line(...cell(1,2), ...cell(3,3))
    // line(...cell(3,3), ...cell(3,6))
    // line(...cell(3,6), ...cell(2,6))
}

let points = [
        [0,0], [1,0], [2,0]
    ]

export function draw() {


    
    // for (let i = 0; i < points.length - 1; i++) {
    //     line(...cell(...points[i]), ...cell(...points[i + 1]));
    // }

    // var prev_x = 0; 
    // var prev_y = 0;
    // for(var x=0; x<grid.cols/2+1; x++){  
    //     for(var y=0; y<4; y++){
    //         line(...cell(prev_x, prev_y), ...cell(x, Math.floor(Math.random()*5)))
    //         prev_x = x; 
    //         prev_y = y;
    //     }
    // }
   
    // for(var a=0;a<10;a++){
    //     for(var b=0;b<grid.cols/2;b++){

    //     }
    // }

    
    // for(var b=0;b<grid.cols/2;b++){
    //     var x = Math.floor(Math.random()*b)
    //     line(...cell(prev_x, prev_y), ...cell(x, b))
    //     prev_x = x; 
    //     prev_y = b;
    // }
}

export const reflect = [
  { axis: 'x', at: 0.5, angle: 90 },  
  { axis: 'y', at: 0.5 },  
];


