import { combineSlices } from '@reduxjs/toolkit'
import loginApi from 'api/loginApi'

const rootReducer = combineSlices(loginApi)

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer
