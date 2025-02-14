import axios, { AxiosError, AxiosHeaders } from 'axios'

export const baseUrl = process.env.REACT_APP_BASE_URL ?? ''

export const getAccessToken = (): string | null => localStorage.getItem('token')
export const updateAccessToken = (token: string) => {
  axiosInstance.defaults.headers.Authorization = `Bearer ${token}`
}
const axiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json'
  }
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken()
    if (config.headers) {
      ;(config.headers as AxiosHeaders).set(
        'Authorization',
        token ? `Bearer ${token}` : ''
      )
    }

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status

    if (status === 403) {
      // eslint-disable-next-line
      console.error('Access forbidden:', status)
    } else if (status === 401) {
      // eslint-disable-next-line
      console.error('Unauthorized access:', status)
      // window.location.href = '/logout'
    } else {
      // eslint-disable-next-line
      console.error('Unexpected error:', error.message)
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
