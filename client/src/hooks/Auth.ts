import { useState, useEffect } from 'react'
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  browserLocalPersistence,
  User
} from 'firebase/auth'
import { notifySuccess, notifyError } from '../utils'
import { auth } from '../config/firebase'

const adminEmails = process.env.REACT_APP_ADMIN_EMAILS?.split(',') || []
const studentsEmails = process.env.REACT_APP_STUDENTS_EMAILS?.split(',') || []
const recruitersEmails =
  process.env.REACT_APP_RECRUITERS_EMAILS?.split(',') || []

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  role: 'admin' | 'student' | 'recruiter' | null;
}

const useAuth = (): AuthContextType => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [role, setRole] = useState<'admin' | 'student' | 'recruiter' | null>(
    null
  )

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setLoading(true)
      if (currentUser?.email) {
        const email = currentUser?.email

        if (adminEmails.includes(email)) {
          setRole('admin')
        } else if (studentsEmails.includes(email)) {
          setRole('student')
        } else if (recruitersEmails.includes(email)) {
          setRole('recruiter')
        } else {
          setRole(null)
          signOut(auth)
          localStorage.clear()
        }
        setUser(currentUser)
        setLoading(false)
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
  }, [])

  const login = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const userData: User = result.user
      const email = userData.email ?? ''

      if (adminEmails.includes(email)) {
        setRole('admin')
        localStorage.setItem('role', 'admin')
      } else if (studentsEmails.includes(email)) {
        setRole('student')
        localStorage.setItem('role', 'student')
      } else if (recruitersEmails.includes(email)) {
        setRole('recruiter')
        localStorage.setItem('role', 'recruiter')
      } else {
        notifyError('Unauthorized email, login failed')
        await signOut(auth)
        localStorage.clear()
        return
      }
      notifySuccess('Login Success')
      setUser(userData)
      const accessToken = await userData.getIdToken()
      localStorage.setItem('token', accessToken)
    } catch (error) {
      notifyError('Login failed')
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      setUser(null)
      setRole(null)
      localStorage.clear()
    } catch (error) {
      notifyError('Logout failed')
    }
  }

  return {
    user,
    loading,
    login,
    logout,
    role
  }
}

export default useAuth
