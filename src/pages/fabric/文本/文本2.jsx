import React, { useEffect, useRef } from 'react'
import { fabric } from 'fabric'

export default function Component() {
  const canvasRef = useRef(null)
  const fabricCanvas = useRef(null)

  const draw = (canvas) => {
    const text = new fabric.Text('你好啊', {
      fill: '#f00',
      stroke: 'blue',
      strokeWidth: 2,
      left: 150,
      top: 75,
      originX: 'center',
      originY: 'center',
    })
    canvas.add(text)
  }

  useEffect(() => {
    canvasRef.current.width = 300
    canvasRef.current.height = 150

    fabricCanvas.current = new fabric.Canvas(canvasRef.current)
    draw(fabricCanvas.current)
    return () => {
      fabricCanvas.current = null
    }
  }, [])
  return <canvas ref={canvasRef} style={{ width: 300, height: 150, border: '1px solid red' }} />
}
