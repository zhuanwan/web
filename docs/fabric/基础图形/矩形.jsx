import React, { useEffect, useRef, useState } from 'react'

export function Test1() {
  const outerRef = useRef(null)
  const fabricCanvas = useRef(null)

  const draw = (canvas) => {
    // 创建矩形
    const rect = new fabric.Rect({
      top: 20, // 距离画布顶部距离
      left: 30, // 距离画布左侧距离
      width: 60, // 矩形宽度
      height: 40, // 矩形高度
    })

    // 将矩形添加到画布中
    canvas.add(rect)
  }

  useEffect(() => {
    const createCanvas = document.createElement('canvas')
    outerRef.current.appendChild(createCanvas)
    fabricCanvas.current = new fabric.Canvas(createCanvas)
    draw(fabricCanvas.current)
    return () => {
      fabricCanvas = null
    }
  }, [])
  return (
    <div ref={outerRef}>
      <canvas id="myCanvas" width="200" height="100" style={{ border: '1px solid #000000' }}></canvas>
    </div>
  )
}

// export function Test1() {
//   const [a, setA] = useState('45454545')
//   return (
//     <div>
//       <Button
//         onClick={() => {
//           setA('ttttttttt')
//         }}
//       ></Button>
//       <div>{a}</div>
//     </div>
//   )
// }
