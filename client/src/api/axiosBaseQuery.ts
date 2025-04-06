/* eslint-disable @typescript-eslint/no-explicit-any */
import { isAxiosError } from 'axios'
import { notifyError } from '../utils'
import axiosInstance, { getAccessToken } from './axiosInstance'

type AxiosBaseQueryProps = {
  baseUrl?: string
}

type AxiosInstanceProps = {
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  data?: any
  params?: any
  headers?: any
  responseType?: 'json' | 'blob' | 'text'
  includeAuth?: boolean
}

export interface IErrorResponse<T> {
  status: number | undefined
  data: T | null
}

const axiosBaseQuery =
  <T>(
    { baseUrl }: AxiosBaseQueryProps = {
      baseUrl: import.meta.env.VITE_BASE_URL ?? '',
    },
  ) =>
  async ({
    url,
    method,
    data,
    params,
    headers = {},
    responseType = 'json',
    includeAuth = true,
  }: AxiosInstanceProps) => {
    try {
      const result = await axiosInstance({
        url: `${baseUrl}${url}`,
        method,
        data,
        params,
        headers: {
          ...headers,
          Authorization: includeAuth ? `Bearer ${getAccessToken()}` : undefined,
        },
        responseType,
      })

      return { data: result.data }
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ?? 'An unexpected error occurred.'
        notifyError(errorMessage)
        return {
          error: {
            status: error.response?.status,
            data: error.response?.data || null,
          } as IErrorResponse<T>,
        }
      }
      return Promise.reject(new Error('Unexpected error occurred'))
    }
  }

export default axiosBaseQuery
