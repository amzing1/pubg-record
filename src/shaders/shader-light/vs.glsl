uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

attribute vec3 position;
attribute vec3 normal;

varying vec3 vPosition;
varying vec3 vNormal;

void main() {
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0); 
  vNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
  // vNormal = normalMatrix * normal;
  vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
}