import React, { useEffect, useRef } from 'react'

export function Test1() {
  const canvasRef = useRef(null)
  const fabricCanvas = useRef(null)

  const draw = (canvas) => {
    let triangle1 = new fabric.Triangle({
      width: 80, // 底边长度
      height: 100, // 底边到对角的距离
      left: 10,
      top: 20,
      fill: '#f00',
    })

    // 选择三角形空白位置的时候无法选中，当perPixelTargetFind设为false后可以选中。默认值是false
    triangle1.perPixelTargetFind = true

    let triangle2 = new fabric.Triangle({
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

  useEffect(() => {
    fabricCanvas.current = new fabric.Canvas(canvasRef.current)
    draw(fabricCanvas.current)
    return () => {
      fabricCanvas = null
    }
  }, [])
  return (
    <div>
      <canvas ref={canvasRef} style={{ border: '1px solid #ccc' }}></canvas>
    </div>
  )
}
