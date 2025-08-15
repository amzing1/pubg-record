import { AnnotationPart, AnnotationPoint, getBBoxByPolygon, isPointInsidePolygon, Skeleton } from '.'

import type { AnnotationSegmentationParams, BBox } from './type'

export class AnnotationSegmentation extends AnnotationPart {
  segmentation: [number, number][]
  strokeColor: string
  fillColor: string
  isOver: boolean
  id: string
  points: AnnotationPoint[] = []
  shouldDrawPoints: boolean = true
  bbox: BBox = [0, 0, 0, 0]
  skeleton: Skeleton | null = null
  categroyId: string
  visible: boolean = true
  name: string
  idx: number = 0
  /**
   * 图片标注不需要画出 bbox，图片标注 polygon 有填充色，图片标注只有点击 polygon 区域才能选中
   * 视频标注需要同时画出 bbox，视频标注 polygon 五填充色，视频标注点击 bbox 区域就能选中
   */
  isImageLabel: boolean = false
  /**行为标签，一个标注对象在不同的时间段可能会有不同的行为，如一个人可能先向左走再向右走，在画布上当前只在标注名那里有展示这个信息 */
  actionName: string = ''
  constructor(canvas: HTMLCanvasElement, params: AnnotationSegmentationParams) {
    super(canvas)
    this.segmentation = params.segmentation
    this.strokeColor = params.strokeColor
    this.fillColor = params.fillColor
    this.isOver = params.isOver
    this.id = params.id
    this.categroyId = params.categroyId
    this.name = params.name
    this.visible = params.visible
    this.isImageLabel = params.isImageLabel
    this.actionName = params.actionName || ''
    this.getPoints()
    this.getBBox()
  }
  getPointIsIn(x: number, y: number) {
    if (this.isImageLabel) {
      return isPointInsidePolygon(
        [x, y],
        this.points.map((v) => [v.x, v.y])
      )
    } else {
      const bbox = this.bbox
      return x >= bbox[0] && x <= bbox[0] + bbox[2] && y >= bbox[1] && y <= bbox[1] + bbox[3]
    }
  }
  draw(scale = 1) {
    if (!this.visible) return
    this.drawWrapper(() => {
      this.ctx.fillStyle = this.fillColor
      this.ctx.strokeStyle = this.strokeColor
      this.ctx.lineWidth = 1 / scale
      this.points.forEach((v, i) => {
        if (i === 0) {
          this.ctx.moveTo(v.x, v.y)
        } else {
          this.ctx.lineTo(v.x, v.y)
        }
      })
      if (this.isOver && this.points.length) {
        this.ctx.lineTo(this.points[0].x, this.points[0].y)
        this.ctx.fill()
        if (!this.isImageLabel) {
          this.ctx.strokeRect(...this.bbox)
        }
      }
      this.ctx.stroke()
      // name
      // to do: 图片标注名字显示位置，暂时不显示
      if (!this.isImageLabel && this.bbox[2] > 0 && this.bbox[3] > 0 && this.isOver) {
        let text = this.idx === 0 ? this.name : `${this.name}(${this.idx})`
        if (this.actionName) {
          text += `-${this.actionName}`
        }
        this.ctx.font = `${12}px Helvetica Neue`
        let textWidth = this.ctx.measureText(text).width
        while (textWidth > this.bbox[2]) {
          text = text.slice(0, text.length - 1)
          textWidth = this.ctx.measureText(text).width
        }
        this.ctx.fillStyle = this.ctx.strokeStyle
        this.ctx.fillRect(this.bbox[0], this.bbox[1] - 19, textWidth + 8, 18)
        this.ctx.fillStyle = '#fff'
        this.ctx.fillText(text, this.bbox[0] + 4, this.bbox[1] - 6)
      }
      if (this.shouldDrawPoints) {
        this.points.forEach((v) => v.draw(scale))
      }
      if (this.isOver && this.skeleton && this.segmentation.length) {
        this.skeleton.draw(scale)
      }
    })
  }
  setSegmentation(segs: [number, number][]): void
  setSegmentation(segs: [number, number][], moveKeyPoints: true, disX: number, disY: number): void
  setSegmentation(segs: [number, number][], moveKeyPoints = false, disX = 0, disY = 0): void {
    this.segmentation = segs
    this.getPoints()
    this.getBBox()
    if (moveKeyPoints && this.skeleton) {
      this.skeleton!.keypoints.forEach((v) => {
        v.x += disX
        v.y += disY
      })
    }
  }
  getBBox() {
    const points: [number, number][] = this.points.map((v) => [v.x, v.y])
    this.bbox = getBBoxByPolygon(points)
    if (this.skeleton) {
      this.skeleton.bbox = this.bbox
    }
  }
  private getPoints() {
    const pointParams = {
      radius: 3,
      fillColor: '#fff',
      strokeColor: '#4f7fe0'
    }
    this.segmentation.forEach((v, i) => {
      if (this.points[i]) {
        this.points[i].x = v[0]
        this.points[i].y = v[1]
      } else {
        this.points.push(
          new AnnotationPoint(this.ctx.canvas, {
            x: v[0],
            y: v[1],
            ...pointParams
          })
        )
      }
    })
    if (this.points.length > this.setSegmentation.length) {
      this.points.length = this.segmentation.length
    }
  }
}
