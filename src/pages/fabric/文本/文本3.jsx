import React, { useEffect, useRef } from 'react'
import { fabric } from 'fabric'

export default function Component() {
  const canvasRef = useRef(null)
  const fabricCanvas = useRef(null)

  const draw = (canvas) => {
    const text = new fabric.Text('你好啊', {
      left: 50,
      top: 50,
      fill: '#f00',
      stroke: 'blue',
      strokeWidth: 2,
      centeredRotation: false,
    })
    canvas.add(text)
  }

  useEffect(() => {
    const w = document.documentElement.clientWidth
    const h = document.documentElement.clientHeight
    canvasRef.current.width = w
    canvasRef.current.height = h

    fabricCanvas.current = new fabric.Canvas(canvasRef.current)
    draw(fabricCanvas.current)
    return () => {
      fabricCanvas.current = null
    }
  }, [])
  return <canvas ref={canvasRef} />
}
