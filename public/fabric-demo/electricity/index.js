const WIDTH = 1920
const HEIGHT = 1080

function animate() {}
function drawBg() {
  const bgColor = new fabric.Rect({
    width: WIDTH,
    height: HEIGHT,
    fill: 'rgba(0,6,29,0.6)',
  })
  canvas.add(bgColor)
  // 竖线
  let i = 0
  while (i < 1920) {
    i += 60
    const line = new fabric.Line([i, 0, i, HEIGHT], {
      strokeWidth: 1,
      stroke: 'rgba(0,102,166,0.2)',
    })
    canvas.add(line)
  }
  // 横线
  let j = 0
  while (j < 1080) {
    j += 60
    const line = new fabric.Line([0, j, WIDTH, j], {
      strokeWidth: 1,
      stroke: 'rgba(0,102,166,0.2)',
    })
    canvas.add(line)
  }

  // 中间方框
  const linePoints = [{
    x:1,
    y:1
  }]
  new fabric.Polyline(linePoints, {
    fill: 'transparent',
    // fill: '#00f',
    stroke: 'red',
    strokeWidth: 2,
    hasControls: false,
    hasBorders: false,
    lockMovementX: true,
    lockMovementY: true,
    evented: false,
    strokeDashArray: [5, 5],
    strokeDashOffset: 0,
  })

}

// 全屏，按照1920*1080缩放
function setSize() {
  const winWidth = window.innerWidth
  const winHeight = window.innerHeight

  let w, h, t, l, s

  if (WIDTH <= winWidth && HEIGHT <= winHeight) {
    w = WIDTH
    h = HEIGHT
    l = (winWidth - WIDTH) / 2
    t = (winHeight - HEIGHT) / 2
    s = 1
  } else {
    let scaleWidth = WIDTH / winWidth
    let scaleHeight = HEIGHT / winHeight

    // 宽度很长
    if (scaleWidth > scaleHeight) {
      s = winWidth / WIDTH
      w = winWidth
      h = HEIGHT * s
      l = 0
      t = (winHeight - h) / 2
    } else {
      // 高度很长
      s = winHeight / HEIGHT
      h = winHeight
      w = WIDTH * s
      l = (winWidth - w) / 2
      t = 0
    }
  }
  canvas.setWidth(w) // 动态设置canvas宽度
  canvas.setHeight(h) // 动态设置canvas宽度
  // canvas.setZoom(s)

  canvas.lowerCanvasEl.style.marginLeft = l + 'px'
  canvas.lowerCanvasEl.style.marginTop = t + 'px'
}
// 入口
function init() {
  drawBg()

  window.onresize = function() {
    setSize()
  }
  setSize()
  animate()
}

var canvas = new fabric.StaticCanvas('canvas')
// var stats = initStats()
init()
