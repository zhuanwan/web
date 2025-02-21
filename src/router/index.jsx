import Loadable from '@loadable/component'

import Loading from '@/components/loading'

import echarts from './modules/echarts'
import fabric from './modules/fabric'
import postMessage from './modules/post-message'
import three from './modules/three'

const NoMatch = Loadable(() => import('@/pages/404'), {
  fallback: <Loading />,
})
const Layout = Loadable(() => import('@/pages'), {
  fallback: <Loading />,
})

const routes = [
  {
    path: '/',
    element: <Layout />,
  },
  ...postMessage,
  ...echarts,
  ...fabric,
  ...three,
  { path: '*', element: <NoMatch /> },
]

export default routes
