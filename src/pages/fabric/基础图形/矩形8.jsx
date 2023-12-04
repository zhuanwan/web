import React, { useEffect, useRef } from 'react'
import { fabric } from 'fabric'

export default function Test1() {
  const canvasRef = useRef(null)
  const fabricCanvas = useRef(null)

  const draw = (canvas) => {
    const rect1 = new fabric.Rect({
      top: 20,
      left: 20,
      fill: 'pink',
      width: 80,
      height: 60,
      rx: 10, // 只设置了rx，那么ry的值也是10
    })

    const rect2 = new fabric.Rect({
      top: 20,
      left: 120,
      fill: 'orange',
      width: 80,
      height: 60,
      rx: 10,
      ry: 20,
    })

    const rect3 = new fabric.Rect({
      top: 20,
      left: 220,
      fill: 'skyblue',
      width: 80,
      height: 60,
      rx: 30, // rx 和 ry 的值是 height 的一半，此时 height 比 width 小
      ry: 30,
    })

    const rect4 = new fabric.Rect({
      top: 20,
      left: 320,
      fill: 'lightgreen',
      width: 80,
      height: 60,
      rx: 40, // rx 和 ry 的值是 width 的一半，此时 width 比 height 大
      ry: 40,
    })

    const rect5 = new fabric.Rect({
      top: 20,
      left: 420,
      fill: 'purple',
      width: 60,
      height: 60,
      rx: 30, // 如果 width 和 height 一样（正方形），而 rx 和 ry 都是 width 和 height 的一半，那此时显示的是圆形
      ry: 30,
    })

    canvas.add(rect1, rect2, rect3, rect4, rect5)
  }

  const init = (canvas) => {
    if (!canvas) {
      return
    }
    // 重置上一次的canvas
    canvas.off('mouse:down')
    canvas.off('mouse:wheel')
    canvas.off('mouse:move')
    canvas.off('mouse:up')
    canvas.clear()
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0])

    draw(canvas)

    canvas.on('mouse:wheel', (opt) => {
      const delta = opt.e.deltaY // 滚轮，向上滚一下是 -100，向下滚一下是 100
      let zoom = canvas.getZoom() // 获取画布当前缩放值
      zoom *= 0.999 ** delta
      if (zoom > 20) zoom = 20
      if (zoom < 0.01) zoom = 0.01

      // 以左上角为原点
      canvas.setZoom(zoom)

      // 以鼠标所在位置为原点缩放
      // canvas.zoomToPoint(
      //   {
      //     x: opt.e.offsetX,
      //     y: opt.e.offsetY,
      //   },
      //   zoom
      // )
      opt.e.preventDefault()
      opt.e.stopPropagation()
    })
  }

  useEffect(() => {
    const w = document.documentElement.clientWidth
    const h = document.documentElement.clientHeight
    canvasRef.current.width = w
    canvasRef.current.height = h

    fabricCanvas.current = new fabric.Canvas(canvasRef.current)
    init(fabricCanvas.current)
    return () => {
      fabricCanvas.current = null
    }
  }, [])
  return (
    <div>
      <canvas ref={canvasRef} />
    </div>
  )
}
