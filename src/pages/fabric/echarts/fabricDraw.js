import { fabric } from 'fabric'

import { FabricEChart } from '@/pages/fabric/components/FabricEchart'
import ammeterImg from '@/static/imgs/ammeter.png'
import pilesImg from '@/static/imgs/piles.png'
import pvImg from '@/static/imgs/pv.png'
import rootImg from '@/static/imgs/root.png'
import watermeterImg from '@/static/imgs/watermeter.png'

// 常量
const LEAF_WIDTH = 68 // 设置叶子节点的width
const LEAF_SPERATE = 18 // 叶子节点间隔

const imgMap = {
  1: ammeterImg,
  2: pilesImg,
  3: watermeterImg,
  4: pvImg,
}

const getMonitorCount = (data) => {
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

// 画竖线
const drawLine = (canvas, startX, startY, endX, endY) => {
  const line = new fabric.Line([startX, startY, endX, endY], {
    fill: '#FFF',
    stroke: '#000',
    strokeWidth: 2,
    evented: false,
  })
  canvas.add(line)
}

// 画点击按钮
const drawClickBtn = (canvas, left, top, id) => {
  const textBorder = new fabric.Rect({
    width: 40,
    height: 22,
    originX: 'center',
    originY: 'center',
    strokeWidth: 1,
    stroke: '#f00',
    fill: '#00f',
    rx: 4, // 圆角半径
    ry: 4, // 圆角半径
  })
  const text = new fabric.Text('详情', {
    fontSize: 12,
    fill: '#0f0',
    originX: 'center',
    originY: 'center',
  })
  const textGroup = new fabric.Group([textBorder, text], {
    name: 'clickBtn',
    id,
    left,
    top,
    hasControls: false,
    hasBorders: false,
    lockMovementX: true,
    lockMovementY: true,
    hoverCursor: 'pointer',
  })
  canvas.add(textGroup)
}

// 画头部
const drawRootNode = (canvas, middleX, middleY) => {
  fabric.Image.fromURL(rootImg, (img) => {
    img.set({
      top: middleY,
      left: middleX - 21,
      angle: 0,
      opacity: 1,
      scaleX: 1,
      scaleY: 1,
      evented: false,
    })
    canvas.add(img)
  })
  // 画点击按钮
  drawClickBtn(canvas, middleX + 30, middleY + 100, '434')
  // 画竖线
  drawLine(canvas, middleX, middleY, middleX, middleY + 241)
  // 画右侧echart图
  const option = {
    color: ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985',
        },
      },
    },
    legend: {
      data: ['Line 1', 'Line 2', 'Line 3', 'Line 4', 'Line 5'],
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
    ],
    yAxis: [
      {
        type: 'value',
      },
    ],
    series: [
      {
        name: 'Line 1',
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: {
          width: 0,
        },
        showSymbol: false,
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgb(128, 255, 165)',
            },
            {
              offset: 1,
              color: 'rgb(1, 191, 236)',
            },
          ]),
        },
        emphasis: {
          focus: 'series',
        },
        data: [140, 232, 101, 264, 90, 340, 250],
      },
      {
        name: 'Line 2',
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: {
          width: 0,
        },
        showSymbol: false,
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgb(0, 221, 255)',
            },
            {
              offset: 1,
              color: 'rgb(77, 119, 255)',
            },
          ]),
        },
        emphasis: {
          focus: 'series',
        },
        data: [120, 282, 111, 234, 220, 340, 310],
      },
      {
        name: 'Line 3',
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: {
          width: 0,
        },
        showSymbol: false,
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgb(55, 162, 255)',
            },
            {
              offset: 1,
              color: 'rgb(116, 21, 219)',
            },
          ]),
        },
        emphasis: {
          focus: 'series',
        },
        data: [320, 132, 201, 334, 190, 130, 220],
      },
      {
        name: 'Line 4',
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: {
          width: 0,
        },
        showSymbol: false,
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgb(255, 0, 135)',
            },
            {
              offset: 1,
              color: 'rgb(135, 0, 157)',
            },
          ]),
        },
        emphasis: {
          focus: 'series',
        },
        data: [220, 402, 231, 134, 190, 230, 120],
      },
      {
        name: 'Line 5',
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: {
          width: 0,
        },
        showSymbol: false,
        label: {
          show: true,
          position: 'top',
        },
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgb(255, 191, 0)',
            },
            {
              offset: 1,
              color: 'rgb(224, 62, 76)',
            },
          ]),
        },
        emphasis: {
          focus: 'series',
        },
        data: [220, 302, 181, 234, 210, 290, 150],
      },
    ],
  }
  const chart = new FabricEChart({
    top: 50,
    left: middleX + 100,
    width: 400,
    height: 200,
    chart: option,
    hasControls: false,
    hasBorders: false,
    lockMovementX: true,
    lockMovementY: true,
    hoverCursor: 'default',
  })

  canvas.add(chart)
}

