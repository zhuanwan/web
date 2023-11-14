import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'

const Component = ({ to }) => {
  const navigate = useNavigate()
  useEffect(() => {
    navigate(to)
  }, [])
  return null
}

Component.propTypes = {
  to: PropTypes.string.isRequired,
}

export default Component
