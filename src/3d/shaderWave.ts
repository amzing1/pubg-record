import { initThree } from './util'
import vertexShader from '@/shaders/shader-wave/vs.glsl?raw'
import fragmentShader from '@/shaders/shader-wave/fs.glsl?raw'
import * as THREE from 'three'

export function main() {
  const { scene, camera, gui, tick } = initThree()

  const debugObject: Record<string, any> = {}

  debugObject.depthColor = '#186691'
  debugObject.surfaceColor = '#9bd8ff'

  const geo = new THREE.PlaneGeometry(3, 3, 1024, 1024)
  const mat = new THREE.RawShaderMaterial({
    vertexShader,
    fragmentShader,
    side: THREE.DoubleSide,
    uniforms: {
      uTime: { value: 0 },
      uBigWavesElevation: { value: 0.2 },
      uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
      uBigWavesSpeed: { value: 0.75 },
      uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
      uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
      uColorOffset: { value: 0.08 },
      uColorMultiplier: { value: 5 },
      uSmallWavesElevation: { value: 0.15 },
      uSmallWavesFrequency: { value: 3 },
      uSmallWavesSpeed: { value: 0.2 },
      uSmallWavesIterations: { value: 4 }
    }
  })

  gui
    .add(mat.uniforms.uBigWavesElevation, 'value')
    .min(0.1)
    .max(1)
    .name('uBigWavesElevation')
  gui
    .add(mat.uniforms.uBigWavesFrequency.value, 'x')
    .min(1)
    .max(10)
    .name('uBigWavesFrequencyX')
  gui
    .add(mat.uniforms.uBigWavesFrequency.value, 'y')
    .min(1)
    .max(10)
    .name('uBigWavesFrequencyZ')
  gui.add(mat.uniforms.uBigWavesSpeed, 'value').min(0).max(5)
  gui.addColor(debugObject, 'depthColor').onChange(() => {
    mat.uniforms.uDepthColor.value = new THREE.Color(debugObject.depthColor)
  })
  gui.addColor(debugObject, 'surfaceColor').onChange(() => {
    mat.uniforms.uSurfaceColor.value = new THREE.Color(debugObject.surfaceColor)
  })
  gui.add(mat.uniforms.uColorOffset, 'value').min(0).max(1).name('uColorOffset')
  gui
    .add(mat.uniforms.uColorMultiplier, 'value')
    .min(1)
    .max(10)
    .name('uColorMultiplier')
  gui
    .add(mat.uniforms.uSmallWavesElevation, 'value')
    .min(0.1)
    .max(1)
    .name('uSmallWavesElevation')
  gui
    .add(mat.uniforms.uSmallWavesFrequency, 'value')
    .min(1)
    .max(10)
    .name('uSmallWavesFrequency')
  gui
    .add(mat.uniforms.uSmallWavesSpeed, 'value')
    .min(0)
    .max(2)
    .name('uSmallWavesSpeed')
  gui
    .add(mat.uniforms.uSmallWavesIterations, 'value')
    .min(1)
    .max(8)
    .name('uSmallWavesIterations')
  const mesh = new THREE.Mesh(geo, mat)
  mesh.rotation.x = Math.PI / 1.8

  scene.add(mesh)
  camera.position.set(2, 2, 2)
  camera.lookAt(mesh.position)

  const clock = new THREE.Clock()
  tick(() => {
    mat.uniforms.uTime.value = clock.getElapsedTime()
  })
}
