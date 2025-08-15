import { createSharedComposable } from '@vueuse/core'
import { reactive, ref } from 'vue'
import { clamp } from './drawer/util'

export const useImageContent = createSharedComposable(() => {
  const canvasPos = reactive({
    w: 0,
    h: 0,
    dx: 0,
    dy: 0
  })
  const mediaSize = reactive({
    w: 0,
    h: 0
  })
  const mediaTransform = reactive({
    scale: [1, 1],
    rotation: 0,
    offset: [0, 0]
  })
  // img 或 video 标签
  const mediaRef = ref<HTMLImageElement | HTMLVideoElement | null>(null)
  // 用于展示图片或者视频的 canvas 元素
  const mediaCanvasRef = ref<HTMLCanvasElement | null>(null)
  // 用于绘制 label 的 canvas 元素
  const labelCanvasRef = ref<HTMLCanvasElement | null>(null)

  function onMediaLoaded() {
    onChangeCanvasSize()
  }
  function onChangeCanvasSize() {
    if (!mediaRef.value || !mediaCanvasRef.value || !labelCanvasRef.value) {
      return
    }
    if (mediaRef.value instanceof HTMLVideoElement) {
      mediaSize.w = mediaRef.value.videoWidth
      mediaSize.h = mediaRef.value.videoHeight
    } else {
      mediaSize.w = mediaRef.value.naturalWidth
      mediaSize.h = mediaRef.value.naturalHeight
    }
    mediaCanvasRef.value.width = mediaRef.value.parentElement!.offsetWidth
    mediaCanvasRef.value.height = mediaRef.value.parentElement!.offsetHeight
    labelCanvasRef.value.width = mediaRef.value.parentElement!.offsetWidth
    labelCanvasRef.value.height = mediaRef.value.parentElement!.offsetHeight
    draw()
  }
  function draw() {
    const innerDraw = () => {
      if (!mediaCanvasRef.value || !mediaRef.value) return
      const mediaCtx = mediaCanvasRef.value.getContext('2d')!
      mediaCtx.save()
      mediaCtx.clearRect(0, 0, mediaCtx.canvas.offsetWidth, mediaCtx.canvas.offsetHeight)
      const [w, h, cw, ch, dx, dy] = getViewport()
      canvasPos.w = cw
      canvasPos.h = ch
      canvasPos.dx = dx
      canvasPos.dy = dy

      /**缩放旋转 */
      mediaCtx.translate(dx + cw / 2, dy + ch / 2)
      mediaCtx.scale(mediaTransform.scale[0], mediaTransform.scale[1])
      mediaCtx.rotate((mediaTransform.rotation * Math.PI) / 180)
      mediaCtx.translate(-(dx + cw / 2), -(dy + ch / 2))
      /**平移 */
      mediaCtx.translate(mediaTransform.offset[0], mediaTransform.offset[1])

      mediaCtx.drawImage(mediaRef.value, 0, 0, w, h, dx, dy, cw, ch)
      mediaCtx.restore()
    }
    innerDraw()
  }
  function getViewport() {
    mediaRef.value = mediaRef.value!
    mediaCanvasRef.value = mediaCanvasRef.value!
    let mediaRate = 1
    const { w, h } = mediaSize
    mediaRate = w / h
    const ow = mediaRef.value.offsetWidth
    const oh = mediaRef.value.offsetHeight
    let [dx, dy, cw, ch] = [0, 0, ow, oh]
    if (w < mediaCanvasRef.value.offsetWidth && h < mediaCanvasRef.value.offsetHeight) {
      // 尺寸小的图片或视频展示在可视区域中间
      cw = w
      ch = h
      dx = (mediaCanvasRef.value.offsetWidth - cw) / 2
      dy = (mediaCanvasRef.value.offsetHeight - ch) / 2
    } else if (mediaCanvasRef.value.offsetWidth / mediaCanvasRef.value.offsetHeight >= mediaRate) {
      // 可视区域高度占满，左右居中
      ch = mediaCanvasRef.value.offsetHeight - 24
      cw = ch * mediaRate
      dx = (mediaCanvasRef.value.width - cw) / 2
      dy = 12
    } else {
      // 可视区域宽度占满，上下居中
      cw = mediaCanvasRef.value.offsetWidth - 24
      ch = cw / mediaRate
      dx = 12
      dy = (mediaCanvasRef.value.height - ch) / 2
    }
    canvasPos.w = cw
    canvasPos.h = ch
    canvasPos.dx = dx
    canvasPos.dy = dy

    return [w, h, cw, ch, dx, dy]
  }
  function translate(offset: [number, number]) {
    mediaTransform.offset[0] += offset[0] / mediaTransform.scale[0]
    mediaTransform.offset[1] += offset[1] / mediaTransform.scale[1]
    requestAnimationFrame(draw)
  }
  function zoom(val: number) {
    mediaTransform.scale[0] = clamp(0.2, 20, mediaTransform.scale[0] + val * -0.001)
    mediaTransform.scale[1] = clamp(0.2, 20, mediaTransform.scale[1] + val * -0.001)
    requestAnimationFrame(draw)
  }
  function rotate(val: 1 | -1) {
    let count = 0
    /**试一下给旋转加个小动画 */
    const anim = () => {
      const timer = setInterval(() => {
        count += 2
        mediaTransform.rotation += val * 2 + 360
        mediaTransform.rotation %= 360
        if (count === 90) {
          clearInterval(timer)
        }
        draw()
      }, 4)
    }
    anim()
    /**不加动画的版本 */
    // mediaTransform.rotation += val * 90 + 360;
    // mediaTransform.rotation %= 360;
    // draw();
  }
  function canvasCoord2Actual(point: [number, number]) {
    let [x, y] = point
    x = (x - canvasPos.dx) * (mediaSize.w / canvasPos.w)
    y = (y - canvasPos.dy) * (mediaSize.h / canvasPos.h)
    return [x, y]
  }
  function actualCoord2Canvas(point: [number, number]) {
    let [x, y] = point
    x = x * (canvasPos.w / mediaSize.w) + canvasPos.dx
    y = y * (canvasPos.h / mediaSize.h) + canvasPos.dy
    return [x, y]
  }

  // function anim<T extends number | [number, number]>(
  //   start: T,
  //   end: T,
  //   duration: number
  // ) {
  //   let t = 0;
  //   const timer = requestAnimationFrame((stamp: number) => {
  //     t += stamp;
  //     if (t > duration * 1000) {
  //       cancelAnimationFrame(timer);
  //       return;
  //     }
  //   });
  // }

  window.addEventListener('resize', onChangeCanvasSize)

  return {
    mediaRef,
    mediaCanvasRef,
    labelCanvasRef,
    canvasPos,
    mediaTransform,
    mediaSize,
    onMediaLoaded,
    draw,
    zoom,
    rotate,
    translate,
    canvasCoord2Actual,
    actualCoord2Canvas
  }
})
