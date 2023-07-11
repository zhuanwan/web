import React, { useEffect, useRef } from 'react'

export function Test1() {
  const canvasRef = useRef(null)
  const fabricCanvas = useRef(null)

  const draw = (canvas) => {
    fabric.Image.fromURL('/images/cat.jpg', (img) => {
      img.set({ left: 30, top: 20 })
      canvas.add(img)
    })
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
  const imgRef = useRef(null)

  const draw = (canvas) => {
    imgRef.current.onload = function () {
      const img = new fabric.Image(imgRef.current, {
        left: 30,
        top: 20,
        scaleX: 1,
        scaleY: 1,
      })
      canvas.add(img)
    }
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
      <img
        src="/images/cat.jpg"
        ref={imgRef}
        style={{ visibility: 'hidden', width: 0, height: 0 }}
      />
      <canvas ref={canvasRef} style={{ border: '1px solid #ccc' }}></canvas>
    </div>
  )
}

export function Test3() {
  const canvasRef = useRef(null)
  const fabricCanvas = useRef(null)

  const draw = (canvas) => {
    fabric.Image.fromURL('/images/cat.jpg', (img) => {
      img.set({ left: 30, top: 20 })
      canvas.add(img)
    })

    fabric.Image.fromURL('/images/cat2.jpg', (img) => {
      canvas.add(img)
      // 图片置于最底层
      img.sendToBack()
    })
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
    fabric.Image.fromURL('/images/cat.jpg', (img) => {
      // 添加滤镜
      img.filters.push(
        new fabric.Image.filters.Grayscale(),
        new fabric.Image.filters.Sepia(), //色偏
        new fabric.Image.filters.Brightness({ brightness: 0.1 }) //亮度
      )
      // 图片加载完成之后，应用滤镜效果
      img.applyFilters()
      canvas.add(img)
    })
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
