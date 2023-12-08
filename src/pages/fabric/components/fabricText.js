import { fabric } from 'fabric'

export const FabricText = fabric.util.createClass(fabric.Text, {
  type: 'border-text', // 添加一个 type 属性
  // 初始化
  initialize(text, options) {
    this.callSuper('initialize', text, options) // 继承
    return this
  },
  _render(ctx) {
    fabric.Textbox.prototype._render.call(this, ctx)
    if (this.active) return
    const padding = this.padding || 2
    if (this.showTextBoxBorder) {
      const w = this.width + 2 * padding
      const h = this.height + 2 * padding
      const x = -this.width / 2 - padding
      const y = -this.height / 2 - padding
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + w, y)
      ctx.lineTo(x + w, y + h)
      ctx.lineTo(x, y + h)
      ctx.lineTo(x, y)
      ctx.closePath()
      const stroke = ctx.strokeStyle
      ctx.strokeStyle = this.textboxBorderColor
      ctx.stroke()
      ctx.strokeStyle = stroke
    }
  },
})
