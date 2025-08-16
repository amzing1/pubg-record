import { toRaw } from 'vue'
import { useDrawer } from '../useDrawer'
import { useMouseInDrawer } from '../useMouseInDrawer'
import { useMouseOperation } from './useMouseOperation'
import { clamp } from '../drawer/util'
import { useImageContent } from '../useImageContent'

export function useMovePolygon(changePolygonCallback: (...args: any[]) => any) {
  const { x, y, mouseOperationMeta, initMouseOperation } = useMouseInDrawer()
  const { drawer } = useDrawer()
  const { canvasPos } = useImageContent()

  /** 移动标注图形时以鼠标按下时的坐标为基准的上右下左极限值
   * 不能将标注图形移动到 图片/视频 外
   */
  let edge: [number, number, number, number] = [0, 0, 0, 0]
  /**
   * 鼠标按下时当前标注的控制点数组
   */
  let startSegs: [number, number][]

  useMouseOperation(onMousedown, onMousemove, onMouseup)

  /**
   * 鼠标按下时鼠标位置位于某个标注图形上表示此时用户想要移动标注位置
   */
  function onMousedown() {
    if (mouseOperationMeta.value.type !== 'move' || !drawer.value) {
      return
    }
    const { w, h, dx, dy } = canvasPos
    drawer.value.curAnno =
      drawer.value.annotations[mouseOperationMeta.value.annoIdx]
    const bbox = drawer.value.curAnno.bbox
    edge = [
      dy + y.value - bbox[1], //上
      dx + w - (bbox[0] + bbox[2] - x.value), // 右
      dy + h - (bbox[1] + bbox[3] - y.value), // 下
      dx + x.value - bbox[0] // 左
    ]
    startSegs = JSON.parse(JSON.stringify(drawer.value.curAnno.segmentation))
  }

  function onMousemove() {
    if (!drawer.value || mouseOperationMeta.value.type !== 'move') {
      return
    }
    const segs = toRaw(drawer.value!.curAnno!.segmentation)
    const oldX = segs[0][0]
    const oldY = segs[0][1]
    const rx = clamp(edge[3], edge[1], x.value)
    const ry = clamp(edge[0], edge[2], y.value)
    segs.forEach((v, i) => {
      v[0] = startSegs[i][0] + rx - mouseOperationMeta.value.startPos[0]
      v[1] = startSegs[i][1] + ry - mouseOperationMeta.value.startPos[1]
    })
    drawer.value!.curAnno!.setSegmentation(
      segs,
      true,
      segs[0][0] - oldX,
      segs[0][1] - oldY
    )
  }

  function onMouseup() {
    if (!drawer.value || mouseOperationMeta.value.type !== 'move') {
      return
    }
    if (
      x.value !== mouseOperationMeta.value.startPos[0] ||
      y.value !== mouseOperationMeta.value.startPos[1]
    ) {
      changePolygonCallback(toRaw(drawer.value))
    }
    initMouseOperation()
  }
}
