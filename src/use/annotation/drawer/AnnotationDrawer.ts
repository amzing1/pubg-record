import type { AnnotationSegmentation } from '.'

export class AnnotationDrawer {
  ctx: CanvasRenderingContext2D
  annotations: AnnotationSegmentation[]
  curAnno: AnnotationSegmentation | null = null
  rotateAnchor: [number, number] = [0, 0]
  rotateAngle: number = 0
  offset: [number, number] = [0, 0]
  scale: [number, number] = [1, 1]
  constructor(canvas: HTMLCanvasElement, annotations: AnnotationSegmentation[]) {
    this.ctx = canvas.getContext('2d')!
    this.annotations = annotations
    this.draw()
  }
  draw() {
    const innerDraw = () => {
      this.ctx.save()
      this.ctx.clearRect(0, 0, this.ctx.canvas.offsetWidth, this.ctx.canvas.offsetHeight)
      this.ctx.translate(this.rotateAnchor[0], this.rotateAnchor[1])
      this.ctx.rotate((this.rotateAngle * Math.PI) / 180)
      this.ctx.scale(...this.scale)
      this.ctx.translate(-this.rotateAnchor[0], -this.rotateAnchor[1])
      this.ctx.translate(...this.offset)
      this.annotations.forEach((v) => {
        v.shouldDrawPoints = v.id === this.curAnno?.id
        v.draw(this.scale[0])
      })
      this.ctx.restore()
      requestAnimationFrame(innerDraw)
    }
    innerDraw()
  }
  setTransformMeta(angle: number, anchor: [number, number], offset: [number, number], scale: [number, number]) {
    this.rotateAnchor = anchor
    this.rotateAngle = angle
    this.offset = offset
    this.scale = scale
  }
  checkMousePoint(x: number, y: number) {
    if (this.curAnno) {
      const idx = this.annotations.findIndex((v) => v.id === this.curAnno!.id)
      const res = this.checkMouseInAnno(idx, x, y)
      if (res) {
        return res
      }
    }
    const l = this.annotations.length
    let res: ReturnType<typeof this.checkMouseInAnno> | null = null
    let minArea = Infinity
    for (let i = 0; i < l; i++) {
      const anno = this.annotations[i]
      const cur = this.checkMouseInAnno(i, x, y)
      if (cur && anno.bbox[2] * anno.bbox[3] < minArea) {
        minArea = anno.bbox[2] * anno.bbox[3]
        res = cur
      }
    }
    return (
      res || {
        annoIdx: -1,
        pointIdx: -1
      }
    )
  }
  checkMouseInAnno(i: number, x: number, y: number) {
    const anno = this.annotations[i]
    if (!anno) {
      return
    }
    for (let j = 0; j < anno.points.length; j++) {
      if (!anno.isOver && (j === anno.points.length - 1 || j === anno.points.length - 2)) {
        continue
      }

      if (anno.points[j].getPointIsIn(x, y)) {
        return {
          annoIdx: i,
          pointIdx: j
        }
      }
    }
    if (anno.skeleton) {
      for (let j = 0; j < anno.skeleton.keypoints.length; j++) {
        if (anno.skeleton.keypoints[j].getPointIsIn(x, y)) {
          return {
            annoIdx: i,
            pointIdx: -1,
            keyPointIdx: j
          }
        }
      }
    }
    if (anno.getPointIsIn(x, y)) {
      return {
        annoIdx: i,
        pointIdx: -1
      }
    }
  }
}
