import React, { useEffect, useRef } from 'react'

export function Test1() {
  const canvasRef = useRef(null)
  const fabricCanvas = useRef(null)

  const draw = (canvas) => {
    fabric.Image.fromURL('/images/cat.jpg', (img) => {
      // 设置背景图， 将背景图的宽高设置成画布的宽高
      canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
        scaleX: canvas.width / img.width,
        scaleY: canvas.height / img.height,
        left: 0,
        top: 0,
      })

      let rect = new fabric.Rect({
        width: 80,
        height: 100,
        left: 10,
        top: 20,
        fill: 'rgba(255,0,0,0.4)',
        name: 'rect',
      })
      // 将rect添加到画布中
      canvas.add(rect)
    })
  }

  const init = (canvas) => {
    if (!canvas) {
      return
    }
    // 重置上一次的canvas
    canvas.off('mouse:down')
    canvas.off('mouse:wheel')
    canvas.off('mouse:move')
    canvas.off('mouse:up')
    canvas.clear()
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0])

    draw(canvas)

    canvas.on('mouse:down', (opt) => {
      let evt = opt.e
      canvas.isDragging = true // isDragging 是自定义的
      canvas.lastPosX = evt.clientX // lastPosX 是自定义的
      canvas.lastPosY = evt.clientY // lastPosY 是自定义的
    })

    canvas.on('mouse:up', () => {
      // canvas.setViewportTransform(canvas.viewportTransform) // 设置此画布实例的视口转换
      canvas.isDragging = false
    })

    canvas.on('mouse:move', (opt) => {
      if (canvas.isDragging) {
        let evt = opt.e
        let vpt = canvas.viewportTransform // 聚焦视图的转换
        vpt[4] += evt.clientX - canvas.lastPosX
        vpt[5] += evt.clientY - canvas.lastPosY
        canvas.requestRenderAll()
        canvas.lastPosX = evt.clientX
        canvas.lastPosY = evt.clientY
      }
    })

    canvas.on('mouse:wheel', (opt) => {
      const delta = opt.e.deltaY // 滚轮，向上滚一下是 -100，向下滚一下是 100
      let zoom = canvas.getZoom() // 获取画布当前缩放值
      zoom *= 0.999 ** delta
      if (zoom > 20) zoom = 20
      if (zoom < 0.01) zoom = 0.01

      // 以左上角为原点
      canvas.setZoom(zoom)

      // 以鼠标所在位置为原点缩放
      // canvas.zoomToPoint(
      //   {
      //     x: opt.e.offsetX,
      //     y: opt.e.offsetY,
      //   },
      //   zoom
      // )
      opt.e.preventDefault()
      opt.e.stopPropagation()
    })
  }

  useEffect(() => {
    fabricCanvas.current = new fabric.Canvas(canvasRef.current)
    init(fabricCanvas.current)
    return () => {
      fabricCanvas = null
    }
  }, [])
  return (
    <div>
      <canvas
        ref={canvasRef}
        style={{ border: '1px solid #ccc' }}
        width={300}
        height={200}
      ></canvas>
    </div>
  )
}

export function Test2() {
  const canvasRef = useRef(null)
  const fabricCanvas = useRef(null)

  const draw = (canvas) => {
    fabric.Image.fromURL('/images/cat.jpg', (img) => {
      // 设置背景图， 将背景图的宽高设置成画布的宽高
      canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
        scaleX: canvas.width / img.width,
        scaleY: canvas.height / img.height,
        left: 0,
        top: 0,
      })

      let rect = new fabric.Rect({
        width: 80,
        height: 100,
        left: 10,
        top: 20,
        fill: 'rgba(255,0,0,0.4)',
        name: 'rect',
      })
      // 将rect添加到画布中
      canvas.add(rect)
    })
  }

  const init = (canvas) => {
    if (!canvas) {
      return
    }
    // 重置上一次的canvas
    canvas.off('mouse:down')
    canvas.off('mouse:wheel')
    canvas.off('mouse:move')
    canvas.off('mouse:up')
    canvas.clear()
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0])

    draw(canvas)

    let panning = false
    canvas.on('mouse:down', (opt) => {
      panning = true
      // canvas.selection = false; // 禁止元素框选
    })

    canvas.on('mouse:up', () => {
      panning = false
      // canvas.selection = true;
    })

    canvas.on('mouse:move', (opt) => {
      if (panning && opt && opt.e) {
        const delta = new fabric.Point(opt.e.movementX, opt.e.movementY)
        canvas.relativePan(delta)
      }
    })

    canvas.on('mouse:wheel', (opt) => {
      const delta = opt.e.deltaY // 滚轮，向上滚一下是 -100，向下滚一下是 100
      let zoom = canvas.getZoom() // 获取画布当前缩放值
      zoom *= 0.999 ** delta
      if (zoom > 20) zoom = 20
      if (zoom < 0.01) zoom = 0.01

      // 以左上角为原点
      canvas.setZoom(zoom)

      // 以鼠标所在位置为原点缩放
      // canvas.zoomToPoint(
      //   {
      //     x: opt.e.offsetX,
      //     y: opt.e.offsetY,
      //   },
      //   zoom
      // )
      opt.e.preventDefault()
      opt.e.stopPropagation()
    })
  }

  useEffect(() => {
    fabricCanvas.current = new fabric.Canvas(canvasRef.current)
    init(fabricCanvas.current)
    return () => {
      fabricCanvas = null
    }
  }, [])
  return (
    <div>
      <canvas
        ref={canvasRef}
        style={{ border: '1px solid #ccc' }}
        width={300}
        height={200}
      ></canvas>
    </div>
  )
}
