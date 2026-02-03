import Loadable from '@loadable/component'

import Loading from '@/components/loading'

const Other = Loadable(() => import('@/pages/other'), {
  fallback: <Loading />,
})
const OtherCalendar = Loadable(() => import('@/pages/other/calendar'), {
  fallback: <Loading />,
})
const OtherCalendar2 = Loadable(() => import('@/pages/other/calendar/index_big'), {
  fallback: <Loading />,
})


const routes = [
  {
    path: '/other',
    element: <Other />,
  },
  {
    path: '/other/calendar',
    element: <OtherCalendar />,
  },
   {
    path: '/other/calendar2',
    element: <OtherCalendar2 />,
  },
]

export default routes
