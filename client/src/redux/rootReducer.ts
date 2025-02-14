import { combineReducers } from '@reduxjs/toolkit'
import { authReducer } from './reducer/authReducer/AuthReducer'

const rootReducer = combineReducers({
  auth: authReducer
})

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer
