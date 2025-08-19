import fragmentShader from '@/shaders/shader-hologram/fs.glsl?raw'
import vertexShader from '@/shaders/shader-hologram/vs.glsl?raw'
import * as THREE from 'three'
import { initThree } from './util'
export function main() {
  const { scene, camera, tick, renderer } = initThree()

  const mat = new THREE.RawShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    // side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: new THREE.Uniform(0),
      uBaseColor: new THREE.Uniform(new THREE.Color(0.0, 1.0, 0.8)),
      uSize: new THREE.Uniform(
        new THREE.Vector2(renderer.domElement.width, renderer.domElement.height)
      )
    }
  })
  const boxGeo = new THREE.BoxGeometry(2, 2, 2)
  const sphereGeo = new THREE.SphereGeometry(2)
  const torusGeo = new THREE.TorusKnotGeometry()
  const box = new THREE.Mesh(boxGeo, mat)
  const sphere = new THREE.Mesh(sphereGeo, mat)
  const torus = new THREE.Mesh(torusGeo, mat)
  sphere.position.x = -5
  torus.position.x = 5

  scene.add(box, sphere, torus)
  camera.position.set(0, 0, 12)

  const clock = new THREE.Clock()
  tick(() => {
    // ;[box, sphere, torus].forEach((v) => {
    //   v.rotation.x += 0.01
    //   v.rotation.z += 0.01
    // })
    mat.uniforms.uTime.value = clock.getElapsedTime()
  })
}
