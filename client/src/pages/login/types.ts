export interface LoginRequest {
  email: string
  name: string
  role: string
}

export interface LoginResponse {
  success: boolean
  message: string
  user: {
    id: string
    name: string
    email: string
    role: string
  }
}
