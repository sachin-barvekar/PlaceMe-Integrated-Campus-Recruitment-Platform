import { useState, useEffect, useCallback, useRef } from 'react'
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  browserLocalPersistence,
  User
} from 'firebase/auth'
import { useLoginMutation } from 'pages/login/loginApiSlice'
import { isTokenExpired, notifyError, notifySuccess } from 'utils'
import { auth } from '../config/firebase'

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  token: string | null;
  refreshToken: () => void;
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
  const [lastActivityTime, setLastActivityTime] = useState<number>(Date.now())
  const [role, setRole] = useState<string | null>(
    localStorage.getItem('role') || null
  )
  const hasLoggedOutRef = useRef(false)
  const [loginMutation] = useLoginMutation()

  const login = async () => {
    if (!role) {
      notifyError('Please select a role before logging in.')
      return
    }

    if (loading) return
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const accessToken = await result.user.getIdToken()

      const loginData = {
        email: result.user.email ?? '',
        name: result.user.displayName ?? '',
        role,
        firebaseUid: result?.user?.uid
      }
      const res = await loginMutation(loginData)
      if (res && res.data) {
        setUser(result?.user)
        setToken(accessToken)
        localStorage.setItem('token', accessToken)
        localStorage.setItem('role', role)
        notifySuccess('Login successful.')
      } else {
        clearAuthState()
      }
    } catch (error) {
      notifyError('Login failed')
    } finally {
      setLoading(false)
    }
  }

  const logout = useCallback(async () => {
    if (hasLoggedOutRef.current) return
    hasLoggedOutRef.current = true // Immediately prevent multiple calls

    try {
      await signOut(auth)
      clearAuthState()
      localStorage.clear()
      notifySuccess('Logout successful')
    } catch (error) {
      notifyError('Logout failed')
    }
  }, [])

  const refreshToken = useCallback(async () => {
    if (!auth.currentUser) return
    try {
      const refreshedToken = await auth.currentUser.getIdToken(true)
      if (isTokenExpired(refreshedToken)) {
        notifyError('Session expired, please log in again')
        logout()
      } else {
        localStorage.setItem('token', refreshedToken)
        setToken(refreshedToken)
      }
    } catch (error) {
      // eslint-disable-next-line
      console.error('Error refreshing token:', error)
      notifyError('Error refreshing token')
      logout()
    }
  }, [logout])

  useEffect(() => {
    const checkInactivity = () => {
      const currentTime = Date.now()
      const timeSinceLastAction = currentTime - lastActivityTime

      if (timeSinceLastAction >= 60 * 60 * 1000 && token) {
        notifyError('Session expired due to inactivity.')
        logout()
      } else if (
        timeSinceLastAction >= 30 * 60 * 1000 &&
        timeSinceLastAction < 60 * 60 * 1000 &&
        token &&
        !isTokenExpired(token)
      ) {
        refreshToken()
      }
    }

    const interval = setInterval(checkInactivity, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [lastActivityTime, token, logout, refreshToken])

  useEffect(() => {
    let debounceTimer: NodeJS.Timeout

    const resetTimer = () => {
      clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => setLastActivityTime(Date.now()), 500)
    }

    const events = ['mousemove', 'keydown', 'click', 'scroll']
    events.forEach((event) => window.addEventListener(event, resetTimer))

    return () => {
      clearTimeout(debounceTimer)
      events.forEach((event) => window.removeEventListener(event, resetTimer))
    }
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true)
      if (currentUser) {
        const userToken = await currentUser.getIdToken(true)
        if (isTokenExpired(userToken)) {
          notifyError('Session expired, please log in again')
          logout()
        } else {
          localStorage.setItem('token', userToken)
          setToken(userToken)
          setUser(currentUser)
        }
      } else {
        setUser(null)
        localStorage.clear()
      }
      setLoading(false)
    })

    auth.setPersistence(browserLocalPersistence).catch((error) => {
      // eslint-disable-next-line
      console.error('Persistence failed:', error)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [logout])

  useEffect(() => {
    if (user) {
      hasLoggedOutRef.current = false
    }
  }, [user])

  const clearAuthState = () => {
    setUser(null)
    setToken(null)
    setRole(null)
    setLoading(false)
    localStorage.clear()
  }

  return {
    user,
    loading,
    login,
    logout,
    token,
    isLoggedIn: !!token,
    role,
    refreshToken,
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
