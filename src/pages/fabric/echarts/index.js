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
      <div className={styles.header}>
        <Button onClick={renderData} type="primary">
          点击点击
        </Button>
      </div>
      <div className={styles.content} ref={rootRef} />
    </div>
  )
}

export default App