// 得到node中心点
function getNodesPosition(dataArr, nodeCount, middleX, middleY) {
  const positionArr = []
  let childLeft = middleX - (nodeCount * (LEAF_SPERATE + LEAF_WIDTH) - LEAF_SPERATE) / 2
  for (let i = 0; i < dataArr.length; i++) {
    const chidNode = dataArr[i]
    positionArr[i] = {
      middleX: childLeft + (chidNode.nodeCount * (LEAF_SPERATE + LEAF_WIDTH) - LEAF_SPERATE) / 2,
      middleY: middleY + 100,
    }

    childLeft += chidNode.nodeCount * (LEAF_SPERATE + LEAF_WIDTH)
  }
  return positionArr
}

// 递归画node
function drawNodes(canvas, dataArr, positions) {
  for (let i = 0; i < dataArr.length; i++) {
    const data = dataArr[i]
    const { children, type } = data
    const { middleX, middleY } = positions[i]
    // 如果是叶子节点
    if (type > 0) {
      // 画竖线
      drawLine(canvas, middleX, middleY, middleX, middleY + 100)
      // 画机器
      const rect = new fabric.Rect({
        top: middleY + 100,
        left: middleX - 32,
        fill: 'transparent',
        strokeWidth: 2,
        stroke: '#000',
        width: 64,
        height: 64,
        rx: 4,
        ry: 4,
        evented: false,
      })
      canvas.add(rect)
      fabric.Image.fromURL(imgMap[type], (img) => {
        img.set({
          top: middleY + 100 + (59 - img.height / 2) / 2 + 4,
          left: middleX - img.width / 4 + 1,
          angle: 0,
          opacity: 1,
          scaleX: 0.5,
          scaleY: 0.5,
          evented: false,
        })
        canvas.add(img)
      })
      const text = new fabric.Textbox(`${data.name}`, {
        left: middleX - 32,
        top: middleY + 100 + 70,
        width: 64,
        height: 20,
        textAlign: 'center',
        fill: '#000',
        fontSize: 14,
        evented: false,
      })
      canvas.add(text)
    }
    // 如果有子节点
    if (children && children.length) {
      // 画竖线
      drawLine(canvas, middleX, middleY, middleX, middleY + 100)
      // 画横线
      const positionArr = getNodesPosition(children, data.nodeCount, middleX, middleY)
      drawLine(
        canvas,
        positionArr[0].middleX,
        positionArr[0].middleY,
        positionArr[positionArr.length - 1].middleX,
        positionArr[positionArr.length - 1].middleY
      )

      drawNodes(canvas, children, positionArr)
    }
  }
}

// 画图
function drawTopology(canvas, data, middleX, middleY) {
  drawRootNode(canvas, middleX, middleY)
  drawNodes(canvas, [data], [{ middleX, middleY: middleY + 241 }])
}

export function initFabric(canvas, canvasWidth, canvasHeight, data, callback) {
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

  canvas.setWidth(canvasWidth)
  canvas.setHeight(canvasHeight)

  const count = getMonitorCount(data)
  // 树的真实宽度
  const realWidth = count * (LEAF_WIDTH + LEAF_SPERATE) - LEAF_SPERATE
  // 重新设置宽度
  if (realWidth > canvasWidth) {
    const middleX = realWidth / 2
    const middleY = 0
    drawTopology(canvas, data, middleX, middleY)
    canvas.setZoom(canvasWidth / realWidth)
  } else {
    const middleX = canvasWidth / 2
    const middleY = 0
    drawTopology(canvas, data, middleX, middleY)
    canvas.setZoom(1)
  }

  let panning = false
  canvas.on('mouse:down', (opt) => {
    panning = true
    canvas.selection = false
    if (opt.target && opt.target.name === 'clickBtn') {
      callback(opt.target.id)
    }
  })

  canvas.on('mouse:up', () => {
    panning = false
    canvas.selection = true
  })

  canvas.on('mouse:move', (opt) => {
    if (panning && opt && opt.e) {
      const delta = new fabric.Point(opt.e.movementX, opt.e.movementY)
      canvas.relativePan(delta)
    }
  })

  canvas.on('mouse:wheel', (opt) => {
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
}
