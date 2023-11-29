import Loadable from '@loadable/component'

import Loading from '@/components/loading'

const Fabric1 = Loadable(() => import('@/pages/fabric/元素操作/元素分组1'), {
  fallback: <Loading />,
})
const Fabric2 = Loadable(() => import('@/pages/fabric/元素操作/元素分组2'), {
  fallback: <Loading />,
})
const Fabric3 = Loadable(() => import('@/pages/fabric/元素操作/元素禁止事件'), {
  fallback: <Loading />,
})
const Fabric4 = Loadable(() => import('@/pages/fabric/元素操作/元素选中样式'), {
  fallback: <Loading />,
})

const routes = [
  {
    path: '/fabric/元素操作/元素分组1',
    element: <Fabric1 />,
  },
  {
    path: '/fabric/元素操作/元素分组2',
    element: <Fabric2 />,
  },
  {
    path: '/fabric/元素操作/元素禁止事件',
    element: <Fabric3 />,
  },
  {
    path: '/fabric/元素操作/元素选中样式',
    element: <Fabric4 />,
  },
]

export default routes
