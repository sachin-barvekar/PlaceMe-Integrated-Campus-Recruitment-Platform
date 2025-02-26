import { createApi } from '@reduxjs/toolkit/query/react'
import axiosBaseQuery from './axiosBaseQuery'
import { baseUrl } from './axiosInstance'

const profileApi = createApi({
  baseQuery: axiosBaseQuery({
    baseUrl
  }),
  reducerPath: 'profileApi',
  tagTypes: ['student-profile', 'admin-profile', 'recruiter-profile'],
  endpoints: () => ({})
})

export default profileApi
