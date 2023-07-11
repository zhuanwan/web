import React, { useEffect, useRef } from 'react'

export function Test1() {
  const canvasRef = useRef(null)
  const fabricCanvas = useRef(null)

  const draw = (canvas) => {
    canvas.setBackgroundImage(
      '/images/cat.jpg',
      canvas.renderAll.bind(canvas),
      {
        scaleX: 1,
        scaleY: 1,
        left: 0,
        top: 0,
        angle: 12,
      }
    )

    let circle = new fabric.Circle({
      radius: 50, // 半径
      left: 50,
      top: 20,
      fill: '#f00',
      strokeWidth: 10,
      stroke: '#0f0',
    })

    // 将圆形添加到画布中
    canvas.add(circle)
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
    canvas.setBackgroundColor(
      {
        source: '/images/cat2.jpg',
        repeat: 'repeat',
      },
      canvas.renderAll.bind(canvas)
    )
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
      <canvas
        ref={canvasRef}
        style={{ border: '1px solid #ccc' }}
        width={500}
        height={300}
      ></canvas>
    </div>
  )
}

export function Test3() {
  const canvasRef = useRef(null)
  const fabricCanvas = useRef(null)

  const draw = (canvas) => {
    canvas.setOverlayImage('/images/ex1.png', canvas.renderAll.bind(canvas), {
      scaleX: 1,
      scaleY: 1,
      left: 0,
      top: 0,
      angle: 12,
    })

    let circle = new fabric.Circle({
      radius: 50, // 半径
      left: 50,
      top: 20,
      fill: '#f00',
      strokeWidth: 10,
      stroke: '#0f0',
    })

    // 将圆形添加到画布中
    canvas.add(circle)
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
      <canvas
        ref={canvasRef}
        style={{ border: '1px solid #ccc' }}
        width={500}
        height={400}
      ></canvas>
    </div>
  )
}
