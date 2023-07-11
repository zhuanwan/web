import mockData, { createRandomTree, guid } from './data.js'
const ammeterImg = document.getElementById('ammeter')
const watermeterImg = document.getElementById('watermeter')
const pvImg = document.getElementById('pv')
const pilesImg = document.getElementById('piles')
const rootImg = document.getElementById('root')
const imgMap = {
  1: ammeterImg,
  2: watermeterImg,
  3: pvImg,
  4: pilesImg,
  5: rootImg,
}
const statusMap = {
  1: '运行',
  2: '故障',
}
// 常量
const LEAF_WIDTH = 66 // 设置叶子节点的width
const LEAF_SPERATE = 17 // 叶子节点间隔

const getMonitorCount = (data, level = 0) => {
  if (!data.children || !data.children.length) {
    data.nodeCount = 1
    return 1
  }
  const nodeCount = (data.children || []).reduce((prev, curr) => {
    return prev + getMonitorCount(curr)
  }, 0)
  data.nodeCount = nodeCount
  return nodeCount
}

// 画顶部图片
function drawTopImage(image) {
  const scale = 0.6
  const imgInstance = new fabric.Image(image, {
    top: 0,
    scaleX: scale,
    scaleY: scale,
  })
  return imgInstance
}

// 画单个"机器group"
function drawSingleMachine(item, groupParams = {}) {
  const imgBorder = new fabric.Rect({
    width: 64,
    height: 64,
    strokeWidth: 2,
    stroke: item.status === 2 ? '#f00' : '#fff',
    originX: 'center',
    originY: 'center',
  })
  const img = new fabric.Image(imgMap[item.type], {
    originX: 'center',
    originY: 'center',
    scaleX: 0.6,
    scaleY: 0.6,
  })

  const imgGroup = new fabric.Group([imgBorder, img], {
    top: 0,
  })

  const nameText = new fabric.Text(item.name, {
    fontSize: 12,
    fill: '#fff',
    top: 72,
    originX: 'center',
  })

  const statusBorder = new fabric.Rect({
    width: 40,
    height: 22,
    originX: 'center',
    originY: 'center',
    strokeWidth: 1,
    stroke: item.status === 2 ? '#f00' : '#fff',
    rx: 4, //圆角半径
    ry: 4, //圆角半径
  })
  const statusText = new fabric.Text(statusMap[item.status], {
    fontSize: 12,
    fill: '#fff',
    originX: 'center',
    originY: 'center',
  })
  const statusGroup = new fabric.Group([statusBorder, statusText], {
    top: 94,
    originX: 'center',
  })

  return new fabric.Group([imgGroup, nameText, statusGroup], groupParams)
}

// 画单个开关
function drawSingleSwitch(item, groupParams = {}) {
  const circle = new fabric.Circle({
    radius: 3,
    strokeWidth: 2,
    stroke: '#0f0',
    top: 0,
    originX: 'center',
  })

  const line = new fabric.Line([0, 0, 0, 20], {
    name: 'line-control',
    strokeWidth: 2,
    stroke: '#0f0',
    top: 7,
    originX: 'center',
    angle: item.switchFlag === 1 ? -30 : 0,
  })

  const linebg = new fabric.Line([0, 0, 0, 20], {
    strokeWidth: 4,
    stroke: '#000628',
    top: 7,
    originX: 'center',
  })

  return new fabric.Group([linebg, circle, line], groupParams)
}

