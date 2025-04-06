import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'

const Logout = () => {
  const authContext = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    const logout = async () => {
      try {
        if (authContext?.logout) {
          await authContext.logout()
        }
      } catch (error) {
        console.error('Logout failed', error)
      } finally {
        navigate('/auth')
      }
    }

    logout()
  }, [authContext, navigate])

  return null
}

export default Logout
