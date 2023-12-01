import Loadable from '@loadable/component'

import Loading from '@/components/loading'

const Fabric1 = Loadable(() => import('@/pages/fabric/元素操作/元素分组1'), {
  fallback: <Loading />,
})
const Fabric2 = Loadable(() => import('@/pages/fabric/元素操作/元素禁止事件1'), {
  fallback: <Loading />,
})
const Fabric3 = Loadable(() => import('@/pages/fabric/元素操作/元素禁止事件2'), {
  fallback: <Loading />,
})
const Fabric4 = Loadable(() => import('@/pages/fabric/元素操作/元素选中样式1'), {
  fallback: <Loading />,
})
const Fabric5 = Loadable(() => import('@/pages/fabric/变换/变换1'), {
  fallback: <Loading />,
})
const Fabric6 = Loadable(() => import('@/pages/fabric/图片/图片1'), {
  fallback: <Loading />,
})
const Fabric7 = Loadable(() => import('@/pages/fabric/图片/图片2'), {
  fallback: <Loading />,
})
const Fabric8 = Loadable(() => import('@/pages/fabric/图片/图片3'), {
  fallback: <Loading />,
})
const Fabric9 = Loadable(() => import('@/pages/fabric/图片/图片4'), {
  fallback: <Loading />,
})
const Fabric10 = Loadable(() => import('@/pages/fabric/图片/背景图1'), {
  fallback: <Loading />,
})
const Fabric11 = Loadable(() => import('@/pages/fabric/图片/背景图2'), {
  fallback: <Loading />,
})
const Fabric12 = Loadable(() => import('@/pages/fabric/图片/背景图3'), {
  fallback: <Loading />,
})

const routes = [
  {
    path: '/fabric/元素操作/元素分组1',
    element: <Fabric1 />,
  },
  {
    path: '/fabric/元素操作/元素禁止事件1',
    element: <Fabric2 />,
  },
  {
    path: '/fabric/元素操作/元素禁止事件2',
    element: <Fabric3 />,
  },
  {
    path: '/fabric/元素操作/元素选中样式1',
    element: <Fabric4 />,
  },
  {
    path: '/fabric/变换/变换1',
    element: <Fabric5 />,
  },
  {
    path: '/fabric/图片/图片1',
    element: <Fabric6 />,
  },
  {
    path: '/fabric/图片/图片2',
    element: <Fabric7 />,
  },
  {
    path: '/fabric/图片/图片3',
    element: <Fabric8 />,
  },
  {
    path: '/fabric/图片/图片4',
    element: <Fabric9 />,
  },
  {
    path: '/fabric/图片/背景图1',
    element: <Fabric10 />,
  },
  {
    path: '/fabric/图片/背景图2',
    element: <Fabric11 />,
  },
  {
    path: '/fabric/图片/背景图3',
    element: <Fabric12 />,
  },
]

export default routes
