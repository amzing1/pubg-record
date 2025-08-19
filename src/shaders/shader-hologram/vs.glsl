precision mediump float;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform vec3 cameraPosition;

uniform float uTime;

attribute vec3 position;
attribute vec3 normal;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vViewDir;

void main() {
  // 轻微顶点动画
  float wave = sin(uTime + position.y * 10.0) * 0.02;
  vec3 pos = position + normal * wave;

  vPosition = (modelMatrix * vec4(pos, 1.0)).xyz;
  vNormal = normalize(mat3(modelMatrix) * normal);
  vViewDir = normalize(cameraPosition - pos);

  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}