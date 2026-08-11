
export const grid = {
  cellSize: 48,
  show: false,
  color: '#002a4a',
};

const colors = [
    "#845ec2",
    "#b39cd0",
    "#fbeaff",
    "#00c9a7"
]

export function setup() {

}

export function draw() {
    fill("#b39cd0");
    noStroke();

    // P5 convention
    // rect(0,0,50,50)

    // with helpers from the framework
    // rect(...cell(2,2,'top-left'), 24,24)
    
    // for (let col = 0; col < cols; col++) {
    //     for (let row = 0; row < rows; row++) {
    //         rect(...cell(col, row, 'top-left'), 16,16);
    //     }
    // }

    // Variant 1: color per row cycling through colors array
    // for (let col = 0; col < cols; col++) {
    //     for (let row = 0; row < rows; row++) {
    //         fill(colors[row % colors.length]);
    //         rect(...cell(col, row, 'top-left'), grid.cellSize, grid.cellSize);
    //     }
    // }

    // Variant 2: rotated rects, angle varies per column
    // for (let col = 0; col < cols; col++) {
    //     for (let row = 0; row < rows; row++) {
    //         const angle = map(col, 0, cols, 0, TWO_PI);
    //         push();
    //         const [cx, cy] = cell(col, row);
    //         translate(cx, cy);
    //         rotate(angle);
    //         rect(-grid.cellSize / 2, -grid.cellSize / 2, grid.cellSize/2, grid.cellSize/2);
    //         pop();
    //     }
    // }


    // Variant 3: scale varies so rects stay within cell
    // for (let col = 0; col < cols; col++) {
    //     for (let row = 0; row < rows; row++) {
    //         const s = map(noise(col * 0.2, row * 0.2), 0, 1, 4, grid.cellSize);
    //         const [cx, cy] = cell(col, row);
    //         rect(cx - s / 2, cy - s / 2, s, s);
    //     }
    // }

    // Variant 4: sine wave — rects in the "wave band" get a highlight color, rest are dim
    for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows; row++) {
            const waveRow = Math.round(map(sin(col * 0.4), -1, 1, 2, rows - 3));
            const onWave = Math.abs(row - waveRow) <= 1;
            fill(onWave ? colors[0] : colors[1]);
            rect(...cell(col, row, 'top-left'), grid.cellSize, grid.cellSize);
        }
    }

    // Variant 5: angle + color both driven by sine — diagonal ripple feel
    for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows; row++) {
            const t = sin((col + row) * 0.3);
            const angle = map(t, -1, 1, -QUARTER_PI, QUARTER_PI);
            fill(colors[Math.floor(map(t, -1, 1, 0, colors.length))]);
            push();
            const [cx, cy] = cell(col, row);
            translate(cx, cy);
            rotate(angle);
            const s = grid.cellSize * 0.8;
            rect(-s / 2, -s / 2, s, s);
            pop();
        }
    }
}