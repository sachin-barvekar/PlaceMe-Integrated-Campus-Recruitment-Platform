import loginApi from '../../api/loginApi'
import { LoginRequest } from './types'

const loginApiSlice = loginApi.injectEndpoints({
  endpoints: build => ({
    login: build.mutation<void, LoginRequest>({
      query: loginData => ({
        url: '/login',
        method: 'POST',
        data: loginData,
      }),
      invalidatesTags: ['login'],
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fetchNotifications: build.query<any, void>({
      query: () => ({
        url: '/notifications',
        method: 'GET',
      }),
      providesTags: ['notifications'],
    }),
  }),
})

export const { useLoginMutation, useFetchNotificationsQuery } = loginApiSlice
