import React, { useEffect, useRef } from 'react'
import { fabric } from 'fabric'

export default function Test1() {
  const canvasRef = useRef(null)
  const fabricCanvas = useRef(null)

  const draw = (canvas) => {
    const triangle1 = new fabric.Triangle({
      width: 80, // 底边长度
      height: 100, // 底边到对角的距离
      left: 10,
      top: 20,
      fill: '#f00',
    })

    // 选择三角形空白位置的时候无法选中，当perPixelTargetFind设为false后可以选中。默认值是false
    triangle1.perPixelTargetFind = true

    const triangle2 = new fabric.Triangle({
      width: 80, // 底边长度
      height: 100, // 底边到对角的距离
      left: 150,
      top: 20,
      fill: '#f00',
      strokeWidth: 20,
      stroke: '#0f0',
    })

    // 将三角形添加到画布中
    canvas.add(triangle1, triangle2)

    canvas.selectionFullyContained = true // 只选择完全包含在拖动选择矩形中的形状
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
