import React, { useEffect, useRef } from 'react'
import { fabric } from 'fabric'

export default function Test1() {
  const canvasRef = useRef(null)
  const fabricCanvas = useRef(null)

  const draw = (canvas) => {
    // 线性渐变
    const gradient = new fabric.Gradient({
      type: 'linear', // linear or radial
      gradientUnits: 'pixels', // pixels or pencentage 像素 或者 百分比
      coords: { x1: 0, y1: 0, x2: 80, y2: 60 }, // 至少2个坐标对（x1，y1和x2，y2）将定义渐变在对象上的扩展方式
      colorStops: [
        // 定义渐变颜色的数组
        { offset: 0, color: 'orange' },
        { offset: 1, color: 'blue' },
      ],
    })

    const rect1 = new fabric.Rect({
      top: 20,
      left: 20,
      width: 80,
      height: 60,
      fill: gradient,
    })

    const rect2 = new fabric.Rect({
      top: 20,
      left: 140,
      width: 80,
      height: 60,
      fill: gradient,
      flipX: true, // 水平翻转
    })

    const rect3 = new fabric.Rect({
      top: 20,
      left: 260,
      width: 80,
      height: 60,
      fill: gradient,
      flipY: true, // 垂直翻转
    })

    canvas.add(rect1, rect2, rect3)
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
