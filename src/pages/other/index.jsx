import { Link } from 'react-router-dom'

const links = [
  {
    path: '/other/calendar',
    name: '日历',
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
