precision mediump float;
uniform float uTime;
uniform vec3 uBaseColor; // 基础色（如 vec3(0.0, 1.0, 0.8)）
uniform vec2 uSize;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vViewDir;

// 生成扫描线噪声
float scanLine(vec2 uv, float t) {
    return sin(uv.y * 500.0 + t * 2.0) * 0.2 + 0.8;
}

// 生成网格噪声
float gridNoise(vec2 uv, float t) {
    vec2 grid = fract(uv * 10.0);
    float line = min(step(0.98, grid.x), step(0.98, grid.y));
    return line * sin(t) * 0.5;
}

void main() {
    // 基础参数
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewDir);
    vec2 uv = gl_FragCoord.xy / uSize.xy; // 需要传入 resolution
    
    // 1. Fresnel 边缘发光
    float fresnel = pow(1.0 - dot(normal, viewDir), 5.0);
    vec3 glow = fresnel * uBaseColor * 2.0;
    
    // 2. 扫描线和网格干扰
    float scan = scanLine(uv, uTime);
    float grid = gridNoise(uv, uTime * 0.5);
    vec3 noise = vec3(scan + grid);
    
    // 3. 动态颜色波动
    float hueShift = sin(uTime * 0.5) * 0.2;
    vec3 color = uBaseColor + vec3(hueShift, hueShift * 0.5, -hueShift);
    
    // 4. 组合效果
    vec3 finalColor = color * noise + glow;
    float alpha = 0.3 + fresnel * 0.7; // 边缘更不透明
    
    gl_FragColor = vec4(finalColor, alpha);
}