import ReactDOM from 'react-dom/client'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import dayjs from 'dayjs'

import RouterComponent from '@/router/routerComponent'

import 'dayjs/locale/zh-cn'
import '@/less/index.less'

import 'antd/dist/reset.css'

dayjs.locale('zh-cn')

const rootTips = document.getElementById('root-tips')
const styles = window.getComputedStyle(rootTips.childNodes[0])
if (styles.color === 'rgb(255, 0, 0)') {
  rootTips.innerHTML = '您当前浏览器版本过低，请升级浏览器或者更换浏览器访问。'
} else {
  rootTips.parentNode.removeChild(rootTips)
  ReactDOM.createRoot(document.getElementById('root')).render(
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#00A7FF',
        },
      }}
    >
      <RouterComponent />
    </ConfigProvider>
  )
}
