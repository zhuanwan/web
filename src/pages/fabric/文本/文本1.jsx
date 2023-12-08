import React, { useEffect, useRef } from 'react'
import { fabric } from 'fabric'

export default function Component() {
  const canvasRef = useRef(null)
  const fabricCanvas = useRef(null)

  const draw = (canvas) => {
    const text = new fabric.Text('你好啊', {
      left: 50,
      top: 50,
      fill: '#f00',
      stroke: 'blue',
      strokeWidth: 2,
    })
    canvas.add(text)
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

    canvas.on('mouse:down', (opt) => {
      const evt = opt.e
      canvas.isDragging = true // isDragging 是自定义的
      canvas.lastPosX = evt.clientX // lastPosX 是自定义的
      canvas.lastPosY = evt.clientY // lastPosY 是自定义的
    })

    canvas.on('mouse:up', () => {
      canvas.setViewportTransform(canvas.viewportTransform) // 设置此画布实例的视口转换
      canvas.isDragging = false
    })

    canvas.on('mouse:move', (opt) => {
      if (canvas.isDragging) {
        const evt = opt.e
        const vpt = canvas.viewportTransform // 聚焦视图的转换
        vpt[4] += evt.clientX - canvas.lastPosX
        vpt[5] += evt.clientY - canvas.lastPosY
        canvas.requestRenderAll()
        canvas.lastPosX = evt.clientX
        canvas.lastPosY = evt.clientY
      }
    })

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
  return <canvas ref={canvasRef} />
}
