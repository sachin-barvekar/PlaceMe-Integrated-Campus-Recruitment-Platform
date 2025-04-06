import { ReactElement } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import useAuth from '../hooks/Auth'

type AuthGuardProps = {
  children: ReactElement
}
function AuthGuard({ children }: Readonly<AuthGuardProps>) {
  const { token } = useAuth()

  const location = useLocation()
  if (!token) {
    return <Navigate to='/auth' state={{ from: location }} />
  }
  return children
}
export default AuthGuard
