import { convertToWanArr, numFloorFormat } from '@/utils'

// 浮层通用样式
const markerStyle = `display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;`
export const axisLabelColor = 'rgba(255,255,255,0.6)' // 坐标轴 数值颜色
export const axisLabelFontSize = 12 // 坐标轴 数值fontsize
export const axisLineColor = '#6E7079' // 坐标轴线 颜色
export const splitLineColor = 'rgba(255, 255, 255, 0.15)' // 分隔线颜色

// 矩形树图（红色色系）
export const redSeriesColors = [
  '#FF6A6A',
  '#FF9292',
  '#FF734D',
  '#FF8E6F',
  '#FF9447',
  '#DB8F1E',
  '#FFAE33',
  '#FFAA92',
  '#FFAE73',
  '#FFC69C',
  '#FFD9A0',
]

// 矩形树图（蓝色色系）
export const blueSeriesColors = [
  '#00B063',
  '#00E581',
  '#27FFA1',
  '#00B08A',
  '#03CBA0',
  '#009398',
  '#00B9BF',
  '#00D3DB',
  '#00E2B1',
  '#03FFC8',
  '#3FF8FF',
]

// s尖,p峰,f平,v谷,
export const colorPeriod = {
  s: ['#901A1A', '#FF5858', '#FF5858'],
  p: ['#8D6604', '#D0A128', '#F7C034'],
  f: ['#0035AD', '#306FFF', '#306FFF'],
  v: ['#017E48', '#03DB7D', '#03DB7D'],
}

// 菱形柱形颜色列表
export const cubeBarColors = [
  ['#0035AD', '#306FFF'],
  ['#A88324', '#F7C034'],
]

// y轴通用配置
const yAxisConfig = {
  type: 'value',
  max: (v) => {
    return Math.round(v.max + v.max / 5)
  },
  splitNumber: 5,
  axisLabel: { show: false, color: axisLabelColor, fontSize: axisLabelFontSize },
  axisLine: {
    show: false,
    lineStyle: {
      width: 1,
      color: axisLineColor,
    },
  },
  axisTick: { show: false },
  splitLine: {
    lineStyle: {
      width: 0.5,
      color: splitLineColor,
      type: 'dashed',
    },
  },
}

// markline通用配置
const markLine = (markLineData) => {
  return {
    emphasis: {
      disabled: true,
    },
    symbol: ['none', 'none'],
    label: {
      show: false,
    },
    data: markLineData.map((el) => {
      return {
        name: el.name,
        yAxis: el.yAxis,
        lineStyle: {
          color: el.color ?? '#ffd858',
        },
      }
    }),
  }
}

/**
 * 立方体对比柱形图
 * @param {type: number, desc: 柱体宽度} barWidth
 * @param {type: number, desc: 倾斜角度} barAngle
 * @param {type: array, desc: 时间轴} timeSlot
 * @param {type: array, desc: 包含了名称、数据、颜色等信息, example: [{name:string, data:array, color:string[]}...] } seriesData
 * @param {type: array, desc: 颜色隐射, 0:顶部颜色, 1:左侧颜色, 2:右侧颜色} colorArr
 * @param {type: array, desc: 类目单位} units
 */
