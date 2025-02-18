import { combineSlices } from '@reduxjs/toolkit'
import loginApi from 'api/loginApi'
import profileApi from 'api/profileApi'
import studentApi from 'api/studentApi'

const rootReducer = combineSlices(loginApi, profileApi, studentApi)

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer
