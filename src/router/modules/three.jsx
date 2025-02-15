import Loadable from '@loadable/component'

import Loading from '@/components/loading'

const ThreeCube1 = Loadable(() => import('@/pages/three/cube1'), {
  fallback: <Loading />,
})
const ThreeCube2 = Loadable(() => import('@/pages/three/cube2'), {
  fallback: <Loading />,
})
const ThreeMap = Loadable(() => import('@/pages/three/map'), {
  fallback: <Loading />,
})
const ThreeRotate = Loadable(() => import('@/pages/three/旋转'), {
  fallback: <Loading />,
})

const routes = [
  {
    path: '/three/cube1',
    element: <ThreeCube1 />,
  },
  {
    path: '/three/cube2',
    element: <ThreeCube2 />,
  },
  {
    path: '/three/map',
    element: <ThreeMap />,
  },
  {
    path: '/three/rotate',
    element: <ThreeRotate />,
  },
]

export default routes
