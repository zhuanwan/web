import React, { useEffect, useRef } from 'react'

export function Test1() {
  const canvasRef = useRef(null)
  const fabricCanvas = useRef(null)

  const draw = (canvas) => {
    const text = new fabric.Textbox('Please translate this sentence for me', {
      fill: '#f00',
      stroke: 'blue',
      strokeWidth: 2,
      width: 300,
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

export function Test2() {
  const canvasRef = useRef(null)
  const fabricCanvas = useRef(null)

  const draw = (canvas) => {
    const text = new fabric.Textbox(
      '点击可编辑，但是不换行不换行不换行不换行',
      {
        fill: '#f00',
        stroke: 'blue',
        strokeWidth: 2,
        width: 300,
      }
    )
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

export function Test3() {
  const canvasRef = useRef(null)
  const fabricCanvas = useRef(null)

  const draw = (canvas) => {
    const text = new fabric.Textbox('我可以居中', {
      fill: '#f00',
      stroke: 'blue',
      strokeWidth: 2,
      textAlign: 'center',
      width: 300,
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