// 画同层级的对象
function drawSameLevel(nodes, level = 0) {
  const instances = []

  // 顶层
  if (level === 0) {
    const { nodeCount } = nodes[0]

    const width = nodeCount * (LEAF_WIDTH + LEAF_SPERATE) - LEAF_SPERATE
    const topImg = drawTopImage(rootImg)
    topImg.set({
      left: width / 2,
      top: 0,
      originX: 'center',
      hasControls: false,
      hasBorders: false,
      lockMovementX: true,
      lockMovementY: true,
      hoverCursor: 'default',
    })
    instances.push(topImg)
    nodes[0].middleX =
      (nodeCount * (LEAF_WIDTH + LEAF_SPERATE) - LEAF_SPERATE) / 2
    nodes[0].middleY = topImg.height * topImg.scaleY
  }
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    node.id = guid()
    // 计算中心点
    const { middleX, middleY, children = [], nodeCount, switchFlag } = node
    let childLeft =
      middleX - (nodeCount * (LEAF_SPERATE + LEAF_WIDTH) - LEAF_SPERATE) / 2

    // 画每一层之前给下一层确定中心顶点（middleX，middleY）和pid
    for (let j = 0; j < children.length; j++) {
      const chidNode = children[j]

      chidNode.middleX =
        childLeft +
        (chidNode.nodeCount * (LEAF_SPERATE + LEAF_WIDTH) - LEAF_SPERATE) / 2
      childLeft += chidNode.nodeCount * (LEAF_SPERATE + LEAF_WIDTH)
      chidNode.middleY = 130 + middleY
      chidNode.pid = node.id
    }

    // 确定中心顶点后画中间的横线
    if (children && children[0]) {
      const line = new fabric.Line(
        [
          children[0].middleX,
          children[0].middleY,
          children[children.length - 1].middleX,
          children[0].middleY,
        ],
        {
          strokeWidth: 2,
          stroke: '#fff',
          hasControls: false,
          hasBorders: false,
          lockMovementX: true,
          lockMovementY: true,
          hoverCursor: 'default',
          level,
          lineType: 'horizontal',
        }
      )
      instances.push(line)
    }

    // 画竖线
    const line = new fabric.Line([middleX, middleY, middleX, middleY + 130], {
      strokeWidth: 2,
      stroke: '#fff',
      hasControls: false,
      hasBorders: false,
      lockMovementX: true,
      lockMovementY: true,
      selectable: false, // 不让选中
      hoverCursor: 'default',
      level,
      lineType: 'vertical',
      nodeId: node.id,
      nodePid: node.pid,
    })
    instances.push(line)

    // 是否含有开关
    if (switchFlag) {
      instances.push(
        drawSingleSwitch(node, {
          left: middleX - 3,
          top: 30 + middleY,
          hasControls: false,
          hasBorders: false,
          lockMovementX: true,
          lockMovementY: true,
          hoverCursor: 'pointer',
          level,
          nodeId: node.id,
          nodePid: node.pid,
          isSwitch: true,
          switchFlag: node.switchFlag,
        })
      )

      idToSwitchMap[node.id] = node.switchFlag
    }

    // 如果是叶子节点，画机器
    if (!children || !children.length) {
      instances.push(
        drawSingleMachine(node, {
          left: middleX - LEAF_WIDTH / 2,
          top: middleY + 130,
          hasControls: false,
          hasBorders: false,
          lockMovementX: true,
          lockMovementY: true,
          hoverCursor: node.status === 2 ? 'default' : 'pointer',
          level,
          isLeaf: true,
          nodeId: node.id,
          nodePid: node.pid,
          status: node.status,
        })
      )
    }
  }

  return instances
}

// 得到路径中每一个点
export function getPathValues(pathArr) {
  const SPERATE = 2 // 常量间隔，为2是因为线的宽度是2
  const points = []
  for (let i = 0; i < pathArr.length - 1; i++) {
    let startPoint = pathArr[i]
    let endPoint = pathArr[i + 1]
    const [x1, y1] = startPoint
    const [x2, y2] = endPoint

    if (x1 === x2) {
      let max = y1
      while (max < y2) {
        points.push([x1, max])
        max += SPERATE
      }
      points.push([x1, y2])
    } else if (y1 === y2) {
      // 向左
      if (x1 > x2) {
        let max = x1
        while (max > x2) {
          points.push([max, y1])
          max -= SPERATE
        }
        points.push([x2, y1])
      } else {
        // 向左
        let max = x1
        while (max < x2) {
          points.push([max, y1])
          max += SPERATE
        }
        points.push([x2, y1])
      }
    }
  }
  return points
}

