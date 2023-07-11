import React, { useEffect, useRef } from 'react'

export function Test1() {
  const canvasRef = useRef(null)
  const fabricCanvas = useRef(null)

  const draw = (canvas) => {
    // 创建路径
    let path = new fabric.Path('M 20 20 L 100 80 L 70 100 z', {
      fill: 'hotpink', // 填充 亮粉色
      stroke: 'black', // 描边颜色 黑色
    })

    // 将路径添加到画布中
    canvas.add(path)
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
