import React, { createContext, ReactNode, useMemo } from 'react'
import { User } from 'firebase/auth'
import useAuth from '../hooks/Auth'

interface AuthContextType {
  user: User | null;
  role: string | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const auth = useAuth()

  const contextValue = useMemo(() => {
    return {
      user: auth.user,
      role: auth.role,
      loading: auth.loading,
      login: auth.login,
      logout: auth.logout
    }
  }, [auth])

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}

export default AuthProvider
export { AuthContext }
