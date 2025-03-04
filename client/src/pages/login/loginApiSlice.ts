import loginApi from 'api/loginApi'
import { LoginRequest } from './types'

const loginApiSlice = loginApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<void, LoginRequest>({
      query: (loginData) => ({
        url: '/login',
        method: 'POST',
        data: loginData
      }),
      invalidatesTags: ['login']
    }),
    fetchNotifications: build.query<any, void>({
      query: () => ({
        url: '/notifications',
        method: 'GET'
      }),
      providesTags: ['notifications']
    })
  })
})

export const { useLoginMutation, useFetchNotificationsQuery } = loginApiSlice
