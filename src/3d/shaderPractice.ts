import { initThree } from './util'
import { vs, allFs } from '@/shaders/shader-practice/shader-start'
import * as THREE from 'three'
export function main() {
  const { scene, tick } = initThree()

  const createPlane = (fragmentShader: string, x: number, y: number) => {
    const geo = new THREE.PlaneGeometry(1, 1, 32, 32)
    const mat = new THREE.RawShaderMaterial({
      vertexShader: vs,
      fragmentShader,
      side: THREE.DoubleSide
    })
    const mesh = new THREE.Mesh(geo, mat)
    mesh.position.set(x, y, 0)
    scene.add(mesh)
  }

  let x = -5
  let y = 2.6

  for (let i = 0; i < allFs.length; i++) {
    createPlane(allFs[i], x, y)

    x += 1.2
    if (x > 6) {
      y -= 1.2
      x = -5
    }
  }

  tick()

  // createPlane(allFs[1], x, y)
}
