/* eslint-disable react/no-array-index-key */
import { useEffect, useRef, useState } from 'react'
import { Progress } from 'antd'

import styles from './index.module.less'

function Color() {
  const r = Math.floor(Math.random() * 255)
  const g = Math.floor(Math.random() * 255)
  const b = Math.floor(Math.random() * 255)
  return `rgba(${r},${g},${b},0.5)`
}

const Component = () => {
  const percentRef = useRef(0)
  const [percent, setPercent] = useState(0)
  const timerRef = useRef(null)

  // iframe向主页面发送数据
  const sendMessage = () => {
    window.parent.postMessage(
      JSON.stringify({
        load: 'done',
      }),
      '*'
    )
  }

  const addPercent = () => {
    if (percentRef.current >= 100) {
      clearTimeout(timerRef.current)
      sendMessage()
      return
    }
    percentRef.current += 10
    setPercent(percentRef.current)
    timerRef.current = setTimeout(() => {
      addPercent()
    }, 1000)
  }

  useEffect(() => {
    addPercent()
    return () => {
      clearTimeout(timerRef.current)
    }
  }, [])

  useEffect(() => {
    // iframe接收数据
    window.addEventListener('message', function (e) {
      try {
        const params = JSON.parse(e.data)
        console.log('我是iframe我接收到数据：', params)
      } catch (error) {
        console.log(error)
      }
    })
  }, [])

  return (
    <div className={styles.page}>
      {percentRef.current >= 100 ? (
        Array(96)
          .fill('')
          .map((ele, i) => <div className={styles.item} key={i} style={{ background: Color() }} />)
      ) : (
        <div className={styles['progress-bar']} size="large">
          <Progress percent={percentRef.current} />
        </div>
      )}
    </div>
  )
}

export default Component
