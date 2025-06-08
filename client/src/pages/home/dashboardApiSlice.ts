import dashboardApi from '../../api/dashboardApi'
import { PlacementScoreData, StudentQueriesResponse } from './types'

const dashboardApiSlice = dashboardApi.injectEndpoints({
  endpoints: build => ({
    getDashboardData: build.query<StudentQueriesResponse, void>({
      query: dashboardParams => ({
        url: '/student-count',
        method: 'GET',
        params: dashboardParams,
      }),
      providesTags: ['dashboard-data'],
    }),
    getRecruiterDashboardData: build.query<StudentQueriesResponse, void>({
      query: dashboardParams => ({
        url: '/recruiter-count',
        method: 'GET',
        params: dashboardParams,
      }),
      providesTags: ['dashboard-data'],
    }),
    getPlacementScore: build.query<PlacementScoreData, void>({
      query: () => ({
        url: `/placement-score`,
        method: 'GET',
      }),
      providesTags: ['placement-score'],
    }),
  }),
})

export const {
  useGetDashboardDataQuery,
  useGetRecruiterDashboardDataQuery,
  useGetPlacementScoreQuery,
} = dashboardApiSlice