export const contrastBarChart = ({
  timeSlot = [],
  barWidth = 12,
  seriesData = [],
  barAngle = 4,
  colorArr = [
    ['#00E2FC', '#0293A4', '#00E2FC'],
    ['#FFD858', '#DCAE17', '#FFD858'],
  ],
  units = [],
} = {}) => {
  // 绘制左侧面
  const CubeLeft = echarts.graphic.extendShape({
    shape: {
      x: 0,
      y: 0,
    },
    buildPath(ctx, shape) {
      // 会canvas的应该都能看得懂，shape是从custom传入的
      const { xAxisPoint } = shape
      const c0 = [shape.x, shape.y]
      const c1 = [shape.x - barWidth, shape.y - barAngle]
      const c2 = [xAxisPoint[0] - barWidth, xAxisPoint[1] - barAngle]
      const c3 = [xAxisPoint[0], xAxisPoint[1]]
      ctx.moveTo(c0[0], c0[1]).lineTo(c1[0], c1[1]).lineTo(c2[0], c2[1]).lineTo(c3[0], c3[1]).closePath()
    },
  })
  // 绘制右侧面
  const CubeRight = echarts.graphic.extendShape({
    shape: {
      x: 0,
      y: 0,
    },
    buildPath(ctx, shape) {
      const { xAxisPoint } = shape
      const c1 = [shape.x, shape.y]
      const c2 = [xAxisPoint[0], xAxisPoint[1]]
      const c3 = [xAxisPoint[0] + barWidth, xAxisPoint[1] - barAngle]
      const c4 = [shape.x + barWidth, shape.y - barAngle]
      ctx.moveTo(c1[0], c1[1]).lineTo(c2[0], c2[1]).lineTo(c3[0], c3[1]).lineTo(c4[0], c4[1]).closePath()
    },
  })
  // 绘制顶面
  const CubeTop = echarts.graphic.extendShape({
    shape: {
      x: 0,
      y: 0,
    },
    buildPath(ctx, shape) {
      const c1 = [shape.x, shape.y]
      const c2 = [shape.x + barWidth, shape.y - barAngle]
      const c3 = [shape.x, shape.y - barAngle * 2]
      const c4 = [shape.x - barWidth, shape.y - barAngle]
      ctx.moveTo(c1[0], c1[1]).lineTo(c2[0], c2[1]).lineTo(c3[0], c3[1]).lineTo(c4[0], c4[1]).closePath()
    },
  })
  // 注册三个面图形
  echarts.graphic.registerShape('CubeLeft', CubeLeft)
  echarts.graphic.registerShape('CubeRight', CubeRight)
  echarts.graphic.registerShape('CubeTop', CubeTop)

  // 批量处理柱体
  const customs = []
  const offsets = [-12, 12]
  const seriesCustom = (data = [], colors = [], offset = 0) => {
    return {
      type: 'custom',
      renderItem: (_, api) => {
        const location = api.coord([api.value(0), api.value(1)])
        return {
          type: 'group',
          x: offset,
          children: [
            {
              type: 'CubeLeft',
              shape: {
                api,
                xValue: api.value(0),
                yValue: api.value(1),
                x: location[0],
                y: location[1],
                xAxisPoint: api.coord([api.value(0), 0]),
              },
              style: {
                fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: colors[1],
                  },
                  {
                    offset: 1,
                    color: '#f00',
                  },
                ]),
              },
            },
            {
              type: 'CubeRight',
              shape: {
                api,
                xValue: api.value(0),
                yValue: api.value(1),
                x: location[0],
                y: location[1],
                xAxisPoint: api.coord([api.value(0), 0]),
              },
              style: {
                fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: colors[2],
                  },
                  {
                    offset: 1,
                    color: '#f00',
                  },
                ]),
              },
            },
            {
              type: 'CubeTop',
              shape: {
                api,
                xValue: api.value(0),
                yValue: api.value(1),
                x: location[0],
                y: location[1],
                xAxisPoint: api.coord([api.value(0), 0]),
              },
              style: {
                fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: colors[0],
                  },
                  {
                    offset: 1,
                    color: colors[0],
                  },
                ]),
              },
            },
          ],
        }
      },
      data,
    }
  }

  seriesData.forEach((el, index) => {
    customs.push(seriesCustom(el.data, colorArr[index], offsets[index]))
  })

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter(params) {
        const { dataIndex } = params[0]
        let html = `${timeSlot[dataIndex]}<br/>`
        params.forEach((el, index) => {
          if (el.seriesType === 'custom') {
            html += `<span style="${markerStyle}background-color:${colorArr[index][0]};"></span>${
              seriesData[index].name
            }：${numFloorFormat(el.data)} ${units[index] ?? ''}<br/>`
          }
        })
        return `${html}`
      },
    },
    grid: {
      left: '10px',
      right: '10px',
      top: '5%',
      bottom: '5%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: timeSlot,
      axisLine: {
        show: true,
        lineStyle: {
          width: 1,
          color: axisLineColor,
        },
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        fontSize: axisLabelFontSize,
      },
    },
    yAxis: { ...yAxisConfig, axisLabel: { show: true, color: axisLabelColor } },
    series: [
      ...customs,
      {
        data: [],
        type: 'bar',
        itemStyle: {
          color: 'transparent',
        },
      },
    ],
  }

  return option
}

