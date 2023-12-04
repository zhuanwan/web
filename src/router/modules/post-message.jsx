import Loadable from '@loadable/component'

import Loading from '@/components/loading'

const PostMessageParent = Loadable(() => import('@/pages/post-message/parent'), {
  fallback: <Loading />,
})
const PostMessageChild = Loadable(() => import('@/pages/post-message/child'), {
  fallback: <Loading />,
})

const routes = [
  {
    path: '/post-message/parent',
    element: <PostMessageParent />,
  },
  {
    path: '/post-message/child',
    element: <PostMessageChild />,
  },
]

export default routes
