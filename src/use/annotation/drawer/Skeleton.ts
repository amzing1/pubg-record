import { AnnotationPart } from './AnnotationPart'
import { AnnotationPoint } from './AnnotationPoint'
import type { BBox, LabelKeyPoint, LabelSkeleton, SkeletonParams } from './type'

export class Skeleton extends AnnotationPart {
  keypoints: AnnotationPoint[] = []
  showKeyPoints: boolean = false
  bbox: BBox = [0, 0, 0, 0]
  color: string
  skeletons: LabelSkeleton[]
  constructor(canvas: HTMLCanvasElement, params: SkeletonParams) {
    super(canvas)
    this.bbox = params.bbox
    this.color = params.color
    this.skeletons = params.skeletons
    this.setKeyPoints(params.keypoints)
    this.initKeyPointPos()
  }
  draw(scale = 1) {
    this.drawWrapper(() => {
      if (!this.showKeyPoints) return
      this.ctx.lineWidth = 1 / scale
      this.skeletons.forEach((v) => {
        if (this.keypoints[v.startId].visible && this.keypoints[v.endId].visible) {
          const { x: sx, y: sy } = this.keypoints[v.startId]
          const { x: ex, y: ey } = this.keypoints[v.endId]
          this.ctx.moveTo(sx, sy)
          this.ctx.lineTo(ex, ey)
        }
      })
      this.ctx.strokeStyle = this.color
      this.ctx.stroke()
      this.keypoints.forEach((v) => v.draw(scale))
    })
  }
  deletekeyPoint(keyPointIdx: number) {
    this.keypoints[keyPointIdx].visible = false
    // this.keypoints[keyPointIdx].isSelected = false;
  }
  setSelectedKeyPoint(keyPointIdx: number) {
    this.keypoints.forEach((v) => (v.isSelected = false))
    if (keyPointIdx >= 0) {
      this.keypoints[keyPointIdx].isSelected = true
    }
  }
  private setKeyPoints(keypoints: LabelKeyPoint[]) {
    const common = {
      x: 0,
      y: 0,
      radius: 6,
      strokeColor: '#fff',
      fillColor: this.color
    }
    keypoints.forEach((v) => {
      this.keypoints.push(
        new AnnotationPoint(this.ctx.canvas, {
          ...common,
          name: v.name
        })
      )
    })
  }
  initKeyPointPos() {
    const l = this.keypoints.length
    const h = this.bbox[3] - 28
    this.showKeyPoints = h > 0 && this.bbox[2] > 10
    if (this.showKeyPoints) {
      const addLen = h / (l - 1)
      for (let i = 0; i < this.keypoints.length; i++) {
        this.keypoints[i].x = this.bbox[0] + this.bbox[2] / 2
        if (l === 1) {
          this.keypoints[i].y = this.bbox[0] + this.bbox[3] / 2
        } else {
          this.keypoints[i].y = this.bbox[1] + 8 + i * addLen + 6
        }
      }
    }
  }
}
