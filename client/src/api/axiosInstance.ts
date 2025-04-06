import axios, { AxiosError, AxiosHeaders } from 'axios'
import { notifySuccess } from '../utils'

export const baseUrl = import.meta.env.VITE_BASE_URL ?? ''

export const getAccessToken = () => {
  return localStorage.getItem('token')
}

const axiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosInstance.interceptors.request.use(
  config => {
    const token = getAccessToken()

    if (config.headers.Authorization !== false && token) {
      ;(config.headers as AxiosHeaders).set(
        'Authorization',
        token ? `Bearer ${token}` : '',
      )
    } else {
      delete config.headers.Authorization
    }

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  },
)

axiosInstance.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const status = error.response?.status

    if (status === 403) {
      localStorage.clear()
      notifySuccess('Logout Successful')
    }
    throw error
  },
)

export default axiosInstance
