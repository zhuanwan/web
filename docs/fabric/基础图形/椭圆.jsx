import React, { useEffect, useRef } from 'react'

export function Test1() {
  const canvasRef = useRef(null)
  const fabricCanvas = useRef(null)

  const draw = (canvas) => {
    let ellipse = new fabric.Ellipse({
      rx: 100,
      ry: 50,
      left: 50,
      top: 20,
      fill: '#f00',
      strokeWidth: 10,
      stroke: '#0f0',
    })
    
    // 将圆形添加到画布中
    canvas.add(ellipse)
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

