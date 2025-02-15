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
  setRole: (role: string | null) => void;
}

const useAuth = (): AuthContextType => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  )
  const [role, setRole] = useState<string | null>(
    localStorage.getItem('role') || null
  )

  useEffect(() => {
    auth.setPersistence(browserLocalPersistence).catch((error) => {
      // eslint-disable-next-line
      console.error('Persistence setting failed:', error)
    })

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true)
      if (currentUser) {
        // eslint-disable-next-line
        const token = await currentUser.getIdToken()
        setUser(currentUser)
        setToken(token)
        localStorage.setItem('token', token)
        setRole(localStorage.getItem('role') ?? null)
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
    setRole(null)
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    setLoading(false)
  }

  const login = async () => {
    try {
      if (!role) {
        notifyError('Please select a role before logging in.')
        return
      }

      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      // eslint-disable-next-line
      const token = await result.user.getIdToken()
      setUser(result.user)
      setToken(token)
      localStorage.setItem('token', token)
      localStorage.setItem('role', role)
      notifySuccess('Login successful.')
    } catch (error) {
      notifyError('Login failed')
    } finally {
      setLoading(false)
    }
  }

  const logout = (() => {
    let hasLoggedOut = false
    return async () => {
      if (hasLoggedOut) {
        return
      }
      hasLoggedOut = true
      try {
        await signOut(auth)
        clearAuthState()
        setUser(null)
        setRole(null)
        localStorage.clear()

        notifySuccess('Logout successful')
      } catch (error) {
        notifyError('Logout failed')
      }
    }
  })()

  return {
    user,
    loading,
    login,
    logout,
    token,
    isLoggedIn: !!token,
    role,
    setRole: (newRole) => {
      setRole(newRole)
      if (newRole) {
        localStorage.setItem('role', newRole)
      } else {
        localStorage.removeItem('role')
      }
    }
  }
}

export default useAuth