/**
 * 叠加立体柱形图
 * @param {type: array, desc: 时间轴} timeSlot
 * @param {type: number, desc: 柱体宽度} barWidth
 * @param {type: boolean, desc: 是否显示y轴信息} showYAxis
 * @param {type: array, desc: 类目单位} units
 * @param {type: array, desc: 包含了名称、数据、颜色等信息, example: [{name:string, data:array, color:string[]}...] } seriesData
 */
export const overlayCubeBarChart = ({
  timeSlot = [],
  showYAxis = false,
  seriesData = [],
  barWidth = 30,
  units = [],
} = {}) => {
  const diamondData = seriesData.reduce((pre, cur, index) => {
    pre[index] = cur.data.map((el, id) => el + (pre[index - 1] ? pre[index - 1][id] : 0))
    return pre
  }, [])

  // 菱形柱体颜色
  const color = [...seriesData].map((el) => {
    return [
      { offset: 0, color: el.color[0] },
      { offset: 0.5, color: el.color[0] },
      { offset: 0.5, color: el.color[1] },
      { offset: 1, color: el.color[1] },
    ]
  })

  // 菱形顶部颜色
  const colorStops = []
  color.forEach((el, index) => {
    if (index !== 0) {
      colorStops.push(el)
    }
  })
  const lastColor = color[color.length - 1] ? color[color.length - 1][3].color : 'transparent'
  colorStops.push([
    { offset: 0, color: lastColor },
    { offset: 0.5, color: lastColor },
    { offset: 0.5, color: lastColor },
    { offset: 1, color: lastColor },
  ])

  // 最终要展示的数据
  const series = seriesData.reduce((p, c, i, array) => {
    p.push(
      {
        z: i + 1,
        stack: '总量',
        type: 'bar',
        name: c.name,
        barWidth,
        data: c.data,
        itemStyle: { color: { type: 'linear', x: 0, x2: 1, y: 0, y2: 0, colorStops: color[i] } },
      },
      {
        z: i + 10,
        type: 'pictorialBar',
        symbolPosition: 'end',
        symbol: 'diamond',
        symbolOffset: ['0%', '-50%'],
        symbolSize: [barWidth, 10],
        data: diamondData[i],
        itemStyle: { color: { type: 'linear', x: 0, x2: 1, y: 0, y2: 0, colorStops: colorStops[i] } },
        tooltip: { show: false },
      }
    )

    // 是否最后一个了？
    if (p.length === array.length * 2) {
      p.push({
        z: array.length * 2,
        type: 'pictorialBar',
        symbolPosition: 'start',
        data: seriesData[0].data,
        symbol: 'diamond',
        symbolOffset: ['0%', '50%'],
        symbolSize: [barWidth, 10],
        itemStyle: { color: { type: 'linear', x: 0, x2: 1, y: 0, y2: 0, colorStops: color[0] } },
        tooltip: { show: false },
      })
      return p
    }

    return p
  }, [])

  // tooltip
  const tooltip = {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
    formatter(params) {
      const { dataIndex } = params[0]
      let html = `${timeSlot[dataIndex]}<br/>`
      params.forEach((el, index) => {
        html += `<span style="${markerStyle}background-color:${seriesData[index].color[1]};"></span>${
          seriesData[index].name
        }：${numFloorFormat(el.data)} ${units[index] ?? ''}<br/>`
      })
      return `${html}`
    },
  }

  // grid
  const grid = {
    left: '10px',
    right: '10px',
    top: '5%',
    bottom: '5%',
    containLabel: true,
  }

  // xAxis
  const xAxis = {
    type: 'category',
    data: timeSlot,
    axisLine: {
      lineStyle: {
        color: axisLineColor,
      },
    },
    axisTick: {
      show: false,
    },
    axisLabel: {
      color: axisLabelColor,
      fontSize: axisLabelFontSize,
      fontStyle: 100,
    },
  }

  // yAxis
  const yAxis = showYAxis
    ? {
        ...yAxisConfig,
        axisLabel: { show: true },
      }
    : {
        ...yAxisConfig,
      }
  yAxis.max = null

  // 渲染
  return { tooltip, grid, xAxis, yAxis, series }
}

