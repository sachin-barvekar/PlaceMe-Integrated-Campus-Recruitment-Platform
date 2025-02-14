import loginApi from 'api/loginApi'
import { LoginRequest } from './types'

const loginApiSlice = loginApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<
        void,
        LoginRequest
    >({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        data: credentials
      }),
      invalidatesTags: ['login']
    })
  })
})

export const { useLoginMutation } = loginApiSlice
