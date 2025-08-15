/**
 * 将鼠标坐标从屏幕坐标系转到实际坐标，
 * 实际坐标指的是相对于视频或图片的真实尺寸下的坐标
 **/

import { createSharedComposable, useMouseInElement } from '@vueuse/core'

import { onMounted, onUnmounted, ref, toRaw, watchEffect } from 'vue'

import { useDrawer } from './useDrawer'
import { useImageContent } from './useImageContent'

type MouseOperationMeta = {
  type: '' | 'move-keypoint' | 'move-point' | 'move' | 'create-bbox' | 'create-polygon' | 'select-action'
  /** annotations 数组中的索引 */
  annoIdx: number
  /** 当前正在操作的 annotation 的 segmentations 的索引 */
  pointIdx: number
  /** 视频标注中正在操作的 annotation 的 keypoints 中的索引, undefined 表示没有 keyPoints 字段 */
  keyPointIdx: number | undefined
  /** 鼠标按下时的坐标 */
  startPos: [number, number]
}

function mouseInDrawer() {
  const { labelCanvasRef, canvasPos, mediaTransform } = useImageContent()
  const { drawer } = useDrawer()
  const { elementX: ex, elementY: ey, isOutside } = useMouseInElement(labelCanvasRef)

  /**鼠标基于图片/视频实际像素的 x 坐标 */
  const x = ref<number>(0)
  /**鼠标基于图片/视频实际像素的 y 坐标 */
  const y = ref<number>(0)
  const isMouseInDrawer = ref(false)

  /**鼠标操作标注信息记录 */
  const mouseOperationMeta = ref<MouseOperationMeta>({
    type: '',
    annoIdx: -1,
    pointIdx: -1,
    keyPointIdx: -1,
    startPos: [0, 0]
  })

  /**鼠标位置是否在某个标注图形上 */
  const mouseMeta = ref({
    isMouseInAnnotation: false,
    annoIdx: -1,
    pointIdx: -1,
    keyPointIdx: -1
  })

  onMounted(() => {
    if (!labelCanvasRef.value) return
    labelCanvasRef.value.addEventListener('mousedown', onMousedown, true)
  })
  onUnmounted(() => {
    labelCanvasRef.value!.removeEventListener('mousedown', onMousedown, true)
  })

  /**
   * 坐标转换
   */
  watchEffect(() => {
    const coord = getMousePos(ex.value, ey.value)
    isMouseInCanvas(coord[0], coord[1])
    if (isOutside.value) return
    x.value = coord[0]
    y.value = coord[1]
  })

  /**
   * 时刻监听鼠标移动动态替换鼠标样式
   */
  watchEffect(() => {
    if (!drawer.value || isOutside.value) return
    // const { annoIdx, pointIdx, keyPointIdx } = drawer.value.checkMousePoint(x.value, y.value)
    // mouseMeta.value.annoIdx = annoIdx
    // mouseMeta.value.keyPointIdx = keyPointIdx || -1
    // mouseMeta.value.pointIdx = pointIdx
    // mouseMeta.value.isMouseInAnnotation = annoIdx >= 0
    // if (keyPointIdx !== undefined) {
    //   labelCanvasRef.value!.style.cursor = mouseOperationMeta.value.type ? 'grabbing' : 'grab'
    // } else if (pointIdx === 0) {
    //   if (drawer.value.curAnno && !drawer.value.curAnno.isOver) {
    //     labelCanvasRef.value!.style.cursor = 'pointer'
    //   }
    // } else if (annoIdx >= 0 && (!drawer.value.curAnno || drawer.value.curAnno.isOver)) {
    //   labelCanvasRef.value!.style.cursor = mouseOperationMeta.value.type ? 'move' : 'pointer'
    // } else {
    //   labelCanvasRef.value!.style.cursor = 'crosshair'
    // }
  })

  function isMouseInCanvas(x: number, y: number) {
    const { w, h, dx, dy } = canvasPos
    if (x < dx || x > dx + w || y < dy || y > dy + h) {
      isMouseInDrawer.value = false
      return
    }
    isMouseInDrawer.value = true
  }
  // videoCanvas 和 labelCanvas 可能都经过了 transform，所以需要计算点时需要经过旋转对齐坐标系
  function getMousePos(x: number, y: number) {
    function rotatePoint(point: [number, number], center: [number, number], angle: number): [number, number] {
      const dx = point[0] - center[0]
      const dy = point[1] - center[1]
      angle = (angle + 360) % 360
      const cosAngle = Math.cos((angle * Math.PI) / 180)
      const sinAngle = Math.sin((angle * Math.PI) / 180)
      const newX = dx * cosAngle - dy * sinAngle + center[0]
      const newY = dx * sinAngle + dy * cosAngle + center[1]
      return [newX, newY]
    }
    function scalePoint(point: [number, number], center: [number, number], scale: [number, number]) {
      const dx = (point[0] - center[0]) / scale[0]
      const dy = (point[1] - center[1]) / scale[1]
      const newX = center[0] + dx
      const newY = center[1] + dy
      return [newX, newY]
    }
    const { w, h, dx, dy } = canvasPos
    const angle = [90, 270].includes(mediaTransform.rotation) ? mediaTransform.rotation - 180 : mediaTransform.rotation
    const anchor: [number, number] = [dx + w / 2 - mediaTransform.offset[0], dy + h / 2 - mediaTransform.offset[1]]
    ;[x, y] = rotatePoint([x, y], anchor, angle)
    ;[x, y] = [x - mediaTransform.offset[0], y - mediaTransform.offset[1]]
    ;[x, y] = scalePoint([x, y], anchor, [mediaTransform.scale[0], mediaTransform.scale[1]])
    return [x, y]
  }

  function onMousedown(e: MouseEvent) {
    /**每次一个完整的鼠标操作过后都会将执行 initMouseOperation 操作，此后点击画布外的位置应该忽视 */
    if (!isMouseInDrawer.value && mouseOperationMeta.value.type === '') {
      return
    }
    /**鼠标中键操作只拖拽画布，不影响数据 */
    if (e.button === 1) {
      return
    }
    drawer.value = drawer.value!
    const { annoIdx, pointIdx, keyPointIdx } = drawer.value.checkMousePoint(x.value, y.value)
    mouseOperationMeta.value = {
      type: '',
      annoIdx,
      pointIdx,
      keyPointIdx,
      startPos: [toRaw(x.value), toRaw(y.value)]
    }
    if (annoIdx >= 0 && e.button === 2) {
      mouseOperationMeta.value.type = 'select-action'
    } else if (keyPointIdx !== undefined) {
      mouseOperationMeta.value.type = 'move-keypoint'
    } else if ((!drawer.value!.curAnno || drawer.value!.curAnno.isOver) && annoIdx >= 0 && pointIdx >= 0) {
      mouseOperationMeta.value.type = 'move-point'
    } else if ((!drawer.value.curAnno || drawer.value.curAnno.isOver) && annoIdx >= 0 && pointIdx === -1) {
      mouseOperationMeta.value.type = 'move'
    } else if (1 === '1') {
      mouseOperationMeta.value.type = 'create-bbox'
    } else {
      mouseOperationMeta.value.type = 'create-polygon'
    }
  }

  function initMouseOperation() {
    mouseOperationMeta.value = {
      type: '',
      annoIdx: -1,
      pointIdx: -1,
      keyPointIdx: -1,
      startPos: [0, 0]
    }
  }
  return {
    x,
    y,
    isMouseInDrawer,
    mouseOperationMeta,
    mouseMeta,
    initMouseOperation
  }
}

export const useMouseInDrawer = createSharedComposable(mouseInDrawer)