/**
 * 渐变百分比环形图
 * @param { type: number, desc: 百分比} percent
 * @param { type: array, desc: 渐变颜色} linearColors
 * @param {type: number, desc: 环形宽度} barWidth
 */
export const gradientPieChart = ({ percent = 0, linearColors = ['#008BFF', '#3BDFE7'], barWidth = 6 } = {}) => {
  return {
    angleAxis: {
      show: false,
      max: 100,
      startAngle: 90,
    },
    radiusAxis: {
      type: 'category',
      show: true,
      axisLabel: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
    },
    polar: {
      radius: '185%', // 图形大小
    },
    series: [
      {
        type: 'bar',
        data: [percent],
        showBackground: true,
        roundCap: true,
        cursor: 'default',
        backgroundStyle: {
          color: 'rgba(255, 255, 255, 0.2)',
        },
        coordinateSystem: 'polar',
        barWidth,
        itemStyle: {
          normal: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: linearColors[0],
                },
                {
                  offset: 1,
                  color: linearColors[1],
                },
              ],
              global: false,
            },
          },
        },
      },
    ],
  }
}

/**
 * 立方体柱状图（单柱状）
 * @param {type: number, desc: 柱体宽度} barWidth
 * @param {type: number, desc: 倾斜角度} barAngle
 * @param {type: array, desc: 时间轴} timeSlot
 * @param {type: array, desc: 颜色隐射, 0:顶部颜色, 1:左侧颜色, 2:右侧颜色} colorArr
 * @param {type: array, desc: 类目单位} units
 * @param {type: boolean, desc: 是否显示y轴信息} showYAxis
 * @param {type: array, desc: 阈值线, example: [{ name: string, yAxis: number, color: string}...]} markLineData
 * @param {type: array, desc: 图例数据, example: [{name: string, data:array}...]} seriesData
 */
