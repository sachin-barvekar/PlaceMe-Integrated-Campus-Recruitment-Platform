/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback, useRef } from 'react'
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  browserLocalPersistence,
  User,
} from 'firebase/auth'
import { useLoginMutation } from '../pages/login/loginApiSlice'
import {
  notifyError,
  notifySuccess,
  requestNotificationPermission,
} from '../utils'
import { auth } from '../config/firebase'

interface AuthContextType {
  user: User | null
  dbUser: any | null
  loading: boolean
  login: () => Promise<void>
  logout: () => Promise<void>
  token: string | null
  isLoggedIn: boolean
  role: string | null
  setRole: (role: string | null) => void
}

const useAuth = (): AuthContextType => {
  const hasLoggedOutRef = useRef(false)
  const [user, setUser] = useState<User | null>(null)
  const [dbUser, setDBUser] = useState<any | null>(
    localStorage.getItem('dbUser'),
  )
  const [loading, setLoading] = useState<boolean>(true)
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token'),
  )
  const [role, setRole] = useState<string | null>(
    localStorage.getItem('role') || null,
  )
  const [loginMutation] = useLoginMutation()

  useEffect(() => {
    auth.setPersistence(browserLocalPersistence).catch(error => {
      console.error('Persistence setting failed:', error)
    })

    const unsubscribe = onAuthStateChanged(auth, async currentUser => {
      setLoading(true)
      if (currentUser) {
        setUser(currentUser)
      } else {
        clearAuthState()
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const clearAuthState = () => {
    setDBUser(null)
    setUser(null)
    setToken(null)
    setRole(null)
    setLoading(false)
    localStorage.clear()
  }

  const login = async () => {
    try {
      if (!role) {
        notifyError('Please select a role before logging in.')
        return
      }

      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const accessToken = await result.user.getIdToken()
      const fcmToken = await requestNotificationPermission()

      const loginData = {
        email: result.user.email ?? '',
        name: result.user.displayName ?? '',
        role,
        firebaseUid: result?.user?.uid,
        fcmToken,
      }
      const res = (await loginMutation(loginData)) as unknown as {
        data: { user: any }
      }
      if (res && res.data) {
        localStorage.setItem('dbUser', JSON.stringify(res.data.user))
        setUser(result.user)
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
    hasLoggedOutRef.current = true

    try {
      await signOut(auth)
      clearAuthState()
      localStorage.clear()
      notifySuccess('Logout successful')
    } catch (error) {
      notifyError('Logout failed')
    }
  }, [])

  useEffect(() => {
    if (user) {
      hasLoggedOutRef.current = false
    }
  }, [user])

  return {
    user,
    loading,
    login,
    logout,
    token,
    isLoggedIn: !!token,
    role,
    dbUser,
    setRole: newRole => {
      setRole(newRole)
      if (newRole) {
        localStorage.setItem('role', newRole)
      } else {
        localStorage.removeItem('role')
      }
    },
  }
}

export default useAuth
