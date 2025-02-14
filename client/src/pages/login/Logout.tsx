import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'

const Logout = () => {
  const authContext = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    const logout = async () => {
      if (authContext) {
        await authContext.logout()
        navigate('/')
      }
    }

    logout()
  }, [authContext, navigate])

  return null
}

export default Logout
