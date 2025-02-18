import { createApi } from '@reduxjs/toolkit/query/react'
import axiosBaseQuery from './axiosBaseQuery'
import { baseUrl } from './axiosInstance'

const studentApi = createApi({
  baseQuery: axiosBaseQuery({
    baseUrl
  }),
  reducerPath: 'students',
  tagTypes: ['student-list'],
  endpoints: () => ({})
})

export default studentApi
