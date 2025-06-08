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

export type PlacementScoreData = {
  placementScore: number
  role: string
  reason: [string]
  suggestions: [string]
  skills: [string]
}
