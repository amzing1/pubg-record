import { useMouseInElement } from '@vueuse/core'
import { ref, watchEffect } from 'vue'
import { useImageContent } from '../useImageContent'
import { useMouseInDrawer } from '../useMouseInDrawer'
import { useMouseOperation } from './useMouseOperation'
import { useDrawer } from '../useDrawer'

/**鼠标指针在 canvas 元素上的样式变化 */
export function useMouseCursor() {
  const { labelCanvasRef } = useImageContent()
  const { isOutside } = useMouseInElement(labelCanvasRef)
  const { mouseMeta, mouseOperationMeta } = useMouseInDrawer()
  const { drawer } = useDrawer()
  const isDragging = ref(false)

  useMouseOperation(onMousedown, () => {}, onMouseup)

  // watchEffect(() => {
  //   if (!labelCanvasRef.value || !drawer.value) return
  //   const { annoIdx, pointIdx, keyPointIdx } = mouseMeta.value
  //   if (keyPointIdx !== undefined) {
  //     labelCanvasRef.value!.style.cursor = mouseOperationMeta.value.type
  //       ? 'grabbing'
  //       : 'grab'
  //   } else if (pointIdx === 0) {
  //     if (drawer.value.curAnno && !drawer.value.curAnno.isOver) {
  //       labelCanvasRef.value!.style.cursor = 'pointer'
  //     }
  //   } else if (
  //     annoIdx >= 0 &&
  //     (!drawer.value.curAnno || drawer.value.curAnno.isOver)
  //   ) {
  //     labelCanvasRef.value!.style.cursor = mouseOperationMeta.value.type
  //       ? 'move'
  //       : 'pointer'
  //   } else {
  //     labelCanvasRef.value!.style.cursor = 'crosshair'
  //   }
  // })
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
