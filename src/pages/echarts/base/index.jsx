/**
 * 图表列表
 */
import Echarts from 'echarts-for-react'

import './index.less'

import {
  contrastBarChart,
  cubeBarChart,
  getSpfvAxisIndexColorMap,
  gradientPieChart,
  overlayCubeBarChart,
  redSeriesColors,
  timePeriodBarChart,
  treeMapChart,
} from './chart-config'

const Component = () => {
  const treeMapList = [
    {
      name: '1号楼',
      field_pl: 100,
      field_zb: 0.1,
    },
    {
      name: '2号楼',
      field_pl: 80,
      field_zb: 0.08,
    },
    {
      name: '3号楼',
      field_pl: 60,
      field_zb: 0.06,
    },
    {
      name: '4号楼',
      field_pl: 50,
      field_zb: 0.05,
    },
    {
      name: '5号楼',
      field_pl: 50,
      field_zb: 0.05,
    },
    {
      name: '6号楼',
      field_pl: 20,
      field_zb: 0.02,
    },
    {
      name: '7号楼',
      field_pl: 10,
      field_zb: 0.001,
    },
  ]

  const treeMapChartConfig = () => {
    // 基准数值，小于这个数值则需要做特殊处理
    const basis = 20
    // 重做data数据
    const seriesData = []
    treeMapList.forEach((el, idx) => {
      seriesData.push({
        ...el,
        name:
          el.field_pl <= basis
            ? `{a|${el.name}}`
            : `{a|${el.name}}\n{b|碳排量} {a|${el.field_pl}} {c|(t)}\n{b|碳排占比} {a|${el.field_zb}} {c|(%)}`,
        value: el.field_pl < basis ? basis : el.field_pl,
        itemStyle: {
          color: redSeriesColors[idx] ?? redSeriesColors[redSeriesColors.length - 1],
        },
        oName: el.name,
      })
    })
    const config = treeMapChart({
      tooltip: {
        className: 'treemap-tooltip',
        formatter: (params) => {
          const el = params.data
          if (el.name === undefined) return null
          return `<ul>
                        <li>${el.oName}</li>
                        <li><span>碳排量</span><strong>${el.field_pl}</strong>(t)</li>
                        <li><span>碳排占比</span><strong>${el.field_zb}</strong>(%)</li>
                    </ul>`
        },
      },
      seriesData,
    })
    return config
  }

  return (
    <div className="charts">
      {/* 立方体对比柱形图 */}
      <Echarts
        option={contrastBarChart({
          timeSlot: [
            '2023年1月',
            '2023年2月',
            '2023年3月',
            '2023年4月',
            '2023年5月',
            '2023年6月',
            '2023年4月',
            '2023年5月',
            '2023年6月',
          ],
          seriesData: [
            {
              name: '系列一',
              data: [100, 200, 300, 400, 300, 200, 400, 300, 200],
            },
            {
              name: '系列二',
              data: [200, 100, 200, 300, 400, 300, 200, 400, 300],
            },
          ],
          units: [],
        })}
        style={{ height: '300px', width: '1000px' }}
      />

      {/* 百分比环形图 */}
      <Echarts option={gradientPieChart({ percent: 60 })} style={{ height: '100px', width: '100px' }} />

      {/* 叠加立方体柱形图 */}
      <Echarts
        option={overlayCubeBarChart({
          timeSlot: ['01:00', '02:00', '03:00', '04:00', '05:00', '06:00'],
          seriesData: [
            {
              name: '1级',
              data: [1, 2, 3, 4, 5, 6],
              color: ['#0035AD', '#306FFF'],
            },
            {
              name: '2级',
              data: [2, 3, 4, 5, 6, 7],
              color: ['#10B2B2', '#01FFFF'],
            },
            {
              name: '3级',
              data: [3, 4, 5, 6, 7, 8],
              color: ['#A88324', '#F7C034'],
            },
          ],
          units: ['次', '次', '次'],
          // colorStops: [
          //     ['#10B2B2', '#01FFFF'],
          //     ['#A88324', '#F7C034'],
          //     ['#F7C034', '#F7C034'],
          // ],
        })}
        style={{ height: '300px', width: '1000px' }}
      />

      {/* 矩形树图 */}
      <Echarts option={treeMapChartConfig()} style={{ height: '300px', width: '600px' }} />

      {/* 百分比环形图 */}
      <Echarts option={gradientPieChart({ percent: 60 })} style={{ height: '100px', width: '100px' }} />

      {/* 立方体柱形图 */}
      <Echarts
        option={cubeBarChart({
          timeSlot: [
            '2023年1月',
            '2023年2月',
            '2023年3月',
            '2023年4月',
            '2023年5月',
            '2023年6月',
            '2023年4月',
            '2023年5月',
            '2023年6月',
          ],
          seriesData: [
            {
              name: '系列一',
              data: [100, 200, 300, 400, 300, 200, 400, 300, 200],
            },
          ],
          units: ['kW'],
          markLineData: [{ name: '阈值1', yAxis: 100, color: '#F59A23' }],
        })}
        style={{ height: '300px', width: '1000px' }}
      />
      {/* 立方体柱形图 */}
      <Echarts
        option={cubeBarChart({
          timeSlot: [
            '2023年1月',
            '2023年2月',
            '2023年3月',
            '2023年4月',
            '2023年5月',
            '2023年6月',
            '2023年4月',
            '2023年5月',
            '2023年6月',
          ],
          seriesData: [
            {
              name: '系列一',
              data: [100, 200, 300, 400, 300, 200, 400, 300, 200],
            },
          ],
          units: ['kW'],
          markLineData: [{ name: '阈值1', yAxis: 100, color: '#F59A23' }],
          barWidth: 10,
        })}
        style={{ height: '300px', width: '1000px' }}
      />
      {/* 分时段柱形图 */}
      <Echarts
        option={timePeriodBarChart({
          timeSlot: [
            '00:00',
            '01:00',
            '02:00',
            '03:00',
            '04:00',
            '05:00',
            '06:00',
            '07:00',
            '08:00',
            '09:00',
            '10:00',
            '11:00',
            '12:00',
            '13:00',
            '14:00',
            '15:00',
            '16:00',
            '17:00',
            '18:00',
            '19:00',
            '20:00',
            '21:00',
            '22:00',
            '23:00',
          ],
          seriesData: [
            {
              name: '柱状图',
              value: [1, 2, 3, 4, 5, 6, 1, 2, 3, 4, -5, 6, 3, 5, 5, -7, 2, 5, 5, 1, 6, 6, 8, 9],
            },
            {
              name: '折线图1',
              value: [3, 4, 5, 6, 3, 5, 5, 7, 2, 1, 2, 3, 4, 5, 6, 1, 2, 5, 5, 1, 6, 6, 8, 9],
              color: '#10B2B2',
            },
            {
              name: '折线图2',
              value: [1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6, 3, 5, 5, 7, 2, 5, 5, 1, 6, 6, 8, 9],
              color: '#A88324',
            },
          ],
          spfvAxisIndexColorMap: getSpfvAxisIndexColorMap(
            [
              {
                term: 'p',
                period: ['10:00-12:00', '14:00-19:00'],
              },
              {
                term: 'f',
                period: ['08:00-10:00', '12:00-14:00', '19:00-00:00'],
              },
              {
                term: 'v',
                period: ['00:00-08:00'],
              },
            ],
            60
          ),
          units: ['次', 'kW', 'kW'],
        })}
        style={{ height: '300px', width: '100%' }}
      />
    </div>
  )
}

export default Component
