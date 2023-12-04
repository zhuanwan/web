import Loadable from '@loadable/component'

import Loading from '@/components/loading'

import postMessage from './modules/post-message'
import fabric from './modules/fabric'

const NoMatch = Loadable(() => import('@/pages/404'), {
  fallback: <Loading />,
})
const Layout = Loadable(() => import('@/pages'), {
  fallback: <Loading />,
})
// 图标列表
const Charts = Loadable(() => import('@/pages/charts'), {
  fallback: <Loading />,
})

const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: 'charts',
        element: <Charts />,
        name: '图标列表',
      },
    ],
  },
  ...postMessage,
  ...fabric,
  { path: '*', element: <NoMatch /> },
]

export default routes