export const cubeBarChart = ({
  barWidth = 20,
  barAngle = 6,
  timeSlot = [],
  colorArr = ['#00E2FC', '#0293A4', '#00E2FC'],
  showYAxis = false,
  units = [],
  seriesData = [],
  markLineData = [],
} = {}) => {
  // 绘制左侧面
  const CubeLeft = echarts.graphic.extendShape({
    shape: {
      x: 0,
      y: 0,
    },
    buildPath(ctx, shape) {
      // 会canvas的应该都能看得懂，shape是从custom传入的
      const { xAxisPoint } = shape
      const c0 = [shape.x, shape.y]
      const c1 = [shape.x - barWidth, shape.y - barAngle]
      const c2 = [xAxisPoint[0] - barWidth, xAxisPoint[1] - barAngle]
      const c3 = [xAxisPoint[0], xAxisPoint[1]]
      ctx.moveTo(c0[0], c0[1]).lineTo(c1[0], c1[1]).lineTo(c2[0], c2[1]).lineTo(c3[0], c3[1]).closePath()
    },
  })
  // 绘制右侧面
  const CubeRight = echarts.graphic.extendShape({
    shape: {
      x: 0,
      y: 0,
    },
    buildPath(ctx, shape) {
      const { xAxisPoint } = shape
      const c1 = [shape.x, shape.y]
      const c2 = [xAxisPoint[0], xAxisPoint[1]]
      const c3 = [xAxisPoint[0] + barWidth, xAxisPoint[1] - barAngle]
      const c4 = [shape.x + barWidth, shape.y - barAngle]
      ctx.moveTo(c1[0], c1[1]).lineTo(c2[0], c2[1]).lineTo(c3[0], c3[1]).lineTo(c4[0], c4[1]).closePath()
    },
  })
  // 绘制顶面
  const CubeTop = echarts.graphic.extendShape({
    shape: {
      x: 0,
      y: 0,
    },
    buildPath(ctx, shape) {
      const c1 = [shape.x, shape.y]
      const c2 = [shape.x + barWidth, shape.y - barAngle]
      const c3 = [shape.x, shape.y - barAngle * 2]
      const c4 = [shape.x - barWidth, shape.y - barAngle]
      ctx.moveTo(c1[0], c1[1]).lineTo(c2[0], c2[1]).lineTo(c3[0], c3[1]).lineTo(c4[0], c4[1]).closePath()
    },
  })
  // 注册三个面图形
  echarts.graphic.registerShape('CubeLeft', CubeLeft)
  echarts.graphic.registerShape('CubeRight', CubeRight)
  echarts.graphic.registerShape('CubeTop', CubeTop)

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter(params) {
        const { dataIndex } = params[0]
        let html = `${timeSlot[dataIndex]}<br/>`
        params.forEach((el, index) => {
          if (el.seriesType === 'custom') {
            html += `<span style="${markerStyle}background-color:${colorArr[0]};"></span>${
              seriesData[index].name
            }：${numFloorFormat(el.data)} ${units[index] ?? ''}`
          }
        })
        return `${html}`
      },
    },
    grid: {
      left: '10px',
      right: '10px',
      top: '5%',
      bottom: '5%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: timeSlot,
      axisLine: {
        lineStyle: {
          color: axisLineColor,
        },
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: axisLabelColor,
        fontSize: axisLabelFontSize,
        fontStyle: 100,
      },
    },
    yAxis: showYAxis
      ? {
          ...yAxisConfig,
          axisLabel: { show: true },
        }
      : {
          ...yAxisConfig,
        },
    series: [
      {
        type: 'custom',
        renderItem: (_, api) => {
          const location = api.coord([api.value(0), api.value(1)])
          return {
            type: 'group',
            children: [
              {
                type: 'CubeLeft',
                shape: {
                  api,
                  xValue: api.value(0),
                  yValue: api.value(1),
                  x: location[0],
                  y: location[1],
                  xAxisPoint: api.coord([api.value(0), 0]),
                },
                style: {
                  fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: colorArr[1],
                    },
                    {
                      offset: 1,
                      color: '#f00',
                    },
                  ]),
                },
              },
              {
                type: 'CubeRight',
                shape: {
                  api,
                  xValue: api.value(0),
                  yValue: api.value(1),
                  x: location[0],
                  y: location[1],
                  xAxisPoint: api.coord([api.value(0), 0]),
                },
                style: {
                  fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: colorArr[2],
                    },
                    {
                      offset: 1,
                      color: '#f00',
                    },
                  ]),
                },
              },
              {
                type: 'CubeTop',
                shape: {
                  api,
                  xValue: api.value(0),
                  yValue: api.value(1),
                  x: location[0],
                  y: location[1],
                  xAxisPoint: api.coord([api.value(0), 0]),
                },
                style: {
                  fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: colorArr[0],
                    },
                    {
                      offset: 1,
                      color: colorArr[0],
                    },
                  ]),
                },
              },
            ],
          }
        },
        data: seriesData[0].data,
      },
      {
        data: seriesData[0].data,
        type: 'bar',
        itemStyle: {
          color: 'transparent',
        },
        markLine: markLine(markLineData),
      },
    ],
  }
}

