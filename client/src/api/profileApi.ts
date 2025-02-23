import { createApi } from '@reduxjs/toolkit/query/react'
import axiosBaseQuery from './axiosBaseQuery'
import { baseUrl } from './axiosInstance'

const profileApi = createApi({
  baseQuery: axiosBaseQuery({
    baseUrl
  }),
  reducerPath: 'profile',
  tagTypes: ['student-profile', 'admin-profile'],
  endpoints: () => ({})
})

export default profileApi
