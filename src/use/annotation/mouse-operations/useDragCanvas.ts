import { useMouseInElement } from '@vueuse/core'

import { onMounted } from 'vue'

import { useImageContent } from '../useImageContent'
import { useMouseOperation } from './useMouseOperation'

export function useDragCanvas() {
  const { translate, zoom, labelCanvasRef } = useImageContent()
  const { x, y } = useMouseInElement(labelCanvasRef)

  const dragMeta = {
    isStartDrag: false,
    startPos: [0, 0],
    prePos: [0, 0],
    curPos: [0, 0]
  }

  useMouseOperation(onMousedown, onMousemove, onMouseup)
  transformByWheel()

  function onMousedown(e: MouseEvent) {
    if (e.button !== 1) {
      return
    }
    dragMeta.isStartDrag = true
    dragMeta.startPos = [x.value, y.value]
    dragMeta.curPos = [x.value, y.value]
  }

  function onMousemove() {
    if (!dragMeta.isStartDrag) {
      return
    }
    dragMeta.prePos = [...dragMeta.curPos]
    dragMeta.curPos = [x.value, y.value]
    translate([dragMeta.curPos[0] - dragMeta.prePos[0], dragMeta.curPos[1] - dragMeta.prePos[1]])
  }

  function onMouseup() {
    dragMeta.isStartDrag = false
  }

  function transformByWheel() {
    onMounted(() => {
      const canvasEl = document.querySelector('#label-canvas') as HTMLCanvasElement
      canvasEl.addEventListener('wheel', (e) => {
        e.preventDefault()
        if (e.metaKey || e.ctrlKey) {
          zoom(e.deltaY)
        } else {
          translate([e.deltaX, -e.deltaY])
        }
      })
    })
  }
}