/**
 * 矩形树图
 * @param {type: array, desc: 要显示的数据, example: [{name:string, value: number, itemStyle:{color:string}, oName: string}...]} seriesData
 * @param {type: object, desc: 提示框组件} tooltip
 */
export const treeMapChart = ({ seriesData = [], tooltip = {} } = {}) => {
  return {
    tooltip,
    series: [
      {
        type: 'treemap',
        width: '100%',
        height: '100%',
        roam: false,
        nodeClick: false,
        breadcrumb: false,
        itemStyle: {
          borderColor: 'transparent',
          borderWidth: 2,
          borderRadius: 4,
        },
        label: {
          // align: 'center',
          // verticalAlign: 'middle',
          padding: [10, 0, 0, 10],
          rich: {
            a: {
              fontSize: 14,
              fontWeight: 'bold',
              lineHeight: 20,
            },
            b: {
              fontSize: 12,
              lineHeight: 18,
              width: 50,
              fontWeight: 200,
            },
            c: {
              fontSize: 12,
              lineHeight: 18,
              fontWeight: 200,
            },
          },
        },
        emphasis: {
          label: {
            borderColor: 'rgba(255, 255, 255, 0.2)',
            borderWidth: 5,
          },
        },
        data: seriesData,
      },
    ],
  }
}

/**
 * 基础曲线图
 * @param {type: array, desc: 时间轴} timeSlot
 * @param {type: string, desc: 日期类型} picker
 * @param {type: object, desc: 图例样式} legendCon
 * @param {type: object, desc: y轴配置} yAxisCon
 * @param {type: array, desc: 类目单位} units
 * @param {type: array, desc: 阈值线, example: [{ name: string, yAxis: number, color: string}...]} markLineData
 * @param {type: array, desc: 曲线数据, example: [{name: string, data: array, color: string}...]} seriesData
 */
export const basisLineChart = ({
  timeSlot = [],
  picker = 'day',
  units = [],
  markLineData = [],
  seriesData = [],
  legendCon = {},
  yAxisCon = {},
}) => {
  // grid
  const grid = {
    left: '10px',
    right: '10px',
    top: '10%',
    bottom: '10%',
    containLabel: true,
  }

  // xAxis
  const xAxis = {
    type: 'category',
    data: timeSlot,
    axisLine: {
      lineStyle: {
        color: axisLineColor,
      },
    },
    axisTick: {
      show: false,
    },
    axisLabel: {
      color: axisLabelColor,
      fontSize: axisLabelFontSize,
      fontStyle: 100,
    },
  }

  // series
  const series = []
  // legend
  const legend = {
    show: seriesData.length > 1,
    data: [],
    bottom: 0,
    icon: 'roundRect',
    itemWidth: 10,
    itemHeight: 10,
    itemGap: 20,
    ...legendCon,
  }

  seriesData.forEach((el, index) => {
    // series 组合
    const item = {
      name: el.name,
      data: el.data,
      color: el.color,
      type: el.type ?? 'line',
      areaStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(
            0,
            0,
            0,
            1,
            [
              {
                offset: 0,
                color: '#f00',
              },
              {
                offset: 1,
                color: '#f00',
              },
            ],
            false
          ),
        },
      },
      smooth: true,
      symbol: 'none',
    }
    if (index === 0) {
      item.markLine = markLine(markLineData)
    }
    series.push(item)

    // legend 组合
    legend.data.push({
      name: item.name,
      itemStyle: {
        color: item.color,
      },
      textStyle: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 12,
      },
    })
  })

  // tooltip
  const tooltip = {
    trigger: 'axis',
    formatter(params) {
      const { dataIndex } = params[0]
      let time = timeSlot[dataIndex]
      if (picker === 'day') {
        time += `~${timeSlot[dataIndex + 1] ?? '00:00'}`
      }
      let html = `${time}<br/>`
      if (timeSlot[dataIndex] === '') {
        html = ''
      }
      params.forEach((el, index) => {
        const name = seriesData[index].name
          ? `<span style="${markerStyle}background-color:${seriesData[index].color};"></span>${seriesData[index].name}：`
          : `<span style="${markerStyle}background-color:${seriesData[index].color};"></span>`
        html += `${name}${numFloorFormat(el.data)} ${units[index] ?? ''}<br/>`
      })
      return `${html}`
    },
  }

  return {
    legend,
    tooltip,
    grid,
    xAxis,
    yAxis: {
      ...yAxisConfig,
      max: null,
      ...yAxisCon,
    },
    series,
  }
}

