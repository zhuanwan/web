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
      canvas.setViewportTransform(canvas.viewportTransform) // 设置此画布实例的视口转换
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
      <div style={{ marginBottom: 10 }}>
        <span>relativePan 连续点击按钮看看 </span>
        <button
          onClick={() => {
            var delta = new fabric.Point(0, -30)
            fabricCanvas.current.relativePan(delta)
          }}
        >
          上30px
        </button>
        <button
          onClick={() => {
            var delta = new fabric.Point(0, 30)
            fabricCanvas.current.relativePan(delta)
          }}
        >
          下30px
        </button>
        <button
          onClick={() => {
            var delta = new fabric.Point(-30, 0)
            fabricCanvas.current.relativePan(delta)
          }}
        >
          左30px
        </button>
        <button
          onClick={() => {
            var delta = new fabric.Point(30, 0)
            fabricCanvas.current.relativePan(delta)
          }}
        >
          右30px
        </button>
      </div>
      <div style={{ marginBottom: 10 }}>
        <span>absolutePan </span>
        <button
          onClick={() => {
            var delta = new fabric.Point(0, -30)
            fabricCanvas.current.absolutePan(delta)
          }}
        >
          上30px
        </button>
        <button
          onClick={() => {
            var delta = new fabric.Point(0, 30)
            fabricCanvas.current.absolutePan(delta)
          }}
        >
          下30px
        </button>
        <button
          onClick={() => {
            var delta = new fabric.Point(-30, 0)
            fabricCanvas.current.absolutePan(delta)
          }}
        >
          左30px
        </button>
        <button
          onClick={() => {
            var delta = new fabric.Point(30, 0)
            fabricCanvas.current.absolutePan(delta)
          }}
        >
          右30px
        </button>
      </div>
      <div style={{ marginBottom: 10 }}>
        <span>元素基于视窗居中，缩放画布后点击 </span>
        <button
          onClick={() => {
            const objects = fabricCanvas.current.getObjects()
            const rect = objects.find((o) => o.name === 'rect')
            if (rect) {
              rect.viewportCenterH()
              // 或
              // 从画布的角度操作对象
              // fabricCanvas.current.viewportCenterObjectH(rect)
            }
          }}
        >
          水平居中
        </button>
        <button
          onClick={() => {
            const objects = fabricCanvas.current.getObjects()
            const rect = objects.find((o) => o.name === 'rect')
            if (rect) {
              rect.viewportCenterV()
              // 或
              // 从画布的角度操作对象
              // fabricCanvas.current.viewportCenterObjectV(rect)
            }
          }}
        >
          垂直居中
        </button>
        <button
          onClick={() => {
            const objects = fabricCanvas.current.getObjects()
            const rect = objects.find((o) => o.name === 'rect')
            if (rect) {
              rect.viewportCenter()
              // 或
              // 从画布的角度操作对象
              // fabricCanvas.current.viewportCenterObject(rect)
            }
          }}
        >
          水平垂直居中
        </button>
      </div>
      <div style={{ marginBottom: 10 }}>
        <span>元素基于画布居中，缩放画布后点击 </span>
        <button
          onClick={() => {
            const objects = fabricCanvas.current.getObjects()
            const rect = objects.find((o) => o.name === 'rect')
            if (rect) {
              rect.centerH()
              // 或
              // 从画布的角度操作对象
              // fabricCanvas.current.centerObjectH(rect)
            }
          }}
        >
          水平居中
        </button>
        <button
          onClick={() => {
            const objects = fabricCanvas.current.getObjects()
            const rect = objects.find((o) => o.name === 'rect')
            if (rect) {
              rect.centerV()
              // 或
              // 从画布的角度操作对象
              // fabricCanvas.current.centerObjectV(rect)
            }
          }}
        >
          垂直居中
        </button>
        <button
          onClick={() => {
            const objects = fabricCanvas.current.getObjects()
            const rect = objects.find((o) => o.name === 'rect')
            if (rect) {
              rect.center()
              // 或
              // 从画布的角度操作对象
              // fabricCanvas.current.centerObject(rect)
            }
          }}
        >
          水平垂直居中
        </button>
      </div>
      <div style={{ marginBottom: 10 }}>
        <span>带动画画布居中，缩放画布后点击 </span>
        <button
          onClick={() => {
            const objects = fabricCanvas.current.getObjects()
            const rect = objects.find((o) => o.name === 'rect')
            if (rect) {
              fabricCanvas.current.fxCenterObjectH(rect)
            }
          }}
        >
          水平居中
        </button>
        <button
          onClick={() => {
            const objects = fabricCanvas.current.getObjects()
            const rect = objects.find((o) => o.name === 'rect')
            if (rect) {
              fabricCanvas.current.fxCenterObjectV(rect)
            }
          }}
        >
          垂直居中
        </button>
      </div>
      <canvas
        ref={canvasRef}
        style={{ border: '1px solid #ccc' }}
        width={300}
        height={200}
      ></canvas>
    </div>
  )
}
