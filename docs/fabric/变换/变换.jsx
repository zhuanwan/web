import React, { useEffect, useRef } from 'react'

export function Test1() {
  const canvasRef = useRef(null)
  const fabricCanvas = useRef(null)

  const draw = (canvas) => {
    var polygon = new fabric.Polygon([
      new fabric.Point(200, 50),
      new fabric.Point(250, 150),
      new fabric.Point(150, 150),
    ])

    polygon.on('modified', function () {
      var matrix = this.calcTransformMatrix()
      var transformedPoints = this.get('points')
        .map(function (p) {
          return new fabric.Point(
            p.x - polygon.pathOffset.x,
            p.y - polygon.pathOffset.y
          )
        })
        .map(function (p) {
          return fabric.util.transformPoint(p, matrix)
        })
      var circles = transformedPoints.map(function (p) {
        return new fabric.Circle({
          left: p.x,
          top: p.y,
          radius: 3,
          fill: 'red',
          originX: 'center',
          originY: 'center',
          hasControls: false,
          hasBorders: false,
          selectable: false,
        })
      })

      canvas.clear()
      canvas.add(this)
      canvas.add(...circles)
      canvas.setActiveObject(this)
      canvas.renderAll()
    })

    // 将三角形添加到画布中
    canvas.add(polygon)
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
      fabricCanvas = null
    }
  }, [])
  return (
    <div>
      <canvas
        ref={canvasRef}
        style={{ border: '1px solid #ccc' }}
        width={500}
        height={500}
      ></canvas>
    </div>
  )
}
