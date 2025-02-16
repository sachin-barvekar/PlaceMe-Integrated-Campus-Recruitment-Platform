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
    })
  })
})

export const { useLoginMutation } = loginApiSlice
