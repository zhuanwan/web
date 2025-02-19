import { Link } from 'react-router-dom'

const links = [
  {
    path: '/three/cube1',
    name: '立方体',
  },
  {
    path: '/three/cube2',
    name: '立方体-鼠标点击查找相交点',
  },
  {
    path: '/three/cube3',
    name: '立方体-关键帧动画',
  },
  {
    path: '/three/line1',
    name: '线条',
  },
  {
    path: '/three/map',
    name: '深圳地图-场站-线条流动',
  },
  {
    path: '/three/light',
    name: '光源-阴影',
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
