// redux/actions/authActions.ts

import { AppDispatch } from '../../store/store'
import {
  loginStart,
  loginFailure,
  loginSuccess
} from '../../slices/authSlice/AuthSlice'

export const loginUser = (email: string) => async (dispatch: AppDispatch) => {
  dispatch(loginStart()) // Start the login process
  try {
    // Simulating backend API request and role determination
    let role: 'admin' | 'student' | 'recruiter' | null = null

    if (email === 'admin@example.com') {
      role = 'admin'
    } else if (email === 'student@example.com') {
      role = 'student'
    } else if (email === 'recruiter@example.com') {
      role = 'recruiter'
    } else {
      throw new Error('Invalid user credentials')
    }

    // Dispatch login success with user and role data
    dispatch(loginSuccess({ user: email, role }))
  } catch (error) {
    dispatch(loginFailure())
    throw error // Propagate error to the caller
  }
}