// 得到经过的所有竖线的路径
function getTotalLinePoints(leafInstance, instances) {
  const linePoints = []
  const lineIds = []
  let lineInstance = instances.find(
    (ins) => ins.nodeId === leafInstance.nodeId && ins.lineType === 'vertical'
  )

  while (lineInstance) {
    const { x1, y1, x2, y2, nodePid, nodeId } = lineInstance
    linePoints.push([x2, y2], [x1, y1])
    lineIds.push(nodeId)
    lineInstance = instances.find(
      (ins) => ins.nodeId === nodePid && ins.lineType === 'vertical'
    )
  }
  linePoints.reverse()
  return { linePoints, lineIds }
}

// 竖线中的开关是否有开着的 1：开启 2：关闭
function isLineSwitchOpen(lineIds) {
  return lineIds.find((id) => idToSwitchMap[id] === 1)
}

// 得到所有的fabric实例
function getAllInstances(data) {
  const instances = []
  let curNodes = [data] // 当前层级所有的node
  let level = 0

  while (curNodes.length) {
    let nextNodes = [] // 下一层级所有的node
    for (let i = 0; i < curNodes.length; i++) {
      const node = curNodes[i]
      if (node.children) {
        nextNodes.push(...node.children)
      }
    }
    instances.push(...drawSameLevel(curNodes, level))
    curNodes = nextNodes
    level++
  }
  return instances
}

function animate() {
  const keys = Object.keys(idToPathAndRect)

  for (let m = 0; m < keys.length; m++) {
    const k = keys[m]
    const { rectArr, points, len, curIndex, pause } = idToPathAndRect[k]

    // 如果暂停
    if (pause) {
      continue
    }

    const num = curIndex + 1

    for (let i = 0; i < rectArr.length; i++) {
      let j = num + i
      j = j >= len ? 0 : j

      const rect = rectArr[i]
      rect.set({
        left: points[j][0],
        top: points[j][1] - 1,
      })
    }

    idToPathAndRect[k].curIndex = num % len
  }

  canvas.renderAll()
  stats.update()
  req = requestAnimationFrame(animate)
}

// 测试
function testFn(canvas) {
  function test() {
    const newTree = createRandomTree()
    init(canvas, newTree)
  }

  document.getElementById('test').onclick = function () {
    test()
  }
}

