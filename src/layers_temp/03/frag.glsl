precision mediump float;

uniform sampler2D uLayer;
varying vec2 vTexCoord;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  float strength = 0.00001;
  float scale    = 0.05;

  vec2 cell = floor(vTexCoord * scale);
  vec2 jitter = vec2(
    hash(cell),
    hash(cell + vec2(1.8, 7.9))
  ) * 2.0 - 1.0;

  vec2 uv = vTexCoord + jitter * strength;
  gl_FragColor = texture2D(uLayer, uv);
}
