import Loadable from '@loadable/component'

import Loading from '@/components/loading'

const FabricEchartsDemo = Loadable(() => import('@/pages/fabric/echarts'), {
  fallback: <Loading />,
})
const Fabric0 = Loadable(() => import('@/pages/fabric/元素操作/元素定位1'), {
  fallback: <Loading />,
})
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
const Fabric13 = Loadable(() => import('@/pages/fabric/基础图形/三角形1'), {
  fallback: <Loading />,
})
const Fabric14 = Loadable(() => import('@/pages/fabric/基础图形/圆形1'), {
  fallback: <Loading />,
})
const Fabric15 = Loadable(() => import('@/pages/fabric/基础图形/多边形1'), {
  fallback: <Loading />,
})
const Fabric16 = Loadable(() => import('@/pages/fabric/基础图形/折线1'), {
  fallback: <Loading />,
})
const Fabric17 = Loadable(() => import('@/pages/fabric/基础图形/椭圆1'), {
  fallback: <Loading />,
})
const Fabric18 = Loadable(() => import('@/pages/fabric/基础图形/直线1'), {
  fallback: <Loading />,
})
const Fabric21 = Loadable(() => import('@/pages/fabric/基础图形/矩形1'), {
  fallback: <Loading />,
})
const Fabric22 = Loadable(() => import('@/pages/fabric/基础图形/矩形2'), {
  fallback: <Loading />,
})
const Fabric23 = Loadable(() => import('@/pages/fabric/基础图形/矩形3'), {
  fallback: <Loading />,
})
const Fabric24 = Loadable(() => import('@/pages/fabric/基础图形/矩形4'), {
  fallback: <Loading />,
})
const Fabric25 = Loadable(() => import('@/pages/fabric/基础图形/矩形5'), {
  fallback: <Loading />,
})
const Fabric26 = Loadable(() => import('@/pages/fabric/基础图形/矩形6'), {
  fallback: <Loading />,
})
const Fabric27 = Loadable(() => import('@/pages/fabric/基础图形/矩形7'), {
  fallback: <Loading />,
})
const Fabric28 = Loadable(() => import('@/pages/fabric/基础图形/矩形8'), {
  fallback: <Loading />,
})
const Fabric29 = Loadable(() => import('@/pages/fabric/基础图形/矩形9'), {
  fallback: <Loading />,
})
const Fabric30 = Loadable(() => import('@/pages/fabric/基础图形/矩形10'), {
  fallback: <Loading />,
})
const Fabric31 = Loadable(() => import('@/pages/fabric/基础图形/路径1'), {
  fallback: <Loading />,
})

const Fabric40 = Loadable(() => import('@/pages/fabric/文本/可编辑文本1'), {
  fallback: <Loading />,
})
const Fabric41 = Loadable(() => import('@/pages/fabric/文本/多行文本1'), {
  fallback: <Loading />,
})
const Fabric42 = Loadable(() => import('@/pages/fabric/文本/多行文本2'), {
  fallback: <Loading />,
})
const Fabric43 = Loadable(() => import('@/pages/fabric/文本/多行文本3'), {
  fallback: <Loading />,
})
const Fabric44 = Loadable(() => import('@/pages/fabric/文本/文本1'), {
  fallback: <Loading />,
})
const Fabric45 = Loadable(() => import('@/pages/fabric/文本/文本2'), {
  fallback: <Loading />,
})
const Fabric46 = Loadable(() => import('@/pages/fabric/文本/文本3'), {
  fallback: <Loading />,
})
const Fabric47 = Loadable(() => import('@/pages/fabric/文本/文本省略1'), {
  fallback: <Loading />,
})
const Fabric48 = Loadable(() => import('@/pages/fabric/文本/文本边框1'), {
  fallback: <Loading />,
})

const routes = [
  {
    path: '/fabric/echarts-demo',
    element: <FabricEchartsDemo />,
  },
  {
    path: '/fabric/元素操作/元素定位1',
    element: <Fabric0 />,
  },
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
  {
    path: '/fabric/基础图形/三角形1',
    element: <Fabric13 />,
  },
  {
    path: '/fabric/基础图形/圆形1',
    element: <Fabric14 />,
  },
  {
    path: '/fabric/基础图形/多边形1',
    element: <Fabric15 />,
  },
  {
    path: '/fabric/基础图形/折线1',
    element: <Fabric16 />,
  },
  {
    path: '/fabric/基础图形/椭圆1',
    element: <Fabric17 />,
  },
  {
    path: '/fabric/基础图形/直线1',
    element: <Fabric18 />,
  },
  {
    path: '/fabric/基础图形/矩形1',
    element: <Fabric21 />,
  },
  {
    path: '/fabric/基础图形/矩形2',
    element: <Fabric22 />,
  },
  {
    path: '/fabric/基础图形/矩形3',
    element: <Fabric23 />,
  },
  {
    path: '/fabric/基础图形/矩形4',
    element: <Fabric24 />,
  },
  {
    path: '/fabric/基础图形/矩形5',
    element: <Fabric25 />,
  },
  {
    path: '/fabric/基础图形/矩形6',
    element: <Fabric26 />,
  },
  {
    path: '/fabric/基础图形/矩形7',
    element: <Fabric27 />,
  },
  {
    path: '/fabric/基础图形/矩形8',
    element: <Fabric28 />,
  },
  {
    path: '/fabric/基础图形/矩形9',
    element: <Fabric29 />,
  },
  {
    path: '/fabric/基础图形/矩形10',
    element: <Fabric30 />,
  },
  {
    path: '/fabric/基础图形/路径1',
    element: <Fabric31 />,
  },
  {
    path: '/fabric/文本/可编辑文本1',
    element: <Fabric40 />,
  },
  {
    path: '/fabric/文本/多行文本1',
    element: <Fabric41 />,
  },
  {
    path: '/fabric/文本/多行文本2',
    element: <Fabric42 />,
  },
  {
    path: '/fabric/文本/多行文本3',
    element: <Fabric43 />,
  },
  {
    path: '/fabric/文本/文本1',
    element: <Fabric44 />,
  },
  {
    path: '/fabric/文本/文本2',
    element: <Fabric45 />,
  },
  {
    path: '/fabric/文本/文本3',
    element: <Fabric46 />,
  },
  {
    path: '/fabric/文本/文本省略1',
    element: <Fabric47 />,
  },
  {
    path: '/fabric/文本/文本边框1',
    element: <Fabric48 />,
  },
]

export default routes
