import axios, { AxiosError } from 'axios'

export const baseUrl = ''

const getAccessToken = () => {
  return localStorage.getItem('token')
}

const axiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getAccessToken()}`
  }
})

axiosInstance.interceptors.response.use(
  (response: any) => response,
  async (error: AxiosError) => {
    const status = error.response?.status
    if (status === 403) {
      // eslint-disable-next-line
      console.log('Access forbidden:', status)
    }
    throw error
  }
)

export default axiosInstance
