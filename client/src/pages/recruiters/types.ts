export interface Recruiter {
  _id: string
  companyName: string
  aboutUs: string
  linkedIn: string
  profilePhoto: string
  address: string
  createdAt: string
  updatedAt: string
  companyWebsite: string
  name: string
  email: string
  search?: string
  recruiterId?: string
}

export interface RecruitersListParams {
  size?: number
  page?: number
  [key: string]: string | number | undefined
}
