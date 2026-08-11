export const grid = {
  cellSize: 24,
  show: true,
  color: '#333355',
};

// Variant 1: no reflection (baseline)
// export const reflect = [];

// Variant 2: left-right mirror
// export const reflect = [{ axis: 'x', at: 0.5 }];

// Variant 3: top-bottom mirror
// export const reflect = [{ axis: 'y', at: 0.5 }];

// Variant 4: 4-way symmetry
// export const reflect = [{ axis: 'x', at: 0.5 }, { axis: 'y', at: 0.5 }];

// Variant 5: diagonal mirror
// export const reflect = [{ axis: 'y', at: 0.5, angle: 120 }];


const colors = ['#845ec2', '#00c9a7', '#fbeaff', '#ff6f91'];

export function setup() {}

export function beforeDraw() {
  background('#1a1a2e');
}

export function draw() {
  noStroke();

  for (let col = 0; col < cols/2; col++) {
    for (let row = 0; row < rows/2; row++) {
      const d = map(noise(col * 0.4, row * 0.4), 0, 1, 10, grid.cellSize * 0.85);
      fill(colors[(col + row) % colors.length]);
      circle(...cell(col, row), d);
    }
  }
}
