import Loadable from '@loadable/component'

import Loading from '@/components/loading'

const Three = Loadable(() => import('@/pages/three'), {
  fallback: <Loading />,
})
const ThreeCube1 = Loadable(() => import('@/pages/three/cube1'), {
  fallback: <Loading />,
})
const ThreeCube2 = Loadable(() => import('@/pages/three/cube2'), {
  fallback: <Loading />,
})
const ThreeMap = Loadable(() => import('@/pages/three/map'), {
  fallback: <Loading />,
})
const ThreeMap1 = Loadable(() => import('@/pages/three/map1'), {
  fallback: <Loading />,
})
const ThreeCube3 = Loadable(() => import('@/pages/three/cube3'), {
  fallback: <Loading />,
})
const ThreeLine1 = Loadable(() => import('@/pages/three/line1'), {
  fallback: <Loading />,
})
const ThreeLight = Loadable(() => import('@/pages/three/light'), {
  fallback: <Loading />,
})
const routes = [
  {
    path: '/three',
    element: <Three />,
  },
  {
    path: '/three/map',
    element: <ThreeMap />,
  },
  {
    path: '/three/map1',
    element: <ThreeMap1 />,
  },
  {
    path: '/three/cube1',
    element: <ThreeCube1 />,
  },
  {
    path: '/three/cube2',
    element: <ThreeCube2 />,
  },
  {
    path: '/three/cube3',
    element: <ThreeCube3 />,
  },
  {
    path: '/three/line1',
    element: <ThreeLine1 />,
  },
  {
    path: '/three/light',
    element: <ThreeLight />,
  },
]

export default routes
