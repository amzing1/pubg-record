/**抽象类，定义可绘制的标注 */
export abstract class AnnotationPart {
  ctx: CanvasRenderingContext2D
  constructor(canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d')!
  }
  drawWrapper(cb: () => void) {
    this.ctx.save()
    this.ctx.beginPath()
    cb()
    this.ctx.closePath()
    this.ctx.restore()
  }
}
