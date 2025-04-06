import { createApi } from '@reduxjs/toolkit/query/react'
import axiosBaseQuery from './axiosBaseQuery'
import { baseUrl } from './axiosInstance'

const recruiterApi = createApi({
  baseQuery: axiosBaseQuery({
    baseUrl,
  }),
  reducerPath: 'recruiterApi',
  tagTypes: ['recruiter-list'],
  endpoints: () => ({}),
})

export default recruiterApi
