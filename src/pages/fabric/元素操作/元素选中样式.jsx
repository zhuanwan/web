import React, { useEffect, useRef } from 'react'
import { fabric } from 'fabric'

export function Test1() {
  const canvasRef = useRef(null)
  const fabricCanvas = useRef(null)

  const draw = (canvas) => {
    fabric.Image.fromURL('/images/cat.jpg', (img) => {
      // 设置背景图， 将背景图的宽高设置成画布的宽高
      canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
        scaleX: canvas.width / img.width,
        scaleY: canvas.height / img.height,
        left: 0,
        top: 0,
      })

      const rect = new fabric.Rect({
        width: 80,
        height: 100,
        left: 10,
        top: 20,
        fill: 'rgba(255,0,0,0.4)',
        name: 'rect',
      })

      rect.set({
        borderColor: 'red', // 边框颜色
        cornerColor: 'green', // 控制角颜色
        cornerSize: 10, // 控制角大小
        transparentCorners: false, // 控制角填充色不透明
        // transparentCorners: true, // 控制角填充色透明
        selectionBackgroundColor: 'orange', // 选中后，背景色变橙色
      })

      // rect.hasBorders = false // 取消边框
      // rect.hasControls = false // 禁止控制角
      canvas.hoverCursor = 'wait' // 设置等待指针

      // 将rect添加到画布中
      canvas.add(rect)

      // canvas.setActiveObject(rect) // 选中rect
    })
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
    fabricCanvas.current = new fabric.Canvas(canvasRef.current)
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
