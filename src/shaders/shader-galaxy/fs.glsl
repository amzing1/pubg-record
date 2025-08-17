precision mediump float;

varying vec3 vColor;

void main() {
  float dis = distance(gl_PointCoord, vec2(0.5));

  // diffuse point
  // float v = max(1.0 - dis * 2.0, 0.0);

  // light point
  float strength = 1.0 - dis;
  strength = pow(strength, 10.0);
  // vec3 color = vec3(strength);
  vec3 color = mix(vec3(0.0), vColor, strength);

  // gl_FragColor = vec4(color, 1.0);
  gl_FragColor = vec4(vColor, 1.0);

  // gl_FragColor = vec4(vElevation, vElevation, vElevation, 1.0);
}