import { useState, useEffect } from 'react'
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  browserLocalPersistence,
  User
} from 'firebase/auth'
import { notifyError, notifySuccess } from 'utils'
import { auth } from '../config/firebase'

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  token: string | null;
  isLoggedIn: boolean;
  role: string | null;
}

const useAuth = (): AuthContextType => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  )
  const [role, setRole] = useState<string | null>('admin')

  useEffect(() => {
    auth.setPersistence(browserLocalPersistence).catch((error) => {
      console.error('Persistence setting failed:', error)
    })

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true)
      if (currentUser) {
        const token = await currentUser.getIdToken()
        setUser(currentUser)
        setToken(token)
        localStorage.setItem('token', token)
      } else {
        clearAuthState()
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const clearAuthState = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    setLoading(false)
  }

  const login = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const token = await result.user.getIdToken()
      setUser(result.user)
      setToken(token)
      localStorage.setItem('token', token)
      notifySuccess('Login successful.')
    } catch (error) {
      notifyError('Login failed')
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      clearAuthState()
      notifySuccess('Logout successful')
    } catch (error) {
      notifyError('Logout failed')
    }
  }

  const isLoggedIn = !!token

  return {
    user,
    loading,
    login,
    logout,
    token,
    isLoggedIn,
    role
  }
}

export default useAuth
