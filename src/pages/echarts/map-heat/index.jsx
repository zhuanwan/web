import { useEffect, useState } from 'react'
import ReactECharts from 'echarts-for-react'

import mapBg from './bg.jpg'
import szJson from './深圳市.json'

const Component = () => {
  const [option, setOption] = useState({})

  const initOption = () => {
    echarts.registerMap('szMap', szJson)
    const config = {
      title: {
        text: '热力图',
        left: 'center',
        textStyle: {
          color: '#fff',
        },
      },
      backgroundColor: '#404a59',
      visualMap: {
        show: false,
        min: 0,
        max: 500,
        splitNumber: 5,
        inRange: {
          color: ['#d94e5d', '#eac736', '#50a3ba'].reverse(),
        },
        textStyle: {
          color: '#fff',
        },
      },
      geo: [
        {
          map: 'szMap',
          zlevel: 1,
          label: {
            emphasis: {
              show: true,
              color: '#fff',
            },
          },
          roam: true,
          itemStyle: {
            normal: {
              areaColor: 'rgba(50, 60, 72, 0.5)',
              borderColor: '#fff',
            },
            emphasis: {
              areaColor: 'rgba(117, 200, 255, 0.5)',
            },
          },
        },
        {
          map: 'szMap',
          zlevel: 0,
          itemStyle: {
            areaColor: {
              image: mapBg, // 背景图
              repeat: 'no-repeat',
            },
          },
        },
      ],

      series: [
        {
          zlevel: 2,
          type: 'heatmap',
          coordinateSystem: 'geo',
          data: szJson.features.map((ele) => {
            return {
              value: [...ele.properties.center, Math.round(Math.random() * 500)],
              symbolSize: 5,
            }
          }),
        },
      ],
    }

    setOption(config)
  }

  useEffect(() => {
    initOption()
  }, [])

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
    </div>
  )
}

export default Component