// 返回x坐标轴 上 点的位置 所对应的颜色
// spfvPeriod = [{term:'f', period:['07:00-09:00']}]
// axisSpace 坐标轴间隔（15分钟、30分钟、60分钟）
export const getSpfvAxisIndexColorMap = (spfvPeriod, axisSpace = 60) => {
  const minuteToAxisIndexMap = {} // {分钟：index}
  let k = 0
  for (let i = 0; i < 1440; i += axisSpace) {
    minuteToAxisIndexMap[`${i}`] = k
    k++
  }
  const map = {}
  for (let i = 0; i < spfvPeriod.length; i++) {
    const { term, period } = spfvPeriod[i]
    for (let j = 0; j < period.length; j++) {
      const timeStrArr = period[j].split('-')
      const [startHour, startMinute] = timeStrArr[0].split(':')
      const [endHour, endMinute] = timeStrArr[1].split(':')
      const start = startHour * 60 + Number(startMinute)
      let end = endHour * 60 + Number(endMinute)
      if (end === 0) {
        end = 1440
      }
      for (let m = start; m < end; m += axisSpace) {
        map[minuteToAxisIndexMap[m]] = colorPeriod[term]
      }
    }
  }
  return map
}

/**
 * 分时段柱形图
 * @param {type: array, desc: 图例数据, example: [{name: string, value:array}...]} seriesData
 * @param {type: array, desc: 时间轴} timeSlot
 * @param {type: number, desc: 柱体宽度} barWidth
 * @param {type: array, desc: 类目单位} units
 * @param {type: array, desc: 尖峰平谷时段x坐标轴 上 点的位置 所对应的颜色} spfvAxisIndexColorMap
 */
