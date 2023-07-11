import React, { useEffect, useRef } from 'react'

export function Test1() {
  const canvasRef = useRef(null)
  const fabricCanvas = useRef(null)

  const draw = (canvas) => {
    // 多边形
    let polygon = new fabric.Polygon(
      [
        { x: 30, y: 30 },
        { x: 150, y: 100 },
        { x: 80, y: 100 },
        { x: 100, y: 30 },
      ],
      {
        fill: '#ffd3b6', // 填充色
        stroke: '#6639a6', // 线段颜色：紫色
        strokeWidth: 5, // 线段粗细 5
      }
    )

    // 将多边形添加到画布中
    canvas.add(polygon)
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
