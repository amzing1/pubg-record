import { initThree } from './util'
import * as THREE from 'three'
export function main() {
  const { scene, camera, tick } = initThree()

  const mat = new THREE.MeshBasicMaterial()
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

  tick(() => {
    ;[box, sphere, torus].forEach((v) => {
      v.rotation.x += 0.01
      v.rotation.z += 0.01
    })
  })
}
