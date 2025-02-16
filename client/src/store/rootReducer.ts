import { combineSlices } from '@reduxjs/toolkit'
import loginApi from 'api/loginApi'
import profileApi from 'api/profileApi'

const rootReducer = combineSlices(loginApi, profileApi)

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer
