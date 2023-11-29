import React, { useEffect, useRef } from 'react'
import { fabric } from 'fabric'

export default function Test2() {
  const canvasRef = useRef(null)
  const fabricCanvas = useRef(null)

  const draw = (canvas) => {
    const rect = new fabric.Rect({
      width: 80,
      height: 100,
      left: 10,
      top: 60,
      fill: 'rgba(255,0,0,0.4)',
      evented: false,
    })

    const text = new fabric.Text('我不能点击选中，画布也不可以缩放哦', {
      fill: '#000',
      left: 10,
      top: 20,
      fontSize: 16,
      fontWeight: 'bold',
      evented: false,
    })
    canvas.add(rect, text)
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

    canvas.selection = false

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

    draw(canvas)
  }

  useEffect(() => {
    fabricCanvas.current = new fabric.StaticCanvas(canvasRef.current)
    init(fabricCanvas.current)
    return () => {
      fabricCanvas.current = null
    }
  }, [])
  return (
    <div>
      <canvas ref={canvasRef} style={{ border: '1px solid #ccc' }} width={300} height={200} />
    </div>
  )
}
