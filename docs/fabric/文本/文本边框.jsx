import React, { useEffect, useRef } from 'react'
import { FabricText } from '@site/src/fabric/FabricText'

export function Test1() {
  const canvasRef = useRef(null)
  const fabricCanvas = useRef(null)

  const draw = (canvas) => {
    const text = new FabricText('我有边框', {
      fill: '#333',
      fontSize: 20,
      backgroundColor: '#fff',
      padding: 10,
      showTextBoxBorder: true,
      textboxBorderColor: '#333',
    })
    canvas.add(text)
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
