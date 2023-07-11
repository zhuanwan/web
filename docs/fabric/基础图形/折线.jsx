import React, { useEffect, useRef } from 'react'

export function Test1() {
  const canvasRef = useRef(null)
  const fabricCanvas = useRef(null)

  const draw = (canvas) => {
    // 折线
    let polyline1 = new fabric.Polyline(
      [
        { x: 30, y: 30 },
        { x: 150, y: 100 },
        { x: 80, y: 100 },
        { x: 100, y: 30 },
      ],
      {
        fill: 'transparent', // 如果画折线，需要填充透明
        stroke: '#6639a6', // 线段颜色：紫色
        strokeWidth: 5, // 线段粗细 5
      }
    )

    // 折线
    let polyline2 = new fabric.Polyline(
      [
        { x: 30, y: 30 },
        { x: 150, y: 100 },
        { x: 80, y: 100 },
        { x: 100, y: 30 },
      ],
      {
        left: 140,
        fill: '#f00', // 如果画折线，需要填充透明
        stroke: '#6639a6', // 线段颜色：紫色
        strokeWidth: 5, // 线段粗细 5
      }
    )

    // 将折线添加到画布中
    canvas.add(polyline1, polyline2)
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
