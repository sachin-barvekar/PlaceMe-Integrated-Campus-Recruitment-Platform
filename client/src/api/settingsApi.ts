// src/api/settingsApi.ts

import { createApi } from '@reduxjs/toolkit/query/react'
import axiosBaseQuery from './axiosBaseQuery'
import { baseUrl } from './axiosInstance'

const settingsApi = createApi({
  baseQuery: axiosBaseQuery({
    baseUrl,
  }),
  reducerPath: 'settingsApi',
  tagTypes: ['skill-mapping'],
  endpoints: () => ({}),
})

export default settingsApi
