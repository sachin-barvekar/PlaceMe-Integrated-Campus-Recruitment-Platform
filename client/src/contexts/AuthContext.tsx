import React, { createContext, ReactNode } from 'react'
import { User } from 'firebase/auth'
import useFCM from '../hooks/useFCM'
import useAuth from '../hooks/Auth'

interface AuthContextType {
  user: User | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dbUser: any | null
  loading: boolean
  login: () => Promise<void>
  logout: () => Promise<void>
  role: string | null
  setRole: (role: string | null) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const auth = useAuth()
  useFCM()

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export default AuthProvider
export { AuthContext }
