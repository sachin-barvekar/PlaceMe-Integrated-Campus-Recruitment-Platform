import { isAxiosError } from 'axios'
import axiosInstance from './axiosInstance'

type AxiosBaseQueryProps = {
  baseUrl: string
}

type AxiosInstanceProps = {
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  data?: any,
  params?: any,
  headers?: any
}

export interface IErrorResponse<T> {
  status: number | undefined;
  data: T;
}

const axiosBaseQuery =
  <T>(
    { baseUrl }: AxiosBaseQueryProps = {
      baseUrl: process.env.REACT_APP_BASE_URL ?? ''
    }
  ) =>
  async ({ url, method, data, params, headers }: AxiosInstanceProps) => {
    try {
      const result = await axiosInstance({
        url: `${baseUrl}${url}`,
        method,
        data,
        params,
        headers
      })
      return result
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        return {
          error: {
            status: error.response?.status,
            data: error.response?.data
          } as IErrorResponse<T>
        }
      }
      return Promise.reject(new Error('Unexpected error occurred'))
    }
  }

export default axiosBaseQuery
