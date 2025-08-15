import { useMouseInElement } from '@vueuse/core'
import { ref, watchEffect } from 'vue'
import { useImageContent } from '../useImageContent'
import { useMouseInDrawer } from '../useMouseInDrawer'
import { useMouseOperation } from './useMouseOperation'

/**鼠标指针在 canvas 元素上的样式变化 */
export function useMouseCursor() {
  const { labelCanvasRef } = useImageContent()
  const { isOutside } = useMouseInElement(labelCanvasRef)
  const { mouseMeta, mouseOperationMeta } = useMouseInDrawer()
  const isDragging = ref(false)

  useMouseOperation(onMousedown, () => {}, onMouseup)

  watchEffect(() => {
    if (!labelCanvasRef.value) return

    // let cursor = 'crosshair'
    // if (isDragging.value) {
    //   cursor = 'grabbing'
    // } else if (!mouseOperationMeta.value.type && mouseMeta.value.isMouseInAnnotation) {
    //   cursor = 'grab'
    // } else if (['move-keypoint', 'move', 'move-point'].includes(mouseOperationMeta.value.type)) {
    //   cursor = 'grabbing;'
    // }
    // labelCanvasRef.value.style.cursor = cursor
    /**未处于任何鼠标操作状态，单纯的鼠标在画布内移动 */
    // if (isDragging.value && labelCanvasRef.value) {
    //   labelCanvasRef.value.style.cursor = 'grabbing'
    // } else if (labelCanvasRef.value) {
    //   labelCanvasRef.value.style.cursor = 'grab'
    // }
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
