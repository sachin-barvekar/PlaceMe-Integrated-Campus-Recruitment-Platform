import { useState, useEffect } from 'react'
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  browserLocalPersistence,
  User
} from 'firebase/auth'
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore'
import { notifyError, notifySuccess } from 'utils'
import { auth } from '../config/firebase'

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  role: string | null;
  token: string | null;
  isLoggedIn: boolean;
  loadingRole: boolean;
}

const useAuth = (): AuthContextType => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [role, setRole] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  )
  const [loadingRole, setLoadingRole] = useState<boolean>(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true)
      if (currentUser) {
        await authenticateUser(currentUser)
      } else {
        clearAuthState()
      }
      setLoading(false)
    })

    auth.setPersistence(browserLocalPersistence).catch(() => {
      setLoading(false)
    })

    return () => unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const clearAuthState = () => {
    setUser(null)
    setRole(null)
    setToken(null)
    localStorage.clear()
    setLoading(false)
    setLoadingRole(false)
  }

  const authenticateUser = async (currentUser: User) => {
    try {
      await syncUserWithFirestore(currentUser)
      const accessToken = await currentUser.getIdToken(true)
      localStorage.setItem('token', accessToken)
      setToken(accessToken)
      setUser(currentUser)
      setLoading(false)
    } catch (error) {
      notifyError('Login failed')
    }
  }

  const syncUserWithFirestore = async (currentUser: User) => {
    const db = getFirestore()
    const userDocRef = doc(db, 'users', currentUser.uid)
    const userDoc = await getDoc(userDocRef)

    const providerData = currentUser.providerData[0]
    const defaultUserDetails = {
      email: providerData?.email || '',
      fullName: providerData?.displayName || '',
      mobile: providerData?.phoneNumber || null,
      photoURL: providerData?.photoURL || null,
      providerId: providerData?.providerId || '',
      type: ['ABA']
    }

    if (!userDoc.exists()) {
      await setDoc(userDocRef, defaultUserDetails)
      return defaultUserDetails
    }
    const existingUserDetails = userDoc.data() || {}
    if (
      !existingUserDetails.type ||
      !Array.isArray(existingUserDetails.type) ||
      !existingUserDetails.type.includes('ABA')
    ) {
      existingUserDetails.type = Array.isArray(existingUserDetails.type)
        ? [...existingUserDetails.type, 'ABA']
        : ['ABA']
      await setDoc(userDocRef, existingUserDetails, { merge: true })
    }
    return existingUserDetails
  }

  const login = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      await authenticateUser(result.user)
      notifySuccess('Login successful.')
      setLoading(false)
    } catch (error) {
      notifyError('Login failed')
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

  const isLoggedIn = !!token

  return {
    user,
    loading,
    login,
    logout,
    role,
    token,
    isLoggedIn,
    loadingRole
  }
}

export default useAuth
