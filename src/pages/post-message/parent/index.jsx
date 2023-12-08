import { useEffect, useRef } from 'react'

import styles from './index.module.less'

const Component = () => {
  const iframeRef = useRef(null)

  // 发消息
  const handleLoad = () => {
    setTimeout(() => {
      iframeRef.current.contentWindow.postMessage(JSON.stringify({ data: '我是父窗口，我加载了iframe' }), '*')
    }, 0)
  }

  useEffect(() => {
    const handler = function (e) {
      try {
        const data = JSON.parse(e.data)
        console.log('我是父窗口我接收到数据：', data)
        if (data.type === 'show') {
          console.log(data.type)
        }
      } catch (error) {
        console.log(error)
      }
    }
    // 接收消息
    window.addEventListener('message', handler)
    return () => {
      window.removeEventListener('message', handler)
    }
  }, [])

  useEffect(() => {
    const visibleToggle = () => {
      if (document.hidden) {
        console.log('hide')
      } else {
        console.log('show')
      }
    }
    document.addEventListener('visibilitychange', visibleToggle)
    return () => {
      document.removeEventListener('visibilitychange', visibleToggle)
    }
  }, [])

  return (
    <iframe
      className={styles.iframe}
      title="sic"
      src="https://zhuanwan.github.io/web/post-message/child"
      ref={iframeRef}
      onLoad={handleLoad}
    />
  )
}

export default Component
