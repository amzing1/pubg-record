/**
 * 材质入门练习，因为太杂太多了，所以不用文件拆分了
 */
const vs = `
  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projectionMatrix;
  attribute vec3 position;
  attribute vec2 uv;
  varying vec2 vUv;
  void main() {
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
    vUv = uv;
  }
`
const allFs = [
  `gl_FragColor = vec4(vUv.x, 1.0, 1.0, 1.0);`,
  `gl_FragColor = vec4(vUv, 0.0, 1.0);`,
  `
  float v = vUv.x;
  gl_FragColor = vec4(v, v, v, 1.0);
  `,
  `
  float v = vUv.y;
  gl_FragColor = vec4(v, v, v, 1.0);
  `,
  `
  float v = 1.0 - vUv.y;
  gl_FragColor = vec4(v, v, v, 1.0);
  `,
  `
  float v = vUv.y * 10.0;
  gl_FragColor = vec4(v, v, v, 1.0);
  `,
  `float v = vUv.y * 10.0;gl_FragColor = vec4(v, v, v, 1.0);`,

  `float v = mod(vUv.y * 10.0, 1.0);gl_FragColor = vec4(v, v, v, 1.0);
  gl_FragColor = vec4(v, v, v, 1.0);`,

  `float v = step(0.5, mod(vUv.y * 10.0, 1.0));
  gl_FragColor = vec4(v, v, v, 1.0);`,

  `float v = step(0.8, mod(vUv.y * 10.0, 1.0));
  gl_FragColor = vec4(v, v, v, 1.0);`,

  `float v = step(0.8, mod(vUv.y * 10.0, 1.0)) + step(0.8, mod(vUv.x * 10.0, 1.0));
  gl_FragColor = vec4(v, v, v, 1.0);`,

  `float v = step(2.0, step(0.8, mod(vUv.y * 10.0, 1.0)) + step(0.8, mod(vUv.x * 10.0, 1.0)));
  gl_FragColor = vec4(v, v, v, 1.0);`,

  `float v = step(0.8, mod(vUv.y * 10.0, 1.0)) * step(0.8, mod(vUv.x * 10.0, 1.0));
  gl_FragColor = vec4(v, v, v, 1.0);`,

  `float v = step(0.8, mod(vUv.y * 10.0, 1.0)) * step(0.4, mod(vUv.x * 10.0, 1.0));
  gl_FragColor = vec4(v, v, v, 1.0);`,

  `float v = step(0.4, mod(vUv.y * 10.0, 1.0)) * step(0.8, mod(vUv.x * 10.0, 1.0)) + step(0.8, mod(vUv.y * 10.0, 1.0)) * step(0.4, mod(vUv.x * 10.0, 1.0));
  gl_FragColor = vec4(v, v, v, 1.0);`,

  `float barX = step(0.8, mod(vUv.y * 10.0 + 0.2, 1.0)) * step(0.4, mod(vUv.x * 10.0, 1.0));
  float barY = step(0.4, mod(vUv.y * 10.0, 1.0)) * step(0.8, mod((vUv.x) * 10.0 + 0.2, 1.0));
  float v = barX + barY;
  gl_FragColor = vec4(v, v, v, 1.0);`,

  `float v = abs(vUv.x - 0.5);
  gl_FragColor = vec4(v, v, v, 1.0);`,

  `float v = min(abs(vUv.x - 0.5), abs(vUv.y - 0.5));
  gl_FragColor = vec4(v, v, v, 1.0);`,

  `float v = max(abs(vUv.x - 0.5), abs(vUv.y - 0.5));
  gl_FragColor = vec4(v, v, v, 1.0);`,

  `float v = step(0.2, abs(vUv.x - 0.5)) + step(0.2, abs(vUv.y - 0.5));
  gl_FragColor = vec4(v, v, v, 1.0);`,

  `float v = step(0.4, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
  gl_FragColor = vec4(v, v, v, 1.0);`,

  `float v = floor(vUv.x * 10.0) / 10.0;
  gl_FragColor = vec4(v, v, v, 1.0);`,

  `float v = floor(vUv.x * 10.0) / 10.0 * floor(vUv.y * 10.0) / 10.0;
  gl_FragColor = vec4(v, v, v, 1.0);`,
  `float v = random(vUv);
  gl_FragColor = vec4(v, v, v, 1.0);`,

  `vec2 gridUv = vec2(floor(vUv.x * 10.0) / 10.0, floor(vUv.y * 10.0) / 10.0);
  float v = random(gridUv);
  gl_FragColor = vec4(v, v, v, 1.0);`,

  `vec2 gridUv = vec2(floor(vUv.x * 10.0) / 10.0, floor((vUv.y + vUv.x * 0.5) * 10.0) / 10.0);
  float v = random(gridUv);
  gl_FragColor = vec4(v, v, v, 1.0);`,

  `vec2 gridUv = vec2(floor(vUv.x * 10.0) / 10.0, floor((vUv.y + vUv.x * 0.5) * 10.0) / 10.0);
  float v = random(gridUv);
  gl_FragColor = vec4(v, v, v, 1.0);`,

  `float v = length(vUv);
  gl_FragColor = vec4(v, v, v, 1.0);`,

  `float v = distance(vUv, vec2(0.5, 0.5));
  gl_FragColor = vec4(v, v, v, 1.0);`,

  `float v = 0.02 / distance(vUv, vec2(0.5, 0.5));
  gl_FragColor = vec4(v, v, v, 1.0);`,

  `vec2 uv = vec2(vUv.x * 0.4 + 0.3, vUv.y);
  float v = 0.02 / distance(uv, vec2(0.5, 0.5));
  gl_FragColor = vec4(v, v, v, 1.0);`,

  `vec2 uv1 = vec2(vUv.x * 0.5 + 0.25, vUv.y * 0.1 + 0.45);
  vec2 uv2 = vec2(vUv.x * 0.1 + 0.45, vUv.y * 0.5 + 0.25);
  float v1 = 0.02 / distance(uv1, vec2(0.5, 0.5));
  float v2 = 0.02 / distance(uv2, vec2(0.5, 0.5));
  float v = v1 * v2;
  gl_FragColor = vec4(v, v, v, 1.0);`,

  `
  vec2 rotatedUv = rotate(vUv, vec2(0.5), PI * 0.25);
  vec2 uv1 = vec2(rotatedUv.x * 0.5 + 0.25, rotatedUv.y * 0.1 + 0.45);
  vec2 uv2 = vec2(rotatedUv.x * 0.1 + 0.45, rotatedUv.y * 0.5 + 0.25);
  float v1 = 0.02 / distance(uv1, vec2(0.5, 0.5));
  float v2 = 0.02 / distance(uv2, vec2(0.5, 0.5));
  float v = v1 * v2;
  gl_FragColor = vec4(v, v, v, 1.0);`,

  `float v = step(0.2, distance(vUv, vec2(0.5)));
  gl_FragColor = vec4(v, v, v, 1.0);`,

  `float v = abs(distance(vUv, vec2(0.5)) - 0.25);
  gl_FragColor = vec4(v, v, v, 1.0);`,

  `float v = step(0.02, abs(distance(vUv, vec2(0.5)) - 0.25));
  gl_FragColor = vec4(v, v, v, 1.0);`,

  `vec2 uv = vec2(vUv.x, vUv.y + sin(vUv.x * 40.0) * 0.1);
  float v = step(0.02, abs(distance(uv, vec2(0.5)) - 0.25));
  gl_FragColor = vec4(v, v, v, 1.0);`,

  `vec2 uv = vec2(vUv.x + sin(vUv.y * 30.0) * 0.1, vUv.y + sin(vUv.x * 30.0) * 0.1);
  float v = step(0.02, abs(distance(uv, vec2(0.5)) - 0.25));
  gl_FragColor = vec4(v, v, v, 1.0);`,

  `vec2 uv = vec2(vUv.x + sin(vUv.y * 300.0) * 0.1, vUv.y + sin(vUv.x * 300.0) * 0.1);
  float v = step(0.02, abs(distance(uv, vec2(0.5)) - 0.25));
  gl_FragColor = vec4(v, v, v, 1.0);`,

  `float v = atan(vUv.x / vUv.y);
  gl_FragColor = vec4(v, v, v, 1.0);`,

  `float v = atan(vUv.x - 0.5, vUv.y - 0.5);
  gl_FragColor = vec4(v, v, v, 1.0);`,

  `float v = atan(vUv.y - 0.5, vUv.x - 0.5);
  v /= PI * 2.0;
  v += 0.5;
  gl_FragColor = vec4(v, v, v, 1.0);`,

  `float v = atan(vUv.y - 0.5, vUv.x - 0.5);
  v /= PI * 2.0;
  v += 0.5;
  v *= 20.0;
  v = mod(v, 1.0);
  gl_FragColor = vec4(v, v, v, 1.0);`,

  `float v = atan(vUv.y - 0.5, vUv.x - 0.5);
  v /= PI * 2.0;
  v += 0.5;
  v = sin(v * 100.0);
  gl_FragColor = vec4(v, v, v, 1.0);`,

  `float v = atan(vUv.y - 0.5, vUv.x - 0.5);
  v /= PI * 2.0;
  v += 0.5;
  v = sin(v * 100.0);
  float radius = 0.25 + v * 0.02;
  v = distance(vUv, vec2(0.5)) - radius;
  v = 1.0 - abs(v - 0.2);
  v = step(0.99, v);
  gl_FragColor = vec4(v, v, v, 1.0);`,

  `vec2 uv = vUv * 10.0; // 缩放噪声
  float v = perlinNoise(uv);
  gl_FragColor = vec4(v, v, v, 1.0);`, // 说是返回结果[-1, 1]

  `vec2 uv = vUv * 10.0; // 缩放噪声
  float v = perlinNoise(uv); // 说是返回结果[-1, 1]
  v = step(0.0, v);
  gl_FragColor = vec4(v, v, v, 1.0);`,

  `vec2 uv = vUv * 10.0; // 缩放噪声
  float v = perlinNoise(uv); // 说是返回结果[-1, 1]
  v = 1.0 - abs(v);
  gl_FragColor = vec4(v, v, v, 1.0);`,

  `vec2 uv = vUv * 10.0; // 缩放噪声
  float v = perlinNoise(uv); // 说是返回结果[-1, 1]
  v = sin(v * 20.0);
  vec3 black = vec3(0.0);
  vec3 uvColor = vec3(vUv, 0.5);
  vec3 mixColor = mix(black, uvColor, v);
  gl_FragColor = vec4(mixColor, 1.0);`,

  `vec2 uv = vUv * 10.0; // 缩放噪声
  float v = perlinNoise(uv); // 说是返回结果[-1, 1]
  v = sin(v * 20.0);
  v = step(0.90, v);
  vec3 black = vec3(0.0);
  vec3 uvColor = vec3(vUv, 0.5);
  vec3 mixColor = mix(black, uvColor, v);
  gl_FragColor = vec4(mixColor, 1.0);`
].map((v) => {
  return `
    precision mediump float;
    #define PI 3.1415926
    varying vec2 vUv;
    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }
    vec2 rotate(vec2 st, vec2 anchor, float angle) {
      return vec2(cos(angle) * (st.x - anchor.x) - sin(angle) * (st.y - anchor.y) + anchor.x, sin(angle) * (st.x - anchor.x) + cos(angle) * (st.y - anchor.y) + anchor.y);
    }
    // 线性插值
    float interpolate(float a, float b, float t) {
        // 使用平滑的插值曲线 (5t^3 - 15t^4 + 10t^5)
        // return a + (b - a) * t; // 线性插值
      return a + (b - a) * (t * t * t * (t * (t * 6.0 - 15.0) + 10.0)); // 平滑插值
    }

    // 计算网格点梯度
    vec2 gradient(int ix, int iy) {
        // 用伪随机数生成梯度向量
      float rand = random(vec2(ix, iy));
      vec2 grad;
      grad.x = sin(rand * 6.2831853); // 0-2π之间的角度
      grad.y = cos(rand * 6.2831853);
      return grad;
    }

    // 2D柏林噪声函数
    float perlinNoise(vec2 st) {
        // 确定网格单元
      int ix0 = int(floor(st.x));
      int iy0 = int(floor(st.y));
      int ix1 = ix0 + 1;
      int iy1 = iy0 + 1;

        // 计算相对网格点的位置
      float sx = st.x - float(ix0);
      float sy = st.y - float(iy0);

        // 计算四个网格点的梯度
      vec2 grad00 = gradient(ix0, iy0);
      vec2 grad01 = gradient(ix0, iy1);
      vec2 grad10 = gradient(ix1, iy0);
      vec2 grad11 = gradient(ix1, iy1);

        // 计算四个点积
      float dp00 = dot(grad00, vec2(sx, sy));
      float dp01 = dot(grad01, vec2(sx, sy - 1.0));
      float dp10 = dot(grad10, vec2(sx - 1.0, sy));
      float dp11 = dot(grad11, vec2(sx - 1.0, sy - 1.0));

        // 插值
      float ix00 = interpolate(dp00, dp01, sy);
      float ix11 = interpolate(dp10, dp11, sy);
      float value = interpolate(ix00, ix11, sx);

      return value;
    }
    void main() {
      ${v}
    }
  `
})

export { vs, allFs }
