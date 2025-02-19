import { combineSlices } from '@reduxjs/toolkit'
import loginApi from 'api/loginApi'
import PlacementApi from 'api/placementApi'
import profileApi from 'api/profileApi'
import studentApi from 'api/studentApi'

const rootReducer = combineSlices(
  loginApi,
  profileApi,
  studentApi,
  PlacementApi
)

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer
