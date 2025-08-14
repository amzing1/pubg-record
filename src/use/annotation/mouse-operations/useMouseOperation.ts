import { onUnmounted } from 'vue'
type Fn = (...args: any[]) => any

export function useMouseOperation(onMousedown: Fn, onMousemove: Fn, onMouseup: Fn) {
  window.addEventListener('mousedown', onMousedown)
  window.addEventListener('mousemove', onMousemove)
  window.addEventListener('mouseup', onMouseup)

  onUnmounted(() => {
    window.removeEventListener('mousedown', onMousedown)
    window.removeEventListener('mousemove', onMousemove)
    window.removeEventListener('mouseup', onMouseup)
  })
}
