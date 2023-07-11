import React, { useEffect, useRef } from 'react'

export function Test1() {
  const canvasRef = useRef(null)
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
    // 创建矩形
    const rect = new fabric.Rect({
      originX: 'center',
      originY: 'center',
      width: 60, // 矩形宽度
      height: 40, // 矩形高度
    })

    // 将矩形添加到画布中
    canvas.add(rect)
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
    // 创建矩形
    const rect = new fabric.Rect({
      originX: 'left',
      originY: 'top',
      width: 60, // 矩形宽度
      height: 40, // 矩形高度
    })

    // 将矩形添加到画布中
    canvas.add(rect)
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

export function Test4() {
  const canvasRef = useRef(null)
  const fabricCanvas = useRef(null)

  const draw = (canvas) => {
    // 创建矩形
    const rect = new fabric.Rect({
      top: 20,
      left: 30,
      width: 60,
      height: 40,
      fill: '#95e1d3',
      stroke: 'red',
      strokeWidth: 10, // 设置边框宽度
    })

    // 将矩形添加到画布中
    canvas.add(rect)
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

export function Test5() {
  const canvasRef = useRef(null)
  const fabricCanvas = useRef(null)

  const draw = (canvas) => {
    // 创建矩形
    const rect = new fabric.Rect({
      top: 20,
      left: 30,
      width: 60,
      height: 40,
      fill: '#95e1d3',
      stroke: 'red',
      strokeWidth: 10, // 设置边框宽度
      strokeUniform: true,
    })

    // 将矩形添加到画布中
    canvas.add(rect)
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

export function Test6() {
  const canvasRef = useRef(null)
  const fabricCanvas = useRef(null)

  const draw = (canvas) => {
    let rect1 = new fabric.Rect({
      top: 20,
      left: 30,
      width: 60,
      height: 40,
      fill: 'transparent',
      stroke: 'red',
      strokeDashArray: [10], // 虚线
    })

    let rect2 = new fabric.Rect({
      top: 20,
      left: 120,
      width: 60,
      height: 40,
      fill: 'transparent',
      stroke: 'blue',
      strokeDashArray: [10, 20], // 虚线
    })

    let rect3 = new fabric.Rect({
      top: 20,
      left: 210,
      width: 60,
      height: 40,
      fill: 'transparent',
      stroke: 'green',
      strokeDashArray: [10, 20, 30], // 虚线
    })

    canvas.add(rect1, rect2, rect3)
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

export function Test7() {
  const canvasRef = useRef(null)
  const fabricCanvas = useRef(null)

  const draw = (canvas) => {
    let rect1 = new fabric.Rect({
      top: 20,
      left: 30,
      width: 60,
      height: 40,
      fill: 'transparent',
      stroke: 'red',
      strokeDashArray: [10],
      strokeDashOffset: 4, // 逆时针偏移
    })

    let rect2 = new fabric.Rect({
      top: 20,
      left: 120,
      width: 60,
      height: 40,
      fill: 'transparent',
      stroke: 'blue',
      strokeDashArray: [10, 20],
      strokeDashOffset: -4, // 顺时针偏移
    })

    canvas.add(rect1, rect2)
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

export function Test8() {
  const canvasRef = useRef(null)
  const fabricCanvas = useRef(null)

  const draw = (canvas) => {
    let rect1 = new fabric.Rect({
      top: 20,
      left: 20,
      fill: 'pink',
      width: 80,
      height: 60,
      rx: 10, // 只设置了rx，那么ry的值也是10
    })

    let rect2 = new fabric.Rect({
      top: 20,
      left: 120,
      fill: 'orange',
      width: 80,
      height: 60,
      rx: 10,
      ry: 20,
    })

    let rect3 = new fabric.Rect({
      top: 20,
      left: 220,
      fill: 'skyblue',
      width: 80,
      height: 60,
      rx: 30, // rx 和 ry 的值是 height 的一半，此时 height 比 width 小
      ry: 30,
    })

    let rect4 = new fabric.Rect({
      top: 20,
      left: 320,
      fill: 'lightgreen',
      width: 80,
      height: 60,
      rx: 40, // rx 和 ry 的值是 width 的一半，此时 width 比 height 大
      ry: 40,
    })

    let rect5 = new fabric.Rect({
      top: 20,
      left: 420,
      fill: 'purple',
      width: 60,
      height: 60,
      rx: 30, // 如果 width 和 height 一样（正方形），而 rx 和 ry 都是 width 和 height 的一半，那此时显示的是圆形
      ry: 30,
    })

    canvas.add(rect1, rect2, rect3, rect4, rect5)
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
        width="500"
        style={{ border: '1px solid #ccc' }}
      ></canvas>
    </div>
  )
}

export function Test9() {
  const canvasRef = useRef(null)
  const fabricCanvas = useRef(null)

  const draw = (canvas) => {
    let rect = new fabric.Rect({
      top: 20,
      left: 20,
      width: 80,
      height: 60,
      angle: 10, // 旋转10度
    })

    canvas.add(rect)
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

export function Test10() {
  const canvasRef = useRef(null)
  const fabricCanvas = useRef(null)

  const draw = (canvas) => {
    // 线性渐变
    let gradient = new fabric.Gradient({
      type: 'linear', // linear or radial
      gradientUnits: 'pixels', // pixels or pencentage 像素 或者 百分比
      coords: { x1: 0, y1: 0, x2: 80, y2: 60 }, // 至少2个坐标对（x1，y1和x2，y2）将定义渐变在对象上的扩展方式
      colorStops: [
        // 定义渐变颜色的数组
        { offset: 0, color: 'orange' },
        { offset: 1, color: 'blue' },
      ],
    })

    let rect1 = new fabric.Rect({
      top: 20,
      left: 20,
      width: 80,
      height: 60,
      fill: gradient,
    })

    let rect2 = new fabric.Rect({
      top: 20,
      left: 140,
      width: 80,
      height: 60,
      fill: gradient,
      flipX: true, // 水平翻转
    })

    let rect3 = new fabric.Rect({
      top: 20,
      left: 260,
      width: 80,
      height: 60,
      fill: gradient,
      flipY: true, // 垂直翻转
    })

    canvas.add(rect1, rect2, rect3)
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
      <canvas ref={canvasRef} style={{ border: '1px solid #ccc' }} width="500"></canvas>
    </div>
  )
}
