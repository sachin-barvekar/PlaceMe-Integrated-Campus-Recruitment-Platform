export type StudentQueriesResponse = {
  success: boolean
  totalStudents: number
  placedStudents: number
  placementPercentage: number
  totalRecruiters?: number
  recruiterCountPerYear?: { year: number; count: number }[]
  branchWisePlacement: { branch: string; count: number }[]
  highestPackageData: {
    year: number
    package: number
    company: string | null
  }[]
}