// 入口
function init(canvas, data) {

  // 重置上一次的canvas
  canvas.off('mouse:down')
  canvas.off('mouse:wheel')
  canvas.off('mouse:move')
  canvas.off('mouse:down')
  canvas.off('mouse:up')
  window.cancelAnimationFrame(req)
  canvas.clear()
  canvas.setViewportTransform([1,0,0,1,0,0]);


  getMonitorCount(data)
  const instances = getAllInstances(data)
  canvas.add(...instances)

  // 重新设置高度
  const resultGroup = new fabric.Group(instances)
  const { width, height } = resultGroup

  const wrapperEl = canvas.wrapperEl
  const winWidth = window.innerWidth
  const winHeight = window.innerHeight

  let w, h, l, t, s
  if (width <= winWidth && height <= winHeight) {
    w = width
    h = height
    l = (winWidth - width) / 2
    t = (winHeight - height) / 2
    s = 1
  } else {
    let scaleWidth = width / winWidth
    let scaleHeight = height / winHeight

    // 宽度很长
    if (scaleWidth > scaleHeight) {
      s = (winWidth - 40) / width
      w = winWidth - 40
      h = height * s
      l = 20
      t = (winHeight - h) / 2
    } else {
      // 高度很长
      s = (winHeight - 40) / height
      h = winHeight - 40
      w = width * s
      l = (winWidth - w) / 2
      t = 20
    }
  }
  canvas.setWidth(w) // 动态设置canvas宽度
  canvas.setHeight(h) // 动态设置canvas宽度
  canvas.setZoom(s)

  wrapperEl.style.left = l + 'px'
  wrapperEl.style.top = t + 'px'

  // 鼠标点击叶子节点/开关
  canvas.on('mouse:down', function (options) {
    if (!options.target) {
      return
    }
    // 如果点击的是叶子节点
    if (options.target.isLeaf) {
      const { nodeId: id, status } = options.target

      // 如果是故障，不处理
      if (status === 2) {
        window.message.warning('机器故障，不能动画')
        return
      }

      // 如果没有动画, 添加动画
      if (!idToPathAndRect[id]) {
        const { linePoints, lineIds } = getTotalLinePoints(
          options.target,
          instances
        )
        // 如果发现路线中有开关没有关闭，则不处理
        if (isLineSwitchOpen(lineIds)) {
          window.message.warning('路线中有开关未闭合，不能动画')
          return
        }
        // 根据所有线的起始点返回间隔点
        const points = getPathValues(linePoints)

        const rectArr = []
        for (let i = 0; i < 8; i++) {
          const rect = new fabric.Rect({
            left: points[i][0],
            top: points[i][1],
            width: 0,
            height: 2,
            strokeWidth: 2,
            stroke: '#f00',
            fill: '#f00',
            hasControls: false,
            hasBorders: false,
            lockMovementX: true,
            lockMovementY: true,
            hoverCursor: 'default',
          })
          rectArr.push(rect)
        }
        canvas.add(...rectArr)
        idToPathAndRect[id] = {
          rectArr,
          points,
          curIndex: 0, // 当前位置
          len: points.length,
          pause: true,
          lineIds,
        }
      }

      // 暂停/继续
      idToPathAndRect[id].pause = !idToPathAndRect[id].pause
    } else if (options.target.isSwitch) {
      // 如果是开关
      const { switchFlag, _objects, nodeId } = options.target
      const lineTarget = _objects.find((o) => o.name === 'line-control')

      let switchFlagNew = switchFlag === 1 ? 2 : 1

      lineTarget.animate('angle', switchFlagNew === 1 ? -30 : 0)

      options.target.switchFlag = switchFlagNew
      idToSwitchMap[nodeId] = switchFlagNew

      // 遍历当前正在动画的路径，如果其中路径中有开关开着的，把该条动画删除
      Object.keys(idToPathAndRect).forEach((k) => {
        const { lineIds } = idToPathAndRect[k]
        if (isLineSwitchOpen(lineIds)) {
          canvas.remove(...idToPathAndRect[k].rectArr)
          delete idToPathAndRect[k]
        }
      })
    }
  })


  let isDragging = false
  canvas.on('mouse:wheel', function (opt) {
    const delta = opt.e.deltaY
    let zoom = canvas.getZoom()
    zoom *= 0.999 ** delta
    if (zoom > 20) zoom = 20
    if (zoom < 0.01) zoom = 0.01
    canvas.zoomToPoint(
      {
        x: opt.e.offsetX,
        y: opt.e.offsetY,
      },
      zoom
    )
    opt.e.preventDefault()
    opt.e.stopPropagation()
  })

  canvas.on('mouse:move', function (e) {
    if (isDragging && e && e.e) {
      const delta = new fabric.Point(e.e.movementX, e.e.movementY)
      canvas.relativePan(delta)
    }
  })

  canvas.on('mouse:down', function (e) {
    isDragging = true
    canvas.selection = false
  })

  canvas.on('mouse:up', function (e) {
    isDragging = false
    canvas.selection = true
  })

  animate()
}

//初始化统计对象
function initStats() {
  var stats = new Stats()
  //设置统计模式
  stats.setMode(0) // 0: fps, 1: ms
  //统计信息显示在左上角
  stats.domElement.style.position = 'absolute'
  stats.domElement.style.left = '0px'
  stats.domElement.style.top = '0px'
  //将统计对象添加到对应的<div>元素中
  document.getElementById('stats-output').appendChild(stats.domElement)
  return stats
}

var canvas = new fabric.Canvas('canvas')
var stats = initStats()
const idToPathAndRect = {} // 正在动画的路径
const idToSwitchMap = {} // 所有开关的状态
let req // 动画requestAnimationFrame
init(canvas, mockData)
testFn(canvas)
