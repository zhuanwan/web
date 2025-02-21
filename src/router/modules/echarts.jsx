import Loadable from '@loadable/component'

import Loading from '@/components/loading'

const Echarts = Loadable(() => import('@/pages/echarts'), {
  fallback: <Loading />,
})
const EchartsBase = Loadable(() => import('@/pages/echarts/base'), {
  fallback: <Loading />,
})
const EchartsMapHeat = Loadable(() => import('@/pages/echarts/map-heat'), {
  fallback: <Loading />,
})

const routes = [
  {
    path: '/echarts',
    element: <Echarts />,
  },
  {
    path: '/echarts/base',
    element: <EchartsBase />,
  },
  {
    path: '/echarts/map-heat',
    element: <EchartsMapHeat />,
  },
]

export default routes
