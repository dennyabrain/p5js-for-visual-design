precision mediump float;

uniform sampler2D uLayer;
varying vec2 vTexCoord;

void main() {
  float strength = 0.18;
  float freq     = 24.0;

  vec2 uv = vTexCoord;
  uv.x += sin(vTexCoord.y * freq) * strength;
  uv.y += cos(vTexCoord.x * freq) * strength;

  gl_FragColor = texture2D(uLayer, uv);
}
