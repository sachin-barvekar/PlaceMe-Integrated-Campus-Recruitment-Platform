import { createApi } from '@reduxjs/toolkit/query/react'
import axiosBaseQuery from './axiosBaseQuery'
import { baseUrl } from './axiosInstance'

const dashboardApi = createApi({
  baseQuery: axiosBaseQuery({
    baseUrl
  }),
  reducerPath: 'dashboard',
  tagTypes: ['dashboard-data'],
  endpoints: () => ({})
})

export default dashboardApi
