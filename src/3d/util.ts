import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
function initThree() {
  const el = document.querySelector('.canvas-container') as HTMLElement
  const w = el.offsetWidth
  const h = el.offsetHeight
  const renderer = new THREE.WebGLRenderer({
    antialias: true
  })
  renderer.setSize(w, h)
  renderer.setClearColor(new THREE.Color(0.05, 0.05, 0.1))
  el.appendChild(renderer.domElement)

  const scene = new THREE.Scene()

  const camera = new THREE.PerspectiveCamera(45, w / h, 1, 100)
  camera.position.z = 10

  const control = new OrbitControls(camera, renderer.domElement)
  const gui = new dat.GUI({ width: 320 })
  el!.appendChild(gui.domElement)

  const setSize = () => {
    const el = document.querySelector('.canvas-container') as HTMLElement
    const w = el.offsetWidth
    const h = el.offsetHeight
    renderer.setSize(w, h)
    camera.aspect = w / h
  }
  const tick = (callback?: () => void) => {
    control.update()
    callback?.()
    renderer.render(scene, camera)
    requestAnimationFrame(() => tick(callback))
  }

  window.addEventListener('resize', setSize)

  return {
    scene,
    camera,
    gui,
    tick,
    renderer
  }
}

export { initThree }
