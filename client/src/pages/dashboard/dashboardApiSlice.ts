import dashboardApi from 'api/dashboardApi'
import { StudentQueriesResponse } from './types'

const dashboardApiSlice = dashboardApi.injectEndpoints({
  endpoints: (build) => ({
    getDashboardData: build.query<StudentQueriesResponse, void>({
      query: (dashboardParams) => ({
        url: '/student-count',
        method: 'GET',
        params: dashboardParams
      }),
      providesTags: ['dashboard-data']
    })
  })
})

export const { useGetDashboardDataQuery } = dashboardApiSlice
