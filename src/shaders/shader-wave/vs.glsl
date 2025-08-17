uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
attribute vec3 position;
attribute vec2 uv;

uniform float uBigWavesElevation;
uniform vec2 uBigWavesFrequency;
uniform float uTime;
uniform float uBigWavesSpeed;

uniform float uSmallWavesElevation;
uniform float uSmallWavesFrequency;
uniform float uSmallWavesSpeed;
uniform float uSmallWavesIterations;

varying vec2 vUv;
varying float vElevation;

// 经典3D柏林噪声 - GLSL实现
// 需要包含在片段着色器中使用

// 伪随机数生成器
float random(vec3 st) {
  return fract(sin(dot(st.xyz, vec3(12.9898, 78.233, 37.719))) * 43758.5453123);
}

// 线性插值
float interpolate(float a, float b, float t) {
    // 使用平滑的插值曲线 (5t^3 - 15t^4 + 10t^5)
    // return a + (b - a) * t; // 线性插值
  return a + (b - a) * (t * t * t * (t * (t * 6.0 - 15.0) + 10.0)); // 平滑插值
}

// 计算网格点梯度
vec3 gradient(int ix, int iy, int iz) {
    // 用伪随机数生成梯度向量
  float rand = random(vec3(ix, iy, iz));
  vec3 grad;
  grad.x = sin(rand * 6.2831853); // 0-2π之间的角度
  grad.y = cos(rand * 6.2831853);
  grad.z = sin(rand * 12.5663706); // 不同的频率增加Z维度变化
  grad = normalize(grad); // 确保单位向量
  return grad;
}

// 3D柏林噪声函数
float perlinNoise(vec3 st) {
    // 确定网格单元
  int ix0 = int(floor(st.x));
  int iy0 = int(floor(st.y));
  int iz0 = int(floor(st.z));
  int ix1 = ix0 + 1;
  int iy1 = iy0 + 1;
  int iz1 = iz0 + 1;

    // 计算相对网格点的位置
  float sx = st.x - float(ix0);
  float sy = st.y - float(iy0);
  float sz = st.z - float(iz0);

    // 计算八个网格点的梯度
  vec3 grad000 = gradient(ix0, iy0, iz0);
  vec3 grad001 = gradient(ix0, iy0, iz1);
  vec3 grad010 = gradient(ix0, iy1, iz0);
  vec3 grad011 = gradient(ix0, iy1, iz1);
  vec3 grad100 = gradient(ix1, iy0, iz0);
  vec3 grad101 = gradient(ix1, iy0, iz1);
  vec3 grad110 = gradient(ix1, iy1, iz0);
  vec3 grad111 = gradient(ix1, iy1, iz1);

    // 计算八个点积
  float dp000 = dot(grad000, vec3(sx, sy, sz));
  float dp001 = dot(grad001, vec3(sx, sy, sz - 1.0));
  float dp010 = dot(grad010, vec3(sx, sy - 1.0, sz));
  float dp011 = dot(grad011, vec3(sx, sy - 1.0, sz - 1.0));
  float dp100 = dot(grad100, vec3(sx - 1.0, sy, sz));
  float dp101 = dot(grad101, vec3(sx - 1.0, sy, sz - 1.0));
  float dp110 = dot(grad110, vec3(sx - 1.0, sy - 1.0, sz));
  float dp111 = dot(grad111, vec3(sx - 1.0, sy - 1.0, sz - 1.0));

    // 插值
  float ix00 = interpolate(dp000, dp100, sx);
  float ix01 = interpolate(dp001, dp101, sx);
  float ix10 = interpolate(dp010, dp110, sx);
  float ix11 = interpolate(dp011, dp111, sx);

  float iy00 = interpolate(ix00, ix10, sy);
  float iy11 = interpolate(ix01, ix11, sy);

  float value = interpolate(iy00, iy11, sz);

  return value;
}

void main() {
  vec4 mPosition = modelMatrix * vec4(position, 1.0);

  float elevation = uBigWavesElevation * sin(mPosition.x * uBigWavesFrequency.x + uTime * uBigWavesSpeed) * sin(mPosition.z * uBigWavesFrequency.y + uTime * uBigWavesSpeed);

  for(float i = 1.0; i <= 10.0; i++) {
    if(i <= uSmallWavesIterations) {
      elevation -= abs(perlinNoise(vec3(mPosition.xz * uSmallWavesFrequency * i, uTime * uSmallWavesSpeed)) * uSmallWavesElevation / i);
    }
  }

  mPosition.y += elevation;
  vec4 vPosition = viewMatrix * mPosition;
  vec4 pPostion = projectionMatrix * vPosition;
  gl_Position = pPostion;
  vUv = uv;
  vElevation = elevation;
}