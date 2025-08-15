import { v4 as uuidV4 } from 'uuid'
import { toRaw } from 'vue'

import { AnnotationSegmentation, lowerTransparent } from '../drawer'
import { clamp } from '../drawer/util'
import { useCategory } from '../useCategory'
import { useDrawer } from '../useDrawer'
import { useImageContent } from '../useImageContent'
import { useMouseInDrawer } from '../useMouseInDrawer'
import { useMouseOperation } from './useMouseOperation'

export function useCreateBBox(createPolygonCallback: (...args: any[]) => any) {
  const { labelCanvasRef, canvasPos } = useImageContent()
  const { x, y, mouseOperationMeta, initMouseOperation } = useMouseInDrawer()
  const { drawer } = useDrawer()
  const { categories } = useCategory()

  /** 移动标注图形时以鼠标按下时的坐标为基准的上右下左极限值
   * 不能将标注图形移动到 图片/视频 外
   */
  let edge: [number, number, number, number] = [0, 0, 0, 0]

  useMouseOperation(onMousedown, onMousemove, onMouseup)

  /**
   * 鼠标按下时鼠标位置位于某个标注图形上表示此时用户想要移动标注位置
   */
  function onMousedown() {
    if (mouseOperationMeta.value.type !== 'create-bbox' || !drawer.value) {
      return
    }
    const { w, h, dx, dy } = canvasPos
    edge = [dy, dx + w, dy + h, dx]
    const locked = categories.value.find((v) => v.lock)!
    // let superCategory
    // if (locked.superCategory !== 'none') {
    //   superCategory = categories.value.find((v) => v.id === locked.superCategory)
    // }
    drawer.value.curAnno = new AnnotationSegmentation(labelCanvasRef.value!, {
      segmentation: [
        [x.value, y.value],
        [x.value, y.value],
        [x.value, y.value],
        [x.value, y.value]
      ],
      strokeColor: locked.color,
      fillColor: lowerTransparent(locked.color),
      isOver: true,
      id: uuidV4(),
      name: locked.name,
      categroyId: locked.id,
      visible: true,
      isImageLabel: true,
      actionName: locked.name
    })
    drawer.value.annotations.push(drawer.value.curAnno!)
  }

  function onMousemove() {
    if (!drawer.value || mouseOperationMeta.value.type !== 'create-bbox') {
      return
    }
    const rx = clamp(edge[3], edge[1], x.value)
    const ry = clamp(edge[0], edge[2], y.value)
    const [x1, y1] = toRaw(mouseOperationMeta.value.startPos)
    const [x2, y2] = [rx, ry]
    const segs: [number, number][] = [
      [x1, y1],
      [x2, y1],
      [x2, y2],
      [x1, y2]
    ]
    drawer.value.curAnno?.setSegmentation(segs)
  }

  function onMouseup() {
    if (!drawer.value || mouseOperationMeta.value.type !== 'create-bbox') {
      return
    }
    const rx = clamp(edge[3], edge[1], x.value)
    const ry = clamp(edge[0], edge[2], y.value)
    const [x1, y1] = toRaw(mouseOperationMeta.value.startPos)
    const [x2, y2] = [rx, ry]
    if (Math.abs(x1 - x2) < 8 || Math.abs(y1 - y2) < 8) {
      const idx = drawer.value.annotations.findIndex((v) => v.id === drawer.value!.curAnno!.id)
      if (idx >= 0) {
        drawer.value.annotations.splice(idx, 1)
      }
    } else {
      createPolygonCallback(toRaw(drawer.value))
    }
    initMouseOperation()
  }
}
