import { v4 as uuidV4 } from 'uuid'
import { toRaw } from 'vue'
import { AnnotationSegmentation } from '../drawer'
import { clamp, lowerTransparent } from '../drawer/util'
import { useCategory } from '../useCategory'
import { useDrawer } from '../useDrawer'
import { useImageContent } from '../useImageContent'
import { useMouseInDrawer } from '../useMouseInDrawer'
import { useMouseOperation } from './useMouseOperation'

type Fn = (...args: any[]) => any
export function useCreatePolygon(createPolygonCallback: Fn) {
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
    if (mouseOperationMeta.value.type !== 'create-polygon' || !drawer.value) {
      return
    }
    const { dx, dy, w, h } = canvasPos
    edge = [dy, dx + w, dy + h, dx]
  }

  function onMousemove(e: MouseEvent) {
    if (!drawer.value?.curAnno || mouseOperationMeta.value.type !== 'create-polygon' || e.button === 1) {
      return
    }
    if (!drawer.value.curAnno.isOver) {
      const rx = clamp(edge[3], edge[1], x.value)
      const ry = clamp(edge[0], edge[2], y.value)
      drawer.value.curAnno.segmentation[drawer.value.curAnno.segmentation.length - 1] = [rx, ry]
      drawer.value.curAnno.setSegmentation(drawer.value.curAnno.segmentation)
    }
  }

  function onMouseup(e: MouseEvent) {
    if (!drawer.value || mouseOperationMeta.value.type !== 'create-polygon' || e.button === 1) {
      return
    }
    const rx = clamp(edge[3], edge[1], x.value)
    const ry = clamp(edge[0], edge[2], y.value)
    const locked = categories.value.find((v) => v.lock)!
    if (!drawer.value.curAnno || drawer.value.curAnno.isOver) {
      drawer.value.curAnno = new AnnotationSegmentation(labelCanvasRef.value!, {
        segmentation: [
          [rx, ry],
          [rx, ry]
        ],
        strokeColor: locked.color,
        fillColor: lowerTransparent(locked.color),
        isOver: false,
        id: uuidV4(),
        name: locked.name,
        categroyId: locked.id,
        visible: true,
        isImageLabel: true
      })
      drawer.value.annotations.push(drawer.value.curAnno)
      createPolygonCallback(toRaw(drawer.value))
    } else {
      const { pointIdx } = drawer.value!.checkMousePoint(x.value, y.value)
      /**再次点击第一个点表示完成标注创建 */
      if (pointIdx === 0) {
        drawer.value.curAnno.segmentation.pop()
        if (drawer.value.curAnno.segmentation.length < 3) {
          const idx = drawer.value.annotations.findIndex((v) => v.id === drawer.value!.curAnno!.id)
          if (idx >= 0) {
            drawer.value.annotations.splice(idx, 1)
          }
          drawer.value.curAnno = null
          initMouseOperation()
        } else {
          drawer.value.curAnno.setSegmentation(drawer.value.curAnno.segmentation)
          drawer.value.curAnno.isOver = true
          // if (taskMeta.type === 8) {
          //   drawer.value.curAnno.skeleton = new Skeleton(labelCanvasRef.value!, {
          //     bbox: drawer.value.curAnno.bbox,
          //     color: drawer.value.curAnno.strokeColor,
          //     skeletons: locked.skeletons,
          //     keypoints: locked.keypoints
          //   })
          // }
          createPolygonCallback(toRaw(drawer.value))
          initMouseOperation()
        }
      } else {
        drawer.value.curAnno.segmentation.push([rx, ry])
        createPolygonCallback(toRaw(drawer.value))
      }
    }
  }
}
