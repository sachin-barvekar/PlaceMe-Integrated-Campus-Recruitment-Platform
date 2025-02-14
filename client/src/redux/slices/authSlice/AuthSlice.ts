import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  user: string | null;
  role: 'admin' | 'student' | 'recruiter' | null;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  role: null,
  loading: false
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state) {
      return { ...state, loading: true }
    },
    loginSuccess(
      state,
      action: PayloadAction<{
        user: string,
        role: 'admin' | 'student' | 'recruiter' | null
      }>
    ) {
      return {
        ...state,
        user: action.payload.user,
        role: action.payload.role,
        loading: false
      }
    },
    loginFailure(state) {
      return { ...state, loading: false }
    },
    logout(state) {
      return { ...state, user: null, role: null, loading: false }
    }
  }
})

export const { loginStart, loginSuccess, loginFailure, logout } =
  authSlice.actions
export default authSlice
