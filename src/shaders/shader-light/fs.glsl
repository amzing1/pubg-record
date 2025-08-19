precision mediump float;
uniform vec3 cameraPosition;
varying vec3 vPosition;
varying vec3 vNormal;

vec3 addAmbientLight(vec3 lightColor, float intensity) {
  return lightColor * intensity;
}

vec3 addDirLight(vec3 lightColor, vec3 lightDir, vec3 normal) {
  float dotRes = dot(normalize(-lightDir), normal);
  return lightColor * max(dotRes, 0.0);
}

vec3 addPointLight(vec3 lightColor, vec3 lightPos, vec3 normal, vec3 vertexPostion) {
  float distance = length(lightPos - vertexPostion);
  // 光照强度随距离衰减
  float attenuation = 1.0 / (0.001 + distance * distance);
  float dotRes = dot(normalize( lightPos - vertexPostion), normal);
  return lightColor * attenuation * max(dotRes, 0.0);
}

float addSpecular(vec3 lightDir, vec3 position, vec3 normal, float shininess) {
  vec3 viewDir = normalize(cameraPosition - position);
  vec3 halfDir = normalize(lightDir + viewDir);
  float specular = pow(max(dot(normal, halfDir), 0.0), shininess);
  // return vec3(2.0, 0.0,0.0) * specular;
  return specular;
}

vec3 addSpotLight(
    vec3 lightColor, 
    vec3 lightPos, 
    vec3 lightDir,   // 聚光灯照射方向（单位向量）
    vec3 normal, 
    vec3 fragPos, 
    float cutoff,    // 内切光角余弦（如 cos(12°)）
    float outerCutoff // 外切光角余弦（如 cos(15°)）
) {
    vec3 lightVec = lightPos - fragPos;
    vec3 lightDirNorm = normalize(lightVec);
    
    // 关键：计算 theta 时必须取反 lightDir
    float theta = dot(lightDirNorm, normalize(-lightDir));
    
    // 调试：可视化 theta 范围
    // return vec3(theta); // 白色=1.0（正对），黑色=-1.0（背面）

    // 提前终止：完全在锥体外
    if (theta < outerCutoff) {
        return vec3(0.0);
    }
    
    // 边缘平滑
    float epsilon = cutoff - outerCutoff;
    float intensity = clamp((theta - outerCutoff) / epsilon, 0.0, 1.0);
    
    // 漫反射
    float diff = max(dot(normal, lightDirNorm), 0.0);

    // 高光
    float specular = addSpecular(-lightDir,vPosition,normal, 1024.0);
    
    return lightColor * diff * intensity + vec3(4.0) * specular;
    // return vec3(4.0,0.0,0.0) * specular;
}

void main() {
  vec3 vColor = vec3(0.0);
  vec3 normal = normalize(vNormal);

  // ambient color
  vColor += addAmbientLight(vec3(1.0), 0.1);
  // dirLight color;
  vColor += addDirLight(vec3(0.9, 0.9, 0.9), vec3(1, -1, 0), normal);
  // point color;
  vColor += addPointLight(vec3(0.0, 2.0, 0.0), vec3(3.0, 3.0, 2.0), normal, vPosition);

  // 聚光灯参数
  vec3 lightColor = vec3(1.0, 1.0, 1.0); // 白光
  vec3 lightPos = vec3(2.0, 2.5, 2.0);   // 光源位置
  vec3 lightDir = vec3(-3, -1.0, -1);  // 照射方向（向下）
  float cutoff = cos(radians(12.0));      // 内切光角（12°）
  float outerCutoff = cos(radians(15.0)); // 外切光角（15°）
  // 计算聚光灯贡献
  vec3 spotlight = addSpotLight(
      lightColor, lightPos, lightDir, normal, vPosition, 
      cutoff, outerCutoff
  );

  vColor += spotlight;

  gl_FragColor = vec4(vColor, 1.0);

  // gl_FragColor = vec4(vNormal, 1.0);
}