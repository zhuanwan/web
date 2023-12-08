import { useEffect, useRef } from 'react'
import { Button } from 'antd'

import { createRandomTree } from './data'
import styles from './index.module.less'
import { chartConfig, useChart } from './useChart'

function App() {
  const rootRef = useRef(null)

  useChart()

  const renderData = () => {
    const data = createRandomTree()
    chartConfig(rootRef.current, data, (id) => {
      console.log('点击了id', id)
    })
  }
  useEffect(() => {
    setTimeout(() => {
      renderData()
    }, 200)
  }, [])

  return (
    <div className={styles.box}>
      <div className={styles.header}>我是头部</div>
      <div className={styles.content}>
        <div className={styles.left}>
          <div style={{ margin: 30, overflow: 'hidden' }}>
            <Button onClick={renderData} type="primary">
              点击点击
            </Button>
          </div>
        </div>
        <div className={styles.right} ref={rootRef} />
      </div>
    </div>
  )
}

export default App
