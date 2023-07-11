import React, { useEffect, useRef } from 'react'

export function Test1() {
  const canvasRef = useRef(null)
  const fabricCanvas = useRef(null)

  const draw = (canvas) => {
    const rect = new fabric.Rect({
      top: 20,
      left: 120,
      width: 60,
      height: 40,
      fill: 'transparent',
      stroke: 'blue'
    })
    canvas.add(rect)

    console.log('toPng', canvas.toDataURL('png')) // 在控制台输出 png（base64）
    canvas.requestRenderAll()
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
