import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import loginApi from '../api/loginApi'
import profileApi from '../api/profileApi'
import studentApi from '../api/studentApi'
import PlacementApi from '../api/placementApi'
import dashboardApi from '../api/dashboardApi'
import jobApi from '../api/jobApi'
import recruiterApi from '../api/recruiterApi'
import rootReducer, { RootState } from './rootReducer'

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(
      loginApi.middleware,
      profileApi.middleware,
      studentApi.middleware,
      PlacementApi.middleware,
      dashboardApi.middleware,
      recruiterApi.middleware,
      jobApi.middleware,
    ),
})

export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
export default store
