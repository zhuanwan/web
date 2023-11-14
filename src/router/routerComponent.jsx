import { createBrowserRouter, RouterProvider, useRouteError } from 'react-router-dom'

import routes from './index'

function ErrorBoundary() {
  const error = useRouteError()

  return (
    <div>
      <h3>页面异常</h3>
      <div>{error.toString()}</div>
    </div>
  )
}

const getBrowserRouter = (r) => {
  const br = r.map((ele) => {
    const { path, element, children } = ele
    const p = { path, element }

    p.errorElement = <ErrorBoundary />

    if (children) {
      p.children = getBrowserRouter(children)
    }
    return p
  })
  return br
}

const router = createBrowserRouter(getBrowserRouter(routes))

const routerComponent = () => {
  return <RouterProvider router={router} fallbackElement={<p>Initial Load...</p>} />
}

export default routerComponent
