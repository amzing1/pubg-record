import { useMouseInElement } from '@vueuse/core'
import { ref, watchEffect } from 'vue'
import { useImageContent } from '../useImageContent'
import { useMouseOperation } from './useMouseOperation'

/**鼠标指针在 canvas 元素上的样式变化 */
export function useMouseCursor() {
  const { labelCanvasRef } = useImageContent()
  const { isOutside } = useMouseInElement(labelCanvasRef)
  const isDragging = ref(false)

  useMouseOperation(onMousedown, () => {}, onMouseup)

  watchEffect(() => {
    if (isDragging.value && labelCanvasRef.value) {
      labelCanvasRef.value.style.cursor = 'grabbing'
    } else if (labelCanvasRef.value) {
      labelCanvasRef.value.style.cursor = 'grab'
    }
  })

  function onMousedown(e: MouseEvent) {
    if (isOutside.value) {
      return
    }
    if (e.button === 1) {
      isDragging.value = true
    }
  }
  function onMouseup() {
    isDragging.value = false
  }
}
