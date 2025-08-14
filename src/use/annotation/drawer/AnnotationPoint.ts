import type { AnnotationPointParams } from '.'
import { AnnotationPart } from './AnnotationPart'

export class AnnotationPoint extends AnnotationPart {
  x: number
  y: number
  radius: number
  drawRadius: number = 0
  fillColor: string
  strokeColor: string
  name: string = ''
  visible: boolean = true
  isSelected: boolean = false
  constructor(canvas: HTMLCanvasElement, params: AnnotationPointParams) {
    super(canvas)
    this.x = params.x
    this.y = params.y
    this.radius = params.radius
    this.drawRadius = this.radius
    this.fillColor = params.fillColor
    this.strokeColor = params.strokeColor
    this.name = params.name || ''
  }
  draw(scale: number = 1) {
    this.drawWrapper(() => {
      if (!this.visible) {
        return
      }
      this.ctx.fillStyle = this.fillColor
      this.ctx.strokeStyle = this.isSelected ? '#4f7fe0' : this.strokeColor
      this.drawRadius = this.isSelected ? this.radius + 4 : this.drawRadius
      this.ctx.lineWidth = 2 / scale
      this.ctx.moveTo(this.x, this.y)
      this.ctx.arc(this.x, this.y, this.drawRadius / scale, 0, Math.PI * 2)
      this.ctx.stroke()
      this.ctx.fill()
      if (this.name) {
        this.ctx.shadowOffsetX = 1
        this.ctx.shadowOffsetY = 1
        this.ctx.shadowBlur = 1
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.8)'
        this.ctx.fillStyle = 'white'
        this.ctx.textAlign = 'right'
        this.ctx.font = '12px Helvetica Neue'
        this.ctx.fillText(this.name, this.x - 12, this.y + 4)
      }
    })
  }
  getPointIsIn(x: number, y: number) {
    const { x: tx, y: ty, radius } = this
    if (x >= tx - radius && x <= tx + radius && y >= ty - radius && y <= ty + radius) {
      this.drawRadius = this.radius + 4
      return true
    }
    this.drawRadius = this.radius
    return false
  }
}
