# POSTR

### How to Use
1. Configure Canvas
Edit main.js to configure canvas size and other details

2. Create layers
To create a layer create a new directory in the layers/ directory and add a sketch.js file. 
Boilerplate content for each sketch looks as follows
```js
export const grid = {
  rows: 8,
  cols: 8,
  show: true,
  color: '#2a2a4a',
};

export function setup() {

}

export function draw() {
  text('Hello', width / 2, height / 3);
}
```

3. Accessing Cells
```js
cell(2,2)
cell(0,0,'top')
cell(0,2,'bottom')
cell(0,2,'left)
cell(0,2,'right')
```

4. Reflection
```js
export const reflect = [
  { axis: 'x', at: 0.5 },  // vertical mirror at canvas center
  { axis: 'y', at: 0.5 },  // horizontal mirror → 4-way symmetry
];

## Examples
```js
// Vertical mirror (unchanged)
export const reflect = [{ axis: 'x', at: 0.5 }];

// 45° diagonal through center
export const reflect = [{ axis: 'x', at: 0.5, angle: 45 }];

// 4-way kaleidoscope: vertical + horizontal
export const reflect = [
  { axis: 'x', at: 0.5 },
  { axis: 'y', at: 0.5 },
];

// Starburst: 3 axes through center at 0°, 60°, 120° → 6 reflections
export const reflect = [
  { axis: 'x', at: 0.5, angle: 0   },
  { axis: 'x', at: 0.5, angle: 60  },
  { axis: 'x', at: 0.5, angle: 120 },
];
```

```

5. Shape
Allow defining a shape and then referencing the shape to draw with its x,y coordinates, angle and width, height

6. Shaders
Adding frag.glsl automatically applies the given fragment shader to the content of that layer.


### To Run locally
`npm run dev`
Starts a local vitejs dev server that makes your sketch available at `localhost:5173`.
It supports live reload, so any changes to code done in the IDE reflects immediately in the browser.