import { createApi } from '@reduxjs/toolkit/query/react'
import axiosBaseQuery from './axiosBaseQuery'
import { baseUrl } from './axiosInstance'

const whatsappApi = createApi({
  baseQuery: axiosBaseQuery({
    baseUrl,
  }),
  reducerPath: 'whatsappApi',
  tagTypes: ['whatsapp-config'],
  endpoints: () => ({}),
})

export default whatsappApi
