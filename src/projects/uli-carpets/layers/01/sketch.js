export const grid = {
  rows: 70,
  cols: 120,
//   show: true,
  color: '#2a2a2a',
};

function drawPatternTokens(ix){
    var patternMakers = [

    ]
}

export const PARAMS = {
    PATTERN_OFFSET: { type: 'number', step: 1, min: 0, max: 25, default: 5 },
    HEADING: { type: 'string', default: 'Poster Headline' },
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
    // clear()
    fill(255)
    rectMode(CORNERS)

    for(var i=0;i<grid.cols/2;i++){
        var j = Math.floor(3*noise(0.5*i))
        circle(...cell(i,j,'left'), 16)
    }
    for(var i=0;i<grid.rows/2;i++){
        var j = Math.floor(3*noise(0.5*i))
        circle(...cell(j,i,'left'), 16)
    }

    fill('red')
    for(var i=params.PATTERN_OFFSET;i<grid.cols/2;i++){
        var j = params.PATTERN_OFFSET+Math.floor(3*noise(0.9*i))
        circle(...cell(i,j,'left'), 16)
    }
    for(var i=params.PATTERN_OFFSET;i<grid.cols/2;i++){
        var j = params.PATTERN_OFFSET+Math.floor(3*noise(0.9*i))
        circle(...cell(j,i,'left'), 16)
    }
    
    fill('green')
    const h = grid.cols/2, k = grid.rows/2
    for(var i=h;i<h+45;i++){
        var [upper] = getEllipseY(i, 60, 20, h, k)
        if(upper === null) continue
        var j = Math.floor(upper)
        circle(...cell(i,j,'left'), 16)
    }
     for(var i=22;i<grid.rows/2;i++){
        var j = Math.floor(3*noise(0.5*i))
        // rect(...cell(i,j, 'left'), ...cell(i+1,j+1 ))
        circle(...cell(j+15,i,'left'), 16)
    }
}


export const reflect = [
  { axis: 'x', at: 0.5 },  
  { axis: 'y', at: 0.5 },  
];