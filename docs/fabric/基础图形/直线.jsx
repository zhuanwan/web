import React, { useEffect, useRef } from 'react'

export function Test1() {
  const canvasRef = useRef(null)
  const fabricCanvas = useRef(null)

  const draw = (canvas) => {
    let line = new fabric.Line(
      [
        10, 10, // 起始点坐标
        100, 100, // 结束点坐标
      ], {
        stroke: 'red', // 笔触颜色
        strokeWidth: 10,
      }
    )
    // 将直线添加到画布中
    canvas.add(line)
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
