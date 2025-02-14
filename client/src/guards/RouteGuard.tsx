import React, { ReactElement } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { Loader } from 'shared'
import useAuth from '../hooks/Auth'

interface RouteGuardProps {
  children: ReactElement;
  requiredRoles?: string[];
}

const RouteGuard: React.FC<RouteGuardProps> = ({ requiredRoles, children }) => {
  const { role, loadingRole } = useAuth()
  const location = useLocation()

  if (loadingRole) {
    return <Loader />
  }

  if (!role) {
    return <Navigate to="/auth" state={{ from: location }} replace />
  }

  if (requiredRoles && !requiredRoles.includes(role)) {
    return <Navigate to="/auth" replace />
  }

  return children
}

export default RouteGuard
