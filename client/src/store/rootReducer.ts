import { combineSlices } from '@reduxjs/toolkit'
import loginApi from '../api/loginApi'
import PlacementApi from '../api/placementApi'
import profileApi from '../api/profileApi'
import dashboardApi from '../api/dashboardApi'
import studentApi from '../api/studentApi'
import recruiterApi from '../api/recruiterApi'
import jobApi from '../api/jobApi'
import settingsApi from '../api/settingsApi'

const rootReducer = combineSlices(
  loginApi,
  profileApi,
  studentApi,
  PlacementApi,
  dashboardApi,
  recruiterApi,
  jobApi,
  settingsApi,
)

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer
