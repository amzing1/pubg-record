uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
attribute vec3 randoms;
attribute vec3 position;
attribute float scale;
attribute vec3 color;
uniform float uSize;
uniform float uTime;

varying vec3 vColor;

void main() {
  vec4 mPosition = modelMatrix * vec4(position, 1.0);

  float angle = atan(mPosition.x, mPosition.z);
  float distance = length(mPosition.xz);
  float angleOffset = (1.0 / distance) * uTime * 6.0;
  angle += angleOffset;

  mPosition.x = cos(angle) * distance;
  mPosition.z = sin(angle) * distance;

  mPosition.x += randoms.x;
  mPosition.y += randoms.y;
  mPosition.z += randoms.z;

  vec4 vPosition = viewMatrix * mPosition;
  vec4 pPostion = projectionMatrix * vPosition;
  gl_Position = pPostion;

  gl_PointSize = uSize * scale * (1.0 / -vPosition.z);

  vColor = color;
}