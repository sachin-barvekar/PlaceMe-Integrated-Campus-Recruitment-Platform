import { createApi } from '@reduxjs/toolkit/query/react'
import axiosBaseQuery from './axiosBaseQuery'
import { baseUrl } from './axiosInstance'

const applyJobApi = createApi({
  baseQuery: axiosBaseQuery({
    baseUrl
  }),
  reducerPath: 'applyJobApi',
  tagTypes: ['apply-job'],
  endpoints: () => ({})
})

export default applyJobApi
