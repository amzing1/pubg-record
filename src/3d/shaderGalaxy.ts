import { initThree } from './util'
import vertexShader from '@/shaders/shader-galaxy/vs.glsl?raw'
import fragmentShader from '@/shaders/shader-galaxy/fs.glsl?raw'
import * as THREE from 'three'

export function main() {
  const { scene, camera, renderer, gui, tick } = initThree()

  const count = 50000
  const vertices = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const scales = new Float32Array(count)
  const randoms = new Float32Array(count * 3)
  const branches = 3
  const radius = 2
  const spin = 0
  const rand = 1.2
  const insideColor = new THREE.Color('#ff6030')
  const outsideColor = new THREE.Color('#1B3984')
  for (let i = 0; i < count; i++) {
    const x = Math.random() * radius
    const spinAngle = x * spin
    const branchAngle = ((i % branches) / branches) * Math.PI * 2

    vertices[i * 3 + 0] = Math.cos(branchAngle + spinAngle) * x
    vertices[i * 3 + 1] = 0
    vertices[i * 3 + 2] = Math.sin(branchAngle + spinAngle) * x

    const mixedColor = insideColor.clone()
    mixedColor.lerp(outsideColor, x / radius)
    colors[i * 3 + 0] = mixedColor.r
    colors[i * 3 + 1] = mixedColor.g
    colors[i * 3 + 2] = mixedColor.b

    const randX = Math.pow((Math.random() - 0.5) * rand, 3)
    const randY = Math.pow((Math.random() - 0.5) * rand, 3)
    const randZ = Math.pow((Math.random() - 0.5) * rand, 3)
    randoms[i * 3 + 0] = randX
    randoms[i * 3 + 1] = randY
    randoms[i * 3 + 2] = randZ

    scales[i] = Math.random() + 1
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geo.setAttribute('scale', new THREE.BufferAttribute(scales, 1))
  geo.setAttribute('randoms', new THREE.BufferAttribute(randoms, 3))
  const materail = new THREE.RawShaderMaterial({
    vertexShader,
    fragmentShader,
    blending: THREE.AdditiveBlending,
    transparent: true,
    vertexColors: true,
    depthWrite: false,
    uniforms: {
      uSize: { value: 30.0 * renderer.getPixelRatio() },
      uTime: { value: 0.0 }
    }
  })

  gui.add(materail.uniforms.uSize, 'value').min(1).max(40).name('uSize')

  const points = new THREE.Points(geo, materail)
  scene.add(points)

  camera.position.set(0, 4, 4)
  renderer.setClearColor(new THREE.Color(0, 0, 0))
  const clock = new THREE.Clock()
  tick(() => {
    materail.uniforms.uTime.value = clock.getElapsedTime()
  })
}
