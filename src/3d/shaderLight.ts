import fragmentShader from '@/shaders/shader-light/fs.glsl?raw'
import vertexShader from '@/shaders/shader-light/vs.glsl?raw'
import * as THREE from 'three'
import { initThree } from './util'
export function main() {
  const { scene, camera, tick, renderer } = initThree()

  const mat = new THREE.RawShaderMaterial({
    vertexShader,
    fragmentShader
  })
  const boxGeo = new THREE.BoxGeometry(2, 2, 2)
  const sphereGeo = new THREE.SphereGeometry(2)
  const torusGeo = new THREE.TorusKnotGeometry()
  const planeGeo = new THREE.PlaneGeometry(20, 20)
  const box = new THREE.Mesh(boxGeo, mat)
  const sphere = new THREE.Mesh(sphereGeo, mat)
  const torus = new THREE.Mesh(torusGeo, mat)
  const plane = new THREE.Mesh(planeGeo, mat)
  sphere.position.x = -5
  torus.position.x = 5
  plane.rotation.x = -Math.PI / 2
  plane.position.y = -3

  scene.add(box, sphere, torus, plane)
  camera.position.set(0, 0, 12)

  tick(() => {
    ;[box, sphere, torus].forEach((v) => {
      v.rotation.x += 0.01
      v.rotation.z += 0.01
    })
  })
}
