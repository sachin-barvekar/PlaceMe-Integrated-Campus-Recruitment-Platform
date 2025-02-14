import { useEffect, type ReactElement } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { updateAccessToken } from 'api/axiosInstance'
import useAuth from '../hooks/Auth'

type AuthGuardProps = {
  children: ReactElement
}
function AuthGuard({ children }: Readonly<AuthGuardProps>) {
  const { token, isLoggedIn } = useAuth()
  const location = useLocation()
  useEffect(() => {
    if (token) {
      updateAccessToken(token)
    }
  }, [token])
  if (!isLoggedIn) {
    return <Navigate to="/auth" state={{ from: location }} />
  }
  return children
}
export default AuthGuard
