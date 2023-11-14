import { useEffect } from 'react'
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom'

const Component = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    if (searchParams.has('ghpage')) {
      const ghpage = decodeURIComponent(searchParams.get('ghpage'))
      navigate(ghpage)
    }
  }, [])

  return <Outlet />
}

export default Component