export const timePeriodBarChart = ({
  seriesData = [],
  timeSlot = [],
  barWidth = 18,
  units = [],
  spfvAxisIndexColorMap = undefined,
}) => {
  const getColor = (i, single = false) => {
    let colorArr = colorPeriod.f // 默认"平"颜色（s尖,p峰,f平,v谷）
    if (spfvAxisIndexColorMap && spfvAxisIndexColorMap[i]) {
      colorArr = spfvAxisIndexColorMap[i]
    }
    const [color0, color1, color3] = colorArr
    if (single) {
      return color3
    }
    return {
      type: 'linear',
      x: 0,
      x2: 1,
      y: 0,
      y2: 0,
      colorStops: [
        {
          offset: 0,
          color: color0,
        },
        {
          offset: 0.5,
          color: color0,
        },
        {
          offset: 0.5,
          color: color1,
        },
        {
          offset: 1,
          color: color1,
        },
      ],
    }
  }

  const getSeries = (data) => {
    const arr = []
    // 第一个是bar
    const { name: nameFirst, value: valueFirst } = data[0]
    arr.push({
      z: 1,
      name: nameFirst,
      type: 'bar',
      barWidth,
      barGap: '-100%',
      // 图表显示和tootip显示要一致，所以都截断数字
      data: valueFirst.map((v, i) => {
        return {
          value: numFloorFormat(v, 3),
          itemStyle: {
            normal: {
              color: getColor(i),
            },
          },
        }
      }),
    })
    arr.push({
      z: 2,
      name: nameFirst,
      type: 'pictorialBar',
      symbolPosition: 'end',
      data: valueFirst.map((v, i) => {
        return {
          value: v,
          symbolOffset: v >= 0 ? ['0%', '-50%'] : ['0%', '50%'],
          itemStyle: {
            normal: {
              color: getColor(i, true),
            },
          },
        }
      }),
      symbol: 'diamond',
      symbolOffset: ['0%', '-50%'],
      symbolSize: [barWidth, 10],
      tooltip: {
        show: false,
      },
    })
    // 其他是line
    for (let i = 1; i < data.length; i++) {
      const { name, value, color } = data[i]
      arr.push({
        name,
        type: 'line',
        symbol: 'circle',
        showSymbol: false,
        smooth: true, // 曲线
        color,
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
            {
              offset: 1,
              color: '#f00',
            },
            {
              offset: 0,
              color: 'rgba(255, 255, 255, 0)',
            },
          ]),
        },

        // 图表显示和tootip显示要一致，所以都截断数字
        data: value?.map((ele) => `${numFloorFormat(ele, units[i] === '%' ? 5 : 3)}`),
      })
    }
    return arr
  }

  const defaultConifg = {
    grid: { top: '16%', left: '1%', right: '1%', bottom: '8%', containLabel: true },
    legend:
      seriesData.length > 2
        ? {
            data: seriesData.slice(1).map((ele) => ele.name),
            top: 0,
            textStyle: {
              color: '#fff',
              fontSize: 12,
            },
            icon: 'roundRect',
            itemWidth: 10,
            itemHeight: 10,
            itemGap: 30,
          }
        : null,
    tooltip: {
      confine: true,
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter: (params) => {
        const h = params.reduce((prev, cur, i) => {
          const [value, unit] = convertToWanArr(cur.value)
          return `${prev}<div>${cur.marker}${cur.seriesName}：${value} ${unit}${units[i]}</div>`
        }, '')
        return `<div>${timeSlot[params[0].dataIndex]}</div>${h}`
      },
    },
    xAxis: {
      type: 'category',
      data: timeSlot,
      axisLine: {
        onZero: false,
        show: true,
        lineStyle: {
          color: axisLineColor,
        },
      },
      axisTick: false,
      splitLine: false,
      axisLabel: {
        interval: 0,
        show: true,
        color: axisLabelColor,
        fontSize: axisLabelFontSize,
      },
    },
    yAxis: {
      type: 'value',
      splitLine: {
        show: true,
        lineStyle: {
          width: 1,
          type: 'dashed',
          color: splitLineColor,
        },
      },
      axisLabel: {
        show: true,
        color: axisLabelColor,
        fontSize: axisLabelFontSize,
      },
      axisLine: false,
      axisTick: false,
    },
    series: getSeries(seriesData),
  }
  return defaultConifg
}

/**
 *  基础饼图
 * @param {type: array, desc: 图例数据, example: [{name: string, value: number, color: string}...]} seriesData
 */
export const basisPieChart = ({ seriesData = [] }) => {
  return {
    tooltip: {
      show: false,
    },
    legend: {
      show: false,
    },
    series: [
      {
        label: { formatter: '{b}：{d}%' },
        color: seriesData.map((el) => el.color),
        data: seriesData.map((el) => {
          return {
            name: el.name,
            value: el.value,
            label: { color: el.color },
          }
        }),
        type: 'pie',
        radius: ['40%', '50%'],
        labelLine: {
          show: true,
          length: 10,
          length2: 0,
        },
      },
    ],
  }
}
