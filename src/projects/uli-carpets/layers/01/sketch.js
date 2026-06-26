export const grid = (w,h) => ({
  rows: h/8,
  cols: w/8,
//   show: true,
  color: '#2a2a2a',
});

let patternColors = ["#734112","#f2c192"]

function drawPatternTokens(ix){
    var patternMakers = [

    ]
}

function drawCircle(x,y,radius){
    fill("#FFFFFF")
    rectMode(CENTER)
    rect(x,y,radius,radius)
    fill("red")
    circle(x,y,radius)
}

defineElement('joystick', (w, h) => {
  noStroke()

  // base plate — depth shadow
  fill(patternColors[1])
  ellipse(w/2, h * 0.86, w * 0.84, h * 0.20)

  // base plate — top face
  fill(patternColors[0])
  ellipse(w/2, h * 0.80, w * 0.84, h * 0.20)

  // shaft — tapered trapezoid, wider at base
  fill(patternColors[1])
  quad(
    w/2 - w*0.045, h * 0.18,
    w/2 + w*0.045, h * 0.18,
    w/2 + w*0.085, h * 0.73,
    w/2 - w*0.085, h * 0.73
  )

  // ball
  fill(patternColors[0])
  circle(w/2, h * 0.14, w * 0.28)
});

export const PARAMS = {
    PATTERN_COUNT: {type: 'number', step: 1, min: 0, max: 25, default: 12},
    PATTERN_OFFSET: { type: 'number', step: 1, min: 0, max: 25, default: 3 },
    PATTERN_WIDTH: { type: 'number', step: 1, min: 0, max: 25, default: 7 },
    HEADING: { type: 'string', default: 'Poster Headline' },
    CELL_WIDTH: {type: 'number', step: 0.1, min: 0, max: 32, default: 6.2},
    ELLIPSE_WIDTH: {type: 'number', step: 1, min: 10, max: 120, default: 24}
}

// function getEllipseY(x,a,b,h,k){
//     return Math.floor(Math.pow((1-(Math.pow(x-h,2)/a*a)*b*b), 1/2) + k)
// }
function getEllipseY(x,a,b,h,k){
    const inner = 1 - ((x - h) ** 2) / (a ** 2);
    // if (inner < 0) return null; // x is outside ellipse bounds 
    const offset = b * Math.sqrt(inner);
    return [k + offset, k - offset]; // [upper, lower]
}

export function setup(params) {
   
}

export function draw(params) {
    const { rows, cols } = grid(width, height)
    noStroke()
    rectMode(CORNERS)

    // drawCircle(8,8,16)
    
    
    

    for(var x=0;x<params.PATTERN_COUNT;x++){
        fill(patternColors[x%patternColors.length])
        for(var i=x*params.PATTERN_OFFSET;i<cols/2;i++){
            var j = x*params.PATTERN_OFFSET+Math.floor(params.PATTERN_WIDTH*noise(0.9*i))
            circle(...cell(i,j,'left'), params.CELL_WIDTH)
            // rect(...cell(i,j,'left'),480,480)
            // drawCircle(...cell(i,j),params.CELL_WIDTH)
        }
        for(var i=x*params.PATTERN_OFFSET;i<rows/2;i++){
            var j = x*params.PATTERN_OFFSET+Math.floor(params.PATTERN_WIDTH*noise(0.9*i))
            circle(...cell(j,i,'left'), params.CELL_WIDTH)
            // rect(...cell(j,i,'left'),480,480)
            // drawCircle(...cell(i,j),params.CELL_WIDTH)
        }
    }
    
    // rect(0,0,8,8)

    // for(var i=0;i<cols/2;i++){
    //     var j = Math.floor(3*noise(0.5*i))
    //     circle(...cell(i,j,'left'), 16)
    // }
    // for(var i=0;i<rows/2;i++){
    //     var j = Math.floor(3*noise(0.5*i))
    //     circle(...cell(j,i,'left'), 16)
    // }

    // fill('red')
    // for(var i=params.PATTERN_OFFSET;i<cols/2;i++){
    //     var j = params.PATTERN_OFFSET+Math.floor(params.PATTERN_WIDTH*noise(0.9*i))
    //     circle(...cell(i,j,'left'), 16)
    // }
    // for(var i=params.PATTERN_OFFSET;i<cols/2;i++){
    //     var j = params.PATTERN_OFFSET+Math.floor(params.PATTERN_WIDTH*noise(0.9*i))
    //     circle(...cell(j,i,'left'), 16)
    // }
    
    // ELLIPSE
    // fill(patternColors[1])
    // const h = cols/2, k = rows/2
    // for(var i=h;i<h+params.ELLIPSE_WIDTH;i++){
    //     var [upper] = getEllipseY(i, 70, 30, h, k)
    //     if(upper === null) continue
    //     var j = Math.floor(upper)
    //     circle(...cell(i,j,'left'), params.CELL_WIDTH)
    // }
    
    // var [upper] = getEllipseY(h+params.ELLIPSE_WIDTH, 60, 20, h, k)
    // var temp = Math.floor(upper)

    // for(var i=temp;i<rows/2;i++){
    //     var j = Math.floor(3*noise(0.5*i))
    //     // rect(...cell(i,j, 'left'), ...cell(i+1,j+1 ))
    //     circle(...cell(j+15,i,'left'), params.CELL_WIDTH)
    // }
    // stamp('joystick', 350, 350, { width: 120, height: 120, angle: 25 });
    
}

export const reflect = [
  { axis: 'x', at: 0.5 },  
  { axis: 'y', at: 0.5 },  
];