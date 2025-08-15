import { toRaw } from 'vue'
import { useMouseOperation } from '..'
import { clamp } from '../drawer/util'
import { useDrawer } from '../useDrawer'
import { useImageContent } from '../useImageContent'
import { useMouseInDrawer } from '../useMouseInDrawer'

export function useMovePoint(changePolygonCallback: (...args: any[]) => any) {
  const { x, y, mouseOperationMeta, initMouseOperation } = useMouseInDrawer()
  const { drawer } = useDrawer()
  const { canvasPos } = useImageContent()

  /** 移动标注图形时以鼠标按下时的坐标为基准的上右下左极限值
   * 不能将标注图形移动到 图片/视频 外
   */
  let edge: [number, number, number, number] = [0, 0, 0, 0]

  useMouseOperation(onMousedown, onMousemove, onMouseup)

  /**
   * 鼠标按下时鼠标位置位于某个标注图形上表示此时用户想要移动标注位置
   */
  function onMousedown() {
    if (mouseOperationMeta.value.type !== 'move-point' || !drawer.value) {
      return
    }
    const { w, h, dx, dy } = canvasPos
    drawer.value.curAnno = drawer.value.annotations[mouseOperationMeta.value.annoIdx]
    edge = [dy, dx + w, dy + h, dx]
  }

  function onMousemove() {
    if (!drawer.value || mouseOperationMeta.value.type !== 'move-point') {
      return
    }
    const segs = toRaw(drawer.value!.curAnno!.segmentation)
    const rx = clamp(edge[3], edge[1], x.value)
    const ry = clamp(edge[0], edge[2], y.value)
    segs[mouseOperationMeta.value.pointIdx] = [rx, ry]
    // 目标检测情况下拖拽一个点会影响三个点（矩形）
    // if ([2, 7].includes(taskMeta.type)) {
    //   const anchorIdx = (mouseOperationMeta.value.pointIdx + 2) % 4
    //   const anchor = segs[anchorIdx]
    //   switch (anchorIdx) {
    //     case 0:
    //       segs[1] = [rx, anchor[1]]
    //       segs[3] = [anchor[0], ry]
    //       break
    //     case 1:
    //       segs[0] = [rx, anchor[1]]
    //       segs[2] = [anchor[0], ry]
    //       break
    //     case 2:
    //       segs[1] = [anchor[0], ry]
    //       segs[3] = [rx, anchor[1]]
    //       break
    //     case 3:
    //       segs[0] = [anchor[0], ry]
    //       segs[2] = [rx, anchor[1]]
    //       break
    //   }
    // }
    drawer.value!.curAnno!.setSegmentation(segs)
  }

  function onMouseup() {
    if (!drawer.value || mouseOperationMeta.value.type !== 'move-point') {
      return
    }

    if (x.value !== mouseOperationMeta.value.startPos[0] || y.value !== mouseOperationMeta.value.startPos[1]) {
      changePolygonCallback(toRaw(drawer.value))
    }
    initMouseOperation()
  }
}
