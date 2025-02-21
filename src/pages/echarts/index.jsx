import { Link } from 'react-router-dom'

const links = [
  {
    path: '/echarts/base',
    name: '基础图形',
  },
  {
    path: '/echarts/map-heat',
    name: '热力图',
  },
]

const Component = () => {
  return (
    <div>
      {links.map((link) => (
        <div key={link.path}>
          <Link to={link.path}>{link.name}</Link>
        </div>
      ))}
    </div>
  )
}

export default Component
